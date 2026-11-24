import { joinRoom as joinRoomDefault } from 'trystero';
import { Category, PlayerAvatarId } from '../../types/game';
import {
  ActionMessage,
  ChatMessage,
  ChatPayload,
  HeartbeatMessage,
  HostSecretState,
  JoinMessage,
  OnlineSecretState,
  OnlineSettings,
  RoomAction,
  RoomState,
  SyncMessage,
} from '../../types/multiplayer';
import { DEFAULT_CATEGORIES } from '../../data/categories';
import {
  createActionMessage,
  createChatMessage,
  createHeartbeatMessage,
  createInitialRoomState,
  createJoinAckMessage,
  createJoinRequestMessage,
  createSyncMessage,
  electNextHost,
  findReboundPeerId,
  handleAbortRoundToLobby,
  handleCalculateResults,
  handleCastVote,
  handleKickPlayer,
  handleNextRound,
  handleNextTurn,
  handlePlayerJoin,
  handlePlayerLeave,
  handleResetLobby,
  handleRoleAcknowledged,
  handleSetReady,
  handleStartGame,
  handleStartRound,
  handleStartVoting,
  handleUpdateSettings,
  rebindHostSecretState,
  sanitizeRoomStateForPeer,
} from './roomProtocol';
import { sessionService } from '../storageService';
import { voiceManager } from '../voice/voiceManager';

export type RealtimeStrategy = 'nostr' | 'torrent';

export interface P2PRealtimeServiceOptions {
  appId?: string;
  strategy?: RealtimeStrategy;
  joinRoomFn?: any;
  categories?: Category[];
  heartbeatIntervalMs?: number;
  peerTimeoutMs?: number;
  sessionPlayerId?: string;
  hostGracePeriodMs?: number;
}

export type StateListener = (state: RoomState, secret: OnlineSecretState | null) => void;
export type ChatListener = (message: ChatPayload) => void;
export type ErrorListener = (error: Error) => void;

interface ActionChannel<T> {
  send: (data: T, targetPeerId?: string) => Promise<void>;
  onMessage: (handler: (data: T, peerId: string) => void) => () => void;
}

/**
 * Normalizes trystero action returns across versions (object with send/onMessage or [send, onMessage] tuple).
 */
function normalizeAction<T>(rawAction: any): ActionChannel<T> {
  if (Array.isArray(rawAction)) {
    const [sendFn, onMessageFn] = rawAction;
    return {
      send: async (data: T, targetPeerId?: string) => {
        if (targetPeerId) {
          await sendFn(data, targetPeerId);
        } else {
          await sendFn(data);
        }
      },
      onMessage: (handler: (data: T, peerId: string) => void) => {
        return onMessageFn((data: T, peerIdOrContext: any) => {
          const peerId =
            typeof peerIdOrContext === 'string'
              ? peerIdOrContext
              : peerIdOrContext?.peerId || '';
          handler(data, peerId);
        });
      },
    };
  }

  if (rawAction && typeof rawAction.send === 'function') {
    return {
      send: async (data: T, targetPeerId?: string) => {
        await rawAction.send(data, targetPeerId ? { target: targetPeerId } : undefined);
      },
      onMessage: (handler: (data: T, peerId: string) => void) => {
        return rawAction.onMessage((data: T, context: any) => {
          const peerId = typeof context === 'string' ? context : context?.peerId || '';
          handler(data, peerId);
        });
      },
    };
  }

  throw new Error('Unsupported trystero action channel signature');
}

/**
 * Resolves the appropriate joinRoom implementation (nostr or torrent).
 */
export async function getJoinRoomFunction(strategy: RealtimeStrategy = 'nostr'): Promise<any> {
  if (strategy === 'torrent') {
    try {
      // Dynamic variable import with vite-ignore for optional torrent signaling
      const torrentPath = 'trystero/torrent';
      const torrentModule = await import(/* @vite-ignore */ torrentPath);
      if (torrentModule && typeof torrentModule.joinRoom === 'function') {
        return torrentModule.joinRoom;
      }
    } catch {
      // Fallback cleanly to default (nostr)
    }
  }
  return joinRoomDefault;
}

/**
 * Host-authoritative, peer-to-peer multiplayer room service for Chomu Who?.
 */
export class P2PRealtimeService {
  private room: any = null;
  private myPeerId: string = '';
  private myName: string = '';
  private myAvatar: PlayerAvatarId = 'sleuth';
  private sessionPlayerId: string = '';
  private isHostPlayer: boolean = false;
  private currentRoomCode: string = '';

  private roomState: RoomState | null = null;
  private clientRoomState: RoomState | null = null;
  private secretState: OnlineSecretState | null = null;
  private hostSecretState: HostSecretState | null = null;
  private usedWords: string[] = [];
  private categories: Category[] = DEFAULT_CATEGORIES;

