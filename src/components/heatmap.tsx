const LEVELS = [
  "bg-fg/[0.06]",
  "bg-accent/25",
  "bg-accent/45",
  "bg-accent/70",
  "bg-accent",
];

function level(count: number, max: number) {
  if (count === 0) return 0;
  const q = count / Math.max(max, 1);
  if (q > 0.6) return 4;
  if (q > 0.35) return 3;
  if (q > 0.15) return 2;
  return 1;
}

export function Heatmap({ weeks }: { weeks: number[][] }) {
  const max = Math.max(...weeks.flat(), 1);

  return (
    <div className="border-t border-border p-6">
      <p className="font-mono text-xs uppercase tracking-widest text-fg-subtle">
        The last year, one square per day
      </p>

      {/* Horizontal scroll on narrow screens rather than squashing the grid. */}
      <div className="mt-4 overflow-x-auto pb-1">
        <div className="flex min-w-max gap-[3px]">
          {weeks.map((week, w) => (
            <div key={w} className="flex flex-col gap-[3px]">
              {week.map((count, d) => (
                <span
                  key={d}
                  title={`${count} contribution${count === 1 ? "" : "s"}`}
                  className={`size-[10px] rounded-[2px] ${LEVELS[level(count, max)]}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 flex items-center gap-1.5">
        <span className="font-mono text-[10px] text-fg-subtle">less</span>
        {LEVELS.map((c) => (
          <span key={c} className={`size-[10px] rounded-[2px] ${c}`} />
        ))}
        <span className="font-mono text-[10px] text-fg-subtle">more</span>
      </div>
    </div>
  );
}
