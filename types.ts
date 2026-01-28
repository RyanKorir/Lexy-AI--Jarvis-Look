
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  toolsUsed?: string[];
  groundingUrls?: Array<{title: string, uri: string}>;
  audioData?: string;
}

export type ThemeType = 'cyan' | 'crimson' | 'emerald' | 'gold';

export interface LexySettings {
  theme: ThemeType;
  voiceEnabled: boolean;
  avatarSpeed: number;
  coreIntensity: number;
  userName: string;
  memoryNodes: string[]; // Summarized past contexts
}

export interface SystemStatus {
  cpu: number;
  ram: number;
  battery: number;
  uptime: string;
  platform: string;
  connection: string;
}
