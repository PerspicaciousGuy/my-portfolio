"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { navLinks } from "@/data/site";

const BURGER = "M0 0h6v1H0zM0 2h6v1H0zM0 4h6v1H0z";
const CROSS = "M0 0h2v1H0zM5 0h2v1H5zM1 1h2v1H1zM4 1h2v1H4zM2 2h3v1H2zM3 3h1v1H3zM2 4h3v1H2zM1 5h2v1H1zM4 5h2v1H4zM0 6h2v1H0zM5 6h2v1H5z";
const CHEVRON = "M0 0h1v1H0zM1 1h1v1H1zM2 2h1v1H2zM3 3h1v1H3zM2 4h1v1H2zM1 5h1v1H1z";

/**
 * Phone navigation: a MENU button in the bar and a pixel sheet that drops from it.
 * Rendered inside the sticky header, so the sheet and its scrim hang off the bar
 * (`top-full`) and never cover it. Hidden from `md` up, where the links sit inline.
 */
export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const sheetId = useId();

  // Escape closes (and hands focus back), widening the window closes, and the page behind does not scroll.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      button.current?.focus();
    };
    const wide = window.matchMedia("(min-width: 768px)");
    const onWide = () => wide.matches && setOpen(false);
    window.addEventListener("keydown", onKey);
    wide.addEventListener("change", onWide);
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      wide.removeEventListener("change", onWide);
      document.documentElement.style.overflow = prev;
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <button
        ref={button}
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls={sheetId}
        onClick={() => setOpen((v) => !v)}
        className={`px-label ml-2 mr-[3px] inline-flex min-h-11 cursor-pointer items-center gap-2.5 px-3 text-[16px] font-semibold md:hidden ${
          open ? "text-accent" : "text-fg"
        }`}
        style={{
          boxShadow: `-3px 0 0 rgb(var(--${open ? "accent" : "border"})), 3px 0 0 rgb(var(--${open ? "accent" : "border"})), 0 -3px 0 rgb(var(--${open ? "accent" : "border"})), 0 3px 0 rgb(var(--${open ? "accent" : "border"}))`,
        }}
      >
        {open ? "Close" : "Menu"}
        <svg width="18" height="14" viewBox={open ? "0 0 7 7" : "0 0 6 5"} shapeRendering="crispEdges" fill="currentColor" aria-hidden="true">
          <path d={open ? CROSS : BURGER} />
        </svg>
      </button>

      {open && (
        <>
          <div data-nobd className="absolute inset-x-0 top-full h-dvh bg-[rgb(var(--shade)/0.8)] md:hidden" onClick={close} aria-hidden="true" />
          <nav
            id={sheetId}
            aria-label="Primary"
            data-nobd
            className="px-panel-hi absolute inset-x-2 top-full z-10 mx-0 mb-0 mt-2 px-5 pb-[22px] pt-1 md:hidden"
          >
            <ul className="m-0 list-none p-0">
              {navLinks.map((l, i) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={close}
                    className="flex min-h-[60px] items-center gap-4 border-b-4 border-raised"
                  >
                    <span className="w-7 text-[22px] text-green">{String(i + 1).padStart(2, "0")}</span>
                    <span className="px-label flex-1 text-[24px] font-semibold text-fg">{l.label}</span>
                    <svg width="12" height="18" viewBox="0 0 4 6" shapeRendering="crispEdges" fill="currentColor" className="text-fg-muted" aria-hidden="true">
                      <path d={CHEVRON} />
                    </svg>
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/resume" onClick={close} className="px-btn px-btn-ghost mt-[22px] w-full justify-center">
              Résumé
            </Link>
          </nav>
        </>
      )}
    </>
  );
}
