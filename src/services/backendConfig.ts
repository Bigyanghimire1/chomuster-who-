export type MultiplayerBackend = 'trystero' | 'supabase';

export interface BackendEnvConfig {
  backend?: string;
  supabaseUrl?: string;
  supabaseAnonKey?: string;
}

function readViteEnv(): BackendEnvConfig {
  const env = (import.meta as { env?: Record<string, string | undefined> }).env ?? {};
  return {
    backend: env.VITE_MULTIPLAYER_BACKEND,
    supabaseUrl: env.VITE_SUPABASE_URL,
    supabaseAnonKey: env.VITE_SUPABASE_ANON_KEY,
  };
}

export function isSupabaseConfigured(override?: BackendEnvConfig): boolean {
  const cfg = override ?? readViteEnv();
  return Boolean(cfg.supabaseUrl?.trim() && cfg.supabaseAnonKey?.trim());
}

/**
 * Selects the active multiplayer backend.
 * Defaults to 'trystero' unless VITE_MULTIPLAYER_BACKEND === 'supabase'
 * AND both VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are configured.
 */
export function getActiveMultiplayerBackend(override?: BackendEnvConfig): MultiplayerBackend {
  const cfg = override ?? readViteEnv();
  if (cfg.backend === 'supabase' && isSupabaseConfigured(cfg)) {
    return 'supabase';
  }
  return 'trystero';
}

export function getSupabaseConfig(override?: BackendEnvConfig): { url: string; anonKey: string } {
  const cfg = override ?? readViteEnv();
  const url = cfg.supabaseUrl?.trim() ?? '';
  const anonKey = cfg.supabaseAnonKey?.trim() ?? '';
  if (!url || !anonKey) {
    throw new Error('Supabase environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY) are not configured.');
  }
  return { url, anonKey };
}
