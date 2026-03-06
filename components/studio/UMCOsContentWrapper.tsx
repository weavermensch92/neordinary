import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CustomCursor } from './CustomCursor';
import { Navigation } from './Navigation';
import { LoadingSequence } from './LoadingSequence';

// UMC OS Components (imported from the newly copied files)
import GridBackground from '../umc/GridBackground';
import WindowPile from '../umc/WindowPile';
import Minimap from '../umc/Minimap';
import GalleryView from '../umc/GalleryView';
import PileGrid from '../umc/PileGrid';
import { Database, Server, Loader2, AlertTriangle, FileText, Figma, RefreshCw, Zap } from 'lucide-react';
import { ProcessedItem, NodeItem, GenerationLabel } from '../umc/types';
import { DB_IDS, WORLD_WIDTH as DEFAULT_WORLD_WIDTH, WORLD_HEIGHT as DEFAULT_WORLD_HEIGHT } from '../umc/lib/config';
import { getNotionText, getNotionImage } from '../umc/lib/notionUtils';
import { NotionCardComponent } from '../umc/NotionCard';
import { Chatbot } from '../umc/Chatbot';
import { useUMCData } from '../umc/lib/UMCDataContext';

interface UMCOsContentWrapperProps {
    onClose: () => void;
    onMinimize?: () => void;
}

const PRELOADED_ASSETS: Record<string, { url: string | null, name: string, description?: string, forceImage?: boolean }> = {
    'gen5-0': { name: 'About Me', description: '다양한 나, 다양한 관계의 시작', url: null, forceImage: true },
    'gen5-13': { name: '이뷰 (LIVIEW)', description: '지도를 통해 한 눈에 보는 내 사진기록', url: '/08ba2f39-3df3-42a1-a749-ead845c0e98b.png', forceImage: true },
    'gen8-0': { name: '미뷰', description: '맛집 고민 끝! 정답은 미뷰', url: '/gen8-sec01.png', forceImage: true },
};

const createPlaceholders = (count: number, gen: string) => Array.from({ length: count }).map((_, i) => {
    const preloadKey = `${gen}-${i}`;
    const preload = PRELOADED_ASSETS[preloadKey];
    return {
        id: `placeholder-${gen}-${i}`,
        name: preload ? preload.name : "INITIALIZING...",
        description: preload?.description || "WAITING_FOR_DATA...",
        genId: `GEN_${gen}_${i}`,
        code: "PENDING",
        imageUrl: preload ? preload.url : null,
        figmaUrl: null,
        raw: {},
        isSkeleton: true,
        isPreloaded: !!preload
    };
});

const ZoneMarker: React.FC<{ x: number; y: number; label: string; subLabel: string; zoom: number; width?: number; height?: number; }> = ({ x, y, label, subLabel, zoom, width = 1500, height = 1500 }) => {
    const borderWidth = 2.5 / zoom;
    const fontSize = 1 / zoom;
    return (
        <div className="absolute pointer-events-none z-[5]" style={{ left: x, top: y, width: width, height: height, transform: 'translate(-50%, -50%)' }}>
            <div className="absolute inset-0 border-zinc-700 opacity-40" style={{ borderWidth: borderWidth }} />
            <div className="absolute -top-8 left-0 flex items-baseline gap-4" style={{ transform: `translateY(-100%)`, transformOrigin: 'bottom left' }}>
                <h2 className="font-bold text-zinc-700 leading-none" style={{ fontSize: `${48 * fontSize}px` }}>{label}</h2>
                <span className="font-mono text-zinc-500 tracking-widest font-bold" style={{ fontSize: `${16 * fontSize}px` }}>{subLabel}</span>
            </div>
        </div>
    );
};

