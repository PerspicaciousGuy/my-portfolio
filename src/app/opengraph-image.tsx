import { ImageResponse } from "next/og";
import { site } from "@/data/site";

export const alt = `${site.name} — ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Deterministic scatter so the card is stable between builds. */
function dots() {
  let s = 20260711;
  const rng = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);

  return Array.from({ length: 90 }, () => ({
    x: 640 + rng() * 520,
    y: rng() * 630,
    r: 1 + rng() * 3,
    o: 0.15 + rng() * 0.75,
  }));
}

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#08080a",
          padding: "0 72px",
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        {dots().map((d, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: d.x,
              top: d.y,
              width: d.r,
              height: d.r,
              borderRadius: 99,
              background: "#f85858",
              opacity: d.o,
            }}
          />
        ))}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            color: "#f85858",
            fontSize: 24,
            fontFamily: "monospace",
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: 99,
              background: "#f85858",
            }}
          />
          Available for work
        </div>

        {/* Satori requires an explicit display on any node with >1 child. */}
        <div
          style={{
            display: "flex",
            marginTop: 24,
            fontSize: 92,
            fontWeight: 700,
            color: "#f5f5f4",
            letterSpacing: "-0.03em",
          }}
        >
          {site.name}
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 16,
            fontSize: 34,
            color: "#a0a0aa",
            maxWidth: 640,
          }}
        >
          {`${site.role} · ${site.location}`}
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 48,
            fontSize: 24,
            color: "#6e6e7a",
            fontFamily: "monospace",
          }}
        >
          github.com/PerspicaciousGuy
        </div>
      </div>
    ),
    size,
  );
}
