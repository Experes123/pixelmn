'use client'

/**
 * ТЭМҮҮР Групп — Header (sticky, paper blur, Sheet mobile menu) + Footer (graphite).
 */

import { Menu } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { DemoBadge } from '@/components/shared/demo-kit'
import { DemoLink } from '@/lib/hash-router'
import { SERIF, SANS, scrollToId } from './config'

const NAV: { id: string; label: string }[] = [
  { id: 'top', label: 'Нүүр' },
  { id: 'about', label: 'Бидний тухай' },
  { id: 'services', label: 'Үйл ажиллагаа' },
  { id: 'projects', label: 'Төслүүд' },
  { id: 'team', label: 'Хамт олон' },
  { id: 'contact', label: 'Холбоо барих' },
]

/** Лого — serif caps wordmark + зэс квадрат цэг */
export function Wordmark({ small = false, onClick }: { small?: boolean; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex items-baseline gap-1.5 rounded-sm text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8A5A2B] focus-visible:ring-offset-2"
      aria-label="ТЭМҮҮР Групп — нүүр хэсэг рүү гүйлгэх"
    >
      <span
        className={`font-semibold tracking-[0.14em] transition-colors group-hover:text-[#8A5A2B] ${
          small ? 'text-base' : 'text-lg sm:text-xl'
        }`}
        style={{ fontFamily: SERIF }}
      >
        ТЭМҮҮР
      </span>
      <span className="h-[7px] w-[7px] shrink-0 self-center bg-[#8A5A2B]" aria-hidden="true" />
      <span className="text-[10px] font-medium tracking-[0.34em] text-[#6E6862]">ГРУПП</span>
    </button>
  )
}

