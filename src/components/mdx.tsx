import { slugifyHeading } from "@/lib/headings";

/** Give every section a stable anchor the table of contents can link to. */
export function H2({ children }: { children?: React.ReactNode }) {
  const text = typeof children === "string" ? children : String(children ?? "");
  return <h2 id={slugifyHeading(text)}>{children}</h2>;
}
