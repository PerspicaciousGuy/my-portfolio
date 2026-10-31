"use client";

import { useActiveChapter } from "@/lib/use-active-chapter";

/** Dots in the left margin, one per chapter, for wide screens. Clicking one jumps to that chapter. */
export function ChapterDots({ ids, titles }: { ids: string[]; titles: string[] }) {
  const active = useActiveChapter(ids);
  return (
    <nav aria-label="Chapters" className="fixed left-[60px] top-1/2 z-20 hidden -translate-y-1/2 gap-[14px] xl:grid print:hidden">
      {ids.map((id, i) => (
        <a
          key={id}
          href={`#${id}`}
          aria-label={`Chapter ${i + 1}: ${titles[i]}`}
          aria-current={i === active ? "true" : undefined}
          title={titles[i]}
          className="block"
          style={{
            width: i === active ? 20 : 14,
            height: i === active ? 20 : 14,
            marginLeft: i === active ? -3 : 0,
            background: i < active ? "rgb(var(--green))" : i === active ? "rgb(var(--accent))" : "rgb(var(--raised))",
          }}
        />
      ))}
    </nav>
  );
}
