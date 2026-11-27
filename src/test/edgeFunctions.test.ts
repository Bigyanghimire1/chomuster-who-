import { describe, it, expect } from 'vitest';
import { selectSecretWord } from '../services/wordSelector';
import { DEFAULT_CATEGORIES } from '../data/categories';
import {
  assignRolesAndWord,
  mintLiveKitJwt,
  validateAndNormalizeSettings,
} from '../../supabase/functions/_shared/gameLogic';
import { sha256Hex, type AuthDeps } from '../../supabase/functions/_shared/auth';
import { handleCreateRoom } from '../../supabase/functions/create-room/index';
import { handleJoinRoom } from '../../supabase/functions/join-room/index';
import { handleRejoinRoom } from '../../supabase/functions/rejoin-room/index';
import { handleRoomAction } from '../../supabase/functions/room-action/index';
import { handleMintLiveKitToken } from '../../supabase/functions/mint-livekit-token/index';

interface MockDbState {
  rooms: Array<Record<string, any>>;
  room_players: Array<Record<string, any>>;
  room_player_credentials: Array<Record<string, any>>;
  room_round_secrets: Array<Record<string, any>>;
  player_secrets: Array<Record<string, any>>;
  votes: Array<Record<string, any>>;
  lobby_chat: Array<Record<string, any>>;
  rpcCalls: Array<{ fn: string; args: Record<string, unknown> }>;
}

function createInitialDb(): MockDbState {
  return {
    rooms: [],
    room_players: [],
    room_player_credentials: [],
    room_round_secrets: [],
    player_secrets: [],
    votes: [],
    lobby_chat: [],
    rpcCalls: [],
  };
}

