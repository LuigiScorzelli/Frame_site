import type { MetadataRoute } from "next";
import { getArticoli } from "@/lib/content";
import { AUTORI, SITE_URL } from "@/lib/brand";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/plugin`, lastModified: now, changeFrequency: "weekly", priority: 0.95 },
    { url: `${SITE_URL}/check-up`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${SITE_URL}/servizi`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/risorse`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/contatti`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/amazon-seo`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
  ];

  // Drafts are already excluded in production by getArticoli(); filter again so a dev build never lists them.
  const articoli: MetadataRoute.Sitemap = getArticoli()
    .filter((a) => !a.bozza)
    .map((a) => ({
      url: `${SITE_URL}/risorse/${a.slug}`,
      lastModified: new Date(`${a.data}T12:00:00Z`),
      changeFrequency: "monthly",
      priority: 0.6,
    }));

  const autori: MetadataRoute.Sitemap = Object.keys(AUTORI).map((slug) => ({
    url: `${SITE_URL}/autore/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.4,
  }));

  return [...staticRoutes, ...articoli, ...autori];
}
