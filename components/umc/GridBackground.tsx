import React from 'react';

interface GridBackgroundProps {
  offsetX?: number;
  offsetY?: number;
}

const GridBackground: React.FC<GridBackgroundProps> = ({ offsetX = 0, offsetY = 0 }) => {
  // SVG for the + pattern
  // Stroke width 0.5 for thin, technical look
  // Color changed to Faded Black (#27272a / Zinc-800) with low opacity
  const plusSvg = `
    <svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
      <g stroke="#27272a" stroke-width="0.5" fill="none" fill-rule="evenodd" opacity="0.15">
        <path d="M25 30h10M30 25v10"/>
      </g>
    </svg>
  `;

  const encodedPlus = encodeURIComponent(plusSvg);

  // Parallax factor: 0.5
  const parallaxX = offsetX * 0.5;
  const parallaxY = offsetY * 0.5;

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-zinc-200">
      {/* Base Color: Zinc-200 */}
      <div className="absolute inset-0 bg-zinc-200" />
      
      {/* Plus Grid - Moves with parallax offset AND smooth transition */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,${encodedPlus}")`,
          backgroundSize: '60px 60px',
          backgroundPosition: `${parallaxX}px ${parallaxY}px`,
          // Add transition for the "delayed follow" effect
          transition: 'background-position 1.2s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      />

      {/* Noise overlay for texture */}
      <div className="absolute inset-0 opacity-[0.04] mix-blend-multiply pointer-events-none">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <filter id="noiseFilter">
            <feTurbulence 
              type="fractalNoise" 
              baseFrequency="0.65" 
              numOctaves="3" 
              stitchTiles="stitch" 
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>
    </div>
  );
};

export default GridBackground;