import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ProcessedItem } from '../types';
import { DB_IDS } from './config';
import { getNotionText, getNotionImage } from './notionUtils';

interface UMCDataContextType {
    genData: { [key: string]: ProcessedItem[] };
    connectionStatus: 'CONNECTED' | 'SYNCING' | 'ERROR';
    fetchGenData: () => Promise<void>;
}

const UMCDataContext = createContext<UMCDataContextType | undefined>(undefined);

const PRELOADED_ASSETS: Record<string, { url: string | null, name: string, description?: string }> = {
    'gen5-0': { name: 'About Me', description: '다양한 나, 다양한 관계의 시작', url: null },
    'gen5-13': { name: '이뷰 (LIVIEW)', description: '지도를 통해 한 눈에 보는 내 사진기록', url: '/08ba2f39-3df3-42a1-a749-ead845c0e98b.png' },
    'gen8-0': { name: '미뷰', description: '맛집 고민 끝! 정답은 미뷰', url: '/gen8-sec01.png' },
};

const createPlaceholders = (count: number, gen: string) => Array.from({ length: count }).map((_, i) => {
    const preloadKey = `${gen}-${i}`;
    const preload = PRELOADED_ASSETS[preloadKey];
    return {
        id: `placeholder-${gen}-${i}`,
        name: preload ? preload.name : "INITIALIZING...",
        description: preload?.description || "WAITING_FOR_DATA...",
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

    const processNotionItems = useCallback((rawData: any[], generationPrefix: string): ProcessedItem[] => {
        if (!Array.isArray(rawData)) return [];
        return rawData.map((item, i) => {
            if (item.isSkeleton) return item;
            let name = "UNTITLED";
            let description = null;
            let teamId = String(i + 1).padStart(2, '0');
            let imageUrl = null;
            let figmaUrl = null;

            if (item.properties) {
                const nameProp = Object.values(item.properties).find((p: any) => p.type === 'title');
                if (nameProp) name = getNotionText(nameProp);

                const descEntry = Object.entries(item.properties).find(([k, v]: any) => {
                    const key = k.toLowerCase();
                    return v.type === 'rich_text' && (key.includes('description') || key.includes('intro') || key.includes('설명') || key.includes('소개'));
                });
                if (descEntry) description = getNotionText(descEntry[1]);

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
                description: description || "No description available.",
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
            const results = await Promise.all(['gen5', 'gen6', 'gen7', 'gen8'].map(async (genKey) => {
                const dbId = (DB_IDS as any)[genKey];
                const response = await fetch(`/api/notion/query/${dbId}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ page_size: 100 })
                });
                if (response.ok) {
                    const data = await response.json();
                    return { genKey, results: data.results };
                }
                return { genKey, results: [] };
            }));

            const newData = { ...genData };
            results.forEach(({ genKey, results }) => {
                const placeholders = createPlaceholders(65, genKey);
                results.forEach((item: any, idx: number) => {
                    if (idx < placeholders.length) placeholders[idx] = item;
                });
                newData[genKey] = processNotionItems(placeholders, genKey.toUpperCase());
            });

            setGenData(newData);
            setConnectionStatus('CONNECTED');
            console.log("UMC Data Pre-loaded successfully");
        } catch (err) {
            console.error("UMC Global Data fetch error:", err);
            setConnectionStatus('ERROR');
        }
    }, [genData, processNotionItems]);

    useEffect(() => {
        fetchGenData();
    }, []);

    return (
        <UMCDataContext.Provider value={{ genData, connectionStatus, fetchGenData }}>
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