const NotionBlockRenderer: React.FC<{ blocks: any[] }> = ({ blocks }) => {
    if (!blocks || blocks.length === 0) return <div className="text-zinc-400 text-xs font-mono">NO_CONTENT_BLOCKS_FOUND</div>;
    return (
        <div className="space-y-4">
            {blocks.map((block) => {
                const { type, id } = block;
                const value = block[type];
                const renderRichText = (textObj: any) => {
                    if (!textObj) return null;
                    return textObj.map((t: any, i: number) => {
                        const style = {
                            fontWeight: t.annotations?.bold ? 'bold' : 'normal',
                            fontStyle: t.annotations?.italic ? 'italic' : 'normal',
                            textDecoration: t.annotations?.strikethrough ? 'line-through' : (t.annotations?.underline ? 'underline' : 'none'),
                            color: t.annotations?.color && t.annotations.color !== 'default' ? t.annotations.color : 'inherit',
                        };
                        return <span key={i} style={style}>{t.plain_text}</span>;
                    });
                };
                switch (type) {
                    case 'paragraph': return <p key={id} className="text-sm md:text-base leading-relaxed text-zinc-700 mb-2">{renderRichText(value.rich_text)}</p>;
                    case 'heading_1': return <h3 key={id} className="text-2xl font-bold text-zinc-900 mt-6 mb-3 uppercase tracking-tight">{renderRichText(value.rich_text)}</h3>;
                    case 'heading_2': return <h4 key={id} className="text-xl font-bold text-zinc-800 mt-5 mb-2 border-l-4 border-blue-600 pl-3">{renderRichText(value.rich_text)}</h4>;
                    case 'heading_3': return <h5 key={id} className="text-lg font-bold text-zinc-800 mt-4 mb-2">{renderRichText(value.rich_text)}</h5>;
                    case 'bulleted_list_item': return <li key={id} className="ml-4 list-disc text-zinc-700 pl-1 mb-1">{renderRichText(value.rich_text)}</li>;
                    case 'numbered_list_item': return <li key={id} className="ml-4 list-decimal text-zinc-700 pl-1 mb-1">{renderRichText(value.rich_text)}</li>;
                    case 'quote': return <blockquote key={id} className="border-l-4 border-zinc-400 pl-4 py-2 italic text-zinc-600 bg-zinc-100/50 my-4">{renderRichText(value.rich_text)}</blockquote>;
                    case 'image':
                        const imgUrl = value.type === 'external' ? value.external.url : value.file.url;
                        if (!imgUrl) return null;
                        const caption = value.caption?.map((c: any) => c.plain_text).join('');
                        return (
                            <div key={id} className="my-6">
                                <img
                                    src={imgUrl}
                                    alt={caption || "Notion Image"}
                                    referrerPolicy="no-referrer"
                                    className="w-full rounded-sm border border-zinc-300 shadow-sm bg-zinc-100 min-h-[100px] object-contain"
                                />
                                {caption && <div className="text-[10px] text-zinc-500 mt-1 font-mono text-center">{caption}</div>}
                            </div>
                        );
                    default: return null;
                }
            })}
        </div>
    );
};

