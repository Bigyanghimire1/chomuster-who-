import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { Button } from '../common/Button';
import { PlayerAvatar } from '../illustrations/PlayerAvatar';
import { SecretCardBack } from '../illustrations/SecretCardArtwork';
import { audioService } from '../../services/audioService';

export type RevealState = 'HIDDEN' | 'HOLDING' | 'REVEALED' | 'SEEN';

export const RoleRevealView: React.FC = () => {
  const { state, dispatch } = useGame();

  const [revealState, setRevealState] = useState<RevealState>('HIDDEN');

  const cardElementRef = useRef<HTMLDivElement | null>(null);
  const holdStartRef = useRef<number>(0);
  const activePointerIdRef = useRef<number | null>(null);
  const holdTimerRef = useRef<number | null>(null);
  const cleanupWindowListenersRef = useRef<(() => void) | null>(null);
  const hasEverSeenRef = useRef<boolean>(false);

  const minHoldThresholdMs = 300;

  const revealOrder = state.secret?.revealOrder || state.players.map(p => p.id);
  const activePlayerId = revealOrder[state.currentRevealIndex] || state.players[0]?.id;
  const activePlayer = state.players.find(p => p.id === activePlayerId) || {
    id: activePlayerId,
    name: `Player ${state.currentRevealIndex + 1}`,
    score: 0,
    avatar: 'sleuth',
  };

  const roleAssignment = state.secret?.roles[activePlayerId];
  const isImposter = roleAssignment?.isImposter ?? false;
  const secretWord = state.secret?.secretWord ?? '';
  const secretCategory = state.secret?.secretCategory ?? '';
  const imposterHint = state.secret?.imposterHints[activePlayerId] || '';

  const totalPlayers = revealOrder.length;
  const isLastPlayer = state.currentRevealIndex >= totalPlayers - 1;

  const isActivelyHolding = revealState === 'HOLDING' || revealState === 'REVEALED';
  const isSecretVisible = isActivelyHolding;

  const cleanupActiveInteraction = useCallback(() => {
    if (holdTimerRef.current !== null) {
      window.clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    if (cleanupWindowListenersRef.current) {
      cleanupWindowListenersRef.current();
      cleanupWindowListenersRef.current = null;
    }
  }, []);

  const handleEndInteraction = useCallback((pointerId: number, _isCancelled: boolean) => {
    if (activePointerIdRef.current === null || pointerId !== activePointerIdRef.current) {
      return;
    }

    cleanupActiveInteraction();

    if (cardElementRef.current && pointerId >= 0) {
      try {
        if (cardElementRef.current.hasPointerCapture(pointerId)) {
          cardElementRef.current.releasePointerCapture(pointerId);
        }
      } catch {}
    }

    const duration = Date.now() - holdStartRef.current;
    const passedThreshold = duration >= minHoldThresholdMs;
    activePointerIdRef.current = null;

    if (passedThreshold) {
      hasEverSeenRef.current = true;
      setRevealState('SEEN');
    } else if (hasEverSeenRef.current) {
      setRevealState('SEEN');
    } else {
      setRevealState('HIDDEN');
    }
  }, [cleanupActiveInteraction, minHoldThresholdMs]);

  useEffect(() => {
    cleanupActiveInteraction();
    activePointerIdRef.current = null;
    hasEverSeenRef.current = false;
    setRevealState('HIDDEN');
  }, [state.currentRevealIndex, cleanupActiveInteraction]);

  useEffect(() => {
    const handleSafetyConceal = () => {
      if (activePointerIdRef.current !== null) {
        handleEndInteraction(activePointerIdRef.current, true);
      } else {
        setRevealState(current => {
          if (current === 'HOLDING' || current === 'REVEALED') {
            return hasEverSeenRef.current ? 'SEEN' : 'HIDDEN';
          }
          return current;
        });
      }
    };

    window.addEventListener('blur', handleSafetyConceal);
    document.addEventListener('visibilitychange', handleSafetyConceal);

    return () => {
      window.removeEventListener('blur', handleSafetyConceal);
      document.removeEventListener('visibilitychange', handleSafetyConceal);
      cleanupActiveInteraction();
    };
  }, [handleEndInteraction, cleanupActiveInteraction]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (activePointerIdRef.current !== null) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;

    e.preventDefault();
    const pid = e.pointerId;
    activePointerIdRef.current = pid;
    holdStartRef.current = Date.now();

    try {
      e.currentTarget.setPointerCapture(pid);
    } catch {}

    setRevealState('HOLDING');
    cleanupActiveInteraction();

    holdTimerRef.current = window.setTimeout(() => {
      setRevealState(current => (current === 'HOLDING' ? 'REVEALED' : current));
    }, minHoldThresholdMs);

    audioService.playCardReveal();

    const onWindowPointerUp = (we: PointerEvent) => {
      if (we.pointerId === pid) handleEndInteraction(pid, false);
    };
    const onWindowPointerCancel = (we: PointerEvent) => {
      if (we.pointerId === pid) handleEndInteraction(pid, true);
    };

    window.addEventListener('pointerup', onWindowPointerUp);
    window.addEventListener('pointercancel', onWindowPointerCancel);

    cleanupWindowListenersRef.current = () => {
      window.removeEventListener('pointerup', onWindowPointerUp);
      window.removeEventListener('pointercancel', onWindowPointerCancel);
    };
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    handleEndInteraction(e.pointerId, false);
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    handleEndInteraction(e.pointerId, true);
  };

  const handleLostPointerCapture = (e: React.PointerEvent<HTMLDivElement>) => {
    if (activePointerIdRef.current === e.pointerId) {
      handleEndInteraction(e.pointerId, false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      if (activePointerIdRef.current === null && !isActivelyHolding) {
        activePointerIdRef.current = -1;
        holdStartRef.current = Date.now();
        setRevealState('HOLDING');
        cleanupActiveInteraction();

        holdTimerRef.current = window.setTimeout(() => {
          setRevealState(current => (current === 'HOLDING' ? 'REVEALED' : current));
        }, minHoldThresholdMs);

        audioService.playCardReveal();
      }
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      if (activePointerIdRef.current === -1) {
        handleEndInteraction(-1, false);
      }
    }
  };

  const handleAdvance = () => {
    cleanupActiveInteraction();
    activePointerIdRef.current = null;
    hasEverSeenRef.current = false;
    setRevealState('HIDDEN');

    if (isLastPlayer) {
      dispatch({ type: 'START_ROUND' });
    } else {
      dispatch({ type: 'NEXT_REVEAL' });
    }
  };

  return (
    <div className="flex flex-col items-center justify-between flex-1 max-w-md mx-auto w-full px-4 py-6 select-none animate-fade-in">
      {/* Header */}
      <div className="w-full text-center space-y-2">
        <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-chomu-surface border border-white/[0.08] text-xs font-mono text-chomu-secondary tabular-nums">
          Player {state.currentRevealIndex + 1} of {totalPlayers}
        </span>

        <div className="flex items-center justify-center gap-2.5">
          <PlayerAvatar id={activePlayer.avatar} size="sm" />
          <h1 className="text-2xl font-semibold text-chomu-text tracking-[-0.02em]">
            Pass to {activePlayer.name}
          </h1>
        </div>
      </div>

      {/* Interactive Secret Card Surface */}
      <div className="w-full max-w-[280px] my-auto py-4">
        <div
          ref={cardElementRef}
          role="button"
          tabIndex={0}
          aria-label="Press and hold card to reveal secret role"
          aria-pressed={isSecretVisible}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          onLostPointerCapture={handleLostPointerCapture}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          style={{
            touchAction: 'none',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            WebkitTouchCallout: 'none',
          }}
          className={`relative min-h-[360px] rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-[border-color,background-color,transform] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-chomu-purple focus-visible:ring-offset-2 focus-visible:ring-offset-chomu-bg ${
            isSecretVisible
              ? isImposter
                ? 'bg-chomu-elevated border-2 border-chomu-coral'
                : 'bg-chomu-elevated border-2 border-chomu-lime'
              : 'bg-chomu-surface border border-white/[0.1] hover:border-white/[0.18] active:scale-[0.99]'
          }`}
        >
          {isSecretVisible ? (
            <div className="w-full p-6 animate-fade-in space-y-4 pointer-events-none select-none">
              {isImposter ? (
                <>
                  <div className="w-14 h-14 rounded-xl bg-chomu-coral/15 border border-chomu-coral/30 flex items-center justify-center mx-auto">
                    <PlayerAvatar id="shadow" size="md" isImposterStyle={true} />
                  </div>

                  <div>
                    <span className="text-xs font-medium text-chomu-coral block mb-1">
                      You are the
                    </span>
                    <h2 className="text-3xl font-semibold text-chomu-coral tracking-[-0.02em]">
                      Chomu
                    </h2>
                  </div>

                  {imposterHint ? (
                    <div className="bg-chomu-bgSecondary border border-chomu-coral/30 rounded-xl p-4">
                      <span className="text-xs font-medium text-chomu-muted block mb-1">
                        Your hint
                      </span>
                      <p className="text-xl font-semibold text-chomu-text">
                        {imposterHint}
                      </p>
                    </div>
                  ) : (
                    <div className="bg-chomu-bgSecondary border border-white/[0.08] rounded-xl p-3">
                      <span className="text-xs text-chomu-muted">No hint for this round</span>
                    </div>
                  )}

                  <p className="text-xs text-chomu-secondary">
                    Blend in and act like you know the word
                  </p>
                </>
              ) : (
                <>
                  <div className="w-14 h-14 rounded-xl bg-chomu-lime/15 border border-chomu-lime/30 flex items-center justify-center mx-auto">
                    <PlayerAvatar id={activePlayer.avatar} size="md" />
                  </div>

                  <div>
                    <span className="text-xs font-medium text-chomu-lime block mb-1">
                      Civilian
                    </span>
                    <span className="text-xs text-chomu-muted block mb-3">
                      {secretCategory}
                    </span>
                    <span className="text-xs text-chomu-secondary block mb-1">
                      Secret word
                    </span>
                    <h2 className="text-3xl font-semibold text-chomu-text tracking-[-0.02em]">
                      {secretWord}
                    </h2>
                  </div>

                  <p className="text-xs text-chomu-secondary pt-1">
                    Keep your clue subtle
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-3 pointer-events-none select-none">
              <SecretCardBack isHolding={isSecretVisible} />
            </div>
          )}
        </div>
      </div>

      {/* Post-Reveal Actions & Status */}
      <div className="w-full max-w-[280px] space-y-3">
        <div className="h-6 flex items-center justify-center">
          {revealState === 'SEEN' && !isActivelyHolding ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-chomu-lime bg-chomu-lime/10 border border-chomu-lime/25 px-3 py-1 rounded-md animate-fade-in">
              <Check className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span>Viewed</span>
            </span>
          ) : (
            <span className="text-xs text-chomu-muted">
              {isActivelyHolding ? 'Keep holding to view' : 'Press and hold card to reveal'}
            </span>
          )}
        </div>

        <Button
          variant="primary"
          size="lg"
          fullWidth
          disabled={revealState !== 'SEEN' || isActivelyHolding}
          onClick={handleAdvance}
          rightIcon={<ArrowRight className="w-4 h-4" strokeWidth={1.5} />}
        >
          {isLastPlayer ? 'Start round' : 'Next player'}
        </Button>
      </div>
    </div>
  );
};
