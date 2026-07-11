import { Backdrop } from "@/components/backdrop";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Skills } from "@/components/sections/skills";
import { Journey } from "@/components/sections/journey";
import { Work } from "@/components/sections/work";
import { Contact } from "@/components/sections/contact";

export default function Home() {
  return (
    <>
      <Backdrop />
      <div className="grain-overlay" aria-hidden="true" />
      <Nav />
      <main className="flex-1">
        <Hero />
        <About />
        <Skills />
        <Journey />
        <Work />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
