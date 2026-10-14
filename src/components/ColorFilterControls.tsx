import React, { useState } from 'react';
import {
  Palette,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Eye,
  Sliders,
  Check,
  Zap,
} from 'lucide-react';
import {
  CanvasColorFilterConfig,
  COLOR_FILTER_PRESETS,
  DEFAULT_COLOR_FILTER_CONFIG,
  buildCanvasFilterCss,
  countActiveFilters,
  isFilterActive,
} from './CanvasColorFilters';

interface ColorFilterControlsProps {
  config: CanvasColorFilterConfig;
  onChange: (config: CanvasColorFilterConfig) => void;
  className?: string;
  defaultExpanded?: boolean;
}

export const ColorFilterControls: React.FC<ColorFilterControlsProps> = ({
  config,
  onChange,
  className = '',
  defaultExpanded = false,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded);
  const activeCount = countActiveFilters(config);
  const filterCss = buildCanvasFilterCss(config);

  const handleUpdate = (field: keyof CanvasColorFilterConfig, value: any) => {
    onChange({
      ...config,
      [field]: value,
    });
  };

  const handleApplyPreset = (presetConfig: Partial<CanvasColorFilterConfig>) => {
    onChange({
      ...config,
      ...DEFAULT_COLOR_FILTER_CONFIG,
      ...presetConfig,
      target: config.target, // retain user target preference
      enabled: true,
    });
  };

  const handleReset = () => {
    onChange({
      ...DEFAULT_COLOR_FILTER_CONFIG,
      target: config.target,
    });
  };

  return (
    <div
      className={`rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl overflow-hidden transition-all ${className}`}
    >
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3.5 border-b border-slate-800/80 bg-slate-950/60">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-pink-500/20 text-pink-400 border border-pink-500/30">
            <Palette className="h-4 w-4" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                <span>রিয়েল-টাইম কালার ফিল্টার কন্ট্রোল</span>
                <span className="rounded bg-pink-500/20 px-1.5 py-0.5 text-[10px] text-pink-300 font-mono">
                  Hardware Accelerated
                </span>
              </h3>
            </div>
            <p className="text-[10px] text-slate-400">
              Grayscale, Sepia, Invert ও কাস্টম গ্রেডিং সরাসরি ক্যানভাসে রেন্ডার ও রেকর্ড হবে
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Active indicator */}
          {activeCount > 0 ? (
            <span className="flex items-center gap-1 text-[10px] font-bold text-pink-400 bg-pink-950/60 border border-pink-500/30 px-2 py-0.5 rounded-full animate-pulse">
              <Sparkles className="h-2.5 w-2.5" />
              <span>{activeCount}টি ফিল্টার সক্রিয়</span>
            </span>
          ) : (
            <span className="text-[10px] text-slate-500 font-mono px-1">
              স্বাভাবিক (Normal)
            </span>
          )}

          {/* Reset button */}
          {activeCount > 0 && (
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800/90 hover:bg-slate-700 px-2 py-1 text-[10px] font-semibold text-slate-300 hover:text-white transition-colors"
              title="ফিল্টার রিসেট করুন"
            >
              <RotateCcw className="h-3 w-3 text-amber-400" />
              <span>রিসেট</span>
            </button>
          )}

          {/* Expand/Collapse fine-tuning toggle */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 px-2.5 py-1 text-[11px] font-medium text-slate-300 transition-colors"
          >
            <SlidersHorizontal className="h-3 w-3 text-cyan-400" />
            <span className="hidden sm:inline">{isExpanded ? 'স্লাইডার গুটিয়ে নিন' : 'স্লাইডার কাস্টমাইজ'}</span>
            {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>
        </div>
      </div>

      <div className="p-3.5 space-y-3.5">
        {/* Instant 1-Click Preset Filter Chips */}
        <div>
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300 mb-2">
            <span className="flex items-center gap-1.5">
              <Zap className="h-3 w-3 text-amber-400" />
              <span>১-ক্লিকে কালার ফিল্টার প্রিসেট:</span>
            </span>
            <span className="text-[10px] text-slate-500">তাত্ক্ষণিক প্রিভিউ ও রেন্ডার</span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-3 xl:grid-cols-5 gap-1.5">
            {COLOR_FILTER_PRESETS.map((preset) => {
              const isSelected =
                preset.id === 'normal'
                  ? !isFilterActive(config)
                  : preset.id === 'grayscale'
                  ? config.grayscale === 100 && config.sepia === 0 && config.invert === 0
                  : preset.id === 'sepia'
                  ? config.sepia >= 90 && config.grayscale === 0 && config.invert === 0
                  : preset.id === 'invert'
                  ? config.invert === 100 && config.grayscale === 0
                  : preset.id === 'cinematic-noir'
                  ? config.grayscale === 100 && config.contrast > 140
                  : preset.id === 'cyberpunk'
                  ? config.hueRotate >= 280 && config.saturate >= 170
                  : preset.id === 'golden-retro'
                  ? config.sepia > 30 && config.saturate >= 130
                  : preset.id === 'vibrant-pop'
                  ? config.saturate >= 150 && config.grayscale === 0
                  : preset.id === 'cool-scifi'
                  ? config.hueRotate >= 180 && config.hueRotate <= 200
                  : false;

              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleApplyPreset(preset.config)}
                  title={preset.descriptionBn}
                  className={`group relative flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all ${
                    isSelected
                      ? 'border-pink-500 bg-pink-950/40 text-pink-300 ring-1 ring-pink-500/50 shadow-md shadow-pink-950/40'
                      : 'border-slate-800 bg-slate-950/70 text-slate-400 hover:text-white hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <span className="text-base mb-0.5 group-hover:scale-110 transition-transform">
                    {preset.icon}
                  </span>
                  <span className="text-[10px] font-bold leading-tight truncate w-full">
                    {preset.nameBn}
                  </span>
                  {isSelected && (
                    <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-pink-400" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Target Scope Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-slate-950/60 p-2.5 border border-slate-800/80 text-xs">
          <div className="flex items-center gap-1.5 text-slate-300 font-medium">
            <Eye className="h-3.5 w-3.5 text-cyan-400" />
            <span className="text-[11px]">ফিল্টার প্রয়োগের পরিধি (Scope):</span>
          </div>

          <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
            <button
              type="button"
              onClick={() => handleUpdate('target', 'master')}
              className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all ${
                config.target === 'master'
                  ? 'bg-pink-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              সমগ্র ক্যানভাস (Master)
            </button>
            <button
              type="button"
              onClick={() => handleUpdate('target', 'media')}
              className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all ${
                config.target === 'media'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              মিডিয়া ও প্রেজেন্টার (Media Only)
            </button>
          </div>
        </div>

        {/* Fine-Tuning Sliders Section */}
        {isExpanded && (
          <div className="pt-2 border-t border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-slate-300 flex items-center gap-1">
                <Sliders className="h-3.5 w-3.5 text-pink-400" />
                <span>ম্যানুয়াল কালার ফিল্টার স্লাইডার:</span>
              </span>
              <span className="font-mono text-[10px] text-pink-300/80 truncate max-w-[200px]">
                {filterCss}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* 1. Grayscale Slider */}
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-slate-300 font-medium text-[11px] flex items-center gap-1">
                    <span>🏁 Grayscale (সাদা-কালো):</span>
                  </label>
                  <span className="font-mono text-[10px] text-cyan-400 font-bold">
                    {Math.round(config.grayscale)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={config.grayscale}
                  onChange={(e) => handleUpdate('grayscale', Number(e.target.value))}
                  className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* 2. Sepia Slider */}
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-slate-300 font-medium text-[11px] flex items-center gap-1">
                    <span>📜 Sepia (ভিন্টেজ সেপিয়া):</span>
                  </label>
                  <span className="font-mono text-[10px] text-amber-400 font-bold">
                    {Math.round(config.sepia)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={config.sepia}
                  onChange={(e) => handleUpdate('sepia', Number(e.target.value))}
                  className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* 3. Invert Slider */}
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-slate-300 font-medium text-[11px] flex items-center gap-1">
                    <span>⚡ Invert (নেগেটিভ ইনভার্ট):</span>
                  </label>
                  <span className="font-mono text-[10px] text-pink-400 font-bold">
                    {Math.round(config.invert)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={config.invert}
                  onChange={(e) => handleUpdate('invert', Number(e.target.value))}
                  className="w-full accent-pink-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* 4. Brightness Slider */}
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-slate-300 font-medium text-[11px] flex items-center gap-1">
                    <span>☀️ Brightness (উজ্জ্বলতা):</span>
                  </label>
                  <span className="font-mono text-[10px] text-yellow-400 font-bold">
                    {Math.round(config.brightness)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="180"
                  step="1"
                  value={config.brightness}
                  onChange={(e) => handleUpdate('brightness', Number(e.target.value))}
                  className="w-full accent-yellow-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* 5. Contrast Slider */}
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-slate-300 font-medium text-[11px] flex items-center gap-1">
                    <span>⚖️ Contrast (কনট্রাস্ট):</span>
                  </label>
                  <span className="font-mono text-[10px] text-emerald-400 font-bold">
                    {Math.round(config.contrast)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="200"
                  step="1"
                  value={config.contrast}
                  onChange={(e) => handleUpdate('contrast', Number(e.target.value))}
                  className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* 6. Saturation Slider */}
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-slate-300 font-medium text-[11px] flex items-center gap-1">
                    <span>🎨 Saturation (স্যাচুরেশন):</span>
                  </label>
                  <span className="font-mono text-[10px] text-purple-400 font-bold">
                    {Math.round(config.saturate)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="200"
                  step="1"
                  value={config.saturate}
                  onChange={(e) => handleUpdate('saturate', Number(e.target.value))}
                  className="w-full accent-purple-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* 7. Hue Rotate Slider */}
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-slate-300 font-medium text-[11px] flex items-center gap-1">
                    <span>🌈 Hue Rotate (রঙের আবর্তন):</span>
                  </label>
                  <span className="font-mono text-[10px] text-sky-400 font-bold">
                    {Math.round(config.hueRotate)}°
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  step="1"
                  value={config.hueRotate}
                  onChange={(e) => handleUpdate('hueRotate', Number(e.target.value))}
                  className="w-full accent-sky-400 h-1.5 bg-gradient-to-r from-red-500 via-green-500 via-blue-500 to-red-500 rounded-lg cursor-pointer"
                />
              </div>

              {/* 8. Blur Slider */}
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-slate-300 font-medium text-[11px] flex items-center gap-1">
                    <span>🌫️ Blur (ব্লার / ডিফোকাস):</span>
                  </label>
                  <span className="font-mono text-[10px] text-slate-300 font-bold">
                    {config.blur.toFixed(1)} px
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="8"
                  step="0.5"
                  value={config.blur}
                  onChange={(e) => handleUpdate('blur', Number(e.target.value))}
                  className="w-full accent-slate-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
