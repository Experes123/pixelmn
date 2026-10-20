'use client'

import { useState } from 'react'
import { Loader2, LockKeyhole, ArrowLeft } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { goHomeToPortfolio } from '@/lib/hash-router'

/**
 * Демо админ панелд зориулсан хамгаалалтын түгжээ.
 * Бодит эрхийн систем биш — демо горимын хялбар код (дэлгэцэн дээр харагдана).
 * sessionStorage түлхүүрээр сессийн хугацаанд нээгдсэн хэвээр байна.
 */

const DEMO_ADMIN_CODE = '1234'

/** Демо админий нэвтрэх төлвийн hook — authed/pass/logout */
export function useDemoAdminAuth(storageKey: string) {
  const [authed, setAuthed] = useState(() => {
    try {
      return sessionStorage.getItem(storageKey) === '1'
    } catch {
      return false
    }
  })

  const pass = () => {
    try {
      sessionStorage.setItem(storageKey, '1')
    } catch {
      /* noop */
    }
    setAuthed(true)
  }

  const logout = () => {
    try {
      sessionStorage.removeItem(storageKey)
    } catch {
      /* noop */
    }
    setAuthed(false)
  }

  return { authed, pass, logout }
}

type GateProps = {
  /** Панелийн нэр — жишээ: «ГАН Админ» */
  title: string
  /** Брендийн акцент өнгө (CSS color) */
  accent?: string
  /** Харанхуй загварын демо (ШОНХОР, ӨРГӨӨ админ г.м.) */
  dark?: boolean
  /** Нэвтрэх үед дуудагдана */
  onPass: () => void
  /** Нүүр рүү буцах зам (өгөгдөөгүй бол демо нүүр рүү) */
  backHref?: string
}

/** Демо PIN-ээр нээгдэх админ хамгаалалтын дэлгэц */
export function DemoAdminGate({ title, accent = '#E4572E', dark = false, onPass, backHref }: GateProps) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)
  const [checking, setChecking] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (pin.length !== 4) return
    setChecking(true)
    setTimeout(() => {
      if (pin === DEMO_ADMIN_CODE) {
        onPass()
      } else {
        setError(true)
        setChecking(false)
        setPin('')
      }
    }, 450)
  }

  return (
    <div
      className={cn(
        'flex min-h-screen flex-col items-center justify-center px-4',
        dark ? 'bg-[#0B0F0D]' : 'bg-[#F2F1EE]'
      )}
      style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
      role="main"
      aria-labelledby="demo-gate-title"
    >
      <form
        onSubmit={submit}
        className={cn(
          'w-full max-w-sm rounded-2xl p-7 shadow-[0_18px_50px_-24px_rgba(0,0,0,0.5)]',
          dark ? 'border border-white/10 bg-[#131A16]' : 'border border-black/[0.08] bg-white'
        )}
        aria-label={`${title} — нэвтрэх`}
      >
        <div className="mb-5 flex items-center justify-center gap-2.5">
          <span
            className="grid h-9 w-9 place-items-center rounded-xl"
            style={{ backgroundColor: `${accent}1F`, color: accent }}
            aria-hidden="true"
          >
            <LockKeyhole className="h-4.5 w-4.5" />
          </span>
          <span
            className={cn('text-lg font-extrabold tracking-tight', dark ? 'text-white' : 'text-[#0B0B0C]')}
          >
            {title}
          </span>
        </div>

        <h1
          id="demo-gate-title"
          className={cn('text-center text-[15px] font-bold', dark ? 'text-white' : 'text-[#0B0B0C]')}
        >
          Нэвтрэх код оруулна уу
        </h1>
        <p className={cn('mt-1.5 text-center text-[12.5px] leading-relaxed', dark ? 'text-white/55' : 'text-black/50')}>
          Демо горимын хамгаалалт — бодит эрхийн систем хойш хэрэгжинэ.
          <br />
          Демо код:{' '}
          <span className="font-mono font-bold" style={{ color: accent }}>
            {DEMO_ADMIN_CODE}
          </span>
        </p>

        <label htmlFor="demo-admin-pin" className="sr-only">
          Нэвтрэх код
        </label>
        <Input
          id="demo-admin-pin"
          inputMode="numeric"
          autoComplete="off"
          maxLength={4}
          placeholder="••••"
          value={pin}
          onChange={(e) => {
            setPin(e.target.value.replace(/\D/g, ''))
            setError(false)
          }}
          aria-invalid={error}
          aria-describedby={error ? 'demo-admin-pin-error' : undefined}
          className={cn(
            'mt-4 h-12 rounded-xl text-center font-mono text-xl tracking-[0.5em]',
            dark && 'border-white/15 bg-white/5 text-white placeholder:text-white/30'
          )}
        />
        {error && (
          <p
            id="demo-admin-pin-error"
            role="alert"
            className="mt-2 text-center text-[12.5px] font-medium text-red-500"
          >
            Код буруу байна — дахин оролдоно уу.
          </p>
        )}

        <Button
          type="submit"
          disabled={pin.length !== 4 || checking}
          className="mt-4 h-11 w-full rounded-xl font-semibold"
          style={{ backgroundColor: accent, color: '#fff' }}
        >
          {checking ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Нэвтрэх'}
        </Button>

        <a
          href={backHref ? `#${backHref}` : '#/'}
          onClick={
            backHref
              ? undefined
              : (e) => {
                  e.preventDefault()
                  goHomeToPortfolio()
                }
          }
          className={cn(
            'mt-3 flex items-center justify-center gap-1.5 text-[12.5px] font-medium underline-offset-2 hover:underline',
            dark ? 'text-white/45 hover:text-white/80' : 'text-black/45 hover:text-black/80'
          )}
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          Сайт руу буцах
        </a>
      </form>
    </div>
  )
}

/** Админы толгойд хавсаргах «Гарах» товч — демо сессийг дуусгана */
export function DemoAdminLogoutButton({
  onLogout,
  dark = false,
  label = 'Гарах',
}: {
  onLogout: () => void
  dark?: boolean
  label?: string
}) {
  return (
    <button
      type="button"
      onClick={onLogout}
      aria-label={label}
      className={cn(
        'inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12.5px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 sm:px-3.5',
        dark
          ? 'border-white/15 bg-white/5 text-white/75 hover:bg-white/10 focus-visible:ring-white/40'
          : 'border-black/10 bg-white text-black/70 hover:bg-black/5 focus-visible:ring-black/30'
      )}
    >
      <LogOutIcon />
      {/* Мобайл дээр зөвхөн icon — толгойн мөр давхцахгүйн тулд */}
      <span className="sr-only sm:not-sr-only">{label}</span>
    </button>
  )
}

function LogOutIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  )
}
