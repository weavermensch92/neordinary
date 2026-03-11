import React, { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, useScroll, useTransform, useMotionValue, useSpring, MotionValue, AnimatePresence } from 'framer-motion';
import { TextReveal } from './TextReveal';
import ReactPlayer from 'react-player';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

// --- Types & Data ---

interface Project {
    id: string;
    name: string;
    subtitle: string;
    services: string[];
    imageUrl: string;
    parallaxSpeed: number;
    widthClass: string;
    alignmentClass: string;
    hoverScale: number;
    customClass?: string;
    description?: string;
    aspectClass?: string;
}

const GCP_BASE_URL = 'https://storage.googleapis.com/neordinarysquared';

const getSafeUrl = (url: string) => {
    if (url.startsWith('http')) return encodeURI(url.normalize('NFC'));
    return url;
};

const getThumbnailUrl = (url: string) => {
    if (url.toLowerCase().endsWith('.mp4') || url.toLowerCase().endsWith('.mov')) {
        // Example: .../demoday/video.mp4 -> .../thumbnails/demoday/video.jpg
        const parts = url.split('/');
        const fileName = parts.pop() || '';
        const folder = parts.pop() || '';
        const nameWithoutExt = fileName.replace(/\.[^/.]+$/, "");
        return `${GCP_BASE_URL}/thumbnails/${folder}/${nameWithoutExt}.jpg`;
    }
    return url;
};

const PROJECTS: Project[] = [
    {
        id: '(1)',
        name: 'SpoonOS x \n NE(O)RDINARY HACKATHON',
        subtitle: 'IMPACT ON HEALTH',
        services: ['Branding', 'Art Direction', 'Digital product UI (app & web)'],
        imageUrl: `${GCP_BASE_URL}/scoopos/poster.jpg`,
        parallaxSpeed: 0,
        widthClass: 'w-full md:w-[75%]',
        aspectClass: 'aspect-[3/4]',
        alignmentClass: 'self-start',
        hoverScale: 1.15,
        description: "SpoonOS와 NE(O)RDINARY가 함께한 대규모 해커톤 및 페스티벌입니다. 크리에이티브한 인재들이 모여 건강의 가치를 혁신하는 프로젝트들을 선보였으며, 기획부터 브랜딩, 데모데이까지 전 과정을 아우르는 임팩트를 창출했습니다."
    },
    {
        id: '(2)',
        name: 'AI HACKATHON',
        subtitle: 'INNOVATION IN AI ERA',
        services: ['AI Simulation', 'Interface Design', 'Technical Strategy'],
        imageUrl: `${GCP_BASE_URL}/ai-hackathon/IMG_7871.JPG`,
        parallaxSpeed: 160,
        widthClass: 'w-[85%]',
        alignmentClass: 'self-end',
        hoverScale: 1.28,
        description: "인공지능 기술을 기반으로 문제를 해결하고 새로운 가능성을 탐구하는 AI 해커톤입니다. 참가자들은 최신 AI 기술을 접목하여 실무적인 솔루션을 제안하고 프로토타입을 구현하는 혁신적인 시간을 가졌습니다."
    },
    {
        id: '(3)',
        name: 'NE(O)RDINARY DEMODAY',
        subtitle: 'SHOWCASING THE FUTURE',
        services: ['Pitch Deck', 'Event Branding', 'Booth Design', 'Networking'],
        imageUrl: `${GCP_BASE_URL}/festival/IMG_8596.JPG`,
        parallaxSpeed: 60,
        widthClass: 'w-[90%]',
        alignmentClass: 'self-end',
        hoverScale: 1.22,
        description: "해커톤을 통해 탄생한 아이디어들이 실제 비즈니스 모델로 성장하는 무대, 너디너리 데모데이입니다. 투자자와 업계 전문가들 앞에서 창의적인 결과물을 발표하고 네트워크를 확장하는 축제가 진행되었습니다."
    },
    {
        id: '(4)',
        name: 'CREATIVE FESTIVAL',
        subtitle: 'CELEBRATION OF BUILDERS',
        services: ['Experience Design', 'Identity Systems', 'Social Media'],
        imageUrl: `${GCP_BASE_URL}/festival/74B840FF-58FF-4472-94FF-CBC826AECB98_1_105_c.jpg`,
        parallaxSpeed: 120,
        widthClass: 'w-[95%]',
        alignmentClass: 'self-start',
        hoverScale: 1.15,
        description: "빌더들의 열정과 창의성을 기리는 축제, 페스티벌 세션입니다. 단순한 경쟁을 넘어 지식 공유와 즐거움이 공존하는 공간으로, 다양한 공연과 네트워킹을 통해 새로운 커뮤니티 시너지를 창출했습니다."
    },
    {
        id: '(5)',
        name: '2023 NE(O)RDINARY \n DEMODAY',
        subtitle: 'SHOWCASING THE FUTURE',
        services: ['Event Branding', 'Booth Design', 'Networking', 'Video Archive'],
        imageUrl: `${GCP_BASE_URL}/demoday/20230908_A_0001.MP4`,
        parallaxSpeed: 30,
        widthClass: 'w-[88%]',
        alignmentClass: 'self-center',
        hoverScale: 1.25,
        customClass: '-mt-24 md:-mt-48',
        description: "2023년 성수에서 진행된 너디너리 해커톤의 대미를 장식한 데모데이 현장입니다. 수많은 팀들이 만들어낸 열정의 기록들과 그 안에서 일구어낸 성장 스토리들을 압축된 영상 기록으로 확인하실 수 있습니다."
    }
];

