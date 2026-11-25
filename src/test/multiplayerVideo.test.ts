import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { VoiceManager } from '../services/voice/voiceManager';
import { VideoCard } from '../components/common/VideoCard';
import { OnlineRoundView } from '../components/views/online/OnlineRoundView';
import { OnlinePlayer, RoomState } from '../types/multiplayer';

// Shared mock multiplayer context value for OnlineRoundView integration tests
const mockMultiplayerContextState: any = {
  roomState: null,
  phase: 'ROUND',
  players: [],
  myPlayerId: 'p-local',
  myPlayer: null,
  mySecret: null,
  isHost: true,
  isReady: true,
  error: null,
  inviteLink: 'https://chomu.app/?room=VIDE',
  timerRemaining: 90,
  chatMessages: [],
  speakingPeers: {},
  localStream: null,
  peerStreams: {},
  isCameraOn: false,
  isMicOn: true,
  createRoom: vi.fn(),
  joinRoom: vi.fn(),
  leaveRoom: vi.fn(),
  setReady: vi.fn(),
  updateSettings: vi.fn(),
  startGame: vi.fn(),
  markRoleSeen: vi.fn(),
  endRound: vi.fn(),
  startVoting: vi.fn(),
  castVote: vi.fn(),
  playAgain: vi.fn(),
  kickPlayer: vi.fn(),
  sendChat: vi.fn(),
  clearError: vi.fn(),
  toggleCamera: vi.fn(),
  enableCamera: vi.fn(),
  disableCamera: vi.fn(),
  toggleMic: vi.fn(),
};

vi.mock('../context/MultiplayerContext', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../context/MultiplayerContext')>();
  return {
    ...actual,
    useMultiplayer: () => mockMultiplayerContextState,
  };
});

