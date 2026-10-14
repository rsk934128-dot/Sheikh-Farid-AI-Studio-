/**
 * WebAudioMixer.ts
 * 
 * Web Audio API mixing engine for ZeroCostVideoStudio.
 * Allows users to upload custom audio files (MP3, WAV, AAC, OGG) or select procedural
 * synthesized background music presets, balance volumes (Voice vs BGM), apply automatic
 * speech ducking, and pipe the mixed MediaStream track directly into CanvasRecorder / MediaRecorder.
 */

export interface BgmPreset {
  id: string;
  nameBn: string;
  nameEn: string;
  genre: string;
  bpm: number;
  descriptionBn: string;
}

export const BGM_PRESETS: BgmPreset[] = [
  {
    id: 'news-broadcast',
    nameBn: 'টিভি নিউজ ও ব্রডকাস্ট থিম',
    nameEn: 'News & Broadcast Theme',
    genre: 'News / Corporate',
    bpm: 120,
    descriptionBn: 'পেশাদার সংবাদ বুলেটিন ও তথ্যবহুল ভিডিওর জন্য ড্রাম ও সিন্থ বিট',
  },
  {
    id: 'cinematic-ambient',
    nameBn: 'সিনেমাটিক ড্রোন ও শান্ত প্যাড',
    nameEn: 'Cinematic Ambient Drone',
    genre: 'Cinematic',
    bpm: 75,
    descriptionBn: 'গভীর সিনেমাটিক অনুভূতি, ডকুমেন্টারি ও অনুপ্রেরণামূলক উপস্থাপনা',
  },
  {
    id: 'upbeat-lofi',
    nameBn: 'আপবিট লো-ফাই ও ডিজিটাল বিট',
    nameEn: 'Upbeat Lo-Fi Tech Beat',
    genre: 'Modern Tech',
    bpm: 110,
    descriptionBn: 'সোশ্যাল মিডিয়া রিল, টিকটক ও টেক টিউটোরিয়ালের জন্য চনমনে ব্যাকগ্রাউন্ড',
  },
  {
    id: 'peaceful-acoustic',
    nameBn: 'প্রাকৃতিক শান্ত একোস্টিক মেলোডি',
    nameEn: 'Peaceful Acoustic Harmony',
    genre: 'Nature / Calm',
    bpm: 90,
    descriptionBn: 'কোমল মেলোডি ও মেডিটেটিভ সুর, গল্প বলা ও ভ্রমণ ভিডিওর জন্য দারুণ',
  },
  {
    id: 'custom-upload',
    nameBn: 'নিজের অডিও ফাইল (Custom Upload)',
    nameEn: 'Custom Audio Upload',
    genre: 'Custom',
    bpm: 0,
    descriptionBn: 'আপনার মোবাইল বা কম্পিউটার থেকে যেকোনো MP3/WAV ফাইল যুক্ত করুন',
  },
];

export interface AudioMixerConfig {
  enableBgm: boolean;
  selectedPresetId: string;
  bgmVolume: number;         // 0.0 to 1.0 (default 0.25)
  voiceVolume: number;       // 0.0 to 1.5 (default 1.0)
  loopBgm: boolean;          // default true
  enableDucking: boolean;    // Duck BGM when voice is speaking
  duckingRatio: number;      // 0.1 to 0.7 (default 0.35 = drops BGM to 35% during voice)
  bgmFadeInSec: number;
  bgmFadeOutSec: number;
}

export const DEFAULT_MIXER_CONFIG: AudioMixerConfig = {
  enableBgm: true,
  selectedPresetId: 'news-broadcast',
  bgmVolume: 0.22,
  voiceVolume: 1.0,
  loopBgm: true,
  enableDucking: true,
  duckingRatio: 0.35,
  bgmFadeInSec: 0.4,
  bgmFadeOutSec: 0.8,
};

/**
 * Procedural Web Audio Synthesizer: Generates seamless 12-second looping audio buffers
 * for presets without needing any external file downloads or network access.
 */
