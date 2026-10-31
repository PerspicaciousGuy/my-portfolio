import Link from "next/link";
import { Icon } from "@/components/pixel/icon";
import { getPosts } from "@/lib/posts";
import { PostEntry } from "@/components/post-entry";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

export async function Writing() {
  const posts = (await getPosts()).slice(0, 3);
  if (posts.length === 0) return null;

  return (
    <Section id="writing" index="05" title="Writing">
      <Reveal>
        <ul className="px-panel m-0 list-none divide-y-4 divide-raised p-0">
          {posts.map((p) => (
            <li key={p.slug} className="px-7">
              <PostEntry post={p} />
            </li>
          ))}
        </ul>
      </Reveal>
      <Reveal>
        <Link href="/blog" className="px-btn px-btn-ghost px-btn-sm mt-8">
          All writing
          <Icon name="right" />
        </Link>
      </Reveal>
    </Section>
  );
}
