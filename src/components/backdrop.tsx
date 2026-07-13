/**
 * The page backdrop: a single, barely-there static dot grid behind the hero,
 * masked so it fades out before the content sections. No animation, no colour —
 * just enough texture to feel intentional. Minimal by design.
 */
export function Backdrop() {
  return <div className="hero-grid" aria-hidden="true" />;
}
