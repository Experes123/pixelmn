'use client'

import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CheckCircle2, Loader2, Mail, MapPin, Phone, Send } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DISPLAY_FONT } from '@/config/agency'
import type { ContactContent, ServiceText } from '@/lib/site-content'
import { SectionHeading, FadeIn } from '@/components/agency/brand'

const BUDGET_OPTIONS = [
  '500,000₮ хүртэл',
  '500,000₮–1,500,000₮',
  '1,500,000₮–3,000,000₮',
  '3,000,000₮-аас дээш',
  'Тодорхойгүй',
] as const

/** Үйлчилгээ сонгосон үед «Төслийн дэлгэрэнгүй мэдээлэл» талбарын жишээ үлгэрчилсэн текст */
const PLACEHOLDER_TEMPLATES: Record<string, string> = {
  'Вэбсайт хөгжүүлэлт':
    'Жишээ нь: байгууллагын 5 хуудастай вэбсайт, монгол/англи хэлтэй, мэдээний хэсэгтэй байхыг хүсэж байна…',
  'UI/UX дизайн':
    'Жишээ нь: мобайл аппын интерфэйсийг 6 дэлгэцээр зохиож, дизайн систем бэлдэхийг хүсэж байна…',
  'Брэнд хөгжүүлэлт':
    'Жишээ нь: шинэ лого, өнгөний палитр, фонтоо нэгтгэсэн брэндийн тогтмол загвар хэрэгтэй байна…',
  'Landing page хөгжүүлэлт':
    'Жишээ нь: шинэ бүтээгдэхүүний кампаанд зориулсан нэг хуудастай, маягттай landing page хэрэгтэй байна…',
  'Цахим худалдааны систем':
    'Жишээ нь: ~100 бүтээгдэхүүнтэй цахим дэлгүүр, ангилал, сагс, QPay төлбөртэй байхыг хүсэж байна…',
  'Бизнес автоматжуулалт':
    'Жишээ нь: захиалга, бүртгэлийг гараар хөтлөх ажлаа нэг системд шилжүүлж, тайланг хялбар гаргахыг хүсэж байна…',
  'AI интеграц':
    'Жишээ нь: сайтаасаа түгээмэл асуултад автомат хариу өгөх монгол хэлний чатбот нэмэхийг хүсэж байна…',
  'Мобайл апп хөгжүүлэлт':
    'Жишээ нь: захиалга хүлээн авах, мэдэгдэл илгээх PWA апп хэрэгтэй байна…',
  'Вэбсайт арчилгаа засвар үйлчилгээ':
    'Жишээ нь: ажиллагаанд байгаа сайтаа сар бүр нөөцлөж, жижиг засвар, шинэчлэлт хийлгэхийг хүсэж байна…',
}

/** Үйлчилгээ сонгоогүй үеийн анхдагч үлгэрчилсэн текст */
const DEFAULT_PLACEHOLDER =
  'Танай бизнес, одоо байгаа вэбсайт, хүсэж буй функц, хугацааны хүрээ гэх мэт мэдээллийг бичнэ үү…'

const formSchema = z.object({
  name: z.string().min(1, 'Энэ талбарыг бөглөнө үү'),
  email: z
    .string()
    .min(1, 'Энэ талбарыг бөглөнө үү')
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, { message: 'Зөв имэйл хаяг оруулна уу' }),
  company: z.string().optional(),
  serviceType: z.string().min(1, 'Энэ талбарыг бөглөнө үү'),
  budget: z.string().min(1, 'Энэ талбарыг бөглөнө үү'),
  details: z.string().min(1, 'Энэ талбарыг бөглөнө үү'),
})

type FormValues = z.infer<typeof formSchema>

/** Холбоо барих хэсэг — зүүн талын мэдээлэл + баруун талд маягт */
export function ContactSection({
  contact,
  services,
}: {
  contact: ContactContent
  services: ServiceText[]
}) {
  return (
    <section id="contact" className="scroll-mt-24 bg-[#FAFAF8] py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.2fr] lg:gap-16 lg:px-8">
        <div>
          <SectionHeading
            eyebrow="Холбоо барих"
            title="Төслөө эхлүүлцгээе"
            note="Маягтыг бөглөж үлдээгээрэй — танай хэрэгцээг судлаад 1-2 хоногийн дотор холбогдож, үнэгүй зөвлөгөө өгнө."
          />

          <FadeIn delay={0.1} className="mt-8 flex flex-col gap-3">
            <ContactRow icon={<Mail className="h-4 w-4" />} label="Имэйл" value={contact.email} />
            <ContactRow icon={<Phone className="h-4 w-4" />} label="Утас" value={contact.phone} />
            <ContactRow icon={<MapPin className="h-4 w-4" />} label="Хаяг" value={contact.address} />
          </FadeIn>

          <MapPlaceholder />
        </div>

        <FadeIn delay={0.1}>
          <InquiryForm services={services} />
        </FadeIn>
      </div>
    </section>
  )
}

function ContactRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-black/[0.08] bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-black/[0.14] hover:shadow-[0_10px_28px_rgba(11,11,12,0.07)] motion-reduce:hover:translate-y-0">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E4572E]/10 text-[#E4572E] transition-colors duration-300 group-hover:bg-[#E4572E]/15">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-black/40">
          {label}
        </p>
        <p className="truncate text-[15px] font-semibold text-[#0B0B0C]">{value}</p>
      </div>
    </div>
  )
}

/** Байршлын загвар газрын зураг — SVG дизайн (гадны зураг, бодит байршил ашиглахгүй) */
function MapPlaceholder() {
  return (
    <FadeIn delay={0.2} className="mt-6">
      <div className="relative overflow-hidden rounded-2xl border border-black/[0.08] bg-[#EFEDE8] shadow-[0_1px_3px_rgba(11,11,12,0.05)]">
        <svg viewBox="0 0 400 180" className="block h-44 w-full sm:h-48" role="img" aria-label="Байршлын газрын зургийн загвар — тохируулаагүй">
          <defs>
            <pattern id="px-mapgrid" width="26" height="26" patternUnits="userSpaceOnUse">
              <path d="M 26 0 L 0 0 0 26" fill="none" stroke="#0B0B0C" strokeOpacity="0.05" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="400" height="180" fill="url(#px-mapgrid)" />
          {/* Багтаамж блокууд */}
          <rect x="42" y="22" width="48" height="32" rx="7" fill="#0B0B0C" fillOpacity="0.05" />
          <rect x="152" y="18" width="54" height="36" rx="7" fill="#0B0B0C" fillOpacity="0.05" />
          <rect x="224" y="128" width="66" height="40" rx="7" fill="#0B0B0C" fillOpacity="0.05" />
          <rect x="318" y="26" width="52" height="30" rx="7" fill="#0B0B0C" fillOpacity="0.05" />
          {/* Замууд */}
          <path d="M-10 122 C 80 112, 140 132, 200 120 S 330 94, 410 106" fill="none" stroke="#0B0B0C" strokeOpacity="0.12" strokeWidth="10" strokeLinecap="round" />
          <path d="M120 -10 C 128 42, 108 92, 128 190" fill="none" stroke="#0B0B0C" strokeOpacity="0.08" strokeWidth="7" strokeLinecap="round" />
          <path d="M300 -10 C 292 52, 316 122, 302 190" fill="none" stroke="#0B0B0C" strokeOpacity="0.08" strokeWidth="6" strokeLinecap="round" />
          {/* Голчлон зам — акцент */}
          <path d="M-10 62 C 90 54, 210 72, 410 56" fill="none" stroke="#E4572E" strokeOpacity="0.2" strokeWidth="4" strokeLinecap="round" strokeDasharray="10 8" />
          {/* Пин — амьд цохилтот цэг */}
          <circle cx="200" cy="118" r="18" fill="#E4572E" fillOpacity="0.16">
            <animate attributeName="r" values="14;30;14" dur="2.6s" repeatCount="indefinite" />
            <animate attributeName="fill-opacity" values="0.2;0.04;0.2" dur="2.6s" repeatCount="indefinite" />
          </circle>
          <g transform="translate(183 87) scale(1.42)">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" fill="#E4572E" stroke="#FFFFFF" strokeWidth="1.6" />
            <circle cx="12" cy="10" r="3" fill="#FFFFFF" />
          </g>
        </svg>
        <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-white/85 px-3 py-1 text-[11px] font-semibold text-black/55 shadow-sm backdrop-blur">
          <MapPin className="h-3 w-3 text-[#E4572E]" aria-hidden="true" />
          Байршлын зураг — тохируулаагүй (загвар)
        </div>
      </div>
    </FadeIn>
  )
}

