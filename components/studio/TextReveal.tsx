import React, { useRef, useLayoutEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { GlitchText } from './GlitchText';

interface TextRevealProps {
  children: string;
  className?: string;
  speed?: 'fast' | 'medium' | 'slow';
  threshold?: number;
  delay?: number; // Time until text rises (movement)
  glitchDelay?: number; // Base time until glitch effect starts/resolves.
  mode?: 'block' | 'word' | 'sentence';
}

export const TextReveal: React.FC<TextRevealProps> = ({
  children,
  className = "",
  speed = 'medium',
  threshold = 0.2,
  delay = 0,
  glitchDelay,
  mode = 'word'
}) => {
  const containerRef = useRef<HTMLSpanElement>(null);
  const unitRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const isInView = useInView(containerRef, { amount: threshold, once: true });
  const [diagonalDelays, setDiagonalDelays] = useState<number[]>([]);

  // Split logic based on mode
  const units = React.useMemo(() => {
    if (mode === 'block') return [children];
    if (mode === 'sentence') {
      // Split by sentence endings or newlines, preserving the delimiters
      return children.split(/([.!?\n]\s*)/).filter(Boolean);
    }
    // Default: 'word'
    return children.split(/(\n| )/).filter(w => w !== ' ' && w !== '');
  }, [children, mode]);

  const baseGlitchDelay = glitchDelay !== undefined ? glitchDelay : delay;

  // Measure unit positions to calculate 2D diagonal sweep delay
  useLayoutEffect(() => {
    if (containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const newDelays = units.map((_, i) => {
        const el = unitRefs.current[i];
        if (!el) return 0;

        const rect = el.getBoundingClientRect();
        // Area-filling sweep principle: (x + y) determines the resolution order
        // top-left (0,0) starts first, bottom-right (1,1) ends last.
        const xPct = (rect.left - containerRect.left) / (containerRect.width || 1);
        const yPct = (rect.top - containerRect.top) / (containerRect.height || 1);

        // Use row-biased diagonal for "sentence" flow
        return (xPct * 0.15) + (yPct * 0.3);
      });
      setDiagonalDelays(newDelays);
    }
  }, [units]);

  return (
    <span ref={containerRef} className={`inline-block ${className}`}>
      {units.map((unit, i) => {
        if (unit === '\n') return <br key={i} />;

        // Cascading movement: units appear with a small gap
        const unitMovementDelay = delay + (i * (mode === 'word' ? 0.05 : 0.15));

        // Sweep resolution delay
        const spatialDelay = diagonalDelays[i] !== undefined
          ? diagonalDelays[i]
          : (i * 0.05);

        return (
          <span
            key={i}
            ref={(el) => { unitRefs.current[i] = el; }}
            className="inline-block mr-[0.25em] overflow-hidden align-bottom leading-none"
          >
            <GlitchText
              text={unit}
              isActive={isInView}
              speed={speed}
              enableReveal={true} // GlitchText now handles the y-motion internal to its own span
              delay={baseGlitchDelay + spatialDelay}
              movementDelay={unitMovementDelay}
              className="inline-flex whitespace-nowrap"
            />
          </span>
        );
      })}
    </span>
  );
}