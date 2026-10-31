import { site } from "@/data/site";
import { Road } from "@/components/pixel/road";

/** The small print, and below it the street the page ends on. */
export function Footer() {
  return (
    <footer className="relative z-[1] mt-[120px] border-t-8 border-border">
      <div className="px-wrap flex flex-wrap items-center justify-between gap-3 pb-10 pt-8">
        <span className="px-label">
          © {new Date().getFullYear()} {site.name}
        </span>
        <a href="#top" className="px-label inline-flex min-h-11 items-center hover:text-accent">
          Back to top ↑
        </a>
      </div>
      <Road />
    </footer>
  );
}
