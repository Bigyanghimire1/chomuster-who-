/**
 * AudioService — Clean, Soft, Modern Procedural Sound Effects for Chomu Who?
 * Uses Web Audio API with carefully shaped sine/triangle oscillators and gentle envelopes.
 * Completely eliminates harsh arcade sounds, loud buzzes, and square/sawtooth beeps.
 */
class AudioService {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isUnlocked: boolean = false;

  constructor() {
    // Lazy unlock on first genuine user interaction
    if (typeof window !== 'undefined') {
      const unlock = () => {
        if (!this.isUnlocked) {
          const ctx = this.getContext();
          if (ctx && ctx.state === 'suspended') {
            ctx.resume().catch(() => {});
          }
          this.isUnlocked = true;
        }
        window.removeEventListener('pointerdown', unlock);
        window.removeEventListener('keydown', unlock);
      };
      window.addEventListener('pointerdown', unlock, { passive: true });
      window.addEventListener('keydown', unlock, { passive: true });
    }
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Helper: Schedule a clean oscillator tone with gentle attack and decay envelopes.
   */
  private playTone(
    type: OscillatorType,
    freqStart: number,
    freqEnd: number,
    gainPeak: number,
    durationSec: number,
    delaySec: number = 0
  ): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const startTime = ctx.currentTime + delaySec;
      const endTime = startTime + durationSec;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freqStart, startTime);
      if (freqEnd !== freqStart) {
        osc.frequency.exponentialRampToValueAtTime(Math.max(freqEnd, 20), endTime);
      }

      // Smooth attack and exponential decay to prevent clicks
      const attackTime = Math.min(0.012, durationSec * 0.15);
      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(gainPeak, startTime + attackTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, endTime);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(endTime);

      // Disconnect nodes after sound ends to prevent memory accumulation
      osc.onended = () => {
        try {
          osc.disconnect();
          gain.disconnect();
        } catch {
          // Ignore
        }
      };
    } catch {
      // AudioContext unavailable or suspended
    }
  }

  /**
   * 1. Button Tap
   * Soft, short tactile click. Clean and understated (~50ms).
   */
  public playButtonTap(): void {
    this.playTone('sine', 750, 320, 0.04, 0.055);
  }

  /**
   * Backward compatibility alias for playButtonTap
   */
  public playVoteTap(): void {
    this.playButtonTap();
  }

  /**
   * 2. Navigation
   * Subtle interface transition sound. Soft and unobtrusive.
   */
  public playNav(): void {
    this.playTone('sine', 480, 620, 0.035, 0.08);
  }

  /**
   * 3. Player Added
   * Gentle, cheerful two-tone confirmation chime.
   */
  public playPlayerAdded(): void {
    // C5 (523Hz) -> E5 (659Hz)
    this.playTone('sine', 523.25, 523.25, 0.045, 0.07, 0);
    this.playTone('triangle', 659.25, 659.25, 0.05, 0.11, 0.05);
  }

  /**
   * 4. Player Removed
   * Very subtle, soft downward release tone.
   */
  public playPlayerRemoved(): void {
    this.playTone('sine', 440, 320, 0.035, 0.08);
  }

  /**
   * 5. Category Selected
   * Soft, crisp selection tick.
   */
  public playCategorySelect(): void {
    this.playTone('sine', 1150, 900, 0.035, 0.04);
  }

  /**
   * 6. Game Started
   * Short, polished transition chord (G4 -> C5 -> E5).
   */
  public playGameStart(): void {
    this.playTone('sine', 392.0, 392.0, 0.045, 0.12, 0);
    this.playTone('sine', 523.25, 523.25, 0.055, 0.16, 0.06);
    this.playTone('triangle', 659.25, 659.25, 0.06, 0.24, 0.12);
  }

  /**
   * 7. Card Reveal
   * Satisfying, subtle confidential card reveal shimmer (D5 + A5).
   */
  public playCardReveal(): void {
    this.playTone('sine', 587.33, 659.25, 0.045, 0.22, 0);
    this.playTone('triangle', 880.0, 987.77, 0.035, 0.24, 0.02);
  }

  /**
   * Backward compatibility alias for playCardReveal
   */
  public playRoleReveal(): void {
    this.playCardReveal();
  }

  /**
   * 8. Imposter Revealed
   * Distinctive but restrained suspense/identity-reveal interval.
   */
  public playImposterReveal(): void {
    this.playTone('triangle', 311.13, 311.13, 0.045, 0.15, 0);
    this.playTone('sine', 233.08, 233.08, 0.05, 0.22, 0.08);
    this.playTone('triangle', 466.16, 466.16, 0.05, 0.28, 0.14);
  }

  /**
   * Backward compatibility alias for playImposterReveal
   */
  public playImposterWin(): void {
    this.playImposterReveal();
  }

  /**
   * 9. Round Completion / Victory Fanfare
   * Short, bright positive completion chord (C5 -> E5 -> G5 -> C6).
   */
  public playRoundComplete(): void {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      this.playTone('sine', freq, freq, 0.05, 0.22, idx * 0.06);
    });
  }

  /**
   * Backward compatibility aliases
   */
  public playVictoryFanfare(): void {
    this.playRoundComplete();
  }

  public playCivilianWin(): void {
    this.playRoundComplete();
  }

  /**
   * Subtle timer tick
   */
  public playTick(): void {
    this.playTone('sine', 720, 600, 0.025, 0.03);
  }

  /**
   * Gentle timer completion chime
   */
  public playTimerEnd(): void {
    this.playTone('sine', 587.33, 587.33, 0.045, 0.12, 0);
    this.playTone('triangle', 440.0, 440.0, 0.045, 0.18, 0.08);
  }
}

export const audioService = new AudioService();
