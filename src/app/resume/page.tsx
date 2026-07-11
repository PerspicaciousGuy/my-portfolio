import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { site, socials, about, skills, timeline, featuredProjects } from "@/data/site";
import { PrintButton } from "@/components/print-button";

export const metadata: Metadata = {
  title: "Résumé",
  description: `Résumé of ${site.name}, ${site.role}.`,
};

export default function ResumePage() {
  const links = socials.filter((s) => s.label !== "Email");

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16 print:max-w-none print:p-0">
      {/* Screen-only chrome; hidden in the printed PDF. */}
      <div className="mb-12 flex items-center justify-between print:hidden">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-mono text-xs text-fg-subtle transition hover:text-accent"
        >
          <ArrowLeft className="size-3.5" />
          back
        </Link>
        <PrintButton />
      </div>

      <article className="resume">
        <header className="border-b border-border pb-6">
          <h1 className="text-4xl font-semibold tracking-tight">{site.name}</h1>
          <p className="mt-1.5 text-lg text-fg-muted">{site.role}</p>

          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm text-fg-muted">
            <li>{site.location}</li>
            <li>
              <a href={`mailto:${site.email}`} className="hover:text-accent">
                {site.email}
              </a>
            </li>
            {links.map((s) => (
              <li key={s.label}>
                <a href={s.href} className="hover:text-accent">
                  {s.href.replace(/^https?:\/\//, "")}
                </a>
              </li>
            ))}
          </ul>
        </header>

        <Block title="Summary">
          <p className="leading-relaxed text-fg-muted">
            {about.paragraphs[0]} {about.paragraphs[1]}
          </p>
        </Block>

        <Block title="Skills">
          <dl className="space-y-1.5">
            {skills.map((g) => (
              <div key={g.title} className="flex gap-3 text-sm">
                <dt className="w-32 shrink-0 font-medium">{g.title}</dt>
                <dd className="text-fg-muted">{g.items.join(" · ")}</dd>
              </div>
            ))}
          </dl>
        </Block>

        <Block title="Projects">
          <ul className="space-y-4">
            {featuredProjects.map((p) => (
              <li key={p.name}>
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-medium">
                    {p.name}
                    <span className="ml-2 font-mono text-xs font-normal text-fg-subtle">
                      {p.stack.slice(0, 4).join(" · ")}
                    </span>
                  </h3>
                  <span className="shrink-0 font-mono text-xs text-fg-subtle">
                    {p.year}
                  </span>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-fg-muted">
                  {p.blurb}
                </p>
                <p className="mt-0.5 font-mono text-xs text-fg-subtle">
                  {p.repo.replace(/^https?:\/\//, "")}
                </p>
              </li>
            ))}
          </ul>
        </Block>

        <Block title="Education & Timeline">
          <ul className="space-y-3">
            {timeline.map((t) => (
              <li key={t.title} className="flex gap-4 text-sm">
                <span className="w-36 shrink-0 font-mono text-xs text-fg-subtle">
                  {t.period}
                </span>
                <span>
                  <span className="font-medium">{t.title}</span>
                  {t.org && (
                    <span className="text-fg-subtle"> — {t.org}</span>
                  )}
                  <span className="mt-0.5 block leading-relaxed text-fg-muted">
                    {t.description}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </Block>
      </article>
    </main>
  );
}

function Block({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-8 break-inside-avoid">
      <h2 className="mb-3 font-mono text-xs uppercase tracking-widest text-accent">
        {title}
      </h2>
      {children}
    </section>
  );
}
