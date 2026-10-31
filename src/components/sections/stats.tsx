import { getGitHubStats, LANG_COLORS } from "@/lib/github";

/** At-a-glance numbers from GitHub, and the language mix. */
export async function Stats() {
  const { repos, yearsShipping, languages, totalContributions } = await getGitHubStats();

  const figures = [
    { value: String(repos), label: "public repos" },
    { value: `${yearsShipping}+`, label: "years shipping" },
    { value: String(languages.length || 6), label: "languages" },
    ...(totalContributions ? [{ value: String(totalContributions), label: "contributions this year" }] : []),
  ];

  return (
    <section aria-label="At a glance" className="relative z-[1] pt-[72px]">
      <div className="px-wrap">
        <div className="px-panel px-reveal">
          <dl className="m-0 flex flex-wrap">
            {figures.map((f, i) => (
              <div
                key={f.label}
                className={`flex-[1_1_220px] px-[30px] py-[26px] ${i < figures.length - 1 ? "border-r-4 border-raised" : ""}`}
              >
                <dd className="m-0 font-display text-[52px] font-bold leading-none text-accent">{f.value}</dd>
                <dt className="px-label mt-2">{f.label}</dt>
              </div>
            ))}
          </dl>
          {languages.length > 0 && (
            <div className="border-t-4 border-raised px-[30px] py-6">
              <p className="px-label m-0">What I actually write</p>
              <div className="mt-4 flex h-3 overflow-hidden">
                {languages.map((l) => (
                  <span
                    key={l.name}
                    title={`${l.name} — ${l.pct.toFixed(1)}%`}
                    style={{ width: `${l.pct}%`, backgroundColor: LANG_COLORS[l.name] ?? LANG_COLORS.Other }}
                  />
                ))}
              </div>
              <ul className="m-0 mt-4 flex list-none flex-wrap gap-x-5 gap-y-1 p-0">
                {languages.map((l) => (
                  <li key={l.name} className="flex items-center gap-2 text-fg-muted">
                    <span className="size-3" style={{ backgroundColor: LANG_COLORS[l.name] ?? LANG_COLORS.Other }} />
                    {l.name}
                    <span className="px-label text-[13px]">{l.pct.toFixed(1)}%</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
