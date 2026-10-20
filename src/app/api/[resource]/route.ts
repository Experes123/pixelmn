import { NextRequest, NextResponse } from 'next/server'
import { RESOURCES, sanitize, getDelegate } from '@/lib/resources'
import { isAdminRequest } from '@/lib/auth'
import { applyStockDeduction } from '@/lib/stock-sync'

/** GET /api/[resource] — жагсаалт; ?key= түлхүүрээр нэг бичилт (site-content/company-content) */
export async function GET(req: NextRequest, ctx: { params: Promise<{ resource: string }> }) {
  const { resource } = await ctx.params
  const spec = RESOURCES[resource]
  if (!spec) return NextResponse.json({ error: 'Ийм нөөц олдсонгүй' }, { status: 404 })
  const delegate = getDelegate(spec.model)
  const key = req.nextUrl.searchParams.get('key')
  try {
    if (key && spec.fields.includes('key')) {
      const one = await delegate.findFirst({ where: { key } })
      return NextResponse.json(one ?? null)
    }
    const list = await delegate.findMany({ orderBy: spec.orderBy ?? { createdAt: 'desc' } })
    return NextResponse.json(list)
  } catch (e) {
    console.error(`GET ${resource} failed`, e)
    return NextResponse.json({ error: 'Мэдээлэл авахад алдаа гарлаа' }, { status: 500 })
  }
}

/**
 * POST /api/[resource] — шинэ бичилт үүсгэх.
 * · submission нөөц (маягт, захиалга, бүртгэл) — нийтэд нээлттэй
 * · content нөөц (үнэ, текст, каталог) — зөвхөн админ сесс шаардана
 */
export async function POST(req: NextRequest, ctx: { params: Promise<{ resource: string }> }) {
  const { resource } = await ctx.params
  const spec = RESOURCES[resource]
  if (!spec) return NextResponse.json({ error: 'Ийм нөөц олдсонгүй' }, { status: 404 })

  const isSubmission = spec.kind === 'submission'
  if (!isSubmission && !isAdminRequest(req)) {
    return NextResponse.json(
      { error: 'Удирдах эрх шаардлагатай. /admin хаягаар нэвтэрнэ үү.' },
      { status: 401 }
    )
  }

  const delegate = getDelegate(spec.model)
  try {
    const body = await req.json()
    const data = sanitize(spec, body, false)
    const created = await delegate.create({ data })
    // НУТАГ демо логик: төлөгдсөн захиалгаар үлдэгдлийг автомат хасна
    if (resource === 'shop-orders') await applyStockDeduction(created as { id: string; items: unknown; meta: unknown; paymentStatus: string })
    return NextResponse.json(created, { status: 201 })
  } catch (e) {
    console.error(`POST ${resource} failed`, e)
    return NextResponse.json({ error: 'Үүсгэхэд алдаа гарлаа. Талбаруудыг шалгана уу.' }, { status: 400 })
  }
}
