import React, { useRef, useEffect, useState } from 'react';
import { Experience } from './components/Experience';
import { Overlay } from './components/Overlay';
import { VideoTransition } from './components/transitions/VideoTransition';

// Import Sections
import { Hero } from './components/sections/Hero';
import { Infrastructure } from './components/sections/Infrastructure';
import { Evaluation } from './components/sections/Evaluation';
import { Deployment } from './components/sections/Deployment';
import { Bridge } from './components/sections/Bridge';
import { Proposal } from './components/sections/Proposal';
import { UMCDataProvider } from './components/umc/lib/UMCDataContext';

const App: React.FC = () => {
  const boundaryAccumulator = useRef(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollOffset = useRef(0);
  const isAnimating = useRef(false);
  const isTransitioningRef = useRef(false);
  const [isExperiencePaused, setIsExperiencePaused] = useState(false);
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionTargetIndex, setTransitionTargetIndex] = useState(0);
  const [exitDirection, setExitDirection] = useState<'left' | 'right'>('left');
  const [isExiting, setIsExiting] = useState(false);

  const sections = [
    { id: 'hero', component: Hero, title: 'NEO ORDINARY' },
    { id: 'infrastructure', component: Infrastructure, title: 'INFRASTRUCTURE' },
    { id: 'evaluation', component: Evaluation, title: 'EVALUATION' },
    { id: 'deployment', component: Deployment, title: 'DEPLOYMENT' },
    { id: 'bridge', component: Bridge, title: 'BRIDGE' },
    { id: 'proposal', component: Proposal, title: 'PROPOSAL' }
  ];

  const initiateTransition = (index: number) => {
    if (isAnimating.current || isTransitioningRef.current) return;
    if (index < 0 || index >= sections.length) return;

    isAnimating.current = true;
    isTransitioningRef.current = true;
    boundaryAccumulator.current = 0; // Reset accumulator on transition
    setExitDirection(index > activeSectionIndex ? 'left' : 'right');
    setIsExiting(true);
    setTransitionTargetIndex(index);
    setIsTransitioning(true);
  };

  const handleTransitionMidpoint = () => {
    // Cut directly to the target slide without smooth scrolling
    if (scrollContainerRef.current) {
      const width = scrollContainerRef.current.clientWidth;
      scrollContainerRef.current.scrollTo({
        left: transitionTargetIndex * width,
        behavior: 'smooth' // Smooth scroll ensures 3D parallax effect glides naturally during the video
      });

      // strict reset scroll to top for target section instantly
      const targetSectionEl = scrollContainerRef.current.children[transitionTargetIndex] as HTMLElement;
      if (targetSectionEl) {
        targetSectionEl.scrollTo({ top: 0, behavior: 'instant' });
      }

      setActiveSectionIndex(transitionTargetIndex);
      setIsExiting(false);
    }
  };

  const handleTransitionComplete = () => {
    setIsTransitioning(false);
    isTransitioningRef.current = false;
    setTimeout(() => {
      isAnimating.current = false;
      boundaryAccumulator.current = 0;
      lastWheelTime.current = Date.now(); // Prevents trackpad momentum bleed-over
    }, 100);
  };

  const scrollToSection = (index: number) => {
    initiateTransition(index);
  };
  // Navigation handler from Overlay or other components
  const handleNavClick = (index: number) => {
    initiateTransition(index);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const { scrollLeft, scrollWidth, clientWidth } = container;

    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll > 0) {
      scrollOffset.current = scrollLeft / maxScroll;
    }

    const index = Math.round(scrollLeft / clientWidth);
    if (index !== activeSectionIndex) {
      setActiveSectionIndex(index);
    }
  };

  const lastWheelTime = useRef<number>(0);
  const canTransitionRef = useRef<boolean>(false);
  const keyPressCount = useRef<number>(0);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (document.body.style.overflow === 'hidden' || isExperiencePaused) return;
      if (Math.abs(e.deltaY) < 5 && Math.abs(e.deltaX) < 5) return;
      if (isAnimating.current) {
        e.preventDefault();
        return;
      }

      const { clientWidth, scrollLeft } = container;
      const currentSlideIndex = Math.round(scrollLeft / clientWidth);
      const currentSectionEl = container.children[currentSlideIndex] as HTMLElement;

      if (!currentSectionEl) return;

      // Find the deeply nested scrolling container the event target belongs to.
      // We start from e.target and go up until we find an element with overflow-y auto/scroll,
      // or we reach currentSectionEl.
      let scrollTarget = e.target as HTMLElement;
      let activeScrollEl = currentSectionEl;

      while (scrollTarget && scrollTarget !== currentSectionEl && scrollTarget !== document.body) {
        const style = window.getComputedStyle(scrollTarget);
        if (style.overflowY === 'auto' || style.overflowY === 'scroll') {
          activeScrollEl = scrollTarget;
          break;
        }
        scrollTarget = scrollTarget.parentElement as HTMLElement;
      }

      const { scrollTop, scrollHeight, clientHeight } = activeScrollEl;

      const isAtTop = scrollTop <= 50;
      const isAtBottom = (scrollTop + clientHeight) >= (scrollHeight - 50);

      const now = Date.now();
      const timeSinceLastWheel = now - lastWheelTime.current;
      lastWheelTime.current = now;

      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
        if (e.deltaX > 0 && currentSlideIndex < sections.length - 1) {
          initiateTransition(currentSlideIndex + 1);
        } else if (e.deltaX < 0 && currentSlideIndex > 0) {
          initiateTransition(currentSlideIndex - 1);
        }
        return;
      }

      // If they are strictly inside the scrollable area (not at bounds), DO NOT track intent or prevent default!
      if (!isAtTop && !isAtBottom) {
        canTransitionRef.current = false;
        return;
      }

      // If user paused scrolling for > 250ms, this is a fresh scroll intent.
      if (timeSinceLastWheel > 250) {
        canTransitionRef.current = true;
      }
      // If they are continuously scrolling, they must NOT bounce and transition instantly.
      // We only allow transition if they hit the boundary explicitly on a FRESH swipe.
      // However, if canTransitionRef is ALREADY true (they did a fresh swipe while at the boundary),
      // we leave it true so the subsequent wheel events in this swipe can trigger.

      if ((e.deltaY > 0 && isAtBottom) || (e.deltaY < 0 && isAtTop)) {
        // We are attempting to scroll past the boundary
        e.preventDefault();

        if (canTransitionRef.current) {
          canTransitionRef.current = false; // consume it so we don't double trigger

          if (e.deltaY > 0 && isAtBottom) {
            const studioPendingSection = currentSectionEl.querySelector('.studio-pending');
            if (studioPendingSection) {
              studioPendingSection.dispatchEvent(new CustomEvent('trigger-studio'));
            } else if (currentSlideIndex < sections.length - 1) {
              initiateTransition(currentSlideIndex + 1);
            }
          } else if (e.deltaY < 0 && isAtTop) {
            if (currentSlideIndex > 0) {
              initiateTransition(currentSlideIndex - 1);
            }
          }
        }
      } else {
        // They are scrolling strictly *within* the content bounds.
        // We do not consume the intent, but they aren't at the boundary anyway.
        canTransitionRef.current = false; // We invalidate the boundary transition intent if they scroll away
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.body.style.overflow === 'hidden' || isExperiencePaused) return;
      if (isAnimating.current || isTransitioningRef.current) {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'PageUp', 'PageDown', ' '].includes(e.key)) {
          e.preventDefault();
        }
        return;
      }

      const { clientWidth, scrollLeft } = container;
      const currentSlideIndex = Math.round(scrollLeft / clientWidth);
      const currentSectionEl = container.children[currentSlideIndex] as HTMLElement;
      if (!currentSectionEl) return;

      const { scrollTop, scrollHeight, clientHeight } = currentSectionEl;

      const isAtTop = scrollTop <= 50;
      const isAtBottom = (scrollTop + clientHeight) >= (scrollHeight - 50);

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        if (e.key !== 'ArrowRight') {
          if (!isAtBottom) {
            keyPressCount.current = 0;
            return;
          }
        }
        e.preventDefault();

        if (e.key === 'ArrowRight' || keyPressCount.current > 0) {
          keyPressCount.current = 0;
          const studioPendingSection = currentSectionEl.querySelector('.studio-pending');
          if (studioPendingSection && e.key !== 'ArrowRight') {
            studioPendingSection.dispatchEvent(new CustomEvent('trigger-studio'));
          } else if (currentSlideIndex < sections.length - 1) {
            initiateTransition(currentSlideIndex + 1);
          }
        } else {
          keyPressCount.current++;
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'PageUp') {
        if (e.key !== 'ArrowLeft') {
          if (!isAtTop) {
            keyPressCount.current = 0;
            return;
          }
        }
        e.preventDefault();

        if (e.key === 'ArrowLeft' || keyPressCount.current > 0) {
          keyPressCount.current = 0;
          if (currentSlideIndex > 0) {
            initiateTransition(currentSlideIndex - 1);
          }
        } else {
          keyPressCount.current++;
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeSectionIndex]);

  return (
    <UMCDataProvider>
      <div className="relative w-full h-full bg-[#050505] overflow-hidden">
        {/* 3D Scene Background */}
        <div className="absolute inset-0 z-0">
          <Experience scrollOffset={scrollOffset} paused={isExperiencePaused} />
        </div>

        {/* Fixed UI Overlay */}
        <div className="absolute inset-0 z-50 pointer-events-none">
          <Overlay onNavigate={handleNavClick} activeSectionIndex={activeSectionIndex} />
        </div>

        {/* WebM Video Transition UI */}
        <VideoTransition
          isActive={isTransitioning}
          targetIndex={transitionTargetIndex}
          onMidpoint={handleTransitionMidpoint}
          onComplete={handleTransitionComplete}
        />

        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className={`absolute inset-0 z-20 flex overflow-hidden overflow-y-hidden snap-x snap-mandatory scroll-container no-scrollbar`}
        >
          {sections.map((section: any, index) => {
            const Section = section.component;
            return (
              <div
                key={index}
                className="w-screen h-screen flex-shrink-0 snap-start snap-always overflow-y-auto overflow-x-hidden scroll-area no-scrollbar"
              >
                <Section
                  onNavigate={handleNavClick}
                  onTogglePause={setIsExperiencePaused}
                  isActive={activeSectionIndex === index}
                  isExiting={activeSectionIndex === index && isExiting}
                  exitDirection={exitDirection}
                />
              </div>
            );
          })}
        </div>

        <style>{`
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          
          .stagger-item {
            opacity: 0;
            transform: translateY(10vh); 
            transition: none;
            will-change: transform, opacity;
          }
          
          .phase-5-active .stagger-item {
            opacity: 1;
            transform: translateY(0);
            transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease-out;
          }
        `}</style>
      </div>
    </UMCDataProvider>
  );
};

export default App;