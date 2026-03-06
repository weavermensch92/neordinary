import React, { useEffect, useState } from 'react';
import { WindowPanel } from './WindowPile';
import { X, CornerDownLeft } from 'lucide-react';
import { NotionCardComponent } from './NotionCard';
import { ProcessedItem } from './types';

interface PileGridProps {
  node: {
    id: string;
    title: string;
    code: string;
    items: ProcessedItem[]; // The real items array
    layerCount: number;
    variant: 'default' | 'error' | 'warning';
  };
  onClose: () => void;
  onSelectCard: (index: number) => void;
  selectedIndex: number | null;
}

const PileGrid: React.FC<PileGridProps> = ({ node, onClose, onSelectCard, selectedIndex }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Add a slight delay to start the animation after mount
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Use the actual items from the node
  const items = node.items;

  return (
    <div
      className={`fixed inset-0 z-[150] flex flex-col transition-all duration-500 ${mounted ? 'bg-zinc-200/95 backdrop-blur-sm' : 'bg-transparent pointer-events-none'}`}
      onClick={() => {
        if (selectedIndex === null) onClose();
      }}
    >
      {/* Header */}
      <div
        className={`p-6 md:p-8 flex justify-between items-center z-[160] transition-opacity duration-300 ${selectedIndex !== null ? 'opacity-20 blur-sm pointer-events-none' : 'opacity-100'}`}
      >
        <div>
          <h2 className="text-2xl font-bold tracking-tighter text-red-700 flex items-center gap-3">
            <span className="bg-red-600 text-white px-2 py-1 text-sm shadow-sm">EXPANDED_VIEW</span>
            {node.title}
          </h2>
          <div className="font-mono text-xs text-red-600/70 mt-1">SECTOR_ID: {node.code} // ITEMS: {items.length}</div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="group flex items-center gap-2 px-4 py-2 border border-red-600 hover:bg-red-600 hover:text-white text-red-900 transition-colors bg-white shadow-sm"
        >
          <CornerDownLeft size={16} />
          <span className="font-mono text-xs font-bold">RETURN_TO_SECTOR</span>
        </button>
      </div>

      {/* Grid Area */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
        {/* 
            Responsive Grid Logic:
            < 800px: 1 col (default)
            >= 800px: 2 cols
            >= 1200px: 3 cols
            >= 1920px: 4 cols
        */}
        <div className={`grid grid-cols-1 min-[800px]:grid-cols-2 min-[1200px]:grid-cols-3 min-[1920px]:grid-cols-4 gap-6 md:gap-8 max-w-[2400px] mx-auto transition-all duration-500 ${selectedIndex !== null ? 'blur-md scale-95 opacity-50' : ''}`}>
          {items.map((item, index) => {
            const delay = index * 40; // Slightly slower for more "dealing" effect
            const isVisible = mounted;

            return (
              <div
                key={index}
                className={`transform transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1) hover:z-10`}
                style={{
                  transitionDelay: `${delay}ms`,
                  opacity: isVisible ? 1 : 0,
                  // "Spreading" Animation:
                  // Starts smaller (scale 0.5), rotated (10deg), and pushed down (100px)
                  // Transitions to natural state
                  transform: isVisible
                    ? 'translateY(0) scale(1) rotate(0deg)'
                    : 'translateY(100px) scale(0.5) rotate(5deg)'
                }}
              >
                <div
                  className="relative w-full aspect-[4/3] cursor-pointer group"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectCard(index);
                  }}
                >
                  <div className="absolute -inset-2 border-2 border-dashed border-red-500 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />

                  <WindowPanel
                    title={item.name}
                    code={item.code}
                    variant={node.variant}
                    isTop={true}
                    className="w-full h-full shadow-md group-hover:shadow-xl transition-shadow group-hover:-translate-y-1"
                  >
                    <NotionCardComponent item={item} isGrid={true} loadImage={true} />
                  </WindowPanel>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PileGrid;