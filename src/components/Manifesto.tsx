import type { Content } from "@/content/site";
import { Container, Eyebrow } from "./ui";
import { ScrollWords } from "./Effects";
import { Reveal } from "./Reveal";

export function Manifesto({ c }: { c: Content }) {
  const { manifesto, principles } = c;
  return (
    <section className="py-24 sm:py-36">
      <Container>
        <Eyebrow>{c.copy.manifestoEyebrow}</Eyebrow>
        <ScrollWords text={manifesto} className="max-w-5xl font-display text-2xl font-semibold leading-[1.35] tracking-tight sm:text-4xl" />
        <div className="mt-20 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {principles.map((p, i) => (
            <Reveal key={p.k} delay={i * 80} className="bg-white">
              <div className="group h-full p-7 transition-colors duration-300 hover:bg-ink hover:text-white">
                <div className="mb-8 font-display text-sm text-accent">0{i + 1}</div>
                <h3 className="mb-2 font-display text-xl font-semibold">{p.k}</h3>
                <p className="text-sm text-neutral-500 group-hover:text-neutral-300">{p.v}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
