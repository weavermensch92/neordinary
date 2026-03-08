
export interface SystemLog {
  id: string;
  type: 'PROJECT' | 'SEPARATOR'; // New field to distinguish item types
  timestamp: string;
  module: string; // Used for Project Name
  status: string; // Used for Keyword/Category or Award text
  efficiency: number; // Used for Cohort number (e.g. 17)
  message: string; // Service Description
  coordinates: { x: number; y: number; z: number };
  // New fields
  imageMain?: string;
  imageAward?: string;
  linkIOS?: string;
  linkAndroid?: string;
  cohort?: string; // e.g. "17기"
  keywords?: string; // Major Keywords & Field
}

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}
