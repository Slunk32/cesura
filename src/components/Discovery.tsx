import { useCallback, useEffect, useRef, useState } from 'react';
import { SearchBar } from './SearchBar';
import { SimilarArtistsList } from './SimilarArtistsList';
import { ArtistView } from './ArtistView';
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
  // Scoped so a track that's both in the artist list and the playlist column
  // doesn't try to play in two iframes at once.
  const [playing, setPlaying] = useState<{ trackId: string; scope: 'artist' | 'playlist' } | null>(null);

  const [likedTracks, setLikedTracks] = useState<SpotifyTrack[]>([]);
  const [playlist, setPlaylist] = useState<SpotifyPlaylist | null>(null);
  const [status, setStatus] = useState<SyncStatus>('idle');

  const [recentOpen, setRecentOpen] = useState(false);

  // Spotify artist records keyed by lowercased Last.fm name. Pre-warmed for
  // the similar list so we have artist images and skip a roundtrip on click.
  const [enrichments, setEnrichments] = useState<Record<string, SpotifyArtist | null>>({});

  // Mirrors `playlist` so add/remove handlers always use the latest selected
  // playlist id even if a stale closure ever fires.
  const playlistRef = useRef<SpotifyPlaylist | null>(null);
  useEffect(() => { playlistRef.current = playlist; }, [playlist]);

  // When a playlist is loaded, fetch all of its tracks (paginated) so we show
  // existing contents from prior sessions, not just the first 100.
  const tracksFetchToken = useRef(0);
  useEffect(() => {
    if (!playlist) {
      setLikedTracks([]);
      return;
    }
    // Prime with whatever the playlist response already gave us so the user
    // sees something immediately, then overwrite once the full fetch returns.
    const seed = (playlist.tracks.items ?? [])
      .map((i) => i.track)
      .filter((t): t is SpotifyTrack => Boolean(t));
    setLikedTracks(seed);

    const myToken = ++tracksFetchToken.current;
    spotify.getPlaylistTracks(playlist.id)
      .then((tracks) => {
        if (tracksFetchToken.current === myToken) setLikedTracks(tracks);
      })
      .catch(() => { /* keep the seed; next add/remove will sync */ });
  }, [playlist?.id]);

  const loadSimilar = useCallback(async (name: string) => {
    setSimilarLoading(true);
    setSimilarError(null);
    setSimilar([]);
    setEnrichments({});
    try {
      const arts = await getSimilarArtists(name, 30);
      setSimilar(arts);
      arts.forEach((a) => {
        spotify.findArtistByName(a.name)
          .then((sp) => setEnrichments((prev) => ({ ...prev, [a.name.toLowerCase()]: sp })))
          .catch(() => setEnrichments((prev) => ({ ...prev, [a.name.toLowerCase()]: null })));
      });
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
    const cached = enrichments[name.toLowerCase()];
    if (cached) {
      setSelectedArtist(cached);
      return;
    }
    const found = await spotify.findArtistByName(name);
    if (found) setSelectedArtist(found);
  }, [enrichments]);

  const onLike = async (track: SpotifyTrack) => {
    if (likedTracks.find((t) => t.id === track.id)) return;
    setLikedTracks((prev) => [...prev, track]);
    const current = playlistRef.current;
    if (current) {
      setStatus('syncing');
      try {
        await spotify.addTracksToPlaylist(current.id, [track.uri]);
        setStatus('saved');
      } catch {
        setStatus('errored');
      }
    }
  };

  const onDislike = async (track: SpotifyTrack) => {
    setLikedTracks((prev) => prev.filter((t) => t.id !== track.id));
    const current = playlistRef.current;
    if (current) {
      setStatus('syncing');
      try {
        await spotify.removeTracksFromPlaylist(current.id, [track.uri]);
        setStatus('saved');
      } catch {
        setStatus('errored');
      }
    }
  };

  const togglePlay = (track: SpotifyTrack, scope: 'artist' | 'playlist') => {
    setPlaying((prev) =>
      prev?.trackId === track.id && prev?.scope === scope ? null : { trackId: track.id, scope }
    );
  };

  const likedIds = new Set(likedTracks.map((t) => t.id));

  return (
    <div className="discovery">
      <div className="col col-explore">
        <SearchBar onPick={seedFromArtist} onOpenRecent={() => setRecentOpen(true)} />
        <SimilarArtistsList
          seed={seedArtist?.name ?? null}
          artists={similar}
          enrichments={enrichments}
          loading={similarLoading}
          error={similarError}
          onPick={pickSimilar}
          selectedName={selectedArtist?.name ?? null}
        />
      </div>
      <div className="col col-artist">
        {selectedArtist ? (
          <ArtistView
            artist={selectedArtist}
            likedTrackIds={likedIds}
            onLike={onLike}
            onDislike={onDislike}
            onPlay={(t) => togglePlay(t, 'artist')}
            playingTrackId={playing?.scope === 'artist' ? playing.trackId : null}
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
          onRemove={onDislike}
          onPlay={(t) => togglePlay(t, 'playlist')}
          playingTrackId={playing?.scope === 'playlist' ? playing.trackId : null}
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
