import type { VercelRequest, VercelResponse } from '@vercel/node';

// Standalone CMC AI handler

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const apiKey = process.env.VITE_CMC_GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ 
            error: 'VITE_CMC_GEMINI_API_KEY_NOT_FOUND',
            details: 'Required API Key is missing in Vercel environment. Check your environment variables and Redeploy.'
        });
    }

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { message, history, projectList, action } = req.body;

        if (!message && action !== 'welcome') {
            return res.status(400).json({ error: 'Message is required' });
        }

        const targetUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        if (action === 'welcome') {
            const systemInstruction = `당신은 CMC 아카이브의 AI 큐레이터입니다.
미래지향적이고 간략한 시스템 현황 보고서를 제공하고 사용자를 환영하세요.
최대 2문장으로 작성하십시오. 아카이브 데이터 로드 완료를 보고하세요.`;

            const apiResponse = await fetch(targetUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ role: 'user', parts: [{ text: "SYSTEM_INIT_SEQUENCE_START" }] }],
                    system_instruction: { parts: [{ text: systemInstruction }] }
                })
            });

            if (!apiResponse.ok) {
                const errBody = await apiResponse.json().catch(() => ({}));
                throw new Error(errBody.error?.message || `GEMINI_HTTP_${apiResponse.status}`);
            }

            const data = await apiResponse.json() as any;
            return res.status(200).json({
                text: data.candidates?.[0]?.content?.parts?.[0]?.text || "SYSTEM ONLINE. ARCHIVE DATA LOADED.",
                functionCalls: []
            });
        }

        const systemInstruction = `당신은 CMC(Central Makeus Challenge) 아카이브의 AI 큐레이터입니다.
3D IT 프로젝트 아카이브를 탐색하는 사용자를 돕는 것이 임무입니다.

[프로젝트 목록 컨텍스트]
${projectList || '목록 로딩 중...'}

[도구 사용 규칙]
1. 필터링 요청 시 'filter_projects' 도구를 사용하세요.
2. 초기화 요청 시 'reset_filter' 도구를 사용하세요.
한국어로 간결하고 전문적이며 미래지향적인 톤을 유지하세요.`;

        const contents = (history || []).map((msg: any) => ({
            role: msg.role === 'model' ? 'model' : 'user',
            parts: Array.isArray(msg.parts) ? msg.parts : [{ text: msg.text || '' }]
        }));
        contents.push({ role: 'user', parts: [{ text: message }] });

        const apiResponse = await fetch(targetUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents,
                system_instruction: { parts: [{ text: systemInstruction }] },
                tools: [{
                    function_declarations: [
                        {
                            name: 'filter_projects',
                            description: 'Filter projects by keyword',
                            parameters: { type: 'OBJECT', properties: { keyword: { type: 'STRING' } }, required: ['keyword'] }
                        },
                        {
                            name: 'reset_filter',
                            description: 'Reset project filter'
                        }
                    ]
                }]
            })
        });

        if (!apiResponse.ok) {
            const errBody = await apiResponse.json().catch(() => ({}));
            throw new Error(errBody.error?.message || `GEMINI_HTTP_${apiResponse.status}`);
        }

        const data = await apiResponse.json() as any;
        const candidate = data.candidates?.[0];
        
        if (!candidate) throw new Error('EMPTY_CANDIDATE');

        const modelParts = candidate.content?.parts || [];
        const modelText = modelParts.find((p: any) => p.text)?.text || "";
        const calls = modelParts.filter((p: any) => p.functionCall || p.function_call);
        
        const functionCalls = (calls || []).map((c: any) => {
            const call = c.functionCall || c.function_call;
            return {
                name: call.name,
                args: call.args
            };
        });

        return res.status(200).json({
            text: modelText,
            functionCalls
        });

    } catch (error: any) {
        console.error('Gemini API Proxy Error:', error);
        return res.status(500).json({ 
            error: 'CMC_SERVERLESS_INTERNAL_ERROR',
            details: error.message || 'Unknown server error'
        });
    }
}
