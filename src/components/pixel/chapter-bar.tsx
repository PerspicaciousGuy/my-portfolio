"use client";

import { useActiveChapter } from "@/lib/use-active-chapter";

/** A segmented progress bar, one segment per chapter: done is green, current is yellow. */
export function ChapterBar({ ids }: { ids: string[] }) {
  const active = useActiveChapter(ids);
  return (
    <div
      role="progressbar"
      aria-label="Chapter progress"
      aria-valuemin={0}
      aria-valuemax={ids.length}
      aria-valuenow={Math.max(0, active + 1)}
      className="sticky top-[64px] z-30 flex h-3 gap-1 bg-bg print:hidden md:top-[80px]"
    >
      {ids.map((id, i) => (
        <i
          key={id}
          className="block flex-1"
          style={{
            background: i < active ? "rgb(var(--green))" : i === active ? "rgb(var(--accent))" : "rgb(var(--raised))",
          }}
        />
      ))}
    </div>
  );
}
