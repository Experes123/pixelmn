'use client'

import { motion } from 'framer-motion'
import { Lock, Plus, TrendingUp } from 'lucide-react'
import { DISPLAY_FONT } from '@/config/agency'

const NAV = ['Нүүр', 'Төслүүд', 'Хүсэлтүүд', 'Багц', 'Тохиргоо']

const STATS = [
  { label: 'Нийт хүсэлт', value: '24', delta: '+4' },
  { label: 'Идэвхтэй төсөл', value: '6', delta: '+2' },
  { label: 'Цахим худалдаа', value: '8', delta: '+1' },
]

const BARS = [30, 44, 38, 56, 50, 72, 92]
const MONTHS = ['4с', '5с', '6с', '7с', '8с', '9с', '10с']

const PROJECTS = [
  { name: 'НУТАГ цахим дэлгүүр', stage: 'Хөгжүүлэлт', status: 'Идэвхтэй', tone: 'bg-[#E4572E]/10 text-[#E4572E]' },
  { name: 'ГАН Barbershop захиалга', stage: 'Тест', status: 'Хүлээгдэж', tone: 'bg-black/[0.06] text-black/55' },
  { name: 'ӨРГӨӨ хүргэлтийн систем', stage: 'Найруулга', status: 'Дууссан', tone: 'bg-emerald-50 text-emerald-700' },
]

