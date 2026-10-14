import React, { useState, useRef, useEffect } from 'react';
import {
  Music,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Sparkles,
  Link as LinkIcon,
  Check,
  RotateCcw,
  Upload,
  Radio,
  Sliders,
  Tv,
  Film,
  Zap,
  Headphones,
  CheckCircle2,
  ExternalLink,
  Info,
  Clock,
  Layers,
} from 'lucide-react';
import {
  YouTubeTrack,
  YOUTUBE_CURATED_TRACKS,
  MusicCategory,
  ProceduralMusicPlayer,
} from './YouTubeMusicEngine';

export interface BackgroundMusicConfig {
  enabled: boolean;
  selectedTrack: YouTubeTrack | null;
  musicVolume: number; // 0 to 1
  voiceVolume: number; // 0 to 1.5
  enableDucking: boolean; // Auto-duck music during voice speech
  loop: boolean;
  customAudioFile: File | null;
  customAudioUrl: string | null;
  customAudioName: string | null;
  youtubeUrl: string;
  youtubeResolvedInfo: {
    title?: string;
    author?: string;
    thumbnailUrl?: string;
    embedUrl?: string;
    videoId?: string;
  } | null;
}

export const DEFAULT_MUSIC_CONFIG: BackgroundMusicConfig = {
  enabled: true,
  selectedTrack: YOUTUBE_CURATED_TRACKS[0], // default: Breaking News
  musicVolume: 0.35,
  voiceVolume: 1.0,
  enableDucking: true,
  loop: true,
  customAudioFile: null,
  customAudioUrl: null,
  customAudioName: null,
  youtubeUrl: '',
  youtubeResolvedInfo: null,
};

interface YouTubeMusicHubProps {
  config: BackgroundMusicConfig;
  onChange: (newConfig: BackgroundMusicConfig) => void;
  onOpenAudioStudio?: () => void;
  className?: string;
}

