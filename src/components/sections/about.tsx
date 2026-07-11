import { about, now } from "@/data/site";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

export function About() {
  return (
    <Section id="about" index="01" title="About">
      <div className="grid gap-12 lg:grid-cols-[1.35fr_1fr] lg:gap-16">
        <div className="space-y-6">
          {about.paragraphs.map((p, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <p className="text-pretty text-lg leading-relaxed text-fg-muted">
                {p}
              </p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.12}>
          <div className="rounded-2xl border border-border bg-bg-elevated/60 p-6 backdrop-blur">
            <div className="flex items-center gap-2">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-70" />
                <span className="relative inline-flex size-1.5 rounded-full bg-accent" />
              </span>
              <h3 className="font-mono text-xs uppercase tracking-widest text-accent">
                Right now
              </h3>
            </div>

            <dl className="mt-5 space-y-4">
              {now.map((item) => (
                <div key={item.label}>
                  <dt className="font-mono text-[11px] uppercase tracking-wider text-fg-subtle">
                    {item.label}
                  </dt>
                  <dd className="mt-0.5 text-pretty text-sm leading-relaxed text-fg-muted">
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
