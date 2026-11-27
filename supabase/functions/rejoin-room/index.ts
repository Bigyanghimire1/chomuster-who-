import { handleCors, jsonResponse, errorResponse } from '../_shared/cors.ts';
import {
  authenticateCaller,
  sha256Hex,
  generateOpaqueToken,
  type AuthDeps,
} from '../_shared/auth.ts';

declare const Deno:
  | { serve?: (handler: (req: Request) => Response | Promise<Response>) => unknown }
  | undefined;

const CREDENTIAL_TTL_MS = 24 * 60 * 60 * 1000;

export async function handleRejoinRoom(req: Request, deps?: AuthDeps): Promise<Response> {
  const corsRes = handleCors(req);
  if (corsRes) return corsRes;

  if (req.method !== 'POST') {
    return errorResponse(405, 'INVALID_INPUT', 'Method not allowed');
  }

  const authResult = await authenticateCaller(req, deps);
  if (authResult instanceof Response) return authResult;
  const { user, adminClient } = authResult;

  let body: Record<string, unknown>;
  try {
    const parsed = await req.json();
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return errorResponse(400, 'INVALID_INPUT', 'Request body must be a JSON object');
    }
    body = parsed as Record<string, unknown>;
  } catch {
    return errorResponse(400, 'INVALID_INPUT', 'Invalid JSON body');
  }

  const rejoinToken = typeof body.rejoinToken === 'string' ? body.rejoinToken.trim() : '';
  if (!rejoinToken) {
    return errorResponse(400, 'INVALID_INPUT', 'rejoinToken is required');
  }

  const roomId = typeof body.roomId === 'string' ? body.roomId.trim() : '';
  const roomCode = typeof body.roomCode === 'string' ? body.roomCode.trim().toUpperCase() : '';
  if (!roomId && !roomCode) {
    return errorResponse(400, 'INVALID_INPUT', 'roomId or roomCode is required');
  }

  let roomQuery = adminClient.from('rooms').select('*');
  roomQuery = roomId ? roomQuery.eq('id', roomId) : roomQuery.eq('code', roomCode);
  const { data: room, error: roomErr } = await roomQuery.maybeSingle();

  if (roomErr) {
    return errorResponse(500, 'INTERNAL_ERROR', roomErr.message || 'Failed to lookup room');
  }

  if (!room) {
    return errorResponse(404, 'ROOM_NOT_FOUND', 'Room not found');
  }

  const tokenHash = await sha256Hex(rejoinToken);
  const { data: cred, error: credLookupErr } = await adminClient
    .from('room_player_credentials')
    .select('*')
    .eq('room_id', room.id)
    .eq('rejoin_token_hash', tokenHash)
    .maybeSingle();

  if (credLookupErr) {
    return errorResponse(
      500,
      'INTERNAL_ERROR',
      credLookupErr.message || 'Failed to verify rejoin token'
    );
  }

  if (!cred || new Date(cred.expires_at) <= new Date()) {
    return errorResponse(401, 'UNAUTHORIZED', 'Invalid or expired rejoin token');
  }

  const { data: player, error: playerLookupErr } = await adminClient
    .from('room_players')
    .select('*')
    .eq('id', cred.player_id)
    .eq('room_id', room.id)
    .maybeSingle();

  if (playerLookupErr) {
    return errorResponse(
      500,
      'INTERNAL_ERROR',
      playerLookupErr.message || 'Failed to load player record'
    );
  }

  if (!player) {
    return errorResponse(401, 'UNAUTHORIZED', 'Invalid or expired rejoin token');
  }

  const now = Date.now();
  const nowIso = new Date(now).toISOString();
  const expiresAt = new Date(now + CREDENTIAL_TTL_MS).toISOString();

  let updatedRoom = room;
  const oldUserId = player.user_id as string;
  const playerUpdate: Record<string, unknown> = {
    is_connected: true,
    last_seen_at: nowIso,
  };

  if (oldUserId !== user.id) {
    playerUpdate.user_id = user.id;
  }

  const { data: updatedPlayer, error: playerUpdateErr } = await adminClient
    .from('room_players')
    .update(playerUpdate)
    .eq('id', player.id)
    .select('*')
    .single();

  if (playerUpdateErr || !updatedPlayer) {
    return errorResponse(
      500,
      'INTERNAL_ERROR',
      playerUpdateErr?.message || 'Failed to update player session'
    );
  }

  if (oldUserId !== user.id) {
    const roomUpdates: Record<string, unknown> = {};
    if (player.is_host || room.host_user_id === oldUserId) {
      roomUpdates.host_user_id = user.id;
    }
    if (Array.isArray(room.turn_order) && room.turn_order.includes(oldUserId)) {
      roomUpdates.turn_order = room.turn_order.map((id: unknown) =>
        id === oldUserId ? user.id : id
      );
    }
    if (Array.isArray(room.runoff_candidate_ids) && room.runoff_candidate_ids.includes(oldUserId)) {
      roomUpdates.runoff_candidate_ids = room.runoff_candidate_ids.map((id: unknown) =>
        id === oldUserId ? user.id : id
      );
    }

    if (Object.keys(roomUpdates).length > 0) {
      const { data: reboundRoom } = await adminClient
        .from('rooms')
        .update(roomUpdates)
        .eq('id', room.id)
        .select('*')
        .single();
      if (reboundRoom) {
        updatedRoom = reboundRoom;
      }
    }

    if (typeof room.round_number === 'number' && room.round_number >= 1) {
      await adminClient
        .from('player_secrets')
        .update({ user_id: user.id })
        .eq('room_id', room.id)
        .eq('user_id', oldUserId)
        .eq('round_number', room.round_number);

      await adminClient
        .from('votes')
        .update({ voter_user_id: user.id })
        .eq('room_id', room.id)
        .eq('round_number', room.round_number)
        .eq('voter_user_id', oldUserId);

      await adminClient
        .from('votes')
        .update({ target_user_id: user.id })
        .eq('room_id', room.id)
        .eq('round_number', room.round_number)
        .eq('target_user_id', oldUserId);
    }
  }

  const newRejoinToken = generateOpaqueToken(32);
  const newTokenHash = await sha256Hex(newRejoinToken);

  const { error: credUpdateErr } = await adminClient
    .from('room_player_credentials')
    .update({
      rejoin_token_hash: newTokenHash,
      rotated_at: nowIso,
      expires_at: expiresAt,
    })
    .eq('player_id', updatedPlayer.id);

  if (credUpdateErr) {
    return errorResponse(
      500,
      'INTERNAL_ERROR',
      credUpdateErr.message || 'Failed to rotate rejoin token'
    );
  }

  let mySecret: Record<string, unknown> | null = null;
  if (
    updatedRoom.phase !== 'LOBBY' &&
    typeof updatedRoom.round_number === 'number' &&
    updatedRoom.round_number >= 1
  ) {
    const { data: secretRow, error: secretErr } = await adminClient
      .from('player_secrets')
      .select('id, room_id, user_id, round_number, is_chomu, role, secret_word, hint, created_at')
      .eq('room_id', updatedRoom.id)
      .eq('user_id', user.id)
      .eq('round_number', updatedRoom.round_number)
      .maybeSingle();

    if (secretErr) {
      return errorResponse(
        500,
        'INTERNAL_ERROR',
        secretErr.message || 'Failed to load player secret'
      );
    }
    mySecret = (secretRow as Record<string, unknown> | null) ?? null;
  }

  const { data: players, error: playersErr } = await adminClient
    .from('room_players')
    .select('*')
    .eq('room_id', updatedRoom.id);

  if (playersErr) {
    return errorResponse(500, 'INTERNAL_ERROR', playersErr.message || 'Failed to fetch players');
  }

  return jsonResponse(
    {
      room: updatedRoom,
      player: updatedPlayer,
      players: players ?? [],
      mySecret,
      rejoinToken: newRejoinToken,
    },
    200
  );
}

if (typeof Deno !== 'undefined' && typeof Deno.serve === 'function') {
  Deno.serve((req) => handleRejoinRoom(req));
}
