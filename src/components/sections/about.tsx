import Image from "next/image";
import { about, now, portrait, site } from "@/data/site";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

export function About() {
  return (
    <Section id="about" index="01" title="About">
      <div className="flex flex-wrap items-stretch gap-10">
        <Reveal className="px-panel flex min-w-0 flex-[3_1_560px] flex-wrap gap-8 p-8">
          {portrait ? (
            <Image src={portrait} alt={`Portrait of ${site.name}`} width={200} height={200} className="size-[200px] flex-none" />
          ) : (
            <div className="px-slot size-[200px] flex-none p-2 text-[13px]">
              <b className="text-accent">Art slot · Portrait</b>
              <span>400 × 400 px</span>
            </div>
          )}
          <div className="min-w-0 flex-[1_1_320px]">
            {about.paragraphs.map((p, i) => (
              <p key={i} className={`mt-0 text-[26px] ${i === 0 ? "mb-[18px]" : "mb-0 text-fg-muted"}`}>
                {p}
              </p>
            ))}
          </div>
        </Reveal>

        <Reveal className="px-panel min-w-0 flex-[2_1_380px] p-8">
          <h3 className="m-0 mb-[22px] font-display text-[24px] font-semibold uppercase text-green">&gt; Now</h3>
          <dl className="m-0 grid gap-[18px]">
            {now.map((item) => (
              <div key={item.label}>
                <dt className="px-label">{item.label}</dt>
                <dd className="m-0 mt-1 text-[24px]">{item.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </Section>
  );
}
