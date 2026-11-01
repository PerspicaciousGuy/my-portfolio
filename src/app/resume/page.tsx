import type { Metadata } from "next";
import Link from "next/link";
import { site, socials, about, skills, alsoUsed, timeline, resumeProjects } from "@/data/site";
import { Critter } from "@/components/pixel/critter";
import { Icon } from "@/components/pixel/icon";
import { ResumeActions } from "@/components/pixel/resume-actions";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Résumé",
  description: `Résumé of ${site.name}, ${site.role}. Node.js, Next.js, TypeScript, PostgreSQL.`,
  alternates: { canonical: "/resume" },
  openGraph: {
    title: "Résumé",
    description: `Résumé of ${site.name}, ${site.role}. Node.js, Next.js, TypeScript, PostgreSQL.`,
    url: "/resume",
  },
};

const bare = (url: string) => url.replace(/^https?:\/\//, "");

/** Back link, title, one line of copy and the print and copy buttons. */
function Intro({ plain }: { plain: string }) {
  return (
    <>
      <Link href="/" className="px-label inline-flex min-h-11 items-center gap-2 hover:text-accent">
        <Icon name="left" />
        Back
      </Link>
      <h1 className="m-0 mt-3 font-display text-[44px] font-bold uppercase leading-none md:mt-5">Résumé</h1>
      <p className="mb-5 mt-3 text-[24px] text-fg-muted md:mb-6 md:mt-3.5 md:text-[26px]">
        The sheet is exactly what prints: no sky, no shadows, black on white.
      </p>
      <ResumeActions text={plain} />
    </>
  );
}

/** A note about the screen version, and the critter waving from the desk. */
function DeskNote() {
  return (
    <>
      <div className="px-panel mt-10 px-[22px] py-5">
        <div className="px-label">Desk note</div>
        <div className="mt-1.5 text-[23px] text-fg-muted">On screen the critter waves from the desk. It is not on the printed sheet.</div>
      </div>
      <div className="relative mt-[30px] h-[68px] w-[104px]">
        <div className="absolute bottom-0 left-0">
          <Critter u={4} face="happy" arms="wave1" />
        </div>
      </div>
    </>
  );
}

/** The résumé is a paper sheet on a desk. The sheet is exactly what prints. */
export default function ResumePage() {
  const links = socials.filter((s) => s.label !== "Email");
  const summary = `${about.paragraphs[0]} ${about.paragraphs[1]}`;

  const plain = [
    site.name,
    site.role,
    `${site.location} · ${site.email}`,
    links.map((s) => bare(s.href)).join(" · "),
    "",
    "SUMMARY",
    summary,
    "",
    "SKILLS",
    ...skills.map((g) => `${g.title}: ${g.items.join(", ")}`),
    `Also used: ${alsoUsed.join(", ")}`,
    "",
    "PROJECTS",
    ...resumeProjects.map((p) => `${p.name} (${p.year}): ${p.blurb} ${p.repo ? bare(p.repo) : p.note}`),
    "",
    "EDUCATION & TIMELINE",
    ...timeline.map((t) => `${t.period}: ${t.title}${t.org ? ` (${t.org})` : ""}`),
  ].join("\n");

  return (
    <>
      <main className="px-wrap relative z-[1] flex flex-1 flex-wrap items-start gap-6 pt-5 md:gap-14 md:pt-14 print:block print:max-w-none print:p-0">
        {/* Phone: the title and buttons come first, the desk note last; from md up they sit in the side column. */}
        <div className="w-full md:hidden print:hidden">
          <Intro plain={plain} />
        </div>
        <article className="px-sheet resume">
          <h1 className="m-0 font-display text-[34px] font-bold uppercase leading-[0.95] md:text-[44px]">{site.name}</h1>
          <div className="mt-1.5 font-display text-lg font-semibold uppercase md:text-xl" style={{ color: "#9A5A00" }}>
            {site.role}
          </div>
          <div className="m mt-2.5">
            <div className="flex flex-col md:block">
              <span>{site.location}</span>
              <span className="hidden md:inline"> · </span>
              <a href={`mailto:${site.email}`} className="underline underline-offset-2">
                {site.email}
              </a>
            </div>
            <div className="flex flex-col md:block">
              {links.map((s) => (
                <span key={s.label} className="md:after:content-['_·_'] md:last:after:content-none">
                  <a href={s.href} className="underline underline-offset-2">
                    {bare(s.href)}
                  </a>
                </span>
              ))}
            </div>
          </div>

          <h2>Summary</h2>
          <p className="m m-0">{summary}</p>

          <h2>Skills</h2>
          {skills.map((g) => (
            <div key={g.title} className="sk">
              <span className="st">{g.title}</span> <span className="m">{g.items.join(" · ")}</span>
            </div>
          ))}
          <div className="sk">
            <span className="st">Also used</span> <span className="m">{alsoUsed.join(" · ")}</span>
          </div>

          <h2>Projects</h2>
          {resumeProjects.map((p) => (
            <div key={p.name} className="mb-3">
              <div className="r">
                <h3>{p.name}</h3>
                <span className="d">{p.year}</span>
              </div>
              <div className="m">{p.blurb}</div>
              <div className="m text-[0.85em]">{p.repo ? bare(p.repo) : p.note}</div>
            </div>
          ))}

          <h2>Education &amp; timeline</h2>
          {timeline.map((t) => (
            <div key={t.title} className="mb-2">
              <div className="r tl">
                <span>
                  <b className="font-normal">{t.title}</b>
                  {t.org && <span className="m"> — {t.org}</span>}
                </span>
                <span className="d">{t.period}</span>
              </div>
            </div>
          ))}
        </article>

        <div className="w-full md:hidden print:hidden">
          <DeskNote />
        </div>

        <aside className="sticky top-[100px] hidden min-w-[260px] flex-1 md:block print:hidden">
          <Intro plain={plain} />
          <DeskNote />
        </aside>
      </main>
      <div className="print:hidden">
        <Footer />
      </div>
    </>
  );
}
