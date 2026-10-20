/**
 * Standalone build-ийг гүйцээх скрипт.
 *
 * Next.js нь `output: "standalone"` үед .next/static болон public хавтсыг
 * .next/standalone руу автоматаар хуулдаггүй. Энэ скрипт тэдгээрийг
 * хуулж, production дээр зөв ажиллахад бэлэн болгоно.
 *
 * Windows / Linux / macOS — бүгд дээр ажиллана (node:fs/promises).
 */
import { cp, rm } from 'node:fs/promises'

// Дахин build хийхэд хуучин хуулбарыг цэвэрлэж байж хуулна (давхардал үүсэхгүй)
await rm('.next/standalone/.next/static', { recursive: true, force: true })
await cp('.next/static', '.next/standalone/.next/static', { recursive: true })

await rm('.next/standalone/public', { recursive: true, force: true })
await cp('public', '.next/standalone/public', { recursive: true })

console.log('✓ Standalone бэлэн — .next/static болон public хуулагдлаа.')
