'use client'

/**
 * ҮЗЭГ Стриминг — сайт header / footer
 */

import { useState, type ReactNode } from 'react'
import { Menu, Search } from 'lucide-react'
import { DemoLink, navigate } from '@/lib/hash-router'
import { DemoBadge } from '@/components/shared/demo-kit'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from '@/components/ui/sheet'
import { ACCENT, BG, DARK_PORTAL, fontDisplay, useWatchlist } from './shared'

const NAV = [
  { label: 'Нүүр', path: '/demo/uzeg', sub: '' },
  { label: 'Нээлт', path: '/demo/uzeg/browse', sub: 'browse' },
  { label: 'Миний жагсаалт', path: '/demo/uzeg/watchlist', sub: 'watchlist' },
  { label: 'Багц', path: '/demo/uzeg/plans', sub: 'plans' },
  { label: 'Админ панель', path: '/demo/uzeg/admin', sub: 'admin' },
]

/** Тогтмол ReturnToMain товчны зүүн талын зай */
export function Spacer() {
  return <span aria-hidden className="w-[118px] shrink-0 sm:w-[206px]" />
}

/** ҮЗЭГ логотип — кармин тоглуулагч байр + Unbounded wordmark */
export function Wordmark() {
  return (
    <span className="flex items-center gap-2.5">
      <span
        aria-hidden
        className="flex h-9 w-9 items-center justify-center rounded-xl"
        style={{ background: ACCENT, boxShadow: '0 0 20px rgba(255,61,90,0.45)' }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff" aria-hidden>
          <path d="M8 5.14v13.72c0 .81.87 1.3 1.54.87l10.57-6.86a1.04 1.04 0 0 0 0-1.74L9.54 4.27A1.04 1.04 0 0 0 8 5.14Z" />
        </svg>
      </span>
      <span className="leading-none">
        <span className="block text-lg font-bold tracking-wide text-white" style={fontDisplay}>
          ҮЗЭГ
        </span>
        <span className="mt-1 block text-[9px] font-semibold tracking-[0.42em] text-[#F5E8EB80]">
          СТРИМИНГ
        </span>
      </span>
    </span>
  )
}

export function SiteHeader({ sub }: { sub: string }) {
  const [open, setOpen] = useState(false)
  const { ids: wlIds } = useWatchlist()
  const wlCount = wlIds.length

  const searchBtn = (
    <button
      type="button"
      onClick={() => navigate('/demo/uzeg/browse')}
      aria-label="Хайлт — Нээлт хуудас руу очих"
      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-[#F5E8EB]/80 transition-colors hover:border-[#FF3D5A]/60 hover:text-[#FF3D5A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF3D5A]"
    >
      <Search className="h-4 w-4" aria-hidden />
    </button>
  )

  return (
    <header
      className="sticky top-0 z-40 border-b border-white/10"
      style={{ background: 'rgba(14,5,8,0.82)', backdropFilter: 'blur(12px)' }}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4">
        <Spacer />
        <DemoLink href="/demo/uzeg" className="mr-auto" ariaLabel="ҮЗЭГ нүүр хуудас">
          <Wordmark />
        </DemoLink>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Үндсэн цэс">
          {NAV.map((n) => {
            const active = n.sub === sub
            return (
              <DemoLink
                key={n.path}
                href={n.path}
                className={`relative rounded-md px-3 py-2 text-sm transition-colors ${
                  active ? 'font-semibold text-[#FF3D5A]' : 'text-[#F5E8EB]/80 hover:text-white'
                }`}
              >
                {n.label}
                {n.sub === 'watchlist' && wlCount > 0 && (
                  <span
                    className="ml-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold text-white"
                    style={{ background: ACCENT }}
                  >
                    {wlCount > 9 ? '9+' : wlCount}
                  </span>
                )}
                {active && (
                  <span
                    aria-hidden
                    className="absolute inset-x-3 -bottom-[13px] h-[2px] rounded-full"
                    style={{ background: ACCENT, boxShadow: '0 0 10px rgba(255,61,90,0.8)' }}
                  />
                )}
              </DemoLink>
            )
          })}
          {searchBtn}
          <DemoBadge className="ml-2 border-[#FF3D5A66] bg-[#FF3D5A14] text-[#FF3D5A]" />
        </nav>

        {/* Мобайл цэс */}
        <div className="flex items-center gap-2 md:hidden">
          {searchBtn}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="border-white/15 bg-white/5 text-[#F5E8EB] hover:bg-white/10 hover:text-white"
                aria-label="Цэс нээх"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className={`${DARK_PORTAL} w-72 border-white/10 bg-[#150710] text-[#F5E8EB]`}>
              <SheetHeader>
                <SheetTitle className="text-left">
                  <Wordmark />
                </SheetTitle>
                <SheetDescription className="text-left text-[#F5E8EB]/70">
                  Цэс — демо горим
                </SheetDescription>
              </SheetHeader>
              <nav className="mt-2 flex flex-col gap-1 px-4" aria-label="Мобайл цэс">
                {NAV.map((n) => (
                  <DemoLink
                    key={n.path}
                    href={n.path}
                    onClick={() => setOpen(false)}
                    className={`rounded-lg border px-3 py-2.5 text-sm transition-colors ${
                      n.sub === sub
                        ? 'border-[#FF3D5A]/60 bg-[#FF3D5A]/10 text-[#FF3D5A]'
                        : 'border-white/10 text-[#F5E8EB]/85 hover:border-white/25 hover:text-white'
                    }`}
                  >
                    {n.label}
                    {n.sub === 'watchlist' && wlCount > 0 && (
                      <span
                        className="ml-2 inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold text-white"
                        style={{ background: ACCENT }}
                      >
                        {wlCount}
                      </span>
                    )}
                  </DemoLink>
                ))}
                <span className="pt-3">
                  <DemoBadge className="border-[#FF3D5A66] bg-[#FF3D5A14] text-[#FF3D5A]" />
                </span>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

export function SiteFooter() {
  const year = new Date().getFullYear()
  return (
    <footer className="mt-auto border-t border-white/10 bg-[#120610]">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <Wordmark />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#F5E8EB]/65">
            ҮЗЭГ — демо стриминг платформ. Бүх агуулга хууль ёсны нээлттэй эхийн жишээ видео.
          </p>
        </div>
        <div>
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.25em]" style={{ color: ACCENT }}>
            Холбоос
          </p>
          <ul className="space-y-2 text-sm">
            {NAV.filter((n) => n.sub !== 'admin').map((n) => (
              <li key={n.path}>
                <DemoLink
                  href={n.path}
                  className="text-[#F5E8EB]/75 transition-colors hover:text-[#FF3D5A]"
                >
                  {n.label}
                </DemoLink>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.25em]" style={{ color: ACCENT }}>
            Демо горим
          </p>
          <ul className="space-y-2 text-sm text-[#F5E8EB]/75">
            <li>Видеоны эх сурвалж: Blender Foundation, Google — CC-BY</li>
            <li>Постер бүр CSS градиентээр зурсан (авторшилгүй)</li>
            <li>
              <DemoLink href="/demo/uzeg/admin" className="transition-colors hover:text-[#FF3D5A]">
                Админ панель
              </DemoLink>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/5 px-4 py-4 text-center text-[11px] text-[#F5E8EB]/45">
        © {year} ҮЗЭГ Стриминг — Демо төсөл · Pixelmn · Багцын төлбөр бодит биш
      </div>
    </footer>
  )
}

/** Хуудасны толгой хэсэг — нэр + тайлбар (browse/watchlist/plans-д ашиглана) */
export function PageHead({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children?: ReactNode
}) {
  return (
    <div
      className="border-b border-white/10"
      style={{ background: `linear-gradient(180deg, rgba(26,11,18,0.9), ${BG})` }}
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-10 sm:flex-row sm:items-end sm:justify-between sm:px-6 lg:px-8">
        <div>
          <h1 className="text-2xl text-white sm:text-3xl" style={fontDisplay}>
            {title}
          </h1>
          {description && <p className="mt-2 max-w-xl text-sm text-[#F5E8EB]/65">{description}</p>}
        </div>
        {children && <div className="flex items-center gap-2">{children}</div>}
      </div>
    </div>
  )
}
