import { Check } from "lucide-react";
import type { Content } from "@/content/site";
import { Container, SectionHead } from "./ui";
import { Reveal } from "./Reveal";

export function Why({ c }: { c: Content }) {
  const { strengths, steps } = c, t = c.copy.about;
  return (
    <section id="about" className="bg-mist py-24 sm:py-32">
      <Container>
        <SectionHead eyebrow={t.eyebrow} title={t.title} text={t.text} />
        <div className="mb-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {strengths.map((s, i) => (
            <Reveal key={s.title} delay={i * 70}>
              <div className="h-full rounded-2xl border border-line bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-ink">
                <span className="mb-6 grid h-8 w-8 place-items-center rounded-full bg-accent text-white"><Check size={16} strokeWidth={3} /></span>
                <h3 className="mb-2 font-display text-xl font-semibold tracking-tight">{s.title}</h3>
                <p className="text-sm leading-relaxed text-neutral-600">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <h3 className="mb-8 font-display text-3xl font-semibold tracking-tight">{t.process}</h3>
        <ol className="grid gap-0 border-y border-ink md:grid-cols-4">
          {steps.map((p, i) => (
            <li key={p.n} className={`py-8 md:px-6 md:first:pl-0 md:last:pr-0 ${i ? "border-t border-line md:border-l md:border-t-0" : ""}`}>
              <span className="font-display text-4xl font-semibold text-neutral-300">{p.n}</span>
              <h4 className="mt-4 text-lg font-semibold">{p.title}</h4>
              <p className="mt-1 text-sm text-neutral-600">{p.text}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
