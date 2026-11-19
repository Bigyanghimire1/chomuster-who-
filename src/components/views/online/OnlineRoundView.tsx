import React, { useState } from 'react';
import {
  Clock,
  Vote,
  HelpCircle,
  Eye,
  EyeOff,
  Mic,
  Radio,
} from 'lucide-react';
import { useMultiplayer } from '../../../context/MultiplayerContext';
import { Button } from '../../common/Button';
import { Card } from '../../common/Card';
import { Badge } from '../../common/Badge';
import { PlayerAvatar } from '../../illustrations/PlayerAvatar';
import { SpeakingIndicator } from '../../common/SpeakingIndicator';
import { audioService } from '../../../services/audioService';

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
  } = useMultiplayer();

  const [isSecretPeekOpen, setIsSecretPeekOpen] = useState<boolean>(false);

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

  // Turn index rotation calculation based on elapsed time for structured party clue-giving
  const totalDuration = roomState?.roundDurationSeconds || 180;
  const elapsed = Math.max(0, totalDuration - timerRemaining);
  const turnDuration = Math.max(15, Math.floor(totalDuration / Math.max(1, players.length)));
  const currentTurnIndex = Math.min(
    players.length - 1,
    Math.floor(elapsed / turnDuration)
  );
  const turnPlayer = players[currentTurnIndex] || players[0];

  const handleEndRound = () => {
    audioService.playButtonTap();
    if (startVoting) {
      startVoting();
    } else {
      endRound();
    }
  };

  return (
    <div className="flex flex-col flex-1 max-w-2xl mx-auto w-full px-4 py-4 select-none animate-fade-in space-y-4">
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

        {/* Synced Countdown Timer Badge */}
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

      {/* Turn Indicator & Speaking Spotlight */}
      <Card className="bg-gradient-to-r from-chomu-elevated via-chomu-surface to-chomu-elevated border-2 border-chomu-purple/40 p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
        {/* Active Speaking Status */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-10 h-10 rounded-2xl bg-chomu-purple/20 border border-chomu-purple/40 flex items-center justify-center shrink-0">
            {activeSpeakerNames.length > 0 ? (
              <Radio className="w-5 h-5 text-chomu-lime animate-pulse" />
            ) : (
              <Mic className="w-5 h-5 text-chomu-purple" />
            )}
          </div>

          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-chomu-muted block">
              Live Voice Activity
            </span>
            <div className="flex items-center gap-2">
              {activeSpeakerNames.length > 0 ? (
                <span className="text-sm font-black text-chomu-lime flex items-center gap-1.5">
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

        {/* Clue Turn Rotation Indicator */}
        {turnPlayer && (
          <div className="flex items-center gap-2 bg-chomu-bg/70 px-3 py-1.5 rounded-xl border border-chomu-border/60">
            <span className="text-[11px] font-bold text-chomu-muted">
              Clue spotlight:
            </span>
            <div className="flex items-center gap-1.5">
              <PlayerAvatar id={turnPlayer.avatar} size="sm" />
              <span className="text-xs font-black text-chomu-purple">
                {turnPlayer.name}
              </span>
            </div>
          </div>
        )}
      </Card>

      {/* Players Grid with Speaking Halos */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-black text-chomu-muted uppercase tracking-wider">
            Circle of Players ({players.length})
          </span>
          <span className="text-[11px] text-chomu-muted font-medium">
            Halos pulse when speaking
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {players.map((p) => {
            const isMe = p.id === myPlayerId;
            const isPeerSpeaking = !!speakingPeers[p.id] || !!p.isSpeaking;

            return (
              <Card
                key={p.id}
                className={`p-3.5 flex flex-col items-center text-center border transition-all ${
                  isPeerSpeaking
                    ? 'bg-chomu-surface border-chomu-lime ring-4 ring-chomu-lime/30 shadow-xl scale-[1.02]'
                    : isMe
                    ? 'bg-chomu-elevated/80 border-chomu-purple/50'
                    : 'bg-chomu-surface/80 border-chomu-border'
                }`}
              >
                <div className="mb-2 relative">
                  <SpeakingIndicator
                    isSpeaking={isPeerSpeaking}
                    size="lg"
                    variant="both"
                    ringColor="lime"
                  >
                    <PlayerAvatar id={p.avatar} size="lg" />
                  </SpeakingIndicator>

                  {p.isHost && (
                    <span className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full bg-chomu-yellow text-chomu-bg text-[9px] font-black uppercase">
                      Host
                    </span>
                  )}
                </div>

                <span className="text-sm font-black text-chomu-text truncate max-w-full">
                  {p.name}
                </span>

                <div className="flex items-center gap-1 mt-1">
                  {isMe && (
                    <Badge variant="purple" size="sm">
                      You
                    </Badge>
                  )}
                  {isPeerSpeaking ? (
                    <Badge variant="lime" size="sm">
                      Talking
                    </Badge>
                  ) : (
                    <span className="text-[10px] text-chomu-muted font-medium">
                      Idle
                    </span>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

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
