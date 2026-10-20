'use client'

/**
 * ҮЗЭГ Стриминг — хуваалцсан төрөл, тогтмолууд, постер ба карт компонентууд.
 * Постер бүр CSS градиент + топографик давхаргаар зурагддаг (авторшилгүй демо дизайн).
 */

import { useCallback, useSyncExternalStore, type CSSProperties, type ReactNode } from 'react'
import { Play, Star, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { navigate, DemoLink } from '@/lib/hash-router'

// ─────────────────────────── Палитр / брэнд ───────────────────────────

export const ACCENT = '#FF3D5A' // кармин — үндсэн акцент
export const BG = '#0E0508' // бараг хар слим (plum)
export const PANEL = '#1A0B12' // панель
export const TEXT = '#F5E8EB' // зөөлөн ягаан текст

/** Unbounded display фонт стиль */
export const fontDisplay: CSSProperties = { fontFamily: 'var(--font-unbounded), sans-serif' }

/** Радикс портал (Dialog/Sheet/Select) контентод нэмэх dark класс */
export const DARK_PORTAL = 'dark'

/** Шилэн панель */
export const GLASS = 'bg-white/5 border border-white/10 backdrop-blur'

export const BTN_ACCENT =
  'bg-[#FF3D5A] text-white hover:bg-[#E82F4B] hover:text-white shadow-[0_4px_24px_rgba(255,61,90,0.35)]'
export const BTN_GHOST =
  'border-white/15 bg-white/5 text-[#F5E8EB] hover:bg-white/10 hover:text-white'
export const INPUT_CLS =
  'border-white/10 bg-white/5 text-[#F5E8EB] placeholder:text-white/35 focus-visible:border-[#FF3D5A] focus-visible:ring-[#FF3D5A]/40'

// ─────────────────────────── Төрлүүд ───────────────────────────

export type StreamTitle = {
  id: string
  title: string
  type: string // кино | цуврал | баримтат
  genre: string
  year: number
  rating: number // 0–10
  duration: string // "1 ц 52 мин" эсвэл "2 Анги"
  description: string
  posterGradient: string // CSS gradient
  backdropUrl: string | null
  videoUrl: string | null
  featured: boolean
  isNew: boolean
  active: boolean
  meta?: { views?: number; watchSeconds?: number } | null // демо үзэлтийн тоолол
}

export type StreamSub = {
  id: string
  plan: string
  customerName: string
  email: string
  amount: number
  status: string // идэвхтэй | цуцлагдсан
  createdAt: string
}

// ─────────────────────────── Нээлттэй эхийн сан ───────────────────────────

/** Нээлттэй эхийн жишээ видео (Google-ийн нийтийн сан, CC-BY) */
export const VIDEO_SOURCES: { url: string; label: string }[] = [
  {
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    label: 'Big Buck Bunny',
  },
  {
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    label: 'Elephants Dream',
  },
  {
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    label: 'Sintel',
  },
  {
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    label: 'Tears of Steel',
  },
  {
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    label: 'For Bigger Blazes',
  },
  {
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    label: 'For Bigger Escapes',
  },
]

/** Кинематик бэкдроп зургууд — assets-img/IMAGE_INDEX.json (stream1/stream2) */
export const BACKDROPS: { url: string; label: string }[] = [
  { url: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/84eab4098d72.jpeg', label: 'stream1-1 · Нүүдэлчин уул' },
  { url: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/da524f152d2d.jpg', label: 'stream1-2' },
  { url: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/e32d0f7304e4.jpg', label: 'stream1-3' },
  { url: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/1565637c9732.jpg', label: 'stream1-4' },
  { url: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/3261a44263db.jpg', label: 'stream1-5' },
  { url: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/45f22b124171.jpg', label: 'stream2-1 · Неон шөнийн хот' },
  { url: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/2d21ff5578d8.jpg', label: 'stream2-2' },
  { url: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/0cd0499d6b11.jpg', label: 'stream2-3' },
  { url: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/6899e96f3bdd.jpg', label: 'stream2-4' },
  { url: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/70fdd6626d77.jpg', label: 'stream2-5' },
]

/** Постирын градиент загварууд — бүгд дулаан/кармин палитрт тулгуурласан 9 ондоц */
export const GRADIENT_PRESETS: { name: string; value: string }[] = [
  { name: 'Кармин', value: 'linear-gradient(160deg,#3b0d16,#8a1c30 55%,#ff3d5a 130%)' },
  { name: 'Оройн нар', value: 'linear-gradient(160deg,#331303,#7c3b10 55%,#ff8c3d 130%)' },
  { name: 'Алтан', value: 'linear-gradient(160deg,#2e2408,#8a6a14 55%,#ffd23d 130%)' },
  { name: 'Ягаан сарнай', value: 'linear-gradient(160deg,#33091f,#8a1c52 55%,#ff3d9a 130%)' },
  { name: 'Түймэр', value: 'linear-gradient(160deg,#2a0505,#7a1414 55%,#e04b3d 130%)' },
  { name: 'Хөх ногоон', value: 'linear-gradient(160deg,#07231e,#12564a 55%,#2dd4a8 130%)' },
  { name: 'Ойн ногоон', value: 'linear-gradient(160deg,#0c2309,#2f5e14 55%,#7dd13d 130%)' },
  { name: 'Зэс', value: 'linear-gradient(160deg,#26090a,#6e2410 55%,#c96a3d 130%)' },
  { name: 'Гүн сарнай', value: 'linear-gradient(160deg,#22091a,#5e1436 55%,#c23d6d 130%)' },
]

export const TYPE_LABELS: Record<string, string> = {
  кино: 'Кино',
  цуврал: 'Цуврал',
  баримтат: 'Баримтат',
}

// ─────────────────────────── Жагсаалт (localStorage) ───────────────────────────

export const WATCHLIST_KEY = 'uzeg-watchlist'

/** useSyncExternalStore-д зориулсан энгийн дэлгүүр — localStorage нь гадна систем */
const EMPTY_LIST: string[] = []
let wlSnapshot: string[] | null = null
const wlListeners = new Set<() => void>()

function getWatchlistSnapshot(): string[] {
  if (typeof window === 'undefined') return EMPTY_LIST
  if (wlSnapshot) return wlSnapshot
  try {
    const raw = window.localStorage.getItem(WATCHLIST_KEY)
    const parsed: unknown = JSON.parse(raw ?? '[]')
    wlSnapshot = Array.isArray(parsed)
      ? parsed.filter((x): x is string => typeof x === 'string')
      : EMPTY_LIST
  } catch {
    wlSnapshot = EMPTY_LIST
  }
  return wlSnapshot
}

const getWatchlistServerSnapshot = (): string[] => EMPTY_LIST

function subscribeWatchlist(cb: () => void) {
  wlListeners.add(cb)
  const onStorage = () => {
    wlSnapshot = null
    cb()
  }
  window.addEventListener('storage', onStorage)
  return () => {
    wlListeners.delete(cb)
    window.removeEventListener('storage', onStorage)
  }
}

function writeWatchlist(ids: string[]) {
  try {
    window.localStorage.setItem(WATCHLIST_KEY, JSON.stringify(ids))
  } catch {
    /* демо горим — хадгалах боломжгүй үед тоохгүй */
  }
  wlSnapshot = null
  for (const l of wlListeners) l()
}

export function readWatchlist(): string[] {
  return getWatchlistSnapshot()
}

/** Жагсаалтын state (useSyncExternalStore) — нэмэх/хасах тусам бүх компонент шинэчлэгдэнэ */
export function useWatchlist() {
  const ids = useSyncExternalStore(subscribeWatchlist, getWatchlistSnapshot, getWatchlistServerSnapshot)

  const toggle = useCallback((id: string) => {
    const current = getWatchlistSnapshot()
    const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id]
    writeWatchlist(next)
  }, [])

  const remove = useCallback((id: string) => {
    writeWatchlist(getWatchlistSnapshot().filter((x) => x !== id))
  }, [])

  const has = useCallback((id: string) => ids.includes(id), [ids])

  return { ids, ready: true, has, toggle, remove }
}

// ─────────────────────────── Үзэх явц (Үргэлжлүүлж үзэх) ───────────────────────────

export type WatchProgressMap = Record<string, { pct: number; at: number }>

const PROGRESS_KEY = 'uzeg-progress'
let progressSnapshot: WatchProgressMap | null = null
const progressListeners = new Set<() => void>()

function getProgressSnapshot(): WatchProgressMap {
  if (progressSnapshot) return progressSnapshot
  let parsed: WatchProgressMap
  try {
    parsed = JSON.parse(localStorage.getItem(PROGRESS_KEY) ?? '{}')
  } catch {
    parsed = {}
  }
  progressSnapshot = parsed
  return parsed
}

function getProgressServerSnapshot(): WatchProgressMap {
  return {}
}

function writeProgress(next: WatchProgressMap) {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(next))
  } catch {
    /* демо горим — хадгалах боломжгүй үед тоохгүй */
  }
  progressSnapshot = null
  for (const l of progressListeners) l()
}

function subscribeProgress(listener: () => void) {
  progressListeners.add(listener)
  return () => progressListeners.delete(listener)
}

export function useWatchProgress() {
  const map = useSyncExternalStore(subscribeProgress, getProgressSnapshot, getProgressServerSnapshot)

  const save = useCallback((id: string, pct: number) => {
    const next = { ...getProgressSnapshot() }
    next[id] = { pct: Math.min(100, Math.max(0, Math.round(pct))), at: Date.now() }
    writeProgress(next)
  }, [])

  const remove = useCallback((id: string) => {
    const next = { ...getProgressSnapshot() }
    delete next[id]
    writeProgress(next)
  }, [])

  return { map, save, remove }
}

/** Компонент mount үед localStorage-с шинэчилнэ (агуулга шинэчлэгдсэн байж болно) */
export function refreshWatchProgress() {
  progressSnapshot = null
  for (const l of progressListeners) l()
}

// ─────────────────────────── Тоглуулагчийн хурд (localStorage) ───────────────────────────

export const SPEED_KEY = 'uzeg-speed'
export const SPEED_OPTIONS = [0.5, 1, 1.25, 1.5, 2]

let speedSnapshot: number | null = null
const speedListeners = new Set<() => void>()

function getSpeedSnapshot(): number {
  if (speedSnapshot !== null) return speedSnapshot
  let v = 1
  try {
    const parsed = Number(localStorage.getItem(SPEED_KEY))
    if (SPEED_OPTIONS.includes(parsed)) v = parsed
  } catch {
    /* демо горим — хадгалах боломжгүй үед тоохгүй */
  }
  speedSnapshot = v
  return v
}

const getSpeedServerSnapshot = (): number => 1

function subscribeSpeed(listener: () => void) {
  speedListeners.add(listener)
  return () => speedListeners.delete(listener)
}

function writeSpeed(v: number) {
  speedSnapshot = v
  try {
    localStorage.setItem(SPEED_KEY, String(v))
  } catch {
    /* демо горим — хадгалах боломжгүй үед тоохгүй */
  }
  for (const l of speedListeners) l()
}

/** Тоглуулагчийн хурд — localStorage 'uzeg-speed'-д хадгалагдана, SSR-тэй зохицно (useSyncExternalStore) */
export function usePlaybackSpeed() {
  const speed = useSyncExternalStore(subscribeSpeed, getSpeedSnapshot, getSpeedServerSnapshot)
  const setSpeed = useCallback((v: number) => writeSpeed(v), [])
  return { speed, setSpeed }
}

/** Hook-гүй унших — video event handler-уудад (эхний render-аас өмнөх хугацаанд) */
export function readPlaybackSpeed(): number {
  return getSpeedSnapshot()
}

// ─────────────────────────── Постер (CSS зохиомол) ───────────────────────────

/** Геометр чимэглэл — гарчгийн уртаас хамаарч 4 янз бүрийн бүтэц */
function GeoShapes({ variant }: { variant: number }) {
  if (variant === 0) {
    return (
      <>
        <div aria-hidden className="absolute -right-10 -top-12 h-40 w-40 rounded-full border border-white/20" />
        <div aria-hidden className="absolute -right-4 -top-6 h-24 w-24 rounded-full border border-white/15" />
        <div aria-hidden className="absolute right-9 top-[92px] h-2.5 w-2.5 rounded-full bg-white/40" />
      </>
    )
  }
  if (variant === 1) {
    return (
      <>
        <div aria-hidden className="absolute -bottom-12 -left-12 h-44 w-44 rounded-full border border-white/15" />
        <div aria-hidden className="absolute bottom-28 left-6 h-14 w-14 rounded-full bg-white/10" />
        <div aria-hidden className="absolute right-0 top-0 h-full w-px bg-white/10" />
        <div aria-hidden className="absolute right-4 top-0 h-full w-px bg-white/5" />
      </>
    )
  }
  if (variant === 2) {
    return (
      <>
        <div aria-hidden className="absolute -left-16 top-1/3 h-56 w-56 -rotate-45 border border-white/15" />
        <div aria-hidden className="absolute -left-8 top-1/2 h-56 w-56 -rotate-45 border border-white/10" />
        <div aria-hidden className="absolute right-6 top-6 h-10 w-10 rounded-full border-2 border-white/25" />
      </>
    )
  }
  return (
    <>
      <div aria-hidden className="absolute right-5 top-8 h-16 w-16 rotate-45 border border-white/25" />
      <div aria-hidden className="absolute right-[62px] top-[74px] h-16 w-16 rotate-45 border border-white/15" />
      <div aria-hidden className="absolute left-4 top-5 h-1.5 w-12 rounded bg-white/30" />
    </>
  )
}

/** CSS-ээр зурсан постер — градиент + гарчиг/жанр + геометр хэлбэрүүд */
export function Poster({ t, className }: { t: StreamTitle; className?: string }) {
  const variant = t.title.length % 4
  return (
    <div className={cn('relative overflow-hidden', className)} style={{ background: t.posterGradient }}>
      <GeoShapes variant={variant} />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70" />
      <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
        <p
          className="text-sm leading-snug text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.55)] sm:text-[15px]"
          style={fontDisplay}
        >
          {t.title}
        </p>
        <p className="mt-1.5 text-[10px] uppercase tracking-[0.18em] text-white/75">
          {t.genre} · {t.year}
        </p>
      </div>
    </div>
  )
}

// ─────────────────────────── Карт ба мөр ───────────────────────────

/** Постер карту — hover өсгөлт + кармин гэрэл, үнэлгээ/шинэ бэйдж */
export function TitleCard({
  t,
  onRemove,
  progressPct,
  className,
}: {
  t: StreamTitle
  onRemove?: () => void
  /** Үзсэн хувь (0-100) — "Үргэлжлүүлж үзэх" мөрөнд прогресс харуулна */
  progressPct?: number
  className?: string
}) {
  return (
    <div className={cn('group relative', className)}>
      <button
        type="button"
        onClick={() => navigate(`/demo/uzeg/title?id=${t.id}`)}
        aria-label={`${t.title} — дэлгэрэнгүй мэдээлэл`}
        className="block w-full rounded-xl text-left outline-none focus-visible:ring-2 focus-visible:ring-[#FF3D5A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E0508]"
      >
        <div className="relative aspect-[2/3] w-full transform-gpu overflow-hidden rounded-xl border border-white/10 bg-white/5 transition-all duration-300 group-hover:scale-[1.04] group-hover:border-white/25 group-hover:shadow-[0_0_30px_rgba(255,61,90,0.38)]">
          <Poster t={t} className="h-full w-full" />
          {t.isNew && (
            <span
              className="absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-bold tracking-widest text-white"
              style={{ background: ACCENT }}
            >
              ШИНЭ
            </span>
          )}
          {!onRemove && (
            <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/55 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur">
              <Star className="h-3 w-3 fill-[#FFD23D] text-[#FFD23D]" aria-hidden />
              {t.rating.toFixed(1)}
            </span>
          )}
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/35 group-hover:opacity-100">
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/40 bg-black/50 backdrop-blur">
              <Play className="h-5 w-5 fill-white text-white" aria-hidden />
            </span>
          </span>
          {typeof progressPct === 'number' && progressPct > 0 && (
            <span className="pointer-events-none absolute inset-x-2 bottom-2" aria-hidden>
              <span className="block h-1 w-full overflow-hidden rounded-full bg-white/25">
                <span
                  className="block h-full rounded-full"
                  style={{ width: `${Math.min(100, progressPct)}%`, background: ACCENT }}
                />
              </span>
            </span>
          )}
        </div>
      </button>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`${t.title} — жагсаалтаас хасах`}
          className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-white/20 bg-black/70 text-white/80 backdrop-blur transition-colors hover:border-[#FF3D5A] hover:bg-[#FF3D5A] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF3D5A]"
        >
          <X className="h-3.5 w-3.5" aria-hidden />
        </button>
      )}
    </div>
  )
}

/** Хэвтээ гүйлгэх нэгж мөр — overflow-x-auto nice-scroll */
export function ContentRow({
  title,
  items,
  moreHref,
}: {
  title: string
  items: StreamTitle[]
  moreHref?: string
}) {
  if (!items.length) return null
  return (
    <section className="mt-10" aria-label={title}>
      <div className="mb-3 flex items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <h2 className="text-base text-white sm:text-lg" style={fontDisplay}>
          {title}
        </h2>
        {moreHref && (
          <DemoLink
            href={moreHref}
            className="whitespace-nowrap text-xs text-white/55 transition-colors hover:text-[#FF3D5A]"
          >
            Бүгдийг харах →
          </DemoLink>
        )}
      </div>
      <div className="nice-scroll flex gap-3 overflow-x-auto px-4 pb-3 sm:gap-4 sm:px-6 lg:px-8">
        {items.map((t) => (
          <div key={t.id} className="w-[142px] shrink-0 sm:w-[168px] lg:w-[182px]">
            <TitleCard t={t} />
          </div>
        ))}
      </div>
    </section>
  )
}

// ─────────────────────────── Жижиг хэсгүүд ───────────────────────────

/** Мета чип — шилэн жижиг тэмдэглэгээ */
export function MetaChip({ children, accent = false }: { children: ReactNode; accent?: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium backdrop-blur',
        accent ? 'border-[#FF3D5A]/50 bg-[#FF3D5A]/15 text-[#FF3D5A]' : 'border-white/15 bg-white/5 text-[#F5E8EB]/85'
      )}
    >
      {children}
    </span>
  )
}

/** Үнэлгээний одон — шар од + оноо */
export function RatingBadge({ value, className }: { value: number; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1 text-sm font-semibold text-[#FFD23D]', className)}>
      <Star className="h-4 w-4 fill-[#FFD23D]" aria-hidden />
      {value.toFixed(1)}
    </span>
  )
}

/** Кармин progress мөр — админ статистикт */
export function CrimsonBar({ pct, className }: { pct: number; className?: string }) {
  return (
    <div
      className={cn('h-2 w-full overflow-hidden rounded-full bg-white/10', className)}
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${Math.max(0, Math.min(100, pct))}%`, background: `linear-gradient(90deg,#8a1c30,${ACCENT})` }}
      />
    </div>
  )
}
