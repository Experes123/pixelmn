/**
 * НУТАГ Store — демо өгөгдөл.
 * Ажиллуул: bun prisma/seed-nutag.ts
 * 14 бүтээгдэхүүн (арьсан эдлэл 4, эсгий 3, цай 3, гэр ахуй 2, аялал 2) + 3 жишээ захиалга.
 */
import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

// IMAGE_INDEX.json (prod1..prod8) — зургийн URL сан
const P = {
  bag1: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/157c0f2e4a90.png',
  bag2: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/4bfd671bae14.png',
  felt1: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/9c283b583a14.jpg',
  felt2: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/e410057865d7.jpg',
  ceramic1: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/7b270037ed40.jpg',
  tea1: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/95dc970170dc.jpg',
  tea2: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/d4894aad99a3.jpg',
  tea3: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/7594132cfe95.jpg',
  wool1: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/ed7e9fa19585.jpg',
  wallet1: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/9d24757b6142.jpg',
  wallet2: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/688230ff84b5.jpg',
  copper1: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/121593ce76a0.png',
  travel1: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/f609bcd5fced.jpg',
  travel2: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/0bdc94ac6409.jpg',
}

type ProductSeed = {
  name: string
  description: string
  category: string
  price: number
  oldPrice?: number
  stock: number
  imageUrl: string
  options?: { name: string; values: string[] }[]
  featured?: boolean
}