export function generateProceduralBgmBuffer(
  ctx: AudioContext,
  presetId: string,
  durationSec = 12
): AudioBuffer {
  const sampleRate = ctx.sampleRate;
  const numFrames = Math.floor(sampleRate * durationSec);
  const buffer = ctx.createBuffer(2, numFrames, sampleRate);
  const left = buffer.getChannelData(0);
  const right = buffer.getChannelData(1);

  if (presetId === 'news-broadcast') {
    // 120 BPM news rhythmic synth & bass pulse
    const beatInterval = 60 / 120; // 0.5s per beat
    const chordFrequencies = [
      [130.81, 164.81, 196.00], // C3, E3, G3
      [146.83, 174.61, 220.00], // D3, F3, A3
      [110.00, 164.81, 220.00], // A2, E3, A3
      [130.81, 196.00, 261.63], // C3, G3, C4
    ];

    for (let i = 0; i < numFrames; i++) {
      const t = i / sampleRate;
      const beat = (t / beatInterval) % 4;
      const beatIndex = Math.floor(t / beatInterval);
      const chordIndex = Math.floor((t / (beatInterval * 4)) % chordFrequencies.length);
      const currentChord = chordFrequencies[chordIndex];

      // Bass pulse
      const bassFreq = currentChord[0] * 0.5;
      const beatPhase = (t % beatInterval) / beatInterval;
      const bassEnv = Math.exp(-beatPhase * 6);
      const bass = Math.sin(2 * Math.PI * bassFreq * t) * bassEnv * 0.4;

      // Chord pad shimmer
      let chord = 0;
      for (let c = 0; c < currentChord.length; c++) {
        const freq = currentChord[c];
        chord += Math.sin(2 * Math.PI * freq * t + Math.sin(t * 2) * 0.1) * 0.12;
        chord += Math.sin(2 * Math.PI * (freq * 1.005) * t) * 0.08;
      }

      // High news arpeggio chime on every 16th note
      const sixteenth = (t / (beatInterval / 4)) % 4;
      const chimePhase = (t % (beatInterval / 4)) / (beatInterval / 4);
      const chimeEnv = Math.exp(-chimePhase * 12);
      const arpFreq = currentChord[Math.floor(sixteenth) % 3] * 4;
      const chime = Math.sin(2 * Math.PI * arpFreq * t) * chimeEnv * 0.15;

      // Subtle kick/snare rhythm
      let drum = 0;
      if (beatIndex % 2 === 0 && beatPhase < 0.15) {
        // Kick
        const kickPitch = 120 * Math.exp(-beatPhase * 40) + 45;
        drum += Math.sin(2 * Math.PI * kickPitch * t) * Math.exp(-beatPhase * 15) * 0.4;
      } else if (beatIndex % 2 === 1 && beatPhase < 0.2) {
        // Soft snare / white noise burst
        drum += (Math.random() * 2 - 1) * Math.exp(-beatPhase * 20) * 0.18;
      }

      const sample = (bass + chord + chime + drum) * 0.45;
      left[i] = sample * (1 + 0.15 * Math.sin(t * 0.5));
      right[i] = sample * (1 - 0.15 * Math.sin(t * 0.5));
    }
  } else if (presetId === 'cinematic-ambient') {
    // Warm slow 75 BPM cinematic drone with floating fifths
    const rootFreq = 65.41; // C2
    for (let i = 0; i < numFrames; i++) {
      const t = i / sampleRate;
      // Sub drone
      const sub = Math.sin(2 * Math.PI * rootFreq * t) * 0.3;
      // Warm fifth
      const fifth = Math.sin(2 * Math.PI * (rootFreq * 1.498) * t) * 0.25;
      // Filter sweep pad
      const lfo = 0.5 + 0.5 * Math.sin(t * 0.35);
      const pad = (
        Math.sin(2 * Math.PI * (rootFreq * 2) * t) +
        Math.sin(2 * Math.PI * (rootFreq * 3.01) * t) * 0.5 +
        Math.sin(2 * Math.PI * (rootFreq * 4.98) * t) * 0.3
      ) * 0.18 * lfo;

      // Atmospheric shimmer
      const shimmer = Math.sin(2 * Math.PI * (rootFreq * 8) * t + Math.sin(t * 4)) * 0.05 * (1 - lfo);

      const total = (sub + fifth + pad + shimmer) * 0.5;
      left[i] = total * Math.cos(t * 0.2);
      right[i] = total * Math.sin(t * 0.2);
    }
  } else if (presetId === 'upbeat-lofi') {
    // 110 BPM modern tech beat with soft Rhodes-style chords
    const beatInterval = 60 / 110;
    const chords = [
      [174.61, 220.0, 261.63, 329.63], // Fmaj7
      [164.81, 196.0, 246.94, 293.66], // Em7
      [146.83, 174.61, 220.0, 261.63], // Dm7
      [196.0, 246.94, 293.66, 349.23], // G7
    ];

    for (let i = 0; i < numFrames; i++) {
      const t = i / sampleRate;
      const chordIdx = Math.floor((t / (beatInterval * 4)) % chords.length);
      const currentChord = chords[chordIdx];
      const beatPhase = (t % beatInterval) / beatInterval;
      const beatNum = Math.floor((t / beatInterval) % 4);

      // Rhodes EP chord decay
      let chordSample = 0;
      const chordPhase = (t % (beatInterval * 2)) / (beatInterval * 2);
      const chordEnv = Math.exp(-chordPhase * 3.5);
      for (let c = 0; c < currentChord.length; c++) {
        const f = currentChord[c];
        chordSample += Math.sin(2 * Math.PI * f * t) * chordEnv * 0.12;
      }

      // Lo-fi kick on beat 0 and 2.5
      let kick = 0;
      if (beatNum === 0 && beatPhase < 0.2) {
        kick = Math.sin(2 * Math.PI * (90 * Math.exp(-beatPhase * 25) + 40) * t) * Math.exp(-beatPhase * 12) * 0.4;
      }

      // Snare on beat 2
      let snare = 0;
      if (beatNum === 2 && beatPhase < 0.25) {
        snare = (Math.random() * 2 - 1) * Math.exp(-beatPhase * 18) * 0.25;
      }

      // Soft hi-hat on every 8th note
      const eighthPhase = (t % (beatInterval / 2)) / (beatInterval / 2);
      let hat = 0;
      if (eighthPhase < 0.08) {
        hat = (Math.random() * 2 - 1) * Math.exp(-eighthPhase * 50) * 0.08;
      }

      const total = (chordSample + kick + snare + hat) * 0.45;
      left[i] = total;
      right[i] = total;
    }
  } else {
    // Peaceful Acoustic Harmony (Gentle 90 BPM Pentatonic Kalimba / Harp style)
    const notes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25]; // C major pentatonic
    const noteInterval = 60 / 90 / 2; // 8th note interval

    for (let i = 0; i < numFrames; i++) {
      const t = i / sampleRate;
      const noteStep = Math.floor(t / noteInterval);
      const notePhase = (t % noteInterval) / noteInterval;
      const noteIdx = (noteStep * 3) % notes.length;
      const noteFreq = notes[noteIdx];

      // Plucked bell tone
      const env = Math.exp(-notePhase * 8);
      const pluck = (
        Math.sin(2 * Math.PI * noteFreq * t) +
        Math.sin(2 * Math.PI * (noteFreq * 2) * t) * 0.35 +
        Math.sin(2 * Math.PI * (noteFreq * 3) * t) * 0.15
      ) * env * 0.22;

      // Soft bass accompaniment
      const bassFreq = notes[Math.floor(noteStep / 4) % 3] * 0.5;
      const bass = Math.sin(2 * Math.PI * bassFreq * t) * 0.15;

      const total = (pluck + bass) * 0.5;
      const pan = Math.sin(noteStep * 1.5) * 0.3;
      left[i] = total * (1 - pan);
      right[i] = total * (1 + pan);
    }
  }

  // Crossfade boundary (first 0.05s and last 0.05s) to guarantee zero click/pop on loop
  const crossfadeFrames = Math.floor(sampleRate * 0.05);
  for (let j = 0; j < crossfadeFrames; j++) {
    const fadeOut = j / crossfadeFrames;
    const fadeIn = 1 - fadeOut;
    const endIdx = numFrames - crossfadeFrames + j;
    
    // Blend end of loop with start of loop
    left[endIdx] = left[endIdx] * fadeIn + left[j] * fadeOut;
    right[endIdx] = right[endIdx] * fadeIn + right[j] * fadeOut;
  }

  return buffer;
}

