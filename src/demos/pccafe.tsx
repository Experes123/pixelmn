"use client";
import { useState } from "react";
import Link from "next/link";
import { Monitor, Zap } from "lucide-react";
import { money, uid, useLocal, useToast, Toast, Stat } from "./kit";

type Pc = { id: number; zone: "Standard" | "VIP" | "Pro"; state: "ok" | "repair" };
type Res = { id: string; pc: number; hour: string; hours: number; name: string; phone: string; status: "Захиалсан" | "Тоглож байна" | "Дууссан" };
const RATES = { Standard: 3500, VIP: 5500, Pro: 8000 } as const;
const ZONE_COLOR = { Standard: "#22d3ee", VIP: "#c084fc", Pro: "#f472b6" } as const;
const PCS: Pc[] = Array.from({ length: 24 }, (_, i) => ({ id: i + 1, zone: i < 12 ? "Standard" : i < 20 ? "VIP" : "Pro", state: "ok" }));
const HOURS = ["12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"];
const specs = { Standard: "i5 · RTX 3060 · 144Hz", VIP: "i7 · RTX 4070 · 240Hz", Pro: "i9 · RTX 4080 · 360Hz" };

export function PcSite() {
  const [pcs] = useLocal<Pc[]>("pc:pcs", PCS);
  const [res, setRes] = useLocal<Res[]>("pc:res", []);
  const [hour, setHour] = useState("18:00");
  const [hours, setHours] = useState(2);
  const [sel, setSel] = useState<number | null>(null);
  const [f, setF] = useState({ name: "", phone: "" });
  const [done, setDone] = useState("");
  const idx = (h: string) => HOURS.indexOf(h);
  const busy = (pc: number) => res.some((r) => r.pc === pc && r.status !== "Дууссан" && idx(hour) < idx(r.hour) + r.hours && idx(r.hour) < idx(hour) + hours);
  const pc = pcs.find((p) => p.id === sel);
  const submit = () => { const id = uid(); setRes((p) => [{ id, pc: sel!, hour, hours, ...f, status: "Захиалсан" }, ...p]); setDone(id); setSel(null); };
  return (
    <div className="min-h-screen bg-[#0a0820] text-[#e0f2fe]" style={{ fontFamily: "ui-monospace, monospace", backgroundImage: "linear-gradient(#22d3ee11 1px,transparent 1px),linear-gradient(90deg,#22d3ee11 1px,transparent 1px)", backgroundSize: "40px 40px" }}>
      <nav className="sticky top-9 z-40 flex items-center justify-between border-b border-[#22d3ee]/40 bg-[#0a0820]/90 px-5 py-3 backdrop-blur">
        <a href="#top" className="flex items-center gap-2 text-xl font-bold tracking-widest text-[#22d3ee] [text-shadow:0_0_12px_#22d3ee]"><Zap size={20} /> NEON ARENA</a>
        <div className="flex items-center gap-5 text-sm">
          <a href="#rates" className="hidden hover:text-[#f472b6] sm:block">ҮНЭ</a><a href="#book" className="hover:text-[#f472b6]">PC ЗАХИАЛАХ</a>
          <Link href="/demo/pccafe/admin" className="border border-[#f472b6] px-3 py-1 text-[#f472b6] shadow-[0_0_10px_#f472b6aa] hover:bg-[#f472b6] hover:text-black">ADMIN</Link>
        </div>
      </nav>
      <header id="top" className="px-6 py-20 text-center">
        <p className="text-sm tracking-[0.4em] text-[#f472b6]">OPEN 12:00 — 24:00</p>
        <h1 className="mt-3 text-5xl font-black tracking-tight sm:text-7xl [text-shadow:0_0_30px_#a855f7]">PLAY <span className="text-[#22d3ee]">LOUDER</span></h1>
        <p className="mx-auto mt-4 max-w-md opacity-70">24 өндөр хүчин чадалтай PC. Урьдчилж захиалаад, ирээд шууд тогло.</p>
      </header>
      <section id="rates" className="mx-auto grid max-w-4xl gap-4 px-5 sm:grid-cols-3">
        {(Object.keys(RATES) as (keyof typeof RATES)[]).map((z) => (
          <div key={z} className="border p-5" style={{ borderColor: ZONE_COLOR[z], boxShadow: `0 0 18px ${ZONE_COLOR[z]}55` }}>
            <div className="text-lg font-bold" style={{ color: ZONE_COLOR[z] }}>{z}</div><div className="text-sm opacity-70">{specs[z]}</div><div className="mt-3 text-2xl font-black">{money(RATES[z])}<span className="text-sm font-normal opacity-60"> /цаг</span></div>
          </div>))}
      </section>
      <section id="book" className="mx-auto max-w-4xl px-5 py-16">
        <h2 className="mb-6 text-2xl font-bold text-[#22d3ee]">// PC СОНГОХ</h2>
        <div className="mb-6 flex flex-wrap items-center gap-4 text-sm">
          <label>Эхлэх цаг <select value={hour} onChange={(e) => { setHour(e.target.value); setSel(null); }} className="ml-2 border border-[#22d3ee] bg-black px-2 py-1">{HOURS.map((h) => <option key={h}>{h}</option>)}</select></label>
          <label>Хугацаа <select value={hours} onChange={(e) => { setHours(+e.target.value); setSel(null); }} className="ml-2 border border-[#22d3ee] bg-black px-2 py-1">{[1, 2, 3, 4, 5].map((h) => <option key={h} value={h}>{h} цаг</option>)}</select></label>
          <span className="ml-auto flex gap-3 text-xs"><i className="text-[#22d3ee]">■ чөлөөтэй</i><i className="text-neutral-500">■ дүүрсэн</i><i className="text-red-400">■ засварт</i></span>
        </div>
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-6">
          {pcs.map((p) => {
            const off = p.state === "repair", b = busy(p.id), c = ZONE_COLOR[p.zone];
            return <button key={p.id} disabled={off || b} onClick={() => { setSel(p.id); setDone(""); }} className="flex flex-col items-center gap-1 border p-3 text-xs transition disabled:opacity-35" style={{ borderColor: off ? "#f87171" : b ? "#737373" : c, background: sel === p.id ? c : "transparent", color: sel === p.id ? "#000" : off ? "#f87171" : b ? "#737373" : c }}><Monitor size={22} />PC-{String(p.id).padStart(2, "0")}<span className="opacity-70">{p.zone}</span></button>;
          })}
        </div>
        {pc && (
          <div className="mt-6 border border-[#f472b6] p-5 shadow-[0_0_20px_#f472b655]">
            <p className="mb-3 font-bold text-[#f472b6]">PC-{String(pc.id).padStart(2, "0")} · {pc.zone} · {hour} ({hours} цаг) = {money(RATES[pc.zone] * hours)}</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <input placeholder="Gamer нэр" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} className="border border-[#22d3ee]/50 bg-black px-3 py-2" />
              <input placeholder="Утас" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} className="border border-[#22d3ee]/50 bg-black px-3 py-2" />
            </div>
            <button disabled={!f.name || f.phone.length < 6} onClick={submit} className="mt-4 w-full bg-[#22d3ee] py-3 font-bold text-black disabled:opacity-40">ЗАХИАЛГА БАТЛАХ</button>
          </div>)}
        {done && <p className="mt-6 border border-[#22d3ee] p-4 text-[#22d3ee]">✔ Захиалга #{done} бүртгэгдлээ. Ирээд нэрээ хэлээрэй!</p>}
      </section>
    </div>
  );
}

