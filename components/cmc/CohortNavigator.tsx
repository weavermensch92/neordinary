import React from 'react';
import { SystemLog } from './types';

interface CohortNavigatorProps {
  logs: SystemLog[];
  activeIndex: number;
  onSelectCohort: (index: number) => void;
}

const CohortNavigator: React.FC<CohortNavigatorProps> = ({ logs, activeIndex, onSelectCohort }) => {
  // Extract unique cohorts and their starting indices (specifically finding SEPARATORS)
  const cohortMarkers = logs.reduce((acc: { cohort: string; index: number }[], log, idx) => {
    // We only care about separator types for navigation targets
    if (log.type === 'SEPARATOR' && log.cohort) {
      acc.push({ cohort: log.cohort, index: idx });
    }
    return acc;
  }, []);

  // Determine current active cohort based on the active item
  const currentLog = logs[activeIndex];
  const currentCohort = currentLog?.cohort;

  return (
    <div 
      className="fixed right-8 top-24 z-[3000] hidden md:flex flex-col gap-4 items-end p-4"
      data-cursor="nav"
    >
      {cohortMarkers.map((marker) => {
        const isActive = marker.cohort === currentCohort;
        return (
          <div 
            key={marker.cohort}
            onClick={(e) => {
                e.stopPropagation();
                onSelectCohort(marker.index);
            }}
            className="group flex items-center gap-3 cursor-pointer"
          >
            <span 
              className={`
                text-[10px] font-mono tracking-widest transition-all duration-300
                ${isActive ? 'text-[#E60023] font-bold opacity-100' : 'text-[#E60023] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'}
              `}
            >
              {marker.cohort}
            </span>
            
            <div 
              className={`
                relative transition-all duration-300 border border-[#E60023]
                ${isActive ? 'w-4 h-4 bg-[#E60023]' : 'w-2 h-2 bg-transparent hover:bg-[#E60023]/20'}
              `}
            >
                {isActive && (
                    <div className="absolute inset-0 animate-ping opacity-30 bg-[#E60023]"></div>
                )}
            </div>
          </div>
        );
      })}
      
      {/* Decorative vertical line */}
      <div className="absolute right-[35px] top-0 bottom-0 w-[1px] bg-[#E60023]/20 -z-10" />
    </div>
  );
};

export default CohortNavigator;