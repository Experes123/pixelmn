"use client";
import { useState } from "react";
import Link from "next/link";
import { Monitor, Cpu, Gamepad2, Zap, Clock, Check, LayoutDashboard, CalendarCheck, Settings, Wallet, Trash2, Wifi, Headphones, MousePointer2 } from "lucide-react";
import { money, uid, useLocal, useToast, Toast, img, AdminShell, Card, Kpi, BarChart, Chip, Table, inp, btnAcc, btnGhost, Select } from "./kit";

type Zone = { id: string; name: string; spec: string; rate: number; color: string };
type PcState = "free" | "busy" | "reserved" | "off";
type PC = { id: string; zone: string; st: PcState };
type Bk = { id: string; pc: string; zone: string; start: string; hrs: number; name: string; phone: string; total: number; status: "Хүлээгдэж буй" | "Идэвхтэй" | "Дууссан" | "Цуцалсан" };
const BKS = ["Хүлээгдэж буй", "Идэвхтэй", "Дууссан", "Цуцалсан"] as const;
const ZONES: Zone[] = [
  { id: "vip", name: "VIP", spec: "RTX 4080 · 240Hz · Gaming сандал", rate: 9000, color: "#f0abfc" },
  { id: "pro", name: "PRO", spec: "RTX 4060 · 165Hz", rate: 6000, color: "#22d3ee" },
  { id: "std", name: "STANDARD", spec: "GTX 1660 · 144Hz", rate: 4000, color: "#a3e635" },
];
const mk = (z: string, n: number, off: number): PC[] => Array.from({ length: n }, (_, i) => ({ id: `${z.toUpperCase()}-${String(i + 1).padStart(2, "0")}`, zone: z, st: ((i + off) % 5 === 0 ? "busy" : (i + off) % 7 === 0 ? "reserved" : (i + off) % 11 === 0 ? "off" : "free") as PcState }));
const PCS: PC[] = [...mk("vip", 6, 1), ...mk("pro", 10, 2), ...mk("std", 12, 3)];
const SLOTS = ["14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"];
const NAMES = ["Дөл", "Хас", "Мөнх", "Тэмүүлэн", "Түмэн", "Бадрал", "Анхаа", "Сүх", "Энх", "Гэрэл"];
const SEED: Bk[] = Array.from({ length: 14 }, (_, i) => { const p = PCS[(i * 3) % 28], z = ZONES.find((x) => x.id === p.zone)!, h = (i % 4) + 1; return { id: `N${400 + i}`, pc: p.id, zone: z.name, start: SLOTS[i % 10], hrs: h, name: NAMES[i % 10], phone: `99${String(210000 + i * 5113).slice(0, 6)}`, total: z.rate * h, status: i < 3 ? "Идэвхтэй" : i < 5 ? "Хүлээгдэж буй" : i % 7 === 0 ? "Цуцалсан" : "Дууссан" }; });
const stc: Record<PcState, string> = { free: "#22d3ee", busy: "#f43f5e", reserved: "#facc15", off: "#475569" };
const stn: Record<PcState, string> = { free: "Сул", busy: "Тоглож буй", reserved: "Захиалгатай", off: "Засварт" };
const cy = "#22d3ee";

