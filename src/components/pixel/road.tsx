import "@/styles/road.css";
import { hash } from "@/lib/hash";
import { Car } from "./car";

type Row = { w: number; h: number; sh: string };

/** Widths and heights from a hash, so the skyline is the same on every build. */
function makeRow(seed: number, minW: number, maxW: number, minH: number, maxH: number, back: boolean): Row[] {
  const out: Row[] = [];
  for (let i = 0, x = 0; x < 1900; i++) {
    const w = minW + Math.floor(hash(seed + i) * ((maxW - minW) / 12 + 1)) * 12;
    const h = minH + Math.floor(hash(seed + i + 200) * ((maxH - minH) / 20 + 1)) * 20;
    // One box-shadow draws every window. Lit windows use --rd-lit, which is
    // yellow at night and the same grey as the rest in the day.
    const cols = Math.floor((w - 8) / 16);
    const rows = Math.floor((h - 14) / 22);
    const wins: string[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const lit = hash(seed * 7 + i * 31 + r * 7 + c * 3) < 0.5;
        wins.push(`${42 + c * 16}px ${40 + r * 22}px 0 0 var(${lit ? "--rd-lit" : back ? "--rd-off-back" : "--rd-off"})`);
      }
    }
    out.push({ w, h, sh: wins.join(",") || "0 0 0 0 transparent" });
    x += w;
  }
  return out;
}

const BACK = makeRow(3, 84, 156, 130, 240, true);
const FRONT = makeRow(91, 72, 132, 70, 150, false);

// Lane 0 drives right, lane 1 drives left; one speed per lane, so nobody overtakes.
const CARS = [
  { lane: 0, off: 0.0, kind: "sedan", body: "#9B7BFF" },
  { lane: 0, off: 0.44, kind: "bus", body: "#2B6CE0" },
  { lane: 0, off: 0.88, kind: "sedan", body: "#FFC933" },
  { lane: 1, off: 0.2, kind: "van", body: "#F4F1EA" },
  { lane: 1, off: 0.62, kind: "sedan", body: "#E5484D" },
  { lane: 1, off: 1.04, kind: "sedan", body: "#6BF59A" },
] as const;
const SPEED = [0.055, 0.075]; // screen widths per second
const LEN = 1.3;

/**
 * The end of the page is the ground: two rows of buildings standing on the
 * pavement, lamps that light at night, and a road with cars that honk when
 * clicked. Server-rendered; only the cars' honk is client code.
 */
export function Road() {
  return (
    <div className="rd">
      <div className="rd-city" aria-hidden="true">
        {[BACK, FRONT].map((row, k) => (
          <div key={k} className="rd-row">
            {row.map((b, i) => (
              <div key={i} className="rd-bld" style={{ width: b.w, height: b.h, background: k ? "var(--rd-front)" : "var(--rd-back)" }}>
                <i style={{ boxShadow: b.sh }} />
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="rd-ground">
        {[7, 31, 55, 79].map((x) => (
          <div key={x} className="rd-lamp" aria-hidden="true" style={{ left: `${x}%` }}>
            <b style={{ left: -3, bottom: 0, width: 6, height: 74 }} />
            <b style={{ left: -3, bottom: 68, width: 30, height: 6 }} />
            <b style={{ left: 18, bottom: 60, width: 16, height: 8, background: "var(--rd-lamp)" }} />
            <span className="rd-glow" />
          </div>
        ))}
        <div className="rd-walk" aria-hidden="true" />
        <div className="rd-road" aria-hidden="true" />
        <div className="rd-line" aria-hidden="true" />
        <div className="rd-cross" aria-hidden="true" />
        <a href="#top" className="rd-sign" aria-label="Back to top">
          <b style={{ display: "block", width: 6, height: 46, marginLeft: 44, background: "var(--rd-pole)" }} />
          <span>↑ Top · 0 km</span>
        </a>
        {CARS.map((c, i) => (
          <Car
            key={i}
            kind={c.kind}
            body={c.body}
            dir={c.lane === 0 ? 1 : -1}
            bottom={c.lane === 0 ? 150 - 84 : 150 - 136}
            duration={LEN / SPEED[c.lane]}
            delay={-(c.off / SPEED[c.lane])}
          />
        ))}
        <div className="rd-curb" aria-hidden="true" />
      </div>
    </div>
  );
}
