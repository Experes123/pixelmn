'use client'

/**
 * ШОНХОР Gaming Café — Миний захиалга
 * Утасны дугаараар хайж, өөрийн захиалгуудыг харах / цуцлах
 */

import { useState } from 'react'
import { Search, CalendarDays, Clock, Hash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { navigate } from '@/lib/hash-router'
import { useApi } from '@/lib/use-api'
import { StatusBadge, EmptyState, LoadingState, ConfirmDelete } from '@/components/shared/admin-kit'
import {
  NEON,
  TEXT,
  CLIP_SM,
  GRID_BG,
  ClipCard,
  weekdayOf,
  endTimeLabel,
  fmtN,
  refCode,
  BTN_PRIMARY,
  BTN_GHOST,
  INPUT_CLS,
  type Booking,
} from './shared'

export function StatusPage() {
  const { data, loading, error, reload, update } = useApi<Booking>('pc-bookings')
  const [phone, setPhone] = useState('')
  const [query, setQuery] = useState<string | null>(null)
  const [phoneErr, setPhoneErr] = useState('')
  const [cancelTarget, setCancelTarget] = useState<Booking | null>(null)

  const results = query ? data.filter((b) => b.phone === query) : []

  const doSearch = () => {
    if (!/^\d{8}$/.test(phone.trim())) {
      setPhoneErr('Утасны дугаар 8 оронтой тоо байх ёстой')
      return
    }
    setPhoneErr('')
    setQuery(phone.trim())
  }

  const cancelBooking = async () => {
    if (!cancelTarget) return
    try {
      await update(cancelTarget.id, { status: 'цуцлагдсан' })
      toast.success('Захиалга цуцлагдлаа')
    } catch {
      toast.error('Цуцлахад алдаа гарлаа')
    }
  }

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-0" style={GRID_BG} aria-hidden />
      <div className="relative mx-auto max-w-4xl px-4 py-10 sm:py-14">
        <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: NEON }}>
          МИНИЙ ЗАХИАЛГА
        </p>
        <h1 className="text-3xl sm:text-4xl" style={{ fontFamily: 'var(--font-russo)', color: TEXT }}>
          Захиалгаа хайх
        </h1>

        {/* Утасны дугаараар хайх */}
        <ClipCard className="mt-6">
          <form
            className="p-5 sm:p-6"
            onSubmit={(e) => {
              e.preventDefault()
              doSearch()
            }}
          >
            <Label htmlFor="st-phone" className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#E7F5EC88]">
              Захиалах үедээ бүртгүүлсэн утасны дугаар
            </Label>
            <div className="mt-2 flex flex-col gap-2 sm:flex-row">
              <div className="relative flex-1">
                <Input
                  id="st-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 8))}
                  placeholder="Жишээ: 99112233"
                  inputMode="numeric"
                  className={`${INPUT_CLS} font-mono`}
                  aria-invalid={!!phoneErr}
                />
              </div>
              <Button type="submit" className={BTN_PRIMARY} style={{ clipPath: CLIP_SM }}>
                <Search className="mr-1.5 h-4 w-4" aria-hidden />
                Хайх
              </Button>
            </div>
            {phoneErr && <p className="mt-2 text-xs text-[#F87171]">{phoneErr}</p>}
          </form>
        </ClipCard>

        {/* Үр дүн */}
        <div className="mt-8">
          {loading && <LoadingState label="Захиалгуудыг ачаалж байна…" />}

          {!loading && error && (
            <EmptyState
              title="Ачаалахад алдаа гарлаа"
              description={error}
              action={
                <Button className={BTN_GHOST} onClick={() => reload()}>
                  Дахин оролдох
                </Button>
              }
            />
          )}

          {!loading && !error && query === null && (
            <EmptyState
              title="Утасны дугаараа оруулан хайна уу"
              description="Захиалга хийх үед оруулсан 8 оронтой утасны дугаараар бүх захиалгаа харах боломжтой."
            />
          )}

          {!loading && !error && query !== null && results.length === 0 && (
            <EmptyState
              title="Захиалга олдсонгүй"
              description="Дугаараа шалгаж дахин оролдоно уу. Эсвэл одоогоор энэ дугаартай захиалга хийгээгүй байж болно."
              action={
                <Button className={BTN_PRIMARY} style={{ clipPath: CLIP_SM }} onClick={() => navigate('/demo/pc-cafe/booking')}>
                  Суудал захиалах
                </Button>
              }
            />
          )}

          {!loading && !error && results.length > 0 && (
            <ul className="space-y-3">
              {results.map((b) => (
                <li key={b.id}>
                  <ClipCard>
                    <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-lg" style={{ fontFamily: 'var(--font-russo)', color: TEXT }}>
                            {b.stationName}
                          </p>
                          <span className="border border-[#2CE08044] bg-[#2CE08010] px-2 py-0.5 font-mono text-[11px] text-[#2CE080]">
                            {b.zone}
                          </span>
                        </div>
                        <p className="mt-1 flex items-center gap-1.5 font-mono text-[12px] text-[#E7F5EC99]">
                          <Hash className="h-3 w-3" aria-hidden />
                          {refCode(b.id)}
                        </p>
                        <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[#E7F5ECCC]">
                          <span className="inline-flex items-center gap-1.5">
                            <CalendarDays className="h-3.5 w-3.5 text-[#2CE080AA]" aria-hidden />
                            <span className="font-mono">
                              {b.date} ({weekdayOf(b.date)})
                            </span>
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-[#2CE080AA]" aria-hidden />
                            <span className="font-mono">
                              {b.startTime} → {endTimeLabel(b.startTime, b.hours)} · {b.hours} цаг
                            </span>
                          </span>
                        </p>
                      </div>

                      <div className="flex shrink-0 flex-row flex-wrap items-center gap-2 sm:flex-col sm:items-end">
                        <StatusBadge status={b.status} />
                        <StatusBadge status={b.paymentStatus} />
                        <p className="font-mono text-sm" style={{ color: NEON }}>
                          {fmtN(b.totalAmount)}₮
                        </p>
                        {b.status === 'идэвхтэй' && (
                          <Button
                            size="sm"
                            variant="outline"
                            className={BTN_GHOST}
                            onClick={() => setCancelTarget(b)}
                          >
                            Цуцлах
                          </Button>
                        )}
                      </div>
                    </div>
                  </ClipCard>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <ConfirmDelete
        open={!!cancelTarget}
        onOpenChange={(o) => !o && setCancelTarget(null)}
        onConfirm={cancelBooking}
        title="Захиалгыг цуцлах уу?"
        description={
          cancelTarget
            ? `${cancelTarget.stationName} · ${cancelTarget.date} ${cancelTarget.startTime} цагийн захиалгыг цуцлана. Энэ үйлдлийг буцаах боломжгүй.`
            : ''
        }
        confirmLabel="Тийм, цуцлах"
      />
    </div>
  )
}
