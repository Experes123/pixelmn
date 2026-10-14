import type { Metadata } from "next";
import { Legal } from "@/components/Legal";
import { getContent } from "@/lib/store";

export const dynamic = "force-dynamic";
export async function generateMetadata(): Promise<Metadata> { const c = await getContent(); return { title: c.copy.legal.termsTitle }; }
export default async function Page() {
  const c = await getContent();
  return <Legal c={c} title={c.copy.legal.termsTitle} body={c.copy.legal.termsBody} />;
}
