/**
 * ҮЗЭГ Стриминг — демо өгөгдөл (Демо 5)
 * Ажиллуулах: bun prisma/seed-uzeg.ts
 *
 * StreamTitle (14 контент: 8 кино, 4 цуврал, 2 баримтат) + StreamSub (2 жишээ багц).
 * Өмнөх демо өгөгдлийг бүрэн устгаад дахин үүсгэнэ. Бүх контент зохиомол (демо) юм.
 */

import { db } from '../src/lib/db'

type TitleSeed = {
  title: string
  type: string
  genre: string
  year: number
  rating: number
  duration: string
  description: string
  posterGradient: string
  backdropUrl: string | null
  videoUrl: string | null
  featured: boolean
  isNew: boolean
  active: boolean
}

type SubSeed = {
  plan: string
  customerName: string
  email: string
  amount: number
  status: string
}

/** Lock (P2024) алдаа гарвал дахин оролдох туслах */
async function withRetry<T>(fn: () => Promise<T>, tries = 3): Promise<T> {
  let lastErr: unknown
  for (let i = 0; i < tries; i++) {
    try {
      return await fn()
    } catch (e) {
      lastErr = e
      const code = (e as { code?: string })?.code ?? ''
      const msg = String((e as Error)?.message ?? e).toLowerCase()
      if (code === 'P2024' || msg.includes('lock') || msg.includes('timeout')) {
        await new Promise((r) => setTimeout(r, 400 * (i + 1)))
        continue
      }
      throw e
    }
  }
  throw lastErr
}

// Нээлттэй эхийн жишээ видео (Google-ийн нийтийн сан, CC-BY)
const V = {
  bunny: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_2MB.mp4',
  dream: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_2MB.mp4',
  sintel: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_2MB.mp4',
  steel: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_2MB.mp4',
  blazes: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_2MB.mp4',
  escapes: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_2MB.mp4',
}

// Кинематик бэкдропууд (assets-img/IMAGE_INDEX.json — stream1/stream2)
const B = {
  s11: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/84eab4098d72.jpeg',
  s12: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/da524f152d2d.jpg',
  s13: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/e32d0f7304e4.jpg',
  s14: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/1565637c9732.jpg',
  s15: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/3261a44263db.jpg',
  s21: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/45f22b124171.jpg',
  s22: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/2d21ff5578d8.jpg',
  s23: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/0cd0499d6b11.jpg',
  s24: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/6899e96f3bdd.jpg',
  s25: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/70fdd6626d77.jpg',
}

