import { NextResponse } from "next/server";
import { COOKIE, adminEnabled, checkPassword, sessionValue } from "@/lib/auth";

const fails = new Map<string, { n: number; t: number }>();

export async function POST(req: Request) {
  if (!adminEnabled()) return NextResponse.json({ error: "ADMIN_PASSWORD (8+ тэмдэгт) тохируулаагүй байна." }, { status: 503 });
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "local";
  const f = fails.get(ip);
  if (f && f.n >= 5 && Date.now() - f.t < 15 * 60_000) return NextResponse.json({ error: "Хэт олон оролдлого. 15 минутын дараа дахин оролдоно уу." }, { status: 429 });
  const { password } = await req.json().catch(() => ({ password: "" }));
  if (!checkPassword(String(password ?? ""))) {
    fails.set(ip, { n: (f && Date.now() - f.t < 15 * 60_000 ? f.n : 0) + 1, t: Date.now() });
    return NextResponse.json({ error: "Нууц үг буруу байна." }, { status: 401 });
  }
  fails.delete(ip);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, sessionValue(), { httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 7 });
  return res;
}
