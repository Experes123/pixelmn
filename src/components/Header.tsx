"use client";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import type { Content } from "@/content/site";
import { Logo } from "./Logo";
import { Container } from "./ui";

export function Header({ c }: { c: Content }) {
  const nav = c.nav;
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", esc);
    return () => { window.removeEventListener("keydown", esc); document.body.style.overflow = ""; };
  }, [open]);

  return (
    <header data-dark={!scrolled && !open} className={`group/h fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled || open ? "border-b border-line bg-white/85 backdrop-blur-xl" : "border-b border-transparent"}`}>
      <Container className="flex h-[72px] items-center justify-between">
        <a href="#top" aria-label={c.site.name} onClick={() => setOpen(false)}><Logo light={!scrolled && !open} name={c.site.name.split(" ")[0]} /></a>
        <nav aria-label="Үндсэн цэс" className="hidden items-center gap-1 lg:flex">
          {nav.map((n) => (
            <a key={n.href} href={n.href} className="rounded-full px-4 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-mist hover:text-ink group-data-[dark=true]/h:text-white/75 group-data-[dark=true]/h:hover:bg-white/10 group-data-[dark=true]/h:hover:text-white">{n.label}</a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a href="#contact" className="hidden rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-ink sm:inline-block">{c.copy.header.cta}</a>
          <button className="grid h-11 w-11 place-items-center rounded-full border border-line group-data-[dark=true]/h:border-white/20 group-data-[dark=true]/h:text-white lg:hidden" aria-expanded={open} aria-controls="mobile-menu"
            aria-label={open ? "Цэс хаах" : "Цэс нээх"} onClick={() => setOpen(!open)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </Container>
      {open && (
        <div id="mobile-menu" className="h-[calc(100dvh-72px)] bg-white lg:hidden">
          <Container className="flex flex-col gap-1 pt-6">
            {nav.map((n) => (
              <a key={n.href} href={n.href} onClick={() => setOpen(false)} className="border-b border-line py-4 font-display text-2xl font-semibold tracking-tight">{n.label}</a>
            ))}
            <a href="#contact" onClick={() => setOpen(false)} className="mt-6 rounded-full bg-accent py-4 text-center font-semibold text-white">{c.copy.header.cta}</a>
          </Container>
        </div>
      )}
    </header>
  );
}
