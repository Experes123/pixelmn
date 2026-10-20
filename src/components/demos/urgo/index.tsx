'use client'

import { useState } from 'react'
import { useDemoRoute, DemoLink, navigate } from '@/lib/hash-router'
import { ReturnToMain } from '@/components/shared/demo-kit'
import { Menu as MenuIcon, X, ShoppingBasket } from 'lucide-react'
import { CartProvider, useCart } from './context'
import { HomePage } from './home'
import { MenuPage } from './menu-page'
import { CartPage } from './cart-page'
import { TrackPage } from './track-page'
import { AdminPage } from './admin-page'
import { CREAM, GREEN, GREEN_INK, KICKER_GREEN, SAGE_BORDER, TERRA } from './constants'

/** Демо доторх UI элементүүд Inter фонттой байна (гарчигууд Lora-г өвлөнө) */
const UI_STYLE = `.urgo-ui{font-family:var(--font-inter),ui-sans-serif,system-ui,sans-serif}`

const NAV: { label: string; sub: string }[] = [
  { label: 'Нүүр', sub: '' },
  { label: 'Цэс', sub: 'menu' },
  { label: 'Сагс', sub: 'cart' },
  { label: 'Захиалгын төлөв', sub: 'track' },
  { label: 'Админ панель', sub: 'admin' },
]

function Wordmark() {
  return (
    <DemoLink
      href="/demo/urgo"
      ariaLabel="ӨРГӨӨ Ресторан — нүүр хуудас"
      className="flex items-baseline gap-1.5"
    >
      <span className="text-xl font-bold tracking-wide sm:text-2xl" style={{ color: GREEN }}>
        ӨРГӨӨ
      </span>
      <span
        className="inline-block h-2 w-2 translate-y-[-2px] rounded-full"
        style={{ backgroundColor: TERRA }}
        aria-hidden="true"
      />
      <span
        className="hidden text-[10px] font-semibold uppercase tracking-[0.3em] sm:inline-block"
        style={{ color: KICKER_GREEN }}
      >
        Ресторан
      </span>
    </DemoLink>
  )
}

function CartBadge() {
  const { count } = useCart()
  if (count === 0) return null
  return (
    <span
      className="urgo-ui absolute -right-2 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full px-1 text-[10px] font-bold text-white"
      style={{ backgroundColor: TERRA }}
      aria-label={`Сагсанд ${count} бүтээгдэхүүн`}
    >
      {count}
    </span>
  )
}

