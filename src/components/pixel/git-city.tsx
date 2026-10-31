"use client";

import { useState } from "react";

type Props = {
  /** Contributions per week, oldest first. */
  weeks: number[];
  /** ISO date of the Monday of the first week. */
  start: string;
  /** True when the numbers are placeholders because GitHub was unreachable. */
  sample?: boolean;
};

const MON = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const BOX = 170;

/**
 * Commit skyline: one building per week. Height is that week's contributions
 * and the lit windows are the busy days. Busy weeks get a violet building and
 * a radio mast.
 */
export function GitCity({ weeks, start, sample }: Props) {
  const [hov, setHov] = useState(-1);
  // One huge week would flatten every other building, so heights are scaled to the
  // 90th percentile of the active weeks and anything above it is a full-height tower.
  const active = weeks.filter((c) => c > 0).sort((a, b) => a - b);
  const cap = Math.max(1, active[Math.floor((active.length - 1) * 0.9)] ?? 1);
  const total = weeks.reduce((a, b) => a + b, 0);
  // Phones show the latest half of the year: 52 buildings in 350 px would be slivers.
  const recent = weeks.length - 26;
  const totalRecent = weeks.slice(recent).reduce((a, b) => a + b, 0);
  const t0 = new Date(start).getTime();
  const when = (i: number) => {
    const d = new Date(t0 + i * 7 * 86_400_000);
    return `${MON[d.getUTCMonth()]} ${d.getUTCDate()}`;
  };

  return (
    <div>
      <div
        className="relative flex items-end gap-[3px] px-1"
        style={{ height: BOX + 20 }}
      >
        {weeks.map((c, i) => {
          const h =
            c === 0
              ? 14
              : 24 + Math.round((Math.min(c, cap) / cap) * (BOX - 36));
          const busy = c >= cap;
          const rows = Math.min(
            Math.floor((h - 8) / 12),
            Math.ceil(Math.round((Math.min(c, cap) / cap) * 24) / 2),
          );
          const on = hov === i;
          return (
            <a
              key={i}
              href="https://github.com/PerspicaciousGuy"
              aria-label={`Week of ${when(i)}: ${c} contributions`}
              onMouseEnter={() => setHov(i)}
              onMouseLeave={() => setHov(-1)}
              onFocus={() => setHov(i)}
              onBlur={() => setHov(-1)}
              className={`px-bldg relative block min-w-0 flex-1 cursor-pointer ${i < recent ? "max-sm:hidden" : ""}`}
              style={{
                height: h,
                background: on
                  ? "rgb(var(--accent))"
                  : busy
                    ? "rgb(var(--violet))"
                    : "rgb(var(--edge))",
                boxShadow: on ? "0 0 0 3px rgb(var(--border))" : "none",
              }}
            >
              {!on && rows > 0 && (
                <span className="px-wins" style={{ height: rows * 12 - 8 }}>
                  {Array.from({ length: rows * 2 }, (_, k) => (
                    <i key={k} />
                  ))}
                </span>
              )}
              {busy && (
                <>
                  <i
                    className="absolute -top-3.5 left-1/2 -ml-px h-3.5 w-0.5"
                    style={{ background: "rgb(var(--violet))" }}
                  />
                  <i className="absolute -top-[18px] left-1/2 -ml-0.5 size-1 bg-[#E5484D]" />
                </>
              )}
            </a>
          );
        })}
      </div>
      <div aria-hidden="true" className="h-2 bg-border" />
      <p role="status" className="px-label m-0 mt-3.5 min-h-7 text-fg">
        {hov >= 0 ? (
          `Week of ${when(hov)} · ${weeks[hov]} contributions`
        ) : (
          <>
            <span className="sm:hidden">
              {totalRecent} contributions in 26 weeks
            </span>
            <span className="max-sm:hidden">
              {total} contributions in 52 weeks
            </span>
            {sample ? " · sample data" : ""} · each building is a week
          </>
        )}
      </p>
    </div>
  );
}
