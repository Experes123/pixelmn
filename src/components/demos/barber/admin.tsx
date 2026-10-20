'use client'

/**
 * ГАН Barbershop — Админ панел (демо).
 * Табууд: Тайлан, Хуваарь, Захиалга, Үйлчилгээ, Залаачид.
 * Бодит API (/api/barber-*)-тай ажиллана; бүх өгөгдөл нь демо юм.
 */

import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { useApi } from '@/lib/use-api'
import { DemoLink } from '@/lib/hash-router'
import { DemoAdminGate, DemoAdminLogoutButton, useDemoAdminAuth } from '@/components/shared/demo-gate'
import {
  ConfirmDelete,
  DemoDataNote,
  EmptyState,
  LoadingState,
  StatusBadge,
  fmtMNT,
} from '@/components/shared/admin-kit'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import {
  BadgeCheck,
  CalendarDays,
  CalendarRange,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Coins,
  Eye,
  LayoutDashboard,
  Mail,
  Pencil,
  Phone,
  Plus,
  Search,
  Scissors,
  StickyNote,
  Trash2,
  UserX,
  Users,
  X,
} from 'lucide-react'
import {
  BARBER_IMAGES,
  CATEGORIES,
  Kicker,
  addDaysStr,
  btnOutline,
  catLabel,
  fmtDayLabel,
  inputCls,
  serifStyle,
  todayStr,
  type Barber,
  type Booking,
  type Service,
} from './parts'

const BOOKING_STATUSES = ['хүлээгдэж буй', 'баталгаажсан', 'дууссан', 'цуцлагдсан'] as const

export default function AdminPanel() {
  const { authed, pass, logout } = useDemoAdminAuth('gan-admin-ok')
  if (!authed)
    return (
      <div className="dark">
        <DemoAdminGate title="ГАН Админ" accent="#C9973B" dark onPass={pass} backHref="/demo/barber" />
      </div>
    )
  return <AdminPanelInner onLogout={logout} />
}

