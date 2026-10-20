'use client'

/**
 * ШОНХОР Gaming Café — сайт бүхий хэсгийн header / footer
 */

import { useState } from 'react'
import { Menu, Clock, MapPin, Phone } from 'lucide-react'
import { DemoLink } from '@/lib/hash-router'
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
import { NEON, BTN_GHOST, DARK_PORTAL } from './shared'

const NAV = [
  { label: 'Нүүр', path: '/demo/pc-cafe', sub: '' },
  { label: 'Захиалга', path: '/demo/pc-cafe/booking', sub: 'booking' },
  { label: 'Миний захиалга', path: '/demo/pc-cafe/status', sub: 'status' },
  { label: 'Админ панель', path: '/demo/pc-cafe/admin', sub: 'admin' },
]

/** Ангуляр логотип — дөрвөлжин фреймд цахилгаан шунгалагч */
export function Logo({ size = 34 }: { size?: number }) {
  return (
    <span className="flex items-center gap-2.5">
      <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
        <polygon
          points="1,1 31,1 31,21 21,31 1,31"
          fill="#0A1F16"
          stroke={NEON}
          strokeWidth="1.5"
        />
        <polygon points="18,6 9,17 14,17 12,26 23,13 16.5,13" fill={NEON} />
      </svg>
      <span className="leading-none">
        <span className="block text-lg tracking-wide" style={{ fontFamily: 'var(--font-russo)', color: NEON }}>
          ШОНХОР
        </span>
        <span className="block font-mono text-[9px] tracking-[0.38em] text-[#E7F5EC99]">GAMING CAFÉ</span>
      </span>
    </span>
  )
}

/** Зүүн талын тогтмол ReturnToMain товчинд зориулсан зай */
function Spacer() {
  return <span aria-hidden className="w-[118px] shrink-0 sm:w-[206px]" />
}

export function SiteHeader({ sub }: { sub: string }) {
  const [open, setOpen] = useState(false)

  return (
    <header
      className="sticky top-0 z-40 border-b border-[#2CE08026]"
      style={{ background: 'rgba(4,17,11,0.88)', backdropFilter: 'blur(10px)' }}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 pl-4 pr-4">
        <Spacer />
        <DemoLink href="/demo/pc-cafe" className="mr-auto" ariaLabel="ШОНХОР нүүр хуудас">
          <Logo />
        </DemoLink>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Үндсэн цэс">
          {NAV.map((n) => {
            const active = n.sub === sub
            return (
              <DemoLink
                key={n.path}
                href={n.path}
                className={`relative px-3 py-2 text-sm transition-colors ${
                  active ? 'font-semibold text-[#2CE080]' : 'text-[#E7F5ECCC] hover:text-[#2CE080]'
                }`}
              >
                {n.label}
                {active && (
                  <span
                    aria-hidden
                    className="absolute inset-x-2 -bottom-[5px] h-[2px]"
                    style={{ background: NEON, boxShadow: `0 0 8px ${NEON}` }}
                  />
                )}
              </DemoLink>
            )
          })}
          <DemoBadge className="ml-2 border-[#2CE08066] bg-[#2CE08014] text-[#2CE080]" />
        </nav>

        {/* Мобайл цэс */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className={`${BTN_GHOST} md:hidden`}
              aria-label="Цэс нээх"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className={`${DARK_PORTAL} w-72 border-[#2CE08033] bg-[#04110B] text-[#E7F5EC]`}
          >
            <SheetHeader>
              <SheetTitle className="text-left">
                <Logo size={30} />
              </SheetTitle>
              <SheetDescription className="text-left text-[#E7F5EC99]">
                Цэс — демо горим
              </SheetDescription>
            </SheetHeader>
            <nav className="mt-2 flex flex-col gap-1 px-4" aria-label="Мобайл цэс">
              {NAV.map((n) => (
                <DemoLink
                  key={n.path}
                  href={n.path}
                  onClick={() => setOpen(false)}
                  className={`rounded-none border px-3 py-2.5 font-mono text-sm uppercase tracking-wider transition-colors ${
                    n.sub === sub
                      ? 'border-[#2CE08066] bg-[#2CE08014] text-[#2CE080]'
                      : 'border-transparent text-[#E7F5ECCC] hover:border-[#2CE08033] hover:text-[#2CE080]'
                  }`}
                >
                  {n.label}
                </DemoLink>
              ))}
              <span className="pt-3">
                <DemoBadge className="border-[#2CE08066] bg-[#2CE08014] text-[#2CE080]" />
              </span>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}

export function SiteFooter() {
  const year = new Date().getFullYear()
  return (
    <footer className="mt-auto border-t border-[#2CE08026] bg-[#06150E]">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-3 max-w-xs text-sm text-[#E7F5EC99]">
            Киберспортын зэрэглэлийн тоног төхөөрөмжтэй геймерийн орон зай. Ирээдүйн тэмцээнд бэлд.
          </p>
        </div>
        <div>
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.25em]" style={{ color: NEON }}>
            Цагийн хуваарь
          </p>
          <ul className="space-y-2 text-sm text-[#E7F5ECCC]">
            <li className="flex items-start gap-2">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-[#2CE080AA]" aria-hidden />
              <span>
                <strong className="text-[#E7F5EC]">24/7</strong> — байнгын ажиллагаа
                <br />
                <span className="text-[#E7F5EC88]">(демо мэдээлэл — шинэчлэх)</span>
              </span>
            </li>
          </ul>
        </div>
        <div>
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.25em]" style={{ color: NEON }}>
            Хаяг, холбоо
          </p>
          <ul className="space-y-2 text-sm text-[#E7F5ECCC]">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#2CE080AA]" aria-hidden />
              <span>
                Улаанбаатар, Сүхбаатар дүүрэг, … (шинэчлэх)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#2CE080AA]" aria-hidden />
              <span className="font-mono">+976 7000-XXXX (шинэчлэх)</span>
            </li>
          </ul>
        </div>
        <div>
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.25em]" style={{ color: NEON }}>
            Холбоос
          </p>
          <ul className="space-y-2 text-sm">
            {NAV.filter((n) => n.sub !== 'admin').map((n) => (
              <li key={n.path}>
                <DemoLink href={n.path} className="text-[#E7F5ECCC] transition-colors hover:text-[#2CE080]">
                  {n.label}
                </DemoLink>
              </li>
            ))}
            <li>
              <DemoLink href="/demo/pc-cafe/admin" className="text-[#A3E63599] transition-colors hover:text-[#A3E635]">
                Админ панель
              </DemoLink>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[#2CE0801A] px-4 py-4 text-center font-mono text-[11px] text-[#E7F5EC66]">
        © {year} ШОНХОР Gaming Café — Демо төсөл · Pixelmn
      </div>
    </footer>
  )
}
