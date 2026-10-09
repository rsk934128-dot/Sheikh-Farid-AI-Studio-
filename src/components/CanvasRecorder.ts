/**
 * CanvasRecorder.ts
 * 
 * Local in-browser video recording and frame capturing engine using the MediaRecorder API
 * and HTMLCanvasElement.captureStream().
 * Zero server-side processing, zero API costs, 100% client-side rendering.
 */

export type CanvasRecordingState = 'inactive' | 'recording' | 'paused';

export interface CanvasRecorderQualityPreset {
  id: 'standard' | 'high' | 'ultra';
  nameBn: string;
  fps: number;
  videoBitrate: number;
  audioBitrate: number;
  descriptionBn: string;
}

export const RECORDER_QUALITY_PRESETS: Record<string, CanvasRecorderQualityPreset> = {
  standard: {
    id: 'standard',
    nameBn: 'স্ট্যান্ডার্ড (HD)',
    fps: 30,
    videoBitrate: 2500000, // 2.5 Mbps
    audioBitrate: 128000,  // 128 kbps
    descriptionBn: '30 FPS • 2.5 Mbps (দ্রুত এক্সপোর্ট ও হালকা ফাইল)',
  },
  high: {
    id: 'high',
    nameBn: 'হাই-কোয়ালিটি (Smooth 60)',
    fps: 60,
    videoBitrate: 5000000, // 5.0 Mbps
    audioBitrate: 192000,  // 192 kbps
    descriptionBn: '60 FPS • 5.0 Mbps (মসৃণ সিনেমাটিক মোশন)',
  },
  ultra: {
    id: 'ultra',
    nameBn: 'আল্ট্রা ক্রিস্টাল (4K/Pro)',
    fps: 60,
    videoBitrate: 8000000, // 8.0 Mbps
    audioBitrate: 256000,  // 256 kbps
    descriptionBn: '60 FPS • 8.0 Mbps (সর্বোচ্চ স্পষ্টতা ও বিশদ বিবরণ)',
  },
};

export interface CanvasRecorderOptions {
  fps?: number;
  videoBitsPerSecond?: number;
  audioBitsPerSecond?: number;
  audioStream?: MediaStream | null;
  audioTracks?: MediaStreamTrack[];
  mimeType?: string;
  timeslice?: number;
  onDataAvailable?: (chunk: Blob) => void;
  onStateChange?: (state: CanvasRecordingState) => void;
  onError?: (error: Error) => void;
}

export interface CanvasRecordingResult {
  blob: Blob;
  url: string;
  mimeType: string;
  durationMs: number;
  sizeBytes: number;
  formattedSize: string;
  width: number;
  height: number;
  download: (customFilename?: string) => void;
}

/**
 * Format bytes to readable string (e.g. 4.2 MB)
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Detect the optimal supported video MIME type on the user's browser
 */
export function getOptimalMimeType(): string {
  if (typeof MediaRecorder === 'undefined') {
    return '';
  }

  const candidateMimes = [
    'video/webm;codecs=vp9,opus',
    'video/webm;codecs=vp8,opus',
    'video/webm;codecs=h264,opus',
    'video/webm',
    'video/mp4;codecs=avc1,mp4a',
    'video/mp4',
  ];

  for (const mime of candidateMimes) {
    if (MediaRecorder.isTypeSupported(mime)) {
      return mime;
    }
  }

  return '';
}

/**
 * CanvasRecorder
 * High-performance browser-native canvas frame grabber and MediaRecorder wrapper.
 */
