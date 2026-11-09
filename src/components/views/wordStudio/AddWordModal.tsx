import React, { useState } from 'react';
import { X, Plus, Sparkles, Layers, Check, AlertCircle } from 'lucide-react';
import { Button } from '../../common/Button';
import { ReviewableWordEntry } from '../../../types/wordStudio';

interface AddWordModalProps {
  categories: Array<{ id: string; name: string }>;
  existingEntries: ReviewableWordEntry[];
  onClose: () => void;
  onAddSingle: (
    word: string,
    categoryId: string,
    categoryName: string,
    hints: { subtle: string[]; balanced: string[]; easy: string[] },
    notes?: string
  ) => boolean;
  onAddBulk: (
    newWords: Array<{
      word: string;
      categoryId: string;
      categoryName: string;
      hints: { subtle: string[]; balanced: string[]; easy: string[] };
    }>
  ) => void;
}

// Pre-curated party suggestions ready for 1-click addition
const AI_SUGGESTION_PACKS = [
  {
    word: 'Popcorn',
    categoryId: 'food_drinks',
    categoryName: 'Food & Drinks',
    hints: {
      subtle: ['Matinee', 'Kernel', 'Cinema'],
      balanced: ['Butter', 'Microwave', 'Crunchy'],
      easy: ['Movie', 'Salty', 'Snack']
    },
    notes: 'Classic cinema snack.'
  },
  {
    word: 'Croissant',
    categoryId: 'food_drinks',
    categoryName: 'Food & Drinks',
    hints: {
      subtle: ['Bakery', 'Morning', 'Flaky'],
      balanced: ['Butter', 'Layers', 'Pastry'],
      easy: ['French', 'Bread', 'Crescent']
    },
    notes: 'French buttery pastry.'
  },
  {
    word: 'Cheetah',
    categoryId: 'animals',
    categoryName: 'Animals',
    hints: {
      subtle: ['Savannah', 'Predator', 'Spots'],
      balanced: ['Feline', 'Fastest', 'Sprint'],
      easy: ['Speed', 'Runner', 'Wildcat']
    },
    notes: 'Fastest land mammal.'
  },
  {
    word: 'Microscope',
    categoryId: 'technology',
    categoryName: 'Technology & Science',
    hints: {
      subtle: ['Specimen', 'Eyepiece', 'Slide'],
      balanced: ['Magnify', 'Laboratory', 'Optics'],
      easy: ['Cells', 'Biology', 'Science']
    },
    notes: 'Laboratory magnification instrument.'
  },
  {
    word: 'Helicopter',
    categoryId: 'vehicles',
    categoryName: 'Vehicles & Transport',
    hints: {
      subtle: ['Helipad', 'Hovering', 'Chopper'],
      balanced: ['Blades', 'Aviation', 'Cockpit'],
      easy: ['Rotors', 'Flying', 'Aircraft']
    },
    notes: 'Rotary-wing aircraft.'
  },
  {
    word: 'Volcano',
    categoryId: 'nature',
    categoryName: 'Nature & Wonders',
    hints: {
      subtle: ['Tectonic', 'Crater', 'Basalt'],
      balanced: ['Magma', 'Eruption', 'Ash'],
      easy: ['Lava', 'Mountain', 'Smoke']
    },
    notes: 'Geological volcanic feature.'
  }
];

