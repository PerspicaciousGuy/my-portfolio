import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BookOpen, Code2 } from "lucide-react";
import { featuredProjects, highlightProject, otherProjects, type Project } from "@/data/site";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { CardCritter, type CardJob } from "@/components/pixel/card-critter";

const slug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

/** Art for a project: its screenshot, or a labelled slot until the thumbnail exists. */
function Media({ project, className }: { project: Project; className?: string }) {
  return project.preview ? (
    <Image
      src={project.preview}
      alt=""
      width={640}
      height={400}
      sizes="(max-width: 640px) 100vw, 50vw"
      className={`block w-full object-cover object-top ${className ?? ""}`}
    />
  ) : (
    <div className={`px-slot p-2 text-[13px] ${className ?? ""}`}>
      <b className="text-accent">Art slot · Thumbnail</b>
      <span>1200 × 800 px</span>
    </div>
  );
}

function Links({ project, doc }: { project: Project; doc?: boolean }) {
  return (
    <div className="relative z-10 mt-6 flex flex-wrap items-center gap-x-5">
      {project.slug && (
        <Link
          href={`/work/${project.slug}`}
          className="inline-flex min-h-11 items-center gap-1.5 font-display text-[16px] font-semibold uppercase text-accent hover:underline"
        >
          <BookOpen className="size-4" />
          Case study
        </Link>
      )}
      <a href={project.repo} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-1.5 text-fg-muted hover:text-accent">
        <Code2 className="size-4" />
        Source
      </a>
      {project.live && (
        <a href={project.live} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-1.5 text-fg-muted hover:text-accent">
          <ArrowUpRight className="size-4" />
          {doc ? "Docs" : "Live demo"}
        </a>
      )}
    </div>
  );
}

/** The lead project, full width: it is a product, not a side project. */
function Lead({ project }: { project: Project }) {
  return (
    <article id={`card-${slug(project.name)}`} className="px-panel-hi relative mb-14 flex flex-wrap p-0">
      <div className="absolute bottom-full right-[27px] z-[3] mb-1.5">
        <CardCritter target={`card-${slug(project.name)}`} job="laptop" phase={0} />
      </div>
      <div className="min-h-[300px] min-w-0 flex-[1_1_420px] border-r-4 border-dashed border-border">
        <Media project={project} className="h-full min-h-[300px]" />
      </div>
      <div className="min-w-0 flex-[1_1_480px] p-9">
        <p className="px-label m-0 flex items-center gap-3 text-green">
          <i className="px-dot" />
          Live in production · {project.year}
        </p>
        <h3 className="m-0 mt-4 font-display text-[40px] font-bold uppercase leading-none">
          {project.slug ? (
            <Link href={`/work/${project.slug}`} className="px-link after:absolute after:inset-0">
              {project.name}
            </Link>
          ) : (
            project.name
          )}
        </h3>
        <p className="mb-0 mt-4 max-w-[640px] text-[24px] text-fg-muted">{project.description}</p>
        {project.metrics && (
          <dl className="m-0 mt-6 grid gap-px bg-raised sm:grid-cols-4">
            {project.metrics.map((m) => (
              <div key={m.label} className="bg-raised p-3">
                <dt className="px-label">{m.label}</dt>
                <dd className="m-0 mt-1 text-[22px]">{m.value}</dd>
              </div>
            ))}
          </dl>
        )}
        <ul className="m-0 mt-5 flex list-none flex-wrap p-0">
          {project.stack.map((s) => (
            <li key={s} className="px-chip">
              {s}
            </li>
          ))}
        </ul>
        <Links project={project} doc />
      </div>
    </article>
  );
}

const JOBS: CardJob[] = ["coffee", "drop", "none", "laptop"];

function Card({ project, i }: { project: Project; i: number }) {
  const id = `card-${slug(project.name)}`;
  return (
    <article id={id} className="px-panel px-card relative flex h-full flex-col p-0">
      <div className="absolute bottom-full right-[27px] z-[3] mb-1.5">
        <CardCritter target={id} job={JOBS[i % JOBS.length]} phase={i + 1} />
      </div>
      <div className="border-b-4 border-dashed border-border">
        <Media project={project} className="h-[220px]" />
      </div>
      <div className="flex flex-1 flex-col p-7">
        <div className="flex items-start justify-between gap-4">
          <h3 className="m-0 font-display text-[28px] font-bold uppercase leading-none">
            {project.slug ? (
              <Link href={`/work/${project.slug}`} className="px-link after:absolute after:inset-0">
                {project.name}
              </Link>
            ) : (
              project.name
            )}
          </h3>
          <span className="px-label shrink-0">{project.year}</span>
        </div>
        <p className="m-0 mt-2 text-[22px] text-accent">{project.blurb}</p>
        <p className="mb-0 mt-3 text-[22px] text-fg-muted">{project.description}</p>
        <ul className="m-0 mt-auto flex list-none flex-wrap p-0 pt-5">
          {project.stack.map((s) => (
            <li key={s} className="px-chip">
              {s}
            </li>
          ))}
        </ul>
        <Links project={project} />
      </div>
    </article>
  );
}

export function Work() {
  return (
    <Section id="work" index="03" title="Selected Work">
      {highlightProject && (
        <div className="px-reveal">
          <Lead project={highlightProject} />
        </div>
      )}
      <div className="grid gap-x-10 gap-y-20 pt-8 sm:grid-cols-2">
        {featuredProjects.map((p, i) => (
          <Reveal
            key={p.name}
            className={`h-full ${featuredProjects.length % 2 === 1 && i === featuredProjects.length - 1 ? "sm:col-span-2" : ""}`}
          >
            <Card project={p} i={i} />
          </Reveal>
        ))}
      </div>

      {otherProjects.length > 0 && (
        <Reveal className="mt-20">
          <h3 className="px-label m-0">Also built</h3>
          <ul className="px-panel m-0 mt-5 list-none divide-y-4 divide-raised p-0">
            {otherProjects.map((p) => (
              <li key={p.name}>
                <a
                  href={p.repo}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex min-h-14 items-center justify-between gap-4 px-6 py-4 hover:text-accent"
                >
                  <span className="min-w-0">
                    <span className="font-display text-[20px] font-semibold uppercase">{p.name}</span>
                    <span className="ml-3 text-fg-muted">{p.blurb}</span>
                  </span>
                  <ArrowUpRight className="size-4 shrink-0" />
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      )}
    </Section>
  );
}
