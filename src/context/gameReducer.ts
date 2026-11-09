import { Category, GamePhase, GameSettings, GameState, Player } from '../types/game';
import { assignRoles, generateRevealOrder } from '../services/roleAssignment';
import { selectSecretWord } from '../services/wordSelector';
import { assignUniqueImposterHints } from '../data/wordDatabase';
import { storageService } from '../services/storageService';
import { RandomSource } from '../services/random';

export type GameAction =
  | { type: 'SET_PHASE'; phase: GamePhase }
  | { type: 'UPDATE_PLAYERS'; players: Player[] }
  | { type: 'UPDATE_SETTINGS'; settings: Partial<GameSettings> }
  | { type: 'START_GAME'; allCategories: Category[]; randomSource?: RandomSource }
  | { type: 'NEXT_REVEAL' }
  | { type: 'START_ROUND' }
  | { type: 'REVEAL_IMPOSTERS' }
  | { type: 'REMATCH'; allCategories: Category[]; randomSource?: RandomSource }
  | { type: 'RESET_TO_SETUP' }
  | { type: 'RESET_TO_HOME' };

export function initializeState(initialPlayers: Player[], initialSettings: GameSettings): GameState {
  return {
    phase: 'HOME',
    players: initialPlayers,
    settings: initialSettings,
    currentRevealIndex: 0,
    usedWords: [],
    secret: null,
  };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_PHASE':
      return { ...state, phase: action.phase };

    case 'UPDATE_PLAYERS': {
      storageService.savePlayers(action.players);
      return {
        ...state,
        players: action.players,
      };
    }

    case 'UPDATE_SETTINGS': {
      const updated = { ...state.settings, ...action.settings };
      storageService.saveSettings(updated);
      return { ...state, settings: updated };
    }

    case 'START_GAME': {
      if (state.players.length < 3) {
        return state;
      }

      const { wordEntry, updatedUsedWords } = selectSecretWord(
        action.allCategories,
        state.settings.selectedCategoryIds,
        state.usedWords,
        state.settings.hintDifficulty,
        action.randomSource
      );

      // Independently assign roles based on stable player IDs
      const roles = assignRoles(state.players, state.settings.imposterCount, action.randomSource);

      const imposterIds = Object.keys(roles).filter(id => roles[id].isImposter);
      const imposterHints = assignUniqueImposterHints(
        wordEntry,
        imposterIds,
        state.settings.hintDifficulty,
        action.randomSource
      );

      // Independently randomize the pass-and-play reveal sequence
      const revealOrder = generateRevealOrder(
        state.players.map(p => p.id),
        action.randomSource
      );

      return {
        ...state,
        phase: 'PASS_DEVICE',
        currentRevealIndex: 0,
        usedWords: updatedUsedWords,
        secret: {
          wordEntry,
          secretWord: wordEntry.word,
          secretCategory: wordEntry.categoryName,
          roles,
          revealOrder,
          imposterHints,
        },
      };
    }

    case 'NEXT_REVEAL': {
      if (!state.secret) return state;
      const nextIndex = state.currentRevealIndex + 1;
      // Advance to next player if not at the end
      if (nextIndex < state.secret.revealOrder.length) {
        return {
          ...state,
          currentRevealIndex: nextIndex,
        };
      }
      // On the final player, do not automatically transition to ROUND_IN_PROGRESS.
      // Wait for the player to explicitly click START ROUND.
      return state;
    }

    case 'START_ROUND': {
      return {
        ...state,
        phase: 'ROUND_IN_PROGRESS',
      };
    }

    case 'REVEAL_IMPOSTERS': {
      return {
        ...state,
        phase: 'FINAL_REVEAL',
      };
    }

    case 'REMATCH': {
      if (!state.secret || state.players.length < 3) return state;

      const { wordEntry, updatedUsedWords } = selectSecretWord(
        action.allCategories,
        state.settings.selectedCategoryIds,
        state.usedWords,
        state.settings.hintDifficulty,
        action.randomSource
      );

      const roles = assignRoles(state.players, state.settings.imposterCount, action.randomSource);
      const imposterIds = Object.keys(roles).filter(id => roles[id].isImposter);
      const imposterHints = assignUniqueImposterHints(
        wordEntry,
        imposterIds,
        state.settings.hintDifficulty,
        action.randomSource
      );

      const revealOrder = generateRevealOrder(
        state.players.map(p => p.id),
        action.randomSource
      );

      return {
        ...state,
        phase: 'PASS_DEVICE',
        currentRevealIndex: 0,
        usedWords: updatedUsedWords,
        secret: {
          wordEntry,
          secretWord: wordEntry.word,
          secretCategory: wordEntry.categoryName,
          roles,
          revealOrder,
          imposterHints,
        },
      };
    }

    case 'RESET_TO_SETUP':
      return {
        ...state,
        phase: 'SETUP',
        secret: null,
      };

    case 'RESET_TO_HOME':
      return {
        ...state,
        phase: 'HOME',
        secret: null,
      };

    default:
      return state;
  }
}
