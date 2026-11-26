import React from 'react';
import { Wifi, PlusCircle, BookOpen, Smartphone, Users, Video } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { Button } from '../common/Button';
import { HeroIllustration } from '../illustrations/HeroIllustration';

interface HomeViewProps {
  onPlayOnline?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onPlayOnline }) => {
  const { dispatch } = useGame();

  return (
    <div className="flex flex-col justify-between flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 lg:py-10 animate-fade-in">
      {/* Main Hero Stage */}
      <div className="my-auto w-full rounded-3xl bg-chomu-bgSecondary border border-white/[0.1] border-b-[4px] border-b-[#04070D] p-6 sm:p-9 lg:p-12 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_20px_56px_rgba(0,0,0,0.48)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left: Brand Headline, Single Clear Mode Launchers & Utility Pills */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-5">
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-[-0.03em] leading-[1.04] text-chomu-text">
                Chomu <span className="text-chomu-teal">Who?</span>
              </h1>

              <p className="text-lg sm:text-xl font-medium text-chomu-text/95 leading-snug">
                Find the{' '}
                <span className="inline-flex items-center px-3 py-0.5 rounded-full bg-chomu-yellow text-chomu-bg font-bold shadow-[inset_0_-2px_0_rgba(0,0,0,0.2)]">
                  Chomu
                </span>{' '}
                among your friends!
              </p>

              <p className="text-sm sm:text-base text-chomu-secondary max-w-[440px] mx-auto lg:mx-0 leading-6">
                One secret word, hidden roles, and zero trust. Bluff over live video or pass one phone around to catch the liar.
              </p>
            </div>

            {/* Primary Game Mode Launchers (no duplicate Play buttons) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg pt-1">
              <button
                type="button"
                onClick={() => onPlayOnline?.()}
                className="text-left p-4 rounded-3xl bg-chomu-coral hover:bg-chomu-coralHover active:bg-chomu-coralActive text-white border border-chomu-coral border-b-[4px] border-b-[#B83237] active:translate-y-[2px] active:border-b-[2px] shadow-[inset_0_1px_0_rgba(255,255,255,0.3)] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-chomu-teal group"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="inline-flex items-center gap-2 text-base font-bold">
                    <Wifi className="w-4 h-4 shrink-0" strokeWidth={2.2} />
                    <span>Play Online</span>
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-black/20">
                    With Friends
                  </span>
                </div>
                <p className="text-xs text-white/85 leading-4">
                  Private room links with friends anywhere
                </p>
              </button>

              <button
                type="button"
                onClick={() => dispatch({ type: 'SET_PHASE', phase: 'SETUP' })}
                className="text-left p-4 rounded-3xl bg-chomu-teal hover:bg-chomu-tealHover active:bg-chomu-tealActive text-chomu-bg border border-chomu-teal border-b-[4px] border-b-[#0E8F79] active:translate-y-[2px] active:border-b-[2px] shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-chomu-teal group"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="inline-flex items-center gap-2 text-base font-bold">
                    <Smartphone className="w-4 h-4 shrink-0" strokeWidth={2.2} />
                    <span>Pass &amp; Play</span>
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-black/15">
                    Offline Party
                  </span>
                </div>
                <p className="text-xs text-chomu-bg/85 font-medium leading-4">
                  Pass one device around the room
                </p>
              </button>
            </div>

            {/* Secondary Utility Pills */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 pt-1">
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<PlusCircle className="w-4 h-4 text-chomu-teal" strokeWidth={1.75} />}
                onClick={() => dispatch({ type: 'SET_PHASE', phase: 'CUSTOM_CATEGORIES' })}
              >
                Custom Words
              </Button>

              <Button
                variant="secondary"
                size="sm"
                leftIcon={<BookOpen className="w-4 h-4 text-chomu-yellow" strokeWidth={1.75} />}
                onClick={() => dispatch({ type: 'SET_PHASE', phase: 'RULES' })}
              >
                How to Play
              </Button>
            </div>

            {/* Feature Strip */}
            <div className="w-full pt-4 border-t border-white/[0.08] flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 text-xs font-medium text-chomu-secondary">
              <span className="inline-flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-chomu-teal" strokeWidth={1.75} />
                <span>3 – 15 Players</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5 text-chomu-coral" strokeWidth={1.75} />
                <span>Live Video &amp; Voice</span>
              </span>
            </div>
          </div>

          {/* Right: Flagship Chomu Mascot Centerpiece */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <HeroIllustration className="max-w-[270px] sm:max-w-[320px] lg:max-w-[350px]" />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-xs text-chomu-muted py-4 mt-4">
        <span>Pass &amp; Play &bull; Online rooms &bull; Peer-to-peer voice &amp; video</span>
      </footer>
    </div>
  );
};