/**
 * Decode an uploaded audio file (Blob / ArrayBuffer) into an AudioBuffer
 */
export async function decodeAudioFile(
  ctx: AudioContext,
  file: File | Blob
): Promise<AudioBuffer> {
  const arrayBuffer = await file.arrayBuffer();
  return await ctx.decodeAudioData(arrayBuffer);
}

/**
 * WebAudioLiveMixer
 * Real-time audio mixing coordinator connecting Voice, Background Music, Ducking,
 * Analyser meters, and CanvasRecorder output stream.
 */
export class WebAudioLiveMixer {
  private ctx: AudioContext | null = null;
  private isExternalCtx: boolean = false;
  private bgmGainNode: GainNode | null = null;
  private voiceGainNode: GainNode | null = null;
  private masterGainNode: GainNode | null = null;
  private bgmSourceNode: AudioBufferSourceNode | null = null;
  private bgmAnalyserNode: AnalyserNode | null = null;
  private voiceAnalyserNode: AnalyserNode | null = null;
  private masterDestination: MediaStreamAudioDestinationNode | null = null;
  private isMixing: boolean = false;
  private isDucked: boolean = false;
  private config: AudioMixerConfig = DEFAULT_MIXER_CONFIG;
  private bgmBuffer: AudioBuffer | null = null;

