export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'CRITICAL';
  message: string;
  code: string;
}

export interface SystemMetric {
  name: string;
  value: number;
  max: number;
  unit: string;
}

export enum PanelState {
  IDLE = 'IDLE',
  ACTIVE = 'ACTIVE',
  ERROR = 'ERROR'
}

// Interface for processed Notion Item
export interface ProcessedItem {
  id: string;
  name: string;        // Actual Project Name
  description: string; // Project Description (Property fallback)
  genId: string;       // UMC_5th_gen_{{TeamID}}
  code: string;
  imageUrl: string | null;
  figmaUrl: string | null; // New: Figma URL
  imageDebugReason?: string;
  descriptionDebugReason?: string;
  raw: any;
  isSkeleton?: boolean; // New: For dummy loading state
  isPreloaded?: boolean; // New: Flag for preloaded items
}

export interface NodeItem {
  id: string;
  x: number;
  y: number;
  items: ProcessedItem[]; 
  layerCount: number;
  title: string;
  code: string;
  variant: 'default' | 'error' | 'warning';
  isSkeleton?: boolean;
}

export interface GenerationLabel {
  text: string;
  subText: string;
  x: number;
  y: number;
  width: number;
  height: number;
}
