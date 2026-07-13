import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { getPosts } from "@/lib/posts";
import { PostList } from "@/components/post-list";
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
      <main className="relative mx-auto min-h-svh w-full max-w-2xl px-6 py-24 xl:max-w-6xl">
        <Reveal>
          <div className="xl:mx-auto xl:max-w-[57rem]">
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
          </div>
        </Reveal>

        {posts.length === 0 ? (
          <p className="mt-16 text-fg-subtle">Nothing published yet.</p>
        ) : (
          <div className="mt-16">
            {/* Strip the content: the index only needs metadata, and shipping
                every post's body to the browser would be absurd. */}
            <PostList
              posts={posts.map(({ content: _content, headings: _h, ...meta }) => meta)}
            />
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
