"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * A ring that trails the pointer and swells over interactive elements.
 * Fine-pointer devices only — never shown on touch, where there is no cursor.
 */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 32, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 500, damping: 32, mass: 0.4 });

  useEffect(() => {
    const fine =
      window.matchMedia("(pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine) return;
    setEnabled(true);

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);

      const el = e.target as HTMLElement | null;
      setHovering(Boolean(el?.closest("a, button, [data-cursor]")));
    };

    const leave = () => setVisible(false);

    window.addEventListener("mousemove", move);
    document.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseleave", leave);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <>
      {/* the ring */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-50 rounded-full border border-accent mix-blend-difference"
        style={{ x: sx, y: sy }}
        animate={{
          width: hovering ? 44 : 24,
          height: hovering ? 44 : 24,
          opacity: visible ? (hovering ? 0.9 : 0.55) : 0,
          translateX: hovering ? -22 : -12,
          translateY: hovering ? -22 : -12,
        }}
        transition={{ type: "spring", stiffness: 420, damping: 28 }}
      />
      {/* the dot, unsprung so it stays exactly under the pointer */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-50 size-1 rounded-full bg-accent"
        style={{ x, y, translateX: -2, translateY: -2 }}
        animate={{ opacity: visible && !hovering ? 0.9 : 0 }}
        transition={{ duration: 0.15 }}
      />
    </>
  );
}
