'use client'

import { useState } from 'react'
import { DemoLink, navigate, useDemoRoute } from '@/lib/hash-router'
import { ReturnToMain } from '@/components/shared/demo-kit'
import { Menu as MenuIcon, ShoppingBasket, Store } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { CartProvider, useCart } from './context'
import { HomePage } from './home'
import { ShopPage } from './shop'
import { ProductPage } from './product-page'
import { CartPage } from './cart-page'
import { OrdersPage } from './orders-page'
import { AdminPage } from './admin-page'
import { INK, INK_SOFT, LINE, OLIVE, RUST, SAND } from './constants'

/** Демо доторх фонт: гарчиг Manrope, бие Inter; shadcn порталуудад мөн хэрэглэнэ */
const GLOBAL_CSS = `
.nutag-display{font-family:var(--font-manrope),ui-sans-serif,system-ui,sans-serif;letter-spacing:-0.01em}
.nutag-ui{font-family:var(--font-inter),ui-sans-serif,system-ui,sans-serif}
`

const NAV: { label: string; sub: string | string[] }[] = [
  { label: 'Нүүр', sub: '' },
  { label: 'Дэлгүүр', sub: ['shop', 'product'] },
  { label: 'Сагс', sub: 'cart' },
  { label: 'Миний захиалга', sub: 'orders' },
  { label: 'Админ панель', sub: 'admin' },
]

const isActiveNav = (active: string, sub: string | string[]) =>
  Array.isArray(sub) ? sub.includes(active) : active === sub

function Wordmark() {
  return (
    <DemoLink
      href="/demo/nutag"
      ariaLabel="НУТАГ Store — нүүр хуудас"
      className="flex items-baseline gap-1.5 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5A6B3F]"
    >
      <span className="nutag-display text-2xl font-extrabold tracking-tight" style={{ color: OLIVE }}>
        НУТАГ
      </span>
      <span
        className="text-[10px] font-bold uppercase tracking-[0.3em]"
        style={{ color: RUST }}
      >
        Store
      </span>
    </DemoLink>
  )
}

function CartBadge() {
  const { count } = useCart()
  if (count === 0) return null
  return (
    <span
      className="nutag-ui absolute -right-2.5 -top-1.5 grid min-w-[18px] place-items-center rounded-full px-1 text-[10px] font-bold text-white"
      style={{ backgroundColor: RUST, height: 18 }}
      aria-label={`Сагсанд ${count} ширхэг бүтээгдэхүүн`}
    >
      {count}
    </span>
  )
}

function NavLinks({ active, onNavigate }: { active: string; onNavigate?: () => void }) {
  return (
    <>
      {NAV.map((n) => {
        const on = isActiveNav(active, n.sub)
        return (
          <DemoLink
            key={n.label}
            href={`/demo/nutag${typeof n.sub === 'string' && n.sub ? '/' + n.sub : ''}`}
            onClick={onNavigate}
            ariaLabel={`${n.label} хуудас руу очих`}
            className={`relative inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5A6B3F] ${
              on ? 'text-white' : 'hover:text-[#5A6B3F]'
            }`}
            style={{ color: on ? '#FFFFFF' : INK, ...(on ? { backgroundColor: OLIVE } : {}) }}
          >
            {n.label === 'Сагс' ? (
              <span className="relative inline-flex items-center">
                <ShoppingBasket className="mr-1.5 h-4 w-4" aria-hidden="true" />
                Сагс
                <CartBadge />
              </span>
            ) : (
              n.label
            )}
          </DemoLink>
        )
      })}
    </>
  )
}

