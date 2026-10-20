'use client'

/**
 * ҮЗЭГ Админ — өөрийн dark layout: Тайлан / Контент (CRUD) / Багц бүртгэл
 */

import { useMemo, useState } from 'react'
import {
  ArrowLeft,
  Clock,
  Eye,
  Film,
  Tv,
  FolderOpen,
  Star,
  Users,
  Pencil,
  Plus,
  Trash2,
  Search,
  AlertTriangle,
} from 'lucide-react'
import { toast } from 'sonner'
import { useApi } from '@/lib/use-api'
import { DemoLink } from '@/lib/hash-router'
import { DemoBadge } from '@/components/shared/demo-kit'
import { DemoAdminGate, DemoAdminLogoutButton, useDemoAdminAuth } from '@/components/shared/demo-gate'
import { StatusBadge, EmptyState, LoadingState, ConfirmDelete, fmtMNT, fmtDateTime, DemoDataNote } from '@/components/shared/admin-kit'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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
  ACCENT,
  BTN_ACCENT,
  BTN_GHOST,
  DARK_PORTAL,
  INPUT_CLS,
  CrimsonBar,
  fontDisplay,
  GRADIENT_PRESETS,
  VIDEO_SOURCES,
  BACKDROPS,
  type StreamSub,
  type StreamTitle,
} from './shared'

const TYPES = ['кино', 'цуврал', 'баримтат'] as const

export function AdminPage() {
  const { authed, pass, logout } = useDemoAdminAuth('uzeg-admin-ok')
  if (!authed)
    return (
      <div className="dark min-h-screen">
        <DemoAdminGate title="ҮЗЭГ Админ" accent="#FF3D5A" dark onPass={pass} backHref="/demo/uzeg" />
      </div>
    )
  return <AdminInner onLogout={logout} />
}

