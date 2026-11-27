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
        className="w-full border-b-[3px] border-[#050505] bg-[#FFDF00] sticky top-0 z-40 app-header"
        style={{
          paddingTop: 'env(safe-area-inset-top, 0px)',
          minHeight: 'calc(60px + env(safe-area-inset-top, 0px))',
        }}
      >
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 h-[60px] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleHomeClick}
              aria-label="Chomu Who, return to home"
              className="flex items-center gap-2.5 cursor-pointer group select-none min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#050505] rounded-xl px-1 text-left"
            >
              <ChomuLogo size="sm" />
              <span className="font-display font-bold text-[#050505] text-xl tracking-[-0.01em]">
                Chomu Who?
              </span>
            </button>
          </div>

          {!isInOnlineRoom && !isPlaying && (
            <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-2">
              <button
                type="button"
                onClick={handleHomeClick}
                className={`px-4 py-1.5 rounded-xl text-xs font-extrabold border-2 border-[#050505] transition-all ${
                  state.phase === 'HOME' || state.phase === 'SETUP'
                    ? 'bg-[#050505] text-white shadow-[0_3px_0_#050505]'
                    : 'bg-white text-[#050505] shadow-[0_3px_0_#050505] hover:bg-[#F28BCB]'
                }`}
              >
                Play
              </button>
              <button
                type="button"
                onClick={handleRulesClick}
                className={`px-4 py-1.5 rounded-xl text-xs font-extrabold border-2 border-[#050505] transition-all ${
                  state.phase === 'RULES'
                    ? 'bg-[#050505] text-white shadow-[0_3px_0_#050505]'
                    : 'bg-white text-[#050505] shadow-[0_3px_0_#050505] hover:bg-[#A9E5F2]'
                }`}
              >
                How to Play
              </button>
              <button
                type="button"
                onClick={() => {
                  audioService.playNav();
                  dispatch({ type: 'SET_PHASE', phase: 'CUSTOM_CATEGORIES' });
                }}
                className={`px-4 py-1.5 rounded-xl text-xs font-extrabold border-2 border-[#050505] transition-all ${
                  state.phase === 'CUSTOM_CATEGORIES' || state.phase === 'WORD_STUDIO'
                    ? 'bg-[#050505] text-white shadow-[0_3px_0_#050505]'
                    : 'bg-white text-[#050505] shadow-[0_3px_0_#050505] hover:bg-[#64E987]'
                }`}
              >
                Custom Words
              </button>
            </nav>
          )}

          <div className="flex items-center gap-1.5">
            {(state.phase !== 'HOME' || isInOnlineRoom) && (
              <button
                type="button"
                onClick={handleHomeClick}
                title="Home"
                aria-label="Home"
                className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2.5 text-[#050505] rounded-xl bg-white border-2 border-[#050505] shadow-[0_2px_0_#050505] hover:bg-[#FFF9CC] active:translate-y-[2px] active:shadow-none transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#050505]"
              >
                <Home className="w-4 h-4" strokeWidth={2.2} />
              </button>
            )}

            <button
              type="button"
              onClick={handleRulesClick}
              title="How to play"
              aria-label="How to play"
              className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2.5 text-[#050505] rounded-xl bg-white border-2 border-[#050505] shadow-[0_2px_0_#050505] hover:bg-[#A9E5F2] active:translate-y-[2px] active:shadow-none transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#050505]"
            >
              <BookOpen className="w-4 h-4" strokeWidth={2.2} />
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
              className={`min-w-[44px] min-h-[44px] flex items-center justify-center p-2.5 rounded-xl border-2 border-[#050505] shadow-[0_2px_0_#050505] active:translate-y-[2px] active:shadow-none transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#050505] ${
                state.settings.soundEnabled ? 'bg-white text-[#050505]' : 'bg-[#C6C9D1] text-[#050505]'
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