// Mock API function to simulate fetching different images per project
const fetchProjectImages = async (projectId: string): Promise<string[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            if (projectId === '(1)') {
                resolve([
                    `${GCP_BASE_URL}/scoopos/hackathon.mp4`,
                    `${GCP_BASE_URL}/scoopos/0N8A4465.jpg`,
                    `${GCP_BASE_URL}/scoopos/0N8A4479.jpg`,
                    `${GCP_BASE_URL}/scoopos/0N8A4568.jpg`,
                    `${GCP_BASE_URL}/scoopos/0N8A4571.jpg`,
                    `${GCP_BASE_URL}/scoopos/0N8A4767.jpg`,
                    `${GCP_BASE_URL}/scoopos/0N8A4927.jpg`,
                    `${GCP_BASE_URL}/scoopos/TV5A8477.jpg`,
                    `${GCP_BASE_URL}/scoopos/TV5A8510.jpg`,
                    `${GCP_BASE_URL}/scoopos/TV5A8612.jpg`,
                    `${GCP_BASE_URL}/scoopos/TV5A8744.jpg`,
                    `${GCP_BASE_URL}/scoopos/TV5A8771.jpg`,
                    `${GCP_BASE_URL}/scoopos/TV5A8780.jpg`,
                    `${GCP_BASE_URL}/scoopos/TV5A8799.jpg`,
                    `${GCP_BASE_URL}/scoopos/TV5A8821.jpg`,
                    `${GCP_BASE_URL}/scoopos/TV5A8824.jpg`
                ]);
            } else if (projectId === '(2)') {
                resolve([
                    `${GCP_BASE_URL}/ai-hackathon/20251123_124508.jpg`,
                    `${GCP_BASE_URL}/ai-hackathon/IMG_1869.JPG`,
                    `${GCP_BASE_URL}/ai-hackathon/IMG_1877.JPG`,
                    `${GCP_BASE_URL}/ai-hackathon/IMG_1881.JPG`,
                    `${GCP_BASE_URL}/ai-hackathon/IMG_1897.JPG`,
                    `${GCP_BASE_URL}/ai-hackathon/IMG_3204.jpg`,
                    `${GCP_BASE_URL}/ai-hackathon/IMG_7871.JPG`,
                    `${GCP_BASE_URL}/hackathon/0N8A3414.jpg`,
                    `${GCP_BASE_URL}/hackathon/0N8A3418.jpg`,
                    `${GCP_BASE_URL}/hackathon/0N8A3445.jpg`,
                    `${GCP_BASE_URL}/hackathon/0N8A3469.jpg`,
                    `${GCP_BASE_URL}/hackathon/0N8A3502.jpg`,
                    `${GCP_BASE_URL}/hackathon/0N8A3543.jpg`,
                    `${GCP_BASE_URL}/hackathon/0N8A3587.jpg`
                ]);
            } else if (projectId === '(4)') {
                resolve([
                    `${GCP_BASE_URL}/festival/36815A22-7F40-4445-B1BB-209C9E53D20F_1_105_c.jpg`,
                    `${GCP_BASE_URL}/festival/74B840FF-58FF-4472-94FF-CBC826AECB98_1_105_c.jpg`,
                    `${GCP_BASE_URL}/festival/9755B5E1-A0B7-4541-BD7C-CD80908CF501_1_105_c.jpg`,
                    `${GCP_BASE_URL}/festival/B3D42243-C69F-443E-ACE0-90FC3ACB6F57_1_105_c.jpg`,
                    `${GCP_BASE_URL}/festival/IMG_8596.JPG`,
                    `${GCP_BASE_URL}/festival/IMG_8597.JPG`,
                    `${GCP_BASE_URL}/festival/IMG_8602.JPG`
                ]);
            } else if (projectId === '(5)') {
                resolve([
                    `${GCP_BASE_URL}/demoday/20230908_A_0001.MP4`,
                    `${GCP_BASE_URL}/demoday/20230908_A_0020.MP4`,
                    `${GCP_BASE_URL}/demoday/20230908_A_0041.MP4`,
                    `${GCP_BASE_URL}/demoday/20230908_A_0052.MP4`,
                    `${GCP_BASE_URL}/demoday/20230908_A_0076.MP4`,
                    `${GCP_BASE_URL}/demoday/20230908_A_0078.MP4`,
                    `${GCP_BASE_URL}/demoday/20230908_A_0079.MP4`,
                    `${GCP_BASE_URL}/demoday/20230908_A_0102.MP4`,
                    `${GCP_BASE_URL}/demoday/20230908_A_0112.MP4`,
                    `${GCP_BASE_URL}/demoday/20230908_A_0113.MP4`,
                    `${GCP_BASE_URL}/demoday/20230908_A_0131.MP4`,
                    `${GCP_BASE_URL}/demoday/20230908_A_0158.MP4`,
                    `${GCP_BASE_URL}/demoday/20230908_B_0147.MP4`
                ]);
            } else {
                // Default fallback for (3) or others
                resolve([
                    "https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=800",
                    "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800",
                    "https://images.unsplash.com/photo-1558655146-d09347e0b7a8?auto=format&fit=crop&q=80&w=800"
                ]);
            }
        }, 500);
    });
};

