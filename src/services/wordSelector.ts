import { Category } from '../types/game';
import { HINT_SUPPORTED_WORDS, WordEntry, HintDifficulty } from '../data/wordDatabase';
import { RandomSource, secureRandomInt } from './random';

export interface WordSelectionResult {
  wordEntry: WordEntry;
  updatedUsedWords: string[];
}

/**
 * Selects a secret word from enabled categories.
 * When hints are enabled, prioritizes hint-supported words.
 * Prevents repeating words across consecutive rounds until the bank is exhausted.
 */
export function selectSecretWord(
  categories: Category[],
  selectedCategoryIds: string[],
  usedWords: string[] = [],
  hintDifficulty: HintDifficulty = 'subtle',
  source?: RandomSource
): WordSelectionResult {
  if (selectedCategoryIds.length === 0) {
    throw new Error('At least one category must be selected.');
  }

  // 1. Check for curated hint-supported words first if hints are enabled
  const hintCandidates: WordEntry[] =
    hintDifficulty !== 'none'
      ? HINT_SUPPORTED_WORDS.filter(w => selectedCategoryIds.includes(w.categoryId))
      : [];

  let pool: WordEntry[] = [];

  if (hintCandidates.length > 0) {
    pool = hintCandidates;
  } else {
    // 2. Fallback to standard/custom category words
    const activeCats = categories.filter(c => selectedCategoryIds.includes(c.id));
    for (const cat of activeCats) {
      for (const w of cat.words) {
        if (typeof w === 'string' && w.trim()) {
          pool.push({
            id: `${cat.id}_${w.trim().toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
            word: w.trim(),
            categoryId: cat.id,
            categoryName: cat.name,
          });
        }
      }
    }
  }

  if (pool.length === 0) {
    throw new Error('The selected categories contain no valid words.');
  }

  // Filter out recently used words
  const usedSet = new Set(usedWords);
  let available = pool.filter(entry => !usedSet.has(entry.word));

  let resetUsedWords = usedWords;
  if (available.length === 0) {
    available = pool;
    resetUsedWords = [];
  }

  const chosenIndex = secureRandomInt(available.length, source);
  const picked = available[chosenIndex];

  return {
    wordEntry: picked,
    updatedUsedWords: [...resetUsedWords, picked.word],
  };
}
