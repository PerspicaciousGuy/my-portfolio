/**
 * Kept out of posts.ts so client components can use it — posts.ts imports
 * node:fs, which can't cross into the browser bundle.
 */
export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
