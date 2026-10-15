"use client";
import { useState } from "react";
import Link from "next/link";
import { Scissors, Check, Trash2, Star, MapPin, Phone, Clock, LayoutDashboard, CalendarCheck, Users, Plus, Wallet, TrendingUp } from "lucide-react";
import { money, uid, useLocal, useToast, Toast, img, AdminShell, Card, Kpi, BarChart, Chip, Table, inp, btnAcc, btnGhost, Select } from "./kit";

type Svc = { id: string; name: string; price: number; min: number; pic: string; desc: string };
type Status = "Хүлээгдэж буй" | "Баталсан" | "Дууссан" | "Цуцалсан";
const STATUSES: readonly Status[] = ["Хүлээгдэж буй", "Баталсан", "Дууссан", "Цуцалсан"];
type Booking = { id: string; svc: string; barber: string; date: string; time: string; name: string; phone: string; status: Status; price: number };
const SVCS: Svc[] = [
  { id: "s1", name: "Классик үс засалт", price: 25000, min: 45, pic: "1503951914875-452162b0f3f1", desc: "Хайч, машин, угаалга, стайлинг." },
  { id: "s2", name: "Сахал хэлбэржүүлэлт", price: 15000, min: 30, pic: "1621605815971-fbc98d665033", desc: "Хурц шугам, дулаан тос, сэргээгч." },
  { id: "s3", name: "Үс + сахал багц", price: 35000, min: 60, pic: "1585747860715-2ba37e788b70", desc: "Бүрэн үйлчилгээ — хамгийн их сонгогддог." },
  { id: "s4", name: "Халуун алчуураар хуссан", price: 30000, min: 40, pic: "1599351431202-1e0f0137899a", desc: "Сонгодог ир, халуун алчуур, арчилгаа." },
];
const BARBERS = [
  { n: "Бат", y: 8, pic: "1560250097-0b93528c311a", r: "4.9" },
  { n: "Ананд", y: 5, pic: "1507003211169-0a1dd7228f2d", r: "4.8" },
  { n: "Тэмүүжин", y: 3, pic: "1580489944761-15a19d654956", r: "4.7" },
];
const TIMES = ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];
const gold = "#d4a94f";
const dstr = (o: number) => { const d = new Date(); d.setDate(d.getDate() + o); return d.toISOString().slice(0, 10); };
const days = () => Array.from({ length: 7 }, (_, i) => dstr(i));
const NAMES = ["Ганбаатар", "Билгүүн", "Мөнх-Эрдэнэ", "Золбоо", "Төгөлдөр", "Эрдэнэбат", "Содном", "Наран", "Хүрэлбаатар", "Ариунбат", "Дөлгөөн", "Цогт"];
const SEED: Booking[] = Array.from({ length: 16 }, (_, i) => {
  const s = SVCS[i % 4], off = i < 8 ? -(i % 7) - 1 : i % 4;
  return { id: `B${100 + i}`, svc: s.name, barber: BARBERS[i % 3].n, date: dstr(off), time: TIMES[(i * 2) % 9], name: NAMES[i % 12], phone: `99${String(100000 + i * 7919).slice(0, 6)}`, price: s.price, status: off < 0 ? (i % 6 === 0 ? "Цуцалсан" : "Дууссан") : i % 3 === 0 ? "Хүлээгдэж буй" : "Баталсан" };
});
const REVIEWS = [
  { n: "Б. Ганзориг", t: "Хамгийн цэвэр шугам. Бат мастер үнэхээр мундаг — 3 жил дараалан ирж байна." },
  { n: "Э. Төмөр", t: "Онлайнаар цаг авахад 30 секунд. Хүлээлгэгүй, яг цагтаа эхэлсэн." },
  { n: "Д. Ариун", t: "Халуун алчуураар хусуулах нь бүр өөр мэдрэмж. Орчин нь гоё." },
];

