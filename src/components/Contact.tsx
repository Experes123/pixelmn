"use client";
import { useEffect, useState, type FormEvent } from "react";
import { CheckCircle2, AlertCircle, Loader2, ArrowUpRight } from "lucide-react";
import type { Content } from "@/content/site";
import { validate, type ContactInput, type Errors } from "@/lib/contact";
import { Container, Eyebrow } from "./ui";

const empty: ContactInput = { name: "", email: "", company: "", service: "", budget: "", message: "" };
type Status = "idle" | "loading" | "success" | "error";

export function Contact({ c }: { c: Content }) {
  const { budgets, services, site } = c, t = c.copy.contact;
  const [v, setV] = useState(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState("");

  // Pre-select service when a service / pricing card is clicked.
  useEffect(() => {
    const on = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLElement>("[data-service]");
      if (a?.dataset.service) setV((p) => ({ ...p, service: a.dataset.service! }));
    };
    document.addEventListener("click", on);
    return () => document.removeEventListener("click", on);
  }, []);

  const set = (k: keyof ContactInput) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setV((p) => ({ ...p, [k]: e.target.value }));
    if (errors[k]) setErrors((p) => ({ ...p, [k]: undefined }));
  };

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "loading") return;
    const errs = validate(v);
    setErrors(errs);
    if (Object.keys(errs).length) {
      document.getElementById(`f-${Object.keys(errs)[0]}`)?.focus();
      return;
    }
    setStatus("loading"); setServerError("");
    try {
      const hp = (e.currentTarget.elements.namedItem("website") as HTMLInputElement)?.value;
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...v, website: hp }) });
      const data = await res.json().catch(() => ({}));
      if (res.ok) { setStatus("success"); setV(empty); return; }
      if (data.errors) setErrors(data.errors);
      setServerError(data.error ?? "Алдаа гарлаа. Дахин оролдоно уу.");
      setStatus("error");
    } catch {
      setServerError("Сүлжээний алдаа. Холболтоо шалгаад дахин оролдоно уу.");
      setStatus("error");
    }
  }

  const field = "w-full rounded-xl border bg-white px-4 py-3.5 text-[15px] outline-none transition-colors placeholder:text-neutral-400 focus:border-ink";

  return (
    <section id="contact" className="py-24 sm:py-32">
      <Container>
        <div className="grid overflow-hidden rounded-[2rem] bg-ink text-white lg:grid-cols-[1fr_1.15fr]">
          <div className="relative flex flex-col p-8 sm:p-14">
            <Eyebrow>{t.eyebrow}</Eyebrow>
            <h2 className="font-display text-3xl font-semibold leading-[1.12] tracking-tight sm:text-5xl">{t.title}<span className="text-accent"> {t.titleAccent}</span></h2>
            <p className="mt-6 max-w-md text-neutral-400">{t.text}</p>
            <a href={`mailto:${site.email}`} className="group mt-auto inline-flex items-center gap-2 pt-12 text-lg font-semibold hover:text-accent">
              {site.email} <ArrowUpRight size={18} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </a>
          </div>

          <div className="bg-white p-6 text-ink sm:p-12">
            {status === "success" ? (
              <div role="status" className="flex h-full min-h-96 flex-col items-center justify-center text-center">
                <CheckCircle2 size={56} className="mb-5 text-accent" />
                <h3 className="font-display text-3xl font-semibold">{t.successTitle}</h3>
                <p className="mt-3 max-w-sm text-neutral-600">{t.successText}</p>
                <button onClick={() => setStatus("idle")} className="mt-8 rounded-full border border-ink/15 px-6 py-3 text-sm font-semibold hover:border-ink">{t.again}</button>
              </div>
            ) : (
              <form onSubmit={submit} noValidate className="grid gap-5 sm:grid-cols-2" aria-label={t.eyebrow}>
                <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
                <Field label={t.name} id="name" error={errors.name} required><input id="f-name" autoComplete="name" value={v.name} onChange={set("name")} aria-invalid={!!errors.name} aria-describedby="e-name" className={`${field} ${errors.name ? "border-red-500" : "border-line"}`} /></Field>
                <Field label={t.email} id="email" error={errors.email} required><input id="f-email" type="email" autoComplete="email" value={v.email} onChange={set("email")} aria-invalid={!!errors.email} aria-describedby="e-email" className={`${field} ${errors.email ? "border-red-500" : "border-line"}`} /></Field>
                <Field label={t.company} id="company" error={errors.company}><input id="f-company" autoComplete="organization" value={v.company} onChange={set("company")} className={`${field} border-line`} /></Field>
                <Field label={t.service} id="service" error={errors.service} required>
                  <select id="f-service" value={v.service} onChange={set("service")} aria-invalid={!!errors.service} aria-describedby="e-service" className={`${field} ${errors.service ? "border-red-500" : "border-line"}`}>
                    <option value="">{t.servicePh}</option>
                    {services.map((s) => <option key={s.key}>{s.title}</option>)}
                    <option>{t.other}</option>
                  </select>
                </Field>
                <div className="sm:col-span-2">
                  <Field label={t.budget} id="budget" error={errors.budget} required>
                    <select id="f-budget" value={v.budget} onChange={set("budget")} aria-invalid={!!errors.budget} aria-describedby="e-budget" className={`${field} ${errors.budget ? "border-red-500" : "border-line"}`}>
                      <option value="">{t.budgetPh}</option>
                      {budgets.map((b) => <option key={b}>{b}</option>)}
                    </select>
                  </Field>
                </div>
                <div className="sm:col-span-2">
                  <Field label={t.message} id="message" error={errors.message} required>
                    <textarea id="f-message" rows={5} value={v.message} onChange={set("message")} aria-invalid={!!errors.message} aria-describedby="e-message" className={`${field} resize-y ${errors.message ? "border-red-500" : "border-line"}`} />
                  </Field>
                </div>
                {status === "error" && (
                  <p role="alert" className="flex items-start gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-700 sm:col-span-2"><AlertCircle size={18} className="mt-0.5 shrink-0" />{serverError}</p>
                )}
                <button type="submit" disabled={status === "loading"} className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-7 py-4 text-sm font-semibold text-white transition-colors hover:bg-ink disabled:cursor-wait disabled:opacity-70 sm:col-span-2">
                  {status === "loading" ? <><Loader2 size={18} className="animate-spin" />{t.sending}</> : <>{t.submit} <ArrowUpRight size={16} /></>}
                </button>
                <p className="text-xs text-neutral-500 sm:col-span-2"><a href="/privacy" className="underline">{t.consent}</a></p>
              </form>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}

function Field({ label, id, error, required, children }: { label: string; id: string; error?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={`f-${id}`} className="mb-2 block text-sm font-semibold">{label}{required && <span className="text-accent"> *</span>}</label>
      {children}
      <p id={`e-${id}`} className="mt-1.5 min-h-4 text-xs text-red-600">{error}</p>
    </div>
  );
}
