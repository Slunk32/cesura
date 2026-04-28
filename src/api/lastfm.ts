import type { SimilarArtist } from '../types';

export async function getSimilarArtists(artist: string, limit = 30): Promise<SimilarArtist[]> {
  const r = await fetch(`/api/similar?artist=${encodeURIComponent(artist)}&limit=${limit}`);
  if (!r.ok) {
    const body = await r.json().catch(() => ({}));
    throw new Error(body?.error ?? `similar request failed (${r.status})`);
  }
  const json = (await r.json()) as { artists: SimilarArtist[] };
  return json.artists;
}
