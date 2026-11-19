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

  // Local selection before locking in
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(
    () => myPlayer?.votedForId || null
  );

  const hasLockedVote = !!myPlayer?.votedForId;
  const lockedVoteTarget = players.find((p) => p.id === myPlayer?.votedForId);

  // Compute live vote counts
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
    if (hasLockedVote) return; // Locked
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
    <div className="flex flex-col flex-1 max-w-2xl mx-auto w-full px-4 py-4 select-none animate-fade-in space-y-4">
      {/* Header & Voting Timer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-chomu-surface/90 border border-chomu-border rounded-3xl p-4 shadow-xl">
        <div className="text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-chomu-bg border border-chomu-border text-xs font-bold text-chomu-purple mb-1">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>CATEGORY: {categoryName.toUpperCase()}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-chomu-text tracking-tight uppercase">
            WHO IS THE CHOMU?
          </h1>
          <p className="text-xs text-chomu-muted font-medium">
            Tap a player to cast your accusation
          </p>
        </div>

        {/* Timer */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-chomu-bg border border-chomu-border text-chomu-lime shadow-sm">
          <Clock className="w-5 h-5" />
          <div className="text-right">
            <span className="text-[10px] font-black uppercase tracking-wider block leading-none">
              Voting Time
            </span>
            <span className="text-2xl font-mono font-black tracking-wider leading-tight">
              {formattedTime}
            </span>
          </div>
        </div>
      </div>

      {/* Voting Progress Status */}
      <Card className="bg-chomu-surface/80 border border-chomu-border p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Vote className="w-4 h-4 text-chomu-coral" />
          <span className="text-xs font-black text-chomu-text">
            Votes Cast: {totalVotesCast} of {players.length}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {hasLockedVote ? (
            <Badge variant="lime" size="sm">
              <Check className="w-3 h-3 inline mr-0.5" /> Your Vote Locked
            </Badge>
          ) : (
            <Badge variant="coral" size="sm">
              Action Required
            </Badge>
          )}
        </div>
      </Card>

      {/* Players Card Grid for Voting */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
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
              className={`p-4 flex flex-col items-center justify-between text-center border-2 transition-all cursor-pointer relative ${
                isSelected
                  ? 'bg-chomu-elevated border-chomu-coral shadow-xl ring-4 ring-chomu-coral/30 scale-[1.02]'
                  : hasLockedVote
                  ? 'bg-chomu-surface/80 border-chomu-border hover:border-chomu-border/80'
                  : 'bg-chomu-surface/80 border-chomu-border hover:border-chomu-purple hover:bg-chomu-elevated/60 active:scale-95'
              }`}
            >
              {/* Selected indicator checkmark */}
              {isSelected && (
                <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-chomu-coral text-chomu-bg flex items-center justify-center shadow-md">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}

              {/* Player Avatar */}
              <div className="mb-2">
                <SpeakingIndicator
                  isSpeaking={isPeerSpeaking}
                  size="lg"
                  variant="ring"
                  ringColor="coral"
                >
                  <PlayerAvatar id={p.avatar} size="lg" />
                </SpeakingIndicator>
              </div>

              {/* Player Name */}
              <div className="space-y-0.5 w-full">
                <span className="text-base font-black text-chomu-text truncate block">
                  {p.name} {isMe && '(You)'}
                </span>

                <div className="flex items-center justify-center gap-1.5 pt-1">
                  {hasThisPlayerVoted ? (
                    <span className="text-[10px] text-chomu-lime font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Voted
                    </span>
                  ) : (
                    <span className="text-[10px] text-chomu-muted font-medium">
                      Deciding...
                    </span>
                  )}
                </div>
              </div>

              {/* Live Vote Count Badge (visible once user has locked their vote) */}
              {hasLockedVote && (
                <div className="mt-3 pt-2.5 border-t border-chomu-border/60 w-full flex items-center justify-center gap-1.5">
                  <BarChart3 className="w-3.5 h-3.5 text-chomu-coral" />
                  <span className="text-xs font-black text-chomu-text">
                    {votesForThisPlayer}{' '}
                    {votesForThisPlayer === 1 ? 'vote' : 'votes'}
                  </span>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="pt-2 sticky bottom-4 z-20">
        <Card className="bg-chomu-surface/95 backdrop-blur-md border border-chomu-border p-3.5 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-center sm:text-left">
            {hasLockedVote ? (
              <div>
                <span className="text-xs font-black text-chomu-lime block">
                  Accusation Confirmed
                </span>
                <span className="text-[11px] text-chomu-muted font-medium">
                  You voted for{' '}
                  <strong className="text-chomu-text">
                    {lockedVoteTarget?.name || 'Player'}
                  </strong>
                  . Results will reveal when everyone finishes!
                </span>
              </div>
            ) : selectedPlayer ? (
              <div>
                <span className="text-xs font-black text-chomu-text block">
                  Accusing: {selectedPlayer.name}
                </span>
                <span className="text-[11px] text-chomu-muted font-medium">
                  Are you confident they are the Chomu?
                </span>
              </div>
            ) : (
              <div>
                <span className="text-xs font-black text-chomu-muted block">
                  No player selected
                </span>
                <span className="text-[11px] text-chomu-muted font-medium">
                  Select a player card above to accuse them.
                </span>
              </div>
            )}
          </div>

          <div className="w-full sm:w-auto">
            {!hasLockedVote ? (
              <Button
                variant="coral"
                size="xl"
                fullWidth
                className="sm:w-60"
                disabled={!selectedPlayerId}
                onClick={handleConfirmVote}
                leftIcon={<Vote className="w-5 h-5" />}
              >
                {selectedPlayer
                  ? `VOTE FOR ${selectedPlayer.name.toUpperCase()}`
                  : 'CONFIRM ACCUSATION'}
              </Button>
            ) : (
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <div className="p-2.5 px-4 rounded-xl bg-chomu-lime/15 text-chomu-lime font-black text-xs flex items-center justify-center gap-1.5 border border-chomu-lime/30 w-full sm:w-auto">
                  <Check className="w-4 h-4" />
                  <span>Vote Recorded</span>
                </div>
                {isHost && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={endRound}
                    className="w-full sm:w-auto"
                  >
                    Resolve Early
                  </Button>
                )}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
