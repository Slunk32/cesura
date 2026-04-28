import { useEffect, useRef } from 'react';
import { loadSpotifyEmbedApi, type EmbedController } from '../lib/spotifyEmbed';

export function InlineSpotifyPlayer({ trackUri }: { trackUri: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<EmbedController | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadSpotifyEmbedApi().then((api) => {
      if (cancelled || !hostRef.current) return;
      api.createController(
        hostRef.current,
        { uri: trackUri, width: '100%', height: '80' },
        (controller) => {
          if (cancelled) {
            try { controller.destroy(); } catch { /* noop */ }
            return;
          }
          controllerRef.current = controller;
          // The embed is created in a paused state; trigger autoplay once
          // it's wired up. The user just clicked, so the gesture-required
          // autoplay policy is satisfied.
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

  return <div className="inline-player-host" ref={hostRef} />;
}
