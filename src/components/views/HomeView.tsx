import React from 'react';
import { Wifi, PlusCircle, BookOpen, Smartphone, ArrowRight } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { Button } from '../common/Button';
import { HeroIllustration } from '../illustrations/HeroIllustration';

interface HomeViewProps {
  onPlayOnline?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onPlayOnline }) => {
  const { dispatch } = useGame();

  return (
    <div className="flex flex-col justify-between flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 lg:py-12 animate-fade-in">
      {/* Split Hero: Left brand & artwork, Right game modes */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center my-auto w-full">
        {/* Left Column: Hero Illustration & Product Statement */}
        <div className="md:col-span-6 flex flex-col items-center md:items-start text-center md:text-left">
          <HeroIllustration className="mb-6 max-w-[260px] sm:max-w-[300px] md:max-w-[340px]" />
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-[-0.025em] leading-[1.08] text-chomu-text mb-3">
            Chomu <span className="text-chomu-purple">Who?</span>
          </h1>
          <p className="text-base text-chomu-secondary font-normal max-w-[400px] leading-6">
            One secret word, hidden roles, and zero trust. Talk over live video or pass one phone around to spot the Chomu.
          </p>
        </div>

        {/* Right Column: Mode Cards & Secondary Links */}
        <div className="md:col-span-6 w-full space-y-3 max-w-md mx-auto md:ml-auto md:mr-0">
          {/* Mode 1: Pass & Play (Offline Party) */}
          <button
            type="button"
            onClick={() => dispatch({ type: 'SET_PHASE', phase: 'SETUP' })}
            className="w-full text-left p-5 rounded-xl bg-chomu-surface border border-white/[0.1] hover:border-chomu-purple/60 hover:bg-chomu-elevated active:scale-[0.99] transition-[background-color,border-color,transform] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-chomu-purple group"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-[10px] bg-chomu-elevated border border-white/[0.08] flex items-center justify-center text-chomu-secondary group-hover:text-chomu-purple shrink-0 mt-0.5 transition-colors">
                  <Smartphone className="w-4 h-4" strokeWidth={1.5} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-semibold text-chomu-text">
                      Pass &amp; Play
                    </span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-chomu-elevated text-chomu-secondary border border-white/[0.08]">
                      Offline Party
                    </span>
                  </div>
                  <p className="text-sm text-chomu-secondary mt-1 leading-5">
                    One shared phone for 3 to 15 players in the same room
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-chomu-muted group-hover:text-chomu-text shrink-0 mt-1 transition-colors" strokeWidth={1.5} />
            </div>
          </button>

          {/* Mode 2: Play Online (With Friends) */}
          <button
            type="button"
            onClick={() => onPlayOnline?.()}
            className="w-full text-left p-5 rounded-xl bg-chomu-text text-chomu-bg hover:bg-white active:scale-[0.99] transition-[background-color,transform] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-chomu-purple shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] group"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-[10px] bg-chomu-bg/10 flex items-center justify-center text-chomu-bg shrink-0 mt-0.5">
                  <Wifi className="w-4 h-4" strokeWidth={1.5} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-semibold text-chomu-bg">
                      Play Online
                    </span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-chomu-bg/10 text-chomu-bg">
                      With Friends
                    </span>
                  </div>
                  <p className="text-sm text-chomu-bg/75 mt-1 leading-5">
                    Private room links, individual secret cards, live voice &amp; video
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-chomu-bg/70 group-hover:text-chomu-bg shrink-0 mt-1 transition-colors" strokeWidth={1.5} />
            </div>
          </button>

          {/* Secondary Navigation */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <Button
              variant="secondary"
              size="md"
              leftIcon={<PlusCircle className="w-4 h-4" strokeWidth={1.5} />}
              onClick={() => dispatch({ type: 'SET_PHASE', phase: 'CUSTOM_CATEGORIES' })}
            >
              Custom Words
            </Button>

            <Button
              variant="secondary"
              size="md"
              leftIcon={<BookOpen className="w-4 h-4" strokeWidth={1.5} />}
              onClick={() => dispatch({ type: 'SET_PHASE', phase: 'RULES' })}
            >
              How to Play
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-xs text-chomu-muted py-4 mt-6 border-t border-white/[0.06]">
        <span>Pass &amp; Play &bull; Online rooms &bull; Peer-to-peer voice &amp; video</span>
      </footer>
    </div>
  );
};
