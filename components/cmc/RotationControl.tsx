import React from 'react';

interface TransformControlsProps {
  rotation: { x: number; y: number; z: number };
  position: { x: number; y: number; z: number };
  onRotationChange: (axis: 'x' | 'y' | 'z', value: number) => void;
  onPositionChange: (axis: 'x' | 'y' | 'z', value: number) => void;
}

const TransformControls: React.FC<TransformControlsProps> = ({ 
  rotation, 
  position, 
  onRotationChange, 
  onPositionChange 
}) => {
  return (
    <div className="fixed bottom-12 right-12 z-[3000] bg-white/80 backdrop-blur-md border border-[#E60023]/30 p-5 rounded-sm shadow-lg w-72 max-h-[80vh] overflow-y-auto transition-all hover:bg-white/95 hover:shadow-xl">
      <div className="flex justify-between items-center mb-4 border-b border-[#E60023]/20 pb-2">
        <h3 className="text-[10px] font-bold text-[#E60023] tracking-[0.2em] uppercase font-mono">
          GRID TRANSFORM
        </h3>
        <div className="w-2 h-2 bg-[#E60023] animate-pulse rounded-full"></div>
      </div>
      
      {/* ROTATION SECTION */}
      <div className="mb-6">
        <div className="text-[9px] font-bold text-[#E60023]/50 mb-3 tracking-widest uppercase border-l-2 border-[#E60023]/30 pl-2">
          ROTATION
        </div>
        {['x', 'y', 'z'].map((axis) => (
          <div key={`rot-${axis}`} className="mb-3 last:mb-0">
            <div className="flex justify-between items-center text-[10px] font-mono text-[#E60023] mb-1 uppercase tracking-wide">
              <span className="opacity-70">R_{axis}</span>
              <span className="font-bold bg-[#E60023]/10 px-1 rounded w-10 text-center">{rotation[axis as 'x'|'y'|'z']}°</span>
            </div>
            <input
              type="range"
              min="-180"
              max="180"
              value={rotation[axis as 'x'|'y'|'z']}
              onChange={(e) => onRotationChange(axis as 'x'|'y'|'z', Number(e.target.value))}
              className="w-full h-1 bg-[#E60023]/20 rounded-lg appearance-none cursor-pointer accent-[#E60023] hover:accent-[#ff002b] transition-all"
            />
          </div>
        ))}
      </div>

      {/* POSITION SECTION */}
      <div className="mb-2">
        <div className="text-[9px] font-bold text-[#E60023]/50 mb-3 tracking-widest uppercase border-l-2 border-[#E60023]/30 pl-2">
          POSITION
        </div>
        {['x', 'y', 'z'].map((axis) => (
          <div key={`pos-${axis}`} className="mb-3 last:mb-0">
            <div className="flex justify-between items-center text-[10px] font-mono text-[#E60023] mb-1 uppercase tracking-wide">
              <span className="opacity-70">P_{axis}</span>
              <span className="font-bold bg-[#E60023]/10 px-1 rounded w-12 text-center">{position[axis as 'x'|'y'|'z']}</span>
            </div>
            <input
              type="range"
              min={axis === 'z' ? "-2000" : "-1000"}
              max={axis === 'z' ? "500" : "1000"}
              step="10"
              value={position[axis as 'x'|'y'|'z']}
              onChange={(e) => onPositionChange(axis as 'x'|'y'|'z', Number(e.target.value))}
              className="w-full h-1 bg-[#E60023]/20 rounded-lg appearance-none cursor-pointer accent-[#E60023] hover:accent-[#ff002b] transition-all"
            />
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-2 border-t border-[#E60023]/10 text-[9px] text-[#E60023]/40 font-mono text-center">
        MATRIX CONTROLLER V2.0
      </div>
    </div>
  );
};

export default TransformControls;