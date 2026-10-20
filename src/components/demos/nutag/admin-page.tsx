'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { navigate } from '@/lib/hash-router'
import { useApi } from '@/lib/use-api'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
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
  SelectGroup,
  SelectItem,
  SelectLabel,
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
import {
  ConfirmDelete,
  DemoDataNote,
  EmptyState,
  LoadingState,
  StatusBadge,
  fmtDate,
  fmtMNT,
} from '@/components/shared/admin-kit'
import { DemoAdminGate, DemoAdminLogoutButton, useDemoAdminAuth } from '@/components/shared/demo-gate'
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  ClipboardList,
  Eye,
  History,
  Package,
  PackagePlus,
  Pencil,
  Search,
  Trash2,
  TrendingUp,
  TriangleAlert,
  Wallet,
} from 'lucide-react'
import {
  CATEGORIES,
  CATEGORY_LABEL,
  IMG,
  IMG_LABELS,
  INK,
  INK_SOFT,
  LINE,
  OLIVE,
  ORDER_STATUSES,
  nextStatus,
  orderCode,
  readStockLog,
  type Product,
  type ProductOption,
  type ShopOrder,
  type StockLogEntry,
} from './constants'
import { Photo } from './ui'

const PANEL_BG = '#F5F3EA'
const PANEL_CARD = '#FFFFFF'
const PANEL_LINE = '#E4DFCE'
const ADMIN_DARK = '#26231D'
const OLIVE_LIGHT = '#C6D2A4'

type TabKey = 'report' | 'products' | 'orders'

const TABS: { key: TabKey; label: string; icon: typeof BarChart3 }[] = [
  { key: 'report', label: 'Тайлан', icon: BarChart3 },
  { key: 'products', label: 'Бүтээгдэхүүн', icon: Package },
  { key: 'orders', label: 'Захиалга', icon: ClipboardList },
]

const sameDay = (iso?: string) => {
  if (!iso) return false
  return new Date(iso).toDateString() === new Date().toDateString()
}

// ══════════════════ ҮЛДЭГДЛИЙН ХАНДЛАГА (график) ══════════════════

