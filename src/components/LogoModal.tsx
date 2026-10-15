import React, { useState } from 'react';
import {
  Download,
  Copy,
  Check,
  Sparkles,
  ExternalLink,
  Layers,
  Palette,
  Eye,
  Maximize2,
  Share2,
  X,
  ShieldCheck,
} from 'lucide-react';

interface LogoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LogoModal: React.FC<LogoModalProps> = ({ isOpen, onClose }) => {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [previewFilter, setPreviewFilter] = useState<'normal' | 'glow' | 'contrast'>('glow');

  if (!isOpen) return null;

  const logoSrc = '/src/assets/images/sheikh_farid_logo_1792083190919.jpg';

  const brandColors = [
    { name: 'Emerald Neon', hex: '#10b981', desc: 'প্রাণবন্ত সবুজ ও প্রবৃদ্ধি' },
    { name: 'Electric Cyan', hex: '#06b6d4', desc: 'উচ্চপ্রযুক্তি ও গতিশীলতা' },
    { name: 'Obsidian Slate', hex: '#020617', desc: 'মিনিম্যালিস্ট গভীর ব্যাকগ্রাউন্ড' },
    { name: 'Metallic Chrome', hex: '#e2e8f0', desc: 'প্রিমিয়াম বেভেল ও ফ্রেম' },
  ];

