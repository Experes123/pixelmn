import type { MetadataRoute } from "next";
import { defaults } from "@/content/site";
const site = defaults.site;
export default function robots(): MetadataRoute.Robots { return { rules: { userAgent: "*", allow: "/" }, sitemap: `${site.url}/sitemap.xml` }; }
