export type Heading = { id: string; text: string };

/** The slug the rendered <h2 id> uses, so a table of contents always resolves. */
export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

/**
 * Pull the top-level sections out of a markdown/MDX body.
 *
 * Fenced code is skipped, so a commented-out `## thing` inside a snippet never
 * becomes a heading. Shared by case studies and blog posts.
 */
export function extractHeadings(markdown: string): Heading[] {
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
