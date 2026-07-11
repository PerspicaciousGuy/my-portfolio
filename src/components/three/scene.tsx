"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { useTheme } from "next-themes";
import { ParticleField } from "./particle-field";

/**
 * The persistent backdrop. Renders the WebGL scene on capable devices and a
 * static CSS backdrop everywhere else. Mounted once, behind every section.
 */
export function Scene() {
  const scroll = useRef(0);
  const [visible, setVisible] = useState(true);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scroll.current = max > 0 ? window.scrollY / max : 0;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // Don't burn cycles rendering a tab nobody is looking at.
    const onVisibility = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 7.5], fov: 52 }}
        dpr={[1, 1.6]}
        frameloop={visible ? "always" : "never"}
        gl={{ antialias: false, powerPreference: "high-performance", alpha: true }}
      >
        <ParticleField scroll={scroll} isDark={isDark} />
      </Canvas>
    </div>
  );
}
