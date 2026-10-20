'use client'

import { ArrowLeft, ArrowUpRight, Check, Info, Palette, Send, Type } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { navigate, goHomeToPortfolio } from '@/lib/hash-router'
import { SERVICES, DISPLAY_FONT } from '@/config/agency'
import { DEMOS, type DemoInfo } from '@/config/demos'
import { FadeIn, Logo } from '@/components/agency/brand'

/** Маягтад урьдчилан дүүргэх үйлчилгээний нэр — демо бүрийн үйлчилгээнээс үндсэн жагсаалтад таарахыг сонгоно */
const SERVICE_TITLES = SERVICES.map((s) => s.title)

function pickPrefillService(demo: DemoInfo): string {
  return demo.services.find((s) => SERVICE_TITLES.includes(s)) ?? 'Вэбсайт хөгжүүлэлт'
}

/** Кейсын цаана маягт руу үйлчилгээний сонголттой шилжинэ (px-service prefill + contact рүү гүйлгэлт) */
function startProject(demo: DemoInfo) {
  try {
    sessionStorage.setItem('px-service', pickPrefillService(demo))
    sessionStorage.setItem('px-scroll-to', 'contact')
  } catch {
    /* sessionStorage боломжгүй үед алгасна */
  }
  navigate('/')
}

