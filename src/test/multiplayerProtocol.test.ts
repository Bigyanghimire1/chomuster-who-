import { describe, it, expect } from 'vitest';
import {
  ROOM_CODE_ALPHABET,
  generateRoomCode,
  isValidRoomCode,
  normalizeRoomCode,
} from '../services/multiplayer/roomCodeGenerator';
import {
  createInitialRoomState,
  handlePlayerJoin,
  handlePlayerLeave,
  handleSetReady,
  handleStartGame,
  handleRoleAcknowledged,
  handleStartVoting,
  handleCastVote,
  handleCalculateResults,
  handleNextRound,
  sanitizeRoomStateForPeer,
  createJoinRequestMessage,
  createJoinAckMessage,
  createSyncMessage,
  createActionMessage,
  createChatMessage,
  createHeartbeatMessage,
} from '../services/multiplayer/roomProtocol';
import { DEFAULT_CATEGORIES } from '../data/categories';
import { P2PRealtimeService } from '../services/multiplayer/p2pRealtimeService';

describe('Room Code Generator', () => {
  it('generates 4-character codes from unambiguous uppercase alphabet', () => {
    for (let i = 0; i < 100; i++) {
      const code = generateRoomCode();
      expect(code.length).toBe(4);
      expect(isValidRoomCode(code)).toBe(true);
      // Confusable letters I, L, O must NEVER be present
      expect(code).not.toContain('I');
      expect(code).not.toContain('L');
      expect(code).not.toContain('O');
      for (const char of code) {
        expect(ROOM_CODE_ALPHABET).toContain(char);
      }
    }
  });

  it('correctly validates and normalizes room codes', () => {
    expect(isValidRoomCode('ABCD')).toBe(true);
    expect(isValidRoomCode('WXYZ')).toBe(true);
    // Invalid lengths or characters
    expect(isValidRoomCode('ABC')).toBe(false);
    expect(isValidRoomCode('ABCDE')).toBe(false);
    expect(isValidRoomCode('AB12')).toBe(false);
    expect(isValidRoomCode('ABIO')).toBe(false); // contains I and O
    expect(isValidRoomCode('ABCL')).toBe(false); // contains L

    expect(normalizeRoomCode('  ab-cd  ')).toBe('ABCD');
    expect(normalizeRoomCode('wxyz!')).toBe('WXYZ');
  });
});

describe('Host-Authoritative Room Protocol & State Engine', () => {
  it('initializes room state in LOBBY phase with host player', () => {
    const roomState = createInitialRoomState('KMPQ', 'host-1', 'HostAlice', 'sleuth');
    expect(roomState.roomCode).toBe('KMPQ');
    expect(roomState.phase).toBe('LOBBY');
    expect(roomState.hostPeerId).toBe('host-1');
    expect(roomState.players['host-1']).toBeDefined();
    expect(roomState.players['host-1'].isHost).toBe(true);
    expect(roomState.players['host-1'].name).toBe('HostAlice');
    expect(roomState.chomuIds).toBeNull();
    expect(roomState.secretWord).toBeNull();
  });

  it('handles player join, ready toggle, and player departure with host migration', () => {
    let state = createInitialRoomState('KMPQ', 'host-1', 'HostAlice', 'sleuth');

    // Player 2 joins
    state = handlePlayerJoin(state, 'peer-2', 'Bob', 'shadow');
    expect(Object.keys(state.players).length).toBe(2);
    expect(state.players['peer-2'].name).toBe('Bob');
    expect(state.players['peer-2'].isHost).toBe(false);

    // Player 3 joins
    state = handlePlayerJoin(state, 'peer-3', 'Charlie', 'agent');
    expect(Object.keys(state.players).length).toBe(3);

    // Toggle ready
    state = handleSetReady(state, 'peer-2', true);
    expect(state.players['peer-2'].isReady).toBe(true);

    // Host leaves: should migrate host to peer-2
    state = handlePlayerLeave(state, 'host-1');
    expect(state.players['host-1'].isConnected).toBe(false);
    expect(state.hostPeerId).toBe('peer-2');
    expect(state.players['peer-2'].isHost).toBe(true);
  });

  it('enforces minimum 3 players before starting game', () => {
    const state = createInitialRoomState('KMPQ', 'host-1', 'Alice', 'sleuth');
    expect(() => handleStartGame(state, DEFAULT_CATEGORIES)).toThrow(
      'A minimum of 3 connected players is required to start the game.'
    );
  });
});

