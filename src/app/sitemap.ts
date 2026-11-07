import type { MetadataRoute } from "next";
import { getArticoli } from "@/lib/strapi";
import { SITE_URL } from "@/lib/brand";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/plugin`, lastModified: now, changeFrequency: "weekly", priority: 0.95 },
    { url: `${SITE_URL}/servizi`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/risorse`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/contatti`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/amazon-seo`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
  ];

  // TODO 0.6 (Sessione B): read MDX articles from content/ and list them under /risorse/[slug].
  const res = await getArticoli(1, 100);
  const blogRoutes: MetadataRoute.Sitemap = res.data.map((articolo) => ({
    url: `${SITE_URL}/blog/${articolo.slug}`,
    lastModified: new Date(articolo.updatedAt),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...blogRoutes];
}
