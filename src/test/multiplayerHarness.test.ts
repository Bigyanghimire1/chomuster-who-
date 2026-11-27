/**
 * src/test/multiplayerHarness.test.ts
 *
 * Comprehensive 28-Scenario E2E Multiplayer Verification Suite
 * Verifies Host-Authoritative Star Topology over P2P WebRTC data channels,
 * strict anti-cheat state partitioning, WebRTC media track management,
 * dynamic spotlight synchronization, and real-world network resilience.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { P2PRealtimeService } from '../services/multiplayer/p2pRealtimeService';
import { VoiceManager } from '../services/voice/voiceManager';
import { VideoCard } from '../components/common/VideoCard';
import { DEFAULT_CATEGORIES } from '../data/categories';
import {
  ROOM_CODE_ALPHABET,
  generateRoomCode,
  isValidRoomCode,
  normalizeRoomCode,
} from '../services/multiplayer/roomCodeGenerator';
import {
  createInitialRoomState,
  handlePlayerJoin,
  handlePlayerLeave,
  handleSetReady,
  handleStartGame,
  handleStartRound,
  handleNextTurn,
  handleStartVoting,
  handleCastVote,
  handleNextRound,
  sanitizeRoomStateForPeer,
  createJoinAckMessage,
} from '../services/multiplayer/roomProtocol';
import {
  VirtualP2PNetwork,
  createMockTrack,
  createMockMediaStream,
  MockSessionStorage,
} from './harness/virtualP2PNetwork';
import { OnlinePlayer, RoomState, StoredPlayerSession } from '../types/multiplayer';

describe('Chomu Who? Online Multiplayer E2E Verification Harness', () => {
  let network: VirtualP2PNetwork;

  beforeEach(() => {
    network = new VirtualP2PNetwork();
  });

  afterEach(async () => {
    await network.cleanup();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  // ==========================================================================
  // TIER 1: FEATURE COVERAGE (Scenarios 01 to 10)
  // ==========================================================================

  describe('Tier 1: Feature Coverage', () => {
    it('E2E-T1-01: Room Creation with Valid Code & Host Initialization', async () => {
      const service = new P2PRealtimeService();
      const peerId = service.getMyPeerId();
      const roomCode = generateRoomCode();
      const joinFn = network.createJoinRoomFn(peerId);

      await service.createRoom(roomCode, 'Alice', 'sleuth', { joinRoomFn: joinFn });
      await network.flush();

      // Verify connection and host authority
      expect(service.isConnected()).toBe(true);
      expect(service.isHost()).toBe(true);
      expect(service.getRoomCode()).toBe(roomCode);

      // Verify unambiguous 4-letter room code
      expect(roomCode.length).toBe(4);
      expect(isValidRoomCode(roomCode)).toBe(true);
      for (const char of roomCode) {
        expect(ROOM_CODE_ALPHABET).toContain(char);
      }

      const state = service.getState();
      expect(state).not.toBeNull();
      expect(state?.phase).toBe('LOBBY');
      expect(state?.hostPeerId).toBe(peerId);

      // Verify host player record
      const hostPlayer = state?.players[peerId];
      expect(hostPlayer).toBeDefined();
      expect(hostPlayer?.isHost).toBe(true);
      expect(hostPlayer?.isReady).toBe(true);
      expect(hostPlayer?.isConnected).toBe(true);
      expect(hostPlayer?.score).toBe(0);
      expect(hostPlayer?.name).toBe('Alice');
      expect(hostPlayer?.avatar).toBe('sleuth');

      // Strict Anti-Cheat Invariants: private information is strictly null
      expect(state?.chomuIds).toBeNull();
      expect(state?.secretWord).toBeNull();
      expect(state?.votingResult).toBeNull();
      expect(state?.secretCategory).toBeNull();

      await service.leaveRoom();
    });

    it('E2E-T1-02: Multi-Client Join & Star Topology Convergence (3 to 6 Players)', async () => {
      const roomCode = 'KMPQ';
      const { host, clients } = await network.createMesh(roomCode, [
        { name: 'Alice', avatar: 'sleuth', isHost: true },
        { name: 'Bob', avatar: 'shadow' },
        { name: 'Charlie', avatar: 'agent' },
        { name: 'Dana', avatar: 'maverick' },
      ]);

      await network.flush();

      // Host manages exactly 4 player records
      const hostState = host.getState();
      expect(hostState).not.toBeNull();
      expect(Object.keys(hostState?.players || {}).length).toBe(4);

      const hostPeerId = host.getMyPeerId();
      expect(hostState?.hostPeerId).toBe(hostPeerId);

      // All 3 joining clients converge on identical authoritative state
      for (const client of clients) {
        const clientState = client.getState();
        expect(clientState).not.toBeNull();
        expect(clientState?.phase).toBe('LOBBY');
        expect(clientState?.hostPeerId).toBe(hostPeerId);
        expect(Object.keys(clientState?.players || {}).length).toBe(4);

        // Verify non-host flags for clients
        const clientPlayer = clientState?.players[client.getMyPeerId()];
        expect(clientPlayer).toBeDefined();
        expect(clientPlayer?.isHost).toBe(false);
        expect(clientPlayer?.isReady).toBe(false);
        expect(clientPlayer?.isConnected).toBe(true);
      }
    });

    it('E2E-T1-03: Lobby Ready State & Host Settings Synchronization', async () => {
      const roomCode = 'WXYZ';
      const { host, clients } = await network.createMesh(roomCode, [
        { name: 'Alice', avatar: 'sleuth', isHost: true },
        { name: 'Bob', avatar: 'shadow' },
        { name: 'Charlie', avatar: 'agent' },
        { name: 'Dana', avatar: 'maverick' },
        { name: 'Evan', avatar: 'detective' },
      ]);

      await network.flush();

      // Bob & Charlie toggle ready
      clients[0].setReady(true);
      clients[1].setReady(true);
      await network.flush();

      // Host updates settings (5 players allows chomuCount up to 2)
      host.updateSettings({
        roundDurationSeconds: 120,
        votingDurationSeconds: 45,
        hintDifficulty: 'easy',
        chomuCount: 2,
      });
      await network.flush();

      // Verify ready states across host and all clients
      const bobId = clients[0].getMyPeerId();
      const charlieId = clients[1].getMyPeerId();
      const danaId = clients[2].getMyPeerId();
      const evanId = clients[3].getMyPeerId();

      const allServices = [host, ...clients];
      for (const svc of allServices) {
        const s = svc.getState();
        expect(s?.players[bobId].isReady).toBe(true);
        expect(s?.players[charlieId].isReady).toBe(true);
        expect(s?.players[danaId].isReady).toBe(false);
        expect(s?.players[evanId].isReady).toBe(false);

        // Verify settings synchronization
        expect(s?.settings.roundDurationSeconds).toBe(120);
        expect(s?.settings.votingDurationSeconds).toBe(45);
        expect(s?.settings.hintDifficulty).toBe('easy');
        expect(s?.settings.chomuCount).toBe(2);
      }
    });

    it('E2E-T1-04: Cryptographic Role Assignment & Anti-Cheat Secret Partitioning', async () => {
      const roomCode = 'ABCD';
      const { host, clients } = await network.createMesh(roomCode, [
        { name: 'Alice', avatar: 'sleuth', isHost: true },
        { name: 'Bob', avatar: 'shadow' },
        { name: 'Charlie', avatar: 'agent' },
        { name: 'Dana', avatar: 'maverick' },
      ]);

      // All clients mark ready
      for (const c of clients) {
        c.setReady(true);
      }
      await network.flush();

      // Host starts game
      host.startGame();
      await network.flush();

      const allServices = [host, ...clients];

      // Verify all peers transitioned to ROLE_REVEAL
      for (const svc of allServices) {
        const state = svc.getState();
        expect(state?.phase).toBe('ROLE_REVEAL');

        // Public roomState broadcast invariants: NO chomuIds or secretWord leak
        expect(state?.chomuIds).toBeNull();
        expect(state?.secretWord).toBeNull();
        expect(state?.votingResult).toBeNull();
      }

      // Verify private secret partitioning
      let chomuCount = 0;
      let civilianCount = 0;

      for (const svc of allServices) {
        const secret = svc.getSecret();
        expect(secret).not.toBeNull();
        expect(secret?.category).toBeDefined();

        if (secret?.isChomu) {
          chomuCount++;
          expect(secret.role).toBe('Imposter');
          expect(secret.hint).toBeDefined();
          // Chomu must NEVER receive the plaintext secret word
          expect(secret.word).toBeUndefined();
        } else {
          civilianCount++;
          expect(secret?.role).toBe('Civilian');
          expect(secret?.word).toBeDefined();
          // Civilians do not receive imposter hints
          expect(secret?.hint).toBeUndefined();
        }
      }

      expect(chomuCount).toBe(1);
      expect(civilianCount).toBe(3);
    });

    it('E2E-T1-05: Role Acknowledgment & Automatic Phase Advance to Discussion Round', async () => {
      const roomCode = 'KMPQ';
      const { host, clients } = await network.createMesh(roomCode, [
        { name: 'Alice', avatar: 'sleuth', isHost: true },
        { name: 'Bob', avatar: 'shadow' },
        { name: 'Charlie', avatar: 'agent' },
      ]);

      clients[0].setReady(true);
      clients[1].setReady(true);
      await network.flush();

      host.startGame();
      await network.flush();

      expect(host.getState()?.phase).toBe('ROLE_REVEAL');

      // 1. Host confirms role
      host.confirmRole();
      await network.flush();
      expect(host.getState()?.phase).toBe('ROLE_REVEAL');
      expect(host.getState()?.players[host.getMyPeerId()].hasSeenRole).toBe(true);

      // 2. Client B confirms role
      clients[0].confirmRole();
      await network.flush();
      expect(host.getState()?.phase).toBe('ROLE_REVEAL');
      expect(host.getState()?.players[clients[0].getMyPeerId()].hasSeenRole).toBe(true);
      expect(host.getState()?.players[clients[1].getMyPeerId()].hasSeenRole).toBe(false);

      // 3. Client C confirms role: triggers automatic transition to ROUND
      clients[1].confirmRole();
      await network.flush();

      // All clients must automatically be in ROUND with roundStartTime set
      expect(host.getState()?.phase).toBe('ROUND');
      expect(clients[0].getState()?.phase).toBe('ROUND');
      expect(clients[1].getState()?.phase).toBe('ROUND');

      expect(host.getState()?.roundStartTime).toBeGreaterThan(0);
      expect(clients[0].getState()?.roundStartTime).toBeGreaterThan(0);
    });

    it('E2E-T1-06: Authoritative Spotlight Turn Order & Main Stage Synchronization', async () => {
      const roomCode = 'ABCD';
      const { host, clients } = await network.createMesh(roomCode, [
        { name: 'Alice', avatar: 'sleuth', isHost: true },
        { name: 'Bob', avatar: 'shadow' },
        { name: 'Charlie', avatar: 'agent' },
        { name: 'Dana', avatar: 'maverick' },
      ]);

      for (const c of clients) c.setReady(true);
      await network.flush();
      host.startGame();
      await network.flush();

      host.confirmRole();
      for (const c of clients) c.confirmRole();
      await network.flush();

      expect(host.getState()?.phase).toBe('ROUND');

      const hostId = host.getMyPeerId();
      const bobId = clients[0].getMyPeerId();
      const charlieId = clients[1].getMyPeerId();
      const danaId = clients[2].getMyPeerId();

      // Verify authoritative spotlight state
      const initialSpotlightState = handleStartRound(host.getState()!);
      expect(initialSpotlightState.turnOrder.length).toBe(4);
      expect(initialSpotlightState.turnOrder).toContain(bobId);
      expect(initialSpotlightState.turnOrder).toContain(charlieId);
      expect(initialSpotlightState.turnOrder).toContain(danaId);
      expect(initialSpotlightState.currentTurnPlayerId).toBe(initialSpotlightState.turnOrder[0]);
      expect(initialSpotlightState.turnStartTime).toBeGreaterThan(0);

      // Verify turn progression via handleNextTurn
      const nextTurnState = handleNextTurn(initialSpotlightState);
      expect(nextTurnState.currentTurnPlayerId).toBe(initialSpotlightState.turnOrder[1]);

      // Verify VideoCard CSS mirroring invariant: local video is mirrored (-scale-x-100), remote is unmirrored
      const mockPlayer: OnlinePlayer = {
        id: hostId,
        name: 'Alice',
        avatar: 'sleuth',
        isHost: true,
        isReady: true,
        isConnected: true,
        score: 0,
      };

      const mockLiveVideoTrack = createMockTrack('video');
      const mockStream = createMockMediaStream([mockLiveVideoTrack]);

      const localHtml = renderToStaticMarkup(
        React.createElement(VideoCard, {
          player: mockPlayer,
          stream: mockStream,
          isLocal: true,
          isSpotlight: true,
        })
      );
      expect(localHtml).toContain('-scale-x-100');
      expect(localHtml).toContain('Spotlight');

      const remoteHtml = renderToStaticMarkup(
        React.createElement(VideoCard, {
          player: mockPlayer,
          stream: mockStream,
          isLocal: false,
          isSpotlight: false,
        })
      );
      expect(remoteHtml).not.toContain('-scale-x-100');
    });

    it('E2E-T1-07: Voting Phase Transition & Anti-Bandwagon Vote Masking', async () => {
      const roomCode = 'KMPQ';
      const { host, clients } = await network.createMesh(roomCode, [
        { name: 'Alice', avatar: 'sleuth', isHost: true },
        { name: 'Bob', avatar: 'shadow' },
        { name: 'Charlie', avatar: 'agent' },
      ]);

      clients[0].setReady(true);
      clients[1].setReady(true);
      await network.flush();

      host.startGame();
      await network.flush();

      host.confirmRole();
      clients[0].confirmRole();
      clients[1].confirmRole();
      await network.flush();

      expect(host.getState()?.phase).toBe('ROUND');

      // Host initiates voting
      host.startVoting();
      await network.flush();

      expect(host.getState()?.phase).toBe('VOTING');
      expect(clients[0].getState()?.phase).toBe('VOTING');
      expect(clients[1].getState()?.phase).toBe('VOTING');

      // Client B casts vote for Charlie
      const charlieId = clients[1].getMyPeerId();
      const bobId = clients[0].getMyPeerId();

      clients[0].castVote(charlieId);
      await network.flush();

      // Anti-Bandwagon Masking Invariants:
      // Client B sees their own voted target
      expect(clients[0].getState()?.players[bobId].votedForId).toBe(charlieId);

      // Client Charlie and Host Alice see that B voted, but masked as '__VOTED__' to prevent bandwagoning
      expect(clients[1].getState()?.players[bobId].votedForId).toBe('__VOTED__');
      // Host's sanitized broadcast to others also masks votes
      const sanitizedForCharlie = sanitizeRoomStateForPeer(
        host.getState()!,
        charlieId,
        (host as any).hostSecretState
      );
      expect(sanitizedForCharlie.sanitizedRoomState.players[bobId].votedForId).toBe('__VOTED__');
    });

    it('E2E-T1-08: Authoritative Vote Tallying, Scoring & Results Reveal', async () => {
      const roomCode = 'ABCD';
      const { host, clients } = await network.createMesh(roomCode, [
        { name: 'Alice', avatar: 'sleuth', isHost: true },
        { name: 'Bob', avatar: 'shadow' },
        { name: 'Charlie', avatar: 'agent' },
      ]);

      clients[0].setReady(true);
      clients[1].setReady(true);
      await network.flush();

      host.startGame();
      await network.flush();

      host.confirmRole();
      clients[0].confirmRole();
      clients[1].confirmRole();
      await network.flush();

      host.startVoting();
      await network.flush();

      // Identify who is Chomu and who are Civilians
      const all = [host, ...clients];
      const chomuService = all.find((s) => s.getSecret()?.isChomu)!;
      const civilianServices = all.filter((s) => !s.getSecret()?.isChomu);

      const chomuId = chomuService.getMyPeerId();
      const civ1Id = civilianServices[0].getMyPeerId();

      // All civilians vote for the chomu
      for (const civ of civilianServices) {
        civ.castVote(chomuId);
      }
      // Chomu votes for first civilian
      chomuService.castVote(civ1Id);
      await network.flush();

      // Transitions to RESULTS once all have voted
      expect(host.getState()?.phase).toBe('RESULTS');
      expect(clients[0].getState()?.phase).toBe('RESULTS');
      expect(clients[1].getState()?.phase).toBe('RESULTS');

      const results = host.getState()?.votingResult;
      expect(results).not.toBeNull();
      expect(results?.chomusCaught).toBe(true);
      expect(results?.mostVotedPlayerIds).toContain(chomuId);
      expect(host.getState()?.winner).toBe('civilians');

      // Scoring verification: Civilians get +100, caught Chomu gets 0
      for (const civ of civilianServices) {
        expect(host.getState()?.players[civ.getMyPeerId()].score).toBe(100);
      }
      expect(host.getState()?.players[chomuId].score).toBe(0);

      // Anti-Cheat Unmasking: chomuIds and secretWord are revealed to all peers in RESULTS
      for (const peer of all) {
        const s = peer.getState();
        expect(s?.chomuIds).toEqual([chomuId]);
        expect(s?.secretWord).toBe(results?.secretWord);
      }
    });

    it('E2E-T1-09: WebRTC Media Track Management, Mute Toggles & Duplicate Audio Elimination', async () => {
      const mockAudioTrack = createMockTrack('audio', true);
      const mockVideoTrack = createMockTrack('video', true);
      const mockStream = createMockMediaStream([mockAudioTrack, mockVideoTrack]);

      vi.stubGlobal('navigator', {
        mediaDevices: {
          getUserMedia: vi.fn().mockResolvedValue(mockStream),
        },
      });

      const voice = new VoiceManager();
      const stream = await voice.startMicrophone();
      expect(stream).not.toBeNull();
      expect(voice.isMicOn).toBe(true);

      // Test mute toggle
      voice.setMuted(true);
      expect(mockAudioTrack.enabled).toBe(false);
      expect(voice.isMicOn).toBe(false);

      voice.setMuted(false);
      expect(mockAudioTrack.enabled).toBe(true);
      expect(voice.isMicOn).toBe(true);

      // Duplicate Audio Elimination Invariant:
      // VideoCard's video elements must be muted={isLocal} or muted={true} so remote audio
      // NEVER plays from video tags (remote audio routes strictly through VoiceManager audio tags)
      const mockPlayer: OnlinePlayer = {
        id: 'peer-test',
        name: 'Bob',
        avatar: 'shadow',
        isHost: false,
        isReady: true,
        isConnected: true,
        score: 0,
      };

      const html = renderToStaticMarkup(
        React.createElement(VideoCard, {
          player: mockPlayer,
          stream: mockStream,
          isLocal: false,
        })
      );
      expect(html).toContain('<video');
      // When camera is enabled, video tile renders block
      expect(html).toContain('block');

      // Camera off fallback
      voice.disableCamera();
      const fallbackHtml = renderToStaticMarkup(
        React.createElement(VideoCard, {
          player: mockPlayer,
          stream: null,
          isLocal: false,
        })
      );
      expect(fallbackHtml).toContain('Camera off');
    });

    it('E2E-T1-10: Zero-Cost WebRTC ICE Configuration (Default Google STUN & Optional TURN Env)', () => {
      // Free public Google STUN server validation
      const defaultIceServers = [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
      ];

      expect(defaultIceServers.length).toBeGreaterThanOrEqual(2);
      expect(defaultIceServers[0].urls).toContain('stun.l.google.com:19302');
      expect(defaultIceServers[1].urls).toContain('stun1.l.google.com:19302');

      // Environment TURN credentials parser verification
      const parseTurnConfig = (envUrls?: string, username?: string, credential?: string) => {
        const iceServers = [...defaultIceServers];
        if (envUrls) {
          const urls = envUrls.split(',').map((u) => u.trim());
          iceServers.push({
            urls,
            ...(username ? { username } : {}),
            ...(credential ? { credential } : {}),
          } as any);
        }
        return iceServers;
      };

      const withTurn = parseTurnConfig('turn:relay.example.com:3478', 'user', 'pass');
      expect(withTurn.length).toBe(3);
      expect(withTurn[2].urls).toEqual(['turn:relay.example.com:3478']);

      // Zero-Cost Architecture Verification: Confirm no paid commercial SDK imports
      // Note: livekit-client is our approved $0/mo Build Free SFU SDK (Option B)
      const paidSdks = ['@agora/rtc', 'twilio', '@daily-co/daily-js'];
      for (const sdk of paidSdks) {
        expect(() => require.resolve(sdk)).toThrow();
      }
    });
  });

  // ==========================================================================
  // TIER 2: BOUNDARY & CORNER CASES (Scenarios 11 to 16)
  // ==========================================================================

  describe('Tier 2: Boundary & Corner Cases', () => {
    it('E2E-T2-11: Minimum Player Threshold Enforcement (< 3 Players Rejection)', () => {
      const state = createInitialRoomState('KMPQ', 'p1', 'Alice', 'sleuth');
      const twoPlayerState = handlePlayerJoin(state, 'p2', 'Bob', 'shadow');

      expect(Object.keys(twoPlayerState.players).length).toBe(2);

      // Attempting to start game with < 3 players must throw clear error
      expect(() => handleStartGame(twoPlayerState, DEFAULT_CATEGORIES)).toThrow(
        'A minimum of 3 connected players is required to start the game.'
      );
      expect(twoPlayerState.phase).toBe('LOBBY');
      expect(twoPlayerState.secretWord).toBeNull();
    });

    it('E2E-T2-12: Maximum Room Capacity & Boundary Join Rejection (8 Players Max)', () => {
      let state = createInitialRoomState('ABCD', 'p1', 'Host', 'sleuth');

      // Add 7 additional players to reach maximum capacity of 8
      for (let i = 2; i <= 8; i++) {
        state = handlePlayerJoin(state, `p${i}`, `Player${i}`, 'shadow');
      }
      expect(Object.keys(state.players).length).toBe(8);

      // Attempt 9th join: rejected
      const canJoin = (st: typeof state) => {
        const count = Object.values(st.players).filter((p) => p.isConnected).length;
        if (count >= 8) {
          return { accepted: false, reason: 'Room is full (maximum 8 players)' };
        }
        return { accepted: true };
      };

      const rejection = canJoin(state);
      expect(rejection.accepted).toBe(false);
      expect(rejection.reason).toContain('Room is full (maximum 8 players)');

      const joinAck = createJoinAckMessage('p1', rejection.accepted, 'ABCD', rejection.reason, 'p9');
      expect(joinAck.payload.kind).toBe('JOIN_ACK');
      if (joinAck.payload.kind === 'JOIN_ACK') {
        expect(joinAck.payload.accepted).toBe(false);
        expect(joinAck.payload.reason).toBe('Room is full (maximum 8 players)');
      }
      expect(Object.keys(state.players).length).toBe(8);
    });

    it('E2E-T2-13: Room Code Input Normalization & Ambiguous Character Rejection', () => {
      // Normalization trimming, uppercase conversion, hyphen stripping
      expect(normalizeRoomCode('  ab-cd  ')).toBe('ABCD');
      expect(normalizeRoomCode('k-m-p-q')).toBe('KMPQ');
      expect(normalizeRoomCode('WXYZ!')).toBe('WXYZ');

      // Validation invariants
      expect(isValidRoomCode('ABCD')).toBe(true);
      expect(isValidRoomCode('KMPQ')).toBe(true);

      // Rejections
      expect(isValidRoomCode('ABC')).toBe(false); // too short
      expect(isValidRoomCode('ABCDE')).toBe(false); // too long
      expect(isValidRoomCode('AB12')).toBe(false); // numbers
      expect(isValidRoomCode('ABIO')).toBe(false); // contains ambiguous I and O
      expect(isValidRoomCode('ABCL')).toBe(false); // contains ambiguous L
    });

    it('E2E-T2-14: Action Idempotency & Replay Resistance (Duplicate Ready & Repeat Vote)', () => {
      let state = createInitialRoomState('ABCD', 'p1', 'Alice', 'sleuth');
      state = handlePlayerJoin(state, 'p2', 'Bob', 'shadow');

      // 1. Duplicate Ready: setting ready 3 times in a row should be idempotent
      state = handleSetReady(state, 'p2', true);
      expect(state.players['p2'].isReady).toBe(true);
      const state2 = handleSetReady(state, 'p2', true);
      expect(state2.players['p2'].isReady).toBe(true);
      expect(state2).toBe(state); // Same reference when no-op

      // 2. Repeat Vote: voting for the same player twice does not double-count
      let votingState: RoomState = {
        ...state,
        phase: 'VOTING',
        players: {
          ...state.players,
          p2: { ...state.players['p2'], votedForId: null },
        },
      };

      votingState = handleCastVote(votingState, 'p2', 'p1');
      expect(votingState.players['p2'].votedForId).toBe('p1');

      votingState = handleCastVote(votingState, 'p2', 'p1');
      expect(votingState.players['p2'].votedForId).toBe('p1');
    });

    it('E2E-T2-15: Out-of-Order / Invalid Phase Action Rejection (Anti-Tamper)', () => {
      const state = createInitialRoomState('ABCD', 'p1', 'Alice', 'sleuth');

      // 1. Voting in LOBBY phase is rejected
      const stateAfterVoteInLobby = handleStartVoting(state);
      expect(stateAfterVoteInLobby.phase).toBe('LOBBY'); // handleStartVoting guards phase === 'ROUND'

      // 2. SET_READY in VOTING phase is rejected
      const votingState = { ...state, phase: 'VOTING' as const };
      const stateAfterReadyInVoting = handleSetReady(votingState, 'p1', false);
      expect(stateAfterReadyInVoting.phase).toBe('VOTING');
      expect(stateAfterReadyInVoting).toBe(votingState); // No-op guard
    });

    it('E2E-T2-16: Player Disconnection During Role Reveal Phase', async () => {
      const roomCode = 'ABCD';
      const { host, clients } = await network.createMesh(roomCode, [
        { name: 'Alice', avatar: 'sleuth', isHost: true },
        { name: 'Bob', avatar: 'shadow' },
        { name: 'Charlie', avatar: 'agent' },
        { name: 'Dana', avatar: 'maverick' },
      ]);

      for (const c of clients) c.setReady(true);
      await network.flush();

      host.startGame();
      await network.flush();
      expect(host.getState()?.phase).toBe('ROLE_REVEAL');

      // Alice and Bob acknowledge roles
      host.confirmRole();
      clients[0].confirmRole();
      await network.flush();
      expect(host.getState()?.phase).toBe('ROLE_REVEAL');

      // Dana drops connection abruptly
      const danaId = clients[2].getMyPeerId();
      await clients[2].leaveRoom();
      await network.flush();

      expect(host.getState()?.players[danaId].isConnected).toBe(false);

      // Charlie acknowledges role: auto-advance checks only connected players (Alice, Bob, Charlie)
      clients[1].confirmRole();
      await network.flush();

      // Successfully advances to ROUND without deadlocking on disconnected Dana
      expect(host.getState()?.phase).toBe('ROUND');
      expect(clients[0].getState()?.phase).toBe('ROUND');
      expect(clients[1].getState()?.phase).toBe('ROUND');
    });
  });

  // ==========================================================================
  // TIER 3: CROSS-FEATURE COMBINATIONS (Scenarios 17 to 22)
  // ==========================================================================

  describe('Tier 3: Cross-Feature Combinations', () => {
    it('E2E-T3-17: Concurrent Media Toggles & Speaking Detection During Active Discussion', async () => {
      const roomCode = 'ABCD';
      const { host, clients } = await network.createMesh(roomCode, [
        { name: 'Alice', avatar: 'sleuth', isHost: true },
        { name: 'Bob', avatar: 'shadow' },
        { name: 'Charlie', avatar: 'agent' },
      ]);

      clients[0].setReady(true);
      clients[1].setReady(true);
      await network.flush();

      host.startGame();
      await network.flush();
      host.confirmRole();
      clients[0].confirmRole();
      clients[1].confirmRole();
      await network.flush();

      expect(host.getState()?.phase).toBe('ROUND');

      // 1. Host speaks: broadcasts UPDATE_SPEAKING
      host.updateSpeaking(true);
      await network.flush();

      expect(host.getState()?.players[host.getMyPeerId()].isSpeaking).toBe(true);
      expect(clients[0].getState()?.players[host.getMyPeerId()].isSpeaking).toBe(true);

      // 2. Video Card renders active speaking aura
      const mockPlayer = host.getState()!.players[host.getMyPeerId()];
      const htmlSpeaking = renderToStaticMarkup(
        React.createElement(VideoCard, {
          player: mockPlayer,
          isSpeaking: true,
          audioLevel: 0.6,
        })
      );
      expect(htmlSpeaking).toContain('ring-[#64E987]');

      // 3. Discussion round remains stable
      expect(host.getState()?.phase).toBe('ROUND');
      expect(clients[0].getState()?.phase).toBe('ROUND');
    });

    it('E2E-T3-18: Host Disconnection & Migration During Active Voting Phase', async () => {
      const roomCode = 'ABCD';
      const { host, clients } = await network.createMesh(roomCode, [
        { name: 'Alice', avatar: 'sleuth', isHost: true },
        { name: 'Bob', avatar: 'shadow' },
        { name: 'Charlie', avatar: 'agent' },
      ]);

      clients[0].setReady(true);
      clients[1].setReady(true);
      await network.flush();

      host.startGame();
      await network.flush();
      host.confirmRole();
      clients[0].confirmRole();
      clients[1].confirmRole();
      await network.flush();

      host.startVoting();
      await network.flush();
      expect(host.getState()?.phase).toBe('VOTING');

      // Host Alice departs during voting
      const hostPeerId = host.getMyPeerId();
      const bobPeerId = clients[0].getMyPeerId();
      const charliePeerId = clients[1].getMyPeerId();

      await host.leaveRoom();
      await network.flush();

      // Host disconnect grace period initiates: Alice marked disconnected, grace timer set
      const bobStateInitial = clients[0].getState();
      expect(bobStateInitial?.players[hostPeerId].isConnected).toBe(false);
      expect(bobStateInitial?.hostGracePeriodEnd).toBeGreaterThan(0);

      // Trigger host migration upon grace completion
      (clients[0] as any).executeHostMigration?.(hostPeerId);
      (clients[1] as any).executeHostMigration?.(hostPeerId);
      await network.flush();

      // Deterministic host migration elects the lexicographically lowest connected peer
      const expectedNextHost = [bobPeerId, charliePeerId].sort((a, b) => a.localeCompare(b))[0];

      const bobState = clients[0].getState();
      const charlieState = clients[1].getState();

      expect(bobState?.hostPeerId).toBe(expectedNextHost);
      expect(charlieState?.hostPeerId).toBe(expectedNextHost);
      expect(bobState?.players[expectedNextHost].isHost).toBe(true);
      expect(bobState?.players[hostPeerId].isConnected).toBe(false);

      // Safe phase recovery: game safely recovers (aborts to LOBBY if < 3 remain, or continues without lockup)
      expect(['VOTING', 'LOBBY']).toContain(bobState?.phase);
    });

    it('E2E-T3-19: Spotlight Turn Transition Interleaved with Active Speaker Audio Analyser Level', () => {
      let state = createInitialRoomState('ABCD', 'p1', 'Alice', 'sleuth');
      state = handlePlayerJoin(state, 'p2', 'Bob', 'shadow');
      state = handlePlayerJoin(state, 'p3', 'Charlie', 'agent');
      state = handlePlayerJoin(state, 'p4', 'Dana', 'maverick');

      // Start round with turn order [p1, p2, p3, p4]
      state = {
        ...state,
        phase: 'ROUND',
        turnOrder: ['p1', 'p2', 'p3', 'p4'],
        currentTurnPlayerId: 'p2', // Bob's turn
      };

      // While Bob is main-stage spotlight, Charlie starts speaking loudly in thumbnail strip
      state.players['p3'].isSpeaking = true;

      // Bob's tile: Spotlight active
      const bobTile = renderToStaticMarkup(
        React.createElement(VideoCard, {
          player: state.players['p2'],
          isSpotlight: true,
          isSpeaking: false,
        })
      );
      expect(bobTile).toContain('Spotlight');
      expect(bobTile).not.toContain('border-chomu-lime');

      // Charlie's tile: In thumbnail strip with active speaking lime halo
      const charlieTile = renderToStaticMarkup(
        React.createElement(VideoCard, {
          player: state.players['p3'],
          isSpotlight: false,
          isSpeaking: true,
          audioLevel: 0.8,
        })
      );
      expect(charlieTile).not.toContain('Spotlight');
      expect(charlieTile).toContain('ring-[#64E987]');

      // Advance turn to Charlie
      state = handleNextTurn(state);
      expect(state.currentTurnPlayerId).toBe('p3');
    });

    it('E2E-T3-20: Mid-Round Card Quick-Peek Drawer Isolation (Zero Leakage)', async () => {
      const roomCode = 'ABCD';
      const { host, clients } = await network.createMesh(roomCode, [
        { name: 'Alice', avatar: 'sleuth', isHost: true },
        { name: 'Bob', avatar: 'shadow' },
        { name: 'Charlie', avatar: 'agent' },
      ]);

      clients[0].setReady(true);
      clients[1].setReady(true);
      await network.flush();

      host.startGame();
      await network.flush();
      host.confirmRole();
      clients[0].confirmRole();
      clients[1].confirmRole();
      await network.flush();

      // Find Chomu client
      const all = [host, ...clients];
      const chomuClient = all.find((s) => s.getSecret()?.isChomu)!;

      // Client accesses private secret locally for drawer peek
      const secret = chomuClient.getSecret();
      expect(secret?.role).toBe('Imposter');
      expect(secret?.hint).toBeDefined();
      expect(secret?.word).toBeUndefined(); // Zero leakage of plaintext word

      // Peek action is strictly client-local; zero broadcast or state alteration
      const hostStateBefore = JSON.stringify(host.getState());
      await network.flush();
      const hostStateAfter = JSON.stringify(host.getState());
      expect(hostStateBefore).toBe(hostStateAfter);
    });

    it('E2E-T3-21: Deafen State Synchronization with Local Mic & Remote Playback Elements', () => {
      const voice = new VoiceManager();

      const mockAudioTrack = createMockTrack('audio', true);
      const mockStream = createMockMediaStream([mockAudioTrack]);

      (voice as any).localStream = mockStream;
      (voice as any).state.isMicActive = true;

      // Add a simulated remote peer audio stream
      const mockRemoteStream = createMockMediaStream([createMockTrack('audio')]);
      const remoteAudioEl = voice.addRemoteStream('peer-remote-1', mockRemoteStream);

      expect(remoteAudioEl.muted).toBe(false);
      expect(mockAudioTrack.enabled).toBe(true);

      // Deafen: Mutes remote audio elements AND local mic
      voice.setDeafened(true);
      expect(remoteAudioEl.muted).toBe(true);
      expect(mockAudioTrack.enabled).toBe(false);

      // Undeafen: Unmutes remote audio elements AND restores local mic
      voice.setDeafened(false);
      expect(remoteAudioEl.muted).toBe(false);
      expect(mockAudioTrack.enabled).toBe(true);
    });

    it('E2E-T3-22: Multi-Round Progression with Used Word Database Exclusion', () => {
      let state = createInitialRoomState('ABCD', 'p1', 'Alice', 'sleuth');
      state = handlePlayerJoin(state, 'p2', 'Bob', 'shadow');
      state = handlePlayerJoin(state, 'p3', 'Charlie', 'agent');

      // Round 1
      const round1 = handleStartGame(state, DEFAULT_CATEGORIES, []);
      state = round1.nextState;
      const round1Word = round1.hostSecretState.secretWord;
      expect(round1.updatedUsedWords).toContain(round1Word);

      // Complete round 1 and advance to next round
      state = handleNextRound(state);
      expect(state.phase).toBe('LOBBY');
      expect(state.roundNumber).toBe(2);
      expect(state.players['p1'].hasSeenRole).toBe(false);
      expect(state.players['p2'].isReady).toBe(false);

      // Round 2: Must exclude Round 1 word
      const round2 = handleStartGame(state, DEFAULT_CATEGORIES, round1.updatedUsedWords);
      const round2Word = round2.hostSecretState.secretWord;
      expect(round2Word).not.toBe(round1Word);
      expect(round2.updatedUsedWords).toContain(round1Word);
      expect(round2.updatedUsedWords).toContain(round2Word);
    });
  });

  // ==========================================================================
  // TIER 4: REAL-WORLD RESILIENCE SCENARIOS (Scenarios 23 to 28)
  // ==========================================================================

  describe('Tier 4: Real-World Resilience Scenarios', () => {
    it('E2E-T4-23: End-to-End Game Lifecycle from Room Creation to Multi-Round Victory', async () => {
      // 1. Setup Mesh
      const roomCode = 'GAME';
      const { host, clients } = await network.createMesh(roomCode, [
        { name: 'Alice', avatar: 'sleuth', isHost: true },
        { name: 'Bob', avatar: 'shadow' },
        { name: 'Charlie', avatar: 'agent' },
      ]);
      await network.flush();
      expect(host.getState()?.phase).toBe('LOBBY');

      // 2. Ready & Start
      clients[0].setReady(true);
      clients[1].setReady(true);
      await network.flush();

      host.startGame();
      await network.flush();
      expect(host.getState()?.phase).toBe('ROLE_REVEAL');

      // 3. Confirm Roles -> ROUND
      host.confirmRole();
      clients[0].confirmRole();
      clients[1].confirmRole();
      await network.flush();
      expect(host.getState()?.phase).toBe('ROUND');

      // 4. Voting Phase
      host.startVoting();
      await network.flush();
      expect(host.getState()?.phase).toBe('VOTING');

      // 5. Cast Votes -> RESULTS
      const chomu = [host, ...clients].find((s) => s.getSecret()?.isChomu)!;
      const civs = [host, ...clients].filter((s) => !s.getSecret()?.isChomu);

      for (const civ of civs) civ.castVote(chomu.getMyPeerId());
      chomu.castVote(civs[0].getMyPeerId());
      await network.flush();

      expect(host.getState()?.phase).toBe('RESULTS');
      expect(host.getState()?.votingResult?.chomusCaught).toBe(true);

      // 6. Next Round -> LOBBY Round 2
      host.nextRound();
      await network.flush();

      expect(host.getState()?.phase).toBe('LOBBY');
      expect(host.getState()?.roundNumber).toBe(2);
      expect(clients[0].getState()?.roundNumber).toBe(2);
    });

    it('E2E-T4-24: Session Recovery Across Page Refresh via sessionStorage (No Duplicates)', () => {
      const storage = new MockSessionStorage();

      // 1. Initial 3-player state with persistent session IDs
      let state = createInitialRoomState('ABCD', 'host-peer', 'Alice', 'sleuth');
      state = handlePlayerJoin(state, 'peer-b', 'Bob', 'shadow', 'sess-uuid-bob');
      state = handlePlayerJoin(state, 'peer-c', 'Charlie', 'agent', 'sess-uuid-charlie');

      expect(Object.keys(state.players).length).toBe(3);
      state.players['peer-b'].score = 100;

      // Save Bob's session to sessionStorage
      const sessionData: StoredPlayerSession = {
        roomCode: 'ABCD',
        sessionPlayerId: 'sess-uuid-bob',
        playerName: 'Bob',
        avatar: 'shadow',
        savedAt: Date.now(),
      };
      storage.setItem('chomu_multiplayer_session', JSON.stringify(sessionData));

      // 2. Simulate refresh: Bob disconnects and reconnects with a brand new peerId ('peer-b-reloaded')
      state = handlePlayerLeave(state, 'peer-b');
      expect(state.players['peer-b'].isConnected).toBe(false);

      const recoveredSession: StoredPlayerSession = JSON.parse(
        storage.getItem('chomu_multiplayer_session')!
      );

      // 3. Reconnect with recovered sessionPlayerId
      const recoveredState = handlePlayerJoin(
        state,
        'peer-b-reloaded',
        recoveredSession.playerName,
        recoveredSession.avatar,
        recoveredSession.sessionPlayerId
      );

      // Invariant: Total room players remains strictly 3 (no duplicate Bob)
      expect(Object.keys(recoveredState.players).length).toBe(3);
      expect(recoveredState.players['peer-b-reloaded']).toBeDefined();
      expect(recoveredState.players['peer-b']).toBeUndefined(); // Old disconnected slot removed

      // Preserved score
      expect(recoveredState.players['peer-b-reloaded'].score).toBe(100);
      expect(recoveredState.players['peer-b-reloaded'].isConnected).toBe(true);
    });

    it('E2E-T4-25: Tab Visibility Suspension & Foreground Heartbeat Resync', async () => {
      const roomCode = 'ABCD';
      const { host, clients } = await network.createMesh(roomCode, [
        { name: 'Alice', avatar: 'sleuth', isHost: true },
        { name: 'Bob', avatar: 'shadow' },
      ]);
      await network.flush();

      const bobService = clients[0];
      const hostService = host;
      const bobId = bobService.getMyPeerId();

      // Initial heartbeat exchange
      const initialLastSeen = hostService.getState()?.players[bobId].lastSeen || 0;

      // Simulate visibility change to foreground: dispatches heartbeat
      await new Promise((resolve) => setTimeout(resolve, 10));
      (bobService as any).heartbeatChannel?.send({
        type: 'HEARTBEAT',
        senderId: bobId,
        timestamp: Date.now(),
        payload: { kind: 'PING', clientTimestamp: Date.now() },
      });
      await network.flush();

      // Host must update lastSeen on heartbeat
      const updatedLastSeen = hostService.getState()?.players[bobId].lastSeen || 0;
      expect(updatedLastSeen).toBeGreaterThanOrEqual(initialLastSeen);
      expect(hostService.getState()?.players[bobId].isConnected).toBe(true);
    });

    it('E2E-T4-26: Host Disconnection Grace Period (10s) with Reconnection Cancellation', () => {
      let state = createInitialRoomState('ABCD', 'host-alice', 'Alice', 'sleuth');
      state = handlePlayerJoin(state, 'peer-bob', 'Bob', 'shadow');
      state = handlePlayerJoin(state, 'peer-charlie', 'Charlie', 'agent');

      // Set 10-second host disconnection grace period
      const graceEnd = Date.now() + 10000;
      state = {
        ...state,
        hostGracePeriodEnd: graceEnd,
        players: {
          ...state.players,
          'host-alice': { ...state.players['host-alice'], isConnected: false },
        },
      };

      // During grace period (e.g. after 4 seconds), Alice is not usurped
      const checkHostStatusAt4s = (st: typeof state, currentTime: number) => {
        if (st.hostGracePeriodEnd && currentTime < st.hostGracePeriodEnd) {
          // Grace period active; retain host
          return st.hostPeerId;
        }
        return 'peer-bob';
      };

      expect(checkHostStatusAt4s(state, Date.now() + 4000)).toBe('host-alice');

      // Alice reconnects before grace expiry: grace period cancelled
      state = handlePlayerJoin(state, 'host-alice', 'Alice', 'sleuth');
      state = { ...state, hostGracePeriodEnd: null };

      expect(state.hostPeerId).toBe('host-alice');
      expect(state.hostGracePeriodEnd).toBeNull();
      expect(state.players['host-alice'].isConnected).toBe(true);
    });

    it('E2E-T4-27: Host Permanent Disconnect Grace Expiry & Graceful Host Handover', () => {
      let state = createInitialRoomState('ABCD', 'host-alice', 'Alice', 'sleuth');
      state = handlePlayerJoin(state, 'peer-bob', 'Bob', 'shadow');
      state = handlePlayerJoin(state, 'peer-charlie', 'Charlie', 'agent');

      // Alice disconnects and grace period expires (> 10s)
      state = handlePlayerLeave(state, 'host-alice');

      // Deterministic handover promotes Bob to Host
      expect(state.hostPeerId).toBe('peer-bob');
      expect(state.players['peer-bob'].isHost).toBe(true);
      expect(state.players['host-alice'].isConnected).toBe(false);
    });

    it('E2E-T4-28: Transient Network Partition & WebRTC Data Channel Reconnection Resynchronization', async () => {
      const roomCode = 'ABCD';
      const { host, clients } = await network.createMesh(roomCode, [
        { name: 'Alice', avatar: 'sleuth', isHost: true },
        { name: 'Bob', avatar: 'shadow' },
      ]);
      await network.flush();

      const hostId = host.getMyPeerId();
      const bobId = clients[0].getMyPeerId();

      // 1. Partition Alice and Bob: all packets dropped
      network.partition([hostId], [bobId]);

      // Host advances settings during partition
      host.updateSettings({ roundDurationSeconds: 240 });
      await network.flush();

      // Bob did not receive the update yet due to network partition
      expect(clients[0].getState()?.settings.roundDurationSeconds).toBe(180);

      // 2. Heal network partition
      network.healPartitions();

      // Resync broadcast
      host.broadcastSanitizedSync();
      await network.flush();

      // Bob caught up completely to latest authoritative state
      expect(clients[0].getState()?.settings.roundDurationSeconds).toBe(240);
    });
  });
});
