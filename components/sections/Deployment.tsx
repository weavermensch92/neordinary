import React from 'react';
import { SectionLayout } from './SectionLayout';
import { ArrowDownRight } from 'lucide-react';

export const Deployment = ({ onNavigate, onTogglePause, isActive, isExiting, exitDirection }: { onNavigate?: (index: number) => void, onTogglePause?: (paused: boolean) => void, isActive?: boolean, isExiting?: boolean, exitDirection?: 'left' | 'right' }) => {
  return (
    <SectionLayout
      title="EVENT HIGHLIGHTS"
      subtitle="Large-Scale, High-Engagement AI Builder Events"
      index="03"
      isActive={isActive}
      isExiting={isExiting}
      exitDirection={exitDirection}
    >
      <div className="flex flex-col gap-16 w-full pb-32">
        <p className="text-2xl md:text-3xl font-black text-white/60 tracking-tighter uppercase max-w-4xl border-l-[12px] border-accent pl-8 py-4 bg-black stagger-item">
          Neordinary operates recurring large-scale events designed for real implementation and industry interaction.
        </p>

        {/* 1. AI Hackathons - Brutal Cut Block */}
        <div className="bg-white p-12 lg:p-16 border-l-[2rem] border-accent relative group overflow-hidden stagger-item">
          <div className="absolute top-0 right-0 w-[31.25rem] h-full bg-accent/10 pointer-events-none" style={{ clipPath: 'polygon(100% 0, 0% 100%, 100% 100%)' }}></div>

          <div className="relative z-10 w-full">
            <div className="flex flex-col xl:flex-row justify-between items-start gap-8 mb-16">
              <h3 className="text-6xl lg:text-8xl font-black text-black uppercase tracking-tighter leading-[0.85]">
                1. AI <span className="text-accent underline decoration-8 underline-offset-8">HACKATHONS</span>
              </h3>
              <div className="px-8 py-4 bg-black text-accent text-xl font-black tracking-[0.3em] uppercase border-4 border-black text-right">
                MAX 400+ PARTICIPANTS<br />
                <span className="text-white">MANDATORY AI USAGE</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 w-full border-t-[1rem] border-black pt-12 text-black mt-8">
              <ul className="flex flex-col gap-4 font-black uppercase text-sm tracking-widest text-black/70">
                <li className="flex items-start gap-3"><div className="w-3 h-3 bg-black mt-1 shrink-0"></div> Structured team-based development</li>
                <li className="flex items-start gap-3"><div className="w-3 h-3 bg-black mt-1 shrink-0"></div> AI model integration required</li>
                <li className="flex items-start gap-3"><div className="w-3 h-3 bg-black mt-1 shrink-0"></div> MVP prototype delivery within days</li>
                <li className="flex items-start gap-3"><div className="w-3 h-3 bg-black mt-1 shrink-0"></div> Prompt usage tracking & feedback loops</li>
              </ul>
              <div className="bg-accent p-8 border-4 border-black shadow-[8px_8px_0_0_#000]">
                <h4 className="text-xl font-black mb-6 uppercase tracking-widest leading-none bg-black text-accent inline-block px-4 py-2">Recent Themes</h4>
                <ul className="flex flex-col gap-3 font-bold uppercase text-xs tracking-widest">
                  <li>— AI-powered youth problem solving</li>
                  <li>— OCR-based financial automation</li>
                  <li>— Prompt curation engines</li>
                  <li>— Agent-based service prototypes</li>
                </ul>
              </div>
              <div className="border-l-8 border-black pl-6">
                <h4 className="text-xl font-black mb-6 uppercase tracking-widest leading-none text-black/50">Winning Teams Demo</h4>
                <ul className="flex flex-col gap-4 font-black uppercase text-sm tracking-widest">
                  <li>Fully functional MVPs</li>
                  <li>Production-ready API integration</li>
                  <li>Real deployment potential</li>
                </ul>
              </div>
              <div className="border-l-8 border-accent pl-6">
                <h4 className="text-xl font-black mb-6 uppercase tracking-widest leading-none text-accent">Environment Creates</h4>
                <ul className="flex flex-col gap-4 font-black uppercase text-sm tracking-widest">
                  <li>Authentic AI implementation scenarios</li>
                  <li>Diverse domain experimentation (Fintech, Healthcare, Social, Productivity)</li>
                  <li>Structured product validation</li>
                </ul>
              </div>
            </div>

            <button className="mt-16 bg-black text-white px-8 py-6 flex justify-between items-center w-full max-w-2xl hover:bg-accent hover:text-black transition-colors border-4 border-black group/btn relative z-10 shadow-[8px_8px_0_0_#FF1F1F]">
              <span className="text-xl font-black tracking-[0.3em] uppercase">VIEW HACKATHON GALLERY & CASE REPORTS</span>
              <ArrowDownRight size={32} className="group-hover/btn:translate-y-2 group-hover/btn:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>

        {/* 2. Demo Day Section - Brutalist Dark Panel */}
        <div className="bg-[#111] p-12 lg:p-16 border-t-[2rem] border-white relative overflow-hidden group stagger-item">
          <div className="absolute top-12 right-12 text-white/[0.03] text-[16rem] font-black leading-[0.7] pointer-events-none select-none text-right z-0">DEMO<br />DAY</div>

          <div className="relative z-10 w-full">
            <div className="flex flex-col xl:flex-row justify-between items-end gap-12 border-b-[1rem] border-white pb-12 mb-16">
              <h3 className="text-6xl lg:text-8xl font-black text-white uppercase tracking-tighter leading-[0.85]">
                <span className="whitespace-nowrap">2. DEMO DAY</span><br />
                <span className="text-white/40 whitespace-nowrap">& FESTIVAL</span>
              </h3>
              <div className="flex flex-col items-start xl:items-end">
                <span className="text-[8rem] lg:text-[10rem] font-black text-white tracking-tighter leading-[0.7] relative">1,800<span className="text-accent">+</span></span>
                <span className="text-[1.25rem] bg-white text-black font-black uppercase tracking-[0.4em] px-4 py-2 mt-4 inline-block shadow-[8px_8px_0_0_#FF1F1F]">
                  Total Attendees <br /> (Seoul + Busan Combined)
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full text-white">
              <div className="flex flex-col">
                <h4 className="text-2xl font-black mb-8 uppercase tracking-widest text-accent border-l-8 border-accent pl-4">Brings Together</h4>
                <ul className="flex flex-col gap-4 font-black uppercase text-sm tracking-widest text-white/70">
                  <li className="flex items-center gap-4"><div className="w-2 h-2 bg-white"></div> University builders</li>
                  <li className="flex items-center gap-4"><div className="w-2 h-2 bg-white"></div> Startup founders</li>
                  <li className="flex items-center gap-4"><div className="w-2 h-2 bg-white"></div> IT enterprises</li>
                  <li className="flex items-center gap-4"><div className="w-2 h-2 bg-white"></div> Investors & VCs</li>
                  <li className="flex items-center gap-4"><div className="w-2 h-2 bg-white"></div> Public innovation institutions</li>
                </ul>
              </div>

              <div className="flex flex-col">
                <h4 className="text-2xl font-black mb-8 uppercase tracking-widest text-white border-l-8 border-white pl-4">What Happens On-Site</h4>
                <ul className="flex flex-col gap-4 font-black uppercase text-sm tracking-widest text-white/70">
                  <li className="flex items-center gap-4"><div className="w-2 h-2 bg-accent"></div> Live MVP demonstrations</li>
                  <li className="flex items-center gap-4"><div className="w-2 h-2 bg-accent"></div> Technical pitching sessions</li>
                  <li className="flex items-center gap-4"><div className="w-2 h-2 bg-accent"></div> Industry mentor panels</li>
                  <li className="flex items-center gap-4"><div className="w-2 h-2 bg-accent"></div> Enterprise booth exhibitions</li>
                  <li className="flex items-center gap-4"><div className="w-2 h-2 bg-accent"></div> Developer networking lounges</li>
                </ul>
              </div>

              <div className="flex flex-col gap-12">
                <div>
                  <h4 className="text-2xl font-black mb-6 uppercase tracking-widest text-white/50 border-l-8 border-white/50 pl-4">Speaker & Industry</h4>
                  <ul className="flex flex-col gap-2 font-bold uppercase text-xs tracking-widest text-white/60">
                    <li>— CTOs from leading Korean tech firms</li>
                    <li>— Engineers from major platform companies</li>
                    <li>— Product leaders from fintech & mobility</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-2xl font-black mb-6 uppercase tracking-widest text-white/50 border-l-8 border-white/50 pl-4">Media Coverage</h4>
                  <ul className="flex flex-col gap-2 font-bold uppercase text-xs tracking-widest text-white/60">
                    <li>— AI-first student product launches</li>
                    <li>— Cross-regional IT talent exchange</li>
                    <li>— Emerging AI-native developer culture</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Brutalist Statement & Button */}
            <div className="mt-20 w-full bg-accent text-black p-12 border-8 border-white flex flex-col md:flex-row justify-between items-center xl:items-end gap-12 shadow-[16px_16px_0_0_#FFF]">
              <div className="text-4xl lg:text-5xl font-black uppercase tracking-tighter leading-[0.9]">
                These events are not exhibitions.<br />
                <span className="text-white drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">They are launch stages for real technical output.</span>
              </div>
              <button className="bg-black text-white px-8 py-6 flex items-center justify-between min-w-[21.25rem] hover:bg-white hover:text-black transition-colors border-4 border-black group/btn shrink-0">
                <span className="text-lg font-black tracking-widest uppercase">View Event Recap<br />& Media Coverage</span>
                <ArrowDownRight size={32} className="group-hover/btn:translate-y-2 group-hover/btn:translate-x-2 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* 3. Global Collaboration Hackathons - Brutalist Grid Box */}
        <div className="w-full bg-black p-12 lg:p-16 border-8 border-accent relative overflow-hidden text-white flex flex-col gap-10 stagger-item">
          
          {/* Header Area - Stacked & Side-by-side Layout */}
          <div className="flex flex-col md:flex-row items-start md:items-end gap-x-12 relative z-10">
            <div className="flex flex-col">
              <h3 className="text-7xl lg:text-8xl font-black text-white uppercase tracking-tighter leading-[0.8]">
                GLOBAL
              </h3>
              <h3 className="text-7xl lg:text-8xl font-black text-accent uppercase tracking-tighter leading-[0.8] underline decoration-[1rem] underline-offset-[0.5rem]">
                COLLAB
              </h3>
            </div>
            <h3 className="text-7xl lg:text-8xl font-black text-white uppercase tracking-tighter leading-[0.8] mt-4 md:mt-0">
              HACKATHONS
            </h3>
            {/* Corner Accent in Image 2 */}
            <div className="absolute top-0 right-0 w-4 h-24 bg-white/10 hidden xl:block"></div>
          </div>

          {/* Thick Divider Bar */}
          <div className="w-full h-10 bg-[#333] -mx-16 px-16 relative z-0"></div>

          <div className="flex flex-col xl:flex-row gap-16 items-stretch relative z-10">
            {/* Uncle Sam Poster Box */}
            <div className="bg-white relative w-full xl:w-[400px] aspect-square overflow-hidden flex flex-col stagger-item border-r-[12px] border-b-[12px] border-white/10">
              {/* Text Area - Top Right */}
              <div className="absolute top-8 right-8 z-20">
                <h4 className="text-4xl lg:text-5xl font-black text-black leading-[0.8] text-right tracking-tighter uppercase italic">
                  I WANT<br />
                  <span className="text-6xl lg:text-8xl block mt-2 mb-1">CLAUDE</span>
                  YOU!
                </h4>
              </div>

              {/* Image Area - Bottom-aligned without padding */}
              <div className="absolute bottom-0 left-0 w-full h-full z-10 flex items-end">
                <img 
                  src="/unclesam.svg" 
                  alt="Uncle Sam" 
                  className="w-[110%] h-auto object-contain object-bottom -ml-[5%] -mb-2" 
                />
              </div>
            </div>

            {/* Lists Area */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-12 border-l-0 lg:border-l-[1rem] border-white/10 lg:pl-12">
              <div className="flex flex-col gap-8">
                <div className="bg-white text-black px-4 py-2 text-sm font-black uppercase tracking-widest inline-block w-fit">NEORDINARY HAS COLLABORATED WITH:</div>
                <ul className="flex flex-col gap-6 text-sm font-black text-white/80 uppercase tracking-widest">
                  <li className="flex items-start gap-4"><div className="w-4 h-4 bg-accent mt-1 shrink-0"></div> International AI platforms</li>
                  <li className="flex items-start gap-4"><div className="w-4 h-4 bg-accent mt-1 shrink-0"></div> Global digital nomad communities</li>
                  <li className="flex items-start gap-4"><div className="w-4 h-4 bg-accent mt-1 shrink-0"></div> Cross-border development networks</li>
                </ul>
              </div>
              <div className="flex flex-col gap-8">
                <div className="bg-accent text-black px-4 py-2 text-sm font-black uppercase tracking-widest inline-block w-fit">THESE COLLABORATIONS INVOLVED:</div>
                <ul className="flex flex-col gap-4 text-sm font-black text-accent/80 uppercase tracking-widest">
                  <li className="flex items-start gap-4"><div className="w-4 h-4 border-4 border-accent mt-1 shrink-0"></div> Multinational participants</li>
                  <li className="flex items-start gap-4"><div className="w-4 h-4 border-4 border-accent mt-1 shrink-0"></div> AI model–mandatory development rules</li>
                  <li className="flex items-start gap-4"><div className="w-4 h-4 border-4 border-accent mt-1 shrink-0"></div> Structured API-based product creation</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Spacer for bottom bar overlap protection */}
          <div className="h-24"></div>

          <div className="absolute bottom-0 left-0 w-full bg-white text-black px-8 py-4 font-black uppercase tracking-widest text-center md:text-left text-sm lg:text-lg border-t-8 border-accent shadow-[0_-16px_50px_rgba(255,31,31,0.2)]">
            THIS DEMONSTRATES OPERATIONAL READINESS FOR INTERNATIONAL AI API INTEGRATION ENVIRONMENTS.
          </div>
        </div>

      </div>
    </SectionLayout>
  );
};