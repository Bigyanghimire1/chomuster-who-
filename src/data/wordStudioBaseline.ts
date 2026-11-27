import { ReviewableWordEntry } from '../types/wordStudio';
import { HINT_SUPPORTED_WORDS } from './wordDatabase';

/**
 * Baseline Word Inventory for the Chomu Who? Word Bank Studio.
 * Derived directly from HINT_SUPPORTED_WORDS (593 curated words across 15 categories)
 * to maintain a single source of truth with zero drift.
 */
export const WORD_STUDIO_BASELINE: ReviewableWordEntry[] = HINT_SUPPORTED_WORDS.map((entry) => ({
  id: entry.id,
  word: entry.word,
  categoryId: entry.categoryId,
  categoryName: entry.categoryName,
  source: 'wordDatabase.ts',
  currentHints: entry.hints || { subtle: [], balanced: [], easy: [] },
  status: 'approved',
  editorial: {
    wordFamiliarity: 'high',
    hintFamiliarity: 'high',
    semanticStrength: 'strong',
    culturalAccessibility: 'global',
    multiImposterFairness: 'balanced',
    recommendation: 'approved',
    notes: 'Curated and verified in unified word database.',
  },
  changeHistory: [
    {
      timestamp: '2026-11-27T00:00:00.000Z',
      action: 'curated',
      details: 'Unified curated word and hint database.',
    },
  ],
}));
