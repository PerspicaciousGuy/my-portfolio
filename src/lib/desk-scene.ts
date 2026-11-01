import { canvas, type SceneLayer } from "@/lib/scene-art";

/**
 * The About portrait: a night desk on a 50 x 90 grid, anchored to the bottom so it fills whatever
 * height the About text needs. The scene itself is static paths; the sky, windows, screen, steam,
 * lamp, keys, critter, clouds, plane and shooting star are small overlays that carry CSS animation
 * (see .px-desk in globals.css). Everything here is deterministic, so server and client agree.
 */
const W = 50;
const H = 90;
const DESK = 78;

const K = {
  bg0: "#12131D",
  bg1: "#171925",
  bg2: "#1B1D2C",
  bgH: "#20233A",
  b1: "#262939",
  b2: "#2E3145",
  raised: "#23252D",
  line: "#353844",
  edge: "#5A5F70",
  ink: "#ECECF0",
  mute: "#A9ACB8",
  yellow: "#FFC933",
  orange: "#FF7A45",
  green: "#6BF59A",
  violet: "#9B7BFF",
  blue: "#62B6FF",
  pink: "#FF9DB5",
  dark: "#0B0C10",
};

/** [x, width, height] of each tower; the desk surface is the ground line. */
const BUILDINGS: [number, number, number][] = [
  [0, 6, 26],
  [6, 5, 34],
  [11, 5, 18],
  [16, 4, 30],
  [20, 5, 38],
  [25, 4, 28],
  [29, 6, 36],
  [35, 4, 24],
  [39, 5, 30],
  [44, 6, 42],
];

type DeskStar = {
  x: number;
  y: number;
  fill: string;
  dur: number;
  delay: number;
};
type DeskWindow = { x: number; y: number; dur: number; delay: number };
type DeskLine = {
  x: number;
  y: number;
  segs: { x: number; w: number; fill: string }[];
};

/** One path for a sprite given as rows of characters; any non-dot character is a lit pixel. */
function spritePath(rows: string[]): string {
  let d = "";
  rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      if (row[x] === ".") {
        x++;
        continue;
      }
      let k = x;
      while (k < row.length && row[k] !== ".") k++;
      d += `M${x} ${y}h${k - x}v1h${x - k}z`;
      x = k;
    }
  });
  return d;
}

