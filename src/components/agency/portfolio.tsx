'use client'

import { useState } from 'react'
import { ArrowUpRight, NotebookPen, ShieldCheck } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { DEMOS, type DemoInfo } from '@/config/demos'
import { DISPLAY_FONT } from '@/config/agency'
import { SectionHeading, FadeIn } from '@/components/agency/brand'
import { DemoThumb } from '@/components/agency/demo-thumb'

/**
 * ───────────────── Төслүүд: 6 бодит демо + бодит дэлгэцийн зураг ─────────────────
 * Зураг бүр нь тухайн демо вэбсайтын ажиллаж буй дэлгэцээс автоматаар авсан
 * (public/previews/<id>.png). Зураг ачаалагдахгүй бол CSS thumbnail руу шилжинэ.
 */
export function PortfolioSection() {
  return (
    <section id="portfolio" className="scroll-mt-24 bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Порфолио"
          title="Төслүүд"
          note="Доорх 6 төсөл нь бүрэн ажиллагаатай демо вэбсайт — дэлгэцийн зургууд нь тэдгээрийн бодит ажиллаж буй дэлгэцээс авсан. Шууд орж үзэж, админ хэсгийг нь туршиж болно."
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {DEMOS.map((d, i) => (
            <FadeIn key={d.id} delay={Math.min(i, 5) * 0.06}>
              <DemoCard demo={d} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

/** ───────────────── Демо карт — бодит дэлгэцийн зурагтай ───────────────── */
function DemoCard({ demo }: { demo: DemoInfo }) {
  const [shotFailed, setShotFailed] = useState(false)

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-black/[0.08] bg-[#FAFAF8] transition-all duration-300 hover:-translate-y-1 hover:border-[#E4572E]/45 hover:shadow-[0_24px_50px_-24px_rgba(11,11,12,0.3)] focus-within:ring-2 focus-within:ring-[#E4572E]/60">
      {/* бүтэн картыг хамрах холбоос — демо руу орох */}
      <a
        href={`#/demo/${demo.id}`}
        aria-label={`${demo.name} — демо вэбсайт руу орох`}
        className="absolute inset-0 rounded-2xl focus-visible:outline-none"
      />
      <div className="relative p-3 pb-0">
        <div className="relative overflow-hidden rounded-xl border border-black/10 bg-[#F2F1EE]">
          {shotFailed ? (
            <div className="transition-transform duration-500 ease-out group-hover:scale-[1.02] motion-reduce:transition-none">
              <DemoThumb demo={demo} />
            </div>
          ) : (
            <img
              src={`/previews/${demo.id}.png`}
              alt={`${demo.name} вэбсайтын бодит дэлгэцийн зураг`}
              loading="lazy"
              decoding="async"
              width={1440}
              height={900}
              onError={() => setShotFailed(true)}
              className="aspect-[16/10] w-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none"
            />
          )}
        </div>
        <Badge className="absolute right-5 top-5 border-transparent bg-[#E4572E] text-[10px] font-bold text-white shadow-sm">
          Демо
        </Badge>
        <span className="absolute bottom-3 left-5 inline-flex items-center gap-1.5 rounded-full bg-[#0B0B0C]/85 px-2.5 py-1 text-[10.5px] font-semibold text-white shadow-sm backdrop-blur">
          <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/80" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </span>
          Ажиллаж байна
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-black/40">
          {demo.category}
        </p>
        <h3
          style={DISPLAY_FONT}
          className="mt-1.5 text-lg font-bold tracking-tight text-[#0B0B0C]"
        >
          {demo.label}
        </h3>
        <p className="mt-2 line-clamp-3 text-[13.5px] leading-relaxed text-black/60">
          {demo.description}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {demo.services.map((s) => (
            <span
              key={s}
              className="rounded-full border border-black/[0.08] bg-white px-2.5 py-1 text-[11px] font-medium text-black/55"
            >
              {s}
            </span>
          ))}
        </div>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-4">
          <span className="pointer-events-none inline-flex items-center gap-1.5 text-[13.5px] font-bold text-[#E4572E] transition-transform duration-300 group-hover:translate-x-0.5">
            Демо үзэх
            <ArrowUpRight className="h-4 w-4" />
          </span>
          <div className="relative z-10 flex items-center gap-1.5">
            <a
              href={`#/demo/${demo.id}/admin`}
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-black/[0.08] bg-white px-3.5 py-2 text-[12px] font-semibold text-black/60 transition-colors hover:border-[#E4572E]/45 hover:text-[#E4572E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E4572E]/60"
              aria-label={`${demo.name} — демо админ панель нээх`}
            >
              <ShieldCheck className="h-3.5 w-3.5 text-[#E4572E]" aria-hidden="true" />
              Админ
            </a>
            <a
              href={`#/case/${demo.id}`}
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-black/[0.08] bg-white px-3.5 py-2 text-[12px] font-semibold text-black/60 transition-colors hover:border-[#E4572E]/45 hover:text-[#E4572E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E4572E]/60"
              aria-label={`${demo.name} — кейсийн дэлгэрэнгүй мэдээлэл харах`}
            >
              <NotebookPen className="h-3.5 w-3.5 text-[#E4572E]" />
              Дэлгэрэнгүй
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
