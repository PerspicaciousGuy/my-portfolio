"use client";

import dynamic from "next/dynamic";
import { useCapability } from "@/lib/use-capability";

// Dynamically imported so three.js never blocks first paint, and is never
// even downloaded on devices that fall back.
const Scene = dynamic(
  () => import("@/components/three/scene").then((m) => m.Scene),
  { ssr: false },
);

/**
 * Chooses between the live WebGL scene and the static backdrop.
 * Renders the static one during detection so there's never a flash of nothing.
 */
export function Backdrop() {
  const { canRender3D } = useCapability();

  if (canRender3D === true) {
    return <Scene />;
  }

  return (
    <div
      className="fallback-backdrop fixed inset-0 -z-10 overflow-hidden"
      aria-hidden="true"
    />
  );
}
