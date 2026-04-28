import type { SpotifyTrack } from '../types';

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
      <button className="track-play" onClick={onPlay} title="Preview">
        {cover ? <img src={cover} alt="" /> : <div className="placeholder" />}
        <span className="play-icon" aria-hidden>{playing ? '❚❚' : '▶'}</span>
      </button>
      <div className="track-meta">
        <div className="track-name">{track.name}</div>
        <div className="track-album">{track.album.name}</div>
      </div>
      <button
        className={`like-btn ${liked ? 'liked' : ''}`}
        onClick={liked ? onDislike : onLike}
        title={liked ? 'Remove from playlist' : 'Add to playlist'}
        aria-label={liked ? 'Remove from playlist' : 'Add to playlist'}
      >
        {liked ? '♥' : '♡'}
      </button>
    </li>
  );
}
