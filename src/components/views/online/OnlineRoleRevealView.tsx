import React, { useState } from 'react';
import { ArrowRight, Eye, HelpCircle } from 'lucide-react';
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
      <div className="flex flex-col flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-5 select-none animate-fade-in space-y-4">
        {/* Header */}
        <Card className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-chomu-secondary mb-1">
              <HelpCircle className="w-3.5 h-3.5" strokeWidth={2.2} />
              <span>Category: {categoryName}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#050505] tracking-[-0.03em]">
              Private Role Reveal
            </h1>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="px-3.5 py-1.5 rounded-full bg-[#FFDF00] border-2 border-[#050505] shadow-[0_2px_0_#050505] text-xs font-extrabold text-[#050505] tabular-nums">
              Player {Math.min(activeIndex + 1, Math.max(1, turnOrder.length))} of {Math.max(1, turnOrder.length)}
            </span>
          </div>
        </Card>

        {/* Main Spotlight Stage */}
        {activePlayer && (
          <div className="space-y-4 flex-1">
            {isMyTurn ? (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center w-full">
                {/* Active Player Spotlight Video/Avatar */}
                <div className="md:col-span-6 min-h-[240px] sm:min-h-[300px]">
                  <VideoCard
                    player={activePlayer}
                    stream={localStream}
                    isSpeaking={!!speakingPeers[myPlayerId] || !!activePlayer.isSpeaking}
                    isLocal={true}
                    isSpotlight={true}
                    actionSlot={
                      <Badge variant="lime" size="md">
                        <Eye className="w-3.5 h-3.5" strokeWidth={2.2} />
                        <span>Your Card</span>
                      </Badge>
                    }
                  />
                </div>

                {/* Private Secret Card — ONLY rendered for the active player */}
                <div className="md:col-span-6 flex flex-col items-center space-y-3">
                  <InteractiveSecretCard
                    isChomu={isChomu}
                    categoryName={categoryName}
                    secretWord={secretWord}
                    hint={hint}
                    playerName={activePlayer.name}
                  />
                </div>
              </div>
            ) : (
              /* Neutral Spotlight View for All Other Players — zero secret data */
              <div className="w-full relative min-h-[260px] sm:min-h-[340px]">
                <VideoCard
                  player={activePlayer}
                  stream={getPlayerStream(activePlayer.id)}
                  isSpeaking={
                    !!speakingPeers[activePlayer.id] || !!activePlayer.isSpeaking
                  }
                  isLocal={false}
                  isSpotlight={true}
                  actionSlot={
                    <Badge variant="purple" size="md">
                      {activePlayer.name} is viewing their card
                    </Badge>
                  }
                />
              </div>
            )}

            {/* Filmstrip of Other Players */}
            {otherPlayers.length > 0 && (
              <div className="w-full space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#050505] tabular-nums">
                    Players ({otherPlayers.length})
                  </span>
                  <span className="text-xs font-bold text-[#050505]/75">
                    Waiting in turn order
                  </span>
                </div>

                <div className="flex gap-3 overflow-x-auto pb-1 snap-x">
                  {otherPlayers.map((p) => {
                    const isMe = p.id === myPlayerId;
                    const isPeerSpeaking = !!speakingPeers[p.id] || !!p.isSpeaking;

                    return (
                      <div
                        key={p.id}
                        className="w-40 sm:w-48 h-28 sm:h-32 shrink-0 snap-start"
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
          </div>
        )}

        {/* Bottom Action Bar */}
        <Card className="p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
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
            ) : isHost && activePlayer && !activePlayer.isConnected ? (
              <Button
                variant="secondary"
                size="md"
                disabled={isAdvancing}
                onClick={handleNext}
                rightIcon={<ArrowRight className="w-4 h-4" strokeWidth={2.2} />}
              >
                Skip disconnected player
              </Button>
            ) : null}
          </div>
        </Card>
      </div>
    </div>
  );
};
