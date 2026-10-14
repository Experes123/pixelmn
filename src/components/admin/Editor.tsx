"use client";
import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ExternalLink, LogOut, Plus, RotateCcw, Save, Trash2 } from "lucide-react";
import type { Content } from "@/content/site";

type Json = string | number | boolean | null | Json[] | { [k: string]: Json };
type Path = (string | number)[];

const TABS: [keyof Content, string, string][] = [
  ["copy", "Page texts", "Headings, buttons, hero, form labels, footer and legal pages."],
  ["packages", "Pricing", "Edit the pricing plans: name, price, features. Add or remove plans."],
  ["services", "Services", "The service cards (also the options in the contact form)."],
  ["projects", "Projects", "Selected project cards."],
  ["faqs", "FAQ", "Questions and answers."],
  ["site", "Company & contact", "Name, email, phone, address, social links."],
  ["nav", "Navigation", "Header and footer menu."],
  ["ticker", "Ticker", "Words in the scrolling band."],
  ["manifesto", "Manifesto", "The paragraph that highlights as you scroll."],
  ["principles", "Principles", ""],
  ["benefits", "Benefits", "Results and benefits."],
  ["strengths", "Strengths", "Why choose us."],
  ["steps", "Process", "How we work steps."],
  ["budgets", "Budget options", "Options in the contact form."],
];
const READONLY = new Set(["key", "kind"]);

function label(k: string) {
  return k.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());
}
function blank(sample: Json): Json {
  if (typeof sample === "string") return "";
  if (typeof sample === "boolean") return false;
  if (typeof sample === "number") return 0;
  if (Array.isArray(sample)) return [];
  if (sample && typeof sample === "object") return Object.fromEntries(Object.entries(sample).map(([k, v]) => [k, READONLY.has(k) ? v : blank(v)]));
  return "";
}
function setAt(root: Json, path: Path, value: Json): Json {
  if (!path.length) return value;
  const [h, ...rest] = path;
  if (Array.isArray(root)) { const c = [...root]; c[h as number] = setAt(c[h as number], rest, value); return c; }
  const o = root as { [k: string]: Json };
  return { ...o, [h]: setAt(o[h as string], rest, value) };
}

