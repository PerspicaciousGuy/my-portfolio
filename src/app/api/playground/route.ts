import { NextResponse } from "next/server";
import { API_BASE, isAllowedPath } from "@/data/playground";

/**
 * Server-side proxy for the ExerciseDB playground.
 *
 * The demo API key lives here and never reaches the browser. Only the exact
 * read-only paths in the allowlist are forwarded, so a visitor can't reach
 * /auth, /me or /billing, and can't craft their own query against the quota.
 */

/** Cheap in-memory throttle. Resets on cold start, which is fine — it only
 *  needs to stop someone hammering the button, not defeat a botnet. */
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 20;
const hits = new Map<string, { count: number; resetAt: number }>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);

  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  entry.count += 1;
  return entry.count > MAX_PER_WINDOW;
}

export async function GET(req: Request) {
  const path = new URL(req.url).searchParams.get("path") ?? "";

  // The allowlist is the whole security model — check it before anything else.
  if (!isAllowedPath(path)) {
    return NextResponse.json(
      { error: "That endpoint isn't available in the playground." },
      { status: 400 },
    );
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "Easy there — too many requests. Give it a minute." },
      { status: 429 },
    );
  }

  const key = process.env.EXERCISEDB_DEMO_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "The playground isn't configured." },
      { status: 503 },
    );
  }

  const startedAt = Date.now();

  try {
    const upstream = await fetch(`${API_BASE}${path}`, {
      headers: { "x-api-key": key },
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });

    // The API answers with JSON on success and problem+json on error. Either
    // way we hand the real body straight back — the point is that it's real.
    const body = await upstream.json().catch(() => null);

    return NextResponse.json({
      status: upstream.status,
      ms: Date.now() - startedAt,
      // Proof it's a live, metered API rather than a canned fixture.
      rateLimit: {
        limit: upstream.headers.get("x-ratelimit-limit"),
        remaining: upstream.headers.get("x-ratelimit-remaining"),
      },
      body,
    });
  } catch {
    return NextResponse.json(
      { error: "Couldn't reach the API. It may be waking up — try again." },
      { status: 502 },
    );
  }
}
