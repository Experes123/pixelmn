'use client'

/**
 * ҮЗЭГ Стриминг — Демо 5 (премиум стриминг платформын интерфейс, Монгол хэлээр)
 * Hash router дэд хуудсууд:
 *   '' → Нүүр · 'browse' → Нээлт · 'title?id=' → Кинод дэлгэрэнгүй
 *   'watch?id=' → Үзэх · 'watchlist' → Миний жагсаалт · 'plans' → Багц · 'admin' → Админ
 */

import { useDemoRoute } from '@/lib/hash-router'
import { ReturnToMain } from '@/components/shared/demo-kit'
import { Toaster } from '@/components/ui/sonner'
import { SiteHeader, SiteFooter } from './chrome'
import { HomePage } from './home'
import { BrowsePage } from './browse'
import { TitlePage } from './title'
import { WatchPage } from './watch'
import { WatchlistPage } from './watchlist'
import { PlansPage } from './plans'
import { AdminPage } from './admin'
import { ACCENT, BG, TEXT } from './shared'

export default function UzegDemo() {
  const { sub, query } = useDemoRoute('uzeg')

  const titleId = query.get('id')
  const page = (() => {
    if (sub === 'admin') return <AdminPage />
    if (sub === 'browse') {
      const type = query.get('type') ?? undefined
      const q = query.get('q') ?? undefined
      return <BrowsePage key={`browse-${type ?? ''}-${q ?? ''}`} initialType={type} initialQuery={q} />
    }
    if (sub === 'title') return <TitlePage key={`title-${titleId ?? 'none'}`} id={titleId} />
    if (sub === 'watch') return <WatchPage key={`watch-${titleId ?? 'none'}`} id={titleId} />
    if (sub === 'watchlist') return <WatchlistPage />
    if (sub === 'plans') return <PlansPage />
    return <HomePage />
  })()

  return (
    <div
      className="dark flex min-h-screen flex-col"
      style={{ fontFamily: 'var(--font-inter), sans-serif', background: BG, color: TEXT }}
    >
      <ReturnToMain accent={ACCENT} dark />
      {sub === 'admin' ? (
        page
      ) : (
        <>
          <SiteHeader sub={sub} />
          <main className="flex-1">{page}</main>
          <SiteFooter />
        </>
      )}
      <Toaster position="top-center" richColors theme="dark" />
    </div>
  )
}
