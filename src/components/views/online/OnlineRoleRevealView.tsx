import React, { useState, useRef, useCallback } from 'react';
import {
  Eye,
  EyeOff,
  Check,
  Play,
  HelpCircle,
} from 'lucide-react';
import { useMultiplayer } from '../../../context/MultiplayerContext';
import { Button } from '../../common/Button';
import { Card } from '../../common/Card';
import { Badge } from '../../common/Badge';
import { PlayerAvatar } from '../../illustrations/PlayerAvatar';
import { SecretCardBack } from '../../illustrations/SecretCardArtwork';
import { audioService } from '../../../services/audioService';

export const OnlineRoleRevealView: React.FC = () => {
  const {
    mySecret,
    players,
    myPlayer,
    isHost,
    confirmRole,
    startRound,
    roomState,
  } = useMultiplayer();

  // Anti-peek state: isCardRevealed is true while holding or toggled
  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [hasAcknowledged, setHasAcknowledged] = useState<boolean>(false);
  const holdStartRef = useRef<number>(0);
  const isHoldingRef = useRef<boolean>(false);

  const isChomu = !!mySecret?.isChomu;
  const categoryName = mySecret?.category || roomState?.secretCategory || 'Mystery';
  const secretWord = mySecret?.word || '';
  const hint = mySecret?.hint || '';

  // Calculate how many players have acknowledged their role
  const totalPlayers = players.length;
  const readyPlayersCount = players.filter((p) => p.hasSeenRole || p.isReady).length;

  const handlePointerDown = () => {
    isHoldingRef.current = true;
    holdStartRef.current = Date.now();
    setIsRevealed(true);
    audioService.playCardReveal();
  };

  const handlePointerUp = useCallback(() => {
    if (!isHoldingRef.current) return;
    isHoldingRef.current = false;
    // Keep revealed briefly or re-hide
    setIsRevealed(false);
  }, []);

  const handleToggleReveal = () => {
    setIsRevealed((prev) => {
      const next = !prev;
      if (next) {
        audioService.playCardReveal();
      }
      return next;
    });
  };

  const handleConfirmRole = () => {
    setHasAcknowledged(true);
    confirmRole();
    audioService.playButtonTap();
  };

  const handleStartRound = () => {
    audioService.playGameStart();
    startRound();
  };

  return (
    <div className="flex flex-col items-center justify-between flex-1 max-w-md mx-auto w-full px-4 py-4 select-none animate-fade-in text-center space-y-4">
      {/* Top Banner */}
      <div className="w-full">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-chomu-surface border border-chomu-border text-xs font-bold text-chomu-purple mb-2">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>CATEGORY: {categoryName.toUpperCase()}</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-chomu-text tracking-tight uppercase">
          YOUR SECRET IDENTITY
        </h1>
        <p className="text-xs text-chomu-muted font-medium max-w-[280px] mx-auto">
          Hold or tap to reveal. Make sure nobody next to you is peeking!
        </p>
      </div>

      {/* Central Secret Card with Anti-Peek Cover */}
      <div className="relative w-full max-w-[260px] aspect-[3/4] flex items-center justify-center my-auto">
        {!isRevealed ? (
          /* Cover State: Hold / Tap to Peek */
          <div
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            className="w-full h-full cursor-pointer transition-transform active:scale-95 touch-none relative rounded-3xl overflow-hidden shadow-2xl border-2 border-chomu-purple/40 bg-chomu-surface flex flex-col items-center justify-center p-4 group"
          >
            <SecretCardBack isHolding={false} />

            <div className="absolute inset-x-0 bottom-4 flex flex-col items-center gap-1 pointer-events-none">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-chomu-purple text-chomu-bg text-xs font-black shadow-lg">
                <Eye className="w-3.5 h-3.5" /> PRESS & HOLD
              </span>
              <span className="text-[10px] text-chomu-muted font-medium">
                or tap below to toggle
              </span>
            </div>
          </div>
        ) : (
          /* Revealed Secret State */
          <div
            onPointerUp={handlePointerUp}
            className={`w-full h-full rounded-3xl p-5 flex flex-col items-center justify-between shadow-2xl border-2 transition-all animate-scale-in ${
              isChomu
                ? 'bg-gradient-to-b from-[#2B1424] via-chomu-surface to-chomu-surface border-chomu-coral'
                : 'bg-gradient-to-b from-[#162725] via-chomu-surface to-chomu-surface border-chomu-lime'
            }`}
          >
            {/* Top Identity Tag */}
            <div className="w-full flex items-center justify-between">
              <Badge variant={isChomu ? 'coral' : 'lime'} size="sm">
                {isChomu ? 'IMPOSTER' : 'CIVILIAN'}
              </Badge>
              <button
                onClick={handleToggleReveal}
                className="p-1 rounded-lg bg-chomu-bg/60 text-chomu-muted hover:text-chomu-text transition-colors"
                title="Hide Secret"
              >
                <EyeOff className="w-4 h-4" />
              </button>
            </div>

            {/* Secret Content */}
            <div className="my-auto space-y-2">
              {isChomu ? (
                <>
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-chomu-coral/20 flex items-center justify-center mb-1">
                    <PlayerAvatar
                      id={myPlayer?.avatar || 'shadow'}
                      size="lg"
                      isImposterStyle={true}
                    />
                  </div>
                  <span className="text-[10px] font-black tracking-widest text-chomu-coral uppercase block">
                    YOU ARE THE
                  </span>
                  <h2 className="text-3xl font-black text-chomu-coral tracking-tight uppercase drop-shadow-md">
                    CHOMU
                  </h2>

                  {hint ? (
                    <Card className="bg-chomu-bg/80 border border-chomu-coral/40 p-2.5 text-center mt-2">
                      <span className="text-[10px] font-bold text-chomu-muted uppercase block">
                        Your Secret Hint
                      </span>
                      <span className="text-lg font-black text-chomu-text">
                        "{hint}"
                      </span>
                    </Card>
                  ) : (
                    <p className="text-[11px] text-chomu-muted font-medium pt-1">
                      No hint given. Blend in and listen closely!
                    </p>
                  )}
                </>
              ) : (
                <>
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-chomu-lime/20 flex items-center justify-center mb-1">
                    <PlayerAvatar
                      id={myPlayer?.avatar || 'sleuth'}
                      size="lg"
                    />
                  </div>
                  <span className="text-[10px] font-black tracking-widest text-chomu-lime uppercase block">
                    THE SECRET WORD
                  </span>
                  <h2 className="text-3xl font-black text-chomu-text tracking-tight drop-shadow-md">
                    {secretWord || 'Loading...'}
                  </h2>
                  <p className="text-[11px] text-chomu-muted font-medium pt-1">
                    Find the Chomu who doesn't know this word!
                  </p>
                </>
              )}
            </div>

            {/* Bottom reminder */}
            <div className="w-full pt-1">
              <span className="text-[10px] text-chomu-muted font-semibold">
                Tap card or EyeOff to re-hide
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Alternative Tap Toggle Button */}
      <div className="w-full max-w-[280px]">
        <Button
          variant="secondary"
          size="sm"
          fullWidth
          onClick={handleToggleReveal}
          leftIcon={
            isRevealed ? (
              <EyeOff className="w-3.5 h-3.5 text-chomu-muted" />
            ) : (
              <Eye className="w-3.5 h-3.5 text-chomu-purple" />
            )
          }
        >
          {isRevealed ? 'Hide Secret (Anti-Peek)' : 'Toggle Card Open'}
        </Button>
      </div>

      {/* Action / Ready Confirmation */}
      <div className="w-full max-w-[300px] space-y-2 pt-1">
        {!hasAcknowledged ? (
          <Button
            variant="primary"
            size="xl"
            fullWidth
            onClick={handleConfirmRole}
            leftIcon={<Check className="w-5 h-5" />}
          >
            I KNOW MY ROLE
          </Button>
        ) : (
          <div className="space-y-2">
            <div className="p-3 rounded-2xl bg-chomu-lime/15 border border-chomu-lime/30 text-chomu-lime flex items-center justify-center gap-2 text-xs font-black">
              <Check className="w-4 h-4" />
              <span>You're ready! Waiting for others ({readyPlayersCount}/{totalPlayers})</span>
            </div>

            {isHost && (
              <Button
                variant="lime"
                size="lg"
                fullWidth
                onClick={handleStartRound}
                leftIcon={<Play className="w-4 h-4 fill-current" />}
              >
                START ROUND NOW
              </Button>
            )}
          </div>
        )}

        <p className="text-[11px] text-chomu-muted font-medium">
          Once everyone is ready, the round will begin automatically.
        </p>
      </div>
    </div>
  );
};
