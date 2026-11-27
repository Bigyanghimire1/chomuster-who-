import { HintDifficulty } from '../data/wordDatabase';
import { PlayerAvatarId } from './game';

/**
 * Multiplayer room phases.
 * Standard party game lifecycle:
 * LOBBY -> ROLE_REVEAL -> ROUND -> VOTING -> RESULTS -> (LOBBY or next round)
 */
export type OnlinePhase = 'LOBBY' | 'ROLE_REVEAL' | 'ROUND' | 'VOTING' | 'RESULTS';
export type MultiplayerPhase = 'lobby' | 'role_reveal' | 'round' | 'voting' | 'results';

/**
 * Player state within an online room.
 */
export interface OnlinePlayer {
  id: string; // Peer ID / Unique Player Identifier
  name: string;
  avatar: PlayerAvatarId;
  isHost: boolean;
  isReady: boolean;
  isConnected: boolean;
  isSpeaking?: boolean;
  hasSeenRole?: boolean;
  votedForId?: string | null;
  score: number;
  lastSeen?: number; // Timestamp for heartbeat & drop detection
  sessionPlayerId?: string; // Persistent session identifier across page refreshes
}
export type PlayerState = OnlinePlayer;

/**
 * Room configurable settings.
 */
export interface OnlineSettings {
  categoryIds: string[];
  roundDurationSeconds: number; // e.g. 180 (3 min)
  turnDurationSeconds?: number; // 0 (Off), 15, 20, 30
  discussionDurationSeconds?: number; // 30, 45, 60
  votingDurationSeconds: number; // e.g. 60 (1 min)
  hintDifficulty: HintDifficulty; // 'subtle' | 'balanced' | 'easy' | 'none'
  chomuCount: number; // 1, 2, or 3
  clueRounds?: number; // 1, 2, or 3 (default 2)
  soundEnabled?: boolean;
}
export type RoomSettings = OnlineSettings;

/**
 * Secret state delivered strictly to an individual player.
 * Anti-cheat guarantees:
 * - Regular players receive `word` and `category`. `hint` is omitted.
 * - Chomu players receive `hint` (if enabled) and `category`. `word` is strictly omitted.
 */
export interface OnlineSecretState {
  category: string;
  word?: string; // Civilian only; hidden from Chomu until reveal
  isChomu: boolean;
  hint?: string; // Chomu only; hidden from Civilians
  role: 'Civilian' | 'Imposter';
}
export type PlayerSecretPayload = OnlineSecretState;

/**
 * Outcome of the voting phase, published in RESULTS.
 */
export interface OnlineVotingResult {
  chomuIds: string[];
  secretWord: string;
  category: string;
  votes: Record<string, string>; // voterId -> targetPlayerId
  voteCounts: Record<string, number>; // playerId -> count
  mostVotedPlayerIds: string[];
  chomusCaught: boolean;
  hints?: Record<string, string>; // chomuId -> hint
}
export type VotingResults = OnlineVotingResult;

/**
 * Broadcast room state.
 * Anti-cheat guarantees:
 * During LOBBY, ROLE_REVEAL, ROUND, and VOTING, `chomuIds` and `secretWord`
 * are strictly null and NEVER included in peer broadcasts.
 * They are only revealed once phase transitions to RESULTS.
 */
export interface RoomState {
  roomCode: string;
  hostPeerId: string;
  phase: OnlinePhase;
  players: Record<string, OnlinePlayer>;
  settings: OnlineSettings;
  roundNumber: number;
  secretCategory: string | null;
  roundStartTime: number | null;
  roundDurationSeconds: number;
  votingStartTime: number | null;
  votingDurationSeconds: number;
  votingResult: OnlineVotingResult | null;
  winner: 'civilians' | 'chomu' | null;

  // Anti-cheat protected fields:
  // Strictly null during active game, revealed ONLY in 'RESULTS' phase.
  chomuIds: string[] | null;
  secretWord: string | null;

  // Authoritative Spotlight & Turn Fields
  currentTurnPlayerId: string | null;
  currentClueRound?: number;
  totalClueRounds?: number;
  turnOrder: string[];
  turnStartTime: number | null;
  turnDurationSeconds: number;

