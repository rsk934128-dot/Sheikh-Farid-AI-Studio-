import React, { useState, useRef, useEffect } from 'react';
import {
  Music,
  Play,
  Pause,
  Download,
  Sparkles,
  Sliders,
  Volume2,
  VolumeX,
  RotateCcw,
  CheckCircle2,
  Wand2,
  Radio,
  Clock,
  Layers,
  ArrowRight,
  Zap,
  Headphones,
  Film,
  Activity,
} from 'lucide-react';
import {
  SongGenre,
  SONG_STYLE_PRESETS,
  SongStylePreset,
  MUSICAL_SCALES,
  ThirtySecondSongEngine,
} from './ThirtySecondAudioEngine';

interface ThirtySecondAudioStudioProps {
  onApplyToVideoStudio?: (trackInfo: {
    title: string;
    blob?: Blob;
    url?: string;
    presetKey: string;
  }) => void;
  className?: string;
}

export const ThirtySecondAudioStudio: React.FC<ThirtySecondAudioStudioProps> = ({
  onApplyToVideoStudio,
  className = '',
}) => {
  const [selectedGenre, setSelectedGenre] = useState<SongGenre>('bangla-folk');
  const [bpm, setBpm] = useState<number>(88);
  const [volume, setVolume] = useState<number>(0.75);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentSeconds, setCurrentSeconds] = useState<number>(0);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [currentSection, setCurrentSection] = useState<string>('Intro (ভূমিকা)');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [isComposing, setIsComposing] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportedAudioUrl, setExportedAudioUrl] = useState<string | null>(null);
  const [exportedAudioBlob, setExportedAudioBlob] = useState<Blob | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const songEngineRef = useRef<ThirtySecondSongEngine>(new ThirtySecondSongEngine());
  const activePreset = SONG_STYLE_PRESETS[selectedGenre];

  // Sync BPM when genre changes
  useEffect(() => {
    setBpm(activePreset.defaultBpm);
    if (isPlaying) {
      stopSong();
    }
  }, [selectedGenre]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      songEngineRef.current.stop();
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  const startSong = () => {
    try {
      if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
      }

      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      setIsPlaying(true);
      setCurrentSeconds(0);
      setProgressPercent(0);

      songEngineRef.current.startLiveSong(
        ctx,
        ctx.destination,
        activePreset,
        {
          volume,
          bpm,
          onProgress: (sec, pct, section) => {
            setCurrentSeconds(sec);
            setProgressPercent(pct);
            setCurrentSection(section);
          },
          onComplete: () => {
            setIsPlaying(false);
            setCurrentSeconds(30);
            setProgressPercent(100);
            setCurrentSection('সম্পন্ন');
          },
        }
      );
    } catch (err) {
      console.warn('Error starting song engine:', err);
    }
  };

  const stopSong = () => {
    songEngineRef.current.stop();
    setIsPlaying(false);
    setCurrentSeconds(0);
    setProgressPercent(0);
  };

  const togglePlayback = () => {
    if (isPlaying) {
      stopSong();
    } else {
      startSong();
    }
  };

  // AI Prompt to Music Composer
  const handleComposeFromPrompt = (promptText?: string) => {
    const text = (promptText || customPrompt).toLowerCase();
    setIsComposing(true);

    setTimeout(() => {
      if (text.includes('বাউল') || text.includes('বাঁশি') || text.includes('একতারা') || text.includes('পল্লী') || text.includes('folk')) {
        setSelectedGenre('bangla-folk');
      } else if (text.includes('নিউজ') || text.includes('সংবাদ') || text.includes('বুলেটিন') || text.includes('news')) {
        setSelectedGenre('news-broadcast');
      } else if (text.includes('লো-ফাই') || text.includes('চিল') || text.includes('পড়াশোনা') || text.includes('lofi')) {
        setSelectedGenre('lofi-chill');
      } else if (text.includes('রিল') || text.includes('শর্টস') || text.includes('পপ') || text.includes('edm') || text.includes('dance')) {
        setSelectedGenre('viral-edm');
      } else if (text.includes('সিনেমা') || text.includes('ড্রামা') || text.includes('ট্রেইলার') || text.includes('রহস্য') || text.includes('movie')) {
        setSelectedGenre('cinematic-epic');
      } else if (text.includes('গিটার') || text.includes('মিষ্টি') || text.includes('রোমান্টিক') || text.includes('guitar')) {
        setSelectedGenre('acoustic-ballad');
      } else if (text.includes('সুফি') || text.includes('শান্ত') || text.includes('আধ্যাত্মিক') || text.includes('spiritual')) {
        setSelectedGenre('spiritual-sufi');
      } else if (text.includes('সাইবার') || text.includes('টেক') || text.includes('কোডিং') || text.includes('synth')) {
        setSelectedGenre('cyberpunk-synth');
      } else {
        setSelectedGenre('bangla-folk');
      }

      setIsComposing(false);
      setFeedbackMsg('✓ আপনার বর্ণনানুসারে ৩০ সেকেন্ডের সঙ্গীত প্রস্তুত!');
      setTimeout(() => setFeedbackMsg(null), 3000);
    }, 600);
  };

  // Render & Export 30-Second Audio File
  const handleExportSong = async () => {
    if (isPlaying) stopSong();
    setIsExporting(true);

    try {
      const result = await songEngineRef.current.renderAndExportSong(activePreset, bpm);
      setExportedAudioUrl(result.url);
      setExportedAudioBlob(result.blob);

      // Trigger instant download
      const a = document.createElement('a');
      a.href = result.url;
      a.download = `30s-song-${selectedGenre}-${Date.now()}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setFeedbackMsg('✓ ৩০ সেকেন্ডের গান সফলভাবে ডাউনলোড সম্পন্ন!');
      setTimeout(() => setFeedbackMsg(null), 3500);
    } catch (err) {
      console.error('Failed to export audio:', err);
    } finally {
      setIsExporting(false);
    }
  };

  // Send to Video Studio
  const handleSendToVideo = () => {
    if (onApplyToVideoStudio) {
      onApplyToVideoStudio({
        title: activePreset.titleBn,
        blob: exportedAudioBlob || undefined,
        url: exportedAudioUrl || undefined,
        presetKey: activePreset.id,
      });
      setFeedbackMsg('✓ ফ্রি ভিডিও মেকার স্টুডিওতে ব্যাকগ্রাউন্ড মিউজিক হিসেবে যুক্ত হয়েছে!');
      setTimeout(() => setFeedbackMsg(null), 3500);
    }
  };

  return (
    <div className={`mx-auto max-w-7xl px-4 py-6 sm:px-6 space-y-6 ${className}`}>
      {/* Header Banner */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-800 pb-5 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <Radio className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-white sm:text-2xl flex items-center gap-2">
                <span>৩০ সেকেন্ডের অডিও মিউজিক ইঞ্জিন</span>
                <span className="rounded bg-purple-500/20 px-2 py-0.5 text-xs text-purple-300 font-mono font-bold">
                  $০ খরচ • Web Audio
                </span>
              </h2>
            </div>
          </div>
          <p className="mt-1 text-sm text-slate-400">
            বাউল, পল্লী সুর, ব্রেকিং নিউজ, লো-ফাই ও সিনেমাটিক—যেকোনো গান ও আবহ ৩০ সেকেন্ডের নিখুঁত আর্কিটেকচারে তৈরি করুন।
          </p>
        </div>

        {feedbackMsg && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-500/30 px-3 py-1.5 rounded-xl animate-bounce">
            <CheckCircle2 className="h-4 w-4" />
            <span>{feedbackMsg}</span>
          </div>
        )}
      </div>

      {/* SECTION 1: AI Prompt-to-Song Composer */}
      <div className="rounded-2xl border border-purple-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-purple-950/20 p-4 shadow-xl space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-white flex items-center gap-1.5">
            <Wand2 className="h-4 w-4 text-purple-400" />
            <span>কী ধরনের গান বা সুর চান লিখুন (Prompt to Music):</span>
          </span>
          <span className="text-[10px] text-purple-400 font-mono">
            স্বয়ংক্রিয় রাগ, কর্ড ও বিট সিঙ্ক
          </span>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="যেমন: বৃষ্টিভেজা সন্ধ্যায় বাঁশি আর একতারার সুর, রোমাঞ্চকর সিনেমাটিক ট্রেলার, ইউটিউব শর্টসের ভাইরাল বিট..."
            className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => handleComposeFromPrompt()}
            disabled={isComposing || !customPrompt.trim()}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg transition-all disabled:opacity-50"
          >
            {isComposing ? (
              <span>সুর তৈরি হচ্ছে...</span>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>গান তৈরি করুন</span>
              </>
            )}
          </button>
        </div>

        {/* 1-Click Bengali Prompt Chips */}
        <div>
          <div className="text-[10px] text-slate-400 mb-1.5 font-medium">
            💡 দ্রুত পছন্দের ১-ক্লিক সুর প্রিসেট:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {[
              { label: '🇧🇩 বাঁশি ও একতারার সুর', p: 'বাউল ও পল্লী সুরের বাঁশি এবং একতারা' },
              { label: '📺 টিভি ব্রেকিং বুলেটিন', p: 'টিভি নিউজ ব্রেকিং বুলেটিন স্টুডিও থিম' },
              { label: '☕ লো-ফাই রিল্যাক্সিং পিয়ানো', p: 'বৃষ্টির দিনে লো-ফাই চিলহপ পিয়ানো' },
              { label: '⚡ ভাইরাল শর্টস ইডিএম', p: 'ফেসবুক রিলসের জন্য সুপারস ইডিএম ড্রপ' },
              { label: '🎬 সিনেমাটিক ড্রামাটিক ট্রেলার', p: 'রোমাঞ্চকর তথ্যচিত্র সিনেমাটিক সুর' },
              { label: '🎸 মিষ্টি অ্যাকোস্টিক গিটার', p: 'মিষ্টি অ্যাকোস্টিক গিটার ও সুর' },
              { label: '🕌 সুফি ও আধ্যাত্মিক বাঁশি', p: 'সুফি ও আত্মিক প্রশান্তির সুর' },
            ].map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setCustomPrompt(chip.p);
                  handleComposeFromPrompt(chip.p);
                }}
                className="rounded-lg bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-purple-500/40 px-2.5 py-1 text-[11px] text-slate-300 hover:text-white transition-colors"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 2: 30-Second Interactive Live Workstation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Genre Presets */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Music className="h-4 w-4 text-purple-400" />
                <span>সঙ্গীত ধারা ও বাদ্যযন্ত্র শৈলী (৮টি স্টাইল):</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 max-h-[460px] overflow-y-auto pr-1">
              {(Object.keys(SONG_STYLE_PRESETS) as SongGenre[]).map((key) => {
                const preset = SONG_STYLE_PRESETS[key];
                const isSelected = selectedGenre === key;

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedGenre(key)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-purple-500 bg-purple-950/40 text-white ring-1 ring-purple-500/50 shadow-md'
                        : 'border-slate-800 bg-slate-950/70 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{preset.icon}</span>
                        <div className="font-bold text-xs">{preset.titleBn}</div>
                      </div>
                      <span className="text-[10px] font-mono text-purple-400 font-bold bg-purple-950/60 px-1.5 py-0.5 rounded border border-purple-500/30">
                        {preset.defaultBpm} BPM
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 line-clamp-1">{preset.taglineBn}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: 30-Second Multi-Track Studio Player & Visualizer */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl space-y-5">
            {/* Active Preset Title & Meta */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">{activePreset.icon}</span>
                  <h3 className="text-base font-bold text-white">{activePreset.titleBn}</h3>
                </div>
                <p className="text-xs text-purple-400 font-medium mt-0.5">
                  {activePreset.descriptionBn}
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <span className="rounded bg-slate-950 px-2 py-1 border border-slate-800">
                  {MUSICAL_SCALES[activePreset.scaleId]?.nameBn || 'ভৈরব / মাইনর'}
                </span>
                <span className="rounded bg-slate-950 px-2 py-1 border border-slate-800">
                  {bpm} BPM
                </span>
              </div>
            </div>

            {/* 30-Second Timeline & Multi-Track Arrangement View */}
            <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 space-y-4">
              {/* Header Clock & Section */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-purple-400" />
                  <span className="text-xs font-bold text-slate-200">
                    সময়কাল: 00:{currentSeconds.toString().padStart(2, '0')} / 00:30
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-2.5 py-0.5 rounded-full">
                    {currentSection}
                  </span>
                </div>
              </div>

              {/* 30-Second Timeline Bar */}
              <div className="space-y-1.5">
                <div className="relative h-4 w-full bg-slate-900 rounded-lg overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 transition-all duration-200"
                    style={{ width: `${progressPercent}%` }}
                  />
                  {/* Segment Markers (4s, 12s, 22s) */}
                  <div className="absolute top-0 bottom-0 left-[13.3%] w-[1px] bg-slate-700" title="Intro" />
                  <div className="absolute top-0 bottom-0 left-[40%] w-[1px] bg-slate-700" title="Verse" />
                  <div className="absolute top-0 bottom-0 left-[73.3%] w-[1px] bg-slate-700" title="Chorus" />
                </div>

                {/* Section Labels */}
                <div className="grid grid-cols-4 text-[9px] text-slate-500 font-mono text-center">
                  <span>Intro (0-4s)</span>
                  <span>Verse (4-12s)</span>
                  <span>Chorus (12-22s)</span>
                  <span>Outro (22-30s)</span>
                </div>
              </div>

              {/* Multi-Track Sound Layers Visualizer */}
              <div className="space-y-2 pt-2 border-t border-slate-900">
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  মাল্টি-ট্র্যাক পলিফোনিক লেয়ার:
                </div>
                <div className="space-y-1.5 text-xs">
                  {[
                    { label: '🎹 হারমোনি ও কর্ড প্যাড', active: isPlaying, color: 'text-purple-400' },
                    { label: '🎻 লিড মেলোডি ও বাঁশি', active: isPlaying && currentSeconds >= 2, color: 'text-pink-400' },
                    { label: '🎸 ড্রাইভ বেসলাইন', active: isPlaying && currentSeconds >= 4, color: 'text-cyan-400' },
                    { label: '🥁 ড্রামস ও রিদম বিট', active: isPlaying && currentSeconds >= 6 && currentSeconds <= 24, color: 'text-amber-400' },
                  ].map((track, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800/80"
                    >
                      <span className={`text-[11px] font-semibold ${track.color}`}>
                        {track.label}
                      </span>
                      <div className="flex items-center gap-1">
                        {track.active ? (
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((b) => (
                              <span
                                key={b}
                                className="h-3 w-1 bg-current rounded-full animate-pulse"
                                style={{
                                  animationDelay: `${b * 120}ms`,
                                  color: track.color.replace('text-', ''),
                                }}
                              />
                            ))}
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-600 font-mono">অফলাইন</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Workstation Controls: Sliders for BPM & Volume */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 font-medium text-[11px]">টেম্পো (BPM গতি):</span>
                  <span className="font-mono text-purple-400 font-bold">{bpm} BPM</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="160"
                  step="2"
                  value={bpm}
                  onChange={(e) => setBpm(Number(e.target.value))}
                  className="w-full accent-purple-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 font-medium text-[11px]">ভলিউম (Volume):</span>
                  <span className="font-mono text-cyan-400 font-bold">{Math.round(volume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Play, Stop, Download & Apply Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={togglePlayback}
                  className={`flex items-center gap-2 rounded-xl px-5 py-3 text-xs font-bold text-white shadow-lg transition-all ${
                    isPlaying
                      ? 'bg-amber-600 hover:bg-amber-500 ring-2 ring-amber-400/50'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-purple-950/40'
                  }`}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="h-4 w-4" />
                      <span>সঙ্গীত থামান (Pause)</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 fill-white" />
                      <span>৩০ সেকেন্ড শুনুন (Play 30s)</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={stopSong}
                  className="p-3 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 hover:text-white"
                  title="রিসেট"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                {/* 1-Click Export Audio File */}
                <button
                  type="button"
                  onClick={handleExportSong}
                  disabled={isExporting}
                  className="flex items-center gap-1.5 rounded-xl border border-purple-500/50 bg-purple-950/40 hover:bg-purple-900/50 px-4 py-3 text-xs font-semibold text-purple-300 hover:text-white transition-all disabled:opacity-50"
                  title="সম্পূর্ণ ৩০ সেকেন্ডের গান অডিও ফাইল হিসেবে ডাউনলোড করুন"
                >
                  <Download className="h-3.5 w-3.5 text-purple-400" />
                  <span>{isExporting ? 'রেন্ডার হচ্ছে...' : 'অডিও ডাউনলোড (.webm)'}</span>
                </button>

                {/* Send to Video Studio Button */}
                {onApplyToVideoStudio && (
                  <button
                    type="button"
                    onClick={handleSendToVideo}
                    className="flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-3 text-xs font-bold text-white shadow-md transition-colors"
                  >
                    <Film className="h-3.5 w-3.5" />
                    <span>ভিডিওতে যুক্ত করুন</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
