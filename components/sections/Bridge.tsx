import React from 'react';
import { SectionLayout } from './SectionLayout';
import { ArrowUpRight, Terminal, Cpu } from 'lucide-react';

export const Bridge = ({ onNavigate, onTogglePause, isActive, isExiting, exitDirection }: { onNavigate?: (index: number) => void, onTogglePause?: (paused: boolean) => void, isActive?: boolean, isExiting?: boolean, exitDirection?: 'left' | 'right' }) => {
  return (
    <SectionLayout
      id="bridge-section"
      title="AI ADOPTION BRIDGE"
      subtitle="Connecting Global Models to Institutional Implementation"
      index="04"
      isActive={isActive}
      isExiting={isExiting}
      exitDirection={exitDirection}
    >
      <div className="flex flex-col gap-16 max-w-[1600px] w-full">
        <div className="bg-[#111] border-8 border-white p-12 lg:p-16 relative stagger-item">
          <h3 className="text-4xl lg:text-5xl font-black text-white uppercase tracking-tighter leading-[0.9] max-w-5xl">
            NEORDINARY PARTICIPANTS <span className="text-accent">GO BEYOND BASIC AI USAGE</span>. THEY INTEGRATE AI NATIVELY INTO THEIR DEVELOPMENT WORKFLOWS AND PRODUCT ARCHITECTURES.
          </h3>
          <div className="absolute bottom-12 right-12 flex gap-4 hidden md:flex">
            <div className="w-16 h-4 bg-white"></div>
            <div className="w-32 h-4 bg-accent"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 w-full">
          {/* Capability 1: Tooling */}
          <div className="bg-white p-12 lg:p-16 border-t-[32px] border-accent relative group text-black flex flex-col justify-between stagger-item">
            <div className="flex items-center gap-8 mb-16 border-b-8 border-black pb-8">
              <Terminal size={64} className="text-black group-hover:text-accent transition-colors" />
              <h4 className="text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-[0.8] max-w-[12ch]">TECHNICAL TOOLING</h4>
            </div>

            <ul className="grid grid-cols-1 gap-0 text-xl lg:text-2xl font-black uppercase tracking-tighter">
              {['AI Coding Assistants', 'Custom Rules (.mdc)', 'Automated Pipelines', 'Agent-based Workflows'].map((text, i) => (
                <li key={i} className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-12 py-8 border-b-4 border-black/20 hover:border-black transition-colors group/item">
                  <span className="text-accent text-5xl font-black leading-none group-hover/item:text-black transition-colors">0{i + 1}</span>
                  <span className="leading-[0.9]">{text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Capability 2: Initiatives */}
          <div className="bg-[#050505] p-12 lg:p-16 border-[12px] border-white relative group text-white flex flex-col justify-between hover:bg-white hover:text-black transition-all duration-700 stagger-item">
            <div className="flex items-center gap-8 mb-16 border-b-8 border-white group-hover:border-black pb-8 transition-colors">
              <Cpu size={64} className="text-white group-hover:text-black transition-colors" />
              <h4 className="text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-[0.8] max-w-[12ch]">TECHNICAL INITIATIVES</h4>
            </div>

            <ul className="grid grid-cols-1 gap-0 text-xl lg:text-2xl font-black uppercase tracking-tighter">
              {['LLM-powered Swagger Auth', 'AI-driven Frameworks', 'Optimization Experiments', 'Stress-testing APIs'].map((text, i) => (
                <li key={i} className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-12 py-8 border-b-4 border-white/20 group-hover:border-black/20 hover:!border-black transition-colors group/item">
                  <span className="text-white group-hover:text-black text-5xl font-black leading-none group-hover/item:text-accent transition-colors">0{i + 1}</span>
                  <span className="leading-[0.9]">{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* High-Impact Solid Bottom CTA */}
        <div className="bg-accent p-12 lg:p-20 text-black border-[16px] border-black shadow-[-30px_30px_0_0_#fff] relative overflow-hidden group hover:-translate-y-4 hover:shadow-[-40px_40px_0_0_#fff] transition-all duration-500 cursor-pointer mt-12 w-[calc(100%-30px)] lg:w-[calc(100%-40px)] ml-auto stagger-item">
          <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-16 relative z-10 w-full">
            <div className="flex flex-col">
              <h5 className="text-[5rem] lg:text-[7rem] font-black uppercase tracking-tighter leading-[0.8] mb-8 break-words group-hover:text-white transition-colors">
                IMPLEMENTATION<br />READY
              </h5>
              <p className="text-xl lg:text-2xl text-black font-black uppercase tracking-[0.4em] leading-[1.2] max-w-4xl border-l-[12px] border-black pl-8 bg-white/20 py-4 group-hover:border-white group-hover:text-white transition-colors">
                Technically literate community capable of stress-testing modern AI APIs at scale.
              </p>
            </div>

            <div className="flex flex-col items-end gap-6 self-end sm:self-auto shrink-0">
              <div className="text-2xl font-black uppercase tracking-[0.4em] border-b-8 border-black pb-2 group-hover:text-white group-hover:border-white transition-colors">
                READ ARTICLES
              </div>
              <ArrowUpRight size={100} className="group-hover:rotate-45 group-hover:text-white transition-all duration-500" />
            </div>
          </div>

          {/* Caution tape design element */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-black opacity-10 blur-xl pointer-events-none group-hover:opacity-20 transition-opacity"></div>
        </div>
      </div>
    </SectionLayout>
  );
};