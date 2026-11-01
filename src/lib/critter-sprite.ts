/**
 * The critter, drawn as pixel rows. The grid is 26 cells wide (the body is 20,
 * the rest is room for arms and held items) and 26 tall (9 cells above the
 * head for an umbrella, a raindrop, a heart or stars). composeCritter turns a
 * pose into one SVG path per colour, so changing the character means editing
 * the strings below.
 *
 *   o outline   G body   S shade   H highlight   w eye white   k pupil
 *   P cheek     Y bulb / star   R red   C cream   D drop   N coffee
 *   T steam     L laptop
 */
export type Pose = "stand" | "walk" | "run" | "tiptoe" | "sit" | "sleep";
export type Face =
  | "auto"
  | "happy"
  | "wink"
  | "surprised"
  | "dizzy"
  | "sad"
  | "heart"
  | "sleepy"
  | "down"
  | "yawn";
export type Arms = "none" | "up" | "wave1" | "wave2";
export type Item = "none" | "coffee" | "laptop";

export type CritterPose = {
  pose?: Pose;
  /** Walk, run or tiptoe frame, 0 to 3. */
  step?: number;
  /** Blink, used when face is "auto". */
  blink?: boolean;
  look?: "side" | "up";
  face?: Face;
  arms?: Arms;
  item?: Item;
  /** Toggles steam / typing hands. */
  itemT?: number;
  /** 1 squashes the body, -1 stretches it. */
  squash?: number;
  /** Raindrop height above the head (art pixels), 0 for none. */
  drop?: number;
  /** Snowflake height above the head (art pixels), 0 for none. */
  flake?: number;
  /** Heart height above the head, 0 for none. */
  heart?: number;
  /** Orbiting stars, 1 to 4 picks the frame, 0 for none. */
  stars?: number;
  /** Antenna sway. */
  wag?: boolean;
  /** Feet off the ground by this many art pixels. */
  lift?: number;
  /** Breathing frame while asleep. */
  breathe?: boolean;
  umbrella?: boolean;
};

export type Layer = { fill: string; d: string };

export const CRITTER_W = 26;
export const CRITTER_H = 26;
/** Rows of the sprite that are the body, for sizing the hit box. */
export const CRITTER_BODY_ROWS = 17;

const BODY = [
  "...oooooooooooooo...",
  "..oGGGGGGGGGGGGGGo..",
  ".oHHGGGGGGGGGGGGGGo.",
  ".oHGGGGGGGGGGGGGGGo.",
  ".oGGGGGGGGGGGGGGGGo.",
  ".oGGGGGGGGGGGGGGGGo.",
  ".oGGGGGGGGGGGGGGGGo.",
  ".oGPPGGGGGGGGGGPPGo.",
  ".oGGGGGGGGGGGGGGGGo.",
  ".oSSSSSSSSSSSSSSSSo.",
  "...oooooooooooooo...",
];

const EYES: Record<string, string[]> = {
  side: ["www", "wkk", "wkk"],
  up: ["wkk", "wkk", "www"],
  down: ["www", "www", "wkk"],
  shut: ["GGG", "ooo", "GGG"],
  happy: ["ooo", "oGo", "GGG"],
  surprised: ["www", "wkw", "www"],
  dizzy: ["oGo", "GoG", "oGo"],
  sad: ["www", "wkk", "wkk"],
  heart: ["RGR", "RRR", "GRG"],
  sleepy: ["ooo", "wkk", "wkk"],
};

