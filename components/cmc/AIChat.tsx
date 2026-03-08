import React, { useState, useRef, useEffect } from 'react';
import { sendMessageToGemini, generateWelcomeMessage } from './lib/geminiService';

interface AIChatProps {
  onSearch: (query: string) => void;
  isFiltered: boolean;
  onReset: () => void;
}

interface Message {
  role: 'user' | 'model';
  text: string;
}

const AIChat: React.FC<AIChatProps> = ({ onSearch, isFiltered, onReset }) => {
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initial System Boot
  useEffect(() => {
    const initSystem = async () => {
      try {
        const welcome = await generateWelcomeMessage();
        setMessages([{ role: 'model', text: welcome }]);
      } catch (e) {
        setMessages([{ role: 'model', text: 'SYSTEM ONLINE. AWAITING COMMAND.' }]);
      } finally {
        setIsInitializing(false);
      }
    };
    initSystem();
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isFocused, isInitializing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || isInitializing) return;

    const userText = input;
    setInput('');
    setIsLoading(true);

    // Add user message to UI immediately
    const newHistory = [...messages, { role: 'user' as const, text: userText }];
    setMessages(newHistory);

    try {
      // Filter out the very first message if it was the welcome message (optional, but good for context window)
      // For simplicity, we just pass the recent history.
      const historyForAi = newHistory
        .map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        }));

      const response = await sendMessageToGemini(historyForAi, userText);
      
      // Handle Function Calls (Access as property, not function)
      const functionCalls = response.functionCalls;
      let aiText = response.text;

      if (functionCalls && functionCalls.length > 0) {
        for (const call of functionCalls) {
          if (call.name === 'filter_projects') {
            const keyword = call.args.keyword as string;
            onSearch(keyword);
            aiText = aiText || `FILTERING DATA STREAM: "${keyword.toUpperCase()}"`;
          } else if (call.name === 'reset_filter') {
            onReset();
            aiText = aiText || "RESETTING VIEW PARAMETERS.";
          }
        }
      }

      // If no text but function called, generic response is handled above. 
      // If text exists, use it.
      if (!aiText) {
          aiText = "COMMAND PROCESSED.";
      }

      setMessages(prev => [...prev, { role: 'model', text: aiText }]);

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: 'ERROR: CONNECTION LOST.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className={`flex flex-col items-end gap-2 transition-all duration-300 ease-out ${isFocused || messages.length > 0 ? 'w-96' : 'w-64'}`}
      data-cursor="chat"
    >
      {/* Chat History Window (Visible when focused or has history) */}
      <div 
        className={`
          w-full bg-black/80 backdrop-blur-md border border-[#E60023]/30 
          overflow-hidden flex flex-col justify-end transition-all duration-500
          ${(isFocused || messages.length > 0) ? 'h-64 opacity-100 mb-2 p-4' : 'h-0 opacity-0 p-0'}
        `}
      >
        <div 
            ref={scrollRef}
            className="overflow-y-auto space-y-3 font-mono text-xs pr-2"
        >
            {isInitializing && (
                 <div className="flex justify-start">
                    <div className="bg-[#E60023]/10 text-[#E60023] p-2 border-l-2 border-[#E60023] animate-pulse">
                        INITIALIZING SYSTEM...
                    </div>
                </div>
            )}
            {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div 
                        className={`
                            max-w-[85%] p-2 rounded-sm
                            ${msg.role === 'user' 
                                ? 'bg-[#E60023]/20 text-white text-right border-r-2 border-[#E60023]' 
                                : 'bg-[#E60023]/10 text-[#E60023] text-left border-l-2 border-[#E60023]'
                            }
                        `}
                    >
                        {msg.text}
                    </div>
                </div>
            ))}
            {isLoading && (
                <div className="flex justify-start">
                    <div className="bg-[#E60023]/10 text-[#E60023] p-2 border-l-2 border-[#E60023] animate-pulse">
                        PROCESSING...
                    </div>
                </div>
            )}
        </div>
      </div>

      {isFiltered && (
        <div 
            onClick={onReset}
            className="mb-1 text-[10px] font-mono text-[#E60023] tracking-widest cursor-pointer hover:underline opacity-70 hover:opacity-100 transition-opacity bg-black/50 px-2 py-1"
        >
            [ FILTER ACTIVE: CLICK TO RESET ]
        </div>
      )}

      {/* Input Form */}
      <form 
        onSubmit={handleSubmit}
        className="relative flex items-center w-full group"
      >
        <div className={`
            absolute inset-0 border border-[#E60023] bg-white/90 backdrop-blur-md
            ${isFocused ? 'opacity-100 shadow-[0_0_20px_rgba(230,0,35,0.3)]' : 'opacity-80'}
            transition-all duration-300
        `}/>
        
        {/* Decorative Corner Markers */}
        <div className="absolute -top-[1px] -left-[1px] w-2 h-2 border-t border-l border-[#E60023]" />
        <div className="absolute -bottom-[1px] -right-[1px] w-2 h-2 border-b border-r border-[#E60023]" />

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={() => setIsFocused(true)}
          // onBlur={() => setIsFocused(false)} // Keep open if needed or handle click outside
          placeholder={isLoading ? "PROCESSING..." : "ASK AI CURATOR..."}
          disabled={isLoading}
          className="
            relative z-10 w-full bg-transparent border-none outline-none 
            px-4 py-3 text-sm font-mono text-[#E60023] placeholder-[#E60023]/40
            tracking-wider uppercase disabled:opacity-50
          "
        />
        
        <button 
          type="submit"
          disabled={isLoading}
          className="relative z-10 px-4 py-3 text-[#E60023] hover:bg-[#E60023]/10 transition-colors disabled:opacity-50"
        >
          {isLoading ? (
             <div className="w-4 h-4 border-2 border-[#E60023] border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="square"/>
            </svg>
          )}
        </button>
      </form>

      {/* Status Line */}
      <div className="text-[9px] font-mono text-[#E60023]/60 tracking-widest text-right w-full">
         GEMINI_CORE_V2.5 // ONLINE
      </div>
    </div>
  );
};

export default AIChat;