import React, { useEffect, useState, Suspense, lazy } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { MultiplayerProvider, useMultiplayer } from './context/MultiplayerContext';
import { Header } from './components/common/Header';
import { HomeView } from './components/views/HomeView';
import { SetupView } from './components/views/SetupView';
import { RoleRevealView } from './components/views/RoleRevealView';
import { RoundInProgressView } from './components/views/RoundInProgressView';
import { FinalRevealView } from './components/views/FinalRevealView';
import { OnlineJoinModal } from './components/views/online/OnlineJoinModal';
import { VoiceControls } from './components/common/VoiceControls';
import {
  isValidRoomCode,
  normalizeRoomCode,
} from './services/multiplayer/roomCodeGenerator';

// Lazy-load online multiplayer views & editorial workspaces to keep initial PWA bundle lean and instantaneous
const OnlineLobbyView = lazy(() =>
  import('./components/views/online/OnlineLobbyView').then(m => ({ default: m.OnlineLobbyView }))
);
const OnlineRoleRevealView = lazy(() =>
  import('./components/views/online/OnlineRoleRevealView').then(m => ({ default: m.OnlineRoleRevealView }))
);
const OnlineRoundView = lazy(() =>
  import('./components/views/online/OnlineRoundView').then(m => ({ default: m.OnlineRoundView }))
);
const OnlineVotingView = lazy(() =>
  import('./components/views/online/OnlineVotingView').then(m => ({ default: m.OnlineVotingView }))
);
const OnlineResultsView = lazy(() =>
  import('./components/views/online/OnlineResultsView').then(m => ({ default: m.OnlineResultsView }))
);

const CustomCategoriesView = lazy(() =>
  import('./components/views/CustomCategoriesView').then(m => ({ default: m.CustomCategoriesView }))
);
const RulesView = lazy(() =>
  import('./components/views/RulesView').then(m => ({ default: m.RulesView }))
);

const ViewLoadingFallback: React.FC = () => (
  <div className="flex-1 flex items-center justify-center min-h-[50vh]">
    <div className="w-8 h-8 rounded-full border-2 border-chomu-purple border-t-transparent animate-spin" />
  </div>
);

/**
 * Checks URL for invite query parameters (?room=CODE, ?code=CODE)
 * or path segments (/join/CODE).
 */
export const getInviteCodeFromUrl = (
  locationOverride?: { search?: string; pathname?: string }
): string | null => {
  const loc =
    locationOverride ||
    (typeof window !== 'undefined' ? window.location : undefined);

  if (!loc) return null;

  try {
    // 1. Query parameter: ?room=CODE or ?code=CODE
    const searchStr = loc.search || '';
    const params = new URLSearchParams(searchStr);
    const queryParam = params.get('room') || params.get('code');
    if (queryParam) {
      const code = normalizeRoomCode(queryParam);
      if (isValidRoomCode(code)) {
        return code;
      }
    }

    // 2. Path parameter: /join/CODE or /join/CODE/
    const pathStr = loc.pathname || '';
    const pathMatch = pathStr.match(/\/join\/([A-Za-z0-9]+)/i);
    if (pathMatch && pathMatch[1]) {
      const code = normalizeRoomCode(pathMatch[1]);
      if (isValidRoomCode(code)) {
        return code;
      }
    }
  } catch (err) {
    console.error('[App] Error inspecting URL for invite parameters:', err);
  }

  return null;
};

const GameRouter: React.FC = () => {
  const { state: localGameState } = useGame();
  const { roomState, phase: onlinePhase } = useMultiplayer();

  const [isJoinModalOpen, setIsJoinModalOpen] = useState<boolean>(false);
  const [inviteRoomCode, setInviteRoomCode] = useState<string | null>(null);

  const isInOnlineRoom = Boolean(roomState && roomState.roomCode);

  // Check URL parameter for room invites on load
  useEffect(() => {
    const inviteCode = getInviteCodeFromUrl();
    if (inviteCode && !isInOnlineRoom) {
      setInviteRoomCode(inviteCode);
      setIsJoinModalOpen(true);
    }
  }, [isInOnlineRoom]);

  // Prevent accidental back navigation or tab close during an active game
  useEffect(() => {
    const isLocalGameActive =
      localGameState.phase === 'PASS_DEVICE' ||
      localGameState.phase === 'ROUND_IN_PROGRESS';
    const isOnlineGameActive =
      isInOnlineRoom && roomState?.phase !== 'RESULTS';
    const isGameActive = isLocalGameActive || isOnlineGameActive;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isGameActive) {
        e.preventDefault();
        e.returnValue = 'A game is currently in progress. Are you sure you want to leave?';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [localGameState.phase, isInOnlineRoom, roomState?.phase]);

  return (
    <div className="min-h-screen flex flex-col bg-chomu-bg text-chomu-text selection:bg-chomu-purple selection:text-chomu-bg relative">
      <Header />
      <main className="flex-1 w-full flex flex-col pb-[env(safe-area-inset-bottom,0px)]">
        <Suspense fallback={<ViewLoadingFallback />}>
          {isInOnlineRoom ? (
            <>
              {/* Secondary modal views accessible while in an online room */}
              {localGameState.phase === 'RULES' && <RulesView />}

              {/* Main Online Phases */}
              {localGameState.phase !== 'RULES' && (
                <>
                  {onlinePhase === 'LOBBY' && <OnlineLobbyView />}
                  {onlinePhase === 'ROLE_REVEAL' && <OnlineRoleRevealView />}
                  {onlinePhase === 'ROUND' && <OnlineRoundView />}
                  {onlinePhase === 'VOTING' && <OnlineVotingView />}
                  {onlinePhase === 'RESULTS' && <OnlineResultsView />}
                </>
              )}
            </>
          ) : (
            <>
              {/* Local Pass & Play Game Phases */}
              {localGameState.phase === 'HOME' && (
                <HomeView onPlayOnline={() => setIsJoinModalOpen(true)} />
              )}
              {localGameState.phase === 'SETUP' && <SetupView />}
              {localGameState.phase === 'PASS_DEVICE' && <RoleRevealView />}
              {localGameState.phase === 'ROUND_IN_PROGRESS' && <RoundInProgressView />}
              {localGameState.phase === 'FINAL_REVEAL' && <FinalRevealView />}
              {localGameState.phase === 'CUSTOM_CATEGORIES' && <CustomCategoriesView />}
              {localGameState.phase === 'RULES' && <RulesView />}
            </>
          )}
        </Suspense>
      </main>

      {/* Floating WebRTC Voice Controls HUD while in an online room */}
      {isInOnlineRoom && <VoiceControls variant="floating" />}

      {/* Online Join / Create Room Modal */}
      <OnlineJoinModal
        isOpen={isJoinModalOpen}
        onClose={() => {
          setIsJoinModalOpen(false);
          setInviteRoomCode(null);
        }}
        initialRoomCode={inviteRoomCode}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <GameProvider>
      <MultiplayerProvider>
        <GameRouter />
      </MultiplayerProvider>
    </GameProvider>
  );
};

export default App;
