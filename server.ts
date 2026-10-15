import http from 'http';
import fs from 'fs';
import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { WebSocketServer, WebSocket as WsWebSocket } from 'ws';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Body parser with 50MB limit to handle video keyframes and clips
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Server-side Google GenAI initialization
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Sheikh Farid AI Studio & Project Hub',
    geminiConfigured: Boolean(apiKey),
  });
});

// Path to official Studio Logo asset
const LOGO_ASSET_PATH = path.resolve(__dirname, 'src', 'assets', 'images', 'sheikh_farid_logo_1792083190919.jpg');

// Dedicated endpoints for Favicon, Logo & Social Previews
app.get(
  [
    '/favicon.ico',
    '/favicon.png',
    '/logo.jpg',
    '/logo.png',
    '/apple-touch-icon.png',
    '/apple-touch-icon-precomposed.png',
  ],
  (req: Request, res: Response) => {
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.setHeader('Content-Type', 'image/jpeg');
    res.sendFile(LOGO_ASSET_PATH);
  }
);

// PWA Manifest Endpoint
app.get('/manifest.json', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/manifest+json');
  res.sendFile(path.resolve(__dirname, 'public', 'manifest.json'));
});

// Static assets handler for client images and logos
app.use('/src/assets', express.static(path.resolve(__dirname, 'src', 'assets')));

/**
 * Video Analysis Endpoint
 * Uses model 'gemini-3.1-pro-preview' for deep multimodal video understanding
 */
app.post('/api/gemini/analyze-video', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      videoData,
      mimeType = 'video/mp4',
      analysisType = 'comprehensive',
      customPrompt,
      keyframes = [],
      videoMetadata,
    } = req.body;

    // If videoData or keyframes are provided, include them in multimodal parts
    if (!videoData && (!keyframes || keyframes.length === 0)) {
      console.log('Video request received without raw binary; using video context & metadata for Gemini Pro analysis:', videoMetadata?.title);
    }

    let systemInstruction = `You are Sheikh Farid AI Video Analyst, a premier video understanding engine powered by Gemini Pro (gemini-3.1-pro-preview).
You accurately extract key information, detect timestamps, summarize events, transcribe critical audio or visual text, and synthesize deep insights.
Whenever possible or if queried in Bengali, provide outputs in crisp, professional Bengali (বাংলা) alongside clear English technical terminology.
Structure your analysis with:
1. 📌 নির্বাহী সারসংক্ষেপ (Executive Summary)
2. ⏱️ সময়রেখা ও মূল তথ্যাবলী (Timestamped Key Information & Highlights)
3. 🎯 সিদ্ধান্ত ও করণীয় (Key Takeaways & Action Items)
4. 🔍 ভিজ্যুয়াল ও অডিও উপাদান (Identified Visual Elements, Text Overlays, & Speech Context)`;

    let promptText = '';
    switch (analysisType) {
      case 'key_info':
        promptText = customPrompt || 'Analyze this video thoroughly. Extract all critical facts, data points, identities, numbers, and key information.';
        break;
      case 'chapters':
        promptText = customPrompt || 'Generate a detailed chronological chapter breakdown with start timestamps (MM:SS), titles, and bulleted summaries for each section.';
        break;
      case 'action_items':
        promptText = customPrompt || 'Identify all action items, decisions made, tutorials/steps demonstrated, and practical takeaways from this video.';
        break;
      case 'qa':
        promptText = customPrompt || 'Answer the user query based strictly on the video content with timestamp references.';
        break;
      default:
        promptText = customPrompt || `Perform a comprehensive video intelligence audit. Detail:
1. Executive Summary
2. Key Moments & Timestamps
3. Critical Information & Topics Covered
4. Technical/Instructional takeaways or actionable insights.
${videoMetadata ? `Video Context: Title: ${videoMetadata.title || 'Untitled'}, Duration: ${videoMetadata.duration || 'Unknown'}` : ''}`;
        break;
    }

    // Build multimodal contents payload
    const parts: any[] = [];

    if (videoData) {
      parts.push({
        inlineData: {
          mimeType: mimeType || 'video/mp4',
          data: videoData,
        },
      });
    } else if (keyframes && keyframes.length > 0) {
      // Multiple sample keyframe images extracted from video client-side
      for (const frame of keyframes) {
        parts.push({
          inlineData: {
            mimeType: frame.mimeType || 'image/jpeg',
            data: frame.data,
          },
        });
      }
    }

    parts.push({
      text: promptText,
    });

    const requestedModel = req.body.model || 'gemini-3.8-flash';
    let modelName = requestedModel;
    let responseText = '';
    let fallbackUsed = false;

    // Try requested model, with clean silent fallback to gemini-3.8-flash if quota/permissions require it
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: { parts },
        config: {
          systemInstruction,
          temperature: 0.2,
        },
      });
      responseText = response.text || '';
    } catch {
      // If primary model hits quota limit (e.g., 429 on free tier), silently fallback to gemini-3.8-flash
      if (modelName !== 'gemini-3.8-flash') {
        modelName = 'gemini-3.8-flash';
        fallbackUsed = true;
        try {
          const fallbackRes = await ai.models.generateContent({
            model: modelName,
            contents: { parts },
            config: {
              systemInstruction,
              temperature: 0.2,
            },
          });
          responseText = fallbackRes.text || '';
        } catch (fbErr: any) {
          throw fbErr;
        }
      }
    }

    res.json({
      success: true,
      analysis: responseText,
      modelUsed: modelName,
      fallbackUsed,
      timestamp: new Date().toISOString(),
      analysisType,
    });
  } catch (error: any) {
    console.error('Error analyzing video:', error);
    res.status(500).json({
      error: error?.message || 'ভিডিও বিশ্লেষণ করতে সমস্যা হয়েছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।',
    });
  }
});

