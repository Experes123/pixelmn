import { Button, Container } from "./ui";
import { HeroMockup } from "./Mockups";

import type { Content } from "@/content/site";

function Words({ words, start, className = "" }: { words: string[]; start: number; className?: string }) {
  return (
    <>
      {words.map((w, i) => (
        <span key={i}><span className="w-mask">
          <span className={`w-in ${className}`} style={{ "--d": `${(start + i) * 110}ms` } as React.CSSProperties}>{w}</span>
        </span>{" "}</span>
      ))}
    </>
  );
}

export function Hero({ c }: { c: Content }) {
  const h = c.copy.hero;
  const sp = (t: string) => t.split(" ").filter(Boolean);
  const n1 = sp(h.title1).length, n2 = sp(h.title2).length;
  return (
    <section id="top" className="relative overflow-hidden pt-32 pb-20 sm:pt-40 lg:pb-28">
      <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-full bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
      <Container className="grid items-center gap-16 lg:grid-cols-[1.15fr_1fr]">
        <div>
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-white px-3.5 py-1.5 text-xs font-semibold text-neutral-600">
            <span className="h-2 w-2 animate-pulse rounded-full bg-accent" /> {h.badge}
          </p>
          <h1 className="font-display text-[1.9rem] font-semibold leading-[1.12] tracking-[-0.03em] sm:text-5xl xl:text-[3.5rem]">
            <Words words={sp(h.title1)} start={0} />
            <br />
            <Words words={sp(h.title2)} start={n1} className="shimmer" />
            <br />
            <Words words={sp(h.title3)} start={n1 + n2} />
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-neutral-600">{h.text1}</p>
          <p className="mt-4 max-w-xl text-neutral-500">{h.text2}</p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button href="#contact" variant="accent">{h.primary}</Button>
            <Button href="#work" variant="ghost">{h.secondary}</Button>
          </div>
        </div>
        <div className="px-2 pb-8 sm:px-6"><HeroMockup /></div>
      </Container>
    </section>
  );
}
