import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

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

// Mount Vite or static files
async function startServer() {
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

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Sheikh Farid AI Studio & Project Hub server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
