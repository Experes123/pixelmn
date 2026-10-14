import { ArrowUpRight } from "lucide-react";
import type { Content } from "@/content/site";
import { Container, SectionHead } from "./ui";
import { ProjectMockup } from "./Mockups";
import { Reveal } from "./Reveal";
import { Tilt } from "./Effects";

export function Projects({ c }: { c: Content }) {
  const { projects } = c, t = c.copy.work;
  return (
    <section id="work" className="py-24 sm:py-32">
      <Container>
        <SectionHead eyebrow={t.eyebrow} title={t.title} text={t.text} />
        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((p, i) => (
            <Reveal key={p.name} delay={(i % 2) * 120}>
              <Tilt className="h-full"><article className="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-mist p-5 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl sm:p-8">
                <div className="mb-8 flex h-72 items-center justify-center overflow-hidden rounded-2xl bg-[#e9e9e5] p-5 sm:p-8">
                  <div className="w-full transition-transform duration-700 group-hover:scale-[1.04]"><ProjectMockup kind={p.kind} /></div>
                </div>
                <div className="mb-3 flex items-center justify-between gap-4">
                  <h3 className="font-display text-2xl font-semibold tracking-tight">{p.name}</h3>
                  <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-500">{t.badge}</span>
                </div>
                <p className="mb-5 text-neutral-600">{p.desc}</p>
                <ul className="mb-6 flex flex-wrap gap-2">
                  {p.tags.map((t) => <li key={t} className="rounded-full border border-ink/10 bg-white px-3 py-1 text-xs font-medium">{t}</li>)}
                </ul>
                <a href="#contact" className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold after:absolute after:inset-0 hover:text-accent">
                  {t.link} <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </a>
              </article></Tilt>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
