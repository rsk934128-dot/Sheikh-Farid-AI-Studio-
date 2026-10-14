import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Film,
  Play,
  Square,
  Download,
  Sparkles,
  Volume2,
  VolumeX,
  Palette,
  Type,
  Smartphone,
  Monitor,
  Layout,
  Clock,
  Layers,
  CheckCircle2,
  Share2,
  Zap,
  Sliders,
  Flame,
  HelpCircle,
  Eye,
  RotateCcw,
  Radio,
  Tv,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  User,
  Smile,
  Mic,
  MicOff,
  Hand,
  Award,
  Upload,
  Music,
  Trash2,
  Headphones,
  AlertCircle,
  Image as ImageIcon,
  Wand2,
  Camera,
  Sun,
  RefreshCw,
  X,
  SlidersHorizontal,
  Check,
  Pause,
  Video,
  FileVideo,
  HardDrive,
  Gauge,
} from 'lucide-react';
import {
  CanvasRecorder,
  CanvasRecordingResult,
  RECORDER_QUALITY_PRESETS,
  getOptimalMimeType,
} from './CanvasRecorder';
import {
  drawHumanAvatar,
  AvatarId,
  AvatarPose,
  AvatarExpression,
  AvatarGesture,
  AVATAR_PROFILES,
} from './HumanAvatarEngine';
import {
  CanvasColorFilterConfig,
  DEFAULT_COLOR_FILTER_CONFIG,
  buildCanvasFilterCss,
  isFilterActive,
  COLOR_FILTER_PRESETS,
} from './CanvasColorFilters';
import { ColorFilterControls } from './ColorFilterControls';
import {
  YouTubeMusicHub,
  BackgroundMusicConfig,
  DEFAULT_MUSIC_CONFIG,
} from './YouTubeMusicHub';
import { ProceduralMusicPlayer } from './YouTubeMusicEngine';

export type TextAnimStyle = 'kinetic-bounce' | 'typewriter' | 'slide-fade' | 'neon-glow' | 'wave-motion';
export type TransitionEffect = 'wipe-left' | 'fade-dissolve' | 'iris-circle' | 'zoom-burst';
export type AudioSourceMode = 'record-clip' | 'live-mic' | 'upload-audio' | 'ai-synth';
export type ColorGradeMood = 'cinematic-studio' | 'warm-broadcast' | 'cyber-teal' | 'golden-hour';

export interface StoryScene {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  duration: number; // in seconds
  imageUrl?: string;
  imagePrompt?: string;
}

export interface PresetScript {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  badge: string;
  theme: 'emerald' | 'amber' | 'cyan' | 'purple';
  tickerText: string;
  defaultImage: string;
  scenes: StoryScene[];
}

export interface RealisticBackdropPreset {
  id: string;
  titleBn: string;
  categoryBn: string;
  url: string;
  prompt: string;
}

// Curated 4K Photorealistic Broadcast & Studio Backdrops (High-Speed CDN, CORS Allowed)
export const PRESET_REALISTIC_BACKDROPS: RealisticBackdropPreset[] = [
  {
    id: 'studio-news-4k',
    titleBn: '৪কে টেলিভিশন নিউজ স্টুডিও',
    categoryBn: 'সংবাদ ও জাতীয় সম্প্রচার',
    url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1200&auto=format&fit=crop',
    prompt: 'Ultra-realistic 4K national television broadcast studio with curved glowing LED video walls and glossy reflective news anchor platform, cinematic television studio lighting',
  },
  {
    id: 'smart-citizen-desk',
    titleBn: 'স্মার্ট সিটিজেন সার্ভিস সেন্টার',
    categoryBn: 'সরকারি ডিজিটাল সেবা',
    url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop',
    prompt: 'Modern government citizen service digital center in Dhaka, high-tech glass architecture, clean digital service kiosks with illuminated signs',
  },
  {
    id: 'cyber-command-center',
    titleBn: 'হাই-টেক সাইবার সিকিউরিটি ওয়ার রুম',
    categoryBn: 'সাইবার ক্রাইম ও টেকনোলজি',
    url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop',
    prompt: 'High-tech cybersecurity command center with multiple glowing blue holographic data monitors, dark futuristic server room atmosphere',
  },
  {
    id: 'corporate-pension-hq',
    titleBn: 'কর্পোরেট পেনশন ও ব্যাংকিং হেডকোয়ার্টার',
    categoryBn: 'অর্থনীতি ও পেনশন স্কিম',
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop',
    prompt: 'Ultra-modern financial banking glass corporate tower interior, luxury conference room overlooking modern metropolis, cinematic golden hour lighting',
  },
  {
    id: 'media-podcast-lounge',
    titleBn: 'পডকাস্ট ও মিডিয়া ক্রিয়েটর স্টুডিও',
    categoryBn: 'ইউটিউব ও কনটেন্ট ক্রিয়েশন',
    url: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=1200&auto=format&fit=crop',
    prompt: 'Professional acoustic soundproof podcast recording studio with warm atmospheric amber lighting and high-end condenser microphones',
  },
  {
    id: 'tech-developer-hub',
    titleBn: 'আইটি ফ্রিল্যান্সার ও এআই ল্যাব ঢাকা',
    categoryBn: 'ফ্রিল্যান্সিং ও উদ্ভাবন',
    url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1200&auto=format&fit=crop',
    prompt: 'Ergonomic software developer workstation with multi-monitor glowing screens, indoor plants, warm modern architectural interior',
  },
  {
    id: 'dhaka-skyline-sunset',
    titleBn: 'ঢাকা মেগাসিটি সিনেমাটিক সানসেট',
    categoryBn: 'মেগাসিটি ও আধুনিক বাংলাদেশ',
    url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=1200&auto=format&fit=crop',
    prompt: 'Cinematic aerial view of modern metropolis skyline during sunset golden hour, illuminated highways and architectural bridges, 8k photography',
  },
  {
    id: 'green-riverfront-bd',
    titleBn: 'সবুজ শ্যামল বাংলাদেশ সিনেমাটিক নদী',
    categoryBn: 'প্রকৃতি ও রূপসী বাংলা',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
    prompt: 'Breathtaking serene riverfront with lush tropical greenery, peaceful morning sunrise mist over water, ultra realistic nature photography',
  },
];

const PRESET_SCRIPTS: PresetScript[] = [
  {
    id: 'gov-tech',
    category: 'নাগরিক সেবা ও পেনশন',
    title: 'স্মার্ট পেনশন স্কিম ২০২৬',
    subtitle: 'এখনই নিবন্ধন করুন প্রত্যয় স্কিমে এবং নিশ্চিত করুন সুরক্ষিত ভবিষ্যৎ।',
    badge: 'জরুরি বিজ্ঞপ্তি • বাংলাদেশ সরকার',
    theme: 'emerald',
    tickerText: '📢 ব্রেকিং নিউজ: সর্বজনীন পেনশন স্কিমে অনলাইনে তাৎক্ষণিক নিবন্ধন করুন • ফি মাত্র ০ টাকা • সুরক্ষিত জীবন সবার অধিকার',
    defaultImage: PRESET_REALISTIC_BACKDROPS[1].url,
    scenes: [
      {
        id: 's1',
        badge: '📢 জরুরি ঘোষণা',
        title: 'আপনার ভবিষ্যৎ কি নিরাপদ?',
        subtitle: 'সর্বজনীন পেনশনে অনলাইনে ঘরে বসেই মাত্র ৩ মিনিটে যুক্ত হোন।',
        duration: 3,
        imageUrl: PRESET_REALISTIC_BACKDROPS[1].url,
        imagePrompt: 'Modern citizen service center Bangladesh',
      },
      {
        id: 's2',
        badge: '💡 মূল সুবিধা',
        title: 'প্রতিমাসে নিশ্চিত পেনশনের নিশ্চয়তা',
        subtitle: 'প্রবাস, প্রগতি, সুরক্ষা কিংবা সমতা স্কিমে আপনার পছন্দমতো সঞ্চয়।',
        duration: 4,
        imageUrl: PRESET_REALISTIC_BACKDROPS[3].url,
        imagePrompt: 'Corporate banking and pension financial office',
      },
      {
        id: 's3',
        badge: '🚀 এখনই করণীয়',
        title: 'আজই রেজিস্ট্রেশন সম্পন্ন করুন',
        subtitle: 'ভিজিট করুন upension.gov.bd অথবা নিকটস্থ ডিজিটাল সেন্টারে।',
        duration: 3,
        imageUrl: PRESET_REALISTIC_BACKDROPS[0].url,
        imagePrompt: 'Ultra realistic news studio broadcast',
      },
    ],
  },
  {
    id: 'cyber-safe',
    category: 'সাইবার নিরাপত্তা সতর্কতা',
    title: 'ওটিপি (OTP) ও পাসওয়ার্ড কাউকে বলবেন না',
    subtitle: 'ব্যাংক বা বিকাশ কর্মকর্তা পরিচয়ে ফোন দিলে সাবধান থাকুন!',
    badge: 'সাইবার এলার্ট • সাইবার পুলিশ',
    theme: 'cyan',
    tickerText: '⚠️ সাইবার নিরাপত্তা সতর্কবার্তা: ব্যাংক বা বিকাশ কখনো আপনার পিন (PIN) বা OTP চাইবে না • প্রতারক থেকে সাবধান থাকুন',
    defaultImage: PRESET_REALISTIC_BACKDROPS[2].url,
    scenes: [
      {
        id: 's1',
        badge: '⚠️ সতর্কবার্তা',
        title: 'হঠাৎ ব্যাংক থেকে ফোন এসেছে?',
        subtitle: 'অ্যাকাউন্ট ভেরিফিকেশনের নামে কেউ কি ওটিপি চাচ্ছে?',
        duration: 3,
        imageUrl: PRESET_REALISTIC_BACKDROPS[2].url,
        imagePrompt: 'High tech cyber security command center',
      },
      {
        id: 's2',
        badge: '🛑 সাবধান থাকুন',
        title: 'কোনো অবস্থাতেই পিন বা ওটিপি শেয়ার করবেন না',
        subtitle: 'প্রকৃত ব্যাংক কর্মকর্তা কখনোই আপনার গোপন পাসওয়ার্ড চাইবেন না।',
        duration: 4,
        imageUrl: PRESET_REALISTIC_BACKDROPS[0].url,
        imagePrompt: '4K television studio breaking news',
      },
      {
        id: 's3',
        badge: '🛡️ নিরাপত্তা টিপস',
        title: 'প্রতারণার শিকার হলে ১৬১২৬ নাম্বারে জানান',
        subtitle: 'ডিজিটাল বাংলাদেশে সচেতনতাই আপনার সবচেয়ে বড় সুরক্ষা।',
        duration: 3,
        imageUrl: PRESET_REALISTIC_BACKDROPS[5].url,
        imagePrompt: 'Cyber security operation hub',
      },
    ],
  },
  {
    id: 'freelance-tips',
    category: 'ফ্রিল্যান্সিং ও ক্যারিয়ার',
    title: 'জিরো কস্টে এআই ভিডিও বানিয়ে আয় করুন',
    subtitle: 'মোবাইল বা পিসি দিয়েই প্রফেশনাল শর্টস ও রিল তৈরি সম্ভব।',
    badge: 'ডিজিটাল স্কিল • শেখ ফরিদ আইটি',
    theme: 'purple',
    tickerText: '🔥 ডিজিটাল স্কিল আপডেট: ক্যানভাস এনিমেশন ও স্মার্ট এআই অবতার ব্যবহার করে ফেসবুক ও ইউটিউবের জন্য ভাইরাল ভিডিও বানান',
    defaultImage: PRESET_REALISTIC_BACKDROPS[5].url,
    scenes: [
      {
        id: 's1',
        badge: '🔥 মেগা ট্রিক',
        title: 'ভিডিও বানাতে হাজার টাকার সফটওয়্যার লাগে না',
        subtitle: 'ব্রাউজার দিয়েই ফ্রিতে প্রফেশনাল অ্যানিমেটেড ভিডিও বানান।',
        duration: 3,
        imageUrl: PRESET_REALISTIC_BACKDROPS[5].url,
        imagePrompt: 'Modern IT freelancer workspace with dual monitors',
      },
      {
        id: 's2',
        badge: '⚡ হাই স্পিড রেন্ডার',
        title: 'ডিজিটাল এআই অবতার ও বাংলা ভয়েসওভার',
        subtitle: 'ক্লিক করলেই তৈরি হবে ফেসবুক ও ইউটিউব রিলের জন্য আকর্ষণীয় কনটেন্ট।',
        duration: 4,
        imageUrl: PRESET_REALISTIC_BACKDROPS[4].url,
        imagePrompt: 'Professional media podcast studio warm light',
      },
      {
        id: 's3',
        badge: '💰 আয়ের সুযোগ',
        title: 'আজই শুরু করুন আপনার কনটেন্ট ক্রিয়েশন যাত্রা',
        subtitle: 'স্মার্ট প্রেজেন্টার ফারুক ও ফারজানার সাথে আপনার চ্যানেল সাজান।',
        duration: 3,
        imageUrl: PRESET_REALISTIC_BACKDROPS[6].url,
        imagePrompt: 'Dhaka modern skyline golden hour sunset',
      },
    ],
  },
  {
    id: 'gd-helper',
    category: 'সিটিজেন আইনি ড্রাফট',
    title: 'অনলাইন জিডি (GD) করার সঠিক নিয়ম',
    subtitle: 'এনআইডি বা মোবাইল হারালে ঘরে বসেই সিটিজেনডেস্কে জিডি ড্রাফট প্রস্তুত করুন।',
    badge: 'সার্ভিস সরকার • CitizenDesk BD',
    theme: 'amber',
    tickerText: '📝 নাগরিক সেবা: অনলাইনে জিডি করতে কোনো fee লাগে না • জাতীয় পরিচয়পত্র বা প্রয়োজনীয় দলিলের কপি সাথে রাখুন',
    defaultImage: PRESET_REALISTIC_BACKDROPS[1].url,
    scenes: [
      {
        id: 's1',
        badge: '📄 জিডি সহায়তা',
        title: 'প্রয়োজনীয় দলিল বা মোবাইল হারিয়েছে?',
        subtitle: 'থানায় না গিয়েই সিটিজেনডেস্কে ২ মিনিটে ফরম পূরণ করুন।',
        duration: 3,
        imageUrl: PRESET_REALISTIC_BACKDROPS[1].url,
        imagePrompt: 'Citizen legal desk and modern municipal office',
      },
      {
        id: 's2',
        badge: '⚖️ নিয়মাবলী',
        title: 'সঠিক থানা ও সময় নির্বাচন করুন',
        subtitle: 'সঠিক তথ্যাদি দিয়ে নির্ভুল জিডি ড্রাফট তাৎক্ষণিক প্রিন্টযোগ্য।',
        duration: 4,
        imageUrl: PRESET_REALISTIC_BACKDROPS[3].url,
        imagePrompt: 'Corporate modern office with glass windows',
      },
      {
        id: 's3',
        badge: '✨ পরামর্শ',
        title: 'সুরক্ষিত থাকুন ও আইনি পরামর্শ নিন',
        subtitle: 'CitizenDesk BD — সহজ নাগরিক সেবার ডিজিটাল পোর্টাল।',
        duration: 3,
        imageUrl: PRESET_REALISTIC_BACKDROPS[0].url,
        imagePrompt: 'Television broadcast studio background',
      },
    ],
  },
];

