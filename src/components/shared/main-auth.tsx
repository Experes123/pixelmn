'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Loader2, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

/**
 * Нийтийн хуудсууд дээр (демо админ г.м.) хамгаалагдсан үйлдэл хийхэд
 * сервер 401 буцаавал энэ цонх нээгдэж, нууц үгээр сесс тогтооно.
 * use-api.ts нь 'px-need-auth' event-ийг илгээдэг.
 */
export function AdminAuthDialog() {
  const [open, setOpen] = useState(false)
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const onNeed = () => setOpen(true)
    window.addEventListener('px-need-auth', onNeed)
    return () => window.removeEventListener('px-need-auth', onNeed)
  }, [])

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
        setOpen(false)
        setPassword('')
        toast.success('Амжилттай нэвтэрлээ. Үйлдлээ дахин хийнэ үү.')
      } else {
        setError(j.error || 'Нэвтрэхэд алдаа гарлаа.')
      }
    } catch {
      setError('Сүлжээний алдаа гарлаа. Дахин оролдоно уу.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o)
        if (!o) {
          setPassword('')
          setError(null)
        }
      }}
    >
      <DialogContent className="rounded-2xl sm:max-w-sm">
        <DialogHeader>
          <div className="mx-auto mb-1 flex h-11 w-11 items-center justify-center rounded-full bg-[#E4572E]/10">
            <Lock className="h-5 w-5 text-[#E4572E]" aria-hidden="true" />
          </div>
          <DialogTitle className="text-center text-lg font-extrabold tracking-tight">
            Админ нэвтрэлт шаардлагатай
          </DialogTitle>
          <DialogDescription className="text-center leading-relaxed">
            Энэ үйлдэл нь хамгаалагдсан. Үргэлжлүүлэхийн тулд админ нууц үгээ оруулна уу.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="global-admin-password" className="text-[12.5px] font-semibold text-black/60">
              Нууц үг
            </Label>
            <Input
              id="global-admin-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError(null)
              }}
              placeholder="••••••••"
              aria-invalid={!!error}
              className="h-11 rounded-xl"
            />
            {error && (
              <p role="alert" className="text-[12.5px] font-medium text-red-600">
                {error}
              </p>
            )}
          </div>
          <Button
            type="submit"
            disabled={!password || busy}
            className="h-11 w-full rounded-xl bg-[#0B0B0C] font-semibold hover:bg-black/80"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Нэвтрэх'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
