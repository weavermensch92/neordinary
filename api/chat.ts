import type { VercelRequest, VercelResponse } from '@vercel/node';

// Standalone version (Updated API Key Ref)
const UMC_KNOWLEDGE_BASE_LOCAL = `
UMC (University MakeUs Challenge)는 대학생들의 IT 역량 강화를 위한 실무형 프로젝트 연합 동아리입니다. 
주로 5기, 6기, 7기, 8기 등의 기수별로 운영되며, 매 기수마다 수십 개의 혁신적인 앱/웹 서비스 프로젝트가 탄생합니다.
전시회는 이러한 프로젝트들의 결과물을 대중에게 선보이고, 개발자들이 서로의 기술을 공유하는 축제의 장입니다.
`;

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
        // Updated API Key Reference - Force Redeploy
        const { message, history, projectList, action } = req.body;
        if (!message) return res.status(400).json({ error: 'Message is required' });

        const systemContent = `당신은 UMC (University MakeUs Challenge) 프로젝트 전시회의 전문 AI 어시스턴트입니다.
사용자들이 혁신적인 대학생 IT 프로젝트 아카이브를 탐색할 수 있도록 돕는 것이 당신의 임무입니다.

[중요: 언어 정책 (CRITICAL LANGUAGE RULE)]
1. 모든 응답의 기본 언어는 **영어(English)**입니다. 사용자가 영어로 질문하거나 처음 대화를 시작할 때 반드시 영어로 답하세요.
2. **오직 사용자가 한국어로 질문하거나 한국어 답변을 명시적으로 요청한 경우에만** 한국어로 답변하십시오.
3. 한국어로 답변할 때도 전문적이고 미래지향적인 톤을 유지하세요.

[UMC 커뮤니티 지식]
University MakeUs Challenge (UMC)는 대학생들을 위한 전국 IT 연합 동아리이자 커뮤니티입니다.
기획자, 디자이너, 개발자들이 모여 3개월간 스터디, 3개월간 MVP 프로덕트를 제작하며 실제 서비스 런칭에 도전합니다.
- 현재 8기 운영 중 (역대 700~1000명 규모)
- 숭실대, 인하대, 가천대 등 전국 40여 개교 참여
- 예창패 선정 사례 및 기수당 30여 개 이상의 서비스 런칭 성과

[도구 사용 규칙]
1. 'navigateToProject(projectId, reason)': 특정 프로젝트 이동/추천 시 호출.
- 프로젝트 목록을 단순히 텍스트로 나열하지 마세요. 반드시 도구를 사용하여 시각적으로 이동시켜야 합니다.

[페르소나]
- 답변은 전문적이고 미래지향적이며, 약간 로봇 같은 톤을 유지하세요 (예: "System synchronized...", "Calculating optimal project match...").

[사용 가능한 프로젝트 목록]
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
