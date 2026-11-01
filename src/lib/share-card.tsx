import fs from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { composeCritter, CRITTER_H, CRITTER_W, type Layer } from "@/lib/critter-sprite";
import { composeScene, type SceneKind } from "@/lib/scene-art";
import { hash } from "@/lib/hash";
import { site } from "@/data/site";

/**
 * The 1200 x 630 link-preview card (Open Graph and Twitter), designed on the canvas as "Share card".
 * One layout for three uses: the homepage, a blog post and a case study. Everything is flat boxes
 * and text, and the sky, skyline and critter are SVG paths from the same sprite code the site uses.
 * The skyline and stars are seeded, so a card is identical on every build.
 */
export const SHARE_SIZE = { width: 1200, height: 630 };

export type ShareCardInput =
  | { kind: "home" }
  | { kind: "post"; eyebrow: string; title: string }
  | { kind: "project"; eyebrow: string; title: string; art?: SceneKind };

// Satori reads TTF, OTF and WOFF (not WOFF2). The images are all prerendered at build time, so
// reading from the working directory is enough.
const FONT_DIR = path.join(process.cwd(), "src", "assets", "fonts");
const readFont = async (file: string) => {
  const buf = await fs.readFile(path.join(FONT_DIR, file));
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
};

const PIXEL = "Pixelify Sans";
const MONO = "VT323";
const C = {
  bg: "#131418",
  ink: "#ECECF0",
  mute: "#A9ACB8",
  yellow: "#FFC933",
  green: "#6BF59A",
  violet: "#9B7BFF",
  shadow: "#07080B",
  ground: "#23252D",
  groundEdge: "#1B1D24",
};
const GROUND = 64;

type Rect = [x: number, y: number, w: number, h: number];
const rectsPath = (rs: Rect[]) => rs.map(([x, y, w, h]) => `M${x} ${y}h${w}v${h}h-${w}z`).join("");

/** Stars, moon and skyline as colour-run paths over the 1200 x 630 card. */
function sky(maxH: number): Layer[] {
  // Three passes, painted in this order: sky, then buildings, then their lit windows. Grouping by
  // colour alone would paint a window colour shared with the moon underneath the buildings.
  const passes: Map<string, Rect[]>[] = [new Map(), new Map(), new Map()];
  const add = (fill: string, r: Rect, pass = 0) => passes[pass].set(fill, [...(passes[pass].get(fill) ?? []), r]);

  for (let i = 0; i < 46; i++) {
    const x = Math.round((hash(i + 200) * 1160 + 20) / 4) * 4;
    const y = Math.round((hash(i + 300) * 360 + 16) / 4) * 4;
    add(hash(i + 400) > 0.55 ? "#FFFFFF" : "#A9AEC2", [x, y, 4, 4]);
  }

  // The moon: three overlapping rectangles make an octagon, two craters.
  add("#FFE27A", [1104, 44, 24, 56]);
  add("#FFE27A", [1088, 60, 56, 24]);
  add("#FFE27A", [1096, 52, 40, 40]);
  add("#F2C94C", [1112, 64, 8, 8]);
  add("#F2C94C", [1124, 76, 4, 4]);

  // Skyline: tall on the right, kept low on the left under the text. Windows are 8 px squares on a
  // 24 x 28 grid, about two in five lit.
  const floor = SHARE_SIZE.height - GROUND;
  for (let i = 0, x = -12; x < SHARE_SIZE.width; i++) {
    const w = 72 + Math.floor(hash(i) * 5) * 12;
    const left = x + w / 2 < 600;
    const base = 0.45 + hash(i + 40) * 0.55;
    const h = Math.max(48, Math.round((maxH * base * (left ? 0.5 : 1)) / 12) * 12);
    add(i % 2 ? "#262833" : "#1E2028", [x, floor - h, w, h], 1);
    for (let wy = 16; wy + 8 < h - 8; wy += 28) {
      for (let wx = 16; wx + 8 < w - 8; wx += 24) {
        if (hash(i * 31 + wx * 7 + wy) > 0.45) {
          add(hash(wx + wy + i) > 0.7 ? "#FFE27A" : "#FFC933", [x + wx, floor - h + wy, 8, 8], 2);
        }
      }
    }
    x += w + (hash(i + 90) > 0.7 ? 12 : 0);
  }

  return passes.flatMap((by) => [...by].map(([fill, rs]) => ({ fill, d: rectsPath(rs) })));
}

// The card renderer takes plain elements, so these helpers are called, not mounted as components.
const paths = (layers: Layer[]) => layers.map((l, i) => <path key={i} fill={l.fill} d={l.d} />);

/** The critter standing, facing left when flipped. */
function critter(u: number, flip = false) {
  const layers = composeCritter({ pose: "stand", face: "happy" });
  return (
    <svg width={CRITTER_W * u} height={CRITTER_H * u} viewBox={`0 0 ${CRITTER_W} ${CRITTER_H}`} shapeRendering="crispEdges">
      <g transform={flip ? `translate(${CRITTER_W} 0) scale(-1 1)` : undefined}>
        {paths(layers)}
      </g>
    </svg>
  );
}

/** Title size steps down with length so it stays inside the frame. */
function titleSize(title: string, beside: boolean) {
  if (beside) return title.length > 14 ? 56 : 68;
  return title.length <= 26 ? 76 : title.length <= 38 ? 64 : 56;
}

