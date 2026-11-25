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

  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [hasAcknowledged, setHasAcknowledged] = useState<boolean>(false);
  const holdStartRef = useRef<number>(0);
  const isHoldingRef = useRef<boolean>(false);

  const isChomu = !!mySecret?.isChomu;
  const categoryName = mySecret?.category || roomState?.secretCategory || 'Mystery';
  const secretWord = mySecret?.word || '';
  const hint = mySecret?.hint || '';

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
    <div className="flex flex-col items-center justify-between flex-1 max-w-md mx-auto w-full px-4 py-6 select-none animate-fade-in text-center space-y-5">
      {/* Header */}
      <div className="w-full space-y-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-chomu-surface border border-white/[0.08] text-xs font-medium text-chomu-secondary">
          <HelpCircle className="w-3.5 h-3.5" strokeWidth={1.5} />
          <span>{categoryName}</span>
        </div>

        <h1 className="text-2xl font-semibold text-chomu-text tracking-[-0.02em]">
          Your secret role
        </h1>
        <p className="text-sm text-chomu-secondary max-w-[300px] mx-auto leading-5">
          Hold or toggle the card to view privately
        </p>
      </div>

      {/* Central Secret Card */}
      <div className="relative w-full max-w-[260px] aspect-[3/4] flex items-center justify-center my-auto">
        {!isRevealed ? (
          <div
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            className="w-full h-full cursor-pointer transition-transform active:scale-[0.99] touch-none relative rounded-2xl overflow-hidden border border-white/[0.12] bg-chomu-surface flex flex-col items-center justify-center p-4"
          >
            <SecretCardBack isHolding={false} />

            <div className="absolute inset-x-0 bottom-4 flex flex-col items-center gap-1 pointer-events-none">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-chomu-text text-chomu-bg text-xs font-medium">
                <Eye className="w-3.5 h-3.5" strokeWidth={1.5} />
                <span>Press and hold</span>
              </span>
              <span className="text-xs text-chomu-muted">
                or toggle below
              </span>
            </div>
          </div>
        ) : (
          <div
            onPointerUp={handlePointerUp}
            className={`w-full h-full rounded-2xl p-5 flex flex-col items-center justify-between border-2 animate-scale-in bg-chomu-elevated ${
              isChomu ? 'border-chomu-coral' : 'border-chomu-lime'
            }`}
          >
            <div className="w-full flex items-center justify-between">
              <Badge variant={isChomu ? 'coral' : 'lime'} size="sm">
                {isChomu ? 'Chomu' : 'Civilian'}
              </Badge>
              <button
                type="button"
                onClick={handleToggleReveal}
                className="min-w-[44px] min-h-[44px] -mr-2 -mt-2 flex items-center justify-center rounded-[10px] text-chomu-secondary hover:text-chomu-text transition-colors"
                title="Hide secret"
                aria-label="Hide secret"
              >
                <EyeOff className="w-4 h-4" strokeWidth={1.5} />
              </button>
            </div>

            <div className="my-auto space-y-2.5">
              {isChomu ? (
                <>
                  <div className="w-16 h-16 mx-auto rounded-xl bg-chomu-coral/15 border border-chomu-coral/30 flex items-center justify-center">
                    <PlayerAvatar
                      id={myPlayer?.avatar || 'shadow'}
                      size="lg"
                      isImposterStyle={true}
                    />
                  </div>
                  <span className="text-xs font-medium text-chomu-coral block">
                    You are the
                  </span>
                  <h2 className="text-3xl font-semibold text-chomu-coral tracking-[-0.02em]">
                    Chomu
                  </h2>

                  {hint ? (
                    <Card className="bg-chomu-bgSecondary border border-chomu-coral/30 p-3 text-center mt-2">
                      <span className="text-xs text-chomu-muted block mb-0.5">
                        Your hint
                      </span>
                      <span className="text-lg font-semibold text-chomu-text">
                        &ldquo;{hint}&rdquo;
                      </span>
                    </Card>
                  ) : (
                    <p className="text-xs text-chomu-secondary pt-1">
                      No hint given. Listen closely and blend in
                    </p>
                  )}
                </>
              ) : (
                <>
                  <div className="w-16 h-16 mx-auto rounded-xl bg-chomu-lime/15 border border-chomu-lime/30 flex items-center justify-center">
                    <PlayerAvatar
                      id={myPlayer?.avatar || 'sleuth'}
                      size="lg"
                    />
                  </div>
                  <span className="text-xs font-medium text-chomu-lime block">
                    Secret word
                  </span>
                  <h2 className="text-3xl font-semibold text-chomu-text tracking-[-0.02em]">
                    {secretWord || 'Loading'}
                  </h2>
                  <p className="text-xs text-chomu-secondary pt-1">
                    Spot the Chomu who does not know this word
                  </p>
                </>
              )}
            </div>

            <span className="text-xs text-chomu-muted">
              Release or toggle to hide
            </span>
          </div>
        )}
      </div>

      <div className="w-full max-w-[280px]">
        <Button
          variant="secondary"
          size="sm"
          fullWidth
          onClick={handleToggleReveal}
          leftIcon={
            isRevealed ? (
              <EyeOff className="w-4 h-4" strokeWidth={1.5} />
            ) : (
              <Eye className="w-4 h-4" strokeWidth={1.5} />
            )
          }
        >
          {isRevealed ? 'Hide secret' : 'Toggle card open'}
        </Button>
      </div>

      <div className="w-full max-w-[300px] space-y-2.5">
        {!hasAcknowledged ? (
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleConfirmRole}
            leftIcon={<Check className="w-4 h-4" strokeWidth={1.5} />}
          >
            I know my role
          </Button>
        ) : (
          <div className="space-y-2.5">
            <div className="p-3 rounded-[10px] bg-chomu-lime/10 border border-chomu-lime/25 text-chomu-lime flex items-center justify-center gap-2 text-xs font-medium tabular-nums">
              <Check className="w-4 h-4" strokeWidth={1.5} />
              <span>Ready ({readyPlayersCount}/{totalPlayers})</span>
            </div>

            {isHost && (
              <Button
                variant="lime"
                size="lg"
                fullWidth
                onClick={handleStartRound}
                leftIcon={<Play className="w-4 h-4" strokeWidth={1.5} />}
              >
                Start round now
              </Button>
            )}
          </div>
        )}

        <p className="text-xs text-chomu-muted">
          The round begins automatically once everyone confirms
        </p>
      </div>
    </div>
  );
};