const PRODUCTS: ProductSeed[] = [
  // ── Арьсан эдлэл (4) ───────────────────────────────────────────────────────
  {
    name: 'Гар урлалын арьсан цүнх',
    description:
      'Гараар оёсон, бэхэлгээг нь гардан хийсэн арьсан цүнх. Дотор зөөлөн даавуун доторлойтой — ажил, сургуульд өдөр тутам хэрэглэхэд тохиромжтой.',
    category: 'арьсан эдлэл',
    price: 89000,
    stock: 8,
    imageUrl: P.bag1,
    options: [{ name: 'Өнгө', values: ['Күрэн', 'Хар'] }],
    featured: true,
  },
  {
    name: 'Арьсан түрийвч',
    description:
      'Нарийвчилсан оёдолтой, 8 картын хүрээ, мөнгөний тусдаа ханатай арьсан түрийвч. Бэлэглэхэд тохирох нэхмэл хайрцагтай.',
    category: 'арьсан эдлэл',
    price: 39000,
    oldPrice: 45000,
    stock: 12,
    imageUrl: P.wallet1,
    featured: true,
  },
  {
    name: 'Арьсан бүс',
    description:
      'Нэг ширхэг бүхэл арьсаар гар аргаар зассан бүс. Багцын дуулгатай, цаг хугацаа өнгөрөхөд илүү гоёмсог харагддаг.',
    category: 'арьсан эдлэл',
    price: 25000,
    stock: 15,
    imageUrl: P.wallet2,
    options: [{ name: 'Хэмжээ', values: ['85 см', '95 см', '105 см'] }],
  },
  {
    name: 'Арьсан тавагны хайрцаг',
    description:
      'Уулчилсан таваг хадгалах, бэлэглэх зориулалттай арьсан хайрцаг. Дотор хялгасан доторлойтой, хэмжээ нь стандарт тавагт таарна.',
    category: 'арьсан эдлэл',
    price: 55000,
    stock: 0,
    imageUrl: P.bag2,
  },

  // ── Эсгий бүтээгдэхүүн (3) ─────────────────────────────────────────────────
  {
    name: 'Эсгий пантүфл',
    description:
      'Зөөлөн ноосон эсгийгээр гардан оёдог пантүфл. Гэр дотор хөл халах, өдөр тутмын тав туханд зориулсан.',
    category: 'эсгий бүтээгдэхүүн',
    price: 34000,
    stock: 10,
    imageUrl: P.felt1,
    options: [
      { name: 'Хэмжээ', values: ['36-37', '38-39', '40-41'] },
      { name: 'Өнгө', values: ['Сонгино', 'Хар'] },
    ],
    featured: true,
  },
  {
    name: 'Эсгий малгай',
    description:
      'Уламжлалт аргаар эсгийлсэн, өвлийн хүйтэнд сайн хөлөрдөг малгай. Чих хамгаалах хошногоотой хувилбартай.',
    category: 'эсгий бүтээгдэхүүн',
    price: 28000,
    stock: 3,
    imageUrl: P.felt2,
  },
  {
    name: 'Ноосон хантааз',
    description:
      'Цэвэр хоргүй ноосноос эсгийлж хийсэн хантааз. Хөнгөн, дулаан, арьс тайвшруулагч — өвлийн дотуур хувцас.',
    category: 'эсгий бүтээгдэхүүн',
    price: 65000,
    stock: 6,
    imageUrl: P.wool1,
    options: [{ name: 'Хэмжээ', values: ['M', 'L', 'XL'] }],
    featured: true,
  },

  // ── Цай (3) ────────────────────────────────────────────────────────────────
  {
    name: 'Уулаархан цай хайрцаг',
    description:
      'Уулын хад, нурангийн хооронд ургасан уулаархан цэцгийг сүүдэрт хатааж бэлтгэсэн цай. 25 х порцонд хүрэлцэхүйц.',
    category: 'цай',
    price: 19000,
    stock: 20,
    imageUrl: P.tea1,
  },
  {
    name: 'Хүнцийн цай',
    description:
      'Хатаасан хүнцэл, эмийн ургамлын зөөлөн хольцтой уламжлалт цай. Хүйтэн сарын өдрүүдэд биеийг тайвшруулж дулаатгадаг.',
    category: 'цай',
    price: 15000,
    stock: 25,
    imageUrl: P.tea2,
  },
  {
    name: 'Цайны бэлэг дэглэм',
    description:
      'Уулаархан, хүнцийн цай болон ваар аягатай бүрдсэн бэлэг дэглэм. Ажлын хамт олон, ой тэмдэглэлт баярын бэлэгт тохирно.',
    category: 'цай',
    price: 45000,
    stock: 3,
    imageUrl: P.tea3,
  },

  // ── Гэр ахуй (2) ───────────────────────────────────────────────────────────
  {
    name: 'Ваар аяга',
    description:
      'Гарын зайрлагаар шатааж хийсэн ваар аяга. Халуун цай, будаатай хоолонд ашиглахад тохиромжтой, угааж ашиглах боломжтой.',
    category: 'гэр ахуй',
    price: 32000,
    stock: 7,
    imageUrl: P.ceramic1,
    featured: true,
  },
  {
    name: 'Зэс аяга',
    description:
      'Гараар цохиж, цутгасан зэс аяга — гэр дотор чимэглэл, мөн халуун цай асгахад хэрэглэх боломжтой.',
    category: 'гэр ахуй',
    price: 48000,
    stock: 4,
    imageUrl: P.copper1,
  },

  // ── Аялал (2) ──────────────────────────────────────────────────────────────
  {
    name: 'Аяллын тоног хэрэгсэл багц',
    description:
      'Аяллын дэр, хөнгөн тэрэг, арьсан сантай цогц багц. Хоёр хоногийн богино аялалд шаардлагатай үндсэн хэрэгслийг багтаасан.',
    category: 'аялал',
    price: 120000,
    stock: 5,
    imageUrl: P.travel1,
  },
  {
    name: 'Аяллын хөлний дэр',
    description:
      'Унадаг дугуй, машинаар зугаалгааны үед хөлийг түшин тайвшруулах хөнгөн хөлний дэр. Аягатай, хураахад орон зай багтаана.',
    category: 'аялал',
    price: 36000,
    stock: 9,
    imageUrl: P.travel2,
  },
]

const hoursAgo = (h: number) => new Date(Date.now() - h * 60 * 60 * 1000)

