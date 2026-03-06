import React, { useState, useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { ProcessedItem } from './types';
import { getOptimizedImageUrl } from './lib/notionUtils';

// Reusable Card Component
export const NotionCardComponent: React.FC<{ item: ProcessedItem, isGrid?: boolean, loadImage?: boolean }> = ({ item, isGrid, loadImage = true }) => {
    const [displaySrc, setDisplaySrc] = useState<string | null>(null);
    const [scannedImageUrl, setScannedImageUrl] = useState<string | null>(null);
    const [status, setStatus] = useState<'INIT' | 'LOADING_IMAGE' | 'SCANNING_BLOCKS' | 'PERMANENT_SCAN' | 'LOADED' | 'ERROR' | 'IDLE'>('IDLE');
    const [debugInfo, setDebugInfo] = useState<string>(item.imageDebugReason || '');
    const fallbackTimerRef = useRef<number | null>(null);
    const [hasScanned, setHasScanned] = useState(false);
    const isMountedRef = useRef(true);

    useEffect(() => {
        isMountedRef.current = true;
        return () => { isMountedRef.current = false; };
    }, []);

    const scanBlocks = async () => {
        if (hasScanned || !isMountedRef.current) return;
        setHasScanned(true);
        setStatus('SCANNING_BLOCKS');

        await new Promise(res => setTimeout(res, Math.random() * 2000));

        try {
            if (item.id.startsWith('mock-') || item.id.startsWith('skel-')) {
                if (isMountedRef.current) {
                    setDebugInfo(prev => prev + " | Mock/Skeleton Data");
                    setStatus('PERMANENT_SCAN');
                }
                return;
            }

            const targetUrl = `/api/notion/blocks/${item.id}?page_size=100`;

            const response = await fetch(targetUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error("API_ERR");

            const data = await response.json();
            const imgBlock = data.results?.find((b: any) => b.type === 'image');

            if (isMountedRef.current) {
                if (imgBlock) {
                    const url = imgBlock.image.type === 'file' ? imgBlock.image.file.url : imgBlock.image.external.url;
                    setScannedImageUrl(url);
                    const targetWidth = 300;
                    const optimizedUrl = getOptimizedImageUrl(url, targetWidth);

                    setDisplaySrc(optimizedUrl);
                    setStatus('LOADING_IMAGE');

                    if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
                    fallbackTimerRef.current = window.setTimeout(() => {
                        if (isMountedRef.current) setDisplaySrc(url);
                    }, 3000);

                } else {
                    setDebugInfo(prev => prev + " | No image blocks in first 100.");
                    setStatus('PERMANENT_SCAN');
                }
            }
        } catch (e: any) {
            if (isMountedRef.current) {
                setDebugInfo(prev => prev + ` | Scan Unavailable (${e.message})`);
                setStatus('PERMANENT_SCAN');
            }
        }
    };

    useEffect(() => {
        if (!loadImage || item.isSkeleton) {
            // SPECIAL CASE: Even if skeleton, if it has a preloaded image, show it!
            if (item.isSkeleton && item.imageUrl) {
                setDisplaySrc(item.imageUrl);
                setStatus('LOADED');
                return;
            }
            setStatus('IDLE');
            return;
        }

        if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);

        const init = async () => {
            if (item.imageUrl) {
                const targetWidth = 300;
                const optimizedUrl = getOptimizedImageUrl(item.imageUrl, targetWidth);

                if (isMountedRef.current) {
                    setDisplaySrc(optimizedUrl);
                    setStatus('LOADING_IMAGE');

                    fallbackTimerRef.current = window.setTimeout(() => {
                        if (isMountedRef.current) {
                            setDisplaySrc(item.imageUrl);
                        }
                    }, 3000);
                }
                return;
            }
            scanBlocks();
        };

        init();
        return () => { if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current); };
    }, [item.id, item.imageUrl, loadImage, isGrid, item.isSkeleton]);

    const handleImageLoad = () => {
        setStatus('LOADED');
        if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
    };

    const handleImageError = () => {
        if (displaySrc?.includes('wsrv.nl') && status === 'LOADING_IMAGE') {
            if (item.imageUrl) {
                setDisplaySrc(item.imageUrl);
                return;
            }
            if (scannedImageUrl) {
                setDisplaySrc(scannedImageUrl);
                return;
            }
        }
        if (item.imageUrl && !hasScanned) {
            scanBlocks();
        } else {
            setStatus('PERMANENT_SCAN');
            setDebugInfo(prev => prev + " | Load failed.");
        }
    };

    if (item.isSkeleton && !item.imageUrl) {
        return (
            <div className="h-full w-full bg-zinc-200 animate-pulse flex flex-col">
                <div className="flex-1 border-b border-white/20"></div>
                <div className="h-1/3 p-3 space-y-2">
                    <div className="h-2 w-2/3 bg-zinc-300 rounded"></div>
                    <div className="h-2 w-1/2 bg-zinc-300 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col relative bg-white w-full group">
            <div className="flex-1 w-full relative overflow-hidden bg-zinc-200 flex items-center justify-center border-b border-red-100">
                {displaySrc && (status === 'LOADING_IMAGE' || status === 'LOADED') && (
                    <div className="w-full h-full overflow-hidden relative">
                        {(status === 'LOADING_IMAGE') && (
                            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-zinc-100 text-zinc-400 gap-2">
                                <Loader2 className="animate-spin text-red-500" size={20} />
                            </div>
                        )}
                        <img
                            src={displaySrc || undefined}
                            alt={item.name}
                            loading="lazy"
                            decoding="async"
                            referrerPolicy="no-referrer"
                            className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${status === 'LOADING_IMAGE' ? 'opacity-0' : 'opacity-100'}`}
                            onLoad={handleImageLoad}
                            onError={handleImageError}
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10 opacity-50 pointer-events-none" style={{ backgroundSize: '100% 4px' }} />
                        {item.isPreloaded && (
                            <div className="absolute top-2 right-2 bg-red-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow-sm z-20">
                                CACHED
                            </div>
                        )}
                    </div>
                )}

                {(status === 'PERMANENT_SCAN' || status === 'SCANNING_BLOCKS') && (
                    <div className="flex flex-col items-center justify-center h-full p-4 text-center text-zinc-500 gap-3 bg-zinc-100 relative overflow-hidden w-full">
                        <div className="relative z-10 flex flex-col items-center gap-2">
                            <Loader2 size={24} className="animate-spin text-red-500 opacity-60" />
                            <span className="text-[9px] font-mono font-bold text-zinc-400 tracking-widest animate-pulse">
                                {status === 'SCANNING_BLOCKS' ? 'SCANNING...' : 'NO_SIGNAL'}
                            </span>
                        </div>
                    </div>
                )}

                {(status === 'IDLE' || status === 'INIT') && !displaySrc && (
                    <div className="bg-zinc-100 w-full h-full flex items-center justify-center">
                        <span className="text-[9px] text-zinc-400 font-mono">WAITING_FOR_INPUT</span>
                    </div>
                )}
            </div>
            <div className="h-auto min-h-[30%] p-3 bg-white flex flex-col justify-start relative">
                <div className="text-[12px] font-bold text-zinc-900 leading-tight uppercase tracking-tight line-clamp-2">
                    {item.name}
                </div>
                <div className="w-full flex items-center gap-1 mt-2 opacity-40">
                    <div className="w-1 h-1 bg-red-600 rounded-full"></div>
                    <div className="h-[1px] bg-red-600 flex-1"></div>
                </div>
            </div>
        </div>
    );
};
