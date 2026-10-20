'use client'

import { useState } from 'react'
import { navigate } from '@/lib/hash-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FakePaymentModal } from '@/components/shared/demo-kit'
import { EmptyState, StatusBadge, fmtMNT } from '@/components/shared/admin-kit'
import { toast } from 'sonner'
import { CheckCircle2, ChevronRight, ShoppingBasket, Tag, Trash2, X } from 'lucide-react'
import { useApi } from '@/lib/use-api'
import { useCart } from './context'
import {
  CITIES,
  DELIVERY_FEE,
  FREE_DELIVERY_MIN,
  INK,
  INK_SOFT,
  LAST_ORDER_KEY,
  LINE,
  OLIVE,
  orderCode,
  type Product,
  type ShopOrder,
} from './constants'
import { QtyStepper, Photo } from './ui'

type CheckoutForm = {
  name: string
  phone: string
  email: string
  city: string
  address: string
  notes: string
}

type PlacedOrder = { code: string; phone: string; total: number; paymentStatus: string }

/** Демо промо кодууд — дууриалдсан хөнгөлөлт (бодит захиалга биш) */
const PROMO_CODES: Record<string, { pct: number; label: string }> = {
  'НАЙР10': { pct: 10, label: 'Хүргэлтийн найр — 10% хөнгөлөлт' },
  'DEMO10': { pct: 10, label: 'Демо хөнгөлөлт — 10%' },
}

function SuccessScreen({ placed }: { placed: PlacedOrder }) {
  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full" style={{ backgroundColor: '#EDEFDF' }}>
        <CheckCircle2 className="h-9 w-9" style={{ color: OLIVE }} />
      </div>
      <h1 className="nutag-display mt-5 text-3xl font-extrabold tracking-tight">Захиалга хүлээн авлаа!</h1>
      <p className="mt-2 text-sm leading-relaxed" style={{ color: INK_SOFT }}>
        Захиалгыг бүртгэж, баглааж эхэлнэ. Кодоо хадгалаарай — утасны дугаараар хайж мөн олох боломжтой.
      </p>

      <div className="mt-8 rounded-2xl border bg-white p-6 text-left shadow-[0_1px_3px_rgba(38,35,29,0.06)]" style={{ borderColor: LINE }}>
        <p className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: INK_SOFT }}>
          Захиалгын код
        </p>
        <p className="nutag-display mt-1 text-2xl font-extrabold tracking-wide" style={{ color: OLIVE }}>
          {placed.code}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <StatusBadge status="бүртгэгдсэн" />
          <StatusBadge status={placed.paymentStatus} />
        </div>
        <dl className="mt-4 space-y-1.5 text-sm">
          <div className="flex justify-between">
            <dt style={{ color: INK_SOFT }}>Нийт дүн</dt>
            <dd className="nutag-display font-extrabold" style={{ color: INK }}>
              {fmtMNT(placed.total)}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt style={{ color: INK_SOFT }}>Утас</dt>
            <dd className="font-semibold">{placed.phone}</dd>
          </div>
        </dl>
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button className="rounded-full text-white hover:brightness-110" style={{ backgroundColor: OLIVE }} onClick={() => navigate('/demo/nutag/orders')}>
          Захиалга харах
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
        <Button variant="outline" className="rounded-full border-2 bg-transparent font-semibold" style={{ borderColor: OLIVE, color: OLIVE }} onClick={() => navigate('/demo/nutag/shop')}>
          Дэлгүүр рүү буцах
        </Button>
      </div>
    </div>
  )
}

