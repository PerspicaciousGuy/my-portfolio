import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPost, getPosts } from "@/lib/posts";
import { splitChapters } from "@/lib/chapters";
import { formatDate } from "@/lib/format-date";
import { portrait, site } from "@/data/site";
import { Footer } from "@/components/footer";
import { Critter } from "@/components/pixel/critter";
import { Icon } from "@/components/pixel/icon";
import { Prose } from "@/components/pixel/prose";
import { ReadingBar } from "@/components/pixel/reading-bar";
import { ChapterDots } from "@/components/pixel/chapter-dots";

export async function generateStaticParams() {
  return (await getPosts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.summary,
    openGraph: { title: post.title, description: post.summary, type: "article", publishedTime: post.date },
  };
}

/** A post in reader mode: wide type on the bare sky, a progress bar with the critter on it, chapters as dots. */
export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const { intro, chapters } = splitChapters(post.content);
  const all = await getPosts();
  const at = all.findIndex((p) => p.slug === slug);
  const next = all.length > 1 ? all[(at + 1) % all.length] : null;

  return (
    <>
      <ReadingBar />
      <ChapterDots ids={chapters.map((c) => c.id)} titles={chapters.map((c) => c.title)} />
      <main className="px-wrap relative z-[1] flex-1 pt-14">
        <div className="mx-auto max-w-[780px]">
          <Link href="/blog" className="px-label inline-flex min-h-11 items-center gap-2 hover:text-accent">
            <Icon name="left" />
            Writing
          </Link>
          <p className="px-label mb-0 mt-8 text-green">
            <time dateTime={post.date}>{formatDate(post.date)}</time> · {post.readingTime} min read
          </p>
          <h1 className="m-0 mt-3.5 font-display text-[clamp(44px,6vw,76px)] font-bold uppercase leading-[0.98]">{post.title}</h1>
          <p className="mb-0 mt-6 text-[30px] text-fg-muted">{post.summary}</p>
          <div className="mt-6 flex items-center gap-4">
            {portrait ? (
              <Image src={portrait} alt="" width={56} height={56} className="size-14 flex-none" />
            ) : (
              <div aria-hidden="true" className="size-14 flex-none border-4 border-dashed border-edge bg-slot" />
            )}
            <div>
              <div className="font-display text-lg font-semibold uppercase">{site.name}</div>
              <div className="px-label">{post.tags.join(" · ")}</div>
            </div>
          </div>
          <div aria-hidden="true" className="mb-12 mt-9 h-1 bg-border" />

          <div id="post-body">
            <Prose source={intro} />
            {chapters.map((c) => (
              <section key={c.id} id={c.id}>
                <h2 className="mb-[18px] mt-14 font-display text-4xl font-bold uppercase leading-[1.05]">
                  <span className="px-label mb-2 block text-[15px] font-medium tracking-[0.1em] text-green">Chapter {c.n}</span>
                  {c.title}
                </h2>
                <Prose source={c.body} />
              </section>
            ))}
          </div>

          {next && next.slug !== slug && (
            <Link href={`/blog/${next.slug}`} className="px-panel mt-[50px] flex flex-wrap items-center gap-6 px-[30px] py-[26px]">
              <div className="relative h-[51px] w-[78px] flex-none">
                <div className="absolute bottom-0 left-0">
                  <Critter u={3} face="heart" />
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-display text-[22px] font-bold uppercase">Enjoyed it?</div>
                <div className="text-fg-muted">Next up: {next.title}.</div>
              </div>
              <span className="px-btn px-btn-primary">
                Next post
                <Icon name="right" />
              </span>
            </Link>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
