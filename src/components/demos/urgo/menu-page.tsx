'use client'

import { useMemo, useState } from 'react'
import { useApi } from '@/lib/use-api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { toast } from 'sonner'
import { Flame, Minus, Plus, Search, ShoppingBasket, Sparkles } from 'lucide-react'
import { useCart } from './context'
import { Photo } from './photo'
import {
  CATEGORIES,
  CARD_BG,
  EXTRAS_BY_CATEGORY,
  FOOD,
  GREEN,
  KICKER_GREEN,
  SAGE_BORDER,
  SIZE_STEPS,
  TERRA,
  unitPrice,
  type MenuItemData,
} from './constants'
import { fmtMNT } from '@/components/shared/admin-kit'

/** Цэсний хоолны дэлгэрэнгүй цонх — сонголт, тоо ширхэг, нийт дүнгээр */
function DishDialog({ item, onClose }: { item: MenuItemData; onClose: () => void }) {
  const { add } = useCart()
  const [sizeIdx, setSizeIdx] = useState(0)
  const [extraNames, setExtraNames] = useState<string[]>([])
  const [qty, setQty] = useState(1)

  const extrasAll = EXTRAS_BY_CATEGORY[item.category] ?? []
  const chosenExtras = extrasAll.filter((e) => extraNames.includes(e.name))
  const hasSize = item.category === 'нэйлэг'
  const unit = unitPrice(item.price, hasSize ? sizeIdx : 0, chosenExtras)

  const toggleExtra = (name: string, checked: boolean) => {
    setExtraNames((prev) => (checked ? [...prev, name] : prev.filter((n) => n !== name)))
  }

  const addToCart = () => {
    const options = [
      ...(hasSize ? [SIZE_STEPS[sizeIdx].name] : []),
      ...chosenExtras.map((e) => e.name),
    ]
    add({ id: item.id, name: item.name, price: unit }, options, qty)
    toast.success(`${item.name} — сагсанд нэмэгдлээ (${fmtMNT(unit * qty)})`)
    onClose()
  }

  return (
    <DialogContent className="urgo-ui max-h-[90vh] overflow-y-auto nice-scroll p-0 sm:max-w-2xl [&>button]:top-3 [&>button]:right-3 [&>button]:rounded-full [&>button]:bg-black/30 [&>button]:text-white">
      <div className="grid sm:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <div className="relative">
          <Photo
            src={item.imageUrl ?? FOOD.hero}
            alt={item.name}
            className={`h-52 w-full object-cover sm:h-full sm:min-h-[380px] ${item.available ? '' : 'grayscale'}`}
          />
          {item.popular && (
            <span
              className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold text-white"
              style={{ backgroundColor: TERRA }}
            >
              <Sparkles className="h-3 w-3" /> Онцлох
            </span>
          )}
          {!item.available && (
            <span className="absolute inset-x-0 bottom-3 mx-auto w-fit rounded-full bg-neutral-900/85 px-3 py-1 text-xs font-semibold text-white">
              Дууссан
            </span>
          )}
        </div>

        <div className="p-5 sm:p-6">
          <DialogHeader className="space-y-1 text-left">
            <DialogTitle className="text-2xl" style={{ fontFamily: 'var(--font-lora),serif', color: GREEN }}>
              {item.name}
            </DialogTitle>
            <DialogDescription className="text-sm leading-relaxed text-[#6B7562]">
              {item.description}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
            <span
              className="rounded-full border px-2.5 py-0.5 font-medium capitalize"
              style={{ borderColor: SAGE_BORDER, color: KICKER_GREEN }}
            >
              {item.category}
            </span>
            {item.spicy && (
              <span className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2.5 py-0.5 font-medium text-red-700">
                <Flame className="h-3 w-3" /> Халуун
              </span>
            )}
            <span className="text-lg font-bold" style={{ color: TERRA }}>
              {fmtMNT(item.price)}
            </span>
          </div>

          {item.available ? (
            <>
              {/* Хэмжээний сонголт — нэйлэгийн ангилалд */}
              {hasSize && (
                <div className="mt-5">
                  <p className="text-sm font-semibold" style={{ color: GREEN }}>
                    Хэмжээ
                  </p>
                  <RadioGroup
                    value={String(sizeIdx)}
                    onValueChange={(v) => setSizeIdx(Number(v))}
                    className="mt-2 grid grid-cols-3 gap-2"
                  >
                    {SIZE_STEPS.map((s, i) => (
                      <Label
                        key={s.name}
                        htmlFor={`size-${i}`}
                        className="flex cursor-pointer flex-col items-center gap-0.5 rounded-xl border px-2 py-2.5 text-center transition-colors has-[[data-state=checked]]:border-[#B4552D] has-[[data-state=checked]]:bg-[#B4552D]/10"
                      >
                        <RadioGroupItem id={`size-${i}`} value={String(i)} className="sr-only" />
                        <span className="text-sm font-medium text-foreground">{s.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {i === 0 ? 'үндсэн' : `+${Math.round(s.pct * 100)}%`}
                        </span>
                      </Label>
                    ))}
                  </RadioGroup>
                </div>
              )}

              {/* Нэмэлт сонголтууд — ангилал тус бүрээр */}
              {extrasAll.length > 0 && (
                <div className="mt-5">
                  <p className="text-sm font-semibold" style={{ color: GREEN }}>
                    Нэмэлт
                  </p>
                  <div className="mt-2 space-y-2">
                    {extrasAll.map((e) => (
                      <Label
                        key={e.name}
                        htmlFor={`extra-${e.name}`}
                        className="flex cursor-pointer items-center justify-between rounded-xl border px-3 py-2.5 transition-colors has-[[data-state=checked]]:border-[#B4552D] has-[[data-state=checked]]:bg-[#B4552D]/5"
                      >
                        <span className="flex items-center gap-2.5">
                          <Checkbox
                            id={`extra-${e.name}`}
                            checked={extraNames.includes(e.name)}
                            onCheckedChange={(c) => toggleExtra(e.name, c === true)}
                          />
                          <span className="text-sm text-foreground">{e.name}</span>
                        </span>
                        <span className="text-sm font-medium text-[#6B7562]">+{fmtMNT(e.price)}</span>
                      </Label>
                    ))}
                  </div>
                </div>
              )}

              {/* Тоо ширхэг + сагслах */}
              <div className="mt-6 flex items-center justify-between gap-3">
                <div className="flex items-center gap-1 rounded-full border px-1.5 py-1" style={{ borderColor: SAGE_BORDER }}>
                  <button
                    type="button"
                    aria-label="Хасах"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="grid h-7 w-7 place-items-center rounded-full hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B4552D]"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-8 text-center text-sm font-bold">{qty}</span>
                  <button
                    type="button"
                    aria-label="Нэмэх"
                    onClick={() => setQty((q) => Math.min(99, q + 1))}
                    className="grid h-7 w-7 place-items-center rounded-full hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B4552D]"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
                <p className="text-sm text-[#6B7562]">
                  Нийт: <span className="text-lg font-bold" style={{ color: TERRA }}>{fmtMNT(unit * qty)}</span>
                </p>
              </div>
              <Button
                className="mt-4 w-full rounded-full text-white"
                style={{ backgroundColor: TERRA }}
                onClick={addToCart}
              >
                <ShoppingBasket className="mr-2 h-4 w-4" />
                Сагслах
              </Button>
            </>
          ) : (
            <p className="mt-6 rounded-xl border border-dashed px-4 py-3 text-center text-sm text-muted-foreground">
              Энэ хоол өнөөдөр дууссан — маргааш дахин орж ирээрэй.
            </p>
          )}
        </div>
      </div>
    </DialogContent>
  )
}

export function MenuPage() {
  const { data, loading, error, reload } = useApi<MenuItemData>('menu-items')
  const [category, setCategory] = useState<string>('Бүгд')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<MenuItemData | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return data.filter((item) => {
      const catOk = category === 'Бүгд' || item.category === category
      const qOk =
        q === '' ||
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
      return catOk && qOk
    })
  }, [data, category, query])

  const pills = ['Бүгд', ...CATEGORIES]

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.25em]" style={{ color: KICKER_GREEN }}>
          ӨРГӨӨ · ЦЭС
        </p>
        <h1 className="mt-2 text-4xl font-bold" style={{ color: GREEN }}>
          Бидний цэс
        </h1>
        <p className="urgo-ui mx-auto mt-3 max-w-xl text-sm text-[#6B7562]">
          Хоол бүрээ сонгож, хэмжээ, нэмэлтээ тохируулаад сагслаарай.
        </p>
      </div>

      {/* Хайлт + ангиллын шүүлтүүр */}
      <div className="urgo-ui mt-8 flex flex-col gap-3">
        <div className="relative mx-auto w-full max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A9179]" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Хоол хайх… жишээ: бууз"
            aria-label="Цэснээс хайх"
            className="rounded-full border-[#E4DECB] bg-[#FFFDF8] pl-10"
          />
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2" role="group" aria-label="Ангилал">
          {pills.map((c) => {
            const active = category === c
            return (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                aria-pressed={active}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium capitalize transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B4552D] ${
                  active ? 'border-transparent text-white' : 'bg-[#FFFDF8] text-[#1F3D2B] hover:border-[#B4552D]'
                }`}
                style={active ? { backgroundColor: GREEN } : { borderColor: SAGE_BORDER }}
              >
                {c}
              </button>
            )
          })}
        </div>
        <p className="text-center text-xs text-[#8A9179]">{filtered.length} хоол илэрлээ</p>
      </div>

      {error && (
        <div className="urgo-ui mx-auto mt-8 max-w-md rounded-xl border border-red-200 bg-red-50 p-4 text-center text-sm text-red-700">
          Цэс ачаалахад алдаа гарлаа.{' '}
          <button type="button" className="font-semibold underline" onClick={reload}>
            Дахин оролдох
          </button>
        </div>
      )}

      {loading ? (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="overflow-hidden rounded-2xl border" style={{ borderColor: SAGE_BORDER }}>
              <Skeleton className="aspect-[4/3] w-full rounded-none" />
              <div className="space-y-2 p-4">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="urgo-ui mt-10 rounded-2xl border border-dashed px-6 py-14 text-center" style={{ borderColor: SAGE_BORDER }}>
          <p className="font-medium" style={{ color: GREEN }}>
            Илэрцгүй байна
          </p>
          <p className="mt-1 text-sm text-[#6B7562]">
            Өөр түлхүүр үгээр хайж эсвэл ангилал солино уу.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelected(item)}
              className="group overflow-hidden rounded-2xl border text-left shadow-sm transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B4552D]"
              style={{ backgroundColor: CARD_BG, borderColor: SAGE_BORDER }}
              aria-label={`${item.name}, ${fmtMNT(item.price)} — дэлгэрэнгүй үзэх`}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Photo
                  src={item.imageUrl ?? FOOD.hero}
                  alt={item.name}
                  className={`h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04] ${item.available ? '' : 'grayscale opacity-75'}`}
                />
                {!item.available && (
                  <span className="absolute inset-x-0 bottom-3 mx-auto w-fit rounded-full bg-neutral-900/85 px-3 py-1 text-xs font-semibold text-white">
                    Дууссан
                  </span>
                )}
                {item.popular && item.available && (
                  <span
                    className="absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-[11px] font-semibold text-white"
                    style={{ backgroundColor: TERRA }}
                  >
                    Онцлох
                  </span>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-lg font-semibold leading-snug" style={{ color: GREEN }}>
                    {item.name}
                  </h3>
                  {item.spicy && (
                    <span
                      className="mt-0.5 inline-flex shrink-0 items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-[11px] font-medium text-red-700"
                      title="Халуун ногоотой"
                    >
                      <Flame className="h-3 w-3" /> Халуун
                    </span>
                  )}
                </div>
                <p className="urgo-ui mt-1 line-clamp-1 text-sm text-[#6B7562]">{item.description}</p>
                <div className="urgo-ui mt-3 flex items-center justify-between">
                  <span className="text-base font-bold" style={{ color: TERRA }}>
                    {fmtMNT(item.price)}
                  </span>
                  <span className="text-xs font-medium" style={{ color: KICKER_GREEN }}>
                    Дэлгэрэнгүй →
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      <Dialog open={selected !== null} onOpenChange={(o) => !o && setSelected(null)}>
        {selected && (
          <DishDialog
            key={selected.id}
            item={selected}
            onClose={() => setSelected(null)}
          />
        )}
      </Dialog>

      <p className="urgo-ui mt-10 text-center text-xs text-[#8A9179]">
        Үнэ, орц нь демо хувилбарын жишээ утга · Хүргэлтийн хугацаа 45–60 минут
      </p>
    </div>
  )
}
