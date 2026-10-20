'use client'

/**
 * ҮЗЭГ — Үзэх хуудас: тусгай тоглуулагч (өөрийн control bar) + ижил төстэй контент
 *
 * Тоглуулагчийн боломжууд: play/pause, хайлтын мөр (buffered + кармин progress),
 * цагийн харуулалт, хурдны цэс (localStorage 'uzeg-speed'), дууны түвшин,
 * бүтэн дэлгэц. Үзэх явц ~3 секунд тутамд 'uzeg-progress'-д хадгалагдсаар байна.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  Gauge,
  Info,
  Loader2,
  Maximize,
  Minimize,
  Pause,
  Play,
  VideoOff,
  Volume2,
  VolumeX,
} from 'lucide-react'
import { useApi } from '@/lib/use-api'
import { navigate, DemoLink } from '@/lib/hash-router'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { EmptyState, LoadingState } from '@/components/shared/admin-kit'
import {
  BTN_ACCENT,
  MetaChip,
  RatingBadge,
  ContentRow,
  fontDisplay,
  useWatchProgress,
  SPEED_OPTIONS,
  usePlaybackSpeed,
  readPlaybackSpeed,
  type StreamTitle,
} from './shared'

// ─────────────────────────── Тоглуулагчийн туслагчид ───────────────────────────

const HIDE_DELAY_MS = 2500

/** Секунд → mm:ss (1 цагаас дээш үед h:mm:ss) */
function formatTime(sec: number): string {
  if (!Number.isFinite(sec) || sec <= 0) return '0:00'
  const total = Math.floor(sec)
  const s = String(total % 60).padStart(2, '0')
  const m = Math.floor(total / 60)
  if (m >= 60) return `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}:${s}`
  return `${m}:${s}`
}

/**
 * Үзэлт/үзсэн цагийн тоолол (демо) — контентын meta руу нэмж бичнэ.
 * GET → PATCH (soft-fail: алдаа гарвал чимээгүй орхино, тоглолтод нөлөөгүй).
 */
