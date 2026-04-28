import type { VercelRequest, VercelResponse } from '@vercel/node';

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

// Last.fm started serving the same default "star" placeholder for every
// artist around 2019 (licensing fallout). Detect and discard it; the
// frontend enriches with Spotify artist images instead.
const LASTFM_PLACEHOLDER_HASH = '2a96cbd8b46e442fc41c2b86b821562f';

function shapeArtists(artists: LastfmArtist[]) {
  return artists.map((a) => {
    const raw = a.image?.find((i) => i.size === 'large')?.['#text'] || null;
    const image = raw && !raw.includes(LASTFM_PLACEHOLDER_HASH) ? raw : null;
    return {
      name: a.name,
      mbid: a.mbid ?? null,
      match: a.match ? Number(a.match) : null,
      url: a.url ?? null,
      image,
    };
  });
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const artist = typeof req.query.artist === 'string' ? req.query.artist.trim() : '';
  const limit = parseLimit(req.query.limit);

  const result = await getSimilar(artist, limit, process.env.LASTFM_API_KEY);

  if (result.ok) res.setHeader('Cache-Control', result.cache);
  res.status(result.status).json(result.body);
}
