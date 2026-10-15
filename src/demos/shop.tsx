"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { ShoppingBag, Plus, Minus, X, Search, Star, Truck, ShieldCheck, RefreshCw, Check, LayoutDashboard, Package, ClipboardList, Wallet, Trash2, AlertTriangle, Heart } from "lucide-react";
import { money, uid, useLocal, useToast, Toast, img, ago, fmtDate, AdminShell, Card, Kpi, BarChart, Chip, Table, inp, btnAcc, btnGhost, Select } from "./kit";

type Prod = { id: string; name: string; cat: string; price: number; was?: number; pic: string; rate: number; stock: number; tag?: string };
const PRODS: Prod[] = [
  { id: "p1", name: "Classic Chrono цаг", cat: "Аксессуар", price: 389000, was: 459000, pic: "1523275335684-37898b6baf30", rate: 4.8, stock: 14, tag: "-15%" },
  { id: "p2", name: "Studio Wireless чихэвч", cat: "Электроник", price: 259000, pic: "1505740420928-5e560c06d30e", rate: 4.9, stock: 22, tag: "Шинэ" },
  { id: "p3", name: "Runner Pro пүүз", cat: "Хувцас", price: 219000, was: 269000, pic: "1542291026-7eec264c27ff", rate: 4.7, stock: 31, tag: "-19%" },
  { id: "p4", name: "Aviator нарны шил", cat: "Аксессуар", price: 129000, pic: "1572635196237-14b3f281503f", rate: 4.6, stock: 40 },
  { id: "p5", name: "Mirrorless камер", cat: "Электроник", price: 2490000, pic: "1526170375885-4d8ecf77b99f", rate: 4.9, stock: 4, tag: "Хязгаарлагдмал" },
  { id: "p6", name: "Street Low пүүз", cat: "Хувцас", price: 179000, pic: "1491553895911-0055eca6402d", rate: 4.5, stock: 18 },
  { id: "p7", name: "Minimal Steel цаг", cat: "Аксессуар", price: 329000, pic: "1546868871-7041f2a55e12", rate: 4.7, stock: 9 },
  { id: "p8", name: "Pro Over-ear чихэвч", cat: "Электроник", price: 349000, was: 399000, pic: "1505740420928-5e560c06d30e", rate: 4.8, stock: 0, tag: "-12%" },
];
const CATS = ["Бүгд", "Электроник", "Хувцас", "Аксессуар"];
const STAT = ["Төлбөр хүлээгдэж буй", "Баглаж байна", "Хүргэлтэнд", "Хүргэгдсэн", "Буцаасан"] as const;
type Stat = (typeof STAT)[number];
type Order = { id: string; at: string; name: string; phone: string; addr: string; lines: { id: string; n: string; q: number; p: number }[]; total: number; status: Stat };
const NAMES = ["Тулга", "Уянга", "Мөнхбат", "Сэлэнгэ", "Хулан", "Идэр", "Жаргал", "Солонго", "Бямба", "Эрхэмбаяр"];
const SEED: Order[] = Array.from({ length: 16 }, (_, i) => {
  const a = PRODS[i % 7], q = (i % 2) + 1; const lines = [{ id: a.id, n: a.name, q, p: a.price }];
  return { id: `S${300 + i}`, at: ago(Math.floor(i / 2), 10 + (i % 9)), name: NAMES[i % 10], phone: `95${String(120000 + i * 4457).slice(0, 6)}`, addr: `БЗД, ${i + 3}-р хороо`, lines, total: a.price * q, status: i < 3 ? (["Төлбөр хүлээгдэж буй", "Баглаж байна", "Хүргэлтэнд"] as Stat[])[i] : i % 9 === 0 ? "Буцаасан" : "Хүргэгдсэн" };
});
const lime = "#a3e635";

