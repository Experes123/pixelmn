'use client'

/**
 * ШОНХОР Gaming Café — Нүүр хуудас
 * Hero + статистик чип + бүсүүд + тоног төхөөрөмж + үнийн хүснэгт + байршил
 */

import { useMemo } from 'react'
import {
  Check,
  MapPin,
  Clock,
  Phone,
  Wifi,
  Armchair,
  CupSoda,
  ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { navigate } from '@/lib/hash-router'
import { useApi } from '@/lib/use-api'
import { LoadingState } from '@/components/shared/admin-kit'
import {
  NEON,
  LIME,
  TEXT,
  CLIP,
  CLIP_SM,
  GRID_BG,
  SCANLINES,
  HERO_IMG,
  EQUIP_IMG,
  ZONES,
  ZONE_DESC,
  ZONE_FEATURES,
  zoneIcon,
  ClipCard,
  SectionHead,
  fmtN,
  BTN_PRIMARY,
  BTN_GHOST,
} from './shared'

const SPEC_ROWS = [
  ['CPU', 'Intel Core i7-14700K'],
  ['GPU', 'NVIDIA GeForce RTX 4070 Ti'],
  ['RAM', '32GB DDR5 6000MHz'],
  ['MONITOR', '240Hz · 1ms хариулт'],
  ['NET', '1Gbps тогтвортой кабель'],
]

const WHY_US = [
  {
    icon: Wifi,
    title: 'Өндөр хурдтын интернет',
    desc: '1Gbps тогтвортой кабель холболт — лаг, ping хоцролтгүй тоглолт.',
  },
  {
    icon: Armchair,
    title: 'Тав тухтай сандал',
    desc: 'Урт тоглолтод зориулсан эргономик, нурууг дэмжигч сандал бүх суудалд.',
  },
  {
    icon: CupSoda,
    title: 'Хүйтэн уух зүйл',
    desc: 'Хөргөгчийн хэсэгт хүйтэн уух зүйл, хөнгөн хоол — шууд суудал руугаа.',
  },
]

export function HomePage() {
  const { data: stations, loading } = useApi<{ id: string; zone: string; pricePerHour: number; cpu: string; gpu: string; ram: string }>('pc-stations')

  /** Бүс бүрийн хамгийн бага цагийн үнэ + тохиргооны тайлбар */
  const zoneInfo = useMemo(() => {
    const map: Record<string, { min: number; spec: string }> = {}
    for (const z of ZONES) {
      const list = stations.filter((s) => s.zone === z)
      if (list.length === 0) continue
      const min = Math.min(...list.map((s) => s.pricePerHour))
      const s = list[0]
      map[z] = { min, spec: `${s.cpu} · ${s.gpu} · ${s.ram}` }
    }
    return map
  }, [stations])

  const minPrice = useMemo(
    () => (stations.length ? Math.min(...stations.map((s) => s.pricePerHour)) : null),
    [stations]
  )
  const stats = [
    { value: `${stations.length || 14}`, label: 'ЗОРИУЛАЛТЫН PC СУУДАЛ' },
    { value: '3', label: 'ТОГЛООМЫН БҮС' },
    { value: '240Hz', label: 'ХҮРТЭЛ МОНИТОР' },
    { value: minPrice ? `${fmtN(minPrice)}₮` : '…', label: 'ЦАГААС ЭХЭЛЭХ ҮНЭ' },
  ]

  return (
    <div>
      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden border-b border-[#2CE08026]">
        <img
          src={HERO_IMG}
          alt="Киберспорт заал — геймерийн суудлууд"
          loading="eager"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(100deg, rgba(4,17,11,0.97) 20%, rgba(4,17,11,0.82) 52%, rgba(4,17,11,0.45))' }}
        />
        <div className="absolute inset-0" style={GRID_BG} aria-hidden />
        <div className="absolute inset-0 opacity-70" style={SCANLINES} aria-hidden />

        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-20 sm:pb-24 sm:pt-28">
          <p
            className="mb-5 inline-block border border-[#2CE08055] bg-[#04110BBB] px-3 py-1.5 font-mono text-[11px] tracking-[0.28em] text-[#2CE080]"
            style={{ clipPath: CLIP_SM }}
          >
            КИБЕРСПОРТ · УЛААНБААТАР · 24/7
          </p>
          <h1 className="max-w-3xl text-4xl leading-[1.1] sm:text-6xl" style={{ fontFamily: 'var(--font-russo)', color: TEXT }}>
            ШОНХОР
            <span
              className="mt-2 block text-[#2CE080]"
              style={{ textShadow: '0 0 18px rgba(44,224,128,0.6), 0 0 46px rgba(44,224,128,0.28)' }}
            >
              ГЕЙМЕРИЙН ОРОН ЗАЙ
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-sm text-[#E7F5ECCC] sm:text-base">
            Киберспортын зэрэглэлийн PC, 240Hz монитор, өндөр хурдтын интернет — найзуудтайгаа хамт
            тоглох, тэмцээнд бэлдэх шилдэг газар.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" className={BTN_PRIMARY} style={{ clipPath: CLIP_SM }} onClick={() => navigate('/demo/pc-cafe/booking')}>
              Суудал захиалах
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className={BTN_GHOST}
              style={{ clipPath: CLIP_SM }}
              onClick={() => document.getElementById('zones')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Бүсүүдийг үзэх
            </Button>
          </div>
        </div>
      </section>

      {/* ─── СТАТИСТИК ЧИП ─── */}
      <section className="border-b border-[#2CE08026] bg-[#06150E]" aria-label="Товч статистик">
        <div className="mx-auto grid max-w-6xl grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`px-5 py-6 ${i % 2 === 1 ? 'border-l border-[#2CE0801A]' : ''} ${i >= 2 ? 'border-t border-[#2CE0801A] lg:border-t-0' : ''} ${i === 2 ? 'lg:border-l' : ''}`}
            >
              <p className="text-2xl sm:text-3xl" style={{ fontFamily: 'var(--font-russo)', color: NEON }}>
                {s.value}
              </p>
              <p className="mt-1 font-mono text-[10px] tracking-[0.18em] text-[#E7F5EC88]">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── БҮСҮҮД ─── */}
      <section id="zones" className="relative scroll-mt-20 py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHead
            kicker="БҮСҮҮД"
            title="Өөртөө таарах бүсээ сонгоорой"
            desc="Гурван түвшний зориулалтын бүс — хөнгөн тоглолтоос киберспортын бэлтгэл хүртэл."
          />
          {loading ? (
            <LoadingState label="Бүсүүдийг ачаалж байна…" />
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              {ZONES.map((zone) => {
                const Icon = zoneIcon(zone)
                const info = zoneInfo[zone]
                return (
                  <div
                    key={zone}
                    className="group h-full transition-transform duration-300 hover:-translate-y-1 hover:drop-shadow-[0_16px_28px_rgba(44,224,128,0.28)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                  >
                    <ClipCard>
                      <div className="flex h-full flex-col p-6">
                        <div
                          className="mb-4 flex h-11 w-11 items-center justify-center border border-[#2CE08055] bg-[#2CE08014] transition-all duration-300 group-hover:border-[#2CE08099] group-hover:bg-[#2CE08026] group-hover:shadow-[0_0_18px_-2px_rgba(44,224,128,0.5)]"
                          style={{ clipPath: CLIP_SM }}
                        >
                          <Icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" style={{ color: NEON }} aria-hidden />
                        </div>
                        <h3 className="text-xl transition-colors duration-300 group-hover:text-[#2CE080]" style={{ fontFamily: 'var(--font-russo)', color: TEXT }}>
                          {zone}
                        </h3>
                      <p className="mt-2 text-sm text-[#E7F5EC99]">{ZONE_DESC[zone]}</p>
                      <ul className="mt-4 space-y-1.5">
                        {ZONE_FEATURES[zone].map((f) => (
                          <li key={f} className="flex items-start gap-2 font-mono text-[12px] text-[#E7F5ECCC]">
                            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: LIME }} aria-hidden />
                            {f}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-auto pt-5">
                        <p className="font-mono text-lg" style={{ color: NEON }}>
                          {info ? `${fmtN(info.min)}₮` : '…'}
                          <span className="text-xs text-[#E7F5EC88]"> / цагаас</span>
                        </p>
                        <Button
                          className={`mt-3 w-full ${BTN_GHOST}`}
                          style={{ clipPath: CLIP_SM }}
                          onClick={() => navigate(`/demo/pc-cafe/booking?zone=${encodeURIComponent(zone)}`)}
                        >
                          Захиалах
                        </Button>
                      </div>
                      </div>
                    </ClipCard>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* ─── ТОНОГ ТӨХӨӨРӨМЖ + ДАВУУ ТАЛ ─── */}
      <section className="border-y border-[#2CE08026] bg-[#06150E] py-14 sm:py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 lg:grid-cols-2">
          <div>
            <ClipCard>
              <div className="relative">
                <img
                  src={EQUIP_IMG}
                  alt="VIP бүсийн геймин суудал, тохиргоо"
                  loading="lazy"
                  className="h-64 w-full object-cover sm:h-80"
                />
                <p className="absolute bottom-0 left-0 bg-[#04110BCC] px-3 py-1.5 font-mono text-[11px] tracking-wider text-[#2CE080]">
                  VIP БҮС — RTX 4070 Ti · 240Hz
                </p>
              </div>
            </ClipCard>
          </div>
          <div>
            <SectionHead
              kicker="ТОХИРГОО"
              title="Киберспортын зэрэглэлийн тоног төхөөрөмж"
            />
            <div className="mb-8 border border-[#2CE08026] bg-[#0A1F16]">
              {SPEC_ROWS.map(([k, v], i) => (
                <div
                  key={k}
                  className={`flex items-center justify-between gap-4 px-4 py-2.5 ${i > 0 ? 'border-t border-[#2CE08014]' : ''}`}
                >
                  <span className="font-mono text-[11px] tracking-[0.2em] text-[#E7F5EC77]">{k}</span>
                  <span className="text-right font-mono text-[13px] text-[#E7F5EC]">{v}</span>
                </div>
              ))}
            </div>
            <ul className="space-y-4">
              {WHY_US.map((w) => (
                <li key={w.title} className="flex gap-3">
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center border border-[#2CE08044] bg-[#2CE08010]"
                    style={{ clipPath: CLIP_SM }}
                  >
                    <w.icon className="h-4 w-4" style={{ color: NEON }} aria-hidden />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#E7F5EC]">{w.title}</p>
                    <p className="text-sm text-[#E7F5EC99]">{w.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ─── ҮНИЙН ХЭСЭГ ─── */}
      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHead
            kicker="ҮНЭ"
            title="Цагийн үнэ — бүсээр"
            desc="Нэмэлт далд төлбөргүй. Зөвхөн ашигласан цагаараа төлнэ."
          />
          {loading ? (
            <LoadingState label="Үнийн мэдээллийг ачаалж байна…" />
          ) : (
            <ClipCard>
              <div className="overflow-x-auto nice-scroll">
                <table className="w-full min-w-[560px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-[#2CE08026] bg-[#04110B66]">
                      <th className="px-5 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-[#E7F5EC88]">Бүс</th>
                      <th className="px-5 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-[#E7F5EC88]">Зориулалтын тохиргоо</th>
                      <th className="px-5 py-3 text-right font-mono text-[11px] uppercase tracking-[0.2em] text-[#E7F5EC88]">Үнэ / цаг</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ZONES.map((zone) => {
                      const Icon = zoneIcon(zone)
                      const info = zoneInfo[zone]
                      return (
                        <tr key={zone} className="border-b border-[#2CE08014] last:border-0">
                          <td className="px-5 py-4">
                            <span className="flex items-center gap-2.5">
                              <Icon className="h-4 w-4" style={{ color: NEON }} aria-hidden />
                              <span className="font-semibold text-[#E7F5EC]">{zone}</span>
                            </span>
                          </td>
                          <td className="px-5 py-4 font-mono text-[12px] text-[#E7F5ECCC]">{info?.spec ?? '—'}</td>
                          <td className="px-5 py-4 text-right font-mono text-[15px]" style={{ color: NEON }}>
                            {info ? `${fmtN(info.min)}₮` : '—'}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </ClipCard>
          )}
        </div>
      </section>

      {/* ─── БАЙРШИЛ + ЦАГ ─── */}
      <section className="border-t border-[#2CE08026] bg-[#06150E] py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHead kicker="БАЙРШИЛ" title="Биднийг олж ирээрэй" />
          <div className="grid gap-4 sm:grid-cols-2">
            <ClipCard>
              <div className="p-6">
                <MapPin className="mb-3 h-5 w-5" style={{ color: NEON }} aria-hidden />
                <p className="mb-1 font-mono text-[11px] uppercase tracking-[0.25em] text-[#E7F5EC88]">Хаяг</p>
                <p className="text-[#E7F5EC]">Улаанбаатар, Сүхбаатар дүүрэг, … (шинэчлэх)</p>
                <p className="mt-2 text-sm text-[#E7F5EC99]">Автобусны зогсоолоос хэдхэн алхмын зайд — чөлөөт зогсоолтой.</p>
              </div>
            </ClipCard>
            <ClipCard>
              <div className="p-6">
                <Clock className="mb-3 h-5 w-5" style={{ color: NEON }} aria-hidden />
                <p className="mb-1 font-mono text-[11px] uppercase tracking-[0.25em] text-[#E7F5EC88]">Цагийн хуваарь</p>
                <p className="text-[#E7F5EC]">24/7 — байнгын ажиллагаа</p>
                <p className="mt-2 flex items-center gap-2 text-sm text-[#E7F5EC99]">
                  <Phone className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  <span className="font-mono">+976 7000-XXXX (шинэчлэх)</span>
                </p>
              </div>
            </ClipCard>
          </div>
          <div className="mt-8 text-center">
            <Button size="lg" className={BTN_PRIMARY} style={{ clipPath: CLIP_SM }} onClick={() => navigate('/demo/pc-cafe/booking')}>
              Одоо суудлаа захиалаарай
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
