"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { ShoppingBag, Plus, Minus, X, Flame, Clock, Star, Bike, Check, LayoutDashboard, ClipboardList, Utensils, Wallet, Trash2, MapPin } from "lucide-react";
import { money, uid, useLocal, useToast, Toast, img, ago, fmtDate, AdminShell, Card, Kpi, BarChart, Chip, TONES, Table, inp, btnAcc, btnGhost, Select } from "./kit";

type Item = { id: string; name: string; cat: string; price: number; pic: string; desc: string; hot?: boolean; on: boolean };
const STAT = ["Шинэ", "Бэлтгэж байна", "Хүргэлтэнд", "Хүргэгдсэн", "Цуцалсан"] as const;
type Stat = (typeof STAT)[number];
type Order = { id: string; at: string; name: string; phone: string; addr: string; lines: { id: string; n: string; q: number; p: number }[]; total: number; status: Stat };
const MENU: Item[] = [
  { id: "m1", name: "Цуйван тайлсан махтай", cat: "Үндсэн хоол", price: 14500, pic: "1555939594-58d7cb561ad1", desc: "Гар аргаар зүссэн гурил, шарсан үхрийн мах, хүнсний ногоо.", hot: true, on: true },
  { id: "m2", name: "Хуушуур (4 ширхэг)", cat: "Үндсэн хоол", price: 9800, pic: "1504674900247-0877df9cc836", desc: "Шүүслэг мах, нимгэн хийц, халуун.", on: true },
  { id: "m3", name: "Бууз (10 ширхэг)", cat: "Үндсэн хоол", price: 12000, pic: "1512621776951-a57141f2eefd", desc: "Уурандаа жигнэсэн уламжлалт бууз.", hot: true, on: true },
  { id: "m4", name: "Грилл стейк", cat: "Грилл", price: 38000, pic: "1555939594-58d7cb561ad1", desc: "Тал шарсан үхрийн нурууны стейк, шарсан төмс.", on: true },
  { id: "m5", name: "Маргарита пицца", cat: "Грилл", price: 26000, pic: "1565299624946-b28f40a0ae38", desc: "Чулуун зуухан дээр, шинэ базилик.", on: true },
  { id: "m6", name: "Цэвэр салат", cat: "Хөнгөн", price: 11000, pic: "1546069901-ba9599a7e63c", desc: "Улирлын ногоо, оливын тос, бяслаг.", on: true },
  { id: "m7", name: "Гурилан шөл", cat: "Хөнгөн", price: 8500, pic: "1512621776951-a57141f2eefd", desc: "Ширээний шөл, халуун, чанасан гурилтай.", on: true },
  { id: "m8", name: "Бүйлс жигнэмэг", cat: "Амттан", price: 7000, pic: "1567620905732-2d1ec7ab7445", desc: "Гэрийн жигнэмэг, зөгийн бал.", on: true },
];
const CATS = ["Бүгд", "Үндсэн хоол", "Грилл", "Хөнгөн", "Амттан"];
const NAMES = ["Сарнай", "Билэг", "Тэнгис", "Оюунаа", "Номин", "Ганхүү", "Аюуш", "Мөнхцэцэг", "Анужин", "Баярмаа", "Дэлгэр", "Чулуун", "Хонгорзул", "Тамир"];
const SEED: Order[] = Array.from({ length: 18 }, (_, i) => {
  const a = MENU[i % 8], b = MENU[(i * 3 + 1) % 8], q = (i % 3) + 1;
  const lines = [{ id: a.id, n: a.name, q, p: a.price }, { id: b.id, n: b.name, q: 1, p: b.price }];
  return { id: `H${200 + i}`, at: ago(Math.floor(i / 3), 11 + (i % 8)), name: NAMES[i % 14], phone: `88${String(110000 + i * 3571).slice(0, 6)}`, addr: `${(i % 9) + 1}-р хороолол, ${i + 12} байр`, lines, total: lines.reduce((s, l) => s + l.q * l.p, 0), status: i < 3 ? (["Шинэ", "Бэлтгэж байна", "Хүргэлтэнд"] as Stat[])[i] : i % 11 === 0 ? "Цуцалсан" : "Хүргэгдсэн" };
});
const red = "#e2552b";

