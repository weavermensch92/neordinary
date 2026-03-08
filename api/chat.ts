import type { VercelRequest, VercelResponse } from '@vercel/node';

// Standalone version to avoid Vercel bundling issues (Force redeploy to sync env vars)
const UMC_KNOWLEDGE_BASE_LOCAL = `
UMC (University MakeUs Challenge)는 대학생들의 IT 역량 강화를 위한 실무형 프로젝트 연합 동아리입니다. 
주로 5기, 6기, 7기, 8기 등의 기수별로 운영되며, 매 기수마다 수십 개의 혁신적인 앱/웹 서비스 프로젝트가 탄생합니다.
전시회는 이러한 프로젝트들의 결과물을 대중에게 선보이고, 개발자들이 서로의 기술을 공유하는 축제의 장입니다.
`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const rawKey = process.env.VITE_OPENAI_API_KEY || process.env.OPENAI_API_KEY;
    const apiKey = rawKey?.trim();

    if (!apiKey) {
        return res.status(500).json({ 
            error: 'OPENAI_API_KEY_NOT_FOUND',
            details: 'VITE_OPENAI_API_KEY is missing. Please check your environment variables.' 
        });
    }

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
    );

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    try {
        const { message, history, projectList } = req.body;
        if (!message) return res.status(400).json({ error: 'Message is required' });

        const systemContent = `당신은 UMC (University MakeUs Challenge) 프로젝트 전시회의 친절한 AI 어시스턴트입니다.
UMC에 대한 소개를 제공하고, 사용자의 관심사나 키워드에 맞는 5, 6, 7, 8기 프로젝트를 추천해줍니다.

[중요 규칙]
1. 반드시 제공된 [현재 전시 중인 프로젝트 목록]에 존재하는 프로젝트만 언급하고 추천하십시오.
2. 목록에 없는 프로젝트를 임의로 지어내지 마십시오.
3. 추천 시에는 반드시 프로젝트 명칭과 기수를 정확히 언급하십시오.

[UMC 사전 지식]
${UMC_KNOWLEDGE_BASE_LOCAL}

[현재 전시 중인 프로젝트 목록]
${projectList || '목록 로딩 중...'}

사용자가 특정 프로젝트를 추천받거나 이동하길 원하면, 반드시 'navigateToProject' 도구를 사용하세요.`;

        const messages = [
            { role: 'system', content: systemContent },
            ...(history || []).map((msg: any) => ({
                role: msg.role === 'model' ? 'assistant' : 'user',
                content: typeof msg.text === 'string' ? msg.text : (msg.parts?.[0]?.text || '')
            })),
            { role: 'user', content: message }
        ];

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages,
                tools: [
                    {
                        type: 'function',
                        function: {
                            name: 'navigateToProject',
                            description: 'Navigate to a specific project details page',
                            parameters: {
                                type: 'object',
                                properties: {
                                    projectId: { type: 'string', description: 'The ID of the project to navigate to' },
                                    reason: { type: 'string', description: 'Brief reason for the navigation' }
                                },
                                required: ['projectId', 'reason']
                            }
                        }
                    }
                ],
                tool_choice: 'auto'
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || `OPENAI_HTTP_${response.status}`);
        }

        const data = await response.json();
        const assistantMessage = data.choices?.[0]?.message;
        
        if (!assistantMessage) throw new Error('EMPTY_OPENAI_RESPONSE');

        const modelText = assistantMessage.content || "";
        const toolCalls = assistantMessage.tool_calls || [];
        
        const functionCalls = toolCalls.map((tc: any) => {
            const args = JSON.parse(tc.function.arguments);
            return {
                name: tc.function.name,
                projectId: args.projectId,
                reason: args.reason
            };
        });

        return res.status(200).json({
            text: modelText,
            functionCalls
        });

    } catch (error: any) {
        console.error('OpenAI API Error:', error);
        return res.status(500).json({ 
            error: 'SERVERLESS_INTERNAL_ERROR',
            details: error.message || 'Unknown server error'
        });
    }
}
