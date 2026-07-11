"use client";

import { useEffect, useState } from "react";

/**
 * Tracks which section is currently in view, for highlighting the nav.
 *
 * The root margin biases the "active" band toward the upper-middle of the
 * viewport, so a section counts as active once its content is what you're
 * actually reading — not the moment its first pixel appears.
 */
export function useActiveSection(ids: string[]): string | null {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry nearest the top of the active band, so overlapping
        // sections don't fight over the highlight.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) =>
              a.boundingClientRect.top - b.boundingClientRect.top,
          );

        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -65% 0px", threshold: 0 },
    );

    sections.forEach((s) => observer.observe(s));

    // At the very top, nothing should be highlighted.
    const onScroll = () => {
      if (window.scrollY < 120) setActive(null);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [ids]);

  return active;
}
