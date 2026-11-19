import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import { AudioAnalyser } from '../services/voice/audioAnalyser';
import { VoiceManager, voiceManager } from '../services/voice/voiceManager';
import { P2PRealtimeService } from '../services/multiplayer/p2pRealtimeService';

describe('Voice & Audio System Unit Tests', () => {
  describe('AudioAnalyser — RMS Audio Energy & Speaking Detection', () => {
    let analyser: AudioAnalyser;

    beforeEach(() => {
      analyser = new AudioAnalyser(undefined, {
        threshold: 0.02,
        holdTimeMs: 150,
      });
    });

    afterEach(() => {
      analyser.destroy();
    });

    it('initializes with default threshold of 0.02 and 0 initial RMS', () => {
      expect(analyser.getThreshold()).toBe(0.02);
      expect(analyser.getRms()).toBe(0);
      expect(analyser.getLevel()).toBe(0);
      expect(analyser.getIsSpeaking()).toBe(false);
    });

    it('allows dynamic threshold updates', () => {
      analyser.setThreshold(0.05);
      expect(analyser.getThreshold()).toBe(0.05);
    });

    it('computes zero RMS when no analyser node or silence is present', () => {
      const rms = analyser.computeRms();
      expect(rms).toBe(0);
    });

    it('correctly calculates RMS from mock byte time domain data', () => {
      // Create mock analyser node
      const mockByteData = new Uint8Array(256);
      // Fill with 128 (exact silence in 8-bit unsigned PCM)
      mockByteData.fill(128);

      const mockAnalyserNode = {
        fftSize: 256,
        smoothingTimeConstant: 0.3,
        getByteTimeDomainData: (arr: Uint8Array) => {
          arr.set(mockByteData);
        },
        disconnect: vi.fn(),
      };

      // Assign mock analyser node into analyser instance
      (analyser as unknown as { analyserNode: unknown; timeData: Uint8Array }).analyserNode =
        mockAnalyserNode;
      (analyser as unknown as { timeData: Uint8Array }).timeData = new Uint8Array(256);

      const silenceRms = analyser.computeRms();
      expect(silenceRms).toBe(0);

      // Now fill with high-amplitude wave (+/- 64 around 128)
      for (let i = 0; i < mockByteData.length; i++) {
        mockByteData[i] = i % 2 === 0 ? 128 + 64 : 128 - 64;
      }

      const activeRms = analyser.computeRms();
      // Normalized amplitude is 64/128 = 0.5. RMS of +/-0.5 square wave is 0.5
      expect(activeRms).toBeCloseTo(0.5, 2);
      expect(activeRms).toBeGreaterThan(0.02);
    });

    it('correctly calculates RMS from mock float time domain data', () => {
      const mockFloatData = new Float32Array(128);
      // Sine-like wave between -0.2 and 0.2
      for (let i = 0; i < mockFloatData.length; i++) {
        mockFloatData[i] = 0.2 * Math.sin((i / 128) * Math.PI * 2);
      }

      const mockAnalyserNode = {
        fftSize: 128,
        smoothingTimeConstant: 0.3,
        getFloatTimeDomainData: (arr: Float32Array) => {
          arr.set(mockFloatData);
        },
        disconnect: vi.fn(),
      };

      (analyser as unknown as { analyserNode: unknown; floatData: Float32Array }).analyserNode =
        mockAnalyserNode;
      (analyser as unknown as { floatData: Float32Array }).floatData = new Float32Array(128);

      const rms = analyser.computeRms();
      // RMS of sine wave with peak amplitude A is A / sqrt(2) ≈ 0.2 / 1.414 ≈ 0.1414
      expect(rms).toBeGreaterThan(0.1);
      expect(rms).toBeLessThan(0.16);
      expect(rms).toBeGreaterThan(analyser.getThreshold());
    });

    it('subscribes to analysis results and un-subscribes properly', () => {
      const listener = vi.fn();
      const unsubscribe = analyser.subscribe(listener);

      // Initial subscription notification
      expect(listener).toHaveBeenCalledWith({
        rms: 0,
        level: 0,
        isSpeaking: false,
      });

      unsubscribe();
      // Destroy should not call removed listener
      analyser.destroy();
      expect(listener).toHaveBeenCalledTimes(1);
    });
  });

  describe('VoiceManager — Microphone, Mute, Deafen & Remote Audio', () => {
    let vm: VoiceManager;

    beforeEach(() => {
      vm = new VoiceManager();
    });

    afterEach(() => {
      vm.destroy();
    });

    it('initializes with default unmuted and undeafened state', () => {
      const state = vm.getState();
      expect(state.isMuted).toBe(false);
      expect(state.isDeafened).toBe(false);
      expect(state.isMicActive).toBe(false);
      expect(state.isLocalSpeaking).toBe(false);
      expect(state.localLevel).toBe(0);
      expect(state.activePeerIds).toEqual([]);
    });

    it('handles setMuted state changes correctly', () => {
      vm.setMuted(true);
      expect(vm.getState().isMuted).toBe(true);
      expect(vm.getState().isLocalSpeaking).toBe(false);
      expect(vm.getState().localLevel).toBe(0);

      vm.setMuted(false);
      expect(vm.getState().isMuted).toBe(false);
    });

    it('toggles mute with toggleMute()', () => {
      // Mark mic as active
      (vm as unknown as { state: { isMicActive: boolean; isMuted: boolean } }).state.isMicActive = true;
      vm.toggleMute();
      expect(vm.getState().isMuted).toBe(true);

      vm.toggleMute();
      expect(vm.getState().isMuted).toBe(false);
    });

    it('handles deafen state changes, auto-muting mic and updating audio elements', () => {
      const mockStream = {} as MediaStream;
      const audioElem = vm.addRemoteStream('peer_123', mockStream);

      expect(audioElem.muted).toBe(false);
      expect(vm.getState().isDeafened).toBe(false);

      // Deafen
      vm.setDeafened(true);
      expect(vm.getState().isDeafened).toBe(true);
      expect(audioElem.muted).toBe(true);
      expect(vm.getState().isMuted).toBe(true); // Auto-muted on deafen

      // Undeafen restores remote audio
      vm.setDeafened(false);
      expect(vm.getState().isDeafened).toBe(false);
      expect(audioElem.muted).toBe(false);
      expect(vm.getState().isMuted).toBe(false); // Restored
    });

    it('adds and removes remote peer audio streams', () => {
      const mockStream = {} as MediaStream;
      vm.addRemoteStream('peer_abc', mockStream);

      expect(vm.getState().activePeerIds).toContain('peer_abc');
      expect(vm.isPeerSpeaking('peer_abc')).toBe(false);
      expect(vm.getPeerLevel('peer_abc')).toBe(0);

      // Adjust peer volume
      vm.setPeerVolume('peer_abc', 0.75);

      // Remove peer
      vm.removeRemoteStream('peer_abc');
      expect(vm.getState().activePeerIds).not.toContain('peer_abc');
    });

    it('attaches to room and publishes local stream', () => {
      const mockRoom = {
        addStream: vi.fn(),
        removeStream: vi.fn(),
        onStream: vi.fn(),
      };

      const mockTrack = { enabled: true, stop: vi.fn() };
      const mockLocalStream = {
        getAudioTracks: () => [mockTrack],
        getTracks: () => [mockTrack],
      } as unknown as MediaStream;

      (vm as unknown as { localStream: MediaStream }).localStream = mockLocalStream;

      vm.attachRoom(mockRoom);
      expect(mockRoom.onStream).toHaveBeenCalled();
      expect(mockRoom.addStream).toHaveBeenCalledWith(mockLocalStream);

      // Detach
      vm.detachRoom();
      expect(mockRoom.removeStream).toHaveBeenCalledWith(mockLocalStream);
    });

    it('attaches to Trystero room via onPeerStream and receives remote peer stream context', () => {
      let registeredHandler: ((stream: MediaStream, ctx: any) => void) | null = null;
      const mockRoom = {
        addStream: vi.fn(),
        removeStream: vi.fn(),
        onPeerStream: vi.fn((cb: any) => {
          registeredHandler = cb;
        }),
      };

      vm.attachRoom(mockRoom);
      expect(mockRoom.onPeerStream).toHaveBeenCalled();
      expect(registeredHandler).not.toBeNull();

      // Trigger incoming peer stream with Trystero context
      const mockPeerStream = {} as MediaStream;
      registeredHandler!(mockPeerStream, { peerId: 'peer_trystero_99' });

      expect(vm.getState().activePeerIds).toContain('peer_trystero_99');

      // Test publishLocalStream targeted & broadcast
      const mockTrack = { enabled: true, stop: vi.fn() };
      const mockLocal = {
        getAudioTracks: () => [mockTrack],
        getTracks: () => [mockTrack],
      } as unknown as MediaStream;
      (vm as unknown as { localStream: MediaStream }).localStream = mockLocal;

      vm.publishLocalStream('peer_trystero_99');
      expect(mockRoom.addStream).toHaveBeenCalledWith(mockLocal, { target: 'peer_trystero_99' });

      vm.publishLocalStream();
      expect(mockRoom.addStream).toHaveBeenCalledWith(mockLocal);
    });

    it('integrates with P2PRealtimeService room lifecycle for voice stream exchange', async () => {
      let attachedToRoom: any = null;
      const attachSpy = vi.spyOn(voiceManager, 'attachRoom').mockImplementation((room) => {
        attachedToRoom = room;
      });
      const detachSpy = vi.spyOn(voiceManager, 'detachRoom');

      const mockActions: Record<string, any> = {};
      const mockJoinRoom = () => ({
        makeAction: (name: string) => {
          const actionObj = {
            send: async () => {},
            onMessage: () => () => {},
          };
          mockActions[name] = actionObj;
          return actionObj;
        },
        onPeerJoin: () => () => {},
        onPeerLeave: () => () => {},
        onPeerStream: () => () => {},
        addStream: vi.fn(),
        removeStream: vi.fn(),
        leave: async () => {},
      });

      const service = new P2PRealtimeService();
      await service.createRoom('VOIC', 'HostAlice', 'sleuth', {
        joinRoomFn: mockJoinRoom,
      });

      expect(attachSpy).toHaveBeenCalled();
      expect(attachedToRoom).not.toBeNull();
      expect(service.getRoom()).toBe(attachedToRoom);

      await service.leaveRoom();
      expect(detachSpy).toHaveBeenCalled();

      attachSpy.mockRestore();
      detachSpy.mockRestore();
    });

    it('stops microphone tracks on stopMicrophone()', () => {
      const stopTrack = vi.fn();
      const mockLocalStream = {
        getTracks: () => [{ stop: stopTrack }],
        getAudioTracks: () => [{ stop: stopTrack }],
      } as unknown as MediaStream;

      (vm as unknown as { localStream: MediaStream }).localStream = mockLocalStream;
      (vm as unknown as { state: { isMicActive: boolean } }).state.isMicActive = true;

      vm.stopMicrophone();
      expect(stopTrack).toHaveBeenCalled();
      expect(vm.getLocalStream()).toBeNull();
      expect(vm.getState().isMicActive).toBe(false);
    });

    it('manages camera lifecycle, constraints, and peerStreams tracking', async () => {
      expect(vm.getState().isCameraOn).toBe(false);
      expect(vm.isCameraOn).toBe(false);
      expect(vm.peerStreams).toEqual({});
      expect(vm.getState().peerStreams).toEqual({});

      // Mock mediaDevices.getUserMedia
      const stopVideoTrack = vi.fn();
      const mockVideoTrack = {
        kind: 'video',
        readyState: 'live',
        stop: stopVideoTrack,
        onended: null as (() => void) | null,
      };

      const mockCameraStream = {
        getVideoTracks: () => [mockVideoTrack],
        getAudioTracks: () => [],
        getTracks: () => [mockVideoTrack],
        addTrack: vi.fn(),
        removeTrack: vi.fn(),
      } as unknown as MediaStream;

      let capturedConstraints: any = null;
      vi.stubGlobal('navigator', {
        mediaDevices: {
          getUserMedia: vi.fn(async (constraints: any) => {
            capturedConstraints = constraints;
            return mockCameraStream;
          }),
        },
      });

      // Mock room to verify stream publishing
      const mockRoom = {
        addStream: vi.fn(),
        removeStream: vi.fn(),
        onPeerStream: vi.fn(),
      };
      vm.attachRoom(mockRoom);

      // Listen to media updates
      const mediaUpdates: any[] = [];
      const unsubMedia = vm.onMediaUpdate((data) => {
        mediaUpdates.push(data);
      });

      // Enable camera
      const resStream = await vm.enableCamera();
      expect(resStream).not.toBeNull();
      expect(vm.getState().isCameraOn).toBe(true);
      expect(vm.isCameraOn).toBe(true);
      expect(capturedConstraints?.video).toEqual({
        width: { ideal: 480 },
        height: { ideal: 360 },
        frameRate: { max: 20 },
      });
      expect(mockRoom.addStream).toHaveBeenCalled();

      // Verify remote stream tracking in peerStreams
      const mockRemoteStream = {
        getAudioTracks: () => [],
        getVideoTracks: () => [{ kind: 'video' }],
      } as unknown as MediaStream;

      vm.addRemoteStream('remote_player_1', mockRemoteStream);
      expect(vm.peerStreams['remote_player_1']).toBe(mockRemoteStream);
      expect(vm.getState().peerStreams['remote_player_1']).toBe(mockRemoteStream);
      expect(vm.getPeerStream('remote_player_1')).toBe(mockRemoteStream);

      // Disable camera
      vm.disableCamera();
      expect(vm.getState().isCameraOn).toBe(false);
      expect(vm.isCameraOn).toBe(false);
      expect(stopVideoTrack).toHaveBeenCalled();

      // Remove remote peer
      vm.removeRemoteStream('remote_player_1');
      expect(vm.peerStreams['remote_player_1']).toBeUndefined();
      expect(vm.getState().peerStreams['remote_player_1']).toBeUndefined();

      unsubMedia();
      vi.unstubAllGlobals();
    });

    it('toggles camera state and handles isMicOn status accurately', async () => {
      expect(vm.isMicOn).toBe(false);
      expect(vm.getState().isMicOn).toBe(false);

      // Simulate mic active and unmuted
      (vm as unknown as { state: { isMicActive: boolean; isMuted: boolean; isMicOn: boolean } }).state.isMicActive = true;
      (vm as unknown as { state: { isMicActive: boolean; isMuted: boolean; isMicOn: boolean } }).state.isMuted = false;
      expect(vm.isMicOn).toBe(true);

      // Mute mic
      vm.setMuted(true);
      expect(vm.isMicOn).toBe(false);
      expect(vm.getState().isMicOn).toBe(false);

      // Toggle camera
      const enableSpy = vi.spyOn(vm, 'enableCamera').mockResolvedValue(null);
      const disableSpy = vi.spyOn(vm, 'disableCamera');

      await vm.toggleCamera();
      expect(enableSpy).toHaveBeenCalled();

      (vm as unknown as { state: { isCameraOn: boolean } }).state.isCameraOn = true;
      await vm.toggleCamera();
      expect(disableSpy).toHaveBeenCalled();
    });
  });

  describe('WebRTC Video & Camera UI/Context Integration', () => {
    it('verifies VoiceControls contains camera toggle button and icons', () => {
      const filePath = path.resolve(process.cwd(), 'src/components/common/VoiceControls.tsx');
      const content = fs.readFileSync(filePath, 'utf8');

      expect(content).toContain('Video');
      expect(content).toContain('VideoOff');
      expect(content).toContain('toggleCamera');
      expect(content).toContain('handleCameraClick');
      expect(content).toContain('isCameraOn');
      expect(content).toContain('CAM');
    });

    it('verifies MultiplayerContext exposes localStream, peerStreams, isCameraOn, toggleCamera, and isMicOn', () => {
      const filePath = path.resolve(process.cwd(), 'src/context/MultiplayerContext.tsx');
      const content = fs.readFileSync(filePath, 'utf8');

      expect(content).toContain('localStream: MediaStream | null;');
      expect(content).toContain('peerStreams: Record<string, MediaStream>;');
      expect(content).toContain('isCameraOn: boolean;');
      expect(content).toContain('isMicOn: boolean;');
      expect(content).toContain('toggleCamera: () => Promise<void>;');
      expect(content).toContain('toggleCamera,');
      expect(content).toContain('isCameraOn,');
      expect(content).toContain('isMicOn,');
      expect(content).toContain('localStream,');
      expect(content).toContain('peerStreams,');
    });
  });
});
