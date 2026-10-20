'use client'

/**
 * ҮЗЭГ — Багц хуудас: 3 демо багц + бүртгэлийн маягт + демо төлбөрийн урсгал
 */

import { useState } from 'react'
import { Check, CheckCircle2, CreditCard, Info } from 'lucide-react'
import { toast } from 'sonner'
import { FakePaymentModal } from '@/components/shared/demo-kit'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { PageHead } from './chrome'
import {
  ACCENT,
  BTN_ACCENT,
  BTN_GHOST,
  DARK_PORTAL,
  INPUT_CLS,
  fontDisplay,
} from './shared'

type Plan = {
  id: string
  name: string
  price: number
  period: string
  badge?: string
  features: string[]
}

const PLANS: Plan[] = [
  {
    id: 'Сар',
    name: 'Сар',
    price: 9900,
    period: '/ сар',
    features: [
      '1 төхөөрөмж дээр зэрэг үзэх (демо)',
      'HD чанар (демо)',
      'Бүх контентод нээлттэй',
      'Ямар ч үед цуцлах боломжтой',
    ],
  },
  {
    id: 'Жил',
    name: 'Жил',
    price: 79000,
    period: '/ жил',
    badge: 'Хамгийн боломжтой',
    features: [
      '2 төхөөрөмж дээр зэрэг үзэх (демо)',
      'Full HD чанар (демо)',
      'Бүх контентод нээлттэй',
      'Сар бүрийн багцаас 34% хямд (демо тооцоо)',
      'Ямар ч үед цуцлах боломжтой',
    ],
  },
  {
    id: 'Гэр бүл',
    name: 'Гэр бүл',
    price: 14900,
    period: '/ сар',
    features: [
      '4 төхөөрөмж дээр зэрэг үзэх (демо)',
      'Full HD чанар (демо)',
      'Хүүхдийн профайл (демо)',
      'Бүх контентод нээлттэй',
      'Ямар ч үед цуцлах боломжтой',
    ],
  },
]

type Success = { plan: string; name: string; email: string; amount: number }

/** Маягтын түр хадгаламж — төлбөрийн цонх руу дамжуулна */
const pending: { current: { plan: Plan; name: string; email: string } | null } = { current: null }

export function PlansPage() {
  const [formPlan, setFormPlan] = useState<Plan | null>(null)
  const [success, setSuccess] = useState<Success | null>(null)
  const [payOpen, setPayOpen] = useState(false)

  return (
    <div>
      <PageHead
        title="Багц"
        description="Төлөвлөгөөгөө сонгоод үргэлжлүүлээрэй. Энэ бол демо горим — бодит төлбөр авахгүй."
      />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Амжилттай панелийн хуудаснууд */}
        {success && (
          <div className="mb-8 animate-fade-up rounded-xl border border-[#FF3D5A]/40 bg-[#FF3D5A]/10 p-6">
            <div className="flex items-start gap-4">
              <CheckCircle2 className="h-9 w-9 shrink-0 text-[#FF3D5A]" aria-hidden />
              <div className="flex-1">
                <p className="text-lg font-bold text-white" style={fontDisplay}>
                  Багц идэвхжлээ (демо)
                </p>
                <p className="mt-1 text-sm text-[#F5E8EB]/80">
                  <strong>{success.plan}</strong> багц — {success.name} ({success.email}) хэрэглэгчид
                  амжилттай бүртгэгдлээ. Дүн: {success.amount.toLocaleString('mn-MN')}₮. Энэ нь демо
                  гүйлгээ — бодит мөнгө шилжүүлсэнгүй.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className={BTN_GHOST}
                onClick={() => setSuccess(null)}
              >
                Дуусгах
              </Button>
            </div>
          </div>
        )}

        <div className="grid gap-5 md:grid-cols-3">
          {PLANS.map((p) => {
            const popular = Boolean(p.badge)
            return (
              <div
                key={p.id}
                className={`relative flex flex-col rounded-2xl border p-6 backdrop-blur transition-all duration-300 hover:-translate-y-1 ${
                  popular
                    ? 'border-[#FF3D5A]/60 bg-white/[0.07] shadow-[0_0_40px_rgba(255,61,90,0.18)]'
                    : 'border-white/10 bg-white/5 hover:border-white/25'
                }`}
              >
                {p.badge && (
                  <span
                    className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-bold tracking-wide text-white"
                    style={{ background: ACCENT, boxShadow: '0 0 16px rgba(255,61,90,0.5)' }}
                  >
                    {p.badge}
                  </span>
                )}
                <h2 className="text-lg font-semibold text-white" style={fontDisplay}>
                  {p.name}
                </h2>
                <p className="mt-3 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-white" style={fontDisplay}>
                    {p.price.toLocaleString('mn-MN')}₮
                  </span>
                  <span className="text-sm text-[#F5E8EB]/60">{p.period}</span>
                </p>
                <ul className="mt-5 flex-1 space-y-2.5">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-[#F5E8EB]/85">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#FF3D5A]" aria-hidden />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  className={`mt-6 w-full ${BTN_ACCENT}`}
                  onClick={() => setFormPlan(p)}
                  aria-label={`${p.name} багцыг сонгох`}
                >
                  Энэ багцыг сонгох
                </Button>
              </div>
            )
          })}
        </div>

        <p className="mt-8 flex items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 py-3 text-center text-xs text-[#F5E8EB]/55">
          <Info className="h-3.5 w-3.5" aria-hidden />
          Демо горим — бодит төлбөр авахгүй. Төхөөрөмж, чанарын тоо нь жишээ (демо) мэдээлэл.
        </p>
      </div>

      {/* Бүртгэлийн маягт */}
      <PlanFormDialog
        plan={formPlan}
        onClose={() => setFormPlan(null)}
        onPaid={(p, name, email) => {
          setFormPlan(null)
          setPayOpen(true)
          pending.current = { plan: p, name, email }
        }}
      />

      {/* Демо төлбөр */}
      <FakePaymentModal
        open={payOpen}
        onClose={() => setPayOpen(false)}
        amount={pending.current?.plan.price ?? 0}
        merchant="ҮЗЭГ Стриминг"
        accent={ACCENT}
        processPayment={async (outcome) => {
          const ctx = pending.current
          if (!ctx) return
          if (outcome === 'rejected') {
            toast.error('Төлбөр татгалзагдлаа — демо горимын үр дүн. Дахин оролдож болно.')
            return
          }
          try {
            const res = await fetch('/api/stream-subs', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                plan: ctx.plan.name,
                customerName: ctx.name,
                email: ctx.email,
                amount: ctx.plan.price,
                status: 'идэвхтэй',
              }),
            })
            if (!res.ok) throw new Error('fail')
            setSuccess({ plan: ctx.plan.name, name: ctx.name, email: ctx.email, amount: ctx.plan.price })
            toast.success('Багц идэвхжлээ (демо)')
          } catch {
            toast.error('Багц бүртгэхэд алдаа гарлаа — дахин оролдоно уу.')
          }
        }}
      />
    </div>
  )
}

