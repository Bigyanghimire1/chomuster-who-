import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Search,
  Plus,
  Download,
  CheckCircle2,
  RotateCcw,
  ChevronDown,
  ChevronRight,
  Database,
} from 'lucide-react';
import { useGame } from '../../../context/GameContext';
import { ReviewableWordEntry } from '../../../types/wordStudio';
import { wordStudioService } from '../../../services/wordStudioService';
import { WordCardReviewItem } from './WordCardReviewItem';
import { WordEditorModal } from './WordEditorModal';
import { AddWordModal } from './AddWordModal';
import { ImportExportModal } from './ImportExportModal';
import { Button } from '../../common/Button';
import { Card } from '../../common/Card';
import { Badge } from '../../common/Badge';

export const WordBankStudioView: React.FC = () => {
  const { dispatch } = useGame();

  // Load review state from local storage or baseline
  const [entries, setEntries] = useState<ReviewableWordEntry[]>(() =>
    wordStudioService.loadEntries()
  );

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedRecommendation, setSelectedRecommendation] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'word_asc' | 'word_desc' | 'category' | 'status'>('category');

  // Multi-selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Modal state
  const [editingEntry, setEditingEntry] = useState<ReviewableWordEntry | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportExportModal, setShowImportExportModal] = useState(false);

  // Collapsible categories state
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());

  // Computed stats
  const stats = useMemo(() => wordStudioService.getStats(entries), [entries]);

  // Unique categories list
  const categoriesList = useMemo(() => {
    const map = new Map<string, string>();
    for (const e of entries) {
      if (!e.isDeleted) {
        map.set(e.categoryId, e.categoryName);
      }
    }
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [entries]);

  // Filtered & sorted entries
  const filteredEntries = useMemo(() => {
    let list = entries.filter(e => !e.isDeleted);

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        e =>
          e.word.toLowerCase().includes(q) ||
          e.categoryName.toLowerCase().includes(q) ||
          e.currentHints.subtle.some(h => h.toLowerCase().includes(q)) ||
          e.currentHints.balanced.some(h => h.toLowerCase().includes(q)) ||
          e.currentHints.easy.some(h => h.toLowerCase().includes(q)) ||
          (e.proposedHints && (
            e.proposedHints.subtle.some(h => h.hint.toLowerCase().includes(q)) ||
            e.proposedHints.balanced.some(h => h.hint.toLowerCase().includes(q)) ||
            e.proposedHints.easy.some(h => h.hint.toLowerCase().includes(q))
          ))
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      list = list.filter(e => e.categoryId === selectedCategory);
    }

    // Status filter
    if (selectedStatus !== 'all') {
      list = list.filter(e => e.status === selectedStatus);
    }

    // Recommendation filter
    if (selectedRecommendation !== 'all') {
      list = list.filter(e => e.editorial.recommendation === selectedRecommendation);
    }

    // Sorting
    list.sort((a, b) => {
      if (sortBy === 'word_asc') return a.word.localeCompare(b.word);
      if (sortBy === 'word_desc') return b.word.localeCompare(a.word);
      if (sortBy === 'category') {
        const catCmp = a.categoryName.localeCompare(b.categoryName);
        return catCmp !== 0 ? catCmp : a.word.localeCompare(b.word);
      }
      if (sortBy === 'status') return a.status.localeCompare(b.status);
      return 0;
    });

    return list;
  }, [entries, searchQuery, selectedCategory, selectedStatus, selectedRecommendation, sortBy]);

  // Group by category
  const groupedByCategory = useMemo(() => {
    const map = new Map<string, { categoryId: string; categoryName: string; items: ReviewableWordEntry[] }>();
    for (const e of filteredEntries) {
      if (!map.has(e.categoryId)) {
        map.set(e.categoryId, {
          categoryId: e.categoryId,
          categoryName: e.categoryName,
          items: [],
        });
      }
      map.get(e.categoryId)!.items.push(e);
    }
    return Array.from(map.values());
  }, [filteredEntries]);

  // Actions
  const handleApproveProposed = (id: string) => {
    const updated = wordStudioService.approveEntry(entries, id, 'proposed');
    setEntries(updated);
  };

  const handleApproveOriginal = (id: string) => {
    const updated = wordStudioService.approveEntry(entries, id, 'current');
    setEntries(updated);
  };

  const handleToggleSelect = (id: string) => {
    const copy = new Set(selectedIds);
    if (copy.has(id)) copy.delete(id);
    else copy.add(id);
    setSelectedIds(copy);
  };

  const handleSelectAll = () => {
    if (selectedIds.size === filteredEntries.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredEntries.map(e => e.id)));
    }
  };

  const handleBulkApproveSelected = () => {
    if (selectedIds.size === 0) return;
    const updated = wordStudioService.bulkApprove(entries, Array.from(selectedIds));
    setEntries(updated);
    setSelectedIds(new Set());
  };

  const handleApproveCategory = (catId: string) => {
    const catWords = entries.filter(e => e.categoryId === catId && !e.isDeleted);
    const ids = catWords.map(e => e.id);
    const updated = wordStudioService.bulkApprove(entries, ids);
    setEntries(updated);
  };

  const handleResetBaseline = () => {
    if (
      window.confirm(
        'Reset Word Bank Studio to original baseline? All custom edits and review proposals will be restored to the initial extraction.'
      )
    ) {
      const reset = wordStudioService.resetToBaseline();
      setEntries(reset);
      setSelectedIds(new Set());
    }
  };

  const toggleCategoryCollapse = (catId: string) => {
    const copy = new Set(collapsedCategories);
    if (copy.has(catId)) copy.delete(catId);
    else copy.add(catId);
    setCollapsedCategories(copy);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-5 space-y-5 pb-24 animate-fade-in">
      {/* 1. Header Toolbar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <button
          onClick={() => dispatch({ type: 'SET_PHASE', phase: 'HOME' })}
          className="flex items-center gap-1.5 text-xs text-chomu-muted hover:text-chomu-text transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Exit to Game
        </button>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowImportExportModal(true)}
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            Export / Import
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowAddModal(true)}
            leftIcon={<Plus className="w-3.5 h-3.5 text-chomu-lime" />}
          >
            Add Words
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetBaseline}
            title="Restore default database baseline"
            className="text-xs text-chomu-muted hover:text-chomu-coral"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* 2. Studio Title & Hero Banner */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Database className="w-6 h-6 text-chomu-purple" />
          <h1 className="text-2xl sm:text-3xl font-black text-chomu-text tracking-tight">
            Word Bank Studio
          </h1>
          <Badge variant="purple" size="sm">
            Editorial Workspace
          </Badge>
        </div>
        <p className="text-xs text-chomu-muted max-w-xl">
          Review, curate, and expand the complete word database. Inspect existing hints alongside AI-curated improvements, customize single-word associations, and approve entries for live games.
        </p>
      </div>

      {/* 3. Metrics Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
        <Card className="bg-chomu-surface border-chomu-border p-3 text-center">
          <span className="text-[10px] font-bold text-chomu-muted uppercase tracking-wider block">Total Words</span>
          <span className="text-xl font-black text-chomu-text">{stats.totalWords}</span>
          <span className="text-[10px] text-chomu-muted/80 block">{stats.totalCategories} categories</span>
        </Card>

        <Card className="bg-chomu-surface border-chomu-border p-3 text-center">
          <span className="text-[10px] font-bold text-chomu-purple uppercase tracking-wider block">Fully Hinted</span>
          <span className="text-xl font-black text-chomu-purple">{stats.fullyHintSupported}</span>
          <span className="text-[10px] text-chomu-muted/80 block">9 hints curated</span>
        </Card>

        <Card className="bg-chomu-surface border-chomu-border p-3 text-center">
          <span className="text-[10px] font-bold text-chomu-yellow uppercase tracking-wider block">Awaiting Review</span>
          <span className="text-xl font-black text-chomu-yellow">{stats.awaitingReview}</span>
          <span className="text-[10px] text-chomu-muted/80 block">Pending approval</span>
        </Card>

        <Card className="bg-chomu-surface border-chomu-border p-3 text-center">
          <span className="text-[10px] font-bold text-chomu-lime uppercase tracking-wider block">Approved</span>
          <span className="text-xl font-black text-chomu-lime">{stats.approved}</span>
          <span className="text-[10px] text-chomu-muted/80 block">Vetted words</span>
        </Card>

        <Card className="bg-chomu-surface border-chomu-border p-3 text-center">
          <span className="text-[10px] font-bold text-chomu-coral uppercase tracking-wider block">Duplicates / Flagged</span>
          <span className="text-xl font-black text-chomu-coral">{stats.duplicates + stats.flagged}</span>
          <span className="text-[10px] text-chomu-muted/80 block">Needs attention</span>
        </Card>
      </div>

      {/* 4. Search & Filters Bar */}
      <Card className="bg-chomu-surface border-chomu-border p-3.5 space-y-3">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-chomu-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search words, categories, or specific hints..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-chomu-bg border border-chomu-border rounded-xl pl-9 pr-3.5 py-2 text-xs text-chomu-text placeholder-chomu-muted/60 focus:outline-none focus:border-chomu-purple"
            />
          </div>

          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-chomu-muted hover:text-chomu-text px-2"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter controls row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div>
            <label className="text-[10px] font-bold text-chomu-muted uppercase block mb-1">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full bg-chomu-bg border border-chomu-border rounded-xl px-2.5 py-1.5 text-xs text-chomu-text focus:outline-none focus:border-chomu-purple cursor-pointer"
            >
              <option value="all">All Categories ({stats.totalCategories})</option>
              {categoriesList.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-chomu-muted uppercase block mb-1">
              Review Status
            </label>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="w-full bg-chomu-bg border border-chomu-border rounded-xl px-2.5 py-1.5 text-xs text-chomu-text focus:outline-none focus:border-chomu-purple cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="awaiting_review">Awaiting Review ({stats.awaitingReview})</option>
              <option value="approved">Approved ({stats.approved})</option>
              <option value="needs_improvement">Needs Improvement ({stats.needsImprovement})</option>
              <option value="flagged">Flagged ({stats.flagged})</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-chomu-muted uppercase block mb-1">
              Quality Assessment
            </label>
            <select
              value={selectedRecommendation}
              onChange={e => setSelectedRecommendation(e.target.value)}
              className="w-full bg-chomu-bg border border-chomu-border rounded-xl px-2.5 py-1.5 text-xs text-chomu-text focus:outline-none focus:border-chomu-purple cursor-pointer"
            >
              <option value="all">All Assessments</option>
              <option value="approved">Approved / Clean</option>
              <option value="missing_hints">Missing Hints ({stats.missingHints})</option>
              <option value="duplicate">Cross-Category Duplicate ({stats.duplicates})</option>
              <option value="good_needs_improvement">Good Needs Improvement</option>
              <option value="poor_association">Poor Association</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-chomu-muted uppercase block mb-1">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="w-full bg-chomu-bg border border-chomu-border rounded-xl px-2.5 py-1.5 text-xs text-chomu-text focus:outline-none focus:border-chomu-purple cursor-pointer"
            >
              <option value="category">Category &bull; Word</option>
              <option value="word_asc">Word (A to Z)</option>
              <option value="word_desc">Word (Z to A)</option>
              <option value="status">Review Status</option>
            </select>
          </div>
        </div>

        {/* Batch actions bar when items are selected */}
        <div className="flex items-center justify-between pt-2 border-t border-chomu-border/60 text-xs text-chomu-muted">
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={selectedIds.size > 0 && selectedIds.size === filteredEntries.length}
                onChange={handleSelectAll}
                className="w-4 h-4 rounded text-chomu-purple bg-chomu-bg border-chomu-border cursor-pointer"
              />
              <span className="font-semibold text-chomu-text">
                Select All ({filteredEntries.length} words shown)
              </span>
            </label>

            {selectedIds.size > 0 && (
              <span className="text-chomu-purple font-bold">
                ({selectedIds.size} selected)
              </span>
            )}
          </div>

          {selectedIds.size > 0 && (
            <div className="flex items-center gap-2">
              <Button
                variant="lime"
                size="sm"
                onClick={handleBulkApproveSelected}
                leftIcon={<CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
              >
                Approve Selected ({selectedIds.size})
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* 5. Grouped Category Word List */}
      <div className="space-y-6">
        {groupedByCategory.length === 0 ? (
          <Card className="text-center py-12 text-chomu-muted text-xs bg-chomu-surface">
            No words match your search or filter criteria.
          </Card>
        ) : (
          groupedByCategory.map(group => {
            const isCollapsed = collapsedCategories.has(group.categoryId);
            const approvedInGroup = group.items.filter(i => i.status === 'approved').length;

            return (
              <div key={group.categoryId} className="space-y-3">
                {/* Category Header */}
                <div className="flex items-center justify-between bg-chomu-elevated/70 border border-chomu-border px-4 py-2.5 rounded-2xl">
                  <div
                    onClick={() => toggleCategoryCollapse(group.categoryId)}
                    className="flex items-center gap-2.5 cursor-pointer select-none"
                  >
                    {isCollapsed ? (
                      <ChevronRight className="w-4 h-4 text-chomu-purple" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-chomu-purple" />
                    )}
                    <h2 className="text-sm font-black text-chomu-text uppercase tracking-wider">
                      {group.categoryName}
                    </h2>
                    <span className="text-[11px] font-bold text-chomu-muted bg-chomu-bg px-2 py-0.5 rounded-lg border border-chomu-border">
                      {group.items.length} {group.items.length === 1 ? 'word' : 'words'}
                    </span>
                    {approvedInGroup > 0 && (
                      <span className="text-[10px] font-bold text-chomu-lime bg-chomu-lime/10 px-2 py-0.5 rounded-lg border border-chomu-lime/30">
                        {approvedInGroup} approved
                      </span>
                    )}
                  </div>

                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleApproveCategory(group.categoryId)}
                    className="text-xs"
                    title="Approve all words in this category"
                  >
                    Approve Category
                  </Button>
                </div>

                {/* Words within category */}
                {!isCollapsed && (
                  <div className="space-y-3 pl-1 pr-1">
                    {group.items.map(entry => (
                      <WordCardReviewItem
                        key={entry.id}
                        entry={entry}
                        onEdit={e => setEditingEntry(e)}
                        onApproveProposed={handleApproveProposed}
                        onApproveOriginal={handleApproveOriginal}
                        onToggleStatus={() => {}}
                        isSelected={selectedIds.has(entry.id)}
                        onToggleSelect={handleToggleSelect}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* 6. Modals */}
      {editingEntry && (
        <WordEditorModal
          entry={editingEntry}
          categories={categoriesList}
          onClose={() => setEditingEntry(null)}
          onSave={(updates, details) => {
            const updated = wordStudioService.updateWord(entries, editingEntry.id, updates, details);
            setEntries(updated);
          }}
          onApprove={(mode, word, hints) => {
            const updated = wordStudioService.approveEntry(entries, editingEntry.id, mode, word, hints);
            setEntries(updated);
          }}
          onDelete={id => {
            const updated = wordStudioService.deleteWord(entries, id);
            setEntries(updated);
          }}
        />
      )}

      {showAddModal && (
        <AddWordModal
          categories={categoriesList}
          existingEntries={entries}
          onClose={() => setShowAddModal(false)}
          onAddSingle={(word, catId, catName, hints, notes) => {
            const res = wordStudioService.addWord(entries, word, catId, catName, hints, notes);
            if (res.success) {
              setEntries(res.entries);
              return true;
            } else {
              alert(res.error || 'Failed to add word.');
              return false;
            }
          }}
          onAddBulk={newBatch => {
            let current = [...entries];
            for (const item of newBatch) {
              const res = wordStudioService.addWord(
                current,
                item.word,
                item.categoryId,
                item.categoryName,
                item.hints
              );
              if (res.success) {
                current = res.entries;
              }
            }
            setEntries(current);
          }}
        />
      )}

      {showImportExportModal && (
        <ImportExportModal
          entries={entries}
          onClose={() => setShowImportExportModal(false)}
          onImportCompleted={merged => {
            setEntries(merged);
          }}
        />
      )}
    </div>
  );
};
