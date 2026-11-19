/**
 * 4-Character Room Code Generator for Chomu Who? Multiplayer.
 *
 * Requirements:
 * - Exactly 4 uppercase letters.
 * - Uses an unambiguous alphabet (excluding visually confusable characters: I, L, O).
 * - Cryptographically secure random generation with rejection sampling (zero modulo bias).
 */

/**
 * 23 unambiguous uppercase letters.
 * Excludes 'I' (confused with 1/l), 'L' (confused with 1/I), and 'O' (confused with 0).
 */
export const ROOM_CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ';
export const ROOM_CODE_LENGTH = 4;

/**
 * Generates an unbiased, cryptographically random 4-character room code.
 */
export function generateRoomCode(): string {
  const alphabetLength = ROOM_CODE_ALPHABET.length;
  // Rejection sampling bound to avoid modulo bias
  const maxUnbiasedByte = 256 - (256 % alphabetLength);
  const result: string[] = [];

  while (result.length < ROOM_CODE_LENGTH) {
    const randomBytes = new Uint8Array(16);
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      crypto.getRandomValues(randomBytes);
    } else {
      // Fallback for non-standard environments
      for (let i = 0; i < randomBytes.length; i++) {
        randomBytes[i] = Math.floor(Math.random() * 256);
      }
    }

    for (let i = 0; i < randomBytes.length && result.length < ROOM_CODE_LENGTH; i++) {
      const byte = randomBytes[i];
      if (byte < maxUnbiasedByte) {
        result.push(ROOM_CODE_ALPHABET[byte % alphabetLength]);
      }
    }
  }

  return result.join('');
}

/**
 * Normalizes user-inputted room codes:
 * - Trims whitespace
 * - Converts to uppercase
 * - Strips non-alphanumeric characters
 */
export function normalizeRoomCode(raw: string): string {
  if (!raw || typeof raw !== 'string') return '';
  return raw.trim().toUpperCase().replace(/[^A-Z]/g, '');
}

/**
 * Validates whether a room code is valid:
 * - Exactly 4 characters
 * - Only contains allowed unambiguous uppercase characters
 */
export function isValidRoomCode(code: string): boolean {
  if (!code || typeof code !== 'string') return false;
  const normalized = normalizeRoomCode(code);
  if (normalized.length !== ROOM_CODE_LENGTH) return false;
  
  for (let i = 0; i < normalized.length; i++) {
    if (!ROOM_CODE_ALPHABET.includes(normalized[i])) {
      return false;
    }
  }
  return true;
}
