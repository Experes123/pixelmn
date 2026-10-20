'use client'

import { useCallback, useEffect, useState } from 'react'
import { BENEFITS, BRAND, DEFAULT_PRICING, FAQ_ITEMS, PROCESS_STEPS, SERVICES, TRUST_CHIPS } from '@/config/agency'

/**
 * ───────────────── Сайтын контентын давхарга ─────────────────
 * Бүх засварлагдах текст site-content key='content' бичилтэд (JSON) хадгалагдана.
 * Утга байхгүй бол config/agency.ts дахь анхдагч утгууд ашиглагдана.
 * Ингэснээр админ панелаас геро текст, үйлчилгээ, ТҮА, холбоо барих гэх мэт
 * бүх зүйлийг өөрчлөх боломжтой.
 */

export type HeroContent = {
  eyebrow: string
  title: string
  titleAccent: string
  titleEnd: string
  subtitle: string
  ctaPrimary: string
  ctaSecondary: string
  chips: string[]
}

export type ContactContent = {
  email: string
  phone: string
  address: string
}

export type FooterContent = {
  tagline: string
  socials: {
    facebook: string
    instagram: string
    linkedin: string
    youtube: string
  }
}

export type ServiceText = { title: string; description: string }
export type BenefitText = { title: string; description: string }
export type StepText = { title: string; description: string }
export type FaqText = { q: string; a: string }

export type SiteContent = {
  hero: HeroContent
  contact: ContactContent
  footer: FooterContent
  services: ServiceText[]
  benefits: BenefitText[]
  steps: StepText[]
  faq: FaqText[]
  partners: string[]
}

export const DEFAULT_CONTENT: SiteContent = {
  hero: {
    eyebrow: 'Вэб студио · Улаанбаатар',
    title: 'Таны бизнесийг',
    titleAccent: 'өсгөх',
    titleEnd: 'мэргэжлийн вэб бүтээгдэхүүнүүд',
    subtitle:
      'Бид монгол аж ахуйн нэгж, байгууллагуудад вэбсайтаас цахим худалдаа, захиалгын систем хүртэл — дизайнаас хөгжүүлэлт хүртэлх бүх шатыг бүрэн ажиллагаатай нийлүүлдэг.',
    ctaPrimary: 'Төсөл эхлүүлэх',
    ctaSecondary: 'Жишээ төслүүд үзэх',
    chips: ['Үнэгүй зөвлөгөө', '1-2 хоногт хариу өгнө', 'Эхнээсээ дуустал нийлүүлнэ'],
  },
  contact: {
    email: BRAND.email,
    phone: BRAND.phone,
    address: BRAND.address,
  },
  footer: {
    tagline: `${BRAND.name} бол монгол бизнесүүдийг дижитал ертөнцөд мэргэжлийн түвшинд танилцуулдаг вэб студио.`,
    socials: { facebook: '', instagram: '', linkedin: '', youtube: '' },
  },
  services: SERVICES.map((s) => ({ title: s.title, description: s.description })),
  benefits: BENEFITS.map((b) => ({ title: b.title, description: b.description })),
  steps: PROCESS_STEPS.map((p) => ({ title: p.title, description: p.description })),
  faq: FAQ_ITEMS.map((f) => ({ q: f.q, a: f.a })),
  partners: [...TRUST_CHIPS],
}

/** Мөрийн талбаруудыг аюулгүй нэгтгэнэ — хоосон утга орсон бол анхдагчаа хадгална */
function mergeStrings<T extends object>(base: T, raw: unknown, keys: (keyof T)[]): T {
  if (!raw || typeof raw !== 'object') return base
  const o = raw as Record<string, unknown>
  const out = { ...base }
  for (const k of keys) {
    const v = o[k as string]
    if (typeof v === 'string' && v.trim().length > 0) {
      ;(out as Record<string, unknown>)[k as string] = v.trim()
    }
  }
  return out
}

