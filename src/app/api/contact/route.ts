import { NextResponse } from "next/server";
import { validate, type ContactInput } from "@/lib/contact";

export const runtime = "nodejs";
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

export async function POST(req: Request) {
  let body: Partial<ContactInput> & { website?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Хүсэлт буруу байна." }, { status: 400 }); }

  // Honeypot: bots fill this hidden field. Pretend success.
  if (body.website) return NextResponse.json({ ok: true });

  const v: ContactInput = {
    name: String(body.name ?? ""), email: String(body.email ?? ""), company: String(body.company ?? ""),
    service: String(body.service ?? ""), budget: String(body.budget ?? ""), message: String(body.message ?? ""),
  };
  const errors = validate(v);
  if (Object.keys(errors).length) return NextResponse.json({ error: "Тодруулсан талбаруудыг шалгана уу.", errors }, { status: 422 });

  const key = process.env.RESEND_API_KEY, to = process.env.CONTACT_TO_EMAIL, from = process.env.CONTACT_FROM_EMAIL;
  if (!key || !to || !from) {
    console.error("Contact form: RESEND_API_KEY, CONTACT_TO_EMAIL and CONTACT_FROM_EMAIL must be set.");
    return NextResponse.json({ error: "Хүсэлтийн маягт одоогоор холбогдоогүй байна. Бидэнд имэйлээр шууд бичнэ үү." }, { status: 503 });
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from, to: [to], reply_to: v.email.trim(),
        subject: `Шинэ хүсэлт: ${v.service} — ${v.name.trim()}`,
        html: `<h2>Төслийн шинэ хүсэлт</h2><p><b>Нэр:</b> ${esc(v.name)}<br><b>Имэйл:</b> ${esc(v.email)}<br><b>Компани:</b> ${esc(v.company || "—")}<br><b>Үйлчилгээ:</b> ${esc(v.service)}<br><b>Төсөв:</b> ${esc(v.budget)}</p><p>${esc(v.message).replace(/\n/g, "<br>")}</p>`,
      }),
    });
    if (!res.ok) { console.error("Resend error", res.status, await res.text()); throw new Error("provider"); }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Таны мессежийг илгээж чадсангүй. Дахин оролдох эсвэл бидэнд имэйлээр бичнэ үү." }, { status: 502 });
  }
}
