import React from 'react';
import { Wifi, PlusCircle, BookOpen, Database, Smartphone } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { Button } from '../common/Button';
import { HeroIllustration } from '../illustrations/HeroIllustration';

interface HomeViewProps {
  onPlayOnline?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onPlayOnline }) => {
  const { dispatch } = useGame();

  return (
    <div className="flex flex-col items-center justify-between flex-1 max-w-md mx-auto px-4 py-6 animate-fade-in">
      {/* 1. Hero Vector Composition */}
      <div className="w-full flex flex-col items-center text-center mt-1">
        <HeroIllustration className="mb-4" />

        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-chomu-text mb-1.5">
          CHOMU <span className="text-chomu-purple">WHO?</span>
        </h1>
        <p className="text-sm text-chomu-muted font-medium max-w-[280px]">
          One word. Hidden identities. Zero trust.
        </p>
      </div>

      {/* 2. Main Game Modes (Prominent Selection) */}
      <div className="w-full max-w-[340px] space-y-3.5 my-5">
        <div className="space-y-2.5">
          {/* Mode 1: Pass & Play (Offline Party) */}
          <Button
            variant="primary"
            size="xl"
            fullWidth
            leftIcon={<Smartphone className="w-5 h-5 flex-shrink-0" />}
            onClick={() => dispatch({ type: 'SET_PHASE', phase: 'SETUP' })}
            className="flex-col py-3.5 shadow-lg shadow-chomu-purple/20 border border-chomu-purple/40"
          >
            <div className="flex items-center gap-1.5 leading-tight">
              <span className="text-base font-black tracking-tight">Pass &amp; Play</span>
              <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-md bg-chomu-bg/30 text-chomu-text">
                Offline Party
              </span>
            </div>
            <span className="text-[11px] font-semibold text-chomu-text/85 tracking-normal mt-0.5">
              One shared device &bull; 3 to 15 players
            </span>
          </Button>

          {/* Mode 2: Play Online (With Friends) */}
          <Button
            variant="lime"
            size="xl"
            fullWidth
            leftIcon={<Wifi className="w-5 h-5 flex-shrink-0" />}
            onClick={() => onPlayOnline?.()}
            className="flex-col py-3.5 shadow-lg shadow-chomu-lime/20 border border-chomu-lime/40"
          >
            <div className="flex items-center gap-1.5 leading-tight">
              <span className="text-base font-black tracking-tight">Play Online</span>
              <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-md bg-chomu-bg/30 text-chomu-text">
                With Friends
              </span>
            </div>
            <span className="text-[11px] font-semibold text-chomu-text/85 tracking-normal mt-0.5">
              P2P rooms &bull; Secret cards &bull; Voice chat
            </span>
          </Button>
        </div>

        {/* Secondary Navigation (Preserves all existing features) */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
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
      <footer className="text-center text-xs text-chomu-muted font-medium py-1">
        <span>Pass &amp; Play &bull; Online Multiplayer &bull; Voice Chat</span>
      </footer>
    </div>
  );
};