type Cell = [row: number, col: number, ch: string];
const MOUTH: Record<string, Cell[]> = {
  flat: [[8, 7, "o"], [8, 8, "o"], [8, 9, "o"], [8, 10, "o"]],
  smile: [[7, 6, "o"], [7, 11, "o"], [8, 7, "o"], [8, 8, "o"], [8, 9, "o"], [8, 10, "o"]],
  frown: [[7, 7, "o"], [7, 8, "o"], [7, 9, "o"], [7, 10, "o"], [8, 6, "o"], [8, 11, "o"]],
  open: [[7, 8, "o"], [7, 9, "o"], [8, 8, "o"], [8, 9, "o"], [9, 8, "o"], [9, 9, "o"]],
  yawn: [
    [7, 7, "o"], [7, 8, "o"], [7, 9, "o"], [7, 10, "o"],
    [8, 7, "o"], [8, 8, "P"], [8, 9, "P"], [8, 10, "o"],
    [9, 8, "o"], [9, 9, "o"],
  ],
};
const FACE_MOUTH: Record<string, string> = {
  happy: "smile",
  wink: "smile",
  heart: "smile",
  surprised: "open",
  sad: "frown",
  yawn: "yawn",
};

const FOOT = ["oSSo", "oSSo", "oooo"];
const SLEEP = [
  "...oooooooooooooo...",
  "..oGGGGGGGGGGGGGGo..",
  ".oHHGGGGGGGGGGGGGGo.",
  ".oGGGGGGGGGGGGGGGGo.",
  ".oGGoooGGGGGGoooGGo.",
  ".oGPPGGGGGGGGGGPPGo.",
  ".oSSSSSSSSSSSSSSSSo.",
  "..oooooooooooooooo..",
];

type Frame = { L: [number, number]; R: [number, number]; bob: number; sway: number };
const WALK: Frame[] = [
  { L: [1, -1], R: [-1, 0], bob: 0, sway: -1 },
  { L: [0, 0], R: [0, 0], bob: 1, sway: 0 },
  { L: [-1, 0], R: [1, -1], bob: 0, sway: 1 },
  { L: [0, 0], R: [0, 0], bob: 1, sway: 0 },
];
const RUN: Frame[] = [
  { L: [2, -2], R: [-2, 0], bob: 0, sway: 1 },
  { L: [0, -2], R: [0, -2], bob: -2, sway: 1 },
  { L: [-2, 0], R: [2, -2], bob: 0, sway: 1 },
  { L: [0, -2], R: [0, -2], bob: -2, sway: 1 },
];
const TIP: Frame[] = [
  { L: [0, -1], R: [0, 0], bob: -1, sway: 0 },
  { L: [0, 0], R: [0, 0], bob: -1, sway: 0 },
  { L: [0, 0], R: [0, -1], bob: -1, sway: 0 },
  { L: [0, 0], R: [0, 0], bob: -1, sway: 0 },
];
const STILL: Frame = { L: [0, 0], R: [0, 0], bob: 0, sway: 0 };

const COFFEE = ["oooo..", "oNNo..", "oCCooo", "oCCo.o", "oCCooo", "oooo.."];
const LAPTOP = [
  ".oooooooooo.",
  ".oLLLLLLLLo.",
  ".oLLLYYLLLo.",
  "oooooooooooo",
  "oLLLLLLLLLLo",
  "oooooooooooo",
];
const HEART = [".R.R.", "RRRRR", ".RRR.", "..R.."];
const DROP = [".D.", ".D.", "DDD", "DDD"];
// A snowflake: a white plus with a blue-grey shadow cell behind it, so it still shows on a pale sky.
const FLAKE_SHADOW = ["....", "..E.", ".EEE", "..E."];
const FLAKE = [".F..", "FFF.", ".F.."];
const STAR_POS: [number, number][] = [[3, 3], [12, 0], [20, 3], [12, 6]];
const WAVE1 = ["ooo.", "oGo.", "oGo.", "oGo.", "oGo.", "oGo."];
const WAVE2 = [".ooo", ".oGo", "oGo.", "oGo.", "oGo.", "oGo."];
const ARM_UP = ["ooo", "oGo", "oGo", "oGo", "oGo", "oGo"];

const XO = 3;
const OFF = 9;
const W = CRITTER_W;
const H = CRITTER_H;

