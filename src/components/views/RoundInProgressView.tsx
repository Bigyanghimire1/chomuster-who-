import React, { useState } from 'react';
import { Eye, HelpCircle, ArrowRight, ArrowLeft, MessageCircle } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { RoundInProgressArtwork } from '../illustrations/RoundInProgressArtwork';
import { audioService } from '../../services/audioService';

export const RoundInProgressView: React.FC = () => {
  const { state, dispatch } = useGame();
  const [step, setStep] = useState<'circle' | 'confirm_reveal'>('circle');
  const categoryName = state.secret?.secretCategory || 'Mystery';

  const handleRevealImposters = () => {
    dispatch({ type: 'REVEAL_IMPOSTERS' });
  };

  return (
    <div className="flex flex-col items-center justify-between flex-1 max-w-md mx-auto w-full px-4 py-6 select-none animate-fade-in text-center">
      {/* Header Banner */}
      <div className="w-full space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-chomu-border text-xs font-semibold text-chomu-secondary shadow-sm">
          <HelpCircle className="w-3.5 h-3.5 text-chomu-teal" strokeWidth={1.75} />
          <span>{categoryName}</span>
        </div>

        <h1 className="text-3xl font-bold text-chomu-text tracking-[-0.02em]">
          {step === 'circle' ? 'Clue circle & vote' : 'Ready to unmask?'}
        </h1>
        <p className="text-sm text-chomu-secondary max-w-[320px] mx-auto leading-5">
          {step === 'circle'
            ? 'Go around the room giving one-word clues, then discuss and vote together out loud.'
            : 'Make sure everyone in the room has pointed or agreed on their suspect.'}
        </p>
      </div>

      {/* Central Artwork or Dark-Ink Reveal Confirmation */}
      <div className="my-auto py-6 w-full flex justify-center">
        {step === 'circle' ? (
          <RoundInProgressArtwork />
        ) : (
          <div className="w-full max-w-[320px] rounded-2xl bg-[#050505] text-white p-6 border-[3px] border-[#050505] shadow-[0_7px_0_#050505] space-y-3 animate-scale-in">
            <div className="w-12 h-12 rounded-2xl bg-[#FF5D73] border-2 border-white text-[#050505] flex items-center justify-center mx-auto">
              <Eye className="w-6 h-6" strokeWidth={2.4} />
            </div>
            <h2 className="text-xl font-extrabold">Everyone voted?</h2>
            <p className="text-xs font-semibold text-stone-300 leading-relaxed">
              Tapping reveal will show the secret word and expose the{' '}
              {state.settings.imposterCount === 1 ? 'Chomu' : 'Chomus'} to the whole table.
            </p>
          </div>
        )}
      </div>

      {/* Phase-Locked Action Call to Action */}
      <div className="w-full max-w-[320px] space-y-3">
        <Card className="bg-white py-2.5 px-4 text-center">
          <span className="text-xs text-chomu-secondary font-mono tabular-nums">
            {state.players.length} players &bull; {state.settings.imposterCount}{' '}
            {state.settings.imposterCount === 1 ? 'Chomu' : 'Chomas'} hidden
          </span>
        </Card>

        {step === 'circle' ? (
          <Button
            variant="primary"
            size="lg"
            fullWidth
            leftIcon={<MessageCircle className="w-4 h-4" strokeWidth={1.75} />}
            rightIcon={<ArrowRight className="w-4 h-4" strokeWidth={1.75} />}
            onClick={() => {
              audioService.playButtonTap();
              setStep('confirm_reveal');
            }}
          >
            Group voted — Reveal
          </Button>
        ) : (
          <div className="space-y-2.5">
            <Button
              variant="coral"
              size="lg"
              fullWidth
              leftIcon={<Eye className="w-4 h-4" strokeWidth={1.75} />}
              onClick={handleRevealImposters}
            >
              Reveal {state.settings.imposterCount === 1 ? 'Chomu' : 'Chomas'}
            </Button>
            <Button
              variant="secondary"
              size="md"
              fullWidth
              leftIcon={<ArrowLeft className="w-4 h-4" strokeWidth={1.75} />}
              onClick={() => {
                audioService.playButtonTap();
                setStep('circle');
              }}
            >
              Back to discussion
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
