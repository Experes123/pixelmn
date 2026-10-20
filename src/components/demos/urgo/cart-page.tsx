'use client'

import { useEffect, useState } from 'react'
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
import {
  CheckCircle2,
  ChevronRight,
  Clock,
  Minus,
  Plus,
  ShoppingBasket,
  Trash2,
} from 'lucide-react'
import { useCart } from './context'
import {
  ASAP_WINDOW,
  CARD_BG,
  DELIVERY_FEE,
  FREE_DELIVERY_MIN,
  GREEN,
  KICKER_GREEN,
  LAST_ORDER_KEY,
  SAGE_BORDER,
  TERRA,
  deliveryWindowOptions,
  orderCode,
  type OrderData,
} from './constants'

type CheckoutForm = { name: string; phone: string; address: string; notes: string; deliveryWindow: string }
type PlacedOrder = { code: string; phone: string; total: number; paymentStatus: string; deliveryWindow: string }

function QtyStepper({ qty, onChange }: { qty: number; onChange: (q: number) => void }) {
  return (
    <div className="flex items-center gap-1 rounded-full border px-1 py-0.5" style={{ borderColor: SAGE_BORDER }}>
      <button
        type="button"
        aria-label="Хасах"
        onClick={() => onChange(qty - 1)}
        className="grid h-6 w-6 place-items-center rounded-full hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B4552D]"
      >
        <Minus className="h-3 w-3" />
      </button>
      <span className="w-7 text-center text-sm font-bold">{qty}</span>
      <button
        type="button"
        aria-label="Нэмэх"
        onClick={() => onChange(qty + 1)}
        className="grid h-6 w-6 place-items-center rounded-full hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B4552D]"
      >
        <Plus className="h-3 w-3" />
      </button>
    </div>
  )
}

function SuccessScreen({ placed }: { placed: PlacedOrder }) {
  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <CheckCircle2 className="mx-auto h-14 w-14 text-green-600" />
      <h1 className="mt-4 text-3xl font-bold" style={{ color: GREEN }}>
        Захиалга хүлээн авлаа!
      </h1>
      <p className="urgo-ui mt-2 text-sm text-[#6B7562]">
        Гал тогоонд бэлтгэж эхэлсэн. Захиалгын кодоо хадгалаарай.
      </p>
      <div
        className="urgo-ui mt-7 rounded-2xl border p-6 text-left shadow-sm"
        style={{ backgroundColor: CARD_BG, borderColor: SAGE_BORDER }}
      >
        <p className="text-xs uppercase tracking-wider text-[#8A9179]">Захиалгын код</p>
        <p className="mt-1 text-2xl font-bold tracking-wide" style={{ color: TERRA }}>
          {placed.code}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <StatusBadge status="хүлээн авсан" />
          <StatusBadge status={placed.paymentStatus} />
        </div>
        <dl className="mt-4 space-y-1.5 text-sm">
          <div className="flex justify-between">
            <dt className="text-[#6B7562]">Нийт дүн</dt>
            <dd className="font-bold" style={{ color: GREEN }}>
              {fmtMNT(placed.total)}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-[#6B7562]">Утас</dt>
            <dd className="font-medium">{placed.phone}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="flex items-center gap-1 text-[#6B7562]">
              <Clock className="h-3.5 w-3.5" aria-hidden />
              Хүргэлтийн цаг
            </dt>
            <dd className="font-semibold" style={{ color: TERRA }}>
              {placed.deliveryWindow}
            </dd>
          </div>
        </dl>
      </div>
      <div className="urgo-ui mt-6 flex flex-wrap justify-center gap-3">
        <Button
          className="rounded-full text-white"
          style={{ backgroundColor: TERRA }}
          onClick={() => navigate('/demo/urgo/track')}
        >
          Захиалгын төлөв хянах
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="rounded-full bg-transparent"
          style={{ borderColor: GREEN, color: GREEN }}
          onClick={() => navigate('/demo/urgo/menu')}
        >
          Цэс рүү буцах
        </Button>
      </div>
    </div>
  )
}