export function Header() {
  const go = (id: string) => {
    if (id === 'top') window.scrollTo({ top: 0, behavior: 'smooth' })
    else scrollToId(id)
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[#E1DCD2] bg-[#F6F5F2]/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-3 pl-[126px] pr-4 sm:pl-[196px] sm:pr-6">
        <Wordmark onClick={() => go('top')} />

        {/* Desktop nav */}
        <nav aria-label="Үндсэн цэс" className="hidden items-center gap-5 lg:flex" style={{ fontFamily: SANS }}>
          {NAV.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => go(n.id)}
              className="group relative py-1 text-[13px] font-medium text-[#1D2126]/80 transition-colors hover:text-[#1D2126] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8A5A2B]"
            >
              {n.label}
              <span
                className="absolute -bottom-0.5 left-0 h-px w-0 bg-[#8A5A2B] transition-all duration-300 group-hover:w-full"
                aria-hidden="true"
              />
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <DemoBadge className="hidden border-[#8A5A2B]/40 bg-[#8A5A2B]/10 text-[#8A5A2B] sm:inline-flex" />
          <DemoLink
            href="/demo/temuur/admin"
            className="hidden rounded-sm border border-[#1D2126]/25 px-3 py-1.5 text-[12px] font-medium tracking-wide text-[#1D2126] transition-colors hover:border-[#8A5A2B] hover:text-[#8A5A2B] md:inline-flex"
          >
            Админ панель
          </DemoLink>

          {/* Mobile Sheet menu */}
          <Sheet>
            <SheetTrigger asChild>
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-[#1D2126]/20 text-[#1D2126] transition-colors hover:border-[#8A5A2B] hover:text-[#8A5A2B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8A5A2B] lg:hidden"
                aria-label="Цэс нээх"
              >
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[78%] max-w-xs border-l border-[#E1DCD2] bg-[#F6F5F2] p-6 sm:max-w-xs"
              style={{ fontFamily: SANS }}
            >
              <SheetHeader className="p-0">
                <SheetTitle asChild>
                  <div>
                    <Wordmark />
                  </div>
                </SheetTitle>
                <SheetDescription className="sr-only">
                  ТЭМҮҮР Группын мобайл цэс
                </SheetDescription>
              </SheetHeader>
              <nav className="mt-4 flex flex-col" aria-label="Мобайл цэс">
                {NAV.map((n) => (
                  <SheetTrigger asChild key={n.id}>
                    <button
                      type="button"
                      onClick={() => go(n.id)}
                      className="border-b border-[#E1DCD2] py-3.5 text-left text-[15px] font-medium text-[#1D2126] transition-colors hover:text-[#8A5A2B]"
                    >
                      {n.label}
                    </button>
                  </SheetTrigger>
                ))}
              </nav>
              <DemoLink
                href="/demo/temuur/admin"
                className="mt-6 inline-flex w-full items-center justify-center rounded-sm border border-[#1D2126]/25 px-3 py-2.5 text-[13px] font-medium text-[#1D2126] transition-colors hover:border-[#8A5A2B] hover:text-[#8A5A2B]"
              >
                Админ панель
              </DemoLink>
              <p className="mt-4 text-center text-[11px] text-[#6E6862]">
                Танилцуулгын жишээ вэбсайт (концепт брэнд)
              </p>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

/** Footer доторх гүйлгэлтийн холбоос (module түвшинд тодорхойлсон) */
function FLink({ id, children }: { id: string; children: string }) {
  return (
    <button
      type="button"
      onClick={() => {
        if (id === 'top') window.scrollTo({ top: 0, behavior: 'smooth' })
        else scrollToId(id)
      }}
      className="text-left text-[13px] text-[#F6F5F2]/70 transition-colors hover:text-[#B98A55] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B98A55]"
    >
      {children}
    </button>
  )
}

export function Footer() {
  return (
    <footer className="mt-auto bg-[#191C20] text-[#F6F5F2]" style={{ fontFamily: SANS }}>
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-12 md:gap-8">
        {/* Intro */}
        <div className="md:col-span-5">
          <div className="flex items-baseline gap-1.5">
            <span
              className="text-xl font-semibold tracking-[0.14em] text-[#F6F5F2]"
              style={{ fontFamily: SERIF }}
            >
              ТЭМҮҮР
            </span>
            <span className="h-[7px] w-[7px] self-center bg-[#B98A55]" aria-hidden="true" />
            <span className="text-[10px] font-medium tracking-[0.34em] text-[#F6F5F2]/60">
              ГРУПП
            </span>
          </div>
          <p className="mt-4 max-w-sm text-[13px] leading-relaxed text-[#F6F5F2]/65">
            Дэд бүтцийн инженерчлэл, барилгын гүйцэтгэл, урт хугацааны хамтын ажиллагаа — бидний
            гурван тулгуур.
          </p>
          <p className="mt-4 inline-flex rounded-sm border border-[#B98A55]/40 px-2.5 py-1 text-[11px] text-[#B98A55]">
            Танилцуулгын жишээ вэбсайт (концепт брэнд)
          </p>
        </div>

        {/* Nav columns */}
        <div className="md:col-span-2">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#B98A55]">
            Компани
          </p>
          <ul className="space-y-2.5">
            <li><FLink id="top">Нүүр</FLink></li>
            <li><FLink id="about">Бидний тухай</FLink></li>
            <li><FLink id="team">Хамт олон</FLink></li>
            <li><FLink id="contact">Холбоо барих</FLink></li>
          </ul>
        </div>
        <div className="md:col-span-2">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#B98A55]">
            Үйл ажиллагаа
          </p>
          <ul className="space-y-2.5">
            <li><FLink id="services">Үйлчилгээ</FLink></li>
            <li><FLink id="projects">Төслүүд</FLink></li>
          </ul>
        </div>

        {/* Contact placeholders */}
        <div className="md:col-span-3">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#B98A55]">
            Холбоо барих
          </p>
          <ul className="space-y-2.5 text-[13px] text-[#F6F5F2]/70">
            <li>Утас: +976 XXXX-XXXX <span className="text-[#F6F5F2]/40">(шинэчлэх)</span></li>
            <li>Имэйл: info@temuur.example <span className="text-[#F6F5F2]/40">(шинэчлэх)</span></li>
            <li>Хаяг: Улаанбаатар хот <span className="text-[#F6F5F2]/40">(шинэчлэх)</span></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[#F6F5F2]/10">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-3 px-4 py-5 text-[12px] text-[#F6F5F2]/45 sm:flex-row sm:items-center sm:px-6">
          <p>© 2025 ТЭМҮҮР Групп. Бүх эрх хуулиар хамгаалагдсан.</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <p>Танилцуулгын жишээ вэбсайт — бодит компани биш, концепт брэнд.</p>
            <a
              href="#/demo/temuur/admin"
              className="inline-flex items-center gap-1.5 rounded-sm border border-[#B98A55]/35 px-3 py-1.5 text-[11px] tracking-wide text-[#B98A55]/80 transition-colors hover:border-[#B98A55]/70 hover:text-[#B98A55] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B98A55]/60"
              aria-label="ТЭМҮҮР Админ панель руу орох — демо код 1234"
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
