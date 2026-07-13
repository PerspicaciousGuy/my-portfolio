import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { projects, type Project } from "@/data/site";

const DIR = path.join(process.cwd(), "src", "content", "work");

export type Heading = { id: string; text: string };

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

/** Same slug the rendered <h2 id> uses, so the TOC links always resolve. */
export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

/** Pull the top-level sections out of the MDX. Fenced code is skipped so a
 *  commented-out `## thing` inside a snippet never becomes a heading. */
function extractHeadings(markdown: string): Heading[] {
  const headings: Heading[] = [];
  let inFence = false;

  for (const line of markdown.split("\n")) {
    if (line.trimStart().startsWith("```")) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const match = /^##\s+(.+?)\s*$/.exec(line);
    if (match) {
      const text = match[1].replace(/[*_`]/g, "");
      headings.push({ id: slugifyHeading(text), text });
    }
  }

  return headings;
}

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
