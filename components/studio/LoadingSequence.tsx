import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GlitchText } from './GlitchText';
import { InteractiveVideo } from './InteractiveVideo';
import { AboutSection } from './AboutSection';
import { BraveSection } from './BraveSection';
import { ServicesSection } from './ServicesSection';
import { WorkSection } from './WorkSection';
import { ValuesSection } from './ValuesSection';
import { TeamIntroSection } from './TeamIntroSection';
import { TeamSection } from './TeamSection';
import { Footer } from './Footer';
import { TextReveal } from './TextReveal';

interface LoadingSequenceProps {
  onComplete: () => void;
  containerRef: React.RefObject<HTMLDivElement>;
}

const LINES = [
  "NEO-ORDINARY",
  "NE(O)RDINARY",
  "NEXT ORDINARY",
  "AI-GENERATION"
];

// Vimeo Video ID from the URL provided (https://vimeo.com/1165128949)
const VIMEO_ID = "1165128949";

export const LoadingSequence: React.FC<LoadingSequenceProps> = ({ onComplete, containerRef }) => {
  const [startGlitch, setStartGlitch] = useState(false);
  const [phase, setPhase] = useState<'stacking' | 'uplift' | 'reveal'>('stacking');

  useEffect(() => {
    // Start the glitch effect immediately on mount
    const startTimer = setTimeout(() => setStartGlitch(true), 100);

    // Sequence timing logic
    // We want a fast, energetic sequence.
    // Lines resolve top to bottom.
    // Line 0: ~0.5s
    // Line 1: ~0.9s
    // Line 2: ~1.3s
    // Line 3: ~1.7s
    // Uplift starts after everything settles ~2.5s

    const upliftTimer = setTimeout(() => setPhase('uplift'), 2500);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(upliftTimer);
    };
  }, []);

  useEffect(() => {
    if (phase === 'uplift') {
      const timer = setTimeout(() => {
        setPhase('reveal');
        onComplete();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [phase, onComplete]);

  return (
    <div className="relative w-full min-h-screen bg-brand-bg">

      {/* 
        Phase 1: Full Screen Typography
        Animate Y and Opacity to 0 during uplift to ensure total removal.
      */}
      <motion.div
        className="fixed inset-0 z-50 w-full h-screen flex flex-col justify-between px-2 py-4 md:px-4 md:py-6 bg-brand-bg pointer-events-none"
        initial={{ y: 0, opacity: 1 }}
        animate={
          phase === 'uplift' || phase === 'reveal'
            ? { y: "-150vh", opacity: 0 }
            : { y: 0, opacity: 1 }
        }
        transition={{
          duration: 1.0,
          ease: [0.645, 0.045, 0.355, 1.000],
          opacity: { duration: 0.6, ease: "easeIn" }
        }}
      >
        {LINES.map((line, index) => (
          <div key={index} className="w-full">
            {/* 
               All lines are active simultaneously.
               We use the 'delay' prop to cascade the resolution from top to bottom.
               speed='fast' ensures the character cycling is energetic.
            */}
            <TextReveal
              mode="block"
              speed="fast"
              delay={0.2 + (index * 0.35)}
              className="text-[15.5vw] leading-[0.75] tracking-tighter w-full font-display font-black uppercase justify-between overflow-hidden"
            >
              {line}
            </TextReveal>
          </div>
        ))}
      </motion.div>

      {/* 
        Phase 3: The Video Container (Anchor for Hero Content)
      */}
      <motion.div
        className="absolute w-full z-30"
        style={{ paddingBottom: '43.75%' }}
        initial={{ top: "100vh" }}
        animate={phase === 'reveal' ? { top: "80vh" } : { top: "100vh" }}
        transition={{
          duration: 1.2,
          ease: [0.76, 0, 0.24, 1],
          delay: 0.0
        }}
      >
        {/* HERO TEXT SECTION */}
        <div className="absolute bottom-full left-0 w-full flex flex-col items-center justify-end px-4 md:px-8 pb-[4vh] pointer-events-none">
          <div className="w-full text-center pb-2 pt-2">
            {/* Replaced Motion H2 with TextReveal for consistent effect */}
            {phase === 'reveal' && (
              <TextReveal
                className="text-3xl md:text-5xl lg:text-7xl font-display uppercase leading-[0.8] tracking-tighter text-brand-red"
                speed="medium"
              >
                Controlling AI is Neo-ordinary
              </TextReveal>
            )}
          </div>

          {/* Info Row */}
          <motion.div
            className="w-full grid grid-cols-3 items-end mt-8 md:mt-12 text-xs md:text-sm font-sans uppercase tracking-widest text-brand-red"
            initial={{ opacity: 0 }}
            animate={phase === 'reveal' ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <div className="text-left font-bold">
              powered by softsquared inc.
            </div>
            <div className="flex flex-col items-center gap-2 text-center font-bold">
              <span>Scroll to dive deeper</span>
              <motion.div
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M19 12l-7 7-7-7" />
                </svg>
              </motion.div>
            </div>
            <div className="text-right font-bold">
              2026
            </div>
          </motion.div>
        </div>

        {/* Video Inner */}
        <div className="absolute inset-0 w-full h-full">
          <InteractiveVideo src={VIMEO_ID} />
        </div>

        {/* Labels */}
        <div className="absolute -bottom-10 left-4 md:-bottom-12 md:left-8 z-40 text-sm md:text-base font-sans font-bold tracking-widest uppercase text-brand-red opacity-100 pointer-events-none">
          <TextReveal mode="block">from Seoul to World</TextReveal>
        </div>
        <div className="absolute -bottom-10 right-4 md:-bottom-12 md:right-8 z-40 text-sm md:text-base font-sans font-bold tracking-widest uppercase text-brand-red opacity-100 pointer-events-none">
          <TextReveal mode="block">est 2019</TextReveal>
        </div>
      </motion.div>

      {/* 
        Phase 4: Content Flow
      */}
      <div className={`relative w-full transition-opacity duration-1000 ${phase === 'reveal' ? 'opacity-100' : 'opacity-0'}`}>
        <div className="w-full pointer-events-none" style={{ height: 'calc(80vh + 43.75vw)' }} />
        <AboutSection containerRef={containerRef} />
        <BraveSection containerRef={containerRef} />
        <ServicesSection containerRef={containerRef} />
        <WorkSection containerRef={containerRef} />
        <ValuesSection containerRef={containerRef} />
        <TeamIntroSection containerRef={containerRef} />
        <TeamSection containerRef={containerRef} />
        <Footer />
      </div>
    </div>
  );
};