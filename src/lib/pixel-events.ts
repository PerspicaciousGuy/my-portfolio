/**
 * The pixel world talks to itself through window events, so the sky, the
 * critters, the road and the cheats never import each other. Each component
 * owns its timers and listens for what it cares about.
 */
export type CheatName = "party" | "ufo" | "rain" | "snow" | "lights";

export type PixelEvents = {
  /** The weather changed: rain, snow, or neither (both false). They never fall together. */
  "px-weather": { rain: boolean; snow: boolean };
  /** A plane has just come into view. */
  "px-plane": undefined;
  /** The critter's light switch was flipped. */
  "px-lights": { on: boolean };
  /** A UFO is hovering overhead. */
  "px-ufo": undefined;
  /** A cheat code, typed word or palette command fired. */
  "px-cheat": { name: CheatName };
};

export function emit<K extends keyof PixelEvents>(name: K, detail?: PixelEvents[K]) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(name, { detail }));
}

/** Subscribe to a pixel event. Returns the unsubscribe function. */
export function listen<K extends keyof PixelEvents>(
  name: K,
  handler: (detail: PixelEvents[K]) => void,
): () => void {
  const fn = (e: Event) => handler((e as CustomEvent<PixelEvents[K]>).detail);
  window.addEventListener(name, fn);
  return () => window.removeEventListener(name, fn);
}

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
