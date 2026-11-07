import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  // The beta download route reads update.json and the zip from public/wpla at runtime.
  outputFileTracingIncludes: {
    "/api/wpla/download": ["./public/wpla/**"],
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
