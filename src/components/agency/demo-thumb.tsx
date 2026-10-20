'use client'

import type { DemoInfo } from '@/config/demos'
import { DISPLAY_FONT } from '@/config/agency'

/** Төсөл бүрийн жижиг браузерийн фрейм — демо бүрийн өөрийн брэндээр нь ялгаатай CSS загвар */
export function DemoThumb({ demo }: { demo: DemoInfo }) {
  return (
    <div className="overflow-hidden rounded-xl border border-black/10 shadow-[0_2px_10px_-4px_rgba(11,11,12,0.12)]">
      {/* цонхны толгой */}
      <div className="flex items-center gap-1 bg-[#F2F1EE] px-2.5 py-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-black/20" />
        <span className="h-1.5 w-1.5 rounded-full bg-black/20" />
        <span className="h-1.5 w-1.5 rounded-full bg-black/20" />
        <span className="ml-2 flex-1 truncate rounded-sm bg-white px-1.5 py-[1px] text-[7px] font-medium text-black/45">
          pixelmn.mn/demo/{demo.id}
        </span>
      </div>
      <div className="relative aspect-[16/10]" style={{ background: demo.gradient }}>
        {demo.id === 'barber' && <BarberHint demo={demo} />}
        {demo.id === 'pc-cafe' && <PcCafeHint demo={demo} />}
        {demo.id === 'urgo' && <UrgoHint demo={demo} />}
        {demo.id === 'temuur' && <TemuurHint demo={demo} />}
        {demo.id === 'uzeg' && <UzegHint demo={demo} />}
        {demo.id === 'nutag' && <NutagHint demo={demo} />}
      </div>
    </div>
  )
}

