import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { RotateCcw, Sliders } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { PlayerAvatar } from '../illustrations/PlayerAvatar';
import { FinalRevealArtwork } from '../illustrations/FinalRevealArtwork';
import { audioService } from '../../services/audioService';

export const FinalRevealView: React.FC = () => {
  const { state, dispatch, allCategories } = useGame();

  const secretWord = state.secret?.secretWord || '';
  const secretCategory = state.secret?.secretCategory || '';
  const roles = state.secret?.roles || {};
  const hints = state.secret?.imposterHints || {};

  const imposterPlayers = state.players.filter(p => roles[p.id]?.isImposter);
  const civilianPlayers = state.players.filter(p => !roles[p.id]?.isImposter);

  useEffect(() => {
    audioService.playVictoryFanfare();
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#9275FF', '#FF6987', '#C5EF75', '#68D9E7'],
      });
    } catch {
      // Ignore if canvas-confetti fails
    }
  }, []);

  const handlePlayAgain = () => {
    dispatch({ type: 'REMATCH', allCategories });
  };

  const handleNewGame = () => {
    dispatch({ type: 'RESET_TO_SETUP' });
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-[calc(100vh-4rem)] max-w-md mx-auto px-4 py-5 select-none animate-fade-in text-center space-y-4">
      {/* 1. Header */}
      <div className="w-full">
        <FinalRevealArtwork className="mx-auto mb-2" />
        <h1 className="text-2xl sm:text-3xl font-black text-chomu-coral tracking-tight uppercase mb-1">
          {imposterPlayers.length === 1 ? 'THE IMPOSTER WAS...' : 'THE IMPOSTERS WERE...'}
        </h1>
        <p className="text-xs text-chomu-muted font-medium">
          The secrets are out. Did your group spot them?
        </p>
      </div>

      {/* 2. Imposter Cards */}
      <div className="w-full space-y-2 max-w-[320px]">
        {imposterPlayers.map(p => {
          const hint = hints[p.id];
          return (
            <Card
              key={p.id}
              className="bg-gradient-to-r from-[#2B1424] via-chomu-surface to-chomu-surface border-2 border-chomu-coral p-3.5 flex items-center justify-between shadow-xl"
            >
              <div className="flex items-center gap-3 text-left">
                <PlayerAvatar id={p.avatar} size="md" isImposterStyle={true} />
                <div>
                  <h3 className="text-base font-black text-chomu-text leading-tight">
                    {p.name}
                  </h3>
                  {hint ? (
                    <span className="text-[11px] text-chomu-muted font-medium block">
                      Hint: <strong className="text-chomu-coral font-bold">"{hint}"</strong>
                    </span>
                  ) : (
                    <span className="text-[10px] text-chomu-muted font-medium block">
                      No hint given
                    </span>
                  )}
                </div>
              </div>
              <Badge variant="coral" size="sm">
                IMPOSTER
              </Badge>
            </Card>
          );
        })}
      </div>

      {/* 3. Secret Word Reveal Card */}
      <Card className="w-full max-w-[320px] bg-chomu-surface border border-chomu-border p-4 text-center">
        <span className="text-[10px] font-bold text-chomu-muted uppercase tracking-widest block mb-1">
          {secretCategory}
        </span>
        <span className="text-[10px] font-black text-chomu-purple uppercase tracking-widest block mb-1">
          THE SECRET WORD
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-chomu-text tracking-tight drop-shadow-md">
          {secretWord}
        </h2>
      </Card>

      {/* 4. Civilians list summary */}
      <div className="w-full max-w-[320px] bg-chomu-bg/60 border border-chomu-border/60 rounded-2xl p-2.5">
        <span className="text-[10px] font-bold text-chomu-lime uppercase tracking-wider block mb-1.5">
          Civilians ({civilianPlayers.length})
        </span>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {civilianPlayers.map(p => (
            <div
              key={p.id}
              className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-chomu-surface border border-chomu-border text-xs text-chomu-text font-semibold"
            >
              <PlayerAvatar id={p.avatar} size="sm" />
              <span>{p.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Action Buttons */}
      <div className="w-full max-w-[300px] space-y-2.5 pt-2">
        <Button
          variant="primary"
          size="xl"
          fullWidth
          leftIcon={<RotateCcw className="w-5 h-5" />}
          onClick={handlePlayAgain}
        >
          PLAY AGAIN
        </Button>

        <Button
          variant="secondary"
          size="md"
          fullWidth
          leftIcon={<Sliders className="w-4 h-4 text-chomu-muted" />}
          onClick={handleNewGame}
        >
          NEW GAME
        </Button>
      </div>
    </div>
  );
};
