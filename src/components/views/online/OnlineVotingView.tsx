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
    rawPhase,
    runoffCandidateIds = [],
    mediaQuotaExhausted,
  } = useMultiplayer();

  const isRunoff = rawPhase === 'VOTING_RUNOFF' && runoffCandidateIds.length > 0;
  const votablePlayers = isRunoff
    ? players.filter((p) => runoffCandidateIds.includes(p.id))
    : players;

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

        <div
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border-2 border-[#050505] shadow-[0_3px_0_#050505] self-start sm:self-auto ${
            timerRemaining <= 10 && timerRemaining > 0
              ? 'bg-[#FF5D73] text-[#050505]'
              : 'bg-[#FFDF00] text-[#050505]'
          }`}
        >
          <Clock className="w-4 h-4 shrink-0" strokeWidth={2.25} />
          <span className="text-lg font-mono font-extrabold tabular-nums leading-none">
            {formattedTime}
          </span>
        </div>
      </Card>

      {roomState?.hostGracePeriodEnd && roomState.hostGracePeriodEnd > Date.now() && (
        <div className="bg-[#FFDF00] border-2 border-[#050505] text-[#050505] px-4 py-2.5 rounded-xl text-xs font-bold text-center shadow-[0_3px_0_#050505]">
          Host connection interrupted. Waiting for reconnection (10s grace period)
        </div>
      )}

      {isRunoff && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 px-4 py-2.5 rounded-xl text-xs font-semibold text-center">
          Runoff Tie-Breaker: Vote between the tied suspects. A second tie awards the win to the Chomu.
        </div>
      )}

      {mediaQuotaExhausted && (
        <div className="bg-chomu-bgSecondary border border-chomu-border text-chomu-secondary px-4 py-2 rounded-xl text-xs text-center">
          Live video/audio monthly quota reached — text chat and voting continue normally.
        </div>
      )}

      {/* Voting Progress Strip */}
      <div className="px-4 py-2.5 rounded-xl bg-white border border-chomu-border flex items-center justify-between">
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
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 flex-1 items-start">
        {votablePlayers.map((p) => {
          const isMe = p.id === myPlayerId;
          const isDisabledTarget = hasLockedVote || (rawPhase !== null && rawPhase !== undefined && isMe);
          const isSelected = selectedPlayerId === p.id;
          const isPeerSpeaking = !!speakingPeers[p.id] || !!p.isSpeaking;
          const votesForThisPlayer = voteCounts[p.id] || 0;
          const hasThisPlayerVoted = !!p.votedForId;

          return (
            <Card
              key={p.id}
              onClick={() => {
                if (!isDisabledTarget) handleSelect(p.id);
              }}
              className={`p-4 flex flex-col items-center justify-between text-center relative min-w-0 ${
                isSelected
                  ? 'bg-[#F28BCB] border-[2.5px] border-[#050505]'
                  : isDisabledTarget
                    ? 'bg-white border-[2.5px] border-[#050505] cursor-default opacity-75'
                    : 'bg-white border-[2.5px] border-[#050505] hover:bg-[#FFF9CC] cursor-pointer'
              }`}
            >
              {/* Dedicated top row so Suspect badge never overlaps avatar */}
              <div className="w-full flex items-center justify-end min-h-[24px] mb-1.5">
                {isSelected && (
                  <div className="px-2.5 py-0.5 rounded-full bg-[#050505] text-white text-[10px] font-extrabold inline-flex items-center gap-1 shadow-[0_2px_0_#050505]">
                    <Check className="w-3 h-3" strokeWidth={2.5} />
                    <span>Suspect</span>
                  </div>
                )}
              </div>

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
                <span className="text-sm font-bold text-[#050505] truncate block">
                  {p.name} {isMe && '(You)'}
                </span>

                <div className="flex items-center justify-center gap-1.5">
                  {hasThisPlayerVoted ? (
                    <span className="text-xs font-bold text-chomu-successText inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2.2} />
                      <span>Voted</span>
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-chomu-muted">
                      Deciding
                    </span>
                  )}
                </div>
              </div>

              {hasLockedVote && (
                <div className="mt-3 pt-2.5 border-t border-chomu-border w-full flex items-center justify-center gap-1.5">
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

      {/* Sticky Bottom Action Bar — always sits cleanly above VoiceControls dock */}
      <Card className="sticky bottom-2 z-20 p-3.5 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-2.5">
        <div className="text-center sm:text-left">
          {hasLockedVote ? (
            <div>
              <span className="text-sm font-extrabold text-chomu-successText block">
                Accusation confirmed
              </span>
              <span className="text-xs font-medium text-chomu-secondary">
                You voted for <strong className="text-[#050505] font-extrabold">{lockedVoteTarget?.name || 'Player'}</strong>
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
              variant="primary"
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
