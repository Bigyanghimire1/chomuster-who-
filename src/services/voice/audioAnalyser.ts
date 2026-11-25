/**
 * AudioAnalyser — Real-time Web Audio API RMS level and speech detection.
 * Computes Root Mean Square (RMS) audio energy and determines speaking state
 * with configurable threshold (~0.02) and debounce hold-time to prevent flickering.
 */

export interface AudioAnalyserOptions {
  /** Fast Fourier Transform size (power of 2, default: 512) */
  fftSize?: number;
  /** Smoothing time constant between 0 and 1 (default: 0.3) */
  smoothingTimeConstant?: number;
  /** RMS threshold above which speech is detected (default: 0.02) */
  threshold?: number;
  /** Debounce hold time in ms so natural speech gaps don't flicker (default: 200ms) */
  holdTimeMs?: number;
  /** Optional external AudioContext */
  audioContext?: AudioContext;
}

export interface AudioAnalysisResult {
  /** Raw Root Mean Square value (typically 0.00 to ~0.40) */
  rms: number;
  /** Normalized level scaled for UI visualizations (0.0 to 1.0) */
  level: number;
  /** Boolean indicating whether speech is currently detected */
  isSpeaking: boolean;
}

export type AudioAnalysisListener = (result: AudioAnalysisResult) => void;

type AudioContextCtor = typeof AudioContext;

let sharedAudioCtx: AudioContext | null = null;
let sharedAudioCtxCtor: AudioContextCtor | null = null;
let unlockListenersAttached = false;

function getAudioContextConstructor(): AudioContextCtor | null {
  if (typeof window === 'undefined') return null;
  return (
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: AudioContextCtor }).webkitAudioContext ||
    null
  );
}

/**
 * Resume the shared AudioContext if suspended or interrupted (common on iOS Safari/Chrome
 * after getUserMedia AVAudioSession switches or tab backgrounding).
 */
export async function unlockSharedAudioContext(): Promise<AudioContext | null> {
  const ctx = getSharedAudioContext();
  if (!ctx) return null;

  if (ctx.state !== 'running' && ctx.state !== 'closed' && typeof ctx.resume === 'function') {
    try {
      await ctx.resume();
    } catch {
      // Ignore if called outside an active gesture; listener will retry on next tap
    }
  }
  return ctx;
}

function attachSharedContextUnlockListeners(): void {
  if (unlockListenersAttached || typeof window === 'undefined') return;
  if (typeof window.addEventListener !== 'function') return;

  unlockListenersAttached = true;
  const resumeIfNeeded = () => {
    if (sharedAudioCtx && sharedAudioCtx.state !== 'running' && sharedAudioCtx.state !== 'closed') {
      sharedAudioCtx.resume?.().catch(() => {});
    }
  };

  window.addEventListener('pointerdown', resumeIfNeeded, { passive: true });
  window.addEventListener('touchstart', resumeIfNeeded, { passive: true });
  window.addEventListener('keydown', resumeIfNeeded, { passive: true });

  if (typeof document !== 'undefined' && typeof document.addEventListener === 'function') {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        resumeIfNeeded();
      }
    });
  }
}

/**
 * Reuse one shared AudioContext across AudioAnalyser and AudioService instances so mobile
 * browsers (especially iOS Safari/Chrome WKWebView, capped around 4-6 contexts and sensitive
 * to competing AVAudioSessions) never exhaust or conflict on hardware audio contexts.
 */
export function getSharedAudioContext(): AudioContext | null {
  const AudioCtx = getAudioContextConstructor();
  if (!AudioCtx) return null;

  attachSharedContextUnlockListeners();

  if (sharedAudioCtx && sharedAudioCtxCtor === AudioCtx && sharedAudioCtx.state !== 'closed') {
    return sharedAudioCtx;
  }

  sharedAudioCtx = new AudioCtx();
  sharedAudioCtxCtor = AudioCtx;
  return sharedAudioCtx;
}

export class AudioAnalyser {
  private ctx: AudioContext | null = null;
  private isExternalCtx: boolean = false;
  private isSharedCtx: boolean = false;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private analyserNode: AnalyserNode | null = null;
  private timeData: Uint8Array | null = null;
  private floatData: Float32Array | null = null;
  private streamCleanups: Array<() => void> = [];
  private attachedStream: MediaStream | null = null;

