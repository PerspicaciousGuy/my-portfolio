"use client";

import { useEffect, useState } from "react";

/**
 * The index of the chapter the reader is in: the last section whose top has
 * scrolled past the upper third of the viewport. -1 before the first one.
 * Listens to scroll in a rAF-throttled handler and re-renders only when the
 * index changes.
 */
export function useActiveChapter(ids: string[]) {
  const [active, setActive] = useState(-1);

  useEffect(() => {
    let raf = 0;
    const measure = () => {
      raf = 0;
      const line = window.innerHeight / 3;
      let found = -1;
      ids.forEach((id, i) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) found = i;
      });
      setActive(found);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
    // ids is a fresh array each render of the parent; join it so the effect only re-runs when it really changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join("|")]);

  return active;
}