export const AddWordModal: React.FC<AddWordModalProps> = ({
  categories,
  existingEntries,
  onClose,
  onAddSingle,
  onAddBulk,
}) => {
  const [activeTab, setActiveTab] = useState<'single' | 'bulk' | 'suggestions'>('single');

  // Single word state
  const [word, setWord] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || 'everyday_objects');
  const [subtle, setSubtle] = useState(['', '', '']);
  const [balanced, setBalanced] = useState(['', '', '']);
  const [easy, setEasy] = useState(['', '', '']);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Bulk state
  const [bulkText, setBulkText] = useState('');
  const [bulkCategory, setBulkCategory] = useState(categories[0]?.id || 'everyday_objects');
  const [bulkReport, setBulkReport] = useState<string | null>(null);

  // Suggestions state
  const [selectedSuggestions, setSelectedSuggestions] = useState<Set<number>>(
    new Set(AI_SUGGESTION_PACKS.map((_, i) => i))
  );

  const handleSingleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanWord = word.trim();
    if (!cleanWord) {
      setError('Please provide a secret word.');
      return;
    }

    const catObj = categories.find(c => c.id === categoryId);
    const catName = catObj ? catObj.name : 'Custom';

    const hints = {
      subtle: subtle.map(s => s.trim()).filter(Boolean),
      balanced: balanced.map(s => s.trim()).filter(Boolean),
      easy: easy.map(s => s.trim()).filter(Boolean),
    };

    const success = onAddSingle(cleanWord, categoryId, catName, hints, notes);
    if (success) {
      onClose();
    }
  };

  const handleBulkProcess = () => {
    setError(null);
    setBulkReport(null);

    if (!bulkText.trim()) {
      setError('Please paste word lines into the bulk editor.');
      return;
    }

    const lines = bulkText.split('\n').map(l => l.trim()).filter(Boolean);
    const parsed: Array<{
      word: string;
      categoryId: string;
      categoryName: string;
      hints: { subtle: string[]; balanced: string[]; easy: string[] };
    }> = [];

    const catObj = categories.find(c => c.id === bulkCategory);
    const catName = catObj ? catObj.name : 'Everyday Objects';

    const existingSet = new Set(existingEntries.map(e => e.word.toLowerCase()));

    let skippedDups = 0;

    for (const line of lines) {
      // Supports formats:
      // Word | Subtle1, Subtle2, Subtle3 | Balanced1, Balanced2, Balanced3 | Easy1, Easy2, Easy3
      // OR simple comma-separated words
      const parts = line.split(/[|;]/).map(p => p.trim());
      const rawWord = parts[0];
      if (!rawWord) continue;

      if (existingSet.has(rawWord.toLowerCase())) {
        skippedDups++;
        continue;
      }

      const parseHintList = (str: string) =>
        str ? str.split(',').map(s => s.trim()).filter(Boolean) : [];

      const subList = parts[1] ? parseHintList(parts[1]) : [];
      const balList = parts[2] ? parseHintList(parts[2]) : [];
      const easyList = parts[3] ? parseHintList(parts[3]) : [];

      parsed.push({
        word: rawWord,
        categoryId: bulkCategory,
        categoryName: catName,
        hints: {
          subtle: subList,
          balanced: balList,
          easy: easyList,
        },
      });

      existingSet.add(rawWord.toLowerCase());
    }

    if (parsed.length === 0) {
      setError(`No valid new words found. (${skippedDups} duplicates skipped)`);
      return;
    }

    onAddBulk(parsed);
    setBulkReport(`Successfully queued ${parsed.length} new words! (${skippedDups} duplicates skipped)`);
    setBulkText('');
    setTimeout(() => onClose(), 1200);
  };

  const handleAddSuggestions = () => {
    const toAdd = AI_SUGGESTION_PACKS.filter((_, idx) => selectedSuggestions.has(idx));
    onAddBulk(toAdd);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-chomu-surface border border-chomu-border rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-chomu-border pb-3">
          <div>
            <h2 className="text-xl font-black text-chomu-text">Add New Words</h2>
            <p className="text-xs text-chomu-muted">
              Expand the game vocabulary manually, in bulk, or with curated suggestions.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-chomu-muted hover:text-chomu-text rounded-xl hover:bg-chomu-elevated transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="grid grid-cols-3 gap-2 bg-chomu-bg p-1 rounded-2xl border border-chomu-border">
          <button
            type="button"
            onClick={() => setActiveTab('single')}
            className={`py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'single'
                ? 'bg-chomu-purple text-chomu-bg shadow-md'
                : 'text-chomu-muted hover:text-chomu-text'
            }`}
          >
            <Plus className="w-3.5 h-3.5" /> Single Word
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('bulk')}
            className={`py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'bulk'
                ? 'bg-chomu-purple text-chomu-bg shadow-md'
                : 'text-chomu-muted hover:text-chomu-text'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> Bulk Entry
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('suggestions')}
            className={`py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'suggestions'
                ? 'bg-chomu-purple text-chomu-bg shadow-md'
                : 'text-chomu-muted hover:text-chomu-text'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> Curated Suggestions
          </button>
        </div>

        {error && (
          <div className="bg-chomu-coral/15 border border-chomu-coral/30 rounded-xl p-3 flex items-center gap-2 text-xs text-chomu-coral">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {bulkReport && (
          <div className="bg-chomu-lime/15 border border-chomu-lime/30 rounded-xl p-3 flex items-center gap-2 text-xs text-chomu-lime font-bold">
            <Check className="w-4 h-4 shrink-0 stroke-[3]" />
            <span>{bulkReport}</span>
          </div>
        )}

        {/* TAB 1: SINGLE WORD ENTRY */}
        {activeTab === 'single' && (
          <form onSubmit={handleSingleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-chomu-muted uppercase tracking-wider block mb-1">
                  Secret Word
                </label>
                <input
                  type="text"
                  placeholder="e.g., Avocado, Astronaut, Telescope..."
                  value={word}
                  onChange={e => setWord(e.target.value)}
                  required
                  className="w-full bg-chomu-bg border border-chomu-border rounded-xl px-3.5 py-2 text-sm text-chomu-text focus:outline-none focus:border-chomu-purple font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-chomu-muted uppercase tracking-wider block mb-1">
                  Category
                </label>
                <select
                  value={categoryId}
                  onChange={e => setCategoryId(e.target.value)}
                  className="w-full bg-chomu-bg border border-chomu-border rounded-xl px-3.5 py-2 text-sm text-chomu-text focus:outline-none focus:border-chomu-purple font-semibold cursor-pointer"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Hint Inputs */}
            <div className="space-y-3 bg-chomu-bg/60 border border-chomu-border/60 rounded-2xl p-4">
              <span className="text-xs font-black text-chomu-text uppercase tracking-wider block">
                Single-Word Imposter Hints (3 distinct per tier)
              </span>

              <div>
                <label className="text-[10px] font-bold text-chomu-purple uppercase block mb-1">
                  Subtle Hints (Indirect)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {subtle.map((s, idx) => (
                    <input
                      key={idx}
                      type="text"
                      placeholder={`Subtle ${idx + 1}`}
                      value={s}
                      onChange={e => {
                        const copy = [...subtle];
                        copy[idx] = e.target.value;
                        setSubtle(copy);
                      }}
                      className="bg-chomu-surface border border-chomu-border rounded-xl px-3 py-1.5 text-xs text-chomu-text focus:border-chomu-purple focus:outline-none"
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-chomu-purple uppercase block mb-1">
                  Balanced Hints (Recommended Default)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {balanced.map((s, idx) => (
                    <input
                      key={idx}
                      type="text"
                      placeholder={`Balanced ${idx + 1}`}
                      value={s}
                      onChange={e => {
                        const copy = [...balanced];
                        copy[idx] = e.target.value;
                        setBalanced(copy);
                      }}
                      className="bg-chomu-surface border border-chomu-border rounded-xl px-3 py-1.5 text-xs text-chomu-text focus:border-chomu-purple focus:outline-none"
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-chomu-purple uppercase block mb-1">
                  Easier Hints (High Context)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {easy.map((s, idx) => (
                    <input
                      key={idx}
                      type="text"
                      placeholder={`Easier ${idx + 1}`}
                      value={s}
                      onChange={e => {
                        const copy = [...easy];
                        copy[idx] = e.target.value;
                        setEasy(copy);
                      }}
                      className="bg-chomu-surface border border-chomu-border rounded-xl px-3 py-1.5 text-xs text-chomu-text focus:border-chomu-purple focus:outline-none"
                    />
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-chomu-muted uppercase tracking-wider block mb-1">
                Editorial Notes
              </label>
              <input
                type="text"
                placeholder="Optional context, pronunciation, or cultural notes..."
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="w-full bg-chomu-bg border border-chomu-border rounded-xl px-3.5 py-2 text-sm text-chomu-text focus:outline-none focus:border-chomu-purple"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-chomu-border">
              <Button type="button" variant="ghost" size="md" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="md" leftIcon={<Plus className="w-4 h-4" />}>
                Add to Word Bank
              </Button>
            </div>
          </form>
        )}

        {/* TAB 2: BULK ENTRY */}
        {activeTab === 'bulk' && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-chomu-muted uppercase tracking-wider block mb-1">
                Target Category for Bulk Batch
              </label>
              <select
                value={bulkCategory}
                onChange={e => setBulkCategory(e.target.value)}
                className="w-full bg-chomu-bg border border-chomu-border rounded-xl px-3.5 py-2 text-sm text-chomu-text focus:outline-none focus:border-chomu-purple font-semibold cursor-pointer"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-chomu-muted uppercase tracking-wider block mb-1">
                Paste Words (One per line)
              </label>
              <textarea
                rows={6}
                value={bulkText}
                onChange={e => setBulkText(e.target.value)}
                placeholder={`Example formatted lines:\nAvocado | Guacamole, Dip, Toast | Green, Seed, Creamy | Fruit, Salad, Healthy\nPancake | Breakfast, Batter, Pan | Fluffy, Maple, Griddle | Syrup, Stack, Butter\nOr simply enter one word per line:`}
                className="w-full bg-chomu-bg border border-chomu-border rounded-xl p-3 text-xs text-chomu-text font-mono focus:outline-none focus:border-chomu-purple"
              />
              <span className="text-[11px] text-chomu-muted block mt-1">
                Format: <code>Word | Subtle1, Subtle2, Subtle3 | Balanced1, Balanced2, Balanced3 | Easy1, Easy2, Easy3</code>
              </span>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-chomu-border">
              <Button type="button" variant="ghost" size="md" onClick={onClose}>
                Cancel
              </Button>
              <Button type="button" variant="primary" size="md" onClick={handleBulkProcess}>
                Process &amp; Add Batch
              </Button>
            </div>
          </div>
        )}

        {/* TAB 3: CURATED AI SUGGESTIONS */}
        {activeTab === 'suggestions' && (
          <div className="space-y-4">
            <p className="text-xs text-chomu-muted">
              Pre-vetted, high-familiarity words with complete 9-hint collections ready for one-click addition:
            </p>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {AI_SUGGESTION_PACKS.map((pack, idx) => {
                const isSelected = selectedSuggestions.has(idx);
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      const copy = new Set(selectedSuggestions);
                      if (copy.has(idx)) copy.delete(idx);
                      else copy.add(idx);
                      setSelectedSuggestions(copy);
                    }}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-chomu-purple/10 border-chomu-purple text-chomu-text'
                        : 'bg-chomu-bg border-chomu-border text-chomu-muted hover:border-chomu-border/80'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-chomu-text">{pack.word}</span>
                        <span className="text-[10px] bg-chomu-surface px-2 py-0.5 rounded text-chomu-muted">
                          {pack.categoryName}
                        </span>
                      </div>
                      <span className="text-[11px] text-chomu-muted block mt-1">
                        Subtle: {pack.hints.subtle.join(', ')} &bull; Balanced: {pack.hints.balanced.join(', ')}
                      </span>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                        isSelected
                          ? 'bg-chomu-purple border-chomu-purple text-chomu-bg'
                          : 'border-chomu-border'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-chomu-border">
              <span className="text-xs text-chomu-muted font-semibold">
                {selectedSuggestions.size} of {AI_SUGGESTION_PACKS.length} selected
              </span>

              <div className="flex gap-2">
                <Button type="button" variant="ghost" size="md" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  disabled={selectedSuggestions.size === 0}
                  onClick={handleAddSuggestions}
                  leftIcon={<Sparkles className="w-4 h-4" />}
                >
                  Add Selected ({selectedSuggestions.size})
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