async function bumpTitleMeta(id: string, inc: { views?: number; watchSec?: number }) {
  try {
    const res = await fetch(`/api/stream-titles/${id}`)
    if (!res.ok) return
    const cur = (await res.json()) as { meta?: { views?: number; watchSeconds?: number } | null }
    const meta = cur.meta ?? {}
    const nextMeta = {
      ...meta,
      views: (meta.views ?? 0) + (inc.views ?? 0),
      watchSeconds: Math.round(((meta.watchSeconds ?? 0) + (inc.watchSec ?? 0)) * 10) / 10,
    }
    await fetch(`/api/stream-titles/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ meta: nextMeta }),
    })
  } catch {
    /* демо тоолол — алдааг орхино */
  }
}

/** Тоглуулагчийн товчны нийтлэг загвар — мобайлд 44px томшуулсан */
const CTRL_BTN =
  'flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white/90 transition-colors hover:bg-white/15 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF3D5A] motion-reduce:transition-none sm:h-10 sm:w-10'

type PlayerProps = {
  src: string
  posterGradient: string
  /** timeupdate бүрт дуудна — эцэг компонент 3 сек тутамд хадгална */
  onTimeUpdate: (v: HTMLVideoElement) => void
  /** зогсооход шууд хадгална */
  onPauseSave: (v: HTMLVideoElement) => void
  onError: () => void
}

/** ҮЗЭГ-ийн тусгай видео тоглуулагч — хар фон, кармин акцент, гироскоп ctrl bar */
function VideoPlayer({ src, posterGradient, onTimeUpdate, onPauseSave, onError }: PlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const shellRef = useRef<HTMLDivElement>(null)
  const seekRef = useRef<HTMLDivElement>(null)
  const speedWrapRef = useRef<HTMLDivElement>(null)
  const speedBtnRef = useRef<HTMLButtonElement>(null)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const dragTime = useRef(0)
  /** timer callback-д унших шуурхай утгууд (stale closure-оос сэргийлнэ) */
  const live = useRef({ playing: false, dragging: false, menuOpen: false, touch: false })

  const [playing, setPlaying] = useState(false)
  const [waiting, setWaiting] = useState(false)
  const [duration, setDuration] = useState(0)
  const [current, setCurrent] = useState(0)
  const [buffered, setBuffered] = useState(0)
  const [muted, setMuted] = useState(false)
  const [volume, setVolume] = useState(1)
  const [fs, setFs] = useState(false)
  const [visible, setVisible] = useState(true)
  const [dragging, setDragging] = useState(false)
  const [dragPreview, setDragPreview] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const { speed, setSpeed } = usePlaybackSpeed()

  useEffect(() => {
    live.current.playing = playing
    live.current.dragging = dragging
    live.current.menuOpen = menuOpen
  }, [playing, dragging, menuOpen])

  useEffect(() => {
    live.current.touch = window.matchMedia('(pointer: coarse)').matches
  }, [])

  // Хурдны сонголт видео элементэд түгжих
  useEffect(() => {
    const el = videoRef.current
    if (el) el.playbackRate = speed
  }, [speed])

  useEffect(() => {
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current)
    }
  }, [])

  // ── Control bar нээх/нуух ──
  const showControls = useCallback(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current)
    setVisible(true)
  }, [])

  const scheduleHide = useCallback(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current)
    hideTimer.current = setTimeout(() => {
      hideTimer.current = null
      const s = live.current
      if (s.dragging || s.menuOpen || s.touch || !s.playing) return
      // Гараар фокусласан элемент байвал нуухгүй (a11y)
      if (shellRef.current?.contains(document.activeElement) && document.activeElement?.matches(':focus-visible')) return
      setVisible(false)
    }, HIDE_DELAY_MS)
  }, [])

  const handleShellPointerMove = useCallback(() => {
    showControls()
    if (live.current.playing) scheduleHide()
  }, [showControls, scheduleHide])

  const handleShellPointerLeave = useCallback(() => {
    if (live.current.playing) scheduleHide()
  }, [scheduleHide])

  const handleShellFocus = useCallback(() => showControls(), [showControls])

  const handleShellBlur = useCallback(() => {
    if (live.current.playing) scheduleHide()
  }, [scheduleHide])

  // ── Тоглуулах/зогсоох ──
  const togglePlay = useCallback(() => {
    const el = videoRef.current
    if (!el) return
    if (el.paused) void el.play().catch(() => {})
    else el.pause()
  }, [])

  const handlePlay = useCallback(() => {
    setPlaying(true)
    scheduleHide()
  }, [scheduleHide])

  const handlePlaying = useCallback(() => {
    setPlaying(true)
    setWaiting(false)
  }, [])

  const handleWaiting = useCallback(() => setWaiting(true), [])

  const handlePause = useCallback(() => {
    setPlaying(false)
    setWaiting(false)
    showControls()
    const el = videoRef.current
    if (el) onPauseSave(el)
  }, [showControls, onPauseSave])

  // ── Медиа info ──
  const handleLoadedMetadata = useCallback(() => {
    const el = videoRef.current
    if (!el) return
    setDuration(el.duration || 0)
    el.playbackRate = readPlaybackSpeed()
  }, [])

  const handleVideoTimeUpdate = useCallback(() => {
    const el = videoRef.current
    if (!el) return
    setCurrent(el.currentTime)
    onTimeUpdate(el)
  }, [onTimeUpdate])

  const handleProgress = useCallback(() => {
    const el = videoRef.current
    if (!el || !el.duration || !el.buffered.length) return
    setBuffered(el.buffered.end(el.buffered.length - 1))
  }, [])

  const handleVolumeChange = useCallback(() => {
    const el = videoRef.current
    if (!el) return
    setMuted(el.muted)
    setVolume(el.volume)
  }, [])

  // ── Хайлтын мөр (click + drag) ──
  const seekFromClientX = useCallback(
    (clientX: number): number => {
      const bar = seekRef.current
      if (!bar || !duration) return 0
      const rect = bar.getBoundingClientRect()
      const pct = rect.width > 0 ? Math.min(1, Math.max(0, (clientX - rect.left) / rect.width)) : 0
      return pct * duration
    },
    [duration]
  )

  const handleSeekPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!duration) return
      e.preventDefault()
      const t = seekFromClientX(e.clientX)
      dragTime.current = t
      live.current.dragging = true
      setDragging(true)
      setDragPreview(t)
      showControls()
      try {
        e.currentTarget.setPointerCapture(e.pointerId)
      } catch {
        /* синтетик pointer — барууг барих шаардлагагүй */
      }
    },
    [duration, seekFromClientX, showControls]
  )

  const handleSeekPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!live.current.dragging) return
      const t = seekFromClientX(e.clientX)
      dragTime.current = t
      setDragPreview(t)
    },
    [seekFromClientX]
  )

  const handleSeekPointerUp = useCallback(() => {
    if (!live.current.dragging) return
    live.current.dragging = false
    const el = videoRef.current
    if (el) el.currentTime = dragTime.current
    setCurrent(dragTime.current)
    setDragging(false)
    if (live.current.playing) scheduleHide()
  }, [scheduleHide])

  const handleSeekKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const el = videoRef.current
      if (!el || !duration) return
      let t: number | null = null
      if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') t = el.currentTime - 5
      else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') t = el.currentTime + 5
      else if (e.key === 'Home') t = 0
      else if (e.key === 'End') t = duration
      if (t === null) return
      e.preventDefault()
      t = Math.min(duration, Math.max(0, t))
      el.currentTime = t
      setCurrent(t)
      showControls()
      if (live.current.playing) scheduleHide()
    },
    [duration, showControls, scheduleHide]
  )

  // ── Дуу ──
  const toggleMuted = useCallback(() => {
    const el = videoRef.current
    if (!el) return
    el.muted = !el.muted
    setMuted(el.muted)
  }, [])

  const changeVolume = useCallback((v: number) => {
    const el = videoRef.current
    if (!el) return
    el.volume = v
    el.muted = v === 0
    setVolume(v)
    setMuted(v === 0)
  }, [])

  const handleVolumeInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => changeVolume(Number(e.target.value)),
    [changeVolume]
  )

  // ── Хурдны цэс ──
  /** state + ref-ийг зэрэг шинэчилнэ (hide timer ба гадна дарилт шууд уншдаг) */
  const setMenu = useCallback((open: boolean) => {
    live.current.menuOpen = open
    setMenuOpen(open)
  }, [])

  const pickSpeed = useCallback(
    (v: number) => {
      setSpeed(v)
      setMenu(false)
      speedBtnRef.current?.focus()
    },
    [setSpeed, setMenu]
  )

  useEffect(() => {
    if (!menuOpen) return
    const onPointerDown = (e: PointerEvent) => {
      if (!speedWrapRef.current?.contains(e.target as Node)) setMenu(false)
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenu(false)
        speedBtnRef.current?.focus()
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [menuOpen, setMenu])

  // ── Бүтэн дэлгэц ──
  const toggleFullscreen = useCallback(() => {
    const shell = shellRef.current
    if (!shell) return
    if (document.fullscreenElement) void document.exitFullscreen().catch(() => {})
    else void shell.requestFullscreen().catch(() => {})
  }, [])

  useEffect(() => {
    const onFsChange = () => {
      setFs(document.fullscreenElement === shellRef.current)
      showControls()
      if (live.current.playing) scheduleHide()
    }
    document.addEventListener('fullscreenchange', onFsChange)
    return () => document.removeEventListener('fullscreenchange', onFsChange)
  }, [showControls, scheduleHide])

  // ── Хувь хүртэлх тооцоолол ──
  const displayTime = dragging ? dragPreview : current
  const playedPct = duration ? Math.min(100, (displayTime / duration) * 100) : 0
  const bufferedPct = duration ? Math.min(100, (buffered / duration) * 100) : 0

  return (
    <div
      ref={shellRef}
      className={cn(
        'group/player relative w-full overflow-hidden',
        fs ? 'h-full' : 'aspect-video',
        !visible && playing && 'cursor-none'
      )}
      style={{ background: posterGradient }}
      onPointerMove={handleShellPointerMove}
      onPointerLeave={handleShellPointerLeave}
      onFocus={handleShellFocus}
      onBlur={handleShellBlur}
    >
      <video
        ref={videoRef}
        src={src}
        playsInline
        preload="metadata"
        className="h-full w-full bg-transparent object-contain"
        onClick={togglePlay}
        onPlay={handlePlay}
        onPlaying={handlePlaying}
        onWaiting={handleWaiting}
        onPause={handlePause}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleVideoTimeUpdate}
        onProgress={handleProgress}
        onVolumeChange={handleVolumeChange}
        onError={onError}
      >
        Таны вэб хөтөч видео тоглуулахыг дэмждэггүй.
      </video>

      {/* Төвийн том тоглуулах товч — зогсоосон үед жигд давхаргат */}
      <button
        type="button"
        onClick={togglePlay}
        aria-label={current > 0 ? 'Үргэлжлүүлж тоглуулах' : 'Тоглуулах'}
        className={cn(
          'absolute left-1/2 top-1/2 z-10 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/55 backdrop-blur transition-all duration-300 hover:border-[#FF3D5A] hover:bg-[#FF3D5A]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF3D5A] motion-reduce:transition-none sm:h-20 sm:w-20',
          playing ? 'pointer-events-none scale-75 opacity-0' : 'scale-100 opacity-100'
        )}
      >
        <Play className="ml-1 h-7 w-7 fill-white text-white sm:h-8 sm:w-8" aria-hidden />
      </button>

      {/* Ачаалжийн спиннер */}
      {waiting && playing && (
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
          <Loader2 className="h-10 w-10 animate-spin text-[#FF3D5A] motion-reduce:animate-none" aria-hidden />
          <span className="sr-only">Ачааллаж байна…</span>
        </div>
      )}

      {/* Доод control bar */}
      <div
        className={cn(
          'absolute inset-x-0 bottom-0 z-10 flex flex-col gap-0.5 bg-gradient-to-t from-black/90 via-black/55 to-transparent px-2.5 pb-2 pt-8 transition-all duration-300 motion-reduce:transition-none sm:px-4',
          visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
        )}
      >
        {/* Хайлтын мөр */}
        <div
          ref={seekRef}
          role="slider"
          tabIndex={0}
          aria-label="Видеоны байрлал"
          aria-orientation="horizontal"
          aria-valuemin={0}
          aria-valuemax={Math.round(duration)}
          aria-valuenow={Math.round(displayTime)}
          aria-valuetext={`${formatTime(displayTime)} / ${formatTime(duration)}`}
          aria-disabled={duration === 0}
          onKeyDown={handleSeekKeyDown}
          onPointerDown={handleSeekPointerDown}
          onPointerMove={handleSeekPointerMove}
          onPointerUp={handleSeekPointerUp}
          onPointerCancel={handleSeekPointerUp}
          className="group/seek relative flex h-7 cursor-pointer touch-none select-none items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF3D5A]"
        >
          <div className="relative h-1.5 w-full rounded-full bg-white/20 transition-[height] duration-150 group-hover/seek:h-2.5 group-focus-visible/seek:h-2.5 motion-reduce:transition-none">
            <div aria-hidden className="absolute inset-y-0 left-0 rounded-full bg-white/25" style={{ width: `${bufferedPct}%` }} />
            <div
              aria-hidden
              className="absolute inset-y-0 left-0 rounded-full bg-[#FF3D5A] shadow-[0_0_8px_rgba(255,61,90,0.55)]"
              style={{ width: `${playedPct}%` }}
            />
            <div
              aria-hidden
              className={cn(
                'absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[#FF3D5A] shadow transition-opacity duration-150 motion-reduce:transition-none sm:h-4 sm:w-4',
                dragging ? 'opacity-100' : 'opacity-0 group-hover/seek:opacity-100 group-focus-visible/seek:opacity-100'
              )}
              style={{ left: `${playedPct}%` }}
            />
          </div>
          {dragging && (
            <div
              className="pointer-events-none absolute -top-6 -translate-x-1/2 rounded-md bg-black/85 px-1.5 py-0.5 text-[10px] font-semibold tabular-nums text-white"
              style={{ left: `${playedPct}%` }}
            >
              {formatTime(dragPreview)}
            </div>
          )}
        </div>

        {/* Товчны мөр */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          <button type="button" onClick={togglePlay} aria-label={playing ? 'Зогсоох' : 'Тоглуулах'} className={CTRL_BTN}>
            {playing ? (
              <Pause className="h-5 w-5 fill-current" aria-hidden />
            ) : (
              <Play className="h-5 w-5 fill-current" aria-hidden />
            )}
          </button>
          <span className="shrink-0 whitespace-nowrap text-[11px] font-medium tabular-nums text-white/90 sm:text-xs">
            {formatTime(displayTime)}
            <span className="text-white/45"> / {formatTime(duration)}</span>
          </span>

          <div className="ml-auto flex items-center gap-1 sm:gap-1.5">
            {/* Хурдны цэс */}
            <div ref={speedWrapRef} className="relative">
              <button
                ref={speedBtnRef}
                type="button"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                aria-label={`Тоглуулах хурд — одоо ${speed}×`}
                onClick={() => setMenu(!menuOpen)}
                className={cn(CTRL_BTN, 'w-auto gap-1 px-2')}
              >
                <Gauge className="h-[18px] w-[18px]" aria-hidden />
                <span className="hidden text-xs font-semibold sm:inline">Хурд</span>
                <span className="text-xs font-bold tabular-nums">{speed}×</span>
              </button>
              {menuOpen && (
                <div
                  role="menu"
                  aria-label="Тоглуулах хурд"
                  className="absolute bottom-full right-0 z-20 mb-2 min-w-32 overflow-hidden rounded-lg border border-white/10 bg-[#1A0B12]/95 py-1 shadow-[0_8px_30px_rgba(0,0,0,0.6)] backdrop-blur"
                >
                  {SPEED_OPTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      role="menuitemradio"
                      aria-checked={s === speed}
                      onClick={() => pickSpeed(s)}
                      className={cn(
                        'flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-xs transition-colors hover:bg-white/10 focus-visible:bg-white/10 focus-visible:outline-none motion-reduce:transition-none',
                        s === speed ? 'font-bold text-[#FF3D5A]' : 'font-medium text-[#F5E8EB]/85 hover:text-white'
                      )}
                    >
                      <span className="tabular-nums">{s}×</span>
                      {s === speed && <Check className="h-3.5 w-3.5" aria-hidden />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Дуу */}
            <button
              type="button"
              onClick={toggleMuted}
              aria-label={muted ? 'Дуутай болгох' : 'Дуугүй болгох'}
              aria-pressed={muted}
              className={CTRL_BTN}
            >
              {muted || volume === 0 ? (
                <VolumeX className="h-5 w-5" aria-hidden />
              ) : (
                <Volume2 className="h-5 w-5" aria-hidden />
              )}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={muted ? 0 : volume}
              onChange={handleVolumeInput}
              aria-label="Дууны хэмжээ"
              className="mr-1 hidden h-1 w-20 cursor-pointer accent-[#FF3D5A] sm:block"
            />

            {/* Бүтэн дэлгэц */}
            <button type="button" onClick={toggleFullscreen} aria-label={fs ? 'Гарах' : 'Бүтэн дэлгэц'} className={CTRL_BTN}>
              {fs ? <Minimize className="h-5 w-5" aria-hidden /> : <Maximize className="h-5 w-5" aria-hidden />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────── Үзэх хуудас ───────────────────────────

export function WatchPage({ id }: { id: string | null }) {
  const { data, loading } = useApi<StreamTitle>('stream-titles')
  const [videoError, setVideoError] = useState(false)
  const { save } = useWatchProgress()
  const lastSavedAt = useRef(0)
  /** админ тайланд: хуримтлагдсан үзсэн секунд (тухайн контентод) */
  const pendingSec = useRef(0)
  const lastFlushAt = useRef(0)

  // Контент солигдох хууримтлалыг цэвэрлэнэ
  useEffect(() => {
    pendingSec.current = 0
    lastFlushAt.current = 0
    lastSavedAt.current = 0
  }, [id])

  // Үзэлтийн тоолол — үзэх хуудас нээгдэхэд нэг удаа (сесс бүрт, демо логик)
  useEffect(() => {
    if (!id || videoError) return
    try {
      const key = `uzeg-viewed-${id}`
      if (sessionStorage.getItem(key)) return
      sessionStorage.setItem(key, '1')
    } catch {
      /* storage хориглогдсон бол тоолно (хамгаалалтгүй демо) */
    }
    bumpTitleMeta(id, { views: 1 })
  }, [id, videoError])

  // Үзэх явцыг ~3 секунд тутамд хадгална (Үргэлжлүүлж үзэх мөрөнд ашиглана)
  const handleTimeUpdate = useCallback(
    (v: HTMLVideoElement) => {
      if (!v.duration || Number.isNaN(v.duration)) return
      const now = Date.now()
      if (now - lastSavedAt.current < 3000) return
      lastSavedAt.current = now
      if (id) save(id, (v.currentTime / v.duration) * 100)
      // Админ тайланд үзсэн цагийн тоолол — ~15 секунд бүр meta руу илгээнэ
      if (!v.paused && !v.ended && id) {
        pendingSec.current += 3
        if (pendingSec.current >= 15 && now - lastFlushAt.current >= 14000) {
          lastFlushAt.current = now
          const inc = pendingSec.current
          pendingSec.current = 0
          bumpTitleMeta(id, { watchSec: inc })
        }
      }
    },
    [id, save]
  )

  // Зогсооход шууд хадгална — Үргэлжлүүлж үзэх нарийвчлал сайжирна
  const handlePauseSave = useCallback(
    (v: HTMLVideoElement) => {
      if (!v.duration || Number.isNaN(v.duration)) return
      if (id) save(id, (v.currentTime / v.duration) * 100)
      // Хуримтлагдсан үзсэн секундыг шууд илгээнэ
      if (id && pendingSec.current > 0) {
        const inc = pendingSec.current
        pendingSec.current = 0
        bumpTitleMeta(id, { watchSec: inc })
      }
    },
    [id, save]
  )

  const titles = useMemo(() => data.filter((t) => t.active), [data])
  const t = useMemo(() => titles.find((x) => x.id === id) ?? null, [titles, id])

  const next = useMemo(() => {
    if (!t) return []
    return titles.filter((x) => x.id !== t.id).slice(0, 10)
  }, [titles, t])

  if (loading && !t) return <LoadingState label="Тоглуулагч бэлтгэж байна…" />

  if (!t) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <EmptyState
          title="Агуулга олдсонгүй"
          description="Холбоос буруу эсвэл контент устгагдсан байж болно (демо өгөгдөл)."
          action={
            <Button className={BTN_ACCENT} onClick={() => navigate('/demo/uzeg/browse')}>
              Нээлт рүү очих
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Толгой мөр */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <DemoLink
          href={`/demo/uzeg/title?id=${t.id}`}
          className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-sm text-[#F5E8EB]/80 transition-colors hover:border-[#FF3D5A]/60 hover:text-[#FF3D5A]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Буцах
        </DemoLink>
        <h1 className="text-lg font-bold text-white sm:text-xl" style={fontDisplay}>
          {t.title}
        </h1>
        <div className="flex items-center gap-2">
          <MetaChip>{t.year}</MetaChip>
          <MetaChip>{t.duration}</MetaChip>
          <RatingBadge value={t.rating} />
        </div>
      </div>

      {/* Тоглуулагч фрейм */}
      {t.videoUrl ? (
        <div className="overflow-hidden rounded-xl border border-white/10 bg-black shadow-[0_0_60px_rgba(255,61,90,0.16)]">
          {videoError ? (
            <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 bg-black/85 px-6 text-center">
              <AlertTriangle className="h-8 w-8 text-[#FF3D5A]" aria-hidden />
              <p className="text-sm text-[#F5E8EB]/85">
                Видео тоглуулахад алдаа гарлаа — интернет холболтоо шалгаад дахин оролдоно уу.
              </p>
            </div>
          ) : (
            <VideoPlayer
              key={t.videoUrl}
              src={t.videoUrl}
              posterGradient={t.posterGradient}
              onTimeUpdate={handleTimeUpdate}
              onPauseSave={handlePauseSave}
              onError={() => setVideoError(true)}
            />
          )}
        </div>
      ) : (
        <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 rounded-xl border border-white/10 bg-[#150710] px-6 text-center">
          <VideoOff className="h-9 w-9 text-[#FF3D5A]/70" aria-hidden />
          <p className="max-w-md text-sm text-[#F5E8EB]/80">
            Энэ контентод жишээ видео бүртгэгдээгүй байна. Уучлалаа — демо сандаа тун удахгүй нэмэгдэнэ.
          </p>
        </div>
      )}

      {/* Эх сурвалжийн тэмдэглэл */}
      <p className="mt-3 flex items-center gap-2 text-xs text-[#F5E8EB]/50">
        <Info className="h-3.5 w-3.5 shrink-0" aria-hidden />
        Жишээ видео — нээлттэй эхийн контент (Blender Foundation болон Google-ийн нээлттэй сан, CC-BY).
      </p>

      {/* Тайлбарын панель */}
      <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-base font-bold text-white" style={fontDisplay}>
            {t.title}
          </h2>
          <MetaChip>{t.type === 'кино' ? 'Кино' : t.type === 'цуврал' ? 'Цуврал' : 'Баримтат'}</MetaChip>
          <MetaChip>{t.genre}</MetaChip>
          <MetaChip accent={t.isNew}>{t.isNew ? 'Шинэ' : `${t.year}`}</MetaChip>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-[#F5E8EB]/80">{t.description}</p>
      </div>

      {/* Үргэлжлэл */}
      {next.length > 0 && (
        <div className="-mx-4 mt-6 sm:-mx-6 lg:-mx-8">
          <ContentRow title="Үргэлжлэл" items={next} moreHref="/demo/uzeg/browse" />
        </div>
      )}
      <div className="h-8" aria-hidden />
    </div>
  )
}
