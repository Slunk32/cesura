import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { getSimilar, parseLimit } from './api/similar';

function devApi(env: Record<string, string>): Plugin {
  return {
    name: 'cesura-dev-api',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api/similar', async (req, res) => {
        const url = new URL(req.url ?? '/', 'http://localhost');
        const artist = (url.searchParams.get('artist') ?? '').trim();
        const limit = parseLimit(url.searchParams.get('limit'));
        const result = await getSimilar(artist, limit, env.LASTFM_API_KEY);
        res.statusCode = result.status;
        res.setHeader('Content-Type', 'application/json');
        if (result.ok) res.setHeader('Cache-Control', result.cache);
        res.end(JSON.stringify(result.body));
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react(), devApi(env)],
    server: {
      host: '127.0.0.1',
      port: 5173,
    },
  };
});
