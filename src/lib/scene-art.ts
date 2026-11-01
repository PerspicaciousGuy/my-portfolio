/**
 * Pixel scenes for the project cards, the lead card and the case-study cover. Each scene is drawn on a
 * small grid with rect / sprite / disc helpers and returned as SVG paths with the draw order kept
 * (consecutive rects of one colour share a path), so any size keeps hard pixel edges. Pure and
 * deterministic: rendered on the server, no client code.
 */
export type SceneKind =
  | "api"
  | "gym"
  | "library"
  | "muscle"
  | "journal"
  | "ios";
export type SceneLayer = { fill: string; d: string };
export type Scene = {
  w: number;
  h: number;
  bg: string;
  label: string;
  layers: SceneLayer[];
};

const C = {
  bg: "#14151B",
  bg2: "#1A1B21",
  raised: "#23252D",
  line: "#353844",
  edge: "#5A5F70",
  ink: "#ECECF0",
  mute: "#A9ACB8",
  yellow: "#FFC933",
  yellowD: "#C99A10",
  green: "#6BF59A",
  greenD: "#2F8F57",
  violet: "#9B7BFF",
  violetD: "#5B33D6",
  blue: "#62B6FF",
  blueD: "#2E6FA8",
  pink: "#FF9DB5",
  pinkD: "#C2587A",
  orange: "#FF7A45",
  red: "#E5484D",
  dark: "#0B0C10",
};
export function canvas(w: number, h: number) {
  // Draw order is kept: consecutive rects of one colour share a path, a new colour starts a new one.
  const L: SceneLayer[] = [];
  const put = (c: string, x: number, y: number, ww: number, hh: number) => {
    const seg = "M" + x + " " + y + "h" + ww + "v" + hh + "h" + -ww + "z";
    const last = L[L.length - 1];
    if (last && last.fill === c) last.d += seg;
    else L.push({ fill: c, d: seg });
  };
  return {
    w,
    h,
    r(c: string, x: number, y: number, ww: number, hh: number) {
      if (ww > 0 && hh > 0) put(c, x, y, ww, hh);
    },
    p(c: string, x: number, y: number) {
      put(c, x, y, 1, 1);
    },
    // outlined box: border colour b, fill f
    box(b: string, f: string, x: number, y: number, ww: number, hh: number) {
      put(b, x, y, ww, hh);
      put(f, x + 1, y + 1, ww - 2, hh - 2);
    },
    // sprite rows, map: char -> colour, '.' is empty
    spr(rows: string[], ox: number, oy: number, map: Record<string, string>) {
      rows.forEach((row, j) => {
        let i = 0;
        while (i < row.length) {
          const ch = row[i];
          if (ch === "." || !map[ch]) {
            i++;
            continue;
          }
          let k = i;
          while (k < row.length && row[k] === ch) k++;
          put(map[ch], ox + i, oy + j, k - i, 1);
          i = k;
        }
      });
    },
    disc(c: string, cx: number, cy: number, rad: number) {
      for (let y = -rad; y <= rad; y++) {
        const half = Math.round(Math.sqrt(rad * rad - y * y + rad * 0.4));
        put(c, cx - half, cy + y, half * 2, 1);
      }
    },
    out() {
      return L;
    },
  };
}
type Canvas = ReturnType<typeof canvas>;
function starfield(
  a: Canvas,
  seed: number,
  n: number,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
) {
  let s = seed;
  const rnd = () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;
  for (let i = 0; i < n; i++)
    a.p(
      rnd() < 0.3 ? C.blue : rnd() < 0.5 ? C.ink : C.edge,
      Math.floor(x0 + rnd() * (x1 - x0)),
      Math.floor(y0 + rnd() * (y1 - y0)),
    );
}
function dumbbell(a: Canvas, x: number, y: number, big: boolean) {
  // horizontal dumbbell, 34 wide x 12 tall (big) or 26 x 8
  if (big) {
    a.r(C.edge, x + 10, y + 5, 14, 3);
    a.r(C.mute, x + 10, y + 5, 14, 1);
    [
      [0, 8],
      [3, 12],
    ].forEach(([dx, hh]) => {
      a.r(C.yellowD, x + dx, y + (12 - hh) / 2, 3, hh);
      a.r(C.yellow, x + dx, y + (12 - hh) / 2, 2, hh);
      a.r(C.yellowD, x + 31 - dx, y + (12 - hh) / 2, 3, hh);
      a.r(C.yellow, x + 31 - dx, y + (12 - hh) / 2, 2, hh);
    });
    a.r(C.yellowD, x + 6, y + 1, 3, 10);
    a.r(C.yellow, x + 6, y + 1, 2, 10);
    a.r(C.yellowD, x + 25, y + 1, 3, 10);
    a.r(C.yellow, x + 25, y + 1, 2, 10);
  } else {
    a.r(C.edge, x + 8, y + 3, 10, 2);
    a.r(C.mute, x + 8, y + 3, 10, 1);
    a.r(C.yellowD, x, y, 3, 8);
    a.r(C.yellow, x, y, 2, 8);
    a.r(C.yellowD, x + 4, y - 1, 3, 10);
    a.r(C.yellow, x + 4, y - 1, 2, 10);
    a.r(C.yellowD, x + 19, y - 1, 3, 10);
    a.r(C.yellow, x + 19, y - 1, 2, 10);
    a.r(C.yellowD, x + 23, y, 3, 8);
    a.r(C.yellow, x + 23, y, 2, 8);
  }
}
function dbCylinder(
  a: Canvas,
  x: number,
  y: number,
  w: number,
  tiers: number,
  top: string,
  body: string,
  edge: string,
) {
  for (let i = 0; i < tiers; i++) {
    const yy = y + i * 9;
    a.r(edge, x, yy + 2, w, 9);
    a.r(body, x + 1, yy + 3, w - 2, 7);
    a.r(top, x + 1, yy + 3, w - 2, 1);
    a.r(edge, x + 2, yy, w - 4, 1);
    a.r(top, x + 2, yy + 1, w - 4, 2);
    a.r(C.dark, x + w - 4, yy + 5, 2, 2);
    a.r(C.green, x + 3, yy + 6, 2, 2);
  }
}

