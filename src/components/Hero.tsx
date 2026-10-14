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
    <section id="top" className="relative isolate overflow-hidden bg-[#07070a] pt-32 pb-20 text-white sm:pt-40 lg:pb-28">
      <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
        <div className="aurora a1" /><div className="aurora a2" /><div className="aurora a3" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0d_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0d_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_30%_30%,black,transparent_75%)]" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/40 to-transparent" />
      </div>
      <Container className="grid items-center gap-16 lg:grid-cols-[1.15fr_1fr]">
        <div>
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[.06] px-3.5 py-1.5 text-xs font-semibold text-white/80 backdrop-blur">
            <span className="h-2 w-2 animate-pulse rounded-full bg-accent" /> {h.badge}
          </p>
          <h1 className="font-display text-[1.9rem] font-semibold leading-[1.12] tracking-[-0.03em] sm:text-5xl xl:text-[3.5rem]">
            <Words words={sp(h.title1)} start={0} />
            <br />
            <Words words={sp(h.title2)} start={n1} className="shimmer" />
            <br />
            <Words words={sp(h.title3)} start={n1 + n2} />
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-white/75">{h.text1}</p>
          <p className="mt-4 max-w-xl text-white/50">{h.text2}</p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button href="#contact" variant="accent">{h.primary}</Button>
            <Button href="#work" variant="glass">{h.secondary}</Button>
          </div>
        </div>
        <div className="relative px-2 pb-8 text-ink sm:px-6"><div aria-hidden className="absolute inset-0 -z-10 m-auto h-3/4 w-3/4 rounded-full bg-accent/30 blur-[90px]" /><HeroMockup /></div>
      </Container>
    </section>
  );
}
