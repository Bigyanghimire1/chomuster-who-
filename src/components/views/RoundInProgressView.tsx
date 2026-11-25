import React from 'react';
import { Eye, HelpCircle } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { RoundInProgressArtwork } from '../illustrations/RoundInProgressArtwork';

export const RoundInProgressView: React.FC = () => {
  const { state, dispatch } = useGame();
  const categoryName = state.secret?.secretCategory || 'Mystery';

  const handleRevealImposters = () => {
    dispatch({ type: 'REVEAL_IMPOSTERS' });
  };

  return (
    <div className="flex flex-col items-center justify-between flex-1 max-w-md mx-auto w-full px-4 py-6 select-none animate-fade-in text-center">
      {/* Header Banner */}
      <div className="w-full space-y-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-chomu-surface border border-white/[0.08] text-xs font-medium text-chomu-secondary">
          <HelpCircle className="w-3.5 h-3.5" strokeWidth={1.5} />
          <span>{categoryName}</span>
        </div>

        <h1 className="text-3xl font-semibold text-chomu-text tracking-[-0.02em]">
          The round is on
        </h1>
        <p className="text-sm text-chomu-secondary max-w-[300px] mx-auto leading-5">
          Give your clues around the circle and spot the Chomu
        </p>
      </div>

      {/* Central Artwork */}
      <div className="my-auto py-6">
        <RoundInProgressArtwork />
      </div>

      {/* Action Call to Action */}
      <div className="w-full max-w-[320px] space-y-3">
        <Card className="bg-chomu-surface py-2.5 px-4 text-center">
          <span className="text-xs text-chomu-secondary font-mono tabular-nums">
            {state.players.length} players &bull; {state.settings.imposterCount}{' '}
            {state.settings.imposterCount === 1 ? 'Chomu' : 'Chomas'} hidden
          </span>
        </Card>

        <Button
          variant="primary"
          size="lg"
          fullWidth
          leftIcon={<Eye className="w-4 h-4" strokeWidth={1.5} />}
          onClick={handleRevealImposters}
        >
          Reveal Chomas
        </Button>

        <p className="text-xs text-chomu-muted">
          Tap only after your group has voted
        </p>
      </div>
    </div>
  );
};