/* ── ГАН Barbershop — захиалгын карт ── */
function BarberHint({ demo }: { demo: DemoInfo }) {
  return (
    <div className="flex h-full items-center justify-between gap-2 p-3">
      <div>
        <p className="text-[5.5px] font-semibold tracking-[0.3em]" style={{ color: demo.accent }}>
          ҮС · САХЛИС · АРЧИЛГАА
        </p>
        <p
          className="mt-0.5 text-[15px] font-bold leading-tight text-white"
          style={{ fontFamily: demo.fontVar }}
        >
          ГАН
        </p>
        <p className="mt-0.5 text-[6px] text-white/50">Премиум Barbershop</p>
        <span
          className="mt-2 inline-block rounded-full px-2 py-[3px] text-[6px] font-bold"
          style={{ background: demo.accent, color: '#171310' }}
        >
          Цаг захиалах
        </span>
      </div>
      <div className="w-[44%] rounded-lg border border-white/15 bg-white/10 p-2 backdrop-blur-sm">
        <p className="text-[5.5px] font-semibold uppercase tracking-wider text-white/50">
          Үйлчилгээ
        </p>
        {[
          ['Эрэгтэй үс засалт', '12,000₮'],
          ['Сахлис засварлалт', '8,000₮'],
          ['Хосолсон арчилгаа', '18,000₮'],
        ].map(([n, p]) => (
          <div
            key={n}
            className="mt-1 flex items-center justify-between gap-1 border-t border-white/10 pt-1 first:border-t-0 first:pt-0"
          >
            <span className="truncate text-[6px] text-white/80">{n}</span>
            <span className="shrink-0 text-[6px] font-semibold" style={{ color: demo.accent }}>
              {p}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── ШОНХОР Gaming Café — суудлын тор ── */
function PcCafeHint({ demo }: { demo: DemoInfo }) {
  const seats = [
    { n: 'S-01', busy: false },
    { n: 'S-02', busy: true },
    { n: 'S-03', busy: false },
    { n: 'S-04', busy: false },
    { n: 'VIP-1', busy: true },
    { n: 'VIP-2', busy: false },
    { n: 'C-01', busy: false },
    { n: 'C-02', busy: true },
  ]
  return (
    <div className="flex h-full flex-col justify-between p-3">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-bold text-white" style={{ fontFamily: demo.fontVar }}>
          ШОНХОР
        </p>
        <span
          className="rounded-sm px-1.5 py-[2px] text-[5.5px] font-bold"
          style={{ background: 'rgba(44,224,128,0.14)', color: demo.accent }}
        >
          24/7 НЭЭЛТТЭЙ
        </span>
      </div>
      <div className="grid grid-cols-4 gap-1">
        {seats.map((s) => (
          <div
            key={s.n}
            className="flex h-6 items-center justify-center rounded-[4px] border text-[5.5px] font-semibold"
            style={
              s.busy
                ? { borderColor: 'rgba(44,224,128,0.35)', background: 'rgba(44,224,128,0.12)', color: demo.accent }
                : { borderColor: 'rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.45)' }
            }
          >
            {s.n}
          </div>
        ))}
      </div>
      <p className="text-[6px] text-white/45">Суудал бүрийн техникийн үзүүлэлт харагдана · 6 суудал сул</p>
    </div>
  )
}

/* ── ӨРГӨӨ Ресторан — цэсний жагсаалт ── */
function UrgoHint({ demo }: { demo: DemoInfo }) {
  const items = [
    ['Бууз (4ш)', '5,900₮'],
    ['Махны шиш', '12,500₮'],
    ['Гүйлсэн шөл', '9,800₮'],
  ]
  return (
    <div className="flex h-full flex-col justify-between p-3">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[13px] font-bold text-white" style={{ fontFamily: demo.fontVar }}>
            ӨРГӨӨ
          </p>
          <p className="text-[6px] text-white/55">Монгол хоол · Хүргэлттэй</p>
        </div>
        <span
          className="rounded-full px-1.5 py-[2px] text-[5.5px] font-bold text-white"
          style={{ background: demo.accent }}
        >
          Сагс · 2
        </span>
      </div>
      <div className="flex flex-col gap-1">
        {items.map(([n, p]) => (
          <div
            key={n}
            className="flex items-center justify-between rounded-md border border-white/12 bg-white/10 px-2 py-1"
          >
            <span className="text-[6.5px] text-white/85">{n}</span>
            <span className="text-[6px] font-semibold text-white/90">{p}</span>
          </div>
        ))}
      </div>
      <p className="text-[6px] text-white/40">Хүргэлтийн хаягаа бичиж, демо төлбөр хийнэ</p>
    </div>
  )
}

/* ── ТЭМҮҮР Групп — редакцийн танилцуулга ── */
function TemuurHint({ demo }: { demo: DemoInfo }) {
  return (
    <div className="flex h-full flex-col justify-center p-3">
      <p
        className="text-[7px] font-semibold tracking-[0.32em]"
        style={{ color: demo.accent, fontFamily: demo.fontVar }}
      >
        ТЭМҮҮР ГРУПП
      </p>
      <div className="mt-2 border-t border-white/15 pt-2">
        <p className="text-[13px] font-bold leading-snug text-white" style={{ fontFamily: demo.fontVar }}>
          Аж үйлдвэрийн
          <br />
          дэд бүтцийн шийдэл
        </p>
      </div>
      <div className="mt-2.5 flex gap-2">
        {[
          ['25+', 'жилийн туршлага'],
          ['120+', 'хийсэн төсөл'],
          ['9', 'аймагт'],
        ].map(([v, l]) => (
          <div key={l} className="border-l border-white/20 pl-1.5">
            <p className="text-[8px] font-bold text-white">{v}</p>
            <p className="text-[5px] text-white/45">{l}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── ҮЗЭГ — постерын тор ── */
function UzegHint({ demo }: { demo: DemoInfo }) {
  return (
    <div className="flex h-full flex-col justify-between p-3">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold tracking-wide text-white" style={{ fontFamily: demo.fontVar }}>
          ҮЗЭГ
        </p>
        <span
          className="rounded-sm px-1.5 py-[2px] text-[5.5px] font-bold"
          style={{ background: 'rgba(255,61,90,0.15)', color: demo.accent }}
        >
          ШУУД ЭФИР
        </span>
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        {[
          'linear-gradient(160deg,rgba(255,61,90,0.55),rgba(18,4,10,0.9))',
          'linear-gradient(160deg,rgba(255,255,255,0.22),rgba(18,4,10,0.85))',
          'linear-gradient(160deg,rgba(120,20,40,0.6),rgba(18,4,10,0.9))',
        ].map((g, i) => (
          <div key={i} className="relative h-10 rounded-md" style={{ background: g }}>
            {i === 1 && (
              <span className="absolute inset-0 m-auto h-3 w-3 rounded-full border border-white/70 bg-black/30">
                <span className="absolute left-1/2 top-1/2 -translate-x-1/3 -translate-y-1/2 border-y-[3px] border-l-[5px] border-y-transparent border-l-white" />
              </span>
            )}
          </div>
        ))}
      </div>
      <p className="text-[6px] text-white/50">Хайлт · жанр шүүлтүүр · үзэх жагсаалт</p>
    </div>
  )
}

/* ── НУТАГ Store — бүтээгдэхүүний карт ── */
function NutagHint({ demo }: { demo: DemoInfo }) {
  const products = [
    ['Арьсан цүнх', '48,000₮'],
    ['Эсгий пантүфл', '36,500₮'],
    ['Ваар аяга', '22,000₮'],
  ]
  return (
    <div className="flex h-full flex-col justify-between p-3">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-extrabold tracking-tight" style={{ color: '#2f3a22', fontFamily: demo.fontVar }}>
          НУТАГ Store
        </p>
        <span
          className="rounded-full px-1.5 py-[2px] text-[5.5px] font-bold text-white"
          style={{ background: demo.accent }}
        >
          Сагс · 1
        </span>
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        {products.map(([n, p]) => (
          <div key={n} className="rounded-md bg-white/85 p-1.5 shadow-sm">
            <div className="h-6 rounded-sm" style={{ background: demo.accent, opacity: 0.22 }} />
            <p className="mt-1 truncate text-[5.5px] font-semibold text-[#2f3a22]">{n}</p>
            <p className="text-[5.5px] text-[#5A6B3F]">{p}</p>
          </div>
        ))}
      </div>
      <p className="text-[6px]" style={{ color: 'rgba(47,58,34,0.55)' }}>
        Гар урлал · арьс эсгий бүтээгдэхүүн
      </p>
    </div>
  )
}

export { DISPLAY_FONT }
