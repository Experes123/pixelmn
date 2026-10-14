"use client";
import { useState } from "react";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Bike, X } from "lucide-react";
import { money, uid, useLocal, useToast, Toast, Stat } from "./kit";

type Dish = { id: string; cat: string; name: string; desc: string; price: number; emoji: string; on: boolean };
type Step = "Хүлээн авсан" | "Бэлтгэж байна" | "Хүргэлтэнд гарсан" | "Хүргэгдсэн";
const STEPS: Step[] = ["Хүлээн авсан", "Бэлтгэж байна", "Хүргэлтэнд гарсан", "Хүргэгдсэн"];
type Order = { id: string; items: { name: string; qty: number; price: number }[]; total: number; name: string; phone: string; addr: string; step: Step };
const MENU: Dish[] = [
  { id: "d1", cat: "Үндсэн", name: "Бууз (10ш)", desc: "Үхрийн махтай уламжлалт бууз", price: 12000, emoji: "🥟", on: true },
  { id: "d2", cat: "Үндсэн", name: "Цуйван", desc: "Гэрийн гурилаар, ногоотой", price: 11000, emoji: "🍜", on: true },
  { id: "d3", cat: "Үндсэн", name: "Хуушуур (4ш)", desc: "Шаржигнасан, шүүслэг", price: 9000, emoji: "🥠", on: true },
  { id: "d4", cat: "Гурил", name: "Пицца Пепперони", desc: "30см, моцарелла", price: 28000, emoji: "🍕", on: true },
  { id: "d5", cat: "Гурил", name: "Бургер дуэт", desc: "2 бургер + шарсан төмс", price: 24000, emoji: "🍔", on: true },
  { id: "d6", cat: "Ундаа", name: "Сүүтэй цай", desc: "Халуун, 500мл", price: 3500, emoji: "🍵", on: true },
  { id: "d7", cat: "Ундаа", name: "Лимонад", desc: "Гэрийн, 400мл", price: 6000, emoji: "🍋", on: true },
  { id: "d8", cat: "Амттан", name: "Чизкейк", desc: "Мангастай", price: 9500, emoji: "🍰", on: true },
];
const CATS = ["Бүгд", "Үндсэн", "Гурил", "Ундаа", "Амттан"];
const FEE = 4000;

