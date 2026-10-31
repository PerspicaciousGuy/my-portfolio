import { Footer } from "@/components/footer";
import { Hero } from "@/components/sections/hero";
import { NowStrip } from "@/components/sections/now-strip";
import { Stats } from "@/components/sections/stats";
import { About } from "@/components/sections/about";
import { Skills } from "@/components/sections/skills";
import { Journey } from "@/components/sections/journey";
import { Work } from "@/components/sections/work";
import { Writing } from "@/components/sections/writing";
import { Activity } from "@/components/sections/activity";
import { Contact } from "@/components/sections/contact";
import { getGitHubStats } from "@/lib/github";

export default async function Home() {
  // The Activity section needs a GitHub token; Contact's number follows from whether it renders.
  const { weeks } = await getGitHubStats();

  return (
    <>
      <main className="flex-1">
        <Hero />
        <NowStrip />
        <Stats />
        <About />
        <Skills />
        <Work />
        <Journey />
        <Writing />
        {weeks && <Activity />}
        <Contact index={weeks ? "07" : "06"} />
      </main>
      <Footer />
    </>
  );
}
