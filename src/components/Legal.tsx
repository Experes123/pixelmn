import type { Content } from "@/content/site";
import { Container } from "./ui";
import { Logo } from "./Logo";
export function Legal({ c, title, body }: { c: Content; title: string; body: string }) {
  return (
    <main className="py-10">
      <Container className="max-w-3xl">
        <a href="/" aria-label={c.site.name}><Logo name={c.site.name.split(" ")[0]} /></a>
        <h1 className="mt-16 font-display text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
        <p className="mt-4 rounded-xl bg-mist p-4 text-sm text-neutral-600">{c.copy.legal.notice}</p>
        <div className="mt-8 space-y-4 whitespace-pre-line leading-relaxed text-neutral-700">{body}</div>
        <a href="/" className="mt-12 inline-block font-semibold underline decoration-accent decoration-2 underline-offset-4">{c.copy.legal.back}</a>
      </Container>
    </main>
  );
}
