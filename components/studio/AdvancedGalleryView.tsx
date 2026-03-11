import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project, getSafeUrl, getThumbnailUrl, fetchProjectImages } from './GalleryData';

interface AdvancedGalleryViewProps {
    project: Project;
    onBack: () => void;
}

export const AdvancedGalleryView: React.FC<AdvancedGalleryViewProps> = ({ project, onBack }) => {
    const [isApiLoading, setIsApiLoading] = useState(true);
    const [images, setImages] = useState<string[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        let mounted = true;
        setIsApiLoading(true);
        fetchProjectImages(project.id).then((data) => {
            if (mounted) {
                setImages(data.length > 0 ? data : [project.imageUrl]);
                setIsApiLoading(false);
            }
        });
        return () => { mounted = false; };
    }, [project.id]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.8,
                duration: 0.8
            }
        }
    };

    const mainImageVariants = {
        hidden: { scale: 1.15, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: {
                duration: 1.2,
                ease: [0.16, 1, 0.3, 1] as any
            }
        }
    };

    const textVariants = {
        hidden: { x: -50, opacity: 0 },
        visible: {
            x: 0,
            opacity: 1,
            transition: {
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1] as any
            }
        }
    };

    const headerVariants = {
        hidden: { y: -100, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: [0.7, 0, 0.3, 1] as any } }
    };

    const scrollRef = useRef<HTMLDivElement>(null);

    const handleWheel = (e: React.WheelEvent) => {
        if (scrollRef.current) {
            // Translate vertical scroll to horizontal
            scrollRef.current.scrollLeft += e.deltaY;
        }
    };

    return (
        <motion.div
            className="fixed inset-0 bg-black text-white z-[100] flex flex-col p-8 md:p-12 overflow-hidden"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
        >
            {/* Top Close Button */}
            <div className="flex justify-end items-start mb-8">
                <motion.button
                    onClick={onBack}
                    className="text-[0.625rem] font-bold tracking-[0.2em] uppercase hover:line-through text-white"
                    variants={headerVariants}
                >
                    CLOSE
                </motion.button>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col lg:flex-row relative">
                {/* Left Side: Project Info */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center lg:justify-end pb-12 lg:pb-32 lg:pr-24 order-2 lg:order-1">
                    <motion.div variants={textVariants} className="mb-6 lg:mb-12">
                        <span className="text-xs font-bold uppercase tracking-widest opacity-40">
                            ({(activeIndex + 1).toString().padStart(2, '0')} / {images.length.toString().padStart(2, '0')})
                        </span>
                    </motion.div>

                    <motion.h1
                        variants={textVariants}
                        className="text-5xl md:text-7xl lg:text-9xl font-display leading-[0.85] tracking-tighter uppercase mb-8 lg:mb-12"
                    >
                        {project.name.split('\n').map((line, i) => (
                            <span key={i} className="block">{line}</span>
                        ))}
                    </motion.h1>

                    <motion.div variants={textVariants} className="max-w-md lg:max-w-lg mb-8">
                        <p className="text-sm md:text-base font-light leading-relaxed uppercase opacity-60">
                            {project.description}
                        </p>
                    </motion.div>
                </div>

                {/* Right Side: Fixed Height Main Media */}
                <motion.div
                    variants={mainImageVariants}
                    className="w-full lg:w-1/2 h-[50vh] md:h-[60vh] relative overflow-hidden order-1 lg:order-2 mb-8 lg:mb-0"
                >
                    <AnimatePresence mode="wait">
                        {images.length > 0 && images[activeIndex] && (
                            <motion.div
                                key={activeIndex}
                                initial={{ opacity: 0, scale: 1.05 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as any }}
                                className="w-full h-full"
                            >
                                {(images[activeIndex].toLowerCase().endsWith('.mp4') || images[activeIndex].toLowerCase().endsWith('.mov')) ? (
                                    <video
                                        src={getSafeUrl(images[activeIndex])}
                                        autoPlay muted loop playsInline
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <img
                                        src={getSafeUrl(images[activeIndex])}
                                        alt={project.name}
                                        className="w-full h-full object-cover"
                                    />
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>

            {/* Bottom Navigator (Thumbnails with Horizontal Scroll) */}
            <div className="mt-auto pt-10">
                <div
                    ref={scrollRef}
                    onWheel={handleWheel}
                    className="w-full overflow-x-auto overflow-y-hidden no-scrollbar pb-4"
                >
                    <motion.div
                        className="flex gap-4 items-end min-w-max pr-[20vw]"
                    >
                        <AnimatePresence>
                            {!isApiLoading && images.map((url, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ x: 100, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{
                                        delay: 0.8 + (i * 0.05),
                                        duration: 0.6,
                                        ease: [0.16, 1, 0.3, 1] as any
                                    }}
                                    className={`relative w-32 md:w-40 lg:w-48 aspect-[3/4] cursor-pointer overflow-hidden border-t-2 shrink-0 transition-all duration-500 ${activeIndex === i ? 'border-white opacity-100 translate-y-[-10px]' : 'border-white/5 opacity-40 hover:opacity-80'}`}
                                    onClick={() => setActiveIndex(i)}
                                >
                                    <img
                                        src={getThumbnailUrl(url)}
                                        className={`w-full h-full object-cover transition-all duration-700 ${activeIndex === i ? 'grayscale-0' : 'grayscale'}`}
                                        alt={`Thumb ${i}`}
                                    />
                                    <div className="absolute top-2 left-2 text-[0.5rem] font-bold text-white">
                                        /{(i + 1).toString().padStart(2, '0')}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>

            <style>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>

            {/* Background Grain/Noise Effect */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        </motion.div>
    );
};
