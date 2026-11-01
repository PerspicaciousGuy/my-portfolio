import { composeScene, type SceneKind, type SceneTheme } from "@/lib/scene-art";

function Svg({ kind, theme, className }: { kind: SceneKind; theme: SceneTheme; className?: string }) {
  const s = composeScene(kind, theme);
  return (
    <svg
      viewBox={`0 0 ${s.w} ${s.h}`}
      preserveAspectRatio="xMidYMax meet"
      shapeRendering="crispEdges"
      {...(theme === "night" ? { role: "img", "aria-label": s.label } : { "aria-hidden": true })}
      className={`${theme === "night" ? "hidden dark:block" : "block dark:hidden"} ${className ?? ""}`}
      style={{ background: s.bg }}
    >
      {s.layers.map((l, i) => (
        <path key={i} fill={l.fill} d={l.d} />
      ))}
    </svg>
  );
}

/**
 * A pixel scene as inline SVG, drawn twice: a night painting and a day version with the same objects
 * in daylight colours. The theme class on <html> shows one and hides the other, so there is no script
 * and no flash. Each scales with its box (never cropped: the scene is centred and sits on the bottom
 * edge, the rest is the scene's own background colour) and keeps hard edges.
 */
export function SceneArt({ kind, className }: { kind: SceneKind; className?: string }) {
  return (
    <>
      <Svg kind={kind} theme="night" className={className} />
      <Svg kind={kind} theme="day" className={className} />
    </>
  );
}
