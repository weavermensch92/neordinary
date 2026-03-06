import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 5173,
      host: '0.0.0.0',
    },
    plugins: [
      react(),
      {
        name: 'notion-proxy',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            if (req.url && req.url.startsWith('/api/notion')) {
              const notionKey = env.NOTION_API_KEY;
              if (!notionKey) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: 'NOTION_API_KEY not found in .env' }));
                return;
              }

              try {
                const urlParts = req.url.split('/');
                const action = urlParts[3]; // 'query' or 'blocks'
                const id = urlParts[4];

                let targetUrl = '';
                let method = 'GET';
                let body = undefined;

                if (action === 'query') {
                  targetUrl = `https://api.notion.com/v1/databases/${id}/query`;
                  method = 'POST';
                  // Read body from stream
                  const buffers = [];
                  for await (const chunk of req) {
                    buffers.push(chunk);
                  }
                  body = Buffer.concat(buffers).toString();
                } else if (action === 'blocks') {
                  targetUrl = `https://api.notion.com/v1/blocks/${id}/children`;
                  method = 'GET';
                }

                const response = await fetch(targetUrl, {
                  method,
                  headers: {
                    'Authorization': `Bearer ${notionKey}`,
                    'Notion-Version': '2022-06-28',
                    'Content-Type': 'application/json'
                  },
                  body: body || undefined
                });

                const data = await response.json();
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(data));
              } catch (error: any) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: error.message }));
              }
            } else {
              next();
            }
          });
        }
      }
    ],
    define: {
      // Keys are automatically handled by Vite if prefixed with VITE_
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
