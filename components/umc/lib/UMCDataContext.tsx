import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ProcessedItem } from '../types';
import { DB_IDS } from './config';
import { getNotionText, getNotionImage } from './notionUtils';

interface UMCDataContextType {
    genData: { [key: string]: ProcessedItem[] };
    connectionStatus: 'CONNECTED' | 'SYNCING' | 'ERROR';
    fetchGenData: () => Promise<void>;
    language: 'en' | 'ko';
    setLanguage: React.Dispatch<React.SetStateAction<'en' | 'ko'>>;
}

const UMCDataContext = createContext<UMCDataContextType | undefined>(undefined);

const PRELOADED_ASSETS: Record<string, { url: string | null, name: string, nameEn?: string, description?: string, descriptionEn?: string }> = {
    'gen5-0': { name: 'About Me', nameEn: 'About Me', description: '다양한 나, 다양한 관계의 시작', descriptionEn: 'Various me, the beginning of various relations', url: null },
    'gen5-13': { name: '이뷰 (LIVIEW)', nameEn: 'LIVIEW', description: '지도를 통해 한 눈에 보는 내 사진기록', descriptionEn: 'My photo records at a glance through the map', url: '/08ba2f39-3df3-42a1-a749-ead845c0e98b.png' },
    'gen8-0': { name: '밥ZIP - 실시간 캠퍼스 맛집 정보 서비스', nameEn: 'BabZIP - Real-time campus restaurant info service', description: '실시간 캠퍼스 맛집 정보 서비스', descriptionEn: 'Real-time campus restaurant information service', url: null },
    'gen8-1': { name: 'PEER : RE - 건강한 협업을 위한 신뢰형 동료평가 서비스', nameEn: 'PEER : RE - Trust-based peer review service', description: '건강한 협업을 위한 신뢰형 동료평가 서비스', descriptionEn: 'Trust-based peer review service for healthy collaboration', url: null },
    'gen8-2': { name: '고면친구 - 세상의 모든 고민이 거쳐가는 공간', nameEn: 'Gomyeon-Chingu - A space for all worries', description: '세상의 모든 고민이 거쳐가는 공간', descriptionEn: 'A space where all the worlds worries pass through', url: null },
    'gen8-3': { name: '하고싶다 | 나만의 경험을 가꾸는 일정 관리 서비스', nameEn: 'Hagosipta | Personal experience scheduler', description: '나만의 경험을 가꾸는 일정 관리 서비스', descriptionEn: 'Schedule management service that cultivates my own experience', url: null },
    'gen8-4': { name: 'Map To Zero - 제로웨이스트 샵 조회 플랫폼', nameEn: 'Map To Zero - Zero-waste shop platform', description: '제로웨이스트 샵 조회 플랫폼', descriptionEn: 'Zero-waste shop lookup platform', url: null },
    'gen8-5': { name: '동네힙 - 헬스 케어 플랫폼', nameEn: 'Dongnae-Hip - Health care platform', description: '헬스 케어 플랫폼', descriptionEn: 'Health care platform', url: null },
    'gen8-6': { name: 'MEME (메메) : 나만의 메이크업 메이트', nameEn: 'MEME : Your own makeup mate', description: '나만의 메이크업 메이트', descriptionEn: 'Your own makeup mate', url: null },
    'gen8-13': { name: '미뷰', nameEn: 'MIVIEW', description: '맛집 고민 끝! 정답은 미뷰', descriptionEn: 'No more restaurant worries! The answer is MIVIEW', url: '/gen8-sec01.png' },
};

const createPlaceholders = (count: number, gen: string) => Array.from({ length: count }).map((_, i) => {
    const preloadKey = `${gen}-${i}`;
    const preload = PRELOADED_ASSETS[preloadKey];
    return {
        id: `placeholder-${gen}-${i}`,
        name: preload ? preload.name : "INITIALIZING...",
        nameEn: preload?.nameEn || "INITIALIZING...",
        description: preload?.description || "WAITING_FOR_DATA...",
        descriptionEn: preload?.descriptionEn || "WAITING_FOR_DATA...",
        genId: `GEN_${gen.toUpperCase()}_${i}`,
        code: "PENDING",
        imageUrl: preload ? preload.url : null,
        figmaUrl: null,
        raw: {},
        isSkeleton: true,
        isPreloaded: !!preload
    };
});

