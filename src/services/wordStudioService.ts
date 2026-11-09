import { WORD_STUDIO_BASELINE } from '../data/wordStudioBaseline';
import {
  ReviewableWordEntry,
  WordStudioStats,
  ReviewStatus,
  RecommendationStatus,
} from '../types/wordStudio';

const STORAGE_KEY = 'chomu_who_word_studio_state_v1';

const SINGLE_WORD_REGEX = /^[\p{L}\p{N}]+$/u;

export const wordStudioService = {
  loadEntries(): ReviewableWordEntry[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    // Return baseline copy
    return JSON.parse(JSON.stringify(WORD_STUDIO_BASELINE));
  },

  saveEntries(entries: ReviewableWordEntry[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch {
      // Ignore quota errors
    }
  },

  getStats(entries: ReviewableWordEntry[]): WordStudioStats {
    const active = entries.filter(e => !e.isDeleted);
    const totalWords = active.length;
    const categoriesSet = new Set(active.map(e => e.categoryId));
    const fullyHintSupported = active.filter(
      e => e.currentHints.subtle.length === 3 || e.approvedHints?.subtle.length === 3
    ).length;
    const awaitingReview = active.filter(e => e.status === 'awaiting_review').length;
    const approved = active.filter(e => e.status === 'approved').length;
    const needsImprovement = active.filter(e => e.status === 'needs_improvement').length;
    const flagged = active.filter(e => e.status === 'flagged').length;
    const newlyProposed = active.filter(e => e.source === 'new_proposed' || e.status === 'proposed').length;
    const missingHints = active.filter(
      e => e.currentHints.subtle.length === 0 && !e.approvedHints
    ).length;
    const duplicates = active.filter(
      e => e.editorial.recommendation === 'duplicate'
    ).length;

    return {
      totalWords,
      totalCategories: categoriesSet.size,
      fullyHintSupported,
      awaitingReview,
      approved,
      needsImprovement,
      flagged,
      newlyProposed,
      missingHints,
      duplicates,
    };
  },

  updateWord(
    entries: ReviewableWordEntry[],
    id: string,
    updates: Partial<ReviewableWordEntry>,
    logDetails: string = 'Updated word information'
  ): ReviewableWordEntry[] {
    const updated = entries.map(entry => {
      if (entry.id !== id) return entry;

      const history = entry.changeHistory || [];
      const newHistory = [
        ...history,
        {
          timestamp: new Date().toISOString(),
          action: 'updated',
          details: logDetails,
        },
      ];

      return {
        ...entry,
        ...updates,
        changeHistory: newHistory,
      };
    });

    this.saveEntries(updated);
    return updated;
  },

  approveEntry(
    entries: ReviewableWordEntry[],
    id: string,
    mode: 'proposed' | 'current' | 'custom',
    customWord?: string,
    customHints?: { subtle: string[]; balanced: string[]; easy: string[] }
  ): ReviewableWordEntry[] {
    const updated = entries.map(entry => {
      if (entry.id !== id) return entry;

      let approvedWord = entry.word;
      let approvedHints = { ...entry.currentHints };

      if (mode === 'proposed' && entry.proposedHints) {
        approvedHints = {
          subtle: entry.proposedHints.subtle.map(h => h.hint),
          balanced: entry.proposedHints.balanced.map(h => h.hint),
          easy: entry.proposedHints.easy.map(h => h.hint),
        };
      } else if (mode === 'custom' && customHints) {
        if (customWord) approvedWord = customWord;
        approvedHints = customHints;
      }

      const history = entry.changeHistory || [];
      return {
        ...entry,
        status: 'approved' as ReviewStatus,
        approvedWord,
        approvedHints,
        approvedAt: new Date().toISOString(),
        editorial: {
          ...entry.editorial,
          recommendation: 'approved' as RecommendationStatus,
        },
        changeHistory: [
          ...history,
          {
            timestamp: new Date().toISOString(),
            action: 'approved',
            details: `Approved via ${mode} hints mode.`,
          },
        ],
      };
    });

    this.saveEntries(updated);
    return updated;
  },

  bulkApprove(entries: ReviewableWordEntry[], ids: string[]): ReviewableWordEntry[] {
    const idSet = new Set(ids);
    const updated = entries.map(entry => {
      if (!idSet.has(entry.id)) return entry;
      // If has proposed hints, adopt them, otherwise keep current
      const hasProposed =
        entry.proposedHints &&
        entry.proposedHints.subtle.length === 3;
      const approvedHints = hasProposed
        ? {
            subtle: entry.proposedHints!.subtle.map(h => h.hint),
            balanced: entry.proposedHints!.balanced.map(h => h.hint),
            easy: entry.proposedHints!.easy.map(h => h.hint),
          }
        : entry.currentHints;

      return {
        ...entry,
        status: 'approved' as ReviewStatus,
        approvedWord: entry.word,
        approvedHints,
        approvedAt: new Date().toISOString(),
        editorial: {
          ...entry.editorial,
          recommendation: 'approved' as RecommendationStatus,
        },
        changeHistory: [
          ...(entry.changeHistory || []),
          {
            timestamp: new Date().toISOString(),
            action: 'bulk_approved',
            details: 'Approved during batch review.',
          },
        ],
      };
    });

    this.saveEntries(updated);
    return updated;
  },

  addWord(
    entries: ReviewableWordEntry[],
    word: string,
    categoryId: string,
    categoryName: string,
    hints: { subtle: string[]; balanced: string[]; easy: string[] },
    notes: string = ''
  ): { success: boolean; error?: string; entries: ReviewableWordEntry[] } {
    const cleanWord = word.trim();
    if (!cleanWord) {
      return { success: false, error: 'Word cannot be empty.', entries };
    }

    // Check duplicate
    const exists = entries.some(
      e => !e.isDeleted && e.word.toLowerCase() === cleanWord.toLowerCase()
    );
    if (exists) {
      return {
        success: false,
        error: `"${cleanWord}" already exists in the word database.`,
        entries,
      };
    }

    // Validate single words
    const allHints = [...hints.subtle, ...hints.balanced, ...hints.easy];
    for (const h of allHints) {
      if (h.trim() && !SINGLE_WORD_REGEX.test(h.trim())) {
        return {
          success: false,
          error: `Hint "${h}" is invalid. Hints must be strictly single words without spaces or punctuation.`,
          entries,
        };
      }
    }

    const id = `new_${Date.now()}_${cleanWord.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;

    const newEntry: ReviewableWordEntry = {
      id,
      word: cleanWord,
      categoryId,
      categoryName,
      source: 'new_proposed',
      currentHints: hints,
      status: 'awaiting_review',
      editorial: {
        wordFamiliarity: 'high',
        hintFamiliarity: 'high',
        semanticStrength: 'strong',
        culturalAccessibility: 'global',
        multiImposterFairness: 'balanced',
        recommendation: 'good_needs_improvement',
        notes: notes || 'Manually added word.',
      },
      changeHistory: [
        {
          timestamp: new Date().toISOString(),
          action: 'created',
          details: 'Manually added to Word Bank Studio.',
        },
      ],
    };

    const updated = [newEntry, ...entries];
    this.saveEntries(updated);
    return { success: true, entries: updated };
  },

  deleteWord(entries: ReviewableWordEntry[], id: string): ReviewableWordEntry[] {
    const updated = entries.map(e => {
      if (e.id === id) {
        return {
          ...e,
          isDeleted: true,
          status: 'flagged' as ReviewStatus,
          changeHistory: [
            ...(e.changeHistory || []),
            {
              timestamp: new Date().toISOString(),
              action: 'deleted',
              details: 'Marked as removed in Word Bank Studio.',
            },
          ],
        };
      }
      return e;
    });

    this.saveEntries(updated);
    return updated;
  },

  resetToBaseline(): ReviewableWordEntry[] {
    const fresh = JSON.parse(JSON.stringify(WORD_STUDIO_BASELINE));
    this.saveEntries(fresh);
    return fresh;
  },

  exportJson(entries: ReviewableWordEntry[]): string {
    const active = entries.filter(e => !e.isDeleted);
    return JSON.stringify(active, null, 2);
  },

  exportCsv(entries: ReviewableWordEntry[]): string {
    const active = entries.filter(e => !e.isDeleted);
    const escapeCsv = (str: string) => `"${String(str || '').replace(/"/g, '""')}"`;

    const headers = [
      'ID',
      'Word',
      'CategoryID',
      'CategoryName',
      'Source',
      'Status',
      'Recommendation',
      'SubtleHints',
      'BalancedHints',
      'EasyHints',
      'ApprovedWord',
      'ApprovedHintsSubtle',
      'ApprovedHintsBalanced',
      'ApprovedHintsEasy',
      'Notes',
    ];

    const rows = active.map(e => [
      escapeCsv(e.id),
      escapeCsv(e.word),
      escapeCsv(e.categoryId),
      escapeCsv(e.categoryName),
      escapeCsv(e.source),
      escapeCsv(e.status),
      escapeCsv(e.editorial.recommendation),
      escapeCsv(e.currentHints.subtle.join(' | ')),
      escapeCsv(e.currentHints.balanced.join(' | ')),
      escapeCsv(e.currentHints.easy.join(' | ')),
      escapeCsv(e.approvedWord || ''),
      escapeCsv(e.approvedHints?.subtle.join(' | ') || ''),
      escapeCsv(e.approvedHints?.balanced.join(' | ') || ''),
      escapeCsv(e.approvedHints?.easy.join(' | ') || ''),
      escapeCsv(e.editorial.notes),
    ]);

    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  },

  validateSingleWord(word: string): boolean {
    return SINGLE_WORD_REGEX.test(word.trim());
  },
};
