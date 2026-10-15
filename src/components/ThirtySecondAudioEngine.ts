/**
 * ThirtySecondAudioEngine.ts
 * 
 * 30-Second Procedural & AI Music Composition Engine for Web Audio API.
 * Synthesizes complete 30-second song arrangements with multi-track polyphony:
 * (Intro -> Verse -> Chorus/Drop -> Outro)
 * $0 Server/API Cost - 100% Client-Side Real-Time Synthesis & Audio Export.
 */

export type SongGenre =
  | 'bangla-folk'
  | 'news-broadcast'
  | 'lofi-chill'
  | 'viral-edm'
  | 'cinematic-epic'
  | 'acoustic-ballad'
  | 'spiritual-sufi'
  | 'cyberpunk-synth';

export interface MusicalScale {
  id: string;
  name: string;
  nameBn: string;
  rootFreq: number; // Base frequency (e.g., A3 = 220, C4 = 261.63)
  intervals: number[]; // semitone intervals from root
}

export const MUSICAL_SCALES: Record<string, MusicalScale> = {
  c_major: {
    id: 'c_major',
    name: 'C Major',
    nameBn: 'সি মেজর (আনন্দদায়ক)',
    rootFreq: 261.63,
    intervals: [0, 2, 4, 5, 7, 9, 11, 12],
  },
  a_minor: {
    id: 'a_minor',
    name: 'A Minor',
    nameBn: 'এ মাইনর (গম্ভীর ও আবেগঘন)',
    rootFreq: 220.0,
    intervals: [0, 2, 3, 5, 7, 8, 10, 12],
  },
  bangla_bhairav: {
    id: 'bangla_bhairav',
    name: 'Bhairav / Bangla Folk',
    nameBn: 'ভৈরব রাগ / বাউল সুর',
    rootFreq: 220.0,
    intervals: [0, 1, 4, 5, 7, 8, 11, 12],
  },
  d_dorian: {
    id: 'd_dorian',
    name: 'D Dorian',
    nameBn: 'ডি ডোরিয়ান (রহস্যময় ও সিনেমাটিক)',
    rootFreq: 146.83,
    intervals: [0, 2, 3, 5, 7, 9, 10, 12],
  },
  pentatonic_major: {
    id: 'pentatonic_major',
    name: 'Pentatonic Major',
    nameBn: 'পেন্টাটনিক (স্নিগ্ধ ও মিষ্টি)',
    rootFreq: 261.63,
    intervals: [0, 2, 4, 7, 9, 12],
  },
};

export interface SongStylePreset {
  id: SongGenre;
  title: string;
  titleBn: string;
  taglineBn: string;
  icon: string;
  defaultBpm: number;
  scaleId: string;
  leadWave: OscillatorType;
  bassWave: OscillatorType;
  padWave: OscillatorType;
  chords: number[][]; // Frequency combinations
  melodyNotes: number[]; // Sequence of frequencies
  descriptionBn: string;
}