const titles: TitleSeed[] = [
  // ─── КИНО (8) ───
  {
    title: 'Нүүдэл',
    type: 'кино',
    genre: 'Адал явдал',
    year: 2024,
    rating: 8.7,
    duration: '2 ц 08 мин',
    description:
      'Гурван үеийн нүүдэлчин айлын амьдрал, тэнгэрийн доорх алс замын тухай өгүүлсэн адал явдалт кино. Хүү Арвал аавынхаа мөрөөр таван сарын нүүдлийн замд гарахдаа байгалийн ширүүн сорилт, анхны найз зэрэг мэдэрнэ. Мөрөөдлийн уул руу чиглэсэн аялал тэдний амьдралыг бүрмөсөн өөрчилнө.',
    posterGradient: 'linear-gradient(160deg,#3b0d16,#8a1c30 55%,#ff3d5a 130%)',
    backdropUrl: B.s11,
    videoUrl: V.bunny,
    featured: true,
    isNew: true,
    active: true,
  },
  {
    title: 'Хар салхи',
    type: 'кино',
    genre: 'Драм',
    year: 2023,
    rating: 8.1,
    duration: '1 ц 56 мин',
    description:
      'Хар салхинд тасарсан жижиг айлын эхийн хүч хэзээ ч унахгүй гэдгийг харуулсан драм. Хойд захын суурин амьдардаг эх хоёр хүүхдээ өсгөхийн тулд хэцүү сонголт хийх ёстой болно. Зуны шөнө дундын нэгэн дуудлага бүхнийг эргүүлж өөрчилнө.',
    posterGradient: 'linear-gradient(160deg,#2a0505,#7a1414 55%,#e04b3d 130%)',
    backdropUrl: B.s13,
    videoUrl: V.sintel,
    featured: false,
    isNew: false,
    active: true,
  },
  {
    title: 'Цагаан нуурын нууц',
    type: 'кино',
    genre: 'Мистик',
    year: 2024,
    rating: 7.9,
    duration: '1 ц 47 мин',
    description:
      'Цагаан нуурын эргэд оршдог домогт усан онгоцны нууцыг тайлж эхэлсэн залуу судлаачийн тухай мистик түүх. Айлчлал бүр шинэ шинж тэмдэг, сүүдэрт нуугдсан өгүүлэмжийг нээж өгнө. Нуур гүнзгийрэх тусам нууц ч гүнзгийрнэ.',
    posterGradient: 'linear-gradient(160deg,#07231e,#12564a 55%,#2dd4a8 130%)',
    backdropUrl: B.s14,
    videoUrl: V.dream,
    featured: false,
    isNew: true,
    active: true,
  },
  {
    title: 'Харанга',
    type: 'кино',
    genre: 'Түүхэн',
    year: 2022,
    rating: 8.4,
    duration: '2 ц 21 мин',
    description:
      'Харанга цэргүүдийн бардам замнал, эх орныхоо төлөө тэмцсэн түүхэн өгүүлэмж. Зууны хил хязгаарт залуу баатар өрөвдөг сэтгэл, зориг хоёрын хооронд зогсдог. Том хэмжээний тулааны ээлжлүүд ба түүхийн ширүүн бодит байдал.',
    posterGradient: 'linear-gradient(160deg,#26090a,#6e2410 55%,#c96a3d 130%)',
    backdropUrl: B.s12,
    videoUrl: V.steel,
    featured: false,
    isNew: false,
    active: true,
  },
  {
    title: 'Тэнгэрийн хүү',
    type: 'кино',
    genre: 'Адал явдал',
    year: 2023,
    rating: 7.7,
    duration: '1 ц 39 мин',
    description:
      'Тэнгэрлэг гэгээг харсан гэх ядуу хүүхдийн домогт адал явдал. Тэрээр өрсөлдөгчид, ховор чадвар, шинэ найзуудын дунд өөрийн бодит хүчийг олж мэднэ. Нисэх чадвартай гэгдэх хүүгийн түүх бүх насныхныг урамшуулна.',
    posterGradient: 'linear-gradient(160deg,#331303,#7c3b10 55%,#ff8c3d 130%)',
    backdropUrl: B.s21,
    videoUrl: V.blazes,
    featured: false,
    isNew: false,
    active: true,
  },
  {
    title: 'Далан хоёрон',
    type: 'кино',
    genre: 'Инээдтэй',
    year: 2023,
    rating: 7.5,
    duration: '1 ц 32 мин',
    description:
      'Далан хоёр орон гуйж яваад гэртээ эргэж ирсэн эмгэнэлт инээдмийн баатрын тухай. Тэрээр ахынхаа хурим, ажлын ярилцлага, хөрш зээлийн маргааныг зэрэг бүдүүлгээр зохион байгуулна. Инээд, уй гашуу, аз жаргалын амттай холимог.',
    posterGradient: 'linear-gradient(160deg,#2e2408,#8a6a14 55%,#ffd23d 130%)',
    backdropUrl: null,
    videoUrl: V.escapes,
    featured: false,
    isNew: false,
    active: true,
  },
  {
    title: 'Мөнх хөлгөөн',
    type: 'кино',
    genre: 'Фантази',
    year: 2024,
    rating: 8.2,
    duration: '2 ц 04 мин',
    description:
      'Мөнхийн амьдралын модны доорх долоон хаант улсын фантази ертөнц. Нэгэн эмэгтэй цэцэрлэгч мөнх амьдралыг хүссэнээрээ гайхалтай тулаан, уралдаанд ордог. Мөнх цаг биш — мөнх дурсамж л үлддэг гэдгийг тэр эцэст нь ойлгодог.',
    posterGradient: 'linear-gradient(160deg,#33091f,#8a1c52 55%,#ff3d9a 130%)',
    backdropUrl: B.s23,
    videoUrl: V.sintel,
    featured: false,
    isNew: true,
    active: true,
  },
  {
    title: 'Буран',
    type: 'кино',
    genre: 'Трилер',
    year: 2023,
    rating: 7.8,
    duration: '1 ц 51 мин',
    description:
      'Бурангаар бүрхэгдсэн шөнө нэгэн эргэлтийн алга тогтоогдсон детектив трилер. Усан цахилгаан станцын ажилтан гэнэт алга болсны дараа түүний эгч чимээгүй мөрдөн байцаалт эхэлнэ. Сүүлчийн цасан ширхэг буухад бүх зүйл тодорхой болно.',
    posterGradient: 'linear-gradient(160deg,#22091a,#5e1436 55%,#c23d6d 130%)',
    backdropUrl: B.s24,
    videoUrl: V.steel,
    featured: false,
    isNew: false,
    active: true,
  },
  // ─── ЦУВРАЛ (4) ───
  {
    title: 'Зургаан сар',
    type: 'цуврал',
    genre: 'Драм',
    year: 2024,
    rating: 8.5,
    duration: '1 Анги',
    description:
      'Зургаан сар, зургаан үе, нэг гэр бүлийн нарийн төвөгтэй драм цуврал. Аав ээж хоёрын салалт хүүхдүүдийн амьдралыг тус тус өөрчилдөг. Анги бүр нэг сарын үлгэр, нэгэн шийдвэрийн үр дагаврыг өгүүлнэ.',
    posterGradient: 'linear-gradient(160deg,#331303,#7c3b10 55%,#ff8c3d 130%)',
    backdropUrl: B.s25,
    videoUrl: V.dream,
    featured: false,
    isNew: true,
    active: true,
  },
  {
    title: 'Хойд зах',
    type: 'цуврал',
    genre: 'Криминал',
    year: 2023,
    rating: 8.3,
    duration: '2 Анги',
    description:
      'Улаанбаатарын хойд захын үйлчилгээний бүсэд болсон хэрэг явдлыг мөрдөн шалгадаг криминал цуврал. Хоёр цагдаа, нэг сэтгүүлч, нэгэн бүсгүйн далд амьдрал хөндлөнгөөр огтлолцно. Хот хэмээх том жижиг орон зайн тухай хурц түүх.',
    posterGradient: 'linear-gradient(160deg,#2a0505,#7a1414 55%,#e04b3d 130%)',
    backdropUrl: B.s22,
    videoUrl: V.bunny,
    featured: false,
    isNew: false,
    active: true,
  },
  {
    title: 'Агтны сүлд',
    type: 'цуврал',
    genre: 'Спорт драм',
    year: 2024,
    rating: 8.0,
    duration: '1 Анги',
    description:
      'Азарганы уралдаанд бэлтгэж буй залуу морьтон, түүний гэр бүлийн спорт драм цуврал. Ялагдашгүй морь, гэмтсэн өвдөг, өвөг дээдсийн хийморь — бүгд нэг замд нэгдэнэ. Халуун зун, хүйтэн өвлийн сургамж уралдааны өдрүүдээр төгсдөг.',
    posterGradient: 'linear-gradient(160deg,#0c2309,#2f5e14 55%,#7dd13d 130%)',
    backdropUrl: null,
    videoUrl: V.escapes,
    featured: false,
    isNew: false,
    active: true,
  },
  {
    title: 'Ээжийн дуу',
    type: 'цуврал',
    genre: 'Гэр бүлийн',
    year: 2022,
    rating: 7.6,
    duration: '2 Анги',
    description:
      'Ээжийн эгшиг дуу хоёр үеийн харилцааг сайжруулдаг гэр бүлийн цуврал. Хотойн нэг өрөө, гурван үеийн эмэгтэйчүүд, тэдний нууц хүслүүд. Дуу дуулахдаа бүх зүйлийг тайлбарлахгүйгээр ойлгодог гэр бүлийн дулаан түүх.',
    posterGradient: 'linear-gradient(160deg,#2e2408,#8a6a14 55%,#ffd23d 130%)',
    backdropUrl: null,
    videoUrl: V.bunny,
    featured: false,
    isNew: false,
    active: true,
  },
  // ─── БАРИМТАТ (2) ───
  {
    title: 'Сүлд',
    type: 'баримтат',
    genre: 'Түүх',
    year: 2023,
    rating: 8.6,
    duration: '1 ц 12 мин',
    description:
      'Монголын тал нутгийн сүлд тэмдэг, соёлын өвийн тухай баримтат кино. Археологич, урлаач, малчид хамтран арван зууны түүхийг сэргээдэг. Газар доорх олдвор бүр шинэ үлгэр, шинэ эрдэм болж хувирдаг.',
    posterGradient: 'linear-gradient(160deg,#26090a,#6e2410 55%,#c96a3d 130%)',
    backdropUrl: B.s15,
    videoUrl: V.blazes,
    featured: false,
    isNew: false,
    active: true,
  },
  {
    title: 'Монгол орны нууц',
    type: 'баримтат',
    genre: 'Байгаль',
    year: 2024,
    rating: 8.8,
    duration: '3 Анги',
    description:
      'Монгол орны ховор амьтан, өвөрмөц уулс, говийн нуурын амьдралын тухай гурван ангит баримтат цуврал. Дөрвөн улирлын турш хамтарсан зураглаачид байгалийн ховор дүр зургийг бичсэн. Уул, тал, говь гурвын нууцыг нээж харуулна.',
    posterGradient: 'linear-gradient(160deg,#07231e,#12564a 55%,#2dd4a8 130%)',
    backdropUrl: B.s11,
    videoUrl: V.dream,
    featured: false,
    isNew: true,
    active: true,
  },
]

