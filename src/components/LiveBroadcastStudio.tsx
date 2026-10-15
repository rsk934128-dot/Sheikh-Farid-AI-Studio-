import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Monitor,
  Share2,
  Copy,
  Check,
  Radio,
  Sparkles,
  MessageSquare,
  Send,
  Volume2,
  Play,
  Square,
  Download,
  Settings,
  Flame,
  Heart,
  Smile,
  Lightbulb,
  Maximize2,
  Minimize2,
  Layers,
  RefreshCw,
  Sliders,
  Tv,
  Users,
} from 'lucide-react';
import { LiveStreamOverlay, LiveChatMessage } from '../types';
import {
  ThirtySecondSongEngine,
  SONG_STYLE_PRESETS,
  SongGenre,
} from './ThirtySecondAudioEngine';

interface LiveBroadcastStudioProps {
  onOpenAudioEngine?: () => void;
}

const DEFAULT_OVERLAY: LiveStreamOverlay = {
  showLiveBadge: true,
  showLogo: true,
  logoText: 'SHEIKH FARID LIVE',
  showTicker: true,
  tickerText: 'ব্রেকিং নিউজ: শেখ ফরিদ লাইভ ব্রডকাস্ট স্টুডিওতে রিয়েল-টাইম আলোচনা শুরু হয়েছে • WebRTC ও ৬০ এফপিএস ক্যানভাস স্ট্রিমিং সক্রিয়',
  tickerSpeed: 3,
  showLowerThird: true,
  lowerThirdTitle: 'শেখ ফরিদ',
  lowerThirdSubtitle: 'প্রধান সিস্টেম আর্কিটেক্ট ও প্ল্যাটফর্ম বিল্ডার',
  lowerThirdTheme: 'broadcast-red',
  activeCommentOnScreen: null,
  layout: 'split-screen',
};

const SAMPLE_CHAT_MESSAGES: LiveChatMessage[] = [
  {
    id: 'm1',
    user: 'রাকিব হাসান (দর্শক)',
    message: 'অসাধারণ স্টুডিও কোয়ালিটি! লেটেন্সি একদম নেই বললেই চলে।',
    timestamp: '১০:০৫',
  },
  {
    id: 'm2',
    user: 'ড. জামিল আহমেদ (অতিথি)',
    message: 'WebRTC P2P আর্কিটেকচার দিয়ে এত স্মুথ ব্রডকাস্ট সত্যিই যুগান্তকারী!',
    timestamp: '১০:০৭',
  },
  {
    id: 'm3',
    user: 'নুসরাত জাহান (ক্রিয়েটর)',
    message: 'ব্যাকগ্রাউন্ডে বাউল সুরের হালকা মিউজিকটা দারুণ মানিয়েছে।',
    timestamp: '১০:০৯',
  },
];