export const UMCDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [genData, setGenData] = useState<{ [key: string]: ProcessedItem[] }>(() => ({
        gen5: createPlaceholders(65, 'gen5'),
        gen6: createPlaceholders(65, 'gen6'),
        gen7: createPlaceholders(65, 'gen7'),
        gen8: createPlaceholders(65, 'gen8'),
    }));
    const [connectionStatus, setConnectionStatus] = useState<'CONNECTED' | 'SYNCING' | 'ERROR'>('CONNECTED');
    const [language, setLanguage] = useState<'en' | 'ko'>('ko'); // Default to 'ko' as it's the "loaded state"

    const processNotionItems = useCallback((rawData: any[], generationPrefix: string): ProcessedItem[] => {
        if (!Array.isArray(rawData)) return [];
        return rawData.map((item, i) => {
            if (item.isSkeleton) return item;
            let name = "UNTITLED";
            let description = null;
            let teamId = String(i + 1).padStart(2, '0');
            let imageUrl = null;
            let figmaUrl = null;
            let nameEn: string | null = null;
            let descriptionEn: string | null = null;

            if (item.properties) {
                const nameProp = Object.values(item.properties).find((p: any) => p.type === 'title');
                if (nameProp) name = getNotionText(nameProp);

                // English Field Extraction
                const nameEnProp = Object.entries(item.properties).find(([k, v]: any) => {
                    const key = k.toLowerCase();
                    return (key.includes('name') || key.includes('title') || key.includes('제목') || key.includes('이름')) && 
                           (key.includes('en') || key.includes('english') || key.includes('영어') || key.includes('영문'));
                });
                if (nameEnProp) nameEn = getNotionText(nameEnProp[1]);

                const descEntry = Object.entries(item.properties).find(([k, v]: any) => {
                    const key = k.toLowerCase();
                    return v.type === 'rich_text' && (key.includes('description') || key.includes('intro') || key.includes('설명') || key.includes('소개'));
                });
                if (descEntry) description = getNotionText(descEntry[1]);

                const descEnEntry = Object.entries(item.properties).find(([k, v]: any) => {
                    const key = k.toLowerCase();
                    return v.type === 'rich_text' && 
                           (key.includes('description') || key.includes('intro') || key.includes('설명') || key.includes('소개')) &&
                           (key.includes('en') || key.includes('english') || key.includes('영어') || key.includes('영문'));
                });
                if (descEnEntry) descriptionEn = getNotionText(descEnEntry[1]);

                if (item.cover) {
                    if (item.cover.type === 'external') imageUrl = item.cover.external.url;
                    else if (item.cover.type === 'file') imageUrl = item.cover.file.url;
                }

                if (!imageUrl) {
                    const anyFile = Object.entries(item.properties).find(([k, v]: any) => v.type === 'files' && v.files.length > 0);
                    if (anyFile) imageUrl = getNotionImage(anyFile[1]);
                }

                for (const [key, val] of Object.entries(item.properties)) {
                    const v = val as any;
                    if (v.type === 'url' && v.url && v.url.includes('figma.com')) {
                        figmaUrl = v.url;
                        break;
                    }
                    if (v.type === 'rich_text' && v.rich_text?.length > 0) {
                        const text = getNotionText(v);
                        if (text.includes('figma.com') || text.trim().startsWith('<iframe')) {
                            figmaUrl = text;
                            break;
                        }
                    }
                }
            }

            return {
                id: item.id,
                name,
                nameEn: nameEn || undefined,
                description: description || "No description available.",
                descriptionEn: descriptionEn || undefined,
                genId: `UMC_${generationPrefix}_gen_${teamId}`,
                code: `TM-${teamId}`,
                imageUrl,
                figmaUrl,
                raw: item,
                isSkeleton: false
            };
        });
    }, []);

    const fetchGenData = useCallback(async () => {
        setConnectionStatus('SYNCING');
        try {
            // Process each generation independently.
            // We prioritize newer generations (gen8, gen7...) as they are often more relevant.
            const genKeys = ['gen8', 'gen7', 'gen6', 'gen5'];

            await Promise.all(genKeys.map(async (genKey) => {
                try {
                    const dbId = (DB_IDS as any)[genKey];
                    const response = await fetch(`/api/notion?action=query&id=${dbId}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ page_size: 100 })
                    });

                    if (response.ok) {
                        const data = await response.json();
                        const results = data.results || [];

                        // 1. Immediate UI update with DB items
                        const placeholders = createPlaceholders(65, genKey);
                        const itemsToPreload: { item: any, index: number }[] = [];

                        // Calculate pile covers (indices 0, 13, 26, 39, 52) based on 65 items / 5 piles
                        const pileCoverIndices = [0, 13, 26, 39, 52];

                        results.forEach((item: any, idx: number) => {
                            if (idx < placeholders.length) {
                                placeholders[idx] = item;
                                // Prioritize pile covers AND first 8 items
                                if (!item.cover && (pileCoverIndices.includes(idx) || idx < 8)) {
                                    itemsToPreload.push({ item, index: idx });
                                }
                            }
                        });

                        const processedItems = processNotionItems(placeholders, genKey.toUpperCase());

                        setGenData(prev => ({
                            ...prev,
                            [genKey]: processedItems
                        }));

                        // 2. Immediate Block Pre-fetching for this generation (Don't wait for other gens)
                        if (itemsToPreload.length > 0) {
                            // Sort to ensure pile covers are fetched FIRST
                            itemsToPreload.sort((a, b) => {
                                const aIsCover = pileCoverIndices.includes(a.index);
                                const bIsCover = pileCoverIndices.includes(b.index);
                                if (aIsCover && !bIsCover) return -1;
                                if (!aIsCover && bIsCover) return 1;
                                return a.index - b.index;
                            });

                            // Non-blocking parallel pre-fetch for this generation's critical items
                            itemsToPreload.map(async ({ item, index }) => {
                                try {
                                    const blockResponse = await fetch(`/api/notion?action=blocks&id=${item.id}`);
                                    if (blockResponse.ok) {
                                        const blockData = await blockResponse.json();
                                        const imgBlock = blockData.results?.find((b: any) => b.type === 'image');
                                        if (imgBlock) {
                                            const url = imgBlock.image.type === 'file' ? imgBlock.image.file.url : imgBlock.image.external.url;
                                            setGenData(prev => {
                                                const updated = { ...prev };
                                                const genList = [...updated[genKey]];
                                                if (genList[index]) {
                                                    genList[index] = {
                                                        ...genList[index],
                                                        imageUrl: url
                                                    };
                                                }
                                                updated[genKey] = genList;
                                                return updated;
                                            });
                                        }
                                    }
                                } catch (e) {
                                    console.error(`Failed to preload blocks for ${item.id}`, e);
                                }
                            });
                        }
                    }
                } catch (err) {
                    console.error(`Error fetching sequence for ${genKey}:`, err);
                }
            }));

            setConnectionStatus('CONNECTED');
            console.log("UMC Data Streaming & Pre-loading sequence initiated");
        } catch (err) {
            console.error("UMC Global Data fetch error:", err);
            setConnectionStatus('ERROR');
        }
    }, [processNotionItems]); // Removed genData from deps to prevent infinite loop or unnecessary re-runs

    useEffect(() => {
        fetchGenData();
    }, []);

    return (
        <UMCDataContext.Provider value={{ genData, connectionStatus, fetchGenData, language, setLanguage }}>
            {children}
        </UMCDataContext.Provider>
    );
};

export const useUMCData = () => {
    const context = useContext(UMCDataContext);
    if (context === undefined) {
        throw new Error('useUMCData must be used within a UMCDataProvider');
    }
    return context;
};