  const handleCopyColor = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const handleDownloadLogo = async (format: 'png' | 'jpg') => {
    setDownloading(true);
    try {
      const response = await fetch(logoSrc);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `sheikh-farid-studio-logo.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Download error:', e);
    } finally {
      setDownloading(false);
    }
  };

  const handleCopyLogoUrl = () => {
    navigator.clipboard.writeText(window.location.origin + logoSrc);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full bg-slate-800 p-2 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          title="বন্ধ করুন"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 p-0.5 shadow-lg shadow-emerald-950/50">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950">
              <Sparkles className="h-5 w-5 text-emerald-400" />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              শেখ ফরিদ স্টুডিও অফিসিয়াল লোগো
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[11px] font-semibold text-emerald-300 border border-emerald-500/30">
                Official Brand Kit
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Sheikh Farid AI Studio & Project Hub • Vector-grade 3D Monogram
            </p>
          </div>
        </div>

        {/* Logo Visual Stage */}
        <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border border-slate-800/80 bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900/60 p-6 sm:p-8 relative overflow-hidden group">
          {/* Ambient Glow */}
          <div className="absolute -inset-10 bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-teal-500/10 blur-3xl rounded-full pointer-events-none" />

          {/* Logo Container */}
          <div className="relative z-10 flex flex-col items-center">
            <div
              className={`relative overflow-hidden rounded-2xl border transition-all duration-500 shadow-2xl ${
                previewFilter === 'glow'
                  ? 'border-emerald-500/40 shadow-emerald-500/20'
                  : previewFilter === 'contrast'
                  ? 'border-cyan-500/50 shadow-cyan-500/30 brightness-110'
                  : 'border-slate-800 shadow-black/80'
              }`}
            >
              <img
                src={logoSrc}
                alt="Sheikh Farid AI Studio Official Logo"
                referrerPolicy="no-referrer"
                className="h-64 w-64 sm:h-72 sm:w-72 object-cover rounded-2xl transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </div>

            {/* Sub-label */}
            <div className="mt-4 text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-800/80 px-3 py-1 text-xs font-semibold text-slate-300 border border-slate-700">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                ১০২৪×১০২৪ আল্ট্রা-এইচডি স্টুডিও ব্রান্ডিং মার্ক
              </span>
            </div>
          </div>

          {/* Preview Filters */}
          <div className="mt-4 flex items-center gap-2 z-10">
            <span className="text-[11px] text-slate-400">প্রিভিউ মোড:</span>
            <button
              onClick={() => setPreviewFilter('glow')}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                previewFilter === 'glow'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-800/60 text-slate-400 hover:text-white'
              }`}
            >
              গ্লোয়িং অ্যাম্বিয়েন্ট
            </button>
            <button
              onClick={() => setPreviewFilter('normal')}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                previewFilter === 'normal'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-800/60 text-slate-400 hover:text-white'
              }`}
            >
              ক্লাসিক ফ্ল্যাট
            </button>
            <button
              onClick={() => setPreviewFilter('contrast')}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                previewFilter === 'contrast'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-800/60 text-slate-400 hover:text-white'
              }`}
            >
              হাইপার কনট্রাস্ট
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => handleDownloadLogo('png')}
            disabled={downloading}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 px-4 py-3 font-semibold text-white shadow-lg shadow-emerald-900/30 transition-all text-xs sm:text-sm active:scale-[0.98]"
          >
            <Download className="h-4 w-4" />
            <span>{downloading ? 'ডাউনলোড হচ্ছে...' : 'PNG লোগো ডাউনলোড'}</span>
          </button>

          <button
            onClick={() => handleDownloadLogo('jpg')}
            disabled={downloading}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-750 px-4 py-3 font-semibold text-slate-200 transition-colors text-xs sm:text-sm"
          >
            <Download className="h-4 w-4 text-cyan-400" />
            <span>JPG মাস্টার ফাইল</span>
          </button>

          <button
            onClick={handleCopyLogoUrl}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-750 px-4 py-3 font-semibold text-slate-200 transition-colors text-xs sm:text-sm"
          >
            {copiedLink ? (
              <>
                <Check className="h-4 w-4 text-emerald-400" />
                <span className="text-emerald-400">লিংক কপি হয়েছে!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 text-slate-400" />
                <span>লোগো পাথ কপি</span>
              </>
            )}
          </button>
        </div>

        {/* Brand Palette & Typography */}
        <div className="mt-6 space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <Palette className="h-4 w-4 text-cyan-400" />
            <span>ব্র্যান্ড কালার প্যালেট (ক্লিক করে হেক্স কোড কপি করুন):</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {brandColors.map((color) => {
              const isCopied = copiedColor === color.hex;
              return (
                <button
                  key={color.hex}
                  onClick={() => handleCopyColor(color.hex)}
                  className="group relative flex flex-col items-start rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-left transition-all hover:border-slate-700 hover:bg-slate-900"
                >
                  <div className="flex items-center gap-2 w-full">
                    <span
                      className="h-4 w-4 rounded-full border border-white/20 shadow-sm"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span className="font-mono text-xs font-bold text-slate-200">
                      {color.hex}
                    </span>
                    {isCopied && (
                      <Check className="h-3.5 w-3.5 text-emerald-400 ml-auto" />
                    )}
                  </div>
                  <span className="mt-1 text-[11px] font-medium text-slate-300">
                    {color.name}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {color.desc}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Logo Concept Explainer */}
          <div className="rounded-xl border border-slate-800/80 bg-slate-950/50 p-4 text-xs text-slate-400 space-y-1.5 leading-relaxed">
            <div className="font-semibold text-slate-200 flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-emerald-400" />
              <span>লোগো আর্কিটেকচার ও ডিজাইনের বিশেষত্ব:</span>
            </div>
            <ul className="list-disc list-inside space-y-1 pl-1 text-[11px] text-slate-400">
              <li><strong className="text-slate-300">হেক্সাগনাল ফ্রেমওয়ার্ক:</strong> শক্তিশালী সফটওয়্যার আর্কিটেকচার ও নিরাপত্তা ফ্রেম নির্দেশক।</li>
              <li><strong className="text-slate-300">SF মনোগ্রাম:</strong> শেখ ফরিদ (Sheikh Farid) নামের আদ্যক্ষরের থ্রিডি মেটালিক ও নিয়ন রূপ।</li>
              <li><strong className="text-slate-300">ওয়েভফর্ম ও অ্যাপারচার লেন্স:</strong> ৩০-সেকেন্ড অডিও গান ইঞ্জিন ও ফুল-এইচডি ৬০fps ভিডিও/লাইভ ব্রডকাস্টিং ক্ষমতার প্রতীক।</li>
              <li><strong className="text-slate-300">রিয়েল-টাইম ওয়াটারমার্ক:</strong> লাইভ স্টুডিও এবং ভিডিও এক্সপোর্ট ক্যানভাসে স্বয়ংক্রিয় ব্র্যান্ড ওয়াটারমার্ক হিসেবে সংযুক্ত।</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
