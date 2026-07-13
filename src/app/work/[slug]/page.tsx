import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight, Code2 } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getCaseStudy, getCaseStudySlugs } from "@/lib/case-studies";
import { ApiPlayground } from "@/components/api-playground";
import { Footer } from "@/components/footer";

export async function generateStaticParams() {
  return getCaseStudySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = await getCaseStudy(slug);
  if (!study) return {};

  return {
    title: study.project.name,
    description: study.summary,
    openGraph: {
      title: study.project.name,
      description: study.summary,
      type: "article",
    },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = await getCaseStudy(slug);
  if (!study) notFound();

  const { project } = study;

  return (
    <>
      <main className="relative mx-auto w-full max-w-2xl px-6 py-24">
        <Link
          href="/#work"
          className="inline-flex items-center gap-2 font-mono text-xs text-fg-subtle transition hover:text-accent"
        >
          <ArrowLeft className="size-3.5" />
          work
        </Link>

        <header className="mt-10">
          <p className="font-mono text-xs text-fg-subtle">{project.year}</p>
          <h1 className="mt-3 text-balance text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            {project.name}
          </h1>
          <p className="mt-5 text-pretty text-lg leading-relaxed text-fg-muted">
            {study.summary}
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-4">
            <a
              href={project.repo}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-fg-muted transition hover:text-accent"
            >
              <Code2 className="size-4" />
              Source
            </a>
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-fg-muted transition hover:text-accent"
              >
                <ArrowUpRight className="size-4" />
                Live demo
              </a>
            )}
          </div>
        </header>

        {project.preview && (
          <div className="relative mt-12 aspect-[16/10] overflow-hidden rounded-xl border border-border">
            <Image
              src={project.preview}
              alt={`${project.name} interface`}
              fill
              sizes="(max-width: 768px) 100vw, 672px"
              className="object-cover object-top"
            />
          </div>
        )}

        {study.facts.length > 0 && (
          <dl className="mt-12 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-3">
            {study.facts.map((f) => (
              <div key={f.label} className="bg-bg-elevated/70 p-5">
                <dt className="font-mono text-[10px] uppercase tracking-widest text-fg-subtle">
                  {f.label}
                </dt>
                <dd className="mt-1.5 text-sm font-medium">{f.value}</dd>
              </div>
            ))}
          </dl>
        )}

        <div className="mt-12">
          <h2 className="font-mono text-xs uppercase tracking-widest text-accent">
            Built with
          </h2>
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {project.stack.map((s) => (
              <li
                key={s}
                className="rounded border border-border px-2 py-0.5 font-mono text-[11px] text-fg-subtle"
              >
                {s}
              </li>
            ))}
          </ul>
        </div>

        <article className="prose-portfolio mt-14">
          {/* Case studies opt into the live console by dropping <Playground />
              into their MDX. Only the API study uses it. */}
          <MDXRemote
            source={study.content}
            components={{ Playground: ApiPlayground }}
          />
        </article>
      </main>
      <Footer />
    </>
  );
}
