const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID as string | undefined;
const SCOPES = [
  'user-read-private',
  'user-read-email',
  'user-read-recently-played',
  'playlist-read-private',
  'playlist-modify-public',
  'playlist-modify-private',
];
const STORAGE_KEY = 'cesura.auth';
const VERIFIER_KEY = 'cesura.pkce.verifier';

export type Auth = {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
};

const redirectUri = () => `${window.location.origin}/callback`;

const base64url = (bytes: ArrayBuffer | Uint8Array) => {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let s = '';
  for (let i = 0; i < arr.length; i++) s += String.fromCharCode(arr[i]);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

const randomVerifier = () => {
  const buf = new Uint8Array(64);
  crypto.getRandomValues(buf);
  return base64url(buf);
};

const sha256 = async (input: string) => {
  const bytes = new TextEncoder().encode(input);
  return base64url(await crypto.subtle.digest('SHA-256', bytes));
};

export async function login(): Promise<void> {
  if (!CLIENT_ID) throw new Error('VITE_SPOTIFY_CLIENT_ID is not set. Copy .env.example to .env and fill it in.');
  const verifier = randomVerifier();
  sessionStorage.setItem(VERIFIER_KEY, verifier);
  const challenge = await sha256(verifier);
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: CLIENT_ID,
    scope: SCOPES.join(' '),
    redirect_uri: redirectUri(),
    code_challenge_method: 'S256',
    code_challenge: challenge,
  });
  window.location.href = `https://accounts.spotify.com/authorize?${params}`;
}

export async function handleCallback(): Promise<Auth> {
  if (!CLIENT_ID) throw new Error('VITE_SPOTIFY_CLIENT_ID is not set.');
  const url = new URL(window.location.href);
  const error = url.searchParams.get('error');
  if (error) throw new Error(`Spotify auth error: ${error}`);
  const code = url.searchParams.get('code');
  if (!code) throw new Error('Missing authorization code');
  const verifier = sessionStorage.getItem(VERIFIER_KEY);
  if (!verifier) throw new Error('Missing PKCE verifier — restart login.');

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri(),
    client_id: CLIENT_ID,
    code_verifier: verifier,
  });

  const resp = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  if (!resp.ok) throw new Error(`Token exchange failed: ${resp.status} ${await resp.text()}`);

  const json = await resp.json();
  const auth: Auth = {
    accessToken: json.access_token,
    refreshToken: json.refresh_token,
    expiresAt: Date.now() + (json.expires_in - 30) * 1000,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
  sessionStorage.removeItem(VERIFIER_KEY);
  return auth;
}

export function getStoredAuth(): Auth | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Auth;
  } catch {
    return null;
  }
}

async function refresh(auth: Auth): Promise<Auth> {
  if (!CLIENT_ID) throw new Error('VITE_SPOTIFY_CLIENT_ID is not set.');
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: auth.refreshToken,
    client_id: CLIENT_ID,
  });
  const resp = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  if (!resp.ok) {
    localStorage.removeItem(STORAGE_KEY);
    throw new Error('Refresh failed — please log in again.');
  }
  const json = await resp.json();
  const next: Auth = {
    accessToken: json.access_token,
    refreshToken: json.refresh_token ?? auth.refreshToken,
    expiresAt: Date.now() + (json.expires_in - 30) * 1000,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export async function getAccessToken(): Promise<string> {
  const auth = getStoredAuth();
  if (!auth) throw new Error('Not logged in');
  if (Date.now() >= auth.expiresAt) {
    const next = await refresh(auth);
    return next.accessToken;
  }
  return auth.accessToken;
}
