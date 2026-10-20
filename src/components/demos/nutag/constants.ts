/**
 * НУТАГ Store — палитр, тогтмолууд, төрлүүд.
 * Шаварлаг (sand) дэвсгэр + зэврэгт ногоон (olive) үндсэн + хүрэн (rust) туслах өнгө.
 */

// ── Палитр ────────────────────────────────────────────────────────────────────
export const SAND = '#F2EFE6'
export const SAND_DEEP = '#EAE4D3' // гүнзгий шаварлаг хэсэг
export const CARD_BG = '#FFFFFF'
export const OLIVE = '#5A6B3F' // үндсэн
export const OLIVE_DEEP = '#485531' // hover / даралт
export const OLIVE_TINT = '#EDEFDF' // зөөлөн ногоон дэвсгэр
export const RUST = '#A0522D' // туслах (kicker, хямдрал)
export const RUST_TINT = '#F4E7DC'
export const INK = '#26231D' // бүдэг нүдний текст
export const INK_SOFT = '#6F6858'
export const LINE = '#E1DAC7' // хил хязгаар
export const LINE_DASH = '#CFC7AE' // тасархай оёдлын шугам

// ── Хүргэлт ──────────────────────────────────────────────────────────────────
export const DELIVERY_FEE = 6000
export const FREE_DELIVERY_MIN = 80000

// ── LocalStorage түлхүүрүүд ──────────────────────────────────────────────────
export const CART_KEY = 'nutag-cart'
export const LAST_ORDER_KEY = 'nutag-last-order'

// ── Ангиллууд ────────────────────────────────────────────────────────────────
export const CATEGORIES = [
  'арьсан эдлэл',
  'эсгий бүтээгдэхүүн',
  'цай',
  'гэр ахуй',
  'аялал',
] as const

export const CATEGORY_LABEL: Record<string, string> = {
  'арьсан эдлэл': 'Арьсан эдлэл',
  'эсгий бүтээгдэхүүн': 'Эсгий бүтээгдэхүүн',
  цай: 'Цай',
  'гэр ахуй': 'Гэр ахуй',
  аялал: 'Аялал',
}

export const CATEGORY_NOTE: Record<string, string> = {
  'арьсан эдлэл': 'Гараар оёсон цүнх, түрийвч, бүс',
  'эсгий бүтээгдэхүүн': 'Ноос, эсгийн зөөлөн хувцас, эдлэл',
  цай: 'Уулаархан, хүнцэл зэрэг нутгийн цай',
  'гэр ахуй': 'Ваар, зэс зэрэг гэрийн эдлэл',
  аялал: 'Аялал, гадаа зугаалгын хэрэгсэл',
}

// ── Захиалгын төлөвийн дараалал ─────────────────────────────────────────────
export const ORDER_STATUS_FLOW = ['бүртгэгдсэн', 'баглааж байна', 'хүргэлтэд', 'хүргэгдсэн']
export const ORDER_STATUSES = [...ORDER_STATUS_FLOW, 'цуцлагдсан']

/** Дараагийн төлөв (тухайн төлөвөөс) — эцсийн төлөвт бол null */
export function nextStatus(status: string): string | null {
  const i = ORDER_STATUS_FLOW.indexOf(status)
  if (i === -1 || i >= ORDER_STATUS_FLOW.length - 1) return null
  return ORDER_STATUS_FLOW[i + 1]
}

// ── Шүүлтүүрийн сонголтууд ───────────────────────────────────────────────────
export const PRICE_RANGES: { label: string; test: (price: number) => boolean }[] = [
  { label: 'Бүгд', test: () => true },
  { label: '20,000₮ хүртэл', test: (p) => p <= 20000 },
  { label: '20,000–50,000₮', test: (p) => p > 20000 && p < 50000 },
  { label: '50,000₮-аас дээш', test: (p) => p >= 50000 },
]

export const SORTS = [
  { key: 'new', label: 'Шинэ' },
  { key: 'popular', label: 'Алдартай' },
  { key: 'price-asc', label: 'Үнэ өсөхөөр' },
  { key: 'price-desc', label: 'Үнэ буурахаар' },
] as const

export const CITIES = ['Улаанбаатар', 'Дархан', 'Эрдэнэт', 'Бусад'] as const

// ── Төрлүүд ──────────────────────────────────────────────────────────────────
export type ProductOption = { name: string; values: string[] }

export type Product = {
  id: string
  name: string
  description: string
  category: string
  price: number
  oldPrice?: number | null
  stock: number
  imageUrl?: string | null
  options?: ProductOption[] | null
  featured: boolean
  active: boolean
  meta?: { stockLog?: StockLogEntry[] } | null
  createdAt?: string
  updatedAt?: string
}