  // Host migration grace period (null or timestamp when grace period ends)
  hostGracePeriodEnd?: number | null;
}

/**
 * Session storage persistence contract for seamless page refresh recovery.
 * Stored under 'chomu_multiplayer_session' (with 'chomu_session' fallback).
 */
export interface StoredPlayerSession {
  roomCode: string;
  sessionPlayerId: string; // Persistent UUID/token
  playerName: string;
  avatar: PlayerAvatarId;
  savedAt: number;
}

/**
 * Host-only secret state held exclusively in host memory.
 * Never serialized or broadcasted directly to peers.
 */
export interface HostSecretState {
  secretWord: string;
  secretCategory: string;
  chomuIds: string[];
  imposterHints: Record<string, string>;
  playerSecrets: Record<string, OnlineSecretState>;
}

// ============================================================================
// Message Envelopes (JOIN, SYNC, ACTION, CHAT, HEARTBEAT)
// ============================================================================

export type MessageEnvelopeType = 'JOIN' | 'SYNC' | 'ACTION' | 'CHAT' | 'HEARTBEAT';

export interface BaseEnvelope<TType extends MessageEnvelopeType, TPayload> {
  type: TType;
  senderId: string;
  timestamp: number;
  payload: TPayload;
}

// 1. JOIN Envelope
export type JoinPayload =
  | {
      kind: 'JOIN_REQUEST';
      name: string;
      avatar: PlayerAvatarId;
      sessionPlayerId?: string;
    }
  | {
      kind: 'JOIN_ACK';
      accepted: boolean;
      roomCode: string;
      reason?: string;
      assignedId?: string;
      sessionPlayerId?: string;
    };

export type JoinMessage = BaseEnvelope<'JOIN', JoinPayload>;

// 2. SYNC Envelope
export interface SyncPayload {
  roomState: RoomState; // Client-sanitized room state
  privateSecret?: OnlineSecretState; // Individual secret delivered securely to this peer
  seq: number;
}

export type SyncMessage = BaseEnvelope<'SYNC', SyncPayload>;

// 3. ACTION Envelope
export type RoomAction =
  | { type: 'SET_READY'; isReady: boolean }
  | { type: 'START_GAME' }
  | { type: 'ROLE_ACKNOWLEDGED' }
  | { type: 'START_ROUND' }
  | { type: 'START_VOTING' }
  | { type: 'CAST_VOTE'; targetPlayerId: string }
  | { type: 'SKIP_VOTE' }
  | { type: 'END_ROUND' }
  | { type: 'NEXT_ROUND' }
  | { type: 'RESET_LOBBY' }
  | { type: 'UPDATE_SETTINGS'; settings: Partial<OnlineSettings> }
  | { type: 'KICK_PLAYER'; targetPlayerId: string }
  | { type: 'UPDATE_SPEAKING'; isSpeaking: boolean }
  | { type: 'NEXT_TURN' }
  | { type: 'ABORT_ROUND_TO_LOBBY'; reason?: string }
  | { type: 'REVEAL_SECRET_FOR_RESULTS'; secret: OnlineSecretState }
  | { type: 'HOST_LEAVE'; nextHostId?: string };

export type ActionMessage = BaseEnvelope<'ACTION', RoomAction>;

// 4. CHAT Envelope
export interface ChatPayload {
  id: string;
  senderName: string;
  text: string;
  isSystem?: boolean;
}

export type ChatMessage = BaseEnvelope<'CHAT', ChatPayload>;

// 5. HEARTBEAT Envelope
export interface HeartbeatPayload {
  kind: 'PING' | 'PONG';
  clientTimestamp: number;
  serverTimestamp?: number;
  isReconcile?: boolean;
}

export type HeartbeatMessage = BaseEnvelope<'HEARTBEAT', HeartbeatPayload>;

// Discriminated union of all room message envelopes
export type MultiplayerMessage =
  | JoinMessage
  | SyncMessage
  | ActionMessage
  | ChatMessage
  | HeartbeatMessage;