  private syncSeq: number = 0;
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null;
  private peerCheckTimer: ReturnType<typeof setInterval> | null = null;
  private hostGraceTimer: ReturnType<typeof setTimeout> | null = null;
  private hostGracePeriodMs: number = 10000;
  private backoffTimer: ReturnType<typeof setTimeout> | null = null;
  private peerSecretsCollection: Record<string, OnlineSecretState> = {};

  // Channels
  private joinChannel: ActionChannel<JoinMessage> | null = null;
  private syncChannel: ActionChannel<SyncMessage> | null = null;
  private actionChannel: ActionChannel<ActionMessage> | null = null;
  private chatChannel: ActionChannel<ChatMessage> | null = null;
  private heartbeatChannel: ActionChannel<HeartbeatMessage> | null = null;

  // Listeners
  private stateListeners: Set<StateListener> = new Set();
  private chatListeners: Set<ChatListener> = new Set();
  private errorListeners: Set<ErrorListener> = new Set();
  private unsubscribers: Array<() => void> = [];

  constructor() {
    this.myPeerId = this.generatePeerId();
    this.sessionPlayerId = sessionService.getOrCreateSessionPlayerId();
  }

  private generatePeerId(): string {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID().slice(0, 8);
    }
    return Math.random().toString(36).substring(2, 10);
  }

  // ==========================================================================
  // Public Accessors
  // ==========================================================================

  public getState(): RoomState | null {
    if (this.isHostPlayer && this.clientRoomState) {
      return this.clientRoomState;
    }
    return this.roomState;
  }

  public getSecret(): OnlineSecretState | null {
    return this.secretState;
  }

  public getMyPeerId(): string {
    return this.myPeerId;
  }

  public isHost(): boolean {
    return this.isHostPlayer;
  }

  public isConnected(): boolean {
    return this.room !== null && this.roomState !== null;
  }

  public getRoomCode(): string {
    return this.currentRoomCode;
  }

  // ==========================================================================
  // Subscriptions
  // ==========================================================================

  public subscribe(listener: StateListener): () => void {
    this.stateListeners.add(listener);
    const stateToPublish = this.isHostPlayer && this.clientRoomState ? this.clientRoomState : this.roomState;
    if (stateToPublish) {
      listener(stateToPublish, this.secretState);
    }
    return () => this.stateListeners.delete(listener);
  }

  public onChat(listener: ChatListener): () => void {
    this.chatListeners.add(listener);
    return () => this.chatListeners.delete(listener);
  }

  public onError(listener: ErrorListener): () => void {
    this.errorListeners.add(listener);
    return () => this.errorListeners.delete(listener);
  }

  private notifyStateChange(): void {
    const stateToPublish = this.isHostPlayer && this.clientRoomState ? this.clientRoomState : this.roomState;
    if (!stateToPublish) return;
    for (const listener of this.stateListeners) {
      try {
        listener(stateToPublish, this.secretState);
      } catch (err) {
        console.error('Error in room state listener:', err);
      }
    }
  }

  private notifyChat(msg: ChatPayload): void {
    for (const listener of this.chatListeners) {
      try {
        listener(msg);
      } catch (err) {
        console.error('Error in chat listener:', err);
      }
    }
  }

  private notifyError(err: Error): void {
    for (const listener of this.errorListeners) {
      try {
        listener(err);
      } catch (e) {
        console.error('Error in error listener:', e);
      }
    }
  }

  // ==========================================================================
  // Room Creation & Joining
  // ==========================================================================

  public async createRoom(
    roomCode: string,
    playerName: string,
    avatar: PlayerAvatarId = 'sleuth',
    options?: P2PRealtimeServiceOptions
  ): Promise<void> {
    await this.leaveRoom();

    this.isHostPlayer = true;
    this.currentRoomCode = roomCode.toUpperCase();
    this.myName = playerName;
    this.myAvatar = avatar;
    this.sessionPlayerId = options?.sessionPlayerId || sessionService.getOrCreateSessionPlayerId();
    if (options?.hostGracePeriodMs !== undefined) {
      this.hostGracePeriodMs = options.hostGracePeriodMs;
    }
    if (options?.hostGracePeriodMs !== undefined) {
      this.hostGracePeriodMs = options.hostGracePeriodMs;
    }
    if (options?.categories) {
      this.categories = options.categories;
    }

    // Initialize host authoritative state
    this.roomState = createInitialRoomState(
      this.currentRoomCode,
      this.myPeerId,
      this.myName,
      this.myAvatar
    );
    if (this.roomState.players[this.myPeerId]) {
      this.roomState.players[this.myPeerId].sessionPlayerId = this.sessionPlayerId;
    }
    this.clientRoomState = null;
    this.hostSecretState = null;
    this.secretState = null;
    this.syncSeq = 0;

    // Persist session
    sessionService.saveSession({
      roomCode: this.currentRoomCode,
      sessionPlayerId: this.sessionPlayerId,
      playerName: this.myName,
      avatar: this.myAvatar,
      savedAt: Date.now(),
    });

    await this.initTrysteroRoom(this.currentRoomCode, options);
    this.startHeartbeat(options?.heartbeatIntervalMs || 4000, options?.peerTimeoutMs || 15000);
    this.notifyStateChange();
  }

  public async joinRoom(
    roomCode: string,
    playerName: string,
    avatar: PlayerAvatarId = 'sleuth',
    options?: P2PRealtimeServiceOptions
  ): Promise<void> {
    await this.leaveRoom();

    this.isHostPlayer = false;
    this.currentRoomCode = roomCode.toUpperCase();
    this.myName = playerName;
    this.myAvatar = avatar;
    this.sessionPlayerId = options?.sessionPlayerId || sessionService.getOrCreateSessionPlayerId();
    if (options?.hostGracePeriodMs !== undefined) {
      this.hostGracePeriodMs = options.hostGracePeriodMs;
    }

    // Persist session
    sessionService.saveSession({
      roomCode: this.currentRoomCode,
      sessionPlayerId: this.sessionPlayerId,
      playerName: this.myName,
      avatar: this.myAvatar,
      savedAt: Date.now(),
    });

    await this.initTrysteroRoom(this.currentRoomCode, options);
    this.startHeartbeat(options?.heartbeatIntervalMs || 4000, options?.peerTimeoutMs || 15000);

    // Broadcast JOIN_REQUEST to host with persistent sessionPlayerId
    const joinReq = createJoinRequestMessage(
      this.myPeerId,
      this.myName,
      this.myAvatar,
      this.sessionPlayerId
    );
    await this.joinChannel?.send(joinReq);
  }

  private async initTrysteroRoom(
    roomCode: string,
    options?: P2PRealtimeServiceOptions
  ): Promise<void> {
    const appId = options?.appId || 'chomu-who-party-v1';
    const joinFn = options?.joinRoomFn || (await getJoinRoomFunction(options?.strategy || 'nostr'));

    try {
      this.room = joinFn({ appId }, roomCode);
    } catch (err: any) {
      this.notifyError(new Error(`Failed to join WebRTC room: ${err.message}`));
      throw err;
    }

    // Initialize action channels
    this.joinChannel = normalizeAction<JoinMessage>(this.room.makeAction('room_join'));
    this.syncChannel = normalizeAction<SyncMessage>(this.room.makeAction('room_sync'));
    this.actionChannel = normalizeAction<ActionMessage>(this.room.makeAction('room_action'));
    this.chatChannel = normalizeAction<ChatMessage>(this.room.makeAction('room_chat'));
    this.heartbeatChannel = normalizeAction<HeartbeatMessage>(this.room.makeAction('room_hb'));

    // Register handlers
    this.setupChannelListeners();

    // Register browser lifecycle & network listeners
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', this.handleVisibilityChange);
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('online', this.handleNetworkOnline);
      window.addEventListener('offline', this.handleNetworkOffline);
    }

    // Trystero peer lifecycle events
    if (this.room.onPeerJoin) {
      const unsub = this.room.onPeerJoin((peer: any) => {
        const peerId = typeof peer === 'string' ? peer : peer?.peerId || '';
        this.handlePeerConnect(peerId);
      });
      this.unsubscribers.push(unsub);
    }

    if (this.room.onPeerLeave) {
      const unsub = this.room.onPeerLeave((peer: any) => {
        const peerId = typeof peer === 'string' ? peer : peer?.peerId || '';
        this.handlePeerDisconnect(peerId);
      });
      this.unsubscribers.push(unsub);
    }

    // Attach voice manager to the WebRTC room for peer audio stream exchange
    if (this.room) {
      try {
        voiceManager.attachRoom(this.room);
      } catch (err) {
        console.warn('[P2PRealtimeService] Failed to attach room to voiceManager:', err);
      }
    }
  }

  private handleVisibilityChange = (): void => {
    if (typeof document === 'undefined') return;
    if (document.visibilityState === 'visible') {
      this.reconcileStateWithHost();
    }
  };

  private handleNetworkOnline = (): void => {
    this.reconcileStateWithHost();
  };

  private handleNetworkOffline = (): void => {
    // Network dropped temporarily
  };

  public reconcileStateWithHost(): void {
    if (!this.roomState || !this.currentRoomCode) return;

    if (this.isHostPlayer) {
      this.broadcastSanitizedSync();
      const ping = createHeartbeatMessage(this.myPeerId, 'PING', Date.now(), undefined, true);
      this.heartbeatChannel?.send(ping);
    } else {
      const hostId = this.roomState.hostPeerId;
      const ping = createHeartbeatMessage(this.myPeerId, 'PING', Date.now(), undefined, true);
      this.heartbeatChannel?.send(ping, hostId);

      if (this.backoffTimer) {
        clearTimeout(this.backoffTimer);
      }
      this.scheduleBackoffReconciliation(0);
    }
  }

  private scheduleBackoffReconciliation(attempt: number): void {
    if (attempt >= 4 || !this.roomState || this.isHostPlayer) return;
    const delays = [1000, 2000, 4000, 8000];
    const baseDelay = delays[attempt] || 8000;
    const jitter = (Math.random() - 0.5) * 0.4 * baseDelay;
    const delay = Math.max(500, Math.round(baseDelay + jitter));

    this.backoffTimer = setTimeout(() => {
      if (this.roomState && !this.isHostPlayer) {
        const ping = createHeartbeatMessage(this.myPeerId, 'PING', Date.now(), undefined, true);
        this.heartbeatChannel?.send(ping, this.roomState.hostPeerId);
        if (!this.roomState.players[this.myPeerId]?.isConnected) {
          const joinReq = createJoinRequestMessage(
            this.myPeerId,
            this.myName,
            this.myAvatar,
            this.sessionPlayerId
          );
          this.joinChannel?.send(joinReq, this.roomState.hostPeerId);
        }
        this.scheduleBackoffReconciliation(attempt + 1);
      }
    }, delay);
  }

  private setupChannelListeners(): void {
    // 1. JOIN Channel
    if (this.joinChannel) {
      const unsub = this.joinChannel.onMessage((msg, peerId) => {
        const sender = peerId || msg.senderId;
        if (msg.payload.kind === 'JOIN_REQUEST') {
          if (this.isHostPlayer && this.roomState) {
            const incomingSessionId = msg.payload.sessionPlayerId;
            const reboundOldPeerId = findReboundPeerId(
              this.roomState.players,
              incomingSessionId,
              msg.payload.name
            );

            this.roomState = handlePlayerJoin(
              this.roomState,
              sender,
              msg.payload.name,
              msg.payload.avatar,
              incomingSessionId
            );

            // Rebind host secret state if a rebound occurred
            if (this.hostSecretState && reboundOldPeerId && reboundOldPeerId !== sender) {
              this.hostSecretState = rebindHostSecretState(
                this.hostSecretState,
                reboundOldPeerId,
                sender
              );
              sessionService.saveHostSecrets(this.currentRoomCode, this.hostSecretState);
            }

            // Send ACK
            const ack = createJoinAckMessage(
              this.myPeerId,
              true,
              this.currentRoomCode,
              undefined,
              sender,
              incomingSessionId
            );
            this.joinChannel?.send(ack, sender);

            // Broadcast updated state to all peers
            this.broadcastSanitizedSync();
          }
        } else if (msg.payload.kind === 'JOIN_ACK') {
          if (!this.isHostPlayer && msg.payload.accepted) {
            if (this.backoffTimer) {
              clearTimeout(this.backoffTimer);
              this.backoffTimer = null;
            }
          }
        }
      });
      this.unsubscribers.push(unsub);
    }

    // 2. SYNC Channel (Anti-Cheat Payload Receiver)
    if (this.syncChannel) {
      const unsub = this.syncChannel.onMessage(msg => {
        if (this.isHostPlayer) return; // Host is authoritative source of truth

        if (msg.payload.seq >= this.syncSeq) {
          this.syncSeq = msg.payload.seq;
          this.roomState = msg.payload.roomState;

          // Receive personal secret (if supplied in targeted sync)
          if (msg.payload.privateSecret) {
            this.secretState = msg.payload.privateSecret;
          }

          // If room transitioned back to LOBBY, clear active secret
          if (this.roomState.phase === 'LOBBY') {
            this.secretState = null;
          }

          // If host was in grace period and sync arrives, clear grace timer
          if (this.hostGraceTimer) {
            clearTimeout(this.hostGraceTimer);
            this.hostGraceTimer = null;
          }

          // Clear backoff timer
          if (this.backoffTimer) {
            clearTimeout(this.backoffTimer);
            this.backoffTimer = null;
          }

          this.notifyStateChange();
        }
      });
      this.unsubscribers.push(unsub);
    }

    // 3. ACTION Channel
    if (this.actionChannel) {
      const unsub = this.actionChannel.onMessage((msg, peerId) => {
        const sender = peerId || msg.senderId;
        this.handleIncomingAction(msg.payload, sender);
      });
      this.unsubscribers.push(unsub);
    }

    // 4. CHAT Channel
    if (this.chatChannel) {
      const unsub = this.chatChannel.onMessage(msg => {
        this.notifyChat(msg.payload);
      });
      this.unsubscribers.push(unsub);
    }

    // 5. HEARTBEAT Channel
    if (this.heartbeatChannel) {
      const unsub = this.heartbeatChannel.onMessage((msg, peerId) => {
        const sender = peerId || msg.senderId;
        if (msg.payload.kind === 'PING') {
          const pong = createHeartbeatMessage(
            this.myPeerId,
            'PONG',
            msg.payload.clientTimestamp,
            Date.now()
          );
          this.heartbeatChannel?.send(pong, sender);
          if (this.isHostPlayer && this.roomState && this.roomState.players[sender]) {
            const wasDisconnected = !this.roomState.players[sender].isConnected;
            this.roomState.players[sender].lastSeen = Date.now();
            this.roomState.players[sender].isConnected = true;
            if (wasDisconnected || msg.payload.isReconcile) {
              this.broadcastSanitizedSync();
            }
          }
        } else if (msg.payload.kind === 'PONG') {
          if (this.isHostPlayer && this.roomState && this.roomState.players[sender]) {
            this.roomState.players[sender].lastSeen = Date.now();
            this.roomState.players[sender].isConnected = true;
          }
        }
      });
      this.unsubscribers.push(unsub);
    }
  }

  // ==========================================================================
  // Host Authoritative Action Handler
  // ==========================================================================

  private handleIncomingAction(action: RoomAction, senderId: string): void {
    if (!this.isHostPlayer || !this.roomState) return;

    // Authoritative verification for host-exclusive actions
    const hostExclusiveTypes = [
      'START_GAME',
      'START_ROUND',
      'START_VOTING',
      'NEXT_ROUND',
      'RESET_LOBBY',
      'UPDATE_SETTINGS',
      'KICK_PLAYER',
      'NEXT_TURN',
      'ABORT_ROUND_TO_LOBBY',
    ];
    if (hostExclusiveTypes.includes(action.type) && senderId !== this.roomState.hostPeerId) {
      return;
    }

    switch (action.type) {
      case 'SET_READY': {
        this.roomState = handleSetReady(this.roomState, senderId, action.isReady);
        this.broadcastSanitizedSync();
        break;
      }

      case 'ROLE_ACKNOWLEDGED': {
        this.roomState = handleRoleAcknowledged(this.roomState, senderId);
        this.broadcastSanitizedSync();
        break;
      }

      case 'CAST_VOTE': {
        if (this.roomState.phase === 'VOTING') {
          this.roomState = handleCastVote(this.roomState, senderId, action.targetPlayerId);

          // Check if all connected players have voted
          const connected = Object.values(this.roomState.players).filter(p => p.isConnected);
          const allVoted = connected.length > 0 && connected.every(p => p.votedForId !== null);

          if (allVoted) {
            this.concludeVoting();
          } else {
            this.broadcastSanitizedSync();
          }
        }
        break;
      }

      case 'NEXT_TURN': {
        if (this.roomState.phase === 'ROUND') {
          this.roomState = handleNextTurn(this.roomState);
          this.broadcastSanitizedSync();
        }
        break;
      }

      case 'ABORT_ROUND_TO_LOBBY': {
        this.roomState = handleAbortRoundToLobby(this.roomState, action.reason);
        this.broadcastSanitizedSync();
        break;
      }

      case 'UPDATE_SPEAKING': {
        if (this.roomState.players[senderId]) {
          this.roomState.players[senderId].isSpeaking = action.isSpeaking;
          this.broadcastSanitizedSync();
        }
        break;
      }

      case 'REVEAL_SECRET_FOR_RESULTS': {
        if (action.secret) {
          this.peerSecretsCollection[senderId] = action.secret;
          if (this.roomState.phase === 'VOTING') {
            this.reconstructAndCalculateResults();
          }
        }
        break;
      }

      case 'HOST_LEAVE': {
        if (this.hostGraceTimer) {
          clearTimeout(this.hostGraceTimer);
          this.hostGraceTimer = null;
        }
        this.executeHostMigration(senderId);
        break;
      }

      default:
        break;
    }
  }

  // ==========================================================================
  // Anti-Cheat Host Synchronization Broadcast
  // ==========================================================================

  public broadcastSanitizedSync(): void {
    if (!this.isHostPlayer || !this.roomState) return;

    this.syncSeq++;

    // Unmutated authoritative state
    const authoritativeState = this.roomState;

    // 1. Update host local sanitized copy for UI
    const hostSanitized = sanitizeRoomStateForPeer(
      authoritativeState,
      this.myPeerId,
      this.hostSecretState
    );
    this.clientRoomState = hostSanitized.sanitizedRoomState;
    if (hostSanitized.privateSecret) {
      this.secretState = hostSanitized.privateSecret;
    } else if (authoritativeState.phase === 'LOBBY') {
      this.secretState = null;
    }
    this.notifyStateChange();

    // 2. Deliver individual anti-cheat payloads to each connected remote peer
    for (const peerId of Object.keys(authoritativeState.players)) {
      if (peerId === this.myPeerId) continue;

      const { sanitizedRoomState, privateSecret } = sanitizeRoomStateForPeer(
        authoritativeState,
        peerId,
        this.hostSecretState
      );

      const syncMsg = createSyncMessage(this.myPeerId, sanitizedRoomState, this.syncSeq, privateSecret);
      this.syncChannel?.send(syncMsg, peerId).catch(() => {});
    }
  }

  // ==========================================================================
  // Player & Host Public Actions
  // ==========================================================================

  public setReady(isReady: boolean): void {
    if (this.isHostPlayer && this.roomState) {
      this.roomState = handleSetReady(this.roomState, this.myPeerId, isReady);
      this.broadcastSanitizedSync();
    } else {
      const action = createActionMessage(this.myPeerId, { type: 'SET_READY', isReady });
      this.actionChannel?.send(action);
    }
  }

  public startGame(): void {
    if (!this.isHostPlayer || !this.roomState) return;

    try {
      const { nextState, hostSecretState, updatedUsedWords } = handleStartGame(
        this.roomState,
        this.categories,
        this.usedWords
      );

      this.roomState = nextState;
      this.hostSecretState = hostSecretState;
      this.usedWords = updatedUsedWords;
      sessionService.saveHostSecrets(this.currentRoomCode, this.hostSecretState);

      this.broadcastSanitizedSync();
    } catch (err: any) {
      this.notifyError(err);
    }
  }

  public confirmRole(): void {
    if (this.isHostPlayer && this.roomState) {
      this.roomState = handleRoleAcknowledged(this.roomState, this.myPeerId);
      this.broadcastSanitizedSync();
    } else {
      const action = createActionMessage(this.myPeerId, { type: 'ROLE_ACKNOWLEDGED' });
      this.actionChannel?.send(action);
    }
  }

  public startRound(): void {
    if (!this.isHostPlayer || !this.roomState) return;
    this.roomState = handleStartRound(this.roomState);
    this.broadcastSanitizedSync();
  }

  public nextTurn(): void {
    if (this.isHostPlayer && this.roomState) {
      this.roomState = handleNextTurn(this.roomState);
      this.broadcastSanitizedSync();
    } else {
      const action = createActionMessage(this.myPeerId, { type: 'NEXT_TURN' });
      this.actionChannel?.send(action);
    }
  }

  public startVoting(): void {
    if (!this.isHostPlayer || !this.roomState) return;
    this.roomState = handleStartVoting(this.roomState);
    this.broadcastSanitizedSync();
  }

  public castVote(targetPlayerId: string): void {
    if (this.isHostPlayer && this.roomState) {
      if (this.roomState.phase === 'VOTING') {
        this.roomState = handleCastVote(this.roomState, this.myPeerId, targetPlayerId);
        const connected = Object.values(this.roomState.players).filter(p => p.isConnected);
        const allVoted = connected.length > 0 && connected.every(p => p.votedForId !== null);

        if (allVoted) {
          this.concludeVoting();
        } else {
          this.broadcastSanitizedSync();
        }
      }
    } else {
      const action = createActionMessage(this.myPeerId, {
        type: 'CAST_VOTE',
        targetPlayerId,
      });
      this.actionChannel?.send(action);
    }
  }

  public endRound(): void {
    this.startVoting();
  }

  public concludeVoting(): void {
    if (!this.isHostPlayer || !this.roomState || this.roomState.phase !== 'VOTING') return;

    if (this.hostSecretState) {
      this.roomState = handleCalculateResults(this.roomState, this.hostSecretState);
      this.broadcastSanitizedSync();
      return;
    }

    this.reconstructAndCalculateResults();
  }

  private solicitPeerSecrets(): void {
    if (this.secretState) {
      this.peerSecretsCollection[this.myPeerId] = this.secretState;
    }
    if (this.secretState) {
      const action = createActionMessage(this.myPeerId, {
        type: 'REVEAL_SECRET_FOR_RESULTS',
        secret: this.secretState,
      });
      this.actionChannel?.send(action);
    }
  }

  private reconstructAndCalculateResults(): void {
    if (!this.isHostPlayer || !this.roomState) return;

    if (this.secretState) {
      this.peerSecretsCollection[this.myPeerId] = this.secretState;
    }

    let secretWord: string | null = null;
    let secretCategory = this.roomState.secretCategory || 'General';
    const chomuIds: string[] = [];
    const imposterHints: Record<string, string> = {};

    for (const [pId, secret] of Object.entries(this.peerSecretsCollection)) {
      if (secret.isChomu) {
        if (!chomuIds.includes(pId)) chomuIds.push(pId);
        if (secret.hint) imposterHints[pId] = secret.hint;
      } else {
        if (secret.word) secretWord = secret.word;
        if (secret.category) secretCategory = secret.category;
      }
    }

    if (secretWord) {
      this.hostSecretState = {
        secretWord,
        secretCategory,
        chomuIds,
        imposterHints,
        playerSecrets: { ...this.peerSecretsCollection },
      };
      sessionService.saveHostSecrets(this.currentRoomCode, this.hostSecretState);
      this.roomState = handleCalculateResults(this.roomState, this.hostSecretState);
      this.broadcastSanitizedSync();
    } else {
      this.solicitPeerSecrets();
      const connected = Object.values(this.roomState.players).filter(p => p.isConnected);
      const allReported = connected.every(p => this.peerSecretsCollection[p.id]);
      if (allReported && !secretWord) {
        this.roomState = handleAbortRoundToLobby(
          this.roomState,
          'Unable to verify secret word after host migration.'
        );
        this.broadcastSanitizedSync();
      }
    }
  }

  public nextRound(): void {
    if (!this.isHostPlayer || !this.roomState) return;
    this.roomState = handleNextRound(this.roomState);
    this.hostSecretState = null;
    this.secretState = null;
    this.peerSecretsCollection = {};
    sessionService.clearHostSecrets();
    this.broadcastSanitizedSync();
  }

  public resetLobby(): void {
    if (!this.isHostPlayer || !this.roomState) return;
    this.roomState = handleResetLobby(this.roomState);
    this.hostSecretState = null;
    this.secretState = null;
    this.peerSecretsCollection = {};
    sessionService.clearHostSecrets();
    this.broadcastSanitizedSync();
  }

  public abortRoundToLobby(reason?: string): void {
    if (!this.isHostPlayer || !this.roomState) return;
    this.roomState = handleAbortRoundToLobby(this.roomState, reason);
    this.hostSecretState = null;
    this.secretState = null;
    this.peerSecretsCollection = {};
    sessionService.clearHostSecrets();
    this.broadcastSanitizedSync();
  }

  public updateSettings(settings: Partial<OnlineSettings>): void {
    if (!this.isHostPlayer || !this.roomState) return;
    this.roomState = handleUpdateSettings(this.roomState, settings);
    this.broadcastSanitizedSync();
  }

  public kickPlayer(targetPlayerId: string): void {
    if (!this.isHostPlayer || !this.roomState) return;
    this.roomState = handleKickPlayer(this.roomState, targetPlayerId);
    this.broadcastSanitizedSync();
  }

  public updateSpeaking(isSpeaking: boolean): void {
    if (this.isHostPlayer && this.roomState && this.roomState.players[this.myPeerId]) {
      this.roomState.players[this.myPeerId].isSpeaking = isSpeaking;
      this.broadcastSanitizedSync();
    } else {
      const action = createActionMessage(this.myPeerId, {
        type: 'UPDATE_SPEAKING',
        isSpeaking,
      });
      this.actionChannel?.send(action);
    }
  }

  public sendChat(text: string): void {
    if (!text || !text.trim()) return;
    const msg = createChatMessage(this.myPeerId, this.myName, text.trim());
    this.chatChannel?.send(msg);
    this.notifyChat(msg.payload);
  }

  // ==========================================================================
  // Peer Lifecycle & Heartbeat
  // ==========================================================================

  private handlePeerConnect(peerId: string): void {
    try {
      voiceManager.publishLocalStream(peerId);
    } catch {}

    // If host was in grace period and reconnects, cancel grace period
    if (this.roomState && peerId === this.roomState.hostPeerId && this.hostGraceTimer) {
      clearTimeout(this.hostGraceTimer);
      this.hostGraceTimer = null;
      this.roomState.hostGracePeriodEnd = null;
      if (this.roomState.players[peerId]) {
        this.roomState.players[peerId].isConnected = true;
        this.roomState.players[peerId].lastSeen = Date.now();
      }
      this.notifyStateChange();
    }

    if (this.isHostPlayer && this.roomState) {
      if (!this.roomState.players[peerId]) {
        // Peer will send JOIN_REQUEST
      } else {
        this.roomState.players[peerId].isConnected = true;
        this.roomState.players[peerId].lastSeen = Date.now();
        this.broadcastSanitizedSync();
      }
    } else if (!this.isHostPlayer) {
      const joinReq = createJoinRequestMessage(
        this.myPeerId,
        this.myName,
        this.myAvatar,
        this.sessionPlayerId
      );
      this.joinChannel?.send(joinReq, peerId);
    }
  }

  private handlePeerDisconnect(peerId: string): void {
    try {
      voiceManager.removeRemoteStream(peerId);
    } catch {}

    if (this.isHostPlayer && this.roomState) {
      this.roomState = handlePlayerLeave(this.roomState, peerId);
      this.broadcastSanitizedSync();
    } else if (this.roomState && peerId === this.roomState.hostPeerId) {
      if (this.hostGracePeriodMs <= 0) {
        this.executeHostMigration(peerId);
      } else {
        if (this.roomState.players[peerId]) {
          this.roomState.players[peerId].isConnected = false;
          this.roomState.players[peerId].lastSeen = Date.now();
        }
        this.roomState.hostGracePeriodEnd = Date.now() + this.hostGracePeriodMs;
        this.notifyStateChange();

        if (this.hostGraceTimer) {
          clearTimeout(this.hostGraceTimer);
        }
        this.hostGraceTimer = setTimeout(() => {
          this.executeHostMigration(peerId);
        }, this.hostGracePeriodMs);
      }
    }
  }

  private executeHostMigration(oldHostPeerId: string): void {
    this.hostGraceTimer = null;
    if (!this.roomState) return;

    this.roomState.hostGracePeriodEnd = null;
    this.roomState = handlePlayerLeave(this.roomState, oldHostPeerId);

    if (this.roomState.hostPeerId === this.myPeerId) {
      this.isHostPlayer = true;
      this.startHeartbeat(4000, 15000);

      // Restore host secrets from sessionStorage if available
      const cached = sessionService.loadHostSecrets(this.currentRoomCode);
      if (cached) {
        this.hostSecretState = cached;
      }

      // If active round and secret is missing:
      if (
        (this.roomState.phase === 'ROUND' || this.roomState.phase === 'VOTING') &&
        !this.hostSecretState
      ) {
        const connectedCount = Object.values(this.roomState.players).filter(p => p.isConnected).length;
        if (connectedCount < 3) {
          this.roomState = handleAbortRoundToLobby(
            this.roomState,
            'Host disconnected and insufficient players remain.'
          );
        } else {
          this.solicitPeerSecrets();
        }
      }

      this.broadcastSanitizedSync();
    }
    this.notifyStateChange();
  }

  private startHeartbeat(intervalMs: number, timeoutMs: number): void {
    this.stopHeartbeat();

    this.heartbeatTimer = setInterval(() => {
      const ping = createHeartbeatMessage(this.myPeerId, 'PING', Date.now());
      this.heartbeatChannel?.send(ping);
    }, intervalMs);

    if (this.isHostPlayer) {
      this.peerCheckTimer = setInterval(() => {
        if (!this.roomState) return;
        const now = Date.now();
        let stateChanged = false;

        for (const [id, player] of Object.entries(this.roomState.players)) {
          if (id === this.myPeerId) continue;
          if (player.isConnected && player.lastSeen && now - player.lastSeen > timeoutMs) {
            player.isConnected = false;
            stateChanged = true;
          }
        }

        if (stateChanged) {
          this.broadcastSanitizedSync();
        }
      }, intervalMs * 2);
    }
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
    if (this.peerCheckTimer) {
      clearInterval(this.peerCheckTimer);
      this.peerCheckTimer = null;
    }
  }

  // ==========================================================================
  // Teardown
  // ==========================================================================

  public async leaveRoom(): Promise<void> {
    this.stopHeartbeat();

    if (this.hostGraceTimer) {
      clearTimeout(this.hostGraceTimer);
      this.hostGraceTimer = null;
    }
    if (this.backoffTimer) {
      clearTimeout(this.backoffTimer);
      this.backoffTimer = null;
    }

    if (this.isHostPlayer && this.roomState && this.actionChannel) {
      try {
        const nextHostId = electNextHost(this.roomState.players, this.myPeerId);
        const action = createActionMessage(this.myPeerId, {
          type: 'HOST_LEAVE',
          nextHostId: nextHostId || undefined,
        });
        await this.actionChannel.send(action);
      } catch {
        // Ignore send errors during teardown
      }
    }

    if (typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    }
    if (typeof window !== 'undefined') {
      window.removeEventListener('online', this.handleNetworkOnline);
      window.removeEventListener('offline', this.handleNetworkOffline);
    }

    try {
      voiceManager.detachRoom();
    } catch {
      // Ignore detach errors
    }

    for (const unsub of this.unsubscribers) {
      try {
        unsub();
      } catch {
        // Ignore unsubscribe errors
      }
    }
    this.unsubscribers = [];

    if (this.room) {
      try {
        if (typeof this.room.leave === 'function') {
          await this.room.leave();
        }
      } catch {
        // Ignore leave errors
      }
      this.room = null;
    }

    this.joinChannel = null;
    this.syncChannel = null;
    this.actionChannel = null;
    this.chatChannel = null;
    this.heartbeatChannel = null;

    this.roomState = null;
    this.clientRoomState = null;
    this.secretState = null;
    this.hostSecretState = null;
    this.peerSecretsCollection = {};
    this.isHostPlayer = false;
    this.currentRoomCode = '';

    sessionService.clearSession();
    sessionService.clearHostSecrets();

    this.notifyStateChange();
  }

  /**
   * Returns current active Trystero room instance (if connected).
   */
  public getRoom(): any {
    return this.room;
  }
}

// Global Singleton Export
export const p2pRealtimeService = new P2PRealtimeService();
