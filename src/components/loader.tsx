"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { site } from "@/data/site";

/**
 * Covers the blank flash while fonts and the WebGL scene initialise.
 * Deliberately brief — a loading screen that outstays its welcome is worse
 * than none. Skipped entirely for reduced-motion users.
 */
export function Loader() {
  const [done, setDone] = useState(false);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDone(true);
      return;
    }

    document.body.style.overflow = "hidden";

    const started = performance.now();
    let raf = 0;

    const tick = () => {
      // Ease to 100 over ~1.1s, then hold briefly so it doesn't feel abrupt.
      const t = Math.min((performance.now() - started) / 1100, 1);
      setPct(Math.round((1 - Math.pow(1 - t, 3)) * 100));
      if (t < 1) raf = requestAnimationFrame(tick);
      else setTimeout(() => setDone(true), 180);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (done) document.body.style.overflow = "";
  }, [done]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-bg"
        >
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-semibold tracking-tight sm:text-3xl"
          >
            {site.name}
          </motion.p>

          <div className="mt-6 h-px w-40 overflow-hidden bg-border">
            <motion.div
              className="h-full bg-accent"
              style={{ width: `${pct}%` }}
            />
          </div>

          <p className="mt-4 font-mono text-xs tabular-nums text-fg-subtle">
            {String(pct).padStart(3, "0")}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
