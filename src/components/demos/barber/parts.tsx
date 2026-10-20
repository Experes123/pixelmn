'use client'

/**
 * ГАН Barbershop — нийтлэг төрөл, тохиргоо, туслах компонентууд.
 * Энэ файл нь демо доторх бусад хуудсууд (home, booking, status, admin)-д хуваалцана.
 */

import type { CSSProperties, ReactNode } from 'react'
import { cn } from '@/lib/utils'

// ─────────────────────────── ТӨРЛҮҮД ───────────────────────────

export type Service = {
  id: string
  name: string
  category: string // үс | сахлис | хосолсон | арчилгаа
  price: number
  durationMin: number
  description: string
  active: boolean
}

export type Barber = {
  id: string
  name: string
  title: string
  bio: string
  specialties: string // таслалаар тусгаарласан
  imageUrl?: string | null
  active: boolean
}

export type Booking = {
  id: string
  serviceId?: string | null
  serviceName: string
  barberId?: string | null
  barberName: string
  date: string // YYYY-MM-DD
  time: string // HH:mm
  customerName: string
  phone: string
  email?: string | null
  notes?: string | null
  status: string
  paymentStatus: string
  totalAmount: number
  meta?: { noShow?: boolean } | null // демо: ирээгүйн тэмдэглэгээ
}

// ─────────────────────────── БРЭНД ТОХИРГОО ───────────────────────────

export const GOLD = '#C9973B'
export const GOLD_LIGHT = '#D8A84F'
export const INK = '#171310'
export const INK_2 = '#221B15'
export const INK_3 = '#1D1712'
export const CREAM = '#F3EBDD'
export const MUTED = '#A89A87'

/** Playfair Display — гарчиг, сериф хэв маяг */
export const serifStyle: CSSProperties = { fontFamily: 'var(--font-playfair), Georgia, serif' }

/** Нарийн зөөлөн noise текстур (SVG feTurbulence) */
export const NOISE_URL =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='0.055'/%3E%3C/svg%3E"

export const noiseStyle: CSSProperties = { backgroundImage: `url("${NOISE_URL}")` }

/** IMAGE_INDEX-ээс сонгосон зургийн URL-ууд (гадаад CDN) */
export const IMG = {
  hero: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/1a22c974e113.jpg',
  cta: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/45d79d8edd08.png',
  interior: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/85e694a79b30.jpg',
}

/** Залаачдын профайл зураг (IMAGE_INDEX barber2/3/4) */
export const BARBER_IMAGES = [
  'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/68513c0c301a.jpeg',
  'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/e066d713f3f2.jpg',
  'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/6b44f125712f.jpg',
  'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/a1638df3b701.jpg',
  'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/ebc0fc3d6bd0.jpg',
  'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/6ccc2727cc82.jpg',
]

export const CATEGORIES = ['үс', 'сахлис', 'хосолсон', 'арчилгаа'] as const

// ─────────────────────────── ТУСЛАХ ФУНКЦҮҮД ───────────────────────────

export const catLabel = (c: string) => (c ? c.charAt(0).toUpperCase() + c.slice(1) : c)

export const fmtDur = (min: number) => `${min} мин`

export const fmtDayLabel = (d: string) => {
  const [y, m, day] = d.split('-').map(Number)
  if (!y || !m || !day) return d
  const WEEKDAYS = ['Ням', 'Дав', 'Мяг', 'Лха', 'Пүр', 'Баа', 'Бям']
  const MONTHS = [
    '1-р сар', '2-р сар', '3-р сар', '4-р сар', '5-р сар', '6-р сар',
    '7-р сар', '8-р сар', '9-р сар', '10-р сар', '11-р сар', '12-р сар',
  ]
  const dt = new Date(y, m - 1, day)
  return `${WEEKDAYS[dt.getDay()]}, ${MONTHS[m - 1]} ${day}`
}

export const dateToStr = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

export const todayStr = () => dateToStr(new Date())

export const addDaysStr = (base: string, days: number) => {
  const [y, m, d] = base.split('-').map(Number)
  return dateToStr(new Date(y, m - 1, d + days))
}

const minToTime = (m: number) =>
  `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`

/** 10:00–20:00 хооронд 30 минутын нэгжээр цагийн нүд үүсгэнэ.
 *  Сүүлийн цаг нь сонгосон үйлчилгээ дуусахаа амжуулна (жишээ: 30 мин → 19:30). */
export const slotsFor = (durationMin: number): string[] => {
  const dur = Math.max(15, Math.round(durationMin || 30))
  const out: string[] = []
  for (let m = 10 * 60; m + dur <= 20 * 60; m += 30) out.push(minToTime(m))
  return out
}

/** Захиалгын дугаар (демо): id-ийн сүүлийн 6 тэмдэгт */
export const bookingRef = (id: string) => `ГАН-${id.slice(-6).toUpperCase()}`

// ─────────────────────────── Жижиг ХАРАГДАЦУУД ───────────────────────────

/** Алтан шошго — "БАРБЕРШОП · УЛААНБААТАР" гэх мэт жижиг дээд хэсгийн текст */
export function Kicker({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={cn('text-[11px] font-medium uppercase tracking-[0.35em] text-[#C9973B]', className)}
    >
      {children}
    </p>
  )
}

/** Хэсгийн гарчиг — кикер + сериф гарчиг + нарийн алтан зураас */
export function SectionHead({
  kicker,
  title,
  sub,
}: {
  kicker: string
  title: ReactNode
  sub?: string
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <Kicker>{kicker}</Kicker>
      <h2 className="mt-3 text-3xl leading-tight sm:text-4xl" style={serifStyle}>
        {title}
      </h2>
      <div className="mx-auto mt-5 h-px w-20 bg-gradient-to-r from-transparent via-[#C9973B] to-transparent" />
      {sub && <p className="mt-4 text-sm leading-relaxed text-[#A89A87]">{sub}</p>}
    </div>
  )
}

/** Ангиллын чип */
export function CategoryChip({ label, className }: { label: string; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center rounded-full border border-[#C9973B55] bg-[#C9973B14] px-2.5 py-0.5 text-[11px] uppercase tracking-wider text-[#C9973B]',
        className
      )}
    >
      {label}
    </span>
  )
}

/** ГАН бренд тэмдэг — сериф "ГАН" + жижиг BARBERSHOP */
export function BrandMark({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-col leading-none', className)} aria-label="ГАН Barbershop">
      <span
        className="text-[26px] tracking-[0.1em] text-[#C9973B] sm:text-3xl"
        style={serifStyle}
      >
        ГАН
      </span>
      <span className="mt-1 text-[9px] uppercase tracking-[0.45em] text-[#A89A87]">
        Barbershop
      </span>
    </div>
  )
}

export const btnGold =
  'bg-[#C9973B] text-[#171310] font-semibold hover:bg-[#D8A84F] hover:text-[#171310]'

export const btnOutline =
  'border border-[#C9973B66] bg-transparent text-[#F3EBDD] hover:bg-[#C9973B1A] hover:text-[#F3EBDD]'

/** Харанхуй интерьерт зориулсан input классууд */
export const inputCls =
  'border-[#C9973B33] bg-[#1D1712] text-[#F3EBDD] placeholder:text-[#6E6152] focus-visible:ring-[#C9973B55] focus-visible:border-[#C9973B88]'
