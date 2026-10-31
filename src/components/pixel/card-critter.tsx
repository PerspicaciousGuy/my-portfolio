"use client";

import { useEffect, useId, useRef, useState } from "react";
import { listen, prefersReducedMotion } from "@/lib/pixel-events";
import type { Arms, Face, Item } from "@/lib/critter-sprite";
import { CritterFigure } from "./critter-figure";

export type CardJob = "none" | "laptop" | "coffee" | "drop";

type Props = {
  /** The id of the card this critter sits on. */
  target: string;
  job?: CardJob;
  /** Offsets this critter's blinking and waving from its neighbours. */
  phase?: number;
};

const U = 3;

/**
 * A small critter that sits on top of a project card and has a job:
 * laptop (types while you read), coffee (sips), drop (catches raindrops when
 * it rains; the others open an umbrella) or none. It looks toward the
 * pointer, hops and says "hi!" while the pointer is over the card, waves at
 * planes and cheers for the party cheat. The timer pauses off screen.
 */
export function CardCritter({ target, job = "none", phase = 0 }: Props) {
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);
  const [flip, setFlip] = useState(1);
  const [hover, setHover] = useState(false);
  const [rain, setRain] = useState(false);
  const [t, setT] = useState(0);
  const [w, setW] = useState({ from: 0, to: 0, party: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = prefersReducedMotion();
    let moved = 0;
    const onMove = (e: PointerEvent) => {
      const now = performance.now();
      if (now - moved < 100) return;
      moved = now;
      const r = el.getBoundingClientRect();
      setFlip(e.clientX >= r.left + r.width / 2 ? 1 : -1);
      const card = document.getElementById(target);
      if (card) {
        const c = card.getBoundingClientRect();
        setHover(e.clientX >= c.left && e.clientX <= c.right && e.clientY >= c.top - 60 && e.clientY <= c.bottom);
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    const offs = [
      listen("px-weather", (d) => setRain(!!d?.rain)),
      // A plane passed: wave for 3 s, each critter starting a beat after the previous one.
      listen("px-plane", () => {
        const now = Math.floor(Date.now() / 250);
        setW((prev) => ({ ...prev, from: now + phase, to: now + phase + 12 }));
      }),
      listen("px-cheat", (d) => {
        if (d?.name === "party") setW((prev) => ({ ...prev, party: Math.floor(Date.now() / 250) + 24 }));
      }),
    ];

    let timer = 0;
    const run = () => {
      if (timer || reduce || document.hidden) return;
      timer = window.setInterval(() => setT(Math.floor(Date.now() / 250)), 250);
    };
    const stop = () => {
      window.clearInterval(timer);
      timer = 0;
    };
    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? run() : stop()));
    io.observe(el);
    const onVis = () => (document.hidden ? stop() : run());
    document.addEventListener("visibilitychange", onVis);

    return () => {
      stop();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointermove", onMove);
      offs.forEach((off) => off());
    };
  }, [target, phase]);

  let face: Face = "auto";
  let arms: Arms = "none";
  let item: Item = "none";
  let itemT = 0;
  let drop = 0;
  let lift = 0;
  let bubble = "";
  let umbrella = false;

  if (t < w.party) {
    face = "happy";
    arms = "up";
    lift = t % 2 ? 3 : 0;
  } else if (hover) {
    face = "happy";
    lift = t % 2 === 0 ? 2 : 0;
    bubble = "hi!";
  } else if (t >= w.from && t < w.to) {
    face = "happy";
    arms = t % 2 ? "wave2" : "wave1";
  } else if (rain && job === "drop") {
    face = "surprised";
    drop = 8 - ((t + phase) % 8);
  } else if (rain) {
    umbrella = true;
  } else if (job === "laptop") {
    item = "laptop";
    face = "down";
    itemT = t % 2;
  } else if (job === "coffee") {
    item = "coffee";
    face = "happy";
    itemT = Math.floor(t / 2) % 2;
  }

  return (
    <div ref={ref} id={id} style={{ position: "relative", width: 26 * U, height: 17 * U, pointerEvents: "none" }}>
      <CritterFigure
        u={U}
        flip={flip}
        wag={Math.floor((t + phase) / 2) % 2 === 1}
        blink={(t + phase * 5) % 14 === 0}
        look={hover ? "up" : "side"}
        face={face}
        arms={arms}
        item={item}
        itemT={itemT}
        drop={drop}
        lift={lift}
        bubble={bubble}
        umbrella={umbrella}
      />
    </div>
  );
}
