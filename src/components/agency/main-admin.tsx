'use client'

import { useEffect, useMemo, useState } from 'react'
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart as RPieChart, ResponsiveContainer, Tooltip as RTooltip, XAxis, YAxis } from 'recharts'
import { ChartPie, Download, Eye, Info, Loader2, Save, Search, ShieldCheck, Trash2, TrendingUp } from 'lucide-react'
import { toast } from 'sonner'
import { useApi } from '@/lib/use-api'
import {
  ConfirmDelete,
  DemoDataNote,
  EmptyState,
  fmtDateTime,
  LoadingState,
  StatusBadge,
} from '@/components/shared/admin-kit'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { DEFAULT_PRICING, DISPLAY_FONT, type PricingPlan } from '@/config/agency'
import { DEMOS } from '@/config/demos'
import { LogoMark } from '@/components/agency/brand'
import { mergeContent, type SiteContent } from '@/lib/site-content'
import {
  BenefitsTab,
  FaqTab,
  GeneralTab,
  PartnersTab,
  ServicesTab,
  StepsTab,
  type SaveSiteContent,
} from '@/components/agency/admin-content'

type Inquiry = {
  id: string
  name: string
  email: string
  company?: string | null
  serviceType: string
  budget: string
  details: string
  status: string
  createdAt: string
  updatedAt: string
}

type SiteContentRow = {
  id: string
  key: string
  label?: string | null
  value: unknown
}

const INQUIRY_STATUSES = ['шинэ', 'хариулсан', 'хаагдсан'] as const

/** ───────────────── CSV экспорт (клиент талд) ───────────────── */
const CSV_HEADERS = ['Нэр', 'Имэйл', 'Компани', 'Үйлчилгээ', 'Төсөв', 'Мессеж', 'Огноо']

/** CSV мөрийн утгыг хашилтад бүүж, доторх хашилтыг хослуулна (Excel зөв уншихын тулд) */
function csvEscape(value: unknown): string {
  return `"${String(value ?? '').replace(/"/g, '""')}"`
}

/** Шүүгдсэн хүсэлтүүдийг UTF-8 BOM-той CSV болгоно — Excel-д кирилл зөв харагдана */
function buildInquiriesCsv(rows: Inquiry[]): string {
  const lines = [CSV_HEADERS.map(csvEscape).join(',')]
  for (const r of rows) {
    lines.push(
      [r.name, r.email, r.company ?? '', r.serviceType, r.budget, r.details, fmtDateTime(r.createdAt)]
        .map(csvEscape)
        .join(',')
    )
  }
  return '\uFEFF' + lines.join('\r\n')
}

