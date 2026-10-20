'use client'

/**
 * ШОНХОР Gaming Café — Захиалгын хуудас
 * Алхамт урсгал: Бүс → PC → Огноо/цаг/хугацаа → Холбоо барих → Төлбөр
 * Давхцлын шалгалт: ижил өдөр + цагийн муж давхцаж буй идэвхтэй захиалгатай суудлыг идэвхгүй болгоно.
 */

import { useMemo, useState } from 'react'
import {
  Search,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  MonitorX,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { toast } from 'sonner'
import { navigate } from '@/lib/hash-router'
import { useApi } from '@/lib/use-api'
import { FakePaymentModal } from '@/components/shared/demo-kit'
import { StatusBadge, EmptyState, LoadingState } from '@/components/shared/admin-kit'
import { cn } from '@/lib/utils'
import {
  NEON,
  TEXT,
  CLIP_SM,
  GRID_BG,
  ZONES,
  ZONE_DESC,
  zoneIcon,
  ClipCard,
  GlowDot,
  STATUS_DOT,
  START_TIMES,
  toMin,
  timesOverlap,
  todayStr,
  plusDaysStr,
  weekdayOf,
  endTimeLabel,
  fmtN,
  refCode,
  BTN_PRIMARY,
  BTN_GHOST,
  INPUT_CLS,
  type Station,
  type Booking,
} from './shared'

const STEPS = ['Бүс', 'PC', 'Цаг', 'Мэдээлэл', 'Төлбөр']

export function BookingPage({ initialZone }: { initialZone?: string }) {
  const stationsApi = useApi<Station>('pc-stations')
  const bookingsApi = useApi<Booking>('pc-bookings')

  const [step, setStep] = useState(1)
  const [zone, setZone] = useState<string | null>(
    initialZone && (ZONES as readonly string[]).includes(initialZone) ? initialZone : null
  )
  const [stationId, setStationId] = useState<string | null>(null)
  const [date, setDate] = useState(todayStr())
  const [startTime, setStartTime] = useState('18:00')
  const [hours, setHours] = useState(2)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [search, setSearch] = useState('')
  const [payOpen, setPayOpen] = useState(false)
  const [confirmed, setConfirmed] = useState<Booking | null>(null)
  const [pending, setPending] = useState<Booking | null>(null) // төлбөр татгалзсаны дараа төлөгдөөгүй үлдсэн захиалга

  const station = useMemo(
    () => stationsApi.data.find((s) => s.id === stationId) ?? null,
    [stationsApi.data, stationId]
  )
  const zoneStations = useMemo(
    () => stationsApi.data.filter((s) => s.zone === zone && s.active !== false),
    [stationsApi.data, zone]
  )
  const filteredStations = useMemo(() => {
    const q = search.trim().toLowerCase()
    return q ? zoneStations.filter((s) => s.name.toLowerCase().includes(q)) : zoneStations
  }, [zoneStations, search])

  /** Сонгосон өдөр/цагт давхцаж буй идэвхтэй захиалгатай суудлууд */
  const takenIds = useMemo(() => {
    const set = new Set<string>()
    const sm = toMin(startTime)
    for (const b of bookingsApi.data) {
      if (b.status !== 'идэвхтэй' || b.date !== date || !b.stationId) continue
      if (timesOverlap(sm, hours, toMin(b.startTime), b.hours)) set.add(b.stationId)
    }
    return set
  }, [bookingsApi.data, date, startTime, hours])

  const selectedTaken = station ? takenIds.has(station.id) : false
  const total = station ? station.pricePerHour * hours : 0

  /** Бүс бүрийн хамгийн бага үнэ (алхам 1-ийн картад) */
  const zoneMin = useMemo(() => {
    const map: Record<string, number> = {}
    for (const z of ZONES) {
      const list = stationsApi.data.filter((s) => s.zone === z)
      if (list.length) map[z] = Math.min(...list.map((s) => s.pricePerHour))
    }
    return map
  }, [stationsApi.data])

  // ─── Төлбөрийн урсгал ───
  const buildPayload = (paymentStatus: string) => ({
    stationId: station!.id,
    stationName: station!.name,
    zone: station!.zone,
    date,
    startTime,
    hours,
    customerName: name.trim(),
    phone: phone.trim(),
    totalAmount: total,
    status: 'идэвхтэй',
    paymentStatus,
  })

  const processPayment = async (outcome: 'approved' | 'rejected') => {
    if (!station) throw new Error('Суудал сонгогдоогүй байна')
    if (outcome === 'rejected') {
      // Татгалзсан: захиалгыг төлөгдөөгүй төлөвтэй хадгалж, дараа нь дахин төлөх боломжтой
      const created = pending
        ? await bookingsApi.update(pending.id, { paymentStatus: 'төлөгдөөгүй' })
        : await bookingsApi.create(buildPayload('төлөгдөөгүй'))
      setPending(created)
      toast.warning('Төлбөр татгалзагдлаа — захиалга төлөгдөөгүй төлөвтэй хадгалагдлаа.')
      return
    }
    const created = pending
      ? await bookingsApi.update(pending.id, { paymentStatus: 'төлөгдсөн' })
      : await bookingsApi.create(buildPayload('төлөгдсөн'))
    setPending(null)
    setConfirmed(created)
    toast.success('Захиалга амжилттай бүртгэгдлээ!')
  }

  // ─── Алхам шилжилт ───
  const goNext = () => {
    if (step === 1) {
      if (!zone) {
        toast.error('Эхлээд бүсээ сонгоно уу')
        return
      }
      setStep(2)
      return
    }
    if (step === 2) {
      if (!station) {
        toast.error('Суудал сонгоно уу')
        return
      }
      if (station.status !== 'боломжтой') {
        toast.error('Энэ суудал одоогоор боломжгүй байна')
        return
      }
      if (selectedTaken) {
        toast.error('Уг цагт энэ суудал аль хэдийн эзлэгдсэн байна')
        return
      }
      setStep(3)
      return
    }
    if (step === 3) {
      setStep(4)
      return
    }
    if (step === 4) {
      const errs: Record<string, string> = {}
      if (name.trim().length < 2) errs.name = 'Нэрээ бичнэ үү'
      if (!/^\d{8}$/.test(phone.trim())) errs.phone = 'Утасны дугаар 8 оронтой тоо байх ёстой'
      setErrors(errs)
      if (Object.keys(errs).length > 0) {
        toast.error('Мэдээллээ шалгаж бүрэн бөглөнө үү')
        return
      }
      setStep(5)
    }
  }

  const openPayment = () => {
    if (!station) return
    if (selectedTaken) {
      toast.error('Уг цагт суудал эзлэгдсэн байна — өөр цаг эсвэл суудал сонгоно уу')
      return
    }
    setPayOpen(true)
  }

  const cancelPending = async () => {
    if (!pending) return
    try {
      await bookingsApi.update(pending.id, { status: 'цуцлагдсан' })
      toast.success('Захиалгыг цуцаллаа')
      setPending(null)
    } catch {
      toast.error('Цуцлахад алдаа гарлаа')
    }
  }

  const resetAll = () => {
    setStep(1)
    setZone(null)
    setStationId(null)
    setName('')
    setPhone('')
    setErrors({})
    setSearch('')
    setConfirmed(null)
    setPending(null)
    setDate(todayStr())
    setStartTime('18:00')
    setHours(2)
  }

  // ─── Ачаалал / алдаа ───
  if (stationsApi.loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16">
        <LoadingState label="Суудлуудыг ачаалж байна…" />
      </div>
    )
  }
  if (stationsApi.error) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16">
        <EmptyState
          title="Мэдээлэл ачаалахад алдаа гарлаа"
          description={stationsApi.error}
          action={
            <Button className={BTN_GHOST} onClick={() => stationsApi.reload()}>
              Дахин оролдох
            </Button>
          }
        />
      </div>
    )
  }

  // ─── Амжилттай баталгаажсан дэлгэц ───
  if (confirmed) {
    return <Confirmation booking={confirmed} onHome={resetAll} />
  }

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-0" style={GRID_BG} aria-hidden />
      <div className="relative mx-auto max-w-6xl px-4 py-10 sm:py-14">
        <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: NEON }}>
          ЗАХИАЛГА
        </p>
        <h1 className="text-3xl sm:text-4xl" style={{ fontFamily: 'var(--font-russo)', color: TEXT }}>
          Суудал захиалах
        </h1>

        {/* Алхмын чипүүд */}
        <ol className="mt-6 flex gap-2 overflow-x-auto pb-1 nice-scroll" aria-label="Захиалгын алхмууд">
          {STEPS.map((label, i) => {
            const n = i + 1
            const active = n === step
            const done = n < step
            return (
              <li key={label}>
                <button
                  type="button"
                  disabled={!done}
                  onClick={() => done && setStep(n)}
                  className={cn(
                    'whitespace-nowrap px-3 py-1.5 font-mono text-[11px] tracking-wider transition-colors',
                    active && 'bg-[#2CE080] font-bold text-[#04110B]',
                    done && 'border border-[#2CE08066] text-[#2CE080] hover:bg-[#2CE08014]',
                    !active && !done && 'border border-[#2CE08026] text-[#E7F5EC77]'
                  )}
                  style={{ clipPath: CLIP_SM }}
                  aria-current={active ? 'step' : undefined}
                >
                  {n}. {label}
                </button>
              </li>
            )
          })}
        </ol>

        <div className="mt-6">
          <ClipCard>
            <div className="p-5 sm:p-8">
              {step === 1 && (
                <StepZone zone={zone} zoneMin={zoneMin} onSelect={setZone} />
              )}
              {step === 2 && (
                <StepStation
                  zone={zone!}
                  stations={filteredStations}
                  totalCount={zoneStations.length}
                  search={search}
                  onSearch={setSearch}
                  stationId={stationId}
                  takenIds={takenIds}
                  date={date}
                  startTime={startTime}
                  hours={hours}
                  onSelect={setStationId}
                />
              )}
              {step === 3 && (
                <StepTime
                  station={station!}
                  date={date}
                  onDate={setDate}
                  startTime={startTime}
                  onStart={setStartTime}
                  hours={hours}
                  onHours={setHours}
                  taken={selectedTaken}
                />
              )}
              {step === 4 && (
                <StepContact
                  name={name}
                  onName={setName}
                  phone={phone}
                  onPhone={setPhone}
                  errors={errors}
                />
              )}
              {step === 5 && (
                <StepReview
                  station={station!}
                  date={date}
                  startTime={startTime}
                  hours={hours}
                  name={name.trim()}
                  phone={phone.trim()}
                  total={total}
                  taken={selectedTaken}
                  pending={pending}
                  onPay={openPayment}
                  onCancelPending={cancelPending}
                />
              )}

              {/* Навигацийн товчнууд */}
              {step < 5 && (
                <div className="mt-8 flex items-center justify-between border-t border-[#2CE0801A] pt-5">
                  <Button
                    variant="outline"
                    className={BTN_GHOST}
                    disabled={step === 1}
                    onClick={() => setStep((s) => Math.max(1, s - 1))}
                  >
                    <ChevronLeft className="mr-1 h-4 w-4" aria-hidden />
                    Буцах
                  </Button>
                  <Button className={BTN_PRIMARY} style={{ clipPath: CLIP_SM }} onClick={goNext}>
                    Үргэлжлүүлэх
                    <ChevronRight className="ml-1 h-4 w-4" aria-hidden />
                  </Button>
                </div>
              )}
            </div>
          </ClipCard>
        </div>
      </div>

      <FakePaymentModal
        open={payOpen}
        onClose={() => setPayOpen(false)}
        amount={total}
        merchant="ШОНХОР Gaming Café"
        accent="#2CE080"
        processPayment={processPayment}
      />
    </div>
  )
}

