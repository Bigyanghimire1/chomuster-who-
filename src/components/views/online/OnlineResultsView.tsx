import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  RotateCcw,
  Trophy,
  HelpCircle,
  LogOut,
  Flame,
  ArrowLeft,
} from 'lucide-react';
import { useMultiplayer } from '../../../context/MultiplayerContext';
import { Button } from '../../common/Button';
import { Card } from '../../common/Card';
import { Badge } from '../../common/Badge';
import { PlayerAvatar } from '../../illustrations/PlayerAvatar';
import { audioService } from '../../../services/audioService';

export const OnlineResultsView: React.FC = () => {
  const {
    roomState,
    players,
    isHost,
    playAgain,
    leaveRoom,
  } = useMultiplayer();

  const [waitingInLobby, setWaitingInLobby] = useState<boolean>(false);

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
  const hints = votingResult?.hints || {};

  const chomuPlayers = players.filter((p) => chomuIds.includes(p.id));

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
          ? ['#16A34A', '#7C3AED', '#0F9D8A', '#D97706']
          : ['#E5484D', '#7C3AED', '#D97706', '#0F9D8A'],
      });
    } catch {}
  }, [isCivilianVictory]);

  const handlePlayAgain = () => {
    audioService.playGameStart();
    playAgain();
  };

  if (!isHost && waitingInLobby) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 max-w-md mx-auto w-full px-4 py-8 select-none animate-fade-in text-center space-y-4">
        <Card className="w-full p-6 space-y-3">
          <Badge variant="lime" size="md">
            Lobby
          </Badge>
          <h1 className="text-2xl font-extrabold text-[#050505]">
            Waiting for host
          </h1>
          <p className="text-xs font-medium text-chomu-secondary">
            You&apos;ll automatically return to the lobby as soon as the host taps Play again.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <Button
              variant="secondary"
              size="md"
              fullWidth
              onClick={() => setWaitingInLobby(false)}
              leftIcon={<ArrowLeft className="w-4 h-4" strokeWidth={2} />}
            >
              Back to results
            </Button>
            <Button
              variant="ghost"
              size="sm"
              fullWidth
              onClick={leaveRoom}
              leftIcon={<LogOut className="w-4 h-4" strokeWidth={1.75} />}
            >
              Leave room
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center flex-1 max-w-xl mx-auto w-full px-4 sm:px-6 py-5 select-none animate-fade-in text-center space-y-4">
      {/* First-Sight Hero Reveal: Big Player Name + "is a Chomu" */}
      <Card className="w-full p-6 bg-white border-[3px] border-[#050505] shadow-[0_6px_0_#050505] space-y-4">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          {isCivilianVictory ? (
            <Badge variant="lime" size="md">
              <Trophy className="w-3.5 h-3.5" strokeWidth={2.25} />
              <span>Civilians win</span>
            </Badge>
          ) : (
            <Badge variant="coral" size="md">
              <Flame className="w-3.5 h-3.5" strokeWidth={2} />
              <span>Chomu wins</span>
            </Badge>
          )}

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF9CC] border-2 border-[#050505] text-xs font-extrabold text-[#050505]">
            <HelpCircle className="w-3.5 h-3.5" strokeWidth={2.25} />
            <span>{categoryName}</span>
          </span>
        </div>

        <div className="py-2 space-y-3">
          {chomuPlayers.length > 0 ? (
            <div className="space-y-2.5">
              <div className="flex items-center justify-center gap-3 flex-wrap">
                {chomuPlayers.map((p) => (
                  <PlayerAvatar key={p.id} id={p.avatar} size="xl" isImposterStyle={true} />
                ))}
              </div>
              <div>
                <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[#050505] tracking-[-0.03em] leading-tight">
                  {chomuPlayers.map((p) => p.name).join(' & ')}
                </h1>
                <p className="text-lg sm:text-xl font-extrabold text-chomu-errorText mt-0.5">
                  {chomuPlayers.length === 1 ? 'is a Chomu' : 'are Chomus'}
                </p>
              </div>
            </div>
          ) : (
            <h1 className="font-display text-3xl font-extrabold text-[#050505]">
              Round Complete
            </h1>
          )}

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#050505] text-[#FFDF00] border-2 border-[#050505]">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-300">
              Secret Word:
            </span>
            <span className="text-base font-extrabold">
              {secretWord || '—'}
            </span>
          </div>
        </div>
      </Card>

      {/* Details Card: Chomu Hint & Who Voted Who */}
      <Card className="w-full bg-white p-4 text-left space-y-4">
        {/* Hint Given to Chomu */}
        {chomuPlayers.length > 0 && (
          <div className="pb-3 border-b border-chomu-border space-y-1.5">
            <span className="text-xs font-extrabold uppercase tracking-wide text-chomu-secondary block">
              Chomu Hint
            </span>
            {chomuPlayers.map((p) => {
              const hintText = hints[p.id];
              return (
                <div
                  key={p.id}
                  className="flex items-center justify-between gap-2 text-xs px-3 py-2 rounded-xl bg-[#FFF5F6] border border-chomu-coral/30"
                >
                  <span className="font-bold text-[#050505] truncate">{p.name}</span>
                  <span className="font-extrabold text-chomu-errorText shrink-0">
                    {hintText ? `“${hintText}”` : 'No hint given'}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Who Voted Who */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wide text-chomu-secondary">
              Who Voted Who
            </span>
            <span className="text-xs font-mono text-chomu-muted tabular-nums">
              {Object.keys(votes).length} votes
            </span>
          </div>

          <div className="space-y-1.5">
            {players.map((voter) => {
              const votedTargetId = votes[voter.id];
              const targetPlayer = players.find((p) => p.id === votedTargetId);
              const targetIsChomu = chomuIds.includes(votedTargetId);

              return (
                <div
                  key={voter.id}
                  className="flex items-center justify-between gap-2 text-xs py-1.5 px-2.5 rounded-lg bg-chomu-bgSecondary border border-chomu-border"
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <PlayerAvatar id={voter.avatar} size="sm" />
                    <span className="font-bold text-[#050505] truncate">{voter.name}</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 max-w-[55%]">
                    <span className="text-chomu-muted shrink-0">&rarr;</span>
                    {targetPlayer ? (
                      <span
                        className={`font-extrabold truncate ${
                          targetIsChomu ? 'text-chomu-errorText' : 'text-[#050505]'
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
        </div>
      </Card>

      {/* Bottom Action Bar */}
      <Card className="sticky bottom-2 z-20 w-full p-3.5 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-2.5">
        <Button
          variant="ghost"
          size="sm"
          onClick={leaveRoom}
          leftIcon={<LogOut className="w-4 h-4" strokeWidth={1.75} />}
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
              leftIcon={<RotateCcw className="w-4 h-4" strokeWidth={2} />}
            >
              Play again
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="md"
              fullWidth
              onClick={() => setWaitingInLobby(true)}
              leftIcon={<RotateCcw className="w-4 h-4" strokeWidth={2} />}
            >
              Return to lobby
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};