function SiteHeader({ active }: { active: string }) {
  const [open, setOpen] = useState(false)

  return (
    <header
      className="nutag-ui sticky top-0 z-40 border-b backdrop-blur-md"
      style={{ backgroundColor: `${SAND}E6`, borderColor: LINE }}
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 pl-[118px] pr-4 sm:pl-[210px]">
        <Wordmark />

        {/* Ширгээний навигац */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Үндсэн цэс">
          <NavLinks active={active} />
        </nav>

        {/* Гар утасны цэс */}
        <div className="flex items-center gap-2 md:hidden">
          <DemoLink
            href="/demo/nutag/cart"
            ariaLabel="Сагс руу очих"
            className="relative rounded-full border p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5A6B3F]"
            style={{ borderColor: LINE, color: OLIVE }}
          >
            <span className="relative inline-flex">
              <ShoppingBasket className="h-5 w-5" />
              <CartBadge />
            </span>
          </DemoLink>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label="Цэс нээх"
                aria-expanded={open}
                className="rounded-full border p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5A6B3F]"
                style={{ borderColor: LINE, color: OLIVE }}
              >
                <MenuIcon className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="nutag-ui w-72" style={{ backgroundColor: SAND }}>
              <SheetHeader className="border-b" style={{ borderColor: LINE }}>
                <SheetTitle asChild>
                  <div>
                    <Wordmark />
                  </div>
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1.5 px-1" aria-label="Гар утасны цэс">
                <NavLinks active={active} onNavigate={() => setOpen(false)} />
              </nav>
              <p className="mt-auto px-4 pb-6 text-xs" style={{ color: INK_SOFT }}>
                Демо дэлгүүр — жишээ бүтээгдэхүүн, демо төлбөртэй.
              </p>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

function SiteFooter() {
  return (
    <footer className="nutag-ui mt-auto" style={{ backgroundColor: '#26231D', color: '#D8D3C4' }}>
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="nutag-display text-2xl font-extrabold text-white">
            НУТАГ
            <span className="ml-1.5 text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: '#B7A98C' }}>
              Store
            </span>
          </p>
          <p className="mt-3 text-sm leading-relaxed" style={{ color: '#B7B2A2' }}>
            Гараар хийсэн монгол бүтээгдэхүүний дэлгүүр — арьсан эдлэл, эсгий, нутгийн цай, гэр
            ахуй, аяллын хэрэгсэл нэг дор.
          </p>
        </div>

        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-white">Хуудсууд</p>
          <ul className="mt-3 space-y-2 text-sm">
            {[
              { label: 'Нүүр', href: '/demo/nutag' },
              { label: 'Дэлгүүр', href: '/demo/nutag/shop' },
              { label: 'Сагс', href: '/demo/nutag/cart' },
              { label: 'Миний захиалга', href: '/demo/nutag/orders' },
              { label: 'Админ панель', href: '/demo/nutag/admin' },
            ].map((l) => (
              <li key={l.href}>
                <DemoLink href={l.href} className="rounded transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40">
                  {l.label}
                </DemoLink>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-white">Хүргэлт</p>
          <ul className="mt-3 space-y-2 text-sm" style={{ color: '#B7B2A2' }}>
            <li>Улаанбаатар, Дархан, Эрдэнэт болон бусад хот</li>
            <li>Хөлс: 6,000₮</li>
            <li>80,000₮-аас дээш дүнд хүргэлт үнэгүй</li>
            <li>Баглааж бэлтгэх: 1–2 хоног</li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-white">Ангиллууд</p>
          <ul className="mt-3 space-y-2 text-sm">
            {['арьсан эдлэл', 'эсгий бүтээгдэхүүн', 'цай', 'гэр ахуй', 'аялал'].map((c) => (
              <li key={c}>
                <DemoLink
                  href={`/demo/nutag/shop?cat=${encodeURIComponent(c)}`}
                  className="capitalize rounded transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                >
                  {c}
                </DemoLink>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t px-4 py-4 text-center text-xs" style={{ borderColor: 'rgba(255,255,255,0.08)', color: '#8B8574' }}>
        © 2025 НУТАГ Store · Демо дэлгүүр — жишээ мэдээлэл, демо төлбөртэй · Pixelmn
      </div>
    </footer>
  )
}

export default function NutagDemo() {
  const { sub, query } = useDemoRoute('nutag')

  // Админ панель — өөрийн орчинтой, дэлгүүрийн толгой/хөлгүй
  if (sub === 'admin') return <AdminPage />

  return (
    <CartProvider>
      <div
        className="flex min-h-screen flex-col"
        style={{ fontFamily: 'var(--font-inter), ui-sans-serif, system-ui, sans-serif', background: SAND, color: INK }}
      >
        <style>{GLOBAL_CSS}</style>
        <ReturnToMain accent={OLIVE} />
        <SiteHeader active={sub} />
        <main className="nutag-ui flex-1">
          {sub === '' && <HomePage />}
          {sub === 'shop' && <ShopPage key={`shop-${query.get('cat') ?? ''}`} query={query} />}
          {sub === 'product' && <ProductPage query={query} />}
          {sub === 'cart' && <CartPage />}
          {sub === 'orders' && <OrdersPage />}
          {!['', 'shop', 'product', 'cart', 'orders'].includes(sub) && (
            <div className="mx-auto max-w-2xl px-4 py-24 text-center">
              <Store className="mx-auto h-8 w-8" style={{ color: OLIVE }} aria-hidden="true" />
              <p className="mt-4 text-sm" style={{ color: INK_SOFT }}>
                Хуудас олдсонгүй.
              </p>
              <button
                type="button"
                onClick={() => navigate('/demo/nutag')}
                className="mt-4 rounded-full px-5 py-2 text-sm font-semibold text-white transition-colors hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5A6B3F]"
                style={{ backgroundColor: OLIVE }}
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
