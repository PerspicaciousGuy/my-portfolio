const USER = "PerspicaciousGuy";

const HEADERS: HeadersInit = {
  Accept: "application/vnd.github+json",
  ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
};

/**
 * Contributions per day for the last year, 53 weeks x 7 days. The calendar is
 * GraphQL-only and needs a token: without GITHUB_TOKEN this returns null and
 * the Activity section is simply not rendered. Cached for a day.
 */
export async function getContributionWeeks(): Promise<number[][] | null> {
  if (!process.env.GITHUB_TOKEN) return null;

  const query = `
    query {
      user(login: "${USER}") {
        contributionsCollection {
          contributionCalendar {
            weeks { contributionDays { contributionCount } }
          }
        }
      }
    }`;

  try {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
      next: { revalidate: 86400 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    const cal = json?.data?.user?.contributionsCollection?.contributionCalendar;
    if (!cal) return null;
    return (cal.weeks as { contributionDays: { contributionCount: number }[] }[]).map((w) =>
      w.contributionDays.map((d) => d.contributionCount),
    );
  } catch {
    return null;
  }
}

export type LatestCommit = { repo: string; message: string; date: string };

/**
 * The most recent public push, for the "Live" strip on the homepage. Cached
 * for an hour; returns null when GitHub is unreachable or rate-limited so the
 * strip simply leaves the cell out.
 */
export async function getLatestCommit(): Promise<LatestCommit | null> {
  try {
    const res = await fetch(`https://api.github.com/users/${USER}/events/public?per_page=30`, {
      headers: HEADERS,
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const events = (await res.json()) as {
      type: string;
      created_at: string;
      repo: { name: string };
      payload: { commits?: { message: string }[] };
    }[];
    for (const ev of events) {
      const commits = ev.type === "PushEvent" ? ev.payload.commits : undefined;
      if (commits?.length) {
        const message = commits[commits.length - 1].message.split("\n")[0];
        return { repo: ev.repo.name.split("/").pop() ?? ev.repo.name, message, date: ev.created_at };
      }
    }
    return null;
  } catch {
    return null;
  }
}
