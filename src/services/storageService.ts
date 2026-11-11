import { Category, GameSettings, Player, PlayerAvatarId } from '../types/game';

const KEYS = {
  ROSTER: 'chomu_who_roster',
  SETTINGS: 'chomu_who_settings',
  CUSTOM_CATEGORIES: 'chomu_who_custom_categories',
  // Backward compatibility keys
  LEGACY_ROSTER: 'imposter_unlocked_roster',
  LEGACY_SETTINGS: 'imposter_unlocked_settings',
  LEGACY_CUSTOM_CATEGORIES: 'imposter_unlocked_custom_categories',
} as const;

export const AVATAR_LIST: PlayerAvatarId[] = [
  'sleuth',
  'shadow',
  'pokerface',
  'agent',
  'whiz',
  'maverick',
  'whisperer',
  'detective',
];

export const DEFAULT_PLAYERS: Player[] = [];

export const DEFAULT_SETTINGS: GameSettings = {
  imposterCount: 1,
  selectedCategoryIds: ['everyday_objects', 'food_drinks', 'animals', 'movies_tv', 'geography'],
  hintDifficulty: 'subtle', // Subtle by default
  soundEnabled: true,
};

export const storageService = {
  loadPlayers(): Player[] {
    try {
      const data = localStorage.getItem(KEYS.ROSTER) || localStorage.getItem(KEYS.LEGACY_ROSTER);
      if (!data) return [];
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        // Automatically migrate away from legacy hardcoded demo players
        const isLegacySampleRoster =
          parsed.length === 4 &&
          parsed[0]?.name === 'Alex' &&
          parsed[1]?.name === 'Sam' &&
          parsed[2]?.name === 'Jordan' &&
          parsed[3]?.name === 'Taylor';

        if (isLegacySampleRoster) {
          localStorage.removeItem(KEYS.ROSTER);
          localStorage.removeItem(KEYS.LEGACY_ROSTER);
          return [];
        }

        return parsed
          .filter(p => p && typeof p.name === 'string' && p.name.trim().length > 0)
          .map((p, idx) => ({
            id: p.id || `p_${Date.now()}_${idx}`,
            name: p.name.trim(),
            score: typeof p.score === 'number' ? p.score : 0,
            avatar: AVATAR_LIST.includes(p.avatar) ? p.avatar : AVATAR_LIST[idx % AVATAR_LIST.length],
          }));
      }
    } catch {
      // Fallback
    }
    return [];
  },

  savePlayers(players: Player[]): void {
    try {
      localStorage.setItem(KEYS.ROSTER, JSON.stringify(players));
    } catch {
      // Ignore quota errors
    }
  },

  loadSettings(): GameSettings {
    try {
      const data = localStorage.getItem(KEYS.SETTINGS) || localStorage.getItem(KEYS.LEGACY_SETTINGS);
      if (data) {
        const parsed = JSON.parse(data);
        const validDifficulties = ['subtle', 'balanced', 'easy', 'none'];
        return {
          ...DEFAULT_SETTINGS,
          ...parsed,
          imposterCount: Math.min(3, Math.max(1, parsed.imposterCount || 1)),
          hintDifficulty: validDifficulties.includes(parsed.hintDifficulty)
            ? parsed.hintDifficulty
            : 'subtle',
          soundEnabled: typeof parsed.soundEnabled === 'boolean' ? parsed.soundEnabled : true,
        };
      }
    } catch {
      // Fallback
    }
    return DEFAULT_SETTINGS;
  },

  saveSettings(settings: GameSettings): void {
    try {
      localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
    } catch {
      // Ignore
    }
  },

  loadCustomCategories(): Category[] {
    try {
      const data =
        localStorage.getItem(KEYS.CUSTOM_CATEGORIES) ||
        localStorage.getItem(KEYS.LEGACY_CUSTOM_CATEGORIES);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
          return parsed.filter(
            cat => cat && typeof cat.id === 'string' && typeof cat.name === 'string' && Array.isArray(cat.words)
          );
        }
      }
    } catch {
      // Fallback
    }
    return [];
  },

  saveCustomCategories(categories: Category[]): void {
    try {
      localStorage.setItem(KEYS.CUSTOM_CATEGORIES, JSON.stringify(categories));
    } catch {
      // Ignore
    }
  },

  clearScores(players: Player[]): Player[] {
    const reset = players.map(p => ({ ...p, score: 0 }));
    this.savePlayers(reset);
    return reset;
  },
};
