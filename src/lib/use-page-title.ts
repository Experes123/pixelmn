'use client'

import { useEffect } from 'react'

export const SITE_BASE_TITLE = 'Pixelmn — Мэргэжлийн вэб хөгжүүлэлт, дизайны студио'

/** Хуудас бүрийн гарчигыг замд тохируулан шинэчлэнэ (SEO/UX) */
export function setPageTitle(title?: string | null) {
  if (typeof document === 'undefined') return
  document.title = title ? `${title} · Pixelmn` : SITE_BASE_TITLE
}

/** Компонент mount үед гарчиг оноож, unmount үед анхны утга буцаана */
export function usePageTitle(title?: string | null) {
  useEffect(() => {
    setPageTitle(title)
    return () => setPageTitle(null)
  }, [title])
}
