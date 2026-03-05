import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VideoTransitionProps {
    isActive: boolean;
    targetIndex: number; // 0 to 5
    onMidpoint: () => void;
    onComplete: () => void;
}

// How many seconds before the video ends should the content appear
const CONTENT_APPEAR_OFFSET_SEC = 0.2;

export const VideoTransition: React.FC<VideoTransitionProps> = ({
    isActive,
    targetIndex,
    onMidpoint,
    onComplete
}) => {
    const [showVideo, setShowVideo] = useState(false);
    const [videoSrc, setVideoSrc] = useState('');
    const videoRef = useRef<HTMLVideoElement>(null);
    const hasTriggeredMidpoint = useRef(false);

    useEffect(() => {
        if (isActive) {
            if (targetIndex === 0) {
                setTimeout(() => {
                    onMidpoint();
                    onComplete();
                }, 50);
                return;
            }

            const videoNumber = targetIndex.toString().padStart(2, '0');
            setVideoSrc(`/${videoNumber}_1.webm`);
            setShowVideo(true);
            hasTriggeredMidpoint.current = false;

            // Trigger midpoint immediately so the underlying stage shifts to the next one
            // revealing the 3D background of the new stage
            const midpointTimer = setTimeout(() => {
                if (!hasTriggeredMidpoint.current) {
                    hasTriggeredMidpoint.current = true;
                    onMidpoint();
                }
            }, 50);

            // Allow the video to play entirely over the new stage, overlapping with the content appearance at 2s
            const endTimer = setTimeout(() => {
                setShowVideo(false);
                onComplete();
            }, 2500);

            return () => {
                clearTimeout(midpointTimer);
                clearTimeout(endTimer);
            };
        } else {
            setShowVideo(false);
            setVideoSrc('');
        }
    }, [isActive, targetIndex]);

    useEffect(() => {
        if (showVideo && videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.play().catch(console.error);
        }
    }, [showVideo, videoSrc]);

    return (
        <AnimatePresence>
            {showVideo && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { duration: 0.1 } }}
                    exit={{ opacity: 0, transition: { duration: 0.3 } }}
                    className="fixed inset-0 z-[40] bg-transparent flex items-center justify-center pointer-events-none mix-blend-screen"
                >
                    {videoSrc && (
                        <video
                            ref={videoRef}
                            src={videoSrc}
                            muted
                            playsInline
                            className="w-full h-full object-cover"
                        />
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
};
