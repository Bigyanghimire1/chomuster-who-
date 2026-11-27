import React, { createContext, useContext, useEffect, useReducer, useState } from 'react';
import { Category, GameState } from '../types/game';
import { GameAction, gameReducer, initializeState } from './gameReducer';
import { DEFAULT_CATEGORIES } from '../data/categories';
import { storageService } from '../services/storageService';
import { audioService } from '../services/audioService';

interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  allCategories: Category[];
  customCategories: Category[];
  addCustomCategory: (cat: { name: string; icon: string; description: string; words: string[] }) => void;
  deleteCustomCategory: (id: string) => void;
  toggleSound: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const LOCAL_GAME_SESSION_KEY = 'chomu_local_game_state_v1';

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [initialPlayers] = useState(() => storageService.loadPlayers());
  const [initialSettings] = useState(() => storageService.loadSettings());
  const [customCategories, setCustomCategories] = useState<Category[]>(() =>
    storageService.loadCustomCategories()
  );

  const [state, dispatch] = useReducer(
    gameReducer,
    undefined,
    () => {
      try {
        const saved = sessionStorage.getItem(LOCAL_GAME_SESSION_KEY);
        if (saved) {
          const parsed = JSON.parse(saved) as GameState;
          if (parsed && parsed.phase && parsed.phase !== 'HOME' && Array.isArray(parsed.players)) {
            return parsed;
          }
        }
      } catch {
        // Ignore storage errors
      }
      return initializeState(initialPlayers, initialSettings);
    }
  );

  // Persist active local Pass & Play state across page refreshes
  useEffect(() => {
    try {
      if (state.phase === 'HOME') {
        sessionStorage.removeItem(LOCAL_GAME_SESSION_KEY);
      } else {
        sessionStorage.setItem(LOCAL_GAME_SESSION_KEY, JSON.stringify(state));
      }
    } catch {
      // Ignore storage quota errors
    }
  }, [state]);

  // Sync audio mute state
  useEffect(() => {
    audioService.setMuted(!state.settings.soundEnabled);
  }, [state.settings.soundEnabled]);

  const allCategories = [...DEFAULT_CATEGORIES, ...customCategories];

  const addCustomCategory = (cat: { name: string; icon: string; description: string; words: string[] }) => {
    const newCat: Category = {
      ...cat,
      id: `custom_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      isCustom: true,
    };
    const updated = [...customCategories, newCat];
    setCustomCategories(updated);
    storageService.saveCustomCategories(updated);

    // Auto-select the newly added category
    dispatch({
      type: 'UPDATE_SETTINGS',
      settings: {
        selectedCategoryIds: [...state.settings.selectedCategoryIds, newCat.id],
      },
    });
  };

  const deleteCustomCategory = (id: string) => {
    const updated = customCategories.filter(c => c.id !== id);
    setCustomCategories(updated);
    storageService.saveCustomCategories(updated);

    // Remove from selected list if active
    dispatch({
      type: 'UPDATE_SETTINGS',
      settings: {
        selectedCategoryIds: state.settings.selectedCategoryIds.filter(catId => catId !== id),
      },
    });
  };

  const toggleSound = () => {
    dispatch({
      type: 'UPDATE_SETTINGS',
      settings: { soundEnabled: !state.settings.soundEnabled },
    });
  };

  return (
    <GameContext.Provider
      value={{
        state,
        dispatch,
        allCategories,
        customCategories,
        addCustomCategory,
        deleteCustomCategory,
        toggleSound,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export function useGame(): GameContextType {
  const ctx = useContext(GameContext);
  if (!ctx) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return ctx;
}
