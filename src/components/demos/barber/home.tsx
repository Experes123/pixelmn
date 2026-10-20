'use client'

/**
 * ГАН Barbershop — Нүүр хуудас.
 * Hero, үйлчилгээ, залаачид, ажлын цаг + хаяг, захиалгын CTA.
 */

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { buttonVariants } from '@/components/ui/button'
import { DemoLink } from '@/lib/hash-router'
import { useApi } from '@/lib/use-api'
import { EmptyState, LoadingState, fmtMNT } from '@/components/shared/admin-kit'
import { cn } from '@/lib/utils'
import {
  CalendarDays,
  ChevronDown,
  Clock,
  MapPin,
  Phone,
  Scissors,
  Sparkles,
} from 'lucide-react'
import {
  BARBER_IMAGES,
  CategoryChip,
  IMG,
  Kicker,
  SectionHead,
  btnGold,
  btnOutline,
  catLabel,
  fmtDur,
  noiseStyle,
  serifStyle,
  type Barber,
  type Service,
} from './parts'

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.55, ease: 'easeOut' as const },
}

const HOURS: { day: string; time: string; off?: boolean }[] = [
  { day: 'Давгаараа', time: '10:00 – 20:00' },
  { day: 'Мягмар гараг', time: '10:00 – 20:00' },
  { day: 'Лхагва гараг', time: '10:00 – 20:00' },
  { day: 'Пүрэв гараг', time: '10:00 – 20:00' },
  { day: 'Баасан гараг', time: '10:00 – 20:00' },
  { day: 'Бямба гараг', time: '10:00 – 20:00' },
  { day: 'Ням гараг', time: 'Амралт', off: true },
]

