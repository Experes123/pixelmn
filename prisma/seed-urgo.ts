/**
 * ӨРГӨӨ Ресторан — демо өгөгдөл.
 * Ажиллуул: bun prisma/seed-urgo.ts
 * Цэс: 18 бүтээгдэхүүн (нэйлэг 5, зүсэмж 5, хөнгөн 3, амттан 2, уух зүйл 3) + 4 жишээ захиалга.
 */
import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

// IMAGE_INDEX.json (food1..food8) — зургийн URL сан
const F = {
  buuz3: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/c0b8c0cef024.jpg.jpg',
  buuz10: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/7fb4eb331d19.jpg',
  bans: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/c5b5e0a4d47f.jpg',
  khuushuur: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/8ea788b9487e.jpg.jpg',
  tsuivan: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/3596096cb700.jpg',
  khorhog: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/5e0bff4d8683.jpg',
  khurga: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/906b71d77f6a.jpg',
  shol: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/5b33c9872416.jpg',
  daipan: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/5c89c4927295.jpg',
  tuurgatai: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/5d347aebe964.jpg',
  salad: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/dd1568e663eb.jpg',
  nogoo: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/ff7b6dddc4b6.jpg',
  kimchi: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/64eb46e20d96.jpg',
  boortsog: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/18a79bc8028a.jpg',
  cheesecake: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/d4356827f3f3.jpg',
  suutei: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/27342b87af81.jpg',
  juice: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/97d292a6f4d0.jpg',
  chatsargana: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/22e6e4263905.jpg',
}

const MENU: {
  name: string
  description: string
  category: string
  price: number
  imageUrl: string
  spicy?: boolean
  available?: boolean
  popular?: boolean
}[] = [
  // ── нэйлэг (5) ──
  {
    name: 'Бууз (3 ш)',
    description: 'Гэртээ дарсан, чийгтэй, гоймонгүй махтай бууз — халуунаар нь лаазан дээр.',
    category: 'нэйлэг',
    price: 4500,
    imageUrl: F.buuz3,
    popular: true,
  },
  {
    name: 'Бууз (10 ш)',
    description: 'Гэр бүлийн үдэшлэгийн хэмжээ — 10 ширхэг бууз, халуун соустай.',
    category: 'нэйлэг',
    price: 13000,
    imageUrl: F.buuz10,
    popular: true,
  },
  {
    name: 'Хуушуур (2 ш)',
    description: 'Алтан шаргал, нягт махтай хуушуур — гадна цавчуу, дотроо зөөлөн.',
    category: 'нэйлэг',
    price: 5000,
    imageUrl: F.khuushuur,
    popular: true,
  },
  {
    name: 'Цуйван',
    description: 'Гараар татсан гоймон, ногоо бүхий цуйван — луувантай, халуун ногоотой.',
    category: 'нэйлэг',
    price: 7000,
    imageUrl: F.tsuivan,
    spicy: true,
  },
  {
    name: 'Банс',
    description: 'Махан шүүсээр амтласан, зөөлөн хийсэн банс.',
    category: 'нэйлэг',
    price: 6500,
    imageUrl: F.bans,
  },
  // ── зүсэмж (5) ──
  {
    name: 'Хорхог',
    description: 'Чулуун хорхог — хонины мах, хүнцэл бүхий уламжлалт баяр хоол.',
    category: 'зүсэмж',
    price: 12000,
    imageUrl: F.khorhog,
    spicy: true,
    popular: true,
  },
  {
    name: 'Хуурга',
    description: 'Зузаан махаар хийсэн хуурга, будаа, сонгинотой хамт.',
    category: 'зүсэмж',
    price: 11000,
    imageUrl: F.khurga,
  },
  {
    name: 'Шол',
    description: 'Хальтрсан мах, будаа, ногоотой амттай шол — өглөө, орой альд ч тохирно.',
    category: 'зүсэмж',
    price: 9000,
    imageUrl: F.shol,
  },
  {
    name: 'Дайпан',
    description: 'Зөөлөн дайпан мах, сонгино бүхий халуун хоол.',
    category: 'зүсэмж',
    price: 10500,
    imageUrl: F.daipan,
  },
  {
    name: 'Туургатай мах',
    description: 'Туургатай хийсэн гэр ахуйн махан хоол — маш тансаг амттай.',
    category: 'зүсэмж',
    price: 13500,
    imageUrl: F.tuurgatai,
    available: false,
  },
  // ── хөнгөн (3) ──
  {
    name: 'Мангиртэй салад',
    description: 'Мангир, хүнсний ногоо бүхий шинэхэн салад — гэр ахуйн амтлагчаар.',
    category: 'хөнгөн',
    price: 6500,
    imageUrl: F.salad,
  },
  {
    name: 'Хуурмал ногоо',
    description: 'Сезон ногоог тосонд хуурч, зөөлөн амтласан хөнгөн хоол.',
    category: 'хөнгөн',
    price: 5500,
    imageUrl: F.nogoo,
  },
  {
    name: 'Кимчи',
    description: 'Халуун ногоотой, исгэсэн байцааны кимчи — хоолны амт нэмэгдүүлэгч.',
    category: 'хөнгөн',
    price: 3500,
    imageUrl: F.kimchi,
    spicy: true,
  },
  // ── амттан (2) ──
  {
    name: 'Боорцогтой амттан',
    description: 'Гараар хийсэн боорцог, чихэртэй хольсон амттангийн хэсэг.',
    category: 'амттан',
    price: 4000,
    imageUrl: F.boortsog,
  },
  {
    name: 'Шоколадтай бяслагт бялуу',
    description: 'Зууханд боловсруулсан шоколадтай бяслагт бялуу — зөөлөн, амттай.',
    category: 'амттан',
    price: 5500,
    imageUrl: F.cheesecake,
  },
  // ── уух зүйл (3) ──
  {
    name: 'Сүүтэй цай',
    description: 'Өрөөсөн сүүтэй, давслаг уламжлалт монгол цай.',
    category: 'уух зүйл',
    price: 1500,
    imageUrl: F.suutei,
    popular: true,
  },
  {
    name: 'Гадилын шүүс',
    description: 'Шинэхэн гадилын шүүс — хүүхдийн дуртай.',
    category: 'уух зүйл',
    price: 2500,
    imageUrl: F.juice,
  },
  {
    name: 'Чацарганы цай',
    description: 'Чацаргана, зөгийн балтай дулаан ундаа.',
    category: 'уух зүйл',
    price: 2000,
    imageUrl: F.chatsargana,
  },
]

