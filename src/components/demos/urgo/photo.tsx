'use client'

/**
 * Гадаад URL-ий зураг харуулна.
 * FOUNDATION-ын шаардлагаар next/image хориглогдсон тул шууд img ашиглана.
 */
export function Photo({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return <img src={src} alt={alt} loading="lazy" className={className} />
}
