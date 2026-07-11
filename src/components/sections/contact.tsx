import { ArrowUpRight } from "lucide-react";
import { site, socials } from "@/data/site";
import { Reveal } from "@/components/ui/reveal";

export function Contact() {
  return (
    <section
      id="contact"
      className="relative mx-auto w-full max-w-5xl px-6 py-32 sm:py-44"
    >
      <Reveal>
        <p className="font-mono text-sm text-accent">05 — Contact</p>
        <h2 className="mt-6 text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
          Let&apos;s build something.
        </h2>
        <p className="mt-6 max-w-lg text-pretty text-lg text-fg-muted">
          I&apos;m open to work and always up for talking about a good project.
          The inbox is the fastest way to reach me.
        </p>
      </Reveal>

      <Reveal delay={0.1}>
        <a
          href={`mailto:${site.email}`}
          className="group mt-10 inline-flex items-center gap-3 text-xl font-medium transition-colors hover:text-accent sm:text-2xl"
        >
          {site.email}
          <ArrowUpRight className="size-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>
      </Reveal>

      <Reveal delay={0.2}>
        <ul className="mt-14 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-3">
          {socials
            .filter((s) => s.label !== "Email")
            .map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between bg-bg-elevated/70 p-5 backdrop-blur transition-colors hover:text-accent"
                >
                  <span>
                    <span className="block font-mono text-xs uppercase tracking-widest text-fg-subtle">
                      {s.label}
                    </span>
                    <span className="mt-1 block text-sm">{s.handle}</span>
                  </span>
                  <ArrowUpRight className="size-4 text-fg-subtle transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
                </a>
              </li>
            ))}
        </ul>
      </Reveal>
    </section>
  );
}