export function BarberSite() {
  const [svcs] = useLocal<Svc[]>("barber2:svcs", SVCS);
  const [bookings, setBookings] = useLocal<Booking[]>("barber2:bookings", SEED);
  const [f, setF] = useState({ svc: "", barber: BARBERS[0].n, date: days()[0], time: "", name: "", phone: "" });
  const [done, setDone] = useState<Booking | null>(null);
  const taken = (t: string) => bookings.some((b) => b.barber === f.barber && b.date === f.date && b.time === t && b.status !== "Цуцалсан");
  const ok = f.svc && f.time && f.name && f.phone.length >= 6;
  const submit = () => {
    const s = svcs.find((x) => x.id === f.svc)!;
    const b: Booking = { id: `B${uid()}`, svc: s.name, price: s.price, barber: f.barber, date: f.date, time: f.time, name: f.name, phone: f.phone, status: "Хүлээгдэж буй" };
    setBookings((p) => [b, ...p]); setDone(b);
  };
  const pill = (a: boolean) => `border px-4 py-2.5 text-sm transition ${a ? "border-[#d4a94f] bg-[#d4a94f] text-black" : "border-white/15 hover:border-[#d4a94f]/70"}`;
  return (
    <div className="bg-[#0e0b08] text-[#f4ecdc]" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
      <nav className="sticky top-9 z-40 flex items-center justify-between border-b border-white/10 bg-[#0e0b08]/80 px-5 py-4 backdrop-blur-xl sm:px-10">
        <a href="#top" className="flex items-center gap-2 text-lg tracking-[0.3em]" style={{ color: gold }}><Scissors size={19} /> BARBER&CO</a>
        <div className="flex items-center gap-7 text-xs uppercase tracking-[0.2em]">
          {[["#services", "Үйлчилгээ"], ["#team", "Мастер"], ["#reviews", "Сэтгэгдэл"]].map(([h, l]) => <a key={h} href={h} className="hidden hover:text-[#d4a94f] md:block">{l}</a>)}
          <a href="#book" className="px-4 py-2 font-bold text-black" style={{ background: gold }}>Цаг авах</a>
          <Link href="/demo/barber/admin" className="hidden border border-white/20 px-3 py-2 hover:border-[#d4a94f] sm:block">Admin</Link>
        </div>
      </nav>
      <header id="top" className="relative isolate grid min-h-[88vh] place-items-center overflow-hidden px-6 text-center">
        <img src={img("1503951914875-452162b0f3f1", 1800)} alt="" className="absolute inset-0 -z-20 h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(14,11,8,.3),#0e0b08_95%)]" />
        <div className="max-w-3xl">
          <p className="mb-5 text-xs uppercase tracking-[0.6em]" style={{ color: gold }}>Est. 2015 · Улаанбаатар</p>
          <h1 className="text-5xl italic leading-[1.05] sm:text-8xl">Хурц ир.<br />Цэвэр шугам.</h1>
          <p className="mx-auto mt-7 max-w-lg text-lg text-[#f4ecdc]/75">Эрчүүдийн сонгодог үсчин. Цагаа онлайнаар 30 секундэд захиалаад, хүлээлгүй ирээрэй.</p>
          <div className="mt-10 flex flex-wrap justify-center gap-4"><a href="#book" className="px-9 py-4 text-sm font-bold uppercase tracking-[0.2em] text-black transition hover:brightness-110" style={{ background: gold }}>Цаг захиалах</a><a href="#services" className="border border-white/30 px-9 py-4 text-sm uppercase tracking-[0.2em] hover:border-[#d4a94f]">Үнэ үзэх</a></div>
          <div className="mt-14 flex justify-center gap-10 text-sm text-white/70">{[["10+", "жил"], ["12k", "үйлчлүүлэгч"], ["4.9", "үнэлгээ"]].map(([a, b]) => <div key={b}><div className="text-3xl italic" style={{ color: gold }}>{a}</div>{b}</div>)}</div>
        </div>
      </header>
      <section id="services" className="mx-auto max-w-6xl px-6 py-28">
        <p className="mb-3 text-center text-xs uppercase tracking-[0.5em]" style={{ color: gold }}>Menu</p>
        <h2 className="mb-14 text-center text-4xl italic sm:text-5xl">Үйлчилгээ & үнэ</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {svcs.map((s) => (
            <article key={s.id} className="group relative flex h-64 overflow-hidden border border-white/10">
              <img src={img(s.pic, 800)} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-60 transition duration-700 group-hover:scale-105 group-hover:opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e0b08] via-[#0e0b08]/50 to-transparent" />
              <div className="relative mt-auto w-full p-6"><div className="flex items-baseline justify-between gap-3"><h3 className="text-2xl italic">{s.name}</h3><span className="text-xl" style={{ color: gold }}>{money(s.price)}</span></div><p className="mt-1 text-sm text-white/60">{s.desc} · {s.min} мин</p></div>
            </article>
          ))}
        </div>
      </section>
      <section id="team" className="bg-[#16110c] px-6 py-28">
        <h2 className="mb-14 text-center text-4xl italic sm:text-5xl">Манай мастерууд</h2>
        <div className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-3">
          {BARBERS.map((b) => (
            <div key={b.n} className="group text-center">
              <div className="relative mb-5 aspect-[4/5] overflow-hidden"><img src={img(b.pic, 600)} alt={b.n} loading="lazy" className="h-full w-full object-cover grayscale transition duration-700 group-hover:scale-105 group-hover:grayscale-0" /><div className="absolute inset-3 border border-[#d4a94f]/0 transition group-hover:border-[#d4a94f]/70" /></div>
              <div className="text-2xl italic">{b.n}</div><div className="mt-1 text-sm text-white/55">{b.y} жилийн туршлага · <Star size={12} className="inline -mt-0.5" style={{ color: gold }} fill={gold} /> {b.r}</div>
            </div>
          ))}
        </div>
      </section>
      <section id="reviews" className="mx-auto max-w-5xl px-6 py-28">
        <div className="grid gap-6 md:grid-cols-3">{REVIEWS.map((r) => <figure key={r.n} className="border border-white/10 p-7"><div className="mb-4 flex gap-1">{Array.from({ length: 5 }, (_, i) => <Star key={i} size={14} fill={gold} style={{ color: gold }} />)}</div><blockquote className="italic leading-relaxed text-white/80">“{r.t}”</blockquote><figcaption className="mt-5 text-xs uppercase tracking-widest" style={{ color: gold }}>{r.n}</figcaption></figure>)}</div>
      </section>
      <section id="book" className="relative px-6 py-28" style={{ background: "linear-gradient(#0e0b08,#1a130b)" }}>
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-12 text-center text-4xl italic sm:text-5xl">Цаг захиалах</h2>
          {done ? (
            <div className="border p-10 text-center" style={{ borderColor: gold }}>
              <Check className="mx-auto mb-4" style={{ color: gold }} size={44} />
              <p className="text-3xl italic">Захиалга бүртгэгдлээ!</p>
              <p className="mt-4 text-white/70">#{done.id} · {done.svc} · {done.barber}<br />{done.date} · {done.time} · {money(done.price)}</p>
              <p className="mt-2 text-xs text-white/40">Админ самбарын «Захиалга» хэсэгт шууд харагдана.</p>
              <button onClick={() => { setDone(null); setF({ ...f, svc: "", time: "" }); }} className="mt-6 underline">Дахин захиалах</button>
            </div>
          ) : (
            <div className="space-y-9">
              <div><p className="mb-3 text-xs uppercase tracking-[0.3em] text-white/50">1 · Үйлчилгээ</p><div className="grid gap-2 sm:grid-cols-2">{svcs.map((s) => <button key={s.id} onClick={() => setF({ ...f, svc: s.id })} className={`${pill(f.svc === s.id)} text-left`}>{s.name} <span className="float-right opacity-70">{money(s.price)}</span></button>)}</div></div>
              <div><p className="mb-3 text-xs uppercase tracking-[0.3em] text-white/50">2 · Мастер</p><div className="flex flex-wrap gap-2">{BARBERS.map((b) => <button key={b.n} onClick={() => setF({ ...f, barber: b.n, time: "" })} className={pill(f.barber === b.n)}>{b.n}</button>)}</div></div>
              <div><p className="mb-3 text-xs uppercase tracking-[0.3em] text-white/50">3 · Өдөр & цаг</p>
                <div className="mb-3 flex flex-wrap gap-2">{days().map((d) => <button key={d} onClick={() => setF({ ...f, date: d, time: "" })} className={pill(f.date === d)}>{d.slice(5)}</button>)}</div>
                <div className="flex flex-wrap gap-2">{TIMES.map((t) => <button key={t} disabled={taken(t)} onClick={() => setF({ ...f, time: t })} className={`${pill(f.time === t)} disabled:line-through disabled:opacity-25`}>{t}</button>)}</div></div>
              <div className="grid gap-3 sm:grid-cols-2">
                <input placeholder="Нэр" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} className="border border-white/15 bg-transparent px-4 py-3.5 outline-none focus:border-[#d4a94f]" />
                <input placeholder="Утас" inputMode="tel" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} className="border border-white/15 bg-transparent px-4 py-3.5 outline-none focus:border-[#d4a94f]" />
              </div>
              <button disabled={!ok} onClick={submit} className="w-full py-4 text-sm font-bold uppercase tracking-[0.25em] text-black transition hover:brightness-110 disabled:opacity-30" style={{ background: gold }}>Баталгаажуулах</button>
            </div>
          )}
        </div>
      </section>
      <footer className="border-t border-white/10 px-6 py-12 text-center text-sm text-white/55">
        <div className="mb-3 flex flex-wrap justify-center gap-x-8 gap-y-2"><span><MapPin size={14} className="mr-1 inline" />Сүхбаатар дүүрэг, 1-р хороо</span><span><Phone size={14} className="mr-1 inline" />+976 9911 0000</span><span><Clock size={14} className="mr-1 inline" />Өдөр бүр 10:00 – 20:00</span></div>© Barber & Co. · Демо
      </footer>
    </div>
  );
}

