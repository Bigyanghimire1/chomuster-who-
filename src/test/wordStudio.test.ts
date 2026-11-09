import { describe, it, expect } from 'vitest';
import { wordStudioService } from '../services/wordStudioService';
import { WORD_STUDIO_BASELINE } from '../data/wordStudioBaseline';
import { ReviewableWordEntry } from '../types/wordStudio';

describe('Word Bank Studio Service & Validation', () => {
  it('loads 548 baseline entries across 15+ categories without silent omissions', () => {
    expect(WORD_STUDIO_BASELINE.length).toBe(548);
    const categories = new Set(WORD_STUDIO_BASELINE.map(e => e.categoryId));
    expect(categories.size).toBeGreaterThanOrEqual(15);
  });

  it('strictly validates single words and rejects multi-word phrases or punctuation', () => {
    expect(wordStudioService.validateSingleWord('Umbrella')).toBe(true);
    expect(wordStudioService.validateSingleWord('Pizza')).toBe(true);
    expect(wordStudioService.validateSingleWord('T-Rex')).toBe(false); // contains hyphen
    expect(wordStudioService.validateSingleWord('Dark clouds')).toBe(false); // contains space
    expect(wordStudioService.validateSingleWord('Hello!')).toBe(false); // contains exclamation mark
    expect(wordStudioService.validateSingleWord('   ')).toBe(false);
  });

  it('accurately computes database statistics', () => {
    const stats = wordStudioService.getStats(WORD_STUDIO_BASELINE);
    expect(stats.totalWords).toBe(548);
    expect(stats.fullyHintSupported).toBe(121);
    expect(stats.awaitingReview).toBeGreaterThanOrEqual(500);
    expect(stats.duplicates).toBe(4);
  });

  it('prevents adding duplicate words and enforces single-word hints', () => {
    const initial = [...WORD_STUDIO_BASELINE];

    // Attempt to add duplicate word
    const dupRes = wordStudioService.addWord(
      initial,
      'Umbrella',
      'everyday_objects',
      'Everyday Objects',
      { subtle: ['Storm', 'Rain', 'Wet'], balanced: ['Brolly', 'Canopy', 'Water'], easy: ['Sky', 'Clouds', 'Fall'] }
    );
    expect(dupRes.success).toBe(false);
    expect(dupRes.error).toContain('already exists');

    // Attempt to add word with multi-word phrase in hint
    const invalidHintRes = wordStudioService.addWord(
      initial,
      'NovelWord123',
      'everyday_objects',
      'Everyday Objects',
      { subtle: ['Invalid Multi Word', 'Rain', 'Wet'], balanced: ['Brolly', 'Canopy', 'Water'], easy: ['Sky', 'Clouds', 'Fall'] }
    );
    expect(invalidHintRes.success).toBe(false);
    expect(invalidHintRes.error).toContain('strictly single words');

    // Successfully add valid word
    const successRes = wordStudioService.addWord(
      initial,
      'MicroscopeNew',
      'technology',
      'Technology & Science',
      { subtle: ['Lens', 'Optics', 'Laboratory'], balanced: ['Specimen', 'Magnify', 'Biology'], easy: ['Cells', 'Slide', 'Science'] }
    );
    expect(successRes.success).toBe(true);
    expect(successRes.entries[0].word).toBe('MicroscopeNew');
  });

  it('approves entries via proposed hints and preserves change history', () => {
    const entries: ReviewableWordEntry[] = [
      {
        id: 'test_obj',
        word: 'Lantern',
        categoryId: 'everyday_objects',
        categoryName: 'Everyday Objects',
        source: 'custom',
        currentHints: { subtle: ['Glow', 'Night', 'Camp'], balanced: ['Fuel', 'Beam', 'Wick'], easy: ['Lamp', 'Fire', 'Light'] },
        proposedHints: {
          subtle: [
            { hint: 'Campfire', rationale: 'Night campsite companion.' },
            { hint: 'Kerosene', rationale: 'Traditional liquid fuel.' },
            { hint: 'Dusk', rationale: 'Time when lanterns are illuminated.' }
          ],
          balanced: [
            { hint: 'Handheld', rationale: 'Carrying modality.' },
            { hint: 'Glass', rationale: 'Protective enclosure around flame.' },
            { hint: 'Mantle', rationale: 'Combustion incandescent mesh.' }
          ],
          easy: [
            { hint: 'Torch', rationale: 'Direct illumination companion.' },
            { hint: 'Illumination', rationale: 'Primary optical purpose.' },
            { hint: 'Flame', rationale: 'Source of interior light.' }
          ]
        },
        status: 'awaiting_review',
        editorial: {
          wordFamiliarity: 'high',
          hintFamiliarity: 'high',
          semanticStrength: 'strong',
          culturalAccessibility: 'global',
          multiImposterFairness: 'balanced',
          recommendation: 'approved',
          notes: 'Test word'
        },
        changeHistory: []
      }
    ];

    const approved = wordStudioService.approveEntry(entries, 'test_obj', 'proposed');
    expect(approved[0].status).toBe('approved');
    expect(approved[0].approvedHints?.subtle).toEqual(['Campfire', 'Kerosene', 'Dusk']);
    expect(approved[0].changeHistory.length).toBe(1);
    expect(approved[0].changeHistory[0].action).toBe('approved');
  });

  it('generates valid JSON and CSV export strings without data corruption', () => {
    const sample = WORD_STUDIO_BASELINE.slice(0, 5);
    const jsonStr = wordStudioService.exportJson(sample);
    const parsed = JSON.parse(jsonStr);
    expect(parsed).toHaveLength(5);
    expect(parsed[0].id).toBe(sample[0].id);

    const csvStr = wordStudioService.exportCsv(sample);
    expect(csvStr).toContain('ID,Word,CategoryID,CategoryName');
    expect(csvStr.split('\n')).toHaveLength(6); // 1 header + 5 rows
  });
});
