import type { VercelRequest, VercelResponse } from '@vercel/node';

// Standalone CMC AI handler (API Key Updated)
export default async function handler(req: VercelRequest, res: VercelResponse) {
    const rawKey = process.env.VITE_PROPOSAL_API || process.env.OPENAI_API_KEY;
    const apiKey = rawKey?.trim();

    if (!apiKey) {
        return res.status(500).json({ 
            error: 'OPENAI_API_KEY_NOT_FOUND',
            details: 'VITE_PROPOSAL_API is missing. Please check your environment variables.' 
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
        // Force redeploy to apply new Vercel Environment Variables
        const { message, history, projectList, action } = req.body;

        if (!message && action !== 'welcome') {
            return res.status(400).json({ error: 'Message is required' });
        }

        const openaiUrl = 'https://api.openai.com/v1/chat/completions';

        if (action === 'welcome') {
            const systemContent = `당신은 CMC 아카이브의 AI 큐레이터입니다.
미래지향적이고 간략한 시스템 현황 보고서를 제공하고 사용자를 환영하세요.
최대 2문장으로 작성하십시오. 아카이브 데이터 로드 완료를 보고하세요.`;

            const response = await fetch(openaiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-4o-mini',
                    messages: [
                        { role: 'system', content: systemContent },
                        { role: 'user', content: 'SYSTEM_INIT_SEQUENCE_START' }
                    ]
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || `WELCOME_HTTP_${response.status}`);
            }

            const data = await response.json();
            return res.status(200).json({
                text: data.choices?.[0]?.message?.content || "SYSTEM READY.",
                functionCalls: []
            });
        }

        const systemContent = `당신은 CMC(Central MakeUs Challenge) 아카이브의 전문 AI 큐레이터입니다.
3D IT 프로젝트 아카이브를 탐색하는 사용자를 돕는 것이 임무입니다.

[프로젝트 목록 컨텍스트]
${projectList || '목록 로딩 중...'}

[도구 사용 규칙]
1. 필터링 요청 시 'filter_projects' 도구를 사용하세요.
2. 초기화 요청 시 'reset_filter' 도구를 사용하세요.
한국어로 간결하고 전문적이며 미래지향적인 톤을 유지하세요.`;

        const messages = [
            { role: 'system', content: systemContent },
            ...(history || []).map((msg: any) => ({
                role: msg.role === 'model' ? 'assistant' : 'user',
                content: typeof msg.text === 'string' ? msg.text : (msg.parts?.[0]?.text || '')
            })),
            { role: 'user', content: message }
        ];

        const response = await fetch(openaiUrl, {
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
                            name: 'filter_projects',
                            description: 'Filter projects by keyword',
                            parameters: {
                                type: 'object',
                                properties: {
                                    keyword: { type: 'string', description: 'Keyword to filter projects' }
                                },
                                required: ['keyword']
                            }
                        }
                    },
                    {
                        type: 'function',
                        function: {
                            name: 'reset_filter',
                            description: 'Reset project filter to show all'
                        }
                    }
                ],
                tool_choice: 'auto'
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || `CMC_HTTP_${response.status}`);
        }

        const data = await response.json();
        const assistantMessage = data.choices?.[0]?.message;
        
        if (!assistantMessage) throw new Error('EMPTY_OPENAI_RESPONSE');

        const modelText = assistantMessage.content || "";
        const toolCalls = assistantMessage.tool_calls || [];
        
        const functionCalls = toolCalls.map((tc: any) => {
            const args = tc.function.arguments ? JSON.parse(tc.function.arguments) : {};
            return {
                name: tc.function.name,
                args: args
            };
        });

        return res.status(200).json({
            text: modelText,
            functionCalls
        });

    } catch (error: any) {
        console.error('OpenAI API Proxy Error:', error);
        return res.status(500).json({ 
            error: 'CMC_SERVERLESS_INTERNAL_ERROR',
            details: error.message || 'Unknown server error'
        });
    }
}
