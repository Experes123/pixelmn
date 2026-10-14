"use client";
import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, X, Plus, Minus, CheckCircle2 } from "lucide-react";
import { money, uid, useLocal, useToast, Toast, Stat } from "./kit";

type Product = { id: string; name: string; cat: string; price: number; stock: number; color: string; emoji: string };
type Order = { id: string; lines: { name: string; qty: number; price: number }[]; total: number; name: string; email: string; addr: string; pay: string; status: "Шинэ" | "Илгээсэн" | "Хүргэгдсэн" };
const PRODUCTS: Product[] = [
  { id: "p1", name: "Оверсайз цамц", cat: "Хувцас", price: 59000, stock: 14, color: "#bef264", emoji: "👕" },
  { id: "p2", name: "Кроссовок Air", cat: "Гутал", price: 189000, stock: 6, color: "#fde68a", emoji: "👟" },
  { id: "p3", name: "Нуруун үүргэвч", cat: "Аксессуар", price: 89000, stock: 9, color: "#a5f3fc", emoji: "🎒" },
  { id: "p4", name: "Нарны шил", cat: "Аксессуар", price: 45000, stock: 20, color: "#fbcfe8", emoji: "🕶️" },
  { id: "p5", name: "Худи", cat: "Хувцас", price: 99000, stock: 11, color: "#ddd6fe", emoji: "🧥" },
  { id: "p6", name: "Тоглоомын чихэвч", cat: "Электрон", price: 129000, stock: 7, color: "#fed7aa", emoji: "🎧" },
  { id: "p7", name: "Ухаалаг цаг", cat: "Электрон", price: 249000, stock: 4, color: "#bbf7d0", emoji: "⌚" },
  { id: "p8", name: "Малгай", cat: "Аксессуар", price: 29000, stock: 25, color: "#fecaca", emoji: "🧢" },
];
const CATS = ["Бүгд", "Хувцас", "Гутал", "Аксессуар", "Электрон"];

