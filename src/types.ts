export type SpotifyImage = { url: string; width?: number; height?: number };

export type SpotifyArtist = {
  id: string;
  name: string;
  uri: string;
  images?: SpotifyImage[];
  genres?: string[];
};

export type SpotifyTrack = {
  id: string;
  name: string;
  uri: string;
  duration_ms: number;
  preview_url: string | null;
  artists: { id: string; name: string }[];
  album: { id: string; name: string; images: SpotifyImage[] };
};

export type SpotifyUser = {
  id: string;
  display_name: string | null;
  email?: string;
  images?: SpotifyImage[];
};

export type SpotifyPlaylist = {
  id: string;
  name: string;
  description: string | null;
  uri: string;
  images: SpotifyImage[];
  owner: { id: string; display_name?: string };
  tracks: { total: number; items?: { track: SpotifyTrack | null }[] };
};

export type SimilarArtist = {
  name: string;
  mbid: string | null;
  match: number | null;
  url: string | null;
  image: string | null;
};

export type RecentlyPlayedItem = {
  track: SpotifyTrack;
  played_at: string;
};
