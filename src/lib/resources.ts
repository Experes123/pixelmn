import { db } from './db'

/**
 * Нөөц (resource) бүртгэл — олон нийтийн API-гээр дамжуулан CRUD үйлдэл хийнэ.
 * Зөвхөн энд бүртгэгдсэн нөөц болон талбарууд API-ээр хүлээж авна (аюулгүй байдал).
 */
export type ResourceSpec = {
  model: string // db үзэгдэх обьектын нэр (жишээ: barberService)
  fields: string[] // зөвшөөрөгдсөн талбарууд
  ints?: string[] // бүхэл тоо болгон хөрвүүлэх
  floats?: string[]
  bools?: string[]
  jsons?: string[]
  nullable?: string[] // null дамжуулах боломжтой
  orderBy?: Record<string, 'asc' | 'desc'>
  /** 'content' = удирдлагын контент (зөвхөн админ бичнэ), 'submission' = нийтийн маягт/захиалга (нийтэд нээлттэй create) */
  kind?: 'content' | 'submission'
  /** submission нөөц дээр нийтийн (нэвтрээгүй) PATCH хийж болох талбарууд */
  publicPatch?: string[]
  /** publicPatch талбарт зөвшөөрөгдөх утгууд */
  publicPatchValues?: Record<string, string[]>
  /** Үзэлтийн тоолуур мэт зөвхөн тоон meta шинэчлэлийг нийтэд зөвшөөрөх */
  publicMetaCounter?: boolean
}

