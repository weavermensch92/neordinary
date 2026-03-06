import React, { useState } from 'react';
import { motion, useScroll, useMotionValueEvent, Variants } from 'framer-motion';

interface NavigationProps {
  show: boolean;
  containerRef?: React.RefObject<HTMLDivElement | null>;
  onClose?: () => void;
  onMinimize?: () => void;
}

const MENU_ITEMS = [
  "NE(o)RDINARY ;",
  "GROUPs ;",
  "CMC ;",
  "UMC ;",
  "University-s ;",
  "WORKERS ;"
];

export const Navigation: React.FC<NavigationProps> = ({ show, containerRef, onClose, onMinimize }) => {
  const { scrollY } = useScroll({ container: containerRef });
  const [isScrolledDown, setIsScrolledDown] = useState(false);
  const [isRightHovered, setIsRightHovered] = useState(false);

  // Scroll detection logic
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    const diff = latest - previous;
    // Hide nav elements when scrolling down past 50px
    if (diff > 0 && latest > 50) {
      setIsScrolledDown(true);
    }
    // Show nav elements when scrolling up
    else if (diff < 0) {
      setIsScrolledDown(false);
    }
    // Always show at very top
    if (latest <= 50) {
      setIsScrolledDown(false);
    }
  });

  // --- Logic Separation ---

  // General Visibility (Left Menu, Logo):
  // Removed isMouseTop logic so it purely depends on scroll direction/position.
  const isGeneralNavVisible = show && !isScrolledDown;

  // Right Column State:
  const isRightExpanded = show && (!isScrolledDown || isRightHovered);

  // --- Animation Variants ---

  const menuListVariants: Variants = {
    hidden: {
      transition: { staggerChildren: 0.05, staggerDirection: 1 }
    },
    visible: {
      transition: { staggerChildren: 0.1, delayChildren: 0.2, staggerDirection: -1 }
    }
  };

  const menuItemVariants: Variants = {
    hidden: { y: -20, opacity: 0 },
    visible: {
      y: 0, opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 12, mass: 0.8 }
    }
  };

  const logoVariants: Variants = {
    hidden: {
      y: "-150%", scale: 0.3, opacity: 0,
      transition: { duration: 0.3, ease: "easeInOut" }
    },
    visible: {
      y: "0%", scale: 1, opacity: 1,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  // Right Side Animation
  // The logic here is: The Arrow is the anchor.
  // Expanded: The whole group moves DOWN (y: 105) to reveal the text above.
  // Collapsed: The whole group moves UP (y: 0) to its fixed position.

  const rightWrapperVariants: Variants = {
    expanded: {
      y: 105, // Reduced from 180 to keep it higher
      transition: { type: "spring", stiffness: 180, damping: 24 }
    },
    collapsed: {
      y: 0, // Reset to top anchor
      transition: { type: "spring", stiffness: 180, damping: 24 }
    }
  };

  const textVariants: Variants = {
    expanded: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, delay: 0.1 }
    },
    collapsed: {
      opacity: 0,
      y: 20,
      transition: { duration: 0.2 }
    }
  }

  return (
    <nav
      className="sticky top-0 left-0 right-0 z-50 pointer-events-none px-4 py-4 md:px-8 md:py-6 h-0 flex justify-between items-start"
    >
      {/* 
        LEFT COLUMN: Menu Items 
      */}
      <motion.div
        className="flex flex-col items-start gap-1 pointer-events-auto"
        initial="hidden"
        animate={isGeneralNavVisible ? "visible" : "hidden"}
        variants={menuListVariants}
      >
        {MENU_ITEMS.map((item) => (
          <motion.a
            key={item}
            href={`#${item.toLowerCase().replace(/[^a-z]/g, '')}`}
            className="text-[0.625rem] md:text-xs font-bold uppercase tracking-wider text-brand-red hover:text-brand-dark transition-colors duration-300 font-sans"
            variants={menuItemVariants}
          >
            {item}
          </motion.a>
        ))}
      </motion.div>

      {/* 
        CENTER: Logo (Text)
      */}
      <motion.div
        className="absolute top-4 md:top-6 left-0 w-full flex justify-center pointer-events-none"
        initial="hidden"
        animate={isGeneralNavVisible ? "visible" : "hidden"}
        variants={logoVariants}
      >
        <h1
          className="font-display text-2xl md:text-4xl tracking-tighter text-brand-red leading-none uppercase text-center cursor-pointer pointer-events-auto"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          NE(O)RDINARY
        </h1>
      </motion.div>

      {/* 
        RIGHT COLUMN: Navigator Area 
        Instead of the button handling the hover, we create a larger "Specific Area" (Trigger Zone)
        in the top-right corner. This prevents flickering and makes interaction smoother.
      */}
      <div
        className="absolute top-0 right-0 w-[12.5rem] h-[12.5rem] z-50 pointer-events-auto"
        onMouseEnter={() => setIsRightHovered(true)}
        onMouseLeave={() => setIsRightHovered(false)}
      >
        {/* 
             Visual Container 
          */}
        <motion.div
          className="absolute top-6 right-2 md:top-8 md:right-6 flex flex-col items-center translate-x-[6.875rem]"
          variants={rightWrapperVariants}
          initial="expanded"
          animate={isRightExpanded ? "expanded" : "collapsed"}
        >
          {/* 
                  Text Block 
              */}
          <motion.div
            className="absolute bottom-full mb-10 flex flex-col items-center origin-bottom left-1/2"
            style={{ x: "-50%" }}
            variants={textVariants}
          >
            <div className="-rotate-90 flex flex-col items-center gap-0">
              <span className="block text-sm md:text-base font-bold uppercase leading-[0.85] text-[#FF1F1F] whitespace-nowrap tracking-wider">BACK TO</span>
              <span className="block text-sm md:text-base font-bold uppercase leading-[0.85] text-[#FF1F1F] whitespace-nowrap tracking-wider">NAVIGATOR</span>
            </div>
          </motion.div>

          {/* 
                  Icon Block 
              */}
          <div className="">
            <button
              onClick={(e) => {
                e.preventDefault();
                onMinimize?.();
              }}
              className="flex items-center justify-center bg-transparent group cursor-pointer focus:outline-none"
            >
              <svg
                viewBox="0 0 40 40"
                className="w-8 h-8 md:w-10 md:h-10 fill-[#FF1F1F] group-hover:fill-brand-dark -rotate-90 transition-colors duration-300"
              >
                <path d="M25.338 26.973c-.232.203-.58.232-.811 0l-8.2-8.2c-.203-.202-.464-.058-.464.174v4.376c0 .376-.203.58-.58.58h-.695a.563.563 0 0 1-.58-.58v-7.62c0-.349.261-.58.58-.58h7.65c.318 0 .58.231.58.58v.666c0 .347-.262.608-.61.608h-4.346c-.26 0-.376.232-.173.435l8.2 8.229c.231.231.231.608 0 .81l-.551.522Z"></path>
                <path d="M2.42 20.06c0 9.722 7.882 17.603 17.603 17.603 9.722 0 17.603-7.881 17.603-17.602 0-9.722-7.881-17.603-17.603-17.603-9.721 0-17.602 7.881-17.602 17.602Zm-1.81 0C.61 9.34 9.302.648 20.023.648c10.722 0 19.414 8.692 19.414 19.414 0 10.721-8.692 19.413-19.414 19.413C9.302 39.474.61 30.782.61 20.06Z"></path>
              </svg>
            </button>
          </div>
        </motion.div>
      </div>
    </nav>
  );
};