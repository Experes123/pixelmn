'use client'

/**
 * ТЭМҮҮР Групп — Demo 4 (editorial corporate, graphite + copper).
 * Routes: '' → single-page corporate site, 'admin' → демо админ панель.
 */

import { Toaster } from '@/components/ui/sonner'
import { ReturnToMain } from '@/components/shared/demo-kit'
import { useDemoRoute } from '@/lib/hash-router'
import { SERIF, C } from './config'
import { Header, Footer } from './chrome'
import HomePage from './home'
import AdminPage from './admin'

export default function TemuurDemo() {
  const { sub } = useDemoRoute('temuur')
  const isAdmin = sub === 'admin'

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{ fontFamily: SERIF, background: C.paper, color: C.ink }}
    >
      <ReturnToMain accent={C.copper} />
      {isAdmin ? (
        <AdminPage />
      ) : (
        <>
          <Header />
          <main className="flex-1">
            <HomePage />
          </main>
          <Footer />
        </>
      )}
      <Toaster position="top-center" richColors closeButton />
    </div>
  )
}
