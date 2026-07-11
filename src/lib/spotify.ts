const TOKEN_URL = "https://accounts.spotify.com/api/token";
const NOW_PLAYING = "https://api.spotify.com/v1/me/player/currently-playing";
const RECENT = "https://api.spotify.com/v1/me/player/recently-played?limit=1";

export type Track = {
  title: string;
  artist: string;
  album: string;
  url: string;
  art: string | null;
  playing: boolean;
};

/**
 * Spotify access tokens last an hour, so we exchange the long-lived refresh
 * token for a fresh one on each request. Returns null if the app isn't
 * configured — the UI simply omits the row.
 */
async function getAccessToken(): Promise<string | null> {
  const id = process.env.SPOTIFY_CLIENT_ID;
  const secret = process.env.SPOTIFY_CLIENT_SECRET;
  const refresh = process.env.SPOTIFY_REFRESH_TOKEN;

  if (!id || !secret || !refresh) return null;

  try {
    const res = await fetch(TOKEN_URL, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refresh,
      }),
      cache: "no-store",
    });

    if (!res.ok) return null;
    const json = await res.json();
    return json.access_token ?? null;
  } catch {
    return null;
  }
}

type SpotifyItem = {
  name: string;
  external_urls: { spotify: string };
  album: { name: string; images: { url: string }[] };
  artists: { name: string }[];
};

function toTrack(item: SpotifyItem, playing: boolean): Track {
  return {
    title: item.name,
    artist: item.artists.map((a) => a.name).join(", "),
    album: item.album.name,
    url: item.external_urls.spotify,
    art: item.album.images.at(-1)?.url ?? null,
    playing,
  };
}

/** What's playing now, or the last thing that played. */
export async function getNowPlaying(): Promise<Track | null> {
  const token = await getAccessToken();
  if (!token) return null;

  const headers = { Authorization: `Bearer ${token}` };

  try {
    const now = await fetch(NOW_PLAYING, { headers, cache: "no-store" });

    // 204 = nothing playing right now; fall through to recently-played.
    if (now.status === 200) {
      const json = await now.json();
      if (json?.item) return toTrack(json.item, Boolean(json.is_playing));
    }

    const recent = await fetch(RECENT, { headers, cache: "no-store" });
    if (!recent.ok) return null;

    const json = await recent.json();
    const item = json?.items?.[0]?.track;
    return item ? toTrack(item, false) : null;
  } catch {
    return null;
  }
}
