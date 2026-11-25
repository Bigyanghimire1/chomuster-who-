import React, { useState } from 'react';
import { Plus, Trash2, ArrowLeft, AlertCircle } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { ConfirmModal } from '../common/ConfirmModal';

export const CustomCategoriesView: React.FC = () => {
  const { customCategories, addCustomCategory, deleteCustomCategory, dispatch } = useGame();
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState('');
  const [wordsRaw, setWordsRaw] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<{ id: string; name: string } | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Enter a category name');
      return;
    }

    const words = wordsRaw
      .split(/[,\n]/)
      .map(w => w.trim())
      .filter(w => w.length > 0);

    if (words.length < 4) {
      setError('Add at least 4 words');
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
    <>
      <div
        className="max-w-lg mx-auto w-full px-4 py-6 space-y-5 animate-fade-in"
        style={{ paddingBottom: 'calc(3rem + env(safe-area-inset-bottom, 0px))' }}
      >
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => dispatch({ type: 'SET_PHASE', phase: 'HOME' })}
            className="inline-flex items-center gap-1.5 text-sm text-chomu-secondary hover:text-chomu-text transition-colors min-h-[44px] px-2 -ml-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-chomu-purple rounded-[10px]"
            aria-label="Return to Home"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
            <span>Home</span>
          </button>
          <Badge variant="muted" size="sm">
            <span className="tabular-nums">{customCategories.length}</span>{' '}
            {customCategories.length === 1 ? 'pack' : 'packs'}
          </Badge>
        </div>

        <div>
          <h1 className="text-2xl font-semibold text-chomu-text tracking-[-0.02em]">
            Custom word packs
          </h1>
          <p className="text-sm text-chomu-secondary mt-1">
            Create packs for inside jokes or local party themes
          </p>
        </div>

        {isCreating ? (
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-chomu-text">
                New custom category
              </h2>
              <button
                type="button"
                onClick={() => {
                  setIsCreating(false);
                  setError(null);
                }}
                className="text-xs text-chomu-secondary hover:text-chomu-text min-h-[44px] px-2"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-chomu-secondary block mb-1.5">
                  Category name
                </label>
                <input
                  type="text"
                  placeholder="College Friends, Office Trivia"
                  value={name}
                  maxLength={28}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-chomu-bgSecondary border border-white/[0.1] rounded-[10px] px-3.5 py-2.5 text-sm text-chomu-text placeholder-chomu-muted focus:outline-none focus:border-chomu-purple min-h-[44px]"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-chomu-secondary block mb-1.5">
                  Words (comma or newline separated)
                </label>
                <textarea
                  rows={4}
                  placeholder="Word 1, Word 2, Word 3, Word 4"
                  value={wordsRaw}
                  onChange={e => setWordsRaw(e.target.value)}
                  className="w-full bg-chomu-bgSecondary border border-white/[0.1] rounded-[10px] px-3.5 py-2.5 text-sm text-chomu-text placeholder-chomu-muted focus:outline-none focus:border-chomu-purple"
                />
                <span className="text-xs text-chomu-muted block mt-1">
                  Minimum 4 words required
                </span>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-chomu-coral text-xs bg-chomu-coral/10 p-3 rounded-[10px] border border-chomu-coral/25">
                  <AlertCircle className="w-4 h-4 shrink-0" strokeWidth={1.5} />
                  <span>{error}</span>
                </div>
              )}

              <Button type="submit" variant="primary" size="md" fullWidth>
                Save custom pack
              </Button>
            </form>
          </Card>
        ) : (
          <Button
            variant="secondary"
            size="md"
            fullWidth
            leftIcon={<Plus className="w-4 h-4" strokeWidth={1.5} />}
            onClick={() => setIsCreating(true)}
          >
            Create new category
          </Button>
        )}

        <div className="space-y-2">
          {customCategories.length === 0 ? (
            <div className="text-center py-8 text-chomu-muted text-sm border border-dashed border-white/[0.08] rounded-xl bg-chomu-bgSecondary">
              No custom categories yet
            </div>
          ) : (
            customCategories.map(cat => (
              <Card
                key={cat.id}
                className="p-4 flex items-center justify-between"
              >
                <div>
                  <h3 className="text-sm font-medium text-chomu-text">{cat.name}</h3>
                  <span className="text-xs font-mono text-chomu-muted tabular-nums">
                    {cat.words.length} words
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setPendingDelete({ id: cat.id, name: cat.name })}
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center text-chomu-muted hover:text-chomu-coral rounded-[10px] hover:bg-chomu-elevated transition-colors"
                  title="Delete category"
                  aria-label={`Delete category ${cat.name}`}
                >
                  <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                </button>
              </Card>
            ))
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={pendingDelete !== null}
        title="Delete category"
        description={
          pendingDelete
            ? `Remove "${pendingDelete.name}" from your custom word packs?`
            : ''
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        destructive={true}
        onConfirm={() => {
          if (pendingDelete) {
            deleteCustomCategory(pendingDelete.id);
          }
          setPendingDelete(null);
        }}
        onCancel={() => setPendingDelete(null)}
      />
    </>
  );
};
