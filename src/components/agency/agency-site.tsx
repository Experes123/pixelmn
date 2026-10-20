'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  ArrowRight,
  ArrowUp,
  Check,
  Facebook,
  Instagram,
  Linkedin,
  Menu,
  Search,
  X,
  Youtube,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { fetchByKey } from '@/lib/use-api'
import { fmtMNT } from '@/components/shared/admin-kit'
import {
  BENEFITS,
  DEFAULT_PRICING,
  DISPLAY_FONT,
  NAV_LINKS,
  PROCESS_STEPS,
  SERVICES,
  type PricingPlan,
} from '@/config/agency'
import {
  useSiteContent,
  type ContactContent,
  type FooterContent,
  type HeroContent,
} from '@/lib/site-content'
import { Eyebrow, FadeIn, Logo, SectionHeading } from '@/components/agency/brand'
import { HeroMockup } from '@/components/agency/hero-mockup'
import { PartnersSection } from '@/components/agency/partners-marquee'
import { PortfolioSection } from '@/components/agency/portfolio'
import { ContactSection } from '@/components/agency/inquiry-form'
import { cn } from '@/lib/utils'

/** Хэсэг рүү зөөлөн гүйлгэнэ */
function scrollToSection(id: string) {
  if (id === 'hero') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

/** Гүйлгэлтийн хувь (0–100) — толгойн доод акцент шугам */
function useScrollProgress() {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    let raf = 0
    const read = () => {
      const doc = document.documentElement
      const max = doc.scrollHeight - window.innerHeight
      setProgress(max > 0 ? Math.min(100, Math.max(0, (window.scrollY / max) * 100)) : 0)
    }
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(read)
    }
    read()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])
  return progress
}

/** Үйлчилгээ сонгож, маягт руу урьдчилан утгатай шилжинэ */
function startWithService(title: string) {
  try {
    sessionStorage.setItem('px-service', title)
  } catch {
    /* noop */
  }
  scrollToSection('contact')
  window.dispatchEvent(new CustomEvent('px-prefill'))
}

/** Багц сонгож, маягт руу шилжинэ */
function startWithPlan(name: string) {
  try {
    sessionStorage.setItem('px-plan', name)
  } catch {
    /* noop */
  }
  scrollToSection('contact')
  window.dispatchEvent(new CustomEvent('px-prefill'))
}

/** site-content key='pricing' утгыг хүчинтэй багцын массив болгоно */
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

/** ───────────────────────── Үндсэн вэбсайт ───────────────────────── */
export function AgencySite() {
  // Админ панелаас засварласан контент (байхгүй бол анхдагч утга)
  const { content } = useSiteContent()

  return (
    <div
      className="flex min-h-screen flex-col bg-[#FAFAF8] text-[#0B0B0C]"
      style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
    >
      <SiteHeader />
      <main className="flex-1">
        <HeroSection hero={content.hero} />
        <PartnersSection partners={content.partners} />
        <ServicesSection services={content.services} />
        <AboutSection benefits={content.benefits} steps={content.steps} />
        <PortfolioSection />
        <PricingSection />
        <FaqSection faq={content.faq} />
        <ContactSection contact={content.contact} services={content.services} />
      </main>
      <SiteFooter footer={content.footer} contact={content.contact} services={content.services} />
      <BackToTop />
    </div>
  )
}

/** Дээш гүйлгэх товч — доош гүйлгэсэн үед баруун доод буланд гарч ирнэ */
function BackToTop() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 700)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Хуудасны эхэн рүү гүйлгэх"
      aria-hidden={!show}
      tabIndex={show ? 0 : -1}
      className={cn(
        'fixed bottom-5 right-5 z-40 grid h-11 w-11 place-items-center rounded-full border border-black/10 bg-white/90 text-[#0B0B0C] shadow-[0_8px_24px_-10px_rgba(11,11,12,0.35)] backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-[#E4572E]/50 hover:text-[#E4572E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E4572E]/60',
        show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
      )}
    >
      <ArrowUp className="h-4.5 w-4.5" aria-hidden="true" />
    </button>
  )
}

