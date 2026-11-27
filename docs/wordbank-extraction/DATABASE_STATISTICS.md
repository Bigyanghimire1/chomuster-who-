# Chomu Who? — Database Statistics

## Core Counts
- **Total built-in categories:** 15
- **Total original word entries (client union):** 554
  - From `src/data/wordDatabase.ts` (`HINT_SUPPORTED_WORDS`): 548
  - From `src/data/categories.ts` only (`DEFAULT_CATEGORIES`, no hints): 6
  - Total in `src/data/categories.ts` (`DEFAULT_CATEGORIES`): 525
- **Total unique words (exact spelling):** 548
- **Total unique words (case-insensitive):** 548
- **Total individual hints (`src/data/wordDatabase.ts`):** 4932
  - `subtle`: 1644
  - `balanced`: 1644
  - `easy`: 1644
  - `none`: 0 (no-hint gameplay mode)
- **Entries with complete hints (9 hints each):** 548
- **Entries with missing hints:** 6
- **Static custom word packs in repo:** 0 (custom categories are user-created at runtime in `localStorage`)
- **Duplicate words across categories:** 6 unique words (12 total occurrences)

## Duplicate Occurrences Preserved
- **Skateboarding** (2x): Hobbies & Activities (`hobby_skateboarding`), Sports & Games (`sports_skateboarding`)
- **Archery** (2x): Hobbies & Activities (`hobby_archery`), Sports & Games (`sports_archery`)
- **Surfing** (2x): Hobbies & Activities (`hobby_surfing`), Sports & Games (`sports_surfing`)
- **Billiards** (2x): Hobbies & Activities (`hobby_billiards`), Sports & Games (`sports_billiards`)
- **Bowling** (2x): Hobbies & Activities (`hobbies_bowling`), Sports & Games (`sport_bowling`)
- **Microphone** (2x): Music & Instruments (`mus_microphone`), Technology & Science (`technology_microphone`)

## Incomplete / Eligibility / Secondary Source Notes
- **6 words in `DEFAULT_CATEGORIES` missing from `HINT_SUPPORTED_WORDS`** (only selectable when `hintDifficulty === "none"`):
  - Bowling (`hobbies`, src/data/categories.ts:L134)
  - Surfing (`sports`, src/data/categories.ts:L160)
  - Archery (`sports`, src/data/categories.ts:L165)
  - Billiards (`sports`, src/data/categories.ts:L166)
  - Skateboarding (`sports`, src/data/categories.ts:L166)
  - Microphone (`technology`, src/data/categories.ts:L181)
- **29 words in `HINT_SUPPORTED_WORDS` missing from `DEFAULT_CATEGORIES`** (not selectable when `hintDifficulty === "none"`):
  - Coffee (`food_drinks`, src/data/wordDatabase.ts:L464)
  - Chocolate (`food_drinks`, src/data/wordDatabase.ts:L552)
  - Batman (`movies_tv`, src/data/wordDatabase.ts:L1685)
  - Superman (`movies_tv`, src/data/wordDatabase.ts:L1696)
  - Iron Man (`movies_tv`, src/data/wordDatabase.ts:L1707)
  - Thor (`movies_tv`, src/data/wordDatabase.ts:L1718)
  - Hulk (`movies_tv`, src/data/wordDatabase.ts:L1729)
  - Dragon (`movies_tv`, src/data/wordDatabase.ts:L1740)
  - Unicorn (`movies_tv`, src/data/wordDatabase.ts:L1751)
  - Wizard (`movies_tv`, src/data/wordDatabase.ts:L1762)
  - Vampire (`movies_tv`, src/data/wordDatabase.ts:L1773)
  - Phoenix (`movies_tv`, src/data/wordDatabase.ts:L1784)
  - Mermaid (`movies_tv`, src/data/wordDatabase.ts:L1795)
  - Italy (`geography`, src/data/wordDatabase.ts:L2169)
  - Minecraft (`hobbies`, src/data/wordDatabase.ts:L3247)
  - Pokemon (`hobbies`, src/data/wordDatabase.ts:L3258)
  - Super Mario (`hobbies`, src/data/wordDatabase.ts:L3269)
  - The Legend of Zelda (`hobbies`, src/data/wordDatabase.ts:L3280)
  - Tetris (`hobbies`, src/data/wordDatabase.ts:L3291)
  - Pac-Man (`hobbies`, src/data/wordDatabase.ts:L3302)
  - Guitar (`music`, src/data/wordDatabase.ts:L4479)
  - Piano (`music`, src/data/wordDatabase.ts:L4490)
  - Drums (`music`, src/data/wordDatabase.ts:L4501)
  - Soccer (`sports`, src/data/wordDatabase.ts:L2873)
  - Swimming (`sports`, src/data/wordDatabase.ts:L2906)
  - Bowling (`sports`, src/data/wordDatabase.ts:L2928)
  - Gravity (`technology`, src/data/wordDatabase.ts:L4105)
  - Earthquake (`nature`, src/data/wordDatabase.ts:L3709)
  - Lightning (`nature`, src/data/wordDatabase.ts:L3720)
- **`supabase/functions/_shared/gameLogic.ts` (`BUILTIN_WORD_BANK`):** 120 entries (120 with hint differences vs `wordDatabase.ts`, preserved in `COMPLETE_WORD_DATABASE.json` under `secondarySources.edgeFunctionWordBank`).
- **`src/data/wordStudioBaseline.ts` (`WORD_STUDIO_BASELINE`):** 548 entries (427 `currentHints` differences vs `wordDatabase.ts`).
