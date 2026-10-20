import type { Prisma } from '@prisma/client'
import { db } from '@/lib/db'

const PAID = 'төлөгдсөн'

type OrderItemLike = { id?: unknown; qty?: unknown }

/**
 * НУТАГ демо бизнес логик: төлөгдсөн захиалгаар бүтээгдэхүүний үлдэгдлийг
 * автоматаар хасна. meta.stockApplied тэмдэглэгээгээр давхар хасахаас сэргийлнэ.
 * Үлдэгдлийн өөрчлөлт meta.stockLog-д «Захиалга (автомат)» гэж бүртгэнэ.
 * Алдаа гарвал захиалгын урсгалд нөлөөлөхгүйгээр логдоно (демо зөөлөн горим).
 */
export async function applyStockDeduction(order: {
  id: string
  items: unknown
  meta: unknown
  paymentStatus: string
}): Promise<void> {
  try {
    if (order.paymentStatus !== PAID) return
    const meta = (order.meta && typeof order.meta === 'object' ? order.meta : {}) as Record<string, unknown>
    if (meta.stockApplied === true) return

    const rawItems = Array.isArray(order.items) ? (order.items as OrderItemLike[]) : []
    const lines = rawItems
      .map((it) => ({
        id: typeof it?.id === 'string' ? it.id : null,
        qty: typeof it?.qty === 'number' ? Math.max(0, Math.floor(it.qty)) : 0,
      }))
      .filter((l): l is { id: string; qty: number } => !!l.id && l.qty > 0)
    if (lines.length === 0) return

    for (const line of lines) {
      const p = await db.product.findUnique({ where: { id: line.id } })
      if (!p) continue
      const from = p.stock
      const to = Math.max(0, from - line.qty)
      if (to === from) continue

      const pMeta = (p.meta && typeof p.meta === 'object' ? p.meta : {}) as Record<string, unknown>
      const rawLog = Array.isArray(pMeta.stockLog) ? pMeta.stockLog : []
      const entry = { at: new Date().toISOString(), from, to, by: 'Захиалга (автомат)' }
      await db.product.update({
        where: { id: p.id },
        data: {
          stock: to,
          meta: { ...pMeta, stockLog: [entry, ...rawLog].slice(0, 20) } as unknown as Prisma.InputJsonValue,
        },
      })
    }

    await db.shopOrder.update({
      where: { id: order.id },
      data: {
        meta: { ...meta, stockApplied: true, stockAppliedAt: new Date().toISOString() } as unknown as Prisma.InputJsonValue,
      },
    })
  } catch (e) {
    console.error('applyStockDeduction failed', e)
  }
}
