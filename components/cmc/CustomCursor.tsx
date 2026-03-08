import React, { useEffect, useState, useRef } from 'react';

interface CustomCursorProps {
  isPaused: boolean;
  isFiltered: boolean; // Added prop
}

const CustomCursor: React.FC<CustomCursorProps> = ({ isPaused, isFiltered }) => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [hoverType, setHoverType] = useState<string | null>(null);
  const requestRef = useRef<number>(0);
  const mousePosition = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current = { x: e.clientX, y: e.clientY };
      
      // Check for hover targets via data-cursor attribute
      // We look up the tree in case the target is nested
      const target = e.target as HTMLElement;
      const cursorElement = target.closest('[data-cursor]');
      
      if (cursorElement) {
        const type = cursorElement.getAttribute('data-cursor');
        setHoverType(type);
      } else {
        setHoverType(null);
      }
    };

    const animate = () => {
      setPosition(prev => ({
        x: prev.x + (mousePosition.current.x - prev.x) * 0.2, // Smooth interpolation
        y: prev.y + (mousePosition.current.y - prev.y) * 0.2
      }));
      requestRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  // -- RENDERERS --

  // 1. LIVE DEFAULT: Vertical Pulsing Line
  const renderLiveDefault = () => (
    <div className="relative flex items-center justify-center">
      {/* Thickness increased from 1px to 3px */}
      <div className="w-[3px] h-6 bg-gradient-to-b from-transparent via-[#E60023] to-transparent animate-pulse" />
      <div className="absolute top-8 text-[8px] font-mono text-[#E60023] tracking-widest opacity-60">SCROLL</div>
    </div>
  );

  // 2. LOCKED DEFAULT: 'X' Shape
  const renderLockedDefault = () => (
    <div className="relative w-8 h-8 flex items-center justify-center">
      <div className="absolute w-full h-[1px] bg-[#E60023] rotate-45" />
      <div className="absolute w-full h-[1px] bg-[#E60023] -rotate-45" />
      <div className="absolute top-[-15px] text-[8px] font-mono text-[#E60023] tracking-widest opacity-60">CLOSE</div>
    </div>
  );

  // 3. ARROW TOP-RIGHT (Panel Hover)
  const renderArrowTopRight = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 17L17 7M17 7H7M17 7V17" stroke="#E60023" strokeWidth="2" strokeLinecap="square"/>
    </svg>
  );

  // 4. ARROW DOWN (Detail Hover - Live)
  const renderArrowDown = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 5V19M12 19L5 12M12 19L19 12" stroke="#E60023" strokeWidth="2" strokeLinecap="square"/>
    </svg>
  );

  // 5. CROSSHAIR (Store Links)
  const renderCrosshair = () => (
    <div className="relative w-6 h-6">
      <div className="absolute top-1/2 left-0 w-full h-[2px] bg-[#E60023] -translate-y-1/2" />
      <div className="absolute left-1/2 top-0 h-full w-[2px] bg-[#E60023] -translate-x-1/2" />
    </div>
  );

  // 6. SQUARE (Navigator)
  const renderSquare = () => (
    <div className="w-3 h-3 bg-[#E60023] border border-white shadow-sm" />
  );

  // 7. SMALL CROSS (Detail Hover - Locked)
  const renderSmallCross = () => (
    <div className="relative w-4 h-4 flex items-center justify-center">
      <div className="absolute w-full h-[2px] bg-[#E60023]" />
      <div className="absolute h-full w-[2px] bg-[#E60023]" />
    </div>
  );

  // 8. ARROW LEFT (Filtered Background Hover - "Back")
  const renderArrowLeft = () => (
    <div className="relative flex items-center justify-center">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="#E60023" strokeWidth="2" strokeLinecap="square"/>
        </svg>
        <div className="absolute top-8 text-[8px] font-mono text-[#E60023] tracking-widest opacity-60 whitespace-nowrap">RESET FILTER</div>
    </div>
  );

  // -- LOGIC SELECTOR --
  const getCursorContent = () => {
    // Priority: Hover Type -> State Default
    
    // Explicit Hover targets override state
    if (hoverType === 'panel') return { key: 'panel', component: renderArrowTopRight() };
    if (hoverType === 'detail') return { key: 'detail', component: isPaused ? renderSmallCross() : renderArrowDown() };
    if (hoverType === 'store') return { key: 'store', component: renderCrosshair() };
    if (hoverType === 'nav') return { key: 'nav', component: renderSquare() };
    if (hoverType === 'image') return { key: 'none', component: null }; 
    if (hoverType === 'chat') return { key: 'chat', component: renderSquare() }; // Chat priority

    // Background interaction states
    if (isFiltered && !isPaused && !hoverType) {
        // If filtered and hovering empty space, show Left Arrow to indicate reset
        return { key: 'back', component: renderArrowLeft() };
    }

    // Defaults
    if (isPaused) {
        // If paused (locked), but hovering chat, we want chat cursor.
        // But we already checked hoverType === 'chat' above.
        // So this default is fine for non-hover areas.
        return { key: 'locked', component: renderLockedDefault() };
    }
    return { key: 'live', component: renderLiveDefault() };
  };

  const { key, component } = getCursorContent();

  return (
    <>
      <style>{`
        @keyframes pop {
          0% { transform: scale(0.5); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-pop {
          animation: pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
      `}</style>
      <div 
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%) scale(1.5)` 
        }}
      >
        <div key={key} className="animate-pop">
          {component}
        </div>
      </div>
    </>
  );
};

export default CustomCursor;