import { ArrowUpRight } from "lucide-react";
import type { Content } from "@/content/site";
import type { ServiceKey } from "@/content/site";
import { Container, SectionHead } from "./ui";
import { ServiceIcon } from "./ServiceIcon";
import { Reveal } from "./Reveal";
import { Spot } from "./Effects";

export function Services({ c }: { c: Content }) {
  const { services } = c, t = c.copy.services;
  return (
    <section id="services" className="bg-ink py-24 text-white sm:py-32">
      <Container>
        <div className="[&_p]:text-neutral-400 [&_p:first-child]:text-neutral-400">
          <SectionHead eyebrow={t.eyebrow} title={t.title} text={t.text} />
        </div>
        <ul className="grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <li key={s.key} className="bg-ink">
              <Reveal delay={(i % 3) * 80} className="h-full">
                <Spot className="h-full"><a href="#contact" data-service={s.title}
                  className="group flex h-full min-h-64 flex-col p-8 transition-colors duration-300 hover:bg-ink/0">
                  <span className="mb-10 grid h-12 w-12 place-items-center rounded-xl border border-white/15 transition-colors group-hover:border-white/50"><ServiceIcon k={s.key as ServiceKey} /></span>
                  <h3 className="mb-2 font-display text-2xl font-semibold tracking-tight">{s.title}</h3>
                  <p className="mb-8 text-neutral-400 transition-colors group-hover:text-white">{s.text}</p>
                  <span className="mt-auto flex items-center gap-1.5 text-sm font-semibold">{t.cta} <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></span>
                </a></Spot>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
