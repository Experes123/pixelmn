'use client'

/**
 * ШОНХОР Gaming Café — хуваалцсан дизайны систем
 * Харанхуй esports палитр: near-black ногоон фон + неон ногоон (#2CE080) акцент.
 * Булан тайрсан (clip-path) картууд, гэрэлтдэг status цэг, mono spec текст.
 */

import type { CSSProperties, ReactNode } from 'react'
import { Monitor, Crown, Gamepad2 } from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Палитр ───────────────────────────────────────────────
export const NEON = '#2CE080'
export const LIME = '#A3E635'
export const BG = '#04110B'
export const PANEL = '#0A1F16'
export const TEXT = '#E7F5EC'
export const RED = '#F87171'
export const GRAY = '#9CA3AF'

export const STATUS_DOT: Record<string, string> = {
  боломжтой: NEON,
  эзлэгдсэн: RED,
  засварт: GRAY,
}

// ─── Ангуляр clip-path ────────────────────────────────────
export const CLIP = 'polygon(14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%, 0 14px)'
export const CLIP_SM = 'polygon(9px 0, 100% 0, 100% calc(100% - 9px), calc(100% - 9px) 100%, 0 100%, 0 9px)'

// ─── Сүлжээ / сканлайн фон ────────────────────────────────
export const GRID_BG: CSSProperties = {
  backgroundImage:
    'linear-gradient(rgba(44,224,128,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(44,224,128,0.05) 1px, transparent 1px)',
  backgroundSize: '44px 44px',
}

export const SCANLINES: CSSProperties = {
  backgroundImage:
    'repeating-linear-gradient(0deg, rgba(0,0,0,0.20) 0px, rgba(0,0,0,0.20) 1px, transparent 1px, transparent 4px)',
}

// ─── Зургийн сан (IMAGE_INDEX.json → pc1, pc2) ────────────
export const HERO_IMG = 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/3e88e3b44447.jpg'
export const EQUIP_IMG = 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/bec4de8442d0.jpg'

// ─── Типүүд ───────────────────────────────────────────────
export type Station = {
  id: string
  name: string
  zone: string
  cpu: string
  gpu: string
  ram: string
  extras: string | null
  pricePerHour: number
  status: string
  active: boolean
}

export type Booking = {
  id: string
  stationId: string | null
  stationName: string
  zone: string
  date: string
  startTime: string
  hours: number
  customerName: string
  phone: string
  status: string
  paymentStatus: string
  totalAmount: number
}

// ─── Бүсийн мэдээлэл ──────────────────────────────────────
export const ZONES = ['Стандарт', 'VIP', 'Консоль'] as const

export function zoneIcon(zone: string) {
  if (zone === 'VIP') return Crown
  if (zone === 'Консоль') return Gamepad2
  return Monitor
}

export const ZONE_DESC: Record<string, string> = {
  Стандарт: 'Өдөр тутмын тоглолт, вэб сёрфинг, эспортыг эхлээд туршиж үзэгчдэд тохиромжтой, хямд үнтэй бүс.',
  VIP: 'Киберспортын түвшний тохиргоо, 240Hz монитор болон премиум сандал бүхий чимээ гоожуулсан тусгай бүс.',
  Консоль: 'Найзуудтайгаа нэг дэлгэцэн дээр FIFA, Tekken тоглох зориулалтын PS5 бүс — диван, хоёр гар бүрэн.',
}

export const ZONE_FEATURES: Record<string, string[]> = {
  Стандарт: ['180Hz монитор · 1ms', 'Механик гэрэлтдэг гар', 'Геймерийн хулгана + дэвсгэр'],
  VIP: ['240Hz монитор · 1ms', 'Премиум эргономик сандал', 'Чимээ гоожуулсан тусгаар бүс'],
  Консоль: ['65 инч 4K HDR телевиз', 'PS5 + хоёр DualSense гар', 'Тав тухтай диван суудал'],
}

// ─── Цагийн туслах ────────────────────────────────────────
export const START_TIMES = Array.from({ length: 13 }, (_, i) => `${String(10 + i).padStart(2, '0')}:00`) // 10:00–22:00

export function toMin(t: string): number {
  const [h, m] = t.split(':').map(Number)
  return (h || 0) * 60 + (m || 0)
}

/** [start, start+hours) хоорондох давхцал */
export function timesOverlap(s1: number, h1: number, s2: number, h2: number): boolean {
  return s1 < s2 + h2 * 60 && s2 < s1 + h1 * 60
}

