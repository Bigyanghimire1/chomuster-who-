import { Category, PlayerAvatarId } from '../../types/game';
import {
  ActionMessage,
  ChatMessage,
  HeartbeatMessage,
  HostSecretState,
  JoinMessage,
  OnlinePlayer,
  OnlineSecretState,
  OnlineSettings,
  OnlineVotingResult,
  RoomAction,
  RoomState,
  SyncMessage,
} from '../../types/multiplayer';
import { assignRoles, clampImposterCount } from '../roleAssignment';
import { selectSecretWord } from '../wordSelector';
import { assignUniqueImposterHints, WordEntry } from '../../data/wordDatabase';
import { RandomSource } from '../random';

/**
 * Creates default online room settings.
 */
export function createDefaultSettings(): OnlineSettings {
  return {
    categoryIds: ['everyday_objects', 'food_drinks', 'animals'],
    roundDurationSeconds: 180,
    votingDurationSeconds: 60,
    hintDifficulty: 'subtle',
    chomuCount: 1,
    soundEnabled: true,
  };
}

/**
 * Initializes a new RoomState for a given room code and host peer.
 */
export function createInitialRoomState(
  roomCode: string,
  hostPeerId: string,
  hostName: string = 'Host',
  hostAvatar: PlayerAvatarId = 'sleuth',
  customSettings?: Partial<OnlineSettings>
): RoomState {
  const settings: OnlineSettings = {
    ...createDefaultSettings(),
    ...customSettings,
  };

  const hostPlayer: OnlinePlayer = {
    id: hostPeerId,
    name: hostName,
    avatar: hostAvatar,
    isHost: true,
    isReady: true,
    isConnected: true,
    score: 0,
    lastSeen: Date.now(),
  };

  return {
    roomCode,
    hostPeerId,
    phase: 'LOBBY',
    players: { [hostPeerId]: hostPlayer },
    settings,
    roundNumber: 1,
    secretCategory: null,
    roundStartTime: null,
    roundDurationSeconds: settings.roundDurationSeconds,
    votingStartTime: null,
    votingDurationSeconds: settings.votingDurationSeconds,
    votingResult: null,
    winner: null,
    chomuIds: null,
    secretWord: null,
  };
}

/**
 * Creates the host's private in-memory secret state.
 */
export function createHostSecretState(
  wordEntry: WordEntry,
  roles: ReturnType<typeof assignRoles>,
  imposterHints: Record<string, string>
): HostSecretState {
  const chomuIds = Object.keys(roles).filter(id => roles[id].isImposter);
  const playerSecrets: Record<string, OnlineSecretState> = {};

  for (const [playerId, assignment] of Object.entries(roles)) {
    if (assignment.isImposter) {
      playerSecrets[playerId] = {
        category: wordEntry.categoryName,
        isChomu: true,
        hint: imposterHints[playerId] || undefined,
        role: 'Imposter',
        // Note: word is strictly undefined for Chomu!
      };
    } else {
      playerSecrets[playerId] = {
        category: wordEntry.categoryName,
        word: wordEntry.word,
        isChomu: false,
        role: 'Civilian',
        // Note: hint is strictly undefined for Civilian!
      };
    }
  }

  return {
    secretWord: wordEntry.word,
    secretCategory: wordEntry.categoryName,
    chomuIds,
    imposterHints,
    playerSecrets,
  };
}

/**
 * Anti-Cheat State Sanitizer:
 * Regular players must NEVER receive `chomuIds` or `secretWord` in broadcast payloads
 * until the 'RESULTS' phase.
 *
 * For non-RESULTS phases:
 * - `chomuIds` is strictly null.
 * - `secretWord` is strictly null.
 * - `votingResult` is strictly null.
 * - Other players' roles are strictly concealed.
 * - In 'VOTING' phase, other players' target choices are masked as boolean indicator to prevent bandwagoning.
 *
 * Targeted private secret:
 * - Civilian peer receives `{ category, word, isChomu: false, role: 'Civilian' }`.
 * - Chomu peer receives `{ category, hint, isChomu: true, role: 'Imposter' }`.
 */
