'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Loader2, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LogoMark } from '@/components/agency/brand'
import { DISPLAY_FONT } from '@/config/agency'

/**
 * ───────────────── Админ нэвтрэх хуудас ─────────────────
 * Сервер талд сесс шалгагдаж, хүчингүй бол энэ хэлбэр гарна.
 * Нууц үг зөв бол httpOnly сесс cookie тогтоогдож, сервер дахин render хийнэ.
 */
export function AdminLogin() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password || busy) return
    setBusy(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const j = (await res.json().catch(() => ({}))) as { error?: string }
      if (res.ok) {
        // Сесс тогтсон — сервер талын шалгалтыг дахин ажиллуулна
        router.refresh()
      } else {
        setError(j.error || 'Нэвтрэхэд алдаа гарлаа.')
        setBusy(false)
      }
    } catch {
      setError('Сүлжээний алдаа гарлаа. Дахин оролдоно уу.')
      setBusy(false)
    }
  }

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center bg-[#F2F1EE] px-4"
      style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
    >
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-2xl border border-black/[0.08] bg-white p-7 shadow-[0_10px_40px_-18px_rgba(11,11,12,0.25)]"
        aria-labelledby="admin-login-title"
      >
        <div className="mb-5 flex items-center justify-center gap-2.5">
          <LogoMark size={34} />
          <span style={DISPLAY_FONT} className="text-lg font-extrabold tracking-tight">
            PIXELMN <span className="font-semibold text-black/40">Админ</span>
          </span>
        </div>

        <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#E4572E]/10">
          <Lock className="h-5 w-5 text-[#E4572E]" aria-hidden="true" />
        </div>

        <h1 id="admin-login-title" className="text-center text-[15px] font-bold text-[#0B0B0C]">
          Админ нууц үгээ оруулна уу
        </h1>
        <p className="mt-1.5 text-center text-[12.5px] leading-relaxed text-black/50">
          Энэ хэсэг нь сервер талын хамгаалалттай. Нэвтрэлт амжилттай бол 12 цагийн сесс
          тогтоогдоно.
        </p>

        <div className="mt-5 flex flex-col gap-1.5">
          <Label htmlFor="admin-password" className="text-[12.5px] font-semibold text-black/60">
            Нууц үг
          </Label>
          <Input
            id="admin-password"
            type="password"
            autoComplete="current-password"
            autoFocus
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setError(null)
            }}
            placeholder="••••••••"
            aria-invalid={!!error}
            aria-describedby={error ? 'admin-login-error' : undefined}
            className="h-11 rounded-xl"
          />
          {error && (
            <p id="admin-login-error" role="alert" className="text-[12.5px] font-medium text-red-600">
              {error}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={!password || busy}
          className="mt-4 h-11 w-full rounded-xl bg-[#0B0B0C] font-semibold hover:bg-black/80"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Нэвтрэх'}
        </Button>

        <a
          href="/"
          className="mt-3 flex items-center justify-center gap-1.5 text-[12.5px] font-medium text-black/45 underline-offset-2 hover:text-black/80 hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          Сайт руу буцах
        </a>
      </form>

      <p className="mt-5 max-w-xs text-center text-[11.5px] leading-relaxed text-black/35">
        Нууц үгээ мартсан бол серверийн .env файл дахь ADMIN_PASSWORD утгыг шинэчилнэ үү.
      </p>
    </div>
  )
}
