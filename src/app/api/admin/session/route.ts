import { NextRequest, NextResponse } from 'next/server'
import { isAdminRequest } from '@/lib/auth'

/** GET /api/admin/session — админ эрх идэвхтэй эсэхийг хэлнэ */
export async function GET(req: NextRequest) {
  return NextResponse.json({ authed: isAdminRequest(req) })
}