  private threshold: number;
  private holdTimeMs: number;
  private lastSpeakingTime: number = 0;

  private currentRms: number = 0;
  private currentLevel: number = 0;
  private currentlySpeaking: boolean = false;

  private animFrameId: number | null = null;
  private timerId: ReturnType<typeof setInterval> | null = null;
  private listeners: Set<AudioAnalysisListener> = new Set();
  private isDestroyed: boolean = false;

  constructor(stream?: MediaStream, options: AudioAnalyserOptions = {}) {
    this.threshold = options.threshold ?? 0.02;
    this.holdTimeMs = options.holdTimeMs ?? 200;

    if (stream) {
      this.attachStream(stream, options);
    }
  }

  /**
   * Attach or re-attach a MediaStream to the analyser.
   */
  public attachStream(stream: MediaStream, options: AudioAnalyserOptions = {}): void {
    if (this.isDestroyed) return;
    this.cleanupNodes();

    this.attachedStream = stream;

    if (typeof window === 'undefined') return;

    // Wait for audio tracks if the stream initially arrived video-only (e.g. camera before mic)
    const audioTracks =
      typeof stream.getAudioTracks === 'function' ? stream.getAudioTracks() : null;

    if (typeof stream.addEventListener === 'function') {
      const onTrackAdded = (evt: Event) => {
        const track = (evt as MediaStreamTrackEvent).track;
        if (!track || track.kind === 'audio') {
          if (!this.sourceNode && this.attachedStream === stream && !this.isDestroyed) {
            this.attachStream(stream, options);
          }
        }
      };
      stream.addEventListener('addtrack', onTrackAdded);
      this.streamCleanups.push(() => {
        try {
          stream.removeEventListener('addtrack', onTrackAdded);
        } catch {}
      });
    }

    if (audioTracks && audioTracks.length === 0) {
      return;
    }

    if (audioTracks) {
      audioTracks.forEach((track) => {
        if (typeof track.addEventListener === 'function') {
          const onUnmute = () => {
            if (this.ctx && this.ctx.state !== 'running' && this.ctx.state !== 'closed') {
              this.ctx.resume?.().catch(() => {});
            }
          };
          track.addEventListener('unmute', onUnmute);
          this.streamCleanups.push(() => {
            try {
              track.removeEventListener('unmute', onUnmute);
            } catch {}
          });
        }
      });
    }

    try {
      if (options.audioContext) {
        this.ctx = options.audioContext;
        this.isExternalCtx = true;
        this.isSharedCtx = false;
      } else if (!this.ctx || this.ctx.state === 'closed') {
        const shared = getSharedAudioContext();
        if (shared) {
          this.ctx = shared;
          this.isExternalCtx = false;
          this.isSharedCtx = true;
        }
      }

      if (!this.ctx) return;

      if (this.ctx.state !== 'running' && this.ctx.state !== 'closed') {
        this.ctx.resume?.().catch(() => {});
      }

      const fftSize = options.fftSize ?? 512;
      this.analyserNode = this.ctx.createAnalyser();
      this.analyserNode.fftSize = fftSize;
      this.analyserNode.smoothingTimeConstant = options.smoothingTimeConstant ?? 0.3;

      this.timeData = new Uint8Array(this.analyserNode.fftSize);
      this.floatData = new Float32Array(this.analyserNode.fftSize);

      this.sourceNode = this.ctx.createMediaStreamSource(stream);
      // Connect to analyser ONLY (do NOT connect to destination to avoid mic feedback!)
      this.sourceNode.connect(this.analyserNode);

      this.startLoop();
    } catch (err) {
      console.warn('[AudioAnalyser] Failed to initialize Web Audio nodes:', err);
    }
  }

  /**
   * Computes the current instantaneous Root Mean Square (RMS) of the audio signal.
   */
  public computeRms(): number {
    if (!this.analyserNode) return 0;

    let sumSquares = 0;

    // Use float data if available for maximum precision
    if (this.floatData) {
      (this.analyserNode as unknown as { getFloatTimeDomainData: (arr: Float32Array) => void }).getFloatTimeDomainData(this.floatData);
      const len = this.floatData.length;
      for (let i = 0; i < len; i++) {
        const val = this.floatData[i];
        sumSquares += val * val;
      }
      return Math.sqrt(sumSquares / len);
    }

    // Fallback to byte data (normalized around 128)
    if (this.timeData) {
      (this.analyserNode as unknown as { getByteTimeDomainData: (arr: Uint8Array) => void }).getByteTimeDomainData(this.timeData);
      const len = this.timeData.length;
      for (let i = 0; i < len; i++) {
        const norm = (this.timeData[i] - 128) / 128;
        sumSquares += norm * norm;
      }
      return Math.sqrt(sumSquares / len);
    }

    return 0;
  }

