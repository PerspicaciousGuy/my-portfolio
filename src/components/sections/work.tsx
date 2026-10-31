import Image from "next/image";
import Link from "next/link";
import { featuredProjects, highlightProject, otherProjects, type Project } from "@/data/site";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { CardCritter, type CardJob } from "@/components/pixel/card-critter";

const slug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

/** A project's thumbnail, or a labelled slot until the art exists. */
function Media({ project, lead, className }: { project: Project; lead?: boolean; className?: string }) {
  if (project.preview) {
    return <Image src={project.preview} alt="" width={1200} height={840} sizes="(max-width: 900px) 100vw, 600px" className={`block w-full object-cover object-top ${className ?? ""}`} />;
  }
  return (
    <div className={`px-slot p-2 text-[13px] ${className ?? ""}`} style={{ borderWidth: 0 }}>
      <b className="text-accent">Art slot · {lead ? "Lead project" : project.name}</b>
      {lead && <span>{project.name} — docs site or pixel scene</span>}
      <span>{lead ? "1200 × 840 px PNG · shown at 600 × 420" : "1200 × 520 px PNG · shown at 600 × 260"}</span>
    </div>
  );
}

/** Case study, live and source buttons, as on a card: source only appears when there is nothing else to open. */
function Buttons({ project, all }: { project: Project; all?: boolean }) {
  const source = all || (!project.slug && !project.live);
  return (
    <div className="flex flex-wrap gap-2">
      {project.slug && (
        <Link href={`/work/${project.slug}`} className="px-btn px-btn-primary px-btn-sm">
          Case study
        </Link>
      )}
      {project.live && (
        <a href={project.live} target="_blank" rel="noreferrer" className="px-btn px-btn-ghost px-btn-sm">
          {all ? "Live docs" : "Live"}
        </a>
      )}
      {source && (
        <a href={project.repo} target="_blank" rel="noreferrer" className="px-btn px-btn-ghost px-btn-sm">
          Source
        </a>
      )}
    </div>
  );
}

function Lead({ project }: { project: Project }) {
  const id = `card-${slug(project.name)}`;
  return (
    <article id={id} className="px-panel-hi relative mb-14 flex flex-wrap p-0">
      <div className="pointer-events-none absolute bottom-full right-[27px] z-[3] mb-1.5">
        <CardCritter target={id} job="laptop" phase={0} />
      </div>
      <div className="min-h-[420px] min-w-0 flex-[1_1_520px] border-r-4 border-dashed border-border">
        <Media project={project} lead className="h-full min-h-[420px]" />
      </div>
      <div className="min-w-0 flex-[1_1_560px] px-10 py-9">
        <p className="px-label m-0 text-[15px] tracking-[0.1em] text-accent">★ Featured · {project.year}</p>
        <h3 className="m-0 mt-2.5 font-display text-[44px] font-bold uppercase leading-none">{project.name}</h3>
        <p className="mb-0 mt-4 text-[26px] text-fg-muted">{project.blurb}</p>
        {project.metrics && (
          <dl className="m-0 mt-[26px] grid grid-cols-2 gap-x-6 gap-y-4">
            {project.metrics.map((m) => (
              <div key={m.label}>
                <dt className="px-label">{m.label}</dt>
                <dd className={`m-0 mt-0.5 text-[26px] ${m.label === "Status" ? "text-green" : ""}`}>{m.value}</dd>
              </div>
            ))}
          </dl>
        )}
        <div className="mt-[22px]">
          {project.stack.map((s) => (
            <span key={s} className="px-chip">
              {s}
            </span>
          ))}
        </div>
        <div className="mt-7">
          <Buttons project={project} all />
        </div>
      </div>
    </article>
  );
}

const JOBS: CardJob[] = ["coffee", "drop", "none", "laptop"];

function Card({ project, i }: { project: Project; i: number }) {
  const id = `card-${slug(project.name)}`;
  return (
    <article id={id} className="px-panel relative flex h-full flex-col p-0">
      <div className="pointer-events-none absolute bottom-full right-[27px] z-[3] mb-1.5">
        <CardCritter target={id} job={JOBS[i % JOBS.length]} phase={i + 1} />
      </div>
      <div className="border-b-4 border-border">
        <Media project={project} className="h-[260px]" />
      </div>
      <div className="flex flex-1 flex-col px-[30px] pb-[30px] pt-[26px]">
        <div className="flex items-baseline justify-between">
          <h3 className="m-0 font-display text-[30px] font-bold uppercase">{project.name}</h3>
          <span className="px-label">{project.year}</span>
        </div>
        <p className="mb-4 mt-2.5 text-[23px] text-fg-muted">{project.blurb}</p>
        <div>
          {project.stack.slice(0, 5).map((s) => (
            <span key={s} className="px-chip">
              {s}
            </span>
          ))}
        </div>
        <div className="mt-auto pt-[22px]">
          <Buttons project={project} />
        </div>
      </div>
    </article>
  );
}

export function Work() {
  return (
    <Section id="work" index="03" title="Work">
      {highlightProject && (
        <div className="px-reveal">
          <Lead project={highlightProject} />
        </div>
      )}
      <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2">
        {featuredProjects.map((p, i) => (
          <Reveal key={p.name}>
            <Card project={p} i={i} />
          </Reveal>
        ))}
      </div>

      {otherProjects.length > 0 && (
        <Reveal className="px-panel mt-14 px-8 py-7">
          <h3 className="m-0 mb-2 font-display text-[22px] font-semibold uppercase text-green">&gt; More builds</h3>
          <ul className="m-0 list-none p-0">
            {otherProjects.map((p, i) => (
              <li
                key={p.name}
                className={`flex flex-wrap items-baseline gap-x-6 gap-y-1 py-3.5 ${i < otherProjects.length - 1 ? "border-b-4 border-raised" : ""} ${i === otherProjects.length - 1 ? "pb-0" : ""}`}
              >
                <a href={p.repo} target="_blank" rel="noreferrer" className="flex-none font-display text-[20px] font-semibold uppercase hover:text-accent sm:w-[220px]">
                  {p.name}
                </a>
                <span className="min-w-0 flex-[1_1_360px] text-[23px] text-fg-muted">{p.blurb}</span>
                <span className="px-label">{p.year}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      )}
    </Section>
  );
}
