'use client'

/**
 * ТЭМҮҮР Групп — нүүр хуудас (single-page corporate).
 * Бүх контент API-ас (company-content / company-services / company-projects),
 * хоосон үед sensible defaults.
 */

import { useMemo, useState } from 'react'
import { ArrowRight, BookOpenCheck, Compass, Quote, Target } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { useApi } from '@/lib/use-api'
import {
  IMG,
  SANS,
  SERIF,
  DEFAULT_CONTENT,
  DEFAULT_PROJECTS,
  DEFAULT_SERVICES,
  TEAM,
  initialsOf,
  pickIcon,
  scrollToId,
  type CompanyContent,
  type CompanyProject,
  type CompanyService,
} from './config'
import { InquiryForm } from './inquiry-form'

// ── Хэсгийн гарчгийн блок: нимгэн зэс шугам + жижиг шошго + serif гарчиг ──
function SectionHead({
  kicker,
  title,
  light = false,
  note,
}: {
  kicker: string
  title: string
  light?: boolean
  note?: string
}) {
  return (
    <div className="mb-10 sm:mb-14">
      <div className="h-px w-14 bg-[#8A5A2B]" aria-hidden="true" />
      <p
        className="mt-3 text-[11px] font-semibold uppercase tracking-[0.26em] text-[#8A5A2B]"
        style={{ fontFamily: SANS }}
      >
        {kicker}
      </p>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
        <h2
          className={`text-3xl font-semibold leading-tight sm:text-4xl ${
            light ? 'text-[#F6F5F2]' : 'text-[#1D2126]'
          }`}
          style={{ fontFamily: SERIF }}
        >
          {title}
        </h2>
        {note && (
          <p
            className={`text-[12px] ${light ? 'text-[#F6F5F2]/50' : 'text-[#6E6862]'}`}
            style={{ fontFamily: SANS }}
          >
            {note}
          </p>
        )}
      </div>
    </div>
  )
}

// ── Skeleton блокууд ──
function ServicesSkeleton() {
  return (
    <div className="grid gap-px bg-[#F6F5F2]/15 sm:grid-cols-2 lg:grid-cols-3" aria-label="Ачаалж байна">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-[#191C20] p-8">
          <Skeleton className="h-10 w-16 bg-[#F6F5F2]/15" />
          <Skeleton className="mt-6 h-5 w-3/4 bg-[#F6F5F2]/15" />
          <Skeleton className="mt-3 h-4 w-full bg-[#F6F5F2]/15" />
          <Skeleton className="mt-2 h-4 w-5/6 bg-[#F6F5F2]/15" />
        </div>
      ))}
    </div>
  )
}

function ProjectsSkeleton() {
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3" aria-label="Ачаалж байна">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i}>
          <Skeleton className="aspect-[4/3] w-full bg-[#E1DCD2]" />
          <Skeleton className="mt-4 h-3 w-24 bg-[#E1DCD2]" />
          <Skeleton className="mt-2 h-5 w-3/4 bg-[#E1DCD2]" />
          <Skeleton className="mt-2 h-4 w-full bg-[#E1DCD2]" />
        </div>
      ))}
    </div>
  )
}

