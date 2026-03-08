import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { TextReveal } from './TextReveal';

const VALUES = [
    {
        id: "01",
        title: ["UNIVERSITY", "MAKEUS CHALLENGE"],
        desc: [
            "UMC represents the highest concentration of emerging student talent across Korea and Asia. With 55 universities, nearly 4,000 members, and over 600 new students joining each quarter, its momentum is unmistakable. Schools continue to expand, and the network deepens with every cycle. In this environment, AI adoption is not gradual — it is immediate and immersive.",
            "Students experiment boldly, iterate rapidly, and internalize new technologies faster than most established workplaces. UMC is where the future workforce trains at future speed."
        ]
    },
    {
        id: "02",
        title: ["CENTRAL", "MAKUS CHALLENGE"],
        desc: [
            "CMC is a gathering of builders who have already proven themselves. Within its network are teams that have scaled to Series B stage companies and ₩100 billion valuations, alongside founders formally certified by national startup programs. These milestones are signals — of skill, resilience, and execution under pressure. CMC represents a concentration of practitioners who build products that survive real markets. It is not a club. It is a benchmark of capability."
        ]
    },
    {
        id: "03",
        title: ["GRIDGE", "Gig-Bridge"],
        desc: [
            "GRIDGE is Korea’s structured IT workforce management system. Unlike traditional platforms that simply connect clients with freelancers, GRIDGE assumes responsibility for deliverables and performance. Work is decomposed into precise execution units, and specialists are matched at the capability level — even down to the smallest task scope. This results in higher accountability, clearer output control, and sustained client satisfaction.",
            "With the introduction of Observer, GRIDGE extends management to external development teams, leveraging AI to automate task allocation, monitoring, and coordination. The model is shifting from workforce brokerage to development MSP — where AI augments human execution and operational clarity replaces uncertainty."
        ]
    },
    {
        id: "04",
        title: ["GRIDGE", "AiOPS"],
        desc: [
            "GRIDGE AiOPS is an AI Operating System for modern enterprises. It optimizes AI usage efficiency, reinforces team-level capability, and manages AI agents as coordinated digital workforce units. Rather than leaving AI adoption fragmented, AiOPS structures it.",
            "The service pairs organizations with the right AI experts, guiding full-scale AX and accelerating the transition toward agent-enabled teams. Individual employees strengthen their AI competence, while leadership gains visibility and control over enterprise-wide AI utilization. GRIDGE AiOPS is not a consulting add-on — it is an AI MSP that governs performance, productivity, and autonomous execution across the company."
        ]
    }
];

