// Loader for Spotify's Embed Iframe API.
// Lets us call .play() programmatically on the embed (the static iframe
// can't autoplay, even from a user-gesture click handler).
// Docs: https://developer.spotify.com/documentation/embeds/iframe-api

export type EmbedController = {
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  seek: (sec: number) => void;
  loadUri: (uri: string) => void;
  destroy: () => void;
  addListener: (event: string, cb: (data: unknown) => void) => void;
};

export type IFrameAPI = {
  createController: (
    el: HTMLElement,
    options: { uri: string; width?: string | number; height?: string | number },
    callback: (controller: EmbedController) => void
  ) => void;
};

type EmbedWindow = Window & {
  SpotifyIframeApi?: IFrameAPI;
  onSpotifyIframeApiReady?: (api: IFrameAPI) => void;
};

let loader: Promise<IFrameAPI> | null = null;

export function loadSpotifyEmbedApi(): Promise<IFrameAPI> {
  if (loader) return loader;
  loader = new Promise<IFrameAPI>((resolve) => {
    const w = window as EmbedWindow;
    if (w.SpotifyIframeApi) {
      resolve(w.SpotifyIframeApi);
      return;
    }
    w.onSpotifyIframeApiReady = (api) => {
      w.SpotifyIframeApi = api;
      resolve(api);
    };
    const s = document.createElement('script');
    s.src = 'https://open.spotify.com/embed/iframe-api/v1';
    s.async = true;
    document.head.appendChild(s);
  });
  return loader;
}
