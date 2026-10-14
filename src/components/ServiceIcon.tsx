import { Code2, PenTool, Fingerprint, LayoutTemplate, ShoppingBag, Workflow, Sparkles, Smartphone, LifeBuoy } from "lucide-react";
import type { ServiceKey } from "@/content/site";

const map = { web: Code2, ux: PenTool, brand: Fingerprint, landing: LayoutTemplate, ecom: ShoppingBag, automation: Workflow, ai: Sparkles, mobile: Smartphone, maintenance: LifeBuoy };
export function ServiceIcon({ k, size = 24 }: { k: ServiceKey; size?: number }) {
  const I = map[k];
  return <I size={size} strokeWidth={1.6} />;
}