  /**
   * Internal animation / polling tick.
   */
  private tick = (): void => {
    if (this.isDestroyed || !this.analyserNode) return;

    const rawRms = this.computeRms();
    this.currentRms = rawRms;

    // Scale RMS into a 0.0 - 1.0 UI friendly range (0.25 RMS represents loud speech)
    this.currentLevel = Math.min(1, Math.max(0, rawRms / 0.25));

    const now = Date.now();
    if (rawRms >= this.threshold) {
      this.lastSpeakingTime = now;
    }

    const isSpeaking = (now - this.lastSpeakingTime) < this.holdTimeMs;
    this.currentlySpeaking = isSpeaking;

    const result: AudioAnalysisResult = {
      rms: this.currentRms,
      level: this.currentLevel,
      isSpeaking: this.currentlySpeaking,
    };

    this.notifyListeners(result);

    // Schedule next frame
    if (typeof window !== 'undefined' && window.requestAnimationFrame) {
      this.animFrameId = window.requestAnimationFrame(this.tick);
    }
  };

  /**
   * Start the measurement update loop.
   */
  public startLoop(): void {
    if (this.animFrameId !== null || this.timerId !== null) return;

    if (typeof window !== 'undefined' && window.requestAnimationFrame) {
      this.animFrameId = window.requestAnimationFrame(this.tick);
    } else {
      // Fallback for headless / test environments
      this.timerId = setInterval(this.tick, 50);
    }
  }

  /**
   * Stop the measurement update loop.
   */
  public stopLoop(): void {
    if (this.animFrameId !== null && typeof window !== 'undefined') {
      window.cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  /**
   * Subscribe to real-time analysis updates.
   * Returns an unsubscribe function.
   */
  public subscribe(listener: AudioAnalysisListener): () => void {
    this.listeners.add(listener);
    // Emit initial state immediately
    listener({
      rms: this.currentRms,
      level: this.currentLevel,
      isSpeaking: this.currentlySpeaking,
    });

    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(result: AudioAnalysisResult): void {
    this.listeners.forEach((listener) => {
      try {
        listener(result);
      } catch (err) {
        console.error('[AudioAnalyser] Error in listener callback:', err);
      }
    });
  }

  /**
   * Get current RMS level.
   */
  public getRms(): number {
    return this.currentRms;
  }

  /**
   * Get normalized audio level (0.0 to 1.0).
   */
  public getLevel(): number {
    return this.currentLevel;
  }

  /**
   * Get current speaking state.
   */
  public getIsSpeaking(): boolean {
    return this.currentlySpeaking;
  }

  /**
   * Update speaking threshold.
   */
  public setThreshold(threshold: number): void {
    this.threshold = threshold;
  }

  public getThreshold(): number {
    return this.threshold;
  }

  /**
   * Clean up Web Audio nodes.
   */
  private cleanupNodes(): void {
    this.stopLoop();

    while (this.streamCleanups.length > 0) {
      const cleanup = this.streamCleanups.pop();
      try {
        cleanup?.();
      } catch {}
    }

    if (this.sourceNode) {
      try {
        this.sourceNode.disconnect();
      } catch {}
      this.sourceNode = null;
    }

    if (this.analyserNode) {
      try {
        this.analyserNode.disconnect();
      } catch {}
      this.analyserNode = null;
    }

    if (this.ctx) {
      if (!this.isExternalCtx && !this.isSharedCtx) {
        try {
          if (this.ctx.state !== 'closed') {
            this.ctx.close().catch(() => {});
          }
        } catch {}
      }
      this.ctx = null;
      this.isExternalCtx = false;
      this.isSharedCtx = false;
    }

    this.currentRms = 0;
    this.currentLevel = 0;
    this.currentlySpeaking = false;
  }

  /**
   * Destroy the analyser instance completely.
   */
  public destroy(): void {
    this.isDestroyed = true;
    this.cleanupNodes();
    this.listeners.clear();
  }
}
