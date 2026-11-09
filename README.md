# CHOMU WHO? — Party Deduction Game

> **One word. Hidden identities. Zero trust.**  
> *One device. All friends. Every feature unlocked. Maximum fun.*

**CHOMU WHO?** is an exceptionally polished, offline-first, pass-and-play social deduction party game built for friends sitting together around a single phone or tablet.

It features original branding, a vibrant dark-gaming palette, 15 complete categories (500+ curated words), a strict single-word imposter hint engine, procedural Web Audio effects, and a streamlined 5-phase game lifecycle designed specifically for live in-person party play.

---

## 🌟 Key Highlights

- **100% Free & Permanently Unlocked**: Every category, setting, imposter count (1, 2, or 3), and hint tier is completely unlocked out of the box with zero subscriptions, paywalls, or advertisements.
- **Radically Streamlined 5-Phase Party Lifecycle**:
  $$\text{HOME} \longrightarrow \text{SETUP} \longrightarrow \text{ROLE DISTRIBUTION (PASS DEVICE)} \longrightarrow \text{ROUND IN PROGRESS} \longrightarrow \text{FINAL REVEAL}$$
  In-app ballots, voting timers, and clue logs have been eliminated so players engage face-to-face in person. The phone acts strictly as the secret distributor and the final unmasking engine.
- **Strict Single-Word Imposter Hints**: Every imposter receives exactly **one lexical word** (matching `/^[\p{L}\p{N}]+$/u`), never sentences or phrases. Hints are tiered by difficulty (`Subtle` [default], `Balanced`, `Easier`, or `No Hint`).
- **Cryptographic Unbiased Role Engine**: Powered by rejection-sampled Fisher–Yates shuffling using `crypto.getRandomValues()` to guarantee zero first-player bias and equal probability across all player positions.
- **Pointer-Safe Hold-to-Reveal**: Cards require holding down (280ms threshold) and immediately vanish on finger release, window blur, or tab switch.
- **Word Bank Studio & Editorial Review Workspace**: Built-in content management suite to inspect, search, filter, and approve 548 secret words across 15+ categories. Includes side-by-side comparison of current vs. AI-proposed hints, semantic rationales, quality assessments, bulk entry, and CSV/JSON export/import.
- **Custom Word & Category Creator**: Create and save personal word packs (inside jokes, office trivia, family games) directly in local storage.
- **Zero Network Requirement & Offline PWA**: Precached service workers allow full play in flight mode, camping, road trips, or basements.
- **Procedural Web Audio Engine**: Real-time sound synthesis using the browser's native `AudioContext`—instant, crisp sound with no network lag.

---

## 🎨 Color System

| Token | Hex Value | Role |
| :--- | :--- | :--- |
| `bg` | `#101225` | Deep navy background |
| `bgSecondary` | `#171A30` | Secondary background |
| `surface` | `#1D2340` | Card and panel surface |
| `elevated` | `#262E4C` | Elevated interactive surfaces |
| `border` | `#363D5B` | Structural dividers & borders |
| `purple` | `#9275FF` | Primary button fill & brand accent |
| `lime` | `#C5EF75` | Civilian status & positive accents |
| `coral` | `#FF6987` | Imposter badge & danger alerts |
| `cyan` | `#68D9E7` | Highlights & lens reflections |
| `yellow` | `#FFC86D` | Accent badges & secondary tags |
| `text` | `#F6F5FC` | High-contrast primary text |
| `muted` | `#A9ADC5` | Secondary helper text |

---

## 🚀 Quick Start & Local Development

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation
```bash
# Clone or navigate to the project directory
cd imposter

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📱 Running on iOS & Android

### On iPhone / iPad (Safari)
1. Ensure your computer and iPhone are on the same Wi-Fi network.
2. Start the dev server with host enabled: `npm run dev -- --host`.
3. Open Safari on your iPhone and type the network address shown in the terminal (e.g. `http://192.168.1.XX:5173`).
4. Tap the **Share** button (box with an upward arrow) in Safari's bottom toolbar.
5. Scroll down and select **"Add to Home Screen"**.
6. Tap **"Add"**. Launch the app directly from your home screen for full-screen standalone play!

### On Android (Chrome)
1. Open the game address in Chrome.
2. Tap the three-dot menu and select **"Add to Home Screen"** or tap the install prompt.
3. Launch from your home screen.

---

## 🏗️ Production Build & Verification

```bash
# Run TypeScript compilation and Vite production build
npm run build

# Preview production build locally
npm run preview

# Run the automated Vitest test suite
npm test
```

---

## 🎮 How to Play

1. **Setup**: Select 3–15 players, pick 1–3 imposters, choose your categories, and select hint difficulty (`Subtle` is recommended).
2. **Pass Device (Private Role Reveal)**: Pass the phone around secretly. Each player holds down the card to view their role:
   - **Civilians**: See the secret word and category.
   - **Imposters**: Do not see the word, but receive a single-word hint.
   - Releasing the card immediately hides the secret and displays `SEEN ✓`.
   - The final player taps `START ROUND →` once everyone has seen their role.
3. **Round in Progress (In-Person Play)**:
   - Place the device face-up on the table.
   - Players go around the circle giving **one word** or short phrase clue related to the secret word.
   - Civilians give subtle clues to identify each other without revealing the word.
   - Imposters bluff and pretend they know the word.
   - Everyone discusses and debates who is suspicious.
   - On the count of three, everyone points at their suspected chomu!
4. **Final Reveal**:
   - Tap **REVEAL IMPOSTERS** on the device.
   - The app unveils who the real imposter(s) were and what the secret word was!
   - Tap **PLAY AGAIN** to immediately deal a new round with the same roster.

---

## 📚 Editorial Documentation & Word Bank Deliverables

Comprehensive catalogs and editorial assessments are available in the [`docs/`](docs/) directory:
- [`docs/WORD_BANK_COMPLETE_INVENTORY.md`](docs/WORD_BANK_COMPLETE_INVENTORY.md): Full baseline catalog of all 548 words, categories, IDs, and original hints.
- [`docs/WORD_BANK_PROPOSED_IMPROVEMENTS.md`](docs/WORD_BANK_PROPOSED_IMPROVEMENTS.md): Word-by-word proposed single-word hint alternatives with semantic rationales.
- [`docs/WORD_BANK_REVIEW_STATUS.md`](docs/WORD_BANK_REVIEW_STATUS.md): Review status tracker and editorial health audit.
- [`docs/word_bank_inventory.csv`](docs/word_bank_inventory.csv) & [`docs/word_bank_inventory.json`](docs/word_bank_inventory.json): Complete machine-readable datasets for spreadsheet review and data exchange.

---

## 🧪 Automated Testing

Vitest test suites run across all core systems:
- **`wordHints.test.ts`**: Verifies 100+ curated words, strict single-word regex `/^[\p{L}\p{N}]+$/u` validation, distinctness of all 9 hints per word, and distinct hints assigned to up to 3 imposters.
- **`gameEngine.test.ts`**: Verifies the 5-phase party game lifecycle, explicit `START_ROUND` action, decoupled reveal order, category integrity (15 categories, 500+ words), and role clamps.
- **`randomization.test.ts`**: 10,000-round statistical uniformity simulation validating zero first-player bias and equal probability.

---

## 📄 License

MIT. Built with passion for game nights everywhere.
