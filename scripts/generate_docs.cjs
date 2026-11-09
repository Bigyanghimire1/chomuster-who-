const fs = require('fs');

const entries = JSON.parse(fs.readFileSync('docs/word_bank_inventory.json', 'utf8'));

// Group entries by category
const byCategory = new Map();
for (const entry of entries) {
  if (!byCategory.has(entry.categoryName)) {
    byCategory.set(entry.categoryName, []);
  }
  byCategory.get(entry.categoryName).push(entry);
}

// Stats
const totalWords = entries.length;
const totalCategories = byCategory.size;
const withHints = entries.filter(e => e.currentHints.subtle.length === 3).length;
const missingHints = entries.filter(e => e.currentHints.subtle.length === 0).length;
const duplicates = entries.filter(e => e.editorial.recommendation === 'duplicate').length;

// 1. Generate docs/WORD_BANK_COMPLETE_INVENTORY.md
let invMd = `# CHOMU WHO? — Complete Word Bank Inventory

> **Official Baseline Catalog of Secret Words, Categories & Imposter Hints**  
> Generated from source files: \`src/data/categories.ts\` and \`src/data/wordDatabase.ts\`.

---

## 📊 Inventory Summary

| Metric | Value | Description |
| :--- | :--- | :--- |
| **Total Categories** | **${totalCategories}** | Distinct category buckets available across the game |
| **Total Registered Words** | **${totalWords}** | Unique words in canonical source files |
| **Fully Hint-Supported Words** | **${withHints}** | 9 strictly validated single-word hints (3 Subtle, 3 Balanced, 3 Easy) |
| **Words Awaiting Hints** | **${missingHints}** | Base category words currently playable in No-Hint / Classic mode |
| **Cross-Category Duplicates** | **${duplicates}** | Words appearing across multiple category lists (e.g. Surfing, Archery) |
| **Subtle Hints Count** | **${withHints * 3}** | Indirect, atmospheric single words |
| **Balanced Hints Count** | **${withHints * 3}** | Meaningful, recognizable single words (Default) |
| **Easier Hints Count** | **${withHints * 3}** | Higher-context single words without revealing target |
| **Total Curated Hints** | **${withHints * 9}** | Total single-word hints stored in database |

### Category Breakdown

| Category | Words | Fully Hint-Supported | Missing Hints | Source File |
| :--- | :---: | :---: | :---: | :--- |
`;

for (const [catName, catEntries] of byCategory.entries()) {
  const supported = catEntries.filter(e => e.currentHints.subtle.length === 3).length;
  const missing = catEntries.filter(e => e.currentHints.subtle.length === 0).length;
  const sources = [...new Set(catEntries.map(e => e.source))].join(', ');
  invMd += `| **${catName}** | ${catEntries.length} | ${supported} | ${missing} | \`${sources}\` |\n`;
}

invMd += `\n---\n\n## 📚 Full Word Inventory by Category\n\n`;

for (const [catName, catEntries] of byCategory.entries()) {
  invMd += `### Category: ${catName.toUpperCase()} (${catEntries.length} words)\n\n`;

  for (let i = 0; i < catEntries.length; i++) {
    const e = catEntries[i];
    const num = String(i + 1).padStart(2, '0');
    invMd += `#### Word ${num} — ${e.word.toUpperCase()}\n`;
    invMd += `- **ID:** \`${e.id}\`\n`;
    invMd += `- **Source:** \`${e.source}\`\n`;
    invMd += `- **Status:** \`${e.status}\`\n`;

    if (e.currentHints.subtle.length > 0) {
      invMd += `- **Current Subtle Hints:** ${e.currentHints.subtle.map(h => `\`${h}\``).join(', ')}\n`;
      invMd += `- **Current Balanced Hints:** ${e.currentHints.balanced.map(h => `\`${h}\``).join(', ')}\n`;
      invMd += `- **Current Easier Hints:** ${e.currentHints.easy.map(h => `\`${h}\``).join(', ')}\n`;
    } else {
      invMd += `- **Current Hints:** *None (Available in No-Hint / Classic Mode)*\n`;
    }

    invMd += `- **Editorial Recommendation:** \`${e.editorial.recommendation}\`\n`;
    invMd += `- **Notes:** ${e.editorial.notes}\n\n`;
  }
}

fs.writeFileSync('docs/WORD_BANK_COMPLETE_INVENTORY.md', invMd, 'utf8');
console.log('Successfully generated docs/WORD_BANK_COMPLETE_INVENTORY.md');

// 2. Generate docs/WORD_BANK_PROPOSED_IMPROVEMENTS.md
let propMd = `# CHOMU WHO? — Word Bank Proposed Improvements

> **AI-Curated Alternative Hints, Semantic Rationales & Quality Assessments**  
> Strictly follows the single-word rule, non-native accessibility, and fairness guidelines.

---

## 🎯 Proposed Hint Guidelines

1. **Strictly One Lexical Word**: Every hint matches \`/^[\\p{L}\\p{N}]+$/u\`.
2. **Accessible**: Simple, common English vocabulary easily understood by non-native speakers.
3. **Semantically Grounded**: Clear and genuine associative connection to the secret word.
4. **Not a Synonym or Direct Answer**: Never gives away the secret word or contains its stem.
5. **Multi-Imposter Distinct**: Up to 3 imposters in any match receive non-repeating hints.

---

## 🔍 Word-by-Word Proposals & Editorial Rationales\n\n`;

