import { timeline, type TimelineEntry } from "@/data/site";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

const MARK: Record<TimelineEntry["kind"], string> = {
  education: "bg-violet",
  build: "bg-accent",
  milestone: "bg-green",
};
const KIND: Record<TimelineEntry["kind"], string> = { education: "Education", build: "Build", milestone: "Milestone" };

export function Journey() {
  return (
    <Section id="journey" index="04" title="Journey">
      <ol className="m-0 ml-3 list-none border-l-4 border-border p-0 pl-1">
        {timeline.map((entry, i) => (
          <Reveal as="li" key={entry.title} className={`relative pl-11 ${i < timeline.length - 1 ? "pb-11" : ""}`}>
            <span aria-hidden="true" className={`absolute -left-[14px] top-1.5 size-5 shadow-[0_0_0_4px_rgb(var(--bg))] ${MARK[entry.kind]}`} />
            <p className="px-label m-0">
              {entry.period} · {KIND[entry.kind]}
            </p>
            <h3 className="m-0 mt-1.5 font-display text-[28px] font-semibold uppercase">{entry.title}</h3>
            <p className="m-0 mt-2 max-w-[760px] text-[24px] text-fg-muted">{entry.description}</p>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