export const LiveBroadcastStudio: React.FC<LiveBroadcastStudioProps> = ({ onOpenAudioEngine }) => {
  // Room & Role State
  const [roomId, setRoomId] = useState<string>('SF-STUDIO-LIVE');
  const [role, setRole] = useState<'host' | 'guest'>('host');
  const [userName, setUserName] = useState<string>('শেখ ফরিদ');
  const [copiedLink, setCopiedLink] = useState(false);

  // Media Devices & Streams
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const screenVideoRef = useRef<HTMLVideoElement | null>(null);

  const localStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);

  // WebRTC PeerConnection & WebSocket
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const [connectedPeers, setConnectedPeers] = useState<Array<{ id: string; role: string; name: string }>>([]);
  const [wsConnected, setWsConnected] = useState(false);
  const [clientId] = useState(() => 'peer_' + Math.random().toString(36).substring(2, 9));

  // Canvas Broadcast Master Output
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const tickerOffsetRef = useRef<number>(0);
  const logoImgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new Image();
    img.src = '/src/assets/images/sheikh_farid_logo_1792083190919.jpg';
    img.onload = () => {
      logoImgRef.current = img;
    };
  }, []);

  // Overlay & Graphics Config
  const [overlay, setOverlay] = useState<LiveStreamOverlay>(DEFAULT_OVERLAY);
  const [activeTabPanel, setActiveTabPanel] = useState<'controls' | 'overlays' | 'chat' | 'rtmp' | 'ai-copilot'>('controls');

  // Master Recording
  const [isRecording, setIsRecording] = useState(false);
  const [recordDuration, setRecordDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const recordTimerRef = useRef<any>(null);

  // Live Chat
  const [chatMessages, setChatMessages] = useState<LiveChatMessage[]>(SAMPLE_CHAT_MESSAGES);
  const [chatInput, setChatInput] = useState('');

  // Floating Reactions
  const [reactions, setReactions] = useState<Array<{ id: string; emoji: string; x: number; y: number }>>([]);

  // Background Audio from 30s Audio Engine
  const [bgMusicPreset, setBgMusicPreset] = useState<SongGenre>('bangla-folk');
  const [isBgMusicPlaying, setIsBgMusicPlaying] = useState(false);
  const [bgMusicVolume, setBgMusicVolume] = useState(0.25);
  const bgAudioEngineRef = useRef<ThirtySecondSongEngine | null>(null);
  const bgAudioCtxRef = useRef<AudioContext | null>(null);
  const bgGainRef = useRef<GainNode | null>(null);

  // AI Co-Pilot State
  const [aiTopicInput, setAiTopicInput] = useState('রিয়েল-টাইম মিডিয়া স্ট্রিমিং ও এআই প্রযুক্তির ভবিষ্যৎ');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiGeneratedData, setAiGeneratedData] = useState<{
    tickerHeadlines?: string[];
    interviewQuestions?: string[];
    lowerThirdPreset?: { title: string; subtitle: string; categoryBadge: string };
    audiencePoll?: { question: string; options: string[] };
  } | null>(null);

  // RTMP Destinations
  const [rtmpPlatform, setRtmpPlatform] = useState<'youtube' | 'facebook' | 'custom'>('youtube');
  const [streamKey, setStreamKey] = useState('live_928374_abc123xyz');
  const [isStreamingRtmp, setIsStreamingRtmp] = useState(false);

  // 1. Initialize Local Camera & Microphone
  const initLocalMedia = useCallback(async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, frameRate: { ideal: 30 } },
        audio: true,
      });
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.warn('Could not access real camera/mic, falling back to simulated studio feed:', err?.message);
      setCameraError('ক্যামেরা অথবা মাইক্রোফোন এক্সেস পাওয়া যায়নি। স্টুডিওর ভার্চুয়াল হাই-ডেফিনিশন প্রেজেন্টার ফিড সক্রিয় করা হয়েছে।');
    }
  }, []);

  // 2. Initialize WebSocket Signaling Server
  useEffect(() => {
    initLocalMedia();

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws/broadcast`;
    let ws: WebSocket;

    try {
      ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setWsConnected(true);
        ws.send(JSON.stringify({
          type: 'join-room',
          roomId,
          clientId,
          role,
          name: userName,
        }));
      };

      ws.onmessage = async (event) => {
        try {
          const data = JSON.parse(event.data);
          switch (data.type) {
            case 'room-state':
              setConnectedPeers(data.peers || []);
              break;

            case 'peer-joined':
              setConnectedPeers((prev) => [...prev.filter(p => p.id !== data.peer.id), data.peer]);
              break;

            case 'peer-left':
              setConnectedPeers((prev) => prev.filter(p => p.id !== data.peerId));
              break;

            case 'chat-message':
              setChatMessages((prev) => [...prev, data.message]);
              break;

            case 'overlay-sync':
              setOverlay(data.overlay);
              break;

            case 'push-comment-to-screen':
              setOverlay((prev) => ({
                ...prev,
                activeCommentOnScreen: data.comment,
              }));
              break;

            case 'push-reaction':
              addFloatingReaction(data.reaction);
              break;

            case 'webrtc-signal':
              handleWebRtcSignal(data.senderId, data.signalData);
              break;
          }
        } catch (e) {
          console.error('Error handling ws message in client:', e);
        }
      };

      ws.onclose = () => setWsConnected(false);
      ws.onerror = () => setWsConnected(false);
    } catch (err) {
      console.warn('WebSocket init error:', err);
    }

    return () => {
      if (ws) ws.close();
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (bgAudioEngineRef.current) {
        bgAudioEngineRef.current.stop();
      }
    };
  }, [roomId, role, userName, clientId, initLocalMedia]);

  // WebRTC Signaling Handler
  const handleWebRtcSignal = async (_senderId: string, signalData: any) => {
    if (!peerConnectionRef.current) {
      setupPeerConnection(_senderId);
    }
    const pc = peerConnectionRef.current;
    if (!pc) return;

    if (signalData.sdp) {
      await pc.setRemoteDescription(new RTCSessionDescription(signalData.sdp));
      if (signalData.sdp.type === 'offer') {
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        wsRef.current?.send(JSON.stringify({
          type: 'webrtc-signal',
          targetId: _senderId,
          senderId: clientId,
          signalData: { sdp: pc.localDescription },
        }));
      }
    } else if (signalData.candidate) {
      try {
        await pc.addIceCandidate(new RTCIceCandidate(signalData.candidate));
      } catch (e) {
        console.error('Error adding ICE candidate:', e);
      }
    }
  };

  const setupPeerConnection = (targetPeerId: string) => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });
    peerConnectionRef.current = pc;

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        pc.addTrack(track, localStreamRef.current!);
      });
    }

    pc.onicecandidate = (event) => {
      if (event.candidate && wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: 'webrtc-signal',
          targetId: targetPeerId,
          senderId: clientId,
          signalData: { candidate: event.candidate },
        }));
      }
    };

    pc.ontrack = (event) => {
      if (event.streams && event.streams[0]) {
        remoteStreamRef.current = event.streams[0];
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      }
    };
  };

  // Toggle Screen Sharing
  const handleToggleScreenShare = async () => {
    if (isScreenSharing) {
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((t) => t.stop());
        screenStreamRef.current = null;
      }
      setIsScreenSharing(false);
    } else {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true,
        });
        screenStreamRef.current = screenStream;
        if (screenVideoRef.current) {
          screenVideoRef.current.srcObject = screenStream;
        }
        setIsScreenSharing(true);

        screenStream.getVideoTracks()[0].onended = () => {
          setIsScreenSharing(false);
        };
      } catch (err: any) {
        console.warn('Screen share cancelled or failed:', err?.message);
      }
    }
  };

  // Toggle Camera
  const handleToggleCamera = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach((t) => {
        t.enabled = !isCameraOn;
      });
    }
    setIsCameraOn(!isCameraOn);
  };

  // Toggle Mic
  const handleToggleMic = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach((t) => {
        t.enabled = !isMicOn;
      });
    }
    setIsMicOn(!isMicOn);
  };

  // Send Chat Message
  const handleSendChat = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsg: LiveChatMessage = {
      id: 'msg_' + Date.now(),
      user: userName + (role === 'host' ? ' (হোস্ট)' : ' (গেস্ট)'),
      message: chatInput.trim(),
      timestamp: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }),
      isHost: role === 'host',
    };

    setChatMessages((prev) => [...prev, newMsg]);
    setChatInput('');

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'chat-message',
        roomId,
        message: newMsg,
      }));
    }
  };

  // Push Comment on Screen
  const handlePushCommentToScreen = (msg: LiveChatMessage) => {
    const commentData = {
      userName: msg.user,
      comment: msg.message,
      timestamp: msg.timestamp,
    };
    setOverlay((prev) => ({
      ...prev,
      activeCommentOnScreen: commentData,
    }));

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'push-comment-to-screen',
        roomId,
        comment: commentData,
      }));
    }
  };

  const handleClearCommentOnScreen = () => {
    setOverlay((prev) => ({ ...prev, activeCommentOnScreen: null }));
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'push-comment-to-screen',
        roomId,
        comment: null,
      }));
    }
  };

  // Floating Reactions
  const triggerReaction = (emoji: string) => {
    addFloatingReaction(emoji);
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'push-reaction',
        roomId,
        reaction: emoji,
      }));
    }
  };

  const addFloatingReaction = (emoji: string) => {
    const id = 'rx_' + Math.random().toString(36).substring(2, 7);
    const newRx = {
      id,
      emoji,
      x: 60 + Math.random() * 30, // Percentage from left (around 60-90%)
      y: 90,
    };
    setReactions((prev) => [...prev, newRx]);

    setTimeout(() => {
      setReactions((prev) => prev.filter((r) => r.id !== id));
    }, 2800);
  };

  // Background Audio from 30s Audio Engine
  const toggleBackgroundAudio = async () => {
    if (isBgMusicPlaying) {
      if (bgAudioEngineRef.current) {
        bgAudioEngineRef.current.stop();
      }
      setIsBgMusicPlaying(false);
    } else {
      if (!bgAudioEngineRef.current) {
        bgAudioEngineRef.current = new ThirtySecondSongEngine();
      }
      if (!bgAudioCtxRef.current) {
        const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
        bgAudioCtxRef.current = new AudioCtxClass();
      }
      const ctx = bgAudioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      if (!bgGainRef.current) {
        bgGainRef.current = ctx.createGain();
        bgGainRef.current.connect(ctx.destination);
      }
      bgGainRef.current.gain.setValueAtTime(bgMusicVolume, ctx.currentTime);
      const preset = SONG_STYLE_PRESETS[bgMusicPreset] || SONG_STYLE_PRESETS['bangla-folk'];
      bgAudioEngineRef.current.startLiveSong(ctx, bgGainRef.current, preset, {
        volume: bgMusicVolume,
        onComplete: () => {
          setIsBgMusicPlaying(false);
        },
      });
      setIsBgMusicPlaying(true);
    }
  };

  // Handle Preset Change
  const handlePresetSelect = (presetKey: SongGenre) => {
    setBgMusicPreset(presetKey);
    if (isBgMusicPlaying && bgAudioEngineRef.current && bgAudioCtxRef.current && bgGainRef.current) {
      const preset = SONG_STYLE_PRESETS[presetKey] || SONG_STYLE_PRESETS['bangla-folk'];
      bgAudioEngineRef.current.startLiveSong(bgAudioCtxRef.current, bgGainRef.current, preset, {
        volume: bgMusicVolume,
        onComplete: () => setIsBgMusicPlaying(false),
      });
    }
  };

  // AI Co-Pilot Topic Generator
  const handleGenerateAiTopics = async () => {
    if (!aiTopicInput.trim()) return;
    setIsGeneratingAi(true);
    try {
      const res = await fetch('/api/live/generate-topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: aiTopicInput,
          broadcastType: 'talk-show',
        }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setAiGeneratedData(json.data);
        if (json.data.tickerHeadlines && json.data.tickerHeadlines.length > 0) {
          setOverlay((prev) => ({
            ...prev,
            tickerText: json.data.tickerHeadlines.join(' • '),
          }));
        }
      }
    } catch (err) {
      console.error('Failed to generate topics:', err);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Master 60fps Recording via MediaRecorder
  const handleToggleRecord = () => {
    if (isRecording) {
      // Stop recording
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      clearInterval(recordTimerRef.current);
      setIsRecording(false);
    } else {
      // Start recording
      if (!canvasRef.current) return;
      recordedChunksRef.current = [];
      const stream = canvasRef.current.captureStream(60);

      // Add audio from mic if available
      if (localStreamRef.current) {
        localStreamRef.current.getAudioTracks().forEach((track) => {
          stream.addTrack(track);
        });
      }

      try {
        const recorder = new MediaRecorder(stream, {
          mimeType: 'video/webm;codecs=vp9,opus',
          videoBitsPerSecond: 5000000,
        });

        recorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) {
            recordedChunksRef.current.push(e.data);
          }
        };

        recorder.onstop = () => {
          const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `sheikh-farid-live-broadcast-${Date.now()}.webm`;
          a.click();
          URL.revokeObjectURL(url);
        };

        recorder.start(1000);
        mediaRecorderRef.current = recorder;
        setIsRecording(true);
        setRecordDuration(0);
        recordTimerRef.current = setInterval(() => {
          setRecordDuration((prev) => prev + 1);
        }, 1000);
      } catch (err) {
        console.error('Failed to start MediaRecorder:', err);
      }
    }
  };

  // 60 FPS Canvas Composite Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isRunning = true;

    const render = () => {
      if (!isRunning) return;

      const w = canvas.width;
      const h = canvas.height;

      // 1. Clear & Studio Dark Background
      ctx.fillStyle = '#0b0f17';
      ctx.fillRect(0, 0, w, h);

      // Subtle studio grid/gradient background
      const bgGrad = ctx.createRadialGradient(w / 2, h / 2, 50, w / 2, h / 2, w / 1.2);
      bgGrad.addColorStop(0, '#1a2236');
      bgGrad.addColorStop(1, '#080c14');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // 2. Video Feeds Rendering based on Layout
      const hasLocalVideo = isCameraOn && localVideoRef.current && localVideoRef.current.readyState >= 2;
      const hasScreenShare = isScreenSharing && screenVideoRef.current && screenVideoRef.current.readyState >= 2;
      const hasRemoteVideo = remoteVideoRef.current && remoteVideoRef.current.readyState >= 2;

      const layout = overlay.layout;

      if (layout === 'split-screen') {
        // Left Box: Host (or Screen)
        const leftFeed = hasScreenShare ? screenVideoRef.current : (hasLocalVideo ? localVideoRef.current : null);
        const rightFeed = hasRemoteVideo ? remoteVideoRef.current : null;

        const pad = 24;
        const colW = (w - pad * 3) / 2;
        const colH = h - pad * 2 - 90; // leave bottom space for lower-third & ticker

        // Draw Host Window
        ctx.save();
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 3;
        ctx.strokeRect(pad, pad, colW, colH);
        if (leftFeed) {
          ctx.drawImage(leftFeed, pad, pad, colW, colH);
        } else {
          drawVirtualPresenter(ctx, pad, pad, colW, colH, userName, 'হোস্ট প্রেজেন্টার');
        }
        // Label
        drawFeedBadge(ctx, pad + 16, pad + 24, userName || 'হোস্ট (Sheikh Farid)');
        ctx.restore();

        // Draw Guest Window
        ctx.save();
        ctx.strokeStyle = '#a855f7';
        ctx.lineWidth = 3;
        ctx.strokeRect(pad * 2 + colW, pad, colW, colH);
        if (rightFeed) {
          ctx.drawImage(rightFeed, pad * 2 + colW, pad, colW, colH);
        } else {
          drawVirtualGuest(ctx, pad * 2 + colW, pad, colW, colH, 'অতিথি গেস্ট (WebRTC লাইভ)');
        }
        drawFeedBadge(ctx, pad * 2 + colW + 16, pad + 24, 'আমন্ত্রিত অতিথি • লাইভ কানেক্টেড');
        ctx.restore();

      } else if (layout === 'solo-anchor') {
        // Full screen Host
        const feed = hasScreenShare ? screenVideoRef.current : (hasLocalVideo ? localVideoRef.current : null);
        if (feed) {
          ctx.drawImage(feed, 0, 0, w, h);
        } else {
          drawVirtualPresenter(ctx, 0, 0, w, h, userName, 'মাস্টার লাইভ অ্যাঙ্কর');
        }

      } else if (layout === 'pip') {
        // Big Host / Screen + Small PiP Guest in Bottom Right
        const mainFeed = hasScreenShare ? screenVideoRef.current : (hasLocalVideo ? localVideoRef.current : null);
        const pipFeed = hasRemoteVideo ? remoteVideoRef.current : null;

        if (mainFeed) {
          ctx.drawImage(mainFeed, 0, 0, w, h);
        } else {
          drawVirtualPresenter(ctx, 0, 0, w, h, userName, 'প্রধান ব্রডকাস্ট ফিড');
        }

        // PiP Corner Window
        const pipW = 340;
        const pipH = 210;
        const pipX = w - pipW - 32;
        const pipY = h - pipH - 120;

        ctx.save();
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(pipX, pipY, pipW, pipH);
        ctx.strokeStyle = '#ec4899';
        ctx.lineWidth = 3;
        ctx.strokeRect(pipX, pipY, pipW, pipH);

        if (pipFeed) {
          ctx.drawImage(pipFeed, pipX, pipY, pipW, pipH);
        } else {
          drawVirtualGuest(ctx, pipX, pipY, pipW, pipH, 'অতিথি (PiP)');
        }
        drawFeedBadge(ctx, pipX + 12, pipY + 20, 'রিমোট গেস্ট');
        ctx.restore();

      } else if (layout === 'grid') {
        // 4-Quadrant Matrix (Host, Screen, Guest, AI Visualizer)
        const pad = 16;
        const halfW = (w - pad * 3) / 2;
        const halfH = (h - pad * 3 - 70) / 2;

        // Top Left: Host
        ctx.strokeRect(pad, pad, halfW, halfH);
        if (hasLocalVideo && localVideoRef.current) {
          ctx.drawImage(localVideoRef.current, pad, pad, halfW, halfH);
        } else {
          drawVirtualPresenter(ctx, pad, pad, halfW, halfH, userName, 'ক্যাম ১: হোস্ট');
        }
        drawFeedBadge(ctx, pad + 12, pad + 20, 'ক্যাম ১ • হোস্ট');

        // Top Right: Guest
        const trX = pad * 2 + halfW;
        ctx.strokeRect(trX, pad, halfW, halfH);
        if (hasRemoteVideo && remoteVideoRef.current) {
          ctx.drawImage(remoteVideoRef.current, trX, pad, halfW, halfH);
        } else {
          drawVirtualGuest(ctx, trX, pad, halfW, halfH, 'ক্যাম ২: গেস্ট');
        }
        drawFeedBadge(ctx, trX + 12, pad + 20, 'ক্যাম ২ • রিমোট গেস্ট');

        // Bottom Left: Screen Share
        const blY = pad * 2 + halfH;
        ctx.strokeRect(pad, blY, halfW, halfH);
        if (hasScreenShare && screenVideoRef.current) {
          ctx.drawImage(screenVideoRef.current, pad, blY, halfW, halfH);
        } else {
          drawScreenSharePlaceholder(ctx, pad, blY, halfW, halfH);
        }
        drawFeedBadge(ctx, pad + 12, blY + 20, 'ক্যাম ৩ • স্ক্রিন প্রেজেন্টেশন');

        // Bottom Right: Audio & Studio Intelligence
        ctx.strokeRect(trX, blY, halfW, halfH);
        drawAudioVisualizerMatrix(ctx, trX, blY, halfW, halfH, isBgMusicPlaying, bgMusicPreset);
        drawFeedBadge(ctx, trX + 12, blY + 20, 'ক্যাম ৪ • অডিও স্পেকট্রাম');
      }

      // 3. Top Left: LIVE Badge & Clock
      if (overlay.showLiveBadge) {
        ctx.save();
        // Red badge
        ctx.fillStyle = '#dc2626';
        ctx.beginPath();
        ctx.roundRect(24, 24, 90, 34, 6);
        ctx.fill();

        // Pulsing white dot
        const pulse = (Math.sin(Date.now() / 250) + 1) / 2;
        ctx.fillStyle = `rgba(255, 255, 255, ${0.5 + pulse * 0.5})`;
        ctx.beginPath();
        ctx.arc(42, 41, 5, 0, Math.PI * 2);
        ctx.fill();

        // LIVE text
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 15px sans-serif';
        ctx.fillText('LIVE', 56, 47);

        // Viewers count pill
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.beginPath();
        ctx.roundRect(124, 24, 110, 34, 6);
        ctx.fill();
        ctx.fillStyle = '#94a3b8';
        ctx.font = '13px sans-serif';
        ctx.fillText(`👁️ ${124 + Math.floor(Math.sin(Date.now() / 5000) * 12)} জন`, 136, 46);
        ctx.restore();
      }

      // 4. Top Right: Channel / Studio Watermark Logo
      if (overlay.showLogo) {
        ctx.save();
        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.5)';
        ctx.lineWidth = 1.5;
        const logoW = 240;
        const logoH = 46;
        const logoX = w - logoW - 24;
        const logoY = 24;
        ctx.beginPath();
        ctx.roundRect(logoX, logoY, logoW, logoH, 8);
        ctx.fill();
        ctx.stroke();

        if (logoImgRef.current && logoImgRef.current.complete) {
          ctx.save();
          ctx.beginPath();
          ctx.roundRect(logoX + 6, logoY + 5, 36, 36, 6);
          ctx.clip();
          ctx.drawImage(logoImgRef.current, logoX + 6, logoY + 5, 36, 36);
          ctx.restore();
        }

        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText(overlay.logoText || 'SHEIKH FARID STUDIO', logoX + 48, logoY + 20);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '9px sans-serif';
        ctx.fillText('OFFICIAL LIVE BROADCAST', logoX + 48, logoY + 35);
        ctx.restore();
      }

      // 5. On-Screen Audience Comment (if active)
      if (overlay.activeCommentOnScreen) {
        drawOnScreenComment(ctx, w, h, overlay.activeCommentOnScreen);
      }

      // 6. Lower Third (Speaker & Headline)
      if (overlay.showLowerThird) {
        drawLowerThird(ctx, w, h, overlay);
      }

      // 7. Bottom Scrolling Ticker
      if (overlay.showTicker && overlay.tickerText) {
        drawScrollingTicker(ctx, w, h, overlay.tickerText, overlay.tickerSpeed);
      }

      // 8. Render Floating Reactions
      renderFloatingReactions(ctx, w, h, reactions);

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [overlay, isCameraOn, isScreenSharing, userName, isBgMusicPlaying, bgMusicPreset, reactions]);

  // Helper Drawing Functions
  const drawFeedBadge = (ctx: CanvasRenderingContext2D, x: number, y: number, text: string) => {
    ctx.save();
    ctx.font = '12px sans-serif';
    const textWidth = ctx.measureText(text).width;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.beginPath();
    ctx.roundRect(x, y - 14, textWidth + 16, 22, 4);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.fillText(text, x + 8, y + 2);
    ctx.restore();
  };

  const drawVirtualPresenter = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    name: string,
    tag: string
  ) => {
    ctx.save();
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x, y, width, height);

    // Modern studio silhouette & graphic
    const centerX = x + width / 2;
    const centerY = y + height / 2 - 20;

    // Glowing avatar circle
    const grad = ctx.createLinearGradient(centerX - 60, centerY - 60, centerX + 60, centerY + 60);
    grad.addColorStop(0, '#3b82f6');
    grad.addColorStop(1, '#1d4ed8');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 56, 0, Math.PI * 2);
    ctx.fill();

    // Studio mic icon / monogram
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(name.slice(0, 1) || 'SF', centerX, centerY + 12);

    ctx.font = 'bold 16px sans-serif';
    ctx.fillStyle = '#e2e8f0';
    ctx.fillText(name, centerX, centerY + 84);

    ctx.font = '12px sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(tag, centerX, centerY + 104);

    ctx.restore();
  };

  const drawVirtualGuest = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    tag: string
  ) => {
    ctx.save();
    ctx.fillStyle = '#1e1b4b';
    ctx.fillRect(x, y, width, height);

    const centerX = x + width / 2;
    const centerY = y + height / 2 - 20;

    const grad = ctx.createLinearGradient(centerX - 60, centerY - 60, centerX + 60, centerY + 60);
    grad.addColorStop(0, '#9333ea');
    grad.addColorStop(1, '#4f46e5');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 56, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🎙️', centerX, centerY + 12);

    ctx.font = 'bold 15px sans-serif';
    ctx.fillStyle = '#e2e8f0';
    ctx.fillText('অতিথি সংযোগ অপেক্ষমান', centerX, centerY + 84);

    ctx.font = '12px sans-serif';
    ctx.fillStyle = '#c084fc';
    ctx.fillText(tag, centerX, centerY + 104);

    ctx.restore();
  };

  const drawScreenSharePlaceholder = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number
  ) => {
    ctx.save();
    ctx.fillStyle = '#111827';
    ctx.fillRect(x, y, width, height);

    const centerX = x + width / 2;
    const centerY = y + height / 2;

    ctx.fillStyle = '#374151';
    ctx.beginPath();
    ctx.roundRect(centerX - 100, centerY - 60, 200, 120, 8);
    ctx.fill();

    ctx.fillStyle = '#9ca3af';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🖥️ স্ক্রিন শেয়ার অফলাইন', centerX, centerY + 8);
    ctx.restore();
  };

  const drawAudioVisualizerMatrix = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    isPlaying: boolean,
    preset: string
  ) => {
    ctx.save();
    ctx.fillStyle = '#090d16';
    ctx.fillRect(x, y, width, height);

    const bars = 24;
    const barWidth = (width - 48) / bars;
    const baseY = y + height - 36;

    for (let i = 0; i < bars; i++) {
      let barH = 12;
      if (isPlaying) {
        const freq = Math.sin((Date.now() / 150) + i * 0.4) * 0.5 + 0.5;
        barH = 14 + freq * (height - 80);
      }
      const bx = x + 24 + i * barWidth;
      const by = baseY - barH;

      const grad = ctx.createLinearGradient(bx, baseY, bx, by);
      grad.addColorStop(0, '#10b981');
      grad.addColorStop(0.6, '#38bdf8');
      grad.addColorStop(1, '#f43f5e');

      ctx.fillStyle = grad;
      ctx.fillRect(bx, by, barWidth - 3, barH);
    }

    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`🎶 ব্যাকগ্রাউন্ড মিউজিক: ${preset.toUpperCase()} (${isPlaying ? 'সক্রিয়' : 'পজ'})`, x + 24, y + 28);
    ctx.restore();
  };

  const drawLowerThird = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    currentOverlay: LiveStreamOverlay
  ) => {
    ctx.save();
    const lX = 40;
    const lY = h - 145;
    const lW = 540;
    const lH = 82;

    // Background gradient based on theme
    let primaryColor = '#dc2626'; // broadcast-red
    let accentColor = '#991b1b';
    if (currentOverlay.lowerThirdTheme === 'cyber-neon') {
      primaryColor = '#06b6d4';
      accentColor = '#0891b2';
    } else if (currentOverlay.lowerThirdTheme === 'royal-gold') {
      primaryColor = '#d97706';
      accentColor = '#b45309';
    } else if (currentOverlay.lowerThirdTheme === 'minimal-dark') {
      primaryColor = '#334155';
      accentColor = '#1e293b';
    }

    // Outer dark container
    ctx.fillStyle = 'rgba(15, 23, 42, 0.94)';
    ctx.beginPath();
    ctx.roundRect(lX, lY, lW, lH, 10);
    ctx.fill();

    // Left accent bar
    ctx.fillStyle = primaryColor;
    ctx.beginPath();
    ctx.roundRect(lX, lY, 10, lH, [10, 0, 0, 10]);
    ctx.fill();

    // Top Title Badge (Speaker Name)
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText(currentOverlay.lowerThirdTitle || 'শেখ ফরিদ', lX + 26, lY + 34);

    // Subtitle / Topic
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '15px sans-serif';
    ctx.fillText(currentOverlay.lowerThirdSubtitle || 'প্রধান সিস্টেম আর্কিটেক্ট', lX + 26, lY + 64);

    // Right Category Badge
    ctx.fillStyle = accentColor;
    ctx.beginPath();
    ctx.roundRect(lX + lW - 130, lY + 16, 115, 28, 6);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('লাইভ স্পেশাল', lX + lW - 130 + 57, lY + 34);

    ctx.restore();
  };

  const drawScrollingTicker = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    text: string,
    speed: number
  ) => {
    ctx.save();
    const tickerH = 46;
    const tickerY = h - tickerH;

    // Ticker Background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, tickerY, w, tickerH);

    // Left Fixed "BREAKING NEWS" Block
    const badgeW = 160;
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(0, tickerY, badgeW, tickerH);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 15px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('ব্রেকিং নিউজ', badgeW / 2, tickerY + 28);

    // Scrolling text area clip
    ctx.save();
    ctx.beginPath();
    ctx.rect(badgeW, tickerY, w - badgeW, tickerH);
    ctx.clip();

    ctx.font = '17px sans-serif';
    const textWidth = ctx.measureText(text).width;

    tickerOffsetRef.current -= speed * 0.8;
    if (tickerOffsetRef.current < -textWidth) {
      tickerOffsetRef.current = w - badgeW;
    }

    ctx.fillStyle = '#f8fafc';
    ctx.textAlign = 'left';
    ctx.fillText(text, badgeW + tickerOffsetRef.current, tickerY + 29);

    // Wrap around for seamless reading
    if (tickerOffsetRef.current + textWidth < w) {
      ctx.fillText(text, badgeW + tickerOffsetRef.current + textWidth + 120, tickerY + 29);
    }
    ctx.restore();

    ctx.restore();
  };

  const drawOnScreenComment = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    comment: { userName: string; comment: string; timestamp: string }
  ) => {
    ctx.save();
    const cW = 460;
    const cH = 86;
    const cX = w - cW - 40;
    const cY = h - 150;

    // Card background
    ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(cX, cY, cW, cH, 12);
    ctx.fill();
    ctx.stroke();

    // User Avatar Monogram
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.arc(cX + 32, cY + 36, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(comment.userName.charAt(0), cX + 32, cY + 41);

    // User Name
    ctx.font = 'bold 14px sans-serif';
    ctx.fillStyle = '#38bdf8';
    ctx.textAlign = 'left';
    ctx.fillText(comment.userName, cX + 60, cY + 32);

    // Timestamp
    ctx.font = '11px sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText(comment.timestamp, cX + 60, cY + 48);

    // Comment Text
    ctx.font = '14px sans-serif';
    ctx.fillStyle = '#f1f5f9';
    const truncated = comment.comment.length > 55 ? comment.comment.slice(0, 52) + '...' : comment.comment;
    ctx.fillText(truncated, cX + 60, cY + 70);

    ctx.restore();
  };

  const renderFloatingReactions = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    reactionList: Array<{ id: string; emoji: string; x: number; y: number }>
  ) => {
    ctx.save();
    ctx.font = '32px sans-serif';
    reactionList.forEach((rx) => {
      rx.y -= 1.8; // Float upwards
      const rxPixelX = (rx.x / 100) * w;
      const rxPixelY = (rx.y / 100) * h;
      ctx.fillText(rx.emoji, rxPixelX, rxPixelY);
    });
    ctx.restore();
  };

  // Copy Guest Link
  const handleCopyGuestLink = () => {
    const fullUrl = `${window.location.origin}${window.location.pathname}?room=${roomId}&role=guest`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Studio Top Control Header */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-30 px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Studio Brand */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-rose-600 via-purple-600 to-sky-500 flex items-center justify-center shadow-lg shadow-rose-950/40">
              <Radio className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-sky-400 bg-clip-text text-transparent">
                  শেখ ফরিদ লাইভ ব্রডকাস্ট স্টুডিও
                </h1>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                  WebRTC ৬০ FPS
                </span>
              </div>
              <p className="text-xs text-slate-400">
                পেশাদার মাল্টি-গেস্ট ইন্টারভিউ, ক্যানভাস ওভারলে ও রিয়েল-টাইম স্ট্রিম ইঞ্জিন
              </p>
            </div>
          </div>

          {/* Quick Actions & Recording */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Room ID Badge & Guest Share */}
            <div className="flex items-center bg-slate-800/80 rounded-lg p-1 border border-slate-700/80 text-xs">
              <span className="px-2.5 py-1 text-slate-400 font-mono">রুম: {roomId}</span>
              <button
                onClick={handleCopyGuestLink}
                className="flex items-center gap-1 bg-purple-600 hover:bg-purple-500 text-white px-2.5 py-1 rounded font-medium transition cursor-pointer"
                title="গেস্ট ইনভাইট লিঙ্ক কপি করুন"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'কপি হয়েছে!' : 'গেস্ট লিঙ্ক'}</span>
              </button>
            </div>

            {/* Master 60fps Record Button */}
            <button
              onClick={handleToggleRecord}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-semibold text-xs transition cursor-pointer shadow-md ${
                isRecording
                  ? 'bg-rose-600 text-white animate-pulse hover:bg-rose-700'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              {isRecording ? (
                <>
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>রেকর্ডিং থামান ({recordDuration}s)</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>মাস্টার রেকর্ড (HD)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Camera Error / Permission Notice if needed */}
      {cameraError && (
        <div className="bg-amber-950/40 border-b border-amber-500/30 px-4 py-2 text-xs text-amber-200 flex items-center justify-between">
          <span>ℹ️ {cameraError}</span>
          <button
            onClick={initLocalMedia}
            className="underline hover:text-white font-medium ml-4 cursor-pointer"
          >
            পুনরায় চেষ্টা করুন
          </button>
        </div>
      )}

      {/* Main Studio Workspace Grid */}
      <div className="max-w-7xl mx-auto w-full p-4 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Broadcast Master Canvas Monitor (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col gap-3">
          {/* 16:9 Canvas Container */}
          <div className="relative aspect-video bg-black rounded-2xl overflow-hidden border border-slate-800 shadow-2xl group">
            <canvas
              ref={canvasRef}
              width={1280}
              height={720}
              className="w-full h-full object-contain block"
            />

            {/* Hidden Video Elements used as live capture textures */}
            <video ref={localVideoRef} autoPlay playsInline muted className="hidden" />
            <video ref={remoteVideoRef} autoPlay playsInline className="hidden" />
            <video ref={screenVideoRef} autoPlay playsInline muted className="hidden" />

            {/* In-Canvas Quick Controls Overlay on Hover */}
            <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={() => {
                  if (canvasRef.current?.requestFullscreen) {
                    canvasRef.current.requestFullscreen();
                  }
                }}
                className="p-2 rounded-lg bg-black/60 hover:bg-black/90 text-white text-xs backdrop-blur border border-white/20 transition cursor-pointer"
                title="ফুলস্ক্রিন ভিউ"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick AV Control Bar Below Canvas */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Camera / Mic / Screen Toggles */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleCamera}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                  isCameraOn ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' : 'bg-rose-900/60 text-rose-300 border border-rose-600/40'
                }`}
              >
                {isCameraOn ? <Video className="w-4 h-4 text-emerald-400" /> : <VideoOff className="w-4 h-4" />}
                <span>{isCameraOn ? 'ক্যামেরা অন' : 'ক্যামেরা অফ'}</span>
              </button>

              <button
                onClick={handleToggleMic}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                  isMicOn ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' : 'bg-rose-900/60 text-rose-300 border border-rose-600/40'
                }`}
              >
                {isMicOn ? <Mic className="w-4 h-4 text-emerald-400" /> : <MicOff className="w-4 h-4" />}
                <span>{isMicOn ? 'মাইক অন' : 'মাইক অফ'}</span>
              </button>

              <button
                onClick={handleToggleScreenShare}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                  isScreenSharing ? 'bg-sky-600 text-white shadow' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                }`}
              >
                <Monitor className="w-4 h-4" />
                <span>{isScreenSharing ? 'শেয়ার বন্ধ করুন' : 'স্ক্রিন শেয়ার'}</span>
              </button>
            </div>

            {/* Layout Selectors */}
            <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
              <span className="text-[11px] text-slate-400 px-2 font-medium">লেআউট:</span>
              <button
                onClick={() => setOverlay((prev) => ({ ...prev, layout: 'split-screen' }))}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold transition cursor-pointer ${
                  overlay.layout === 'split-screen' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                স্প্লিট-স্ক্রিন (৫০/৫০)
              </button>
              <button
                onClick={() => setOverlay((prev) => ({ ...prev, layout: 'solo-anchor' }))}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold transition cursor-pointer ${
                  overlay.layout === 'solo-anchor' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                সোলো অ্যাঙ্কর
              </button>
              <button
                onClick={() => setOverlay((prev) => ({ ...prev, layout: 'pip' }))}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold transition cursor-pointer ${
                  overlay.layout === 'pip' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                পিপ (PiP)
              </button>
              <button
                onClick={() => setOverlay((prev) => ({ ...prev, layout: 'grid' }))}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold transition cursor-pointer ${
                  overlay.layout === 'grid' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                গ্রিড ৪-ক্যাম
              </button>
            </div>

            {/* Floating Reactions Trigger Bar */}
            <div className="flex items-center gap-1 border-l border-slate-800 pl-3">
              <button
                onClick={() => triggerReaction('❤️')}
                className="p-1.5 hover:bg-slate-800 rounded-lg text-rose-400 transition cursor-pointer"
                title="Love Reaction"
              >
                <Heart className="w-4 h-4 fill-current" />
              </button>
              <button
                onClick={() => triggerReaction('🔥')}
                className="p-1.5 hover:bg-slate-800 rounded-lg text-amber-400 transition cursor-pointer"
                title="Fire Reaction"
              >
                <Flame className="w-4 h-4 fill-current" />
              </button>
              <button
                onClick={() => triggerReaction('👏')}
                className="p-1.5 hover:bg-slate-800 rounded-lg text-emerald-400 transition cursor-pointer"
                title="Clap Reaction"
              >
                <Smile className="w-4 h-4" />
              </button>
              <button
                onClick={() => triggerReaction('💡')}
                className="p-1.5 hover:bg-slate-800 rounded-lg text-yellow-400 transition cursor-pointer"
                title="Insight Reaction"
              >
                <Lightbulb className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 30-Second Background Audio Integration Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-indigo-950/70 text-indigo-400 border border-indigo-500/30">
                <Volume2 className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-slate-200">৩০-সেকেন্ডের অডিও ইঞ্জিন সিঙ্ক</div>
                <div className="text-[11px] text-slate-400">লাইভ ব্রডকাস্টে ব্যাকগ্রাউন্ড সুর যুক্ত করুন</div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={bgMusicPreset}
                onChange={(e) => handlePresetSelect(e.target.value as SongGenre)}
                className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 text-xs focus:outline-none"
              >
                <option value="bangla-folk">🇧🇩 বাউল ও পল্লী সুর</option>
                <option value="news-broadcast">📺 টিভি ব্রেকিং বুলেটিন</option>
                <option value="lofi-chill">☕ লো-ফাই চিলহপ</option>
                <option value="cinematic-epic">🎬 সিনেমাটিক ট্রেলার</option>
                <option value="viral-edm">⚡ ভাইরাল শর্টস ইডিএম</option>
                <option value="spiritual-sufi">🕌 সুফি ও আধ্যাত্মিক সুর</option>
              </select>

              <button
                onClick={toggleBackgroundAudio}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition cursor-pointer ${
                  isBgMusicPlaying
                    ? 'bg-rose-600 hover:bg-rose-500 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                }`}
              >
                {isBgMusicPlaying ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>{isBgMusicPlaying ? 'মিউজিক থামান' : 'প্লে করুন'}</span>
              </button>

              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={bgMusicVolume}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setBgMusicVolume(val);
                  if (bgGainRef.current && bgAudioCtxRef.current) {
                    bgGainRef.current.gain.setValueAtTime(val, bgAudioCtxRef.current.currentTime);
                  }
                }}
                className="w-20 accent-indigo-500 cursor-pointer"
                title="ভলিউম নিয়ন্ত্রণ"
              />

              {onOpenAudioEngine && (
                <button
                  onClick={onOpenAudioEngine}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[11px] transition cursor-pointer ml-1"
                >
                  পূর্ণাঙ্গ অডিও স্টুডিও ↗
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Broadcast Production Console (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          {/* Navigation Tabs for Production Controls */}
          <div className="grid grid-cols-4 gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setActiveTabPanel('overlays')}
              className={`py-1.5 rounded-lg font-medium transition text-center cursor-pointer ${
                activeTabPanel === 'overlays' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              ওভারলে
            </button>
            <button
              onClick={() => setActiveTabPanel('chat')}
              className={`py-1.5 rounded-lg font-medium transition text-center cursor-pointer relative ${
                activeTabPanel === 'chat' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              চ্যাট
              {chatMessages.length > 0 && (
                <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-emerald-400" />
              )}
            </button>
            <button
              onClick={() => setActiveTabPanel('ai-copilot')}
              className={`py-1.5 rounded-lg font-medium transition text-center cursor-pointer ${
                activeTabPanel === 'ai-copilot' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              এআই কো-পাইলট
            </button>
            <button
              onClick={() => setActiveTabPanel('rtmp')}
              className={`py-1.5 rounded-lg font-medium transition text-center cursor-pointer ${
                activeTabPanel === 'rtmp' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              RTMP লাইভ
            </button>
          </div>

          {/* TAB 1: OVERLAYS & GRAPHICS */}
          {activeTabPanel === 'overlays' && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="font-bold text-slate-200 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-purple-400" />
                  অন-স্ক্রিন ওভারলে ও লোয়ার থার্ড
                </h3>
              </div>

              {/* Lower Third Editor */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-300">লোয়ার থার্ড (বক্তার তথ্য)</label>
                  <input
                    type="checkbox"
                    checked={overlay.showLowerThird}
                    onChange={(e) => setOverlay((prev) => ({ ...prev, showLowerThird: e.target.checked }))}
                    className="accent-purple-500 rounded cursor-pointer"
                  />
                </div>
                <input
                  type="text"
                  placeholder="বক্তার নাম (যেমন: শেখ ফরিদ)"
                  value={overlay.lowerThirdTitle}
                  onChange={(e) => setOverlay((prev) => ({ ...prev, lowerThirdTitle: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:border-purple-500"
                />
                <input
                  type="text"
                  placeholder="পদবি বা বিষয় (যেমন: প্রধান সিস্টেম আর্কিটেক্ট)"
                  value={overlay.lowerThirdSubtitle}
                  onChange={(e) => setOverlay((prev) => ({ ...prev, lowerThirdSubtitle: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:border-purple-500"
                />

                {/* Theme Selector */}
                <div className="pt-1">
                  <span className="text-[11px] text-slate-400">গ্রাফিক্স থিম:</span>
                  <div className="grid grid-cols-2 gap-1.5 mt-1">
                    {[
                      { id: 'broadcast-red', name: 'টিভি নিউজ রেড' },
                      { id: 'cyber-neon', name: 'সাইবার নিয়ন সায়ান' },
                      { id: 'royal-gold', name: 'রয়্যাল গোল্ড' },
                      { id: 'minimal-dark', name: 'মিনিমাল ডার্ক' },
                    ].map((theme) => (
                      <button
                        key={theme.id}
                        onClick={() => setOverlay((prev) => ({ ...prev, lowerThirdTheme: theme.id as any }))}
                        className={`px-2 py-1 rounded text-[11px] font-medium border text-left cursor-pointer transition ${
                          overlay.lowerThirdTheme === theme.id
                            ? 'bg-purple-950/70 border-purple-500 text-purple-200'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {theme.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Ticker Editor */}
              <div className="space-y-2 border-t border-slate-800 pt-3">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-300">ব্রেকিং নিউজ স্ক্রোলিং টিককার</label>
                  <input
                    type="checkbox"
                    checked={overlay.showTicker}
                    onChange={(e) => setOverlay((prev) => ({ ...prev, showTicker: e.target.checked }))}
                    className="accent-purple-500 rounded cursor-pointer"
                  />
                </div>
                <textarea
                  rows={2}
                  value={overlay.tickerText}
                  onChange={(e) => setOverlay((prev) => ({ ...prev, tickerText: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:border-purple-500 text-xs"
                />
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>স্ক্রোলিং গতি: {overlay.tickerSpeed}x</span>
                  <input
                    type="range"
                    min="1"
                    max="6"
                    value={overlay.tickerSpeed}
                    onChange={(e) => setOverlay((prev) => ({ ...prev, tickerSpeed: parseInt(e.target.value) }))}
                    className="w-24 accent-purple-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Watermark & Live Badge Toggles */}
              <div className="border-t border-slate-800 pt-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">চ্যানেল ওয়াটারমার্ক লোগো</span>
                  <input
                    type="checkbox"
                    checked={overlay.showLogo}
                    onChange={(e) => setOverlay((prev) => ({ ...prev, showLogo: e.target.checked }))}
                    className="accent-purple-500 rounded cursor-pointer"
                  />
                </div>
                {overlay.showLogo && (
                  <input
                    type="text"
                    value={overlay.logoText}
                    onChange={(e) => setOverlay((prev) => ({ ...prev, logoText: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1 text-slate-200 focus:outline-none focus:border-purple-500 text-xs"
                  />
                )}
              </div>
            </div>
          )}

          {/* TAB 2: LIVE CHAT & ON-SCREEN COMMENTS */}
          {activeTabPanel === 'chat' && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col h-[420px] text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
                <h3 className="font-bold text-slate-200 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  লাইভ স্টুডিও চ্যাট
                </h3>
                {overlay.activeCommentOnScreen && (
                  <button
                    onClick={handleClearCommentOnScreen}
                    className="text-[11px] bg-rose-950 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded cursor-pointer hover:bg-rose-900"
                  >
                    স্ক্রিন থেকে মুছুন ✕
                  </button>
                )}
              </div>

              {/* Messages List */}
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-2.5 rounded-lg border transition ${
                      overlay.activeCommentOnScreen?.comment === msg.message
                        ? 'bg-purple-950/60 border-purple-500'
                        : 'bg-slate-950/80 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`font-semibold ${msg.isHost ? 'text-amber-400' : 'text-sky-400'}`}>
                        {msg.user}
                      </span>
                      <span className="text-[10px] text-slate-500">{msg.timestamp}</span>
                    </div>
                    <p className="text-slate-300 text-xs leading-relaxed">{msg.message}</p>
                    <div className="mt-2 flex justify-end">
                      <button
                        onClick={() => handlePushCommentToScreen(msg)}
                        className="text-[10px] px-2 py-0.5 rounded bg-slate-800 hover:bg-purple-600 hover:text-white text-slate-400 font-medium transition cursor-pointer"
                      >
                        অন-স্ক্রিনে দেখান 📺
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendChat} className="mt-2 pt-2 border-t border-slate-800 flex gap-2">
                <input
                  type="text"
                  placeholder="লাইভ কমেন্ট লিখুন..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:border-purple-500 text-xs"
                />
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-500 text-white p-2 rounded-lg transition cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: AI CO-PILOT PRODUCER */}
          {activeTabPanel === 'ai-copilot' && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 text-xs overflow-y-auto max-h-[460px]">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="font-bold text-slate-200 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-sky-400" />
                  জেমিনি এআই লাইভ কো-পাইলট
                </h3>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-400">আলোচনার মূল বিষয়:</label>
                <input
                  type="text"
                  value={aiTopicInput}
                  onChange={(e) => setAiTopicInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:border-sky-500 text-xs"
                  placeholder="বিষয় লিখুন..."
                />
              </div>

              <button
                onClick={handleGenerateAiTopics}
                disabled={isGeneratingAi}
                className="w-full bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition cursor-pointer shadow disabled:opacity-50"
              >
                {isGeneratingAi ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>এআই জেনারেট করছে...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>প্রশ্ন ও ব্রেকিং হেডলাইন জেনারেট করুন</span>
                  </>
                )}
              </button>

              {aiGeneratedData && (
                <div className="space-y-3 pt-2">
                  {/* Interview Questions */}
                  {aiGeneratedData.interviewQuestions && (
                    <div className="space-y-1.5">
                      <span className="font-semibold text-slate-300">প্রস্তাবিত ইন্টারভিউ প্রশ্নসমূহ:</span>
                      <div className="space-y-1">
                        {aiGeneratedData.interviewQuestions.map((q, idx) => (
                          <div
                            key={idx}
                            onClick={() => setOverlay((prev) => ({ ...prev, lowerThirdSubtitle: q }))}
                            className="p-2 rounded bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 cursor-pointer transition flex items-start justify-between gap-2"
                            title="ক্লিক করে লোয়ার থার্ডে সেট করুন"
                          >
                            <span>{q}</span>
                            <span className="text-[10px] text-sky-400 whitespace-nowrap">সেট করুন ↵</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Poll Question */}
                  {aiGeneratedData.audiencePoll && (
                    <div className="p-2.5 rounded-lg bg-sky-950/40 border border-sky-500/30 space-y-1.5">
                      <span className="font-semibold text-sky-300">📊 অডিয়েন্স পোল:</span>
                      <p className="text-slate-200">{aiGeneratedData.audiencePoll.question}</p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {aiGeneratedData.audiencePoll.options?.map((opt, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-sky-900/60 text-sky-200 text-[10px]">
                            {opt}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: RTMP LIVE STREAMING */}
          {activeTabPanel === 'rtmp' && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3.5 text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="font-bold text-slate-200 flex items-center gap-2">
                  <Tv className="w-4 h-4 text-rose-500" />
                  RTMP / RTMPS ব্রডকাস্টিং
                </h3>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">স্ট্রিমিং প্ল্যাটফর্ম:</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'youtube', name: 'YouTube Live' },
                    { id: 'facebook', name: 'Facebook Live' },
                    { id: 'custom', name: 'Custom RTMP' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setRtmpPlatform(p.id as any)}
                      className={`py-1.5 px-2 rounded-lg font-medium border text-center transition cursor-pointer ${
                        rtmpPlatform === p.id
                          ? 'bg-rose-950/80 border-rose-500 text-rose-200'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">সার্ভার ইউআরএল:</label>
                <input
                  type="text"
                  readOnly
                  value={
                    rtmpPlatform === 'youtube'
                      ? 'rtmp://a.rtmp.youtube.com/live2'
                      : rtmpPlatform === 'facebook'
                      ? 'rtmps://live-api-s.facebook.com:443/rtmp/'
                      : 'rtmp://your-custom-relay-server/live'
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-400 font-mono text-[11px]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">স্ট্রিম কি (Stream Key):</label>
                <input
                  type="password"
                  value={streamKey}
                  onChange={(e) => setStreamKey(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200 font-mono text-xs focus:outline-none focus:border-rose-500"
                />
              </div>

              <button
                onClick={() => setIsStreamingRtmp(!isStreamingRtmp)}
                className={`w-full py-2 rounded-lg font-semibold transition cursor-pointer shadow ${
                  isStreamingRtmp
                    ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                    : 'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white'
                }`}
              >
                {isStreamingRtmp ? 'লাইভ সম্প্রচার বন্ধ করুন ⏹' : 'লাইভ সম্প্রচার শুরু করুন ▶'}
              </button>

              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <div className="font-semibold text-slate-300">💡 ব্রাউজার টু RTMP পাইপলাইন টিপস:</div>
                <p>
                  MediaRecorder থেকে সরাসরি ফুল এইচডি স্ট্রিম ডাউনলোড করা যায়। একই সাথে নোড ব্যাকএন্ড বা ওবিএস/FFmpeg এর সাথে সমন্বয় করে যেকোনো সময় ৬০ FPS-এ রিলে পুশ করা সম্ভব।
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