for (const [catName, catEntries] of byCategory.entries()) {
  propMd += `## Category: ${catName.toUpperCase()}\n\n`;

  for (const e of catEntries) {
    propMd += `### ${e.word.toUpperCase()} (\`${e.id}\`)\n\n`;
    propMd += `| Tier | Current Hints | Proposed Hints & Rationales |\n`;
    propMd += `| :--- | :--- | :--- |\n`;

    const formatCurrent = (list) => list.length > 0 ? list.map(h => `\`${h}\``).join(', ') : '*None*';

    const formatProposed = (propList) => {
      if (!propList || propList.length === 0) return '*No proposal*';
      return propList.map(item => `**\`${item.hint}\`**: ${item.rationale}`).join('<br>');
    };

    propMd += `| **Subtle** | ${formatCurrent(e.currentHints.subtle)} | ${formatProposed(e.proposedHints?.subtle)} |\n`;
    propMd += `| **Balanced** | ${formatCurrent(e.currentHints.balanced)} | ${formatProposed(e.proposedHints?.balanced)} |\n`;
    propMd += `| **Easier** | ${formatCurrent(e.currentHints.easy)} | ${formatProposed(e.proposedHints?.easy)} |\n\n`;

    propMd += `**Editorial Assessment:**\n`;
    propMd += `- Word Familiarity: \`${e.editorial.wordFamiliarity}\` | Hint Familiarity: \`${e.editorial.hintFamiliarity}\`\n`;
    propMd += `- Semantic Strength: \`${e.editorial.semanticStrength}\` | Cultural Accessibility: \`${e.editorial.culturalAccessibility}\`\n`;
    propMd += `- Recommendation: \`${e.editorial.recommendation}\` — *${e.editorial.notes}*\n\n`;
    propMd += `---\n\n`;
  }
}

fs.writeFileSync('docs/WORD_BANK_PROPOSED_IMPROVEMENTS.md', propMd, 'utf8');
console.log('Successfully generated docs/WORD_BANK_PROPOSED_IMPROVEMENTS.md');

// 3. Generate docs/WORD_BANK_REVIEW_STATUS.md
let statusMd = `# CHOMU WHO? — Word Bank Review Status & Approval Tracker

> **Editorial Workspace Tracking Progress, Approvals & Quality Flags**

---

## 📋 Status Dashboard

- **Total Registered Entries:** ${totalWords}
- **Fully Hint-Supported (Canonical):** ${withHints}
- **Awaiting Hint Curation:** ${missingHints}
- **Flagged Duplicates:** ${duplicates}
- **Approved by Editor:** 0 (Ready for human review in Word Bank Studio)
- **Awaiting Review:** ${totalWords}

---

## 🔍 Editorial Health Audit

### 1. Cross-Category Duplicates (Action: Resolve or Re-assign)
`;

const dupList = entries.filter(e => e.editorial.recommendation === 'duplicate');
if (dupList.length > 0) {
  for (const d of dupList) {
    statusMd += `- **\`${d.word}\`** (in \`${d.categoryName}\`): ${d.editorial.notes}\n`;
  }
} else {
  statusMd += `No duplicates detected.\n`;
}

statusMd += `\n### 2. High Priority Words Awaiting Single-Word Hints
`;

const missingSample = entries.filter(e => e.currentHints.subtle.length === 0).slice(0, 20);
for (const m of missingSample) {
  statusMd += `- **${m.word}** (\`${m.categoryName}\`)\n`;
}
statusMd += `*...and ${missingHints - missingSample.length} more words available in categories.ts.*\n\n`;

statusMd += `---

## 🚀 How to Review and Approve in Word Bank Studio

1. Open the application locally (\`npm run dev\`).
2. Navigate to **Custom Words** or **Word Studio** from the menu.
3. Use the search bar and category filters to inspect any word.
4. Review the **Current Hints** vs **Proposed Hints** side-by-side.
5. Click **Approve** to accept or click **Edit** to customize any single word.
6. Export the final review via JSON or CSV at any time!
`;

fs.writeFileSync('docs/WORD_BANK_REVIEW_STATUS.md', statusMd, 'utf8');
console.log('Successfully generated docs/WORD_BANK_REVIEW_STATUS.md');

// Also write docs/word_bank_proposals.json
fs.writeFileSync('docs/word_bank_proposals.json', JSON.stringify(entries.map(e => ({
  id: e.id,
  word: e.word,
  category: e.categoryName,
  currentHints: e.currentHints,
  proposedHints: e.proposedHints,
  editorial: e.editorial
})), null, 2), 'utf8');
console.log('Successfully generated docs/word_bank_proposals.json');
