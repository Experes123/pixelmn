"use client";
import { useEffect, useRef } from "react";

export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const on = () => {
      const h = document.documentElement.scrollHeight - innerHeight;
      if (ref.current) ref.current.style.transform = `scaleX(${h > 0 ? scrollY / h : 0})`;
    };
    on();
    addEventListener("scroll", on, { passive: true });
    return () => removeEventListener("scroll", on);
  }, []);
  return <div aria-hidden className="fixed inset-x-0 top-0 z-[70] h-[3px]"><div ref={ref} className="h-full origin-left scale-x-0 bg-accent" /></div>;
}
