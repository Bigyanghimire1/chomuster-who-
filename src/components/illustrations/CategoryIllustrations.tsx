import React from 'react';

export interface CategoryVisualMeta {
  bg: string;
  accent: string;
}

export const CATEGORY_VISUAL_META: Record<string, CategoryVisualMeta> = {
  everyday_objects: { bg: '#A9E5F2', accent: '#FFDF00' },
  food_drinks: { bg: '#F28BCB', accent: '#FFDF00' },
  animals: { bg: '#64E987', accent: '#FFDF00' },
  famous_people: { bg: '#B68AF2', accent: '#FFDF00' },
  movies_tv: { bg: '#FFDF00', accent: '#FF5D73' },
  geography: { bg: '#A9E5F2', accent: '#64E987' },
  professions: { bg: '#FFDF00', accent: '#A9E5F2' },
  brands: { bg: '#F28BCB', accent: '#A9E5F2' },
  hobbies: { bg: '#B68AF2', accent: '#64E987' },
  music: { bg: '#FF5D73', accent: '#FFDF00' },
  sports: { bg: '#64E987', accent: '#FFFFFF' },
  technology: { bg: '#A9E5F2', accent: '#B68AF2' },
  nature: { bg: '#64E987', accent: '#F28BCB' },
  vehicles: { bg: '#FF5D73', accent: '#A9E5F2' },
  landmarks: { bg: '#B68AF2', accent: '#FFDF00' },
};

export function getCategoryVisualMeta(categoryId: string): CategoryVisualMeta {
  return CATEGORY_VISUAL_META[categoryId] ?? { bg: '#F28BCB', accent: '#FFDF00' };
}

interface CategoryIllustrationProps {
  categoryId: string;
  className?: string;
}

/**
 * Reusable flat cartoon vector illustrations with thick clean black outlines (#050505)
 * for all 15 built-in categories plus custom categories.
 */