// ------------------------------------------------------------------ ExerciseDB API (lead, 160 x 105)
function sceneApi() {
  const a = canvas(160, 105);
  a.r(C.bg, 0, 0, 160, 105);
  starfield(a, 7, 22, 2, 2, 158, 40);
  // moon
  a.disc(C.ink, 142, 12, 5);
  a.disc(C.bg, 145, 10, 4);
  // floor
  a.r(C.bg2, 0, 90, 160, 15);
  a.r(C.line, 0, 90, 160, 2);
  for (let x = 4; x < 160; x += 16) a.r(C.line, x, 96, 8, 1);
  // rack
  a.box(C.line, C.raised, 8, 26, 28, 64);
  for (let i = 0; i < 6; i++) {
    const y = 29 + i * 10;
    a.r(C.dark, 11, y, 22, 8);
    a.r(C.line, 12, y + 2, 12, 1);
    a.r(C.line, 12, y + 5, 12, 1);
    a.r(i % 3 === 0 ? C.yellow : C.green, 27, y + 2, 2, 2);
    a.r(i % 2 ? C.blue : C.greenD, 27, y + 5, 2, 2);
  }
  // cables
  a.r(C.edge, 36, 58, 9, 1);
  a.r(C.edge, 36, 70, 9, 1);
  a.r(C.edge, 40, 58, 1, 13);
  // terminal window
  a.r(C.dark, 47, 21, 76, 62);
  a.box(C.edge, C.bg2, 45, 19, 76, 62);
  a.r(C.raised, 46, 20, 74, 8);
  a.r(C.red, 49, 22, 3, 3);
  a.r(C.yellow, 54, 22, 3, 3);
  a.r(C.green, 59, 22, 3, 3);
  a.r(C.mute, 84, 23, 22, 1);
  // request
  a.spr(["x.", ".x", "x."], 50, 32, { x: C.green });
  a.r(C.yellow, 56, 33, 9, 2);
  a.r(C.ink, 67, 33, 28, 2);
  a.r(C.mute, 97, 33, 6, 2);
  // status
  a.r(C.green, 50, 41, 3, 3);
  a.r(C.green, 56, 41, 14, 2);
  a.r(C.mute, 72, 41, 18, 2);
  // json
  const J: [number, string, number, string, number][] = [
    [0, C.ink, 4, "", 0],
    [1, C.violet, 14, C.ink, 18],
    [1, C.violet, 10, C.green, 12],
    [1, C.violet, 16, C.yellow, 10],
    [1, C.violet, 12, C.blue, 20],
    [0, C.ink, 4, "", 0],
  ];
  let y = 49;
  J.forEach(([ind, kc, kw, vc, vw]) => {
    a.r(kc, 50 + ind * 5, y, kw, 2);
    if (vc) a.r(vc, 50 + ind * 5 + kw + 3, y, vw, 2);
    y += 5;
  });
  a.r(C.green, 50, 77, 3, 1);
  a.r(C.green, 56, 77, 1, 1);
  // packets
  a.r(C.yellow, 125, 49, 3, 3);
  a.r(C.yellow, 130, 49, 3, 3);
  a.r(C.yellowD, 135, 49, 3, 3);
  // database
  dbCylinder(a, 134, 36, 22, 3, C.blue, C.blueD, C.edge);
  a.r(C.line, 144, 64, 2, 22);
  // dumbbell
  dumbbell(a, 124, 78, true);
  a.r(C.dark, 124, 90, 34, 1);
  return a;
}

