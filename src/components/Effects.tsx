"use client";
import { useEffect, useRef, type ReactNode } from "react";

/** Cursor-following glow (CSS vars --mx/--my) for children using .spot */
export function Spot({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`spot ${className}`} onPointerMove={(e) => {
      const r = e.currentTarget.getBoundingClientRect();
      e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
      e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
    }}>{children}</div>
  );
}

/** 3D tilt following the pointer */
export function Tilt({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`tilt ${className}`}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        e.currentTarget.style.setProperty("--ry", `${x * 6}deg`);
        e.currentTarget.style.setProperty("--rx", `${-y * 6}deg`);
      }}
      onPointerLeave={(e) => { e.currentTarget.style.setProperty("--ry", "0deg"); e.currentTarget.style.setProperty("--rx", "0deg"); }}>
      {children}
    </div>
  );
}

/** Words light up as you scroll through the paragraph */
export function ScrollWords({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = text.split(" ");
  useEffect(() => {
    const el = ref.current!;
    const spans = Array.from(el.querySelectorAll<HTMLElement>("span"));
    const on = () => {
      const r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (innerHeight * 0.85 - r.top) / (r.height + innerHeight * 0.3)));
      spans.forEach((s, i) => { s.style.opacity = String(i / spans.length < p ? 1 : 0.18); });
    };
    on();
    addEventListener("scroll", on, { passive: true });
    return () => removeEventListener("scroll", on);
  }, []);
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => <span key={i} className="transition-opacity duration-300" style={{ opacity: 0.18 }}>{w}{" "}</span>)}
    </p>
  );
}
