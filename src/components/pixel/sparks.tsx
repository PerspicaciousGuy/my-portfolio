"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { listen, prefersReducedMotion } from "@/lib/pixel-events";

type Particle = { x: number; y: number; vx: number; vy: number; age: number; life: number; size: number; c: string };

const COLORS = ["#FFC933", "#6BF59A", "#9B7BFF", "#ECECF0", "#FF9DB5", "#62B6FF"];
const MAX = 90;

/**
 * Click sparks: every click throws a handful of square pixels that arc and
 * fade, and the party cheat rains confetti from the top. Particles live in a
 * ref; the component re-renders only while at least one is alive, from one
 * 30 ms timer that stops when the last one fades.
 */
export function Sparks() {
  const [view, setView] = useState<{ style: CSSProperties; key: number }[]>([]);
  const list = useRef<Particle[]>([]);
  const timer = useRef(0);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const step = () => {
      list.current.forEach((p) => {
        p.age++;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35;
      });
      list.current = list.current.filter((p) => p.age < p.life);
      if (!list.current.length) {
        window.clearInterval(timer.current);
        timer.current = 0;
      }
      setView(
        list.current.map((p, key) => ({
          key,
          style: {
            left: Math.round(p.x / 2) * 2,
            top: Math.round(p.y / 2) * 2,
            width: p.size,
            height: p.size,
            background: p.c,
            opacity: Math.max(0, 1 - p.age / p.life),
          },
        })),
      );
    };
    const start = () => {
      if (!timer.current) timer.current = window.setInterval(step, 30);
    };
    const add = (x: number, y: number, vx: number, vy: number, life: number, size: number) => {
      if (list.current.length >= MAX) return;
      list.current.push({ x, y, vx, vy, age: 0, life, size, c: COLORS[Math.floor(Math.random() * COLORS.length)] });
    };

    const onClick = (e: MouseEvent) => {
      const n = 9;
      for (let i = 0; i < n; i++) {
        const a = (Math.PI * 2 * i) / n + Math.random() * 0.5;
        const sp = 2.5 + Math.random() * 3;
        add(e.clientX, e.clientY, Math.cos(a) * sp, Math.sin(a) * sp - 1.5, 16 + Math.random() * 10, 4 + Math.floor(Math.random() * 2) * 2);
      }
      start();
    };
    window.addEventListener("click", onClick);
    const off = listen("px-cheat", (d) => {
      if (d?.name !== "party") return;
      for (let i = 0; i < 46; i++) {
        add(Math.random() * window.innerWidth, -10 - Math.random() * 120, (Math.random() - 0.5) * 2, 2 + Math.random() * 3, 70 + Math.random() * 40, 6);
      }
      start();
    });

    return () => {
      window.removeEventListener("click", onClick);
      window.clearInterval(timer.current);
      timer.current = 0;
      off();
    };
  }, []);

  if (!view.length) return null;
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[9] overflow-hidden">
      {view.map((p) => (
        <i key={p.key} className="absolute" style={p.style} />
      ))}
    </div>
  );
}