export function RestaurantSite() {
  const [menu] = useLocal<Dish[]>("rest:menu", MENU);
  const [orders, setOrders] = useLocal<Order[]>("rest:orders", []);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [cat, setCat] = useState("Бүгд");
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ name: "", phone: "", addr: "" });
  const [placed, setPlaced] = useState<string | null>(null);
  const lines = menu.filter((d) => cart[d.id]).map((d) => ({ name: d.name, qty: cart[d.id], price: d.price }));
  const sub = lines.reduce((a, l) => a + l.qty * l.price, 0), count = lines.reduce((a, l) => a + l.qty, 0);
  const add = (id: string, n: number) => setCart((c) => { const q = Math.max(0, (c[id] || 0) + n); const x = { ...c, [id]: q }; if (!q) delete x[id]; return x; });
  const place = () => { const id = uid(); setOrders((p) => [{ id, items: lines, total: sub + FEE, ...f, step: STEPS[0] }, ...p]); setCart({}); setPlaced(id); };
  const track = orders.find((o) => o.id === placed);
  return (
    <div className="min-h-screen bg-[#fff4e6] text-[#3b1d12]" style={{ fontFamily: "Georgia, serif" }}>
      <nav className="sticky top-9 z-40 flex items-center justify-between bg-[#b3261e] px-5 py-3 text-[#fff4e6] shadow-lg">
        <a href="#top" className="text-2xl font-bold italic">🔥 Халуун Ширээ</a>
        <div className="flex items-center gap-3 text-sm">
          <span className="hidden items-center gap-1 sm:flex"><Bike size={16} /> 30–45 мин</span>
          <Link href="/demo/restaurant/admin" className="rounded-full bg-[#fff4e6] px-4 py-1.5 font-bold text-[#b3261e]">Admin</Link>
          <button onClick={() => setOpen(true)} className="relative rounded-full bg-[#3b1d12] p-2.5" aria-label="Сагс"><ShoppingBag size={18} />{count > 0 && <b className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-[#f59e0b] text-xs text-black">{count}</b>}</button>
        </div>
      </nav>
      <header id="top" className="bg-gradient-to-br from-[#b3261e] to-[#ea580c] px-6 py-16 text-center text-[#fff4e6]">
        <h1 className="text-5xl font-bold italic sm:text-6xl">Гэрийн амт, хаалганд тань</h1>
        <p className="mt-3 opacity-90">Захиал → Бид хийнэ → Хурдан хүргэнэ. Хүргэлт {money(FEE)}.</p>
      </header>
      <main className="mx-auto max-w-5xl px-5 py-10">
        {track && !open && (
          <div className="mb-8 rounded-2xl border-2 border-dashed border-[#b3261e] bg-white p-5">
            <b>Таны захиалга #{track.id}</b>
            <div className="mt-3 grid grid-cols-4 gap-2 text-center text-xs">{STEPS.map((s, i) => <div key={s} className={`rounded-lg p-2 ${i <= STEPS.indexOf(track.step) ? "bg-[#b3261e] text-white" : "bg-[#fde7d0]"}`}>{s}</div>)}</div>
            <p className="mt-2 text-xs opacity-60">Төлөв админ дээр өөрчлөгдөхөд энд шинэчлэгдэнэ (дахин нээж үзнэ үү).</p>
          </div>
        )}
        <div className="mb-6 flex flex-wrap gap-2">{CATS.map((c) => <button key={c} onClick={() => setCat(c)} className={`rounded-full px-4 py-2 text-sm font-semibold ${cat === c ? "bg-[#b3261e] text-white" : "bg-white"}`}>{c}</button>)}</div>
        <div className="grid gap-4 sm:grid-cols-2">
          {menu.filter((d) => cat === "Бүгд" || d.cat === cat).map((d) => (
            <div key={d.id} className={`flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm ${d.on ? "" : "opacity-40"}`}>
              <div className="grid h-20 w-20 shrink-0 place-items-center rounded-xl bg-[#fde7d0] text-4xl">{d.emoji}</div>
              <div className="flex-1"><div className="font-bold">{d.name}</div><div className="text-sm opacity-60">{d.desc}</div><div className="mt-1 font-bold text-[#b3261e]">{money(d.price)}</div></div>
              {d.on ? (cart[d.id] ? <div className="flex items-center gap-2"><button onClick={() => add(d.id, -1)} className="rounded-full bg-[#fde7d0] p-1.5"><Minus size={14} /></button><b>{cart[d.id]}</b><button onClick={() => add(d.id, 1)} className="rounded-full bg-[#b3261e] p-1.5 text-white"><Plus size={14} /></button></div>
                : <button onClick={() => add(d.id, 1)} className="rounded-full bg-[#b3261e] px-4 py-2 text-sm font-bold text-white">Нэмэх</button>) : <span className="text-xs">Дууссан</span>}
            </div>))}
        </div>
      </main>
      {open && (
        <div className="fixed inset-0 z-[95] flex justify-end bg-black/50" onClick={() => setOpen(false)}>
          <aside onClick={(e) => e.stopPropagation()} className="flex h-full w-full max-w-md flex-col overflow-y-auto bg-white p-6">
            <div className="mb-4 flex items-center justify-between"><h2 className="text-2xl font-bold italic">Таны сагс</h2><button onClick={() => setOpen(false)}><X /></button></div>
            {placed && !count ? (
              <div className="text-center"><p className="text-5xl">🎉</p><p className="mt-3 text-xl font-bold">Захиалга #{placed} хүлээн авлаа!</p><button onClick={() => setOpen(false)} className="mt-4 rounded-full bg-[#b3261e] px-6 py-2 text-white">Хаах</button></div>
            ) : count === 0 ? <p className="opacity-60">Сагс хоосон байна.</p> : (<>
              {lines.map((l) => <div key={l.name} className="flex justify-between border-b py-2 text-sm"><span>{l.qty} × {l.name}</span><b>{money(l.qty * l.price)}</b></div>)}
              <div className="mt-3 space-y-1 text-sm"><div className="flex justify-between"><span>Дүн</span><span>{money(sub)}</span></div><div className="flex justify-between"><span>Хүргэлт</span><span>{money(FEE)}</span></div><div className="flex justify-between text-lg font-bold"><span>Нийт</span><span>{money(sub + FEE)}</span></div></div>
              <div className="mt-5 space-y-2">
                {(["name", "phone", "addr"] as const).map((k) => <input key={k} placeholder={{ name: "Нэр", phone: "Утас", addr: "Хүргэх хаяг (дүүрэг, хороо, байр, тоот)" }[k]} value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} className="w-full rounded-xl border px-4 py-3" />)}
              </div>
              <button disabled={!f.name || f.phone.length < 6 || f.addr.length < 5} onClick={place} className="mt-4 rounded-full bg-[#b3261e] py-3 font-bold text-white disabled:opacity-40">Захиалга өгөх (бэлнээр төлөх)</button>
            </>)}
          </aside>
        </div>
      )}
    </div>
  );
}