/** Үлдэгдлийн өөрчлөлтийн түүхийн нэгж */
export type StockLogEntry = {
  at: string // ISO цаг
  from: number
  to: number
  by: string // хэн өөрчилсөн (демод: 'Админ')
}

/** meta-оос үлдэгдлийн түүхийг аюулгүй уншина (шинэ → хуучин дараалалтай) */
export function readStockLog(meta: Product['meta']): StockLogEntry[] {
  const log = meta && typeof meta === 'object' ? (meta as { stockLog?: unknown }).stockLog : null
  if (!Array.isArray(log)) return []
  return log.filter(
    (e): e is StockLogEntry =>
      !!e && typeof e === 'object' && typeof (e as StockLogEntry).at === 'string' && typeof (e as StockLogEntry).to === 'number'
  )
}

export type OrderItem = {
  id: string
  name: string
  price: number
  qty: number
  option?: string | null
}

export type ShopOrder = {
  id: string
  customerName: string
  phone: string
  email?: string | null
  city: string
  address: string
  notes?: string | null
  items: OrderItem[]
  subtotal: number
  deliveryFee: number
  total: number
  status: string
  paymentStatus: string
  createdAt?: string
  updatedAt?: string
}

export type CartItem = {
  id: string
  name: string
  price: number
  qty: number
  option?: string
}

/** Сагсны мөрийн түлхүүр: id + сонголт */
export const lineKey = (id: string, option?: string | null) => `${id}::${option ?? ''}`

/** Захиалгын код — id-ийн сүүлийн 6 тэмдэгт */
export const orderCode = (id: string) => `НУТ-${id.slice(-6).toUpperCase()}`

// ── Зургийн сан (IMAGE_INDEX.json — prod1..prod8) ───────────────────────────
export const IMG: Record<string, string[]> = {
  prod1: [
    'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/157c0f2e4a90.png',
    'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/4bfd671bae14.png',
    'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/77e5b3c12bd8.jpg',
    'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/9026ffd3da50.jpg',
    'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/7e933bf43e80.jpg',
  ],
  prod2: [
    'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/9c283b583a14.jpg',
    'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/e410057865d7.jpg',
    'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/a1ef4ece5af0.jpg',
    'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/05e688c3ad1a.jpg',
    'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/4b59f766609d.jpg',
  ],
  prod3: [
    'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/7b270037ed40.jpg',
    'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/23924cbc3590.jpg',
    'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/d10291c2fc43.jpeg',
    'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/033ad5d16b0e.jpg',
    'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/b13db0500c79.jpg',
  ],
  prod4: [
    'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/95dc970170dc.jpg',
    'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/d4894aad99a3.jpg',
    'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/7594132cfe95.jpg',
    'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/ad41441d4a54.jpg',
    'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/8136b8d42641.jpg',
  ],
  prod5: [
    'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/ed7e9fa19585.jpg',
    'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/ce7d19be2996.jpg',
    'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/268ab3f62ed1.jpg',
    'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/b16dad8d04d8.jpg',
    'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/9de59160d290.jpg',
  ],
  prod6: [
    'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/9d24757b6142.jpg',
    'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/688230ff84b5.jpg',
    'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/d91066746597.jpg',
    'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/796029720080.webp',
    'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/c3fe8c952054.jpg',
  ],
  prod7: [
    'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/121593ce76a0.png',
    'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/fd20cf2070cb.jpg',
    'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/488ce438d5a1.jpg',
    'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/c564aa01ef00.jpeg',
    'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/ef065d04b45f.jpg',
  ],
  prod8: [
    'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/f609bcd5fced.jpg',
    'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/0bdc94ac6409.jpg',
    'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/702f289d36d3.jpg',
    'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/7ea37c581308.png',
    'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/d64b3584ba8b.png',
  ],
}

/** Админы зураг сонгогчид харуулах тайлбар */
export const IMG_LABELS: Record<string, string> = {
  prod1: 'Арьсан цүнх',
  prod2: 'Эсгий пантүфл',
  prod3: 'Ваар аяга',
  prod4: 'Цай',
  prod5: 'Ноосон хантааз',
  prod6: 'Арьсан түрийвч',
  prod7: 'Зэс аяга',
  prod8: 'Аяллын дэр',
}

/** Хэрэглэгчийн сонгосон хувилбаруудыг тэмдэгт болгон нэгтгэнэ */
export const optionText = (picked: string[]) => picked.filter(Boolean).join(' · ')
