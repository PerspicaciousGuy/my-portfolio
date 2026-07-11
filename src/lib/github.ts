import { site } from "@/data/site";

const USER = "PerspicaciousGuy";

/**
 * GitHub account creation. Derived from this rather than from the oldest
 * surviving repo, which undercounts as soon as an early repo is deleted.
 */
const SHIPPING_SINCE = new Date("2023-08-10");

function yearsSince(from: Date) {
  const years = (Date.now() - from.getTime()) / (365.25 * 24 * 3600 * 1000);
  return Math.max(1, Math.floor(years));
}

export type LanguageSlice = { name: string; bytes: number; pct: number };

export type GitHubStats = {
  repos: number;
  yearsShipping: number;
  languages: LanguageSlice[];
  totalContributions: number | null;
  /** 53 weeks x 7 days of contribution counts, or null without a token. */
  weeks: number[][] | null;
};

const HEADERS: HeadersInit = {
  Accept: "application/vnd.github+json",
  ...(process.env.GITHUB_TOKEN
    ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
    : {}),
};

/** Colours roughly matching GitHub's linguist, for the language bar. */
export const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572a5",
  CSS: "#663399",
  HTML: "#e34c26",
  Dockerfile: "#384d54",
  Shell: "#89e051",
  Other: "#8b8b96",
};

async function fetchLanguages(repos: { name: string; fork: boolean }[]) {
  const totals: Record<string, number> = {};

  const results = await Promise.all(
    repos
      .filter((r) => !r.fork)
      .map(async (r) => {
        const res = await fetch(
          `https://api.github.com/repos/${USER}/${r.name}/languages`,
          { headers: HEADERS, next: { revalidate: 86400 } },
        );
        if (!res.ok) return {};
        return (await res.json()) as Record<string, number>;
      }),
  );

  for (const langs of results) {
    for (const [name, bytes] of Object.entries(langs)) {
      totals[name] = (totals[name] ?? 0) + bytes;
    }
  }

  const sum = Object.values(totals).reduce((a, b) => a + b, 0);
  if (!sum) return [];

  const sorted = Object.entries(totals)
    .map(([name, bytes]) => ({ name, bytes, pct: (bytes / sum) * 100 }))
    .sort((a, b) => b.bytes - a.bytes);

  // Keep the top 5, roll the tail into "Other" so the bar stays legible.
  const top = sorted.slice(0, 5);
  const restPct = sorted.slice(5).reduce((a, b) => a + b.pct, 0);
  if (restPct > 0.5) {
    top.push({ name: "Other", bytes: 0, pct: restPct });
  }
  return top;
}

/**
 * The contribution calendar is GraphQL-only and needs a token.
 * Without GITHUB_TOKEN we return null and the heatmap simply isn't rendered.
 */
async function fetchContributions() {
  if (!process.env.GITHUB_TOKEN) return { total: null, weeks: null };

  const query = `
    query {
      user(login: "${USER}") {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks { contributionDays { contributionCount } }
          }
        }
      }
    }`;

  try {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
      next: { revalidate: 86400 },
    });
    if (!res.ok) return { total: null, weeks: null };

    const json = await res.json();
    const cal =
      json?.data?.user?.contributionsCollection?.contributionCalendar;
    if (!cal) return { total: null, weeks: null };

    return {
      total: cal.totalContributions as number,
      weeks: (cal.weeks as { contributionDays: { contributionCount: number }[] }[])
        .map((w) => w.contributionDays.map((d) => d.contributionCount)),
    };
  } catch {
    return { total: null, weeks: null };
  }
}

/** Cached for a day — the numbers don't move fast and the API is rate-limited. */
export async function getGitHubStats(): Promise<GitHubStats> {
  const fallback: GitHubStats = {
    repos: 14,
    yearsShipping: yearsSince(SHIPPING_SINCE),
    languages: [],
    totalContributions: null,
    weeks: null,
  };

  try {
    const res = await fetch(
      `https://api.github.com/users/${USER}/repos?per_page=100`,
      { headers: HEADERS, next: { revalidate: 86400 } },
    );
    if (!res.ok) return fallback;

    const repos = (await res.json()) as { name: string; fork: boolean }[];
    const owned = repos.filter((r) => !r.fork);

    const [languages, contributions] = await Promise.all([
      fetchLanguages(repos),
      fetchContributions(),
    ]);

    return {
      repos: owned.length,
      yearsShipping: yearsSince(SHIPPING_SINCE),
      languages,
      totalContributions: contributions.total,
      weeks: contributions.weeks,
    };
  } catch {
    return fallback;
  }
}

export const githubUrl = `https://github.com/${USER}`;
export { site };