export function Editor({ initial }: { initial: Content }) {
  const [data, setData] = useState<Json>(initial as unknown as Json);
  const [saved, setSaved] = useState(JSON.stringify(initial));
  const [tab, setTab] = useState<keyof Content>("packages");
  const [msg, setMsg] = useState<{ ok: boolean; t: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const dirty = useMemo(() => JSON.stringify(data) !== saved, [data, saved]);
  const root = data as { [k: string]: Json };

  const update = (p: Path, v: Json) => { setData((d) => setAt(d, p, v)); setMsg(null); };

  async function save() {
    setBusy(true); setMsg(null);
    const r = await fetch("/api/admin/content", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    const j = await r.json().catch(() => ({}));
    if (r.ok) { setData(j); setSaved(JSON.stringify(j)); setMsg({ ok: true, t: "Saved. The live site is updated." }); }
    else setMsg({ ok: false, t: j.error ?? "Save failed" });
    setBusy(false);
  }
  async function reset() {
    if (!confirm("Reset ALL content to the original defaults? This cannot be undone.")) return;
    await fetch("/api/admin/content", { method: "DELETE" });
    location.reload();
  }
  async function logout() { await fetch("/api/admin/logout", { method: "POST" }); location.reload(); }

  return (
    <div className="min-h-dvh bg-mist text-ink">
      <header className="sticky top-0 z-20 border-b border-line bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3"><span className="font-bold">Website admin</span>{dirty && <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-semibold text-accent">Unsaved changes</span>}</div>
          <div className="flex flex-wrap items-center gap-2">
            {msg && <span role="status" className={`text-sm ${msg.ok ? "text-green-700" : "text-red-600"}`}>{msg.t}</span>}
            <a href="/" target="_blank" className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm font-semibold hover:border-ink"><ExternalLink size={14} />View site</a>
            <button onClick={save} disabled={busy || !dirty} className="inline-flex items-center gap-1.5 rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white hover:bg-ink disabled:opacity-50"><Save size={14} />{busy ? "Saving…" : "Save changes"}</button>
            <button onClick={logout} title="Log out" aria-label="Log out" className="grid h-9 w-9 place-items-center rounded-full border border-line hover:border-ink"><LogOut size={14} /></button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[220px_1fr]">
        <nav aria-label="Sections" className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
          {TABS.map(([k, name]) => (
            <button key={k} onClick={() => setTab(k)} aria-current={tab === k} className={`shrink-0 rounded-xl px-4 py-2.5 text-left text-sm font-semibold transition-colors ${tab === k ? "bg-ink text-white" : "hover:bg-white"}`}>{name}</button>
          ))}
          <button onClick={reset} className="mt-4 hidden shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-left text-sm text-red-600 hover:bg-white lg:flex"><RotateCcw size={14} />Reset to defaults</button>
        </nav>
        <main>
          <h1 className="text-2xl font-bold">{TABS.find((t) => t[0] === tab)![1]}</h1>
          <p className="mb-5 text-sm text-neutral-500">{TABS.find((t) => t[0] === tab)![2]}</p>
          <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-7"><Node value={root[tab]} path={[tab]} update={update} top /></div>
        </main>
      </div>
    </div>
  );
}

function Node({ value, path, update, top, name }: { value: Json; path: Path; update: (p: Path, v: Json) => void; top?: boolean; name?: string }) {
  const id = path.join("-");
  if (typeof value === "string") {
    const long = value.length > 70 || value.includes("\n");
    const cls = "w-full rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus:border-ink";
    return (
      <div>
        {name && <label htmlFor={id} className="mb-1 block text-xs font-semibold text-neutral-500">{name}</label>}
        {READONLY.has(String(path[path.length - 1])) ? <p className="rounded-lg bg-mist px-3 py-2 text-sm text-neutral-500">{value}</p>
          : long ? <textarea id={id} rows={Math.min(10, Math.max(3, Math.ceil(value.length / 80)))} value={value} onChange={(e) => update(path, e.target.value)} className={cls} />
          : <input id={id} value={value} onChange={(e) => update(path, e.target.value)} className={cls} />}
      </div>
    );
  }
  if (typeof value === "number") return <div>{name && <label htmlFor={id} className="mb-1 block text-xs font-semibold text-neutral-500">{name}</label>}<input id={id} type="number" value={value} onChange={(e) => update(path, Number(e.target.value))} className="w-full rounded-lg border border-line px-3 py-2 text-sm" /></div>;
  if (typeof value === "boolean")
    return <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={value} onChange={(e) => update(path, e.target.checked)} className="h-4 w-4 accent-[#ff4a1c]" />{name}</label>;

  if (Array.isArray(value)) {
    const simple = value.every((v) => typeof v === "string");
    const move = (i: number, d: number) => { const a = [...value]; const j = i + d; if (j < 0 || j >= a.length) return; [a[i], a[j]] = [a[j], a[i]]; update(path, a); };
    return (
      <div>
        {name && <h3 className="mb-2 text-sm font-bold">{name} <span className="font-normal text-neutral-400">({value.length})</span></h3>}
        <ul className="space-y-3">
          {value.map((item, i) => (
            <li key={i} className={`flex items-start gap-2 ${simple ? "" : "rounded-xl border border-line bg-mist/50 p-4"}`}>
              <div className="min-w-0 flex-1">
                {!simple && <p className="mb-3 text-xs font-bold uppercase tracking-wider text-accent">#{i + 1}{typeof item === "object" && item && "name" in item ? ` · ${String((item as Record<string, Json>).name)}` : typeof item === "object" && item && "title" in item ? ` · ${String((item as Record<string, Json>).title)}` : ""}</p>}
                <Node value={item} path={[...path, i]} update={update} />
              </div>
              <div className="flex shrink-0 gap-1">
                <IconBtn t="Move up" onClick={() => move(i, -1)}><ArrowUp size={14} /></IconBtn>
                <IconBtn t="Move down" onClick={() => move(i, 1)}><ArrowDown size={14} /></IconBtn>
                <IconBtn t="Remove" danger onClick={() => { if (simple || confirm("Remove this item?")) update(path, value.filter((_, j) => j !== i)); }}><Trash2 size={14} /></IconBtn>
              </div>
            </li>
          ))}
        </ul>
        <button onClick={() => update(path, [...value, value.length ? blank(value[value.length - 1]) : ""])} className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-dashed border-neutral-400 px-4 py-2 text-sm font-semibold hover:border-accent hover:text-accent"><Plus size={14} />Add item</button>
      </div>
    );
  }
  if (value && typeof value === "object") {
    return (
      <div className={top ? "space-y-6" : "space-y-3"}>
        {Object.entries(value).map(([k, v]) => {
          const nested = typeof v === "object" && v !== null && !Array.isArray(v);
          return nested
            ? <fieldset key={k} className="rounded-xl border border-line p-4"><legend className="px-2 text-sm font-bold">{label(k)}</legend><Node value={v} path={[...path, k]} update={update} /></fieldset>
            : <Node key={k} value={v} path={[...path, k]} update={update} name={label(k)} />;
        })}
      </div>
    );
  }
  return null;
}

function IconBtn({ t, onClick, children, danger }: { t: string; onClick: () => void; children: React.ReactNode; danger?: boolean }) {
  return <button type="button" onClick={onClick} title={t} aria-label={t} className={`grid h-8 w-8 place-items-center rounded-lg border border-line bg-white ${danger ? "text-red-600 hover:border-red-600" : "hover:border-ink"}`}>{children}</button>;
}
