import { GoogleGenAI } from "@google/genai";
import { LyraAnalysisResult, BrandSettings, ViralResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `You are Elia.PRO, an advanced Algorithm Intelligence Engine.
Your core function is Multimodal Viral Prediction using Neuro-Design principles.
You optimize content for high-dopamine engagement and algorithm velocity.
You must use Deep Thinking to simulate "Graph API" trend analysis.
Always output strictly structured JSON.`;

export async function analyzeMedia(base64Data: string, mimeType: string, settings?: BrandSettings): Promise<LyraAnalysisResult>;
export async function analyzeMedia(base64Data: string, mimeType: string, platform: 'TikTok' | 'Instagram', brandSettings: BrandSettings, musicMood?: string, options?: { signal?: AbortSignal }): Promise<ViralResult>;
export async function analyzeMedia(
  base64Data: string,
  mimeType: string,
  arg3?: 'TikTok' | 'Instagram' | BrandSettings,
  arg4?: BrandSettings,
  arg5?: string,
  options?: { signal?: AbortSignal }
): Promise<LyraAnalysisResult | ViralResult> {
  
  const isViralEngine = (typeof arg3 === 'string');
  const platform = isViralEngine ? (arg3 as 'TikTok' | 'Instagram') : undefined;
  const brandSettings = isViralEngine ? arg4 : (arg3 as BrandSettings | undefined);
  const musicMood = isViralEngine ? arg5 : undefined;
  
  if (options?.signal?.aborted) {
    throw new DOMException('Aborted', 'AbortError');
  }

  const isVideo = mimeType.startsWith('video/');

  let prompt = "";

  if (isViralEngine) {
    prompt = `
    Analyze this ${isVideo ? 'VIDEO' : 'IMAGE'} for ${platform} Viral Potential.
    Target Niche: ${brandSettings?.niche || "General"}
    
    PHASE 1: DEEP SCAN
    - Identify aesthetic, lighting quality, and pacing (if video).
    - Score Visual Quality (0-40).

    PHASE 2: TREND SIMULATION
    - Use Google Search to find "Trending ${platform} Audio" for this aesthetic.
    ${musicMood ? `- IMPORTANT: User requested Music Vibe: "${musicMood}". STRICTLY prioritize audio that fuses this vibe with the specific content variants below.` : ''}
    - Validate hashtag volume.
    - Score Trend Match (0-40) and Hook Factor (0-20).

    PHASE 3: STRATEGY GENERATION (3 VARIANTS)
    Generate 3 distinct strategies. For each, provide a "description" (1-2 sentences setting the mood).

    1. DARK HORROR / MYSTERY:
       - Description: Dark, eerie, suspenseful context.
       - Audio: A track that is primarily SCARY/THRILLER but incorporates the requested "${musicMood || 'Dark'}" vibe. (e.g. if User said 'Phonk', give 'Scary Phonk').
       - Hook: Unsettling.

    2. HUMOR / RELATABLE:
       - Description: Lighthearted, funny context.
       - Audio: A track that is trending & funny, but fits the requested "${musicMood || 'Upbeat'}" vibe.
       - Hook: POV/Joke.

    3. HISTORICAL / EDUCATIONAL:
       - Description: "Did you know" / Fascinating fact context.
       - Audio: A track that feels Cinematic/Epic, blended with the requested "${musicMood || 'Classical'}" vibe.
       - Hook: Curiosity gap.

    CONTEXT:
    - Personality: ${brandSettings?.personality || "Neutral"}
    - CTA: ${brandSettings?.includeLinkInBio ? "YES (Append 'Link in Bio')" : "NO"}

    OUTPUT JSON:
    {
      "viralScore": number,
      "detectedAesthetic": "string",
      "scoreBreakdown": { "quality": number, "trendMatch": number, "hookFactor": number },
      "variants": {
        "horror": { "style": "Horror", "description": "string", "hook_overlay": "string", "caption": "string", "audio_recommendation": "string", "hashtags": ["string"] },
        "humor": { "style": "Humor", "description": "string", "hook_overlay": "string", "caption": "string", "audio_recommendation": "string", "hashtags": ["string"] },
        "historical": { "style": "Historical", "description": "string", "hook_overlay": "string", "caption": "string", "audio_recommendation": "string", "hashtags": ["string"] }
      },
      "warnings": ["string"]
    }
    `;
  } else {
    prompt = `
    Analyze this ${isVideo ? 'VIDEO' : 'IMAGE'} for Viral Potential.

    BRAND CONTEXT:
    - Niche: ${brandSettings?.niche || "General"}
    - Personality: ${brandSettings?.personality || "Analytical"}

    PHASE 1: RECOGNITION
    - Identify Aesthetic, Colors, Objects.

    PHASE 2: COMPETITOR SPY
    - Search "Viral [Aesthetic] videos" (last 24h).
    - Extract a real Hook text.

    PHASE 3: STRATEGY
    - Viral Option (Broad) vs Niche Option (Specific).
    - If ${brandSettings?.includeLinkInBio}, add CTA.

    OUTPUT JSON:
    {
      "visuals": { "aesthetic": "string", "colors": ["#hex"], "objects": ["string"] },
      "score": { "total": number, "isAestheticTrending": boolean, "isAudioRising": boolean, "breakdown": "string" },
      "options": {
        "viral": { "hook_overlay": "string", "caption": "string", "audio": "string", "hashtags": ["string"], "type": "Viral" },
        "niche": { "hook_overlay": "string", "caption": "string", "audio": "string", "hashtags": ["string"], "type": "Niche" }
      },
      "competitor": { "hook": "string", "topic": "string", "recommendation": "string" },
      "warnings": ["string"]
    }
    `;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          { inlineData: { data: base64Data, mimeType: mimeType } },
          { text: prompt }
        ]
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }],
        thinkingConfig: { thinkingBudget: 16384 },
      }
    });
    
    if (options?.signal?.aborted) {
      throw new DOMException('Aborted', 'AbortError');
    }

    const text = response.text;
    if (!text) throw new Error("Empty response from Elia Engine.");

    const cleanJson = (str: string) => {
      // Improved JSON extraction: Finds the LAST valid JSON block to avoid picking up Thinking/Planning blocks
      const jsonBlockRegex = /```(?:json)?\s*(\{[\s\S]*?\})\s*```/g;
      const matches = [...str.matchAll(jsonBlockRegex)];
      
      if (matches.length > 0) {
        return matches[matches.length - 1][1]; // Return the last match
      }

      // Fallback: Find outermost braces
      const firstBrace = str.indexOf('{');
      const lastBrace = str.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1) {
        return str.substring(firstBrace, lastBrace + 1);
      }
      return str;
    };

    const parsed = JSON.parse(cleanJson(text));
    
    if (isViralEngine) {
       if (!parsed.variants || !parsed.variants.horror) throw new Error("Malformed Analysis Data");
       ['horror', 'humor', 'historical'].forEach(k => {
          if (!parsed.variants[k].description) parsed.variants[k].description = `A ${k} themed viral post.`;
       });
       return parsed as ViralResult;
    } else {
       if (!parsed.options || !parsed.score) throw new Error("Malformed Analysis Data");
       return parsed as LyraAnalysisResult;
    }

  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error;
    
    console.error("Elia Engine Error:", error);
    
    if (isViralEngine) {
       return {
         viralScore: 0,
         detectedAesthetic: "Analysis Failed",
         scoreBreakdown: { quality: 0, trendMatch: 0, hookFactor: 0 },
         variants: {
            horror: { style: "Horror", description: "Error generating content.", hook_overlay: "N/A", caption: "Error", audio_recommendation: "N/A", hashtags: [] },
            humor: { style: "Humor", description: "Error generating content.", hook_overlay: "N/A", caption: "Error", audio_recommendation: "N/A", hashtags: [] },
            historical: { style: "Historical", description: "Error generating content.", hook_overlay: "N/A", caption: "Error", audio_recommendation: "N/A", hashtags: [] }
         },
         warnings: ["AI Model Overload - Try Again"]
       } as ViralResult;
    }
    return {
      visuals: { aesthetic: "Error", colors: [], objects: [] },
      score: { total: 0, isAestheticTrending: false, isAudioRising: false, breakdown: "Service Unavailable" },
      options: {
        viral: { hook_overlay: "Error", caption: "N/A", audio: "N/A", hashtags: [], type: "Viral" },
        niche: { hook_overlay: "Error", caption: "N/A", audio: "N/A", hashtags: [], type: "Niche" }
      },
      competitor: { hook: "N/A", topic: "N/A", recommendation: "N/A" },
      warnings: ["Network Error"]
    } as LyraAnalysisResult;
  }
}