async function seed() {
  await db.shopOrder.deleteMany({})
  await db.product.deleteMany({})

  // ── Бүтээгдэхүүнүүд ──
  const byName = new Map<string, string>()
  for (const p of PRODUCTS) {
    const created = await db.product.create({
      data: {
        name: p.name,
        description: p.description,
        category: p.category,
        price: p.price,
        oldPrice: p.oldPrice ?? null,
        stock: p.stock,
        imageUrl: p.imageUrl,
        options: p.options ?? undefined,
        featured: p.featured ?? false,
        active: true,
      },
    })
    byName.set(p.name, created.id)
  }
  console.log(`✅ НУТАГ: ${PRODUCTS.length} бүтээгдэхүүн нэмэгдлээ (онцлох: ${PRODUCTS.filter((p) => p.featured).length})`)

  // ── Жишээ захиалгууд ──
  const orders = [
    {
      customerName: 'Оюунчимэг Дорж',
      phone: '99112233',
      email: 'oyuna@example.com',
      city: 'Улаанбаатар',
      address: 'Сүхбаатар дүүрэг, 8-р хороо, 1-р 400 мянгат, 25-р байр, 3 орц, 12 тоот',
      notes: 'Хүргэлтийн үед утсаар дуударай',
      items: [
        { id: byName.get('Эсгий пантүфл')!, name: 'Эсгий пантүфл', price: 34000, qty: 1, option: '38-39 · Сонгино' },
        { id: byName.get('Хүнцийн цай')!, name: 'Хүнцийн цай', price: 15000, qty: 2, option: null },
      ],
      subtotal: 64000,
      deliveryFee: 6000,
      total: 70000,
      status: 'бүртгэгдсэн',
      paymentStatus: 'төлөгдөөгүй',
      createdAt: hoursAgo(3),
    },
    {
      customerName: 'Мөнхзул Эрдэнэ',
      phone: '86119944',
      email: null,
      city: 'Дархан',
      address: 'Дархан хот, 3-р хороо, Хоролын зам, 7-р байр, 1 орц',
      notes: null,
      items: [
        { id: byName.get('Гар урлалын арьсан цүнх')!, name: 'Гар урлалын арьсан цүнх', price: 89000, qty: 1, option: 'Күрэн' },
        { id: byName.get('Арьсан түрийвч')!, name: 'Арьсан түрийвч', price: 39000, qty: 1, option: null },
      ],
      subtotal: 128000,
      deliveryFee: 0, // 80,000₮-аас дээш — үнэгүй
      total: 128000,
      status: 'баглааж байна',
      paymentStatus: 'төлөгдсөн',
      createdAt: hoursAgo(26),
    },
    {
      customerName: 'Доржсүрэн Лхагва',
      phone: '99088777',
      email: 'dorjsuren@example.com',
      city: 'Улаанбаатар',
      address: 'Баянзүрх дүүрэг, 18-р хороо, 100 айлын гудамж, 5-р байр',
      notes: 'Кодыг консьержид өгөөрэй',
      items: [
        { id: byName.get('Ноосон хантааз')!, name: 'Ноосон хантааз', price: 65000, qty: 1, option: 'L' },
        { id: byName.get('Цайны бэлэг дэглэм')!, name: 'Цайны бэлэг дэглэм', price: 45000, qty: 1, option: null },
        { id: byName.get('Уулаархан цай хайрцаг')!, name: 'Уулаархан цай хайрцаг', price: 19000, qty: 2, option: null },
      ],
      subtotal: 148000,
      deliveryFee: 0,
      total: 148000,
      status: 'хүргэгдсэн',
      paymentStatus: 'төлөгдсөн',
      createdAt: hoursAgo(72),
    },
  ]

  for (const o of orders) {
    await db.shopOrder.create({ data: o })
  }
  console.log(`✅ НУТАГ: ${orders.length} жишээ захиалга нэмэгдлээ`)
}

async function run(attempt = 1): Promise<void> {
  try {
    await seed()
  } catch (err) {
    const msg = String(err)
    if (attempt < 4 && /locked|timeout|busy/i.test(msg)) {
      console.log(`⏳ Өгөгдлийн сан түгжигдсэн — ${attempt}-р удаа дахин оролдож байна…`)
      await new Promise((r) => setTimeout(r, 1500))
      return run(attempt + 1)
    }
    throw err
  } finally {
    await db.$disconnect()
  }
}

run()
  .then(() => console.log('🎉 НУТАГ Store-ийн seed дууслаа'))
  .catch((e) => {
    console.error('❌ Seed алдаа:', e)
    process.exit(1)
  })
