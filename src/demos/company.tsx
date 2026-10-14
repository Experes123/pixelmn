"use client";
import { useState } from "react";
import Link from "next/link";
import { Building2, Globe2, ShieldCheck, TrendingUp, Trash2 } from "lucide-react";
import { uid, useLocal, useToast, Toast, Stat } from "./kit";

type Site = { headline: string; sub: string; about: string };
type Lead = { id: string; name: string; email: string; msg: string; done: boolean; at: string };
const SITE: Site = { headline: "Бизнесийн найдвартай түнш", sub: "Логистик, санхүү, зөвлөх үйлчилгээг нэг дор — 2008 оноос.", about: "Northwind Group нь 15 жилийн турш Монгол, Хятад, Орост бизнес эрхлэгчдэд үйлчилж, 300 гаруй байгууллагын өсөлтөд хувь нэмэр оруулсан." };
const TEAM = [["Д. Золбоо", "Гүйцэтгэх захирал"], ["Б. Сарнай", "Санхүүгийн захирал"], ["Н. Эрдэнэ", "Үйл ажиллагааны захирал"]];
const blue = "#13579a";

export function CompanySite() {
  const [s] = useLocal<Site>("company:site", SITE);
  const [, setLeads] = useLocal<Lead[]>("company:leads", []);
  const [f, setF] = useState({ name: "", email: "", msg: "" });
  const [sent, setSent] = useState(false);
  const icons = [Globe2, ShieldCheck, TrendingUp];
  return (
    <div className="min-h-screen bg-white text-slate-800" style={{ fontFamily: "system-ui, sans-serif" }}>
      <nav className="sticky top-9 z-40 flex items-center justify-between border-b bg-white/95 px-6 py-4 backdrop-blur">
        <a href="#top" className="flex items-center gap-2 text-lg font-bold text-[#0b2545]"><Building2 style={{ color: blue }} /> Northwind</a>
        <div className="flex items-center gap-6 text-sm font-medium">
          {["Үйлчилгээ", "Тухай", "Баг"].map((l, i) => <a key={l} href={["#svc", "#about", "#team"][i]} className="hidden hover:text-[#13579a] sm:block">{l}</a>)}
          <a href="#contact" className="hover:text-[#13579a]">Холбогдох</a>
          <Link href="/demo/company/admin" className="rounded-md bg-[#0b2545] px-4 py-2 text-white hover:bg-[#13579a]">Admin</Link>
        </div>
      </nav>
      <header id="top" className="bg-[#0b2545] px-6 py-24 text-white" style={{ backgroundImage: "linear-gradient(120deg,#0b2545,#13579a)" }}>
        <div className="mx-auto max-w-5xl"><p className="mb-3 text-sm uppercase tracking-widest text-sky-300">Northwind Group</p><h1 className="max-w-2xl text-4xl font-bold leading-tight sm:text-6xl">{s.headline}</h1><p className="mt-5 max-w-xl text-lg text-sky-100">{s.sub}</p>
          <a href="#contact" className="mt-8 inline-block rounded-md bg-white px-6 py-3 font-semibold text-[#0b2545]">Үнийн санал авах</a></div>
      </header>
      <section className="border-b"><div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 px-6 py-10 text-center sm:grid-cols-4">{[["15+", "жил"], ["300+", "харилцагч"], ["3", "улс"], ["98%", "сэтгэл ханамж"]].map(([a, b]) => <div key={b}><div className="text-3xl font-bold text-[#13579a]">{a}</div><div className="text-sm text-slate-500">{b}</div></div>)}</div></section>
      <section id="svc" className="mx-auto max-w-5xl px-6 py-20"><h2 className="mb-10 text-3xl font-bold text-[#0b2545]">Үйлчилгээ</h2>
        <div className="grid gap-6 sm:grid-cols-3">{[["Олон улсын логистик", "Хятад, Орос чиглэлийн ачаа тээвэр, гаалийн бүрдүүлэлт."], ["Санхүү & аудит", "Тайлан, татвар, дотоод хяналтын зөвлөх үйлчилгээ."], ["Бизнес стратеги", "Зах зээлийн судалгаа, өсөлтийн төлөвлөгөө."]].map(([t, d], i) => { const I = icons[i]; return <div key={t} className="rounded-xl border p-6 transition hover:shadow-lg"><I className="mb-4 text-[#13579a]" /><h3 className="font-semibold">{t}</h3><p className="mt-2 text-sm text-slate-500">{d}</p></div>; })}</div></section>
      <section id="about" className="bg-slate-50 px-6 py-20"><div className="mx-auto max-w-3xl"><h2 className="mb-4 text-3xl font-bold text-[#0b2545]">Бидний тухай</h2><p className="text-lg leading-relaxed text-slate-600">{s.about}</p></div></section>
      <section id="team" className="mx-auto max-w-5xl px-6 py-20"><h2 className="mb-10 text-3xl font-bold text-[#0b2545]">Удирдлагын баг</h2>
        <div className="grid gap-6 sm:grid-cols-3">{TEAM.map(([n, r]) => <div key={n} className="text-center"><div className="mx-auto mb-3 grid h-24 w-24 place-items-center rounded-full bg-[#13579a] text-3xl font-bold text-white">{n[3]}</div><div className="font-semibold">{n}</div><div className="text-sm text-slate-500">{r}</div></div>)}</div></section>
      <section id="contact" className="bg-[#0b2545] px-6 py-20 text-white"><div className="mx-auto max-w-xl"><h2 className="mb-6 text-3xl font-bold">Холбоо барих</h2>
        {sent ? <p className="rounded-lg bg-white/10 p-6">✔ Баярлалаа! Бид 24 цагийн дотор хариу өгнө. <button className="ml-2 underline" onClick={() => setSent(false)}>Дахин илгээх</button></p> : (
          <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); setLeads((p) => [{ id: uid(), ...f, done: false, at: new Date().toLocaleString("mn-MN") }, ...p]); setF({ name: "", email: "", msg: "" }); setSent(true); }}>
            <input required placeholder="Нэр" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} className="w-full rounded-md px-4 py-3 text-slate-900" />
            <input required type="email" placeholder="Имэйл" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} className="w-full rounded-md px-4 py-3 text-slate-900" />
            <textarea required rows={4} placeholder="Зурвас" value={f.msg} onChange={(e) => setF({ ...f, msg: e.target.value })} className="w-full rounded-md px-4 py-3 text-slate-900" />
            <button className="rounded-md bg-sky-400 px-6 py-3 font-semibold text-[#0b2545]">Илгээх</button></form>)}</div></section>
    </div>
  );
}

