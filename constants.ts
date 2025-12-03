
import { Tab, BrandSettings } from './types';

export const NAV_ITEMS = [
  { id: Tab.SCAN_SCORE, label: 'SCAN & SCORE', icon: '📥' },
  { id: Tab.THE_LAB, label: 'THE LAB', icon: '🧪' },
  { id: Tab.COMPETITOR_SPY, label: 'COMPETITOR SPY', icon: '🕵️' },
  { id: Tab.BRAND_DNA, label: 'BRAND DNA', icon: '🧬' },
];

export const DEFAULT_PROFILE: BrandSettings = {
  id: 'default',
  name: 'Default Identity',
  connectedAccounts: { tiktok: false, instagram: false },
  niche: 'General',
  personality: 'Informative',
  includeLinkInBio: false
};

// Mock data for initial render or testing
export const MOCK_ANALYSIS = {
  visuals: { aesthetic: 'Cyberpunk', colors: ['#000', '#0ff'], objects: ['Neon Light'] },
  score: { total: 88, isAestheticTrending: true, isAudioRising: true, breakdown: 'Strong trend match.' },
  options: {
    viral: { hook_overlay: 'Test Hook', caption: 'Test Caption', audio: 'Test Audio', hashtags: [], type: 'Viral' },
    niche: { hook_overlay: 'Test Hook', caption: 'Test Caption', audio: 'Test Audio', hashtags: [], type: 'Niche' }
  },
  competitor: { hook: 'Test Competitor Hook', topic: 'Test Topic', recommendation: 'Steal it.' }
};
