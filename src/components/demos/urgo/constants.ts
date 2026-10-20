/**
 * ӨРГӨӨ Ресторан — брэндийн тогтмолууд, зургийн сан, сонголтын логик.
 * Палитр: хүлэрмэл цавуун (#F7F3EA), гүн ногоон (#1F3D2B), тоосго-улбар (#B4552D).
 */

export const CREAM = '#F7F3EA'
export const GREEN = '#1F3D2B'
export const GREEN_DEEP = '#152B1F'
export const GREEN_INK = '#22301F'
export const TERRA = '#B4552D'
export const TERRA_DARK = '#9A4523'
export const CARD_BG = '#FFFDF8'
export const SAGE_BORDER = '#E4DECB'
export const KICKER_GREEN = '#3E6147'

export const DELIVERY_FEE = 5000
export const FREE_DELIVERY_MIN = 50000

/** Захиалгын төлөвийн дараалал */
export const ORDER_STEPS = ['хүлээн авсан', 'бэлтгэж байна', 'хүргэлтэд гарсан', 'хүргэгдсэн'] as const
export const ALL_STATUSES = [...ORDER_STEPS, 'цуцлагдсан'] as const

/** Хүргэлтийн цагийн цонхны сонголтууд — одоогийн цагаас 30 минут тутамд тооцоолно */
export const ASAP_WINDOW = 'Аль болох хурдан'
export function deliveryWindowOptions(): string[] {
  const opts = [ASAP_WINDOW]
  const now = new Date()
  // Дараагийн бүтэн 30 минутын заагтай эхэлнэ
  const start = new Date(now)
  start.setMinutes(now.getMinutes() < 30 ? 30 : 60, 0, 0)
  for (let i = 0; i < 4; i++) {
    const a = new Date(start.getTime() + i * 30 * 60_000)
    const b = new Date(a.getTime() + 30 * 60_000)
    const f = (d: Date) => `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
    opts.push(`${f(a)} – ${f(b)}`)
  }
  return opts
}

export const CATEGORIES = ['нэйлэг', 'зүсэмж', 'хөнгөн', 'амттан', 'уух зүйл'] as const

/** localStorage түлхүүрүүд */
export const LAST_ORDER_KEY = 'urgo-last-order'

/** IMAGE_INDEX.json food1..food8 — рестораны хоолны зургийн сан */
export const FOOD = {
  hero: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/a5283209b4e6.jpg',
  buuz3: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/2d20bf9fcbe6.jpg',
  buuz10: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/0d2be759bd86.jpg',
  bans: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/c5b5e0a4d47f.jpg',
  khuushuur: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/a14ad006d17b.jpg',
  tsuivan: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/3596096cb700.jpg',
  khorhog: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/5e0bff4d8683.jpg',
  khurga: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/3ce4a97211d6.jpg',
  shol: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/5fec2ebb9af0.jpg',
  daipan: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/5c89c4927295.jpg',
  tuurgatai: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/5d347aebe964.jpg',
  salad: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/a72244183245.jpg',
  nogoo: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/38755f6f66d4.jpg',
  kimchi: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/c7f40d1fee89.jpg',
  boortsog: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/e008660099fa.jpg',
  cheesecake: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/d4356827f3f3.jpg',
  suutei: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/722e9f226731.jpg',
  juice: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/45c245036c3b.jpg',
  chatsargana: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/22e6e4263905.jpg',
  about1: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/f7e35865f97d.jpg',
  about2: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/5e294d441b29.png',
} as const

/** Админ цэсний маягтад зураг сонгох сонголтууд */
export const IMAGE_OPTIONS: { label: string; url: string }[] = [
  { label: 'Бууз (food1)', url: FOOD.hero },
  { label: 'Бууз — ойрхан (food1)', url: FOOD.buuz3 },
  { label: 'Бууз — таваг (food1)', url: FOOD.buuz10 },
  { label: 'Банс (food1)', url: FOOD.bans },
  { label: 'Хуушуур (food6)', url: FOOD.khuushuur },
  { label: 'Гоймон / Цуйван (food3)', url: FOOD.tsuivan },
  { label: 'Хорхог — шиш (food2)', url: FOOD.khorhog },
  { label: 'Хуурга (food5)', url: FOOD.khurga },
  { label: 'Шол / будаатай (food5)', url: FOOD.shol },
  { label: 'Дайпан (food2)', url: FOOD.daipan },
  { label: 'Туургатай мах (food2)', url: FOOD.tuurgatai },
  { label: 'Салад (food4)', url: FOOD.salad },
  { label: 'Ногоо (food4)', url: FOOD.nogoo },
  { label: 'Кимчи (food4)', url: FOOD.kimchi },
  { label: 'Боорцог / амттан (food8)', url: FOOD.boortsog },
  { label: 'Бяслагт бялуу (food8)', url: FOOD.cheesecake },
  { label: 'Сүүтэй цай (food7)', url: FOOD.suutei },
  { label: 'Шүүс (food7)', url: FOOD.juice },
  { label: 'Хүнцэлтэй цай (food7)', url: FOOD.chatsargana },
]

/** Хэмжээний сонголт — нэйлэгийн ангилалд (үндсэн үнээс хувь хослол) */
export const SIZE_STEPS = [
  { name: 'Жижиг', pct: 0 },
  { name: 'Дунд', pct: 0.1 },
  { name: 'Том', pct: 0.2 },
] as const

/** Ангилал бүрийн нэмэлт сонголтууд (ерөнхий логик) */
export const EXTRAS_BY_CATEGORY: Record<string, { name: string; price: number }[]> = {
  'нэйлэг': [
    { name: 'Нэмэлт ногоо', price: 1000 },
    { name: 'Халуун соус', price: 500 },
    { name: 'Гоймон', price: 2000 },
  ],
  'зүсэмж': [
    { name: 'Халуун соус', price: 500 },
    { name: 'Нэмэлт ногоо', price: 1000 },
  ],
  'хөнгөн': [{ name: 'Сүүн соус', price: 500 }],
  'амттан': [{ name: 'Цөцгийн соус', price: 700 }],
  'уух зүйл': [],
}

/** Нэгж үнэ = үндсэн үнэ × хэмжээ + нэмэлтүүд */
export function unitPrice(base: number, sizeIdx: number, extras: { price: number }[]): number {
  const pct = SIZE_STEPS[sizeIdx]?.pct ?? 0
  const extraSum = extras.reduce((s, e) => s + e.price, 0)
  return Math.round((base * (1 + pct)) / 10) * 10 + extraSum
}

/** Дэлгэцийн код: id-ийн сүүлийн 5 тэмдэгтээс — жишээ: УР-8F2K1 */
export function orderCode(id: string): string {
  return `УР-${id.slice(-5).toUpperCase()}`
}

/** API-ас ирэх цэсний бичилтийн хэлбэр */
export type MenuItemData = {
  id: string
  name: string
  description: string
  category: string
  price: number
  imageUrl?: string | null
  spicy: boolean
  available: boolean
  popular: boolean
  createdAt?: string
}

/** Захиалгын items JSON нэгж */
export type OrderItemJson = {
  id?: string
  name: string
  price: number
  qty: number
  options?: string[]
}

/** API-ас ирэх захиалгын бичилт */
export type OrderData = {
  id: string
  customerName: string
  phone: string
  address: string
  notes?: string | null
  items: OrderItemJson[] | unknown
  subtotal: number
  deliveryFee: number
  total: number
  status: string
  paymentStatus: string
  meta?: { deliveryWindow?: string } | null
  createdAt: string
}

/** meta-оос хүргэлтийн цагийн цонхыг аюулгүй уншина */
export function readWindow(meta: OrderData['meta']): string | null {
  const w = meta && typeof meta === 'object' ? (meta as { deliveryWindow?: unknown }).deliveryWindow : null
  return typeof w === 'string' && w.trim() ? w : null
}

/** items талбарыг аюулгүй задлана */
export function parseItems(items: OrderData['items']): OrderItemJson[] {
  return Array.isArray(items) ? (items as OrderItemJson[]) : []
}
