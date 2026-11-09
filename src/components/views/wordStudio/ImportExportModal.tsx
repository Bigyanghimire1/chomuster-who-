import React, { useState } from 'react';
import { X, Download, Upload, Copy, Check, AlertCircle, FileSpreadsheet, Code2 } from 'lucide-react';
import { ReviewableWordEntry } from '../../../types/wordStudio';
import { wordStudioService } from '../../../services/wordStudioService';
import { Button } from '../../common/Button';

interface ImportExportModalProps {
  entries: ReviewableWordEntry[];
  onClose: () => void;
  onImportCompleted: (importedEntries: ReviewableWordEntry[]) => void;
}

export const ImportExportModal: React.FC<ImportExportModalProps> = ({
  entries,
  onClose,
  onImportCompleted,
}) => {
  const [activeTab, setActiveTab] = useState<'export' | 'import'>('export');
  const [exportFormat, setExportFormat] = useState<'csv' | 'json'>('csv');
  const [copied, setCopied] = useState(false);

  // Import state
  const [importText, setImportText] = useState('');
  const [importError, setImportError] = useState<string | null>(null);
  const [previewEntries, setPreviewEntries] = useState<ReviewableWordEntry[] | null>(null);

  const getExportData = () => {
    return exportFormat === 'json'
      ? wordStudioService.exportJson(entries)
      : wordStudioService.exportCsv(entries);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getExportData());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const data = getExportData();
    const mime = exportFormat === 'json' ? 'application/json' : 'text/csv';
    const ext = exportFormat === 'json' ? 'json' : 'csv';
    const blob = new Blob([data], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chomu_who_word_bank_${new Date().toISOString().split('T')[0]}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleParseImport = () => {
    setImportError(null);
    setPreviewEntries(null);

    const text = importText.trim();
    if (!text) {
      setImportError('Please paste JSON or CSV text to import.');
      return;
    }

    try {
      // 1. Try parsing JSON
      if (text.startsWith('[') || text.startsWith('{')) {
        const parsed = JSON.parse(text);
        const list = Array.isArray(parsed) ? parsed : [parsed];
        const validList: ReviewableWordEntry[] = [];

        for (const item of list) {
          if (!item.word || !item.id) continue;
          validList.push({
            id: String(item.id),
            word: String(item.word),
            categoryId: String(item.categoryId || 'everyday_objects'),
            categoryName: String(item.categoryName || 'Everyday Objects'),
            source: 'custom',
            currentHints: {
              subtle: Array.isArray(item.currentHints?.subtle) ? item.currentHints.subtle : [],
              balanced: Array.isArray(item.currentHints?.balanced) ? item.currentHints.balanced : [],
              easy: Array.isArray(item.currentHints?.easy) ? item.currentHints.easy : [],
            },
            status: item.status || 'awaiting_review',
            editorial: item.editorial || {
              wordFamiliarity: 'high',
              hintFamiliarity: 'high',
              semanticStrength: 'strong',
              culturalAccessibility: 'global',
              multiImposterFairness: 'balanced',
              recommendation: 'approved',
              notes: 'Imported from JSON',
            },
            changeHistory: item.changeHistory || [],
          });
        }

        if (validList.length === 0) {
          setImportError('No valid word entries found in JSON.');
          return;
        }

        setPreviewEntries(validList);
        return;
      }

      // 2. Try parsing CSV
      const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
      if (lines.length <= 1) {
        setImportError('CSV must contain a header row and at least one data row.');
        return;
      }

      const parsedCsv: ReviewableWordEntry[] = [];
      // Skip header
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',').map(c => c.replace(/^["']|["']$/g, '').trim());
        if (cols.length < 2) continue;

        const id = cols[0] || `imp_${Date.now()}_${i}`;
        const word = cols[1];
        if (!word) continue;

        const catId = cols[2] || 'everyday_objects';
        const catName = cols[3] || 'Everyday Objects';

        const parsePipes = (val: string) =>
          val ? val.split('|').map(s => s.trim()).filter(Boolean) : [];

        const subtle = cols[7] ? parsePipes(cols[7]) : [];
        const balanced = cols[8] ? parsePipes(cols[8]) : [];
        const easy = cols[9] ? parsePipes(cols[9]) : [];

        parsedCsv.push({
          id,
          word,
          categoryId: catId,
          categoryName: catName,
          source: 'custom',
          currentHints: { subtle, balanced, easy },
          status: 'awaiting_review',
          editorial: {
            wordFamiliarity: 'high',
            hintFamiliarity: 'high',
            semanticStrength: 'strong',
            culturalAccessibility: 'global',
            multiImposterFairness: 'balanced',
            recommendation: 'approved',
            notes: 'Imported from CSV',
          },
          changeHistory: [
            {
              timestamp: new Date().toISOString(),
              action: 'imported',
              details: 'Imported via CSV file.',
            },
          ],
        });
      }

      if (parsedCsv.length === 0) {
        setImportError('Could not parse any valid words from CSV.');
        return;
      }

      setPreviewEntries(parsedCsv);
    } catch (err: unknown) {
      setImportError(`Parse error: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const handleConfirmImport = () => {
    if (!previewEntries) return;

    // Merge without silent replacement: update matching IDs or append new
    const existingMap = new Map(entries.map(e => [e.id, e]));
    for (const p of previewEntries) {
      existingMap.set(p.id, p);
    }

    const merged = Array.from(existingMap.values());
    wordStudioService.saveEntries(merged);
    onImportCompleted(merged);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-chomu-surface border border-chomu-border rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-chomu-border pb-3">
          <div>
            <h2 className="text-xl font-black text-chomu-text">Export &amp; Import Word Bank</h2>
            <p className="text-xs text-chomu-muted">
              Download CSV/JSON for spreadsheet collaboration or load curated collections.
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
        <div className="grid grid-cols-2 gap-2 bg-chomu-bg p-1 rounded-2xl border border-chomu-border">
          <button
            type="button"
            onClick={() => setActiveTab('export')}
            className={`py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'export'
                ? 'bg-chomu-purple text-chomu-bg shadow-md'
                : 'text-chomu-muted hover:text-chomu-text'
            }`}
          >
            <Download className="w-3.5 h-3.5" /> Export Word Bank
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('import')}
            className={`py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'import'
                ? 'bg-chomu-purple text-chomu-bg shadow-md'
                : 'text-chomu-muted hover:text-chomu-text'
            }`}
          >
            <Upload className="w-3.5 h-3.5" /> Import &amp; Validate
          </button>
        </div>

        {/* EXPORT TAB */}
        {activeTab === 'export' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-chomu-muted font-semibold">
                Exporting {entries.filter(e => !e.isDeleted).length} active words
              </span>

              {/* Format pills */}
              <div className="flex items-center gap-1 bg-chomu-bg p-1 rounded-xl border border-chomu-border">
                <button
                  type="button"
                  onClick={() => setExportFormat('csv')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                    exportFormat === 'csv'
                      ? 'bg-chomu-surface text-chomu-purple'
                      : 'text-chomu-muted hover:text-chomu-text'
                  }`}
                >
                  <FileSpreadsheet className="w-3 h-3" /> CSV (Spreadsheet)
                </button>
                <button
                  type="button"
                  onClick={() => setExportFormat('json')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                    exportFormat === 'json'
                      ? 'bg-chomu-surface text-chomu-purple'
                      : 'text-chomu-muted hover:text-chomu-text'
                  }`}
                >
                  <Code2 className="w-3 h-3" /> JSON (Full Schema)
                </button>
              </div>
            </div>

            <textarea
              readOnly
              rows={8}
              value={getExportData()}
              className="w-full bg-chomu-bg border border-chomu-border rounded-xl p-3 text-xs text-chomu-text font-mono focus:outline-none select-all"
            />

            <div className="flex justify-end gap-2 pt-2 border-t border-chomu-border">
              <Button
                variant="secondary"
                size="md"
                onClick={handleCopy}
                leftIcon={copied ? <Check className="w-4 h-4 text-chomu-lime" /> : <Copy className="w-4 h-4" />}
              >
                {copied ? 'Copied to Clipboard!' : 'Copy to Clipboard'}
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={handleDownload}
                leftIcon={<Download className="w-4 h-4" />}
              >
                Download .{exportFormat}
              </Button>
            </div>
          </div>
        )}

        {/* IMPORT TAB */}
        {activeTab === 'import' && (
          <div className="space-y-4">
            <p className="text-xs text-chomu-muted">
              Paste JSON or CSV data below. The tool will parse and display a preview for your verification before applying any updates.
            </p>

            <textarea
              rows={6}
              value={importText}
              onChange={e => setImportText(e.target.value)}
              placeholder="Paste exported CSV or JSON data here..."
              className="w-full bg-chomu-bg border border-chomu-border rounded-xl p-3 text-xs text-chomu-text font-mono focus:outline-none focus:border-chomu-purple"
            />

            {importError && (
              <div className="bg-chomu-coral/15 border border-chomu-coral/30 rounded-xl p-3 flex items-center gap-2 text-xs text-chomu-coral">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{importError}</span>
              </div>
            )}

            {previewEntries && (
              <div className="bg-chomu-bg/80 border border-chomu-purple/40 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-chomu-purple uppercase tracking-wider flex items-center gap-1.5">
                    <Check className="w-4 h-4 stroke-[3]" /> Validation Preview: {previewEntries.length} Words Found
                  </span>
                </div>
                <div className="max-h-36 overflow-y-auto space-y-1 pr-1 text-xs text-chomu-muted">
                  {previewEntries.slice(0, 15).map((e, idx) => (
                    <div key={idx} className="flex items-center justify-between py-0.5 border-b border-chomu-border/40">
                      <span className="font-bold text-chomu-text">{e.word}</span>
                      <span className="text-[10px] text-chomu-muted">{e.categoryName} &bull; {e.currentHints.balanced.length} balanced hints</span>
                    </div>
                  ))}
                  {previewEntries.length > 15 && (
                    <div className="text-[10px] italic text-chomu-muted/60 pt-1">
                      ...and {previewEntries.length - 15} more entries.
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-chomu-border">
              <Button variant="ghost" size="md" onClick={onClose}>
                Cancel
              </Button>
              {!previewEntries ? (
                <Button variant="secondary" size="md" onClick={handleParseImport}>
                  Inspect &amp; Validate Data
                </Button>
              ) : (
                <Button variant="primary" size="md" onClick={handleConfirmImport}>
                  Confirm &amp; Import {previewEntries.length} Words
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
