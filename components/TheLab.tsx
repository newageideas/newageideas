
import React, { useState } from 'react';
import { Card } from './ui/Card';
import { LyraAnalysisResult, PostOption } from '../types';
import { Copy, Check, Music, Hash, AlertTriangle, Rocket, ExternalLink, Loader2 } from 'lucide-react';

interface TheLabProps {
  result: LyraAnalysisResult;
}

export const TheLab: React.FC<TheLabProps> = ({ result }) => {
  const [copied, setCopied] = useState<string | null>(null);
  const [publishStatus, setPublishStatus] = useState<Record<string, 'idle' | 'uploading' | 'success'>>({});

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleSmartPublish = (optionKey: string, option: PostOption) => {
    // Simulate upload flow
    const fullContent = `${option.hook_overlay}\n\n${option.caption}\n\n${option.hashtags.join(' ')}`;
    navigator.clipboard.writeText(fullContent);
    
    setPublishStatus(prev => ({ ...prev, [optionKey]: 'uploading' }));
    
    // Fake API delay
    setTimeout(() => {
      setPublishStatus(prev => ({ ...prev, [optionKey]: 'success' }));
      // Open platform (fallback since we can't truly post without auth token)
      window.open('https://www.tiktok.com/upload', '_blank');
      
      setTimeout(() => {
        setPublishStatus(prev => ({ ...prev, [optionKey]: 'idle' }));
      }, 4000);
    }, 2000);
  };

  const OptionCard = ({ option, title, id }: { option: PostOption; title: string, id: string }) => {
     const jsonString = JSON.stringify(option, null, 2);
     const status = publishStatus[id] || 'idle';

     return (
       <Card title={title} className="h-full flex flex-col relative overflow-hidden group">
         {/* Glow Effect */}
         <div className="absolute top-0 right-0 w-32 h-32 bg-neon-cyan/5 blur-3xl rounded-full pointer-events-none group-hover:bg-neon-cyan/10 transition-colors"></div>

         {/* Hook Overlay Display */}
         <div className="mb-6 relative group/hook cursor-pointer" onClick={() => copyToClipboard(option.hook_overlay, id + '_hook')}>
            <label className="text-[10px] font-mono text-neon-magenta mb-1 block uppercase tracking-wider flex justify-between">
              Visual Hook (3s)
              <span className="text-neon-cyan opacity-0 group-hover/hook:opacity-100 transition-opacity">COPY</span>
            </label>
            <div className="bg-black/40 border-l-4 border-neon-magenta p-4 text-white font-bold text-lg shadow-[0_0_15px_rgba(255,0,255,0.1)] hover:shadow-[0_0_20px_rgba(255,0,255,0.3)] hover:bg-white/5 transition-all rounded-r-lg">
               "{option.hook_overlay}"
            </div>
            <div className="absolute top-2 right-2 opacity-0 group-hover/hook:opacity-100 transition-opacity">
               {copied === id + '_hook' ? <Check size={14} className="text-green-400"/> : <Copy size={14} className="text-neon-magenta"/>}
            </div>
         </div>

         {/* Audio Track */}
         <div className="mb-6 flex items-center justify-between p-3 bg-lyra-bg rounded-lg border border-lyra-surface hover:border-neon-cyan/50 transition-colors">
            <div className="flex items-center gap-3 overflow-hidden">
               <div className="w-8 h-8 bg-neon-cyan/20 rounded-full flex items-center justify-center text-neon-cyan shrink-0 animate-pulse-slow">
                  <Music size={16} />
               </div>
               <div className="truncate">
                  <p className="text-white text-sm font-bold truncate">{option.audio}</p>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                    <p className="text-[10px] text-neon-cyan font-mono">TRENDING: RISING</p>
                  </div>
               </div>
            </div>
            <button onClick={() => copyToClipboard(option.audio, id + '_audio')} className="text-lyra-text hover:text-white p-2">
               {copied === id + '_audio' ? <Check size={14} /> : <Copy size={14} />}
            </button>
         </div>

         {/* Caption */}
         <div className="flex-grow mb-6">
            <label className="text-[10px] font-mono text-lyra-text mb-1 block uppercase tracking-wider">Caption Strategy</label>
            <div 
              className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap p-3 rounded hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-white/10"
              onClick={() => copyToClipboard(option.caption, id + '_caption')}
            >
              {option.caption}
            </div>
         </div>

         {/* Action Buttons */}
         <div className="mt-auto space-y-3">
           {/* Smart Publish Button */}
           <button 
             onClick={() => handleSmartPublish(id, option)}
             disabled={status !== 'idle'}
             className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg btn-glow relative overflow-hidden active:scale-95 border border-transparent
               ${status === 'idle' 
                 ? 'bg-gradient-to-r from-neon-purple to-pink-600 text-white shadow-neon-purple/30' 
                 : 'bg-gray-800 text-gray-400 cursor-not-allowed'
               }`}
           >
              {status === 'idle' && (
                <>
                  <Rocket size={18} /> PUSH TO ALGO
                </>
              )}
              {status === 'uploading' && (
                <>
                  <Loader2 className="animate-spin" size={18} /> CONNECTING...
                </>
              )}
              {status === 'success' && (
                <>
                  <Check size={18} /> SENT TO CLOUD
                </>
              )}
           </button>

           <button 
             onClick={() => copyToClipboard(jsonString, id + '_json')}
             className="w-full py-2 bg-lyra-surface hover:bg-lyra-surface/80 text-neon-cyan font-mono text-[10px] font-bold uppercase tracking-widest rounded transition-all flex items-center justify-center gap-2"
           >
             {copied === id + '_json' ? <Check size={12} /> : <Copy size={12} />}
             COPY JSON DATA
           </button>
         </div>
       </Card>
     );
  }

  if (!result) return null;

  return (
    <div className="space-y-8 animate-fade-in focus-group pb-10">
      
      {result.warnings && result.warnings.length > 0 && (
         <div className="bg-yellow-500/10 border border-yellow-500/50 p-4 rounded-xl flex items-center gap-3 text-yellow-200 mb-6 shadow-[0_0_15px_rgba(234,179,8,0.1)]">
            <AlertTriangle className="text-yellow-500" />
            <div>
               <p className="font-bold text-sm font-mono">SATURATION WARNING DETECTED</p>
               <p className="text-xs opacity-80">{result.warnings.join(' ')}</p>
            </div>
         </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <OptionCard option={result.options.viral} title="STRATEGY A: VIRAL IGNITION" id="opt_viral" />
        <OptionCard option={result.options.niche} title="STRATEGY B: NICHE AUTHORITY" id="opt_niche" />
      </div>
    </div>
  );
};
