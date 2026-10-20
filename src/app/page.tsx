'use client'

import { useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useHashRoute, parseHash } from '@/lib/hash-router'
import { setPageTitle } from '@/lib/use-page-title'
import { DEMOS, DEMO_IDS } from '@/config/demos'
import { LoadingState } from '@/components/shared/admin-kit'

// ── Үндсэн сайт болон хуудсууд ──
const AgencySite = dynamic(
  () => import('@/components/agency/agency-site').then((m) => m.AgencySite),
  { ssr: false, loading: () => <LoadingState label="Pixelmn ачаалж байна…" /> }
)
const PrivacyPage = dynamic(
  () => import('@/components/agency/legal').then((m) => m.PrivacyPage),
  { ssr: false }
)
const TermsPage = dynamic(
  () => import('@/components/agency/legal').then((m) => m.TermsPage),
  { ssr: false }
)
const CasePage = dynamic(
  () => import('@/components/agency/case-page').then((m) => m.CasePage),
  { ssr: false, loading: () => <LoadingState label="Кейс ачаалж байна…" /> }
)

// ── 6 демо вэбсайт (Task 2-a…2-f агентууд бүтээнэ) ──
const BarberDemo = dynamic(() => import('@/components/demos/barber'), {
  ssr: false,
  loading: () => <LoadingState />,
})
const PcCafeDemo = dynamic(() => import('@/components/demos/pc-cafe'), {
  ssr: false,
  loading: () => <LoadingState />,
})
const UrgoDemo = dynamic(() => import('@/components/demos/urgo'), {
  ssr: false,
  loading: () => <LoadingState />,
})
const TemuurDemo = dynamic(() => import('@/components/demos/temuur'), {
  ssr: false,
  loading: () => <LoadingState />,
})
const UzegDemo = dynamic(() => import('@/components/demos/uzeg'), {
  ssr: false,
  loading: () => <LoadingState />,
})
const NutagDemo = dynamic(() => import('@/components/demos/nutag'), {
  ssr: false,
  loading: () => <LoadingState />,
})

const DEMO_COMPONENTS: Record<string, React.ComponentType> = {
  barber: BarberDemo,
  'pc-cafe': PcCafeDemo,
  urgo: UrgoDemo,
  temuur: TemuurDemo,
  uzeg: UzegDemo,
  nutag: NutagDemo,
}

const DEMO_TITLES: Record<string, string> = {
  barber: 'ГАН Barbershop — Демо',
  'pc-cafe': 'ШОНХОР Gaming Café — Демо',
  urgo: 'ӨРГӨӨ Ресторан — Демо',
  temuur: 'ТЭМҮҮР Групп — Демо',
  uzeg: 'ҮЗЭГ Стриминг — Демо',
  nutag: 'НУТАГ Store — Демо',
}

const ROUTE_TITLES: Record<string, string> = {
  privacy: 'Нууцлалын бодлого',
  terms: 'Үйлчилгээний нөхцөл',
}

/** #/admin хуучин hash зам — хамгаалагдсан /admin руу шилжүүлнэ */
function AdminRedirect() {
  useEffect(() => {
    window.location.replace('/admin')
  }, [])
  return <LoadingState label="Хамгаалагдсан админ панель руу шилжиж байна…" />
}

/** Демо доторх дэд хуудаснуудын гарчиг (sub → нэр) */
const DEMO_SUB_TITLES: Record<string, Record<string, string>> = {
  barber: { booking: 'Цаг захиалах', status: 'Миний захиалга', admin: 'Админ' },
  'pc-cafe': { booking: 'Захиалга', status: 'Миний захиалга', admin: 'Админ' },
  urgo: { menu: 'Цэс', cart: 'Сагс', track: 'Захиалга хянах', admin: 'Админ' },
  temuur: { admin: 'Админ' },
  uzeg: {
    browse: 'Нээлт',
    title: 'Контент',
    watch: 'Үзэж байна',
    watchlist: 'Миний жагсаалт',
    plans: 'Багцууд',
    admin: 'Админ',
  },
  nutag: { shop: 'Дэлгүүр', product: 'Бүтээгдэхүүн', cart: 'Сагс', orders: 'Миний захиалга', admin: 'Админ' },
}

export default function AppShell() {
  const hash = useHashRoute()
  const { segments } = parseHash(hash)

  // hash өөрчлөгдөхөд хуудсыг дээд хэсэг рүү гүйлгэнэ
  useEffect(() => {
    const scrollTo = sessionStorage.getItem('px-scroll-to')
    sessionStorage.removeItem('px-scroll-to')
    if (scrollTo) {
      // хэсэг рүү шилжихийг хүлээж буй — компонентууд render дууссаны дараа гүйлгэнэ
      const tryScroll = (attempt = 0) => {
        const el = document.getElementById(scrollTo)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        } else if (attempt < 10) {
          setTimeout(() => tryScroll(attempt + 1), 120)
        }
      }
      tryScroll()
    } else {
      window.scrollTo({ top: 0 })
    }
  }, [hash])

  // Зам бүрийн гарчигыг шинэчлэнэ
  useEffect(() => {
    const head = segments[0]
    if (head === 'demo') {
      const demoId = segments[1]
      const base = demoId ? DEMO_TITLES[demoId] : null
      const sub = segments.slice(2).join('/')
      const subLabel = demoId ? DEMO_SUB_TITLES[demoId]?.[sub] : undefined
      setPageTitle(base ? (subLabel ? `${base} — ${subLabel}` : base) : null)
    } else if (head === 'case') {
      const demoId = segments[1]
      const demo = demoId ? DEMOS.find((d) => d.id === demoId) : null
      setPageTitle(demo ? `Кейс: ${demo.name}` : 'Кейс')
    } else if (head && ROUTE_TITLES[head]) {
      setPageTitle(ROUTE_TITLES[head])
    } else {
      setPageTitle(null)
    }
  }, [hash, segments])

  const head = segments[0]

  if (head === 'demo') {
    const demoId = segments[1]
    if (demoId && DEMO_IDS.includes(demoId)) {
      const Demo = DEMO_COMPONENTS[demoId]
      return <Demo />
    }
  }

  if (head === 'case' && segments[1]) return <CasePage id={segments[1]} />

  if (head === 'privacy') return <PrivacyPage />
  if (head === 'terms') return <TermsPage />
  if (head === 'admin') return <AdminRedirect />

  return <AgencySite />
}
