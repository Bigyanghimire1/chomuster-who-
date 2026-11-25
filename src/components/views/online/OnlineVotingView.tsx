import React, { useState } from 'react';
import {
  Vote,
  Clock,
  Check,
  CheckCircle2,
  HelpCircle,
  BarChart3,
} from 'lucide-react';
import { useMultiplayer } from '../../../context/MultiplayerContext';
import { Button } from '../../common/Button';
import { Card } from '../../common/Card';
import { Badge } from '../../common/Badge';
import { PlayerAvatar } from '../../illustrations/PlayerAvatar';
import { SpeakingIndicator } from '../../common/SpeakingIndicator';
import { audioService } from '../../../services/audioService';

export const OnlineVotingView: React.FC = () => {
  const {
    players,
    myPlayerId,
    myPlayer,
    isHost,
    roomState,
    vote,
    endRound,
    timerRemaining,
    speakingPeers,
  } = useMultiplayer();

  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(
    () => myPlayer?.votedForId || null
  );

  const hasLockedVote = !!myPlayer?.votedForId;
  const lockedVoteTarget = players.find((p) => p.id === myPlayer?.votedForId);

  const voteCounts: Record<string, number> = {};
  let totalVotesCast = 0;
  players.forEach((p) => {
    if (p.votedForId) {
      voteCounts[p.votedForId] = (voteCounts[p.votedForId] || 0) + 1;
      totalVotesCast++;
    }
  });

  const categoryName = roomState?.secretCategory || 'Mystery';
  const minutes = Math.floor(timerRemaining / 60);
  const seconds = timerRemaining % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(
    seconds
  ).padStart(2, '0')}`;

  const handleSelect = (playerId: string) => {
    if (hasLockedVote) return;
    setSelectedPlayerId(playerId);
    audioService.playButtonTap();
  };

  const handleConfirmVote = () => {
    if (!selectedPlayerId || hasLockedVote) return;
    audioService.playVoteTap();
    vote(selectedPlayerId);
  };

  const selectedPlayer = players.find((p) => p.id === selectedPlayerId);

  return (
    <div className="flex flex-col flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-5 select-none animate-fade-in space-y-5">
      {/* Header & Voting Timer */}
      <Card className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-medium text-chomu-secondary mb-1">
            <HelpCircle className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span>Category: {categoryName}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-semibold text-chomu-text tracking-[-0.02em]">
            Who is the Chomu?
          </h1>
          <p className="text-xs text-chomu-secondary mt-0.5">
            Select a player to cast your accusation
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-2 rounded-[10px] bg-chomu-bgSecondary border border-white/[0.08] text-chomu-text self-start sm:self-auto">
          <Clock className="w-4 h-4 shrink-0 text-chomu-secondary" strokeWidth={1.5} />
          <span className="text-lg font-mono font-semibold tabular-nums leading-none">
            {formattedTime}
          </span>
        </div>
      </Card>

      {roomState?.hostGracePeriodEnd && roomState.hostGracePeriodEnd > Date.now() && (
        <div className="bg-chomu-yellow/10 border border-chomu-yellow/30 text-chomu-yellow px-4 py-2.5 rounded-[10px] text-xs font-medium text-center">
          Host connection interrupted. Waiting for reconnection (10s grace period)
        </div>
      )}

      {/* Voting Progress Strip */}
      <div className="px-4 py-2.5 rounded-xl bg-chomu-surface border border-white/[0.08] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Vote className="w-4 h-4 text-chomu-secondary" strokeWidth={1.5} />
          <span className="text-xs font-medium text-chomu-text tabular-nums">
            Votes cast: {totalVotesCast} of {players.length}
          </span>
        </div>

        {hasLockedVote ? (
          <Badge variant="lime" size="sm">
            <Check className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span>Vote locked</span>
          </Badge>
        ) : (
          <Badge variant="coral" size="sm">
            Vote pending
          </Badge>
        )}
      </div>

      {/* Players Card Grid for Voting */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 flex-1 items-start">
        {players.map((p) => {
          const isMe = p.id === myPlayerId;
          const isSelected = selectedPlayerId === p.id;
          const isPeerSpeaking = !!speakingPeers[p.id] || !!p.isSpeaking;
          const votesForThisPlayer = voteCounts[p.id] || 0;
          const hasThisPlayerVoted = !!p.votedForId;

          return (
            <Card
              key={p.id}
              onClick={() => handleSelect(p.id)}
              className={`p-4 flex flex-col items-center justify-between text-center relative ${
                isSelected
                  ? 'bg-chomu-elevated border-chomu-coral'
                  : hasLockedVote
                    ? 'bg-chomu-surface border-white/[0.08] cursor-default'
                    : 'bg-chomu-surface border-white/[0.08] hover:border-chomu-purple/60 hover:bg-chomu-elevated cursor-pointer'
              }`}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 w-6 h-6 rounded-md bg-chomu-coral text-chomu-bg flex items-center justify-center">
                  <Check className="w-4 h-4" strokeWidth={2} />
                </div>
              )}

              <div className="mb-2.5">
                <SpeakingIndicator
                  isSpeaking={isPeerSpeaking}
                  size="lg"
                  variant="ring"
                  ringColor="coral"
                >
                  <PlayerAvatar id={p.avatar} size="lg" />
                </SpeakingIndicator>
              </div>

              <div className="space-y-1 w-full min-w-0 px-2">
                <span className="text-sm font-semibold text-chomu-text truncate block">
                  {p.name} {isMe && '(You)'}
                </span>

                <div className="flex items-center justify-center gap-1.5">
                  {hasThisPlayerVoted ? (
                    <span className="text-xs text-chomu-lime inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                      <span>Voted</span>
                    </span>
                  ) : (
                    <span className="text-xs text-chomu-muted">
                      Deciding
                    </span>
                  )}
                </div>
              </div>

              {hasLockedVote && (
                <div className="mt-3 pt-2.5 border-t border-white/[0.08] w-full flex items-center justify-center gap-1.5">
                  <BarChart3 className="w-3.5 h-3.5 text-chomu-secondary" strokeWidth={1.5} />
                  <span className="text-xs font-mono font-medium text-chomu-text tabular-nums">
                    {votesForThisPlayer} {votesForThisPlayer === 1 ? 'vote' : 'votes'}
                  </span>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Bottom Action Bar in natural flow (no collision with VoiceControls dock) */}
      <Card className="p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-center sm:text-left">
          {hasLockedVote ? (
            <div>
              <span className="text-sm font-medium text-chomu-lime block">
                Accusation confirmed
              </span>
              <span className="text-xs text-chomu-secondary">
                You voted for <strong className="text-chomu-text font-medium">{lockedVoteTarget?.name || 'Player'}</strong>
              </span>
            </div>
          ) : selectedPlayer ? (
            <div>
              <span className="text-sm font-medium text-chomu-text block">
                Accusing {selectedPlayer.name}
              </span>
              <span className="text-xs text-chomu-secondary">
                Confirm your vote to lock it in
              </span>
            </div>
          ) : (
            <div>
              <span className="text-sm font-medium text-chomu-secondary block">
                No player selected
              </span>
              <span className="text-xs text-chomu-muted">
                Choose a player card above
              </span>
            </div>
          )}
        </div>

        <div className="w-full sm:w-auto">
          {!hasLockedVote ? (
            <Button
              variant="coral"
              size="lg"
              fullWidth
              className="sm:w-56"
              disabled={!selectedPlayerId}
              onClick={handleConfirmVote}
              leftIcon={<Vote className="w-4 h-4" strokeWidth={1.5} />}
            >
              {selectedPlayer ? `Vote for ${selectedPlayer.name}` : 'Confirm accusation'}
            </Button>
          ) : (
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <Badge variant="lime" size="md">
                <Check className="w-3.5 h-3.5" strokeWidth={1.5} />
                <span>Vote recorded</span>
              </Badge>
              {isHost && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={endRound}
                  className="w-full sm:w-auto"
                >
                  Resolve early
                </Button>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
