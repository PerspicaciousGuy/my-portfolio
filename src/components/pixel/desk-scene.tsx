import { DESK_COLORS as K, DESK_SCENE as D } from "@/lib/desk-scene";

/**
 * The animated night desk for the About portrait. Fills its positioned parent, anchored to the
 * bottom: a taller box shows more sky, a shorter one crops the top. All motion is CSS (.px-desk).
 * Animated elements sit inside a plain positioning <g> because a CSS transform replaces the
 * transform attribute on the same element.
 */
export function DeskScene() {
  return (
    <svg
      viewBox={`0 0 ${D.w} ${D.h}`}
      preserveAspectRatio="xMidYMax slice"
      shapeRendering="crispEdges"
      role="img"
      aria-label="Pixel scene: a night desk with a monitor showing code, a lamp, a coffee mug and the critter at the keyboard, under a starry sky"
      className="px-desk absolute inset-0 size-full"
    >
      {D.base.map((l, i) => (
        <path key={i} fill={l.fill} d={l.d} />
      ))}
      {D.stars.map((s, i) => (
        <rect
          key={i}
          className="px-tw"
          x={s.x}
          y={s.y}
          width={1}
          height={1}
          fill={s.fill}
          style={{
            animationDuration: `${s.dur.toFixed(1)}s`,
            animationDelay: `-${s.delay.toFixed(1)}s`,
          }}
        />
      ))}
      {D.windows.map((w, i) => (
        <rect
          key={i}
          className="px-wb"
          x={w.x}
          y={w.y}
          width={1}
          height={1}
          fill={K.yellow}
          style={{
            animationDuration: `${w.dur.toFixed(1)}s`,
            animationDelay: `-${w.delay.toFixed(1)}s`,
          }}
        />
      ))}
      <g transform="translate(4 25)">
        <path className="px-cd" d={D.cloudA} fill="#222538" />
      </g>
      <g transform="translate(26 34)">
        <path className="px-cd px-cd2" d={D.cloudB} fill="#1F2234" />
      </g>
      <g transform="translate(0 9)">
        <g className="px-plane">
          <path d={D.plane} fill={K.mute} />
          <rect
            className="px-plane-light"
            x={0}
            y={-1}
            width={1}
            height={1}
            fill="#E5484D"
          />
        </g>
      </g>
      <g transform="translate(46 5)">
        <g className="px-shoot">
          <rect width={1} height={1} fill={K.ink} />
          <rect x={1} y={-1} width={1} height={1} fill={K.mute} />
          <rect x={2} y={-1} width={1} height={1} fill={K.edge} />
        </g>
      </g>
      <path
        className="px-lamp"
        d={D.lampGlow}
        fill="#3B3622"
        transform="translate(5 64)"
      />
      {D.lines.map((l, i) => (
        <g key={i} className={`px-ln px-t${i}`}>
          {l.segs.map((g, k) => (
            <rect
              key={k}
              x={l.x + g.x}
              y={l.y}
              width={g.w}
              height={1}
              fill={g.fill}
            />
          ))}
        </g>
      ))}
      <rect
        className="px-cur"
        x={28}
        y={66}
        width={2}
        height={2}
        fill={K.yellow}
      />
      {D.keyFlashes.map((k, i) => (
        <rect
          key={i}
          className="px-ky"
          x={k.x}
          y={81}
          width={2}
          height={1}
          fill={K.yellow}
          style={{
            animationDuration: `${k.dur.toFixed(2)}s`,
            animationDelay: `-${k.delay.toFixed(2)}s`,
          }}
        />
      ))}
      <rect
        className="px-st"
        x={44}
        y={69}
        width={1}
        height={2}
        fill="#D8DCE8"
      />
      <rect
        className="px-st px-st2"
        x={46}
        y={67}
        width={1}
        height={3}
        fill="#D8DCE8"
      />
      <g transform="translate(19 78)">
        <g className="px-bob">
          {D.critter.map((l, i) => (
            <path key={i} fill={l.fill} d={l.d} />
          ))}
          <rect
            className="px-blink"
            x={3}
            y={5}
            width={2}
            height={1}
            fill="#1B5E3F"
          />
          <rect
            className="px-blink"
            x={7}
            y={5}
            width={2}
            height={1}
            fill="#1B5E3F"
          />
        </g>
      </g>
    </svg>
  );
}
