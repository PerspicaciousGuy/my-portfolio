import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCaseStudy, getCaseStudySlugs } from "@/lib/case-studies";
import { splitChapters } from "@/lib/chapters";
import { Footer } from "@/components/footer";
import { Icon } from "@/components/pixel/icon";
import { ChapterBar } from "@/components/pixel/chapter-bar";
import { Prose } from "@/components/pixel/prose";
import { SceneArt } from "@/components/pixel/scene-art";

export async function generateStaticParams() {
  return getCaseStudySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const study = await getCaseStudy(slug);
  if (!study) return {};
  return {
    title: study.project.name,
    description: study.summary,
    alternates: { canonical: `/work/${slug}` },
    openGraph: { title: study.project.name, description: study.summary, type: "article", url: `/work/${slug}` },
    twitter: { card: "summary_large_image", title: study.project.name, description: study.summary },
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

/** A case study as a quest log: a title screen with a project sheet, then numbered chapters. */
export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const study = await getCaseStudy(slug);
  if (!study) notFound();

  const { project } = study;
  const { intro, chapters } = splitChapters(study.content);
  const slugs = getCaseStudySlugs();
  const index = slugs.indexOf(slug);
  const nextSlug = slugs[(index + 1) % slugs.length];
  const next = nextSlug !== slug ? await getCaseStudy(nextSlug) : null;
  const hasConsole = study.content.includes("<Playground");

  return (
    <>
      <ChapterBar ids={chapters.map((c) => c.id)} />
      <main className="relative z-[1] flex-1">
        <div className="px-wrap flex flex-wrap items-stretch gap-14 pt-[60px]">
          <div className="min-w-0 flex-[1.3_1_440px]">
            <Link href="/#work" className="px-label inline-flex min-h-11 items-center gap-2 hover:text-accent">
              <Icon name="left" />
              Back to the map
            </Link>
            <p className="px-label mb-2 mt-8 text-accent">
              Case file {pad(index + 1)} of {pad(slugs.length)} · {project.year}
            </p>
            <h1 className="m-0 font-display text-[clamp(52px,7vw,88px)] font-bold uppercase leading-[0.92]">{project.name}</h1>
            <p className="mb-0 mt-6 max-w-[640px] text-[29px] text-fg-muted">{study.summary}</p>
            <div className="mt-6 flex flex-wrap items-center">
              {chapters.length > 0 && (
                <a href="#ch-1" className="px-btn px-btn-primary">
                  Start reading
                  <Icon name="down" />
                </a>
              )}
              {hasConsole && (
                <a href="#console" className="px-btn px-btn-ghost">
                  Try the live console
                </a>
              )}
              {project.repo && (
                <a href={project.repo} target="_blank" rel="noreferrer" className="px-btn px-btn-ghost px-btn-sm">
                  <Icon name="code" />
                  Source
                </a>
              )}
              {project.live && (
                <a href={project.live} target="_blank" rel="noreferrer" className="px-btn px-btn-ghost px-btn-sm">
                  <Icon name="upright" />
                  Live
                </a>
              )}
            </div>
          </div>

          <aside className="px-panel-hi min-w-0 flex-[1_1_380px] p-7" aria-label="Project sheet">
            <div className="flex items-center justify-between">
              <span className="font-display text-[22px] font-bold uppercase text-accent">Project sheet</span>
              {project.live && <span className="px-label text-green">● live</span>}
            </div>
            {project.art && (
              <div className="my-[18px] border-4 border-border">
                <SceneArt kind={project.art} className="h-[150px] w-full" />
              </div>
            )}
            <dl className="m-0 grid gap-4">
              {study.facts.map((f) => (
                <div key={f.label}>
                  <div className="flex justify-between gap-4">
                    <dt className="px-label">{f.label}</dt>
                    <dd className="m-0 text-right">{f.value}</dd>
                  </div>
                  <div aria-hidden="true" className="mt-1 flex h-[18px] gap-[3px] border-[3px] border-border bg-slot p-0.5">
                    {Array.from({ length: 10 }, (_, i) => (
                      <i key={i} className="block flex-1 bg-green" />
                    ))}
                  </div>
                </div>
              ))}
            </dl>
            <ul className="m-0 mt-5 flex list-none flex-wrap p-0">
              {project.stack.map((s) => (
                <li key={s} className="px-chip">
                  {s}
                </li>
              ))}
            </ul>
          </aside>
        </div>

        <div className="px-wrap pb-5">
          {intro && (
            <div className="mt-[70px]">
              <Prose source={intro} />
            </div>
          )}
          {chapters.map((c) => (
            <section key={c.id} id={c.id} className="px-chapter">
              <div className="px-chapter-num" aria-hidden="true">
                {pad(c.n)}
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="m-0 mb-4 font-display text-[38px] font-bold uppercase leading-none">{c.title}</h2>
                <Prose source={c.body} />
              </div>
            </section>
          ))}
        </div>

        {next && (
          <div className="px-wrap mt-[70px]">
            <div className="px-label mb-3.5">Next case file</div>
            <Link href={`/work/${next.slug}`} className="px-panel flex flex-wrap items-center gap-[26px] px-7 py-[22px]">
              <span className="font-display text-[60px] font-bold leading-none text-edge">{pad(((index + 1) % slugs.length) + 1)}</span>
              <div className="min-w-0 flex-1">
                <div className="font-display text-[32px] font-bold uppercase">{next.project.name}</div>
                <div className="text-fg-muted">{next.project.blurb}</div>
              </div>
              <span className="px-btn px-btn-primary">
                Open file
                <Icon name="right" />
              </span>
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
