import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  /** Render as an <li> when the Reveal is a direct child of a list. */
  as?: "div" | "li";
};

/** Steps content into view once as it scrolls on screen. Pure CSS (see .px-reveal). */
export function Reveal({ children, className, as = "div" }: Props) {
  const Tag = as;
  return <Tag className={`px-reveal ${className ?? ""}`.trim()}>{children}</Tag>;
}
