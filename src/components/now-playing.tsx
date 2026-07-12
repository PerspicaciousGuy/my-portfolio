import Image from "next/image";
import { getNowPlaying } from "@/lib/lastfm";

/** Renders nothing at all when Last.fm isn't configured. */
export async function NowPlaying() {
  const track = await getNowPlaying();
  if (!track) return null;

  return (
    <div className="mt-5 border-t border-border pt-5">
      <p className="font-mono text-[11px] uppercase tracking-wider text-fg-subtle">
        {track.playing ? "Listening now" : "Last played"}
      </p>

      <a
        href={track.url}
        target="_blank"
        rel="noreferrer"
        className="group mt-2.5 flex items-center gap-3"
      >
        {track.art && (
          <Image
            src={track.art}
            alt=""
            width={40}
            height={40}
            className="size-10 shrink-0 rounded border border-border"
          />
        )}

        <span className="min-w-0">
          <span className="flex items-center gap-1.5">
            {track.playing && (
              // Three bars, bouncing — reads as "audio" without a label.
              <span className="flex items-end gap-[2px]" aria-hidden>
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-[2px] animate-pulse rounded-full bg-accent"
                    style={{
                      height: `${[7, 11, 5][i]}px`,
                      animationDelay: `${i * 160}ms`,
                    }}
                  />
                ))}
              </span>
            )}
            <span className="truncate text-sm font-medium transition-colors group-hover:text-accent">
              {track.title}
            </span>
          </span>
          <span className="mt-0.5 block truncate text-xs text-fg-subtle">
            {track.artist}
          </span>
        </span>
      </a>
    </div>
  );
}
