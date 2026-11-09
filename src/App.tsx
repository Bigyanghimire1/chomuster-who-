import React, { useEffect } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { Header } from './components/common/Header';
import { HomeView } from './components/views/HomeView';
import { SetupView } from './components/views/SetupView';
import { RoleRevealView } from './components/views/RoleRevealView';
import { RoundInProgressView } from './components/views/RoundInProgressView';
import { FinalRevealView } from './components/views/FinalRevealView';
import { CustomCategoriesView } from './components/views/CustomCategoriesView';
import { RulesView } from './components/views/RulesView';
import { WordBankStudioView } from './components/views/wordStudio/WordBankStudioView';

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
      <main className="flex-1 w-full flex flex-col">
        {state.phase === 'HOME' && <HomeView />}
        {state.phase === 'SETUP' && <SetupView />}
        {state.phase === 'PASS_DEVICE' && <RoleRevealView />}
        {state.phase === 'ROUND_IN_PROGRESS' && <RoundInProgressView />}
        {state.phase === 'FINAL_REVEAL' && <FinalRevealView />}
        {state.phase === 'CUSTOM_CATEGORIES' && <CustomCategoriesView />}
        {state.phase === 'RULES' && <RulesView />}
        {state.phase === 'WORD_STUDIO' && <WordBankStudioView />}
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
