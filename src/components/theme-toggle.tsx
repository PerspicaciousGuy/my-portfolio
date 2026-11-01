"use client";

import { useTheme } from "@/lib/use-theme";

const LABEL = {
  night: "Night theme. Click to follow your clock.",
  auto: "Theme follows your clock. Click for day.",
  day: "Day theme. Click for night.",
} as const;

const BADGE = { night: "night", auto: "auto", day: "day" } as const;

/** Cycles night, auto (the visitor's clock) and day. */
export function ThemeToggle() {
  const { mode, cycle } = useTheme();

  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={LABEL[mode]}
      title={LABEL[mode]}
      className="inline-flex h-11 min-w-11 cursor-pointer items-center justify-center gap-1.5 text-fg"
    >
      <svg
        width="33"
        height="33"
        viewBox="0 0 11 11"
        shapeRendering="crispEdges"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M4 4h3v3H4zM5 0h1v2H5zM5 9h1v2H5zM0 5h2v1H0zM9 5h2v1H9zM2 2h1v1H2zM8 2h1v1H8zM2 8h1v1H2zM8 8h1v1H8z" />
      </svg>
      <span className="px-label hidden text-[11px] md:inline">{BADGE[mode]}</span>
    </button>
  );
}
