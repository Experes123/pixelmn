import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { demos } from "@/demos/registry";
import { DemoBar } from "@/demos/kit";
import { views } from "@/demos/views";

export function generateStaticParams() { return demos.map((d) => ({ slug: d.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const d = demos.find((x) => x.slug === slug);
  return { title: d ? `${d.name} — демо` : "Демо" };
}
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const d = demos.find((x) => x.slug === slug), V = views[slug];
  if (!d || !V) notFound();
  return <><DemoBar name={d.name} /><div className="pt-9"><V.Site /></div></>;
}
