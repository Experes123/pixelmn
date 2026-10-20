'use client'

/**
 * ГАН Barbershop — демо вэбсайтын үндсэн бүрэлдэхүүн.
 * Hash routing: '' (нүүр) | 'booking' | 'status' | 'admin'.
 */

import { useState } from 'react'
import { useDemoRoute, DemoLink } from '@/lib/hash-router'
import { DemoBadge, ReturnToMain } from '@/components/shared/demo-kit'
import { Toaster } from '@/components/ui/sonner'
import { Button, buttonVariants } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { Menu } from 'lucide-react'
import HomePage from './home'
import BookingPage from './booking'
import StatusPage from './status'
import AdminPanel from './admin'
import { BrandMark, btnGold, noiseStyle, serifStyle } from './parts'

const NAV = [
  { sub: '', label: 'Нүүр' },
  { sub: 'booking', label: 'Захиалга' },
  { sub: 'status', label: 'Миний захиалга' },
  { sub: 'admin', label: 'Админ панель' },
] as const

export default function BarberDemo() {
  const { sub } = useDemoRoute('barber')

  if (sub === 'admin') {
    return (
      <>
        <ReturnToMain accent="#C9973B" dark />
        <AdminPanel />
        <Toaster position="top-center" richColors />
      </>
    )
  }

  return (
    <div
      className="dark flex min-h-screen flex-col"
      style={{ fontFamily: 'var(--font-inter), sans-serif', background: '#171310', color: '#F3EBDD' }}
    >
      <ReturnToMain accent="#C9973B" dark />
      <SiteHeader sub={sub} />
      <main className="flex-1">
        {sub === 'booking' ? <BookingPage /> : sub === 'status' ? <StatusPage /> : <HomePage />}
      </main>
      <SiteFooter />
      <Toaster position="top-center" richColors />
    </div>
  )
}

// ─────────────────────────── ХЭДЭР ───────────────────────────

function SiteHeader({ sub }: { sub: string }) {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-[#C9973B33] bg-[#171310]/85 backdrop-blur-md">
      <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between gap-3 pl-[128px] pr-4 sm:pl-[204px] sm:pr-8">
        <DemoLink href="/demo/barber" ariaLabel="ГАН Barbershop — нүүр хуудас" className="flex items-center gap-3">
          <BrandMark />
          <DemoBadge className="border-[#C9973B66] bg-[#C9973B14] text-[#C9973B]" />
        </DemoLink>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 md:flex" aria-label="Үндсэн цэс">
          {NAV.map((item) => {
            const active = sub === item.sub
            return (
              <DemoLink
                key={item.sub}
                href={`/demo/barber${item.sub ? '/' + item.sub : ''}`}
                ariaLabel={item.label}
                className={cn(
                  'relative text-[13px] font-medium uppercase tracking-[0.18em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9973B66]',
                  active ? 'text-[#C9973B]' : 'text-[#A89A87] hover:text-[#F3EBDD]'
                )}
              >
                {item.label}
                {active && (
                  <span
                    className="absolute -bottom-[27px] left-0 h-px w-full bg-[#C9973B]"
                    aria-hidden="true"
                  />
                )}
              </DemoLink>
            )
          })}
        </nav>

        {/* Mobile menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-[#F3EBDD] hover:bg-[#C9973B14] hover:text-[#C9973B] md:hidden"
              aria-label="Цэс нээх"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-[280px] border-l border-[#C9973B33] bg-[#171310] text-[#F3EBDD]"
          >
            <SheetHeader className="border-b border-[#C9973B33] text-left">
              <SheetTitle className="text-[#C9973B]" style={serifStyle}>
                ГАН Barbershop
              </SheetTitle>
            </SheetHeader>
            <nav className="mt-6 flex flex-col gap-1 px-4" aria-label="Гар утасны цэс">
              {NAV.map((item) => {
                const active = sub === item.sub
                return (
                  <DemoLink
                    key={item.sub}
                    href={`/demo/barber${item.sub ? '/' + item.sub : ''}`}
                    onClick={() => setOpen(false)}
                    ariaLabel={item.label}
                    className={cn(
                      'rounded-md px-3 py-3 text-sm uppercase tracking-[0.18em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9973B66]',
                      active
                        ? 'bg-[#C9973B14] text-[#C9973B]'
                        : 'text-[#A89A87] hover:bg-[#C9973B0D] hover:text-[#F3EBDD]'
                    )}
                  >
                    {item.label}
                  </DemoLink>
                )
              })}
            </nav>
            <div className="mt-8 px-4">
              <DemoLink
                href="/demo/barber/booking"
                onClick={() => setOpen(false)}
                ariaLabel="Цаг захиалах"
                className={cn(buttonVariants(), btnGold, 'w-full')}
              >
                Цаг захиалах
              </DemoLink>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}

// ─────────────────────────── ХӨЛ ───────────────────────────

function SiteFooter() {
  return (
    <footer className="relative mt-auto border-t border-[#C9973B33] bg-[#12100D]">
      <div className="absolute inset-0 pointer-events-none opacity-40" style={noiseStyle} aria-hidden="true" />
      <div className="relative mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-3">
        <div>
          <BrandMark />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#A89A87]">
            Эрэгтэйчүүдийн үс, сахлисны арчилгааны премиум барбершоп. Уламжлал, мэргэжил,
            тайвшрал — нэг дор.
          </p>
          <DemoBadge className="mt-4 border-[#C9973B44] text-[#6E6152]" />
        </div>

        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#C9973B]">
            Ажлын цаг
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-[#A89A87]">
            <li className="flex justify-between gap-6">
              <span>Давгаараа – Бямба гараг</span>
              <span className="text-[#F3EBDD]">10:00 – 20:00</span>
            </li>
            <li className="flex justify-between gap-6">
              <span>Ням гараг</span>
              <span>Амралт</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#C9973B]">
            Хаяг
          </h3>
          <address className="mt-4 space-y-2 text-sm not-italic leading-relaxed text-[#A89A87]">
            <p>
              Улаанбаатар хот, Сүхбаатар дүүрэг,
              <br />
              __-р хороо, __-р гудамж, ____ төв
            </p>
            <p>+976 7010-____ (жишээ)</p>
          </address>
          <p className="mt-3 text-[10px] uppercase tracking-wider text-[#6E6152]">
            Демо хуудас — хаяг, дугаар нь жишээ мэдээлэл
          </p>
        </div>
      </div>

      <div className="relative border-t border-[#C9973B26]">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-5 text-[11px] uppercase tracking-wider text-[#6E6152] sm:flex-row sm:px-8">
          <p>© {new Date().getFullYear()} ГАН Barbershop</p>
          <div className="flex items-center gap-4">
            <p>Демо төсөл · Pixelmn</p>
            <a
              href="#/demo/barber/admin"
              className="inline-flex items-center gap-1.5 rounded-full border border-[#C9973B33] px-3 py-1.5 tracking-normal transition-colors hover:border-[#C9973B66] hover:text-[#C9973B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9973B]/60"
              aria-label="ГАН Админ панель руу орох — демо код 1234"
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect width="18" height="11" x="3" y="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Админ панель
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
