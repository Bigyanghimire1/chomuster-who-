import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../../context/GameContext';
import { Button } from '../common/Button';
import { PlayerAvatar } from '../illustrations/PlayerAvatar';
import { SecretCardBack } from '../illustrations/SecretCardArtwork';
import { audioService } from '../../services/audioService';

export const RoleRevealView: React.FC = () => {
  const { state, dispatch } = useGame();
  const [isHolding, setIsHolding] = useState(false);
  const [hasViewedOnce, setHasViewedOnce] = useState(false);

  const holdStartRef = useRef<number>(0);
  const minHoldThresholdMs = 280; // Minimum hold to prevent accidental brush-taps

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

  // Reset local reveal state whenever currentRevealIndex changes
  useEffect(() => {
    setIsHolding(false);
    setHasViewedOnce(false);
  }, [state.currentRevealIndex]);

  // Safety trigger: hide immediately on window blur or tab visibility change
  useEffect(() => {
    const handleSafetyBlur = () => {
      setIsHolding(false);
    };

    window.addEventListener('blur', handleSafetyBlur);
    document.addEventListener('visibilitychange', handleSafetyBlur);

    return () => {
      window.removeEventListener('blur', handleSafetyBlur);
      document.removeEventListener('visibilitychange', handleSafetyBlur);
    };
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    holdStartRef.current = Date.now();
    setIsHolding(true);
    audioService.playRoleReveal();
  };

  const handlePointerRelease = () => {
    const holdDuration = Date.now() - holdStartRef.current;
    setIsHolding(false);
    if (holdDuration >= minHoldThresholdMs) {
      setHasViewedOnce(true);
    }
  };

  const handleAdvance = () => {
    setIsHolding(false);
    setHasViewedOnce(false);
    if (isLastPlayer) {
      dispatch({ type: 'START_ROUND' });
    } else {
      dispatch({ type: 'NEXT_REVEAL' });
    }
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-[calc(100vh-4rem)] max-w-md mx-auto px-4 py-5 select-none animate-fade-in">
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

      {/* 2. Interactive Secret Card Surface */}
      <div className="w-full max-w-[280px] my-auto">
        <div
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerRelease}
          onPointerLeave={handlePointerRelease}
          onPointerCancel={handlePointerRelease}
          style={{ touchAction: 'none' }}
          className={`relative min-h-[360px] rounded-3xl flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-150 shadow-2xl ${
            isHolding
              ? isImposter
                ? 'bg-gradient-to-b from-[#33141E] via-chomu-surface to-chomu-bg border-2 border-chomu-coral shadow-chomu-coral/20 scale-[1.02]'
                : 'bg-gradient-to-b from-[#1C1838] via-chomu-surface to-chomu-bg border-2 border-chomu-purple shadow-chomu-purple/20 scale-[1.02]'
              : 'bg-chomu-surface border border-chomu-border hover:border-chomu-border/80 active:scale-[0.99]'
          }`}
        >
          {isHolding ? (
            /* ACTIVE SECRET DISPLAY (Visible ONLY while pointer is actively held) */
            <div className="w-full p-6 animate-fade-in space-y-4">
              {isImposter ? (
                /* IMPOSTER CARD */
                <>
                  <div className="w-14 h-14 rounded-2xl bg-chomu-coral/15 border border-chomu-coral/30 flex items-center justify-center mx-auto">
                    <PlayerAvatar id="shadow" size="md" isImposterStyle={true} />
                  </div>

                  <div>
                    <span className="text-[11px] font-black tracking-widest uppercase text-chomu-coral block mb-1">
                      YOU ARE THE
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black text-chomu-coral tracking-tight">
                      IMPOSTER
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
            /* HIDDEN CARD BACK (Intricate Mystery Concentric Artwork) */
            <div className="w-full h-full flex flex-col items-center justify-center p-3">
              <SecretCardBack isHolding={isHolding} />
            </div>
          )}
        </div>
      </div>

      {/* 3. Post-Reveal Actions & Status */}
      <div className="w-full max-w-[280px] space-y-2.5">
        <div className="h-6 flex items-center justify-center">
          {hasViewedOnce && !isHolding ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-black text-chomu-lime bg-chomu-lime/10 border border-chomu-lime/30 px-3 py-0.5 rounded-full animate-fade-in">
              SEEN ✓
            </span>
          ) : (
            <span className="text-[11px] text-chomu-muted font-medium">
              {isHolding ? 'Keep holding to view...' : 'Press and hold card to reveal'}
            </span>
          )}
        </div>

        <Button
          variant="primary"
          size="xl"
          fullWidth
          disabled={!hasViewedOnce || isHolding}
          onClick={handleAdvance}
        >
          {isLastPlayer ? 'START ROUND →' : 'NEXT PLAYER →'}
        </Button>
      </div>
    </div>
  );
};
