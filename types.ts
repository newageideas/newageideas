
export interface PostOption {
  hook_overlay: string;
  caption: string;
  audio: string;
  hashtags: string[];
  type: 'Viral' | 'Niche';
}

export interface CompetitorData {
  hook: string;
  topic: string;
  recommendation: string;
}

export interface LyraAnalysisResult {
  visuals: {
    aesthetic: string;
    colors: string[];
    objects: string[];
  };
  score: {
    total: number; // 0-100
    isAestheticTrending: boolean;
    isAudioRising: boolean;
    breakdown: string;
  };
  options: {
    viral: PostOption;
    niche: PostOption;
  };
  competitor: CompetitorData;
  warnings?: string[]; // e.g., High Saturation
}

export enum Tab {
  SCAN_SCORE = 'scan_score',
  THE_LAB = 'the_lab',
  COMPETITOR_SPY = 'competitor_spy',
  BRAND_DNA = 'brand_dna',
}

// New types for ViralEngine
export interface BrandSettings {
  id: string;
  name: string;
  connectedAccounts: {
    tiktok: boolean;
    instagram: boolean;
  };
  niche: string;
  personality: string;
  includeLinkInBio: boolean;
}

export interface ContentVariant {
  style: 'Horror' | 'Humor' | 'Historical';
  description: string;
  hook_overlay: string;
  caption: string;
  audio_recommendation: string;
  hashtags: string[];
}

export interface ViralResult {
  viralScore: number;
  detectedAesthetic: string;
  scoreBreakdown: {
    quality: number;
    trendMatch: number;
    hookFactor: number;
  };
  variants: {
    horror: ContentVariant;
    humor: ContentVariant;
    historical: ContentVariant;
  };
  warnings?: string[];
}

// New types for TheBrain
export interface HistoryItem {
  id: string | number;
  date: string | Date;
  platform: string;
  viralScore: number;
  mainAesthetic: string;
  songSelected: string;
}
