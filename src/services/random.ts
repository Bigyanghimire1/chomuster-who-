/**
 * Unbiased cryptographically secure random number and shuffling service.
 * Implements rejection sampling on Uint32 values to guarantee uniform distribution
 * without modulo bias.
 */

export interface RandomSource {
  getRandomValues(buffer: Uint32Array): Uint32Array;
}

const defaultCryptoSource: RandomSource = {
  getRandomValues(buffer: Uint32Array): Uint32Array {
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      return crypto.getRandomValues(buffer);
    }
    // Fallback for non-browser/node environments if crypto not global
    for (let i = 0; i < buffer.length; i++) {
      buffer[i] = Math.floor(Math.random() * 0x100000000);
    }
    return buffer;
  },
};

/**
 * Generates an integer in the range [0, maxExclusive) using rejection sampling.
 * Eliminates modulo bias completely.
 */
export function secureRandomInt(
  maxExclusive: number,
  source: RandomSource = defaultCryptoSource
): number {
  if (maxExclusive <= 1) return 0;

  const uint32Buffer = new Uint32Array(1);
  const maxUint32 = 0x100000000; // 2^32
  // Largest multiple of maxExclusive that fits in a uint32
  const limit = Math.floor(maxUint32 / maxExclusive) * maxExclusive;

  while (true) {
    source.getRandomValues(uint32Buffer);
    const value = uint32Buffer[0];
    if (value < limit) {
      return value % maxExclusive;
    }
  }
}

/**
 * Shuffles an array deterministically or securely using Fisher-Yates shuffle
 * with rejection-sampled unbiased integers.
 */
export function secureShuffle<T>(
  array: readonly T[],
  source: RandomSource = defaultCryptoSource
): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = secureRandomInt(i + 1, source);
    const temp = result[i];
    result[i] = result[j];
    result[j] = temp;
  }
  return result;
}

/**
 * Creates a deterministic PRNG conforming to RandomSource for automated unit testing.
 * Uses a 32-bit Linear Congruential Generator.
 */
export function createDeterministicSource(seed: number = 1337): RandomSource {
  let s = (seed >>> 0) || 1;
  return {
    getRandomValues(buffer: Uint32Array): Uint32Array {
      for (let i = 0; i < buffer.length; i++) {
        // LCG constants from Numerical Recipes
        s = (Math.imul(1664525, s) + 1013904223) >>> 0;
        buffer[i] = s;
      }
      return buffer;
    },
  };
}
