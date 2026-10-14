"use client";
import { useState } from "react";
import Link from "next/link";
import { Copy, Search, Terminal, Trash2 } from "lucide-react";
import { uid, useLocal, useToast, Toast, Stat } from "./kit";

type Snip = { id: string; title: string; lang: string; code: string; desc: string };
const SNIPS: Snip[] = [
  { id: "c1", title: "Debounce функц", lang: "JavaScript", desc: "Давтагдсан дуудлагыг хойшлуулна.", code: "const debounce = (fn, ms = 300) => {\n  let t;\n  return (...a) => {\n    clearTimeout(t);\n    t = setTimeout(() => fn(...a), ms);\n  };\n};" },
  { id: "c2", title: "Fetch JSON", lang: "TypeScript", desc: "Төрөлтэй API дуудлага.", code: "async function getJson<T>(url: string): Promise<T> {\n  const r = await fetch(url);\n  if (!r.ok) throw new Error(r.statusText);\n  return r.json() as Promise<T>;\n}" },
  { id: "c3", title: "Fibonacci", lang: "Python", desc: "Generator ашигласан.", code: "def fib():\n    a, b = 0, 1\n    while True:\n        yield a\n        a, b = b, a + b" },
  { id: "c4", title: "Flex төвлөрүүлэх", lang: "CSS", desc: "Элементийг голлуулах.", code: ".center {\n  display: flex;\n  place-content: center;\n  place-items: center;\n}" },
  { id: "c5", title: "Бүлэглэх (GROUP BY)", lang: "SQL", desc: "Сар бүрийн борлуулалт.", code: "SELECT date_trunc('month', created_at) AS month,\n       SUM(total) AS revenue\nFROM orders\nGROUP BY 1\nORDER BY 1;" },
  { id: "c6", title: "useLocalStorage", lang: "TypeScript", desc: "React hook.", code: "function useLocal<T>(k: string, init: T) {\n  const [v, setV] = useState<T>(() => JSON.parse(localStorage.getItem(k) ?? 'null') ?? init);\n  useEffect(() => localStorage.setItem(k, JSON.stringify(v)), [k, v]);\n  return [v, setV] as const;\n}" },
];
const G = "#4ade80";

