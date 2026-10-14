"use client";
import { useState } from "react";
import Link from "next/link";
import { Scissors, Check, Trash2 } from "lucide-react";
import { money, uid, useLocal, useToast, Toast, Stat } from "./kit";

type Svc = { id: string; name: string; price: number; min: number };
type Booking = { id: string; svc: string; barber: string; date: string; time: string; name: string; phone: string; status: "Хүлээгдэж буй" | "Баталсан" | "Цуцалсан" };
const SVCS: Svc[] = [
  { id: "s1", name: "Классик үс засалт", price: 25000, min: 45 },
  { id: "s2", name: "Сахал хэлбэржүүлэлт", price: 15000, min: 30 },
  { id: "s3", name: "Үс + сахал багц", price: 35000, min: 60 },
  { id: "s4", name: "Халуун алчуураар хуссан", price: 30000, min: 40 },
];
const BARBERS = ["Бат", "Ананд", "Тэмүүжин"];
const TIMES = ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];
const gold = "#c9a24d";
const days = () => Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() + i); return d.toISOString().slice(0, 10); });

export function BarberSite() {
  const [svcs] = useLocal<Svc[]>("barber:svcs", SVCS);
  const [bookings, setBookings] = useLocal<Booking[]>("barber:bookings", []);
  const [f, setF] = useState({ svc: "", barber: BARBERS[0], date: days()[0], time: "", name: "", phone: "" });
  const [done, setDone] = useState<Booking | null>(null);
  const taken = (t: string) => bookings.some((b) => b.barber === f.barber && b.date === f.date && b.time === t && b.status !== "Цуцалсан");
  const ok = f.svc && f.time && f.name && f.phone.length >= 6;
  const submit = () => {
    const b: Booking = { id: uid(), svc: svcs.find((s) => s.id === f.svc)!.name, barber: f.barber, date: f.date, time: f.time, name: f.name, phone: f.phone, status: "Хүлээгдэж буй" };
    setBookings((p) => [b, ...p]); setDone(b);
  };
  return (
    <div className="min-h-screen bg-[#120e0a] text-[#f3ead9]" style={{ fontFamily: "Georgia, serif" }}>
      <nav className="sticky top-9 z-40 flex items-center justify-between border-b border-[#c9a24d]/30 bg-[#120e0a]/95 px-6 py-4 backdrop-blur">
        <a href="#top" className="flex items-center gap-2 text-xl tracking-[0.25em]" style={{ color: gold }}><Scissors size={20} /> BARBER&CO</a>
        <div className="flex items-center gap-6 text-sm uppercase tracking-widest">
          <a href="#services" className="hidden hover:text-[#c9a24d] sm:block">Үйлчилгээ</a>
          <a href="#team" className="hidden hover:text-[#c9a24d] sm:block">Мастерууд</a>
          <a href="#book" className="hover:text-[#c9a24d]">Цаг авах</a>
          <Link href="/demo/barber/admin" className="border border-[#c9a24d] px-3 py-1.5 text-[#c9a24d] hover:bg-[#c9a24d] hover:text-black">Admin</Link>
        </div>
      </nav>
      <header id="top" className="relative grid min-h-[70vh] place-items-center px-6 text-center" style={{ background: "radial-gradient(ellipse at center, #3a2a14 0%, #120e0a 70%)" }}>
        <div>
          <p className="mb-4 text-sm uppercase tracking-[0.5em]" style={{ color: gold }}>Est. 2015 · Улаанбаатар</p>
          <h1 className="text-5xl italic sm:text-7xl">Хурц ир. Цэвэр шугам.</h1>
          <p className="mx-auto mt-6 max-w-lg text-[#f3ead9]/70">Эрчүүдийн сонгодог үсчин. Онлайнаар цагаа 30 секундэд захиалаарай.</p>
          <a href="#book" className="mt-8 inline-block px-8 py-3 text-sm font-bold uppercase tracking-widest text-black" style={{ background: gold }}>Цаг захиалах</a>
        </div>
      </header>
      <section id="services" className="mx-auto max-w-4xl px-6 py-20">
        <h2 className="mb-10 text-center text-3xl italic" style={{ color: gold }}>Үйлчилгээ & үнэ</h2>
        {svcs.map((s) => (
          <div key={s.id} className="flex items-baseline gap-3 border-b border-dotted border-[#c9a24d]/40 py-4 text-lg">
            <span>{s.name}</span><span className="text-sm opacity-50">{s.min} мин</span><span className="ml-auto" style={{ color: gold }}>{money(s.price)}</span>
          </div>
        ))}
      </section>
      <section id="team" className="bg-[#1b150e] px-6 py-20">
        <h2 className="mb-10 text-center text-3xl italic" style={{ color: gold }}>Манай мастерууд</h2>
        <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-3">
          {BARBERS.map((b, i) => (
            <div key={b} className="border border-[#c9a24d]/30 p-6 text-center">
              <div className="mx-auto mb-4 grid h-20 w-20 place-items-center rounded-full text-3xl" style={{ background: gold, color: "#120e0a" }}>{b[0]}</div>
              <div className="text-xl">{b}</div><div className="text-sm opacity-60">{[8, 5, 3][i]} жилийн туршлага</div>
            </div>
          ))}
        </div>
      </section>
      <section id="book" className="mx-auto max-w-3xl px-6 py-20">
        <h2 className="mb-10 text-center text-3xl italic" style={{ color: gold }}>Цаг захиалах</h2>
        {done ? (
          <div className="border p-8 text-center" style={{ borderColor: gold }}>
            <Check className="mx-auto mb-3" style={{ color: gold }} size={40} />
            <p className="text-2xl italic">Захиалга бүртгэгдлээ!</p>
            <p className="mt-3 opacity-70">#{done.id} · {done.svc} · {done.barber}<br />{done.date} {done.time}</p>
            <button onClick={() => { setDone(null); setF({ ...f, svc: "", time: "" }); }} className="mt-6 underline">Дахин захиалах</button>
          </div>
        ) : (
          <div className="space-y-7">
            <div><p className="mb-3 text-sm uppercase tracking-widest opacity-60">1. Үйлчилгээ</p>
              <div className="grid gap-2 sm:grid-cols-2">{svcs.map((s) => <button key={s.id} onClick={() => setF({ ...f, svc: s.id })} className={`border px-4 py-3 text-left ${f.svc === s.id ? "bg-[#c9a24d] text-black" : "border-[#c9a24d]/40"}`}>{s.name} <span className="float-right">{money(s.price)}</span></button>)}</div></div>
            <div><p className="mb-3 text-sm uppercase tracking-widest opacity-60">2. Мастер</p>
              <div className="flex gap-2">{BARBERS.map((b) => <button key={b} onClick={() => setF({ ...f, barber: b, time: "" })} className={`border px-5 py-2 ${f.barber === b ? "bg-[#c9a24d] text-black" : "border-[#c9a24d]/40"}`}>{b}</button>)}</div></div>
            <div><p className="mb-3 text-sm uppercase tracking-widest opacity-60">3. Өдөр & цаг</p>
              <div className="mb-3 flex flex-wrap gap-2">{days().map((d) => <button key={d} onClick={() => setF({ ...f, date: d, time: "" })} className={`border px-3 py-2 text-sm ${f.date === d ? "bg-[#c9a24d] text-black" : "border-[#c9a24d]/40"}`}>{d.slice(5)}</button>)}</div>
              <div className="flex flex-wrap gap-2">{TIMES.map((t) => <button key={t} disabled={taken(t)} onClick={() => setF({ ...f, time: t })} className={`border px-3 py-2 text-sm disabled:line-through disabled:opacity-30 ${f.time === t ? "bg-[#c9a24d] text-black" : "border-[#c9a24d]/40"}`}>{t}</button>)}</div></div>
            <div className="grid gap-3 sm:grid-cols-2">
              <input placeholder="Нэр" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} className="border border-[#c9a24d]/40 bg-transparent px-4 py-3 outline-none focus:border-[#c9a24d]" />
              <input placeholder="Утас" inputMode="tel" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} className="border border-[#c9a24d]/40 bg-transparent px-4 py-3 outline-none focus:border-[#c9a24d]" />
            </div>
            <button disabled={!ok} onClick={submit} className="w-full py-4 font-bold uppercase tracking-widest text-black disabled:opacity-30" style={{ background: gold }}>Баталгаажуулах</button>
          </div>
        )}
      </section>
    </div>
  );
}

