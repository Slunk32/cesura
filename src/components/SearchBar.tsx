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

  useEffect(() => {
    window.clearTimeout(debounce.current);
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

  const pick = (a: SpotifyArtist) => {
    setQ(a.name);
    setOpen(false);
    onPick(a);
  };

  return (
    <div className="search-bar">
      <div className="search-row">
        <input
          className="search-input"
          placeholder="Seed an artist…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => results.length && setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && results[0]) pick(results[0]);
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
