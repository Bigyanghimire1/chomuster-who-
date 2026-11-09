import { describe, it, expect } from 'vitest';
import { HINT_SUPPORTED_WORDS, assignUniqueImposterHints } from '../data/wordDatabase';

describe('Strict Single-Word Imposter Hint System', () => {
  const singleWordRegex = /^[\p{L}\p{N}]+$/u;

  it('guarantees 100+ curated words each with 9 strictly single-word distinct hints', () => {
    expect(HINT_SUPPORTED_WORDS.length).toBeGreaterThanOrEqual(100);

    for (const entry of HINT_SUPPORTED_WORDS) {
      expect(entry.hints).toBeDefined();
      if (!entry.hints) continue;

      const all9Hints: string[] = [];

      for (const diff of ['subtle', 'balanced', 'easy'] as const) {
        const hintList = entry.hints[diff];
        expect(hintList).toHaveLength(3);

        for (const hint of hintList) {
          // 1. Strict single-word validation (Unicode-aware, no spaces, punctuation, or sentences)
          expect(singleWordRegex.test(hint)).toBe(true);
          expect(hint).not.toMatch(/\s/);
          expect(hint.length).toBeGreaterThanOrEqual(2);

          // 2. Hint must not equal the secret word
          expect(hint.toLowerCase()).not.toBe(entry.word.toLowerCase());

          // 3. Secret word stem must not be trivially disclosed
          if (entry.word.length > 4 && hint.length > 4) {
            expect(entry.word.toLowerCase()).not.toContain(hint.toLowerCase());
            expect(hint.toLowerCase()).not.toContain(entry.word.toLowerCase());
          }

          all9Hints.push(hint.toLowerCase());
        }
      }

      // 4. Verify all 9 hints for this word are unique
      const uniqueSet = new Set(all9Hints);
      expect(uniqueSet.size).toBe(9);
    }
  });

  it('assigns unique, non-repeating single words to up to 3 imposters', () => {
    const wordEntry = HINT_SUPPORTED_WORDS[0];
    const imposterIds = ['imp_1', 'imp_2', 'imp_3'];

    for (const diff of ['subtle', 'balanced', 'easy'] as const) {
      const assigned = assignUniqueImposterHints(wordEntry, imposterIds, diff);

      expect(Object.keys(assigned)).toHaveLength(3);
      expect(assigned['imp_1']).toBeTruthy();
      expect(assigned['imp_2']).toBeTruthy();
      expect(assigned['imp_3']).toBeTruthy();

      // Ensure all 3 imposters received DIFFERENT single words
      expect(assigned['imp_1']).not.toBe(assigned['imp_2']);
      expect(assigned['imp_2']).not.toBe(assigned['imp_3']);
      expect(assigned['imp_1']).not.toBe(assigned['imp_3']);

      // Ensure every assigned hint is a strict single word
      expect(singleWordRegex.test(assigned['imp_1'])).toBe(true);
      expect(singleWordRegex.test(assigned['imp_2'])).toBe(true);
      expect(singleWordRegex.test(assigned['imp_3'])).toBe(true);
    }
  });

  it('assigns empty hints when hintDifficulty is none (Blind Mode)', () => {
    const wordEntry = HINT_SUPPORTED_WORDS[0];
    const imposterIds = ['imp_1', 'imp_2', 'imp_3'];
    const assigned = assignUniqueImposterHints(wordEntry, imposterIds, 'none');

    expect(assigned['imp_1']).toBe('');
    expect(assigned['imp_2']).toBe('');
    expect(assigned['imp_3']).toBe('');
  });
});
