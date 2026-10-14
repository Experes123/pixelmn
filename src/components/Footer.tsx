import { Mail, Phone, MapPin } from "lucide-react";
import type { Content } from "@/content/site";
import { Logo } from "./Logo";
import { Container } from "./ui";

export function Footer({ c }: { c: Content }) {
  const { nav, site } = c, t = c.copy.footer;
  return (
    <footer className="bg-ink pt-20 pb-10 text-white">
      <Container>
        <div className="grid gap-12 border-b border-white/10 pb-14 md:grid-cols-[1.5fr_1fr_1fr_1.2fr]">
          <div>
            <Logo light name={site.name.split(" ")[0]} />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-neutral-400">{site.description}</p>
          </div>
          <FooterCol title={t.nav} links={[...nav, { label: t.contact, href: "#contact" }]} />
          <FooterCol title={t.social} links={site.social.map((s) => ({ label: s.label, href: s.href }))} external />
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">{t.contact}</h4>
            <ul className="space-y-3 text-sm text-neutral-300">
              <li className="flex gap-2"><Mail size={16} className="mt-0.5 shrink-0 text-accent" /><a href={`mailto:${site.email}`} className="hover:text-white">{site.email}</a></li>
              <li className="flex gap-2"><Phone size={16} className="mt-0.5 shrink-0 text-accent" />{site.phone}</li>
              <li className="flex gap-2"><MapPin size={16} className="mt-0.5 shrink-0 text-accent" />{site.address}</li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col justify-between gap-4 pt-8 text-sm text-neutral-500 sm:flex-row">
          <p>© {new Date().getFullYear()} {site.name}. {t.rights}</p>
          <div className="flex gap-6"><a href="/privacy" className="hover:text-white">{t.privacy}</a><a href="/terms" className="hover:text-white">{t.terms}</a></div>
        </div>
      </Container>
    </footer>
  );
}

function FooterCol({ title, links, external }: { title: string; links: { label: string; href: string }[]; external?: boolean }) {
  return (
    <div>
      <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">{title}</h4>
      <ul className="space-y-3 text-sm text-neutral-300">
        {links.map((l) => (
          <li key={l.label}><a href={l.href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="transition-colors hover:text-accent">{l.label}</a></li>
        ))}
      </ul>
    </div>
  );
}
