/**
 * ТЭМҮҮР Групп — демо өгөгдөл (концепт брэнд).
 * Ажиллуул: bun prisma/seed-temuur.ts
 * Content 6 түлхүүр + 6 үйлчилгээ + 6 жишээ төсөл + 3 хүсэлт.
 */
import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

// IMAGE_INDEX.json (company1..company4) — зургийн URL сан
const IMG = {
  company1: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/1e9fe81a5d4a.jpg',
  company2: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/43db3fb5111b.jpg',
  company3: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/8347ff4677a4.png',
  company4: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/c98ea727e59f.jpg',
}

async function seed() {
  await db.companyContent.deleteMany()
  await db.companyService.deleteMany()
  await db.companyProject.deleteMany()
  await db.companyInquiry.deleteMany()

  // ── Content (key/value) ──
  const content = [
    {
      key: 'heroTitle',
      label: 'Нүүр — гол гарчиг',
      value: 'Дэд бүтцийн ирээдүйг хамтдаа барьцаалах',
    },
    {
      key: 'heroSub',
      label: 'Нүүр — дэд тайлбар',
      value:
        'ТЭМҮҮР Групп нь инженерийн нарийвчлал, барилгын туршлага, хамтын ажиллагааны соёлоор үндэсний дэд бүтцийг бэхжүүлэхийг зорьдог концепт групп юм.',
    },
    {
      key: 'aboutText1',
      label: 'Бидний тухай — гол өгүүлбэр',
      value:
        'Бид ган шиг хатуу стандарт, хүн шиг халамжтай ханддаг. Төсөл бүрийг зөвхөн барих бус — олон үеийн үр ашигтай, орчинтойгоо эвлэрсэн инженерийн шийдэл болгон бүтээдэг.',
    },
    {
      key: 'aboutText2',
      label: 'Бидний тухай — нэмэлт текст',
      value:
        'ТЭМҮҮР Групп нь дэд бүтцийн барилга, инженерийн зураг төсөл, зам тээвэр, эрчим хүч, ус цэвэршүүлэлтийн салбарт үйл ажиллагаа явуулдаг концепт групп юм. Аюулгүй байдлын соёл, цаг хугацааны сахилга бат, багийн нээлттэй хамтын ажиллагаа бол бидний хамгийн том нөөц. Төлөвлөлтөөс гүйцэтгэл хүртэлх бүх шатанд тооцоо, шийдвэр бүрээ хариуцаж, зөвхөн гэрээ бус — итгэлцлээр ажилладаг.',
    },
    {
      key: 'mission',
      label: 'Эрхэм зорилго',
      value:
        'Үндэсний дэд бүтцийн чанар, аюулгүй байдлын стандартыг дээшлүүлж, хамтран ажиллагсад, нийгэмд урт хугацааны үр өгөөжтэй инженерийн шийдэл хүргэх.',
    },
    {
      key: 'vision',
      label: 'Алсын хараа',
      value:
        '2030 он гэхэд дэд бүтцийн салбарт олон улсын стандарт, экологийн хариуцлагыг нэвтрүүлсэн үндэсний тэргүүлэгч групп болох.',
    },
  ]
  for (const c of content) {
    await db.companyContent.create({ data: c })
  }
  console.log(`✅ ТЭМҮҮР: ${content.length} content бичилт нэмэгдлээ`)

  // ── Үйлчилгээ (6) ──
  const services = [
    {
      title: 'Дэд бүтцийн барилга',
      description:
        'Гүүр, зам, барилгын бүтцийг олон улсын стандартын дагуу барих, өргөтгөх, шинэчлэх цогц үйлчилгээ.',
      icon: 'Building2',
      order: 1,
    },
    {
      title: 'Инженерийн зураг төсөл',
      description:
        'Төслийн концепцаос гүйцэтгэлийн зураг төсөл хүртэл — геодези, тооцоо, загварчлалыг нэг багт нэгтгэсэн.',
      icon: 'DraftingCompass',
      order: 2,
    },
    {
      title: 'Зам тээврийн шийдэл',
      description:
        'Авто замын давхарга, гудамжны сүлжээ, ачаа тээврийн зангилааг төлөвлөж, хэрэгжүүлнэ.',
      icon: 'Route',
      order: 3,
    },
    {
      title: 'Эрчим хүчний систем',
      description:
        'Дамжуулах шугам, дэд станц, сэргээгдэх эрчим хүчний холболтын инженерийн шийдэл.',
      icon: 'Zap',
      order: 4,
    },
    {
      title: 'Ус цэвэршүүлэлт',
      description:
        'Усны цэвэршүүлэх байгууламж, дахин ашиглах систем, дуслын усалгааны технологи.',
      icon: 'Droplets',
      order: 5,
    },
    {
      title: 'Зөвлөх үйлчилгээ',
      description:
        'Төслийн боломжийн судалгаа, өртгийн тооцоо, техникийн хяналт, менежмент.',
      icon: 'ClipboardCheck',
      order: 6,
    },
  ]
  for (const s of services) {
    await db.companyService.create({ data: { ...s, active: true } })
  }
  console.log(`✅ ТЭМҮҮР: ${services.length} үйлчилгээ нэмэгдлээ`)

  // ── Төслүүд (6, fictional concept projects) ──
  const projects = [
    {
      title: 'Хотын гүүр шинэчлэл',
      description:
        'Хүнд ачааны эрчимт хөдөлгөөнд зориулж нийт 620 метр гүүрийн тулгуур бүтцийг бэхжүүлж, зам хөдөлгөөнийг зогсолтгүй шатлалаар зохион байгуулсан жишээ төсөл.',
      category: 'Замын байгууламж',
      year: '2022',
      imageUrl: IMG.company1,
      order: 1,
    },
    {
      title: 'Нарийн замын өргөтгөл',
      description:
        '18 км замын хэсгийг дөрвөн эгнээт болгон өргөтгөж, гэрэлтүүлэг, ус зайлуулах шугамыг цогцоор нь шинэчилсэн жишээ төсөл.',
      category: 'Замын байгууламж',
      year: '2023',
      imageUrl: IMG.company2,
      order: 2,
    },
    {
      title: 'Хийсвэр усан сан',
      description:
        'Хотын зүүн хэсгийн хэрэглэгчдэд өдөрт 12,000 м³ цэвэр ус хүргэх хийсвэр усан сангийн шийдлийн төсөл — усны чанар, хадгалалтын стандартыг нэгтгэсэн.',
      category: 'Хот төлөвлөлт',
      year: '2024',
      imageUrl: IMG.company3,
      order: 3,
    },
    {
      title: 'Оффис цогцолбор',
      description:
        'Дөрвөн блок бүхий албаны цогцолборын инженерийн систем, эрчим хүчний үр ашгийн шийдэл — халаалт, агааржуулалтыг нэгтгэсэн удирдлагаар.',
      category: 'Хот төлөвлөлт',
      year: '2024',
      imageUrl: IMG.company4,
      order: 4,
    },
    {
      title: 'Солир эрчимжүүлэлт',
      description:
        'Говийн бүсийн 40 МВт хүчин чадлын солир станцын суурь бүтэц, эрчим хүчний холболтын ажлыг гүйцэтгэсэн жишээ төсөл.',
      category: 'Эрчим хүч',
      year: '2023',
      imageUrl: IMG.company1,
      order: 5,
    },
    {
      title: 'Хотын гэрэлтүүлэг',
      description:
        'Үндсэн гудамжуудад энергийн үр ашигтай LED гэрэлтүүлгийн систем нэвтрүүлж, эрчим хүчний зардалд 30 хүртэлх хувийн хэмнэлт авчирсан жишээ төсөл.',
      category: 'Эрчим хүч',
      year: '2025',
      imageUrl: IMG.company2,
      order: 6,
    },
  ]
  for (const p of projects) {
    await db.companyProject.create({ data: { ...p, active: true } })
  }
  console.log(`✅ ТЭМҮҮР: ${projects.length} жишээ төсөл нэмэгдлээ`)

  // ── Хүсэлтүүд (3: шинэ / уншсан / хариулсан) ──
  const inquiries = [
    {
      name: 'Доржням Энхбаяр',
      email: 'dorjnyam@example.com',
      subject: 'Хамтын ажиллагааны санал',
      message:
        'Манай компани аймгийн төвийн замын сүлжээний төсөлд ТЭМҮҮР Групптай хамтран ажиллах саналтай. Утас, имэйлээр холбогдож уулзах боломжоо хэлнэ үү.',
      status: 'шинэ',
    },
    {
      name: 'Ганцэцэг Одсүрэн',
      email: 'gantsetseg@example.com',
      subject: 'Зөвлөх үйлчилгээний хүсэлт',
      message:
        'Ус цэвэршүүлэлтийн байгууламжийн өртгийн тооцоо, техникийн зөвлөх үйлчилгээ авахыг хүсэж байна. Төслийн хэмжээ, хугацааны дэлгэрэнгүйг дараагийн имэйлд хавсаргана.',
      status: 'уншсан',
    },
    {
      name: 'Мөнхбаатар Лхагва',
      email: 'munkhbaatar@example.com',
      subject: 'Тендерийн лавлагаа',
      message:
        'Эрчим хүчний дэд станцын төсөлд оролцох шаардлагатай баримт бичгийн жагсаалт, лавлагаа авахыг хүслээ. Хариултыг имэйлээр хүлээж байна.',
      status: 'хариулсан',
    },
  ]
  for (const i of inquiries) {
    await db.companyInquiry.create({ data: i })
  }
  console.log(`✅ ТЭМҮҮР: ${inquiries.length} жишээ хүсэлт нэмэгдлээ`)
}

async function run(attempt = 1): Promise<void> {
  try {
    await seed()
  } catch (err) {
    const msg = String(err)
    if (attempt < 4 && /locked|timeout|busy/i.test(msg)) {
      console.log(`⏳ Өгөгдлийн сан түгжигдсөн — ${attempt}-р удаа дахин оролдож байна…`)
      await new Promise((r) => setTimeout(r, 1500))
      return run(attempt + 1)
    }
    throw err
  } finally {
    await db.$disconnect()
  }
}

run()
  .then(() => console.log('🎉 ТЭМҮҮР Группын seed дууслаа'))
  .catch((e) => {
    console.error('❌ Seed алдаа:', e)
    process.exit(1)
  })
