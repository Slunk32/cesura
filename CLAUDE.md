# Cesura — guide for Claude

## What this is

Music discovery web app. Seed an artist (or pull from your Spotify recently-played), drift through similar artists, audition tracks, capture them in a Spotify playlist. Originally built 2015–2017, abandoned ~2019, rewritten 2026.

## Stack

- **Frontend**: Vite 6 + React 19 + TypeScript at the repo root
- **Auth**: Spotify PKCE — no client secret in the browser, no server-side token exchange
- **Discovery**: Last.fm `artist.getsimilar`, proxied through `api/similar.ts` (Vercel serverless function) to keep the API key server-side
- **Track preview**: Spotify Embed iframe (works for free Spotify users on any track)
- **Hosting**: Vercel (Vite framework preset; `api/` becomes serverless functions automatically)
- **Legacy**: 2015–2017 implementation (Express + Flux + browserify + gulp + React 15) preserved under `legacy/` as historical reference. **Don't modify it** — treat it as read-only.

## Critical gotchas

- **Spotify rejects `localhost` for new app registrations.** Local dev must use `127.0.0.1` everywhere — the redirect URI registered in the Spotify dashboard is `http://127.0.0.1:5173/callback` and `vite.config.ts` pins `server.host` to `127.0.0.1` for that reason. If a user reports "INVALID_CLIENT: Insecure redirect URI", check that they used the IP, not the hostname.
- **`getArtistRelatedArtists` is dead for new apps** (Spotify deprecated it in late 2024). That's why discovery uses Last.fm. Don't try to "fix" the missing call by reaching for the Spotify endpoint.
- **`preview_url` returns `null` for many tracks via Spotify's API for new apps.** That's why `Player.tsx` uses the Spotify Embed iframe instead of an `<audio>` element. Don't refactor it back to `preview_url`.
- **PKCE uses `sessionStorage` for the code verifier** (one-shot per login) and `localStorage` for the access/refresh token (`cesura.auth`). Logout = delete `cesura.auth`.

## Where things live

```
src/
  App.tsx                          – top-level shell, auth state
  auth/spotify.ts                  – PKCE flow, token storage, refresh
  api/spotify.ts                   – typed Spotify Web API client
  api/lastfm.ts                    – calls /api/similar
  components/
    Header.tsx
    Login.tsx
    Discovery.tsx                  – orchestrates 3-column UI
    SearchBar.tsx
    SimilarArtistsList.tsx
    ArtistView.tsx                 – top tracks for an artist
    TrackRow.tsx
    Player.tsx                     – Spotify Embed iframe
    PlaylistView.tsx
    RecentlyPlayedPanel.tsx        – "seed from recently played" modal
  styles.css                       – single global stylesheet
  types.ts                         – shared Spotify + Last.fm types
api/
  similar.ts                       – Vercel function: Last.fm proxy
legacy/                            – 2015–2017 codebase, preserved for reference
```

## Running locally

The full app needs `vercel dev` because the Last.fm proxy lives in `api/`. Plain `npm run dev` works for everything except similar-artist results.

```bash
vercel dev          # frontend + api/ on http://127.0.0.1:3000
npm run dev         # frontend only on http://127.0.0.1:5173
npm run build       # production build (also runs typecheck)
npm run typecheck   # type-only check
```

After running `vercel dev` for the first time, register `http://127.0.0.1:3000/callback` as an additional Redirect URI in the Spotify dashboard.

## Environment variables

Local: `.env` (gitignored). Production: set in the Vercel dashboard.

- `VITE_SPOTIFY_CLIENT_ID` — exposed to the browser (PKCE only needs the ID)
- `LASTFM_API_KEY` — server-only, used by `api/similar.ts`
- `SPOTIFY_CLIENT_SECRET` — stashed but unused (PKCE doesn't need it)
- `LASTFM_SHARED_SECRET` — stashed but unused (only for write-scope Last.fm calls)

## Deploy

```bash
vercel              # preview
vercel --prod       # production
```

After the first deploy, add the Vercel URL `+ /callback` to Spotify's Redirect URIs.

## Conventions

- TypeScript strict mode is on; the build is `tsc -b && vite build`. Don't introduce `any` casually.
- Components are function components with hooks. No class components, no Flux store, no `React.createClass`.
- One CSS file (`src/styles.css`) with a small custom-property palette. If adding components, follow the existing class naming (`.column-title`, `.muted`, etc.).
- The data flow is intentionally simple: state lives in `Discovery.tsx` and is passed down. There is no global store. Don't add Redux/Zustand for the existing scope.

## Common tasks

- **Add a new Spotify endpoint**: extend `src/api/spotify.ts` with a typed wrapper. The shared `call<T>(...)` helper handles auth + error formatting.
- **Add a new column or panel**: build a component, mount it from `Discovery.tsx`, hand it the props it needs from local state.
- **Debug auth failures**: check `localStorage.cesura.auth` and the network tab for `accounts.spotify.com/api/token`. The most common cause of "Invalid redirect URI" is `localhost` vs `127.0.0.1`.
