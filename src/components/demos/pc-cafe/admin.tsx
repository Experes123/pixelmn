'use client'

/**
 * ШОНХОР Gaming Café — Админ панель (Демо админ)
 * Tabs: Тайлан (статистик) · Захиалга (жагсаалт, төлөв өөрчлөх) · Суудал (CRUD)
 */

import { useMemo, useState } from 'react'
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Armchair,
  CalendarCheck,
  Banknote,
  Activity,
  ExternalLink,
  Flame,
  Gauge,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { toast } from 'sonner'
import { DemoLink } from '@/lib/hash-router'
import { useApi } from '@/lib/use-api'
import { DemoBadge } from '@/components/shared/demo-kit'
import { DemoAdminGate, DemoAdminLogoutButton, useDemoAdminAuth } from '@/components/shared/demo-gate'
import { StatusBadge, EmptyState, LoadingState, ConfirmDelete, DemoDataNote } from '@/components/shared/admin-kit'
import { cn } from '@/lib/utils'
import {
  NEON,
  TEXT,
  CLIP_SM,
  GRID_BG,
  ZONES,
  ClipCard,
  weekdayOf,
  todayStr,
  fmtN,
  BTN_PRIMARY,
  BTN_GHOST,
  INPUT_CLS,
  SELECT_TRIGGER_CLS,
  SELECT_CONTENT_CLS,
  type Station,
  type Booking,
} from './shared'

const BOOKING_STATUSES = ['идэвхтэй', 'дууссан', 'цуцлагдсан']
const STATION_STATUSES = ['боломжтой', 'эзлэгдсэн', 'засварт']

export function AdminPage() {
  const { authed, pass, logout } = useDemoAdminAuth('shonhor-admin-ok')
  if (!authed)
    return (
      <div className="dark min-h-screen">
        <DemoAdminGate title="ШОНХОР Админ" accent="#2CE080" dark onPass={pass} backHref="/demo/pc-cafe" />
      </div>
    )
  return <AdminInner onLogout={logout} />
}

