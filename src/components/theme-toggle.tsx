"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";

  // The resolved theme is unknown during SSR, so anything derived from it
  // (label, icon) must stay neutral until mount or React reports a
  // hydration mismatch.
  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={mounted ? `Switch to ${isDark ? "light" : "dark"} theme` : "Toggle theme"}
      className="grid size-9 place-items-center rounded-full border border-border bg-bg-elevated/60 text-fg-muted backdrop-blur transition hover:border-accent/50 hover:text-accent"
    >
      {mounted && !isDark ? (
        <Sun className="size-4" />
      ) : (
        <Moon className="size-4" />
      )}
    </button>
  );
}
