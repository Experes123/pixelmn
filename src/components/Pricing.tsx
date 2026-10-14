import { Check } from "lucide-react";
import type { Content } from "@/content/site";
import { Container, SectionHead } from "./ui";
import { Reveal } from "./Reveal";

export function Pricing({ c }: { c: Content }) {
  const t = c.copy.pricing;
  return (
    <section id="pricing" className="py-24 sm:py-32">
      <Container>
        <SectionHead eyebrow={t.eyebrow} title={t.title} text={t.text} />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {c.packages.map((p, i) => (
            <Reveal key={i} delay={i * 90}>
              <div className={`flex h-full flex-col rounded-3xl p-7 transition-transform duration-300 hover:-translate-y-1.5 ${p.featured ? "bg-ink text-white" : "border border-line bg-white"}`}>
                <div className="mb-6 flex min-h-[2.75rem] items-center justify-between gap-2">
                  <h3 className="font-display text-xl font-semibold">{p.name}</h3>
                  {p.featured && <span className="rounded-full bg-accent px-3 py-1 text-[11px] font-semibold text-white">{t.badge}</span>}
                </div>
                <p className={`mb-6 min-h-[4.5rem] text-sm leading-relaxed ${p.featured ? "text-neutral-400" : "text-neutral-600"}`}>{p.blurb}</p>
                <div className="mb-1 font-display text-2xl font-semibold tracking-tight sm:text-[1.7rem]">{p.price}</div>
                <div className={`mb-7 text-xs ${p.featured ? "text-neutral-400" : "text-neutral-500"}`}>{p.priceNote || "\u00a0"}</div>
                <ul className="mb-9 space-y-3 text-sm">
                  {p.features.map((f, j) => <li key={j} className="flex gap-3"><Check size={18} className="shrink-0 text-accent" />{f}</li>)}
                </ul>
                <a href="#contact" data-service={p.service}
                  className={`mt-auto rounded-full px-6 py-3.5 text-center text-sm font-semibold transition-colors ${p.featured ? "bg-accent hover:bg-white hover:text-ink" : "bg-ink text-white hover:bg-accent"}`}>
                  {p.cta}
                </a>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-6 text-center text-sm text-neutral-500">{t.note}</p>
      </Container>
    </section>
  );
}
