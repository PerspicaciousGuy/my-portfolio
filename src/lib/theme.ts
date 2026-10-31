/**
 * Theme model shared by the inline pre-paint script, the hook and the backdrop.
 *
 * Three modes: "night" (the default design), "day", and "auto", which follows
 * the visitor's clock. Night is a dark theme, day is a light one; the choice
 * is stored in localStorage and applied as the `dark` class on <html>.
 */
export type ThemeMode = "night" | "auto" | "day";

export const THEME_KEY = "hb-theme";

/** Night runs from 18:30 to 06:30. The same cut-off drives the sky. */
export function isNightHour(hour: number) {
  return hour < 6.5 || hour >= 18.5;
}

export function resolveNight(mode: ThemeMode, hour: number) {
  return mode === "night" || (mode === "auto" && isNightHour(hour));
}

export const NEXT_MODE: Record<ThemeMode, ThemeMode> = {
  night: "auto",
  auto: "day",
  day: "night",
};
