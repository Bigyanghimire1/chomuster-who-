import { describe, it, expect } from 'vitest';
import {
  ROOM_CODE_ALPHABET,
  generateRoomCode,
  isValidRoomCode,
  normalizeRoomCode,
} from '../services/multiplayer/roomCodeGenerator';
import {
  createInitialRoomState,
  electNextHost,
  findReboundPeerId,
  handleAbortRoundToLobby,
  handleCalculateResults,
  handleCastVote,
  handleNextRound,
  handleNextTurn,
  handlePlayerJoin,
  handlePlayerLeave,
  handleRoleAcknowledged,
  handleSetReady,
  handleStartGame,
  handleStartVoting,
  rebindHostSecretState,
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

describe('Milestone 2: Authoritative Spotlight Turn Management', () => {
  it('initializes spotlight fields and advances turns authoritatively', () => {
    let state = createInitialRoomState('SPOT', 'p-alice', 'Alice', 'sleuth');
    expect(state.currentTurnPlayerId).toBeNull();
    expect(state.turnOrder).toEqual(['p-alice']);
    expect(state.turnStartTime).toBeNull();
    expect(state.turnDurationSeconds).toBe(180);

    state = handlePlayerJoin(state, 'p-bob', 'Bob', 'shadow');
    state = handlePlayerJoin(state, 'p-charlie', 'Charlie', 'agent');
    expect(state.turnOrder).toContain('p-alice');
    expect(state.turnOrder).toContain('p-bob');
    expect(state.turnOrder).toContain('p-charlie');

    // Start game
    const { nextState } = handleStartGame(state, DEFAULT_CATEGORIES);
    state = nextState;
    expect(state.phase).toBe('ROLE_REVEAL');
    expect(state.turnOrder.length).toBe(3);

    // Acknowledge roles
    state = handleRoleAcknowledged(state, 'p-alice');
    state = handleRoleAcknowledged(state, 'p-bob');
    state = handleRoleAcknowledged(state, 'p-charlie');
    expect(state.phase).toBe('ROUND');
    expect(state.currentTurnPlayerId).toBe(state.turnOrder[0]);
    expect(state.turnStartTime).not.toBeNull();

    // Advance turn 1 -> turn 2
    const firstTurnPlayerId = state.currentTurnPlayerId;
    state = handleNextTurn(state);
    expect(state.currentTurnPlayerId).toBe(state.turnOrder[1]);
    expect(state.currentTurnPlayerId).not.toBe(firstTurnPlayerId);

    // Advance turn 2 -> turn 3
    state = handleNextTurn(state);
    expect(state.currentTurnPlayerId).toBe(state.turnOrder[2]);

    // Advance turn 3 -> transitions to VOTING
    state = handleNextTurn(state);
    expect(state.phase).toBe('VOTING');
    expect(state.currentTurnPlayerId).toBeNull();
  });

  it('handles player departure during round and advances active turn if necessary', () => {
    let state = createInitialRoomState('SPOT', 'p1', 'Alice', 'sleuth');
    state = handlePlayerJoin(state, 'p2', 'Bob', 'shadow');
    state = handlePlayerJoin(state, 'p3', 'Charlie', 'agent');

    const { nextState } = handleStartGame(state, DEFAULT_CATEGORIES);
    state = nextState;
    state = handleRoleAcknowledged(state, 'p1');
    state = handleRoleAcknowledged(state, 'p2');
    state = handleRoleAcknowledged(state, 'p3');

    const currentTurn = state.currentTurnPlayerId!;
    expect(currentTurn).toBeDefined();

    // The active turn player disconnects
    state = handlePlayerLeave(state, currentTurn);
    expect(state.players[currentTurn].isConnected).toBe(false);
    expect(state.turnOrder).not.toContain(currentTurn);
    // Active turn advances to one of the remaining connected players
    expect(state.currentTurnPlayerId).not.toBe(currentTurn);
    expect(['p1', 'p2', 'p3'].filter(id => id !== currentTurn)).toContain(state.currentTurnPlayerId);
  });
});

describe('Milestone 2: Session Recovery & Atomic Player Re-binding', () => {
  it('rebinds a reconnecting player with new peerId without creating duplicate slots', () => {
    let state = createInitialRoomState('RECO', 'host-1', 'Alice', 'sleuth');
    state = handlePlayerJoin(state, 'peer-bob-old', 'Bob', 'shadow', 'session-uuid-bob');
    state = handlePlayerJoin(state, 'peer-charlie', 'Charlie', 'agent', 'session-uuid-charlie');

    // Bob scores points and marks ready
    state.players['peer-bob-old'].score = 250;
    state = handleSetReady(state, 'peer-bob-old', true);
    expect(state.players['peer-bob-old'].score).toBe(250);
    expect(state.players['peer-bob-old'].isReady).toBe(true);

    // Charlie votes for Bob
    state = { ...state, phase: 'VOTING' };
    state = handleCastVote(state, 'peer-charlie', 'peer-bob-old');
    expect(state.players['peer-charlie'].votedForId).toBe('peer-bob-old');

    // Bob disconnects (e.g. browser refresh)
    state = handlePlayerLeave(state, 'peer-bob-old');
    expect(state.players['peer-bob-old'].isConnected).toBe(false);

    // Bob reconnects with brand new peer ID and same sessionPlayerId
    state = handlePlayerJoin(state, 'peer-bob-new', 'Bob', 'shadow', 'session-uuid-bob');

    // Total player count must remain exactly 3 (no phantom duplicate)
    expect(Object.keys(state.players).length).toBe(3);
    expect(state.players['peer-bob-new']).toBeDefined();
    expect(state.players['peer-bob-old']).toBeUndefined(); // Old slot removed

    // Bob preserves score, readiness, and connected status
    expect(state.players['peer-bob-new'].score).toBe(250);
    expect(state.players['peer-bob-new'].isReady).toBe(true);
    expect(state.players['peer-bob-new'].isConnected).toBe(true);

    // Charlie's vote target must be re-bound to the new peer ID
    expect(state.players['peer-charlie'].votedForId).toBe('peer-bob-new');
  });

  it('rebinds host secret state so reconnected player retains their secret role', () => {
    let state = createInitialRoomState('SECR', 'host-1', 'Alice', 'sleuth');
    state = handlePlayerJoin(state, 'p-bob', 'Bob', 'shadow', 'sess-bob');
    state = handlePlayerJoin(state, 'p-charlie', 'Charlie', 'agent', 'sess-charlie');

    const { nextState, hostSecretState } = handleStartGame(state, DEFAULT_CATEGORIES);
    state = nextState;

    const oldSecret = hostSecretState.playerSecrets['p-bob'];
    expect(oldSecret).toBeDefined();

    // Rebind secrets from 'p-bob' to 'p-bob-new'
    const updatedSecrets = rebindHostSecretState(hostSecretState, 'p-bob', 'p-bob-new');
    expect(updatedSecrets.playerSecrets['p-bob']).toBeUndefined();
    expect(updatedSecrets.playerSecrets['p-bob-new']).toEqual(oldSecret);

    if (oldSecret.isChomu) {
      expect(updatedSecrets.chomuIds).toContain('p-bob-new');
      expect(updatedSecrets.chomuIds).not.toContain('p-bob');
    }
  });

  it('locates rebound slot by fallback name if session token is missing', () => {
    const players = {
      p1: { id: 'p1', name: 'Alice', avatar: 'sleuth', isConnected: true } as any,
      p2: { id: 'p2', name: 'Bob', avatar: 'shadow', isConnected: false } as any,
    };

    expect(findReboundPeerId(players, undefined, 'Bob')).toBe('p2');
    expect(findReboundPeerId(players, undefined, 'Unknown')).toBeNull();
  });
});

describe('Milestone 2: Deterministic Host Migration & Grace Period', () => {
  it('elects the next host deterministically using localeCompare', () => {
    const players = {
      'peer-zebra': { id: 'peer-zebra', isConnected: true } as any,
      'peer-apple': { id: 'peer-apple', isConnected: true } as any,
      'peer-mango': { id: 'peer-mango', isConnected: true } as any,
      'peer-banana': { id: 'peer-banana', isConnected: false } as any, // disconnected: ineligible
    };

    // Among connected ['peer-zebra', 'peer-apple', 'peer-mango'], 'peer-apple' is lexicographically first
    expect(electNextHost(players)).toBe('peer-apple');

    // If 'peer-apple' is excluded (the departed host), next is 'peer-mango'
    expect(electNextHost(players, 'peer-apple')).toBe('peer-mango');
  });

  it('aborts active round cleanly to lobby on handleAbortRoundToLobby', () => {
    let state = createInitialRoomState('ABRT', 'p1', 'Alice', 'sleuth');
    state = handlePlayerJoin(state, 'p2', 'Bob', 'shadow');
    state = handlePlayerJoin(state, 'p3', 'Charlie', 'agent');

    const { nextState } = handleStartGame(state, DEFAULT_CATEGORIES);
    state = nextState;
    expect(state.phase).toBe('ROLE_REVEAL');

    state = handleAbortRoundToLobby(state, 'Host disconnected unexpectedly');
    expect(state.phase).toBe('LOBBY');
    expect(state.secretCategory).toBeNull();
    expect(state.roundStartTime).toBeNull();
    expect(state.votingResult).toBeNull();
    for (const player of Object.values(state.players)) {
      expect(player.isReady).toBe(false);
      expect(player.hasSeenRole).toBe(false);
    }
  });
});

describe('Milestone 2: Protocol Idempotency & Phase Guards', () => {
  it('prevents handleRoleAcknowledged from restarting roundStartTime when re-invoked', () => {
    let state = createInitialRoomState('IDEM', 'p1', 'Alice', 'sleuth');
    state = handlePlayerJoin(state, 'p2', 'Bob', 'shadow');
    state = handlePlayerJoin(state, 'p3', 'Charlie', 'agent');

    const { nextState } = handleStartGame(state, DEFAULT_CATEGORIES);
    state = nextState;

    state = handleRoleAcknowledged(state, 'p1');
    state = handleRoleAcknowledged(state, 'p2');
    state = handleRoleAcknowledged(state, 'p3');
    expect(state.phase).toBe('ROUND');

    const originalRoundStartTime = state.roundStartTime;
    expect(originalRoundStartTime).not.toBeNull();

    // Duplicate acknowledgment attempt during ROUND
    const stateAfterDuplicate = handleRoleAcknowledged(state, 'p1');
    expect(stateAfterDuplicate.roundStartTime).toBe(originalRoundStartTime);
    expect(stateAfterDuplicate).toBe(state); // Unmodified
  });

  it('prevents handleCalculateResults from multiplying score increments on repeated execution', () => {
    let state = createInitialRoomState('IDEM', 'p1', 'Alice', 'sleuth');
    state = handlePlayerJoin(state, 'p2', 'Bob', 'shadow');
    state = handlePlayerJoin(state, 'p3', 'Charlie', 'agent');

    const { nextState, hostSecretState } = handleStartGame(state, DEFAULT_CATEGORIES);
    state = nextState;
    state = handleRoleAcknowledged(state, 'p1');
    state = handleRoleAcknowledged(state, 'p2');
    state = handleRoleAcknowledged(state, 'p3');
    state = handleStartVoting(state);

    const chomuId = hostSecretState.chomuIds[0];
    const civilianIds = ['p1', 'p2', 'p3'].filter(id => id !== chomuId);

    // Vote for chomu
    for (const civ of civilianIds) {
      state = handleCastVote(state, civ, chomuId);
    }
    state = handleCastVote(state, chomuId, civilianIds[0]);

    // First calculation
    state = handleCalculateResults(state, hostSecretState);
    expect(state.phase).toBe('RESULTS');
    const firstScore = state.players[civilianIds[0]].score;
    expect(firstScore).toBe(100);

    // Repeated calculation on RESULTS state must be idempotent
    const stateAfterDuplicateCalc = handleCalculateResults(state, hostSecretState);
    expect(stateAfterDuplicateCalc.players[civilianIds[0]].score).toBe(100); // Does NOT increase to 200!
    expect(stateAfterDuplicateCalc).toBe(state);
  });

  it('guards handleSetReady and handleCastVote against invalid phases and targets', () => {
    let state = createInitialRoomState('IDEM', 'p1', 'Alice', 'sleuth');
    state = handlePlayerJoin(state, 'p2', 'Bob', 'shadow');

    // In LOBBY, casting vote is rejected
    const votingInLobby = handleCastVote(state, 'p1', 'p2');
    expect(votingInLobby).toBe(state);

    // Setting ready in ROUND is rejected
    state = { ...state, phase: 'ROUND' };
    const readyInRound = handleSetReady(state, 'p1', true);
    expect(readyInRound).toBe(state);

    // Voting for non-existent player in VOTING is rejected
    state = { ...state, phase: 'VOTING' };
    const voteForGhost = handleCastVote(state, 'p1', 'ghost-player');
    expect(voteForGhost).toBe(state);
  });
});
