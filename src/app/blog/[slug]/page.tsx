import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getPost, getPosts, formatDate } from "@/lib/posts";

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: "article",
      publishedTime: post.date,
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <main className="relative mx-auto min-h-svh w-full max-w-2xl px-6 py-24">
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 font-mono text-xs text-fg-subtle transition hover:text-accent"
      >
        <ArrowLeft className="size-3.5" />
        writing
      </Link>

      <header className="mt-10">
        <div className="flex items-center gap-3 font-mono text-xs text-fg-subtle">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span>·</span>
          <span>{post.readingTime} min read</span>
        </div>

        <h1 className="mt-4 text-balance text-4xl font-semibold leading-tight tracking-tight">
          {post.title}
        </h1>

        {post.tags.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-1.5">
            {post.tags.map((t) => (
              <li
                key={t}
                className="rounded border border-border px-2 py-0.5 font-mono text-[11px] text-fg-subtle"
              >
                {t}
              </li>
            ))}
          </ul>
        )}
      </header>

      <article
        className="prose-portfolio mt-12"
        // Styles live in globals.css — no typography plugin needed.
      >
        <MDXRemote source={post.content} />
      </article>
    </main>
  );
}