export function ShopSite() {
  const [prods] = useLocal<Prod[]>("shop2:prods", PRODS);
  const [orders, setOrders] = useLocal<Order[]>("shop2:orders", SEED);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [cat, setCat] = useState("Бүгд"), [q, setQ] = useState(""), [sort, setSort] = useState("pop");
  const [open, setOpen] = useState(false), [fav, setFav] = useState<string[]>([]);
  const [f, setF] = useState({ name: "", phone: "", addr: "" }), [done, setDone] = useState<Order | null>(null);
  const list = useMemo(() => prods.filter((p) => (cat === "Бүгд" || p.cat === cat) && p.name.toLowerCase().includes(q.toLowerCase())).sort((a, b) => sort === "lo" ? a.price - b.price : sort === "hi" ? b.price - a.price : b.rate - a.rate), [prods, cat, q, sort]);
  const lines = prods.filter((p) => cart[p.id]).map((p) => ({ id: p.id, n: p.name, q: cart[p.id], p: p.price }));
  const total = lines.reduce((s, l) => s + l.q * l.p, 0), count = lines.reduce((s, l) => s + l.q, 0);
  const add = (id: string, d: number) => setCart((c) => { const p = prods.find((x) => x.id === id)!; const n = Math.min(p.stock, Math.max(0, (c[id] ?? 0) + d)); const r = { ...c, [id]: n }; if (!n) delete r[id]; return r; });
  const buy = () => { const o: Order = { id: `S${uid()}`, at: new Date().toISOString(), ...f, lines, total, status: "Төлбөр хүлээгдэж буй" }; setOrders((p) => [o, ...p]); setDone(o); setCart({}); };
  return (
    <div className="bg-white text-[#10140a]" style={{ fontFamily: "system-ui, sans-serif" }}>
      <div className="bg-[#10140a] py-2 text-center text-xs font-semibold text-[#a3e635]">200,000₮-өөс дээш захиалгад хүргэлт үнэгүй · 14 хоногийн буцаалт</div>
      <nav className="sticky top-9 z-40 flex items-center gap-4 border-b border-black/10 bg-white/85 px-5 py-4 backdrop-blur-xl sm:px-10">
        <a href="#top" className="text-2xl font-black tracking-tight">мини<span className="rounded bg-[#a3e635] px-1.5">шоп</span></a>
        <div className="relative mx-auto hidden max-w-md flex-1 md:block"><Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Бүтээгдэхүүн хайх…" className="w-full rounded-full bg-neutral-100 py-2.5 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-[#a3e635]" /></div>
        <div className="ml-auto flex items-center gap-3"><Link href="/demo/shop/admin" className="hidden rounded-full border border-black/15 px-4 py-2 text-sm font-semibold sm:block">Admin</Link>
          <button onClick={() => setOpen(true)} className="flex items-center gap-2 rounded-full bg-[#10140a] px-5 py-2.5 text-sm font-bold text-white"><ShoppingBag size={16} /> {count > 0 ? money(total) : "Сагс"}{count > 0 && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-[#a3e635] px-1 text-xs text-black">{count}</span>}</button></div>
      </nav>
      <header id="top" className="mx-auto grid max-w-7xl gap-5 px-5 py-8 sm:px-10 lg:grid-cols-[1.6fr_1fr]">
        <div className="relative isolate flex min-h-[420px] items-end overflow-hidden rounded-[2rem] bg-[#10140a] p-8 text-white sm:p-12">
          <img src={img("1542291026-7eec264c27ff", 1400)} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-70" /><div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#10140a] via-transparent" />
          <div><span className="rounded-full bg-[#a3e635] px-3 py-1 text-xs font-bold text-black">Шинэ улирал</span><h1 className="mt-4 text-5xl font-black leading-[1] tracking-tight sm:text-7xl">Хөдөлгөөнд<br />зориулсан.</h1><a href="#shop" className="mt-6 inline-block rounded-full bg-white px-7 py-3.5 text-sm font-bold text-black transition hover:bg-[#a3e635]">Худалдаж авах →</a></div>
        </div>
        <div className="grid gap-5">{[["1505740420928-5e560c06d30e", "Чихэвч", "-20% хүртэл"], ["1523275335684-37898b6baf30", "Цаг", "Шинэ загвар"]].map(([p, t, s]) => <a key={t} href="#shop" className="group relative isolate flex min-h-[200px] items-end overflow-hidden rounded-[2rem] p-6 text-white"><img src={img(p, 700)} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover transition duration-700 group-hover:scale-105" /><div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/70 to-transparent" /><div><div className="text-2xl font-black">{t}</div><div className="text-sm text-white/80">{s}</div></div></a>)}</div>
      </header>
      <section className="mx-auto grid max-w-7xl gap-4 px-5 pb-10 sm:grid-cols-3 sm:px-10">{[[Truck, "Хурдан хүргэлт", "УБ хотод 24 цагт"], [ShieldCheck, "Баталгаат", "1 жилийн баталгаа"], [RefreshCw, "Буцаалт", "14 хоногт буцаана"]].map(([I, t, s]) => { const Ic = I as typeof Truck; return <div key={t as string} className="flex items-center gap-4 rounded-2xl bg-neutral-50 p-5"><span className="grid h-12 w-12 place-items-center rounded-xl bg-[#a3e635]"><Ic size={22} /></span><div><div className="font-bold">{t as string}</div><div className="text-sm text-neutral-500">{s as string}</div></div></div>; })}</section>
      <section id="shop" className="mx-auto max-w-7xl px-5 pb-24 sm:px-10">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4"><h2 className="text-4xl font-black tracking-tight">Бүх бүтээгдэхүүн</h2>
          <div className="flex flex-wrap items-center gap-2">{CATS.map((c) => <button key={c} onClick={() => setCat(c)} className={`rounded-full px-5 py-2 text-sm font-semibold transition ${cat === c ? "bg-[#10140a] text-white" : "bg-neutral-100 hover:bg-neutral-200"}`}>{c}</button>)}<select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-full bg-neutral-100 px-4 py-2 text-sm font-semibold"><option value="pop">Эрэлттэй</option><option value="lo">Үнэ ↑</option><option value="hi">Үнэ ↓</option></select></div></div>
        <div className="grid gap-x-5 gap-y-9 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((p) => (
            <article key={p.id} className="group">
              <div className="relative aspect-square overflow-hidden rounded-3xl bg-neutral-100"><img src={img(p.pic, 600)} alt={p.name} loading="lazy" className={`h-full w-full object-cover transition duration-700 group-hover:scale-110 ${p.stock === 0 ? "opacity-40 grayscale" : ""}`} />
                {p.tag && <span className="absolute left-3 top-3 rounded-full bg-[#a3e635] px-3 py-1 text-xs font-bold">{p.tag}</span>}
                <button aria-label="Дуртай" onClick={() => setFav((x) => (x.includes(p.id) ? x.filter((i) => i !== p.id) : [...x, p.id]))} className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white shadow"><Heart size={16} fill={fav.includes(p.id) ? "#ef4444" : "none"} className={fav.includes(p.id) ? "text-red-500" : ""} /></button>
                {p.stock === 0 ? <div className="absolute inset-x-3 bottom-3 rounded-full bg-white py-2.5 text-center text-sm font-bold">Дууссан</div> : <button onClick={() => { add(p.id, 1); setOpen(true); }} className="absolute inset-x-3 bottom-3 translate-y-3 rounded-full bg-[#10140a] py-2.5 text-sm font-bold text-white opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">Сагсанд нэмэх</button>}</div>
              <div className="mt-3 flex items-start justify-between gap-2"><div><h3 className="font-bold leading-snug">{p.name}</h3><div className="mt-0.5 flex items-center gap-1 text-xs text-neutral-500"><Star size={12} fill="#f59e0b" className="text-amber-500" />{p.rate} · {p.cat}</div></div><div className="text-right"><div className="font-black">{money(p.price)}</div>{p.was && <div className="text-xs text-neutral-400 line-through">{money(p.was)}</div>}</div></div>
            </article>
          ))}
          {list.length === 0 && <p className="col-span-full py-20 text-center text-neutral-400">Илэрц олдсонгүй</p>}
        </div>
      </section>
      <footer className="bg-[#10140a] px-5 py-12 text-center text-sm text-white/50">© Мини Шоп · Демо дэлгүүр</footer>
      {open && <div className="fixed inset-0 z-[110] flex justify-end bg-black/50" onClick={() => setOpen(false)}><aside onClick={(e) => e.stopPropagation()} className="flex h-full w-full max-w-md flex-col bg-white">
        <div className="flex items-center justify-between border-b p-5"><b className="text-xl">Сагс ({count})</b><button aria-label="Хаах" onClick={() => { setOpen(false); setDone(null); }}><X /></button></div>
        {done ? <div className="flex flex-1 flex-col items-center justify-center p-8 text-center"><span className="mb-4 grid h-16 w-16 place-items-center rounded-full bg-[#a3e635]"><Check size={32} /></span><p className="text-2xl font-black">Захиалга баталгаажлаа</p><p className="mt-2 text-neutral-500">#{done.id} · {money(done.total)}</p><p className="mt-1 text-xs text-neutral-400">Админ → Захиалга хэсэгт харагдана</p><button onClick={() => { setOpen(false); setDone(null); }} className="mt-6 rounded-full bg-[#10140a] px-7 py-3 text-sm font-bold text-white">Үргэлжлүүлэх</button></div> : <>
          <div className="flex-1 space-y-4 overflow-y-auto p-5">{lines.length === 0 && <p className="py-16 text-center text-neutral-400">Сагс хоосон байна</p>}
            {lines.map((l) => { const p = prods.find((x) => x.id === l.id)!; return <div key={l.id} className="flex items-center gap-3"><img src={img(p.pic, 120)} alt="" className="h-16 w-16 rounded-xl object-cover" /><div className="flex-1 text-sm"><div className="font-semibold">{l.n}</div><div className="text-neutral-500">{money(l.p)}</div></div><div className="flex items-center gap-2 text-sm"><button aria-label="-" onClick={() => add(l.id, -1)} className="grid h-7 w-7 place-items-center rounded-full border"><Minus size={12} /></button>{l.q}<button aria-label="+" onClick={() => add(l.id, 1)} className="grid h-7 w-7 place-items-center rounded-full border"><Plus size={12} /></button></div></div>; })}
            {lines.length > 0 && <div className="space-y-2 pt-3"><input placeholder="Нэр" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} className="w-full rounded-xl border px-4 py-3 text-sm" /><input placeholder="Утас" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} className="w-full rounded-xl border px-4 py-3 text-sm" /><input placeholder="Хаяг" value={f.addr} onChange={(e) => setF({ ...f, addr: e.target.value })} className="w-full rounded-xl border px-4 py-3 text-sm" /></div>}</div>
          <div className="space-y-3 border-t p-5"><div className="flex justify-between text-lg font-black"><span>Нийт</span><span>{money(total)}</span></div><button disabled={!lines.length || !f.name || f.phone.length < 6 || !f.addr} onClick={buy} className="w-full rounded-full bg-[#a3e635] py-3.5 font-bold disabled:opacity-30">Худалдаж авах</button></div></>}
      </aside></div>}
    </div>
  );
}

