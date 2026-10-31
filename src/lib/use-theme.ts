"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  NEXT_MODE,
  resolveNight,
  THEME_KEY,
  type ThemeMode,
} from "./theme";

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // The clock matters in "auto" mode, and other tabs can change the mode.
  const timer = window.setInterval(listener, 60_000);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.clearInterval(timer);
    window.removeEventListener("storage", listener);
  };
}

function readMode(): ThemeMode {
  try {
    const v = window.localStorage.getItem(THEME_KEY);
    return v === "day" || v === "auto" || v === "night" ? v : "night";
  } catch {
    return "night";
  }
}

/** Hours since midnight, rounded to a tenth so the snapshot only changes every six minutes. */
function readHour() {
  const d = new Date();
  return Math.round((d.getHours() + d.getMinutes() / 60) * 10) / 10;
}

const SERVER_HOUR = 23;

export function useTheme() {
  const mode = useSyncExternalStore<ThemeMode>(subscribe, readMode, () => "night");
  const hour = useSyncExternalStore(subscribe, readHour, () => SERVER_HOUR);
  const isNight = resolveNight(mode, mode === "night" ? SERVER_HOUR : hour);

  const setMode = useCallback((next: ThemeMode) => {
    try {
      window.localStorage.setItem(THEME_KEY, next);
    } catch {
      // Private mode: the choice just won't persist.
    }
    emit();
  }, []);

  const cycle = useCallback(() => setMode(NEXT_MODE[readMode()]), [setMode]);

  return { mode, hour: mode === "night" ? SERVER_HOUR : mode === "day" ? 12 : hour, isNight, setMode, cycle };
}
