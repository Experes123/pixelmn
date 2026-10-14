import type { Content } from "@/content/site";
import { Container } from "./ui";

export function Trust({ c }: { c: Content }) {
  const t = c.copy.trust;
  return (
    <section aria-labelledby="trust-h" className="bg-mist/60 py-16">
      <Container>
        <h2 id="trust-h" className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
          {t.heading} <span className="text-accent">{t.accent}</span>
        </h2>
        <p className="mx-auto mb-8 max-w-xl text-center text-sm text-neutral-500">{t.note}</p>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {Array.from({ length: 6 }, (_, i) => i + 1).map((n) => (
            <li key={n} className="grid h-20 place-items-center rounded-xl border border-dashed border-neutral-300 bg-white/70 text-xs font-medium text-neutral-400 transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:text-accent">
              {t.placeholder} {n}
            </li>
          ))}
        </ul>
        <dl className="mt-10 grid gap-6 border-t border-line pt-10 text-center sm:grid-cols-3">
          {t.stats.map((l, i) => (
            <div key={i}><dt className="font-display text-3xl font-semibold text-neutral-300">—</dt><dd className="mt-1 text-sm text-neutral-500">{l}</dd></div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
