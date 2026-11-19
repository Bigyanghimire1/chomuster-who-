import React from 'react';
import { Volume2, VolumeX, BookOpen, Home, Database } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { useMultiplayer } from '../../context/MultiplayerContext';
import { ChomuLogo } from '../illustrations/ChomuLogo';
import { audioService } from '../../services/audioService';

export const Header: React.FC = () => {
  const { state, dispatch, toggleSound } = useGame();
  
  // Safely consume MultiplayerContext if mounted
  let roomState: any = null;
  let leaveRoom: (() => Promise<void>) | null = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const mp = useMultiplayer();
    roomState = mp.roomState;
    leaveRoom = mp.leaveRoom;
  } catch {
    // Ignored if tested without MultiplayerProvider
  }

  const isPlaying = state.phase === 'PASS_DEVICE' || state.phase === 'ROUND_IN_PROGRESS';
  const isInOnlineRoom = Boolean(roomState && roomState.roomCode);

  const handleHomeClick = async () => {
    audioService.playNav();
    if (isInOnlineRoom && leaveRoom) {
      if (window.confirm('Leave current online room and return to home screen?')) {
        await leaveRoom();
        dispatch({ type: 'RESET_TO_HOME' });
      }
      return;
    }
    if (isPlaying) {
      if (window.confirm('Leave current game and return to home screen?')) {
        dispatch({ type: 'RESET_TO_HOME' });
      }
    } else {
      dispatch({ type: 'SET_PHASE', phase: 'HOME' });
    }
  };

  const handleStudioClick = () => {
    audioService.playNav();
    dispatch({ type: 'SET_PHASE', phase: 'WORD_STUDIO' });
  };

  const handleRulesClick = () => {
    audioService.playNav();
    dispatch({ type: 'SET_PHASE', phase: 'RULES' });
  };

  return (
    <header
      className="w-full border-b border-chomu-border bg-chomu-bg/95 backdrop-blur-md sticky top-0 z-40 app-header transition-all"
      style={{
        paddingTop: 'env(safe-area-inset-top, 0px)',
        minHeight: 'calc(56px + env(safe-area-inset-top, 0px))',
      }}
    >
      <div className="w-full max-w-md mx-auto px-4 h-14 flex items-center justify-between">
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
          {isInOnlineRoom && roomState?.roomCode && (
            <span className="text-[11px] font-mono font-black px-2 py-0.5 rounded-full bg-chomu-lime/20 text-chomu-lime border border-chomu-lime/30 mr-1">
              {roomState.roomCode}
            </span>
          )}

          {(state.phase !== 'HOME' || isInOnlineRoom) && (
            <button
              onClick={handleHomeClick}
              title="Home"
              className="p-2 text-chomu-muted hover:text-chomu-text rounded-xl hover:bg-chomu-surface transition-colors"
            >
              <Home className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={handleStudioClick}
            title="Word Bank Studio"
            className="p-2 text-chomu-muted hover:text-chomu-purple rounded-xl hover:bg-chomu-surface transition-colors"
          >
            <Database className="w-4 h-4" />
          </button>

          <button
            onClick={handleRulesClick}
            title="Game Rules"
            className="p-2 text-chomu-muted hover:text-chomu-text rounded-xl hover:bg-chomu-surface transition-colors"
          >
            <BookOpen className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              toggleSound();
              if (!state.settings.soundEnabled) {
                setTimeout(() => audioService.playButtonTap(), 40);
              }
            }}
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
      </div>
    </header>
  );
};
