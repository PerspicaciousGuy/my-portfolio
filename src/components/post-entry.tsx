import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { PostMeta } from "@/lib/posts";
import { formatDate } from "@/lib/format-date";

const VARIANTS = {
  /** The /blog index: roomier, with an h2 under the page's h1. */
  index: {
    Heading: "h2",
    link: "gap-2 py-7 transition-colors",
    title: "text-xl",
    summary: "",
  },
  /** The homepage preview: tighter, an h3 under the section's h2. */
  preview: {
    Heading: "h3",
    link: "gap-1.5 py-6",
    title: "text-lg",
    summary: "max-w-2xl",
  },
} as const;

type Props = {
  post: PostMeta;
  variant: keyof typeof VARIANTS;
};

/** One row in a list of posts: date, reading time, title and summary. */
export function PostEntry({ post: p, variant }: Props) {
  const v = VARIANTS[variant];
  return (
    <Link
      href={`/blog/${p.slug}`}
      className={`group flex flex-col ${v.link}`}
    >
      <div className="flex items-center gap-3 font-mono text-xs text-fg-subtle">
        <time dateTime={p.date}>{formatDate(p.date)}</time>
        <span>·</span>
        <span>{p.readingTime} min read</span>
      </div>

      <v.Heading
        className={`flex items-start gap-2 ${v.title} font-medium tracking-tight transition-colors group-hover:text-accent`}
      >
        {p.title}
        <ArrowUpRight className="mt-1 size-4 shrink-0 opacity-0 transition-all group-hover:opacity-100" />
      </v.Heading>

      <p
        className={`${v.summary} text-pretty leading-relaxed text-fg-muted`.trim()}
      >
        {p.summary}
      </p>
    </Link>
  );
}