export function BarberAdmin() {
  const [svcs, setSvcs] = useLocal<Svc[]>("barber2:svcs", SVCS);
  const [bookings, setBookings] = useLocal<Booking[]>("barber2:bookings", SEED);
  const [toast, say] = useToast();
  const setStatus = (id: string, status: Status) => { setBookings((p) => p.map((b) => (b.id === id ? { ...b, status } : b))); say(`Төлөв: ${status}`); };
  const paid = (b: Booking) => b.status === "Дууссан" || b.status === "Баталсан";
  const income = bookings.filter(paid).reduce((a, b) => a + b.price, 0);
  const last7 = Array.from({ length: 7 }, (_, i) => dstr(i - 6));
  const chart = last7.map((d) => bookings.filter((b) => b.date === d && paid(b)).reduce((a, b) => a + b.price, 0));
  const upcoming = bookings.filter((b) => b.date >= dstr(0) && b.status !== "Цуцалсан").sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  const tone = (s: Status) => ({ "Хүлээгдэж буй": "amber", "Баталсан": "blue", "Дууссан": "green", "Цуцалсан": "red" })[s];
  const barberStats = BARBERS.map((b) => ({ ...b, n2: bookings.filter((x) => x.barber === b.n && paid(x)).length }));

  const dash = (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi icon={Wallet} label="Орлого" value={money(income)} delta="+12.4% өмнөх 7 хоногоос" />
        <Kpi icon={CalendarCheck} label="Нийт захиалга" value={bookings.length} delta="+8 энэ 7 хоногт" />
        <Kpi icon={Clock} label="Хүлээгдэж буй" value={bookings.filter((b) => b.status === "Хүлээгдэж буй").length} />
        <Kpi icon={TrendingUp} label="Дундаж чек" value={money(Math.round(income / Math.max(1, bookings.filter(paid).length)))} />
      </div>
      <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
        <Card title="7 хоногийн орлого"><BarChart data={chart} labels={last7.map((d) => d.slice(8))} fmt={money} /></Card>
        <Card title="Мастеруудын ачаалал"><div className="space-y-4">{barberStats.map((b) => <div key={b.n} className="flex items-center gap-3"><img src={img(b.pic, 100)} alt="" className="h-10 w-10 rounded-full object-cover" /><div className="flex-1"><div className="flex justify-between text-sm font-semibold"><span>{b.n}</span><span>{b.n2}</span></div><div className="mt-1 h-2 rounded-full bg-[var(--soft)]"><div className="h-2 rounded-full bg-[var(--acc)]" style={{ width: `${Math.min(100, b.n2 * 14)}%` }} /></div></div></div>)}</div></Card>
      </div>
      <Card title="Дараагийн захиалгууд"><Table head={["Огноо", "Үйлчлүүлэгч", "Үйлчилгээ", "Мастер", "Төлөв"]} rows={upcoming.slice(0, 6).map((b) => [`${b.date.slice(5)} ${b.time}`, b.name, b.svc, b.barber, <Chip key="s" tone={tone(b.status)}>{b.status}</Chip>])} /></Card>
    </div>
  );
  const list = (
    <Card><Table head={["ID", "Үйлчлүүлэгч", "Үйлчилгээ", "Мастер", "Цаг", "Үнэ", "Төлөв", ""]} empty="Захиалга алга"
      rows={[...bookings].sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time)).map((b) => [<b key="i">{b.id}</b>, <div key="n"><div className="font-semibold">{b.name}</div><div className="text-xs text-[var(--mut)]">{b.phone}</div></div>, b.svc, b.barber, `${b.date.slice(5)} ${b.time}`, money(b.price), <Select key="s" value={b.status} options={STATUSES} onChange={(v) => setStatus(b.id, v)} />, <button key="d" aria-label="Устгах" className="text-[var(--mut)] hover:text-red-500" onClick={() => setBookings((p) => p.filter((x) => x.id !== b.id))}><Trash2 size={15} /></button>])} /></Card>
  );
  const svcTab = (
    <div className="space-y-3">
      {svcs.map((s) => (
        <Card key={s.id}><div className="flex flex-wrap items-center gap-3">
          <img src={img(s.pic, 120)} alt="" className="h-14 w-14 rounded-lg object-cover" />
          <input value={s.name} onChange={(e) => setSvcs((p) => p.map((x) => (x.id === s.id ? { ...x, name: e.target.value } : x)))} className={`${inp} min-w-[180px] flex-1`} />
          <input type="number" value={s.price} onChange={(e) => setSvcs((p) => p.map((x) => (x.id === s.id ? { ...x, price: +e.target.value } : x)))} className={`${inp} !w-32`} />
          <button className={btnGhost} onClick={() => { setSvcs((p) => p.filter((x) => x.id !== s.id)); say("Устгалаа"); }}><Trash2 size={14} /></button>
        </div></Card>
      ))}
      <button className={btnAcc} onClick={() => { setSvcs((p) => [...p, { id: uid(), name: "Шинэ үйлчилгээ", price: 20000, min: 30, pic: "1503951914875-452162b0f3f1", desc: "" }]); say("Нэмэгдлээ"); }}><Plus size={14} /> Үйлчилгээ нэмэх</button>
    </div>
  );
  return (<><AdminShell brand="Barber & Co." sub="Админ самбар" acc={gold} back="/demo/barber" font="Georgia, serif" tabs={[
    { key: "d", label: "Хянах самбар", icon: LayoutDashboard, node: dash },
    { key: "b", label: "Захиалга", icon: CalendarCheck, node: list },
    { key: "s", label: "Үнийн жагсаалт", icon: Users, node: svcTab },
  ]} /><Toast msg={toast} /></>);
}
