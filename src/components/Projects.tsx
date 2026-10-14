"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";
import type { Content } from "@/content/site";
import { demos, FEATURED_SLOTS, PLACEHOLDERS } from "@/demos/registry";
import { Container, SectionHead } from "./ui";
import { Reveal } from "./Reveal";

type Card = { key: string; href?: string; name: string; desc: string; tags: string[]; from: string; to: string; ink: string; font?: string };

export function Projects({ c }: { c: Content }) {
  const t = c.copy.work;
  const [all, setAll] = useState(false);
  const cards: Card[] = [
    ...demos.map((d) => ({ key: d.slug, href: `/demo/${d.slug}`, name: d.name, desc: d.desc, tags: d.tags, from: d.from, to: d.to, ink: d.ink, font: d.font })),
    ...Array.from({ length: PLACEHOLDERS }, (_, i) => ({ key: `ph${i}`, name: `Лого орлуулагч ${i + 1}`, desc: "Энд таны төсөл байрлана.", tags: ["Тун удахгүй"], from: "#f4f4f2", to: "#e4e4e0", ink: "#9a9a94" })),
  ];
  const shown = all ? cards : cards.slice(0, FEATURED_SLOTS);
  return (
    <section id="work" className="py-24 sm:py-32">
      <Container>
        <SectionHead eyebrow={t.eyebrow} title={t.title} text={t.text} />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((p, i) => {
            const inner = (<>
              <div className="relative grid h-44 place-items-center overflow-hidden" style={{ background: `linear-gradient(135deg, ${p.from}, ${p.to})`, color: p.ink }}>
                <span className="px-4 text-center text-2xl font-bold tracking-tight transition-transform duration-500 group-hover:scale-110" style={{ fontFamily: p.font }}>{p.name}</span>
                {!p.href && <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-500"><Clock size={11} /> Тун удахгүй</span>}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className="mb-4 text-sm text-neutral-600">{p.desc}</p>
                <ul className="mb-4 flex flex-wrap gap-2">{p.tags.map((x) => <li key={x} className="rounded-full border border-ink/10 bg-mist px-3 py-1 text-xs font-medium">{x}</li>)}</ul>
                {p.href && <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold group-hover:text-accent">Демо үзэх <ArrowUpRight size={16} /></span>}
              </div>
            </>);
            const cls = "group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-white transition-all duration-300";
            return (
              <Reveal key={p.key} delay={(i % 3) * 100}>
                {p.href ? <Link href={p.href} className={`${cls} hover:-translate-y-1.5 hover:shadow-2xl`}>{inner}</Link> : <div className={`${cls} opacity-70`} aria-disabled>{inner}</div>}
              </Reveal>
            );
          })}
        </div>
        {cards.length > FEATURED_SLOTS && (
          <div className="mt-10 text-center"><button onClick={() => setAll(!all)} className="rounded-full border border-ink px-7 py-3 text-sm font-semibold hover:bg-ink hover:text-white">{all ? "Хураах" : "Дэлгэрэнгүй үзэх"}</button></div>
        )}
      </Container>
    </section>
  );
}
