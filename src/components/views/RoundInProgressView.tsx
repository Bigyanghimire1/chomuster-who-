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
    <div className="flex flex-col items-center justify-between min-h-[calc(100vh-4rem)] max-w-md mx-auto px-4 py-6 select-none animate-fade-in text-center">
      {/* 1. Header Banner */}
      <div className="w-full">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-chomu-surface border border-chomu-border text-xs font-bold text-chomu-purple mb-3">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>CATEGORY: {categoryName.toUpperCase()}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-chomu-text tracking-tight uppercase mb-2">
          THE ROUND IS ON
        </h1>
        <p className="text-sm text-chomu-muted font-medium max-w-[280px] mx-auto">
          Everyone has seen their secret. Give your clues and let the accusations begin!
        </p>
      </div>

      {/* 2. Central Artwork */}
      <div className="my-auto py-4">
        <RoundInProgressArtwork />
      </div>

      {/* 3. Action Call to Action */}
      <div className="w-full max-w-[300px] space-y-2.5">
        <Card className="bg-chomu-surface/60 border-chomu-border py-2 px-3 text-center mb-1">
          <span className="text-xs text-chomu-muted font-semibold">
            {state.players.length} players &bull; {state.settings.imposterCount}{' '}
            {state.settings.imposterCount === 1 ? 'imposter' : 'imposters'} hidden
          </span>
        </Card>

        <Button
          variant="primary"
          size="xl"
          fullWidth
          leftIcon={<Eye className="w-5 h-5 fill-current" />}
          onClick={handleRevealImposters}
        >
          REVEAL IMPOSTERS
        </Button>

        <p className="text-xs text-chomu-muted font-medium">
          Tap only after your group has voted.
        </p>
      </div>
    </div>
  );
};
