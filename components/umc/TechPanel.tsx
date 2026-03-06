import React from 'react';

interface TechPanelProps {
  children: React.ReactNode;
  title?: string;
  code?: string;
  className?: string;
  variant?: 'default' | 'error';
}

const TechPanel: React.FC<TechPanelProps> = ({ 
  children, 
  title = "UNTITLED", 
  code = "000", 
  className = "",
  variant = 'default'
}) => {
  const borderColor = variant === 'error' ? 'border-red-600' : 'border-zinc-800';
  const textColor = variant === 'error' ? 'text-red-600' : 'text-black';
  const bgColor = variant === 'error' ? 'bg-red-50/50' : 'bg-zinc-200/80';

  return (
    <div className={`relative group ${className}`}>
      {/* Decorative corner markers */}
      <div className={`absolute -top-[1px] -left-[1px] w-2 h-2 border-t-2 border-l-2 ${borderColor}`} />
      <div className={`absolute -top-[1px] -right-[1px] w-2 h-2 border-t-2 border-r-2 ${borderColor}`} />
      <div className={`absolute -bottom-[1px] -left-[1px] w-2 h-2 border-b-2 border-l-2 ${borderColor}`} />
      <div className={`absolute -bottom-[1px] -right-[1px] w-2 h-2 border-b-2 border-r-2 ${borderColor}`} />

      {/* Main Container */}
      <div className={`border ${borderColor} ${bgColor} backdrop-blur-sm h-full p-1 shadow-sm transition-all duration-300`}>
        {/* Header */}
        <div className={`flex justify-between items-center px-2 py-1 mb-2 border-b ${borderColor} border-opacity-30`}>
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 bg-current ${textColor}`} />
            <h3 className={`text-[10px] font-bold tracking-[0.2em] uppercase ${textColor}`}>
              {title}
            </h3>
          </div>
          <span className="text-[9px] opacity-60 font-mono tracking-tighter">{code}</span>
        </div>

        {/* Content */}
        <div className="px-2 pb-2 h-[calc(100%-2rem)] overflow-hidden relative">
          {children}
        </div>
      </div>
    </div>
  );
};

export default TechPanel;