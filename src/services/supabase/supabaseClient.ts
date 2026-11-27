import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { getSupabaseConfig } from '../backendConfig';

const BACKEND_PAUSED_MESSAGE =
  'Unable to reach game server. It may be paused — try Pass & Play or ask the host to wake the backend.';

export class BackendError extends Error {
  constructor(
    public code: string,
    message: string,
    public status?: number,
  ) {
    super(message);
    this.name = 'BackendError';
  }
}

let cachedClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (!cachedClient) {
    const { url, anonKey } = getSupabaseConfig();
    cachedClient = createClient(url, anonKey);
  }
  return cachedClient;
}

function isPausedOrNetworkError(status?: number, message?: string): boolean {
  if (status === 503 || status === 521 || status === 502 || status === 504 || status === 0) {
    return true;
  }
  if (!message) return false;
  const lower = message.toLowerCase();
  return (
    lower.includes('failed to fetch') ||
    lower.includes('networkerror') ||
    lower.includes('network request failed') ||
    lower.includes('fetch failed') ||
    lower.includes('paused') ||
    lower.includes('econnrefused') ||
    lower.includes('503') ||
    lower.includes('521')
  );
}

export async function ensureAnonymousSession(client?: SupabaseClient): Promise<string> {
  const supabase = client ?? getSupabaseClient();

  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const existingUserId = sessionData?.session?.user?.id;
    if (existingUserId) {
      return existingUserId;
    }

    const { data: signInData, error: signInError } = await supabase.auth.signInAnonymously();
    if (signInError || !signInData?.user?.id) {
      throw new BackendError('BACKEND_PAUSED', BACKEND_PAUSED_MESSAGE);
    }

    return signInData.user.id;
  } catch (err) {
    if (err instanceof BackendError) {
      throw err;
    }
    throw new BackendError('BACKEND_PAUSED', BACKEND_PAUSED_MESSAGE);
  }
}

interface StructuredErrorEnvelope {
  error?: {
    code?: string;
    message?: string;
  };
  code?: string;
  message?: string;
}

async function extractErrorDetails(
  error: unknown,
): Promise<{ code?: string; message?: string; status?: number }> {
  if (!error || typeof error !== 'object') {
    return {};
  }

  const errObj = error as {
    message?: string;
    status?: number;
    context?: unknown;
  };

  let status: number | undefined = typeof errObj.status === 'number' ? errObj.status : undefined;
  let code: string | undefined;
  let message: string | undefined = typeof errObj.message === 'string' ? errObj.message : undefined;

  const ctx = errObj.context;
  if (ctx && typeof ctx === 'object') {
    const maybeResponse = ctx as {
      status?: number;
      json?: () => Promise<unknown>;
      clone?: () => { json: () => Promise<unknown> };
    };

    if (typeof maybeResponse.status === 'number') {
      status = maybeResponse.status;
    }

    const jsonFn = maybeResponse.json;
    if (typeof jsonFn === 'function') {
      try {
        const parsed = (
          typeof maybeResponse.clone === 'function'
            ? await maybeResponse.clone().json()
            : await jsonFn.call(maybeResponse)
        ) as StructuredErrorEnvelope | null;
        if (parsed?.error) {
          code = parsed.error.code ?? code;
          message = parsed.error.message ?? message;
        } else if (parsed) {
          code = parsed.code ?? code;
          message = parsed.message ?? message;
        }
      } catch {
        // Response body was not JSON; fall back to status/message handling.
      }
    } else {
      const plainCtx = ctx as StructuredErrorEnvelope;
      if (plainCtx.error) {
        code = plainCtx.error.code ?? code;
        message = plainCtx.error.message ?? message;
      } else {
        code = plainCtx.code ?? code;
        message = plainCtx.message ?? message;
      }
    }
  }

  return { code, message, status };
}

export async function invokeEdgeFunction<T>(
  fnName: string,
  body: Record<string, unknown>,
  client?: SupabaseClient,
): Promise<T> {
  const supabase = client ?? getSupabaseClient();

  let response: { data: unknown; error: unknown };
  try {
    response = await supabase.functions.invoke(fnName, { body });
  } catch (err) {
    const msg = err instanceof Error ? err.message : undefined;
    if (isPausedOrNetworkError(undefined, msg)) {
      throw new BackendError('BACKEND_PAUSED', BACKEND_PAUSED_MESSAGE);
    }
    throw new BackendError('INTERNAL_ERROR', msg || `Failed to invoke ${fnName}`);
  }

  const { data, error } = response;

  if (error) {
    const details = await extractErrorDetails(error);
    if (isPausedOrNetworkError(details.status, details.message)) {
      throw new BackendError('BACKEND_PAUSED', BACKEND_PAUSED_MESSAGE, details.status);
    }
    if (details.code) {
      throw new BackendError(
        details.code,
        details.message || `Edge function ${fnName} failed`,
        details.status,
      );
    }
    throw new BackendError(
      'INTERNAL_ERROR',
      details.message || `Edge function ${fnName} failed`,
      details.status,
    );
  }

  if (data && typeof data === 'object' && 'error' in data) {
    const errPayload = (data as StructuredErrorEnvelope).error;
    if (errPayload && typeof errPayload === 'object') {
      const code = errPayload.code || 'INTERNAL_ERROR';
      const message = errPayload.message || `Edge function ${fnName} returned an error`;
      if (code === 'BACKEND_PAUSED' || isPausedOrNetworkError(undefined, message)) {
        throw new BackendError('BACKEND_PAUSED', BACKEND_PAUSED_MESSAGE);
      }
      throw new BackendError(code, message);
    }
  }

  return data as T;
}
