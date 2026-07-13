import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getPost, getPosts, formatDate } from "@/lib/posts";
import { slugifyHeading } from "@/lib/headings";
import { Toc } from "@/components/toc";
import { Footer } from "@/components/footer";

/** Give every section a stable anchor the table of contents can link to. */
function H2({ children }: { children?: React.ReactNode }) {
  const text = typeof children === "string" ? children : String(children ?? "");
  return <h2 id={slugifyHeading(text)}>{children}</h2>;
}

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
    <>
    {/* The article stays a fixed, readable column. On xl the grid adds a left
        gutter for the TOC — space that was dead margin anyway. */}
    <div className="mx-auto grid min-h-svh w-full max-w-2xl grid-cols-1 gap-12 px-6 py-24 xl:max-w-6xl xl:grid-cols-[15rem_minmax(0,42rem)] xl:justify-center">
      <aside className="hidden xl:block">
        <Toc headings={post.headings} />
      </aside>

      <main className="relative w-full min-w-0">
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
        <MDXRemote source={post.content} components={{ h2: H2 }} />
      </article>
      </main>
    </div>
    <Footer />
    </>
  );
}