function PlanFormDialog({
  plan,
  onClose,
  onPaid,
}: {
  plan: Plan | null
  onClose: () => void
  onPaid: (plan: Plan, name: string, email: string) => void
}) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [touched, setTouched] = useState(false)

  const errors: { name?: string; email?: string } = {}
  if (name.trim().length < 2) errors.name = 'Нэрээ оруулна уу (хамгийн багадаа 2 тэмдэгт).'
  if (!/^\S+@\S+\.\S+$/.test(email.trim())) errors.email = 'Имэйл хаяг буруу байна (жишээ: name@mail.mn).'
  const valid = Object.keys(errors).length === 0
  const canSubmit = name.trim() !== '' && email.trim() !== ''

  const showError = (field: 'name' | 'email', value: string) =>
    (value !== '' || touched) && errors[field] ? errors[field] : null

  const submit = () => {
    setTouched(true)
    if (!valid || !plan) return
    onPaid(plan, name.trim(), email.trim())
    setName('')
    setEmail('')
    setTouched(false)
  }

  return (
    <Dialog
      open={Boolean(plan)}
      onOpenChange={(o) => {
        if (!o) onClose()
      }}
    >
      <DialogContent className={`${DARK_PORTAL} sm:max-w-md border-white/10 bg-[#1A0B12] text-[#F5E8EB]`}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-[#FF3D5A]" aria-hidden />
            {plan ? `«${plan.name}» багц бүртгүүлэх` : 'Багц бүртгүүлэх'}
          </DialogTitle>
          <DialogDescription className="text-[#F5E8EB]/70">
            Холбоо барих мэдээллээ үлдээгээд төлбөрийн алхам руу шилжинэ үү (демо).
            {plan && (
              <span className="mt-1 block font-semibold text-[#F5E8EB]">
                Дүн: {plan.price.toLocaleString('mn-MN')}₮ {plan.period}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="uzeg-name">Нэр *</Label>
            <Input
              id="uzeg-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Жишээ: Батбаяр Дорж"
              className={INPUT_CLS}
              aria-invalid={touched && Boolean(errors.name)}
            />
            {showError('name', name) && <p className="text-xs text-red-400">{showError('name', name)}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="uzeg-email">Имэйл *</Label>
            <Input
              id="uzeg-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@mail.mn"
              className={INPUT_CLS}
              aria-invalid={touched && Boolean(errors.email)}
            />
            {showError('email', email) && <p className="text-xs text-red-400">{showError('email', email)}</p>}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" className={BTN_GHOST} onClick={onClose}>
            Болих
          </Button>
          <Button className={BTN_ACCENT} onClick={submit} disabled={!canSubmit}>
            Төлбөр хийх
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
