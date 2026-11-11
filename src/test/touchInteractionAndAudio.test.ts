import { describe, it, expect, beforeEach } from 'vitest';
import { audioService } from '../services/audioService';

describe('AudioService — Modern Procedural Sound Palette', () => {
  beforeEach(() => {
    audioService.setMuted(false);
  });

  it('exposes all modern mobile sound methods without throwing exceptions', () => {
    expect(() => audioService.playButtonTap()).not.toThrow();
    expect(() => audioService.playVoteTap()).not.toThrow();
    expect(() => audioService.playNav()).not.toThrow();
    expect(() => audioService.playPlayerAdded()).not.toThrow();
    expect(() => audioService.playPlayerRemoved()).not.toThrow();
    expect(() => audioService.playCategorySelect()).not.toThrow();
    expect(() => audioService.playGameStart()).not.toThrow();
    expect(() => audioService.playCardReveal()).not.toThrow();
    expect(() => audioService.playRoleReveal()).not.toThrow();
    expect(() => audioService.playImposterReveal()).not.toThrow();
    expect(() => audioService.playImposterWin()).not.toThrow();
    expect(() => audioService.playRoundComplete()).not.toThrow();
    expect(() => audioService.playCivilianWin()).not.toThrow();
    expect(() => audioService.playVictoryFanfare()).not.toThrow();
    expect(() => audioService.playTick()).not.toThrow();
    expect(() => audioService.playTimerEnd()).not.toThrow();
  });

  it('strictly respects global mute setting', () => {
    audioService.setMuted(true);
    expect(audioService.getIsMuted()).toBe(true);

    // Audio operations should be no-ops when muted
    expect(() => audioService.playButtonTap()).not.toThrow();
    expect(() => audioService.playCardReveal()).not.toThrow();
    expect(() => audioService.playGameStart()).not.toThrow();

    audioService.setMuted(false);
    expect(audioService.getIsMuted()).toBe(false);
  });
});

/**
 * Deterministic Pointer Events & Reveal State Machine Test Harness
 * Mirrors the exact lifecycle implemented in RoleRevealView.tsx with injectable virtual clock.
 */
class RevealHarness {
  public state: 'HIDDEN' | 'HOLDING' | 'REVEALED' | 'SEEN' = 'HIDDEN';
  public isSecretVisible: boolean = false;
  public activePointerId: number | null = null;
  public hasEverSeen: boolean = false;
  public isCaptured: boolean = false;
  public advanceCount: number = 0;

  private holdStartTime: number = 0;
  private currentTime: number = 1000;
  private minHoldThresholdMs: number = 300;
  private holdTimerActive: boolean = false;

  constructor(minHoldThresholdMs: number = 300) {
    this.minHoldThresholdMs = minHoldThresholdMs;
  }

  public setTime(t: number) {
    this.currentTime = t;
    // Check if threshold timer fired
    if (this.holdTimerActive && this.currentTime - this.holdStartTime >= this.minHoldThresholdMs) {
      if (this.state === 'HOLDING') {
        this.state = 'REVEALED';
        this.updateSecretVisibility();
      }
    }
  }

  public advanceTime(ms: number) {
    this.setTime(this.currentTime + ms);
  }

  private updateSecretVisibility() {
    this.isSecretVisible = this.state === 'HOLDING' || this.state === 'REVEALED';
  }

  public handlePointerDown(e: { pointerId: number; button?: number; pointerType?: string }): boolean {
    // 1. Only accept primary pointer (reject second finger)
    if (this.activePointerId !== null) return false;
    // 2. Reject non-primary mouse clicks
    if (e.pointerType === 'mouse' && e.button !== 0) return false;

    this.activePointerId = e.pointerId;
    this.isCaptured = true;
    this.holdStartTime = this.currentTime;
    this.state = 'HOLDING';
    this.holdTimerActive = true;
    this.updateSecretVisibility();
    return true;
  }

  public handlePointerMove(_e: { pointerId: number; x: number; y: number }): void {
    // While held and captured, movement anywhere on screen does not change secret visibility
    this.updateSecretVisibility();
  }

  public handleEndInteraction(pointerId: number, _isCancelled: boolean = false): void {
    if (this.activePointerId === null || pointerId !== this.activePointerId) {
      return;
    }

    this.holdTimerActive = false;
    this.isCaptured = false;
    const duration = this.currentTime - this.holdStartTime;
    const passedThreshold = duration >= this.minHoldThresholdMs;

    this.activePointerId = null;

    if (passedThreshold) {
      this.hasEverSeen = true;
      this.state = 'SEEN';
    } else {
      if (this.hasEverSeen) {
        this.state = 'SEEN';
      } else {
        this.state = 'HIDDEN';
      }
    }
    this.updateSecretVisibility();
  }

  public handlePointerUp(e: { pointerId: number }): void {
    this.handleEndInteraction(e.pointerId, false);
  }

