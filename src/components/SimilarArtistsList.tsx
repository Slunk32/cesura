import type { SimilarArtist, SpotifyArtist } from '../types';

export function SimilarArtistsList({
  seed,
  artists,
  enrichments,
  loading,
  error,
  onPick,
  selectedName,
}: {
  seed: string | null;
  artists: SimilarArtist[];
  enrichments: Record<string, SpotifyArtist | null>;
  loading: boolean;
  error: string | null;
  onPick: (name: string) => void;
  selectedName: string | null;
}) {
  if (!seed) {
    return (
      <div className="empty">
        <p>Seed an artist to start exploring.</p>
      </div>
    );
  }

  return (
    <div className="similar">
      <div className="similar-header">
        <span className="muted">similar to</span>
        <span className="similar-seed">{seed}</span>
      </div>
      {loading && <div className="muted">Looking…</div>}
      {error && <div className="banner banner-error">{error}</div>}
      <ul className="similar-list">
        {artists.map((a) => {
          const sp = enrichments[a.name.toLowerCase()];
          const image = sp?.images?.[1]?.url ?? sp?.images?.[0]?.url ?? a.image;
          return (
            <li
              key={`${a.name}-${a.mbid ?? ''}`}
              className={`similar-item ${selectedName === a.name ? 'selected' : ''}`}
              onClick={() => onPick(a.name)}
            >
              {image ? (
                <img src={image} alt="" className="similar-thumb" />
              ) : (
                <div className="similar-thumb placeholder" />
              )}
              <div className="similar-meta">
                <div className="similar-name">{a.name}</div>
                {a.match !== null && (
                  <div className="similar-match">
                    <div className="match-bar"><div className="match-fill" style={{ width: `${Math.min(100, a.match * 100)}%` }} /></div>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
