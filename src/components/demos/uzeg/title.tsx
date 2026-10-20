'use client'

/**
 * ҮЗЭГ — Кинод дэлгэрэнгүй: постер + мэдээлэл, жагсаалтад нэмэх/хасах, ижил төстэй мөр
 */

import { useMemo, useState } from 'react'
import { Play, Plus, Check, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { useApi } from '@/lib/use-api'
import { navigate, DemoLink } from '@/lib/hash-router'
import { Button } from '@/components/ui/button'
import { EmptyState, LoadingState } from '@/components/shared/admin-kit'
import {
  BTN_ACCENT,
  BTN_GHOST,
  MetaChip,
  RatingBadge,
  ContentRow,
  fontDisplay,
  useWatchlist,
  type StreamTitle,
} from './shared'

export function TitlePage({ id }: { id: string | null }) {
  const { data, loading } = useApi<StreamTitle>('stream-titles')
  const watchlist = useWatchlist()

  const titles = useMemo(() => data.filter((t) => t.active), [data])
  const t = useMemo(() => titles.find((x) => x.id === id) ?? null, [titles, id])

  const similar = useMemo(() => {
    if (!t) return []
    const sameGenre = titles.filter((x) => x.id !== t.id && x.genre === t.genre)
    const sameType = titles.filter(
      (x) => x.id !== t.id && x.type === t.type && x.genre !== t.genre
    )
    return [...sameGenre, ...sameType].slice(0, 10)
  }, [titles, t])

  if (loading && !t) return <LoadingState label="Контент ачаалж байна…" />

  if (!t) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <EmptyState
          title="Агуулга олдсонгүй"
          description="Холбоос буруу эсвэл контент устгагдсан байж болно (демо өгөгдөл)."
          action={
            <Button className={BTN_ACCENT} onClick={() => navigate('/demo/uzeg/browse')}>
              Нээлт рүү очих
            </Button>
          }
        />
      </div>
    )
  }

  const inList = watchlist.has(t.id)

  const toggleList = () => {
    const was = inList
    watchlist.toggle(t.id)
    if (was) toast(`«${t.title}» жагсаалтаас хасагдлаа`)
    else toast.success(`«${t.title}» жагсаалтад нэмэгдлээ`)
  }

  return (
    <div>
      {/* Бэкдроп баннер */}
      <div className="relative h-56 overflow-hidden sm:h-72" aria-hidden>
        {t.backdropUrl ? (
          <img src={t.backdropUrl} alt="" loading="lazy" className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full" style={{ background: t.posterGradient }} />
        )}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(14,5,8,0.55) 0%, rgba(14,5,8,0.35) 45%, #0E0508 100%)',
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <DemoLink
          href="/demo/uzeg/browse"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-[#F5E8EB]/65 transition-colors hover:text-[#FF3D5A]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Нээлт рүү буцах
        </DemoLink>

        <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
          {/* Постер */}
          <div className="mx-auto w-[240px] sm:w-[280px] lg:mx-0 lg:w-full">
            <div
              className="aspect-[2/3] w-full overflow-hidden rounded-xl border border-white/15 shadow-[0_0_50px_rgba(255,61,90,0.22)]"
              style={{ background: t.posterGradient }}
            >
              <div className="relative h-full w-full">
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="text-xl leading-snug text-white" style={fontDisplay}>
                    {t.title}
                  </p>
                  <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-white/75">
                    {t.genre} · {t.year}
                  </p>
                </div>
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/70"
                />
              </div>
            </div>
          </div>

          {/* Мэдээлэл */}
          <div>
            <h1 className="text-2xl font-extrabold text-white sm:text-4xl" style={fontDisplay}>
              {t.title}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <MetaChip accent={t.isNew}>{t.isNew ? 'Шинэ' : t.type === 'кино' ? 'Кино' : t.type === 'цуврал' ? 'Цуврал' : 'Баримтат'}</MetaChip>
              <MetaChip>{t.genre}</MetaChip>
              <MetaChip>{t.year}</MetaChip>
              <MetaChip>{t.duration}</MetaChip>
              <RatingBadge value={t.rating} className="ml-1 text-base" />
            </div>

            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-[#F5E8EB]/85 sm:text-base">
              {t.description}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button size="lg" className={BTN_ACCENT} onClick={() => navigate(`/demo/uzeg/watch?id=${t.id}`)}>
                <Play className="mr-2 h-5 w-5 fill-white" aria-hidden />
                Үзэх
              </Button>
              <Button
                size="lg"
                variant="outline"
                className={BTN_GHOST}
                onClick={toggleList}
                aria-pressed={inList}
              >
                {inList ? (
                  <>
                    <Check className="mr-2 h-5 w-5 text-[#FF3D5A]" aria-hidden />
                    Жагсаалтаас хасах
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-5 w-5" aria-hidden />
                    Жагсаалтад нэмэх
                  </>
                )}
              </Button>
            </div>

            <p className="mt-5 text-xs text-[#F5E8EB]/45">
              Жагсаалт нь таны төхөөрөмжид локал хадгалагдана (демо горим).
            </p>
          </div>
        </div>

        {/* Ижил төстэй */}
        {similar.length > 0 && (
          <div className="-mx-4 sm:-mx-6 lg:-mx-8">
            <ContentRow title="Ижил төстэй" items={similar} moreHref="/demo/uzeg/browse" />
          </div>
        )}
        <div className="h-6" aria-hidden />
      </div>
    </div>
  )
}