/** ───────────────── Толгой хэсэг ───────────────── */
function SiteHeader() {
  const [open, setOpen] = useState(false)
  const progress = useScrollProgress()

  const go = (id: string) => {
    setOpen(false)
    scrollToSection(id)
  }

  return (
    <header className="sticky top-0 z-50 border-b border-black/[0.08] bg-[#FAFAF8]/85 backdrop-blur-md">
      {/* Гүйлгэлтийн прогресс — толгойн доод нарийн акцент шугам */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[2px] overflow-hidden"
      >
        <div
          className="h-full origin-left bg-[#E4572E]"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault()
            go('hero')
          }}
          aria-label="Pixelmn — нүүр хуудас"
          className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E4572E]/60"
        >
          <Logo />
        </a>

        <nav aria-label="Үндсэн цэс" className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              onClick={(e) => {
                e.preventDefault()
                go(l.id)
              }}
              className="rounded-full px-3.5 py-2 text-[13.5px] font-medium text-black/60 transition-colors hover:bg-black/[0.04] hover:text-[#0B0B0C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E4572E]/60"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => go('contact')}
            className="group hidden h-10 rounded-full bg-[#E4572E] px-5 text-[13.5px] font-bold text-white shadow-sm transition-all hover:bg-[#d24a22] hover:shadow-[0_10px_28px_-12px_rgba(228,87,46,0.55)] sm:inline-flex"
          >
            Төсөл эхлүүлэх
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                aria-label="Цэс нээх"
                className="rounded-xl border-black/10 bg-white lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] rounded-l-2xl border-black/10">
              <SheetHeader className="text-left">
                <SheetTitle asChild>
                  <div>
                    <Logo size={32} />
                    <span className="sr-only">Pixelmn цэс</span>
                  </div>
                </SheetTitle>
              </SheetHeader>
              <nav aria-label="Гар утасны цэс" className="flex flex-col gap-1 px-4">
                {NAV_LINKS.map((l) => (
                  <a
                    key={l.id}
                    href={`#${l.id}`}
                    onClick={(e) => {
                      e.preventDefault()
                      go(l.id)
                    }}
                    className="rounded-xl px-3 py-2.5 text-[15px] font-medium text-black/70 transition-colors hover:bg-black/[0.04] hover:text-[#0B0B0C]"
                  >
                    {l.label}
                  </a>
                ))}
                <Button
                  onClick={() => go('contact')}
                  className="mt-3 h-11 rounded-xl bg-[#E4572E] font-bold text-white hover:bg-[#d24a22]"
                >
                  Төсөл эхлүүлэх
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

