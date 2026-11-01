"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type AnimationEvent, type CSSProperties } from "react";
import "@/styles/backdrop.css";
import { FAR, MID, MOON_LINES, NEAR, PLANE_LINES, SUN_LINES, WINDOW_FACTS, hash3, type Building } from "@/data/skyline";
import { emit, listen, prefersReducedMotion } from "@/lib/pixel-events";
import { triggerRain, useWeather } from "@/lib/weather";
import { useTheme } from "@/lib/use-theme";
import { site } from "@/data/site";

const BIRDS = [
  { left: "22%", top: "75%" },
  { left: "24.6%", top: "75%" },
  { left: "27%", top: "75%" },
];

// `follow` makes the bubble ride an element (a plane) instead of staying where it was clicked.
type Tip = { text: string; x: number; y: number; follow?: HTMLElement };
type Hit = { kind: string; el: HTMLElement };

const HIT_ORDER = ["sign", "ufo", "plane", "bird", "moon", "sun", "win"];
const INTERACTIVE = "a,button,input,textarea,select,summary,label,.px-panel,.px-panel-hi,.px-btn,[data-nobd]";

function Skyline({ list, seed, cls }: { list: readonly Building[]; seed: number; cls: string }) {
  return (
    <div className={`px-ly ${cls}`}>
      <div className="px-sky">
        {list.map((b, bi) => (
          <div key={bi} className="px-bld" style={{ width: b[0], height: b[1] }}>
            {b[2].map((w, wi) => (
              <i
                key={wi}
                className="px-win px-hit"
                data-hit="win"
                data-id={`${seed}_${bi}_${wi}`}
                data-f={(bi * 3 + wi) % WINDOW_FACTS.length}
                style={
                  {
                    left: w[0],
                    top: w[1],
                    width: seed === 1 ? 8 : seed === 2 ? 9 : 10,
                    height: seed === 1 ? 8 : seed === 2 ? 9 : 10,
                    // Lit once scroll progress passes this (a negative value is lit from the start).
                    "--t": ((hash3(bi, wi, seed) - 0.15) / 0.85).toFixed(3),
                  } as CSSProperties
                }
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * The page backdrop. Everything that moves per frame is CSS: parallax and
 * window lighting read variables this component writes from a rAF loop that
 * only runs while the pointer or the scroll position is changing.
 *
 * Interactive bits: click a window for a fact about me (it stays lit), the
 * moon, a plane, a bird or the UFO for a line of text. The page sections sit
 * above the backdrop, so those clicks are hit-tested by hand.
 */
export function Backdrop() {
  const { isNight, hour } = useTheme();
  const { rain } = useWeather();
  const rootRef = useRef<HTMLDivElement>(null);
  const [tip, setTip] = useState<Tip | null>(null);
  const [ufo, setUfo] = useState(0);
  const [moonFace, setMoonFace] = useState(false);
  const [fled, setFled] = useState(false);
  const moonClicks = useRef(0);
  const sunClicks = useRef(0);
  const planeClicks = useRef(0);
  const tipRef = useRef<HTMLDivElement>(null);
  const tipTimer = useRef(0);
  const lit = useRef(new Set<string>());

  const say = useCallback((text: string, x: number, y: number, follow?: HTMLElement) => {
    window.clearTimeout(tipTimer.current);
    setTip({ text, x: Math.max(8, Math.min(window.innerWidth - 290, x + 14)), y: Math.max(8, y - 54), follow });
    tipTimer.current = window.setTimeout(() => setTip(null), 3600);
  }, []);

  // A bubble tied to a moving element is repositioned every frame, straight on the DOM node, so the
  // page does not re-render 60 times a second.
  useEffect(() => {
    const target = tip?.follow;
    const box = tipRef.current;
    if (!target || !box) return;
    let raf = 0;
    const track = () => {
      const r = target.getBoundingClientRect();
      const mid = r.left + r.width / 2;
      box.style.left = `${Math.max(143, Math.min(window.innerWidth - 143, mid))}px`;
      box.style.top = `${Math.max(60, r.top - 8)}px`;
      raf = requestAnimationFrame(track);
    };
    track();
    return () => cancelAnimationFrame(raf);
  }, [tip]);

  const startUfo = useCallback(() => {
    setUfo((n) => (n && n % 2 === 1 ? n : n + 1));
    window.setTimeout(() => emit("px-ufo"), 3600);
  }, []);

  // Parallax, scroll progress, hover hit-testing.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduce = prefersReducedMotion();
    let tx = 0;
    let ty = 0;
    let mx = 0;
    let my = 0;
    let raf = 0;
    let scrollRaf = 0;
    let hovered: HTMLElement | null = null;

    const frame = () => {
      mx += (tx - mx) * 0.15;
      my += (ty - my) * 0.15;
      if (Math.abs(tx - mx) < 0.004) mx = tx;
      if (Math.abs(ty - my) < 0.004) my = ty;
      root.style.setProperty("--mx", mx.toFixed(3));
      root.style.setProperty("--my", my.toFixed(3));
      raf = mx !== tx || my !== ty ? requestAnimationFrame(frame) : 0;
    };

    const hitAt = (x: number, y: number): Hit | null => {
      let best: Hit | null = null;
      root.querySelectorAll<HTMLElement>(".px-hit").forEach((el) => {
        const kind = el.dataset.hit ?? "";
        const r = el.getBoundingClientRect();
        if (!r.width) return;
        // The UFO's sign only counts while the beam has lit it.
        if (kind === "sign" && Number(getComputedStyle(el).opacity) < 0.5) return;
        const pad = kind === "win" ? 3 : 8;
        if (x < r.left - pad || x > r.right + pad || y < r.top - pad || y > r.bottom + pad) return;
        if (!best || HIT_ORDER.indexOf(kind) < HIT_ORDER.indexOf(best.kind)) best = { kind, el };
      });
      return best;
    };

    let hoverAt = 0;
    const onMove = (e: PointerEvent) => {
      if (!reduce) {
        tx = (e.clientX / window.innerWidth - 0.5) * 2;
        ty = (e.clientY / window.innerHeight - 0.5) * 2;
        if (!raf) raf = requestAnimationFrame(frame);
      }
      const now = performance.now();
      if (now - hoverAt < 90) return;
      hoverAt = now;
      const target = e.target as HTMLElement | null;
      const over = !target?.closest?.(INTERACTIVE);
      const hit = over ? hitAt(e.clientX, e.clientY) : null;
      const next = hit && (hit.kind === "win" || hit.kind === "sign") ? hit.el : null;
      if (next !== hovered) {
        hovered?.removeAttribute("data-hover");
        next?.setAttribute("data-hover", "");
        hovered = next;
      }
    };

    const onClick = (e: MouseEvent) => {
      // Any click closes the open bubble; a click on another window opens its own below.
      window.clearTimeout(tipTimer.current);
      setTip(null);
      const target = e.target as HTMLElement | null;
      if (target?.closest?.(INTERACTIVE)) return;
      const hit = hitAt(e.clientX, e.clientY);
      if (!hit) return;
      const { kind, el } = hit;
      if (kind === "win") {
        const id = el.dataset.id ?? "";
        lit.current.add(id);
        el.setAttribute("data-on", "");
        say(WINDOW_FACTS[Number(el.dataset.f) % WINDOW_FACTS.length], e.clientX, e.clientY);
      } else if (kind === "moon") {
        // Every third click the moon grows a face; the others walk through its lines.
        moonClicks.current += 1;
        const n = moonClicks.current;
        if (n % 3 === 0) {
          setMoonFace(true);
          window.setTimeout(() => setMoonFace(false), 4000);
          say("Hi. Night shift?", e.clientX, e.clientY);
        } else say(MOON_LINES[(n - Math.floor(n / 3) - 1) % MOON_LINES.length], e.clientX, e.clientY);
      } else if (kind === "sun") {
        say(SUN_LINES[sunClicks.current++ % SUN_LINES.length], e.clientX, e.clientY);
      } else if (kind === "plane") {
        say(PLANE_LINES[planeClicks.current++ % PLANE_LINES.length], e.clientX, e.clientY, el);
      } else if (kind === "bird") {
        setFled(true);
        window.setTimeout(() => setFled(false), 15000);
        say("tweet", e.clientX, e.clientY);
      } else if (kind === "sign") window.location.href = `mailto:${site.email}`;
      else if (kind === "ufo") say("Take me to your hiring manager.", e.clientX, e.clientY);
    };

    const onScroll = () => {
      if (scrollRaf) return;
      scrollRaf = requestAnimationFrame(() => {
        scrollRaf = 0;
        const y = window.scrollY;
        const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        root.style.setProperty("--sy", String(Math.min(y, 1800)));
        root.style.setProperty("--p", Math.min(1, y / max).toFixed(2));
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("click", onClick);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const offLights = listen("px-lights", (d) => {
      if (d?.on) root.setAttribute("data-lights", "on");
      else root.removeAttribute("data-lights");
    });
    let discoTimer = 0;
    const offCheat = listen("px-cheat", (d) => {
      if (d?.name === "party") {
        root.setAttribute("data-disco", "");
        window.clearTimeout(discoTimer);
        discoTimer = window.setTimeout(() => root.removeAttribute("data-disco"), 8000);
      } else if (d?.name === "ufo") startUfo();
      else if (d?.name === "rain") triggerRain(25_000);
    });

    // A UFO visits on about one visit in four, 15 to 90 seconds after load.
    let ufoTimer = 0;
    if (!reduce && Math.random() < 0.25) {
      ufoTimer = window.setTimeout(startUfo, 15_000 + Math.random() * 75_000);
    }

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("click", onClick);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
      cancelAnimationFrame(scrollRaf);
      window.clearTimeout(discoTimer);
      window.clearTimeout(ufoTimer);
      window.clearTimeout(tipTimer.current);
      offLights();
      offCheat();
    };
  }, [say, startUfo]);

  // Sun by day, moon by night, each crossing the sky once.
  const sky = useMemo(() => {
    const dayX = Math.min(1, Math.max(0, (hour - 6.5) / 12));
    const nightX = hour >= 18.5 ? (hour - 18.5) / 11 : (hour + 5.5) / 11;
    const x = isNight ? Math.min(1, Math.max(0, nightX)) : dayX;
    const arc = Math.pow(2 * Math.abs(x - 0.5), 2);
    // Sky layers sit 40 px above the viewport and the nav bar covers the top 85 px, so on screen the
    // arc runs from 130 px at noon down to 320 px at the horizon.
    return { left: `${Math.round(8 + x * 80)}%`, top: Math.round(170 + 190 * arc) };
  }, [hour, isNight]);

  const drops = useMemo(
    () =>
      Array.from({ length: 70 }, (_, i) => ({
        left: `${(hash3(i, 1, 2) * 100).toFixed(1)}%`,
        height: 10 + Math.floor(hash3(i, 7, 8) * 3) * 4,
        d: `${(1.1 + hash3(i, 5, 6) * 0.9).toFixed(2)}s`,
        dl: `-${(hash3(i, 3, 4) * 2).toFixed(2)}s`,
      })),
    [],
  );

  // The blinking wing light animates too, and animation events bubble: only the plane itself counts.
  const onPlane = (e: AnimationEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) emit("px-plane");
  };

  const planeSvg = (
    <svg width="72" height="28" viewBox="0 0 18 7" shapeRendering="crispEdges" aria-hidden="true">
      <path d="M3 3h12v2H3zM14 2h2v1h-2zM5 1h3v2H5zM8 5h3v1H8zM1 2h2v1H1zM15 3h2v1h-2z" />
      <path d="M17 3h1v1h-1zM1 2h1v1H1z" />
    </svg>
  );

  return (
    <>
      <div ref={rootRef} className="px-backdrop" aria-hidden="true">
        <div className="px-ly px-ly-stars">
          <div className="px-stars px-night" />
          <div className="px-stars px-stars-b px-night" />
          <div
            className={`px-moon px-octagon px-night px-hit`}
            data-hit="moon"
            data-face={moonFace ? "" : undefined}
            style={{ left: sky.left, top: sky.top }}
          >
            <i className="px-octagon" />
            <b />
          </div>
          <div className="px-sun px-octagon px-day px-hit" data-hit="sun" style={{ left: sky.left, top: sky.top }} />
          <div className="px-ray px-day" style={{ left: `calc(${sky.left} + 28px)`, top: sky.top + 28 }} />
          <div className="px-shoot px-night" />
        </div>
        <div className="px-ly px-ly-cloud">
          <div className="px-cloud" style={{ left: "6%", top: 150, animationDuration: "70s" }} />
          <div className="px-cloud" style={{ left: "44%", top: 230, animationDuration: "90s", animationDelay: "-30s" }} />
          <div className="px-cloud" style={{ left: "72%", top: 110, animationDuration: "80s", animationDelay: "-50s" }} />
        </div>
        <div
          className="px-plane px-hit"
          data-hit="plane"
          style={{ top: 150 }}
          onAnimationStart={onPlane}
          onAnimationIteration={onPlane}
        >
          {planeSvg}
        </div>
        <div
          className="px-plane px-plane-b px-hit"
          data-hit="plane"
          onAnimationStart={onPlane}
          onAnimationIteration={onPlane}
        >
          {planeSvg}
        </div>
        <Skyline list={FAR} seed={1} cls="px-ly-far" />
        <Skyline list={MID} seed={3} cls="px-ly-mid" />
        <Skyline list={NEAR} seed={2} cls="px-ly-near" />
        {ufo % 2 === 1 && (
          <div
            key={ufo}
            className="px-ufo px-hit"
            data-hit="ufo"
            onAnimationEnd={(e) => {
              if (e.currentTarget === e.target) setUfo((n) => n + 1);
            }}
          >
            <div className="px-beam" />
            <div className="px-sign px-hit" data-hit="sign" aria-hidden="true">
              <b>Psst.</b>
              <span>I&apos;m open to work.</span>
              <i>{site.email}</i>
            </div>
            <svg width="96" height="48" viewBox="0 0 16 8" shapeRendering="crispEdges" style={{ position: "relative", display: "block" }}>
              <path fill="#9FE8FF" d="M5 0h6v1h1v1H4V1h1z" />
              <path fill="#B7BCCB" d="M2 2h12v1h2v1H0V3h2z" />
              <path fill="#6E7488" d="M3 4h10v1H3z" />
              <path fill="#FFC933" d="M3 3h1v1H3zM7 3h2v1H7zM12 3h1v1h-1z" />
              <path fill="#FF5A5A" d="M5 3h1v1H5zM10 3h1v1h-1z" />
            </svg>
          </div>
        )}
        <div className="px-ly px-ly-fg">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 1000 1000"
            preserveAspectRatio="none"
            style={{ position: "absolute", inset: 0 }}
          >
            <g fill="none" stroke="var(--bd-fg)" strokeWidth="7" vectorEffect="non-scaling-stroke">
              <path d="M70 1000V700M30 740H110M40 775H100" vectorEffect="non-scaling-stroke" />
              <path d="M640 1000V680M595 720H685M605 755H675" vectorEffect="non-scaling-stroke" />
            </g>
            <g fill="none" stroke="var(--bd-fg)" strokeWidth="2">
              <path d="M30 740Q350 800 595 720M110 740Q380 785 685 720M100 775Q360 830 605 755" vectorEffect="non-scaling-stroke" />
            </g>
          </svg>
          {BIRDS.map((b, i) => (
            <div
              key={i}
              className="px-bird px-hit"
              data-hit="bird"
              data-flee={fled ? "" : undefined}
              style={{ left: b.left, top: b.top, animationDelay: `${i * 0.25}s` }}
            >
              <svg width="24" height="16" viewBox="0 0 6 4" shapeRendering="crispEdges">
                <path fill="var(--bd-fg)" d="M1 1h4v2H1zM0 0h1v1H0zM5 1h1v1H5z" />
              </svg>
            </div>
          ))}
        </div>
      </div>
      {rain && (
        <div className="px-rain" aria-hidden="true">
          {drops.map((d, i) => (
            <i
              key={i}
              className="px-drop"
              style={{ left: d.left, height: d.height, "--d": d.d, "--dl": d.dl } as CSSProperties}
            />
          ))}
        </div>
      )}
      {tip && (
        <div ref={tipRef} className="px-tip" data-follow={tip.follow ? "" : undefined} role="status" style={{ left: tip.x, top: tip.y }}>
          {tip.text}
        </div>
      )}
    </>
  );
}
