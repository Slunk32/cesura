import type { SimilarArtist } from '../types';

export function SimilarArtistsList({
  seed,
  artists,
  loading,
  error,
  onPick,
  selectedName,
}: {
  seed: string | null;
  artists: SimilarArtist[];
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
        {artists.map((a) => (
          <li
            key={`${a.name}-${a.mbid ?? ''}`}
            className={`similar-item ${selectedName === a.name ? 'selected' : ''}`}
            onClick={() => onPick(a.name)}
          >
            {a.image ? (
              <img src={a.image} alt="" className="similar-thumb" />
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
        ))}
      </ul>
    </div>
  );
}
