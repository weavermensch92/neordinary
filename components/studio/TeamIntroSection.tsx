import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { InteractiveVideo } from './InteractiveVideo';
import { TextReveal } from './TextReveal';

export const TeamIntroSection: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const y1 = useTransform(scrollYProgress, [0, 1], [50, -50]);
    const y2 = useTransform(scrollYProgress, [0, 1], [100, -100]);
    const y3 = useTransform(scrollYProgress, [0, 1], [150, -150]);

    const widthVideo = useTransform(scrollYProgress, [0.1, 0.5, 1], ["70%", "90%", "90%"]);
    const yVideoFrame = useTransform(scrollYProgress, [0, 1], [50, -50]);

    return (
        <section ref={containerRef} className="relative w-full bg-brand-bg text-brand-red py-24 md:py-48 overflow-hidden z-20">
            <div className="w-full flex flex-col items-center">

                <div className="flex flex-col items-center justify-center text-[10vw] md:text-[8vw] font-display leading-[0.8] tracking-tighter uppercase text-center mb-16 md:mb-32 relative z-10 text-brand-red mix-blend-normal">
                    <motion.span style={{ y: y1 }} className="block"><TextReveal delay={0}>NE(O)RDs ARE THE KIND</TextReveal></motion.span>
                    <motion.span style={{ y: y2 }} className="block text-[#FF1F1F]"><TextReveal delay={0.2}>THE UNPOLISHED</TextReveal></motion.span>
                    <motion.span style={{ y: y3 }} className="block"><TextReveal delay={0.4}>THE TRUE</TextReveal></motion.span>
                </div>

                <motion.div
                    style={{
                        width: widthVideo,
                        y: yVideoFrame
                    }}
                    className="aspect-[16/7] relative overflow-hidden mb-24 md:mb-40 shadow-2xl mx-auto"
                >
                    <InteractiveVideo
                        src="https://vimeo.com/1165336456?share=copy&fl=sv&fe=ci"
                        className="w-full h-full"
                    />
                </motion.div>

                <div className="w-full max-w-[96%] mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-32 font-sans text-lg md:text-xl font-light uppercase border-t border-brand-red/10 pt-12 md:pt-24 max-w-6xl">
                    <div>
                        <p className="leading-tight">
                            <TextReveal delay={0} glitchDelay={0} speed="fast" mode="word">Sometimes NE(O)RDS are one. Sometimes NE(O)RDS are many. A global collective of senior thinkers and makers, united by purpose and shared principles.</TextReveal>
                        </p>
                    </div>
                    <div className="md:mt-12">
                        <p className="leading-tight">
                            <TextReveal delay={0} glitchDelay={0.2} speed="fast" mode="word">What brings us together is a deep creative sensibility, a love for collaboration, and the courage to show up human — with empathy, curiosity, and care.</TextReveal>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}