import { Category, PlayerAvatarId } from '../../types/game';
import {
  ActionMessage,
  BaseEnvelope,
  ChatMessage,
  HeartbeatMessage,
  HostSecretState,
  JoinPayload,
  OnlinePlayer,
  OnlineSecretState,
  OnlineSettings,
  OnlineVotingResult,
  RoomAction,
  RoomState,
  SyncMessage,
} from '../../types/multiplayer';
import { assignRoles } from '../roleAssignment';
import { selectSecretWord } from '../wordSelector';
import { assignUniqueImposterHints, WordEntry } from '../../data/wordDatabase';
import { RandomSource, secureShuffle } from '../random';

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
    currentTurnPlayerId: null,
    turnOrder: [hostPeerId],
    turnStartTime: null,
    turnDurationSeconds: settings.roundDurationSeconds || 30,
    hostGracePeriodEnd: null,
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
    winner: isRevealPhase ? fullRoomState.winner : null,
    currentTurnPlayerId: fullRoomState.currentTurnPlayerId,
    turnOrder: [...(fullRoomState.turnOrder || [])],
    turnStartTime: fullRoomState.turnStartTime,
    turnDurationSeconds: fullRoomState.turnDurationSeconds,
    hostGracePeriodEnd: fullRoomState.hostGracePeriodEnd ?? null,
  };

  // Targeted private secret for this specific peer
  let privateSecret: OnlineSecretState | undefined;
  if (hostSecretState && hostSecretState.playerSecrets[recipientPeerId]) {
    privateSecret = hostSecretState.playerSecrets[recipientPeerId];
  }

  return { sanitizedRoomState, privateSecret };
}

// ============================================================================
// Host Authoritative State Transition Engine & Re-binding Helpers
// ============================================================================

/**
 * Locates an existing player slot eligible for re-binding to an incoming peer.
 * Checks sessionPlayerId first, then disconnected slot with matching name.
 */
export function findReboundPeerId(
  players: Record<string, OnlinePlayer>,
  sessionPlayerId?: string,
  fallbackName?: string
): string | null {
  if (sessionPlayerId && sessionPlayerId.trim().length > 0) {
    for (const [id, player] of Object.entries(players)) {
      if (player.sessionPlayerId === sessionPlayerId) {
        return id;
      }
    }
  }
  if (fallbackName && fallbackName.trim().length > 0) {
    const targetName = fallbackName.trim().toLowerCase();
    for (const [id, player] of Object.entries(players)) {
      if (!player.isConnected && player.name.trim().toLowerCase() === targetName) {
        return id;
      }
    }
  }
  return null;
}

/**
 * Rebinds host secret state keys when a player's peer ID changes upon reconnection.
 */
export function rebindHostSecretState(
  hostSecretState: HostSecretState,
  oldPeerId: string,
  newPeerId: string
): HostSecretState {
  if (oldPeerId === newPeerId) return hostSecretState;

  const chomuIds = hostSecretState.chomuIds.map(id => (id === oldPeerId ? newPeerId : id));
  const imposterHints = { ...hostSecretState.imposterHints };
  if (oldPeerId in imposterHints) {
    imposterHints[newPeerId] = imposterHints[oldPeerId];
    delete imposterHints[oldPeerId];
  }

  const playerSecrets = { ...hostSecretState.playerSecrets };
  if (oldPeerId in playerSecrets) {
    playerSecrets[newPeerId] = playerSecrets[oldPeerId];
    delete playerSecrets[oldPeerId];
  }

  return {
    ...hostSecretState,
    chomuIds,
    imposterHints,
    playerSecrets,
  };
}

/**
 * Deterministically elects the next host by sorting connected player IDs via localeCompare.
 */
export function electNextHost(
  players: Record<string, OnlinePlayer>,
  excludePeerId?: string
): string | null {
  const connected = Object.values(players).filter(
    p => p.isConnected && p.id !== excludePeerId
  );
  if (connected.length === 0) return null;
  connected.sort((a, b) => a.id.localeCompare(b.id));
  return connected[0].id;
}

/**
 * Handles player join or reconnection with atomic session re-binding.
 */
