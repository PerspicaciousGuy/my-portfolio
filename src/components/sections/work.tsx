"use client";

import { useRef } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { ArrowUpRight, Code2 } from "lucide-react";
import { featuredProjects, otherProjects, type Project } from "@/data/site";
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

      <div className="relative flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-xl font-medium tracking-tight">{project.name}</h3>
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

        <div className="mt-6 flex items-center gap-4">
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

export function Work() {
  return (
    <Section id="work" index="04" title="Selected Work">
      <div className="grid gap-5 sm:grid-cols-2">
        {featuredProjects.map((p, i) => (
          <Reveal key={p.name} delay={(i % 2) * 0.08} className="h-full">
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
