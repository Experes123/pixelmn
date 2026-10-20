'use client'

import { DemoLink, navigate } from '@/lib/hash-router'
import { Button } from '@/components/ui/button'
import { ArrowRight, HandHeart, Leaf, MapPinned, Sparkles } from 'lucide-react'
import { useApi } from '@/lib/use-api'
import { CATEGORY_LABEL, CATEGORY_NOTE, IMG, INK, INK_SOFT, LINE, OLIVE, OLIVE_DEEP, OLIVE_TINT, type Product } from './constants'
import { CardSkeleton, Kicker, ProductCard, SectionHead } from './ui'

/** Люсид икон бүхий ангиллын картаар ашиглах дүрслэл — энгийн SVG бүхий дугуй */
function CategoryIcon({ category }: { category: string }) {
  const common = 'h-5 w-5'
  switch (category) {
    case 'арьсан эдлэл':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden="true" stroke={OLIVE} strokeWidth={1.8}>
          <path d="M6 8V7a6 6 0 0 1 12 0v1" strokeLinecap="round" />
          <rect x="3.5" y="8" width="17" height="12" rx="3" />
          <path d="M3.5 12h17" strokeLinecap="round" />
        </svg>
      )
    case 'эсгий бүтээгдэхүүн':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden="true" stroke={OLIVE} strokeWidth={1.8}>
          <path d="M4 17c1.8-1.4 3.4-1.4 5.2 0 1.8 1.4 3.4 1.4 5.2 0 1.8-1.4 3.4-1.4 5.6 0" strokeLinecap="round" />
          <path d="M4 12c1.8-1.4 3.4-1.4 5.2 0 1.8 1.4 3.4 1.4 5.2 0 1.8-1.4 3.4-1.4 5.6 0" strokeLinecap="round" />
          <path d="M4 7c1.8-1.4 3.4-1.4 5.2 0 1.8 1.4 3.4 1.4 5.2 0 1.8-1.4 3.4-1.4 5.6 0" strokeLinecap="round" />
        </svg>
      )
    case 'цай':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden="true" stroke={OLIVE} strokeWidth={1.8}>
          <path d="M4 9h13v5a5 5 0 0 1-5 5h-3a5 5 0 0 1-5-5V9Z" strokeLinejoin="round" />
          <path d="M17 10h1.5a2.5 2.5 0 0 1 0 5H17" strokeLinecap="round" />
          <path d="M8 5.5c0-1 .8-1.2.8-2M12 5.5c0-1 .8-1.2.8-2" strokeLinecap="round" />
        </svg>
      )
    case 'гэр ахуй':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden="true" stroke={OLIVE} strokeWidth={1.8}>
          <path d="M4 11 12 4l8 7" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6.5 9.5V20h11V9.5" strokeLinecap="round" />
          <path d="M10 20v-5h4v5" strokeLinejoin="round" />
        </svg>
      )
    default: // аялал
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden="true" stroke={OLIVE} strokeWidth={1.8}>
          <path d="M12 3v2M4.9 6.4l1.4 1.4M2.5 14h2M19.1 6.4l-1.4 1.4M21.5 14h-2" strokeLinecap="round" />
          <path d="M8 18a4 4 0 1 1 8 0" strokeLinecap="round" />
          <path d="M5 18h14" strokeLinecap="round" />
        </svg>
      )
  }
}

