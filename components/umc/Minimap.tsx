import React from 'react';

interface MinimapProps {
  worldWidth: number;
  worldHeight: number;
  cameraX: number;
  cameraY: number;
  viewportWidth: number;
  viewportHeight: number;
  items: Array<{ x: number; y: number; width?: number; height?: number }>;
  labels: Array<{ text: string; x: number; y: number; }>;
  onNavigate: (x: number, y: number) => void;
}

const Minimap: React.FC<MinimapProps> = ({
  worldWidth,
  worldHeight,
  cameraX,
  cameraY,
  viewportWidth,
  viewportHeight,
  items,
  labels,
  onNavigate
}) => {
  const mapWidth = 240; // Slightly larger for better legibility
  const scale = mapWidth / worldWidth;
  const mapHeight = worldHeight * scale;

  const worldLeft = -cameraX;
  const worldTop = -cameraY;

  const vpX = worldLeft * scale;
  const vpY = worldTop * scale;
  const vpW = viewportWidth * scale;
  const vpH = viewportHeight * scale;

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const worldX = clickX / scale;
    const worldY = clickY / scale;
    onNavigate(worldX, worldY);
  };

  return (
    <div 
      className="fixed bottom-8 right-8 bg-zinc-200 border border-zinc-400 shadow-xl z-50 overflow-hidden cursor-crosshair hover:border-red-500 transition-colors"
      style={{ width: mapWidth, height: mapHeight }}
      onClick={handleClick}
    >
      <div className="relative w-full h-full bg-zinc-200 pointer-events-none">
        <div className="absolute inset-0 opacity-20" 
             style={{ 
               backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', 
               backgroundSize: '20px 20px' 
             }} 
        />
        
        {/* Generation Labels on Minimap */}
        {labels.map((label, i) => (
           <div 
             key={`lbl-${i}`}
             className="absolute text-[6px] font-bold text-zinc-500 text-center leading-none"
             style={{
                left: label.x * scale,
                top: label.y * scale,
                transform: 'translate(-50%, -50%)',
                width: 100 // Arbitrary width to allow centering
             }}
           >
              {label.text.toUpperCase()}
           </div>
        ))}

        {/* Node Items */}
        {items.map((item, i) => (
          <div
            key={i}
            className="absolute bg-zinc-500 opacity-60"
            style={{
              left: item.x * scale,
              top: item.y * scale,
              width: (item.width || 320) * scale,
              height: (item.height || 256) * scale,
            }}
          />
        ))}

        {/* Viewport Indicator - Red for visibility */}
        <div
          className="absolute border-2 border-red-600 bg-red-600/10"
          style={{
            left: vpX,
            top: vpY,
            width: vpW,
            height: vpH,
          }}
        />
        
        <div className="absolute top-1 left-1 text-[8px] font-mono tracking-tighter opacity-80 bg-zinc-100/80 px-1 text-zinc-900">
          SECTOR_MAP
        </div>
      </div>
    </div>
  );
};

export default Minimap;