export function handlePlayerJoin(
  state: RoomState,
  peerId: string,
  name: string,
  avatar: PlayerAvatarId,
  sessionPlayerId?: string
): RoomState {
  // 1. Direct match on existing peer ID
  const existingDirect = state.players[peerId];
  if (existingDirect) {
    return {
      ...state,
      players: {
        ...state.players,
        [peerId]: {
          ...existingDirect,
          name: name.trim() || existingDirect.name,
          avatar: avatar || existingDirect.avatar,
          isConnected: true,
          lastSeen: Date.now(),
          sessionPlayerId: sessionPlayerId || existingDirect.sessionPlayerId,
        },
      },
    };
  }

  // 2. Check for slot re-binding via persistent sessionPlayerId or disconnected matching slot
  const reboundPeerId = findReboundPeerId(state.players, sessionPlayerId, name);
  if (reboundPeerId && reboundPeerId !== peerId) {
    const existingPlayer = state.players[reboundPeerId];
    const updatedPlayers = { ...state.players };
    delete updatedPlayers[reboundPeerId];

    const isHost = existingPlayer.isHost || reboundPeerId === state.hostPeerId;
    updatedPlayers[peerId] = {
      id: peerId,
      name: name.trim() || existingPlayer.name,
      avatar: avatar || existingPlayer.avatar,
      isHost,
      isReady: existingPlayer.isReady,
      isConnected: true,
      score: existingPlayer.score,
      hasSeenRole: existingPlayer.hasSeenRole,
      votedForId: existingPlayer.votedForId,
      isSpeaking: false,
      lastSeen: Date.now(),
      sessionPlayerId: sessionPlayerId || existingPlayer.sessionPlayerId,
    };

    // Re-bind other players' votes if they voted for old peer ID
    for (const [pId, p] of Object.entries(updatedPlayers)) {
      if (p.votedForId === reboundPeerId) {
        updatedPlayers[pId] = { ...p, votedForId: peerId };
      }
    }

    // Re-bind spotlight fields
    const currentTurnPlayerId =
      state.currentTurnPlayerId === reboundPeerId ? peerId : state.currentTurnPlayerId;
    const turnOrder = (state.turnOrder || []).map(id => (id === reboundPeerId ? peerId : id));
    const hostPeerId = state.hostPeerId === reboundPeerId ? peerId : state.hostPeerId;

    return {
      ...state,
      hostPeerId,
      players: updatedPlayers,
      currentTurnPlayerId,
      turnOrder,
    };
  }

  // 3. Brand new player join
  // Phase guard: new joins are rejected outside LOBBY if not re-binding
  if (state.phase !== 'LOBBY') {
    return state;
  }

  const isHost = peerId === state.hostPeerId || Object.keys(state.players).length === 0;
  const player: OnlinePlayer = {
    id: peerId,
    name: name.trim() || `Player ${Object.keys(state.players).length + 1}`,
    avatar,
    isHost,
    isReady: isHost,
    isConnected: true,
    score: 0,
    lastSeen: Date.now(),
    sessionPlayerId,
  };

  const turnOrder = state.turnOrder || [];
  const updatedTurnOrder = turnOrder.includes(peerId) ? turnOrder : [...turnOrder, peerId];

  return {
    ...state,
    hostPeerId: isHost ? peerId : state.hostPeerId,
    players: {
      ...state.players,
      [peerId]: player,
    },
    turnOrder: updatedTurnOrder,
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
  // If host disconnected, migrate host status deterministically
  if (peerId === state.hostPeerId) {
    const nextConnectedId = electNextHost(updatedPlayers, peerId);
    if (nextConnectedId) {
      nextHostPeerId = nextConnectedId;
      updatedPlayers[nextConnectedId] = {
        ...updatedPlayers[nextConnectedId],
        isHost: true,
      };
    }
  }

  // Turn management if leaving player is the active turn player during ROUND
  let nextTurnPlayerId = state.currentTurnPlayerId;
  const nextTurnOrder = (state.turnOrder || []).filter(id => id !== peerId);
  if (state.phase === 'ROUND' && state.currentTurnPlayerId === peerId) {
    const remainingConnected = nextTurnOrder.filter(id => updatedPlayers[id]?.isConnected);
    nextTurnPlayerId = remainingConnected[0] || null;
  }

  return {
    ...state,
    hostPeerId: nextHostPeerId,
    players: updatedPlayers,
    currentTurnPlayerId: nextTurnPlayerId,
    turnOrder: nextTurnOrder,
  };
}

/**
 * Handles player ready toggle in lobby.
 */
export function handleSetReady(state: RoomState, peerId: string, isReady: boolean): RoomState {
  if (state.phase !== 'LOBBY') return state;
  const player = state.players[peerId];
  if (!player || player.isReady === isReady) return state;

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
  const requestedChomu = newSettings.chomuCount ?? state.settings.chomuCount;
  const clampedChomu = Math.min(3, Math.max(1, requestedChomu));

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

  // 6. Build turn order for round spotlight
  const turnOrder = secureShuffle(activePlayers.map(p => p.id), randomSource);

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
    currentTurnPlayerId: null,
    turnOrder,
    turnStartTime: null,
    turnDurationSeconds: state.settings.roundDurationSeconds || 30,
    hostGracePeriodEnd: null,
  };

  return { nextState, hostSecretState, updatedUsedWords };
}

/**
 * Handles role acknowledgment by a player.
 * Automatically advances to 'ROUND' phase once all connected players acknowledge.
 */
