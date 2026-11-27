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
    audioService.playImposterReveal();
    try {
      confetti({
        particleCount: 70,
        spread: 65,
        origin: { y: 0.6 },
        colors: ['#FFDF00', '#64E987', '#F28BCB', '#A9E5F2', '#FF5D73'],
      });
    } catch {}
  }, []);

  const handlePlayAgain = () => {
    dispatch({ type: 'REMATCH', allCategories });
  };

  const handleNewGame = () => {
    dispatch({ type: 'RESET_TO_SETUP' });
  };

  return (
    <div className="flex flex-col items-center justify-between flex-1 max-w-md mx-auto w-full px-4 py-6 select-none animate-fade-in text-center space-y-5">
      {/* Header */}
      <div className="w-full space-y-1.5">
        <FinalRevealArtwork className="mx-auto mb-2" />
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#050505] tracking-[-0.02em]">
          {imposterPlayers.length === 1 ? 'The Chomu was' : 'The Chomas were'}
        </h1>
        <p className="text-sm font-bold text-[#050505]/80">
          Did your group spot who was bluffing?
        </p>
      </div>

      {/* Chomu Reveal Cards */}
      <div className="w-full space-y-2 max-w-sm">
        {imposterPlayers.map(p => {
          const hint = hints[p.id];
          return (
            <Card
              key={p.id}
              className="bg-white border-chomu-coral/50 p-4 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 text-left min-w-0 flex-1">
                <PlayerAvatar id={p.avatar} size="md" isImposterStyle={true} />
                <div className="min-w-0 flex-1">
                  <h2 className="text-base font-semibold text-chomu-text leading-tight truncate">
                    {p.name}
                  </h2>
                  {hint ? (
                    <span className="text-xs text-chomu-secondary block mt-0.5 truncate">
                      Hint: <span className="text-chomu-errorText font-bold">&ldquo;{hint}&rdquo;</span>
                    </span>
                  ) : (
                    <span className="text-xs text-chomu-muted block mt-0.5">
                      No hint given
                    </span>
                  )}
                </div>
              </div>
              <Badge variant="coral" size="sm" className="shrink-0">
                Chomu
              </Badge>
            </Card>
          );
        })}
      </div>

      {/* Secret Word Reveal Card (Neo-Brutalist Dark Stage) */}
      <div className="w-full max-w-sm rounded-2xl bg-[#050505] text-white p-5 text-center space-y-1.5 border-[3px] border-[#050505] shadow-[0_6px_0_#050505]">
        <span className="text-xs font-bold text-stone-400 block">
          {secretCategory}
        </span>
        <span className="text-xs font-extrabold text-[#FFDF00] uppercase tracking-wider block">
          Secret word
        </span>
        <h2 className="text-3xl font-extrabold text-[#FFDF00] tracking-[-0.02em]">
          {secretWord}
        </h2>
      </div>

      {/* Civilians Summary */}
      <div className="w-full max-w-sm bg-chomu-bgSecondary border border-chomu-border rounded-xl p-3.5">
        <span className="text-xs font-medium text-chomu-lime block mb-2">
          Civilians ({civilianPlayers.length})
        </span>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {civilianPlayers.map(p => (
            <div
              key={p.id}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-chomu-border text-xs text-chomu-text font-medium"
            >
              <PlayerAvatar id={p.avatar} size="sm" />
              <span>{p.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="w-full max-w-sm space-y-2.5 pt-1">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          leftIcon={<RotateCcw className="w-4 h-4" strokeWidth={1.5} />}
          onClick={handlePlayAgain}
        >
          Play again
        </Button>

        <Button
          variant="secondary"
          size="md"
          fullWidth
          leftIcon={<Sliders className="w-4 h-4" strokeWidth={1.5} />}
          onClick={handleNewGame}
        >
          New game
        </Button>
      </div>
    </div>
  );
};
