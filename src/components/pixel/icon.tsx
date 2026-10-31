/** Pixel glyphs on an 11 x 11 grid. Drawn as rects so they stay crisp at any size. */
const GLYPHS = {
  right: "M0 5h8v1H0zM6 3h1v1H6zM7 4h1v1H7zM7 6h1v1H7zM6 7h1v1H6zM8 5h1v1H8z",
  left: "M3 5h8v1H3zM4 3h1v1H4zM3 4h1v1H3zM3 6h1v1H3zM4 7h1v1H4zM2 5h1v1H2z",
  down: "M5 0h1v8H5zM3 6h1v1H3zM4 7h1v1H4zM6 7h1v1H6zM7 6h1v1H7zM5 8h1v1H5z",
  upright: "M2 8h1v1H2zM3 7h1v1H3zM4 6h1v1H4zM5 5h1v1H5zM6 4h1v1H6zM7 3h1v1H7zM4 2h5v1H4zM8 2h1v5H8z",
  book: "M1 1h4v1H1zM1 2h1v7H1zM1 8h4v1H1zM5 2h1v7H5zM6 1h4v1H6zM9 2h1v7H9zM6 8h4v1H6z",
  code: "M3 3h1v1H3zM2 4h1v1H2zM1 5h1v1H1zM2 6h1v1H2zM3 7h1v1H3zM7 3h1v1H7zM8 4h1v1H8zM9 5h1v1H9zM8 6h1v1H8zM7 7h1v1H7z",
} as const;

export type IconName = keyof typeof GLYPHS;

export function Icon({ name, size = 16, className }: { name: IconName; size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 11 11"
      shapeRendering="crispEdges"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d={GLYPHS[name]} />
    </svg>
  );
}