// --- Components ---

// 1. Loading Frame Component (Skeleton Pulse)
const LoadingFrame: React.FC<{ className?: string }> = ({ className = "" }) => (
    <div className={`w-full h-full bg-brand-bg relative overflow-hidden flex items-center justify-center border border-brand-red/5 ${className}`}>
        <div className="absolute inset-0 bg-brand-red/5 animate-pulse" />
        <div className="flex flex-col items-center gap-3 relative z-10">
            <div className="w-6 h-6 border-2 border-brand-red border-t-transparent rounded-full animate-spin" />
            <span className="text-[0.5625rem] font-bold uppercase tracking-[0.2em] text-brand-red animate-pulse">Loading Assets</span>
        </div>
        {/* CRT Scanline effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-red/5 to-transparent h-[30%] w-full animate-[scan_1.5s_linear_infinite]" />
        <style>{`
            @keyframes scan {
                0% { top: -30%; opacity: 0; }
                50% { opacity: 1; }
                100% { top: 130%; opacity: 0; }
            }
        `}</style>
    </div>
);

// 2. Project Card (List View Item)
interface ProjectCardProps {
    project: Project;
    scrollYProgress: MotionValue<number>;
    hoveredId: string | null;
    setHoveredId: (id: string | null) => void;
    globalMouse: { x: MotionValue<number>, y: MotionValue<number> };
    onClick: (project: Project) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, scrollYProgress, hoveredId, setHoveredId, globalMouse, onClick }) => {
    const isHovered = hoveredId === project.id;
    const isAnyHovered = hoveredId !== null;
    const isBlurred = isAnyHovered && !isHovered;

    // Use transforms for parallax and sway
    const yParallax = useTransform(scrollYProgress, [0, 1], [0, -project.parallaxSpeed * 3.5]);
    const swayX = useTransform(globalMouse.x, [0, 1], [30, -30]);

    // Magnetic effect internal logic
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
    const xSpring = useSpring(x, springConfig);
    const ySpring = useSpring(y, springConfig);
    const magX = useTransform(xSpring, [-0.5, 0.5], ["-20px", "20px"]);
    const magY = useTransform(ySpring, [-0.5, 0.5], ["-20px", "20px"]);
    const rotateY = useTransform(xSpring, [-0.5, 0.5], ["-8deg", "8deg"]);
    const rotateX = useTransform(ySpring, [-0.5, 0.5], ["8deg", "-8deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const xPct = (e.clientX - rect.left) / rect.width - 0.5;
        const yPct = (e.clientY - rect.top) / rect.height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        setHoveredId(null);
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            style={{
                y: yParallax,
                x: swayX,
                zIndex: isHovered ? 50 : 1,
                perspective: 1000
            }}
            animate={{
                scale: isHovered ? project.hoverScale : (isBlurred ? 0.9 : 0.95),
                filter: `blur(${isBlurred ? '8px' : '0px'}) grayscale(${isBlurred ? 1 : 0})`,
                opacity: isBlurred ? 0.4 : 1
            }}
            transition={{ duration: 0.4 }}
            className={`relative ${project.widthClass} ${project.alignmentClass} ${project.customClass || ''}`}
            onClick={() => onClick(project)}
        >
            <motion.div
                className="relative w-full cursor-pointer group"
                onMouseEnter={() => setHoveredId(project.id)}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                    x: magX,
                    y: magY,
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d"
                }}
            >
                <div className={`relative overflow-hidden w-full ${project.aspectClass || 'aspect-[1.3/1]'} bg-gray-200 shadow-2xl`}>
                    {project.imageUrl.toLowerCase().endsWith('.mp4') || project.imageUrl.toLowerCase().endsWith('.mov') ? (
                        <video
                            src={getSafeUrl(project.imageUrl)}
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="w-full h-full object-cover scale-[1.1]"
                            poster={getThumbnailUrl(project.imageUrl)}
                        />
                    ) : (
                        <motion.img
                            layoutId={`project-img-${project.id}`}
                            src={getSafeUrl(project.imageUrl)}
                            alt={project.name}
                            className="w-full h-full object-cover will-change-transform"
                            animate={{ scale: isHovered ? 1.05 : 1.0 }}
                            transition={{ duration: 0.5 }}
                        />
                    )}
                    <div className="absolute inset-0 bg-brand-red mix-blend-multiply opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none" />
                </div>

                <div
                    className="pt-6 text-brand-red text-left"
                    style={{ transform: "translateZ(30px)" }}
                >
                    <div className="flex items-baseline gap-2 text-sm md:text-base font-bold uppercase tracking-wider mb-4">
                        <span>{project.id}</span>
                        <span><TextReveal speed="fast">{project.name}</TextReveal></span>
                    </div>

                    <motion.div
                        initial="collapsed"
                        animate={isHovered ? "expanded" : "collapsed"}
                        variants={{
                            expanded: { height: "auto", opacity: 1 },
                            collapsed: { height: 0, opacity: 0 }
                        }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                    >
                        <div className="pb-4">
                            <p className="text-xs md:text-sm font-normal uppercase tracking-widest mb-4 opacity-80">
                                {project.subtitle}
                            </p>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </motion.div>
    );
};

// 3. Gallery View Component
interface GalleryItemProps {
    url: string;
    imgIndex: number;
    totalCount: number;
    pos: { left: string, top: string, width: string, aspect: string, zIndex: number };
    onClick: (url: string) => void;
}

const GalleryItem: React.FC<GalleryItemProps> = ({ url, imgIndex, totalCount, pos, onClick }) => {
    const rx = useMotionValue(0);
    const ry = useMotionValue(0);
    const tx = useMotionValue(0);
    const ty = useMotionValue(0);

    const srx = useSpring(rx, { stiffness: 100, damping: 20 });
    const sry = useSpring(ry, { stiffness: 100, damping: 20 });
    const stx = useSpring(tx, { stiffness: 100, damping: 20 });
    const sty = useSpring(ty, { stiffness: 100, damping: 20 });

    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const xPct = (e.clientX - rect.left) / rect.width - 0.5;
        const yPct = (e.clientY - rect.top) / rect.height - 0.5;

        rx.set(-yPct * 25);
        ry.set(xPct * 25);
        tx.set(xPct * 40);
        ty.set(yPct * 40);
    };

    const handleMouseLeave = () => {
        rx.set(0); ry.set(0); tx.set(0); ty.set(0);
    };

    return (
        <div
            className="absolute cursor-pointer pointer-events-auto group/item"
            style={{
                left: pos.left,
                top: pos.top,
                width: pos.width,
                aspectRatio: pos.aspect,
                padding: '10%',
                margin: '-10%',
                zIndex: pos.zIndex,
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={(e) => { e.stopPropagation(); onClick(url); }}
        >
            <motion.div
                layoutId={`gallery-${url}`}
                initial={{ opacity: 0, x: 50, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: -50, y: -50, scale: 0.9 }}
                transition={{
                    layout: { type: "spring", stiffness: 100, damping: 20 },
                    opacity: { duration: 0.6 },
                    x: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
                    y: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
                }}
                style={{
                    width: '100%',
                    height: '100%',
                    rotateX: srx,
                    rotateY: sry,
                    x: stx,
                    y: sty,
                    transformStyle: "preserve-3d"
                }}
                className={`relative rounded-sm overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.3)] border border-brand-red/10 group transform-gpu ${url.toLowerCase().endsWith('.mp4') || url.toLowerCase().endsWith('.mov') ? 'bg-black' : 'bg-gray-100'}`}
            >
                {url.toLowerCase().endsWith('.mp4') || url.toLowerCase().endsWith('.mov') ? (
                    <img src={getThumbnailUrl(url)} className="w-full h-full object-cover pointer-events-none" alt="Thumbnail" />
                ) : (
                    <img src={getSafeUrl(url)} className="w-full h-full object-cover pointer-events-none" alt="Gallery item" />
                )}

                <div className="absolute inset-0 bg-brand-bg/0 group-hover/item:bg-brand-bg/10 transition-colors pointer-events-none" />

                <div className="absolute top-2 left-2 bg-brand-bg/80 text-brand-red text-[0.625rem] font-bold uppercase tracking-widest px-2 py-1 rounded backdrop-blur-md pointer-events-none">
                    {imgIndex} / {totalCount}
                </div>
            </motion.div>
        </div>
    );
};

interface GalleryViewProps {
    project: Project;
    onBack: () => void;
}

const GalleryView: React.FC<GalleryViewProps> = ({ project, onBack }) => {
    const [isApiLoading, setIsApiLoading] = useState(true);
    const [mainStack, setMainStack] = useState<string[]>([]);
    const [galleryQueue, setGalleryQueue] = useState<string[]>([]);
    const [originalList, setOriginalList] = useState<string[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalIndex, setModalIndex] = useState(0);

    const isShifting = useRef(false);
    const queueRef = useRef<string[]>([]);
    const VISIBLE_COUNT = 4;

    const positions = [
        { left: '0%', top: '0%', width: '72%', aspect: '4/3', zIndex: 40 },
        { left: '20%', top: '40%', width: '56%', aspect: '3/4', zIndex: 30 },
        { left: '42%', top: '5%', width: '68%', aspect: '4/3', zIndex: 20 },
        { left: '55%', top: '50%', width: '60%', aspect: '3/4', zIndex: 10 },
    ];

    useEffect(() => {
        let mounted = true;
        setIsApiLoading(true);
        fetchProjectImages(project.id).then((data) => {
            if (mounted) {
                const firstImg = data.length > 0 ? data[0] : project.imageUrl;
                const rest = data.filter(u => u !== firstImg);
                setMainStack([firstImg]);
                setGalleryQueue(rest);
                queueRef.current = rest;
                setOriginalList(data.length > 0 ? data : [project.imageUrl]);
                setIsApiLoading(false);
            }
        });
        return () => { mounted = false; };
    }, [project.id]);

    const performSingleShift = async () => {
        const currentQueue = queueRef.current;
        if (currentQueue.length === 0) return;

        const nextUrl = currentQueue[0];

        setMainStack(prev => {
            const oldMain = prev[prev.length - 1];
            return [oldMain, nextUrl];
        });

        setGalleryQueue(prev => prev.slice(1));

        await new Promise(resolve => setTimeout(resolve, 800));

        const oldMain = await new Promise<string>(resolve => {
            setMainStack(prev => {
                const finishedOldMain = prev[0];
                const finalMain = prev[1];
                resolve(finishedOldMain);
                return [finalMain];
            });
        });

        const updatedQueue = [...currentQueue.slice(1), oldMain];
        setGalleryQueue(updatedQueue);
        queueRef.current = updatedQueue;
    };

    const handleThumbnailClick = async (clickedUrl: string) => {
        if (isShifting.current) return;

        const targetIdx = queueRef.current.indexOf(clickedUrl);
        if (targetIdx === -1) return;

        isShifting.current = true;

        for (let i = 0; i <= targetIdx; i++) {
            await performSingleShift();
            if (i < targetIdx) {
                await new Promise(r => setTimeout(r, 100));
            }
        }

        isShifting.current = false;
    };

    const handleCloseModal = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setModalOpen(false);
    };

    const allImages = [...mainStack, ...galleryQueue];
    const displayList = originalList.length > 0 ? originalList : allImages;

    const handleNextModal = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (displayList.length === 0) return;
        setModalIndex((prev) => (prev + 1) % displayList.length);
    };

    const handlePrevModal = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (displayList.length === 0) return;
        setModalIndex((prev) => (prev - 1 + displayList.length) % displayList.length);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
        exit: { opacity: 0 }
    };

    const itemVariants = {
        hidden: { x: 100, opacity: 0 },
        visible: { x: 0, opacity: 1, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } }
    };

    return (
        <motion.div
            className="w-full flex flex-col lg:flex-row gap-12 lg:gap-8 pt-8 min-h-[80vh] overflow-visible"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
        >
            {/* Left: Main Hero Album Cover */}
            <motion.div variants={itemVariants} className="w-full lg:w-[45%] flex flex-col shrink-0 relative z-[5]">
                <div
                    className="w-full aspect-[3/4] bg-brand-bg relative shadow-[-20px_0_40px_rgba(0,0,0,0.3)] cursor-pointer group rounded-sm"
                    onClick={() => {
                        if (displayList.length > 0) {
                            const currentUrl = mainStack[mainStack.length - 1];
                            const idx = displayList.indexOf(currentUrl);
                            setModalIndex(idx !== -1 ? idx : 0);
                            setModalOpen(true);
                        }
                    }}
                >
                    <AnimatePresence initial={false}>
                        {mainStack.map((url, index) => {
                            const isTop = index === mainStack.length - 1;
                            return (
                                <motion.div
                                    key={url}
                                    layoutId={`gallery-${url}`}
                                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                                    className="absolute inset-0 w-full h-full bg-brand-bg overflow-hidden rounded-sm"
                                    style={{ zIndex: isTop ? 20 : 10 }}
                                >
                                    {url.toLowerCase().endsWith('.mp4') || url.toLowerCase().endsWith('.mov') ? (
                                        <video src={getSafeUrl(url)} autoPlay muted loop playsInline className="w-full h-full object-cover" poster={getThumbnailUrl(url)} />
                                    ) : (
                                        <img src={getSafeUrl(url)} alt={project.name} className="w-full h-full object-cover" />
                                    )}
                                </motion.div>
                            )
                        })}
                    </AnimatePresence>

                    {/* Main Cover Label */}
                    <div className="absolute top-4 left-4 bg-brand-bg/80 text-brand-red text-[0.75rem] font-bold uppercase tracking-widest px-3 py-1.5 rounded backdrop-blur-md pointer-events-none z-40 border border-brand-red/20 shadow-xl">
                        {displayList.indexOf(mainStack[mainStack.length - 1]) + 1} / {displayList.length}
                    </div>

                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none z-30">
                        <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></svg>
                        </div>
                    </div>

                    <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 bg-gradient-to-t from-black/60 to-transparent text-white z-30 pointer-events-none">
                        <div className="text-4xl md:text-6xl font-display uppercase leading-none tracking-tighter mb-2 whitespace-pre-line">
                            {project.name}
                        </div>
                        <div className="text-xs md:text-sm font-mono uppercase tracking-widest opacity-80">
                            {project.subtitle}
                        </div>
                    </div>
                </div>

                <button
                    onClick={onBack}
                    className="mt-8 self-start text-xs font-bold uppercase tracking-[0.2em] text-brand-red flex items-center gap-3 group"
                >
                    <span className="w-8 h-[1px] bg-brand-red transition-all group-hover:w-16" />
                    <span>Back to Index</span>
                </button>
            </motion.div>

            {/* Right: Gallery Grid & Details */}
            <div className="w-full lg:w-[55%] flex flex-col relative overflow-visible z-50 pointer-events-auto">

                <motion.div variants={itemVariants} className="mb-4 pl-4 lg:pl-8 relative z-10 pointer-events-none">
                    <h3 className="text-sm font-bold uppercase tracking-widest mb-4 opacity-40">Project Overview</h3>
                    <p className="text-lg md:text-xl font-sans font-light leading-relaxed uppercase">
                        {project.description}
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3">
                        {project.services.map((s, i) => (
                            <span key={i} className="px-3 py-1 border border-brand-red/20 text-[0.625rem] font-bold uppercase tracking-widest text-brand-red bg-brand-bg/50 backdrop-blur-sm">
                                {s}
                            </span>
                        ))}
                    </div>
                </motion.div>

                {/* Scattered Gallery Area */}
                <motion.div
                    variants={itemVariants}
                    className="flex-1 relative min-h-[31.25rem] md:min-h-[37.5rem] w-full mt-4 z-[60] pointer-events-auto"
                    style={{ perspective: 1500 }}
                >
                    {isApiLoading ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <LoadingFrame className="w-64 h-64 md:w-80 md:h-80 rounded-xl" />
                        </div>
                    ) : (
                        <div className="relative w-full h-full pointer-events-auto z-10" style={{ transformStyle: "preserve-3d" }}>
                            <AnimatePresence mode="popLayout">
                                {galleryQueue.slice(0, VISIBLE_COUNT).map((url, i) => {
                                    const imgIndex = displayList.indexOf(url);
                                    return <GalleryItem
                                        key={url}
                                        url={url}
                                        imgIndex={imgIndex === -1 ? i + 1 : imgIndex + 1}
                                        totalCount={displayList.length}
                                        pos={positions[i]}
                                        onClick={handleThumbnailClick}
                                    />
                                })}
                            </AnimatePresence>
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Media Modal */}
            {createPortal(
                <AnimatePresence>
                    {modalOpen && displayList.length > 0 && displayList[modalIndex] && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-bg/95 backdrop-blur-md p-4 md:p-10 cursor-auto"
                            onClick={handleCloseModal}
                        >
                            <button
                                onClick={handleCloseModal}
                                className="absolute top-6 right-6 md:top-10 md:right-10 text-brand-red/70 hover:text-brand-red transition-colors z-[110] p-2"
                            >
                                <X size={48} strokeWidth={1.5} />
                            </button>

                            <button
                                onClick={handlePrevModal}
                                className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 text-brand-red/70 hover:text-brand-red transition-colors z-[110] p-4 group"
                            >
                                <ChevronLeft size={48} strokeWidth={1.5} className="group-hover:-translate-x-2 transition-transform" />
                            </button>

                            <button
                                onClick={handleNextModal}
                                className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 text-brand-red/70 hover:text-brand-red transition-colors z-[110] p-4 group"
                            >
                                <ChevronRight size={48} strokeWidth={1.5} className="group-hover:translate-x-2 transition-transform" />
                            </button>

                            <motion.div
                                key={modalIndex}
                                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.95, opacity: 0, y: -20 }}
                                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                className="w-full max-w-6xl aspect-[16/9] md:aspect-auto md:h-[80vh] relative flex items-center justify-center rounded-sm overflow-hidden"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {displayList[modalIndex].toLowerCase().endsWith('.mp4') || displayList[modalIndex].toLowerCase().endsWith('.mov') ? (
                                    <video src={getSafeUrl(displayList[modalIndex])} controls autoPlay playsInline className="max-w-full max-h-full object-contain shadow-2xl" poster={getThumbnailUrl(displayList[modalIndex])} />
                                ) : (
                                    <img src={getSafeUrl(displayList[modalIndex])} alt={`Gallery detail ${modalIndex}`} className="max-w-full max-h-full object-contain shadow-2xl" />
                                )}

                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-brand-red/50 text-sm font-mono tracking-widest bg-brand-bg/50 px-4 py-1 rounded backdrop-blur-md">
                                    {modalIndex + 1} / {displayList.length}
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </motion.div>
    );
};