export function PcSite() {
  const [zones] = useLocal<Zone[]>("pc2:zones", ZONES);
  const [pcs, setPcs] = useLocal<PC[]>("pc2:pcs", PCS);
  const [bks, setBks] = useLocal<Bk[]>("pc2:bks", SEED);
  const [sel, setSel] = useState<string>(""), [start, setStart] = useState(""), [hrs, setHrs] = useState(2);
  const [f, setF] = useState({ name: "", phone: "" }), [done, setDone] = useState<Bk | null>(null);
  const pc = pcs.find((p) => p.id === sel), zone = zones.find((z) => z.id === pc?.zone);
  const total = (zone?.rate ?? 0) * hrs;
  const free = pcs.filter((p) => p.st === "free").length;
  const book = () => {
    const b: Bk = { id: `N${uid()}`, pc: pc!.id, zone: zone!.name, start, hrs, ...f, total, status: "Хүлээгдэж буй" };
    setBks((p) => [b, ...p]); setPcs((p) => p.map((x) => (x.id === pc!.id ? { ...x, st: "reserved" } : x))); setDone(b); setSel(""); setStart("");
  };
  return (
    <div className="bg-[#07060f] text-white" style={{ fontFamily: "ui-sans-serif, system-ui, sans-serif" }}>
      <nav className="sticky top-9 z-40 flex items-center justify-between border-b border-white/10 bg-[#07060f]/80 px-5 py-4 backdrop-blur-xl sm:px-10">
        <a href="#top" className="flex items-center gap-2 text-xl font-black tracking-[0.2em]"><Gamepad2 style={{ color: cy }} /> NEON<span style={{ color: "#e879f9" }}>ARENA</span></a>
        <div className="flex items-center gap-3 text-sm font-semibold"><a href="#zones" className="hidden hover:text-cyan-300 md:block">Бүс</a><a href="#book" className="rounded-lg px-4 py-2 font-bold text-black" style={{ background: cy, boxShadow: "0 0 24px #22d3ee88" }}>Захиалах</a><Link href="/demo/pccafe/admin" className="hidden rounded-lg border border-white/20 px-3 py-2 sm:block">Admin</Link></div>
      </nav>
      <header id="top" className="relative isolate grid min-h-[84vh] place-items-center overflow-hidden px-5 text-center">
        <img src={img("1542751371-adc38448a05e", 1800)} alt="" className="absolute inset-0 -z-20 h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,#07060fbb,#07060f_90%)]" /><div className="absolute inset-0 -z-10 bg-gradient-to-br from-fuchsia-600/30 via-transparent to-cyan-500/30" />
        <div><p className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-400/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-cyan-300"><span className="h-2 w-2 animate-pulse rounded-full bg-cyan-300" /> {free} PC сул байна</p>
          <h1 className="text-6xl font-black leading-[.95] tracking-tight sm:text-8xl">LEVEL UP.<br /><span className="bg-gradient-to-r from-cyan-300 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">PLAY LOUD.</span></h1>
          <p className="mx-auto mt-7 max-w-xl text-lg text-white/70">RTX тоглоомын компьютер, 240Hz дэлгэц, 1Gbps интернет. Суудлаа онлайнаар сонгоод шууд ирээд тогло.</p>
          <a href="#book" className="mt-9 inline-block rounded-xl px-9 py-4 font-black uppercase tracking-widest text-black transition hover:scale-105" style={{ background: "linear-gradient(90deg,#22d3ee,#e879f9)", boxShadow: "0 0 40px #e879f988" }}>PC сонгох</a></div>
      </header>
      <section className="mx-auto grid max-w-6xl gap-4 px-5 py-10 sm:grid-cols-4">{[[Cpu, "RTX 40 series", "Хамгийн сүүлийн GPU"], [Zap, "240Hz", "Хамгийн хурдан дэлгэц"], [Wifi, "1Gbps", "Ping < 5ms"], [Headphones, "Pro төхөөрөмж", "Logitech · HyperX"]].map(([I, t, s]) => { const Ic = I as typeof Cpu; return <div key={t as string} className="rounded-2xl border border-white/10 bg-white/[.04] p-5"><Ic style={{ color: cy }} /><div className="mt-3 font-bold">{t as string}</div><div className="text-sm text-white/50">{s as string}</div></div>; })}</section>
      <section id="zones" className="mx-auto max-w-6xl px-5 py-16"><h2 className="mb-10 text-4xl font-black">Бүсүүд & үнэ</h2>
        <div className="grid gap-5 md:grid-cols-3">{zones.map((z) => <div key={z.id} className="group relative overflow-hidden rounded-3xl border p-7 transition hover:-translate-y-1" style={{ borderColor: `${z.color}55`, background: `linear-gradient(160deg, ${z.color}22, transparent 60%)` }}><div className="text-sm font-black tracking-[0.3em]" style={{ color: z.color }}>{z.name}</div><div className="mt-5 text-5xl font-black">{money(z.rate)}<span className="text-base font-medium text-white/50"> /цаг</span></div><p className="mt-4 text-sm text-white/60">{z.spec}</p></div>)}</div></section>
      <section id="book" className="mx-auto max-w-6xl px-5 py-20">
        <h2 className="mb-3 text-4xl font-black">Суудал сонгох</h2>
        <div className="mb-8 flex flex-wrap gap-5 text-xs text-white/60">{(Object.keys(stc) as PcState[]).map((k) => <span key={k} className="flex items-center gap-2"><i className="h-3 w-3 rounded" style={{ background: stc[k] }} />{stn[k]}</span>)}</div>
        <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          <div className="space-y-6 rounded-3xl border border-white/10 bg-white/[.03] p-6">{zones.map((z) => <div key={z.id}><div className="mb-3 text-xs font-black tracking-[0.3em]" style={{ color: z.color }}>{z.name}</div><div className="grid grid-cols-3 gap-3 sm:grid-cols-6">{pcs.filter((p) => p.zone === z.id).map((p) => { const act = sel === p.id; return <button key={p.id} disabled={p.st !== "free"} onClick={() => setSel(p.id)} className="group flex flex-col items-center gap-1.5 rounded-xl border p-3 text-[11px] font-bold transition enabled:hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40" style={{ borderColor: act ? z.color : `${stc[p.st]}55`, background: act ? `${z.color}33` : `${stc[p.st]}14`, boxShadow: act ? `0 0 20px ${z.color}88` : undefined }}><Monitor size={22} style={{ color: act ? z.color : stc[p.st] }} />{p.id.split("-")[1]}</button>; })}</div></div>)}</div>
          <div className="h-fit rounded-3xl border border-white/10 bg-white/[.05] p-6 lg:sticky lg:top-28">
            {done ? <div className="text-center"><Check className="mx-auto mb-3" size={44} style={{ color: cy }} /><p className="text-2xl font-black">Захиалга амжилттай!</p><p className="mt-3 text-white/70">#{done.id} · {done.pc}<br />{done.start} · {done.hrs} цаг · {money(done.total)}</p><button className="mt-5 underline" onClick={() => setDone(null)}>Дахин захиалах</button></div> : !pc ? <div className="py-10 text-center text-white/50"><MousePointer2 className="mx-auto mb-3" />Зүүн талаас сул суудал сонгоно уу</div> : <div className="space-y-5">
              <div className="flex items-center justify-between"><div><div className="text-xs text-white/50">Сонгосон</div><div className="text-3xl font-black">{pc.id}</div></div><Chip tone={zone!.color}>{zone!.name}</Chip></div>
              <div><div className="mb-2 text-xs font-bold uppercase tracking-widest text-white/50">Эхлэх цаг</div><div className="grid grid-cols-5 gap-2">{SLOTS.map((s) => <button key={s} onClick={() => setStart(s)} className={`rounded-lg border py-2 text-xs font-bold ${start === s ? "border-cyan-300 bg-cyan-300 text-black" : "border-white/15 hover:border-cyan-300/60"}`}>{s}</button>)}</div></div>
              <div><div className="mb-2 text-xs font-bold uppercase tracking-widest text-white/50">Хугацаа</div><div className="flex gap-2">{[1, 2, 3, 5].map((h) => <button key={h} onClick={() => setHrs(h)} className={`flex-1 rounded-lg border py-2 text-sm font-bold ${hrs === h ? "border-fuchsia-400 bg-fuchsia-400 text-black" : "border-white/15"}`}>{h} цаг</button>)}</div></div>
              <input placeholder="Нэр / nickname" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} className="w-full rounded-lg border border-white/15 bg-black/40 px-4 py-3 text-sm outline-none focus:border-cyan-300" />
              <input placeholder="Утас" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} className="w-full rounded-lg border border-white/15 bg-black/40 px-4 py-3 text-sm outline-none focus:border-cyan-300" />
              <div className="flex items-center justify-between border-t border-white/10 pt-4"><span className="text-white/60">Нийт</span><span className="text-3xl font-black" style={{ color: cy }}>{money(total)}</span></div>
              <button disabled={!start || !f.name || f.phone.length < 6} onClick={book} className="w-full rounded-xl py-3.5 font-black uppercase tracking-widest text-black disabled:opacity-30" style={{ background: "linear-gradient(90deg,#22d3ee,#e879f9)" }}>Захиалах</button></div>}
          </div></div></section>
      <footer className="border-t border-white/10 px-5 py-10 text-center text-sm text-white/40"><Clock size={13} className="mr-1 inline" /> 24/7 · NEON ARENA · Демо</footer>
    </div>
  );
}

