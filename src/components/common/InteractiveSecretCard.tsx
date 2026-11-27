import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Eye, EyeOff, Hand, RotateCw } from 'lucide-react';
import { SecretCardBack } from '../illustrations/SecretCardArtwork';
import { audioService } from '../../services/audioService';

export interface InteractiveSecretCardProps {
  isChomu: boolean;
  categoryName: string;
  secretWord?: string;
  hint?: string;
  playerName?: string;
  onFirstReveal?: () => void;
}

const DRAG_THRESHOLD_PX = 8;
const HOLD_THRESHOLD_MS = 260;

function dampOffset(delta: number): number {
  const max = 110;
  const abs = Math.abs(delta);
  const damped = abs <= 60 ? abs * 0.85 : 51 + (abs - 60) * 0.35;
  return Math.sign(delta) * Math.min(max, damped);
}

/**
 * InteractiveSecretCard — Physical Neo-Brutalist secret card with:
 * 1. Elastic drag (tracks pointer in X/Y with slight tilt, springs back on release without revealing)
 * 2. 3D card flip (intentional tap or Flip button)
 * 3. Hold-to-reveal (press & hold >260ms reveals; release conceals)
 */
export const InteractiveSecretCard: React.FC<InteractiveSecretCardProps> = ({
  isChomu,
  categoryName,
  secretWord = '',
  hint = '',
  playerName,
  onFirstReveal,
}) => {
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isHolding, setIsHolding] = useState<boolean>(false);
  const [isHoldRevealed, setIsHoldRevealed] = useState<boolean>(false);
  const [isTapFlipped, setIsTapFlipped] = useState<boolean>(false);

  const startPosRef = useRef<{ x: number; y: number; time: number; pointerId: number } | null>(null);
  const movedBeyondThresholdRef = useRef<boolean>(false);
  const holdTimerRef = useRef<number | null>(null);
  const hasReportedRevealRef = useRef<boolean>(false);

  const isRevealed = isHoldRevealed || isTapFlipped;

  const markRevealed = useCallback(() => {
    if (!hasReportedRevealRef.current) {
      hasReportedRevealRef.current = true;
      onFirstReveal?.();
    }
  }, [onFirstReveal]);

  const clearHoldTimer = useCallback(() => {
    if (holdTimerRef.current !== null) {
      window.clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  }, []);

  // Reset card state when switching player/word in Pass & Play
  useEffect(() => {
    clearHoldTimer();
    startPosRef.current = null;
    movedBeyondThresholdRef.current = false;
    hasReportedRevealRef.current = false;
    setDragOffset({ x: 0, y: 0 });
    setIsDragging(false);
    setIsHolding(false);
    setIsHoldRevealed(false);
    setIsTapFlipped(false);
  }, [playerName, secretWord, isChomu, clearHoldTimer]);

  // Safety conceal on tab switch / blur
  useEffect(() => {
    const conceal = () => {
      clearHoldTimer();
      setIsHolding(false);
      setIsHoldRevealed(false);
      setIsDragging(false);
      setDragOffset({ x: 0, y: 0 });
    };
    window.addEventListener('blur', conceal);
    document.addEventListener('visibilitychange', conceal);
    return () => {
      window.removeEventListener('blur', conceal);
      document.removeEventListener('visibilitychange', conceal);
      clearHoldTimer();
    };
  }, [clearHoldTimer]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    e.preventDefault();

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}

    startPosRef.current = {
      x: e.clientX,
      y: e.clientY,
      time: Date.now(),
      pointerId: e.pointerId,
    };
    movedBeyondThresholdRef.current = false;
    setIsDragging(true);

    if (!isTapFlipped) {
      setIsHolding(true);
      clearHoldTimer();
      holdTimerRef.current = window.setTimeout(() => {
        if (!movedBeyondThresholdRef.current) {
          setIsHoldRevealed(true);
          setIsHolding(false);
          audioService.playCardReveal();
          markRevealed();
        }
      }, HOLD_THRESHOLD_MS);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const start = startPosRef.current;
    if (!start || e.pointerId !== start.pointerId) return;

    const rawDx = e.clientX - start.x;
    const rawDy = e.clientY - start.y;
    const dist = Math.hypot(rawDx, rawDy);

    if (dist >= DRAG_THRESHOLD_PX && !movedBeyondThresholdRef.current) {
      movedBeyondThresholdRef.current = true;
      // Dragging cancels hold-to-reveal so dragging NEVER accidentally exposes secret
      clearHoldTimer();
      setIsHolding(false);
      setIsHoldRevealed(false);
    }

    if (movedBeyondThresholdRef.current) {
      setDragOffset({
        x: dampOffset(rawDx),
        y: dampOffset(rawDy),
      });
    }
  };

  const finishPointer = (e: React.PointerEvent<HTMLDivElement>, cancelled: boolean) => {
    const start = startPosRef.current;
    if (!start || e.pointerId !== start.pointerId) return;

    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {}

    clearHoldTimer();
    const duration = Date.now() - start.time;
    const wasDrag = movedBeyondThresholdRef.current;
    startPosRef.current = null;

    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
    setIsHolding(false);

    if (isHoldRevealed) {
      setIsHoldRevealed(false);
      return;
    }

    // Intentional short tap (< 8px movement, < 260ms) triggers 3D flip
    if (!cancelled && !wasDrag && duration < HOLD_THRESHOLD_MS) {
      setIsTapFlipped((prev) => {
        const next = !prev;
        if (next) {
          audioService.playCardReveal();
          markRevealed();
        } else {
          audioService.playButtonTap();
        }
        return next;
      });
    }
  };

  const handleToggleButton = () => {
    setIsHoldRevealed(false);
    setIsTapFlipped((prev) => {
      const next = !prev;
      if (next) {
        audioService.playCardReveal();
        markRevealed();
      } else {
        audioService.playButtonTap();
      }
      return next;
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleToggleButton();
    }
  };

  const tiltDeg = dragOffset.x * 0.08;

  return (
    <div className="w-full max-w-[290px] mx-auto flex flex-col items-center gap-3.5 select-none">
      {/* Elastic Draggable Outer Wrapper */}
      <div
        role="button"
        tabIndex={0}
        aria-label={isRevealed ? 'Hide secret role card' : 'Tap to flip or hold to reveal secret card'}
        aria-pressed={isRevealed}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={(e) => finishPointer(e, false)}
        onPointerCancel={(e) => finishPointer(e, true)}
        onKeyDown={handleKeyDown}
        style={{
          transform: `translate3d(${dragOffset.x}px, ${dragOffset.y}px, 0) rotate(${tiltDeg}deg)`,
          transition: isDragging
            ? 'none'
            : 'transform 420ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
        className="w-full aspect-[3/4] perspective-1000 touch-none cursor-grab active:cursor-grabbing focus:outline-none focus-visible:ring-4 focus-visible:ring-[#050505] rounded-3xl"
      >
        {/* 3D Flipping Inner Card */}
        <div
          className={`relative w-full h-full preserve-3d transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isRevealed ? 'rotate-y-180' : ''
          }`}
        >
          {/* FRONT (CONCEALED / BACK OF DOSSIER) */}
          <div className="absolute inset-0 backface-hidden rounded-3xl border-[3px] border-[#050505] bg-white shadow-[0_8px_0_#050505] overflow-hidden flex flex-col items-center justify-between p-5 text-[#050505]">
            <div className="w-full flex items-center justify-between text-[11px] font-extrabold uppercase tracking-wider">
              <span className="px-2.5 py-0.5 rounded-full bg-[#FFDF00] border-2 border-[#050505]">
                Top Secret
              </span>
              <span className="text-[#26282E]">Drag · Hold · Tap</span>
            </div>

            <div className="flex-1 flex items-center justify-center w-full py-2">
              <SecretCardBack isHolding={isHolding} />
            </div>

            <div className="w-full space-y-2">
              {isHolding && (
                <div className="w-full h-2.5 rounded-full bg-[#F5F6F8] overflow-hidden border-2 border-[#050505]">
                  <div className="h-full bg-[#64E987] animate-[fadeIn_260ms_linear_forwards] w-full" />
                </div>
              )}
              <div className="w-full py-2.5 px-3 rounded-xl bg-[#FFDF00] text-[#050505] border-2 border-[#050505] shadow-[0_3px_0_#050505] text-xs font-extrabold flex items-center justify-center gap-2">
                <Hand className="w-4 h-4" strokeWidth={2.4} />
                <span>{isHolding ? 'Keep holding…' : 'Hold or Tap to Flip'}</span>
              </div>
            </div>
          </div>

          {/* BACK (REVEALED SECRET ROLE — rotated 180deg so text reads cleanly!) */}
          <div
            className={`absolute inset-0 backface-hidden rotate-y-180 rounded-3xl border-[3px] border-[#050505] shadow-[0_8px_0_#050505] overflow-hidden flex flex-col items-center justify-between p-5 text-center ${
              isChomu ? 'bg-[#FF5D73] text-[#050505]' : 'bg-white text-[#050505]'
            }`}
          >
            <div className="w-full flex items-center justify-between">
              <span
                className={`px-3 py-1 rounded-full border-2 border-[#050505] text-xs font-extrabold uppercase tracking-wide ${
                  isChomu ? 'bg-[#050505] text-white' : 'bg-[#64E987] text-[#050505]'
                }`}
              >
                {isChomu ? 'You are the Chomu' : 'Civilian'}
              </span>
              <span className="text-xs font-extrabold opacity-75">
                {categoryName}
              </span>
            </div>

            <div className="my-auto w-full space-y-3 py-2">
              {isChomu ? (
                <>
                  <h2 className="text-3xl font-extrabold tracking-[-0.03em] leading-none">
                    Blend In!
                  </h2>
                  {hint ? (
                    <div className="p-3.5 rounded-2xl bg-white border-[2.5px] border-[#050505] shadow-[0_4px_0_#050505]">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#52555E] block">
                        Your Chomu Hint
                      </span>
                      <span className="text-2xl font-extrabold text-[#050505] block mt-0.5">
                        &ldquo;{hint}&rdquo;
                      </span>
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-2xl bg-white border-[2.5px] border-[#050505] shadow-[0_4px_0_#050505]">
                      <span className="text-xs font-bold text-[#050505]">
                        No hint mode — listen carefully and bluff!
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#52555E] block">
                    Secret Word
                  </span>
                  <div className="p-4 rounded-2xl bg-[#FFDF00] border-[2.5px] border-[#050505] shadow-[0_4px_0_#050505]">
                    <span className="text-2xl sm:text-3xl font-extrabold text-[#050505] tracking-[-0.02em] break-words">
                      {secretWord}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-[#26282E]">
                    Give a clever 1-word clue without giving it away.
                  </p>
                </>
              )}
            </div>

            <div className="w-full pt-2 border-t-2 border-[#050505]/20 flex items-center justify-between text-[11px] font-extrabold">
              <span>Keep hidden from others</span>
              <RotateCw className="w-3.5 h-3.5" strokeWidth={2.5} />
            </div>
          </div>
        </div>
      </div>

      {/* Explicit Accessible Flip / Hide Toggle */}
      <button
        type="button"
        onClick={handleToggleButton}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-[#FFF9CC] border-2 border-[#050505] shadow-[0_3px_0_#050505] active:translate-y-[2px] active:shadow-none text-xs font-extrabold text-[#050505] transition-all min-h-[40px]"
      >
        {isRevealed ? (
          <>
            <EyeOff className="w-4 h-4" strokeWidth={2.2} />
            <span>Flip back to hide</span>
          </>
        ) : (
          <>
            <Eye className="w-4 h-4" strokeWidth={2.2} />
            <span>Tap to flip card</span>
          </>
        )}
      </button>
    </div>
  );
};
