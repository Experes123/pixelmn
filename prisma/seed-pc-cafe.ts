/**
 * ШОНХОР Gaming Café — демо өгөгдөл (Демо 2)
 * Ажиллуулах: bun prisma/seed-pc-cafe.ts
 *
 * PcStation (14 суудал) + PcBooking (6 жишээ захиалга) — өмнөх өгөгдлийг бүрэн устгаад дахин үүсгэнэ.
 */

import { db } from '../src/lib/db'

type StationSeed = {
  name: string
  zone: string
  cpu: string
  gpu: string
  ram: string
  extras: string | null
  pricePerHour: number
  status: string
  active: boolean
}

type BookingSeed = {
  stationName: string
  zone: string
  date: string
  startTime: string
  hours: number
  customerName: string
  phone: string
  status: string
  paymentStatus: string
  totalAmount: number
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

function isoDay(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

async function main() {
  console.log('⟳ ШОНХОР Gaming Café seed эхэлж байна…')

  // 1) Хуучин демо өгөгдлийг цэвэрлэх
  await db.pcBooking.deleteMany()
  await db.pcStation.deleteMany()

  // 2) 14 суудал: Стандарт(6) · VIP(5) · Консоль(3)
  const stations: StationSeed[] = [
    // Стандарт — i5-13400F / RTX 4060 / 16GB / 180Hz — 3,000₮
    ...Array.from({ length: 6 }, (_, i): StationSeed => ({
      name: `S-${String(i + 1).padStart(2, '0')}`,
      zone: 'Стандарт',
      cpu: 'Intel Core i5-13400F',
      gpu: 'NVIDIA GeForce RTX 4060 8GB',
      ram: '16GB DDR5 5600MHz',
      extras: '24 инч 180Hz монитор · механик гар',
      pricePerHour: 3000,
      status: i === 2 ? 'эзлэгдсэн' : 'боломжтой', // S-03 эзлэгдсэн
      active: true,
    })),
    // VIP — i7-14700K / RTX 4070 Ti / 32GB / 240Hz + премиум сандал — 5,500₮
    ...Array.from({ length: 5 }, (_, i): StationSeed => ({
      name: `V-${String(i + 1).padStart(2, '0')}`,
      zone: 'VIP',
      cpu: 'Intel Core i7-14700K',
      gpu: 'NVIDIA GeForce RTX 4070 Ti 12GB',
      ram: '32GB DDR5 6000MHz',
      extras: '27 инч 240Hz монитор · премиум сандал · чимээ гоожуулсан бүс',
      pricePerHour: 5500,
      status: i === 1 ? 'эзлэгдсэн' : 'боломжтой', // V-02 эзлэгдсэн
      active: true,
    })),
    // Консоль — PS5 / 65" ТВ / хоёр гар — 4,000₮
    ...Array.from({ length: 3 }, (_, i): StationSeed => ({
      name: `C-${String(i + 1).padStart(2, '0')}`,
      zone: 'Консоль',
      cpu: 'PlayStation 5 (Disc Edition)',
      gpu: '65 инч 4K HDR телевиз',
      ram: 'Хоёр DualSense гар',
      extras: 'Тав тухтай диван · хүйтэн уух зүйлийн ширээ',
      pricePerHour: 4000,
      status: i === 1 ? 'засварт' : 'боломжтой', // C-02 засварт
      active: true,
    })),
  ]

  const created = [] as { id: string; name: string }[]
  for (const s of stations) {
    const rec = await withRetry(() => db.pcStation.create({ data: s }))
    created.push({ id: rec.id, name: rec.name })
  }
  const idOf = (name: string) => created.find((c) => c.name === name)?.id ?? null

  // 3) 6 жишээ захиалга — өнөөдөр / маргааш, холимог төлөв
  const today = isoDay(new Date())
  const tomorrow = isoDay(new Date(Date.now() + 24 * 60 * 60 * 1000))

  const bookings: (BookingSeed & { stationId: string | null })[] = [
    { stationId: idOf('S-03'), stationName: 'S-03', zone: 'Стандарт', date: today, startTime: '10:00', hours: 3, customerName: 'Батбаяр Дорж', phone: '99112233', status: 'идэвхтэй', paymentStatus: 'төлөгдсөн', totalAmount: 9000 },
    { stationId: idOf('V-02'), stationName: 'V-02', zone: 'VIP', date: today, startTime: '14:00', hours: 3, customerName: 'Энхжин Сүхбаатар', phone: '88112456', status: 'идэвхтэй', paymentStatus: 'төлөгдсөн', totalAmount: 16500 },
    { stationId: idOf('S-02'), stationName: 'S-02', zone: 'Стандарт', date: today, startTime: '18:00', hours: 4, customerName: 'Тэмүүлэн Мөнх', phone: '95119988', status: 'идэвхтэй', paymentStatus: 'төлөгдөөгүй', totalAmount: 12000 },
    { stationId: idOf('C-01'), stationName: 'C-01', zone: 'Консоль', date: today, startTime: '12:00', hours: 2, customerName: 'Анар Ганбат', phone: '90154477', status: 'дууссан', paymentStatus: 'төлөгдсөн', totalAmount: 8000 },
    { stationId: idOf('V-03'), stationName: 'V-03', zone: 'VIP', date: tomorrow, startTime: '16:00', hours: 5, customerName: 'Мөнхцэцэг Жаргал', phone: '99083211', status: 'идэвхтэй', paymentStatus: 'төлөгдсөн', totalAmount: 27500 },
    { stationId: idOf('S-05'), stationName: 'S-05', zone: 'Стандарт', date: tomorrow, startTime: '11:00', hours: 2, customerName: 'Доржгот Батаа', phone: '85167700', status: 'цуцлагдсан', paymentStatus: 'төлөгдөөгүй', totalAmount: 6000 },
  ]

  for (const b of bookings) {
    await withRetry(() => db.pcBooking.create({ data: b }))
  }

  console.log(`✓ ШОНХОР: ${created.length} суудал, ${bookings.length} захиалга үүсгэгдлээ.`)
  console.log(`  Өнөөдөр: ${today} · Маргааш: ${tomorrow}`)
}

main()
  .catch((e) => {
    console.error('✗ Seed алдаа:', e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
