import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { TextReveal } from './TextReveal';

const MEMBERS = [
    {
        name: "SEBASTIÁN PELÁEZ",
        role: "Founder & Creative Director",
        desc: "Curious, empathetic, and craft-obsessed, Sebastián blends strategic clarity with creative conviction. For over 18 years, he’s shaped the voice and vision of brands like the United Nations, WHO, Siemens, and more.",
        img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=1080",
        link: "https://www.linkedin.com/in/sebastianpelaezosorio/"
    },
    {
        name: "ALEJANDRA DÍAZ",
        role: "Strategy & Creative Consultant",
        desc: "A creative generalist and founder of The Black Bean. She brings perception and presence to everything she creates — noticing what others miss, giving shape to what others feel.",
        img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=1080",
        link: "https://www.linkedin.com/in/alejandra-diaz-velez-248133201/"
    },
    {
        name: "JORGE TOLOZA",
        role: "Tech & Dev Consultant",
        desc: "Inventive, unusual, and driven by interaction. A Systems Engineer by training and creative technologist by instinct, he transforms code into experiences that speak — not just move.",
        img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=1080",
        link: "https://www.linkedin.com/in/jorgetoloza/"
    },
    {
        name: "HIRAM ARAGÓN",
        role: "Product Design Consultant",
        desc: "Driven by curiosity, Hiram works at the crossroads of interaction design, film, product, and storytelling. Designing experiences that invite people to feel, reflect, and engage.",
        img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=1080",
        link: "https://www.linkedin.com/in/hiramaragon/"
    }
];

export const TeamSection: React.FC = () => {
    const targetRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [scrollRange, setScrollRange] = useState(0);

    useEffect(() => {
        const calculateRange = () => {
            if (scrollRef.current) {
                const containerWidth = scrollRef.current.parentElement?.clientWidth || window.innerWidth;
                setScrollRange(scrollRef.current.scrollWidth - containerWidth);
            }
        };

        const observer = new ResizeObserver(calculateRange);
        if (scrollRef.current) observer.observe(scrollRef.current);

        calculateRange();
        window.addEventListener('resize', calculateRange);

        const timer = setTimeout(calculateRange, 1000);

        return () => {
            observer.disconnect();
            window.removeEventListener('resize', calculateRange);
            clearTimeout(timer);
        };
    }, []);

    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start start", "end end"]
    });

    const x = useTransform(scrollYProgress, (pos) => -pos * scrollRange);

    return (
        <section id="team" ref={targetRef} className="relative h-[500vh] bg-brand-bg text-brand-red z-30">
            <div className="sticky top-0 flex h-screen items-center overflow-hidden">
                <motion.div ref={scrollRef} style={{ x }} className="flex w-max gap-12 md:gap-24 px-[5vw] items-center h-full">

                    <div className="flex-shrink-0 w-[90vw] md:w-[40vw] flex flex-col justify-center h-full">
                        <h2 className="text-[12vw] md:text-[5vw] font-display leading-[0.9] tracking-tighter uppercase">
                            <span className="block text-brand-red"><TextReveal delay={0}>NE(O)RDs ARE A</TextReveal></span>
                            <span className="block"><TextReveal delay={0.2}>LIVING NETWORK —</TextReveal></span>
                            <span className="block opacity-40"><TextReveal delay={0.4}>FLEXIBLE,</TextReveal></span>
                            <span className="block opacity-40"><TextReveal delay={0.6}>INTENTIONAL,</TextReveal></span>
                            <span className="block"><TextReveal delay={0.8}>AND BUILT ON TRUST.</TextReveal></span>
                        </h2>
                    </div>

                    {MEMBERS.map((member, i) => (
                        <div key={i} className="flex-shrink-0 w-[85vw] md:w-[60vw] flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-start justify-center h-full pt-12 md:pt-0">
                            <div className="w-full md:w-1/2 aspect-[0.825] bg-[#E0E0E0] relative overflow-hidden group shadow-lg">
                                <img
                                    src={member.img}
                                    alt={member.name}
                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-brand-red mix-blend-multiply opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none" />
                            </div>

                            <div className="w-full md:w-1/2 flex flex-col justify-end md:justify-center h-auto md:h-full md:max-h-[82.5%] pb-8 md:pb-0">
                                <div>
                                    <h3 className="text-4xl md:text-5xl lg:text-6xl font-display uppercase leading-[0.85] tracking-tighter mb-4 text-brand-red">
                                        <TextReveal>{member.name}</TextReveal>
                                    </h3>
                                    <div className="w-12 h-1 bg-brand-red mb-6" />
                                    <p className="text-xs md:text-sm font-bold uppercase tracking-widest text-brand-red mb-6">
                                        <TextReveal speed="fast" mode="word">{member.role}</TextReveal>
                                    </p>
                                    <p className="font-sans text-base md:text-lg font-light uppercase leading-relaxed max-w-sm mb-8">
                                        <TextReveal speed="fast" mode="word">{member.desc}</TextReveal>
                                    </p>
                                </div>

                                <a
                                    href={member.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-red hover:text-brand-dark transition-colors"
                                >
                                    <span>Linkedin</span>
                                    <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                                </a>
                            </div>
                        </div>
                    ))}

                    <div className="w-[5vw] flex-shrink-0" />

                </motion.div>
            </div>
        </section>
    );
};