function mergeList<T extends Record<string, string>>(
  base: T[],
  raw: unknown,
  keys: (keyof T)[]
): T[] {
  if (!Array.isArray(raw) || raw.length === 0) return base
  const items = raw.slice(0, 40).map((entry, i) => {
    const fallback = base[Math.min(i, base.length - 1)] ?? base[0]
    const o = entry && typeof entry === 'object' ? (entry as Record<string, unknown>) : {}
    const out = { ...fallback } as Record<string, string>
    for (const k of keys) {
      const v = o[k as string]
      if (typeof v === 'string' && v.trim().length > 0) out[k as string] = v.trim()
    }
    return out as T
  })
  // бүх талбар хоосон мөрүүдийг шүүнэ
  return items.filter((it) => keys.some((k) => (it[k] as string).length > 0))
}

/** DB-ээс ирсэн (хэсэгчилсэн байж болох) утгыг анхдагчтай нэгтгэнэ */
export function mergeContent(raw: unknown): SiteContent {
  const v = typeof raw === 'string' ? safeParse(raw) : raw
  if (!v || typeof v !== 'object') return DEFAULT_CONTENT
  const o = v as Record<string, unknown>

  const partners = Array.isArray(o.partners)
    ? o.partners
        .filter((p): p is string => typeof p === 'string' && p.trim().length > 0)
        .map((p) => p.trim())
        .slice(0, 24)
    : DEFAULT_CONTENT.partners

  const footerRaw = o.footer && typeof o.footer === 'object' ? (o.footer as Record<string, unknown>) : null
  const socialsRaw =
    footerRaw?.socials && typeof footerRaw.socials === 'object'
      ? (footerRaw.socials as Record<string, unknown>)
      : null
  const socials = { ...DEFAULT_CONTENT.footer.socials }
  if (socialsRaw) {
    for (const k of ['facebook', 'instagram', 'linkedin', 'youtube'] as const) {
      const val = socialsRaw[k]
      if (typeof val === 'string') socials[k] = val.trim()
    }
  }

  return {
    hero: {
      ...mergeStrings(DEFAULT_CONTENT.hero, o.hero, [
        'eyebrow',
        'title',
        'titleAccent',
        'titleEnd',
        'subtitle',
        'ctaPrimary',
        'ctaSecondary',
      ]),
      chips:
        Array.isArray((o.hero as Record<string, unknown> | null)?.chips)
          ? ((o.hero as { chips: unknown[] }).chips
              .filter((c): c is string => typeof c === 'string' && c.trim().length > 0)
              .map((c) => c.trim())
              .slice(0, 6) as string[])
          : DEFAULT_CONTENT.hero.chips,
    },
    contact: mergeStrings(DEFAULT_CONTENT.contact, o.contact, ['email', 'phone', 'address']),
    footer: {
      ...mergeStrings(DEFAULT_CONTENT.footer, o.footer, ['tagline']),
      socials,
    },
    services: mergeList(DEFAULT_CONTENT.services, o.services, ['title', 'description']),
    benefits: mergeList(DEFAULT_CONTENT.benefits, o.benefits, ['title', 'description']),
    steps: mergeList(DEFAULT_CONTENT.steps, o.steps, ['title', 'description']),
    faq: mergeList(DEFAULT_CONTENT.faq, o.faq, ['q', 'a']),
    partners: partners.length > 0 ? partners : DEFAULT_CONTENT.partners,
  }
}

function safeParse(raw: string): unknown {
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

/** DB-ээс контентыг нэг удаа татна (алдаа гарвал анхдагч утга) */
export async function fetchSiteContent(): Promise<SiteContent> {
  try {
    const res = await fetch('/api/site-content?key=content', { cache: 'no-store' })
    if (!res.ok) return DEFAULT_CONTENT
    const row = (await res.json()) as { value?: unknown } | null
    return row?.value ? mergeContent(row.value) : DEFAULT_CONTENT
  } catch {
    return DEFAULT_CONTENT
  }
}

/** Клиент hook — компонентууд контентыг уншина */
export function useSiteContent() {
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT)
  const [loading, setLoading] = useState(true)

  const reload = useCallback(() => {
    setLoading(true)
    fetchSiteContent().then((c) => {
      setContent(c)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    let alive = true
    fetchSiteContent().then((c) => {
      if (alive) {
        setContent(c)
        setLoading(false)
      }
    })
    return () => {
      alive = false
    }
  }, [])

  return { content, loading, reload }
}

/** Үнийн саналын анхдагч — админ панел бусад хэсгүүдэд тусална */
export { DEFAULT_PRICING }
