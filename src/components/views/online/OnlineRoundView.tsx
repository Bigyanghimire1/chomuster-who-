import React, { useEffect, useState } from 'react';
import {
  Clock,
  Vote,
  HelpCircle,
  Eye,
  EyeOff,
  Mic,
  Radio,
  LayoutGrid,
  Minimize2,
  ArrowRight,
} from 'lucide-react';
import { useMultiplayer } from '../../../context/MultiplayerContext';
import { Button } from '../../common/Button';
import { Card } from '../../common/Card';
import { Badge } from '../../common/Badge';
import { VideoCard } from '../../common/VideoCard';
import { audioService } from '../../../services/audioService';

/**
 * OnlineRoundView — Synchronized active-player spotlight and gallery layout.
 */
export const OnlineRoundView: React.FC = () => {
  const {
    players,
    myPlayerId,
    mySecret,
    isHost,
    roomState,
    timerRemaining,
    speakingPeers,
    endRound,
    startVoting,
    nextTurn,
    rawPhase,
    localStream,
    peerStreams,
  } = useMultiplayer();
  const isDiscussion = rawPhase === 'DISCUSSION';
  const currentClueRound = roomState?.currentClueRound ?? 1;
  const totalClueRounds =
    roomState?.totalClueRounds ?? roomState?.settings?.clueRounds ?? 2;

  const [isSecretPeekOpen, setIsSecretPeekOpen] = useState<boolean>(false);
  const [isGalleryView, setIsGalleryView] = useState<boolean>(false);
  const [introCountdown, setIntroCountdown] = useState<number>(() =>
    !isDiscussion && currentClueRound === 1 ? 3 : 0
  );

  useEffect(() => {
    if (isDiscussion || currentClueRound > 1) {
      setIntroCountdown(0);
      return;
    }

    const startedAtMs = roomState?.roundStartTime;
    let initial = 3;
    if (typeof startedAtMs === 'number' && startedAtMs > 0) {
      const elapsedSec = Math.floor((Date.now() - startedAtMs) / 1000);
      initial = Math.max(0, Math.min(3, 3 - elapsedSec));
    }

    setIntroCountdown(initial);
    if (initial <= 0) return;

    const interval = window.setInterval(() => {
      setIntroCountdown((prev) => {
        if (prev <= 1) {
          window.clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isDiscussion, currentClueRound, roomState?.roundStartTime]);

  const categoryName =
    mySecret?.category || roomState?.secretCategory || 'Mystery';
  const secretWord = mySecret?.word || '';
  const isChomu = !!mySecret?.isChomu;
  const hint = mySecret?.hint || '';

  const minutes = Math.floor(timerRemaining / 60);
  const seconds = timerRemaining % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(
    seconds
  ).padStart(2, '0')}`;

  const isLowTime = timerRemaining <= 30 && timerRemaining > 0;
  const isCriticalTime = timerRemaining <= 10 && timerRemaining > 0;

  const activeSpeakerIds = Object.entries(speakingPeers)
    .filter(([_, isSpeaking]) => isSpeaking)
    .map(([id]) => id);

  const activeSpeakerNames = activeSpeakerIds
    .map((id) => players.find((p) => p.id === id)?.name)
    .filter(Boolean);

  const totalDuration = roomState?.roundDurationSeconds || 180;
  const elapsed = Math.max(0, totalDuration - timerRemaining);
  const turnDuration = Math.max(
    15,
    Math.floor(totalDuration / Math.max(1, players.length))
  );
  const fallbackTurnIndex = Math.min(
    players.length - 1,
    Math.floor(elapsed / turnDuration)
  );
  const fallbackTurnPlayer = players[fallbackTurnIndex] || players[0];

  const currentTurnPlayerId =
    roomState?.currentTurnPlayerId || fallbackTurnPlayer?.id;
  const spotlightPlayer =
    players.find((p) => p.id === currentTurnPlayerId) || fallbackTurnPlayer || players[0];
  const otherPlayers = players.filter((p) => p.id !== spotlightPlayer?.id);
  const isMyTurn = spotlightPlayer?.id === myPlayerId;

  const handleEndRound = () => {
    audioService.playButtonTap();
    if (startVoting) {
      startVoting();
    } else {
      endRound();
    }
  };

  const getPlayerStream = (playerId: string) => {
    if (playerId === myPlayerId) return localStream;
    return peerStreams[playerId] || null;
  };

  return (
    <div
      className={`flex-1 w-full flex flex-col transition-colors duration-200 ${
        isDiscussion ? 'bg-[#050505] text-white' : ''
      }`}
    >
      <div className="flex flex-col flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-5 select-none animate-fade-in space-y-4">
        {/* Header Bar */}
        <Card className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${isDiscussion ? 'bg-[#141418] text-white border-[#FFDF00]' : ''}`}>
          <div>
            <div className={`inline-flex items-center gap-1.5 text-xs font-extrabold mb-1 ${isDiscussion ? 'text-[#FFDF00]' : 'text-[#52555E]'}`}>
              <HelpCircle className="w-3.5 h-3.5" strokeWidth={2.2} />
              <span>Category: {categoryName}</span>
            </div>
            <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-[-0.03em] ${isDiscussion ? 'text-white' : 'text-[#050505]'}`}>
              {isDiscussion
                ? 'Group Discussion'
                : `Clue Round ${currentClueRound} of ${totalClueRounds}`}
            </h1>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsGalleryView(!isGalleryView)}
              leftIcon={
                isGalleryView ? (
                  <Minimize2 className="w-4 h-4" strokeWidth={2} />
                ) : (
                  <LayoutGrid className="w-4 h-4" strokeWidth={2} />
                )
              }
            >
              {isGalleryView ? 'Spotlight View' : 'Gallery View'}
            </Button>

            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-[#050505] shadow-[0_3px_0_#050505] ${
                isCriticalTime
                  ? 'bg-[#FF5D73] text-[#050505]'
                  : isLowTime || isDiscussion
                    ? 'bg-[#FFDF00] text-[#050505]'
                    : 'bg-[#64E987] text-[#050505]'
              }`}
            >
              <Clock className="w-4 h-4 shrink-0" strokeWidth={2.4} />
              <span className="text-lg font-mono font-extrabold tabular-nums leading-none">
                {formattedTime}
              </span>
            </div>
          </div>
        </Card>

      {roomState?.hostGracePeriodEnd && roomState.hostGracePeriodEnd > Date.now() && (
        <div className="bg-[#FFDF00] border-2 border-[#050505] text-[#050505] px-4 py-2.5 rounded-xl text-xs font-bold text-center shadow-[0_3px_0_#050505]">
          Host connection interrupted. Waiting for reconnection (10s grace period)
        </div>
      )}

      {/* Active Audio & Turn Summary Strip */}
      <div className="px-4 py-2.5 rounded-xl bg-white border-2 border-[#050505] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          {activeSpeakerNames.length > 0 ? (
            <Radio className="w-4 h-4 text-chomu-successText shrink-0" strokeWidth={2} />
          ) : (
            <Mic className="w-4 h-4 text-chomu-secondary shrink-0" strokeWidth={2} />
          )}
          {activeSpeakerNames.length > 0 ? (
            <span className="text-xs font-bold text-chomu-successText">
              {activeSpeakerNames.join(', ')} speaking
            </span>
          ) : (
            <span className="text-xs font-medium text-chomu-secondary">
              Listening for clues
            </span>
          )}
        </div>

        {spotlightPlayer && !isGalleryView && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-chomu-muted">Current speaker:</span>
            <span className="font-medium text-chomu-text">
              {spotlightPlayer.name} {isMyTurn ? '(You)' : ''}
            </span>
          </div>
        )}
      </div>

        {!isDiscussion && introCountdown > 0 && (
          <div
            role="status"
            aria-live="polite"
            className="px-4 py-3 rounded-2xl bg-[#FFDF00] border-[2.5px] border-[#050505] shadow-[0_4px_0_#050505] flex items-center justify-between gap-3 animate-scale-in"
          >
            <span className="text-sm sm:text-base font-extrabold text-[#050505]">
              Clue round starting in...
            </span>
            <span className="w-9 h-9 rounded-full bg-[#050505] text-[#FFDF00] font-mono font-extrabold text-lg flex items-center justify-center shrink-0 tabular-nums">
              {introCountdown}
            </span>
          </div>
        )}

        {/* Main View Area: Spotlight Stage vs Gallery Grid */}
      {isGalleryView ? (
        <div className="space-y-3 flex-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-chomu-secondary">
              Gallery grid ({players.length} players)
            </span>
            <span className="text-xs text-chomu-muted">
              Green border marks active speaker
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {players.map((p) => {
              const isMe = p.id === myPlayerId;
              const isPeerSpeaking = !!speakingPeers[p.id] || !!p.isSpeaking;
              const isTurn = p.id === spotlightPlayer?.id;

              return (
                <div key={p.id} className="relative aspect-video min-h-[140px] min-w-0">
                  <VideoCard
                    player={p}
                    stream={getPlayerStream(p.id)}
                    isSpeaking={isPeerSpeaking}
                    isLocal={isMe}
                    compact={true}
                    className={isTurn ? 'border-chomu-purple/60' : undefined}
                    actionSlot={
                      isTurn ? (
                        <Badge variant="purple" size="sm">
                          Clue turn
                        </Badge>
                      ) : undefined
                    }
                  />
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-3 flex-1">
          {isMyTurn && !isDiscussion ? (
            /* Focused Active-Speaker View — no giant self-video or clutter */
            <Card className="p-5 sm:p-6 border-[2.5px] border-[#050505] max-w-lg mx-auto w-full flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between gap-2">
                <Badge variant={isChomu ? 'coral' : 'lime'} size="md">
                  {isChomu ? 'You are the Chomu' : 'Your Secret Word'}
                </Badge>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFDF00] border-2 border-[#050505] text-xs font-mono font-extrabold text-[#050505] tabular-nums">
                  <Clock className="w-3.5 h-3.5" strokeWidth={2.4} />
                  {formattedTime}
                </span>
              </div>

              <div className="text-center space-y-2 py-2">
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#050505] tracking-[-0.02em]">
                  Your turn &mdash; Give a clue
                </h2>
                {isChomu ? (
                  hint ? (
                    <div className="p-3.5 rounded-xl bg-[#FFF5F6] border-2 border-[#050505]">
                      <span className="text-xs font-bold text-chomu-secondary block mb-1">
                        Your Chomu hint
                      </span>
                      <span className="text-2xl font-extrabold text-[#050505] block">
                        &ldquo;{hint}&rdquo;
                      </span>
                    </div>
                  ) : (
                    <p className="text-xs font-medium text-chomu-secondary">
                      No hint provided &mdash; blend in with category <strong className="text-[#050505]">{categoryName}</strong>.
                    </p>
                  )
                ) : (
                  <div className="p-4 rounded-xl bg-[#FFF9CC] border-2 border-[#050505]">
                    <span className="text-xs font-bold text-chomu-secondary block mb-1">
                      Give a one-word clue for:
                    </span>
                    <span className="text-2xl sm:text-3xl font-extrabold text-[#050505] tracking-[-0.02em]">
                      {secretWord}
                    </span>
                  </div>
                )}
              </div>

              {nextTurn && (
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={() => {
                    audioService.playButtonTap();
                    nextTurn();
                  }}
                  rightIcon={<ArrowRight className="w-4 h-4" strokeWidth={2.5} />}
                >
                  Done
                </Button>
              )}
            </Card>
          ) : (
            <div className="w-full relative">
              <VideoCard
                player={spotlightPlayer}
                stream={getPlayerStream(spotlightPlayer.id)}
                isSpeaking={
                  !!speakingPeers[spotlightPlayer.id] || !!spotlightPlayer.isSpeaking
                }
                isLocal={spotlightPlayer.id === myPlayerId}
                isSpotlight={true}
                actionSlot={
                  <Badge variant="purple" size="sm">
                    {isDiscussion ? 'Group Discussion' : `${spotlightPlayer.name}'s turn`}
                  </Badge>
                }
              />
            </div>
          )}

          {/* Filmstrip Tray (hidden for active speaker during clue turn so screen stays focused) */}
          {otherPlayers.length > 0 && (!isMyTurn || isDiscussion) && (
            <div className="w-full space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-[#050505] tabular-nums">
                  Players ({otherPlayers.length})
                </span>
                <span className="text-xs font-bold text-[#050505]/75">
                  Other participants
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
        </div>
      )}

      {/* Secret Word Quick Peek Drawer (for observers & discussion; active speaker already sees their word) */}
      {(!isMyTurn || isDiscussion) && (
      <Card className="p-3.5">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setIsSecretPeekOpen(!isSecretPeekOpen)}
            className="inline-flex items-center gap-2 min-h-[44px] px-2 -ml-1 rounded-[10px] text-xs font-medium text-chomu-text hover:bg-chomu-elevated transition-colors"
          >
            {isSecretPeekOpen ? (
              <EyeOff className="w-4 h-4 text-chomu-secondary" strokeWidth={1.5} />
            ) : (
              <Eye className="w-4 h-4 text-chomu-purple" strokeWidth={1.5} />
            )}
            <span>{isSecretPeekOpen ? 'Hide my secret' : 'Peek my secret'}</span>
          </button>

          <span className="text-xs text-chomu-muted">
            Confidential
          </span>
        </div>

            {isSecretPeekOpen ? (
              <div className="mt-3 pt-3 border-t border-chomu-border animate-fade-in text-center">
                {isChomu ? (
                  <div className="p-3 rounded-[10px] bg-chomu-coral/10 border border-chomu-coral/25 space-y-1">
                    <Badge variant="coral" size="sm">
                      You are the Chomu
                    </Badge>
                    {hint ? (
                      <p className="text-sm font-medium text-chomu-text">
                        Your clue: <span className="text-chomu-errorText font-bold">&ldquo;{hint}&rdquo;</span>
                      </p>
                    ) : (
                      <p className="text-xs text-chomu-secondary">
                        No hint given
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="p-3 rounded-[10px] bg-[#E8FCEF] border-2 border-[#050505] space-y-1">
                    <span className="text-xs font-bold text-chomu-successText block">
                      Secret word
                    </span>
                    <span className="text-xl font-extrabold text-[#050505] block">
                      {secretWord}
                    </span>
                  </div>
                )}
              </div>
            ) : null}
          </Card>
      )}

      {/* Bottom Round Action Bar (shown for observers, discussion, or host recovery) */}
      {(!isMyTurn || isDiscussion) && (
      <Card className="sticky bottom-2 z-20 p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-center sm:text-left">
          <span className="text-sm font-bold text-[#050505] block">
            {isDiscussion
              ? 'Group discussion — debate who sounded suspicious'
              : `${spotlightPlayer?.name || 'Player'}'s turn`}
          </span>
          <p className="text-xs font-medium text-chomu-secondary mt-0.5">
            {isDiscussion
              ? isHost
                ? 'Open voting when everyone is ready to accuse.'
                : 'Discussion ends automatically when the timer hits 00:00.'
              : `Waiting for ${spotlightPlayer?.name || 'the active player'} to tap Done.`}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2.5 w-full sm:w-auto">
          {/* Host recovery only when active player is disconnected or turn timer expired */}
          {!isDiscussion && isHost && !isMyTurn && nextTurn && (!spotlightPlayer?.isConnected || timerRemaining === 0) && (
            <Button
              variant="secondary"
              size="md"
              onClick={() => {
                audioService.playButtonTap();
                nextTurn();
              }}
              rightIcon={<ArrowRight className="w-4 h-4" strokeWidth={2.2} />}
            >
              Skip player
            </Button>
          )}

          {isDiscussion && isHost && (
            <Button
              variant="pink"
              size="lg"
              className="flex-1 sm:flex-none sm:w-44"
              onClick={handleEndRound}
              leftIcon={<Vote className="w-4 h-4" strokeWidth={2.2} />}
            >
              Start Voting
            </Button>
          )}
        </div>
      </Card>
      )}
      </div>
    </div>
  );
};
