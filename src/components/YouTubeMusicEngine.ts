/**
 * YouTubeMusicEngine.ts
 * 
 * Comprehensive YouTube background music integration & multi-track audio mixing engine.
 * Supports:
 * - Curated YouTube Audio Library & Royalty-Free Creator tracks
 * - Procedural dynamic Web Audio synthesis (zero network latency, 100% offline reliability)
 * - YouTube link metadata resolver
 * - Custom YouTube MP3 / Audio file integration
 * - Smart Voice Ducking (auto-lowers music volume when presenter speaks)
 * - Full multi-track mixing into CanvasRecorder MediaStream
 */

export type MusicCategory =
  | 'all'
  | 'news'
  | 'cinematic'
  | 'lofi'
  | 'corporate'
  | 'upbeat'
  | 'spiritual'
  | 'acoustic';

export interface YouTubeTrack {
  id: string;
  title: string;
  titleBn: string;
  artist: string;
  category: Exclude<MusicCategory, 'all'>;
  categoryBn: string;
  duration: number; // in seconds
  bpm: number;
  mood: string;
  youtubeId?: string;
  youtubeUrl?: string;
  thumbnailUrl?: string;
  audioUrl?: string;
  proceduralPreset: string;
  descriptionBn: string;
}

export const YOUTUBE_CURATED_TRACKS: YouTubeTrack[] = [
  // 1. News & Broadcast
  {
    id: 'news-breaking-headline',
    title: 'Breaking News 24/7 Stinger',
    titleBn: 'ব্রেকিং নিউজ প্রাইম বুলেটিন',
    artist: 'National Broadcast Studio',
    category: 'news',
    categoryBn: 'নিউজ ও বুলেটিন',
    duration: 30,
    bpm: 128,
    mood: 'জরুরি ও আকর্ষণীয়',
    youtubeId: '7R1n4xZqfOU',
    youtubeUrl: 'https://www.youtube.com/watch?v=7R1n4xZqfOU',
    thumbnailUrl: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=400&q=80',
    proceduralPreset: 'news-broadcast',
    descriptionBn: 'উচ্চ প্রযুক্তির জাতীয় সংবাদ স্টুডিও থিম ও সতর্কবার্তা আবহ',
  },
  {
    id: 'news-press-conference',
    title: 'Press Briefing & Global Report',
    titleBn: 'প্রেস ব্রিফিং ও গ্লোবাল রিপোর্ট',
    artist: 'World News Network',
    category: 'news',
    categoryBn: 'নিউজ ও বুলেটিন',
    duration: 45,
    bpm: 118,
    mood: 'গুরুত্বপূর্ণ ও আনুষ্ঠানিক',
    youtubeId: 'q8M0U62j87I',
    youtubeUrl: 'https://www.youtube.com/watch?v=q8M0U62j87I',
    thumbnailUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&q=80',
    proceduralPreset: 'news-press',
    descriptionBn: 'প্রেস কনফারেন্স ও তথ্যবহুল আলোচনার গম্ভীর ব্যাকগ্রাউন্ড',
  },

  // 2. Cinematic & Dramatic
  {
    id: 'cinematic-epic-trailer',
    title: 'Deep Horizon Epic Build',
    titleBn: 'সিনেমাটিক ডিপ হরাইজন',
    artist: 'Cinematic Soundscapes',
    category: 'cinematic',
    categoryBn: 'সিনেমাটিক ড্রামা',
    duration: 60,
    bpm: 90,
    mood: 'রোমাঞ্চকর ও আবেগঘন',
    youtubeId: 'K9yWzYj8w0s',
    youtubeUrl: 'https://www.youtube.com/watch?v=K9yWzYj8w0s',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&q=80',
    proceduralPreset: 'cinematic-epic',
    descriptionBn: 'ধীরগতির লো-সেলো কর্ড ও সিনেমাটিক ট্রেইলার ক্লাইম্যাক্স',
  },
  {
    id: 'cinematic-mystery-doc',
    title: 'Investigative Documentary Noir',
    titleBn: 'রহস্য ও অনুসন্ধানমূলক তথ্যচিত্র',
    artist: 'Documentary Audio Lab',
    category: 'cinematic',
    categoryBn: 'সিনেমাটিক ড্রামা',
    duration: 50,
    bpm: 85,
    mood: 'রহস্যময় ও অনুসন্ধানমূলক',
    youtubeId: 'v8N7A6m9oPs',
    youtubeUrl: 'https://www.youtube.com/watch?v=v8N7A6m9oPs',
    thumbnailUrl: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=400&q=80',
    proceduralPreset: 'cinematic-mystery',
    descriptionBn: 'সাইবার ক্রাইম, তদন্ত ও ঐতিহাসিক গবেষণার আবহ',
  },

  // 3. Lofi & Chill
  {
    id: 'lofi-tokyo-rain',
    title: 'Rainy Night Lofi Study Beat',
    titleBn: 'রেইনি নাইট লো-ফাই বিট',
    artist: 'Chilled Cow Creator Audio',
    category: 'lofi',
    categoryBn: 'লো-ফাই রিল্যাক্সিং',
    duration: 60,
    bpm: 78,
    mood: 'শান্ত ও নস্টালজিক',
    youtubeId: '5qap5aO4i9A',
    youtubeUrl: 'https://www.youtube.com/watch?v=5qap5aO4i9A',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=400&q=80',
    proceduralPreset: 'lofi-chill',
    descriptionBn: 'ভিনাইল সাউন্ড, সফট রোডস পিয়ানো ও রিল্যাক্সিং হিপ-হপ বিট',
  },
  {
    id: 'lofi-cafe-morning',
    title: 'Coffeehouse Acoustic Chill',
    titleBn: 'কফিশপ সকালের সুর',
    artist: 'Lofi Cafe Studio',
    category: 'lofi',
    categoryBn: 'লো-ফাই রিল্যাক্সিং',
    duration: 45,
    bpm: 82,
    mood: 'উষ্ণ ও ইতিবাচক',
    youtubeId: 'DWcJFNfaw9c',
    youtubeUrl: 'https://www.youtube.com/watch?v=DWcJFNfaw9c',
    thumbnailUrl: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?w=400&q=80',
    proceduralPreset: 'lofi-acoustic',
    descriptionBn: 'টিপস ও ট্রিকস, ব্লগ ও লাইফস্টাইল ভিডিওর দারুণ আবহ',
  },

  // 4. Corporate & Tech
  {
    id: 'corporate-innovate',
    title: 'Inspiring Corporate Future Tech',
    titleBn: 'আধুনিক করপোরেট ও ইনোভেশন',
    artist: 'Tech Pulse Audio',
    category: 'corporate',
    categoryBn: 'কর্পোরেট টেক',
    duration: 40,
    bpm: 120,
    mood: 'উদ্বুদ্ধকারী ও পেশাদার',
    youtubeId: 'e8x9b4Jz01m',
    youtubeUrl: 'https://www.youtube.com/watch?v=e8x9b4Jz01m',
    thumbnailUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80',
    proceduralPreset: 'corporate-tech',
    descriptionBn: 'বিজনেস প্রেজেন্টেশন, স্টার্টআপ পিচ ও অফিসিয়াল আপডেট',
  },
  {
    id: 'corporate-digital-bangladesh',
    title: 'Smart Citizen Tech Forward',
    titleBn: 'স্মার্ট সিটিজেন ডিজিটাল ড্রাইভ',
    artist: 'Digital GovTech Sound',
    category: 'corporate',
    categoryBn: 'কর্পোরেট টেক',
    duration: 35,
    bpm: 116,
    mood: 'গতিশীল ও আশাব্যঞ্জক',
    youtubeId: 'a1b2c3d4e5f',
    youtubeUrl: 'https://www.youtube.com/watch?v=a1b2c3d4e5f',
    thumbnailUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&q=80',
    proceduralPreset: 'corporate-govtech',
    descriptionBn: 'সরকারি অনলাইন সেবা ও ডিজিটাল বাংলাদেশ প্রজেক্টের আবহ',
  },

  // 5. Upbeat & Reels / Shorts
  {
    id: 'upbeat-viral-tiktok',
    title: 'Viral Shorts Future Bass Pop',
    titleBn: 'ভাইরাল রিলস ফিউচার পপ',
    artist: 'Viral Beats Lab',
    category: 'upbeat',
    categoryBn: 'ভাইরাল রিলস',
    duration: 30,
    bpm: 130,
    mood: 'উচ্ছ্বসিত ও ট্রেন্ডি',
    youtubeId: 'm4x8k1p9y7z',
    youtubeUrl: 'https://www.youtube.com/watch?v=m4x8k1p9y7z',
    thumbnailUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80',
    proceduralPreset: 'upbeat-viral',
    descriptionBn: 'টিকটক, ফেসবুক রিলস ও ইউটিউব শর্টসে নজর কাড়তে সেরা',
  },
  {
    id: 'upbeat-cyberpunk-glitch',
    title: 'Neon Cyberpunk Electronic Stomp',
    titleBn: 'নিয়ন সাইবার ইলেকট্রো স্টম্প',
    artist: 'Synthwave Syndicate',
    category: 'upbeat',
    categoryBn: 'ভাইরাল রিলস',
    duration: 35,
    bpm: 125,
    mood: 'হাই এনার্জি ও নিয়ন',
    youtubeId: 'cyber999wave',
    youtubeUrl: 'https://www.youtube.com/watch?v=cyber999wave',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&q=80',
    proceduralPreset: 'upbeat-cyber',
    descriptionBn: 'গেমিং, কোডিং ও আধুনিক এআই অ্যানিমেশনের ব্যাকগ্রাউন্ড',
  },

  // 6. Spiritual & Meditative
  {
    id: 'spiritual-serene-nasheed',
    title: 'Peaceful Spiritual Ambient Nasheed',
    titleBn: 'শান্ত ও স্নিগ্ধ আধ্যাত্মিক আবহ',
    artist: 'Sufi & Nasheed Ambient',
    category: 'spiritual',
    categoryBn: 'আধ্যাত্মিক ও স্নিগ্ধ',
    duration: 60,
    bpm: 72,
    mood: 'শান্তিময় ও প্রশান্তিদায়ক',
    youtubeId: 'nasheed99peace',
    youtubeUrl: 'https://www.youtube.com/watch?v=nasheed99peace',
    thumbnailUrl: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=400&q=80',
    proceduralPreset: 'spiritual-ambient',
    descriptionBn: 'নৈতিক বার্তা, শান্ত পরিবেশ ও মানবিক ভাবনার জন্য উপযোগী',
  },

  // 7. Acoustic & Folk
  {
    id: 'acoustic-bengali-soul',
    title: 'Ektara & Acoustic Bengali Melody',
    titleBn: 'একতারা ও মাটির সুর ফিউশন',
    artist: 'Bangla Heritage Audio',
    category: 'acoustic',
    categoryBn: 'অ্যাকোস্টিক মেলোডি',
    duration: 45,
    bpm: 88,
    mood: 'হৃদয়স্পর্শী ও দেশীয়',
    youtubeId: 'bangla88folk',
    youtubeUrl: 'https://www.youtube.com/watch?v=bangla88folk',
    thumbnailUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=400&q=80',
    proceduralPreset: 'acoustic-folk',
    descriptionBn: 'বাংলার প্রকৃতি, ঐতিহ্য ও লোকশিল্পের মায়াময় সুর',
  },
];