  constructor(config: AudioMixerConfig = DEFAULT_MIXER_CONFIG) {
    this.config = { ...config };
  }

  public setConfig(newConfig: Partial<AudioMixerConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.updateGains();
  }

  public getConfig(): AudioMixerConfig {
    return { ...this.config };
  }

  public setBgmBuffer(buffer: AudioBuffer | null): void {
    this.bgmBuffer = buffer;
  }

  public getBgmBuffer(): AudioBuffer | null {
    return this.bgmBuffer;
  }

  /**
   * Initialize or attach to an AudioContext
   */
  public attach(
    ctx: AudioContext,
    outputDestination?: MediaStreamAudioDestinationNode
  ): MediaStreamAudioDestinationNode {
    this.ctx = ctx;
    this.isExternalCtx = true;

    // Master destination (piped into CanvasRecorder stream)
    this.masterDestination = outputDestination || ctx.createMediaStreamDestination();

    // Voice channel
    this.voiceGainNode = ctx.createGain();
    this.voiceGainNode.gain.setValueAtTime(this.config.voiceVolume, ctx.currentTime);
    this.voiceAnalyserNode = ctx.createAnalyser();
    this.voiceAnalyserNode.fftSize = 64;
    this.voiceGainNode.connect(this.voiceAnalyserNode);

    // BGM channel
    this.bgmGainNode = ctx.createGain();
    this.bgmGainNode.gain.setValueAtTime(
      this.config.enableBgm ? this.config.bgmVolume : 0,
      ctx.currentTime
    );
    this.bgmAnalyserNode = ctx.createAnalyser();
    this.bgmAnalyserNode.fftSize = 64;
    this.bgmGainNode.connect(this.bgmAnalyserNode);

    // Master gain
    this.masterGainNode = ctx.createGain();
    this.masterGainNode.gain.setValueAtTime(1.0, ctx.currentTime);

    // Routing
    this.voiceAnalyserNode.connect(this.masterGainNode);
    this.bgmAnalyserNode.connect(this.masterGainNode);

    // Connect to recorder destination AND speakers
    this.masterGainNode.connect(this.masterDestination);
    this.masterGainNode.connect(ctx.destination);

    return this.masterDestination;
  }

  /**
   * Start BGM playback in the mix
   */
  public startBgm(startTimeOffsetSec = 0): void {
    if (!this.ctx || !this.bgmGainNode || !this.config.enableBgm) return;

    // Stop existing BGM source if active
    this.stopBgm();

    // Ensure we have a valid buffer
    let buffer = this.bgmBuffer;
    if (!buffer && this.config.selectedPresetId !== 'custom-upload') {
      buffer = generateProceduralBgmBuffer(this.ctx, this.config.selectedPresetId);
      this.bgmBuffer = buffer;
    }

    if (!buffer) return;

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = this.config.loopBgm;
    source.connect(this.bgmGainNode);

    // Smooth fade in
    const now = this.ctx.currentTime;
    const targetGain = this.isDucked
      ? this.config.bgmVolume * this.config.duckingRatio
      : this.config.bgmVolume;

    this.bgmGainNode.gain.cancelScheduledValues(now);
    this.bgmGainNode.gain.setValueAtTime(0.0001, now);
    this.bgmGainNode.gain.linearRampToValueAtTime(targetGain, now + this.config.bgmFadeInSec);

    source.start(now + startTimeOffsetSec);
    this.bgmSourceNode = source;
    this.isMixing = true;
  }

