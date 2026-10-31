export type Chapter = {
  /** 1-based number shown as the chapter numeral. */
  n: number;
  id: string;
  title: string;
  body: string;
};

/**
 * Split an MDX body at its top-level `## ` headings. Text before the first
 * heading comes back as `intro`. Fenced code is skipped, so a commented-out
 * `## thing` inside a snippet never starts a chapter.
 */
export function splitChapters(markdown: string): { intro: string; chapters: Chapter[] } {
  const intro: string[] = [];
  const chapters: Chapter[] = [];
  let inFence = false;
  let current: { title: string; lines: string[] } | null = null;

  const flush = () => {
    if (!current) return;
    chapters.push({
      n: chapters.length + 1,
      id: `ch-${chapters.length + 1}`,
      title: current.title,
      body: current.lines.join("\n").trim(),
    });
  };

  for (const line of markdown.split("\n")) {
    if (line.trimStart().startsWith("```")) inFence = !inFence;
    const match = !inFence ? /^##\s+(.+?)\s*$/.exec(line) : null;
    if (match) {
      flush();
      current = { title: match[1].replace(/[*_`]/g, ""), lines: [] };
    } else if (current) current.lines.push(line);
    else intro.push(line);
  }
  flush();

  return { intro: intro.join("\n").trim(), chapters };
}
