import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { demos } from "@/demos/registry";
import { DemoBar } from "@/demos/kit";
import { views } from "@/demos/views";

export function generateStaticParams() { return demos.map((d) => ({ slug: d.slug })); }
export const metadata: Metadata = { title: "Тест админ", robots: { index: false } };
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const d = demos.find((x) => x.slug === slug), V = views[slug];
  if (!d || !V) notFound();
  return <><DemoBar name={d.name} admin /><div className="pt-9"><V.Admin /></div></>;
}
