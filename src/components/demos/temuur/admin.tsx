'use client'

/**
 * ТЭМҮҮР Админ — демо админ панель (5 таб):
 * Тайлан · Хүсэлтүүд · Агуулга · Үйл ажиллагаа · Төслүүд
 * Бүх өгөгдөл generic REST API-ас: company-inquiries / company-content / company-services / company-projects
 */

import { useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Building2,
  FolderKanban,
  Inbox,
  MessageSquareText,
  MoveRight,
  Pencil,
  Plus,
  Save,
  Search,
  Trash2,
} from 'lucide-react'
import { toast } from 'sonner'
import { DemoBadge } from '@/components/shared/demo-kit'
import { DemoAdminGate, DemoAdminLogoutButton, useDemoAdminAuth } from '@/components/shared/demo-gate'
import { DemoLink } from '@/lib/hash-router'
import {
  ConfirmDelete,
  DemoDataNote,
  EmptyState,
  LoadingState,
  StatusBadge,
  fmtDate,
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
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { useApi } from '@/lib/use-api'
import {
  C,
  ICON_CHOICES,
  PROJECT_IMAGES,
  SANS,
  SERIF,
  CONTENT_KEYS,
  DEFAULT_CONTENT,
  pickIcon,
  type CompanyContent,
  type CompanyInquiry,
  type CompanyProject,
  type CompanyService,
} from './config'

const INQUIRY_STATUSES = ['шинэ', 'уншсан', 'хариулсан'] as const

// ── Админы самбар ──
function AdminBar({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="bg-[#191C20] text-[#F6F5F2]" style={{ fontFamily: SANS }}>
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-3 pl-[126px] pr-4 sm:pl-[196px] sm:pr-6">
        <div className="flex min-w-0 items-center gap-3">
          <span
            className="truncate text-lg font-semibold tracking-[0.1em]"
            style={{ fontFamily: SERIF }}
          >
            ТЭМҮҮР Админ
          </span>
          <DemoBadge className="hidden shrink-0 border-[#B98A55]/50 bg-[#B98A55]/15 text-[#B98A55] sm:inline-flex">
            Демо админ
          </DemoBadge>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <DemoAdminLogoutButton onLogout={onLogout} />
          <DemoLink
            href="/demo/temuur"
            ariaLabel="Демо сайт руу буцах"
            className="inline-flex items-center gap-1.5 rounded-sm border border-[#F6F5F2]/30 px-3 py-1.5 text-[12px] font-medium text-[#F6F5F2] transition-colors hover:border-[#B98A55] hover:text-[#B98A55]"
          >
            <ArrowLeft className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span className="sr-only sm:not-sr-only">Сайт руу буцах</span>
          </DemoLink>
        </div>
      </div>
    </div>
  )
}

function StatCard({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof Inbox
  value: number
  label: string
}) {
  return (
    <div className="border border-[#E1DCD2] bg-white p-6">
      <div className="flex items-center justify-between">
        <Icon className="h-5 w-5 text-[#8A5A2B]" aria-hidden="true" />
        <span className="h-px w-8 bg-[#8A5A2B]" aria-hidden="true" />
      </div>
      <p className="mt-4 text-4xl font-semibold text-[#1D2126]" style={{ fontFamily: SERIF }}>
        {value}
      </p>
      <p className="mt-1 text-[12px] uppercase tracking-[0.16em] text-[#6E6862]">{label}</p>
    </div>
  )
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null
  return <p className="mt-1 text-[12px] text-red-700">{msg}</p>
}

// ══════════════════ TAB 1 — ТАЙЛАН ══════════════════
function ReportTab() {
  const inq = useApi<CompanyInquiry>('company-inquiries')
  const svc = useApi<CompanyService>('company-services')
  const prj = useApi<CompanyProject>('company-projects')

  const newCount = inq.data.filter((i) => i.status === 'шинэ').length
  const activeServices = svc.data.filter((s) => s.active).length
  const activeProjects = prj.data.filter((p) => p.active).length

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Inbox} value={inq.data.length} label="Нийт хүсэлт" />
        <StatCard icon={MessageSquareText} value={newCount} label="Шинэ хүсэлт" />
        <StatCard icon={Building2} value={activeServices} label="Идэвхтэй үйлчилгээ" />
        <StatCard icon={FolderKanban} value={activeProjects} label="Идэвхтэй төсөл" />
      </div>

      <InquiryPipeline inquiries={inq.data} loading={inq.loading} />

      <div className="border border-[#E1DCD2] bg-white">
        <div className="flex items-center justify-between border-b border-[#E1DCD2] px-5 py-4">
          <h3 className="text-lg font-semibold" style={{ fontFamily: SERIF }}>
            Сүүлийн хүсэлтүүд
          </h3>
          <DemoDataNote />
        </div>
        {inq.loading ? (
          <LoadingState label="Хүсэлтүүдийг ачаалж байна…" />
        ) : inq.data.length === 0 ? (
          <EmptyState title="Хүсэлт байхгүй" description="Одоогоор ирсэн зурвас алга." />
        ) : (
          <ul className="divide-y divide-[#E1DCD2]">
            {inq.data.slice(0, 5).map((i) => (
              <li key={i.id} className="flex flex-wrap items-center justify-between gap-2 px-5 py-3.5" style={{ fontFamily: SANS }}>
                <div className="min-w-0">
                  <p className="truncate text-[14px] font-medium text-[#1D2126]">{i.name}</p>
                  <p className="truncate text-[13px] text-[#6E6862]">{i.subject}</p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="text-[12px] text-[#9A938A]">{fmtDate(i.createdAt)}</span>
                  <StatusBadge status={i.status} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

// ══════════════════ ХҮСЭЛТИЙН ШАТЛАН (pipeline) ══════════════════

const PIPELINE_META: Record<string, { color: string; desc: string }> = {
  'шинэ': { color: '#8A5A2B', desc: 'Шинээр ирсэн, хараахан хугаагүй' },
  'уншсан': { color: '#6E6862', desc: 'Хянаж, дотооддоо шилжүүлсэн' },
  'хариулсан': { color: '#3F5A4C', desc: 'Хариу өгч, төгсгөл болсон' },
}

function InquiryPipeline({ inquiries, loading }: { inquiries: CompanyInquiry[]; loading: boolean }) {
  const total = inquiries.length
  const counts = INQUIRY_STATUSES.map((s) => ({
    status: s,
    count: inquiries.filter((i) => i.status === s).length,
  }))
  const answered = counts.find((c) => c.status === 'хариулсан')?.count ?? 0
  const answerRate = total > 0 ? Math.round((answered / total) * 100) : 0

  return (
    <div className="border border-[#E1DCD2] bg-white">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E1DCD2] px-5 py-4">
        <h3 className="text-lg font-semibold" style={{ fontFamily: SERIF }}>
          Хүсэлтийн шатлан боловсруулалт
        </h3>
        <span className="text-[12px] uppercase tracking-[0.14em] text-[#9A938A]">
          Хариултын хувь: <span className="font-semibold text-[#8A5A2B]">{answerRate}%</span>
        </span>
      </div>

      {loading ? (
        <LoadingState label="Шатлалыг тооцоолж байна…" />
      ) : total === 0 ? (
        <EmptyState title="Мэдээлэл байхгүй" description="Хүсэлт ирсэн үед шатлал энд үүснэ." />
      ) : (
        <div className="px-5 py-6">
          <div className="grid gap-6 sm:grid-cols-3 sm:gap-4">
            {counts.map((c, idx) => {
              const meta = PIPELINE_META[c.status]
              const pct = total > 0 ? Math.round((c.count / total) * 100) : 0
              return (
                <div key={c.status} className="relative">
                  <div className="flex items-baseline gap-3">
                    <span
                      className="text-5xl font-semibold leading-none text-[#1D2126]"
                      style={{ fontFamily: SERIF }}
                    >
                      {String(c.count).padStart(2, '0')}
                    </span>
                    <div className="min-w-0">
                      <p className="flex items-center gap-1.5 text-[13px] font-semibold text-[#1D2126]">
                        <span className="inline-block h-2 w-2" style={{ backgroundColor: meta.color }} aria-hidden />
                        {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                      </p>
                      <p className="truncate text-[12px] text-[#6E6862]">{meta.desc}</p>
                    </div>
                  </div>
                  <div className="mt-3 h-1 w-full bg-[#EDE9E1]">
                    <div
                      className="h-1 transition-all duration-700"
                      style={{ width: `${Math.max(pct, c.count > 0 ? 4 : 0)}%`, backgroundColor: meta.color }}
                    />
                  </div>
                  <p className="mt-1.5 text-[11px] uppercase tracking-[0.14em] text-[#9A938A]">
                    Нийт хүсэлтийн {pct}%
                  </p>
                  {idx < counts.length - 1 && (
                    <MoveRight
                      className="absolute -right-3 top-4 hidden h-5 w-5 text-[#B98A55] sm:block"
                      aria-hidden
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// ══════════════════ TAB 2 — ХҮСЭЛТҮҮД ══════════════════
function InquiriesTab() {
  const inq = useApi<CompanyInquiry>('company-inquiries')
  const [q, setQ] = useState('')
  const [status, setStatus] = useState<string>('all')
  const [selected, setSelected] = useState<CompanyInquiry | null>(null)
  const [nextStatus, setNextStatus] = useState<string>('шинэ')
  const [savingStatus, setSavingStatus] = useState(false)
  const [toDelete, setToDelete] = useState<CompanyInquiry | null>(null)
  const [deleting, setDeleting] = useState(false)

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()
    return inq.data.filter((i) => {
      if (status !== 'all' && i.status !== status) return false
      if (!term) return true
      return (
        i.name.toLowerCase().includes(term) ||
        i.email.toLowerCase().includes(term) ||
        i.subject.toLowerCase().includes(term)
      )
    })
  }, [inq.data, q, status])

  const openDetail = (i: CompanyInquiry) => {
    setSelected(i)
    setNextStatus(i.status)
  }

  const saveStatus = async () => {
    if (!selected) return
    setSavingStatus(true)
    try {
      await inq.update(selected.id, { status: nextStatus })
      toast.success('Төлөв шинэчлэгдлээ')
      setSelected(null)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Төлөв шинэчлэхэд алдаа гарлаа')
    } finally {
      setSavingStatus(false)
    }
  }

  const remove = async () => {
    if (!toDelete) return
    setDeleting(true)
    try {
      await inq.remove(toDelete.id)
      toast.success('Хүсэлтийг устгалаа')
      if (selected?.id === toDelete.id) setSelected(null)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Устгахад алдаа гарлаа')
    } finally {
      setDeleting(false)
      setToDelete(null)
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9A938A]" aria-hidden="true" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Нэр, имэйл, сэдвээр хайх…"
            className="rounded-none border-[#E1DCD2] bg-white pl-9 focus-visible:border-[#8A5A2B] focus-visible:ring-[#8A5A2B]"
            aria-label="Хүсэлт хайх"
          />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[170px] rounded-none border-[#E1DCD2] bg-white focus-visible:ring-[#8A5A2B]" aria-label="Төлөвөөр шүүх">
            <SelectValue placeholder="Төлөв" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Бүх төлөв</SelectItem>
            {INQUIRY_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DemoDataNote />

      <div className="overflow-x-auto border border-[#E1DCD2] bg-white">
        {inq.loading ? (
          <LoadingState label="Ачаалж байна…" />
        ) : filtered.length === 0 ? (
          <div className="p-6">
            <EmptyState
              title="Хүсэлт олдсонгүй"
              description={q || status !== 'all' ? 'Хайлтын нөхцөлд тохирох хүсэлт алга.' : 'Одоогоор ирсэн зурвас алга.'}
            />
          </div>
        ) : (
          <table className="w-full min-w-[640px] text-left text-[13px]" style={{ fontFamily: SANS }}>
            <thead>
              <tr className="border-b border-[#E1DCD2] bg-[#EFECE4] text-[11px] uppercase tracking-[0.14em] text-[#6E6862]">
                <th scope="col" className="px-4 py-3 font-semibold">Нэр</th>
                <th scope="col" className="px-4 py-3 font-semibold">Имэйл</th>
                <th scope="col" className="px-4 py-3 font-semibold">Сэдэв</th>
                <th scope="col" className="px-4 py-3 font-semibold">Огноо</th>
                <th scope="col" className="px-4 py-3 font-semibold">Төлөв</th>
                <th scope="col" className="px-4 py-3 font-semibold text-right">Үйлдэл</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E1DCD2]">
              {filtered.map((i) => (
                <tr key={i.id} className="transition-colors hover:bg-[#F6F5F2]">
                  <td className="px-4 py-3 font-medium text-[#1D2126]">{i.name}</td>
                  <td className="px-4 py-3 text-[#55504A]">{i.email}</td>
                  <td className="max-w-[220px] truncate px-4 py-3 text-[#55504A]">{i.subject}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-[#9A938A]">{fmtDate(i.createdAt)}</td>
                  <td className="px-4 py-3"><StatusBadge status={i.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-[12px] text-[#8A5A2B] hover:bg-[#8A5A2B]/10 hover:text-[#8A5A2B]"
                        onClick={() => openDetail(i)}
                      >
                        <Pencil className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                        Дэлгэрэнгүй
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-700 hover:bg-red-50 hover:text-red-800"
                        onClick={() => setToDelete(i)}
                        aria-label={`${i.name} — хүсэлт устгах`}
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Дэлгэрэнгүй Dialog */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="bg-[#F6F5F2] sm:max-w-lg">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl" style={{ fontFamily: SERIF }}>
                  {selected.subject}
                </DialogTitle>
                <DialogDescription style={{ fontFamily: SANS }}>
                  {selected.name} · {selected.email} · {fmtDate(selected.createdAt)}
                </DialogDescription>
              </DialogHeader>
              <div className="mt-2 border border-[#E1DCD2] bg-white p-4 text-[14px] leading-relaxed text-[#1D2126]" style={{ fontFamily: SANS }}>
                {selected.message}
              </div>
              <div className="mt-5 flex items-center justify-between gap-3" style={{ fontFamily: SANS }}>
                <div className="flex items-center gap-2">
                  <Label htmlFor="inq-status" className="text-[12px] uppercase tracking-wider text-[#6E6862]">
                    Төлөв
                  </Label>
                  <Select value={nextStatus} onValueChange={setNextStatus}>
                    <SelectTrigger id="inq-status" className="w-[140px] rounded-none border-[#E1DCD2] bg-white focus-visible:ring-[#8A5A2B]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {INQUIRY_STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <StatusBadge status={nextStatus} />
                </div>
                <Button
                  className="rounded-none bg-[#8A5A2B] hover:bg-[#724922]"
                  onClick={saveStatus}
                  disabled={savingStatus || nextStatus === selected.status}
                >
                  <Save className="mr-1.5 h-4 w-4" aria-hidden="true" />
                  Хадгалах
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDelete
        open={!!toDelete}
        onOpenChange={(o) => !o && setToDelete(null)}
        onConfirm={remove}
        title="Хүсэлтийг устгах уу?"
        description={`«${toDelete?.name ?? ''}» — гэсэн хүсэлт бүрмөсөн устгагдана. Энэ үйлдлийг буцаах боломжгүй.`}
      />
    </div>
  )
}

// ══════════════════ TAB 3 — АГУУЛГА ══════════════════
function ContentTab() {
  const contentQ = useApi<CompanyContent>('company-content')
  const [drafts, setDrafts] = useState<Record<string, string>>({})
  const [savingKey, setSavingKey] = useState<string | null>(null)

  // DB өгөгдөл ирэхэд боловсруулалтын утгуудыг цэвэрлэнэ (default fallback-тай)
  useEffect(() => {
    const d: Record<string, string> = {}
    for (const k of CONTENT_KEYS) {
      const row = contentQ.data.find((r) => r.key === k.key)
      d[k.key] = row?.value ?? DEFAULT_CONTENT[k.key] ?? ''
    }
    setDrafts(d)
  }, [contentQ.data])

  const saveOne = async (key: string) => {
    const value = drafts[key]
    if (value === undefined) return
    if (!value.trim()) {
      toast.error('Утга хоосон байна', { description: 'Текст оруулна уу.' })
      return
    }
    setSavingKey(key)
    try {
      const existing = contentQ.data.find((r) => r.key === key)
      if (existing) {
        await contentQ.update(existing.id, { value })
      } else {
        await contentQ.create({ key, label: key, value })
      }
      toast.success('Хадгалагдлаа', { description: 'Өөрчлөлт нийтийн хуудас шууд харагдана.' })
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Хадгалахад алдаа гарлаа')
    } finally {
      setSavingKey(null)
    }
  }

  if (contentQ.loading) return <LoadingState label="Агуулгыг ачаалж байна…" />
  if (contentQ.error)
    return <EmptyState title="Ачаалахад алдаа гарлаа" description={contentQ.error} />

  return (
    <div className="space-y-5">
      <div className="border border-[#B98A55]/40 bg-[#8A5A2B]/5 px-4 py-3 text-[13px] text-[#6E6862]" style={{ fontFamily: SANS }}>
        ⓘ Өөрчлөлт нийтийн хуудас шууд харагдана. Түлхүүр бүрийг тусад нь хадгална.
      </div>
      {CONTENT_KEYS.map((k) => (
        <div key={k.key} className="border border-[#E1DCD2] bg-white p-5">
          <Label htmlFor={`ct-${k.key}`} className="text-[12px] font-semibold uppercase tracking-wider text-[#8A5A2B]">
            {k.label}
          </Label>
          <Textarea
            id={`ct-${k.key}`}
            rows={k.key === 'heroSub' || k.key === 'aboutText2' || k.key === 'mission' || k.key === 'vision' ? 3 : 2}
            value={drafts[k.key] ?? ''}
            onChange={(e) => setDrafts((d) => ({ ...d, [k.key]: e.target.value }))}
            className="mt-2 rounded-none border-[#E1DCD2] focus-visible:border-[#8A5A2B] focus-visible:ring-[#8A5A2B]"
            style={{ fontFamily: SANS }}
          />
          <div className="mt-3 flex items-center justify-between">
            <DemoDataNote />
            <Button
              size="sm"
              className="rounded-none bg-[#8A5A2B] hover:bg-[#724922]"
              onClick={() => saveOne(k.key)}
              disabled={savingKey === k.key}
            >
              <Save className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
              {savingKey === k.key ? 'Хадгалж байна…' : 'Хадгалах'}
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}

// ══════════════════ TAB 4 — ҮЙЛ АЖИЛЛАГЭЭ (services CRUD) ══════════════════
type ServiceDraft = { title: string; description: string; icon: string; order: number; active: boolean }
const EMPTY_SERVICE: ServiceDraft = { title: '', description: '', icon: 'Building2', order: 10, active: true }

function ServicesTab() {
  const svc = useApi<CompanyService>('company-services')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<CompanyService | null>(null)
  const [draft, setDraft] = useState<ServiceDraft>(EMPTY_SERVICE)
  const [errors, setErrors] = useState<Partial<Record<keyof ServiceDraft, string>>>({})
  const [saving, setSaving] = useState(false)
  const [toDelete, setToDelete] = useState<CompanyService | null>(null)

  const sortedServices = useMemo(() => [...svc.data].sort((a, b) => a.order - b.order), [svc.data])

  const openCreate = () => {
    setEditing(null)
    setDraft(EMPTY_SERVICE)
    setErrors({})
    setDialogOpen(true)
  }
  const openEdit = (s: CompanyService) => {
    setEditing(s)
    setDraft({ title: s.title, description: s.description, icon: s.icon, order: s.order, active: s.active })
    setErrors({})
    setDialogOpen(true)
  }

  const save = async () => {
    const errs: typeof errors = {}
    if (!draft.title.trim()) errs.title = 'Гарчиг оруулна уу'
    if (!draft.description.trim()) errs.description = 'Тайлбар оруулна уу'
    if (!Number.isFinite(draft.order) || draft.order < 0) errs.order = 'Дараалал 0-аас багагүй тоо байх ёстой'
    setErrors(errs)
    if (Object.keys(errs).length) {
      toast.error('Маягтыг шалгана уу', { description: 'Заавал бөглөх талбарууд дутуу байна.' })
      return
    }
    setSaving(true)
    try {
      const payload = { ...draft, title: draft.title.trim(), description: draft.description.trim() }
      if (editing) await svc.update(editing.id, payload)
      else await svc.create(payload)
      toast.success(editing ? 'Үйлчилгээ шинэчлэгдлээ' : 'Үйлчилгээ нэмэгдлээ')
      setDialogOpen(false)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Хадгалахад алдаа гарлаа')
    } finally {
      setSaving(false)
    }
  }

  const remove = async () => {
    if (!toDelete) return
    try {
      await svc.remove(toDelete.id)
      toast.success('Үйлчилгээг устгалаа')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Устгахад алдаа гарлаа')
    } finally {
      setToDelete(null)
    }
  }

  /** Дарааллыг зэрэгцээ үйлчилгээтэй солих (▲▼) — хоёр бичилтийн order-ыг хооронд нь солино */
  const moveService = async (s: CompanyService, dir: -1 | 1) => {
    const sorted = [...svc.data].sort((a, b) => a.order - b.order)
    const idx = sorted.findIndex((x) => x.id === s.id)
    const neighbor = sorted[idx + dir]
    if (!neighbor) return
    try {
      await svc.update(s.id, { order: neighbor.order })
      await svc.update(neighbor.id, { order: s.order })
      toast.success(dir === -1 ? 'Үйлчилгээг дээш зөөлөө' : 'Үйлчилгээг доош зөөлөө')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Дараалал солиход алдаа гарлаа')
    }
  }

  const IconPreview = pickIcon(draft.icon)

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-semibold" style={{ fontFamily: SERIF }}>
          Үйлчилгээний жагсаалт
        </h3>
        <Button className="rounded-none bg-[#8A5A2B] hover:bg-[#724922]" onClick={openCreate}>
          <Plus className="mr-1.5 h-4 w-4" aria-hidden="true" />
          Шинэ үйлчилгээ
        </Button>
      </div>
      <DemoDataNote />

      <div className="overflow-x-auto border border-[#E1DCD2] bg-white">
        {svc.loading ? (
          <LoadingState label="Ачаалж байна…" />
        ) : svc.data.length === 0 ? (
          <div className="p-6">
            <EmptyState
              title="Үйлчилгээ байхгүй"
              description="«Шинэ үйлчилгээ» товчаар нэмж эхлээрэй."
            />
          </div>
        ) : (
          <table className="w-full min-w-[640px] text-left text-[13px]" style={{ fontFamily: SANS }}>
            <thead>
              <tr className="border-b border-[#E1DCD2] bg-[#EFECE4] text-[11px] uppercase tracking-[0.14em] text-[#6E6862]">
                <th scope="col" className="px-4 py-3 font-semibold">Гарчиг</th>
                <th scope="col" className="px-4 py-3 font-semibold">Icon</th>
                <th scope="col" className="px-4 py-3 font-semibold">Дараалал</th>
                <th scope="col" className="px-4 py-3 font-semibold">Идэвхтэй</th>
                <th scope="col" className="px-4 py-3 font-semibold text-right">Үйлдэл</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E1DCD2]">
              {svc.data.map((s) => {
                const Icon = pickIcon(s.icon)
                return (
                  <tr key={s.id} className="transition-colors hover:bg-[#F6F5F2]">
                    <td className="px-4 py-3">
                      <p className="font-medium text-[#1D2126]">{s.title}</p>
                      <p className="mt-0.5 max-w-md truncate text-[12px] text-[#9A938A]">{s.description}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 text-[#6E6862]">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                        <code className="text-[11px]">{s.icon}</code>
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#55504A]">
                      <div className="flex items-center gap-1">
                        <span className="w-5 tabular-nums">{s.order}</span>
                        <button
                          type="button"
                          onClick={() => moveService(s, -1)}
                          disabled={s === sortedServices[0]}
                          className="flex h-6 w-6 items-center justify-center rounded-none border border-[#E1DCD2] bg-white text-[#6E6862] transition-colors hover:border-[#8A5A2B] hover:text-[#8A5A2B] disabled:cursor-not-allowed disabled:opacity-35"
                          aria-label={`${s.title} — дарааллыг дээш зөөх`}
                          title="Дээш зөөх"
                        >
                          <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveService(s, 1)}
                          disabled={s === sortedServices[sortedServices.length - 1]}
                          className="flex h-6 w-6 items-center justify-center rounded-none border border-[#E1DCD2] bg-white text-[#6E6862] transition-colors hover:border-[#8A5A2B] hover:text-[#8A5A2B] disabled:cursor-not-allowed disabled:opacity-35"
                          aria-label={`${s.title} — дарааллыг доош зөөх`}
                          title="Доош зөөх"
                        >
                          <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={s.active ? 'border-transparent bg-green-100 text-green-800 hover:bg-green-100' : 'border-transparent bg-gray-100 text-gray-500 hover:bg-gray-100'}>
                        {s.active ? 'идэвхтэй' : 'хөдөлгөөнгүй'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-[12px] text-[#8A5A2B] hover:bg-[#8A5A2B]/10 hover:text-[#8A5A2B]"
                          onClick={() => openEdit(s)}
                        >
                          <Pencil className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                          Засах
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-700 hover:bg-red-50 hover:text-red-800"
                          onClick={() => setToDelete(s)}
                          aria-label={`${s.title} — устгах`}
                        >
                          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[#F6F5F2] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: SERIF }}>
              {editing ? 'Үйлчилгээ засах' : 'Шинэ үйлчилгээ'}
            </DialogTitle>
            <DialogDescription style={{ fontFamily: SANS }}>
              Нийтийн хуудасны «Үйл ажиллагаа» хэсэгт шууд харагдана.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4" style={{ fontFamily: SANS }}>
            <div>
              <Label htmlFor="sv-title">Гарчиг *</Label>
              <Input
                id="sv-title"
                value={draft.title}
                onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                className="rounded-none border-[#E1DCD2] focus-visible:border-[#8A5A2B] focus-visible:ring-[#8A5A2B]"
                aria-invalid={!!errors.title}
              />
              <FieldError msg={errors.title} />
            </div>
            <div>
              <Label htmlFor="sv-desc">Тайлбар *</Label>
              <Textarea
                id="sv-desc"
                rows={3}
                value={draft.description}
                onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
                className="rounded-none border-[#E1DCD2] focus-visible:border-[#8A5A2B] focus-visible:ring-[#8A5A2B]"
                aria-invalid={!!errors.description}
              />
              <FieldError msg={errors.description} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sv-icon">Icon</Label>
                <Select value={draft.icon} onValueChange={(v) => setDraft((d) => ({ ...d, icon: v }))}>
                  <SelectTrigger id="sv-icon" className="rounded-none border-[#E1DCD2] bg-white focus-visible:ring-[#8A5A2B]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-72">
                    {ICON_CHOICES.map((name) => {
                      const Ic = pickIcon(name)
                      return (
                        <SelectItem key={name} value={name}>
                          <span className="inline-flex items-center gap-2">
                            <Ic className="h-4 w-4" aria-hidden="true" />
                            {name}
                          </span>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="sv-order">Дараалал *</Label>
                <Input
                  id="sv-order"
                  type="number"
                  min={0}
                  value={draft.order}
                  onChange={(e) => setDraft((d) => ({ ...d, order: Number(e.target.value) }))}
                  className="rounded-none border-[#E1DCD2] focus-visible:border-[#8A5A2B] focus-visible:ring-[#8A5A2B]"
                  aria-invalid={!!errors.order}
                />
                <FieldError msg={errors.order} />
              </div>
            </div>
            <div className="flex items-center justify-between rounded-sm border border-[#E1DCD2] bg-white px-4 py-3">
              <Label htmlFor="sv-active" className="text-[13px]">Нийтийн хуудсанд харагдах</Label>
              <Switch
                id="sv-active"
                checked={draft.active}
                onCheckedChange={(v) => setDraft((d) => ({ ...d, active: v }))}
              />
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="inline-flex items-center gap-2 text-[12px] text-[#6E6862]">
                <IconPreview className="h-4 w-4 text-[#8A5A2B]" aria-hidden="true" />
                Урьдчилан харах
              </span>
              <div className="flex gap-2">
                <Button variant="outline" className="rounded-none" onClick={() => setDialogOpen(false)}>
                  Болих
                </Button>
                <Button className="rounded-none bg-[#8A5A2B] hover:bg-[#724922]" onClick={save} disabled={saving}>
                  <Save className="mr-1.5 h-4 w-4" aria-hidden="true" />
                  {saving ? 'Хадгалж байна…' : 'Хадгалах'}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDelete
        open={!!toDelete}
        onOpenChange={(o) => !o && setToDelete(null)}
        onConfirm={remove}
        title="Үйлчилгээг устгах уу?"
        description={`«${toDelete?.title ?? ''}» бүрмөсөн устгагдана. Энэ үйлдлийг буцаах боломжгүй.`}
      />
    </div>
  )
}

// ══════════════════ TAB 5 — ТӨСЛҮҮД (projects CRUD) ══════════════════
type ProjectDraft = {
  title: string
  description: string
  category: string
  year: string
  imageUrl: string
  order: number
  active: boolean
}
const EMPTY_PROJECT: ProjectDraft = {
  title: '',
  description: '',
  category: '',
  year: String(new Date().getFullYear()),
  imageUrl: PROJECT_IMAGES[0].url,
  order: 10,
  active: true,
}

function ProjectsTab() {
  const prj = useApi<CompanyProject>('company-projects')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<CompanyProject | null>(null)
  const [draft, setDraft] = useState<ProjectDraft>(EMPTY_PROJECT)
  const [errors, setErrors] = useState<Partial<Record<keyof ProjectDraft, string>>>({})
  const [saving, setSaving] = useState(false)
  const [toDelete, setToDelete] = useState<CompanyProject | null>(null)

  /** order-оор эрэмблэгдсэн жагсаалт — дараалал зөөх товчны идэвхжилтийг тодорхойлно */
  const sortedProjects = useMemo(() => [...prj.data].sort((a, b) => a.order - b.order), [prj.data])

  const openCreate = () => {
    setEditing(null)
    setDraft(EMPTY_PROJECT)
    setErrors({})
    setDialogOpen(true)
  }
  const openEdit = (p: CompanyProject) => {
    setEditing(p)
    setDraft({
      title: p.title,
      description: p.description,
      category: p.category,
      year: p.year,
      imageUrl: p.imageUrl || PROJECT_IMAGES[0].url,
      order: p.order,
      active: p.active,
    })
    setErrors({})
    setDialogOpen(true)
  }

  const save = async () => {
    const errs: typeof errors = {}
    if (!draft.title.trim()) errs.title = 'Гарчиг оруулна уу'
    if (!draft.description.trim()) errs.description = 'Тайлбар оруулна уу'
    if (!draft.category.trim()) errs.category = 'Ангилал оруулна уу'
    if (!/^\d{4}$/.test(draft.year.trim())) errs.year = 'Жилийг 4 оронтой тоогоор оруулна уу'
    if (!Number.isFinite(draft.order) || draft.order < 0) errs.order = 'Дараалал 0-аас багагүй тоо байх ёстой'
    setErrors(errs)
    if (Object.keys(errs).length) {
      toast.error('Маягтыг шалгана уу', { description: 'Заавал бөглөх талбарууд дутуу байна.' })
      return
    }
    setSaving(true)
    try {
      const payload = {
        title: draft.title.trim(),
        description: draft.description.trim(),
        category: draft.category.trim(),
        year: draft.year.trim(),
        imageUrl: draft.imageUrl,
        order: draft.order,
        active: draft.active,
      }
      if (editing) await prj.update(editing.id, payload)
      else await prj.create(payload)
      toast.success(editing ? 'Төсөл шинэчлэгдлээ' : 'Төсөл нэмэгдлээ')
      setDialogOpen(false)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Хадгалахад алдаа гарлаа')
    } finally {
      setSaving(false)
    }
  }

  const remove = async () => {
    if (!toDelete) return
    try {
      await prj.remove(toDelete.id)
      toast.success('Төслийг устгалаа')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Устгахад алдаа гарлаа')
    } finally {
      setToDelete(null)
    }
  }

  /** Дарааллыг зэрэгцээ төстэй солих (▲▼) — хоёр бичилтийн order-ыг хооронд нь солино */
  const moveProject = async (p: CompanyProject, dir: -1 | 1) => {
    const sorted = [...prj.data].sort((a, b) => a.order - b.order)
    const idx = sorted.findIndex((x) => x.id === p.id)
    const neighbor = sorted[idx + dir]
    if (!neighbor) return
    try {
      await prj.update(p.id, { order: neighbor.order })
      await prj.update(neighbor.id, { order: p.order })
      toast.success(dir === -1 ? 'Төслийг дээш зөөлөө' : 'Төслийг доош зөөлөө')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Дараалал солиход алдаа гарлаа')
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-semibold" style={{ fontFamily: SERIF }}>
          Төслийн жагсаалт
        </h3>
        <Button className="rounded-none bg-[#8A5A2B] hover:bg-[#724922]" onClick={openCreate}>
          <Plus className="mr-1.5 h-4 w-4" aria-hidden="true" />
          Шинэ төсөл
        </Button>
      </div>
      <DemoDataNote />

      <div className="overflow-x-auto border border-[#E1DCD2] bg-white">
        {prj.loading ? (
          <LoadingState label="Ачаалж байна…" />
        ) : prj.data.length === 0 ? (
          <div className="p-6">
            <EmptyState title="Төсөл байхгүй" description="«Шинэ төсөл» товчаар нэмж эхлээрэй." />
          </div>
        ) : (
          <table className="w-full min-w-[680px] text-left text-[13px]" style={{ fontFamily: SANS }}>
            <thead>
              <tr className="border-b border-[#E1DCD2] bg-[#EFECE4] text-[11px] uppercase tracking-[0.14em] text-[#6E6862]">
                <th scope="col" className="px-4 py-3 font-semibold">Гарчиг</th>
                <th scope="col" className="px-4 py-3 font-semibold">Ангилал</th>
                <th scope="col" className="px-4 py-3 font-semibold">Жил</th>
                <th scope="col" className="px-4 py-3 font-semibold">Дараалал</th>
                <th scope="col" className="px-4 py-3 font-semibold">Идэвхтэй</th>
                <th scope="col" className="px-4 py-3 font-semibold text-right">Үйлдэл</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E1DCD2]">
              {prj.data.map((p) => (
                <tr key={p.id} className="transition-colors hover:bg-[#F6F5F2]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="h-9 w-12 shrink-0 overflow-hidden bg-[#E1DCD2]">
                        {p.imageUrl && (
                          <img src={p.imageUrl} alt="" loading="lazy" className="h-full w-full object-cover" />
                        )}
                      </span>
                      <div className="min-w-0">
                        <p className="font-medium text-[#1D2126]">{p.title}</p>
                        <p className="mt-0.5 max-w-md truncate text-[12px] text-[#9A938A]">{p.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[#55504A]">{p.category}</td>
                  <td className="px-4 py-3 text-[#55504A]">{p.year}</td>
                  <td className="px-4 py-3 text-[#55504A]">
                    <div className="flex items-center gap-1">
                      <span className="w-5 tabular-nums">{p.order}</span>
                      <button
                        type="button"
                        onClick={() => moveProject(p, -1)}
                        disabled={p === sortedProjects[0]}
                        className="flex h-6 w-6 items-center justify-center rounded-none border border-[#E1DCD2] bg-white text-[#6E6862] transition-colors hover:border-[#8A5A2B] hover:text-[#8A5A2B] disabled:cursor-not-allowed disabled:opacity-35"
                        aria-label={`${p.title} — дарааллыг дээш зөөх`}
                        title="Дээш зөөх"
                      >
                        <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveProject(p, 1)}
                        disabled={p === sortedProjects[sortedProjects.length - 1]}
                        className="flex h-6 w-6 items-center justify-center rounded-none border border-[#E1DCD2] bg-white text-[#6E6862] transition-colors hover:border-[#8A5A2B] hover:text-[#8A5A2B] disabled:cursor-not-allowed disabled:opacity-35"
                        aria-label={`${p.title} — дарааллыг доош зөөх`}
                        title="Доош зөөх"
                      >
                        <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge className={p.active ? 'border-transparent bg-green-100 text-green-800 hover:bg-green-100' : 'border-transparent bg-gray-100 text-gray-500 hover:bg-gray-100'}>
                      {p.active ? 'идэвхтэй' : 'хөдөлгөөнгүй'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-[12px] text-[#8A5A2B] hover:bg-[#8A5A2B]/10 hover:text-[#8A5A2B]"
                        onClick={() => openEdit(p)}
                      >
                        <Pencil className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                        Засах
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-700 hover:bg-red-50 hover:text-red-800"
                        onClick={() => setToDelete(p)}
                        aria-label={`${p.title} — устгах`}
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto bg-[#F6F5F2] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: SERIF }}>
              {editing ? 'Төсөл засах' : 'Шинэ төсөл'}
            </DialogTitle>
            <DialogDescription style={{ fontFamily: SANS }}>
              Нийтийн хуудасны «Төслүүд» хэсэгт шууд харагдана.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4" style={{ fontFamily: SANS }}>
            <div>
              <Label htmlFor="pr-title">Гарчиг *</Label>
              <Input
                id="pr-title"
                value={draft.title}
                onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                className="rounded-none border-[#E1DCD2] focus-visible:border-[#8A5A2B] focus-visible:ring-[#8A5A2B]"
                aria-invalid={!!errors.title}
              />
              <FieldError msg={errors.title} />
            </div>
            <div>
              <Label htmlFor="pr-desc">Тайлбар *</Label>
              <Textarea
                id="pr-desc"
                rows={3}
                value={draft.description}
                onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
                className="rounded-none border-[#E1DCD2] focus-visible:border-[#8A5A2B] focus-visible:ring-[#8A5A2B]"
                aria-invalid={!!errors.description}
              />
              <FieldError msg={errors.description} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pr-cat">Ангилал *</Label>
                <Input
                  id="pr-cat"
                  value={draft.category}
                  onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value }))}
                  placeholder="Жишээ: Замын байгууламж"
                  className="rounded-none border-[#E1DCD2] focus-visible:border-[#8A5A2B] focus-visible:ring-[#8A5A2B]"
                  aria-invalid={!!errors.category}
                />
                <FieldError msg={errors.category} />
              </div>
              <div>
                <Label htmlFor="pr-year">Жил *</Label>
                <Input
                  id="pr-year"
                  inputMode="numeric"
                  value={draft.year}
                  onChange={(e) => setDraft((d) => ({ ...d, year: e.target.value }))}
                  placeholder="2025"
                  className="rounded-none border-[#E1DCD2] focus-visible:border-[#8A5A2B] focus-visible:ring-[#8A5A2B]"
                  aria-invalid={!!errors.year}
                />
                <FieldError msg={errors.year} />
              </div>
            </div>
            <div>
              <Label htmlFor="pr-img">Зураг (IMAGE_INDEX — company1..4)</Label>
              <Select value={draft.imageUrl} onValueChange={(v) => setDraft((d) => ({ ...d, imageUrl: v }))}>
                <SelectTrigger id="pr-img" className="rounded-none border-[#E1DCD2] bg-white focus-visible:ring-[#8A5A2B]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PROJECT_IMAGES.map((img) => (
                    <SelectItem key={img.key} value={img.url}>
                      <span className="inline-flex items-center gap-2">
                        <img src={img.url} alt="" className="h-6 w-9 object-cover" />
                        {img.key}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="mt-2 h-24 w-full max-w-[220px] overflow-hidden border border-[#E1DCD2] bg-[#EFECE4]">
                <img src={draft.imageUrl} alt="Урьдчилан харах" loading="lazy" className="h-full w-full object-cover" />
              </div>
            </div>
            <div className="flex items-center justify-between rounded-sm border border-[#E1DCD2] bg-white px-4 py-3">
              <div>
                <Label htmlFor="pr-order" className="text-[13px]">Дараалал *</Label>
                <Input
                  id="pr-order"
                  type="number"
                  min={0}
                  value={draft.order}
                  onChange={(e) => setDraft((d) => ({ ...d, order: Number(e.target.value) }))}
                  className="mt-1 w-24 rounded-none border-[#E1DCD2] focus-visible:border-[#8A5A2B] focus-visible:ring-[#8A5A2B]"
                  aria-invalid={!!errors.order}
                />
                <FieldError msg={errors.order} />
              </div>
              <div className="flex items-center gap-3">
                <Label htmlFor="pr-active" className="text-[13px]">Нийтийн хуудсанд харагдах</Label>
                <Switch
                  id="pr-active"
                  checked={draft.active}
                  onCheckedChange={(v) => setDraft((d) => ({ ...d, active: v }))}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <Button variant="outline" className="rounded-none" onClick={() => setDialogOpen(false)}>
                Болих
              </Button>
              <Button className="rounded-none bg-[#8A5A2B] hover:bg-[#724922]" onClick={save} disabled={saving}>
                <Save className="mr-1.5 h-4 w-4" aria-hidden="true" />
                {saving ? 'Хадгалж байна…' : 'Хадгалах'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDelete
        open={!!toDelete}
        onOpenChange={(o) => !o && setToDelete(null)}
        onConfirm={remove}
        title="Төслийг устгах уу?"
        description={`«${toDelete?.title ?? ''}» бүрмөсөн устгагдана. Энэ үйлдлийг буцаах боломжгүй.`}
      />
    </div>
  )
}

// ══════════════════ ADMIN ROOT ══════════════════
const TABS = [
  { id: 'report', label: 'Тайлан' },
  { id: 'inquiries', label: 'Хүсэлтүүд' },
  { id: 'content', label: 'Агуулга' },
  { id: 'services', label: 'Үйл ажиллагаа' },
  { id: 'projects', label: 'Төслүүд' },
] as const

type TabId = (typeof TABS)[number]['id']

export default function AdminPage() {
  const { authed, pass, logout } = useDemoAdminAuth('temuur-admin-ok')
  if (!authed)
    return (
      <DemoAdminGate title="ТЭМҮҮР Админ" accent="#B98A55" onPass={pass} backHref="/demo/temuur" />
    )
  return <AdminInner onLogout={logout} />
}

function AdminInner({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<TabId>('report')

  const panel: ReactNode =
    tab === 'report' ? (
      <ReportTab />
    ) : tab === 'inquiries' ? (
      <InquiriesTab />
    ) : tab === 'content' ? (
      <ContentTab />
    ) : tab === 'services' ? (
      <ServicesTab />
    ) : (
      <ProjectsTab />
    )

  return (
    <div className="flex flex-1 flex-col" style={{ fontFamily: SANS }}>
      <AdminBar onLogout={onLogout} />

      {/* Top tabs */}
      <div
        role="tablist"
        aria-label="Админ хэсгүүд"
        className="sticky top-0 z-30 border-b border-[#E1DCD2] bg-[#F6F5F2]/95 backdrop-blur"
      >
        <div className="mx-auto flex w-full max-w-7xl gap-1 overflow-x-auto px-4 sm:px-6">
          {TABS.map((t) => {
            const active = tab === t.id
            return (
              <button
                key={t.id}
                role="tab"
                aria-selected={active}
                onClick={() => setTab(t.id)}
                className={`relative whitespace-nowrap px-4 py-3.5 text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8A5A2B] ${
                  active ? 'text-[#8A5A2B]' : 'text-[#6E6862] hover:text-[#1D2126]'
                }`}
              >
                {t.label}
                {active && (
                  <span className="absolute inset-x-2 -bottom-px h-0.5 bg-[#8A5A2B]" aria-hidden="true" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        <div role="tabpanel" aria-label={TABS.find((t) => t.id === tab)?.label}>
          {panel}
        </div>
      </main>

      <footer className="border-t border-[#E1DCD2] bg-white">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-4 text-[12px] text-[#9A938A] sm:px-6">
          <p>ТЭМҮҮР Админ — демо горим. Бодит мэдээлэл биш, концепт брэндийн жишээ өгөгдөл.</p>
          <p>Танилцуулгын жишээ вэбсайт (концепт брэнд)</p>
        </div>
      </footer>
    </div>
  )
}