// ------------------------------------------------------------------ GymPlanner (150 x 65)
function sceneGym() {
  const a = canvas(150, 65);
  a.r(C.bg, 0, 0, 150, 65);
  starfield(a, 11, 16, 1, 1, 149, 40);
  a.r(C.bg2, 0, 58, 150, 7);
  a.r(C.line, 0, 58, 150, 1);
  // dumbbell + plates
  dumbbell(a, 8, 45, true);
  a.r(C.dark, 9, 57, 32, 1);
  a.disc(C.edge, 26, 22, 11);
  a.disc(C.bg2, 26, 22, 9);
  a.r(C.mute, 25, 14, 2, 1);
  a.r(C.mute, 25, 30, 2, 1);
  a.r(C.mute, 18, 21, 1, 2);
  a.r(C.mute, 34, 21, 1, 2);
  a.r(C.yellow, 25, 15, 2, 8);
  a.r(C.green, 25, 22, 7, 2);
  a.p(C.red, 25, 22);
  // phone
  a.r(C.dark, 61, 6, 38, 58);
  a.box(C.edge, C.bg2, 59, 4, 38, 58);
  a.r(C.dark, 72, 6, 12, 2);
  a.r(C.green, 62, 10, 32, 6);
  a.r(C.dark, 64, 12, 12, 2);
  a.r(C.dark, 86, 12, 6, 2);
  // AM card
  a.r(C.raised, 62, 19, 32, 15);
  a.r(C.yellow, 62, 19, 2, 15);
  a.r(C.yellow, 66, 21, 6, 2);
  a.r(C.mute, 66, 25, 16, 1);
  a.r(C.mute, 66, 28, 12, 1);
  a.r(C.mute, 66, 31, 14, 1);
  a.spr([".....x", "....xx", "x..xx.", "xxxx..", ".xx..."], 86, 23, {
    x: C.green,
  });
  // PM card
  a.r(C.raised, 62, 36, 32, 15);
  a.r(C.violet, 62, 36, 2, 15);
  a.r(C.violet, 66, 38, 6, 2);
  a.r(C.mute, 66, 42, 16, 1);
  a.r(C.mute, 66, 45, 12, 1);
  a.r(C.mute, 66, 48, 14, 1);
  a.r(C.line, 86, 41, 6, 6);
  a.r(C.bg2, 87, 42, 4, 4);
  // nav
  [66, 74, 82, 90].forEach((x, i) =>
    a.r(i === 0 ? C.green : C.line, x, 55, 3, 3),
  );
  // calendar
  a.r(C.dark, 107, 14, 36, 40);
  a.box(C.edge, C.bg2, 105, 12, 36, 40);
  a.r(C.pink, 106, 13, 34, 7);
  a.r(C.dark, 110, 10, 2, 5);
  a.r(C.dark, 134, 10, 2, 5);
  a.r(C.ink, 110, 10, 2, 4);
  a.r(C.ink, 134, 10, 2, 4);
  const done = [1, 2, 4, 5, 8, 9, 11, 12, 13];
  for (let r = 0; r < 4; r++)
    for (let c = 0; c < 5; c++) {
      const i = r * 5 + c;
      const col = i === 14 ? C.yellow : done.includes(i) ? C.green : C.line;
      a.r(col, 108 + c * 6, 23 + r * 7, 4, 4);
    }
  // sparkles
  [
    [48, 14],
    [144, 6],
    [94, 2],
  ].forEach(([x, y]) => {
    a.r(C.yellow, x, y, 1, 3);
    a.r(C.yellow, x - 1, y + 1, 3, 1);
  });
  return a;
}