/**
 * General AI Lab Generation Endpoint
 * Handles Bengali GovTech drafts, legal queries, GD templates, and developer scripts
 */
app.post('/api/gemini/generate', async (req: Request, res: Response): Promise<void> => {
  try {
    const { prompt, mode = 'general', context } = req.body;

    if (!prompt) {
      res.status(400).json({ error: 'প্রম্পট প্রদান করা আবশ্যক (Prompt is required)' });
      return;
    }

    let systemInstruction = `You are Sheikh Farid AI Core - an ultra-accurate Bengali GovTech & Technical AI system (মিনি মাইক্রোসফট • হাই-প্রিসিশন লোকাল এআই).
You specialize in Bangladesh citizen services (অনলাইন জিডি খসড়া, প্রশাসনিক ছুটির আবেদন, সরকারি ফরম্যাট), legal inquiries, developer utility (V2Ray/OpenVPN/3X-UI server scripts), and code optimization.
Respond in clear, respectful, authoritative Bengali with proper official formatting when generating documents.`;

    if (mode === 'gd_draft') {
      systemInstruction += ` You are drafting an official Bangladesh Police General Diary (সাধারণ ডায়েরি - জিডি) in authentic Bengali format. Include officer-in-charge salutation, applicant details, lost item description (NID/Mobile/License/Passport), place, date, and prayer for registration.`;
    } else if (mode === 'leave_application') {
      systemInstruction += ` You are drafting an official administrative/governmental leave application (ছুটির আবেদনপত্র) in Bangladesh civil service standard.`;
    } else if (mode === 'vpn_script') {
      systemInstruction += ` You are a DevOps & Network Security Architect. Provide production-ready, secure Linux scripts for V2Ray, WireGuard, OpenVPN, and 3X-UI proxy setups with clear warnings regarding Bangladesh cyber security regulations.`;
    }

    const contents = context ? `${context}\n\nUser Request: ${prompt}` : prompt;

    // Use gemini-3.8-flash for fast interactive queries
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.3,
      },
    });

    res.json({
      success: true,
      text: response.text || '',
      model: 'gemini-3.8-flash',
    });
  } catch (error: any) {
    console.error('Error in gemini generate:', error);
    res.status(500).json({
      error: error?.message || 'এআই উত্তর তৈরিতে সমস্যা হয়েছে।',
    });
  }
});

