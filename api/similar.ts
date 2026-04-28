import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSimilar, parseLimit } from './_lib/similar';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const artist = typeof req.query.artist === 'string' ? req.query.artist.trim() : '';
  const limit = parseLimit(req.query.limit);

  const result = await getSimilar(artist, limit, process.env.LASTFM_API_KEY);

  if (result.ok) res.setHeader('Cache-Control', result.cache);
  res.status(result.status).json(result.body);
}
