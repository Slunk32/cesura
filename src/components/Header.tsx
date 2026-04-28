import type { SpotifyUser } from '../types';

export function Header({ user, onLogout }: { user: SpotifyUser | null; onLogout: () => void }) {
  return (
    <header className="header">
      <div className="header-brand">
        <span className="brand-mark" aria-hidden>♫</span>
        <span className="brand-name">Cesura</span>
        <span className="brand-tag">music discovery</span>
      </div>
      {user && (
        <div className="header-user">
          {user.images?.[0]?.url && (
            <img src={user.images[0].url} alt="" className="avatar" />
          )}
          <span>{user.display_name ?? user.id}</span>
          <button className="ghost-btn" onClick={onLogout}>Log out</button>
        </div>
      )}
    </header>
  );
}
