"use client";

import { useMemo, useState, type CSSProperties } from "react";
import Link from "next/link";
import type { PostMeta } from "@/lib/posts";
import { formatDate } from "@/lib/format-date";

type Props = { posts: (PostMeta & { volume: number })[] };

/** Label colour per volume, cycling; [background, text]. */
const STRIPES: [string, string][] = [
  ["#9B7BFF", "#ECECF0"],
  ["#6BF59A", "#131418"],
  ["#FFC933", "#131418"],
  ["#62B6FF", "#131418"],
  ["#FF9DB5", "#131418"],
  ["#FF7A45", "#131418"],
];

/** The blog index as a shelf of game cartridges, filtered by tag tabs. */
export function Shelf({ posts }: Props) {
  const [tag, setTag] = useState("all");

  const tags = useMemo(() => {
    const count = new Map<string, number>();
    posts.forEach((p) => p.tags.forEach((t) => count.set(t, (count.get(t) ?? 0) + 1)));
    // The five most used tags get a tab; every post is still on the All shelf.
    return [...count.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 5);
  }, [posts]);

  const shown = tag === "all" ? posts : posts.filter((p) => p.tags.includes(tag));

  return (
    <>
      <div role="tablist" aria-label="Filter posts by tag" className="mb-14 mt-8 flex flex-wrap gap-y-3">
        {[["all", posts.length] as const, ...tags].map(([t, n]) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={tag === t}
            onClick={() => setTag(t)}
            className={`mr-2 min-h-11 cursor-pointer px-[18px] py-2.5 font-display text-base font-semibold uppercase tracking-wide ${
              tag === t ? "bg-accent text-bg shadow-[0_0_0_3px_rgb(var(--accent))]" : "bg-raised text-fg-muted shadow-[0_0_0_3px_rgb(var(--border))] hover:text-fg"
            }`}
          >
            {t} <span className="opacity-70">{n}</span>
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <p className="text-fg-muted">Nothing on this shelf yet.</p>
      ) : (
        <ul className="m-0 grid list-none gap-x-[34px] gap-y-14 p-0 pt-6 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((p) => {
            // Newest cartridge first gets the first colour.
            const [bg, fg] = STRIPES[(posts[0].volume - p.volume) % STRIPES.length];
            return (
              <li key={p.slug}>
                <Link href={`/blog/${p.slug}`} className="px-cart block h-full" style={{ "--stripe": bg } as CSSProperties}>
                  <div aria-hidden="true" className="px-cart-grip" />
                  <div className="mx-[18px] mt-[18px] flex justify-between px-3.5 py-1.5 font-display text-[15px] uppercase tracking-wider" style={{ background: bg, color: fg }}>
                    <b className="font-bold">Vol {String(p.volume).padStart(2, "0")}</b>
                    <span>{formatDate(p.date, "short")}</span>
                  </div>
                  <div className="mx-[18px] flex flex-1 flex-col gap-2.5 bg-panel p-5 shadow-[inset_0_0_0_4px_rgb(var(--border))]">
                    <h2 className="m-0 font-display text-[28px] font-bold uppercase leading-[1.05]">{p.title}</h2>
                    <p className="m-0 text-[22px] text-fg-muted">{p.summary}</p>
                    <div className="mt-auto flex flex-wrap items-center">
                      {p.tags.slice(0, 3).map((t) => (
                        <span key={t} className="m-0.5 bg-black/30 px-[9px] pb-1 pt-[5px] text-[19px] leading-none">
                          {t}
                        </span>
                      ))}
                      <span className="px-label ml-auto">{p.readingTime} min</span>
                    </div>
                  </div>
                  <div aria-hidden="true" className="px-cart-pins" />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
