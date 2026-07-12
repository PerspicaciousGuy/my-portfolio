const ENDPOINT = "https://ws.audioscrobbler.com/2.0/";

// Last.fm's default "no album art" placeholder. When a track has no cover,
// Last.fm returns this star image — we'd rather show nothing than the star.
const PLACEHOLDER_HASH = "2a96cbd8b46e442fc41c2b86b821562f";

export type Track = {
  title: string;
  artist: string;
  album: string;
  url: string;
  art: string | null;
  playing: boolean;
};

type LastfmImage = { "#text": string; size: string };
type LastfmTrack = {
  name: string;
  url: string;
  artist: { "#text": string };
  album: { "#text": string };
  image: LastfmImage[];
  "@attr"?: { nowplaying?: string };
};

function pickArt(images: LastfmImage[]): string | null {
  // Images run smallest → largest; take the biggest with a real URL.
  const url = [...images].reverse().find((i) => i["#text"])?.["#text"];
  if (!url || url.includes(PLACEHOLDER_HASH)) return null;
  return url;
}

/**
 * What the user is scrobbling right now, or the last thing they played.
 * Works on a free Spotify account by reading Last.fm scrobbles instead of
 * Spotify's Premium-gated player API. Returns null when unconfigured or on
 * any error — the UI simply omits the row.
 */
export async function getNowPlaying(): Promise<Track | null> {
  const key = process.env.LASTFM_API_KEY;
  const user = process.env.LASTFM_USERNAME;
  if (!key || !user) return null;

  const url =
    ENDPOINT +
    "?" +
    new URLSearchParams({
      method: "user.getrecenttracks",
      user,
      api_key: key,
      format: "json",
      limit: "1",
    });

  try {
    // Revalidate at most every 30s so the card can't hammer Last.fm but still
    // feels live.
    const res = await fetch(url, { next: { revalidate: 30 } });
    if (!res.ok) return null;

    const json = await res.json();
    const track: LastfmTrack | undefined = json?.recenttracks?.track?.[0];
    if (!track) return null;

    return {
      title: track.name,
      artist: track.artist["#text"],
      album: track.album["#text"],
      url: track.url,
      art: pickArt(track.image),
      // Only the currently-scrobbling track carries this flag.
      playing: track["@attr"]?.nowplaying === "true",
    };
  } catch {
    return null;
  }
}