export const UMCOsContentWrapper: React.FC<UMCOsContentWrapperProps> = ({ onClose, onMinimize }) => {
    // Basic structural states
    const [loadingComplete, setLoadingComplete] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isExiting, setIsExiting] = useState(false);
    const hasCalledClose = useRef(false);

    // UMC OS Logic States
    const { genData, connectionStatus } = useUMCData();
    const [camera, setCamera] = useState({ x: 0, y: 181 });
    const [zoom, setZoom] = useState(0.52);
    const [isDragging, setIsDragging] = useState(false);
    const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
    const [viewport, setViewport] = useState({ width: window.innerWidth, height: window.innerHeight });
    const [expandedNodeId, setExpandedNodeId] = useState<string | null>(null);
    const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);
    const [activeModalTab, setActiveModalTab] = useState<'DOC' | 'DESIGN'>('DOC');
    const [pageContent, setPageContent] = useState<any[] | null>(null);
    const [isContentLoading, setIsContentLoading] = useState(false);
    const [contentError, setContentError] = useState<string | null>(null);

    const layoutConfig = {
        gen5: { nodeX: 700, nodeY: 800, labelX: 900, labelY: 1000, width: 1600, height: 1500 },
        gen6: { nodeX: 2400, nodeY: 800, labelX: 2600, labelY: 1000, width: 1600, height: 1500 },
        gen7: { nodeX: 1325, nodeY: 2700, labelX: 1525, labelY: 2880, width: 1600, height: 1500 },
        gen8: { nodeX: 3025, nodeY: 2700, labelX: 3225, labelY: 2880, width: 1600, height: 1500 },
    };

    const handleSequenceComplete = () => setLoadingComplete(true);

    const handleClose = () => {
        if (hasCalledClose.current) return;
        hasCalledClose.current = true;
        setIsExiting(true);
        setTimeout(() => onClose(), 800);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (expandedNodeId) return;
        setIsDragging(true);
        setLastMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging && !expandedNodeId) {
            const deltaX = e.clientX - lastMousePos.x;
            const deltaY = e.clientY - lastMousePos.y;
            setCamera(prev => ({ x: prev.x + deltaX, y: prev.y + deltaY }));
            setLastMousePos({ x: e.clientX, y: e.clientY });
        }
    };

    const handleMouseUp = () => setIsDragging(false);

    // Camera Navigation helper
    const handleNavigate = (worldX: number, worldY: number) => {
        const targetX = (viewport.width / 2) - (worldX * zoom);
        const targetY = (viewport.height / 2) - (worldY * zoom);
        setCamera({ x: targetX, y: targetY });
    };

    const { nodes, labels } = useMemo(() => {
        const allNodes: NodeItem[] = [];
        const genLabels: GenerationLabel[] = [];

        const processGen = (gen: string, config: any) => {
            const items = genData[gen] || [];
            const radius = 480;
            const totalPanels = 5;
            const chunkSize = Math.ceil(items.length / totalPanels);

            for (let i = 0; i < totalPanels; i++) {
                const angle = (i * (Math.PI * 2) / totalPanels) - (Math.PI / 2) + 0.2;
                allNodes.push({
                    id: `${gen}-pile-${i}`,
                    x: config.nodeX + Math.cos(angle) * radius,
                    y: config.nodeY + Math.sin(angle) * radius,
                    items: items.slice(i * chunkSize, (i + 1) * chunkSize),
                    layerCount: chunkSize,
                    title: `GEN_${gen.toUpperCase()}`,
                    code: `TM-${(i + 1).toString().padStart(2, '0')}`,
                    variant: 'default',
                    isSkeleton: items[0]?.isSkeleton
                });
            }
            genLabels.push({ text: `${gen.toUpperCase()}TH`, subText: "GENERATION", x: config.labelX, y: config.labelY, width: config.width, height: config.height });
        };

        ['gen5', 'gen6', 'gen7', 'gen8'].forEach(gen => processGen(gen, (layoutConfig as any)[gen]));
        return { nodes: allNodes, labels: genLabels };
    }, [genData]);

    const activeNode = nodes.find(n => n.id === expandedNodeId);


    // Fetch blocks when a card is selected
    useEffect(() => {
        if (selectedCardIndex !== null && activeNode) {
            const item = activeNode.items[selectedCardIndex];
            if (!item || item.isSkeleton) return;

            const fetchBlocks = async () => {
                setIsContentLoading(true);
                setContentError(null);
                setPageContent(null);

                try {
                    const response = await fetch(`/api/notion/blocks/${item.id}`);
                    if (!response.ok) throw new Error("Failed to fetch blocks");
                    const data = await response.json();
                    setPageContent(data.results || []);
                } catch (err: any) {
                    setContentError(err.message);
                } finally {
                    setIsContentLoading(false);
                }
            };
            fetchBlocks();

            // Set default tab
            if (item.figmaUrl) setActiveModalTab('DESIGN');
            else setActiveModalTab('DOC');
        }
    }, [selectedCardIndex, expandedNodeId]);

    // Global scroll lock
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
            document.documentElement.style.overflow = 'auto';
        };
    }, []);

    return (
        <motion.div
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-end justify-center pb-0 md:pb-12 px-4 md:px-12 pointer-events-auto"
            initial={{ opacity: 0 }}
            animate={isExiting ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.5 }}
            onClick={handleClose}
        >
            <motion.div
                ref={containerRef}
                className="relative w-full max-w-[2000px] h-[95vh] md:h-[90vh] bg-[#F8F8F8] border-[8px] md:border-[16px] border-black shadow-[0_0_0_4px_rgba(255,255,255,0.1),20px_20px_0_0_rgba(59,130,246,1)] overflow-hidden flex flex-col rounded-t-3xl md:rounded-none"
                initial={{ y: "100%" }}
                animate={isExiting ? { y: "100%" } : { y: "0%" }}
                transition={{ type: 'spring', damping: 30, stiffness: 200 }}
                style={{ cursor: isDragging ? 'grabbing' : 'auto' }}
                onClick={(e) => e.stopPropagation()}
            >
                <CustomCursor />

                <Navigation
                    show={loadingComplete && !isExiting}
                    containerRef={containerRef}
                    onClose={handleClose}
                    onMinimize={onMinimize}
                />

                <div className="relative w-full h-full overflow-hidden">
                    {!loadingComplete && (
                        <LoadingSequence onComplete={handleSequenceComplete} />
                    )}

                    {loadingComplete && (
                        <div
                            className="w-full h-full relative"
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                        >
                            <GridBackground offsetX={camera.x} offsetY={camera.y} />

                            <div
                                className="absolute top-0 left-0 w-full h-full transition-transform duration-100 ease-out"
                                style={{ transform: `translate3d(${camera.x}px, ${camera.y}px, 0) scale(${zoom})` }}
                            >
                                {labels.map((label, i) => (
                                    <ZoneMarker key={i} x={label.x} y={label.y} label={label.text} subLabel={label.subText} zoom={zoom} />
                                ))}

                                {nodes.map((node) => (
                                    <div key={node.id} className="absolute" style={{ left: node.x, top: node.y }}>
                                        <WindowPile
                                            title={node.title}
                                            code={node.code}
                                            variant={node.variant}
                                            layerCount={node.layerCount}
                                            onToggle={() => setExpandedNodeId(node.id)}
                                        >
                                            {node.items.length > 0 ? (
                                                <NotionCardComponent item={node.items[0]} isGrid={false} loadImage={true} />
                                            ) : (
                                                <div className="p-4 text-xs font-mono opacity-20">NO_DATA</div>
                                            )}
                                        </WindowPile>
                                    </div>
                                ))}
                            </div>

                            {expandedNodeId && activeNode && (
                                <PileGrid
                                    node={activeNode}
                                    onClose={() => setExpandedNodeId(null)}
                                    onSelectCard={(idx) => setSelectedCardIndex(idx)}
                                    selectedIndex={selectedCardIndex}
                                />
                            )}

                            {selectedCardIndex !== null && activeNode && activeNode.items[selectedCardIndex] && (
                                <GalleryView
                                    nodeId="gallery"
                                    title={activeNode.items[selectedCardIndex].name}
                                    code={activeNode.items[selectedCardIndex].code}
                                    onClose={() => setSelectedCardIndex(null)}
                                >
                                    <div className="w-full h-full flex flex-col bg-zinc-50 relative">
                                        <div className="flex-1 p-8 md:p-12 overflow-y-auto custom-scrollbar relative z-10">
                                            <h1 className="text-4xl md:text-5xl font-black text-zinc-900 tracking-tighter uppercase mb-2">
                                                {activeNode.items[selectedCardIndex].name}
                                            </h1>

                                            {activeNode.items[selectedCardIndex].figmaUrl && (
                                                <div className="flex gap-1 mb-8 border-b border-zinc-300">
                                                    <button
                                                        onClick={() => setActiveModalTab('DOC')}
                                                        className={`px-4 py-2 text-xs font-bold font-mono tracking-widest transition-colors flex items-center gap-2 ${activeModalTab === 'DOC' ? 'bg-zinc-800 text-white' : 'bg-zinc-200 text-zinc-500 hover:bg-zinc-300'}`}
                                                    >
                                                        <FileText size={12} /> DOCUMENTATION
                                                    </button>
                                                    <button
                                                        onClick={() => setActiveModalTab('DESIGN')}
                                                        className={`px-4 py-2 text-xs font-bold font-mono tracking-widest transition-colors flex items-center gap-2 ${activeModalTab === 'DESIGN' ? 'bg-blue-600 text-white' : 'bg-zinc-200 text-zinc-500 hover:bg-zinc-300'}`}
                                                    >
                                                        <Figma size={12} /> BLUEPRINT_VIEWER
                                                    </button>
                                                </div>
                                            )}

                                            {!activeNode.items[selectedCardIndex].figmaUrl && <div className="w-full h-1 bg-zinc-200 mb-8 mt-4"></div>}

                                            {activeModalTab === 'DOC' ? (
                                                <div className="prose max-w-4xl text-zinc-700 font-mono text-sm md:text-base leading-relaxed whitespace-pre-wrap animate-in fade-in slide-in-from-bottom-2 duration-300">
                                                    {isContentLoading ? (
                                                        <div className="flex items-center gap-2 text-zinc-400 py-10">
                                                            <Loader2 className="animate-spin text-blue-600" size={24} />
                                                            <span className="animate-pulse tracking-widest">DECRYPTING_DATA...</span>
                                                        </div>
                                                    ) : contentError ? (
                                                        <div className="border border-red-200 bg-red-50 p-4 text-red-900 text-xs font-mono">
                                                            <AlertTriangle size={14} className="inline mr-2" /> CONNECTION_INTERRUPTED: {contentError}
                                                        </div>
                                                    ) : pageContent ? (
                                                        <NotionBlockRenderer blocks={pageContent} />
                                                    ) : (
                                                        <div className="opacity-50 text-xs">NO_SIGNAL</div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="w-full h-[60vh] md:h-[75vh] bg-zinc-100 border border-zinc-300 relative animate-in zoom-in-95 duration-300 flex flex-col">
                                                    <div className="bg-black text-white px-3 py-1 text-[10px] font-mono flex justify-between items-center">
                                                        <span>FIGMA_EMBED_PROTOCOL // SECURE_LINK</span>
                                                        <span className="opacity-50">READ_ONLY</span>
                                                    </div>
                                                    {activeNode.items[selectedCardIndex].figmaUrl?.trim().startsWith('<') ? (
                                                        <div
                                                            className="w-full h-full flex items-center justify-center bg-zinc-900 [&_iframe]:w-full [&_iframe]:h-full [&_iframe]:border-0"
                                                            dangerouslySetInnerHTML={{ __html: activeNode.items[selectedCardIndex].figmaUrl || '' }}
                                                        />
                                                    ) : (
                                                        <iframe
                                                            className="w-full h-full"
                                                            src={`https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(activeNode.items[selectedCardIndex].figmaUrl || '')}`}
                                                            allowFullScreen
                                                            loading="lazy"
                                                        />
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        <div className="px-8 py-4 border-t border-zinc-300 bg-zinc-100 flex justify-between items-center text-[10px] font-mono text-zinc-500 uppercase relative z-20">
                                            <div className="flex gap-4">
                                                <span>ID: {activeNode.items[selectedCardIndex].genId}</span>
                                                <span>REF: {activeNode.items[selectedCardIndex].code}</span>
                                                <a
                                                    href={`https://notion.so/${activeNode.items[selectedCardIndex].id.replace(/-/g, '')}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-500 hover:underline flex items-center gap-1"
                                                >
                                                    <Server size={10} /> VIEW_ORIGINAL_NODE
                                                </a>
                                            </div>
                                            <div className="flex items-center gap-2 text-blue-600">
                                                <Zap size={10} /> {connectionStatus}
                                            </div>
                                        </div>
                                    </div>
                                </GalleryView>
                            )}

                            <Minimap
                                worldWidth={DEFAULT_WORLD_WIDTH}
                                worldHeight={DEFAULT_WORLD_HEIGHT}
                                cameraX={camera.x / zoom} cameraY={camera.y / zoom}
                                viewportWidth={viewport.width / zoom} viewportHeight={viewport.height / zoom}
                                items={nodes} labels={labels}
                                onNavigate={handleNavigate}
                            />
                            <Chatbot
                                projects={nodes.flatMap(n => n.items.map(it => ({ id: it.id, name: it.name, description: it.description, gen: it.genId })))}
                                onNavigate={(projectId) => {
                                    const allItems = nodes.flatMap(n => n.items);
                                    const targetItem = allItems.find(it => it.id === projectId);
                                    if (targetItem) {
                                        // Find which node contains this item
                                        const targetNode = nodes.find(n => n.items.some(it => it.id === projectId));
                                        if (targetNode) {
                                            handleNavigate(targetNode.x, targetNode.y);
                                            // Optionally open the node or select the card
                                            setExpandedNodeId(targetNode.id);
                                            const idx = targetNode.items.findIndex(it => it.id === projectId);
                                            if (idx !== -1) setSelectedCardIndex(idx);
                                        }
                                    }
                                }}
                            />
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};
