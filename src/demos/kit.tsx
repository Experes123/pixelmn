"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, type LucideIcon } from "lucide-react";

export const money = (n: number) => `${n.toLocaleString("en-US")}₮`;
export const uid = () => Math.random().toString(36).slice(2, 8).toUpperCase();

/** localStorage-backed state shared between a demo's site and its test admin. */
export function useLocal<T>(key: string, init: T): [T, (v: T | ((p: T) => T)) => void, boolean] {
  const k = `pixelmn:${key}`;
  const [v, setV] = useState<T>(init);
  const [ready, setReady] = useState(false);
  const first = useRef(true);
  useEffect(() => {
    try { const s = localStorage.getItem(k); if (s) setV(JSON.parse(s)); } catch {}
    setReady(true);
  }, [k]);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (ready) try { localStorage.setItem(k, JSON.stringify(v)); } catch {}
  }, [v, ready, k]);
  return [v, setV, ready];
}

export function DemoBar({ name, admin }: { name: string; admin?: boolean }) {
  return (
    <div className="fixed inset-x-0 top-0 z-[100] flex h-9 items-center justify-between bg-black/90 px-3 text-xs text-white backdrop-blur" style={{ fontFamily: "system-ui, sans-serif" }}>
      <Link href="/#work" className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 font-semibold hover:bg-white/20"><ArrowLeft size={13} /> pixelmn</Link>
      <span className="truncate text-white/60">{name} · {admin ? "тест админ" : "демо"} · жишээ өгөгдөл</span>
    </div>
  );
}

export function Stat({ label, value, cls = "" }: { label: string; value: ReactNode; cls?: string }) {
  return <div className={`rounded-xl p-4 ${cls}`}><div className="text-xs opacity-60">{label}</div><div className="mt-1 text-2xl font-bold">{value}</div></div>;
}

export function Toast({ msg }: { msg: string }) {
  return msg ? <div className="fixed bottom-5 left-1/2 z-[90] -translate-x-1/2 rounded-full bg-black px-5 py-2.5 text-sm text-white shadow-xl">{msg}</div> : null;
}
export function useToast(): [string, (m: string) => void] {
  const [m, setM] = useState("");
  return [m, (x) => { setM(x); setTimeout(() => setM(""), 2200); }];
}