export function RestaurantSite() {
  const [menu] = useLocal<Item[]>("rest2:menu", MENU);
  const [orders, setOrders] = useLocal<Order[]>("rest2:orders", SEED);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [cat, setCat] = useState("Бүгд");
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ name: "", phone: "", addr: "" });
  const [last, setLast] = useState<Order | null>(null);
  const items = menu.filter((m) => m.on && (cat === "Бүгд" || m.cat === cat));
  const lines = useMemo(() => menu.filter((m) => cart[m.id]).map((m) => ({ id: m.id, n: m.name, q: cart[m.id], p: m.price })), [menu, cart]);
  const sub = lines.reduce((s, l) => s + l.q * l.p, 0), fee = sub > 0 && sub < 40000 ? 3000 : 0, count = lines.reduce((s, l) => s + l.q, 0);
  const add = (id: string, d: number) => setCart((c) => { const q = Math.max(0, (c[id] ?? 0) + d); const n = { ...c, [id]: q }; if (!q) delete n[id]; return n; });
  const place = () => {
    const o: Order = { id: `H${uid()}`, at: new Date().toISOString(), ...f, lines, total: sub + fee, status: "Шинэ" };
    setOrders((p) => [o, ...p]); setLast(o); setCart({}); setOpen(false);
  };
  const step = last ? Math.max(0, STAT.indexOf(orders.find((o) => o.id === last.id)?.status ?? "Шинэ")) : 0;
  return (
    <div className="bg-[#fbf6ee] text-[#2a1810]" style={{ fontFamily: "Georgia, serif" }}>
      <nav className="sticky top-9 z-40 flex items-center justify-between bg-[#fbf6ee]/85 px-5 py-4 backdrop-blur-xl sm:px-10">
        <a href="#top" className="flex items-center gap-2 text-2xl font-bold" style={{ color: red }}><Flame size={24} /> Халуун Ширээ</a>
        <div className="flex items-center gap-3">
          <Link href="/demo/restaurant/admin" className="hidden rounded-full border border-[#2a1810]/20 px-4 py-2 text-sm font-semibold sm:block">Admin</Link>
          <button onClick={() => setOpen(true)} className="relative flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-white" style={{ background: red }}><ShoppingBag size={17} /> Сагс{count > 0 && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-white px-1 text-xs" style={{ color: red }}>{count}</span>}</button>
        </div>
      </nav>
      <header id="top" className="relative isolate overflow-hidden px-5 pb-20 pt-10 sm:px-10">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-semibold shadow-sm"><Bike size={15} style={{ color: red }} /> 30 минутад хүргэнэ</p>
            <h1 className="text-5xl font-bold leading-[1.05] sm:text-7xl">Халуун хоол,<br /><span style={{ color: red }}>халуун сэтгэл.</span></h1>
            <p className="mt-6 max-w-md text-lg text-[#2a1810]/70">Гэрийн амттай уламжлалт хоол, орчин үеийн грилл. Хүссэнээ сонгоод сагсалж, хаяг руугаа хүргүүл.</p>
            <div className="mt-8 flex flex-wrap items-center gap-4"><a href="#menu" className="rounded-full px-8 py-4 font-bold text-white shadow-lg transition hover:-translate-y-0.5" style={{ background: red, boxShadow: "0 14px 30px -10px #e2552b" }}>Цэс үзэх</a><span className="flex items-center gap-1 text-sm"><Star size={16} fill="#f5b301" className="text-[#f5b301]" /> <b>4.9</b> · 2,300+ үнэлгээ</span></div>
          </div>
          <div className="relative"><img src={img("1414235077428-338989a2e8c0", 1100)} alt="" className="aspect-[5/4] w-full rounded-[2.5rem] object-cover shadow-2xl" /><div className="absolute -bottom-5 -left-3 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-xl"><span className="grid h-11 w-11 place-items-center rounded-xl text-white" style={{ background: red }}><Clock size={20} /></span><div><div className="text-sm font-bold">Дундаж хугацаа</div><div className="text-xs text-neutral-500">28 минут</div></div></div></div>
        </div>
      </header>
      {last && (
        <section className="mx-auto max-w-4xl px-5"><div className="mb-14 rounded-3xl bg-white p-6 shadow-lg">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2"><b>Таны захиалга #{last.id}</b><span className="text-sm text-neutral-500">{money(last.total)}</span></div>
          {step === 4 ? <p className="text-red-600">Захиалга цуцлагдсан.</p> : <div className="flex items-center">{STAT.slice(0, 4).map((s, i) => <div key={s} className="flex flex-1 items-center last:flex-none"><div className="flex flex-col items-center gap-1.5 text-center text-[11px] font-semibold"><span className={`grid h-9 w-9 place-items-center rounded-full ${i <= step ? "text-white" : "bg-neutral-200 text-neutral-400"}`} style={i <= step ? { background: red } : {}}>{i <= step ? <Check size={16} /> : i + 1}</span>{s}</div>{i < 3 && <div className={`mx-1 mb-5 h-0.5 flex-1 ${i < step ? "" : "bg-neutral-200"}`} style={i < step ? { background: red } : {}} />}</div>)}</div>}
          <p className="mt-3 text-xs text-neutral-400">Админ самбараас төлөвийг өөрчилж үзээрэй.</p>
        </div></section>
      )}
      <section id="menu" className="mx-auto max-w-6xl px-5 pb-24 sm:px-10">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4"><h2 className="text-4xl font-bold">Манай цэс</h2><div className="flex flex-wrap gap-2">{CATS.map((c) => <button key={c} onClick={() => setCat(c)} className={`rounded-full px-5 py-2 text-sm font-semibold transition ${cat === c ? "text-white" : "bg-white hover:bg-[#2a1810]/5"}`} style={cat === c ? { background: red } : {}}>{c}</button>)}</div></div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((m) => (
            <article key={m.id} className="group overflow-hidden rounded-3xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <div className="relative aspect-[4/3] overflow-hidden"><img src={img(m.pic, 700)} alt={m.name} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />{m.hot && <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold text-white" style={{ background: red }}><Flame size={12} /> Эрэлттэй</span>}</div>
              <div className="p-5"><h3 className="text-xl font-bold">{m.name}</h3><p className="mt-1 min-h-10 text-sm text-neutral-500">{m.desc}</p>
                <div className="mt-4 flex items-center justify-between"><span className="text-xl font-bold" style={{ color: red }}>{money(m.price)}</span>
                  {cart[m.id] ? <div className="flex items-center gap-3 rounded-full bg-[#fbf6ee] p-1"><button aria-label="-" onClick={() => add(m.id, -1)} className="grid h-8 w-8 place-items-center rounded-full bg-white"><Minus size={14} /></button><b>{cart[m.id]}</b><button aria-label="+" onClick={() => add(m.id, 1)} className="grid h-8 w-8 place-items-center rounded-full text-white" style={{ background: red }}><Plus size={14} /></button></div>
                    : <button onClick={() => add(m.id, 1)} className="flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-bold text-white transition hover:brightness-110" style={{ background: red }}><Plus size={15} /> Нэмэх</button>}</div></div>
            </article>
          ))}
        </div>
      </section>
      <footer className="bg-[#2a1810] px-5 py-12 text-center text-sm text-white/60"><MapPin size={14} className="mr-1 inline" /> Баянзүрх дүүрэг · 11:00–23:00 · +976 7700 0000 · Демо</footer>
      {open && <div className="fixed inset-0 z-[110] flex justify-end bg-black/50" onClick={() => setOpen(false)}>
        <aside onClick={(e) => e.stopPropagation()} className="flex h-full w-full max-w-md flex-col bg-white" style={{ fontFamily: "system-ui, sans-serif" }}>
          <div className="flex items-center justify-between border-b p-5"><b className="text-xl">Таны сагс</b><button aria-label="Хаах" onClick={() => setOpen(false)}><X /></button></div>
          <div className="flex-1 space-y-3 overflow-y-auto p-5">
            {lines.length === 0 && <p className="py-16 text-center text-neutral-400">Сагс хоосон байна</p>}
            {lines.map((l) => <div key={l.id} className="flex items-center gap-3 text-sm"><div className="flex-1"><div className="font-semibold">{l.n}</div><div className="text-neutral-500">{money(l.p)}</div></div><div className="flex items-center gap-2"><button aria-label="-" onClick={() => add(l.id, -1)} className="grid h-7 w-7 place-items-center rounded-full border"><Minus size={12} /></button>{l.q}<button aria-label="+" onClick={() => add(l.id, 1)} className="grid h-7 w-7 place-items-center rounded-full border"><Plus size={12} /></button></div></div>)}
            {lines.length > 0 && <div className="space-y-2 pt-4"><input placeholder="Нэр" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} className="w-full rounded-xl border px-4 py-3 text-sm" /><input placeholder="Утас" inputMode="tel" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} className="w-full rounded-xl border px-4 py-3 text-sm" /><input placeholder="Хүргэлтийн хаяг" value={f.addr} onChange={(e) => setF({ ...f, addr: e.target.value })} className="w-full rounded-xl border px-4 py-3 text-sm" /></div>}
          </div>
          <div className="space-y-2 border-t p-5 text-sm"><div className="flex justify-between"><span>Дүн</span><span>{money(sub)}</span></div><div className="flex justify-between"><span>Хүргэлт {fee === 0 && sub > 0 && "(үнэгүй)"}</span><span>{money(fee)}</span></div><div className="flex justify-between text-lg font-bold"><span>Нийт</span><span>{money(sub + fee)}</span></div>
            <button disabled={!lines.length || !f.name || f.phone.length < 6 || !f.addr} onClick={place} className="mt-2 w-full rounded-full py-3.5 font-bold text-white disabled:opacity-30" style={{ background: red }}>Захиалах</button></div>
        </aside></div>}
    </div>
  );
}