const subs: SubSeed[] = [
  {
    plan: 'Жил',
    customerName: 'Бат-Эрдэнэ Содном',
    email: 'baterdene@example.mn',
    amount: 79000,
    status: 'идэвхтэй',
  },
  {
    plan: 'Сар',
    customerName: 'Оюунчимэг Даваа',
    email: 'oyunchimeg@example.mn',
    amount: 9900,
    status: 'идэвхтэй',
  },
]

async function main() {
  console.log('⟳ ҮЗЭГ Стриминг seed эхэлж байна…')

  // 1) Хуучин демо өгөгдлийг цэвэрлэх
  await withRetry(() => db.streamSub.deleteMany())
  await withRetry(() => db.streamTitle.deleteMany())

  // 2) 14 контент
  for (const t of titles) {
    await withRetry(() => db.streamTitle.create({ data: t }))
  }

  // 3) 2 жишээ багц бүртгэл
  for (const s of subs) {
    await withRetry(() => db.streamSub.create({ data: s }))
  }

  const kino = titles.filter((t) => t.type === 'кино').length
  const tsubral = titles.filter((t) => t.type === 'цуврал').length
  const barimtat = titles.filter((t) => t.type === 'баримтат').length
  const featured = titles.filter((t) => t.featured).length
  const isNew = titles.filter((t) => t.isNew).length

  console.log(`✓ ҮЗЭГ: ${titles.length} контент (кино ${kino}, цуврал ${tsubral}, баримтат ${barimtat}; featured ${featured}, шинэ ${isNew}), ${subs.length} багц бүртгэл үүсгэгдлээ.`)
}

main()
  .catch((e) => {
    console.error('✗ Seed алдаа:', e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
