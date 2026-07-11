"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { onAnchorClick } from "@/lib/scroll-to";

/**
 * A link to an in-page section that scrolls smoothly when we're already on the
 * home page, and navigates properly from /blog or /resume.
 */
export function SectionLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} onClick={onAnchorClick} className={className}>
      {children}
    </Link>
  );
}
