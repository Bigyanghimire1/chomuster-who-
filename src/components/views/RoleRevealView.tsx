import React, { useState, useEffect } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { Button } from '../common/Button';
import { PlayerAvatar } from '../illustrations/PlayerAvatar';
import { InteractiveSecretCard } from '../common/InteractiveSecretCard';
import { audioService } from '../../services/audioService';

export const RoleRevealView: React.FC = () => {
  const { state, dispatch } = useGame();
  const [hasSeenCurrent, setHasSeenCurrent] = useState<boolean>(false);

  const revealOrder = state.secret?.revealOrder || state.players.map((p) => p.id);
  const activePlayerId = revealOrder[state.currentRevealIndex] || state.players[0]?.id;
  const activePlayer = state.players.find((p) => p.id === activePlayerId) || {
    id: activePlayerId,
    name: `Player ${state.currentRevealIndex + 1}`,
    score: 0,
    avatar: 'sleuth' as const,
  };

  const roleAssignment = state.secret?.roles[activePlayerId];
  const isImposter = roleAssignment?.isImposter ?? false;
  const secretWord = state.secret?.secretWord ?? '';
  const secretCategory = state.secret?.secretCategory ?? '';
  const imposterHint = state.secret?.imposterHints[activePlayerId] || '';

  const totalPlayers = revealOrder.length;
  const isLastPlayer = state.currentRevealIndex >= totalPlayers - 1;

  useEffect(() => {
    setHasSeenCurrent(false);
  }, [state.currentRevealIndex]);

  const handleAdvance = () => {
    audioService.playButtonTap();
    setHasSeenCurrent(false);
    if (isLastPlayer) {
      dispatch({ type: 'START_ROUND' });
    } else {
      dispatch({ type: 'NEXT_REVEAL' });
    }
  };

  return (
    <div className="flex-1 w-full bg-[#FFDF00] flex flex-col">
      <div className="flex flex-col items-center justify-between flex-1 max-w-md mx-auto w-full px-4 py-6 select-none animate-fade-in space-y-5">
        {/* Header */}
        <div className="w-full text-center space-y-2.5">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-white border-2 border-[#050505] shadow-[0_3px_0_#050505] text-xs font-extrabold text-[#050505] tabular-nums">
            Player {state.currentRevealIndex + 1} of {totalPlayers}
          </span>

          <div className="flex items-center justify-center gap-3">
            <PlayerAvatar id={activePlayer.avatar} size="sm" />
            <h1 className="text-3xl font-extrabold text-[#050505] tracking-[-0.03em]">
              Pass to {activePlayer.name}
            </h1>
          </div>

          <p className="text-xs font-bold text-[#050505]/80">
            Make sure no one else can see your screen.
          </p>
        </div>

        {/* Interactive Elastic Drag + 3D Flip + Hold Secret Card */}
        <div className="my-auto w-full py-2">
          <InteractiveSecretCard
            isChomu={isImposter}
            categoryName={secretCategory}
            secretWord={secretWord}
            hint={imposterHint}
            playerName={activePlayer.name}
            onFirstReveal={() => setHasSeenCurrent(true)}
          />
        </div>

        {/* Bottom Advance Action */}
        <div className="w-full max-w-[290px]">
          <Button
            variant={hasSeenCurrent ? 'dark' : 'secondary'}
            size="lg"
            fullWidth
            disabled={!hasSeenCurrent}
            onClick={handleAdvance}
            leftIcon={hasSeenCurrent ? <Check className="w-4 h-4" strokeWidth={2.5} /> : undefined}
            rightIcon={<ArrowRight className="w-4 h-4" strokeWidth={2.5} />}
          >
            {!hasSeenCurrent
              ? 'Peek card to continue'
              : isLastPlayer
                ? 'Start Clue Circle'
                : 'Pass to Next Player'}
          </Button>
        </div>
      </div>
    </div>
  );
};