function build() {
  const a = canvas(W, H);
  let seed = 4242;
  const rnd = () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296;
  const topAt = (x: number) => {
    let t = DESK;
    BUILDINGS.forEach(([bx, bw, bh]) => {
      if (x >= bx && x < bx + bw) t = Math.min(t, DESK - bh);
    });
    return t;
  };

  // sky bands, skyline
  a.r(K.bg0, 0, 0, W, 28);
  a.r(K.bg1, 0, 28, W, 22);
  a.r(K.bg2, 0, 50, W, 16);
  a.r(K.bgH, 0, 66, W, 12);
  BUILDINGS.forEach(([x, w, h], i) =>
    a.r(i % 2 ? K.b2 : K.b1, x, DESK - h, w, h),
  );
  // moon with a dithered glow
  for (let y = 4; y <= 28; y++) {
    for (let x = 28; x <= 49; x++) {
      const d = Math.hypot(x - 40, y - 16);
      if (d > 6.2 && d < 9 && (x + y) % 2 === 0) a.p("#1A1C2C", x, y);
    }
  }
  a.disc(K.yellow, 40, 16, 5);
  a.disc(K.bg0, 42, 14, 4);
  // desk surface
  a.r(K.raised, 0, DESK, W, 12);
  a.r(K.edge, 0, DESK, W, 1);
  a.r(K.line, 0, DESK + 1, W, 1);
  a.r("#1C1E26", 0, DESK + 8, W, 4);
  // lamp
  a.r(K.edge, 3, 76, 7, 2);
  a.r(K.mute, 3, 76, 7, 1);
  a.r(K.edge, 6, 67, 1, 9);
  a.r(K.edge, 7, 65, 1, 2);
  a.r(K.edge, 8, 63, 1, 2);
  a.spr([".xxxxx.", "xxxxxxx", "xyyyyyx"], 7, 60, { x: K.orange, y: K.yellow });
  // monitor
  a.r(K.dark, 17, 52, 24, 22);
  a.box(K.edge, K.dark, 15, 50, 24, 22);
  a.r("#1B2230", 17, 52, 20, 18);
  a.r(K.edge, 25, 72, 4, 4);
  a.r(K.mute, 25, 72, 1, 4);
  a.r(K.edge, 21, 76, 12, 2);
  // keyboard
  a.r(K.dark, 13, 81, 28, 5);
  a.r(K.edge, 12, 80, 28, 4);
  const keys: number[] = [];
  for (let x = 13; x < 39; x += 3) {
    a.r(K.mute, x, 81, 2, 1);
    a.r(K.line, x, 82, 2, 1);
    keys.push(x);
  }
  // mug
  a.r(K.ink, 43, 73, 5, 5);
  a.r(K.mute, 47, 74, 2, 3);
  a.r("#6B4226", 44, 73, 3, 1);

  // the critter has its own canvas so it can bob
  const c = canvas(12, 10);
  c.spr(
    [
      ".....YY.....",
      "......o.....",
      "..oooooooo..",
      ".oHHGGGGGGo.",
      ".oHGGGGGGGo.",
      ".oGwkGGwkGo.",
      ".oGPGGGGPGo.",
      ".oGGGoooGGo.",
      ".oSSSSSSSSo.",
      "..oooooooo..",
    ],
    0,
    0,
    {
      o: "#1B5E3F",
      G: K.green,
      S: "#3FBF72",
      H: "#C4FFDD",
      w: "#FFFFFF",
      k: "#131418",
      P: K.pink,
      Y: K.yellow,
    },
  );

  // overlays
  const stars: DeskStar[] = [];
  const palette = [K.ink, K.blue, K.ink, K.mute];
  for (let i = 0; i < 44 && stars.length < 26; i++) {
    const x = 1 + Math.floor(rnd() * 48);
    const y = 1 + Math.floor(rnd() * 58);
    if (y > topAt(x) - 2 || Math.hypot(x - 40, y - 16) < 9) continue;
    if (stars.some((s) => Math.abs(s.x - x) + Math.abs(s.y - y) < 4)) continue;
    stars.push({
      x,
      y,
      fill: palette[stars.length % 4],
      dur: 2 + rnd() * 3,
      delay: rnd() * 4,
    });
  }
  const windows: DeskWindow[] = [];
  BUILDINGS.forEach(([bx, bw, bh]) => {
    for (let y = DESK - bh + 2; y < DESK - 3; y += 3) {
      for (let x = bx + 1; x < bx + bw - 1; x += 2) {
        const inMonitor = x >= 14 && x <= 40 && y >= 49 && y <= 75;
        const inLamp = x >= 2 && x <= 14 && y >= 58;
        if (inMonitor || inLamp || y >= 74 || rnd() < 0.45) continue;
        windows.push({ x, y, dur: 9 + rnd() * 14, delay: rnd() * 12 });
      }
    }
  });
  const lines: DeskLine[] = [
    {
      x: 19,
      y: 54,
      segs: [
        { x: 0, w: 4, fill: K.green },
        { x: 5, w: 9, fill: K.ink },
      ],
    },
    {
      x: 19,
      y: 57,
      segs: [
        { x: 0, w: 6, fill: K.violet },
        { x: 7, w: 7, fill: K.yellow },
      ],
    },
    { x: 22, y: 60, segs: [{ x: 0, w: 9, fill: K.blue }] },
    {
      x: 22,
      y: 63,
      segs: [
        { x: 0, w: 5, fill: K.green },
        { x: 6, w: 5, fill: K.ink },
      ],
    },
    { x: 19, y: 66, segs: [{ x: 0, w: 8, fill: K.violet }] },
  ];

  return {
    base: a.out() as SceneLayer[],
    critter: c.out() as SceneLayer[],
    stars,
    windows,
    lines,
    /** Keys that flash while the critter types, with a duration and a start offset each. */
    keyFlashes: [1, 3, 4, 6, 8].map((i, n) => ({
      x: keys[i],
      dur: 0.9 + n * 0.23,
      delay: n * 0.37,
    })),
    cloudA: spritePath(["..xxx...", ".xxxxxx.", "xxxxxxxx"]),
    cloudB: spritePath(["...xx....", ".xxxxxx..", "xxxxxxxxx"]),
    plane: spritePath(["..xx", "xxxxx"]),
    lampGlow: spritePath([
      ".....x....",
      "....x.x.x.",
      "...x.x.x.x",
      "..x.x.x.x.",
    ]),
  };
}

export const DESK_SCENE = { w: W, h: H, ...build() };
export const DESK_COLORS = K;
