
import React, { useEffect, useState } from 'react';
import { Settings, Save, User, Hash, Link as LinkIcon, Check, Instagram, Music2, Plus, Trash2, ChevronDown, Loader2, ExternalLink } from 'lucide-react';
import { Card } from './ui/Card';
import { BrandSettings } from '../types';
import { DEFAULT_PROFILE } from '../constants';

interface BrandDNAProps {
  profiles: BrandSettings[];
  activeProfileId: string;
  onProfileChange: (id: string) => void;
  onProfileUpdate: (settings: BrandSettings) => void;
  onProfileCreate: () => void;
  onProfileDelete: (id: string) => void;
}

export const BrandDNA: React.FC<BrandDNAProps> = ({ 
  profiles, 
  activeProfileId, 
  onProfileChange, 
  onProfileUpdate, 
  onProfileCreate,
  onProfileDelete
}) => {
  const [formData, setFormData] = useState<BrandSettings>(DEFAULT_PROFILE);
  const [saved, setSaved] = useState(false);
  const [linkingState, setLinkingState] = useState<{ platform: 'tiktok' | 'instagram' | null, status: 'idle' | 'connecting' | 'verifying' | 'success' }>({ platform: null, status: 'idle' });

  useEffect(() => {
    const active = profiles.find(p => p.id === activeProfileId) || profiles[0];
    if (active) setFormData(active);
  }, [activeProfileId, profiles]);

  const handleChange = (field: keyof BrandSettings, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const simulateOAuthLink = (platform: 'tiktok' | 'instagram') => {
    // If already connected, disconnect immediately
    if (formData.connectedAccounts[platform]) {
      setFormData(prev => ({
        ...prev,
        connectedAccounts: { ...prev.connectedAccounts, [platform]: false }
      }));
      setSaved(false);
      return;
    }

    // Start Linking Flow
    setLinkingState({ platform, status: 'connecting' });

    // Simulate opening Auth Window
    const width = 600;
    const height = 700;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    
    // In a real app, this would be the OAuth URL
    const authUrl = platform === 'tiktok' ? 'https://www.tiktok.com/login' : 'https://www.instagram.com/accounts/login/';
    const popup = window.open(authUrl, 'Connect Account', `width=${width},height=${height},top=${top},left=${left}`);

    // Simulate API Polling / "getInstagramTrends" validation logic
    setTimeout(() => {
      if (popup && !popup.closed) popup.close();
      setLinkingState({ platform, status: 'verifying' });
      
      setTimeout(() => {
        setFormData(prev => ({
          ...prev,
          connectedAccounts: { ...prev.connectedAccounts, [platform]: true }
        }));
        setLinkingState({ platform, status: 'success' });
        setSaved(false);
        
        setTimeout(() => {
          setLinkingState({ platform: null, status: 'idle' });
        }, 1500);
      }, 1500);
    }, 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onProfileUpdate(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl mx-auto pb-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold font-mono text-white flex items-center gap-3 glow-text-white">
          <Settings className="text-neon-red" /> BRAND DNA
        </h2>
      </div>

      {/* Profile Selector */}
      <Card noPadding className="mb-8 p-4 bg-gray-900/50 border-gray-700">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="w-full md:w-auto flex-1">
             <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1 block">Active Identity</label>
             <div className="relative">
                <select 
                   value={activeProfileId}
                   onChange={(e) => onProfileChange(e.target.value)}
                   className="w-full bg-black border border-gray-700 text-white rounded-lg p-3 appearance-none focus:border-neon-cyan outline-none font-mono"
                >
                   {profiles.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                   ))}
                </select>
                <ChevronDown className="absolute right-3 top-3.5 text-gray-500 pointer-events-none" size={16} />
             </div>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
             <button 
               onClick={onProfileCreate}
               className="flex-1 md:flex-none flex items-center gap-2 px-4 py-3 bg-gray-800 hover:bg-neon-cyan hover:text-black text-white rounded-lg font-bold text-xs uppercase transition-colors"
             >
                <Plus size={16} /> New Profile
             </button>
             {profiles.length > 1 && (
               <button 
                 onClick={() => {
                   if (window.confirm('Delete this profile?')) onProfileDelete(activeProfileId);
                 }}
                 className="px-4 py-3 bg-gray-800 hover:bg-red-500 text-white rounded-lg transition-colors"
               >
                  <Trash2 size={16} />
               </button>
             )}
          </div>
        </div>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Name Edit */}
        <Card title="PROFILE SETTINGS">
           <div>
              <label className="text-sm font-bold text-gray-400 mb-2 block uppercase">Profile Name</label>
              <input 
                 type="text" 
                 value={formData.name}
                 onChange={(e) => handleChange('name', e.target.value)}
                 className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-3 text-white focus:border-neon-purple outline-none font-bold text-lg"
              />
           </div>
        </Card>

        {/* Connected Accounts Section */}
        <Card title="LINKED PLATFORMS" className="relative">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* TikTok Connect */}
              <div 
                onClick={() => linkingState.status === 'idle' && simulateOAuthLink('tiktok')}
                className={`cursor-pointer p-4 rounded-xl border transition-all duration-300 flex items-center justify-between group ${
                  formData.connectedAccounts.tiktok 
                  ? 'bg-gray-900 border-neon-purple shadow-[0_0_10px_rgba(168,85,247,0.2)]' 
                  : 'bg-black border-gray-800 hover:border-gray-600'
                }`}
              >
                <div className="flex items-center gap-3">
                   <div className={`p-2 rounded-full ${formData.connectedAccounts.tiktok ? 'bg-black text-neon-purple' : 'bg-gray-800 text-gray-500'}`}>
                      <Music2 size={20} />
                   </div>
                   <div>
                      <h4 className={`font-bold ${formData.connectedAccounts.tiktok ? 'text-white' : 'text-gray-400'}`}>TikTok</h4>
                      <p className="text-xs text-gray-600">
                        {linkingState.platform === 'tiktok' && linkingState.status !== 'idle' 
                          ? <span className="text-neon-cyan animate-pulse">{linkingState.status === 'verifying' ? 'Verifying Token...' : 'Connecting...'}</span>
                          : formData.connectedAccounts.tiktok ? 'Connected' : 'Click to Link Account'
                        }
                      </p>
                   </div>
                </div>
                <div>
                   {linkingState.platform === 'tiktok' && linkingState.status !== 'idle' ? (
                     <Loader2 className="animate-spin text-neon-purple" size={16} />
                   ) : (
                     <div className={`w-4 h-4 rounded-full border-2 ${formData.connectedAccounts.tiktok ? 'bg-neon-green border-neon-green' : 'border-gray-600'}`}></div>
                   )}
                </div>
              </div>

              {/* Instagram Connect */}
              <div 
                onClick={() => linkingState.status === 'idle' && simulateOAuthLink('instagram')}
                className={`cursor-pointer p-4 rounded-xl border transition-all duration-300 flex items-center justify-between group ${
                  formData.connectedAccounts.instagram 
                  ? 'bg-gray-900 border-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.2)]' 
                  : 'bg-black border-gray-800 hover:border-gray-600'
                }`}
              >
                <div className="flex items-center gap-3">
                   <div className={`p-2 rounded-full ${formData.connectedAccounts.instagram ? 'bg-black text-pink-500' : 'bg-gray-800 text-gray-500'}`}>
                      <Instagram size={20} />
                   </div>
                   <div>
                      <h4 className={`font-bold ${formData.connectedAccounts.instagram ? 'text-white' : 'text-gray-400'}`}>Instagram</h4>
                      <p className="text-xs text-gray-600">
                        {linkingState.platform === 'instagram' && linkingState.status !== 'idle' 
                          ? <span className="text-neon-cyan animate-pulse">{linkingState.status === 'verifying' ? 'Verifying OAuth...' : 'Connecting...'}</span>
                          : formData.connectedAccounts.instagram ? 'Connected' : 'Click to Link Account'
                        }
                      </p>
                   </div>
                </div>
                <div>
                   {linkingState.platform === 'instagram' && linkingState.status !== 'idle' ? (
                     <Loader2 className="animate-spin text-pink-500" size={16} />
                   ) : (
                     <div className={`w-4 h-4 rounded-full border-2 ${formData.connectedAccounts.instagram ? 'bg-neon-green border-neon-green' : 'border-gray-600'}`}></div>
                   )}
                </div>
              </div>
           </div>
        </Card>

        <Card className="space-y-8">
           {/* Niche Input */}
           <div>
              <label className="flex items-center gap-2 text-sm font-bold text-neon-blue mb-3 uppercase tracking-wider glow-text-blue">
                 <Hash size={16} /> My Niche
              </label>
              <input 
                 type="text" 
                 value={formData.niche}
                 onChange={(e) => handleChange('niche', e.target.value)}
                 className="w-full bg-neon-surface border border-gray-700 rounded-lg p-4 text-white focus:border-neon-purple focus:ring-1 focus:ring-neon-purple focus:shadow-[0_0_15px_rgba(168,85,247,0.3)] outline-none transition-all placeholder-gray-600 font-mono"
                 placeholder="e.g., Luxury Streetwear, Tech Reviews, Cozy Gaming..."
              />
           </div>

           {/* Personality Dropdown */}
           <div>
              <label className="flex items-center gap-2 text-sm font-bold text-neon-blue mb-3 uppercase tracking-wider glow-text-blue">
                 <User size={16} /> Caption Personality
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                 {['Sassy', 'Stoic', 'Informative', 'POV'].map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => handleChange('personality', p)}
                      className={`py-3 px-4 rounded-lg border text-sm font-bold transition-all btn-glow ${
                         formData.personality === p 
                         ? 'bg-neon-purple text-white border-neon-purple shadow-[0_0_15px_rgba(168,85,247,0.4)] transform scale-105' 
                         : 'bg-black border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white'
                      }`}
                    >
                       {p}
                    </button>
                 ))}
              </div>
           </div>

           {/* Link Toggle */}
           <div className="flex items-center justify-between p-4 bg-gray-900/40 rounded-xl border border-gray-800 hover:border-gray-600 transition-colors">
              <div className="flex items-center gap-3">
                 <div className={`p-2 rounded-full ${formData.includeLinkInBio ? 'bg-neon-green/20 text-neon-green shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-gray-800 text-gray-500'}`}>
                    <LinkIcon size={20} />
                 </div>
                 <div>
                    <p className="font-bold text-white text-sm">Call-to-Action</p>
                    <p className="text-xs text-gray-500">Append "Link in Bio" to generated captions</p>
                 </div>
              </div>
              <button
                 type="button"
                 onClick={() => handleChange('includeLinkInBio', !formData.includeLinkInBio)}
                 className={`w-14 h-8 rounded-full relative transition-all duration-300 ${
                   formData.includeLinkInBio 
                   ? 'bg-neon-green shadow-[0_0_10px_rgba(16,185,129,0.5)]' 
                   : 'bg-gray-700'
                 }`}
              >
                 <div className={`absolute top-1 left-1 bg-white w-6 h-6 rounded-full transition-transform duration-300 shadow-sm ${formData.includeLinkInBio ? 'translate-x-6' : 'translate-x-0'}`}></div>
              </button>
           </div>
        </Card>
        
        <button
           type="submit"
           className="w-full bg-white text-black font-bold font-mono uppercase tracking-wider py-4 rounded-xl hover:bg-neon-purple hover:text-white hover:shadow-[0_0_25px_rgba(168,85,247,0.6)] transition-all flex items-center justify-center gap-2 transform active:scale-95 btn-glow"
        >
           {saved ? (
              <> <Check className="text-green-500" /> PROFILE SAVED </>
           ) : (
              <> <Save size={18} /> SAVE CHANGES </>
           )}
        </button>
      </form>
    </div>
  );
};
