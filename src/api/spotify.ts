import { getAccessToken } from '../auth/spotify';
import type {
  SpotifyArtist,
  SpotifyTrack,
  SpotifyUser,
  SpotifyPlaylist,
  RecentlyPlayedItem,
} from '../types';

const BASE = 'https://api.spotify.com/v1';

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  const token = await getAccessToken();
  const resp = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });
  if (resp.status === 204) return undefined as T;
  const text = await resp.text();
  let json: any = undefined;
  if (text) {
    try { json = JSON.parse(text); } catch { /* non-JSON body; fall through */ }
  }
  if (!resp.ok) {
    const msg = json?.error?.message ?? text.slice(0, 200) ?? resp.statusText;
    throw new Error(`Spotify ${resp.status}: ${msg}`);
  }
  if (text && json === undefined) {
    throw new Error(`Spotify ${resp.status}: non-JSON response (got "${text.slice(0, 80)}…"). A browser extension or network may be intercepting api.spotify.com.`);
  }
  return json as T;
}

export const spotify = {
  getMe: () => call<SpotifyUser>('/me'),

  searchArtists: async (query: string, limit = 5): Promise<SpotifyArtist[]> => {
    if (!query.trim()) return [];
    const r = await call<{ artists: { items: SpotifyArtist[] } }>(
      `/search?q=${encodeURIComponent(query)}&type=artist&limit=${limit}`
    );
    return r.artists.items;
  },

  findArtistByName: async (name: string): Promise<SpotifyArtist | null> => {
    const items = await spotify.searchArtists(`"${name}"`, 5);
    if (items.length === 0) return null;
    const exact = items.find((a) => a.name.toLowerCase() === name.toLowerCase());
    return exact ?? items[0];
  },

  getArtistTopTracks: async (artistId: string, market = 'US'): Promise<SpotifyTrack[]> => {
    const r = await call<{ tracks: SpotifyTrack[] }>(
      `/artists/${artistId}/top-tracks?market=${market}`
    );
    return r.tracks;
  },

  getRecentlyPlayed: async (limit = 25): Promise<RecentlyPlayedItem[]> => {
    const r = await call<{ items: RecentlyPlayedItem[] }>(
      `/me/player/recently-played?limit=${limit}`
    );
    return r.items;
  },

  getUserPlaylists: async (): Promise<SpotifyPlaylist[]> => {
    const r = await call<{ items: SpotifyPlaylist[] }>('/me/playlists?limit=50');
    return r.items;
  },

  getPlaylist: (playlistId: string) =>
    call<SpotifyPlaylist>(`/playlists/${playlistId}`),

  getPlaylistTracks: async (playlistId: string): Promise<SpotifyTrack[]> => {
    const all: SpotifyTrack[] = [];
    let offset = 0;
    const limit = 100;
    while (true) {
      const r = await call<{ items: { track: SpotifyTrack | null }[]; next: string | null }>(
        `/playlists/${playlistId}/tracks?limit=${limit}&offset=${offset}`
      );
      for (const item of r.items) {
        if (item.track) all.push(item.track);
      }
      if (!r.next) break;
      offset += limit;
    }
    return all;
  },

  createPlaylist: (userId: string, name: string, description = '') =>
    call<SpotifyPlaylist>(`/users/${userId}/playlists`, {
      method: 'POST',
      body: JSON.stringify({ name, description, public: false }),
    }),

  changePlaylistDetails: (playlistId: string, name: string) =>
    call<void>(`/playlists/${playlistId}`, {
      method: 'PUT',
      body: JSON.stringify({ name }),
    }),

  addTracksToPlaylist: (playlistId: string, trackUris: string[]) =>
    call<{ snapshot_id: string }>(`/playlists/${playlistId}/tracks`, {
      method: 'POST',
      body: JSON.stringify({ uris: trackUris }),
    }),

  removeTracksFromPlaylist: (playlistId: string, trackUris: string[]) =>
    call<{ snapshot_id: string }>(`/playlists/${playlistId}/tracks`, {
      method: 'DELETE',
      body: JSON.stringify({ tracks: trackUris.map((uri) => ({ uri })) }),
    }),
};