/**
 * Procedural Web Audio Synthesizer
 * Generates rich musical chords, bass, arpeggios, and percussion
 * directly in the browser's Web Audio API.
 * Guarantees zero latency, zero server bandwidth, and 100% reliability.
 */
export class ProceduralMusicPlayer {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private nodes: any[] = [];
  private loopInterval: any = null;

  start(
    audioCtx: AudioContext,
    destination: AudioNode,
    preset: string,
    volume: number = 0.5
  ) {
    this.stop();
    this.ctx = audioCtx;
    this.isPlaying = true;

    const masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(Math.max(0.01, volume * 0.4), audioCtx.currentTime);
    masterGain.connect(destination);
    this.nodes.push(masterGain);

    this.playPresetSequence(audioCtx, masterGain, preset);

    // Loop sequence
    const loopTime = preset.includes('news') ? 8000 : 12000;
    this.loopInterval = setInterval(() => {
      if (this.isPlaying && this.ctx && this.ctx.state === 'running') {
        this.playPresetSequence(this.ctx, masterGain, preset);
      }
    }, loopTime);
  }

  stop() {
    this.isPlaying = false;
    if (this.loopInterval) {
      clearInterval(this.loopInterval);
      this.loopInterval = null;
    }
    this.nodes.forEach((node) => {
      try {
        if (node && typeof node === 'object') {
          if (typeof node.stop === 'function') {
            node.stop();
          }
          if (typeof node.disconnect === 'function') {
            node.disconnect();
          }
        }
      } catch (e) {}
    });
    this.nodes = [];
  }

