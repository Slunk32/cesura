import { useCallback, useEffect, useState } from 'react';
import { SearchBar } from './SearchBar';
import { SimilarArtistsList } from './SimilarArtistsList';
import { ArtistView } from './ArtistView';
import { Player } from './Player';
import { PlaylistView } from './PlaylistView';
import { RecentlyPlayedPanel } from './RecentlyPlayedPanel';
import { spotify } from '../api/spotify';
import { getSimilarArtists } from '../api/lastfm';
import type {
  SimilarArtist,
  SpotifyArtist,
  SpotifyPlaylist,
  SpotifyTrack,
  SpotifyUser,
} from '../types';

type SyncStatus = 'idle' | 'syncing' | 'saved' | 'errored';

export function Discovery({ user }: { user: SpotifyUser }) {
  const [seedArtist, setSeedArtist] = useState<SpotifyArtist | null>(null);
  const [similar, setSimilar] = useState<SimilarArtist[]>([]);
  const [similarLoading, setSimilarLoading] = useState(false);
  const [similarError, setSimilarError] = useState<string | null>(null);

  const [selectedArtist, setSelectedArtist] = useState<SpotifyArtist | null>(null);
  const [playingTrack, setPlayingTrack] = useState<SpotifyTrack | null>(null);

  const [likedTracks, setLikedTracks] = useState<SpotifyTrack[]>([]);
  const [playlist, setPlaylist] = useState<SpotifyPlaylist | null>(null);
  const [status, setStatus] = useState<SyncStatus>('idle');

  const [recentOpen, setRecentOpen] = useState(false);

  // When a playlist is loaded, prime liked tracks from its current contents.
  useEffect(() => {
    if (!playlist) {
      setLikedTracks([]);
      return;
    }
    const tracks = (playlist.tracks.items ?? [])
      .map((i) => i.track)
      .filter((t): t is SpotifyTrack => Boolean(t));
    setLikedTracks(tracks);
  }, [playlist?.id]);

  const loadSimilar = useCallback(async (name: string) => {
    setSimilarLoading(true);
    setSimilarError(null);
    setSimilar([]);
    try {
      const arts = await getSimilarArtists(name, 30);
      setSimilar(arts);
    } catch (e) {
      setSimilarError(e instanceof Error ? e.message : String(e));
    } finally {
      setSimilarLoading(false);
    }
  }, []);

  const seedFromArtist = useCallback(async (artist: SpotifyArtist) => {
    setSeedArtist(artist);
    setSelectedArtist(artist);
    loadSimilar(artist.name);
  }, [loadSimilar]);

  const seedFromName = useCallback(async (name: string) => {
    const found = await spotify.findArtistByName(name);
    if (found) seedFromArtist(found);
    else setSimilarError(`No Spotify artist matched "${name}"`);
  }, [seedFromArtist]);

  const pickSimilar = useCallback(async (name: string) => {
    const found = await spotify.findArtistByName(name);
    if (found) setSelectedArtist(found);
  }, []);

  const onLike = async (track: SpotifyTrack) => {
    if (likedTracks.find((t) => t.id === track.id)) return;
    setLikedTracks((prev) => [...prev, track]);
    if (playlist) {
      setStatus('syncing');
      try {
        await spotify.addTracksToPlaylist(playlist.id, [track.uri]);
        setStatus('saved');
      } catch {
        setStatus('errored');
      }
    }
  };

  const onDislike = async (track: SpotifyTrack) => {
    setLikedTracks((prev) => prev.filter((t) => t.id !== track.id));
    if (playlist) {
      setStatus('syncing');
      try {
        await spotify.removeTracksFromPlaylist(playlist.id, [track.uri]);
        setStatus('saved');
      } catch {
        setStatus('errored');
      }
    }
  };

  const onPlay = (track: SpotifyTrack) => {
    setPlayingTrack(playingTrack?.id === track.id ? null : track);
  };

  const likedIds = new Set(likedTracks.map((t) => t.id));

  return (
    <div className="discovery">
      <div className="col col-explore">
        <SearchBar onPick={seedFromArtist} onOpenRecent={() => setRecentOpen(true)} />
        <SimilarArtistsList
          seed={seedArtist?.name ?? null}
          artists={similar}
          loading={similarLoading}
          error={similarError}
          onPick={pickSimilar}
          selectedName={selectedArtist?.name ?? null}
        />
        <Player track={playingTrack} />
      </div>
      <div className="col col-artist">
        {selectedArtist ? (
          <ArtistView
            artist={selectedArtist}
            likedTrackIds={likedIds}
            onLike={onLike}
            onDislike={onDislike}
            onPlay={onPlay}
            playingTrackId={playingTrack?.id ?? null}
          />
        ) : (
          <div className="empty">
            <p>Pick an artist on the left to see their top tracks.</p>
          </div>
        )}
      </div>
      <div className="col col-playlist">
        <PlaylistView
          user={user}
          playlist={playlist}
          setPlaylist={setPlaylist}
          likedTracks={likedTracks}
          status={status}
        />
      </div>
      {recentOpen && (
        <RecentlyPlayedPanel
          onClose={() => setRecentOpen(false)}
          onPick={(name) => {
            setRecentOpen(false);
            seedFromName(name);
          }}
        />
      )}
    </div>
  );
}