export function ShopAdmin() {
  const [prods, setProds] = useLocal<Prod[]>("shop2:prods", PRODS);
  const [orders, setOrders] = useLocal<Order[]>("shop2:orders", SEED);
  const [toast, say] = useToast();
  const tone = (s: Stat) => ({ "Төлбөр хүлээгдэж буй": "amber", "Баглаж байна": "blue", "Хүргэлтэнд": "violet", "Хүргэгдсэн": "green", "Буцаасан": "red" })[s];
  const ok = orders.filter((o) => o.status !== "Буцаасан"), rev = ok.reduce((s, o) => s + o.total, 0);
  const d7 = Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - (6 - i)); return d.toDateString(); });
  const chart = d7.map((d) => ok.filter((o) => new Date(o.at).toDateString() === d).reduce((s, o) => s + o.total, 0));
  const low = prods.filter((p) => p.stock <= 5);
  const dash = (<div className="space-y-5"><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Kpi icon={Wallet} label="Орлого" value={money(rev)} delta="+22% өмнөх 7 хоногоос" /><Kpi icon={ClipboardList} label="Захиалга" value={orders.length} /><Kpi icon={Package} label="Бүтээгдэхүүн" value={prods.length} /><Kpi icon={AlertTriangle} label="Нөөц дуусаж буй" value={low.length} /></div>
    <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr]"><Card title="7 хоногийн борлуулалт"><BarChart data={chart} labels={d7.map((d) => d.slice(8, 10))} fmt={money} /></Card><Card title="Нөөц багатай">{low.length === 0 ? <p className="text-sm text-[var(--mut)]">Бүгд хэвийн</p> : <div className="space-y-3">{low.map((p) => <div key={p.id} className="flex items-center gap-3"><img src={img(p.pic, 100)} alt="" className="h-10 w-10 rounded-lg object-cover" /><span className="flex-1 truncate text-sm font-semibold">{p.name}</span><Chip tone={p.stock === 0 ? "red" : "amber"}>{p.stock} ш</Chip></div>)}</div>}</Card></div></div>);
  const ord = (<Card><Table head={["ID", "Огноо", "Хэрэглэгч", "Бараа", "Дүн", "Төлөв", ""]} rows={orders.map((o) => [<b key="i">{o.id}</b>, fmtDate(o.at), <div key="n"><div className="font-semibold">{o.name}</div><div className="text-xs text-[var(--mut)]">{o.phone}</div></div>, <span key="l" className="text-xs">{o.lines.map((l) => `${l.n} ×${l.q}`).join(", ")}</span>, money(o.total), <Select key="s" value={o.status} options={STAT} onChange={(v) => { setOrders((p) => p.map((x) => (x.id === o.id ? { ...x, status: v } : x))); say(`${o.id}: ${v}`); }} />, <button key="d" aria-label="Устгах" className="text-[var(--mut)] hover:text-red-500" onClick={() => setOrders((p) => p.filter((x) => x.id !== o.id))}><Trash2 size={15} /></button>])} /></Card>);
  const pr = (<div className="space-y-3">{prods.map((p) => <Card key={p.id}><div className="flex flex-wrap items-center gap-3"><img src={img(p.pic, 120)} alt="" className="h-14 w-14 rounded-xl object-cover" /><input value={p.name} onChange={(e) => setProds((a) => a.map((x) => (x.id === p.id ? { ...x, name: e.target.value } : x)))} className={`${inp} min-w-[180px] flex-1`} /><label className="text-xs text-[var(--mut)]">Үнэ<input type="number" value={p.price} onChange={(e) => setProds((a) => a.map((x) => (x.id === p.id ? { ...x, price: +e.target.value } : x)))} className={`${inp} !w-32`} /></label><label className="text-xs text-[var(--mut)]">Нөөц<input type="number" value={p.stock} onChange={(e) => setProds((a) => a.map((x) => (x.id === p.id ? { ...x, stock: Math.max(0, +e.target.value) } : x)))} className={`${inp} !w-20`} /></label><button className={btnGhost} onClick={() => { setProds((a) => a.filter((x) => x.id !== p.id)); say("Устгалаа"); }}><Trash2 size={14} /></button></div></Card>)}<button className={btnAcc} onClick={() => { setProds((a) => [...a, { id: uid(), name: "Шинэ бүтээгдэхүүн", cat: "Аксессуар", price: 99000, pic: "1523275335684-37898b6baf30", rate: 4.5, stock: 10 }]); say("Нэмэгдлээ"); }}><Plus size={14} /> Бүтээгдэхүүн нэмэх</button></div>);
  return (<><AdminShell brand="Мини Шоп" sub="Дэлгүүрийн админ" acc={lime} dark={false} back="/demo/shop" tabs={[{ key: "d", label: "Хянах самбар", icon: LayoutDashboard, node: dash }, { key: "o", label: "Захиалгууд", icon: ClipboardList, node: ord }, { key: "p", label: "Бүтээгдэхүүн", icon: Package, node: pr }]} /><Toast msg={toast} /></>);
}
