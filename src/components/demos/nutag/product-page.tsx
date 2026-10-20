'use client'

import { useMemo, useState } from 'react'
import { DemoLink, navigate } from '@/lib/hash-router'
import { Button } from '@/components/ui/button'
import { useApi } from '@/lib/use-api'
import { toast } from 'sonner'
import { ChevronRight, Hand, Info, ShoppingBag, Truck } from 'lucide-react'
import { EmptyState, fmtMNT, LoadingState } from '@/components/shared/admin-kit'
import { useCart } from './context'
import {
  CATEGORY_LABEL,
  DELIVERY_FEE,
  FREE_DELIVERY_MIN,
  INK,
  INK_SOFT,
  LINE,
  OLIVE,
  optionText,
  type Product,
} from './constants'
import { Photo, Price, ProductCard, QtyStepper, SectionHead, StockBadge } from './ui'

/** Бүтээгдэхүүний дэлгэрэнгүй хэсэг — бүтээгдэхүүн бүрт key-ээр дахин эхэлнэ */
function ProductDetail({ product }: { product: Product }) {
  const { add } = useCart()

  // Хувилбаруудыг эхний утгуудаар эхлүүлнэ (компонент mount бүрт)
  const [picked, setPicked] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {}
    for (const g of product.options ?? []) {
      if (g.values.length > 0) init[g.name] = g.values[0]
    }
    return init
  })
  const [qty, setQty] = useState(1)

  const soldOut = product.stock <= 0
  const options = product.options ?? []

  const addToCart = () => {
    if (soldOut) return
    const opt = optionText(options.map((g) => picked[g.name]).filter(Boolean))
    const payload: { id: string; name: string; price: number; option?: string } = {
      id: product.id,
      name: product.name,
      price: product.price,
    }
    if (opt) payload.option = opt
    const res = add(payload, qty, product.stock)
    if (res === 'capped') {
      toast.info(`Сагсанд энэ бүтээгдэхүүний үлдэгдлийн хэмжээ (${product.stock}) нэмэгдсэн байна.`)
    } else {
      toast.success(`«${product.name}» сагсанд нэмэгдлээ`)
    }
  }

  return (
    <div className="nutag-ui grid gap-8 lg:grid-cols-2 lg:gap-12">
      {/* Зураг */}
      <div>
        <div
          className="overflow-hidden rounded-3xl border-4 border-white bg-[#ECE7D6] shadow-[0_20px_45px_-22px_rgba(38,35,29,0.35)]"
          style={{ outline: `1px solid ${LINE}` }}
        >
          <Photo src={product.imageUrl} alt={product.name} className="aspect-square w-full object-cover" />
        </div>
      </div>

      {/* Мэдээлэл */}
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.24em]" style={{ color: OLIVE }}>
          {CATEGORY_LABEL[product.category] ?? product.category}
        </p>
        <h1 className="nutag-display mt-2 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
          {product.name}
        </h1>

        <div className="mt-4">
          <Price price={product.price} oldPrice={product.oldPrice} size="lg" />
        </div>

        <div className="mt-3">
          <StockBadge stock={product.stock} />
        </div>

        <p className="mt-5 whitespace-pre-line text-[15px] leading-relaxed" style={{ color: INK_SOFT }}>
          {product.description}
        </p>

        {/* Хувилбарууд */}
        {options.map((g) => (
          <div key={g.name} className="mt-6">
            <p className="text-sm font-bold" style={{ color: INK }}>
              {g.name}
              <span className="ml-2 text-xs font-medium" style={{ color: INK_SOFT }}>
                {picked[g.name] ? `· ${picked[g.name]}` : ''}
              </span>
            </p>
            <div className="mt-2 flex flex-wrap gap-2" role="radiogroup" aria-label={g.name}>
              {g.values.map((v) => {
                const on = picked[g.name] === v
                return (
                  <button
                    key={v}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => setPicked((p) => ({ ...p, [g.name]: v }))}
                    className={`rounded-full border px-4 py-2 text-[13px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5A6B3F] ${
                      on ? 'text-white' : 'bg-white hover:bg-[#F4F1E6]'
                    }`}
                    style={on ? { backgroundColor: OLIVE, borderColor: OLIVE } : { borderColor: LINE, color: INK }}
                  >
                    {v}
                  </button>
                )
              })}
            </div>
          </div>
        ))}

        {/* Тоо + Сагслах */}
        <div className="mt-7 flex flex-wrap items-center gap-4">
          <QtyStepper qty={qty} onChange={setQty} max={Math.max(1, product.stock)} disabled={soldOut} />
          <Button
            size="lg"
            disabled={soldOut}
            className="rounded-full px-8 text-white hover:brightness-110 focus-visible:ring-[#5A6B3F] disabled:opacity-50"
            style={{ backgroundColor: OLIVE }}
            onClick={addToCart}
          >
            <ShoppingBag className="mr-2 h-4 w-4" />
            {soldOut ? 'Дууссан байна' : 'Сагслах'}
          </Button>
          <span className="text-sm font-semibold" style={{ color: INK_SOFT }}>
            Нийт:{' '}
            <span className="nutag-display font-extrabold" style={{ color: INK }}>
              {fmtMNT(product.price * qty)}
            </span>
          </span>
        </div>

        {/* Тэмдэглэл */}
        <div className="mt-7 space-y-2.5">
          <p
            className="flex items-start gap-2 rounded-xl border border-dashed px-4 py-3 text-[13px] leading-relaxed"
            style={{ borderColor: '#C9C2AC', color: INK_SOFT, backgroundColor: 'rgba(255,255,255,0.6)' }}
          >
            <Hand className="mt-0.5 h-4 w-4 shrink-0" style={{ color: '#A0522D' }} aria-hidden="true" />
            Гараар хийсэн тул бага зэрэг ялгаатай байж болно (жишээ).
          </p>
          <p
            className="flex items-start gap-2 rounded-xl border border-dashed px-4 py-3 text-[13px] leading-relaxed"
            style={{ borderColor: '#C9C2AC', color: INK_SOFT, backgroundColor: 'rgba(255,255,255,0.6)' }}
          >
            <Truck className="mt-0.5 h-4 w-4 shrink-0" style={{ color: OLIVE }} aria-hidden="true" />
            Хүргэлт {fmtMNT(DELIVERY_FEE)} — {fmtMNT(FREE_DELIVERY_MIN)}-аас дээш дүнтэй үед үнэгүй.
          </p>
          <p className="flex items-start gap-2 px-1 text-[12px]" style={{ color: INK_SOFT }}>
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            Демо дэлгүүрийн жишээ мэдээлэл ашигласан.
          </p>
        </div>
      </div>
    </div>
  )
}

