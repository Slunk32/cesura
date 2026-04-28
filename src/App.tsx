import { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { Discovery } from './components/Discovery';
import { Login } from './components/Login';
import { handleCallback, getStoredAuth, type Auth } from './auth/spotify';
import { spotify } from './api/spotify';
import type { SpotifyUser } from './types';

export function App() {
  const [auth, setAuth] = useState<Auth | null>(null);
  const [user, setUser] = useState<SpotifyUser | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (window.location.pathname === '/callback') {
          const a = await handleCallback();
          window.history.replaceState({}, '', '/');
          if (!cancelled) setAuth(a);
        } else {
          const a = getStoredAuth();
          if (!cancelled) setAuth(a);
        }
      } catch (e) {
        if (!cancelled) setAuthError(e instanceof Error ? e.message : String(e));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!auth) {
      setUser(null);
      return;
    }
    let cancelled = false;
    spotify.getMe()
      .then((u) => { if (!cancelled) setUser(u); })
      .catch((e) => { if (!cancelled) setAuthError(e instanceof Error ? e.message : String(e)); });
    return () => { cancelled = true; };
  }, [auth]);

  const onLogout = () => {
    localStorage.removeItem('cesura.auth');
    setAuth(null);
    setUser(null);
  };

  return (
    <div className="app">
      <Header user={user} onLogout={onLogout} />
      {authError && <div className="banner banner-error">{authError}</div>}
      {auth && user ? <Discovery user={user} /> : <Login />}
    </div>
  );
}
