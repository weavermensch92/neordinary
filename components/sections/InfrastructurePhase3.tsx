import React from 'react';

interface InfrastructurePhase3Props {
    active: boolean;
    slideUpProgress: number; // 0 to 1 (Window sliding up)
    sequenceProgress: number; // 0 to 1 (Internal scroll sequence)
}

export const InfrastructurePhase3: React.FC<InfrastructurePhase3Props> = ({ active, slideUpProgress, sequenceProgress }) => {

    // --- EASING FUNCTIONS ---
    const easeInOutCubic = (x: number) => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    const easeInQuad = (x: number) => x * x;

    // --- 1. SLIDE UP LOGIC ---
    const slideY = (1 - easeInOutCubic(slideUpProgress)) * 100;

    // --- 2. ZOOM & WINDOW LOGIC (0.0 to 0.25 of sequence) ---
    // The user sees the Orange text. As they scroll, it zooms in.
    const zoomDuration = 0.25;
    const zoomProgress = Math.min(Math.max(sequenceProgress / zoomDuration, 0), 1);
    const zoomEase = easeInQuad(zoomProgress);

    // Scale goes from 1 to 150 (flying through)
    const maskScale = 1 + zoomEase * 149;

    // Opacity: Orange text and Black shadow fade out as we get closer to reveal the "hole"
    // Fade starts at 20% zoom, ends at 80% zoom
    const fadeStart = 0.1;
    const fadeEnd = 0.5;
    const fadeP = Math.min(Math.max((zoomProgress - fadeStart) / (fadeEnd - fadeStart), 0), 1);
    const textElementsOpacity = 1 - fadeP;

    // The White Background Layer needs to disappear once we have flown through it (e.g., zoom > 95%)
    const whiteLayerVisible = zoomProgress < 0.95;

    // --- 3. CONTENT FEED LOGIC (0.25 to 1.0 of sequence) ---
    // Once we fly through, we are in the "Feed".
    // It scrolls up.
    const feedStart = 0.20; // Start slightly overlapping with end of zoom
    const feedProgress = Math.min(Math.max((sequenceProgress - feedStart) / (1 - feedStart), 0), 1);

    // Content moves from Y=100vh (below screen) to Y=-100% (scrolled past)
    // But strictly mimicking Valiente:
    // Initial state (after zoom): Header text is visible.
    // Then we scroll down to see more.
    const feedTranslateY = (1 - feedProgress) * 100 - (feedProgress * 50);
    // Adjust: Start at 0px (centered) and scroll UP.
    // Actually, Valiente starts with the first element centered.
    // Let's map feedProgress 0 -> 0px, 1 -> -2000px (approx height of content)
    const feedScrollY = -feedProgress * 2500; // Arbitrary pixel height of content

    return (
        <div
            className="fixed inset-0 z-[9999] w-screen h-screen overflow-hidden bg-black pointer-events-none will-change-transform"
            style={{
                transform: `translateY(${slideY}%)`,
            }}
        >
            {/* --- SCENE 2: THE CONTENT FEED (Revealed after zoom) --- */}
            <div
                className="absolute top-0 left-0 w-full flex flex-col items-center pt-[30vh] pb-[50vh] will-change-transform"
                style={{
                    transform: `translateY(${feedScrollY}px)`,
                    opacity: zoomProgress > 0.8 ? 1 : 0, // Quick fade in as we fly through
                    transition: 'opacity 0.3s'
                }}
            >
                {/* HERO TEXT */}
                <div className="text-center mb-32 px-4">
                    <p className="text-white text-sm md:text-xl font-bold tracking-[0.5em] uppercase mb-6">We Are</p>
                    <h2 className="text-6xl md:text-9xl font-black text-white tracking-tighter leading-none mb-4">
                        THE NEW WAVE
                    </h2>
                    <div className="w-24 h-2 bg-[#FF3300] mx-auto"></div>
                </div>

                {/* VIDEO PLACEHOLDER 1 (Full Width) */}
                <div className="w-full max-w-[100rem] h-[60vh] bg-[#111] border border-white/10 mb-32 relative group">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-700 font-bold uppercase tracking-widest group-hover:text-gray-500 transition-colors">
                        Video Component 01
                    </div>
                </div>

                {/* SPLIT SECTION */}
                <div className="w-full max-w-[100rem] grid grid-cols-1 md:grid-cols-2 gap-12 px-6 mb-32">
                    <div className="flex flex-col justify-center">
                        <h3 className="text-4xl md:text-7xl font-black text-white tracking-tighter mb-8 leading-tight">
                            HYPER<br />SCALING<br /><span className="text-[#FF3300]">INFRA</span>
                        </h3>
                        <p className="text-gray-400 leading-relaxed max-w-md">
                            Our infrastructure is designed to handle the velocity of modern AI development, bridging the gap between academic potential and enterprise requirements.
                        </p>
                    </div>
                    <div className="h-[50vh] bg-[#111] border border-white/10 relative flex items-center justify-center">
                        <div className="text-gray-700 font-bold uppercase tracking-widest">
                            Video Component 02
                        </div>
                    </div>
                </div>

                {/* VIDEO PLACEHOLDER 2 (Full Width) */}
                <div className="w-full h-[80vh] bg-[#111] border-y border-white/10 mb-32 relative flex items-center justify-center">
                    <div className="text-gray-700 font-bold uppercase tracking-widest">
                        Video Component 03 (Immersive)
                    </div>
                    <div className="absolute bottom-12 left-12 text-white/50 text-xs tracking-[0.2em] uppercase">
                        Neordinary Dimensions
                    </div>
                </div>

                {/* FOOTER TEXT */}
                <div className="text-center px-4">
                    <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-none stroke-text">
                        REAL-WORLD IMPACT
                    </h2>
                </div>
            </div>


            {/* --- SCENE 1: THE WINDOW (SVG MASK) --- */}
            {whiteLayerVisible && (
                <div
                    className="absolute inset-0 z-50 flex items-center justify-center will-change-transform origin-center"
                    style={{ transform: `scale(${maskScale})` }}
                >
                    <svg width="100%" height="100%" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
                        <defs>
                            {/* THE MASK: White is solid, Black is transparent hole */}
                            <mask id="text-window-mask">
                                <rect x="0" y="0" width="100%" height="100%" fill="white" />
                                {/* The Hole Text */}
                                <text
                                    x="50%" y="50%"
                                    textAnchor="middle"
                                    dominantBaseline="central"
                                    fontSize="280"
                                    fontFamily="'Inter', sans-serif"
                                    fontWeight="900"
                                    letterSpacing="-10"
                                    fill="black"
                                >
                                    NEO-ORDINARY
                                </text>
                            </mask>
                        </defs>

                        {/* 1. White Background Layer with Hole */}
                        <rect
                            x="0" y="0"
                            width="100%" height="100%"
                            fill="#F5F5F7"
                            mask="url(#text-window-mask)"
                        />

                        {/* 2. Black Block Shadow (Behind Orange, but on top of White) */}
                        {/* We simulate extrusion by rendering text multiple times or using an offset */}
                        <g opacity={textElementsOpacity}>
                            <text
                                x="50%" y="50%"
                                textAnchor="middle"
                                dominantBaseline="central"
                                fontSize="280"
                                fontFamily="'Inter', sans-serif"
                                fontWeight="900"
                                letterSpacing="-10"
                                fill="black"
                                dx="15" dy="12"
                            >
                                NEO-ORDINARY
                            </text>

                            {/* 3. Orange Text Fill (Sits perfectly in the hole of the white layer) */}
                            <text
                                x="50%" y="50%"
                                textAnchor="middle"
                                dominantBaseline="central"
                                fontSize="280"
                                fontFamily="'Inter', sans-serif"
                                fontWeight="900"
                                letterSpacing="-10"
                                fill="#FF3300"
                            >
                                NEO-ORDINARY
                            </text>
                        </g>
                    </svg>
                </div>
            )}

        </div>
    );
};