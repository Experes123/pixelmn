'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

/** 401 хариу — хамгаалагдсан үйлдэл: нэвтрэх цонхыг дуудаж, ойлгомжтой алдаа шидэнэ */
function handleWriteResponse(res: Response, fallback: string): Promise<never> | null {
  if (res.status === 401) {
    try {
      window.dispatchEvent(new CustomEvent('px-need-auth'))
    } catch {
      /* noop */
    }
    return Promise.reject(
      new Error('Удирдах эрх шаардлагатай — нэвтэрсний дараа дахин оролдоно уу.')
    )
  }
  if (!res.ok) {
    return res
      .json()
      .catch(() => ({}))
      .then((j: { error?: string }) => {
        throw new Error(j.error || fallback)
      })
  }
  return null
}

/** API дуудлагын туслах — жагсаалт авах, үүсгэх, шинэчлэх, устгах */
export function useApi<T>(resource: string, autoLoad = true) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(autoLoad)
  const [error, setError] = useState<string | null>(null)
  const mounted = useRef(true)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/${resource}`, { cache: 'no-store' })
      if (!res.ok) throw new Error('Ачаалахад алдаа гарлаа')
      const json = await res.json()
      if (mounted.current) setData(Array.isArray(json) ? json : [])
    } catch (e) {
      if (mounted.current) setError(e instanceof Error ? e.message : 'Алдаа гарлаа')
    } finally {
      if (mounted.current) setLoading(false)
    }
  }, [resource])

  useEffect(() => {
    mounted.current = true
    if (autoLoad) load()
    return () => {
      mounted.current = false
    }
  }, [autoLoad, load])

  const create = useCallback(
    async (payload: Partial<T> & Record<string, unknown>) => {
      const res = await fetch(`/api/${resource}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const failed = handleWriteResponse(res, 'Хадгалахад алдаа гарлаа')
      if (failed) await failed
      await load()
      return res.json()
    },
    [resource, load]
  )

  const update = useCallback(
    async (id: string, payload: Record<string, unknown>) => {
      const res = await fetch(`/api/${resource}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const failed = handleWriteResponse(res, 'Шинэчлэхэд алдаа гарлаа')
      if (failed) await failed
      await load()
      return res.json()
    },
    [resource, load]
  )

  const remove = useCallback(
    async (id: string) => {
      const res = await fetch(`/api/${resource}/${id}`, { method: 'DELETE' })
      const failed = handleWriteResponse(res, 'Устгахад алдаа гарлаа')
      if (failed) await failed
      await load()
    },
    [resource, load]
  )

  return { data, loading, error, reload: load, create, update, remove, setData }
}

/** Нэг бичилт татах (?key= эсвэл id) */
export function fetchOne(resource: string, id: string) {
  return fetch(`/api/${resource}/${id}`, { cache: 'no-store' }).then((r) =>
    r.ok ? r.json() : null
  )
}

/** Ганц key-тэй бичилт татах (site-content, company-content) */
export function fetchByKey<T>(resource: string, key: string): Promise<T | null> {
  return fetch(`/api/${resource}?key=${encodeURIComponent(key)}`, { cache: 'no-store' }).then(
    (r) => (r.ok ? r.json() : null)
  )
}

/** Жагсаалт татах (hook-гүй нэг удаа) */
export function fetchList<T>(resource: string): Promise<T[]> {
  return fetch(`/api/${resource}`, { cache: 'no-store' }).then((r) => (r.ok ? r.json() : []))
}