function AdminPanelInner({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState('report')
  const [focusDate, setFocusDate] = useState<string | null>(null)

  /** Хуваариас өдөр дээр дарахад Захиалга табыг тухайн огноогоор шүүж нээнэ */
  const goToDate = (date: string) => {
    setFocusDate(date)
    setTab('bookings')
  }

  return (
    <div
      className="dark min-h-screen bg-[#171310] text-[#F3EBDD]"
      style={{ fontFamily: 'var(--font-inter), sans-serif' }}
    >
      <header className="sticky top-0 z-40 border-b border-[#C9973B33] bg-[#171310]/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 pl-[128px] pr-4 sm:pl-[200px] sm:pr-8">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <span className="truncate whitespace-nowrap text-xl tracking-wide text-[#C9973B]" style={serifStyle}>
              ГАН Админ
            </span>
            <span className="hidden shrink-0 items-center rounded-full border border-[#C9973B66] bg-[#C9973B14] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#C9973B] sm:inline-flex">
              Демо админ
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <DemoAdminLogoutButton dark onLogout={onLogout} />
            <DemoLink
              href="/demo/barber"
              ariaLabel="Демо сайт руу буцах"
              className="inline-flex items-center gap-1 text-xs font-medium text-[#A89A87] transition-colors hover:text-[#C9973B]"
            >
              <span className="sr-only sm:not-sr-only">Сайт руу буцах</span>
              <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            </DemoLink>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-8 sm:py-10">
        <div className="mb-6">
          <Kicker>УДИРДЛАГА</Kicker>
          <h1 className="mt-2 text-3xl" style={serifStyle}>
            Захиалга, үйлчилгээний <em className="italic text-[#C9973B]">удирдлага</em>
          </h1>
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="h-auto flex-wrap gap-1 rounded-lg border border-[#C9973B33] bg-[#221B15] p-1">
            <AdminTrigger value="report" icon={<LayoutDashboard className="h-4 w-4" />} label="Тайлан" />
            <AdminTrigger value="schedule" icon={<CalendarRange className="h-4 w-4" />} label="Хуваарь" />
            <AdminTrigger value="bookings" icon={<CalendarDays className="h-4 w-4" />} label="Захиалга" />
            <AdminTrigger value="services" icon={<Scissors className="h-4 w-4" />} label="Үйлчилгээ" />
            <AdminTrigger value="barbers" icon={<Users className="h-4 w-4" />} label="Залаачид" />
          </TabsList>

          <TabsContent value="report" className="mt-6">
            <ReportTab />
          </TabsContent>
          <TabsContent value="schedule" className="mt-6">
            <ScheduleTab onPickDate={goToDate} />
          </TabsContent>
          <TabsContent value="bookings" className="mt-6">
            <BookingsTab focusDate={focusDate} />
          </TabsContent>
          <TabsContent value="services" className="mt-6">
            <ServicesTab />
          </TabsContent>
          <TabsContent value="barbers" className="mt-6">
            <BarbersTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

function AdminTrigger({ value, icon, label }: { value: string; icon: React.ReactNode; label: string }) {
  return (
    <TabsTrigger
      value={value}
      className="gap-2 rounded-md px-3 py-2 text-sm text-[#A89A87] data-[state=active]:bg-[#C9973B] data-[state=active]:text-[#171310] data-[state=active]:font-semibold"
    >
      {icon}
      {label}
    </TabsTrigger>
  )
}

// ─────────────────────────── ТАЙЛАН ───────────────────────────

function ReportTab() {
  const bookingsApi = useApi<Booking>('barber-bookings')
  const servicesApi = useApi<Service>('barber-services')

  const today = todayStr()

  const stats = useMemo(() => {
    const bookings = bookingsApi.data
    const todayCount = bookings.filter((b) => b.date === today).length
    const pending = bookings.filter((b) => b.status === 'хүлээгдэж буй').length
    const noShow = bookings.filter((b) => b.status !== 'цуцлагдсан' && b.meta?.noShow).length
    const revenue = bookings
      .filter((b) => b.paymentStatus === 'төлөгдсөн')
      .reduce((sum, b) => sum + (b.totalAmount || 0), 0)
    const serviceCount = servicesApi.data.filter((s) => s.active).length
    return { todayCount, pending, noShow, revenue, serviceCount }
  }, [bookingsApi.data, servicesApi.data, today])

  const upcoming = useMemo(
    () =>
      bookingsApi.data
        .filter((b) => b.date >= today && b.status !== 'цуцлагдсан')
        .sort((a, b) => ((a.date + a.time) < (b.date + b.time) ? -1 : 1))
        .slice(0, 5),
    [bookingsApi.data, today]
  )

  /** Энэ долоо хоногийн залаач тус бүрийн захиалгатай цаг + ирээгүйн тоо (цуцлагдсангүй, үйлчилгээний хугацаагаар) */
  const workload = useMemo(() => {
    const start = mondayOf(today)
    const end = addDaysStr(start, 6)
    const svcMin = new Map(servicesApi.data.map((s) => [s.id, s.durationMin]))
    const perBarber = new Map<string, { name: string; minutes: number; count: number; noShow: number }>()
    for (const b of bookingsApi.data) {
      if (b.status === 'цуцлагдсан') continue
      if (b.date < start || b.date > end) continue
      const key = b.barberId || b.barberName
      const entry = perBarber.get(key) ?? { name: b.barberName, minutes: 0, count: 0, noShow: 0 }
      entry.minutes += svcMin.get(b.serviceId ?? '') ?? 60
      entry.count += 1
      if (b.meta?.noShow) entry.noShow += 1
      perBarber.set(key, entry)
    }
    const list = [...perBarber.values()].sort((a, b) => b.minutes - a.minutes)
    return { list, max: list[0]?.minutes ?? 0, start }
  }, [bookingsApi.data, servicesApi.data, today])

  if (bookingsApi.loading || servicesApi.loading) return <LoadingState label="Тайланг ачаалж байна…" />

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCard icon={<CalendarDays className="h-5 w-5" />} label="Өнөөдрийн захиалга" value={String(stats.todayCount)} />
        <StatCard icon={<BadgeCheck className="h-5 w-5" />} label="Хүлээгдэж буй" value={String(stats.pending)} />
        <StatCard icon={<Coins className="h-5 w-5" />} label="Нийт орлого (төлөгдсөн)" value={fmtMNT(stats.revenue)} />
        <StatCard icon={<Scissors className="h-5 w-5" />} label="Идэвхтэй үйлчилгээ" value={String(stats.serviceCount)} />
        <StatCard
          icon={<UserX className="h-5 w-5" />}
          label="Ирээгүй (no-show)"
          value={String(stats.noShow)}
        />
      </div>

      {/* Долоо хоногийн ачаалал — залаач бүрийн захиалгатай цаг */}
      <section className="rounded-xl border border-[#C9973B33] bg-[#221B15] p-5 sm:p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="flex items-center gap-2 text-xl" style={serifStyle}>
            <Clock3 className="h-4.5 w-4.5 text-[#C9973B]" aria-hidden="true" />
            Энэ долоо хоногийн ачаалал
          </h2>
          <p className="text-[11px] text-[#A89A87]">
            {fmtDayLabel(workload.start)} — хойш 7 хоног · үйлчилгээний хугацаагаар
          </p>
        </div>
        <div className="mt-4 space-y-3">
          {workload.list.length === 0 ? (
            <EmptyState title="Энэ долоо хоногт захиалга байхгүй" description="Шинэ захиалга орж ирэхэд ачааллын график үүснэ." />
          ) : (
            workload.list.map((w) => (
              <div key={w.name}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 text-sm">
                  <p className="font-medium text-[#F3EBDD]">
                    {w.name}
                    {w.noShow > 0 && (
                      <span
                        className="ml-2 inline-flex items-center gap-1 rounded-full border border-[#D9776B66] bg-[#D9776B14] px-2 py-px text-[10px] font-semibold text-[#D9776B]"
                        title="Энэ долоо хоногт ирээгүй захиалга"
                      >
                        <UserX className="h-3 w-3" aria-hidden="true" />
                        {w.noShow} ирээгүй
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-[#A89A87]">
                    <span className="font-semibold text-[#C9973B]">{fmtHours(w.minutes)}</span> · {w.count} захиалга
                  </p>
                </div>
                <div
                  className="mt-1.5 h-2 overflow-hidden rounded-full bg-[#C9973B14]"
                  role="img"
                  aria-label={`${w.name}: ${fmtHours(w.minutes)}, ${w.count} захиалга`}
                >
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#8A6A2F] to-[#C9973B] transition-[width] duration-700 ease-out"
                    style={{ width: `${Math.max((w.minutes / (workload.max || 1)) * 100, 4)}%` }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="rounded-xl border border-[#C9973B33] bg-[#221B15] p-5 sm:p-6">
        <h2 className="text-xl" style={serifStyle}>
          Ирэх захиалгууд
        </h2>
        <p className="mt-1 text-xs text-[#A89A87]">Хамгийн ойрын 5 захиалга (цуцлагдсангүй).</p>
        <div className="mt-4">
          {upcoming.length === 0 ? (
            <EmptyState title="Ирэх захиалга байхгүй" description="Шинэ захиалга ирэхэд энд харагдана." />
          ) : (
            <ul className="divide-y divide-[#C9973B26]">
              {upcoming.map((b) => (
                <li key={b.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
                  <div className="min-w-0">
                    <p className="font-medium">
                      {b.customerName}
                      <span className="ml-2 text-[#A89A87]">· {b.phone}</span>
                    </p>
                    <p className="mt-0.5 text-xs text-[#A89A87]">
                      {b.serviceName} — {b.barberName}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[#CDBFA9]">
                      {fmtDayLabel(b.date)} · {b.time}
                    </span>
                    <StatusBadge status={b.status} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
      <DemoDataNote />
    </div>
  )
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[#C9973B33] bg-[#221B15] p-4 transition-colors hover:border-[#C9973B55] sm:p-5">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#C9973B14] text-[#C9973B]">
        {icon}
      </div>
      <p className="mt-3 text-[11px] uppercase tracking-wider text-[#A89A87]">{label}</p>
      <p className="mt-1 truncate text-xl font-semibold sm:text-2xl" style={serifStyle}>
        {value}
      </p>
    </div>
  )
}

/** Минут → «6 цаг 30 мин» эсвэл «45 мин» */
function fmtHours(totalMin: number): string {
  if (totalMin < 60) return `${totalMin} мин`
  const h = Math.floor(totalMin / 60)
  const m = totalMin % 60
  return m === 0 ? `${h} цаг` : `${h} цаг ${m} мин`
}

// ─────────────────────────── ХУВААРЬ (долоо хоногийн) ───────────────────────────

const SCHEDULE_STATUS_COLOR: Record<string, string> = {
  'хүлээгдэж буй': '#E0B457',
  'баталгаажсан': '#7FB069',
  'дууссан': '#8A7B68',
  'цуцлагдсан': '#D9776B',
}

/** Даваа гарагаас эхэлсэн долоо хоногийн эхлэх огноо (YYYY-MM-DD) */
function mondayOf(base: string): string {
  const [y, m, d] = base.split('-').map(Number)
  const dt = new Date(y, m - 1, d)
  const shift = (dt.getDay() + 6) % 7 // Ням=0 → 6, Дав=1 → 0
  return addDaysStr(base, -shift)
}

function ScheduleTab({ onPickDate }: { onPickDate?: (date: string) => void }) {
  const bookingsApi = useApi<Booking>('barber-bookings')
  const barbersApi = useApi<Barber>('barbers')
  const [weekOffset, setWeekOffset] = useState(0)
  const [barberId, setBarberId] = useState('бүгд')

  const today = todayStr()
  const weekStart = mondayOf(today)
  const days = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDaysStr(weekStart, i + weekOffset * 7)),
    [weekStart, weekOffset]
  )

  const byDay = useMemo(() => {
    const map = new Map<string, Booking[]>()
    for (const d of days) map.set(d, [])
    for (const b of bookingsApi.data) {
      if (barberId !== 'бүгд' && b.barberId !== barberId) continue
      const list = map.get(b.date)
      if (list) list.push(b)
    }
    for (const list of map.values()) list.sort((a, b) => (a.time < b.time ? -1 : 1))
    return map
  }, [bookingsApi.data, days, barberId])

  const weekTotal = useMemo(
    () => [...byDay.values()].reduce((sum, list) => sum + list.length, 0),
    [byDay]
  )

  const weekLabel = useMemo(() => {
    const first = days[0]
    const last = days[6]
    return `${fmtDayLabel(first)} — ${fmtDayLabel(last)}`
  }, [days])

  if (bookingsApi.loading || barbersApi.loading) return <LoadingState label="Хуваарийг ачаалж байна…" />

  const activeBarbers = barbersApi.data.filter((b) => b.active)

  return (
    <div className="space-y-4">
      {/* Долоо хоног сонгогч + залаач шүүлтүүр */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className={cn('h-9 w-9', btnOutline)}
            onClick={() => setWeekOffset((w) => w - 1)}
            aria-label="Өмнөх долоо хоног"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="min-w-[220px] text-center">
            <p className="text-sm font-medium text-[#F3EBDD]">{weekLabel}</p>
            <p className="text-[11px] text-[#A89A87]">Нийт {weekTotal} захиалга</p>
          </div>
          <Button
            variant="outline"
            size="icon"
            className={cn('h-9 w-9', btnOutline)}
            onClick={() => setWeekOffset((w) => w + 1)}
            aria-label="Дараах долоо хоног"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          {weekOffset !== 0 && (
            <Button variant="ghost" size="sm" className="text-xs text-[#C9973B] hover:text-[#D8A84F]" onClick={() => setWeekOffset(0)}>
              Энэ долоо хоног
            </Button>
          )}
        </div>
        <Select value={barberId} onValueChange={setBarberId}>
          <SelectTrigger className={cn(inputCls, 'w-full lg:w-[210px]')} aria-label="Залаачаар шүүх">
            <SelectValue placeholder="Залаач" />
          </SelectTrigger>
          <SelectContent className="border-[#C9973B33] bg-[#221B15] text-[#F3EBDD]">
            <SelectItem value="бүгд">Бүх залаач</SelectItem>
            {activeBarbers.map((b) => (
              <SelectItem key={b.id} value={b.id}>
                {b.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 7 хоногийн хүснэгт */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-7">
        {days.map((d) => {
          const list = byDay.get(d) ?? []
          const [y, m, dd] = d.split('-').map(Number)
          const wd = new Date(y, m - 1, dd).getDay()
          const isToday = d === today
          const WD_FULL = ['Ням', 'Дав', 'Мяг', 'Лха', 'Пүр', 'Баа', 'Бям']
          const clickable = !!onPickDate && list.length > 0
          return (
            <section
              key={d}
              aria-label={`${fmtDayLabel(d)} — ${list.length} захиалга${clickable ? ' — дарж захиалгыг харна' : ''}`}
              role={clickable ? 'button' : undefined}
              tabIndex={clickable ? 0 : undefined}
              onClick={clickable ? () => onPickDate?.(d) : undefined}
              onKeyDown={clickable ? (e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onPickDate?.(d)) : undefined}
              className={cn(
                'flex min-h-[180px] flex-col rounded-xl border bg-[#221B15] p-3 transition-colors',
                isToday ? 'border-[#C9973B] shadow-[0_0_0_1px_#C9973B55]' : 'border-[#C9973B26]',
                clickable && 'cursor-pointer hover:border-[#C9973B88] hover:bg-[#2A211A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9973B66]'
              )}
            >
              <header className="mb-2 flex items-center justify-between gap-1">
                <div>
                  <p className={cn('text-xs font-semibold uppercase tracking-wider', isToday ? 'text-[#C9973B]' : 'text-[#A89A87]')}>
                    {WD_FULL[wd]}
                  </p>
                  <p className="text-sm font-medium text-[#F3EBDD]">{dd}·{String(m).padStart(2, '0')}</p>
                </div>
                <span
                  className={cn(
                    'rounded-full px-1.5 py-0.5 text-[10px] font-bold',
                    list.length === 0 ? 'bg-[#C9973B0D] text-[#6E6152]' : 'bg-[#C9973B] text-[#171310]'
                  )}
                >
                  {list.length}
                </span>
              </header>
              <div className="flex-1 space-y-1.5">
                {list.length === 0 ? (
                  <p className="pt-3 text-center text-[11px] text-[#6E6152]">Хоосон</p>
                ) : (
                  list.slice(0, 4).map((b) => {
                    const color = SCHEDULE_STATUS_COLOR[b.status] ?? '#A89A87'
                    const cancelled = b.status === 'цуцлагдсан'
                    return (
                      <div
                        key={b.id}
                        title={`${b.time} · ${b.customerName} · ${b.serviceName} · ${b.barberName} · ${b.status}`}
                        className={cn(
                          'rounded-md border border-[#C9973B1A] bg-[#1D1712] px-2 py-1.5 text-[11px] leading-tight',
                          cancelled && 'opacity-50'
                        )}
                      >
                        <p className={cn('flex items-center gap-1 font-semibold text-[#F3EBDD]', cancelled && 'line-through')}>
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: color }} aria-hidden />
                          {b.time}
                        </p>
                        <p className="mt-0.5 truncate text-[#CDBFA9]">{b.customerName}</p>
                      </div>
                    )
                  })
                )}
                {list.length > 4 && (
                  <p className="pt-1 text-center text-[10px] font-medium text-[#C9973B]">+{list.length - 4} нэмэлт</p>
                )}
              </div>
            </section>
          )
        })}
      </div>

      {/* Тэмдэглэгээ */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 rounded-xl border border-[#C9973B26] bg-[#1D1712] px-4 py-3">
        {Object.entries(SCHEDULE_STATUS_COLOR).map(([status, color]) => (
          <span key={status} className="inline-flex items-center gap-1.5 text-[11px] text-[#A89A87]">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} aria-hidden />
            {status}
          </span>
        ))}
      </div>

      <DemoDataNote />
    </div>
  )
}

// ─────────────────────────── ЗАХИАЛГА ───────────────────────────

function BookingsTab({ focusDate }: { focusDate?: string | null }) {
  const bookingsApi = useApi<Booking>('barber-bookings')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('бүгд')
  const [dateFilter, setDateFilter] = useState<string | null>(focusDate ?? null)
  const [deleteTarget, setDeleteTarget] = useState<Booking | null>(null)
  const [detailTarget, setDetailTarget] = useState<Booking | null>(null)

  // Хуваариас шилжих үед шинэ огноогоор шүүнэ (render дотор төлөв тохируулах хэв маяг)
  const [prevFocus, setPrevFocus] = useState<string | null | undefined>(focusDate)
  if (focusDate !== prevFocus) {
    setPrevFocus(focusDate)
    if (focusDate) setDateFilter(focusDate)
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return bookingsApi.data.filter((b) => {
      const matchQ =
        !q || b.customerName.toLowerCase().includes(q) || b.phone.toLowerCase().includes(q)
      const matchStatus = statusFilter === 'бүгд' || b.status === statusFilter
      const matchDate = !dateFilter || b.date === dateFilter
      return matchQ && matchStatus && matchDate
    })
  }, [bookingsApi.data, search, statusFilter, dateFilter])

  const changeStatus = async (b: Booking, status: string) => {
    if (status === b.status) return
    try {
      await bookingsApi.update(b.id, { status })
      toast.success(`Төлөв «${status}» болгогдлоо`)
    } catch {
      toast.error('Төлөв өөрчлөхөд алдаа гарлаа')
    }
  }

  /** Ирээгүй (no-show) тэмдэглэгээ солих — цуцлагдсан захиалгад хамаарахгүй */
  const toggleNoShow = async (b: Booking) => {
    if (b.status === 'цуцлагдсан') return
    const next = !b.meta?.noShow
    try {
      await bookingsApi.update(b.id, { meta: { ...(b.meta ?? {}), noShow: next } })
      toast.success(next ? `${b.customerName} — «Ирээгүй» гэж тэмдэглэлээ` : `${b.customerName} — ирээгүйн тэмдэглэгээ ариллаа`)
    } catch {
      toast.error('Тэмдэглэгээ хадгалахад алдаа гарлаа')
    }
  }

  const removeBooking = async () => {
    if (!deleteTarget) return
    try {
      await bookingsApi.remove(deleteTarget.id)
      toast.success('Захиалгыг устгалаа')
      setDeleteTarget(null)
    } catch {
      toast.error('Устгахад алдаа гарлаа')
    }
  }

  return (
    <div className="space-y-4">
      {/* Шүүлтүүр */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6E6152]" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Нэр эсвэл утасны дугаараар хайх…"
            className={cn(inputCls, 'pl-9')}
            aria-label="Захиалга хайх"
          />
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="relative">
            <span className="sr-only">Огноогоор шүүх</span>
            <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6E6152]" />
            <input
              type="date"
              value={dateFilter ?? ''}
              onChange={(e) => setDateFilter(e.target.value || null)}
              aria-label="Огноогоор шүүх"
              className={cn(inputCls, 'h-9 pl-9 pr-3 text-xs [color-scheme:dark]')}
            />
          </label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className={cn(inputCls, 'w-full sm:w-[190px]')} aria-label="Төлөвөөр шүүх">
              <SelectValue placeholder="Төлөв" />
            </SelectTrigger>
            <SelectContent className="border-[#C9973B33] bg-[#221B15] text-[#F3EBDD]">
              <SelectItem value="бүгд">Бүх төлөв</SelectItem>
              {BOOKING_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {dateFilter && (
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#C9973B66] bg-[#C9973B14] px-3 py-1 text-xs text-[#C9973B]">
            <CalendarDays className="h-3.5 w-3.5" aria-hidden />
            Огноо: {dateFilter}
            <button
              type="button"
              onClick={() => setDateFilter(null)}
              aria-label="Огнооны шүүлтүүрийг цэвэрлэх"
              className="ml-0.5 rounded-full p-0.5 transition-colors hover:bg-[#C9973B33]"
            >
              <X className="h-3 w-3" aria-hidden />
            </button>
          </span>
          <span className="text-xs text-[#A89A87]">{filtered.length} илэрц</span>
        </div>
      )}

      {bookingsApi.loading ? (
        <LoadingState label="Захиалгуудыг ачаалж байна…" />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="Захиалга олдсонгүй"
          description={search || statusFilter !== 'бүгд' ? 'Шүүлтүүрээ өөрчилж дахин хайна уу.' : 'Одоогоор захиалга бүртгэгдээгүй байна.'}
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[#C9973B33] bg-[#221B15]">
          <Table>
            <TableHeader>
              <TableRow className="border-[#C9973B26] hover:bg-transparent">
                <TableHead className="text-[#A89A87]">Хэрэглэгч</TableHead>
                <TableHead className="text-[#A89A87]">Утас</TableHead>
                <TableHead className="text-[#A89A87]">Үйлчилгээ</TableHead>
                <TableHead className="text-[#A89A87]">Залаач</TableHead>
                <TableHead className="text-[#A89A87]">Огноо / цаг</TableHead>
                <TableHead className="text-right text-[#A89A87]">Дүн</TableHead>
                <TableHead className="text-[#A89A87]">Төлөв</TableHead>
                <TableHead className="text-[#A89A87]">Төлбөр</TableHead>
                <TableHead className="text-right text-[#A89A87]">Үйлдэл</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((b) => (
                <TableRow key={b.id} className="border-[#C9973B26]">
                  <TableCell>
                    <button
                      type="button"
                      onClick={() => setDetailTarget(b)}
                      className="text-left font-medium underline-offset-4 transition-colors hover:text-[#C9973B] hover:underline"
                      aria-label={`${b.customerName}-н захиалгын дэлгэрэнгүйг харах`}
                    >
                      {b.customerName}
                    </button>
                  </TableCell>
                  <TableCell>{b.phone}</TableCell>
                  <TableCell>{b.serviceName}</TableCell>
                  <TableCell>{b.barberName}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    {b.date} · {b.time}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-right font-medium text-[#C9973B]">
                    {fmtMNT(b.totalAmount)}
                  </TableCell>
                  <TableCell>
                    <Select value={b.status} onValueChange={(v) => changeStatus(b, v)}>
                      <SelectTrigger
                        className="h-8 w-[150px] border-[#C9973B33] bg-[#1D1712] text-xs"
                        aria-label={`${b.customerName}-н төлөв өөрчлөх`}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="border-[#C9973B33] bg-[#221B15] text-[#F3EBDD]">
                        {BOOKING_STATUSES.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {b.meta?.noShow && b.status !== 'цуцлагдсан' && (
                      <span
                        className="mt-1 inline-flex items-center gap-1 rounded-full border border-[#D9776B66] bg-[#D9776B14] px-2 py-0.5 text-[10px] font-semibold text-[#D9776B]"
                        role="status"
                      >
                        <UserX className="h-3 w-3" aria-hidden />
                        Ирээгүй
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={b.paymentStatus} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-[#CDBFA9] hover:bg-[#C9973B14] hover:text-[#C9973B]"
                        onClick={() => setDetailTarget(b)}
                        aria-label={`${b.customerName}-н захиалгын дэлгэрэнгүй`}
                        title="Дэлгэрэнгүй харах"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {b.status !== 'цуцлагдсан' && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className={cn(
                            'h-8 w-8',
                            b.meta?.noShow
                              ? 'text-[#D9776B] hover:bg-[#D9776B14] hover:text-[#D9776B]'
                              : 'text-[#A89A87] hover:bg-[#C9973B14] hover:text-[#C9973B]'
                          )}
                          onClick={() => toggleNoShow(b)}
                          aria-pressed={!!b.meta?.noShow}
                          aria-label={
                            b.meta?.noShow
                              ? `${b.customerName} — ирээгүйн тэмдэглэгээг арилгах`
                              : `${b.customerName} — ирээгүй гэж тэмдэглэх`
                          }
                          title={b.meta?.noShow ? 'Ирээгүй тэмдэглэгээг арилгах' : 'Ирээгүй гэж тэмдэглэх'}
                        >
                          <UserX className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-[#E08B6D] hover:bg-[#C96A3B14] hover:text-[#E08B6D]"
                        onClick={() => setDeleteTarget(b)}
                        aria-label={`${b.customerName}-н захиалгыг устгах`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <DemoDataNote />

      {/* Дэлгэрэнгүй диалог */}
      <Dialog open={!!detailTarget} onOpenChange={(o) => !o && setDetailTarget(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto border-[#C9973B33] bg-[#221B15] text-[#F3EBDD] sm:max-w-md">
          {detailTarget && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl" style={serifStyle}>
                  Захиалгын дэлгэрэнгүй
                </DialogTitle>
                <DialogDescription className="text-sm text-[#A89A87]">
                  {detailTarget.customerName} · {detailTarget.date} · {detailTarget.time}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3">
                {/* Үйлчилгээ / залаач */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-[#C9973B33] bg-[#1D1712] p-3">
                    <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#A89A87]">
                      <Scissors className="h-3 w-3" aria-hidden />
                      Үйлчилгээ
                    </p>
                    <p className="mt-1 text-sm font-medium">{detailTarget.serviceName}</p>
                  </div>
                  <div className="rounded-lg border border-[#C9973B33] bg-[#1D1712] p-3">
                    <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#A89A87]">
                      <Users className="h-3 w-3" aria-hidden />
                      Залаач
                    </p>
                    <p className="mt-1 text-sm font-medium">{detailTarget.barberName}</p>
                  </div>
                </div>

                {/* Холбоо барих */}
                <div className="space-y-2 rounded-lg border border-[#C9973B33] bg-[#1D1712] p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#A89A87]">Хэрэглэгч</p>
                  <p className="flex items-center gap-2 text-sm">
                    <Phone className="h-3.5 w-3.5 shrink-0 text-[#C9973B]" aria-hidden />
                    <a
                      href={`tel:${detailTarget.phone}`}
                      className="transition-colors hover:text-[#C9973B]"
                    >
                      {detailTarget.phone}
                    </a>
                  </p>
                  <p className="flex items-center gap-2 text-sm">
                    <Mail className="h-3.5 w-3.5 shrink-0 text-[#C9973B]" aria-hidden />
                    {detailTarget.email ? (
                      <span className="break-all">{detailTarget.email}</span>
                    ) : (
                      <span className="text-[#A89A87]">—</span>
                    )}
                  </p>
                </div>

                {/* Төлөв, төлбөр, дүн */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-lg border border-[#C9973B33] bg-[#1D1712] p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#A89A87]">Төлөв</p>
                    <p className="mt-1.5">
                      <StatusBadge status={detailTarget.status} />
                    </p>
                  </div>
                  <div className="rounded-lg border border-[#C9973B33] bg-[#1D1712] p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#A89A87]">Төлбөр</p>
                    <p className="mt-1.5">
                      <StatusBadge status={detailTarget.paymentStatus} />
                    </p>
                  </div>
                  <div className="rounded-lg border border-[#C9973B33] bg-[#1D1712] p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#A89A87]">Дүн</p>
                    <p className="mt-1.5 whitespace-nowrap text-sm font-semibold text-[#C9973B]">
                      {fmtMNT(detailTarget.totalAmount)}
                    </p>
                  </div>
                </div>

                {/* Тэмдэглэл */}
                {detailTarget.notes ? (
                  <div className="rounded-lg border border-[#C9973B33] bg-[#1D1712] p-3">
                    <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#A89A87]">
                      <StickyNote className="h-3 w-3" aria-hidden />
                      Тэмдэглэл
                    </p>
                    <p className="mt-1 whitespace-pre-wrap text-sm text-[#F3EBDD]/90">{detailTarget.notes}</p>
                  </div>
                ) : null}

                {/* Ирээгүй тэмдэглэгээ */}
                {detailTarget.meta?.noShow && detailTarget.status !== 'цуцлагдсан' && (
                  <p
                    className="flex items-center gap-2 rounded-lg border border-[#D9776B66] bg-[#D9776B14] px-3 py-2 text-xs font-medium text-[#D9776B]"
                    role="status"
                  >
                    <UserX className="h-4 w-4 shrink-0" aria-hidden />
                    Энэ захиалга «Ирээгүй» гэж тэмдэглэгдсэн байна.
                  </p>
                )}

                <div className="flex items-center justify-between gap-2 pt-1">
                  {detailTarget.status !== 'цуцлагдсан' ? (
                    <Button
                      variant="outline"
                      className={btnOutline}
                      onClick={() => {
                        toggleNoShow(detailTarget)
                        setDetailTarget(null)
                      }}
                    >
                      <UserX className="h-4 w-4" />
                      {detailTarget.meta?.noShow ? 'Ирээгүйг арилгах' : 'Ирээгүй тэмдэглэх'}
                    </Button>
                  ) : (
                    <span />
                  )}
                  <Button
                    onClick={() => setDetailTarget(null)}
                    className="bg-[#C9973B] font-semibold text-[#171310] hover:bg-[#D8A84F] hover:text-[#171310]"
                  >
                    Хаах
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDelete
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        onConfirm={removeBooking}
        title="Захиалгыг устгах уу?"
        description={
          deleteTarget
            ? `${deleteTarget.customerName} — ${deleteTarget.serviceName}, ${deleteTarget.date} ${deleteTarget.time}. Энэ үйлдлийг буцаах боломжгүй.`
            : ''
        }
      />
    </div>
  )
}

// ─────────────────────────── ҮЙЛЧИЛГЭЭ ───────────────────────────

type ServiceForm = { name: string; category: string; price: string; durationMin: string; description: string; active: boolean }
const EMPTY_SERVICE: ServiceForm = { name: '', category: '', price: '', durationMin: '', description: '', active: true }

function ServicesTab() {
  const servicesApi = useApi<Service>('barber-services')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState<ServiceForm>(EMPTY_SERVICE)
  const [errors, setErrors] = useState<Partial<Record<keyof ServiceForm, string>>>({})
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null)
  const [saving, setSaving] = useState(false)

  const openCreate = () => {
    setEditId(null)
    setForm(EMPTY_SERVICE)
    setErrors({})
    setDialogOpen(true)
  }
  const openEdit = (s: Service) => {
    setEditId(s.id)
    setForm({ name: s.name, category: s.category, price: String(s.price), durationMin: String(s.durationMin), description: s.description, active: s.active })
    setErrors({})
    setDialogOpen(true)
  }

  const validate = (): boolean => {
    const e: Partial<Record<keyof ServiceForm, string>> = {}
    if (form.name.trim().length < 2) e.name = 'Үйлчилгээний нэрээ оруулна уу'
    if (!CATEGORIES.includes(form.category as (typeof CATEGORIES)[number])) e.category = 'Ангиллаа сонгоно уу'
    if (!(Number(form.price) > 0)) e.price = 'Үнийг зөв оруулна уу (0-аас их тоо)'
    if (!(Number(form.durationMin) > 0)) e.durationMin = 'Хугацааг минутаар оруулна уу'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const save = async () => {
    if (!validate()) return
    try {
      setSaving(true)
      const payload = {
        name: form.name.trim(),
        category: form.category,
        price: Number(form.price),
        durationMin: Number(form.durationMin),
        description: form.description.trim(),
        active: form.active,
      }
      if (editId) {
        await servicesApi.update(editId, payload)
        toast.success('Үйлчилгээ шинэчлэгдлээ')
      } else {
        await servicesApi.create(payload)
        toast.success('Шинэ үйлчилгээ нэмэгдлээ')
      }
      setDialogOpen(false)
    } catch {
      toast.error('Хадгалахад алдаа гарлаа. Талбаруудыг шалгана уу')
    } finally {
      setSaving(false)
    }
  }

  const remove = async () => {
    if (!deleteTarget) return
    try {
      await servicesApi.remove(deleteTarget.id)
      toast.success('Үйлчилгээг устгалаа')
      setDeleteTarget(null)
    } catch {
      toast.error('Устгахад алдаа гарлаа')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#A89A87]">Нийт {servicesApi.data.length} үйлчилгээ</p>
        <Button onClick={openCreate} className={cn('bg-[#C9973B] font-semibold text-[#171310] hover:bg-[#D8A84F] hover:text-[#171310]')}>
          <Plus className="h-4 w-4" />
          Шинэ үйлчилгээ
        </Button>
      </div>

      {servicesApi.loading ? (
        <LoadingState label="Үйлчилгээүүдийг ачаалж байна…" />
      ) : servicesApi.data.length === 0 ? (
        <EmptyState title="Үйлчилгээ бүртгэгдээгүй" description="«Шинэ үйлчилгээ» товч дараад нэмээрэй." />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[#C9973B33] bg-[#221B15]">
          <Table>
            <TableHeader>
              <TableRow className="border-[#C9973B26] hover:bg-transparent">
                <TableHead className="text-[#A89A87]">Нэр</TableHead>
                <TableHead className="text-[#A89A87]">Ангилал</TableHead>
                <TableHead className="text-right text-[#A89A87]">Үнэ</TableHead>
                <TableHead className="text-right text-[#A89A87]">Хугацаа</TableHead>
                <TableHead className="text-[#A89A87]">Төлөв</TableHead>
                <TableHead className="text-right text-[#A89A87]">Үйлдэл</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {servicesApi.data.map((s) => (
                <TableRow key={s.id} className="border-[#C9973B26]">
                  <TableCell>
                    <p className="font-medium">{s.name}</p>
                    <p className="mt-0.5 line-clamp-1 max-w-[260px] text-xs text-[#A89A87]">{s.description}</p>
                  </TableCell>
                  <TableCell>{catLabel(s.category)}</TableCell>
                  <TableCell className="whitespace-nowrap text-right font-medium text-[#C9973B]">{fmtMNT(s.price)}</TableCell>
                  <TableCell className="whitespace-nowrap text-right">{s.durationMin} мин</TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        'inline-flex items-center whitespace-nowrap rounded-full border px-2 py-0.5 text-xs font-medium',
                        s.active
                          ? 'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-400'
                          : 'border-gray-200 bg-gray-100 text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400'
                      )}
                    >
                      {s.active ? 'Идэвхтэй' : 'Идэвхгүй'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-[#CDBFA9] hover:bg-[#C9973B14] hover:text-[#C9973B]"
                        onClick={() => openEdit(s)}
                        aria-label={`${s.name} засварлах`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-[#E08B6D] hover:bg-[#C96A3B14] hover:text-[#E08B6D]"
                        onClick={() => setDeleteTarget(s)}
                        aria-label={`${s.name} устгах`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <DemoDataNote />

      {/* Үүсгэх/засах диалог */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto border-[#C9973B33] bg-[#221B15] text-[#F3EBDD] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl" style={serifStyle}>
              {editId ? 'Үйлчилгээ засах' : 'Шинэ үйлчилгээ'}
            </DialogTitle>
            <DialogDescription className="text-sm text-[#A89A87]">
              Үйлчилгээний мэдээллийг бөглөнө үү. Тэмдэглэсэн (*) талбарууд заавал бөглөнө.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="sv-name">Нэр *</Label>
              <Input
                id="sv-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Жишээ: Классик засал"
                className={inputCls}
                aria-invalid={!!errors.name}
              />
              {errors.name && <p role="alert" className="text-xs text-red-400">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="sv-cat">Ангилал *</Label>
                <Select
                  value={form.category || undefined}
                  onValueChange={(v) => setForm({ ...form, category: v })}
                >
                  <SelectTrigger id="sv-cat" className={inputCls} aria-invalid={!!errors.category}>
                    <SelectValue placeholder="Сонгох" />
                  </SelectTrigger>
                  <SelectContent className="border-[#C9973B33] bg-[#221B15] text-[#F3EBDD]">
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {catLabel(c)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && <p role="alert" className="text-xs text-red-400">{errors.category}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="sv-dur">Хугацаа (мин) *</Label>
                <Input
                  id="sv-dur"
                  type="number"
                  min={5}
                  step={5}
                  value={form.durationMin}
                  onChange={(e) => setForm({ ...form, durationMin: e.target.value })}
                  placeholder="30"
                  className={inputCls}
                  aria-invalid={!!errors.durationMin}
                />
                {errors.durationMin && <p role="alert" className="text-xs text-red-400">{errors.durationMin}</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="sv-price">Үнэ (төглөг) *</Label>
              <Input
                id="sv-price"
                type="number"
                min={1000}
                step={500}
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="25000"
                className={inputCls}
                aria-invalid={!!errors.price}
              />
              {errors.price && <p role="alert" className="text-xs text-red-400">{errors.price}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="sv-desc">Тайлбар</Label>
              <Textarea
                id="sv-desc"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Үйлчилгээнд юу багтдаг талаар товч бичнэ үү"
                rows={3}
                className={cn(inputCls, 'resize-none')}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-[#C9973B33] bg-[#1D1712] px-4 py-3">
              <Label htmlFor="sv-active" className="text-sm">
                Идэвхтэй (захиалгад харагдана)
              </Label>
              <Switch
                id="sv-active"
                checked={form.active}
                onCheckedChange={(v) => setForm({ ...form, active: v })}
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <Button variant="outline" className={btnOutline} onClick={() => setDialogOpen(false)}>
                Болих
              </Button>
              <Button
                onClick={save}
                disabled={saving}
                className="bg-[#C9973B] font-semibold text-[#171310] hover:bg-[#D8A84F] hover:text-[#171310]"
              >
                {saving ? 'Хадгалж байна…' : 'Хадгалах'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDelete
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        onConfirm={remove}
        title="Үйлчилгээг устгах уу?"
        description={deleteTarget ? `«${deleteTarget.name}» — энэ үйлдлийг буцаах боломжгүй.` : ''}
      />
    </div>
  )
}

// ─────────────────────────── ЗАЛААЧИД ───────────────────────────

type BarberForm = { name: string; title: string; bio: string; specialties: string; imageUrl: string; active: boolean }
const EMPTY_BARBER: BarberForm = { name: '', title: '', bio: '', specialties: '', imageUrl: '', active: true }

function BarbersTab() {
  const barbersApi = useApi<Barber>('barbers')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState<BarberForm>(EMPTY_BARBER)
  const [errors, setErrors] = useState<Partial<Record<keyof BarberForm, string>>>({})
  const [deleteTarget, setDeleteTarget] = useState<Barber | null>(null)
  const [saving, setSaving] = useState(false)

  const openCreate = () => {
    setEditId(null)
    setForm(EMPTY_BARBER)
    setErrors({})
    setDialogOpen(true)
  }
  const openEdit = (b: Barber) => {
    setEditId(b.id)
    setForm({ name: b.name, title: b.title, bio: b.bio, specialties: b.specialties, imageUrl: b.imageUrl ?? '', active: b.active })
    setErrors({})
    setDialogOpen(true)
  }

  const validate = (): boolean => {
    const e: Partial<Record<keyof BarberForm, string>> = {}
    if (form.name.trim().length < 2) e.name = 'Залаачийн нэрээ оруулна уу'
    if (!form.title.trim()) e.title = 'Албан тушаалаа оруулна уу'
    if (!form.bio.trim()) e.bio = 'Танилцуулга бичнэ үү'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const save = async () => {
    if (!validate()) return
    try {
      setSaving(true)
      const payload = {
        name: form.name.trim(),
        title: form.title.trim(),
        bio: form.bio.trim(),
        specialties: form.specialties
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
          .join(','),
        imageUrl: form.imageUrl.trim() || null,
        active: form.active,
      }
      if (editId) {
        await barbersApi.update(editId, payload)
        toast.success('Залаачийн мэдээлэл шинэчлэгдлээ')
      } else {
        await barbersApi.create(payload)
        toast.success('Шинэ залаач нэмэгдлээ')
      }
      setDialogOpen(false)
    } catch {
      toast.error('Хадгалахад алдаа гарлаа. Талбаруудыг шалгана уу')
    } finally {
      setSaving(false)
    }
  }

  const remove = async () => {
    if (!deleteTarget) return
    try {
      await barbersApi.remove(deleteTarget.id)
      toast.success('Залаачийг устгалаа')
      setDeleteTarget(null)
    } catch {
      toast.error('Устгахад алдаа гарлаа')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#A89A87]">Нийт {barbersApi.data.length} залаач</p>
        <Button onClick={openCreate} className="bg-[#C9973B] font-semibold text-[#171310] hover:bg-[#D8A84F] hover:text-[#171310]">
          <Plus className="h-4 w-4" />
          Шинэ залаач
        </Button>
      </div>

      {barbersApi.loading ? (
        <LoadingState label="Залаачдыг ачаалж байна…" />
      ) : barbersApi.data.length === 0 ? (
        <EmptyState title="Залаач бүртгэгдээгүй" description="«Шинэ залаач» товч дараад нэмээрэй." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {barbersApi.data.map((b) => (
            <article key={b.id} className="flex gap-4 rounded-xl border border-[#C9973B33] bg-[#221B15] p-4">
              <img
                src={b.imageUrl || BARBER_IMAGES[0]}
                alt={b.name}
                loading="lazy"
                className="h-24 w-20 shrink-0 rounded-md border border-[#C9973B33] object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="truncate text-lg" style={serifStyle}>
                      {b.name}
                    </h3>
                    <p className="truncate text-sm italic text-[#C9973B]">{b.title}</p>
                  </div>
                  <span
                    className={cn(
                      'shrink-0 rounded-full border px-2 py-0.5 text-[10px]',
                      b.active
                        ? 'border-green-800 bg-green-950 text-green-400'
                        : 'border-gray-700 bg-gray-800 text-gray-400'
                    )}
                  >
                    {b.active ? 'Идэвхтэй' : 'Идэвхгүй'}
                  </span>
                </div>
                <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-[#A89A87]">{b.bio}</p>
                <p className="mt-1.5 truncate text-[11px] text-[#6E6152]">{b.specialties}</p>
                <div className="mt-3 flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs text-[#CDBFA9] hover:bg-[#C9973B14] hover:text-[#C9973B]"
                    onClick={() => openEdit(b)}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Засах
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs text-[#E08B6D] hover:bg-[#C96A3B14] hover:text-[#E08B6D]"
                    onClick={() => setDeleteTarget(b)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Устгах
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <DemoDataNote />

      {/* Үүсгэх/засах диалог */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto border-[#C9973B33] bg-[#221B15] text-[#F3EBDD] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl" style={serifStyle}>
              {editId ? 'Залаач засах' : 'Шинэ залаач'}
            </DialogTitle>
            <DialogDescription className="text-sm text-[#A89A87]">
              Залаачийн профайлын мэдээллийг бөглөнө үү.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="bb-name">Нэр *</Label>
                <Input
                  id="bb-name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Жишээ: Батбаяр"
                  className={inputCls}
                  aria-invalid={!!errors.name}
                />
                {errors.name && <p role="alert" className="text-xs text-red-400">{errors.name}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="bb-title">Албан тушаал *</Label>
                <Input
                  id="bb-title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Жишээ: Ахлах залаач"
                  className={inputCls}
                  aria-invalid={!!errors.title}
                />
                {errors.title && <p role="alert" className="text-xs text-red-400">{errors.title}</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="bb-bio">Танилцуулга *</Label>
              <Textarea
                id="bb-bio"
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                placeholder="Туршлага, ур чадварын талаар товч бичнэ үү"
                rows={3}
                className={cn(inputCls, 'resize-none')}
                aria-invalid={!!errors.bio}
              />
              {errors.bio && <p role="alert" className="text-xs text-red-400">{errors.bio}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="bb-spec">Мэргэжлийн чадварууд (таслалаар тусгаарлана)</Label>
              <Input
                id="bb-spec"
                value={form.specialties}
                onChange={(e) => setForm({ ...form, specialties: e.target.value })}
                placeholder="Фейд, Сахлис, Арьс арчилгаа"
                className={inputCls}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="bb-img">Профайл зураг</Label>
              <Select value={form.imageUrl || undefined} onValueChange={(v) => setForm({ ...form, imageUrl: v })}>
                <SelectTrigger id="bb-img" className={inputCls}>
                  <SelectValue placeholder="Бэлэн зураг сонгох" />
                </SelectTrigger>
                <SelectContent className="border-[#C9973B33] bg-[#221B15] text-[#F3EBDD]">
                  {BARBER_IMAGES.map((u, i) => (
                    <SelectItem key={u} value={u}>
                      Зураг {i + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                placeholder="…эсвэл зургийн URL шууд оруулна уу"
                className={inputCls}
                aria-label="Зургийн URL"
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-[#C9973B33] bg-[#1D1712] px-4 py-3">
              <Label htmlFor="bb-active" className="text-sm">
                Идэвхтэй (сонголтод харагдана)
              </Label>
              <Switch
                id="bb-active"
                checked={form.active}
                onCheckedChange={(v) => setForm({ ...form, active: v })}
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <Button variant="outline" className={btnOutline} onClick={() => setDialogOpen(false)}>
                Болих
              </Button>
              <Button
                onClick={save}
                disabled={saving}
                className="bg-[#C9973B] font-semibold text-[#171310] hover:bg-[#D8A84F] hover:text-[#171310]"
              >
                {saving ? 'Хадгалж байна…' : 'Хадгалах'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDelete
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        onConfirm={remove}
        title="Залаачийг устгах уу?"
        description={deleteTarget ? `${deleteTarget.name} — энэ үйлдлийг буцаах боломжгүй.` : ''}
      />
    </div>
  )
}
