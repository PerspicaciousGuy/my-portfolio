import Link from "next/link";
import type { PostMeta } from "@/lib/posts";
import { formatDate } from "@/lib/format-date";

/** One row in the homepage's list of posts: date and tags, title, summary. */
export function PostEntry({ post: p }: { post: PostMeta }) {
  return (
    <Link href={`/blog/${p.slug}`} className="block py-7 hover:text-accent">
      <p className="px-label m-0 text-fg-muted">{[formatDate(p.date), ...p.tags].join(" · ")}</p>
      <h3 className="m-0 mt-2 font-display text-[30px] font-semibold uppercase">{p.title}</h3>
      <p className="m-0 mt-2 max-w-[820px] text-[24px] text-fg-muted">{p.summary}</p>
    </Link>
  );
}
