"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { API_BASE, playgroundRequests } from "@/data/playground";

type Result = {
  status: number;
  ms: number;
  rateLimit: { limit: string | null; remaining: string | null };
  body: unknown;
};

/**
 * A live console against the real ExerciseDB API, drawn as a handheld. Requests
 * go through /api/playground, which holds the demo key server-side, so the
 * browser never sees it. Every response is genuinely fetched from production.
 */
export function Console() {
  const [active, setActive] = useState(playgroundRequests[0]);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  // Ignore a slow response if the visitor has since picked another request.
  const seq = useRef(0);

  const fetchResult = useCallback(async (path: string, mine: number) => {
    try {
      const res = await fetch(`/api/playground?path=${encodeURIComponent(path)}`);
      const json = await res.json();
      if (mine !== seq.current) return;
      if (!res.ok) {
        setError(json.error ?? "Something went wrong.");
        setResult(null);
      } else {
        setResult(json);
      }
    } catch {
      if (mine === seq.current) setError("Couldn't reach the server.");
    } finally {
      if (mine === seq.current) setLoading(false);
    }
  }, []);

  const run = (path: string) => {
    const mine = ++seq.current;
    setLoading(true);
    setError(null);
    return fetchResult(path, mine);
  };

  // Run the first request on mount so the screen is never empty.
  useEffect(() => {
    // The rule cannot see that fetchResult only sets state after its await.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchResult(playgroundRequests[0].path, ++seq.current);
  }, [fetchResult]);

  const ok = result !== null && result.status >= 200 && result.status < 300;

  return (
    <section
      id="console"
      aria-label="Live API console"
      className="my-14 max-w-[780px] bg-raised px-5 dark:bg-[#2B2D36] pb-[22px] pt-[22px] shadow-[0_0_0_4px_rgb(var(--edge)),10px_14px_0_4px_rgb(var(--shade))] md:px-[30px] md:pb-[30px] md:pt-[26px]"
    >
      <div className="mb-3 flex items-center justify-between">
        <h3 className="m-0 font-display text-base font-semibold uppercase text-fg dark:text-[#A9ACB8]">ExerciseDB-Boy</h3>
        <span className="px-label">{loading ? "● busy" : "● power"}</span>
      </div>
      <p className="mb-4 mt-0 text-[22px] text-fg-muted dark:text-[#A9ACB8]">
        Not a mock: every request below hits <span className="text-fg dark:text-[#ECECF0]">api.harshitbishnoi.dev</span> in production.
      </p>

      <div className="mb-3 flex flex-wrap">
        {playgroundRequests.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => {
              if (r.id === active.id) return;
              setActive(r);
              run(r.path);
            }}
            aria-pressed={r.id === active.id}
            className={`px-chip cursor-pointer border-0 bg-bg-elevated text-fg dark:bg-raised dark:text-[#ECECF0] ${r.id === active.id ? "!bg-accent !text-bg" : ""}`}
          >
            {r.label}
          </button>
        ))}
      </div>

      <div className="bg-[#0E1A14] px-4 py-4 shadow-[inset_0_0_0_4px_#1B2F25] md:px-[22px] md:py-[18px]">
        <div className="break-all text-[#6BF59A]">
          &gt; GET <span className="text-[#C4FFDD]">{API_BASE.replace("https://", "")}</span>
          {active.path}
        </div>
        {result && (
          <div className="mt-1 text-[#A9ACB8]">
            <span className={ok ? "text-[#6BF59A]" : "text-[#FFC933]"}>{result.status}</span> · {result.ms} ms
            {result.rateLimit.remaining && (
              <>
                {" "}
                · quota {result.rateLimit.remaining}/{result.rateLimit.limit}
              </>
            )}
          </div>
        )}
        {/* On a phone the JSON scrolls sideways; the fade on the right edge hints at it. */}
        <div className="relative after:pointer-events-none after:absolute after:inset-y-0 after:right-0 after:w-7 after:bg-gradient-to-r after:from-transparent after:to-[#0E1A14] md:after:hidden">
          <pre className="px-bare m-0 mt-2 max-h-80 overflow-auto whitespace-pre text-[19px] leading-tight text-[#C4FFDD] md:text-[21px]">
            {error ? <span className="text-[#FFC933]">{error}</span> : result ? JSON.stringify(result.body, null, 2) : "Running…"}
          </pre>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={() => run(active.path)}
          disabled={loading}
          className="px-btn px-btn-primary m-0 min-h-11 w-full cursor-pointer justify-center px-[18px] py-2 text-[15px] disabled:opacity-60 md:min-h-10 md:w-auto md:justify-start"
        >
          A · Send
        </button>
        <span className="px-label min-w-0 flex-1">{active.note}</span>
      </div>
    </section>
  );
}
