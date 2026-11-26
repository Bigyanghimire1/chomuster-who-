import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  RotateCcw,
  Trophy,
  HelpCircle,
  Users,
  LogOut,
  Flame,
  ShieldAlert,
} from 'lucide-react';
import { useMultiplayer } from '../../../context/MultiplayerContext';
import { Button } from '../../common/Button';
import { Card } from '../../common/Card';
import { Badge } from '../../common/Badge';
import { PlayerAvatar } from '../../illustrations/PlayerAvatar';
import { FinalRevealArtwork } from '../../illustrations/FinalRevealArtwork';
import { audioService } from '../../../services/audioService';

export const OnlineResultsView: React.FC = () => {
  const {
    roomState,
    players,
    isHost,
    playAgain,
    leaveRoom,
  } = useMultiplayer();

  const votingResult = roomState?.votingResult;
  const winner = roomState?.winner;

  const chomuIds =
    votingResult?.chomuIds ||
    roomState?.chomuIds ||
    [];

  const secretWord =
    votingResult?.secretWord ||
    roomState?.secretWord ||
    '';

  const categoryName =
    votingResult?.category ||
    roomState?.secretCategory ||
    'Mystery';

  const votes = votingResult?.votes || {};
  const voteCounts = votingResult?.voteCounts || {};
  const hints = votingResult?.hints || {};

  const chomuPlayers = players.filter((p) => chomuIds.includes(p.id));
  const civilianPlayers = players.filter((p) => !chomuIds.includes(p.id));

  const isCivilianVictory =
    winner === 'civilians' || votingResult?.chomusCaught === true;

  useEffect(() => {
    audioService.playImposterReveal();
    try {
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.55 },
        colors: isCivilianVictory
          ? ['#A8D664', '#9275FF', '#5EB1C2', '#E0B45C']
          : ['#E85D75', '#9275FF', '#E0B45C', '#1A1E28'],
      });
    } catch {}
  }, [isCivilianVictory]);

  const handlePlayAgain = () => {
    audioService.playGameStart();
    playAgain();
  };

  return (
    <div className="flex flex-col items-center flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 py-6 select-none animate-fade-in text-center space-y-5">
      {/* Banner & Artwork */}
      <div className="w-full space-y-2">
        <FinalRevealArtwork className="mx-auto mb-2" />

        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-chomu-surface border border-white/[0.08] text-xs font-medium text-chomu-secondary">
          <HelpCircle className="w-3.5 h-3.5" strokeWidth={1.5} />
          <span>{categoryName}</span>
        </div>

        {isCivilianVictory ? (
          <div className="space-y-1.5">
            <div>
              <Badge variant="lime" size="sm">
                <Trophy className="w-3.5 h-3.5" strokeWidth={1.5} />
                <span>Civilians win</span>
              </Badge>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-chomu-text tracking-[-0.025em]">
              Chomu Caught!
            </h1>
            <p className="text-sm text-chomu-secondary">
              The group identified the Chomu and protected the secret
            </p>
          </div>
        ) : (
          <div className="space-y-1.5">
            <div>
              <Badge variant="coral" size="sm">
                <Flame className="w-3.5 h-3.5" strokeWidth={1.5} />
                <span>Chomu wins</span>
              </Badge>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-chomu-coral tracking-[-0.025em]">
              The Chomu Escaped!
            </h1>
            <p className="text-sm text-chomu-secondary">
              The Chomu deceived the circle and avoided detection
            </p>
          </div>
        )}
      </div>

      {/* Side-by-side Word & Chomu Summary Cards */}
      <div className="w-full max-w-md grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
        <Card className="bg-chomu-surface border-chomu-teal/40 p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-chomu-teal/15 text-chomu-teal flex items-center justify-center shrink-0">
            <Trophy className="w-4 h-4" strokeWidth={1.75} />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-medium text-chomu-secondary block">
              Word Was
            </span>
            <span className="text-base font-bold text-chomu-text truncate block">
              {secretWord || '—'}
            </span>
          </div>
        </Card>

        <Card className="bg-chomu-surface border-chomu-coral/40 p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-chomu-coral/15 text-chomu-coral flex items-center justify-center shrink-0">
            <ShieldAlert className="w-4 h-4" strokeWidth={1.75} />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-medium text-chomu-secondary block">
              {chomuPlayers.length === 1 ? 'The Chomu' : 'The Chomas'}
            </span>
            <span className="text-base font-bold text-chomu-coral truncate block">
              {chomuPlayers.map((p) => p.name).join(', ') || '—'}
            </span>
          </div>
        </Card>
      </div>

      {/* Chomu Reveal Cards */}
      <div className="w-full max-w-md space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-semibold text-chomu-coral flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4" strokeWidth={1.5} />
            <span>{chomuPlayers.length === 1 ? 'The Chomu was' : 'The Chomas were'}</span>
          </span>
          <span className="text-xs font-mono text-chomu-muted tabular-nums">
            {chomuPlayers.length} {chomuPlayers.length === 1 ? 'Chomu' : 'Chomas'}
          </span>
        </div>

        {chomuPlayers.map((p) => {
          const hintText = hints[p.id];
          const receivedVotes = voteCounts[p.id] || 0;

          return (
            <Card
              key={p.id}
              className="bg-chomu-surface border-chomu-coral/50 p-4 flex items-center justify-between gap-3 text-left"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <PlayerAvatar id={p.avatar} size="lg" isImposterStyle={true} />
                <div className="min-w-0 flex-1">
                  <h2 className="text-base font-semibold text-chomu-text leading-tight truncate">
                    {p.name}
                  </h2>
                  {hintText ? (
                    <span className="text-xs text-chomu-secondary block mt-0.5 truncate">
                      Hint: <span className="text-chomu-coral font-medium">&ldquo;{hintText}&rdquo;</span>
                    </span>
                  ) : (
                    <span className="text-xs text-chomu-muted block mt-0.5">
                      No hint given
                    </span>
                  )}
                  <span className="text-xs font-mono text-chomu-coral tabular-nums block mt-0.5">
                    {receivedVotes} {receivedVotes === 1 ? 'vote' : 'votes'}
                  </span>
                </div>
              </div>

              <Badge variant="coral" size="sm" className="shrink-0">
                Chomu
              </Badge>
            </Card>
          );
        })}
      </div>

      {/* Secret Word Card */}
      <Card className="w-full max-w-md bg-chomu-surface p-5 text-center space-y-1">
        <span className="text-xs text-chomu-muted block">
          {categoryName}
        </span>
        <span className="text-xs font-medium text-chomu-purple block">
          Secret word
        </span>
        <h2 className="text-3xl font-semibold text-chomu-text tracking-[-0.02em]">
          {secretWord || 'Mystery Word'}
        </h2>
      </Card>

      {/* Vote Breakdown */}
      <Card className="w-full max-w-md bg-chomu-surface p-4 text-left space-y-3">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-2.5">
          <span className="text-xs font-semibold text-chomu-text">
            Vote accusations breakdown
          </span>
          <span className="text-xs font-mono text-chomu-muted tabular-nums">
            {Object.keys(votes).length} votes
          </span>
        </div>

        <div className="space-y-2">
          {players.map((voter) => {
            const votedTargetId = votes[voter.id];
            const targetPlayer = players.find((p) => p.id === votedTargetId);
            const targetIsChomu = chomuIds.includes(votedTargetId);

            return (
              <div
                key={voter.id}
                className="flex items-center justify-between gap-2 text-xs py-1.5 px-2.5 rounded-lg bg-chomu-bgSecondary border border-white/[0.06]"
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <PlayerAvatar id={voter.avatar} size="sm" />
                  <span className="font-medium text-chomu-text truncate">{voter.name}</span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 max-w-[55%]">
                  <span className="text-chomu-muted shrink-0">voted for</span>
                  {targetPlayer ? (
                    <span
                      className={`font-medium truncate ${
                        targetIsChomu ? 'text-chomu-coral' : 'text-chomu-text'
                      }`}
                    >
                      {targetPlayer.name}
                    </span>
                  ) : (
                    <span className="text-chomu-muted">Skipped</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Civilians Roster */}
      <div className="w-full max-w-md bg-chomu-bgSecondary border border-white/[0.08] rounded-xl p-4">
        <div className="flex items-center gap-1.5 mb-2.5">
          <Users className="w-4 h-4 text-chomu-lime" strokeWidth={1.5} />
          <span className="text-xs font-medium text-chomu-lime tabular-nums">
            Civilians ({civilianPlayers.length})
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {civilianPlayers.map((p) => (
            <div
              key={p.id}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-chomu-surface border border-white/[0.08] text-xs text-chomu-text font-medium"
            >
              <PlayerAvatar id={p.avatar} size="sm" />
              <span>{p.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Action Bar in natural flow (cleanly above VoiceControls dock) */}
      <Card className="w-full max-w-md p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={leaveRoom}
          leftIcon={<LogOut className="w-4 h-4" strokeWidth={1.5} />}
        >
          Leave room
        </Button>

        <div className="w-full sm:w-auto">
          {isHost ? (
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handlePlayAgain}
              leftIcon={<RotateCcw className="w-4 h-4" strokeWidth={1.5} />}
            >
              Play again
            </Button>
          ) : (
            <p className="text-xs text-chomu-secondary text-center sm:text-right">
              Waiting for host to start the next round
            </p>
          )}
        </div>
      </Card>
    </div>
  );
};
