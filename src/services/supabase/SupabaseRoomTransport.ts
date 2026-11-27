import type { RealtimeChannel, SupabaseClient } from '@supabase/supabase-js';
import type { PlayerAvatarId } from '../../types/game';
import type {
  ChatPayload,
  OnlinePhase,
  OnlinePlayer,
  OnlineSecretState,
  OnlineSettings,
  OnlineVotingResult,
  RoomState,
} from '../../types/multiplayer';
import {
  BackendError,
  ensureAnonymousSession,
  getSupabaseClient,
  invokeEdgeFunction,
} from './supabaseClient';

const SESSION_STORAGE_KEY = 'chomu_supabase_session';

export interface StoredSupabaseSession {
  roomId: string;
  roomCode: string;
  rejoinToken: string;
  playerName: string;
  avatar: PlayerAvatarId;
}

interface RawRoomRow {
  id: string;
  code: string;
  host_user_id: string;
  phase: string;
  settings: Record<string, unknown> | null;
  round_number: number;
  secret_category: string | null;
  turn_order: string[] | null;
  current_turn_index: number | null;
  phase_deadline_at: string | null;
  runoff_candidate_ids: string[] | null;
  voting_result: OnlineVotingResult | null;
  winner: 'civilians' | 'chomu' | null;
  secret_word: string | null;
  chomu_ids: string[] | null;
  state_version?: number;
  updated_at?: string;
}

interface RawPlayerRow {
  id: string;
  room_id: string;
  user_id: string;
  display_name: string;
  avatar_id: string;
  is_host: boolean;
  is_ready: boolean;
  is_connected: boolean;
  score: number;
  has_seen_role: boolean;
  has_voted: boolean;
  last_seen_at?: string;
}

interface RawSecretRow {
  id?: string;
  room_id?: string;
  user_id?: string;
  round_number?: number;
  is_chomu: boolean;
  role: 'Civilian' | 'Imposter';
  secret_word: string | null;
  hint: string | null;
}

interface RawChatRow {
  id: string;
  room_id: string;
  user_id: string | null;
  sender_name: string;
  message: string;
  is_system: boolean;
  created_at?: string;
}

interface CreateRoomResponse {
  room: RawRoomRow;
  player: RawPlayerRow;
  rejoinToken: string;
}

interface JoinRoomResponse {
  room: RawRoomRow;
  player: RawPlayerRow;
  players?: RawPlayerRow[];
  rejoinToken: string;
}

interface RejoinRoomResponse {
  room: RawRoomRow;
  player: RawPlayerRow;
  players: RawPlayerRow[];
  mySecret: RawSecretRow | null;
  rejoinToken: string;
}

export interface SupabaseRoomTransportDeps {
  getClient?: () => SupabaseClient;
  ensureSession?: (client?: SupabaseClient) => Promise<string>;
  invokeFn?: <T>(
    fnName: string,
    body: Record<string, unknown>,
    client?: SupabaseClient,
  ) => Promise<T>;
  storage?: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'> | null;
}

type StateListener = (state: RoomState | null, secret: OnlineSecretState | null) => void;
type ChatListener = (msg: ChatPayload) => void;
type ErrorListener = (err: Error) => void;

function mapOnlinePhase(rawPhase: string): OnlinePhase {
  switch (rawPhase) {
    case 'DISCUSSION':
      return 'ROUND';
    case 'VOTING_RUNOFF':
      return 'VOTING';
    case 'LOBBY':
    case 'ROLE_REVEAL':
    case 'ROUND':
    case 'VOTING':
    case 'RESULTS':
      return rawPhase;
    default:
      return 'LOBBY';
  }
}

function mapSettings(raw: Record<string, unknown> | null): OnlineSettings {
  const s = raw ?? {};
  const turnDurationSeconds = typeof s.turnDurationSeconds === 'number' ? s.turnDurationSeconds : 20;
  const discussionDurationSeconds =
    typeof s.discussionDurationSeconds === 'number' ? s.discussionDurationSeconds : 45;
  return {
    categoryIds: Array.isArray(s.categoryIds) ? (s.categoryIds as string[]) : [],
    roundDurationSeconds:
      typeof s.roundDurationSeconds === 'number'
        ? s.roundDurationSeconds
        : discussionDurationSeconds,
    turnDurationSeconds,
    discussionDurationSeconds,
    votingDurationSeconds: typeof s.votingDurationSeconds === 'number' ? s.votingDurationSeconds : 60,
    hintDifficulty: (s.hintDifficulty as OnlineSettings['hintDifficulty']) ?? 'subtle',
    chomuCount: typeof s.chomuCount === 'number' ? s.chomuCount : 1,
    soundEnabled: typeof s.soundEnabled === 'boolean' ? s.soundEnabled : true,
  };
}

