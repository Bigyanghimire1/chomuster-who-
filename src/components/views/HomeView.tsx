import React from 'react';
import {
  Wifi,
  PlusCircle,
  BookOpen,
  Smartphone,
  Users,
  Video,
  ArrowRight,
} from 'lucide-react';
import { useGame } from '../../context/GameContext';

interface HomeViewProps {
  onPlayOnline?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onPlayOnline }) => {
  const { dispatch } = useGame();

  return (
    <div className="flex flex-col justify-between flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10 animate-fade-in">
      <div className="my-auto flex flex-col items-center text-center space-y-7 py-2">
        {/* Playful Party Tag + Brand Wordmark */}
        <div className="space-y-4 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border-[2.5px] border-[#050505] shadow-[0_3px_0_#050505] text-xs font-extrabold text-[#050505]">
            <span>3–15 Players</span>
            <span aria-hidden="true">&bull;</span>
            <span>Social Bluffing Party Game</span>
          </div>

          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold tracking-[-0.02em] leading-[1.02] text-[#050505]">
            Find the{' '}
            <span className="inline-block px-4 py-0.5 rounded-2xl bg-[#FF5D73] text-[#050505] border-[3px] border-[#050505] shadow-[0_6px_0_#050505] -rotate-2">
              Chomu
            </span>{' '}
            among your friends.
          </h1>

          <p className="text-base sm:text-lg font-bold text-[#26282E] max-w-[500px] leading-snug">
            Everyone gets the secret word — except one friend who&apos;s faking it. Give clever clues, read faces, and vote out the liar.
          </p>
        </div>

        {/* Oversized Primary & Complementary Game Mode Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-xl">
          <button
            type="button"
            onClick={() => onPlayOnline?.()}
            className="group text-left p-5 sm:p-6 rounded-2xl bg-[#64E987] hover:bg-[#4DDA73] active:translate-y-[3px] active:shadow-[0_2px_0_#050505] text-[#050505] border-[3px] border-[#050505] shadow-[0_6px_0_#050505] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#050505]"
          >
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="w-11 h-11 rounded-xl bg-white border-2 border-[#050505] flex items-center justify-center">
                <Wifi className="w-5 h-5" strokeWidth={2.6} />
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-1 rounded-full bg-white border-2 border-[#050505]">
                <Video className="w-3 h-3" strokeWidth={2.2} />
                With Friends
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <div>
                <div className="text-xl sm:text-2xl font-extrabold leading-tight">Play Online</div>
                <p className="text-xs font-bold text-[#26282E] mt-1">
                  Room code &amp; live video
                </p>
              </div>
              <ArrowRight className="w-5 h-5 shrink-0 group-hover:translate-x-0.5 transition-transform" strokeWidth={2.6} />
            </div>
          </button>

          <button
            type="button"
            onClick={() => dispatch({ type: 'SET_PHASE', phase: 'SETUP' })}
            className="group text-left p-5 sm:p-6 rounded-2xl bg-white hover:bg-[#FFF9CC] active:translate-y-[3px] active:shadow-[0_2px_0_#050505] text-[#050505] border-[3px] border-[#050505] shadow-[0_6px_0_#050505] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#050505]"
          >
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="w-11 h-11 rounded-xl bg-[#A9E5F2] border-2 border-[#050505] flex items-center justify-center">
                <Smartphone className="w-5 h-5" strokeWidth={2.6} />
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-1 rounded-full bg-[#FFDF00] border-2 border-[#050505]">
                <Users className="w-3 h-3" strokeWidth={2.2} />
                Offline Party
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <div>
                <div className="text-xl sm:text-2xl font-extrabold leading-tight">Pass &amp; Play</div>
                <p className="text-xs font-bold text-[#26282E] mt-1">
                  One phone around the room
                </p>
              </div>
              <ArrowRight className="w-5 h-5 shrink-0 group-hover:translate-x-0.5 transition-transform" strokeWidth={2.6} />
            </div>
          </button>
        </div>

        {/* Compact Utility Entries */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => dispatch({ type: 'SET_PHASE', phase: 'CUSTOM_CATEGORIES' })}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-[#B68AF2] border-[2.5px] border-[#050505] shadow-[0_4px_0_#050505] active:translate-y-[2px] active:shadow-none text-xs font-extrabold text-[#050505] transition-all min-h-[44px]"
          >
            <PlusCircle className="w-4 h-4" strokeWidth={2.4} />
            <span>Custom Words</span>
          </button>

          <button
            type="button"
            onClick={() => dispatch({ type: 'SET_PHASE', phase: 'RULES' })}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-[#A9E5F2] border-[2.5px] border-[#050505] shadow-[0_4px_0_#050505] active:translate-y-[2px] active:shadow-none text-xs font-extrabold text-[#050505] transition-all min-h-[44px]"
          >
            <BookOpen className="w-4 h-4" strokeWidth={2.4} />
            <span>How to Play</span>
          </button>
        </div>
      </div>

      <footer className="text-center text-xs font-bold text-[#050505]/75 py-2 mt-2">
        <span>Chomu Who? &bull; Pass &amp; Play &amp; Live Video Party Rooms</span>
      </footer>
    </div>
  );
};
