import React from 'react';
import {
  Video,
  Film,
  Sparkles,
  FileText,
  Mail,
  FolderGit2,
  ShieldCheck,
  Download,
  User,
  CheckCircle2,
  Terminal,
  Music,
  Radio,
  Share2,
} from 'lucide-react';
import { ActiveTab } from '../types';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenArchitect: () => void;
  onOpenLogoModal?: () => void;
  onOpenShareModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenArchitect,
  onOpenLogoModal,
  onOpenShareModal,
}) => {
  const tabs = [
    {
      id: 'zero-cost-video-creator' as ActiveTab,
      label: 'ফ্রি ভিডিও মেকার',
      labelEn: 'Zero-Cost Video',
      icon: Film,
      badge: '$০ খরচ',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    },
    {
      id: 'live-studio' as ActiveTab,
      label: 'লাইভ ব্রডকাস্ট স্টুডিও',
      labelEn: 'Live WebRTC Studio',
      icon: Radio,
      badge: 'WebRTC ৬০fps',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    },
    {
      id: '30s-audio-engine' as ActiveTab,
      label: '৩০সে. অডিও গান ইঞ্জিন',
      labelEn: '30s Audio Studio',
      icon: Music,
      badge: 'গান তৈরি',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    },
    {
      id: 'video-analyzer' as ActiveTab,
      label: 'ভিডিও এনালাইসিস',
      labelEn: 'Video AI',
      icon: Video,
      badge: 'Gemini AI',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    },
    {
      id: 'ai-lab' as ActiveTab,
      label: 'এআই ল্যাব',
      labelEn: 'AI Lab',
      icon: Sparkles,
      badge: '0ms Cache',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    },
    {
      id: 'citizendesk' as ActiveTab,
      label: 'সার্ভিস সরকার',
      labelEn: 'CitizenDesk BD',
      icon: FileText,
      badge: 'জিডি ও হটলাইন',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    },
    {
      id: 'gmail' as ActiveTab,
      label: 'জিমেইল ওয়ার্কস্পেস',
      labelEn: 'Gmail Workspace',
      icon: Mail,
      badge: 'লেবেল ফিল্টার',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    },
    {
      id: 'project-hub' as ActiveTab,
      label: 'প্রজেক্ট হাব',
      labelEn: 'Projects Hub',
      icon: FolderGit2,
      badge: 'মিনি মাইক্রোসফট',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    },
    {
      id: 'vpn-studio' as ActiveTab,
      label: 'ভিপিএন ও প্রক্সি ল্যাব',
      labelEn: 'VPN & Proxy Lab',
      icon: Terminal,
      badge: '3X-UI & V2Ray',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    },
  ];

  return (
    <header className="no-print sticky top-0 z-40 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      {/* Top Banner */}
      <div className="border-b border-slate-800/60 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-cyan-950/40 px-4 py-1.5 text-xs text-slate-300">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-2.5 py-0.5 font-medium text-emerald-300 border border-emerald-500/30">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              PWA 100/100 Ready
            </span>
            <span className="hidden sm:inline text-slate-400">•</span>
            <span className="hidden sm:inline text-slate-300">
              🇧🇩 মিনি মাইক্রোসফট • হাই-প্রিসিশন লোকাল এআই • গভটেক ইকোসিস্টেম
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden md:flex items-center gap-1 text-slate-400 text-xs">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              Gemini 3.1 Pro Preview Active
            </span>
            {onOpenLogoModal && (
              <button
                onClick={onOpenLogoModal}
                className="flex items-center gap-1.5 rounded-md bg-emerald-950/60 hover:bg-emerald-900/80 px-2.5 py-0.5 text-xs font-semibold text-emerald-300 transition-colors border border-emerald-500/40"
              >
                <Sparkles className="h-3 w-3 text-emerald-400" />
                <span>লোগো কিট</span>
              </button>
            )}
            <button
              onClick={onOpenArchitect}
              className="flex items-center gap-1.5 rounded-md bg-slate-800 hover:bg-slate-700 px-2.5 py-0.5 text-xs font-medium text-slate-200 transition-colors border border-slate-700"
            >
              <User className="h-3 w-3 text-cyan-400" />
              <span>স্থপতি: শেখ ফরিদ</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div
            onClick={() => (onOpenLogoModal ? onOpenLogoModal() : setActiveTab('video-analyzer'))}
            className="group flex cursor-pointer items-center gap-3 select-none"
            title="শেখ ফরিদ স্টুডিও অফিসিয়াল লোগো ও ব্র্যান্ড কিট দেখুন"
          >
            <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-500/40 bg-slate-950 p-0.5 shadow-lg shadow-emerald-950/60 transition-all duration-300 group-hover:scale-105 group-hover:border-emerald-400 group-hover:shadow-emerald-500/20">
              <img
                src="/src/assets/images/sheikh_farid_logo_1792083190919.jpg"
                alt="Sheikh Farid AI Studio Logo"
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover rounded-[10px]"
              />
              <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-slate-950">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping opacity-75" />
                <span className="absolute h-2 w-2 rounded-full bg-emerald-500" />
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold tracking-tight text-white sm:text-lg group-hover:text-emerald-300 transition-colors">
                  Sheikh Farid AI Studio
                </h1>
                <span className="hidden lg:inline-block rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
                  v3.1 Hub
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Government & AI Productivity Suite
              </p>
            </div>
          </div>

          {/* Navigation Tabs - Desktop */}
          <nav className="hidden xl:flex items-center gap-1 overflow-x-auto py-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group relative flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-slate-800 text-white shadow-sm ring-1 ring-slate-700'
                      : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 transition-colors ${
                      isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  <span>{tab.label}</span>
                  <span
                    className={`rounded border px-1.5 py-0.2 text-[9px] font-medium ${tab.badgeColor}`}
                  >
                    {tab.badge}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Right Action */}
          <div className="flex items-center gap-2">
            {onOpenLogoModal && (
              <button
                onClick={onOpenLogoModal}
                title="অফিসিয়াল লোগো দেখুন ও ডাউনলোড করুন"
                className="flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-950/40 hover:bg-emerald-900/60 px-3 py-1.5 text-xs font-semibold text-emerald-300 transition-colors"
              >
                <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                <span className="hidden sm:inline">লোগো কিট</span>
              </button>
            )}
            {onOpenShareModal && (
              <button
                onClick={onOpenShareModal}
                title="বিভিন্ন সোশ্যাল মিডিয়ায় অ্যাপ লিংক ও লোগো কার্ড শেয়ার করুন"
                className="flex items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-950/40 hover:bg-cyan-900/60 px-3 py-1.5 text-xs font-semibold text-cyan-300 transition-colors"
              >
                <Share2 className="h-3.5 w-3.5 text-cyan-400" />
                <span className="hidden sm:inline">শেয়ার</span>
              </button>
            )}
            <button
              onClick={() => window.print()}
              title="বর্তমান পৃষ্ঠা প্রিন্ট করুন"
              className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors"
            >
              <Download className="h-3.5 w-3.5 text-slate-400" />
              <span className="hidden sm:inline">প্রিন্ট / ড্রাফট</span>
            </button>
          </div>
        </div>

        {/* Mobile / Tablet Horizontal Scroll Tab Bar */}
        <div className="flex xl:hidden overflow-x-auto border-t border-slate-800/80 py-2 scrollbar-none gap-1.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-600/20 text-emerald-300 ring-1 ring-emerald-500/40'
                    : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
