import type { VercelRequest, VercelResponse } from '@vercel/node';

// Standalone version to avoid Vercel bundling issues with relative imports outside of api/
const UMC_KNOWLEDGE_BASE_LOCAL = `
UMC (University MakeUs Challenge)는 대학생들의 IT 역량 강화를 위한 실무형 프로젝트 연합 동아리입니다. 
주로 5기, 6기, 7기, 8기 등의 기수별로 운영되며, 매 기수마다 수십 개의 혁신적인 앱/웹 서비스 프로젝트가 탄생합니다.
전시회는 이러한 프로젝트들의 결과물을 대중에게 선보이고, 개발자들이 서로의 기술을 공유하는 축제의 장입니다.
`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ 
            error: 'VITE_GEMINI_API_KEY_NOT_FOUND',
            details: 'VITE_GEMINI_API_KEY is missing in Vercel environment. Please Redeploy after checking Settings > Environment Variables.' 
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
        const { message, history, projectList } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const systemInstruction = `당신은 UMC (University MakeUs Challenge) 프로젝트 전시회의 친절한 AI 어시스턴트입니다.
UMC에 대한 소개를 제공하고, 사용자의 관심사나 키워드에 맞는 5, 6, 7, 8기 프로젝트를 추천해줍니다.

[중요 규칙 - 절대 준수]
1. 반드시 제공된 [현재 전시 중인 프로젝트 목록]에 존재하는 프로젝트만 언급하고 추천하십시오.
2. 목록에 없는 프로젝트를 임의로 지어내지 마십시오. (Hallucination 금지)
3. 추천 시에는 반드시 프로젝트 명칭과 기수를 정확히 언급하십시오.

[UMC 사전 지식]
${UMC_KNOWLEDGE_BASE_LOCAL}

[현재 전시 중인 프로젝트 목록]
${projectList || '목록 로딩 중...'}

사용자가 특정 프로젝트를 추천받거나 이동하길 원하면, 반드시 'navigateToProject' 도구를 사용하세요.
한국어로 자연스럽고 친절하게 작성하세요.`;

        const contents = (history || []).map((msg: any) => ({
            role: msg.role === 'model' ? 'model' : 'user',
            parts: Array.isArray(msg.parts) ? msg.parts : [{ text: msg.text || '' }]
        }));
        contents.push({ role: 'user', parts: [{ text: message }] });

        const targetUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
        
        const apiResponse = await fetch(targetUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents,
                systemInstruction: { parts: [{ text: systemInstruction }] },
                tools: [{
                    functionDeclarations: [
                        {
                            name: 'navigateToProject',
                            description: 'Navigate to a specific project',
                            parameters: {
                                type: 'OBJECT',
                                properties: {
                                    projectId: { type: 'STRING' },
                                    reason: { type: 'STRING' }
                                },
                                required: ['projectId', 'reason']
                            }
                        }
                    ]
                }]
            })
        });

        if (!apiResponse.ok) {
            const errorBody = await apiResponse.json().catch(() => ({}));
            throw new Error(errorBody.error?.message || `GEMINI_HTTP_${apiResponse.status}`);
        }

        const data = await apiResponse.json() as any;
        const candidate = data.candidates?.[0];
        
        if (!candidate) {
            throw new Error('EMTPY_CANDIDATES');
        }

        const modelText = candidate?.content?.parts?.find((p: any) => p.text)?.text || "";
        const calls = candidate?.content?.parts?.filter((p: any) => p.functionCall);
        const functionCalls = (calls || []).map((c: any) => ({
            name: c.functionCall.name,
            projectId: c.functionCall.args.projectId,
            reason: c.functionCall.args.reason
        }));

        return res.status(200).json({
            text: modelText,
            functionCalls
        });

    } catch (error: any) {
        console.error('Gemini API Proxy Error:', error);
        return res.status(500).json({ 
            error: 'SERVERLESS_INTERNAL_ERROR',
            details: error.message || 'Unknown server error'
        });
    }
}