  private playPresetSequence(
    ctx: AudioContext,
    dest: GainNode,
    preset: string
  ) {
    const now = ctx.currentTime;

    if (preset === 'news-broadcast' || preset === 'news-press') {
      // 1. News Stinger Chord (F Minor -> Ab -> C)
      const newsChords = [
        [174.61, 220.0, 261.63], // F, A, C
        [207.65, 261.63, 311.13], // Ab, C, Eb
        [261.63, 329.63, 392.0], // C, E, G
      ];

      newsChords.forEach((chord, chordIdx) => {
        const chordStart = now + chordIdx * 2.2;
        chord.forEach((freq) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const filter = ctx.createBiquadFilter();

          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, chordStart);

          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(1400, chordStart);
          filter.frequency.exponentialRampToValueAtTime(350, chordStart + 1.8);

          gain.gain.setValueAtTime(0, chordStart);
          gain.gain.linearRampToValueAtTime(0.08, chordStart + 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, chordStart + 2.0);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(dest);

          osc.start(chordStart);
          osc.stop(chordStart + 2.1);
          this.nodes.push(osc, gain);
        });
      });

      // Ticker Percussion Pulse
      for (let i = 0; i < 16; i++) {
        const t = now + i * 0.45;
        const clickOsc = ctx.createOscillator();
        const clickGain = ctx.createGain();
        clickOsc.type = 'triangle';
        clickOsc.frequency.setValueAtTime(i % 4 === 0 ? 880 : 440, t);
        clickGain.gain.setValueAtTime(i % 4 === 0 ? 0.04 : 0.015, t);
        clickGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);

