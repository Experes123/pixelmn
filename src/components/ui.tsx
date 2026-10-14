import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-7xl px-5 sm:px-8 ${className}`}>{children}</div>;
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
      <span className="h-2 w-2 rounded-full bg-accent" />{children}
    </p>
  );
}

export function SectionHead({ eyebrow, title, text }: { eyebrow: string; title: ReactNode; text?: string }) {
  return (
    <div className="mb-14 grid gap-6 md:grid-cols-[1.4fr_1fr] md:items-end">
      <div>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="font-display text-3xl font-semibold leading-[1.1] tracking-tight sm:text-4xl lg:text-5xl">{title}</h2>
      </div>
      {text && <p className="max-w-md text-lg leading-relaxed text-neutral-600">{text}</p>}
    </div>
  );
}

export function Button({ href, children, variant = "primary", className = "", ...rest }:
  { href: string; children: ReactNode; variant?: "primary" | "ghost" | "accent"; className?: string } & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const styles = {
    primary: "bg-ink text-white hover:bg-accent",
    accent: "bg-accent text-white hover:bg-ink",
    ghost: "border border-ink/15 bg-white text-ink hover:border-ink",
  }[variant];
  return (
    <a href={href} {...rest}
      className={`group inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition-all duration-300 ${styles} ${className}`}>
      {children}
      <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </a>
  );
}
