"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/pixel-events";
import { hash } from "@/lib/hash";
import { CritterFigure } from "./critter-figure";

const U = 5;
const GRAV = 0.3; // art pixels per tick squared
const JUMP = 3.3; // initial upward speed: a jump peaks at about 18 art px = 90 px
const CX = 140; // critter left edge, px
const KINDS = {
  cone: { w: 40, h: 50, vb: "0 0 8 10", dark: "M3 0h2v1H3zM2 1h4v1H2zM2 2h1v1H2zM5 2h1v1H5zM1 3h6v1H1zM0 8h8v2H0z", fill: "M3 1h2v1H3zM3 2h2v1H3zM2 4h4v1H2zM2 5h4v3H2z", col: "#FF7A45", white: "M3 3h2v1H3zM2 6h4v1H2z" },
  crate: { w: 50, h: 50, vb: "0 0 10 10", dark: "M0 0h10v10H0z", fill: "M1 1h8v8H1z", col: "#B88A4A", white: "M1 1h1v1H1zM8 8h1v1H8zM2 2h1v1H2zM7 7h1v1H7z" },
} as const;
type Kind = keyof typeof KINDS;
type Obstacle = { x: number; kind: Kind };

/**
 * The 404 page as a small game: the critter runs along the road, Space / Enter
 * / a click jumps, cones and crates come at it, and the score is the distance.
 * Its own 40 ms timer runs only during a game; reduced motion leaves a still scene.
 */
export function NotFoundGame() {
  const laneRef = useRef<HTMLDivElement>(null);
  const timer = useRef(0);
  const g = useRef({ y: 0, vy: 0, obs: [] as Obstacle[], tick: 0, next: 40, over: false, started: false });
  const [view, setView] = useState({ y: 0, obs: [] as Obstacle[], score: 0, best: 0, over: false, started: false, f: 0 });

  const stop = () => {
    window.clearInterval(timer.current);
    timer.current = 0;
  };

  const press = useCallback(() => {
    if (prefersReducedMotion()) return;
    const s = g.current;
    if (s.over || !s.started) {
      Object.assign(s, { y: 0, vy: JUMP, obs: [], tick: 0, next: 40, over: false, started: true });
      stop();
      timer.current = window.setInterval(() => {
        s.tick++;
        s.y += s.vy;
        s.vy -= GRAV;
        if (s.y <= 0) {
          s.y = 0;
          s.vy = 0;
        }
        const speed = 9 + Math.min(6, s.tick / 150);
        const width = laneRef.current?.clientWidth || 1000;
        s.obs = s.obs.map((o) => ({ ...o, x: o.x - speed })).filter((o) => o.x > -80);
        if (--s.next <= 0) {
          s.obs.push({ x: width + 60, kind: hash(s.tick) > 0.5 ? "cone" : "crate" });
          s.next = 28 + Math.floor(hash(s.tick + 5) * 30);
        }
        // The critter's body spans about x 40..95 of its 130 px sprite; obstacles hurt while its feet are lower than they are tall.
        const hit = s.obs.some((o) => o.x < CX + 95 && o.x + KINDS[o.kind].w - 8 > CX + 40 && s.y * U < KINDS[o.kind].h - 8);
        const score = Math.floor(s.tick / 3);
        if (hit) {
          s.over = true;
          stop();
        }
        setView((v) => ({ y: s.y, obs: s.obs, score, best: hit ? Math.max(v.best, score) : v.best, over: s.over, started: true, f: s.tick }));
      }, 40);
      return;
    }
    if (s.y === 0) s.vy = JUMP;
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return;
      if (e.code === "Space") {
        e.preventDefault();
        press();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      stop();
    };
  }, [press]);

  const running = view.started && !view.over;
  const pad = (n: number) => String(n).padStart(5, "0");

  return (
    <div className="relative">
      <div className="px-label absolute left-0 top-0 leading-relaxed text-[18px]">
        <div className="text-fg">score {pad(view.score)}</div>
        <div>best {pad(view.best)}</div>
      </div>
      <div ref={laneRef} className="relative h-[200px] overflow-hidden">
        <button
          type="button"
          onClick={press}
          aria-label="Game: press space or click to jump"
          className="absolute inset-0 z-[1] cursor-pointer bg-transparent"
        />
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[58px] border-t-8 border-border" style={{ background: "var(--rd-road, #23252d)" }} />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-[10px] h-1.5"
          style={{ background: "repeating-linear-gradient(90deg, #ffc933 0 36px, transparent 36px 72px)" }}
        />
        {view.obs.map((o, i) => {
          const k = KINDS[o.kind];
          return (
            <svg
              key={i}
              aria-hidden="true"
              width={k.w}
              height={k.h}
              viewBox={k.vb}
              shapeRendering="crispEdges"
              className="pointer-events-none absolute bottom-[58px]"
              style={{ left: Math.round(o.x) }}
            >
              <path fill="#15161B" d={k.dark} />
              <path fill={k.col} d={k.fill} />
              <path fill="#F4F1EA" d={k.white} />
            </svg>
          );
        })}
        <div className="pointer-events-none absolute bottom-[58px]" style={{ left: CX - 13 * U }}>
          <CritterFigure
            u={U}
            pose={running && view.y === 0 ? "run" : "stand"}
            step={Math.floor(view.f / 2) % 4}
            face={view.over ? "dizzy" : view.y > 0 ? "surprised" : "auto"}
            stars={view.over ? 1 + (view.f % 4) : 0}
            arms={view.y > 4 ? "up" : "none"}
            lift={view.y}
            bubble={view.over ? "404" : ""}
          />
        </div>
      </div>
      <p aria-live="polite" className="px-label m-0 mt-3 text-center text-[17px]">
        {view.over ? "Ouch. Press space to run again" : view.started ? "Space or click to jump" : "Press space or click to start"}
      </p>
    </div>
  );
}