export function HomePage() {
  const { data: products, loading } = useApi<Product>('products')

  const active = products.filter((p) => p.active)
  const featured = active.filter((p) => p.featured).slice(0, 8)
  const countOf = (cat: string) => active.filter((p) => p.category === cat).length
  const categories = Object.keys(CATEGORY_LABEL)

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-12 pt-10 sm:pt-14 lg:grid lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-12 lg:pt-16">
        <div>
          <Kicker>ГАР УРЛАЛ · МОНГОЛ</Kicker>
          <h1 className="nutag-display mt-4 text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl">
            Гараар хийсэн
            <br />
            монгол{' '}
            <span className="relative inline-block" style={{ color: OLIVE }}>
              бүтээгдэхүүн
              <svg
                className="absolute -bottom-1.5 left-0 w-full"
                viewBox="0 0 200 8"
                fill="none"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path d="M2 6c40-4 90-5 196-3" stroke="#A0522D" strokeWidth="3" strokeLinecap="round" strokeDasharray="1 7" />
              </svg>
            </span>
          </h1>
          <p className="mt-6 max-w-lg text-[15px] leading-relaxed" style={{ color: INK_SOFT }}>
            Арьсан эдлэл, эсгий, нутгийн цай, гэр ахуйн эдлэл — жижиг цувралаар бэлтгэгдсэн,
            бодит гар урлаачдын бүтээлийг нэг дор цуглууллаа.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              className="rounded-full px-7 text-white hover:brightness-110 focus-visible:ring-[#5A6B3F]"
              style={{ backgroundColor: OLIVE }}
              onClick={() => navigate('/demo/nutag/shop')}
            >
              Дэлгүүр рүү
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full border-2 bg-transparent px-6 font-semibold hover:bg-white"
              style={{ borderColor: OLIVE, color: OLIVE }}
              onClick={() => document.getElementById('nutag-cats')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Ангиллууд үзэх
            </Button>
          </div>

          <dl className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm" style={{ color: INK_SOFT }}>
            <div>
              <dt className="sr-only">Бүтээгдэхүүний тоо</dt>
              <dd>
                <span className="nutag-display text-xl font-extrabold" style={{ color: INK }}>
                  {active.length}
                </span>{' '}
                бүтээгдэхүүн
              </dd>
            </div>
            <div className="border-l pl-8" style={{ borderColor: LINE }}>
              <dt className="sr-only">Ангиллын тоо</dt>
              <dd>
                <span className="nutag-display text-xl font-extrabold" style={{ color: INK }}>
                  {categories.length}
                </span>{' '}
                ангилал
              </dd>
            </div>
            <div className="border-l pl-8" style={{ borderColor: LINE }}>
              <dt className="sr-only">Хүргэлт</dt>
              <dd>Улаанбаатарт 6,000₮ хүргэлт</dd>
            </div>
          </dl>
        </div>

        {/* Зургийн коллаж */}
        <div className="relative mt-12 lg:mt-0" aria-hidden="true">
          <div className="absolute -left-6 -top-6 hidden h-24 w-24 rounded-full border-2 border-dashed lg:block" style={{ borderColor: '#C9C2AC' }} />
          <div className="relative overflow-hidden rounded-[2rem] border-4 border-white shadow-[0_24px_50px_-20px_rgba(38,35,29,0.35)]">
            <img
              src={IMG.prod1[0]}
              alt=""
              className="aspect-[4/3.4] w-full object-cover"
              loading="eager"
            />
          </div>
          <div className="absolute -bottom-8 -left-4 w-36 overflow-hidden rounded-2xl border-4 border-white shadow-lg sm:w-44 lg:-left-12">
            <img src={IMG.prod3[0]} alt="" className="aspect-square w-full object-cover" loading="lazy" />
          </div>
          <div
            className="absolute -right-2 top-6 rotate-3 rounded-xl border bg-white/95 px-3 py-2 shadow-md backdrop-blur sm:-right-5"
            style={{ borderColor: LINE }}
          >
            <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider" style={{ color: OLIVE }}>
              <Sparkles className="h-3.5 w-3.5" style={{ color: '#A0522D' }} />
              Жижиг цуврал
            </p>
          </div>
        </div>
      </section>

      {/* ── Ангиллууд ────────────────────────────────────────────────────── */}
      <section id="nutag-cats" className="mt-14 scroll-mt-24 bg-white/60 py-14" style={{ borderTop: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}` }}>
        <div className="mx-auto w-full max-w-6xl px-4">
          <SectionHead kicker="АНГИЛЛУУД" title="Ямар эдлэл хайж байна?" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {categories.map((cat) => (
              <DemoLink
                key={cat}
                href={`/demo/nutag/shop?cat=${encodeURIComponent(cat)}`}
                className="group rounded-2xl border bg-white p-4 transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-16px_rgba(38,35,29,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5A6B3F]"
                ariaLabel={`${CATEGORY_LABEL[cat]} ангиллыг дэлгүүрээр харах`}
              >
                <span className="grid h-11 w-11 place-items-center rounded-xl transition-colors group-hover:bg-[#EDEFDF]" style={{ backgroundColor: OLIVE_TINT }}>
                  <CategoryIcon category={cat} />
                </span>
                <p className="nutag-display mt-3 font-bold leading-tight" style={{ color: INK }}>
                  {CATEGORY_LABEL[cat]}
                </p>
                <p className="mt-1 text-xs" style={{ color: INK_SOFT }}>
                  {CATEGORY_NOTE[cat]}
                </p>
                <p className="mt-2 text-[11px] font-bold uppercase tracking-wider" style={{ color: '#A0522D' }}>
                  {countOf(cat)} бүтээгдэхүүн
                </p>
              </DemoLink>
            ))}
          </div>
        </div>
      </section>

      {/* ── Онцлох бүтээгдэхүүн ──────────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-6xl px-4 py-14">
        <SectionHead
          kicker="ОНЦЛОХ БҮТЭЭГДЭХҮҮН"
          title="Энэ сарын сонголт"
          action={
            <DemoLink
              href="/demo/nutag/shop"
              className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-semibold transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5A6B3F]"
              style={{ color: OLIVE }}
            >
              Бүгдийг үзэх
              <ArrowRight className="h-4 w-4" />
            </DemoLink>
          }
        />
        {loading ? (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : featured.length === 0 ? (
          <p className="rounded-2xl border border-dashed px-6 py-10 text-center text-sm" style={{ borderColor: LINE, color: INK_SOFT }}>
            Одоогоор онцлох бүтээгдэхүүн тэмдэглэгдээгүй байна.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* ── Утга зорилго ─────────────────────────────────────────────────── */}
      <section className="py-14" style={{ backgroundColor: OLIVE_DEEP, color: '#F4F2E7' }}>
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 md:grid-cols-3">
          {[
            {
              icon: <HandHeart className="h-6 w-6" style={{ color: '#DCE5C8' }} />,
              title: 'Гарын авлага',
              text: 'Гар урлалыг дэмжих нь манай дэлгүүрийн үндсэн чиглэл — бүтээгдэхүүн бүр жижиг цувралаар бэлтгэгддэг.',
            },
            {
              icon: <Leaf className="h-6 w-6" style={{ color: '#DCE5C8' }} />,
              title: 'Байгаль ээлтэй материал',
              text: 'Ноос, эсгий, мод, арьс зэрэг байгалиас эх авсан материалыг сонгохыг зорьдог нь манай үнэт зүйл.',
            },
            {
              icon: <MapPinned className="h-6 w-6" style={{ color: '#DCE5C8' }} />,
              title: 'Дотоодын үйлдвэрлэл',
              text: 'Монгол гар урлаачидтай шууд хамтран ажиллаж, дотоодын бүтээгдэхүүнийг түгээхийг зорилгоо болгодог.',
            },
          ].map((v) => (
            <div key={v.title}>
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-white/10">{v.icon}</div>
              <h3 className="nutag-display mt-4 text-lg font-extrabold">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#D8DCC6]">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-6xl px-4 py-14">
        <div className="rounded-3xl border-2 border-dashed bg-white p-8 text-center sm:p-12" style={{ borderColor: '#C9C2AC' }}>
          <Kicker color={OLIVE}>НУТАГ · ДЭЛГҮҮР</Kicker>
          <h2 className="nutag-display mx-auto mt-3 max-w-xl text-2xl font-extrabold tracking-tight sm:text-3xl">
            Шинэ бүтээгдэхүүн байнга нэмэгдэж байна
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed" style={{ color: INK_SOFT }}>
            Арьс, эсгий, цай, гэр ахуй, аяллын бүх цуглуулгыг дэлгүүрээс шүүж үзээрэй — дуртай
            эдлэлээ сагслаад захиалаарай.
          </p>
          <Button
            size="lg"
            className="mt-7 rounded-full px-8 text-white hover:brightness-110"
            style={{ backgroundColor: OLIVE }}
            onClick={() => navigate('/demo/nutag/shop')}
          >
            Дэлгүүр рүү очих
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>
    </div>
  )
}
