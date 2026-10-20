'use client'

/**
 * ГАН Barbershop — Миний захиалга.
 * Утасны дугаараар хайж, төлвийг харах, цуцлах.
 */

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { useApi } from '@/lib/use-api'
import { DemoLink } from '@/lib/hash-router'
import { ConfirmDelete, EmptyState, LoadingState, StatusBadge, fmtMNT } from '@/components/shared/admin-kit'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { CalendarDays, Search, XCircle } from 'lucide-react'
import {
  Kicker,
  btnGold,
  btnOutline,
  fmtDayLabel,
  inputCls,
  noiseStyle,
  serifStyle,
  type Booking,
} from './parts'

export default function StatusPage() {
  const bookingsApi = useApi<Booking>('barber-bookings')
  const [phone, setPhone] = useState('')
  const [searchedPhone, setSearchedPhone] = useState<string | null>(null)
  const [cancelTarget, setCancelTarget] = useState<Booking | null>(null)
  const [cancelling, setCancelling] = useState(false)

  const results = useMemo(() => {
    if (!searchedPhone) return []
    return bookingsApi.data
      .filter((b) => b.phone.replace(/\D/g, '') === searchedPhone)
      .sort((a, b) => (a.date + a.time < b.date + b.time ? 1 : -1))
  }, [bookingsApi.data, searchedPhone])

  const search = () => {
    const digits = phone.replace(/\D/g, '')
    if (!/^\d{8}$/.test(digits)) {
      toast.error('8 оронтай утасны дугаар оруулна уу')
      return
    }
    setSearchedPhone(digits)
    if (bookingsApi.data.length === 0) bookingsApi.reload()
  }

  const cancelBooking = async () => {
    if (!cancelTarget) return
    try {
      setCancelling(true)
      await bookingsApi.update(cancelTarget.id, { status: 'цуцлагдсан' })
      toast.success('Захиалга цуцлагдлаа')
      setCancelTarget(null)
    } catch {
      toast.error('Захиалга цуцлахад алдаа гарлаа')
    } finally {
      setCancelling(false)
    }
  }

  return (
    <div className="relative px-5 pb-24 pt-32 sm:px-8">
      <div className="absolute inset-0" style={noiseStyle} aria-hidden="true" />

      <div className="relative mx-auto max-w-3xl">
        <div className="text-center">
          <Kicker>МИНИЙ ЗАХИАЛГА</Kicker>
          <h1 className="mt-3 text-4xl sm:text-5xl" style={serifStyle}>
            Захиалгын <em className="italic text-[#C9973B]">төлөв харах</em>
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-sm text-[#A89A87]">
            Захиалга хийхдээ ашигласан утасны дугаараа хайна уу.
          </p>
        </div>

        {/* Хайлтын маягт */}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            search()
          }}
          className="mx-auto mt-9 flex max-w-md flex-col gap-3 sm:flex-row"
          noValidate
        >
          <div className="flex-1 space-y-1.5">
            <Label htmlFor="st-phone" className="sr-only">
              Утасны дугаар
            </Label>
            <Input
              id="st-phone"
              type="tel"
              inputMode="numeric"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 8))}
              placeholder="Утасны дугаар (8 орон)"
              className={cn(inputCls, 'h-11')}
              aria-label="Утасны дугаар"
            />
          </div>
          <Button type="submit" size="lg" className={cn(btnGold, 'h-11')}>
            <Search className="h-4 w-4" />
            Хайх
          </Button>
        </form>

        <div className="mt-10">
          {bookingsApi.loading ? (
            <LoadingState label="Захиалгуудыг ачаалж байна…" />
          ) : !searchedPhone ? (
            <EmptyState
              title="Утасны дугаараа оруулж хайна уу"
              description="Дээрх хайлтын талбарт захиалга хийхдээ ашигласан 8 оронтай дугаараа бичээд «Хайх» дарна уу."
              icon={<Search className="h-5 w-5 text-muted-foreground" />}
              action={
                <DemoLink
                  href="/demo/barber/booking"
                  ariaLabel="Шинэ захиалга хийх"
                  className={cn(buttonVariants({ size: 'sm' }), btnGold)}
                >
                  <CalendarDays className="h-4 w-4" />
                  Шинэ захиалга хийх
                </DemoLink>
              }
            />
          ) : results.length === 0 ? (
            <EmptyState
              title="Энэ утасны дугаартай захиалга олдсонгүй"
              description="Дугаараа шалгаад дахин оролдоорой, эсвэл шинэ захиалга хийгээрэй."
              icon={<Search className="h-5 w-5 text-muted-foreground" />}
              action={
                <DemoLink
                  href="/demo/barber/booking"
                  ariaLabel="Шинэ захиалга хийх"
                  className={cn(buttonVariants({ size: 'sm' }), btnGold)}
                >
                  Шинэ захиалга хийх
                </DemoLink>
              }
            />
          ) : (
            <ul className="space-y-4">
              {results.map((b, i) => (
                <motion.li
                  key={b.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="rounded-lg border border-[#C9973B33] bg-[#221B15] p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="text-xl" style={serifStyle}>
                        {b.serviceName}
                      </h2>
                      <p className="mt-0.5 text-sm text-[#A89A87]">Залаач: {b.barberName}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status={b.status} />
                      <StatusBadge status={b.paymentStatus} />
                    </div>
                  </div>

                  <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-[#C9973B26] pt-4 text-sm sm:grid-cols-4">
                    <div>
                      <dt className="text-[11px] uppercase tracking-wider text-[#6E6152]">Огноо</dt>
                      <dd className="mt-0.5 text-[#F3EBDD]">{fmtDayLabel(b.date)}</dd>
                    </div>
                    <div>
                      <dt className="text-[11px] uppercase tracking-wider text-[#6E6152]">Цаг</dt>
                      <dd className="mt-0.5 text-[#F3EBDD]">{b.time}</dd>
                    </div>
                    <div>
                      <dt className="text-[11px] uppercase tracking-wider text-[#6E6152]">Дүн</dt>
                      <dd className="mt-0.5 font-medium text-[#C9973B]">{fmtMNT(b.totalAmount)}</dd>
                    </div>
                    <div>
                      <dt className="text-[11px] uppercase tracking-wider text-[#6E6152]">Утас</dt>
                      <dd className="mt-0.5 text-[#F3EBDD]">{b.phone}</dd>
                    </div>
                  </dl>

                  {b.notes && (
                    <p className="mt-3 rounded-md bg-[#1D1712] px-3 py-2 text-xs text-[#A89A87]">
                      Тэмдэглэл: {b.notes}
                    </p>
                  )}

                  {b.status !== 'цуцлагдсан' && b.status !== 'дууссан' && (
                    <div className="mt-4 flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCancelTarget(b)}
                        className="border-[#C96A3B66] text-[#E08B6D] hover:bg-[#C96A3B14] hover:text-[#E08B6D]"
                      >
                        <XCircle className="h-4 w-4" />
                        Захиалга цуцлах
                      </Button>
                    </div>
                  )}
                </motion.li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <ConfirmDelete
        open={!!cancelTarget}
        onOpenChange={(o) => !o && setCancelTarget(null)}
        onConfirm={cancelBooking}
        title="Захиалга цуцлах уу?"
        description={
          cancelTarget
            ? `${cancelTarget.serviceName} — ${fmtDayLabel(cancelTarget.date)}, ${cancelTarget.time}. Энэ үйлдлийг буцаах боломжгүй.`
            : ''
        }
        confirmLabel={cancelling ? 'Цуцлаж байна…' : 'Тийм, цуцлах'}
      />
    </div>
  )
}
