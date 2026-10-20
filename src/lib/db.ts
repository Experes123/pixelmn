import { PrismaClient } from '@prisma/client'
import { PrismaLibSQL } from '@prisma/adapter-libsql'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

/**
 * ─────────────── Өгөгдлийн сангийн холболт ───────────────
 *
 * Local хөгжүүлэлт:
 *   TURSO_DATABASE_URL тохируулаагүй үед ердийн SQLite файл
 *   (DATABASE_URL=file:../db/custom.db) ашиглана.
 *
 * Production (Netlify):
 *   Netlify Functions-ийн файлын систем түр зуурын тул SQLite файл
 *   хадгалагдахгүй. Тиймээс Turso (libSQL) cloud DB ашиглана:
 *   TURSO_DATABASE_URL=libsql://<db>-<org>.turso.io
 *   TURSO_AUTH_TOKEN=<token>
 *
 * Хоёр тохиолдолд ч Prisma-гийн дуудалт (db.inquiry.findMany() гэх мэт)
 * яг ижил хэвээр — зөвхөн холболтын адаптер өөрчлөгдөнө.
 */
const tursoUrl = process.env.TURSO_DATABASE_URL?.trim()

const adapter = tursoUrl
  ? new PrismaLibSQL({
      url: tursoUrl,
      authToken: process.env.TURSO_AUTH_TOKEN?.trim(),
    })
  : undefined

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    ...(adapter ? { adapter } : {}),
    // Query лог нь зөвхөн хөгжүүлэлтийн үед — production дээр лог дүүрэхгүй
    log: process.env.NODE_ENV === 'production' ? ['error'] : ['query'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