const fmtTick = (iso: string) => {
  const d = new Date(iso)
  return `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

/** stockLog-оос цаг хугацааны цуврал үүсгэнэ: from → to → одоогийн үлдэгдэл */
function buildStockSeries(p: Product): { label: string; stock: number; detail: string }[] {
  const log = readStockLog(p.meta).slice().reverse() // хуучинаас шинэ рүү
  const pts: { label: string; stock: number; detail: string }[] = []
  for (const e of log) {
    pts.push({ label: fmtTick(e.at), stock: e.from, detail: fmtTick(e.at) })
    pts.push({ label: fmtTick(e.at), stock: e.to, detail: fmtTick(e.at) })
  }
  pts.push({ label: 'Одоо', stock: p.stock, detail: 'Одоогийн үлдэгдэл' })
  return pts
}

function StockTrendChart({ products }: { products: Product[] }) {
  const withLog = useMemo(() => products.filter((p) => readStockLog(p.meta).length > 0), [products])
  const [selId, setSelId] = useState<string | null>(null)
  const active = withLog.find((p) => p.id === selId) ?? withLog[0]

  return (
    <div className="mt-4 rounded-2xl border bg-white p-4" style={{ borderColor: PANEL_LINE }}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h3 className="nutag-display font-extrabold" style={{ color: INK }}>
            Үлдэгдлийн хандлага
          </h3>
          <TrendingUp className="h-4 w-4" style={{ color: INK_SOFT }} aria-hidden="true" />
        </div>
        {withLog.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5" role="tablist" aria-label="Бүтээгдэхүүн сонгох">
            {withLog.slice(0, 5).map((p) => {
              const on = active?.id === p.id
              return (
                <button
                  key={p.id}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => setSelId(p.id)}
                  className={`max-w-44 truncate rounded-full border px-3 py-1 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8A9B5C] ${
                    on ? 'border-transparent text-white' : 'bg-transparent hover:bg-black/5'
                  }`}
                  style={on ? { backgroundColor: OLIVE, color: '#fff' } : { borderColor: PANEL_LINE, color: INK_SOFT }}
                >
                  {p.name}
                </button>
              )
            })}
            {withLog.length > 5 && (
              <span className="text-xs" style={{ color: INK_SOFT }}>
                +{withLog.length - 5}
              </span>
            )}
          </div>
        )}
      </div>

      {!active ? (
        <p className="mt-3 rounded-xl border border-dashed px-4 py-6 text-center text-sm" style={{ borderColor: PANEL_LINE, color: INK_SOFT }}>
          График нь үлдэгдлийн өөрчлөлт бүртгэгдсэнээр үүснэ. Хүснэгтээс үлдэгдэл засаж үзээрэй.
        </p>
      ) : (
        <div className="mt-4 h-52 w-full" aria-label={`${active.name} — үлдэгдлийн график`}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={buildStockSeries(active)} margin={{ top: 6, right: 12, bottom: 0, left: -18 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EDE9DC" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: INK_SOFT }}
                tickLine={false}
                axisLine={{ stroke: PANEL_LINE }}
                interval="preserveStartEnd"
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 11, fill: INK_SOFT }}
                tickLine={false}
                axisLine={false}
                domain={[0, (max: number) => Math.max(4, max + 1)]}
              />
              <Tooltip
                formatter={(v) => [`${v} ш`, 'Үлдэгдэл']}
                labelFormatter={(_l, payload) =>
                  (payload?.[0]?.payload as { detail?: string } | undefined)?.detail ?? String(_l)
                }
                contentStyle={{
                  borderRadius: 12,
                  border: `1px solid ${PANEL_LINE}`,
                  fontSize: 12,
                  boxShadow: '0 6px 24px rgba(38,35,29,0.08)',
                }}
              />
              <Line
                type="stepAfter"
                dataKey="stock"
                stroke={OLIVE}
                strokeWidth={2.5}
                dot={{ r: 3.5, fill: OLIVE, strokeWidth: 0 }}
                activeDot={{ r: 5, fill: '#485531' }}
                isAnimationActive
                animationDuration={500}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

// ── Үлдэгдлийг шууд засах нүд ────────────────────────────────────────────────
function StockCell({ product, onSave }: { product: Product; onSave: (v: number) => void }) {
  const [val, setVal] = useState(String(product.stock))

  const commit = () => {
    const n = Number(val)
    if (val.trim() === '' || Number.isNaN(n) || n < 0) {
      setVal(String(product.stock))
      toast.error('Үлдэгдэл 0 буюу түүнээс дээш бүхэл тоо байх ёстой.')
      return
    }
    if (Math.round(n) === product.stock) return
    onSave(Math.round(n))
  }

  const critical = product.stock <= 0
  const low = !critical && product.stock <= 3

  return (
    <input
      type="number"
      min={0}
      value={val}
      onChange={(e) => setVal(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault()
          ;(e.target as HTMLInputElement).blur()
        }
      }}
      aria-label={`${product.name} — үлдэгдэл засах${critical ? ' (дууссан)' : low ? ' (үлдэгдэл бага)' : ''}`}
      title={critical ? 'Дууссан' : low ? 'Үлдэгдэл бага' : undefined}
      className="no-spin w-16 rounded-lg border bg-white px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#5A6B3F]"
      style={{
        borderColor: critical ? '#C24A2E' : low ? '#C08A2D' : PANEL_LINE,
        color: INK,
        fontWeight: critical || low ? 700 : 400,
        backgroundColor: critical ? '#FBEDE8' : low ? '#FBF5E6' : '#fff',
      }}
    />
  )
}

// ── Бүтээгдэхүүн үүсгэх/засах диалог ─────────────────────────────────────────
type OptionRow = { name: string; values: string }

function ProductDialog({
  open,
  editing,
  onClose,
  onCreate,
  onUpdate,
}: {
  open: boolean
  editing: Product | null
  onClose: () => void
  onCreate: (payload: Record<string, unknown>) => Promise<void>
  onUpdate: (id: string, payload: Record<string, unknown>) => Promise<void>
}) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    oldPrice: '',
    stock: '',
    imageUrl: '',
    featured: false,
    active: true,
  })
  const [rows, setRows] = useState<OptionRow[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    setErrors({})
    setSaving(false)
    if (editing) {
      setForm({
        name: editing.name,
        description: editing.description,
        category: editing.category,
        price: String(editing.price),
        oldPrice: editing.oldPrice ? String(editing.oldPrice) : '',
        stock: String(editing.stock),
        imageUrl: editing.imageUrl ?? '',
        featured: editing.featured,
        active: editing.active,
      })
      setRows((editing.options ?? []).map((g: ProductOption) => ({ name: g.name, values: g.values.join(', ') })))
    } else {
      setForm({ name: '', description: '', category: '', price: '', oldPrice: '', stock: '10', imageUrl: '', featured: false, active: true })
      setRows([])
    }
  }, [open, editing])

  const set = (k: keyof typeof form, v: string | boolean) => {
    setForm((f) => ({ ...f, [k]: v }))
    setErrors((e) => ({ ...e, [k]: '' }))
  }

  const validate = (): boolean => {
    const e: Record<string, string> = {}
    if (form.name.trim().length < 2) e.name = 'Нэрээ оруулна уу (хамгийн багадаа 2 үсэг).'
    if (form.description.trim().length < 5) e.description = 'Тайлбарыг оруулна уу (хамгийн багадаа 5 тэмдэгт).'
    if (!form.category) e.category = 'Ангилал сонгоно уу.'
    const price = Number(form.price)
    if (form.price.trim() === '' || Number.isNaN(price) || price <= 0) e.price = 'Үнэ 0-ээс их бүхэл тоо байх ёстой.'
    if (form.oldPrice.trim() !== '') {
      const op = Number(form.oldPrice)
      if (Number.isNaN(op) || op <= 0) e.oldPrice = 'Хуучин үнэ 0-ээс их тоо байх ёстой.'
      else if (op <= price) e.oldPrice = 'Хуучин үнэ одоогийн үнээс их байх ёстой (хямдрал).'
    }
    const stock = Number(form.stock)
    if (form.stock.trim() === '' || Number.isNaN(stock) || stock < 0) e.stock = 'Үлдэгдэл 0 буюу түүнээс дээш тоо байх ёстой.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const save = async () => {
    if (!validate()) {
      toast.error('Маягтын алдааг засна уу.')
      return
    }
    const options = rows
      .map((r) => ({
        name: r.name.trim(),
        values: r.values.split(',').map((s) => s.trim()).filter(Boolean),
      }))
      .filter((g) => g.name && g.values.length > 0)

    const payload: Record<string, unknown> = {
      name: form.name.trim(),
      description: form.description.trim(),
      category: form.category,
      price: Math.round(Number(form.price)),
      oldPrice: form.oldPrice.trim() === '' ? null : Math.round(Number(form.oldPrice)),
      stock: Math.round(Number(form.stock)),
      imageUrl: form.imageUrl.trim() === '' ? null : form.imageUrl.trim(),
      options,
      featured: form.featured,
      active: form.active,
    }
    setSaving(true)
    try {
      if (editing) {
        await onUpdate(editing.id, payload)
        toast.success('«' + form.name.trim() + '» шинэчлэгдлээ')
      } else {
        await onCreate(payload)
        toast.success('«' + form.name.trim() + '» нэмэгдлээ')
      }
      onClose()
    } catch {
      toast.error('Хадгалахад алдаа гарлаа. Дахин оролдоно уу.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="nutag-ui max-h-[88vh] overflow-y-auto nice-scroll sm:max-w-2xl" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className="nutag-display text-xl font-extrabold">
            {editing ? 'Бүтээгдэхүүн засах' : 'Шинэ бүтээгдэхүүн'}
          </DialogTitle>
          <DialogDescription>Дэлгүүрийн бүтээгдэхүүний мэдээллийг бөглөнө үү.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-3.5 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="p-name">Нэр *</Label>
            <Input
              id="p-name"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="Жишээ: Гар урлалын арьсан цүнх"
              aria-invalid={!!errors.name}
              className="border-[#E4DFCE] bg-white"
            />
            {errors.name && <p className="text-xs text-red-600">{errors.name}</p>}
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="p-desc">Тайлбар *</Label>
            <Textarea
              id="p-desc"
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              rows={3}
              placeholder="Бүтээгдэхүүний онцлог, хэмжээ, материалын тухай…"
              aria-invalid={!!errors.description}
              className="border-[#E4DFCE] bg-white"
            />
            {errors.description && <p className="text-xs text-red-600">{errors.description}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Ангилал *</Label>
            <Select value={form.category} onValueChange={(v) => set('category', v)}>
              <SelectTrigger aria-invalid={!!errors.category} className="border-[#E4DFCE] bg-white">
                <SelectValue placeholder="Ангилал сонгох" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {CATEGORY_LABEL[c]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && <p className="text-xs text-red-600">{errors.category}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="p-stock">Үлдэгдэл *</Label>
            <Input
              id="p-stock"
              value={form.stock}
              onChange={(e) => set('stock', e.target.value.replace(/\D/g, ''))}
              inputMode="numeric"
              placeholder="10"
              aria-invalid={!!errors.stock}
              className="border-[#E4DFCE] bg-white"
            />
            {errors.stock && <p className="text-xs text-red-600">{errors.stock}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="p-price">Үнэ (₮) *</Label>
            <Input
              id="p-price"
              value={form.price}
              onChange={(e) => set('price', e.target.value.replace(/\D/g, ''))}
              inputMode="numeric"
              placeholder="35000"
              aria-invalid={!!errors.price}
              className="border-[#E4DFCE] bg-white"
            />
            {errors.price && <p className="text-xs text-red-600">{errors.price}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="p-old">Хуучин үнэ (хямдралтай бол)</Label>
            <Input
              id="p-old"
              value={form.oldPrice}
              onChange={(e) => set('oldPrice', e.target.value.replace(/\D/g, ''))}
              inputMode="numeric"
              placeholder="45000"
              aria-invalid={!!errors.oldPrice}
              className="border-[#E4DFCE] bg-white"
            />
            {errors.oldPrice && <p className="text-xs text-red-600">{errors.oldPrice}</p>}
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label>Зураг</Label>
            <Select
              value={form.imageUrl ? form.imageUrl : 'none'}
              onValueChange={(v) => set('imageUrl', v === 'none' ? '' : v)}
            >
              <SelectTrigger className="border-[#E4DFCE] bg-white">
                <SelectValue placeholder="Зургийн сангаас сонгох" />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                <SelectItem value="none">— Зураггүй —</SelectItem>
                {Object.keys(IMG).map((key) => (
                  <SelectGroup key={key}>
                    <SelectLabel>
                      {key} · {IMG_LABELS[key]}
                    </SelectLabel>
                    {IMG[key].map((url, i) => (
                      <SelectItem key={url} value={url}>
                        №{i + 1}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>
            {form.imageUrl && (
              <div className="mt-2 h-24 w-24 overflow-hidden rounded-xl border" style={{ borderColor: PANEL_LINE }}>
                <Photo src={form.imageUrl} alt="Сонгосон зураг" className="h-full w-full object-cover" />
              </div>
            )}
          </div>

          {/* Хувилбарын редактор */}
          <div className="space-y-2 sm:col-span-2">
            <div className="flex items-center justify-between">
              <Label>Хувилбарууд (сонголттой)</Label>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-7 rounded-full border-[#E4DFCE] bg-white text-xs"
                onClick={() => setRows((r) => [...r, { name: '', values: '' }])}
              >
                <PackagePlus className="mr-1 h-3.5 w-3.5" />
                Хувилбар нэмэх
              </Button>
            </div>
            {rows.length === 0 && (
              <p className="text-xs" style={{ color: INK_SOFT }}>
                Жишээ: Нэр — «Өнгө», Утгууд — «Күрэн, Хар».
              </p>
            )}
            {rows.map((r, i) => (
              <div key={i} className="flex flex-col gap-2 sm:flex-row">
                <Input
                  value={r.name}
                  onChange={(e) =>
                    setRows((rs) => rs.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))
                  }
                  placeholder="Хувилбарын нэр (жишээ: Өнгө)"
                  className="border-[#E4DFCE] bg-white sm:w-56"
                  aria-label={`Хувилбар ${i + 1} — нэр`}
                />
                <Input
                  value={r.values}
                  onChange={(e) =>
                    setRows((rs) => rs.map((x, j) => (j === i ? { ...x, values: e.target.value } : x)))
                  }
                  placeholder="Утгууд таслалаар (жишээ: Күрэн, Хар)"
                  className="border-[#E4DFCE] bg-white"
                  aria-label={`Хувилбар ${i + 1} — утгууд`}
                />
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="h-9 shrink-0 rounded-lg text-xs text-red-600 hover:bg-red-50"
                  onClick={() => setRows((rs) => rs.filter((_, j) => j !== i))}
                  aria-label={`Хувилбар ${i + 1} устгах`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 sm:col-span-2">
            <div className="flex items-center gap-2 rounded-xl border px-3.5 py-2.5" style={{ borderColor: PANEL_LINE }}>
              <Switch id="p-featured" checked={form.featured} onCheckedChange={(v) => set('featured', v)} />
              <Label htmlFor="p-featured" className="cursor-pointer text-sm font-medium">
                Онцлох бүтээгдэхүүн
              </Label>
            </div>
            <div className="flex items-center gap-2 rounded-xl border px-3.5 py-2.5" style={{ borderColor: PANEL_LINE }}>
              <Switch id="p-active" checked={form.active} onCheckedChange={(v) => set('active', v)} />
              <Label htmlFor="p-active" className="cursor-pointer text-sm font-medium">
                Идэвхтэй (дэлгүүрт харагдана)
              </Label>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-2">
          <Button variant="outline" className="rounded-full border-[#E4DFCE] bg-white" onClick={onClose} disabled={saving}>
            Болих
          </Button>
          <Button
            className="rounded-full text-white hover:brightness-110"
            style={{ backgroundColor: OLIVE }}
            onClick={save}
            disabled={saving}
          >
            {editing ? 'Хадгалах' : 'Нэмэх'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ── Бүтээгдэхүүн таб ─────────────────────────────────────────────────────────
function ProductsTab({
  api,
}: {
  api: ReturnType<typeof useApi<Product>>
}) {
  const { data: products, loading, create, update, remove } = api
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('all')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null)

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()
    let list = products
    if (cat !== 'all') list = list.filter((p) => p.category === cat)
    if (term) list = list.filter((p) => p.name.toLowerCase().includes(term))
    return list
  }, [products, q, cat])

  const saveStock = async (p: Product, v: number) => {
    const entry: StockLogEntry = {
      at: new Date().toISOString(),
      from: p.stock,
      to: v,
      by: 'Админ',
    }
    try {
      // Үлдэгдлийн түүхийг meta.stockLog-д хадгална (сүүлд нэмсэн нь эхэнд, хамгийн ихдээ 20)
      const log = [entry, ...readStockLog(p.meta)].slice(0, 20)
      await update(p.id, { stock: v, meta: { ...(p.meta ?? {}), stockLog: log } })
      toast.success(`«${p.name}» үлдэгдэл ${v} боллоо`)
    } catch {
      toast.error('Үлдэгдэл шинэчлэхэд алдаа гарлаа.')
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: INK_SOFT }} aria-hidden="true" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Нэрээр хайх…"
            className="border-[#E4DFCE] bg-white pl-9"
            aria-label="Бүтээгдэхүүн хайх"
          />
        </div>
        <div className="w-full sm:w-56">
          <Select value={cat} onValueChange={setCat}>
            <SelectTrigger className="border-[#E4DFCE] bg-white" aria-label="Ангиллаар шүүх">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Бүх ангилал</SelectItem>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {CATEGORY_LABEL[c]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          className="rounded-full text-white hover:brightness-110"
          style={{ backgroundColor: OLIVE }}
          onClick={() => {
            setEditing(null)
            setDialogOpen(true)
          }}
        >
          <PackagePlus className="mr-1.5 h-4 w-4" />
          Шинэ бүтээгдэхүүн
        </Button>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border bg-white" style={{ borderColor: PANEL_LINE }}>
        {loading ? (
          <LoadingState label="Бүтээгдэхүүнүүдийг ачаалж байна…" />
        ) : filtered.length === 0 ? (
          <div className="p-4">
            <EmptyState title="Бүтээгдэхүүн олдсонгүй" description="Хайлт, шүүлтүүрээ өөрчилж үзээрэй." />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow style={{ borderColor: PANEL_LINE }}>
                <TableHead className="w-14">Зураг</TableHead>
                <TableHead>Нэр</TableHead>
                <TableHead className="hidden md:table-cell">Ангилал</TableHead>
                <TableHead>Үнэ</TableHead>
                <TableHead>Үлдэгдэл</TableHead>
                <TableHead className="hidden sm:table-cell">Онцлох</TableHead>
                <TableHead className="hidden lg:table-cell">Идэвхтэй</TableHead>
                <TableHead className="text-right">Үйлдэл</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => (
                <TableRow key={p.id} style={{ borderColor: PANEL_LINE }}>
                  <TableCell>
                    <div className="h-10 w-10 overflow-hidden rounded-lg border" style={{ borderColor: PANEL_LINE }}>
                      <Photo src={p.imageUrl} alt={p.name} className="h-full w-full object-cover" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="max-w-[220px] truncate font-semibold" style={{ color: INK }} title={p.name}>
                      {p.name}
                    </p>
                    <p className="text-xs md:hidden" style={{ color: INK_SOFT }}>
                      {CATEGORY_LABEL[p.category] ?? p.category}
                    </p>
                  </TableCell>
                  <TableCell className="hidden text-sm md:table-cell" style={{ color: INK_SOFT }}>
                    {CATEGORY_LABEL[p.category] ?? p.category}
                  </TableCell>
                  <TableCell>
                    <span className="whitespace-nowrap text-sm font-bold">{fmtMNT(p.price)}</span>
                    {p.oldPrice ? (
                      <span className="ml-1.5 whitespace-nowrap text-xs line-through" style={{ color: INK_SOFT }}>
                        {fmtMNT(p.oldPrice)}
                      </span>
                    ) : null}
                  </TableCell>
                  <TableCell>
                    <StockCell key={p.stock} product={p} onSave={(v) => saveStock(p, v)} />
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Switch
                      checked={p.featured}
                      onCheckedChange={(v) => {
                        update(p.id, { featured: v })
                          .then(() => toast.success(v ? `«${p.name}» онцоллоо` : `«${p.name}» онцлохоос хаслаа`))
                          .catch(() => toast.error('Өөрчлөхөд алдаа гарлаа.'))
                      }}
                      aria-label={`${p.name} — онцлох`}
                    />
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <Switch
                      checked={p.active}
                      onCheckedChange={(v) => {
                        update(p.id, { active: v })
                          .then(() => toast.success(v ? `«${p.name}» идэвхжлээ` : `«${p.name}» идэвхгүй боллоо`))
                          .catch(() => toast.error('Өөрчлөхөд алдаа гарлаа.'))
                      }}
                      aria-label={`${p.name} — идэвхтэй`}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        aria-label={`${p.name} — засах`}
                        onClick={() => {
                          setEditing(p)
                          setDialogOpen(true)
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
                        aria-label={`${p.name} — устгах`}
                        onClick={() => setDeleteTarget(p)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <DemoDataNote className="mt-3" />

      <ProductDialog
        open={dialogOpen}
        editing={editing}
        onClose={() => setDialogOpen(false)}
        onCreate={create}
        onUpdate={update}
      />

      <ConfirmDelete
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        onConfirm={() => {
          if (!deleteTarget) return
          remove(deleteTarget.id)
            .then(() => toast.success(`«${deleteTarget.name}» устгагдлаа`))
            .catch(() => toast.error('Устгахад алдаа гарлаа.'))
          setDeleteTarget(null)
        }}
        title={`«${deleteTarget?.name}»-г устгах уу?`}
        description="Энэ бүтээгдэхүүн дэлгүүрээс бүрмөсөн хасагдана."
      />
    </div>
  )
}

// ── Захиалга таб ─────────────────────────────────────────────────────────────
function OrdersTab({ api }: { api: ReturnType<typeof useApi<ShopOrder>> }) {
  const { data: orders, loading, update, remove } = api
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('all')
  const [mode, setMode] = useState<'all' | 'queue'>('all')
  const [detail, setDetail] = useState<ShopOrder | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<ShopOrder | null>(null)
  const [bulkConfirm, setBulkConfirm] = useState(false)
  const [bulkBusy, setBulkBusy] = useState(false)

  // Боловсруулалт хүлээж буй захиалгууд — хамгийн эрт нь түрүүнд
  const newQueue = useMemo(
    () =>
      orders
        .filter((o) => o.status === 'бүртгэгдсэн')
        .sort(
          (a, b) =>
            new Date(a.createdAt ?? 0).getTime() - new Date(b.createdAt ?? 0).getTime()
        ),
    [orders]
  )

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()
    let list = mode === 'queue' ? newQueue : orders
    if (status !== 'all') list = list.filter((o) => o.status === status)
    if (term)
      list = list.filter((o) =>
        [o.customerName, o.phone, o.city, orderCode(o.id)].some((f) =>
          String(f).toLowerCase().includes(term)
        )
      )
    return list
  }, [orders, newQueue, q, status, mode])

  const setStatusOf = async (o: ShopOrder, s: string) => {
    try {
      await update(o.id, { status: s })
      toast.success(`Захиалга ${orderCode(o.id)} — «${s}» төлөвт шилжлээ`)
    } catch {
      toast.error('Төлөв шинэчлэхэд алдаа гарлаа.')
    }
  }

  /** Дарааллыг бүхэлд нь дараагийн төлөвт («баглааж байна») шилжүүлэх */
  const advanceAll = async () => {
    if (newQueue.length === 0) return
    setBulkBusy(true)
    let ok = 0
    let fail = 0
    for (const o of newQueue) {
      try {
        await update(o.id, { status: 'баглааж байна' })
        ok += 1
      } catch {
        fail += 1
      }
    }
    setBulkBusy(false)
    setBulkConfirm(false)
    if (ok > 0) toast.success(`${ok} захиалгыг «баглааж байна» төлөвт шилжүүллээ`)
    if (fail > 0) toast.error(`${fail} захиалгын төлөв шинэчлэхэд алдаа гарлаа`)
  }

  return (
    <div>
      {/* Шуурхай шүүлт: бүх захиалга / боловсруулалт хүлээгчид */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setMode('all')}
          aria-pressed={mode === 'all'}
          className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5A6B3F] ${
            mode === 'all'
              ? 'border-[#5A6B3F] bg-[#5A6B3F] text-white'
              : 'border-[#E4DFCE] bg-white text-[#26231D]/70 hover:bg-[#F0EDE2]'
          }`}
        >
          Бүх захиалга
        </button>
        <button
          type="button"
          onClick={() => setMode('queue')}
          aria-pressed={mode === 'queue'}
          className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5A6B3F] ${
            mode === 'queue'
              ? 'border-[#5A6B3F] bg-[#5A6B3F] text-white'
              : 'border-[#E4DFCE] bg-white text-[#26231D]/70 hover:bg-[#F0EDE2]'
          }`}
        >
          <ClipboardList className="h-3.5 w-3.5" aria-hidden="true" />
          Боловсруулах захиалга
          <span
            className={`ml-0.5 rounded-full px-1.5 py-px text-[10px] font-bold ${
              mode === 'queue' ? 'bg-white/25 text-white' : 'bg-[#5A6B3F]/15 text-[#5A6B3F]'
            }`}
          >
            {newQueue.length}
          </span>
        </button>
        {mode === 'queue' && newQueue.length > 0 && (
          <span className="text-xs" style={{ color: INK_SOFT }}>
            {newQueue.length} боловсруулалт хүлээж байна · эртнийх:{' '}
            <span className="font-semibold" style={{ color: OLIVE }}>
              {orderCode(newQueue[0].id)} · {fmtDate(newQueue[0].createdAt ?? new Date())}
            </span>
          </span>
        )}
        {mode === 'queue' && newQueue.length > 0 && (
          <Button
            size="sm"
            disabled={bulkBusy}
            onClick={() => setBulkConfirm(true)}
            className="ml-auto shrink-0 rounded-full bg-[#5A6B3F] text-xs text-white hover:bg-[#4C5B34]"
          >
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            Бүгдийг баглааж байна болгох ({newQueue.length})
          </Button>
        )}
      </div>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: INK_SOFT }} aria-hidden="true" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Код, нэр, утас, хотоор хайх…"
            className="border-[#E4DFCE] bg-white pl-9"
            aria-label="Захиалга хайх"
          />
        </div>
        <div className="w-full sm:w-56">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="border-[#E4DFCE] bg-white" aria-label="Төлөвөөр шүүх">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Бүх төлөв</SelectItem>
              {ORDER_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border bg-white" style={{ borderColor: PANEL_LINE }}>
        {loading ? (
          <LoadingState label="Захиалгуудыг ачаалж байна…" />
        ) : filtered.length === 0 ? (
          <div className="p-4">
            <EmptyState title="Захиалга олдсонгүй" description="Хайлт, шүүлтүүрээ өөрчилж үзээрэй." />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow style={{ borderColor: PANEL_LINE }}>
                <TableHead>Код</TableHead>
                <TableHead>Хэрэглэгч</TableHead>
                <TableHead className="hidden md:table-cell">Хот</TableHead>
                <TableHead>Дүн</TableHead>
                <TableHead>Төлөв</TableHead>
                <TableHead className="hidden sm:table-cell">Төлбөр</TableHead>
                <TableHead className="hidden lg:table-cell">Огноо</TableHead>
                <TableHead className="text-right">Үйлдэл</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((o) => {
                const next = nextStatus(o.status)
                return (
                  <TableRow key={o.id} style={{ borderColor: PANEL_LINE }}>
                    <TableCell>
                      <span className="whitespace-nowrap font-bold" style={{ color: OLIVE }}>
                        {orderCode(o.id)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <p className="max-w-[160px] truncate font-semibold" title={o.customerName}>
                        {o.customerName}
                      </p>
                      <p className="text-xs" style={{ color: INK_SOFT }}>
                        {o.phone}
                      </p>
                    </TableCell>
                    <TableCell className="hidden text-sm md:table-cell" style={{ color: INK_SOFT }}>
                      {o.city}
                    </TableCell>
                    <TableCell>
                      <span className="whitespace-nowrap text-sm font-bold">{fmtMNT(o.total)}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        {next && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 shrink-0 border-[#BFCBAA] bg-white p-0 hover:bg-[#EDEFDF]"
                            title={`Дараагийн төлөв: ${next}`}
                            aria-label={`Дараагийн төлөв: ${next}`}
                            onClick={() => setStatusOf(o, next)}
                          >
                            <ArrowRight className="h-3.5 w-3.5" style={{ color: OLIVE }} />
                          </Button>
                        )}
                        <Select value={o.status} onValueChange={(s) => setStatusOf(o, s)}>
                          <SelectTrigger className="h-8 w-[140px] border-[#E4DFCE] bg-white text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {ORDER_STATUSES.map((s) => (
                              <SelectItem key={s} value={s}>
                                {s}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <StatusBadge status={o.paymentStatus} />
                    </TableCell>
                    <TableCell className="hidden whitespace-nowrap text-sm lg:table-cell" style={{ color: INK_SOFT }}>
                      {fmtDate(o.createdAt ?? new Date())}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          aria-label={`${orderCode(o.id)} — дэлгэрэнгүй`}
                          title="Дэлгэрэнгүй"
                          onClick={() => setDetail(o)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
                          aria-label={`${orderCode(o.id)} — устгах`}
                          title="Устгах"
                          onClick={() => setDeleteTarget(o)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </div>

      <DemoDataNote className="mt-3" />

      {/* Захиалгын дэлгэрэнгүй */}
      <Dialog open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <DialogContent className="nutag-ui max-h-[88vh] overflow-y-auto nice-scroll sm:max-w-lg" aria-describedby={undefined}>
          {detail && (
            <>
              <DialogHeader>
                <DialogTitle className="nutag-display flex items-center justify-between gap-2 text-lg font-extrabold">
                  {orderCode(detail.id)}
                  <span className="flex gap-2">
                    <StatusBadge status={detail.status} />
                    <StatusBadge status={detail.paymentStatus} />
                  </span>
                </DialogTitle>
              </DialogHeader>

              <dl className="space-y-1 rounded-xl bg-[#F7F4EA] px-4 py-3 text-sm">
                <div className="flex justify-between gap-4">
                  <dt style={{ color: INK_SOFT }}>Хэрэглэгч</dt>
                  <dd className="text-right font-semibold">{detail.customerName}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt style={{ color: INK_SOFT }}>Утас</dt>
                  <dd className="text-right font-semibold">{detail.phone}</dd>
                </div>
                {detail.email && (
                  <div className="flex justify-between gap-4">
                    <dt style={{ color: INK_SOFT }}>Имэйл</dt>
                    <dd className="text-right">{detail.email}</dd>
                  </div>
                )}
                <div className="flex justify-between gap-4">
                  <dt style={{ color: INK_SOFT }}>Хаяг</dt>
                  <dd className="max-w-[260px] text-right">
                    {detail.city}, {detail.address}
                  </dd>
                </div>
                {detail.notes && (
                  <div className="flex justify-between gap-4">
                    <dt style={{ color: INK_SOFT }}>Тайлбар</dt>
                    <dd className="max-w-[260px] text-right">{detail.notes}</dd>
                  </div>
                )}
              </dl>

              <ul className="divide-y rounded-xl border" style={{ borderColor: PANEL_LINE }}>
                {(detail.items ?? []).map((it, i) => (
                  <li key={i} className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm">
                    <span>
                      <span className="font-semibold">{it.name}</span>
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

              <dl className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <dt style={{ color: INK_SOFT }}>Барааны дүн</dt>
                  <dd>{fmtMNT(detail.subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt style={{ color: INK_SOFT }}>Хүргэлт</dt>
                  <dd>{detail.deliveryFee === 0 ? 'Үнэгүй' : fmtMNT(detail.deliveryFee)}</dd>
                </div>
                <div className="flex justify-between font-extrabold">
                  <dt>Нийт</dt>
                  <dd style={{ color: OLIVE }}>{fmtMNT(detail.total)}</dd>
                </div>
              </dl>
            </>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDelete
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        onConfirm={() => {
          if (!deleteTarget) return
          remove(deleteTarget.id)
            .then(() => toast.success(`Захиалга ${orderCode(deleteTarget.id)} устгагдлаа`))
            .catch(() => toast.error('Устгахад алдаа гарлаа.'))
          setDeleteTarget(null)
        }}
        title={`Захиалга ${deleteTarget ? orderCode(deleteTarget.id) : ''}-г устгах уу?`}
        description="Энэ захиалгын бүртгэл бүрмөсөн хасагдана."
      />

      {/* Багцаар төлөв шилжүүлэх баталгаажуулалт */}
      <Dialog open={bulkConfirm} onOpenChange={(o) => !o && setBulkConfirm(false)}>
        <DialogContent className="nutag-ui sm:max-w-md" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle className="nutag-display text-lg font-extrabold">
              {newQueue.length} захиалгыг багцад шилжүүлэх үү?
            </DialogTitle>
            <DialogDescription className="text-sm" style={{ color: INK_SOFT }}>
              Боловсруулах дараалал дахь бүх захиалга «баглааж байна» төлөвт шилжинэ. Энэ үйлдлийг
              захиалга бүрээр дахин төлөв өөрчлөлт хийж болно.
            </DialogDescription>
          </DialogHeader>
          <ul className="max-h-40 space-y-1 overflow-y-auto rounded-xl bg-[#F7F4EA] px-4 py-3 text-sm nice-scroll">
            {newQueue.map((o) => (
              <li key={o.id} className="flex items-center justify-between gap-3">
                <span className="font-semibold" style={{ color: OLIVE }}>
                  {orderCode(o.id)}
                </span>
                <span className="min-w-0 truncate" style={{ color: INK_SOFT }}>
                  {o.customerName}
                </span>
              </li>
            ))}
          </ul>
          <DialogFooter className="gap-2">
            <Button variant="outline" className="border-[#E4DFCE]" disabled={bulkBusy} onClick={() => setBulkConfirm(false)}>
              Болих
            </Button>
            <Button className="bg-[#5A6B3F] text-white hover:bg-[#4C5B34]" disabled={bulkBusy} onClick={advanceAll}>
              {bulkBusy ? 'Шилжүүлж байна…' : `Тийм — ${newQueue.length} захиалга`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ── Тайлан таб ───────────────────────────────────────────────────────────────
function ReportTab({
  products,
  orders,
  loading,
}: {
  products: Product[]
  orders: ShopOrder[]
  loading: boolean
}) {
  const [alertDismissed, setAlertDismissed] = useState(false)
  const activeProducts = products.filter((p) => p.active)
  const soldOut = activeProducts.filter((p) => p.stock <= 0)
  const todayOrders = orders.filter((o) => sameDay(o.createdAt))
  const revenue = orders
    .filter((o) => o.paymentStatus === 'төлөгдсөн')
    .reduce((s, o) => s + (o.total ?? 0), 0)
  const lowStock = activeProducts.filter((p) => p.stock <= 3).sort((a, b) => a.stock - b.stock)

  // Бүх бүтээгдэхүүний үлдэгдлийн түүхийг нэгтгэж, шинэ → хуучин эрэмбэлнэ
  const stockHistory = useMemo(() => {
    const rows: (StockLogEntry & { productName: string })[] = []
    for (const p of products) {
      for (const e of readStockLog(p.meta)) rows.push({ ...e, productName: p.name })
    }
    return rows.sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime()).slice(0, 8)
  }, [products])

  const stats = [
    {
      label: 'Нийт бүтээгдэхүүн',
      value: String(products.length),
      sub: `${activeProducts.length} идэвхтэй`,
      icon: <Package className="h-5 w-5" style={{ color: OLIVE }} />,
    },
    {
      label: 'Дууссан бүтээгдэхүүн',
      value: String(soldOut.length),
      sub: soldOut.length > 0 ? 'Үлдэгдэл нэмэх шаардлагатай' : 'Бүх зүйл бэлэн',
      icon: <TriangleAlert className="h-5 w-5" style={{ color: '#A0522D' }} />,
    },
    {
      label: 'Өнөөдрийн захиалга',
      value: String(todayOrders.length),
      sub: `Нийт ${orders.length} захиалга`,
      icon: <ClipboardList className="h-5 w-5" style={{ color: OLIVE }} />,
    },
    {
      label: 'Нийт орлого (төлөгдсөн)',
      value: fmtMNT(revenue),
      sub: 'Демо өгөгдөлд суурилсан',
      icon: <Wallet className="h-5 w-5" style={{ color: OLIVE }} />,
    },
  ]

  if (loading) return <LoadingState label="Тайланг ачаалж байна…" />

  return (
    <div>
      {/* Үлдэгдэл бага анхааруулга (хааж болно) */}
      {lowStock.length > 0 && !alertDismissed && (
        <div
          role="alert"
          className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border px-4 py-3"
          style={{ borderColor: '#E8CFA0', backgroundColor: '#FBF3DF' }}
        >
          <p className="flex min-w-0 items-center gap-2.5 text-sm" style={{ color: '#7A5B18' }}>
            <TriangleAlert className="h-4.5 w-4.5 shrink-0" style={{ color: '#C08A2D' }} aria-hidden="true" />
            <span>
              <strong>{lowStock.length}</strong> бүтээгдэхүүний үлдэгдэл бага байна
              {soldOut.length > 0 ? (
                <> · <strong style={{ color: '#C24A2E' }}>{soldOut.length}</strong> дууссан</>
              ) : null}
              {' — '}
              <span style={{ color: '#8A7440' }}>
                {lowStock.slice(0, 3).map((p) => p.name).join(', ')}
                {lowStock.length > 3 ? ` +${lowStock.length - 3}` : ''}
              </span>
            </span>
          </p>
          <button
            type="button"
            onClick={() => setAlertDismissed(true)}
            className="shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition-colors hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C08A2D]"
            style={{ color: '#7A5B18' }}
            aria-label="Анхааруулгыг хаах"
          >
            Хаах
          </button>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border bg-white p-4" style={{ borderColor: PANEL_LINE }}>
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: INK_SOFT }}>
                {s.label}
              </p>
              {s.icon}
            </div>
            <p className="nutag-display mt-2 text-2xl font-extrabold" style={{ color: INK }}>
              {s.value}
            </p>
            <p className="mt-0.5 text-xs" style={{ color: INK_SOFT }}>
              {s.sub}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {/* Үлдэгдэл бага */}
        <div className="min-w-0 rounded-2xl border bg-white p-4" style={{ borderColor: PANEL_LINE }}>
          <div className="flex items-center justify-between">
            <h3 className="nutag-display font-extrabold" style={{ color: INK }}>
              Үлдэгдэл бага (≤ 3)
            </h3>
            <TrendingUp className="h-4 w-4" style={{ color: INK_SOFT }} aria-hidden="true" />
          </div>
          {lowStock.length === 0 ? (
            <p className="mt-3 rounded-xl border border-dashed px-4 py-6 text-center text-sm" style={{ borderColor: PANEL_LINE, color: INK_SOFT }}>
              Үлдэгдэл бага бүтээгдэхүүн байхгүй байна.
            </p>
          ) : (
            <ul className="mt-3 divide-y" style={{ borderColor: PANEL_LINE }}>
              {lowStock.map((p) => (
                <li key={p.id} className="flex items-center gap-3 py-2.5">
                  <div className="h-9 w-9 shrink-0 overflow-hidden rounded-lg border" style={{ borderColor: PANEL_LINE }}>
                    <Photo src={p.imageUrl} alt={p.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold" title={p.name}>
                      {p.name}
                    </p>
                    <p className="text-xs" style={{ color: INK_SOFT }}>
                      {CATEGORY_LABEL[p.category] ?? p.category}
                    </p>
                  </div>
                  <StatusBadge status={p.stock === 0 ? 'Дууссан' : `${p.stock} үлдсэн`} />
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Сүүлийн захиалгууд */}
        <div className="min-w-0 rounded-2xl border bg-white p-4" style={{ borderColor: PANEL_LINE }}>
          <h3 className="nutag-display font-extrabold" style={{ color: INK }}>
            Сүүлийн захиалгууд
          </h3>
          {orders.length === 0 ? (
            <p className="mt-3 rounded-xl border border-dashed px-4 py-6 text-center text-sm" style={{ borderColor: PANEL_LINE, color: INK_SOFT }}>
              Одоогоор захиалга бүртгэгдээгүй байна.
            </p>
          ) : (
            <ul className="mt-3 divide-y" style={{ borderColor: PANEL_LINE }}>
              {orders.slice(0, 5).map((o) => (
                <li key={o.id} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      <span style={{ color: OLIVE }}>{orderCode(o.id)}</span> · {o.customerName}
                    </p>
                    <p className="text-xs" style={{ color: INK_SOFT }}>
                      {fmtDate(o.createdAt ?? new Date())} · {o.city}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="whitespace-nowrap text-sm font-bold">{fmtMNT(o.total)}</span>
                    <StatusBadge status={o.status} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <StockTrendChart products={products} />

      {/* Үлдэгдлийн түүх */}
      <div className="mt-4 rounded-2xl border bg-white p-4" style={{ borderColor: PANEL_LINE }}>
        <div className="flex items-center justify-between">
          <h3 className="nutag-display font-extrabold" style={{ color: INK }}>
            Үлдэгдлийн сүүлийн өөрчлөлтүүд
          </h3>
          <History className="h-4 w-4" style={{ color: INK_SOFT }} aria-hidden="true" />
        </div>
        {stockHistory.length === 0 ? (
          <p className="mt-3 rounded-xl border border-dashed px-4 py-6 text-center text-sm" style={{ borderColor: PANEL_LINE, color: INK_SOFT }}>
            Үлдэгдлийн өөрчлөлт хараахан бүртгэгдээгүй байна. Бүтээгдэхүүний хүснэгтээс үлдэгдэл засвал түүх энд харагдана.
          </p>
        ) : (
          <ul className="mt-3 divide-y" style={{ borderColor: PANEL_LINE }}>
            {stockHistory.map((e, i) => {
              const up = e.to > e.from
              const diff = e.to - e.from
              return (
                <li key={`${e.at}-${i}`} className="flex flex-wrap items-center justify-between gap-2 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold" title={e.productName}>
                      {e.productName}
                    </p>
                    <p className="text-xs" style={{ color: INK_SOFT }}>
                      {fmtDate(e.at)} · {e.by}
                    </p>
                  </div>
                  <p className="shrink-0 text-sm">
                    <span style={{ color: INK_SOFT }}>
                      {e.from} → {e.to}
                    </span>{' '}
                    <span className="font-bold" style={{ color: up ? '#4E6B30' : '#C24A2E' }}>
                      ({diff > 0 ? '+' : ''}{diff})
                    </span>
                  </p>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      <DemoDataNote className="mt-3" />
    </div>
  )
}

// ── Админ үндсэн хуудас ──────────────────────────────────────────────────────
export function AdminPage() {
  const { authed, pass, logout } = useDemoAdminAuth('nutag-admin-ok')
  if (!authed)
    return (
      <DemoAdminGate title="НУТАГ Админ" accent="#5A6B3F" onPass={pass} backHref="/demo/nutag" />
    )
  return <AdminInner onLogout={logout} />
}

function AdminInner({ onLogout }: { onLogout: () => void }) {
  const productsApi = useApi<Product>('products')
  const ordersApi = useApi<ShopOrder>('shop-orders')
  const [tab, setTab] = useState<TabKey>('report')

  return (
    <div className="flex min-h-screen flex-col" style={{ background: PANEL_BG, color: INK, fontFamily: 'var(--font-inter), ui-sans-serif, system-ui, sans-serif' }}>
      {/* Толгой */}
      <header className="sticky top-0 z-30" style={{ backgroundColor: ADMIN_DARK }}>
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-4">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <span className="whitespace-nowrap nutag-display text-xl font-extrabold tracking-wide" style={{ color: OLIVE_LIGHT }}>
              НУТАГ <span className="text-sm font-bold" style={{ color: '#8B8574' }}>Админ</span>
            </span>
            <span
              className="hidden shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider sm:inline-block"
              style={{ borderColor: '#F0D9A8', color: '#F0D9A8' }}
            >
              Демо админ
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <DemoAdminLogoutButton dark onLogout={onLogout} />
            <Button
              variant="outline"
              size="sm"
              aria-label="Сайт руу буцах"
              className="rounded-full border-white/20 bg-transparent px-3 text-[13px] text-white hover:bg-white/10"
              onClick={() => navigate('/demo/nutag')}
            >
              <ArrowLeft className="h-3.5 w-3.5 shrink-0" />
              <span className="sr-only sm:not-sr-only">Сайт руу буцах</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        {/* Табууд */}
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Админы хэсгүүд">
          {TABS.map((t) => {
            const on = tab === t.key
            return (
              <button
                key={t.key}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => setTab(t.key)}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5A6B3F] ${
                  on ? 'text-white' : 'bg-white hover:bg-[#EFEBDC]'
                }`}
                style={on ? { backgroundColor: OLIVE, borderColor: OLIVE } : { borderColor: PANEL_LINE, color: INK }}
              >
                <t.icon className="h-4 w-4" aria-hidden="true" />
                {t.label}
              </button>
            )
          })}
        </div>

        <div className="mt-6" role="tabpanel">
          {tab === 'report' && (
            <ReportTab products={productsApi.data} orders={ordersApi.data} loading={productsApi.loading || ordersApi.loading} />
          )}
          {tab === 'products' && <ProductsTab api={productsApi} />}
          {tab === 'orders' && <OrdersTab api={ordersApi} />}
        </div>
      </main>

      <footer className="mt-auto border-t py-4 text-center text-xs" style={{ borderColor: PANEL_LINE, color: INK_SOFT }}>
        НУТАГ Store — Демо дэлгүүрийн админ панель · Pixelmn
      </footer>
    </div>
  )
}