export function ProductPage({ query }: { query: URLSearchParams }) {
  const { data: products, loading } = useApi<Product>('products')
  const id = query.get('id') ?? ''

  const product = useMemo(() => products.find((p) => p.id === id), [products, id])
  const related = useMemo(
    () =>
      product
        ? products
            .filter((p) => p.active && p.id !== product.id && p.category === product.category)
            .slice(0, 4)
        : [],
    [products, product]
  )

  if (loading) return <LoadingState label="Бүтээгдэхүүнийг ачаалж байна…" />

  if (!product)
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-20">
        <EmptyState
          title="Бүтээгдэхүүн олдсонгүй"
          description="Холбоос буруу эсвэл бүтээгдэхүүн хасагдсан байж болно."
          action={
            <Button className="rounded-full text-white hover:brightness-110" style={{ backgroundColor: OLIVE }} onClick={() => navigate('/demo/nutag/shop')}>
              Дэлгүүр рүү буцах
            </Button>
          }
        />
      </div>
    )

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-10">
      {/* Толовч */}
      <nav className="nutag-ui mb-6 flex items-center gap-1.5 text-[13px]" style={{ color: INK_SOFT }} aria-label="Толовч">
        <DemoLink
          href="/demo/nutag/shop"
          className="rounded font-semibold hover:text-[#5A6B3F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5A6B3F]"
        >
          Дэлгүүр
        </DemoLink>
        <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
        <DemoLink
          href={`/demo/nutag/shop?cat=${encodeURIComponent(product.category)}`}
          className="rounded font-semibold hover:text-[#5A6B3F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5A6B3F]"
        >
          {CATEGORY_LABEL[product.category] ?? product.category}
        </DemoLink>
        <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
        <span aria-current="page" className="truncate" style={{ color: INK }}>
          {product.name}
        </span>
      </nav>

      <ProductDetail key={product.id} product={product} />

      {/* Холбогдох бүтээгдэхүүн */}
      {related.length > 0 && (
        <section className="nutag-ui mt-16">
          <SectionHead kicker="ИЖИЛ АНГИЛАЛ" title="Холбогдох бүтээгдэхүүн" />
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
