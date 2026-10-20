'use client'

import { useState, type ReactNode } from 'react'
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
import { CreditCard, ShieldCheck, Loader2, CheckCircle2, XCircle } from 'lucide-react'
import { goHomeToPortfolio } from '@/lib/hash-router'
import { cn } from '@/lib/utils'

type Props = {
  open: boolean
  onClose: () => void
  amount: number
  merchant: string
  accent?: string // брендийн өнгө (CSS color)
  /** Амжилттай төлбөрийн дараах нэмэлт үйлдэл (жишээ: захиалга үүсгэх). outcome: 'approved' | 'rejected' */
  processPayment?: (outcome: 'approved' | 'rejected') => Promise<void>
}

const fmt = (n: number) => n.toLocaleString('mn-MN') + '₮'

/**
 * ДЕМО төлбөрийн цонх — бодит карт цуглуулдаггүй, бодит төлбөр авдаггүй.
 * Тест төлбөрийн гурван үр дүнг дууриалдаг: зөвшөөрөгдсөн, татгалзсан, цуцлагдсан.
 */
export function FakePaymentModal({
  open,
  onClose,
  amount,
  merchant,
  accent = '#E4572E',
  processPayment,
}: Props) {
  const [phase, setPhase] = useState<'form' | 'processing' | 'approved' | 'rejected'>('form')
  const [card, setCard] = useState('4111 1111 1111 1111')
  const [holder, setHolder] = useState('ТЭСТ ХЭРЭГЛЭГЧ')
  const [expiry, setExpiry] = useState('12/28')
  const [cvv, setCvv] = useState('123')

  const reset = () => setPhase('form')

  const close = () => {
    onClose()
    setTimeout(reset, 200)
  }

  const pay = async (outcome: 'approved' | 'rejected') => {
    setPhase('processing')
    await new Promise((r) => setTimeout(r, 1400))
    try {
      await processPayment?.(outcome)
    } catch {
      /* алдааг эцэг компонент мэднэ */
    }
    setPhase(outcome)
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && close()}>
      <DialogContent className="sm:max-w-md [&>button]:hidden">
        <DialogHeader>
          <div
            className="mx-auto mb-1 flex h-11 w-11 items-center justify-center rounded-full"
            style={{ backgroundColor: `${accent}1A` }}
          >
            <CreditCard className="h-5 w-5" style={{ color: accent }} />
          </div>
          <DialogTitle className="text-center text-lg">Демо төлбөрийн систем</DialogTitle>
          <DialogDescription className="text-center">
            {merchant} — <span className="font-semibold text-foreground">{fmt(amount)}</span>
          </DialogDescription>
        </DialogHeader>

        <div
          className="mb-3 rounded-lg border border-dashed px-3 py-2 text-center text-xs leading-relaxed text-muted-foreground"
          role="note"
        >
          Энэ бол <strong>ДЕМО горим</strong> — бодит карт мэдээлэл цуглуулахгүй, бодит төлбөр
          авахгүй. Зөвхөн тест карт ашиглана.
        </div>

        {phase === 'form' && (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="pay-card">Картын дугаар (тест)</Label>
              <Input
                id="pay-card"
                value={card}
                onChange={(e) => setCard(e.target.value)}
                className="font-mono"
                inputMode="numeric"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-3 space-y-1.5 sm:col-span-1">
                <Label htmlFor="pay-holder">Эзэмшигч</Label>
                <Input id="pay-holder" value={holder} onChange={(e) => setHolder(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pay-exp">Хүчинтэй</Label>
                <Input id="pay-exp" value={expiry} onChange={(e) => setExpiry(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pay-cvv">CVV</Label>
                <Input id="pay-cvv" value={cvv} onChange={(e) => setCvv(e.target.value)} />
              </div>
            </div>

            <Button
              className="w-full transition-transform active:scale-[0.98]"
              style={{ backgroundColor: accent }}
              onClick={() => pay('approved')}
            >
              <ShieldCheck className="mr-2 h-4 w-4" />
              {fmt(amount)} төлөх
            </Button>

            {/* Тест төлбөрийн өөр үр дүнгүүд — демо горимын тодорхой хяналт */}
            <div className="flex items-center justify-center gap-2 pt-1 text-xs text-muted-foreground">
              <span>Тест үр дүн:</span>
              <button
                type="button"
                className="underline underline-offset-2 hover:text-foreground"
                onClick={() => pay('rejected')}
              >
                Татгалзах
              </button>
              <span>·</span>
              <button
                type="button"
                className="underline underline-offset-2 hover:text-foreground"
                onClick={close}
              >
                Цуцлах
              </button>
            </div>
          </div>
        )}

        {phase === 'processing' && (
          <div className="flex flex-col items-center gap-3 py-8" role="status" aria-live="polite">
            <Loader2 className="h-8 w-8 animate-spin" style={{ color: accent }} />
            <p className="text-sm text-muted-foreground">Төлбөрийг боловсруулж байна…</p>
          </div>
        )}

        {phase === 'approved' && (
          <div className="flex flex-col items-center gap-3 py-6" aria-live="polite">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
            <p className="font-semibold">Төлбөр амжилттай баталгаажлаа</p>
            <p className="text-center text-sm text-muted-foreground">
              Энэ нь демо гүйлгээ — бодит мөнгө шилжүүлсэнгүй.
            </p>
            <Button className="mt-1 w-full transition-transform active:scale-[0.98]" style={{ backgroundColor: accent }} onClick={close}>
              Дуусгах
            </Button>
          </div>
        )}

        {phase === 'rejected' && (
          <div className="flex flex-col items-center gap-3 py-6" aria-live="polite">
            <XCircle className="h-10 w-10 text-red-600" />
            <p className="font-semibold">Төлбөр татгалзагдлаа</p>
            <p className="text-center text-sm text-muted-foreground">
              Демо горимын татгалзах үр дүн сонгогдсон. Дахин оролдож болно.
            </p>
            <Button variant="outline" className="mt-1 w-full" onClick={reset}>
              Дахин оролдох
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

/** Демо горимын бэйдж — хүүхэд текст өгвөл түүнийг, эс бөгөөс «DEMO»-г харуулна */
export function DemoBadge({ className, children }: { className?: string; children?: ReactNode }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider',
        className
      )}
    >
      {children ?? 'DEMO'}
    </span>
  )
}

/** Үндсэн сайт руу буцах — бүх демо вэбсайтад зүүн дээд буланд байх ёстой */
export function ReturnToMain({ accent = '#E4572E', dark = false }: { accent?: string; dark?: boolean }) {
  return (
    <a
      href="#/"
      onClick={(e) => {
        e.preventDefault()
        goHomeToPortfolio()
      }}
      className={cn(
        'fixed left-3 top-3 z-[90] inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-medium shadow-md backdrop-blur transition-all hover:scale-[1.03] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2',
        dark ? 'border-white/15 bg-black/60 text-white' : 'border-black/10 bg-white/85 text-neutral-900'
      )}
      aria-label="Үндсэн сайт руу буцах"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M19 12H5" />
        <path d="m12 19-7-7 7-7" />
      </svg>
      {/* Маш жижиг дэлгэцэнд зөвхөн сум — демо логотипоо дарагдахаас сэрж */}
      <span className="sr-only sm:not-sr-only">Үндсэн сайт руу буцах</span>
    </a>
  )
}
