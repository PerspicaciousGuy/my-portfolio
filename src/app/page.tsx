import { Footer } from "@/components/footer";
import { Hero } from "@/components/sections/hero";
import { NowStrip } from "@/components/sections/now-strip";
import { Stats } from "@/components/sections/stats";
import { About } from "@/components/sections/about";
import { Skills } from "@/components/sections/skills";
import { Work } from "@/components/sections/work";
import { Writing } from "@/components/sections/writing";
import { Activity } from "@/components/sections/activity";
import { Contact } from "@/components/sections/contact";
import { getContributionWeeks } from "@/lib/github";

export default async function Home() {
  // The Activity section needs a GitHub token; Contact's number follows from whether it renders.
  const weeks = await getContributionWeeks();

  return (
    <>
      <main className="flex-1">
        <Hero />
        <NowStrip />
        <Stats />
        <About />
        <Skills />
        <Work />
        <Writing />
        {weeks && <Activity />}
        <Contact index={weeks ? "06" : "05"} />
      </main>
      <Footer />
    </>
  );
}