function mapPlayers(rows: RawPlayerRow[]): Record<string, OnlinePlayer> {
  const players: Record<string, OnlinePlayer> = {};
  for (const row of rows) {
    players[row.user_id] = {
      id: row.user_id,
      name: row.display_name,
      avatar: row.avatar_id as PlayerAvatarId,
      isHost: Boolean(row.is_host),
      isReady: Boolean(row.is_ready),
      isConnected: Boolean(row.is_connected),
      hasSeenRole: Boolean(row.has_seen_role),
      votedForId: row.has_voted ? '__voted__' : null,
      score: Number(row.score ?? 0),
      lastSeen: row.last_seen_at ? Date.parse(row.last_seen_at) : undefined,
    };
  }
  return players;
}

function mapSecret(row: RawSecretRow | null, category: string | null): OnlineSecretState | null {
  if (!row) return null;
  return {
    category: category ?? '',
    word: row.secret_word ?? undefined,
    isChomu: Boolean(row.is_chomu),
    hint: row.hint ?? undefined,
    role: row.role,
  };
}

function getDefaultStorage(): Pick<Storage, 'getItem' | 'setItem' | 'removeItem'> | null {
  try {
    if (typeof globalThis !== 'undefined' && 'localStorage' in globalThis && globalThis.localStorage) {
      return globalThis.localStorage;
    }
    if (typeof globalThis !== 'undefined' && 'sessionStorage' in globalThis && globalThis.sessionStorage) {
      return globalThis.sessionStorage;
    }
  } catch {
    // Ignore restricted storage access
  }
  return null;
}

export class SupabaseRoomTransport {
  private readonly getClientFn: () => SupabaseClient;
  private readonly ensureSessionFn: (client?: SupabaseClient) => Promise<string>;
  private readonly invokeFn: <T>(
    fnName: string,
    body: Record<string, unknown>,
    client?: SupabaseClient,
  ) => Promise<T>;
  private readonly storage: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'> | null;

  private userId = '';
  private roomId: string | null = null;
  private state: RoomState | null = null;
  private secret: OnlineSecretState | null = null;
  private secretRoundNumber = 0;

  private rawPhase: string | null = null;
  private runoffCandidateIds: string[] = [];
  private phaseDeadlineAt: string | null = null;

  private channel: RealtimeChannel | null = null;
  private connected = false;

  private stateListeners = new Set<StateListener>();
  private chatListeners = new Set<ChatListener>();
  private errorListeners = new Set<ErrorListener>();

  constructor(deps?: SupabaseRoomTransportDeps) {
    this.getClientFn = deps?.getClient ?? getSupabaseClient;
    this.ensureSessionFn = deps?.ensureSession ?? ensureAnonymousSession;
    this.invokeFn = deps?.invokeFn ?? invokeEdgeFunction;
    this.storage = deps?.storage !== undefined ? deps.storage : getDefaultStorage();
  }

  public subscribe(listener: StateListener): () => void {
    this.stateListeners.add(listener);
    listener(this.state, this.secret);
    return () => {
      this.stateListeners.delete(listener);
    };
  }

  public onChat(listener: ChatListener): () => void {
    this.chatListeners.add(listener);
    return () => {
      this.chatListeners.delete(listener);
    };
  }

  public onError(listener: ErrorListener): () => void {
    this.errorListeners.add(listener);
    return () => {
      this.errorListeners.delete(listener);
    };
  }

  public getState(): RoomState | null {
    return this.state;
  }

  public getSecret(): OnlineSecretState | null {
    return this.secret;
  }

  public getMyPeerId(): string {
    return this.userId;
  }

  public getRoomId(): string | null {
    return this.roomId;
  }

  public getRawPhase(): string | null {
    return this.rawPhase;
  }

  public getRunoffCandidateIds(): string[] {
    return this.runoffCandidateIds;
  }

