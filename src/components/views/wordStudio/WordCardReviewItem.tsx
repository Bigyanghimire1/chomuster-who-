import React, { useState } from 'react';
import {
  Check,
  Edit2,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { ReviewableWordEntry } from '../../../types/wordStudio';
import { Button } from '../../common/Button';
import { Badge } from '../../common/Badge';

interface WordCardReviewItemProps {
  entry: ReviewableWordEntry;
  onEdit: (entry: ReviewableWordEntry) => void;
  onApproveProposed: (id: string) => void;
  onApproveOriginal: (id: string) => void;
  onToggleStatus: (id: string) => void;
  isSelected?: boolean;
  onToggleSelect?: (id: string) => void;
}

export const WordCardReviewItem: React.FC<WordCardReviewItemProps> = ({
  entry,
  onEdit,
  onApproveProposed,
  onApproveOriginal,
  isSelected = false,
  onToggleSelect,
}) => {
  const [showRationales, setShowRationales] = useState(false);

  const isApproved = entry.status === 'approved';
  const hasCurrentHints = entry.currentHints.subtle.length > 0;
  const isDuplicate = entry.editorial.recommendation === 'duplicate';

  const statusVariant = isApproved
    ? 'lime'
    : entry.status === 'flagged' || isDuplicate
    ? 'coral'
    : entry.status === 'needs_improvement'
    ? 'yellow'
    : 'purple';

  return (
    <div
      className={`relative rounded-2xl border transition-all duration-150 p-4 ${
        isApproved
          ? 'bg-chomu-surface/90 border-chomu-lime/40 shadow-sm'
          : isDuplicate
          ? 'bg-chomu-surface/90 border-chomu-coral/50'
          : isSelected
          ? 'bg-chomu-elevated border-chomu-purple shadow-md'
          : 'bg-chomu-surface border-chomu-border hover:border-chomu-border/80'
      }`}
    >
      {/* Top Bar: Word Header & Actions */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          {onToggleSelect && (
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onToggleSelect(entry.id)}
              className="w-4 h-4 rounded text-chomu-purple focus:ring-0 bg-chomu-bg border-chomu-border cursor-pointer"
            />
          )}

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-black text-chomu-text tracking-tight">
                {entry.approvedWord || entry.word}
              </h3>
              <Badge variant={statusVariant} size="sm">
                {isApproved ? 'APPROVED ✓' : entry.status.replace('_', ' ').toUpperCase()}
              </Badge>
              {isDuplicate && (
                <Badge variant="coral" size="sm">
                  DUPLICATE
                </Badge>
              )}
              <span className="text-[11px] font-medium text-chomu-muted">
                {entry.categoryName} &bull; <code className="text-[10px] text-chomu-muted/70">{entry.id}</code>
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          {!isApproved && entry.proposedHints && (
            <Button
              variant="lime"
              size="sm"
              onClick={() => onApproveProposed(entry.id)}
              leftIcon={<Check className="w-3.5 h-3.5 stroke-[3]" />}
              title="Adopt and approve AI proposed hints"
            >
              Approve Proposed
            </Button>
          )}

          {!isApproved && hasCurrentHints && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onApproveOriginal(entry.id)}
              title="Approve existing hints without changes"
            >
              Keep Original
            </Button>
          )}

          <Button
            variant="secondary"
            size="sm"
            onClick={() => onEdit(entry)}
            leftIcon={<Edit2 className="w-3.5 h-3.5" />}
          >
            Edit
          </Button>
        </div>
      </div>

      {/* Side-by-side comparison: CURRENT HINTS vs PROPOSED HINTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-chomu-border/60">
        {/* LEFT COLUMN: CURRENT HINTS */}
        <div className="bg-chomu-bg/60 rounded-xl p-3 border border-chomu-border/40">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-chomu-muted">
              Current Hints {entry.approvedHints ? '(Overridden)' : ''}
            </span>
            <span className="text-[10px] text-chomu-muted/70">
              Source: {entry.source}
            </span>
          </div>

          {hasCurrentHints ? (
            <div className="space-y-1.5 text-xs">
              <div className="flex items-baseline gap-2">
                <span className="text-[10px] font-bold text-chomu-muted w-14 shrink-0">Subtle:</span>
                <span className="font-semibold text-chomu-text">
                  {entry.currentHints.subtle.map((h, idx) => (
                    <span key={idx} className="inline-block bg-chomu-surface px-1.5 py-0.5 rounded mr-1">
                      {h}
                    </span>
                  ))}
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-[10px] font-bold text-chomu-muted w-14 shrink-0">Balanced:</span>
                <span className="font-semibold text-chomu-text">
                  {entry.currentHints.balanced.map((h, idx) => (
                    <span key={idx} className="inline-block bg-chomu-surface px-1.5 py-0.5 rounded mr-1">
                      {h}
                    </span>
                  ))}
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-[10px] font-bold text-chomu-muted w-14 shrink-0">Easier:</span>
                <span className="font-semibold text-chomu-text">
                  {entry.currentHints.easy.map((h, idx) => (
                    <span key={idx} className="inline-block bg-chomu-surface px-1.5 py-0.5 rounded mr-1">
                      {h}
                    </span>
                  ))}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-xs text-chomu-muted/60 italic py-2">
              No hints curated yet (Base category word playable in No-Hint mode).
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: PROPOSED HINTS */}
        <div className="bg-chomu-purple/5 rounded-xl p-3 border border-chomu-purple/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-chomu-purple flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-chomu-purple" /> Proposed Improvements
            </span>
            {entry.proposedHints && (
              <button
                onClick={() => setShowRationales(!showRationales)}
                className="text-[10px] font-semibold text-chomu-purple hover:underline flex items-center gap-0.5"
              >
                {showRationales ? 'Hide Rationales' : 'View Rationales'}
                {showRationales ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            )}
          </div>

          {entry.proposedHints ? (
            <div className="space-y-1.5 text-xs">
              <div className="flex items-baseline gap-2">
                <span className="text-[10px] font-bold text-chomu-purple/80 w-14 shrink-0">Subtle:</span>
                <span className="font-semibold text-chomu-text">
                  {entry.proposedHints.subtle.map((h, idx) => (
                    <span key={idx} className="inline-block bg-chomu-surface/90 border border-chomu-purple/30 px-1.5 py-0.5 rounded mr-1 text-chomu-purple">
                      {h.hint}
                    </span>
                  ))}
                </span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-[10px] font-bold text-chomu-purple/80 w-14 shrink-0">Balanced:</span>
                <span className="font-semibold text-chomu-text">
                  {entry.proposedHints.balanced.map((h, idx) => (
                    <span key={idx} className="inline-block bg-chomu-surface/90 border border-chomu-purple/30 px-1.5 py-0.5 rounded mr-1 text-chomu-purple">
                      {h.hint}
                    </span>
                  ))}
                </span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-[10px] font-bold text-chomu-purple/80 w-14 shrink-0">Easier:</span>
                <span className="font-semibold text-chomu-text">
                  {entry.proposedHints.easy.map((h, idx) => (
                    <span key={idx} className="inline-block bg-chomu-surface/90 border border-chomu-purple/30 px-1.5 py-0.5 rounded mr-1 text-chomu-purple">
                      {h.hint}
                    </span>
                  ))}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-xs text-chomu-muted/60 italic py-2">
              No proposal generated yet. Tap Edit to propose hints.
            </div>
          )}
        </div>
      </div>

      {/* Expanded Rationales Drawer */}
      {showRationales && entry.proposedHints && (
        <div className="mt-3 p-3 rounded-xl bg-chomu-bg/90 border border-chomu-border text-xs space-y-2 animate-fade-in">
          <span className="text-[10px] font-bold uppercase tracking-wider text-chomu-muted block">
            Semantic Rationales for Proposed Hints
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div>
              <span className="text-[10px] font-bold text-chomu-purple block mb-1">Subtle</span>
              <ul className="space-y-1 text-[11px] text-chomu-muted">
                {entry.proposedHints.subtle.map((h, i) => (
                  <li key={i}>
                    <strong className="text-chomu-text">{h.hint}:</strong> {h.rationale}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <span className="text-[10px] font-bold text-chomu-purple block mb-1">Balanced</span>
              <ul className="space-y-1 text-[11px] text-chomu-muted">
                {entry.proposedHints.balanced.map((h, i) => (
                  <li key={i}>
                    <strong className="text-chomu-text">{h.hint}:</strong> {h.rationale}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <span className="text-[10px] font-bold text-chomu-purple block mb-1">Easier</span>
              <ul className="space-y-1 text-[11px] text-chomu-muted">
                {entry.proposedHints.easy.map((h, i) => (
                  <li key={i}>
                    <strong className="text-chomu-text">{h.hint}:</strong> {h.rationale}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Editorial Assessment Badge Bar */}
      <div className="mt-3 pt-2.5 flex items-center justify-between flex-wrap gap-2 text-[11px] text-chomu-muted border-t border-chomu-border/40">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-chomu-muted/80">
            Familiarity: <strong className="text-chomu-text">{entry.editorial.wordFamiliarity}</strong>
          </span>
          <span>&bull;</span>
          <span className="font-semibold text-chomu-muted/80">
            Semantic: <strong className="text-chomu-text">{entry.editorial.semanticStrength}</strong>
          </span>
          <span>&bull;</span>
          <span className="font-semibold text-chomu-muted/80">
            Culture: <strong className="text-chomu-text">{entry.editorial.culturalAccessibility}</strong>
          </span>
          <span>&bull;</span>
          <span className="font-semibold text-chomu-muted/80">
            Fairness: <strong className="text-chomu-text">{entry.editorial.multiImposterFairness}</strong>
          </span>
        </div>

        {entry.editorial.notes && (
          <span className="text-[11px] italic text-chomu-muted/80 max-w-[360px] truncate" title={entry.editorial.notes}>
            &ldquo;{entry.editorial.notes}&rdquo;
          </span>
        )}
      </div>
    </div>
  );
};
