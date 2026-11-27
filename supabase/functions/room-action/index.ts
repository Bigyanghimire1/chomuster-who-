import { handleCors, jsonResponse, errorResponse } from '../_shared/cors.ts';
import { authenticateCaller, type AuthDeps } from '../_shared/auth.ts';
import {
  validateAndNormalizeSettings,
  assignRolesAndWord,
  type RoomSettings,
} from '../_shared/gameLogic.ts';

type RoomPhase =
  | 'LOBBY'
  | 'ROLE_REVEAL'
  | 'ROUND'
  | 'DISCUSSION'
  | 'VOTING'
  | 'VOTING_RUNOFF'
  | 'RESULTS';

interface RoomRow {
  id: string;
  code: string;
  host_user_id: string;
  phase: RoomPhase;
  settings: RoomSettings;
  round_number: number;
  secret_category: string | null;
  turn_order: string[];
  current_turn_index: number;
  phase_deadline_at: string | null;
  runoff_candidate_ids: string[];
  voting_result: unknown;
  winner: string | null;
  secret_word: string | null;
  chomu_ids: string[] | null;
  state_version: number;
}

interface RoomPlayerRow {
  id: string;
  room_id: string;
  user_id: string;
  display_name: string;
  avatar_id: string;
  is_host: boolean;
  is_ready: boolean;
  is_connected: boolean;
  score: number;
  has_seen_role: boolean;
  has_voted: boolean;
  last_seen_at: string;
}

function isDeadlineExpired(deadlineAt: string | null): boolean {
  if (!deadlineAt) return false;
  const ts = new Date(deadlineAt).getTime();
  return !Number.isNaN(ts) && ts <= Date.now();
}

function mapRpcError(err: { code?: string; message?: string }): Response {
  const code = err?.code;
  const msg = err?.message ?? 'Database operation failed';
  if (code === '23505') {
    return errorResponse(409, 'INVALID_STATE', 'Player has already voted in this ballot');
  }
  if (code === '22023') {
    return errorResponse(400, 'INVALID_INPUT', msg);
  }
  if (code === '42501') {
    return errorResponse(403, 'FORBIDDEN', msg);
  }
  if (code === 'P0001') {
    return errorResponse(409, 'INVALID_STATE', msg);
  }
  if (code === 'P0002') {
    return errorResponse(404, 'ROOM_NOT_FOUND', msg);
  }
  return errorResponse(500, 'INTERNAL_ERROR', msg);
}

