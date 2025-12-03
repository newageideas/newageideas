import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
// Replace legacy ScanAndScore with the new ViralEngine
import { ViralEngine } from './components/ViralEngine';
import { TheLab } from './components/TheLab';
import { CompetitorSpy } from './components/CompetitorSpy';
import { BrandDNA } from './components/BrandDNA';
import { UpgradeModal } from './components/UpgradeModal';
import { Tab, LyraAnalysisResult, BrandSettings } from './types';
import { DEFAULT_PROFILE } from './constants';

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<Tab>(Tab.SCAN_SCORE);
  const [result, setResult] = useState<LyraAnalysisResult | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Profile Management State
  const [profiles, setProfiles] = useState<BrandSettings[]>(() => {
    try {
      const saved = localStorage.getItem('elia_profiles');
      return saved ? JSON.parse(saved) : [DEFAULT_PROFILE];
    } catch (e) {
      return [DEFAULT_PROFILE];
    }
  });
  
  const [activeProfileId, setActiveProfileId] = useState<string>(() => {
    return localStorage.getItem('elia_active_profile_id') || 'default';
  });

  // Derived state for active settings - safe fallback
  const activeSettings = profiles.find(p => p.id === activeProfileId) || profiles[0] || DEFAULT_PROFILE;

  useEffect(() => {
    localStorage.setItem('elia_profiles', JSON.stringify(profiles));
  }, [profiles]);

  useEffect(() => {
    localStorage.setItem('elia_active_profile_id', activeProfileId);
  }, [activeProfileId]);

  const handleUpdateProfile = (updated: BrandSettings) => {
    setProfiles(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  const handleCreateProfile = () => {
    const newId = Date.now().toString();
    const newProfile = { ...DEFAULT_PROFILE, id: newId, name: 'New Brand Identity' };
    setProfiles(prev => [...prev, newProfile]);
    setActiveProfileId(newId);
    setCurrentTab(Tab.BRAND_DNA); // Switch to settings to edit
  };

  const handleDeleteProfile = (id: string) => {
    if (profiles.length <= 1) return; // Prevent deleting last profile
    const newProfiles = profiles.filter(p => p.id !== id);
    setProfiles(newProfiles);
    if (activeProfileId === id) {
       setActiveProfileId(newProfiles[0]?.id || 'default');
    }
  };

  return (
    <div className="min-h-screen bg-lyra-bg text-white pb-20 selection:bg-neon-cyan selection:text-black font-sans">
      <Navbar 
        currentTab={currentTab} 
        onTabChange={setCurrentTab} 
        disabled={false} // ViralEngine handles its own loading state
        onUpgradeClick={() => setShowUpgradeModal(true)}
      />

      <main className="container max-w-6xl mx-auto px-4 pt-28">
        
        {/* TAB 1: VIRAL ENGINE (Formerly Scan & Score) */}
        <div className={currentTab === Tab.SCAN_SCORE ? 'block' : 'hidden'}>
          <ViralEngine 
             brandSettings={activeSettings}
             onAnalysisComplete={(res) => {
                // ViralEngine displays its own results, but we can log or store them here if needed
                console.log("Viral Analysis Complete:", res);
             }}
          />
        </div>

        {/* TAB 2: THE LAB (Legacy view, optional) */}
        <div className={currentTab === Tab.THE_LAB ? 'block' : 'hidden'}>
           {result ? (
             <TheLab result={result} />
           ) : (
             <div className="flex flex-col items-center justify-center min-h-[500px] text-lyra-surface animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-lyra-surface/50 flex items-center justify-center mb-4">
                  <span className="text-2xl opacity-50">🧪</span>
                </div>
                <p className="font-mono text-xl mb-4 text-gray-500">LAB_OFFLINE</p>
                <button onClick={() => setCurrentTab(Tab.SCAN_SCORE)} className="text-neon-cyan hover:text-white underline font-mono tracking-wider transition-colors">
                  INITIATE SCAN IN VIRAL ENGINE
                </button>
             </div>
           )}
        </div>

        {/* TAB 3: COMPETITOR SPY */}
        <div className={currentTab === Tab.COMPETITOR_SPY ? 'block' : 'hidden'}>
           {result ? (
             <CompetitorSpy result={result} />
           ) : (
             <div className="flex flex-col items-center justify-center min-h-[500px] text-lyra-surface animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-lyra-surface/50 flex items-center justify-center mb-4">
                  <span className="text-2xl opacity-50">🕵️</span>
                </div>
                <p className="font-mono text-xl mb-4 text-gray-500">NO TARGET DATA</p>
                <button onClick={() => setCurrentTab(Tab.SCAN_SCORE)} className="text-neon-cyan hover:text-white underline font-mono tracking-wider transition-colors">
                  INITIATE SCAN
                </button>
             </div>
           )}
        </div>

        {/* TAB 4: BRAND DNA */}
        <div className={currentTab === Tab.BRAND_DNA ? 'block' : 'hidden'}>
           <BrandDNA 
             profiles={profiles}
             activeProfileId={activeProfileId}
             onProfileChange={setActiveProfileId}
             onProfileUpdate={handleUpdateProfile}
             onProfileCreate={handleCreateProfile}
             onProfileDelete={handleDeleteProfile}
           />
        </div>

      </main>
      
      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
         <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-neon-cyan/5 blur-[120px] rounded-full animate-pulse-slow"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-neon-magenta/5 blur-[120px] rounded-full animate-pulse-slow"></div>
      </div>

      <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} />
    </div>
  );
};

export default App;