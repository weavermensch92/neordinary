import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI, Type, FunctionDeclaration } from '@google/genai';
// Use require or dynamic import if direct import fails in Vercel, but direct import usually works for TS
import { UMC_KNOWLEDGE_BASE } from '../components/umc/lib/knowledge';

const navigateToProjectDeclaration: FunctionDeclaration = {
    name: "navigateToProject",
    description: "Navigate the 3D world map to a specific project and open its details.",
    parameters: {
        type: Type.OBJECT,
        properties: {
            projectId: {
                type: Type.STRING,
                description: "The ID of the project to navigate to.",
            },
            reason: {
                type: Type.STRING,
                description: "A short explanation of why this project is being recommended.",
            }
        },
        required: ["projectId", "reason"],
    },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Use VITE_GEMINI_API_KEY from process.env (since we defined it in Vercel)
    // or GEMINI_API_KEY if that's what's set.
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
        const { message, history, projectList } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const ai = new GoogleGenAI({ apiKey });

        // Ensure history is formatted correctly for gemini
        // The frontend history format is { role: 'user'|'model', text: string }
        const formattedHistory = (history || []).map((msg: any) => ({
            role: msg.role === 'model' ? 'model' : 'user',
            parts: [{ text: msg.text }]
        }));

        const systemInstruction = `당신은 UMC (University MakeUs Challenge) 프로젝트 전시회의 친절한 AI 어시스턴트입니다.
UMC에 대한 소개를 제공하고, 사용자의 관심사나 키워드에 맞는 5, 6, 7, 8기 프로젝트를 추천해줍니다.

[중요 규칙 - 절대 준수]
1. 반드시 아래 제공된 [현재 전시 중인 프로젝트 목록]에 존재하는 프로젝트만 언급하고 추천하십시오.
2. 목록에 없는 프로젝트를 임의로 지어내거나(Hallucination) 상상하여 답변하지 마십시오.
3. 사용자가 찾는 프로젝트가 목록에 없다면, "죄송하지만 해당 프로젝트는 현재 전시 명단에 포함되어 있지 않습니다."라고 정중히 안내하십시오.
4. 프로젝트 추천 시에는 반드시 프로젝트 명칭과 기수를 정확히 언급하십시오.

[UMC 사전 지식]
${UMC_KNOWLEDGE_BASE}

[현재 전시 중인 프로젝트 목록]
${projectList || '목록 로딩 중...'}

사용자가 특정 프로젝트를 보고 싶어하거나 추천한 프로젝트로 이동하길 원하면, 반드시 'navigateToProject' 도구를 사용하여 해당 프로젝트의 ID를 전달하세요.
답변은 한국어로 자연스럽고 친절하게 작성하세요.`;

        const chatArgs: any = {
            model: "gemini-3-flash-preview",
            config: {
                systemInstruction,
                tools: [{ functionDeclarations: [navigateToProjectDeclaration] }],
            }
        };

        // Include history if present
        if (formattedHistory.length > 0) {
            chatArgs.history = formattedHistory;
        }

        // Since we are stateless, we create a new chat instance with the provided history
        // and send the new message to get the response, appending it to the history context.
        const chat = ai.chats.create(chatArgs);
        const response = await chat.sendMessage({ message });

        let modelText = response.text || '';
        const functionCalls = [];

        if (response.functionCalls && response.functionCalls.length > 0) {
            for (const call of response.functionCalls) {
                if (call.name === 'navigateToProject') {
                    const args = call.args as any;
                    const projectId = args.projectId;
                    const reason = args.reason;

                    functionCalls.push({ name: call.name, projectId, reason });
                }
            }
        }

        return res.status(200).json({
            text: modelText,
            functionCalls
        });

    } catch (error: any) {
        console.error('Gemini API Proxy Error:', error);
        return res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
}