function makeMockDeps(
  db: MockDbState,
  callerUserId: string | null,
  extraEnv: Record<string, string | undefined> = {},
): AuthDeps {
  let idSeq = 1;
  const nextUuid = () => `00000000-0000-4000-8000-${String(idSeq++).padStart(12, '0')}`;

  function createQuery(table: keyof Omit<MockDbState, 'rpcCalls'>) {
    const filters: Array<{ col: string; val: unknown }> = [];
    let pendingOp: 'select' | 'insert' | 'update' | 'delete' | 'upsert' = 'select';
    let payload: any = null;
    let orderCol: string | null = null;
    let orderAsc = true;
    let limitCount: number | null = null;
    let returnRows = false;

    const execute = async (): Promise<{ data: any; error: any }> => {
      const rows = db[table];
      const matches = (row: Record<string, any>) =>
        filters.every((f) => row[f.col] === f.val);

      if (pendingOp === 'insert') {
        const items = Array.isArray(payload) ? payload : [payload];
        const inserted = items.map((item) => ({
          id: item.id ?? nextUuid(),
          created_at: item.created_at ?? new Date().toISOString(),
          updated_at: item.updated_at ?? new Date().toISOString(),
          score: item.score ?? 0,
          has_seen_role: item.has_seen_role ?? false,
          has_voted: item.has_voted ?? false,
          round_number: item.round_number ?? 0,
          state_version: item.state_version ?? 1,
          ...item,
        }));
        rows.push(...inserted);
        if (!returnRows) return { data: null, error: null };
        return { data: Array.isArray(payload) ? inserted : inserted[0], error: null };
      }

      if (pendingOp === 'upsert') {
        const item = { ...payload };
        const existingIdx = rows.findIndex((r) => r.player_id && r.player_id === item.player_id);
        if (existingIdx >= 0) {
          rows[existingIdx] = { ...rows[existingIdx], ...item };
          return { data: returnRows ? rows[existingIdx] : null, error: null };
        }
        const inserted = { id: item.id ?? nextUuid(), ...item };
        rows.push(inserted);
        return { data: returnRows ? inserted : null, error: null };
      }

      if (pendingOp === 'update') {
        const updated: any[] = [];
        for (let i = 0; i < rows.length; i++) {
          if (matches(rows[i])) {
            rows[i] = { ...rows[i], ...payload };
            updated.push(rows[i]);
          }
        }
        return { data: returnRows ? updated : null, error: null };
      }

      if (pendingOp === 'delete') {
        const kept: any[] = [];
        const deleted: any[] = [];
        for (const r of rows) {
          if (matches(r)) deleted.push(r);
          else kept.push(r);
        }
        db[table] = kept as any;
        return { data: returnRows ? deleted : null, error: null };
      }

      let result = rows.filter(matches).map((r) => ({ ...r }));
      if (orderCol) {
        result.sort((a, b) => {
          const av = a[orderCol!];
          const bv = b[orderCol!];
          if (av < bv) return orderAsc ? -1 : 1;
          if (av > bv) return orderAsc ? 1 : -1;
          return 0;
        });
      }
      if (limitCount !== null) {
        result = result.slice(0, limitCount);
      }
      return { data: result, error: null };
    };

    const builder: any = {
      select() {
        returnRows = true;
        return builder;
      },
      insert(data: any) {
        pendingOp = 'insert';
        payload = data;
        return builder;
      },
      upsert(data: any) {
        pendingOp = 'upsert';
        payload = data;
        return builder;
      },
      update(data: any) {
        pendingOp = 'update';
        payload = data;
        return builder;
      },
      delete() {
        pendingOp = 'delete';
        return builder;
      },
      eq(col: string, val: unknown) {
        filters.push({ col, val });
        return builder;
      },
      order(col: string, opts?: { ascending?: boolean }) {
        orderCol = col;
        orderAsc = opts?.ascending !== false;
        return builder;
      },
      limit(n: number) {
        limitCount = n;
        return builder;
      },
      async maybeSingle() {
        const res = await execute();
        if (res.error) return res;
        const arr = Array.isArray(res.data) ? res.data : res.data ? [res.data] : [];
        return { data: arr[0] ?? null, error: null };
      },
      async single() {
        const res = await execute();
        if (res.error) return res;
        const arr = Array.isArray(res.data) ? res.data : res.data ? [res.data] : [];
        if (arr.length === 0) {
          return { data: null, error: { code: 'PGRST116', message: 'No rows found' } };
        }
        return { data: arr[0], error: null };
      },
      then(resolve: (val: any) => void, reject?: (err: any) => void) {
        return execute().then(resolve, reject);
      },
    };
    return builder;
  }

  return {
    env: {
      SUPABASE_URL: 'https://example.supabase.co',
      SUPABASE_ANON_KEY: 'anon-key',
      SUPABASE_SERVICE_ROLE_KEY: 'service-role-key',
      LIVEKIT_API_KEY: 'lk_api_key_test',
      LIVEKIT_API_SECRET: 'lk_api_secret_test_super_secret_123456',
      LIVEKIT_URL: 'wss://example.livekit.cloud',
      ...extraEnv,
    },
    createSupabaseClient: () => ({
      auth: {
        getUser: async () => {
          if (!callerUserId) {
            return { data: { user: null }, error: { message: 'Invalid JWT' } };
          }
          return { data: { user: { id: callerUserId } }, error: null };
        },
      },
      from: (table: keyof Omit<MockDbState, 'rpcCalls'>) => createQuery(table),
      rpc: async (fn: string, args: Record<string, unknown>) => {
        db.rpcCalls.push({ fn, args });
        if (fn === 'cast_vote_atomic') {
          return {
            data: { ok: true, phase: 'VOTING', votesCast: 1, totalVoters: 3, allVoted: false, stateVersion: 5 },
            error: null,
          };
        }
        if (fn === 'reset_lobby_atomic') {
          const room = db.rooms.find((r) => r.id === args.p_room_id);
          if (room) {
            room.phase = 'LOBBY';
            room.state_version += 1;
          }
          return { data: { ok: true, phase: 'LOBBY', stateVersion: room?.state_version ?? 2 }, error: null };
        }
        return { data: { ok: true }, error: null };
      },
    }),
  };
}

