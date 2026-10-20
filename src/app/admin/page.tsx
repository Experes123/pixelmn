import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { ADMIN_COOKIE, isAdminCookieValue } from '@/lib/auth'
import { AdminLogin } from '@/components/agency/admin-login'
import { MainAdmin } from '@/components/agency/main-admin'

/**
 * ───────────────── Хамгаалагдсан админ панель ─────────────────
 * Сервер талд сесс cookie-г шалгана:
 *  · хүчинтэй  → бүрэн админ панель (MainAdmin)
 *  · хүчингүй → нууц үгийн нэвтрэх хуудас (AdminLogin)
 * Бичих бүх API дуудлага мөн адил сессийг шаардана (src/lib/auth.ts).
 */

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Админ панель · Pixelmn',
  robots: { index: false, follow: false },
}

export default async function AdminPage() {
  const jar = await cookies()
  const authed = isAdminCookieValue(jar.get(ADMIN_COOKIE)?.value)
  return authed ? <MainAdmin /> : <AdminLogin />
}
