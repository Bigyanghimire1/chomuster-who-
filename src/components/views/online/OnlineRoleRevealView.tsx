import React, { useState } from 'react';
import { ArrowRight, HelpCircle } from 'lucide-react';
import { useMultiplayer } from '../../../context/MultiplayerContext';
import { Button } from '../../common/Button';
import { Card } from '../../common/Card';
import { Badge } from '../../common/Badge';
import { VideoCard } from '../../common/VideoCard';
import { InteractiveSecretCard } from '../../common/InteractiveSecretCard';
import { audioService } from '../../../services/audioService';

/**
 * OnlineRoleRevealView — Sequential, private player-by-player card reveal.
 * - Randomized turnOrder is authoritative across every connected client.
 * - Active player appears in the main video/avatar spotlight for everyone.
 * - Other players appear in the filmstrip underneath.
 * - ONLY the active player receives and sees their private InteractiveSecretCard.
 * - Pressing Next advances directly to the next player, then automatically starts ROUND.
 */
export const OnlineRoleRevealView: React.FC = () => {
  const {
    mySecret,
    players,
    myPlayerId,
    isHost,
    confirmRole,
    roomState,
    speakingPeers,
    localStream,
    peerStreams,
    error: contextError,
  } = useMultiplayer();

  const [isAdvancing, setIsAdvancing] = useState<boolean>(false);

  const categoryName = mySecret?.category || roomState?.secretCategory || 'Mystery';
  const isChomu = !!mySecret?.isChomu;
  const secretWord = mySecret?.word || '';
  const hint = mySecret?.hint || '';

  const turnOrder =
    roomState?.turnOrder && roomState.turnOrder.length > 0
      ? roomState.turnOrder
      : players.map((p) => p.id);

  const activePlayerId = roomState?.currentTurnPlayerId || turnOrder[0];
  const activePlayer =
    players.find((p) => p.id === activePlayerId) || players[0];
  const otherPlayers = players.filter((p) => p.id !== activePlayer?.id);

  const activeIndex = Math.max(
    0,
    turnOrder.findIndex((id) => id === activePlayer?.id),
  );
  const isMyTurn = !!activePlayer && activePlayer.id === myPlayerId;

  const getPlayerStream = (playerId: string) => {
    if (playerId === myPlayerId) return localStream;
    return peerStreams[playerId] || null;
  };

  const handleNext = () => {
    if (isAdvancing) return;
    setIsAdvancing(true);
    audioService.playButtonTap();
    confirmRole();
    window.setTimeout(() => setIsAdvancing(false), 1800);
  };

  return (
    <div className="flex-1 w-full bg-[#FFDF00] flex flex-col">
      <div className="flex flex-col flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-4 select-none animate-fade-in space-y-3">
        {/* Compact Header */}
        <Card className="px-4 py-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-chomu-secondary">
              <HelpCircle className="w-3.5 h-3.5 shrink-0" strokeWidth={2.2} />
              <span className="truncate">Category: {categoryName}</span>
            </div>
            <h1 className="text-lg sm:text-2xl font-extrabold text-[#050505] tracking-[-0.03em] leading-tight">
              Private Role Reveal
            </h1>
          </div>

          <span className="px-3 py-1 rounded-full bg-[#FFDF00] border-2 border-[#050505] shadow-[0_2px_0_#050505] text-xs font-extrabold text-[#050505] tabular-nums shrink-0">
            Player {Math.min(activeIndex + 1, Math.max(1, turnOrder.length))} of {Math.max(1, turnOrder.length)}
          </span>
        </Card>

        {/* Main Stage */}
        {activePlayer && (
          <div className="space-y-3 flex-1 flex flex-col justify-center">
            {isMyTurn ? (
              /* Active Player Focused View — centered secret card, no giant self-video or participant grid */
              <div className="w-full max-w-sm mx-auto flex flex-col items-center">
                <InteractiveSecretCard
                  isChomu={isChomu}
                  categoryName={categoryName}
                  secretWord={secretWord}
                  hint={hint}
                  playerName={activePlayer.name}
                />
              </div>
            ) : (
              <>
                {/* Neutral Spotlight View for Observers — zero secret data */}
                <div className="w-full relative">
                  <VideoCard
                    player={activePlayer}
                    stream={getPlayerStream(activePlayer.id)}
                    isSpeaking={
                      !!speakingPeers[activePlayer.id] || !!activePlayer.isSpeaking
                    }
                    isLocal={false}
                    isSpotlight={true}
                    actionSlot={
                      <Badge variant="purple" size="sm">
                        {activePlayer.name} is viewing their card
                      </Badge>
                    }
                  />
                </div>

                {/* Compact Non-Clipped Horizontal Filmstrip */}
                {otherPlayers.length > 0 && (
                  <div className="w-full space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-[#050505] tabular-nums">
                        Players ({otherPlayers.length})
                      </span>
                      <span className="text-xs font-bold text-[#050505]/75">
                        Waiting in turn order
                      </span>
                    </div>

                    <div className="flex gap-3 overflow-x-auto px-0.5 pb-2 snap-x snap-mandatory">
                      {otherPlayers.map((p) => {
                        const isMe = p.id === myPlayerId;
                        const isPeerSpeaking = !!speakingPeers[p.id] || !!p.isSpeaking;

                        return (
                          <div
                            key={p.id}
                            className="w-36 sm:w-44 shrink-0 snap-start"
                          >
                            <VideoCard
                              player={p}
                              stream={getPlayerStream(p.id)}
                              isSpeaking={isPeerSpeaking}
                              isLocal={isMe}
                              compact={true}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Bottom Action Bar — always visible cleanly above VoiceControls */}
        <Card className="sticky bottom-2 z-20 p-3.5 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="text-center sm:text-left">
            <span className="text-sm font-extrabold text-[#050505] block">
              {isMyTurn
                ? 'Peek at your secret card, then press Next'
                : `${activePlayer?.name || 'Player'} is checking their private card`}
            </span>
            <p className="text-xs font-medium text-chomu-secondary mt-0.5">
              {isMyTurn
                ? 'Make sure no one else can see your screen.'
                : 'Your turn will appear automatically when they press Next.'}
            </p>
            {contextError && (
              <p className="text-xs font-bold text-chomu-errorText mt-1">
                {contextError}
              </p>
            )}
          </div>

          {(isMyTurn || (isHost && activePlayer && !activePlayer.isConnected)) && (
            <div className="w-full sm:w-auto flex items-center justify-end gap-2">
              {isMyTurn ? (
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  className="sm:w-48"
                  disabled={isAdvancing}
                  onClick={handleNext}
                  rightIcon={<ArrowRight className="w-4 h-4" strokeWidth={2.5} />}
                >
                  {isAdvancing ? 'Advancing...' : 'Next'}
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  size="md"
                  disabled={isAdvancing}
                  onClick={handleNext}
                  rightIcon={<ArrowRight className="w-4 h-4" strokeWidth={2.2} />}
                >
                  Skip disconnected player
                </Button>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
