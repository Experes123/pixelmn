'use client'

import { useMemo, useState } from 'react'
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
import { Search, SlidersHorizontal, X, Heart } from 'lucide-react'
import { EmptyState } from '@/components/shared/admin-kit'
import { useFavorites } from './context'
import {
  CATEGORIES,
  CATEGORY_LABEL,
  INK,
  INK_SOFT,
  LINE,
  OLIVE,
  PRICE_RANGES,
  RUST,
  SORTS,
  type Product,
} from './constants'
import { CardSkeleton, PageHead, ProductCard } from './ui'

export function ShopPage({ query }: { query: URLSearchParams }) {
  const { data: products, loading, error, reload } = useApi<Product>('products')

  // ?cat= параметрээр эхний шүүлтүүр тавина (index-ээс key-ээр дахин mount хийнэ)
  const [cat, setCat] = useState(query.get('cat') ?? '')
  const [priceIdx, setPriceIdx] = useState(0)
  const [sort, setSort] = useState<string>('new')
  const [q, setQ] = useState('')
  const [favOnly, setFavOnly] = useState(false)
  const { favs, has: isFav } = useFavorites()

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()
    const test = PRICE_RANGES[priceIdx].test
    let list = products.filter((p) => p.active)
    if (cat) list = list.filter((p) => p.category === cat)
    list = list.filter((p) => test(p.price))
    if (favOnly) list = list.filter((p) => isFav(p.id))
    if (term)
      list = list.filter(
        (p) => p.name.toLowerCase().includes(term) || p.description.toLowerCase().includes(term)
      )
    const sorted = [...list]
    switch (sort) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price)
        break
      case 'popular':
        sorted.sort((a, b) => Number(b.featured) - Number(a.featured) || b.stock - a.stock)
        break
      default:
        // Шинэ — API аль хэдийн createdAt desc-ээр ирдэг
        break
    }
    return sorted
  }, [products, cat, priceIdx, q, sort, favOnly, isFav])

  const hasFilter =
    cat !== '' || priceIdx !== 0 || q.trim() !== '' || sort !== 'new' || favOnly

  const clearFilters = () => {
    setCat('')
    setPriceIdx(0)
    setFavOnly(false)
    setSort('new')
    setQ('')
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10">
      <PageHead
        kicker="НУТАГ · ДЭЛГҮҮР"
        title="Дэлгүүр"
        sub="Гараар хийсэн бүтээгдэхүүнүүдийг ангилал, үнэ, нэрээр нь шүүж хайгаарай."
      />

      {/* ── Шүүлтүүр ─────────────────────────────────────────────────────── */}
      <div
        className="rounded-2xl border bg-white p-4 shadow-[0_1px_3px_rgba(38,35,29,0.05)]"
        style={{ borderColor: LINE }}
        role="search"
        aria-label="Бүтээгдэхүүн шүүх"
      >
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: INK_SOFT }} aria-hidden="true" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Бүтээгдэхүүн хайх… (жишээ: цүнх, эсгий)"
              className="border-[#E1DAC7] bg-white pl-9 focus-visible:ring-[#5A6B3F]"
              aria-label="Бүтээгдэхүүн хайх"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="w-[190px]">
              <Select value={String(priceIdx)} onValueChange={(v) => setPriceIdx(Number(v))}>
                <SelectTrigger
                  className="border-[#E1DAC7] bg-white focus:ring-[#5A6B3F]"
                  aria-label="Үнийн хязгаар сонгох"
                >
                  <SlidersHorizontal className="mr-1.5 h-3.5 w-3.5" style={{ color: INK_SOFT }} />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRICE_RANGES.map((r, i) => (
                    <SelectItem key={r.label} value={String(i)}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-[170px]">
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger
                  className="border-[#E1DAC7] bg-white focus:ring-[#5A6B3F]"
                  aria-label="Эрэмблэх"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SORTS.map((s) => (
                    <SelectItem key={s.key} value={s.key}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {hasFilter && (
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full text-[13px]"
                style={{ color: INK_SOFT }}
                onClick={clearFilters}
              >
                <X className="mr-1 h-3.5 w-3.5" />
                Цэвэрлэх
              </Button>
            )}
          </div>
        </div>

        {/* Ангиллын pills */}
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 nice-scroll" role="group" aria-label="Ангилал сонгох">
          <button
            type="button"
            onClick={() => setFavOnly(!favOnly)}
            aria-pressed={favOnly}
            className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-[13px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5A6B3F] ${
              favOnly ? 'text-white' : 'bg-white hover:bg-[#F4F1E6]'
            }`}
            style={favOnly ? { backgroundColor: RUST, borderColor: RUST } : { borderColor: LINE, color: INK }}
          >
            <Heart className="h-3.5 w-3.5" fill={favOnly ? 'white' : 'none'} aria-hidden />
            Хадгалсан{favs.length > 0 ? ` (${favs.length})` : ''}
          </button>
          <button
            type="button"
            onClick={() => setCat('')}
            aria-pressed={cat === ''}
            className={`whitespace-nowrap rounded-full border px-3.5 py-1.5 text-[13px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5A6B3F] ${
              cat === '' ? 'text-white' : 'bg-white hover:bg-[#F4F1E6]'
            }`}
            style={cat === '' ? { backgroundColor: OLIVE, borderColor: OLIVE } : { borderColor: LINE, color: INK }}
          >
            Бүгд
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCat(cat === c ? '' : c)}
              aria-pressed={cat === c}
              className={`whitespace-nowrap rounded-full border px-3.5 py-1.5 text-[13px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5A6B3F] ${
                cat === c ? 'text-white' : 'bg-white hover:bg-[#F4F1E6]'
              }`}
              style={cat === c ? { backgroundColor: OLIVE, borderColor: OLIVE } : { borderColor: LINE, color: INK }}
            >
              {CATEGORY_LABEL[c]}
            </button>
          ))}
        </div>
      </div>

      {/* ── Үр дүн ───────────────────────────────────────────────────────── */}
      <p className="mt-5 text-sm" style={{ color: INK_SOFT }} aria-live="polite">
        {loading ? 'Ачаалж байна…' : `${filtered.length} бүтээгдэхүүн олдлоо`}
      </p>

      {error && (
        <div className="mt-4 flex items-center justify-between rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <span>Бүтээгдэхүүн ачаалахад алдаа гарлаа.</span>
          <Button size="sm" variant="outline" className="border-red-300 bg-white" onClick={reload}>
            Дахин оролдох
          </Button>
        </div>
      )}

      <div className="mt-4">
        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title="Ийм шалгууртай бүтээгдэхүүн олдсонгүй"
            description="Шүүлтүүрээ өөрчилж, өөр ангилал эсвэл үнийн хязгаараар дахин хайгаарай."
            action={
              <Button
                className="rounded-full text-white"
                style={{ backgroundColor: OLIVE }}
                onClick={clearFilters}
              >
                Шүүлтүүр цэвэрлэх
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
