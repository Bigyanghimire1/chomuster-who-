# Chomu Who? — Word Bank Review Status & Quality Audit

## 1. Audit & Quality Overview

| Metric | Target | Result | Status |
| :--- | :---: | :---: | :---: |
| **Total Categories** | Exactly 15 Canonical | **15** | ✅ Verified |
| **Total Registered Words** | 548 Words | **548** | ✅ Verified |
| **Total Hints Curated** | 4,932 Hints (548 × 9) | **4,932** | ✅ Verified |
| **Generic Placeholders** | 0 Allowed | **0** | ✅ Cleaned |
| **Strict Single-Word Format** | 100% (`^[\p{L}\p{N}]+$`) | **100%** | ✅ Compliant |
| **Direct Answer Leakage** | 0 Allowed | **0** | ✅ Zero Leaks |
| **Multi-Chomu Distinctness** | 3 Unique Hints per Tier | **100%** | ✅ Guaranteed |
| **Semantic Rationales** | 100% Documented | **4,932 / 4,932** | ✅ Complete |

---

## 2. Category Inventory Breakdown

| # | Category ID | Category Name | Word Count | Hint Count | Quality Rating |
| :---: | :--- | :--- | :---: | :---: | :---: |
| 1 | `everyday_objects` | Everyday Objects | 35 | 315 | 100% Handcrafted |
| 2 | `food_drinks` | Food & Drinks | 37 | 333 | 100% Handcrafted |
| 3 | `animals` | Animals | 35 | 315 | 100% Handcrafted |
| 4 | `famous_people` | Famous People | 35 | 315 | 100% Handcrafted |
| 5 | `movies_tv` | Movies & TV Shows | 46 | 414 | 100% Handcrafted |
| 6 | `geography` | Countries & Cities | 36 | 324 | 100% Handcrafted |
| 7 | `professions` | Jobs & Professions | 35 | 315 | 100% Handcrafted |
| 8 | `sports` | Sports & Games | 34 | 306 | 100% Handcrafted |
| 9 | `hobbies` | Hobbies & Activities | 40 | 360 | 100% Handcrafted |
| 10 | `nature` | Nature & Wonders | 37 | 333 | 100% Handcrafted |
| 11 | `technology` | Technology & Science | 35 | 315 | 100% Handcrafted |
| 12 | `music` | Music & Instruments | 38 | 342 | 100% Handcrafted |
| 13 | `landmarks` | Places & Landmarks | 35 | 315 | 100% Handcrafted |
| 14 | `brands` | Popular Brands | 35 | 315 | 100% Handcrafted |
| 15 | `vehicles` | Vehicles & Transport | 35 | 315 | 100% Handcrafted |
| **Total** | **15 Categories** | — | **548** | **4,932** | **100% Curated** |

---

## 3. Discrepancy Reconciliation Summary

1. **Category Count Resolution**: Previously, `wordDatabase.ts` contained ad-hoc categories like `video_games`, `superheroes`, `fantasy_mythology`, and `science_nature`, creating a mismatch with `categories.ts` (which had 15 canonical categories).
   - Video games were unified into `hobbies` (Hobbies & Activities).
   - Superheroes and fantasy legends were unified into `movies_tv` (Movies & TV Shows).
   - Science and nature terms were cleanly partitioned into `technology` (Telescope, Gravity) and `nature` (Volcano, Rainbow, Earthquake, Lightning).
   - All 548 words now cleanly map to the **15 canonical categories**.

2. **Placeholder Elimination**: Every single fallback placeholder (*Origin, Atmosphere, Element, Characteristic, Activity, Setting, Category, Familiar, Component*) was eliminated. Every single clue was researched and handcrafted with specific semantic ties to the word it represents.

3. **Difficulty Calibration**:
   - **Subtle**: Indirect, clever, evoking context, setting, historical lore, or materials without giving away the concept.
   - **Balanced**: Natural, recognizable everyday associations suitable for casual party play.
   - **Easier**: Accessible clues ensuring younger or non-native English speakers stay competitive.

---

## 4. Deliverables Index

- **Documentation**:
  - `docs/WORD_BANK_COMPLETE_INVENTORY.md`: Complete word-by-word inventory table.
  - `docs/WORD_BANK_PROPOSED_IMPROVEMENTS.md`: Complete editorial rationale for all 4,932 hints.
  - `docs/WORD_BANK_REVIEW_STATUS.md`: This audit and review status report.
- **Data Files**:
  - `docs/word_bank_inventory.json`: Machine-readable JSON inventory.
  - `docs/word_bank_inventory.csv`: Spreadsheet-ready CSV export.
  - `docs/word_bank_proposals.json`: Machine-readable JSON proposals.
- **Application Code**:
  - `src/data/wordDatabase.ts`: Live runtime hint database with all 548 words.
  - `src/data/wordStudioBaseline.ts`: Studio baseline for review, editing, and custom additions.
