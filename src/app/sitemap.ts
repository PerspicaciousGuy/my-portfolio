import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { getPosts } from "@/lib/posts";
import { getCaseStudySlugs } from "@/lib/case-studies";

// Google ignores <priority> and only trusts <lastmod> when it is accurate, so
// only entries with a real date carry one: posts use their publish date, the
// rest are left without rather than claiming "modified now" on every build.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts();

  return [
    { url: site.url },
    { url: `${site.url}/blog` },
    { url: `${site.url}/resume` },
    ...getCaseStudySlugs().map((slug) => ({ url: `${site.url}/work/${slug}` })),
    ...posts.map((p) => ({ url: `${site.url}/blog/${p.slug}`, lastModified: new Date(p.date) })),
  ];
}
