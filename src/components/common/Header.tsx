import React from 'react';
import { Volume2, VolumeX, BookOpen, Home, Database } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { ChomuLogo } from '../illustrations/ChomuLogo';

export const Header: React.FC = () => {
  const { state, dispatch, toggleSound } = useGame();
  const isPlaying = state.phase === 'PASS_DEVICE' || state.phase === 'ROUND_IN_PROGRESS';

  const handleHomeClick = () => {
    if (isPlaying) {
      if (window.confirm('Leave current game and return to home screen?')) {
        dispatch({ type: 'RESET_TO_HOME' });
      }
    } else {
      dispatch({ type: 'SET_PHASE', phase: 'HOME' });
    }
  };

  return (
    <header className="w-full max-w-md mx-auto px-4 py-3 flex items-center justify-between border-b border-chomu-border bg-chomu-bg/95 backdrop-blur-md sticky top-0 z-40">
      <div
        onClick={handleHomeClick}
        className="flex items-center gap-2.5 cursor-pointer group select-none"
      >
        <ChomuLogo size="sm" />
        <div className="flex items-baseline gap-1.5 leading-none">
          <span className="font-black text-chomu-text text-base tracking-tight group-hover:text-chomu-purple transition-colors">
            CHOMU
          </span>
          <span className="font-black text-chomu-purple text-base tracking-tight">
            WHO?
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1">
        {state.phase !== 'HOME' && (
          <button
            onClick={handleHomeClick}
            title="Home"
            className="p-2 text-chomu-muted hover:text-chomu-text rounded-xl hover:bg-chomu-surface transition-colors"
          >
            <Home className="w-4 h-4" />
          </button>
        )}

        <button
          onClick={() => dispatch({ type: 'SET_PHASE', phase: 'WORD_STUDIO' })}
          title="Word Bank Studio"
          className="p-2 text-chomu-muted hover:text-chomu-purple rounded-xl hover:bg-chomu-surface transition-colors"
        >
          <Database className="w-4 h-4" />
        </button>

        <button
          onClick={() => dispatch({ type: 'SET_PHASE', phase: 'RULES' })}
          title="Game Rules"
          className="p-2 text-chomu-muted hover:text-chomu-text rounded-xl hover:bg-chomu-surface transition-colors"
        >
          <BookOpen className="w-4 h-4" />
        </button>

        <button
          onClick={toggleSound}
          title={state.settings.soundEnabled ? 'Mute Sounds' : 'Unmute Sounds'}
          className="p-2 text-chomu-muted hover:text-chomu-text rounded-xl hover:bg-chomu-surface transition-colors"
        >
          {state.settings.soundEnabled ? (
            <Volume2 className="w-4 h-4 text-chomu-purple" />
          ) : (
            <VolumeX className="w-4 h-4 text-chomu-muted/50" />
          )}
        </button>
      </div>
    </header>
  );
};
