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
  const json = text ? JSON.parse(text) : undefined;
  if (!resp.ok) {
    const msg = json?.error?.message ?? resp.statusText;
    throw new Error(`Spotify ${resp.status}: ${msg}`);
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