/**
 * Workspace / Gmail Integration Proxy
 * Allows fetching labels and messages with client token or mock demo
 */
app.get('/api/workspace/gmail/labels', async (req: Request, res: Response): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // Return sample demo labels
    res.json({
      isDemo: true,
      labels: [
        { id: 'INBOX', name: 'INBOX', type: 'system', messagesTotal: 24, messagesUnread: 3 },
        { id: 'STARRED', name: 'STARRED', type: 'system', messagesTotal: 5, messagesUnread: 0 },
        { id: 'IMPORTANT', name: 'IMPORTANT', type: 'system', messagesTotal: 8, messagesUnread: 1 },
        { id: 'SENT', name: 'SENT', type: 'system', messagesTotal: 42, messagesUnread: 0 },
        { id: 'DRAFT', name: 'DRAFT', type: 'system', messagesTotal: 2, messagesUnread: 0 },
        { id: 'Label_GovTech', name: 'GovTech-BD', type: 'user', messagesTotal: 12, messagesUnread: 2, color: { backgroundColor: '#0f766e', textColor: '#ffffff' } },
        { id: 'Label_Projects', name: 'Sheikh-Studio-Projects', type: 'user', messagesTotal: 19, messagesUnread: 0, color: { backgroundColor: '#1d4ed8', textColor: '#ffffff' } },
        { id: 'Label_Security', name: 'Cyber-Security-Alerts', type: 'user', messagesTotal: 4, messagesUnread: 1, color: { backgroundColor: '#b91c1c', textColor: '#ffffff' } },
      ],
    });
    return;
  }

  try {
    const token = authHeader.replace('Bearer ', '');
    const googleRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/labels', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!googleRes.ok) {
      const errText = await googleRes.text();
      res.status(googleRes.status).json({ error: 'Failed to fetch from Gmail API', details: errText });
      return;
    }

    const data = await googleRes.json();
    res.json({ isDemo: false, labels: data.labels });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'Error proxying Gmail API' });
  }
});

/**
 * YouTube Music & Audio Resolver API
 * Resolves YouTube video metadata (title, author, thumbnail, videoId, embedUrl)
 * for mixing background music with the video.
 */
app.get('/api/youtube/info', async (req: Request, res: Response): Promise<void> => {
  try {
    const rawUrl = String(req.query.url || '').trim();
    if (!rawUrl) {
      res.status(400).json({ error: 'YouTube URL is required' });
      return;
    }

    // Extract video ID from standard watch, share youtu.be, or shorts link
    let videoId = '';
    const match = rawUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
    if (match && match[1]) {
      videoId = match[1];
    }

    const cleanUrl = videoId ? `https://www.youtube.com/watch?v=${videoId}` : rawUrl;

    // Use YouTube oEmbed API
    const oembedRes = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(cleanUrl)}&format=json`);
    if (!oembedRes.ok) {
      res.status(404).json({
        error: 'ইউটিউব ভিডিও পাওয়া যায়নি। অনুগ্রহ করে সঠিক লিঙ্ক দিন।',
      });
      return;
    }

    const oembedData: any = await oembedRes.json();
    res.json({
      success: true,
      videoId,
      title: oembedData.title,
      author: oembedData.author_name,
      authorUrl: oembedData.author_url,
      thumbnailUrl: videoId
        ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
        : oembedData.thumbnail_url,
      embedUrl: videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1` : null,
      provider: 'YouTube',
    });
  } catch (error: any) {
    console.error('Error fetching YouTube info:', error);
    res.status(500).json({
      error: 'ইউটিউব তথ্য লোড করতে সমস্যা হয়েছে: ' + (error?.message || ''),
    });
  }
});