export interface ZeroCostVideoStudioProps {
  initialAudioTrack?: {
    title: string;
    blob?: Blob;
    url?: string;
    presetKey: string;
  } | null;
  onOpenAudioStudio?: () => void;
}

export const ZeroCostVideoStudio: React.FC<ZeroCostVideoStudioProps> = ({
  initialAudioTrack,
  onOpenAudioStudio,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<PresetScript>(PRESET_SCRIPTS[0]);
  const [videoTitle, setVideoTitle] = useState<string>(PRESET_SCRIPTS[0].title);
  const [videoSubtitle, setVideoSubtitle] = useState<string>(PRESET_SCRIPTS[0].subtitle);
  const [videoBadge, setVideoBadge] = useState<string>(PRESET_SCRIPTS[0].badge);
  const [tickerText, setTickerText] = useState<string>(PRESET_SCRIPTS[0].tickerText);
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '16:9' | '1:1'>('9:16');
  const [activeTheme, setActiveTheme] = useState<'emerald' | 'amber' | 'cyan' | 'purple'>('emerald');
  const [enableSound, setEnableSound] = useState<boolean>(true);
  const [enableVoiceover, setEnableVoiceover] = useState<boolean>(true);

  // Audio Voice Source Selection
  const [audioSourceMode, setAudioSourceMode] = useState<AudioSourceMode>('record-clip');
  const [isVoiceRecording, setIsVoiceRecording] = useState<boolean>(false);
  const [voiceRecordSeconds, setVoiceRecordSeconds] = useState<number>(0);
  const [recordedVoiceBlob, setRecordedVoiceBlob] = useState<Blob | null>(null);
  const [recordedVoiceUrl, setRecordedVoiceUrl] = useState<string | null>(null);
  const [isPlayingRecordedVoice, setIsPlayingRecordedVoice] = useState<boolean>(false);

  // Uploaded Audio
  const [uploadedAudioFile, setUploadedAudioFile] = useState<File | null>(null);
  const [uploadedAudioUrl, setUploadedAudioUrl] = useState<string | null>(null);
  const [uploadedAudioBuffer, setUploadedAudioBuffer] = useState<AudioBuffer | null>(null);
  const [micErrorMessage, setMicErrorMessage] = useState<string | null>(null);
  const [micFallbackNotice, setMicFallbackNotice] = useState<string | null>(null);
  const [recorderErrorMsg, setRecorderErrorMsg] = useState<string | null>(null);

  // ==========================================
  // REALISTIC IMAGE & AI GENERATOR STATE
  // ==========================================
  const [currentBackdropMode, setCurrentBackdropMode] = useState<'ai-generate' | 'preset-gallery' | 'upload-image'>('ai-generate');
  const [customAiPrompt, setCustomAiPrompt] = useState<string>('৪কে টেলিভিশন নিউজ স্টুডিও, এলইডি ভিডিও ওয়াল, সিনেমাটিক লাইটিং');
  const [isGeneratingImage, setIsGeneratingImage] = useState<boolean>(false);
  const [generatedImagesHistory, setGeneratedImagesHistory] = useState<string[]>([
    PRESET_REALISTIC_BACKDROPS[0].url,
    PRESET_REALISTIC_BACKDROPS[1].url,
    PRESET_REALISTIC_BACKDROPS[2].url,
    PRESET_REALISTIC_BACKDROPS[4].url,
  ]);
  const [activeBackdropUrl, setActiveBackdropUrl] = useState<string>(PRESET_REALISTIC_BACKDROPS[0].url);
  const [applyToAllScenes, setApplyToAllScenes] = useState<boolean>(false);
  const [enableKenBurns, setEnableKenBurns] = useState<boolean>(true); // Cinematic camera motion (zoom & pan)
  const [enableCinematicAtmosphere, setEnableCinematicAtmosphere] = useState<boolean>(true); // Particles, vignette, lighting rays
  const [enableLiveOverlay, setEnableLiveOverlay] = useState<boolean>(true); // "🔴 LIVE • ঢাকা" 4K broadcast tag
  const [colorGradeMood, setColorGradeMood] = useState<ColorGradeMood>('cinematic-studio');

  // Animation & Transitions
  const [textAnimStyle, setTextAnimStyle] = useState<TextAnimStyle>('kinetic-bounce');
  const [transitionEffect, setTransitionEffect] = useState<TransitionEffect>('wipe-left');
  const [multiSceneMode, setMultiSceneMode] = useState<boolean>(true);
  const [scenes, setScenes] = useState<StoryScene[]>(PRESET_SCRIPTS[0].scenes);
  const [activeSceneIndex, setActiveSceneIndex] = useState<number>(0);
  const [enableTicker, setEnableTicker] = useState<boolean>(true);
  const [enableLowerThird, setEnableLowerThird] = useState<boolean>(true);
  const [showGuide, setShowGuide] = useState<boolean>(false);

  // Digital Human Avatar Presenter State
  const [enableAvatar, setEnableAvatar] = useState<boolean>(true);
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarId>('farzana');
  const [avatarPose, setAvatarPose] = useState<AvatarPose>('studio-desk');
  const [avatarExpression, setAvatarExpression] = useState<AvatarExpression>('friendly');
  const [avatarGesture, setAvatarGesture] = useState<AvatarGesture>('welcome');
  const [isAvatarTesting, setIsAvatarTesting] = useState<boolean>(false);
  const [customPresenterPhotoUrl, setCustomPresenterPhotoUrl] = useState<string | null>(null);
  const [customPresenterName, setCustomPresenterName] = useState<string>('বিশেষ উপস্থাপক');

  // Real-Time Canvas Color Filter State (Grayscale, Sepia, Invert, etc.)
  const [colorFilterConfig, setColorFilterConfig] = useState<CanvasColorFilterConfig>(DEFAULT_COLOR_FILTER_CONFIG);

  // YouTube Background Music & Multi-Track Mixing State
  const [musicConfig, setMusicConfig] = useState<BackgroundMusicConfig>(DEFAULT_MUSIC_CONFIG);

  // Synchronize when 30-Second Audio Engine sends a song to the studio
  useEffect(() => {
    if (initialAudioTrack) {
      setMusicConfig((prev) => ({
        ...prev,
        enabled: true,
        customAudioUrl: initialAudioTrack.url || null,
        customAudioName: initialAudioTrack.title,
        selectedTrack: {
          id: `30s-audio-${Date.now()}`,
          title: initialAudioTrack.title,
          titleBn: initialAudioTrack.title,
          artist: '৩০সে. অডিও ইঞ্জিন',
          category: 'acoustic',
          categoryBn: 'প্রসিডিউরাল গান',
          duration: 30,
          bpm: 100,
          mood: 'প্রসিডিউরাল গান',
          audioUrl: initialAudioTrack.url,
          proceduralPreset: (initialAudioTrack.presetKey as any) || 'news-broadcast',
          descriptionBn: '৩০ সেকেন্ডের অডিও মিউজিক ইঞ্জিন থেকে সরাসরি সংগৃহীত',
        },
      }));
    }
  }, [initialAudioTrack]);

  // Recording & Playback State (CanvasRecorder Engine)
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isRecordingPaused, setIsRecordingPaused] = useState<boolean>(false);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
  const [recordProgress, setRecordProgress] = useState<number>(0);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [recorderQuality, setRecorderQuality] = useState<'standard' | 'high' | 'ultra'>('standard');
  const [recordingResult, setRecordingResult] = useState<CanvasRecordingResult | null>(null);
  const [snapshotFeedback, setSnapshotFeedback] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const canvasRecorderRef = useRef<CanvasRecorder | null>(null);
  const recordingTimerIntervalRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const voiceRecorderRef = useRef<MediaRecorder | null>(null);
  const voiceRecordIntervalRef = useRef<any>(null);
  const voiceAudioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const liveMicStreamRef = useRef<MediaStream | null>(null);
  const proceduralMusicPlayerRef = useRef<ProceduralMusicPlayer | null>(null);
  const backgroundAudioSourceNodeRef = useRef<AudioBufferSourceNode | null>(null);

  // Synchronous refs for 60fps canvas rendering loop
  const colorFilterConfigRef = useRef<CanvasColorFilterConfig>(colorFilterConfig);
  colorFilterConfigRef.current = colorFilterConfig;
  const musicConfigRef = useRef<BackgroundMusicConfig>(musicConfig);
  musicConfigRef.current = musicConfig;
  const customPresenterPhotoUrlRef = useRef<string | null>(customPresenterPhotoUrl);
  customPresenterPhotoUrlRef.current = customPresenterPhotoUrl;
  const customPresenterNameRef = useRef<string>(customPresenterName);
  customPresenterNameRef.current = customPresenterName;

  // In-memory HTMLImageElement Cache to prevent canvas flickering
  const imageCacheRef = useRef<Map<string, HTMLImageElement>>(new Map());

  // Helper: Retrieve or preload Image
  const getOrLoadImage = useCallback((url: string): HTMLImageElement | null => {
    if (!url) return null;
    let img = imageCacheRef.current.get(url);
    if (!img) {
      img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = url;
      imageCacheRef.current.set(url, img);
    }
    return img.complete && img.naturalWidth > 0 ? img : null;
  }, []);

  // Dimensions based on aspect ratio
  const getCanvasDimensions = () => {
    switch (aspectRatio) {
      case '9:16':
        return { width: 540, height: 960 };
      case '16:9':
        return { width: 960, height: 540 };
      default:
        return { width: 720, height: 720 };
    }
  };

  const { width: canvasWidth, height: canvasHeight } = getCanvasDimensions();
  const totalSceneDuration = scenes.reduce((acc, s) => acc + s.duration, 0);

  // Load Preset
  const handleSelectPreset = (preset: PresetScript) => {
    setSelectedPreset(preset);
    setVideoTitle(preset.title);
    setVideoSubtitle(preset.subtitle);
    setVideoBadge(preset.badge);
    setTickerText(preset.tickerText);
    setActiveTheme(preset.theme);
    setScenes(preset.scenes);
    if (preset.defaultImage) {
      setActiveBackdropUrl(preset.defaultImage);
    }
  };

  // Helper: Wrap text on Canvas
  const wrapText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number
  ) => {
    const words = text.split(' ');
    let line = '';
    let currentY = y;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line.trim(), x, currentY);
        line = words[n] + ' ';
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line.trim(), x, currentY);
    return currentY;
  };

  // ==========================================
  // REALISTIC AI IMAGE GENERATION ENGINE ($0)
  // ==========================================
  const handleGenerateAIImage = async (promptOverride?: string) => {
    const targetPrompt = promptOverride || customAiPrompt;
    if (!targetPrompt.trim()) return;

    setIsGeneratingImage(true);

    try {
      // Prompt enhancement with cinematic realism photography keywords
      const enhancedPrompt = `${targetPrompt.trim()}, photorealistic 8k photography, architectural digest, hyperrealistic television studio broadcast interior, volumetric cinematic rim lighting, 35mm lens, award-winning cinematography, ultra detailed, depth of field`;

      // Resolution based on aspect ratio
      const imgW = aspectRatio === '9:16' ? 576 : aspectRatio === '16:9' ? 1024 : 768;
      const imgH = aspectRatio === '9:16' ? 1024 : aspectRatio === '16:9' ? 576 : 768;
      const seed = Math.floor(Math.random() * 900000) + 100000;

      // Pollinations zero-cost Flux model
      const aiImageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
        enhancedPrompt
      )}?width=${imgW}&height=${imgH}&seed=${seed}&nologo=true&model=flux`;

      // Preload image before setting
      const img = new Image();
      img.crossOrigin = 'anonymous';

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Image load failed'));
        img.src = aiImageUrl;
        // Timeout safeguard
        setTimeout(() => resolve(), 6000);
      });

      imageCacheRef.current.set(aiImageUrl, img);
      setActiveBackdropUrl(aiImageUrl);

      // Add to history
      setGeneratedImagesHistory((prev) => [aiImageUrl, ...prev.filter((u) => u !== aiImageUrl)].slice(0, 10));

      // Apply to scenes
      if (applyToAllScenes) {
        setScenes((prev) =>
          prev.map((sc) => ({
            ...sc,
            imageUrl: aiImageUrl,
            imagePrompt: targetPrompt,
          }))
        );
      } else {
        setScenes((prev) => {
          const updated = [...prev];
          if (updated[activeSceneIndex]) {
            updated[activeSceneIndex] = {
              ...updated[activeSceneIndex],
              imageUrl: aiImageUrl,
              imagePrompt: targetPrompt,
            };
          }
          return updated;
        });
      }
    } catch (err) {
      console.warn('AI Image generation warning:', err);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // Set Preset Backdrop
  const handleSelectBackdropPreset = (preset: RealisticBackdropPreset) => {
    setActiveBackdropUrl(preset.url);
    getOrLoadImage(preset.url);

    if (applyToAllScenes) {
      setScenes((prev) =>
        prev.map((sc) => ({
          ...sc,
          imageUrl: preset.url,
          imagePrompt: preset.titleBn,
        }))
      );
    } else {
      setScenes((prev) => {
        const updated = [...prev];
        if (updated[activeSceneIndex]) {
          updated[activeSceneIndex] = {
            ...updated[activeSceneIndex],
            imageUrl: preset.url,
            imagePrompt: preset.titleBn,
          };
        }
        return updated;
      });
    }
  };

  // Upload Custom Photo / Background
  const handleCustomPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageCacheRef.current.set(url, img);
      setActiveBackdropUrl(url);
      setGeneratedImagesHistory((prev) => [url, ...prev].slice(0, 10));

      if (applyToAllScenes) {
        setScenes((prev) => prev.map((sc) => ({ ...sc, imageUrl: url })));
      } else {
        setScenes((prev) => {
          const updated = [...prev];
          if (updated[activeSceneIndex]) {
            updated[activeSceneIndex] = { ...updated[activeSceneIndex], imageUrl: url };
          }
          return updated;
        });
      }
    };
    img.src = url;
  };

  // Upload Custom Presenter Photo (যেকোনো মানুষের ছবি দিয়ে উপস্থাপক তৈরি)
  const handlePresenterPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageCacheRef.current.set(url, img);
      setCustomPresenterPhotoUrl(url);
      setSelectedAvatar('custom-photo');
      setEnableAvatar(true);
    };
    img.src = url;
  };

  // 1-Click Instant Style for any uploaded photo or video production
  const applyPhotoStyle = (styleId: 'news' | 'cyberpunk' | 'noir' | 'sepia' | 'viral') => {
    if (styleId === 'news') {
      setActiveTheme('emerald');
      setColorGradeMood('cinematic-studio');
      setAvatarPose('studio-desk');
      setTextAnimStyle('kinetic-bounce');
      setColorFilterConfig({
        ...DEFAULT_COLOR_FILTER_CONFIG,
        contrast: 115,
        brightness: 102,
        saturate: 110,
        target: 'master',
      });
      setActiveBackdropUrl(PRESET_REALISTIC_BACKDROPS[0].url);
    } else if (styleId === 'cyberpunk') {
      setActiveTheme('cyan');
      setColorGradeMood('cyber-teal');
      setAvatarPose('side-anchor');
      setTextAnimStyle('neon-glow');
      setColorFilterConfig({
        ...DEFAULT_COLOR_FILTER_CONFIG,
        hueRotate: 285,
        saturate: 175,
        contrast: 130,
        brightness: 105,
        target: 'master',
      });
      setActiveBackdropUrl(PRESET_REALISTIC_BACKDROPS[2].url);
    } else if (styleId === 'noir') {
      setActiveTheme('purple');
      setColorGradeMood('cinematic-studio');
      setAvatarPose('side-anchor');
      setTextAnimStyle('typewriter');
      setColorFilterConfig({
        ...DEFAULT_COLOR_FILTER_CONFIG,
        grayscale: 100,
        contrast: 155,
        brightness: 92,
        target: 'master',
      });
      setActiveBackdropUrl(PRESET_REALISTIC_BACKDROPS[5].url);
    } else if (styleId === 'sepia') {
      setActiveTheme('amber');
      setColorGradeMood('golden-hour');
      setAvatarPose('pip-circle');
      setTextAnimStyle('slide-fade');
      setColorFilterConfig({
        ...DEFAULT_COLOR_FILTER_CONFIG,
        sepia: 95,
        contrast: 115,
        saturate: 110,
        target: 'master',
      });
      setActiveBackdropUrl(PRESET_REALISTIC_BACKDROPS[3].url);
    } else if (styleId === 'viral') {
      setActiveTheme('emerald');
      setAspectRatio('9:16');
      setColorGradeMood('warm-broadcast');
      setAvatarPose('side-anchor');
      setTextAnimStyle('kinetic-bounce');
      setColorFilterConfig({
        ...DEFAULT_COLOR_FILTER_CONFIG,
        saturate: 165,
        contrast: 120,
        brightness: 105,
        target: 'master',
      });
    }
  };

  // Human Vocal Formant Synthesizer
  const playProceduralBengaliVoice = (
    ctx: AudioContext,
    dest: MediaStreamAudioDestinationNode,
    durationSec: number
  ) => {
    const now = ctx.currentTime;
    const syllableCount = Math.floor(durationSec * 3.2);
    const isFemale = selectedAvatar === 'farzana';
    const basePitch = isFemale ? 220 : 135;

    for (let i = 0; i < syllableCount; i++) {
      const wordStart = now + i * 0.3 + Math.random() * 0.04;
      const wordLen = 0.22 + Math.random() * 0.06;

      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      const pitchVar = Math.sin(i * 1.3) * (isFemale ? 30 : 18) + (i % 4 === 0 ? 15 : -8);
      osc.frequency.setValueAtTime(basePitch + pitchVar, wordStart);
      osc.frequency.linearRampToValueAtTime(basePitch + pitchVar * 0.9, wordStart + wordLen);

      const f1 = ctx.createBiquadFilter();
      f1.type = 'bandpass';
      const f1Freq = (isFemale ? 650 : 500) + Math.sin(i) * 160;
      f1.frequency.setValueAtTime(f1Freq, wordStart);
      f1.Q.setValueAtTime(4.2, wordStart);

      const f2 = ctx.createBiquadFilter();
      f2.type = 'bandpass';
      const f2Freq = (isFemale ? 1900 : 1500) + Math.cos(i) * 350;
      f2.frequency.setValueAtTime(f2Freq, wordStart);
      f2.Q.setValueAtTime(4.8, wordStart);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, wordStart);
      gain.gain.linearRampToValueAtTime(0.12, wordStart + 0.04);
      gain.gain.setValueAtTime(0.1, wordStart + wordLen - 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, wordStart + wordLen);

      osc.connect(f1);
      f1.connect(f2);
      f2.connect(gain);
      gain.connect(dest);
      gain.connect(ctx.destination);

      osc.start(wordStart);
      osc.stop(wordStart + wordLen);
    }
  };

  // Procedural Transition Whoosh Sound
  const playWhooshSound = (ctx: AudioContext, dest?: MediaStreamAudioDestinationNode) => {
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sine';
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.15);
      filter.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.35);

      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(450, ctx.currentTime + 0.15);
      osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.35);

      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.15);
      gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      if (dest) gain.connect(dest);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.36);
    } catch {
      // Audio fallback
    }
  };

  // In-Studio Voice Clip Recorder
  const startRecordingVoiceClip = async () => {
    setMicErrorMessage(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setMicErrorMessage('আপনার ব্রাউজার বা ডিভাইসে সরাসরি মাইক্রোফোন অডিও রেকর্ডিং সাপোর্ট করে না। বিকল্প হিসেবে এআই সিন্থ ভয়েস, অডিও ফাইল বা ৩০সে. মিউজিক ইঞ্জিন ব্যবহার করুন।');
        return;
      }

      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });
      } catch (err: any) {
        console.warn('Microphone permission not granted:', err?.message || err);
        setMicErrorMessage('মাইক্রোফোন অনুমতি দেওয়া হয়নি (Permission Denied) বা ডিভাইসে মাইক্রোফোন পাওয়া যায়নি। আপনি ব্রাউজারে অনুমতি দিতে পারেন অথবা নিচের যেকোনো বিকল্প দিয়ে ভিডিও তৈরি করতে পারেন:');
        return;
      }

      const options = { mimeType: 'audio/webm;codecs=opus' };
      let recorder: MediaRecorder;
      try {
        recorder = new MediaRecorder(stream, options);
      } catch {
        recorder = new MediaRecorder(stream);
      }

      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: recorder.mimeType || 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setRecordedVoiceBlob(audioBlob);
        setRecordedVoiceUrl(url);
        setIsVoiceRecording(false);
        stream.getTracks().forEach((t) => t.stop());
      };

      voiceRecorderRef.current = recorder;
      recorder.start();
      setIsVoiceRecording(true);
      setVoiceRecordSeconds(0);

      voiceRecordIntervalRef.current = setInterval(() => {
        setVoiceRecordSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.warn('Microphone recording error:', err?.message || err);
      setMicErrorMessage('মাইক্রোফোন চালু করতে সমস্যা হয়েছে। বিকল্প হিসেবে এআই সিন্থেসাইজড কণ্ঠ বা অডিও ফাইল ব্যবহার করুন।');
    }
  };

  const stopRecordingVoiceClip = () => {
    if (voiceRecorderRef.current && voiceRecorderRef.current.state === 'recording') {
      voiceRecorderRef.current.stop();
    }
    if (voiceRecordIntervalRef.current) {
      clearInterval(voiceRecordIntervalRef.current);
    }
  };

  const clearRecordedVoiceClip = () => {
    if (recordedVoiceUrl) {
      URL.revokeObjectURL(recordedVoiceUrl);
    }
    setRecordedVoiceBlob(null);
    setRecordedVoiceUrl(null);
    setVoiceRecordSeconds(0);
    if (voiceAudioPlayerRef.current) {
      voiceAudioPlayerRef.current.pause();
    }
    setIsPlayingRecordedVoice(false);
  };

  const togglePlayRecordedVoice = () => {
    if (!recordedVoiceUrl) return;
    if (isPlayingRecordedVoice && voiceAudioPlayerRef.current) {
      voiceAudioPlayerRef.current.pause();
      setIsPlayingRecordedVoice(false);
    } else {
      const audio = new Audio(recordedVoiceUrl);
      voiceAudioPlayerRef.current = audio;
      audio.onended = () => setIsPlayingRecordedVoice(false);
      audio.play();
      setIsPlayingRecordedVoice(true);
    }
  };

  // Custom Audio File Upload Handler
  const handleAudioFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedAudioFile(file);
    const url = URL.createObjectURL(file);
    setUploadedAudioUrl(url);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const decodedBuffer = await ctx.decodeAudioData(arrayBuffer);
      setUploadedAudioBuffer(decodedBuffer);
      ctx.close();
    } catch (err) {
      console.error('Error decoding audio:', err);
    }
  };

  // ==========================================
  // REAL-TIME CANVAS ANIMATION & RENDER ENGINE
  // ==========================================
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let startTime = performance.now();
    let lastTransitionPlayed = -1;

    // Preload backdrops
    PRESET_REALISTIC_BACKDROPS.forEach((b) => getOrLoadImage(b.url));

    const renderFrame = (now: number) => {
      const elapsed = (now - startTime) / 1000;

      // 1. Scene timeline calculation
      let currentScene = scenes[0] || {
        badge: videoBadge,
        title: videoTitle,
        subtitle: videoSubtitle,
        duration: 3,
        imageUrl: activeBackdropUrl,
      };

      let sceneIdx = 0;
      let sceneLocalTime = elapsed;
      let isInTransition = false;
      let transitionProgress = 0;

      if (multiSceneMode && scenes.length > 0) {
        const loopDuration = Math.max(1, totalSceneDuration);
        const loopTime = elapsed % loopDuration;
        let accumTime = 0;

        for (let i = 0; i < scenes.length; i++) {
          const sc = scenes[i];
          if (loopTime >= accumTime && loopTime < accumTime + sc.duration) {
            currentScene = sc;
            sceneIdx = i;
            sceneLocalTime = loopTime - accumTime;
            break;
          }
          accumTime += sc.duration;
        }

        const transitionDuration = 0.55;
        if (sceneLocalTime < transitionDuration && sceneIdx !== 0) {
          isInTransition = true;
          transitionProgress = sceneLocalTime / transitionDuration;
          if (lastTransitionPlayed !== sceneIdx && enableSound && audioContextRef.current) {
            playWhooshSound(audioContextRef.current);
            lastTransitionPlayed = sceneIdx;
          }
        }
      }

      // Update active scene index for UI synchronization
      setActiveSceneIndex(sceneIdx);

      // Real-time Color Filter resolution
      const filterConfig = colorFilterConfigRef.current;
      const activeFilterCss = buildCanvasFilterCss(filterConfig);
      const isFiltered = isFilterActive(filterConfig);

      // 2. BACKDROP RENDERING: PHOTOREALISTIC IMAGE OR STUDIO GRADIENT
      ctx.save();
      ctx.filter = 'none';
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.restore();

      // Master output filter (affects entire composite)
      if (isFiltered && filterConfig.target === 'master') {
        ctx.filter = activeFilterCss;
      } else {
        ctx.filter = 'none';
      }

      const targetImageUrl = currentScene.imageUrl || activeBackdropUrl;
      const loadedImg = getOrLoadImage(targetImageUrl);

      if (loadedImg) {
        // --- CINEMATIC KEN BURNS CAMERA MOTION (Slow Push & Drift) ---
        const sceneDuration = Math.max(1, currentScene.duration);
        const progress = sceneLocalTime / sceneDuration;
        const scale = enableKenBurns ? 1.0 + progress * 0.12 : 1.0;
        const panX = enableKenBurns ? Math.sin(sceneIdx * 1.7 + progress * 1.4) * 18 : 0;
        const panY = enableKenBurns ? Math.cos(sceneIdx * 2.1 + progress * 1.1) * 10 : 0;

        // Image Aspect Cover math
        const imgRatio = loadedImg.naturalWidth / loadedImg.naturalHeight;
        const canvasRatio = canvas.width / canvas.height;
        let drawW: number;
        let drawH: number;

        if (imgRatio > canvasRatio) {
          drawH = canvas.height * scale;
          drawW = drawH * imgRatio;
        } else {
          drawW = canvas.width * scale;
          drawH = drawW / imgRatio;
        }

        const drawX = (canvas.width - drawW) / 2 + panX;
        const drawY = (canvas.height - drawH) / 2 + panY;

        ctx.save();
        if (isFiltered && (filterConfig.target === 'master' || filterConfig.target === 'media')) {
          ctx.filter = activeFilterCss;
        } else {
          ctx.filter = 'none';
        }
        ctx.drawImage(loadedImg, drawX, drawY, drawW, drawH);

        // Color Grading Tint Layer
        if (colorGradeMood === 'warm-broadcast') {
          ctx.fillStyle = 'rgba(251, 191, 36, 0.08)'; // Golden warm tint
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else if (colorGradeMood === 'cyber-teal') {
          ctx.fillStyle = 'rgba(6, 182, 212, 0.09)'; // Cold high-tech cyan
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else if (colorGradeMood === 'golden-hour') {
          ctx.fillStyle = 'rgba(249, 115, 22, 0.11)'; // Rich amber/sunset
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // Cinematic Contrast Gradients for Superior Text Readability
        // Top shadow gradient for header badge & live tag
        const topGrad = ctx.createLinearGradient(0, 0, 0, canvas.height * 0.35);
        topGrad.addColorStop(0, 'rgba(2, 6, 23, 0.85)');
        topGrad.addColorStop(0.6, 'rgba(2, 6, 23, 0.4)');
        topGrad.addColorStop(1, 'rgba(2, 6, 23, 0)');
        ctx.fillStyle = topGrad;
        ctx.fillRect(0, 0, canvas.width, canvas.height * 0.35);

        // Bottom shadow gradient for subtitles, anchor desk & ticker
        const bottomGrad = ctx.createLinearGradient(0, canvas.height * 0.45, 0, canvas.height);
        bottomGrad.addColorStop(0, 'rgba(2, 6, 23, 0)');
        bottomGrad.addColorStop(0.4, 'rgba(2, 6, 23, 0.55)');
        bottomGrad.addColorStop(1, 'rgba(2, 6, 23, 0.95)');
        ctx.fillStyle = bottomGrad;
        ctx.fillRect(0, canvas.height * 0.45, canvas.width, canvas.height * 0.55);

        ctx.restore();
      } else {
        // High-end Procedural Studio Gradient Fallback
        const grad = ctx.createRadialGradient(
          canvas.width / 2,
          canvas.height / 2,
          40,
          canvas.width / 2,
          canvas.height / 2,
          Math.max(canvas.width, canvas.height) * 0.75
        );

        if (activeTheme === 'emerald') {
          grad.addColorStop(0, '#064e3b');
          grad.addColorStop(0.5, '#022c22');
          grad.addColorStop(1, '#020617');
        } else if (activeTheme === 'cyan') {
          grad.addColorStop(0, '#0e7490');
          grad.addColorStop(0.5, '#083344');
          grad.addColorStop(1, '#020617');
        } else if (activeTheme === 'amber') {
          grad.addColorStop(0, '#78350f');
          grad.addColorStop(0.5, '#451a03');
          grad.addColorStop(1, '#020617');
        } else {
          grad.addColorStop(0, '#581c87');
          grad.addColorStop(0.5, '#3b0764');
          grad.addColorStop(1, '#020617');
        }

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Kinetic Studio Grid
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
        ctx.lineWidth = 1;
        const gridSize = 45;
        for (let x = 0; x < canvas.width; x += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
          ctx.stroke();
        }
        for (let y = 0; y < canvas.height; y += gridSize) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        }
        ctx.restore();
      }

      // --- ATMOSPHERIC CINEMATIC EFFECTS (Volumetric Light, Dust Bokeh, Vignette) ---
      if (enableCinematicAtmosphere) {
        ctx.save();

        // 1. Volumetric God-Ray Light Beam from top-left
        const rayGrad = ctx.createLinearGradient(0, 0, canvas.width * 0.8, canvas.height);
        rayGrad.addColorStop(0, 'rgba(255, 255, 255, 0.12)');
        rayGrad.addColorStop(0.3, 'rgba(255, 255, 255, 0.04)');
        rayGrad.addColorStop(0.8, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = rayGrad;
        ctx.beginPath();
        ctx.moveTo(canvas.width * 0.1, 0);
        ctx.lineTo(canvas.width * 0.5, 0);
        ctx.lineTo(canvas.width * 0.9, canvas.height);
        ctx.lineTo(0, canvas.height * 0.6);
        ctx.closePath();
        ctx.fill();

        // 2. Cinematic Floating Dust Motes & Bokeh Particles
        for (let p = 0; p < 18; p++) {
          const px = (Math.sin(p * 12.3 + elapsed * 0.4) * 0.5 + 0.5) * canvas.width;
          const py = (Math.cos(p * 8.7 + elapsed * 0.3) * 0.5 + 0.5) * canvas.height;
          const pr = 1.5 + Math.sin(elapsed * 2 + p) * 1.0;
          const pAlpha = 0.2 + Math.sin(elapsed * 3 + p) * 0.15;

          ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.05, pAlpha)})`;
          ctx.beginPath();
          ctx.arc(px, py, pr, 0, Math.PI * 2);
          ctx.fill();
        }

        // 3. Cinematic Lens Vignette (Edge Darkening)
        const vigGrad = ctx.createRadialGradient(
          canvas.width / 2,
          canvas.height / 2,
          Math.min(canvas.width, canvas.height) * 0.5,
          canvas.width / 2,
          canvas.height / 2,
          Math.max(canvas.width, canvas.height) * 0.8
        );
        vigGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
        vigGrad.addColorStop(1, 'rgba(0, 0, 0, 0.55)');
        ctx.fillStyle = vigGrad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.restore();
      }

      // 3. LIVE BROADCAST STATUS OVERLAY (🔴 LIVE • ঢাকা)
      if (enableLiveOverlay) {
        ctx.save();
        const liveY = 24;

        // Top Left: Live Pulsing Badge
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(20, liveY, 110, 26, 13);
        ctx.fill();
        ctx.stroke();

        // Pulsing red indicator dot
        const dotAlpha = 0.5 + Math.abs(Math.sin(elapsed * 4)) * 0.5;
        ctx.fillStyle = `rgba(239, 68, 68, ${dotAlpha})`;
        ctx.beginPath();
        ctx.arc(34, liveY + 13, 4.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = 'bold 11px "Hind Siliguri", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'left';
        ctx.fillText('LIVE • ঢাকা', 44, liveY + 17);

        // Top Right: 4K UHD Broadcast Tag
        const tagText = '4K UHD • HDR';
        ctx.font = 'bold 10px monospace';
        const tagMetrics = ctx.measureText(tagText);
        const tagW = tagMetrics.width + 16;
        const tagX = canvas.width - tagW - 20;

        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.beginPath();
        ctx.roundRect(tagX, liveY, tagW, 26, 6);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#38bdf8';
        ctx.textAlign = 'center';
        ctx.fillText(tagText, tagX + tagW / 2, liveY + 17);

        ctx.restore();
      }

      // 4. BADGE (Top Category Tag)
      ctx.save();
      const badgeY = canvas.height * (aspectRatio === '9:16' ? 0.12 : 0.14);
      const badgeText = multiSceneMode ? currentScene.badge : videoBadge;
      const badgePulse = 1 + Math.sin(elapsed * 4) * 0.02;

      ctx.font = 'bold 13px "Hind Siliguri", sans-serif';
      const badgeMetrics = ctx.measureText(badgeText);
      const badgeWidth = badgeMetrics.width + 28;
      const badgeHeight = 28;
      const badgeX = canvas.width / 2 - (badgeWidth * badgePulse) / 2;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.strokeStyle =
        activeTheme === 'emerald'
          ? '#10b981'
          : activeTheme === 'cyan'
          ? '#06b6d4'
          : activeTheme === 'amber'
          ? '#f59e0b'
          : '#a855f7';
      ctx.lineWidth = 1.5;

      ctx.beginPath();
      ctx.roundRect(badgeX, badgeY, badgeWidth * badgePulse, badgeHeight, 14);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText(badgeText, canvas.width / 2, badgeY + 18);
      ctx.restore();

      // 5. ANIMATED TITLE
      ctx.save();
      const titleFontSize = aspectRatio === '9:16' ? 32 : 36;
      ctx.font = `bold ${titleFontSize}px "Hind Siliguri", sans-serif`;
      ctx.textAlign = 'center';
      const titleY = canvas.height * (aspectRatio === '9:16' ? 0.26 : 0.29);
      const maxTextWidth = canvas.width * 0.86;
      const fullTitle = multiSceneMode ? currentScene.title : videoTitle;

      if (textAnimStyle === 'kinetic-bounce') {
        const bounceScale = Math.min(1.0, sceneLocalTime * 2.8);
        const elasticY = Math.sin(sceneLocalTime * 9) * Math.max(0, 1 - sceneLocalTime * 1.5) * 16;
        ctx.translate(canvas.width / 2, titleY + elasticY);
        ctx.scale(bounceScale, bounceScale);
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
        ctx.shadowBlur = 14;
        wrapText(ctx, fullTitle, 0, 0, maxTextWidth, titleFontSize * 1.35);
      } else if (textAnimStyle === 'typewriter') {
        const charsToShow = Math.floor(sceneLocalTime * 18);
        const partialText = fullTitle.slice(0, charsToShow);
        const showCursor = Math.floor(elapsed * 3) % 2 === 0 ? '▌' : '';
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
        ctx.shadowBlur = 12;
        wrapText(ctx, partialText + showCursor, canvas.width / 2, titleY, maxTextWidth, titleFontSize * 1.35);
      } else if (textAnimStyle === 'slide-fade') {
        const slideProgress = Math.min(1, sceneLocalTime / 0.6);
        const easeOut = 1 - Math.pow(1 - slideProgress, 3);
        const offsetY = (1 - easeOut) * 45;
        ctx.fillStyle = `rgba(255, 255, 255, ${slideProgress})`;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        ctx.shadowBlur = 16;
        wrapText(ctx, fullTitle, canvas.width / 2, titleY + offsetY, maxTextWidth, titleFontSize * 1.35);
      } else if (textAnimStyle === 'neon-glow') {
        const neonBlur = 15 + Math.sin(elapsed * 6) * 12;
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor =
          activeTheme === 'emerald'
            ? '#10b981'
            : activeTheme === 'cyan'
            ? '#06b6d4'
            : activeTheme === 'amber'
            ? '#f59e0b'
            : '#c084fc';
        ctx.shadowBlur = neonBlur;
        wrapText(ctx, fullTitle, canvas.width / 2, titleY, maxTextWidth, titleFontSize * 1.35);
      } else {
        const waveOffset = Math.sin(elapsed * 3) * 6;
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
        ctx.shadowBlur = 16;
        wrapText(ctx, fullTitle, canvas.width / 2, titleY + waveOffset, maxTextWidth, titleFontSize * 1.35);
      }
      ctx.restore();

      // 6. ANIMATED SUBTITLE
      ctx.save();
      const subFontSize = aspectRatio === '9:16' ? 19 : 21;
      ctx.font = `500 ${subFontSize}px "Hind Siliguri", sans-serif`;
      ctx.textAlign = 'center';
      const subY = canvas.height * (aspectRatio === '9:16' ? 0.44 : 0.47);
      const fullSub = currentScene.subtitle || videoSubtitle;
      const subElapsed = Math.max(0, sceneLocalTime - 0.25);
      const subAlpha = Math.min(1, subElapsed / 0.5);
      const subSlideY = Math.max(0, (1 - Math.min(1, subElapsed / 0.5)) * 22);

      ctx.fillStyle = `rgba(241, 245, 249, ${subAlpha})`;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
      ctx.shadowBlur = 10;
      wrapText(ctx, fullSub, canvas.width / 2, subY + subSlideY, maxTextWidth * 0.95, subFontSize * 1.45);
      ctx.restore();

      // 7. LOWER-THIRD CARD
      if (enableLowerThird) {
        ctx.save();
        const ltWidth = Math.min(canvas.width * 0.88, 520);
        const ltHeight = 44;
        const ltX = canvas.width / 2 - ltWidth / 2;
        const ltY = canvas.height * (aspectRatio === '9:16' ? 0.63 : 0.66);

        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        ctx.strokeStyle =
          activeTheme === 'emerald'
            ? '#059669'
            : activeTheme === 'cyan'
            ? '#0284c7'
            : activeTheme === 'amber'
            ? '#d97706'
            : '#7c3aed';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(ltX, ltY, ltWidth, ltHeight, 10);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 13px "Hind Siliguri", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(AVATAR_PROFILES[selectedAvatar]?.nameBn || 'উপস্থাপক', ltX + 16, ltY + 20);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '11px "Hind Siliguri", sans-serif';
        ctx.fillText(AVATAR_PROFILES[selectedAvatar]?.roleBn || 'ডিজিটাল সহকারী', ltX + 16, ltY + 36);

        // Sound Wave Indicator in Lower-Third
        const isSpeaking = isRecording || isAvatarTesting;
        for (let b = 0; b < 12; b++) {
          const barH = isSpeaking ? Math.abs(Math.sin(elapsed * 12 + b)) * 18 + 4 : 4;
          const barX = ltX + ltWidth - 100 + b * 7;
          ctx.fillStyle =
            activeTheme === 'emerald'
              ? '#34d399'
              : activeTheme === 'cyan'
              ? '#38bdf8'
              : activeTheme === 'amber'
              ? '#fbbf24'
              : '#c084fc';
          ctx.fillRect(barX, ltY + ltHeight / 2 - barH / 2, 4, barH);
        }
        ctx.restore();
      }

      // 8. BREAKING NEWS TICKER
      if (enableTicker) {
        ctx.save();
        const tickerHeight = 34;
        const tickerY = canvas.height - (aspectRatio === '9:16' ? 68 : 52);

        ctx.fillStyle = 'rgba(2, 6, 23, 0.95)';
        ctx.fillRect(0, tickerY, canvas.width, tickerHeight);

        ctx.fillStyle =
          activeTheme === 'emerald'
            ? '#059669'
            : activeTheme === 'cyan'
            ? '#0284c7'
            : activeTheme === 'amber'
            ? '#d97706'
            : '#7c3aed';
        ctx.fillRect(0, tickerY, canvas.width, 1.5);

        const tagBoxWidth = 80;
        ctx.fillStyle =
          activeTheme === 'emerald'
            ? '#10b981'
            : activeTheme === 'cyan'
            ? '#0ea5e9'
            : activeTheme === 'amber'
            ? '#f59e0b'
            : '#9333ea';
        ctx.fillRect(0, tickerY, tagBoxWidth, tickerHeight);
        ctx.font = 'bold 12px "Hind Siliguri", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText('ব্রেকিং', tagBoxWidth / 2, tickerY + 22);

        ctx.font = '13px "Hind Siliguri", sans-serif';
        const tickerSpeed = 65;
        const textMetrics = ctx.measureText(tickerText);
        const textWidth = Math.max(textMetrics.width, 400);
        const scrollOffset = (elapsed * tickerSpeed) % (textWidth + canvas.width);
        const scrollX = canvas.width - scrollOffset;

        ctx.beginPath();
        ctx.rect(tagBoxWidth, tickerY, canvas.width - tagBoxWidth, tickerHeight);
        ctx.clip();

        ctx.fillStyle = '#f8fafc';
        ctx.textAlign = 'left';
        ctx.fillText(tickerText, scrollX, tickerY + 22);
        ctx.fillText(tickerText, scrollX + textWidth + 80, tickerY + 22);
        ctx.restore();
      }

      // 9. DIGITAL HUMAN AVATAR (মানুষের মতো নাড়াচাড়া, অভিনয় ও কথা বলা)
      if (enableAvatar) {
        const isSpeakingNow = isRecording || isAvatarTesting;
        const currentNarration = multiSceneMode
          ? `${currentScene.title} ${currentScene.subtitle}`
          : `${videoTitle} ${videoSubtitle}`;

        // Soft floor ambient occlusion shadow beneath presenter
        ctx.save();
        const shadowY = canvas.height * (aspectRatio === '9:16' ? 0.88 : 0.85);
        const shadowGrad = ctx.createRadialGradient(
          canvas.width / 2,
          shadowY,
          10,
          canvas.width / 2,
          shadowY,
          canvas.width * 0.35
        );
        shadowGrad.addColorStop(0, 'rgba(0, 0, 0, 0.65)');
        shadowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = shadowGrad;
        ctx.beginPath();
        ctx.ellipse(canvas.width / 2, shadowY, canvas.width * 0.32, 28, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        const presenterPhotoImg = customPresenterPhotoUrlRef.current
          ? getOrLoadImage(customPresenterPhotoUrlRef.current)
          : null;

        if (isFiltered && (filterConfig.target === 'master' || filterConfig.target === 'media')) {
          ctx.filter = activeFilterCss;
        }

        drawHumanAvatar(ctx, canvas.width, canvas.height, elapsed, {
          avatarId: selectedAvatar,
          pose: avatarPose,
          expression: avatarExpression,
          gesture: avatarGesture,
          isSpeaking: isSpeakingNow,
          speechText: isSpeakingNow ? currentNarration : undefined,
          theme: activeTheme,
          customPhotoImg: presenterPhotoImg,
          customPresenterName: customPresenterNameRef.current,
        });
      }

      // 10. SCENE TRANSITION OVERLAYS
      if (isInTransition) {
        ctx.save();
        if (transitionEffect === 'wipe-left') {
          const wipeW = canvas.width * (1 - transitionProgress);
          ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
          ctx.fillRect(0, 0, wipeW, canvas.height);
          ctx.fillStyle =
            activeTheme === 'emerald'
              ? '#10b981'
              : activeTheme === 'cyan'
              ? '#06b6d4'
              : activeTheme === 'amber'
              ? '#f59e0b'
              : '#c084fc';
          ctx.fillRect(wipeW - 4, 0, 4, canvas.height);
        } else if (transitionEffect === 'iris-circle') {
          const maxRadius = Math.hypot(canvas.width, canvas.height) / 2;
          const currentRadius = maxRadius * transitionProgress;
          ctx.beginPath();
          ctx.arc(canvas.width / 2, canvas.height / 2, currentRadius, 0, Math.PI * 2);
          ctx.rect(canvas.width, 0, -canvas.width, canvas.height);
          ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
          ctx.fill();
        } else {
          const fadeAlpha = 1 - transitionProgress;
          ctx.fillStyle = `rgba(15, 23, 42, ${fadeAlpha})`;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        ctx.restore();
      }

      ctx.filter = 'none';
      animationFrameRef.current = requestAnimationFrame(renderFrame);
    };

    animationFrameRef.current = requestAnimationFrame(renderFrame);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [
    aspectRatio,
    videoTitle,
    videoSubtitle,
    videoBadge,
    tickerText,
    activeTheme,
    scenes,
    multiSceneMode,
    textAnimStyle,
    transitionEffect,
    enableTicker,
    enableLowerThird,
    enableAvatar,
    selectedAvatar,
    avatarPose,
    avatarExpression,
    avatarGesture,
    isRecording,
    isAvatarTesting,
    enableSound,
    totalSceneDuration,
    activeBackdropUrl,
    enableKenBurns,
    enableCinematicAtmosphere,
    enableLiveOverlay,
    colorGradeMood,
    colorFilterConfig,
    customPresenterPhotoUrl,
    customPresenterName,
    getOrLoadImage,
  ]);

  // ==========================================
  // CANVAS RECORDER (MediaRecorder Engine - $0 Server Cost)
  // ==========================================
  const finishCanvasRecording = async () => {
    if (recordingTimerIntervalRef.current) {
      clearInterval(recordingTimerIntervalRef.current);
      recordingTimerIntervalRef.current = null;
    }

    if (canvasRecorderRef.current) {
      try {
        const result = await canvasRecorderRef.current.stop();
        setRecordingResult(result);
        setRecordedVideoUrl(result.url);
      } catch (err) {
        console.error('Error stopping CanvasRecorder:', err);
      }
    }

    setIsRecording(false);
    setIsRecordingPaused(false);
    setRecordProgress(100);

    if (proceduralMusicPlayerRef.current) {
      proceduralMusicPlayerRef.current.stop();
      proceduralMusicPlayerRef.current = null;
    }

    if (backgroundAudioSourceNodeRef.current) {
      try {
        backgroundAudioSourceNodeRef.current.stop();
        backgroundAudioSourceNodeRef.current.disconnect();
      } catch (e) {}
      backgroundAudioSourceNodeRef.current = null;
    }

    if (liveMicStreamRef.current) {
      liveMicStreamRef.current.getTracks().forEach((t) => t.stop());
      liveMicStreamRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const startRecording = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!CanvasRecorder.isSupported()) {
      setRecorderErrorMsg('আপনার ব্রাউজার MediaRecorder API সাপোর্ট করে না। অনুগ্রহ করে Chrome বা Edge ব্যবহার করুন।');
      return;
    }

    setRecorderErrorMsg(null);
    setMicFallbackNotice(null);

    setIsRecording(true);
    setIsRecordingPaused(false);
    setRecordProgress(0);
    setRecordingSeconds(0);
    setRecordedVideoUrl(null);
    setRecordingResult(null);

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContextClass();
    audioContextRef.current = ctx;

    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    const audioDest = ctx.createMediaStreamDestination();

    // Inaudible 20Hz continuous carrier oscillator to ensure Opus track is never dropped
    const carrierOsc = ctx.createOscillator();
    const carrierGain = ctx.createGain();
    carrierOsc.frequency.setValueAtTime(20, ctx.currentTime);
    carrierGain.gain.setValueAtTime(0.001, ctx.currentTime);
    carrierOsc.connect(carrierGain);
    carrierGain.connect(audioDest);
    carrierOsc.start();

    // ------------------------------------------
    // YOUTUBE & BACKGROUND MUSIC ROUTING
    // ------------------------------------------
    const currentMusicCfg = musicConfigRef.current;
    if (currentMusicCfg.enabled && currentMusicCfg.selectedTrack) {
      const musicMasterGain = ctx.createGain();
      const baseMusicGain = currentMusicCfg.musicVolume;
      musicMasterGain.gain.setValueAtTime(baseMusicGain, ctx.currentTime);
      musicMasterGain.connect(audioDest);
      musicMasterGain.connect(ctx.destination);

      // Smart Audio Ducking logic: lowers music volume during voice
      if (currentMusicCfg.enableDucking) {
        const isVoiceActive = audioSourceMode === 'record-clip' || audioSourceMode === 'live-mic' || enableVoiceover;
        if (isVoiceActive) {
          const duckGain = Math.max(0.03, baseMusicGain * 0.28);
          musicMasterGain.gain.setValueAtTime(duckGain, ctx.currentTime);
          const voiceDuration = Math.min(totalSceneDuration, 16);
          musicMasterGain.gain.setValueAtTime(duckGain, ctx.currentTime + voiceDuration - 0.5);
          musicMasterGain.gain.linearRampToValueAtTime(baseMusicGain, ctx.currentTime + voiceDuration + 0.8);
        }
      }

      // Check if user uploaded a custom YouTube audio file
      if (currentMusicCfg.customAudioFile) {
        try {
          const arrayBuf = await currentMusicCfg.customAudioFile.arrayBuffer();
          const decoded = await ctx.decodeAudioData(arrayBuf);
          const bgSource = ctx.createBufferSource();
          bgSource.buffer = decoded;
          bgSource.loop = currentMusicCfg.loop;
          bgSource.connect(musicMasterGain);
          bgSource.start(ctx.currentTime + 0.05);
          backgroundAudioSourceNodeRef.current = bgSource;
        } catch (e) {
          console.warn('Error decoding custom YouTube audio file:', e);
        }
      } else {
        // Play procedural/curated YouTube synthesizer preset
        const player = new ProceduralMusicPlayer();
        proceduralMusicPlayerRef.current = player;
        player.start(
          ctx,
          musicMasterGain,
          currentMusicCfg.selectedTrack.proceduralPreset,
          1.0
        );
      }
    } else if (enableSound) {
      // Fallback ambient pad
      const padOsc = ctx.createOscillator();
      const padGain = ctx.createGain();
      const padFilter = ctx.createBiquadFilter();
      padOsc.type = 'triangle';
      padFilter.type = 'lowpass';
      padFilter.frequency.setValueAtTime(320, ctx.currentTime);
      padOsc.frequency.setValueAtTime(110, ctx.currentTime);
      padGain.gain.setValueAtTime(0.025, ctx.currentTime);
      padOsc.connect(padFilter);
      padFilter.connect(padGain);
      padGain.connect(audioDest);
      padGain.connect(ctx.destination);
      padOsc.start();
    }

    // Audio routing based on selected mode
    if (audioSourceMode === 'record-clip' && recordedVoiceBlob) {
      try {
        const arrayBuf = await recordedVoiceBlob.arrayBuffer();
        const decoded = await ctx.decodeAudioData(arrayBuf);
        const sourceNode = ctx.createBufferSource();
        sourceNode.buffer = decoded;
        const voiceGain = ctx.createGain();
        voiceGain.gain.setValueAtTime(currentMusicCfg.voiceVolume, ctx.currentTime);
        sourceNode.connect(voiceGain);
        voiceGain.connect(audioDest);
        voiceGain.connect(ctx.destination);
        sourceNode.start(ctx.currentTime + 0.1);
      } catch (err) {
        console.warn('Error embedding recorded voice:', err);
      }
    } else if (audioSourceMode === 'live-mic') {
      try {
        const micStream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });
        liveMicStreamRef.current = micStream;
        const micSource = ctx.createMediaStreamSource(micStream);
        const micGain = ctx.createGain();
        micGain.gain.setValueAtTime(currentMusicCfg.voiceVolume, ctx.currentTime);
        micSource.connect(micGain);
        micGain.connect(audioDest);
      } catch (err: any) {
        console.warn('Live mic permission unavailable during recording, falling back to procedural audio voice:', err?.message || err);
        playProceduralBengaliVoice(ctx, audioDest, totalSceneDuration);
        setMicFallbackNotice('মাইক্রোফোন অনুমতি না থাকায় ব্যাকগ্রাউন্ড মিউজিক ও এআই অডিও সহ ভিডিও সফলভাবে রেকর্ড করা হচ্ছে।');
      }
    } else if (audioSourceMode === 'upload-audio' && uploadedAudioBuffer) {
      try {
        const sourceNode = ctx.createBufferSource();
        sourceNode.buffer = uploadedAudioBuffer;
        const uploadGain = ctx.createGain();
        uploadGain.gain.setValueAtTime(currentMusicCfg.voiceVolume, ctx.currentTime);
        sourceNode.connect(uploadGain);
        uploadGain.connect(audioDest);
        uploadGain.connect(ctx.destination);
        sourceNode.start(ctx.currentTime + 0.1);
      } catch (err) {
        console.warn('Error playing uploaded audio buffer:', err);
      }
    } else {
      // Procedural Vocal Formant Synthesizer
      playProceduralBengaliVoice(ctx, audioDest, totalSceneDuration);

      if (enableVoiceover && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const narrationText = multiSceneMode
          ? scenes.map((s) => `${s.title}. ${s.subtitle}`).join('. ')
          : `${videoTitle}. ${videoSubtitle}`;
        const utterance = new SpeechSynthesisUtterance(narrationText);
        utterance.lang = 'bn-BD';
        utterance.rate = 0.95;
        window.speechSynthesis.speak(utterance);
      }
    }

    // Initialize CanvasRecorder
    const recorder = new CanvasRecorder();
    canvasRecorderRef.current = recorder;
    const qualityPreset = RECORDER_QUALITY_PRESETS[recorderQuality] || RECORDER_QUALITY_PRESETS.standard;

    try {
      await recorder.start(canvas, {
        fps: qualityPreset.fps,
        videoBitsPerSecond: qualityPreset.videoBitrate,
        audioBitsPerSecond: qualityPreset.audioBitrate,
        audioStream: audioDest.stream,
        timeslice: 100,
        onStateChange: (state) => {
          setIsRecordingPaused(state === 'paused');
        },
      });
    } catch (recordErr) {
      console.error('Failed to start CanvasRecorder:', recordErr);
      setIsRecording(false);
      return;
    }

    const startTime = Date.now();
    const totalMs = totalSceneDuration * 1000;

    if (recordingTimerIntervalRef.current) {
      clearInterval(recordingTimerIntervalRef.current);
    }

    recordingTimerIntervalRef.current = setInterval(async () => {
      if (recorder.getState() === 'paused') return;

      const elapsed = recorder.getElapsedTimeMs();
      const pct = Math.min(100, Math.round((elapsed / totalMs) * 100));
      setRecordProgress(pct);
      setRecordingSeconds(Math.floor(elapsed / 1000));

      if (elapsed >= totalMs) {
        await finishCanvasRecording();
      }
    }, 100);
  };

  const pauseRecording = () => {
    if (canvasRecorderRef.current && canvasRecorderRef.current.getState() === 'recording') {
      canvasRecorderRef.current.pause();
      setIsRecordingPaused(true);
    }
  };

  const resumeRecording = () => {
    if (canvasRecorderRef.current && canvasRecorderRef.current.getState() === 'paused') {
      canvasRecorderRef.current.resume();
      setIsRecordingPaused(false);
    }
  };

  const stopRecordingEarly = () => {
    finishCanvasRecording();
  };

  const handleTakeSnapshot = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const snap = await CanvasRecorder.captureSnapshot(
        canvas,
        'image/png',
        1.0,
        `canvas-frame-${Date.now()}.png`
      );
      snap.download();
      setSnapshotFeedback(true);
      setTimeout(() => setSnapshotFeedback(false), 2500);
    } catch (e) {
      console.warn('Snapshot capture failed:', e);
    }
  };

  const testAvatarSpeech = () => {
    setIsAvatarTesting(true);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const currentNarration = multiSceneMode
        ? `${scenes[0]?.title}. ${scenes[0]?.subtitle}`
        : `${videoTitle}. ${videoSubtitle}`;
      const utterance = new SpeechSynthesisUtterance(currentNarration);
      utterance.lang = 'bn-BD';
      utterance.rate = 0.95;
      utterance.onend = () => setIsAvatarTesting(false);
      utterance.onerror = () => setIsAvatarTesting(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setIsAvatarTesting(false), 3500);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      {/* Title & Zero-Cost Badge Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 border-b border-slate-800 pb-5 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Film className="h-5 w-5" />
            </span>
            <h2 className="text-xl font-bold text-white sm:text-2xl">
              জিরো-কস্ট ভিডিও ক্রিয়েটর ($০ সার্ভার ও এপিআই খরচ)
            </h2>
          </div>
          <p className="mt-1 text-sm text-slate-400">
            সুন্দর এআই ইমেজ ব্যাকড্রপ, বাস্তবসম্মত ৪কে সিনেমাটিক স্টুডিও, মানুষের মতো নাড়াচাড়া করা এআই উপস্থাপক ও নিখুঁত ভয়েস সিঙ্ক।
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowGuide(!showGuide)}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-700"
          >
            <HelpCircle className="h-3.5 w-3.5 text-emerald-400" />
            <span>{showGuide ? 'গাইড বন্ধ করুন' : 'কীভাবে ০ খরচে বাস্তব ভিডিও তৈরি হয়?'}</span>
          </button>
        </div>
      </div>

      {/* Guide Accordion */}
      {showGuide && (
        <div className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 text-xs text-slate-300 space-y-2">
          <div className="font-bold text-emerald-400 text-sm flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            <span>জিরো-কস্ট বাস্তবসম্মত ভিডিও তৈরির কৌশল</span>
          </div>
          <p>
            ১. <strong>বাস্তবসম্মত ব্যাকগ্রাউন্ড (Photorealistic Scenes):</strong> সাধারণ ফ্ল্যাট রঙের বদলে বাস্তব টিভি স্টুডিও, সিটিজেন সেন্টার বা মেগাসিটির ৪কে ছবি ব্যবহার করা হয়। এছাড়া ব্রাউজার থেকে সরাসরি ফ্রিতে এআই ইমেজ জেনারেট করা যায়।
          </p>
          <p>
            ২. <strong>ক্যামেরা মোশন (Ken Burns Effect):</strong> ভিডিও চলাকালীন ক্যানভাস ব্যাকগ্রাউন্ডকে আলতো করে জুম ও প্যান করে, যাতে স্থির ছবির বদলে মনে হয় আসল সিনেমাটিক ক্যামেরা চলছে।
          </p>
          <p>
            ৩. <strong>আলো ও বায়ুমণ্ডলীয় ইফেক্ট (Atmosphere):</strong> স্টুডিও আলোর ভলিউমেট্রিক রশ্মি (God-rays), আলোর কণা (Bokeh Dust) এবং সিনেমার মতো ভিগনেট (Vignette) যুক্ত থাকে।
          </p>
          <p>
            ৪. <strong>ভয়েস ও অডিও সিঙ্ক্রোনাইজেশন:</strong> নিজস্ব অডিও ক্লিপ, লাইভ মাইক্রোফোন বা ফাইল সরাসরি ভিডিও ফাইলের অপাস (Opus) অডিও ট্র্যাকে জুড়ে দেওয়া হয়।
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: AI Image Studio, Voice, Presenter & Controls */}
        <div className="space-y-5 lg:col-span-5">
          {/* ============================================================ */}
          {/* FEATURE 1: বাস্তবসম্মত ইমেজ জেনারেশন ও সিন ব্যাকড্রপ স্টুডিও */}
          {/* ============================================================ */}
          <div className="rounded-2xl border border-cyan-500/40 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/30 p-4 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  <Wand2 className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <span>বাস্তবসম্মত ইমেজ ও ব্যাকড্রপ স্টুডিও</span>
                    <span className="rounded bg-cyan-500/20 px-1.5 py-0.2 text-[10px] text-cyan-300 font-mono">
                      এআই $০ খরচ
                    </span>
                  </h3>
                  <p className="text-[10px] text-cyan-400 font-medium">
                    সিনেমাটিক দৃশ্য, ৪কে টিভি স্টুডিও ও কাস্টম এআই জেনারেশন
                  </p>
                </div>
              </div>
            </div>

            {/* Backdrop Mode Switcher */}
            <div className="grid grid-cols-3 gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => setCurrentBackdropMode('ai-generate')}
                className={`flex items-center justify-center gap-1.5 rounded-xl border p-2 font-semibold transition-all ${
                  currentBackdropMode === 'ai-generate'
                    ? 'border-cyan-500 bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-500/40'
                    : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                <span className="text-[11px]">এআই তৈরি করুন</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentBackdropMode('preset-gallery')}
                className={`flex items-center justify-center gap-1.5 rounded-xl border p-2 font-semibold transition-all ${
                  currentBackdropMode === 'preset-gallery'
                    ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/40'
                    : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                <Tv className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-[11px]">বাস্তব দৃশ্য গ্যালারি</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentBackdropMode('upload-image')}
                className={`flex items-center justify-center gap-1.5 rounded-xl border p-2 font-semibold transition-all ${
                  currentBackdropMode === 'upload-image'
                    ? 'border-amber-500 bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/40'
                    : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                <Upload className="h-3.5 w-3.5 text-amber-400" />
                <span className="text-[11px]">নিজের ছবি আপলোড</span>
              </button>
            </div>

            {/* TAB 1: AI Image Generator Prompt */}
            {currentBackdropMode === 'ai-generate' && (
              <div className="space-y-2.5">
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 mb-1 block">
                    কী ধরনের দৃশ্য চান লিখুন (বাংলা বা ইংরেজি):
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customAiPrompt}
                      onChange={(e) => setCustomAiPrompt(e.target.value)}
                      placeholder="যেমন: ৪কে টিভি নিউজ স্টুডিও, মেগাসিটি ঢাকা, সাইবার ল্যাব..."
                      className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleGenerateAIImage()}
                      disabled={isGeneratingImage}
                      className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 px-3.5 py-2 text-xs font-bold text-white shadow transition-all disabled:opacity-50"
                    >
                      {isGeneratingImage ? (
                        <>
                          <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                          <span>জেনারেট হচ্ছে...</span>
                        </>
                      ) : (
                        <>
                          <Wand2 className="h-3.5 w-3.5" />
                          <span>ইমেজ তৈরি করুন</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* 1-Click Bengali Prompt Chips */}
                <div>
                  <div className="text-[10px] text-slate-400 mb-1">দ্রুত পছন্দ করার জন্য ১-ক্লিক থিম:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      {
                        label: '📺 ৪কে টিভি স্টুডিও',
                        p: 'Ultra-realistic 4K national news broadcast studio with curved LED video walls',
                      },
                      {
                        label: '🏛️ স্মার্ট সিটিজেন সেন্টার',
                        p: 'Modern government citizen service digital center Dhaka, high tech glass interior',
                      },
                      {
                        label: '🛡️ সাইবার সিকিউরিটি ল্যাব',
                        p: 'High-tech cyber security defense command center glowing blue monitors',
                      },
                      {
                        label: '💼 কর্পোরেট ব্যাংকিং অফিস',
                        p: 'Corporate banking and pension financial office glass windows city view',
                      },
                      {
                        label: '💻 ফ্রিল্যান্সার ওয়ার্কস্পেস',
                        p: 'Modern ergonomic software freelancer workspace with dual monitors warm lighting',
                      },
                      {
                        label: '🌆 ঢাকা মেগাসিটি সানসেট',
                        p: 'Dhaka modern skyline golden hour sunset architectural photography',
                      },
                    ].map((chip, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setCustomAiPrompt(chip.p);
                          handleGenerateAIImage(chip.p);
                        }}
                        className="rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 px-2 py-1 text-[10px] text-slate-300 transition-colors"
                      >
                        {chip.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Curated 4K Realistic Studio Gallery */}
            {currentBackdropMode === 'preset-gallery' && (
              <div className="space-y-2">
                <div className="text-[11px] font-semibold text-slate-300">
                  পেশাদার ৪কে স্টুডিও ব্যাকগ্রাউন্ড থেকে নির্বাচন করুন:
                </div>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                  {PRESET_REALISTIC_BACKDROPS.map((backdrop) => (
                    <button
                      key={backdrop.id}
                      type="button"
                      onClick={() => handleSelectBackdropPreset(backdrop)}
                      className={`group relative overflow-hidden rounded-xl border text-left transition-all ${
                        activeBackdropUrl === backdrop.url
                          ? 'border-emerald-500 ring-2 ring-emerald-500/50'
                          : 'border-slate-800 hover:border-slate-600'
                      }`}
                    >
                      <div className="relative h-16 w-full overflow-hidden bg-slate-950">
                        <img
                          src={backdrop.url}
                          alt={backdrop.titleBn}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                        <span className="absolute bottom-1 left-1.5 text-[9px] font-bold text-white truncate max-w-[90%]">
                          {backdrop.titleBn}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: Upload Custom Photo */}
            {currentBackdropMode === 'upload-image' && (
              <div className="space-y-2 text-xs">
                <label className="block text-slate-300 font-semibold mb-1">
                  আপনার মোবাইল বা পিসি থেকে ব্যাকড্রপ ছবি আপলোড করুন:
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCustomPhotoUpload}
                  className="w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-cyan-600 file:text-white hover:file:bg-cyan-500 cursor-pointer"
                />
                <p className="text-[10px] text-slate-400">
                  টিপস: যেকোনো ভালো ছবি (দোকান, অফিস, প্রতিষ্ঠান বা মনোরম দৃশ্য) আপলোড করলে তা স্বয়ংক্রিয়ভাবে ভিডিওর ব্যাকগ্রাউন্ড হিসেবে যুক্ত হবে।
                </p>
              </div>
            )}

            {/* Recently Used Backdrops Carousel */}
            {generatedImagesHistory.length > 0 && (
              <div className="border-t border-slate-800/80 pt-2.5">
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1.5">
                  <span className="font-semibold text-slate-300">সম্প্রতি ব্যবহৃত ব্যাকড্রপসমূহ:</span>
                  <span>{generatedImagesHistory.length}টি দৃশ্য প্রস্তুত</span>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {generatedImagesHistory.map((imgUrl, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setActiveBackdropUrl(imgUrl);
                        if (applyToAllScenes) {
                          setScenes((prev) => prev.map((s) => ({ ...s, imageUrl: imgUrl })));
                        } else {
                          setScenes((prev) => {
                            const updated = [...prev];
                            if (updated[activeSceneIndex]) updated[activeSceneIndex].imageUrl = imgUrl;
                            return updated;
                          });
                        }
                      }}
                      className={`relative h-12 w-16 shrink-0 overflow-hidden rounded-lg border transition-all ${
                        activeBackdropUrl === imgUrl
                          ? 'border-cyan-400 ring-2 ring-cyan-400/40'
                          : 'border-slate-700 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={imgUrl} alt="Thumbnail" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Realistic Controls: Ken Burns, Cinematic Atmosphere & Broadcast Badge */}
            <div className="grid grid-cols-2 gap-2 border-t border-slate-800/80 pt-2.5 text-xs">
              <label className="flex items-center gap-2 cursor-pointer bg-slate-950 p-2 rounded-lg border border-slate-800">
                <input
                  type="checkbox"
                  checked={enableKenBurns}
                  onChange={(e) => setEnableKenBurns(e.target.checked)}
                  className="rounded border-slate-700 text-cyan-500 focus:ring-0"
                />
                <span className="text-[11px] text-slate-300 font-medium">ক্যামেরা মোশন (Ken Burns)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer bg-slate-950 p-2 rounded-lg border border-slate-800">
                <input
                  type="checkbox"
                  checked={enableCinematicAtmosphere}
                  onChange={(e) => setEnableCinematicAtmosphere(e.target.checked)}
                  className="rounded border-slate-700 text-cyan-500 focus:ring-0"
                />
                <span className="text-[11px] text-slate-300 font-medium">সিনেমাটিক আলো ও কণা</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer bg-slate-950 p-2 rounded-lg border border-slate-800">
                <input
                  type="checkbox"
                  checked={enableLiveOverlay}
                  onChange={(e) => setEnableLiveOverlay(e.target.checked)}
                  className="rounded border-slate-700 text-cyan-500 focus:ring-0"
                />
                <span className="text-[11px] text-slate-300 font-medium">🔴 LIVE • ঢাকা ব্যাজ</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer bg-slate-950 p-2 rounded-lg border border-slate-800">
                <input
                  type="checkbox"
                  checked={applyToAllScenes}
                  onChange={(e) => setApplyToAllScenes(e.target.checked)}
                  className="rounded border-slate-700 text-cyan-500 focus:ring-0"
                />
                <span className="text-[11px] text-slate-300 font-medium">সব সিনে এই ব্যাকড্রপ</span>
              </label>
            </div>
          </div>

          {/* Preset Selector */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-xl">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-2.5">
              <Zap className="h-3.5 w-3.5 text-amber-400" />
              <span>রেডিমেড স্ক্রিপ্ট নির্বাচন করুন:</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {PRESET_SCRIPTS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className={`rounded-xl border p-2.5 text-left transition-all ${
                    selectedPreset.id === preset.id
                      ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300 shadow-md ring-1 ring-emerald-500/50'
                      : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className="text-[11px] font-bold truncate">{preset.category}</div>
                  <div className="text-[10px] text-slate-500 truncate mt-0.5">{preset.title}</div>
                </button>
              ))}
            </div>
          </div>

          {/* VOICE & AUDIO SETTINGS */}
          <div className="rounded-2xl border border-emerald-500/40 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/30 p-4 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <Mic className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    ভিডিওতে ভয়েস (Voice) যুক্ত করার মাধ্যম
                  </h3>
                  <p className="text-[10px] text-emerald-400 font-medium">
                    ✓ ডাউনলোড করা ভিডিও ফাইলে সরাসরি স্পষ্ট ভয়েস থাকবে
                  </p>
                </div>
              </div>
            </div>

            {/* Voice Source Selector Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setAudioSourceMode('record-clip')}
                className={`flex items-center gap-2 rounded-xl border p-2.5 font-semibold transition-all ${
                  audioSourceMode === 'record-clip'
                    ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300 shadow-sm ring-1 ring-emerald-500/40'
                    : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                <Mic className="h-4 w-4 text-emerald-400" />
                <div className="text-left">
                  <div className="text-[11px] leading-tight">নিজের ভয়েস রেকর্ড</div>
                  <div className="text-[9px] text-slate-400 font-normal">ইন-স্টুডিও মাইক</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setAudioSourceMode('live-mic')}
                className={`flex items-center gap-2 rounded-xl border p-2.5 font-semibold transition-all ${
                  audioSourceMode === 'live-mic'
                    ? 'border-cyan-500 bg-cyan-500/20 text-cyan-300 shadow-sm ring-1 ring-cyan-500/40'
                    : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                <Radio className="h-4 w-4 text-cyan-400" />
                <div className="text-left">
                  <div className="text-[11px] leading-tight">লাইভ মাইক রেকর্ডিং</div>
                  <div className="text-[9px] text-slate-400 font-normal">ভিডিও চলার সময় বলুন</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setAudioSourceMode('upload-audio')}
                className={`flex items-center gap-2 rounded-xl border p-2.5 font-semibold transition-all ${
                  audioSourceMode === 'upload-audio'
                    ? 'border-amber-500 bg-amber-500/20 text-amber-300 shadow-sm ring-1 ring-amber-500/40'
                    : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                <Upload className="h-4 w-4 text-amber-400" />
                <div className="text-left">
                  <div className="text-[11px] leading-tight">ভয়েস ফাইল আপলোড</div>
                  <div className="text-[9px] text-slate-400 font-normal">MP3 / WAV অডিও</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setAudioSourceMode('ai-synth')}
                className={`flex items-center gap-2 rounded-xl border p-2.5 font-semibold transition-all ${
                  audioSourceMode === 'ai-synth'
                    ? 'border-purple-500 bg-purple-500/20 text-purple-300 shadow-sm ring-1 ring-purple-500/40'
                    : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                <Sparkles className="h-4 w-4 text-purple-400" />
                <div className="text-left">
                  <div className="text-[11px] leading-tight">এআই সিন্থ ভয়েস</div>
                  <div className="text-[9px] text-slate-400 font-normal">ওয়েব অডিও ফরম্যান্ট</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (onOpenAudioStudio) {
                    onOpenAudioStudio();
                  }
                }}
                className="flex items-center gap-2 rounded-xl border border-purple-500/40 bg-purple-950/40 hover:bg-purple-900/50 text-purple-300 p-2.5 font-semibold transition-all col-span-2 sm:col-span-1"
                title="৩০ সেকেন্ডের অডিও গান কম্পোজিশন ইঞ্জিন চালু করুন"
              >
                <Music className="h-4 w-4 text-purple-400" />
                <div className="text-left">
                  <div className="text-[11px] leading-tight font-bold">৩০সে. গান ইঞ্জিন</div>
                  <div className="text-[9px] text-purple-400/90 font-normal">যেকোনো গান তৈরি</div>
                </div>
              </button>
            </div>

            {/* Microphone Permission Warning / Alternative Actions Card */}
            {micErrorMessage && (
              <div className="rounded-xl border border-amber-500/40 bg-gradient-to-r from-amber-950/40 to-slate-900 p-3 space-y-2.5 text-xs text-amber-200 shadow-lg animate-fadeIn">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 mt-0.5">
                      <MicOff className="h-3.5 w-3.5" />
                    </span>
                    <div>
                      <div className="font-bold text-amber-300">
                        মাইক্রোফোন অনুমতি দেওয়া হয়নি বা অনুপলব্ধ (Permission Denied)
                      </div>
                      <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                        {micErrorMessage}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMicErrorMessage(null)}
                    className="text-slate-400 hover:text-white p-1 rounded-md"
                    title="বার্তা লুকান"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 pt-1.5 border-t border-amber-500/20">
                  <span className="text-[10px] text-slate-400 font-medium mr-1">
                    বিকল্প বেছে নিন:
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setAudioSourceMode('ai-synth');
                      setMicErrorMessage(null);
                    }}
                    className="flex items-center gap-1 rounded-lg bg-purple-600 hover:bg-purple-500 px-2.5 py-1 text-[11px] font-bold text-white shadow transition-all"
                  >
                    <Sparkles className="h-3 w-3" />
                    <span>এআই সিন্থ ভয়েস সক্রিয় করুন</span>
                  </button>

                  {onOpenAudioStudio && (
                    <button
                      type="button"
                      onClick={() => {
                        onOpenAudioStudio();
                        setMicErrorMessage(null);
                      }}
                      className="flex items-center gap-1 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 px-2.5 py-1 text-[11px] font-bold text-white shadow transition-all"
                    >
                      <Music className="h-3 w-3" />
                      <span>৩০সে. অডিও গান ইঞ্জিন খুলুন</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setAudioSourceMode('upload-audio');
                      setMicErrorMessage(null);
                    }}
                    className="flex items-center gap-1 rounded-lg bg-amber-600 hover:bg-amber-500 px-2.5 py-1 text-[11px] font-bold text-white shadow transition-all"
                  >
                    <Upload className="h-3 w-3" />
                    <span>অডিও ফাইল আপলোড করুন</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 1: In-Studio Voice Clip Recorder Tool */}
            {audioSourceMode === 'record-clip' && (
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <Mic className="h-3.5 w-3.5 text-emerald-400" />
                    <span>স্ক্রিপ্ট পড়ে নিজের কণ্ঠ রেকর্ড করুন:</span>
                  </span>
                  {isVoiceRecording && (
                    <span className="flex items-center gap-1 text-red-400 font-mono font-bold animate-pulse">
                      <span className="h-2 w-2 rounded-full bg-red-500"></span>
                      রেকর্ড হচ্ছে... {voiceRecordSeconds}s
                    </span>
                  )}
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300 italic">
                  💡 পড়ার জন্য স্ক্রিপ্ট:{' '}
                  <span className="text-emerald-300 not-italic font-medium">
                    "{multiSceneMode ? scenes[0]?.title + '। ' + scenes[0]?.subtitle : videoTitle + '। ' + videoSubtitle}"
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {!isVoiceRecording ? (
                    <button
                      type="button"
                      onClick={startRecordingVoiceClip}
                      className="flex items-center gap-1.5 rounded-lg bg-red-600 hover:bg-red-500 px-3.5 py-2 text-xs font-bold text-white shadow transition-all"
                    >
                      <Mic className="h-3.5 w-3.5" />
                      <span>{recordedVoiceBlob ? 'পুনরায় ভয়েস রেকর্ড করুন' : '🎙️ ভয়েস রেকর্ড শুরু করুন'}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={stopRecordingVoiceClip}
                      className="flex items-center gap-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 px-3.5 py-2 text-xs font-bold text-white shadow animate-bounce"
                    >
                      <Square className="h-3.5 w-3.5 fill-white" />
                      <span>ভয়েস রেকর্ড সম্পন্ন করুন ({voiceRecordSeconds}s)</span>
                    </button>
                  )}

                  {recordedVoiceBlob && !isVoiceRecording && (
                    <>
                      <button
                        type="button"
                        onClick={togglePlayRecordedVoice}
                        className="flex items-center gap-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-2 text-xs font-semibold text-emerald-400"
                      >
                        <Volume2 className="h-3.5 w-3.5" />
                        <span>{isPlayingRecordedVoice ? 'পজ করুন' : 'শুনুন (Play)'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={clearRecordedVoiceClip}
                        className="p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-red-400 border border-slate-800"
                        title="মুছে ফেলুন"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </>
                  )}
                </div>

                {recordedVoiceBlob && (
                  <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-semibold bg-emerald-950/40 p-2 rounded-lg border border-emerald-500/30">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>✓ ভয়েস প্রস্তুত! ভিডিও রেকর্ড করার সময় এটি সরাসরি ফাইলে যুক্ত হবে।</span>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: Live Mic Recording */}
            {audioSourceMode === 'live-mic' && (
              <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-3 space-y-2 text-xs text-slate-300">
                <div className="font-semibold text-cyan-300 flex items-center gap-1.5">
                  <Radio className="h-4 w-4" />
                  <span>লাইভ মাইক রেকর্ডিং সক্রিয়</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  নিচের <strong>"ভিডিও রেকর্ড শুরু করুন"</strong> বাটনে ক্লিক করলে আপনার মাইক্রোফোন সরাসরি চালু হবে এবং যা বলবেন তা ভিডিও ফাইলে জমা হবে।
                </p>
              </div>
            )}

            {/* TAB 3: Audio File Upload */}
            {audioSourceMode === 'upload-audio' && (
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 space-y-3 text-xs">
                <label className="block text-slate-300 font-semibold mb-1">
                  আপনার মোবাইল বা পিসি থেকে অডিও ফাইল নির্বাচন করুন:
                </label>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleAudioFileUpload}
                  className="w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-600 file:text-white hover:file:bg-amber-500 cursor-pointer"
                />
                {uploadedAudioFile && (
                  <div className="flex items-center justify-between bg-slate-900 p-2 rounded-lg border border-slate-800 text-[11px] text-amber-300">
                    <span className="truncate max-w-[220px]">🎵 {uploadedAudioFile.name}</span>
                    <span className="font-mono text-slate-400">{(uploadedAudioFile.size / 1024).toFixed(1)} KB</span>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: AI Synth Voice */}
            {audioSourceMode === 'ai-synth' && (
              <div className="rounded-xl border border-purple-500/30 bg-purple-950/20 p-3 space-y-2 text-xs text-slate-300">
                <div className="font-semibold text-purple-300 flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4" />
                  <span>ওয়েব অডিও এআই ফরম্যান্ট সিন্থেসাইজার</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  ব্রাউজার ওয়েব অডিও দিয়ে কণ্ঠনালীর অনুনাদ (F1/F2 Formants) তৈরি করে সরাসরি ভিডিও স্ট্রিমের অডিও ট্র্যাকে রেকর্ড করবে।
                </p>
                <button
                  type="button"
                  onClick={testAvatarSpeech}
                  disabled={isAvatarTesting}
                  className="flex items-center gap-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 px-3 py-1.5 text-xs font-bold text-white shadow"
                >
                  <Volume2 className="h-3.5 w-3.5" />
                  <span>{isAvatarTesting ? 'কথা বলছে...' : '🎙️ কথা বলিয়ে টেস্ট করুন'}</span>
                </button>
              </div>
            )}
          </div>

          {/* ============================================================ */}
          {/* FEATURE 2: ইউটিউব ব্যাকগ্রাউন্ড মিউজিক ও অডিও হাব */}
          {/* ============================================================ */}
          <YouTubeMusicHub
            config={musicConfig}
            onChange={setMusicConfig}
            onOpenAudioStudio={onOpenAudioStudio}
          />

          {/* DIGITAL HUMAN AVATAR SETTINGS */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  <User className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    ডিজিটাল এআই প্রেজেন্টার অবতার
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    মানুষের মতো নাড়াচাড়া, অভিনয় ও স্পষ্ট অভিব্যক্তি
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setEnableAvatar(!enableAvatar)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  enableAvatar ? 'bg-cyan-600' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    enableAvatar ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {enableAvatar && (
              <div className="space-y-3 pt-1">
                <div>
                  <label className="text-xs font-semibold text-slate-400 mb-1.5 block">
                    উপস্থাপক নির্বাচন করুন:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'farzana', name: 'ফারজানা', role: 'সংবাদ উপস্থাপিকা' },
                      { id: 'rafi', name: 'রাফি', role: 'সাইবার বিশেষজ্ঞ' },
                      { id: 'sheikh-farid', name: 'শেখ ফরিদ', role: 'এআই লিড' },
                      { id: 'custom-photo', name: '👤 নিজের ছবি', role: 'যেকোনো মানুষ' },
                    ].map((av) => (
                      <button
                        key={av.id}
                        type="button"
                        onClick={() => setSelectedAvatar(av.id as AvatarId)}
                        className={`rounded-xl border p-2 text-center transition-all ${
                          selectedAvatar === av.id
                            ? 'border-cyan-500 bg-cyan-950/40 text-cyan-300 ring-1 ring-cyan-500/50'
                            : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                        }`}
                      >
                        <div className="text-xs font-bold truncate">{av.name}</div>
                        <div className="text-[9px] text-slate-500 truncate">{av.role}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Photo Presenter Upload & 1-Click Styles */}
                {selectedAvatar === 'custom-photo' && (
                  <div className="p-3 rounded-xl bg-slate-950 border border-cyan-500/30 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-cyan-300 flex items-center gap-1.5">
                        <Upload className="h-3.5 w-3.5 text-cyan-400" />
                        <span>যেকোনো মানুষের ছবি আপলোড করুন:</span>
                      </span>
                      {customPresenterPhotoUrl && (
                        <span className="text-[10px] text-emerald-400 font-bold">✓ ছবি যুক্ত হয়েছে</span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      {customPresenterPhotoUrl ? (
                        <div className="relative h-14 w-14 shrink-0 rounded-xl overflow-hidden border-2 border-cyan-400 shadow-md">
                          <img
                            src={customPresenterPhotoUrl}
                            alt="Custom presenter"
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-900 text-slate-500">
                          <User className="h-6 w-6" />
                        </div>
                      )}

                      <div className="flex-1 space-y-1.5">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePresenterPhotoUpload}
                          className="w-full text-xs text-slate-400 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[11px] file:font-semibold file:bg-cyan-600 file:text-white hover:file:bg-cyan-500 cursor-pointer"
                        />
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-400 shrink-0">নাম:</span>
                          <input
                            type="text"
                            value={customPresenterName}
                            onChange={(e) => setCustomPresenterName(e.target.value)}
                            placeholder="উপস্থাপকের নাম লিখুন"
                            className="w-full rounded-md border border-slate-700 bg-slate-900 px-2 py-0.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 1-Click Instant Styles for Uploaded Photo */}
                    <div className="border-t border-slate-800/80 pt-2">
                      <div className="text-[10px] text-slate-400 mb-1.5 font-medium">
                        🎨 ১-ক্লিকে যেকোনো স্টাইলের ভিডিও তৈরি করুন:
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                        {[
                          { id: 'news', label: '📺 টিভি নিউজ স্টুডিও', style: 'news' as const },
                          { id: 'cyberpunk', label: '🌌 সাইবার নিয়ন', style: 'cyberpunk' as const },
                          { id: 'noir', label: '🎬 সিনেমাটিক নয়ার', style: 'noir' as const },
                          { id: 'sepia', label: '📜 ভিন্টেজ সেপিয়া', style: 'sepia' as const },
                          { id: 'viral', label: '🔥 ভাইরাল রিল স্টাইল', style: 'viral' as const },
                        ].map((st) => (
                          <button
                            key={st.id}
                            type="button"
                            onClick={() => applyPhotoStyle(st.style)}
                            className="rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/50 p-1.5 text-[10px] font-semibold text-slate-300 hover:text-white transition-all text-left"
                          >
                            {st.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-slate-400 font-semibold mb-1 block">পজিশন / ভিউ:</label>
                    <select
                      value={avatarPose}
                      onChange={(e) => setAvatarPose(e.target.value as AvatarPose)}
                      className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2 text-slate-200 text-xs focus:border-cyan-500 focus:outline-none"
                    >
                      <option value="studio-desk">স্টুডিও ডেস্ক (টিভি উপস্থাপনা)</option>
                      <option value="side-anchor">সাইড অ্যাঙ্কর (ফুল পোরট্রেট)</option>
                      <option value="pip-circle">PiP গোল বাবল (নিচে ডানে)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-400 font-semibold mb-1 block">অভিনয়ের অভিব্যক্তি:</label>
                    <select
                      value={avatarExpression}
                      onChange={(e) => setAvatarExpression(e.target.value as AvatarExpression)}
                      className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2 text-slate-200 text-xs focus:border-cyan-500 focus:outline-none"
                    >
                      <option value="friendly">হাস্যোজ্জ্বল ও অমায়িক</option>
                      <option value="confident">আত্মবিশ্বাসী ও স্পষ্ট</option>
                      <option value="serious">সিরিয়াস ও তথ্যবহুল</option>
                      <option value="enthusiastic">উচ্ছ্বসিত ও অনুপ্রেরণামূলক</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* TEXT ANIMATION & MULTI-SCENE STORYLINE */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-xl space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-bold flex items-center gap-1.5">
                  <Type className="h-3.5 w-3.5 text-emerald-400" />
                  <span>কাইনেটিক টেক্সট অ্যানিমেশন স্টাইল:</span>
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'kinetic-bounce', label: 'কাইনেটিক বাউন্স' },
                  { id: 'typewriter', label: 'টাইপরাইটার' },
                  { id: 'slide-fade', label: 'স্লাইড ফেড' },
                  { id: 'neon-glow', label: 'নিয়ন গ্লো' },
                  { id: 'wave-motion', label: 'ওয়েভ মোশন' },
                ].map((anim) => (
                  <button
                    key={anim.id}
                    onClick={() => setTextAnimStyle(anim.id as TextAnimStyle)}
                    className={`rounded-lg py-1.5 px-2 text-[11px] font-semibold border transition-all ${
                      textAnimStyle === anim.id
                        ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                    }`}
                  >
                    {anim.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Video Format & Theme Options */}
            <div className="grid grid-cols-2 gap-3 border-t border-slate-800 pt-3 text-xs">
              <div>
                <label className="text-slate-400 font-medium mb-1 block">অনুপাত (Aspect Ratio):</label>
                <div className="grid grid-cols-3 gap-1">
                  {[
                    { id: '9:16', label: '9:16 রিল' },
                    { id: '16:9', label: '16:9 টিভি' },
                    { id: '1:1', label: '1:1 স্কয়ার' },
                  ].map((ratio) => (
                    <button
                      key={ratio.id}
                      onClick={() => setAspectRatio(ratio.id as any)}
                      className={`rounded-lg py-1 text-[10px] font-bold border ${
                        aspectRatio === ratio.id
                          ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300'
                          : 'border-slate-800 bg-slate-950 text-slate-400'
                      }`}
                    >
                      {ratio.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-medium mb-1 block">কালার গ্রেডিং মুড:</label>
                <select
                  value={colorGradeMood}
                  onChange={(e) => setColorGradeMood(e.target.value as ColorGradeMood)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 p-1.5 text-[11px] text-slate-200 focus:border-cyan-500 focus:outline-none"
                >
                  <option value="cinematic-studio">🎬 সিনেমাটিক স্টুডিও</option>
                  <option value="warm-broadcast">☀️ ওয়ার্ম ব্রডকাস্ট</option>
                  <option value="cyber-teal">🛡️ সাইবার কোল্ড টিল</option>
                  <option value="golden-hour">🌅 গোল্ডেন আওয়ার সানসেট</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Animated Canvas Preview & Instant Video Render */}
        <div className="space-y-4 lg:col-span-7 flex flex-col items-center">
          <div className="w-full rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl flex flex-col items-center">
            <div className="w-full flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Film className="h-4 w-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">
                  লাইভ বাস্তবসম্মত ক্যানভাস প্রিভিউ
                </h3>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                {enableAvatar && (
                  <span className="flex items-center gap-1 text-cyan-400 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-500/30">
                    <User className="h-3 w-3" />
                    {AVATAR_PROFILES[selectedAvatar]?.nameBn || 'অবতার'}
                  </span>
                )}
                <span className="flex items-center gap-1 text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-500/30">
                  <Mic className="h-3 w-3" />
                  {audioSourceMode === 'record-clip'
                    ? recordedVoiceBlob
                      ? 'ভয়েস প্রস্তুত'
                      : 'ভয়েস রেকর্ড মোড'
                    : audioSourceMode === 'live-mic'
                    ? 'লাইভ মাইক'
                    : audioSourceMode === 'upload-audio'
                    ? 'আপলোড অডিও'
                    : 'এআই সিন্থ'}
                </span>
                {musicConfig.enabled && musicConfig.selectedTrack && (
                  <span className="flex items-center gap-1 text-red-400 bg-red-950/50 px-2 py-0.5 rounded border border-red-500/30">
                    <Music className="h-3 w-3" />
                    <span className="truncate max-w-[120px]">{musicConfig.customAudioName || musicConfig.selectedTrack.titleBn}</span>
                  </span>
                )}
                <span>
                  {aspectRatio} ({canvasWidth}x{canvasHeight})
                </span>
              </div>
            </div>

            {/* CanvasRecorder Toolbar: Quality, Engine Info & Frame Snapshot */}
            <div className="w-full mb-3 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-slate-950/80 p-2.5 border border-slate-800">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-1 rounded border border-emerald-500/30">
                  <Video className="h-3.5 w-3.5" />
                  <span>CanvasRecorder</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                  {getOptimalMimeType() ? getOptimalMimeType().split(';')[0] : 'MediaRecorder'} • $০ সার্ভার
                </span>
                {isFilterActive(colorFilterConfig) && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-pink-400 bg-pink-950/60 px-2 py-0.5 rounded border border-pink-500/30 animate-pulse">
                    <Palette className="h-3 w-3" />
                    <span>
                      {colorFilterConfig.grayscale > 0
                        ? '🏁 Grayscale'
                        : colorFilterConfig.sepia > 0
                        ? '📜 Sepia'
                        : colorFilterConfig.invert > 0
                        ? '⚡ Invert'
                        : '🎨 Filter On'}
                    </span>
                  </span>
                )}
                {musicConfig.enabled && musicConfig.selectedTrack && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-red-400 bg-red-950/60 px-2 py-0.5 rounded border border-red-500/30">
                    <Music className="h-3 w-3" />
                    <span className="truncate max-w-[120px]">
                      {musicConfig.customAudioName || musicConfig.selectedTrack.titleBn}
                    </span>
                    <span className="text-[9px] text-red-300 font-mono">
                      {Math.round(musicConfig.musicVolume * 100)}%
                    </span>
                  </span>
                )}
              </div>

              {/* Quality & FPS Presets */}
              <div className="flex items-center gap-1">
                {(['standard', 'high', 'ultra'] as const).map((qKey) => {
                  const preset = RECORDER_QUALITY_PRESETS[qKey];
                  const isSelected = recorderQuality === qKey;
                  return (
                    <button
                      key={qKey}
                      onClick={() => setRecorderQuality(qKey)}
                      disabled={isRecording}
                      title={preset.descriptionBn}
                      className={`text-[10px] px-2 py-1 rounded-md font-semibold transition-all border ${
                        isSelected
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                      } ${isRecording ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {preset.fps} FPS {qKey === 'ultra' ? '★' : ''}
                    </button>
                  );
                })}

                {/* Instant Canvas Snapshot Button */}
                <button
                  onClick={handleTakeSnapshot}
                  title="বর্তমান ক্যানভাস ফ্রেম ইমেজ আকারে ডাউনলোড করুন"
                  className="flex items-center gap-1 rounded-md border border-slate-700 bg-slate-900 hover:bg-slate-800 px-2 py-1 text-[10px] text-slate-300 hover:text-white transition-all ml-1"
                >
                  <Camera className="h-3 w-3 text-cyan-400" />
                  <span>{snapshotFeedback ? '✓ সংরক্ষিত!' : 'ফ্রেম স্ন্যাপ'}</span>
                </button>
              </div>
            </div>

            {/* Canvas Element Wrapper */}
            <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-black shadow-2xl flex items-center justify-center max-w-full">
              <canvas
                ref={canvasRef}
                width={canvasWidth}
                height={canvasHeight}
                className="max-h-[500px] w-auto object-contain rounded-lg"
              />

              {/* Recording Overlay with Live Controls */}
              {isRecording && (
                <div className="absolute inset-0 bg-black/65 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center space-y-3">
                  <div className="relative flex h-16 w-16 items-center justify-center">
                    <div className="absolute h-full w-full rounded-full border-4 border-red-500/30 border-t-red-500 animate-spin"></div>
                    <span
                      className={`h-5 w-5 rounded-full ${
                        isRecordingPaused ? 'bg-amber-500' : 'bg-red-500 animate-pulse'
                      }`}
                    ></span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-sm font-bold text-white block">
                      {isRecordingPaused
                        ? '⏸️ রেকর্ডিং সাময়িক স্থগিত (Paused)'
                        : `🎥 ক্যানভাস ফ্রেম সরাসরি রেকর্ড হচ্ছে... (${recordProgress}%)`}
                    </span>
                    <div className="flex items-center justify-center gap-2 text-xs font-mono text-cyan-400">
                      <span>⏱️ {Math.floor(recordingSeconds / 60)}:{(recordingSeconds % 60).toString().padStart(2, '0')}</span>
                      <span>•</span>
                      <span>{RECORDER_QUALITY_PRESETS[recorderQuality]?.fps || 30} FPS</span>
                      <span>•</span>
                      <span>{canvasWidth}×{canvasHeight}</span>
                    </div>
                  </div>

                  <div className="w-56 bg-slate-800 rounded-full h-2.5 overflow-hidden border border-slate-700">
                    <div
                      className={`h-full transition-all duration-100 ${
                        isRecordingPaused
                          ? 'bg-amber-500'
                          : 'bg-gradient-to-r from-red-500 via-amber-500 to-emerald-400'
                      }`}
                      style={{ width: `${recordProgress}%` }}
                    ></div>
                  </div>

                  <div className="text-[11px] text-emerald-300 font-mono">
                    🎙️ MediaRecorder লোকাল অডিও ও ভিডিও ফ্রেম সিঙ্ক হচ্ছে
                  </div>

                  {/* Pause / Resume & Finish Early Controls */}
                  <div className="flex items-center gap-2 pt-1">
                    {isRecordingPaused ? (
                      <button
                        onClick={resumeRecording}
                        className="flex items-center gap-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white border border-emerald-500 transition-all shadow-md"
                      >
                        <Play className="h-3 w-3 fill-white" />
                        <span>চালিয়ে যান (Resume)</span>
                      </button>
                    ) : (
                      <button
                        onClick={pauseRecording}
                        className="flex items-center gap-1.5 rounded-lg bg-amber-600/90 hover:bg-amber-500 px-3.5 py-1.5 text-xs font-semibold text-white border border-amber-400/50 transition-all shadow-md"
                      >
                        <Pause className="h-3 w-3" />
                        <span>পজ (Pause)</span>
                      </button>
                    )}

                    <button
                      onClick={stopRecordingEarly}
                      className="flex items-center gap-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 px-3.5 py-1.5 text-xs font-semibold text-slate-200 hover:text-white border border-slate-600 transition-all"
                    >
                      <Square className="h-3 w-3 fill-white" />
                      <span>রেকর্ড সম্পন্ন করুন</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mic Fallback & Recorder Error Notices */}
            {micFallbackNotice && (
              <div className="w-full mt-3 rounded-xl border border-amber-500/40 bg-amber-950/40 p-2.5 text-xs text-amber-200 flex items-center justify-between shadow-md">
                <span className="flex items-center gap-1.5">
                  <MicOff className="h-4 w-4 text-amber-400 shrink-0" />
                  <span>{micFallbackNotice}</span>
                </span>
                <button
                  type="button"
                  onClick={() => setMicFallbackNotice(null)}
                  className="text-amber-400 hover:text-white text-xs px-2"
                >
                  ✕
                </button>
              </div>
            )}

            {recorderErrorMsg && (
              <div className="w-full mt-3 rounded-xl border border-red-500/40 bg-red-950/40 p-2.5 text-xs text-red-200 flex items-center justify-between shadow-md">
                <span className="flex items-center gap-1.5">
                  <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
                  <span>{recorderErrorMsg}</span>
                </span>
                <button
                  type="button"
                  onClick={() => setRecorderErrorMsg(null)}
                  className="text-red-400 hover:text-white text-xs px-2"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Action Buttons: Record & Export */}
            <div className="w-full mt-5 flex flex-wrap gap-3 items-center justify-between border-t border-slate-800 pt-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={startRecording}
                  disabled={isRecording}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-950/40 transition-all disabled:opacity-50"
                >
                  <Play className="h-4 w-4 fill-white" />
                  <span>বাস্তব ভিডিও তৈরি ও রেকর্ড করুন ($০ খরচ)</span>
                </button>

                <button
                  onClick={handleTakeSnapshot}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 px-4 py-3 text-xs font-medium text-slate-300 hover:text-white transition-all"
                  title="ক্যানভাস ফ্রেম তাৎক্ষণিক PNG ইমেজ হিসেবে নামিয়ে নিন"
                >
                  <Camera className="h-3.5 w-3.5 text-cyan-400" />
                  <span>{snapshotFeedback ? '✓ স্ন্যাপশট সংরক্ষিত!' : 'ফ্রেম স্ন্যাপশট (.png)'}</span>
                </button>
              </div>

              {recordedVideoUrl && (
                <div className="flex items-center gap-2">
                  <a
                    href={recordedVideoUrl}
                    download={`canvas-render-${Date.now()}.${recordingResult?.mimeType?.includes('mp4') ? 'mp4' : 'webm'}`}
                    className="flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-5 py-3 text-sm font-bold text-white shadow-md transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    <span>
                      ভিডিও ফাইল ডাউনলোড ({recordingResult?.formattedSize || '.webm'})
                    </span>
                  </a>
                </div>
              )}
            </div>

            {/* Real-Time Color Filters Controls Panel (Grayscale, Sepia, Invert, Sliders) */}
            <ColorFilterControls
              config={colorFilterConfig}
              onChange={setColorFilterConfig}
              className="w-full mt-4"
              defaultExpanded={false}
            />

            {/* Generated Video Player Preview with Metadata */}
            {recordedVideoUrl && (
              <div className="w-full mt-4 rounded-xl border border-emerald-500/40 bg-emerald-950/20 p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-emerald-300 font-bold">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>✓ CanvasRecorder দিয়ে ভিডিও সফলভাবে এক্সপোর্ট সম্পন্ন</span>
                  </span>
                  <div className="flex items-center gap-2 font-mono text-[11px] text-slate-300 bg-slate-900/90 px-2.5 py-1 rounded-md border border-slate-700">
                    <span className="text-cyan-400">
                      সাইজ: {recordingResult?.formattedSize || 'N/A'}
                    </span>
                    <span>•</span>
                    <span>রেজোলিউশন: {canvasWidth}×{canvasHeight}</span>
                    <span>•</span>
                    <span className="text-amber-400">
                      {RECORDER_QUALITY_PRESETS[recorderQuality]?.fps || 30} FPS
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-300 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
                  <div>
                    🔊 <strong>লোকাল প্রসেসিং:</strong> কোনো সার্ভার বা এপিআই খরচ ছাড়াই ব্রাউজারের MediaRecorder API দিয়ে সরাসরি ফ্রেম ও সাউন্ড রেকর্ড করা হয়েছে।
                  </div>
                  <button
                    onClick={() => recordingResult?.download()}
                    className="ml-2 shrink-0 rounded-lg bg-emerald-700 hover:bg-emerald-600 px-3 py-1 text-[11px] font-semibold text-white border border-emerald-500"
                  >
                    পুনরায় ডাউনলোড
                  </button>
                </div>

                <video
                  src={recordedVideoUrl}
                  controls
                  playsInline
                  autoPlay
                  className="w-full max-h-64 rounded-lg bg-black object-contain border border-slate-800"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
