import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { TextReveal } from './TextReveal';

export const BraveSection: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const yVideo = useTransform(scrollYProgress, [0, 1], [-150, 200]);
    const yBottomText = useTransform(scrollYProgress, [0, 1], [40, -40]);

    return (
        <section
            ref={containerRef}
            className="relative w-full bg-brand-bg flex flex-col justify-center py-12 md:py-32 overflow-hidden z-20"
        >
            <div className="w-full max-w-[96%] mx-auto relative min-h-[60vh] flex flex-col md:block">

                <div className="relative z-20 text-left mix-blend-normal">
                    <div className="text-[14vw] md:text-[13vw] font-display leading-[0.8] tracking-tighter uppercase text-brand-red">
                        <span className="block"><TextReveal mode="word" delay={0}>NE(O)RDs</TextReveal></span>
                        <span className="block"><TextReveal mode="word" delay={0.2}>THOSE WHO</TextReveal></span>
                        <span className="block"><TextReveal mode="word" delay={0.4}>DIVE DEEP</TextReveal></span>
                    </div>
                </div>

                <motion.div
                    style={{ y: yVideo }}
                    className="w-full md:absolute aspect-video z-10 mt-8 md:mt-0 md:right-[calc(-2.1vw)] md:top-[calc(12vw-30px)] md:w-[55vw] shadow-2xl"
                >
                    <div className="w-full h-full overflow-hidden relative bg-black">
                        <iframe
                            src="https://player.vimeo.com/video/1165273351?background=1&autoplay=1&loop=1&byline=0&title=0&muted=1"
                            className="w-[150%] h-[150%] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-cover pointer-events-none"
                            frameBorder="0"
                            allow="autoplay; fullscreen; picture-in-picture"
                            title="Brave Section Video"
                        />
                    </div>
                </motion.div>

                <motion.div
                    style={{ y: yBottomText }}
                    className="relative z-20 text-right mt-8 md:mt-[calc(22vw-100px)] mix-blend-normal"
                >
                    <div className="text-[14vw] md:text-[13vw] font-display leading-[0.8] tracking-tighter uppercase text-brand-red">
                        <span className="block"><TextReveal mode="word" delay={0}>AND FIND</TextReveal></span>
                        <span className="block"><TextReveal mode="word" delay={0.2}>the PATH.</TextReveal></span>
                    </div>
                </motion.div>

            </div>
        </section>
    );
};