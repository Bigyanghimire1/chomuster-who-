import React from 'react';
import { Volume2, VolumeX, BookOpen, Home } from 'lucide-react';
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
      <div className="w-full max-w-md md:max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <button
          onClick={handleHomeClick}
          aria-label="Chomu Who? Return to home screen"
          className="flex items-center gap-2.5 cursor-pointer group select-none min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-chomu-purple rounded-xl px-1 text-left"
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
        </button>

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
              aria-label="Home"
              className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2.5 text-chomu-muted hover:text-chomu-text rounded-xl hover:bg-chomu-surface transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-chomu-purple"
            >
              <Home className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={handleRulesClick}
            title="Game Rules"
            aria-label="Game Rules"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2.5 text-chomu-muted hover:text-chomu-text rounded-xl hover:bg-chomu-surface transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-chomu-purple"
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
            aria-label={state.settings.soundEnabled ? 'Mute Sounds' : 'Unmute Sounds'}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2.5 text-chomu-muted hover:text-chomu-text rounded-xl hover:bg-chomu-surface transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-chomu-purple"
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
