import { useEffect, useRef, useState } from 'react';
import { spotify } from '../api/spotify';
import type { SpotifyArtist } from '../types';

export function SearchBar({
  onPick,
  onOpenRecent,
}: {
  onPick: (artist: SpotifyArtist) => void;
  onOpenRecent: () => void;
}) {
  const [q, setQ] = useState('');
  const [results, setResults] = useState<SpotifyArtist[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounce = useRef<number | undefined>(undefined);
  const blurTimer = useRef<number | undefined>(undefined);
  // Set to true right before we programmatically update `q` from a pick,
  // so the debounced search effect that fires on the next render is a no-op.
  const skipNextSearch = useRef(false);

  useEffect(() => {
    window.clearTimeout(debounce.current);
    if (skipNextSearch.current) {
      skipNextSearch.current = false;
      return;
    }
    if (!q.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }
    debounce.current = window.setTimeout(async () => {
      setLoading(true);
      try {
        const items = await spotify.searchArtists(q, 6);
        setResults(items);
        setOpen(true);
      } finally {
        setLoading(false);
      }
    }, 200);
    return () => window.clearTimeout(debounce.current);
  }, [q]);

  useEffect(() => () => {
    window.clearTimeout(debounce.current);
    window.clearTimeout(blurTimer.current);
  }, []);

  const pick = (a: SpotifyArtist) => {
    skipNextSearch.current = true;
    setQ(a.name);
    setResults([]);
    setOpen(false);
    onPick(a);
  };

  const onFocus = () => {
    window.clearTimeout(blurTimer.current);
    if (results.length) setOpen(true);
  };

  const onBlur = () => {
    // Delay so an item click (onMouseDown) lands before we close.
    blurTimer.current = window.setTimeout(() => setOpen(false), 150);
  };

  return (
    <div className="search-bar">
      <div className="search-row">
        <input
          className="search-input"
          placeholder="Seed an artist…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && results[0]) pick(results[0]);
            if (e.key === 'Escape') setOpen(false);
          }}
        />
        <button className="ghost-btn" onClick={onOpenRecent} title="Seed from recently played">
          ↻ recent
        </button>
      </div>
      {open && (
        <ul className="search-results">
          {loading && <li className="search-result muted">Searching…</li>}
          {!loading && results.length === 0 && <li className="search-result muted">No matches</li>}
          {results.map((a) => (
            <li key={a.id} className="search-result" onMouseDown={() => pick(a)}>
              {a.images?.[2]?.url && <img src={a.images[2].url} alt="" className="thumb" />}
              <span>{a.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