  public getPhaseDeadlineAt(): string | null {
    return this.phaseDeadlineAt;
  }

  public isHost(): boolean {
    if (!this.state || !this.userId) return false;
    return this.state.hostPeerId === this.userId;
  }

  public isConnected(): boolean {
    return this.connected;
  }

  public async createRoom(
    playerName: string,
    avatar: PlayerAvatarId,
    initialSettings?: Partial<OnlineSettings>,
  ): Promise<void> {
    const client = this.getClientFn();
    this.userId = await this.ensureSessionFn(client);

    const res = await this.invokeFn<CreateRoomResponse>(
      'create-room',
      {
        displayName: playerName,
        avatarId: avatar,
        ...(initialSettings ? { settings: initialSettings } : {}),
      },
      client,
    );

    this.saveSession({
      roomId: res.room.id,
      roomCode: res.room.code,
      rejoinToken: res.rejoinToken,
      playerName,
      avatar,
    });

    this.roomId = res.room.id;
    this.connected = true;
    this.applyRoomAndPlayers(res.room, [res.player]);
    await this.refreshPlayers(client, res.room.id, res.room);
    await this.subscribeToRoom(client, res.room.id);
  }

  public async joinRoom(
    roomCode: string,
    playerName: string,
    avatar: PlayerAvatarId,
  ): Promise<void> {
    const client = this.getClientFn();
    this.userId = await this.ensureSessionFn(client);

    const res = await this.invokeFn<JoinRoomResponse>(
      'join-room',
      {
        code: roomCode.trim().toUpperCase(),
        displayName: playerName,
        avatarId: avatar,
      },
      client,
    );

    this.saveSession({
      roomId: res.room.id,
      roomCode: res.room.code,
      rejoinToken: res.rejoinToken,
      playerName,
      avatar,
    });

    this.roomId = res.room.id;
    this.connected = true;

    if (Array.isArray(res.players) && res.players.length > 0) {
      this.applyRoomAndPlayers(res.room, res.players);
    } else {
      this.applyRoomAndPlayers(res.room, [res.player]);
      await this.refreshPlayers(client, res.room.id, res.room);
    }

    await this.subscribeToRoom(client, res.room.id);
  }

  public async tryRejoinRoom(): Promise<boolean> {
    const stored = this.loadSession();
    if (!stored) {
      return false;
    }

    const client = this.getClientFn();
    this.userId = await this.ensureSessionFn(client);

    try {
      const res = await this.invokeFn<RejoinRoomResponse>(
        'rejoin-room',
        {
          roomId: stored.roomId,
          roomCode: stored.roomCode,
          rejoinToken: stored.rejoinToken,
        },
        client,
      );

      this.saveSession({
        ...stored,
        roomId: res.room.id,
        roomCode: res.room.code,
        rejoinToken: res.rejoinToken,
      });

      this.roomId = res.room.id;
      this.connected = true;

      if (res.mySecret) {
        this.secret = mapSecret(res.mySecret, res.room.secret_category);
        this.secretRoundNumber = res.room.round_number;
      } else {
        this.secret = null;
        this.secretRoundNumber = 0;
      }

      this.applyRoomAndPlayers(res.room, res.players ?? [res.player]);
      await this.subscribeToRoom(client, res.room.id);
      return true;
    } catch (err) {
      if (
        err instanceof BackendError &&
        (err.status === 401 ||
          err.status === 404 ||
          err.code === 'UNAUTHORIZED' ||
          err.code === 'ROOM_NOT_FOUND')
      ) {
        this.clearSession();
        return false;
      }
      throw err;
    }
  }

  public async leaveRoom(): Promise<void> {
    const client = this.getClientFn();
    const currentRoomId = this.roomId;

    try {
      if (currentRoomId) {
        await this.invokeFn('room-action', { roomId: currentRoomId, action: 'LEAVE_ROOM', payload: {} }, client);
      }
    } finally {
      await this.unsubscribeChannel(client);
      this.clearSession();
      this.resetLocalState();
      this.notifyStateListeners();
    }
  }

  public async setReady(isReady: boolean): Promise<void> {
    await this.invokeRoomAction('SET_READY', { isReady });
  }

  public async updateSettings(settings: Partial<OnlineSettings>): Promise<void> {
    await this.invokeRoomAction('UPDATE_SETTINGS', { settings });
  }

