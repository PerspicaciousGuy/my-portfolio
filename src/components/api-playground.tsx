"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Play, Loader2, Terminal } from "lucide-react";
import { API_BASE, playgroundRequests } from "@/data/playground";

type Result = {
  status: number;
  ms: number;
  rateLimit: { limit: string | null; remaining: string | null };
  body: unknown;
};

/**
 * A live console against the real ExerciseDB API. Requests go through
 * /api/playground, which holds the demo key server-side — the browser never
 * sees it. Every response here is genuinely fetched from api.harshitbishnoi.dev.
 */
export function ApiPlayground() {
  const [active, setActive] = useState(playgroundRequests[0]);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Ignore a slow response if the user has since picked another request.
  const requestSeq = useRef(0);

  const run = useCallback(async (path: string) => {
    const seq = ++requestSeq.current;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/playground?path=${encodeURIComponent(path)}`,
      );
      const json = await res.json();
      if (seq !== requestSeq.current) return;

      if (!res.ok) {
        setError(json.error ?? "Something went wrong.");
        setResult(null);
      } else {
        setResult(json);
      }
    } catch {
      if (seq === requestSeq.current) setError("Couldn't reach the server.");
    } finally {
      if (seq === requestSeq.current) setLoading(false);
    }
  }, []);

  // Run the first request on mount so the panel is never empty.
  useEffect(() => {
    run(playgroundRequests[0].path);
  }, [run]);

  function select(id: string) {
    const next = playgroundRequests.find((r) => r.id === id);
    if (!next || next.id === active.id) return;
    setActive(next);
    run(next.path);
  }

  const ok = result !== null && result.status >= 200 && result.status < 300;

  return (
    <section className="not-prose my-14 overflow-hidden rounded-2xl border border-border bg-bg-elevated/50">
      <header className="border-b border-border px-5 py-4">
        <div className="flex items-center gap-2">
          <Terminal className="size-4 text-accent" />
          <h2 className="font-mono text-xs uppercase tracking-widest text-accent">
            Try it live
          </h2>
        </div>
        <p className="mt-2 text-pretty text-sm leading-relaxed text-fg-muted">
          This isn&apos;t a mock. Every request below hits{" "}
          <span className="font-mono text-[13px] text-fg">
            api.harshitbishnoi.dev
          </span>{" "}
          in production and returns whatever it actually says.
        </p>
      </header>

      <div className="flex flex-wrap gap-1.5 border-b border-border px-5 py-4">
        {playgroundRequests.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => select(r.id)}
            className={`rounded-full border px-3 py-1 text-xs transition ${
              r.id === active.id
                ? "border-accent/50 bg-accent/10 text-accent"
                : "border-border text-fg-muted hover:border-accent/40 hover:text-accent"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* The request line */}
      <div className="flex items-center gap-3 border-b border-border px-5 py-3.5">
        <span className="shrink-0 rounded bg-accent/10 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-accent">
          GET
        </span>
        <code className="min-w-0 flex-1 truncate font-mono text-[13px] text-fg-muted">
          <span className="text-fg-subtle">{API_BASE}</span>
          {active.path}
        </code>
        <button
          type="button"
          onClick={() => run(active.path)}
          disabled={loading}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-accent px-3.5 py-1.5 text-xs font-medium text-accent-fg transition hover:opacity-90 disabled:opacity-60"
        >
          {loading ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <Play className="size-3.5" />
          )}
          Run
        </button>
      </div>

      {/* The response */}
      <div className="relative">
        {result && (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-border px-5 py-2.5 font-mono text-[11px]">
            <span className={ok ? "text-emerald-500" : "text-accent"}>
              {ok ? "●" : "▲"} {result.status}
            </span>
            <span className="text-fg-subtle">{result.ms} ms</span>
            {result.rateLimit.remaining && (
              <span className="text-fg-subtle">
                quota {result.rateLimit.remaining}/{result.rateLimit.limit}
              </span>
            )}
          </div>
        )}

        <pre className="max-h-80 overflow-auto bg-bg/60 px-5 py-4 font-mono text-[12px] leading-relaxed text-fg-muted">
          {error ? (
            <span className="text-accent">{error}</span>
          ) : result ? (
            JSON.stringify(result.body, null, 2)
          ) : (
            <span className="text-fg-subtle">Running…</span>
          )}
        </pre>
      </div>

      <footer className="border-t border-border px-5 py-4">
        <p className="text-pretty text-sm leading-relaxed text-fg-subtle">
          {active.note}
        </p>
      </footer>
    </section>
  );
}
