import { NextRequest, NextResponse } from 'next/server'
import { RESOURCES, sanitize, sanitizePublicPatch, sanitizeMetaCounter, getDelegate } from '@/lib/resources'
import { isAdminRequest } from '@/lib/auth'
import { applyStockDeduction } from '@/lib/stock-sync'

/** GET /api/[resource]/[id] — нэг бичилт */
export async function GET(_req: NextRequest, ctx: { params: Promise<{ resource: string; id: string }> }) {
  const { resource, id } = await ctx.params
  const spec = RESOURCES[resource]
  if (!spec) return NextResponse.json({ error: 'Ийм нөөц олдсонгүй' }, { status: 404 })
  try {
    const one = await getDelegate(spec.model).findUnique({ where: { id } })
    if (!one) return NextResponse.json({ error: 'Олдсонгүй' }, { status: 404 })
    return NextResponse.json(one)
  } catch (e) {
    console.error(`GET ${resource}/${id} failed`, e)
    return NextResponse.json({ error: 'Мэдээлэл авахад алдаа гарлаа' }, { status: 500 })
  }
}

const AUTH_ERROR = 'Удирдах эрх шаардлагатай. /admin хаягаар нэвтэрнэ үү.'

/**
 * PATCH/PUT /api/[resource]/[id] — шинэчлэх.
 * · Админ сесс: бүх зөвшөөрөгдсөн талбар
 * · Нэвтрээгүй: submission нөөцийн цөөн талбар (жишээ: төлбөрийн төлөв,
 *   захиалга цуцлах) эсвэл stream-titles үзэлтийн тоолуур meta
 */
export async function PATCH(req: NextRequest, ctx: { params: Promise<{ resource: string; id: string }> }) {
  const { resource, id } = await ctx.params
  const spec = RESOURCES[resource]
  if (!spec) return NextResponse.json({ error: 'Ийм нөөц олдсонгүй' }, { status: 404 })

  let body: unknown = null
  try {
    body = await req.json()
  } catch {
    body = null
  }

  const admin = isAdminRequest(req)
  const delegate = getDelegate(spec.model)

  let data: Record<string, unknown> | null = null
  try {
    if (admin) {
      data = sanitize(spec, body, true)
    } else {
      // нийтийн submission шинэчлэл (төлбөр, цуцлалт)
      data = sanitizePublicPatch(spec, body)
      // үзэлтийн тоолуур (зөвхөн views/watchSeconds тоо)
      if (!data && spec.publicMetaCounter) {
        const counter = sanitizeMetaCounter(body)
        if (counter) {
          const cur = await delegate.findUnique({ where: { id } })
          if (cur) {
            const prevMeta = (cur as { meta?: unknown }).meta
            const base = prevMeta && typeof prevMeta === 'object' && !Array.isArray(prevMeta) ? prevMeta : {}
            data = { meta: { ...(base as Record<string, unknown>), ...counter } }
          }
        }
      }
      if (!data) return NextResponse.json({ error: AUTH_ERROR }, { status: 401 })
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: 'Шинэчлэх талбар илгээгдээгүй' }, { status: 400 })
    }
    const updated = await delegate.update({ where: { id }, data })
    // НУТАГ демо логик: төлбөр төлөгдсөн бол үлдэгдлийг автомат хасна (давхардахгүй)
    if (resource === 'shop-orders') await applyStockDeduction(updated as { id: string; items: unknown; meta: unknown; paymentStatus: string })
    return NextResponse.json(updated)
  } catch (e) {
    console.error(`PATCH ${resource}/${id} failed`, e)
    return NextResponse.json({ error: 'Шинэчлэхэд алдаа гарлаа. Бичилт байхгүй эсвэл талбар буруу.' }, { status: 400 })
  }
}

export async function PUT(req: NextRequest, ctx: { params: Promise<{ resource: string; id: string }> }) {
  return PATCH(req, ctx)
}

/** DELETE /api/[resource]/[id] — устгах (зөвхөн админ) */
export async function DELETE(req: NextRequest, ctx: { params: Promise<{ resource: string; id: string }> }) {
  const { resource, id } = await ctx.params
  const spec = RESOURCES[resource]
  if (!spec) return NextResponse.json({ error: 'Ийм нөөц олдсонгүй' }, { status: 404 })

  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: AUTH_ERROR }, { status: 401 })
  }

  try {
    await getDelegate(spec.model).delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error(`DELETE ${resource}/${id} failed`, e)
    return NextResponse.json({ error: 'Устгахад алдаа гарлаа. Бичилт олдсонгүй.' }, { status: 400 })
  }
}