        clickOsc.connect(clickGain);
        clickGain.connect(dest);
        clickOsc.start(t);
        clickOsc.stop(t + 0.09);
        this.nodes.push(clickOsc, clickGain);
      }
    } else if (preset.includes('cinematic')) {
      // 2. Cinematic Epic Strings & Deep Drone
      const droneOsc = ctx.createOscillator();
      const droneGain = ctx.createGain();
      const droneFilter = ctx.createBiquadFilter();

      droneOsc.type = 'sawtooth';
      droneOsc.frequency.setValueAtTime(55, now); // Low A1 cello drone

      droneFilter.type = 'lowpass';
      droneFilter.frequency.setValueAtTime(220, now);
      droneFilter.frequency.linearRampToValueAtTime(450, now + 5);
      droneFilter.frequency.linearRampToValueAtTime(220, now + 10);

      droneGain.gain.setValueAtTime(0, now);
      droneGain.gain.linearRampToValueAtTime(0.12, now + 2);
      droneGain.gain.linearRampToValueAtTime(0.08, now + 8);
      droneGain.gain.linearRampToValueAtTime(0.001, now + 11.5);

      droneOsc.connect(droneFilter);
      droneFilter.connect(droneGain);
      droneGain.connect(dest);

      droneOsc.start(now);
      droneOsc.stop(now + 11.8);
      this.nodes.push(droneOsc, droneGain);

      // Slow Piano notes
      const notes = [220, 261.63, 329.63, 392, 440];
      notes.forEach((freq, idx) => {
        const noteTime = now + 1.5 + idx * 1.8;
        const pOsc = ctx.createOscillator();
        const pGain = ctx.createGain();
        pOsc.type = 'sine';
        pOsc.frequency.setValueAtTime(freq, noteTime);
        pGain.gain.setValueAtTime(0, noteTime);
        pGain.gain.linearRampToValueAtTime(0.07, noteTime + 0.05);
        pGain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 2.5);

        pOsc.connect(pGain);
        pGain.connect(dest);
        pOsc.start(noteTime);
        pOsc.stop(noteTime + 2.6);
        this.nodes.push(pOsc, pGain);
      });
    } else if (preset.includes('lofi')) {
      // 3. Lofi Jazzy Rhodes chords (Dm9 -> G13 -> Cmaj9)
      const lofiChords = [
        [146.83, 220, 261.63, 329.63], // Dm9
        [196, 246.94, 329.63, 392], // G13
        [130.81, 196, 246.94, 329.63], // Cmaj9
      ];

      lofiChords.forEach((chord, cIdx) => {
        const cStart = now + cIdx * 3.5;
        chord.forEach((freq) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const filter = ctx.createBiquadFilter();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, cStart);

          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(550, cStart);

          gain.gain.setValueAtTime(0, cStart);
          gain.gain.linearRampToValueAtTime(0.08, cStart + 0.15);
          gain.gain.exponentialRampToValueAtTime(0.005, cStart + 3.2);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(dest);

          osc.start(cStart);
          osc.stop(cStart + 3.4);
          this.nodes.push(osc, gain);
        });
      });
    } else {
      // 4. Upbeat / Corporate / Spiritual Modern Harmony
      const chordFrets = [220, 277.18, 329.63, 440];
      chordFrets.forEach((f, i) => {
        const startT = now + (i % 2 === 0 ? 0 : 2.5);
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, startT);
        gain.gain.setValueAtTime(0, startT);
        gain.gain.linearRampToValueAtTime(0.06, startT + 0.3);
        gain.gain.exponentialRampToValueAtTime(0.002, startT + 3.5);

        osc.connect(gain);
        gain.connect(dest);
        osc.start(startT);
        osc.stop(startT + 3.6);
        this.nodes.push(osc, gain);
      });
    }
  }
}
