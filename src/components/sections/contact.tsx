import { ArrowUpRight } from "lucide-react";
import { site, socials } from "@/data/site";
import { Reveal } from "@/components/ui/reveal";
import { ContactForm } from "@/components/contact-form";

export function Contact() {
  return (
    <section
      id="contact"
      className="relative mx-auto w-full max-w-5xl px-6 py-32 sm:py-44"
    >
      <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <div>
          <Reveal>
            <p className="font-mono text-sm text-accent">06 — Contact</p>
            <h2 className="mt-6 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              Let&apos;s build something.
            </h2>
            <p className="mt-6 max-w-md text-pretty text-lg text-fg-muted">
              I&apos;m open to work and always up for talking about a good
              project.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <a
              href={`mailto:${site.email}`}
              className="group mt-8 inline-flex items-center gap-2 font-medium transition-colors hover:text-accent"
            >
              {site.email}
              <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </Reveal>

          <Reveal delay={0.16}>
            <ul className="mt-10 space-y-2">
              {socials
                .filter((s) => s.label !== "Email")
                .map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      className="group inline-flex items-center gap-2 text-sm text-fg-muted transition hover:text-accent"
                    >
                      <span className="font-mono text-xs uppercase tracking-widest text-fg-subtle">
                        {s.label}
                      </span>
                      {s.handle}
                      <ArrowUpRight className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                    </a>
                  </li>
                ))}
            </ul>
          </Reveal>
        </div>

        <Reveal delay={0.12}>
          <div className="rounded-2xl border border-border bg-bg-elevated/60 p-6 backdrop-blur sm:p-7">
            <ContactForm />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