describe('WebRTC Video Streaming & Dynamic Layout Test Suite', () => {
  describe('1. Video Track Publishing & Room Stream Attachment in VoiceManager', () => {
    let vm: VoiceManager;

    beforeEach(() => {
      vm = new VoiceManager();
    });

    afterEach(() => {
      vm.destroy();
      vi.unstubAllGlobals();
    });

    it('attaches to room adapter and subscribes to remote peer stream events', () => {
      let registeredPeerHandler: ((stream: MediaStream, ctx: any) => void) | null = null;
      const mockRoom = {
        addStream: vi.fn(),
        removeStream: vi.fn(),
        onPeerStream: vi.fn((cb: any) => {
          registeredPeerHandler = cb;
        }),
      };

      vm.attachRoom(mockRoom);
      expect(mockRoom.onPeerStream).toHaveBeenCalledTimes(1);
      expect(registeredPeerHandler).not.toBeNull();

      // Incoming remote stream from peer
      const mockRemoteStream = {
        getAudioTracks: () => [],
        getVideoTracks: () => [{ kind: 'video', enabled: true, readyState: 'live' }],
      } as unknown as MediaStream;

      registeredPeerHandler!(mockRemoteStream, { peerId: 'peer_zoom_42' });

      expect(vm.getState().activePeerIds).toContain('peer_zoom_42');
      expect(vm.peerStreams['peer_zoom_42']).toBe(mockRemoteStream);
      expect(vm.getState().peerStreams['peer_zoom_42']).toBe(mockRemoteStream);
      expect(vm.getPeerStream('peer_zoom_42')).toBe(mockRemoteStream);
    });

    it('publishes combined audio and video stream to room on camera acquisition', async () => {
      const mockRoom = {
        addStream: vi.fn(),
        removeStream: vi.fn(),
        onPeerStream: vi.fn(),
      };
      vm.attachRoom(mockRoom);

      // Track mocks
      const mockAudioTrack = {
        kind: 'audio',
        enabled: true,
        readyState: 'live',
        stop: vi.fn(),
      };
      const mockVideoTrack = {
        kind: 'video',
        enabled: true,
        readyState: 'live',
        stop: vi.fn(),
        onended: null as (() => void) | null,
      };

      // Mock getUserMedia
      vi.stubGlobal('navigator', {
        mediaDevices: {
          getUserMedia: vi.fn(async (constraints: any) => {
            if (constraints?.video) {
              return {
                getTracks: () => [mockVideoTrack],
                getVideoTracks: () => [mockVideoTrack],
                getAudioTracks: () => [],
                addTrack: vi.fn(),
                removeTrack: vi.fn(),
              } as unknown as MediaStream;
            }
            return {
              getTracks: () => [mockAudioTrack],
              getVideoTracks: () => [],
              getAudioTracks: () => [mockAudioTrack],
              addTrack: vi.fn(),
              removeTrack: vi.fn(),
            } as unknown as MediaStream;
          }),
        },
      });

      // Enable microphone first
      await vm.startMicrophone();
      expect(mockRoom.addStream).toHaveBeenCalled();
      const initialStream = vm.getLocalStream();
      expect(initialStream).not.toBeNull();

      // Next enable camera - stream becomes combined
      await vm.enableCamera();
      expect(vm.isCameraOn).toBe(true);
      expect(mockRoom.addStream).toHaveBeenCalledWith(vm.getLocalStream());
    });

    it('supports targeted and broadcast publishing via publishLocalStream', () => {
      const mockRoom = {
        addStream: vi.fn(),
        removeStream: vi.fn(),
        onPeerStream: vi.fn(),
      };
      vm.attachRoom(mockRoom);

      const mockStream = {
        getTracks: () => [],
        getVideoTracks: () => [],
        getAudioTracks: () => [],
      } as unknown as MediaStream;

      // Broadcast call
      vm.publishLocalStream(mockStream);
      expect(mockRoom.addStream).toHaveBeenCalledWith(mockStream);

      // Targeted peer call
      vm.publishLocalStream(mockStream, 'peer_target_99');
      expect(mockRoom.addStream).toHaveBeenCalledWith(mockStream, { target: 'peer_target_99' });

      // Overload with target peer string directly
      (vm as unknown as { localStream: MediaStream }).localStream = mockStream;
      vm.publishLocalStream('peer_target_direct');
      expect(mockRoom.addStream).toHaveBeenCalledWith(mockStream, { target: 'peer_target_direct' });
    });

    it('notifies onMediaUpdate subscribers on peer stream additions and removals', () => {
      const receivedUpdates: any[] = [];
      const unsub = vm.onMediaUpdate((update) => {
        receivedUpdates.push(update);
      });

      // Initial subscription firing
      expect(receivedUpdates.length).toBe(1);
      expect(receivedUpdates[0].isCameraOn).toBe(false);
      expect(receivedUpdates[0].peerStreams).toEqual({});

      // Add remote peer stream
      const mockStream1 = {
        getAudioTracks: () => [],
        getVideoTracks: () => [],
      } as unknown as MediaStream;

      vm.addRemoteStream('peer_alpha', mockStream1);
      expect(receivedUpdates.length).toBeGreaterThan(1);
      const latestAdd = receivedUpdates[receivedUpdates.length - 1];
      expect(latestAdd.peerStreams['peer_alpha']).toBe(mockStream1);

      // Remove remote peer stream
      vm.removeRemoteStream('peer_alpha');
      const latestRemove = receivedUpdates[receivedUpdates.length - 1];
      expect(latestRemove.peerStreams['peer_alpha']).toBeUndefined();

      unsub();
    });
  });

  describe('2. Camera Enable / Disable / Toggle Lifecycle', () => {
    let vm: VoiceManager;

    beforeEach(() => {
      vm = new VoiceManager();
    });

    afterEach(() => {
      vm.destroy();
      vi.unstubAllGlobals();
    });

    it('applies standard 480x360@20fps ideal WebRTC constraints', async () => {
      let passedConstraints: any = null;
      const mockVideoTrack = {
        kind: 'video',
        readyState: 'live',
        stop: vi.fn(),
        onended: null as (() => void) | null,
      };

      vi.stubGlobal('navigator', {
        mediaDevices: {
          getUserMedia: vi.fn(async (constraints: any) => {
            passedConstraints = constraints;
            return {
              getVideoTracks: () => [mockVideoTrack],
              getAudioTracks: () => [],
              getTracks: () => [mockVideoTrack],
              addTrack: vi.fn(),
              removeTrack: vi.fn(),
            } as unknown as MediaStream;
          }),
        },
      });

      await vm.enableCamera();
      expect(passedConstraints).toBeDefined();
      expect(passedConstraints.audio).toBe(false);
      expect(passedConstraints.video).toEqual({
        width: { ideal: 480 },
        height: { ideal: 360 },
        frameRate: { max: 20 },
      });
      expect(vm.isCameraOn).toBe(true);
      expect(vm.getState().isCameraOn).toBe(true);
    });

    it('returns existing stream immediately if camera is already live and enabled', async () => {
      const mockVideoTrack = {
        kind: 'video',
        readyState: 'live',
        stop: vi.fn(),
      };
      const getUserMediaMock = vi.fn(async () => ({
        getVideoTracks: () => [mockVideoTrack],
        getAudioTracks: () => [],
        getTracks: () => [mockVideoTrack],
        addTrack: vi.fn(),
        removeTrack: vi.fn(),
      }));

      vi.stubGlobal('navigator', {
        mediaDevices: {
          getUserMedia: getUserMediaMock,
        },
      });

      const firstStream = await vm.enableCamera();
      expect(getUserMediaMock).toHaveBeenCalledTimes(1);

      // Second enable call should be no-op
      const secondStream = await vm.enableCamera();
      expect(getUserMediaMock).toHaveBeenCalledTimes(1);
      expect(secondStream).toBe(firstStream);
    });

    it('stops hardware video tracks and updates state when disabled', async () => {
      const stopFn = vi.fn();
      const mockVideoTrack = {
        kind: 'video',
        readyState: 'live',
        stop: stopFn,
      };

      vi.stubGlobal('navigator', {
        mediaDevices: {
          getUserMedia: vi.fn(async () => ({
            getVideoTracks: () => [mockVideoTrack],
            getAudioTracks: () => [],
            getTracks: () => [mockVideoTrack],
            addTrack: vi.fn(),
            removeTrack: vi.fn(),
          })),
        },
      });

      await vm.enableCamera();
      expect(vm.isCameraOn).toBe(true);

      vm.disableCamera();
      expect(vm.isCameraOn).toBe(false);
      expect(vm.getState().isCameraOn).toBe(false);
      expect(stopFn).toHaveBeenCalled();
    });

    it('toggles camera state back and forth cleanly', async () => {
      const enableSpy = vi.spyOn(vm, 'enableCamera').mockResolvedValue(null);
      const disableSpy = vi.spyOn(vm, 'disableCamera');

      // First toggle: was false -> calls enable
      await vm.toggleCamera();
      expect(enableSpy).toHaveBeenCalledTimes(1);

      // Simulate camera active
      (vm as unknown as { state: { isCameraOn: boolean } }).state.isCameraOn = true;

      // Second toggle: was true -> calls disable
      await vm.toggleCamera();
      expect(disableSpy).toHaveBeenCalledTimes(1);
    });

    it('handles camera permission rejection gracefully without crashing', async () => {
      vi.stubGlobal('navigator', {
        mediaDevices: {
          getUserMedia: vi.fn(async () => {
            throw new Error('NotAllowedError: Permission denied');
          }),
        },
      });

      const res = await vm.enableCamera();
      expect(res).toBeNull();
      expect(vm.isCameraOn).toBe(false);
      expect(vm.getState().isCameraOn).toBe(false);
      expect(vm.getState().error).toContain('NotAllowedError');
    });

    it('automatically disables camera when track emits onended event', async () => {
      let trackEndedCallback: (() => void) | null = null;
      const mockVideoTrack = {
        kind: 'video',
        readyState: 'live',
        stop: vi.fn(),
        set onended(cb: (() => void) | null) {
          trackEndedCallback = cb;
        },
        get onended(): (() => void) | null {
          return trackEndedCallback;
        },
      };

      vi.stubGlobal('navigator', {
        mediaDevices: {
          getUserMedia: vi.fn(async () => ({
            getVideoTracks: () => [mockVideoTrack],
            getAudioTracks: () => [],
            getTracks: () => [mockVideoTrack],
            addTrack: vi.fn(),
            removeTrack: vi.fn(),
          })),
        },
      });

      await vm.enableCamera();
      expect(vm.isCameraOn).toBe(true);
      expect(trackEndedCallback).not.toBeNull();

      // Trigger track ended (e.g. user revoked browser camera permission)
      trackEndedCallback!();
      expect(vm.isCameraOn).toBe(false);
      expect(vm.getState().isCameraOn).toBe(false);
    });
  });

  describe('3. VideoCard Component Rendering (Active Stream vs Avatar Fallback)', () => {
    const mockPlayer: OnlinePlayer = {
      id: 'p-alice',
      name: 'Alice',
      avatar: 'sleuth',
      isHost: true,
      isReady: true,
      isConnected: true,
      score: 0,
    };

    it('renders persistent video element with block display when stream has active video track', () => {
      const mockLiveTrack = {
        kind: 'video',
        enabled: true,
        readyState: 'live',
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      };

      const mockStream = {
        getVideoTracks: () => [mockLiveTrack],
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      } as unknown as MediaStream;

      const html = renderToStaticMarkup(
        React.createElement(VideoCard, {
          player: mockPlayer,
          stream: mockStream,
          isLocal: false,
        })
      );

      // Video element must be visible (block class) and NOT hidden
      expect(html).toContain('<video');
      expect(html).toContain('block');
      expect(html).not.toContain('Camera off');
      expect(html).toContain('Alice');
      expect(html).toContain('Host');
    });

    it('renders avatar fallback with "Camera off" badge when stream is null or has no active video', () => {
      const html = renderToStaticMarkup(
        React.createElement(VideoCard, {
          player: mockPlayer,
          stream: null,
          isLocal: false,
        })
      );

      // Video element must be hidden and avatar fallback rendered
      expect(html).toContain('<video');
      expect(html).toContain('hidden');
      expect(html).toContain('Camera off');
      expect(html).toContain('Alice');
    });

    it('renders crisp lime speaking border and Live audio badge when isSpeaking is true', () => {
      const htmlSpeaking = renderToStaticMarkup(
        React.createElement(VideoCard, {
          player: mockPlayer,
          stream: null,
          isSpeaking: true,
          audioLevel: 0.5,
        })
      );

      // Speaking border styles (clean ring without neon glow)
      expect(htmlSpeaking).toContain('border-chomu-lime');
      expect(htmlSpeaking).toContain('ring-2 ring-chomu-lime/40');
      expect(htmlSpeaking).toContain('Live');

      const htmlSilent = renderToStaticMarkup(
        React.createElement(VideoCard, {
          player: mockPlayer,
          stream: null,
          isSpeaking: false,
          audioLevel: 0,
        })
      );

      // Default non-speaking hairline styles
      expect(htmlSilent).toContain('border-white/[0.08]');
      expect(htmlSilent).not.toContain('>Live<');
    });

    it('renders spotlight styling and Spotlight badge when isSpotlight is true', () => {
      const htmlSpotlight = renderToStaticMarkup(
        React.createElement(VideoCard, {
          player: mockPlayer,
          stream: null,
          isSpotlight: true,
        })
      );

      expect(htmlSpotlight).toContain('min-h-[260px]');
      expect(htmlSpotlight).toContain('Spotlight');

      const htmlNormal = renderToStaticMarkup(
        React.createElement(VideoCard, {
          player: mockPlayer,
          stream: null,
          isSpotlight: false,
        })
      );

      expect(htmlNormal).toContain('min-h-[140px]');
      expect(htmlNormal).not.toContain('Spotlight');
    });

    it('mirrors local video with -scale-x-100 and shows (You) badge when isLocal is true', () => {
      const mockLiveTrack = {
        kind: 'video',
        enabled: true,
        readyState: 'live',
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      };
      const mockStream = {
        getVideoTracks: () => [mockLiveTrack],
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      } as unknown as MediaStream;

      const htmlLocal = renderToStaticMarkup(
        React.createElement(VideoCard, {
          player: mockPlayer,
          stream: mockStream,
          isLocal: true,
        })
      );

      expect(htmlLocal).toContain('-scale-x-100');
      expect(htmlLocal).toContain('(You)');
    });
  });

  describe('4. Spotlight Selection & Dynamic Filmstrip Layout in OnlineRoundView', () => {
    const players: OnlinePlayer[] = [
      { id: 'p-alice', name: 'Alice', avatar: 'sleuth', isHost: true, isReady: true, isConnected: true, score: 0 },
      { id: 'p-bob', name: 'Bob', avatar: 'shadow', isHost: false, isReady: true, isConnected: true, score: 0 },
      { id: 'p-charlie', name: 'Charlie', avatar: 'agent', isHost: false, isReady: true, isConnected: true, score: 0 },
      { id: 'p-diana', name: 'Diana', avatar: 'whiz', isHost: false, isReady: true, isConnected: true, score: 0 },
    ];

    it('designates currentTurnPlayerId into the spotlight viewport and remaining players in filmstrip tray', () => {
      // Bob is the active turn player; local player is Alice
      mockMultiplayerContextState.players = players;
      mockMultiplayerContextState.myPlayerId = 'p-alice';
      mockMultiplayerContextState.roomState = {
        roomCode: 'VIDE',
        currentTurnPlayerId: 'p-bob',
        roundDurationSeconds: 180,
      } as unknown as RoomState;
      mockMultiplayerContextState.timerRemaining = 120;
      mockMultiplayerContextState.mySecret = {
        category: 'Animals',
        word: 'Kangaroo',
        isChomu: false,
      };

      const html = renderToStaticMarkup(React.createElement(OnlineRoundView));

      // Bob's clue turn banner in spotlight
      expect(html).toContain("Bob&#x27;s Clue Turn");
      expect(html).toContain('Current speaker:');
      expect(html).toContain('Bob');

      // Filmstrip tray containing other 3 players (Alice, Charlie, Diana)
      expect(html).toContain('Filmstrip Tray (3)');
      expect(html).toContain('Charlie');
      expect(html).toContain('Diana');
    });

    it('prominently renders secret clue card alongside local video when it is the local player\'s turn', () => {
      // Alice is local player and it is Alice's turn
      mockMultiplayerContextState.players = players;
      mockMultiplayerContextState.myPlayerId = 'p-alice';
      mockMultiplayerContextState.roomState = {
        roomCode: 'VIDE',
        currentTurnPlayerId: 'p-alice',
        roundDurationSeconds: 180,
      } as unknown as RoomState;
      mockMultiplayerContextState.timerRemaining = 100;
      mockMultiplayerContextState.mySecret = {
        category: 'Food',
        word: 'Pizza',
        isChomu: false,
      };

      const html = renderToStaticMarkup(React.createElement(OnlineRoundView));

      // Secret card displayed alongside local video
      expect(html).toContain('Your turn to speak');
      expect(html).toContain('Secret word');
      expect(html).toContain('Pizza');
      expect(html).toContain('Category: Food');
      expect(html).toContain('Filmstrip Tray (3)');
    });

    it('displays chomu clue card with hint when local player is the Chomu on their turn', () => {
      mockMultiplayerContextState.players = players;
      mockMultiplayerContextState.myPlayerId = 'p-bob';
      mockMultiplayerContextState.roomState = {
        roomCode: 'VIDE',
        currentTurnPlayerId: 'p-bob',
        roundDurationSeconds: 180,
      } as unknown as RoomState;
      mockMultiplayerContextState.timerRemaining = 80;
      mockMultiplayerContextState.mySecret = {
        category: 'Science',
        isChomu: true,
        hint: 'Planetary',
      };

      const html = renderToStaticMarkup(React.createElement(OnlineRoundView));

      expect(html).toContain('Your turn to speak');
      expect(html).toContain('You are the Chomu');
      expect(html).toContain('Chomu clue');
      expect(html).toContain('Your Chomu hint');
      expect(html).toContain('“Planetary”');
      expect(html).toContain('Blend in with the category');

      // Also verify no-hint fallback behavior
      mockMultiplayerContextState.mySecret = {
        category: 'Science',
        isChomu: true,
        hint: '',
      };
      const htmlNoHint = renderToStaticMarkup(React.createElement(OnlineRoundView));
      expect(htmlNoHint).toContain('No hint provided. Bluff with confidence');
    });

    it('renders Google Meet / Zoom style view mode switcher button', () => {
      mockMultiplayerContextState.players = players;
      mockMultiplayerContextState.myPlayerId = 'p-alice';
      mockMultiplayerContextState.roomState = {
        roomCode: 'VIDE',
        currentTurnPlayerId: 'p-alice',
      } as unknown as RoomState;

      const html = renderToStaticMarkup(React.createElement(OnlineRoundView));

      // View switcher toggle button
      expect(html).toContain('Gallery View');
    });
  });
});
