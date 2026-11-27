import { describe, it, expect, vi } from 'vitest';
import { RoomEvent, VideoPresets, type RoomOptions } from 'livekit-client';
import {
  getActiveMultiplayerBackend,
  isSupabaseConfigured,
} from '../services/backendConfig';
import { BackendError } from '../services/supabase/supabaseClient';
import { SupabaseRoomTransport } from '../services/supabase/SupabaseRoomTransport';
import { LiveKitMediaService } from '../services/livekit/LiveKitMediaService';

function createMemoryStorage(): Pick<Storage, 'getItem' | 'setItem' | 'removeItem'> {
  const map = new Map<string, string>();
  return {
    getItem: (k) => map.get(k) ?? null,
    setItem: (k, v) => {
      map.set(k, v);
    },
    removeItem: (k) => {
      map.delete(k);
    },
  };
}

describe('backendConfig feature flag', () => {
  it('defaults to trystero unless VITE_MULTIPLAYER_BACKEND=supabase and Supabase keys are present', () => {
    expect(getActiveMultiplayerBackend({})).toBe('trystero');
    expect(getActiveMultiplayerBackend({ backend: 'supabase' })).toBe('trystero');
    expect(
      getActiveMultiplayerBackend({
        backend: 'supabase',
        supabaseUrl: 'https://demo.supabase.co',
        supabaseAnonKey: 'anon-key',
      }),
    ).toBe('supabase');
    expect(
      isSupabaseConfigured({
        supabaseUrl: 'https://demo.supabase.co',
        supabaseAnonKey: 'anon-key',
      }),
    ).toBe(true);
  });
});

describe('SupabaseRoomTransport', () => {
  it('creates room, saves rejoin session, maps DISCUSSION/VOTING_RUNOFF, and supports rejoin & leave', async () => {
    const storage = createMemoryStorage();
    const channelMock = {
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn().mockReturnThis(),
    };
    const insertedChats: any[] = [];
    const clientMock: any = {
      channel: vi.fn(() => channelMock),
      removeChannel: vi.fn(async () => 'ok'),
      from: vi.fn((table: string) => {
        if (table === 'room_players') {
          return {
            select: () => ({
              eq: () => ({
                order: async () => ({
                  data: [
                    {
                      id: 'rp-1',
                      room_id: 'room-uuid-1',
                      user_id: 'user-host-1',
                      display_name: 'Sam',
                      avatar_id: 'sleuth',
                      is_host: true,
                      is_ready: false,
                      is_connected: true,
                      score: 0,
                      has_seen_role: false,
                      has_voted: false,
                    },
                  ],
                  error: null,
                }),
              }),
            }),
          };
        }
        if (table === 'lobby_chat') {
          return {
            insert: async (row: any) => {
              insertedChats.push(row);
              return { error: null };
            },
          };
        }
        return {};
      }),
    };

    const invokeFn = vi.fn(async (fnName: string, body: Record<string, unknown>) => {
      if (fnName === 'create-room') {
        return {
          room: {
            id: 'room-uuid-1',
            code: 'AB12',
            host_user_id: 'user-host-1',
            phase: 'LOBBY',
            settings: {
              categoryIds: ['animals'],
              turnDurationSeconds: 20,
              discussionDurationSeconds: 45,
              votingDurationSeconds: 60,
              hintDifficulty: 'subtle',
              chomuCount: 1,
            },
            round_number: 0,
            secret_category: null,
            turn_order: [],
            current_turn_index: 0,
            phase_deadline_at: null,
            runoff_candidate_ids: [],
            voting_result: null,
            winner: null,
            secret_word: null,
            chomu_ids: null,
          },
          player: {
            id: 'rp-1',
            room_id: 'room-uuid-1',
            user_id: 'user-host-1',
            display_name: 'Sam',
            avatar_id: 'sleuth',
            is_host: true,
            is_ready: false,
            is_connected: true,
            score: 0,
            has_seen_role: false,
            has_voted: false,
          },
          rejoinToken: 'tok-initial',
        };
      }
      if (fnName === 'rejoin-room') {
        return {
          room: {
            id: 'room-uuid-1',
            code: 'AB12',
            host_user_id: 'user-host-1',
            phase: 'VOTING_RUNOFF',
            settings: {
              categoryIds: ['animals'],
              turnDurationSeconds: 20,
              discussionDurationSeconds: 45,
              votingDurationSeconds: 60,
              hintDifficulty: 'subtle',
              chomuCount: 1,
            },
            round_number: 1,
            secret_category: 'Animals',
            turn_order: ['user-host-1'],
            current_turn_index: 0,
            phase_deadline_at: new Date(Date.now() + 30_000).toISOString(),
            runoff_candidate_ids: ['user-p2', 'user-p3'],
            voting_result: null,
            winner: null,
            secret_word: null,
            chomu_ids: null,
          },
          player: {
            id: 'rp-1',
            room_id: 'room-uuid-1',
            user_id: 'user-host-1',
            display_name: 'Sam',
            avatar_id: 'sleuth',
            is_host: true,
            is_ready: true,
            is_connected: true,
            score: 0,
            has_seen_role: true,
            has_voted: false,
          },
          players: [],
          mySecret: {
            is_chomu: true,
            role: 'Imposter',
            secret_word: null,
            hint: 'Stripes',
          },
          rejoinToken: 'tok-rotated',
        };
      }
      if (fnName === 'room-action' && body.action === 'LEAVE_ROOM') {
        return { ok: true };
      }
      return { ok: true };
    });

    const transport = new SupabaseRoomTransport({
      getClient: () => clientMock,
      ensureSession: async () => 'user-host-1',
      invokeFn: invokeFn as any,
      storage,
    });

    await transport.createRoom('Sam', 'sleuth');
    expect(transport.isConnected()).toBe(true);
    expect(transport.getState()?.roomCode).toBe('AB12');
    expect(JSON.parse(storage.getItem('chomu_supabase_session')!).rejoinToken).toBe('tok-initial');

    await transport.sendChat('Hello lobby!');
    expect(insertedChats).toHaveLength(1);
    expect(insertedChats[0].message).toBe('Hello lobby!');

    // Simulate reload with a fresh transport instance reading same storage
    const transportAfterReload = new SupabaseRoomTransport({
      getClient: () => clientMock,
      ensureSession: async () => 'user-host-1',
      invokeFn: invokeFn as any,
      storage,
    });
    const ok = await transportAfterReload.tryRejoinRoom();
    expect(ok).toBe(true);
    expect(transportAfterReload.getState()?.phase).toBe('VOTING');
    expect(transportAfterReload.getRawPhase()).toBe('VOTING_RUNOFF');
    expect(transportAfterReload.getRunoffCandidateIds()).toEqual(['user-p2', 'user-p3']);
    expect(transportAfterReload.getSecret()?.hint).toBe('Stripes');
    expect(JSON.parse(storage.getItem('chomu_supabase_session')!).rejoinToken).toBe('tok-rotated');

    await transportAfterReload.leaveRoom();
    expect(transportAfterReload.isConnected()).toBe(false);
    expect(storage.getItem('chomu_supabase_session')).toBeNull();
  });
});

