import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { TextReveal } from './TextReveal';

interface ServiceItem {
  id: string;
  title: string;
  subTitle: string;
  list: string[];
  description: string[];
}

const SERVICES_DATA: ServiceItem[] = [
  {
    id: '01',
    title: 'ANTICIPATE',
    subTitle: 'WITH AI',
    list: [
      'SIMULATE FUTURE USER BEHAVIOR',
      'AI AS DEFAULT COLLABORATOR',
      'HUMAN–AI INTERACTION STRUCTURE',
      'CONSTRAINTS BEFORE FEATURES'
    ],
    description: [
      "PRINCIPLE 01 — DESIGN FOR WHAT’S NEXT",
      "NE(O)RDS don’t react to the AI era — NE(O)RDS design ahead of it. NE(O)RDs don’t just use AI tools. NE(O)RDS study how AI reshapes workflows, teams, and product cycles — before it becomes obvious.",
      "The future of software is not human-first or AI-first. It’s system-first. NE(O)RDS don’t wait for the shift. NE(O)RDS architect for it."
    ]
  },
  {
    id: '02',
    title: 'DESIGN',
    subTitle: 'IN LOOPS',
    list: [
      'RAPID AI LAYOUT EXPLORATION',
      'SIMULTANEOUS COPY & UI TEST',
      'REAL-TIME FEEDBACK LOOPS',
      'BEHAVIOR-BACKED DECISIONS'
    ],
    description: [
      "PRINCIPLE 02 — RAPID VISUAL EXPERIMENTATION",
      "Design is not decoration — it’s iteration. NE(O)RDs don’t polish ideas. NE(O)RDS pressure-test them.",
      "Clarity comes from iteration, not inspiration. NE(O)RDS refine until it works."
    ]
  },
  {
    id: '03',
    title: 'BUILD',
    subTitle: 'TO VALIDATE',
    list: [
      'AI SCAFFOLDING & ARCHITECTURE',
      'HUMAN-IN-THE-LOOP LOGIC',
      'LIVE USAGE VALIDATION',
      'VALUE-DRIVEN FEATURE SURVIVAL'
    ],
    description: [
      "PRINCIPLE 03 — EXECUTION OVER ASSUMPTION",
      "Shipping is how NE(O)RDS discover truth. NE(O)RDs don’t build to finish. NE(O)RDS build to validate.",
      "PMF is not found by thinking harder. It is constructed through disciplined iteration."
    ]
  }
];

