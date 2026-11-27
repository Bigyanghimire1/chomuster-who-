export const corsHeaders: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

export function handleCors(req: Request): Response | null {
  if (req.method.toUpperCase() === 'OPTIONS') {
    return new Response('ok', {
      status: 200,
      headers: corsHeaders,
    });
  }
  return null;
}

export type ErrorCode =
  | 'BACKEND_PAUSED'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'ROOM_NOT_FOUND'
  | 'ROOM_FULL'
  | 'INVALID_STATE'
  | 'INVALID_INPUT'
  | 'QUOTA_EXCEEDED'
  | 'INTERNAL_ERROR';

export function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  });
}

export function errorResponse(
  status: number,
  code: ErrorCode,
  message: string,
  details?: unknown,
): Response {
  const errorPayload: { code: ErrorCode; message: string; details?: unknown } = {
    code,
    message,
  };
  if (details !== undefined) {
    errorPayload.details = details;
  }
  return jsonResponse({ error: errorPayload }, status);
}