describe('LiveKitMediaService', () => {
  it('configures AdaptiveStream, Dynacast, and H180/H360 simulcast and handles track & speaker events', async () => {
    const handlers = new Map<string, Array<(...args: any[]) => void>>();
    let capturedOptions: RoomOptions | undefined;

    const fakeRoom: any = {
      on: vi.fn((ev: string, fn: (...args: any[]) => void) => {
        const list = handlers.get(ev) ?? [];
        list.push(fn);
        handlers.set(ev, list);
        return fakeRoom;
      }),
      connect: vi.fn(async () => {}),
      disconnect: vi.fn(async () => {}),
      localParticipant: {
        identity: 'user-1',
        trackPublications: new Map(),
        setCameraEnabled: vi.fn(async () => {
          throw Object.assign(new Error('Permission denied'), { name: 'NotAllowedError' });
        }),
        setMicrophoneEnabled: vi.fn(async () => {}),
      },
    };

    const service = new LiveKitMediaService(
      async () => ({ token: 'jwt-abc', url: 'wss://lk.example.cloud' }),
      (opts) => {
        capturedOptions = opts;
        return fakeRoom;
      },
    );

    await service.connect('room-1');
    expect(service.getState().isConnected).toBe(true);
    expect(capturedOptions?.adaptiveStream).toBe(true);
    expect(capturedOptions?.dynacast).toBe(true);
    expect(capturedOptions?.publishDefaults?.simulcast).toBe(true);
    expect(capturedOptions?.publishDefaults?.videoSimulcastLayers).toEqual([
      VideoPresets.h180,
      VideoPresets.h360,
    ]);

    // Simulate remote track subscribed
    const fakeMediaTrack = { kind: 'video', id: 'trk-1' } as unknown as MediaStreamTrack;
    const remoteParticipant = { identity: 'user-2' };
    const remoteTrack = { mediaStreamTrack: fakeMediaTrack };
    handlers.get(RoomEvent.TrackSubscribed)?.forEach((fn) =>
      fn(remoteTrack, {}, remoteParticipant),
    );
    expect(service.getState().peerStreams['user-2']).toBeDefined();

    // Simulate active speakers
    handlers.get(RoomEvent.ActiveSpeakersChanged)?.forEach((fn) =>
      fn([{ identity: 'user-2' }]),
    );
    expect(service.getState().speakingPeers).toEqual({ 'user-2': true });

    // Camera permission denied handled gracefully
    const stream = await service.enableCamera();
    expect(stream).toBeNull();
    expect(service.getState().error?.toLowerCase()).toContain('permission denied');

    await service.disconnect();
    expect(service.getState().isConnected).toBe(false);
    expect(service.getState().peerStreams).toEqual({});
  });

  it('handles QUOTA_EXCEEDED gracefully without throwing', async () => {
    const service = new LiveKitMediaService(async () => {
      throw new BackendError('QUOTA_EXCEEDED', 'Monthly media limit reached', 429);
    });

    await expect(service.connect('room-1')).resolves.toBeUndefined();
    expect(service.getState().quotaExhausted).toBe(true);
    expect(service.getState().isConnected).toBe(false);
    expect(service.getState().error).toContain('Monthly media limit reached');
  });
});
