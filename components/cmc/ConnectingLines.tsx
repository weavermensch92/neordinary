import React, { useEffect, useState } from 'react';

interface ConnectingLinesProps {
  selectedId: string | null;
  viewportRotation: { x: number; y: number };
}

const ConnectingLines: React.FC<ConnectingLinesProps> = ({ selectedId, viewportRotation }) => {
  const [lineCoords, setLineCoords] = useState<{ x1: number, y1: number, x2: number, y2: number } | null>(null);

  // Re-calculate lines on selection change or animation frame
  useEffect(() => {
    let animationFrameId: number;

    const updateLines = () => {
      if (!selectedId) {
        setLineCoords(null);
        return;
      }

      const sourceEl = document.getElementById(`panel-connector-${selectedId}`);
      const targetEl = document.getElementById('detail-connector');

      if (sourceEl && targetEl) {
        const sourceRect = sourceEl.getBoundingClientRect();
        const targetRect = targetEl.getBoundingClientRect();

        setLineCoords({
          x1: sourceRect.left + sourceRect.width / 2,
          y1: sourceRect.top + sourceRect.height / 2,
          x2: targetRect.left + targetRect.width / 2,
          y2: targetRect.top + targetRect.height / 2,
        });
      }
      animationFrameId = requestAnimationFrame(updateLines);
    };

    updateLines();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [selectedId, viewportRotation]);

  if (!lineCoords) return null;

  return (
    <svg className="fixed inset-0 pointer-events-none z-[1500] w-full h-full">
      <defs>
        <marker id="dot" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5">
          <circle cx="5" cy="5" r="5" fill="#E60023" />
        </marker>
      </defs>
      
      {/* Main Connection Line */}
      <line 
        x1={lineCoords.x1} 
        y1={lineCoords.y1} 
        x2={lineCoords.x2} 
        y2={lineCoords.y2} 
        stroke="#E60023" 
        strokeWidth="1" 
        opacity="0.6"
      />

      {/* Secondary Decor Line (Horizontal then Vertical) */}
      <polyline
        points={`${lineCoords.x1},${lineCoords.y1} ${(lineCoords.x1 + lineCoords.x2) / 2},${lineCoords.y1} ${(lineCoords.x1 + lineCoords.x2) / 2},${lineCoords.y2} ${lineCoords.x2},${lineCoords.y2}`}
        fill="none"
        stroke="#E60023"
        strokeWidth="1"
        strokeDasharray="4,4"
        opacity="0.3"
      />
      
      {/* Dynamic textual marker along the line */}
       <text 
         x={(lineCoords.x1 + lineCoords.x2) / 2} 
         y={(lineCoords.y1 + lineCoords.y2) / 2} 
         fill="#E60023" 
         fontSize="10" 
         fontFamily="monospace"
         textAnchor="middle"
         dy="-5"
       >
         LINK_ESTABLISHED
       </text>
    </svg>
  );
};

export default ConnectingLines;