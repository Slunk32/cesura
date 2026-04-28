type LastfmArtist = {
  name: string;
  mbid?: string;
  match?: string;
  url?: string;
  image?: { '#text': string; size: string }[];
};

type LastfmSimilarResponse = {
  similarartists?: { artist: LastfmArtist[] };
  error?: number;
  message?: string;
};

export type SimilarResult =
  | { ok: true; status: 200; cache: string; body: { artists: ReturnType<typeof shapeArtists> } }
  | { ok: false; status: number; body: { error: string; code?: number } };

function shapeArtists(artists: LastfmArtist[]) {
  return artists.map((a) => ({
    name: a.name,
    mbid: a.mbid ?? null,
    match: a.match ? Number(a.match) : null,
    url: a.url ?? null,
    image: a.image?.find((i) => i.size === 'large')?.['#text'] || null,
  }));
}

export async function getSimilar(
  artist: string,
  limit: number,
  apiKey: string | undefined
): Promise<SimilarResult> {
  if (!artist) return { ok: false, status: 400, body: { error: 'artist query param is required' } };
  if (!apiKey) return { ok: false, status: 500, body: { error: 'LASTFM_API_KEY not configured on server' } };

  const url = new URL('https://ws.audioscrobbler.com/2.0/');
  url.searchParams.set('method', 'artist.getsimilar');
  url.searchParams.set('artist', artist);
  url.searchParams.set('autocorrect', '1');
  url.searchParams.set('limit', String(limit));
  url.searchParams.set('api_key', apiKey);
  url.searchParams.set('format', 'json');

  try {
    const upstream = await fetch(url, { headers: { 'User-Agent': 'cesura/1.0' } });
    const data = (await upstream.json()) as LastfmSimilarResponse;

    if (data.error) {
      return { ok: false, status: 502, body: { error: data.message ?? 'Last.fm error', code: data.error } };
    }

    return {
      ok: true,
      status: 200,
      cache: 's-maxage=86400, stale-while-revalidate=604800',
      body: { artists: shapeArtists(data.similarartists?.artist ?? []) },
    };
  } catch (e) {
    return { ok: false, status: 502, body: { error: e instanceof Error ? e.message : 'Last.fm fetch failed' } };
  }
}

export function parseLimit(raw: unknown): number {
  if (typeof raw !== 'string') return 30;
  return Math.min(50, Math.max(1, parseInt(raw, 10) || 30));
}
