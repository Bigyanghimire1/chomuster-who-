-- ============================================================================
-- Chomu Who? — Zero-Cost Multiplayer Schema, Strict RLS & Atomic RPCs
-- Migration: 001_chomu_who_schema.sql
-- ============================================================================
-- Architecture notes:
--   - Anonymous / authenticated guests via Supabase Auth (auth.users).
--   - Rejoin credentials isolated in `room_player_credentials` (service_role only).
--   - Active-round secrets isolated in `room_round_secrets` (service_role only)
--     with a CHECK constraint on `rooms` guaranteeing `secret_word` and
--     `chomu_ids` remain NULL on `rooms` until `phase = 'RESULTS'`.
--   - Individual `votes` are never readable by clients, even after `RESULTS`.
--   - All phase transitions and vote tallies run inside `SECURITY DEFINER`
--     RPCs with `SELECT ... FOR UPDATE` on `rooms` to prevent race conditions.
-- ============================================================================

BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ----------------------------------------------------------------------------
-- 1. Tables
-- ----------------------------------------------------------------------------

-- 1.1 rooms
CREATE TABLE public.rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE CHECK (code ~ '^[A-Z0-9]{4,8}$'),
  host_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  phase text NOT NULL DEFAULT 'LOBBY' CHECK (
    phase IN (
      'LOBBY',
      'ROLE_REVEAL',
      'ROUND',
      'DISCUSSION',
      'VOTING',
      'VOTING_RUNOFF',
      'RESULTS'
    )
  ),
  settings jsonb NOT NULL DEFAULT jsonb_build_object(
    'categoryIds', '[]'::jsonb,
    'turnDurationSeconds', 20,
    'discussionDurationSeconds', 45,
    'votingDurationSeconds', 60,
    'hintDifficulty', 'subtle',
    'chomuCount', 1,
    'soundEnabled', true
  ),
  round_number integer NOT NULL DEFAULT 0 CHECK (round_number >= 0),
  secret_category text,
  turn_order jsonb NOT NULL DEFAULT '[]'::jsonb,
  current_turn_index integer NOT NULL DEFAULT 0 CHECK (current_turn_index >= 0),
  phase_deadline_at timestamptz,
  runoff_candidate_ids jsonb NOT NULL DEFAULT '[]'::jsonb,
  voting_result jsonb,
  winner text CHECK (winner IS NULL OR winner IN ('civilians', 'chomu')),
  -- Revealed ONLY when phase = 'RESULTS'; strictly NULL in all other phases.
  secret_word text,
  chomu_ids jsonb,
  state_version bigint NOT NULL DEFAULT 1 CHECK (state_version >= 1),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT rooms_secrets_only_in_results CHECK (
    phase = 'RESULTS' OR (secret_word IS NULL AND chomu_ids IS NULL)
  )
);

-- 1.2 room_round_secrets (server-only active round secrets; zero client policies)
CREATE TABLE public.room_round_secrets (
  room_id uuid NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  round_number integer NOT NULL CHECK (round_number >= 1),
  secret_word text NOT NULL,
  chomu_ids jsonb NOT NULL,
  hints jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (room_id, round_number)
);

-- 1.3 room_players
CREATE TABLE public.room_players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL CHECK (char_length(btrim(display_name)) BETWEEN 1 AND 24),
  avatar_id text NOT NULL,
  is_host boolean NOT NULL DEFAULT false,
  is_ready boolean NOT NULL DEFAULT false,
  is_connected boolean NOT NULL DEFAULT true,
  score integer NOT NULL DEFAULT 0 CHECK (score >= 0),
  has_seen_role boolean NOT NULL DEFAULT false,
  has_voted boolean NOT NULL DEFAULT false,
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (room_id, user_id)
);

-- 1.4 room_player_credentials (isolated from room_players; service_role only)
CREATE TABLE public.room_player_credentials (
  player_id uuid PRIMARY KEY REFERENCES public.room_players(id) ON DELETE CASCADE,
  room_id uuid NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  rejoin_token_hash text NOT NULL,
  rotated_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '24 hours')
);

