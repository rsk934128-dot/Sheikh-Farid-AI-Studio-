/**
 * CanvasColorFilters.ts
 * 
 * Real-time color filter pipeline for HTML5 Canvas 2D and MediaRecorder API.
 * Provides client-side hardware-accelerated color transformations (Grayscale, Sepia,
 * Invert, Brightness, Contrast, Saturation, Hue Rotation, Blur) with $0 server cost.
 */

export interface CanvasColorFilterConfig {
  enabled: boolean;
  grayscale: number; // 0 to 100%
  sepia: number; // 0 to 100%
  invert: number; // 0 to 100%
  brightness: number; // 50 to 200% (default 100)
  contrast: number; // 50 to 200% (default 100)
  saturate: number; // 0 to 200% (default 100)
  hueRotate: number; // 0 to 360deg
  blur: number; // 0 to 10px
  target: 'master' | 'media'; // 'master' = entire canvas output, 'media' = backdrops & presenter
}

export const DEFAULT_COLOR_FILTER_CONFIG: CanvasColorFilterConfig = {
  enabled: true,
  grayscale: 0,
  sepia: 0,
  invert: 0,
  brightness: 100,
  contrast: 100,
  saturate: 100,
  hueRotate: 0,
  blur: 0,
  target: 'master',
};

export interface ColorFilterPreset {
  id: string;
  name: string;
  nameBn: string;
  icon: string;
  descriptionBn: string;
  config: Partial<CanvasColorFilterConfig>;
}

export const COLOR_FILTER_PRESETS: ColorFilterPreset[] = [
  {
    id: 'normal',
    name: 'Normal / Original',
    nameBn: 'স্বাভাবিক (অরিজিনাল)',
    icon: '✨',
    descriptionBn: 'কোনো ফিল্টার ছাড়া স্বাভাবিক অরিজিনাল কালার',
    config: {
      grayscale: 0,
      sepia: 0,
      invert: 0,
      brightness: 100,
      contrast: 100,
      saturate: 100,
      hueRotate: 0,
      blur: 0,
    },
  },
  {
    id: 'grayscale',
    name: 'Grayscale',
    nameBn: 'সাদা-কালো (Grayscale)',
    icon: '🏁',
    descriptionBn: 'ক্লাসিক মনোক্রোম সাদাকালো সিনেমাটিক লুক',
    config: {
      grayscale: 100,
      sepia: 0,
      invert: 0,
      brightness: 100,
      contrast: 115,
      saturate: 0,
      hueRotate: 0,
      blur: 0,
    },
  },
  {
    id: 'sepia',
    name: 'Vintage Sepia',
    nameBn: 'ভিন্টেজ সেপিয়া (Sepia)',
    icon: '📜',
    descriptionBn: 'ঐতিহাসিক ও উষ্ণ বাদামি ভিন্টেজ ফটো টোন',
    config: {
      grayscale: 0,
      sepia: 95,
      invert: 0,
      brightness: 100,
      contrast: 110,
      saturate: 110,
      hueRotate: 0,
      blur: 0,
    },
  },
  {
    id: 'invert',
    name: 'Negative Invert',
    nameBn: 'এক্স-রে ইনভার্ট (Invert)',
    icon: '⚡',
    descriptionBn: 'রঙের নেগেটিভ ইনভার্শন - সাইবার ও এক্সরে স্টাইল',
    config: {
      grayscale: 0,
      sepia: 0,
      invert: 100,
      brightness: 100,
      contrast: 120,
      saturate: 100,
      hueRotate: 0,
      blur: 0,
    },
  },
  {
    id: 'cinematic-noir',
    name: 'Film Noir',
    nameBn: 'সিনেমাটিক নয়ার (Film Noir)',
    icon: '🎬',
    descriptionBn: 'উচ্চ কনট্রাস্ট ড্রামাটিক ব্ল্যাক অ্যান্ড হোয়াইট সিনেমা',
    config: {
      grayscale: 100,
      sepia: 10,
      invert: 0,
      brightness: 90,
      contrast: 155,
      saturate: 0,
      hueRotate: 0,
      blur: 0,
    },
  },
  {
    id: 'golden-retro',
    name: 'Golden Retro',
    nameBn: 'গোল্ডেন সানসেট (Retro)',
    icon: '🌅',
    descriptionBn: 'উষ্ণ সোনালী আভা ও সমৃদ্ধ কালার টোন',
    config: {
      grayscale: 0,
      sepia: 45,
      invert: 0,
      brightness: 105,
      contrast: 115,
      saturate: 140,
      hueRotate: 350,
      blur: 0,
    },
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk Neon',
    nameBn: 'সাইবার নিয়ন (Cyberpunk)',
    icon: '🌌',
    descriptionBn: 'উচ্চ স্যাচুরেশন ও ম্যাজেন্টা-সায়ান নিয়ন ভাইব',
    config: {
      grayscale: 0,
      sepia: 0,
      invert: 0,
      brightness: 105,
      contrast: 135,
      saturate: 180,
      hueRotate: 285,
      blur: 0,
    },
  },
  {
    id: 'vibrant-pop',
    name: 'Vibrant Pop',
    nameBn: 'উজ্জ্বল পপ (Vibrant)',
    icon: '🔥',
    descriptionBn: 'সোশ্যাল মিডিয়া রিল ও শর্টসের জন্য তীব্র কালার পপ',
    config: {
      grayscale: 0,
      sepia: 0,
      invert: 0,
      brightness: 105,
      contrast: 120,
      saturate: 165,
      hueRotate: 0,
      blur: 0,
    },
  },
  {
    id: 'cool-scifi',
    name: 'Cool Sci-Fi',
    nameBn: 'কোল্ড সাই-ফাই (Sci-Fi)',
    icon: '❄️',
    descriptionBn: 'শীতল সায়ান ও নীল প্রযুক্তির আধুনিক লুক',
    config: {
      grayscale: 0,
      sepia: 0,
      invert: 0,
      brightness: 95,
      contrast: 125,
      saturate: 95,
      hueRotate: 185,
      blur: 0,
    },
  },
];

