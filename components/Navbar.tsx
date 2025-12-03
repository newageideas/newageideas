
import React from 'react';
import { Tab } from '../types';
import { NAV_ITEMS } from '../constants';
import { Hexagon, Zap } from 'lucide-react';

interface NavbarProps {
  currentTab: Tab;
  onTabChange: (tab: Tab) => void;
  disabled: boolean;
  onUpgradeClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onTabChange, disabled, onUpgradeClick }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-lyra-bg/80 backdrop-blur-xl border-b border-lyra-surface h-20 flex items-center justify-center">
      <div className="container max-w-6xl mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-3 group cursor-pointer focus-item">
           <div className="relative">
             <Hexagon className="text-neon-cyan fill-lyra-card animate-pulse-slow" size={32} />
             <div className="absolute inset-0 bg-neon-cyan blur-xl opacity-20"></div>
           </div>
           <div className="flex flex-col">
              <span className="text-white font-bold text-2xl tracking-tighter hover-glow-text group-hover:text-neon-cyan transition-colors">ELIA<span className="text-neon-cyan">.PRO</span></span>
              <span className="text-[9px] text-lyra-cyan tracking-[0.3em] font-mono uppercase">Algorithm Intelligence</span>
           </div>
        </div>

        {/* Desktop Nav - Focus Group */}
        <div className="hidden md:flex items-center gap-4 focus-group p-2">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => !disabled && onTabChange(item.id as Tab)}
              disabled={disabled}
              className={`focus-item flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold font-mono transition-all duration-300 relative overflow-hidden group
                ${currentTab === item.id 
                  ? 'text-lyra-bg bg-neon-cyan shadow-[0_0_15px_#00ffff]' 
                  : 'text-lyra-text bg-lyra-card hover:text-white border border-transparent hover:border-neon-cyan/50 hover:shadow-[0_0_15px_rgba(0,255,255,0.2)]'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button 
            onClick={onUpgradeClick}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-neon-purple to-pink-600 text-white font-bold text-xs uppercase tracking-wider hover:shadow-[0_0_15px_rgba(168,85,247,0.5)] transition-all transform hover:scale-105"
          >
            <Zap size={14} className="fill-white" />
            GO PRO
          </button>
          
          <div className="hidden lg:flex items-center gap-2 text-[10px] font-mono text-lyra-text border border-lyra-surface px-3 py-1 rounded-full bg-lyra-card/50">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
             NET_ONLINE
          </div>
        </div>
      </div>
    </nav>
  );
};
