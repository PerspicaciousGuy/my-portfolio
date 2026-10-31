"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { PostMeta } from "@/lib/posts";
import { PostEntry } from "@/components/post-entry";
import { eyebrow } from "@/components/ui/styles";

/**
 * The writing index: a tag sidebar that filters the list.
 *
 * An index page has no sections to jump to, so a table of contents makes no
 * sense here — what you actually want, once there are more than a handful of
 * posts, is to narrow them. The sidebar sits in the same left gutter the post
 * pages use, so the two feel like one place.
 */
export function PostList({ posts }: { posts: PostMeta[] }) {
  const [active, setActive] = useState<string | null>(null);

  // Tags ordered by how often they're used — the topics he writes about most
  // sit at the top, which is a fair summary of what he's about.
  const tags = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of posts) {
      for (const t of p.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
    }
    return [...counts.entries()].sort(
      (a, b) => b[1] - a[1] || a[0].localeCompare(b[0]),
    );
  }, [posts]);

  const shown = active ? posts.filter((p) => p.tags.includes(active)) : posts;

  return (
    <div className="grid grid-cols-1 gap-12 xl:grid-cols-[15rem_minmax(0,42rem)] xl:justify-center">
      <aside className="hidden xl:block">
        <nav aria-label="Filter posts by topic" className="sticky top-28">
          <p className={eyebrow}>
            Topics
          </p>

          <ul className="mt-4 space-y-1">
            <li className="relative">
              {active === null && (
                <motion.span
                  layoutId="tag-active"
                  className="absolute inset-y-0 left-0 w-px bg-accent"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <button
                type="button"
                onClick={() => setActive(null)}
                aria-pressed={active === null}
                className={`flex w-full items-center justify-between gap-2 border-l py-1 pl-3 text-left text-[13px] transition-colors ${
                  active === null
                    ? "border-transparent text-accent"
                    : "border-border text-fg-subtle hover:text-fg-muted"
                }`}
              >
                All posts
                <span className="font-mono text-[11px]">{posts.length}</span>
              </button>
            </li>

            {tags.map(([tag, count]) => {
              const isActive = tag === active;
              return (
                <li key={tag} className="relative">
                  {isActive && (
                    <motion.span
                      layoutId="tag-active"
                      className="absolute inset-y-0 left-0 w-px bg-accent"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => setActive(isActive ? null : tag)}
                    aria-pressed={isActive}
                    className={`flex w-full items-center justify-between gap-2 border-l py-1 pl-3 text-left text-[13px] transition-colors ${
                      isActive
                        ? "border-transparent text-accent"
                        : "border-border text-fg-subtle hover:text-fg-muted"
                    }`}
                  >
                    {tag}
                    <span className="font-mono text-[11px]">{count}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      <div className="min-w-0">
        {/* Tags again, inline, for the screens the sidebar doesn't reach. */}
        <div className="flex flex-wrap gap-1.5 xl:hidden">
          <button
            type="button"
            onClick={() => setActive(null)}
            aria-pressed={active === null}
            className={`rounded-full border px-3 py-1 text-xs transition ${
              active === null
                ? "border-accent/50 bg-accent/10 text-accent"
                : "border-border text-fg-muted"
            }`}
          >
            All
          </button>
          {tags.map(([tag]) => (
            <button
              key={tag}
              type="button"
              onClick={() => setActive(tag === active ? null : tag)}
              aria-pressed={tag === active}
              className={`rounded-full border px-3 py-1 text-xs transition ${
                tag === active
                  ? "border-accent/50 bg-accent/10 text-accent"
                  : "border-border text-fg-muted"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        <ul className="divide-y divide-border border-y border-border max-xl:mt-8">
          {shown.map((p) => (
            <li key={p.slug}>
              <PostEntry post={p} variant="index" />
            </li>
          ))}
        </ul>

        {shown.length === 0 && (
          <p className="py-10 text-sm text-fg-subtle">
            Nothing tagged “{active}” yet.
          </p>
        )}
      </div>
    </div>
  );
}
