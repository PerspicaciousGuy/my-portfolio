import { GraduationCap, Hammer, Sparkles } from "lucide-react";
import { timeline, type TimelineEntry } from "@/data/site";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

const icons: Record<TimelineEntry["kind"], typeof Hammer> = {
  education: GraduationCap,
  build: Hammer,
  milestone: Sparkles,
};

export function Journey() {
  return (
    <Section id="journey" index="03" title="Journey">
      <ol className="relative space-y-10 border-l border-border pl-8 sm:pl-10">
        {timeline.map((entry, i) => {
          const Icon = icons[entry.kind];
          return (
            <Reveal as="li" key={entry.title} delay={i * 0.05} className="relative">
              <span className="absolute -left-[41px] grid size-6 place-items-center rounded-full border border-border bg-bg text-accent sm:-left-[49px]">
                <Icon className="size-3" />
              </span>
              <p className="font-mono text-xs text-fg-subtle">{entry.period}</p>
              <h3 className="mt-1.5 text-lg font-medium">{entry.title}</h3>
              {entry.org && <p className="text-sm text-accent">{entry.org}</p>}
              <p className="mt-2 max-w-xl text-pretty leading-relaxed text-fg-muted">
                {entry.description}
              </p>
            </Reveal>
          );
        })}
      </ol>
    </Section>
  );
}
