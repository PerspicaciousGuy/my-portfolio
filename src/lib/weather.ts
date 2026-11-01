"use client";

import { useCallback, useSyncExternalStore } from "react";
import { emit } from "./pixel-events";

/**
 * Rain and snow. "auto" runs a 40 s shower every three minutes and alternates rain and snow,
 * "rain", "snow" and "off" are the visitor's override, and the rain and snow cheats force a
 * shower for 25 s. A single one-second timer is shared by every subscriber and announces changes
 * with the px-weather event so the critters can react. Rain and snow never fall together.
 */
export type WeatherMode = "auto" | "rain" | "snow" | "off";
export type Sky = "rain" | "snow" | null;

const KEY = "hb-rain";
const NEXT: Record<WeatherMode, WeatherMode> = { auto: "rain", rain: "snow", snow: "off", off: "auto" };
const listeners = new Set<() => void>();
let timer = 0;
let forcedUntil = 0;
let forcedSky: Sky = null;
let lastSky: Sky = null;

function readMode(): WeatherMode {
  try {
    const v = window.localStorage.getItem(KEY);
    // "on" was the rain-only setting from before snow existed.
    if (v === "on") return "rain";
    return v === "rain" || v === "snow" || v === "off" ? v : "auto";
  } catch {
    return "auto";
  }
}

function skyAt(mode: WeatherMode, now: number): Sky {
  if (now < forcedUntil) return forcedSky;
  if (mode === "rain" || mode === "snow") return mode;
  if (mode === "off") return null;
  const t = now % 180_000;
  if (t > 100_000 && t < 140_000) return Math.floor(now / 180_000) % 2 === 0 ? "rain" : "snow";
  return null;
}

function check() {
  const sky = skyAt(readMode(), Date.now());
  if (sky !== lastSky) {
    lastSky = sky;
    emit("px-weather", { rain: sky === "rain", snow: sky === "snow" });
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!timer) timer = window.setInterval(check, 1000);
  return () => {
    listeners.delete(listener);
    if (!listeners.size) {
      window.clearInterval(timer);
      timer = 0;
    }
  };
}

const getSky = () => skyAt(readMode(), Date.now());

/** The weather right now. Components that mount mid-shower read it, because the px-weather event only fires on a change. */
export const currentSky = (): Sky => getSky();

function force(sky: Sky, ms: number) {
  forcedSky = sky;
  forcedUntil = Date.now() + ms;
  check();
}

export const triggerRain = (ms = 25_000) => force("rain", ms);
export const triggerSnow = (ms = 25_000) => force("snow", ms);

export function useWeather() {
  const mode = useSyncExternalStore<WeatherMode>(subscribe, readMode, () => "auto");
  const sky = useSyncExternalStore<Sky>(subscribe, getSky, () => null);

  const cycle = useCallback(() => {
    try {
      window.localStorage.setItem(KEY, NEXT[readMode()]);
    } catch {
      // Private mode: the choice just won't persist.
    }
    // A choice made by hand ends a cheat shower, so the button always does what it says.
    forcedUntil = 0;
    check();
  }, []);

  return { mode, sky, rain: sky === "rain", snow: sky === "snow", cycle };
}