export const RESOURCES: Record<string, ResourceSpec> = {
  // Үндсэн сайт
  inquiries: {
    model: 'inquiry',
    fields: ['name', 'email', 'company', 'serviceType', 'budget', 'details', 'status'],
    nullable: ['company'],
    orderBy: { createdAt: 'desc' },
    kind: 'submission',
  },
  'site-content': {
    model: 'siteContent',
    fields: ['key', 'label', 'value'],
    jsons: ['value'],
    orderBy: { key: 'asc' },
  },
  // Демо 1 — ГАН Barbershop
  'barber-services': {
    model: 'barberService',
    fields: ['name', 'category', 'price', 'durationMin', 'description', 'active'],
    ints: ['price', 'durationMin'],
    bools: ['active'],
    orderBy: { price: 'asc' },
  },
  barbers: {
    model: 'barber',
    fields: ['name', 'title', 'bio', 'specialties', 'imageUrl', 'active'],
    bools: ['active'],
    nullable: ['imageUrl'],
    orderBy: { createdAt: 'asc' },
  },
  'barber-bookings': {
    model: 'barberBooking',
    fields: ['serviceId', 'serviceName', 'barberId', 'barberName', 'date', 'time', 'customerName', 'phone', 'email', 'notes', 'status', 'paymentStatus', 'totalAmount', 'meta'],
    ints: ['totalAmount'],
    jsons: ['meta'],
    nullable: ['serviceId', 'barberId', 'email', 'notes', 'meta'],
    orderBy: { createdAt: 'desc' },
    kind: 'submission',
    publicPatch: ['paymentStatus', 'status'],
    publicPatchValues: {
      paymentStatus: ['төлөгдсөн', 'төлөгдөөгүй'],
      status: ['цуцлагдсан'],
    },
  },
  // Демо 2 — ШОНХОР Gaming Café
  'pc-stations': {
    model: 'pcStation',
    fields: ['name', 'zone', 'cpu', 'gpu', 'ram', 'extras', 'pricePerHour', 'status', 'active'],
    ints: ['pricePerHour'],
    bools: ['active'],
    nullable: ['extras'],
    orderBy: { name: 'asc' },
  },
  'pc-bookings': {
    model: 'pcBooking',
    fields: ['stationId', 'stationName', 'zone', 'date', 'startTime', 'hours', 'customerName', 'phone', 'status', 'paymentStatus', 'totalAmount'],
    ints: ['hours', 'totalAmount'],
    nullable: ['stationId'],
    orderBy: { createdAt: 'desc' },
    kind: 'submission',
    publicPatch: ['paymentStatus', 'status'],
    publicPatchValues: {
      paymentStatus: ['төлөгдсөн', 'төлөгдөөгүй'],
      status: ['цуцлагдсан'],
    },
  },
  // Демо 3 — ӨРГӨӨ Ресторан
  'menu-items': {
    model: 'menuItem',
    fields: ['name', 'description', 'category', 'price', 'imageUrl', 'spicy', 'available', 'popular'],
    ints: ['price'],
    bools: ['spicy', 'available', 'popular'],
    nullable: ['imageUrl'],
    orderBy: { price: 'asc' },
  },
  'restaurant-orders': {
    model: 'restaurantOrder',
    fields: ['customerName', 'phone', 'address', 'notes', 'items', 'subtotal', 'deliveryFee', 'total', 'status', 'paymentStatus', 'meta'],
    ints: ['subtotal', 'deliveryFee', 'total'],
    jsons: ['items', 'meta'],
    nullable: ['notes', 'meta'],
    orderBy: { createdAt: 'desc' },
    kind: 'submission',
    publicPatch: ['status'],
    publicPatchValues: { status: ['цуцлагдсан'] },
  },
  // Демо 4 — ТЭМҮҮР Групп
  'company-services': {
    model: 'companyService',
    fields: ['title', 'description', 'icon', 'order', 'active'],
    ints: ['order'],
    bools: ['active'],
    orderBy: { order: 'asc' },
  },
  'company-projects': {
    model: 'companyProject',
    fields: ['title', 'description', 'category', 'year', 'imageUrl', 'order', 'active'],
    ints: ['order'],
    bools: ['active'],
    nullable: ['imageUrl'],
    orderBy: { order: 'asc' },
  },
  'company-inquiries': {
    model: 'companyInquiry',
    fields: ['name', 'email', 'subject', 'message', 'status'],
    orderBy: { createdAt: 'desc' },
    kind: 'submission',
  },
  'company-content': {
    model: 'companyContent',
    fields: ['key', 'label', 'value'],
    orderBy: { key: 'asc' },
  },
  // Демо 5 — ҮЗЭГ Стриминг
  'stream-titles': {
    model: 'streamTitle',
    fields: ['title', 'type', 'genre', 'year', 'rating', 'duration', 'description', 'posterGradient', 'backdropUrl', 'videoUrl', 'featured', 'isNew', 'active', 'meta'],
    ints: ['year'],
    floats: ['rating'],
    bools: ['featured', 'isNew', 'active'],
    jsons: ['meta'],
    nullable: ['backdropUrl', 'videoUrl', 'meta'],
    orderBy: { createdAt: 'desc' },
    publicMetaCounter: true,
  },
  'stream-subs': {
    model: 'streamSub',
    fields: ['plan', 'customerName', 'email', 'amount', 'status'],
    ints: ['amount'],
    orderBy: { createdAt: 'desc' },
    kind: 'submission',
  },
  // Демо 6 — НУТАГ Дэлгүүр
  products: {
    model: 'product',
    fields: ['name', 'description', 'category', 'price', 'oldPrice', 'stock', 'imageUrl', 'options', 'featured', 'active', 'meta'],
    ints: ['price', 'oldPrice', 'stock'],
    jsons: ['options', 'meta'],
    bools: ['featured', 'active'],
    nullable: ['oldPrice', 'imageUrl', 'meta'],
    orderBy: { createdAt: 'desc' },
  },
  'shop-orders': {
    model: 'shopOrder',
    fields: ['customerName', 'phone', 'email', 'city', 'address', 'notes', 'items', 'subtotal', 'deliveryFee', 'total', 'status', 'paymentStatus', 'meta'],
    ints: ['subtotal', 'deliveryFee', 'total'],
    jsons: ['items', 'meta'],
    nullable: ['email', 'notes', 'meta'],
    orderBy: { createdAt: 'desc' },
    kind: 'submission',
  },
}

