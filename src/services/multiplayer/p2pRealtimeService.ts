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
  handleCalculateResults,
  handleCastVote,
  handleKickPlayer,
  handleNextRound,
  handlePlayerJoin,
  handlePlayerLeave,
  handleResetLobby,
  handleRoleAcknowledged,
  handleSetReady,
  handleStartGame,
  handleStartRound,
  handleStartVoting,
  handleUpdateSettings,
  sanitizeRoomStateForPeer,
} from './roomProtocol';
import { voiceManager } from '../voice/voiceManager';

export type RealtimeStrategy = 'nostr' | 'torrent';

export interface P2PRealtimeServiceOptions {
  appId?: string;
  strategy?: RealtimeStrategy;
  joinRoomFn?: any;
  categories?: Category[];
  heartbeatIntervalMs?: number;
  peerTimeoutMs?: number;
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
  private isHostPlayer: boolean = false;
  private currentRoomCode: string = '';

  private roomState: RoomState | null = null;
  private secretState: OnlineSecretState | null = null;
  private hostSecretState: HostSecretState | null = null;
  private usedWords: string[] = [];
  private categories: Category[] = DEFAULT_CATEGORIES;

  private syncSeq: number = 0;
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null;
  private peerCheckTimer: ReturnType<typeof setInterval> | null = null;

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
    if (this.roomState) {
      listener(this.roomState, this.secretState);
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
    if (!this.roomState) return;
    for (const listener of this.stateListeners) {
      try {
        listener(this.roomState, this.secretState);
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
    this.hostSecretState = null;
    this.secretState = null;
    this.syncSeq = 0;

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

    await this.initTrysteroRoom(this.currentRoomCode, options);
    this.startHeartbeat(options?.heartbeatIntervalMs || 4000, options?.peerTimeoutMs || 15000);

    // Broadcast JOIN_REQUEST to host
    const joinReq = createJoinRequestMessage(this.myPeerId, this.myName, this.myAvatar);
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

  private setupChannelListeners(): void {
    // 1. JOIN Channel
    if (this.joinChannel) {
      const unsub = this.joinChannel.onMessage((msg, peerId) => {
        const sender = peerId || msg.senderId;
        if (msg.payload.kind === 'JOIN_REQUEST') {
          if (this.isHostPlayer && this.roomState) {
            this.roomState = handlePlayerJoin(
              this.roomState,
              sender,
              msg.payload.name,
              msg.payload.avatar
            );
            // Send ACK
            const ack = createJoinAckMessage(this.myPeerId, true, this.currentRoomCode, undefined, sender);
            this.joinChannel?.send(ack, sender);
            // Broadcast updated state to all peers
            this.broadcastSanitizedSync();
          }
        } else if (msg.payload.kind === 'JOIN_ACK') {
          if (!this.isHostPlayer && msg.payload.accepted) {
            // Acknowledged by host
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
            this.roomState.players[sender].lastSeen = Date.now();
            this.roomState.players[sender].isConnected = true;
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

          if (allVoted && this.hostSecretState) {
            this.roomState = handleCalculateResults(this.roomState, this.hostSecretState);
          }
          this.broadcastSanitizedSync();
        }
        break;
      }

      case 'UPDATE_SPEAKING': {
        if (this.roomState.players[senderId]) {
          this.roomState.players[senderId].isSpeaking = action.isSpeaking;
          this.broadcastSanitizedSync();
        }
        break;
      }

      default:
        break;
    }
  }

  // ==========================================================================
  // Anti-Cheat Host Synchronization Broadcast
  // ==========================================================================

  /**
   * Broadcasts sanitized state individually to every player:
   * - During non-reveal phases, chomuIds and secretWord are stripped.
   * - Regular civilian players receive word, NO hint, and NO chomuIds.
   * - Chomu players receive hint, NO word, and NO other chomuIds.
   */
  public broadcastSanitizedSync(): void {
    if (!this.isHostPlayer || !this.roomState) return;

    this.syncSeq++;

    // 1. Update host's local copy with their own sanitized view
    const hostSanitized = sanitizeRoomStateForPeer(
      this.roomState,
      this.myPeerId,
      this.hostSecretState
    );
    this.roomState = hostSanitized.sanitizedRoomState;
    if (hostSanitized.privateSecret) {
      this.secretState = hostSanitized.privateSecret;
    } else if (this.roomState.phase === 'LOBBY') {
      this.secretState = null;
    }
    this.notifyStateChange();

    // 2. Deliver individual anti-cheat payloads to each connected remote peer
    for (const peerId of Object.keys(this.roomState.players)) {
      if (peerId === this.myPeerId) continue;

      const { sanitizedRoomState, privateSecret } = sanitizeRoomStateForPeer(
        this.roomState,
        peerId,
        this.hostSecretState
      );

      const syncMsg = createSyncMessage(this.myPeerId, sanitizedRoomState, this.syncSeq, privateSecret);
      this.syncChannel?.send(syncMsg, peerId).catch(() => {
        // Peer may have dropped
      });
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

  public startVoting(): void {
    if (!this.isHostPlayer || !this.roomState) return;
    this.roomState = handleStartVoting(this.roomState);
    this.broadcastSanitizedSync();
  }

  public castVote(targetPlayerId: string): void {
    if (this.isHostPlayer && this.roomState) {
      this.roomState = handleCastVote(this.roomState, this.myPeerId, targetPlayerId);
      const connected = Object.values(this.roomState.players).filter(p => p.isConnected);
      const allVoted = connected.length > 0 && connected.every(p => p.votedForId !== null);

      if (allVoted && this.hostSecretState) {
        this.roomState = handleCalculateResults(this.roomState, this.hostSecretState);
      }
      this.broadcastSanitizedSync();
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

  public nextRound(): void {
    if (!this.isHostPlayer || !this.roomState) return;
    this.roomState = handleNextRound(this.roomState);
    this.hostSecretState = null;
    this.secretState = null;
    this.broadcastSanitizedSync();
  }

  public resetLobby(): void {
    if (!this.isHostPlayer || !this.roomState) return;
    this.roomState = handleResetLobby(this.roomState);
    this.hostSecretState = null;
    this.secretState = null;
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
    // Ensure newly connected peer receives local audio stream if mic is active
    try {
      voiceManager.publishLocalStream(peerId);
    } catch {}

    if (this.isHostPlayer && this.roomState) {
      if (!this.roomState.players[peerId]) {
        // Peer will send JOIN_REQUEST
      } else {
        this.roomState.players[peerId].isConnected = true;
        this.roomState.players[peerId].lastSeen = Date.now();
        this.broadcastSanitizedSync();
      }
    } else if (!this.isHostPlayer) {
      // Re-send join request if host reconnected
      const joinReq = createJoinRequestMessage(this.myPeerId, this.myName, this.myAvatar);
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
      // Host disconnected, elect new host if we are next in line
      this.roomState = handlePlayerLeave(this.roomState, peerId);
      if (this.roomState.hostPeerId === this.myPeerId) {
        this.isHostPlayer = true;
        this.broadcastSanitizedSync();
      }
      this.notifyStateChange();
    }
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
    this.secretState = null;
    this.hostSecretState = null;
    this.isHostPlayer = false;
    this.currentRoomCode = '';

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