-- 1.5 player_secrets (per-player role card; readable only by owner)
CREATE TABLE public.player_secrets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  round_number integer NOT NULL CHECK (round_number >= 1),
  is_chomu boolean NOT NULL,
  role text NOT NULL CHECK (role IN ('Civilian', 'Imposter')),
  secret_word text,
  hint text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (room_id, user_id, round_number),
  CONSTRAINT player_secrets_anti_cheat_shape CHECK (
    (is_chomu = false AND role = 'Civilian' AND hint IS NULL)
    OR (is_chomu = true AND role = 'Imposter' AND secret_word IS NULL)
  )
);

-- 1.6 votes (write-only via atomic RPC; zero client SELECT policies)
CREATE TABLE public.votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  round_number integer NOT NULL CHECK (round_number >= 1),
  is_runoff boolean NOT NULL DEFAULT false,
  voter_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (room_id, round_number, is_runoff, voter_user_id)
);

-- 1.7 lobby_chat
CREATE TABLE public.lobby_chat (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  sender_name text NOT NULL CHECK (char_length(btrim(sender_name)) BETWEEN 1 AND 24),
  message text NOT NULL CHECK (char_length(btrim(message)) BETWEEN 1 AND 500),
  is_system boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 2. Indexes & Triggers
-- ----------------------------------------------------------------------------

CREATE INDEX idx_rooms_code ON public.rooms (code);
CREATE INDEX idx_rooms_phase_deadline ON public.rooms (phase, phase_deadline_at)
  WHERE phase_deadline_at IS NOT NULL;

CREATE INDEX idx_room_players_room_id ON public.room_players (room_id);
CREATE INDEX idx_room_players_user_id ON public.room_players (user_id);

CREATE INDEX idx_room_player_credentials_room_id ON public.room_player_credentials (room_id);

CREATE INDEX idx_player_secrets_lookup ON public.player_secrets (room_id, user_id, round_number);

CREATE INDEX idx_votes_tally ON public.votes (room_id, round_number, is_runoff);

CREATE INDEX idx_lobby_chat_room_created ON public.lobby_chat (room_id, created_at);

CREATE OR REPLACE FUNCTION public.set_rooms_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_rooms_updated_at
  BEFORE UPDATE ON public.rooms
  FOR EACH ROW
  EXECUTE FUNCTION public.set_rooms_updated_at();

-- ----------------------------------------------------------------------------
-- 3. Membership Helper & Strict Row-Level Security (RLS)
-- ----------------------------------------------------------------------------

-- SECURITY DEFINER helper prevents infinite RLS recursion when policies on
-- `room_players` and sibling tables check room membership.
CREATE OR REPLACE FUNCTION public.is_room_member(p_room_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.room_players rp
    WHERE rp.room_id = p_room_id
      AND rp.user_id = auth.uid()
  );
$$;

REVOKE ALL ON FUNCTION public.is_room_member(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_room_member(uuid) TO authenticated, service_role;

-- Enable RLS on ALL tables (including server-only tables).
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_round_secrets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_player_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_secrets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lobby_chat ENABLE ROW LEVEL SECURITY;

-- rooms: authenticated room members can SELECT only.
-- (`secret_word` and `chomu_ids` are NULL until `phase = 'RESULTS'`.)
CREATE POLICY rooms_select_member
  ON public.rooms
  FOR SELECT
  TO authenticated
  USING (public.is_room_member(id));

-- Safe projection view (optional convenience for clients).
CREATE OR REPLACE VIEW public.public_rooms
WITH (security_invoker = true) AS
SELECT
  id,
  code,
  host_user_id,
  phase,
  settings,
  round_number,
  secret_category,
  turn_order,
  current_turn_index,
  phase_deadline_at,
  runoff_candidate_ids,
  voting_result,
  winner,
  CASE WHEN phase = 'RESULTS' THEN secret_word ELSE NULL END AS secret_word,
  CASE WHEN phase = 'RESULTS' THEN chomu_ids ELSE NULL END AS chomu_ids,
  state_version,
  created_at,
  updated_at
FROM public.rooms;

-- room_round_secrets: ZERO client policies (service_role only).

-- room_players: SELECT by room members; zero direct client INSERT/UPDATE/DELETE.
CREATE POLICY room_players_select_member
  ON public.room_players
  FOR SELECT
  TO authenticated
  USING (public.is_room_member(room_id));

-- room_player_credentials: ZERO client policies (service_role only).

-- player_secrets: SELECT only by the owning authenticated room member.
CREATE POLICY player_secrets_select_owner
  ON public.player_secrets
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id
    AND public.is_room_member(room_id)
  );

-- votes: ZERO client policies (individual vote records NEVER readable by clients).

-- lobby_chat: SELECT by room members; INSERT by authenticated room members for non-system messages.
CREATE POLICY lobby_chat_select_member
  ON public.lobby_chat
  FOR SELECT
  TO authenticated
  USING (public.is_room_member(room_id));

CREATE POLICY lobby_chat_insert_member
  ON public.lobby_chat
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND is_system = false
    AND public.is_room_member(room_id)
  );