function card(input: ShareCardInput) {
  const home = input.kind === "home";
  const scene = input.kind === "project" && input.art ? composeScene(input.art) : null;

  return (
    <div style={{ display: "flex", position: "relative", width: "100%", height: "100%", background: C.bg, color: C.ink, fontFamily: MONO }}>
      <svg width={SHARE_SIZE.width} height={SHARE_SIZE.height} viewBox={`0 0 ${SHARE_SIZE.width} ${SHARE_SIZE.height}`} shapeRendering="crispEdges" style={{ position: "absolute", left: 0, top: 0 }}>
        {paths(sky(home ? 176 : 124))}
      </svg>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: GROUND,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 72px",
          background: C.ground,
          borderTop: `6px solid ${C.groundEdge}`,
        }}
      >
        <span style={{ fontFamily: PIXEL, fontWeight: 600, fontSize: 24, letterSpacing: "0.04em", color: C.ink }}>harshitbishnoi.dev</span>
        <span style={{ fontSize: 28, color: C.green }}>Next.js · Node.js · TypeScript · PostgreSQL</span>
      </div>

      {home ? (
        <>
          <div style={{ position: "absolute", left: 72, top: 52, width: 760, display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontFamily: PIXEL, fontWeight: 500, fontSize: 24, textTransform: "uppercase", letterSpacing: "0.06em", color: C.violet }}>Hello, world!</div>
            <div style={{ display: "flex", flexDirection: "column", marginTop: 14, fontFamily: PIXEL, fontWeight: 700, fontSize: 112, lineHeight: 0.95, textTransform: "uppercase", textShadow: `6px 6px 0 ${C.shadow}` }}>
              <span>Harshit</span>
              <span style={{ color: C.yellow }}>Bishnoi</span>
            </div>
            <div style={{ display: "flex", marginTop: 24, fontFamily: PIXEL, fontWeight: 600, fontSize: 30, textTransform: "uppercase", letterSpacing: "0.04em", color: C.green }}>{`> ${site.role}`}</div>
            <div style={{ display: "flex", marginTop: 10, fontSize: 36, lineHeight: 1.1, color: C.mute }}>{site.heroIntro}</div>
          </div>
          <div style={{ position: "absolute", left: 880, bottom: GROUND - 4, width: CRITTER_W * 8, height: CRITTER_H * 8, display: "flex" }}>
            {critter(8, true)}
          </div>
          <div style={{ position: "absolute", left: 880, bottom: GROUND - 4 + 146, width: CRITTER_W * 8, display: "flex", justifyContent: "center" }}>
            <div style={{ display: "flex", padding: "4px 10px", background: C.ink, color: C.bg, fontFamily: PIXEL, fontWeight: 600, fontSize: 22, textTransform: "uppercase", letterSpacing: "0.06em", boxShadow: `4px 4px 0 ${C.shadow}` }}>hi!</div>
          </div>
        </>
      ) : (
        <>
          <div style={{ position: "absolute", left: 72, top: 56, width: scene ? 548 : 900, display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontFamily: PIXEL, fontWeight: 600, fontSize: 24, textTransform: "uppercase", letterSpacing: "0.06em", color: input.kind === "project" ? C.violet : C.green }}>{input.eyebrow}</div>
            <div style={{ display: "flex", marginTop: 16, fontFamily: PIXEL, fontWeight: 700, fontSize: titleSize(input.title, !!scene), lineHeight: 1, textTransform: "uppercase", textShadow: `5px 5px 0 ${C.shadow}` }}>{input.title}</div>
            <div style={{ display: "flex", alignItems: "center", marginTop: 34 }}>
              <div style={{ position: "relative", display: "flex", width: 78, height: 51, marginRight: 18 }}>
                <div style={{ position: "absolute", left: 0, bottom: 0, display: "flex" }}>
                  {critter(3)}
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", fontFamily: PIXEL, fontWeight: 600, fontSize: 24, textTransform: "uppercase", letterSpacing: "0.04em" }}>{site.name}</div>
                <div style={{ display: "flex", fontSize: 28, color: C.mute }}>{site.role}</div>
              </div>
            </div>
          </div>
          {scene && (
            <div
              style={{
                position: "absolute",
                left: 1140 - (scene.w * 3 + 12),
                top: 128,
                display: "flex",
                border: "6px solid #35384C",
                boxShadow: `8px 8px 0 ${C.shadow}`,
                background: scene.bg,
              }}
            >
              <svg width={scene.w * 3} height={scene.h * 3} viewBox={`0 0 ${scene.w} ${scene.h}`} shapeRendering="crispEdges">
                {paths(scene.layers)}
              </svg>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/** Renders the card to a PNG response. */
export async function shareCard(input: ShareCardInput) {
  const [pixel500, pixel600, pixel700, vt323] = await Promise.all([
    readFont("pixelify-sans-latin-500-normal.woff"),
    readFont("pixelify-sans-latin-600-normal.woff"),
    readFont("pixelify-sans-latin-700-normal.woff"),
    readFont("vt323-latin-400-normal.woff"),
  ]);

  return new ImageResponse(card(input), {
    ...SHARE_SIZE,
    fonts: [
      { name: PIXEL, data: pixel500, weight: 500, style: "normal" },
      { name: PIXEL, data: pixel600, weight: 600, style: "normal" },
      { name: PIXEL, data: pixel700, weight: 700, style: "normal" },
      { name: MONO, data: vt323, weight: 400, style: "normal" },
    ],
  });
}

