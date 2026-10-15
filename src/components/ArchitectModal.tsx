import React from 'react';
import {
  User,
  Github,
  Mail,
  ShieldCheck,
  CheckCircle,
  ExternalLink,
  Award,
  Code2,
} from 'lucide-react';

interface ArchitectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectModal: React.FC<ArchitectModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg bg-slate-800 p-1.5 text-slate-400 hover:text-white transition-colors"
        >
          ✕
        </button>

        {/* Profile Header */}
        <div className="flex items-center gap-4 border-b border-slate-800 pb-5">
          <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-emerald-500/40 bg-slate-950 p-1 shadow-xl shadow-emerald-950/60 overflow-hidden">
            <img
              src="/src/assets/images/sheikh_farid_logo_1792083190919.jpg"
              alt="Sheikh Farid Studio Official Logo"
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover rounded-xl"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white">
                মোহাম্মদ শেখ ফরিদ (Sheikh Farid)
              </h3>
            </div>
            <p className="text-xs font-semibold text-emerald-400">
              Lead Software Architect & GovTech Systems Pioneer
            </p>
            <p className="text-[11px] text-slate-400">
              মিনি মাইক্রোসফট • হাই-প্রিসিশন লোকাল এআই • গভটেক ইকোসিস্টেম
            </p>
          </div>
        </div>

        {/* Credentials & Details */}
        <div className="mt-4 space-y-3 text-xs text-slate-300 leading-relaxed">
          <p>
            বাংলাদেশি নাগরিকদের জন্য একক প্ল্যাটফর্মে শক্তিশালী উৎপাদনশীলতা টুলস, আইনি ও নাগরিক ড্রাফট সহায়তা, এবং ভিডিও এনালাইসিস ইঞ্জিন সরবরাহের উদ্দেশ্যে এই প্ল্যাটফর্মটি নকশা ও তৈরি করা হয়েছে।
          </p>

          <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3.5 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-slate-200">
              <Award className="h-4 w-4 text-emerald-400" />
              <span>ইকোসিস্টেমের প্রযুক্তিগত অর্জনসমূহ:</span>
            </div>
            <div className="grid grid-cols-1 gap-1 text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-3 w-3 text-emerald-400" />
                <span>Gemini Pro (gemini-3.1-pro-preview) মাল্টিমোডাল ভিডিও ইঞ্জিন</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-3 w-3 text-emerald-400" />
                <span>PWABuilder অডিটে ১০০/১০০ স্কোর ও অফলাইন সমর্থন</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-3 w-3 text-emerald-400" />
                <span>বাংলাদেশ পুলিশ ও প্রশাসনিক আবেদনপত্র জেনারেটর</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-3 w-3 text-emerald-400" />
                <span>গুগল ওয়ার্কস্পেস জিমেইল REST API v1 ইন্টিগ্রেশন</span>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <a
              href="https://github.com/sf0745026"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 py-2.5 font-semibold text-slate-100 transition-colors"
            >
              <Github className="h-4 w-4" />
              <span>github.com/sf0745026</span>
            </a>
            <a
              href="mailto:sf0745026@gmail.com"
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 py-2.5 font-semibold text-slate-100 transition-colors"
            >
              <Mail className="h-4 w-4 text-cyan-400" />
              <span>sf0745026@gmail.com</span>
            </a>
          </div>

          <div className="text-center text-[11px] text-slate-500 pt-1">
            MIT License • সর্বস্বত্ব সংরক্ষিত ২০২৬
          </div>
        </div>
      </div>
    </div>
  );
};
