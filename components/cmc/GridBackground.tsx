import React from 'react';

interface GridBackgroundProps {
  rotation: { x: number; y: number; z: number };
  position: { x: number; y: number; z: number };
  opacity?: number;
  shiftZ?: number;
  shiftY?: number;
  zIndex?: number;
}

const GridBackground: React.FC<GridBackgroundProps> = ({ 
  rotation, 
  position, 
  opacity = 1,
  shiftZ = 0,
  shiftY = 0,
  zIndex = -50
}) => {
  return (
    <div 
      className="absolute top-1/2 left-1/2 pointer-events-none"
      style={{
        // Large dimensions to cover the viewport regardless of rotation/offset
        width: '400vw',
        height: '400vw',
        zIndex: zIndex,
        opacity: opacity,
        
        // Position & Rotation: 
        // 1. Center the grid origin (-50%, -50%)
        // 2. Apply 3D Translation (User Position)
        // 3. Apply 3D Rotation (User Rotation)
        // 4. Apply Local Z Shift (Parallel Layering)
        // 5. Apply Local Y Shift (Offset along grid lines)
        transform: `
          translate(-50%, -50%) 
          translate3d(${position.x}px, ${position.y}px, ${position.z}px) 
          rotateX(${rotation.x}deg) 
          rotateY(${rotation.y}deg) 
          rotateZ(${rotation.z}deg)
          translateZ(${shiftZ}px)
          translateY(${shiftY}px)
        `,
        
        // Grid Pattern
        // Increased alpha to 0.4 to ensure visibility when acting as an overlay with reduced container opacity
        backgroundImage: `
          linear-gradient(to right, rgba(230, 0, 35, 0.4) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(230, 0, 35, 0.4) 1px, transparent 1px)
        `,
        backgroundSize: '100px 100px',
        
        // Fade out edges for a natural "infinite" look
        maskImage: 'radial-gradient(circle at center, black 0%, transparent 70%)',
        WebkitMaskImage: 'radial-gradient(circle at center, black 0%, transparent 70%)',
      }}
    />
  );
};

export default GridBackground;