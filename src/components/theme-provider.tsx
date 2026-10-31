"use client";

import { useEffect, type ReactNode } from "react";
import { useTheme } from "@/lib/use-theme";

/**
 * Keeps the `dark` class on <html> in step with the theme store. The inline
 * script in the document head sets the first value before paint; this applies
 * every change after that.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const { isNight } = useTheme();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", isNight);
    root.style.colorScheme = isNight ? "dark" : "light";
  }, [isNight]);

  return <>{children}</>;
}
