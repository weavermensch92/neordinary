import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Navigation } from './Navigation';
import { LoadingSequence } from './LoadingSequence';

import Panel3D from '../cmc/Panel3D';
import DetailView from '../cmc/DetailView';
import GridBackground from '../cmc/GridBackground';
import ConnectingLines from '../cmc/ConnectingLines';
import CohortNavigator from '../cmc/CohortNavigator';
import CustomCursor from '../cmc/CustomCursor';
import AIChat from '../cmc/AIChat';
import { generateSystemLogs } from '../cmc/lib/geminiService';
import { SystemLog } from '../cmc/types';

interface CMCOsContentWrapperProps {
    onClose: () => void;
    onMinimize?: () => void;
}

export const CMCOsContentWrapper: React.FC<CMCOsContentWrapperProps> = ({ onClose, onMinimize }) => {
    // Basic structural states
    const [loadingComplete, setLoadingComplete] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isExiting, setIsExiting] = useState(false);
    const hasCalledClose = useRef(false);
    const [language, setLanguage] = useState<'en' | 'ko'>('en'); // default English
    const handleSequenceComplete = () => setLoadingComplete(true);

    const handleClose = () => {
        if (hasCalledClose.current) return;
        hasCalledClose.current = true;
        setIsExiting(true);
        setTimeout(() => onClose(), 800);
    };

    // --- CMC Slider Logic (from App.tsx) ---
    const [logs, setLogs] = useState<SystemLog[]>([]);
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [isPaused, setIsPaused] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);
    const [lastDirection, setLastDirection] = useState<number>(1);
    
    // Filter State
    const [filteredIndices, setFilteredIndices] = useState<number[]>([]);
    const [isFiltered, setIsFiltered] = useState<boolean>(false);

    // Fixed Grid Settings
    const gridRotation = { x: 15, y: 0, z: 34 };
    const gridPosition = { x: 0, y: 0, z: -400 };

    // Scroll Accumulator for reducing sensitivity
    const scrollAccumulator = useRef<number>(0);
    const SCROLL_THRESHOLD = 300; // Higher value = lower sensitivity

    // Initialize Data & Inject Separators
    useEffect(() => {
        if (!loadingComplete) return;
        const fetchData = async () => {
            setLoading(true);
            const rawData = await generateSystemLogs(73);
            
            const processedData: SystemLog[] = [];
            let lastCohort = '';

            rawData.forEach((item, index) => {
                if (item.cohort && item.cohort !== lastCohort) {
                    processedData.push({
                        id: `sep-${item.cohort}`,
                        type: 'SEPARATOR',
                        timestamp: item.timestamp,
                        module: `COHORT ${item.cohort}`,
                        status: 'SEPARATOR',
                        efficiency: item.efficiency,
                        message: `Beginning of ${item.cohort} projects.`,
                        coordinates: { x: 0, y: 0, z: 0 },
                        cohort: item.cohort,
                        keywords: 'ARCHIVE // SECTION'
                    });
                    lastCohort = item.cohort;
                }
                
                processedData.push({ ...item, type: 'PROJECT' });
            });

            setLogs(processedData);
            if (processedData.length > 0) setActiveIndex(0);
            setLoading(false);
        };
        fetchData();
    }, [loadingComplete]);

    // Search Logic
    const handleSearch = (query: string) => {
        const lowerQuery = query.toLowerCase();
        const matches: number[] = [];
        logs.forEach((log, index) => {
            if (log.type === 'SEPARATOR') return;
            const matchFound = 
                (log.module && log.module.toLowerCase().includes(lowerQuery)) ||
                (log.keywords && log.keywords.toLowerCase().includes(lowerQuery)) ||
                (log.message && log.message.toLowerCase().includes(lowerQuery)) ||
                (log.cohort && log.cohort.toLowerCase().includes(lowerQuery));
                
            if (matchFound) matches.push(index);
        });

        if (matches.length > 0) {
            setFilteredIndices(matches);
            setIsFiltered(true);
            setActiveIndex(matches[0]);
            setIsPaused(false);
        }
    };

    const handleResetFilter = () => {
        setIsFiltered(false);
        setFilteredIndices([]);
        setIsPaused(false);
    };

    // Wheel Scroll Handler with Accumulator
    useEffect(() => {
        if (!loadingComplete) return;
        const handleWheel = (e: WheelEvent) => {
            if (isPaused) return;

            // Stop propagation to prevent window from scrolling while in this modal
            e.stopPropagation();

            scrollAccumulator.current += e.deltaY;

            if (Math.abs(scrollAccumulator.current) > SCROLL_THRESHOLD) {
                const direction = scrollAccumulator.current > 0 ? 1 : -1;
                setLastDirection(direction);

                if (isFiltered) {
                    setActiveIndex(prev => {
                        const currentFilteredIndex = filteredIndices.indexOf(prev);
                        if (currentFilteredIndex === -1) return prev; 
                        let nextFilteredIndex = currentFilteredIndex + direction;
                        if (nextFilteredIndex >= filteredIndices.length) nextFilteredIndex = 0;
                        if (nextFilteredIndex < 0) nextFilteredIndex = filteredIndices.length - 1;
                        return filteredIndices[nextFilteredIndex];
                    });
                } else {
                    setActiveIndex(prev => {
                        let next = prev + direction;
                        if (next >= logs.length) next = 0;
                        if (next < 0) next = logs.length - 1;
                        return next;
                    });
                }
                scrollAccumulator.current = 0;
            }
        };

        const modalDiv = containerRef.current;
        if (modalDiv) {
             modalDiv.addEventListener('wheel', handleWheel, { passive: false });
        }
        
        return () => {
             if (modalDiv) modalDiv.removeEventListener('wheel', handleWheel);
        }
    }, [logs.length, isPaused, isFiltered, filteredIndices, loadingComplete]);

    // Auto-scroll on Separator
    useEffect(() => {
        if (logs.length === 0 || isPaused || isFiltered) return;

        const currentItem = logs[activeIndex];
        if (currentItem?.type === 'SEPARATOR') {
            const timer = setTimeout(() => {
                setActiveIndex(prev => {
                    let next = prev + lastDirection;
                    if (next >= logs.length) next = 0;
                    if (next < 0) next = logs.length - 1;
                    return next;
                });
            }, 700); 
            return () => clearTimeout(timer);
        }
    }, [activeIndex, logs, isPaused, lastDirection, isFiltered]);

    const handleBackgroundClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isFiltered) handleResetFilter();
        else if (isPaused) setIsPaused(false);
    };

    const handlePauseInteraction = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsPaused(true);
    };

    const handlePanelClick = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        const index = logs.findIndex(l => l.id === id);
        if (index !== -1) {
            if (isFiltered && !filteredIndices.includes(index)) return;
            setActiveIndex(index);
            setIsPaused(true);
        }
    };

    const handleNavigatorSelect = (index: number) => {
        if (isFiltered) handleResetFilter(); 
        setActiveIndex(index);
        setLastDirection(1); 
        setIsPaused(false); 
    };
    
    const selectedLog = logs[activeIndex] || null;

    const [activeLayer, setActiveLayer] = useState<'chat' | 'detail'>('detail');
    const [isAnimatingLayer, setIsAnimatingLayer] = useState(false);

    const switchLayer = (target: 'chat' | 'detail') => {
        if (activeLayer === target || isAnimatingLayer) return;
        setIsAnimatingLayer(true);
        setActiveLayer(target);
        setTimeout(() => setIsAnimatingLayer(false), 500);
    };

    // Global scroll lock
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
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-end justify-center pb-0 md:pb-12 px-4 md:px-12 pointer-events-auto"
            initial={{ opacity: 0 }}
            animate={isExiting ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.5 }}
            onClick={handleClose}
        >
            <motion.div
                ref={containerRef}
                className="relative w-full max-w-[2000px] h-[95vh] md:h-[90vh] bg-[#e0e0e0] border-[8px] md:border-[16px] border-black shadow-[0_0_0_4px_rgba(255,255,255,0.1),20px_20px_0_0_rgba(230,0,35,1)] overflow-hidden flex flex-col rounded-t-3xl md:rounded-none select-none font-sans cursor-none text-[#E60023]"
                initial={{ y: "100%" }}
                animate={isExiting ? { y: "100%" } : { y: "0%" }}
                transition={{ type: 'spring', damping: 30, stiffness: 200 }}
                onClick={handleBackgroundClick}
            >
                <CustomCursor isPaused={isPaused} isFiltered={isFiltered} />

                <Navigation
                    show={loadingComplete && !isExiting}
                    containerRef={containerRef}
                    onClose={handleClose}
                    onMinimize={onMinimize}
                    isMinimal={true}
                />

                <div className="relative w-full h-full overflow-hidden">
                    {!loadingComplete && (
                        <LoadingSequence onComplete={handleSequenceComplete} />
                    )}

                    {loadingComplete && (
                        <>
                            {/* Header / HUD */}
                            <div className="absolute top-16 left-12 z-50 pointer-events-none mt-4">
                                <div className="relative flex flex-col gap-1">
                                    {/* Pill Switch Language Toggle */}
                                    <div className="absolute -top-10 left-0 flex flex-col items-center gap-0.5">
                                        <div 
                                            onClick={() => setLanguage(prev => prev === 'en' ? 'ko' : 'en')}
                                            className={`
                                                pointer-events-auto cursor-pointer 
                                                w-10 h-5 rounded-full border border-[#E60023] p-[2px] 
                                                flex items-center transition-all duration-500 shadow-inner
                                                ${language === 'en' ? 'bg-[#E60023]' : 'bg-white'}
                                            `}
                                        >
                                            <div className={`
                                                w-3.5 h-3.5 rounded-full transition-all duration-500 shadow-md
                                                ${language === 'en' ? 'bg-white translate-x-[20px]' : 'bg-[#E60023] translate-x-0'}
                                            `} />
                                        </div>
                                        <div className="text-[10px] font-mono font-bold text-[#E60023] opacity-60">
                                            {language === 'en' ? 'EN' : 'KO'}
                                        </div>
                                    </div>
                                    
                                    <h1 className="text-6xl font-bold tracking-[-0.05em] text-[#E60023]">CMC</h1>
                                    <span className="text-xs font-mono text-[#E60023]/70">a.k.a Central_Makeus_Challenge from NE(O)RDINARY, est 2019</span>
                                </div>
                                <div className="flex items-center gap-2 mt-4 pl-1">
                                    <div className={`w-2 h-2 rounded-sm ${isPaused ? 'bg-[#E60023]' : 'bg-[#E60023]/30'}`}></div>
                                    <span className="text-xs font-mono tracking-widest text-[#E60023] uppercase">
                                        {isPaused ? 'LOCKED' : (isFiltered ? 'FILTERED VIEW' : 'LIVE STREAM')}
                                    </span>
                                </div>
                            </div>

                            {/* AI Chat / Search - Layered */}
                            <div 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    switchLayer('chat');
                                }}
                                className={`absolute bottom-12 right-12 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${activeLayer === 'chat' ? 'z-[4000] scale-100 translate-x-0 translate-y-0' : 'z-[1000] scale-95 translate-x-4 translate-y-4 opacity-80 hover:opacity-100'}`}
                            >
                                <AIChat 
                                    onSearch={handleSearch} 
                                    isFiltered={isFiltered} 
                                    onReset={handleResetFilter}
                                />
                            </div>

                            {/* Loading Overlay */}
                            {loading && (
                                <div className="absolute inset-0 flex items-center justify-center z-50 bg-[#e0e0e0]">
                                    <div className="flex flex-col items-center">
                                        <div className="w-12 h-1 bg-[#E60023] animate-pulse mb-2"></div>
                                        <div className="font-mono text-xs tracking-widest text-[#E60023]">SYSTEM INITIALIZATION</div>
                                    </div>
                                </div>
                            )}

                            {/* Navigator (Hidden when filtered) */}
                            {!isFiltered && (
                                <CohortNavigator 
                                    logs={logs} 
                                    activeIndex={activeIndex} 
                                    onSelectCohort={handleNavigatorSelect} 
                                />
                            )}

                            {/* 3D Scene */}
                            <div className="w-full h-full flex items-center justify-center perspective-[2000px] mt-12">
                                <div 
                                    className="relative w-full h-full transition-transform duration-700 ease-out"
                                    style={{ transformStyle: 'preserve-3d', transform: 'rotateX(55deg) rotateZ(35deg) translateX(-15%) translateY(55%) scale(0.9)' }}
                                >
                                    {/* Main Grid */}
                                    <GridBackground 
                                        rotation={gridRotation} 
                                        position={gridPosition} 
                                        opacity={1} 
                                        zIndex={1500} 
                                    />
                                    
                                    {logs.map((log, i) => {
                                        const len = logs.length;
                                        const isActive = i === activeIndex;

                                        let baseX = 0, baseY = 0, baseZ = 0, absDist = 0, opacity = 1, blurAmount = 0, isFilteredOut = false;

                                        let lift = 0;
                                        const PEAK_LIFT = 150; 
                                        
                                        // Calculate relative distance for positioning
                                        let distance = i - activeIndex;
                                        while (distance > len / 2) distance -= len;
                                        while (distance < -len / 2) distance += len;
                                        absDist = Math.abs(distance);

                                        if (isFiltered) {
                                            if (filteredIndices.includes(i)) {
                                                const visualIndex = filteredIndices.indexOf(i);
                                                const visualActiveIndex = filteredIndices.indexOf(activeIndex);
                                                
                                                distance = visualIndex - visualActiveIndex;
                                                const fLen = filteredIndices.length;
                                                while (distance > fLen / 2) distance -= fLen;
                                                while (distance < -fLen / 2) distance += fLen;

                                                absDist = Math.abs(distance);
                                                const NARROW_SPACING = 100; 
                                                baseX = distance * -NARROW_SPACING;
                                                baseY = distance * -NARROW_SPACING;
                                                baseZ = distance * -80;
                                                
                                                if (absDist > 10) return null; 
                                            } else {
                                                isFilteredOut = true;
                                                // distance and absDist are already calculated above for non-filtered logic
                                                if (absDist > 12) return null;

                                                const SPACING = 160;
                                                baseX = distance * -SPACING; 
                                                baseY = (distance * -SPACING) + 140; 
                                                baseZ = (distance * -100) - 200; 
                                                opacity = 0.5; blurAmount = 1;
                                            }
                                        } else {
                                            // distance and absDist are already calculated above
                                            if (absDist > 12) return null;

                                            const SPACING = 160;
                                            baseX = distance * -SPACING; 
                                            baseY = distance * -SPACING; 
                                            baseZ = distance * -100; 
                                        }

                                        if (distance === 0 && !isFilteredOut) lift = PEAK_LIFT;
                                        else if (distance === 1 && !isFilteredOut) lift = PEAK_LIFT * 0.5;
                                        else if (distance === 2 && !isFilteredOut) lift = PEAK_LIFT * 0.25;

                                        if (!isFilteredOut) {
                                            if (absDist > 5) opacity = 1 - ((absDist - 5) * 0.25);
                                            if (opacity < 0) opacity = 0;
                                            if (isPaused) blurAmount = isActive ? 0 : 2.5;
                                            else blurAmount = absDist * 0.6; 
                                        }

                                        return (
                                            <Panel3D 
                                                key={log.id}
                                                data={log}
                                                index={i}
                                                isSelected={isActive}
                                                onPanelClick={handlePanelClick}
                                                offsetZ={baseZ + lift} 
                                                offsetX={baseX}
                                                offsetY={baseY} 
                                                opacity={opacity}
                                                blur={blurAmount}
                                                isFilteredOut={isFilteredOut}
                                                language={language}
                                            />
                                        );
                                    })}
                                </div>
                                
                                {/* Detail View - Layered */}
                                <div 
                                    className={`absolute right-0 top-0 w-full h-full pointer-events-none transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${activeLayer === 'detail' ? 'z-[3500] translate-x-0 translate-y-0' : 'z-[1000] translate-x-4 translate-y-4 opacity-80'}`}
                                >
                                    <div className="w-full h-full pointer-events-none">
                                        <div className="pointer-events-auto" onClick={() => switchLayer('detail')}>
                                            <DetailView 
                                                data={selectedLog} 
                                                onPause={(e: React.MouseEvent) => {
                                                    handlePauseInteraction(e);
                                                    switchLayer('detail');
                                                }}
                                                isLocked={isPaused}
                                                language={language}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <ConnectingLines 
                                selectedId={selectedLog?.type === 'PROJECT' ? selectedLog.id : null} 
                                viewportRotation={{x: 0, y: 0}} 
                            />
                            
                            {/* Footer */}
                            <div className="absolute bottom-12 left-12 pointer-events-none">
                                <div className="text-6xl font-light text-[#E60023]/20 font-mono tracking-tighter flex items-end">
                                    <span>{(activeIndex + 1).toString().padStart(2, '0')}</span>
                                    <span className="text-4xl opacity-40 ml-2 mb-1">/ {logs.length.toString().padStart(2, '0')}</span>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};
