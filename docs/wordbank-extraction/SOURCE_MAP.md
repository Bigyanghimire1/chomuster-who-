# Chomu Who? — Word & Hint Source Map

## 1. Primary Runtime Sources
- **`src/data/wordDatabase.ts` (`HINT_SUPPORTED_WORDS`)**
  - Role: Active runtime word + hint bank used by `selectSecretWord()` when `hintDifficulty !== 'none'`.
  - Count: 548 entries, 4932 hints (`subtle`, `balanced`, `easy`).
- **`src/data/categories.ts` (`DEFAULT_CATEGORIES`)**
  - Role: Canonical 15 category definitions (`id`, `name`, `icon`, `description`, `words[]`). Used by `selectSecretWord()` when `hintDifficulty === 'none'`.
  - Count: 15 categories, 525 words (6 not in `HINT_SUPPORTED_WORDS`).
- **`src/services/wordSelector.ts` (`selectSecretWord`)**
  - Role: Runtime selection logic deciding whether `HINT_SUPPORTED_WORDS` or `DEFAULT_CATEGORIES` + `customCategories` are sampled.

## 2. Secondary / Studio / Server-Side Sources
- **`src/data/wordStudioBaseline.ts` (`WORD_STUDIO_BASELINE`)**
  - Role: Word Bank Studio editorial baseline (548 entries with `currentHints`, `proposedHints`, `editorial`, `status`, `changeHistory`).
- **`supabase/functions/_shared/gameLogic.ts` (`BUILTIN_WORD_BANK`)**
  - Role: Server-side Edge Function word bank (120 entries across all 15 categories, exported verbatim under `secondarySources.edgeFunctionWordBank` in `COMPLETE_WORD_DATABASE.json`).

## 3. Runtime User-Created Storage (No Static Repo Entries)
- **`src/services/storageService.ts` + `src/components/views/CustomCategoriesView.tsx`**
  - Keys: `chomu_custom_categories` (legacy: `chomu_custom_categories_v1`). Stores user-created `Category[]` in browser `localStorage`.
- **`src/services/wordStudioService.ts`**
  - Key: `chomu_who_word_studio_state_v1`. Stores local Word Bank Studio edits and JSON/CSV export helpers.
