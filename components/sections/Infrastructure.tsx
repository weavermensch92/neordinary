import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Building2, MapPin, Database, Zap, Globe, ArrowUpRight, X } from 'lucide-react';
import { SectionLayout } from './SectionLayout';

export const Infrastructure = ({
    onNavigate,
    onTogglePause,
    onToggleGlobalUI,
    isActive = false,
    isExiting = false,
    exitDirection = 'left',
    onTriggerStudio,
    onTriggerUmc,
    onTriggerCmc
}: {
    onNavigate?: (index: number) => void,
    onTogglePause?: (paused: boolean) => void,
    isExiting?: boolean,
    exitDirection?: 'left' | 'right',
    onToggleGlobalUI?: (hidden: boolean) => void,
    onTriggerStudio?: () => void,
    onTriggerUmc?: () => void,
    onTriggerCmc?: () => void,
    isActive?: boolean
}) => {
    const sectionRef = useRef<HTMLElement>(null);
    const [isAnimationComplete, setIsAnimationComplete] = useState(false);
    const [showPoster, setShowPoster] = useState(false);

    const gridItems = [
        {
            span: "md:col-span-2 md:row-span-2",
            content: (
                <div
                    onClick={onTriggerStudio}
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
                </div>
            )
        },
        {
            span: "md:col-span-1 md:row-span-1",
            content: (
                <div
                    onClick={() => setShowPoster(true)}
                    className="w-full h-full bg-white p-10 flex flex-col justify-between group hover:bg-accent transition-all duration-500 border-b-[1.5rem] border-black cursor-pointer"
                >
                    <div className="flex justify-between items-start text-black">
                        <div className="bg-black p-3"><Users className="w-8 h-8 text-white" /></div>
                        <ArrowUpRight className="w-8 h-8 opacity-30 group-hover:opacity-100 group-hover:rotate-45 transition-all" />
                    </div>
                    <div>
                        <div className="text-5xl lg:text-6xl font-black text-black tracking-tighter mb-2 leading-[0.8]">6,000<span className="group-hover:text-white transition-colors">+</span></div>
                        <div className="text-[0.65rem] font-black text-black/40 uppercase tracking-[0.2em] leading-normal group-hover:text-black transition-colors">Active Developers</div>
                    </div>
                </div>
            )
        },
        {
            span: "md:col-span-1 md:row-span-1",
            content: (
                <div
                    onClick={() => setShowPoster(true)}
                    className="w-full h-full bg-[#111] border-[0.25rem] border-white/10 p-10 flex flex-col justify-between group hover:border-accent transition-all duration-500 border-b-[1.5rem] cursor-pointer"
                >
                    <div className="flex justify-between items-start text-white">
                        <div className="bg-white/10 p-3"><Building2 className="w-8 h-8" /></div>
                        <ArrowUpRight className="w-8 h-8 opacity-30 group-hover:translate-x-2 transition-transform" />
                    </div>
                    <div>
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
                    onClick={onTriggerUmc}
                    className="w-full h-full bg-[#0A0A0A] border-4 border-white/5 p-10 flex flex-col items-center justify-center text-center group relative overflow-hidden hover:bg-accent hover:text-black transition-all duration-700 cursor-pointer"
                >
                    <div className="absolute inset-0 border-r-[1rem] border-accent/20" />
                    <Zap className="w-12 h-12 lg:w-16 lg:h-16 text-accent mb-6 relative z-10 group-hover:text-black transition-colors" />
                    <div className="text-4xl lg:text-5xl font-black text-white mb-2 tracking-tighter leading-[0.8] relative z-10 group-hover:text-black transition-colors">UMC</div>
                </div>
            )
        },
        {
            span: "md:col-span-1 md:row-span-1",
            content: (
                <div
                    onClick={onTriggerCmc}
                    className="w-full h-full bg-[#0A0A0A] border-4 border-white/5 p-10 flex flex-col items-center justify-center text-center group relative overflow-hidden hover:bg-white hover:text-black transition-all duration-700 cursor-pointer"
                >
                    <div className="absolute inset-0 border-l-[1rem] border-white/20" />
                    <Globe className="w-12 h-12 lg:w-16 lg:h-16 text-blue-500 mb-6 relative z-10 group-hover:text-black transition-colors" />
                    <div className="text-4xl lg:text-5xl font-black text-white mb-2 tracking-tighter leading-[0.8] relative z-10 group-hover:text-black transition-colors">Central Makeus</div>
                </div>
            )
        },
        {
            span: "md:col-span-2 md:row-span-1",
            content: (
                <div
                    onClick={() => setShowPoster(true)}
                    className="w-full h-full bg-accent p-12 flex justify-between items-center group relative overflow-hidden border-4 border-white cursor-pointer"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none group-hover:scale-125 transition-transform">
                        <MapPin size={120} className="text-black" />
                    </div>
                    <div className="relative z-10">
                        <div className="text-5xl lg:text-7xl font-black text-black tracking-tighter mb-2 leading-[0.8]">1,200<span className="text-white">+</span></div>
                        <div className="text-[0.65rem] lg:text-xs font-black text-black/40 uppercase tracking-[0.3em] leading-normal">Annual Offline Participants</div>
                    </div>
                </div>
            )
        },
        {
            span: "md:col-span-2 md:row-span-1",
            content: (
                <div
                    onClick={() => setShowPoster(true)}
                    className="w-full h-full bg-[#111] border-4 border-white/10 p-12 flex justify-between items-center group relative overflow-hidden hover:border-white transition-colors duration-500 cursor-pointer"
                >
                    <div className="relative z-10">
                        <div className="text-5xl lg:text-7xl font-black text-white group-hover:text-black tracking-tighter mb-2 leading-[0.8] transition-colors">4,896</div>
                        <div className="text-[0.65rem] lg:text-xs font-black text-white/20 group-hover:text-black/60 uppercase tracking-[0.3em] leading-normal transition-colors">Registered Workers</div>
                    </div>
                    <div className="relative z-10 p-4 lg:p-6 bg-white/5 group-hover:bg-black transition-colors"><Database size={32} className="text-white/40 group-hover:text-accent transition-colors" /></div>
                </div>
            )
        }
    ];

    useEffect(() => {
        if (onTogglePause) onTogglePause(showPoster);
        if (onToggleGlobalUI) onToggleGlobalUI(showPoster);
    }, [showPoster, onTogglePause, onToggleGlobalUI]);

    return (
        <SectionLayout
            id="infrastructure-section"
            title="CORE INFRASTRUCTURE"
            subtitle="The Scalable Backbone for High-Density AI Experimentation"
            index="01"
            isActive={isActive}
            isExiting={isExiting}
            exitDirection={exitDirection}
            hideHeader={showPoster}
        >
            <div className={`relative w-full h-full flex flex-col gap-12 ${showPoster ? 'blur-xl' : ''}`}>
                <div className={`grid grid-cols-1 md:grid-cols-4 md:grid-rows-3 gap-6 w-full relative z-10 ${showPoster ? 'hidden opacity-0 pointer-events-none' : ''}`}>
                    {gridItems.map((item, index) => (
                        <div key={index} className={`${item.span} stagger-item`}>
                            {item.content}
                        </div>
                    ))}
                </div>
            </div>

            {/* 55_poster Overlay */}
            <AnimatePresence>
                {showPoster && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[500] bg-black"
                    >
                        <iframe
                            src="/55_poster/graph.html"
                            className="w-full h-full border-none"
                            title="55_poster"
                        />
                        {/* Back to Navigator Button */}
                        <motion.button
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            onClick={() => setShowPoster(false)}
                            className="absolute top-12 right-12 z-[510] flex items-center gap-4 bg-white text-black px-8 py-5 border-[6px] border-black shadow-[10px_10px_0_0_#FFF] hover:bg-accent hover:text-black transition-all group"
                        >
                            <span className="text-xl font-black uppercase tracking-widest group-hover:translate-x-[-4px] transition-transform">BACK TO NAVIGATOR</span>
                            <X className="w-8 h-8" />
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </SectionLayout>
    );
};