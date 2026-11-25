import React, { useState } from 'react';
import { Volume2, VolumeX, BookOpen, Home } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { useMultiplayer } from '../../context/MultiplayerContext';
import { ChomuLogo } from '../illustrations/ChomuLogo';
import { ConfirmModal } from './ConfirmModal';
import { audioService } from '../../services/audioService';

export const Header: React.FC = () => {
  const { state, dispatch, toggleSound } = useGame();
  const [confirmTarget, setConfirmTarget] = useState<'online' | 'local' | null>(null);

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

  const handleHomeClick = () => {
    audioService.playNav();
    if (isInOnlineRoom && leaveRoom) {
      setConfirmTarget('online');
      return;
    }
    if (isPlaying) {
      setConfirmTarget('local');
      return;
    }
    dispatch({ type: 'SET_PHASE', phase: 'HOME' });
  };

  const handleConfirmLeave = async () => {
    const target = confirmTarget;
    setConfirmTarget(null);
    if (target === 'online' && leaveRoom) {
      await leaveRoom();
      dispatch({ type: 'RESET_TO_HOME' });
    } else if (target === 'local') {
      dispatch({ type: 'RESET_TO_HOME' });
    }
  };

  const handleRulesClick = () => {
    audioService.playNav();
    dispatch({ type: 'SET_PHASE', phase: 'RULES' });
  };

  return (
    <>
      <header
        className="w-full border-b border-white/[0.08] bg-chomu-bg sticky top-0 z-40 app-header"
        style={{
          paddingTop: 'env(safe-area-inset-top, 0px)',
          minHeight: 'calc(56px + env(safe-area-inset-top, 0px))',
        }}
      >
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <button
            type="button"
            onClick={handleHomeClick}
            aria-label="Chomu Who, return to home"
            className="flex items-center gap-2.5 cursor-pointer group select-none min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-chomu-purple rounded-[10px] px-1 text-left"
          >
            <ChomuLogo size="sm" />
            <span className="font-semibold text-chomu-text text-base tracking-[-0.01em] group-hover:text-chomu-purple transition-colors">
              Chomu Who
            </span>
          </button>

          <div className="flex items-center gap-1">
            {isInOnlineRoom && roomState?.roomCode && (
              <span className="text-xs font-mono font-medium tabular-nums px-2.5 py-1 rounded-md bg-chomu-surface text-chomu-secondary border border-white/[0.08] mr-1">
                {roomState.roomCode}
              </span>
            )}

            {(state.phase !== 'HOME' || isInOnlineRoom) && (
              <button
                type="button"
                onClick={handleHomeClick}
                title="Home"
                aria-label="Home"
                className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2.5 text-chomu-secondary hover:text-chomu-text rounded-[10px] hover:bg-chomu-surface transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-chomu-purple"
              >
                <Home className="w-4 h-4" strokeWidth={1.5} />
              </button>
            )}

            <button
              type="button"
              onClick={handleRulesClick}
              title="How to play"
              aria-label="How to play"
              className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2.5 text-chomu-secondary hover:text-chomu-text rounded-[10px] hover:bg-chomu-surface transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-chomu-purple"
            >
              <BookOpen className="w-4 h-4" strokeWidth={1.5} />
            </button>

            <button
              type="button"
              onClick={() => {
                toggleSound();
                if (!state.settings.soundEnabled) {
                  setTimeout(() => audioService.playButtonTap(), 40);
                }
              }}
              title={state.settings.soundEnabled ? 'Mute sound effects' : 'Unmute sound effects'}
              aria-label={state.settings.soundEnabled ? 'Mute sound effects' : 'Unmute sound effects'}
              className={`min-w-[44px] min-h-[44px] flex items-center justify-center p-2.5 rounded-[10px] hover:bg-chomu-surface transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-chomu-purple ${
                state.settings.soundEnabled ? 'text-chomu-text' : 'text-chomu-muted'
              }`}
            >
              {state.settings.soundEnabled ? (
                <Volume2 className="w-4 h-4" strokeWidth={1.5} />
              ) : (
                <VolumeX className="w-4 h-4" strokeWidth={1.5} />
              )}
            </button>
          </div>
        </div>
      </header>

      <ConfirmModal
        isOpen={confirmTarget !== null}
        title={confirmTarget === 'online' ? 'Leave online room' : 'Leave active game'}
        description={
          confirmTarget === 'online'
            ? 'You will disconnect from voice chat and leave the current room.'
            : 'Current round progress will be cleared if you return home.'
        }
        confirmLabel="Leave"
        cancelLabel="Stay"
        destructive={true}
        onConfirm={handleConfirmLeave}
        onCancel={() => setConfirmTarget(null)}
      />
    </>
  );
};
