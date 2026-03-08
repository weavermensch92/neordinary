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
                // Determine action and ID from query params
                const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
                const action = urlObj.searchParams.get('action');
                const id = urlObj.searchParams.get('id');

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
            } else if (req.url && (req.url.startsWith('/api/chat') || req.url.startsWith('/api/cmc-chat'))) {
              const geminiKey = env.VITE_GEMINI_API_KEY || env.GEMINI_API_KEY;
              if (!geminiKey) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: 'GEMINI_API_KEY not found in .env' }));
                return;
              }

              try {
                // Determine action and ID from query params
                const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
                
                // Read body
                const buffers = [];
                for await (const chunk of req) {
                  buffers.push(chunk);
                }
                const bodyStr = Buffer.concat(buffers).toString();
                const body = JSON.parse(bodyStr);

                // Call the actual serverless function logic or just proxy
                // Since we want to handle it locally, we'll import genai
                // But wait, importing from @google/genai might be tricky in vite.config.
                // Let's use a simple fetch to the handler if it's running, or just implement the logic here.
                // For simplicity, let's just forward it to a placeholder for now or use the global fetch.
                // Actually, since we have the key, we can call Gemini directly.
                
                // For CMC Chat
                if (req.url.startsWith('/api/cmc-chat')) {
                  const { message, history, projectList, action } = body;
                  const targetUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`;
                  
                  let contents = [];
                  let systemInstruction = "";

                  if (action === 'welcome') {
                    systemInstruction = "당신은 CMC 아카이브의 AI 큐레이터입니다. 미래지향적이고 간략한 시스템 현황 보고서를 제공하고 사용자를 환영하는 것입니다. 짧은 단락 하나(최대 2문장)를 작성하세요.";
                    contents = [{ role: 'user', parts: [{ text: "SYSTEM_INIT_SEQUENCE_START" }] }];
                  } else {
                    systemInstruction = `당신은 CMC(Central Makeus Challenge) 아카이브의 AI 큐레이터입니다. 사용 가능한 프로젝트:\n${projectList}\n도구 filter_projects, reset_filter를 적절히 사용하세요.`;
                    contents = (history || []).map((msg: any) => ({
                      role: msg.role === 'model' ? 'model' : 'user',
                      parts: Array.isArray(msg.parts) ? msg.parts : [{ text: msg.text || '' }]
                    }));
                    contents.push({ role: 'user', parts: [{ text: message }] });
                  }

                  const response = await fetch(targetUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      contents,
                      systemInstruction: { parts: [{ text: systemInstruction }] },
                      tools: action === 'chat' ? [{
                        functionDeclarations: [
                          {
                            name: 'filter_projects',
                            description: 'Filter projects by keyword',
                            parameters: { type: 'OBJECT', properties: { keyword: { type: 'STRING' } }, required: ['keyword'] }
                          },
                          {
                            name: 'reset_filter',
                            description: 'Reset filter'
                          }
                        ]
                      }] : []
                    })
                  });

                  const data = await response.json() as any;
                  const candidate = data.candidates?.[0];
                  const modelText = candidate?.content?.parts?.find((p: any) => p.text)?.text || "";
                  const calls = candidate?.content?.parts?.filter((p: any) => p.functionCall);
                  const functionCalls = (calls || []).map((c: any) => ({ name: c.functionCall.name, args: c.functionCall.args }));

                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ text: modelText, functionCalls }));
                } else {
                  // Standard chat proxy
                  res.statusCode = 501;
                  res.end(JSON.stringify({ error: 'Local proxy for /api/chat not fully implemented. Please use production or vercel dev.' }));
                }
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