export function sanitizeRoomStateForPeer(
  fullRoomState: RoomState,
  recipientPeerId: string,
  hostSecretState: HostSecretState | null
): { sanitizedRoomState: RoomState; privateSecret?: OnlineSecretState } {
  const isRevealPhase = fullRoomState.phase === 'RESULTS';

  // Deep clone players map to sanitize individual player properties
  const sanitizedPlayers: Record<string, OnlinePlayer> = {};
  for (const [id, player] of Object.entries(fullRoomState.players)) {
    let sanitizedVotedForId = player.votedForId;

    // During active voting, mask choices of other players to prevent bandwagoning
    if (fullRoomState.phase === 'VOTING' && id !== recipientPeerId) {
      sanitizedVotedForId = player.votedForId ? '__VOTED__' : null;
    }

    sanitizedPlayers[id] = {
      ...player,
      votedForId: sanitizedVotedForId,
    };
  }

  const sanitizedRoomState: RoomState = {
    ...fullRoomState,
    players: sanitizedPlayers,
    // Anti-cheat: strictly null during non-RESULTS phases
    chomuIds: isRevealPhase
      ? (hostSecretState ? [...hostSecretState.chomuIds] : fullRoomState.chomuIds)
      : null,
    secretWord: isRevealPhase
      ? (hostSecretState ? hostSecretState.secretWord : fullRoomState.secretWord)
      : null,
    votingResult: isRevealPhase ? fullRoomState.votingResult : null,
  };

  // Targeted private secret for this specific peer
  let privateSecret: OnlineSecretState | undefined;
  if (hostSecretState && hostSecretState.playerSecrets[recipientPeerId]) {
    privateSecret = hostSecretState.playerSecrets[recipientPeerId];
  }

  return { sanitizedRoomState, privateSecret };
}

// ============================================================================
// Host Authoritative State Transition Engine
// ============================================================================

/**
 * Handles player join or reconnection.
 */
export function handlePlayerJoin(
  state: RoomState,
  peerId: string,
  name: string,
  avatar: PlayerAvatarId
): RoomState {
  const existingPlayer = state.players[peerId];
  const isHost = peerId === state.hostPeerId || Object.keys(state.players).length === 0;

  const player: OnlinePlayer = {
    id: peerId,
    name: name.trim() || `Player ${Object.keys(state.players).length + 1}`,
    avatar,
    isHost,
    isReady: existingPlayer ? existingPlayer.isReady : false,
    isConnected: true,
    score: existingPlayer ? existingPlayer.score : 0,
    lastSeen: Date.now(),
  };

  return {
    ...state,
    hostPeerId: isHost ? peerId : state.hostPeerId,
    players: {
      ...state.players,
      [peerId]: player,
    },
  };
}

/**
 * Handles player disconnection or departure.
 */
export function handlePlayerLeave(state: RoomState, peerId: string): RoomState {
  if (!state.players[peerId]) return state;

  const updatedPlayers = { ...state.players };
  updatedPlayers[peerId] = {
    ...updatedPlayers[peerId],
    isConnected: false,
    lastSeen: Date.now(),
  };

  let nextHostPeerId = state.hostPeerId;
  // If host disconnected, migrate host status to the first connected player
  if (peerId === state.hostPeerId) {
    const nextConnected = Object.values(updatedPlayers).find(p => p.isConnected && p.id !== peerId);
    if (nextConnected) {
      nextHostPeerId = nextConnected.id;
      updatedPlayers[nextConnected.id] = {
        ...nextConnected,
        isHost: true,
      };
    }
  }

  return {
    ...state,
    hostPeerId: nextHostPeerId,
    players: updatedPlayers,
  };
}

/**
 * Handles player ready toggle in lobby.
 */
export function handleSetReady(state: RoomState, peerId: string, isReady: boolean): RoomState {
  const player = state.players[peerId];
  if (!player) return state;

  return {
    ...state,
    players: {
      ...state.players,
      [peerId]: {
        ...player,
        isReady,
      },
    },
  };
}

/**
 * Handles room settings updates by the host.
 */
export function handleUpdateSettings(
  state: RoomState,
  newSettings: Partial<OnlineSettings>
): RoomState {
  const playerCount = Object.values(state.players).filter(p => p.isConnected).length;
  const requestedChomu = newSettings.chomuCount ?? state.settings.chomuCount;
  const clampedChomu = clampImposterCount(playerCount || 3, requestedChomu);

  const updatedSettings: OnlineSettings = {
    ...state.settings,
    ...newSettings,
    chomuCount: clampedChomu,
  };

  return {
    ...state,
    settings: updatedSettings,
    roundDurationSeconds: updatedSettings.roundDurationSeconds,
    votingDurationSeconds: updatedSettings.votingDurationSeconds,
  };
}

/**
 * Starts a new game round from lobby.
 * Host authoritative: validates min players (>= 3), selects word, assigns roles, and prepares secrets.
 */
