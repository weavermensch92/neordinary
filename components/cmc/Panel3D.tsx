import React from 'react';
import { SystemLog } from './types';

interface Panel3DProps {
  data: SystemLog;
  index: number;
  isSelected: boolean;
  onPanelClick: (e: React.MouseEvent, id: string) => void;
  offsetZ: number;
  offsetX: number;
  offsetY: number;
  opacity: number;
  blur: number;
  isFilteredOut?: boolean; // New prop for filtered state
  language?: 'en' | 'ko';
}

const Panel3D: React.FC<Panel3DProps> = ({ 
  data, 
  index, 
  isSelected, 
  onPanelClick, 
  offsetZ, 
  offsetX, 
  offsetY,
  opacity,
  blur,
  isFilteredOut = false,
  language = 'ko'
}) => {
  // SPECIAL RENDER FOR SEPARATOR (RED FOLDER)
  if (data.type === 'SEPARATOR') {
    // If filtered out, hide separators completely to clean up view
    if (isFilteredOut) return null;

    return (
      <div
        className={`
          absolute left-1/2 top-1/2 w-80 h-48
          transition-all duration-[1200ms] ease-[cubic-bezier(0.19,1,0.22,1)]
          flex flex-col items-center justify-center shadow-2xl select-none
          group border border-white/20
          bg-[#E60023] text-white
        `}
        style={{
          transform: `
            translate3d(-50%, -50%, 0) 
            translateX(${offsetX}px) 
            translateY(${offsetY}px) 
            translateZ(${offsetZ}px) 
            rotateZ(-35deg) 
            rotateX(-55deg)
          `, 
          opacity: opacity,
          zIndex: Math.floor(offsetZ + 1000), 
          filter: `blur(${blur}px)`,
        }}
      >
        {/* Decorative Folder Tab */}
        <div className="absolute -top-6 left-0 w-24 h-6 bg-[#E60023] flex items-center justify-center">
             <div className="w-full h-full bg-black/10 absolute top-0 left-0" />
             <span className="relative font-mono text-[10px] tracking-widest font-bold">ARCHIVE</span>
        </div>

        <div className="text-6xl font-bold tracking-tighter mix-blend-overlay opacity-50">
           {data.cohort?.replace(/[^0-9]/g, '')}
        </div>
        <div className="text-2xl font-bold tracking-[0.2em] uppercase mt-2 border-t border-white/40 pt-2 font-mono">
           {language === 'en' ? (data.cohortEn || data.cohort) : data.cohort}
        </div>
        <div className="text-[10px] font-mono opacity-80 mt-1 tracking-widest">
           {language === 'en' ? 'GENERATION START' : '기수 시작'}
        </div>
        
        {/* Connector Anchor (Invisible but present for logic consistency) */}
        <div id={`panel-connector-${data.id}`} className="absolute top-1/2 right-0 w-1 h-1" />
      </div>
    );
  }

  // STANDARD PROJECT PANEL
  
  // Dynamic Styles based on State
  let containerClasses = "bg-white/70 border-[#E60023]/30 hover:bg-white/90 hover:border-[#E60023]/60";
  let contentClasses = "";
  let pointerEvents = "cursor-pointer";

  if (isSelected) {
      containerClasses = "bg-white border-[#E60023] z-50";
  } else if (isFilteredOut) {
      // Filtered Out Style: Blends with background (#e0e0e0), grayscale, faint
      containerClasses = "bg-[#d6d6d6] border-gray-400/30 grayscale shadow-none"; 
      contentClasses = "opacity-40";
      pointerEvents = "pointer-events-none"; // Non-clickable
  }

  return (
    <div
      onClick={(e) => !isFilteredOut && onPanelClick(e, data.id)}
      data-cursor={isFilteredOut ? undefined : "panel"}
      className={`
        absolute left-1/2 top-1/2 w-80 h-48
        border
        transition-all duration-[1200ms] ease-[cubic-bezier(0.19,1,0.22,1)]
        flex flex-col p-5 shadow-lg select-none
        group
        ${containerClasses}
        ${pointerEvents}
      `}
      style={{
        transform: `
          translate3d(-50%, -50%, 0) 
          translateX(${offsetX}px) 
          translateY(${offsetY}px) 
          translateZ(${offsetZ}px) 
          rotateZ(-35deg) 
          rotateX(-55deg)
        `, 
        opacity: opacity,
        zIndex: Math.floor(offsetZ + 1000), 
        filter: `blur(${blur}px)`,
      }}
    >
      <div className={contentClasses}>
        {/* Top Bar */}
        <div className={`flex justify-between items-center mb-4 border-b pb-2 ${isFilteredOut ? 'border-gray-400/30' : 'border-[#E60023]/30'}`}>
            <span className={`text-[10px] font-bold tracking-[0.2em] font-mono ${isSelected ? 'text-[#E60023]' : (isFilteredOut ? 'text-gray-500' : 'text-[#E60023]/60')}`}>
            No. {(index + 1).toString().padStart(2, '0')}
            </span>
            <div className={`w-2 h-2 ${isSelected ? 'bg-[#E60023]' : (isFilteredOut ? 'bg-gray-400' : 'bg-[#E60023]/30')}`} />
        </div>

        {/* Main Info */}
        <div className="flex-1 flex flex-col justify-between h-28">
            <div>
            {/* Label is now Keywords */}
            <div className={`text-[10px] font-mono mb-1 tracking-widest uppercase truncate ${isFilteredOut ? 'text-gray-500' : 'text-[#E60023]/50'}`}>
                {language === 'en' ? (data.keywordsEn || data.keywords) : data.keywords}
            </div>
            {/* Main Content is now Project Name */}
            <div className={`text-3xl font-bold leading-none tracking-tight break-words ${isFilteredOut ? 'text-gray-600' : 'text-[#E60023]'}`}>
                {language === 'en' ? (data.moduleEn || data.module) : data.module}
            </div>
            </div>
            
            <div className="flex justify-between items-end">
            <div className={`font-mono text-[9px] ${isFilteredOut ? 'text-gray-400' : 'text-[#E60023]/50'}`}>{data.id}</div>
            <span className={`text-[9px] px-2 py-0.5 border font-mono ${
                data.status.includes('AWARD') 
                ? (isFilteredOut ? 'border-gray-400 text-gray-500 bg-gray-300' : 'border-[#E60023] text-white bg-[#E60023]') 
                : (isFilteredOut ? 'border-gray-400 text-gray-500' : 'border-[#E60023] text-[#E60023] bg-[#E60023]/5')
            }`}>
                {language === 'en' ? (data.cohortEn || data.cohort) : data.cohort}
            </span>
            </div>
        </div>
      </div>

      {/* High-tech Corners - Hide if filtered out */}
      {!isFilteredOut && (
        <>
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#E60023] opacity-20 group-hover:opacity-50 transition-opacity" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#E60023] opacity-20 group-hover:opacity-50 transition-opacity" />
        </>
      )}
      
      {/* Connector Anchor */}
      <div 
        id={`panel-connector-${data.id}`} 
        className={`
            absolute top-1/2 right-[-4px] w-2 h-2 rounded-full 
            transition-all duration-300
            ${isSelected ? 'bg-[#E60023] scale-125' : 'bg-transparent'}
        `}
      />
    </div>
  );
};

export default Panel3D;