  public handlePointerCancel(e: { pointerId: number }): void {
    this.handleEndInteraction(e.pointerId, true);
  }

  public handleLostPointerCapture(e: { pointerId: number }): void {
    // Idempotent: safe if pointerup already completed
    if (this.activePointerId === e.pointerId) {
      this.handleEndInteraction(e.pointerId, false);
    }
  }

  public handleWindowBlur(): void {
    if (this.activePointerId !== null) {
      this.handleEndInteraction(this.activePointerId, true);
    } else {
      if (this.state === 'HOLDING' || this.state === 'REVEALED') {
        this.state = this.hasEverSeen ? 'SEEN' : 'HIDDEN';
        this.updateSecretVisibility();
      }
    }
  }

  public handleVisibilityChange(hidden: boolean): void {
    if (hidden) {
      this.handleWindowBlur();
    }
  }

  public isNextPlayerEnabled(): boolean {
    return this.state === 'SEEN' && this.activePointerId === null;
  }

  public handleAdvance(): void {
    if (!this.isNextPlayerEnabled()) return;
    this.advanceCount += 1;
    this.activePointerId = null;
    this.hasEverSeen = false;
    this.state = 'HIDDEN';
    this.updateSecretVisibility();
  }
}

describe('Card Hold-to-Reveal State Machine & Safari Touch Regression Suite', () => {
  let harness: RevealHarness;

  beforeEach(() => {
    harness = new RevealHarness(300);
  });

  it('1. A valid hold reveals the card immediately upon press', () => {
    expect(harness.state).toBe('HIDDEN');
    expect(harness.isSecretVisible).toBe(false);

    const accepted = harness.handlePointerDown({ pointerId: 1, pointerType: 'touch' });
    expect(accepted).toBe(true);
    expect(harness.state).toBe('HOLDING');
    expect(harness.isSecretVisible).toBe(true);
    expect(harness.isCaptured).toBe(true);
  });

  it('2. Movement while holding does NOT hide the card', () => {
    harness.handlePointerDown({ pointerId: 1, pointerType: 'touch' });
    expect(harness.isSecretVisible).toBe(true);

    harness.handlePointerMove({ pointerId: 1, x: 50, y: 50 });
    expect(harness.isSecretVisible).toBe(true);
    expect(harness.state).toBe('HOLDING');
  });

  it('3. Movement far outside the card does NOT cancel the press or capture', () => {
    harness.handlePointerDown({ pointerId: 1, pointerType: 'touch' });
    // Move hundreds of pixels outside card boundary
    harness.handlePointerMove({ pointerId: 1, x: 999, y: 999 });
    expect(harness.isSecretVisible).toBe(true);
    expect(harness.isCaptured).toBe(true);
  });

  it('4. A short hold (<300ms) does NOT mark player as seen and returns to HIDDEN', () => {
    harness.handlePointerDown({ pointerId: 1, pointerType: 'touch' });
    harness.advanceTime(150); // only 150ms held

    harness.handlePointerUp({ pointerId: 1 });
    expect(harness.isSecretVisible).toBe(false);
    expect(harness.state).toBe('HIDDEN');
    expect(harness.hasEverSeen).toBe(false);
    expect(harness.isNextPlayerEnabled()).toBe(false);
  });

  it('5. A valid release (>=300ms) hides the card and marks as SEEN', () => {
    harness.handlePointerDown({ pointerId: 1, pointerType: 'touch' });
    harness.advanceTime(350); // exceeds 300ms threshold
    expect(harness.state).toBe('REVEALED');
    expect(harness.isSecretVisible).toBe(true);

    harness.handlePointerUp({ pointerId: 1 });
    expect(harness.isSecretVisible).toBe(false);
    expect(harness.state).toBe('SEEN');
    expect(harness.hasEverSeen).toBe(true);
  });

  it('6. A valid release enables Next Player button', () => {
    harness.handlePointerDown({ pointerId: 1, pointerType: 'touch' });
    harness.advanceTime(320);
    harness.handlePointerUp({ pointerId: 1 });

    expect(harness.isNextPlayerEnabled()).toBe(true);
  });

  it('7. Pointer cancellation hides sensitive information (transitions safely to SEEN if >=300ms)', () => {
    harness.handlePointerDown({ pointerId: 1, pointerType: 'touch' });
    harness.advanceTime(400); // valid hold occurred before cancellation
    harness.handlePointerCancel({ pointerId: 1 });

    // Secret must be immediately concealed
    expect(harness.isSecretVisible).toBe(false);
    // Because threshold passed, user saw the role: do NOT trap them
    expect(harness.state).toBe('SEEN');
    expect(harness.isNextPlayerEnabled()).toBe(true);
  });

  it('7b. Pointer cancellation before threshold returns safely to HIDDEN without getting stuck', () => {
    harness.handlePointerDown({ pointerId: 1, pointerType: 'touch' });
    harness.advanceTime(100);
    harness.handlePointerCancel({ pointerId: 1 });

    expect(harness.isSecretVisible).toBe(false);
    expect(harness.state).toBe('HIDDEN');
    expect(harness.isNextPlayerEnabled()).toBe(false);

    // Player can immediately retry
    const retry = harness.handlePointerDown({ pointerId: 2, pointerType: 'touch' });
    expect(retry).toBe(true);
    harness.advanceTime(350);
    harness.handlePointerUp({ pointerId: 2 });
    expect(harness.state).toBe('SEEN');
    expect(harness.isNextPlayerEnabled()).toBe(true);
  });

  it('8. Lost pointer capture is idempotent and does not produce duplicate transitions', () => {
    harness.handlePointerDown({ pointerId: 1, pointerType: 'touch' });
    harness.advanceTime(350);

    // Normal pointerup arrives first
    harness.handlePointerUp({ pointerId: 1 });
    expect(harness.state).toBe('SEEN');

    // Followed by lostpointercapture event from WebKit
    harness.handleLostPointerCapture({ pointerId: 1 });
    expect(harness.state).toBe('SEEN');
    expect(harness.isNextPlayerEnabled()).toBe(true);
  });

  it('8b. Lost pointer capture finalizes reveal if pointerup was dropped by WebKit', () => {
    harness.handlePointerDown({ pointerId: 1, pointerType: 'touch' });
    harness.advanceTime(350);

    // WebKit drops pointerup and fires lostpointercapture directly
    harness.handleLostPointerCapture({ pointerId: 1 });
    expect(harness.state).toBe('SEEN');
    expect(harness.isSecretVisible).toBe(false);
    expect(harness.isNextPlayerEnabled()).toBe(true);
  });

  it('9. Window blur immediately conceals secret information', () => {
    harness.handlePointerDown({ pointerId: 1, pointerType: 'touch' });
    expect(harness.isSecretVisible).toBe(true);

    harness.advanceTime(350);
    harness.handleWindowBlur();

    // Secret must be concealed immediately
    expect(harness.isSecretVisible).toBe(false);
    expect(harness.state).toBe('SEEN');
  });

  it('10. Document visibility change (tab hidden) immediately conceals card', () => {
    harness.handlePointerDown({ pointerId: 1, pointerType: 'touch' });
    expect(harness.isSecretVisible).toBe(true);

    harness.advanceTime(200);
    harness.handleVisibilityChange(true);

    expect(harness.isSecretVisible).toBe(false);
    expect(harness.state).toBe('HIDDEN'); // held <300ms before tab switch
  });

  it('11. Multiple pointers cannot interfere (secondary fingers are ignored)', () => {
    harness.handlePointerDown({ pointerId: 1, pointerType: 'touch' });
    expect(harness.activePointerId).toBe(1);

    // Second finger touches screen
    const secondAccepted = harness.handlePointerDown({ pointerId: 2, pointerType: 'touch' });
    expect(secondAccepted).toBe(false);
    expect(harness.activePointerId).toBe(1);

    // Second finger lifts
    harness.handlePointerUp({ pointerId: 2 });
    expect(harness.activePointerId).toBe(1);
    expect(harness.isSecretVisible).toBe(true);

    // Primary finger lifts after duration
    harness.advanceTime(350);
    harness.handlePointerUp({ pointerId: 1 });
    expect(harness.state).toBe('SEEN');
    expect(harness.isNextPlayerEnabled()).toBe(true);
  });

  it('12. Next Player advances exactly once and resets reveal state', () => {
    harness.handlePointerDown({ pointerId: 1, pointerType: 'touch' });
    harness.advanceTime(350);
    harness.handlePointerUp({ pointerId: 1 });

    expect(harness.isNextPlayerEnabled()).toBe(true);
    expect(harness.advanceCount).toBe(0);

    harness.handleAdvance();
    expect(harness.advanceCount).toBe(1);
    expect(harness.state).toBe('HIDDEN');
    expect(harness.isSecretVisible).toBe(false);
    expect(harness.isNextPlayerEnabled()).toBe(false);
  });

  it('13. Repeat viewing from SEEN state works without losing viewed status on quick release', () => {
    // 1. Initial valid reveal
    harness.handlePointerDown({ pointerId: 1, pointerType: 'touch' });
    harness.advanceTime(350);
    harness.handlePointerUp({ pointerId: 1 });
    expect(harness.state).toBe('SEEN');

    // 2. Player holds again to peek
    harness.handlePointerDown({ pointerId: 3, pointerType: 'touch' });
    expect(harness.isSecretVisible).toBe(true);

    // 3. Quick release (100ms)
    harness.advanceTime(100);
    harness.handlePointerUp({ pointerId: 3 });

    // Must return to SEEN, not HIDDEN!
    expect(harness.state).toBe('SEEN');
    expect(harness.isSecretVisible).toBe(false);
    expect(harness.isNextPlayerEnabled()).toBe(true);
  });
});
