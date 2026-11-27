import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const SCHEMA_PATH = path.resolve(
  __dirname,
  '../../supabase/migrations/001_chomu_who_schema.sql'
);

const schemaSql = fs.readFileSync(SCHEMA_PATH, 'utf8');

/**
 * Extracts all CREATE POLICY blocks targeting a given qualified table name
 * (e.g. `public.votes` or `votes`).
 */
function getPoliciesForTable(sql: string, tableName: string): string[] {
  const regex = new RegExp(
    `CREATE\\s+POLICY\\s+[\\s\\S]*?\\s+ON\\s+(?:public\\.)?${tableName}\\b[\\s\\S]*?;`,
    'gi'
  );
  return sql.match(regex) ?? [];
}

/**
 * Extracts a CREATE [OR REPLACE] FUNCTION block by function name.
 */
function getFunctionBody(sql: string, fnName: string): string | null {
  const regex = new RegExp(
    `CREATE\\s+(?:OR\\s+REPLACE\\s+)?FUNCTION\\s+(?:public\\.)?${fnName}\\b[\\s\\S]*?\\$\\$;`,
    'i'
  );
  const match = sql.match(regex);
  return match ? match[0] : null;
}

describe('Supabase Schema & Security Invariants (001_chomu_who_schema.sql)', () => {
  const ALL_TABLES = [
    'rooms',
    'room_round_secrets',
    'room_players',
    'room_player_credentials',
    'player_secrets',
    'votes',
    'lobby_chat',
  ] as const;

  it('defines all 7 required tables and enables Row-Level Security on every table', () => {
    for (const table of ALL_TABLES) {
      const createTableRegex = new RegExp(
        `CREATE\\s+TABLE\\s+(?:IF\\s+NOT\\s+EXISTS\\s+)?(?:public\\.)?${table}\\b`,
        'i'
      );
      expect(schemaSql, `Missing CREATE TABLE for ${table}`).toMatch(
        createTableRegex
      );

      const enableRlsRegex = new RegExp(
        `ALTER\\s+TABLE\\s+(?:public\\.)?${table}\\s+ENABLE\\s+ROW\\s+LEVEL\\s+SECURITY\\s*;`,
        'i'
      );
      expect(schemaSql, `Missing ENABLE ROW LEVEL SECURITY for ${table}`).toMatch(
        enableRlsRegex
      );
    }
  });

  it('enforces zero client policies (including SELECT) on votes, room_player_credentials, and room_round_secrets', () => {
    const serverOnlyTables = [
      'votes',
      'room_player_credentials',
      'room_round_secrets',
    ] as const;

    for (const table of serverOnlyTables) {
      const policies = getPoliciesForTable(schemaSql, table);
      expect(
        policies,
        `Expected zero RLS policies on server-only table ${table}, found ${policies.length}`
      ).toHaveLength(0);
    }
  });

  it('restricts player_secrets SELECT to auth.uid() = user_id with no client write policies', () => {
    const policies = getPoliciesForTable(schemaSql, 'player_secrets');
    expect(policies).toHaveLength(1);

    const selectPolicy = policies[0];
    expect(selectPolicy).toMatch(/FOR\s+SELECT/i);
    expect(selectPolicy).toMatch(/auth\.uid\(\)\s*=\s*user_id/i);
    expect(selectPolicy).not.toMatch(/FOR\s+(INSERT|UPDATE|DELETE|ALL)/i);
  });

  it('restricts room_players to member SELECT only with zero client write policies', () => {
    const policies = getPoliciesForTable(schemaSql, 'room_players');
    expect(policies).toHaveLength(1);
    expect(policies[0]).toMatch(/FOR\s+SELECT/i);
    expect(policies[0]).toMatch(/is_room_member\(\s*room_id\s*\)/i);
    expect(policies[0]).not.toMatch(/FOR\s+(INSERT|UPDATE|DELETE|ALL)/i);
  });

  it('keeps secret_word and chomu_ids NULL outside RESULTS on rooms', () => {
    expect(schemaSql).toMatch(
      /CONSTRAINT\s+rooms_secrets_only_in_results\s+CHECK\s*\(\s*phase\s*=\s*'RESULTS'\s+OR\s*\(\s*secret_word\s+IS\s+NULL\s+AND\s+chomu_ids\s+IS\s+NULL\s*\)\s*\)/i
    );
  });

  it('uses SECURITY DEFINER, SET search_path = public, and FOR UPDATE row locking in atomic RPCs', () => {
    const atomicRpcs = [
      'cast_vote_atomic',
      'advance_turn_atomic',
      'reset_lobby_atomic',
    ] as const;

    for (const rpc of atomicRpcs) {
      const body = getFunctionBody(schemaSql, rpc);
      expect(body, `Missing RPC ${rpc}`).not.toBeNull();
      if (!body) continue;

      expect(body, `${rpc} must be SECURITY DEFINER`).toMatch(
        /SECURITY\s+DEFINER/i
      );
      expect(body, `${rpc} must pin search_path = public`).toMatch(
        /SET\s+search_path\s*=\s*public/i
      );
      expect(body, `${rpc} must lock rooms row with FOR UPDATE`).toMatch(
        /FROM\s+public\.rooms[\s\S]*?FOR\s+UPDATE/i
      );
    }

    const membershipHelper = getFunctionBody(schemaSql, 'is_room_member');
    expect(membershipHelper).not.toBeNull();
    expect(membershipHelper).toMatch(/SECURITY\s+DEFINER/i);
    expect(membershipHelper).toMatch(/SET\s+search_path\s*=\s*public/i);
  });

  it('includes all required game phases and default timer settings (20s turn, 45s discussion)', () => {
    const requiredPhases = [
      'LOBBY',
      'ROLE_REVEAL',
      'ROUND',
      'DISCUSSION',
      'VOTING',
      'VOTING_RUNOFF',
      'RESULTS',
    ] as const;

    for (const phase of requiredPhases) {
      expect(schemaSql, `Missing phase ${phase}`).toMatch(
        new RegExp(`'${phase}'`)
      );
    }

    expect(schemaSql).toMatch(/'turnDurationSeconds'\s*,\s*20\b/);
    expect(schemaSql).toMatch(/'discussionDurationSeconds'\s*,\s*45\b/);
  });
});
