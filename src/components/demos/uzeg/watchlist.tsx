'use client'

/**
 * ҮЗЭГ — Миний жагсаалт: localStorage (uzeg-watchlist)-д хадгалсан контентууд
 */

import { useMemo } from 'react'
import { BookmarkX } from 'lucide-react'
import { useApi } from '@/lib/use-api'
import { navigate } from '@/lib/hash-router'
import { Button } from '@/components/ui/button'
import { EmptyState, LoadingState } from '@/components/shared/admin-kit'
import { PageHead } from './chrome'
import { BTN_ACCENT, TitleCard, useWatchlist, type StreamTitle } from './shared'

export function WatchlistPage() {
  const { data, loading } = useApi<StreamTitle>('stream-titles')
  const { ids, ready, remove } = useWatchlist()

  // Жагсаалтын дарааллыг (сүүлд нэмэгдсэн нь сүүлд) хадгална
  const items = useMemo(() => {
    const map = new Map(data.map((t) => [t.id, t]))
    return ids.map((id) => map.get(id)).filter((t): t is StreamTitle => Boolean(t))
  }, [data, ids])

  const showLoading = !ready || (loading && data.length === 0)

  return (
    <div>
      <PageHead
        title="Миний жагсаалт"
        description="Хадгалсан контентууд — жагсаалт нь таны төхөөрөмжид локал хадгалагдана (демо горим)."
      >
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-[#F5E8EB]/70">
          {items.length} контент
        </span>
      </PageHead>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {showLoading ? (
          <LoadingState label="Жагсаалт ачаалж байна…" />
        ) : items.length === 0 ? (
          <EmptyState
            icon={<BookmarkX className="h-5 w-5 text-muted-foreground" />}
            title="Жагсаалт хоосон байна"
            description="Кино, цувралаа жагсаалтад нэмээрэй — дараа нь эндээс хялбархан олж үзнэ."
            action={
              <Button className={BTN_ACCENT} onClick={() => navigate('/demo/uzeg/browse')}>
                Нээлт рүү очих
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
            {items.map((t) => (
              <TitleCard
                key={t.id}
                t={t}
                onRemove={() => remove(t.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
