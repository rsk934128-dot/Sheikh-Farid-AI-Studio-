import React, { useState } from 'react';
import {
  Share2,
  Copy,
  Check,
  X,
  ExternalLink,
  MessageCircle,
  Twitter,
  Facebook,
  Send,
  Linkedin,
  ShieldCheck,
  Eye,
  Globe,
  Sparkles,
} from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [activePlatform, setActivePlatform] = useState<'whatsapp' | 'facebook' | 'twitter' | 'telegram'>('whatsapp');

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://sheikhfarid-studio.app';
  const originUrl = typeof window !== 'undefined' ? window.location.origin : 'https://sheikhfarid-studio.app';
  const logoUrl = `${originUrl}/logo.jpg`;

  const shareTitle = 'Sheikh Farid AI Studio & Project Hub (শেখ ফরিদ এআই স্টুডিও)';
  const shareDescription = 'মিনি মাইক্রোসফট • হাই-প্রিসিশন লোকাল এআই • গভটেক ইকোসিস্টেম • $০ খরচে ৬০fps ভিডিও ও অডিও স্টুডিও';
  const shareText = `${shareTitle} - ${shareDescription}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareDescription,
          url: currentUrl,
        });
      } catch (err) {
        console.log('Share canceled or not supported:', err);
      }
    } else {
      handleCopyLink();
    }
  };

  const shareLinks = [
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-emerald-600 hover:bg-emerald-500 text-white',
      badge: 'হোয়াটসঅ্যাপ',
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + '\n\n' + currentUrl)}`,
    },
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-blue-600 hover:bg-blue-500 text-white',
      badge: 'ফেসবুক',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
    },
    {
      name: 'Twitter / X',
      icon: Twitter,
      color: 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700',
      badge: 'টুইটার (X)',
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`,
    },
    {
      name: 'Telegram',
      icon: Send,
      color: 'bg-sky-600 hover:bg-sky-500 text-white',
      badge: 'টেলিগ্রাম',
      url: `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`,
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'bg-indigo-600 hover:bg-indigo-500 text-white',
      badge: 'লিঙ্কডইন',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full bg-slate-800 p-2 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          title="বন্ধ করুন"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-500 p-0.5 shadow-lg shadow-cyan-950/50">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950">
              <Share2 className="h-5 w-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              শেয়ার ও প্রিভিউ কার্ড
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[11px] font-semibold text-emerald-300 border border-emerald-500/30">
                OpenGraph Verified
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              বিভিন্ন সোশ্যাল মিডিয়ায় শেয়ার করলে লিংকের সাথে অ্যাপের লোগো প্রদর্শিত হবে
            </p>
          </div>
        </div>

        {/* Simulated Social Share Preview Box */}
        <div className="mt-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Eye className="h-4 w-4 text-cyan-400" />
              সোশ্যাল প্রিভিউ কার্ড (যেমন দেখাবে WhatsApp / Facebook-এ):
            </span>
            <div className="flex items-center gap-1 text-[11px]">
              <button
                onClick={() => setActivePlatform('whatsapp')}
                className={`px-2 py-0.5 rounded font-medium ${
                  activePlatform === 'whatsapp'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                WhatsApp
              </button>
              <button
                onClick={() => setActivePlatform('facebook')}
                className={`px-2 py-0.5 rounded font-medium ${
                  activePlatform === 'facebook'
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Facebook
              </button>
            </div>
          </div>

          {/* Social Card Mockup */}
          <div className="rounded-2xl border border-slate-700/80 bg-slate-950 p-4 shadow-xl">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              {/* App Logo Display */}
              <div className="relative h-28 w-28 sm:h-32 sm:w-32 shrink-0 rounded-xl overflow-hidden border border-emerald-500/40 bg-slate-900 shadow-lg shadow-emerald-950/40">
                <img
                  src="/src/assets/images/sheikh_farid_logo_1792083190919.jpg"
                  alt="Sheikh Farid AI Studio Official Logo"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
                <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1 py-0.5 text-[9px] font-bold text-emerald-400 border border-emerald-500/30">
                  SF LOGO
                </span>
              </div>

              {/* Card Meta Content */}
              <div className="flex-1 space-y-1 text-left">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 uppercase tracking-wide">
                  <Globe className="h-3 w-3 text-emerald-400" />
                  <span>{new URL(currentUrl).hostname}</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-semibold">Verified App</span>
                </div>
                <h4 className="text-sm sm:text-base font-bold text-white leading-snug">
                  {shareTitle}
                </h4>
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {shareDescription}
                </p>
                <div className="pt-1 flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                  <span className="inline-flex items-center gap-1 text-emerald-400">
                    <ShieldCheck className="h-3 w-3" />
                    og:image 1024x1024 HD
                  </span>
                  <span>•</span>
                  <span>OpenGraph 2.0</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 1-Click Share Platforms */}
        <div className="mt-6 space-y-3">
          <span className="text-xs font-semibold text-slate-300">
            ১-ক্লিকে যেকোনো প্লাটফর্মে শেয়ার করুন:
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {shareLinks.map((platform) => {
              const Icon = platform.icon;
              return (
                <a
                  key={platform.name}
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-center gap-2 rounded-xl py-2.5 px-3 text-xs font-semibold transition-transform active:scale-[0.98] ${platform.color}`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{platform.badge}</span>
                </a>
              );
            })}

            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <button
                onClick={handleNativeShare}
                className="flex items-center justify-center gap-2 rounded-xl border border-cyan-500/40 bg-cyan-950/60 hover:bg-cyan-900/80 py-2.5 px-3 text-xs font-semibold text-cyan-300 transition-colors"
              >
                <Share2 className="h-4 w-4" />
                <span>ডিভাইস শেয়ার মেন্যু</span>
              </button>
            )}
          </div>
        </div>

        {/* Copy Link Section */}
        <div className="mt-5 space-y-2">
          <span className="text-xs font-semibold text-slate-300">
            ওয়েবসাইট লিংক কপি করুন:
          </span>
          <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 p-2">
            <input
              type="text"
              readOnly
              value={currentUrl}
              className="flex-1 bg-transparent px-2 text-xs text-slate-300 font-mono focus:outline-none"
            />
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 text-xs font-bold text-white transition-colors shrink-0"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  <span>কপি হয়েছে!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>লিংক কপি</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Technical Explainer */}
        <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 text-xs text-slate-400 space-y-1 leading-relaxed">
          <div className="font-semibold text-slate-200 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
            <span>কীভাবে লিংক আইকন ও লোগো কাজ করে:</span>
          </div>
          <p className="text-[11px]">
            • <strong>ব্রাউজার ট্যাব ও লিংক আইকন (Favicon):</strong> অ্যাপটি ব্রাউজারে ওপেন করলে ট্যাবের বামপাশে স্বয়ংক্রিয়ভাবে শেখ ফরিদ স্টুডিওর অফিসিয়াল লোগো আইকন প্রদর্শিত হয়।
          </p>
          <p className="text-[11px]">
            • <strong>সোশ্যাল শেয়ার প্রিভিউ (OpenGraph & Twitter Cards):</strong> ফেসবুক, হোয়াটসঅ্যাপ, টেলিগ্রাম, কিংবা এক্স-এ লিংকটি পেস্ট করা মাত্র রোবট ক্রলার স্বয়ংক্রিয়ভাবে ১০২৪×১০২৪ মেটালিক নিয়ন লোগো এবং বাংলা সারসংক্ষেপ প্রদর্শন করবে।
          </p>
        </div>
      </div>
    </div>
  );
};