export function CartPage() {
  const { items, subtotal, setQty, remove, clear } = useCart()
  const { data: products } = useApi<Product>('products', items.length > 0)

  const [form, setForm] = useState<CheckoutForm>({ name: '', phone: '', email: '', city: '', address: '', notes: '' })
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutForm, string>>>({})
  const [payOpen, setPayOpen] = useState(false)
  const [lastOutcome, setLastOutcome] = useState<'approved' | 'rejected' | null>(null)
  const [placed, setPlaced] = useState<PlacedOrder | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)

  // Промо код (демо)
  const [promoInput, setPromoInput] = useState('')
  const [promo, setPromo] = useState<string | null>(null)
  const [promoError, setPromoError] = useState<string | null>(null)

  const applyPromo = () => {
    const code = promoInput.trim().toUpperCase()
    if (!code) {
      setPromoError('Промо кодоо оруулна уу.')
      return
    }
    if (PROMO_CODES[code]) {
      setPromo(code)
      setPromoInput('')
      setPromoError(null)
      toast.success(`Промо код «${code}» идэвхжлээ — ${PROMO_CODES[code].pct}% хөнгөлөлт (демо).`)
    } else {
      setPromoError('Код буруу буюу дууссан байна. Демо код: НАЙР10.')
    }
  }

  const removePromo = () => {
    setPromo(null)
    setPromoError(null)
    toast('Промо код хасагдлаа.')
  }

  const deliveryFee = items.length === 0 ? 0 : subtotal >= FREE_DELIVERY_MIN ? 0 : DELIVERY_FEE
  const discount = promo ? Math.round((subtotal * (PROMO_CODES[promo]?.pct ?? 0)) / 100) : 0
  const total = subtotal - discount + deliveryFee

  const set = (k: keyof CheckoutForm, v: string) => {
    setForm((f) => ({ ...f, [k]: v }))
    setErrors((e) => ({ ...e, [k]: undefined }))
  }

  const validate = (): boolean => {
    const e: Partial<Record<keyof CheckoutForm, string>> = {}
    if (form.name.trim().length < 2) e.name = 'Нэрээ оруулна уу (хамгийн багадаа 2 үсэг).'
    if (!/^\d{8}$/.test(form.phone.trim()))
      e.phone = 'Утасны дугаар 8 оронтой тоо байх ёстой (жишээ: 99112233).'
    if (form.email.trim() && !/^\S+@\S+\.\S+$/.test(form.email.trim()))
      e.email = 'Имэйл хаяг буруу форматтай байна.'
    if (!form.city) e.city = 'Хотыг сонгоно уу.'
    if (form.address.trim().length < 5) e.address = 'Хүргэх хаягаа бүрэн оруулна уу — хороо, гудамж, байр.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault()
    if (items.length === 0) return
    if (!validate()) {
      toast.error('Маягтын алдааг засна уу.')
      return
    }
    setPayOpen(true)
  }

  // Демо төлбөрийн үр дүнгээр захиалгыг API-д бүртгэнэ
  const processPayment = async (outcome: 'approved' | 'rejected') => {
    setLastOutcome(outcome)
    const paymentStatus = outcome === 'approved' ? 'төлөгдсөн' : 'төлөгдөөгүй'
    const payload = {
      customerName: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim() || null,
      city: form.city,
      address: form.address.trim(),
      items: items.map(({ id, name, price, qty, option }) => ({ id, name, price, qty, option: option ?? null })),
      subtotal,
      deliveryFee,
      total,
      status: 'бүртгэгдсэн',
      paymentStatus,
      // Промо кодыг тайлбарт хавсаргана (демо горим)
      notes: [form.notes.trim(), promo ? `Промо код: ${promo} (${PROMO_CODES[promo]?.pct}% хөнгөлөлт, демо)` : null]
        .filter(Boolean)
        .join(' — ') || null,
    }
    try {
      const res = await fetch('/api/shop-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('хадгалахад алдаа')
      const order = (await res.json()) as ShopOrder
      const next: PlacedOrder = {
        code: orderCode(order.id),
        phone: payload.phone,
        total,
        paymentStatus,
      }
      setPlaced(next)
      try {
        window.localStorage.setItem(LAST_ORDER_KEY, JSON.stringify({ phone: next.phone, code: next.code }))
      } catch {
        /* хадгалах боломжгүй */
      }
    } catch {
      setPlaced(null)
      toast.error('Захиалга хадгалахад алдаа гарлаа. Дахин оролдоно уу.')
      throw new Error('order-failed')
    }
  }

  const closePayment = () => {
    setPayOpen(false)
    if (!placed) return
    if (lastOutcome === 'rejected') {
      toast.info('Төлбөр татгалзсан тул захиалга «төлөгдөөгүй» төлөвтэй бүртгэгдлээ.')
    }
    clear()
    setShowSuccess(true)
  }

  if (showSuccess && placed) return <SuccessScreen placed={placed} />

  if (items.length === 0) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-16">
        <EmptyState
          icon={<ShoppingBasket className="h-5 w-5" style={{ color: OLIVE }} />}
          title="Сагс хоосон байна"
          description="Дуртай эдлэлээ дэлгүүрээс сонгоод сагслаарай — 80,000₮-аас дээш дүнд хүргэлт үнэгүй."
          action={
            <Button className="rounded-full text-white hover:brightness-110" style={{ backgroundColor: OLIVE }} onClick={() => navigate('/demo/nutag/shop')}>
              Дэлгүүр рүү
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10">
      <p className="text-[11px] font-bold uppercase tracking-[0.24em]" style={{ color: '#A0522D' }}>
        НУТАГ · САГС
      </p>
      <h1 className="nutag-display mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">Миний сагс</h1>
      <p className="mt-2 text-sm" style={{ color: INK_SOFT }}>
        {items.length} төрлийн бүтээгдэхүүн сагсанд байна.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        {/* Сагсны жагсаалт */}
        <ul className="space-y-4">
          {items.map((line) => {
            const key = `${line.id}::${line.option ?? ''}`
            const img = products.find((p) => p.id === line.id)?.imageUrl
            return (
              <li key={key} className="rounded-2xl border bg-white p-4 shadow-[0_1px_3px_rgba(38,35,29,0.05)]" style={{ borderColor: LINE }}>
                <div className="flex gap-4">
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border" style={{ borderColor: LINE }}>
                    <Photo src={img} alt={line.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="nutag-display font-bold leading-snug" style={{ color: INK }}>
                          {line.name}
                        </p>
                        {line.option && (
                          <p className="mt-0.5 text-xs" style={{ color: INK_SOFT }}>
                            Сонголт: {line.option}
                          </p>
                        )}
                        <p className="mt-0.5 text-xs" style={{ color: INK_SOFT }}>
                          {fmtMNT(line.price)} / ширхэг
                        </p>
                      </div>
                      <button
                        type="button"
                        aria-label={`${line.name}-г сагснаас хасах`}
                        onClick={() => {
                          remove(key)
                          toast(`${line.name} — сагснаас хасагдлаа`)
                        }}
                        className="rounded-full p-1.5 transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                        style={{ color: INK_SOFT }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <QtyStepper qty={line.qty} onChange={(q) => setQty(key, q)} />
                      <p className="nutag-display text-sm font-extrabold" style={{ color: OLIVE }}>
                        {fmtMNT(line.price * line.qty)}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>

        {/* Хураангуй + маягт */}
        <div className="space-y-6">
          <div className="rounded-2xl border bg-white p-5 shadow-[0_1px_3px_rgba(38,35,29,0.05)]" style={{ borderColor: LINE }}>
            <h2 className="nutag-display font-extrabold">Захиалгын хураангуй</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt style={{ color: INK_SOFT }}>Барааны дүн</dt>
                <dd className="font-semibold">{fmtMNT(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt style={{ color: INK_SOFT }}>Хүргэлтийн хөлс</dt>
                <dd className="font-semibold">
                  {deliveryFee === 0 ? <span style={{ color: OLIVE }}>Үнэгүй</span> : fmtMNT(deliveryFee)}
                </dd>
              </div>
              {promo && discount > 0 && (
                <div className="flex items-center justify-between">
                  <dt className="flex items-center gap-1.5" style={{ color: OLIVE }}>
                    <Tag className="h-3.5 w-3.5" aria-hidden="true" />
                    Хөнгөлөлт ({promo})
                    <button
                      type="button"
                      onClick={removePromo}
                      aria-label="Промо код хасах"
                      className="rounded-full p-0.5 transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </dt>
                  <dd className="font-semibold" style={{ color: OLIVE }}>
                    −{fmtMNT(discount)}
                  </dd>
                </div>
              )}
              {subtotal < FREE_DELIVERY_MIN && (
                <p className="rounded-xl px-3 py-2 text-xs" style={{ backgroundColor: '#EDEFDF', color: '#4C5A2E' }}>
                  Дахин {fmtMNT(FREE_DELIVERY_MIN - subtotal)} нэмбэл хүргэлт үнэгүй болно.
                </p>
              )}
              <div className="flex justify-between border-t pt-2.5" style={{ borderColor: LINE }}>
                <dt className="nutag-display font-extrabold">Нийт</dt>
                <dd className="nutag-display text-lg font-extrabold" style={{ color: OLIVE }}>
                  {fmtMNT(total)}
                </dd>
              </div>
            </dl>
          </div>

          {/* Промо код */}
          <div className="rounded-2xl border bg-white p-5 shadow-[0_1px_3px_rgba(38,35,29,0.05)]" style={{ borderColor: LINE }}>
            <h2 className="nutag-display flex items-center gap-2 font-extrabold">
              <Tag className="h-4 w-4" style={{ color: OLIVE }} aria-hidden="true" />
              Промо код
            </h2>
            {promo ? (
              <p
                className="mt-3 flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold"
                style={{ backgroundColor: '#EDEFDF', color: '#4C5A2E' }}
              >
                <span>
                  «{promo}» идэвхтэй — {PROMO_CODES[promo]?.pct}% хөнгөлөлт
                </span>
                <button
                  type="button"
                  onClick={removePromo}
                  aria-label="Промо код хасах"
                  className="rounded-full p-1 transition-colors hover:bg-white/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5A6B3F]"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </p>
            ) : (
              <>
                <div className="mt-3 flex gap-2">
                  <Input
                    value={promoInput}
                    onChange={(e) => {
                      setPromoInput(e.target.value)
                      setPromoError(null)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        applyPromo()
                      }
                    }}
                    placeholder="Жишээ: НАЙР10"
                    aria-label="Промо код"
                    aria-invalid={!!promoError}
                    className="border-[#E1DAC7] bg-white uppercase placeholder:normal-case focus-visible:ring-[#5A6B3F]"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="shrink-0 rounded-full border-2 bg-transparent font-semibold"
                    style={{ borderColor: OLIVE, color: OLIVE }}
                    onClick={applyPromo}
                  >
                    Ашиглах
                  </Button>
                </div>
                {promoError && <p className="mt-1.5 text-xs text-red-600" role="alert">{promoError}</p>}
                <p className="mt-2 text-xs" style={{ color: INK_SOFT }}>
                  Демо код: <span className="font-mono font-bold">НАЙР10</span> — 10% хөнгөлөлт.
                </p>
              </>
            )}
          </div>

          {/* Хүргэлтийн маягт */}
          <form onSubmit={submit} noValidate className="rounded-2xl border bg-white p-5 shadow-[0_1px_3px_rgba(38,35,29,0.05)]" style={{ borderColor: LINE }}>
            <h2 className="nutag-display font-extrabold">Хүргэлтийн мэдээлэл</h2>
            <div className="mt-4 space-y-3.5">
              <div className="space-y-1.5">
                <Label htmlFor="co-name">Нэр *</Label>
                <Input
                  id="co-name"
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                  placeholder="Жишээ: Сарантуяа Бат"
                  aria-invalid={!!errors.name}
                  className="border-[#E1DAC7] bg-white focus-visible:ring-[#5A6B3F]"
                />
                {errors.name && <p className="text-xs text-red-600">{errors.name}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="co-phone">Утас *</Label>
                <Input
                  id="co-phone"
                  value={form.phone}
                  onChange={(e) => set('phone', e.target.value.replace(/\D/g, '').slice(0, 8))}
                  inputMode="numeric"
                  placeholder="99112233"
                  aria-invalid={!!errors.phone}
                  className="border-[#E1DAC7] bg-white focus-visible:ring-[#5A6B3F]"
                />
                {errors.phone && <p className="text-xs text-red-600">{errors.phone}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="co-email">Имэйл (сонголттой)</Label>
                <Input
                  id="co-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => set('email', e.target.value)}
                  placeholder="name@example.com"
                  aria-invalid={!!errors.email}
                  className="border-[#E1DAC7] bg-white focus-visible:ring-[#5A6B3F]"
                />
                {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="co-city">Хот *</Label>
                <Select value={form.city} onValueChange={(v) => set('city', v)}>
                  <SelectTrigger
                    id="co-city"
                    aria-invalid={!!errors.city}
                    className="border-[#E1DAC7] bg-white focus:ring-[#5A6B3F]"
                  >
                    <SelectValue placeholder="Хот сонгох" />
                  </SelectTrigger>
                  <SelectContent>
                    {CITIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.city && <p className="text-xs text-red-600">{errors.city}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="co-address">Хаяг *</Label>
                <Textarea
                  id="co-address"
                  value={form.address}
                  onChange={(e) => set('address', e.target.value)}
                  placeholder="Хороо, гудамж, байрны дугаар, орц, дугаар…"
                  rows={3}
                  aria-invalid={!!errors.address}
                  className="border-[#E1DAC7] bg-white focus-visible:ring-[#5A6B3F]"
                />
                {errors.address && <p className="text-xs text-red-600">{errors.address}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="co-notes">Нэмэлт тайлбар (сонголттой)</Label>
                <Textarea
                  id="co-notes"
                  value={form.notes}
                  onChange={(e) => set('notes', e.target.value)}
                  placeholder="Жишээ: ажлын өдөр 18:00-ийн дараа хүргээрэй"
                  rows={2}
                  className="border-[#E1DAC7] bg-white focus-visible:ring-[#5A6B3F]"
                />
              </div>

              <Button
                type="submit"
                className="w-full rounded-full text-white hover:brightness-110 focus-visible:ring-[#5A6B3F]"
                style={{ backgroundColor: OLIVE }}
              >
                Захиалах · {fmtMNT(total)}
              </Button>
              <p className="text-center text-xs" style={{ color: INK_SOFT }}>
                Төлбөрийг демо системээр боловсруулна — бодит мөнгө авахгүй.
              </p>
            </div>
          </form>
        </div>
      </div>

      <FakePaymentModal
        open={payOpen}
        onClose={closePayment}
        amount={total}
        merchant="НУТАГ Store"
        accent={OLIVE}
        processPayment={processPayment}
      />
    </div>
  )
}
