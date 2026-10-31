import { Critter } from "./critter";
import { CRITTER_BODY_ROWS, CRITTER_W, type CritterPose } from "@/lib/critter-sprite";

type Props = CritterPose & {
  u: number;
  flip?: number;
  bubble?: string;
  /** Step of the rising z's, 0 to 11. Only shown while asleep. */
  zt?: number;
};

/**
 * The critter plus the things that float around it: a speech bubble and,
 * while it sleeps, three z's that rise and fade one after another.
 */
export function CritterFigure({ u, flip, bubble, zt = 0, ...pose }: Props) {
  const sleeping = pose.pose === "sleep";
  const bubbleBottom = sleeping ? 8 * u + 8 : pose.umbrella ? 26 * u + 10 : CRITTER_BODY_ROWS * u + 10;
  const lift = pose.lift ?? 0;

  return (
    <div
      style={{
        position: "relative",
        width: CRITTER_W * u,
        height: CRITTER_BODY_ROWS * u,
        top: -lift * u,
      }}
    >
      {bubble && (
        <span
          className="px-label"
          style={{
            position: "absolute",
            left: "50%",
            bottom: bubbleBottom,
            transform: "translateX(-50%)",
            zIndex: 2,
            padding: "4px 8px",
            fontSize: 14,
            fontWeight: 600,
            whiteSpace: "nowrap",
            color: "#131418",
            background: "#ECECF0",
            boxShadow: "3px 3px 0 #07080B",
          }}
        >
          {bubble}
        </span>
      )}
      {sleeping &&
        [0, 1, 2].map((i) => {
          const ph = ((((zt + i * 4) % 12) + 12) % 12) / 12;
          const opacity = ph < 0.12 ? ph / 0.12 : 1 - ph;
          return (
            <span
              key={i}
              aria-hidden="true"
              style={{
                position: "absolute",
                left: `${Math.round(62 + ph * 14)}%`,
                bottom: Math.round(8 * u + 8 + ph * 7 * u),
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: Math.round(11 + ph * 9),
                color: "#9B7BFF",
                opacity,
                pointerEvents: "none",
              }}
            >
              z
            </span>
          );
        })}
      <div style={{ position: "absolute", left: 0, bottom: 0 }}>
        <Critter u={u} flip={flip} {...pose} />
      </div>
    </div>
  );
}