-- ----------------------------------------------------------------------------
-- 4. Atomic SECURITY DEFINER RPC Helpers
-- ----------------------------------------------------------------------------

-- 4.1 cast_vote_atomic
-- Records a vote under a row-level lock on `rooms`, marks `has_voted`, and
-- automatically transitions to `VOTING_RUNOFF` (on first-round tie) or
-- `RESULTS` (when all connected players have voted).
CREATE OR REPLACE FUNCTION public.cast_vote_atomic(
  p_room_id uuid,
  p_voter_user_id uuid,
  p_target_user_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_caller uuid := auth.uid();
  v_room public.rooms%ROWTYPE;
  v_is_runoff boolean;
  v_total_voters integer;
  v_votes_cast integer;
  v_max_votes integer;
  v_most_voted uuid[];
  v_secret public.room_round_secrets%ROWTYPE;
  v_chomu_uuid_array uuid[];
  v_chomus_caught boolean;
  v_winner text;
  v_votes_map jsonb;
  v_vote_counts jsonb;
  v_voting_result jsonb;
  v_voting_secs integer;
BEGIN
  IF v_caller IS NOT NULL AND v_caller <> p_voter_user_id THEN
    RAISE EXCEPTION 'Cannot cast vote on behalf of another user'
      USING ERRCODE = '42501';
  END IF;

  SELECT *
  INTO v_room
  FROM public.rooms
  WHERE id = p_room_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Room not found' USING ERRCODE = 'P0002';
  END IF;

  IF v_room.phase NOT IN ('VOTING', 'VOTING_RUNOFF') THEN
    RAISE EXCEPTION 'Room is not in a voting phase (current: %)', v_room.phase
      USING ERRCODE = 'P0001';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.room_players
    WHERE room_id = p_room_id AND user_id = p_voter_user_id
  ) THEN
    RAISE EXCEPTION 'Voter is not a member of this room' USING ERRCODE = '42501';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.room_players
    WHERE room_id = p_room_id AND user_id = p_target_user_id
  ) THEN
    RAISE EXCEPTION 'Vote target is not a member of this room' USING ERRCODE = '22023';
  END IF;

  v_is_runoff := (v_room.phase = 'VOTING_RUNOFF');

  IF v_is_runoff AND NOT (
    v_room.runoff_candidate_ids ? p_target_user_id::text
  ) THEN
    RAISE EXCEPTION 'Vote target is not a runoff candidate' USING ERRCODE = '22023';
  END IF;

  INSERT INTO public.votes (
    room_id,
    round_number,
    is_runoff,
    voter_user_id,
    target_user_id
  )
  VALUES (
    p_room_id,
    v_room.round_number,
    v_is_runoff,
    p_voter_user_id,
    p_target_user_id
  )
  ON CONFLICT (room_id, round_number, is_runoff, voter_user_id) DO NOTHING;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Player has already voted in this ballot' USING ERRCODE = '23505';
  END IF;

  UPDATE public.room_players
  SET has_voted = true,
      last_seen_at = now()
  WHERE room_id = p_room_id
    AND user_id = p_voter_user_id;

  SELECT count(*)::integer
  INTO v_total_voters
  FROM public.room_players
  WHERE room_id = p_room_id
    AND is_connected = true;

  -- Fallback in case all players briefly appear disconnected
  IF v_total_voters = 0 THEN
    SELECT count(*)::integer
    INTO v_total_voters
    FROM public.room_players
    WHERE room_id = p_room_id;
  END IF;

  SELECT count(*)::integer
  INTO v_votes_cast
  FROM public.votes
  WHERE room_id = p_room_id
    AND round_number = v_room.round_number
    AND is_runoff = v_is_runoff;

  IF v_votes_cast < v_total_voters THEN
    UPDATE public.rooms
    SET state_version = state_version + 1
    WHERE id = p_room_id
    RETURNING * INTO v_room;

    RETURN jsonb_build_object(
      'ok', true,
      'phase', v_room.phase,
      'votesCast', v_votes_cast,
      'totalVoters', v_total_voters,
      'allVoted', false,
      'stateVersion', v_room.state_version
    );
  END IF;

  -- All eligible players have voted: tally the ballot.
  WITH counts AS (
    SELECT target_user_id, count(*)::integer AS cnt
    FROM public.votes
    WHERE room_id = p_room_id
      AND round_number = v_room.round_number
      AND is_runoff = v_is_runoff
    GROUP BY target_user_id
  )
  SELECT max(cnt) INTO v_max_votes FROM counts;

  SELECT array_agg(target_user_id ORDER BY target_user_id)
  INTO v_most_voted
  FROM (
    SELECT target_user_id, count(*)::integer AS cnt
    FROM public.votes
    WHERE room_id = p_room_id
      AND round_number = v_room.round_number
      AND is_runoff = v_is_runoff
    GROUP BY target_user_id
    HAVING count(*)::integer = v_max_votes
  ) top_targets;

  -- Tie on initial ballot -> transition to VOTING_RUNOFF
  IF NOT v_is_runoff AND COALESCE(array_length(v_most_voted, 1), 0) > 1 THEN
    v_voting_secs := GREATEST(15, COALESCE((v_room.settings->>'votingDurationSeconds')::integer, 60));

    UPDATE public.room_players
    SET has_voted = false
    WHERE room_id = p_room_id;

    UPDATE public.rooms
    SET phase = 'VOTING_RUNOFF',
        runoff_candidate_ids = to_jsonb(v_most_voted),
        phase_deadline_at = now() + make_interval(secs => v_voting_secs),
        state_version = state_version + 1
    WHERE id = p_room_id
    RETURNING * INTO v_room;

    RETURN jsonb_build_object(
      'ok', true,
      'phase', v_room.phase,
      'runoffCandidateIds', v_room.runoff_candidate_ids,
      'allVoted', true,
      'stateVersion', v_room.state_version
    );
  END IF;

  -- Finalize round -> RESULTS
  SELECT *
  INTO v_secret
  FROM public.room_round_secrets
  WHERE room_id = p_room_id
    AND round_number = v_room.round_number;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Missing round secrets for room % round %', p_room_id, v_room.round_number
      USING ERRCODE = 'P0002';
  END IF;

  SELECT array_agg(elem::uuid)
  INTO v_chomu_uuid_array
  FROM jsonb_array_elements_text(v_secret.chomu_ids) AS elem;

  -- Civilians win only if a single top-voted suspect is a Chomu.
  v_chomus_caught := (
    COALESCE(array_length(v_most_voted, 1), 0) = 1
    AND v_most_voted[1] = ANY(v_chomu_uuid_array)
  );
  v_winner := CASE WHEN v_chomus_caught THEN 'civilians' ELSE 'chomu' END;

  UPDATE public.room_players
  SET score = score + CASE
    WHEN v_chomus_caught AND NOT (user_id = ANY(v_chomu_uuid_array)) THEN 1
    WHEN NOT v_chomus_caught AND (user_id = ANY(v_chomu_uuid_array)) THEN 1
    ELSE 0
  END
  WHERE room_id = p_room_id;

  SELECT COALESCE(jsonb_object_agg(voter_user_id::text, target_user_id::text), '{}'::jsonb)
  INTO v_votes_map
  FROM public.votes
  WHERE room_id = p_room_id
    AND round_number = v_room.round_number
    AND is_runoff = v_is_runoff;

  SELECT COALESCE(jsonb_object_agg(target_user_id::text, cnt), '{}'::jsonb)
  INTO v_vote_counts
  FROM (
    SELECT target_user_id, count(*)::integer AS cnt
    FROM public.votes
    WHERE room_id = p_room_id
      AND round_number = v_room.round_number
      AND is_runoff = v_is_runoff
    GROUP BY target_user_id
  ) vc;

  v_voting_result := jsonb_build_object(
    'chomuIds', v_secret.chomu_ids,
    'secretWord', v_secret.secret_word,
    'category', COALESCE(v_room.secret_category, ''),
    'votes', v_votes_map,
    'voteCounts', v_vote_counts,
    'mostVotedPlayerIds', to_jsonb(COALESCE(v_most_voted, ARRAY[]::uuid[])),
    'chomusCaught', v_chomus_caught,
    'hints', COALESCE(v_secret.hints, '{}'::jsonb)
  );

  UPDATE public.rooms
  SET phase = 'RESULTS',
      secret_word = v_secret.secret_word,
      chomu_ids = v_secret.chomu_ids,
      voting_result = v_voting_result,
      winner = v_winner,
      phase_deadline_at = NULL,
      state_version = state_version + 1
  WHERE id = p_room_id
  RETURNING * INTO v_room;

  RETURN jsonb_build_object(
    'ok', true,
    'phase', v_room.phase,
    'winner', v_room.winner,
    'chomusCaught', v_chomus_caught,
    'allVoted', true,
    'stateVersion', v_room.state_version
  );
