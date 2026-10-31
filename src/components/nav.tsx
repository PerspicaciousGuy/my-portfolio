import Link from "next/link";
import { navLinks } from "@/data/site";
import { ThemeToggle } from "./theme-toggle";
import { RainToggle } from "./pixel/rain-toggle";

/** Sticky header: logo, section links, résumé, and the theme and weather toggles. */
export function Nav() {
  return (
    <div className="sticky top-0 z-40 border-b-4 border-border bg-bg print:hidden">
      <div className="px-wrap flex min-h-[76px] flex-wrap items-center justify-between gap-x-6 gap-y-1 py-1">
        <Link
          href="/"
          aria-label="Harshit Bishnoi, home"
          className="font-display text-[38px] font-bold leading-none text-accent"
        >
          HB
        </Link>
        <nav aria-label="Primary" className="order-last flex w-full flex-wrap items-center gap-x-5 lg:order-none lg:w-auto lg:gap-x-[26px]">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="px-label inline-flex min-h-11 items-center px-1 text-[17px] font-medium text-fg hover:text-accent hover:shadow-[0_4px_0_rgb(var(--accent))]"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/resume" className="px-btn px-btn-ghost px-btn-sm" style={{ margin: "4px 8px 4px 4px" }}>
            Résumé
          </Link>
          <ThemeToggle />
          <RainToggle />
        </div>
      </div>
    </div>
  );
}