const PALETTE: Record<string, string> = {
  o: "#1B5E3F",
  G: "#6BF59A",
  S: "#3FBF72",
  H: "#C4FFDD",
  w: "#FFFFFF",
  k: "#131418",
  P: "#FF9DB5",
  Y: "#FFC933",
  R: "#E5484D",
  C: "#F4F1EA",
  D: "#62B6FF",
  E: "#8FA6C2",
  F: "#FFFFFF",
  N: "#6B4226",
  T: "#D8DCE8",
  L: "#8A90A6",
};
// Painted in this order, so later colours sit on top of earlier ones.
const ORDER = "oGSHwkPYRCDNTLEF";

type Grid = string[][];
const makeGrid = (): Grid => Array.from({ length: H }, () => new Array<string>(W).fill("."));

function stamp(g: Grid, rows: string[], x0: number, y0: number) {
  rows.forEach((r, j) => {
    for (let i = 0; i < r.length; i++) {
      if (r[i] === ".") continue;
      const x = x0 + i;
      const y = y0 + j;
      if (x >= 0 && x < W && y >= 0 && y < H) g[y][x] = r[i];
    }
  });
}

function umbrella(g: Grid) {
  const widths = [10, 14, 18, 20];
  widths.forEach((w, j) => {
    const x0 = 13 - w / 2;
    const y = 1 + j;
    for (let i = 0; i < w; i++) {
      const edge = i === 0 || i === w - 1;
      g[y][x0 + i] = edge ? "o" : Math.floor(i / 3) % 2 === 0 ? "R" : "C";
      if (j === 0) g[y - 1][x0 + i] = "o";
    }
  });
  for (let i = 0; i < 20; i += 2) g[5][3 + i] = "o";
  for (let y = 6; y < OFF + 4; y++) {
    g[y][12] = "o";
    g[y][13] = "o";
  }
}

function toLayers(g: Grid): Layer[] {
  const by: Record<string, string[]> = {};
  for (let y = 0; y < H; y++) {
    let x = 0;
    while (x < W) {
      const ch = g[y][x];
      if (ch === ".") {
        x++;
        continue;
      }
      let x2 = x;
      while (x2 < W && g[y][x2] === ch) x2++;
      (by[ch] ??= []).push(`M${x} ${y}h${x2 - x}v1h-${x2 - x}z`);
      x = x2;
    }
  }
  return ORDER.split("")
    .filter((c) => by[c])
    .map((c) => ({ fill: PALETTE[c], d: by[c].join("") }));
}

