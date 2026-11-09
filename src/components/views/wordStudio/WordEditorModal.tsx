import React, { useState } from 'react';
import { X, Check, Trash2, AlertCircle, Sparkles, History } from 'lucide-react';
import { ReviewableWordEntry, ReviewStatus } from '../../../types/wordStudio';
import { wordStudioService } from '../../../services/wordStudioService';
import { Button } from '../../common/Button';

interface WordEditorModalProps {
  entry: ReviewableWordEntry;
  categories: Array<{ id: string; name: string }>;
  onClose: () => void;
  onSave: (updated: Partial<ReviewableWordEntry>, logDetails: string) => void;
  onApprove: (mode: 'custom', customWord: string, customHints: { subtle: string[]; balanced: string[]; easy: string[] }) => void;
  onDelete: (id: string) => void;
}

export const WordEditorModal: React.FC<WordEditorModalProps> = ({
  entry,
  categories,
  onClose,
  onSave,
  onApprove,
  onDelete,
}) => {
  const [word, setWord] = useState(entry.approvedWord || entry.word);
  const [categoryId, setCategoryId] = useState(entry.categoryId);
  const [status, setStatus] = useState<ReviewStatus>(entry.status);
  const [notes, setNotes] = useState(entry.editorial.notes || '');

  // Hints state
  const initialHints = entry.approvedHints || (entry.currentHints.subtle.length > 0
    ? entry.currentHints
    : entry.proposedHints
    ? {
        subtle: entry.proposedHints.subtle.map(h => h.hint),
        balanced: entry.proposedHints.balanced.map(h => h.hint),
        easy: entry.proposedHints.easy.map(h => h.hint),
      }
    : { subtle: ['', '', ''], balanced: ['', '', ''], easy: ['', '', ''] });

  const [subtle, setSubtle] = useState<string[]>([
    initialHints.subtle[0] || '',
    initialHints.subtle[1] || '',
    initialHints.subtle[2] || '',
  ]);
  const [balanced, setBalanced] = useState<string[]>([
    initialHints.balanced[0] || '',
    initialHints.balanced[1] || '',
    initialHints.balanced[2] || '',
  ]);
  const [easy, setEasy] = useState<string[]>([
    initialHints.easy[0] || '',
    initialHints.easy[1] || '',
    initialHints.easy[2] || '',
  ]);

  const [validationError, setValidationError] = useState<string | null>(null);

  // Validate single words
  const validateHints = () => {
    const all = [...subtle, ...balanced, ...easy];
    for (const h of all) {
      if (h.trim() && !wordStudioService.validateSingleWord(h.trim())) {
        return `Hint "${h}" is invalid. Each hint must be strictly ONE word without spaces, hyphens, or punctuation.`;
      }
    }
    return null;
  };

  const handleAdoptProposed = () => {
    if (!entry.proposedHints) return;
    setSubtle(entry.proposedHints.subtle.map(h => h.hint));
    setBalanced(entry.proposedHints.balanced.map(h => h.hint));
    setEasy(entry.proposedHints.easy.map(h => h.hint));
  };

  const handleSaveDraft = (e: React.FormEvent) => {
    e.preventDefault();
    const error = validateHints();
    if (error) {
      setValidationError(error);
      return;
    }

    const catObj = categories.find(c => c.id === categoryId);
    onSave(
      {
        word: word.trim(),
        categoryId,
        categoryName: catObj ? catObj.name : entry.categoryName,
        status,
        editorial: {
          ...entry.editorial,
          notes: notes.trim(),
        },
        currentHints: {
          subtle: subtle.map(s => s.trim()).filter(Boolean),
          balanced: balanced.map(s => s.trim()).filter(Boolean),
          easy: easy.map(s => s.trim()).filter(Boolean),
        },
      },
      'Saved draft edits in Word Editor'
    );
    onClose();
  };

  const handleSaveAndApprove = () => {
    const error = validateHints();
    if (error) {
      setValidationError(error);
      return;
    }

    const cleanHints = {
      subtle: subtle.map(s => s.trim()),
      balanced: balanced.map(s => s.trim()),
      easy: easy.map(s => s.trim()),
    };

    onApprove('custom', word.trim(), cleanHints);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-chomu-surface border border-chomu-border rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-chomu-border pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-chomu-text">Edit Word Entry</h2>
              <code className="text-xs text-chomu-muted bg-chomu-bg px-2 py-0.5 rounded-lg border border-chomu-border">
                {entry.id}
              </code>
            </div>
            <p className="text-xs text-chomu-muted">
              Review, edit individual hints, or update editorial recommendations.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-chomu-muted hover:text-chomu-text rounded-xl hover:bg-chomu-elevated transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {validationError && (
          <div className="bg-chomu-coral/15 border border-chomu-coral/30 rounded-xl p-3 flex items-center gap-2 text-xs text-chomu-coral">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        <form onSubmit={handleSaveDraft} className="space-y-4">
          {/* Word Name & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-chomu-muted uppercase tracking-wider block mb-1">
                Secret Word
              </label>
              <input
                type="text"
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

          {/* AI Quick Adopt Banner */}
          {entry.proposedHints && (
            <div className="bg-chomu-purple/10 border border-chomu-purple/30 rounded-2xl p-3.5 flex items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-chomu-purple block flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> AI Proposed Hints Available
                </span>
                <span className="text-[11px] text-chomu-muted">
                  Subtle: {entry.proposedHints.subtle.map(h => h.hint).join(', ')} &bull; Balanced: {entry.proposedHints.balanced.map(h => h.hint).join(', ')}
                </span>
              </div>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleAdoptProposed}
                className="shrink-0 text-xs"
              >
                Copy to Editor
              </Button>
            </div>
          )}

          {/* Hint Inputs: Subtle, Balanced, Easy */}
          <div className="space-y-4 pt-2">
            {/* Subtle */}
            <div className="bg-chomu-bg/60 border border-chomu-border/60 rounded-2xl p-3.5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-chomu-text uppercase tracking-wider">
                  Subtle Hints (Indirect Single Words)
                </span>
                <span className="text-[10px] text-chomu-muted">3 distinct words required</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {subtle.map((val, idx) => (
                  <input
                    key={idx}
                    type="text"
                    value={val}
                    placeholder={`Subtle ${idx + 1}`}
                    onChange={e => {
                      const copy = [...subtle];
                      copy[idx] = e.target.value;
                      setSubtle(copy);
                    }}
                    className={`bg-chomu-surface border rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none ${
                      val && !wordStudioService.validateSingleWord(val)
                        ? 'border-chomu-coral text-chomu-coral'
                        : 'border-chomu-border text-chomu-text focus:border-chomu-purple'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Balanced */}
            <div className="bg-chomu-bg/60 border border-chomu-border/60 rounded-2xl p-3.5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-chomu-text uppercase tracking-wider">
                  Balanced Hints (Recommended Default)
                </span>
                <span className="text-[10px] text-chomu-muted">3 distinct words required</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {balanced.map((val, idx) => (
                  <input
                    key={idx}
                    type="text"
                    value={val}
                    placeholder={`Balanced ${idx + 1}`}
                    onChange={e => {
                      const copy = [...balanced];
                      copy[idx] = e.target.value;
                      setBalanced(copy);
                    }}
                    className={`bg-chomu-surface border rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none ${
                      val && !wordStudioService.validateSingleWord(val)
                        ? 'border-chomu-coral text-chomu-coral'
                        : 'border-chomu-border text-chomu-text focus:border-chomu-purple'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Easier */}
            <div className="bg-chomu-bg/60 border border-chomu-border/60 rounded-2xl p-3.5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-chomu-text uppercase tracking-wider">
                  Easier Hints (High Context Single Words)
                </span>
                <span className="text-[10px] text-chomu-muted">3 distinct words required</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {easy.map((val, idx) => (
                  <input
                    key={idx}
                    type="text"
                    value={val}
                    placeholder={`Easier ${idx + 1}`}
                    onChange={e => {
                      const copy = [...easy];
                      copy[idx] = e.target.value;
                      setEasy(copy);
                    }}
                    className={`bg-chomu-surface border rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none ${
                      val && !wordStudioService.validateSingleWord(val)
                        ? 'border-chomu-coral text-chomu-coral'
                        : 'border-chomu-border text-chomu-text focus:border-chomu-purple'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Review Status & Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="text-xs font-bold text-chomu-muted uppercase tracking-wider block mb-1">
                Review Status
              </label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as ReviewStatus)}
                className="w-full bg-chomu-bg border border-chomu-border rounded-xl px-3.5 py-2 text-sm text-chomu-text focus:outline-none focus:border-chomu-purple font-semibold cursor-pointer"
              >
                <option value="awaiting_review">Awaiting Review</option>
                <option value="approved">Approved</option>
                <option value="needs_improvement">Needs Improvement</option>
                <option value="flagged">Flagged / Problematic</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-chomu-muted uppercase tracking-wider block mb-1">
                Editorial Notes
              </label>
              <input
                type="text"
                value={notes}
                placeholder="Rationale or notes for reviewers..."
                onChange={e => setNotes(e.target.value)}
                className="w-full bg-chomu-bg border border-chomu-border rounded-xl px-3.5 py-2 text-sm text-chomu-text focus:outline-none focus:border-chomu-purple"
              />
            </div>
          </div>

          {/* Change History Drawer */}
          {entry.changeHistory && entry.changeHistory.length > 0 && (
            <div className="pt-2 border-t border-chomu-border/60">
              <span className="text-[11px] font-bold text-chomu-muted flex items-center gap-1 mb-1.5">
                <History className="w-3.5 h-3.5" /> Change History ({entry.changeHistory.length})
              </span>
              <div className="bg-chomu-bg/50 rounded-xl p-2.5 max-h-24 overflow-y-auto space-y-1 text-[11px] text-chomu-muted">
                {entry.changeHistory.map((h, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span>{h.details}</span>
                    <span className="text-[10px] text-chomu-muted/60">{new Date(h.timestamp).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Modal Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-chomu-border">
            <button
              type="button"
              onClick={() => {
                if (window.confirm(`Delete word "${entry.word}" from word bank?`)) {
                  onDelete(entry.id);
                  onClose();
                }
              }}
              className="text-xs text-chomu-coral hover:underline font-bold flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> Remove Entry
            </button>

            <div className="flex items-center gap-2">
              <Button type="button" variant="ghost" size="md" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="secondary" size="md">
                Save Draft
              </Button>
              <Button
                type="button"
                variant="lime"
                size="md"
                leftIcon={<Check className="w-4 h-4 stroke-[3]" />}
                onClick={handleSaveAndApprove}
              >
                Approve &amp; Save
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
