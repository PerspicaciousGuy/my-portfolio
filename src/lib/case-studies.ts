import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { projects, type Project } from "@/data/site";
import { extractHeadings, type Heading } from "@/lib/headings";

const DIR = path.join(process.cwd(), "src", "content", "work");

export type CaseStudy = {
  slug: string;
  /** Pulled from site.ts so the card and the page can never disagree. */
  project: Project;
  /** One-line framing shown under the title. */
  summary: string;
  /** Headline facts rendered as a stat strip. */
  facts: { label: string; value: string }[];
  /** The `##` sections, in order — drives the table of contents. */
  headings: Heading[];
  content: string;
};


export async function getCaseStudy(slug: string): Promise<CaseStudy | null> {
  const project = projects.find((p) => p.slug === slug);
  if (!project) return null;

  let raw: string;
  try {
    raw = await fs.readFile(path.join(DIR, `${slug}.mdx`), "utf8");
  } catch {
    return null;
  }

  const { data, content } = matter(raw);

  return {
    slug,
    project,
    summary: data.summary ?? project.blurb,
    facts: data.facts ?? [],
    headings: extractHeadings(content),
    content,
  };
}

export function getCaseStudySlugs(): string[] {
  return projects.flatMap((p) => (p.slug ? [p.slug] : []));
}
