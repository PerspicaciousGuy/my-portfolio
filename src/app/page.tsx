import { Backdrop } from "@/components/backdrop";
import { Cursor } from "@/components/cursor";
import { Loader } from "@/components/loader";
import { ScrollProgress } from "@/components/scroll-progress";
import { Terminal } from "@/components/terminal";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/sections/hero";
import { Stats } from "@/components/sections/stats";
import { About } from "@/components/sections/about";
import { Skills } from "@/components/sections/skills";
import { Journey } from "@/components/sections/journey";
import { Work } from "@/components/sections/work";
import { Writing } from "@/components/sections/writing";
import { Contact } from "@/components/sections/contact";

export default function Home() {
  return (
    <>
      <Loader />
      <Backdrop />
      <div className="grain-overlay" aria-hidden="true" />
      <ScrollProgress />
      <Cursor />
      <Terminal />
      <Nav />
      <main className="flex-1">
        <Hero />
        <Stats />
        <About />
        <Skills />
        <Journey />
        <Work />
        <Writing />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
