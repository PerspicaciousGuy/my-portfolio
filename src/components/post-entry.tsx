import Link from "next/link";
import type { PostMeta } from "@/lib/posts";
import { formatDate } from "@/lib/format-date";
import { Icon } from "@/components/pixel/icon";

/** One row in the homepage's list of posts: date, reading time, title, summary. */
export function PostEntry({ post: p }: { post: PostMeta }) {
  return (
    <Link href={`/blog/${p.slug}`} className="group flex flex-col gap-1.5 py-6">
      <div className="px-label flex items-center gap-3">
        <time dateTime={p.date}>{formatDate(p.date)}</time>
        <span>·</span>
        <span>{p.readingTime} min read</span>
      </div>
      <h3 className="m-0 flex items-start gap-2 font-display text-2xl font-bold uppercase group-hover:text-accent">
        {p.title}
        <Icon name="upright" className="mt-1.5 shrink-0 opacity-0 group-hover:opacity-100" />
      </h3>
      <p className="m-0 max-w-2xl text-pretty text-fg-muted">{p.summary}</p>
    </Link>
  );
}
