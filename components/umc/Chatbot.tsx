import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Loader2, Bot } from 'lucide-react';
import { GoogleGenAI, Type, FunctionDeclaration, Chat } from '@google/genai';
import { UMC_KNOWLEDGE_BASE } from './lib/knowledge';

const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey });

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

interface ChatbotProps {
  projects: { id: string; name: string; description: string; gen: string }[];
  onNavigate: (projectId: string) => void;
}

export const Chatbot: React.FC<ChatbotProps> = ({ projects, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([
    { role: 'model', text: '안녕하세요! UMC 프로젝트 전시회 AI 어시스턴트입니다. UMC에 대해 궁금한 점이나 찾고 싶은 프로젝트가 있다면 말씀해주세요!' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const initChat = () => {
    // Limit project list to avoid token limits if it's too large, but 260 items is fine for Gemini 1.5/2.0 Flash.
    const projectList = projects.map(p => `- [${p.gen}] ${p.name}: ${p.description} (ID: ${p.id})`).join('\n');

    chatRef.current = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: `당신은 UMC (University MakeUs Challenge) 프로젝트 전시회의 친절한 AI 어시스턴트입니다.
UMC에 대한 소개를 제공하고, 사용자의 관심사나 키워드에 맞는 5, 6, 7, 8기 프로젝트를 추천해줍니다.

[중요 규칙 - 절대 준수]
1. 반드시 아래 제공된 [현재 전시 중인 프로젝트 목록]에 존재하는 프로젝트만 언급하고 추천하십시오.
2. 목록에 없는 프로젝트를 임의로 지어내거나(Hallucination) 상상하여 답변하지 마십시오.
3. 사용자가 찾는 프로젝트가 목록에 없다면, "죄송하지만 해당 프로젝트는 현재 전시 명단에 포함되어 있지 않습니다."라고 정중히 안내하십시오.
4. 프로젝트 추천 시에는 반드시 프로젝트 명칭과 기수를 정확히 언급하십시오.

[UMC 사전 지식]
${UMC_KNOWLEDGE_BASE}

[현재 전시 중인 프로젝트 목록]
${projectList}

사용자가 특정 프로젝트를 보고 싶어하거나 추천한 프로젝트로 이동하길 원하면, 반드시 'navigateToProject' 도구를 사용하여 해당 프로젝트의 ID를 전달하세요.
답변은 한국어로 자연스럽고 친절하게 작성하세요.`,
        tools: [{ functionDeclarations: [navigateToProjectDeclaration] }],
      },
    });
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    if (!chatRef.current) {
      initChat();
    }

    try {
      const response = await chatRef.current!.sendMessage({ message: userMessage });

      let modelText = response.text || '';

      // Check for function calls
      if (response.functionCalls && response.functionCalls.length > 0) {
        for (const call of response.functionCalls) {
          if (call.name === 'navigateToProject') {
            const args = call.args as any;
            const projectId = args.projectId;
            const reason = args.reason;

            if (reason) {
              modelText += `\n\n${reason}`;
            }
            modelText += `\n\n(프로젝트로 이동합니다!)`;

            // Trigger navigation
            onNavigate(projectId);
          }
        }
      }

      setMessages(prev => [...prev, { role: 'model', text: modelText }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'model', text: '죄송합니다. 오류가 발생했습니다. 다시 시도해주세요.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-[100] flex flex-col items-start">
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl w-80 sm:w-96 h-[500px] flex flex-col border border-zinc-200 mb-4 overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          <div className="bg-red-600 text-white p-4 flex justify-between items-center shadow-md z-10">
            <div className="flex items-center gap-2">
              <Bot size={20} />
              <h3 className="font-bold tracking-tight">UMC AI Assistant</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-red-100 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 bg-zinc-50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${msg.role === 'user' ? 'bg-zinc-900 text-white self-end rounded-tr-sm' : 'bg-white border border-zinc-200 text-zinc-800 self-start rounded-tl-sm'}`}>
                {msg.text.split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    {i !== msg.text.split('\n').length - 1 && <br />}
                  </React.Fragment>
                ))}
              </div>
            ))}
            {isLoading && (
              <div className="bg-white border border-zinc-200 text-zinc-800 self-start rounded-2xl rounded-tl-sm p-3 max-w-[85%] flex items-center gap-2 shadow-sm">
                <Loader2 size={16} className="animate-spin text-red-500" />
                <span className="text-sm text-zinc-500">생각 중...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 bg-white border-t border-zinc-200 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="프로젝트를 검색해보세요..."
              className="flex-1 bg-zinc-100 border border-zinc-200 rounded-xl px-4 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="bg-red-600 text-white p-2 rounded-xl hover:bg-red-700 disabled:opacity-50 disabled:hover:bg-red-600 transition-colors shadow-sm flex items-center justify-center w-10 h-10"
            >
              <Send size={18} className="ml-1" />
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-red-600 text-white w-14 h-14 rounded-full shadow-xl hover:scale-105 hover:bg-red-700 transition-all flex items-center justify-center border-4 border-white"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </div>
  );
};
