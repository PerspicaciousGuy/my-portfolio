import { now } from "@/data/site";
import { getLatestCommit } from "@/lib/github";
import { formatDate } from "@/lib/format-date";

/** A thin "Live" bar: the latest public commit, what I'm building, and availability. */
export async function NowStrip() {
  const commit = await getLatestCommit();
  const building = now.find((n) => n.label === "Building")?.value.split(" — ")[0];

  const cell = "min-w-0 border-r-4 border-raised px-[22px] py-3";
  return (
    <section aria-label="Live status" className="relative z-[1] pt-14">
      <div className="px-wrap">
        <div className="px-panel flex flex-wrap items-stretch">
          <div className="flex items-center gap-3 border-r-4 border-raised px-[22px] py-3.5">
            <i className="px-dot" />
            <span className="font-display text-[18px] font-bold uppercase text-green">Live</span>
          </div>
          {commit && (
            <div className={`${cell} flex-[2_1_360px]`}>
              <div className="px-label">Last commit</div>
              <div className="break-words text-[22px]">
                {commit.repo} · “{commit.message}” · {formatDate(commit.date)}
              </div>
            </div>
          )}
          {building && (
            <div className={`${cell} flex-[1_1_240px]`}>
              <div className="px-label">Building</div>
              <div className="text-[22px]">{building}</div>
            </div>
          )}
          <div className="min-w-0 flex-[1_1_240px] px-[22px] py-3">
            <div className="px-label">Status</div>
            <div className="text-[22px] text-green">Open to work</div>
          </div>
        </div>
      </div>
    </section>
  );
}
