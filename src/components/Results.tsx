import type { Content } from "@/content/site";
import { Container, SectionHead } from "./ui";
import { Reveal } from "./Reveal";

export function Results({ c }: { c: Content }) {
  const { benefits } = c, t = c.copy.results;
  return (
    <section id="results" className="py-24 sm:py-32">
      <Container>
        <SectionHead eyebrow={t.eyebrow} title={t.title} text={t.text} />
        <div className="grid gap-x-12 gap-y-0 md:grid-cols-2">
          {benefits.map((b, i) => (
            <Reveal key={b.title} delay={i * 60}>
              <div className="group flex gap-6 border-t border-ink py-10">
                <span className="font-display text-sm font-semibold text-accent">0{i + 1}</span>
                <div>
                  <h3 className="mb-3 font-display text-2xl font-semibold tracking-tight transition-transform duration-300 group-hover:translate-x-1">{b.title}</h3>
                  <p className="max-w-md text-neutral-600">{b.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
