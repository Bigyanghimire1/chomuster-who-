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

const MAX_ROOM_PLAYERS = 15;
const CREDENTIAL_TTL_MS = 24 * 60 * 60 * 1000;

export async function handleJoinRoom(req: Request, deps?: AuthDeps): Promise<Response> {
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

  const code = typeof body.code === 'string' ? body.code.trim().toUpperCase() : '';
  if (!/^[A-Z0-9]{4,8}$/.test(code)) {
    return errorResponse(400, 'INVALID_INPUT', 'Valid room code is required');
  }

  const displayName = typeof body.displayName === 'string' ? body.displayName.trim() : '';
  if (displayName.length < 1 || displayName.length > 24) {
    return errorResponse(400, 'INVALID_INPUT', 'displayName must be between 1 and 24 characters');
  }

  const avatarId = typeof body.avatarId === 'string' ? body.avatarId.trim() : '';
  if (!avatarId) {
    return errorResponse(400, 'INVALID_INPUT', 'avatarId is required');
  }

  const { data: room, error: roomErr } = await adminClient
    .from('rooms')
    .select('*')
    .eq('code', code)
    .maybeSingle();

  if (roomErr) {
    return errorResponse(500, 'INTERNAL_ERROR', roomErr.message || 'Failed to lookup room');
  }

  if (!room) {
    return errorResponse(404, 'ROOM_NOT_FOUND', 'Room doesn’t exist. Check the room code and try again.');
  }

  const { data: existingPlayer, error: existingErr } = await adminClient
    .from('room_players')
    .select('*')
    .eq('room_id', room.id)
    .eq('user_id', user.id)
    .maybeSingle();

  if (existingErr) {
    return errorResponse(500, 'INTERNAL_ERROR', existingErr.message || 'Failed to check membership');
  }

  const now = Date.now();
  const nowIso = new Date(now).toISOString();
  const expiresAt = new Date(now + CREDENTIAL_TTL_MS).toISOString();

  if (existingPlayer) {
    const { data: updatedPlayer, error: updateErr } = await adminClient
      .from('room_players')
      .update({
        display_name: displayName,
        avatar_id: avatarId,
        is_connected: true,
        last_seen_at: nowIso,
      })
      .eq('id', existingPlayer.id)
      .select('*')
      .single();

    if (updateErr || !updatedPlayer) {
      return errorResponse(
        500,
        'INTERNAL_ERROR',
        updateErr?.message || 'Failed to update player state'
      );
    }

    const rejoinToken = generateOpaqueToken(32);
    const tokenHash = await sha256Hex(rejoinToken);

    const { error: credErr } = await adminClient.from('room_player_credentials').upsert(
      {
        player_id: updatedPlayer.id,
        room_id: room.id,
        rejoin_token_hash: tokenHash,
        rotated_at: nowIso,
        expires_at: expiresAt,
      },
      { onConflict: 'player_id' }
    );

    if (credErr) {
      return errorResponse(
        500,
        'INTERNAL_ERROR',
        credErr.message || 'Failed to rotate rejoin token'
      );
    }

    const { data: players, error: playersErr } = await adminClient
      .from('room_players')
      .select('*')
      .eq('room_id', room.id);

    if (playersErr) {
      return errorResponse(500, 'INTERNAL_ERROR', playersErr.message || 'Failed to fetch players');
    }

    return jsonResponse({ room, player: updatedPlayer, players: players ?? [], rejoinToken }, 200);
  }

  if (room.phase === 'CANCELLED' || room.phase === 'CLOSED') {
    return errorResponse(410, 'INVALID_STATE', 'This room is no longer available.');
  }

  if (room.phase !== 'LOBBY') {
    return errorResponse(409, 'INVALID_STATE', 'This room is already in a game and cannot be joined.');
  }

  const { data: currentPlayers, count, error: countErr } = await adminClient
    .from('room_players')
    .select('id', { count: 'exact' })
    .eq('room_id', room.id);

  if (countErr) {
    return errorResponse(500, 'INTERNAL_ERROR', countErr.message || 'Failed to check room capacity');
  }

  const playerCount = typeof count === 'number' ? count : (currentPlayers?.length ?? 0);
  if (playerCount >= MAX_ROOM_PLAYERS) {
    return errorResponse(409, 'ROOM_FULL', 'Room is full');
  }

  const { data: newPlayer, error: insertErr } = await adminClient
    .from('room_players')
    .insert({
      room_id: room.id,
      user_id: user.id,
      display_name: displayName,
      avatar_id: avatarId,
      is_host: false,
      is_ready: false,
      is_connected: true,
    })
    .select('*')
    .single();

  if (insertErr || !newPlayer) {
    return errorResponse(500, 'INTERNAL_ERROR', insertErr?.message || 'Failed to join room');
  }

  const rejoinToken = generateOpaqueToken(32);
  const tokenHash = await sha256Hex(rejoinToken);

  const { error: credErr } = await adminClient.from('room_player_credentials').upsert(
    {
      player_id: newPlayer.id,
      room_id: room.id,
      rejoin_token_hash: tokenHash,
      rotated_at: nowIso,
      expires_at: expiresAt,
    },
    { onConflict: 'player_id' }
  );

  if (credErr) {
    await adminClient.from('room_players').delete().eq('id', newPlayer.id);
    return errorResponse(
      500,
      'INTERNAL_ERROR',
      credErr.message || 'Failed to store rejoin credentials'
    );
  }

  await adminClient.from('lobby_chat').insert({
    room_id: room.id,
    user_id: null,
    sender_name: 'System',
    message: `${displayName} joined the room.`,
    is_system: true,
  });

  const { data: players, error: playersErr } = await adminClient
    .from('room_players')
    .select('*')
    .eq('room_id', room.id);

  if (playersErr) {
    return errorResponse(500, 'INTERNAL_ERROR', playersErr.message || 'Failed to fetch players');
  }

  return jsonResponse({ room, player: newPlayer, players: players ?? [], rejoinToken }, 200);
}

if (typeof Deno !== 'undefined' && typeof Deno.serve === 'function') {
  Deno.serve((req) => handleJoinRoom(req));
}