export const ServicesSection: React.FC = () => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [cursorSide, setCursorSide] = useState<'left' | 'right'>('right');

  // Infinite Loop Logic
  // We wrap the items: [Last, ...Originals, First]
  // 3 items -> [2, 0, 1, 2, 0]
  const extendedServices = useMemo(() => {
    return [
      SERVICES_DATA[SERVICES_DATA.length - 1],
      ...SERVICES_DATA,
      SERVICES_DATA[0]
    ];
  }, []);

  // Start at index 1 (the first real item)
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Slide Config
  // Desktop: 80vw width + 5vw gap = 85vw stride
  // Mobile: 90vw width + 5vw gap = 95vw stride
  const getStride = () => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 768 ? 85 : 95;
    }
    return 85;
  };

  // Mouse Cursor
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const cursorX = useSpring(mouseX, { stiffness: 500, damping: 28 });
  const cursorY = useSpring(mouseY, { stiffness: 500, damping: 28 });

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  };

  // Handle Loop Snap
  useEffect(() => {
    if (!isTransitioning) return;

    const timeout = setTimeout(() => {
      // If we are at the ghost last element (index = length - 1), snap to real first (index 1)
      if (currentIndex === extendedServices.length - 1) {
        setIsTransitioning(false);
        setCurrentIndex(1);
      }
      // If we are at the ghost first element (index = 0), snap to real last (index = length - 2)
      else if (currentIndex === 0) {
        setIsTransitioning(false);
        setCurrentIndex(extendedServices.length - 2);
      } else {
        setIsTransitioning(false);
      }
    }, 600); // Match transition duration

    return () => clearTimeout(timeout);
  }, [currentIndex, isTransitioning, extendedServices.length]);


  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();

    // Update MotionValues with Global Coordinates for Fixed Cursor
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);

    // Calculate relative X for logic
    const relativeX = e.clientX - rect.left;

    setIsHovering(true);
    if (relativeX < rect.width / 2) setCursorSide('left');
    else setCursorSide('right');
  };

  const handleContainerClick = () => {
    if (window.innerWidth < 768) return;
    if (cursorSide === 'left') handlePrev();
    else handleNext();
  };

  // Display Index for the UI (01, 02, 03)
  // extended indices: 0(Real 2), 1(Real 0), 2(Real 1), 3(Real 2), 4(Real 0)
  // Map internal index to 1-based display ID
  const getDisplayId = (idx: number) => {
    if (idx === 0) return SERVICES_DATA[SERVICES_DATA.length - 1].id;
    if (idx === extendedServices.length - 1) return SERVICES_DATA[0].id;
    return SERVICES_DATA[idx - 1].id;
  };

  const currentDisplayId = getDisplayId(currentIndex);

  return (
    <section id="services" className="relative w-full bg-brand-bg text-brand-red py-24 md:py-32 overflow-hidden z-20">
      <div className="w-full">

        {/* Header */}
        <div className="w-full max-w-[96%] mx-auto px-4 mb-20 md:mb-32">
          <div className="text-[10vw] md:text-[6vw] font-display leading-[0.85] tracking-tighter uppercase text-brand-red">
            <span className="block"><TextReveal delay={0}>HOW NE(O)RDs</TextReveal></span>
            <div className="flex flex-wrap items-baseline gap-4 md:gap-8">
              <span className="block text-brand-red"><TextReveal delay={0.2}>DIVE DEEP</TextReveal></span>
            </div>
          </div>
        </div>

        {/* Slider Track Container */}
        <div
          ref={sliderRef}
          className="relative min-h-[60vh] md:min-h-[50vh] md:cursor-none select-none overflow-hidden local-cursor-area"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setIsHovering(false)}
          onClick={handleContainerClick}
        >
          {/* Custom Cursor - FIXED POSITION to prevent clipping */}
          <motion.div
            className="hidden md:flex fixed top-0 left-0 pointer-events-none z-50 flex-col items-center justify-center gap-2 mix-blend-difference text-[#EBEBEB]"
            style={{
              x: cursorX,
              y: cursorY,
              position: 'fixed',
              top: 0,
              left: 0,
              translateX: '-50%',
              translateY: '-50%',
              opacity: isHovering ? 1 : 0
            }}
          >
            <div className="w-24 h-24 flex items-center justify-center">
              {cursorSide === 'left' ? (
                <svg viewBox="0 0 21 18" className="w-20 h-20 fill-current rotate-0"><path d="M9.8 16.7c.3-.3.3-.8 0-1.2l-4.3-4.2c-.3-.3-.2-.6.2-.6h13.6c.4 0 .8-.4.8-.8v-1c0-.5-.4-.9-.8-.9H5.7c-.4 0-.5-.4-.2-.6L9.8 3c.3-.3.4-.7 0-1.1L9 1.3C8.7.9 8.3.9 8 1.3L.5 8.8c-.3.3-.3.8 0 1L8 17.5c.3.3.7.3 1.1 0l.7-.7Z"></path></svg>
              ) : (
                <svg viewBox="0 0 20 18" className="w-20 h-20 fill-current rotate-0"><path d="M10.4 16.7c-.3-.3-.4-.8 0-1.2l4.3-4.2c.3-.3.1-.6-.2-.6H.9a.8.8 0 0 1-.8-.8v-1c0-.5.4-.9.8-.9h13.6c.3 0 .5-.4.2-.6L10.4 3c-.4-.3-.4-.7 0-1.1l.7-.7c.3-.4.7-.4 1.1 0l7.4 7.5c.4.3.4.8 0 1l-7.4 7.6c-.4.3-.8.3-1.1 0l-.7-.7Z"></path></svg>
              )}
            </div>
            <span className="text-3xl font-display tracking-widest">
              {currentDisplayId}-{String(SERVICES_DATA.length).padStart(2, '0')}
            </span>
          </motion.div>

          {/* Track */}
          <motion.div
            className="flex items-start pl-[4vw] md:pl-[4vw]"
            animate={{ x: `-${currentIndex * (window.innerWidth >= 768 ? 85 : 95)}vw` }}
            transition={{
              duration: isTransitioning ? 0.6 : 0,
              ease: [0.22, 1, 0.36, 1]
            }}
          >
            {extendedServices.map((service, idx) => (
              <div
                key={`${service.id}-${idx}`}
                className="w-[90vw] md:w-[80vw] shrink-0 mr-[5vw]"
              >
                <div className="grid grid-cols-1 md:grid-cols-10 gap-12 md:gap-4 w-full">
                  {/* Left Col: Title & List */}
                  <div className="md:col-span-5 flex flex-col justify-between h-full">
                    <div>
                      <div className="mb-6 md:mb-10">
                        <h3 className="text-5xl md:text-7xl lg:text-8xl font-display leading-[0.85] tracking-tighter uppercase text-brand-red">
                          <span className="block opacity-50 text-2xl md:text-3xl mb-2 font-sans font-medium tracking-normal">({service.id})</span>
                          <span className="block"><TextReveal delay={0}>{service.title}</TextReveal></span>
                          <span className="block text-brand-red"><TextReveal delay={0.2}>{service.subTitle}</TextReveal></span>
                        </h3>
                      </div>

                      <ul className="space-y-2 md:space-y-1">
                        {service.list.map((item, i) => (
                          <li key={i} className="text-sm md:text-base font-bold uppercase tracking-wider flex items-center gap-2 group cursor-default">
                            <span className="text-brand-red opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</span>
                            <span className="group-hover:translate-x-2 transition-transform duration-300">
                              <TextReveal delay={0.4} glitchDelay={0.4 + (i * 0.1)} speed="fast" mode="word">{item}</TextReveal>
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Right Col: Description */}
                  <div className="md:col-span-5 flex flex-col justify-start md:pt-24">
                    <div className="font-sans text-lg md:text-xl lg:text-2xl leading-tight space-y-6 md:space-y-8 font-light uppercase">
                      {service.description.map((desc, i) => (
                        <p key={i}>
                          <TextReveal delay={0.4} glitchDelay={0.4 + (i * 0.2)} speed="fast" mode="word">{desc}</TextReveal>
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Bottom Nav */}
        <motion.div
          className="w-full max-w-[96%] mx-auto px-4 flex justify-between items-end mt-12 md:mt-12 pt-12 border-t border-brand-red/20"
          animate={{ opacity: isHovering && window.innerWidth >= 768 ? 0 : 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-4xl md:text-6xl font-display text-brand-red opacity-20">
            {currentDisplayId}-{String(SERVICES_DATA.length).padStart(2, '0')}
          </div>
          <div className="flex gap-4 md:pointer-events-none">
            <button
              onClick={(e) => { e.stopPropagation(); handlePrev(); }}
              className="w-12 h-12 md:w-16 md:h-16 border border-brand-red/20 rounded-full flex items-center justify-center hover:bg-brand-red hover:text-brand-bg transition-colors duration-300 group md:pointer-events-auto"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 18" className="w-5 h-5 md:w-6 md:h-6 fill-current group-hover:fill-brand-bg">
                <path d="M9.8 16.7c.3-.3.3-.8 0-1.2l-4.3-4.2c-.3-.3-.2-.6.2-.6h13.6c.4 0 .8-.4.8-.8v-1c0-.5-.4-.9-.8-.9H5.7c-.4 0-.5-.4-.2-.6L9.8 3c.3-.3.4-.7 0-1.1L9 1.3C8.7.9 8.3.9 8 1.3L.5 8.8c-.3.3-.3.8 0 1L8 17.5c.3.3.7.3 1.1 0l.7-.7Z"></path>
              </svg>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
              className="w-12 h-12 md:w-16 md:h-16 border border-brand-red/20 rounded-full flex items-center justify-center hover:bg-brand-red hover:text-brand-bg transition-colors duration-300 group md:pointer-events-auto"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 18" className="w-5 h-5 md:w-6 md:h-6 fill-current group-hover:fill-brand-bg">
                <path d="M10.4 16.7c-.3-.3-.4-.8 0-1.2l4.3-4.2c.3-.3.1-.6-.2-.6H.9a.8.8 0 0 1-.8-.8v-1c0-.5.4-.9.8-.9h13.6c.3 0 .5-.4.2-.6L10.4 3c-.4-.3-.4-.7 0-1.1l.7-.7c.3-.4.7-.4 1.1 0l7.4 7.5c.4.3.4.8 0 1l-7.4 7.6c-.4.3-.8.3-1.1 0l-.7-.7Z"></path>
              </svg>
            </button>
          </div>
        </motion.div>

      </div>
    </section>
  );
};