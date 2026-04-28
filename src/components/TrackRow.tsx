import type { SpotifyTrack } from '../types';
import { InlineSpotifyPlayer } from './InlineSpotifyPlayer';

export function TrackRow({
  track,
  liked,
  playing,
  onLike,
  onDislike,
  onPlay,
}: {
  track: SpotifyTrack;
  liked: boolean;
  playing: boolean;
  onLike: () => void;
  onDislike: () => void;
  onPlay: () => void;
}) {
  const cover = track.album.images.at(-1)?.url;
  return (
    <li className={`track-row ${playing ? 'playing' : ''}`}>
      <div className="track-row-head">
        <button
          type="button"
          className="track-main"
          onClick={onPlay}
          aria-pressed={playing}
          aria-label={playing ? `Pause ${track.name}` : `Play ${track.name}`}
        >
          <span className="track-art">
            {cover ? <img src={cover} alt="" /> : <span className="placeholder" />}
            <span className="play-icon" aria-hidden>{playing ? '❚❚' : '▶'}</span>
          </span>
          <span className="track-meta">
            <span className="track-name">{track.name}</span>
            <span className="track-album">{track.album.name}</span>
          </span>
        </button>
        <button
          type="button"
          className={`like-btn ${liked ? 'liked' : ''}`}
          onClick={liked ? onDislike : onLike}
          aria-label={liked ? 'Remove from playlist' : 'Add to playlist'}
        >
          {liked ? '♥' : '♡'}
        </button>
      </div>
      <div className={`track-row-player ${playing ? 'open' : ''}`} aria-hidden={!playing}>
        {playing && <InlineSpotifyPlayer trackUri={track.uri} />}
      </div>
    </li>
  );
}
