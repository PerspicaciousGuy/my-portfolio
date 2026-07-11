import { getGitHubStats, LANG_COLORS } from "@/lib/github";
import { Reveal } from "@/components/ui/reveal";
import { Heatmap } from "@/components/heatmap";

export async function Stats() {
  const { repos, yearsShipping, languages, totalContributions, weeks } =
    await getGitHubStats();

  const figures = [
    { value: String(repos), label: "public repos" },
    { value: `${yearsShipping}+`, label: "years shipping" },
    { value: String(languages.length || 6), label: "languages" },
    ...(totalContributions
      ? [{ value: String(totalContributions), label: "contributions this year" }]
      : []),
  ];

  return (
    <section className="relative mx-auto w-full max-w-5xl px-6">
      <Reveal>
        <div className="overflow-hidden rounded-2xl border border-border bg-bg-elevated/60 backdrop-blur">
          <dl className="grid divide-y divide-border sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
            {figures.map((f) => (
              <div key={f.label} className="p-6">
                <dt className="font-mono text-xs uppercase tracking-widest text-fg-subtle">
                  {f.label}
                </dt>
                <dd className="mt-1.5 text-3xl font-semibold tracking-tight">
                  {f.value}
                </dd>
              </div>
            ))}
          </dl>

          {languages.length > 0 && (
            <div className="border-t border-border p-6">
              <p className="font-mono text-xs uppercase tracking-widest text-fg-subtle">
                What I actually write
              </p>

              <div className="mt-4 flex h-2 overflow-hidden rounded-full">
                {languages.map((l) => (
                  <span
                    key={l.name}
                    title={`${l.name} — ${l.pct.toFixed(1)}%`}
                    style={{
                      width: `${l.pct}%`,
                      backgroundColor: LANG_COLORS[l.name] ?? LANG_COLORS.Other,
                    }}
                  />
                ))}
              </div>

              <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                {languages.map((l) => (
                  <li
                    key={l.name}
                    className="flex items-center gap-2 text-sm text-fg-muted"
                  >
                    <span
                      className="size-2 rounded-full"
                      style={{
                        backgroundColor:
                          LANG_COLORS[l.name] ?? LANG_COLORS.Other,
                      }}
                    />
                    {l.name}
                    <span className="font-mono text-xs text-fg-subtle">
                      {l.pct.toFixed(1)}%
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {weeks && <Heatmap weeks={weeks} />}
        </div>
      </Reveal>
    </section>
  );
}