export function CompanyAdmin() {
  const [s, setS] = useLocal<Site>("company:site", SITE);
  const [leads, setLeads] = useLocal<Lead[]>("company:leads", []);
  const [toast, say] = useToast();
  return (
    <div className="min-h-screen bg-slate-100 text-slate-800" style={{ fontFamily: "system-ui, sans-serif" }}>
      <nav className="flex items-center justify-between bg-[#0b2545] px-6 py-4 text-white"><b>Northwind · Admin</b><Link href="/demo/company" className="rounded-md bg-white px-4 py-1.5 text-sm font-semibold text-[#0b2545]">← Сайт руу</Link></nav>
      <div className="mx-auto max-w-4xl space-y-8 p-6">
        <div className="grid gap-3 sm:grid-cols-3"><Stat cls="bg-white shadow-sm" label="Нийт хүсэлт" value={leads.length} /><Stat cls="bg-white shadow-sm" label="Шинэ" value={leads.filter((l) => !l.done).length} /><Stat cls="bg-white shadow-sm" label="Хариу өгсөн" value={leads.filter((l) => l.done).length} /></div>
        <section className="rounded-xl bg-white p-5 shadow-sm"><h2 className="mb-3 font-bold">Нүүр хуудасны агуулга</h2>
          {(["headline", "sub", "about"] as const).map((k) => <label key={k} className="mb-3 block text-sm"><span className="mb-1 block text-slate-500">{{ headline: "Гарчиг", sub: "Дэд гарчиг", about: "Бидний тухай" }[k]}</span><textarea rows={k === "about" ? 3 : 1} value={s[k]} onChange={(e) => setS({ ...s, [k]: e.target.value })} className="w-full rounded-md border px-3 py-2" /></label>)}
          <button onClick={() => say("Хадгалагдлаа (автоматаар)")} className="rounded-md bg-[#13579a] px-4 py-2 text-sm font-semibold text-white">Хадгалах</button>
          <button onClick={() => { setS(SITE); say("Анхны утга"); }} className="ml-2 text-sm underline">Анхны утга</button></section>
        <section className="rounded-xl bg-white p-5 shadow-sm"><h2 className="mb-3 font-bold">Ирсэн хүсэлтүүд</h2>
          {leads.length === 0 && <p className="text-sm text-slate-500">Хүсэлт алга. Сайтын &quot;Холбоо барих&quot; формоор илгээж үзээрэй.</p>}
          {leads.map((l) => <div key={l.id} className="flex items-start gap-3 border-t py-3 text-sm"><div className="flex-1"><b>{l.name}</b> <span className="text-slate-500">· {l.email} · {l.at}</span><p className="mt-1">{l.msg}</p></div>
            <button onClick={() => setLeads((p) => p.map((x) => (x.id === l.id ? { ...x, done: !x.done } : x)))} className={`rounded-full px-3 py-1 text-xs font-semibold ${l.done ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>{l.done ? "Хариу өгсөн" : "Шинэ"}</button>
            <button aria-label="Устгах" onClick={() => setLeads((p) => p.filter((x) => x.id !== l.id))}><Trash2 size={15} /></button></div>)}</section>
      </div>
      <Toast msg={toast} />
    </div>
  );
}
