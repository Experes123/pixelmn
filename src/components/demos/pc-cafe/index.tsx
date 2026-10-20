'use client'

/**
 * ШОНХОР Gaming Café — Демо 2 (интернет кафе / геймерийн орон зай)
 * Hash router дэд хуудсууд: '' → Нүүр · 'booking' → Захиалга · 'status' → Миний захиалга · 'admin' → Админ
 */

import { useDemoRoute } from '@/lib/hash-router'
import { ReturnToMain } from '@/components/shared/demo-kit'
import { SiteHeader, SiteFooter } from './chrome'
import { HomePage } from './home'
import { BookingPage } from './booking'
import { StatusPage } from './status'
import { AdminPage } from './admin'

export default function PcCafeDemo() {
  const { sub, query } = useDemoRoute('pc-cafe')

  const page = (() => {
    if (sub === 'admin') return <AdminPage />
    if (sub === 'booking') {
      const zoneParam = query.get('zone') ?? undefined
      // Бүсийн параметр өөрчлөгдөхөд урсгалыг цэвэр эхлүүлнэ
      return <BookingPage key={zoneParam ?? ''} initialZone={zoneParam} />
    }
    if (sub === 'status') return <StatusPage />
    return <HomePage />
  })()

  return (
    <div
      className="dark flex min-h-screen flex-col"
      style={{ fontFamily: 'var(--font-inter), sans-serif', background: '#04110B', color: '#E7F5EC' }}
    >
      <ReturnToMain accent="#2CE080" dark />
      {sub === 'admin' ? (
        page
      ) : (
        <>
          <SiteHeader sub={sub} />
          <main className="flex-1">{page}</main>
          <SiteFooter />
        </>
      )}
    </div>
  )
}
