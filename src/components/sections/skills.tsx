import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { alsoUsed, skills } from "@/data/site";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

/**
 * Skills, tied to evidence.
 *
 * A flat tag cloud lists HTML next to Node.js and lets the reader conclude
 * nothing. Each group here says what it means in practice and links to the
 * place on the site where you can watch it working.
 */
export function Skills() {
  return (
    <Section id="skills" index="02" title="Skills">
      <div className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2">
        {skills.map((group, i) => (
          <Reveal
            key={group.title}
            delay={i * 0.06}
            className="h-full bg-bg-elevated/70 backdrop-blur"
          >
            <div className="flex h-full flex-col p-6">
              <h3 className="font-mono text-xs uppercase tracking-widest text-accent">
                {group.title}
              </h3>

              <p className="mt-3 text-pretty text-sm leading-relaxed text-fg-muted">
                {group.note}
              </p>

              <ul className="mt-5 flex flex-wrap gap-2">
                {group.items.map((s) => (
                  <li
                    key={s}
                    className="rounded-md border border-border px-2.5 py-1 text-sm text-fg-muted"
                  >
                    {s}
                  </li>
                ))}
              </ul>

              {group.proof && (
                <Link
                  href={group.proof.href}
                  className="group mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-medium text-accent transition hover:opacity-80"
                >
                  {group.proof.label}
                  <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              )}
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <div className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-2">
          <span className="font-mono text-[11px] uppercase tracking-widest text-fg-subtle">
            Also used
          </span>
          <span className="text-sm text-fg-subtle">{alsoUsed.join(" · ")}</span>
        </div>
      </Reveal>
    </Section>
  );
}