/** ───────────────── Хүсэлтийн маягт ───────────────── */
export function InquiryForm({ services }: { services: ServiceText[] }) {
  const [submitted, setSubmitted] = useState(false)
  const [serverError, setServerError] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      company: '',
      serviceType: '',
      budget: '',
      details: '',
    },
  })

  // Үйлчилгээний төрөл сонгогдвол оруулах талбарын үлгэрчилсэн текст тухайн үйлчилгээнд тохирно
  const serviceType = form.watch('serviceType')
  const detailPlaceholder = PLACEHOLDER_TEMPLATES[serviceType] ?? DEFAULT_PLACEHOLDER

  // sessionStorage-аас үйлчилгээ/багцын сонголтыг урьдчилан дүүргэнэ
  useEffect(() => {
    const apply = () => {
      try {
        const service = sessionStorage.getItem('px-service')
        if (service) {
          form.setValue('serviceType', service, { shouldValidate: true })
          sessionStorage.removeItem('px-service')
        }
        const plan = sessionStorage.getItem('px-plan')
        if (plan) {
          const current = form.getValues('details')
          if (!current) {
            form.setValue('details', `Сонгосон багц: ${plan}`, { shouldValidate: false })
          }
          sessionStorage.removeItem('px-plan')
        }
      } catch {
        /* sessionStorage боломжгүй үед алгасна */
      }
    }
    const t = setTimeout(apply, 0)
    window.addEventListener('px-prefill', apply)
    return () => {
      clearTimeout(t)
      window.removeEventListener('px-prefill', apply)
    }
  }, [form])

  const onSubmit = async (values: FormValues) => {
    setServerError(false)
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          company: values.company || null,
          serviceType: values.serviceType,
          budget: values.budget,
          details: values.details,
        }),
      })
      if (!res.ok) throw new Error('Илгээхэд алдаа гарлаа')
      setSubmitted(true)
      toast.success('Хүсэлт амжилттай илгээгдлээ.')
    } catch {
      setServerError(true)
      toast.error('Илгээхэд алдаа гарлаа. Дахин оролдоно уу.')
    }
  }

  if (submitted) {
    return (
      <div className="flex h-full min-h-[420px] flex-col items-center justify-center rounded-2xl border border-black/[0.08] bg-white p-8 text-center shadow-[0_1px_3px_rgba(11,11,12,0.05)]">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
          <CheckCircle2 className="h-7 w-7 text-emerald-600" />
        </span>
        <h3 style={DISPLAY_FONT} className="mt-5 text-xl font-extrabold tracking-tight text-[#0B0B0C]">
          Хүсэлт амжилттай илгээгдлээ
        </h3>
        <p className="mt-2 max-w-sm text-[14px] leading-relaxed text-black/60">
          Бид 1-2 хоногийн дотор холбогдоно. Маягтад үлдээсэн имэйл хаягаар танай хүсэлтийн
          дэлгэрэнгүйг илгээх болно.
        </p>
        <Button
          variant="outline"
          className="mt-6 rounded-full border-black/15 px-6"
          onClick={() => {
            form.reset()
            setSubmitted(false)
          }}
        >
          Шинэ хүсэлт илгээх
        </Button>
      </div>
    )
  }

  const errors = form.formState.errors

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      noValidate
      className="rounded-2xl border border-black/[0.08] bg-white p-6 shadow-[0_1px_3px_rgba(11,11,12,0.05)] sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Нэр" required error={errors.name?.message}>
          <Input
            placeholder="Таны нэр"
            aria-invalid={!!errors.name}
            className="h-11 rounded-xl"
            {...form.register('name')}
          />
        </Field>

        <Field label="Имэйл хаяг" required error={errors.email?.message}>
          <Input
            type="email"
            placeholder="you@company.mn"
            aria-invalid={!!errors.email}
            className="h-11 rounded-xl"
            {...form.register('email')}
          />
        </Field>

        <div className="sm:col-span-2">
          <Field label="Компани, байгууллага" error={errors.company?.message}>
            <Input
              placeholder="Жишээ: ХХК, дэлгүүр, клуб…"
              className="h-11 rounded-xl"
              {...form.register('company')}
            />
          </Field>
        </div>

        <Field label="Үйлчилгээний төрөл" required error={errors.serviceType?.message}>
          <Controller
            control={form.control}
            name="serviceType"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  aria-invalid={!!errors.serviceType}
                  className="h-11 w-full rounded-xl"
                >
                  <SelectValue placeholder="Үйлчилгээ сонгоно уу" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((s) => (
                    <SelectItem key={s.title} value={s.title}>
                      {s.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Field>

        <Field label="Төсөв" required error={errors.budget?.message}>
          <Controller
            control={form.control}
            name="budget"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger aria-invalid={!!errors.budget} className="h-11 w-full rounded-xl">
                  <SelectValue placeholder="Төсөвт хүрээ сонгоно уу" />
                </SelectTrigger>
                <SelectContent>
                  {BUDGET_OPTIONS.map((b) => (
                    <SelectItem key={b} value={b}>
                      {b}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Field>

        <div className="sm:col-span-2">
          <Field label="Төслийн дэлгэрэнгүй мэдээлэл" required error={errors.details?.message}>
            <Textarea
              rows={5}
              placeholder={detailPlaceholder}
              aria-invalid={!!errors.details}
              className="rounded-xl"
              {...form.register('details')}
            />
          </Field>
        </div>
      </div>

      {serverError && (
        <p
          role="alert"
          className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-medium text-red-700"
        >
          Илгээхэд алдаа гарлаа. Дахин оролдоно уу.
        </p>
      )}

      <Button
        type="submit"
        disabled={form.formState.isSubmitting}
        className="mt-6 h-12 w-full rounded-xl bg-[#E4572E] text-[15px] font-bold text-white transition-all hover:bg-[#d24a22] hover:shadow-[0_10px_30px_rgba(228,87,46,0.35)] active:scale-[0.99] motion-reduce:transition-none sm:w-auto sm:px-10"
      >
        {form.formState.isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Илгээж байна…
          </>
        ) : (
          <>
            Хүсэлт илгээх
            <Send className="h-4 w-4" />
          </>
        )}
      </Button>
    </form>
  )
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string
  required?: boolean
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-[13px] font-semibold text-black/70">
        {label}
        {required && <span className="ml-1 text-[#E4572E]">*</span>}
      </Label>
      {children}
      {error && <p className="text-[12px] font-medium text-red-600">{error}</p>}
    </div>
  )
}
