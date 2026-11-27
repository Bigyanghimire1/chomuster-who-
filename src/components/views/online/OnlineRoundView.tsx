import React, { useState } from 'react';
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

  const [isSecretPeekOpen, setIsSecretPeekOpen] = useState<boolean>(false);
  const [isGalleryView, setIsGalleryView] = useState<boolean>(false);

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
              {isDiscussion ? 'Group Discussion' : 'Round in Progress'}
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
        <div className="bg-chomu-yellow/10 border border-chomu-yellow/30 text-chomu-yellow px-4 py-2.5 rounded-[10px] text-xs font-medium text-center">
          Host connection interrupted. Waiting for reconnection (10s grace period)
        </div>
      )}

      {/* Active Audio & Turn Summary Strip */}
      <div className="px-4 py-2.5 rounded-xl bg-white border border-chomu-border flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          {activeSpeakerNames.length > 0 ? (
            <Radio className="w-4 h-4 text-chomu-lime shrink-0" strokeWidth={1.5} />
          ) : (
            <Mic className="w-4 h-4 text-chomu-secondary shrink-0" strokeWidth={1.5} />
          )}
          {activeSpeakerNames.length > 0 ? (
            <span className="text-xs font-medium text-chomu-lime">
              {activeSpeakerNames.join(', ')} speaking
            </span>
          ) : (
            <span className="text-xs text-chomu-secondary">
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
        <div className="space-y-4 flex-1">
          {isMyTurn ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 w-full">
              <div className="md:col-span-7 min-h-[260px] sm:min-h-[320px]">
                <VideoCard
                  player={spotlightPlayer}
                  stream={localStream}
                  isSpeaking={!!speakingPeers[myPlayerId] || !!spotlightPlayer.isSpeaking}
                  isLocal={true}
                  isSpotlight={true}
                />
              </div>

              {/* Confidential Clue Card */}
              <Card className="md:col-span-5 p-5 border-chomu-purple/40 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant={isChomu ? 'coral' : 'lime'} size="md">
                      {isChomu ? 'Chomu clue' : 'Secret word'}
                    </Badge>
                    <span className="text-xs font-medium text-chomu-lime">
                      Your turn to speak
                    </span>
                  </div>

                  {isChomu ? (
                    <div className="space-y-3">
                      <h2 className="text-2xl font-semibold text-chomu-coral tracking-[-0.02em]">
                        You are the Chomu
                      </h2>
                      {hint ? (
                        <div className="p-3.5 rounded-[10px] bg-chomu-bgSecondary border border-chomu-coral/30">
                          <span className="text-xs text-chomu-muted block mb-1">
                            Your Chomu hint
                          </span>
                          <span className="text-2xl font-semibold text-chomu-text block">
                            &ldquo;{hint}&rdquo;
                          </span>
                        </div>
                      ) : (
                        <div className="p-3.5 rounded-[10px] bg-chomu-bgSecondary border border-chomu-border">
                          <p className="text-sm text-chomu-secondary">
                            No hint provided. Bluff with confidence
                          </p>
                        </div>
                      )}
                      <p className="text-xs text-chomu-secondary leading-5">
                        Blend in with the category <strong className="text-chomu-text font-medium">{categoryName}</strong> so others suspect someone else.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="p-4 rounded-xl bg-chomu-bgSecondary border border-chomu-yellow/50 text-center">
                        <span className="text-xs text-chomu-secondary block mb-2">
                          Give a hint for the word:
                        </span>
                        <span className="inline-block px-5 py-1.5 rounded-full border-2 border-chomu-yellow bg-white text-2xl sm:text-3xl font-bold text-chomu-text tracking-[-0.02em]">
                          {secretWord}
                        </span>
                      </div>
                      <p className="text-xs text-chomu-secondary leading-5">
                        Give a single-word clue that civilians recognize without giving away the word to the Chomu.
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-3 mt-4 border-t border-chomu-border flex items-center justify-between text-xs text-chomu-muted">
                  <span>Visible only to you</span>
                  <span className="text-chomu-lime inline-flex items-center gap-1 font-medium">
                    <Mic className="w-3.5 h-3.5" strokeWidth={1.5} />
                    <span>Mic ready</span>
                  </span>
                </div>
              </Card>
            </div>
          ) : (
            <div className="w-full relative min-h-[260px] sm:min-h-[340px]">
              <VideoCard
                player={spotlightPlayer}
                stream={getPlayerStream(spotlightPlayer.id)}
                isSpeaking={
                  !!speakingPeers[spotlightPlayer.id] || !!spotlightPlayer.isSpeaking
                }
                isLocal={spotlightPlayer.id === myPlayerId}
                isSpotlight={true}
                actionSlot={
                  <Badge variant="purple" size="md">
                    {spotlightPlayer.name}&apos;s Clue Turn
                  </Badge>
                }
              />
            </div>
          )}

          {/* Filmstrip Tray */}
          {otherPlayers.length > 0 && (
            <div className="w-full space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-chomu-secondary tabular-nums">
                  Filmstrip Tray ({otherPlayers.length})
                </span>
                <span className="text-xs text-chomu-muted">
                  Other participants
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

      {/* Secret Word Quick Peek Drawer */}
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

        {isSecretPeekOpen && (
          <div className="mt-3 pt-3 border-t border-chomu-border animate-fade-in text-center">
            {isChomu ? (
              <div className="p-3 rounded-[10px] bg-chomu-coral/10 border border-chomu-coral/25 space-y-1">
                <Badge variant="coral" size="sm">
                  You are the Chomu
                </Badge>
                {hint ? (
                  <p className="text-sm font-medium text-chomu-text">
                    Your clue: <span className="text-chomu-coral">&ldquo;{hint}&rdquo;</span>
                  </p>
                ) : (
                  <p className="text-xs text-chomu-secondary">
                    No hint given
                  </p>
                )}
              </div>
            ) : (
              <div className="p-3 rounded-[10px] bg-chomu-lime/10 border border-chomu-lime/25 space-y-1">
                <span className="text-xs text-chomu-lime block">
                  Secret word
                </span>
                <span className="text-xl font-semibold text-chomu-text block">
                  {secretWord}
                </span>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Bottom Round Action Bar (natural flow, sits cleanly above VoiceControls dock) */}
      <Card className="p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-center sm:text-left">
          <span className="text-sm font-medium text-chomu-text block">
            {isDiscussion
              ? 'Group discussion — debate who sounded suspicious'
              : isMyTurn
                ? 'Your turn — give a one-word clue aloud'
                : 'Give your clues and spot the Chomu'}
          </span>
          <p className="text-xs text-chomu-secondary mt-0.5">
            {isHost
              ? isDiscussion
                ? 'Open voting when everyone is ready to accuse.'
                : 'Advance turns or start voting once everyone has spoken.'
              : isMyTurn && !isDiscussion
                ? 'Tap Done speaking when you finish your clue.'
                : 'The host will open voting once discussion wraps up.'}
          </p>
        </div>

        {isHost ? (
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2.5 w-full sm:w-auto">
            {!isDiscussion && nextTurn && (
              <Button
                variant="primary"
                size="lg"
                className="flex-1 sm:flex-none sm:w-44"
                onClick={() => {
                  audioService.playButtonTap();
                  nextTurn();
                }}
                rightIcon={<ArrowRight className="w-4 h-4" strokeWidth={2.2} />}
              >
                {isMyTurn ? 'Done speaking' : 'Next turn'}
              </Button>
            )}
            <Button
              variant="pink"
              size="lg"
              className="flex-1 sm:flex-none sm:w-44"
              onClick={handleEndRound}
              leftIcon={<Vote className="w-4 h-4" strokeWidth={2.2} />}
            >
              Start Voting
            </Button>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2.5 w-full sm:w-auto">
            {!isDiscussion && nextTurn && isMyTurn && (
              <Button
                variant="primary"
                size="lg"
                className="flex-1 sm:flex-none sm:w-44"
                onClick={() => {
                  audioService.playButtonTap();
                  nextTurn();
                }}
                rightIcon={<ArrowRight className="w-4 h-4" strokeWidth={2.2} />}
              >
                Done speaking
              </Button>
            )}
            {!isMyTurn && (
              <span className="text-xs font-bold opacity-80">
                Awaiting host vote trigger
              </span>
            )}
          </div>
        )}
      </Card>
      </div>
    </div>
  );
};
