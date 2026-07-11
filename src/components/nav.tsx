"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { navLinks, site } from "@/data/site";
import { onAnchorClick } from "@/lib/scroll-to";
import { useActiveSection } from "@/lib/use-active-section";
import { ThemeToggle } from "./theme-toggle";
import { CommandPalette } from "./command-palette";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  // Only the in-page links can be "active" — /blog is a separate route.
  const sectionIds = useMemo(
    () =>
      navLinks
        .filter((l) => l.href.startsWith("/#"))
        .map((l) => l.href.slice(2)),
    [],
  );
  const active = useActiveSection(sectionIds);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        scrolled
          ? "border-b border-border bg-bg/70 backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <a
          href="/"
          onClick={onAnchorClick}
          className="font-mono text-sm font-medium tracking-tight transition-colors hover:text-accent"
        >
          {site.shortName.toLowerCase()}
          <span className="text-accent">.</span>
        </a>

        <div className="flex items-center gap-4">
          <ul className="hidden items-center gap-6 lg:flex">
            {navLinks.map((l) => {
              const isActive = l.href === `/#${active}`;
              return (
                <li key={l.href} className="relative">
                  <a
                    href={l.href}
                    onClick={onAnchorClick}
                    aria-current={isActive ? "true" : undefined}
                    className={`text-sm transition-colors ${
                      isActive ? "text-fg" : "text-fg-muted hover:text-fg"
                    }`}
                  >
                    {l.label}
                  </a>
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute -bottom-1.5 left-0 h-px w-full bg-accent"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </li>
              );
            })}
          </ul>

          <a
            href="/resume"
            className="hidden rounded-full border border-border bg-bg-elevated/60 px-3.5 py-1.5 text-xs font-medium backdrop-blur transition hover:border-accent/50 hover:text-accent sm:inline-flex"
          >
            Résumé
          </a>

          <CommandPalette />
          <ThemeToggle />
        </div>
      </nav>
    </motion.header>
  );
}