export const CategoryIllustration: React.FC<CategoryIllustrationProps> = ({
  categoryId,
  className = 'w-20 h-20',
}) => {
  switch (categoryId) {
    case 'everyday_objects':
      // Backpack
      return (
        <svg viewBox="0 0 80 80" fill="none" className={className} aria-hidden="true">
          <path d="M28 20 C28 11, 52 11, 52 20" stroke="#050505" strokeWidth="4" strokeLinecap="round" />
          <rect x="20" y="20" width="40" height="48" rx="14" fill="#FF5D73" stroke="#050505" strokeWidth="3.5" />
          <path d="M20 34 C20 26, 60 26, 60 34 L60 40 L20 40 Z" fill="#FFDF00" stroke="#050505" strokeWidth="3.5" />
          <rect x="27" y="45" width="26" height="16" rx="6" fill="#FFFFFF" stroke="#050505" strokeWidth="3" />
          <line x1="34" y1="51" x2="46" y2="51" stroke="#050505" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );

    case 'food_drinks':
      // Sprinkled Donut
      return (
        <svg viewBox="0 0 80 80" fill="none" className={className} aria-hidden="true">
          <circle cx="40" cy="42" r="26" fill="#F4A261" stroke="#050505" strokeWidth="3.5" />
          <path
            d="M16 38 C18 22, 62 22, 64 38 C62 43, 56 41, 53 44 C50 47, 45 43, 40 46 C35 43, 30 47, 27 44 C24 41, 18 43, 16 38 Z"
            fill="#FFDF00"
            stroke="#050505"
            strokeWidth="3"
          />
          <circle cx="40" cy="42" r="9" fill="#F28BCB" stroke="#050505" strokeWidth="3.5" />
          <line x1="27" y1="27" x2="32" y2="25" stroke="#FF5D73" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="48" y1="26" x2="53" y2="29" stroke="#64E987" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="22" y1="35" x2="25" y2="38" stroke="#A9E5F2" strokeWidth="3.5" strokeLinecap="round" />
        </svg>
      );

    case 'animals':
      // Funny Cat
      return (
        <svg viewBox="0 0 80 80" fill="none" className={className} aria-hidden="true">
          <polygon points="20,34 18,14 34,25" fill="#FFDF00" stroke="#050505" strokeWidth="3.5" strokeLinejoin="round" />
          <polygon points="60,34 62,14 46,25" fill="#FFDF00" stroke="#050505" strokeWidth="3.5" strokeLinejoin="round" />
          <ellipse cx="40" cy="45" rx="24" ry="21" fill="#FFFFFF" stroke="#050505" strokeWidth="3.5" />
          <circle cx="31" cy="42" r="4.5" fill="#050505" />
          <circle cx="49" cy="42" r="4.5" fill="#050505" />
          <circle cx="32" cy="40.5" r="1.5" fill="#FFFFFF" />
          <circle cx="50" cy="40.5" r="1.5" fill="#FFFFFF" />
          <polygon points="37,49 43,49 40,53" fill="#F28BCB" stroke="#050505" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M33 56 Q40 60 47 56" stroke="#050505" strokeWidth="3" strokeLinecap="round" />
          <line x1="12" y1="45" x2="22" y2="46" stroke="#050505" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="58" y1="46" x2="68" y2="45" stroke="#050505" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case 'famous_people':
      // Star & Shades
      return (
        <svg viewBox="0 0 80 80" fill="none" className={className} aria-hidden="true">
          <polygon
            points="40,10 48,28 68,30 53,43 57,63 40,53 23,63 27,43 12,30 32,28"
            fill="#FFDF00"
            stroke="#050505"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          <rect x="24" y="34" width="14" height="9" rx="3" fill="#050505" />
          <rect x="42" y="34" width="14" height="9" rx="3" fill="#050505" />
          <line x1="38" y1="38" x2="42" y2="38" stroke="#050505" strokeWidth="3" />
        </svg>
      );

    case 'movies_tv':
      // Clapperboard
      return (
        <svg viewBox="0 0 80 80" fill="none" className={className} aria-hidden="true">
          <rect x="16" y="32" width="48" height="34" rx="6" fill="#FFFFFF" stroke="#050505" strokeWidth="3.5" />
          <path d="M16 32 L64 32 L64 42 L16 42 Z" fill="#050505" />
          <g transform="rotate(-10 16 32)">
            <rect x="16" y="20" width="48" height="11" rx="3" fill="#F28BCB" stroke="#050505" strokeWidth="3.5" />
            <line x1="28" y1="20" x2="24" y2="31" stroke="#050505" strokeWidth="3.5" />
            <line x1="42" y1="20" x2="38" y2="31" stroke="#050505" strokeWidth="3.5" />
            <line x1="56" y1="20" x2="52" y2="31" stroke="#050505" strokeWidth="3.5" />
          </g>
          <polygon points="35,48 48,54 35,60" fill="#FF5D73" stroke="#050505" strokeWidth="2.8" strokeLinejoin="round" />
        </svg>
      );

    case 'geography':
      // Globe
      return (
        <svg viewBox="0 0 80 80" fill="none" className={className} aria-hidden="true">
          <circle cx="40" cy="40" r="24" fill="#64E987" stroke="#050505" strokeWidth="3.5" />
          <path d="M26 24 C32 28, 30 38, 38 40 C44 42, 42 54, 34 60" stroke="#050505" strokeWidth="3" fill="#A9E5F2" />
          <path d="M48 20 C54 26, 58 36, 52 44 C48 48, 54 56, 56 58" stroke="#050505" strokeWidth="3" fill="#A9E5F2" />
          <ellipse cx="40" cy="40" rx="24" ry="9" stroke="#050505" strokeWidth="2.5" />
        </svg>
      );

    case 'professions':
      // Hard Hat
      return (
        <svg viewBox="0 0 80 80" fill="none" className={className} aria-hidden="true">
          <path d="M18 48 C18 26, 62 26, 62 48 Z" fill="#FF5D73" stroke="#050505" strokeWidth="3.5" />
          <rect x="35" y="23" width="10" height="25" rx="4" fill="#FFFFFF" stroke="#050505" strokeWidth="3" />
          <rect x="12" y="47" width="56" height="9" rx="4.5" fill="#050505" />
        </svg>
      );

    case 'brands':
      // Shopping Bag
      return (
        <svg viewBox="0 0 80 80" fill="none" className={className} aria-hidden="true">
          <path d="M30 28 C30 16, 50 16, 50 28" stroke="#050505" strokeWidth="3.5" strokeLinecap="round" />
          <rect x="18" y="28" width="44" height="38" rx="8" fill="#FFFFFF" stroke="#050505" strokeWidth="3.5" />
          <circle cx="40" cy="47" r="9" fill="#FFDF00" stroke="#050505" strokeWidth="3" />
          <path d="M37 47 L39.5 49.5 L44 44.5" stroke="#050505" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case 'hobbies':
      // Paintbrush & Palette
      return (
        <svg viewBox="0 0 80 80" fill="none" className={className} aria-hidden="true">
          <path
            d="M40 16 C22 16, 14 30, 18 46 C21 56, 32 62, 42 58 C46 56, 46 50, 50 48 C56 46, 64 42, 64 32 C64 22, 52 16, 40 16 Z"
            fill="#FFFFFF"
            stroke="#050505"
            strokeWidth="3.5"
          />
          <circle cx="30" cy="30" r="4.5" fill="#FF5D73" stroke="#050505" strokeWidth="2.5" />
          <circle cx="44" cy="26" r="4.5" fill="#FFDF00" stroke="#050505" strokeWidth="2.5" />
          <circle cx="53" cy="36" r="4.5" fill="#64E987" stroke="#050505" strokeWidth="2.5" />
          <circle cx="30" cy="45" r="5" fill="#B68AF2" stroke="#050505" strokeWidth="2.5" />
        </svg>
      );

    case 'music':
      // Electric Guitar / Music Note
      return (
        <svg viewBox="0 0 80 80" fill="none" className={className} aria-hidden="true">
          <path d="M32 52 L32 22 L58 16 L58 46" stroke="#050505" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M32 29 L58 23" stroke="#050505" strokeWidth="3.5" />
          <ellipse cx="25" cy="54" rx="10" ry="8" fill="#FFDF00" stroke="#050505" strokeWidth="3.5" />
          <ellipse cx="51" cy="48" rx="10" ry="8" fill="#64E987" stroke="#050505" strokeWidth="3.5" />
        </svg>
      );

    case 'sports':
      // Football / Soccer Ball
      return (
        <svg viewBox="0 0 80 80" fill="none" className={className} aria-hidden="true">
          <circle cx="40" cy="40" r="24" fill="#FFFFFF" stroke="#050505" strokeWidth="3.5" />
          <polygon points="40,28 50,36 46,48 34,48 30,36" fill="#050505" />
          <line x1="40" y1="28" x2="40" y2="16" stroke="#050505" strokeWidth="3" />
          <line x1="50" y1="36" x2="62" y2="32" stroke="#050505" strokeWidth="3" />
          <line x1="30" y1="36" x2="18" y2="32" stroke="#050505" strokeWidth="3" />
          <line x1="46" y1="48" x2="54" y2="59" stroke="#050505" strokeWidth="3" />
          <line x1="34" y1="48" x2="26" y2="59" stroke="#050505" strokeWidth="3" />
        </svg>
      );

    case 'technology':
      // Friendly Robot
      return (
        <svg viewBox="0 0 80 80" fill="none" className={className} aria-hidden="true">
          <line x1="40" y1="14" x2="40" y2="24" stroke="#050505" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="40" cy="12" r="4.5" fill="#FF5D73" stroke="#050505" strokeWidth="3" />
          <rect x="18" y="24" width="44" height="38" rx="10" fill="#FFFFFF" stroke="#050505" strokeWidth="3.5" />
          <circle cx="31" cy="40" r="5" fill="#64E987" stroke="#050505" strokeWidth="2.8" />
          <circle cx="49" cy="40" r="5" fill="#64E987" stroke="#050505" strokeWidth="2.8" />
          <rect x="29" y="51" width="22" height="5" rx="2.5" fill="#050505" />
        </svg>
      );

    case 'nature':
      // Smiling Flower
      return (
        <svg viewBox="0 0 80 80" fill="none" className={className} aria-hidden="true">
          <line x1="40" y1="44" x2="40" y2="68" stroke="#050505" strokeWidth="4" strokeLinecap="round" />
          <circle cx="40" cy="22" r="9" fill="#FFFFFF" stroke="#050505" strokeWidth="3" />
          <circle cx="53" cy="31" r="9" fill="#FFFFFF" stroke="#050505" strokeWidth="3" />
          <circle cx="48" cy="46" r="9" fill="#FFFFFF" stroke="#050505" strokeWidth="3" />
          <circle cx="32" cy="46" r="9" fill="#FFFFFF" stroke="#050505" strokeWidth="3" />
          <circle cx="27" cy="31" r="9" fill="#FFFFFF" stroke="#050505" strokeWidth="3" />
          <circle cx="40" cy="35" r="11" fill="#FFDF00" stroke="#050505" strokeWidth="3.5" />
          <circle cx="36" cy="33" r="1.8" fill="#050505" />
          <circle cx="44" cy="33" r="1.8" fill="#050505" />
          <path d="M36 38 Q40 41 44 38" stroke="#050505" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );

    case 'vehicles':
      // Colourful Car
      return (
        <svg viewBox="0 0 80 80" fill="none" className={className} aria-hidden="true">
          <path d="M22 40 L29 24 L51 24 L58 40 Z" fill="#A9E5F2" stroke="#050505" strokeWidth="3.5" strokeLinejoin="round" />
          <rect x="13" y="38" width="54" height="18" rx="7" fill="#FFDF00" stroke="#050505" strokeWidth="3.5" />
          <circle cx="26" cy="56" r="7" fill="#050505" />
          <circle cx="26" cy="56" r="2.5" fill="#FFFFFF" />
          <circle cx="54" cy="56" r="7" fill="#050505" />
          <circle cx="54" cy="56" r="2.5" fill="#FFFFFF" />
        </svg>
      );

    case 'landmarks':
      // Eiffel Tower
      return (
        <svg viewBox="0 0 80 80" fill="none" className={className} aria-hidden="true">
          <path
            d="M40 12 L44 34 L56 64 L46 64 C46 56, 34 56, 34 64 L24 64 L36 34 Z"
            fill="#FFFFFF"
            stroke="#050505"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          <line x1="33" y1="42" x2="47" y2="42" stroke="#050505" strokeWidth="3" />
          <line x1="30" y1="52" x2="50" y2="52" stroke="#050505" strokeWidth="3" />
        </svg>
      );

    default:
      // Custom Category Sparkle Deck
      return (
        <svg viewBox="0 0 80 80" fill="none" className={className} aria-hidden="true">
          <rect x="20" y="18" width="40" height="46" rx="9" fill="#FFFFFF" stroke="#050505" strokeWidth="3.5" />
          <polygon
            points="40,28 43.5,37 53,40 43.5,43 40,52 36.5,43 27,40 36.5,37"
            fill="#FFDF00"
            stroke="#050505"
            strokeWidth="3"
            strokeLinejoin="round"
          />
        </svg>
      );
  }
};