// ------------------------------------------------------------------ Quiet Library (150 x 65)
function sceneLibrary() {
  const a = canvas(150, 65);
  a.r(C.bg, 0, 0, 150, 65);
  starfield(a, 23, 18, 1, 1, 149, 36);
  a.r(C.bg2, 0, 58, 150, 7);
  a.r(C.line, 0, 58, 150, 1);
  // crescent moon
  a.disc(C.yellow, 15, 14, 6);
  a.disc(C.bg, 18, 12, 5);
  // waveform with progress
  const hs = [4, 8, 14, 9, 18, 24, 15, 10, 20, 13, 7, 4];
  hs.forEach((h, i) => {
    const x = 8 + i * 3;
    a.r(i < 7 ? C.green : C.line, x, 54 - h, 2, h);
  });
  // headphones
  const cx = 75;
  for (let y = 6; y <= 30; y++) {
    const dy = 30 - y,
      half = Math.round(Math.sqrt(Math.max(0, 22 * 22 - dy * dy)));
    const half2 = Math.round(Math.sqrt(Math.max(0, 18 * 18 - dy * dy)));
    if (dy <= 22 && dy >= 0) {
      a.r(C.violetD, cx - half, y, half - half2 + 1, 1);
      a.r(C.violetD, cx + half2 - 1, y, half - half2 + 1, 1);
    }
    if (dy <= 22 && dy >= 17) a.r(C.violetD, cx - half2, y, half2 * 2, 1);
  }
  a.r(C.violet, cx - 12, 8, 24, 2);
  a.box(C.pinkD, C.pink, cx - 24, 28, 12, 22);
  a.r(C.ink, cx - 22, 30, 2, 6);
  a.r(C.pinkD, cx - 14, 32, 2, 14);
  a.box(C.pinkD, C.pink, cx + 12, 28, 12, 22);
  a.r(C.ink, cx + 14, 30, 2, 6);
  a.r(C.pinkD, cx + 22, 32, 2, 14);
  // book stack
  a.r(C.violetD, 56, 54, 38, 4);
  a.r(C.violet, 56, 54, 38, 2);
  a.r(C.blueD, 60, 50, 30, 4);
  a.r(C.blue, 60, 50, 30, 2);
  // cloud with arrow
  a.spr(
    [
      ".....xxxx.......",
      "...xxxxxxxx.xx..",
      "..xxxxxxxxxxxxx.",
      ".xxxxxxxxxxxxxxx",
      "xxxxxxxxxxxxxxxx",
      "xxxxxxxxxxxxxxxx",
      ".mmmmmmmmmmmmmm.",
    ],
    106,
    18,
    { x: C.ink, m: C.mute },
  );
  a.r(C.violetD, 113, 21, 3, 6);
  a.spr(["xxxxxxx", ".xxxxx.", "..xxx..", "...x..."], 111, 27, {
    x: C.violetD,
  });
  a.r(C.line, 110, 44, 28, 3);
  a.r(C.green, 110, 44, 17, 3);
  // plane
  a.spr(["..x..", ".xxx.", "xxxxx", "..x..", ".xxx."], 128, 6, { x: C.mute });
  return a;
}