export function handleStartGame(
  state: RoomState,
  categories: Category[],
  usedWords: string[] = [],
  randomSource?: RandomSource
): { nextState: RoomState; hostSecretState: HostSecretState; updatedUsedWords: string[] } {
  const activePlayers = Object.values(state.players).filter(p => p.isConnected);
  if (activePlayers.length < 3) {
    throw new Error('A minimum of 3 connected players is required to start the game.');
  }

  // 1. Select secret word
  const { wordEntry, updatedUsedWords } = selectSecretWord(
    categories,
    state.settings.categoryIds,
    usedWords,
    state.settings.hintDifficulty,
    randomSource
  );

  // 2. Assign roles
  const playerList = activePlayers.map(p => ({
    id: p.id,
    name: p.name,
    score: p.score,
    avatar: p.avatar,
  }));
  const roles = assignRoles(playerList, state.settings.chomuCount, randomSource);

  // 3. Assign hints
  const chomuIds = Object.keys(roles).filter(id => roles[id].isImposter);
  const imposterHints = assignUniqueImposterHints(
    wordEntry,
    chomuIds,
    state.settings.hintDifficulty,
    randomSource
  );

  // 4. Create host private secret
  const hostSecretState = createHostSecretState(wordEntry, roles, imposterHints);

  // 5. Reset player statuses for the new round
  const resetPlayers: Record<string, OnlinePlayer> = {};
  for (const [id, player] of Object.entries(state.players)) {
    resetPlayers[id] = {
      ...player,
      hasSeenRole: false,
      votedForId: null,
      isSpeaking: false,
    };
  }

  const nextState: RoomState = {
    ...state,
    phase: 'ROLE_REVEAL',
    players: resetPlayers,
    secretCategory: wordEntry.categoryName,
    roundStartTime: null,
    votingStartTime: null,
    votingResult: null,
    winner: null,
    chomuIds: null,
    secretWord: null,
  };

  return { nextState, hostSecretState, updatedUsedWords };
}

/**
 * Handles role acknowledgment by a player.
 * Automatically advances to 'ROUND' phase once all connected players acknowledge.
 */
export function handleRoleAcknowledged(state: RoomState, peerId: string): RoomState {
  const player = state.players[peerId];
  if (!player) return state;

  const updatedPlayers = {
    ...state.players,
    [peerId]: {
      ...player,
      hasSeenRole: true,
    },
  };

  // Check if all connected players have acknowledged
  const connectedPlayers = Object.values(updatedPlayers).filter(p => p.isConnected);
  const allAcknowledged = connectedPlayers.length > 0 && connectedPlayers.every(p => p.hasSeenRole);

  if (allAcknowledged) {
    return {
      ...state,
      phase: 'ROUND',
      players: updatedPlayers,
      roundStartTime: Date.now(),
    };
  }

  return {
    ...state,
    players: updatedPlayers,
  };
}

/**
 * Manually starts the discussion round.
 */
export function handleStartRound(state: RoomState): RoomState {
  return {
    ...state,
    phase: 'ROUND',
    roundStartTime: Date.now(),
  };
}

/**
 * Transitions from round to voting phase.
 */
export function handleStartVoting(state: RoomState): RoomState {
  const resetVotePlayers: Record<string, OnlinePlayer> = {};
  for (const [id, player] of Object.entries(state.players)) {
    resetVotePlayers[id] = {
      ...player,
      votedForId: null,
    };
  }

  return {
    ...state,
    phase: 'VOTING',
    players: resetVotePlayers,
    votingStartTime: Date.now(),
  };
}

/**
 * Records a player's vote during the voting phase.
 */
export function handleCastVote(
  state: RoomState,
  voterId: string,
  targetPlayerId: string
): RoomState {
  const voter = state.players[voterId];
  if (!voter) return state;

  return {
    ...state,
    players: {
      ...state.players,
      [voterId]: {
        ...voter,
        votedForId: targetPlayerId,
      },
    },
  };
}

/**
 * Calculates results from the voting phase, scores players, and transitions to RESULTS.
 */
