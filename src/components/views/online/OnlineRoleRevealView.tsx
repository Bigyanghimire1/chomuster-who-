import React, { useState } from 'react';
import { Check, Play, HelpCircle } from 'lucide-react';
import { useMultiplayer } from '../../../context/MultiplayerContext';
import { Button } from '../../common/Button';
import { Card } from '../../common/Card';
import { InteractiveSecretCard } from '../../common/InteractiveSecretCard';
import { audioService } from '../../../services/audioService';

export const OnlineRoleRevealView: React.FC = () => {
  const {
    mySecret,
    players,
    myPlayer,
    isHost,
    confirmRole,
    startRound,
    roomState,
  } = useMultiplayer();

  const [hasAcknowledged, setHasAcknowledged] = useState<boolean>(false);

  const isChomu = !!mySecret?.isChomu;
  const categoryName = mySecret?.category || roomState?.secretCategory || 'Mystery';
  const secretWord = mySecret?.word || '';
  const hint = mySecret?.hint || '';

  const totalPlayers = players.length;
  const readyPlayersCount = players.filter((p) => p.hasSeenRole || p.isReady).length;

  const handleConfirmRole = () => {
    setHasAcknowledged(true);
    confirmRole();
    audioService.playButtonTap();
  };

  const handleStartRound = () => {
    audioService.playGameStart();
    startRound();
  };

  return (
    <div className="flex-1 w-full bg-[#FFDF00] flex flex-col">
      <div className="flex flex-col items-center justify-between flex-1 max-w-md mx-auto w-full px-4 py-6 select-none animate-fade-in text-center space-y-5">
        {/* Header */}
        <div className="w-full space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border-2 border-[#050505] shadow-[0_3px_0_#050505] text-xs font-extrabold text-[#050505]">
            <HelpCircle className="w-3.5 h-3.5" strokeWidth={2.2} />
            <span>{categoryName}</span>
          </div>

          <h1 className="text-3xl font-extrabold text-[#050505] tracking-[-0.03em]">
            Your Secret Card
          </h1>
          <p className="text-xs font-bold text-[#050505]/80 max-w-[300px] mx-auto">
            Drag playfully, hold, or tap to flip your private role.
          </p>
        </div>

        {/* Interactive Elastic Drag + 3D Flip + Hold Secret Card */}
        <div className="my-auto w-full py-2">
          <InteractiveSecretCard
            isChomu={isChomu}
            categoryName={categoryName}
            secretWord={secretWord}
            hint={hint}
            playerName={myPlayer?.name}
          />
        </div>

        {/* Bottom Acknowledgment & Host Trigger */}
        <div className="w-full max-w-[290px] space-y-3">
          <Card className="p-3 text-center">
            <span className="text-xs font-extrabold text-[#050505] tabular-nums">
              {readyPlayersCount} of {totalPlayers} players checked their role
            </span>
          </Card>

          {!hasAcknowledged && !myPlayer?.hasSeenRole ? (
            <Button
              variant="dark"
              size="lg"
              fullWidth
              onClick={handleConfirmRole}
              leftIcon={<Check className="w-4 h-4" strokeWidth={2.5} />}
            >
              Got it — Ready
            </Button>
          ) : isHost ? (
            <Button
              variant="pink"
              size="lg"
              fullWidth
              onClick={handleStartRound}
              leftIcon={<Play className="w-4 h-4 fill-current" strokeWidth={2.2} />}
            >
              Start Clue Turns
            </Button>
          ) : (
            <div className="py-2.5 px-4 rounded-xl bg-white border-2 border-[#050505] text-xs font-extrabold text-[#050505]">
              Waiting for host to start clue turns…
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
