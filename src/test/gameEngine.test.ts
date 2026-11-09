import { describe, it, expect } from 'vitest';
import { assignRoles, clampImposterCount, getMaxImposters } from '../services/roleAssignment';
import { selectSecretWord } from '../services/wordSelector';
import { gameReducer, initializeState } from '../context/gameReducer';
import { DEFAULT_CATEGORIES, TOTAL_BUILTIN_WORDS } from '../data/categories';
import { Player, GameSettings } from '../types/game';
import { createDeterministicSource } from '../services/random';

describe('Category Database Integrity', () => {
  it('contains exactly 15 default categories', () => {
    expect(DEFAULT_CATEGORIES).toHaveLength(15);
  });

  it('guarantees each category has at least 35 unique non-empty words', () => {
    for (const cat of DEFAULT_CATEGORIES) {
      expect(cat.words.length).toBeGreaterThanOrEqual(35);
      const unique = new Set(cat.words.map(w => w.trim().toLowerCase()));
      expect(unique.size).toBe(cat.words.length);
    }
    expect(TOTAL_BUILTIN_WORDS).toBeGreaterThanOrEqual(500);
  });
});

describe('Role Assignment Engine', () => {
  it('correctly calculates maximum imposters allowed across player counts', () => {
    expect(getMaxImposters(3)).toBe(1);
    expect(getMaxImposters(4)).toBe(1);
    expect(getMaxImposters(5)).toBe(2);
    expect(getMaxImposters(6)).toBe(2);
    expect(getMaxImposters(7)).toBe(3);
    expect(getMaxImposters(15)).toBe(3);
  });

  it('clamps imposter count within safe civilian-majority boundaries', () => {
    expect(clampImposterCount(3, 3)).toBe(1);
    expect(clampImposterCount(4, 2)).toBe(1);
    expect(clampImposterCount(6, 3)).toBe(2);
    expect(clampImposterCount(10, 3)).toBe(3);
  });

  it('fails safely if less than 3 players', () => {
    const players: Player[] = [
      { id: 'p1', name: 'A', score: 0, avatar: 'sleuth' },
      { id: 'p2', name: 'B', score: 0, avatar: 'shadow' },
    ];
    expect(() => assignRoles(players, 1)).toThrow();
  });
});

describe('Word Selection Engine', () => {
  it('selects words strictly from enabled categories', () => {
    const source = createDeterministicSource(99);
    const result = selectSecretWord(DEFAULT_CATEGORIES, ['animals'], [], 'subtle', source);

    expect(result.wordEntry.categoryId).toBe('animals');
    expect(result.updatedUsedWords).toContain(result.wordEntry.word);
  });

  it('prevents immediate word repetition across rounds', () => {
    const source = createDeterministicSource(555);
    const used: string[] = [];

    const first = selectSecretWord(DEFAULT_CATEGORIES, ['food_drinks'], used, 'subtle', source);
    used.push(first.wordEntry.word);

    const second = selectSecretWord(DEFAULT_CATEGORIES, ['food_drinks'], used, 'subtle', source);
    expect(second.wordEntry.word).not.toBe(first.wordEntry.word);
  });
});

describe('Simplified 5-Phase Party Lifecycle: Chomu Who?', () => {
  const testPlayers: Player[] = [
    { id: 'p1', name: 'Player 1', score: 0, avatar: 'sleuth' },
    { id: 'p2', name: 'Player 2', score: 0, avatar: 'shadow' },
    { id: 'p3', name: 'Player 3', score: 0, avatar: 'pokerface' },
    { id: 'p4', name: 'Player 4', score: 0, avatar: 'agent' },
  ];

  const testSettings: GameSettings = {
    imposterCount: 1,
    selectedCategoryIds: ['animals'],
    hintDifficulty: 'subtle',
    soundEnabled: true,
  };

  it('starts game in PASS_DEVICE at index 0 with decoupled reveal order', () => {
    const initial = initializeState(testPlayers, testSettings);
    const started = gameReducer(initial, {
      type: 'START_GAME',
      allCategories: DEFAULT_CATEGORIES,
      randomSource: createDeterministicSource(1),
    });

    expect(started.phase).toBe('PASS_DEVICE');
    expect(started.currentRevealIndex).toBe(0);
    expect(started.secret).not.toBeNull();
    expect(started.secret?.secretWord).toBeTruthy();
    expect(started.secret?.revealOrder).toHaveLength(4);

    const imposterCount = Object.values(started.secret!.roles).filter(r => r.isImposter).length;
    expect(imposterCount).toBe(1);
  });

  it('requires explicit START_ROUND action and does NOT auto-transition on final player reveal', () => {
    const initial = initializeState(testPlayers, testSettings);
    let state = gameReducer(initial, {
      type: 'START_GAME',
      allCategories: DEFAULT_CATEGORIES,
      randomSource: createDeterministicSource(1),
    });

    // Players 0 -> 1 -> 2
    state = gameReducer(state, { type: 'NEXT_REVEAL' });
    expect(state.currentRevealIndex).toBe(1);

    state = gameReducer(state, { type: 'NEXT_REVEAL' });
    expect(state.currentRevealIndex).toBe(2);

    state = gameReducer(state, { type: 'NEXT_REVEAL' });
    expect(state.currentRevealIndex).toBe(3); // Last player (player 4 of 4)

    // On final player, dispatching NEXT_REVEAL must NOT auto-transition to ROUND_IN_PROGRESS
    const afterExtraNext = gameReducer(state, { type: 'NEXT_REVEAL' });
    expect(afterExtraNext.phase).toBe('PASS_DEVICE');
    expect(afterExtraNext.currentRevealIndex).toBe(3);

    // Explicit START_ROUND action triggers transition to ROUND_IN_PROGRESS
    const startedRound = gameReducer(state, { type: 'START_ROUND' });
    expect(startedRound.phase).toBe('ROUND_IN_PROGRESS');
  });

  it('transitions from ROUND_IN_PROGRESS to FINAL_REVEAL when REVEAL_IMPOSTERS is dispatched', () => {
    const initial = initializeState(testPlayers, testSettings);
    let state = gameReducer(initial, {
      type: 'START_GAME',
      allCategories: DEFAULT_CATEGORIES,
      randomSource: createDeterministicSource(1),
    });

    state = gameReducer(state, { type: 'START_ROUND' });
    expect(state.phase).toBe('ROUND_IN_PROGRESS');

    state = gameReducer(state, { type: 'REVEAL_IMPOSTERS' });
    expect(state.phase).toBe('FINAL_REVEAL');
    expect(state.secret).not.toBeNull();
  });

  it('re-randomizes roles, word, hints and sequence on REMATCH', () => {
    const initial = initializeState(testPlayers, testSettings);
    let state = gameReducer(initial, {
      type: 'START_GAME',
      allCategories: DEFAULT_CATEGORIES,
      randomSource: createDeterministicSource(1),
    });

    state = gameReducer(state, { type: 'START_ROUND' });
    state = gameReducer(state, { type: 'REVEAL_IMPOSTERS' });
    expect(state.phase).toBe('FINAL_REVEAL');

    const firstWord = state.secret!.secretWord;

    state = gameReducer(state, {
      type: 'REMATCH',
      allCategories: DEFAULT_CATEGORIES,
      randomSource: createDeterministicSource(999),
    });

    expect(state.phase).toBe('PASS_DEVICE');
    expect(state.currentRevealIndex).toBe(0);
    expect(state.secret).not.toBeNull();
    // Word should not immediately repeat
    expect(state.secret!.secretWord).not.toBe(firstWord);
  });
});
