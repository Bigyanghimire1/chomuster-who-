import { errorResponse } from './cors.ts';

export interface AuthDeps {
  createSupabaseClient?: (url: string, key: string, options?: unknown) => any;
  env?: Record<string, string | undefined>;
}

interface DenoLike {
  env?: {
    get?: (name: string) => string | undefined;
  };
}

interface ProcessLike {
  env?: Record<string, string | undefined>;
}

export function getEnv(name: string, deps?: AuthDeps): string | undefined {
  if (deps?.env && Object.prototype.hasOwnProperty.call(deps.env, name)) {
    return deps.env[name];
  }

  const denoGlobal = (globalThis as { Deno?: DenoLike }).Deno;
  if (typeof denoGlobal !== 'undefined' && typeof denoGlobal?.env?.get === 'function') {
    return denoGlobal.env.get(name);
  }

  const processGlobal = (globalThis as { process?: ProcessLike }).process;
  if (typeof processGlobal !== 'undefined' && processGlobal?.env) {
    return processGlobal.env[name];
  }

  return undefined;
}

export async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await globalThis.crypto.subtle.digest('SHA-256', data);
  const bytes = new Uint8Array(digest);
  let hex = '';
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, '0');
  }
  return hex;
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function generateOpaqueToken(byteLength = 32): string {
  if (!Number.isInteger(byteLength) || byteLength <= 0) {
    throw new RangeError('byteLength must be a positive integer');
  }
  const bytes = new Uint8Array(byteLength);
  globalThis.crypto.getRandomValues(bytes);
  return bytesToBase64Url(bytes);
}

async function resolveCreateClient(
  deps?: AuthDeps,
): Promise<(url: string, key: string, options?: unknown) => any> {
  if (deps?.createSupabaseClient) {
    return deps.createSupabaseClient;
  }
  const supabaseModuleUrl = 'https://esm.sh/@supabase/supabase-js@2';
  const mod = (await import(/* @vite-ignore */ supabaseModuleUrl)) as {
    createClient: (url: string, key: string, options?: unknown) => any;
  };
  return mod.createClient;
}

export async function authenticateCaller(
  req: Request,
  deps?: AuthDeps,
): Promise<{ user: { id: string }; userClient: any; adminClient: any } | Response> {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return errorResponse(401, 'UNAUTHORIZED', 'Missing Authorization header');
  }

  const match = /^Bearer\s+(.+)$/i.exec(authHeader.trim());
  const jwt = match?.[1]?.trim();
  if (!jwt) {
    return errorResponse(401, 'UNAUTHORIZED', 'Invalid Authorization header format');
  }

  const supabaseUrl = getEnv('SUPABASE_URL', deps);
  const supabaseAnonKey = getEnv('SUPABASE_ANON_KEY', deps);
  const supabaseServiceRoleKey = getEnv('SUPABASE_SERVICE_ROLE_KEY', deps);

  if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey) {
    return errorResponse(500, 'INTERNAL_ERROR', 'Missing Supabase environment configuration');
  }

  const createSupabaseClient = await resolveCreateClient(deps);

  const userClient = createSupabaseClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const adminClient = createSupabaseClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  try {
    const { data, error } = await userClient.auth.getUser();
    if (error || !data?.user?.id) {
      return errorResponse(401, 'UNAUTHORIZED', 'Invalid or expired authentication token');
    }

    return {
      user: { id: data.user.id },
      userClient,
      adminClient,
    };
  } catch {
    return errorResponse(401, 'UNAUTHORIZED', 'Failed to verify authentication token');
  }
}