export function handleCalculateResults(
  state: RoomState,
  hostSecretState: HostSecretState
): RoomState {
  const connectedPlayers = Object.values(state.players).filter(p => p.isConnected);
  const votes: Record<string, string> = {};
  const voteCounts: Record<string, number> = {};

  for (const p of connectedPlayers) {
    if (p.votedForId) {
      votes[p.id] = p.votedForId;
      voteCounts[p.votedForId] = (voteCounts[p.votedForId] || 0) + 1;
    }
  }

  // Find most voted players
  let maxVotes = 0;
  for (const count of Object.values(voteCounts)) {
    if (count > maxVotes) maxVotes = count;
  }

  const mostVotedPlayerIds = Object.keys(voteCounts).filter(
    id => voteCounts[id] === maxVotes && maxVotes > 0
  );

  // Chomu is caught if at least one of the top voted players is a Chomu
  const chomuSet = new Set(hostSecretState.chomuIds);
  const chomusCaught = mostVotedPlayerIds.some(id => chomuSet.has(id));
  const winner: 'civilians' | 'chomu' = chomusCaught ? 'civilians' : 'chomu';

  // Award scores
  const updatedPlayers = { ...state.players };
  for (const [id, player] of Object.entries(updatedPlayers)) {
    let scoreDelta = 0;
    if (chomuSet.has(id)) {
      // Chomu scores if not caught
      if (!chomusCaught) scoreDelta = 200;
    } else {
      // Civilians score if chomu caught
      if (chomusCaught) scoreDelta = 100;
    }
    updatedPlayers[id] = {
      ...player,
      score: (player.score || 0) + scoreDelta,
    };
  }

  const votingResult: OnlineVotingResult = {
    chomuIds: [...hostSecretState.chomuIds],
    secretWord: hostSecretState.secretWord,
    category: hostSecretState.secretCategory,
    votes,
    voteCounts,
    mostVotedPlayerIds,
    chomusCaught,
    hints: hostSecretState.imposterHints,
  };

  return {
    ...state,
    phase: 'RESULTS',
    players: updatedPlayers,
    votingResult,
    winner,
    chomuIds: [...hostSecretState.chomuIds],
    secretWord: hostSecretState.secretWord,
  };
}

/**
 * Resets state for next round back to LOBBY.
 */
export function handleNextRound(state: RoomState): RoomState {
  const resetPlayers: Record<string, OnlinePlayer> = {};
  for (const [id, player] of Object.entries(state.players)) {
    resetPlayers[id] = {
      ...player,
      isReady: false,
      hasSeenRole: false,
      votedForId: null,
      isSpeaking: false,
    };
  }

  return {
    ...state,
    phase: 'LOBBY',
    players: resetPlayers,
    roundNumber: state.roundNumber + 1,
    secretCategory: null,
    roundStartTime: null,
    votingStartTime: null,
    votingResult: null,
    winner: null,
    chomuIds: null,
    secretWord: null,
  };
}

/**
 * Resets room state back to LOBBY.
 */
export function handleResetLobby(state: RoomState): RoomState {
  return handleNextRound(state);
}

/**
 * Kicks a player from the room.
 */
export function handleKickPlayer(state: RoomState, targetPlayerId: string): RoomState {
  if (!state.players[targetPlayerId]) return state;

  const nextPlayers = { ...state.players };
  delete nextPlayers[targetPlayerId];

  return {
    ...state,
    players: nextPlayers,
  };
}

// ============================================================================
// Message Envelope Factory Functions
// ============================================================================

export function createJoinRequestMessage(
  senderId: string,
  name: string,
  avatar: PlayerAvatarId
): JoinMessage {
  return {
    type: 'JOIN',
    senderId,
    timestamp: Date.now(),
    payload: {
      kind: 'JOIN_REQUEST',
      name,
      avatar,
    },
  };
}

export function createJoinAckMessage(
  senderId: string,
  accepted: boolean,
  roomCode: string,
  reason?: string,
  assignedId?: string
): JoinMessage {
  return {
    type: 'JOIN',
    senderId,
    timestamp: Date.now(),
    payload: {
      kind: 'JOIN_ACK',
      accepted,
      roomCode,
      reason,
      assignedId,
    },
  };
}

export function createSyncMessage(
  senderId: string,
  roomState: RoomState,
  seq: number,
  privateSecret?: OnlineSecretState
): SyncMessage {
  return {
    type: 'SYNC',
    senderId,
    timestamp: Date.now(),
    payload: {
      roomState,
      privateSecret,
      seq,
    },
  };
}

export function createActionMessage(senderId: string, action: RoomAction): ActionMessage {
  return {
    type: 'ACTION',
    senderId,
    timestamp: Date.now(),
    payload: action,
  };
}

export function createChatMessage(
  senderId: string,
  senderName: string,
  text: string,
  isSystem: boolean = false
): ChatMessage {
  return {
    type: 'CHAT',
    senderId,
    timestamp: Date.now(),
    payload: {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      senderName,
      text,
      isSystem,
    },
  };
}

export function createHeartbeatMessage(
  senderId: string,
  kind: 'PING' | 'PONG',
  clientTimestamp: number,
  serverTimestamp?: number
): HeartbeatMessage {
  return {
    type: 'HEARTBEAT',
    senderId,
    timestamp: Date.now(),
    payload: {
      kind,
      clientTimestamp,
      serverTimestamp,
    },
  };
}