// ─── Алхам 1: Бүс сонгох ───
function StepZone({
  zone,
  zoneMin,
  onSelect,
}: {
  zone: string | null
  zoneMin: Record<string, number>
  onSelect: (z: string) => void
}) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-[#E7F5EC]">1. Бүс сонгох</h2>
      <p className="mt-1 text-sm text-[#E7F5EC99]">Ямар бүсэд тоглохоо сонгоно уу.</p>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {ZONES.map((z) => {
          const Icon = zoneIcon(z)
          const selected = zone === z
          return (
            <button
              key={z}
              type="button"
              onClick={() => onSelect(z)}
              aria-pressed={selected}
              className={cn(
                'border p-5 text-left transition-all',
                selected
                  ? 'border-[#2CE080] bg-[#2CE08014] shadow-[inset_0_0_30px_rgba(44,224,128,0.08)]'
                  : 'border-[#2CE08026] bg-[#06170F] hover:border-[#2CE08066]'
              )}
            >
              <div className="flex items-center justify-between">
                <Icon className="h-5 w-5" style={{ color: NEON }} aria-hidden />
                {selected && <CheckCircle2 className="h-4 w-4" style={{ color: NEON }} aria-hidden />}
              </div>
              <p className="mt-3 text-lg" style={{ fontFamily: 'var(--font-russo)', color: TEXT }}>
                {z}
              </p>
              <p className="mt-1.5 text-[13px] text-[#E7F5EC99]">{ZONE_DESC[z]}</p>
              <p className="mt-3 font-mono text-sm" style={{ color: NEON }}>
                {zoneMin[z] ? `${fmtN(zoneMin[z])}₮ / цагаас` : '…'}
              </p>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── Алхам 2: PC сонгох ───
function StepStation({
  zone,
  stations,
  totalCount,
  search,
  onSearch,
  stationId,
  takenIds,
  date,
  startTime,
  hours,
  onSelect,
}: {
  zone: string
  stations: Station[]
  totalCount: number
  search: string
  onSearch: (v: string) => void
  stationId: string | null
  takenIds: Set<string>
  date: string
  startTime: string
  hours: number
  onSelect: (id: string) => void
}) {
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-[#E7F5EC]">2. PC сонгох</h2>
          <p className="mt-1 text-sm text-[#E7F5EC99]">
            <span className="font-mono text-[#2CE080]">{zone}</span> бүсийн суудлууд —{' '}
            {weekdayOf(date)}, {date} · {startTime} + {hours} цаг
          </p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#E7F5EC66]" aria-hidden />
          <Input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Нэрээр хайх: S-01…"
            className={`${INPUT_CLS} pl-9 font-mono`}
            aria-label="Суудлаар хайх"
          />
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {stations.map((st) => {
          const selected = stationId === st.id
          const dynamicTaken = takenIds.has(st.id)
          const disabled = st.status !== 'боломжтой' || dynamicTaken
          return (
            <button
              key={st.id}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(st.id)}
              aria-pressed={selected}
              className={cn(
                'w-full border p-4 text-left transition-all',
                selected
                  ? 'border-[#2CE080] bg-[#2CE08014] shadow-[inset_0_0_30px_rgba(44,224,128,0.08)]'
                  : 'border-[#2CE08026] bg-[#06170F] hover:border-[#2CE08066]',
                disabled && 'cursor-not-allowed opacity-55'
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-base tracking-wide" style={{ fontFamily: 'var(--font-russo)', color: TEXT }}>
                  {st.name}
                </span>
                {dynamicTaken ? (
                  <span className="inline-flex items-center gap-1.5 border border-[#F8717155] bg-[#F8717114] px-2 py-0.5 text-[11px] font-medium text-[#F87171]">
                    <AlertTriangle className="h-3 w-3" aria-hidden />
                    Уг цагт эзлэгдсэн
                  </span>
                ) : (
                  <GlowDot color={STATUS_DOT[st.status] ?? NEON} label={st.status} />
                )}
              </div>
              <div className="mt-3 space-y-1 font-mono text-[12px] leading-relaxed text-[#E7F5ECCC]">
                <p><span className="text-[#E7F5EC66]">CPU</span>&ensp;{st.cpu}</p>
                <p><span className="text-[#E7F5EC66]">GPU</span>&ensp;{st.gpu}</p>
                <p><span className="text-[#E7F5EC66]">RAM</span>&ensp;{st.ram}</p>
                {st.extras && <p className="text-[#A3E635]">{st.extras}</p>}
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-[#2CE0801A] pt-2.5">
                <span className="font-mono text-sm" style={{ color: NEON }}>
                  {fmtN(st.pricePerHour)}₮<span className="text-[#E7F5EC88]">/цаг</span>
                </span>
                {selected && <CheckCircle2 className="h-4 w-4" style={{ color: NEON }} aria-hidden />}
              </div>
            </button>
          )
        })}
      </div>

      {stations.length === 0 && (
        <div className="mt-5">
          <EmptyState
            icon={<MonitorX className="h-5 w-5 text-muted-foreground" />}
            title={totalCount === 0 ? 'Энэ бүст суудал бүртгэгдээгүй байна' : 'Илэрц олдсонгүй'}
            description={totalCount === 0 ? 'Өөр бүс сонгоно уу.' : 'Өөр нэрээр хайж үзнэ үү.'}
          />
        </div>
      )}
    </div>
  )
}

// ─── Алхам 3: Огноо, цаг, хугацаа ───
function StepTime({
  station,
  date,
  onDate,
  startTime,
  onStart,
  hours,
  onHours,
  taken,
}: {
  station: Station
  date: string
  onDate: (v: string) => void
  startTime: string
  onStart: (v: string) => void
  hours: number
  onHours: (v: number) => void
  taken: boolean
}) {
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
      <div>
        <h2 className="text-lg font-semibold text-[#E7F5EC]">3. Огноо, цаг, хугацаа</h2>

        <div className="mt-5 max-w-xs">
          <Label htmlFor="bk-date" className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#E7F5EC88]">
            Огноо (одоогоос +14 хоног)
          </Label>
          <div className="relative mt-1.5">
            <CalendarDays className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#E7F5EC66]" aria-hidden />
            <Input
              id="bk-date"
              type="date"
              value={date}
              min={todayStr()}
              max={plusDaysStr(14)}
              onChange={(e) => onDate(e.target.value || todayStr())}
              className={`${INPUT_CLS} font-mono`}
            />
          </div>
        </div>

        <div className="mt-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#E7F5EC88]">Эхлэх цаг</p>
          <div className="mt-2 grid grid-cols-4 gap-2 sm:grid-cols-7">
            {START_TIMES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => onStart(t)}
                aria-pressed={startTime === t}
                className={cn(
                  'border px-2 py-1.5 font-mono text-[12px] transition-colors',
                  startTime === t
                    ? 'border-[#2CE080] bg-[#2CE080] font-bold text-[#04110B]'
                    : 'border-[#2CE08026] bg-[#06170F] text-[#E7F5ECCC] hover:border-[#2CE08066]'
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#E7F5EC88]">Хугацаа</p>
            <p className="font-mono text-sm" style={{ color: NEON }}>
              {hours} цаг
            </p>
          </div>
          <div className="mt-3 px-1">
            <Slider
              min={1}
              max={8}
              step={1}
              value={[hours]}
              onValueChange={(v) => onHours(v[0])}
              aria-label="Цагийн хугацаа — цагаар"
              className="[&_[data-slot=slider-range]]:bg-[#2CE080] [&_[data-slot=slider-thumb]]:border-[#2CE080] [&_[data-slot=slider-thumb]]:bg-[#0A1F16] [&_[data-slot=slider-track]]:bg-[#0A1F16]"
            />
            <div className="mt-1.5 flex justify-between font-mono text-[10px] text-[#E7F5EC66]">
              <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span>
            </div>
          </div>
        </div>
      </div>

      {/* Цагийн хураангуй */}
      <ClipCard bg="#06170F">
        <div className="p-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em]" style={{ color: NEON }}>
            ХУРААНГУЙ
          </p>
          <dl className="mt-4 space-y-2.5 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-[#E7F5EC99]">Суудал</dt>
              <dd className="font-mono text-[#E7F5EC]">{station.name}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-[#E7F5EC99]">Огноо</dt>
              <dd className="text-right font-mono text-[#E7F5EC]">
                {date}
                <span className="block text-[11px] text-[#E7F5EC88]">{weekdayOf(date)}</span>
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-[#E7F5EC99]">Цаг</dt>
              <dd className="font-mono text-[#E7F5EC]">
                {startTime} → {endTimeLabel(startTime, hours)}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-[#E7F5EC99]">Хугацаа</dt>
              <dd className="font-mono text-[#E7F5EC]">{hours} цаг</dd>
            </div>
          </dl>
          <div className="mt-4 border-t border-[#2CE0801A] pt-3">
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#E7F5EC88]">Нийт</span>
              <span className="text-xl" style={{ fontFamily: 'var(--font-russo)', color: NEON }}>
                {fmtN(station.pricePerHour * hours)}₮
              </span>
            </div>
            <p className="mt-1 text-right font-mono text-[11px] text-[#E7F5EC88]">
              {fmtN(station.pricePerHour)}₮ × {hours} цаг
            </p>
          </div>
          {taken && (
            <p className="mt-3 flex items-start gap-2 border border-[#F8717155] bg-[#F8717114] px-3 py-2 text-[12px] text-[#F87171]">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
              Уг цагт эзлэгдсэн — өөр цаг эсвэл суудал сонгоно уу.
            </p>
          )}
        </div>
      </ClipCard>
    </div>
  )
}

// ─── Алхам 4: Холбоо барих ───
function StepContact({
  name,
  onName,
  phone,
  onPhone,
  errors,
}: {
  name: string
  onName: (v: string) => void
  phone: string
  onPhone: (v: string) => void
  errors: Record<string, string>
}) {
  return (
    <div className="max-w-md">
      <h2 className="text-lg font-semibold text-[#E7F5EC]">4. Холбоо барих мэдээлэл</h2>
      <p className="mt-1 text-sm text-[#E7F5EC99]">
        Утасны дугаар нь захиалгаа олох, цуцлахад ашиглагдана.
      </p>
      <div className="mt-5 space-y-4">
        <div>
          <Label htmlFor="bk-name" className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#E7F5EC88]">
            Нэр <span style={{ color: NEON }}>*</span>
          </Label>
          <Input
            id="bk-name"
            value={name}
            onChange={(e) => onName(e.target.value)}
            placeholder="Жишээ: Батбаяр Дорж"
            className={INPUT_CLS}
            aria-invalid={!!errors.name}
            autoComplete="name"
          />
          {errors.name && <p className="mt-1.5 text-xs text-[#F87171]">{errors.name}</p>}
        </div>
        <div>
          <Label htmlFor="bk-phone" className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#E7F5EC88]">
            Утас (8 оронтой) <span style={{ color: NEON }}>*</span>
          </Label>
          <Input
            id="bk-phone"
            value={phone}
            onChange={(e) => onPhone(e.target.value.replace(/\D/g, '').slice(0, 8))}
            placeholder="Жишээ: 99112233"
            inputMode="numeric"
            className={`${INPUT_CLS} font-mono`}
            aria-invalid={!!errors.phone}
            autoComplete="tel"
          />
          {errors.phone && <p className="mt-1.5 text-xs text-[#F87171]">{errors.phone}</p>}
        </div>
      </div>
    </div>
  )
}

// ─── Алхам 5: Хянах + төлбөр ───
function StepReview({
  station,
  date,
  startTime,
  hours,
  name,
  phone,
  total,
  taken,
  pending,
  onPay,
  onCancelPending,
}: {
  station: Station
  date: string
  startTime: string
  hours: number
  name: string
  phone: string
  total: number
  taken: boolean
  pending: Booking | null
  onPay: () => void
  onCancelPending: () => void
}) {
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
      <div>
        <h2 className="text-lg font-semibold text-[#E7F5EC]">5. Шалгаж төлбөр төлөх</h2>
        <dl className="mt-5 max-w-md space-y-3 text-sm">
          {[
            ['Суудал', `${station.name} · ${station.zone} бүс`],
            ['Тохиргоо', station.cpu],
            ['Огноо', `${date} (${weekdayOf(date)})`],
            ['Цаг', `${startTime} → ${endTimeLabel(startTime, hours)} · ${hours} цаг`],
            ['Хэрэглэгч', name],
            ['Утас', phone],
          ].map(([k, v]) => (
            <div key={k} className="flex items-start justify-between gap-4 border-b border-[#2CE08014] pb-2.5">
              <dt className="shrink-0 text-[#E7F5EC99]">{k}</dt>
              <dd className="text-right font-mono text-[13px] text-[#E7F5EC]">{v}</dd>
            </div>
          ))}
        </dl>

        {pending && (
          <div className="mt-5 max-w-md border border-[#A3E63555] bg-[#A3E63510] p-4">
            <p className="flex items-start gap-2 text-sm text-[#A3E635]">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              Таны захиалга <span className="font-mono">{refCode(pending.id)}</span> төлөгдөөгүй
              төлөвтэй түр бүртгэгдсэн байна. Дахин төлөх эсвэл цуцлаж болно.
            </p>
            <div className="mt-3 flex gap-2">
              <Button size="sm" className={BTN_PRIMARY} style={{ clipPath: CLIP_SM }} onClick={onPay}>
                Дахин төлөх
              </Button>
              <Button size="sm" variant="outline" className={BTN_GHOST} onClick={onCancelPending}>
                Захиалгыг цуцлах
              </Button>
            </div>
          </div>
        )}

        {taken && !pending && (
          <p className="mt-5 flex max-w-md items-start gap-2 border border-[#F8717155] bg-[#F8717114] px-3 py-2 text-[13px] text-[#F87171]">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            Уг цагт суудал эзлэгдсэн байна — алхам 2 эсвэл 3 рүү буцаж өөр сонголт хийнэ үү.
          </p>
        )}
      </div>

      <ClipCard bg="#06170F">
        <div className="p-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em]" style={{ color: NEON }}>
            ТӨЛБӨР
          </p>
          <p className="mt-4 text-3xl" style={{ fontFamily: 'var(--font-russo)', color: TEXT }}>
            {fmtN(total)}₮
          </p>
          <p className="mt-1 font-mono text-[11px] text-[#E7F5EC88]">
            {fmtN(station.pricePerHour)}₮ × {hours} цаг
          </p>
          <Button
            className={`mt-5 w-full ${BTN_PRIMARY}`}
            style={{ clipPath: CLIP_SM }}
            onClick={onPay}
            disabled={taken && !pending}
          >
            Төлбөр хийх
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
          </Button>
          <p className="mt-3 text-center font-mono text-[10px] leading-relaxed text-[#E7F5EC88]">
            ДЕМО горим — бодит мөнгөн гүйлгээ хийгдэхгүй
          </p>
        </div>
      </ClipCard>
    </div>
  )
}

// ─── Баталгаажсан захиалгын дэлгэц ───
function Confirmation({ booking, onHome }: { booking: Booking; onHome: () => void }) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-0" style={GRID_BG} aria-hidden />
      <div className="relative mx-auto max-w-lg px-4 py-14 sm:py-20">
        <ClipCard>
          <div className="p-8 text-center">
            <CheckCircle2 className="mx-auto h-14 w-14" style={{ color: NEON }} aria-hidden />
            <h1 className="mt-4 text-2xl" style={{ fontFamily: 'var(--font-russo)', color: TEXT }}>
              Захиалга баталгаажлаа
            </h1>
            <p className="mt-2 text-sm text-[#E7F5EC99]">Лавлах код</p>
            <p
              className="mt-1 font-mono text-2xl tracking-[0.2em]"
              style={{ color: NEON, textShadow: '0 0 14px rgba(44,224,128,0.55)' }}
            >
              {refCode(booking.id)}
            </p>

            <dl className="mt-6 space-y-2.5 text-left text-sm">
              {[
                ['Суудал', `${booking.stationName} · ${booking.zone} бүс`],
                ['Огноо', `${booking.date} (${weekdayOf(booking.date)})`],
                ['Цаг', `${booking.startTime} → ${endTimeLabel(booking.startTime, booking.hours)} · ${booking.hours} цаг`],
                ['Дүн', `${fmtN(booking.totalAmount)}₮`],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between gap-4 border-b border-[#2CE08014] pb-2">
                  <dt className="text-[#E7F5EC99]">{k}</dt>
                  <dd className="font-mono text-[13px] text-[#E7F5EC]">{v}</dd>
                </div>
              ))}
              <div className="flex items-center justify-between gap-4 pt-1">
                <dt className="text-[#E7F5EC99]">Төлбөр</dt>
                <dd>
                  <StatusBadge status={booking.paymentStatus} />
                </dd>
              </div>
            </dl>

            {booking.paymentStatus === 'төлөгдөөгүй' && (
              <p className="mt-4 flex items-start gap-2 border border-[#A3E63555] bg-[#A3E63510] px-3 py-2 text-left text-[12px] text-[#A3E635]">
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                Захиалга төлөгдөөгүй төлөвтэй хадгалагдлаа — демо горимын татгалзах үр дүн.
              </p>
            )}

            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <Button
                className={`flex-1 ${BTN_PRIMARY}`}
                style={{ clipPath: CLIP_SM }}
                onClick={() => navigate('/demo/pc-cafe/status')}
              >
                Миний захиалга үзэх
              </Button>
              <Button
                variant="outline"
                className={`flex-1 ${BTN_GHOST}`}
                style={{ clipPath: CLIP_SM }}
                onClick={onHome}
              >
                Дахин захиалах
              </Button>
            </div>
          </div>
        </ClipCard>
      </div>
    </div>
  )
}
