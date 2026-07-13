/**
 * The endpoints the public playground is allowed to call.
 *
 * This list is the security boundary: the proxy route refuses anything not in
 * it, so a visitor can never reach /auth, /me, or /billing with the demo key.
 * The UI renders its menu from the same list, so the two can't drift apart.
 */

export const API_BASE = "https://api.harshitbishnoi.dev";

export type PlaygroundRequest = {
  id: string;
  label: string;
  /** What this call demonstrates — shown under the response. */
  note: string;
  /** Path plus query, exactly as it will be sent. Must be GET and read-only. */
  path: string;
};

export const playgroundRequests: PlaygroundRequest[] = [
  {
    id: "list",
    label: "List exercises",
    path: "/exercises?limit=3",
    note: "The core catalog. Paginated, and every record carries an updatedAt so a client can tell what changed.",
  },
  {
    id: "search",
    label: "Search",
    path: "/exercises/search?q=press&limit=3",
    note: "Search across names, aliases and tags — so 'press' finds the bench press however it was typed.",
  },
  {
    id: "one",
    label: "Fetch one",
    path: "/exercises/slug/push-up",
    note: "Fetch by slug rather than an opaque id, so URLs stay readable and stable.",
  },
  {
    id: "filter",
    label: "Filter by category",
    path: "/exercises?category=strength&limit=3",
    note: "Filtering happens on the server, but the response stays cacheable — no per-user shaping.",
  },
  {
    id: "muscles",
    label: "Muscles",
    path: "/muscles",
    note: "Reference data. Muscles are a real table with regions and groups — not a string column, which was the first schema I got wrong.",
  },
  {
    id: "equipment",
    label: "Equipment",
    path: "/equipment",
    note: "Equipment changes an exercise's identity: a dumbbell press is genuinely not a barbell press.",
  },
  {
    id: "sync",
    label: "Incremental sync",
    path: "/sync/exercises?limit=3",
    note: "The endpoint I'm proudest of. Clients sync once, then ask only for what changed — with tombstones for deletions and a watermark so nothing is skipped mid-sync.",
  },
  {
    id: "error",
    label: "Trigger an error",
    path: "/exercises/slug/does-not-exist",
    note: "Errors are RFC 9457 problem+json — a machine-readable type, a code, and a requestId you can quote back to me to find the exact log line.",
  },
];

/** Guard used by the proxy. Never trust a path from the client. */
export function isAllowedPath(path: string): boolean {
  return playgroundRequests.some((r) => r.path === path);
}
