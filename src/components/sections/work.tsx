"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { ArrowUpRight, BookOpen, Code2 } from "lucide-react";
import {
  featuredProjects,
  highlightProject,
  otherProjects,
  type Project,
} from "@/data/site";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

function ProjectCard({ project }: { project: Project }) {
  const ref = useRef<HTMLElement>(null);

  const rx = useSpring(useMotionValue(0), { stiffness: 220, damping: 22 });
  const ry = useSpring(useMotionValue(0), { stiffness: 220, damping: 22 });
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);

  const glow = useMotionTemplate`radial-gradient(420px circle at ${gx}% ${gy}%, rgb(var(--accent) / 0.10), transparent 65%)`;

  function onMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    // Subtle tilt — enough to feel physical, not enough to be a gimmick.
    ry.set((px - 0.5) * 7);
    rx.set((0.5 - py) * 7);
    gx.set(px * 100);
    gy.set(py * 100);
  }

  function onLeave() {
    rx.set(0);
    ry.set(0);
  }

  return (
    <motion.article
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-bg-elevated/60 p-6 backdrop-blur transition-colors hover:border-accent/40 sm:p-7"
    >
      <motion.div
        style={{ background: glow }}
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />

      {project.preview && (
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <Image
            src={project.preview}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
            className="object-cover object-top"
          />
          {/* Keep the copy legible over the screenshot. */}
          <div className="absolute inset-0 bg-bg-elevated/85 backdrop-blur-[2px]" />
        </div>
      )}

      <div className="relative flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-xl font-medium tracking-tight">
            {project.slug ? (
              // Stretched link: the whole card becomes clickable, while the
              // Source/demo links below still work (they sit above it in z).
              <Link
                href={`/work/${project.slug}`}
                className="transition-colors after:absolute after:inset-0 hover:text-accent"
              >
                {project.name}
              </Link>
            ) : (
              project.name
            )}
          </h3>
          <span className="shrink-0 font-mono text-xs text-fg-subtle">
            {project.year}
          </span>
        </div>

        <p className="mt-2 text-pretty text-sm font-medium text-accent">
          {project.blurb}
        </p>

        <p className="mt-3 text-pretty leading-relaxed text-fg-muted">
          {project.description}
        </p>

        <ul className="mt-auto flex flex-wrap gap-1.5 pt-5">
          {project.stack.map((s) => (
            <li
              key={s}
              className="rounded border border-border px-2 py-0.5 font-mono text-[11px] text-fg-subtle"
            >
              {s}
            </li>
          ))}
        </ul>

        {/* relative + z-10 so these stay clickable above the stretched link. */}
        <div className="relative z-10 mt-6 flex items-center gap-4">
          {project.slug && (
            <Link
              href={`/work/${project.slug}`}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-accent transition hover:opacity-80"
            >
              <BookOpen className="size-4" />
              Case study
            </Link>
          )}
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
      </div>
    </motion.article>
  );
}

/**
 * The lead project, full width. It's a product, not a side project, and the
 * grid card treated it as one of six equals — which averaged it down to the
 * weakest thing on the page.
 */
function HighlightCard({ project }: { project: Project }) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-border bg-bg-elevated/60 p-7 backdrop-blur transition-colors hover:border-accent/40 sm:p-9">
      <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-accent/10 blur-3xl" />

      <div className="relative">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-accent">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-70" />
              <span className="relative inline-flex size-1.5 rounded-full bg-accent" />
            </span>
            Live in production
          </span>
          <span className="font-mono text-xs text-fg-subtle">{project.year}</span>
        </div>

        <h3 className="mt-5 text-2xl font-semibold tracking-tight sm:text-3xl">
          {project.slug ? (
            <Link
              href={`/work/${project.slug}`}
              className="transition-colors after:absolute after:inset-0 hover:text-accent"
            >
              {project.name}
            </Link>
          ) : (
            project.name
          )}
        </h3>

        <p className="mt-3 max-w-2xl text-pretty text-base leading-relaxed text-fg-muted">
          {project.description}
        </p>

        {project.metrics && (
          <dl className="mt-7 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-4">
            {project.metrics.map((m) => (
              <div key={m.label} className="bg-bg-elevated p-4">
                <dt className="font-mono text-[10px] uppercase tracking-widest text-fg-subtle">
                  {m.label}
                </dt>
                <dd className="mt-1 text-sm font-medium">{m.value}</dd>
              </div>
            ))}
          </dl>
        )}

        <ul className="mt-6 flex flex-wrap gap-1.5">
          {project.stack.map((s) => (
            <li
              key={s}
              className="rounded border border-border px-2 py-0.5 font-mono text-[11px] text-fg-subtle"
            >
              {s}
            </li>
          ))}
        </ul>

        {/* The case study is the highest-value click on the page — it's where
            the live playground lives. Make it a button, not a text link. */}
        <div className="relative z-10 mt-8 flex flex-wrap items-center gap-3">
          {project.slug && (
            <Link
              href={`/work/${project.slug}`}
              className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-fg transition hover:opacity-90"
            >
              <BookOpen className="size-4" />
              Read the case study
            </Link>
          )}
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium transition hover:border-accent/50 hover:text-accent"
            >
              <ArrowUpRight className="size-4" />
              Docs
            </a>
          )}
          <a
            href={project.repo}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-1 text-sm text-fg-muted transition hover:text-accent"
          >
            <Code2 className="size-4" />
            Source
          </a>
        </div>
      </div>
    </article>
  );
}

export function Work() {
  return (
    <Section id="work" index="04" title="Selected Work">
      {highlightProject && (
        <Reveal className="mb-5 block">
          <HighlightCard project={highlightProject} />
        </Reveal>
      )}

      {/* An odd number of cards would leave a hole in the last row, so the
          final one spans both columns rather than stranding empty space. */}
      <div className="grid gap-5 sm:grid-cols-2">
        {featuredProjects.map((p, i) => (
          <Reveal
            key={p.name}
            delay={(i % 2) * 0.08}
            className={`h-full ${
              featuredProjects.length % 2 === 1 &&
              i === featuredProjects.length - 1
                ? "sm:col-span-2"
                : ""
            }`}
          >
            <ProjectCard project={p} />
          </Reveal>
        ))}
      </div>

      {otherProjects.length > 0 && (
        <Reveal>
          <div className="mt-14">
            <h3 className="font-mono text-xs uppercase tracking-widest text-fg-subtle">
              Also built
            </h3>
            <ul className="mt-5 divide-y divide-border border-y border-border">
              {otherProjects.map((p) => (
                <li key={p.name}>
                  <a
                    href={p.repo}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center justify-between gap-4 py-4 transition-colors hover:text-accent"
                  >
                    <div className="min-w-0">
                      <span className="font-medium">{p.name}</span>
                      <span className="ml-3 text-sm text-fg-subtle">{p.blurb}</span>
                    </div>
                    <ArrowUpRight className="size-4 shrink-0 text-fg-subtle transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      )}
    </Section>
  );
}
