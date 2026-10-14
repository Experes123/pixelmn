import type { Metadata, Viewport } from "next";
import { Manrope, Unbounded } from "next/font/google";
import { getContent } from "@/lib/store";
import { ScrollProgress } from "@/components/ScrollProgress";
import "./globals.css";

const inter = Manrope({ subsets: ["cyrillic", "cyrillic-ext", "latin"], variable: "--font-inter", display: "swap" });
const grotesk = Unbounded({ subsets: ["cyrillic", "cyrillic-ext", "latin"], variable: "--font-grotesk", display: "swap" });

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getContent();
  return {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — Бизнесийг урагшлуулах дижитал бүтээгдэхүүн`, template: `%s | ${site.name}` },
  description: site.description,
  openGraph: { title: site.name, description: site.description, type: "website", locale: "mn_MN", url: site.url, siteName: site.name },
  twitter: { card: "summary_large_image", title: site.name, description: site.description },
  robots: { index: true, follow: true },
  };
}
export const viewport: Viewport = { themeColor: "#ffffff", width: "device-width", initialScale: 1 };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { site } = await getContent();
  const ld = { "@context": "https://schema.org", "@type": "Organization", name: site.name, url: site.url, email: site.email, description: site.description };
  return (
    <html lang="mn" className={`${inter.variable} ${grotesk.variable}`}>
      <body className="font-sans">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-white">Үндсэн агуулга руу очих</a>
        {children}
        <ScrollProgress />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      </body>
    </html>
  );
}