export function composeCritter(p: CritterPose): Layer[] {
  const pose = p.pose ?? "stand";
  const lift = p.lift ?? 0;
  const hop = lift > 0;
  const squash = p.squash ?? 0;
  const umb = !!p.umbrella && pose !== "sleep" && !hop;
  const g = makeGrid();
  if (umb) umbrella(g);

  let face: Face | "side" | "up" | "shut" = p.face ?? "auto";

  if (pose === "sleep") {
    stamp(g, SLEEP, XO, OFF + 9 + (p.breathe ? -1 : 0));
  } else {
    const step = (((p.step ?? 0) % 4) + 4) % 4;
    const f =
      pose === "walk" ? WALK[step] : pose === "run" ? RUN[step] : pose === "tiptoe" ? TIP[step] : STILL;
    const sit = pose === "sit";
    const base = OFF + 4 + (sit ? 2 : 0) + (squash > 0 ? 1 : 0) + (squash < 0 ? -1 : 0);
    const top = base + f.bob;
    if (!umb) {
      const dx = p.wag ? 1 : 0;
      stamp(g, ["oYYo", "oYYo"], 11 + dx, top - 4);
      stamp(g, ["oo", "oo"], 12 + dx, top - 2);
    }
    const feet = () => {
      if (hop) return;
      if (sit) {
        stamp(g, ["oooo"], 4 + XO - 1, OFF + 16);
        stamp(g, ["oooo"], 12 + XO + 1, OFF + 16);
        return;
      }
      const spread = squash > 0 ? 1 : 0;
      stamp(g, FOOT, 4 + XO + f.L[0] - spread, OFF + 14 + f.L[1]);
      stamp(g, FOOT, 12 + XO + f.R[0] + spread, OFF + 14 + f.R[1]);
    };
    feet();

    const body = BODY.map((r) => r.split(""));
    if (face === "auto") face = p.blink ? "shut" : p.look === "up" ? "up" : "side";
    let eyeL = EYES[face] ?? EYES.side;
    let eyeR = eyeL;
    if (face === "wink") {
      eyeL = EYES.side;
      eyeR = EYES.shut;
    }
    if (face === "yawn") {
      eyeL = EYES.shut;
      eyeR = EYES.shut;
    }
    for (let j = 0; j < 3; j++) {
      for (let i = 0; i < 3; i++) {
        body[4 + j][5 + i] = eyeL[j][i];
        body[4 + j][12 + i] = eyeR[j][i];
      }
    }
    if (face === "sad") {
      body[3][6] = "o";
      body[3][7] = "o";
      body[3][12] = "o";
      body[3][13] = "o";
      body[7][5] = "D";
    }
    MOUTH[FACE_MOUTH[face] ?? "flat"].forEach(([r, c, ch]) => {
      body[r][c] = ch;
    });
    if (hop) {
      // Feet tucked in: leave a gap under the body.
      body[8] = ".oGGGGGoooGGGGGGGGo.".split("");
      body[9] = ".oSSSSSoooSSSSSSSSo.".split("");
      if (face === "happy" || face === "heart") body[8][6] = "o";
    }
    const rows = body.map((r) => r.join(""));
    // Squash removes a row; stretch repeats one, keeping the feet where they are.
    if (squash > 0) rows.splice(5, 1);
    if (squash < 0) rows.splice(5, 0, rows[5]);
    stamp(g, rows, f.sway + XO, top);
    feet();

    let arms: Arms = p.arms ?? "none";
    if (squash < 0 && arms === "none") arms = "up";
    const sw = f.sway;
    if (arms === "up") {
      stamp(g, ARM_UP, 21 + sw, top - 3);
      stamp(g, ARM_UP, 2 + sw, top - 3);
    } else if (arms === "wave1" || arms === "wave2") {
      stamp(g, arms === "wave2" ? WAVE2 : WAVE1, 21 + sw, top - 2);
      stamp(g, ["oGo", "oGo"], 2 + sw, top + 6);
    }
    if (p.item === "coffee") {
      const rise = p.itemT ? 1 : 0;
      stamp(g, COFFEE, 20 + sw, top + 3);
      g[top + 1 - rise][22 + sw + rise] = "T";
      g[top - 1 - rise][22 + sw + (p.itemT ? 0 : 1)] = "T";
      stamp(g, ["oGo", "oGo"], 2 + sw, top + 6);
    }
    if (p.item === "laptop") {
      stamp(g, LAPTOP, 7 + sw, top + 7);
      // Two hands on the keys, one pressing at a time.
      stamp(g, ["GG"], p.itemT ? 9 : 11, top + 11);
      stamp(g, ["GG"], p.itemT ? 15 : 13, top + 11);
    }
  }

  if (p.heart && pose !== "sleep") stamp(g, HEART, 11, OFF + 4 - 4 - p.heart - 3);
  if (p.drop && pose !== "sleep") stamp(g, DROP, 11, OFF + 4 - 4 - p.drop - 4);
  if (p.flake && pose !== "sleep") {
    stamp(g, FLAKE_SHADOW, 11, OFF + 4 - 4 - p.flake - 4);
    stamp(g, FLAKE, 11, OFF + 4 - 4 - p.flake - 4);
  }
  if (p.stars && pose !== "sleep") {
    for (let i = 0; i < 3; i++) {
      const s = STAR_POS[(p.stars + i) % 4];
      stamp(g, ["YY", "YY"], s[0] + 1, OFF - 1 + s[1]);
    }
  }
  return toLayers(g);
}