export function handleRoleAcknowledged(state: RoomState, peerId: string): RoomState {
  if (state.phase !== 'ROLE_REVEAL') return state;
  const player = state.players[peerId];
  if (!player || player.hasSeenRole) return state;

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
    const turnOrder = (state.turnOrder && state.turnOrder.length > 0)
      ? state.turnOrder.filter(id => updatedPlayers[id]?.isConnected)
      : Object.keys(updatedPlayers).filter(id => updatedPlayers[id].isConnected);

    return {
      ...state,
      phase: 'ROUND',
      players: updatedPlayers,
      roundStartTime: Date.now(),
      currentTurnPlayerId: turnOrder[0] || null,
      turnOrder,
      turnStartTime: Date.now(),
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
  if (state.phase !== 'ROLE_REVEAL' && state.phase !== 'ROUND') return state;
  const turnOrder = (state.turnOrder && state.turnOrder.length > 0)
    ? state.turnOrder.filter(id => state.players[id]?.isConnected)
    : Object.keys(state.players).filter(id => state.players[id].isConnected);

  return {
    ...state,
    phase: 'ROUND',
    roundStartTime: state.roundStartTime || Date.now(),
    currentTurnPlayerId: state.currentTurnPlayerId || turnOrder[0] || null,
    turnOrder,
    turnStartTime: state.turnStartTime || Date.now(),
  };
}

/**
 * Advances the active turn spotlight to the next player, or advances to VOTING if all finished.
 */
export function handleNextTurn(state: RoomState): RoomState {
  if (state.phase !== 'ROUND') return state;
  const connectedTurnOrder = (state.turnOrder || []).filter(
    id => state.players[id] && state.players[id].isConnected
  );

  if (connectedTurnOrder.length === 0) {
    return handleStartVoting(state);
  }

  const currentIdx = state.currentTurnPlayerId
    ? connectedTurnOrder.indexOf(state.currentTurnPlayerId)
    : -1;

  if (currentIdx === -1 || currentIdx >= connectedTurnOrder.length - 1) {
    return handleStartVoting(state);
  }

  const nextPlayerId = connectedTurnOrder[currentIdx + 1];
  return {
    ...state,
    currentTurnPlayerId: nextPlayerId,
    turnStartTime: Date.now(),
  };
}

/**
 * Transitions from round to voting phase.
 */
export function handleStartVoting(state: RoomState): RoomState {
  if (state.phase !== 'ROUND') return state;
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
    currentTurnPlayerId: null,
    turnStartTime: null,
  };
}

/**
 * Records a player's vote during the voting phase.
 */
export function handleCastVote<T extends RoomState = RoomState>(
  state: T,
  voterId: string,
  targetPlayerId: string
): T {
  if (state.phase !== 'VOTING') return state;
  const voter = state.players[voterId];
  const target = state.players[targetPlayerId];
  if (!voter || !target) return state;
  if (voter.votedForId === targetPlayerId) return state;

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
  // Guard against redundant calculation to protect scores from multiplying
  if (state.phase === 'RESULTS' || state.votingResult !== null) {
    return state;
  }

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
    currentTurnPlayerId: null,
    turnStartTime: null,
  };
}

/**
 * Aborts an active round and safely returns all participants to the LOBBY.
 */
export function handleAbortRoundToLobby(state: RoomState, _reason?: string): RoomState {
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
    secretCategory: null,
    roundStartTime: null,
    votingStartTime: null,
    votingResult: null,
    winner: null,
    chomuIds: null,
    secretWord: null,
    currentTurnPlayerId: null,
    turnStartTime: null,
    hostGracePeriodEnd: null,
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
    currentTurnPlayerId: null,
    turnStartTime: null,
    hostGracePeriodEnd: null,
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
  avatar: PlayerAvatarId,
  sessionPlayerId?: string
): BaseEnvelope<'JOIN', Extract<JoinPayload, { kind: 'JOIN_REQUEST' }>> {
  return {
    type: 'JOIN',
    senderId,
    timestamp: Date.now(),
    payload: {
      kind: 'JOIN_REQUEST',
      name,
      avatar,
      sessionPlayerId,
    },
  };
}

export function createJoinAckMessage(
  senderId: string,
  accepted: boolean,
  roomCode: string,
  reason?: string,
  assignedId?: string,
  sessionPlayerId?: string
): BaseEnvelope<'JOIN', Extract<JoinPayload, { kind: 'JOIN_ACK' }>> {
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
      sessionPlayerId,
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
  serverTimestamp?: number,
  isReconcile?: boolean
): HeartbeatMessage {
  return {
    type: 'HEARTBEAT',
    senderId,
    timestamp: Date.now(),
    payload: {
      kind,
      clientTimestamp,
      serverTimestamp,
      isReconcile,
    },
  };
}
