/**
 * ТЭМҮҮР Групп — брэнд тогтоол, төрөл, default өгөгдөл.
 * Editorial corporate эстетик: графит + зэс (copper), Noto Serif гарчиг.
 */
import type { LucideIcon } from 'lucide-react'
import * as icons from 'lucide-react'

// ── Палитр ──
export const C = {
  graphite: '#191C20',
  graphiteDeep: '#131519',
  paper: '#F6F5F2',
  paperWarm: '#EFECE4',
  ink: '#1D2126',
  copper: '#8A5A2B',
  copperSoft: '#B98A55',
  border: '#E1DCD2',
  gray: '#6E6862',
}

// ── Фонт ──
export const SERIF = 'var(--font-noto-serif), Georgia, serif'
export const SANS = 'var(--font-inter), system-ui, sans-serif'

// ── Зургийн сан (IMAGE_INDEX.json → company1..4) ──
export const IMG = {
  hero: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/1e9fe81a5d4a.jpg', // company1[0]
  c2: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/43db3fb5111b.jpg', // company2[0]
  c3: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/f733ca05dcae.png', // company3[0]
  c4: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/c98ea727e59f.jpg', // company4[0]
}

/** Админы төслийн зураг сонголт */
export const PROJECT_IMAGES = [
  { key: 'company1', url: IMG.hero },
  { key: 'company2', url: IMG.c2 },
  { key: 'company3', url: IMG.c3 },
  { key: 'company4', url: IMG.c4 },
]

// ── Төрлүүд (API-ээс ирдэг бүтэц) ──
export type CompanyContent = { id: string; key: string; label?: string | null; value: string }
export type CompanyService = {
  id: string
  title: string
  description: string
  icon: string
  order: number
  active: boolean
}
export type CompanyProject = {
  id: string
  title: string
  description: string
  category: string
  year: string
  imageUrl?: string | null
  order: number
  active: boolean
}
export type CompanyInquiry = {
  id: string
  name: string
  email: string
  subject: string
  message: string
  status: string
  createdAt: string
}

// ── Content түлхүүрүүд ──
export const CONTENT_KEYS = [
  { key: 'heroTitle', label: 'Нүүр — гол гарчиг (heroTitle)' },
  { key: 'heroSub', label: 'Нүүр — дэд тайлбар (heroSub)' },
  { key: 'aboutText1', label: 'Бидний тухай — гол өгүүлбэр (aboutText1)' },
  { key: 'aboutText2', label: 'Бидний тухай — нэмэлт текст (aboutText2)' },
  { key: 'mission', label: 'Эрхэм зорилго (mission)' },
  { key: 'vision', label: 'Алсын хараа (vision)' },
] as const

export const DEFAULT_CONTENT: Record<string, string> = {
  heroTitle: 'Дэд бүтцийн ирээдүйг хамтдаа барьцаалах',
  heroSub:
    'ТЭМҮҮР Групп нь инженерийн нарийвчлал, барилгын туршлага, хамтын ажиллагааны соёлоор үндэсний дэд бүтцийг бэхжүүлэхийг зорьдог төсөөллийн групп юм.',
  aboutText1:
    'Бид ган шиг хатуу стандарт, хүн шиг халамжтай ханддаг. Төсөл бүрийг зөвхөн барих бус — олон үеийн үр ашигтай, орчинтойгоо эвлэрсэн инженерийн шийдэл болгон бүтээдэг.',
  aboutText2:
    'ТЭМҮҮР Групп нь дэд бүтцийн барилга, инженерийн зураг төсөл, зам тээвэр, эрчим хүч, ус цэвэршүүлэлтийн салбарт үйл ажиллагаа явуулдаг концепт групп юм. Аюулгүй байдлын соёл, цаг хугацааны сахилга бат, багийн нээлттэй хамтын ажиллагаа бол бидний хамгийн том нөөц. Төлөвлөлтөөс гүйцэтгэл хүртэлх бүх шатанд тооцоо, шийдвэр бүрээ хариуцаж, зөвхөн гэрээ бус — итгэлцлээр ажилладаг.',
  mission:
    'Үндэсний дэд бүтцийн чанар, аюулгүй байдлын стандартыг дээшлүүлж, хамтран ажиллагсад, нийгэмд урт хугацааны үр өгөөжтэй инженерийн шийдэл хүргэх.',
  vision:
    '2030 он гэхэд дэд бүтцийн салбарт олон улсын стандарт, экологийн хариуцлагыг нэвтрүүлсэн үндэсний тэргүүлэгч групп болох.',
}

// ── Default үйлчилгээ (API хоосон бол) ──
export const DEFAULT_SERVICES: CompanyService[] = [
  {
    id: 'd1',
    title: 'Дэд бүтцийн барилга',
    description:
      'Гүүр, зам, барилгын бүтцийг олон улсын стандартын дагуу барих, өргөтгөх, шинэчлэх цогц үйлчилгээ.',
    icon: 'Building2',
    order: 1,
    active: true,
  },
  {
    id: 'd2',
    title: 'Инженерийн зураг төсөл',
    description:
      'Төслийн концепцаос гүйцэтгэлийн зураг хүртэл — геодези, тооцоо, загварчлалыг нэг багт нэгтгэсэн.',
    icon: 'DraftingCompass',
    order: 2,
    active: true,
  },
  {
    id: 'd3',
    title: 'Зам тээврийн шийдэл',
    description:
      'Авто замын давхарга, гудамжны сүлжээ, ачаа тээврийн зангилааг төлөвлөж, хэрэгжүүлнэ.',
    icon: 'Route',
    order: 3,
    active: true,
  },
  {
    id: 'd4',
    title: 'Эрчим хүчний систем',
    description:
      'Дамжуулах шугам, дэд станц, сэргээгдэх эрчим хүчний холболтын инженерийн шийдэл.',
    icon: 'Zap',
    order: 4,
    active: true,
  },
  {
    id: 'd5',
    title: 'Ус цэвэршүүлэлт',
    description:
      'Усны цэвэршүүлэх байгууламж, дахин ашиглах систем, дуслын усалгааны технологи.',
    icon: 'Droplets',
    order: 5,
    active: true,
  },
  {
    id: 'd6',
    title: 'Зөвлөх үйлчилгээ',
    description: 'Төслийн боломжийн судалгаа, өртгийн тооцоо, техникийн хяналт, менежмент.',
    icon: 'ClipboardCheck',
    order: 6,
    active: true,
  },
]