export function ShopSite() {
  const [products, setProducts] = useLocal<Product[]>("shop:products", PRODUCTS);
  const [orders, setOrders] = useLocal<Order[]>("shop:orders", []);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [cat, setCat] = useState("Бүгд");
  const [view, setView] = useState<"cart" | "checkout" | "done" | null>(null);
  const [f, setF] = useState({ name: "", email: "", addr: "", pay: "Карт" });
  const [last, setLast] = useState("");
  const lines = products.filter((p) => cart[p.id]).map((p) => ({ name: p.name, id: p.id, qty: cart[p.id], price: p.price }));
  const total = lines.reduce((a, l) => a + l.qty * l.price, 0), count = lines.reduce((a, l) => a + l.qty, 0);
  const add = (p: Product, n: number) => setCart((c) => { const q = Math.min(p.stock, Math.max(0, (c[p.id] || 0) + n)); const x = { ...c, [p.id]: q }; if (!q) delete x[p.id]; return x; });
  const pay = () => {
    const id = uid();
    setOrders((p) => [{ id, lines: lines.map(({ name, qty, price }) => ({ name, qty, price })), total, ...f, status: "Шинэ" }, ...p]);
    setProducts((ps) => ps.map((p) => (cart[p.id] ? { ...p, stock: p.stock - cart[p.id] } : p)));
    setCart({}); setLast(id); setView("done");
  };
  const inp = "w-full border-2 border-[#1a2e05] bg-white px-4 py-3 outline-none focus:bg-[#d9f99d]";
  return (
    <div className="min-h-screen bg-[#fefce8] text-[#1a2e05]" style={{ fontFamily: "system-ui, sans-serif" }}>
      <div className="bg-[#1a2e05] py-1.5 text-center text-xs font-bold uppercase tracking-widest text-[#d9f99d]">100,000₮-с дээш захиалгад үнэгүй хүргэлт</div>
      <nav className="sticky top-9 z-40 flex items-center justify-between border-b-4 border-[#1a2e05] bg-[#d9f99d] px-5 py-3">
        <a href="#top" className="text-3xl font-black tracking-tighter">МИНИ<span className="bg-[#1a2e05] px-1 text-[#d9f99d]">ШОП</span></a>
        <div className="flex items-center gap-3">
          <Link href="/demo/shop/admin" className="border-2 border-[#1a2e05] px-3 py-1.5 text-sm font-black hover:bg-[#1a2e05] hover:text-[#d9f99d]">ADMIN</Link>
          <button onClick={() => setView("cart")} className="relative border-2 border-[#1a2e05] bg-white p-2" aria-label="Сагс"><ShoppingCart size={20} />{count > 0 && <b className="absolute -right-2 -top-2 grid h-5 w-5 place-items-center bg-[#1a2e05] text-xs text-white">{count}</b>}</button>
        </div>
      </nav>
      <header id="top" className="border-b-4 border-[#1a2e05] bg-[#fef08a] px-6 py-14">
        <h1 className="max-w-3xl text-5xl font-black leading-none tracking-tighter sm:text-7xl">ШИНЭ УЛИРАЛ.<br />ШИНЭ СТИЛЬ.</h1>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-10">
        <div className="mb-6 flex flex-wrap gap-2">{CATS.map((c) => <button key={c} onClick={() => setCat(c)} className={`border-2 border-[#1a2e05] px-4 py-1.5 text-sm font-bold ${cat === c ? "bg-[#1a2e05] text-[#d9f99d]" : "bg-white"}`}>{c}</button>)}</div>
        <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
          {products.filter((p) => cat === "Бүгд" || p.cat === cat).map((p) => (
            <div key={p.id} className="border-2 border-[#1a2e05] bg-white shadow-[5px_5px_0_#1a2e05]">
              <div className="grid h-36 place-items-center text-6xl" style={{ background: p.color }}>{p.emoji}</div>
              <div className="p-3"><div className="font-bold">{p.name}</div><div className="text-xs opacity-60">{p.stock > 0 ? `${p.stock} ширхэг` : "Дууссан"}</div>
                <div className="mt-2 flex items-center justify-between"><b>{money(p.price)}</b><button disabled={p.stock === 0 || (cart[p.id] || 0) >= p.stock} onClick={() => add(p, 1)} className="bg-[#1a2e05] px-3 py-1 text-sm font-bold text-[#d9f99d] disabled:opacity-30">+ Сагс</button></div></div>
            </div>))}
        </div>
      </main>
      {view && (
        <div className="fixed inset-0 z-[95] flex justify-end bg-black/50" onClick={() => setView(null)}>
          <aside onClick={(e) => e.stopPropagation()} className="h-full w-full max-w-md overflow-y-auto border-l-4 border-[#1a2e05] bg-[#fefce8] p-6">
            <div className="mb-4 flex items-center justify-between"><h2 className="text-2xl font-black">{view === "cart" ? "САГС" : view === "checkout" ? "ТӨЛБӨР" : "БАЯРЛАЛАА"}</h2><button onClick={() => setView(null)}><X /></button></div>
            {view === "done" ? <div className="text-center"><CheckCircle2 size={60} className="mx-auto" /><p className="mt-3 text-xl font-bold">Захиалга #{last} амжилттай!</p><button onClick={() => setView(null)} className="mt-5 bg-[#1a2e05] px-6 py-2 font-bold text-[#d9f99d]">Үргэлжлүүлэх</button></div>
            : count === 0 ? <p>Сагс хоосон.</p>
            : (<>
              {lines.map((l) => { const p = products.find((x) => x.id === l.id)!; return (
                <div key={l.id} className="mb-2 flex items-center gap-3 border-2 border-[#1a2e05] bg-white p-2 text-sm"><span className="flex-1 font-bold">{l.name}<br /><span className="font-normal">{money(l.price)}</span></span>
                  {view === "cart" ? <><button onClick={() => add(p, -1)}><Minus size={14} /></button><b>{l.qty}</b><button onClick={() => add(p, 1)}><Plus size={14} /></button></> : <b>×{l.qty}</b>}</div>); })}
              <div className="my-4 flex justify-between text-xl font-black"><span>НИЙТ</span><span>{money(total)}</span></div>
              {view === "cart" ? <button onClick={() => setView("checkout")} className="w-full bg-[#1a2e05] py-3 font-bold text-[#d9f99d]">Төлбөр төлөх →</button> : (
                <div className="space-y-2">
                  <input className={inp} placeholder="Нэр" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
                  <input className={inp} placeholder="Имэйл" type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
                  <input className={inp} placeholder="Хүргэлтийн хаяг" value={f.addr} onChange={(e) => setF({ ...f, addr: e.target.value })} />
                  <div className="flex gap-2">{["Карт", "QPay", "Бэлнээр"].map((m) => <button key={m} onClick={() => setF({ ...f, pay: m })} className={`flex-1 border-2 border-[#1a2e05] py-2 font-bold ${f.pay === m ? "bg-[#d9f99d]" : "bg-white"}`}>{m}</button>)}</div>
                  <button disabled={!f.name || !f.email.includes("@") || f.addr.length < 5} onClick={pay} className="w-full bg-[#1a2e05] py-3 font-bold text-[#d9f99d] disabled:opacity-30">Захиалга баталгаажуулах</button>
                </div>)}
            </>)}
          </aside>
        </div>
      )}
    </div>
  );
}