/** Нүүр хуудасны баруун талын CSS/HTML фрейм — браузерийн цонхон доторх студийн самбар */
export function HeroMockup() {
  return (
    <div className="relative mx-auto w-full max-w-[540px]" aria-hidden="true">
      {/* хөвөгч акцент хэлбэрүүд */}
      <div className="absolute -right-8 -top-10 h-44 w-44 rounded-full bg-[#E4572E]/15 blur-3xl" />
      <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-[#E4572E]/10 blur-2xl" />
      <div className="absolute -left-6 top-16 hidden h-20 w-20 rotate-12 rounded-2xl border border-[#E4572E]/25 bg-white/70 sm:block" />
      <div className="absolute -right-4 bottom-10 hidden h-14 w-14 -rotate-6 rounded-xl border border-black/10 bg-white/70 sm:block" />

      <motion.div
        animate={{ y: [0, -9, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="relative"
      >
        <div className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_32px_80px_-32px_rgba(11,11,12,0.35)]">
          {/* цонхны толгой */}
          <div className="flex items-center gap-2 border-b border-black/[0.08] bg-[#FAFAF8] px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-black/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-black/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#E4572E]/60" />
            <span className="mx-auto flex items-center gap-1.5 rounded-md border border-black/[0.08] bg-white px-3 py-1 text-[11px] font-medium text-black/55">
              <Lock className="h-2.5 w-2.5" />
              pixelmn.mn
            </span>
            <span className="w-10" />
          </div>

          <div className="flex bg-white">
            {/* хажуугийн самбар */}
            <div className="hidden w-[118px] shrink-0 flex-col border-r border-black/[0.08] bg-[#FAFAF8] p-3 sm:flex">
              <div className="mb-3 flex items-center gap-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-[5px] bg-[#0B0B0C]">
                  <span className="flex items-end gap-[1.5px]">
                    <span className="h-1.5 w-[2px] rounded-sm bg-[#E4572E]/50" />
                    <span className="h-2.5 w-[2px] rounded-sm bg-[#E4572E]/80" />
                    <span className="h-3.5 w-[2px] rounded-sm bg-[#E4572E]" />
                  </span>
                </span>
                <span style={DISPLAY_FONT} className="text-[9px] font-extrabold tracking-tight">
                  PIXELMN
                </span>
              </div>
              <div className="flex flex-col gap-1">
                {NAV.map((n, i) => (
                  <span
                    key={n}
                    className={
                      i === 2
                        ? 'flex items-center gap-1.5 rounded-md bg-white px-2 py-1.5 text-[9.5px] font-semibold text-[#0B0B0C] shadow-[0_1px_2px_rgba(11,11,12,0.06)]'
                        : 'flex items-center gap-1.5 rounded-md px-2 py-1.5 text-[9.5px] text-black/45'
                    }
                  >
                    <span
                      className={
                        i === 2
                          ? 'h-1.5 w-1.5 rounded-full bg-[#E4572E]'
                          : 'h-1.5 w-1.5 rounded-full bg-black/20'
                      }
                    />
                    {n}
                  </span>
                ))}
              </div>
              <div className="mt-auto rounded-lg bg-[#0B0B0C] p-2">
                <p className="text-[8.5px] font-semibold text-white/80">Шинэ төсөл</p>
                <p className="mt-1 flex items-center gap-1 text-[8px] text-white/45">
                  <Plus className="h-2.5 w-2.5" /> Хүсэлт нэмэх
                </p>
              </div>
            </div>

            {/* үндсэн агуулга */}
            <div className="min-w-0 flex-1 p-3.5 sm:p-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <div>
                  <p style={DISPLAY_FONT} className="text-[12px] font-bold tracking-tight">
                    Сайн байна уу
                  </p>
                  <p className="text-[9px] text-black/45">Студийн хяналтын самбар</p>
                </div>
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#E4572E]/12 text-[9px] font-bold text-[#E4572E] ring-1 ring-[#E4572E]/25">
                  OD
                </span>
              </div>

              {/* статистик карт */}
              <div className="mb-3 grid grid-cols-3 gap-2">
                {STATS.map((s) => (
                  <div key={s.label} className="rounded-lg border border-black/[0.08] bg-white p-2">
                    <p className="truncate text-[8.5px] text-black/45">{s.label}</p>
                    <div className="mt-0.5 flex items-baseline justify-between gap-1">
                      <span style={DISPLAY_FONT} className="text-[15px] font-extrabold tracking-tight">
                        {s.value}
                      </span>
                      <span className="flex items-center gap-0.5 text-[7.5px] font-semibold text-emerald-600">
                        <TrendingUp className="h-2 w-2" />
                        {s.delta}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* CSS диаграмм */}
              <div className="mb-3 rounded-lg border border-black/[0.08] p-2.5">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-[9px] font-semibold text-black/65">Сарын орлого</p>
                  <motion.span
                    animate={{ opacity: [1, 0.55, 1] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                    className="rounded-full bg-[#E4572E]/10 px-1.5 py-0.5 text-[7.5px] font-bold text-[#E4572E]"
                  >
                    +38%
                  </motion.span>
                </div>
                <div className="flex h-14 items-end gap-1.5">
                  {BARS.map((h, i) => (
                    <div key={i} className="flex min-w-0 flex-1 flex-col items-center gap-1">
                      <motion.div
                        initial={{ height: '4%' }}
                        animate={{ height: `${h}%` }}
                        transition={{ duration: 0.9, delay: 0.5 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                        className={
                          i === BARS.length - 1
                            ? 'w-full rounded-t-[3px] bg-[#E4572E]'
                            : 'w-full rounded-t-[3px] bg-black/[0.08]'
                        }
                      />
                      <span className="text-[6.5px] leading-none text-black/35">{MONTHS[i]}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* төслийн мөрүүд */}
              <div className="rounded-lg border border-black/[0.08] p-2.5">
                <p className="mb-1.5 text-[9px] font-semibold text-black/65">Идэвхтэй төслүүд</p>
                <div className="flex flex-col">
                  {PROJECTS.map((p) => (
                    <div
                      key={p.name}
                      className="flex items-center justify-between gap-2 border-t border-black/[0.05] py-1.5 first:border-t-0"
                    >
                      <div className="flex min-w-0 items-center gap-1.5">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#E4572E]/70" />
                        <div className="min-w-0">
                          <p className="truncate text-[9px] font-medium text-black/75">{p.name}</p>
                          <p className="text-[7.5px] text-black/40">{p.stage}</p>
                        </div>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-1.5 py-0.5 text-[7px] font-semibold ${p.tone}`}
                      >
                        {p.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* цонхны доод сүүдэр — гүн мэдрэмж */}
        <div className="mx-auto h-2 w-3/4 rounded-b-xl border-x border-b border-black/[0.06] bg-white/60" />
      </motion.div>
    </div>
  )
}
