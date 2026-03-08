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
    const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'GEMINI_API_KEY not found in server environment.' });
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
        
        const ai = new GoogleGenAI({ apiKey });

        if (action === 'welcome') {
            const systemInstruction = `
              당신은 CMC 아카이브의 AI 큐레이터입니다.
              당신의 목표는 미래지향적이고 간략한 시스템 현황 보고서를 제공하고 사용자를 환영하는 것입니다.
              배경 정보:
              - 주요 테마: AI, 라이프스타일, 금융, 사회
              지침:
              - 짧은 단락 하나(최대 2문장)를 작성하세요.
              - 스타일: 미래지향적이고 로봇 같지만 정중하게 작성하세요.
              - 내용: 아카이브 데이터가 로드되어 조회 준비가 완료되었음을 알리세요.
              - 이 메시지 작성에는 어떤 도구도 사용하지 마세요.
            `;
            const result = await ai.models.generateContent({
                model: 'gemini-1.5-flash',
                config: { systemInstruction },
                contents: [{ role: 'user', parts: [{ text: "SYSTEM_INIT_SEQUENCE_START" }] }],
            });
            return res.status(200).json({ text: result.text || "SYSTEM ONLINE. ARCHIVE DATA LOADED." });
        }

        if (action === 'chat') {
            const systemInstruction = `
                당신은 CMC(Central Makeus Challenge) 아카이브의 AI 큐레이터입니다.
                당신의 목표는 사용자들이 미래지향적인 3D IT 프로젝트 아카이브를 탐색할 수 있도록 돕는 것입니다.
                다음과 같은 도구를 사용할 수 있습니다.
                1. 'filter_projects(keyword)': 사용자가 특정 유형의 프로젝트, 코호트 또는 주제를 보고 싶어할 때 호출합니다. 가장 관련성이 높은 단일 키워드를 추출합니다.
                2. 'reset_filter()': 사용자가 "모든" 프로젝트를 보거나 보기를 "초기화"하려는 경우 호출합니다.
                
                사용 가능한 프로젝트 컨텍스트 요약:
                ${projectList}
                동작 규칙:
                - 사용자가 추천을 요청하면 사용자의 관심사와 일치하는 키워드를 선택하고 'filter_projects'를 호출합니다.
                - 사용자가 특정 코호트(예: "15기")에 대해 문의하면 "15기"를 사용하여 'filter_projects'를 호출합니다.
                - 답변은 간결하고 전문적이며, 약간 미래지향적이거나 로봇 같은 느낌을 유지하세요.
                - 프로젝트 목록을 텍스트로만 나열하지 마세요. 반드시 도구를 사용하여 앱을 시각적으로 업데이트해야 합니다.
            `;

            const formattedHistory = (history || []).map((msg: any) => ({
                role: msg.role === 'model' ? 'model' : 'user',
                parts: Array.isArray(msg.parts) ? msg.parts : [{ text: msg.parts?.[0]?.text || msg.text || '' }]
            }));

            const chat = ai.chats.create({
                model: 'gemini-1.5-flash',
                config: {
                    systemInstruction,
                    tools: [{ functionDeclarations: [filterToolDeclaration, resetFilterToolDeclaration] }],
                },
                history: formattedHistory,
            });

            const result = await chat.sendMessage({ message });
            
            const functionCalls = [];
            if (result.functionCalls && result.functionCalls.length > 0) {
                for (const call of result.functionCalls) {
                    if (call.name === 'filter_projects' || call.name === 'reset_filter') {
                        functionCalls.push({ name: call.name, args: call.args });
                    }
                }
            }

            return res.status(200).json({
                text: result.text,
                functionCalls
            });
        }

        return res.status(400).json({ error: 'Invalid action' });

    } catch (error: any) {
        console.error('Gemini API Proxy Error:', error);
        return res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
}
