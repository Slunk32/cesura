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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const artist = typeof req.query.artist === 'string' ? req.query.artist.trim() : '';
  const limit = typeof req.query.limit === 'string' ? Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 30)) : 30;

  if (!artist) {
    res.status(400).json({ error: 'artist query param is required' });
    return;
  }

  const apiKey = process.env.LASTFM_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'LASTFM_API_KEY not configured on server' });
    return;
  }

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
      res.status(502).json({ error: data.message ?? 'Last.fm error', code: data.error });
      return;
    }

    const artists = (data.similarartists?.artist ?? []).map((a) => ({
      name: a.name,
      mbid: a.mbid ?? null,
      match: a.match ? Number(a.match) : null,
      url: a.url ?? null,
      image: a.image?.find((i) => i.size === 'large')?.['#text'] || null,
    }));

    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=604800');
    res.status(200).json({ artists });
  } catch (e) {
    res.status(502).json({ error: e instanceof Error ? e.message : 'Last.fm fetch failed' });
  }
}
