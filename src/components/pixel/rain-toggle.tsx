"use client";

import { useWeather, type RainMode } from "@/lib/weather";

const LABEL: Record<RainMode, string> = {
  auto: "Weather: automatic. Click for rain.",
  on: "Rain on. Click to turn it off.",
  off: "Rain off. Click for automatic weather.",
};
const BADGE: Record<RainMode, string> = { auto: "auto", on: "on", off: "off" };

/** Cycles automatic weather, rain on and rain off. */
export function RainToggle() {
  const { mode, cycle } = useWeather();
  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={LABEL[mode]}
      title={LABEL[mode]}
      className="inline-flex h-11 min-w-11 cursor-pointer items-center justify-center gap-1.5 text-fg"
    >
      <svg width="33" height="27" viewBox="0 0 11 9" shapeRendering="crispEdges" fill="currentColor" aria-hidden="true">
        <path d="M3 1h4v1H3zM2 2h2v1H2zM6 2h3v1H6zM1 3h9v2H1zM2 6h1v1H2zM5 6h1v1H5zM8 6h1v1H8zM3 7h1v1H3zM6 7h1v1H6z" />
      </svg>
      <span className="px-label text-[11px]">{BADGE[mode]}</span>
    </button>
  );
}
