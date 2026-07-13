import type { MouseEvent } from "react";

/** Height of the fixed header — headings would otherwise sit under it. */
export const NAV_OFFSET = 72;

const DURATION = 900;

/**
 * Reduced-motion users still get an animated scroll, just a brisk one.
 *
 * Scrolling to a section is navigation, not decoration: teleporting the page
 * costs you your sense of place, which is the very thing the preference exists
 * to protect. What triggers vestibular symptoms is large-scale parallax, spin
 * and zoom — all of which we do disable. A short linear-ish scroll doesn't.
 */
const REDUCED_DURATION = 320;

/** Matches the site's motion curve (the same easing Framer uses elsewhere). */
function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

let animation = 0;

/**
 * Animate the scroll ourselves rather than relying on the browser's native
 * smooth scrolling. Native `behavior: "smooth"` gives no control over duration
 * or easing, and some environments ignore it entirely and jump. A rAF loop is
 * predictable everywhere and lets the scroll match the site's motion.
 */
function animateScrollTo(top: number, duration: number) {
  cancelAnimationFrame(animation);

  const start = window.scrollY;
  const delta = top - start;
  if (Math.abs(delta) < 2) return;

  const started = performance.now();

  const step = (now: number) => {
    const t = Math.min((now - started) / duration, 1);
    window.scrollTo(0, start + delta * easeInOutCubic(t));
    if (t < 1) animation = requestAnimationFrame(step);
  };

  animation = requestAnimationFrame(step);
}

/** A user scrolling mid-animation should take back control immediately. */
if (typeof window !== "undefined") {
  window.addEventListener(
    "wheel",
    () => cancelAnimationFrame(animation),
    { passive: true },
  );
  window.addEventListener(
    "touchstart",
    () => cancelAnimationFrame(animation),
    { passive: true },
  );
}

/**
 * Smooth-scrolls to an in-page section.
 *
 * Anchor hrefs are written as "/#about" so they still work as real links from
 * /blog and /resume. On the home page Next intercepts those as route pushes,
 * which jump instantly — so handle them here instead.
 *
 * Returns true if it handled the scroll; false if the caller should let the
 * link navigate normally.
 */
export function scrollToSection(href: string): boolean {
  if (typeof window === "undefined") return false;

  const onHome = window.location.pathname === "/";

  // A bare "#section" is same-page wherever we are (the case-study table of
  // contents uses these). The "/#section" form, though, is a real navigation
  // from /blog or /work — only treat it as a scroll while we're on the home
  // page, and otherwise let the router handle it.
  const isBareHash = href.startsWith("#");
  if (!isBareHash && !onHome) return false;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const duration = reduced ? REDUCED_DURATION : DURATION;

  // The wordmark ("/" or "#") means "back to the top".
  if (href === "/" || href === "#") {
    animateScrollTo(0, duration);
    history.replaceState(null, "", onHome ? "/" : window.location.pathname);
    return true;
  }

  const hash = isBareHash ? href : href.startsWith("/#") ? href.slice(1) : null;

  if (!hash) return false;

  const target = document.querySelector(hash);
  if (!target) return false;

  const top = target.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;

  animateScrollTo(top, duration);

  // Keep the URL in step without triggering another jump.
  history.replaceState(null, "", hash);
  return true;
}

/**
 * Click handler for any in-page anchor. Leaves modified clicks (open in new
 * tab, middle-click) and off-page links to the browser.
 */
export function onAnchorClick(e: MouseEvent<HTMLAnchorElement>) {
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
  if (scrollToSection(e.currentTarget.getAttribute("href") ?? "")) {
    e.preventDefault();
  }
}
