'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type CartItem = {
  /** id + сонголтын хэш — ижил хоол өөр сонголттой бол өөр мөр */
  key: string
  id: string
  name: string
  /** нэгж үнэ (хэмжээ + нэмэлтүүдийг оруулсан) */
  price: number
  qty: number
  /** сонголтын тайлбар: ['Дунд', 'Халуун соус'] */
  options: string[]
}

const STORAGE_KEY = 'urgo-cart'

type CartContextValue = {
  items: CartItem[]
  count: number
  subtotal: number
  add: (item: { id: string; name: string; price: number }, options: string[], qty: number) => void
  setQty: (key: string, qty: number) => void
  remove: (key: string) => void
  clear: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

function readStorage(): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
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

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(readStorage)

  // сагсны төлөвийг localStorage-д хадгална
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      /* хадгалах боломжгүй үед алгасна */
    }
  }, [items])

  const add = useCallback(
    (item: { id: string; name: string; price: number }, options: string[], qty: number) => {
      const key = `${item.id}|${options.join(' / ')}`
      setItems((prev) => {
        const found = prev.find((i) => i.key === key)
        if (found) {
          return prev.map((i) => (i.key === key ? { ...i, qty: Math.min(99, i.qty + qty) } : i))
        }
        return [...prev, { key, id: item.id, name: item.name, price: item.price, qty, options }]
      })
    },
    []
  )

  const setQty = useCallback((key: string, qty: number) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((i) => i.key !== key)
        : prev.map((i) => (i.key === key ? { ...i, qty: Math.min(99, qty) } : i))
    )
  }, [])

  const remove = useCallback((key: string) => {
    setItems((prev) => prev.filter((i) => i.key !== key))
  }, [])

  const clear = useCallback(() => setItems([]), [])

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count: items.reduce((s, i) => s + i.qty, 0),
      subtotal: items.reduce((s, i) => s + i.qty * i.price, 0),
      add,
      setQty,
      remove,
      clear,
    }),
    [items, add, setQty, remove, clear]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart-г CartProvider дотор ашиглана уу')
  return ctx
}
