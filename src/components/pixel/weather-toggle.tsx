"use client";

import { useWeather, type WeatherMode } from "@/lib/weather";

const LABEL: Record<WeatherMode, string> = {
  auto: "Weather: automatic. Click for rain.",
  rain: "Rain on. Click for snow.",
  snow: "Snow on. Click to turn the weather off.",
  off: "Weather off. Click for automatic weather.",
};

// One cloud, and under it whatever is falling: dashes for rain, scattered dots for snow, a mix for auto.
const CLOUD = "M3 1h4v1H3zM2 2h2v1H2zM6 2h3v1H6zM1 3h9v2H1z";
const FALLING: Record<WeatherMode, string> = {
  auto: "M2 6h1v1H2zM3 7h1v1H3zM7 6h1v1H7zM5 8h1v1H5zM9 7h1v1H9z",
  rain: "M2 6h1v1H2zM5 6h1v1H5zM8 6h1v1H8zM3 7h1v1H3zM6 7h1v1H6z",
  snow: "M2 6h1v1H2zM6 6h1v1H6zM4 7h1v1H4zM8 7h1v1H8zM2 8h1v1H2zM6 8h1v1H6z",
  off: "",
};

/** Cycles automatic weather, rain, snow and off. */
export function WeatherToggle() {
  const { mode, cycle } = useWeather();
  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={LABEL[mode]}
      title={LABEL[mode]}
      className="inline-flex h-11 min-w-11 cursor-pointer items-center justify-center gap-1.5 text-fg"
    >
      <svg
        width="33"
        height="27"
        viewBox="0 0 11 9"
        shapeRendering="crispEdges"
        fill="currentColor"
        opacity={mode === "off" ? 0.55 : 1}
        aria-hidden="true"
      >
        <path d={CLOUD + FALLING[mode]} />
      </svg>
      <span className="px-label text-[11px]">{mode}</span>
    </button>
  );
}
