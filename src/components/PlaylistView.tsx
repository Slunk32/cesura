import { useEffect, useState } from 'react';
import { spotify } from '../api/spotify';
import type { SpotifyPlaylist, SpotifyTrack, SpotifyUser } from '../types';
import { TrackRow } from './TrackRow';

type Status = 'idle' | 'syncing' | 'saved' | 'errored';

export function PlaylistView({
  user,
  playlist,
  setPlaylist,
  likedTracks,
  status,
  onRemove,
  onPlay,
  playingTrackId,
}: {
  user: SpotifyUser;
  playlist: SpotifyPlaylist | null;
  setPlaylist: (p: SpotifyPlaylist | null) => void;
  likedTracks: SpotifyTrack[];
  status: Status;
  onRemove: (track: SpotifyTrack) => void;
  onPlay: (track: SpotifyTrack) => void;
  playingTrackId: string | null;
}) {
  const [userPlaylists, setUserPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const [name, setName] = useState('');
  const [editingName, setEditingName] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoadingList(true);
    spotify.getUserPlaylists()
      .then((items) => { if (!cancelled) setUserPlaylists(items.filter((p) => p.owner.id === user.id)); })
      .finally(() => { if (!cancelled) setLoadingList(false); });
    return () => { cancelled = true; };
  }, [user.id, playlist?.id]);

  useEffect(() => {
    if (playlist) setName(playlist.name);
  }, [playlist?.id, playlist?.name]);

  const createPlaylist = async () => {
    const stamp = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    const newName = `Cesura · ${stamp}`;
    const created = await spotify.createPlaylist(user.id, newName, 'Created with Cesura');
    if (likedTracks.length > 0) {
      await spotify.addTracksToPlaylist(created.id, likedTracks.map((t) => t.uri));
    }
    const refreshed = await spotify.getPlaylist(created.id);
    setPlaylist(refreshed);
  };

  const openExisting = async (id: string) => {
    const p = await spotify.getPlaylist(id);
    setPlaylist(p);
  };

  const saveName = async () => {
    if (!playlist || !name.trim() || name === playlist.name) {
      setEditingName(false);
      return;
    }
    await spotify.changePlaylistDetails(playlist.id, name.trim());
    setPlaylist({ ...playlist, name: name.trim() });
    setEditingName(false);
  };

  return (
    <div className="playlist-view">
      <h3 className="column-title">Playlist</h3>
      {!playlist && (
        <div className="playlist-picker">
          <button className="primary-btn" onClick={createPlaylist}>
            New playlist {likedTracks.length > 0 ? `with ${likedTracks.length} track${likedTracks.length === 1 ? '' : 's'}` : ''}
          </button>
          <div className="playlist-or">— or open an existing one —</div>
          {loadingList && <div className="muted">Loading…</div>}
          <ul className="playlist-list">
            {userPlaylists.map((p) => (
              <li key={p.id} className="playlist-list-item" onClick={() => openExisting(p.id)}>
                {p.images?.[0]?.url ? (
                  <img src={p.images[0].url} alt="" className="playlist-thumb" />
                ) : (
                  <div className="playlist-thumb placeholder" />
                )}
                <div>
                  <div className="playlist-list-name">{p.name}</div>
                  <div className="muted small">{p.tracks.total} tracks</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      {playlist && (
        <div className="playlist-active">
          <div className="playlist-active-head">
            {editingName ? (
              <input
                className="playlist-name-input"
                value={name}
                autoFocus
                onChange={(e) => setName(e.target.value)}
                onBlur={saveName}
                onKeyDown={(e) => { if (e.key === 'Enter') saveName(); }}
              />
            ) : (
              <h4 className="playlist-name" onClick={() => setEditingName(true)} title="Rename">
                {playlist.name}
              </h4>
            )}
            <span className={`status status-${status}`}>{
              status === 'syncing' ? 'syncing…'
              : status === 'saved' ? 'saved'
              : status === 'errored' ? 'sync failed'
              : ''
            }</span>
          </div>
          <ul className="playlist-tracks">
            {likedTracks.map((t) => (
              <TrackRow
                key={t.id}
                track={t}
                liked
                playing={playingTrackId === t.id}
                onLike={() => { /* unreachable: liked is always true here */ }}
                onDislike={() => onRemove(t)}
                onPlay={() => onPlay(t)}
              />
            ))}
            {likedTracks.length === 0 && (
              <li className="muted">Like tracks in the middle column to add them here.</li>
            )}
          </ul>
          <button className="ghost-btn" onClick={() => setPlaylist(null)}>← change playlist</button>
        </div>
      )}
    </div>
  );
}
