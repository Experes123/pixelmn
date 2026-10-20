'use client'

import { FadeIn, SectionHeading } from '@/components/agency/brand'
import { TRUST_CHIPS } from '@/config/agency'

/**
 * ───────────────── Хамтын ажиллагаа — хязгааргүй гүйлттэй карусель ─────────────────
 * Түншийн байр суурь бүр «Тун удахгүй» төлөвтэй. Хоёр эгнээ эсрэг чиглэлд
 * тасралтгүй гүйж, хулгана дээр гүйлт түр зогсоно. Жагсаалтыг админ панелаас
 * засварлана (site-content → partners).
 */
export function PartnersSection({ partners }: { partners: string[] }) {
  const items = partners.length > 0 ? partners : [...TRUST_CHIPS]
  const rowA = items
  const rowB = [...items.slice(3), ...items.slice(0, 3)] // эгнээ хооронд байрлал шилжүүлнэ
  const rowBReversed = rowB.length > 1 ? [...rowB].reverse() : rowB

  return (
    <section
      id="partners"
      aria-labelledby="partners-title"
      className="overflow-hidden border-y border-black/[0.06] bg-white py-12 sm:py-14"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Хамтын ажиллагаа"
          title="Хамтрагчдын байр"
          note="Түншлэлийн байр суурь нээлттэй — доорх хамтрагчид удахгүй бодит түншүүдээр дүүрнэ. Хамтрахыг хүсвэл холбогдоорой."
        />
      </div>

      <FadeIn delay={0.08} className="mt-8">
        {/* Эгнээ 1 — зүүн тийш */}
        <div className="marquee-paused relative">
          <EdgeMask />
          <div className="marquee-track flex w-max gap-4 px-4">
            {[...rowA, ...rowA].map((name, i) => (
              <PartnerCard key={`a-${i}-${name}`} name={name} />
            ))}
          </div>
        </div>

        {/* Эгнээ 2 — баруун тийш, бага зэрэг удаан */}
        <div className="marquee-paused relative mt-4">
          <EdgeMask />
          <div className="marquee-track-reverse flex w-max gap-4 px-4">
            {[...rowBReversed, ...rowBReversed].map((name, i) => (
              <PartnerCard key={`b-${i}-${name}`} name={name} muted />
            ))}
          </div>
        </div>
      </FadeIn>

      <p className="sr-only" aria-live="polite">
        {items.length} хамтрагчийн байр, бүгд «Тун удахгүй» төлөвтэй
      </p>
    </section>
  )
}

/** Ирмэгийн зөөлөн бүдгэрэлт — гүйлт үргэлжилж буй мэт харагдуулна */
function EdgeMask() {
  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-14 bg-gradient-to-r from-white to-transparent sm:w-24"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-14 bg-gradient-to-l from-white to-transparent sm:w-24"
      />
    </>
  )
}

function PartnerCard({ name, muted = false }: { name: string; muted?: boolean }) {
  return (
    <div
      className={
        'group flex w-[232px] shrink-0 items-center gap-3 rounded-2xl border border-dashed bg-[#FAFAF8] px-4 py-3.5 transition-colors duration-300 hover:bg-white sm:w-[252px] ' +
        (muted
          ? 'border-black/[0.10] hover:border-[#E4572E]/35'
          : 'border-black/[0.12] hover:border-[#E4572E]/45')
      }
    >
      <span
        aria-hidden="true"
        className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#0B0B0C] text-white shadow-[0_6px_14px_-8px_rgba(11,11,12,0.5)] transition-transform duration-300 group-hover:scale-[1.06]"
      >
        <span className="text-[15px] font-extrabold leading-none">
          {name.trim().slice(0, 1).toUpperCase()}
        </span>
      </span>
      <span className="min-w-0">
        <span className="block truncate text-[13.5px] font-bold tracking-tight text-[#0B0B0C]">
          {name}
        </span>
        <span className="mt-0.5 inline-flex items-center gap-1.5 text-[11px] font-semibold text-black/45">
          <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#E4572E]/60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#E4572E]" />
          </span>
          Тун удахгүй
        </span>
      </span>
    </div>
  )
}
