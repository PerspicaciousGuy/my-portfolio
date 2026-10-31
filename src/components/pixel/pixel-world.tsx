"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Decorative, interactive-only pieces: none of them is needed for first paint,
// so they load as separate chunks once the browser is idle.
const Backdrop = dynamic(() => import("./backdrop").then((m) => m.Backdrop), { ssr: false });
const Sparks = dynamic(() => import("./sparks").then((m) => m.Sparks), { ssr: false });
const Palette = dynamic(() => import("./palette").then((m) => m.Palette), { ssr: false });

/** Mounts the sky, click sparks and command palette after first paint, when the main thread is idle. */
export function PixelWorld() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const go = () => setReady(true);
    // Safari has no requestIdleCallback, so feature-detect it rather than trust the DOM typings.
    const idle = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    if (idle.requestIdleCallback) {
      const id = idle.requestIdleCallback(go, { timeout: 1500 });
      return () => idle.cancelIdleCallback?.(id);
    }
    const t = window.setTimeout(go, 300);
    return () => window.clearTimeout(t);
  }, []);

  if (!ready) return null;
  return (
    <>
      <Backdrop />
      <Sparks />
      <Palette />
    </>
  );
}
