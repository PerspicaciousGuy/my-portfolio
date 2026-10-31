import { hero, site } from "@/data/site";
import { Icon } from "@/components/pixel/icon";
import { Typewriter } from "@/components/pixel/typewriter";
import { CritterWalker } from "@/components/pixel/critter-walker";

const ROLES = ["Full-stack developer", "Backend & API engineer", "Local-first app builder", "Open to work"] as const;

/** The first screen: greeting, name, a typed role line, two actions and the critter's ground line. */
export function Hero() {
  return (
    <header id="top" className="relative z-[1] border-b-8 border-border">
      <div className="px-wrap relative z-[2] flex min-h-[600px] flex-wrap items-start gap-10 pb-[170px] pt-14">
        <div className="min-w-0 flex-1">
          <p className="m-0 mb-5 font-display text-[24px] font-medium uppercase text-violet">{hero.greeting}</p>
          <h1 className="m-0 font-display text-[clamp(56px,8vw,112px)] font-bold uppercase leading-[0.95]">
            I’m Harshit
            <br />
            <span className="text-accent">Bishnoi</span>
          </h1>
          <p className="m-0 mt-7 font-display text-[24px] font-medium uppercase text-green">
            &gt; <Typewriter roles={ROLES} />
          </p>
          <p className="mb-0 mt-3.5 max-w-[560px] text-[30px] leading-[1.15] text-fg-muted">{site.heroIntro}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a href="#work" className="px-btn px-btn-primary">
              View my work
              <Icon name="right" size={24} />
            </a>
            <a href="#contact" className="px-btn px-btn-ghost">
              Contact me
            </a>
          </div>
          <p className="px-label m-0 mt-9 flex items-center gap-3 text-[15px]">
            <span className="block size-3 bg-green" />
            {hero.status}
          </p>
        </div>
      </div>
      <CritterWalker />
    </header>
  );
}
