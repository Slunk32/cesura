import { useEffect, useState } from 'react';
import { spotify } from '../api/spotify';
import type { RecentlyPlayedItem } from '../types';

export function RecentlyPlayedPanel({
  onPick,
  onClose,
}: {
  onPick: (artistName: string) => void;
  onClose: () => void;
}) {
  const [items, setItems] = useState<RecentlyPlayedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    spotify.getRecentlyPlayed(30)
      .then((r) => { if (!cancelled) setItems(r); })
      .catch((e) => { if (!cancelled) setError(e instanceof Error ? e.message : String(e)); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  // Keep one row per (artist + track) and surface the most recent listen.
  const seen = new Set<string>();
  const dedup = items.filter((i) => {
    const key = `${i.track.artists[0]?.id}|${i.track.id}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3>Seed from recently played</h3>
          <button className="ghost-btn" onClick={onClose}>close</button>
        </div>
        <p className="muted small">
          Pick a track and we'll seed discovery with that artist.
        </p>
        {loading && <div className="muted">Loading…</div>}
        {error && <div className="banner banner-error">{error}</div>}
        <ul className="recent-list">
          {dedup.map((i, idx) => {
            const cover = i.track.album.images.at(-1)?.url;
            const primary = i.track.artists[0]?.name ?? 'Unknown';
            return (
              <li
                key={`${i.track.id}-${idx}`}
                className="recent-item"
                onClick={() => onPick(primary)}
              >
                {cover ? <img src={cover} alt="" className="recent-thumb" /> : <div className="recent-thumb placeholder" />}
                <div className="recent-meta">
                  <div className="recent-track">{i.track.name}</div>
                  <div className="muted small">{primary}</div>
                </div>
                <span className="muted small">{relativeTime(i.played_at)}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function relativeTime(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const m = Math.round(ms / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  return `${d}d ago`;
}
