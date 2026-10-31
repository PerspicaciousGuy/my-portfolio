import Link from "next/link";
import type { Metadata } from "next";
import { getPosts } from "@/lib/posts";
import { Footer } from "@/components/footer";
import { Icon } from "@/components/pixel/icon";
import { Shelf } from "@/components/pixel/shelf";

export const metadata: Metadata = {
  title: "Writing",
  description: "Notes on backend engineering, APIs and the things I build.",
};

/** The blog index: a shelf of cartridges, newest first, volumes numbered from the oldest. */
export default async function BlogIndex() {
  const posts = await getPosts();
  // posts come newest first; volume 1 is the oldest.
  const withVolume = posts.map((p, i) => ({
    slug: p.slug,
    title: p.title,
    summary: p.summary,
    date: p.date,
    readingTime: p.readingTime,
    tags: p.tags,
    volume: posts.length - i,
  }));

  return (
    <>
      <main className="px-wrap relative z-[1] flex-1 pt-14">
        <Link href="/" className="px-label inline-flex min-h-11 items-center gap-2 hover:text-accent">
          <Icon name="left" />
          Home
        </Link>
        <h1 className="m-0 mt-7 font-display text-[clamp(52px,7vw,80px)] font-bold uppercase leading-[0.95]">The shelf</h1>
        <p className="mb-0 mt-4 max-w-[720px] text-[28px] text-fg-muted">
          {posts.length} cartridges, newest first. Pick a tag to filter the shelf, then push one in to read it.
        </p>
        {posts.length === 0 ? <p className="mt-14 text-fg-muted">Nothing published yet.</p> : <Shelf posts={withVolume} />}
      </main>
      <Footer />
    </>
  );
}
