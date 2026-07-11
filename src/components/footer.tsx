import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { navLinks, site, socials } from "@/data/site";

export function Footer() {
  const links = socials.filter((s) => s.label !== "Email");

  return (
    <footer className="relative border-t border-border">
      <div className="mx-auto max-w-5xl px-6 py-14">
        <div className="grid gap-10 sm:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <p className="font-mono text-sm font-medium">
              {site.shortName.toLowerCase()}
              <span className="text-accent">.</span>
            </p>
            <p className="mt-3 max-w-xs text-pretty text-sm leading-relaxed text-fg-muted">
              {site.role} in {site.location}. Currently open to work.
            </p>
            <a
              href={`mailto:${site.email}`}
              className="mt-4 inline-block text-sm text-fg-muted transition hover:text-accent"
            >
              {site.email}
            </a>
          </div>

          <nav aria-label="Footer">
            <h2 className="font-mono text-xs uppercase tracking-widest text-fg-subtle">
              Navigate
            </h2>
            <ul className="mt-4 space-y-2">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-fg-muted transition hover:text-accent"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/resume"
                  className="text-sm text-fg-muted transition hover:text-accent"
                >
                  Résumé
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <h2 className="font-mono text-xs uppercase tracking-widest text-fg-subtle">
              Elsewhere
            </h2>
            <ul className="mt-4 space-y-2">
              {links.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex items-center gap-1 text-sm text-fg-muted transition hover:text-accent"
                  >
                    {s.label}
                    <ArrowUpRight className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-xs text-fg-subtle">
            © {new Date().getFullYear()} {site.name}
          </p>
          <p className="font-mono text-xs text-fg-subtle">
            Built with ❤️ &amp; too much coffee
          </p>
        </div>
      </div>
    </footer>
  );
}
