import React, { useEffect, Suspense, lazy } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { Header } from './components/common/Header';
import { HomeView } from './components/views/HomeView';
import { SetupView } from './components/views/SetupView';
import { RoleRevealView } from './components/views/RoleRevealView';
import { RoundInProgressView } from './components/views/RoundInProgressView';
import { FinalRevealView } from './components/views/FinalRevealView';

// Lazy-load secondary management & editorial workspaces to keep initial PWA bundle lean and instantaneous
const CustomCategoriesView = lazy(() =>
  import('./components/views/CustomCategoriesView').then(m => ({ default: m.CustomCategoriesView }))
);
const RulesView = lazy(() =>
  import('./components/views/RulesView').then(m => ({ default: m.RulesView }))
);
const WordBankStudioView = lazy(() =>
  import('./components/views/wordStudio/WordBankStudioView').then(m => ({ default: m.WordBankStudioView }))
);

const ViewLoadingFallback: React.FC = () => (
  <div className="flex-1 flex items-center justify-center min-h-[50vh]">
    <div className="w-8 h-8 rounded-full border-2 border-chomu-purple border-t-transparent animate-spin" />
  </div>
);

const GameRouter: React.FC = () => {
  const { state } = useGame();

  // Prevent accidental back navigation or tab close during an active game
  useEffect(() => {
    const isGameActive = state.phase === 'PASS_DEVICE' || state.phase === 'ROUND_IN_PROGRESS';

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
  }, [state.phase]);

  return (
    <div className="min-h-screen flex flex-col bg-chomu-bg text-chomu-text selection:bg-chomu-purple selection:text-chomu-bg">
      <Header />
      <main className="flex-1 w-full flex flex-col pb-[env(safe-area-inset-bottom,0px)]">
        <Suspense fallback={<ViewLoadingFallback />}>
          {state.phase === 'HOME' && <HomeView />}
          {state.phase === 'SETUP' && <SetupView />}
          {state.phase === 'PASS_DEVICE' && <RoleRevealView />}
          {state.phase === 'ROUND_IN_PROGRESS' && <RoundInProgressView />}
          {state.phase === 'FINAL_REVEAL' && <FinalRevealView />}
          {state.phase === 'CUSTOM_CATEGORIES' && <CustomCategoriesView />}
          {state.phase === 'RULES' && <RulesView />}
          {state.phase === 'WORD_STUDIO' && <WordBankStudioView />}
        </Suspense>
      </main>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <GameProvider>
      <GameRouter />
    </GameProvider>
  );
};

export default App;
