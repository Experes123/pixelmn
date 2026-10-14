"use client";
import { useEffect, useState, type ReactNode } from "react";
import { Eye, EyeOff, Lock, LogOut, ShieldCheck, Copy, Sparkles } from "lucide-react";

export const CREDS: Record<string, { user: string; pass: string }> = {
  code: { user: "admin@code.demo", pass: "Code#2026" },
  barber: { user: "owner@barber.demo", pass: "Barber#2026" },
  company: { user: "admin@northwind.demo", pass: "Northwind#2026" },
  restaurant: { user: "manager@shiree.demo", pass: "Shiree#2026" },
  shop: { user: "admin@minishop.demo", pass: "Shop#2026" },
  pccafe: { user: "root@neon.demo", pass: "Neon#2026" },
  stream: { user: "editor@1min.demo", pass: "Stream#2026" },
};

export function AdminGate({ slug, name, from, to, ink, children }: { slug: string; name: string; from: string; to: string; ink: string; children: ReactNode }) {
  const cred = CREDS[slug] ?? { user: "admin@demo", pass: "Demo#2026" };
  const key = `pixelmn:auth:${slug}`;
  const [state, setState] = useState<"load" | "out" | "in">("load");
  const [u, setU] = useState(""), [p, setP] = useState(""), [show, setShow] = useState(false), [err, setErr] = useState(""), [busy, setBusy] = useState(false);
  useEffect(() => { setState(sessionStorage.getItem(key) === "1" ? "in" : "out"); }, [key]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault(); setErr(""); setBusy(true);
    setTimeout(() => {
      if (u.trim().toLowerCase() === cred.user && p === cred.pass) { sessionStorage.setItem(key, "1"); setState("in"); }
      else setErr("Нэр эсвэл нууц үг буруу байна.");
      setBusy(false);
    }, 450);
  };
  const logout = () => { sessionStorage.removeItem(key); setP(""); setState("out"); };

  if (state === "load") return <div className="min-h-screen bg-[#0a0a0c]" />;
  if (state === "in") return (
    <>
      {children}
      <button onClick={logout} className="fixed bottom-4 right-4 z-[95] inline-flex items-center gap-2 rounded-full bg-black/85 px-4 py-2.5 text-xs font-semibold text-white shadow-xl backdrop-blur hover:bg-black" style={{ fontFamily: "system-ui, sans-serif" }}>
        <LogOut size={14} /> Гарах
      </button>
    </>
  );

  return (
    <div className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-[#08080b] px-4 py-16 text-white" style={{ fontFamily: "system-ui, sans-serif" }}>
      <div aria-hidden className="absolute -left-40 -top-40 -z-10 h-[520px] w-[520px] rounded-full opacity-50 blur-[120px]" style={{ background: to }} />
      <div aria-hidden className="absolute -bottom-48 -right-32 -z-10 h-[460px] w-[460px] rounded-full opacity-40 blur-[120px]" style={{ background: from === "#d9f99d" ? "#84cc16" : from }} />
      <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      <div className="w-full max-w-md">
        <div className="rounded-3xl border border-white/10 bg-white/[.05] p-7 shadow-2xl backdrop-blur-xl sm:p-9">
          <div className="mb-7 flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl" style={{ background: `linear-gradient(135deg, ${from}, ${to})`, color: ink }}><Lock size={20} /></span>
            <div><div className="text-lg font-bold leading-tight">{name}</div><div className="text-xs text-white/50">Админ самбар · нэвтрэх</div></div>
          </div>
          <form onSubmit={submit} className="space-y-4">
            <label className="block"><span className="mb-1.5 block text-xs font-semibold text-white/70">Хэрэглэгчийн нэр</span>
              <input value={u} onChange={(e) => setU(e.target.value)} autoComplete="username" autoFocus className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none transition focus:border-white/40" placeholder="name@demo" /></label>
            <label className="block"><span className="mb-1.5 block text-xs font-semibold text-white/70">Нууц үг</span>
              <div className="relative"><input value={p} onChange={(e) => setP(e.target.value)} type={show ? "text" : "password"} autoComplete="current-password" className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 pr-12 text-sm outline-none transition focus:border-white/40" placeholder="••••••••" />
                <button type="button" onClick={() => setShow(!show)} aria-label="Нууц үг харуулах" className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white">{show ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></label>
            {err && <p role="alert" className="rounded-lg bg-red-500/15 px-3 py-2 text-xs text-red-300">{err}</p>}
            <button disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition hover:brightness-110 disabled:opacity-60" style={{ background: `linear-gradient(135deg, ${from === "#d9f99d" ? "#a3e635" : to}, ${ink === "#ffffff" ? "#60a5fa" : ink})`, color: "#0b0b0c" }}>
              <ShieldCheck size={17} /> {busy ? "Шалгаж байна…" : "Нэвтрэх"}
            </button>
          </form>
          <div className="mt-6 rounded-2xl border border-dashed border-white/15 bg-black/30 p-4">
            <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-white/70"><Sparkles size={13} /> Туршилтын эрх</div>
            <div className="space-y-1 font-mono text-xs text-white/80"><div className="flex justify-between"><span className="text-white/40">нэр</span>{cred.user}</div><div className="flex justify-between"><span className="text-white/40">нууц үг</span>{cred.pass}</div></div>
            <button type="button" onClick={() => { setU(cred.user); setP(cred.pass); setErr(""); }} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white/10 py-2 text-xs font-semibold hover:bg-white/20"><Copy size={13} /> Автоматаар бөглөх</button>
          </div>
        </div>
        <p className="mt-5 text-center text-xs text-white/40">Жишээ өгөгдөл · зөвхөн танилцуулгад зориулсан</p>
      </div>
    </div>
  );
}