export const img = (id: string, w = 900) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`;
export const ago = (d: number, h = 10) => { const x = new Date(); x.setDate(x.getDate() - d); x.setHours(h, 0, 0, 0); return x.toISOString(); };
export const fmtDate = (iso: string) => { const d = new Date(iso); return `${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`; };

/* ---------- Admin kit: themed through CSS variables ---------- */
export type Tab = { key: string; label: string; icon: LucideIcon; node: ReactNode };
export function AdminShell({ brand, sub, acc, dark = true, tabs, back, font }: { brand: string; sub: string; acc: string; dark?: boolean; tabs: Tab[]; back: string; font?: string }) {
  const [t, setT] = useState(tabs[0].key);
  const cur = tabs.find((x) => x.key === t) ?? tabs[0];
  const vars = (dark
    ? { "--bg": "#0d0f14", "--card": "#161a22", "--fg": "#eef0f4", "--mut": "#8b93a3", "--line": "rgba(255,255,255,.08)", "--soft": "rgba(255,255,255,.05)" }
    : { "--bg": "#f4f5f7", "--card": "#ffffff", "--fg": "#12141a", "--mut": "#6b7280", "--line": "rgba(0,0,0,.08)", "--soft": "rgba(0,0,0,.04)" }) as React.CSSProperties;
  return (
    <div style={{ ...vars, "--acc": acc, fontFamily: font ?? "system-ui, sans-serif" } as React.CSSProperties} className="min-h-[calc(100vh-2.25rem)] bg-[var(--bg)] text-[var(--fg)] lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="border-b border-[var(--line)] bg-[var(--card)] lg:sticky lg:top-9 lg:h-[calc(100vh-2.25rem)] lg:border-b-0 lg:border-r">
        <div className="flex items-center gap-3 p-5">
          <span className="grid h-10 w-10 place-items-center rounded-xl text-sm font-black text-black" style={{ background: acc }}>{brand[0]}</span>
          <div className="min-w-0"><div className="truncate font-bold leading-tight">{brand}</div><div className="truncate text-xs text-[var(--mut)]">{sub}</div></div>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:pb-0">
          {tabs.map((x) => (
            <button key={x.key} onClick={() => setT(x.key)} className={`flex shrink-0 items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${x.key === cur.key ? "bg-[var(--acc)] text-black" : "text-[var(--mut)] hover:bg-[var(--soft)] hover:text-[var(--fg)]"}`}>
              <x.icon size={17} /> {x.label}
            </button>
          ))}
        </nav>
        <Link href={back} className="m-3 hidden items-center gap-2 rounded-xl border border-[var(--line)] px-3.5 py-2.5 text-sm font-semibold text-[var(--mut)] hover:text-[var(--fg)] lg:flex"><ArrowLeft size={15} /> Сайт үзэх</Link>
      </aside>
      <main className="min-w-0 p-4 sm:p-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3"><h1 className="text-2xl font-black tracking-tight sm:text-3xl">{cur.label}</h1><Link href={back} className="text-sm font-semibold text-[var(--acc)] lg:hidden">← Сайт үзэх</Link></div>
        {cur.node}
      </main>
    </div>
  );
}
export function Card({ title, right, children, cls = "" }: { title?: string; right?: ReactNode; children: ReactNode; cls?: string }) {
  return (
    <section className={`rounded-2xl border border-[var(--line)] bg-[var(--card)] p-5 ${cls}`}>
      {(title || right) && <div className="mb-4 flex items-center justify-between gap-3"><h2 className="font-bold">{title}</h2>{right}</div>}
      {children}
    </section>
  );
}
export function Kpi({ label, value, delta, icon: I }: { label: string; value: ReactNode; delta?: string; icon: LucideIcon }) {
  return (
    <div className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-5">
      <div className="flex items-center justify-between text-[var(--mut)]"><span className="text-sm">{label}</span><span className="grid h-9 w-9 place-items-center rounded-lg" style={{ background: "color-mix(in srgb, var(--acc) 18%, transparent)", color: "var(--acc)" }}><I size={17} /></span></div>
      <div className="mt-3 text-3xl font-black tracking-tight">{value}</div>
      {delta && <div className="mt-1 text-xs font-semibold text-emerald-500">{delta}</div>}
    </div>
  );
}
export function BarChart({ data, labels, fmt = (n: number) => String(n) }: { data: number[]; labels: string[]; fmt?: (n: number) => string }) {
  const max = Math.max(...data, 1);
  return (
    <div className="flex h-48 items-end gap-2 sm:gap-3">
      {data.map((v, i) => (
        <div key={i} className="group flex h-full flex-1 flex-col items-center justify-end gap-2">
          <span className="text-[10px] font-semibold opacity-0 transition group-hover:opacity-100">{fmt(v)}</span>
          <div className="w-full rounded-t-lg transition-all group-hover:brightness-125" style={{ height: `${Math.max(4, (v / max) * 100)}%`, background: i === data.length - 1 ? "var(--acc)" : "color-mix(in srgb, var(--acc) 38%, transparent)" }} />
          <span className="text-[10px] text-[var(--mut)]">{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}
export const TONES: Record<string, string> = { green: "#10b981", amber: "#f59e0b", red: "#ef4444", blue: "#3b82f6", gray: "#8b93a3", violet: "#8b5cf6" };
export function Chip({ tone = "gray", children }: { tone?: keyof typeof TONES | string; children: ReactNode }) {
  const c = TONES[tone] ?? tone;
  return <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold" style={{ background: `color-mix(in srgb, ${c} 18%, transparent)`, color: c }}><i className="h-1.5 w-1.5 rounded-full" style={{ background: c }} />{children}</span>;
}
export function Table({ head, rows, empty = "Мэдээлэл алга" }: { head: string[]; rows: ReactNode[][]; empty?: string }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead><tr className="border-b border-[var(--line)] text-xs uppercase tracking-wider text-[var(--mut)]">{head.map((h) => <th key={h} className="px-3 py-2.5 font-semibold">{h}</th>)}</tr></thead>
        <tbody>
          {rows.map((r, i) => <tr key={i} className="border-b border-[var(--line)] last:border-0 hover:bg-[var(--soft)]">{r.map((c, j) => <td key={j} className="px-3 py-3 align-middle">{c}</td>)}</tr>)}
          {rows.length === 0 && <tr><td colSpan={head.length} className="px-3 py-10 text-center text-[var(--mut)]">{empty}</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
export const inp = "w-full rounded-lg border border-[var(--line)] bg-[var(--soft)] px-3 py-2 text-sm outline-none focus:border-[var(--acc)]";
export const btn = "inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition hover:brightness-110 disabled:opacity-40";
export const btnAcc = `${btn} bg-[var(--acc)] text-black`;
export const btnGhost = `${btn} border border-[var(--line)] hover:bg-[var(--soft)]`;
export function Select<T extends string>({ value, options, onChange }: { value: T; options: readonly T[]; onChange: (v: T) => void }) {
  return <select value={value} onChange={(e) => onChange(e.target.value as T)} className={`${inp} !w-auto !py-1.5 font-semibold`}>{options.map((o) => <option key={o} value={o}>{o}</option>)}</select>;
}
