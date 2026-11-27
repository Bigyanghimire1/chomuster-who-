import { handleCors, jsonResponse, errorResponse } from '../_shared/cors.ts';
import {
  authenticateCaller,
  sha256Hex,
  generateOpaqueToken,
  type AuthDeps,
} from '../_shared/auth.ts';
import {
  generateRoomCode,
  validateAndNormalizeSettings,
  type RoomSettings,
} from '../_shared/gameLogic.ts';

declare const Deno:
  | { serve?: (handler: (req: Request) => Response | Promise<Response>) => unknown }
  | undefined;

const DEFAULT_CATEGORY_IDS = ['everyday_objects', 'food_drinks', 'animals'];
const MAX_CODE_ATTEMPTS = 5;
const CREDENTIAL_TTL_MS = 24 * 60 * 60 * 1000;

function isUniqueViolation(err: { code?: string; message?: string } | null | undefined): boolean {
  if (!err) return false;
  if (err.code === '23505') return true;
  const msg = (err.message ?? '').toLowerCase();
  return msg.includes('duplicate key') || msg.includes('unique');
}

export async function handleCreateRoom(req: Request, deps?: AuthDeps): Promise<Response> {
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

  const displayName = typeof body.displayName === 'string' ? body.displayName.trim() : '';
  if (displayName.length < 1 || displayName.length > 24) {
    return errorResponse(400, 'INVALID_INPUT', 'displayName must be between 1 and 24 characters');
  }

  const avatarId = typeof body.avatarId === 'string' ? body.avatarId.trim() : '';
  if (!avatarId) {
    return errorResponse(400, 'INVALID_INPUT', 'avatarId is required');
  }

  let settings: RoomSettings;
  try {
    const rawSettings =
      body.settings !== undefined &&
      body.settings !== null &&
      typeof body.settings === 'object' &&
      !Array.isArray(body.settings)
        ? {
            categoryIds: DEFAULT_CATEGORY_IDS,
            ...(body.settings as Record<string, unknown>),
          }
        : body.settings === undefined || body.settings === null
        ? { categoryIds: DEFAULT_CATEGORY_IDS }
        : body.settings;

    settings = validateAndNormalizeSettings(rawSettings);
  } catch (err) {
    return errorResponse(
      400,
      'INVALID_INPUT',
      err instanceof Error ? err.message : 'Invalid room settings'
    );
  }

  let room: Record<string, unknown> | null = null;
  for (let attempt = 0; attempt < MAX_CODE_ATTEMPTS; attempt++) {
    const code = generateRoomCode(4);
    const { data, error } = await adminClient
      .from('rooms')
      .insert({
        code,
        host_user_id: user.id,
        phase: 'LOBBY',
        settings,
      })
      .select('*')
      .single();

    if (!error && data) {
      room = data as Record<string, unknown>;
      break;
    }

    if (isUniqueViolation(error)) {
      continue;
    }

    return errorResponse(500, 'INTERNAL_ERROR', error?.message || 'Failed to create room');
  }

  if (!room) {
    return errorResponse(500, 'INTERNAL_ERROR', 'Failed to generate a unique room code');
  }

  const { data: player, error: playerErr } = await adminClient
    .from('room_players')
    .insert({
      room_id: room.id,
      user_id: user.id,
      display_name: displayName,
      avatar_id: avatarId,
      is_host: true,
      is_ready: false,
      is_connected: true,
    })
    .select('*')
    .single();

  if (playerErr || !player) {
    await adminClient.from('rooms').delete().eq('id', room.id);
    return errorResponse(500, 'INTERNAL_ERROR', playerErr?.message || 'Failed to add host to room');
  }

  const rejoinToken = generateOpaqueToken(32);
  const tokenHash = await sha256Hex(rejoinToken);
  const now = Date.now();
  const rotatedAt = new Date(now).toISOString();
  const expiresAt = new Date(now + CREDENTIAL_TTL_MS).toISOString();

  const [{ error: credErr }] = await Promise.all([
    adminClient.from('room_player_credentials').insert({
      player_id: player.id,
      room_id: room.id,
      rejoin_token_hash: tokenHash,
      rotated_at: rotatedAt,
      expires_at: expiresAt,
    }),
    adminClient.from('lobby_chat').insert({
      room_id: room.id,
      user_id: null,
      sender_name: 'System',
      message: `${displayName} created the room.`,
      is_system: true,
    }),
  ]);

  if (credErr) {
    await adminClient.from('rooms').delete().eq('id', room.id);
    return errorResponse(
      500,
      'INTERNAL_ERROR',
      credErr.message || 'Failed to store rejoin credentials'
    );
  }

  return jsonResponse({ room, player, rejoinToken }, 201);
}

if (typeof Deno !== 'undefined' && typeof Deno.serve === 'function') {
  Deno.serve((req) => handleCreateRoom(req));
}
