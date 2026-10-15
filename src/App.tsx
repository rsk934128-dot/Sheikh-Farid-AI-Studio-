import React, { useState, useEffect } from 'react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Header } from './components/Header';
import { ZeroCostVideoStudio } from './components/ZeroCostVideoStudio';
import { ThirtySecondAudioStudio } from './components/ThirtySecondAudioStudio';
import { LiveBroadcastStudio } from './components/LiveBroadcastStudio';
import { VideoAnalyzer } from './components/VideoAnalyzer';
import { AILab } from './components/AILab';
import { CitizenDesk } from './components/CitizenDesk';
import { GmailWorkspace } from './components/GmailWorkspace';
import { ProjectHub } from './components/ProjectHub';
import { VpnStudio } from './components/VpnStudio';
import { ArchitectModal } from './components/ArchitectModal';
import { LogoModal } from './components/LogoModal';
import { ShareModal } from './components/ShareModal';
import { ActiveTab } from './types';
import { Wifi, WifiOff, Sparkles, Download, Share2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('zero-cost-video-creator');
  const [appliedAudioTrack, setAppliedAudioTrack] = useState<{
    title: string;
    blob?: Blob;
    url?: string;
    presetKey: string;
  } | null>(null);
  const [isArchitectOpen, setIsArchitectOpen] = useState<boolean>(false);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState<boolean>(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => {
        setDeferredPrompt(null);
        setShowInstallBanner(false);
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Offline Alert if network drops */}
      {!isOnline && (
        <div className="no-print bg-amber-500/20 border-b border-amber-500/30 px-4 py-2 text-center text-xs text-amber-200 flex items-center justify-center gap-2">
          <WifiOff className="h-4 w-4 text-amber-400" />
          <span>অফলাইন মোড সক্রিয়: স্থানীয় ক্যাশ ও সংরক্ষিত ড্রাফট নিরবচ্ছিন্নভাবে ব্যবহারযোগ্য।</span>
        </div>
      )}

      {/* PWA Install Banner */}
      {showInstallBanner && (
        <div className="no-print bg-gradient-to-r from-emerald-900 via-teal-900 to-cyan-900 border-b border-emerald-500/30 px-4 py-2 text-xs text-emerald-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-emerald-400" />
            <span>Sheikh Farid AI Studio অ্যাপটি আপনার ডিভাইসে ইনস্টল করুন (PWABuilder 100/100)।</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleInstallClick}
              className="rounded-lg bg-emerald-500 hover:bg-emerald-400 px-3 py-1 font-bold text-slate-950 text-xs shadow-md transition-colors"
            >
              ইনস্টল করুন
            </button>
            <button
              onClick={() => setShowInstallBanner(false)}
              className="text-emerald-300 hover:text-white text-xs"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenArchitect={() => setIsArchitectOpen(true)}
        onOpenLogoModal={() => setIsLogoModalOpen(true)}
        onOpenShareModal={() => setIsShareModalOpen(true)}
      />

      {/* Active Tab View */}
      <main className="flex-1 pb-16">
        {activeTab === 'zero-cost-video-creator' && (
          <ZeroCostVideoStudio
            initialAudioTrack={appliedAudioTrack}
            onOpenAudioStudio={() => setActiveTab('30s-audio-engine')}
          />
        )}
        {activeTab === 'live-studio' && (
          <LiveBroadcastStudio
            onOpenAudioEngine={() => setActiveTab('30s-audio-engine')}
          />
        )}
        {activeTab === '30s-audio-engine' && (
          <ThirtySecondAudioStudio
            onApplyToVideoStudio={(track) => {
              setAppliedAudioTrack(track);
              setActiveTab('zero-cost-video-creator');
            }}
          />
        )}
        {activeTab === 'video-analyzer' && <VideoAnalyzer />}
        {activeTab === 'ai-lab' && <AILab />}
        {activeTab === 'citizendesk' && <CitizenDesk />}
        {activeTab === 'gmail' && <GmailWorkspace />}
        {activeTab === 'project-hub' && (
          <ProjectHub onSelectProjectTab={(tab) => setActiveTab(tab as ActiveTab)} />
        )}
        {activeTab === 'vpn-studio' && <VpnStudio />}
      </main>

      {/* Footer */}
      <footer className="no-print border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">Sheikh Farid AI Studio & Project Hub</span>
            <span>•</span>
            <span>মিনি মাইক্রোসফট • গভটেক ইকোসিস্টেম</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
            >
              🔗 শেয়ার ও লিংক কার্ড
            </button>
            <span>•</span>
            <button
              onClick={() => setIsLogoModalOpen(true)}
              className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
            >
              🎨 অফিসিয়াল স্টুডিও লোগো
            </button>
            <span>•</span>
            <button
              onClick={() => setIsArchitectOpen(true)}
              className="hover:text-emerald-400 transition-colors"
            >
              সফটওয়্যার স্থপতি
            </button>
            <span>•</span>
            <span>MIT License</span>
          </div>
        </div>
      </footer>

      {/* Architect Profile Modal */}
      <ArchitectModal
        isOpen={isArchitectOpen}
        onClose={() => setIsArchitectOpen(false)}
      />

      {/* Studio Official Logo Modal */}
      <LogoModal
        isOpen={isLogoModalOpen}
        onClose={() => setIsLogoModalOpen(false)}
      />

      {/* Studio Social Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />

      {/* Vercel Speed Insights */}
      <SpeedInsights />
    </div>
  );
}
