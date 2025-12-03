import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  noPadding?: boolean;
  glow?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title, noPadding = false, glow = false }) => {
  return (
    <div className={`focus-item relative rounded-2xl overflow-hidden transition-all duration-300 group
      ${className} 
      bg-lyra-card/60 backdrop-blur-xl border border-white/5
      ${glow ? 'shadow-[0_0_30px_rgba(100,255,218,0.1)]' : 'shadow-xl'}
    `}>
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
      
      {/* Hover Glow Border */}
      <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-neon-cyan/30 transition-colors duration-500 pointer-events-none"></div>

      {title && (
        <div className="relative z-10 border-b border-white/5 p-4 flex justify-between items-center bg-black/20">
          <h3 className="text-neon-cyan font-mono text-[10px] tracking-[0.2em] uppercase font-bold flex items-center gap-2 group-hover:text-white transition-colors">
            <span className="w-1.5 h-1.5 bg-neon-magenta rounded-full animate-pulse"></span>
            {title}
          </h3>
        </div>
      )}
      
      <div className={`relative z-10 ${noPadding ? '' : 'p-6'}`}>
        {children}
      </div>
    </div>
  );
};