  public async startGame(): Promise<void> {
    await this.invokeRoomAction('START_GAME', {});
  }

  public async confirmRole(): Promise<void> {
    await this.invokeRoomAction('ACK_ROLE', {});
  }

  public async nextTurn(): Promise<void> {
    await this.invokeRoomAction('ADVANCE_TURN', {});
  }

  public async startVoting(): Promise<void> {
    await this.invokeRoomAction('START_VOTING', {});
  }

  public async castVote(targetPlayerId: string): Promise<void> {
    await this.invokeRoomAction('CAST_VOTE', { targetUserId: targetPlayerId });
  }

  public async concludeVoting(): Promise<void> {
    await this.invokeRoomAction('CONCLUDE_VOTING', {});
  }

  public async nextRound(): Promise<void> {
    await this.invokeRoomAction('PLAY_AGAIN', {});
  }

  public async kickPlayer(targetPlayerId: string): Promise<void> {
    await this.invokeRoomAction('KICK_PLAYER', { targetUserId: targetPlayerId });
  }

  public async sendChat(text: string): Promise<void> {
    const trimmed = text.trim();
    if (!trimmed || !this.roomId || !this.userId) return;

    const client = this.getClientFn();
    const senderName = this.state?.players[this.userId]?.name ?? 'Player';

    const { error } = await client.from('lobby_chat').insert({
      room_id: this.roomId,
      user_id: this.userId,
      sender_name: senderName,
      message: trimmed,
      is_system: false,
    });

    if (error) {
      const err = new BackendError('INTERNAL_ERROR', error.message || 'Failed to send chat message');
      this.notifyErrorListeners(err);
      throw err;
    }
  }

  private async invokeRoomAction(action: string, payload: Record<string, unknown>): Promise<void> {
    if (!this.roomId) {
      throw new BackendError('INVALID_STATE', 'Not connected to a room');
    }
    const client = this.getClientFn();
    await this.invokeFn('room-action', { roomId: this.roomId, action, payload }, client);
  }

