import { login } from '../auth/spotify';

export function Login() {
  return (
    <div className="login">
      <h1>Discover music from the bands you already love.</h1>
      <p className="login-sub">
        Seed an artist (or pull from your recently played), drift through similar acts,
        audition tracks, and capture what you find in a Spotify playlist.
      </p>
      <button className="primary-btn" onClick={() => login()}>
        Log in with Spotify
      </button>
    </div>
  );
}
