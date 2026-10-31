import { site, socials } from "@/data/site";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

export function Contact({ index = "07" }: { index?: string }) {
  const links = socials.filter((s) => s.label !== "Email");
  return (
    <Section id="contact" index={index} title="Contact">
      <Reveal className="px-panel-hi flex flex-wrap items-center gap-12 px-12 py-14">
        <div className="min-w-0 flex-[1_1_440px]">
          <h3 className="m-0 font-display text-[clamp(40px,5vw,64px)] font-bold uppercase leading-none">
            Let&apos;s build
            <br />
            <span className="text-accent">something.</span>
          </h3>
          <p className="mb-0 mt-5 max-w-[520px] text-[28px] text-fg-muted">
            I&apos;m open to work. Email is the fastest way to reach me.
          </p>
          <a href={`mailto:${site.email}`} className="px-btn px-btn-primary mt-7">
            {site.email}
          </a>
        </div>
        <ul className="m-0 grid min-w-0 flex-[1_1_300px] list-none gap-1 p-0">
          {links.map((s, i) => (
            <li key={s.label}>
              <a
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className={`flex min-h-12 items-center justify-between gap-4 py-3 hover:text-accent ${i < links.length - 1 ? "border-b-4 border-raised" : ""}`}
              >
                <span className="px-label">{s.label}</span>
                <span className="text-[24px]">{s.handle}</span>
              </a>
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}
