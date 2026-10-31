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

const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const BOX = 170;

/**
 * Commit skyline: one building per week. Height is that week's contributions
 * and the lit windows are the busy days. Busy weeks get a violet building and
 * a radio mast.
 */
export function GitCity({ weeks, start, sample }: Props) {
  const [hov, setHov] = useState(-1);
  const max = Math.max(1, ...weeks);
  const total = weeks.reduce((a, b) => a + b, 0);
  const t0 = new Date(start).getTime();
  const when = (i: number) => {
    const d = new Date(t0 + i * 7 * 86_400_000);
    return `${MON[d.getUTCMonth()]} ${d.getUTCDate()}`;
  };

  return (
    <div>
      <div className="relative flex items-end gap-[3px] px-1" style={{ height: BOX + 20 }}>
        {weeks.map((c, i) => {
          const h = c === 0 ? 14 : 24 + Math.round((c / max) * (BOX - 36));
          const busy = c > max * 0.7;
          const lit = Math.min(Math.floor((h - 8) / 12) * 2, Math.round(c / 3));
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
              className="relative block min-w-0 flex-1 cursor-pointer"
              style={{
                height: h,
                background: on ? "rgb(var(--accent))" : busy ? "rgb(var(--violet))" : "rgb(var(--edge))",
                boxShadow: on ? "0 0 0 3px rgb(var(--border))" : "none",
              }}
            >
              {!on &&
                Array.from({ length: lit }, (_, k) => (
                  <i
                    key={k}
                    className="absolute size-1"
                    style={{ left: 4 + (k % 2) * 8, top: 6 + Math.floor(k / 2) * 12, background: "rgb(var(--accent))" }}
                  />
                ))}
              {busy && (
                <>
                  <i className="absolute -top-3.5 left-1/2 -ml-px h-3.5 w-0.5" style={{ background: "rgb(var(--violet))" }} />
                  <i className="absolute -top-[18px] left-1/2 -ml-0.5 size-1 bg-[#E5484D]" />
                </>
              )}
            </a>
          );
        })}
      </div>
      <div aria-hidden="true" className="h-2 bg-border" />
      <p role="status" className="px-label m-0 mt-3.5 min-h-7 text-fg">
        {hov >= 0
          ? `Week of ${when(hov)} · ${weeks[hov]} contributions`
          : `${total} contributions in 52 weeks${sample ? " · sample data" : ""} · each building is a week`}
      </p>
    </div>
  );
}
