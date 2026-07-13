import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { extractHeadings, type Heading } from "@/lib/headings";

const DIR = path.join(process.cwd(), "src", "content", "posts");

export type PostMeta = {
  slug: string;
  title: string;
  summary: string;
  date: string;
  readingTime: number;
  tags: string[];
};

export type Post = PostMeta & {
  content: string;
  /** The `##` sections, in order — drives the table of contents. */
  headings: Heading[];
};

function readingTime(text: string) {
  return Math.max(1, Math.round(text.split(/\s+/).length / 200));
}

async function readPost(file: string): Promise<Post> {
  const raw = await fs.readFile(path.join(DIR, file), "utf8");
  const { data, content } = matter(raw);

  return {
    slug: file.replace(/\.mdx?$/, ""),
    title: data.title ?? "Untitled",
    summary: data.summary ?? "",
    date: data.date ?? "1970-01-01",
    tags: data.tags ?? [],
    readingTime: readingTime(content),
    headings: extractHeadings(content),
    content,
  };
}

export async function getPosts(): Promise<Post[]> {
  let files: string[];
  try {
    files = (await fs.readdir(DIR)).filter((f) => /\.mdx?$/.test(f));
  } catch {
    return [];
  }

  const posts = await Promise.all(files.map(readPost));
  return posts.sort((a, b) => b.date.localeCompare(a.date));
}

export async function getPost(slug: string): Promise<Post | null> {
  const posts = await getPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}

// Lives in its own module so client components can import it without dragging
// node:fs along. Re-exported here so existing callers don't have to change.
export { formatDate } from "@/lib/format-date";
