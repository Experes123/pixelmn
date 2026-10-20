import { NextResponse } from 'next/server'
import { ADMIN_COOKIE, sessionCookieOptions } from '@/lib/auth'

/** POST /api/admin/logout — сесс cookie-г устгана */
export async function POST() {
  const res = NextResponse.json({ ok: true })
  res.cookies.set(ADMIN_COOKIE, '', { ...sessionCookieOptions(), maxAge: 0 })
  return res
}