export function PcAdmin() {
  const [pcs, setPcs] = useLocal<Pc[]>("pc:pcs", PCS);
  const [res, setRes] = useLocal<Res[]>("pc:res", []);
  const [toast, say] = useToast();
  const next = (r: Res) => { const s = r.status === "Захиалсан" ? "Тоглож байна" : "Дууссан"; setRes((p) => p.map((x) => (x.id === r.id ? { ...x, status: s } : x))); say(`PC-${r.pc}: ${s}`); };
  const pcOf = (n: number) => pcs.find((p) => p.id === n)!;
  const rev = res.filter((r) => r.status !== "Захиалсан").reduce((a, r) => a + RATES[pcOf(r.pc).zone] * r.hours, 0);
  return (
    <div className="min-h-screen bg-[#0a0820] text-[#e0f2fe]" style={{ fontFamily: "ui-monospace, monospace" }}>
      <nav className="flex items-center justify-between border-b border-[#f472b6]/50 px-5 py-3"><b className="tracking-widest text-[#f472b6]">NEON ARENA // ADMIN</b><Link href="/demo/pccafe" className="border border-[#22d3ee] px-3 py-1 text-sm text-[#22d3ee]">← САЙТ</Link></nav>
      <div className="mx-auto max-w-5xl space-y-8 p-6">
        <div className="grid gap-3 sm:grid-cols-3">
          <Stat cls="border border-[#22d3ee]/40" label="Захиалга" value={res.length} />
          <Stat cls="border border-[#22d3ee]/40" label="Тоглож байгаа" value={res.filter((r) => r.status === "Тоглож байна").length} />
          <Stat cls="border border-[#22d3ee]/40" label="Орлого" value={money(rev)} />
        </div>
        <section><h2 className="mb-3 text-lg font-bold text-[#22d3ee]">// ЗАХИАЛГУУД</h2>
          {res.length === 0 && <p className="opacity-60">Захиалга алга. Сайтаас PC сонгож захиалаарай.</p>}
          {res.map((r) => (
            <div key={r.id} className="mb-2 flex flex-wrap items-center gap-3 border border-[#22d3ee]/30 p-3 text-sm">
              <b>#{r.id}</b><span>PC-{String(r.pc).padStart(2, "0")}</span><span>{r.name} · {r.phone}</span><span className="opacity-60">{r.hour} · {r.hours} цаг</span>
              <span className="ml-auto text-[#f472b6]">{r.status}</span>
              {r.status !== "Дууссан" && <button onClick={() => next(r)} className="border border-[#22d3ee] px-3 py-1 text-[#22d3ee]">{r.status === "Захиалсан" ? "Эхлүүлэх" : "Дуусгах"}</button>}
              <button onClick={() => setRes((p) => p.filter((x) => x.id !== r.id))} className="text-red-400">✕</button>
            </div>))}
        </section>
        <section><h2 className="mb-3 text-lg font-bold text-[#22d3ee]">// КОМПЬЮТЕРҮҮД</h2>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">{pcs.map((p) => (
            <button key={p.id} onClick={() => { setPcs((ps) => ps.map((x) => (x.id === p.id ? { ...x, state: x.state === "ok" ? "repair" : "ok" } : x))); say(`PC-${p.id} төлөв солигдлоо`); }} className="border p-2 text-xs" style={{ borderColor: p.state === "ok" ? ZONE_COLOR[p.zone] : "#f87171", color: p.state === "ok" ? ZONE_COLOR[p.zone] : "#f87171" }}>PC-{p.id}<br />{p.state === "ok" ? "OK" : "ЗАСВАРТ"}</button>))}</div>
          <p className="mt-2 text-xs opacity-60">Дарж засварын төлвийг солино — сайт дээр захиалах боломжгүй болно.</p>
        </section>
      </div>
      <Toast msg={toast} />
    </div>
  );
}