export function RestaurantAdmin() {
  const [menu, setMenu] = useLocal<Dish[]>("rest:menu", MENU);
  const [orders, setOrders] = useLocal<Order[]>("rest:orders", []);
  const [toast, say] = useToast();
  const next = (o: Order) => { const s = STEPS[Math.min(3, STEPS.indexOf(o.step) + 1)]; setOrders((p) => p.map((x) => (x.id === o.id ? { ...x, step: s } : x))); say(`#${o.id}: ${s}`); };
  return (
    <div className="min-h-screen bg-[#2a1510] text-[#fff4e6]" style={{ fontFamily: "Georgia, serif" }}>
      <nav className="flex items-center justify-between bg-[#b3261e] px-5 py-3"><b className="italic">Халуун Ширээ · Admin</b><Link href="/demo/restaurant" className="rounded-full bg-[#fff4e6] px-4 py-1.5 text-sm font-bold text-[#b3261e]">← Сайт руу</Link></nav>
      <div className="mx-auto max-w-5xl space-y-8 p-6">
        <div className="grid gap-3 sm:grid-cols-3">
          <Stat cls="bg-white/10" label="Захиалга" value={orders.length} />
          <Stat cls="bg-white/10" label="Идэвхтэй" value={orders.filter((o) => o.step !== "Хүргэгдсэн").length} />
          <Stat cls="bg-white/10" label="Борлуулалт" value={money(orders.reduce((a, o) => a + o.total, 0))} />
        </div>
        <section><h2 className="mb-3 text-xl font-bold italic">Захиалгууд</h2>
          {orders.length === 0 && <p className="opacity-60">Захиалга алга. Сайтаас захиалж үзээрэй.</p>}
          {orders.map((o) => (
            <div key={o.id} className="mb-2 rounded-xl bg-white/10 p-4 text-sm">
              <div className="flex flex-wrap items-center gap-3"><b>#{o.id}</b><span>{o.name} · {o.phone}</span><span className="ml-auto rounded-full bg-[#f59e0b] px-3 py-0.5 text-xs font-bold text-black">{o.step}</span><b>{money(o.total)}</b></div>
              <div className="mt-1 opacity-70">{o.items.map((i) => `${i.qty}×${i.name}`).join(", ")} — 📍 {o.addr}</div>
              {o.step !== "Хүргэгдсэн" && <button onClick={() => next(o)} className="mt-2 rounded-full bg-[#b3261e] px-4 py-1 font-bold">Дараагийн төлөв →</button>}
            </div>))}
        </section>
        <section><h2 className="mb-3 text-xl font-bold italic">Цэс удирдлага</h2>
          {menu.map((d) => (
            <div key={d.id} className="mb-2 flex items-center gap-3 text-sm">
              <span className="text-2xl">{d.emoji}</span><span className="flex-1">{d.name}</span>
              <input type="number" value={d.price} onChange={(e) => setMenu((p) => p.map((x) => (x.id === d.id ? { ...x, price: +e.target.value } : x)))} className="w-28 rounded bg-white/10 px-3 py-1.5" />
              <button onClick={() => setMenu((p) => p.map((x) => (x.id === d.id ? { ...x, on: !x.on } : x)))} className={`w-24 rounded-full px-3 py-1.5 font-bold ${d.on ? "bg-green-600" : "bg-neutral-600"}`}>{d.on ? "Идэвхтэй" : "Дууссан"}</button>
            </div>))}
        </section>
      </div>
      <Toast msg={toast} />
    </div>
  );
}
