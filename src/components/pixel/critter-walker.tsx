"use client";

import { useEffect, useRef, useState } from "react";
import { CritterBrain, type CritterView } from "@/lib/critter-brain";
import { emit, listen, prefersReducedMotion } from "@/lib/pixel-events";
import { CritterFigure } from "./critter-figure";

const U = 5;
/** The switch sits this far from the right edge of the lane (px). */
const SWITCH_RIGHT = 90;

/**
 * The hero mascot. It owns its timers and listeners and keeps its state in a
 * plain CritterBrain, so moving it re-renders only this component. The tick
 * pauses while the lane is off screen or the tab is hidden.
 */
export function CritterWalker() {
  const laneRef = useRef<HTMLDivElement>(null);
  const brainRef = useRef<CritterBrain | null>(null);
  const [view, setView] = useState<CritterView | null>(null);

  useEffect(() => {
    const lane = laneRef.current;
    if (!lane) return;
    const reduce = prefersReducedMotion();
    const brain = new CritterBrain(U, { lights: (on) => emit("px-lights", { on }) }, reduce, Date.now());
    brainRef.current = brain;

    let last = "";
    const publish = () => {
      const v = brain.view(Date.now());
      const key = JSON.stringify(v);
      if (key !== last) {
        last = key;
        setView(v);
      }
    };
    const geometry = () => {
      const r = lane.getBoundingClientRect();
      return { left: r.left, width: r.width || 1440, bottom: r.bottom };
    };

    let timer = 0;
    let visible = true;
    const run = () => {
      if (timer || !visible || document.hidden || reduce) return;
      timer = window.setInterval(() => {
        brain.tick(Date.now(), geometry());
        publish();
      }, 50);
    };
    const stop = () => {
      window.clearInterval(timer);
      timer = 0;
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) run();
      else stop();
    });
    io.observe(lane);
    const onVisibility = () => (document.hidden ? stop() : run());
    document.addEventListener("visibilitychange", onVisibility);

    const onMove = (e: PointerEvent) => {
      const overButton = !!(e.target as HTMLElement | null)?.closest?.("button");
      brain.pointer(e.clientX, e.clientY, geometry(), overButton, Date.now());
    };
    const onClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (t?.closest?.("a")) {
        brain.linkClick(Date.now());
        publish();
        return;
      }
      if (t?.closest?.("a,button")) return;
      brain.groundClick(e.clientX, e.clientY, geometry(), Date.now());
    };
    let sy = window.scrollY;
    let st = performance.now();
    const onScroll = () => {
      const now = performance.now();
      const y = window.scrollY;
      brain.scrolled(Math.abs(y - sy) / Math.max(1, now - st), Date.now());
      sy = y;
      st = now;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("click", onClick);
    window.addEventListener("scroll", onScroll, { passive: true });
    const offs = [
      listen("px-weather", (d) => brain.weather(!!d?.rain, Date.now())),
      listen("px-plane", () => brain.plane(Date.now())),
      listen("px-ufo", () => brain.ufo(Date.now())),
      listen("px-cheat", (d) => {
        if (d?.name === "party") brain.party(Date.now());
        if (d?.name === "lights") brain.toggleLights(Date.now());
      }),
    ];
    publish();
    run();

    return () => {
      stop();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("click", onClick);
      window.removeEventListener("scroll", onScroll);
      offs.forEach((off) => off());
    };
  }, []);

  const brain = brainRef.current;

  const pet = (e: React.MouseEvent) => {
    e.stopPropagation();
    brain?.pet(Date.now());
  };
  const flipSwitch = (e: React.MouseEvent) => {
    e.stopPropagation();
    const width = laneRef.current?.getBoundingClientRect().width || 1440;
    brain?.gotoSwitch(((width - SWITCH_RIGHT - 15 - 12 * U) / width) * 100, Date.now());
  };

  const v = view;
  return (
    <div
      id="critterlane"
      ref={laneRef}
      className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[150px]"
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-10 bottom-12 h-1.5"
        style={{
          background: "repeating-linear-gradient(90deg, rgb(var(--edge)) 0 48px, transparent 48px 54px)",
        }}
      />
      <p className="px-label absolute bottom-3 left-10 m-0 hidden text-[13px] sm:block">
        &gt; move along the ground, click the critter, click the switch
      </p>
      <button
        type="button"
        onClick={flipSwitch}
        aria-label="Toggle the city lights"
        aria-pressed={!!v?.lights}
        className="pointer-events-auto absolute bottom-[54px] box-border hidden h-11 w-[30px] cursor-pointer border-[3px] border-edge bg-raised shadow-[3px_3px_0_rgb(var(--shade))] sm:block"
        style={{ right: SWITCH_RIGHT }}
      >
        <i
          className="absolute left-[5px] block h-3 w-3.5"
          style={{ top: v?.lights ? 4 : 22, background: v?.lights ? "#FFC933" : "rgb(var(--fg-muted))" }}
        />
      </button>
      <p
        aria-hidden="true"
        className="px-label absolute bottom-3 m-0 hidden text-[13px] sm:block"
        style={{ right: SWITCH_RIGHT - 12 }}
      >
        lights {v?.lights ? "on" : "off"}
      </p>
      {v && (
        <div className="absolute bottom-[54px] h-0 w-0" style={{ left: `${v.cx}%` }}>
          <button
            type="button"
            onClick={pet}
            onMouseEnter={() => {
              if (brain) brain.over = true;
            }}
            onMouseLeave={() => {
              if (brain) brain.over = false;
            }}
            aria-label="Pet the critter"
            className="pointer-events-auto absolute bottom-0 cursor-pointer"
            style={{ left: -13 * U }}
          >
            <CritterFigure
              u={U}
              pose={v.pose}
              step={v.step}
              flip={v.flip}
              wag={v.wag}
              blink={v.blink}
              look={v.look}
              face={v.face}
              arms={v.arms}
              item={v.item}
              itemT={v.itemT}
              squash={v.squash}
              stars={v.stars}
              heart={v.heart}
              lift={v.lift}
              bubble={v.bubble}
              breathe={v.breathe}
              umbrella={v.umbrella}
              zt={v.zt}
            />
          </button>
        </div>
      )}
    </div>
  );
}
