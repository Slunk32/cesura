import { useEffect, useRef } from 'react';
import { loadSpotifyEmbedApi, type EmbedController } from '../lib/spotifyEmbed';

export function InlineSpotifyPlayer({ trackUri }: { trackUri: string }) {
  const outerRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<EmbedController | null>(null);

  useEffect(() => {
    let cancelled = false;
    const outer = outerRef.current;
    if (!outer) return;

    // The Spotify embed API replaces the host element with its own iframe.
    // If we hand it a React-managed node, React's later unmount can't find
    // the original child and throws NotFoundError. So we create a fresh
    // node, append it ourselves, and let Spotify mutate it freely — React
    // only tracks the outer div, which it can safely remove on unmount.
    const host = document.createElement('div');
    outer.appendChild(host);

    loadSpotifyEmbedApi().then((api) => {
      if (cancelled) return;
      api.createController(
        host,
        { uri: trackUri, width: '100%', height: '80' },
        (controller) => {
          if (cancelled) {
            try { controller.destroy(); } catch { /* noop */ }
            return;
          }
          controllerRef.current = controller;
          setTimeout(() => {
            try { controller.play(); } catch { /* noop */ }
          }, 100);
        }
      );
    });

    return () => {
      cancelled = true;
      try { controllerRef.current?.destroy(); } catch { /* noop */ }
      controllerRef.current = null;
    };
  }, [trackUri]);

  return <div className="inline-player-host" ref={outerRef} />;
}