export default function HomePage() {
  const servicesApi = useApi<Service>('barber-services')
  const barbersApi = useApi<Barber>('barbers')
  const [cat, setCat] = useState<string>('бүгд')

  const services = useMemo(
    () => servicesApi.data.filter((s) => s.active && (cat === 'бүгд' || s.category === cat)),
    [servicesApi.data, cat]
  )
  const barbers = useMemo(() => barbersApi.data.filter((b) => b.active), [barbersApi.data])

  const scrollToServices = () =>
    document.getElementById('g-services')?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  return (
    <div>
      {/* ── HERO ── */}
      <section className="relative flex min-h-[92vh] items-center overflow-hidden">
        <img
          src={IMG.hero}
          alt="ГАН Barbershop — дотор галзуу засалт интерьер"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#171310]/85 via-[#171310]/55 to-[#171310]" />
        <div className="absolute inset-0" style={noiseStyle} aria-hidden="true" />

        <div className="relative mx-auto w-full max-w-6xl px-5 pb-24 pt-32 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <Kicker>БАРБЕРШОП · УЛААНБААТАР</Kicker>
            <h1
              className="mt-6 max-w-3xl text-4xl leading-[1.1] sm:text-6xl lg:text-7xl"
              style={serifStyle}
            >
              Ер бусын хэв маяг.
              <br />
              <em className="italic text-[#C9973B]">Ган шиг чанар.</em>
            </h1>
            <p className="mt-7 max-w-xl text-base leading-relaxed text-[#CDBFA9] sm:text-lg">
              Өрөөсөн аягүй нарийн зүс, уламжлалт барберын урлагийг орчин үеийн загварт
              нийлүүлсэн эрэгтэйчүүдийн арчилгааны орон зай. Мэргэжлийн залаачид, цэвэр
              агаар, нэг цагийн гүн тайвшрал.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <DemoLink
                href="/demo/barber/booking"
                ariaLabel="Цаг захиалах"
                className={cn(buttonVariants({ size: 'lg' }), btnGold)}
              >
                <CalendarDays className="h-4 w-4" />
                Цаг захиалах
              </DemoLink>
              <button
                type="button"
                onClick={scrollToServices}
                className={cn(buttonVariants({ size: 'lg', variant: 'outline' }), btnOutline)}
              >
                Үйлчилгээүүд
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-14 flex flex-wrap gap-x-10 gap-y-3 border-t border-[#C9973B33] pt-6 text-[11px] uppercase tracking-[0.25em] text-[#A89A87]">
              <span className="inline-flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-[#C9973B]" /> Дав–Бям · 10:00–20:00
              </span>
              <span>Ням · Амралт</span>
              <span className="inline-flex items-center gap-2">
                <Scissors className="h-3.5 w-3.5 text-[#C9973B]" /> 2015 оноос хойш
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── ҮЙЛЧИЛГЭЭ ── */}
      <section id="g-services" className="scroll-mt-20 px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <motion.div {...fadeUp}>
            <SectionHead
              kicker="ҮЙЛЧИЛГЭЭ"
              title={
                <>
                  Цэвэр <em className="italic text-[#C9973B]">зүслэг</em>, тодорхой үнэ
                </>
              }
              sub="Үнийн дүнд угаалт, загварчлал багтана. Хугацааг хэрэглэгч тус бүрт тохируулан өгнө."
            />
          </motion.div>

          {/* Ангиллын шүүлтүүр */}
          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {['бүгд', 'үс', 'сахлис', 'хосолсон', 'арчилгаа'].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCat(c)}
                aria-pressed={cat === c}
                className={cn(
                  'rounded-full border px-4 py-1.5 text-xs uppercase tracking-wider transition-colors',
                  cat === c
                    ? 'border-[#C9973B] bg-[#C9973B] text-[#171310] font-semibold'
                    : 'border-[#C9973B44] text-[#A89A87] hover:border-[#C9973B88] hover:text-[#F3EBDD]'
                )}
              >
                {catLabel(c)}
              </button>
            ))}
          </div>

          <div className="mt-8">
            {servicesApi.loading ? (
              <LoadingState label="Үйлчилгээүүдийг ачаалж байна…" />
            ) : servicesApi.error ? (
              <EmptyState
                title="Үйлчилгээ ачаалахад алдаа гарлаа"
                description={servicesApi.error}
                action={
                  <button type="button" onClick={servicesApi.reload} className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), btnOutline)}>
                    Дахин оролдох
                  </button>
                }
              />
            ) : services.length === 0 ? (
              <EmptyState title="Үйлчилгээ олдсонгүй" description="Энэ ангилалд одоогоор үйлчилгээ бүртгэгдээгүй байна." />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {services.map((s, i) => (
                  <motion.article
                    key={s.id}
                    {...fadeUp}
                    transition={{ ...fadeUp.transition, delay: (i % 3) * 0.06 }}
                    className="group flex flex-col rounded-lg border border-[#C9973B33] bg-[#221B15] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#C9973B66] hover:shadow-[0_18px_40px_-20px_rgba(201,151,59,0.45)]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-xl leading-snug transition-colors duration-300 group-hover:text-[#F3EBDD]" style={serifStyle}>
                        {s.name}
                      </h3>
                      <CategoryChip label={catLabel(s.category)} />
                    </div>
                    <p className="mt-2.5 min-h-[42px] flex-1 text-sm leading-relaxed text-[#A89A87]">
                      {s.description}
                    </p>
                    <div className="mt-5 flex items-center justify-between border-t border-[#C9973B26] pt-4">
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-semibold text-[#C9973B] transition-colors duration-300 group-hover:text-[#D8A84F]">
                          {fmtMNT(s.price)}
                        </span>
                        <span className="text-xs text-[#A89A87]">{fmtDur(s.durationMin)}</span>
                      </div>
                      <DemoLink
                        href="/demo/barber/booking"
                        className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C9973B] transition-colors hover:text-[#D8A84F]"
                        ariaLabel={`${s.name} — цаг захиалах`}
                      >
                        Захиалах <span className="inline-block transition-transform duration-300 group-hover:translate-x-1" aria-hidden>→</span>
                      </DemoLink>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── МАНАЙ ЗАЛААЧИД ── */}
      <section className="border-y border-[#C9973B33] bg-[#12100D] px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <motion.div {...fadeUp}>
            <SectionHead
              kicker="МАНАЙ ЗАЛААЧИД"
              title={
                <>
                  Гарт нь <em className="italic text-[#C9973B]">урлаг</em> буй хүмүүс
                </>
              }
              sub="Тэн хагас зууны туршлагатай ахлах залаачаас залуу авьяасанууд хүртэл — хэн нь ч өөрийн гэсэн хэв маягтай."
            />
          </motion.div>

          <div className="mt-12">
            {barbersApi.loading ? (
              <LoadingState label="Залаачдыг ачаалж байна…" />
            ) : barbers.length === 0 ? (
              <EmptyState title="Залаач олдсонгүй" description="Одоогоор залаачийн мэдээлэл бүртгэгдээгүй байна." />
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {barbers.map((b, i) => (
                  <motion.article
                    key={b.id}
                    {...fadeUp}
                    transition={{ ...fadeUp.transition, delay: (i % 4) * 0.07 }}
                    className="group overflow-hidden rounded-lg border border-[#C9973B33] bg-[#221B15]"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden">
                      <img
                        src={b.imageUrl || BARBER_IMAGES[0]}
                        alt={`${b.name} — ${b.title}`}
                        loading="lazy"
                        className="h-full w-full object-cover grayscale-[35%] transition-all duration-500 group-hover:scale-[1.03] group-hover:grayscale-0"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#221B15] via-transparent to-transparent" />
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg" style={serifStyle}>
                        {b.name}
                      </h3>
                      <p className="mt-0.5 text-sm italic text-[#C9973B]">{b.title}</p>
                      <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-[#A89A87]">
                        {b.bio}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {b.specialties
                          .split(',')
                          .map((t) => t.trim())
                          .filter(Boolean)
                          .slice(0, 3)
                          .map((t) => (
                            <span
                              key={t}
                              className="rounded-full border border-[#C9973B33] px-2 py-0.5 text-[10px] uppercase tracking-wide text-[#A89A87]"
                            >
                              {t}
                            </span>
                          ))}
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── АЖЛЫН ЦАГ + ХАЯГ ── */}
      <section className="px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
          <motion.div {...fadeUp} className="rounded-xl border border-[#C9973B33] bg-[#221B15] p-7 sm:p-9">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-[#C9973B]" />
              <h3 className="text-2xl" style={serifStyle}>
                Ажлын цаг
              </h3>
            </div>
            <ul className="mt-6 divide-y divide-[#C9973B26]">
              {HOURS.map((h) => (
                <li key={h.day} className="flex items-center justify-between py-2.5 text-sm">
                  <span className="text-[#CDBFA9]">{h.day}</span>
                  <span className={h.off ? 'text-[#C96A3B]' : 'font-medium text-[#F3EBDD]'}>
                    {h.time}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-xs leading-relaxed text-[#A89A87]">
              * Сүүлийн захиалгыг ажлын өдрийн 19:30-ы өмнө хийж болно. Дуудлагаар
              захиалах бол утсаар холбогдоно уу.
            </p>
          </motion.div>

          <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.08 }} className="rounded-xl border border-[#C9973B33] bg-[#221B15] p-7 sm:p-9">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-[#C9973B]" />
              <h3 className="text-2xl" style={serifStyle}>
                Хаяг, холбоо барих
              </h3>
            </div>
            <div className="mt-6 space-y-5 text-sm">
              <div className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#C9973B]" />
                <div>
                  <p className="font-medium">Дэлгүүрийн хаяг</p>
                  <p className="mt-1 text-[#A89A87]">
                    Улаанбаатар хот, Сүхбаатар дүүрэг, __-р хороо, __-р гудамж,
                    ____ төв, __ давхар
                    <span className="mt-1 block text-[11px] uppercase tracking-wider text-[#C9973B]">
                      (Демо — жишээ хаяг)
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#C9973B]" />
                <div>
                  <p className="font-medium">Утас</p>
                  <p className="mt-1 text-[#A89A87]">
                    +976 7010-____ (жишээ дугаар)
                    <span className="mt-1 block text-[11px] uppercase tracking-wider text-[#C9973B]">
                      (Демо — жишээ мэдээлэл)
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[#C9973B]" />
                <div>
                  <p className="font-medium">Тав тух</p>
                  <p className="mt-1 text-[#A89A87]">
                    Үнэгүй кофе, Wi-Fi, гарталны арчилгааны булан, хүлээлгүй захиалга.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA БАННЕР ── */}
      <section className="px-5 pb-24 sm:px-8">
        <motion.div
          {...fadeUp}
          className="relative mx-auto max-w-6xl overflow-hidden rounded-xl border border-[#C9973B44]"
        >
          <img
            src={IMG.cta}
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#171310] via-[#171310]/85 to-[#171310]/40" />
          <div className="absolute inset-0" style={noiseStyle} aria-hidden="true" />
          <div className="relative flex flex-col items-start gap-6 px-7 py-12 sm:flex-row sm:items-center sm:justify-between sm:px-12 sm:py-16">
            <div>
              <Kicker>ОНЛайн ЗАХИАЛГА</Kicker>
              <h3 className="mt-3 max-w-lg text-3xl leading-tight sm:text-4xl" style={serifStyle}>
                Өнөөдөр цагаа нөөцлөөрэй — <em className="italic text-[#C9973B]">илүү сайхан гараа.</em>
              </h3>
              <p className="mt-3 max-w-md text-sm text-[#A89A87]">
                1 минутад үйлчилгээ, залаач, цагаа сонгон онлайн төлбөрөө хийгээрэй.
              </p>
            </div>
            <DemoLink
              href="/demo/barber/booking"
              ariaLabel="Цаг захиалах"
              className={cn(buttonVariants({ size: 'lg' }), btnGold)}
            >
              <CalendarDays className="h-4 w-4" />
              Цаг захиалах
            </DemoLink>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
