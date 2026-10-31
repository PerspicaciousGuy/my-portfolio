/**
 * The three skylines behind the page, as [width, height, windows[x, y]] for
 * every building from left to right. Window thresholds come from a hash so
 * the city lights up in the same scattered order every time.
 */
export type Building = readonly [w: number, h: number, windows: readonly (readonly [number, number])[]];

export const FAR: readonly Building[] = [
  [130, 120, []],
  [150, 170, [[22, 24], [52, 24], [82, 24], [22, 60], [82, 60]]],
  [120, 110, [[20, 20]]],
  [140, 210, [[20, 30], [56, 30], [20, 70], [92, 70], [56, 110]]],
  [160, 150, [[30, 30], [70, 30]]],
  [130, 260, [[24, 28], [56, 28], [24, 68], [56, 68], [24, 108], [88, 108], [56, 148]]],
  [150, 200, [[30, 30]]],
  [120, 290, [[20, 40], [60, 40], [20, 88], [60, 88], [60, 136], [20, 136]]],
  [160, 180, [[40, 40], [100, 40]]],
  [140, 240, [[28, 36], [72, 36], [28, 80], [72, 124]]],
  [130, 160, []],
  [150, 220, [[30, 30], [80, 70]]],
];

export const MID: readonly Building[] = [
  [170, 100, [[26, 24], [70, 24]]],
  [150, 160, [[24, 30], [64, 30], [104, 30], [24, 74], [104, 74]]],
  [190, 120, [[30, 26], [90, 26], [150, 26]]],
  [140, 210, [[22, 32], [60, 32], [98, 32], [22, 76], [98, 76], [60, 120]]],
  [180, 140, [[34, 28], [100, 28]]],
  [160, 190, [[26, 30], [66, 30], [106, 30], [66, 74], [26, 118]]],
  [200, 110, []],
  [150, 170, [[24, 30], [64, 30], [104, 30], [64, 76]]],
  [170, 130, [[30, 26], [90, 26]]],
];

export const NEAR: readonly Building[] = [
  [220, 90, []],
  [180, 140, [[30, 30], [110, 30]]],
  [240, 100, [[40, 28]]],
  [200, 170, [[28, 30], [68, 30], [108, 30], [28, 70], [148, 70]]],
  [220, 130, [[40, 30], [100, 30]]],
  [260, 200, [[36, 32], [80, 32], [124, 32], [80, 72], [168, 72], [36, 112]]],
  [180, 150, [[30, 30]]],
  [200, 120, [[30, 26], [74, 26]]],
];

export function hash3(a: number, b: number, c: number) {
  const x = Math.sin(a * 127.1 + b * 311.7 + c * 74.7) * 43758.5453;
  return x - Math.floor(x);
}

/** Facts a clicked window shows. Only things the site already states. */
export const WINDOW_FACTS = [
  "BCA: a three-year degree in computer applications.",
  "Started writing code in public with a first repo, learning in the open.",
  "Built Telegram bots and a URL shortener with Node, Express and MongoDB.",
  "Shipped REST APIs with JWT auth, PostgreSQL, validation and an OpenAPI spec.",
  "ExercisesDB: a metered API product, live in production, 116 tests.",
  "Open to work. Email is the fastest way to reach me.",
] as const;