  private async subscribeToRoom(client: SupabaseClient, roomId: string): Promise<void> {
    await this.unsubscribeChannel(client);

    const channel = client
      .channel(`room:${roomId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'rooms', filter: `id=eq.${roomId}` },
        () => {
          void this.refreshRoomState(client, roomId);
        },
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'room_players', filter: `room_id=eq.${roomId}` },
        () => {
          void this.refreshRoomState(client, roomId);
        },
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'lobby_chat', filter: `room_id=eq.${roomId}` },
        (payload) => {
          const row = payload?.new as RawChatRow | undefined;
          if (!row) return;
          const msg: ChatPayload = {
            id: row.id,
            senderName: row.sender_name,
            text: row.message,
            isSystem: Boolean(row.is_system),
          };
          this.notifyChatListeners(msg);
        },
      );

    this.channel = channel;
    channel.subscribe((status: string) => {
      if (status === 'SUBSCRIBED') {
        this.connected = true;
      } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
        this.connected = false;
      }
    });
  }

  private async unsubscribeChannel(client: SupabaseClient): Promise<void> {
    if (this.channel) {
      try {
        await client.removeChannel(this.channel);
      } catch {
        // Ignore cleanup errors
      }
      this.channel = null;
    }
  }

  private async refreshPlayers(
    client: SupabaseClient,
    roomId: string,
    roomRow: RawRoomRow,
  ): Promise<void> {
    const { data, error } = await client.from('room_players').select('*').eq('room_id', roomId);
    if (error || !data) return;
    this.applyRoomAndPlayers(roomRow, data as RawPlayerRow[]);
  }

  private async refreshRoomState(client: SupabaseClient, roomId: string): Promise<void> {
    try {
      const [{ data: roomData, error: roomErr }, { data: playersData, error: playersErr }] =
        await Promise.all([
          client.from('rooms').select('*').eq('id', roomId).maybeSingle(),
          client.from('room_players').select('*').eq('room_id', roomId),
        ]);

      if (roomErr || playersErr || !roomData || !playersData) {
        return;
      }

      const roomRow = roomData as RawRoomRow;
      const playerRows = playersData as RawPlayerRow[];

      if (roomRow.phase === 'LOBBY') {
        this.secret = null;
        this.secretRoundNumber = 0;
      } else if (
        roomRow.round_number > 0 &&
        this.secretRoundNumber !== roomRow.round_number &&
        this.userId
      ) {
        const { data: secretData } = await client
          .from('player_secrets')
          .select('id, room_id, user_id, round_number, is_chomu, role, secret_word, hint')
          .eq('room_id', roomId)
          .eq('user_id', this.userId)
          .eq('round_number', roomRow.round_number)
          .maybeSingle();

        if (secretData) {
          this.secret = mapSecret(secretData as RawSecretRow, roomRow.secret_category);
          this.secretRoundNumber = roomRow.round_number;
        }
      }

      this.applyRoomAndPlayers(roomRow, playerRows);
    } catch (err) {
      if (err instanceof Error) {
        this.notifyErrorListeners(err);
      }
    }
  }

  private applyRoomAndPlayers(roomRow: RawRoomRow, playerRows: RawPlayerRow[]): void {
    const rawSettings = roomRow.settings ?? {};
    const mappedSettings = mapSettings(rawSettings);
    const turnOrder = Array.isArray(roomRow.turn_order) ? roomRow.turn_order : [];
    const turnIdx = typeof roomRow.current_turn_index === 'number' ? roomRow.current_turn_index : 0;
    const currentTurnPlayerId = turnOrder[turnIdx] ?? null;

    this.rawPhase = roomRow.phase;
    this.runoffCandidateIds = Array.isArray(roomRow.runoff_candidate_ids)
      ? roomRow.runoff_candidate_ids
      : [];
    this.phaseDeadlineAt = roomRow.phase_deadline_at ?? null;

    const mappedPhase = mapOnlinePhase(roomRow.phase);
    const isResults = roomRow.phase === 'RESULTS';

    this.state = {
      roomCode: roomRow.code,
      hostPeerId: roomRow.host_user_id,
      phase: mappedPhase,
      players: mapPlayers(playerRows),
      settings: mappedSettings,
      roundNumber: roomRow.round_number ?? 0,
      secretCategory: roomRow.secret_category ?? null,
      roundStartTime: null,
      roundDurationSeconds: mappedSettings.roundDurationSeconds,
      votingStartTime: null,
      votingDurationSeconds: mappedSettings.votingDurationSeconds,
      votingResult: roomRow.voting_result ?? null,
      winner: roomRow.winner ?? null,
      chomuIds: isResults ? (roomRow.chomu_ids ?? null) : null,
      secretWord: isResults ? (roomRow.secret_word ?? null) : null,
      currentTurnPlayerId,
      turnOrder,
      turnStartTime: null,
      turnDurationSeconds:
        typeof rawSettings.turnDurationSeconds === 'number' ? rawSettings.turnDurationSeconds : 20,
    };

    this.notifyStateListeners();
  }

  private resetLocalState(): void {
    this.roomId = null;
    this.state = null;
    this.secret = null;
    this.secretRoundNumber = 0;
    this.rawPhase = null;
    this.runoffCandidateIds = [];
    this.phaseDeadlineAt = null;
    this.connected = false;
  }

  private saveSession(session: StoredSupabaseSession): void {
    if (!this.storage) return;
    try {
      this.storage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    } catch {
      // Ignore storage quota errors
    }
  }

  private loadSession(): StoredSupabaseSession | null {
    if (!this.storage) return null;
    try {
      const raw = this.storage.getItem(SESSION_STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as Partial<StoredSupabaseSession>;
      if (!parsed.roomId || !parsed.roomCode || !parsed.rejoinToken) {
        return null;
      }
      return parsed as StoredSupabaseSession;
    } catch {
      return null;
    }
  }

  private clearSession(): void {
    if (!this.storage) return;
    try {
      this.storage.removeItem(SESSION_STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }
  }

  private notifyStateListeners(): void {
    for (const listener of this.stateListeners) {
      listener(this.state, this.secret);
    }
  }

  private notifyChatListeners(msg: ChatPayload): void {
    for (const listener of this.chatListeners) {
      listener(msg);
    }
  }

  private notifyErrorListeners(err: Error): void {
    for (const listener of this.errorListeners) {
      listener(err);
    }
  }
}

export const supabaseRoomTransport = new SupabaseRoomTransport();