// ════════════════════════ HERO ════════════════════════
function Hero({ title, sub }: { title: string; sub: string }) {
  return (
    <section id="top" aria-label="Танилцуулга" className="relative isolate overflow-hidden bg-[#191C20]">
      {/* Background image + overlay */}
      <img
        src={IMG.hero}
        alt="Дэд бүтцийн барилгын ажил — концепт зураг"
        className="absolute inset-0 h-full w-full object-cover"
        loading="eager"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(100deg, rgba(25,28,32,0.94) 0%, rgba(25,28,32,0.82) 45%, rgba(25,28,32,0.55) 100%)',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 bottom-0 h-24"
        style={{ background: 'linear-gradient(to top, rgba(25,28,32,0.9), transparent)' }}
        aria-hidden="true"
      />

      <div className="relative mx-auto flex min-h-[86vh] w-full max-w-7xl flex-col justify-end px-4 pb-16 pt-32 sm:min-h-[92vh] sm:px-6 sm:pb-20">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-[#B98A55]" aria-hidden="true" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#B98A55]" style={{ fontFamily: SANS }}>
              Танилцуулгын жишээ вэбсайт · Концепт брэнд
            </p>
          </div>
          <h1
            className="mt-6 text-4xl font-semibold leading-[1.12] text-[#F6F5F2] sm:text-5xl lg:text-6xl"
            style={{ fontFamily: SERIF }}
          >
            {title}
          </h1>
          <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-[#F6F5F2]/75 sm:text-base" style={{ fontFamily: SANS }}>
            {sub}
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4" style={{ fontFamily: SANS }}>
            <button
              type="button"
              onClick={() => scrollToId('about')}
              className="group inline-flex items-center gap-2 bg-[#8A5A2B] px-6 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-[#A06A34] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B98A55] focus-visible:ring-offset-2 focus-visible:ring-offset-[#191C20]"
            >
              Танилцъя
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => scrollToId('contact')}
              className="inline-flex items-center gap-2 border border-[#F6F5F2]/35 px-6 py-3 text-[14px] font-medium text-[#F6F5F2] transition-colors hover:border-[#B98A55] hover:text-[#B98A55] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B98A55]"
            >
              Холбоо барих
            </button>
          </div>
        </div>

        {/* Stat band — жишээ үзүүлэлт */}
        <div className="mt-14 border-t border-[#F6F5F2]/15 pt-6">
          <dl className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              { n: '40+', label: 'Гүйцэтгэсэн төсөл' },
              { n: '350+', label: 'Ажилтан' },
              { n: '15 жил', label: 'Салбар дахь туршлага' },
            ].map((s) => (
              <div key={s.label} className="flex items-baseline gap-3 sm:block">
                <dd
                  className="text-3xl font-semibold text-[#B98A55] sm:text-4xl"
                  style={{ fontFamily: SERIF }}
                >
                  {s.n}
                </dd>
                <dt className="mt-1 text-[12px] uppercase tracking-[0.16em] text-[#F6F5F2]/60" style={{ fontFamily: SANS }}>
                  {s.label}
                </dt>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-[11px] text-[#F6F5F2]/45" style={{ fontFamily: SANS }}>
            Жишээ үзүүлэлт — концепт брэнд.
          </p>
        </div>
      </div>
    </section>
  )
}

// ════════════════════════ ABOUT ════════════════════════
function About({ content }: { content: Record<string, string> }) {
  return (
    <section id="about" aria-label="Бидний тухай" className="scroll-mt-20 bg-[#F6F5F2]">
      <div className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="md:sticky md:top-28">
              <SectionHead kicker="Бидний тухай" title="Ган шиг хатуу, хүн шиг халамжтай" />
              <p className="text-[13px] leading-relaxed text-[#6E6862]" style={{ fontFamily: SANS }}>
                Концепт брэнд — энэ хуудасны бүх мэдээлэл танилцуулгын жишээ тул бодит
                компанитай холбоогүй.
              </p>
            </div>
          </div>

          <div className="md:col-span-8">
            {/* Editorial lead */}
            <p
              className="text-2xl font-medium leading-[1.5] text-[#1D2126] sm:text-[28px]"
              style={{ fontFamily: SERIF }}
            >
              {content.aboutText1}
            </p>
            <p className="mt-7 text-[15px] leading-[1.85] text-[#55504A]" style={{ fontFamily: SANS }}>
              {content.aboutText2}
            </p>

            {/* Mission / Vision cards */}
            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {[
                { icon: Target, k: 'mission', label: 'Эрхэм зорилго', num: '01' },
                { icon: Compass, k: 'vision', label: 'Алсын хараа', num: '02' },
              ].map(({ icon: Icon, k, label, num }) => (
                <div key={k} className="border border-[#E1DCD2] bg-white p-7">
                  <div className="flex items-center justify-between">
                    <Icon className="h-5 w-5 text-[#8A5A2B]" aria-hidden="true" />
                    <span className="text-[13px] font-semibold text-[#8A5A2B]/70" style={{ fontFamily: SERIF }}>
                      {num}
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold" style={{ fontFamily: SERIF }}>
                    {label}
                  </h3>
                  <p className="mt-3 text-[14px] leading-relaxed text-[#55504A]" style={{ fontFamily: SANS }}>
                    {content[k]}
                  </p>
                </div>
              ))}
            </div>

            {/* Pull-quote */}
            <figure className="mt-12 border-l-2 border-[#8A5A2B] py-2 pl-6">
              <Quote className="h-5 w-5 text-[#8A5A2B]/50" aria-hidden="true" />
              <blockquote
                className="mt-3 text-xl italic leading-[1.6] text-[#1D2126] sm:text-[22px]"
                style={{ fontFamily: SERIF }}
              >
                «Чанар нь санамсаргүй биш — гэрээ бус, итгэлцлээр баригддаг.»
              </blockquote>
              <figcaption className="mt-3 text-[12px] uppercase tracking-[0.18em] text-[#6E6862]" style={{ fontFamily: SANS }}>
                ТЭМҮҮР Групп — үнэт зүйлс
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  )
}

// ════════════════════════ SERVICES ════════════════════════
function Services({
  services,
  loading,
}: {
  services: CompanyService[]
  loading: boolean
}) {
  return (
    <section id="services" aria-label="Үйл ажиллагаа" className="scroll-mt-20 bg-[#191C20] text-[#F6F5F2]">
      <div className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
        <SectionHead
          kicker="Үйл ажиллагаа"
          title="Нэг шийдэл — бүх шатанд"
          light
          note="Засварлах: Админ панель → Үйл ажиллагаа"
        />
        {loading ? (
          <ServicesSkeleton />
        ) : (
          <div className="grid gap-px bg-[#F6F5F2]/12 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => {
              const Icon = pickIcon(s.icon)
              return (
                <article
                  key={s.id}
                  className="group relative bg-[#191C20] p-8 transition-colors duration-300 hover:bg-[#1F2329]"
                >
                  <div className="flex items-start justify-between">
                    <span
                      className="text-[34px] font-semibold leading-none text-[#B98A55]/85 transition-colors group-hover:text-[#B98A55]"
                      style={{ fontFamily: SERIF }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <Icon
                      className="h-5 w-5 text-[#F6F5F2]/45 transition-colors group-hover:text-[#B98A55]"
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="mt-7 text-xl font-semibold text-[#F6F5F2]" style={{ fontFamily: SERIF }}>
                    {s.title}
                  </h3>
                  <p className="mt-3 text-[13.5px] leading-[1.75] text-[#F6F5F2]/62" style={{ fontFamily: SANS }}>
                    {s.description}
                  </p>
                  <span className="mt-6 block h-px w-8 bg-[#8A5A2B] transition-all duration-300 group-hover:w-full" aria-hidden="true" />
                </article>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

// ════════════════════════ PROJECTS ════════════════════════
function ProjectCard({ p, onOpen }: { p: CompanyProject; onOpen: (p: CompanyProject) => void }) {
  return (
    <article className="group">
      <button
        type="button"
        onClick={() => onOpen(p)}
        className="block w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8A5A2B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F6F5F2]"
        aria-label={`${p.title} — кейс дэлгэрэнгүй үзэх`}
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#E1DCD2]">
          <img
            src={p.imageUrl || IMG.hero}
            alt={`${p.title} — жишээ төслийн зураг`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-[#191C20]/0 transition-colors duration-500 group-hover:bg-[#191C20]/15"
            aria-hidden="true"
          />
        </div>
        <div className="mt-5 flex items-center justify-between gap-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8A5A2B]" style={{ fontFamily: SANS }}>
            {p.category}
          </p>
          <p className="text-[12px] font-medium text-[#6E6862]" style={{ fontFamily: SANS }}>
            {p.year}
          </p>
        </div>
        <h3
          className="mt-2 text-xl font-semibold leading-snug text-[#1D2126] transition-colors group-hover:text-[#8A5A2B]"
          style={{ fontFamily: SERIF }}
        >
          {p.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-[13.5px] leading-relaxed text-[#55504A]" style={{ fontFamily: SANS }}>
          {p.description}
        </p>
        <p className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-wider text-[#8A5A2B] opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ fontFamily: SANS }}>
          Кейс үзэх <BookOpenCheck className="h-3.5 w-3.5" aria-hidden="true" />
        </p>
      </button>
    </article>
  )
}

function Projects({ projects, loading }: { projects: CompanyProject[]; loading: boolean }) {
  const [selected, setSelected] = useState<CompanyProject | null>(null)

  return (
    <section id="projects" aria-label="Төслүүд" className="scroll-mt-20 bg-[#F6F5F2]">
      <div className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
        <SectionHead
          kicker="Төслүүд"
          title="Ажлын сор бүтээлүүд"
          note="Жишээ төслүүд — концепт брэнд"
        />
        {loading ? (
          <ProjectsSkeleton />
        ) : (
          <div className="grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <ProjectCard key={p.id} p={p} onOpen={setSelected} />
            ))}
          </div>
        )}

        {/* Кейс Dialog */}
        <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
          <DialogContent className="max-h-[90vh] gap-0 overflow-y-auto bg-[#F6F5F2] p-0 sm:max-w-2xl [&>button]:bg-white/90 [&>button]:rounded-full">
            {selected && (
              <>
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#E1DCD2]">
                  <img
                    src={selected.imageUrl || IMG.hero}
                    alt={`${selected.title} — жишээ төслийн зураг`}
                    className="h-full w-full object-cover"
                  />
                  <div
                    className="absolute inset-x-0 bottom-0 h-20"
                    style={{ background: 'linear-gradient(to top, rgba(25,28,32,0.72), transparent)' }}
                    aria-hidden="true"
                  />
                  <p
                    className="absolute bottom-3 left-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#F6F5F2]/85"
                    style={{ fontFamily: SANS }}
                  >
                    {selected.category} · {selected.year}
                  </p>
                </div>
                <div className="p-6 sm:p-8">
                  <DialogHeader className="space-y-3 text-left">
                    <DialogTitle
                      className="text-2xl font-semibold leading-snug text-[#1D2126] sm:text-3xl"
                      style={{ fontFamily: SERIF }}
                    >
                      {selected.title}
                    </DialogTitle>
                    <DialogDescription className="text-[13px] text-[#6E6862]" style={{ fontFamily: SANS }}>
                      Кейс — жишээ төслийн танилцуулга (концепт брэнд)
                    </DialogDescription>
                  </DialogHeader>
                  <div className="mt-5 h-px w-full bg-[#E1DCD2]" aria-hidden="true" />
                  <p className="mt-5 text-[15px] leading-[1.85] text-[#1D2126]" style={{ fontFamily: SANS }}>
                    {selected.description}
                  </p>
                  <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-[#E1DCD2] pt-5 text-[13px]" style={{ fontFamily: SANS }}>
                    <div>
                      <dt className="text-[11px] uppercase tracking-[0.16em] text-[#6E6862]">Ангилал</dt>
                      <dd className="mt-1 font-medium text-[#1D2126]">{selected.category}</dd>
                    </div>
                    <div>
                      <dt className="text-[11px] uppercase tracking-[0.16em] text-[#6E6862]">Дууссан жил</dt>
                      <dd className="mt-1 font-medium text-[#1D2126]">{selected.year}</dd>
                    </div>
                  </dl>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  )
}

// ════════════════════════ TEAM ════════════════════════
function Team() {
  return (
    <section id="team" aria-label="Хамт олон" className="scroll-mt-20 border-y border-[#E1DCD2] bg-[#EFECE4]">
      <div className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
        <SectionHead
          kicker="Хамт олон"
          title="Удирдлагын баг"
          note="Жишээ профайл — концепт брэнд"
        />
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TEAM.map((m) => (
            <li key={m.name} className="group border border-[#E1DCD2] bg-[#F6F5F2] p-7 text-center transition-shadow hover:shadow-md">
              {/* Монограм avatar: графит дугуй + зэс цагираг */}
              <div
                className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#191C20] ring-2 ring-[#8A5A2B] ring-offset-2 ring-offset-[#F6F5F2]"
                aria-hidden="true"
              >
                <span className="text-xl font-semibold tracking-wide text-[#F6F5F2]" style={{ fontFamily: SERIF }}>
                  {initialsOf(m.name)}
                </span>
              </div>
              <h3 className="mt-5 text-lg font-semibold text-[#1D2126]" style={{ fontFamily: SERIF }}>
                {m.name}
              </h3>
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8A5A2B]" style={{ fontFamily: SANS }}>
                {m.role}
              </p>
              <p className="mt-3 text-[13px] leading-relaxed text-[#55504A]" style={{ fontFamily: SANS }}>
                {m.bio}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

// ════════════════════════ CONTACT ════════════════════════
function Contact() {
  return (
    <section id="contact" aria-label="Холбоо барих" className="scroll-mt-20 bg-[#F6F5F2]">
      <div className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Info column */}
          <div className="lg:col-span-5">
            <SectionHead kicker="Холбоо барих" title="Яриа эхлүүлье" />
            <p className="max-w-md text-[15px] leading-[1.85] text-[#55504A]" style={{ fontFamily: SANS }}>
              Төслийн санал, хамтын ажиллагаа, зөвлөх үйлчилгээний асуултаар бидэнтэй доорх
              маягтаар холбогдоорой. Бүх зурвасыг ажлын өдрүүдэд хянаж, хариу өгнө.
            </p>
            <dl className="mt-10 space-y-6" style={{ fontFamily: SANS }}>
              {[
                { k: 'Утас', v: '+976 XXXX-XXXX' },
                { k: 'Имэйл', v: 'info@temuur.example' },
                { k: 'Хаяг', v: 'Улаанбаатар хот, Монгол Улс' },
                { k: 'Ажлын цаг', v: 'Даваа–Бямба, 09:00–18:00' },
              ].map((r) => (
                <div key={r.k} className="border-t border-[#E1DCD2] pt-4">
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6E6862]">{r.k}</dt>
                  <dd className="mt-1.5 text-[15px] font-medium text-[#1D2126]">
                    {r.v} <span className="text-[12px] font-normal text-[#9A938A]">(шинэчлэх)</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Form column */}
          <div className="lg:col-span-7">
            <InquiryForm />
          </div>
        </div>
      </div>
    </section>
  )
}

// ════════════════════════ HOME ════════════════════════
export default function HomePage() {
  const contentQ = useApi<CompanyContent>('company-content')
  const servicesQ = useApi<CompanyService>('company-services')
  const projectsQ = useApi<CompanyProject>('company-projects')

  // Content: key → value (default-оос уншиж, DB-гээр дарж бичнэ)
  const content = useMemo(() => {
    const map = { ...DEFAULT_CONTENT }
    for (const row of contentQ.data) {
      if (row.key in map && row.value && row.value.trim()) map[row.key] = row.value
    }
    return map
  }, [contentQ.data])

  // API хоосон бол defaults хэрэглэнэ
  const services = useMemo(() => {
    const active = servicesQ.data.filter((s) => s.active)
    return active.length ? active : DEFAULT_SERVICES
  }, [servicesQ.data])

  const projects = useMemo(() => {
    const active = projectsQ.data.filter((p) => p.active)
    return active.length ? active : DEFAULT_PROJECTS
  }, [projectsQ.data])

  return (
    <>
      <Hero title={content.heroTitle} sub={content.heroSub} />
      <About content={content} />
      <Services services={services} loading={servicesQ.loading} />
      <Projects projects={projects} loading={projectsQ.loading} />
      <Team />
      <Contact />
    </>
  )
}
