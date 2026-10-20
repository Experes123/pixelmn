import type { Metadata, Viewport } from "next";
import {
  Inter,
  Manrope,
  Playfair_Display,
  Russo_One,
  Lora,
  Noto_Serif,
  Unbounded,
} from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { AdminAuthDialog } from "@/components/shared/main-auth";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
});
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
});
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "cyrillic"],
});
const russo = Russo_One({
  variable: "--font-russo",
  weight: "400",
  subsets: ["latin", "cyrillic"],
});
const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin", "cyrillic"],
});
const notoSerif = Noto_Serif({
  variable: "--font-noto-serif",
  subsets: ["latin", "cyrillic"],
});
const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "Pixelmn — Мэргэжлийн вэб хөгжүүлэлт, дизайны студио",
  description:
    "Pixelmn бол монгол бизнесүүдэд мэргэжлийн вэбсайт, цахим худалдааны систем, захиалгын платформыг дизайнаас хөгжүүлэлт хүртэл нь бүрэн ажиллагаатай нийлүүлдэг дижитал студио.",
  keywords: [
    "вэбсайт хөгжүүлэлт",
    "дижитал студио",
    "монгол вэб дизайн",
    "цахим худалдаа",
    "UI/UX дизайн",
    "Pixelmn",
  ],
  authors: [{ name: "Pixelmn" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Pixelmn — Мэргэжлийн вэб хөгжүүлэлт",
    description:
      "Таны бизнесийг өсгөх дижитал бүтээгдэхүүнүүд: вэбсайт, цахим худалдаа, захиалгын систем.",
    siteName: "Pixelmn",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0B0B0C",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="mn" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${manrope.variable} ${playfair.variable} ${russo.variable} ${lora.variable} ${notoSerif.variable} ${unbounded.variable} font-sans antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
        <SonnerToaster position="top-center" />
        <AdminAuthDialog />
      </body>
    </html>
  );
}
