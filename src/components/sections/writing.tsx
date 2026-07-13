import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getPosts, formatDate } from "@/lib/posts";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

export async function Writing() {
  const posts = (await getPosts()).slice(0, 3);
  if (posts.length === 0) return null;

  return (
    <Section id="writing" index="05" title="Writing">
      <ul className="divide-y divide-border border-y border-border">
        {posts.map((p, i) => (
          <Reveal as="li" key={p.slug} delay={i * 0.06}>
            <Link
              href={`/blog/${p.slug}`}
              className="group flex flex-col gap-1.5 py-6"
            >
              <div className="flex items-center gap-3 font-mono text-xs text-fg-subtle">
                <time dateTime={p.date}>{formatDate(p.date)}</time>
                <span>·</span>
                <span>{p.readingTime} min read</span>
              </div>

              <h3 className="flex items-start gap-2 text-lg font-medium tracking-tight transition-colors group-hover:text-accent">
                {p.title}
                <ArrowUpRight className="mt-1 size-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
              </h3>

              <p className="max-w-2xl text-pretty leading-relaxed text-fg-muted">
                {p.summary}
              </p>
            </Link>
          </Reveal>
        ))}
      </ul>

      <Reveal>
        <Link
          href="/blog"
          className="group mt-8 inline-flex items-center gap-2 text-sm text-fg-muted transition hover:text-accent"
        >
          All writing
          <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </Reveal>
    </Section>
  );
}
