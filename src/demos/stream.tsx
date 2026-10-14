"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Play, Pause, Heart, X, Eye, Trash2 } from "lucide-react";
import { uid, useLocal, useToast, Toast, Stat } from "./kit";

type Vid = { id: string; zh: string; mn: string; cat: string; views: number; likes: number; hue: number; emoji: string; on: boolean };
const VIDS: Vid[] = [
  { id: "v1", zh: "一分钟学做红烧肉", mn: "1 минутанд улаан махтай бантан хийх", cat: "Хоол", views: 128400, likes: 9200, hue: 8, emoji: "🍖", on: true },
  { id: "v2", zh: "上海夜景延时", mn: "Шанхайн шөнийн хот (таймлапс)", cat: "Аялал", views: 88100, likes: 6100, hue: 260, emoji: "🌃", on: true },
  { id: "v3", zh: "熊猫的一天", mn: "Пандын нэг өдөр", cat: "Амьтан", views: 342000, likes: 40100, hue: 140, emoji: "🐼", on: true },
  { id: "v4", zh: "功夫少年", mn: "Кунфү залуу", cat: "Тулаан", views: 56700, likes: 4300, hue: 30, emoji: "🥋", on: true },
  { id: "v5", zh: "街头小吃探店", mn: "Гудамжны хоолны аялал", cat: "Хоол", views: 73200, likes: 5000, hue: 350, emoji: "🥢", on: true },
  { id: "v6", zh: "西湖春色", mn: "Шиху нуурын хавар", cat: "Аялал", views: 41000, likes: 2900, hue: 180, emoji: "🌸", on: true },
  { id: "v7", zh: "古风舞蹈", mn: "Эртний хэв маягийн бүжиг", cat: "Бүжиг", views: 99800, likes: 8800, hue: 320, emoji: "💃", on: true },
  { id: "v8", zh: "三秒学汉字", mn: "Иероглиф сурах нь", cat: "Боловсрол", views: 25400, likes: 1800, hue: 50, emoji: "字", on: true },
];
const CATS = ["Бүгд", "Хоол", "Аялал", "Амьтан", "Тулаан", "Бүжиг", "Боловсрол"];
const grad = (h: number) => `linear-gradient(160deg, hsl(${h} 70% 35%), hsl(${(h + 40) % 360} 60% 12%))`;
const fmt = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}K` : `${n}`);

export function StreamSite() {
  const [vids, setVids] = useLocal<Vid[]>("stream:vids", VIDS);
  const [liked, setLiked] = useLocal<string[]>("stream:liked", []);
  const [cat, setCat] = useState("Бүгд");
  const [cur, setCur] = useState<Vid | null>(null);
  const [t, setT] = useState(0);
  const [play, setPlay] = useState(true);
  useEffect(() => { if (!cur || !play) return; const i = setInterval(() => setT((x) => (x >= 60 ? 60 : x + 1)), 1000); return () => clearInterval(i); }, [cur, play]);
  const open = (v: Vid) => { setCur(v); setT(0); setPlay(true); setVids((p) => p.map((x) => (x.id === v.id ? { ...x, views: x.views + 1 } : x))); };
  const like = (v: Vid) => { const on = liked.includes(v.id); setLiked(on ? liked.filter((x) => x !== v.id) : [...liked, v.id]); setVids((p) => p.map((x) => (x.id === v.id ? { ...x, likes: x.likes + (on ? -1 : 1) } : x))); };
  const list = vids.filter((v) => v.on && (cat === "Бүгд" || v.cat === cat));
  return (
    <div className="min-h-screen bg-[#140404] text-[#fde9c8]" style={{ fontFamily: "serif" }}>
      <nav className="sticky top-9 z-40 flex items-center justify-between border-b border-[#fcd34d]/30 bg-[#140404]/95 px-5 py-3 backdrop-blur">
        <a href="#top" className="flex items-center gap-2 text-2xl font-black"><span className="grid h-9 w-9 place-items-center rounded bg-[#b91c1c] text-[#fcd34d]">分</span><span>一分钟<span className="text-[#fcd34d]">TV</span></span></a>
        <div className="flex items-center gap-4 text-sm"><a href="#feed" className="hidden sm:block">Бүх видео</a>
          <Link href="/demo/stream/admin" className="rounded border border-[#fcd34d] px-3 py-1 font-bold text-[#fcd34d] hover:bg-[#fcd34d] hover:text-black">Admin</Link></div>
      </nav>
      <header id="top" className="relative overflow-hidden px-6 py-16 text-center" style={{ background: "radial-gradient(circle at 50% 0%, #b91c1c 0%, #140404 70%)" }}>
        <p className="text-sm tracking-[0.4em] text-[#fcd34d]">每日更新 · ӨДӨР БҮР ШИНЭЧЛЭГДЭНЭ</p>
        <h1 className="mt-3 text-5xl font-black sm:text-7xl">一分钟看<span className="text-[#fcd34d]">中国</span></h1>
        <p className="mt-3 opacity-70">Хятадын шилдэг 1 минутын видеонууд — монгол орчуулгатай</p>
      </header>
      <main id="feed" className="mx-auto max-w-6xl px-5 py-10">
        <div className="mb-6 flex flex-wrap gap-2">{CATS.map((c) => <button key={c} onClick={() => setCat(c)} className={`rounded-full px-4 py-1.5 text-sm ${cat === c ? "bg-[#fcd34d] font-bold text-black" : "border border-[#fcd34d]/40"}`}>{c}</button>)}</div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {list.map((v) => (
            <button key={v.id} onClick={() => open(v)} className="group text-left">
              <div className="relative grid aspect-[9/14] place-items-center overflow-hidden rounded-xl text-7xl transition group-hover:scale-[1.03]" style={{ background: grad(v.hue) }}>
                {v.emoji}<span className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 text-xs">1:00</span>
                <Play className="absolute opacity-0 transition group-hover:opacity-100" size={40} fill="white" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 p-3 pt-10 text-sm font-bold">{v.zh}</div>
              </div>
              <div className="mt-2 text-sm font-semibold leading-tight">{v.mn}</div>
              <div className="mt-1 flex gap-3 text-xs opacity-60"><span className="inline-flex items-center gap-1"><Eye size={12} />{fmt(v.views)}</span><span className="inline-flex items-center gap-1"><Heart size={12} />{fmt(v.likes)}</span></div>
            </button>))}
        </div>
      </main>
      {cur && (
        <div className="fixed inset-0 z-[95] grid place-items-center bg-black/85 p-4" onClick={() => setCur(null)}>
          <div onClick={(e) => e.stopPropagation()} className="relative aspect-[9/16] max-h-[88vh] w-full max-w-sm overflow-hidden rounded-2xl" style={{ background: grad(cur.hue) }}>
            <button onClick={() => setCur(null)} className="absolute right-3 top-3 z-10 rounded-full bg-black/50 p-2"><X size={18} /></button>
            <div className="grid h-full place-items-center text-[9rem]" style={{ transform: `scale(${1 + (t % 10) / 60})`, transition: "transform 1s linear" }}>{cur.emoji}</div>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-5 pt-24">
              <div className="text-2xl font-black">{cur.zh}</div><div className="text-sm opacity-80">{cur.mn}</div>
              <div className="mt-4 h-1 overflow-hidden rounded bg-white/25"><div className="h-full bg-[#fcd34d]" style={{ width: `${(t / 60) * 100}%`, transition: "width 1s linear" }} /></div>
              <div className="mt-2 flex items-center justify-between text-xs"><span>0:{String(t).padStart(2, "0")} / 1:00</span>
                <span className="flex items-center gap-3"><button onClick={() => (t >= 60 ? (setT(0), setPlay(true)) : setPlay(!play))}>{play && t < 60 ? <Pause size={20} /> : <Play size={20} />}</button>
                  <button onClick={() => like(cur)} aria-label="Таалагдсан"><Heart size={20} fill={liked.includes(cur.id) ? "#ef4444" : "none"} color={liked.includes(cur.id) ? "#ef4444" : "white"} /></button></span></div>
              <p className="mt-3 text-[10px] opacity-40">Демо тоглуулагч — бодит видео файл холбоогүй.</p>
            </div>
          </div>
        </div>)}
    </div>
  );
}

export function StreamAdmin() {
  const [vids, setVids] = useLocal<Vid[]>("stream:vids", VIDS);
  const [toast, say] = useToast();
  const [f, setF] = useState({ zh: "", mn: "", cat: "Хоол" });
  const add = () => { setVids((p) => [{ id: uid(), ...f, views: 0, likes: 0, hue: Math.floor(Math.random() * 360), emoji: "🎬", on: true }, ...p]); setF({ zh: "", mn: "", cat: "Хоол" }); say("Видео нэмэгдлээ"); };
  return (
    <div className="min-h-screen bg-[#1f0707] text-[#fde9c8]" style={{ fontFamily: "serif" }}>
      <nav className="flex items-center justify-between border-b border-[#fcd34d]/30 px-5 py-3"><b className="text-xl">一分钟TV · <span className="text-[#fcd34d]">Admin</span></b><Link href="/demo/stream" className="rounded border border-[#fcd34d] px-3 py-1 text-sm text-[#fcd34d]">← Сайт руу</Link></nav>
      <div className="mx-auto max-w-5xl space-y-8 p-6">
        <div className="grid gap-3 sm:grid-cols-3">
          <Stat cls="bg-black/30" label="Видео" value={vids.length} /><Stat cls="bg-black/30" label="Нийт үзэлт" value={fmt(vids.reduce((a, v) => a + v.views, 0))} /><Stat cls="bg-black/30" label="Нийт like" value={fmt(vids.reduce((a, v) => a + v.likes, 0))} />
        </div>
        <section className="rounded-xl bg-black/30 p-4"><h2 className="mb-3 font-bold text-[#fcd34d]">Шинэ видео</h2>
          <div className="grid gap-2 sm:grid-cols-[1fr_1fr_auto_auto]">
            <input placeholder="汉语标题" value={f.zh} onChange={(e) => setF({ ...f, zh: e.target.value })} className="rounded bg-white/10 px-3 py-2" />
            <input placeholder="Монгол гарчиг" value={f.mn} onChange={(e) => setF({ ...f, mn: e.target.value })} className="rounded bg-white/10 px-3 py-2" />
            <select value={f.cat} onChange={(e) => setF({ ...f, cat: e.target.value })} className="rounded bg-white/10 px-3 py-2">{CATS.slice(1).map((c) => <option key={c} className="text-black">{c}</option>)}</select>
            <button disabled={!f.zh || !f.mn} onClick={add} className="rounded bg-[#fcd34d] px-4 py-2 font-bold text-black disabled:opacity-40">Нэмэх</button></div></section>
        <section>{vids.map((v) => (
          <div key={v.id} className="mb-2 flex items-center gap-3 rounded-lg bg-black/30 p-3 text-sm">
            <span className="grid h-12 w-9 place-items-center rounded text-xl" style={{ background: grad(v.hue) }}>{v.emoji}</span>
            <span className="flex-1"><b>{v.zh}</b><br /><span className="opacity-70">{v.mn} · {v.cat}</span></span>
            <span className="hidden opacity-70 sm:block">👁 {fmt(v.views)} · ♥ {fmt(v.likes)}</span>
            <button onClick={() => setVids((p) => p.map((x) => (x.id === v.id ? { ...x, on: !x.on } : x)))} className={`rounded-full px-3 py-1 text-xs font-bold ${v.on ? "bg-green-600" : "bg-neutral-600"}`}>{v.on ? "Нийтлэгдсэн" : "Нуусан"}</button>
            <button aria-label="Устгах" onClick={() => setVids((p) => p.filter((x) => x.id !== v.id))}><Trash2 size={16} /></button>
          </div>))}</section>
      </div>
      <Toast msg={toast} />
    </div>
  );
}