  /**
   * Stop BGM playback
   */
  public stopBgm(fadeOut = true): void {
    if (!this.bgmSourceNode || !this.ctx || !this.bgmGainNode) return;

    if (fadeOut && this.ctx.state === 'running') {
      const now = this.ctx.currentTime;
      this.bgmGainNode.gain.cancelScheduledValues(now);
      this.bgmGainNode.gain.setValueAtTime(this.bgmGainNode.gain.value, now);
      this.bgmGainNode.gain.linearRampToValueAtTime(0.0001, now + this.config.bgmFadeOutSec);
      const prevSource = this.bgmSourceNode;
      setTimeout(() => {
        try {
          prevSource.stop();
          prevSource.disconnect();
        } catch {}
      }, this.config.bgmFadeOutSec * 1000 + 50);
    } else {
      try {
        this.bgmSourceNode.stop();
        this.bgmSourceNode.disconnect();
      } catch {}
    }

    this.bgmSourceNode = null;
    this.isMixing = false;
  }

  /**
   * Trigger ducking when speech / voice starts
   */
  public triggerSpeechStart(): void {
    if (!this.config.enableDucking || !this.bgmGainNode || !this.ctx) return;
    this.isDucked = true;
    const now = this.ctx.currentTime;
    const duckedGain = this.config.bgmVolume * this.config.duckingRatio;
    this.bgmGainNode.gain.cancelScheduledValues(now);
    this.bgmGainNode.gain.setValueAtTime(this.bgmGainNode.gain.value, now);
    this.bgmGainNode.gain.linearRampToValueAtTime(duckedGain, now + 0.2);
  }

  /**
   * Restore normal BGM volume when speech / voice ends
   */
  public triggerSpeechEnd(): void {
    if (!this.config.enableDucking || !this.bgmGainNode || !this.ctx) return;
    this.isDucked = false;
    const now = this.ctx.currentTime;
    this.bgmGainNode.gain.cancelScheduledValues(now);
    this.bgmGainNode.gain.setValueAtTime(this.bgmGainNode.gain.value, now);
    this.bgmGainNode.gain.linearRampToValueAtTime(this.config.bgmVolume, now + 0.6);
  }

  /**
   * Update gain nodes in real-time
   */
  public updateGains(): void {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    if (this.voiceGainNode) {
      this.voiceGainNode.gain.cancelScheduledValues(now);
      this.voiceGainNode.gain.linearRampToValueAtTime(this.config.voiceVolume, now + 0.05);
    }

    if (this.bgmGainNode) {
      const targetGain = !this.config.enableBgm
        ? 0
        : this.isDucked
        ? this.config.bgmVolume * this.config.duckingRatio
        : this.config.bgmVolume;

      this.bgmGainNode.gain.cancelScheduledValues(now);
      this.bgmGainNode.gain.linearRampToValueAtTime(targetGain, now + 0.05);
    }
  }

  /**
   * Get Voice Gain Node for routing speech/narration input
   */
  public getVoiceInputNode(): GainNode | null {
    return this.voiceGainNode;
  }

  /**
   * Read instantaneous audio levels for UI meters (0 to 100)
   */
  public getLevels(): { voiceLevel: number; bgmLevel: number } {
    let voiceLevel = 0;
    let bgmLevel = 0;

    if (this.voiceAnalyserNode) {
      const data = new Uint8Array(this.voiceAnalyserNode.frequencyBinCount);
      this.voiceAnalyserNode.getByteFrequencyData(data);
      let sum = 0;
      for (let i = 0; i < data.length; i++) sum += data[i];
      voiceLevel = Math.min(100, Math.round((sum / data.length / 255) * 100 * 2.2));
    }

    if (this.bgmAnalyserNode) {
      const data = new Uint8Array(this.bgmAnalyserNode.frequencyBinCount);
      this.bgmAnalyserNode.getByteFrequencyData(data);
      let sum = 0;
      for (let i = 0; i < data.length; i++) sum += data[i];
      bgmLevel = Math.min(100, Math.round((sum / data.length / 255) * 100 * 2.0));
    }

    return { voiceLevel, bgmLevel };
  }

  /**
   * Cleanup all nodes
   */
  public destroy(): void {
    this.stopBgm(false);
    if (!this.isExternalCtx && this.ctx) {
      this.ctx.close().catch(() => {});
    }
    this.ctx = null;
    this.bgmGainNode = null;
    this.voiceGainNode = null;
    this.masterGainNode = null;
    this.masterDestination = null;
    this.isMixing = false;
  }
}
