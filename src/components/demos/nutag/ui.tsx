'use client'

import { useState, type ReactNode } from 'react'
import { DemoLink } from '@/lib/hash-router'
import { toast } from 'sonner'
import { ImageOff, Heart, Minus, PackageSearch, Plus } from 'lucide-react'
import { EmptyState, fmtMNT } from '@/components/shared/admin-kit'
import { useCart, useFavorites } from './context'
import { CARD_BG, INK, INK_SOFT, LINE, OLIVE, OLIVE_TINT, RUST, type Product } from './constants'

// ── Зураг (гадаад URL, ачаалж өгсөн бол нөөц блох) ───────────────────────────
export function Photo({
  src,
  alt,
  className = '',
}: {
  src?: string | null
  alt: string
  className?: string
}) {
  const [failed, setFailed] = useState(false)
  if (!src || failed) {
    return (
      <div
        className={`flex items-center justify-center bg-[#ECE7D6] text-[#B4AB92] ${className}`}
        role="img"
        aria-label={alt}
      >
        <ImageOff className="h-7 w-7" aria-hidden="true" />
      </div>
    )
  }
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  )
}

// ── Жижиг дээд шошго (kicker) ────────────────────────────────────────────────
export function Kicker({
  children,
  color = RUST,
  className = '',
}: {
  children: ReactNode
  color?: string
  className?: string
}) {
  return (
    <p
      className={`text-[11px] font-bold uppercase tracking-[0.24em] ${className}`}
      style={{ color }}
    >
      {children}
    </p>
  )
}

/** Хуудасны толгой — kicker + гарчиг + тайлбар */
export function PageHead({
  kicker,
  title,
  sub,
}: {
  kicker: string
  title: string
  sub?: string
}) {
  return (
    <div className="mb-8">
      <Kicker>{kicker}</Kicker>
      <h1 className="nutag-display mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
        {title}
      </h1>
      {sub && <p className="mt-2 max-w-2xl text-sm leading-relaxed" style={{ color: INK_SOFT }}>{sub}</p>}
    </div>
  )
}

/** Хэсгийн толгой — kicker + гарчиг + нэмэлт холбоос */
export function SectionHead({
  kicker,
  title,
  action,
}: {
  kicker: string
  title: string
  action?: ReactNode
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <Kicker>{kicker}</Kicker>
        <h2 className="nutag-display mt-1.5 text-2xl font-extrabold tracking-tight sm:text-3xl">
          {title}
        </h2>
      </div>
      {action}
    </div>
  )
}

/** Оёдлын тасархай шугам — гар урлалын мэдрэмж */
export function Stitch({ className = '' }: { className?: string }) {
  return (
    <div
      role="presentation"
      className={`border-t-2 border-dashed ${className}`}
      style={{ borderColor: LINE }}
    />
  )
}

// ── Үлдэгдлийн бэйдж ─────────────────────────────────────────────────────────
export function StockBadge({ stock }: { stock: number }) {
  if (stock <= 0)
    return (
      <span className="inline-flex items-center rounded-full border border-[#DDD8CB] bg-[#EFEBDE] px-2 py-0.5 text-[11px] font-semibold text-[#8B8574]">
        Дууссан
      </span>
    )
  if (stock <= 3)
    return (
      <span className="inline-flex items-center rounded-full border border-[#E7CFA6] bg-[#F8EEDC] px-2 py-0.5 text-[11px] font-semibold text-[#8A611F]">
        Зөвхөн {stock} ширхэг
      </span>
    )
  return (
    <span className="inline-flex items-center rounded-full border border-[#BFCBAA] bg-[#EDEFDF] px-2 py-0.5 text-[11px] font-semibold text-[#4C5A2E]">
      Бэлэн байна
    </span>
  )
}

// ── Үнэ ──────────────────────────────────────────────────────────────────────
export function Price({
  price,
  oldPrice,
  size = 'md',
}: {
  price: number
  oldPrice?: number | null
  size?: 'md' | 'lg'
}) {
  const off = oldPrice && oldPrice > price ? Math.round((1 - price / oldPrice) * 100) : 0
  return (
    <div className="flex flex-wrap items-baseline gap-2">
      <span
        className={`nutag-display font-extrabold ${size === 'lg' ? 'text-3xl' : 'text-lg'}`}
        style={{ color: INK }}
      >
        {fmtMNT(price)}
      </span>
      {off > 0 && (
        <>
          <span className="text-sm line-through" style={{ color: INK_SOFT }}>
            {fmtMNT(oldPrice!)}
          </span>
          <span className="rounded-full px-2 py-0.5 text-[10px] font-bold text-white" style={{ backgroundColor: RUST }}>
            -{off}%
          </span>
        </>
      )}
    </div>
  )
}