// ------------------------------------------------------------------ Open Muscle Map (150 x 65)
function body(a: Canvas, ox: number, front: boolean) {
  const S = "#7A8094";
  const col: Record<string, string> = {
    d: C.pink,
    c: C.orange,
    a: C.yellow,
    b: C.violet,
    f: C.blue,
    q: C.green,
    k: C.greenD,
    t: C.pinkD,
    l: C.orange,
    g: C.yellow,
    h: C.violet,
  };
  const F = [
    "....SSSS....",
    "....SSSS....",
    "....SSSS....",
    ".dddSSSSddd.",
    "ddddcccdddd.",
    "bbddccccddbb",
    "bbd.ccccd.bb",
    "bbb.aaaa.bbb",
    ".bb.aaaa.bb.",
    "fff.aaaa.fff",
    "fff.aaaa.fff",
    "ff..SSSS..ff",
    "...qqSSqq...",
    "...qqqqqq...",
    "..qqqqqqqq..",
    "..qqqqqqqq..",
    "..qqq..qqq..",
    "..qqq..qqq..",
    "..SSS..SSS..",
    "..kkk..kkk..",
    "..kkk..kkk..",
    "..kkk..kkk..",
    "...k....k...",
    "..SSS..SSS..",
  ];
  const B = [
    "....SSSS....",
    "....SSSS....",
    "....SSSS....",
    ".dddSSSSddd.",
    "dddtttttddd.",
    "ttdtttttdtt.",
    "tttllttlltt.",
    "bbb.llll.bbb",
    ".bb.llll.bb.",
    "bbb.llll.bbb",
    "fff.llll.fff",
    "ff..SSSS..ff",
    "...gggggg...",
    "..gggggggg..",
    "..gggggggg..",
    "..hhh..hhh..",
    "..hhh..hhh..",
    "..hhh..hhh..",
    "..SSS..SSS..",
    "..kkk..kkk..",
    "..kkk..kkk..",
    "..kkk..kkk..",
    "...k....k...",
    "..SSS..SSS..",
  ];
  const rows = front ? F : B;
  const map = Object.assign({ S }, col);
  // double-size sprite: every cell is 2 x 2 art pixels
  const big: string[] = [];
  rows.forEach((r) => {
    let s = "";
    for (const ch of r) s += ch + ch;
    big.push(s, s);
  });
  const outline = C.dark;
  const w = big[0].length;
  // outline pass
  big.forEach((row, j) =>
    [...row].forEach((ch, i) => {
      if (ch === ".") return;
      [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
      ].forEach(([dx, dy]) => {
        const nx = i + dx,
          ny = j + dy;
        const n =
          ny >= 0 && ny < big.length && nx >= 0 && nx < w ? big[ny][nx] : ".";
        if (n === ".") a.p(outline, ox + nx, 6 + ny);
      });
    }),
  );
  a.spr(big, ox, 6, map);
}
function sceneMuscle() {
  const a = canvas(150, 65);
  a.r(C.bg, 0, 0, 150, 65);
  for (let y = 3; y < 62; y += 6)
    for (let x = 3; x < 150; x += 6) a.p(C.line, x, y);
  body(a, 38, true);
  body(a, 88, false);
  // legend chips left / right
  (
    [
      [C.pink, 14],
      [C.orange, 8],
      [C.yellow, 6],
      [C.violet, 8],
    ] as [string, number][]
  ).forEach(([c, w], i) => {
    const y = 12 + i * 10;
    a.r(C.dark, 5, y + 1, 7, 6);
    a.r(c, 4, y, 7, 6);
    a.r(C.mute, 14, y + 2, w + 3, 2);
  });
  (
    [
      [C.blue, 14],
      [C.green, 8],
      [C.greenD, 10],
      [C.pinkD, 8],
    ] as [string, number][]
  ).forEach(([c, w], i) => {
    const y = 12 + i * 10;
    a.r(C.dark, 140, y + 1, 7, 6);
    a.r(c, 139, y, 7, 6);
    a.r(C.mute, 135 - w - 1, y + 2, w + 3, 2);
  });
  // FRONT / BACK tags
  a.r(C.edge, 44, 57, 12, 1);
  a.r(C.edge, 94, 57, 12, 1);
  return a;
}

function ring(
  a: Canvas,
  cx: number,
  cy: number,
  r0: number,
  r1: number,
  frac: number,
  color: string,
) {
  for (let deg = 0; deg < 360 * frac; deg += 2) {
    const t = ((deg - 90) * Math.PI) / 180;
    for (let r = r0; r <= r1; r += 0.5)
      a.p(
        color,
        Math.round(cx + Math.cos(t) * r),
        Math.round(cy + Math.sin(t) * r),
      );
  }
}

