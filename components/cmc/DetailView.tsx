import React from 'react';
import { SystemLog } from './types';

interface DetailViewProps {
  data: SystemLog | null;
  onPause: (e: React.MouseEvent) => void;
  isLocked: boolean;
  language?: 'en' | 'ko';
}

const DetailView: React.FC<DetailViewProps> = ({ data, onPause, isLocked, language = 'ko' }) => {
  // Don't show detail view if no data or if it's a separator
  if (!data || data.type === 'SEPARATOR') return null;

  return (
    <div 
      onClick={onPause}
      data-cursor="detail"
      className={`
        absolute 
        right-8 md:right-16 lg:right-32 xl:right-48
        ${isLocked ? 'top-[4%]' : 'top-[15%]'}
        w-[440px] 
        bg-white/95 backdrop-blur-xl border border-[#E60023] shadow-2xl
        p-8 flex flex-col z-[2000]
        transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] origin-top-right
        hover:shadow-3xl
        ${isLocked ? 'max-h-[96vh] cursor-auto' : 'max-h-[400px] cursor-pointer overflow-hidden'}
      `}
      style={{
        transform: 'translateZ(0px)', 
      }}
    >
        {/* Decorative Header Number */}
        <div className="absolute top-2 right-4 text-[80px] font-bold text-[#E60023]/5 leading-none select-none -z-10 font-mono">
          {data.cohort?.replace(/[^0-9]/g, '').padStart(2,'0') || '00'}
        </div>

        {/* Compact Header (Always Visible) */}
        <div className="flex justify-between items-end mb-6 border-b-2 border-[#E60023] pb-4 flex-shrink-0">
            <div>
                {/* Keywords (kicker) */}
                <div className="text-xs font-mono text-[#E60023]/60 mb-1 tracking-widest uppercase">
                  {language === 'en' ? (data.keywordsEn || data.keywords) : data.keywords}
                </div>
                {/* Project Name (Main Title) */}
                <h2 className="text-4xl font-bold text-[#E60023] tracking-tighter uppercase leading-none break-words max-w-[300px]">
                  {language === 'en' ? (data.moduleEn || data.module) : data.module}
                </h2>
            </div>
            <div className="text-right">
                 <div className="text-3xl font-light text-[#E60023] font-mono">
                   {language === 'en' ? (data.cohortEn || data.cohort) : data.cohort}
                 </div>
            </div>
        </div>

        {/* Scrollable Body Content */}
        <div className={`flex-1 flex flex-col ${isLocked ? 'overflow-y-auto' : 'overflow-hidden'}`}>
             
             {/* Service Description (Always Visible now) */}
             <div className="mb-6 flex-shrink-0">
                 <div className="text-[10px] font-bold text-[#E60023]/60 uppercase mb-2 tracking-widest">Service Description</div>
                 <p className="text-lg text-[#E60023] leading-snug font-sans font-medium border-l-4 border-[#E60023] pl-4 py-2">
                    {language === 'en' ? (data.messageEn || data.message) : data.message}
                 </p>
                 <div className="mt-2 text-xs text-[#E60023]/60 font-mono">
                    T: {data.timestamp} | ID: {data.id}
                 </div>
             </div>
             
             {/* Expandable Content (Image & Links - Hidden when not locked) */}
             <div className={`transition-all duration-500 ease-in-out ${isLocked ? 'opacity-100 max-h-[2000px]' : 'opacity-0 max-h-0'}`}>
                {/* Project Visuals (Replaces CPU/Mem bars) */}
                <div 
                  className="relative mb-4 w-full bg-gray-100 border border-[#E60023]/20 overflow-hidden rounded-sm group"
                  data-cursor="image"
                >
                    {/* Award Icon Badge */}
                    {data.imageAward && (
                      <div className="absolute top-0 right-4 w-12 z-10 drop-shadow-md">
                        <img src={data.imageAward} alt="Award" className="w-full h-auto object-contain" />
                      </div>
                    )}
                    
                    {/* Main Project Image - Aspect Ratio Fixed */}
                    <div className="aspect-[422.67/317.79] w-full relative">
                      {data.imageMain ? (
                        <img 
                          src={data.imageMain} 
                          alt={data.module} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200 text-[#E60023]/30 font-mono">
                          NO VISUAL DATA
                        </div>
                      )}
                    </div>
                </div>

                {/* Store Links (Replaces System Kernel Dump) */}
                <div className="pt-2 mt-auto">
                    <div className="flex gap-3">
                      {data.linkIOS && (
                        <a 
                          href={data.linkIOS} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          data-cursor="store"
                          className="flex-1 bg-[#E60023] text-white py-3 px-4 text-center text-sm font-bold tracking-wide hover:bg-[#c5001e] transition-colors"
                        >
                          APP STORE
                        </a>
                      )}
                      {data.linkAndroid && (
                        <a 
                          href={data.linkAndroid} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          data-cursor="store"
                          className="flex-1 border border-[#E60023] text-[#E60023] py-3 px-4 text-center text-sm font-bold tracking-wide hover:bg-[#E60023]/5 transition-colors"
                        >
                          PLAY STORE
                        </a>
                      )}
                      {!data.linkIOS && !data.linkAndroid && (
                        <div className="text-xs text-[#E60023]/40 font-mono py-2">
                          LINK_UNAVAILABLE
                        </div>
                      )}
                    </div>
                </div>
             </div>
        </div>
        
        {/* Connector Anchor */}
        <div 
            id="detail-connector" 
            className="absolute top-[40px] left-[-6px] w-3 h-3 bg-[#E60023] rounded-full"
        />
    </div>
  );
};

export default DetailView;