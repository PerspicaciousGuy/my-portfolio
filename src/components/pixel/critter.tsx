import { composeCritter, CRITTER_H, CRITTER_W, type CritterPose } from "@/lib/critter-sprite";

type Props = CritterPose & {
  /** Screen pixels per art pixel. */
  u?: number;
  /** -1 to 1; the sprite is mirrored with scaleX, so values between squash it for turns and spins. */
  flip?: number;
  className?: string;
};

/**
 * The critter as an inline SVG. Pure and server-renderable: the pose comes in
 * through props and the walker, card critters and the 404 game animate it by
 * changing them.
 */
export function Critter({ u = 5, flip = 1, className, ...pose }: Props) {
  const layers = composeCritter(pose);
  return (
    <svg
      width={CRITTER_W * u}
      height={CRITTER_H * u}
      viewBox={`0 0 ${CRITTER_W} ${CRITTER_H}`}
      shapeRendering="crispEdges"
      aria-hidden="true"
      className={className}
      style={{ display: "block", overflow: "visible", transform: `scaleX(${flip})`, transformOrigin: "50% 100%" }}
    >
      {layers.map((l) => (
        <path key={l.fill} fill={l.fill} d={l.d} />
      ))}
    </svg>
  );
}