export const SONG_STYLE_PRESETS: Record<SongGenre, SongStylePreset> = {
  'bangla-folk': {
    id: 'bangla-folk',
    title: 'Bangla Folk & Baul Melody',
    titleBn: 'বাউল ও গ্রামীণ পল্লী সুর',
    taglineBn: 'একতারা, বাঁশি ও মাটির মায়াময় সুরের মূর্ছনা',
    icon: '🇧🇩',
    defaultBpm: 88,
    scaleId: 'bangla_bhairav',
    leadWave: 'sine',
    bassWave: 'triangle',
    padWave: 'sawtooth',
    chords: [
      [220.0, 277.18, 329.63], // A, C#, E
      [196.0, 246.94, 293.66], // G, B, D
      [174.61, 220.0, 261.63], // F, A, C
      [220.0, 261.63, 329.63], // Am
    ],
    melodyNotes: [
      329.63, 370.0, 440.0, 392.0, 329.63, 293.66, 329.63, 220.0,
      440.0, 493.88, 554.37, 493.88, 440.0, 329.63, 370.0, 440.0
    ],
    descriptionBn: 'বাঁশির নরম আভা, ঐতিহ্যবাহী একতারার ছন্দ ও নদীর তীরের ভাটিয়ালি আবহ',
  },
  'news-broadcast': {
    id: 'news-broadcast',
    title: 'Prime News Broadcast Theme',
    titleBn: 'ব্রেকিং নিউজ ও জরুরি বুলেটিন থিম',
    taglineBn: 'জরুরি ঘোষণা, জাতীয় সংবাদ ও লাইভ স্টুডিও আবহ',
    icon: '📺',
    defaultBpm: 128,
    scaleId: 'a_minor',
    leadWave: 'sawtooth',
    bassWave: 'sawtooth',
    padWave: 'triangle',
    chords: [
      [174.61, 220.0, 261.63], // F, A, C
      [207.65, 261.63, 311.13], // Ab, C, Eb
      [261.63, 329.63, 392.0], // C, E, G
      [220.0, 261.63, 329.63], // Am
    ],
    melodyNotes: [
      440.0, 440.0, 523.25, 440.0, 659.25, 587.33, 523.25, 440.0,
      440.0, 440.0, 493.88, 523.25, 659.25, 698.46, 659.25, 523.25
    ],
    descriptionBn: 'উচ্চ প্রযুক্তির পাঞ্চি নিউজ স্ট্রিঙ্গার, রোলিং পারকাশন ও টিকার বিট',
  },
  'lofi-chill': {
    id: 'lofi-chill',
    title: 'Rainy Cafe Lofi Study Beat',
    titleBn: 'লো-ফাই রিল্যাক্সিং কফিহাউস বিট',
    taglineBn: 'নস্টালজিক রোডস পিয়ানো, সফট চিলহপ ড্রামস',
    icon: '☕',
    defaultBpm: 80,
    scaleId: 'c_major',
    leadWave: 'sine',
    bassWave: 'sine',
    padWave: 'triangle',
    chords: [
      [146.83, 220.0, 261.63, 329.63], // Dm9
      [196.0, 246.94, 329.63, 392.0], // G13
      [130.81, 196.0, 246.94, 329.63], // Cmaj9
      [220.0, 261.63, 329.63, 392.0], // Am7
    ],
    melodyNotes: [
      329.63, 392.0, 493.88, 523.25, 493.88, 392.0, 329.63, 293.66,
      329.63, 261.63, 293.66, 329.63, 392.0, 493.88, 440.0, 392.0
    ],
    descriptionBn: 'শান্ত ও ধীরগতির পিয়ানো নোটস ও ভিনাইল ক্র্যাকল আবহ',
  },
  'viral-edm': {
    id: 'viral-edm',
    title: 'Viral Future Bass & Pop Drop',
    titleBn: 'ভাইরাল পপ ও ইডিএম ফিউচার ড্রপ',
    taglineBn: 'টিকটক ও রিলসের জন্য সুপারস একস্টাসি ও হাইপ ড্রামস',
    icon: '⚡',
    defaultBpm: 128,
    scaleId: 'c_major',
    leadWave: 'sawtooth',
    bassWave: 'square',
    padWave: 'sawtooth',
    chords: [
      [261.63, 329.63, 392.0], // C
      [196.0, 246.94, 293.66], // G
      [220.0, 261.63, 329.63], // Am
      [174.61, 220.0, 261.63], // F
    ],
    melodyNotes: [
      523.25, 659.25, 783.99, 659.25, 587.33, 523.25, 659.25, 783.99,
      880.0, 783.99, 659.25, 587.33, 523.25, 659.25, 523.25, 392.0
    ],
    descriptionBn: 'সাইডচেইন সিন্থ কর্ড, ড্রাইভ ড্রপ এবং ড্রাম রোলিং বিট',
  },
  'cinematic-epic': {
    id: 'cinematic-epic',
    title: 'Cinematic Orchestral Trailer',
    titleBn: 'সিনেমাটিক ট্রেইলার ও ক্লাইম্যাক্স',
    taglineBn: 'গভীর লো-সেলো ড্রোন ও আবেগঘন সিনেমাটিক স্ট্রিংস',
    icon: '🎬',
    defaultBpm: 92,
    scaleId: 'd_dorian',
    leadWave: 'sine',
    bassWave: 'sawtooth',
    padWave: 'sawtooth',
    chords: [
      [146.83, 220.0, 293.66], // Dm
      [174.61, 220.0, 261.63], // F
      [130.81, 196.0, 261.63], // C
      [196.0, 246.94, 293.66], // G
    ],
    melodyNotes: [
      293.66, 329.63, 349.23, 440.0, 523.25, 493.88, 440.0, 392.0,
      440.0, 523.25, 587.33, 523.25, 440.0, 349.23, 329.63, 293.66
    ],
    descriptionBn: 'তথ্যচিত্র, ইতিহাস ও রোমাঞ্চকর সিনেমাটিক যাত্রার জন্য আদর্শ',
  },
  'acoustic-ballad': {
    id: 'acoustic-ballad',
    title: 'Acoustic Guitar Warm Ballad',
    titleBn: 'অ্যাকোস্টিক গিটার ও উষ্ণ মেলোডি',
    taglineBn: 'মিষ্টি গিটার স্ট্রামিং ও হৃদয়স্পর্শী হারমোনি',
    icon: '🎸',
    defaultBpm: 96,
    scaleId: 'pentatonic_major',
    leadWave: 'triangle',
    bassWave: 'sine',
    padWave: 'sine',
    chords: [
      [261.63, 329.63, 392.0], // C
      [220.0, 261.63, 329.63], // Am
      [174.61, 220.0, 261.63], // F
      [196.0, 246.94, 293.66], // G
    ],
    melodyNotes: [
      329.63, 392.0, 440.0, 523.25, 440.0, 392.0, 329.63, 261.63,
      293.66, 329.63, 392.0, 440.0, 523.25, 659.25, 523.25, 440.0
    ],
    descriptionBn: 'পরিবার, ভ্রমণ ও পডকাস্টের জন্য স্নিগ্ধ মিষ্টি অ্যাকোস্টিক গান',
  },
  'spiritual-sufi': {
    id: 'spiritual-sufi',
    title: 'Spiritual Sufi Ney & Peaceful Ambient',
    titleBn: 'সুফি ও আধ্যাত্মিক স্নিগ্ধ আবহ',
    taglineBn: 'আত্মিক প্রশান্তি, সুফি সুর ও ধ্যানের পরিবেশ',
    icon: '🕌',
    defaultBpm: 75,
    scaleId: 'bangla_bhairav',
    leadWave: 'sine',
    bassWave: 'sine',
    padWave: 'triangle',
    chords: [
      [220.0, 261.63, 329.63], // Am
      [174.61, 220.0, 261.63], // F
      [196.0, 246.94, 293.66], // G
      [164.81, 220.0, 246.94], // Em
    ],
    melodyNotes: [
      261.63, 293.66, 329.63, 392.0, 440.0, 392.0, 329.63, 261.63,
      329.63, 392.0, 440.0, 523.25, 440.0, 392.0, 329.63, 220.0
    ],
    descriptionBn: 'নৈতিক বার্তা, গভীর আত্মদর্শন ও শান্ত ভাবগম্ভীর বাণী',
  },
  'cyberpunk-synth': {
    id: 'cyberpunk-synth',
    title: '80s Cyberpunk Neon Synthwave',
    titleBn: 'নিয়ন সাইবারপাঙ্ক ও সিন্থওয়েভ',
    taglineBn: 'অ্যানালগ ফ্যাট বেস ও রেট্রো ফিউচারিস্টিক ড্রাইভ',
    icon: '🚀',
    defaultBpm: 122,
    scaleId: 'a_minor',
    leadWave: 'sawtooth',
    bassWave: 'sawtooth',
    padWave: 'square',
    chords: [
      [220.0, 261.63, 329.63], // Am
      [174.61, 220.0, 261.63], // F
      [196.0, 246.94, 293.66], // G
      [164.81, 196.0, 246.94], // Em
    ],
    melodyNotes: [
      440.0, 523.25, 659.25, 523.25, 587.33, 440.0, 493.88, 392.0,
      440.0, 523.25, 659.25, 783.99, 659.25, 523.25, 440.0, 329.63
    ],
    descriptionBn: 'কোডিং, আধুনিক এআই ও সাই-ফাই ভিডিওর তীব্র আকর্ষণীয় ড্রাইভ',
  },
};

