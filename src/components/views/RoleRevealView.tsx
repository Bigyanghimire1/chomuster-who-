import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useGame } from '../../context/GameContext';
import { Button } from '../common/Button';
import { PlayerAvatar } from '../illustrations/PlayerAvatar';
import { SecretCardBack } from '../illustrations/SecretCardArtwork';
import { audioService } from '../../services/audioService';

export type RevealState = 'HIDDEN' | 'HOLDING' | 'REVEALED' | 'SEEN';

export const RoleRevealView: React.FC = () => {
  const { state, dispatch } = useGame();

  // Deterministic 4-state lifecycle model: HIDDEN -> HOLDING -> REVEALED -> SEEN
  const [revealState, setRevealState] = useState<RevealState>('HIDDEN');

  const cardElementRef = useRef<HTMLDivElement | null>(null);
  const holdStartRef = useRef<number>(0);
  const activePointerIdRef = useRef<number | null>(null);
  const holdTimerRef = useRef<number | null>(null);
  const cleanupWindowListenersRef = useRef<(() => void) | null>(null);
  const hasEverSeenRef = useRef<boolean>(false);

  // Minimum valid hold duration to prevent accidental brush-taps
  const minHoldThresholdMs = 300;

  // Player identity determined from the randomized revealOrder sequence
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

  // Cleanup helper for all active listeners & timers
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

  // End interaction handler: completely idempotent and bulletproof against WebKit quirks
  const handleEndInteraction = useCallback((pointerId: number, _isCancelled: boolean) => {
    if (activePointerIdRef.current === null || pointerId !== activePointerIdRef.current) {
      return;
    }

    cleanupActiveInteraction();

    // Safely release pointer capture if element still has it
    if (cardElementRef.current && pointerId >= 0) {
      try {
        if (cardElementRef.current.hasPointerCapture(pointerId)) {
          cardElementRef.current.releasePointerCapture(pointerId);
        }
      } catch {
        // Ignored if capture was already released by WebKit
      }
    }

    const duration = Date.now() - holdStartRef.current;
    const passedThreshold = duration >= minHoldThresholdMs;

    activePointerIdRef.current = null;

    if (passedThreshold) {
      // Valid hold completed! Secret was viewed
      hasEverSeenRef.current = true;
      setRevealState('SEEN');
    } else {
      // Held for less than minimum threshold
      if (hasEverSeenRef.current) {
        // If the player had already viewed their card before and was just peeking again, stay SEEN
        setRevealState('SEEN');
      } else {
        // Accidental brief brush or cancelled before threshold: return to HIDDEN so player can retry
        setRevealState('HIDDEN');
      }
    }
  }, [cleanupActiveInteraction, minHoldThresholdMs]);

  // Reset local reveal state whenever currentRevealIndex changes (next player receives device)
  useEffect(() => {
    cleanupActiveInteraction();
    activePointerIdRef.current = null;
    hasEverSeenRef.current = false;
    setRevealState('HIDDEN');
  }, [state.currentRevealIndex, cleanupActiveInteraction]);

  // Safety trigger: immediately conceal secret on window blur or tab visibility change
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
    // 1. Only accept a single primary pointer (reject second fingers)
    if (activePointerIdRef.current !== null) return;
    // 2. Reject non-primary mouse clicks (e.g. right-click)
    if (e.pointerType === 'mouse' && e.button !== 0) return;

    e.preventDefault();
    const pid = e.pointerId;
    activePointerIdRef.current = pid;
    holdStartRef.current = Date.now();

    // 3. Capture pointer on the stable card container element
    try {
      e.currentTarget.setPointerCapture(pid);
    } catch {
      // Ignored if pointer capture is unsupported
    }

    // 4. Begin holding state and schedule threshold timer
    setRevealState('HOLDING');
    cleanupActiveInteraction();

    holdTimerRef.current = window.setTimeout(() => {
      setRevealState(current => (current === 'HOLDING' ? 'REVEALED' : current));
    }, minHoldThresholdMs);

    audioService.playCardReveal();

    // 5. Bulletproof window-level release listeners as fallback for iOS Safari WebKit
    const onWindowPointerUp = (we: PointerEvent) => {
      if (we.pointerId === pid) {
        handleEndInteraction(pid, false);
      }
    };
    const onWindowPointerCancel = (we: PointerEvent) => {
      if (we.pointerId === pid) {
        handleEndInteraction(pid, true);
      }
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
    // Idempotent fallback when WebKit drops pointer capture
    if (activePointerIdRef.current === e.pointerId) {
      handleEndInteraction(e.pointerId, false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      if (activePointerIdRef.current === null && !isActivelyHolding) {
        activePointerIdRef.current = -1; // special ID for keyboard
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
    <div className="flex flex-col items-center justify-between flex-1 max-w-md mx-auto px-4 py-5 select-none animate-fade-in">
      {/* 1. Header: Pass Device directly with Player Name */}
      <div className="w-full text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-chomu-surface border border-chomu-border text-xs font-bold text-chomu-muted mb-2">
          <span>PLAYER {state.currentRevealIndex + 1} OF {totalPlayers}</span>
        </div>

        <div className="flex items-center justify-center gap-2 mb-1">
          <PlayerAvatar id={activePlayer.avatar} size="sm" />
          <h2 className="text-xl sm:text-2xl font-black text-chomu-text tracking-tight uppercase">
            PASS TO {activePlayer.name}
          </h2>
        </div>
      </div>

      {/* 2. Interactive Secret Card Surface (Stable container, pointer-events-none on children) */}
      <div className="w-full max-w-[280px] my-auto">
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
          className={`relative min-h-[360px] rounded-3xl flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-150 shadow-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-chomu-purple focus-visible:ring-offset-2 focus-visible:ring-offset-chomu-bg ${
            isSecretVisible
              ? isImposter
                ? 'bg-gradient-to-b from-[#33141E] via-chomu-surface to-chomu-bg border-2 border-chomu-coral shadow-chomu-coral/20 scale-[1.02]'
                : 'bg-gradient-to-b from-[#1C1838] via-chomu-surface to-chomu-bg border-2 border-chomu-purple shadow-chomu-purple/20 scale-[1.02]'
              : 'bg-chomu-surface border border-chomu-border hover:border-chomu-border/80 active:scale-[0.99]'
          }`}
        >
          {isSecretVisible ? (
            /* ACTIVE SECRET DISPLAY (Pointer events none to protect gesture tracking) */
            <div className="w-full p-6 animate-fade-in space-y-4 pointer-events-none select-none">
              {isImposter ? (
                /* CHOMU CARD */
                <>
                  <div className="w-14 h-14 rounded-2xl bg-chomu-coral/15 border border-chomu-coral/30 flex items-center justify-center mx-auto">
                    <PlayerAvatar id="shadow" size="md" isImposterStyle={true} />
                  </div>

                  <div>
                    <span className="text-[11px] font-black tracking-widest uppercase text-chomu-coral block mb-1">
                      YOU ARE THE
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black text-chomu-coral tracking-tight">
                      CHOMU
                    </h3>
                  </div>

                  {imposterHint ? (
                    <div className="bg-chomu-bg/90 border border-chomu-coral/30 rounded-2xl p-4 shadow-inner">
                      <span className="text-[10px] font-bold text-chomu-coral/80 uppercase tracking-widest block mb-1">
                        YOUR HINT
                      </span>
                      <p className="text-xl font-black text-chomu-text tracking-wide">
                        {imposterHint}
                      </p>
                    </div>
                  ) : (
                    <div className="bg-chomu-bg/90 border border-chomu-border rounded-xl p-3">
                      <span className="text-xs text-chomu-muted">No hint available this round.</span>
                    </div>
                  )}

                  <p className="text-xs text-chomu-coral/80 font-medium">
                    Blend in. Act like you know the word.
                  </p>
                </>
              ) : (
                /* CIVILIAN CARD */
                <>
                  <div className="w-14 h-14 rounded-2xl bg-chomu-purple/15 border border-chomu-purple/30 flex items-center justify-center mx-auto">
                    <PlayerAvatar id={activePlayer.avatar} size="md" />
                  </div>

                  <div>
                    <span className="text-[11px] font-black tracking-widest uppercase text-chomu-lime block mb-1">
                      CIVILIAN
                    </span>
                    <span className="text-[10px] text-chomu-muted block uppercase tracking-wider mb-2">
                      {secretCategory}
                    </span>
                    <span className="text-[10px] font-bold text-chomu-muted block uppercase tracking-widest">
                      SECRET WORD
                    </span>
                    <h3 className="text-3xl sm:text-4xl font-black text-chomu-text tracking-tight drop-shadow-md">
                      {secretWord}
                    </h3>
                  </div>

                  <p className="text-xs text-chomu-muted font-medium pt-2">
                    Keep it subtle.
                  </p>
                </>
              )}
            </div>
          ) : (
            /* HIDDEN CARD BACK (Pointer events none so card container receives all touches) */
            <div className="w-full h-full flex flex-col items-center justify-center p-3 pointer-events-none select-none">
              <SecretCardBack isHolding={isSecretVisible} />
            </div>
          )}
        </div>
      </div>

      {/* 3. Post-Reveal Actions & Status */}
      <div className="w-full max-w-[280px] space-y-2.5">
        <div className="h-6 flex items-center justify-center">
          {revealState === 'SEEN' && !isActivelyHolding ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-black text-chomu-lime bg-chomu-lime/10 border border-chomu-lime/30 px-3 py-0.5 rounded-full animate-fade-in">
              SEEN ✓
            </span>
          ) : (
            <span className="text-[11px] text-chomu-muted font-medium">
              {isActivelyHolding ? 'Keep holding to view...' : 'Press and hold card to reveal'}
            </span>
          )}
        </div>

        <Button
          variant="primary"
          size="xl"
          fullWidth
          disabled={revealState !== 'SEEN' || isActivelyHolding}
          onClick={handleAdvance}
        >
          {isLastPlayer ? 'START ROUND →' : 'NEXT PLAYER →'}
        </Button>
      </div>
    </div>
  );
};