export class CanvasRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];
  private state: CanvasRecordingState = 'inactive';
  private startTime: number = 0;
  private pausedTime: number = 0;
  private totalPausedDuration: number = 0;
  private streamToCleanup: MediaStream | null = null;
  private canvasWidth: number = 0;
  private canvasHeight: number = 0;
  private options: CanvasRecorderOptions = {};

  /**
   * Check if the browser supports MediaRecorder and canvas stream capturing
   */
  public static isSupported(): boolean {
    return (
      typeof window !== 'undefined' &&
      typeof HTMLCanvasElement !== 'undefined' &&
      'captureStream' in HTMLCanvasElement.prototype &&
      typeof MediaRecorder !== 'undefined'
    );
  }

  /**
   * Get best supported MIME types list
   */
  public static getSupportedMimeTypes(): string[] {
    if (typeof MediaRecorder === 'undefined') return [];
    const testList = [
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp8,opus',
      'video/webm;codecs=h264,opus',
      'video/webm',
      'video/mp4;codecs=avc1,mp4a',
      'video/mp4',
    ];
    return testList.filter((m) => MediaRecorder.isTypeSupported(m));
  }

  /**
   * Start recording frames from the given HTMLCanvasElement
   */
  public start(
    canvas: HTMLCanvasElement,
    options: CanvasRecorderOptions = {}
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        if (!canvas) {
          throw new Error('Canvas element is required for CanvasRecorder');
        }

        if (!CanvasRecorder.isSupported()) {
          throw new Error(
            'MediaRecorder API or canvas.captureStream() is not supported in this browser'
          );
        }

        this.options = options;
        this.recordedChunks = [];
        this.totalPausedDuration = 0;
        this.canvasWidth = canvas.width;
        this.canvasHeight = canvas.height;

        const fps = options.fps || 30;
        // Capture direct frames from the rendering canvas
        const canvasStream = canvas.captureStream(fps);

        // Assemble all tracks (Canvas video track + optional audio tracks)
        const combinedTracks: MediaStreamTrack[] = [...canvasStream.getVideoTracks()];

        if (options.audioStream) {
          options.audioStream.getAudioTracks().forEach((track) => {
            combinedTracks.push(track);
          });
        }

        if (options.audioTracks && options.audioTracks.length > 0) {
          options.audioTracks.forEach((track) => {
            if (!combinedTracks.includes(track)) {
              combinedTracks.push(track);
            }
          });
        }

        const compositeStream = new MediaStream(combinedTracks);
        this.streamToCleanup = compositeStream;

        // Determine MIME type
        const mimeType = options.mimeType || getOptimalMimeType();

        const recorderConfig: MediaRecorderOptions = {
          ...(mimeType ? { mimeType } : {}),
          videoBitsPerSecond: options.videoBitsPerSecond || 3000000,
          audioBitsPerSecond: options.audioBitsPerSecond || 128000,
        };

        let recorder: MediaRecorder;
        try {
          recorder = new MediaRecorder(compositeStream, recorderConfig);
        } catch {
          // Fallback if specific bitrate/mimetype throws on older engines
          recorder = new MediaRecorder(compositeStream);
        }

        this.mediaRecorder = recorder;

        recorder.ondataavailable = (event: BlobEvent) => {
          if (event.data && event.data.size > 0) {
            this.recordedChunks.push(event.data);
            if (options.onDataAvailable) {
              options.onDataAvailable(event.data);
            }
          }
        };

        recorder.onerror = (event: any) => {
          const err = new Error(event.error?.message || 'MediaRecorder capture error');
          if (options.onError) {
            options.onError(err);
          }
        };

        // Timeslice specifies how often ondataavailable fires (e.g. 100ms)
        const slice = options.timeslice ?? 100;
        recorder.start(slice);

        this.startTime = Date.now();
        this.state = 'recording';
        if (options.onStateChange) {
          options.onStateChange('recording');
        }

        resolve();
      } catch (err: any) {
        reject(err);
      }
    });
  }

  /**
   * Pause recording
   */
  public pause(): void {
    if (this.mediaRecorder && this.state === 'recording') {
      this.mediaRecorder.pause();
      this.state = 'paused';
      this.pausedTime = Date.now();
      if (this.options.onStateChange) {
        this.options.onStateChange('paused');
      }
    }
  }

  /**
   * Resume recording
   */
  public resume(): void {
    if (this.mediaRecorder && this.state === 'paused') {
      this.mediaRecorder.resume();
      this.totalPausedDuration += Date.now() - this.pausedTime;
      this.state = 'recording';
      if (this.options.onStateChange) {
        this.options.onStateChange('recording');
      }
    }
  }

  /**
   * Stop recording and package the recorded frames into a local video file
   */
  public stop(): Promise<CanvasRecordingResult> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('Recorder is not active'));
        return;
      }

      const recorder = this.mediaRecorder;

      recorder.onstop = () => {
        try {
          const durationMs = Math.max(
            100,
            Date.now() - this.startTime - this.totalPausedDuration
          );
          const mimeType = recorder.mimeType || 'video/webm';
          const blob = new Blob(this.recordedChunks, { type: mimeType });
          const url = URL.createObjectURL(blob);
          const sizeBytes = blob.size;
          const formattedSize = formatBytes(sizeBytes);

          // Stop all internal tracks to release hardware canvas capturing hooks
          if (this.streamToCleanup) {
            this.streamToCleanup.getTracks().forEach((track) => track.stop());
            this.streamToCleanup = null;
          }

          this.state = 'inactive';
          if (this.options.onStateChange) {
            this.options.onStateChange('inactive');
          }

          const result: CanvasRecordingResult = {
            blob,
            url,
            mimeType,
            durationMs,
            sizeBytes,
            formattedSize,
            width: this.canvasWidth,
            height: this.canvasHeight,
            download: (customFilename?: string) => {
              const ext = mimeType.includes('mp4') ? 'mp4' : 'webm';
              const filename =
                customFilename ||
                `canvas-render-${Date.now()}.${ext}`;
              const a = document.createElement('a');
              a.href = url;
              a.download = filename;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
            },
          };

          this.mediaRecorder = null;
          resolve(result);
        } catch (err: any) {
          reject(err);
        }
      };

      if (recorder.state !== 'inactive') {
        recorder.stop();
      } else {
        recorder.onstop(new Event('stop'));
      }
    });
  }

  /**
   * Current recorder state
   */
  public getState(): CanvasRecordingState {
    return this.state;
  }

  /**
   * Elapsed recording time in milliseconds (excluding pauses)
   */
  public getElapsedTimeMs(): number {
    if (this.state === 'inactive') return 0;
    if (this.state === 'paused') {
      return this.pausedTime - this.startTime - this.totalPausedDuration;
    }
    return Date.now() - this.startTime - this.totalPausedDuration;
  }

  /**
   * Take a high-resolution snapshot from the canvas directly as an image file
   */
  public static captureSnapshot(
    canvas: HTMLCanvasElement,
    format: 'image/png' | 'image/jpeg' = 'image/png',
    quality = 0.95,
    customFilename?: string
  ): Promise<{ dataUrl: string; download: () => void }> {
    return new Promise((resolve, reject) => {
      try {
        const dataUrl = canvas.toDataURL(format, quality);
        const ext = format === 'image/jpeg' ? 'jpg' : 'png';
        const filename = customFilename || `canvas-snapshot-${Date.now()}.${ext}`;

        const download = () => {
          const a = document.createElement('a');
          a.href = dataUrl;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        };

        resolve({ dataUrl, download });
      } catch (err) {
        reject(err);
      }
    });
  }
}
