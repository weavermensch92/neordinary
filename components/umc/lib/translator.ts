import { GoogleGenAI, Type } from "@google/genai";
import { ProcessedItem } from "../types";

let aiInstance: GoogleGenAI | null = null;

const getAi = () => {
    if (aiInstance) return aiInstance;
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return null;
    }
    aiInstance = new GoogleGenAI({ apiKey });
    return aiInstance;
};

const genDataCache = new Map<string, ProcessedItem>();
const blockCache = new Map<string, string>();

export const translateGenData = async (items: ProcessedItem[]): Promise<ProcessedItem[]> => {
    const itemsToTranslate = items.filter(item => !item.isSkeleton && item.name !== "INITIALIZING...");
    if (itemsToTranslate.length === 0) return items;

    const payload: any[] = [];
    const resultItems = [...items];

    // Check cache first
    for (const item of itemsToTranslate) {
        if (genDataCache.has(item.id)) {
            const cached = genDataCache.get(item.id)!;
            const index = resultItems.findIndex(i => i.id === item.id);
            if (index !== -1) {
                resultItems[index] = { ...item, name: cached.name, description: cached.description };
            }
        } else {
            payload.push({
                id: item.id,
                name: item.name,
                description: item.description
            });
        }
    }

    if (payload.length === 0) return resultItems;

    const ai = getAi();
    if (!ai) return resultItems;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `Translate the following array of objects from Korean to English. Keep the 'id' exactly the same. Return a JSON array of objects with 'id', 'name', and 'description' properties.\n\n${JSON.stringify(payload)}`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            id: { type: Type.STRING },
                            name: { type: Type.STRING },
                            description: { type: Type.STRING }
                        },
                        required: ["id", "name", "description"]
                    }
                }
            }
        });

        const translatedText = response.text;
        if (!translatedText) return resultItems;

        const translatedArray = JSON.parse(translatedText);

        for (const t of translatedArray) {
            const index = resultItems.findIndex(i => i.id === t.id);
            if (index !== -1) {
                const translatedItem = { ...resultItems[index], name: t.name, description: t.description };
                resultItems[index] = translatedItem;
                genDataCache.set(t.id, translatedItem);
            }
        }

        return resultItems;
    } catch (e) {
        console.error("Translation error:", e);
        return resultItems;
    }
};

export const translateBlocks = async (blocks: any[]): Promise<any[]> => {
    if (!blocks || blocks.length === 0) return blocks;

    const textBlocks: { id: string, text: string }[] = [];
    const resultBlocks = [...blocks];

    blocks.forEach((block, index) => {
        const type = block.type;
        const value = block[type];
        if (value && value.rich_text) {
            const text = value.rich_text.map((t: any) => t.plain_text).join('');
            if (text.trim()) {
                if (blockCache.has(block.id)) {
                    const translated = blockCache.get(block.id)!;
                    resultBlocks[index] = {
                        ...block,
                        [type]: {
                            ...value,
                            rich_text: [{
                                type: 'text',
                                text: { content: translated, link: null },
                                annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: 'default' },
                                plain_text: translated,
                                href: null
                            }]
                        }
                    };
                } else {
                    textBlocks.push({ id: block.id, text });
                }
            }
        }
    });

    if (textBlocks.length === 0) return resultBlocks;

    const ai = getAi();
    if (!ai) return resultBlocks;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `Translate the following array of objects from Korean to English. Keep the 'id' exactly the same. Return a JSON array of objects with 'id' and 'text' properties.\n\n${JSON.stringify(textBlocks)}`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            id: { type: Type.STRING },
                            text: { type: Type.STRING }
                        },
                        required: ["id", "text"]
                    }
                }
            }
        });

        const translatedText = response.text;
        if (!translatedText) return resultBlocks;

        const translatedArray = JSON.parse(translatedText);
        const translationMap = new Map(translatedArray.map((t: any) => [t.id, t.text]));

        return resultBlocks.map(block => {
            const type = block.type;
            const value = block[type];
            if (value && value.rich_text) {
                const translated = translationMap.get(block.id);
                if (translated) {
                    blockCache.set(block.id, translated as string);
                    return {
                        ...block,
                        [type]: {
                            ...value,
                            rich_text: [{
                                type: 'text',
                                text: { content: translated, link: null },
                                annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: 'default' },
                                plain_text: translated,
                                href: null
                            }]
                        }
                    };
                }
            }
            return block;
        });
    } catch (e) {
        console.error("Translation error:", e);
        return resultBlocks;
    }
};
