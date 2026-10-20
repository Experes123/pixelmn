'use client'

/**
 * ҮЗЭГ — Нээлт хуудас: хайлт, жанр/төрлийн шүүлтүүр, эрэмбэлэлт, хариу өгөх grid
 */

import { useMemo, useState } from 'react'
import { Search, AlertTriangle } from 'lucide-react'
import { useApi } from '@/lib/use-api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { EmptyState, LoadingState } from '@/components/shared/admin-kit'
import { PageHead } from './chrome'
import {
  ACCENT,
  BTN_GHOST,
  DARK_PORTAL,
  INPUT_CLS,
  TitleCard,
  type StreamTitle,
} from './shared'
import { cn } from '@/lib/utils'

type TypeFilter = 'all' | 'кино' | 'цуврал' | 'баримтат'
type SortMode = 'new' | 'rating' | 'az'

const TYPE_PILLS: { value: TypeFilter; label: string }[] = [
  { value: 'all', label: 'Бүгд' },
  { value: 'кино', label: 'Кино' },
  { value: 'цуврал', label: 'Цуврал' },
  { value: 'баримтат', label: 'Баримтат' },
]

export function BrowsePage({
  initialType,
  initialQuery,
}: {
  initialType?: string
  initialQuery?: string
}) {
  const { data, loading, error, reload } = useApi<StreamTitle>('stream-titles')
  const [q, setQ] = useState(initialQuery ?? '')
  const [genre, setGenre] = useState('all')
  const [type, setType] = useState<TypeFilter>(
    initialType === 'кино' || initialType === 'цуврал' || initialType === 'баримтат'
      ? initialType
      : 'all'
  )
  const [sort, setSort] = useState<SortMode>('new')

  const titles = useMemo(() => data.filter((t) => t.active), [data])
  const genres = useMemo(() => [...new Set(titles.map((t) => t.genre))].sort(), [titles])

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    let list = titles.filter((t) => {
      if (type !== 'all' && t.type !== type) return false
      if (genre !== 'all' && t.genre !== genre) return false
      if (needle && !t.title.toLowerCase().includes(needle)) return false
      return true
    })
    list = [...list]
    if (sort === 'new') {
      list.sort((a, b) => Number(b.isNew) - Number(a.isNew) || b.year - a.year || b.rating - a.rating)
    } else if (sort === 'rating') {
      list.sort((a, b) => b.rating - a.rating)
    } else {
      list.sort((a, b) => a.title.localeCompare(b.title, 'mn'))
    }
    return list
  }, [titles, q, genre, type, sort])

  return (
    <div>
      <PageHead
        title="Нээлт"
        description="Кино, цуврал, баримтат контентоо хайж ол. Бүх контент нь жишээ (демо) өгөгдөл."
      >
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-[#F5E8EB]/70">
          {filtered.length} илэрц
        </span>
      </PageHead>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Шүүлтүүрийн мөр */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40"
              aria-hidden
            />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Гарчгаар хайх…"
              aria-label="Гарчгаар хайх"
              className={`h-10 pl-9 ${INPUT_CLS}`}
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Select value={genre} onValueChange={setGenre}>
              <SelectTrigger
                className={`h-10 w-[170px] ${INPUT_CLS}`}
                aria-label="Жанр шүүх"
              >
                <SelectValue placeholder="Бүх жанр" />
              </SelectTrigger>
              <SelectContent className={`${DARK_PORTAL} border-white/10 bg-[#1A0B12] text-[#F5E8EB]`}>
                <SelectItem value="all">Бүх жанр</SelectItem>
                {genres.map((g) => (
                  <SelectItem key={g} value={g}>
                    {g}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sort} onValueChange={(v) => setSort(v as SortMode)}>
              <SelectTrigger className={`h-10 w-[180px] ${INPUT_CLS}`} aria-label="Эрэмблэх">
                <SelectValue placeholder="Эрэмбэ" />
              </SelectTrigger>
              <SelectContent className={`${DARK_PORTAL} border-white/10 bg-[#1A0B12] text-[#F5E8EB]`}>
                <SelectItem value="new">Шинэ нь түрүүнд</SelectItem>
                <SelectItem value="rating">Үнэлгээгээр</SelectItem>
                <SelectItem value="az">А-Я</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Төрлийн pills */}
        <div className="mt-4 flex flex-wrap items-center gap-2" role="group" aria-label="Төрөл шүүх">
          {TYPE_PILLS.map((p) => {
            const active = type === p.value
            return (
              <button
                key={p.value}
                type="button"
                onClick={() => setType(p.value)}
                aria-pressed={active}
                className={cn(
                  'rounded-full border px-4 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF3D5A]',
                  active
                    ? 'border-transparent font-semibold text-white'
                    : 'border-white/15 bg-white/5 text-[#F5E8EB]/75 hover:border-white/30 hover:text-white'
                )}
                style={active ? { background: ACCENT } : undefined}
              >
                {p.label}
              </button>
            )
          })}
        </div>

        {/* Үр дүн */}
        <div className="mt-8">
          {loading && titles.length === 0 ? (
            <LoadingState label="Контент ачаалж байна…" />
          ) : error && titles.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-10 text-center">
              <AlertTriangle className="h-8 w-8 text-[#FF3D5A]" aria-hidden />
              <p className="text-sm text-[#F5E8EB]/80">{error}</p>
              <Button variant="outline" className={BTN_GHOST} onClick={reload}>
                Дахин оролдох
              </Button>
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              title="Илэрц олдсонгүй"
              description="Өөр түлхүүр үг эсвэл шүүлтүүр туршаад үзээрэй."
            />
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
              {filtered.map((t) => (
                <TitleCard key={t.id} t={t} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
