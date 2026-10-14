import React, { useState, useEffect, useRef } from 'react';
import {
  Music,
  Sliders,
  Volume2,
  VolumeX,
  Upload,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Headphones,
  Check,
  Disc,
  Info,
  Radio,
  FileAudio,
  Trash2,
} from 'lucide-react';
import {
  BGM_PRESETS,
  AudioMixerConfig,
  DEFAULT_MIXER_CONFIG,
  WebAudioLiveMixer,
  decodeAudioFile,
} from './WebAudioMixer';

interface AudioMixerControlsProps {
  config: AudioMixerConfig;
  onChange: (config: AudioMixerConfig) => void;
  onUploadCustomBgm: (file: File, buffer: AudioBuffer) => void;
  onClearCustomBgm: () => void;
  customBgmFile: File | null;
  customBgmBuffer: AudioBuffer | null;
  className?: string;
}

export const AudioMixerControls: React.FC<AudioMixerControlsProps> = ({
  config,
  onChange,
  onUploadCustomBgm,
  onClearCustomBgm,
  customBgmFile,
  customBgmBuffer,
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState<boolean>(false);
  const [voiceMeterLevel, setVoiceMeterLevel] = useState<number>(0);
  const [bgmMeterLevel, setBgmMeterLevel] = useState<number>(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const previewMixerRef = useRef<WebAudioLiveMixer | null>(null);
  const previewCtxRef = useRef<AudioContext | null>(null);
  const previewMeterIntervalRef = useRef<any>(null);

  // Stop preview on unmount
  useEffect(() => {
    return () => {
      stopPreviewMix();
    };
  }, []);

  // Update preview mixer config if playing
  useEffect(() => {
    if (previewMixerRef.current && isPreviewPlaying) {
      previewMixerRef.current.setConfig(config);
      if (config.selectedPresetId === 'custom-upload' && customBgmBuffer) {
        previewMixerRef.current.setBgmBuffer(customBgmBuffer);
      }
    }
  }, [config, customBgmBuffer, isPreviewPlaying]);

  const handlePresetSelect = (presetId: string) => {
    onChange({
      ...config,
      selectedPresetId: presetId,
      enableBgm: true,
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      const tempCtx = new AudioCtxClass();
      const decodedBuffer = await decodeAudioFile(tempCtx, file);
      tempCtx.close().catch(() => {});

      onUploadCustomBgm(file, decodedBuffer);
      onChange({
        ...config,
        selectedPresetId: 'custom-upload',
        enableBgm: true,
      });
    } catch (err: any) {
      console.error('BGM decode error:', err);
      setUploadError('অডিও ফাইলটি ডিকোড করা সম্ভব হয়নি। অনুগ্রহ করে স্ট্যান্ডার্ড MP3 বা WAV ফাইল ব্যবহার করুন।');
    }
  };

  const startPreviewMix = async () => {
    try {
      stopPreviewMix();

      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtxClass();
      previewCtxRef.current = ctx;

      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      const mixer = new WebAudioLiveMixer(config);
      previewMixerRef.current = mixer;

      if (config.selectedPresetId === 'custom-upload' && customBgmBuffer) {
        mixer.setBgmBuffer(customBgmBuffer);
      }

      mixer.attach(ctx);
      mixer.startBgm();

      // Play simulated test voice pulses to showcase real-time automatic ducking
      let tick = 0;
      previewMeterIntervalRef.current = setInterval(() => {
        tick++;
        // Simulate speech activity every 3 seconds to demonstrate ducking
        if (config.enableDucking) {
          if (tick % 6 === 2) {
            mixer.triggerSpeechStart();
          } else if (tick % 6 === 5) {
            mixer.triggerSpeechEnd();
          }
        }

        const levels = mixer.getLevels();
        setVoiceMeterLevel(levels.voiceLevel);
        setBgmMeterLevel(levels.bgmLevel);
      }, 100);

      setIsPreviewPlaying(true);
    } catch (err) {
      console.error('Failed to preview audio mix:', err);
      setIsPreviewPlaying(false);
    }
  };

  const stopPreviewMix = () => {
    if (previewMeterIntervalRef.current) {
      clearInterval(previewMeterIntervalRef.current);
      previewMeterIntervalRef.current = null;
    }

    if (previewMixerRef.current) {
      previewMixerRef.current.destroy();
      previewMixerRef.current = null;
    }

    if (previewCtxRef.current) {
      previewCtxRef.current.close().catch(() => {});
      previewCtxRef.current = null;
    }

    setIsPreviewPlaying(false);
    setVoiceMeterLevel(0);
    setBgmMeterLevel(0);
  };

  const resetMixer = () => {
    stopPreviewMix();
    onChange({ ...DEFAULT_MIXER_CONFIG });
  };

  return (
    <div
      className={`rounded-2xl border border-cyan-500/40 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/30 p-4 shadow-xl space-y-4 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Music className="h-4 w-4" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">
                ওয়েব অডিও ব্যাকগ্রাউন্ড মিউজিক ও সাউন্ড মিক্সার
              </h3>
              <span className="text-[10px] font-bold text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded-full border border-cyan-500/30">
                Web Audio API
              </span>
            </div>
            <p className="text-[10px] text-cyan-400 font-medium">
              ✓ আপলোড করা বা সিন্থেসাইজড ব্যাকগ্রাউন্ড অডিও সরাসরি এক্সপোর্টে মিক্স হবে
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={resetMixer}
            title="মিক্সার ডিফল্ট করুন"
            className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 bg-cyan-950/40 px-2.5 py-1 rounded-lg border border-cyan-500/30"
          >
            <Sliders className="h-3 w-3" />
            <span>{isExpanded ? 'লুকান' : 'মিক্সার অপশন'}</span>
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-4">
          {/* Master BGM Enable Toggle & Presets */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Disc className="h-3.5 w-3.5 text-cyan-400" />
                <span>ব্যাকগ্রাউন্ড অডিও ট্র্যাক নির্বাচন করুন:</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={config.enableBgm}
                  onChange={(e) => onChange({ ...config, enableBgm: e.target.checked })}
                  className="rounded border-slate-700 text-cyan-500 focus:ring-0"
                />
                <span className={`text-[11px] font-semibold ${config.enableBgm ? 'text-cyan-300' : 'text-slate-500'}`}>
                  {config.enableBgm ? 'সাউন্ড সক্রিয়' : 'মিউট (বন্ধ)'}
                </span>
              </label>
            </div>

            {/* Presets Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {BGM_PRESETS.map((preset) => {
                const isSelected = config.selectedPresetId === preset.id;
                const isCustom = preset.id === 'custom-upload';
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handlePresetSelect(preset.id)}
                    className={`rounded-xl border p-2.5 text-left transition-all ${
                      isSelected
                        ? 'border-cyan-500 bg-cyan-950/50 text-cyan-200 ring-1 ring-cyan-500/50 shadow-md'
                        : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-[11px] flex items-center gap-1.5">
                        {isCustom ? (
                          <Upload className="h-3.5 w-3.5 text-amber-400" />
                        ) : (
                          <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                        )}
                        <span>{preset.nameBn}</span>
                      </span>
                      {preset.bpm > 0 && (
                        <span className="font-mono text-[9px] text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                          {preset.bpm} BPM
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 leading-snug line-clamp-2">
                      {preset.descriptionBn}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom BGM Upload File Box (Shown when custom-upload is chosen or file is present) */}
          {(config.selectedPresetId === 'custom-upload' || customBgmFile) && (
            <div className="rounded-xl border border-amber-500/40 bg-amber-950/20 p-3 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-amber-300 flex items-center gap-1.5">
                  <FileAudio className="h-4 w-4" />
                  <span>নিজের অডিও ফাইল (MP3, WAV, AAC, OGG):</span>
                </span>
                {customBgmFile && (
                  <button
                    type="button"
                    onClick={() => {
                      onClearCustomBgm();
                      onChange({ ...config, selectedPresetId: 'news-broadcast' });
                    }}
                    className="flex items-center gap-1 text-[10px] text-red-400 hover:text-red-300 font-semibold"
                  >
                    <Trash2 className="h-3 w-3" />
                    <span>মুছে ফেলুন</span>
                  </button>
                )}
              </div>

              {!customBgmFile ? (
                <div>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleFileUpload}
                    className="w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-600 file:text-white hover:file:bg-amber-500 cursor-pointer"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    টিপস: ব্যাকগ্রাউন্ড মিউজিক বা পছন্দের যেকোনো গান আপলোড করলে Web Audio API স্বয়ংক্রিয়ভাবে অডিও ডাটা ডিকোড করে ভিডিওতে মিক্স করে দেবে।
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-xs">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-amber-500/20 text-amber-300">
                      🎵
                    </span>
                    <div className="truncate">
                      <div className="text-[11px] font-bold text-amber-200 truncate">
                        {customBgmFile.name}
                      </div>
                      <div className="text-[9px] text-slate-400 font-mono">
                        {(customBgmFile.size / (1024 * 1024)).toFixed(2)} MB •{' '}
                        {customBgmBuffer ? `${Math.round(customBgmBuffer.duration)} সেকেন্ড` : 'ডিকোড সম্পন্ন'}
                      </div>
                    </div>
                  </div>
                  <span className="shrink-0 text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                    ✓ প্রস্তুত
                  </span>
                </div>
              )}

              {uploadError && (
                <p className="text-[10px] text-red-400 font-medium">{uploadError}</p>
              )}
            </div>
          )}

          {/* Multitrack Volume Mixer Sliders */}
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 space-y-3">
            <div className="flex items-center justify-between text-xs border-b border-slate-800/80 pb-2">
              <span className="font-bold text-slate-300 flex items-center gap-1.5">
                <Sliders className="h-3.5 w-3.5 text-cyan-400" />
                <span>মাল্টি-ট্র্যাক সাউন্ড ব্যালেন্স (Audio Faders):</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {config.enableDucking ? '🛡️ অটো-ডাকিং সক্রিয়' : 'স্বাভাবিক মিক্স'}
              </span>
            </div>

            {/* Slider 1: Voice / Speech Track Volume */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <Volume2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>🎙️ উপস্থাপক / ভয়েস ভলিউম:</span>
                </span>
                <span className="font-mono text-[11px] text-emerald-400 font-bold">
                  {Math.round(config.voiceVolume * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1.5"
                step="0.05"
                value={config.voiceVolume}
                onChange={(e) =>
                  onChange({ ...config, voiceVolume: parseFloat(e.target.value) })
                }
                className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Slider 2: Background Music Track Volume */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <Music className="h-3.5 w-3.5 text-cyan-400" />
                  <span>🎵 ব্যাকগ্রাউন্ড মিউজিক ভলিউম:</span>
                </span>
                <span className="font-mono text-[11px] text-cyan-400 font-bold">
                  {config.enableBgm ? `${Math.round(config.bgmVolume * 100)}%` : 'মিউট (০%)'}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1.0"
                step="0.02"
                value={config.enableBgm ? config.bgmVolume : 0}
                onChange={(e) =>
                  onChange({
                    ...config,
                    bgmVolume: parseFloat(e.target.value),
                    enableBgm: parseFloat(e.target.value) > 0,
                  })
                }
                className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Auto Ducking & Loop Settings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-xs">
              <label className="flex items-center gap-2 cursor-pointer bg-slate-900 p-2 rounded-lg border border-slate-800">
                <input
                  type="checkbox"
                  checked={config.enableDucking}
                  onChange={(e) => onChange({ ...config, enableDucking: e.target.checked })}
                  className="rounded border-slate-700 text-cyan-500 focus:ring-0"
                />
                <div>
                  <span className="text-[11px] text-slate-200 font-semibold block">
                    🛡️ অটো-ডাকিং (Auto-Ducking)
                  </span>
                  <span className="text-[9px] text-slate-400 block">
                    কথা বলার সময় ব্যাকগ্রাউন্ড সুর নিজে কমে যাবে
                  </span>
                </div>
              </label>

              <label className="flex items-center gap-2 cursor-pointer bg-slate-900 p-2 rounded-lg border border-slate-800">
                <input
                  type="checkbox"
                  checked={config.loopBgm}
                  onChange={(e) => onChange({ ...config, loopBgm: e.target.checked })}
                  className="rounded border-slate-700 text-cyan-500 focus:ring-0"
                />
                <div>
                  <span className="text-[11px] text-slate-200 font-semibold block">
                    🔁 অবিরাম লুপ (Seamless Loop)
                  </span>
                  <span className="text-[9px] text-slate-400 block">
                    পুরো ভিডিওর সময় ধরে পুনরাবৃত্তি হবে
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Live Audio Mix Preview & VU Level Meters */}
          <div className="rounded-xl border border-cyan-500/30 bg-slate-950 p-3 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={isPreviewPlaying ? stopPreviewMix : startPreviewMix}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all shadow ${
                    isPreviewPlaying
                      ? 'bg-amber-600 hover:bg-amber-500 text-white animate-pulse'
                      : 'bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white'
                  }`}
                >
                  {isPreviewPlaying ? (
                    <>
                      <Pause className="h-3.5 w-3.5" />
                      <span>প্রিভিউ বন্ধ করুন</span>
                    </>
                  ) : (
                    <>
                      <Headphones className="h-3.5 w-3.5" />
                      <span>🎧 অডিও মিক্স টেস্ট শুনুন</span>
                    </>
                  )}
                </button>
                <span className="text-[10px] text-slate-400">
                  {isPreviewPlaying
                    ? '🔊 লাইভ স্পিকারে সাউন্ড বাজছে...'
                    : 'রেকর্ড করার আগে সুর ও ভয়েসের ব্যালেন্স চেক করুন'}
                </span>
              </div>
            </div>

            {/* VU Meter Bars */}
            {isPreviewPlaying && (
              <div className="space-y-1.5 pt-1 border-t border-slate-800">
                <div className="flex items-center gap-2 text-[10px] font-mono">
                  <span className="w-16 text-emerald-400 truncate">🎙️ Voice:</span>
                  <div className="flex-1 bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-75"
                      style={{ width: `${voiceMeterLevel}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-slate-400">{voiceMeterLevel}%</span>
                </div>

                <div className="flex items-center gap-2 text-[10px] font-mono">
                  <span className="w-16 text-cyan-400 truncate">🎵 Music:</span>
                  <div className="flex-1 bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-75"
                      style={{ width: `${bgmMeterLevel}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-slate-400">{bgmMeterLevel}%</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
