'use client'

/**
 * Холбоо барих маягт — react-hook-form + zod валадаци (Монгол мессежтэй).
 * POST /api/company-inquiries
 */

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CheckCircle2, Loader2, Send } from 'lucide-react'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { C, SERIF, SANS } from './config'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const schema = z.object({
  name: z.string().trim().min(1, 'Энэ талбарыг бөглөнө үү').max(120, 'Хэт урт байна'),
  email: z
    .string()
    .trim()
    .min(1, 'Энэ талбарыг бөглөнө үү')
    .regex(EMAIL_RE, 'Зөв имэйл хаяг оруулна уу'),
  subject: z.string().trim().min(1, 'Энэ талбарыг бөглөнө үү').max(200, 'Хэт урт байна'),
  message: z.string().trim().min(1, 'Энэ талбарыг бөглөнө үү').min(10, 'Хамгийн багадаа 10 тэмдэгт бичнэ үү'),
})

type FormValues = z.infer<typeof schema>

const fieldCls =
  'rounded-none border-[#E1DCD2] bg-white focus-visible:ring-[#8A5A2B] focus-visible:border-[#8A5A2B]'

export function InquiryForm() {
  const [sent, setSent] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', subject: '', message: '' },
  })

  const onSubmit = async (values: FormValues) => {
    setServerError(null)
    try {
      const res = await fetch('/api/company-inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string }
        throw new Error(j.error || 'Илгээхэд алдаа гарлаа. Дахин оролдоно уу.')
      }
      setSent(true)
      reset()
      toast.success('Зурвас илгээгдлээ', { description: 'Баярлалаа — бид тун удалгүй холбогдоно.' })
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Илгээхэд алдаа гарлаа'
      setServerError(msg)
      toast.error('Илгээхэд алдаа гарлаа', { description: msg })
    }
  }

  if (sent) {
    return (
      <div
        className="flex h-full min-h-[320px] flex-col items-center justify-center border border-[#E1DCD2] bg-white px-8 py-12 text-center"
        role="status"
        aria-live="polite"
      >
        <CheckCircle2 className="h-12 w-12 text-[#8A5A2B]" />
        <h3 className="mt-4 text-xl font-semibold" style={{ fontFamily: SERIF }}>
          Зурвас амжилттай илгээгдлээ
        </h3>
        <p className="mt-2 max-w-xs text-[14px] leading-relaxed text-[#6E6862]" style={{ fontFamily: SANS }}>
          Бид тун удалгүй холбогдоно. Хариултыг имэйл хаягтаа шалгаж байгаарай.
        </p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="mt-6 border border-[#8A5A2B] px-5 py-2 text-[13px] font-medium text-[#8A5A2B] transition-colors hover:bg-[#8A5A2B] hover:text-white"
          style={{ fontFamily: SANS }}
        >
          Шинэ зурвас илгээх
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="border border-[#E1DCD2] bg-white p-6 sm:p-8"
      style={{ fontFamily: SANS }}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="iq-name" className="text-[12px] font-medium uppercase tracking-wider text-[#6E6862]">
            Нэр <span className="text-[#8A5A2B]">*</span>
          </Label>
          <Input
            id="iq-name"
            {...register('name')}
            placeholder="Овог, нэрээ бичнэ үү"
            aria-invalid={!!errors.name}
            className={fieldCls}
          />
          {errors.name && <p className="text-[12px] text-red-700">{errors.name.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="iq-email" className="text-[12px] font-medium uppercase tracking-wider text-[#6E6862]">
            Имэйл <span className="text-[#8A5A2B]">*</span>
          </Label>
          <Input
            id="iq-email"
            type="email"
            {...register('email')}
            placeholder="name@example.com"
            aria-invalid={!!errors.email}
            className={fieldCls}
          />
          {errors.email && <p className="text-[12px] text-red-700">{errors.email.message}</p>}
        </div>
      </div>

      <div className="mt-5 space-y-1.5">
        <Label htmlFor="iq-subject" className="text-[12px] font-medium uppercase tracking-wider text-[#6E6862]">
          Сэдэв <span className="text-[#8A5A2B]">*</span>
        </Label>
        <Input
          id="iq-subject"
          {...register('subject')}
          placeholder="Жишээ нь: Хамтын ажиллагааны санал"
          aria-invalid={!!errors.subject}
          className={fieldCls}
        />
        {errors.subject && <p className="text-[12px] text-red-700">{errors.subject.message}</p>}
      </div>

      <div className="mt-5 space-y-1.5">
        <Label htmlFor="iq-message" className="text-[12px] font-medium uppercase tracking-wider text-[#6E6862]">
          Зурвас <span className="text-[#8A5A2B]">*</span>
        </Label>
        <Textarea
          id="iq-message"
          rows={5}
          {...register('message')}
          placeholder="Санал, асуултаа дэлгэрэнгүй бичнэ үү…"
          aria-invalid={!!errors.message}
          className={`${fieldCls} resize-y`}
        />
        {errors.message && <p className="text-[12px] text-red-700">{errors.message.message}</p>}
      </div>

      {serverError && (
        <p className="mt-4 border border-red-200 bg-red-50 px-3 py-2 text-[13px] text-red-700" role="alert">
          {serverError}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 bg-[#8A5A2B] px-6 py-3 text-[14px] font-semibold tracking-wide text-white transition-colors hover:bg-[#724922] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Илгээж байна…
          </>
        ) : (
          <>
            <Send className="h-4 w-4" aria-hidden="true" />
            Зурвас илгээх
          </>
        )}
      </button>
      <p className="mt-3 text-[11px] leading-relaxed text-[#6E6862]">
        ⓘ Энэ бол жишээ маягт — оруулсан мэдээлэл зөвхөн энэ демо сайтад хадгалагдана.
      </p>
    </form>
  )
}