// Sessionbook (lead, 160 x 105)
function sceneJournal() {
  const a = canvas(160, 105);
  a.r(C.bg, 0, 0, 160, 105);
  starfield(a, 31, 18, 1, 1, 159, 12);
  a.r(C.bg2, 0, 90, 160, 15);
  a.r(C.line, 0, 90, 160, 2);
  for (let x = 4; x < 160; x += 16) a.r(C.line, x, 96, 8, 1);
  // chart window
  a.r(C.dark, 11, 17, 96, 70);
  a.box(C.edge, C.bg2, 9, 15, 96, 70);
  a.r(C.raised, 10, 16, 94, 8);
  a.r(C.red, 13, 18, 3, 3);
  a.r(C.yellow, 18, 18, 3, 3);
  a.r(C.green, 23, 18, 3, 3);
  a.r(C.violetD, 70, 18, 30, 4);
  a.r(C.violet, 70, 18, 30, 2);
  for (let y = 31; y < 80; y += 11)
    for (let x = 12; x < 102; x += 4) a.p(C.line, x, y);
  // candles: [open, close, wick top, wick bottom]
  const cs: [number, number, number, number][] = [
    [60, 56, 53, 63],
    [56, 59, 52, 62],
    [57, 52, 49, 60],
    [52, 47, 44, 54],
    [49, 52, 45, 55],
    [51, 45, 42, 53],
    [46, 40, 37, 48],
    [43, 46, 39, 49],
    [45, 38, 35, 47],
    [38, 42, 33, 45],
    [40, 34, 30, 42],
    [35, 31, 27, 38],
    [33, 36, 28, 39],
    [34, 27, 24, 36],
  ];
  cs.forEach(([o, c, t, b], i) => {
    const x = 15 + i * 6,
      col = c <= o ? C.green : C.red;
    a.r(col, x, t, 1, b - t);
    a.r(col, x - 1, Math.min(o, c), 3, Math.max(2, Math.abs(o - c)));
  });
  // volume bars and an entry marker
  const vol = [4, 6, 3, 7, 5, 4, 8, 5, 6, 4, 9, 6, 5, 8];
  vol.forEach((h, i) => a.r(C.line, 14 + i * 6, 82 - h, 3, h));
  a.spr(["..x..", ".xxx.", "xxxxx"], 31, 62, { x: C.yellow });
  a.spr(["xxxxx", ".xxx.", "..x.."], 91, 17 + 6, { x: C.green });
  // calendar of results
  a.r(C.dark, 114, 17, 44, 44);
  a.box(C.edge, C.bg2, 112, 15, 44, 44);
  a.r(C.violetD, 113, 16, 42, 7);
  a.r(C.violet, 113, 16, 42, 5);
  a.r(C.ink, 116, 18, 12, 1);
  for (let r = 0; r < 5; r++)
    for (let c = 0; c < 7; c++) {
      const v = (r * 7 + c * 3 + r) % 5;
      const col =
        c >= 5 ? C.line : v === 0 ? C.red : v === 3 ? C.line : C.green;
      a.r(col, 115 + c * 6, 26 + r * 6, 4, 4);
    }
  // three stat tiles
  (
    [
      [C.green, 20],
      [C.violet, 14],
      [C.yellow, 24],
    ] as [string, number][]
  ).forEach(([c, w], i) => {
    const x = 112 + i * 15;
    a.box(C.edge, C.bg2, x, 64, 14, 20);
    a.r(c, x + 3, 67, 8, 3);
    a.r(C.mute, x + 3, 73, 8, 1);
    a.r(C.line, x + 3, 76, 6, 1);
    a.r(c, x + 3, 79, Math.round(w / 3), 2);
  });
  [
    [102, 6],
    [152, 9],
  ].forEach(([x, y]) => {
    a.r(C.yellow, x, y, 1, 3);
    a.r(C.yellow, x - 1, y + 1, 3, 1);
  });
  return a;
}

