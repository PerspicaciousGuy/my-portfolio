"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { navLinks } from "@/data/site";
import { onAnchorClick } from "@/lib/scroll-to";

interface MobileNavProps {
  active: string | null;
}

/** Native navigation disclosure keeps links keyboard-accessible without a modal. */
export function MobileNav({ active }: MobileNavProps) {
  const disclosureRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const disclosure = disclosureRef.current;
    if (!disclosure) return;

    function dismissOutside(event: PointerEvent) {
      if (event.target instanceof Node && !disclosure?.contains(event.target)) {
        disclosure?.removeAttribute("open");
      }
    }

    // A hidden disclosure should not reopen when returning from desktop width.
    const observer = new ResizeObserver(() => {
      if (disclosure.getBoundingClientRect().width === 0) {
        disclosure.removeAttribute("open");
      }
    });
    observer.observe(disclosure);
    document.addEventListener("pointerdown", dismissOutside);
    return () => {
      observer.disconnect();
      document.removeEventListener("pointerdown", dismissOutside);
    };
  }, []);

  return (
    <details
      ref={disclosureRef}
      className="group lg:hidden"
      onKeyDown={(event) => {
        if (event.key !== "Escape" || !event.currentTarget.open) return;
        event.preventDefault();
        event.currentTarget.open = false;
        event.currentTarget.querySelector("summary")?.focus();
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          event.currentTarget.open = false;
        }
      }}
    >
      <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-full border border-border bg-bg-elevated px-3 text-sm text-fg group-open:border-accent hover:text-accent [&::-webkit-details-marker]:hidden">
        <Menu aria-hidden="true" className="size-4" />
        Menu
      </summary>
      <ul className="absolute inset-x-0 top-full max-h-[calc(100dvh-var(--spacing)*16)] overflow-y-auto border-b border-border bg-bg-elevated px-6 py-3 shadow-lg">
        {[...navLinks, { label: "Résumé", href: "/resume" }].map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              aria-current={link.href === `/#${active}` ? "location" : undefined}
              className="flex min-h-11 items-center rounded-lg px-3 text-sm text-fg-muted hover:bg-bg hover:text-accent"
              onClick={(event) => {
                onAnchorClick(event);
                disclosureRef.current?.removeAttribute("open");
                disclosureRef.current?.querySelector("summary")?.focus();
              }}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </details>
  );
}
