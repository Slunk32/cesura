import type { SpotifyTrack } from '../types';

export function Player({ track }: { track: SpotifyTrack | null }) {
  if (!track) return null;
  const trackId = track.uri.split(':').pop();
  return (
    <div className="player">
      <div className="player-now">
        <span className="muted">now playing:</span> <strong>{track.name}</strong>
        <span className="muted"> · {track.artists.map((a) => a.name).join(', ')}</span>
      </div>
      <iframe
        title={`Spotify preview: ${track.name}`}
        src={`https://open.spotify.com/embed/track/${trackId}?utm_source=generator`}
        width="100%"
        height="80"
        frameBorder={0}
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
        loading="lazy"
      />
    </div>
  );
}