export function PcAdmin() {
  const [zones, setZones] = useLocal<Zone[]>("pc2:zones", ZONES);
  const [pcs, setPcs] = useLocal<PC[]>("pc2:pcs", PCS);
  const [bks, setBks] = useLocal<Bk[]>("pc2:bks", SEED);
  const [toast, say] = useToast();
  const order: PcState[] = ["free", "busy", "reserved", "off"];
  const rev = bks.filter((b) => b.status !== "Цуцалсан").reduce((s, b) => s + b.total, 0);
  const occ = Math.round((pcs.filter((p) => p.st === "busy").length / pcs.length) * 100);
  const hours = SLOTS.map((s) => bks.filter((b) => b.start === s && b.status !== "Цуцалсан").length);
  const tone = (s: Bk["status"]) => ({ "Хүлээгдэж буй": "amber", "Идэвхтэй": "blue", "Дууссан": "green", "Цуцалсан": "red" })[s];
  const live = (<div className="space-y-5"><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Kpi icon={Wallet} label="Орлого" value={money(rev)} delta="+9% өчигдрөөс" /><Kpi icon={Monitor} label="Ачаалал" value={`${occ}%`} /><Kpi icon={Zap} label="Сул PC" value={pcs.filter((p) => p.st === "free").length} /><Kpi icon={CalendarCheck} label="Захиалга" value={bks.length} /></div>
    <Card title="Бодит цагийн самбар" right={<span className="text-xs text-[var(--mut)]">Дарж төлөв солих</span>}><div className="grid grid-cols-4 gap-3 sm:grid-cols-6 xl:grid-cols-8">{pcs.map((p) => <button key={p.id} onClick={() => { const n = order[(order.indexOf(p.st) + 1) % 4]; setPcs((a) => a.map((x) => (x.id === p.id ? { ...x, st: n } : x))); say(`${p.id}: ${stn[n]}`); }} className="flex flex-col items-center gap-1 rounded-xl border p-3 text-[11px] font-bold transition hover:scale-105" style={{ borderColor: `${stc[p.st]}66`, background: `${stc[p.st]}18` }}><Monitor size={20} style={{ color: stc[p.st] }} />{p.id}<span className="font-medium opacity-70">{stn[p.st]}</span></button>)}</div></Card>
    <Card title="Цагийн ачаалал (захиалга)"><BarChart data={hours} labels={SLOTS.map((s) => s.slice(0, 2))} /></Card></div>);
  const list = (<Card><Table head={["ID", "PC", "Тоглогч", "Эхлэх", "Хугацаа", "Дүн", "Төлөв", ""]} rows={bks.map((b) => [<b key="i">{b.id}</b>, b.pc, <div key="n"><div className="font-semibold">{b.name}</div><div className="text-xs text-[var(--mut)]">{b.phone}</div></div>, b.start, `${b.hrs} цаг`, money(b.total), <div key="s" className="flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full" style={{ background: { amber: "#f59e0b", blue: "#3b82f6", green: "#10b981", red: "#ef4444" }[tone(b.status)] }} /><Select value={b.status} options={BKS} onChange={(v) => { setBks((p) => p.map((x) => (x.id === b.id ? { ...x, status: v } : x))); say(`${b.id}: ${v}`); }} /></div>, <button key="d" aria-label="Устгах" className="text-[var(--mut)] hover:text-red-500" onClick={() => setBks((p) => p.filter((x) => x.id !== b.id))}><Trash2 size={15} /></button>])} /></Card>);
  const set = (<div className="grid gap-4 md:grid-cols-3">{zones.map((z) => <Card key={z.id} title={z.name}><label className="text-xs text-[var(--mut)]">Цагийн үнэ (₮)<input type="number" value={z.rate} onChange={(e) => setZones((p) => p.map((x) => (x.id === z.id ? { ...x, rate: +e.target.value } : x)))} className={`${inp} mt-1`} /></label><label className="mt-3 block text-xs text-[var(--mut)]">Үзүүлэлт<input value={z.spec} onChange={(e) => setZones((p) => p.map((x) => (x.id === z.id ? { ...x, spec: e.target.value } : x)))} className={`${inp} mt-1`} /></label></Card>)}<button className={`${btnGhost} md:col-span-3`} onClick={() => { setPcs(PCS); setBks(SEED); say("Эхний төлөвт сэргээлээ"); }}>Туршилтын өгөгдөл сэргээх</button></div>);
  return (<><AdminShell brand="NEON ARENA" sub="Клубын удирдлага" acc={cy} back="/demo/pccafe" tabs={[{ key: "l", label: "Шууд самбар", icon: LayoutDashboard, node: live }, { key: "b", label: "Захиалгууд", icon: CalendarCheck, node: list }, { key: "s", label: "Үнэ & тохиргоо", icon: Settings, node: set }]} /><Toast msg={toast} /></>);
}
