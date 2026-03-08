import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Loader2, Bot } from 'lucide-react';

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    const currentMessages = [...messages];
    setMessages([...currentMessages, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    // Prepare project list summary
    const projectList = projects.map(p => `- [${p.gen}] ${p.name}: ${p.description} (ID: ${p.id})`).join('\n');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          history: currentMessages, // Send previous messages as context
          projectList
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      
      if (data.error) {
          throw new Error(data.error);
      }

      let modelText = data.text || '';

      if (data.functionCalls && data.functionCalls.length > 0) {
        for (const call of data.functionCalls) {
          if (call.name === 'navigateToProject') {
            if (call.reason) {
              modelText += `\n\n${call.reason}`;
            }
            modelText += `\n\n(프로젝트로 이동합니다!)`;

            // Trigger navigation in the map
            onNavigate(call.projectId);
          }
        }
      }

      setMessages(prev => [...prev, { role: 'model', text: modelText }]);
    } catch (error: any) {
      console.error("Chat error:", error);
      const errorMsg = error.message || '오류가 발생했습니다.';
      setMessages(prev => [...prev, { role: 'model', text: `죄송합니다. 오류가 발생했습니다: ${errorMsg}` }]);
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
