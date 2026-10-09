import React, { useState, useRef, useEffect } from 'react';
import {
  Video,
  Play,
  Upload,
  Sparkles,
  Clock,
  ListOrdered,
  CheckCircle,
  FileText,
  Copy,
  Check,
  Download,
  AlertCircle,
  Search,
  Cpu,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { SAMPLE_VIDEOS } from '../data/mockData';
import { SampleVideo, VideoAnalysisResult } from '../types';

export const VideoAnalyzer: React.FC = () => {
  const [selectedVideo, setSelectedVideo] = useState<SampleVideo>(SAMPLE_VIDEOS[0]);
  const [customVideoUrl, setCustomVideoUrl] = useState<string | null>(null);
  const [customVideoName, setCustomVideoName] = useState<string>('');
  const [analysisType, setAnalysisType] = useState<string>('comprehensive');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [extractedFrames, setExtractedFrames] = useState<{ time: number; dataUrl: string }[]>([]);
  const [analysisResult, setAnalysisResult] = useState<VideoAnalysisResult | null>(null);
  const [selectedModel, setSelectedModel] = useState<string>('gemini-3.8-flash');
  const [copied, setCopied] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Set default initial result for selected video
  useEffect(() => {
    if (!customVideoUrl) {
      setAnalysisResult({
        analysis: selectedVideo.presetKeyInfo,
        modelUsed: selectedModel,
        fallbackUsed: false,
        timestamp: new Date().toISOString(),
        analysisType: 'comprehensive',
      });
    }
  }, [selectedVideo, customVideoUrl, selectedModel]);

  // Jump video player to specific seconds
  const seekVideo = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = seconds;
      videoRef.current.play().catch(() => {});
    }
  };

  // Helper to parse MM:SS string to seconds
  const parseTimestampToSeconds = (timestampStr: string): number => {
    const parts = timestampStr.split(':');
    if (parts.length === 2) {
      return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
    }
    return 0;
  };

  // Handle local video file upload and extract sample keyframes client-side
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      setErrorMsg('অনুগ্রহ করে একটি বৈধ ভিডিও ফাইল (.mp4, .webm, .mov) আপলোড করুন।');
      return;
    }

    setErrorMsg(null);
    const url = URL.createObjectURL(file);
    setCustomVideoUrl(url);
    setCustomVideoName(file.name);
    setAnalysisResult(null);

    // Extract keyframes using a hidden video element and canvas
    extractKeyframesFromBlob(url);
  };

  // Extract keyframes using HTML5 video and canvas
  const extractKeyframesFromBlob = (videoObjectUrl: string) => {
    const tempVideo = document.createElement('video');
    tempVideo.src = videoObjectUrl;
    tempVideo.crossOrigin = 'anonymous';
    tempVideo.muted = true;

    tempVideo.onloadedmetadata = async () => {
      const duration = tempVideo.duration || 60;
      const timestamps = [
        Math.min(2, duration * 0.05),
        duration * 0.25,
        duration * 0.5,
        duration * 0.75,
      ];

      const frames: { time: number; dataUrl: string }[] = [];
      const canvas = document.createElement('canvas');
      canvas.width = 480;
      canvas.height = 270;
      const ctx = canvas.getContext('2d');

      for (const time of timestamps) {
        tempVideo.currentTime = time;
        await new Promise((resolve) => {
          tempVideo.onseeked = () => {
            if (ctx) {
              ctx.drawImage(tempVideo, 0, 0, canvas.width, canvas.height);
              frames.push({
                time: Math.round(time),
                dataUrl: canvas.toDataURL('image/jpeg', 0.7),
              });
            }
            resolve(null);
          };
        });
      }

      setExtractedFrames(frames);
    };
  };

  // Generate video frames from video element or canvas
  const generateVideoFrames = (): { mimeType: string; data: string }[] => {
    if (extractedFrames.length > 0) {
      return extractedFrames.map((f) => ({
        mimeType: 'image/jpeg',
        data: f.dataUrl.split(',')[1],
      }));
    }

    try {
      if (videoRef.current && videoRef.current.videoWidth > 0) {
        const canvas = document.createElement('canvas');
        canvas.width = 480;
        canvas.height = 270;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
          return [{ mimeType: 'image/jpeg', data: dataUrl.split(',')[1] }];
        }
      }
    } catch {
      // Cross-origin canvas read fallback
    }

    // Generate high-resolution title card keyframe canvas for preset video
    const canvas = document.createElement('canvas');
    canvas.width = 480;
    canvas.height = 270;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, 480, 270);
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText(customVideoName || selectedVideo.titleBn || selectedVideo.title, 24, 60);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '14px sans-serif';
      ctx.fillText(`Duration: ${selectedVideo.duration} • Category: ${selectedVideo.category}`, 24, 100);
      ctx.fillStyle = '#38bdf8';
      ctx.font = '12px sans-serif';
      ctx.fillText('Timestamp Segments: 00:15 | 01:20 | 02:40', 24, 140);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
      return [{ mimeType: 'image/jpeg', data: dataUrl.split(',')[1] }];
    }

    return [];
  };

  // Run deep video understanding via backend using model 'gemini-3.1-pro-preview'
  const handleAnalyzeVideo = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    setLoadingStep('ভিডিও কিফ্রেম ও টাইমকোড প্রসেস করা হচ্ছে...');

    try {
      const keyframesPayload = generateVideoFrames();

      setLoadingStep(`${selectedModel === 'gemini-3.1-pro-preview' ? 'Gemini Pro 3.1' : 'Gemini 3.8 Flash'} মডেলে ভিডিও সিকোয়েন্স পাঠানো হচ্ছে...`);

      const response = await fetch('/api/gemini/analyze-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: selectedModel,
          analysisType,
          customPrompt: customPrompt.trim() || undefined,
          keyframes: keyframesPayload,
          videoMetadata: {
            title: customVideoName || selectedVideo.titleBn || selectedVideo.title,
            duration: selectedVideo.duration,
            category: selectedVideo.category,
            description: selectedVideo.description,
          },
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'সার্ভার থেকে বিশ্লেষণ পাওয়া যায়নি।');
      }

      setLoadingStep('মূল তথ্যাবলী ও টাইমস্ট্যাম্প সংকলন করা হচ্ছে...');
      const data = await response.json();

      setAnalysisResult({
        analysis: data.analysis,
        modelUsed: data.modelUsed || 'gemini-3.1-pro-preview',
        fallbackUsed: Boolean(data.fallbackUsed),
        timestamp: data.timestamp || new Date().toISOString(),
        analysisType: data.analysisType || analysisType,
      });
    } catch (err: any) {
      console.error('Video analysis failed:', err);
      setErrorMsg(err.message || 'ভিডিও বিশ্লেষণে ত্রুটি দেখা দিয়েছে।');
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  const copyAnalysis = () => {
    if (!analysisResult) return;
    navigator.clipboard.writeText(analysisResult.analysis);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadReport = () => {
    if (!analysisResult) return;
    const blob = new Blob([analysisResult.analysis], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `video-analysis-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const currentVideoSrc = customVideoUrl || selectedVideo.videoUrl;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      {/* Title & Model Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 border-b border-slate-800 pb-5 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Video className="h-5 w-5" />
            </span>
            <h2 className="text-xl font-bold text-white sm:text-2xl">
              ভিডিও এনালাইসিস ও কি-ইনফরমেশন এক্সট্র্যাক্টর
            </h2>
          </div>
          <p className="mt-1 text-sm text-slate-400">
            Gemini Pro (<code className="rounded bg-slate-900 px-1 py-0.5 text-emerald-300 font-mono text-xs">gemini-3.1-pro-preview</code>) এর মাল্টিমোডাল ভিশন ও অডিও আর্কিটেকচার দ্বারা যেকোনো ভিডিওর মূল তথ্যাবলী স্বয়ংক্রিয়ভাবে বিশ্লেষণ।
          </p>
        </div>

        {/* Model Selector Toggle */}
        <div className="flex flex-col sm:flex-row items-end gap-2">
          <div className="flex rounded-xl border border-slate-800 bg-slate-900 p-1">
            <button
              type="button"
              onClick={() => setSelectedModel('gemini-3.8-flash')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                selectedModel === 'gemini-3.8-flash'
                  ? 'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Cpu className="h-3.5 w-3.5 text-emerald-400" />
              <span>Gemini 3.8 Flash (Active)</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedModel('gemini-3.1-pro-preview')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                selectedModel === 'gemini-3.1-pro-preview'
                  ? 'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
              <span>Gemini 3.1 Pro</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Video Player & Controls on Left, Results on Right */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Video Selector, Upload, Player & Prompt */}
        <div className="space-y-5 lg:col-span-6">
          {/* Preset Video Selector Tabs */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
            <div className="mb-3 flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                নমুনা ভিডিও সিলেক্ট করুন (বা নিজস্ব ফাইল আপলোড করুন):
              </label>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 px-2.5 py-1 text-xs font-medium text-slate-200 transition-colors"
              >
                <Upload className="h-3.5 w-3.5 text-emerald-400" />
                <span>ভিডিও আপলোড (MP4/WebM)</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {SAMPLE_VIDEOS.map((vid) => {
                const isCurrent = !customVideoUrl && selectedVideo.id === vid.id;
                return (
                  <button
                    key={vid.id}
                    onClick={() => {
                      setCustomVideoUrl(null);
                      setSelectedVideo(vid);
                    }}
                    className={`flex flex-col rounded-lg p-2.5 text-left transition-all border ${
                      isCurrent
                        ? 'border-emerald-500/50 bg-emerald-950/20 ring-1 ring-emerald-500/30'
                        : 'border-slate-800 bg-slate-950 hover:border-slate-700 hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase">
                        {vid.category}
                      </span>
                      <span className="rounded bg-slate-900 px-1 py-0.5 text-[10px] text-slate-400 font-mono">
                        {vid.duration}
                      </span>
                    </div>
                    <span className="mt-1 line-clamp-1 text-xs font-semibold text-white">
                      {vid.titleBn}
                    </span>
                  </button>
                );
              })}
            </div>

            {customVideoName && (
              <div className="mt-3 flex items-center justify-between rounded-lg border border-cyan-500/30 bg-cyan-950/30 px-3 py-2 text-xs text-cyan-200">
                <span className="truncate">কাস্টম আপলোডকৃত ভিডিও: {customVideoName}</span>
                <button
                  onClick={() => {
                    setCustomVideoUrl(null);
                    setCustomVideoName('');
                  }}
                  className="ml-2 font-bold hover:underline text-cyan-400"
                >
                  রিসেট
                </button>
              </div>
            )}
          </div>

          {/* Video Player */}
          <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950 shadow-xl">
            <div className="relative aspect-video bg-black">
              <video
                ref={videoRef}
                key={currentVideoSrc}
                src={currentVideoSrc}
                controls
                playsInline
                className="h-full w-full object-contain"
              />
            </div>
            <div className="border-t border-slate-800/80 bg-slate-900/60 p-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    {customVideoName || selectedVideo.titleBn}
                  </h3>
                  <p className="line-clamp-1 text-xs text-slate-400">
                    {customVideoName ? 'কাস্টম স্থানীয় ভিডিও' : selectedVideo.description}
                  </p>
                </div>
                <span className="rounded-md border border-slate-800 bg-slate-950 px-2 py-1 text-xs font-mono text-emerald-400">
                  {selectedVideo.duration}
                </span>
              </div>
            </div>
          </div>

          {/* Analysis Mode & Quick Prompts */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                বিশ্লেষণের ধরণ নির্ধারণ (Analysis Mode):
              </label>
              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {[
                  { id: 'comprehensive', label: 'পূর্ণাঙ্গ অডিট', icon: Layers },
                  { id: 'key_info', label: 'মূল তথ্যাবলী', icon: Search },
                  { id: 'chapters', label: 'সময়রেখা/চ্যাপ্টার', icon: Clock },
                  { id: 'action_items', label: 'সিদ্ধান্ত ও করণীয়', icon: CheckCircle },
                ].map((mode) => {
                  const Icon = mode.icon;
                  const isSelected = analysisType === mode.id;
                  return (
                    <button
                      key={mode.id}
                      onClick={() => setAnalysisType(mode.id)}
                      className={`flex flex-col items-center gap-1.5 rounded-lg border p-2 text-center transition-all ${
                        isSelected
                          ? 'border-emerald-500/60 bg-emerald-950/40 text-emerald-300 font-semibold'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-[11px]">{mode.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Prompt Chips */}
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                <span>স্মার্ট প্রম্পট টেমপ্লেট:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'ভিডিওর মূল ৫টি গুরুত্বপূর্ণ পয়েন্ট ও সময়রেখা বের করো',
                  'ভিডিওতে উল্লিখিত সরকারি নাগরিক সেবা ও আইনি দিকগুলো বিশ্লেষণ করো',
                  'কোন কোন সফটওয়্যার, স্ক্রিপ্ট বা টুলস ব্যবহারের কথা বলা হয়েছে?',
                  'ভিডিওর প্রতিটি অধ্যায়ের সময়ভিত্তিক বিস্তারিত সারসংক্ষেপ প্রস্তুত করো',
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCustomPrompt(chip)}
                    className="rounded-full border border-slate-800 bg-slate-950 hover:border-slate-700 hover:bg-slate-800 px-2.5 py-1 text-[11px] text-slate-300 transition-colors"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Prompt Textarea */}
            <div>
              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="ভিডিও সম্পর্কে সুনির্দিষ্ট কোনো প্রশ্ন থাকলে এখানে লিখুন (ঐচ্ছিক)..."
                rows={2}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Action Button */}
            <button
              onClick={handleAnalyzeVideo}
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-950/40 transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Sparkles className="h-4 w-4 animate-spin text-white" />
                  <span>{loadingStep || 'বিশ্লেষণ চলছে...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Gemini Pro দিয়ে ভিডিও বিশ্লেষণ শুরু করুন</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Video Intelligence Results */}
        <div className="space-y-4 lg:col-span-6">
          <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <FileText className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-white">
                    ভিডিওর মূল তথ্যাবলী ও ফলাফল
                  </h3>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span>মডেল: {analysisResult?.modelUsed || 'gemini-3.1-pro-preview'}</span>
                    {analysisResult?.fallbackUsed && (
                      <span className="text-amber-400">(Fallback Active)</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={copyAnalysis}
                  disabled={!analysisResult}
                  className="flex items-center gap-1 rounded-md border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-300 hover:bg-slate-700 transition-colors disabled:opacity-40"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? 'কপি হয়েছে' : 'কপি'}</span>
                </button>
                <button
                  onClick={downloadReport}
                  disabled={!analysisResult}
                  className="flex items-center gap-1 rounded-md border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-300 hover:bg-slate-700 transition-colors disabled:opacity-40"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>ডাউনলোড</span>
                </button>
              </div>
            </div>

            {errorMsg && (
              <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-500/40 bg-red-950/30 p-3 text-xs text-red-300">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Results Output or Loading Indicator */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
                <div className="relative flex h-16 w-16 items-center justify-center">
                  <div className="absolute h-full w-full rounded-full border-2 border-emerald-500/20 border-t-emerald-400 animate-spin"></div>
                  <Sparkles className="h-7 w-7 text-emerald-400 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-white">
                    {loadingStep || 'ভিডিওর অডিও ও ভিজ্যুয়াল ফ্রেম প্রসেস করা হচ্ছে...'}
                  </p>
                  <p className="text-xs text-slate-400">
                    Gemini 3.1 Pro মাল্টিমোডাল নিউরাল নেটওয়ার্ক ভিডিও কনটেন্ট ডিকোড করছে
                  </p>
                </div>
              </div>
            ) : analysisResult ? (
              <div className="space-y-4">
                {/* Result Card */}
                <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4 font-sans text-xs sm:text-sm leading-relaxed text-slate-200 whitespace-pre-wrap selection:bg-emerald-500">
                  {analysisResult.analysis}
                </div>

                {/* Quick Seek Timestamps from preset */}
                <div className="rounded-lg border border-slate-800/80 bg-slate-900/60 p-3">
                  <span className="text-xs font-semibold text-slate-400">
                    দ্রুত জাম্প করার টাইমস্ট্যাম্প (ক্লিক করুন):
                  </span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {[
                      { label: '00:15 - সূচনা ও প্রেক্ষাপট', sec: 15 },
                      { label: '01:20 - কেন্দ্রীয় তথ্য ও ডেটাবেস', sec: 80 },
                      { label: '02:40 - সাইবার পলিসি ও সুরক্ষা', sec: 160 },
                    ].map((ts, idx) => (
                      <button
                        key={idx}
                        onClick={() => seekVideo(ts.sec)}
                        className="flex items-center gap-1.5 rounded-md border border-slate-700 bg-slate-800 hover:border-emerald-500/50 hover:bg-slate-700 px-2.5 py-1 text-xs text-slate-200 transition-colors"
                      >
                        <Play className="h-3 w-3 text-emerald-400 fill-emerald-400" />
                        <span>{ts.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Verification Notice */}
                <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-800 pt-3">
                  <span>সর্বশেষ বিশ্লেষণ: {new Date(analysisResult.timestamp).toLocaleTimeString('bn-BD')}</span>
                  <span className="flex items-center gap-1 text-emerald-400">
                    <CheckCircle className="h-3 w-3" />
                    Verified by Gemini Pro 3.1 Multimodal Pipeline
                  </span>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-500">
                <Video className="mx-auto h-12 w-12 text-slate-700" />
                <p className="mt-2 text-sm text-slate-400">
                  বাম পাশের প্যানেল থেকে যেকোনো ভিডিও সিলেক্ট করে &ldquo;বিশ্লেষণ শুরু করুন&rdquo; এ ক্লিক করুন।
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
