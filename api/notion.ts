import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const notionKey = process.env.NOTION_API_KEY;

    if (!notionKey) {
        return res.status(500).json({ error: 'NOTION_API_KEY not found in environment' });
    }

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Notion-Version, Authorization'
    );

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const fullPath = req.url || '';
        // Expected formats: 
        // /api/notion/query/:id
        // /api/notion/blocks/:id
        const parts = fullPath.split('?')[0].split('/');
        // parts[0] is "", parts[1] is "api", parts[2] is "notion", parts[3] is action, parts[4] is id
        const action = parts[3];
        const id = parts[4];

        if (!action || !id) {
            return res.status(400).json({ error: 'Invalid API path. Expected /api/notion/query/:id or /api/notion/blocks/:id' });
        }

        let targetUrl = '';
        let method = 'GET';

        if (action === 'query') {
            targetUrl = `https://api.notion.com/v1/databases/${id}/query`;
            method = 'POST';
        } else if (action === 'blocks') {
            targetUrl = `https://api.notion.com/v1/blocks/${id}/children`;
            method = 'GET';
        } else {
            return res.status(404).json({ error: 'Action not found' });
        }

        const response = await fetch(targetUrl, {
            method,
            headers: {
                'Authorization': `Bearer ${notionKey}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json'
            },
            body: method === 'POST' ? JSON.stringify(req.body) : undefined
        });

        const data = await response.json();
        return res.status(response.status).json(data);
    } catch (error: any) {
        console.error('Notion API Proxy Error:', error);
        return res.status(500).json({ error: error.message });
    }
}
