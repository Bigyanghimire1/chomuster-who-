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
  Sparkles,
} from 'lucide-react';
import { useMultiplayer } from '../../../context/MultiplayerContext';
import { Button } from '../../common/Button';
import { Card } from '../../common/Card';
import { Badge } from '../../common/Badge';
import { VideoCard } from '../../common/VideoCard';
import { audioService } from '../../../services/audioService';

/**
 * OnlineRoundView — Google Meet / Zoom style dynamic video round view.
 * Features:
 * - State-driven spotlight stage: player whose turn it is is enlarged in the main viewport.
 * - When local player's turn, secret clue/word card is clearly displayed alongside their video.
 * - Smooth bottom/side filmstrip tray for other players.
 * - Toggle for full gallery grid view vs spotlight stage.
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
    localStream,
    peerStreams,
  } = useMultiplayer();

  const [isSecretPeekOpen, setIsSecretPeekOpen] = useState<boolean>(false);
  const [isGalleryView, setIsGalleryView] = useState<boolean>(false);

  const categoryName =
    mySecret?.category || roomState?.secretCategory || 'Mystery';
  const secretWord = mySecret?.word || '';
  const isChomu = !!mySecret?.isChomu;
  const hint = mySecret?.hint || '';

  // Format timer MM:SS
  const minutes = Math.floor(timerRemaining / 60);
  const seconds = timerRemaining % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(
    seconds
  ).padStart(2, '0')}`;

  const isLowTime = timerRemaining <= 30 && timerRemaining > 0;
  const isCriticalTime = timerRemaining <= 10 && timerRemaining > 0;

  // Find currently speaking player(s)
  const activeSpeakerIds = Object.entries(speakingPeers)
    .filter(([_, isSpeaking]) => isSpeaking)
    .map(([id]) => id);

  const activeSpeakerNames = activeSpeakerIds
    .map((id) => players.find((p) => p.id === id)?.name)
    .filter(Boolean);

  // Turn index rotation calculation with roomState.currentTurnPlayerId priority
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
    (roomState as any)?.currentTurnPlayerId || fallbackTurnPlayer?.id;
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
    <div className="flex flex-col flex-1 max-w-4xl mx-auto w-full px-4 py-4 select-none animate-fade-in space-y-4">
      {/* Category Banner & Timer Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-chomu-surface/90 border border-chomu-border rounded-3xl p-4 shadow-xl">
        <div className="text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-chomu-bg border border-chomu-border text-xs font-bold text-chomu-purple mb-1">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>CATEGORY: {categoryName.toUpperCase()}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-chomu-text tracking-tight uppercase">
            ROUND IN PROGRESS
          </h1>
        </div>

        {/* View Toggle & Synced Countdown Timer Badge */}
        <div className="flex items-center gap-2">
          {/* Google Meet style View Mode Toggle */}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsGalleryView(!isGalleryView)}
            leftIcon={
              isGalleryView ? (
                <Minimize2 className="w-4 h-4 text-chomu-purple" />
              ) : (
                <LayoutGrid className="w-4 h-4 text-chomu-purple" />
              )
            }
          >
            {isGalleryView ? 'Spotlight View' : 'Gallery View'}
          </Button>

          <div
            className={`flex items-center gap-2.5 px-4 py-2 rounded-2xl border transition-all ${
              isCriticalTime
                ? 'bg-chomu-coral/20 border-chomu-coral text-chomu-coral animate-pulse'
                : isLowTime
                ? 'bg-chomu-yellow/20 border-chomu-yellow text-chomu-yellow'
                : 'bg-chomu-bg border-chomu-border text-chomu-lime'
            }`}
          >
            <Clock className="w-5 h-5 shrink-0" />
            <div className="text-right">
              <span className="text-[10px] font-black uppercase tracking-wider block leading-none">
                Time Left
              </span>
              <span className="text-2xl font-mono font-black tracking-wider leading-tight">
                {formattedTime}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Voice Activity Status Strip */}
      <Card className="bg-gradient-to-r from-chomu-elevated via-chomu-surface to-chomu-elevated border-2 border-chomu-purple/40 p-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-chomu-purple/20 border border-chomu-purple/40 flex items-center justify-center shrink-0">
            {activeSpeakerNames.length > 0 ? (
              <Radio className="w-4 h-4 text-chomu-lime animate-pulse" />
            ) : (
              <Mic className="w-4 h-4 text-chomu-purple" />
            )}
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-chomu-muted block">
              Active Audio
            </span>
            <div className="flex items-center gap-2">
              {activeSpeakerNames.length > 0 ? (
                <span className="text-xs font-black text-chomu-lime flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-chomu-lime animate-ping" />
                  {activeSpeakerNames.join(', ')} speaking...
                </span>
              ) : (
                <span className="text-xs text-chomu-muted font-medium">
                  Listening to players...
                </span>
              )}
            </div>
          </div>
        </div>

        {spotlightPlayer && !isGalleryView && (
          <div className="flex items-center gap-2 bg-chomu-bg/70 px-3 py-1 rounded-xl border border-chomu-border/60">
            <span className="text-[11px] font-bold text-chomu-muted">
              Current speaker:
            </span>
            <span className="text-xs font-black text-chomu-purple">
              {spotlightPlayer.name} {isMyTurn ? '(You)' : ''}
            </span>
          </div>
        )}
      </Card>

      {/* Main View Area: Spotlight Stage vs Gallery Grid View */}
      {isGalleryView ? (
        /* Full Gallery Grid View (Google Meet / Zoom style) */
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-black uppercase tracking-wider text-chomu-muted">
              Gallery Grid ({players.length} Players)
            </span>
            <span className="text-[11px] text-chomu-muted font-medium">
              Halos pulse when speaking
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {players.map((p) => {
              const isMe = p.id === myPlayerId;
              const isPeerSpeaking = !!speakingPeers[p.id] || !!p.isSpeaking;
              const isTurn = p.id === spotlightPlayer?.id;

              return (
                <div key={p.id} className="relative aspect-video min-h-[140px] sm:min-h-[160px]">
                  <VideoCard
                    player={p}
                    stream={getPlayerStream(p.id)}
                    isSpeaking={isPeerSpeaking}
                    isLocal={isMe}
                    isSpotlight={isTurn}
                  />
                  {isTurn && (
                    <div className="absolute top-2 left-2 z-20 pointer-events-none">
                      <Badge variant="purple" size="sm" className="shadow-md">
                        CLUE TURN
                      </Badge>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* State-Driven Spotlight Stage */
        <div className="space-y-4">
          {/* Spotlight Stage Viewport */}
          {isMyTurn ? (
            /* Local Player's Turn: Enlarged video alongside secret clue/word card */
            <div className="flex flex-col md:flex-row gap-4 w-full">
              {/* Local Video Card */}
              <div className="flex-1 w-full min-h-[260px] sm:min-h-[320px]">
                <VideoCard
                  player={spotlightPlayer}
                  stream={localStream}
                  isSpeaking={!!speakingPeers[myPlayerId] || !!spotlightPlayer.isSpeaking}
                  isLocal={true}
                  isSpotlight={true}
                />
              </div>

              {/* Secret Clue / Word Card Alongside Video */}
              <div className="flex-1 w-full bg-gradient-to-br from-chomu-surface via-chomu-surface to-chomu-elevated border-2 border-chomu-purple/60 rounded-2xl p-5 shadow-2xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant={isChomu ? 'coral' : 'lime'} size="md">
                      {isChomu ? 'IMPOSTER CLUE' : 'SECRET WORD'}
                    </Badge>
                    <span className="text-[11px] font-black uppercase tracking-wider text-chomu-lime animate-pulse flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> YOUR TURN TO SPEAK!
                    </span>
                  </div>

                  {isChomu ? (
                    <div className="space-y-3">
                      <h3 className="text-2xl font-black text-chomu-coral tracking-tight">
                        YOU ARE THE CHOMU!
                      </h3>
                      {hint ? (
                        <div className="p-3.5 rounded-xl bg-chomu-bg/90 border border-chomu-coral/40">
                          <span className="text-[10px] font-bold text-chomu-muted uppercase tracking-widest block mb-1">
                            Your Imposter Hint
                          </span>
                          <span className="text-2xl font-black text-chomu-coral tracking-wide block">
                            "{hint}"
                          </span>
                        </div>
                      ) : (
                        <div className="p-3.5 rounded-xl bg-chomu-bg/90 border border-chomu-coral/40">
                          <p className="text-sm font-bold text-chomu-muted">
                            No hint provided. Bluff with confidence!
                          </p>
                        </div>
                      )}
                      <p className="text-xs text-chomu-muted leading-relaxed">
                        Blend in with the category <strong className="text-chomu-text">{categoryName}</strong>. Give a clue believable enough so fellow players won't suspect you!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="p-3.5 rounded-xl bg-chomu-bg/90 border border-chomu-lime/40">
                        <span className="text-[10px] font-bold text-chomu-lime uppercase tracking-widest block mb-1">
                          Category: {categoryName}
                        </span>
                        <span className="text-3xl sm:text-4xl font-black text-chomu-lime tracking-wide block drop-shadow-sm">
                          {secretWord}
                        </span>
                      </div>
                      <p className="text-xs text-chomu-muted leading-relaxed">
                        Say your clue out loud now. Civilians know this secret word — give a clue subtle enough that Chomu won't guess the word!
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-3 mt-3 border-t border-chomu-border/60 flex items-center justify-between text-[11px] text-chomu-muted font-medium">
                  <span>Confidential • Visible only to you</span>
                  <span className="text-chomu-lime font-bold flex items-center gap-1">
                    <Mic className="w-3.5 h-3.5" /> Mic Ready
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* Another Player's Turn: Enlarged Spotlight Viewport */
            <div className="w-full relative min-h-[260px] sm:min-h-[340px]">
              <VideoCard
                player={spotlightPlayer}
                stream={getPlayerStream(spotlightPlayer.id)}
                isSpeaking={
                  !!speakingPeers[spotlightPlayer.id] || !!spotlightPlayer.isSpeaking
                }
                isLocal={spotlightPlayer.id === myPlayerId}
                isSpotlight={true}
              />
              <div className="absolute top-3 right-3 z-20 pointer-events-none">
                <Badge variant="purple" size="md" className="shadow-lg">
                  {spotlightPlayer.name}'s Clue Turn
                </Badge>
              </div>
            </div>
          )}

          {/* Smooth Bottom Filmstrip Tray for Other Players */}
          {otherPlayers.length > 0 && (
            <div className="w-full pt-1">
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-xs font-black uppercase tracking-wider text-chomu-muted">
                  Filmstrip Tray ({otherPlayers.length})
                </span>
                <span className="text-[11px] text-chomu-muted font-medium">
                  Other participants
                </span>
              </div>

              <div className="flex gap-3 overflow-x-auto pb-2 pt-1 px-1 scrollbar-thin snap-x">
                {otherPlayers.map((p) => {
                  const isMe = p.id === myPlayerId;
                  const isPeerSpeaking = !!speakingPeers[p.id] || !!p.isSpeaking;

                  return (
                    <div
                      key={p.id}
                      className="w-36 sm:w-44 h-24 sm:h-28 shrink-0 snap-start"
                    >
                      <VideoCard
                        player={p}
                        stream={getPlayerStream(p.id)}
                        isSpeaking={isPeerSpeaking}
                        isLocal={isMe}
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
      <Card className="bg-chomu-surface/90 border border-chomu-border p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSecretPeekOpen(!isSecretPeekOpen)}
              className="p-1.5 rounded-xl bg-chomu-bg border border-chomu-border hover:bg-chomu-elevated text-chomu-purple transition-colors"
            >
              {isSecretPeekOpen ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
            <span className="text-xs font-black text-chomu-text">
              {isSecretPeekOpen ? 'Hide My Secret' : 'Peek My Secret'}
            </span>
          </div>

          <span className="text-[10px] text-chomu-muted font-medium">
            Confidential
          </span>
        </div>

        {isSecretPeekOpen && (
          <div className="mt-3 pt-3 border-t border-chomu-border/60 animate-scale-in text-center">
            {isChomu ? (
              <div className="p-3 rounded-2xl bg-chomu-coral/15 border border-chomu-coral/30 space-y-1">
                <Badge variant="coral" size="sm">
                  YOU ARE THE CHOMU
                </Badge>
                {hint ? (
                  <p className="text-sm font-black text-chomu-text">
                    Your Clue: <strong className="text-chomu-coral">"{hint}"</strong>
                  </p>
                ) : (
                  <p className="text-xs text-chomu-muted font-medium">
                    No hint given. Blend in!
                  </p>
                )}
              </div>
            ) : (
              <div className="p-3 rounded-2xl bg-chomu-lime/15 border border-chomu-lime/30 space-y-1">
                <span className="text-[10px] font-bold text-chomu-lime uppercase tracking-widest block">
                  Secret Word
                </span>
                <span className="text-2xl font-black text-chomu-text tracking-wide block">
                  {secretWord}
                </span>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Host Controls & Actions */}
      <div className="pt-2 sticky bottom-4 z-20">
        <Card className="bg-chomu-surface/95 backdrop-blur-md border border-chomu-border p-3.5 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-center sm:text-left">
            <span className="text-xs font-black text-chomu-text block">
              Give your clues and find the imposter!
            </span>
            <p className="text-[11px] text-chomu-muted font-medium">
              {isHost
                ? 'Ready to accuse? End the round to initiate voting.'
                : 'The host will trigger voting once everyone has spoken.'}
            </p>
          </div>

          {isHost ? (
            <Button
              variant="coral"
              size="lg"
              fullWidth
              className="sm:w-60"
              onClick={handleEndRound}
              leftIcon={<Vote className="w-5 h-5" />}
            >
              START VOTING
            </Button>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-chomu-muted font-bold">
              <Clock className="w-4 h-4 text-chomu-purple animate-spin" />
              <span>Awaiting Host Accusation</span>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