function AdminInner({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState('report')
  return (
    <div className="relative flex flex-1 flex-col">
      <div className="pointer-events-none absolute inset-0" style={GRID_BG} aria-hidden />
      <div className="relative">
        {/* ─── Админ толгой ─── */}
        <header className="border-b border-[#2CE08026] bg-[#06150E]">
          <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 pl-4 pr-4">
            <span aria-hidden className="w-12 shrink-0 sm:w-[206px]" />
            <div className="mr-auto flex items-center gap-3">
              <svg width="26" height="26" viewBox="0 0 32 32" aria-hidden="true">
                <polygon points="1,1 31,1 31,21 21,31 1,31" fill="#0A1F16" stroke={NEON} strokeWidth="1.5" />
                <polygon points="18,6 9,17 14,17 12,26 23,13 16.5,13" fill={NEON} />
              </svg>
              <span className="text-base" style={{ fontFamily: 'var(--font-russo)', color: TEXT }}>
                ШОНХОР Админ
              </span>
              <span className="hidden border border-[#A3E63566] bg-[#A3E63514] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#A3E635] sm:inline-block">
                Демо админ
              </span>
            </div>
            <div className="flex items-center gap-2">
              <DemoAdminLogoutButton dark onLogout={onLogout} />
              <DemoLink
                href="/demo/pc-cafe"
                className="inline-flex items-center gap-1.5 border border-[#2CE08055] px-3 py-1.5 text-xs text-[#2CE080] transition-colors hover:bg-[#2CE08014]"
              >
                <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                <span className="sr-only sm:not-sr-only">Вэбсайт</span>
              </DemoLink>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="h-auto w-full justify-start gap-1 rounded-none border border-[#2CE08033] bg-[#0A1F16] p-1 sm:w-fit">
              <TabsTrigger
                value="report"
                className="rounded-none px-4 font-mono text-[12px] uppercase tracking-wider data-[state=active]:bg-[#2CE080] data-[state=active]:text-[#04110B]"
              >
                Тайлан
              </TabsTrigger>
              <TabsTrigger
                value="bookings"
                className="rounded-none px-4 font-mono text-[12px] uppercase tracking-wider data-[state=active]:bg-[#2CE080] data-[state=active]:text-[#04110B]"
              >
                Захиалга
              </TabsTrigger>
              <TabsTrigger
                value="stations"
                className="rounded-none px-4 font-mono text-[12px] uppercase tracking-wider data-[state=active]:bg-[#2CE080] data-[state=active]:text-[#04110B]"
              >
                Суудал
              </TabsTrigger>
            </TabsList>

            <TabsContent value="report" className="mt-5">
              <ReportTab />
            </TabsContent>
            <TabsContent value="bookings" className="mt-5">
              <BookingsTab />
            </TabsContent>
            <TabsContent value="stations" className="mt-5">
              <StationsTab />
            </TabsContent>
          </Tabs>
        </main>

        <footer className="border-t border-[#2CE08026] px-4 py-4 text-center">
          <DemoDataNote />
          <p className="mt-1 font-mono text-[10px] text-[#E7F5EC55]">
            ШОНХОР Gaming Café — Демо админ панель · бодит системт холбогдоогүй
          </p>
        </footer>
      </div>
    </div>
  )
}

// ─── ТАЙЛАН ───
function ReportTab() {
  const stationsApi = useApi<Station>('pc-stations')
  const bookingsApi = useApi<Booking>('pc-bookings')
  const today = todayStr()

  const stats = useMemo(() => {
    const stations = stationsApi.data
    const bookings = bookingsApi.data
    const totalStations = stations.length
    const activeBookings = bookings.filter((b) => b.status === 'идэвхтэй').length
    const todayRevenue = bookings
      .filter((b) => b.date === today && b.paymentStatus === 'төлөгдсөн' && b.status !== 'цуцлагдсан')
      .reduce((sum, b) => sum + b.totalAmount, 0)
    const occupied = stations.filter((s) => s.status === 'эзлэгдсэн').length
    const occupiedPct = totalStations > 0 ? Math.round((occupied / totalStations) * 100) : 0
    return { totalStations, activeBookings, todayRevenue, occupiedPct }
  }, [stationsApi.data, bookingsApi.data, today])

  const todayBookings = useMemo(
    () =>
      bookingsApi.data
        .filter((b) => b.date === today)
        .sort((a, b) => a.startTime.localeCompare(b.startTime)),
    [bookingsApi.data, today]
  )

  if (stationsApi.loading || bookingsApi.loading) {
    return <LoadingState label="Тайланг бэлтгэж байна…" />
  }
  if (stationsApi.error || bookingsApi.error) {
    return (
      <EmptyState
        title="Тайлан ачаалахад алдаа гарлаа"
        description={stationsApi.error ?? bookingsApi.error ?? undefined}
        action={
          <Button className={BTN_GHOST} onClick={() => { stationsApi.reload(); bookingsApi.reload() }}>
            Дахин оролдох
          </Button>
        }
      />
    )
  }

  const cards = [
    { icon: Armchair, label: 'НИЙТ СУУДАЛ', value: `${stats.totalStations}`, suffix: '' },
    { icon: CalendarCheck, label: 'ИДЭВХТЭЙ ЗАХИАЛГА', value: `${stats.activeBookings}`, suffix: '' },
    { icon: Banknote, label: 'ӨНӨӨДРИЙН ОРЛОГО', value: fmtN(stats.todayRevenue), suffix: '₮' },
    { icon: Activity, label: 'ЭЗЛЭГДСЭН %', value: `${stats.occupiedPct}`, suffix: '%' },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {cards.map((c) => (
          <ClipCard key={c.label}>
            <div className="p-4 sm:p-5">
              <c.icon className="mb-2 h-4 w-4" style={{ color: NEON }} aria-hidden />
              <p className="font-mono text-[10px] tracking-[0.18em] text-[#E7F5EC88]">{c.label}</p>
              <p className="mt-1 text-2xl" style={{ fontFamily: 'var(--font-russo)', color: NEON }}>
                {c.value}
                <span className="text-base text-[#E7F5EC99]">{c.suffix}</span>
              </p>
            </div>
          </ClipCard>
        ))}
      </div>

      <ClipCard>
        <div className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#E7F5EC]">Өнөөдрийн захиалгууд</h3>
            <span className="font-mono text-[11px] text-[#E7F5EC88]">{today}</span>
          </div>
          {todayBookings.length === 0 ? (
            <EmptyState title="Өнөөдөр захиалга байхгүй" description="Шинэ захиалга ирэхэд энд харагдана." />
          ) : (
            <ul className="divide-y divide-[#2CE08014]">
              {todayBookings.map((b) => (
                <li key={b.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 py-3">
                  <span className="w-16 font-mono text-sm" style={{ color: NEON }}>
                    {b.startTime}
                  </span>
                  <span className="w-16 font-semibold text-[#E7F5EC]">{b.stationName}</span>
                  <span className="hidden w-24 font-mono text-[12px] text-[#E7F5EC99] sm:block">{b.zone}</span>
                  <span className="min-w-0 flex-1 truncate text-sm text-[#E7F5ECCC]">
                    {b.customerName} <span className="font-mono text-[12px] text-[#E7F5EC88]">{b.phone}</span>
                  </span>
                  <span className="font-mono text-[12px] text-[#E7F5EC99]">{b.hours}ц</span>
                  <span className="font-mono text-sm text-[#E7F5EC]">{fmtN(b.totalAmount)}₮</span>
                  <StatusBadge status={b.status} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </ClipCard>

      <BusyHeatmap bookings={bookingsApi.data} />

      <ZoneUtilization stations={stationsApi.data} bookings={bookingsApi.data} today={today} />
    </div>
  )
}

// ─── БҮСИЙН АШИГЛАЛТ (энэ долоо хоног) ───
const OPEN_HOURS_PER_DAY = 13 // 10:00–22:00

function mondayOf(base: string): string {
  const [y, m, d] = base.split('-').map(Number)
  const dt = new Date(y, m - 1, d)
  const shift = (dt.getDay() + 6) % 7 // Ням=0 → 6, Дав=1 → 0
  const start = new Date(y, m - 1, d - shift)
  const p = (n: number) => String(n).padStart(2, '0')
  return `${start.getFullYear()}-${p(start.getMonth() + 1)}-${p(start.getDate())}`
}

function addDays(base: string, days: number): string {
  const [y, m, d] = base.split('-').map(Number)
  const dt = new Date(y, m - 1, d + days)
  const p = (n: number) => String(n).padStart(2, '0')
  return `${dt.getFullYear()}-${p(dt.getMonth() + 1)}-${p(dt.getDate())}`
}

function ZoneUtilization({
  stations,
  bookings,
  today,
}: {
  stations: Station[]
  bookings: Booking[]
  today: string
}) {
  const week = useMemo(() => {
    const start = mondayOf(today)
    const end = addDays(start, 6)
    const perZone = ZONES.map((zone) => {
      const seatCount = stations.filter((s) => s.zone === zone).length
      const bookedHours = bookings
        .filter((b) => b.zone === zone && b.status !== 'цуцлагдсан' && b.date >= start && b.date <= end)
        .reduce((sum, b) => sum + b.hours, 0)
      const capacity = seatCount * OPEN_HOURS_PER_DAY * 7
      return {
        zone,
        seatCount,
        bookedHours,
        capacity,
        pct: capacity > 0 ? Math.min(100, Math.round((bookedHours / capacity) * 100)) : 0,
      }
    })
    return { start, list: perZone, totalHours: perZone.reduce((s, z) => s + z.bookedHours, 0) }
  }, [stations, bookings, today])

  return (
    <ClipCard>
      <div className="p-5">
        <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-[#E7F5EC]">
            <Gauge className="h-4 w-4" style={{ color: NEON }} aria-hidden />
            Суудлын ашиглалт (энэ долоо хоног)
          </h3>
          {week.totalHours > 0 && (
            <span className="font-mono text-[11px]" style={{ color: NEON }}>
              нийт {week.totalHours} цаг захиалсан
            </span>
          )}
        </div>
        <p className="mb-4 font-mono text-[11px] text-[#E7F5EC77]">
          Ашиглалт = захиалсан цаг / (суудал × {OPEN_HOURS_PER_DAY} цаг × 7 хоног) · цуцлагдсангүй
        </p>
        {week.totalHours === 0 ? (
          <EmptyState
            title="Энэ долоо хоногт захиалга байхгүй"
            description="Захиалга орж ирэхэд бүс бүрийн ашиглалтын хувь энд харагдана."
          />
        ) : (
          <div className="space-y-4">
            {week.list.map((z) => (
              <div key={z.zone}>
                <div className="mb-1.5 flex flex-wrap items-baseline justify-between gap-x-3 text-xs">
                  <span className="font-medium text-[#E7F5EC]">
                    {z.zone}
                    <span className="ml-2 font-mono text-[10px] text-[#E7F5EC77]">{z.seatCount} суудал</span>
                  </span>
                  <span className="font-mono text-[11px] text-[#E7F5EC99]">
                    {z.bookedHours} цаг · <span style={{ color: NEON }}>{z.pct}%</span>
                  </span>
                </div>
                <div
                  className="h-2.5 overflow-hidden rounded-full bg-[#2CE0800F]"
                  role="img"
                  aria-label={`${z.zone}: ${z.bookedHours} цаг, ашиглалт ${z.pct}%`}
                >
                  <div
                    className="h-full rounded-full transition-[width] duration-700 ease-out"
                    style={{
                      width: `${Math.max(z.pct, z.bookedHours > 0 ? 3 : 0)}%`,
                      background: 'linear-gradient(90deg, rgba(44,224,128,0.45), #2CE080)',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ClipCard>
  )
}

// ─── ЭЗЛЭГДЭЛТИЙН ХЭATMAP (гараг × цаг) ───
const HEAT_DAYS = ['Дав', 'Мяг', 'Лха', 'Пүр', 'Баа', 'Бям', 'Ням'] // Дав–Ням
const HEAT_HOURS = Array.from({ length: 13 }, (_, i) => 10 + i) // 10:00–22:00

function heatColor(count: number, max: number): string {
  if (count === 0 || max === 0) return 'rgba(44,224,128,0.05)'
  const t = Math.min(1, count / max)
  // 0.05 → 0.85 neon alpha curve
  return `rgba(44,224,128,${(0.05 + t * 0.8).toFixed(2)})`
}

function BusyHeatmap({ bookings }: { bookings: Booking[] }) {
  const { cells, max, total } = useMemo(() => {
    const map = new Map<string, number>()
    let total = 0
    for (const b of bookings) {
      if (b.status === 'цуцлагдсан') continue
      const [y, m, d] = b.date.split('-').map(Number)
      if (!y || !m || !d) continue
      const jsDay = new Date(y, m - 1, d).getDay() // 0=Ням
      const rowIdx = (jsDay + 6) % 7 // 0=Дав … 6=Ням
      const hour = Number(b.startTime.slice(0, 2))
      const key = `${rowIdx}:${hour}`
      map.set(key, (map.get(key) ?? 0) + 1)
      total++
    }
    const max = Math.max(0, ...map.values())
    return { cells: map, max, total }
  }, [bookings])

  const peak = useMemo(() => {
    let best = { label: '', count: 0 }
    for (const [key, count] of cells) {
      if (count > best.count) {
        const [r, h] = key.split(':').map(Number)
        best = { label: `${HEAT_DAYS[r]} ${String(h).padStart(2, '0')}:00`, count }
      }
    }
    return best
  }, [cells])

  return (
    <ClipCard>
      <div className="p-5">
        <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-[#E7F5EC]">
            <Flame className="h-4 w-4" style={{ color: NEON }} aria-hidden />
            Эзлэгдэлтийн хэв шинж (гараг × цаг)
          </h3>
          {peak.count > 0 && (
            <span className="font-mono text-[11px]" style={{ color: NEON }}>
              Хамгийн их: {peak.label} · {peak.count} захиалга
            </span>
          )}
        </div>
        <p className="mb-4 font-mono text-[11px] text-[#E7F5EC77]">
          Цуцлагдсан захиалгыг оролцуулаагүй · нийт {total} захиалгын эхлэх цагийн хуваарилалт
        </p>
        {total === 0 ? (
          <EmptyState title="Мэдээлэл хуримтлагдаагүй" description="Захиалга нэмэгдэхэд хамгийн их эзлэгдсэн цагууд энд харагдана." />
        ) : (
          <>
            <div className="overflow-x-auto">
              <div className="min-w-[560px]">
                <div className="mb-1 grid" style={{ gridTemplateColumns: '44px repeat(13, 1fr)' }} aria-hidden>
                  <span />
                  {HEAT_HOURS.map((h) => (
                    <span key={h} className="text-center font-mono text-[9px] text-[#E7F5EC66]">
                      {String(h).padStart(2, '0')}
                    </span>
                  ))}
                </div>
                {HEAT_DAYS.map((day, r) => (
                  <div key={day} className="mb-1 grid items-center" style={{ gridTemplateColumns: '44px repeat(13, 1fr)' }}>
                    <span className="pr-2 text-right font-mono text-[10px] text-[#E7F5EC99]">{day}</span>
                    {HEAT_HOURS.map((h) => {
                      const count = cells.get(`${r}:${h}`) ?? 0
                      return (
                        <div
                          key={h}
                          title={`${day} ${String(h).padStart(2, '0')}:00 — ${count} захиалга`}
                          className="mx-[1.5px] h-7 rounded-[2px] transition-transform hover:scale-110"
                          style={{
                            backgroundColor: heatColor(count, max),
                            boxShadow: count > 0 ? `0 0 ${count >= max ? 10 : 4}px rgba(44,224,128,0.25)` : undefined,
                            outline: count > 0 ? '1px solid rgba(44,224,128,0.35)' : '1px solid rgba(44,224,128,0.08)',
                          }}
                        />
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-3 flex items-center justify-end gap-2 font-mono text-[10px] text-[#E7F5EC77]">
              <span>Сул</span>
              {[0.05, 0.25, 0.45, 0.65, 0.85].map((a) => (
                <span key={a} className="h-3 w-5 rounded-[2px]" style={{ backgroundColor: `rgba(44,224,128,${a})` }} aria-hidden />
              ))}
              <span>Өндөр</span>
            </div>
          </>
        )}
      </div>
    </ClipCard>
  )
}

// ─── ЗАХИАЛГА ───
function BookingsTab() {
  const { data, loading, error, reload, update, remove } = useApi<Booking>('pc-bookings')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('бүгд')
  const [deleteTarget, setDeleteTarget] = useState<Booking | null>(null)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return data.filter((b) => {
      if (statusFilter !== 'бүгд' && b.status !== statusFilter) return false
      if (!q) return true
      return (
        b.customerName.toLowerCase().includes(q) ||
        b.phone.includes(q) ||
        b.stationName.toLowerCase().includes(q)
      )
    })
  }, [data, search, statusFilter])

  const setStatus = async (b: Booking, status: string) => {
    try {
      await update(b.id, { status })
      toast.success(`Захиалгын төлөв «${status}» болгогдлоо`)
    } catch {
      toast.error('Төлөв өөрчлөхөд алдаа гарлаа')
    }
  }

  const doDelete = async () => {
    if (!deleteTarget) return
    try {
      await remove(deleteTarget.id)
      toast.success('Захиалгыг устгалаа')
    } catch {
      toast.error('Устгахад алдаа гарлаа')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#E7F5EC66]" aria-hidden />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Хэрэглэгч, утас, PC нэрээр хайх…"
            className={`${INPUT_CLS} pl-9`}
            aria-label="Захиалга хайх"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className={`${SELECT_TRIGGER_CLS} w-full sm:w-44`} aria-label="Төлөв шүүх">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className={SELECT_CONTENT_CLS}>
            <SelectItem value="бүгд">Бүх төлөв</SelectItem>
            {BOOKING_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <LoadingState label="Захиалгуудыг ачаалж байна…" />
      ) : error ? (
        <EmptyState title="Ачаалахад алдаа гарлаа" description={error} action={<Button className={BTN_GHOST} onClick={() => reload()}>Дахин оролдох</Button>} />
      ) : filtered.length === 0 ? (
        <EmptyState title="Захиалга олдсонгүй" description="Хайлтын нөхцөл эсвэл төлөвийн шүүлтрийг өөрчилж үзнэ үү." />
      ) : (
        <ClipCard>
          <div className="overflow-x-auto nice-scroll">
            <Table>
              <TableHeader>
                <TableRow className="border-[#2CE08026] hover:bg-transparent">
                  <TableHead className="text-[#E7F5EC88]">PC</TableHead>
                  <TableHead className="text-[#E7F5EC88]">Бүс</TableHead>
                  <TableHead className="text-[#E7F5EC88]">Огноо</TableHead>
                  <TableHead className="text-[#E7F5EC88]">Цаг</TableHead>
                  <TableHead className="text-[#E7F5EC88]">Хэрэглэгч</TableHead>
                  <TableHead className="text-right text-[#E7F5EC88]">Дүн</TableHead>
                  <TableHead className="text-[#E7F5EC88]">Төлөв</TableHead>
                  <TableHead className="text-[#E7F5EC88]">Төлбөр</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((b) => (
                  <TableRow key={b.id} className="border-[#2CE08014] hover:bg-[#2CE08008]">
                    <TableCell className="font-semibold text-[#E7F5EC]">{b.stationName}</TableCell>
                    <TableCell className="font-mono text-[12px] text-[#E7F5EC99]">{b.zone}</TableCell>
                    <TableCell className="whitespace-nowrap font-mono text-[12px] text-[#E7F5ECCC]">
                      {b.date}
                      <span className="block text-[10px] text-[#E7F5EC66]">{weekdayOf(b.date)}</span>
                    </TableCell>
                    <TableCell className="whitespace-nowrap font-mono text-[12px] text-[#E7F5ECCC]">
                      {b.startTime} · {b.hours}ц
                    </TableCell>
                    <TableCell>
                      <span className="block text-[13px] text-[#E7F5EC]">{b.customerName}</span>
                      <span className="block font-mono text-[11px] text-[#E7F5EC88]">{b.phone}</span>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-right font-mono text-[13px] text-[#E7F5EC]">
                      {fmtN(b.totalAmount)}₮
                    </TableCell>
                    <TableCell>
                      <Select value={b.status} onValueChange={(v) => setStatus(b, v)}>
                        <SelectTrigger
                          size="sm"
                          className="w-[112px] rounded-none border-[#2CE08033] bg-[#06170F] text-[12px] text-[#E7F5EC]"
                          aria-label="Төлөв өөрчлөх"
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className={SELECT_CONTENT_CLS}>
                          {BOOKING_STATUSES.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={b.paymentStatus} />
                    </TableCell>
                    <TableCell>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(b)}
                        className="rounded-none p-1.5 text-[#E7F5EC88] transition-colors hover:text-[#F87171] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F87171]"
                        aria-label={`${b.stationName} захиалгыг устгах`}
                      >
                        <Trash2 className="h-4 w-4" aria-hidden />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </ClipCard>
      )}

      <ConfirmDelete
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        onConfirm={doDelete}
        title="Захиалгыг устгах уу?"
        description={
          deleteTarget
            ? `${deleteTarget.stationName} · ${deleteTarget.date} ${deleteTarget.startTime} — ${deleteTarget.customerName}. Энэ үйлдлийг буцаах боломжгүй.`
            : ''
        }
      />
    </div>
  )
}

// ─── СУУДАЛ / PC CRUD ───
type StationDraft = {
  name: string
  zone: string
  cpu: string
  gpu: string
  ram: string
  extras: string
  pricePerHour: number
  status: string
  active: boolean
}

const EMPTY_DRAFT: StationDraft = {
  name: '',
  zone: 'Стандарт',
  cpu: '',
  gpu: '',
  ram: '',
  extras: '',
  pricePerHour: 3000,
  status: 'боломжтой',
  active: true,
}

function StationsTab() {
  const { data, loading, error, reload, create, update, remove } = useApi<Station>('pc-stations')
  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Station | null>(null)
  const [draft, setDraft] = useState<StationDraft>(EMPTY_DRAFT)
  const [errs, setErrs] = useState<Record<string, string>>({})
  const [deleteTarget, setDeleteTarget] = useState<Station | null>(null)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return q ? data.filter((s) => s.name.toLowerCase().includes(q) || s.zone.toLowerCase().includes(q)) : data
  }, [data, search])

  const openCreate = () => {
    setEditing(null)
    setDraft(EMPTY_DRAFT)
    setErrs({})
    setDialogOpen(true)
  }

  const openEdit = (s: Station) => {
    setEditing(s)
    setDraft({
      name: s.name,
      zone: s.zone,
      cpu: s.cpu,
      gpu: s.gpu,
      ram: s.ram,
      extras: s.extras ?? '',
      pricePerHour: s.pricePerHour,
      status: s.status,
      active: s.active,
    })
    setErrs({})
    setDialogOpen(true)
  }

  const save = async () => {
    const e: Record<string, string> = {}
    if (draft.name.trim().length < 2) e.name = 'Суудлын нэрээ оруулна уу (жишээ: S-01)'
    if (!draft.cpu.trim()) e.cpu = 'CPU заавал бөглөнө үү'
    if (!draft.gpu.trim()) e.gpu = 'GPU заавал бөглөнө үү'
    if (!draft.ram.trim()) e.ram = 'RAM заавал бөглөнө үү'
    if (!Number.isFinite(draft.pricePerHour) || draft.pricePerHour <= 0) e.price = 'Зөв үнэ (төглөг) оруулна уу'
    setErrs(e)
    if (Object.keys(e).length > 0) {
      toast.error('Формын алдааг засна уу')
      return
    }
    const payload = {
      name: draft.name.trim(),
      zone: draft.zone,
      cpu: draft.cpu.trim(),
      gpu: draft.gpu.trim(),
      ram: draft.ram.trim(),
      extras: draft.extras.trim(),
      pricePerHour: Math.round(draft.pricePerHour),
      status: draft.status,
      active: draft.active,
    }
    try {
      if (editing) {
        await update(editing.id, payload)
        toast.success('Суудлын мэдээлэл шинэчлэгдлээ')
      } else {
        await create(payload)
        toast.success('Шинэ суудал нэмэгдлээ')
      }
      setDialogOpen(false)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Хадгалахад алдаа гарлаа')
    }
  }

  const doDelete = async () => {
    if (!deleteTarget) return
    try {
      await remove(deleteTarget.id)
      toast.success('Суудлыг устгалаа')
    } catch {
      toast.error('Устгахад алдаа гарлаа')
    }
  }

  const toggleActive = async (s: Station, v: boolean) => {
    try {
      await update(s.id, { active: v })
      toast.success(v ? `${s.name} идэвхжлээ` : `${s.name} идэвхгүй боллоо`)
    } catch {
      toast.error('Өөрчлөхөд алдаа гарлаа')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#E7F5EC66]" aria-hidden />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Суудлын нэр, бүсээр хайх…"
            className={`${INPUT_CLS} pl-9`}
            aria-label="Суудал хайх"
          />
        </div>
        <Button className={BTN_PRIMARY} style={{ clipPath: CLIP_SM }} onClick={openCreate}>
          <Plus className="mr-1.5 h-4 w-4" aria-hidden />
          Суудал нэмэх
        </Button>
      </div>

      {loading ? (
        <LoadingState label="Суудлуудыг ачаалж байна…" />
      ) : error ? (
        <EmptyState title="Ачаалахад алдаа гарлаа" description={error} action={<Button className={BTN_GHOST} onClick={() => reload()}>Дахин оролдох</Button>} />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="Суудал олдсонгүй"
          description="Шинэ суудал нэмэх эсвэл хайлтын нөхцөлөө өөрчилнө үү."
          action={
            <Button className={BTN_PRIMARY} style={{ clipPath: CLIP_SM }} onClick={openCreate}>
              <Plus className="mr-1.5 h-4 w-4" aria-hidden />
              Суудал нэмэх
            </Button>
          }
        />
      ) : (
        <ClipCard>
          <div className="overflow-x-auto nice-scroll">
            <Table>
              <TableHeader>
                <TableRow className="border-[#2CE08026] hover:bg-transparent">
                  <TableHead className="text-[#E7F5EC88]">Нэр</TableHead>
                  <TableHead className="text-[#E7F5EC88]">Бүс</TableHead>
                  <TableHead className="text-[#E7F5EC88]">Тохиргоо</TableHead>
                  <TableHead className="text-right text-[#E7F5EC88]">Үнэ/цаг</TableHead>
                  <TableHead className="text-[#E7F5EC88]">Төлөв</TableHead>
                  <TableHead className="text-[#E7F5EC88]">Идэвхтэй</TableHead>
                  <TableHead className="w-20" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((s) => (
                  <TableRow key={s.id} className="border-[#2CE08014] hover:bg-[#2CE08008]">
                    <TableCell className="font-semibold text-[#E7F5EC]">{s.name}</TableCell>
                    <TableCell className="font-mono text-[12px] text-[#E7F5EC99]">{s.zone}</TableCell>
                    <TableCell className="max-w-[280px]">
                      <span className="block truncate font-mono text-[11px] text-[#E7F5ECCC]" title={`${s.cpu} · ${s.gpu} · ${s.ram}`}>
                        {s.cpu} · {s.gpu}
                      </span>
                      <span className="block font-mono text-[11px] text-[#E7F5EC88]">{s.ram}</span>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-right font-mono text-[13px]" style={{ color: NEON }}>
                      {fmtN(s.pricePerHour)}₮
                    </TableCell>
                    <TableCell>
                      <Select value={s.status} onValueChange={(v) => { update(s.id, { status: v }).then(() => toast.success(`${s.name} — ${v}`)).catch(() => toast.error('Төлөв өөрчлөхөд алдаа гарлаа')) }}>
                        <SelectTrigger
                          size="sm"
                          className="w-[112px] rounded-none border-[#2CE08033] bg-[#06170F] text-[12px] text-[#E7F5EC]"
                          aria-label="Суудлын төлөв өөрчлөх"
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className={SELECT_CONTENT_CLS}>
                          {STATION_STATUSES.map((st) => (
                            <SelectItem key={st} value={st}>
                              {st}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Switch checked={s.active} onCheckedChange={(v) => toggleActive(s, v)} aria-label={`${s.name} идэвхтэй эсэх`} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => openEdit(s)}
                          className="p-1.5 text-[#E7F5EC88] transition-colors hover:text-[#2CE080] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2CE080]"
                          aria-label={`${s.name} засах`}
                        >
                          <Pencil className="h-4 w-4" aria-hidden />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(s)}
                          className="p-1.5 text-[#E7F5EC88] transition-colors hover:text-[#F87171] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F87171]"
                          aria-label={`${s.name} устгах`}
                        >
                          <Trash2 className="h-4 w-4" aria-hidden />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </ClipCard>
      )}

      {/* Суудлын форма (нэмэх/засах) */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="dark max-h-[90vh] max-w-lg overflow-y-auto nice-scroll rounded-none border-[#2CE08044] bg-[#0A1F16] text-[#E7F5EC] sm:rounded-none">
          <DialogHeader>
            <DialogTitle className="text-lg" style={{ fontFamily: 'var(--font-russo)' }}>
              {editing ? 'Суудал засах' : 'Шинэ суудал нэмэх'}
            </DialogTitle>
            <DialogDescription className="text-[#E7F5EC99]">
              {editing ? `${editing.name} — мэдээллийг шинэчлэнэ үү.` : 'Бүс, тохиргоо, үнийг бөглөнө үү.'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3.5 sm:grid-cols-2">
            <div>
              <Label htmlFor="sf-name" className="font-mono text-[11px] uppercase tracking-wider text-[#E7F5EC88]">
                Нэр <span style={{ color: NEON }}>*</span>
              </Label>
              <Input
                id="sf-name"
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                placeholder="S-07"
                className={`${INPUT_CLS} font-mono`}
                aria-invalid={!!errs.name}
              />
              {errs.name && <p className="mt-1 text-xs text-[#F87171]">{errs.name}</p>}
            </div>
            <div>
              <Label htmlFor="sf-zone" className="font-mono text-[11px] uppercase tracking-wider text-[#E7F5EC88]">
                Бүс
              </Label>
              <Select value={draft.zone} onValueChange={(v) => setDraft({ ...draft, zone: v })}>
                <SelectTrigger id="sf-zone" className={`${SELECT_TRIGGER_CLS} w-full`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className={SELECT_CONTENT_CLS}>
                  {ZONES.map((z) => (
                    <SelectItem key={z} value={z}>
                      {z}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="sf-cpu" className="font-mono text-[11px] uppercase tracking-wider text-[#E7F5EC88]">
                CPU <span style={{ color: NEON }}>*</span>
              </Label>
              <Input
                id="sf-cpu"
                value={draft.cpu}
                onChange={(e) => setDraft({ ...draft, cpu: e.target.value })}
                placeholder="Intel Core i5-13400F"
                className={INPUT_CLS}
                aria-invalid={!!errs.cpu}
              />
              {errs.cpu && <p className="mt-1 text-xs text-[#F87171]">{errs.cpu}</p>}
            </div>
            <div>
              <Label htmlFor="sf-gpu" className="font-mono text-[11px] uppercase tracking-wider text-[#E7F5EC88]">
                GPU <span style={{ color: NEON }}>*</span>
              </Label>
              <Input
                id="sf-gpu"
                value={draft.gpu}
                onChange={(e) => setDraft({ ...draft, gpu: e.target.value })}
                placeholder="NVIDIA GeForce RTX 4060"
                className={INPUT_CLS}
                aria-invalid={!!errs.gpu}
              />
              {errs.gpu && <p className="mt-1 text-xs text-[#F87171]">{errs.gpu}</p>}
            </div>
            <div>
              <Label htmlFor="sf-ram" className="font-mono text-[11px] uppercase tracking-wider text-[#E7F5EC88]">
                RAM <span style={{ color: NEON }}>*</span>
              </Label>
              <Input
                id="sf-ram"
                value={draft.ram}
                onChange={(e) => setDraft({ ...draft, ram: e.target.value })}
                placeholder="16GB DDR5"
                className={INPUT_CLS}
                aria-invalid={!!errs.ram}
              />
              {errs.ram && <p className="mt-1 text-xs text-[#F87171]">{errs.ram}</p>}
            </div>
            <div>
              <Label htmlFor="sf-extras" className="font-mono text-[11px] uppercase tracking-wider text-[#E7F5EC88]">
                Нэмэлт (сонголттой)
              </Label>
              <Input
                id="sf-extras"
                value={draft.extras}
                onChange={(e) => setDraft({ ...draft, extras: e.target.value })}
                placeholder="240Hz монитор · премиум сандал"
                className={INPUT_CLS}
              />
            </div>
            <div>
              <Label htmlFor="sf-price" className="font-mono text-[11px] uppercase tracking-wider text-[#E7F5EC88]">
                Үнэ / цаг (төглөг) <span style={{ color: NEON }}>*</span>
              </Label>
              <Input
                id="sf-price"
                type="number"
                min={1}
                step={500}
                value={draft.pricePerHour}
                onChange={(e) => setDraft({ ...draft, pricePerHour: Number(e.target.value) })}
                className={`${INPUT_CLS} font-mono`}
                aria-invalid={!!errs.price}
              />
              {errs.price && <p className="mt-1 text-xs text-[#F87171]">{errs.price}</p>}
            </div>
            <div>
              <Label htmlFor="sf-status" className="font-mono text-[11px] uppercase tracking-wider text-[#E7F5EC88]">
                Төлөв
              </Label>
              <Select value={draft.status} onValueChange={(v) => setDraft({ ...draft, status: v })}>
                <SelectTrigger id="sf-status" className={`${SELECT_TRIGGER_CLS} w-full`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className={SELECT_CONTENT_CLS}>
                  {STATION_STATUSES.map((st) => (
                    <SelectItem key={st} value={st}>
                      {st}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-3 sm:col-span-2">
              <Switch
                id="sf-active"
                checked={draft.active}
                onCheckedChange={(v) => setDraft({ ...draft, active: v })}
                aria-label="Идэвхтэй эсэх"
              />
              <Label htmlFor="sf-active" className="text-sm text-[#E7F5EC]">
                Идэвхтэй (захиалгад харагдана)
              </Label>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" className={BTN_GHOST} onClick={() => setDialogOpen(false)}>
              Болих
            </Button>
            <Button className={cn(BTN_PRIMARY)} style={{ clipPath: CLIP_SM }} onClick={save}>
              {editing ? 'Хадгалах' : 'Нэмэх'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDelete
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        onConfirm={doDelete}
        title="Суудлыг устгах уу?"
        description={
          deleteTarget
            ? `${deleteTarget.name} (${deleteTarget.zone} бүс) — суудлыг бүрмөсөн устгана. Энэ үйлдлийг буцаах боломжгүй.`
            : ''
        }
      />
    </div>
  )
}
