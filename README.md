# Cesura

Music discovery: seed an artist (or pull from your recently played), drift through similar artists, audition tracks, and capture what you find in a Spotify playlist.

## Stack

- **Frontend**: Vite + React 19 + TypeScript
- **Spotify**: PKCE auth flow, all calls client-side (search, playlists, recently played)
- **Similar artists**: Last.fm `artist.getSimilar`, proxied through a Vercel serverless function so the API key stays server-side
- **Previews**: Spotify Embed iframe (works for free Spotify users; sidesteps the recent `preview_url` restrictions for new apps)
- **Hosting**: Vercel (auto-detected as Vite, with `api/` folder as serverless functions)

The legacy 2015–2017 implementation (Express + Flux + browserify + gulp + React 15) is preserved under [`legacy/`](./legacy) for reference.

## One-time setup

1. **Spotify**: at <https://developer.spotify.com/dashboard>, register an app and add these Redirect URIs:
   - `http://127.0.0.1:5173/callback` (`npm run dev`)
   - `http://127.0.0.1:3000/callback` (`vercel dev`)
   - `https://<your-vercel-domain>/callback` (production)

   Spotify rejects `localhost` for new apps — use the IP.
2. **Last.fm**: get an API key at <https://www.last.fm/api/account/create>. The form's "Callback URL" field doesn't apply to read-only API use; leave it blank.
3. Copy `.env.example` → `.env` and fill in the values.

## Run locally

```bash
npm install
npm run dev
```

Open <http://127.0.0.1:5173> (not `localhost` — Spotify will reject the redirect).

The Last.fm proxy lives at `/api/similar`; for it to work locally use `vercel dev`:

```bash
npm i -g vercel
vercel link        # one-time, links the local dir to a Vercel project
vercel dev         # frontend + api/ on http://127.0.0.1:3000
```

`vercel dev` reads from your local `.env` *and* the env vars on the Vercel project. If you'd rather pull the project's env vars locally instead of maintaining `.env` by hand, run `vercel env pull .env` (this overwrites the file).

## Deploy

```bash
vercel
```

Set `VITE_SPOTIFY_CLIENT_ID` and `LASTFM_API_KEY` in the Vercel project settings (Production + Preview).

## Project layout

```
src/
  App.tsx                  – top-level shell, auth state
  auth/spotify.ts          – PKCE flow + token refresh
  api/spotify.ts           – typed Spotify Web API client
  api/lastfm.ts            – calls /api/similar
  components/
    Header.tsx
    Login.tsx
    Discovery.tsx          – orchestrates 3-column UI
    SearchBar.tsx
    SimilarArtistsList.tsx
    ArtistView.tsx
    TrackRow.tsx
    Player.tsx             – Spotify Embed iframe
    PlaylistView.tsx
    RecentlyPlayedPanel.tsx
api/
  similar.ts               – Vercel function: Last.fm proxy
```

## Why the rewrite (not a `npm install` revival)

Two API changes from late 2024 broke the original codebase's central mechanic:

- Spotify deprecated `getArtistRelatedArtists` for new app registrations.
- Spotify started returning `preview_url: null` for many tracks fetched via the API by new apps.

This version replaces related-artists with Last.fm and replaces `preview_url` audio with the Spotify Embed iframe (which works for free users on any track). The auth flow also moved from the deprecated implicit grant to PKCE.
