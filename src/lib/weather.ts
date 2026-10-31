"use client";

import { useCallback, useSyncExternalStore } from "react";
import { emit } from "./pixel-events";

/**
 * Rain. "auto" runs a 40 s shower every three minutes, "on" and "off" are the
 * visitor's override, and the rain cheat forces a shower for 25 s. A single
 * one-second timer is shared by every subscriber and announces changes with
 * the px-weather event so the critters can react.
 */
export type RainMode = "auto" | "on" | "off";

const KEY = "hb-rain";
const NEXT: Record<RainMode, RainMode> = { auto: "on", on: "off", off: "auto" };
const listeners = new Set<() => void>();
let timer = 0;
let forcedUntil = 0;
let lastRain = false;

function readMode(): RainMode {
  try {
    const v = window.localStorage.getItem(KEY);
    return v === "on" || v === "off" ? v : "auto";
  } catch {
    return "auto";
  }
}

function rainAt(mode: RainMode, now: number) {
  if (now < forcedUntil) return true;
  if (mode === "on") return true;
  if (mode === "off") return false;
  const t = now % 180_000;
  return t > 100_000 && t < 140_000;
}

function check() {
  const rain = rainAt(readMode(), Date.now());
  if (rain !== lastRain) {
    lastRain = rain;
    emit("px-weather", { rain });
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

const getRain = () => rainAt(readMode(), Date.now());

export function triggerRain(ms = 25_000) {
  forcedUntil = Date.now() + ms;
  check();
}

export function useWeather() {
  const mode = useSyncExternalStore<RainMode>(subscribe, readMode, () => "auto");
  const rain = useSyncExternalStore(subscribe, getRain, () => false);

  const cycle = useCallback(() => {
    try {
      window.localStorage.setItem(KEY, NEXT[readMode()]);
    } catch {
      // Private mode: the choice just won't persist.
    }
    check();
  }, []);

  return { mode, rain, cycle };
}
