
import React from 'react';
import { X, Check, CreditCard, Zap } from 'lucide-react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-lyra-bg border border-neon-purple rounded-2xl w-full max-w-md overflow-hidden shadow-[0_0_50px_rgba(168,85,247,0.3)] animate-fade-in transform scale-100">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900/50 to-lyra-bg p-6 border-b border-white/10 flex justify-between items-start">
          <div>
            <h3 className="text-2xl font-bold text-white font-mono flex items-center gap-2">
              <Zap className="text-neon-purple fill-neon-purple" size={24} />
              ELIA PRO
            </h3>
            <p className="text-neon-purple text-xs font-mono tracking-widest mt-1">UNLOCK NEURO-VIRAL INTELLIGENCE</p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-gray-300">
              <div className="p-1 bg-green-500/20 rounded-full text-green-400"><Check size={12} /></div>
              <span>Unlock <b>Competitor Deep Scans</b> (Unlimited)</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-300">
              <div className="p-1 bg-green-500/20 rounded-full text-green-400"><Check size={12} /></div>
              <span>Remove Saturation Limits</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-300">
              <div className="p-1 bg-green-500/20 rounded-full text-green-400"><Check size={12} /></div>
              <span>Multi-Profile Brand DNA Storage</span>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
            <span className="text-3xl font-bold text-white">$1.99</span>
            <span className="text-gray-400 text-sm"> / month</span>
            <p className="text-[10px] text-gray-500 mt-1">Cancel anytime. Secure checkout.</p>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider text-center mb-2">Select Payment Method</p>
            
            <a href="https://venmo.com/?txn=pay&recipients=ELIA_PRO&amount=1.99&note=Premium%20Subscription" target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 bg-[#008CFF]/10 border border-[#008CFF]/30 hover:bg-[#008CFF]/20 rounded-lg group transition-all cursor-pointer">
              <span className="font-bold text-[#008CFF] group-hover:text-white transition-colors">Venmo</span>
              <ExternalLinkIcon />
            </a>

            <a href="https://cash.app/$ELIA_PRO/1.99?note=Premium%20Subscription" target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 bg-[#00D632]/10 border border-[#00D632]/30 hover:bg-[#00D632]/20 rounded-lg group transition-all cursor-pointer">
              <span className="font-bold text-[#00D632] group-hover:text-white transition-colors">Cash App</span>
              <ExternalLinkIcon />
            </a>

             <div className="flex items-center justify-between p-3 bg-gray-800 border border-gray-700 rounded-lg opacity-50 cursor-not-allowed">
              <span className="font-bold text-gray-400 flex items-center gap-2"><CreditCard size={16}/> Credit Card</span>
              <span className="text-[10px] text-gray-500">COMING SOON</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-black/20 border-t border-white/5 text-center">
          <button onClick={onClose} className="text-xs text-gray-500 hover:text-white transition-colors">
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
};

const ExternalLinkIcon = () => (
  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);