/**
 * Builds standard CSS filter string compatible with CanvasRenderingContext2D.filter
 * Example: "grayscale(100%) sepia(30%) invert(0%) brightness(110%) contrast(120%)"
 */
export function buildCanvasFilterCss(config: CanvasColorFilterConfig): string {
  if (!config.enabled) return 'none';

  const parts: string[] = [];

  if (config.grayscale > 0) {
    parts.push(`grayscale(${Math.round(config.grayscale)}%)`);
  }
  if (config.sepia > 0) {
    parts.push(`sepia(${Math.round(config.sepia)}%)`);
  }
  if (config.invert > 0) {
    parts.push(`invert(${Math.round(config.invert)}%)`);
  }
  if (config.contrast !== 100) {
    parts.push(`contrast(${Math.round(config.contrast)}%)`);
  }
  if (config.brightness !== 100) {
    parts.push(`brightness(${Math.round(config.brightness)}%)`);
  }
  if (config.saturate !== 100) {
    parts.push(`saturate(${Math.round(config.saturate)}%)`);
  }
  if (config.hueRotate > 0 && config.hueRotate !== 360) {
    parts.push(`hue-rotate(${Math.round(config.hueRotate)}deg)`);
  }
  if (config.blur > 0) {
    parts.push(`blur(${config.blur.toFixed(1)}px)`);
  }

  return parts.length > 0 ? parts.join(' ') : 'none';
}

/**
 * Checks whether any color filter parameter is actively altered from standard default
 */
export function isFilterActive(config: CanvasColorFilterConfig): boolean {
  if (!config.enabled) return false;
  return (
    config.grayscale > 0 ||
    config.sepia > 0 ||
    config.invert > 0 ||
    config.contrast !== 100 ||
    config.brightness !== 100 ||
    config.saturate !== 100 ||
    (config.hueRotate > 0 && config.hueRotate !== 360) ||
    config.blur > 0
  );
}

/**
 * Returns number of modified filter properties
 */
export function countActiveFilters(config: CanvasColorFilterConfig): number {
  if (!config.enabled) return 0;
  let count = 0;
  if (config.grayscale > 0) count++;
  if (config.sepia > 0) count++;
  if (config.invert > 0) count++;
  if (config.contrast !== 100) count++;
  if (config.brightness !== 100) count++;
  if (config.saturate !== 100) count++;
  if (config.hueRotate > 0 && config.hueRotate !== 360) count++;
  if (config.blur > 0) count++;
  return count;
}
