"use client";

import { useState, type CSSProperties } from "react";
import { makeCar, type CarKind } from "@/lib/car-sprite";

const U = 3;

type Props = {
  kind: CarKind;
  body: string;
  /** 1 drives right, -1 drives left. */
  dir: 1 | -1;
  /** Distance of the car's wheels from the bottom of the ground block, px. */
  bottom: number;
  /** Seconds to cross the screen. */
  duration: number;
  /** Negative, so every car starts somewhere along the road. */
  delay: number;
};

/** A car on the road. It drives on a CSS animation; clicking it honks. */
export function Car({ kind, body, dir, bottom, duration, delay }: Props) {
  const [honk, setHonk] = useState(false);
  const car = makeCar(kind, body);

  return (
    <button
      type="button"
      className="rd-car"
      data-dir={dir}
      aria-label="Honk"
      onClick={() => {
        setHonk(true);
        window.setTimeout(() => setHonk(false), 900);
      }}
      style={{ bottom, "--dur": `${duration.toFixed(1)}s`, "--delay": `${delay.toFixed(1)}s` } as CSSProperties}
    >
      <span className="rd-car-in" style={{ transform: `scaleX(${dir})`, width: car.w * U, height: car.h * U }}>
        {honk && (
          <span
            className="px-label"
            style={{
              position: "absolute",
              left: "50%",
              bottom: car.h * U + 2,
              transform: `translateX(-50%) scaleX(${dir})`,
              padding: "3px 6px",
              fontSize: 13,
              whiteSpace: "nowrap",
              color: "#131418",
              background: "#ECECF0",
              boxShadow: "2px 2px 0 #07080B",
            }}
          >
            BEEP
          </span>
        )}
        <span className="rd-car-head" style={{ left: car.w * U }} />
        <svg
          width={car.w * U}
          height={car.h * U}
          viewBox={`0 0 ${car.w} ${car.h}`}
          shapeRendering="crispEdges"
          style={{ display: "block", overflow: "visible", animation: honk ? "rd-hop 0.2s steps(2) 4" : "none" }}
          aria-hidden="true"
        >
          {car.layers.map((l) => (
            <path key={l.id} fill={l.fill} d={l.d} />
          ))}
        </svg>
      </span>
    </button>
  );
}
