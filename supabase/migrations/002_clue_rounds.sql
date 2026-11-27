-- Migration: 002_clue_rounds.sql
-- Supports configurable 1-3 clue rounds (default 2) before transitioning to DISCUSSION.

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
  v_clue_rounds integer;
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

    v_turn_count := GREATEST(1, jsonb_array_length(v_room.turn_order));
    v_current_speaker := v_room.turn_order ->> (v_room.current_turn_index % v_turn_count);
    IF v_caller <> v_room.host_user_id
       AND v_caller::text IS DISTINCT FROM v_current_speaker
       AND (v_room.phase_deadline_at IS NULL OR v_room.phase_deadline_at > now()) THEN
      RAISE EXCEPTION 'Only host, current speaker, or expired timer may advance turn'
        USING ERRCODE = '42501';
    END IF;
  END IF;

  v_turn_count := jsonb_array_length(v_room.turn_order);
  v_clue_rounds := GREATEST(1, LEAST(3, COALESCE((v_room.settings->>'clueRounds')::integer, 2)));
  v_next_index := v_room.current_turn_index + 1;

  IF v_next_index < (v_turn_count * v_clue_rounds) THEN
    v_turn_secs := COALESCE((v_room.settings->>'turnDurationSeconds')::integer, 20);

    UPDATE public.rooms
    SET current_turn_index = v_next_index,
        phase_deadline_at = CASE
          WHEN v_turn_secs <= 0 THEN NULL
          ELSE now() + make_interval(secs => GREATEST(5, v_turn_secs))
        END,
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