/** ───────────────── Кейс хуудас: #/case/<demoId> — 6 демо төслийн дэлгэрэнгүй ───────────────── */
export function CasePage({ id }: { id: string }) {
  const demo = DEMOS.find((d) => d.id === id)

  if (!demo || !demo.caseStudy) {
    return (
      <NotFound
        note="Ийм дугаартай кейс олдсонгүй. Порфолио хэсэгт байгаа демо төслүүдийн кейсыг үзэж болно."
      />
    )
  }

  const cs = demo.caseStudy

  return (
    <div
      className="flex min-h-screen flex-col bg-[#FAFAF8] text-[#0B0B0C]"
      style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
    >
      <header className="border-b border-black/[0.08] bg-white/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4 sm:px-6">
          <a href="#/" aria-label="Pixelmn — үндсэн сайт">
            <Logo size={32} />
          </a>
          <button
            type="button"
            onClick={goHomeToPortfolio}
            className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-4 py-2 text-[13px] font-semibold text-black/70 transition-colors hover:bg-[#F2F1EE] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E4572E]/60"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Бүх төслүүд
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 pb-20 pt-10 sm:px-6 sm:pt-14">
        {/* ── Hero ── */}
        <FadeIn>
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="border-transparent bg-[#E4572E] text-[10px] font-bold uppercase tracking-wider text-white">
              Демо төсөл
            </Badge>
            <span className="text-[11px] font-semibold uppercase tracking-wide text-black/40">
              {demo.category}
            </span>
          </div>
          <h1
            style={DISPLAY_FONT}
            className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl sm:text-[42px] sm:leading-[1.1]"
          >
            {demo.label}
          </h1>
          <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-black/60">{cs.tagline}</p>

          <div className="mt-5 flex flex-wrap gap-1.5">
            {demo.services.map((s) => (
              <span
                key={s}
                className="rounded-full border border-black/[0.08] bg-white px-3 py-1.5 text-[12px] font-medium text-black/60"
              >
                {s}
              </span>
            ))}
          </div>
        </FadeIn>

        {/* ── Демо баннер — демо бүрийн брэндийн өнгө, фонтоор ── */}
        <FadeIn delay={0.08} className="mt-8">
          <div
            className="relative overflow-hidden rounded-2xl border border-black/10"
            style={{ background: demo.gradient }}
            aria-hidden="true"
          >
            <div className="flex min-h-[180px] flex-col justify-between gap-6 p-6 sm:min-h-[220px] sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <p
                  className="text-2xl font-bold leading-tight text-white sm:text-3xl"
                  style={{ fontFamily: demo.fontVar }}
                >
                  {demo.name}
                </p>
                <span className="mt-0.5 shrink-0 rounded-full border border-white/25 bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white/80 backdrop-blur-sm">
                  pixelmn.mn/demo/{demo.id}
                </span>
              </div>
              <p className="max-w-md text-[13px] leading-relaxed text-white/70">
                {demo.description}
              </p>
            </div>
          </div>
        </FadeIn>

        {/* ── Тухай энэ кейс ── */}
        <FadeIn delay={0.12} className="mt-12">
          <h2 style={DISPLAY_FONT} className="text-2xl font-extrabold tracking-tight">
            Тухай энэ кейс
          </h2>
          <div className="mt-4 flex flex-col gap-3 text-[15px] leading-relaxed text-black/65">
            <p>
              Энэ кейс нь «{demo.name}» — Pixelmn студийн бүтээсэн{' '}
              <strong className="font-semibold text-[#0B0B0C]">бүрэн ажиллагаатай демо вэбсайт</strong>{' '}
              юм. Зорилго нь {demo.category.toLowerCase()} чиглэлд манай вэб хөгжүүлэлт, UI/UX
              дизайны чадварыг бодит жишээгээр харуулахад оршино.
            </p>
            <p>
              Демо нь жишээ өгөгдөл ашиглан ажилладаг бөгөөд төлбөр, захиалгын үйлдлүүд демо горимд
              явагдана — бодит төлбөр авахгүй. Демо админ панель нь мөн адил демо эрхээр нээлттэй,
              ингэснээр захиалга, агуулгыг удирдах интерфэйсийг хэрэглэгчийн үүднээс бүрэн шалгах
              боломжтой.
            </p>
          </div>
        </FadeIn>

        {/* ── Демод юу багтсан бэ? ── */}
        <FadeIn delay={0.16} className="mt-12">
          <h2 style={DISPLAY_FONT} className="text-2xl font-extrabold tracking-tight">
            Демод юу багтсан бэ?
          </h2>
          <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
            {cs.features.map((f) => (
              <li
                key={f}
                className="flex items-start gap-2.5 rounded-xl border border-black/[0.08] bg-white px-4 py-3 text-[13.5px] leading-relaxed text-black/70"
              >
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#E4572E]" aria-hidden="true" />
                {f}
              </li>
            ))}
          </ul>
        </FadeIn>

        {/* ── Дизайны шийдэл ── */}
        <FadeIn delay={0.2} className="mt-12">
          <h2 style={DISPLAY_FONT} className="text-2xl font-extrabold tracking-tight">
            Дизайны шийдэл
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-3.5 rounded-xl border border-black/[0.08] bg-white px-4 py-3.5">
              <span
                className="h-9 w-9 shrink-0 rounded-full border border-black/10 shadow-inner"
                style={{ background: demo.accent }}
                aria-hidden="true"
              />
              <div>
                <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-black/40">
                  <Palette className="h-3.5 w-3.5" aria-hidden="true" />
                  Акцент өнгө
                </p>
                <p className="mt-0.5 text-[14px] font-semibold text-[#0B0B0C]">
                  {cs.accentName}{' '}
                  <span className="font-mono text-[11px] font-normal uppercase text-black/40">
                    {demo.accent}
                  </span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3.5 rounded-xl border border-black/[0.08] bg-white px-4 py-3.5">
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-black/10 bg-[#FAFAF8] text-[15px] font-bold text-[#0B0B0C]"
                style={{ fontFamily: demo.fontVar }}
                aria-hidden="true"
              >
                Аа
              </span>
              <div>
                <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-black/40">
                  <Type className="h-3.5 w-3.5" aria-hidden="true" />
                  Гарчгийн фонт
                </p>
                <p className="mt-0.5 text-[14px] font-semibold text-[#0B0B0C]">{cs.fontLabel}</p>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* ── Демо тэмдэглэгээ ── */}
        <FadeIn delay={0.22} className="mt-10">
          <p className="flex gap-2.5 rounded-xl border border-dashed border-black/15 bg-[#F2F1EE]/60 px-4 py-3.5 text-[12.5px] leading-relaxed text-black/55">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-black/40" aria-hidden="true" />
            Энэ төсөл нь чадварыг харуулах зорилготой демо — бодит клиентийн мэдээлэл ашигладаггүй.
            Ажиллагааг шууд демо сайтаас тестэж үзээрэй.
          </p>
        </FadeIn>

        {/* ── CTA ── */}
        <FadeIn delay={0.24} className="mt-10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              size="lg"
              className="h-12 rounded-full bg-[#E4572E] px-7 text-[15px] font-bold text-white hover:bg-[#d24a22]"
              onClick={() => navigate(`/demo/${demo.id}`)}
            >
              Демо сайт руу очих
              <ArrowUpRight className="h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 rounded-full border-black/15 bg-white px-7 text-[15px] font-semibold text-[#0B0B0C] hover:bg-[#F2F1EE]"
              onClick={() => startProject(demo)}
            >
              Төслөө эхлүүлэх
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </FadeIn>
      </main>

      <footer className="mt-auto border-t border-black/[0.08] bg-white py-6">
        <div className="mx-auto flex max-w-4xl flex-col gap-2 px-4 text-[12px] text-black/40 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© {new Date().getFullYear()} Pixelmn. Бүх эрх хамгаалагдсан.</p>
          <div className="flex gap-4">
            <a href="#/privacy" className="transition-colors hover:text-black/70">
              Нууцлалын бодлого
            </a>
            <a href="#/terms" className="transition-colors hover:text-black/70">
              Үйлчилгээний нөхцөл
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

/** Кейс олдоогүй үед харуулна */
function NotFound({ note }: { note: string }) {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center bg-[#FAFAF8] px-4 text-center"
      style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
    >
      <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-[#E4572E]">Кейс</p>
      <h1 style={DISPLAY_FONT} className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">
        Кейс олдсонгүй
      </h1>
      <p className="mt-3 max-w-sm text-[14px] leading-relaxed text-black/55">{note}</p>
      <Button
        className="mt-6 h-11 rounded-full bg-[#0B0B0C] px-6 font-semibold text-white hover:bg-black/80"
        onClick={goHomeToPortfolio}
      >
        <ArrowLeft className="h-4 w-4" />
        Бүх төслүүд рүү буцах
      </Button>
    </div>
  )
}
