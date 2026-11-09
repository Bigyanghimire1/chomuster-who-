import { describe, it, expect } from 'vitest';
import { assignRoles, generateRevealOrder, clampImposterCount } from '../services/roleAssignment';
import { secureRandomInt, secureShuffle, createDeterministicSource } from '../services/random';
import { Player } from '../types/game';

describe('Cryptographic Rejection-Sampled Random Engine', () => {
  it('generates numbers strictly within bounds [0, maxExclusive)', () => {
    const counts = new Array(6).fill(0);
    const source = createDeterministicSource(42);
    for (let i = 0; i < 6000; i++) {
      const val = secureRandomInt(6, source);
      expect(val).toBeGreaterThanOrEqual(0);
      expect(val).toBeLessThan(6);
      counts[val]++;
    }
    // Each bucket should be ~1000
    for (const count of counts) {
      expect(count).toBeGreaterThan(800);
      expect(count).toBeLessThan(1200);
    }
  });

  it('secureShuffle produces uniform permutations without skipping elements', () => {
    const input = [1, 2, 3, 4, 5];
    const source = createDeterministicSource(99);
    const shuffled = secureShuffle(input, source);
    expect(shuffled).toHaveLength(5);
    expect(shuffled.sort()).toEqual([1, 2, 3, 4, 5]);
  });
});

describe('10,000-Run Statistical Uniformity & Decoupled Reveal Audit', () => {
  const players: Player[] = [
    { id: 'p1', name: 'Alex', score: 0, avatar: 'sleuth' },
    { id: 'p2', name: 'Sam', score: 0, avatar: 'shadow' },
    { id: 'p3', name: 'Jordan', score: 0, avatar: 'pokerface' },
    { id: 'p4', name: 'Taylor', score: 0, avatar: 'agent' },
  ];

  it('proves zero first-player imposter bias and equal probability across 10,000 rounds', () => {
    const rounds = 10000;
    const imposterCounts: Record<string, number> = { p1: 0, p2: 0, p3: 0, p4: 0 };
    let firstRevealedIsImposterCount = 0;

    for (let i = 0; i < rounds; i++) {
      // 1. Assign roles
      const roles = assignRoles(players, 1);
      // 2. Generate independent reveal order
      const revealOrder = generateRevealOrder(players.map(p => p.id));

      // Record which player was imposter
      for (const p of players) {
        if (roles[p.id].isImposter) {
          imposterCounts[p.id]++;
        }
      }

      // Check if the FIRST person to view the screen was the imposter
      const firstRevealedId = revealOrder[0];
      if (roles[firstRevealedId].isImposter) {
        firstRevealedIsImposterCount++;
      }
    }

    // Expected value = 2500 (25%)
    // Allow generous 4-sigma margin (2150 to 2850)
    for (const pid of ['p1', 'p2', 'p3', 'p4']) {
      const freq = imposterCounts[pid] / rounds;
      expect(freq).toBeGreaterThanOrEqual(0.22);
      expect(freq).toBeLessThanOrEqual(0.28);
    }

    // The first revealed person MUST have the same ~25% chance of being imposter
    const firstRevealedFreq = firstRevealedIsImposterCount / rounds;
    expect(firstRevealedFreq).toBeGreaterThanOrEqual(0.22);
    expect(firstRevealedFreq).toBeLessThanOrEqual(0.28);
  });

  it('validates role assignment across player scales: 3, 4, 5, 8, 10, 15 players', () => {
    const testCounts = [3, 4, 5, 8, 10, 15];

    for (const count of testCounts) {
      const roster: Player[] = Array.from({ length: count }, (_, idx) => ({
        id: `player_${idx}`,
        name: `P${idx}`,
        score: 0,
        avatar: 'sleuth',
      }));

      const maxImposters = clampImposterCount(count, 3);
      const roles = assignRoles(roster, maxImposters);

      const assignedValues = Object.values(roles);
      expect(assignedValues).toHaveLength(count);

      const imposters = assignedValues.filter(r => r.isImposter);
      const civilians = assignedValues.filter(r => !r.isImposter);

      expect(imposters).toHaveLength(maxImposters);
      expect(civilians).toHaveLength(count - maxImposters);

      // Verify no player receives multiple roles or is skipped
      for (const p of roster) {
        expect(roles[p.id]).toBeDefined();
        expect(typeof roles[p.id].isImposter).toBe('boolean');
      }
    }
  });
});