// --- Main Section Component ---

interface WorkSectionProps {
    containerRef?: React.RefObject<HTMLDivElement>;
}

export const WorkSection: React.FC<WorkSectionProps> = ({ containerRef }) => {
    const containerRefInternal = useRef<HTMLDivElement>(null);
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    const globalMouseX = useMotionValue(0.5);
    const globalMouseY = useMotionValue(0.5);
    const globalMouse = { x: globalMouseX, y: globalMouseY };

    const { scrollYProgress } = useScroll({
        target: containerRefInternal,
        container: containerRef,
        offset: ["start end", "end start"]
    });

    const handleSectionMouseMove = (e: React.MouseEvent<HTMLElement>) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        globalMouseX.set(clientX / innerWidth);
        globalMouseY.set(clientY / innerHeight);
    };

    const handleProjectClick = (project: Project) => {
        setSelectedProject(project);
        setHoveredId(null);
        // Optional: Scroll to top of section smoothly when opening
        if (containerRef.current) {
            containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const handleBack = () => {
        setSelectedProject(null);
    };

    // Split projects for list view columns
    const leftColProjects = PROJECTS.filter((_, i) => i % 2 === 0);
    const rightColProjects = PROJECTS.filter((_, i) => i % 2 !== 0);

    // Animation variants for the List View Container
    // Staggered exit to left
    const listContainerVariants = {
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.05, delayChildren: 0.1 }
        },
        exit: {
            opacity: 0,
            transition: { staggerChildren: 0.05, staggerDirection: 1 }
        }
    };

    // Items move left on exit
    const listChildVariants = {
        visible: { x: 0, opacity: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
        exit: { x: -window.innerWidth, opacity: 0, transition: { duration: 0.8, ease: [0.7, 0, 0.3, 1] as [number, number, number, number] } }
    };

    return (
        <section
            id="work"
            ref={containerRefInternal}
            onMouseMove={handleSectionMouseMove}
            className="relative w-full bg-brand-bg text-brand-red py-24 md:py-40 min-h-screen overflow-hidden"
        >
            <div className="w-full max-w-[96%] mx-auto px-4 relative z-10">

                {/* 
            HEADER AREA 
            Remains VISIBLE even when switching to gallery 
        */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-24 md:mb-40">
                    <div className="text-[6vw] md:text-[4vw] font-display leading-[0.6] tracking-tighter uppercase text-brand-red mix-blend-difference z-40">
                        <span className="block"><TextReveal delay={0}>HACKATHON,</TextReveal></span>
                        <span className="block"><TextReveal delay={0.2}>DEMODAY</TextReveal></span>
                        <span className="block"><TextReveal delay={0.4}>AND FESTIVAL</TextReveal> <sup className="text-[2vw] align-top opacity-60">(5)</sup></span>
                    </div>
                </div>

                {/* 
            CONTENT SWITCHER 
            List View <-> Gallery View
        */}
                <AnimatePresence mode="wait">
                    {!selectedProject ? (
                        /* List View */
                        <motion.div
                            key="list-view"
                            className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-32 w-full"
                            variants={listContainerVariants}
                            initial="visible" // When mounting initially or returning
                            animate="visible"
                            exit="exit"
                        >
                            <div className="flex flex-col gap-32 md:gap-64">
                                {leftColProjects.map((project) => (
                                    <motion.div key={project.id} variants={listChildVariants}>
                                        <ProjectCard
                                            project={project}
                                            scrollYProgress={scrollYProgress}
                                            hoveredId={hoveredId}
                                            setHoveredId={setHoveredId}
                                            globalMouse={globalMouse}
                                            onClick={handleProjectClick}
                                        />
                                    </motion.div>
                                ))}
                            </div>
                            <div className="flex flex-col gap-32 md:gap-64 md:pt-64">
                                {rightColProjects.map((project) => (
                                    <motion.div key={project.id} variants={listChildVariants}>
                                        <ProjectCard
                                            project={project}
                                            scrollYProgress={scrollYProgress}
                                            hoveredId={hoveredId}
                                            setHoveredId={setHoveredId}
                                            globalMouse={globalMouse}
                                            onClick={handleProjectClick}
                                        />
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        /* Gallery View */
                        <motion.div
                            key="gallery-view"
                            className="w-full"
                            initial={{ x: window.innerWidth, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: window.innerWidth, opacity: 0 }}
                            transition={{ duration: 0.8, ease: [0.645, 0.045, 0.355, 1.000] }}
                        >
                            <GalleryView project={selectedProject} onBack={handleBack} />
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </section>
    );
};