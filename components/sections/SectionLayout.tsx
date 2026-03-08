import React, { useEffect, useState, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';

interface SectionLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  index?: string;
  isActive?: boolean;
  isExiting?: boolean;
  exitDirection?: 'left' | 'right';
}

export const SectionLayout: React.FC<SectionLayoutProps> = ({
  children,
  title,
  subtitle,
  align,
  index,
  isActive = false,
  isExiting = false,
  exitDirection = 'left'
}) => {
  const [phase, setPhase] = useState(0);
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);

  // Split title
  const titleParts = title ? title.split(' ') : [];
  const firstWord = titleParts.length > 0 ? titleParts[0] : '';
  const restOfTitle = titleParts.length > 1 ? titleParts.slice(1).join(' ') : '';
  const fallbackSubtitle = subtitle || restOfTitle || firstWord;

  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (!isActive) {
      setPhase(0);
      return;
    }

    // Wait 2000ms for the video transition to play
    timer = setTimeout(() => {
      setPhase(5);
      // Wait for stagger animations to finish before unlocking scroll
      setTimeout(() => {
        setIsAnimationComplete(true);
      }, 1500); // 2000ms (video) + 1500ms (stagger) = 3.5s total lock
    }, 2000);

    return () => {
      clearTimeout(timer);
      setIsAnimationComplete(false);
    };
  }, [isActive]);

  useEffect(() => {
    if (isActive && phase === 5 && sectionRef.current) {
      // Allow render to complete before querying stagger items
      setTimeout(() => {
        if (!sectionRef.current) return;
        const items = sectionRef.current.querySelectorAll('.stagger-item');
        items.forEach((item, index) => {
          (item as HTMLElement).style.transitionDelay = `${index * 0.1}s`;
        });
      }, 0);
    }
  }, [isActive, phase]);

  const exitAnimation: any = {
    x: isExiting ? (exitDirection === 'left' ? '-100vw' : '100vw') : 0,
    transition: { duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }
  };

  const sectionVariants: any = {
    hidden: { opacity: 0, y: '10vh', x: 0 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.33, 1, 0.68, 1] } },
    exitLeft: { x: '-100vw', transition: { duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] } },
    exitRight: { x: '100vw', transition: { duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] } }
  };

  const currentState = isExiting ? (exitDirection === 'left' ? 'exitLeft' : 'exitRight') : (isActive && phase === 5 ? 'visible' : 'hidden');

  return (
    <section
      ref={sectionRef}
      data-scroll-locked={!isAnimationComplete}
      className="min-h-[110vh] w-screen flex flex-col justify-start px-6 md:px-[4rem] box-border max-w-[150rem] mx-auto relative bg-transparent overflow-hidden font-sans"
    >

      {/* Brutalist Grid Lines */}
      <motion.div
        animate={{ opacity: (isActive && phase === 5) ? 0.03 : 0 }}
        initial={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="absolute inset-0 pointer-events-none grid grid-cols-1 md:grid-cols-12 gap-8 px-6 md:px-16"
      >
        <div className="col-span-3 border-r-8 border-white h-full"></div>
        <div className="col-span-9 h-full flex flex-col justify-evenly">
          <div className="w-full h-1 border-t-2 border-white/50"></div>
          <div className="w-full h-1 border-t-2 border-white/50"></div>
          <div className="w-full h-1 border-t-2 border-white/50"></div>
        </div>
      </motion.div>

      {/* Actual Section UI (Fades in at Phase 5) */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        animate={currentState}
        className={`w-full min-h-[85vh] pt-32 md:pt-48 pb-24 grid grid-cols-1 md:grid-cols-12 gap-12 relative z-10 items-stretch ${isActive && phase === 5 ? 'phase-5-active' : ''}`}
      >
        {/* Left Column: Index & Context */}
        <div className="md:col-span-3 flex flex-col justify-between pr-8 border-r-[0.75rem] border-white relative">
          <div>
            {index && (
              <div className="flex flex-col mb-12 stagger-item">
                <span className="text-[12rem] font-black leading-[0.75] text-white tracking-tighter">
                  {index}
                </span>
                <div className="w-1/2 h-4 bg-accent mt-6"></div>
              </div>
            )}

            {title && (
              <div className="text-4xl font-black text-white/20 uppercase tracking-tighter leading-[0.85] mb-8 break-words origin-left md:whitespace-normal z-50 relative min-h-[7.5rem] stagger-item">
                <span className="text-white">{firstWord}</span><br />{restOfTitle}
              </div>
            )}

            {subtitle && (
              <div className="border-l-8 border-accent pl-6 py-2 mt-12 bg-white/5 stagger-item">
                <span className="block text-accent text-3xl font-black tracking-tighter uppercase leading-none">
                  {subtitle}
                </span>
              </div>
            )}
          </div>

          {/* Bottom Info */}
          <div className="hidden md:flex flex-col gap-6 mt-20 stagger-item">
            <div className="w-full h-2 bg-white/20"></div>
            <div className="flex justify-between items-end">
              <div className="flex gap-2">
                <div className="w-8 h-8 bg-white"></div>
                <div className="w-16 h-8 bg-accent"></div>
              </div>
              <div className="text-lg font-black text-white/40 uppercase tracking-[0.2em] text-right">
                SYS.REF<br /><span className="text-white">D-2026</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className={`md:col-span-9 flex flex-col justify-center pl-0 md:pl-8 h-full relative z-10`}>
          {children}
        </div>

      </motion.div>
    </section>
  );
};