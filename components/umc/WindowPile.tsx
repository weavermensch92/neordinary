import React from 'react';

// Exporting the individual panel for reuse in GalleryView
interface WindowPanelProps {
  title: string;
  code: string;
  children: React.ReactNode;
  variant?: 'default' | 'error' | 'warning';
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent) => void;
  isTop?: boolean;
}

export const WindowPanel: React.FC<WindowPanelProps> = ({
  title,
  code,
  children,
  variant = 'default',
  className = '',
  style,
  onClick,
  isTop = true
}) => {
  // Colors based on variant - Now using Red as the primary "Point" color for default panels
  const getTheme = () => {
    switch (variant) {
      case 'error': return {
        border: 'border-red-600',
        bg: 'bg-zinc-50',
        header: 'bg-red-600 text-white',
        text: 'text-red-900',
        divider: 'border-red-600'
      };
      case 'warning': return {
        border: 'border-orange-500',
        bg: 'bg-zinc-50',
        header: 'bg-orange-500 text-white',
        text: 'text-orange-900',
        divider: 'border-orange-500'
      };
      default: return {
        // Main Theme: Red Point Color on Gray Background
        border: 'border-red-600',
        bg: 'bg-zinc-50', 
        header: 'bg-red-600 text-white',
        text: 'text-zinc-800',
        divider: 'border-red-500'
      };
    }
  };

  const theme = getTheme();

  return (
    <div
      className={`absolute top-0 left-0 border ${theme.border} ${theme.bg} shadow-xl overflow-hidden flex flex-col ${className}`}
      style={style}
      onClick={onClick}
    >
      <div className={`${theme.header} px-2 py-1 text-[9px] flex justify-between items-center tracking-widest border-b ${theme.divider}`}>
        <span className="font-bold flex items-center gap-2">
           {title}
        </span>
        <span className="opacity-80 font-mono">{code}</span>
      </div>

      <div className="flex-1 p-3 relative overflow-hidden">
        {/* Background grid lines - Subtle gray */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px)', backgroundSize: '100% 4px' }}
        />

        <div className={`relative z-10 h-full ${theme.text}`}>
          {children}
        </div>
      </div>
    </div>
  );
};

interface WindowPileProps {
  title: string;
  code: string;
  children: React.ReactNode;
  variant?: 'default' | 'error' | 'warning';
  className?: string;
  layerCount?: number;
  onToggle?: () => void;
}

const WindowPile: React.FC<WindowPileProps> = ({
  title,
  code,
  children,
  variant = 'default',
  className = '',
  layerCount = 8,
  onToggle
}) => {
  const stackLayers = Array.from({ length: layerCount });

  return (
    <div
      className={`relative w-80 h-64 ${className} group cursor-pointer`}
      onClick={(e) => {
        e.stopPropagation();
        if (onToggle) onToggle();
      }}
    >
      {stackLayers.map((_, index) => {
        const isTop = index === stackLayers.length - 1;
        const offset = index * 10;
        
        // Z-Index: Standard stacking order
        const zIndex = index;
        const opacity = isTop ? 1 : 0.3 + (index * 0.1);

        return (
          <WindowPanel
            key={index}
            title={title}
            code={code}
            variant={variant}
            isTop={isTop}
            style={{
               width: 320,
               height: 256,
               transform: `translate(${offset}px, ${offset}px)`,
               zIndex,
               opacity,
               transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            className={!isTop ? 'group-hover:translate-x-2 group-hover:-translate-y-1' : ''}
          >
            {isTop ? children : (
              <div className="flex flex-col h-full opacity-50 text-zinc-600">
                 <div className="w-full h-1 bg-red-400 mb-2 opacity-20"></div>
                 <div className="w-2/3 h-1 bg-red-400 mb-4 opacity-20"></div>
                 <div className="font-mono text-[8px] leading-loose opacity-60 text-red-900">
                    DATA_BLOCK_{index}<br/>
                    OFFSET: 0x{index}F{index}A<br/>
                    STATUS: STANDBY
                 </div>
              </div>
            )}
          </WindowPanel>
        );
      })}
    </div>
  );
};

export default WindowPile;