import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LoadingSequence } from './LoadingSequence';
import { Navigation } from './Navigation';
import { CustomCursor } from './CustomCursor';

interface StudioContentWrapperProps {
    onFooterReached: (isScrollExit?: boolean) => void;
    scrollProgress: number; // 0 to 1 for the transition phase
    onMinimize?: () => void;
}

export const StudioContentWrapper: React.FC<StudioContentWrapperProps> = ({ onFooterReached, scrollProgress, onMinimize }) => {
    const [loadingComplete, setLoadingComplete] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const [hasTriggeredStart, setHasTriggeredStart] = useState(false);
    const [isExiting, setIsExiting] = useState(false);
    const [exitDirection, setExitDirection] = useState<'bottom-left' | 'left'>('bottom-left');
    const hasCalledClose = useRef(false);

    // Trigger loading sequence logic
    useEffect(() => {
        if (scrollProgress >= 0.99 && !hasTriggeredStart) {
            setHasTriggeredStart(true);
        }
    }, [scrollProgress, hasTriggeredStart]);

    const handleSequenceComplete = () => {
        setLoadingComplete(true);
    };

    const handleClose = async (isScrollExit = false) => {
        if (hasCalledClose.current) return;
        hasCalledClose.current = true;

        setIsExiting(true);
        setExitDirection(isScrollExit ? 'left' : 'bottom-left');

        // Duration for exit animation
        setTimeout(() => {
            onFooterReached(isScrollExit);
        }, 800);
    };

    // Scroll handling for Studio Content
    useEffect(() => {
        const handleWheel = (e: WheelEvent) => {
            if (!loadingComplete || isExiting) return;
            const target = containerRef.current;
            if (!target) return;

            const isAtBottom = Math.abs(target.scrollHeight - target.scrollTop - target.clientHeight) <= 15;

            // Footer exit scroll -> Moves LEFT and goes directly to Stage 02
            if (isAtBottom && e.deltaY > 60) {
                handleClose(true);
            }
        };

        const container = containerRef.current;
        if (container) {
            container.addEventListener('wheel', handleWheel, { passive: true });
        }

        return () => {
            if (container) {
                container.removeEventListener('wheel', handleWheel);
            }
        };
    }, [loadingComplete, isExiting]);

    // Global scroll lock for when Studio is active
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
            document.documentElement.style.overflow = 'auto';
        };
    }, []);

    return (
        <motion.div
            id="studio-backdrop"
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-end justify-center pb-0 md:pb-12 px-4 md:px-12 studio-active pointer-events-auto cursor-pointer"
            initial={{ opacity: 0 }}
            animate={isExiting ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.5 }}
            onClick={() => handleClose(false)}
        >
            <motion.div
                ref={containerRef}
                className={`relative w-full max-w-[2000px] h-[95vh] md:h-[90vh] bg-[#EBEBEB] border-[8px] md:border-[16px] border-black shadow-[0_0_0_4px_rgba(255,255,255,0.1),20px_20px_0_0_rgba(168,85,247,1)] overflow-hidden flex flex-col rounded-t-3xl md:rounded-none ${(loadingComplete || hasTriggeredStart) && !isExiting ? 'overflow-y-auto' : ''}`}
                initial={{ y: "100%", x: "0%" }}
                animate={isExiting
                    ? { y: exitDirection === 'left' ? "0%" : "100%", x: exitDirection === 'left' ? "-100%" : "0%" }
                    : { y: "0%", x: "0%" }
                }
                transition={isExiting ? { duration: 0.8, ease: [0.32, 0, 0.67, 0] } : { type: 'spring', damping: 30, stiffness: 200 }}
                style={{ cursor: 'none' }}
                onClick={(e) => e.stopPropagation()}
            >
                <CustomCursor />

                <Navigation
                    show={!isExiting}
                    containerRef={containerRef}
                    onClose={() => handleClose(false)} // Button exit -> Bottom-Left back to grid
                    onMinimize={onMinimize}
                />

                <motion.div
                    className="relative w-full min-h-screen"
                    animate={isExiting ? { y: exitDirection === 'left' ? 0 : "40%", opacity: 0, transition: { duration: 0.6, ease: "easeIn" } } : { y: 0, opacity: 1 }}
                >
                    {hasTriggeredStart ? (
                        <LoadingSequence onComplete={handleSequenceComplete} containerRef={containerRef} />
                    ) : (
                        <div className="w-full h-screen bg-[#EBEBEB]" />
                    )}

                    {loadingComplete && (
                        <div className="w-full h-80 flex flex-col items-center justify-center bg-[#EBEBEB] text-[#FF1F1F] font-bold uppercase tracking-widest opacity-30 pb-40">
                            <span className="mb-4 text-xs font-sans italic">EOF</span>
                            <span className="text-xl font-display">Scroll down to advance to AiOPS System</span>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </motion.div>
    );
};