describe('Strict Client-Side Anti-Cheat Guarantees', () => {
  it('prevents chomuIds and secretWord from ever leaking to peers during non-reveal phases', () => {
    let state = createInitialRoomState('KMPQ', 'p1', 'Alice', 'sleuth');
    state = handlePlayerJoin(state, 'p2', 'Bob', 'shadow');
    state = handlePlayerJoin(state, 'p3', 'Charlie', 'agent');
    state = handlePlayerJoin(state, 'p4', 'Dana', 'maverick');

    const { nextState, hostSecretState } = handleStartGame(state, DEFAULT_CATEGORIES);
    expect(nextState.phase).toBe('ROLE_REVEAL');
    expect(hostSecretState.chomuIds.length).toBeGreaterThanOrEqual(1);

    const chomuId = hostSecretState.chomuIds[0];
    const civilianId = Object.keys(nextState.players).find(id => !hostSecretState.chomuIds.includes(id))!;

    // 1. Check sanitized broadcast for Civilian
    const civilianSanitized = sanitizeRoomStateForPeer(nextState, civilianId, hostSecretState);
    expect(civilianSanitized.sanitizedRoomState.chomuIds).toBeNull();
    expect(civilianSanitized.sanitizedRoomState.secretWord).toBeNull();
    expect(civilianSanitized.privateSecret).toBeDefined();
    expect(civilianSanitized.privateSecret?.isChomu).toBe(false);
    expect(civilianSanitized.privateSecret?.role).toBe('Civilian');
    expect(civilianSanitized.privateSecret?.word).toBe(hostSecretState.secretWord);
    expect(civilianSanitized.privateSecret?.hint).toBeUndefined();

    // 2. Check sanitized broadcast for Chomu
    const chomuSanitized = sanitizeRoomStateForPeer(nextState, chomuId, hostSecretState);
    expect(chomuSanitized.sanitizedRoomState.chomuIds).toBeNull();
    expect(chomuSanitized.sanitizedRoomState.secretWord).toBeNull();
    expect(chomuSanitized.privateSecret).toBeDefined();
    expect(chomuSanitized.privateSecret?.isChomu).toBe(true);
    expect(chomuSanitized.privateSecret?.role).toBe('Imposter');
    // Chomu must NEVER receive the secret word
    expect(chomuSanitized.privateSecret?.word).toBeUndefined();

    // 3. Advances through ROUND and VOTING: chomuIds must STILL be null
    let roundState = { ...nextState, phase: 'ROUND' as const };
    let sanitizedInRound = sanitizeRoomStateForPeer(roundState, civilianId, hostSecretState);
    expect(sanitizedInRound.sanitizedRoomState.chomuIds).toBeNull();
    expect(sanitizedInRound.sanitizedRoomState.secretWord).toBeNull();

    let votingState = handleStartVoting(roundState);
    expect(votingState.phase).toBe('VOTING');
    let sanitizedInVoting = sanitizeRoomStateForPeer(votingState, civilianId, hostSecretState);
    expect(sanitizedInVoting.sanitizedRoomState.chomuIds).toBeNull();
    expect(sanitizedInVoting.sanitizedRoomState.secretWord).toBeNull();

    // 4. In RESULTS phase: chomuIds and secretWord ARE revealed
    const resultsState = handleCalculateResults(votingState, hostSecretState);
    expect(resultsState.phase).toBe('RESULTS');
    const sanitizedInResults = sanitizeRoomStateForPeer(resultsState, civilianId, hostSecretState);
    expect(sanitizedInResults.sanitizedRoomState.chomuIds).toEqual(hostSecretState.chomuIds);
    expect(sanitizedInResults.sanitizedRoomState.secretWord).toBe(hostSecretState.secretWord);
    expect(sanitizedInResults.sanitizedRoomState.votingResult).toBeDefined();
  });
});

