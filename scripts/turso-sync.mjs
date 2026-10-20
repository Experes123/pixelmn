/**
 * ─────────────── Локал SQLite → Turso (cloud) sync ───────────────
 *
 * Локал `db/custom.db`-ийн бүх хүснэгт, өгөгдлийг Turso DB руу хуулна.
 * Зөвхөн ЭХНИЙ удаа (эсвэл санаатайгаар дахин seed хийх үед) ажиллуулна.
 *
 * Ашиглах:
 *   1. Turso дээр DB үүсгээд URL + token авна
 *   2. .env файлд нэмнэ:
 *        TURSO_DATABASE_URL="libsql://<db>-<org>.turso.io"
 *        TURSO_AUTH_TOKEN="<token>"
 *   3. bun run db:turso        (эсвэл: bun run db:turso -- --force)
 *
 * ⚠️  Анхаар: --forceгүйгээр зорилтот DB-д өгөгдөл байвал зогсоно.
 *     --force өгвөл зорилтот DB-ийн бүх хүснэгтийн мөр УСТГАЖ дахин хуулна.
 */
import { execSync } from 'node:child_process'
import { Prisma, PrismaClient } from '@prisma/client'
import { PrismaLibSQL } from '@prisma/adapter-libsql'
import { createClient } from '@libsql/client'

const url = process.env.TURSO_DATABASE_URL?.trim()
const authToken = process.env.TURSO_AUTH_TOKEN?.trim()
const force = process.argv.includes('--force')
// Зөвхөн дотоод туршилтад: file: URL-ийг зөвшөөрнө (scripts test)
const allowFile = process.env.TURSO_TEST === '1'

if (!url || (url.startsWith('file:') && !allowFile)) {
  console.error('\n✗ TURSO_DATABASE_URL тохируулаагүй (эсвэл file: зам байна).')
  console.error('  .env файлд Turso-гийн libsql:// URL-ийг нэмнэ үү.\n')
  process.exit(1)
}

const models = Prisma.dmmf.datamodel.models.map((m) => m.name)
const delegate = (client, name) => client[name.charAt(0).toLowerCase() + name.slice(1)]

const local = new PrismaClient()
const libsql = createClient({ url, authToken })
const remote = new PrismaClient({ adapter: new PrismaLibSQL({ url, authToken }) })

function fmtCounts(counts) {
  return Object.entries(counts)
    .filter(([, n]) => n > 0)
    .map(([m, n]) => `${m}=${n}`)
    .join(', ')
}

try {
  console.log(`\n→ Turso: ${url}`)
  console.log('→ Локал өгөгдлийг уншиж байна…')

  const localData = {}
  const localCounts = {}
  for (const name of models) {
    localData[name] = await delegate(local, name).findMany()
    localCounts[name] = localData[name].length
  }
  console.log(`  Локал: ${fmtCounts(localCounts)}`)

  // ── 1) Схем (idempotent: IF NOT EXISTS) ──
  const rawSql = execSync(
    'npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script',
    { encoding: 'utf8' }
  )
  const schemaSql = rawSql
    .replace(/CREATE TABLE "/g, 'CREATE TABLE IF NOT EXISTS "')
    .replace(/CREATE UNIQUE INDEX "/g, 'CREATE UNIQUE INDEX IF NOT EXISTS "')
    .replace(/CREATE INDEX "/g, 'CREATE INDEX IF NOT EXISTS "')
  await libsql.executeMultiple(schemaSql)
  console.log('✓ Схем бэлэн (CREATE TABLE IF NOT EXISTS)')

  // ── 2) Зорилтот DB-д өгөгдөл байвал хамгаалалт ──
  const remoteCounts = {}
  for (const name of models) {
    remoteCounts[name] = await delegate(remote, name).count()
  }
  const remoteTotal = Object.values(remoteCounts).reduce((a, b) => a + b, 0)
  if (remoteTotal > 0 && !force) {
    console.error(`\n✗ Turso DB-д аль хэдийн ${remoteTotal} мөр байна: ${fmtCounts(remoteCounts)}`)
    console.error('  Дахин хуулах бол --force нэмнэ үү (одоогийн өгөгдөл УСТАНА).\n')
    process.exit(1)
  }

  // ── 3) Хүснэгт бүрийг цэвэрлэж, локал өгөгдлийг хуулна ──
  console.log('→ Хуулж байна…')
  for (const name of models) {
    const model = delegate(remote, name)
    await model.deleteMany()
    const rows = localData[name]
    for (let i = 0; i < rows.length; i += 100) {
      const batch = rows.slice(i, i + 100)
      await model.createMany({ data: batch })
    }
    if (rows.length) console.log(`  ✓ ${name}: ${rows.length}`)
  }

  // ── 4) Баталгаажуулалт ──
  let mismatch = 0
  for (const name of models) {
    const n = await delegate(remote, name).count()
    if (n !== localCounts[name]) {
      mismatch++
      console.error(`  ✗ ${name}: локал ${localCounts[name]} ≠ Turso ${n}`)
    }
  }

  if (mismatch) {
    console.error(`\n✗ ${mismatch} хүснэгт тооцоо таарахгүй байна.\n`)
    process.exit(1)
  }

  console.log('\n✅ Бүх өгөгдөл Turso руу амжилттай хуулагдлаа.')
  console.log(`   Нийт ${Object.values(localCounts).reduce((a, b) => a + b, 0)} мөр.\n`)
} catch (e) {
  console.error('\n✗ Алдаа:', e?.message ?? e)
  process.exitCode = 1
} finally {
  await Promise.allSettled([local.$disconnect(), remote.$disconnect(), libsql.close()])
}
