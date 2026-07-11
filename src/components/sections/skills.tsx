import { skills } from "@/data/site";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

export function Skills() {
  return (
    <Section id="skills" index="02" title="Skills">
      <div className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2">
        {skills.map((group, i) => (
          <Reveal
            key={group.title}
            delay={i * 0.06}
            className="h-full bg-bg-elevated/70 backdrop-blur sm:last:col-span-2"
          >
            <div className="h-full p-6">
              <h3 className="font-mono text-xs uppercase tracking-widest text-accent">
                {group.title}
              </h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {group.items.map((s) => (
                  <li
                    key={s}
                    className="rounded-md border border-border px-2.5 py-1 text-sm text-fg-muted transition-colors hover:border-accent/40 hover:text-fg"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
