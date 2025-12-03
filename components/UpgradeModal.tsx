
import React, { useState } from 'react';
import { X, Check, CreditCard, Zap, Lock, Copy, ExternalLink, Smartphone, ChevronRight } from 'lucide-react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type PaymentMethod = 'card' | 'apps';

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose }) => {
  const [method, setMethod] = useState<PaymentMethod>('card');
  const [cardState, setCardState] = useState({ number: '', expiry: '', cvc: '', name: '' });
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [copiedZelle, setCopiedZelle] = useState(false);

  if (!isOpen) return null;

  const handleCardInput = (field: string, value: string) => {
    let formatted = value;
    if (field === 'number') {
      formatted = value.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');
    } else if (field === 'expiry') {
      formatted = value.replace(/\D/g, '').slice(0, 4).replace(/(\d{2})(?=\d)/g, '$1/');
    } else if (field === 'cvc') {
      formatted = value.replace(/\D/g, '').slice(0, 4);
    }
    setCardState(prev => ({ ...prev, [field]: formatted }));
  };

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    // Simulate secure gateway processing
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
      setTimeout(() => {
         onClose();
         setSuccess(false);
         setCardState({ number: '', expiry: '', cvc: '', name: '' });
      }, 2000);
    }, 2000);
  };

  const copyZelle = () => {
     navigator.clipboard.writeText("pay@elia.pro");
     setCopiedZelle(true);
     setTimeout(() => setCopiedZelle(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md transition-opacity" onClick={onClose}></div>

      <div className="relative bg-[#0f1115] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-[0_0_50px_rgba(168,85,247,0.2)] animate-fade-in flex flex-col md:flex-row h-[600px] md:h-auto">
        
        {/* Left Panel: Value Prop */}
        <div className="md:w-5/12 bg-gradient-to-br from-gray-900 to-black p-6 flex flex-col justify-between border-r border-white/5">
           <div>
              <div className="flex items-center gap-2 mb-6">
                 <div className="p-2 bg-neon-purple/20 rounded-lg text-neon-purple">
                    <Zap size={20} className="fill-current" />
                 </div>
                 <span className="font-bold text-white tracking-widest font-mono">ELIA.PRO</span>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">Upgrade to Neural+</h3>
              <p className="text-xs text-gray-400 leading-relaxed mb-6">
                 Unlock the full potential of our Gemini 3 Pro reasoning engine.
              </p>

              <div className="space-y-4">
                 {[
                    'Unlimited Deep Scans', 
                    'Competitor Spyglass', 
                    'Saturation Warnings', 
                    'Priority GPU Access',
                    'Multi-Profile Brand DNA'
                 ].map((feat, i) => (
                    <div key={i} className="flex items-center gap-3 text-xs text-gray-300">
                       <Check size={14} className="text-neon-cyan" />
                       {feat}
                    </div>
                 ))}
              </div>
           </div>
           
           <div className="mt-8">
              <div className="text-3xl font-bold text-white">$1.99</div>
              <div className="text-[10px] text-gray-500 uppercase tracking-wider">Per Month • Cancel Anytime</div>
           </div>
        </div>

        {/* Right Panel: Payment */}
        <div className="md:w-7/12 bg-[#0f1115] flex flex-col">
           <div className="p-4 border-b border-white/5 flex justify-between items-center">
              <div className="flex gap-4 text-xs font-bold font-mono">
                 <button 
                   onClick={() => setMethod('card')}
                   className={`pb-1 border-b-2 transition-colors ${method === 'card' ? 'text-white border-neon-purple' : 'text-gray-500 border-transparent hover:text-gray-300'}`}
                 >
                    CREDIT CARD
                 </button>
                 <button 
                   onClick={() => setMethod('apps')}
                   className={`pb-1 border-b-2 transition-colors ${method === 'apps' ? 'text-white border-neon-purple' : 'text-gray-500 border-transparent hover:text-gray-300'}`}
                 >
                    APPS & CRYPTO
                 </button>
              </div>
              <button onClick={onClose} className="text-gray-500 hover:text-white"><X size={18} /></button>
           </div>

           <div className="p-6 flex-1 overflow-y-auto">
              {success ? (
                 <div className="h-full flex flex-col items-center justify-center text-center animate-fade-in">
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center text-green-500 mb-4 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                       <Check size={32} />
                    </div>
                    <h4 className="text-white font-bold text-lg mb-1">Upgrade Complete</h4>
                    <p className="text-gray-400 text-xs">Welcome to the inner circle.</p>
                 </div>
              ) : method === 'card' ? (
                 <form onSubmit={handlePay} className="space-y-4">
                    <div className="space-y-1">
                       <label className="text-[10px] uppercase text-gray-500 font-bold tracking-wider">Card Number</label>
                       <div className="relative">
                          <input 
                            type="text" 
                            placeholder="0000 0000 0000 0000"
                            value={cardState.number}
                            onChange={(e) => handleCardInput('number', e.target.value)}
                            className="w-full bg-black/50 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white text-sm focus:border-neon-purple focus:ring-1 focus:ring-neon-purple outline-none transition-all font-mono"
                            required
                          />
                          <CreditCard size={16} className="absolute left-3 top-3.5 text-gray-500" />
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-1">
                          <label className="text-[10px] uppercase text-gray-500 font-bold tracking-wider">Expiry</label>
                          <input 
                            type="text" 
                            placeholder="MM/YY"
                            value={cardState.expiry}
                            onChange={(e) => handleCardInput('expiry', e.target.value)}
                            className="w-full bg-black/50 border border-gray-700 rounded-lg py-3 px-4 text-white text-sm focus:border-neon-purple focus:ring-1 focus:ring-neon-purple outline-none transition-all font-mono"
                            required
                          />
                       </div>
                       <div className="space-y-1">
                          <label className="text-[10px] uppercase text-gray-500 font-bold tracking-wider">CVC</label>
                          <div className="relative">
                             <input 
                               type="text" 
                               placeholder="123"
                               value={cardState.cvc}
                               onChange={(e) => handleCardInput('cvc', e.target.value)}
                               className="w-full bg-black/50 border border-gray-700 rounded-lg py-3 px-4 text-white text-sm focus:border-neon-purple focus:ring-1 focus:ring-neon-purple outline-none transition-all font-mono"
                               required
                             />
                             <Lock size={14} className="absolute right-3 top-3.5 text-gray-500" />
                          </div>
                       </div>
                    </div>

                    <div className="space-y-1">
                       <label className="text-[10px] uppercase text-gray-500 font-bold tracking-wider">Name on Card</label>
                       <input 
                         type="text" 
                         placeholder="J. DOE"
                         value={cardState.name}
                         onChange={(e) => handleCardInput('name', e.target.value)}
                         className="w-full bg-black/50 border border-gray-700 rounded-lg py-3 px-4 text-white text-sm focus:border-neon-purple focus:ring-1 focus:ring-neon-purple outline-none transition-all font-mono uppercase"
                         required
                       />
                    </div>

                    <div className="pt-4">
                       <button 
                         type="submit" 
                         disabled={processing}
                         className="w-full bg-white text-black font-bold py-3.5 rounded-lg hover:bg-neon-purple hover:text-white transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                       >
                          {processing ? (
                             <span className="animate-pulse">PROCESSING SECURELY...</span>
                          ) : (
                             <>
                                <Lock size={16} /> PAY $1.99
                             </>
                          )}
                       </button>
                       <p className="text-[10px] text-center text-gray-600 mt-3 flex items-center justify-center gap-1">
                          <Lock size={10} /> 256-BIT ENCRYPTED SSL
                       </p>
                    </div>
                 </form>
              ) : (
                 <div className="space-y-3">
                    <p className="text-xs text-gray-500 mb-2">Select your preferred app:</p>
                    
                    {/* PayPal */}
                    <a 
                      href="https://www.paypal.com/paypalme/" 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex items-center justify-between p-4 bg-[#003087]/10 border border-[#003087]/30 hover:bg-[#003087]/20 rounded-xl group transition-all"
                    >
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#003087] flex items-center justify-center text-white font-bold italic">P</div>
                          <span className="text-[#003087] font-bold group-hover:text-white transition-colors">PayPal</span>
                       </div>
                       <ExternalLink size={16} className="text-[#003087] group-hover:text-white" />
                    </a>

                    {/* Venmo */}
                    <a 
                      href="https://venmo.com/" 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex items-center justify-between p-4 bg-[#008CFF]/10 border border-[#008CFF]/30 hover:bg-[#008CFF]/20 rounded-xl group transition-all"
                    >
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#008CFF] flex items-center justify-center text-white font-bold">V</div>
                          <span className="text-[#008CFF] font-bold group-hover:text-white transition-colors">Venmo</span>
                       </div>
                       <ExternalLink size={16} className="text-[#008CFF] group-hover:text-white" />
                    </a>

                    {/* Cash App */}
                    <a 
                      href="https://cash.app/" 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex items-center justify-between p-4 bg-[#00D632]/10 border border-[#00D632]/30 hover:bg-[#00D632]/20 rounded-xl group transition-all"
                    >
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#00D632] flex items-center justify-center text-white font-bold">$</div>
                          <span className="text-[#00D632] font-bold group-hover:text-white transition-colors">Cash App</span>
                       </div>
                       <ExternalLink size={16} className="text-[#00D632] group-hover:text-white" />
                    </a>

                    {/* Zelle */}
                    <div className="p-4 bg-[#6D1ED4]/10 border border-[#6D1ED4]/30 rounded-xl">
                       <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-[#6D1ED4] flex items-center justify-center text-white font-bold">Z</div>
                             <span className="text-[#6D1ED4] font-bold">Zelle</span>
                          </div>
                          <span className="text-[10px] text-[#6D1ED4] bg-[#6D1ED4]/10 px-2 py-1 rounded">MANUAL TRANSFER</span>
                       </div>
                       <div className="flex items-center gap-2 bg-black/40 p-2 rounded-lg border border-white/5">
                          <div className="flex-1 font-mono text-sm text-gray-300 px-2 truncate">pay@elia.pro</div>
                          <button 
                            onClick={copyZelle}
                            className="p-1.5 hover:bg-white/10 rounded-md text-gray-400 hover:text-white transition-colors"
                          >
                             {copiedZelle ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                          </button>
                       </div>
                       <p className="text-[10px] text-gray-500 mt-2">Send $1.99 to this ID to activate instantly.</p>
                    </div>
                 </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};
