import { Player, PlayerRoleAssignment } from '../types/game';
import { secureShuffle, RandomSource } from './random';

/**
 * Calculates maximum safe number of imposters for a player count.
 * - 3 to 4 players: max 1 imposter
 * - 5 to 7 players: max 2 imposters
 * - 8+ players: max 3 imposters
 */
export function getMaxImposters(playerCount: number): number {
  if (playerCount < 3) return 1;
  return Math.min(3, Math.max(1, Math.floor((playerCount - 1) / 2)));
}

/**
 * Validates and clamps the requested imposter count for current player count.
 */
export function clampImposterCount(playerCount: number, requested: number): number {
  const max = getMaxImposters(playerCount);
  return Math.max(1, Math.min(requested, max));
}

/**
 * Assigns roles by independently shuffling stable player IDs using unbiased
 * rejection-sampled Fisher-Yates. Role assignment is strictly keyed by player ID.
 */
export function assignRoles(
  players: readonly Player[],
  requestedImposterCount: number,
  source?: RandomSource
): Record<string, PlayerRoleAssignment> {
  if (players.length < 3) {
    throw new Error('A minimum of 3 players is required to play.');
  }

  const validCount = clampImposterCount(players.length, requestedImposterCount);
  const stablePlayerIds = players.map(p => p.id);

  // Independently shuffle stable IDs
  const shuffledIds = secureShuffle(stablePlayerIds, source);
  const imposterIds = new Set(shuffledIds.slice(0, validCount));

  const assignments: Record<string, PlayerRoleAssignment> = {};
  for (const player of players) {
    const isImposter = imposterIds.has(player.id);
    assignments[player.id] = {
      playerId: player.id,
      isImposter,
      role: isImposter ? 'Imposter' : 'Civilian',
    };
  }

  return assignments;
}

/**
 * Generates an independent, randomized reveal sequence for pass-and-play.
 * This is completely decoupled from role assignment to eliminate any positional bias.
 */
export function generateRevealOrder(
  playerIds: readonly string[],
  source?: RandomSource
): string[] {
  return secureShuffle(playerIds, source);
}
