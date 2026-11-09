import React from 'react';
import { Play, PlusCircle, BookOpen, Database } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { Button } from '../common/Button';
import { HeroIllustration } from '../illustrations/HeroIllustration';

export const HomeView: React.FC = () => {
  const { dispatch } = useGame();

  return (
    <div className="flex flex-col items-center justify-between min-h-[calc(100vh-4rem)] max-w-md mx-auto px-4 py-6 animate-fade-in">
      {/* 1. Hero Vector Composition */}
      <div className="w-full flex flex-col items-center text-center mt-2">
        <HeroIllustration className="mb-5" />

        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-chomu-text mb-2">
          CHOMU <span className="text-chomu-purple">WHO?</span>
        </h1>
        <p className="text-sm text-chomu-muted font-medium max-w-[280px]">
          One word. Hidden identities. Zero trust.
        </p>
      </div>

      {/* 2. Main Actions */}
      <div className="w-full max-w-[300px] space-y-3 mb-8">
        <Button
          variant="primary"
          size="xl"
          fullWidth
          leftIcon={<Play className="w-5 h-5 fill-current" />}
          onClick={() => dispatch({ type: 'SET_PHASE', phase: 'SETUP' })}
          className="text-base"
        >
          START GAME
        </Button>

        <div className="grid grid-cols-2 gap-2.5">
          <Button
            variant="secondary"
            size="md"
            leftIcon={<PlusCircle className="w-4 h-4 text-chomu-lime" />}
            onClick={() => dispatch({ type: 'SET_PHASE', phase: 'CUSTOM_CATEGORIES' })}
          >
            Custom Words
          </Button>

          <Button
            variant="secondary"
            size="md"
            leftIcon={<BookOpen className="w-4 h-4 text-chomu-purple" />}
            onClick={() => dispatch({ type: 'SET_PHASE', phase: 'RULES' })}
          >
            How to Play
          </Button>
        </div>

        <Button
          variant="outline"
          size="md"
          fullWidth
          leftIcon={<Database className="w-4 h-4 text-chomu-purple" />}
          onClick={() => dispatch({ type: 'SET_PHASE', phase: 'WORD_STUDIO' })}
          className="text-xs font-bold text-chomu-muted hover:text-chomu-text"
        >
          Word Bank Studio (548 Words)
        </Button>
      </div>

      {/* 3. Minimal Footer */}
      <footer className="text-center text-xs text-chomu-muted font-medium py-2">
        <span>Pass &amp; Play &bull; One Device &bull; 100% Offline</span>
      </footer>
    </div>
  );
};
