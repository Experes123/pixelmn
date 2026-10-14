import type { MetadataRoute } from "next";
import { defaults } from "@/content/site";
const site = defaults.site;
export default function sitemap(): MetadataRoute.Sitemap { return ["", "/privacy", "/terms"].map((p) => ({ url: site.url + p })); }
