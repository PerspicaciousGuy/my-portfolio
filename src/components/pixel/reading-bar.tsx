"use client";

import { useEffect, useRef, useState } from "react";
import { Critter } from "./critter";

/**
 * Reading progress along the very top of a post, with the critter walking at
 * the end of it. Its walk cycle advances with the scroll position, so it only
 * moves while you read.
 */
export function ReadingBar() {
  const [p, setP] = useState(0);
  const raf = useRef(0);

  useEffect(() => {
    const measure = () => {
      raf.current = 0;
      const el = document.getElementById("post-body");
      if (!el) return;
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight * 0.6;
      setP(Math.max(0, Math.min(1, (-r.top + window.innerHeight * 0.3) / Math.max(1, total))));
    };
    const onScroll = () => {
      if (!raf.current) raf.current = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  const pct = Math.round(p * 1000) / 10;
  const step = Math.floor(pct * 3) % 4;
  return (
    <div
      role="progressbar"
      aria-label="Reading progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pct)}
      className="sticky top-[64px] z-40 h-[30px] overflow-hidden bg-raised print:hidden md:top-[80px] md:h-[18px] md:overflow-visible"
    >
      <div className="absolute bottom-0 left-0 h-1.5 bg-green md:static md:h-full" style={{ width: `${pct}%` }} />
      {/* Phone: a small critter standing on the green line, inside the band so it never covers the nav. */}
      <div className="pointer-events-none absolute bottom-1.5 md:hidden" style={{ left: `calc(${pct}% - 13px)` }}>
        <Critter u={1} pose="walk" step={step} />
      </div>
      <div className="pointer-events-none absolute -top-[30px] hidden md:block" style={{ left: `calc(${pct}% - 52px)` }}>
        <Critter u={3} pose="walk" step={step} />
      </div>
    </div>
  );
}
