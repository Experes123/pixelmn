import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_COOKIE, checkPassword, createSessionToken, sessionCookieOptions } from '@/lib/auth'

/**
 * POST /api/admin/login — нууц үгээр нэвтэрч, httpOnly сесс cookie тогтооно.
 * Хэт олон оролдлогыг IP-ээр хязгаарлана (10 минут / 6 оролдлого).
 */

const WINDOW_MS = 10 * 60 * 1000
const MAX_ATTEMPTS = 6
const attempts = new Map<string, { count: number; resetAt: number }>()

function clientKey(req: NextRequest): string {
  const fwd = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  return fwd || req.headers.get('x-real-ip') || 'local'
}

function prune(now: number) {
  if (attempts.size < 500) return
  for (const [k, v] of attempts) if (v.resetAt < now) attempts.delete(k)
}

export async function POST(req: NextRequest) {
  const key = clientKey(req)
  const now = Date.now()
  prune(now)

  const rec = attempts.get(key)
  if (rec && rec.resetAt > now && rec.count >= MAX_ATTEMPTS) {
    return NextResponse.json(
      { error: 'Хэт олон оролдлого хийсэн байна. 10 минутын дараа дахин оролдоно уу.' },
      { status: 429 }
    )
  }

  let body: unknown = null
  try {
    body = await req.json()
  } catch {
    body = null
  }
  const password = (body as { password?: unknown } | null)?.password

  if (!checkPassword(password)) {
    attempts.set(
      key,
      rec && rec.resetAt > now
        ? { count: rec.count + 1, resetAt: rec.resetAt }
        : { count: 1, resetAt: now + WINDOW_MS }
    )
    return NextResponse.json({ error: 'Нууц үг буруу байна.' }, { status: 401 })
  }

  attempts.delete(key)
  const res = NextResponse.json({ ok: true })
  res.cookies.set(ADMIN_COOKIE, createSessionToken(), sessionCookieOptions())
  return res
}
