
export interface SystemLog {
  id: string;
  type: 'PROJECT' | 'SEPARATOR'; // New field to distinguish item types
  timestamp: string;
  module: string; // Used for Project Name
  moduleEn?: string;
  status: string; // Used for Keyword/Category or Award text
  statusEn?: string;
  efficiency: number; // Used for Cohort number (e.g. 17)
  message: string; // Service Description
  messageEn?: string;
  coordinates: { x: number; y: number; z: number };
  // New fields
  imageMain?: string;
  imageAward?: string;
  linkIOS?: string;
  linkAndroid?: string;
  cohort?: string; // e.g. "17기"
  cohortEn?: string;
  keywords?: string; // Major Keywords & Field
  keywordsEn?: string;
}

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}
