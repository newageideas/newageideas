import React, { useEffect, useRef, useState } from "react";
import {
  Upload,
  X,
  Zap,
  Copy,
  Check,
  Loader2,
  ExternalLink,
  Share2,
  Rocket,
  Ghost,
  Smile,
  ScrollText,
  Music,
  Hash,
  AlignLeft,
  Save,
  SlidersHorizontal
} from "lucide-react";
import { Card } from "./ui/Card";
import { CircularProgress } from "./ui/ProgressBar";
import { analyzeMedia as analyzeMediaService } from "../services/geminiService";
import type { BrandSettings, ViralResult, ContentVariant } from "../types";

interface ViralEngineProps {
  brandSettings: BrandSettings;
  onAnalysisComplete: (result: ViralResult, platform: "TikTok" | "Instagram") => void;
}

type VibeType = "horror" | "humor" | "historical";
const MUSIC_MOODS = [
  "Auto-Match", 
  "Phonk/Dark", 
  "High Energy/Gym", 
  "Lo-Fi/Chill", 
  "Cinematic/Epic", 
  "Meme/Funny", 
  "Suspense/Thriller", 
  "Viral Pop",
  "Classical/Orchestral"
] as const;

export const ViralEngine: React.FC<ViralEngineProps> = ({ brandSettings, onAnalysisComplete }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [platform, setPlatform] = useState<"TikTok" | "Instagram">("TikTok");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ViralResult | null>(null);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success">("idle");
  const [activeVibe, setActiveVibe] = useState<VibeType>("humor");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [musicFocus, setMusicFocus] = useState<(typeof MUSIC_MOODS)[number]>("Auto-Match");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const previewUrlRef = useRef<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const copiedTimeoutRef = useRef<number | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
      if (copiedTimeoutRef.current) window.clearTimeout(copiedTimeoutRef.current);
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  const setPreviewFromFile = (f: File) => {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    const url = URL.createObjectURL(f);
    previewUrlRef.current = url;
    setPreview(url);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    if (!f) return;
    setFile(f);
    setPreviewFromFile(f);
    setResult(null);
    setUploadStatus("idle");
    setErrorMessage(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0] ?? null;
    if (!f) return;
    setFile(f);
    setPreviewFromFile(f);
    setResult(null);
    setUploadStatus("idle");
    setErrorMessage(null);
  };

  const fileToBase64 = (fileToConvert: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("Failed to read file."));
      reader.onload = () => {
        const res = reader.result as string;
        resolve(res.split(",")[1]);
      };
      reader.readAsDataURL(fileToConvert);
    });

  // Create a low-res thumbnail for storage to avoid LocalStorage limits
  const createThumbnail = (fileToConvert: File): Promise<string> => {
    return new Promise((resolve) => {
       if (fileToConvert.type.startsWith('video')) {
          // For video, we just return a placeholder
          resolve('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFhAJ/wlseKgAAAABJRU5ErkJggg==');
          return;
       }
       const img = new Image();
       img.src = URL.createObjectURL(fileToConvert);
       img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 200;
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', 0.7)); // High compression
       };
    });
  };

  const copyToClipboard = async (text: string, fieldId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldId);
      if (copiedTimeoutRef.current) window.clearTimeout(copiedTimeoutRef.current);
      copiedTimeoutRef.current = window.setTimeout(() => {
        if (mountedRef.current) setCopiedField(null);
      }, 1500);
    } catch {
      setErrorMessage("Clipboard access denied.");
    }
  };

  const isAccountConnected = platform === "TikTok" ? !!brandSettings?.connectedAccounts?.tiktok : !!brandSettings?.connectedAccounts?.instagram;

  const handleAnalyze = async () => {
    if (!file || !preview) return;
    setErrorMessage(null);
    setIsAnalyzing(true);
    setResult(null);
    
    if (abortRef.current) abortRef.current.abort();
    const abortController = new AbortController();
    abortRef.current = abortController;

    try {
      const base64Data = await fileToBase64(file);
      const payload = await analyzeMediaService(
        base64Data, 
        file.type, 
        platform, 
        brandSettings, 
        musicFocus === "Auto-Match" ? undefined : musicFocus, 
        { signal: abortController.signal }
      );
      
      if (!mountedRef.current) return;
      setResult(payload);
      onAnalysisComplete(payload, platform);
    } catch (err: any) {
      if (err?.name !== "AbortError") {
        setErrorMessage("Analysis interrupted. Please try again.");
      }
    } finally {
      if (mountedRef.current) setIsAnalyzing(false);
      abortRef.current = null;
    }
  };

  const handleSmartPublish = async () => {
    if (!result) return;
    const content = result.variants[activeVibe];
    const postBody = `${content.caption}\n\n${content.hashtags?.join(" ") ?? ""}`;
    await copyToClipboard(postBody, "postBody");

    if (isAccountConnected) {
      setUploadStatus("uploading");
      setTimeout(() => {
        if (mountedRef.current) {
          setUploadStatus("success");
          setTimeout(() => mountedRef.current && setUploadStatus("idle"), 3000);
        }
      }, 1800);
    } else {
      const url = platform === "TikTok" ? "https://www.tiktok.com/upload" : "https://www.instagram.com/";
      window.open(url, "_blank", "noopener,noreferrer");
      setErrorMessage(`${platform} not linked. Content copied to clipboard.`);
      setTimeout(() => mountedRef.current && setErrorMessage(null), 3000);
    }
  };

  const handleSaveToBrain = async () => {
    if (!result || !file) return;

    try {
      // Use thumbnail instead of full file to save space
      const thumbnailUri = await createThumbnail(file);
      
      const saveData = {
        ...result,
        fileData: thumbnailUri, // Optimized
        timestamp: new Date().toISOString(),
        platform,
      };

      const existingRaw = localStorage.getItem("elia_brain_history");
      const history = existingRaw ? JSON.parse(existingRaw) : [];
      
      // Limit history to last 50 items to prevent overflow
      if (history.length > 50) history.shift();
      
      history.push(saveData);
      localStorage.setItem("elia_brain_history", JSON.stringify(history));

      setCopiedField("save");
      if (copiedTimeoutRef.current) window.clearTimeout(copiedTimeoutRef.current);
      copiedTimeoutRef.current = window.setTimeout(() => mountedRef.current && setCopiedField(null), 2000);
    } catch (err) {
      setErrorMessage("Storage full. Clear history in Brain tab.");
    }
  };

  const VIBE_STYLES: Record<VibeType, { colorClass: string; borderClass: string; bgClass: string }> = {
    horror: { colorClass: "text-red-500", borderClass: "border-red-900", bgClass: "bg-red-950/30" },
    humor: { colorClass: "text-yellow-400", borderClass: "border-yellow-400", bgClass: "bg-yellow-900/10" },
    historical: { colorClass: "text-cyan-400", borderClass: "border-cyan-400", bgClass: "bg-cyan-900/10" },
  };

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-3xl font-bold font-mono text-white flex items-center gap-2 hover-glow-text">
          <Zap className="text-neon-purple fill-neon-purple" /> ELIA.PRO ENGINE
        </h2>

        <div className="flex items-center gap-4">
          {/* Music Focus Dropdown */}
          <div className="relative group z-20">
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-900 border border-gray-700 rounded-full text-xs font-bold text-gray-300 hover:border-neon-cyan transition-colors cursor-pointer">
              <SlidersHorizontal size={14} className="text-neon-cyan" />
              {musicFocus}
            </div>
            <div className="absolute top-full right-0 mt-2 w-48 bg-black/95 backdrop-blur-xl border border-gray-800 rounded-xl shadow-xl overflow-hidden hidden group-hover:block transition-all z-30">
              <div className="px-4 py-2 text-[10px] text-gray-500 font-mono border-b border-gray-800 uppercase tracking-widest">Select Audio Vibe</div>
              {MUSIC_MOODS.map((mood) => (
                <button
                  key={mood}
                  onClick={() => setMusicFocus(mood)}
                  className={`w-full text-left px-4 py-2 text-xs font-mono hover:bg-white/10 ${musicFocus === mood ? "text-neon-cyan" : "text-gray-400"}`}
                >
                  {mood}
                </button>
              ))}
            </div>
          </div>

          <div className="flex bg-gray-900 rounded-full p-1 border border-gray-800">
            <button
              onClick={() => setPlatform("TikTok")}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${platform === "TikTok" ? "bg-neon-purple text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]" : "text-gray-500 hover:text-white"}`}
            >
              TikTok
            </button>
            <button
              onClick={() => setPlatform("Instagram")}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${platform === "Instagram" ? "bg-pink-600 text-white shadow-[0_0_15px_rgba(219,39,119,0.4)]" : "text-gray-500 hover:text-white"}`}
            >
              Instagram
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* INPUT */}
        <div className="space-y-6">
          <Card className="min-h-[450px] flex flex-col justify-center relative overflow-hidden group border-dashed hover:border-solid transition-all bg-black/40">
            {!preview ? (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center h-full cursor-pointer hover:bg-white/5 transition-all rounded-xl m-4"
              >
                <div className="w-20 h-20 bg-gray-900/50 rounded-full flex items-center justify-center mb-6 border border-gray-700 group-hover:border-neon-purple group-hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all">
                  <Upload className="w-8 h-8 text-gray-400 group-hover:text-neon-purple" />
                </div>
                <p className="text-gray-300 font-mono text-center text-lg">DROP IMAGE / VIDEO</p>
                <p className="text-gray-600 text-xs mt-3 font-mono">JPG, PNG, MP4</p>
                <input ref={fileInputRef} type="file" accept="image/*,video/*" onChange={handleFileChange} className="hidden" />
              </div>
            ) : (
              <div className="relative h-full w-full flex items-center justify-center">
                {file?.type.startsWith("video") ? (
                  <video src={preview} className="max-h-[400px] w-auto rounded-lg shadow-2xl" controls />
                ) : (
                  <img src={preview} alt="Upload preview" className="max-h-[400px] w-auto rounded-lg object-contain shadow-2xl" />
                )}
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-black/80 z-10 rounded-lg flex flex-col items-center justify-center backdrop-blur-sm">
                    <div className="w-full h-0.5 bg-neon-purple absolute top-0 animate-scan shadow-[0_0_20px_#a855f7]"></div>
                    <Loader2 className="w-12 h-12 text-neon-purple animate-spin mb-4" />
                    <div className="font-mono text-neon-purple animate-pulse text-lg tracking-widest">
                      NEURO-SCANNING...
                    </div>
                  </div>
                )}
                <button
                  onClick={() => {
                    setFile(null);
                    setPreview(null);
                    setResult(null);
                  }}
                  className="absolute top-4 right-4 bg-black/60 hover:bg-red-500 p-2 rounded-full text-white backdrop-blur transition-all"
                >
                  <X size={18} />
                </button>
              </div>
            )}
          </Card>

          <div className="space-y-3">
             <button
               onClick={handleAnalyze}
               disabled={!file || isAnalyzing}
               className={`w-full py-5 rounded-xl font-bold font-mono text-lg tracking-[0.2em] uppercase transition-all duration-300 btn-glow
                 ${!file || isAnalyzing
                   ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                   : "bg-white text-black hover:bg-neon-purple hover:text-white shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                 }`}
             >
               {isAnalyzing ? "PROCESSING..." : "GENERATE STRATEGIES"}
             </button>

             {/* Save Button (Input Column) */}
             {result && (
                <button
                   onClick={handleSaveToBrain}
                   className="w-full py-3 bg-gray-900 border border-gray-700 hover:border-neon-cyan text-gray-400 hover:text-neon-cyan rounded-lg font-mono text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 group"
                >
                   {copiedField === "save" ? <Check size={14} className="text-green-500"/> : <Save size={14} className="group-hover:scale-110 transition-transform"/>}
                   {copiedField === "save" ? "SAVED TO BRAIN" : "SAVE RESULT TO BRAIN"}
                </button>
             )}
          </div>
          {errorMessage && <div className="text-xs font-mono text-red-400 mt-2 text-center">{errorMessage}</div>}
        </div>

        {/* OUTPUT */}
        <div className="space-y-6">
          {result ? (
            <>
              <Card title="VIRAL POTENTIAL" className="flex flex-col items-center" glow>
                <div className="flex flex-col md:flex-row items-center justify-between w-full px-2 gap-6">
                  <div className="relative">
                    <CircularProgress score={result.viralScore} size={100} strokeWidth={8} />
                    <div className="absolute inset-0 rounded-full shadow-[0_0_40px_rgba(168,85,247,0.15)] pointer-events-none"></div>
                  </div>
                  <div className="flex-1 space-y-3">
                    <h3 className="font-mono text-xl text-white tracking-widest">{result.detectedAesthetic?.toUpperCase()}</h3>
                    <div className="flex gap-1 h-1.5 rounded-full overflow-hidden bg-gray-800">
                      <div className="bg-blue-500 shadow-[0_0_10px_#3b82f6]" style={{ width: `${(result.scoreBreakdown.quality / 40) * 100}%` }} />
                      <div className="bg-neon-purple shadow-[0_0_10px_#a855f7]" style={{ width: `${(result.scoreBreakdown.trendMatch / 40) * 100}%` }} />
                      <div className="bg-pink-500 shadow-[0_0_10px_#ec4899]" style={{ width: `${(result.scoreBreakdown.hookFactor / 20) * 100}%` }} />
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                       <span>QUALITY</span>
                       <span>TREND</span>
                       <span>HOOK</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Vibe Tabs */}
              <div className="bg-gray-900/50 p-1 rounded-xl flex gap-2 border border-gray-800">
                {(["horror", "humor", "historical"] as VibeType[]).map((vibe) => (
                  <button
                    key={vibe}
                    onClick={() => setActiveVibe(vibe)}
                    className={`flex-1 py-3 rounded-lg font-mono font-bold text-xs uppercase flex items-center justify-center gap-2 transition-all duration-300 ${
                      activeVibe === vibe 
                      ? `bg-gray-800 shadow-lg text-white border border-gray-700 ${VIBE_STYLES[vibe].colorClass}` 
                      : "text-gray-500 hover:text-white hover:bg-gray-800/50"
                    }`}
                  >
                    {vibe === "horror" && <Ghost size={16} />}
                    {vibe === "humor" && <Smile size={16} />}
                    {vibe === "historical" && <ScrollText size={16} />}
                    {vibe}
                  </button>
                ))}
              </div>

              {/* Active Content Content */}
              <Card className={`relative transition-all duration-500 border-t-2 ${VIBE_STYLES[activeVibe].borderClass}`} noPadding>
                <div className={`p-6 space-y-6 font-mono text-sm bg-gradient-to-b ${VIBE_STYLES[activeVibe].bgClass} to-transparent`}>
                  
                  {/* Hook */}
                  <div className="relative group cursor-pointer" onClick={() => copyToClipboard(result.variants[activeVibe].hook_overlay, "hook")}>
                    <label className="text-[10px] text-gray-500 font-bold tracking-wider mb-1 flex justify-between">
                      VISUAL HOOK
                      <span className={`text-xs ${VIBE_STYLES[activeVibe].colorClass} opacity-0 group-hover:opacity-100 transition-opacity`}>
                        {copiedField === "hook" ? "COPIED" : "COPY"}
                      </span>
                    </label>
                    <div className="text-2xl font-bold text-white tracking-tight leading-none bg-black/40 p-5 rounded-lg border border-gray-800 group-hover:border-white/20 transition-all shadow-inner">
                      "{result.variants[activeVibe].hook_overlay}"
                    </div>
                  </div>

                  {/* Caption */}
                  <div className="group cursor-pointer" onClick={() => copyToClipboard(result.variants[activeVibe].caption, "caption")}>
                    <label className="text-[10px] text-gray-500 font-bold tracking-wider mb-2 flex justify-between">
                      CAPTION STRATEGY
                      <span className={`text-xs ${VIBE_STYLES[activeVibe].colorClass} opacity-0 group-hover:opacity-100 transition-opacity`}>
                        {copiedField === "caption" ? "COPIED" : "COPY"}
                      </span>
                    </label>
                    <div className="text-base text-gray-200 font-medium leading-loose p-5 bg-black/40 rounded-xl border border-white/5 hover:border-white/20 transition-all font-sans">
                      {result.variants[activeVibe].caption}
                    </div>
                  </div>

                  {/* Atmospheric Description */}
                  <div className={`border-l-4 pl-4 py-3 rounded-r-lg ${activeVibe === 'horror' ? 'border-red-600 bg-red-950/20' : 'border-gray-700'}`}>
                     <label className={`flex items-center gap-2 text-[10px] font-bold uppercase mb-1 ${activeVibe === 'horror' ? 'text-red-500' : 'text-gray-400'}`}>
                        <AlignLeft size={10} /> 
                        {activeVibe === 'horror' ? 'DARK HORROR DESCRIPTION' : 'MOOD DESCRIPTION'}
                     </label>
                     <p className={`text-sm italic ${VIBE_STYLES[activeVibe].colorClass}`}>
                        {result.variants[activeVibe].description}
                     </p>
                  </div>

                  {/* Audio */}
                  <div className="bg-gray-800/30 p-4 rounded-xl border border-gray-800 hover:border-neon-cyan/30 transition-all flex justify-between items-center group">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <label className="flex items-center gap-1 text-[10px] text-neon-cyan font-bold"><Music size={12} /> AUDIO ID</label>
                        {musicFocus !== 'Auto-Match' && (
                          <span className="text-[9px] bg-gray-800 px-1.5 py-0.5 rounded text-gray-400 font-mono border border-gray-700">
                             FOCUS: {musicFocus.toUpperCase()}
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-bold text-white font-sans">{result.variants[activeVibe].audio_recommendation}</p>
                    </div>
                    <button onClick={() => copyToClipboard(result.variants[activeVibe].audio_recommendation, "audio")} className="text-gray-500 hover:text-white p-2">
                      {copiedField === "audio" ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                    </button>
                  </div>

                  {/* Hashtags */}
                  <div className="bg-black/30 p-5 rounded-xl border border-gray-800 relative">
                    <div className="flex justify-between items-center mb-3 border-b border-gray-800 pb-2">
                      <label className="flex items-center gap-2 text-xs font-bold text-neon-cyan tracking-wider">
                        <Hash size={14} /> TAG STACK
                      </label>
                      <button
                        onClick={() => copyToClipboard(result.variants[activeVibe].hashtags.join(" "), "tags")}
                        className="px-3 py-1 bg-neon-cyan/10 hover:bg-neon-cyan/20 text-neon-cyan text-[10px] font-bold rounded border border-neon-cyan/30 transition-all flex items-center gap-1 active:scale-95"
                      >
                        {copiedField === "tags" ? <Check size={12} /> : "COPY TAGS"}
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {result.variants[activeVibe].hashtags.map((tag, i) => (
                        <span key={i} className="text-sm font-bold text-gray-400 hover:text-white transition-colors">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-3 pt-2">
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          const v = result.variants[activeVibe];
                          const all = `${v.hook_overlay}\n\n${v.caption}\n\n${v.audio_recommendation}\n\n${v.hashtags.join(" ")}`;
                          copyToClipboard(all, "all");
                        }}
                        className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 border border-gray-700 hover:border-gray-500"
                      >
                        {copiedField === "all" ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                        COPY ALL
                      </button>

                      <button
                        onClick={handleSmartPublish}
                        disabled={uploadStatus === "uploading" || uploadStatus === "success"}
                        className={`flex-1 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg btn-glow relative overflow-hidden active:scale-95 ${
                          isAccountConnected 
                          ? "bg-gradient-to-r from-neon-purple to-pink-600 text-white shadow-neon-purple/30" 
                          : "bg-white text-black hover:bg-gray-100"
                        }`}
                      >
                        {uploadStatus === "idle" && (isAccountConnected ? <Rocket size={18} /> : <ExternalLink size={18} />)}
                        {uploadStatus === "idle" && (isAccountConnected ? "PUSH TO ALGO" : `OPEN ${platform.toUpperCase()}`)}
                        {uploadStatus === "uploading" && <Loader2 className="animate-spin" size={18} />}
                        {uploadStatus === "success" && <Check size={18} />}
                      </button>
                    </div>

                    <button
                      onClick={handleSaveToBrain}
                      className="w-full py-2 text-gray-500 hover:text-neon-cyan font-mono text-[10px] uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                    >
                      {copiedField === "save" ? <Check size={12} /> : <Share2 size={12} />}
                      {copiedField === "save" ? "SAVED TO MEMORY" : "SAVE RESULT TO BRAIN"}
                    </button>
                  </div>
                </div>
              </Card>
            </>
          ) : (
             <div className="h-full min-h-[400px] flex items-center justify-center border border-gray-800 rounded-[15px] border-dashed bg-gray-900/20">
              <div className="text-center opacity-30">
                <div className="text-6xl mb-4 grayscale">🧠</div>
                <p className="font-mono text-lg tracking-widest text-glow-cyan">SYSTEM READY</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};