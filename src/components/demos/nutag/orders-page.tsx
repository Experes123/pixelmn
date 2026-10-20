'use client'

import { useCallback, useEffect, useState } from 'react'
import { useApi } from '@/lib/use-api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Search } from 'lucide-react'
import { EmptyState, StatusBadge, fmtDateTime, fmtMNT } from '@/components/shared/admin-kit'
import { INK, INK_SOFT, LAST_ORDER_KEY, LINE, OLIVE, orderCode, type ShopOrder } from './constants'
import { PageHead } from './ui'

export function OrdersPage() {
  const { data: orders, loading, error, reload } = useApi<ShopOrder>('shop-orders')

  const [phone, setPhone] = useState('')
  const [searched, setSearched] = useState(false)
  const [phoneError, setPhoneError] = useState<string | null>(null)

  const search = useCallback((value: string) => {
    setPhone(value)
    if (!/^\d{8}$/.test(value.trim())) {
      setPhoneError('Утасны дугаар 8 оронтой тоо байх ёстой (жишээ: 99112233).')
      return
    }
    setPhoneError(null)
    setSearched(true)
  }, [])

  // Захиалга хийсний дараа сүүлчийн утасны дугаараар автоматаар хайна
  useEffect(() => {
    let last: string | null = null
    try {
      const raw = window.localStorage.getItem(LAST_ORDER_KEY)
      if (raw) {
        const saved = JSON.parse(raw) as { phone?: string }
        if (saved.phone && /^\d{8}$/.test(saved.phone)) last = saved.phone
      }
    } catch {
      /* localStorage ажиллахгүй бол хоосон эхэлнэ */
    }
    if (!last) return
    const t = setTimeout(() => search(last as string), 0)
    return () => clearTimeout(t)
  }, [search])

  const results = searched
    ? orders.filter((o) => o.phone.trim() === phone.trim())
    : []

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10">
      <PageHead
        kicker="НУТАГ · ЗАХИАЛГА"
        title="Миний захиалга"
        sub="Захиалга хийхдээ өгсөн утасны дугаараа оруулан захиалгын төлөвийг хянаарай."
      />

      {/* Хайлт */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          search(phone)
        }}
        noValidate
        className="rounded-2xl border bg-white p-5 shadow-[0_1px_3px_rgba(38,35,29,0.05)]"
        style={{ borderColor: LINE }}
      >
        <Label htmlFor="ord-phone" className="text-sm font-semibold">
          Утасны дугаар
        </Label>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <Input
            id="ord-phone"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value.replace(/\D/g, '').slice(0, 8))
              setPhoneError(null)
            }}
            inputMode="numeric"
            placeholder="99112233"
            aria-invalid={!!phoneError}
            className="border-[#E1DAC7] bg-white focus-visible:ring-[#5A6B3F]"
          />
          <Button
            type="submit"
            className="rounded-full px-6 text-white hover:brightness-110 focus-visible:ring-[#5A6B3F]"
            style={{ backgroundColor: OLIVE }}
          >
            <Search className="mr-1.5 h-4 w-4" />
            Хайх
          </Button>
        </div>
        {phoneError && <p className="mt-2 text-xs text-red-600">{phoneError}</p>}
      </form>

      {/* Үр дүн */}
      <div className="mt-8 space-y-5">
        {loading && (
          <p className="rounded-2xl border border-dashed px-6 py-10 text-center text-sm" style={{ borderColor: LINE, color: INK_SOFT }} role="status">
            Захиалгуудыг ачаалж байна…
          </p>
        )}

        {error && (
          <div className="flex items-center justify-between rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <span>Захиалга ачаалахад алдаа гарлаа.</span>
            <Button size="sm" variant="outline" className="border-red-300 bg-white" onClick={reload}>
              Дахин оролдох
            </Button>
          </div>
        )}

        {!loading && !error && !searched && (
          <EmptyState
            title="Дугаараа оруулж хайгаарай"
            description="Захиалга хийхдээ бүртгүүлсэн 8 оронтой утасны дугаараа оруулбал тухайн захиалгууд харагдана."
          />
        )}

        {!loading && !error && searched && results.length === 0 && (
          <EmptyState
            title="Энэ дугаартай захиалга олдсонгүй"
            description="Дугаараа шалгаад дахин оролдоно уу. Жишээ захиалгын дугаарууд: 99112233, 86119944."
          />
        )}

        {results.map((o) => (
          <article key={o.id} className="rounded-2xl border bg-white p-5 shadow-[0_1px_3px_rgba(38,35,29,0.05)]" style={{ borderColor: LINE }}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: INK_SOFT }}>
                  Захиалгын код
                </p>
                <p className="nutag-display text-lg font-extrabold" style={{ color: OLIVE }}>
                  {orderCode(o.id)}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={o.status} />
                <StatusBadge status={o.paymentStatus} />
              </div>
            </div>

            <p className="mt-1.5 text-xs" style={{ color: INK_SOFT }}>
              {fmtDateTime(o.createdAt ?? new Date().toISOString())} · {o.city}
            </p>

            <ul className="mt-4 divide-y" style={{ borderColor: LINE }}>
              {(o.items ?? []).map((it, i) => (
                <li key={`${o.id}-${i}`} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                  <span>
                    <span className="font-semibold" style={{ color: INK }}>
                      {it.name}
                    </span>
                    <span className="text-xs" style={{ color: INK_SOFT }}>
                      {' '}
                      × {it.qty}
                      {it.option ? ` · ${it.option}` : ''}
                    </span>
                  </span>
                  <span className="whitespace-nowrap font-semibold">{fmtMNT(it.price * it.qty)}</span>
                </li>
              ))}
            </ul>

            <dl className="mt-3 space-y-1 border-t pt-3 text-sm" style={{ borderColor: LINE }}>
              <div className="flex justify-between">
                <dt style={{ color: INK_SOFT }}>Барааны дүн</dt>
                <dd>{fmtMNT(o.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt style={{ color: INK_SOFT }}>Хүргэлт</dt>
                <dd>{o.deliveryFee === 0 ? 'Үнэгүй' : fmtMNT(o.deliveryFee)}</dd>
              </div>
              <div className="flex justify-between font-extrabold">
                <dt>Нийт</dt>
                <dd className="nutag-display" style={{ color: OLIVE }}>
                  {fmtMNT(o.total)}
                </dd>
              </div>
            </dl>

            <div className="mt-3 rounded-xl px-3.5 py-2.5 text-xs leading-relaxed" style={{ backgroundColor: '#F7F4EA', color: INK_SOFT }}>
              <span className="font-semibold" style={{ color: INK }}>
                Хүргэх хаяг:
              </span>{' '}
              {o.city}, {o.address}
              {o.notes ? ` · Тайлбар: ${o.notes}` : ''}
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