export const YouTubeMusicHub: React.FC<YouTubeMusicHubProps> = ({
  config,
  onChange,
  onOpenAudioStudio,
  className = '',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<MusicCategory>('all');
  const [previewTrackId, setPreviewTrackId] = useState<string | null>(null);
  const [isPlayingPreview, setIsPlayingPreview] = useState<boolean>(false);
  const [ytInputUrl, setYtInputUrl] = useState<string>('');
  const [isLoadingYt, setIsLoadingYt] = useState<boolean>(false);
  const [ytError, setYtError] = useState<string | null>(null);

  const previewAudioCtxRef = useRef<AudioContext | null>(null);
  const proceduralPlayerRef = useRef<ProceduralMusicPlayer>(new ProceduralMusicPlayer());
  const customAudioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Stop preview on unmount
  useEffect(() => {
    return () => {
      proceduralPlayerRef.current.stop();
      if (previewAudioCtxRef.current) {
        previewAudioCtxRef.current.close().catch(() => {});
      }
      if (customAudioPlayerRef.current) {
        customAudioPlayerRef.current.pause();
      }
    };
  }, []);

  const handleUpdate = (fields: Partial<BackgroundMusicConfig>) => {
    onChange({
      ...config,
      ...fields,
    });
  };

  const handleSelectTrack = (track: YouTubeTrack) => {
    handleUpdate({
      selectedTrack: track,
      enabled: true,
      customAudioFile: null,
      customAudioUrl: null,
      customAudioName: null,
    });
  };

  // Preview track audio
  const togglePreview = (track: YouTubeTrack) => {
    if (previewTrackId === track.id && isPlayingPreview) {
      // Stop
      proceduralPlayerRef.current.stop();
      setIsPlayingPreview(false);
      setPreviewTrackId(null);
      return;
    }

    try {
      if (!previewAudioCtxRef.current || previewAudioCtxRef.current.state === 'closed') {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        previewAudioCtxRef.current = new AudioCtx();
      }

      const ctx = previewAudioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      proceduralPlayerRef.current.start(
        ctx,
        ctx.destination,
        track.proceduralPreset,
        config.musicVolume
      );

      setPreviewTrackId(track.id);
      setIsPlayingPreview(true);
    } catch (err) {
      console.warn('Error playing preview:', err);
    }
  };

  // Resolve YouTube URL
  const handleFetchYouTubeLink = async () => {
    if (!ytInputUrl.trim()) return;
    setIsLoadingYt(true);
    setYtError(null);

    try {
      const res = await fetch(`/api/youtube/info?url=${encodeURIComponent(ytInputUrl.trim())}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'ইউটিউব ভিডিও পাওয়া যায়নি');
      }

      const customYtTrack: YouTubeTrack = {
        id: `yt-${data.videoId || Date.now()}`,
        title: data.title,
        titleBn: data.title,
        artist: data.author || 'YouTube Creator',
        category: 'news',
        categoryBn: 'ইউটিউব অডিও',
        duration: 60,
        bpm: 120,
        mood: 'ইউটিউব মিউজিক',
        youtubeId: data.videoId,
        youtubeUrl: ytInputUrl.trim(),
        thumbnailUrl: data.thumbnailUrl,
        proceduralPreset: 'news-broadcast',
        descriptionBn: `ইউটিউব থেকে আনা হয়েছে: ${data.author || ''}`,
      };

      handleUpdate({
        selectedTrack: customYtTrack,
        enabled: true,
        youtubeUrl: ytInputUrl.trim(),
        youtubeResolvedInfo: {
          title: data.title,
          author: data.author,
          thumbnailUrl: data.thumbnailUrl,
          embedUrl: data.embedUrl,
          videoId: data.videoId,
        },
      });

      setYtInputUrl('');
    } catch (err: any) {
      setYtError(err?.message || 'ইউটিউব লিঙ্ক লোড করতে ব্যর্থ হয়েছে');
    } finally {
      setIsLoadingYt(false);
    }
  };

  // Upload Custom Audio (Downloaded from YouTube or local MP3)
  const handleCustomAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const customTrack: YouTubeTrack = {
      id: `custom-file-${Date.now()}`,
      title: file.name.replace(/\.[^/.]+$/, ''),
      titleBn: file.name.replace(/\.[^/.]+$/, ''),
      artist: 'আপলোড করা অডিও',
      category: 'upbeat',
      categoryBn: 'কাস্টম অডিও',
      duration: 60,
      bpm: 120,
      mood: 'ইউজার অডিও',
      audioUrl: url,
      proceduralPreset: 'upbeat-viral',
      descriptionBn: 'আপনার ডিভাইস থেকে আপলোড করা মিউজিক ফাইল',
    };

    handleUpdate({
      selectedTrack: customTrack,
      enabled: true,
      customAudioFile: file,
      customAudioUrl: url,
      customAudioName: file.name,
    });
  };

  const filteredTracks =
    selectedCategory === 'all'
      ? YOUTUBE_CURATED_TRACKS
      : YOUTUBE_CURATED_TRACKS.filter((t) => t.category === selectedCategory);

  const categories: { id: MusicCategory; label: string; icon: string }[] = [
    { id: 'all', label: 'সব মিউজিক', icon: '🎵' },
    { id: 'news', label: 'ব্রেকিং নিউজ', icon: '📺' },
    { id: 'cinematic', label: 'সিনেমাটিক ড্রামা', icon: '🎬' },
    { id: 'lofi', label: 'লো-ফাই রিল্যাক্সিং', icon: '☕' },
    { id: 'corporate', label: 'কর্পোরেট টেক', icon: '💼' },
    { id: 'upbeat', label: 'ভাইরাল রিলস', icon: '⚡' },
    { id: 'spiritual', label: 'আধ্যাত্মিক ও স্নিগ্ধ', icon: '🕌' },
    { id: 'acoustic', label: 'অ্যাকোস্টিক মেলোডি', icon: '🇧🇩' },
  ];

  return (
    <div
      className={`rounded-2xl border border-red-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-red-950/20 p-4 shadow-xl space-y-4 ${className}`}
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-600/20 text-red-500 border border-red-500/30">
            <Music className="h-4 w-4" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>ইউটিউব ব্যাকগ্রাউন্ড মিউজিক ও অডিও হাব</span>
                <span className="rounded bg-red-600/20 px-1.5 py-0.5 text-[10px] text-red-400 font-mono font-bold">
                  YouTube Audio
                </span>
              </h3>
            </div>
            <p className="text-[10px] text-slate-400">
              ইউটিউব লিঙ্ক বা জনপ্রিয় ক্রিয়েটর অডিও লাইব্রেরি থেকে মিউজিক সরাসরি ভিডিওর সাথে রেকর্ড হবে
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {config.enabled && config.selectedTrack && (
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/50 border border-emerald-500/30 px-2 py-0.5 rounded-lg">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span className="truncate max-w-[140px] sm:max-w-[200px]">
                {config.customAudioName || config.selectedTrack.titleBn}
              </span>
            </div>
          )}

          <button
            type="button"
            onClick={() => handleUpdate({ enabled: !config.enabled })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              config.enabled ? 'bg-red-600' : 'bg-slate-700'
            }`}
            title={config.enabled ? 'মিউজিক বন্ধ করুন' : 'মিউজিক চালু করুন'}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                config.enabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {config.enabled && (
        <div className="space-y-4">
          {/* 30-Second Audio Engine Quick Link */}
          <div className="rounded-xl border border-purple-500/30 bg-purple-950/30 p-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30">
                <Radio className="h-4 w-4" />
              </span>
              <div>
                <span className="font-bold text-white block text-xs">
                  ৩০ সেকেন্ডের নতুন কোনো বাউল, নিউজ বা সিনেমাটিক গান তৈরি করতে চান?
                </span>
                <span className="text-[10px] text-purple-300">
                  সম্পূর্ণ $০ খরচে ক্লায়েন্ট-সাইড প্রসিডিউরাল ওয়েব অডিও গান কম্পোজিশন
                </span>
              </div>
            </div>

            {onOpenAudioStudio && (
              <button
                type="button"
                onClick={onOpenAudioStudio}
                className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 px-3 py-1.5 text-xs font-bold text-white shadow-md transition-all ml-auto"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>৩০সে. অডিও ইঞ্জিনে গান তৈরি করুন</span>
              </button>
            )}
          </div>

          {/* SECTION 1: YouTube URL Input */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3 space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <LinkIcon className="h-3.5 w-3.5 text-red-400" />
              <span>যেকোনো ইউটিউব ভিডিও লিঙ্ক দিন (YouTube URL):</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={ytInputUrl}
                onChange={(e) => setYtInputUrl(e.target.value)}
                placeholder="যেমন: https://www.youtube.com/watch?v=... বা https://youtu.be/..."
                className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-red-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleFetchYouTubeLink}
                disabled={isLoadingYt || !ytInputUrl.trim()}
                className="flex items-center gap-1.5 rounded-lg bg-red-600 hover:bg-red-500 px-3 py-1.5 text-xs font-bold text-white shadow transition-all disabled:opacity-50"
              >
                {isLoadingYt ? (
                  <span>লোড হচ্ছে...</span>
                ) : (
                  <>
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span>ইউটিউব থেকে আনুন</span>
                  </>
                )}
              </button>
            </div>

            {ytError && (
              <p className="text-[11px] text-red-400 font-medium">⚠️ {ytError}</p>
            )}

            {/* Resolved YouTube Track Card */}
            {config.youtubeResolvedInfo && (
              <div className="mt-2 flex items-center justify-between p-2 rounded-lg bg-red-950/30 border border-red-500/30">
                <div className="flex items-center gap-2.5">
                  {config.youtubeResolvedInfo.thumbnailUrl && (
                    <img
                      src={config.youtubeResolvedInfo.thumbnailUrl}
                      alt="YouTube thumbnail"
                      className="h-10 w-14 object-cover rounded border border-slate-700 shrink-0"
                    />
                  )}
                  <div className="text-left">
                    <div className="text-xs font-bold text-white line-clamp-1">
                      {config.youtubeResolvedInfo.title}
                    </div>
                    <div className="text-[10px] text-red-400">
                      চ্যানেল: {config.youtubeResolvedInfo.author || 'YouTube'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                    ✓ নির্বাচিত
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 2: Curated YouTube Music Library by Category */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Headphones className="h-3.5 w-3.5 text-red-400" />
                <span>জনপ্রিয় ইউটিউব ক্রিয়েটর মিউজিক লাইব্রেরি (Royalty-Free):</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                {filteredTracks.length}টি ট্র্যাক প্রস্তুত
              </span>
            </div>

            {/* Category Filter Chips */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-1 shrink-0 rounded-lg px-2.5 py-1 text-[11px] font-semibold border transition-all ${
                    selectedCategory === cat.id
                      ? 'border-red-500 bg-red-950/60 text-red-300 shadow-sm'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>

            {/* Track Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
              {filteredTracks.map((track) => {
                const isSelected = config.selectedTrack?.id === track.id;
                const isPreviewing = previewTrackId === track.id && isPlayingPreview;

                return (
                  <div
                    key={track.id}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                      isSelected
                        ? 'border-red-500 bg-red-950/30 text-white ring-1 ring-red-500/40'
                        : 'border-slate-800 bg-slate-950/70 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {track.thumbnailUrl && (
                        <div className="relative h-10 w-10 shrink-0 rounded-lg overflow-hidden border border-slate-800">
                          <img
                            src={track.thumbnailUrl}
                            alt={track.title}
                            className="h-full w-full object-cover"
                          />
                          {isPreviewing && (
                            <div className="absolute inset-0 bg-red-600/40 flex items-center justify-center">
                              <span className="h-2 w-2 rounded-full bg-white animate-ping"></span>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="min-w-0">
                        <div className="text-xs font-bold truncate text-slate-100">
                          {track.titleBn}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate flex items-center gap-1.5">
                          <span>{track.artist}</span>
                          <span>•</span>
                          <span className="text-amber-400 font-mono">{track.bpm} BPM</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      {/* Play/Pause Preview Button */}
                      <button
                        type="button"
                        onClick={() => togglePreview(track)}
                        title={isPreviewing ? 'থামান' : 'শুনুন'}
                        className={`p-1.5 rounded-lg border transition-all ${
                          isPreviewing
                            ? 'bg-amber-600 text-white border-amber-500 animate-pulse'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                        }`}
                      >
                        {isPreviewing ? (
                          <Pause className="h-3 w-3" />
                        ) : (
                          <Play className="h-3 w-3 fill-current" />
                        )}
                      </button>

                      {/* Select Track Button */}
                      <button
                        type="button"
                        onClick={() => handleSelectTrack(track)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                          isSelected
                            ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                        }`}
                      >
                        {isSelected ? '✓ যুক্ত' : 'যুক্ত করুন'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION 3: Custom Audio / YouTube MP3 Upload */}
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <Upload className="h-4 w-4 text-amber-400" />
              <div>
                <span className="font-semibold text-slate-200 block text-[11px]">
                  ইউটিউব থেকে নামানো বা নিজস্ব MP3 অডিও দিন:
                </span>
                <span className="text-[10px] text-slate-500">
                  {config.customAudioName ? `ফাইল: ${config.customAudioName}` : 'MP3, WAV, M4A সাপোর্ট'}
                </span>
              </div>
            </div>

            <label className="cursor-pointer rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 px-2.5 py-1 text-[11px] font-semibold text-slate-300 hover:text-white transition-colors">
              <span>ফাইল আপলোড করুন</span>
              <input
                type="file"
                accept="audio/*"
                onChange={handleCustomAudioUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* SECTION 4: Multi-Track Studio Audio Mixer Controls */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/90 p-3 space-y-3">
            <div className="flex items-center justify-between text-xs border-b border-slate-800/80 pb-2">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Sliders className="h-3.5 w-3.5 text-cyan-400" />
                <span>মাল্টি-ট্র্যাক অডিও মিক্সার (Dual-Track Mixer):</span>
              </span>
              <span className="text-[10px] text-cyan-400 font-mono">
                CanvasRecorder অডিও সিঙ্ক
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Music Volume Slider */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-slate-300 font-medium text-[11px] flex items-center gap-1">
                    <Music className="h-3 w-3 text-red-400" />
                    <span>ব্যাকগ্রাউন্ড মিউজিক ভলিউম:</span>
                  </label>
                  <span className="font-mono text-[10px] text-red-400 font-bold">
                    {Math.round(config.musicVolume * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={config.musicVolume}
                  onChange={(e) => handleUpdate({ musicVolume: Number(e.target.value) })}
                  className="w-full accent-red-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Voice Volume Slider */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-slate-300 font-medium text-[11px] flex items-center gap-1">
                    <Radio className="h-3 w-3 text-emerald-400" />
                    <span>উপস্থাপকের ভয়েস ভলিউম:</span>
                  </label>
                  <span className="font-mono text-[10px] text-emerald-400 font-bold">
                    {Math.round(config.voiceVolume * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="1.5"
                  step="0.05"
                  value={config.voiceVolume}
                  onChange={(e) => handleUpdate({ voiceVolume: Number(e.target.value) })}
                  className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Smart Auto-Ducking & Loop Options */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/80 pt-2 text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.enableDucking}
                  onChange={(e) => handleUpdate({ enableDucking: e.target.checked })}
                  className="rounded border-slate-700 bg-slate-900 text-red-600 focus:ring-red-500 h-3.5 w-3.5"
                />
                <span className="text-[11px] text-slate-300">
                  🎚️ <strong>অটো ভয়েস ডাকিং (Smart Ducking):</strong> কথা বলার সময় মিউজিকের শব্দ স্বয়ংক্রিয় কমবে
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.loop}
                  onChange={(e) => handleUpdate({ loop: e.target.checked })}
                  className="rounded border-slate-700 bg-slate-900 text-red-600 focus:ring-red-500 h-3.5 w-3.5"
                />
                <span className="text-[11px] text-slate-300">
                  🔁 পুরো ভিডিও চলাকালীন মিউজিক লুপ হবে
                </span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
