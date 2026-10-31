/**
 * Procedural pixel cars: rectangles stamped into a grid and turned into one
 * SVG path per colour. No art files. Kinds: sedan, van, bus.
 */
export type CarKind = "sedan" | "van" | "bus";
export type CarLayer = { id: string; fill: string; d: string };

type Grid = string[][];

function rect(g: Grid, x: number, y: number, w: number, h: number, ch: string) {
  for (let j = y; j < y + h; j++) {
    for (let i = x; i < x + w; i++) {
      if (g[j] && i >= 0 && i < g[j].length) g[j][i] = ch;
    }
  }
}

const PAL: Record<string, string> = {
  o: "#15161B",
  w: "#9FD4F5",
  k: "#2B2D36",
  h: "#C7CBD8",
  Y: "#FFE27A",
  R: "#E5484D",
  x: "rgba(0,0,0,.22)",
};

export function makeCar(kind: CarKind, body: string): { w: number; h: number; layers: CarLayer[] } {
  const w = kind === "bus" ? 40 : 24;
  const h = kind === "bus" ? 14 : 13;
  const g: Grid = Array.from({ length: h }, () => new Array<string>(w).fill("."));
  const wheel = (x: number, y: number, size: number) => {
    rect(g, x, y, size, size, "o");
    rect(g, x + 1, y + 1, size - 2, size - 2, "k");
    rect(g, x + 2, y + 2, 1, 1, "h");
  };

  if (kind === "bus") {
    rect(g, 1, 0, 38, 10, "o");
    rect(g, 2, 1, 36, 8, "b");
    for (let i = 0; i < 6; i++) rect(g, 4 + i * 5, 2, 4, 3, "w");
    rect(g, 36, 2, 2, 5, "w");
    rect(g, 2, 7, 36, 1, "x");
    rect(g, 37, 5, 2, 2, "Y");
    rect(g, 1, 5, 1, 2, "R");
    wheel(7, 8, 5);
    wheel(29, 8, 5);
  } else {
    const roofX = kind === "van" ? 2 : 5;
    const roofW = kind === "van" ? 17 : 12;
    rect(g, roofX, 0, roofW, 5, "o");
    rect(g, roofX + 1, 1, roofW - 2, 3, "w");
    rect(g, roofX + Math.floor(roofW / 2) - 1, 1, 1, 3, "b");
    rect(g, 1, 4, 22, 6, "o");
    rect(g, 2, 5, 20, 4, "b");
    rect(g, 2, 8, 20, 1, "x");
    rect(g, 21, 5, 2, 2, "Y");
    rect(g, 1, 5, 1, 2, "R");
    wheel(3, 8, 5);
    wheel(16, 8, 5);
  }

  const by: Record<string, string[]> = {};
  g.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const ch = row[x];
      if (ch === ".") {
        x++;
        continue;
      }
      let x2 = x;
      while (x2 < row.length && row[x2] === ch) x2++;
      (by[ch] ??= []).push(`M${x} ${y}h${x2 - x}v1h-${x2 - x}z`);
      x = x2;
    }
  });
  const layers = Object.keys(by).map((ch) => ({ id: ch, fill: ch === "b" ? body : PAL[ch], d: by[ch].join("") }));
  return { w, h, layers };
}