export const ValuesSection: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const sliderRef = useRef<HTMLDivElement>(null);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    const [isHovering, setIsHovering] = useState(false);
    // Extended cursor state to include 'center'
    const [cursorSide, setCursorSide] = useState<'left' | 'right' | 'center'>('right');

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const cursorX = useSpring(mouseX, { stiffness: 500, damping: 28 });
    const cursorY = useSpring(mouseY, { stiffness: 500, damping: 28 });

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const yVideo = useTransform(scrollYProgress, [0, 1], [-150, 200]);

    const nextSlide = () => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % VALUES.length);
    };

    const prevSlide = () => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev === 0 ? VALUES.length - 1 : prev - 1));
    };

    const currentVal = VALUES[currentIndex];
    const nextVal = VALUES[(currentIndex + 1) % VALUES.length];

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!sliderRef.current) return;
        const rect = sliderRef.current.getBoundingClientRect();

        // Update MotionValues with Global Coordinates for Fixed Cursor
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
        setIsHovering(true);

        // Use relative coordinates for zone logic
        const x = e.clientX - rect.left;

        // Center zone logic applied to ALL slides
        // Modified to 25% - 50% - 25% split
        const centerStart = rect.width * 0.25;
        const centerEnd = rect.width * 0.75;

        if (x > centerStart && x < centerEnd) {
            setCursorSide('center');
            return;
        }

        // Default Left/Right logic
        if (x <= centerStart) setCursorSide('left');
        else setCursorSide('right');
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
    };

    const handleContainerClick = () => {
        if (window.innerWidth < 768) return;

        // Handle Center Click for ALL slides
        if (cursorSide === 'center') {
            if (currentVal.id === "02") {
                // Trigger the transition defined in App.tsx
                window.dispatchEvent(new CustomEvent('open-cmc'));
            }
            console.log(`Go to details for ${currentVal.id}`);
            return;
        }

        if (cursorSide === 'left') prevSlide();
        else nextSlide();
    };

    const variants = {
        enter: (direction: number) => ({ x: direction > 0 ? '100%' : '-100%', opacity: 1 }),
        center: { zIndex: 1, x: 0, opacity: 1 },
        exit: (direction: number) => ({ zIndex: 0, x: direction < 0 ? '100%' : '-100%', opacity: 1 })
    };

    return (
        <section
            id="values"
            ref={containerRef}
            className="relative w-full bg-brand-bg text-brand-red py-24 md:py-32 overflow-hidden z-20 border-t border-brand-red/10"
        >
            <div className="w-full max-w-[96%] mx-auto px-4 relative">

                <div className="relative min-h-[60vh] flex flex-col md:block mb-32 md:mb-48">
                    <div className="relative z-20 text-left mix-blend-normal pointer-events-none">
                        <div className="text-[14vw] md:text-[11vw] font-display leading-[0.8] tracking-tighter uppercase text-brand-red">
                            <span className="block"><TextReveal delay={0}>THE FLAGS NE(O)RDs</TextReveal></span>
                            <span className="block"><TextReveal delay={0.2}>STAND FOR</TextReveal></span>
                        </div>
                    </div>

                    <motion.div
                        style={{ y: yVideo }}
                        className="w-full md:absolute aspect-video z-10 mt-12 md:mt-0 md:right-[calc(-2.1vw)] md:top-[calc(10vw)] md:w-[55vw] shadow-2xl"
                    >
                        <div className="w-full h-full overflow-hidden relative bg-black">
                            <video
                                src="https://cdn.midjourney.com/video/22a680cd-5d6b-4788-a5a5-198eb18e7597/2.mp4"
                                autoPlay
                                muted
                                loop
                                playsInline
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </motion.div>
                </div>

                <div
                    ref={sliderRef}
                    className="relative flex flex-col justify-between mt-32 md:mt-[18.75rem] md:cursor-none select-none local-cursor-area"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    onClick={handleContainerClick}
                >
                    {/* Custom Cursor - Fixed Position */}
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
                        <div className="w-32 h-32 flex items-center justify-center">
                            {cursorSide === 'left' ? (
                                <svg viewBox="0 0 21 18" className="w-20 h-20 fill-current rotate-0"><path d="M9.8 16.7c.3-.3.3-.8 0-1.2l-4.3-4.2c-.3-.3-.2-.6.2-.6h13.6c.4 0 .8-.4.8-.8v-1c0-.5-.4-.9-.8-.9H5.7c-.4 0-.5-.4-.2-.6L9.8 3c.3-.3.4-.7 0-1.1L9 1.3C8.7.9 8.3.9 8 1.3L.5 8.8c-.3.3-.3.8 0 1L8 17.5c.3.3.7.3 1.1 0l.7-.7Z"></path></svg>
                            ) : cursorSide === 'center' ? (
                                <img
                                    /* Using lh3.googleusercontent.com usually bypasses the embed restrictions for public files */
                                    src="https://lh3.googleusercontent.com/d/1KLn0TuTNVDMVWcp8C0JORVO2hC-jMf4X"
                                    alt="Open"
                                    className="w-full h-full object-contain drop-shadow-lg invert"
                                    referrerPolicy="no-referrer"
                                    crossOrigin="anonymous"
                                />
                            ) : (
                                <svg viewBox="0 0 20 18" className="w-20 h-20 fill-current rotate-0"><path d="M10.4 16.7c-.3-.3-.4-.8 0-1.2l4.3-4.2c.3-.3.1-.6-.2-.6H.9a.8.8 0 0 1-.8-.8v-1c0-.5.4-.9.8-.9h13.6c.3 0 .5-.4.2-.6L10.4 3c-.4-.3-.4-.7 0-1.1l.7-.7c.3-.4.7-.4 1.1 0l7.4 7.5c.4.3.4.8 0 1l-7.4 7.6c-.4.3-.8.3-1.1 0l-.7-.7Z"></path></svg>
                            )}
                        </div>
                        {/* Only show label if not center (optional preference, but keeping labels helps orientation) */}
                        <span className="text-3xl font-display tracking-widest mt-4">
                            {cursorSide === 'center' ? 'OPEN' : `${currentVal.id}-05`}
                        </span>
                    </motion.div>

                    <div className="w-full overflow-hidden grid grid-cols-1 grid-rows-1 relative">
                        {/* TITLE TRACK (Continuously rendered, sliding horizontally) */}
                        <motion.div
                            className="col-start-1 row-start-1 flex w-full md:w-[83.333333%] h-fit z-0"
                            animate={{ x: `-${currentIndex * 100}%` }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        >
                            {VALUES.map((val, i) => (
                                <div key={val.id} className="shrink-0 w-full flex flex-col justify-start">
                                    <h3 className={`text-[12vw] md:text-[9vw] font-display leading-[0.75] tracking-tighter uppercase text-brand-red transition-opacity duration-500 ${currentIndex !== i ? 'hidden md:block opacity-20 mask-linear-gradient translate-x-4' : 'opacity-100'}`}>
                                        {val.title.map((line, j) => (
                                            <span key={j} className="block whitespace-nowrap overflow-hidden"><TextReveal delay={j * 0.2}>{line}</TextReveal></span>
                                        ))}
                                    </h3>
                                </div>
                            ))}
                        </motion.div>

                        <AnimatePresence initial={false} custom={direction}>
                            <motion.div
                                key={currentIndex}
                                custom={direction}
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{
                                    x: { type: "spring", stiffness: 300, damping: 30 },
                                    opacity: { duration: 0.2 }
                                }}
                                className="col-start-1 row-start-1 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-4 w-full pointer-events-none z-10"
                            >
                                <div className="md:col-span-5 md:col-start-6 flex flex-col justify-end md:justify-center pt-[15vw] md:pt-4 pointer-events-auto mt-[12vw] md:mt-0">
                                    <div className="font-sans text-lg md:text-xl leading-tight space-y-6 font-medium uppercase tracking-wide">
                                        {currentVal.desc.map((d, i) => (
                                            <p key={i}>
                                                <TextReveal delay={0.2} glitchDelay={0.2 + (i * 0.15)} speed="fast" mode="sentence">{d}</TextReveal>
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <motion.div
                        className="flex justify-between items-end mt-12 md:mt-24 pt-8 border-t border-brand-red/10"
                        animate={{ opacity: isHovering && window.innerWidth >= 768 ? 0 : 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="text-4xl md:text-5xl font-display text-brand-red opacity-20">
                            {currentVal.id}-05
                        </div>
                        <div className="flex gap-4 md:pointer-events-none">
                            <button
                                onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                                className="w-12 h-12 md:w-16 md:h-16 border border-brand-red/20 rounded-full flex items-center justify-center hover:bg-brand-red hover:text-brand-bg transition-colors duration-300 group md:pointer-events-auto"
                            >
                                <svg viewBox="0 0 21 18" className="w-5 h-5 fill-current group-hover:fill-brand-bg"><path d="M9.8 16.7c.3-.3.3-.8 0-1.2l-4.3-4.2c-.3-.3-.2-.6.2-.6h13.6c.4 0 .8-.4.8-.8v-1c0-.5-.4-.9-.8-.9H5.7c-.4 0-.5-.4-.2-.6L9.8 3c.3-.3.4-.7 0-1.1L9 1.3C8.7.9 8.3.9 8 1.3L.5 8.8c-.3.3-.3.8 0 1L8 17.5c.3.3.7.3 1.1 0l.7-.7Z"></path></svg>
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                                className="w-12 h-12 md:w-16 md:h-16 border border-brand-red/20 rounded-full flex items-center justify-center hover:bg-brand-red hover:text-brand-bg transition-colors duration-300 group md:pointer-events-auto"
                            >
                                <svg viewBox="0 0 20 18" className="w-5 h-5 fill-current group-hover:fill-brand-bg"><path d="M10.4 16.7c-.3-.3-.4-.8 0-1.2l4.3-4.2c.3-.3.1-.6-.2-.6H.9a.8.8 0 0 1-.8-.8v-1c0-.5.4-.9.8-.9h13.6c.3 0 .5-.4.2-.6L10.4 3c-.4-.3-.4-.7 0-1.1l.7-.7c.3-.4.7-.4 1.1 0l7.4 7.5c.4.3.4.8 0 1l-7.4 7.6c-.4.3-.8.3-1.1 0l-.7-.7Z"></path></svg>
                            </button>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};