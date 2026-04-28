import { useEffect, useState } from 'react';
import { spotify } from '../api/spotify';
import type { SpotifyArtist, SpotifyTrack } from '../types';
import { TrackRow } from './TrackRow';

export function ArtistView({
  artist,
  likedTrackIds,
  onLike,
  onDislike,
  onPlay,
  playingTrackId,
}: {
  artist: SpotifyArtist;
  likedTrackIds: Set<string>;
  onLike: (track: SpotifyTrack) => void;
  onDislike: (track: SpotifyTrack) => void;
  onPlay: (track: SpotifyTrack) => void;
  playingTrackId: string | null;
}) {
  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    spotify.getArtistTopTracks(artist.id)
      .then((t) => { if (!cancelled) setTracks(t); })
      .catch((e) => { if (!cancelled) setError(e instanceof Error ? e.message : String(e)); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [artist.id]);

  return (
    <div className="artist-view">
      <div className="artist-header">
        {artist.images?.[1]?.url && <img src={artist.images[1].url} alt="" className="artist-image" />}
        <div>
          <h2 className="artist-name">{artist.name}</h2>
          {artist.genres && artist.genres.length > 0 && (
            <div className="artist-genres">{artist.genres.slice(0, 4).join(' · ')}</div>
          )}
        </div>
      </div>
      {loading && <div className="muted">Loading top tracks…</div>}
      {error && <div className="banner banner-error">{error}</div>}
      <ul className="track-list">
        {tracks.map((track) => (
          <TrackRow
            key={track.id}
            track={track}
            liked={likedTrackIds.has(track.id)}
            playing={playingTrackId === track.id}
            onLike={() => onLike(track)}
            onDislike={() => onDislike(track)}
            onPlay={() => onPlay(track)}
          />
        ))}
      </ul>
    </div>
  );
}
