import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface GalleryViewProps {
  nodeId: string;
  title: string;
  code: string;
  children: React.ReactNode;
  variant?: 'default' | 'error' | 'warning';
  onClose: () => void;
}

const GalleryView: React.FC<GalleryViewProps> = ({
  title,
  code,
  children,
  variant = 'default',
  onClose
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    requestAnimationFrame(() => setMounted(true));
    
    // Lock body scroll
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const getTheme = () => {
    switch (variant) {
      case 'error': return { border: 'border-red-600', header: 'bg-red-700', text: 'text-red-600', bg: 'bg-zinc-50' };
      case 'warning': return { border: 'border-orange-500', header: 'bg-orange-600', text: 'text-orange-600', bg: 'bg-zinc-50' };
      default: return { 
          // Red Theme applied
          border: 'border-red-600', 
          header: 'bg-red-600', 
          text: 'text-zinc-800', 
          bg: 'bg-zinc-50' 
      };
    }
  };
  const theme = getTheme();

  return (
    <div 
      className={`fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8 transition-all duration-500 ease-out ${mounted ? 'bg-zinc-900/60 backdrop-blur-md' : 'bg-transparent backdrop-blur-none pointer-events-none'}`}
      onClick={onClose}
    >
      <div 
        className={`w-full max-w-4xl h-[80vh] flex flex-col shadow-2xl overflow-hidden border-2 ${theme.border} ${theme.bg} transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) ${mounted ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-8'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className={`${theme.header} text-white px-4 py-3 flex justify-between items-center select-none`}>
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${variant === 'error' ? 'bg-red-400 animate-pulse' : 'bg-white'}`} />
            <h2 className="text-lg font-bold tracking-widest uppercase">PROJECT_DETAIL // {code}</h2>
          </div>
          <div className="flex items-center gap-4">
             <button 
               onClick={onClose}
               className="hover:bg-black/20 p-1 rounded transition-colors"
             >
               <X size={20} />
             </button>
          </div>
        </div>

        {/* Content Area - Now purely renders children (Name & Description) */}
        <div className="flex-1 overflow-hidden relative custom-scrollbar bg-zinc-50">
           {/* Background Grid */}
           <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
             style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }}
           />

           <div className="h-full w-full relative z-10">
              {children}
           </div>
        </div>
      </div>
    </div>
  );
};

export default GalleryView;