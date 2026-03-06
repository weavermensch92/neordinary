import React from 'react';
import { AlertTriangle } from 'lucide-react';

const ErrorStack: React.FC = () => {
  // Create an array for the stack visual
  const stackLayers = Array.from({ length: 6 });

  return (
    <div className="relative w-full h-64 md:h-full flex items-center justify-center p-8 perspective-[1000px]">
      <div className="relative w-64 h-48">
        {stackLayers.map((_, index) => {
          const isTop = index === stackLayers.length - 1;
          // Calculate offset to create the "staircase" look
          const offset = index * 12;
          const opacity = 0.2 + (index * 0.15);

          return (
            <div
              key={index}
              className={`absolute top-0 left-0 w-full h-full border border-zinc-800 bg-zinc-200 shadow-xl transition-all duration-500 ease-out hover:translate-x-2`}
              style={{
                transform: `translate(${offset}px, ${offset}px)`,
                opacity: isTop ? 1 : opacity,
                zIndex: index,
              }}
            >
              {/* Internal styling of the stacked panel */}
              <div className="h-full w-full relative overflow-hidden flex flex-col">
                <div className="bg-zinc-800 text-zinc-100 px-2 py-1 text-[9px] flex justify-between items-center">
                  <span>PANEL 028 B</span>
                  <div className="flex gap-1">
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                    <div className="w-1 h-1 bg-white rounded-full opacity-50"></div>
                  </div>
                </div>

                <div className="flex-1 p-4 relative">
                  {/* Background grid lines inside the panel */}
                  <div className="absolute inset-0"
                    style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px)', backgroundSize: '100% 4px' }}
                  />

                  {isTop && (
                    <div className="relative z-10 flex flex-col items-center justify-center h-full text-center space-y-2">
                      <AlertTriangle className="w-12 h-12 text-zinc-800 animate-pulse" strokeWidth={1} />
                      <h2 className="text-2xl font-bold tracking-widest text-zinc-900">ERROR</h2>
                      <div className="text-[10px] text-zinc-600 bg-zinc-300 px-2">LOG 4F55 (ENCRYPTED)</div>
                      <div className="text-[8px] leading-tight text-left w-full mt-4 font-mono opacity-60">
                        &gt; DUMP_CORE<br />
                        &gt; MEM_ALLOC_FAIL<br />
                        &gt; RETRY_COUNT: 99
                      </div>
                    </div>
                  )}

                  {!isTop && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-4xl font-bold text-black/10 -rotate-12">ERROR</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating disconnected lines/elements from the reference image */}
      <div className="absolute top-0 right-0 p-4 hidden md:block">
        <div className="border-l border-b border-black w-8 h-8 opacity-50"></div>
        <div className="text-[9px] mt-1 ml-2">LOG VXA</div>
      </div>
    </div>
  );
};

export default ErrorStack;