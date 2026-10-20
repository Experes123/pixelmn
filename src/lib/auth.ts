import { createHmac, timingSafeEqual } from 'node:crypto'
import type { NextRequest } from 'next/server'

/**
 * ───────────────── Админ сесс (сервер тал) ─────────────────
 * /admin панел болон бүх бичих API хүсэлтүүдийг хамгаална.
 * Сесс нь HMAC-SHA256 гарын үсэгтэй, зөвхөн httpOnly cookie-д хадгалагдана.
 * ADMIN_PASSWORD, ADMIN_SECRET нь .env-ээс уншигдана.
 */

export const ADMIN_COOKIE = 'px_admin'
const SESSION_TTL_SEC = 60 * 60 * 12 // 12 цаг

function getSecret(): string {
  return process.env.ADMIN_SECRET ?? ''
}

/** exp цагийн тэмдэгтийг гарын үсэглэнэ */
function sign(payload: string): string {
  return createHmac('sha256', getSecret()).update(payload).digest('hex')
}

/** Шинэ сесс токен үүсгэнэ: "<exp>.<hmac>" */
export function createSessionToken(now = Date.now()): string {
  const exp = Math.floor(now / 1000) + SESSION_TTL_SEC
  return `${exp}.${sign(String(exp))}`
}

/** Токены хүчинтэй эсэхийг шалгана (гарын үсэг + хугацаа) */
export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token || !getSecret()) return false
  const dot = token.indexOf('.')
  if (dot <= 0) return false
  const expStr = token.slice(0, dot)
  const sig = token.slice(dot + 1)
  const exp = Number(expStr)
  if (!Number.isFinite(exp) || exp * 1000 < Date.now()) return false
  const expected = sign(expStr)
  if (expected.length !== sig.length) return false
  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(sig))
  } catch {
    return false
  }
}

/** Нууц үгийг тогтмол хугацаанд харьцуулна */
export function checkPassword(input: unknown): boolean {
  const pw = process.env.ADMIN_PASSWORD
  if (!pw || typeof input !== 'string' || input.length === 0) return false
  const a = Buffer.from(pw)
  const b = Buffer.from(input)
  if (a.length !== b.length) return false
  try {
    return timingSafeEqual(a, b)
  } catch {
    return false
  }
}

/** Server component / route handler-с cookie уншиж админ эсэхийг шалгана */
export function isAdminCookieValue(value: string | undefined): boolean {
  return verifySessionToken(value)
}

/** NextRequest-с админ эрхтэй эсэхийг шалгана */
export function isAdminRequest(req: NextRequest): boolean {
  return verifySessionToken(req.cookies.get(ADMIN_COOKIE)?.value)
}

/** Cookie-ийн тохиргоо — production-д secure */
export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: SESSION_TTL_SEC,
    secure: process.env.NODE_ENV === 'production',
  }
}
