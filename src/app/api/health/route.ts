import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

/**
 * ───────────────── Deploy healthcheck ─────────────────
 * Апп болон өгөгдлийн сан ажиллаж байгаа эсэхийг шалгана.
 * Docker HEALTHCHECK, load balancer, uptime мониторинг ашиглана.
 * Жишээ: GET /api/health → { "ok": true }
 */
export async function GET() {
  const noStore = { 'Cache-Control': 'no-store' }
  try {
    await db.$queryRaw`SELECT 1`
    return NextResponse.json({ ok: true }, { headers: noStore })
  } catch {
    return NextResponse.json({ ok: false }, { status: 503, headers: noStore })
  }
}
