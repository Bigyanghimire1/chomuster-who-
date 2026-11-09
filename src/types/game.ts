import { HintDifficulty, WordEntry } from '../data/wordDatabase';

export type GamePhase =
  | 'HOME'
  | 'SETUP'
  | 'PASS_DEVICE'
  | 'ROUND_IN_PROGRESS'
  | 'FINAL_REVEAL'
  | 'CUSTOM_CATEGORIES'
  | 'RULES'
  | 'WORD_STUDIO';

export type PlayerAvatarId =
  | 'sleuth'
  | 'shadow'
  | 'pokerface'
  | 'agent'
  | 'whiz'
  | 'maverick'
  | 'whisperer'
  | 'detective';

export interface Player {
  id: string;
  name: string;
  score: number;
  avatar: PlayerAvatarId;
}

export interface GameSettings {
  imposterCount: number; // 1, 2, or 3
  selectedCategoryIds: string[];
  hintDifficulty: HintDifficulty; // 'subtle' (default), 'balanced', 'easy', 'none'
  soundEnabled: boolean;
}

export interface PlayerRoleAssignment {
  playerId: string;
  isImposter: boolean;
  role: 'Civilian' | 'Imposter';
}

export interface CustomWordWithHints {
  word: string;
  hints?: {
    subtle?: string[];
    balanced?: string[];
    easy?: string[];
  };
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  words: string[];
  customWordEntries?: CustomWordWithHints[];
  isCustom?: boolean;
}

export interface TransientSecretState {
  wordEntry: WordEntry;
  secretWord: string;
  secretCategory: string;
  roles: Record<string, PlayerRoleAssignment>;
  revealOrder: string[]; // Independent shuffled order of player IDs for pass-and-play
  imposterHints: Record<string, string>; // Distinct hint assigned per imposter ID
}

export interface GameState {
  phase: GamePhase;
  players: Player[];
  settings: GameSettings;
  currentRevealIndex: number;
  usedWords: string[];
  // Strictly transient in-memory state - never persisted
  secret: TransientSecretState | null;
}
