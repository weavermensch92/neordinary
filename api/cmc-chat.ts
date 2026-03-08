import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI, Type, FunctionDeclaration } from '@google/genai';

const filterToolDeclaration: FunctionDeclaration = {
  name: 'filter_projects',
  description: 'Filter the project list based on a keyword or topic (e.g., "finance", "health", "17th cohort").',
  parameters: {
    type: Type.OBJECT,
    properties: {
      keyword: {
        type: Type.STRING,
        description: 'The keyword to filter projects by.',
      },
    },
    required: ['keyword'],
  },
};

const resetFilterToolDeclaration: FunctionDeclaration = {
  name: 'reset_filter',
  description: 'Reset the project filter to show all projects.',
  parameters: {
    type: Type.OBJECT,
    properties: {},
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const apiKey = process.env.VITE_CMC_GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ 
            error: 'VITE_CMC_GEMINI_API_KEY is missing in Vercel environment. Please add it to your project settings.' 
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

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const ai = new GoogleGenAI({ apiKey: apiKey as string });

        if (action === 'welcome') {
            const systemInstruction = `당신은 CMC 아카이브의 AI 큐레이터입니다.
당신의 목표는 미래지향적이고 간략한 시스템 현황 보고서를 제공하고 사용자를 환영하는 것입니다.
짧은 단락 하나(최대 2문장)를 작성하세요. 아카이브 데이터 로드 완료를 알리세요.`;

            const result = await ai.models.generateContent({
                model: 'gemini-1.5-flash',
                config: { systemInstruction },
                contents: [{ role: 'user', parts: [{ text: "SYSTEM_INIT_SEQUENCE_START" }] }]
            });

            return res.status(200).json({
                text: result.text || "SYSTEM ONLINE. ARCHIVE DATA LOADED.",
                functionCalls: []
            });
        }

        const systemInstruction = `당신은 CMC(Central Makeus Challenge) 아카이브의 AI 큐레이터입니다.
당신의 목표는 사용자들이 미래지향적인 3D IT 프로젝트 아카이브를 탐색할 수 있도록 돕는 것입니다.

사용 가능한 프로젝트 컨텍스트 요약:
${projectList || '목록 로딩 중...'}

[동작 규칙]
- 필터링 요청 시 'filter_projects' 도구를 사용하세요.
- 초기화 요청 시 'reset_filter' 도구가 필요하면 사용하세요.
- 답변은 한국어로 간결하고 전문적이며, 약간 미래지향적인 느낌을 유지하세요.`;

        const formattedHistory = (history || []).map((msg: any) => ({
            role: msg.role === 'model' ? 'model' : 'user',
            parts: Array.isArray(msg.parts) ? msg.parts : [{ text: msg.text || '' }]
        }));

        const chat = ai.chats.create({
            model: "gemini-1.5-flash",
            config: {
                systemInstruction,
                tools: [{ functionDeclarations: [filterToolDeclaration, resetFilterToolDeclaration] }],
            },
            history: formattedHistory,
        });

        const result = await chat.sendMessage({ message });
        
        return res.status(200).json({
            text: result.text || "",
            functionCalls: result.functionCalls || []
        });

    } catch (error: any) {
        console.error('Gemini API Proxy Error:', error);
        return res.status(500).json({ 
            error: `CMC AI REQUEST FAILED: ${error.message || 'Unknown Error'}. Check Vercel logs or API key validity.` 
        });
    }
}
