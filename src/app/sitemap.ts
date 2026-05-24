import type { MetadataRoute } from "next";
import { getArticoli } from "@/lib/strapi";

const BASE_URL = "https://aiframe.it";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/chi-siamo`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/amazon-seo`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.85 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/risorse`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/contatti`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  ];

  const res = await getArticoli(1, 100);
  const blogRoutes: MetadataRoute.Sitemap = res.data.map((articolo) => ({
    url: `${BASE_URL}/blog/${articolo.slug}`,
    lastModified: new Date(articolo.updatedAt),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...blogRoutes];
}