/**
 * Full 30-Second Song Composition Engine
 * Schedules and generates complete 30-second songs with multi-track polyphony:
 * Intro (0-4s) -> Verse (4-12s) -> Chorus/Drop (12-22s) -> Outro (22-30s)
 */
export class ThirtySecondSongEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private activeNodes: any[] = [];
  private timerInterval: any = null;
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];

  /**
   * Synthesizes and plays a complete 30-second song live into AudioContext
   */
  startLiveSong(
    audioCtx: AudioContext,
    destination: AudioNode,
    preset: SongStylePreset,
    options: {
      volume?: number;
      bpm?: number;
      onProgress?: (seconds: number, progressPercent: number, section: string) => void;
      onComplete?: () => void;
    } = {}
  ) {
    this.stop();
    this.ctx = audioCtx;
    this.isPlaying = true;

    const volume = options.volume ?? 0.6;
    const bpm = options.bpm || preset.defaultBpm;
    const masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(volume * 0.5, audioCtx.currentTime);
    masterGain.connect(destination);
    this.activeNodes.push(masterGain);

    const startTime = audioCtx.currentTime;
    const totalDuration = 30.0; // Exact 30 seconds

    // Schedule all 30 seconds of multi-track arrangement
    this.scheduleThirtySecondArrangement(audioCtx, masterGain, preset, startTime, bpm);

    // Live progress tracker (0 to 30s)
    let elapsed = 0;
    this.timerInterval = setInterval(() => {
      if (!this.isPlaying) return;
      elapsed += 0.25;

      let section = 'Intro (ভূমিকা)';
      if (elapsed >= 4 && elapsed < 12) section = 'Verse (মূল সুর)';
      else if (elapsed >= 12 && elapsed < 22) section = 'Chorus / Drop (উচ্ছ্বাস)';
      else if (elapsed >= 22) section = 'Outro (সমাপ্তি)';

      const progress = Math.min(100, Math.round((elapsed / totalDuration) * 100));
      options.onProgress?.(Math.min(30, Math.round(elapsed)), progress, section);

      if (elapsed >= totalDuration) {
        this.stop();
        options.onComplete?.();
      }
    }, 250);
  }

  /**
   * Renders the 30-second song into a downloadable audio Blob (WAV/WebM)
   */
  async renderAndExportSong(
    preset: SongStylePreset,
    bpm?: number
  ): Promise<{ blob: Blob; url: string; duration: number }> {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioCtx();
    const dest = ctx.createMediaStreamDestination();
    const targetBpm = bpm || preset.defaultBpm;

    // Schedule the 30s arrangement
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.7, ctx.currentTime);
    masterGain.connect(dest);
    this.scheduleThirtySecondArrangement(ctx, masterGain, preset, ctx.currentTime, targetBpm);

    return new Promise((resolve, reject) => {
      const mime = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/webm';
      const recorder = new MediaRecorder(dest.stream, { mimeType: mime });
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: mime });
        const url = URL.createObjectURL(blob);
        ctx.close().catch(() => {});
        resolve({ blob, url, duration: 30 });
      };

      recorder.onerror = (err) => {
        ctx.close().catch(() => {});
        reject(err);
      };

      recorder.start(100);

      // Stop recorder exactly at 30 seconds
      setTimeout(() => {
        if (recorder.state === 'recording') {
          recorder.stop();
        }
      }, 30200);
    });
  }

  stop() {
    this.isPlaying = false;
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.activeNodes.forEach((node) => {
      try {
        if (node && typeof node === 'object') {
          if (typeof node.stop === 'function') node.stop();
          if (typeof node.disconnect === 'function') node.disconnect();
        }
      } catch (e) {}
    });
    this.activeNodes = [];
  }

  /**
   * Schedules the exact 30-second musical composition:
   * 0 - 4s:  Intro (Ambient chord pads + gentle theme)
   * 4 - 12s: Verse (Chords + walking bassline + soft percussion)
   * 12-22s: Chorus / Peak Drop (Full drums + lead polyphony + rich bass)
   * 22-30s: Outro (Cadence resolution + relaxing fade out)
   */
  private scheduleThirtySecondArrangement(
    ctx: AudioContext,
    dest: GainNode,
    preset: SongStylePreset,
    start: number,
    bpm: number
  ) {
    const beatSec = 60 / bpm;

    // --- TRACK 1: CHORDS & PADS (0s to 30s) ---
    // Change chord every 3.75s (8 chords across 30 seconds)
    const chordCount = 8;
    for (let c = 0; c < chordCount; c++) {
      const chordStart = start + c * 3.75;
      const chordNotes = preset.chords[c % preset.chords.length];
      const isChorus = chordStart >= start + 12 && chordStart < start + 22;

      chordNotes.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = preset.padWave;
        osc.frequency.setValueAtTime(freq, chordStart);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(isChorus ? 1800 : 700, chordStart);
        filter.frequency.exponentialRampToValueAtTime(isChorus ? 900 : 350, chordStart + 3.5);

        // Amplitude envelope
        gain.gain.setValueAtTime(0, chordStart);
        gain.gain.linearRampToValueAtTime(isChorus ? 0.08 : 0.05, chordStart + 0.3);
        gain.gain.setValueAtTime(isChorus ? 0.08 : 0.05, chordStart + 3.2);
        gain.gain.exponentialRampToValueAtTime(0.001, chordStart + 3.7);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(dest);

        osc.start(chordStart);
        osc.stop(chordStart + 3.75);
        this.activeNodes.push(osc, gain);
      });
    }

    // --- TRACK 2: BASSLINE (4s to 28s) ---
    // Driving rhythmic bassline during Verse & Chorus
    const bassBeats = Math.floor((28 - 4) / (beatSec * 2));
    for (let b = 0; b < bassBeats; b++) {
      const bTime = start + 4 + b * (beatSec * 2);
      const chordIdx = Math.floor((bTime - start) / 3.75);
      const baseFreq = preset.chords[chordIdx % preset.chords.length][0] / 2; // Octave lower

      const bOsc = ctx.createOscillator();
      const bGain = ctx.createGain();
      bOsc.type = preset.bassWave;
      bOsc.frequency.setValueAtTime(baseFreq, bTime);

      bGain.gain.setValueAtTime(0, bTime);
      bGain.gain.linearRampToValueAtTime(0.12, bTime + 0.04);
      bGain.gain.exponentialRampToValueAtTime(0.005, bTime + beatSec * 1.8);

      bOsc.connect(bGain);
      bGain.connect(dest);
      bOsc.start(bTime);
      bOsc.stop(bTime + beatSec * 1.9);
      this.activeNodes.push(bOsc, bGain);
    }

    // --- TRACK 3: LEAD MELODY (2s to 28s) ---
    // Melodic sequence across the song
    const noteDuration = beatSec;
    const totalMelodyBeats = Math.floor(26 / noteDuration);

    for (let m = 0; m < totalMelodyBeats; m++) {
      const mTime = start + 2 + m * noteDuration;
      const noteFreq = preset.melodyNotes[m % preset.melodyNotes.length];
      const isChorus = mTime >= start + 12 && mTime < start + 22;

      const mOsc = ctx.createOscillator();
      const mGain = ctx.createGain();
      const mFilter = ctx.createBiquadFilter();

      mOsc.type = preset.leadWave;
      mOsc.frequency.setValueAtTime(noteFreq, mTime);

      // Vibrato during sustain
      if (noteDuration > 0.4) {
        const vibrato = ctx.createOscillator();
        const vibGain = ctx.createGain();
        vibrato.frequency.setValueAtTime(5.5, mTime);
        vibGain.gain.setValueAtTime(2.5, mTime);
        vibrato.connect(mOsc.frequency);
        vibrato.start(mTime + 0.15);
        vibrato.stop(mTime + noteDuration * 0.9);
        this.activeNodes.push(vibrato, vibGain);
      }

      mFilter.type = 'lowpass';
      mFilter.frequency.setValueAtTime(isChorus ? 2400 : 1200, mTime);

      mGain.gain.setValueAtTime(0, mTime);
      mGain.gain.linearRampToValueAtTime(isChorus ? 0.09 : 0.06, mTime + 0.04);
      mGain.gain.exponentialRampToValueAtTime(0.0001, mTime + noteDuration * 0.95);

      mOsc.connect(mFilter);
      mFilter.connect(mGain);
      mGain.connect(dest);

      mOsc.start(mTime);
      mOsc.stop(mTime + noteDuration);
      this.activeNodes.push(mOsc, mGain);
    }

    // --- TRACK 4: DRUMS & PERCUSSION (8s to 24s) ---
    // Kick, Snare and Hi-Hats during Chorus & Verse
    const drumStart = start + 6;
    const drumEnd = start + 24;
    const drumBeats = Math.floor((drumEnd - drumStart) / beatSec);

    for (let d = 0; d < drumBeats; d++) {
      const dTime = drumStart + d * beatSec;
      const isKick = d % 2 === 0;
      const isSnare = d % 2 === 1;

      // 1. Kick Drum
      if (isKick) {
        const kickOsc = ctx.createOscillator();
        const kickGain = ctx.createGain();
        kickOsc.frequency.setValueAtTime(140, dTime);
        kickOsc.frequency.exponentialRampToValueAtTime(45, dTime + 0.12);

        kickGain.gain.setValueAtTime(0.18, dTime);
        kickGain.gain.exponentialRampToValueAtTime(0.001, dTime + 0.18);

        kickOsc.connect(kickGain);
        kickGain.connect(dest);
        kickOsc.start(dTime);
        kickOsc.stop(dTime + 0.2);
        this.activeNodes.push(kickOsc, kickGain);
      }

      // 2. Snare / Clap
      if (isSnare) {
        const bufferSize = ctx.sampleRate * 0.12;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(1200, dTime);

        const snareGain = ctx.createGain();
        snareGain.gain.setValueAtTime(0.09, dTime);
        snareGain.gain.exponentialRampToValueAtTime(0.001, dTime + 0.14);

        whiteNoise.connect(filter);
        filter.connect(snareGain);
        snareGain.connect(dest);

        whiteNoise.start(dTime);
        this.activeNodes.push(whiteNoise, snareGain);
      }

      // 3. Hi-Hat 8th notes
      for (let h = 0; h < 2; h++) {
        const hTime = dTime + h * (beatSec / 2);
        const hatOsc = ctx.createOscillator();
        const hatGain = ctx.createGain();
        hatOsc.type = 'square';
        hatOsc.frequency.setValueAtTime(3500 + Math.random() * 500, hTime);

        hatGain.gain.setValueAtTime(0.018, hTime);
        hatGain.gain.exponentialRampToValueAtTime(0.0001, hTime + 0.04);

        hatOsc.connect(hatGain);
        hatGain.connect(dest);
        hatOsc.start(hTime);
        hatOsc.stop(hTime + 0.05);
        this.activeNodes.push(hatOsc, hatGain);
      }
    }

    // --- TRACK 5: OUTRO RESOLVE (26s to 30s) ---
    // Gentle final resolving chord with bell chime
    const outroTime = start + 26;
    const finalChord = preset.chords[0]; // Tonic home chord
    finalChord.forEach((f) => {
      const oOsc = ctx.createOscillator();
      const oGain = ctx.createGain();
      oOsc.type = 'sine';
      oOsc.frequency.setValueAtTime(f, outroTime);

      oGain.gain.setValueAtTime(0, outroTime);
      oGain.gain.linearRampToValueAtTime(0.07, outroTime + 0.2);
      oGain.gain.exponentialRampToValueAtTime(0.0001, outroTime + 3.8);

      oOsc.connect(oGain);
      oGain.connect(dest);
      oOsc.start(outroTime);
      oOsc.stop(outroTime + 4.0);
      this.activeNodes.push(oOsc, oGain);
    });
  }
}

// Export alias for convenient multi-component referencing
export const ThirtySecondAudioEngine = ThirtySecondSongEngine;
export type ThirtySecondAudioEngine = ThirtySecondSongEngine;
