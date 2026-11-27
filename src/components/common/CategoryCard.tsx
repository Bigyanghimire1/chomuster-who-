import React from 'react';
import { Check } from 'lucide-react';
import { Category } from '../../types/game';
import {
  CategoryIllustration,
  getCategoryVisualMeta,
} from '../illustrations/CategoryIllustrations';

export interface CategoryCardProps {
  category: Category;
  selected: boolean;
  onToggle: (categoryId: string) => void;
  disabled?: boolean;
  compact?: boolean;
}

/**
 * Neo-Brutalist illustrated category card.
 * TOP: Colourful SVG illustration on individual pastel/bright background.
 * BOTTOM: Category name, word count, and consistent Pink/Mint selected indicator.
 */
export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  selected,
  onToggle,
  disabled = false,
  compact = false,
}) => {
  const visual = getCategoryVisualMeta(category.id);

  return (
    <button
      type="button"
      disabled={disabled}
      aria-pressed={selected}
      onClick={() => onToggle(category.id)}
      className={`group w-full text-left rounded-2xl border-[2.5px] border-[#050505] overflow-hidden transition-all duration-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#050505] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFDF00] ${
        selected
          ? 'bg-[#64E987] shadow-[0_5px_0_#050505]'
          : 'bg-white shadow-[0_5px_0_#050505] hover:bg-[#FFF9CC]'
      } ${
        disabled
          ? 'opacity-70 cursor-default'
          : 'cursor-pointer active:translate-y-[3px] active:shadow-[0_2px_0_#050505]'
      }`}
    >
      {/* Top: Illustrated Stage */}
      <div
        className={`relative w-full flex items-center justify-center border-b-[2.5px] border-[#050505] ${
          compact ? 'h-20' : 'h-24 sm:h-28'
        }`}
        style={{ backgroundColor: visual.bg }}
      >
        <CategoryIllustration
          categoryId={category.id}
          className={`${compact ? 'w-14 h-14' : 'w-16 h-16 sm:w-20 sm:h-20'} transition-transform duration-150 group-hover:scale-105`}
        />

        {/* Top-Right Selection Pill */}
        <span
          className={`absolute top-2 right-2 w-7 h-7 rounded-full border-2 border-[#050505] flex items-center justify-center transition-colors ${
            selected
              ? 'bg-[#F28BCB] text-[#050505] shadow-[0_2px_0_#050505]'
              : 'bg-white text-transparent'
          }`}
          aria-hidden="true"
        >
          <Check className="w-4 h-4" strokeWidth={3} />
        </span>
      </div>

      {/* Bottom: Category Name & Word Count */}
      <div className="p-3 sm:p-3.5 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <span className="text-sm font-extrabold text-[#050505] block leading-tight truncate">
            {category.name}
          </span>
          <span className="text-[11px] font-bold text-[#26282E] uppercase tracking-wide block mt-0.5 tabular-nums">
            {category.words.length} words
          </span>
        </div>
      </div>
    </button>
  );
};