export function isoDay(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export const todayStr = () => isoDay(new Date())

export function plusDaysStr(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return isoDay(d)
}

/** YYYY-MM-DD → Даваа гэх мэт долоо хоногийн нэр (Intl-ээс хамаарахгүй тул гар аргаар) */
const MN_WEEKDAYS = ['Ням', 'Даваа', 'Мягмар', 'Лхагва', 'Пүрэв', 'Баасан', 'Бямба']

export function weekdayOf(d: string): string {
  const [y, m, day] = d.split('-').map(Number)
  if (!y || !m || !day) return ''
  return MN_WEEKDAYS[new Date(y, m - 1, day).getDay()]
}

/** Цагийн мужийн төгсгөл: 18:00 + 2 = 20:00 (24 цагаар давбал маргааш гэж тэмдэглэнэ) */
export function endTimeLabel(start: string, hours: number): string {
  const end = toMin(start) + hours * 60
  const hh = String(Math.floor(end / 60) % 24).padStart(2, '0')
  return `${hh}:00${end >= 1440 ? ' (+1 өдөр)' : ''}`
}

export const fmtN = (n: number) => n.toLocaleString('mn-MN')

/** Лавлах код: захиалгын id-ийн сүүлийн 6 тэмдэгт */
export const refCode = (id: string) => `ШХ-${id.slice(-6).toUpperCase()}`

// ─── Компонентууд ─────────────────────────────────────────

/** Булан тайрсан, нимгэн неон хүрээтэй карт */
export function ClipCard({
  children,
  className,
  bg = PANEL,
  style,
}: {
  children: ReactNode
  className?: string
  bg?: string
  style?: CSSProperties
}) {
  return (
    <div
      className={cn('h-full', className)}
      style={{
        clipPath: CLIP,
        background:
          'linear-gradient(135deg, rgba(44,224,128,0.38), rgba(44,224,128,0.10) 45%, rgba(44,224,128,0.22))',
        padding: 1,
        ...style,
      }}
    >
      <div className="h-full w-full" style={{ clipPath: CLIP, background: bg }}>
        {children}
      </div>
    </div>
  )
}

/** Гэрэлтдэг төлөвийн цэг */
export function GlowDot({ color = NEON, size = 8, label }: { color?: string; size?: number; label?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
      <span
        aria-hidden
        className="inline-block shrink-0 rounded-full"
        style={{ width: size, height: size, backgroundColor: color, boxShadow: `0 0 6px ${color}, 0 0 14px ${color}55` }}
      />
      {label && (
        <span className="text-xs font-medium" style={{ color }}>
          {label}
        </span>
      )}
    </span>
  )
}

/** Хэсгийн гарчиг (kicker mono + Russo заголовч) */
export function SectionHead({ kicker, title, desc }: { kicker: string; title: string; desc?: string }) {
  return (
    <div className="mb-8">
      <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: NEON }}>
        {kicker}
      </p>
      <h2 className="text-2xl sm:text-3xl" style={{ fontFamily: 'var(--font-russo)', color: TEXT }}>
        {title}
      </h2>
      {desc && <p className="mt-2 max-w-2xl text-sm text-[#E7F5EC99]">{desc}</p>}
    </div>
  )
}

// ─── Тогтмол классууд ─────────────────────────────────────
export const BTN_PRIMARY =
  'rounded-none bg-[#2CE080] font-semibold text-[#04110B] hover:bg-[#5BEB9C] hover:text-[#04110B] focus-visible:ring-[#2CE080]'
export const BTN_GHOST =
  'rounded-none border border-[#2CE08066] bg-transparent text-[#2CE080] hover:bg-[#2CE08014] hover:text-[#2CE080] focus-visible:ring-[#2CE080]'
export const INPUT_CLS =
  'rounded-none border-[#2CE08033] bg-[#06170F] text-[#E7F5EC] placeholder:text-[#E7F5EC55] focus-visible:border-[#2CE080] focus-visible:ring-[#2CE08044]'
export const SELECT_TRIGGER_CLS =
  'rounded-none border-[#2CE08033] bg-[#06170F] text-[#E7F5EC] focus-visible:border-[#2CE080] focus-visible:ring-[#2CE08044] data-[state=open]:border-[#2CE080]'
export const SELECT_CONTENT_CLS =
  'dark rounded-none border-[#2CE08033] bg-[#0A1F16] text-[#E7F5EC]'

/** Радикс порталыг харанхуй болгох (Dialog, Select г.м. дотор dark класс) */
export const DARK_PORTAL = 'dark'