function SiteHeader({ active }: { active: string }) {
  const [open, setOpen] = useState(false)
  return (
    <header
      className="sticky top-0 z-40 border-b backdrop-blur-md"
      style={{ backgroundColor: `${CREAM}D9`, borderColor: SAGE_BORDER }}
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 pl-[124px] pr-4 sm:pl-[210px]">
        <Wordmark />

        {/* Ширгэийн навигац */}
        <nav className="urgo-ui hidden items-center gap-1 md:flex" aria-label="Үндсэн цэс">
          {NAV.map((n) => {
            const isActive = active === n.sub
            return (
              <DemoLink
                key={n.sub}
                href={`/demo/urgo${n.sub ? '/' + n.sub : ''}`}
                className={`relative rounded-full px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B4552D] ${
                  isActive ? 'text-[#B4552D]' : 'text-[#1F3D2B] hover:text-[#B4552D]'
                }`}
              >
                <span className="relative inline-flex items-center gap-1.5">
                  {n.label}
                  {n.sub === 'cart' && <CartBadge />}
                </span>
                {isActive && (
                  <span
                    className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full"
                    style={{ backgroundColor: TERRA }}
                    aria-hidden="true"
                  />
                )}
              </DemoLink>
            )
          })}
        </nav>

        {/* Гарын илгээлт */}
        <div className="flex shrink-0 items-center gap-2 md:hidden">
          <DemoLink
            href="/demo/urgo/cart"
            ariaLabel="Сагс руу очих"
            className="relative rounded-full border p-2 focus-visible:outline-none focus-visible:ring-2"
          >
            <span className="relative inline-flex">
              <ShoppingBasket className="h-5 w-5" style={{ color: GREEN }} />
              <CartBadge />
            </span>
          </DemoLink>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label={open ? 'Цэсийг хаах' : 'Цэсийг нээх'}
            className="rounded-full border p-2 focus-visible:outline-none focus-visible:ring-2"
            style={{ borderColor: SAGE_BORDER, color: GREEN }}
          >
            {open ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          className="urgo-ui border-t px-4 pb-3 pt-2 md:hidden"
          style={{ borderColor: SAGE_BORDER }}
          aria-label="Гар утасны цэс"
        >
          {NAV.map((n) => {
            const isActive = active === n.sub
            return (
              <DemoLink
                key={n.sub}
                href={`/demo/urgo${n.sub ? '/' + n.sub : ''}`}
                onClick={() => setOpen(false)}
                className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium ${
                  isActive ? 'bg-[#B4552D]/10 text-[#B4552D]' : 'text-[#1F3D2B]'
                }`}
              >
                <span>{n.label}</span>
                {n.sub === 'cart' && <CartBadge />}
              </DemoLink>
            )
          })}
        </nav>
      )}
    </header>
  )
}

function SiteFooter() {
  return (
    <footer className="mt-auto" style={{ backgroundColor: GREEN, color: '#EDE8DC' }}>
      <div className="urgo-ui mx-auto grid w-full max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-2xl font-bold text-white">
            ӨРГӨӨ<span className="ml-1.5 inline-block h-2 w-2 rounded-full" style={{ backgroundColor: TERRA }} />
          </p>
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#9DB5A3]">
            Ресторан
          </p>
          <p className="mt-4 text-sm leading-relaxed text-[#C9D6CB]">
            Амт нь гэр шиг, орчин нь өргөө шиг. Уламжлалт монгол хоолыг гэрт тань халуунаар нь
            хүргэнэ.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-white">Ажлын цаг</p>
          <ul className="mt-3 space-y-1.5 text-sm text-[#C9D6CB]">
            <li>Даваа — Ням: 10:00 – 22:00</li>
            <li>Хүргэлт: 11:00 – 21:00</li>
            <li>Баярын өдрүүдэд хэвийн ажиллана</li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-white">Хүргэлтийн бүс</p>
          <ul className="mt-3 space-y-1.5 text-sm text-[#C9D6CB]">
            <li>Улаанбаатарын дотоод хороодууд</li>
            <li>Хугацаа: дунджаар 45–60 минут</li>
            <li>Хөлс: 5,000₮ · 50,000₮-аас дээш үнэгүй</li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-white">Холбоо барих</p>
          <ul className="mt-3 space-y-2 text-sm text-[#C9D6CB]">
            <li className="flex items-center gap-2">
              <span>Хаяг: Сүхбаатар дүүрэг, …</span>
              <span
                className="rounded-full border border-dashed border-[#9DB5A3] px-1.5 py-0.5 text-[10px] uppercase tracking-wider"
                title="Демо хувилбарт дараа шинэчилнэ"
              >
                шинэчлэх
              </span>
            </li>
            <li className="flex items-center gap-2">
              <span>Утас: 7000-XXXX</span>
              <span
                className="rounded-full border border-dashed border-[#9DB5A3] px-1.5 py-0.5 text-[10px] uppercase tracking-wider"
                title="Демо хувилбарт дараа шинэчилнэ"
              >
                шинэчлэх
              </span>
            </li>
          </ul>
        </div>
      </div>
      <div className="urgo-ui border-t border-white/10 px-4 py-4">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-xs text-[#9DB5A3] sm:flex-row">
          <p>© 2025 ӨРГӨӨ Ресторан · Демо төсөл — Pixelmn</p>
          <a
            href="#/demo/urgo/admin"
            className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 transition-colors hover:border-[#E4572E]/60 hover:text-[#E4572E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E4572E]/60"
            aria-label="ӨРГӨӨ Админ панель руу орох — демо код 1234"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect width="18" height="11" x="3" y="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Админ панель
          </a>
        </div>
      </div>
    </footer>
  )
}

export default function UrgoDemo() {
  const { sub } = useDemoRoute('urgo')

  // Админ панель — өөрийн бараан орчинтой, сүлжээний толгой/хөлгүй
  if (sub === 'admin') return <AdminPage />

  return (
    <CartProvider>
      <div
        className="flex min-h-screen flex-col"
        style={{ fontFamily: 'var(--font-lora),serif', background: CREAM, color: GREEN_INK }}
      >
        <style>{UI_STYLE}</style>
        <ReturnToMain accent={TERRA} />
        <SiteHeader active={sub} />
        <main className="flex-1">
          {sub === '' && <HomePage />}
          {sub === 'menu' && <MenuPage />}
          {sub === 'cart' && <CartPage />}
          {sub === 'track' && <TrackPage />}
          {!['', 'menu', 'cart', 'track'].includes(sub) && (
            <div className="mx-auto max-w-2xl px-4 py-24 text-center">
              <p className="text-sm text-[#3E6147]">Хуудас олдсонгүй.</p>
              <button
                type="button"
                onClick={() => navigate('/demo/urgo')}
                className="urgo-ui mt-4 rounded-full px-5 py-2 text-sm font-medium text-white"
                style={{ backgroundColor: TERRA }}
              >
                Нүүр рүү буцах
              </button>
            </div>
          )}
        </main>
        <SiteFooter />
      </div>
    </CartProvider>
  )
}
