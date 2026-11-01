import { getContributionWeeks } from "@/lib/github";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { GitCity } from "@/components/pixel/git-city";

/** Last 52 weeks of GitHub contributions as a city skyline. */
export async function Activity() {
  const weeks = await getContributionWeeks();
  // Without a GITHUB_TOKEN the calendar is unavailable: skip the section rather than show invented numbers.
  if (!weeks) return null;

  const perWeek = weeks.slice(-52).map((w) => w.reduce((a, b) => a + b, 0));
  const monday = new Date();
  monday.setUTCDate(monday.getUTCDate() - 7 * (perWeek.length - 1) - ((monday.getUTCDay() + 6) % 7));

  return (
    <Section id="activity" index="05" title="Activity">
      <Reveal className="px-panel px-7 pb-5 pt-8">
        <GitCity weeks={perWeek} start={monday.toISOString().slice(0, 10)} />
      </Reveal>
    </Section>
  );
}
