import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { getPosts, formatDate } from "@/lib/posts";
import { Reveal } from "@/components/ui/reveal";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Writing",
  description: "Notes on backend engineering, APIs and the things I build.",
};

export default async function BlogIndex() {
  const posts = await getPosts();

  return (
    <>
    <main className="relative mx-auto min-h-svh w-full max-w-3xl px-6 py-24">
      <Reveal>
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-mono text-xs text-fg-subtle transition hover:text-accent"
        >
          <ArrowLeft className="size-3.5" />
          back
        </Link>

        <h1 className="mt-10 text-4xl font-semibold tracking-tight sm:text-5xl">
          Writing
        </h1>
        <p className="mt-4 max-w-lg text-pretty text-lg text-fg-muted">
          Notes on backend engineering, APIs, and the things I build when
          something I need doesn&apos;t exist yet.
        </p>
      </Reveal>

      {posts.length === 0 ? (
        <p className="mt-16 text-fg-subtle">Nothing published yet.</p>
      ) : (
        <ul className="mt-16 divide-y divide-border border-y border-border">
          {posts.map((p, i) => (
            <Reveal as="li" key={p.slug} delay={i * 0.06}>
              <Link
                href={`/blog/${p.slug}`}
                className="group flex flex-col gap-2 py-7 transition-colors"
              >
                <div className="flex items-center gap-3 font-mono text-xs text-fg-subtle">
                  <time dateTime={p.date}>{formatDate(p.date)}</time>
                  <span>·</span>
                  <span>{p.readingTime} min read</span>
                </div>

                <h2 className="flex items-start gap-2 text-xl font-medium tracking-tight transition-colors group-hover:text-accent">
                  {p.title}
                  <ArrowUpRight className="mt-1 size-4 shrink-0 opacity-0 transition-all group-hover:opacity-100" />
                </h2>

                <p className="text-pretty leading-relaxed text-fg-muted">
                  {p.summary}
                </p>
              </Link>
            </Reveal>
          ))}
        </ul>
      )}
    </main>
    <Footer />
    </>
  );
}
