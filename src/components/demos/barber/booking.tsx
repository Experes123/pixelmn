'use client'

/**
 * ГАН Barbershop — Цаг захиалах wizard.
 * 4 алхам: Үйлчилгээ → Залаач → Огноо, цаг → Холбоо барих → Демо төлбөр.
 */

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { useApi } from '@/lib/use-api'
import { DemoLink } from '@/lib/hash-router'
import { FakePaymentModal } from '@/components/shared/demo-kit'
import { EmptyState, LoadingState, fmtMNT } from '@/components/shared/admin-kit'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import {
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  CreditCard,
  Scissors,
  Users,
} from 'lucide-react'
import {
  Kicker,
  btnGold,
  btnOutline,
  catLabel,
  fmtDayLabel,
  inputCls,
  noiseStyle,
  bookingRef,
  slotsFor,
  serifStyle,
  todayStr,
  addDaysStr,
  type Barber,
  type Booking,
  type Service,
} from './parts'

const STEPS = ['Үйлчилгээ', 'Залаач', 'Огноо, цаг', 'Холбоо барих'] as const

const ANY_BARBER = '__any__'

type Contact = { name: string; phone: string; email: string; notes: string }

export default function BookingPage() {
  const servicesApi = useApi<Service>('barber-services')
  const barbersApi = useApi<Barber>('barbers')
  const bookingsApi = useApi<Booking>('barber-bookings')

  const [step, setStep] = useState(1)
  const [serviceId, setServiceId] = useState<string | null>(null)
  const [barberPick, setBarberPick] = useState<string>(ANY_BARBER)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [contact, setContact] = useState<Contact>({ name: '', phone: '', email: '', notes: '' })
  const [errors, setErrors] = useState<Partial<Record<keyof Contact, string>>>({})
  const [payOpen, setPayOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [confirmedId, setConfirmedId] = useState<string | null>(null)
  const [confirmedOutcome, setConfirmedOutcome] = useState<'approved' | 'rejected' | null>(null)
  /** Демо төлбөрийн эцсийн дүн — handlePayClose-д цэвэрлэгддэггүй тул баталгаажсан дэлгэц зөв харагдана */
  const [confirmedPaid, setConfirmedPaid] = useState<boolean | null>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)

  const services = useMemo(() => servicesApi.data.filter((s) => s.active), [servicesApi.data])
  const barbers = useMemo(() => barbersApi.data.filter((b) => b.active), [barbersApi.data])

  const selectedService = services.find((s) => s.id === serviceId) ?? null
  const selectedBarber = barberPick === ANY_BARBER ? null : barbers.find((b) => b.id === barberPick) ?? null
  const barberName = selectedBarber?.name ?? 'Ямар ч залаач'
  const total = selectedService?.price ?? 0

  const slots = useMemo(() => slotsFor(selectedService?.durationMin ?? 30), [selectedService])

  /** Сонгосон залаач + огноо дээр аль цагууд эзлэгдсэн байх */
  const isTaken = (t: string) => {
    const active = bookingsApi.data.filter(
      (b) => b.date === date && b.time === t && b.status !== 'цуцлагдсан'
    )
    if (selectedBarber) return active.some((b) => b.barberId === selectedBarber.id)
    // Ямар ч залаач — бүх идэвхтэй залаач эзлэгдсэн бол боломжгүй
    return barbers.length > 0 && active.length >= barbers.length
  }

  const isPastSlot = (t: string) => {
    if (date !== todayStr()) return false
    const [h, m] = t.split(':').map(Number)
    const now = new Date()
    return h * 60 + m < now.getHours() * 60 + now.getMinutes()
  }

  const pickService = (id: string) => {
    setServiceId(id)
    setTime('')
  }
  const pickBarber = (pick: string) => {
    setBarberPick(pick)
    setTime('')
  }

  const validateStep = (s: number): boolean => {
    if (s === 1 && !serviceId) {
      toast.error('Эхлээд үйлчилгээ сонгоно уу')
      return false
    }
    if (s === 3) {
      if (!date) {
        toast.error('Огноогоо сонгоно уу')
        return false
      }
      if (!time) {
        toast.error('Цагаа сонгоно уу')
        return false
      }
      if (isTaken(time)) {
        toast.error('Энэ цаг аль хэдийн эзлэгдсэн байна. Өөр цаг сонгоно уу')
        return false
      }
    }
    if (s === 4) return validateContact()
    return true
  }

  const next = () => {
    if (!validateStep(step)) return
    setStep((s) => Math.min(4, s + 1))
  }
  const back = () => setStep((s) => Math.max(1, s - 1))

  const validateContact = (): boolean => {
    const e: Partial<Record<keyof Contact, string>> = {}
    if (contact.name.trim().length < 2) e.name = 'Нэрээ оруулна уу (хамгийн багадаа 2 үсэг)'
    if (!/^\d{8}$/.test(contact.phone.trim())) e.phone = '8 оронтай утасны дугаар оруулна уу'
    if (contact.email.trim() && !/^\S+@\S+\.\S+$/.test(contact.email.trim()))
      e.email = 'Имэйл хаягийн формат буруу байна'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  /** Демо төлбөрийн үр дүнгээр захиалга үүсгэнэ */
  const processPayment = async (outcome: 'approved' | 'rejected') => {
    if (!selectedService) return
    try {
      setSubmitting(true)
      const created = await bookingsApi.create({
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        barberId: selectedBarber?.id ?? null,
        barberName,
        date,
        time,
        customerName: contact.name.trim(),
        phone: contact.phone.trim(),
        email: contact.email.trim() || null,
        notes: contact.notes.trim() || null,
        totalAmount: selectedService.price,
        status: 'баталгаажсан',
        paymentStatus: outcome === 'approved' ? 'төлөгдсөн' : 'төлөгдөөгүй',
      })
      setConfirmedId(created.id)
      setConfirmedOutcome(outcome)
      setConfirmedPaid(outcome === 'approved')
      if (outcome === 'approved') toast.success('Захиалга амжилттай үүслээ')
      else toast.error('Төлбөр татгалзагдлаа')
    } catch {
      toast.error('Захиалга хадгалахад алдаа гарлаа. Дахин оролдоно уу')
      throw new Error('booking create failed')
    } finally {
      setSubmitting(false)
    }
  }

  const handlePayClose = () => {
    setPayOpen(false)
    bookingsApi.reload()
    if (confirmedOutcome === 'approved' && confirmedId) {
      setShowConfirmation(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    setConfirmedOutcome(null)
  }

  // ── Амжилттай баталгаажсаны дараах дэлгэц ──
  if (showConfirmation) {
    return (
      <div className="relative px-5 pb-24 pt-36 sm:px-8">
        <div className="absolute inset-0" style={noiseStyle} aria-hidden="true" />
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="relative mx-auto max-w-lg rounded-xl border border-[#C9973B44] bg-[#221B15] p-8 text-center sm:p-10"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#C9973B66] bg-[#C9973B14]">
            <CheckCircle2 className="h-8 w-8 text-[#C9973B]" />
          </div>
          <h1 className="mt-5 text-3xl" style={serifStyle}>
            Захиалга <em className="italic text-[#C9973B]">баталгаажлаа</em>
          </h1>
          <p className="mt-2 text-sm text-[#A89A87]">
            Баярлалаа, {selectedService ? contact.name.trim() : ''}! Таны захиалгыг бүртгэж авлаа.
          </p>
          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#C9973B55] bg-[#C9973B14] px-4 py-1.5 text-sm font-semibold tracking-wider text-[#C9973B]">
            {confirmedId ? bookingRef(confirmedId) : ''}
          </div>

          <dl className="mt-7 space-y-3 rounded-lg border border-[#C9973B33] bg-[#1D1712] p-5 text-left text-sm">
            <Row label="Үйлчилгээ" value={selectedService?.name ?? ''} />
            <Row label="Залаач" value={barberName} />
            <Row label="Огноо" value={date ? `${fmtDayLabel(date)}` : ''} />
            <Row label="Цаг" value={time} />
            <Row label="Нийт дүн" value={fmtMNT(total)} gold />
            <Row
              label="Төлбөр"
              value={confirmedPaid ? 'төлөгдсөн ✓' : 'төлөгдөөгүй'}
              gold={!!confirmedPaid}
            />
          </dl>

          <p className="mt-4 text-xs leading-relaxed text-[#A89A87]">
            ⓘ Демо горим — бодит мөнгө шилжүүлээгүй, захиалгын мэдээлэл нь демо өгөгдөл юм.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <DemoLink
              href="/demo/barber"
              ariaLabel="Нүүр хуудас руу буцах"
              className={cn(buttonVariants({ size: 'lg' }), btnGold)}
            >
              Гэрлүүгээ
            </DemoLink>
            <DemoLink
              href="/demo/barber/status"
              ariaLabel="Миний захиалга харах"
              className={cn(buttonVariants({ size: 'lg', variant: 'outline' }), btnOutline)}
            >
              Миний захиалга
            </DemoLink>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="relative px-5 pb-24 pt-32 sm:px-8">
      <div className="absolute inset-0" style={noiseStyle} aria-hidden="true" />

      <div className="relative mx-auto max-w-5xl">
        <div className="text-center">
          <Kicker>ОНЛАЙН ЗАХИАЛГА</Kicker>
          <h1 className="mt-3 text-4xl sm:text-5xl" style={serifStyle}>
            Цагаа <em className="italic text-[#C9973B]">нөөцлүүлэх</em>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm text-[#A89A87]">
            Дөрвөн энгийн алхамаар үйлчилгээ, залаач, цагаа сонгоод төлбөрөө хийгээрэй.
          </p>
        </div>

        {/* ── Алхмын заагч ── */}
        <ol className="mx-auto mt-10 flex max-w-2xl items-start" aria-label="Захиалгын алхмууд">
          {STEPS.map((label, i) => {
            const n = i + 1
            const done = step > n
            const active = step === n
            return (
              <li key={label} className={cn('flex items-start', i < STEPS.length - 1 && 'flex-1')}>
                <button
                  type="button"
                  onClick={() => n < step && setStep(n)}
                  disabled={n >= step}
                  className={cn(
                    'flex flex-col items-center gap-1.5 rounded-md px-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9973B66]',
                    n < step && 'cursor-pointer'
                  )}
                  aria-current={active ? 'step' : undefined}
                >
                  <span
                    className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold transition-colors',
                      done && 'border-[#C9973B] bg-[#C9973B] text-[#171310]',
                      active && !done && 'border-[#C9973B] bg-transparent text-[#C9973B]',
                      !done && !active && 'border-[#3A3228] text-[#6E6152]'
                    )}
                  >
                    {done ? <Check className="h-4 w-4" /> : n}
                  </span>
                  <span
                    className={cn(
                      'text-[10px] uppercase tracking-wider sm:text-xs',
                      active ? 'text-[#C9973B]' : done ? 'text-[#CDBFA9]' : 'text-[#6E6152]'
                    )}
                  >
                    {label}
                  </span>
                </button>
                {i < STEPS.length - 1 && (
                  <span
                    className="mx-2 mt-4 h-px flex-1"
                    style={{ background: done ? '#C9973B' : '#3A3228' }}
                    aria-hidden="true"
                  />
                )}
              </li>
            )
          })}
        </ol>

        {/* ── Алхмууд ── */}
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="mt-10"
        >
          {/* 1 — Үйлчилгээ */}
          {step === 1 && (
            <div>
              <StepTitle icon={<Scissors className="h-4 w-4" />} title="Үйлчилгээ сонгох" />
              {servicesApi.loading ? (
                <LoadingState label="Үйлчилгээүүдийг ачаалж байна…" />
              ) : services.length === 0 ? (
                <EmptyState
                  title="Үйлчилгээ олдсонгүй"
                  description="Одоогоор идэвхтэй үйлчилгээ бүртгэгдээгүй байна."
                />
              ) : (
                <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {services.map((s) => {
                    const selected = s.id === serviceId
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => pickService(s.id)}
                        aria-pressed={selected}
                        className={cn(
                          'relative rounded-lg border p-5 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9973B66]',
                          selected
                            ? 'border-[#C9973B] bg-[#C9973B0F] ring-1 ring-[#C9973B]'
                            : 'border-[#C9973B33] bg-[#221B15] hover:border-[#C9973B66]'
                        )}
                      >
                        {selected && (
                          <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-[#C9973B] text-[#171310]">
                            <Check className="h-3 w-3" />
                          </span>
                        )}
                        <div className="flex items-start gap-2 pr-6">
                          <h3 className="text-lg leading-snug" style={serifStyle}>
                            {s.name}
                          </h3>
                        </div>
                        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-[#A89A87]">
                          {s.description}
                        </p>
                        <div className="mt-4 flex items-center gap-2">
                          <span className="text-base font-semibold text-[#C9973B]">
                            {fmtMNT(s.price)}
                          </span>
                          <span className="text-[11px] text-[#A89A87]">{s.durationMin} мин</span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* 2 — Залаач */}
          {step === 2 && (
            <div>
              <StepTitle icon={<Users className="h-4 w-4" />} title="Залаач сонгох" />
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <button
                  type="button"
                  onClick={() => pickBarber(ANY_BARBER)}
                  aria-pressed={barberPick === ANY_BARBER}
                  className={cn(
                    'relative flex flex-col items-center justify-center rounded-lg border p-6 text-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9973B66]',
                    barberPick === ANY_BARBER
                      ? 'border-[#C9973B] bg-[#C9973B0F] ring-1 ring-[#C9973B]'
                      : 'border-[#C9973B33] bg-[#221B15] hover:border-[#C9973B66]'
                  )}
                >
                  {barberPick === ANY_BARBER && (
                    <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-[#C9973B] text-[#171310]">
                      <Check className="h-3 w-3" />
                    </span>
                  )}
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[#C9973B55] bg-[#C9973B14]">
                    <Users className="h-5 w-5 text-[#C9973B]" />
                  </span>
                  <span className="mt-3 text-lg" style={serifStyle}>
                    Ямар ч залаач
                  </span>
                  <span className="mt-1 text-xs text-[#A89A87]">
                    Хамгийн тохиромжтой залаач танд хуваарилагдана
                  </span>
                </button>

                {barbers.map((b) => {
                  const selected = barberPick === b.id
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => pickBarber(b.id)}
                      aria-pressed={selected}
                      className={cn(
                        'relative flex gap-4 rounded-lg border p-4 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9973B66]',
                        selected
                          ? 'border-[#C9973B] bg-[#C9973B0F] ring-1 ring-[#C9973B]'
                          : 'border-[#C9973B33] bg-[#221B15] hover:border-[#C9973B66]'
                      )}
                    >
                      {selected && (
                        <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-[#C9973B] text-[#171310]">
                          <Check className="h-3 w-3" />
                        </span>
                      )}
                      <img
                        src={b.imageUrl || ''}
                        alt={b.name}
                        loading="lazy"
                        className="h-20 w-16 shrink-0 rounded-md border border-[#C9973B33] object-cover"
                      />
                      <div className="min-w-0 pr-5">
                        <h3 className="truncate text-lg" style={serifStyle}>
                          {b.name}
                        </h3>
                        <p className="truncate text-sm italic text-[#C9973B]">{b.title}</p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {b.specialties
                            .split(',')
                            .map((t) => t.trim())
                            .filter(Boolean)
                            .slice(0, 2)
                            .map((t) => (
                              <span
                                key={t}
                                className="rounded-full border border-[#C9973B33] px-2 py-0.5 text-[10px] text-[#A89A87]"
                              >
                                {t}
                              </span>
                            ))}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
              {barbersApi.loading && <LoadingState label="Залаачдыг ачаалж байна…" />}
            </div>
          )}

          {/* 3 — Огноо, цаг */}
          {step === 3 && (
            <div>
              <StepTitle icon={<CalendarDays className="h-4 w-4" />} title="Огноо, цаг сонгох" />
              <div className="mt-5 grid gap-6 lg:grid-cols-[280px_1fr]">
                <div className="space-y-2">
                  <Label htmlFor="bk-date" className="text-[#CDBFA9]">
                    Огноо
                  </Label>
                  <Input
                    id="bk-date"
                    type="date"
                    value={date}
                    min={todayStr()}
                    max={addDaysStr(todayStr(), 14)}
                    onChange={(e) => {
                      setDate(e.target.value)
                      setTime('')
                    }}
                    className={cn(inputCls, '[color-scheme:dark]')}
                  />
                  <p className="text-xs text-[#6E6152]">Өнөөдрөөс 14 хоногийн дотор сонгоно уу.</p>
                  {date && (
                    <p className="rounded-md border border-[#C9973B33] bg-[#1D1712] px-3 py-2 text-sm text-[#CDBFA9]">
                      {fmtDayLabel(date)}
                    </p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <Label className="text-[#CDBFA9]">Боломжтой цагууд</Label>
                    <span className="inline-flex items-center gap-1.5 text-xs text-[#A89A87]">
                      <Clock className="h-3.5 w-3.5 text-[#C9973B]" />
                      {selectedService ? `${selectedService.durationMin} мин үйлчилгээ` : '—'}
                    </span>
                  </div>
                  {!date ? (
                    <div className="mt-4">
                      <EmptyState
                        title="Эхлээд огноогоо сонгоно уу"
                        description="Зүүн талын огноо сонгогчоос өдрөө дарж сонгоорой."
                      />
                    </div>
                  ) : (
                    <>
                      <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-6">
                        {slots.map((t) => {
                          const taken = isTaken(t)
                          const past = isPastSlot(t)
                          const disabled = taken || past
                          const selected = time === t
                          return (
                            <button
                              key={t}
                              type="button"
                              disabled={disabled}
                              onClick={() => setTime(t)}
                              aria-pressed={selected}
                              aria-disabled={disabled}
                              className={cn(
                                'rounded-md border px-1 py-2 text-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9973B66]',
                                selected
                                  ? 'border-[#C9973B] bg-[#C9973B] font-semibold text-[#171310]'
                                  : disabled
                                    ? 'cursor-not-allowed border-[#2A241D] bg-[#1A1510] text-[#57503F]'
                                    : 'border-[#C9973B44] bg-[#221B15] text-[#F3EBDD] hover:border-[#C9973B] hover:bg-[#C9973B14]'
                              )}
                            >
                              <span className="block text-sm">{t}</span>
                              <span
                                className={cn(
                                  'block text-[9px] uppercase tracking-wider',
                                  selected ? 'text-[#171310]/70' : taken ? 'text-[#8A4A3B]' : 'text-transparent'
                                )}
                              >
                                {taken ? 'Эзлэгдсэн' : past ? 'Өнгөрсөн' : '·'}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                      <div className="mt-4 flex flex-wrap items-center gap-4 text-[11px] text-[#A89A87]">
                        <span className="inline-flex items-center gap-1.5">
                          <span className="h-3 w-3 rounded-sm border border-[#C9973B44] bg-[#221B15]" /> Боломжтой
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <span className="h-3 w-3 rounded-sm bg-[#C9973B]" /> Сонгосон
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <span className="h-3 w-3 rounded-sm bg-[#1A1510]" /> Эзлэгдсэн
                        </span>
                      </div>
                      {slots.every((t) => isTaken(t) || isPastSlot(t)) && (
                        <p className="mt-3 text-xs text-[#C96A3B]">
                          Уучлаарай, энэ өдөр боломжтой цаг үлдээгүй байна. Өөр өдөр сонгоно уу.
                        </p>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 4 — Холбоо барих */}
          {step === 4 && (
            <div>
              <StepTitle icon={<CreditCard className="h-4 w-4" />} title="Холбоо барих мэдээлэл" />
              <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_300px]">
                <form
                  className="space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault()
                    if (validateContact()) setPayOpen(true)
                  }}
                  noValidate
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Нэр *" error={errors.name} htmlFor="bk-name">
                      <Input
                        id="bk-name"
                        value={contact.name}
                        onChange={(e) => setContact({ ...contact, name: e.target.value })}
                        placeholder="Таны овог, нэр"
                        className={inputCls}
                        aria-invalid={!!errors.name}
                      />
                    </Field>
                    <Field label="Утас *" error={errors.phone} htmlFor="bk-phone">
                      <Input
                        id="bk-phone"
                        type="tel"
                        inputMode="numeric"
                        value={contact.phone}
                        onChange={(e) =>
                          setContact({ ...contact, phone: e.target.value.replace(/\D/g, '').slice(0, 8) })
                        }
                        placeholder="Жишээ: 99112233"
                        className={inputCls}
                        aria-invalid={!!errors.phone}
                      />
                    </Field>
                  </div>
                  <Field label="Имэйл (сонголттой)" error={errors.email} htmlFor="bk-email">
                    <Input
                      id="bk-email"
                      type="email"
                      value={contact.email}
                      onChange={(e) => setContact({ ...contact, email: e.target.value })}
                      placeholder="you@example.com"
                      className={inputCls}
                      aria-invalid={!!errors.email}
                    />
                  </Field>
                  <Field label="Тэмдэглэл (сонголттой)" htmlFor="bk-notes">
                    <Textarea
                      id="bk-notes"
                      value={contact.notes}
                      onChange={(e) => setContact({ ...contact, notes: e.target.value })}
                      placeholder="Онцгой хүсэлт, хэрэглэгчийн онцлог гэх мэт…"
                      rows={3}
                      className={cn(inputCls, 'resize-none')}
                    />
                  </Field>

                  {/* Нэгжилт — мобайл дээр доор харагдана */}
                  <div className="rounded-lg border border-[#C9973B33] bg-[#1D1712] p-4 lg:hidden">
                    <Summary
                      serviceName={selectedService?.name}
                      barberName={barberName}
                      date={date}
                      time={time}
                      total={total}
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className={cn(btnGold, 'w-full sm:w-auto')}
                    disabled={submitting}
                  >
                    <CreditCard className="h-4 w-4" />
                    Төлбөр төлөх
                  </Button>
                </form>

                <aside className="hidden self-start rounded-lg border border-[#C9973B33] bg-[#1D1712] p-5 lg:block">
                  <Summary
                    serviceName={selectedService?.name}
                    barberName={barberName}
                    date={date}
                    time={time}
                    total={total}
                  />
                </aside>
              </div>
            </div>
          )}
        </motion.div>

        {/* ── Алхмын навигаци ── */}
        {step < 4 && (
          <div className="mt-10 flex items-center justify-between border-t border-[#C9973B26] pt-6">
            <Button
              variant="outline"
              onClick={back}
              disabled={step === 1}
              className={cn(btnOutline, step === 1 && 'invisible')}
            >
              <ChevronLeft className="h-4 w-4" />
              Буцах
            </Button>
            <Button onClick={next} className={btnGold}>
              Дараах
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
        {step === 4 && (
          <div className="mt-6">
            <Button variant="outline" onClick={back} className={btnOutline}>
              <ChevronLeft className="h-4 w-4" />
              Буцах
            </Button>
          </div>
        )}
      </div>

      <FakePaymentModal
        open={payOpen}
        onClose={handlePayClose}
        amount={total}
        merchant="ГАН Barbershop"
        accent="#C9973B"
        processPayment={processPayment}
      />
    </div>
  )
}

// ─────────────────────────── Жижиг хэсгүүд ───────────────────────────

function StepTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#C9973B55] bg-[#C9973B14] text-[#C9973B]">
        {icon}
      </span>
      <h2 className="text-2xl" style={serifStyle}>
        {title}
      </h2>
    </div>
  )
}

function Row({ label, value, gold }: { label: string; value: string; gold?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-[#A89A87]">{label}</dt>
      <dd className={cn('text-right font-medium', gold && 'text-[#C9973B]')}>{value}</dd>
    </div>
  )
}

function Field({
  label,
  error,
  htmlFor,
  children,
}: {
  label: string
  error?: string
  htmlFor: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor} className="text-[#CDBFA9]">
        {label}
      </Label>
      {children}
      {error && (
        <p role="alert" className="text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  )
}

function Summary({
  serviceName,
  barberName,
  date,
  time,
  total,
}: {
  serviceName?: string
  barberName: string
  date: string
  time: string
  total: number
}) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C9973B]">
        Захиалгын хураангуй
      </p>
      <dl className="mt-4 space-y-3 text-sm">
        <Row label="Үйлчилгээ" value={serviceName ?? '— сонгоогүй —'} />
        <Row label="Залаач" value={barberName} />
        <Row label="Огноо" value={date ? fmtDayLabel(date) : '—'} />
        <Row label="Цаг" value={time || '—'} />
      </dl>
      <div className="mt-4 flex items-center justify-between border-t border-[#C9973B33] pt-4">
        <span className="text-sm text-[#A89A87]">Нийт дүн</span>
        <span className="text-xl font-semibold text-[#C9973B]">{fmtMNT(total)}</span>
      </div>
      <p className="mt-3 text-[11px] leading-relaxed text-[#6E6152]">
        Төлбөрийг демо карт цонхоор төлнө. Бодит мөнгөн гүйлгээ хийгдэхгүй.
      </p>
    </div>
  )
}
