import { about } from "@/data/site";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

export function About() {
  return (
    <Section id="about" index="01" title="About">
      <div className="max-w-2xl space-y-6">
        {about.paragraphs.map((p, i) => (
          <Reveal key={i} delay={i * 0.08}>
            <p className="text-pretty text-lg leading-relaxed text-fg-muted">{p}</p>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
