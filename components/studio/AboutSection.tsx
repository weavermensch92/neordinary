import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView, useMotionValue, useMotionTemplate } from 'framer-motion';
import { TextReveal } from './TextReveal';

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()";

interface FooterGlitchCharProps {
  char: string;
  index: number;
  isActive: boolean;
  forceLit?: boolean;
}

const FooterGlitchChar: React.FC<FooterGlitchCharProps> = ({ char, index, isActive, forceLit = false }) => {
  const [displayChar, setDisplayChar] = useState(CHARS[Math.floor(Math.random() * CHARS.length)]);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (!isActive) {
      setIsDone(false);
      setDisplayChar(CHARS[Math.floor(Math.random() * CHARS.length)]);
      return;
    }
    const interval = setInterval(() => {
      setDisplayChar(CHARS[Math.floor(Math.random() * CHARS.length)]);
    }, 40);
    const duration = 600 + (index * 60);
    const timeout = setTimeout(() => {
      clearInterval(interval);
      setIsDone(true);
    }, duration);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isActive, index]);

  const baseStyle = isDone && !forceLit
    ? 'text-brand-red opacity-10 scale-100 blur-0'
    : 'text-brand-red opacity-100 scale-110 blur-[1px]';

  const litStyle = 'text-brand-red opacity-100 scale-100 blur-0 font-bold';

  return (
    <span className={`inline-block transition-all duration-500 ${forceLit ? litStyle : baseStyle}`}>
      {isDone ? char : displayChar}
    </span>
  );
};

export const AboutSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const footerTextRef = useRef<HTMLDivElement>(null);

  const isFooterInView = useInView(footerTextRef, { margin: "0px 0px -10% 0px", amount: 0.2 });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const maskImage = useMotionTemplate`radial-gradient(200px at ${mouseX}px ${mouseY}px, black, transparent)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const yLeft = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const yRight = useTransform(scrollYProgress, [0, 1], [0, -150]);

  const textString = "NEO-ORDINARY";
  const chars = textString.split('');

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-brand-bg text-brand-red px-4 py-20 md:p-12 lg:p-24 z-20"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 min-h-[50vh]">

        <motion.div style={{ y: yLeft }} className="lg:col-span-7">
          <div className="text-4xl md:text-6xl xl:text-8xl font-display leading-[0.85] tracking-tighter uppercase mb-12 lg:mb-0">
            <TextReveal delay={0}>AT NEO-ORDINARY,</TextReveal> <br />
            <TextReveal delay={0.2}>NE(O)RDS DON’T JUST</TextReveal> <br />
            <TextReveal delay={0.4}>USE & FOLLOW AI —</TextReveal> <br />
            <TextReveal delay={0.6}>NE(O)RDS WORK & BUILD</TextReveal> <br />
            <TextReveal delay={0.8}>WITH IT.</TextReveal>
          </div>
        </motion.div>

        {/* Right: Description (Synced with diagonal glitch) */}
        <motion.div style={{ y: yRight }} className="lg:col-span-5 flex flex-col justify-end pb-4 pt-32 lg:pt-60">
          <div className="font-sans text-lg md:text-xl lg:text-2xl leading-tight space-y-8 md:space-y-12 font-light">
            <p>
              <TextReveal mode="sentence" delay={0.2} speed="fast" className="font-bold">NE(O)RDs don’t study trends.</TextReveal><br />
              <TextReveal mode="sentence" delay={0.3} speed="fast">NE(O)RDs deploy them.</TextReveal>
            </p>
            <p>
              <TextReveal mode="sentence" delay={0.4} speed="fast" className="font-bold">NE(O)RDs don’t consume AI.</TextReveal><br />
              <TextReveal mode="sentence" delay={0.5} speed="fast">NE(O)RDs collaborate with it.</TextReveal>
            </p>
            <p className="pt-8 md:pt-12">
              <TextReveal mode="sentence" delay={0.6} speed="fast" className="font-bold">NE(O)RDs launch fast,</TextReveal><br />
              <TextReveal mode="sentence" delay={0.7} speed="fast">then optimize relentlessly.</TextReveal>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Footer Signature */}
      <div
        ref={footerTextRef}
        className="w-full pt-32 pb-12 overflow-hidden relative"
        onMouseMove={handleMouseMove}
      >
        <motion.div
          initial={{ y: "100%" }}
          animate={isFooterInView ? { y: "0%" } : { y: "100%" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex justify-center w-full"
        >
          <div className="text-[12vw] leading-none font-display uppercase text-center select-none tracking-tighter flex pointer-events-none">
            {chars.map((char, index) => (
              <FooterGlitchChar
                key={`base-${index}`}
                char={char}
                index={index}
                isActive={isFooterInView}
                forceLit={false}
              />
            ))}
          </div>
          <motion.div
            style={{ maskImage, WebkitMaskImage: maskImage }}
            className="absolute inset-0 flex justify-center pointer-events-none z-10"
          >
            <div className="text-[12vw] leading-none font-display uppercase text-center select-none tracking-tighter flex scale-[1.1] -skew-x-6 origin-center">
              {chars.map((char, index) => (
                <FooterGlitchChar
                  key={`lit-${index}`}
                  char={char}
                  index={index}
                  isActive={isFooterInView}
                  forceLit={true}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};