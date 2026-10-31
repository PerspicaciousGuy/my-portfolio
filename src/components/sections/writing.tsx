import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getPosts } from "@/lib/posts";
import { PostEntry } from "@/components/post-entry";
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
            <PostEntry post={p} variant="preview" />
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
