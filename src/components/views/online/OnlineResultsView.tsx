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
  const winner = roomState?.winner; // 'civilians' | 'chomu' | null

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
        particleCount: 90,
        spread: 80,
        origin: { y: 0.55 },
        colors: isCivilianVictory
          ? ['#C5EF75', '#9275FF', '#68D9E7', '#FFC86D']
          : ['#FF6987', '#9275FF', '#FFC86D', '#1D2340'],
      });
    } catch {
      // Ignore confetti errors if canvas unavailable
    }
  }, [isCivilianVictory]);

  const handlePlayAgain = () => {
    audioService.playGameStart();
    playAgain();
  };

  return (
    <div className="flex flex-col items-center flex-1 max-w-2xl mx-auto w-full px-4 py-4 select-none animate-fade-in text-center space-y-4">
      {/* 1. Header Banner & Artwork */}
      <div className="w-full">
        <FinalRevealArtwork className="mx-auto mb-2" />

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-chomu-surface border border-chomu-border text-xs font-bold text-chomu-purple mb-2">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>CATEGORY: {categoryName.toUpperCase()}</span>
        </div>

        {isCivilianVictory ? (
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-chomu-lime/20 border border-chomu-lime text-chomu-lime text-xs font-black uppercase mb-1">
              <Trophy className="w-3.5 h-3.5" /> Civilians Win
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-chomu-lime tracking-tight uppercase">
              CHOMU CAUGHT!
            </h1>
            <p className="text-xs text-chomu-muted font-medium">
              The group identified the imposter and defended the secret!
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-chomu-coral/20 border border-chomu-coral text-chomu-coral text-xs font-black uppercase mb-1">
              <Flame className="w-3.5 h-3.5" /> Chomu Wins
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-chomu-coral tracking-tight uppercase">
              THE CHOMU ESCAPED!
            </h1>
            <p className="text-xs text-chomu-muted font-medium">
              The imposter successfully deceived the circle and avoided detection!
            </p>
          </div>
        )}
      </div>

      {/* 2. "THE CHOMAS WERE..." Reveal Cards */}
      <div className="w-full max-w-md space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-black text-chomu-coral uppercase tracking-wider flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4" />
            {chomuPlayers.length === 1 ? 'THE CHOMU WAS' : 'THE CHOMAS WERE'}
          </span>
          <span className="text-[11px] text-chomu-muted font-bold">
            {chomuPlayers.length} Imposter{chomuPlayers.length > 1 ? 's' : ''}
          </span>
        </div>

        {chomuPlayers.map((p) => {
          const hintText = hints[p.id];
          const receivedVotes = voteCounts[p.id] || 0;

          return (
            <Card
              key={p.id}
              className="bg-gradient-to-r from-[#2B1424] via-chomu-surface to-chomu-surface border-2 border-chomu-coral p-4 flex items-center justify-between shadow-xl text-left"
            >
              <div className="flex items-center gap-3 min-w-0">
                <PlayerAvatar id={p.avatar} size="lg" isImposterStyle={true} />
                <div className="min-w-0">
                  <h3 className="text-base font-black text-chomu-text leading-tight truncate">
                    {p.name}
                  </h3>

                  {hintText ? (
                    <span className="text-xs text-chomu-muted font-medium block">
                      Hint was:{' '}
                      <strong className="text-chomu-coral font-bold">
                        "{hintText}"
                      </strong>
                    </span>
                  ) : (
                    <span className="text-[11px] text-chomu-muted font-medium block">
                      No hint given
                    </span>
                  )}

                  <span className="text-[11px] text-chomu-coral font-bold block pt-0.5">
                    Received {receivedVotes} {receivedVotes === 1 ? 'vote' : 'votes'}
                  </span>
                </div>
              </div>

              <Badge variant="coral" size="sm">
                CHOMU
              </Badge>
            </Card>
          );
        })}
      </div>

      {/* 3. The Secret Word Card */}
      <Card className="w-full max-w-md bg-chomu-surface border border-chomu-border p-4 text-center shadow-lg">
        <span className="text-[10px] font-bold text-chomu-muted uppercase tracking-widest block mb-1">
          {categoryName}
        </span>
        <span className="text-[11px] font-black text-chomu-purple uppercase tracking-widest block mb-1">
          THE SECRET WORD
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-chomu-text tracking-tight drop-shadow-md">
          {secretWord || 'Mystery Word'}
        </h2>
      </Card>

      {/* 4. Results Breakdown: Votes Cast by Everyone */}
      <Card className="w-full max-w-md bg-chomu-surface/80 border border-chomu-border p-4 text-left space-y-3">
        <div className="flex items-center justify-between border-b border-chomu-border/60 pb-2">
          <span className="text-xs font-black text-chomu-text uppercase tracking-wider">
            Vote Accusations Breakdown
          </span>
          <span className="text-[10px] text-chomu-muted font-semibold">
            {Object.keys(votes).length} votes cast
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
                className="flex items-center justify-between text-xs py-1 px-2 rounded-xl bg-chomu-bg/60 border border-chomu-border/40"
              >
                <div className="flex items-center gap-2">
                  <PlayerAvatar id={voter.avatar} size="sm" />
                  <span className="font-bold text-chomu-text">{voter.name}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-chomu-muted font-medium">voted for</span>
                  {targetPlayer ? (
                    <span
                      className={`font-black ${
                        targetIsChomu ? 'text-chomu-coral' : 'text-chomu-text'
                      }`}
                    >
                      {targetPlayer.name}
                    </span>
                  ) : (
                    <span className="text-chomu-muted italic">Skipped</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* 5. Civilians Roster */}
      <div className="w-full max-w-md bg-chomu-bg/70 border border-chomu-border/60 rounded-2xl p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-chomu-lime uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" /> Civilians ({civilianPlayers.length})
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {civilianPlayers.map((p) => (
            <div
              key={p.id}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-chomu-surface border border-chomu-border text-xs text-chomu-text font-semibold"
            >
              <PlayerAvatar id={p.avatar} size="sm" />
              <span>{p.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Sticky Action Bar */}
      <div className="pt-2 sticky bottom-4 z-20 w-full max-w-md">
        <Card className="bg-chomu-surface/95 backdrop-blur-md border border-chomu-border p-3.5 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="w-full sm:w-auto">
            <Button
              variant="ghost"
              size="sm"
              onClick={leaveRoom}
              leftIcon={<LogOut className="w-4 h-4 text-chomu-muted" />}
            >
              Leave Room
            </Button>
          </div>

          <div className="w-full sm:w-auto">
            {isHost ? (
              <Button
                variant="primary"
                size="xl"
                fullWidth
                onClick={handlePlayAgain}
                leftIcon={<RotateCcw className="w-5 h-5" />}
              >
                PLAY AGAIN
              </Button>
            ) : (
              <div className="text-center sm:text-right px-2">
                <span className="text-xs font-black text-chomu-lime block">
                  Waiting for Host
                </span>
                <span className="text-[11px] text-chomu-muted font-medium">
                  Host will start the next round
                </span>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
