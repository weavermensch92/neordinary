import React from 'react';
import { SectionLayout } from './SectionLayout';
import { ArrowUpRight } from 'lucide-react';

export const Evaluation = ({ onNavigate, onTogglePause, isActive, isExiting, exitDirection }: { onNavigate?: (index: number) => void, onTogglePause?: (paused: boolean) => void, isActive?: boolean, isExiting?: boolean, exitDirection?: 'left' | 'right' }) => {
  return (
    <SectionLayout
      id="evaluation-section"
      title="TECHNICAL EVALUATION"
      subtitle="Precision Auditing & Model Performance Verification"
      index="02"
      isActive={isActive}
      isExiting={isExiting}
      exitDirection={exitDirection}
    >
      <div className="flex flex-col gap-12 w-full h-full">

        {/* Top Grid: UMC and CMC */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 w-full flex-grow">

          {/* UMC Section - Brutalist White Block */}
          <div className="bg-white text-black p-12 lg:p-16 relative min-h-[37.5rem] flex flex-col justify-between group overflow-hidden stagger-item">
            <div className="absolute top-0 right-0 w-2/3 h-full bg-black/5 pointer-events-none" style={{ clipPath: 'polygon(100% 0, 0% 100%, 100% 100%)' }}></div>
            <div className="absolute top-8 right-8 text-black/5 text-[10rem] font-black leading-none pointer-events-none select-none transition-all duration-700 group-hover:text-black/60 group-hover:scale-110 group-hover:z-20 group-hover:opacity-100 opacity-100">UMC</div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-16 transition-all duration-700 group-hover:blur-xl group-hover:opacity-20 group-hover:scale-95">
                <h3 className="text-5xl lg:text-7xl font-black text-black uppercase tracking-tighter leading-[0.85]">
                  NATIONAL<br />
                  UNIVERSITY<br />
                  IT ALLIANCE
                </h3>
                <div className="px-4 py-2 bg-black text-white text-sm font-black tracking-widest uppercase border-4 border-black">
                  UMC
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-12 gap-y-16">
                <div className="border-t-[12px] border-black pt-6">
                  <div className="text-6xl lg:text-7xl font-black text-black tracking-tighter leading-[0.8] mb-2">1,000</div>
                  <div className="text-xs font-black text-black/60 uppercase tracking-[0.3em] leading-normal">Up to 1,000 participants<br />per cohort</div>
                </div>
                <div className="border-t-[12px] border-black pt-6">
                  <div className="text-6xl lg:text-7xl font-black text-black tracking-tighter leading-[0.8] mb-2">6<span className="text-accent text-5xl">mo</span></div>
                  <div className="text-xs font-black text-black/60 uppercase tracking-[0.3em] leading-normal">6-month structured program<br />(Study → MVP)</div>
                </div>
                <div className="border-t-[12px] border-black pt-6">
                  <div className="text-6xl lg:text-7xl font-black text-black tracking-tighter leading-[0.8] mb-2">~70</div>
                  <div className="text-xs font-black text-black/60 uppercase tracking-[0.3em] leading-normal">~70 projects<br />per cohort</div>
                </div>
                <div className="border-t-[12px] border-black pt-6">
                  <div className="text-6xl lg:text-7xl font-black text-black tracking-tighter leading-[0.8] mb-2">55<span className="text-accent">+</span></div>
                  <div className="text-xs font-black text-black/60 uppercase tracking-[0.3em] leading-normal">Active in 55+<br />university clubs</div>
                </div>
              </div>
            </div>

            <button
              onClick={() => window.dispatchEvent(new CustomEvent('trigger-umc'))}
              className="mt-20 bg-accent border-[0.75rem] border-black py-8 px-10 flex items-center justify-between md:col-span-2 group/stat hover:bg-white transition-colors duration-300 relative z-10 w-full text-left"
            >
              <span className="text-2xl font-black tracking-[0.3em] uppercase">VIEW ALLIANCE DETAILS</span>
              <ArrowUpRight size={48} className="group-hover/stat:translate-x-4 group-hover/stat:-translate-y-4 transition-transform" />
            </button>
          </div>

          {/* CMC Section - Brutalist Accent Block */}
          <div className="bg-accent p-12 lg:p-16 flex flex-col justify-between relative group text-black stagger-item">
            <div className="absolute top-8 right-8 text-black/10 text-[10rem] font-black leading-none pointer-events-none select-none transition-all duration-700 group-hover:text-black/60 group-hover:scale-110 group-hover:z-20 group-hover:opacity-100 opacity-100">CMC</div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-16 transition-all duration-700 group-hover:blur-xl group-hover:opacity-20 group-hover:scale-95">
                <h3 className="text-5xl lg:text-7xl font-black text-black uppercase tracking-tighter leading-[0.85]">
                  PRODUCT BUILDER<br />COLLECTIVE
                </h3>
                <div className="px-4 py-2 bg-white text-black text-sm font-black tracking-widest uppercase border-4 border-white">
                  CMC
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-12 gap-y-16">
                <div className="border-t-[12px] border-black pt-6">
                  <div className="text-6xl lg:text-7xl font-black text-black tracking-tighter leading-[0.8] mb-2">17</div>
                  <div className="text-xs font-black text-black/60 uppercase tracking-[0.3em] leading-normal">17 active cohorts</div>
                </div>
                <div className="border-t-[12px] border-black pt-6">
                  <div className="text-6xl lg:text-7xl font-black text-black tracking-tighter leading-[0.8] mb-2">40<span className="text-white">–</span>55</div>
                  <div className="text-xs font-black text-black/60 uppercase tracking-[0.3em] leading-normal">40–55 members per cohort</div>
                </div>
                <div className="border-t-[12px] border-black pt-6">
                  <div className="text-6xl lg:text-7xl font-black text-white tracking-tighter leading-[0.8] mb-2">MVP <span className="text-black text-5xl">GOALS</span></div>
                  <div className="text-xs font-black text-black/60 uppercase tracking-[0.3em] leading-normal">Real-user MVPs with<br />monetization goals</div>
                </div>
                <div className="border-t-[12px] border-black pt-6">
                  <div className="text-6xl lg:text-7xl font-black text-white tracking-tighter leading-[0.8] mb-2">GOV <span className="text-black text-5xl">BACKED</span></div>
                  <div className="text-xs font-black text-black/60 uppercase tracking-[0.3em] leading-normal">Government-backed<br />startup recognitions</div>
                </div>
              </div>
            </div>

            <button
              onClick={() => window.dispatchEvent(new CustomEvent('trigger-cmc'))}
              className="mt-20 bg-accent border-[0.75rem] border-black py-8 px-10 flex items-center justify-between group/stat hover:bg-white hover:text-black transition-colors duration-300 relative z-10 w-full text-left"
            >
              <span className="text-2xl font-black tracking-[0.3em] uppercase">VIEW COLLECTIVE PORTFOLIO</span>
              <ArrowUpRight size={48} className="group-hover/stat:translate-x-4 group-hover/stat:-translate-y-4 transition-transform" />
            </button>
          </div>

        </div>

        {/* Footer Statement - Brutalist Dark Panel */}
        <div className="w-full bg-black border-[0.75rem] border-white/10 p-12 lg:p-16 relative overflow-hidden group hover:border-accent transition-colors duration-500 stagger-item">
          <div className="absolute inset-0 z-0">
            <div className="w-full h-full border-[24px] border-black group-hover:scale-95 transition-transform duration-700"></div>
          </div>
          <div className="relative z-10 flex flex-col items-center">
            <h2 className="text-4xl md:text-6xl lg:text-[7rem] font-black text-white group-hover:text-black tracking-tighter uppercase leading-[0.85] mb-6">
              THIS IS NOT THEORY-BASED EDUCATION.
            </h2>
            <div className="w-32 h-4 bg-accent group-hover:bg-white mb-6 transition-colors"></div>
            <h2 className="text-4xl md:text-6xl lg:text-[7rem] font-black text-accent group-hover:text-white tracking-tighter uppercase leading-[0.85]">
              IT IS PRODUCT-DRIVEN EXECUTION.
            </h2>
          </div>
        </div>

      </div>
    </SectionLayout>
  );
};