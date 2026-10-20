'use client'

import { useEffect, useState, useCallback, type ReactNode, type MouseEvent, type CSSProperties } from 'react'

/** Одоогийн hash замыг унших ба өөрчлөлтөд сонсох */
export function useHashRoute(): string {
  const [hash, setHash] = useState('')
  useEffect(() => {
    const read = () => setHash(window.location.hash || '#/')
    read()
    window.addEventListener('hashchange', read)
    return () => window.removeEventListener('hashchange', read)
  }, [])
  return hash
}

/** Программчилсан шилжилт */
export function navigate(path: string) {
  if (window.location.hash === `#${path}`) return
  window.location.hash = path
}

/** hash замыг бүрэлдэхүүн хэсгүүд рүү задлана: '#/demo/barber/booking?x=1' → ['demo','barber','booking'] */
export function parseHash(hash: string): { segments: string[]; query: URLSearchParams } {
  const raw = hash.replace(/^#/, '') || '/'
  const [path, qs] = raw.split('?')
  const segments = path.split('/').filter(Boolean)
  return { segments, query: new URLSearchParams(qs ?? '') }
}

/** Демо доторх дэд зам: демо-ID-ийн дараах хэсгүүд */
export function useDemoRoute(demoId: string) {
  const hash = useHashRoute()
  const { segments, query } = parseHash(hash)
  const prefix = ['demo', demoId]
  const isMatch =
    segments.length >= prefix.length && prefix.every((p, i) => segments[i] === p)
  const rest = isMatch ? segments.slice(prefix.length) : []
  return { isMatch, sub: rest.join('/') || '', query, full: `#/demo/${demoId}${rest.length ? '/' + rest.join('/') : ''}` }
}

type LinkProps = {
  href: string
  children: ReactNode
  className?: string
  onClick?: () => void
  ariaLabel?: string
  style?: CSSProperties
}

/** Демо доторх холбоос — hash руу шилжинэ, хуудсыг дээш гүйлгэнэ */
export function DemoLink({ href, children, className, onClick, ariaLabel, style }: LinkProps) {
  const handle = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault()
      onClick?.()
      navigate(href)
    },
    [href, onClick]
  )
  return (
    <a href={`#${href}`} onClick={handle} className={className} aria-label={ariaLabel} style={style}>
      {children}
    </a>
  )
}

/** Үндсэн сайт руу буцах скроллтой шилжилт (портфолио хэсэг рүү) */
export function goHomeToPortfolio() {
  try {
    sessionStorage.setItem('px-scroll-to', 'portfolio')
  } catch {
    /* noop */
  }
  navigate('/')
}
