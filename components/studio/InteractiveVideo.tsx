import React, { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, useSpring, useMotionValue, MotionStyle, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface InteractiveVideoProps {
  className?: string;
  src?: string;
  videoStyle?: MotionStyle;
}

export const InteractiveVideo: React.FC<InteractiveVideoProps> = ({ 
  className = "",
  // Default fallback video if none provided
  src = "https://videos.pexels.com/video-files/5527786/5527786-hd_1920_1080_25fps.mp4",
  videoStyle
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Determine if the source is a Vimeo ID (numeric string) or URL
  let vimeoId: string | null = null;
  if (/^\d+$/.test(src)) {
    vimeoId = src;
  } else if (src.includes('vimeo.com')) {
    const parts = src.split('vimeo.com/');
    const lastPart = parts[parts.length - 1];
    // Extract ID if url is like vimeo.com/123456 or vimeo.com/channels/staffpicks/123456
    const match = lastPart.match(/(\d+)/);
    if (match) vimeoId = match[1];
  }
  
  const isVimeo = !!vimeoId;

  // Mouse position values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring configurations for the magnetic effect
  const springConfig = { stiffness: 400, damping: 35, mass: 0.5 };
  
  const circleX = useSpring(mouseX, springConfig);
  const circleY = useSpring(mouseY, springConfig);

  // Triangle follows slightly looser but still firm
  const iconConfig = { stiffness: 300, damping: 35, mass: 0.8 };
  const triX = useSpring(mouseX, iconConfig);
  const triY = useSpring(mouseY, iconConfig);

  useEffect(() => {
    // Set initial center position
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      mouseX.set(width / 2);
      mouseY.set(height / 2);
    }
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    mouseX.set(x);
    mouseY.set(y);
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    // Return to center
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      mouseX.set(width / 2);
      mouseY.set(height / 2);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsModalOpen(false);
  };

  return (
    <>
      <div 
        ref={containerRef}
        className={`relative w-full h-full overflow-hidden cursor-none bg-black local-cursor-area ${className}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleOpenModal}
      >
        {/* Video Background Layer - motion.div for parallax support */}
        {/* 
          Using pointer-events-none is CRITICAL here for Vimeo iframes.
          Iframes swallow mouse events. To keep the custom cursor logic (which lives on the parent div) working,
          we must let events pass through the iframe.
        */}
        <motion.div 
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={videoStyle}
        >
          {isVimeo && vimeoId ? (
             <iframe 
              src={`https://player.vimeo.com/video/${vimeoId}?background=1&autoplay=1&loop=1&byline=0&title=0&muted=1`}
              className="w-full h-full object-cover opacity-90 scale-125" // scale-125 ensures no black bars during slight aspect ratio mismatches
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              title="Neo-Ordinary Showreel"
            />
          ) : (
            <video 
              autoPlay 
              muted 
              loop 
              playsInline
              className="w-full h-full object-cover opacity-90"
              key={src} // Add key to force reload on src change
            >
              <source src={src} type="video/mp4" />
            </video>
          )}
        </motion.div>

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-transparent to-transparent z-20 pointer-events-none opacity-20" />

        {/* Custom Cursor Layer */}
        {/* mix-blend-difference creates the "divide/invert" effect on colors. */}
        <div className="absolute inset-0 z-30 pointer-events-none mix-blend-difference">
          {/* Circle Ring */}
          <motion.div
            style={{ x: circleX, y: circleY }}
            className="absolute top-0 left-0 -ml-16 -mt-16 w-32 h-32 rounded-full border-[3px] border-[#FF1F1F]"
          />
          
          {/* Triangle (Play Button Shape) */}
          <motion.div
            style={{ x: triX, y: triY }}
            className="absolute top-0 left-0 -ml-4 -mt-4"
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FF1F1F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
              <path d="M5 3l14 9-14 9V3z" />
            </svg>
          </motion.div>
        </div>

        {/* Label */}
        <div className="absolute bottom-10 left-10 z-20 text-white/50 text-xs tracking-widest uppercase font-mono">
          Showreel 2025
        </div>
      </div>

      {/* Video Modal */}
      {createPortal(
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-xl p-4 md:p-10 cursor-auto"
              onClick={handleCloseModal}
            >
              <button
                onClick={handleCloseModal}
                className="absolute top-6 right-6 md:top-10 md:right-10 text-white/70 hover:text-[#FF1F1F] transition-colors z-[110] p-2"
              >
                <X size={48} strokeWidth={1.5} />
              </button>

              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-7xl aspect-video bg-black relative shadow-2xl overflow-hidden border border-white/10"
                onClick={(e) => e.stopPropagation()}
              >
                 {isVimeo && vimeoId ? (
                    <iframe
                      src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1&title=0&byline=0&portrait=0`}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                      title="Neo-Ordinary Showreel Full"
                    />
                 ) : (
                    <video
                      src={src}
                      controls
                      autoPlay
                      className="w-full h-full object-contain"
                    />
                 )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};