export function CodeSite() {
  const [snips] = useLocal<Snip[]>("code:snips", SNIPS);
  const [q, setQ] = useState(""), [lang, setLang] = useState("Бүгд");
  const [toast, say] = useToast();
  const langs = ["Бүгд", ...Array.from(new Set(snips.map((s) => s.lang)))];
  const list = snips.filter((s) => (lang === "Бүгд" || s.lang === lang) && (s.title + s.desc + s.code).toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9]" style={{ fontFamily: "ui-monospace, monospace" }}>
      <nav className="sticky top-9 z-40 flex items-center justify-between border-b border-[#30363d] bg-[#161b22]/95 px-5 py-3 backdrop-blur">
        <a href="#top" className="flex items-center gap-2 font-bold" style={{ color: G }}><Terminal size={18} /> ~/code-example</a>
        <div className="flex items-center gap-4 text-sm"><a href="#lib" className="hover:text-white">snippets</a><a href="#about" className="hidden hover:text-white sm:block">about</a>
          <Link href="/demo/code/admin" className="rounded border border-[#4ade80] px-3 py-1 text-[#4ade80] hover:bg-[#4ade80] hover:text-black">admin</Link></div>
      </nav>
      <header id="top" className="px-6 py-20"><div className="mx-auto max-w-4xl">
        <p className="text-[#8b949e]">$ <span style={{ color: G }}>npm</span> install better-code</p>
        <h1 className="mt-4 text-4xl font-bold text-white sm:text-6xl">Хуулаад ашиглах<br /><span style={{ color: G }}>кодын жишээнүүд_</span></h1>
        <p className="mt-5 max-w-xl text-[#8b949e]">Хөгжүүлэгчдэд зориулсан цэвэр, туршсан кодын сан. Хайж, шүүж, нэг товшилтоор хуул.</p></div></header>
      <section id="lib" className="mx-auto max-w-5xl px-5 pb-20">
        <div className="mb-5 flex flex-wrap gap-3"><label className="flex flex-1 items-center gap-2 rounded border border-[#30363d] bg-[#161b22] px-3 py-2"><Search size={15} /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="хайх..." className="w-full bg-transparent outline-none" /></label>
          <div className="flex flex-wrap gap-2">{langs.map((l) => <button key={l} onClick={() => setLang(l)} className={`rounded px-3 py-2 text-xs ${lang === l ? "bg-[#4ade80] font-bold text-black" : "border border-[#30363d]"}`}>{l}</button>)}</div></div>
        <div className="grid gap-4 md:grid-cols-2">{list.map((s) => (
          <article key={s.id} className="overflow-hidden rounded-lg border border-[#30363d] bg-[#161b22]">
            <div className="flex items-center justify-between border-b border-[#30363d] px-4 py-2 text-sm"><span><b className="text-white">{s.title}</b> <span className="text-xs text-[#4ade80]">{s.lang}</span></span>
              <button onClick={() => { navigator.clipboard?.writeText(s.code); say("Хууллаа ✔"); }} className="flex items-center gap-1 text-xs hover:text-white"><Copy size={13} /> copy</button></div>
            <pre className="overflow-x-auto p-4 text-[13px] leading-relaxed text-[#79c0ff]"><code>{s.code}</code></pre>
            <p className="border-t border-[#30363d] px-4 py-2 text-xs text-[#8b949e]">// {s.desc}</p></article>))}
          {list.length === 0 && <p className="text-[#8b949e]">Илэрц олдсонгүй.</p>}</div>
      </section>
      <section id="about" className="border-t border-[#30363d] px-6 py-14 text-center text-sm text-[#8b949e]">Энэ бол pixelmn-ийн демо сайт. Admin хэсгээс кодын жишээ нэмж, устгах боломжтой.</section>
      <Toast msg={toast} />
    </div>
  );
}

export function CodeAdmin() {
  const [snips, setSnips] = useLocal<Snip[]>("code:snips", SNIPS);
  const [f, setF] = useState({ title: "", lang: "JavaScript", desc: "", code: "" });
  const [toast, say] = useToast();
  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9]" style={{ fontFamily: "ui-monospace, monospace" }}>
      <nav className="flex items-center justify-between border-b border-[#30363d] bg-[#161b22] px-5 py-3"><b style={{ color: G }}>~/code-example/admin</b><Link href="/demo/code" className="rounded border border-[#4ade80] px-3 py-1 text-sm text-[#4ade80]">← site</Link></nav>
      <div className="mx-auto max-w-4xl space-y-8 p-6">
        <div className="grid gap-3 sm:grid-cols-3"><Stat cls="border border-[#30363d]" label="Snippets" value={snips.length} /><Stat cls="border border-[#30363d]" label="Хэл" value={new Set(snips.map((s) => s.lang)).size} /><Stat cls="border border-[#30363d]" label="Мөр код" value={snips.reduce((a, s) => a + s.code.split("\n").length, 0)} /></div>
        <section className="space-y-2 rounded-lg border border-[#30363d] bg-[#161b22] p-4"><h2 className="font-bold text-white">+ шинэ snippet</h2>
          <div className="grid gap-2 sm:grid-cols-3"><input placeholder="Гарчиг" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} className="rounded border border-[#30363d] bg-[#0d1117] px-3 py-2" /><input placeholder="Хэл" value={f.lang} onChange={(e) => setF({ ...f, lang: e.target.value })} className="rounded border border-[#30363d] bg-[#0d1117] px-3 py-2" /><input placeholder="Тайлбар" value={f.desc} onChange={(e) => setF({ ...f, desc: e.target.value })} className="rounded border border-[#30363d] bg-[#0d1117] px-3 py-2" /></div>
          <textarea rows={5} placeholder="код..." value={f.code} onChange={(e) => setF({ ...f, code: e.target.value })} className="w-full rounded border border-[#30363d] bg-[#0d1117] px-3 py-2" />
          <button disabled={!f.title || !f.code} onClick={() => { setSnips((p) => [{ id: uid(), ...f }, ...p]); setF({ title: "", lang: "JavaScript", desc: "", code: "" }); say("Нэмэгдлээ ✔"); }} className="rounded bg-[#4ade80] px-4 py-2 font-bold text-black disabled:opacity-40">commit</button></section>
        <section>{snips.map((s) => <div key={s.id} className="mb-2 flex items-center gap-3 rounded border border-[#30363d] bg-[#161b22] p-3 text-sm"><b className="text-white">{s.title}</b><span className="text-[#4ade80]">{s.lang}</span><span className="flex-1 truncate text-[#8b949e]">{s.desc}</span><button aria-label="Устгах" onClick={() => setSnips((p) => p.filter((x) => x.id !== s.id))}><Trash2 size={15} /></button></div>)}</section>
      </div>
      <Toast msg={toast} />
    </div>
  );
}