// ── Тооны хэмжигч ────────────────────────────────────────────────────────────
export function QtyStepper({
  qty,
  onChange,
  max = 99,
  disabled = false,
}: {
  qty: number
  onChange: (q: number) => void
  max?: number
  disabled?: boolean
}) {
  return (
    <div
      className={`inline-flex items-center gap-1 rounded-full border bg-white px-1 py-0.5 ${disabled ? 'opacity-50' : ''}`}
      style={{ borderColor: LINE }}
    >
      <button
        type="button"
        aria-label="Хасах"
        disabled={disabled || qty <= 1}
        onClick={() => onChange(qty - 1)}
        className="grid h-7 w-7 place-items-center rounded-full transition-colors hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5A6B3F] disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className="w-8 text-center text-sm font-bold" aria-live="polite">
        {qty}
      </span>
      <button
        type="button"
        aria-label="Нэмэх"
        disabled={disabled || qty >= max}
        onClick={() => onChange(qty + 1)}
        className="grid h-7 w-7 place-items-center rounded-full transition-colors hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5A6B3F] disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

// ── Бүтээгдэхүүний карт (нүүр, дэлгүүр, холбогдох хэсэгт ашиглана) ───────────
export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart()
  const { has: isFav, toggle: toggleFav } = useFavorites()
  const fav = isFav(product.id)
  const soldOut = product.stock <= 0
  const hasOptions = (product.options?.length ?? 0) > 0
  const detailHref = `/demo/nutag/product?id=${product.id}`

  const quickAdd = () => {
    const res = add({ id: product.id, name: product.name, price: product.price }, 1, product.stock)
    if (res === 'capped') {
      toast.info('Сагсанд энэ бүтээгдэхүүний хангалттай хэмжээ нэмэгдсэн байна.')
    } else {
      toast.success(`«${product.name}» сагсанд нэмэгдлээ`)
    }
  }

  return (
    <div
      className="group flex flex-col overflow-hidden rounded-2xl border bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-12px_rgba(38,35,29,0.25)] focus-within:ring-2 focus-within:ring-[#5A6B3F]"
      style={{ borderColor: LINE, backgroundColor: CARD_BG }}
    >
      <DemoLink
        href={detailHref}
        ariaLabel={`${product.name} — дэлгэрэнгүй үзэх`}
        className="relative block aspect-square overflow-hidden rounded-t-2xl bg-[#ECE7D6]"
      >
        <Photo
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
        />
        {product.oldPrice && product.oldPrice > product.price && (
          <span
            className="absolute left-3 top-3 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white"
            style={{ backgroundColor: RUST }}
          >
            Хямдрал
          </span>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            toggleFav(product.id)
            toast.success(
              isFav(product.id)
                ? `«${product.name}» хадгалсанаас хасагдлаа`
                : `«${product.name}» хадгалсан жагсаалтад нэмэгдлээ`
            )
          }}
          aria-pressed={fav}
          aria-label={fav ? `${product.name} — хадгалсаас хасах` : `${product.name} — хадгалах`}
          className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full border bg-white/92 shadow-sm backdrop-blur transition-all hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5A6B3F]"
          style={{ borderColor: fav ? RUST : LINE }}
        >
          <Heart
            className="h-4 w-4 transition-colors"
            style={{ color: fav ? RUST : INK_SOFT }}
            fill={fav ? RUST : 'none'}
            aria-hidden
          />
        </button>
        {soldOut && (
          <span className="absolute inset-0 grid place-items-center bg-white/55">
            <span
              className="rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider"
              style={{ borderColor: LINE, color: INK_SOFT, backgroundColor: 'rgba(255,255,255,0.9)' }}
            >
              Дууссан
            </span>
          </span>
        )}
      </DemoLink>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: OLIVE }}>
          {product.category}
        </p>
        <DemoLink href={detailHref} className="mt-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5A6B3F]">
          <h3 className="nutag-display line-clamp-2 font-bold leading-snug" style={{ color: INK }}>
            {product.name}
          </h3>
        </DemoLink>

        <div className="mt-2">
          <Price price={product.price} oldPrice={product.oldPrice} />
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 pt-3">
          <StockBadge stock={product.stock} />
          {soldOut || hasOptions ? (
            <DemoLink
              href={detailHref}
              className="rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-[#F4F1E6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5A6B3F]"
              style={{ borderColor: LINE, color: INK }}
            >
              {soldOut ? 'Дэлгэрэнгүй' : 'Сонгох'}
            </DemoLink>
          ) : (
            <button
              type="button"
              onClick={quickAdd}
              aria-label={`${product.name} — сагслах`}
              className="rounded-full px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5A6B3F] focus-visible:ring-offset-1"
              style={{ backgroundColor: OLIVE }}
            >
              Сагслах
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

/** Ачааллын хоосон карт */
export function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border bg-white" style={{ borderColor: LINE }} aria-hidden="true">
      <div className="aspect-square animate-pulse bg-[#ECE7D6]" />
      <div className="space-y-2 p-4">
        <div className="h-3 w-16 animate-pulse rounded bg-[#ECE7D6]" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-[#ECE7D6]" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-[#ECE7D6]" />
      </div>
    </div>
  )
}

/** Жагсаалт хоосон үед */
export function NotFound({ title, description }: { title: string; description?: string }) {
  return (
    <EmptyState
      icon={<PackageSearch className="h-5 w-5" style={{ color: OLIVE }} />}
      title={title}
      description={description}
    />
  )
}

export const oliveChip = 'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider'
export const chipStyle = { backgroundColor: OLIVE_TINT, color: OLIVE }
