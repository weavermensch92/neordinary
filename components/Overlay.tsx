import React from 'react';
import { Menu } from 'lucide-react';

interface OverlayProps {
  onNavigate?: (index: number) => void;
  activeSectionIndex?: number;
}

const NAV_ITEMS = [
  { id: 0, label: 'CORE', index: '00' },
  { id: 1, label: 'ASSETS', index: '01' },
  { id: 2, label: 'EVAL', index: '02' },
  { id: 3, label: 'DEPLOY', index: '03' },
  { id: 4, label: 'BRIDGE', index: '04' },
  { id: 5, label: 'PROPOSAL', index: '05' }
];

export const Overlay: React.FC<OverlayProps> = ({ onNavigate, activeSectionIndex = 0 }) => {
  return (
    <div className="w-full h-full flex flex-col justify-between p-6 md:p-10 text-white font-sans pointer-events-none max-w-[2400px] mx-auto">
      {/* Top Bar */}
      <header className="flex justify-between items-stretch z-20 pointer-events-auto border-b-2 border-white/20 pb-8 backdrop-blur-sm bg-black/5">

        {/* Left: Logo & Meta Area */}
        <div
          className="flex items-start gap-8 cursor-pointer group"
          onClick={() => onNavigate?.(0)}
        >
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase leading-none group-hover:text-accent transition-colors duration-300">
              NE(O)<span className="text-accent group-hover:text-white transition-colors duration-300">RDINARY</span>
            </h1>
            <div className="flex items-center gap-3">
              <span className="text-[10px] tracking-[0.3em] uppercase text-white/40 font-black">
                SYS.VER 2.1 // AIOPS
              </span>
              <div className="w-2 h-2 bg-green-500 animate-pulse rounded-full" />
              <span className="text-[9px] tracking-[0.2em] text-green-500 font-bold uppercase">OPERATIONAL</span>
            </div>
          </div>

          <div className="hidden lg:flex flex-col border-l border-white/10 pl-8 pointer-events-none opacity-40">
            <span className="text-[10px] font-black tracking-widest uppercase mb-1">DATA PIPELINE</span>
            <span className="text-[9px] font-mono tracking-tighter">SECURE.ENCRYPTED.FLUID</span>
          </div>
        </div>

        {/* Center: Stage Indicator */}
        <div className="hidden xl:flex items-center justify-center border-x border-white/10 px-12 pointer-events-none">
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-black text-white/30 tracking-[0.5em] uppercase mb-2">CURRENT STAGE</span>
            <div className="flex items-center gap-4">
              <span className="text-2xl font-black text-accent tracking-tighter">0{activeSectionIndex + 1}</span>
              <div className="w-8 h-[2px] bg-white/10" />
              <span className="text-2xl font-black text-white/20 tracking-tighter">06</span>
            </div>
          </div>
        </div>

        {/* Right: Navigation Grid */}
        <nav className="hidden md:flex items-center gap-1 xl:gap-2">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate?.(item.id)}
              className={`
                flex flex-col items-start px-6 py-2 border-r border-white/5 transition-all duration-300 
                group hover:bg-white hover:text-black relative overflow-hidden
                ${activeSectionIndex === item.id ? 'bg-accent/10 border-b-4 border-accent' : ''}
              `}
            >
              <span className={`text-[9px] font-black mb-1 transition-colors ${activeSectionIndex === item.id ? 'text-accent' : 'text-white/30 group-hover:text-black/40'}`}>
                {item.index}
              </span>
              <span className={`text-xs font-black tracking-widest uppercase transition-colors ${activeSectionIndex === item.id ? 'text-white' : 'text-white/70 group-hover:text-black'}`}>
                {item.label}
              </span>
              {activeSectionIndex === item.id && (
                <div className="absolute top-0 right-0 w-1 h-1 bg-accent" />
              )}
            </button>
          ))}
        </nav>
      </header>
    </div>
  );
};