/**
 * =========================================================================
 * 📡 LIVE STUDIO & BROADCAST ENGINE APIS & WEBSOCKET SIGNALING SERVER
 * =========================================================================
 */

// AI Live Co-Pilot: Generate Live Interview Questions, Breaking Tickers & Lower Thirds
app.post('/api/live/generate-topics', async (req: Request, res: Response): Promise<void> => {
  try {
    const { topic = 'রিয়েল-টাইম মিডিয়া স্ট্রিমিং ও এআই প্রযুক্তির ভবিষ্যৎ', broadcastType = 'talk-show' } = req.body;

    const prompt = `You are the executive producer of Sheikh Farid Broadcast Studio (শেখ ফরিদ ব্রডকাস্ট স্টুডিও).
Topic: "${topic}"
Broadcast Format: "${broadcastType}"

Generate broadcast graphics content and questions in Bengali (বাংলা).
Output pure valid JSON in this exact structure without markdown backticks:
{
  "tickerHeadlines": [
    "ব্রেকিং নিউজ: ... (under 80 chars)",
    "বিশেষ প্রতিবেদন: ... (under 80 chars)",
    "লাইভ আপডেট: ... (under 80 chars)"
  ],
  "interviewQuestions": [
    "প্রশ্ন ১: ...",
    "প্রশ্ন ২: ...",
    "প্রশ্ন ৩: ...",
    "প্রশ্ন ৪: ..."
  ],
  "lowerThirdPreset": {
    "title": "...",
    "subtitle": "...",
    "categoryBadge": "..."
  },
  "audiencePoll": {
    "question": "...",
    "options": ["হ্যাঁ", "না", "মন্তব্য নেই"]
  }
}`;

    let resultJson: any = null;
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          temperature: 0.3,
        },
      });
      const text = response.text || '';
      const cleanJson = text.replace(/```json/gi, '').replace(/```/g, '').trim();
      resultJson = JSON.parse(cleanJson);
    } catch (geminiError: any) {
      console.warn('Gemini topic generation fallback:', geminiError?.message);
      resultJson = {
        tickerHeadlines: [
          `ব্রেকিং নিউজ: ${topic} নিয়ে লাইভ আলোচনা চলছে শেখ ফরিদ স্টুডিওতে`,
          'বিশেষ সম্প্রচার: ৬০ এফপিএস ফুল-এইচডি ক্যানভাস স্ট্রিমিং ও ওয়েবআরটিসি সংযোগ সক্রিয়',
          'দর্শকদের মতামত: কমেন্ট করুন এবং সরাসরি অন-স্ক্রিনে আপনার নাম ও মতামত প্রদর্শন করুন',
        ],
        interviewQuestions: [
          `${topic} ক্ষেত্রে প্রধান প্রযুক্তিগত চ্যালেঞ্জ ও সুযোগগুলো কী কী?`,
          'কম লেটেন্সি (Ultra-low latency) নিশ্চিত করতে কোন আর্কিটেকচার সবচেয়ে কার্যকর?',
          'এআই এবং অটোমেশন কীভাবে ব্রডকাস্টিং ইন্ডাস্ট্রিকে বদলে দিচ্ছে?',
          'ভবিষ্যৎ প্ল্যাটফর্ম হিসেবে নিজস্ব স্টুডিও তৈরি করার মূল কৌশল কী?',
        ],
        lowerThirdPreset: {
          title: 'শেখ ফরিদ • প্রধান আর্কিটেক্ট',
          subtitle: topic,
          categoryBadge: 'বিশেষ লাইভ টকশো',
        },
        audiencePoll: {
          question: 'আপনি কি মনে করেন ব্রাউজার-ভিত্তিক স্টুডিও কনভেনশনাল ওবিএস স্টুডিওকে রিপ্লেস করতে পারবে?',
          options: ['হ্যাঁ, শতভাগ সম্ভব', 'না, এখনও সময় লাগবে', 'উভয়ের মেলবন্ধন সেরা'],
        },
      };
    }

    res.json({ success: true, data: resultJson });
  } catch (error: any) {
    console.error('Error generating live topics:', error);
    res.status(500).json({ error: 'লাইভ টপিক জেনারেট করতে সমস্যা হয়েছে: ' + (error?.message || '') });
  }
});

