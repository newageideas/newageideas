
import React from 'react';
import { Card } from './ui/Card';
import { LyraAnalysisResult } from '../types';
import { Eye, Target, ArrowRight, Activity, Globe, Clock, Database } from 'lucide-react';

interface CompetitorSpyProps {
  result: LyraAnalysisResult;
}

export const CompetitorSpy: React.FC<CompetitorSpyProps> = ({ result }) => {
  if (!result || !result.competitor) return null;

  return (
    <div className="max-w-5xl mx-auto animate-fade-in space-y-8 focus-group pb-10">
      <div className="text-center mb-8 relative">
         <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-lyra-surface to-transparent -z-10"></div>
         <h2 className="text-3xl font-bold text-white font-mono flex items-center justify-center gap-3 inline-block bg-lyra-bg px-4">
            <Eye className="text-neon-cyan animate-pulse" /> COMPETITOR INTEL
         </h2>
         <p className="text-lyra-text mt-2 text-sm font-mono tracking-widest text-neon-cyan">LIVE DATAFEED_ACTIVE</p>
      </div>

      {/* Main Spy Card */}
      <Card className="relative overflow-hidden border-neon-magenta/30 shadow-[0_0_30px_rgba(255,0,255,0.1)]">
         <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-neon-magenta to-purple-600"></div>
         <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* The Target */}
            <div className="flex-1 w-full">
               <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  <label className="text-xs text-neon-magenta font-bold tracking-[0.2em] uppercase">Top Viral Hook</label>
               </div>
               <div className="text-3xl lg:text-4xl font-bold text-white leading-tight mb-6 font-mono drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                  "{result.competitor.hook}"
               </div>
               <div className="flex items-center gap-3 text-lyra-text text-sm bg-lyra-bg/50 p-2 rounded-lg inline-flex border border-white/10">
                  <Target size={16} className="text-neon-cyan" />
                  <span className="font-bold text-white">{result.competitor.topic.toUpperCase()}</span>
               </div>
            </div>
            
            {/* Connector */}
            <div className="hidden lg:flex items-center justify-center self-center opacity-50">
               <ArrowRight size={32} className="text-white animate-pulse" />
            </div>

            {/* The Recommendation */}
            <div className="flex-1 w-full bg-gradient-to-br from-lyra-bg to-purple-900/20 p-6 rounded-xl border border-white/10 hover:border-neon-cyan/50 transition-all group">
               <label className="text-xs text-neon-cyan font-bold tracking-[0.2em] uppercase mb-3 block flex items-center gap-2">
                  <Activity size={12} /> Lyra Optimization
               </label>
               <p className="text-white text-lg font-medium leading-relaxed">
                  {result.competitor.recommendation}
               </p>
               <div className="mt-4 pt-4 border-t border-white/5 text-[10px] text-gray-500 font-mono flex justify-between">
                  <span>STRATEGY: PATTERN_INTERRUPT</span>
                  <span className="text-green-400">CONFIDENCE: 94%</span>
               </div>
            </div>
         </div>
      </Card>
      
      {/* Search Metadata - Visualizing the "Scan" */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
         {[
            { label: 'SEARCH REGION', val: 'GLOBAL', icon: Globe, color: 'text-blue-400' },
            { label: 'TIME WINDOW', val: 'LAST 24 HRS', icon: Clock, color: 'text-yellow-400' },
            { label: 'DETECTED NICHE', val: result.visuals.aesthetic.split(' ')[0], icon: Target, color: 'text-neon-magenta' },
            { label: 'DATAPOINTS', val: '14,203', icon: Database, color: 'text-green-400' }
         ].map((stat, i) => (
            <div key={i} className="bg-lyra-card/50 backdrop-blur-sm p-4 rounded-xl border border-white/5 hover:border-white/20 transition-all group">
               <div className="flex items-center gap-2 mb-2">
                  <stat.icon size={14} className={stat.color} />
                  <div className="text-[10px] text-gray-400 font-bold">{stat.label}</div>
               </div>
               <div className="text-white font-mono font-bold text-lg tracking-wider group-hover:text-neon-cyan transition-colors">{stat.val}</div>
            </div>
         ))}
      </div>
    </div>
  );
};
