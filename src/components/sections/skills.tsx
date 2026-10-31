import Link from "next/link";
import { alsoUsed, skills } from "@/data/site";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

/**
 * Skills, tied to evidence: each group says what it means in practice and
 * links to the place on the site where you can watch it working.
 */
export function Skills() {
  return (
    <Section id="skills" index="02" title="Skills">
      <div className="grid gap-10 sm:grid-cols-2">
        {skills.map((group) => (
          <Reveal key={group.title} className="px-panel px-[30px] py-7">
            <h3 className="m-0 font-display text-[26px] font-semibold uppercase text-accent">{group.title}</h3>
            <p className="mb-[18px] mt-2.5 text-[23px] text-fg-muted">{group.note}</p>
            <div>
              {group.items.map((s) => (
                <span key={s} className="px-chip">
                  {s}
                </span>
              ))}
            </div>
            {group.proof && (
              <Link
                href={group.proof.href}
                className="mt-5 inline-block py-2.5 font-display text-[15px] uppercase text-green hover:text-accent"
              >
                &gt; {group.proof.label}
              </Link>
            )}
          </Reveal>
        ))}
      </div>
      <Reveal className="mx-1 mb-0 mt-9 text-[22px] text-fg-muted">
        <span className="px-label mr-3">Also used</span>
        {alsoUsed.join(" · ")}
      </Reveal>
    </Section>
  );
}
