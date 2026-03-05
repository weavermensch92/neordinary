import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';

export const CustomCursor: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isHoveringLink, setIsHoveringLink] = useState(false);
  
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      // Use animate for a Bezier-like smooth in/out curve instead of spring physics
      // This reduces the bounce/oscillation and creates a fluid trailing effect
      const animationOptions = {
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      };

      animate(cursorX, e.clientX, animationOptions);
      animate(cursorY, e.clientY, animationOptions);
      
      // Check if we are over a "local-cursor-area" which handles its own cursor
      const target = e.target as HTMLElement;
      // Ensure target is an Element before calling closest
      if (target instanceof Element && target.closest('.local-cursor-area')) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      // Check if hovering clickable elements for subtle feedback
      if (target instanceof Element) {
          const isClickable = target.closest('a, button, [role="button"], input, textarea');
          setIsHoveringLink(!!isClickable);
      }
    };

    window.addEventListener('mousemove', moveCursor);
    return () => {
      window.removeEventListener('mousemove', moveCursor);
    };
  }, [cursorX, cursorY]);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: isVisible ? 1 : 0,
        }}
      >
        {/* Main Red Dot */}
        <motion.div 
            className="bg-[#FF1F1F] rounded-full shadow-[0_0_10px_2px_rgba(255,31,31,0.4)]"
            animate={{
                width: isHoveringLink ? 24 : 12,
                height: isHoveringLink ? 24 : 12,
                opacity: isHoveringLink ? 0.8 : 1
            }}
            transition={{ duration: 0.2 }}
        />
      </motion.div>
    </>
  );
};