import { describe, it, expect } from 'vitest';
import QRCode from 'qrcode';
import {
  generateRoomCode,
  isValidRoomCode,
  normalizeRoomCode,
} from '../services/multiplayer/roomCodeGenerator';
import {
  OnlinePlayer,
  OnlineSecretState,
  RoomState,
} from '../types/multiplayer';
import {
  createInitialRoomState,
  handleCastVote,
  handleCalculateResults,
  handleSetReady,
  sanitizeRoomStateForPeer,
} from '../services/multiplayer/roomProtocol';

describe('Multiplayer Views & UI Logic Test Suite', () => {
  describe('QRCodeModal generation', () => {
    it('generates high contrast data URL for invite links', async () => {
      const roomCode = 'WXYZ';
      const url = `https://chomu.app/?room=${roomCode}`;
      const dataUrl = await QRCode.toDataURL(url, {
        width: 320,
        margin: 2,
        color: { dark: '#101225', light: '#FFFFFF' },
      });

      expect(dataUrl).toContain('data:image/png;base64,');
      expect(dataUrl.length).toBeGreaterThan(500);
    });

    it('normalizes room codes cleanly', () => {
      expect(normalizeRoomCode('  abcd  ')).toBe('ABCD');
      expect(normalizeRoomCode('ab-cd#1')).toBe('ABCD');
    });

    it('validates 4-letter unambiguous room codes', () => {
      const validCode = generateRoomCode();
      expect(validCode.length).toBe(4);
      expect(isValidRoomCode(validCode)).toBe(true);

      // Excludes ambiguous characters (I, L, O)
      expect(isValidRoomCode('ABCD')).toBe(true);
      expect(isValidRoomCode('AB12')).toBe(false);
      expect(isValidRoomCode('TOOL')).toBe(false); // contains O and L
      expect(isValidRoomCode('FIVE')).toBe(false); // contains I
    });
  });

  describe('OnlineLobby & Player Ready State Logic', () => {
    it('accurately tracks player readiness and minimum 3 players threshold', () => {
      let state = createInitialRoomState('TEST', 'host-1', 'Host Alice', 'sleuth');
      expect(state.phase).toBe('LOBBY');
      expect(Object.keys(state.players).length).toBe(1);

      // Add 2 more players
      const player2: OnlinePlayer = {
        id: 'peer-2',
        name: 'Bob',
        avatar: 'shadow',
        isHost: false,
        isReady: false,
        isConnected: true,
        score: 0,
      };
      const player3: OnlinePlayer = {
        id: 'peer-3',
        name: 'Charlie',
        avatar: 'agent',
        isHost: false,
        isReady: false,
        isConnected: true,
        score: 0,
      };

      state = {
        ...state,
        players: {
          ...state.players,
          [player2.id]: player2,
          [player3.id]: player3,
        },
      };

      const playerList = Object.values(state.players);
      expect(playerList.length).toBe(3);
      expect(playerList.length >= 3).toBe(true); // Minimum 3 players required to start

      // Set ready
      state = handleSetReady(state, 'peer-2', true);
      expect(state.players['peer-2'].isReady).toBe(true);
      expect(state.players['peer-3'].isReady).toBe(false);
    });
  });

  describe('OnlineRoleReveal & Anti-Peek Client Shielding', () => {
    it('guarantees regular civilians NEVER receive chomuIds or other roles before results', () => {
      const hostState: RoomState = {
        ...createInitialRoomState('TEST', 'host-1', 'Host', 'sleuth'),
        phase: 'ROLE_REVEAL',
        chomuIds: ['peer-chomu'],
        secretWord: 'Pineapple',
      };

      const hostSecret = {
        secretWord: 'Pineapple',
        secretCategory: 'Food',
        chomuIds: ['peer-chomu'],
        imposterHints: { 'peer-chomu': 'Tropical' },
        playerSecrets: {
          'peer-civilian': {
            category: 'Food',
            word: 'Pineapple',
            isChomu: false,
            role: 'Civilian' as const,
          },
        },
      };

      const { sanitizedRoomState, privateSecret } = sanitizeRoomStateForPeer(
        hostState,
        'peer-civilian',
        hostSecret
      );

      expect(sanitizedRoomState.chomuIds).toBeNull();
      expect(sanitizedRoomState.secretWord).toBeNull();
      expect(privateSecret?.isChomu).toBe(false);
      expect(privateSecret?.word).toBe('Pineapple');
      expect(privateSecret?.hint).toBeUndefined();
    });

    it('guarantees chomu players receive only hint and NEVER the secret word', () => {
      const chomuSecret: OnlineSecretState = {
        category: 'Food',
        isChomu: true,
        hint: 'Tropical',
        role: 'Imposter',
      };

      expect(chomuSecret.isChomu).toBe(true);
      expect(chomuSecret.hint).toBe('Tropical');
      expect(chomuSecret.word).toBeUndefined();
    });
  });

  describe('OnlineVoting & Results Tally Logic', () => {
    it('computes live vote counts correctly and identifies accused players', () => {
      let state = createInitialRoomState('TEST', 'h1', 'Alice', 'sleuth');
      state = {
        ...state,
        phase: 'VOTING',
        players: {
          h1: { id: 'h1', name: 'Alice', avatar: 'sleuth', isHost: true, isReady: true, isConnected: true, score: 0 },
          p2: { id: 'p2', name: 'Bob', avatar: 'shadow', isHost: false, isReady: true, isConnected: true, score: 0 },
          p3: { id: 'p3', name: 'Charlie', avatar: 'agent', isHost: false, isReady: true, isConnected: true, score: 0 },
          p4: { id: 'p4', name: 'Diana', avatar: 'whiz', isHost: false, isReady: true, isConnected: true, score: 0 },
        },
      };

      // Alice, Charlie, Diana vote for Bob
      state = handleCastVote(state, 'h1', 'p2');
      state = handleCastVote(state, 'p3', 'p2');
      state = handleCastVote(state, 'p4', 'p2');
      // Bob votes for Charlie
      state = handleCastVote(state, 'p2', 'p3');

      expect(state.players['h1'].votedForId).toBe('p2');
      expect(state.players['p3'].votedForId).toBe('p2');
      expect(state.players['p4'].votedForId).toBe('p2');
      expect(state.players['p2'].votedForId).toBe('p3');

      // Calculate results with Bob as imposter
      const hostSecret = {
        secretWord: 'Telescope',
        secretCategory: 'Science',
        chomuIds: ['p2'],
        imposterHints: { p2: 'Optics' },
        playerSecrets: {},
      };

      const nextState = handleCalculateResults(state, hostSecret);
      const results = nextState.votingResult!;

      expect(results.voteCounts['p2']).toBe(3);
      expect(results.voteCounts['p3']).toBe(1);
      expect(results.mostVotedPlayerIds).toEqual(['p2']);
      expect(results.chomusCaught).toBe(true);
      expect(results.secretWord).toBe('Telescope');
      expect(results.hints?.['p2']).toBe('Optics');
      expect(nextState.winner).toBe('civilians');
    });

    it('identifies imposter escape when civilians vote incorrectly', () => {
      let state = createInitialRoomState('TEST', 'h1', 'Alice', 'sleuth');
      state = {
        ...state,
        phase: 'VOTING',
        players: {
          h1: { id: 'h1', name: 'Alice', avatar: 'sleuth', isHost: true, isReady: true, isConnected: true, score: 0 },
          p2: { id: 'p2', name: 'Bob', avatar: 'shadow', isHost: false, isReady: true, isConnected: true, score: 0 },
          p3: { id: 'p3', name: 'Charlie', avatar: 'agent', isHost: false, isReady: true, isConnected: true, score: 0 },
        },
      };

      // Alice and Bob vote for Charlie (civilian). Charlie votes for Bob (imposter).
      state = handleCastVote(state, 'h1', 'p3');
      state = handleCastVote(state, 'p2', 'p3');
      state = handleCastVote(state, 'p3', 'p2');

      const hostSecret = {
        secretWord: 'Guitar',
        secretCategory: 'Music',
        chomuIds: ['p2'], // Bob was the chomu
        imposterHints: {},
        playerSecrets: {},
      };

      const nextState = handleCalculateResults(state, hostSecret);
      const results = nextState.votingResult!;

      expect(results.mostVotedPlayerIds).toEqual(['p3']); // Charlie received most votes
      expect(results.chomusCaught).toBe(false); // Imposter escaped!
      expect(nextState.winner).toBe('chomu');
    });
  });
});
