'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState, useSyncExternalStore, type ReactNode } from 'react'
import { CART_KEY, lineKey, type CartItem } from './constants'

/** localStorage-оос сагс уншина (сервер талд хоосон) */
function readStorage(): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(CART_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (i): i is CartItem =>
        typeof i === 'object' && i !== null && 'id' in i && 'name' in i && 'price' in i && 'qty' in i
    )
  } catch {
    return []
  }
}

type AddResult = 'added' | 'merged' | 'capped'

type CartContextValue = {
  items: CartItem[]
  count: number
  subtotal: number
  /** Сагслах — хангалт хэмжээг (stock) хүндэтгэнэ. Үр дүнг буцаана. */
  add: (item: Omit<CartItem, 'qty'>, qty?: number, stock?: number) => AddResult
  setQty: (key: string, qty: number, stock?: number) => void
  remove: (key: string) => void
  clear: () => void
  qtyOf: (id: string, option?: string | null) => number
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(readStorage)

  // Сагсны төлвийг localStorage-д байнга хадгална
  useEffect(() => {
    try {
      window.localStorage.setItem(CART_KEY, JSON.stringify(items))
    } catch {
      /* хадгалах боломжгүй — UI ажилласан хэвээр */
    }
  }, [items])

  const add: CartContextValue['add'] = useCallback((item, qty = 1, stock) => {
    const cap = stock ?? 99
    let result: AddResult = 'added'
    setItems((prev) => {
      const key = lineKey(item.id, item.option)
      const idx = prev.findIndex((l) => lineKey(l.id, l.option) === key)
      if (idx === -1) {
        result = 'added'
        return [...prev, { ...item, qty: Math.max(1, Math.min(qty, cap)) }]
      }
      const next = [...prev]
      const merged = next[idx].qty + qty
      if (merged >= cap) {
        next[idx] = { ...next[idx], qty: cap }
        result = 'capped'
      } else {
        next[idx] = { ...next[idx], qty: merged }
        result = 'merged'
      }
      return next
    })
    return result
  }, [])

  const setQty: CartContextValue['setQty'] = useCallback((key, qty, stock) => {
    const cap = stock ?? 99
    setItems((prev) =>
      prev.flatMap((l) => {
        if (lineKey(l.id, l.option) !== key) return [l]
        const q = Math.min(Math.max(1, qty), cap)
        return q <= 0 ? [] : [{ ...l, qty: q }]
      })
    )
  }, [])

  const remove: CartContextValue['remove'] = useCallback((key) => {
    setItems((prev) => prev.filter((l) => lineKey(l.id, l.option) !== key))
  }, [])

  const clear = useCallback(() => setItems([]), [])

  const qtyOf = useCallback(
    (id: string, option?: string | null) =>
      items.find((l) => lineKey(l.id, l.option) === lineKey(id, option))?.qty ?? 0,
    [items]
  )

  const { count, subtotal } = useMemo(
    () => ({
      count: items.reduce((s, l) => s + l.qty, 0),
      subtotal: items.reduce((s, l) => s + l.qty * l.price, 0),
    }),
    [items]
  )

  const value = useMemo(
    () => ({ items, count, subtotal, add, setQty, remove, clear, qtyOf }),
    [items, count, subtotal, add, setQty, remove, clear, qtyOf]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart-г CartProvider дотор ашиглана уу')
  return ctx
}

// ─────────────────────────── Хадгалсан бүтээгдэхүүн (favorites) ───────────────────────────

const FAV_KEY = 'nutag-fav'

function readFavs(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(FAV_KEY)
    const parsed: unknown = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : []
  } catch {
    return []
  }
}

let favSnapshot: string[] | null = null
const favListeners = new Set<() => void>()

function getFavSnapshot(): string[] {
  if (!favSnapshot) favSnapshot = readFavs()
  return favSnapshot
}
function getFavServerSnapshot(): string[] {
  return []
}

function writeFavs(next: string[]) {
  try {
    window.localStorage.setItem(FAV_KEY, JSON.stringify(next))
  } catch {
    /* хадгалах боломжгүй — UI ажилласан хэвээр */
  }
  favSnapshot = null
  for (const l of favListeners) l()
}

/** Хадгалсан жагсаалт — зүрхэн товч болон "Хадгалсан" шүүлтүүрт ашиглана */
export function useFavorites() {
  const favs = useSyncExternalStore(subscribeFavs, getFavSnapshot, getFavServerSnapshot)

  const toggle = useCallback((id: string) => {
    const cur = getFavSnapshot()
    writeFavs(cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id])
  }, [])

  const has = useCallback((id: string) => favs.includes(id), [favs])

  return { favs, has, toggle }
}

function subscribeFavs(listener: () => void) {
  favListeners.add(listener)
  return () => favListeners.delete(listener)
}
