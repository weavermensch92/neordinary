export const NOTION_API_KEY = (import.meta as any).env?.VITE_NOTION_API_KEY || '';

export const DB_IDS: Record<string, string> = {
  gen5: 'ebc26d90cfd54da19c2a0b8d76d1bca4',
  gen6: '687d70f656034060927102d6c01c8375',
  gen7: 'f39da0eaafa644e486d2cf0fb9f0b6fc',
  gen8: '246b57f4596b8049980acb7c40dc92b6'
};

export const WORLD_WIDTH = 4000;
export const WORLD_HEIGHT = 4000;
