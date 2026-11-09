import React, { useState } from 'react';
import { Plus, Trash2, ArrowLeft, AlertCircle, Database, Sparkles } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { Button } from '../common/Button';
import { Card } from '../common/Card';

export const CustomCategoriesView: React.FC = () => {
  const { customCategories, addCustomCategory, deleteCustomCategory, dispatch } = useGame();
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState('');
  const [wordsRaw, setWordsRaw] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Please provide a category name.');
      return;
    }

    const words = wordsRaw
      .split(/[,\n]/)
      .map(w => w.trim())
      .filter(w => w.length > 0);

    if (words.length < 4) {
      setError('Please add at least 4 words.');
      return;
    }

    addCustomCategory({
      name: trimmedName,
      icon: 'everyday_objects',
      description: 'Custom user category pack.',
      words,
    });

    setName('');
    setWordsRaw('');
    setError(null);
    setIsCreating(false);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-5 space-y-5 pb-16 animate-fade-in">
      <div className="flex items-center justify-between">
        <button
          onClick={() => dispatch({ type: 'SET_PHASE', phase: 'HOME' })}
          className="flex items-center gap-1.5 text-xs text-chomu-muted hover:text-chomu-text transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Home
        </button>
        <span className="text-xs font-bold text-chomu-muted px-2.5 py-0.5 rounded-full bg-chomu-surface border border-chomu-border">
          {customCategories.length} Custom {customCategories.length === 1 ? 'Pack' : 'Packs'}
        </span>
      </div>

      <div>
        <h2 className="text-2xl font-black text-chomu-text tracking-tight">
          Custom Word Packs
        </h2>
        <p className="text-xs text-chomu-muted font-medium">
          Create packs for friend groups, party themes, or inside jokes.
        </p>
      </div>

      {/* Entry point to Word Bank Studio */}
      <Card
        onClick={() => dispatch({ type: 'SET_PHASE', phase: 'WORD_STUDIO' })}
        interactive
        className="bg-gradient-to-r from-chomu-surface via-chomu-elevated to-chomu-surface border-chomu-purple/40 p-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-chomu-purple/15 text-chomu-purple flex items-center justify-center shrink-0">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-black text-chomu-text">Word Bank Studio</h3>
                <span className="text-[10px] font-black uppercase text-chomu-purple bg-chomu-purple/10 px-1.5 py-0.5 rounded border border-chomu-purple/20">
                  NEW
                </span>
              </div>
              <p className="text-[11px] text-chomu-muted">
                Explore, review, and curate 548 words with AI hints &amp; exports.
              </p>
            </div>
          </div>
          <Sparkles className="w-4 h-4 text-chomu-purple shrink-0" />
        </div>
      </Card>

      {isCreating ? (
        <Card className="bg-chomu-surface border-chomu-border p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-chomu-text uppercase tracking-wider">
              New Custom Category
            </h3>
            <button
              onClick={() => {
                setIsCreating(false);
                setError(null);
              }}
              className="text-xs text-chomu-muted hover:text-chomu-text"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-3">
            <div>
              <label className="text-[11px] font-bold text-chomu-muted uppercase tracking-wider block mb-1">
                Category Name
              </label>
              <input
                type="text"
                placeholder="e.g., College Friends, Office Trivia..."
                value={name}
                maxLength={28}
                onChange={e => setName(e.target.value)}
                className="w-full bg-chomu-bg border border-chomu-border rounded-xl px-3 py-2 text-xs text-chomu-text placeholder-chomu-muted/50 focus:outline-none focus:border-chomu-purple"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-chomu-muted uppercase tracking-wider block mb-1">
                Words (comma or newline separated)
              </label>
              <textarea
                rows={4}
                placeholder="Word 1, Word 2, Word 3, Word 4..."
                value={wordsRaw}
                onChange={e => setWordsRaw(e.target.value)}
                className="w-full bg-chomu-bg border border-chomu-border rounded-xl px-3 py-2 text-xs text-chomu-text placeholder-chomu-muted/50 focus:outline-none focus:border-chomu-purple"
              />
              <span className="text-[10px] text-chomu-muted block mt-1">
                Minimum 4 words required.
              </span>
            </div>

            {error && (
              <div className="flex items-center gap-1.5 text-chomu-coral text-xs bg-chomu-coral/10 p-2 rounded-xl border border-chomu-coral/20">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button type="submit" variant="primary" size="md" fullWidth>
              Save Custom Pack
            </Button>
          </form>
        </Card>
      ) : (
        <Button
          variant="secondary"
          size="md"
          fullWidth
          leftIcon={<Plus className="w-4 h-4 text-chomu-lime" />}
          onClick={() => setIsCreating(true)}
        >
          Create New Category
        </Button>
      )}

      {/* Category List */}
      <div className="space-y-2">
        {customCategories.length === 0 ? (
          <div className="text-center py-8 text-chomu-muted text-xs">
            No custom categories yet. Tap above to create your first pack!
          </div>
        ) : (
          customCategories.map(cat => (
            <Card
              key={cat.id}
              className="bg-chomu-surface border-chomu-border p-3.5 flex items-center justify-between"
            >
              <div>
                <h4 className="text-sm font-bold text-chomu-text">{cat.name}</h4>
                <span className="text-[11px] text-chomu-muted">
                  {cat.words.length} words
                </span>
              </div>
              <button
                onClick={() => {
                  if (window.confirm(`Delete category "${cat.name}"?`)) {
                    deleteCustomCategory(cat.id);
                  }
                }}
                className="text-chomu-muted hover:text-chomu-coral p-1.5 transition-colors"
                title="Delete category"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
