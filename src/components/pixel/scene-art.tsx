import { composeScene, type SceneKind } from "@/lib/scene-art";

/**
 * A pixel scene as one inline SVG. It scales with its box (never cropped: the scene is centred and
 * sits on the bottom edge, the rest is the scene's own background colour) and keeps hard edges.
 * The art is a night painting on purpose, so it is the same in the day theme.
 */
export function SceneArt({
  kind,
  className,
}: {
  kind: SceneKind;
  className?: string;
}) {
  const s = composeScene(kind);
  return (
    <svg
      viewBox={`0 0 ${s.w} ${s.h}`}
      preserveAspectRatio="xMidYMax meet"
      shapeRendering="crispEdges"
      role="img"
      aria-label={s.label}
      className={`block ${className ?? ""}`}
      style={{ background: s.bg }}
    >
      {s.layers.map((l, i) => (
        <path key={i} fill={l.fill} d={l.d} />
      ))}
    </svg>
  );
}
