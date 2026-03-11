import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { Users, Building2, MapPin, Database, Zap, Globe, ArrowUpRight } from 'lucide-react';
import { StudioContentWrapper } from '../studio/StudioContentWrapper';
import { UMCOsContentWrapper } from '../studio/UMCOsContentWrapper';
import { CMCOsContentWrapper } from '../studio/CMCOsContentWrapper';

export const Infrastructure = ({
    onNavigate,
    onTogglePause,
    isActive = false,
    isExiting = false,
    exitDirection = 'left'
}: {
    onNavigate?: (index: number) => void,
    onTogglePause?: (paused: boolean) => void,
    isActive?: boolean,
    isExiting?: boolean,
    exitDirection?: 'left' | 'right'
}) => {
    const sectionRef = useRef<HTMLElement>(null);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [hasVisitedStudio, setHasVisitedStudio] = useState(false);
    const [manualOpen, setManualOpen] = useState(false);
    const [isStudioMinimized, setIsStudioMinimized] = useState(false);
    const [isUmcOsOpen, setIsUmcOsOpen] = useState(false);
    const [isUmcOsMinimized, setIsUmcOsMinimized] = useState(false);
    const [isCmcOsOpen, setIsCmcOsOpen] = useState(false);
    const [isCmcOsMinimized, setIsCmcOsMinimized] = useState(false);
    const [isAnimationComplete, setIsAnimationComplete] = useState(false);

    const gridItems = [
        {
            span: "md:col-span-2 md:row-span-2",
            content: (
                <div
                    onClick={() => setManualOpen(true)}
                    className="w-full h-full bg-black border-[0.25rem] border-white/20 p-12 flex flex-col relative overflow-hidden group min-h-[25rem] cursor-pointer hover:border-accent transition-colors duration-500"
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
                    <div className="relative z-20 flex flex-col h-full uppercase">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-16 h-8 bg-accent" />
                            <h3 className="text-4xl lg:text-5xl font-black text-white tracking-tighter leading-[0.85]">NE(O)RDINARY</h3>
                            <ArrowUpRight className="w-10 h-10 lg:w-12 lg:h-12 text-accent group-hover:translate-x-4 group-hover:-translate-y-4 transition-transform" />
                        </div>
                        <p className="mt-8 text-sm lg:text-base text-white font-bold uppercase leading-[1.2] tracking-wide max-w-[280px]">
                            THE CENTRAL ENGINE ORCHESTRATING THE LARGEST AI TALENT PIPELINE.
                        </p>
                        <div className="mt-auto flex flex-wrap gap-4">
                            <span className="px-8 py-3 bg-white text-black text-xs font-black tracking-[0.4em]">ECOSYSTEM</span>
                            <span className="px-8 py-3 bg-accent text-black text-xs font-black tracking-[0.4em]">INCUBATOR</span>
                        </div>
                    </div>
                    {hasVisitedStudio && (
                        <div className="absolute top-12 right-12 z-30 px-6 py-2 bg-accent text-black text-xs font-black uppercase tracking-[0.4em] animate-pulse border-4 border-black">
                            RE-VISIT
                        </div>
                    )}
                </div>
            )
        },
        {
            span: "md:col-span-1 md:row-span-1",
            content: (
                <div className="w-full h-full bg-white p-10 flex flex-col justify-between group hover:bg-accent transition-all duration-500 border-b-[1.5rem] border-black">
                    <div className="flex justify-between items-start text-black">
                        <div className="bg-black p-3"><Users className="w-8 h-8 text-white" /></div>
                        <ArrowUpRight className="w-8 h-8 opacity-30 group-hover:opacity-100 group-hover:rotate-45 transition-all" />
                    </div>
                    <div className="uppercase">
                        <div className="text-5xl lg:text-6xl font-black text-black tracking-tighter mb-2 leading-[0.8]">6,000<span className="group-hover:text-white transition-colors">+</span></div>
                        <div className="text-[0.65rem] font-black text-black/40 uppercase tracking-[0.2em] leading-normal group-hover:text-black transition-colors">Active Developers</div>
                    </div>
                </div>
            )
        },
        {
            span: "md:col-span-1 md:row-span-1",
            content: (
                <div className="w-full h-full bg-[#111] border-[0.25rem] border-white/10 p-10 flex flex-col justify-between group hover:border-accent transition-all duration-500 border-b-[1.5rem]">
                    <div className="flex justify-between items-start text-white">
                        <div className="bg-white/10 p-3"><Building2 className="w-8 h-8" /></div>
                        <ArrowUpRight className="w-8 h-8 opacity-30 group-hover:translate-x-2 transition-transform" />
                    </div>
                    <div className="uppercase">
                        <div className="text-5xl lg:text-6xl font-black text-white tracking-tighter mb-2 leading-[0.8]">55</div>
                        <div className="text-[0.65rem] font-black text-white/20 uppercase tracking-[0.2em] leading-normal">Partner Universities</div>
                    </div>
                </div>
            )
        },
        {
            span: "md:col-span-1 md:row-span-1",
            content: (
                <div
                    onClick={() => setIsUmcOsOpen(true)}
                    className="w-full h-full bg-[#0A0A0A] border-4 border-white/5 p-10 flex flex-col items-center justify-center text-center group relative overflow-hidden uppercase hover:bg-accent hover:text-black transition-all duration-700 cursor-pointer"
                >
                    <div className="absolute inset-0 border-r-[1rem] border-accent/20" />
                    <Zap className="w-12 h-12 lg:w-16 lg:h-16 text-accent mb-6 relative z-10 group-hover:text-black transition-colors" />
                    <div className="text-4xl lg:text-5xl font-black text-white mb-2 tracking-tighter leading-[0.8] relative z-10 group-hover:text-black transition-colors">UMC</div>
                    <div className="text-[0.65rem] font-black text-white/20 uppercase tracking-[0.2em] leading-normal relative z-10 group-hover:text-black transition-colors">Makeus Challenge</div>
                </div>
            )
        },
        {
            span: "md:col-span-1 md:row-span-1",
            content: (
                <div
                    onClick={() => setIsCmcOsOpen(true)}
                    className="w-full h-full bg-[#0A0A0A] border-4 border-white/5 p-10 flex flex-col items-center justify-center text-center group relative overflow-hidden uppercase hover:bg-white hover:text-black transition-all duration-700 cursor-pointer"
                >
                    <div className="absolute inset-0 border-l-[1rem] border-white/20" />
                    <Globe className="w-12 h-12 lg:w-16 lg:h-16 text-blue-500 mb-6 relative z-10 group-hover:text-black transition-colors" />
                    <div className="text-4xl lg:text-5xl font-black text-white mb-2 tracking-tighter leading-[0.8] relative z-10 group-hover:text-black transition-colors">CMC</div>
                    <div className="text-[0.65rem] font-black text-white/20 uppercase tracking-[0.2em] leading-normal relative z-10 group-hover:text-black transition-colors">Central Makeus</div>
                </div>
            )
        },
        {
            span: "md:col-span-2 md:row-span-1",
            content: (
                <div className="w-full h-full bg-accent p-12 flex justify-between items-center group relative overflow-hidden border-4 border-white">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none group-hover:scale-125 transition-transform">
                        <MapPin size={120} className="text-black" />
                    </div>
                    <div className="relative z-10 uppercase">
                        <div className="text-5xl lg:text-7xl font-black text-black tracking-tighter mb-2 leading-[0.8]">1,200<span className="text-white">+</span></div>
                        <div className="text-[0.65rem] lg:text-xs font-black text-black/60 uppercase tracking-[0.3em] leading-normal">Annual Offline Participants</div>
                    </div>
                    <div className="relative z-10 p-4 lg:p-6 bg-black"><ArrowUpRight size={32} className="text-white group-hover:rotate-45 transition-transform" /></div>
                </div>
            )
        },
        {
            span: "md:col-span-2 md:row-span-1",
            content: (
                <div className="w-full h-full bg-[#111] border-4 border-white/10 p-12 flex justify-between items-center group relative overflow-hidden hover:border-white transition-colors duration-500">
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:scale-y-100 scale-y-0 origin-bottom transition-transform duration-500" />
                    <div className="relative z-10 uppercase">
                        <div className="text-5xl lg:text-7xl font-black text-white group-hover:text-black tracking-tighter mb-2 leading-[0.8] transition-colors">4,896</div>
                        <div className="text-[0.65rem] lg:text-xs font-black text-white/20 group-hover:text-black/60 uppercase tracking-[0.3em] leading-normal transition-colors">Registered Workers</div>
                    </div>
                    <div className="relative z-10 p-4 lg:p-6 bg-white/5 group-hover:bg-black transition-colors"><Database size={32} className="text-white/40 group-hover:text-accent transition-colors" /></div>
                </div>
            )
        }
    ];

    const [animPhase, setAnimPhase] = useState(0);

    useEffect(() => {
        let isMounted = true;

        const runSequence = async () => {
            if (!isMounted) return;

            // 1. Wait 2000ms for video transition
            await new Promise(r => setTimeout(r, 2000));
            if (!isMounted) return;

            // 3. Move up layout (ease-out)
            setAnimPhase(1);

            await new Promise(r => setTimeout(r, 400));
            if (!isMounted) return;

            // 4. Show Numbers (Pink 1) & Title (Pink 2 is the zoom/move above)
            setAnimPhase(2);

            await new Promise(r => setTimeout(r, 200));
            if (!isMounted) return;

            // 5. Show Subtitle (Pink 3)
            setAnimPhase(3);

            // 6. Final mark as complete to unlock scroll
            await new Promise(r => setTimeout(r, 800)); // Buffer for stagger animations
            if (!isMounted) return;
            setIsAnimationComplete(true);
        };

        if (isActive) {
            runSequence();
        } else {
            setAnimPhase(0);
            setIsAnimationComplete(false);
        }

        return () => { isMounted = false; };
    }, [isActive]);

    const layoutVariants: any = {
        hidden: { y: '10vh', opacity: 0 },
        visible: { y: -40, opacity: 1, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
        exitLeft: { x: '-100vw', transition: { duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] } },
        exitRight: { x: '100vw', transition: { duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] } }
    };
    const numberVariants: any = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.33, 1, 0.68, 1] } }
    };
    const subtitleVariants: any = {
        hidden: { opacity: 0, x: -50 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.33, 1, 0.68, 1] } }
    };

    const currentLayoutState = isExiting ? (exitDirection === 'left' ? 'exitLeft' : 'exitRight') : (animPhase >= 1 ? 'visible' : 'hidden');

    // Custom Event Listener for Studio Trigger from App.tsx or Evaluation.tsx
    useEffect(() => {
        const handleStudioTrigger = () => {
            if (!hasVisitedStudio) setManualOpen(true);
        };
        const handleUmcTrigger = () => setIsUmcOsOpen(true);
        const handleCmcTrigger = () => setIsCmcOsOpen(true);

        const section = sectionRef.current;
        if (section) {
            section.addEventListener('trigger-studio', handleStudioTrigger);
        }
        window.addEventListener('trigger-umc', handleUmcTrigger);
        window.addEventListener('trigger-cmc', handleCmcTrigger);

        return () => {
            if (section) section.removeEventListener('trigger-studio', handleStudioTrigger);
            window.removeEventListener('trigger-umc', handleUmcTrigger);
            window.removeEventListener('trigger-cmc', handleCmcTrigger);
        };
    }, [hasVisitedStudio]);

    const isStudioOpen = manualOpen;
    const isStudioActive = isStudioOpen && !isStudioMinimized;
    const isUmcOsActive = isUmcOsOpen && !isUmcOsMinimized;
    const isCmcOsActive = isCmcOsOpen && !isCmcOsMinimized;

    useEffect(() => {
        if (onTogglePause) onTogglePause(isStudioActive || isUmcOsActive || isCmcOsActive);
    }, [isStudioActive, isUmcOsActive, isCmcOsActive, onTogglePause]);

    const handleFooterReached = (isScrollExit = false) => {
        setHasVisitedStudio(true);
        setManualOpen(false);

        if (!isScrollExit) {
            const section = sectionRef.current;
            const scrollParent = section?.closest('.scroll-area');
            if (scrollParent) {
                // Return to top but mark as visited
                scrollParent.scrollTo({ top: 0, behavior: 'auto' });
            }
        }
    };

    const exitAnimation: any = {
        x: isExiting ? (exitDirection === 'left' ? '-100vw' : '100vw') : 0,
        transition: { duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }
    };

    // ... (gridItems remain same)

    return (
        <section
            id="infrastructure"
            ref={sectionRef}
            data-scroll-locked={!isAnimationComplete}
            className={`w-full min-h-[160vh] relative bg-transparent scroll-section pointer-events-none ${!hasVisitedStudio && !manualOpen ? 'studio-pending' : ''} ${animPhase >= 1 ? 'phase-5-active' : ''}`}
        >
            <div className="sticky top-0 w-full min-h-screen flex flex-col justify-start px-8 md:px-[4rem] box-border max-w-[150rem] mx-auto pointer-events-auto pb-32">



                <motion.div
                    variants={layoutVariants}
                    initial="hidden"
                    animate={currentLayoutState}
                    className={`relative flex-grow flex ${isStudioActive ? 'blur-xl' : ''}`}
                >
                    <div className="max-w-[118.75rem] mx-auto w-full pt-32 md:pt-48 grid grid-cols-1 md:grid-cols-12 gap-12 items-start z-10">
                        {/* Left Column: Header Section */}
                        <div
                            className="md:col-span-3 border-r-[0.75rem] border-accent pr-10 stagger-item h-full flex flex-col justify-start"
                            style={{ opacity: (isStudioActive ? 0.3 : 1) }}
                        >
                            <div className="flex flex-col mb-12">
                                <motion.span
                                    variants={numberVariants}
                                    initial="hidden"
                                    animate={animPhase >= 2 ? 'visible' : 'hidden'}
                                    className="text-[12rem] font-black leading-[0.75] text-white tracking-tighter"
                                >
                                    01
                                </motion.span>
                                <motion.div variants={numberVariants} initial="hidden" animate={animPhase >= 2 ? 'visible' : 'hidden'} className="w-1/2 h-4 bg-accent mt-6" />
                            </div>

                            <motion.h2
                                initial={{ opacity: 1 }}
                                className="text-6xl lg:text-7xl font-black text-white tracking-tighter uppercase leading-[0.85] mb-8 origin-left"
                            >
                                <span className="text-white">KEY</span><br />ASSETS
                            </motion.h2>
                        </div>

                        <div className="md:col-span-9 pl-0 md:pl-12 flex flex-col gap-12" style={{ opacity: (isStudioActive ? 0.3 : 1) }}>
                            <div className="w-full">
                                <motion.div variants={subtitleVariants} initial="hidden" animate={animPhase >= 3 ? 'visible' : 'hidden'} className="flex items-center gap-6 mb-8 uppercase">
                                    <div className="w-16 h-4 bg-accent" />
                                    <span className="text-accent text-lg font-black tracking-[0.6em]">PROPRIETARY ASSETS</span>
                                </motion.div>

                                <motion.p
                                    variants={numberVariants}
                                    initial="hidden"
                                    animate={animPhase >= 2 ? 'visible' : 'hidden'}
                                    className="text-2xl lg:text-3xl text-white font-black uppercase tracking-tighter leading-[0.9] border-l-[0.75rem] border-white/10 pl-12"
                                >
                                    Exploring the depth of our artificial neural networks and proprietary datasets designed for the next era of intelligent operations.
                                </motion.p>
                            </div>

                            {/* Right Column: Bento Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-3 gap-6 w-full relative z-10">
                                {gridItems.map((item, index) => (
                                    <div key={index} className={`${item.span} stagger-item`}>
                                        {item.content}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Tray Entry Component (Visual cue for Studio) */}
                <AnimatePresence>
                    {!isStudioOpen && !hasVisitedStudio && isActive && (
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: '0%' }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200, delay: 1 }}
                            className="absolute bottom-0 left-0 w-full h-24 bg-white border-t-[0.75rem] border-black flex items-center justify-between px-16 z-50 pointer-events-none"
                        >
                            <div className="flex items-center gap-6">
                                <div className="w-4 h-4 bg-accent animate-ping" />
                                <span className="text-black font-black text-2xl tracking-[0.5em] uppercase">SYSTEM.INITIALIZING...</span>
                            </div>
                            <span className="text-black/40 font-black tracking-widest uppercase">Scroll down to enter Studio</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Studio Content Modal */}
            {isStudioActive && createPortal(
                <StudioContentWrapper
                    scrollProgress={1} // Static since we don't have scrolling space
                    onFooterReached={handleFooterReached}
                    onMinimize={() => setIsStudioMinimized(true)}
                />,
                document.body
            )}

            {/* UMC OS Content Modal */}
            {isUmcOsActive && createPortal(
                <UMCOsContentWrapper
                    onClose={() => setIsUmcOsOpen(false)}
                    onMinimize={() => setIsUmcOsMinimized(true)}
                />,
                document.body
            )}

            {/* CMC OS Content Modal */}
            {isCmcOsActive && createPortal(
                <CMCOsContentWrapper
                    onClose={() => setIsCmcOsOpen(false)}
                    onMinimize={() => setIsCmcOsMinimized(true)}
                />,
                document.body
            )}

            {/* Left-aligned Unified Widgets Container */}
            {createPortal(
                <div className="fixed bottom-8 left-8 flex flex-col gap-4 z-[100] pointer-events-none items-start">
                    {/* Persistent CMC Widget */}
                    {!isCmcOsActive && (
                        <button
                            onClick={() => {
                                setIsCmcOsMinimized(false);
                                setIsCmcOsOpen(true);
                            }}
                            className="bg-white text-black px-6 py-4 font-black uppercase tracking-[0.3em] border-[8px] border-black hover:bg-black hover:text-white transition-colors duration-300 shadow-[0.75rem_0.75rem_0_0_rgba(230,0,35,1)] flex items-center gap-4 group cursor-pointer pointer-events-auto"
                        >
                            <div className="w-3 h-3 bg-[#E60023]" />
                            <span className="group-hover:text-[#E60023] transition-colors mt-1">CMC SLIDER</span>
                        </button>
                    )}

                    {/* Persistent UMC OS Widget */}
                    {!isUmcOsActive && (
                        <button
                            onClick={() => {
                                setIsUmcOsMinimized(false);
                                setIsUmcOsOpen(true);
                            }}
                            className="bg-white text-black px-6 py-4 font-black uppercase tracking-[0.3em] border-[8px] border-black hover:bg-black hover:text-white transition-colors duration-300 shadow-[0.75rem_0.75rem_0_0_rgba(59,130,246,1)] flex items-center gap-4 group cursor-pointer pointer-events-auto"
                        >
                            <div className="w-3 h-3 bg-blue-500" />
                            <span className="group-hover:text-blue-500 transition-colors mt-1">UMC PROJECTS</span>
                        </button>
                    )}

                    {/* Minimized Studio Widget */}
                    {(isStudioMinimized || (hasVisitedStudio && !isStudioOpen)) && (
                        <button
                            onClick={() => {
                                setIsStudioMinimized(false);
                                setManualOpen(true);
                            }}
                            className="bg-white text-black px-6 py-4 font-black uppercase tracking-[0.3em] border-[8px] border-black hover:bg-black hover:text-white transition-colors duration-300 shadow-[0.75rem_0.75rem_0_0_rgba(168,85,247,1)] flex items-center gap-4 group cursor-pointer pointer-events-auto"
                        >
                            <div className="w-3 h-3 bg-accent" />
                            <span className="group-hover:text-accent transition-colors mt-1">NEORDINARY STUDIO</span>
                        </button>
                    )}
                </div>,
                document.body
            )}
        </section>
    );
};