// RTMP & Stream Transcoder Endpoints Info
app.get('/api/live/rtmp-info', (req: Request, res: Response) => {
  res.json({
    destinations: [
      {
        platform: 'YouTube Live',
        rtmpUrl: 'rtmp://a.rtmp.youtube.com/live2',
        protocol: 'RTMP / RTMPS',
        recommendedResolution: '1920x1080 (1080p60)',
        bitrate: '4500 - 6000 kbps',
      },
      {
        platform: 'Facebook Live',
        rtmpUrl: 'rtmps://live-api-s.facebook.com:443/rtmp/',
        protocol: 'RTMPS (SSL Enforced)',
        recommendedResolution: '1920x1080 (1080p30/60)',
        bitrate: '4000 kbps',
      },
      {
        platform: 'Twitch / Custom RTMP',
        rtmpUrl: 'rtmp://live.twitch.tv/app/',
        protocol: 'RTMP',
        recommendedResolution: '1920x1080 (1080p60)',
        bitrate: '6000 kbps',
      },
    ],
    ffmpegRelaySnippet: `ffmpeg -f webm -i input_canvas_stream.webm -c:v libx264 -preset veryfast -b:v 4500k -maxrate 4500k -bufsize 9000k -pix_fmt yuv420p -g 60 -c:a aac -b:a 192k -ar 44100 -f flv "rtmp://a.rtmp.youtube.com/live2/YOUR_STREAM_KEY"`,
  });
});

