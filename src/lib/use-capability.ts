"use client";

import { useEffect, useState } from "react";

export type Capability = {
  /** Null until detection has run on the client. */
  canRender3D: boolean | null;
  prefersReducedMotion: boolean;
};

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ??
      canvas.getContext("webgl") ??
      canvas.getContext("experimental-webgl");
    return Boolean(gl);
  } catch {
    return false;
  }
}

/**
 * Decides whether this device should run the full WebGL scene.
 *
 * We bail out on: no WebGL, prefers-reduced-motion, low core count,
 * low reported memory, or a coarse pointer on a small screen (phones).
 * Everything else gets the real thing.
 */
export function useCapability(): Capability {
  const [state, setState] = useState<Capability>({
    canRender3D: null,
    prefersReducedMotion: false,
  });

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const evaluate = () => {
      const reduced = motionQuery.matches;

      const nav = navigator as Navigator & {
        deviceMemory?: number;
        hardwareConcurrency?: number;
      };

      const cores = nav.hardwareConcurrency ?? 4;
      const memory = nav.deviceMemory ?? 4;

      const smallCoarse =
        window.matchMedia("(pointer: coarse)").matches && window.innerWidth < 820;

      const capable =
        hasWebGL() && !reduced && cores >= 4 && memory >= 4 && !smallCoarse;

      setState({ canRender3D: capable, prefersReducedMotion: reduced });
    };

    evaluate();
    motionQuery.addEventListener("change", evaluate);
    return () => motionQuery.removeEventListener("change", evaluate);
  }, []);

  return state;
}
