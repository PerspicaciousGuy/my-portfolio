import Link from "next/link";
import { Icon } from "@/components/pixel/icon";
import { alsoUsed, skills } from "@/data/site";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

/**
 * Skills, tied to evidence. Each group says what it means in practice and
 * links to the place on the site where you can watch it working.
 */
export function Skills() {
  return (
    <Section id="skills" index="02" title="Skills">
      <div className="grid gap-10 sm:grid-cols-2">
        {skills.map((group) => (
          <Reveal key={group.title} className="px-panel flex flex-col p-7">
            <h3 className="m-0 font-display text-[22px] font-semibold uppercase text-green">{group.title}</h3>
            <p className="mb-5 mt-3 text-[22px] text-fg-muted">{group.note}</p>
            <ul className="m-0 flex list-none flex-wrap p-0">
              {group.items.map((s) => (
                <li key={s} className="px-chip">
                  {s}
                </li>
              ))}
            </ul>
            {group.proof && (
              <Link
                href={group.proof.href}
                className="group mt-auto inline-flex min-h-11 items-center gap-1.5 pt-5 font-display text-[16px] font-semibold uppercase text-accent hover:underline"
              >
                {group.proof.label}
                <Icon name="upright" />
              </Link>
            )}
          </Reveal>
        ))}
      </div>
      <Reveal className="mt-10 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="px-label">Also used</span>
        <span className="text-fg-muted">{alsoUsed.join(" · ")}</span>
      </Reveal>
    </Section>
  );
}