// ── Default төслүүд (API хоосон бол) ──
export const DEFAULT_PROJECTS: CompanyProject[] = [
  {
    id: 'p1',
    title: 'Хотын гүүр шинэчлэл',
    description:
      'Хүнд ачааны эрчимт хөдөлгөөнд зориулж нийт 620 метр гүүрийн тулгуур бүтцийг бэхжүүлж, зам хөдөлгөөнийг зогсолтгүй шатлалаар зохион байгуулсан жишээ төсөл.',
    category: 'Замын байгууламж',
    year: '2022',
    imageUrl: IMG.hero,
    order: 1,
    active: true,
  },
  {
    id: 'p2',
    title: 'Нарийн замын өргөтгөл',
    description:
      '18 км замын хэсгийг дөрвөн эгнээт болгон өргөтгөж, гэрэлтүүлэг, ус зайлуулах шугамыг цогцоор нь шинэчилсэн жишээ төсөл.',
    category: 'Замын байгууламж',
    year: '2023',
    imageUrl: IMG.c2,
    order: 2,
    active: true,
  },
  {
    id: 'p3',
    title: 'Хийсвэр усан сан',
    description:
      'Хотын зүүн хэсгийн хэрэглэгчдэд өдөрт 12,000 м³ цэвэр ус хүргэх хийсвэр усан сангийн шийдлийн төсөл.',
    category: 'Хот төлөвлөлт',
    year: '2024',
    imageUrl: IMG.c3,
    order: 3,
    active: true,
  },
  {
    id: 'p4',
    title: 'Оффис цогцолбор',
    description:
      'Дөрвөн блок бүхий албаны цогцолборын инженерийн систем, эрчим хүчний үр ашгийн шийдлийн жишээ төсөл.',
    category: 'Хот төлөвлөлт',
    year: '2024',
    imageUrl: IMG.c4,
    order: 4,
    active: true,
  },
  {
    id: 'p5',
    title: 'Солир эрчимжүүлэлт',
    description:
      'Говийн бүсийн 40 МВт хүчин чадлын солир станцын суурь бүтэц, эрчим хүчний холболтын жишээ төсөл.',
    category: 'Эрчим хүч',
    year: '2023',
    imageUrl: IMG.hero,
    order: 5,
    active: true,
  },
  {
    id: 'p6',
    title: 'Хотын гэрэлтүүлэг',
    description:
      'Үндсэн гудамжуудад энергийн үр ашигтай LED гэрэлтүүлгийн систем нэвтрүүлсэн жишээ төсөл.',
    category: 'Эрчим хүч',
    year: '2025',
    imageUrl: IMG.c2,
    order: 6,
    active: true,
  },
]

// ── Хамт олон — жишээ профайл (hardcoded концепт брэнд) ──
export const TEAM = [
  {
    name: 'Төмөрбаатар Дашням',
    role: 'Гүйцэтгэх захирал',
    bio: 'Дэд бүтцийн салбарт 20 гаруй жил ажилласан, группийг үүсгэн байгуулагч.',
  },
  {
    name: 'Оюунчимэг Баттулга',
    role: 'Санхүү, хөрөнгө оруулалтын директор',
    bio: 'Том хэмжээний төслийн санхүүгийн загварчлал, эрсдэлийн менежмент хариуцна.',
  },
  {
    name: 'Эрдэнэчимэг Сүхбаатар',
    role: 'Техникийн директор',
    bio: 'Инженерийн зураг төслийн чанарын хяналт, стандартчилал эрхэлнэ.',
  },
  {
    name: 'Ганбаяр Лхагважав',
    role: 'Төслийн гүйцэтгэлийн директор',
    bio: 'Барилгын талбайн аюулгүй байдал, цаг хугацааны сахилгыг удирдана.',
  },
]

/** Админ дээр сонгох lucide icon нэрс */
export const ICON_CHOICES = [
  'Building2',
  'DraftingCompass',
  'Route',
  'Zap',
  'Droplets',
  'ClipboardCheck',
  'Factory',
  'HardHat',
  'Wrench',
  'Ruler',
  'Cog',
  'Lightbulb',
]

/** Текстэн icon нэрээр lucide компонент олох (fallback: Building2) */
export function pickIcon(name?: string | null): LucideIcon {
  const key = (name ?? '').trim()
  const map = icons as unknown as Record<string, LucideIcon | undefined>
  if (key && typeof map[key] === 'function') return map[key] as LucideIcon
  return icons.Building2
}

/** Нэрний эхний үсгээс монограм үүсгэх: "Төмөрбаатар Дашням" → "ТД" */
export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'ТГ'
  const first = parts[0]?.[0] ?? ''
  const second = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : ''
  return (first + second).toUpperCase()
}

/** Хэсэг рүү жигд гүйлгэх (hash өөрчлөхгүйгээр) */
export function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  else window.scrollTo({ top: 0, behavior: 'smooth' })
}
