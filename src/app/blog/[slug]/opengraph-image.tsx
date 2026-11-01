import { notFound } from "next/navigation";
import { getPost, getPosts } from "@/lib/posts";
import { formatDate } from "@/lib/format-date";
import { shareCard, SHARE_SIZE } from "@/lib/share-card";

export const size = SHARE_SIZE;
export const contentType = "image/png";
export const alt = "Blog post by Harshit Bishnoi";

export async function generateStaticParams() {
  return (await getPosts()).map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();
  return shareCard({
    kind: "post",
    eyebrow: `Writing · ${formatDate(post.date)} · ${post.readingTime} min read`,
    title: post.title,
  });
}