/** ───────────────── Нүүр хэсэг ───────────────── */
function HeroSection({ hero }: { hero: HeroContent }) {
  return (
    <section id="hero" className="relative scroll-mt-24 overflow-hidden py-14 sm:py-20 lg:py-24">
      {/* Зөөлэн гүн: нарийн цэгтэй тор + терракота гэрэлтэлт */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle at 78% 18%, rgba(228,87,46,0.07), transparent 46%), radial-gradient(circle at 8% 82%, rgba(228,87,46,0.045), transparent 40%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage: 'radial-gradient(rgba(11,11,12,0.07) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 60% 30%, black 30%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 60% 30%, black 30%, transparent 75%)',
        }}
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:px-8">
        <FadeIn>
          <Eyebrow>
            <span className="h-1.5 w-1.5 rounded-full bg-[#E4572E]" />
            {hero.eyebrow}
          </Eyebrow>

          <h1
            style={DISPLAY_FONT}
            className="mt-6 text-4xl font-extrabold leading-[1.08] tracking-tight text-[#0B0B0C] sm:text-5xl"
          >
            {hero.title} <span className="text-[#E4572E]">{hero.titleAccent}</span>{' '}
            {hero.titleEnd}
          </h1>

          <p className="mt-6 max-w-xl text-[16px] leading-relaxed text-black/60">
            {hero.subtitle}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              onClick={() => scrollToSection('contact')}
              className="h-12 rounded-full bg-[#E4572E] px-7 text-[15px] font-bold text-white shadow-[0_10px_24px_-10px_rgba(228,87,46,0.6)] hover:bg-[#d24a22]"
            >
              {hero.ctaPrimary}
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              onClick={() => scrollToSection('portfolio')}
              className="h-12 rounded-full border-black/15 bg-white px-7 text-[15px] font-bold text-[#0B0B0C] hover:bg-[#F2F1EE]"
            >
              {hero.ctaSecondary}
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
            {hero.chips.map((t) => (
              <span key={t} className="flex items-center gap-1.5 text-[13px] text-black/55">
                <Check className="h-3.5 w-3.5 text-[#E4572E]" />
                {t}
              </span>
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={0.15} y={30}>
          <HeroMockup />
        </FadeIn>
      </div>
    </section>
  )
}

/** ───────────────── Үйлчилгээ (bento тор) ───────────────── */
function ServicesSection({ services }: { services: { title: string; description: string }[] }) {
  return (
    <section id="services" className="scroll-mt-24 bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Үйлчилгээ"
          title="Манай үйлчилгээ"
          note="Идеас эхлээд найруулга, арчилгаа хүртэл — танай дижитал бүтээгдэхүүний бүх шатыг нэг багаас нийлүүлнэ."
        />

        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-flow-dense lg:grid-cols-3">
          {services.map((s, i) => {
            // Дүрс тэмдэг нь config/agency.ts дахь дарааллаар хэвээр (текстийг админаас засна)
            const Icon = SERVICES[i % SERVICES.length].icon
            const span = SERVICES[i]?.span
            return (
              <FadeIn
                key={`${s.title}-${i}`}
                delay={Math.min(i, 5) * 0.05}
                className={cn(span && 'lg:col-span-2')}
              >
                <div
                  className={cn(
                    'group relative flex h-full flex-col overflow-hidden rounded-2xl border border-black/[0.08] bg-[#FAFAF8] p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-black/[0.14] hover:shadow-[0_18px_40px_-24px_rgba(11,11,12,0.25)]',
                    span && 'lg:p-8'
                  )}
                >
                  {/* Хулгана дээр гарах үед зөөлөн терракота гэрэлтэлт */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#E4572E]/0 blur-2xl transition-all duration-500 group-hover:bg-[#E4572E]/10"
                  />
                  <span
                    aria-hidden="true"
                    style={DISPLAY_FONT}
                    className="pointer-events-none absolute right-5 top-4 text-[26px] font-extrabold leading-none text-black/[0.06] transition-colors duration-300 group-hover:text-[#E4572E]/25"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span
                    className={cn(
                      'flex items-center justify-center rounded-xl bg-[#E4572E]/10 text-[#E4572E] transition-all duration-300 group-hover:bg-[#E4572E] group-hover:text-white',
                      span ? 'h-12 w-12' : 'h-11 w-11'
                    )}
                  >
                    <Icon className={span ? 'h-6 w-6' : 'h-5 w-5'} aria-hidden="true" />
                  </span>
                  <h3
                    style={DISPLAY_FONT}
                    className={cn(
                      'mt-4 font-bold tracking-tight',
                      span ? 'text-xl' : 'text-[17px]'
                    )}
                  >
                    {s.title}
                  </h3>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-black/60">
                    {s.description}
                  </p>
                  <button
                    type="button"
                    onClick={() => startWithService(s.title)}
                    className="group mt-auto inline-flex w-fit items-center gap-1.5 pt-5 text-[13.5px] font-bold text-[#E4572E] transition-colors hover:text-[#d24a22] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E4572E]/60 focus-visible:ring-offset-2"
                  >
                    Төсөл эхлүүлэх
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </button>
                </div>
              </FadeIn>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/** ───────────────── Бидний тухай: давуу тал + ажлын урсгал ───────────────── */
function AboutSection({
  benefits,
  steps,
}: {
  benefits: { title: string; description: string }[]
  steps: { title: string; description: string }[]
}) {
  return (
    <section id="about" className="scroll-mt-24 bg-[#FAFAF8] py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Бидний тухай"
          title="Бизнесэд юу өгөх вэ?"
          note="Вэбсайт бол зүгээр нэг хуудас биш — танай бизнесийн 24 цагийн ажилтан. Бид хийсэн бүх бүтээгдэхүүнээр дараах үр дүнд хүрэхийг зорьдог."
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b, i) => {
            const Icon = BENEFITS[i % BENEFITS.length].icon
            return (
              <FadeIn key={`${b.title}-${i}`} delay={Math.min(i, 5) * 0.05}>
                <div className="flex h-full gap-4 rounded-2xl border border-black/[0.08] bg-white p-6">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0B0B0C] text-white">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 style={DISPLAY_FONT} className="text-[16px] font-bold tracking-tight">
                      {b.title}
                    </h3>
                    <p className="mt-1.5 text-[13.5px] leading-relaxed text-black/60">
                      {b.description}
                    </p>
                  </div>
                </div>
              </FadeIn>
            )
          })}
        </div>

        {/* Ажлын урсгал */}
        <FadeIn className="mt-24">
          <h3
            style={DISPLAY_FONT}
            className="text-2xl font-extrabold tracking-tight sm:text-3xl"
          >
            Ажлын урсгал
          </h3>
          <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-black/55">
            Анхны утсаар холбогдсоноос амжилттай найруулга хүртэл — шат бүр нь тодорхой
            хугацаа, тайлагналтай.
          </p>
        </FadeIn>

        <div className="relative mt-10">
          <div
            aria-hidden="true"
            className="absolute left-0 right-0 top-6 hidden h-px bg-black/[0.08] lg:block"
          />
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-6 lg:gap-4">
            {steps.map((p, i) => {
              const Icon = PROCESS_STEPS[i % PROCESS_STEPS.length].icon
              return (
                <FadeIn key={`${p.title}-${i}`} delay={Math.min(i, 5) * 0.06} className="relative">
                  <span className="group/step relative z-10 flex h-12 w-12 items-center justify-center rounded-full border border-black/[0.08] bg-white text-[#E4572E] shadow-[0_1px_3px_rgba(11,11,12,0.06)] transition-all duration-300 hover:border-[#E4572E] hover:bg-[#E4572E] hover:text-white hover:shadow-[0_8px_20px_-8px_rgba(228,87,46,0.6)]">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <p className="mt-4 text-[11px] font-bold tracking-[0.2em] text-black/30">
                    {String(i + 1).padStart(2, '0')}
                  </p>
                  <h4 style={DISPLAY_FONT} className="mt-1 text-[15.5px] font-bold tracking-tight">
                    {p.title}
                  </h4>
                  <p className="mt-1.5 text-[12.5px] leading-relaxed text-black/55">
                    {p.description}
                  </p>
                </FadeIn>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

/** ───────────────── Үнийн санал ───────────────── */
function PlanPrice({ plan }: { plan: PricingPlan }) {
  if (typeof plan.price === 'number') {
    return (
      <div className="flex flex-wrap items-baseline gap-x-2">
        <span style={DISPLAY_FONT} className="text-[28px] font-extrabold tracking-tight">
          {fmtMNT(plan.price)}
        </span>
        {plan.priceLabel && (
          <span className="text-[12px] font-medium text-black/40">{plan.priceLabel}</span>
        )}
      </div>
    )
  }
  return (
    <div className="flex flex-wrap items-baseline gap-x-2">
      <span style={DISPLAY_FONT} className="text-[22px] font-extrabold tracking-tight">
        {plan.price ?? plan.priceLabel ?? 'Үнийн санал авах'}
      </span>
    </div>
  )
}

function PricingSection() {
  const [dbPlans, setDbPlans] = useState<PricingPlan[] | null>(null)

  // Админаас засварласан бол site-content key='pricing' утгыг уншина, эс тэгвэл конфигийн анхдагч утга
  useEffect(() => {
    let alive = true
    fetchByKey<{ value: unknown }>('site-content', 'pricing')
      .then((row) => {
        if (!alive || !row) return
        const parsed = parsePlans(row.value)
        if (parsed) setDbPlans(parsed)
      })
      .catch(() => {
        /* демо горимд API байхгүй үед анхдагч утга хэвээр үлдэнэ */
      })
    return () => {
      alive = false
    }
  }, [])

  const plans = dbPlans ?? DEFAULT_PRICING

  return (
    <section id="pricing" className="scroll-mt-24 bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Үнийн санал"
          title="Үнийн санал"
          note="Түгээмэл хэрэгцээнд тулгуурласан 4 багц. Эцсийн цар хүрээ, хугацааг таны шаардлагад тулгуурлан хамтдаа тодорхойлно."
        />

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {plans.map((plan, i) => (
            <FadeIn key={plan.name + i} delay={Math.min(i, 3) * 0.06} className="h-full">
              <div
                className={cn(
                  'group relative flex h-full flex-col rounded-2xl border bg-[#FAFAF8] p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-24px_rgba(11,11,12,0.3)]',
                  plan.highlight
                    ? 'border-[#E4572E] shadow-[0_16px_40px_-24px_rgba(228,87,46,0.55)]'
                    : 'border-black/[0.08] hover:border-[#E4572E]/40'
                )}
              >
                {plan.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#E4572E] px-3.5 py-1 text-[11px] font-bold text-white shadow-sm">
                    Хамгийн түгээмэл
                  </span>
                )}
                <h3
                  style={DISPLAY_FONT}
                  className="text-[17px] font-extrabold tracking-tight transition-colors duration-300 group-hover:text-[#E4572E]"
                >
                  {plan.name}
                </h3>
                <div className="mt-3">
                  <PlanPrice plan={plan} />
                </div>
                <p className="mt-3 min-h-[60px] text-[13px] leading-relaxed text-black/60">
                  {plan.description}
                </p>
                <ul className="mt-4 flex flex-col gap-2.5 border-t border-black/[0.06] pt-4">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-[13px] text-black/70">
                      <Check
                        className="mt-0.5 h-4 w-4 shrink-0 text-[#E4572E] transition-transform duration-300 group-hover:scale-110"
                        aria-hidden="true"
                      />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => startWithPlan(plan.name)}
                  className={cn(
                    'mt-6 h-11 w-full rounded-xl font-bold',
                    plan.highlight
                      ? 'bg-[#E4572E] text-white hover:bg-[#d24a22]'
                      : 'border border-black/15 bg-white text-[#0B0B0C] hover:bg-[#F2F1EE]'
                  )}
                  variant={plan.highlight ? 'default' : 'outline'}
                >
                  Төсөл эхлүүлэх
                </Button>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.1}>
          <p className="mt-10 text-center text-[13px] text-black/45">
            Эцсийн хамрах хүрээ, хугацаа нь таны шаардлагад тулгуурласан тохиролцоогоор
            тодорхойлогдоно.
          </p>
        </FadeIn>
      </div>
    </section>
  )
}

/** ───────────────── Түгээмэл асуулт ───────────────── */
function FaqSection({ faq }: { faq: { q: string; a: string }[] }) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return faq.map((item, i) => ({ item, idx: i }))
    return faq.map((item, i) => ({ item, idx: i })).filter(
      ({ item }) => item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q)
    )
  }, [query, faq])

  const searching = query.trim().length > 0

  return (
    <section id="faq" className="scroll-mt-24 bg-[#FAFAF8] py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Түгээмэл асуулт"
          title="Танд асуух зүйл байна уу?"
          align="center"
        />
        <FadeIn delay={0.05}>
          <div className="relative mx-auto mt-8 max-w-md">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-black/35" aria-hidden="true" />
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Асуултаас хайх… жишээ нь: үнэ, хугацаа"
              aria-label="Түгээмэл асуултаас хайх"
              className="h-11 rounded-xl border-black/10 bg-white pl-10 pr-10 text-[14px] focus-visible:ring-[#E4572E]/40 [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-cancel-button]:[-webkit-appearance:none]"
            />
            {searching && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="Хайлтыг цэвэрлэх"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-black/40 transition-colors hover:bg-black/5 hover:text-black/70"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </div>
          {searching && (
            <p className="mt-3 text-center text-[12.5px] text-black/45" role="status" aria-live="polite">
              {filtered.length > 0
                ? `${faq.length} асуултаас ${filtered.length} нь илэрлээ`
                : 'Илэрц байхгүй'}
            </p>
          )}
        </FadeIn>

        <FadeIn delay={0.1}>
          {filtered.length === 0 ? (
            <div className="mt-10 rounded-2xl border border-dashed border-black/15 bg-white px-6 py-12 text-center">
              <p className="text-[15px] font-semibold">Тохирох асуулт олдсонгүй</p>
              <p className="mx-auto mt-2 max-w-sm text-[13px] leading-relaxed text-black/55">
                Өөр үгээр хайж үзээрэй, эсвэл доорх маягтаар шууд асуултаа үлдээгээрэй — бид хариу өгөх болно.
              </p>
              <Button
                variant="outline"
                className="mt-5 rounded-xl border-black/15 bg-white hover:bg-[#F2F1EE]"
                onClick={() => setQuery('')}
              >
                Бүх асуултыг харах
              </Button>
            </div>
          ) : (
            <Accordion type="single" collapsible className="mt-10 flex flex-col gap-3">
              {filtered.map(({ item, idx }) => (
                <AccordionItem
                  key={`${item.q}-${idx}`}
                  value={`faq-${idx}`}
                  className="rounded-2xl border border-black/[0.08] bg-white px-5 transition-all duration-300 last:border-b data-[state=open]:border-[#E4572E]/35 data-[state=open]:shadow-[0_14px_34px_-22px_rgba(228,87,46,0.45)]"
                >
                  <AccordionTrigger className="py-4 text-left text-[15px] font-semibold tracking-tight transition-colors hover:no-underline data-[state=open]:text-[#E4572E] [&_svg]:transition-colors [&[data-state=open]_svg]:text-[#E4572E]">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 text-[13.5px] leading-relaxed text-black/60">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </FadeIn>
      </div>
    </section>
  )
}

/** ───────────────── Хөл хэсэг ───────────────── */
const SOCIAL_ITEMS = [
  { key: 'facebook', icon: Facebook, label: 'Facebook' },
  { key: 'instagram', icon: Instagram, label: 'Instagram' },
  { key: 'linkedin', icon: Linkedin, label: 'LinkedIn' },
  { key: 'youtube', icon: Youtube, label: 'YouTube' },
] as const

function SiteFooter({
  footer,
  contact,
  services,
}: {
  footer: FooterContent
  contact: ContactContent
  services: { title: string }[]
}) {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-auto bg-[#0B0B0C] text-white">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr_1.2fr]">
          <div>
            <Logo dark />
            <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-white/50">
              {footer.tagline}
            </p>
            <div className="mt-5 flex gap-2">
              {SOCIAL_ITEMS.map((s) => {
                const url = footer.socials[s.key]
                const base =
                  'flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E4572E]'
                return url ? (
                  <a
                    key={s.key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className={cn(base, 'hover:border-white/30 hover:text-white')}
                  >
                    <s.icon className="h-4 w-4" aria-hidden="true" />
                  </a>
                ) : (
                  <span
                    key={s.key}
                    aria-label={`${s.label} — удахгүй`}
                    title="Удахгүй"
                    className={cn(base, 'cursor-default opacity-60')}
                  >
                    <s.icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                )
              })}
            </div>
          </div>

          <FooterCol title="Үйлчилгээ">
            {services.slice(0, 5).map((s) => (
              <FooterLink key={s.title} onClick={() => scrollToSection('services')}>
                {s.title}
              </FooterLink>
            ))}
          </FooterCol>

          <FooterCol title="Компани">
            <FooterLink onClick={() => scrollToSection('about')}>Бидний тухай</FooterLink>
            <FooterLink onClick={() => scrollToSection('about')}>Ажлын урсгал</FooterLink>
            <FooterLink onClick={() => scrollToSection('partners')}>Хамтын ажиллагаа</FooterLink>
            <FooterLink onClick={() => scrollToSection('faq')}>Түгээмэл асуулт</FooterLink>
          </FooterCol>

          <FooterCol title="Мэдээлэл">
            <FooterLink href="#/privacy">Нууцлалын бодлого</FooterLink>
            <FooterLink href="#/terms">Үйлчилгээний нөхцөл</FooterLink>
            <FooterLink onClick={() => scrollToSection('portfolio')}>
              Демо төслүүд
            </FooterLink>
          </FooterCol>

          <FooterCol title="Холбоо барих">
            <p className="text-[13px] leading-relaxed text-white/55">
              {contact.email}
              <br />
              {contact.phone}
              <br />
              {contact.address}
            </p>
            <button
              type="button"
              onClick={() => scrollToSection('contact')}
              className="mt-3 w-fit text-[13px] font-semibold text-[#E4572E] transition-colors hover:text-[#ff7a52] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E4572E]"
            >
              Хүсэлт илгээх →
            </button>
          </FooterCol>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[12px] text-white/40">
            © {year} Pixelmn. Бүх эрх хамгаалагдсан.
          </p>
          <p className="text-[12px] text-white/40">
            Демо төслүүд болон энэ вэбсайт нь {year} оны загвар хувилбар.
          </p>
        </div>
      </div>
    </footer>
  )
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3
        style={DISPLAY_FONT}
        className="mb-4 text-[12px] font-bold uppercase tracking-[0.18em] text-white/35"
      >
        {title}
      </h3>
      <div className="flex flex-col gap-2.5">{children}</div>
    </div>
  )
}

function FooterLink({
  onClick,
  href,
  children,
}: {
  onClick?: () => void
  href?: string
  children: React.ReactNode
}) {
  const cls =
    'group relative w-fit text-left text-[13px] text-white/55 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E4572E]'
  const underline = (
    <span
      aria-hidden="true"
      className="absolute -bottom-0.5 left-0 h-px w-0 bg-[#E4572E] transition-all duration-300 group-hover:w-full"
    />
  )
  if (href) {
    return (
      <a href={href} className={cls}>
        {children}
        {underline}
      </a>
    )
  }
  return (
    <button type="button" onClick={onClick} className={cls}>
      {children}
      {underline}
    </button>
  )
}
