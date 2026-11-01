import Link from "next/link";
import { navLinks } from "@/data/site";
import { ThemeToggle } from "./theme-toggle";
import { WeatherToggle } from "./pixel/weather-toggle";
import { MobileMenu } from "./mobile-menu";

/**
 * Sticky header: logo, section links, résumé, and the theme and weather toggles.
 * Below `md` the links and résumé move into the MENU sheet so the bar stays one 60px row.
 */
export function Nav() {
  return (
    <div className="sticky top-0 z-40 border-b-4 border-border bg-bg print:hidden">
      <div className="px-wrap flex min-h-[60px] flex-wrap items-center justify-between gap-x-6 gap-y-1 py-1 md:min-h-[76px]">
        <Link
          href="/"
          aria-label="Harshit Bishnoi, home"
          className="font-display text-[34px] font-bold leading-none text-accent md:text-[38px]"
        >
          HB
        </Link>
        <nav aria-label="Primary" className="order-last hidden w-full flex-wrap items-center gap-x-5 md:flex lg:order-none lg:w-auto lg:gap-x-[26px]">
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
        <div className="flex items-center gap-0.5 md:gap-3">
          <Link href="/resume" className="px-btn px-btn-ghost px-btn-sm hidden md:inline-flex" style={{ margin: "4px 8px 4px 4px" }}>
            Résumé
          </Link>
          <ThemeToggle />
          <WeatherToggle />
          <MobileMenu />
        </div>
      </div>
    </div>
  );
}