/** CSV файлыг шууд татна (Blob + a.download) */
function downloadInquiriesCsv(rows: Inquiry[]) {
  const blob = new Blob([buildInquiriesCsv(rows)], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'pixelmn-inquiries.csv'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/** site-content value → багцын массив (хүчинтэй бол) */
function parsePlans(raw: unknown): PricingPlan[] | null {
  try {
    const v = typeof raw === 'string' ? JSON.parse(raw) : raw
    if (!Array.isArray(v) || v.length === 0) return null
    const plans = v
      .filter((p): p is Record<string, unknown> => !!p && typeof p === 'object')
      .map((p) => ({
        name: typeof p.name === 'string' ? p.name : '',
        price:
          typeof p.price === 'number'
            ? p.price
            : typeof p.price === 'string' && p.price.trim()
              ? p.price.trim()
              : undefined,
        priceLabel: typeof p.priceLabel === 'string' ? p.priceLabel : undefined,
        description: typeof p.description === 'string' ? p.description : '',
        features: Array.isArray(p.features) ? p.features.map((f) => String(f)) : [],
        highlight: Boolean(p.highlight),
      }))
      .filter((p) => p.name.length > 0 && p.features.length > 0)
    return plans.length > 0 ? plans : null
  } catch {
    return null
  }
}

/** '400,000' / '400000₮' гэх мэт утгыг тоо болгох, эс тэгвэл текстээр үлдээнэ */
function coercePrice(input: string): number | string | undefined {
  const t = input.trim()
  if (!t) return undefined
  const digits = t.replace(/[,\s₮]/g, '')
  if (/^\d+$/.test(digits)) return Number(digits)
  return t
}

/**
 * ───────────────── Үндсэн сайтын хамгаалагдсан админ ─────────────────
 * Энэ компонент зөвхөн сервер талд сесс шалгагдсаны дараа (app/admin/page.tsx)
 * render болно. Бичих бүх API дуудлага нь httpOnly сесс cookie-г автоматаар
 * дагуулна (same-origin fetch).
 */
export function MainAdmin() {
  const contentApi = useApi<SiteContentRow>('site-content')
  const [loggingOut, setLoggingOut] = useState(false)

  const contentRow = useMemo(
    () => contentApi.data.find((c) => c.key === 'content') ?? null,
    [contentApi.data]
  )
  const content: SiteContent = useMemo(
    () => mergeContent(contentRow?.value ?? null),
    [contentRow]
  )

  /** Бүх контентын табуудын нийтлэг хадгалагч — нэг л бичилт (key='content') руу бичнэ */
  const saveContent: SaveSiteContent = async (next) => {
    if (contentRow) {
      await contentApi.update(contentRow.id, { value: next })
    } else {
      await contentApi.create({ key: 'content', label: 'Сайтын контент', value: next })
    }
  }

  const logout = async () => {
    setLoggingOut(true)
    try {
      await fetch('/api/admin/logout', { method: 'POST' })
    } catch {
      /* сүлжээний алдаа ч гэсэн локал төлөвөө цэвэрлэнэ */
    }
    window.location.href = '/'
  }

  return (
    <div
      className="flex min-h-screen flex-col bg-[#F2F1EE]"
      style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
    >
      <header className="sticky top-0 z-40 border-b border-black/[0.08] bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            <LogoMark size={28} />
            <span style={DISPLAY_FONT} className="text-[15px] font-extrabold tracking-tight">
              PIXELMN <span className="font-semibold text-black/40">Админ</span>
            </span>
            <Badge className="hidden items-center gap-1 border-transparent bg-emerald-50 text-[10.5px] font-bold text-emerald-700 sm:inline-flex">
              <ShieldCheck className="h-3 w-3" aria-hidden="true" />
              Хамгаалагдсан
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={logout}
              disabled={loggingOut}
              className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-3.5 py-1.5 text-[12.5px] font-semibold text-black/70 transition-colors hover:bg-[#F2F1EE] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E4572E]/60 disabled:opacity-60"
            >
              {loggingOut ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
              Гарах
            </button>
            <a
              href="/"
              className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-3.5 py-1.5 text-[12.5px] font-semibold text-black/70 transition-colors hover:bg-[#F2F1EE] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E4572E]/60"
            >
              ← Сайт руу буцах
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3.5">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
          <p className="text-[13px] leading-relaxed text-emerald-800">
            Энэ панель нь сервер талын нууц үгээр хамгаалагдсан. Энд хийсэн өөрчлөлт шууд
            хадгалагдаж, нийтийн сайтад харагдана. Сесс 12 цагийн дараа автоматаар дуусна.
          </p>
        </div>

        {/* Демо багцын админ панелууд — 6 демо вэбсайтын удирдлага руу шууд холбоос */}
        <section aria-labelledby="demo-admin-links-title" className="mb-6">
          <p
            id="demo-admin-links-title"
            className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-black/40"
          >
            Демо багцын админ панелууд
          </p>
          <div className="nice-scroll -mx-1 flex gap-2 overflow-x-auto px-1 pb-1.5">
            {DEMOS.map((d) => (
              <a
                key={d.id}
                href={`/#/demo/${d.id}/admin`}
                aria-label={`${d.name} — админ панель нээх`}
                className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-black/[0.08] bg-white py-2 pl-3 pr-4 text-[12.5px] font-semibold text-black/70 transition-all hover:-translate-y-0.5 hover:border-black/20 hover:text-[#0B0B0C] hover:shadow-[0_8px_20px_-12px_rgba(11,11,12,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E4572E]/60"
              >
                <span
                  className="h-2.5 w-2.5 rounded-full ring-2 ring-black/[0.04] transition-transform group-hover:scale-110"
                  style={{ backgroundColor: d.accent }}
                  aria-hidden="true"
                />
                {d.name}
                <ShieldCheck
                  className="h-3.5 w-3.5 text-black/25 transition-colors group-hover:text-[#E4572E]"
                  aria-hidden="true"
                />
              </a>
            ))}
          </div>
          <p className="mt-1.5 text-[11.5px] text-black/40">
            Демо панелууд таны одоогийн админ сессээр ажиллана — тусдаа нэвтрэлт шаардлагагүй.
          </p>
        </section>

        <Tabs defaultValue="inquiries">
          <TabsList className="nice-scroll h-11 max-w-full overflow-x-auto rounded-xl border border-black/[0.08] bg-white p-1">
            <TabsTrigger value="inquiries" className="rounded-lg px-4">
              Хүсэлтүүд
            </TabsTrigger>
            <TabsTrigger value="general" className="rounded-lg px-4">
              Ерөнхий
            </TabsTrigger>
            <TabsTrigger value="services" className="rounded-lg px-4">
              Үйлчилгээ
            </TabsTrigger>
            <TabsTrigger value="benefits" className="rounded-lg px-4">
              Давуу тал
            </TabsTrigger>
            <TabsTrigger value="steps" className="rounded-lg px-4">
              Ажлын урсгал
            </TabsTrigger>
            <TabsTrigger value="faq" className="rounded-lg px-4">
              ТҮА
            </TabsTrigger>
            <TabsTrigger value="partners" className="rounded-lg px-4">
              Хамтын ажиллагаа
            </TabsTrigger>
            <TabsTrigger value="pricing" className="rounded-lg px-4">
              Үнийн санал
            </TabsTrigger>
          </TabsList>

          <TabsContent value="inquiries" className="mt-6">
            <InquiriesTab />
          </TabsContent>

          <TabsContent value="general" className="mt-6">
            <ContentGate loading={contentApi.loading}>
              <GeneralTab content={content} onSave={saveContent} />
            </ContentGate>
          </TabsContent>
          <TabsContent value="services" className="mt-6">
            <ContentGate loading={contentApi.loading}>
              <ServicesTab content={content} onSave={saveContent} />
            </ContentGate>
          </TabsContent>
          <TabsContent value="benefits" className="mt-6">
            <ContentGate loading={contentApi.loading}>
              <BenefitsTab content={content} onSave={saveContent} />
            </ContentGate>
          </TabsContent>
          <TabsContent value="steps" className="mt-6">
            <ContentGate loading={contentApi.loading}>
              <StepsTab content={content} onSave={saveContent} />
            </ContentGate>
          </TabsContent>
          <TabsContent value="faq" className="mt-6">
            <ContentGate loading={contentApi.loading}>
              <FaqTab content={content} onSave={saveContent} />
            </ContentGate>
          </TabsContent>
          <TabsContent value="partners" className="mt-6">
            <ContentGate loading={contentApi.loading}>
              <PartnersTab content={content} onSave={saveContent} />
            </ContentGate>
          </TabsContent>

          <TabsContent value="pricing" className="mt-6">
            <PricingTab
              contents={contentApi.data}
              loading={contentApi.loading}
              update={contentApi.update}
              create={contentApi.create}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

/** Контент ачаалагдтал хүлээгээд табыг гаргана */
function ContentGate({ loading, children }: { loading: boolean; children: React.ReactNode }) {
  if (loading) return <LoadingState label="Контентыг ачаалж байна…" />
  return <>{children}</>
}

/** ───────────────── Сарын хандлагын график ───────────────── */

const MONTH_NAMES = ['1-р сар', '2-р сар', '3-р сар', '4-р сар', '5-р сар', '6-р сар', '7-р сар', '8-р сар', '9-р сар', '10-р сар', '11-р сар', '12-р сар']

function MonthlyTrend({ inquiries }: { inquiries: Inquiry[] }) {
  // Сүүлийн 6 сарын хүсэлтийн тоо (шуудангийн санах ойн demo өгөгдөлд суурилна)
  const trend = useMemo(() => {
    const now = new Date()
    const months: { month: string; count: number; key: string }[] = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = `${d.getFullYear()}-${d.getMonth()}`
      months.push({
        key,
        month: MONTH_NAMES[d.getMonth()],
        count: inquiries.filter((r) => {
          const c = new Date(r.createdAt)
          return c.getFullYear() === d.getFullYear() && c.getMonth() === d.getMonth()
        }).length,
      })
    }
    return months
  }, [inquiries])

  const total6 = trend.reduce((s, m) => s + m.count, 0)
  const thisMonth = trend[trend.length - 1]?.count ?? 0
  const prevMonth = trend[trend.length - 2]?.count ?? 0
  const delta = thisMonth - prevMonth

  return (
    <div className="rounded-2xl border border-black/[0.08] bg-white p-4 sm:p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 text-[14px] font-bold text-[#0B0B0C]">
          <TrendingUp className="h-4 w-4 text-[#E4572E]" aria-hidden="true" />
          Хүсэлтийн сарын хандлага
        </h3>
        <span className="text-[12px] font-medium text-black/45">
          Сүүлийн 6 сар · нийт {total6}
        </span>
      </div>
      {inquiries.length === 0 ? (
        <EmptyState
          title="Мэдээлэл байхгүй"
          description="Хүсэлт ирснээр хандлагын график энд гарна."
        />
      ) : (
        <>
          <div className="h-48 w-full" role="img" aria-label="Сүүлийн 6 сарын хүсэлтийн тооны багана диаграмм">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trend} margin={{ top: 6, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="rgba(11,11,12,0.07)" />
                <XAxis
                  dataKey="month"
                  tick={{ fill: 'rgba(11,11,12,0.5)', fontSize: 11 }}
                  axisLine={{ stroke: 'rgba(11,11,12,0.12)' }}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fill: 'rgba(11,11,12,0.5)', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={40}
                />
                <RTooltip
                  cursor={{ fill: 'rgba(11,11,12,0.04)' }}
                  contentStyle={{
                    background: '#fff',
                    border: '1px solid rgba(11,11,12,0.12)',
                    borderRadius: 12,
                    fontSize: 12,
                    color: '#0B0B0C',
                  }}
                  formatter={(value) => [`${value} хүсэлт`, '']}
                  labelFormatter={(label) => String(label)}
                />
                <Bar dataKey="count" fill="#E4572E" radius={[5, 5, 0, 0]} maxBarSize={42} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-[12px] text-black/45">
            Энэ сар: <span className="font-bold text-[#0B0B0C]">{thisMonth}</span>
            {trend.length > 1 && (
              <>
                {' · өмнөх сараас '}
                <span className={`font-bold ${delta >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                  {delta > 0 ? `+${delta}` : delta}
                </span>
              </>
            )}
          </p>
        </>
      )}
    </div>
  )
}

/** ───────────────── Үйлчилгээний эзлэх хувийн диаграмм ───────────────── */

const PIE_COLORS = ['#E4572E', '#2B2926', '#C9973B', '#6E6A63', '#A8B5A0', '#D98E6A']

function ServicePie({ inquiries }: { inquiries: Inquiry[] }) {
  const slices = useMemo(() => {
    const counts = new Map<string, number>()
    for (const r of inquiries) counts.set(r.serviceType, (counts.get(r.serviceType) ?? 0) + 1)
    return [...counts.entries()]
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
  }, [inquiries])
  const total = slices.reduce((s, x) => s + x.value, 0)

  return (
    <div className="rounded-2xl border border-black/[0.08] bg-white p-4 sm:p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 text-[14px] font-bold text-[#0B0B0C]">
          <ChartPie className="h-4 w-4 text-[#E4572E]" aria-hidden="true" />
          Үйлчилгээний эзлэх хувь
        </h3>
        <span className="text-[12px] font-medium text-black/45">Бүх хугацаа · {total} хүсэлт</span>
      </div>
      {slices.length === 0 ? (
        <EmptyState
          title="Мэдээлэл байхгүй"
          description="Хүсэлт ирснээр эзлэх хувийн график энд гарна."
        />
      ) : (
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <div
            className="relative h-44 w-full max-w-[240px]"
            role="img"
            aria-label="Үйлчилгээ тус бүрийн хүсэлтийн эзлэх хувийн тойрог диаграмм"
          >
            <ResponsiveContainer width="100%" height="100%">
              <RPieChart>
                <Pie
                  data={slices}
                  dataKey="value"
                  nameKey="name"
                  innerRadius="62%"
                  outerRadius="92%"
                  paddingAngle={3}
                  stroke="#fff"
                  strokeWidth={2}
                >
                  {slices.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <RTooltip
                  contentStyle={{
                    background: '#fff',
                    border: '1px solid rgba(11,11,12,0.12)',
                    borderRadius: 12,
                    fontSize: 12,
                    color: '#0B0B0C',
                  }}
                  formatter={(value, name) => [`${value} хүсэлт`, String(name)]}
                />
              </RPieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-[#0B0B0C]">{total}</span>
              <span className="text-[11px] text-black/45">хүсэлт</span>
            </div>
          </div>
          <ul className="w-full flex-1 space-y-2">
            {slices.map((s, i) => (
              <li key={s.name} className="flex items-center gap-2.5 text-[13px]">
                <span
                  className="h-3 w-3 shrink-0 rounded-[4px]"
                  style={{ background: PIE_COLORS[i % PIE_COLORS.length] }}
                  aria-hidden="true"
                />
                <span className="min-w-0 flex-1 truncate font-medium text-[#0B0B0C]">{s.name}</span>
                <span className="shrink-0 tabular-nums text-black/55">
                  {s.value} · {total ? Math.round((s.value / total) * 100) : 0}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

/** ───────────────── Таб 1: Хүсэлтүүд ───────────────── */
function InquiriesTab() {
  const { data, loading, error, reload, update, remove } = useApi<Inquiry>('inquiries')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('бүгд')
  const [selected, setSelected] = useState<Inquiry | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Inquiry | null>(null)
  const [busy, setBusy] = useState(false)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return data.filter((r) => {
      const matchQ =
        !q ||
        r.name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        (r.company ?? '').toLowerCase().includes(q)
      const matchS = statusFilter === 'бүгд' || r.status === statusFilter
      return matchQ && matchS
    })
  }, [data, search, statusFilter])

  const newCount = data.filter((r) => r.status === 'шинэ').length
  const answeredCount = data.filter((r) => r.status === 'хариулсан').length

  const exportCsv = () => {
    if (filtered.length === 0) {
      toast.error('Экспортлох хүсэлт олдсонгүй.')
      return
    }
    try {
      downloadInquiriesCsv(filtered)
      toast.success(`${filtered.length} хүсэлт экспортлогдлоо.`)
    } catch {
      toast.error('CSV файл үүсгэхэд алдаа гарлаа.')
    }
  }

  const changeStatus = async (inquiry: Inquiry, status: string) => {
    setBusy(true)
    try {
      await update(inquiry.id, { status })
      setSelected((s) => (s && s.id === inquiry.id ? { ...s, status } : s))
      toast.success('Төлөв шинэчлэгдлээ.')
    } catch {
      toast.error('Төлөв шинэчлэхэд алдаа гарлаа.')
    } finally {
      setBusy(false)
    }
  }

  const confirmDelete = async (inquiry: Inquiry) => {
    setBusy(true)
    try {
      await remove(inquiry.id)
      setSelected((s) => (s && s.id === inquiry.id ? null : s))
      toast.success('Хүсэлтийг устгалаа.')
    } catch {
      toast.error('Устгахад алдаа гарлаа.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex flex-col gap-5">
      {/* статистик */}
      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label="Нийт хүсэлт" value={data.length} />
        <StatCard label="Шинэ хүсэлт" value={newCount} accent />
        <StatCard label="Хариулсан" value={answeredCount} />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <MonthlyTrend inquiries={data} />
        <ServicePie inquiries={data} />
      </div>

      {/* хайлт + шүүлтүүр */}
      <div className="flex flex-col gap-3 rounded-2xl border border-black/[0.08] bg-white p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/35" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Нэр, имэйл, компаниар хайх…"
            aria-label="Хүсэлт хайх"
            className="h-10 rounded-xl pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-10 w-full rounded-xl sm:w-[190px]" aria-label="Төлөвөөр шүүх">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="бүгд">Бүх төлөв</SelectItem>
            {INQUIRY_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={reload}
            className="h-10 rounded-xl border-black/10"
            aria-label="Жагсаалт шинэчлэх"
          >
            Шинэчлэх
          </Button>
          <Button
            variant="outline"
            onClick={exportCsv}
            disabled={!loading && data.length === 0}
            className="h-10 rounded-xl border-black/10"
            aria-label="Шүүлтүүрт таарах хүсэлтүүдийг CSV файлаар татах"
          >
            <Download className="h-4 w-4" />
            CSV татах
          </Button>
        </div>
      </div>

      <DemoDataNote />

      {/* хүснэгт */}
      <div className="rounded-2xl border border-black/[0.08] bg-white">
        {loading ? (
          <LoadingState label="Хүсэлтүүдийг ачаалж байна…" />
        ) : error ? (
          <EmptyState
            title="Ачаалахад алдаа гарлаа"
            description={error}
            action={
              <Button variant="outline" onClick={reload}>
                Дахин оролдох
              </Button>
            }
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="Хүсэлт олдсонгүй"
            description={
              data.length === 0
                ? 'Одоогоор ирсэн хүсэлт байхгүй. Нийтийн сайтад маягт бөглөснөөр энд харагдана.'
                : 'Хайлт, шүүлтүүрийн нөхцөлд тохирох хүсэлт байхгүй.'
            }
          />
        ) : (
          <div className="overflow-x-auto nice-scroll">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Нэр</TableHead>
                  <TableHead>Имэйл</TableHead>
                  <TableHead className="hidden md:table-cell">Компани</TableHead>
                  <TableHead className="hidden lg:table-cell">Үйлчилгээ</TableHead>
                  <TableHead className="hidden lg:table-cell">Төсөв</TableHead>
                  <TableHead className="hidden sm:table-cell">Огноо</TableHead>
                  <TableHead>Төлөв</TableHead>
                  <TableHead className="text-right">Үйлдэл</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="max-w-[160px] truncate font-medium">{r.name}</TableCell>
                    <TableCell className="max-w-[200px] truncate text-black/60">
                      {r.email}
                    </TableCell>
                    <TableCell className="hidden max-w-[150px] truncate text-black/60 md:table-cell">
                      {r.company || '—'}
                    </TableCell>
                    <TableCell className="hidden max-w-[180px] truncate text-black/60 lg:table-cell">
                      {r.serviceType}
                    </TableCell>
                    <TableCell className="hidden max-w-[150px] truncate text-black/60 lg:table-cell">
                      {r.budget}
                    </TableCell>
                    <TableCell className="hidden whitespace-nowrap text-black/50 sm:table-cell">
                      {fmtDateTime(r.createdAt)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={r.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`${r.name} — дэлгэрэнгүй харах`}
                        onClick={() => setSelected(r)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`${r.name} — устгах`}
                        onClick={() => setDeleteTarget(r)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* дэлгэрэнгүй диалог */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto rounded-2xl sm:max-w-lg nice-scroll">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle style={DISPLAY_FONT} className="text-left text-xl font-extrabold tracking-tight">
                  {selected.name}
                </DialogTitle>
                <DialogDescription className="text-left">
                  {fmtDateTime(selected.createdAt)}-д илгээсэн хүсэлт
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-[110px_1fr] gap-x-4 gap-y-3 text-[13.5px]">
                <span className="text-black/45">Имэйл</span>
                <span className="break-all font-medium">{selected.email}</span>
                <span className="text-black/45">Компани</span>
                <span className="font-medium">{selected.company || '—'}</span>
                <span className="text-black/45">Үйлчилгээ</span>
                <span className="font-medium">{selected.serviceType}</span>
                <span className="text-black/45">Төсөв</span>
                <span className="font-medium">{selected.budget}</span>
                <span className="text-black/45">Мэдээлэл</span>
                <span className="whitespace-pre-wrap rounded-xl border border-black/[0.08] bg-[#FAFAF8] p-3 leading-relaxed text-black/70">
                  {selected.details}
                </span>
              </div>

              <div className="mt-2 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-black/[0.08] p-3.5">
                <div className="flex items-center gap-2.5">
                  <Label className="text-[12.5px] text-black/50">Төлөв:</Label>
                  <Select
                    value={selected.status}
                    onValueChange={(v) => changeStatus(selected, v)}
                    disabled={busy}
                  >
                    <SelectTrigger className="h-9 w-[150px] rounded-lg" aria-label="Төлөв өөрчлөх">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {INQUIRY_STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {busy && <Loader2 className="h-4 w-4 animate-spin text-black/40" />}
                </div>
                <StatusBadge status={selected.status} />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDelete
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        onConfirm={() => deleteTarget && confirmDelete(deleteTarget)}
        title="Хүсэлтийг устгах уу?"
        description={`«${deleteTarget?.name}» хүсэлт бүрмөсөн устагдана. Энэ үйлдлийг буцаах боломжгүй.`}
      />
    </div>
  )
}

function StatCard({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div
      className={
        accent
          ? 'rounded-2xl border border-[#E4572E]/30 bg-[#E4572E]/[0.06] p-4'
          : 'rounded-2xl border border-black/[0.08] bg-white p-4'
      }
    >
      <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-black/45">
        {label}
      </p>
      <p style={DISPLAY_FONT} className="mt-1 text-2xl font-extrabold tracking-tight">
        {value}
      </p>
    </div>
  )
}

/** ───────────────── Таб: Үнийн санал засварлах ───────────────── */
function PricingTab({
  contents,
  loading,
  update,
  create,
}: {
  contents: SiteContentRow[]
  loading: boolean
  update: (id: string, payload: Record<string, unknown>) => Promise<unknown>
  create: (payload: Record<string, unknown>) => Promise<unknown>
}) {
  const [plans, setPlans] = useState<PricingPlan[] | null>(null)
  const [saving, setSaving] = useState(false)

  const pricingRow = useMemo(
    () => contents.find((c) => c.key === 'pricing') ?? null,
    [contents]
  )

  // анх удаа ачааллахад өгөгдлийн сангийн утга байвал түүнийг, үгүй бол конфигийн анхдагч утгыг ашиглана
  useEffect(() => {
    if (loading) return
    setPlans((prev) => prev ?? parsePlans(pricingRow?.value) ?? DEFAULT_PRICING)
  }, [loading, pricingRow])

  if (loading || !plans) {
    return <LoadingState label="Үнийн саналыг ачаалж байна…" />
  }

  const patch = (index: number, patchValues: Partial<PricingPlan>) => {
    setPlans((prev) => prev!.map((p, i) => (i === index ? { ...p, ...patchValues } : p)))
  }

  const save = async () => {
    if (plans.some((p) => !p.name.trim())) {
      toast.error('Багцын нэр хоосон байна. Бүх багцад нэр оруулна уу.')
      return
    }
    setSaving(true)
    const value = plans.map((p) => ({
      name: p.name.trim(),
      price: coercePrice(String(p.price ?? '')),
      priceLabel: p.priceLabel?.trim() || undefined,
      description: p.description,
      features: p.features.filter((f) => f.trim().length > 0),
      highlight: p.highlight,
    }))
    try {
      if (pricingRow) {
        await update(pricingRow.id, { value })
      } else {
        await create({ key: 'pricing', label: 'Үнийн санал', value })
      }
      toast.success('Хадгалагдлаа — үнийн санал нийтийн сайтад шууд харагдана.')
    } catch {
      toast.error('Хадгалахад алдаа гарлаа. Дахин оролдоно уу.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-2xl border border-black/[0.08] bg-white p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 style={DISPLAY_FONT} className="text-lg font-extrabold tracking-tight">
              Үнийн саналын багцууд
            </h2>
            <p className="mt-1 text-[12.5px] text-black/50">
              Энэ өөрчлөлт нийтийн үнийн санал хэсэгт шууд харагдана. Үнийн талбарт тоо (жишээ:
              400000) эсвэл текст («Үнийн санал авах») бичиж болно.
            </p>
          </div>
          <Button
            onClick={save}
            disabled={saving}
            className="h-10 rounded-xl bg-[#E4572E] font-bold text-white hover:bg-[#d24a22]"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Хадгалж байна…
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Хадгалах
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {plans.map((plan, i) => (
          <div key={i} className="flex flex-col gap-4 rounded-2xl border border-black/[0.08] bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <p
                style={DISPLAY_FONT}
                className="text-[13px] font-bold uppercase tracking-[0.14em] text-black/40"
              >
                Багц {i + 1}
              </p>
              {plan.highlight && (
                <Badge className="border-transparent bg-[#E4572E]/10 text-[10.5px] font-bold text-[#E4572E]">
                  Хамгийн түгээмэл
                </Badge>
              )}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label className="text-[12.5px] font-semibold text-black/60">Нэр</Label>
                <Input
                  value={plan.name}
                  onChange={(e) => patch(i, { name: e.target.value })}
                  className="h-10 rounded-xl"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-[12.5px] font-semibold text-black/60">Үнэ / шошго</Label>
                <Input
                  value={String(plan.price ?? '')}
                  onChange={(e) => patch(i, { price: e.target.value })}
                  placeholder="400000 эсвэл Үнийн санал авах"
                  className="h-10 rounded-xl"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-[12.5px] font-semibold text-black/60">
                Үнийн доорх жижиг тайлбар (сонголттой)
              </Label>
              <Input
                value={plan.priceLabel ?? ''}
                onChange={(e) => patch(i, { priceLabel: e.target.value })}
                placeholder="эхлэн үнэ"
                className="h-10 rounded-xl"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-[12.5px] font-semibold text-black/60">Тайлбар</Label>
              <Textarea
                rows={2}
                value={plan.description}
                onChange={(e) => patch(i, { description: e.target.value })}
                className="rounded-xl"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-[12.5px] font-semibold text-black/60">
                Багтсан зүйлс (мөр бүрт нэг)
              </Label>
              <Textarea
                rows={6}
                value={plan.features.join('\n')}
                onChange={(e) => patch(i, { features: e.target.value.split('\n') })}
                className="rounded-xl"
              />
            </div>

            <label className="flex w-fit cursor-pointer items-center gap-2.5 text-[13px] font-medium text-black/60">
              <input
                type="checkbox"
                checked={!!plan.highlight}
                onChange={(e) => patch(i, { highlight: e.target.checked })}
                className="h-4 w-4 accent-[#E4572E]"
              />
              Тодруулсан багц болгох («Хамгийн түгээмэл» бэйдж)
            </label>
          </div>
        ))}
      </div>
    </div>
  )
}
