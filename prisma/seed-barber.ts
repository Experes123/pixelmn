/**
 * ГАН Barbershop — демо өгөгдөл бэлтгэх скрипт.
 * Ажиллуулах: bun prisma/seed-barber.ts
 *
 * 12 үйлчилгээ, 4 залаач, 7 жишээ захиалга (холилдсон төлөвтэй).
 * SQLite lock гарвал 3 хүртэл дахин оролдоно.
 */

import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

// ── Огнооны туслах функцууд ──
const dateToStr = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

const todayStr = () => dateToStr(new Date())

const addDays = (days: number) => {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return dateToStr(d)
}

async function seed() {
  console.log('→ Хуучин ГАН өгөгдлийг цэвэрлэж байна…')
  await db.barberBooking.deleteMany()
  await db.barberService.deleteMany()
  await db.barber.deleteMany()

  // ── Үйлчилгээүүд (12) ──
  console.log('→ Үйлчилгээүүдийг нэмж байна…')
  const services = await Promise.all(
    [
      {
        name: 'Классик засал',
        category: 'үс',
        price: 25000,
        durationMin: 30,
        description: 'Сонгодог хэв маягийн үс засалт — зөвлөгөө, угаалт, загварчлал багтана.',
      },
      {
        name: 'Модерн фейд засал',
        category: 'үс',
        price: 28000,
        durationMin: 40,
        description: 'Нарийвчилсан фейд техникээр шилжүүлэг хийсэн орчин үеийн засалт.',
      },
      {
        name: 'Усанд оруулж засах',
        category: 'үс',
        price: 30000,
        durationMin: 45,
        description: 'Халуун усанд оруулж, зөөлрүүлсний дараа гүнзгий зассан нарийвчилсан үйлчилгээ.',
      },
      {
        name: 'Хүүхдийн засал',
        category: 'үс',
        price: 18000,
        durationMin: 25,
        description: '12 хүртэлх насны хүүхдэд зориулсан түрэмгий бус, найрсаг засалт.',
      },
      {
        name: 'Өнгө будалт',
        category: 'үс',
        price: 45000,
        durationMin: 75,
        description: 'Эрэгтэй үсний байгалийн өнгө сэргээх, эсвэл акцент будалт.',
      },
      {
        name: 'Сахлис зассан',
        category: 'сахлис',
        price: 15000,
        durationMin: 20,
        description: 'Хутгаар хийсэн уламжлалт сахлис засалт — халуун алчуур, бүрэн арчилгаа.',
      },
      {
        name: 'Сахлис хэлбэржүүлэлт',
        category: 'сахлис',
        price: 12000,
        durationMin: 15,
        description: 'Машин, түүнчлэн хутгатай нарийвчилсан сахлисны хэлбэр засалт.',
      },
      {
        name: 'Үс + сахлис хосолсон',
        category: 'хосолсон',
        price: 35000,
        durationMin: 50,
        description: 'Бүрэн хэв маягийн пакет — үс засалт болон сахлисны засалт хамт.',
      },
      {
        name: 'Их заслын пакет',
        category: 'хосолсон',
        price: 42000,
        durationMin: 60,
        description: 'Үс, сахлис, шээс болон арьсны хурдан арчилгаа багтсан бүрэлдэхүүн үйлчилгээ.',
      },
      {
        name: 'Шээс арчилгаа',
        category: 'арчилгаа',
        price: 12000,
        durationMin: 15,
        description: 'Шээсний хэлбэр засалт, тослох болон зөөлрүүлэх үйлчилгээ.',
      },
      {
        name: 'Эрэгтэй арьс арчилгаа',
        category: 'арчилгаа',
        price: 20000,
        durationMin: 30,
        description: 'Цэвэрлэгээ, peeling болон чийгшүүлэгч бүхий эрэгтэй арьсны гүн арчилгаа.',
      },
      {
        name: 'Стиль загварчлал',
        category: 'арчилгаа',
        price: 10000,
        durationMin: 15,
        description: 'Онцгой өдрүүдэд зориулсан бүтээгдэхүүнтэй гарын авлага бүхий загварчлал.',
      },
    ].map((s) => db.barberService.create({ data: { ...s, active: true } }))
  )
  const svc = (name: string) => services.find((s) => s.name === name)!

  // ── Залаачид (4) ──
  console.log('→ Залаачдыг нэмж байна…')
  const barbers = await Promise.all([
    db.barber.create({
      data: {
        name: 'Батбаяр Дорж',
        title: 'Ахлах залаач',
        bio: '15 жилийн туршлагатай, Лондонгийн барберын сургуулийн дипломтай. Классик хутганы урлагийн мастер.',
        specialties: 'Классик засалт, Хутганы урлаг, Халуун алчуур',
        imageUrl:
          'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/68513c0c301a.jpeg',
        active: true,
      },
    }),
    db.barber.create({
      data: {
        name: 'Ганбаяр Сэрээтэр',
        title: 'Мэргэжлийн залаач',
        bio: 'Фейд, тейпер загваруудын нэгдүгээр залуу. Сүүлийн үеийн хэв маягийг хамгийн сайн мэддэг.',
        specialties: 'Фейд, Тейпер, Модерн засалт',
        imageUrl:
          'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/e066d713f3f2.jpg',
        active: true,
      },
    }),
    db.barber.create({
      data: {
        name: 'Мөнх-Эрдэнэ Лхагва',
        title: 'Сахлисны мастер',
        bio: 'Уламжлалт сахлисны урлагийг 12 жил сурч мэргэшсэн. Арьсны арчилгааны зөвлөгөө өгдөг.',
        specialties: 'Сахлис, Арьс арчилгаа, Шээс',
        imageUrl:
          'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/6b44f125712f.jpg',
        active: true,
      },
    }),
    db.barber.create({
      data: {
        name: 'Тэмүүлэн Батсайхан',
        title: 'Залуу залаач',
        bio: 'Сүүлийн үеийн трендийг дагадаг, хүүхдийн засалтад онцгой сайн. Хурдан, үнэн зөв ажилладаг.',
        specialties: 'Хүүхдийн засалт, Стиль загварчлал, Будалт',
        imageUrl:
          'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/a1638df3b701.jpg',
        active: true,
      },
    }),
  ])
  const bar = (name: string) => barbers.find((b) => b.name.startsWith(name))!

  // ── Жишээ захиалгууд (7) ──
  console.log('→ Жишээ захиалгуудыг нэмж байна…')
  await Promise.all([
    db.barberBooking.create({
      data: {
        serviceId: svc('Классик засал').id,
        serviceName: 'Классик засал',
        barberId: bar('Батбаяр').id,
        barberName: bar('Батбаяр').name,
        date: addDays(1),
        time: '11:00',
        customerName: 'Доржсүрэн Бат',
        phone: '99112211',
        email: 'dorjsuren@example.com',
        notes: 'Хажуу талаа богино хийнэ үү.',
        status: 'баталгаажсан',
        paymentStatus: 'төлөгдсөн',
        totalAmount: 25000,
      },
    }),
    db.barberBooking.create({
      data: {
        serviceId: svc('Үс + сахлис хосолсон').id,
        serviceName: 'Үс + сахлис хосолсон',
        barberId: bar('Мөнх-Эрдэнэ').id,
        barberName: bar('Мөнх-Эрдэнэ').name,
        date: addDays(1),
        time: '15:30',
        customerName: 'Энхжин Од',
        phone: '88112334',
        email: null,
        notes: null,
        status: 'баталгаажсан',
        paymentStatus: 'төлөгдсөн',
        totalAmount: 35000,
      },
    }),
    db.barberBooking.create({
      data: {
        serviceId: svc('Сахлис зассан').id,
        serviceName: 'Сахлис зассан',
        barberId: bar('Ганбаяр').id,
        barberName: bar('Ганбаяр').name,
        date: addDays(2),
        time: '13:00',
        customerName: 'Гантулга Цэрэн',
        phone: '95113456',
        email: 'gantulga@example.com',
        notes: null,
        status: 'хүлээгдэж буй',
        paymentStatus: 'төлөгдөөгүй',
        totalAmount: 15000,
      },
    }),
    db.barberBooking.create({
      data: {
        serviceId: svc('Усанд оруулж засах').id,
        serviceName: 'Усанд оруулж засах',
        barberId: bar('Батбаяр').id,
        barberName: bar('Батбаяр').name,
        date: addDays(3),
        time: '16:00',
        customerName: 'Билгүүн Мөнх',
        phone: '90114567',
        email: null,
        notes: 'Урт үстэй тул анхааралтай.',
        status: 'баталгаажсан',
        paymentStatus: 'төлөгдсөн',
        totalAmount: 30000,
      },
    }),
    db.barberBooking.create({
      data: {
        serviceId: svc('Өнгө будалт').id,
        serviceName: 'Өнгө будалт',
        barberId: bar('Тэмүүлэн').id,
        barberName: bar('Тэмүүлэн').name,
        date: addDays(5),
        time: '12:00',
        customerName: 'Наранцэцэг Даш',
        phone: '86115678',
        email: 'narantsetseg@example.com',
        notes: 'Хүүгээ авчирна.',
        status: 'хүлээгдэж буй',
        paymentStatus: 'төлөгдөөгүй',
        totalAmount: 45000,
      },
    }),
    db.barberBooking.create({
      data: {
        serviceId: svc('Модерн фейд засал').id,
        serviceName: 'Модерн фейд засал',
        barberId: bar('Ганбаяр').id,
        barberName: bar('Ганбаяр').name,
        date: todayStr(),
        time: '10:30',
        customerName: 'Сүхбаатар Лувсан',
        phone: '99116789',
        email: null,
        notes: null,
        status: 'дууссан',
        paymentStatus: 'төлөгдсөн',
        totalAmount: 28000,
      },
    }),
    db.barberBooking.create({
      data: {
        serviceId: svc('Эрэгтэй арьс арчилгаа').id,
        serviceName: 'Эрэгтэй арьс арчилгаа',
        barberId: bar('Мөнх-Эрдэнэ').id,
        barberName: bar('Мөнх-Эрдэнэ').name,
        date: addDays(-1),
        time: '14:00',
        customerName: 'Тэмүүжин Хулан',
        phone: '80117890',
        email: 'temuujin@example.com',
        notes: 'Арьс мэдрэг тул зөөлөн бүтээгдэхүүн хэрэглэнэ үү.',
        status: 'цуцлагдсан',
        paymentStatus: 'буцаагдсан',
        totalAmount: 20000,
      },
    }),
  ])

  console.log('✓ ГАН Barbershop seed дууслаа:')
  console.log(`  — ${services.length} үйлчилгээ`)
  console.log(`  — ${barbers.length} залаач`)
  console.log('  — 7 жишээ захиалга')
}

async function run() {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      await seed()
      return
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      const isLock = msg.toLowerCase().includes('lock') || msg.includes('SQLITE_BUSY')
      if (attempt === 3 || !isLock) throw err
      console.warn(`SQLite busy/lock (${attempt}/3) — 1.5 секийн дараа дахин оролдож байна…`)
      await new Promise((r) => setTimeout(r, 1500))
    }
  }
}

run()
  .catch((e) => {
    console.error('✗ Seed алдаа:', e)
    process.exitCode = 1
  })
  .finally(async () => {
    await db.$disconnect()
  })
