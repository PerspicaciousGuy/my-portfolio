import { ArrowDown, ArrowUpRight } from "lucide-react";
import { site, socials } from "@/data/site";
import { Typewriter } from "@/components/pixel/typewriter";
import { CritterWalker } from "@/components/pixel/critter-walker";

const ROLES = [
  "Full-stack developer",
  "Backend & API engineer",
  "Local-first app builder",
  "Open to work",
] as const;

/** The first screen: name, a typed role line, the actions, and the critter's ground line. */
export function Hero() {
  return (
    <header id="top" className="relative z-[1] border-b-8 border-border">
      <div className="px-wrap pb-[190px] pt-20 sm:pt-28">
        {site.available && (
          <p className="px-label mb-8 inline-flex items-center gap-3 text-[15px] text-green">
            <i className="px-dot" />
            Available for work
          </p>
        )}
        <h1 className="m-0 font-display text-[clamp(56px,9vw,120px)] font-bold uppercase leading-[0.95]">
          {site.name}
        </h1>
        <p className="mt-6 min-h-[42px] font-display text-[26px] font-semibold uppercase tracking-wide text-accent">
          <Typewriter roles={ROLES} />
        </p>
        <p className="mt-6 max-w-[620px] text-[28px] leading-tight text-fg-muted">{site.heroIntro}</p>
        <div className="mt-10 flex flex-wrap items-center">
          <a href="#work" className="px-btn px-btn-primary">
            See my work
            <ArrowDown className="size-4" />
          </a>
          <a href="#contact" className="px-btn px-btn-ghost">
            Get in touch
            <ArrowUpRight className="size-4" />
          </a>
        </div>
        <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-1">
          {socials
            .filter((s) => s.label !== "Email")
            .map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noreferrer" className="px-label inline-flex min-h-11 items-center hover:text-accent">
                  {s.label} ↗
                </a>
              </li>
            ))}
        </ul>
      </div>
      <CritterWalker />
    </header>
  );
}
