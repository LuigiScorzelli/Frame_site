import type { NextConfig } from "next";

// Sent with every response. The policy stays narrow on purpose: it blocks framing by other sites, <base>
// hijacking, plugins and forms posting elsewhere, without listing script sources (iubenda, Calendly, Umami and
// the assistant load their own scripts, and a wrong list would break them).
const INTESTAZIONI_SICUREZZA = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'self'; base-uri 'self'; object-src 'none'; form-action 'self'" },
];

const nextConfig: NextConfig = {
  // No images.remotePatterns: the site uses only its own images, so /_next/image must not resize
  // pictures from other hosts on our account.
  async headers() {
    return [{ source: "/:path*", headers: INTESTAZIONI_SICUREZZA }];
  },
  // The beta download route reads update.json and the zip from public/inframe at runtime.
  outputFileTracingIncludes: {
    "/api/wpla/download": ["./public/inframe/**"],
  },
  async redirects() {
    return [
      // "Chi siamo" now lives in the home section (docs/lancio/01-piano-sprint.md, 0.2).
      { source: "/chi-siamo", destination: "/#chi-siamo", permanent: true },
      // The blog moved from Strapi to MDX under /risorse (0.6). 301 as in the spec (permanent: true would be 308).
      { source: "/blog", destination: "/risorse", statusCode: 301 },
      { source: "/blog/:slug", destination: "/risorse/:slug", statusCode: 301 },
    ];
  },
};

export default nextConfig;
