import { handleCors, jsonResponse, errorResponse } from '../_shared/cors.ts';
import { authenticateCaller, getEnv, type AuthDeps } from '../_shared/auth.ts';
import { mintLiveKitJwt } from '../_shared/gameLogic.ts';

const LIVEKIT_TOKEN_TTL_SECONDS = 7200;

export async function handleMintLiveKitToken(
  req: Request,
  deps?: AuthDeps,
): Promise<Response> {
  const corsRes = handleCors(req);
  if (corsRes) return corsRes;

  if (req.method !== 'POST') {
    return errorResponse(405, 'INVALID_INPUT', 'Method not allowed');
  }

  const auth = await authenticateCaller(req, deps);
  if (auth instanceof Response) return auth;
  const { user, adminClient } = auth;

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return errorResponse(400, 'INVALID_INPUT', 'Invalid JSON body');
  }

  const roomId = typeof body?.roomId === 'string' ? body.roomId.trim() : '';
  if (!roomId) {
    return errorResponse(400, 'INVALID_INPUT', 'roomId is required');
  }

  const { data: player, error: playerErr } = await adminClient
    .from('room_players')
    .select('id, user_id, display_name, is_connected')
    .eq('room_id', roomId)
    .eq('user_id', user.id)
    .maybeSingle();

  if (playerErr) {
    return errorResponse(
      500,
      'INTERNAL_ERROR',
      'Failed to verify room membership',
      playerErr.message,
    );
  }

  if (!player || !player.is_connected) {
    return errorResponse(
      403,
      'FORBIDDEN',
      'You must be a connected member of this room to join live media',
    );
  }

  if (getEnv('LIVEKIT_QUOTA_EXHAUSTED', deps) === 'true') {
    return errorResponse(
      429,
      'QUOTA_EXCEEDED',
      'Live video/audio quota reached for this month; text/gameplay still works.',
    );
  }

  const apiKey = getEnv('LIVEKIT_API_KEY', deps)?.trim();
  const apiSecret = getEnv('LIVEKIT_API_SECRET', deps)?.trim();
  const livekitUrl = getEnv('LIVEKIT_URL', deps)?.trim();

  if (!apiKey || !apiSecret || !livekitUrl) {
    return errorResponse(
      500,
      'INTERNAL_ERROR',
      'LiveKit server configuration is missing',
    );
  }

  const token = await mintLiveKitJwt({
    apiKey,
    apiSecret,
    roomName: roomId,
    identity: user.id,
    name: player.display_name,
    ttlSeconds: LIVEKIT_TOKEN_TTL_SECONDS,
  });

  return jsonResponse(
    {
      token,
      url: livekitUrl,
      roomName: roomId,
      identity: user.id,
      expiresInSeconds: LIVEKIT_TOKEN_TTL_SECONDS,
    },
    200,
  );
}

const denoRuntime = (
  globalThis as {
    Deno?: {
      serve?: (handler: (req: Request) => Promise<Response> | Response) => unknown;
    };
  }
).Deno;

if (typeof denoRuntime?.serve === 'function') {
  denoRuntime.serve((req: Request) => handleMintLiveKitToken(req));
}
