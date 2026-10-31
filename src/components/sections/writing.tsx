import Link from "next/link";
import { getPosts } from "@/lib/posts";
import { PostEntry } from "@/components/post-entry";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { Icon } from "@/components/pixel/icon";

export async function Writing() {
  const posts = (await getPosts()).slice(0, 3);
  if (posts.length === 0) return null;

  return (
    <Section id="writing" index="05" title="Writing">
      <Reveal>
        <ul className="px-panel m-0 list-none px-9 py-2">
          {posts.map((p, i) => (
            <li key={p.slug} className={i < posts.length - 1 ? "border-b-4 border-raised" : ""}>
              <PostEntry post={p} />
            </li>
          ))}
        </ul>
      </Reveal>
      <Link href="/blog" className="px-btn px-btn-ghost mt-9">
        All writing
        <Icon name="right" size={24} />
      </Link>
    </Section>
  );
}
