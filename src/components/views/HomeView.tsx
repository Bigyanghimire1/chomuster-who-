import React from 'react';
import { Wifi, PlusCircle, BookOpen, Smartphone } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { Button } from '../common/Button';
import { HeroIllustration } from '../illustrations/HeroIllustration';

interface HomeViewProps {
  onPlayOnline?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onPlayOnline }) => {
  const { dispatch } = useGame();

  return (
    <div className="flex flex-col justify-between flex-1 w-full max-w-md md:max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 animate-fade-in">
      {/* 2-Column Responsive Grid on md+ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center my-auto w-full">
        {/* Left Column: Hero Brand & Illustration */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <HeroIllustration className="mb-4 max-w-[260px] sm:max-w-[320px] md:max-w-[380px] lg:max-w-[420px]" />
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-chomu-text mb-2">
            CHOMU <span className="text-chomu-purple">WHO?</span>
          </h1>
          <p className="text-sm sm:text-base text-chomu-muted font-medium max-w-[360px] leading-relaxed">
            One word. Hidden identities. Zero trust. The ultimate multiplayer social deduction party game.
          </p>
        </div>

        {/* Right Column: Game Mode Selection Cards */}
        <div className="w-full space-y-4 max-w-md mx-auto md:max-w-none">
          {/* Mode 1: Pass & Play (Offline Party) */}
          <Button
            variant="primary"
            size="xl"
            fullWidth
            leftIcon={<Smartphone className="w-6 h-6 flex-shrink-0" />}
            onClick={() => dispatch({ type: 'SET_PHASE', phase: 'SETUP' })}
            className="flex-col py-4 px-5 items-start text-left shadow-xl shadow-chomu-purple/20 border border-chomu-purple/40 hover:scale-[1.01] transition-transform"
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-lg font-black tracking-tight text-chomu-bg">Pass &amp; Play</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-chomu-bg/30 text-chomu-bg">
                Offline Party
              </span>
            </div>
            <span className="text-xs font-semibold text-chomu-bg/85 tracking-normal mt-1">
              One shared device &bull; 3 to 15 players
            </span>
          </Button>

          {/* Mode 2: Play Online (With Friends) */}
          <Button
            variant="lime"
            size="xl"
            fullWidth
            leftIcon={<Wifi className="w-6 h-6 flex-shrink-0" />}
            onClick={() => onPlayOnline?.()}
            className="flex-col py-4 px-5 items-start text-left shadow-xl shadow-chomu-lime/20 border border-chomu-lime/40 hover:scale-[1.01] transition-transform"
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-lg font-black tracking-tight text-chomu-bg">Play Online</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-chomu-bg/30 text-chomu-bg">
                With Friends
              </span>
            </div>
            <span className="text-xs font-semibold text-chomu-bg/85 tracking-normal mt-1">
              P2P rooms &bull; Secret cards &bull; Voice chat
            </span>
          </Button>

          {/* Secondary Navigation */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button
              variant="secondary"
              size="md"
              leftIcon={<PlusCircle className="w-4 h-4 text-chomu-lime" />}
              onClick={() => dispatch({ type: 'SET_PHASE', phase: 'CUSTOM_CATEGORIES' })}
              className="min-h-[44px]"
            >
              Custom Words
            </Button>

            <Button
              variant="secondary"
              size="md"
              leftIcon={<BookOpen className="w-4 h-4 text-chomu-purple" />}
              onClick={() => dispatch({ type: 'SET_PHASE', phase: 'RULES' })}
              className="min-h-[44px]"
            >
              How to Play
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-xs text-chomu-muted font-medium py-3 mt-4">
        <span>Pass &amp; Play &bull; Online Multiplayer &bull; Voice Chat</span>
      </footer>
    </div>
  );
};
