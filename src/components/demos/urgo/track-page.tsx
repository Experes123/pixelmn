'use client'

import { useCallback, useEffect, useState } from 'react'
import { fetchList } from '@/lib/use-api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { ConfirmDelete, EmptyState, StatusBadge, fmtDateTime, fmtMNT } from '@/components/shared/admin-kit'
import { toast } from 'sonner'
import { Bike, ChefHat, CheckCircle2, Clock, MapPin, PackageCheck, ReceiptText, Search } from 'lucide-react'
import {
  CARD_BG,
  GREEN,
  KICKER_GREEN,
  LAST_ORDER_KEY,
  ORDER_STEPS,
  SAGE_BORDER,
  TERRA,
  orderCode,
  parseItems,
  readWindow,
  type OrderData,
} from './constants'

const STEP_ICONS = [ReceiptText, ChefHat, Bike, PackageCheck]

function Timeline({ status }: { status: string }) {
  if (status === 'цуцлагдсан') {
    return (
      <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
        <p className="text-sm font-semibold text-red-700">Захиалга цуцлагдсан</p>
        <p className="urgo-ui text-xs text-red-600/80">Дахин захиалахад бид баяртай хүлээнэ.</p>
      </div>
    )
  }
  const current = ORDER_STEPS.indexOf(status as (typeof ORDER_STEPS)[number])
  return (
    <ol className="urgo-ui mt-4 space-y-0" aria-label="Захиалгын төлөвийн шат">
      {ORDER_STEPS.map((step, i) => {
        const done = i < current
        const isCurrent = i === current
        const Icon = STEP_ICONS[i]
        return (
          <li key={step} className="relative flex gap-3 pb-5 last:pb-0">
            {i < ORDER_STEPS.length - 1 && (
              <span
                className="absolute left-[13px] top-7 h-[calc(100%-28px)] w-0.5"
                style={{ backgroundColor: i < current ? TERRA : SAGE_BORDER }}
                aria-hidden="true"
              />
            )}
            <span
              className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 transition-colors ${
                isCurrent ? 'ring-4' : ''
              }`}
              style={{
                borderColor: done || isCurrent ? TERRA : SAGE_BORDER,
                backgroundColor: done ? TERRA : isCurrent ? `${TERRA}1A` : CARD_BG,
                ...(isCurrent ? { boxShadow: `0 0 0 3px ${TERRA}26` } : {}),
              }}
              aria-hidden="true"
            >
              {done ? (
                <CheckCircle2 className="h-4 w-4 text-white" />
              ) : (
                <Icon className="h-3.5 w-3.5" style={{ color: isCurrent ? TERRA : '#A7AD99' }} />
              )}
            </span>
            <span className="flex flex-wrap items-center gap-2 pt-1">
              <span
                className={`text-sm ${isCurrent ? 'font-bold' : done ? 'font-medium' : 'text-[#8A9179]'}`}
                style={isCurrent ? { color: TERRA } : done ? { color: GREEN } : undefined}
              >
                {step}
              </span>
              {isCurrent && (
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white"
                  style={{ backgroundColor: TERRA }}
                >
                  одоо
                </span>
              )}
            </span>
          </li>
        )
      })}
    </ol>
  )
}

function OrderCard({
  order,
  onCancel,
  cancelling,
}: {
  order: OrderData
  onCancel: (o: OrderData) => void
  cancelling: boolean
}) {
  const items = parseItems(order.items)
  return (
    <article
      className="urgo-ui overflow-hidden rounded-2xl border shadow-sm"
      style={{ backgroundColor: CARD_BG, borderColor: SAGE_BORDER }}
    >
      <div
        className="flex flex-wrap items-center justify-between gap-2 border-b px-5 py-3.5"
        style={{ borderColor: SAGE_BORDER, backgroundColor: `${GREEN}08` }}
      >
        <div>
          <p className="text-lg font-bold tracking-wide" style={{ color: TERRA, fontFamily: 'var(--font-lora),serif' }}>
            {orderCode(order.id)}
          </p>
          <p className="text-xs text-[#8A9179]">{fmtDateTime(order.createdAt)}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="px-5 py-4">
        <ul className="space-y-1.5 text-sm">
          {items.map((it, idx) => (
            <li key={idx} className="flex items-baseline justify-between gap-3">
              <span>
                <span className="font-medium text-[#22301F]">
                  {it.qty} × {it.name}
                </span>
                {it.options && it.options.length > 0 && (
                  <span className="text-xs text-[#8A9179]"> · {it.options.join(', ')}</span>
                )}
              </span>
              <span className="shrink-0 text-[#6B7562]">{fmtMNT(it.price * it.qty)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 flex items-start gap-1.5 text-xs text-[#6B7562]">
          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          {order.address}
          {order.notes ? <span className="italic"> — {order.notes}</span> : null}
        </p>
        {readWindow(order.meta) && (
          <p
            className="mt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
            style={{ backgroundColor: `${TERRA}14`, color: TERRA }}
          >
            <Clock className="h-3.5 w-3.5" aria-hidden />
            Хүргэх цаг: {readWindow(order.meta)}
          </p>
        )}
        <div
          className="mt-3 flex items-center justify-between border-t pt-3"
          style={{ borderColor: SAGE_BORDER }}
        >
          <span className="text-sm text-[#6B7562]">
            Нийт (хүргэлт {fmtMNT(order.deliveryFee)}) · <StatusBadge status={order.paymentStatus} />
          </span>
          <span className="text-base font-bold" style={{ color: GREEN }}>
            {fmtMNT(order.total)}
          </span>
        </div>

        <div className="mt-4">
          <Timeline status={order.status} />
        </div>

        {order.status === 'хүлээн авсан' && (
          <div className="mt-4 border-t pt-4" style={{ borderColor: SAGE_BORDER }}>
            <Button
              variant="outline"
              size="sm"
              disabled={cancelling}
              onClick={() => onCancel(order)}
              className="rounded-full border-red-300 bg-transparent text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              Захиалга цуцлах
            </Button>
            <p className="mt-1.5 text-xs text-[#8A9179]">
              Зөвхөн хүлээн авсан үед цуцлах боломжтой.
            </p>
          </div>
        )}
      </div>
    </article>
  )
}

export function TrackPage() {
  const [phone, setPhone] = useState('')
  const [searched, setSearched] = useState('')
  const [results, setResults] = useState<OrderData[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [cancelTarget, setCancelTarget] = useState<OrderData | null>(null)
  const [cancelling, setCancelling] = useState(false)

  const search = useCallback(async (p: string) => {
    const clean = p.trim()
    if (!/^\d{8}$/.test(clean)) {
      toast.error('Утасны дугаар 8 оронтой тоо байх ёстой.')
      return
    }
    setLoading(true)
    setSearched(clean)
    try {
      const all = await fetchList<OrderData>('restaurant-orders')
      setResults(all.filter((o) => o.phone === clean))
    } catch {
      setResults([])
      toast.error('Захиалга ачаалахад алдаа гарлаа.')
    } finally {
      setLoading(false)
    }
  }, [])

  // Захиалга өгсөний дараа сүүлийн кодыг автоматаар харуулна
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(LAST_ORDER_KEY)
      if (!raw) return
      const saved = JSON.parse(raw) as { phone?: string; code?: string }
      if (saved.phone && /^\d{8}$/.test(saved.phone)) {
        setPhone(saved.phone)
        void search(saved.phone)
      }
    } catch {
      /* алгасна */
    }
  }, [search])

  const cancelOrder = async () => {
    if (!cancelTarget) return
    setCancelling(true)
    try {
      const res = await fetch(`/api/restaurant-orders/${cancelTarget.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'цуцлагдсан' }),
      })
      if (!res.ok) throw new Error()
      toast.success(`${orderCode(cancelTarget.id)} захиалга цуцлагдлаа.`)
      setCancelTarget(null)
      void search(searched)
    } catch {
      toast.error('Цуцлахад алдаа гарлаа. Дахин оролдоно уу.')
    } finally {
      setCancelling(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.25em]" style={{ color: KICKER_GREEN }}>
          ӨРГӨӨ · ЗАХИАЛГА
        </p>
        <h1 className="mt-2 text-4xl font-bold" style={{ color: GREEN }}>
          Захиалгын төлөв
        </h1>
        <p className="urgo-ui mx-auto mt-3 max-w-md text-sm text-[#6B7562]">
          Захиалахад ашигласан утасны дугаараа оруулан захиалгынх ахицыг хянаарай.
        </p>
      </div>

      <form
        className="urgo-ui mx-auto mt-8 flex max-w-md flex-col gap-2 sm:flex-row"
        onSubmit={(e) => {
          e.preventDefault()
          void search(phone)
        }}
      >
        <div className="flex-1 space-y-1">
          <Label htmlFor="track-phone" className="sr-only">
            Утасны дугаар
          </Label>
          <Input
            id="track-phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 8))}
            inputMode="numeric"
            placeholder="Утасны дугаар — жишээ: 99112233"
            className="rounded-full border-[#E4DECB] bg-[#FFFDF8] pl-4"
          />
        </div>
        <Button type="submit" className="rounded-full text-white" style={{ backgroundColor: TERRA }}>
          <Search className="mr-1.5 h-4 w-4" />
          Хайх
        </Button>
      </form>

      <div className="mt-8 space-y-6">
        {loading && (
          <div className="space-y-4">
            <Skeleton className="h-40 w-full rounded-2xl" />
            <Skeleton className="h-40 w-full rounded-2xl" />
          </div>
        )}

        {!loading && results !== null && results.length === 0 && (
          <EmptyState
            icon={<ReceiptText className="h-5 w-5 text-[#8A9179]" />}
            title="Захиалга олдсонгүй"
            description={`${searched} дугаартай захиалга бүртгэлгүй байна. Дугаараа шалгаад дахин оролдоно уу.`}
          />
        )}

        {!loading &&
          results?.map((o) => (
            <OrderCard key={o.id} order={o} onCancel={setCancelTarget} cancelling={cancelling} />
          ))}
      </div>

      <ConfirmDelete
        open={cancelTarget !== null}
        onOpenChange={(o) => !o && setCancelTarget(null)}
        onConfirm={cancelOrder}
        title="Захиалга цуцлах уу?"
        description={
          cancelTarget
            ? `${orderCode(cancelTarget.id)} — ${fmtMNT(cancelTarget.total)}. Цуцлахыг хүсвэл батлана уу.`
            : ''
        }
        confirmLabel="Тийм, цуцлах"
      />
    </div>
  )
}
