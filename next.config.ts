import type { NextConfig } from "next";

/**
 * Аюулгүй байдлын толгойнууд (security headers) — бүх замуудад.
 * CSP-г зориуд оруулаагүй: Next.js-ийн inline runtime script-тэй зөрчилдөхөөс
 * зайлсхийж, бусад стандарт хамгаалалтыг бүрэн тохируулсан.
 */
const SECURITY_HEADERS = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

/**
 * Төслийн үндсэн хавтас — build/dev үргэлж энэ хавтсаас ажиллана.
 * Эс бөгөөс Next.js гаднах бусад lockfile-уудыг олж, workspace root-ыг
 * андуурч (standalone гаралтыг "Desktop/game/..." гэж үүрлэж) бичдэг.
 */
const PROJECT_ROOT = process.cwd();

/**
 * Netlify дээр OpenNext adapter өөрийн гаралтыг үүсгэдэг тул
 * `output: "standalone"` шаардлагагүй (мөн зөрчилдөж болзошгүй).
 */
const IS_NETLIFY = process.env.NETLIFY === "true";

const nextConfig: NextConfig = {
  ...(IS_NETLIFY ? {} : { output: "standalone" as const }),
  outputFileTracingRoot: PROJECT_ROOT,
  turbopack: {
    root: PROJECT_ROOT,
  },
  poweredByHeader: false,
  reactStrictMode: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: SECURITY_HEADERS,
      },
      {
        // Хамгаалагдсан админ хуудсыг хайлтын системд оруулахгүй
        source: "/admin",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;
