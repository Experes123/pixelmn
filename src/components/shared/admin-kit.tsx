'use client'

import { type ReactNode } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Loader2, Inbox } from 'lucide-react'
import { cn } from '@/lib/utils'

export const fmtMNT = (n: number) => n.toLocaleString('mn-MN') + '₮'

const p2 = (n: number) => String(n).padStart(2, '0')

/** Монгол стандартын YYYY.MM.DD формат (runtime ICU-аас хамаарахгүй) */
export const fmtDate = (d: string | Date) => {
  const dt = new Date(d)
  if (Number.isNaN(dt.getTime())) return ''
  return `${dt.getFullYear()}.${p2(dt.getMonth() + 1)}.${p2(dt.getDate())}`
}

/** YYYY.MM.DD HH:mm — 24 цагийн формат */
export const fmtDateTime = (d: string | Date) => {
  const dt = new Date(d)
  if (Number.isNaN(dt.getTime())) return ''
  return `${fmtDate(dt)} ${p2(dt.getHours())}:${p2(dt.getMinutes())}`
}

const STATUS_COLORS: Record<string, string> = {
  // ерөнхий
  шинэ: 'bg-blue-50 text-blue-700 border-blue-200',
  уншсан: 'bg-amber-50 text-amber-700 border-amber-200',
  хариулсан: 'bg-green-50 text-green-700 border-green-200',
  хаагдсан: 'bg-gray-100 text-gray-600 border-gray-200',
  // захиалга/захиалга төлөв
  хүлээгдэж: 'bg-amber-50 text-amber-700 border-amber-200',
  баталгаажсан: 'bg-green-50 text-green-700 border-green-200',
  дууссан: 'bg-gray-100 text-gray-600 border-gray-200',
  цуцлагдсан: 'bg-red-50 text-red-700 border-red-200',
  идэвхтэй: 'bg-green-50 text-green-700 border-green-200',
  'хүлээн авсан': 'bg-blue-50 text-blue-700 border-blue-200',
  'бэлтгэж байна': 'bg-amber-50 text-amber-700 border-amber-200',
  'хүргэлтэд гарсан': 'bg-violet-50 text-violet-700 border-violet-200',
  'хүргэлтэд': 'bg-violet-50 text-violet-700 border-violet-200',
  хүргэгдсэн: 'bg-green-50 text-green-700 border-green-200',
  бүртгэгдсэн: 'bg-blue-50 text-blue-700 border-blue-200',
  'баглааж байна': 'bg-amber-50 text-amber-700 border-amber-200',
  боломжтой: 'bg-green-50 text-green-700 border-green-200',
  эзлэгдсэн: 'bg-red-50 text-red-700 border-red-200',
  // төлбөр
  төлөгдсөн: 'bg-green-50 text-green-700 border-green-200',
  'төлөгдөөгүй': 'bg-amber-50 text-amber-700 border-amber-200',
  буцаагдсан: 'bg-red-50 text-red-700 border-red-200',
}

/** Төлөвийн өнгөт бэйдж */
export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const color = STATUS_COLORS[status] ?? 'bg-gray-100 text-gray-600 border-gray-200'
  return (
    <span
      className={cn(
        'inline-flex items-center whitespace-nowrap rounded-full border px-2 py-0.5 text-xs font-medium',
        color,
        className
      )}
    >
      {status}
    </span>
  )
}

/** Хоосон төлөв */
export function EmptyState({
  title,
  description,
  action,
  icon,
}: {
  title: string
  description?: string
  action?: ReactNode
  icon?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-6 py-14 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-muted">
        {icon ?? <Inbox className="h-5 w-5 text-muted-foreground" />}
      </div>
      <p className="font-medium">{title}</p>
      {description && <p className="max-w-sm text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}

/** Ачааллын төлөв */
export function LoadingState({ label = 'Ачаалж байна…' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-14 text-muted-foreground" role="status" aria-live="polite">
      <Loader2 className="h-6 w-6 animate-spin" />
      <p className="text-sm">{label}</p>
    </div>
  )
}

/** Устгах баталгаажуулалтын диалог */
export function ConfirmDelete({
  open,
  onOpenChange,
  onConfirm,
  title = 'Устгахдаа итгэлтэй байна уу?',
  description = 'Энэ үйлдлийг буцаах боломжгүй.',
  confirmLabel = 'Тийм, устгах',
}: {
  open: boolean
  onOpenChange: (o: boolean) => void
  onConfirm: () => void
  title?: string
  description?: string
  confirmLabel?: string
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Болих</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600 hover:bg-red-700"
            onClick={(e) => {
              e.preventDefault()
              onConfirm()
              onOpenChange(false)
            }}
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

/** Демо дата шошго — админ панель дотор бодит дата биш гэдгийг тодорхойлно */
export function DemoDataNote({ className }: { className?: string }) {
  return (
    <p className={cn('text-xs text-muted-foreground', className)}>
      ⓘ Энд харагдаж буй бүх мэдээлэл нь демо өгөгдөл юм.
    </p>
  )
}