export function BarberAdmin() {
  const [svcs, setSvcs] = useLocal<Svc[]>("barber:svcs", SVCS);
  const [bookings, setBookings] = useLocal<Booking[]>("barber:bookings", []);
  const [toast, say] = useToast();
  const set = (id: string, status: Booking["status"]) => { setBookings((p) => p.map((b) => (b.id === id ? { ...b, status } : b))); say(`Төлөв: ${status}`); };
  const income = bookings.filter((b) => b.status === "Баталсан").reduce((a, b) => a + (svcs.find((s) => s.name === b.svc)?.price ?? 0), 0);
  return (
    <div className="min-h-screen bg-[#1b150e] text-[#f3ead9]" style={{ fontFamily: "Georgia, serif" }}>
      <nav className="flex items-center justify-between border-b border-[#c9a24d]/30 px-6 py-4">
        <span className="tracking-[0.25em]" style={{ color: gold }}>BARBER&CO · ADMIN</span>
        <Link href="/demo/barber" className="border border-[#c9a24d] px-3 py-1.5 text-sm text-[#c9a24d]">← Сайт руу</Link>
      </nav>
      <div className="mx-auto max-w-5xl space-y-8 p-6">
        <div className="grid gap-3 sm:grid-cols-3">
          <Stat cls="bg-black/30" label="Нийт захиалга" value={bookings.length} />
          <Stat cls="bg-black/30" label="Хүлээгдэж буй" value={bookings.filter((b) => b.status === "Хүлээгдэж буй").length} />
          <Stat cls="bg-black/30" label="Баталсан орлого" value={money(income)} />
        </div>
        <section><h2 className="mb-3 text-xl italic" style={{ color: gold }}>Захиалгууд</h2>
          {bookings.length === 0 && <p className="opacity-60">Одоогоор захиалга алга. Сайтаас цаг захиалж туршаарай.</p>}
          <div className="space-y-2">{bookings.map((b) => (
            <div key={b.id} className="flex flex-wrap items-center gap-3 border border-[#c9a24d]/20 bg-black/20 p-3 text-sm">
              <b>#{b.id}</b><span>{b.name} · {b.phone}</span><span className="opacity-70">{b.svc} · {b.barber} · {b.date} {b.time}</span>
              <span className="ml-auto rounded px-2 py-0.5 text-xs" style={{ background: gold, color: "#000" }}>{b.status}</span>
              <button onClick={() => set(b.id, "Баталсан")} className="underline">Батлах</button>
              <button onClick={() => set(b.id, "Цуцалсан")} className="underline">Цуцлах</button>
              <button aria-label="Устгах" onClick={() => setBookings((p) => p.filter((x) => x.id !== b.id))}><Trash2 size={15} /></button>
            </div>))}</div>
        </section>
        <section><h2 className="mb-3 text-xl italic" style={{ color: gold }}>Үнийн жагсаалт</h2>
          {svcs.map((s) => (
            <div key={s.id} className="mb-2 flex items-center gap-3 text-sm">
              <input value={s.name} onChange={(e) => setSvcs((p) => p.map((x) => (x.id === s.id ? { ...x, name: e.target.value } : x)))} className="flex-1 border border-[#c9a24d]/30 bg-transparent px-3 py-2" />
              <input type="number" value={s.price} onChange={(e) => setSvcs((p) => p.map((x) => (x.id === s.id ? { ...x, price: +e.target.value } : x)))} className="w-28 border border-[#c9a24d]/30 bg-transparent px-3 py-2" />
            </div>))}
          <button onClick={() => { setSvcs((p) => [...p, { id: uid(), name: "Шинэ үйлчилгээ", price: 20000, min: 30 }]); say("Нэмэгдлээ"); }} className="mt-2 border border-[#c9a24d] px-4 py-2 text-sm" style={{ color: gold }}>+ Үйлчилгээ нэмэх</button>
        </section>
      </div>
      <Toast msg={toast} />
    </div>
  );
}
