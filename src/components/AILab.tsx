import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  Zap,
  Copy,
  Check,
  RotateCcw,
  Bot,
  User,
  Shield,
  FileText,
  Terminal,
  Clock,
  Printer,
} from 'lucide-react';
import { ZERO_LATENCY_CACHE } from '../data/mockData';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  isCached?: boolean;
  latency?: string;
  timestamp: string;
}

export const AILab: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `স্বাগতম! আমি শেখ ফরিদ হাই-প্রিসিশন লোকাল এআই (বাংলা কোর)।
আমি সরকারি প্রশাসনিক খসড়া, অনলাইন জিডি, সাইবার নিরাপত্তা ও সার্ভার অটোমেশন সংক্রান্ত প্রশ্নের সুনির্দিষ্ট তথ্য প্রদানে প্রস্তুত।
নিচের যেকোনো প্রম্পট চিপে ক্লিক করতে পারেন বা নিজস্ব প্রশ্ন লিখুন।`,
      latency: '0ms (Edge Memory)',
      isCached: true,
      timestamp: new Date().toLocaleTimeString('bn-BD'),
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const smartChips = [
    {
      label: 'হারানো NID এর অনলাইন জিডি নিয়মাবলী',
      cacheKey: 'gd-nid',
      prompt: 'জাতীয় পরিচয়পত্র (NID) হারালে থানায় অনলাইন জিডি করার সঠিক ধাপ ও নির্বাচন কমিশন রি-ইস্যু নির্দেশিকা কী?',
    },
    {
      label: 'প্রশাসনিক নৈমিত্তিক ছুটির বিধিবিধান',
      cacheKey: 'leave-casual',
      prompt: 'বাংলাদেশ সরকারি চাকরি বিধি অনুযায়ী নৈমিত্তিক ছুটি (Casual Leave) এর শর্তাবলী ও নিয়ম কী?',
    },
    {
      label: 'জাতীয় জরুরি হটলাইনসমূহ (৯৯৯, ৩৩৩, ১০৯)',
      cacheKey: 'hotline-emergency',
      prompt: 'জরুরি জাতীয় হেল্পলাইন ৯৯৯, ৩৩৩ এবং ১০৯ এর কার্যকারিতা ও কোন সেবায় কীভাবে সহায়তা নেওয়া যায়?',
    },
    {
      label: 'V2Ray ও 3X-UI সার্ভার সেটআপ স্ক্রিপ্ট',
      cacheKey: null,
      prompt: 'উবুন্টু লিনাক্স সার্ভারে V2Ray এবং 3X-UI প্যানেল ইনস্টল করার কমান্ড ও কনফিগারেশন লিখে দাও।',
    },
  ];

  const handleSend = async (textToSend?: string, cacheKey?: string | null) => {
    const text = (textToSend || inputPrompt).trim();
    if (!text) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('bn-BD'),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');

    // Check zero-latency edge cache
    if (cacheKey && ZERO_LATENCY_CACHE[cacheKey]) {
      const cachedResponse = ZERO_LATENCY_CACHE[cacheKey];
      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: cachedResponse,
        isCached: true,
        latency: '0.1ms (Edge Cache)',
        timestamp: new Date().toLocaleTimeString('bn-BD'),
      };
      setMessages((prev) => [...prev, aiMsg]);
      return;
    }

    // Call server Gemini API
    setIsLoading(true);
    const startTime = performance.now();

    try {
      const res = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: text,
          mode: text.includes('জিডি')
            ? 'gd_draft'
            : text.includes('ছুটি')
            ? 'leave_application'
            : text.includes('V2Ray') || text.includes('সার্ভার')
            ? 'vpn_script'
            : 'general',
        }),
      });

      const data = await res.json();
      const duration = ((performance.now() - startTime) / 1000).toFixed(2);

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.text || 'কোনো উত্তর পাওয়া যায়নি।',
        isCached: false,
        latency: `${duration}s (Gemini Flash)`,
        timestamp: new Date().toLocaleTimeString('bn-BD'),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      const errorMsg: Message = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: 'দুঃখিত, সংযোগে ত্রুটি দেখা দিয়েছে। লোকাল ক্যাশ বা ইন্টারনেট সংযোগ যাচাই করুন।',
        timestamp: new Date().toLocaleTimeString('bn-BD'),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
      {/* Title */}
      <div className="mb-6 flex flex-col justify-between gap-4 border-b border-slate-800 pb-5 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Sparkles className="h-5 w-5" />
            </span>
            <h2 className="text-xl font-bold text-white sm:text-2xl">
              বাংলা হাই-প্রিসিশন এআই ল্যাব (NoorAI Edge)
            </h2>
          </div>
          <p className="mt-1 text-sm text-slate-400">
            জিরো-ল্যাটেন্সি ক্লায়েন্ট এজ ক্যাশিং ও জেমিনি এপিআই সমন্বয়ে তাৎক্ষণিক প্রশাসনিক উত্তর ও ড্রাফটিং ইঞ্জিন।
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3 py-1 text-xs font-semibold text-cyan-300">
            <Zap className="h-3 w-3 text-cyan-400 animate-pulse" />
            0ms Edge Cache Enabled
          </span>
          <button
            onClick={() => setMessages([messages[0]])}
            className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>রিসেট</span>
          </button>
        </div>
      </div>

      {/* Smart Chips Bar */}
      <div className="mb-4">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          স্মার্ট প্রম্পট চিপস (তাৎক্ষণিক এজ রেসপন্স):
        </label>
        <div className="mt-2 flex flex-wrap gap-2">
          {smartChips.map((chip, i) => (
            <button
              key={i}
              onClick={() => handleSend(chip.prompt, chip.cacheKey)}
              className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/90 hover:border-cyan-500/50 hover:bg-slate-800 px-3 py-1.5 text-xs text-slate-200 transition-colors"
            >
              <Zap className="h-3 w-3 text-cyan-400" />
              <span>{chip.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Conversation Window */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 shadow-2xl overflow-hidden">
        <div className="h-[460px] overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isAi = msg.sender === 'ai';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isAi ? 'items-start' : 'items-start flex-row-reverse'}`}
              >
                {/* Avatar */}
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border ${
                    isAi
                      ? 'border-cyan-500/30 bg-cyan-950/50 text-cyan-400'
                      : 'border-emerald-500/30 bg-emerald-950/50 text-emerald-400'
                  }`}
                >
                  {isAi ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                </div>

                {/* Message Bubble */}
                <div
                  className={`group relative max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-md ${
                    isAi
                      ? 'border border-slate-800 bg-slate-950 text-slate-100'
                      : 'bg-emerald-600 text-white'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.text}</div>

                  {/* Metadata and Actions */}
                  <div className="mt-2.5 flex items-center justify-between border-t border-slate-800/80 pt-2 text-[10px] text-slate-400">
                    <div className="flex items-center gap-2">
                      <span>{msg.timestamp}</span>
                      {msg.latency && (
                        <span className="flex items-center gap-1 font-mono text-cyan-400">
                          <Clock className="h-2.5 w-2.5" />
                          {msg.latency}
                        </span>
                      )}
                    </div>

                    {isAi && (
                      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                        <button
                          onClick={() => copyText(msg.id, msg.text)}
                          className="flex items-center gap-1 rounded bg-slate-900 hover:bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-300 transition-colors"
                        >
                          {copiedId === msg.id ? (
                            <Check className="h-3 w-3 text-emerald-400" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                          <span>{copiedId === msg.id ? 'কপি হয়েছে' : 'কপি'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-950/50 text-cyan-400">
                <Sparkles className="h-4 w-4 animate-spin" />
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs text-slate-400 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping"></span>
                <span>এআই মডেল উত্তর প্রস্তুত করছে...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="border-t border-slate-800 bg-slate-950 p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="এখানে বাংলা বা ইংরেজিতে আপনার প্রশ্ন লিখুন (যেমন: ছুটির আবেদন, জিডি ড্রাফট, কোড রিভিউ)..."
              className="flex-1 rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
            <button
              type="submit"
              disabled={isLoading || !inputPrompt.trim()}
              className="flex items-center gap-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 px-5 py-3 text-xs sm:text-sm font-semibold text-white transition-all disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              <span className="hidden sm:inline">পাঠান</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
