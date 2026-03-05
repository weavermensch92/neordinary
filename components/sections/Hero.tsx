import React from 'react';
import { motion } from 'framer-motion';

export const Hero = ({ onNavigate, onTogglePause, isActive, isExiting, exitDirection }: {
  onNavigate?: (index: number) => void,
  onTogglePause?: (paused: boolean) => void,
  isActive?: boolean,
  isExiting?: boolean,
  exitDirection?: 'left' | 'right'
}) => {
  const exitAnimation: any = {
    x: isExiting ? (exitDirection === 'left' ? '-100vw' : '100vw') : 0,
    transition: { duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }
  };

  return (
    <section className="h-screen w-full flex flex-col items-center justify-center relative overflow-hidden">
      {/* 
        We use a clean, centered layout for the Hero to ensure the 
        background 3D typography (GRIDGE / NE(O)RDINARY) appears 
        perfectly centered without interference from the sidebar grid.
      */}
      <motion.div
        animate={exitAnimation}
        className="relative z-10 flex flex-col items-center justify-center w-full h-full pointer-events-none"
      >
        {/* 
            The content is primarily the 3D scene in the background.
            This container ensures any future overlay content is also centered.
        */}
      </motion.div>
    </section>
  );
};