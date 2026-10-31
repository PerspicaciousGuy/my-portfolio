/**
 * Kept out of posts.ts so client components can use it: posts.ts imports
 * node:fs, which can't cross into the browser bundle.
 */
export function formatDate(iso: string, style: "long" | "short" = "long") {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: style === "short" ? "2-digit" : "numeric",
    month: style === "short" ? "short" : "long",
    year: style === "short" ? "2-digit" : "numeric",
  });
}
