import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { DEFAULT_CATEGORIES } from '../../../data/categories';
import { HintDifficulty } from '../../../data/wordDatabase';
import { OnlineSettings } from '../../../types/multiplayer';
import { CategoryCard } from '../../common/CategoryCard';
import { audioService } from '../../../services/audioService';

interface OnlineSettingsFieldsProps {
  settings: OnlineSettings;
  onChange: (next: OnlineSettings) => void;
  disabled?: boolean;
}

export const OnlineSettingsFields: React.FC<OnlineSettingsFieldsProps> = ({
  settings,
  onChange,
  disabled = false,
}) => {
  const turnDurationSeconds = settings.turnDurationSeconds ?? 20;
  const discussionDurationSeconds = settings.discussionDurationSeconds ?? 45;
  const clueRounds = settings.clueRounds ?? 2;

  const handleCategoryToggle = (catId: string) => {
    if (disabled) return;
    const prev = settings.categoryIds || [];
    let next: string[];
    if (prev.includes(catId)) {
      if (prev.length <= 1) return;
      next = prev.filter((id) => id !== catId);
    } else {
      next = [...prev, catId];
    }
    audioService.playCategorySelect();
    onChange({ ...settings, categoryIds: next });
  };

  const handleChomuCount = (count: number) => {
    if (disabled) return;
    audioService.playButtonTap();
    onChange({ ...settings, chomuCount: Math.max(1, Math.min(3, count)) });
  };

  const handleTurnDuration = (sec: number) => {
    if (disabled) return;
    audioService.playButtonTap();
    onChange({ ...settings, turnDurationSeconds: sec });
  };

  const handleDiscussionDuration = (sec: number) => {
    if (disabled) return;
    audioService.playButtonTap();
    onChange({
      ...settings,
      discussionDurationSeconds: sec,
      roundDurationSeconds: sec,
    });
  };

  const handleHintDifficulty = (hintDifficulty: HintDifficulty) => {
    if (disabled) return;
    audioService.playButtonTap();
    onChange({ ...settings, hintDifficulty });
  };

  const handleClueRounds = (count: number) => {
    if (disabled) return;
    audioService.playButtonTap();
    onChange({ ...settings, clueRounds: Math.max(1, Math.min(3, count)) });
  };

  return (
    <div className="space-y-5">
      {/* Categories (2-col illustrated cards) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold uppercase tracking-wide text-[#050505]">
            Categories ({settings.categoryIds.length} selected)
          </span>
          <span className="text-xs font-bold text-[#52555E]">Min 1</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5 max-h-[240px] overflow-y-auto pr-1 pb-1">
          {DEFAULT_CATEGORIES.map((cat) => (
            <CategoryCard
              key={cat.id}
              category={cat}
              compact={true}
              disabled={disabled}
              selected={settings.categoryIds.includes(cat.id)}
              onToggle={handleCategoryToggle}
            />
          ))}
        </div>
      </div>

      {/* Chomu Count Stepper */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-[#F5F6F8] border-2 border-[#050505]">
        <div>
          <span className="text-xs font-extrabold text-[#050505] block">Number of Chomus</span>
          <span className="text-[11px] font-semibold text-[#52555E]">Hidden imposters per round</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={disabled || settings.chomuCount <= 1}
            aria-label="Decrease Chomus"
            onClick={() => handleChomuCount(settings.chomuCount - 1)}
            className="w-10 h-10 rounded-xl bg-white disabled:bg-[#C6C9D1] border-2 border-[#050505] shadow-[0_2px_0_#050505] flex items-center justify-center text-[#050505]"
          >
            <Minus className="w-4 h-4" strokeWidth={2.5} />
          </button>
          <span className="w-8 text-center text-base font-extrabold tabular-nums text-[#050505]">
            {settings.chomuCount}
          </span>
          <button
            type="button"
            disabled={disabled || settings.chomuCount >= 3}
            aria-label="Increase Chomus"
            onClick={() => handleChomuCount(settings.chomuCount + 1)}
            className="w-10 h-10 rounded-xl bg-[#F28BCB] disabled:bg-[#C6C9D1] border-2 border-[#050505] shadow-[0_2px_0_#050505] flex items-center justify-center text-[#050505]"
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Turn Timer & Discussion Timer (uniform Pink selected state) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-extrabold text-[#050505] block mb-1.5">
            Turn timer
          </label>
          <div role="radiogroup" aria-label="Select turn duration" className="grid grid-cols-4 gap-1.5">
            {[
              { label: 'Off', sec: 0 },
              { label: '15s', sec: 15 },
              { label: '20s', sec: 20 },
              { label: '30s', sec: 30 },
            ].map((d) => {
              const isSelected = turnDurationSeconds === d.sec;
              return (
                <button
                  key={d.sec}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  aria-label={`${d.label} turn duration`}
                  disabled={disabled}
                  onClick={() => handleTurnDuration(d.sec)}
                  className={`min-h-[42px] rounded-xl text-xs font-extrabold border-2 border-[#050505] shadow-[0_2px_0_#050505] active:translate-y-[2px] active:shadow-none transition-all ${
                    isSelected
                      ? 'bg-[#F28BCB] text-[#050505]'
                      : 'bg-white text-[#050505] hover:bg-[#FFF9CC]'
                  }`}
                >
                  {d.label}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="text-xs font-extrabold text-[#050505] block mb-1.5">
            Discussion timer
          </label>
          <div role="radiogroup" aria-label="Select discussion duration" className="grid grid-cols-3 gap-1.5">
            {[
              { label: '30s', sec: 30 },
              { label: '45s', sec: 45 },
              { label: '60s', sec: 60 },
            ].map((d) => {
              const isSelected = discussionDurationSeconds === d.sec;
              return (
                <button
                  key={d.sec}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  aria-label={`${d.label} discussion duration`}
                  disabled={disabled}
                  onClick={() => handleDiscussionDuration(d.sec)}
                  className={`min-h-[42px] rounded-xl text-xs font-extrabold border-2 border-[#050505] shadow-[0_2px_0_#050505] active:translate-y-[2px] active:shadow-none transition-all ${
                    isSelected
                      ? 'bg-[#F28BCB] text-[#050505]'
                      : 'bg-white text-[#050505] hover:bg-[#FFF9CC]'
                  }`}
                >
                  {d.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Clue Rounds (uniform Pink selected state) */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-extrabold text-[#050505]">
            Clue rounds
          </label>
          <span className="text-[11px] font-semibold text-[#52555E]">
            Turns per player before discussion
          </span>
        </div>
        <div role="radiogroup" aria-label="Select clue rounds" className="grid grid-cols-3 gap-1.5">
          {[1, 2, 3].map((count) => {
            const isSelected = clueRounds === count;
            return (
              <button
                key={count}
                type="button"
                role="radio"
                aria-checked={isSelected}
                aria-label={`${count} clue ${count === 1 ? 'round' : 'rounds'}`}
                disabled={disabled}
                onClick={() => handleClueRounds(count)}
                className={`min-h-[42px] rounded-xl text-xs font-extrabold border-2 border-[#050505] shadow-[0_2px_0_#050505] active:translate-y-[2px] active:shadow-none transition-all ${
                  isSelected
                    ? 'bg-[#F28BCB] text-[#050505]'
                    : 'bg-white text-[#050505] hover:bg-[#FFF9CC]'
                }`}
              >
                {count} {count === 1 ? 'Round' : 'Rounds'}
              </button>
            );
          })}
        </div>
      </div>

      {/* Hint Difficulty (uniform Pink selected state) */}
      <div>
        <label className="text-xs font-extrabold text-[#050505] block mb-1.5">
          Chomu hint
        </label>
        <div role="radiogroup" aria-label="Select hint difficulty" className="grid grid-cols-4 gap-1.5">
          {(['subtle', 'balanced', 'easy', 'none'] as HintDifficulty[]).map((h) => {
            const isSelected = settings.hintDifficulty === h;
            return (
              <button
                key={h}
                type="button"
                role="radio"
                aria-checked={isSelected}
                aria-label={`${h} hint difficulty`}
                disabled={disabled}
                onClick={() => handleHintDifficulty(h)}
                className={`min-h-[42px] px-2 rounded-xl text-xs font-extrabold border-2 border-[#050505] shadow-[0_2px_0_#050505] capitalize active:translate-y-[2px] active:shadow-none transition-all ${
                  isSelected
                    ? 'bg-[#F28BCB] text-[#050505]'
                    : 'bg-white text-[#050505] hover:bg-[#FFF9CC]'
                }`}
              >
                {h}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