function makeJsonReq(body: unknown, token: string | null = 'valid-jwt'): Request {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  return new Request('https://example.supabase.co/functions/v1/test', {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
}

describe('wordSelector custom category fix', () => {
  it('never drops custom category words when built-in categories and hints are both enabled', () => {
    const customCat = {
      id: 'custom',
      name: 'My Friends',
      description: 'Custom friends words',
      icon: 'Sparkles',
      words: ['ZebraMomo', 'ChomuJuice'],
    };
    const allCats = [...DEFAULT_CATEGORIES, customCat];

    const pickedWords = new Set<string>();
    for (let i = 0; i < 40; i++) {
      const deterministicSource = {
        getRandomValues(arr: Uint32Array) {
          arr[0] = (i * 19 + 1) >>> 0;
          return arr;
        },
      };
      const res = selectSecretWord(
        allCats,
        ['animals', 'custom'],
        [],
        'subtle',
        deterministicSource,
      );
      pickedWords.add(res.wordEntry.word);
    }

    expect(pickedWords.has('ChomuJuice')).toBe(true);
  });

  it('supports custom-only categories even when hintDifficulty is subtle', () => {
    const customCat = {
      id: 'custom_123',
      name: 'Inside Jokes',
      description: 'Custom inside jokes',
      icon: 'Sparkles',
      words: ['BiryaniBoss'],
    };
    const res = selectSecretWord([customCat], ['custom_123'], [], 'subtle');
    expect(res.wordEntry.word).toBe('BiryaniBoss');
    expect(res.wordEntry.categoryId).toBe('custom_123');
  });
});

describe('Edge Function gameLogic & LiveKit JWT minting', () => {
  it('assignRolesAndWord assigns fewer Chomus than players and isolates hints', () => {
    const settings = validateAndNormalizeSettings({
      categoryIds: ['custom'],
      chomuCount: 3, // should clamp below player count (3 -> max 2 for 3 players, or 1..2)
      hintDifficulty: 'subtle',
      customWords: [{ word: 'SecretMango', hint: 'Yellow fruit', categoryName: 'Custom' }],
    });

    const result = assignRolesAndWord({
      playerUserIds: ['u1', 'u2', 'u3'],
      settings,
    });

    expect(result.secretWord).toBe('SecretMango');
    expect(result.chomuIds.length).toBeLessThan(3);
    expect(result.chomuIds.length).toBeGreaterThanOrEqual(1);
    expect(result.turnOrder).toHaveLength(3);

    for (const uid of ['u1', 'u2', 'u3']) {
      if (result.chomuIds.includes(uid)) {
        expect(result.hintsByUserId[uid]).toBe('Yellow fruit');
      } else {
        expect(result.hintsByUserId[uid]).toBeNull();
      }
    }
  });

  it('mints a valid HS256 LiveKit JWT with room-scoped grants and short TTL', async () => {
    const apiKey = 'lk_key_123';
    const apiSecret = 'lk_secret_must_be_verified_with_webcrypto';
    const token = await mintLiveKitJwt({
      apiKey,
      apiSecret,
      roomName: 'room-uuid-42',
      identity: 'user-uuid-7',
      name: 'Bigyan',
      ttlSeconds: 3600,
    });

    const parts = token.split('.');
    expect(parts).toHaveLength(3);

    const payloadJson = JSON.parse(
      atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')),
    );
    expect(payloadJson.iss).toBe(apiKey);
    expect(payloadJson.sub).toBe('user-uuid-7');
    expect(payloadJson.name).toBe('Bigyan');
    expect(payloadJson.exp - payloadJson.nbf).toBe(3600);
    expect(payloadJson.video).toEqual({
      roomJoin: true,
      room: 'room-uuid-42',
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
    });

    // Verify HS256 cryptographic signature
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(apiSecret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify'],
    );
    const sigBase64 = parts[2].replace(/-/g, '+').replace(/_/g, '/');
    const sigBin = atob(sigBase64);
    const sigBytes = new Uint8Array(sigBin.length);
    for (let i = 0; i < sigBin.length; i++) sigBytes[i] = sigBin.charCodeAt(i);

    const valid = await crypto.subtle.verify(
      'HMAC',
      key,
      sigBytes,
      new TextEncoder().encode(`${parts[0]}.${parts[1]}`),
    );
    expect(valid).toBe(true);
  });
});

describe('Edge Functions auth, room lifecycle & voting security', () => {
  it('rejects unauthenticated callers with 401 UNAUTHORIZED', async () => {
    const db = createInitialDb();
    const res = await handleCreateRoom(
      makeJsonReq({ displayName: 'Host', avatarId: 'chomu_chief' }, null),
      makeMockDeps(db, 'user-1'),
    );
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error.code).toBe('UNAUTHORIZED');
  });

  it('creates room, hashes rejoin token, joins guests, and rotates rejoin token on rejoin', async () => {
    const db = createInitialDb();
    const hostId = 'user-host';
    const guestId = 'user-guest';

    // 1. Create room
    const createRes = await handleCreateRoom(
      makeJsonReq({ displayName: 'Sam', avatarId: 'chomu_chief' }),
      makeMockDeps(db, hostId),
    );
    expect(createRes.status).toBe(201);
    const created = await createRes.json();
    expect(created.room.code).toHaveLength(4);
    expect(created.player.is_host).toBe(true);
    expect(created.player.is_ready).toBe(false);
    expect(typeof created.rejoinToken).toBe('string');

    // Stored credential must be SHA-256 hash, never plaintext
    expect(db.room_player_credentials).toHaveLength(1);
    expect(db.room_player_credentials[0].rejoin_token_hash).not.toBe(created.rejoinToken);
    expect(db.room_player_credentials[0].rejoin_token_hash).toBe(
      await sha256Hex(created.rejoinToken),
    );

    // 2. Guest joins
    const joinRes = await handleJoinRoom(
      makeJsonReq({ code: created.room.code, displayName: 'Puku', avatarId: 'chai_chomu' }),
      makeMockDeps(db, guestId),
    );
    expect(joinRes.status).toBe(200);
    const joined = await joinRes.json();
    expect(joined.players).toHaveLength(2);

    // 3. Rejoin with wrong token fails 401
    const badRejoin = await handleRejoinRoom(
      makeJsonReq({ roomId: created.room.id, rejoinToken: 'wrong-token' }),
      makeMockDeps(db, 'user-guest-new-session'),
    );
    expect(badRejoin.status).toBe(401);

    // 4. Rejoin with valid token succeeds, rebinds user_id, and rotates token
    const goodRejoin = await handleRejoinRoom(
      makeJsonReq({ roomId: created.room.id, rejoinToken: joined.rejoinToken }),
      makeMockDeps(db, 'user-guest-new-session'),
    );
    expect(goodRejoin.status).toBe(200);
    const rejoined = await goodRejoin.json();
    expect(rejoined.player.user_id).toBe('user-guest-new-session');
    expect(rejoined.rejoinToken).not.toBe(joined.rejoinToken);
  });

  it('enforces host-only settings/start, resets readiness on settings change, and blocks self-voting', async () => {
    const db = createInitialDb();
    const hostId = 'u-host';
    const p2Id = 'u-p2';
    const p3Id = 'u-p3';
    const outsiderId = 'u-outsider';

    const createRes = await handleCreateRoom(
      makeJsonReq({ displayName: 'Host', avatarId: 'chomu_chief' }),
      makeMockDeps(db, hostId),
    );
    const { room } = await createRes.json();

    await handleJoinRoom(
      makeJsonReq({ code: room.code, displayName: 'P2', avatarId: 'chai_chomu' }),
      makeMockDeps(db, p2Id),
    );
    await handleJoinRoom(
      makeJsonReq({ code: room.code, displayName: 'P3', avatarId: 'samosa_sam' }),
      makeMockDeps(db, p3Id),
    );

    // Outsider cannot act
    const outsiderRes = await handleRoomAction(
      makeJsonReq({ roomId: room.id, action: 'SET_READY', payload: { isReady: true } }),
      makeMockDeps(db, outsiderId),
    );
    expect(outsiderRes.status).toBe(403);

    // Players mark ready
    for (const uid of [hostId, p2Id, p3Id]) {
      const r = await handleRoomAction(
        makeJsonReq({ roomId: room.id, action: 'SET_READY', payload: { isReady: true } }),
        makeMockDeps(db, uid),
      );
      expect(r.status).toBe(200);
    }

    // Non-host cannot update settings
    const nonHostSettings = await handleRoomAction(
      makeJsonReq({
        roomId: room.id,
        action: 'UPDATE_SETTINGS',
        payload: { categoryIds: ['animals'], turnDurationSeconds: 15 },
      }),
      makeMockDeps(db, p2Id),
    );
    expect(nonHostSettings.status).toBe(403);

    // Host updates settings -> resets ALL players' is_ready to false (including host!)
    const hostSettings = await handleRoomAction(
      makeJsonReq({
        roomId: room.id,
        action: 'UPDATE_SETTINGS',
        payload: { categoryIds: ['animals'], turnDurationSeconds: 15, discussionDurationSeconds: 45 },
      }),
      makeMockDeps(db, hostId),
    );
    expect(hostSettings.status).toBe(200);
    expect(db.room_players.every((p) => p.is_ready === false)).toBe(true);

    // Start game fails while players are not ready
    const startNotReady = await handleRoomAction(
      makeJsonReq({ roomId: room.id, action: 'START_GAME' }),
      makeMockDeps(db, hostId),
    );
    expect(startNotReady.status).toBe(409);

    // Re-ready all and start game
    for (const uid of [hostId, p2Id, p3Id]) {
      await handleRoomAction(
        makeJsonReq({ roomId: room.id, action: 'SET_READY', payload: { isReady: true } }),
        makeMockDeps(db, uid),
      );
    }
    const startOk = await handleRoomAction(
      makeJsonReq({ roomId: room.id, action: 'START_GAME' }),
      makeMockDeps(db, hostId),
    );
    expect(startOk.status).toBe(200);
    expect(db.rooms[0].phase).toBe('ROLE_REVEAL');
    expect(db.player_secrets).toHaveLength(3);

    // Move room to VOTING and test self-vote rejection
    db.rooms[0].phase = 'VOTING';
    const selfVote = await handleRoomAction(
      makeJsonReq({ roomId: room.id, action: 'CAST_VOTE', payload: { targetUserId: p2Id } }),
      makeMockDeps(db, p2Id),
    );
    expect(selfVote.status).toBe(400);

    // Valid vote delegates to cast_vote_atomic RPC
    const validVote = await handleRoomAction(
      makeJsonReq({ roomId: room.id, action: 'CAST_VOTE', payload: { targetUserId: p3Id } }),
      makeMockDeps(db, p2Id),
    );
    expect(validVote.status).toBe(200);
    expect(db.rpcCalls.some((c) => c.fn === 'cast_vote_atomic')).toBe(true);
  });

  it('mints LiveKit token only for connected members and respects quota circuit-breaker', async () => {
    const db = createInitialDb();
    const hostId = 'u-host';
    const createRes = await handleCreateRoom(
      makeJsonReq({ displayName: 'Host', avatarId: 'chomu_chief' }),
      makeMockDeps(db, hostId),
    );
    const { room } = await createRes.json();

    // Non-member blocked
    const forbidden = await handleMintLiveKitToken(
      makeJsonReq({ roomId: room.id }),
      makeMockDeps(db, 'u-stranger'),
    );
    expect(forbidden.status).toBe(403);

    // Quota circuit-breaker
    const quota = await handleMintLiveKitToken(
      makeJsonReq({ roomId: room.id }),
      makeMockDeps(db, hostId, { LIVEKIT_QUOTA_EXHAUSTED: 'true' }),
    );
    expect(quota.status).toBe(429);
    const quotaBody = await quota.json();
    expect(quotaBody.error.code).toBe('QUOTA_EXCEEDED');

    // Member succeeds without leaking API key/secret
    const ok = await handleMintLiveKitToken(
      makeJsonReq({ roomId: room.id }),
      makeMockDeps(db, hostId),
    );
    expect(ok.status).toBe(200);
    const body = await ok.json();
    expect(body.roomName).toBe(room.id);
    expect(body.identity).toBe(hostId);
    expect(typeof body.token).toBe('string');
    expect(JSON.stringify(body)).not.toContain('lk_api_secret_test');
    expect(JSON.stringify(body)).not.toContain('lk_api_key_test');
  });
});