END;
$$;

-- 4.2 advance_turn_atomic
-- Advances `current_turn_index` during `ROUND`, or transitions to `DISCUSSION`
-- once every player in `turn_order` has completed their turn.
CREATE OR REPLACE FUNCTION public.advance_turn_atomic(
  p_room_id uuid,
  p_actor_user_id uuid DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_caller uuid := auth.uid();
  v_room public.rooms%ROWTYPE;
  v_current_speaker text;
  v_next_index integer;
  v_turn_count integer;
  v_turn_secs integer;
  v_discussion_secs integer;
BEGIN
  IF v_caller IS NOT NULL AND p_actor_user_id IS NOT NULL AND v_caller <> p_actor_user_id THEN
    RAISE EXCEPTION 'Actor mismatch' USING ERRCODE = '42501';
  END IF;

  SELECT *
  INTO v_room
  FROM public.rooms
  WHERE id = p_room_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Room not found' USING ERRCODE = 'P0002';
  END IF;

  IF v_room.phase <> 'ROUND' THEN
    RAISE EXCEPTION 'Room is not in ROUND phase (current: %)', v_room.phase
      USING ERRCODE = 'P0001';
  END IF;

  IF v_caller IS NOT NULL THEN
    IF NOT public.is_room_member(p_room_id) THEN
      RAISE EXCEPTION 'Not a member of this room' USING ERRCODE = '42501';
    END IF;

    v_current_speaker := v_room.turn_order ->> v_room.current_turn_index;
    IF v_caller <> v_room.host_user_id
       AND v_caller::text IS DISTINCT FROM v_current_speaker
       AND (v_room.phase_deadline_at IS NULL OR v_room.phase_deadline_at > now()) THEN
      RAISE EXCEPTION 'Only host, current speaker, or expired timer may advance turn'
        USING ERRCODE = '42501';
    END IF;
  END IF;

  v_turn_count := jsonb_array_length(v_room.turn_order);
  v_next_index := v_room.current_turn_index + 1;

  IF v_next_index < v_turn_count THEN
    v_turn_secs := GREATEST(5, COALESCE((v_room.settings->>'turnDurationSeconds')::integer, 20));

    UPDATE public.rooms
    SET current_turn_index = v_next_index,
        phase_deadline_at = now() + make_interval(secs => v_turn_secs),
        state_version = state_version + 1
    WHERE id = p_room_id
    RETURNING * INTO v_room;
  ELSE
    v_discussion_secs := GREATEST(10, COALESCE((v_room.settings->>'discussionDurationSeconds')::integer, 45));

    UPDATE public.rooms
    SET phase = 'DISCUSSION',
        current_turn_index = v_next_index,
        phase_deadline_at = now() + make_interval(secs => v_discussion_secs),
        state_version = state_version + 1
    WHERE id = p_room_id
    RETURNING * INTO v_room;
  END IF;

  RETURN jsonb_build_object(
    'ok', true,
    'phase', v_room.phase,
    'currentTurnIndex', v_room.current_turn_index,
    'phaseDeadlineAt', v_room.phase_deadline_at,
    'stateVersion', v_room.state_version
  );
END;
$$;

-- 4.3 reset_lobby_atomic
-- Returns the room cleanly to `LOBBY`, clearing round secrets/results while
-- preserving player roster and cumulative scores.
CREATE OR REPLACE FUNCTION public.reset_lobby_atomic(
  p_room_id uuid,
  p_actor_user_id uuid DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_caller uuid := auth.uid();
  v_room public.rooms%ROWTYPE;
BEGIN
  IF v_caller IS NOT NULL AND p_actor_user_id IS NOT NULL AND v_caller <> p_actor_user_id THEN
    RAISE EXCEPTION 'Actor mismatch' USING ERRCODE = '42501';
  END IF;

  SELECT *
  INTO v_room
  FROM public.rooms
  WHERE id = p_room_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Room not found' USING ERRCODE = 'P0002';
  END IF;

  IF v_caller IS NOT NULL AND v_caller <> v_room.host_user_id THEN
    RAISE EXCEPTION 'Only the host can reset the room to lobby'
      USING ERRCODE = '42501';
  END IF;

  IF p_actor_user_id IS NOT NULL AND p_actor_user_id <> v_room.host_user_id THEN
    RAISE EXCEPTION 'Only the host can reset the room to lobby'
      USING ERRCODE = '42501';
  END IF;

  UPDATE public.rooms
  SET phase = 'LOBBY',
      secret_category = NULL,
      turn_order = '[]'::jsonb,
      current_turn_index = 0,
      phase_deadline_at = NULL,
      runoff_candidate_ids = '[]'::jsonb,
      voting_result = NULL,
      winner = NULL,
      secret_word = NULL,
      chomu_ids = NULL,
      state_version = state_version + 1
  WHERE id = p_room_id
  RETURNING * INTO v_room;

  UPDATE public.room_players
  SET is_ready = is_host,
      has_seen_role = false,
      has_voted = false
  WHERE room_id = p_room_id;

  INSERT INTO public.lobby_chat (room_id, user_id, sender_name, message, is_system)
  VALUES (p_room_id, NULL, 'System', 'Returned to lobby.', true);

  RETURN jsonb_build_object(
    'ok', true,
    'phase', v_room.phase,
    'stateVersion', v_room.state_version
  );
END;
$$;

REVOKE ALL ON FUNCTION public.cast_vote_atomic(uuid, uuid, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.cast_vote_atomic(uuid, uuid, uuid) TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.advance_turn_atomic(uuid, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.advance_turn_atomic(uuid, uuid) TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.reset_lobby_atomic(uuid, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.reset_lobby_atomic(uuid, uuid) TO authenticated, service_role;

-- ----------------------------------------------------------------------------
-- 5. Supabase Realtime Publication (safe if publication exists)
-- ----------------------------------------------------------------------------

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_tables
      WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'rooms'
    ) THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.rooms;
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_tables
      WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'room_players'
    ) THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.room_players;
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_tables
      WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'lobby_chat'
    ) THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.lobby_chat;
    END IF;
  END IF;
END;
$$;

COMMIT;
