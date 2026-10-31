/** Deterministic pseudo-random number in [0, 1) from a number, for layouts that must match on every render. */
export function hash(a: number) {
  const x = Math.sin(a * 91.7 + 13.1) * 43758.5453;
  return x - Math.floor(x);
}
