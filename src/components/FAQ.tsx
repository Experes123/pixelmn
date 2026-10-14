"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import type { Content } from "@/content/site";
import { Container, Eyebrow } from "./ui";

export function FAQ({ c }: { c: Content }) {
  const { faqs } = c, t = c.copy.faq;
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="resources" className="bg-mist py-24 sm:py-32">
      <Container className="grid gap-12 lg:grid-cols-[1fr_1.6fr]">
        <div>
          <Eyebrow>{t.eyebrow}</Eyebrow>
          <h2 className="font-display text-3xl font-semibold leading-[1.1] tracking-tight sm:text-4xl">{t.title}</h2>
          <p className="mt-5 max-w-sm text-neutral-600">{t.text} <a href="#contact" className="font-semibold text-ink underline decoration-accent decoration-2 underline-offset-4">{t.link}</a></p>
        </div>
        <div className="divide-y divide-line border-y border-line">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q}>
                <h3>
                  <button id={`faq-b-${i}`} aria-expanded={isOpen} aria-controls={`faq-p-${i}`} onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-6 py-6 text-left font-display text-base font-semibold tracking-tight sm:text-lg">
                    {f.q}
                    <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-all duration-300 ${isOpen ? "rotate-45 border-accent bg-accent text-white" : "border-ink/20"}`}><Plus size={18} /></span>
                  </button>
                </h3>
                <div id={`faq-p-${i}`} role="region" aria-labelledby={`faq-b-${i}`}
                  className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr] pb-6 opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                  <p className="overflow-hidden pr-14 text-neutral-600">{f.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
