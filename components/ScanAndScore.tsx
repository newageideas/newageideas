
import React, { useRef, useState } from 'react';
import { Card } from './ui/Card';
import { Upload, X, Loader2, Zap, AlertTriangle, RefreshCw } from 'lucide-react';
import { LyraAnalysisResult, BrandSettings } from '../types';

interface ScanAndScoreProps {
  isAnalyzing: boolean;
  result: LyraAnalysisResult | null;
  onAnalyze: (file: File, settings?: BrandSettings) => void;
  brandSettings?: BrandSettings;
  error?: string | null;
}

export const ScanAndScore: React.FC<ScanAndScoreProps> = ({ isAnalyzing, result, onAnalyze, brandSettings, error }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPreview(URL.createObjectURL(file));
      onAnalyze(file, brandSettings);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setPreview(URL.createObjectURL(file));
      onAnalyze(file, brandSettings);
    }
  };

  const triggerUpload = () => {
    if (!isAnalyzing) {
       fileInputRef.current?.click();
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in focus-group">
      
      {/* ERROR OVERLAY / REPLACEMENT */}
      {error && (
         <div className="col-span-1 lg:col-span-2 mb-4 bg-red-500/10 border border-red-500/50 p-6 rounded-xl flex items-center justify-between shadow-[0_0_20px_rgba(239,68,68,0.2)] animate-pulse-slow">
            <div className="flex items-center gap-4">
               <div className="p-3 bg-red-500/20 rounded-full text-red-500">
                  <AlertTriangle size={24} />
               </div>
               <div>
                  <h3 className="font-bold text-red-500 font-mono text-lg">SYSTEM ALERT</h3>
                  <p className="text-gray-300 text-sm">{error}</p>
               </div>
            </div>
            <button 
              onClick={() => {
                 setPreview(null);
                 triggerUpload();
              }}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white rounded-lg font-bold font-mono text-sm transition-all flex items-center gap-2"
            >
               <RefreshCw size={14} /> RETRY
            </button>
         </div>
      )}

      {/* Upload Zone */}
      <Card className={`min-h-[500px] flex flex-col justify-center items-center cursor-pointer border-dashed border-2 transition-colors ${error ? 'border-red-500/30' : 'border-lyra-surface hover:border-neon-cyan'}`} noPadding>
        <div 
          onClick={triggerUpload}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="absolute inset-0 flex flex-col items-center justify-center z-20"
        >
          {!preview ? (
            <div className="text-center p-8 group">
              <div className="w-24 h-24 rounded-full bg-lyra-surface flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-[0_0_20px_rgba(0,255,255,0.1)] group-hover:shadow-[0_0_30px_rgba(0,255,255,0.3)]">
                <Upload className="text-neon-cyan" size={40} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">DROP VISUALS</h3>
              <p className="text-lyra-text font-mono text-sm">Targeting Logic: Active</p>
              {brandSettings && (
                 <div className="mt-4 px-3 py-1 bg-neon-purple/20 text-neon-purple text-xs rounded-full inline-block border border-neon-purple/30">
                    Active Profile: {brandSettings.name}
                 </div>
              )}
            </div>
          ) : (
            <div className="relative w-full h-full bg-black/50 backdrop-blur-sm">
               {/* Show media preview if needed */}
            </div>
          )}
        </div>
        
        {/* Background Preview */}
        {preview && (
          <div className="absolute inset-0 z-0">
            <img src={preview} alt="Preview" className="w-full h-full object-cover opacity-40" />
            <div className="absolute inset-0 bg-gradient-to-t from-lyra-bg via-transparent to-transparent"></div>
          </div>
        )}

        <input ref={fileInputRef} type="file" className="hidden" accept="image/*,video/*" onChange={handleFileChange} />

        {/* Scanner Animation */}
        {isAnalyzing && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md">
            <div className="w-full h-1 bg-neon-cyan absolute top-0 animate-scan shadow-[0_0_20px_#00ffff]"></div>
            <Loader2 className="w-16 h-16 text-neon-cyan animate-spin mb-6" />
            <p className="text-neon-cyan font-mono text-xl animate-pulse tracking-widest">DEEP THINKING MODE</p>
            <p className="text-xs text-neon-magenta font-mono mt-2">Allocating 32k Tokens...</p>
          </div>
        )}
      </Card>

      {/* Results / Score Panel */}
      <div className="space-y-6">
        {result ? (
          <>
            {/* The Score */}
            <Card className="flex flex-col items-center justify-center py-10 relative overflow-hidden">
               <div className="absolute inset-0 bg-neon-cyan/5 radial-gradient"></div>
               <div className="relative z-10 text-center">
                 <div className="text-7xl font-bold text-white mb-2 font-mono flex items-center gap-4 justify-center" style={{ textShadow: '0 0 30px rgba(0,255,255,0.5)' }}>
                    {result.score.total}
                    <span className="text-2xl text-lyra-text">/100</span>
                 </div>
                 <div className={`inline-block px-4 py-1 rounded-full text-sm font-bold font-mono mb-6 ${result.score.total > 80 ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                    {result.score.total > 80 ? 'VIRAL VELOCITY: HIGH' : 'VIRAL VELOCITY: MODERATE'}
                 </div>
                 <p className="text-lyra-text max-w-md mx-auto text-sm border-l-2 border-neon-magenta pl-4 text-left">
                   {result.score.breakdown}
                 </p>
               </div>
            </Card>

            {/* Visual DNA */}
            <div className="grid grid-cols-2 gap-4">
               <Card title="AESTHETIC" className="flex items-center justify-center">
                  <div className="text-xl font-bold text-white tracking-wider uppercase text-center">
                     {result.visuals.aesthetic}
                  </div>
               </Card>
               <Card title="PALETTE" className="flex items-center justify-center gap-2">
                  {result.visuals.colors.map((c, i) => (
                    <div key={i} className="w-8 h-8 rounded-full border border-white/20 shadow-lg transform hover:scale-125 transition-transform" style={{ backgroundColor: c }}></div>
                  ))}
               </Card>
            </div>
            
            <Card title="RECOGNIZED VECTORS">
               <div className="flex flex-wrap gap-2">
                 {result.visuals.objects.map((obj, i) => (
                   <span key={i} className="px-3 py-1 bg-lyra-surface text-neon-cyan text-xs font-mono rounded-md border border-neon-cyan/20">
                     {obj}
                   </span>
                 ))}
               </div>
            </Card>
          </>
        ) : (
          <div className="h-full flex items-center justify-center opacity-30">
             <div className="text-center">
                <Zap size={64} className="mx-auto mb-4 text-lyra-text" />
                <p className="font-mono text-xl">AWAITING INPUT_</p>
                <p className="text-xs font-mono mt-2 text-neon-purple/80">
                   {brandSettings?.name ? `IDENTITY: ${brandSettings.name.toUpperCase()}` : 'NO IDENTITY SELECTED'}
                </p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};
