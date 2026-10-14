"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

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