export async function handleRoomAction(
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
  const action = typeof body?.action === 'string' ? body.action.trim() : '';
  const payload =
    body?.payload && typeof body.payload === 'object'
      ? (body.payload as Record<string, unknown>)
      : {};

  if (!roomId || !action) {
    return errorResponse(400, 'INVALID_INPUT', 'roomId and action are required');
  }

  const { data: callerPlayer, error: memberErr } = await adminClient
    .from('room_players')
    .select('*')
    .eq('room_id', roomId)
    .eq('user_id', user.id)
    .maybeSingle();

  if (memberErr) {
    return errorResponse(500, 'INTERNAL_ERROR', 'Failed to verify room membership', memberErr.message);
  }
  if (!callerPlayer) {
    return errorResponse(403, 'FORBIDDEN', 'You are not a member of this room');
  }

  const { data: room, error: roomErr } = await adminClient
    .from('rooms')
    .select('*')
    .eq('id', roomId)
    .maybeSingle();

  if (roomErr) {
    return errorResponse(500, 'INTERNAL_ERROR', 'Failed to load room', roomErr.message);
  }
  if (!room) {
    return errorResponse(404, 'ROOM_NOT_FOUND', 'Room not found');
  }

  const typedRoom = room as RoomRow;
  const typedCaller = callerPlayer as RoomPlayerRow;
  const isHost = typedCaller.is_host || typedRoom.host_user_id === user.id;
  const nowIso = new Date().toISOString();

  switch (action) {
    case 'SET_READY': {
      if (typedRoom.phase !== 'LOBBY') {
        return errorResponse(409, 'INVALID_STATE', 'Can only change ready state in LOBBY');
      }
      if (typeof payload.isReady !== 'boolean') {
        return errorResponse(400, 'INVALID_INPUT', 'payload.isReady must be a boolean');
      }

      const { error: updPlayerErr } = await adminClient
        .from('room_players')
        .update({ is_ready: payload.isReady, last_seen_at: nowIso })
        .eq('room_id', roomId)
        .eq('user_id', user.id);

      if (updPlayerErr) {
        return errorResponse(500, 'INTERNAL_ERROR', 'Failed to update ready state', updPlayerErr.message);
      }

      const nextVersion = typedRoom.state_version + 1;
      const { error: bumpErr } = await adminClient
        .from('rooms')
        .update({ state_version: nextVersion })
        .eq('id', roomId);

      if (bumpErr) {
        return errorResponse(500, 'INTERNAL_ERROR', 'Failed to bump room state version', bumpErr.message);
      }

      return jsonResponse({ ok: true, isReady: payload.isReady, stateVersion: nextVersion });
    }

    case 'UPDATE_SETTINGS': {
      if (!isHost) {
        return errorResponse(403, 'FORBIDDEN', 'Only the host can update settings');
      }
      if (typedRoom.phase !== 'LOBBY') {
        return errorResponse(409, 'INVALID_STATE', 'Settings can only be updated in LOBBY');
      }

      const rawSettings = 'settings' in payload ? payload.settings : payload;
      let normalized: RoomSettings;
      try {
        normalized = validateAndNormalizeSettings(rawSettings);
      } catch (err) {
        return errorResponse(
          400,
          'INVALID_INPUT',
          err instanceof Error ? err.message : 'Invalid settings',
        );
      }

      const { error: resetReadyErr } = await adminClient
        .from('room_players')
        .update({ is_ready: false })
        .eq('room_id', roomId);

      if (resetReadyErr) {
        return errorResponse(500, 'INTERNAL_ERROR', 'Failed to reset player ready states', resetReadyErr.message);
      }

      const nextVersion = typedRoom.state_version + 1;
      const { error: updRoomErr } = await adminClient
        .from('rooms')
        .update({ settings: normalized, state_version: nextVersion })
        .eq('id', roomId);

      if (updRoomErr) {
        return errorResponse(500, 'INTERNAL_ERROR', 'Failed to update room settings', updRoomErr.message);
      }

      await adminClient.from('lobby_chat').insert({
        room_id: roomId,
        user_id: null,
        sender_name: 'System',
        message: 'Host updated game settings — please re-confirm Ready.',
        is_system: true,
      });

      return jsonResponse({ ok: true, settings: normalized, stateVersion: nextVersion });
    }

    case 'KICK_PLAYER': {
      if (!isHost) {
        return errorResponse(403, 'FORBIDDEN', 'Only the host can kick players');
      }
      if (typedRoom.phase !== 'LOBBY') {
        return errorResponse(409, 'INVALID_STATE', 'Players can only be kicked in LOBBY');
      }

      const targetUserId =
        typeof payload.targetUserId === 'string' ? payload.targetUserId.trim() : '';
      if (!targetUserId) {
        return errorResponse(400, 'INVALID_INPUT', 'payload.targetUserId is required');
      }
      if (targetUserId === user.id) {
        return errorResponse(400, 'INVALID_INPUT', 'Cannot kick yourself');
      }

      const { data: targetPlayer, error: targetErr } = await adminClient
        .from('room_players')
        .select('id, user_id, display_name')
        .eq('room_id', roomId)
        .eq('user_id', targetUserId)
        .maybeSingle();

      if (targetErr) {
        return errorResponse(500, 'INTERNAL_ERROR', 'Failed to look up target player', targetErr.message);
      }
      if (!targetPlayer) {
        return errorResponse(400, 'INVALID_INPUT', 'Target player is not in this room');
      }

      await adminClient
        .from('room_player_credentials')
        .delete()
        .eq('room_id', roomId)
        .eq('player_id', targetPlayer.id);

      const { error: delPlayerErr } = await adminClient
        .from('room_players')
        .delete()
        .eq('room_id', roomId)
        .eq('user_id', targetUserId);

      if (delPlayerErr) {
        return errorResponse(500, 'INTERNAL_ERROR', 'Failed to remove player', delPlayerErr.message);
      }

      const nextVersion = typedRoom.state_version + 1;
      await adminClient
        .from('rooms')
        .update({ state_version: nextVersion })
        .eq('id', roomId);

      await adminClient.from('lobby_chat').insert({
        room_id: roomId,
        user_id: null,
        sender_name: 'System',
        message: `${targetPlayer.display_name} was removed from the room.`,
        is_system: true,
      });

      return jsonResponse({ ok: true, kickedUserId: targetUserId, stateVersion: nextVersion });
    }

    case 'START_GAME': {
      if (!isHost) {
        return errorResponse(403, 'FORBIDDEN', 'Only the host can start the game');
      }
      if (typedRoom.phase === 'ROLE_REVEAL' && typedRoom.round_number > 0) {
        return jsonResponse({
          ok: true,
          phase: 'ROLE_REVEAL',
          roundNumber: typedRoom.round_number,
          stateVersion: typedRoom.state_version,
          alreadyStarted: true,
        });
      }
      if (typedRoom.phase !== 'LOBBY') {
        return errorResponse(409, 'INVALID_STATE', 'Game can only be started from LOBBY');
      }

      const { data: allPlayers, error: playersErr } = await adminClient
        .from('room_players')
        .select('*')
        .eq('room_id', roomId);

      if (playersErr) {
        return errorResponse(500, 'INTERNAL_ERROR', 'Failed to load room players', playersErr.message);
      }

      const connectedPlayers = ((allPlayers ?? []) as RoomPlayerRow[]).filter(
        (p) => p.is_connected,
      );

      if (connectedPlayers.length < 3) {
        return errorResponse(
          409,
          'INVALID_STATE',
          'At least 3 connected players are required to start the game',
        );
      }

      if (connectedPlayers.some((p) => !p.is_ready)) {
        return errorResponse(
          409,
          'INVALID_STATE',
          'All connected players must be ready before starting',
        );
      }

      let normalizedSettings: RoomSettings;
      try {
        normalizedSettings = validateAndNormalizeSettings(typedRoom.settings);
      } catch (err) {
        return errorResponse(
          400,
          'INVALID_INPUT',
          err instanceof Error ? err.message : 'Invalid room settings',
        );
      }

      const assignment = assignRolesAndWord({
        playerUserIds: connectedPlayers.map((p) => p.user_id),
        settings: normalizedSettings,
      });

      const nextRoundNumber = (typedRoom.round_number ?? 0) + 1;

      const { error: roundSecretErr } = await adminClient
        .from('room_round_secrets')
        .insert({
          room_id: roomId,
          round_number: nextRoundNumber,
          secret_word: assignment.secretWord,
          chomu_ids: assignment.chomuIds,
          hints: assignment.hintsByUserId,
        });

      if (roundSecretErr) {
        return errorResponse(500, 'INTERNAL_ERROR', 'Failed to store round secrets', roundSecretErr.message);
      }

      const playerSecretRows = connectedPlayers.map((p) => {
        const isChomu = assignment.chomuIds.includes(p.user_id);
        return {
          room_id: roomId,
          user_id: p.user_id,
          round_number: nextRoundNumber,
          is_chomu: isChomu,
          role: isChomu ? 'Imposter' : 'Civilian',
          secret_word: isChomu ? null : assignment.secretWord,
          hint: isChomu ? (assignment.hintsByUserId[p.user_id] ?? null) : null,
        };
      });

      const { error: playerSecretErr } = await adminClient
        .from('player_secrets')
        .insert(playerSecretRows);

      if (playerSecretErr) {
        return errorResponse(500, 'INTERNAL_ERROR', 'Failed to store player secrets', playerSecretErr.message);
      }

      const { error: resetFlagsErr } = await adminClient
        .from('room_players')
        .update({ has_seen_role: false, has_voted: false })
        .eq('room_id', roomId);

      if (resetFlagsErr) {
        return errorResponse(500, 'INTERNAL_ERROR', 'Failed to reset player round flags', resetFlagsErr.message);
      }

      const nextVersion = typedRoom.state_version + 1;
      const { data: startedRoom, error: startRoomErr } = await adminClient
        .from('rooms')
        .update({
          phase: 'ROLE_REVEAL',
          round_number: nextRoundNumber,
          secret_category: assignment.secretCategory,
          turn_order: assignment.turnOrder,
          current_turn_index: 0,
          phase_deadline_at: null,
          voting_result: null,
          winner: null,
          secret_word: null,
          chomu_ids: null,
          runoff_candidate_ids: [],
          state_version: nextVersion,
        })
        .eq('id', roomId)
        .eq('state_version', typedRoom.state_version)
        .select('id')
        .maybeSingle();

      if (startRoomErr) {
        return errorResponse(500, 'INTERNAL_ERROR', 'Failed to transition room to ROLE_REVEAL', startRoomErr.message);
      }
      if (!startedRoom) {
        return jsonResponse({
          ok: true,
          phase: 'ROLE_REVEAL',
          roundNumber: nextRoundNumber,
          alreadyStarted: true,
        });
      }

      return jsonResponse({
        ok: true,
        phase: 'ROLE_REVEAL',
        roundNumber: nextRoundNumber,
        stateVersion: nextVersion,
      });
    }

    case 'ACK_ROLE': {
      if (typedRoom.phase !== 'ROLE_REVEAL') {
        return errorResponse(409, 'INVALID_STATE', 'Can only acknowledge role in ROLE_REVEAL');
      }

      const turnOrder: string[] = Array.isArray(typedRoom.turn_order)
        ? (typedRoom.turn_order as string[])
        : [];
      const currentIndex =
        typeof typedRoom.current_turn_index === 'number' ? typedRoom.current_turn_index : 0;
      const currentSpeakerId = turnOrder[currentIndex];

      const { data: playersList, error: listErr } = await adminClient
        .from('room_players')
        .select('user_id, is_connected, has_seen_role')
        .eq('room_id', roomId);

      if (listErr) {
        return errorResponse(500, 'INTERNAL_ERROR', 'Failed to load room players', listErr.message);
      }

      const playersTyped = (playersList ?? []) as Array<{
        user_id: string;
        is_connected: boolean;
        has_seen_role: boolean;
      }>;
      const byUserId = new Map(playersTyped.map((p) => [p.user_id, p]));
      const activePlayer = currentSpeakerId ? byUserId.get(currentSpeakerId) : undefined;
      const isCurrentSpeaker = currentSpeakerId === user.id;

      // Only the active player can complete their reveal (or host if active player disconnected)
      if (!isCurrentSpeaker && !(isHost && activePlayer && !activePlayer.is_connected)) {
        return errorResponse(
          403,
          'FORBIDDEN',
          'Only the active player can complete their private reveal',
        );
      }

      if (currentSpeakerId) {
        const { error: ackErr } = await adminClient
          .from('room_players')
          .update({ has_seen_role: true, last_seen_at: nowIso })
          .eq('room_id', roomId)
          .eq('user_id', currentSpeakerId);

        if (ackErr) {
          return errorResponse(500, 'INTERNAL_ERROR', 'Failed to mark reveal complete', ackErr.message);
        }
      }

      // Advance to the next connected player in turn_order
      let nextIndex = currentIndex + 1;
      while (nextIndex < turnOrder.length) {
        const candidate = byUserId.get(turnOrder[nextIndex]);
        if (candidate && candidate.is_connected && !candidate.has_seen_role) {
          break;
        }
        nextIndex++;
      }

      const nextVersion = typedRoom.state_version + 1;

      if (nextIndex >= turnOrder.length) {
        const turnSecs = Number(typedRoom.settings?.turnDurationSeconds ?? 20);
        const phaseDeadlineAt =
          turnSecs > 0 ? new Date(Date.now() + turnSecs * 1000).toISOString() : null;

        const { data: updatedRound, error: roundErr } = await adminClient
          .from('rooms')
          .update({
            phase: 'ROUND',
            current_turn_index: 0,
            phase_deadline_at: phaseDeadlineAt,
            state_version: nextVersion,
          })
          .eq('id', roomId)
          .eq('state_version', typedRoom.state_version)
          .select('id')
          .maybeSingle();

        if (roundErr) {
          return errorResponse(500, 'INTERNAL_ERROR', 'Failed to transition to ROUND', roundErr.message);
        }
        if (!updatedRound) {
          return jsonResponse({ ok: true, alreadyTransitioned: true });
        }

        return jsonResponse({
          ok: true,
          phase: 'ROUND',
          currentTurnIndex: 0,
          allAcked: true,
          phaseDeadlineAt,
          stateVersion: nextVersion,
        });
      }

      const { data: updatedReveal, error: nextRevealErr } = await adminClient
        .from('rooms')
        .update({
          current_turn_index: nextIndex,
          state_version: nextVersion,
        })
        .eq('id', roomId)
        .eq('state_version', typedRoom.state_version)
        .select('id')
        .maybeSingle();

      if (nextRevealErr) {
        return errorResponse(500, 'INTERNAL_ERROR', 'Failed to advance reveal turn', nextRevealErr.message);
      }
      if (!updatedReveal) {
        return jsonResponse({ ok: true, alreadyTransitioned: true });
      }

      return jsonResponse({
        ok: true,
        phase: 'ROLE_REVEAL',
        currentTurnIndex: nextIndex,
        allAcked: false,
        stateVersion: nextVersion,
      });
    }

    case 'ADVANCE_TURN': {
      if (typedRoom.phase !== 'ROUND') {
        return errorResponse(409, 'INVALID_STATE', 'Can only advance turn in ROUND phase');
      }

      const currentSpeakerId = Array.isArray(typedRoom.turn_order)
        ? typedRoom.turn_order[typedRoom.current_turn_index]
        : undefined;
      const isCurrentSpeaker = currentSpeakerId === user.id;
      const expired = isDeadlineExpired(typedRoom.phase_deadline_at);

      if (!isCurrentSpeaker && !isHost && !expired) {
        return errorResponse(
          403,
          'FORBIDDEN',
          'Only the current speaker, host, or an expired timer may advance the turn',
        );
      }

      const { data: rpcData, error: rpcErr } = await adminClient.rpc('advance_turn_atomic', {
        p_room_id: roomId,
        p_actor_user_id: user.id,
      });

      if (rpcErr) {
        return mapRpcError(rpcErr);
      }

      return jsonResponse(rpcData ?? { ok: true });
    }

    case 'START_VOTING': {
      if (typedRoom.phase !== 'DISCUSSION') {
        return errorResponse(409, 'INVALID_STATE', 'Can only start voting from DISCUSSION phase');
      }

      const expired = isDeadlineExpired(typedRoom.phase_deadline_at);
      if (!isHost && !expired) {
        return errorResponse(
          403,
          'FORBIDDEN',
          'Only the host or an expired discussion timer may start voting',
        );
      }

      const votingSecs = Number(typedRoom.settings?.votingDurationSeconds ?? 60);
      const phaseDeadlineAt = new Date(Date.now() + votingSecs * 1000).toISOString();

      const { error: resetVotesErr } = await adminClient
        .from('room_players')
        .update({ has_voted: false })
        .eq('room_id', roomId);

      if (resetVotesErr) {
        return errorResponse(500, 'INTERNAL_ERROR', 'Failed to reset player vote flags', resetVotesErr.message);
      }

      const nextVersion = typedRoom.state_version + 1;
      const { error: updErr } = await adminClient
        .from('rooms')
        .update({
          phase: 'VOTING',
          phase_deadline_at: phaseDeadlineAt,
          state_version: nextVersion,
        })
        .eq('id', roomId);

      if (updErr) {
        return errorResponse(500, 'INTERNAL_ERROR', 'Failed to transition to VOTING', updErr.message);
      }

      return jsonResponse({
        ok: true,
        phase: 'VOTING',
        phaseDeadlineAt,
        stateVersion: nextVersion,
      });
    }

    case 'CAST_VOTE': {
      if (typedRoom.phase !== 'VOTING' && typedRoom.phase !== 'VOTING_RUNOFF') {
        return errorResponse(
          409,
          'INVALID_STATE',
          'Votes can only be cast during VOTING or VOTING_RUNOFF',
        );
      }

      const targetUserId =
        typeof payload.targetUserId === 'string' ? payload.targetUserId.trim() : '';
      if (!targetUserId) {
        return errorResponse(400, 'INVALID_INPUT', 'payload.targetUserId is required');
      }
      if (targetUserId === user.id) {
        return errorResponse(400, 'INVALID_INPUT', 'Cannot vote for yourself');
      }

      const { data: rpcData, error: rpcErr } = await adminClient.rpc('cast_vote_atomic', {
        p_room_id: roomId,
        p_voter_user_id: user.id,
        p_target_user_id: targetUserId,
      });

      if (rpcErr) {
        return mapRpcError(rpcErr);
      }

      return jsonResponse(rpcData ?? { ok: true });
    }

    case 'CONCLUDE_VOTING': {
      if (typedRoom.phase !== 'VOTING' && typedRoom.phase !== 'VOTING_RUNOFF') {
        return errorResponse(
          409,
          'INVALID_STATE',
          'Voting can only be concluded during VOTING or VOTING_RUNOFF',
        );
      }

      if (!isDeadlineExpired(typedRoom.phase_deadline_at)) {
        return errorResponse(
          409,
          'INVALID_STATE',
          'Voting deadline has not expired yet',
        );
      }

      const isRunoff = typedRoom.phase === 'VOTING_RUNOFF';
      const { data: voteRows, error: votesErr } = await adminClient
        .from('votes')
        .select('voter_user_id, target_user_id')
        .eq('room_id', roomId)
        .eq('round_number', typedRoom.round_number)
        .eq('is_runoff', isRunoff);

      if (votesErr) {
        return errorResponse(500, 'INTERNAL_ERROR', 'Failed to tally votes', votesErr.message);
      }

      const votesMap: Record<string, string> = {};
      const voteCounts: Record<string, number> = {};
      for (const row of voteRows ?? []) {
        votesMap[row.voter_user_id] = row.target_user_id;
        voteCounts[row.target_user_id] = (voteCounts[row.target_user_id] || 0) + 1;
      }

      let maxVotes = 0;
      for (const count of Object.values(voteCounts)) {
        if (count > maxVotes) maxVotes = count;
      }

      const mostVoted = Object.entries(voteCounts)
        .filter(([, count]) => count === maxVotes && maxVotes > 0)
        .map(([id]) => id)
        .sort();

      const nextVersion = typedRoom.state_version + 1;

      if (!isRunoff && mostVoted.length > 1) {
        const votingSecs = Math.max(15, Number(typedRoom.settings?.votingDurationSeconds ?? 60));
        const nextDeadline = new Date(Date.now() + votingSecs * 1000).toISOString();

        const { data: lockedRoom, error: runoffErr } = await adminClient
          .from('rooms')
          .update({
            phase: 'VOTING_RUNOFF',
            runoff_candidate_ids: mostVoted,
            phase_deadline_at: nextDeadline,
            state_version: nextVersion,
          })
          .eq('id', roomId)
          .eq('state_version', typedRoom.state_version)
          .select('id')
          .maybeSingle();

        if (runoffErr) {
          return errorResponse(500, 'INTERNAL_ERROR', 'Failed to start runoff voting', runoffErr.message);
        }
        if (!lockedRoom) {
          return jsonResponse({ ok: true, alreadyTransitioned: true });
        }

        await adminClient
          .from('room_players')
          .update({ has_voted: false })
          .eq('room_id', roomId);

        return jsonResponse({
          ok: true,
          phase: 'VOTING_RUNOFF',
          runoffCandidateIds: mostVoted,
          stateVersion: nextVersion,
        });
      }

      const { data: secretRow, error: secretErr } = await adminClient
        .from('room_round_secrets')
        .select('secret_word, chomu_ids, hints')
        .eq('room_id', roomId)
        .eq('round_number', typedRoom.round_number)
        .maybeSingle();

      if (secretErr || !secretRow) {
        return errorResponse(500, 'INTERNAL_ERROR', 'Missing round secrets', secretErr?.message);
      }

      const chomuIds: string[] = Array.isArray(secretRow.chomu_ids) ? secretRow.chomu_ids : [];
      const chomusCaught = mostVoted.length === 1 && chomuIds.includes(mostVoted[0]);
      const winner = chomusCaught ? 'civilians' : 'chomu';

      const votingResult = {
        chomuIds,
        secretWord: secretRow.secret_word,
        category: typedRoom.secret_category ?? '',
        votes: votesMap,
        voteCounts,
        mostVotedPlayerIds: mostVoted,
        chomusCaught,
        hints: secretRow.hints ?? {},
        timedOut: true,
      };

      const { data: finalizedRoom, error: resErr } = await adminClient
        .from('rooms')
        .update({
          phase: 'RESULTS',
          voting_result: votingResult,
          winner,
          secret_word: secretRow.secret_word,
          chomu_ids: chomuIds,
          phase_deadline_at: null,
          state_version: nextVersion,
        })
        .eq('id', roomId)
        .eq('state_version', typedRoom.state_version)
        .select('id')
        .maybeSingle();

      if (resErr) {
        return errorResponse(500, 'INTERNAL_ERROR', 'Failed to finalize voting results', resErr.message);
      }
      if (!finalizedRoom) {
        return jsonResponse({ ok: true, alreadyTransitioned: true });
      }

      const { data: roomPlayers } = await adminClient
        .from('room_players')
        .select('id, user_id, score')
        .eq('room_id', roomId);

      for (const rp of roomPlayers ?? []) {
        const isChomu = chomuIds.includes(rp.user_id);
        const delta = chomusCaught ? (!isChomu ? 1 : 0) : (isChomu ? 1 : 0);
        if (delta > 0) {
          await adminClient
            .from('room_players')
            .update({ score: Number(rp.score ?? 0) + delta })
            .eq('id', rp.id);
        }
      }

      return jsonResponse({
        ok: true,
        phase: 'RESULTS',
        winner,
        chomusCaught,
        stateVersion: nextVersion,
      });
    }

    case 'PLAY_AGAIN': {
      if (!isHost) {
        return errorResponse(403, 'FORBIDDEN', 'Only the host can start a new round');
      }
      if (typedRoom.phase !== 'RESULTS') {
        return errorResponse(409, 'INVALID_STATE', 'PLAY_AGAIN is only allowed in RESULTS phase');
      }

      const { data: rpcData, error: rpcErr } = await adminClient.rpc('reset_lobby_atomic', {
        p_room_id: roomId,
        p_actor_user_id: user.id,
      });

      if (rpcErr) {
        return mapRpcError(rpcErr);
      }

      const { error: resetReadyErr } = await adminClient
        .from('room_players')
        .update({ is_ready: false })
        .eq('room_id', roomId);

      if (resetReadyErr) {
        return errorResponse(500, 'INTERNAL_ERROR', 'Failed to reset player ready states', resetReadyErr.message);
      }

      return jsonResponse(rpcData ?? { ok: true, phase: 'LOBBY' });
    }

    case 'LEAVE_ROOM': {
      await adminClient
        .from('room_player_credentials')
        .delete()
        .eq('room_id', roomId)
        .eq('player_id', typedCaller.id);

      const { error: delErr } = await adminClient
        .from('room_players')
        .delete()
        .eq('room_id', roomId)
        .eq('user_id', user.id);

      if (delErr) {
        return errorResponse(500, 'INTERNAL_ERROR', 'Failed to leave room', delErr.message);
      }

      const { data: remaining, error: remErr } = await adminClient
        .from('room_players')
        .select('id, user_id, display_name, last_seen_at')
        .eq('room_id', roomId)
        .order('last_seen_at', { ascending: true });

      if (remErr) {
        return errorResponse(500, 'INTERNAL_ERROR', 'Failed to check remaining players', remErr.message);
      }

      const remainingPlayers = (remaining ?? []) as Array<{
        id: string;
        user_id: string;
        display_name: string;
      }>;

      if (remainingPlayers.length === 0) {
        await adminClient.from('rooms').delete().eq('id', roomId);
        return jsonResponse({ ok: true, roomDeleted: true });
      }

      const nextVersion = typedRoom.state_version + 1;

      if (isHost) {
        const nextHost = remainingPlayers[0];
        await adminClient
          .from('room_players')
          .update({ is_host: true })
          .eq('id', nextHost.id);

        await adminClient
          .from('rooms')
          .update({ host_user_id: nextHost.user_id, state_version: nextVersion })
          .eq('id', roomId);

        await adminClient.from('lobby_chat').insert({
          room_id: roomId,
          user_id: null,
          sender_name: 'System',
          message: `${typedCaller.display_name} left. ${nextHost.display_name} is now the host.`,
          is_system: true,
        });

        return jsonResponse({
          ok: true,
          roomDeleted: false,
          newHostUserId: nextHost.user_id,
          stateVersion: nextVersion,
        });
      }

      await adminClient
        .from('rooms')
        .update({ state_version: nextVersion })
        .eq('id', roomId);

      await adminClient.from('lobby_chat').insert({
        room_id: roomId,
        user_id: null,
        sender_name: 'System',
        message: `${typedCaller.display_name} left the room.`,
        is_system: true,
      });

      return jsonResponse({
        ok: true,
        roomDeleted: false,
        stateVersion: nextVersion,
      });
    }

    default:
      return errorResponse(400, 'INVALID_INPUT', `Unknown action: ${action}`);
  }
}

const denoRuntime = (
  globalThis as {
    Deno?: {
      serve?: (handler: (req: Request) => Promise<Response> | Response) => unknown;
    };
  }
).Deno;

if (typeof denoRuntime?.serve === 'function') {
  denoRuntime.serve((req: Request) => handleRoomAction(req));
}