/** body-г зөвхөн зөвшөөрөгдсөн талбаруудаар цэвэрлэж, зөв төрөлд хөрвүүлнэ */
export function sanitize(spec: ResourceSpec, body: unknown, partial: boolean): Record<string, unknown> {
  const input = (body ?? {}) as Record<string, unknown>
  const out: Record<string, unknown> = {}
  for (const f of spec.fields) {
    if (!(f in input)) continue
    let v: unknown = input[f]
    if (spec.ints?.includes(f)) {
      const n = Number(v)
      if (Number.isNaN(n)) continue
      v = Math.round(n)
    } else if (spec.floats?.includes(f)) {
      const n = Number(v)
      if (Number.isNaN(n)) continue
      v = n
    } else if (spec.bools?.includes(f)) {
      v = Boolean(v)
    } else if (spec.jsons?.includes(f)) {
      // Json талбар: утгыг шууд хадгална
      try {
        v = typeof v === 'string' ? JSON.parse(v) : v
      } catch {
        continue
      }
    } else if (typeof v === 'string') {
      v = v.trim()
    }
    if (v === '' && spec.nullable?.includes(f)) v = null
    out[f] = v
  }
  if (!partial && !spec.nullable) return out
  return out
}

export function getDelegate(model: string): PrismaClientDelegate {
  // Аюулгүй: model нь RESOURCES-аас зөвхөн бүртгэгдсэн нэрсээр ирдэг
  return (db as unknown as Record<string, PrismaClientDelegate>)[model]
}

/**
 * Prisma модель delegate-ийн ерөнхий төрөл — модель бүр өөр signature-тай тул
 * дуудалтын газруудад уян хатан байхын тулд дурын метод дуудлагыг зөвшөөрнө.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PrismaClientDelegate = any

/**
 * Нэвтрээгүй хэрэглэгчийн PATCH-ийг submission нөөцийн зөвшөөрөгдсөн
 * талбаруудаар цуцалж шалгана. Зөрчилтэй талбар орсон бол null буцаана.
 */
export function sanitizePublicPatch(spec: ResourceSpec, body: unknown): Record<string, unknown> | null {
  const allowed = spec.publicPatch ?? []
  if (allowed.length === 0) return null
  const input = (body ?? {}) as Record<string, unknown>
  const keys = Object.keys(input)
  if (keys.length === 0) return null
  const out: Record<string, unknown> = {}
  for (const f of keys) {
    if (!allowed.includes(f)) return null
    const v = input[f]
    const vals = spec.publicPatchValues?.[f]
    if (typeof v !== 'string') return null
    const t = v.trim()
    if (vals && !vals.includes(t)) return null
    out[f] = t
  }
  return Object.keys(out).length > 0 ? out : null
}

/**
 * Үзэлтийн тоолуур мэт зөвхөн тоон meta (views/watchSeconds) шинэчлэлийг
 * нэвтрээгүй хэрэглэгчээс хүлээн авна. Бусад түлхүүр орсон бол null.
 */
export function sanitizeMetaCounter(body: unknown): { views?: number; watchSeconds?: number } | null {
  const input = (body ?? {}) as Record<string, unknown>
  const keys = Object.keys(input)
  if (keys.length !== 1 || keys[0] !== 'meta') return null
  const meta = input.meta
  if (!meta || typeof meta !== 'object' || Array.isArray(meta)) return null
  const m = meta as Record<string, unknown>
  const out: { views?: number; watchSeconds?: number } = {}
  for (const k of Object.keys(m)) {
    if (k !== 'views' && k !== 'watchSeconds') return null
    const n = Number(m[k])
    if (!Number.isFinite(n) || n < 0) return null
    out[k as 'views' | 'watchSeconds'] = Math.round(n * 10) / 10
  }
  return Object.keys(out).length > 0 ? out : null
}
