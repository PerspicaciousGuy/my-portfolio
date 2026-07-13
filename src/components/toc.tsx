"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { Heading } from "@/lib/case-studies";
import { NAV_OFFSET, onAnchorClick } from "@/lib/scroll-to";

/**
 * Case-study table of contents. Lives in the left gutter on wide screens,
 * where the fixed-width article leaves dead space anyway, and highlights the
 * section currently in view.
 */
export function Toc({ headings }: { headings: Heading[] }) {
  const [active, setActive] = useState<string>(headings[0]?.id ?? "");

  useEffect(() => {
    if (headings.length === 0) return;

    const nodes = headings
      .map((h) => document.getElementById(h.id))
      .filter((n): n is HTMLElement => n !== null);

    if (nodes.length === 0) return;

    // Driven by scroll rather than IntersectionObserver. An observer only fires
    // on crossings, and scrollToSection parks a heading at exactly NAV_OFFSET —
    // an animated jump can therefore land without ever tripping the observer,
    // leaving the highlight stuck on the section you came from.
    let frame = 0;

    const sync = () => {
      frame = 0;

      // The current section is the last heading that has passed under the nav.
      let current = nodes[0];
      for (const node of nodes) {
        if (node.getBoundingClientRect().top > NAV_OFFSET + 8) break;
        current = node;
      }

      setActive(current.id);
    };

    const onScroll = () => {
      // Coalesce to one read per frame; layout reads in a scroll handler are
      // the classic way to make a page feel sticky.
      if (!frame) frame = requestAnimationFrame(sync);
    };

    sync();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [headings]);

  if (headings.length < 3) return null;

  return (
    <nav
      aria-label="On this page"
      className="sticky top-28 hidden max-h-[calc(100svh-9rem)] overflow-y-auto xl:block"
    >
      <p className="font-mono text-[10px] uppercase tracking-widest text-fg-subtle">
        On this page
      </p>

      <ul className="mt-4 space-y-1">
        {headings.map((h) => {
          const isActive = h.id === active;
          return (
            <li key={h.id} className="relative">
              {isActive && (
                <motion.span
                  layoutId="toc-active"
                  className="absolute inset-y-0 left-0 w-px bg-accent"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <a
                href={`#${h.id}`}
                onClick={onAnchorClick}
                aria-current={isActive ? "location" : undefined}
                className={`block border-l py-1 pl-3 text-[13px] leading-snug transition-colors ${
                  isActive
                    ? "border-transparent text-accent"
                    : "border-border text-fg-subtle hover:text-fg-muted"
                }`}
              >
                {h.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
