'use client'

/**
 * ҮЗЭГ — Нүүр хуудас: featured hero (бэкдроп зураг) + төрөл/жанрын хэвтээ мөрүүд
 */

import { useMemo } from 'react'
import { Play, Plus, Check, AlertTriangle, Info } from 'lucide-react'
import { toast } from 'sonner'
import { useApi } from '@/lib/use-api'
import { navigate } from '@/lib/hash-router'
import { Button } from '@/components/ui/button'
import { LoadingState } from '@/components/shared/admin-kit'
import {
  ACCENT,
  BTN_ACCENT,
  BTN_GHOST,
  MetaChip,
  RatingBadge,
  ContentRow,
  TitleCard,
  fontDisplay,
  useWatchProgress,
  useWatchlist,
  type StreamTitle,
} from './shared'

export function HomePage() {
  const { data, loading, error, reload } = useApi<StreamTitle>('stream-titles')
  const watchlist = useWatchlist()
  const { map: progressMap, remove: removeProgress } = useWatchProgress()

  const titles = useMemo(() => data.filter((t) => t.active), [data])
  const featured = useMemo(() => titles.find((t) => t.featured) ?? titles[0], [titles])

  // Үргэлжлүүлж үзэх: 2–95% үзсэн, саяхан үзсэн дарааллаар
  const continueItems = useMemo(() => {
    return Object.entries(progressMap)
      .filter(([, v]) => v.pct > 2 && v.pct < 95)
      .sort((a, b) => b[1].at - a[1].at)
      .map(([id]) => titles.find((t) => t.id === id))
      .filter((t): t is StreamTitle => Boolean(t))
      .slice(0, 10)
  }, [progressMap, titles])

  const rows = useMemo(() => {
    const byType = (type: string) => titles.filter((t) => t.type === type)
    const groups: Record<string, StreamTitle[]> = {}
    for (const t of titles) {
      if (!groups[t.genre]) groups[t.genre] = []
      groups[t.genre].push(t)
    }
    const genreRows = Object.entries(groups)
      .filter(([, arr]) => arr.length >= 2)
      .map(([genre, arr]) => ({ genre, arr }))
    const top = [...titles].sort((a, b) => b.rating - a.rating).slice(0, 10)
    return { fresh: titles.filter((t) => t.isNew), byType, genreRows, top }
  }, [titles])

  const toggleList = (t: StreamTitle) => {
    const inList = watchlist.has(t.id)
    watchlist.toggle(t.id)
    if (inList) toast(`«${t.title}» жагсаалтаас хасагдлаа`)
    else toast.success(`«${t.title}» жагсаалтад нэмэгдлээ`)
  }

  // «Үргэлжлүүлж үзэх» мөрөөс хасах — үзэх явцыг цэвэрлэнэ
  const removeContinue = (t: StreamTitle) => {
    removeProgress(t.id)
    toast(`«${t.title}» үргэлжлүүлж үзэх мөрөөс хасагдлаа`)
  }

  if (loading && titles.length === 0) {
    return (
      <div className="min-h-[70vh] animate-pulse bg-[#1A0B12]" aria-hidden>
        <div className="mx-auto flex h-[70vh] max-w-7xl items-end px-4 pb-16 sm:px-6 lg:px-8">
          <div className="w-full max-w-xl space-y-4">
            <div className="h-6 w-32 rounded-full bg-white/10" />
            <div className="h-12 w-3/4 rounded-lg bg-white/10" />
            <div className="h-4 w-1/2 rounded bg-white/10" />
            <div className="h-10 w-56 rounded-lg bg-white/10" />
          </div>
        </div>
      </div>
    )
  }

  if (error && titles.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <AlertTriangle className="h-8 w-8 text-[#FF3D5A]" aria-hidden />
        <p className="text-sm text-[#F5E8EB]/80">{error}</p>
        <Button variant="outline" className={BTN_GHOST} onClick={reload}>
          Дахин оролдох
        </Button>
      </div>
    )
  }

  if (!featured) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <p className="text-sm text-[#F5E8EB]/60">
          Одоогоор контент бүртгэгдээгүй байна (демо өгөгдөл seed хийгдээгүй байж болно).
        </p>
      </div>
    )
  }

  const inList = watchlist.has(featured.id)
  const backdrop = featured.backdropUrl

  return (
    <div>
      {/* ─── HERO ─── */}
      <section className="relative min-h-[78vh] overflow-hidden" aria-label="Онцлох контент">
        {backdrop ? (
          <img
            src={backdrop}
            alt=""
            loading="eager"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0" style={{ background: featured.posterGradient }} />
        )}
        {/* Хүнд градиент давхаргууд — баруун тийш + доош */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, rgba(14,5,8,0.96) 0%, rgba(14,5,8,0.78) 38%, rgba(14,5,8,0.25) 72%, rgba(14,5,8,0.05) 100%)',
          }}
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-40"
          style={{ background: 'linear-gradient(180deg, transparent, #0E0508)' }}
        />

        <div className="relative mx-auto flex min-h-[78vh] max-w-7xl items-end px-4 pb-14 pt-40 sm:px-6 lg:px-8">
          <div className="max-w-2xl animate-fade-up">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {featured.isNew && (
                <span
                  className="rounded-full px-2.5 py-1 text-[11px] font-bold tracking-widest text-white"
                  style={{ background: ACCENT }}
                >
                  ШИНЭ
                </span>
              )}
              <MetaChip>{featured.genre}</MetaChip>
              <MetaChip>{featured.type === 'кино' ? 'Кино' : featured.type === 'цуврал' ? 'Цуврал' : 'Баримтат'}</MetaChip>
            </div>

            <h1
              className="text-3xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl"
              style={fontDisplay}
            >
              {featured.title}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#F5E8EB]/80">
              <RatingBadge value={featured.rating} />
              <span>{featured.year}</span>
              <span aria-hidden className="h-1 w-1 rounded-full bg-white/40" />
              <span>{featured.duration}</span>
              <span aria-hidden className="h-1 w-1 rounded-full bg-white/40" />
              <span className="text-[#F5E8EB]/60">Демо контент</span>
            </div>

            <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#F5E8EB]/85 sm:text-base">
              {featured.description}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button size="lg" className={BTN_ACCENT} onClick={() => navigate(`/demo/uzeg/watch?id=${featured.id}`)}>
                <Play className="mr-2 h-5 w-5 fill-white" aria-hidden />
                Үзэх
              </Button>
              <Button
                size="lg"
                variant="outline"
                className={BTN_GHOST}
                onClick={() => toggleList(featured)}
                aria-pressed={inList}
              >
                {inList ? (
                  <>
                    <Check className="mr-2 h-5 w-5 text-[#FF3D5A]" aria-hidden />
                    Жагсаалтад байна
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-5 w-5" aria-hidden />
                    Жагсаалтад +
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── МӨРҮҮД ─── */}
      <div className="mx-auto max-w-7xl pb-6 sm:px-0">
        {continueItems.length > 0 && (
          <section aria-label="Үргэлжлүүлж үзэх">
            <div className="mb-3 flex items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
              <h2 className="text-base text-white sm:text-lg" style={fontDisplay}>
                Үргэлжлүүлж үзэх
              </h2>
            </div>
            <div className="nice-scroll flex gap-3 overflow-x-auto px-4 pb-3 sm:gap-4 sm:px-6 lg:px-8">
              {continueItems.map((t) => (
                <div key={t.id} className="w-[142px] shrink-0 sm:w-[168px] lg:w-[182px]">
                  <TitleCard
                    t={t}
                    progressPct={progressMap[t.id]?.pct}
                    onRemove={() => removeContinue(t)}
                  />
                </div>
              ))}
            </div>
          </section>
        )}
        {rows.fresh.length > 0 && <ContentRow title="Шинэ нэмэгдсэн" items={rows.fresh} moreHref="/demo/uzeg/browse" />}
        <ContentRow title="Кино" items={rows.byType('кино')} moreHref="/demo/uzeg/browse?type=%D0%BA%D0%B8%D0%BD%D0%BE" />
        <ContentRow title="Цуврал" items={rows.byType('цуврал')} moreHref="/demo/uzeg/browse?type=%D1%86%D1%83%D0%B2%D1%80%D0%B0%D0%BB" />
        <ContentRow
          title="Баримтат"
          items={rows.byType('баримтат')}
          moreHref="/demo/uzeg/browse?type=%D0%B1%D0%B0%D1%80%D0%B8%D0%BC%D1%82%D0%B0%D1%82"
        />
        {rows.genreRows.map((g) => (
          <ContentRow key={g.genre} title={g.genre} items={g.arr} moreHref="/demo/uzeg/browse" />
        ))}
        <ContentRow title="Топ үнэлгээтэй" items={rows.top} moreHref="/demo/uzeg/browse" />

        <div className="mt-12 px-4 pb-4 sm:px-6 lg:px-8">
          <p className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 py-3 text-center text-xs text-[#F5E8EB]/55">
            <Info className="h-3.5 w-3.5" aria-hidden />
            Бүх контент нь жишээ (демо) өгөгдөл — бодит стриминг сервис биш.
          </p>
        </div>
      </div>

      {/* Кэшлэсэн өгөгдөл харагдаж буй ч шинэчлэлт амжилтгүй болсон үеийн жижиг анхааруулга */}
      {error && titles.length > 0 && (
        <div className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
          <p className="flex items-center gap-2 rounded-xl border border-[#FF3D5A]/30 bg-[#FF3D5A]/10 px-4 py-3 text-xs text-[#F5E8EB]/80">
            <AlertTriangle className="h-4 w-4 shrink-0 text-[#FF3D5A]" aria-hidden />
            {error} — кэшлэсэн жагсаалт харуулж байна.
            <button
              type="button"
              onClick={reload}
              className="ml-auto shrink-0 underline underline-offset-2 hover:text-[#FF3D5A]"
            >
              Дахин оролдох
            </button>
          </p>
        </div>
      )}
    </div>
  )
}
