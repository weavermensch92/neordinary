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

        const systemContent = `당신은 CMC(Central MakeUs Challenge) 아카이브의 AI 큐레이터입니다.
당신의 목표는 사용자들이 미래지향적인 3D IT 프로젝트 아카이브를 탐색할 수 있도록 돕는 것입니다.

[CMC 커뮤니티 정보]
CMC는 실력있는 ‘기획자, 디자이너, 개발자’들이 3개월 동안 함께 수익 창출을 위한 MVP 프로덕트를 제작하는 IT 커뮤니티입니다. (수익형 앱/AI Agent 런칭 동아리)

[활동 통계]
- 현재 기수: 17기
- 7기~12기: 기수당 약 50-55명 / 10-11팀
- 13기~15기: 기수당 40명 / 8팀
- 16기: 50명 / 10팀

[성공 사례]
- Zenefit (13기): 예창패 선정
- 내친소 (11기): 청창사 선정, 높은 월 매출 기록 중

[주요 활동]
- 기획/디자인 세션 (피드백), 너디너리 해커톤, 개발자 스터디, 파트별 네트워킹(Plan, Design, Native, Server, Web), 런칭데이, 데모데이

[모집 정보]
- CMC in Busan 1기 모집 중: 부산 기반 압도적 성장, MVP 제작 및 수익 창출 도전. AI 코파일럿(Cursor, Claude) 100% 지원.

[공식 링크]
- 홈페이지: https://cmc.makeus.in/
- 인스타그램: https://www.instagram.com/cmc__official/

[도구 사용 규칙]
1. 'filter_projects(keyword)': 특정 프로젝트, 코호트(예: "15기"), 주제 탐색 시 호출. 가장 관련성 높은 단일 키워드 추출.
2. 'reset_filter()': 전체 보기 또는 초기화 요청 시 호출.
- 추천 요청 시 일치하는 키워드로 'filter_projects' 호출 필수.
- 프로젝트 목록을 텍스트로만 나열하지 말고 반드시 도구를 사용하여 시각적으로 업데이트하세요.

[동작 및 언어 규칙 (CRITICAL LANGUAGE RULE)]
1. **모든 응답의 기본 언어는 영어(English)입니다.** 사용자의 첫 대화나 영어 질문에는 반드시 영어로 응답하세요.
2. **사용자가 한국어로 주문하거나 질문할 경우에만** 한국어로 답변을 전환하십시오.
- 전문적이고 미래지향적이며 약간 로봇 같은 톤을 유지하세요 (예: "Filtering protocol initiated...", "Accessing archive...").

[프로젝트 목록 컨텍스트]
${projectList || '목록 로딩 중...'}
`;

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
