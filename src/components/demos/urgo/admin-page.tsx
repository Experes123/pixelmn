'use client'

import { Fragment, useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { navigate } from '@/lib/hash-router'
import { useApi } from '@/lib/use-api'
import { ReturnToMain } from '@/components/shared/demo-kit'
import { DemoAdminGate, DemoAdminLogoutButton, useDemoAdminAuth } from '@/components/shared/demo-gate'
import { ConfirmDelete, DemoDataNote, EmptyState, LoadingState, StatusBadge, fmtDateTime, fmtMNT } from '@/components/shared/admin-kit'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import {
  Bike,
  ChefHat,
  ChevronDown,
  ChevronRight,
  Download,
  Flame,
  ArrowLeft,
  LayoutDashboard,
  ListOrdered,
  Pencil,
  Plus,
  ReceiptText,
  Search,
  Trash2,
  UtensilsCrossed,
  Wallet,
} from 'lucide-react'
import { Photo } from './photo'
import {
  ALL_STATUSES,
  ASAP_WINDOW,
  CATEGORIES,
  FOOD,
  GREEN,
  GREEN_DEEP,
  IMAGE_OPTIONS,
  ORDER_STEPS,
  TERRA,
  deliveryWindowOptions,
  orderCode,
  parseItems,
  readWindow,
  type MenuItemData,
  type OrderData,
} from './constants'

/* ────────────────────────── ТАЙЛАН ────────────────────────── */

function StatsTab({
  orders,
  menuCount,
}: {
  orders: OrderData[]
  menuCount: number
}) {
  const today = new Date().toDateString()
  const todays = orders.filter((o) => new Date(o.createdAt).toDateString() === today)
  const revenue = todays.filter((o) => o.status !== 'цуцлагдсан').reduce((s, o) => s + o.total, 0)
  const activeDeliveries = orders.filter((o) =>
    ['хүлээн авсан', 'бэлтгэж байна', 'хүргэлтэд гарсан'].includes(o.status)
  ).length

  const stats = [
    { icon: ReceiptText, label: 'Өнөөдрийн захиалга', value: String(todays.length) },
    { icon: Wallet, label: 'Өнөөдрийн орлого', value: fmtMNT(revenue) },
    { icon: Bike, label: 'Идэвхтэй хүргэлт', value: String(activeDeliveries) },
    { icon: UtensilsCrossed, label: 'Цэсний нийт ширхэг', value: String(menuCount) },
  ]

  const latest = orders.slice(0, 6)

  // Төлөвийн шатлалын диаграмм (pipeline): хүлээн авсан → хүргэгдсэн
  const pipeline = useMemo(() => {
    const rows = ORDER_STEPS.map((s) => {
      const list = orders.filter((o) => o.status === s)
      return {
        status: s,
        count: list.length,
        revenue: list.reduce((sum, o) => sum + o.total, 0),
      }
    })
    const cancelled = orders.filter((o) => o.status === 'цуцлагдсан').length
    const max = Math.max(1, ...rows.map((r) => r.count))
    return { rows, cancelled, max }
  }, [orders])

  const weekRevenue = useMemo(() => {
    const WD = ['Ням', 'Дав', 'Мяг', 'Лха', 'Пүр', 'Баа', 'Бям']
    const days: { day: string; орлого: number }[] = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const key = d.toDateString()
      const total = orders
        .filter((o) => new Date(o.createdAt).toDateString() === key && o.status !== 'цуцлагдсан')
        .reduce((s, o) => s + o.total, 0)
      days.push({
        day: `${d.getDate()} ${WD[d.getDay()]}`,
        орлого: total,
      })
    }
    return days
  }, [orders])

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="urgo-ui rounded-2xl border border-white/10 bg-white/5 p-5"
          >
            <span className="grid h-10 w-10 place-items-center rounded-full" style={{ backgroundColor: `${TERRA}30` }}>
              <Icon className="h-5 w-5" style={{ color: '#E8A287' }} />
            </span>
            <p className="mt-3 text-sm text-white/60">{label}</p>
            <p className="mt-0.5 text-2xl font-bold text-white">{value}</p>
          </div>
        ))}
      </div>

      {/* Сүүлийн 7 хоногийн орлого + эрэлттэй хоолнууд */}
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 lg:col-span-3">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-semibold text-white">Сүүлийн 7 хоногийн орлого</h3>
            <DemoDataNote className="text-white/40" />
          </div>
          <div className="h-56 w-full" role="img" aria-label="Сүүлийн 7 хоногийн орлогын диаграмм">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekRevenue} margin={{ top: 6, right: 8, left: 8, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.08)" />
                <XAxis
                  dataKey="day"
                  tick={{ fill: 'rgba(255,255,255,0.55)', fontSize: 11 }}
                  axisLine={{ stroke: 'rgba(255,255,255,0.15)' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: 'rgba(255,255,255,0.55)', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={52}
                  tickFormatter={(v: number) => (v >= 1000 ? `${Math.round(v / 1000)}k` : String(v))}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.06)' }}
                  contentStyle={{
                    background: '#1F2A1D',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: 12,
                    color: '#fff',
                    fontSize: 12,
                  }}
                  formatter={(value) => [fmtMNT(Number(value)), 'Орлого']}
                />
                <Bar dataKey="орлого" fill="#B4552D" radius={[6, 6, 0, 0]} maxBarSize={38} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <TopItems orders={orders} />
      </div>

      {/* Төлөвийн шатлал (pipeline) + цуцлалт */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-semibold text-white">Захиалгын шатлал</h3>
          <span className="text-xs text-white/45">
            Нийт {orders.length} захиалга · Цуцлагдсан {pipeline.cancelled}
          </span>
        </div>
        {orders.length === 0 ? (
          <EmptyState
            title="Мэдээлэл байхгүй"
            description="Захиалга ирснээр шатлалын диаграмм энд гарна."
            icon={<ListOrdered className="h-5 w-5 text-muted-foreground" />}
          />
        ) : (
          <ol className="space-y-4">
            {pipeline.rows.map((r, i) => (
              <li key={r.status} aria-label={`${r.status}: ${r.count} захиалга`}>
                <div className="flex flex-wrap items-baseline justify-between gap-2 text-sm">
                  <span className="flex items-center gap-2 font-medium text-white">
                    <span
                      className="grid h-5 w-5 place-items-center rounded-full text-[10px] font-bold"
                      style={{
                        backgroundColor: i === pipeline.rows.length - 1 ? '#B4552D' : 'rgba(180,85,45,0.25)',
                        color: i === pipeline.rows.length - 1 ? '#fff' : '#E8A287',
                      }}
                      aria-hidden
                    >
                      {i + 1}
                    </span>
                    {r.status}
                  </span>
                  <span className="text-xs text-white/55">
                    {r.count} ширхэг · <span className="text-[#E8A287]">{fmtMNT(r.revenue)}</span>
                  </span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/8">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${Math.max(4, Math.round((r.count / pipeline.max) * 100))}%`,
                      background:
                        i === pipeline.rows.length - 1
                          ? 'linear-gradient(90deg, #B4552D, #D97E52)'
                          : 'linear-gradient(90deg, rgba(180,85,45,0.55), rgba(217,126,82,0.55))',
                    }}
                  />
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <h3 className="font-semibold text-white">Сүүлийн захиалгууд</h3>
          <DemoDataNote className="text-white/40" />
        </div>
        {latest.length === 0 ? (
          <div className="p-6">
            <EmptyState
              title="Захиалга хараахан байхгүй"
              description="Шинэ захиалга ирэхэд энд харагдана."
              icon={<ReceiptText className="h-5 w-5 text-muted-foreground" />}
            />
          </div>
        ) : (
          <ul className="urgo-ui divide-y divide-white/5">
            {latest.map((o) => (
              <li key={o.id} className="flex flex-wrap items-center justify-between gap-2 px-5 py-3.5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">
                    {orderCode(o.id)} · {o.customerName}
                  </p>
                  <p className="text-xs text-white/50">
                    {o.phone} · {fmtDateTime(o.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-white">{fmtMNT(o.total)}</span>
                  <StatusBadge status={o.status} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

/* ────────────────────────── ЭРЭЛТТЭЙ ХООЛНУУД ────────────────────────── */

function TopItems({ orders }: { orders: OrderData[] }) {
  const top = useMemo(() => {
    const map = new Map<string, { name: string; qty: number; revenue: number }>()
    for (const o of orders) {
      if (o.status === 'цуцлагдсан') continue
      for (const it of parseItems(o.items)) {
        if (!it.name) continue
        const prev = map.get(it.name) ?? { name: it.name, qty: 0, revenue: 0 }
        prev.qty += it.qty || 0
        prev.revenue += (it.price || 0) * (it.qty || 0)
        map.set(it.name, prev)
      }
    }
    const maxQty = Math.max(1, ...[...map.values()].map((v) => v.qty))
    return [...map.values()]
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5)
      .map((v) => ({ ...v, pct: Math.round((v.qty / maxQty) * 100) }))
  }, [orders])

  return (
    <div className="urgo-ui rounded-2xl border border-white/10 bg-white/5 p-5 lg:col-span-2">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-semibold text-white">Хамгийн эрэлттэй хоолнууд</h3>
        <Flame className="h-4 w-4" style={{ color: '#E8A287' }} aria-hidden />
      </div>
      {top.length === 0 ? (
        <div className="p-4">
          <EmptyState
            title="Мэдээлэл байхгүй"
            description="Захиалга ирснээр эрэлттэй хоолнууд энд гарна."
            icon={<UtensilsCrossed className="h-5 w-5 text-muted-foreground" />}
          />
        </div>
      ) : (
        <ol className="space-y-3.5">
          {top.map((item, i) => (
            <li key={item.name}>
              <div className="flex items-baseline justify-between gap-2 text-sm">
                <p className="flex min-w-0 items-center gap-2">
                  <span
                    className="grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10px] font-bold"
                    style={{
                      backgroundColor: i === 0 ? '#B4552D' : 'rgba(180,85,45,0.25)',
                      color: i === 0 ? '#fff' : '#E8A287',
                    }}
                    aria-hidden
                  >
                    {i + 1}
                  </span>
                  <span className="truncate font-medium text-white">{item.name}</span>
                </p>
                <span className="shrink-0 text-xs text-white/55">
                  {item.qty} ширхэг · <span className="text-[#E8A287]">{fmtMNT(item.revenue)}</span>
                </span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/8">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${item.pct}%`,
                    background: 'linear-gradient(90deg, #B4552D, #D97E52)',
                  }}
                />
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}

/* ────────────────────────── ЗАХИАЛГА ────────────────────────── */

/** CSV мөрийн утгыг хашилтад бүүж, доторх хашилтыг хослуулна */
function csvEscape(value: unknown): string {
  return `"${String(value ?? '').replace(/"/g, '""')}"`
}

const ORDER_CSV_HEADERS = [
  'Код',
  'Хэрэглэгч',
  'Утас',
  'Хаяг',
  'Бүтээгдэхүүн',
  'Барааны дүн',
  'Хүргэлт',
  'Нийт',
  'Төлөв',
  'Төлбөр',
  'Хүргэлтийн цаг',
  'Огноо',
]

/** Шүүгдсэн захиалгуудыг UTF-8 BOM-той CSV болгоно — Excel-д кирилл зөв харагдана */
function buildOrdersCsv(rows: OrderData[]): string {
  const lines = [ORDER_CSV_HEADERS.map(csvEscape).join(',')]
  for (const o of rows) {
    const items = parseItems(o.items)
      .map((it) => `${it.name} ×${it.qty}`)
      .join('; ')
    lines.push(
      [
        orderCode(o.id),
        o.customerName,
        o.phone,
        o.address,
        items,
        o.subtotal,
        o.deliveryFee,
        o.total,
        o.status,
        o.paymentStatus,
        readWindow(o.meta) ?? ASAP_WINDOW,
        fmtDateTime(o.createdAt),
      ]
        .map(csvEscape)
        .join(',')
    )
  }
  return '\uFEFF' + lines.join('\r\n')
}

/** CSV файлыг шууд татна (Blob + a.download) */
function downloadOrdersCsv(rows: OrderData[]) {
  const blob = new Blob([buildOrdersCsv(rows)], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'urgo-orders.csv'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function OrdersTab({
  orders,
  loading,
  update,
  remove,
}: {
  orders: OrderData[]
  loading: boolean
  update: (id: string, payload: Record<string, unknown>) => Promise<unknown>
  remove: (id: string) => Promise<void>
}) {
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('Бүх')
  const [mode, setMode] = useState<'all' | 'today'>('all')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<OrderData | null>(null)
  const [busy, setBusy] = useState(false)

  // Өнөөдрийн идэвхтэй хүргэлтийн дараалал — ASAP эхэлж, дараа нь цагийн цонхоор эрэмблэнэ
  const todayQueue = useMemo(() => {
    const key = (w: string | null): number => {
      if (!w || w === ASAP_WINDOW) return -1
      const m = w.match(/^(\d{2}):(\d{2})/)
      return m ? Number(m[1]) * 60 + Number(m[2]) : 9999
    }
    const today = new Date().toDateString()
    return orders
      .filter(
        (o) =>
          new Date(o.createdAt).toDateString() === today &&
          o.status !== 'цуцлагдсан' &&
          o.status !== 'хүргэгдсэн'
      )
      .sort((a, b) => key(readWindow(a.meta)) - key(readWindow(b.meta)))
  }, [orders])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const match = (o: OrderData) => {
      const qOk =
        q === '' ||
        o.customerName.toLowerCase().includes(q) ||
        o.phone.includes(q) ||
        orderCode(o.id).toLowerCase().includes(q)
      const sOk = statusFilter === 'Бүх' || o.status === statusFilter
      return qOk && sOk
    }
    if (mode === 'today') return todayQueue.filter(match)
    return orders.filter(match)
  }, [orders, query, statusFilter, mode, todayQueue])

  const nextStatus = (status: string): string | null => {
    const i = ORDER_STEPS.indexOf(status as (typeof ORDER_STEPS)[number])
    if (i === -1 || i === ORDER_STEPS.length - 1) return null
    return ORDER_STEPS[i + 1]
  }

  const setStatus = async (o: OrderData, status: string) => {
    setBusy(true)
    try {
      await update(o.id, { status })
      toast.success(`${orderCode(o.id)} — төлөв "${status}" боллоо.`)
    } catch {
      toast.error('Төлөв шинэчлэхэд алдаа гарлаа.')
    } finally {
      setBusy(false)
    }
  }

  const setWindow = async (o: OrderData, deliveryWindow: string) => {
    setBusy(true)
    try {
      await update(o.id, { meta: { ...(o.meta ?? {}), deliveryWindow } })
      toast.success(`${orderCode(o.id)} — хүргэлтийн цаг "${deliveryWindow}" боллоо.`)
    } catch {
      toast.error('Цагийн цонх шинэчлэхэд алдаа гарлаа.')
    } finally {
      setBusy(false)
    }
  }

  const doDelete = async () => {
    if (!deleteTarget) return
    setBusy(true)
    try {
      await remove(deleteTarget.id)
      toast.success(`${orderCode(deleteTarget.id)} захиалгыг устгалаа.`)
    } catch {
      toast.error('Устгахад алдаа гарлаа.')
    } finally {
      setBusy(false)
      setDeleteTarget(null)
    }
  }

  return (
    <div className="urgo-ui space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setMode('all')}
          aria-pressed={mode === 'all'}
          className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B4552D] ${
            mode === 'all'
              ? 'border-[#B4552D] bg-[#B4552D] text-white'
              : 'border-white/15 bg-transparent text-white/70 hover:bg-white/10 hover:text-white'
          }`}
        >
          Бүх захиалга
        </button>
        <button
          type="button"
          onClick={() => setMode('today')}
          aria-pressed={mode === 'today'}
          className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B4552D] ${
            mode === 'today'
              ? 'border-[#B4552D] bg-[#B4552D] text-white'
              : 'border-white/15 bg-transparent text-white/70 hover:bg-white/10 hover:text-white'
          }`}
        >
          <Bike className="h-3.5 w-3.5" />
          Өнөөдрийн хүргэлт
          <span
            className={`ml-0.5 rounded-full px-1.5 py-px text-[10px] font-bold ${
              mode === 'today' ? 'bg-white/20 text-white' : 'bg-[#B4552D]/20 text-[#E8956F]'
            }`}
          >
            {todayQueue.length}
          </span>
        </button>
        {mode === 'today' && todayQueue.length > 0 && (
          <span className="text-xs text-white/50">
            {todayQueue.length} идэвхтэй · ойрын цонх:{' '}
            <span className="font-semibold text-[#E8956F]">
              {readWindow(todayQueue[0].meta) ?? ASAP_WINDOW}
            </span>
          </span>
        )}
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Нэр, утас эсвэл кодоор хайх…"
            className="pl-9"
          />
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48" aria-label="Төлөвөөр шүүх">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Бүх">Бүх төлөв</SelectItem>
              {ALL_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            disabled={loading || filtered.length === 0}
            onClick={() => {
              downloadOrdersCsv(filtered)
              toast.success(`${filtered.length} захиалга экспортлогдлоо`)
            }}
            className="border-white/15 bg-transparent text-[#E7F5EC] hover:bg-white/10 hover:text-white"
            aria-label="Шүүлтүүрт таарах захиалгуудыг CSV файлаар татах"
          >
            <Download className="h-4 w-4" />
            CSV татах
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        {loading ? (
          <LoadingState label="Захиалгуудыг ачаалж байна…" />
        ) : filtered.length === 0 ? (
          <div className="p-6">
            <EmptyState
              title="Захиалга олдсонгүй"
              description="Хайлтын нөхцөл эсвэл төлөвийн шүүлтүүрийг өөрчилж үзээрэй."
              icon={<ReceiptText className="h-5 w-5 text-muted-foreground" />}
            />
          </div>
        ) : (
          <div className="overflow-x-auto nice-scroll">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="w-8 text-white/60" />
                  <TableHead className="text-white/60">Код</TableHead>
                  <TableHead className="text-white/60">Хэрэглэгч</TableHead>
                  <TableHead className="text-white/60">Утас</TableHead>
                  <TableHead className="text-white/60">Хаяг</TableHead>
                  <TableHead className="text-right text-white/60">Дүн</TableHead>
                  <TableHead className="text-white/60">Төлөв</TableHead>
                  <TableHead className="text-white/60">Төлбөр</TableHead>
                  <TableHead className="text-white/60">Огноо</TableHead>
                  <TableHead className="text-right text-white/60">Үйлдэл</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((o) => {
                  const next = nextStatus(o.status)
                  const isOpen = expanded === o.id
                  return (
                    <Fragment key={o.id}>
                      <TableRow className="border-white/10">
                        <TableCell>
                          <button
                            type="button"
                            onClick={() => setExpanded(isOpen ? null : o.id)}
                            aria-expanded={isOpen}
                            aria-label={isOpen ? 'Хаах' : 'Бүтцийг харах'}
                            className="rounded p-1 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B4552D]"
                          >
                            {isOpen ? (
                              <ChevronDown className="h-4 w-4 text-white/70" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-white/70" />
                            )}
                          </button>
                        </TableCell>
                        <TableCell className="whitespace-nowrap font-semibold text-white">
                          {orderCode(o.id)}
                        </TableCell>
                        <TableCell className="text-white/90">{o.customerName}</TableCell>
                        <TableCell className="whitespace-nowrap text-white/80">{o.phone}</TableCell>
                        <TableCell className="max-w-40 truncate text-white/70" title={o.address}>
                          {o.address}
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-right font-bold text-white">
                          {fmtMNT(o.total)}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={o.status} />
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={o.paymentStatus} />
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-white/60">
                          {fmtDateTime(o.createdAt)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-1.5">
                            {next && (
                              <Button
                                size="sm"
                                disabled={busy}
                                variant="outline"
                                className="h-7 rounded-full border-white/20 bg-transparent px-2.5 text-xs text-white hover:bg-white/10 hover:text-white"
                                onClick={() => void setStatus(o, next)}
                                title={`${next} руу шилжүүлэх`}
                              >
                                {next} →
                              </Button>
                            )}
                            <Select
                              value={o.status}
                              onValueChange={(v) => void setStatus(o, v)}
                            >
                              <SelectTrigger
                                className="h-7 w-8 rounded-full border-white/20 bg-transparent px-0 [&>svg]:mx-auto [&>svg]:text-white/70"
                                aria-label="Төлөв сонгох"
                              >
                                <span className="sr-only">Төлөв</span>
                              </SelectTrigger>
                              <SelectContent>
                                {ALL_STATUSES.map((s) => (
                                  <SelectItem key={s} value={s}>
                                    {s}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <button
                              type="button"
                              onClick={() => setDeleteTarget(o)}
                              aria-label="Устгах"
                              className="rounded p-1.5 text-red-300 hover:bg-red-500/10 hover:text-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                      {isOpen && (
                        <TableRow className="border-white/10 hover:bg-transparent">
                          <TableCell colSpan={10}>
                            <div className="rounded-xl bg-black/20 p-4">
                              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-white/50">
                                Захиалгын бүтэц
                              </p>
                              <ul className="divide-y divide-white/5 text-sm">
                                {parseItems(o.items).map((it, idx) => (
                                  <li key={idx} className="flex items-baseline justify-between gap-3 py-1.5">
                                    <span className="text-white/90">
                                      {it.qty} × {it.name}
                                      {it.options && it.options.length > 0 && (
                                        <span className="text-white/50"> · {it.options.join(', ')}</span>
                                      )}
                                    </span>
                                    <span className="text-white/70">{fmtMNT(it.price * it.qty)}</span>
                                  </li>
                                ))}
                              </ul>
                              <div className="mt-2 grid gap-1 border-t border-white/10 pt-2 text-xs text-white/60 sm:grid-cols-3">
                                <span>Хоол: {fmtMNT(o.subtotal)}</span>
                                <span>Хүргэлт: {fmtMNT(o.deliveryFee)}</span>
                                <span className="font-semibold text-white">Нийт: {fmtMNT(o.total)}</span>
                              </div>

                              {/* Хүргэлтийн цагийн цонх — харах + засах */}
                              <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-white/10 pt-3">
                                <Bike className="h-4 w-4 text-[#E8A287]" aria-hidden />
                                <span className="text-xs text-white/55">Хүргэлтийн цаг:</span>
                                <span className="text-xs font-semibold text-white">
                                  {readWindow(o.meta) ?? 'Тодорхойгүй'}
                                </span>
                                <Select
                                  value={readWindow(o.meta) ?? ASAP_WINDOW}
                                  onValueChange={(v) => void setWindow(o, v)}
                                >
                                  <SelectTrigger
                                    className="h-7 w-[190px] rounded-full border-white/20 bg-transparent text-xs text-white"
                                    aria-label="Хүргэлтийн цагийн цонх сонгох"
                                  >
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="border-white/15 bg-[#1F2A1D] text-white">
                                    {deliveryWindowOptions().map((w) => (
                                      <SelectItem key={w} value={w} className="text-white focus:bg-white/10 focus:text-white data-[highlighted]:bg-white/10 data-[highlighted]:text-white">
                                        {w}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              {o.notes && (
                                <p className="mt-2 text-xs italic text-white/60">Тэмдэглэл: {o.notes}</p>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </Fragment>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
      <DemoDataNote className="text-white/40" />

      <ConfirmDelete
        open={deleteTarget !== null}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        onConfirm={doDelete}
        title="Захиалгыг устгах уу?"
        description={
          deleteTarget
            ? `${orderCode(deleteTarget.id)} — ${fmtMNT(deleteTarget.total)}. Энэ үйлдлийг буцаах боломжгүй.`
            : ''
        }
      />
    </div>
  )
}

/* ────────────────────────── ЦЭС ────────────────────────── */

type MenuFormState = {
  name: string
  description: string
  category: string
  price: string
  imageUrl: string
  spicy: boolean
  available: boolean
  popular: boolean
}

const EMPTY_FORM: MenuFormState = {
  name: '',
  description: '',
  category: 'нэйлэг',
  price: '',
  imageUrl: '',
  spicy: false,
  available: true,
  popular: false,
}

function MenuTab({
  items,
  loading,
  create,
  update,
  remove,
}: {
  items: MenuItemData[]
  loading: boolean
  create: (payload: Record<string, unknown>) => Promise<unknown>
  update: (id: string, payload: Record<string, unknown>) => Promise<unknown>
  remove: (id: string) => Promise<void>
}) {
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<MenuItemData | null>(null)
  const [form, setForm] = useState<MenuFormState>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<MenuItemData | null>(null)
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return items
    return items.filter((i) => i.name.toLowerCase().includes(q) || i.category.includes(q))
  }, [items, search])

  const openCreate = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setFormOpen(true)
  }

  const openEdit = (item: MenuItemData) => {
    setEditing(item)
    setForm({
      name: item.name,
      description: item.description,
      category: item.category,
      price: String(item.price),
      imageUrl: item.imageUrl ?? '',
      spicy: item.spicy,
      available: item.available,
      popular: item.popular,
    })
    setFormOpen(true)
  }

  const save = async () => {
    const priceNum = Number(form.price.replace(/\D/g, ''))
    if (form.name.trim().length < 2) {
      toast.error('Хоолны нэрийг оруулна уу.')
      return
    }
    if (!priceNum || priceNum < 100) {
      toast.error('Үнэ хамгийн багадаа 100₮ байх ёстой.')
      return
    }
    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || 'Тайлбаргүй',
      category: form.category,
      price: priceNum,
      imageUrl: form.imageUrl || null,
      spicy: form.spicy,
      available: form.available,
      popular: form.popular,
    }
    setSaving(true)
    try {
      if (editing) {
        await update(editing.id, payload)
        toast.success(`"${payload.name}" шинэчлэгдлээ.`)
      } else {
        await create(payload)
        toast.success(`"${payload.name}" цэснд нэмэгдлээ.`)
      }
      setFormOpen(false)
    } catch {
      toast.error('Хадгалахад алдаа гарлаа.')
    } finally {
      setSaving(false)
    }
  }

  const doDelete = async () => {
    if (!deleteTarget) return
    try {
      await remove(deleteTarget.id)
      toast.success(`"${deleteTarget.name}" цэснээс хасагдлаа.`)
    } catch {
      toast.error('Устгахад алдаа гарлаа.')
    } finally {
      setDeleteTarget(null)
    }
  }

  return (
    <div className="urgo-ui space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Хоолны нэрээр хайх…"
            className="pl-9"
          />
        </div>
        <Button
          className="rounded-full text-white"
          style={{ backgroundColor: TERRA }}
          onClick={openCreate}
        >
          <Plus className="mr-1.5 h-4 w-4" />
          Шинэ хоол нэмэх
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        {loading ? (
          <LoadingState label="Цэсийг ачаалж байна…" />
        ) : filtered.length === 0 ? (
          <div className="p-6">
            <EmptyState
              title="Цэс хоосон байна"
              description="Шинэ хоол нэмж эхлээрэй."
              icon={<UtensilsCrossed className="h-5 w-5 text-muted-foreground" />}
            />
          </div>
        ) : (
          <div className="overflow-x-auto nice-scroll">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="text-white/60">Зураг</TableHead>
                  <TableHead className="text-white/60">Нэр</TableHead>
                  <TableHead className="text-white/60">Ангилал</TableHead>
                  <TableHead className="text-right text-white/60">Үнэ</TableHead>
                  <TableHead className="text-white/60">Тэмдэглэгээ</TableHead>
                  <TableHead className="text-right text-white/60">Үйлдэл</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((item) => (
                  <TableRow key={item.id} className="border-white/10">
                    <TableCell>
                      <Photo
                        src={item.imageUrl ?? FOOD.hero}
                        alt={item.name}
                        className={`h-11 w-11 rounded-lg object-cover ${item.available ? '' : 'grayscale'}`}
                      />
                    </TableCell>
                    <TableCell>
                      <p className="font-medium text-white">{item.name}</p>
                      <p className="max-w-60 truncate text-xs text-white/50">{item.description}</p>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-white/80">{item.category}</TableCell>
                    <TableCell className="whitespace-nowrap text-right font-semibold text-white">
                      {fmtMNT(item.price)}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {item.spicy && (
                          <span className="rounded-full border border-red-400/30 bg-red-400/10 px-2 py-0.5 text-[11px] text-red-300">
                            Халуун
                          </span>
                        )}
                        {item.popular && (
                          <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 text-[11px] text-amber-300">
                            Онцлох
                          </span>
                        )}
                        {!item.available && (
                          <span className="rounded-full border border-white/20 bg-white/5 px-2 py-0.5 text-[11px] text-white/60">
                            Дууссан
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEdit(item)}
                          aria-label="Засварлах"
                          className="rounded p-1.5 text-white/70 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B4552D]"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(item)}
                          aria-label="Устгах"
                          className="rounded p-1.5 text-red-300 hover:bg-red-500/10 hover:text-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
      <DemoDataNote className="text-white/40" />

      {/* Үүсгэх/засварлах цонх */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="urgo-ui max-h-[90vh] overflow-y-auto nice-scroll bg-[#FFFDF8] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl" style={{ fontFamily: 'var(--font-lora),serif', color: GREEN }}>
              {editing ? 'Хоол засварлах' : 'Шинэ хоол нэмэх'}
            </DialogTitle>
            <DialogDescription>
              Цэсний бүртгэлийн мэдээллийг бөглөнө үү. Талбар *-тай нэр зайлшгүй.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3.5">
            <div className="space-y-1.5">
              <Label htmlFor="mi-name">Нэр *</Label>
              <Input
                id="mi-name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Жишээ: Бууз (3 ш)"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="mi-desc">Тайлбар</Label>
              <Textarea
                id="mi-desc"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                rows={2}
                placeholder="Нэг мөрөн дүрслэл — орц, амт, хэмжээ…"
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Ангилал *</Label>
                <Select value={form.category} onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}>
                  <SelectTrigger aria-label="Ангилал сонгох">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="mi-price">Үнэ (₮) *</Label>
                <Input
                  id="mi-price"
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: e.target.value.replace(/\D/g, '') }))}
                  inputMode="numeric"
                  placeholder="4500"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Зураг сонгох</Label>
              <Select
                value={form.imageUrl || '__none'}
                onValueChange={(v) => setForm((f) => ({ ...f, imageUrl: v === '__none' ? '' : v }))}
              >
                <SelectTrigger aria-label="Зураг сонгох">
                  <SelectValue placeholder="Зураг сонгох…" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none">Зураггүй</SelectItem>
                  {IMAGE_OPTIONS.map((o) => (
                    <SelectItem key={o.url} value={o.url}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.imageUrl ? (
                <Photo
                  src={form.imageUrl}
                  alt="Сонгосон зураг"
                  className="mt-2 h-24 w-full rounded-xl object-cover"
                />
              ) : (
                <div className="mt-2 grid h-24 w-full place-items-center rounded-xl border border-dashed text-xs text-muted-foreground">
                  Зураг сонгогдоогүй
                </div>
              )}
            </div>
            <div className="grid gap-3 rounded-xl border p-3.5 sm:grid-cols-3" style={{ borderColor: `${GREEN}22` }}>
              <label className="flex items-center justify-between gap-2 text-sm">
                <span className="flex items-center gap-1.5">
                  <ChefHat className="h-4 w-4 text-red-500" /> Халуун
                </span>
                <Switch
                  checked={form.spicy}
                  onCheckedChange={(c) => setForm((f) => ({ ...f, spicy: c }))}
                  aria-label="Халуун ногоотой эсэх"
                />
              </label>
              <label className="flex items-center justify-between gap-2 text-sm">
                <span className="flex items-center gap-1.5">
                  <ListOrdered className="h-4 w-4 text-green-600" /> Зардаг
                </span>
                <Switch
                  checked={form.available}
                  onCheckedChange={(c) => setForm((f) => ({ ...f, available: c }))}
                  aria-label="Зарах боломжтой эсэх"
                />
              </label>
              <label className="flex items-center justify-between gap-2 text-sm">
                <span className="flex items-center gap-1.5">
                  <ReceiptText className="h-4 w-4 text-amber-500" /> Онцлох
                </span>
                <Switch
                  checked={form.popular}
                  onCheckedChange={(c) => setForm((f) => ({ ...f, popular: c }))}
                  aria-label="Онцлох эсэх"
                />
              </label>
            </div>
          </div>

          <DialogFooter className="mt-2">
            <Button variant="outline" onClick={() => setFormOpen(false)} className="rounded-full">
              Болих
            </Button>
            <Button
              onClick={() => void save()}
              disabled={saving}
              className="rounded-full text-white"
              style={{ backgroundColor: TERRA }}
            >
              {editing ? 'Хадгалах' : 'Нэмэх'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDelete
        open={deleteTarget !== null}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        onConfirm={doDelete}
        title="Хоолыг устгах уу?"
        description={
          deleteTarget ? `"${deleteTarget.name}" — цэснээс бүрмөсөн хасагдана.` : ''
        }
      />
    </div>
  )
}

/* ────────────────────────── АДМИН ХУУДАС ────────────────────────── */

export function AdminPage() {
  const { authed, pass, logout } = useDemoAdminAuth('urgo-admin-ok')
  if (!authed)
    return (
      <div className="dark min-h-screen">
        <DemoAdminGate title="ӨРГӨӨ Админ" accent={TERRA} dark onPass={pass} backHref="/demo/urgo" />
      </div>
    )
  return <AdminInner onLogout={logout} />
}

function AdminInner({ onLogout }: { onLogout: () => void }) {
  const menu = useApi<MenuItemData>('menu-items')
  const orders = useApi<OrderData>('restaurant-orders')

  return (
    <div
      className="dark flex min-h-screen flex-col"
      style={{ fontFamily: 'var(--font-lora),serif', backgroundColor: GREEN_DEEP, color: '#EDE8DC' }}
    >
      <style>{`.urgo-ui{font-family:var(--font-inter),ui-sans-serif,system-ui,sans-serif}`}</style>
      <ReturnToMain accent={TERRA} dark />

      <header className="border-b border-white/10 bg-black/30">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between pl-[124px] pr-4 sm:pl-[210px]">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="whitespace-nowrap text-xl font-bold text-white">ӨРГӨӨ Админ</span>
            <span
              className="inline-block h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ backgroundColor: TERRA }}
              aria-hidden="true"
            />
            <span className="urgo-ui hidden rounded-full border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-300 sm:inline-block">
              Демо админ
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <DemoAdminLogoutButton dark onLogout={onLogout} />
            <button
              type="button"
              onClick={() => navigate('/demo/urgo')}
              aria-label="Ресторан руу буцах"
              className="urgo-ui inline-flex items-center gap-1.5 rounded-full border border-white/20 px-3 py-1.5 text-xs font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B4552D]"
            >
              <ArrowLeft className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span className="sr-only sm:not-sr-only">Ресторан руу буцах</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#A9C3B0]">
            ӨРГӨӨ · Удирдлагын самбар
          </p>
          <h1 className="mt-1 flex items-center gap-2 text-3xl font-bold text-white">
            <LayoutDashboard className="h-6 w-6" style={{ color: '#E8A287' }} />
            Тайлан ба захиалга
          </h1>
        </div>

        <Tabs defaultValue="stats">
          <TabsList className="urgo-ui mb-6 flex-wrap gap-1 bg-white/5">
            <TabsTrigger value="stats" className="data-[state=active]:text-white">
              Тайлан
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:text-white">
              Захиалга
            </TabsTrigger>
            <TabsTrigger value="menu" className="data-[state=active]:text-white">
              Цэс
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stats">
            {orders.loading || menu.loading ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[0, 1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-28 rounded-2xl bg-white/5" />
                ))}
              </div>
            ) : orders.error ? (
              <div className="rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-200">
                Мэдээлэл ачаалахад алдаа гарлаа. Хуудсыг дахин ачаална уу.
              </div>
            ) : (
              <StatsTab orders={orders.data} menuCount={menu.data.length} />
            )}
          </TabsContent>

          <TabsContent value="orders">
            <OrdersTab
              orders={orders.data}
              loading={orders.loading}
              update={orders.update}
              remove={orders.remove}
            />
          </TabsContent>

          <TabsContent value="menu">
            <MenuTab
              items={menu.data}
              loading={menu.loading}
              create={menu.create}
              update={menu.update}
              remove={menu.remove}
            />
          </TabsContent>
        </Tabs>
      </main>

      <footer className="urgo-ui border-t border-white/10 px-4 py-4 text-center text-xs text-white/40">
        ӨРГӨӨ Ресторан · Демо админ панель — бодит дата биш, Pixelmn жишээ төсөл
      </footer>
    </div>
  )
}
