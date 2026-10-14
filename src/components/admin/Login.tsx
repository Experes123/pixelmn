"use client";
import { useState } from "react";

export function Login() {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  async function go(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setErr("");
    const r = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: pw }) });
    if (r.ok) { location.reload(); return; }
    setErr((await r.json().catch(() => ({}))).error ?? "Login failed"); setBusy(false);
  }
  return (
    <main className="grid min-h-dvh place-items-center bg-mist p-6">
      <form onSubmit={go} className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="mb-1 text-xl font-bold">Admin login</h1>
        <p className="mb-6 text-sm text-neutral-500">Sign in to edit your website.</p>
        <label htmlFor="pw" className="mb-1.5 block text-sm font-semibold">Password</label>
        <input id="pw" type="password" autoFocus autoComplete="current-password" value={pw} onChange={(e) => setPw(e.target.value)} className="mb-3 w-full rounded-xl border border-line px-4 py-3 outline-none focus:border-ink" />
        {err && <p role="alert" className="mb-3 text-sm text-red-600">{err}</p>}
        <button disabled={busy || !pw} className="w-full rounded-full bg-ink py-3 text-sm font-semibold text-white hover:bg-accent disabled:opacity-60">{busy ? "Signing in…" : "Sign in"}</button>
      </form>
    </main>
  );
}
