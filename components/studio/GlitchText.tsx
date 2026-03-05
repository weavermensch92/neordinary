import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface GlitchTextProps {
  text: string;
  isActive: boolean;
  className?: string;
  onSettled?: () => void;
  speed?: 'fast' | 'medium' | 'slow';
  enableReveal?: boolean;
  delay?: number; // 전체적인 해제 지연 시간
  charDelays?: number[]; // 각 문자별 개별 지연 시간 (스윕 효과용)
  movementDelay?: number; // 박스 아래에서 솟아오르는 이동 지연 시간
}

// Reduced character set for less visual noise (removed heavy symbols like #@%&)
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789./-[]";

interface SingleCharProps {
  char: string;
  index: number;
  isActive: boolean;
  duration: number;
  enableReveal: boolean;
  resolveDelay: number;
  intervalSpeed: number;
  movementDelay: number;
}

const SingleChar: React.FC<SingleCharProps> = ({
  char,
  index,
  isActive,
  duration,
  enableReveal,
  resolveDelay,
  intervalSpeed,
  movementDelay,
}) => {
  const [displayChar, setDisplayChar] = useState(CHARS[Math.floor(Math.random() * CHARS.length)]);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (!isActive) {
      setDisplayChar("");
      setIsDone(false);
      return;
    }

    let interval: ReturnType<typeof setInterval>;
    let startTimeout: ReturnType<typeof setTimeout>;
    let resolveTimeout: ReturnType<typeof setTimeout>;

    // Stagger start slightly based on index
    const charStagger = index * 5;

    // Total time until resolution: Movement Delay + Char Resolve Delay + Base Duration
    const totalResolveTime = (movementDelay * 1000) + (resolveDelay * 1000) + duration;

    // Start cycling when movement starts
    startTimeout = setTimeout(() => {
      interval = setInterval(() => {
        setDisplayChar(CHARS[Math.floor(Math.random() * CHARS.length)]);
      }, intervalSpeed);
    }, movementDelay * 1000);

    // Stop cycling and set final char after total delay
    resolveTimeout = setTimeout(() => {
      if (interval) clearInterval(interval);
      setDisplayChar(char);
      setIsDone(true);
    }, totalResolveTime);

    return () => {
      if (interval) clearInterval(interval);
      clearTimeout(startTimeout);
      clearTimeout(resolveTimeout);
    };
  }, [isActive, char, index, duration, resolveDelay, intervalSpeed]);

  if (char === " ") return <span className="inline-block whitespace-pre">&nbsp;</span>;

  // Animation Logic
  // Y-reveal animation still respects the stagger/delay visually if handled by parent, 
  // but here we just ensure it's positioned correctly.
  const initialY = enableReveal ? "100%" : "0%";
  const animateY = isActive ? "0%" : (enableReveal ? "100%" : "0%");

  return (
    <span className="inline-block overflow-hidden align-bottom leading-none relative">
      <motion.span
        className={`inline-block ${isDone ? 'text-inherit' : 'text-brand-red'}`}
        initial={{ y: "110%" }}
        animate={isActive ? { y: "0%" } : { y: "110%" }}
        transition={{
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1],
          delay: movementDelay
        }}
      >
        {isActive ? (isDone ? char : displayChar) : ""}
      </motion.span>
    </span>
  );
};

export const GlitchText: React.FC<GlitchTextProps> = ({
  text,
  isActive,
  className = "",
  onSettled,
  speed = 'medium',
  enableReveal = true,
  delay = 0,
  charDelays,
  movementDelay = 0,
}) => {
  // Reduced durations for a snappier effect
  const durationMap = {
    fast: 150,   // Faster settle time
    medium: 400,
    slow: 700
  };

  // Controls how fast the random characters flip
  const intervalMap = {
    fast: 30, // Extremely rapid flickering
    medium: 60,
    slow: 120
  }

  const duration = durationMap[speed];
  const intervalSpeed = intervalMap[speed];

  // Notify parent when roughly settled
  useEffect(() => {
    if (isActive && onSettled) {
      const maxDuration = (text.length * 5) + duration + (delay * 1000) + 100;
      const timer = setTimeout(onSettled, maxDuration);
      return () => clearTimeout(timer);
    }
  }, [isActive, text, onSettled, duration, delay, charDelays, movementDelay]);

  return (
    <span className={`inline-flex whitespace-pre ${className}`}>
      {text.split('').map((char, i) => (
        <SingleChar
          key={`${i}-${char}`}
          char={char}
          index={i}
          isActive={isActive}
          duration={duration}
          enableReveal={enableReveal}
          resolveDelay={charDelays ? charDelays[i] : (delay + i * 0.01)}
          intervalSpeed={intervalSpeed}
          movementDelay={movementDelay}
        />
      ))}
    </span>
  );
};