const daysAgo = (n: number, hour = 13) => {
  const d = new Date()
  d.setDate(d.getDate() - n)
  d.setHours(hour, 30, 0, 0)
  return d
}

async function seed() {
  await db.restaurantOrder.deleteMany()
  await db.menuItem.deleteMany()

  const byName: Record<string, string> = {}
  for (const item of MENU) {
    const created = await db.menuItem.create({ data: item })
    byName[created.name] = created.id
  }
  console.log(`✅ ӨРГӨӨ: ${MENU.length} цэсний бүтээгдэхүүн нэмэгдлээ`)

  const orders = [
    {
      customerName: 'Батбаяр Дорж',
      phone: '99112233',
      address: 'Улаанбаатар хот, Сүхбаатар дүүрэг, 1-р хороо, Жуулчны гудамж, 25-р байр, 3-р орц',
      notes: 'Хаалгадаа дуударай',
      items: [
        {
          id: byName['Бууз (10 ш)'],
          name: 'Бууз (10 ш)',
          price: 14300, // Дунд хэмжээ: 13,000 × 1.1
          qty: 1,
          options: ['Дунд'],
        },
        {
          id: byName['Хорхог'],
          name: 'Хорхог',
          price: 12500, // Халуун соус +500
          qty: 1,
          options: ['Халуун соус'],
        },
      ],
      subtotal: 26800,
      deliveryFee: 5000,
      total: 31800,
      status: 'хүргэгдсэн',
      paymentStatus: 'төлөгдсөн',
      createdAt: daysAgo(2, 12),
    },
    {
      customerName: 'Сарантуяа Ганбат',
      phone: '86112345',
      address: 'Улаанбаатар хот, Хан-Уул дүүрэг, 11-р хороо, Зайсан, 15-р байр',
      notes: null,
      items: [
        { id: byName['Цуйван'], name: 'Цуйван', price: 7000, qty: 2, options: [] },
        { id: byName['Сүүтэй цай'], name: 'Сүүтэй цай', price: 1500, qty: 2, options: [] },
      ],
      subtotal: 17000,
      deliveryFee: 5000,
      total: 22000,
      status: 'хүргэлтэд гарсан',
      paymentStatus: 'төлөгдсөн',
      createdAt: daysAgo(1, 19),
    },
    {
      customerName: 'Мөнх-Эрдэнэ Түвшин',
      phone: '95159911',
      address: 'Улаанбаатар хот, Баянгол дүүрэг, 4-р хороо, 4-р хороолол, 12-р байр, 2 орц',
      notes: 'Гудамжны хаалгаар орж ирээрэй',
      items: [
        {
          id: byName['Хуушуур (2 ш)'],
          name: 'Хуушуур (2 ш)',
          price: 5500, // Халуун соус +500
          qty: 2,
          options: ['Халуун соус'],
        },
        { id: byName['Мангиртэй салад'], name: 'Мангиртэй салад', price: 6500, qty: 1, options: [] },
      ],
      subtotal: 17500,
      deliveryFee: 5000,
      total: 22500,
      status: 'бэлтгэж байна',
      paymentStatus: 'төлөгдөөгүй',
      createdAt: daysAgo(0, 12),
    },
    {
      customerName: 'Хулан Батсайхан',
      phone: '80887766',
      address: 'Улаанбаатар хот, Чингэлтэй дүүрэг, 2-р хороо, 2-р 400 мянгат, 8-р байр',
      notes: null,
      items: [
        {
          id: byName['Бууз (3 ш)'],
          name: 'Бууз (3 ш)',
          price: 5400, // Том хэмжээ: 4,500 × 1.2
          qty: 3,
          options: ['Том'],
        },
        { id: byName['Боорцогтой амттан'], name: 'Боорцогтой амттан', price: 4000, qty: 2, options: [] },
      ],
      subtotal: 24200,
      deliveryFee: 5000,
      total: 29200,
      status: 'хүлээн авсан',
      paymentStatus: 'төлөгдсөн',
      createdAt: daysAgo(0, 14),
    },
  ]

  for (const o of orders) {
    await db.restaurantOrder.create({ data: o })
  }
  console.log(`✅ ӨРГӨӨ: ${orders.length} жишээ захиалга нэмэгдлээ`)
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
  .then(() => console.log('🎉 ӨРГӨӨ Рестораны seed дууслаа'))
  .catch((e) => {
    console.error('❌ Seed алдаа:', e)
    process.exit(1)
  })
