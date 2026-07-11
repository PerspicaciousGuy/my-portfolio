import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { getPosts } from "@/lib/posts";
import { getCaseStudySlugs } from "@/lib/case-studies";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts();

  return [
    { url: site.url, lastModified: new Date(), priority: 1 },
    { url: `${site.url}/blog`, lastModified: new Date(), priority: 0.8 },
    { url: `${site.url}/resume`, lastModified: new Date(), priority: 0.9 },
    ...getCaseStudySlugs().map((slug) => ({
      url: `${site.url}/work/${slug}`,
      lastModified: new Date(),
      priority: 0.7,
    })),
    ...posts.map((p) => ({
      url: `${site.url}/blog/${p.slug}`,
      lastModified: new Date(p.date),
      priority: 0.6,
    })),
  ];
}