describe('Full Round Lifecycle, Voting, and Scoring', () => {
  it('progresses smoothly from ROLE_REVEAL through VOTING and RESULTS to NEXT ROUND', () => {
    let state = createInitialRoomState('KMPQ', 'p1', 'Alice', 'sleuth');
    state = handlePlayerJoin(state, 'p2', 'Bob', 'shadow');
    state = handlePlayerJoin(state, 'p3', 'Charlie', 'agent');

    // Start game
    const { nextState, hostSecretState } = handleStartGame(state, DEFAULT_CATEGORIES);
    state = nextState;
    expect(state.phase).toBe('ROLE_REVEAL');

    // Each player acknowledges role
    state = handleRoleAcknowledged(state, 'p1');
    state = handleRoleAcknowledged(state, 'p2');
    expect(state.phase).toBe('ROLE_REVEAL');
    state = handleRoleAcknowledged(state, 'p3');
    // When last player acknowledges, transitions to ROUND
    expect(state.phase).toBe('ROUND');
    expect(state.roundStartTime).not.toBeNull();

    // Start voting
    state = handleStartVoting(state);
    expect(state.phase).toBe('VOTING');

    // Cast votes
    const chomuId = hostSecretState.chomuIds[0];
    const civilianIds = ['p1', 'p2', 'p3'].filter(id => id !== chomuId);

    // Both civilians vote for the chomu
    for (const civ of civilianIds) {
      state = handleCastVote(state, civ, chomuId);
    }
    // Chomu votes for first civilian
    state = handleCastVote(state, chomuId, civilianIds[0]);

    // Calculate results
    state = handleCalculateResults(state, hostSecretState);
    expect(state.phase).toBe('RESULTS');
    expect(state.votingResult?.chomusCaught).toBe(true);
    expect(state.winner).toBe('civilians');
    expect(state.chomuIds).toEqual([chomuId]);
    expect(state.secretWord).toBe(hostSecretState.secretWord);

    // Civilians scored points
    for (const civ of civilianIds) {
      expect(state.players[civ].score).toBe(100);
    }
    expect(state.players[chomuId].score).toBe(0);

    // Next round
    state = handleNextRound(state);
    expect(state.phase).toBe('LOBBY');
    expect(state.roundNumber).toBe(2);
    expect(state.chomuIds).toBeNull();
    expect(state.secretWord).toBeNull();
    expect(state.votingResult).toBeNull();
  });
});

describe('Message Envelopes Factory', () => {
  it('creates valid JOIN, SYNC, ACTION, CHAT, HEARTBEAT messages', () => {
    const joinReq = createJoinRequestMessage('peer-1', 'Alice', 'sleuth');
    expect(joinReq.type).toBe('JOIN');
    expect(joinReq.payload.kind).toBe('JOIN_REQUEST');

    const joinAck = createJoinAckMessage('host-1', true, 'KMPQ');
    expect(joinAck.type).toBe('JOIN');
    expect(joinAck.payload.kind).toBe('JOIN_ACK');

    const syncMsg = createSyncMessage('host-1', createInitialRoomState('KMPQ', 'host-1'), 1);
    expect(syncMsg.type).toBe('SYNC');
    expect(syncMsg.payload.seq).toBe(1);

    const actionMsg = createActionMessage('peer-1', { type: 'SET_READY', isReady: true });
    expect(actionMsg.type).toBe('ACTION');
    expect(actionMsg.payload.type).toBe('SET_READY');

    const chatMsg = createChatMessage('peer-1', 'Alice', 'Hello room!');
    expect(chatMsg.type).toBe('CHAT');
    expect(chatMsg.payload.text).toBe('Hello room!');

    const hbMsg = createHeartbeatMessage('peer-1', 'PING', 1000);
    expect(hbMsg.type).toBe('HEARTBEAT');
    expect(hbMsg.payload.kind).toBe('PING');
  });
});

describe('P2PRealtimeService Integration with Mock Signaling', () => {
  it('initializes room, handles actions, and cleans up subscriptions', async () => {
    const mockActions: Record<string, any> = {};

    const mockJoinRoom = () => ({
      makeAction: (name: string) => {
        const listeners: Array<(data: any, peerId: string) => void> = [];
        const actionObj = {
          send: async (_data: any) => {
            // Echo locally or to mock peers
          },
          onMessage: (fn: any) => {
            listeners.push(fn);
            return () => {};
          },
        };
        mockActions[name] = actionObj;
        return actionObj;
      },
      onPeerJoin: () => () => {},
      onPeerLeave: () => () => {},
      leave: async () => {},
    });

    const service = new P2PRealtimeService();
    let latestState: any = null;
    let latestSecret: any = null;

    const unsub = service.subscribe((s, sec) => {
      latestState = s;
      latestSecret = sec;
    });

    await service.createRoom('KMPQ', 'HostUser', 'detective', {
      joinRoomFn: mockJoinRoom,
    });

    expect(service.isConnected()).toBe(true);
    expect(service.isHost()).toBe(true);
    expect(service.getRoomCode()).toBe('KMPQ');
    expect(latestState).not.toBeNull();
    expect(latestState.roomCode).toBe('KMPQ');
    expect(latestState.players[service.getMyPeerId()]).toBeDefined();
    expect(latestSecret).toBeNull();

    // Toggle ready
    service.setReady(true);
    expect(service.getState()?.players[service.getMyPeerId()].isReady).toBe(true);

    // Leave room
    await service.leaveRoom();
    expect(service.isConnected()).toBe(false);
    unsub();
  });
});