export function CartPage() {
  const { items, subtotal, setQty, remove, clear } = useCart()
  const [form, setForm] = useState<CheckoutForm>({
    name: '',
    phone: '',
    address: '',
    notes: '',
    deliveryWindow: ASAP_WINDOW,
  })
  // Цагийн цонхны сонголтуудыг зөвхөн клиент дээр тооцоолно (SSR гидрацын зөрүүгээс сэргийлнэ)
  const [windowOpts, setWindowOpts] = useState<string[]>([ASAP_WINDOW])
  useEffect(() => {
    setWindowOpts(deliveryWindowOptions())
  }, [])
  const [errors, setErrors] = useState<Partial<CheckoutForm>>({})
  const [payOpen, setPayOpen] = useState(false)
  const [lastOutcome, setLastOutcome] = useState<'approved' | 'rejected' | null>(null)
  const [placed, setPlaced] = useState<PlacedOrder | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)

  const deliveryFee = items.length === 0 ? 0 : subtotal >= FREE_DELIVERY_MIN ? 0 : DELIVERY_FEE
  const total = subtotal + deliveryFee

  const set = (k: keyof CheckoutForm, v: string) => {
    setForm((f) => ({ ...f, [k]: v }))
    setErrors((e) => ({ ...e, [k]: undefined }))
  }

  const validate = (): boolean => {
    const e: Partial<CheckoutForm> = {}
    if (form.name.trim().length < 2) e.name = 'Нэрээ оруулна уу (хамгийн багадаа 2 үсэг).'
    if (!/^\d{8}$/.test(form.phone.trim()))
      e.phone = 'Утасны дугаар 8 оронтой тоо байх ёстой (жишээ: 99112233).'
    if (form.address.trim().length < 5)
      e.address = 'Хүргэх хаягаа бүрэн оруулна уу — хот, хороо, гудамж.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault()
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
      address: form.address.trim(),
      notes: form.notes.trim() || null,
      items: items.map(({ id, name, price, qty, options }) => ({ id, name, price, qty, options })),
      subtotal,
      deliveryFee,
      total,
      status: 'хүлээн авсан',
      paymentStatus,
      meta: { deliveryWindow: form.deliveryWindow },
    }
    try {
      const res = await fetch('/api/restaurant-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('хадгалахад алдаа')
      const order = (await res.json()) as OrderData
      const next: PlacedOrder = {
        code: orderCode(order.id),
        phone: payload.phone,
        total,
        paymentStatus,
        deliveryWindow: form.deliveryWindow,
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
      toast.info('Төлбөр татгалзагдсан тул захиалга "төлөгдөөгүй" төлөвтэй бүртгэгдлээ.')
    }
    clear()
    setShowSuccess(true)
  }

  if (showSuccess && placed) return <SuccessScreen placed={placed} />

  if (items.length === 0) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-16">
        <EmptyState
          icon={<ShoppingBasket className="h-5 w-5 text-[#8A9179]" />}
          title="Сагс хоосон байна"
          description="Дуртай хоолоо цэснээс сонгоод сагслаарай — хүргэлт 45–60 минутад."
          action={
            <Button
              className="urgo-ui rounded-full text-white"
              style={{ backgroundColor: TERRA }}
              onClick={() => navigate('/demo/urgo/menu')}
            >
              Цэс үзэх
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10">
      <p className="text-xs font-semibold uppercase tracking-[0.25em]" style={{ color: KICKER_GREEN }}>
        ӨРГӨӨ · Сагс
      </p>
      <h1 className="mt-2 text-3xl font-bold sm:text-4xl" style={{ color: GREEN }}>
        Миний сагс
      </h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        {/* Сагсны жагсаалт */}
        <ul className="space-y-4">
          {items.map((line) => (
            <li
              key={line.key}
              className="urgo-ui rounded-2xl border p-4 shadow-sm"
              style={{ backgroundColor: CARD_BG, borderColor: SAGE_BORDER }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold" style={{ color: GREEN, fontFamily: 'var(--font-lora),serif' }}>
                    {line.name}
                  </p>
                  {line.options.length > 0 && (
                    <p className="mt-0.5 text-xs text-[#6B7562]">{line.options.join(' · ')}</p>
                  )}
                  <p className="mt-0.5 text-xs text-[#8A9179]">{fmtMNT(line.price)} / ширхэг</p>
                </div>
                <button
                  type="button"
                  aria-label={`${line.name}-г сагснаас хасах`}
                  onClick={() => {
                    remove(line.key)
                    toast(`${line.name} — сагснаас хасагдлаа`)
                  }}
                  className="rounded-full p-1.5 text-[#8A9179] transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <QtyStepper qty={line.qty} onChange={(q) => setQty(line.key, q)} />
                <p className="text-sm font-bold" style={{ color: TERRA }}>
                  {fmtMNT(line.price * line.qty)}
                </p>
              </div>
            </li>
          ))}
        </ul>

        {/* Төлбөрийн хураангуй + маягт */}
        <div className="space-y-6">
          <div className="urgo-ui rounded-2xl border p-5 shadow-sm" style={{ backgroundColor: CARD_BG, borderColor: SAGE_BORDER }}>
            <h2 className="font-semibold" style={{ color: GREEN, fontFamily: 'var(--font-lora),serif' }}>
              Захиалгын хураангуй
            </h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-[#6B7562]">Барааны дүн</dt>
                <dd className="font-medium">{fmtMNT(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[#6B7562]">Хүргэлтийн хөлс</dt>
                <dd className="font-medium">
                  {deliveryFee === 0 ? (
                    <span className="font-semibold text-green-700">Үнэгүй</span>
                  ) : (
                    fmtMNT(deliveryFee)
                  )}
                </dd>
              </div>
              {subtotal < FREE_DELIVERY_MIN && (
                <p className="rounded-lg bg-[#1F3D2B]/5 px-3 py-2 text-xs text-[#4B5744]">
                  {fmtMNT(FREE_DELIVERY_MIN - subtotal)} нэмбэл хүргэлт үнэгүй болно.
                </p>
              )}
              <div
                className="flex justify-between border-t pt-2.5 text-base"
                style={{ borderColor: SAGE_BORDER }}
              >
                <dt className="font-semibold" style={{ color: GREEN }}>
                  Нийт
                </dt>
                <dd className="text-lg font-bold" style={{ color: TERRA }}>
                  {fmtMNT(total)}
                </dd>
              </div>
            </dl>
          </div>

          {/* Хүргэлтийн маягт */}
          <form
            onSubmit={submit}
            noValidate
            className="urgo-ui rounded-2xl border p-5 shadow-sm"
            style={{ backgroundColor: CARD_BG, borderColor: SAGE_BORDER }}
          >
            <h2 className="font-semibold" style={{ color: GREEN, fontFamily: 'var(--font-lora),serif' }}>
              Хүргэлтийн мэдээлэл
            </h2>
            <div className="mt-4 space-y-3.5">
              <div className="space-y-1.5">
                <Label htmlFor="co-name">Нэр *</Label>
                <Input
                  id="co-name"
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                  placeholder="Жишээ: Батбаяр Дорж"
                  aria-invalid={!!errors.name}
                  className="border-[#E4DECB] bg-white"
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
                  className="border-[#E4DECB] bg-white"
                />
                {errors.phone && <p className="text-xs text-red-600">{errors.phone}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="co-address">Хаяг *</Label>
                <Textarea
                  id="co-address"
                  value={form.address}
                  onChange={(e) => set('address', e.target.value)}
                  placeholder="Хот, дүүрэг, хороо, гудамж, байрны дугаар, орц…"
                  rows={3}
                  aria-invalid={!!errors.address}
                  className="border-[#E4DECB] bg-white"
                />
                {errors.address && <p className="text-xs text-red-600">{errors.address}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="co-window">Хүргэлтийн цагийн цонх</Label>
                <Select
                  value={form.deliveryWindow}
                  onValueChange={(v) => set('deliveryWindow', v)}
                >
                  <SelectTrigger id="co-window" className="border-[#E4DECB] bg-white">
                    <SelectValue placeholder="Цаг сонгох" />
                  </SelectTrigger>
                  <SelectContent>
                    {windowOpts.map((w) => (
                      <SelectItem key={w} value={w}>
                        {w}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-[#8A9179]">
                  Хүргэлт 45–60 минутад — эсвэл дээрх цонхоор сонгоно уу.
                </p>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="co-notes">Нэмэлт тайлбар (сонголттой)</Label>
                <Textarea
                  id="co-notes"
                  value={form.notes}
                  onChange={(e) => set('notes', e.target.value)}
                  placeholder="Жишээ: халуун соус ихтэй, хаалгадаа дуударай"
                  rows={2}
                  className="border-[#E4DECB] bg-white"
                />
              </div>
              <Button
                type="submit"
                className="w-full rounded-full text-white"
                style={{ backgroundColor: TERRA }}
              >
                Захиалах · {fmtMNT(total)}
              </Button>
              <p className="text-center text-xs text-[#8A9179]">
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
        merchant="ӨРГӨӨ Ресторан"
        accent={TERRA}
        processPayment={processPayment}
      />
    </div>
  )
}
