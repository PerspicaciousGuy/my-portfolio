import { timeline, type TimelineEntry } from "@/data/site";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

const MARK: Record<TimelineEntry["kind"], string> = {
  education: "bg-violet",
  build: "bg-accent",
  milestone: "bg-green",
};

export function Journey() {
  return (
    <Section id="journey" index="04" title="Journey">
      <ol className="m-0 list-none border-l-4 border-border p-0 pl-8">
        {timeline.map((entry) => (
          <Reveal as="li" key={entry.title} className="relative pb-10 last:pb-0">
            <span aria-hidden="true" className={`absolute -left-[46px] top-1.5 size-[20px] ${MARK[entry.kind]}`} />
            <p className="px-label m-0">
              {entry.period} · {entry.kind}
            </p>
            <h3 className="m-0 mt-1.5 font-display text-[26px] font-bold uppercase">{entry.title}</h3>
            {entry.org && <p className="m-0 text-accent">{entry.org}</p>}
            <p className="m-0 mt-2 max-w-[720px] text-[24px] text-fg-muted">{entry.description}</p>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
