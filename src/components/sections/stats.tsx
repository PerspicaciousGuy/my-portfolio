import { apiTestCount, projects, shippingSince } from "@/data/site";
import { getPosts } from "@/lib/posts";

const yearsSince = (iso: string) => Math.max(1, Math.floor((Date.now() - new Date(iso).getTime()) / (365.25 * 24 * 3600 * 1000)));

/** Four numbers at a glance. Each is computed from the site's own data, so none can drift. */
export async function Stats() {
  const posts = await getPosts();
  const figures = [
    { value: String(apiTestCount), label: "Tests on the API" },
    { value: String(projects.filter((p) => p.live).length), label: "Projects live in production" },
    { value: String(yearsSince(shippingSince)), label: "Years shipping" },
    { value: String(posts.length), label: "Posts written" },
  ];

  return (
    <section aria-label="At a glance" className="relative z-[1] pt-[72px]">
      <div className="px-wrap">
        <dl className="px-panel px-reveal m-0 flex flex-wrap">
          {figures.map((f, i) => (
            <div key={f.label} className={`flex-[1_1_220px] px-[30px] py-[26px] ${i < figures.length - 1 ? "border-r-4 border-raised" : ""}`}>
              <dd className="m-0 font-display text-[52px] font-bold leading-none text-accent">{f.value}</dd>
              <dt className="px-label mt-2">{f.label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