export function RestaurantAdmin() {
  const [menu, setMenu] = useLocal<Item[]>("rest2:menu", MENU);
  const [orders, setOrders] = useLocal<Order[]>("rest2:orders", SEED);
  const [toast, say] = useToast();
  const tone = (s: Stat) => ({ "Шинэ": "blue", "Бэлтгэж байна": "amber", "Хүргэлтэнд": "violet", "Хүргэгдсэн": "green", "Цуцалсан": "red" })[s];
  const valid = orders.filter((o) => o.status !== "Цуцалсан");
  const rev = valid.reduce((s, o) => s + o.total, 0);
  const d7 = Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - (6 - i)); return d.toDateString(); });
  const chart = d7.map((d) => valid.filter((o) => new Date(o.at).toDateString() === d).reduce((s, o) => s + o.total, 0));
  const top = menu.map((m) => ({ m, q: orders.reduce((s, o) => s + (o.lines.find((l) => l.id === m.id)?.q ?? 0), 0) })).sort((a, b) => b.q - a.q).slice(0, 5);
  const dash = (<div className="space-y-5">
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Kpi icon={Wallet} label="Нийт борлуулалт" value={money(rev)} delta="+18% өмнөх 7 хоногоос" /><Kpi icon={ClipboardList} label="Захиалга" value={orders.length} /><Kpi icon={Flame} label="Шинэ / бэлтгэж буй" value={orders.filter((o) => o.status === "Шинэ" || o.status === "Бэлтгэж байна").length} /><Kpi icon={Bike} label="Дундаж чек" value={money(Math.round(rev / Math.max(1, valid.length)))} /></div>
    <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr]"><Card title="7 хоногийн борлуулалт"><BarChart data={chart} labels={d7.map((d) => d.slice(8, 10))} fmt={money} /></Card>
      <Card title="Шилдэг 5 хоол"><div className="space-y-3">{top.map(({ m, q }) => <div key={m.id} className="flex items-center gap-3"><img src={img(m.pic, 100)} alt="" className="h-10 w-10 rounded-lg object-cover" /><span className="flex-1 truncate text-sm font-semibold">{m.name}</span><Chip tone="green">{q} ш</Chip></div>)}</div></Card></div></div>);
  const ord = (<Card><Table head={["ID", "Хугацаа", "Хэрэглэгч", "Хоол", "Дүн", "Төлөв", ""]} rows={orders.map((o) => [<b key="i">{o.id}</b>, fmtDate(o.at), <div key="n"><div className="font-semibold">{o.name}</div><div className="text-xs text-[var(--mut)]">{o.addr}</div></div>, <span key="l" className="text-xs">{o.lines.map((l) => `${l.n} ×${l.q}`).join(", ")}</span>, money(o.total), <div key="s" className="flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full" style={{ background: TONES[tone(o.status)] }} /><Select value={o.status} options={STAT} onChange={(v) => { setOrders((p) => p.map((x) => (x.id === o.id ? { ...x, status: v } : x))); say(`${o.id}: ${v}`); }} /></div>, <button key="d" aria-label="Устгах" className="text-[var(--mut)] hover:text-red-500" onClick={() => setOrders((p) => p.filter((x) => x.id !== o.id))}><Trash2 size={15} /></button>])} /></Card>);
  const mn = (<div className="grid gap-4 md:grid-cols-2">{menu.map((m) => <Card key={m.id}><div className="flex items-center gap-3"><img src={img(m.pic, 120)} alt="" className="h-16 w-16 rounded-xl object-cover" /><div className="min-w-0 flex-1"><input value={m.name} onChange={(e) => setMenu((p) => p.map((x) => (x.id === m.id ? { ...x, name: e.target.value } : x)))} className={`${inp} mb-2`} /><div className="flex items-center gap-2"><input type="number" value={m.price} onChange={(e) => setMenu((p) => p.map((x) => (x.id === m.id ? { ...x, price: +e.target.value } : x)))} className={`${inp} !w-28`} /><button className={m.on ? btnAcc : btnGhost} onClick={() => { setMenu((p) => p.map((x) => (x.id === m.id ? { ...x, on: !x.on } : x))); say(m.on ? "Цэснээс нууллаа" : "Цэсэнд харууллаа"); }}>{m.on ? "Идэвхтэй" : "Нуугдсан"}</button></div></div></div></Card>)}</div>);
  return (<><AdminShell brand="Халуун Ширээ" sub="Рестораны админ" acc={red} dark={false} back="/demo/restaurant" tabs={[{ key: "d", label: "Хянах самбар", icon: LayoutDashboard, node: dash }, { key: "o", label: "Захиалгууд", icon: ClipboardList, node: ord }, { key: "m", label: "Цэс", icon: Utensils, node: mn }]} /><Toast msg={toast} /></>);
}