export function ShopAdmin() {
  const [products, setProducts] = useLocal<Product[]>("shop:products", PRODUCTS);
  const [orders, setOrders] = useLocal<Order[]>("shop:orders", []);
  const [toast, say] = useToast();
  const st = ["Шинэ", "Илгээсэн", "Хүргэгдсэн"] as const;
  return (
    <div className="min-h-screen bg-[#fefce8] text-[#1a2e05]" style={{ fontFamily: "system-ui, sans-serif" }}>
      <nav className="flex items-center justify-between border-b-4 border-[#1a2e05] bg-[#d9f99d] px-5 py-3"><b className="text-xl font-black">МИНИШОП · ADMIN</b><Link href="/demo/shop" className="border-2 border-[#1a2e05] px-3 py-1.5 text-sm font-black">← САЙТ</Link></nav>
      <div className="mx-auto max-w-5xl space-y-8 p-6">
        <div className="grid gap-3 sm:grid-cols-3">
          <Stat cls="border-2 border-[#1a2e05] bg-white" label="Захиалга" value={orders.length} />
          <Stat cls="border-2 border-[#1a2e05] bg-white" label="Борлуулалт" value={money(orders.reduce((a, o) => a + o.total, 0))} />
          <Stat cls="border-2 border-[#1a2e05] bg-white" label="Дуусаж буй бараа" value={products.filter((p) => p.stock < 5).length} />
        </div>
        <section><h2 className="mb-3 text-xl font-black">ЗАХИАЛГА</h2>
          {orders.length === 0 && <p className="opacity-60">Захиалга алга. Сайтаас худалдан авалт хийж үзээрэй.</p>}
          {orders.map((o) => (
            <div key={o.id} className="mb-2 flex flex-wrap items-center gap-3 border-2 border-[#1a2e05] bg-white p-3 text-sm">
              <b>#{o.id}</b><span>{o.name} · {o.email}</span><span className="opacity-60">{o.lines.map((l) => `${l.qty}×${l.name}`).join(", ")} · {o.pay}</span>
              <b className="ml-auto">{money(o.total)}</b>
              <select value={o.status} onChange={(e) => { setOrders((p) => p.map((x) => (x.id === o.id ? { ...x, status: e.target.value as Order["status"] } : x))); say("Төлөв шинэчлэгдлээ"); }} className="border-2 border-[#1a2e05] px-2 py-1">{st.map((s) => <option key={s}>{s}</option>)}</select>
            </div>))}
        </section>
        <section><h2 className="mb-3 text-xl font-black">БАРАА</h2>
          {products.map((p) => (
            <div key={p.id} className="mb-2 flex items-center gap-3 border-2 border-[#1a2e05] bg-white p-2 text-sm">
              <span className="text-2xl">{p.emoji}</span><span className="flex-1 font-bold">{p.name}</span>
              <label className="text-xs">Үнэ <input type="number" value={p.price} onChange={(e) => setProducts((ps) => ps.map((x) => (x.id === p.id ? { ...x, price: +e.target.value } : x)))} className="ml-1 w-24 border px-2 py-1" /></label>
              <label className="text-xs">Үлдэгдэл <input type="number" value={p.stock} onChange={(e) => setProducts((ps) => ps.map((x) => (x.id === p.id ? { ...x, stock: +e.target.value } : x)))} className="ml-1 w-16 border px-2 py-1" /></label>
            </div>))}
        </section>
      </div>
      <Toast msg={toast} />
    </div>
  );
}