// FitTrack (150 x 65)
function sceneIos() {
  const a = canvas(150, 65);
  a.r(C.bg, 0, 0, 150, 65);
  starfield(a, 17, 14, 1, 1, 149, 40);
  a.r(C.bg2, 0, 58, 150, 7);
  a.r(C.line, 0, 58, 150, 1);
  // rest timer and dumbbell
  a.disc(C.edge, 25, 22, 12);
  a.disc(C.bg2, 25, 22, 10);
  ring(a, 25, 22, 8, 10, 0.72, C.yellow);
  a.r(C.ink, 22, 20, 6, 1);
  a.r(C.mute, 21, 24, 8, 1);
  dumbbell(a, 8, 45, true);
  a.r(C.dark, 9, 57, 32, 1);
  // phone
  a.r(C.dark, 58, 4, 38, 62);
  a.box(C.edge, C.dark, 56, 2, 38, 62);
  a.r(C.bg2, 58, 4, 34, 58);
  a.r(C.dark, 69, 5, 12, 3);
  a.r(C.violet, 59, 10, 32, 5);
  a.r(C.ink, 61, 12, 12, 1);
  const block = (y: number, rows: number) => {
    a.r(C.raised, 59, y, 32, 5 + rows * 4);
    a.r(C.ink, 61, y + 2, 14, 2);
    for (let i = 0; i < rows; i++) {
      const yy = y + 6 + i * 4;
      a.r(C.line, 61, yy, 8, 3);
      a.r(C.line, 71, yy, 6, 3);
      a.r(i < rows - 1 ? C.green : C.line, 83, yy, 3, 3);
    }
  };
  block(18, 3);
  block(37, 2);
  a.r(C.raised, 59, 52, 32, 9);
  [62, 68, 74, 80, 86].forEach((x, i) =>
    a.r(i === 1 ? C.green : C.line, x, 55, 3, 3),
  );
  // widget tile and live activity pill
  a.r(C.dark, 106, 10, 32, 32);
  a.box(C.edge, C.bg2, 104, 8, 32, 32);
  a.disc(C.edge, 120, 22, 9);
  a.disc(C.bg2, 120, 22, 7);
  ring(a, 120, 22, 6, 8, 0.6, C.green);
  a.r(C.mute, 110, 33, 20, 1);
  a.r(C.line, 110, 35, 12, 1);
  a.r(C.dark, 104, 46, 40, 10);
  a.box(C.edge, C.dark, 102, 44, 40, 10);
  a.r(C.green, 105, 47, 4, 4);
  a.r(C.ink, 112, 47, 16, 2);
  a.r(C.mute, 112, 51, 10, 1);
  a.r(C.yellow, 131, 47, 8, 4);
  [
    [48, 8],
    [142, 3],
  ].forEach(([x, y]) => {
    a.r(C.yellow, x, y, 1, 3);
    a.r(C.yellow, x - 1, y + 1, 3, 1);
  });
  return a;
}

const BG = C.bg;
const DEFS: Record<SceneKind, { make: () => Canvas; label: string }> = {
  api: {
    make: sceneApi,
    label:
      "Pixel scene: a terminal request and response, a server rack, a database and a dumbbell",
  },
  gym: {
    make: sceneGym,
    label:
      "Pixel scene: a planner phone with AM and PM sessions, a calendar, a clock and a dumbbell",
  },
  library: {
    make: sceneLibrary,
    label:
      "Pixel scene: headphones, a playback waveform, a cloud download and a stack of books",
  },
  muscle: {
    make: sceneMuscle,
    label: "Pixel scene: front and back muscle map with a colour legend",
  },
  journal: {
    make: sceneJournal,
    label: "Pixel scene: a candlestick chart with a rising trend, a profit and loss calendar and three stat tiles",
  },
  ios: {
    make: sceneIos,
    label: "Pixel scene: an iPhone workout log, a rest-timer ring, a home-screen widget and a live-activity pill",
  },
};

const cache = new Map<SceneKind, Scene>();

export function composeScene(kind: SceneKind): Scene {
  let scene = cache.get(kind);
  if (!scene) {
    const a = DEFS[kind].make();
    scene = {
      w: a.w,
      h: a.h,
      bg: BG,
      label: DEFS[kind].label,
      layers: a.out(),
    };
    cache.set(kind, scene);
  }
  return scene;
}
