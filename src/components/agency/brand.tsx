'use client'

import type { CSSProperties, ReactNode } from 'react'
import { motion } from 'framer-motion'
import { BRAND, DISPLAY_FONT } from '@/config/agency'
import { cn } from '@/lib/utils'

/** ───────── Лого — дугуйрсан квадрат + 3 өсөж буй зурвас + үгэн тэмдэг ───────── */
export function LogoMark({ size = 36, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className={cn('shrink-0', className)}
    >
      <rect x="1" y="1" width="46" height="46" rx="12" fill={BRAND.ink} />
      <rect x="13" y="27" width="5" height="9" rx="1.5" fill={BRAND.accent} opacity="0.55" />
      <rect x="21.5" y="20" width="5" height="16" rx="1.5" fill={BRAND.accent} opacity="0.8" />
      <rect x="30" y="12" width="5" height="24" rx="1.5" fill={BRAND.accent} />
    </svg>
  )
}

export function Logo({
  dark = false,
  size = 36,
  className,
}: {
  dark?: boolean
  size?: number
  className?: string
}) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <LogoMark size={size} />
      <span className="flex flex-col leading-none">
        <span
          style={DISPLAY_FONT}
          className={cn(
            'text-[17px] font-extrabold tracking-tight',
            dark ? 'text-white' : 'text-[#0B0B0C]'
          )}
        >
          PIXELMN
        </span>
        <span
          className={cn(
            'mt-1 text-[8.5px] font-semibold tracking-[0.34em]',
            dark ? 'text-white/50' : 'text-black/45'
          )}
        >
          ДИЖИТАЛ СТУДИО
        </span>
      </span>
    </span>
  )
}

/** ───────── Нийтлэг хэсгийн гарчиг ───────── */
export function SectionHeading({
  eyebrow,
  title,
  note,
  align = 'left',
  dark = false,
}: {
  eyebrow?: string
  title: string
  note?: string
  align?: 'left' | 'center'
  dark?: boolean
}) {
  return (
    <FadeIn className={cn('max-w-2xl', align === 'center' && 'mx-auto text-center')}>
      {eyebrow && (
        <p
          className={cn(
            'mb-3 text-[12px] font-bold uppercase tracking-[0.18em]',
            align === 'center' && 'flex justify-center',
            dark ? 'text-[#E4572E]' : 'text-[#E4572E]'
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2
        style={DISPLAY_FONT}
        className={cn(
          'text-3xl font-extrabold tracking-tight sm:text-4xl',
          dark ? 'text-white' : 'text-[#0B0B0C]'
        )}
      >
        {title}
      </h2>
      {note && (
        <p className={cn('mt-4 text-[15px] leading-relaxed', dark ? 'text-white/60' : 'text-black/60')}>
          {note}
        </p>
      )}
    </FadeIn>
  )
}

/** ───────── Нэмэлт чимэглэлийн жижиг шошго ───────── */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-3.5 py-1.5 text-[12px] font-semibold text-black/60 shadow-[0_1px_2px_rgba(11,11,12,0.04)]',
        className
      )}
    >
      {children}
    </span>
  )
}

/** ───────── Framer-motion ахин давтагдахгүй оролт ───────── */
export function FadeIn({
  children,
  className,
  delay = 0,
  y = 22,
  style,
}: {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
  style?: CSSProperties
}) {
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