function AdminInner({ onLogout }: { onLogout: () => void }) {
  const titles = useApi<StreamTitle>('stream-titles')
  const subs = useApi<StreamSub>('stream-subs')

  return (
    <div className="flex min-h-screen flex-col">
      {/* Админ толгой */}
      <header className="border-b border-white/10 bg-[#120610]">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4">
          <span aria-hidden className="w-12 shrink-0 sm:w-[206px]" />
          <DemoLink
            href="/demo/uzeg"
            className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-[#F5E8EB]/80 transition-colors hover:border-[#FF3D5A]/60 hover:text-[#FF3D5A]"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
            <span className="sr-only sm:not-sr-only">Сайт руу буцах</span>
          </DemoLink>
          <DemoAdminLogoutButton dark onLogout={onLogout} />
          <h1
            className="ml-auto truncate whitespace-nowrap text-base font-bold text-white sm:ml-0 sm:text-lg"
            style={fontDisplay}
          >
            ҮЗЭГ Админ
          </h1>
          <span className="hidden items-center rounded-full border border-[#FF3D5A66] bg-[#FF3D5A14] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#FF3D5A] sm:inline-flex">
            Демо админ
          </span>
          <DemoBadge className="hidden border-white/20 bg-white/5 text-white/60 sm:inline-flex" />
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <Tabs defaultValue="report">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <TabsList className="border border-white/10 bg-white/5">
              <TabsTrigger value="report" className="data-[state=active]:bg-[#FF3D5A] data-[state=active]:text-white">
                Тайлан
              </TabsTrigger>
              <TabsTrigger value="content" className="data-[state=active]:bg-[#FF3D5A] data-[state=active]:text-white">
                Контент
              </TabsTrigger>
              <TabsTrigger value="subs" className="data-[state=active]:bg-[#FF3D5A] data-[state=active]:text-white">
                Багц бүртгэл
              </TabsTrigger>
            </TabsList>
            <DemoDataNote />
          </div>

          <TabsContent value="report" className="mt-6">
            <ReportTab titles={titles.data} subs={subs.data} loading={titles.loading || subs.loading} />
          </TabsContent>
          <TabsContent value="content" className="mt-6">
            <ContentTab api={titles} />
          </TabsContent>
          <TabsContent value="subs" className="mt-6">
            <SubsTab api={subs} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

// ─────────────────────────── 1. ТАЙЛАН ───────────────────────────

function ReportTab({
  titles,
  subs,
  loading,
}: {
  titles: StreamTitle[]
  subs: StreamSub[]
  loading: boolean
}) {
  if (loading) return <LoadingState label="Тайлан ачаалж байна…" />

  const active = titles.filter((t) => t.active)
  const byType = (type: string) => active.filter((t) => t.type === type).length
  const featuredCount = active.filter((t) => t.featured).length
  const activeSubs = subs.filter((s) => s.status === 'идэвхтэй')
  const total = active.length || 1

  // Үзэлтийн тоолол (демо): тоглоомын meta-оос уншина
  const viewsOf = (t: StreamTitle) => Math.max(0, Math.round(t.meta?.views ?? 0))
  const totalViews = active.reduce((sum, t) => sum + viewsOf(t), 0)
  const totalWatchSec = active.reduce((sum, t) => sum + (t.meta?.watchSeconds ?? 0), 0)
  const topViewed = [...active].filter((t) => viewsOf(t) > 0).sort((a, b) => viewsOf(b) - viewsOf(a)).slice(0, 5)
  const maxViews = topViewed.length > 0 ? viewsOf(topViewed[0]) : 1

  const stats = [
    { label: 'Нийт контент', value: active.length, icon: FolderOpen, hint: `${titles.length - active.length} идэвхгүй` },
    { label: 'Кино', value: byType('кино'), icon: Film, hint: `${Math.round((byType('кино') / total) * 100)}% эзлэхүүн` },
    { label: 'Цуврал', value: byType('цуврал'), icon: Tv, hint: `${Math.round((byType('цуврал') / total) * 100)}% эзлэхүүн` },
    { label: 'Онцлох (featured)', value: featuredCount, icon: Star, hint: 'Нүүр хуудасны hero' },
    { label: 'Идэвхтэй багц', value: activeSubs.length, icon: Users, hint: `Нийт ${subs.length} бүртгэл` },
  ]

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur">
            <div className="flex items-center gap-2 text-[#F5E8EB]/65">
              <s.icon className="h-4 w-4 text-[#FF3D5A]" aria-hidden />
              <span className="text-xs">{s.label}</span>
            </div>
            <p className="mt-2 text-2xl font-extrabold text-white" style={fontDisplay}>
              {s.value}
            </p>
            <p className="mt-1 text-[11px] text-[#F5E8EB]/50">{s.hint}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Төрлийн эзлэхүүн — кармин progress мөрүүд */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur">
          <h3 className="text-sm font-semibold text-white" style={fontDisplay}>
            Төрлүүдийн эзлэхүүн
          </h3>
          <div className="mt-4 space-y-4">
            {TYPES.map((tp) => (
              <div key={tp}>
                <div className="mb-1.5 flex items-center justify-between text-xs text-[#F5E8EB]/75">
                  <span>{tp === 'кино' ? 'Кино' : tp === 'цуврал' ? 'Цуврал' : 'Баримтат'}</span>
                  <span>{byType(tp)}</span>
                </div>
                <CrimsonBar pct={(byType(tp) / total) * 100} />
              </div>
            ))}
          </div>
          <p className="mt-4 text-[11px] text-[#F5E8EB]/45">
            Онцлох контентийн хувь: {Math.round((featuredCount / total) * 100)}%
          </p>
          <CrimsonBar pct={(featuredCount / total) * 100} className="mt-2" />
        </div>

        {/* Сүүлийн багцууд */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur">
          <h3 className="text-sm font-semibold text-white" style={fontDisplay}>
            Сүүлийн багц бүртгэл
          </h3>
          {subs.length === 0 ? (
            <p className="mt-4 text-sm text-[#F5E8EB]/60">Одоогоор багц бүртгэгдээгүй байна.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {subs.slice(0, 5).map((s) => (
                <li
                  key={s.id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-black/20 px-3 py-2.5"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm text-white">{s.customerName}</p>
                    <p className="truncate text-xs text-[#F5E8EB]/55">
                      {s.plan} багц · {s.email}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="text-sm font-semibold text-[#F5E8EB]">{fmtMNT(s.amount)}</span>
                    <StatusBadge status={s.status} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Үзэлтийн хандлага — демо тооллоос */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-white" style={fontDisplay}>
            <Eye className="h-4 w-4 text-[#FF3D5A]" aria-hidden />
            Үзэлтийн хандлага
          </h3>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/25 px-3 py-1.5 text-[#F5E8EB]/85">
              <Eye className="h-3.5 w-3.5 text-[#FF3D5A]" aria-hidden />
              Нийт үзэлт: <span className="font-bold text-white">{totalViews}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/25 px-3 py-1.5 text-[#F5E8EB]/85">
              <Clock className="h-3.5 w-3.5 text-[#FF3D5A]" aria-hidden />
              Үзсэн нийт цаг:{' '}
              <span className="font-bold text-white">
                {(() => {
                  if (totalWatchSec < 60) return `${Math.round(totalWatchSec)} сек`
                  const mins = Math.floor(totalWatchSec / 60)
                  const h = Math.floor(mins / 60)
                  const m = mins % 60
                  return h > 0 ? `${h} ц ${m} мин` : `${m} мин`
                })()}
              </span>
            </span>
          </div>
        </div>

        {topViewed.length === 0 ? (
          <p className="mt-4 text-sm text-[#F5E8EB]/60">
            Одоогоор үзэлт бүртгэгдээгүй — демо видеогоо тоглуулж үзвэл энэ хэсэгт хандлага харагдана.
          </p>
        ) : (
          <ul className="mt-4 space-y-4">
            {topViewed.map((t) => (
              <li key={t.id}>
                <div className="mb-1.5 flex items-center justify-between gap-3 text-xs text-[#F5E8EB]/75">
                  <span className="min-w-0 truncate font-medium text-[#F5E8EB]">{t.title}</span>
                  <span className="shrink-0 tabular-nums">
                    {viewsOf(t)} үзэлт
                    {(t.meta?.watchSeconds ?? 0) > 60 &&
                      ` · ${Math.round((t.meta?.watchSeconds ?? 0) / 60)} мин үзсэн`}
                  </span>
                </div>
                <CrimsonBar pct={(viewsOf(t) / maxViews) * 100} />
              </li>
            ))}
          </ul>
        )}
        <p className="mt-4 text-[11px] text-[#F5E8EB]/45">
          Үзэлтийн тоолол нь демо логик — нэг сесс дотор нэг контент нэг л удаа тоологдоно.
        </p>
      </div>
    </div>
  )
}

// ─────────────────────────── 2. КОНТЕНТ (CRUD) ───────────────────────────

type TitleForm = {
  title: string
  type: string
  genre: string
  year: string
  rating: string
  duration: string
  description: string
  posterGradient: string
  videoUrl: string // 'none' эсвэл URL
  backdropUrl: string // 'none' эсвэл URL
  featured: boolean
  isNew: boolean
  active: boolean
}

const EMPTY_FORM: TitleForm = {
  title: '',
  type: 'кино',
  genre: '',
  year: String(new Date().getFullYear()),
  rating: '7.5',
  duration: '',
  description: '',
  posterGradient: GRADIENT_PRESETS[0].value,
  videoUrl: 'none',
  backdropUrl: 'none',
  featured: false,
  isNew: false,
  active: true,
}

function ContentTab({ api }: { api: ReturnType<typeof useApi<StreamTitle>> }) {
  const [q, setQ] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<StreamTitle | null>(null)
  const [form, setForm] = useState<TitleForm>(EMPTY_FORM)
  const [deleteTarget, setDeleteTarget] = useState<StreamTitle | null>(null)
  const [saving, setSaving] = useState(false)

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return api.data.filter((t) => {
      if (typeFilter !== 'all' && t.type !== typeFilter) return false
      if (needle && !t.title.toLowerCase().includes(needle)) return false
      return true
    })
  }, [api.data, q, typeFilter])

  const errors: Partial<Record<keyof TitleForm, string>> = {}
  if (form.title.trim().length < 2) errors.title = 'Гарчиг оруулна уу (хамгийн багадаа 2 тэмдэгт).'
  if (form.genre.trim().length < 2) errors.genre = 'Жанр оруулна уу.'
  const yearNum = Number(form.year)
  if (!form.year || !Number.isInteger(yearNum) || yearNum < 1900 || yearNum > 2100)
    errors.year = 'Он 1900–2100 хооронд бүхэл тоо байх ёстой.'
  const ratingNum = Number(form.rating)
  if (form.rating === '' || Number.isNaN(ratingNum) || ratingNum < 0 || ratingNum > 10)
    errors.rating = 'Үнэлгээ 0–10 хооронд тоо байх ёстой.'
  if (form.duration.trim().length < 1) errors.duration = 'Үргэлжлэл оруулна уу (жишээ: 1 ц 52 мин).'
  if (form.description.trim().length < 10) errors.description = 'Тайлбар хамгийн багадаа 10 тэмдэгт байх ёстой.'
  if (!form.posterGradient.trim()) errors.posterGradient = 'Постирын градиент оруулна уу.'
  const valid = Object.keys(errors).length === 0

  const openCreate = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setDialogOpen(true)
  }

  const openEdit = (t: StreamTitle) => {
    setEditing(t)
    setForm({
      title: t.title,
      type: t.type,
      genre: t.genre,
      year: String(t.year),
      rating: String(t.rating),
      duration: t.duration,
      description: t.description,
      posterGradient: t.posterGradient,
      videoUrl: t.videoUrl ?? 'none',
      backdropUrl: t.backdropUrl ?? 'none',
      featured: t.featured,
      isNew: t.isNew,
      active: t.active,
    })
    setDialogOpen(true)
  }

  const save = async () => {
    if (!valid) return
    setSaving(true)
    const payload = {
      title: form.title.trim(),
      type: form.type,
      genre: form.genre.trim(),
      year: yearNum,
      rating: ratingNum,
      duration: form.duration.trim(),
      description: form.description.trim(),
      posterGradient: form.posterGradient.trim(),
      videoUrl: form.videoUrl === 'none' ? null : form.videoUrl,
      backdropUrl: form.backdropUrl === 'none' ? null : form.backdropUrl,
      featured: form.featured,
      isNew: form.isNew,
      active: form.active,
    }
    try {
      if (editing) {
        await api.update(editing.id, payload)
        toast.success('Контент шинэчлэгдлээ')
      } else {
        await api.create(payload)
        toast.success('Шинэ контент нэмэгдлээ')
      }
      setDialogOpen(false)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Хадгалахад алдаа гарлаа')
    } finally {
      setSaving(false)
    }
  }

  const toggleField = async (t: StreamTitle, field: 'featured' | 'active', value: boolean) => {
    try {
      await api.update(t.id, { [field]: value })
      toast.success(field === 'featured' ? 'Онцлох төлөв шинэчлэгдлээ' : 'Идэвх төлөв шинэчлэгдлээ')
    } catch {
      toast.error('Шинэчлэхэд алдаа гарлаа')
    }
  }

  const remove = async (t: StreamTitle) => {
    try {
      await api.remove(t.id)
      toast.success(`«${t.title}» устгагдлаа`)
    } catch {
      toast.error('Устгахад алдаа гарлаа')
    }
  }

  const set = (patch: Partial<TitleForm>) => setForm((f) => ({ ...f, ...patch }))

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" aria-hidden />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Гарчгаар хайх…"
            aria-label="Контент хайх"
            className={`h-10 pl-9 ${INPUT_CLS}`}
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className={`h-10 w-[160px] ${INPUT_CLS}`} aria-label="Төрөл шүүх">
            <SelectValue placeholder="Бүх төрөл" />
          </SelectTrigger>
          <SelectContent className={`${DARK_PORTAL} border-white/10 bg-[#1A0B12] text-[#F5E8EB]`}>
            <SelectItem value="all">Бүх төрөл</SelectItem>
            {TYPES.map((t) => (
              <SelectItem key={t} value={t}>
                {t === 'кино' ? 'Кино' : t === 'цуврал' ? 'Цуврал' : 'Баримтат'}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button className={BTN_ACCENT} onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" aria-hidden />
          Шинэ контент
        </Button>
      </div>

      {api.loading && api.data.length === 0 ? (
        <LoadingState label="Контент ачаалж байна…" />
      ) : list.length === 0 ? (
        <EmptyState title="Контент олдсонгүй" description="Хайлт эсвэл шүүлтүүрээ өөрчилж үзээрэй." />
      ) : (
        <div className="overflow-x-auto nice-scroll rounded-xl border border-white/10">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-[#F5E8EB]/60">Гарчиг</TableHead>
                <TableHead className="text-[#F5E8EB]/60">Төрөл</TableHead>
                <TableHead className="text-[#F5E8EB]/60">Жанр</TableHead>
                <TableHead className="text-[#F5E8EB]/60">Он</TableHead>
                <TableHead className="text-[#F5E8EB]/60">Үнэлгээ</TableHead>
                <TableHead className="text-[#F5E8EB]/60">Шинэ</TableHead>
                <TableHead className="text-[#F5E8EB]/60">Онцлох</TableHead>
                <TableHead className="text-[#F5E8EB]/60">Идэвхтэй</TableHead>
                <TableHead className="text-right text-[#F5E8EB]/60">Үйлдэл</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.map((t) => (
                <TableRow key={t.id} className="border-white/10">
                  <TableCell className="max-w-[220px] truncate font-medium text-white">{t.title}</TableCell>
                  <TableCell>{t.type === 'кино' ? 'Кино' : t.type === 'цуврал' ? 'Цуврал' : 'Баримтат'}</TableCell>
                  <TableCell className="text-[#F5E8EB]/75">{t.genre}</TableCell>
                  <TableCell>{t.year}</TableCell>
                  <TableCell className="font-semibold text-[#FFD23D]">{t.rating.toFixed(1)}</TableCell>
                  <TableCell>
                    {t.isNew ? (
                      <span
                        className="rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wider text-white"
                        style={{ background: ACCENT }}
                      >
                        ШИНЭ
                      </span>
                    ) : (
                      <span className="text-[#F5E8EB]/40">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={t.featured}
                      onCheckedChange={(v) => toggleField(t, 'featured', v)}
                      aria-label={`${t.title} — онцлох төлөв`}
                      className="data-[state=checked]:bg-[#FF3D5A]"
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={t.active}
                      onCheckedChange={(v) => toggleField(t, 'active', v)}
                      aria-label={`${t.title} — идэвх төлөв`}
                      className="data-[state=checked]:bg-[#FF3D5A]"
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-[#F5E8EB]/70 hover:bg-white/10 hover:text-white"
                        onClick={() => openEdit(t)}
                        aria-label={`${t.title} — засах`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-400/80 hover:bg-red-500/15 hover:text-red-400"
                        onClick={() => setDeleteTarget(t)}
                        aria-label={`${t.title} — устгах`}
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

      {/* Үүсгэх/Засах диалог */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className={`${DARK_PORTAL} max-h-[90vh] overflow-y-auto nice-scroll sm:max-w-2xl border-white/10 bg-[#1A0B12] text-[#F5E8EB]`}>
          <DialogHeader>
            <DialogTitle>{editing ? 'Контент засах' : 'Шинэ контент нэмэх'}</DialogTitle>
            <DialogDescription className="text-[#F5E8EB]/65">
              Постер нь градиент + гарчгаас автоматаар зурагдана (авторшилгүй демо дизайн).
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="tf-title">Гарчиг *</Label>
              <Input id="tf-title" value={form.title} onChange={(e) => set({ title: e.target.value })} className={INPUT_CLS} />
              {errors.title && <p className="text-xs text-red-400">{errors.title}</p>}
            </div>

            <div className="space-y-1.5">
              <Label>Төрөл *</Label>
              <Select value={form.type} onValueChange={(v) => set({ type: v })}>
                <SelectTrigger className={INPUT_CLS} aria-label="Төрөл сонгох">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className={`${DARK_PORTAL} border-white/10 bg-[#1A0B12] text-[#F5E8EB]`}>
                  {TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t === 'кино' ? 'Кино' : t === 'цуврал' ? 'Цуврал' : 'Баримтат'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="tf-genre">Жанр *</Label>
              <Input id="tf-genre" value={form.genre} onChange={(e) => set({ genre: e.target.value })} placeholder="Жишээ: Адал явдал" className={INPUT_CLS} />
              {errors.genre && <p className="text-xs text-red-400">{errors.genre}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="tf-year">Он *</Label>
              <Input id="tf-year" type="number" min={1900} max={2100} value={form.year} onChange={(e) => set({ year: e.target.value })} className={INPUT_CLS} />
              {errors.year && <p className="text-xs text-red-400">{errors.year}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="tf-rating">Үнэлгээ (0–10) *</Label>
              <Input id="tf-rating" type="number" min={0} max={10} step={0.1} value={form.rating} onChange={(e) => set({ rating: e.target.value })} className={INPUT_CLS} />
              {errors.rating && <p className="text-xs text-red-400">{errors.rating}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="tf-duration">Үргэлжлэл *</Label>
              <Input id="tf-duration" value={form.duration} onChange={(e) => set({ duration: e.target.value })} placeholder="1 ц 52 мин эсвэл 2 Анги" className={INPUT_CLS} />
              {errors.duration && <p className="text-xs text-red-400">{errors.duration}</p>}
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="tf-desc">Тайлбар *</Label>
              <Textarea id="tf-desc" rows={3} value={form.description} onChange={(e) => set({ description: e.target.value })} className={INPUT_CLS} />
              {errors.description && <p className="text-xs text-red-400">{errors.description}</p>}
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="tf-grad">Постирын градиент (CSS) *</Label>
              <div className="flex gap-2">
                <Input
                  id="tf-grad"
                  value={form.posterGradient}
                  onChange={(e) => set({ posterGradient: e.target.value })}
                  className={`${INPUT_CLS} font-mono text-xs`}
                />
                <div
                  aria-hidden
                  className="h-10 w-16 shrink-0 rounded-lg border border-white/15"
                  style={{ background: form.posterGradient || '#000' }}
                  title="Шууд урьдчилан харах"
                />
              </div>
              {errors.posterGradient && <p className="text-xs text-red-400">{errors.posterGradient}</p>}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {GRADIENT_PRESETS.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => set({ posterGradient: p.value })}
                    title={p.name}
                    aria-label={`Градиент сонгох: ${p.name}`}
                    className={`h-7 w-7 rounded-md border transition-transform hover:scale-110 ${
                      form.posterGradient === p.value ? 'border-[#FF3D5A]' : 'border-white/20'
                    }`}
                    style={{ background: p.value }}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Видео (сонголттой)</Label>
              <Select value={form.videoUrl} onValueChange={(v) => set({ videoUrl: v })}>
                <SelectTrigger className={INPUT_CLS} aria-label="Жишээ видео сонгох">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className={`${DARK_PORTAL} border-white/10 bg-[#1A0B12] text-[#F5E8EB]`}>
                  <SelectItem value="none">Байхгүй</SelectItem>
                  {VIDEO_SOURCES.map((v) => (
                    <SelectItem key={v.url} value={v.url}>
                      {v.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Бэкдроп (сонголттой)</Label>
              <Select value={form.backdropUrl} onValueChange={(v) => set({ backdropUrl: v })}>
                <SelectTrigger className={INPUT_CLS} aria-label="Бэкдроп сонгох">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className={`${DARK_PORTAL} border-white/10 bg-[#1A0B12] text-[#F5E8EB]`}>
                  <SelectItem value="none">Байхгүй</SelectItem>
                  {BACKDROPS.map((b) => (
                    <SelectItem key={b.url} value={b.url}>
                      {b.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 sm:col-span-2">
              <Label htmlFor="tf-featured" className="cursor-pointer">
                Онцлох (нүүр hero)
              </Label>
              <Switch id="tf-featured" checked={form.featured} onCheckedChange={(v) => set({ featured: v })} className="data-[state=checked]:bg-[#FF3D5A]" />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2.5">
              <Label htmlFor="tf-new" className="cursor-pointer">
                Шинэ тэмдэглэгээ
              </Label>
              <Switch id="tf-new" checked={form.isNew} onCheckedChange={(v) => set({ isNew: v })} className="data-[state=checked]:bg-[#FF3D5A]" />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2.5">
              <Label htmlFor="tf-active" className="cursor-pointer">
                Идэвхтэй
              </Label>
              <Switch id="tf-active" checked={form.active} onCheckedChange={(v) => set({ active: v })} className="data-[state=checked]:bg-[#FF3D5A]" />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" className={BTN_GHOST} onClick={() => setDialogOpen(false)}>
              Болих
            </Button>
            <Button className={BTN_ACCENT} onClick={save} disabled={!valid || saving}>
              {saving ? 'Хадгалж байна…' : editing ? 'Хадгалах' : 'Нэмэх'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDelete
        open={Boolean(deleteTarget)}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) remove(deleteTarget)
          setDeleteTarget(null)
        }}
        title={`«${deleteTarget?.title ?? ''}» устгах уу?`}
        description="Контент бүртгэлээс бүрмөсөн устгагдана (демо өгөгдөл)."
      />
    </div>
  )
}

// ─────────────────────────── 3. БАГЦ БҮРТГЭЛ ───────────────────────────

function SubsTab({ api }: { api: ReturnType<typeof useApi<StreamSub>> }) {
  const [deleteTarget, setDeleteTarget] = useState<StreamSub | null>(null)

  const setStatus = async (s: StreamSub, status: string) => {
    if (status === s.status) return
    try {
      await api.update(s.id, { status })
      toast.success('Багцын төлөв шинэчлэгдлээ')
    } catch {
      toast.error('Шинэчлэхэд алдаа гарлаа')
    }
  }

  const remove = async (s: StreamSub) => {
    try {
      await api.remove(s.id)
      toast.success('Бүртгэл устгагдлаа')
    } catch {
      toast.error('Устгахад алдаа гарлаа')
    }
  }

  if (api.loading && api.data.length === 0) return <LoadingState label="Бүртгэл ачаалж байна…" />

  return (
    <div className="space-y-4">
      {api.data.length === 0 ? (
        <EmptyState
          title="Багц бүртгэл байхгүй"
          description="Хэрэглэгч багц сонгох үед энд бүртгэгдэнэ (демо урсгал)."
        />
      ) : (
        <div className="overflow-x-auto nice-scroll rounded-xl border border-white/10">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-[#F5E8EB]/60">Багц</TableHead>
                <TableHead className="text-[#F5E8EB]/60">Хэрэглэгч</TableHead>
                <TableHead className="text-[#F5E8EB]/60">Имэйл</TableHead>
                <TableHead className="text-[#F5E8EB]/60">Дүн</TableHead>
                <TableHead className="text-[#F5E8EB]/60">Төлөв</TableHead>
                <TableHead className="text-[#F5E8EB]/60">Огноо</TableHead>
                <TableHead className="text-right text-[#F5E8EB]/60">Үйлдэл</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {api.data.map((s) => (
                <TableRow key={s.id} className="border-white/10">
                  <TableCell className="font-medium text-white">{s.plan}</TableCell>
                  <TableCell>{s.customerName}</TableCell>
                  <TableCell className="text-[#F5E8EB]/75">{s.email}</TableCell>
                  <TableCell className="font-semibold">{fmtMNT(s.amount)}</TableCell>
                  <TableCell>
                    <Select value={s.status} onValueChange={(v) => setStatus(s, v)}>
                      <SelectTrigger
                        className="h-8 w-[140px] border-white/10 bg-white/5 text-[#F5E8EB]"
                        aria-label={`${s.customerName} — багцын төлөв`}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className={`${DARK_PORTAL} border-white/10 bg-[#1A0B12] text-[#F5E8EB]`}>
                        <SelectItem value="идэвхтэй">Идэвхтэй</SelectItem>
                        <SelectItem value="цуцлагдсан">Цуцлагдсан</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-[#F5E8EB]/65">{fmtDateTime(s.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-auto h-8 w-8 text-red-400/80 hover:bg-red-500/15 hover:text-red-400"
                      onClick={() => setDeleteTarget(s)}
                      aria-label={`${s.customerName} — бүртгэл устгах`}
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

      {api.error && (
        <p className="flex items-center gap-2 rounded-xl border border-[#FF3D5A]/30 bg-[#FF3D5A]/10 px-4 py-3 text-xs text-[#F5E8EB]/80">
          <AlertTriangle className="h-4 w-4 shrink-0 text-[#FF3D5A]" aria-hidden />
          {api.error}
        </p>
      )}

      <ConfirmDelete
        open={Boolean(deleteTarget)}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) remove(deleteTarget)
          setDeleteTarget(null)
        }}
        title={`«${deleteTarget?.customerName ?? ''}» багцын бүртгэлийг устгах уу?`}
        description="Энэ үйлдлийг буцаах боломжгүй (демо өгөгдөл)."
      />
    </div>
  )
}