// Mount Vite or static files
async function startServer() {
  const server = http.createServer(app);

  // WebSocket Signaling Server for WebRTC, Dynamic Overlays & Live Chat
  const wss = new WebSocketServer({ server, path: '/ws/broadcast' });

  interface PeerConnection {
    id: string;
    ws: WsWebSocket;
    roomId: string;
    role: 'host' | 'guest' | 'viewer';
    name: string;
  }

  const peers = new Map<string, PeerConnection>();

  wss.on('connection', (ws: WsWebSocket) => {
    let currentPeerId: string | null = null;
    let currentRoomId: string | null = null;

    ws.on('message', (rawData: string) => {
      try {
        const msg = JSON.parse(rawData.toString());

        switch (msg.type) {
          case 'join-room': {
            const { roomId, clientId, role, name } = msg;
            currentPeerId = clientId;
            currentRoomId = roomId;

            peers.set(clientId, {
              id: clientId,
              ws,
              roomId,
              role: role || 'guest',
              name: name || (role === 'host' ? 'হোস্ট (Sheikh Farid)' : 'অতিথি গেস্ট'),
            });

            // Gather other peers in the room
            const peersInRoom: Array<{ id: string; role: string; name: string }> = [];
            peers.forEach((peer) => {
              if (peer.roomId === roomId && peer.id !== clientId) {
                peersInRoom.push({ id: peer.id, role: peer.role, name: peer.name });
              }
            });

            // Notify joining client with current room members
            ws.send(JSON.stringify({
              type: 'room-state',
              peers: peersInRoom,
            }));

            // Broadcast to other peers that a new user joined
            peers.forEach((peer) => {
              if (peer.roomId === roomId && peer.id !== clientId && peer.ws.readyState === WsWebSocket.OPEN) {
                peer.ws.send(JSON.stringify({
                  type: 'peer-joined',
                  peer: { id: clientId, role: role || 'guest', name: name || 'অতিথি গেস্ট' },
                }));
              }
            });
            break;
          }

          case 'webrtc-signal': {
            // Forward signal directly to target peer
            const { targetId, senderId, signalData } = msg;
            const targetPeer = peers.get(targetId);
            if (targetPeer && targetPeer.ws.readyState === WsWebSocket.OPEN) {
              targetPeer.ws.send(JSON.stringify({
                type: 'webrtc-signal',
                senderId,
                signalData,
              }));
            }
            break;
          }

          case 'chat-message': {
            const { roomId } = msg;
            peers.forEach((peer) => {
              if (peer.roomId === roomId && peer.ws.readyState === WsWebSocket.OPEN) {
                peer.ws.send(JSON.stringify({
                  type: 'chat-message',
                  message: msg.message,
                }));
              }
            });
            break;
          }

          case 'overlay-sync': {
            const { roomId, overlay } = msg;
            peers.forEach((peer) => {
              if (peer.roomId === roomId && peer.ws.readyState === WsWebSocket.OPEN) {
                peer.ws.send(JSON.stringify({
                  type: 'overlay-sync',
                  overlay,
                }));
              }
            });
            break;
          }

          case 'push-comment-to-screen': {
            const { roomId, comment } = msg;
            peers.forEach((peer) => {
              if (peer.roomId === roomId && peer.ws.readyState === WsWebSocket.OPEN) {
                peer.ws.send(JSON.stringify({
                  type: 'push-comment-to-screen',
                  comment,
                }));
              }
            });
            break;
          }

          case 'push-reaction': {
            const { roomId, reaction } = msg;
            peers.forEach((peer) => {
              if (peer.roomId === roomId && peer.ws.readyState === WsWebSocket.OPEN) {
                peer.ws.send(JSON.stringify({
                  type: 'push-reaction',
                  reaction,
                }));
              }
            });
            break;
          }
        }
      } catch (err) {
        console.error('Error handling WebSocket broadcast message:', err);
      }
    });

    ws.on('close', () => {
      if (currentPeerId) {
        peers.delete(currentPeerId);
        if (currentRoomId) {
          peers.forEach((peer) => {
            if (peer.roomId === currentRoomId && peer.ws.readyState === WsWebSocket.OPEN) {
              peer.ws.send(JSON.stringify({
                type: 'peer-left',
                peerId: currentPeerId,
              }));
            }
          });
        }
      }
    });
  });

  // Social Crawler middleware for WhatsApp, Facebook, Twitter, Telegram, LinkedIn, Discord
  app.use(async (req: Request, res: Response, next) => {
    const ua = (req.headers['user-agent'] as string) || '';
    const crawlers = [
      'facebookexternalhit',
      'facebot',
      'whatsapp',
      'twitterbot',
      'telegrambot',
      'linkedinbot',
      'discordbot',
      'slackbot',
      'skypeuripreview',
    ];
    const isSocialBot = crawlers.some((bot) => ua.toLowerCase().includes(bot));
    const isRootReq = req.path === '/' || req.path === '/index.html';

    if (isSocialBot && isRootReq) {
      try {
        const proto = req.headers['x-forwarded-proto'] || req.protocol || 'https';
        const host = req.get('host') || `localhost:${PORT}`;
        const origin = `${proto}://${host}`;
        const indexPath = process.env.NODE_ENV === 'production'
          ? path.resolve(__dirname, 'dist', 'index.html')
          : path.resolve(__dirname, 'index.html');

        let html = await fs.promises.readFile(indexPath, 'utf-8');
        html = html.replace(/content="\/logo\.jpg"/g, `content="${origin}/logo.jpg"`);
        html = html.replace(/href="\/logo\.jpg"/g, `href="${origin}/logo.jpg"`);
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        return res.send(html);
      } catch (e) {
        return next();
      }
    }
    next();
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Sheikh Farid AI Studio & Live Broadcast Hub running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
