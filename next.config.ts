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
  async redirects() {
    return [
      // "Chi siamo" now lives in the home section (docs/lancio/01-piano-sprint.md, 0.2).
      { source: "/chi-siamo", destination: "/#chi-siamo", permanent: true },
    ];
  },
};

export default nextConfig;
