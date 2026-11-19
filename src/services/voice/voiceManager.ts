/**
 * VoiceManager — WebRTC Audio & Voice Chat Service for Chomu Who?
 * Manages:
 * 1. Local microphone acquisition with echoCancellation, noiseSuppression, autoGainControl.
 * 2. Mute / Unmute and Deafen / Undeafen state handling.
 * 3. Remote peer audio playback elements with deafen synchronization.
 * 4. Real-time RMS audio level and speaking detection via AudioAnalyser.
 * 5. P2P room stream integration (e.g., Trystero / WebRTC).
 */

import { AudioAnalyser, AudioAnalysisResult } from './audioAnalyser';
import { useState, useEffect } from 'react';

export interface RemotePeerVoice {
  peerId: string;
  stream: MediaStream;
  audioElement: HTMLAudioElement;
  analyser?: AudioAnalyser | null;
  volume: number;
}

export interface VoiceState {
  isSupported: boolean;
  hasPermission: boolean;
  isInitializing: boolean;
  isMicActive: boolean;
  isMicOn: boolean;
  isMuted: boolean;
  isDeafened: boolean;
  isLocalSpeaking: boolean;
  localLevel: number;
  speakingPeers: Record<string, boolean>;
  peerLevels: Record<string, number>;
  activePeerIds: string[];
  error: string | null;
  isCameraOn: boolean;
  peerStreams: Record<string, MediaStream>;
}

export type VoiceStateListener = (state: VoiceState) => void;

export type MediaUpdateListener = (data: {
  isCameraOn: boolean;
  peerStreams: Record<string, MediaStream>;
  localStream: MediaStream | null;
  isMicOn: boolean;
}) => void;

export interface RoomStreamAdapter {
  addStream?: (stream: MediaStream, targetPeerId?: string | { target?: string }) => void | Promise<void>;
  removeStream?: (stream: MediaStream, targetPeerId?: string | { target?: string }) => void | Promise<void>;
  onStream?: (callback: (stream: MediaStream, peerId: string) => void) => void;
  onPeerStream?: (callback: (stream: MediaStream, context: any) => void) => void;
}

export class VoiceManager {
  private localStream: MediaStream | null = null;
  private localAnalyser: AudioAnalyser | null = null;
  private remotePeers: Map<string, RemotePeerVoice> = new Map();
  private _peerStreams: Record<string, MediaStream> = {};
  private attachedRoom: RoomStreamAdapter | null = null;

  private wasMutedBeforeDeafen: boolean = false;
  private listeners: Set<VoiceStateListener> = new Set();
  private mediaListeners: Set<MediaUpdateListener> = new Set();

  private state: VoiceState = {
    isSupported:
      typeof navigator !== 'undefined' &&
      'mediaDevices' in navigator &&
      typeof navigator.mediaDevices?.getUserMedia === 'function',
    hasPermission: false,
    isInitializing: false,
    isMicActive: false,
    isMicOn: false,
    isMuted: false,
    isDeafened: false,
    isLocalSpeaking: false,
    localLevel: 0,
    speakingPeers: {},
    peerLevels: {},
    activePeerIds: [],
    error: null,
    isCameraOn: false,
    peerStreams: {},
  };

  constructor() {
    this.checkSupport();
  }

  private checkSupport(): void {
    if (
      typeof navigator !== 'undefined' &&
      'mediaDevices' in navigator &&
      typeof navigator.mediaDevices?.getUserMedia === 'function'
    ) {
      this.state.isSupported = true;
    } else {
      this.state.isSupported = false;
    }
  }

  public get isMicOn(): boolean {
    return this.state.isMicActive && !this.state.isMuted;
  }

  public get isCameraOn(): boolean {
    return this.state.isCameraOn;
  }

  public get peerStreams(): Record<string, MediaStream> {
    return { ...this._peerStreams };
  }

  public getPeerStreams(): Record<string, MediaStream> {
    return { ...this._peerStreams };
  }

  public getPeerStream(peerId: string): MediaStream | undefined {
    return this._peerStreams[peerId];
  }

  /**
   * Acquire local microphone with echo cancellation, noise suppression, and auto gain control.
   */
  public async startMicrophone(constraints?: MediaTrackConstraints): Promise<MediaStream | null> {
    this.checkSupport();
    if (!this.state.isSupported) {
      this.updateState({ error: 'Audio capture is not supported on this device/browser.' });
      return null;
    }

    if (
      this.localStream &&
      this.state.isMicActive &&
      typeof this.localStream.getAudioTracks === 'function' &&
      this.localStream.getAudioTracks().some((t) => t.readyState === 'live')
    ) {
      return this.localStream;
    }

    this.updateState({ isInitializing: true, error: null });

    try {
      const audioConstraints: MediaTrackConstraints = {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        ...constraints,
      };

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: audioConstraints,
        video: false,
      });

      const audioTrack = typeof stream.getAudioTracks === 'function' ? stream.getAudioTracks()[0] : null;

      if (this.localStream) {
        // If camera is already active on localStream, preserve video tracks and attach audio track
        if (typeof this.localStream.getAudioTracks === 'function') {
          this.localStream.getAudioTracks().forEach((track) => {
            track.stop();
            if (typeof this.localStream?.removeTrack === 'function') {
              this.localStream.removeTrack(track);
            }
          });
        }
        if (audioTrack && typeof this.localStream.addTrack === 'function') {
          this.localStream.addTrack(audioTrack);
        }
      } else {
        this.localStream = stream;
      }

      // Apply current mute state to newly acquired tracks
      if (this.state.isMuted || this.state.isDeafened) {
        if (typeof this.localStream.getAudioTracks === 'function') {
          this.localStream.getAudioTracks().forEach((track) => {
            track.enabled = false;
          });
        }
      }

      // Initialize analyser for speaking detection
      this.localAnalyser = new AudioAnalyser(this.localStream, {
        threshold: 0.02,
        holdTimeMs: 220,
      });

      this.localAnalyser.subscribe((result: AudioAnalysisResult) => {
        if (this.state.isMuted || this.state.isDeafened) {
          if (this.state.isLocalSpeaking || this.state.localLevel !== 0) {
            this.updateState({ isLocalSpeaking: false, localLevel: 0 });
          }
          return;
        }

        if (
          this.state.isLocalSpeaking !== result.isSpeaking ||
          Math.abs(this.state.localLevel - result.level) > 0.04
        ) {
          this.updateState({
            isLocalSpeaking: result.isSpeaking,
            localLevel: result.level,
          });
        }
      });

      this.updateState({
        hasPermission: true,
        isInitializing: false,
        isMicActive: true,
        error: null,
      });

      // Broadcast combined stream to room
      this.publishLocalStream(this.localStream);

      return this.localStream;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to access microphone';
      console.error('[VoiceManager] getUserMedia error:', err);
      this.updateState({
        hasPermission: false,
        isInitializing: false,
        isMicActive: false,
        error: message,
      });
      return null;
    }
  }

  /**
   * Stop local microphone and release hardware tracks.
   */
  public stopMicrophone(): void {
    if (this.localStream) {
      if (typeof this.localStream.getAudioTracks === 'function') {
        this.localStream.getAudioTracks().forEach((t) => {
          t.stop();
          if (typeof this.localStream?.removeTrack === 'function') {
            this.localStream.removeTrack(t);
          }
        });
      }

      // If camera is not active or no video tracks remain, stop all tracks and clear localStream
      const hasVideo =
        this.state.isCameraOn &&
        typeof this.localStream.getVideoTracks === 'function' &&
        this.localStream.getVideoTracks().length > 0;

      if (!hasVideo) {
        if (this.attachedRoom?.removeStream) {
          try {
            this.attachedRoom.removeStream(this.localStream);
          } catch {}
        }

        if (typeof this.localStream.getTracks === 'function') {
          this.localStream.getTracks().forEach((t) => t.stop());
        }
        this.localStream = null;
      } else {
        // Video track remains, publish video stream
        this.publishLocalStream(this.localStream);
      }
    }

    if (this.localAnalyser) {
      this.localAnalyser.destroy();
      this.localAnalyser = null;
    }

    this.updateState({
      isMicActive: false,
      isLocalSpeaking: false,
      localLevel: 0,
    });
  }

  /**
   * Enable video camera with standard WebRTC constraints.
   */
  public async enableCamera(constraints?: MediaTrackConstraints): Promise<MediaStream | null> {
    this.checkSupport();
    if (!this.state.isSupported) {
      this.updateState({ error: 'Media capture is not supported on this device/browser.' });
      return null;
    }

    if (
      this.state.isCameraOn &&
      this.localStream &&
      typeof this.localStream.getVideoTracks === 'function' &&
      this.localStream.getVideoTracks().some((t) => t.readyState === 'live')
    ) {
      return this.localStream;
    }

    try {
      const videoConstraints: MediaTrackConstraints = {
        width: { ideal: 480 },
        height: { ideal: 360 },
        frameRate: { max: 20 },
        ...constraints,
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: videoConstraints,
        audio: false,
      });

      const videoTrack =
        typeof mediaStream.getVideoTracks === 'function' ? mediaStream.getVideoTracks()[0] : null;

      if (!videoTrack) {
        throw new Error('No video track returned from camera');
      }

      if (!this.localStream) {
        if (typeof MediaStream !== 'undefined') {
          this.localStream = new MediaStream([videoTrack]);
        } else {
          this.localStream = mediaStream;
        }
      } else {
        if (typeof this.localStream.getVideoTracks === 'function') {
          this.localStream.getVideoTracks().forEach((track) => {
            track.stop();
            if (typeof this.localStream?.removeTrack === 'function') {
              this.localStream.removeTrack(track);
            }
          });
        }
        if (typeof this.localStream.addTrack === 'function') {
          this.localStream.addTrack(videoTrack);
        }
      }

      videoTrack.onended = () => {
        this.disableCamera();
      };

      this.updateState({
        isCameraOn: true,
        error: null,
      });

      // Publish combined audio+video stream to room peers
      this.publishLocalStream(this.localStream);

      return this.localStream;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to access camera';
      console.error('[VoiceManager] enableCamera error:', err);
      this.updateState({
        isCameraOn: false,
        error: message,
      });
      return null;
    }
  }

  /**
   * Disable camera and release video hardware tracks.
   */
  public disableCamera(): void {
    if (this.localStream) {
      if (typeof this.localStream.getVideoTracks === 'function') {
        this.localStream.getVideoTracks().forEach((track) => {
          track.stop();
          if (typeof this.localStream?.removeTrack === 'function') {
            this.localStream.removeTrack(track);
          }
        });
      }

      const hasAudio =
        this.state.isMicActive &&
        typeof this.localStream.getAudioTracks === 'function' &&
        this.localStream.getAudioTracks().length > 0;

      if (!hasAudio) {
        if (this.attachedRoom?.removeStream) {
          try {
            this.attachedRoom.removeStream(this.localStream);
          } catch {}
        }
        if (typeof this.localStream.getTracks === 'function') {
          this.localStream.getTracks().forEach((t) => t.stop());
        }
        this.localStream = null;
      } else {
        // Audio tracks remain, re-publish audio stream
        this.publishLocalStream(this.localStream);
      }
    }

    this.updateState({
      isCameraOn: false,
    });
  }

  /**
   * Toggle camera state on or off.
   */
  public async toggleCamera(): Promise<void> {
    if (this.state.isCameraOn) {
      this.disableCamera();
    } else {
      await this.enableCamera();
    }
  }

  /**
   * Mute or unmute the local microphone.
   * Disables local audio tracks and clears local speaking state.
   */
  public setMuted(muted: boolean): void {
    if (this.state.isMuted === muted) return;

    if (this.localStream && typeof this.localStream.getAudioTracks === 'function') {
      this.localStream.getAudioTracks().forEach((track) => {
        track.enabled = !muted;
      });
    }

    this.updateState({
      isMuted: muted,
      isLocalSpeaking: muted ? false : this.state.isLocalSpeaking,
      localLevel: muted ? 0 : this.state.localLevel,
    });
  }

  /**
   * Toggle mute state. If microphone is not yet started, initiates mic request.
   */
  public async toggleMute(): Promise<void> {
    if (!this.state.isMicActive && !this.state.isMuted) {
      await this.startMicrophone();
      return;
    }
    this.setMuted(!this.state.isMuted);
  }

  /**
   * Deafen or undeafen voice audio.
   * Mutes all remote audio playback elements.
   * Automatically mutes microphone when deafening, and restores mic state on undeafen.
   */
  public setDeafened(deafened: boolean): void {
    if (this.state.isDeafened === deafened) return;

    // Apply deafen to all remote audio playback elements
    this.remotePeers.forEach((peer) => {
      peer.audioElement.muted = deafened;
    });

    if (deafened) {
      this.wasMutedBeforeDeafen = this.state.isMuted;
      this.setMuted(true);
    } else {
      // Undeafening: restore mic to previous state
      if (!this.wasMutedBeforeDeafen) {
        this.setMuted(false);
      }
    }

    this.updateState({
      isDeafened: deafened,
    });
  }

  /**
   * Toggle deafen state.
   */
  public toggleDeafen(): void {
    this.setDeafened(!this.state.isDeafened);
  }

  /**
   * Add a remote peer's media stream (audio, video, or combined).
   * Creates an HTMLAudioElement with deafen-awareness, an AudioAnalyser for speaking detection,
   * and tracks the peer's video/audio stream in peerStreams.
   */
  public addRemoteStream(peerId: string, stream: MediaStream): HTMLAudioElement {
    // If peer already exists, clean previous one up first
    if (this.remotePeers.has(peerId)) {
      this.removeRemoteStream(peerId);
    }

    let audio: HTMLAudioElement;
    if (typeof document !== 'undefined') {
      audio = document.createElement('audio');
      audio.autoplay = true;
      audio.setAttribute('playsinline', 'true');
      audio.style.display = 'none';
      document.body.appendChild(audio);
    } else {
      audio = {
        autoplay: true,
        muted: false,
        volume: 1,
        srcObject: null,
        play: async () => {},
        pause: () => {},
      } as unknown as HTMLAudioElement;
    }

    audio.srcObject = stream;
    audio.muted = this.state.isDeafened;
    audio.volume = 1.0;

    try {
      const playPromise = audio.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch((e) => {
          console.warn(`[VoiceManager] Autoplay prevented for peer ${peerId}:`, e);
        });
      }
    } catch {}

    const analyser = new AudioAnalyser(stream, {
      threshold: 0.02,
      holdTimeMs: 220,
    });

    analyser.subscribe((result: AudioAnalysisResult) => {
      const prevSpeaking = !!this.state.speakingPeers[peerId];
      const prevLevel = this.state.peerLevels[peerId] || 0;

      if (prevSpeaking !== result.isSpeaking || Math.abs(prevLevel - result.level) > 0.05) {
        const updatedSpeaking = { ...this.state.speakingPeers, [peerId]: result.isSpeaking };
        const updatedLevels = { ...this.state.peerLevels, [peerId]: result.level };
        this.updateState({
          speakingPeers: updatedSpeaking,
          peerLevels: updatedLevels,
        });
      }
    });

    const peerVoice: RemotePeerVoice = {
      peerId,
      stream,
      audioElement: audio,
      analyser,
      volume: 1.0,
    };

    this.remotePeers.set(peerId, peerVoice);
    this._peerStreams[peerId] = stream;

    this.updateState({
      activePeerIds: Array.from(this.remotePeers.keys()),
      peerStreams: { ...this._peerStreams },
    });

    return audio;
  }

  /**
   * Remove a remote peer stream, pausing audio, destroying analyser, and removing from peerStreams.
   */
  public removeRemoteStream(peerId: string): void {
    const peer = this.remotePeers.get(peerId);
    if (!peer) {
      if (this._peerStreams[peerId]) {
        delete this._peerStreams[peerId];
        this.updateState({
          peerStreams: { ...this._peerStreams },
        });
      }
      return;
    }

    try {
      peer.audioElement.pause();
      peer.audioElement.srcObject = null;
      if (peer.audioElement.parentNode) {
        peer.audioElement.parentNode.removeChild(peer.audioElement);
      }
    } catch {}

    if (peer.analyser) {
      peer.analyser.destroy();
    }
    this.remotePeers.delete(peerId);
    delete this._peerStreams[peerId];

    const updatedSpeaking = { ...this.state.speakingPeers };
    delete updatedSpeaking[peerId];

    const updatedLevels = { ...this.state.peerLevels };
    delete updatedLevels[peerId];

    this.updateState({
      speakingPeers: updatedSpeaking,
      peerLevels: updatedLevels,
      activePeerIds: Array.from(this.remotePeers.keys()),
      peerStreams: { ...this._peerStreams },
    });
  }

  /**
   * Set playback volume for an individual remote peer (0.0 to 1.0).
   */
  public setPeerVolume(peerId: string, volume: number): void {
    const peer = this.remotePeers.get(peerId);
    if (!peer) return;
    const clamped = Math.max(0, Math.min(1, volume));
    peer.volume = clamped;
    peer.audioElement.volume = clamped;
  }

  /**
   * Check if a specific peer is currently speaking.
   */
  public isPeerSpeaking(peerId: string): boolean {
    return !!this.state.speakingPeers[peerId];
  }

  /**
   * Get audio level for a specific peer (0.0 to 1.0).
   */
  public getPeerLevel(peerId: string): number {
    return this.state.peerLevels[peerId] || 0;
  }

  /**
   * Attach VoiceManager to a room (e.g. Trystero room).
   */
  public attachRoom(room: RoomStreamAdapter): void {
    this.attachedRoom = room;

    const handleIncomingStream = (stream: MediaStream, contextOrPeerId: any) => {
      const peerId =
        typeof contextOrPeerId === 'string'
          ? contextOrPeerId
          : contextOrPeerId?.peerId || contextOrPeerId?.userId || '';
      if (peerId) {
        this.addRemoteStream(peerId, stream);
      }
    };

    // Listen to incoming remote streams from peers (supports both Trystero onPeerStream and legacy onStream)
    if (room.onPeerStream) {
      room.onPeerStream(handleIncomingStream);
    } else if (room.onStream) {
      room.onStream(handleIncomingStream);
    }

    // Publish existing local stream if mic or camera is already active
    if (this.localStream && room.addStream) {
      try {
        room.addStream(this.localStream);
      } catch (err) {
        console.warn('[VoiceManager] Failed to publish stream to newly attached room:', err);
      }
    }
  }

  /**
   * Broadcast or target local stream to a specific peer or room.
   * Supports `publishLocalStream(stream)` or `publishLocalStream(targetPeerId)` or `publishLocalStream(stream, targetPeerId)`.
   */
  public publishLocalStream(streamOrTarget?: MediaStream | string, targetPeerId?: string): void {
    let streamToPublish: MediaStream | null = this.localStream;
    let target: string | undefined = undefined;

    if (
      (typeof MediaStream !== 'undefined' && streamOrTarget instanceof MediaStream) ||
      (streamOrTarget && typeof (streamOrTarget as any).getTracks === 'function')
    ) {
      streamToPublish = streamOrTarget as MediaStream;
      target = targetPeerId;
    } else if (typeof streamOrTarget === 'string') {
      target = streamOrTarget;
    }

    if (streamToPublish && this.attachedRoom?.addStream) {
      try {
        if (target) {
          this.attachedRoom.addStream(streamToPublish, { target });
        } else {
          this.attachedRoom.addStream(streamToPublish);
        }
      } catch (err) {
        console.warn('[VoiceManager] Failed to publish stream to peer:', err);
      }
    }
  }

  /**
   * Detach from current room and clean up remote streams.
   */
  public detachRoom(): void {
    if (this.attachedRoom && this.localStream && this.attachedRoom.removeStream) {
      try {
        this.attachedRoom.removeStream(this.localStream);
      } catch {}
    }
    this.attachedRoom = null;

    // Clean up all remote peer audio elements and streams
    Array.from(this.remotePeers.keys()).forEach((peerId) => {
      this.removeRemoteStream(peerId);
    });
    this._peerStreams = {};
    this.updateState({
      peerStreams: {},
    });
  }

  public getLocalStream(): MediaStream | null {
    return this.localStream;
  }

  public getState(): VoiceState {
    return { ...this.state };
  }

  public subscribe(listener: VoiceStateListener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Subscribe to camera, local stream, or remote stream updates.
   */
  public onMediaUpdate(listener: MediaUpdateListener): () => void {
    this.mediaListeners.add(listener);
    listener({
      isCameraOn: this.state.isCameraOn,
      peerStreams: { ...this._peerStreams },
      localStream: this.localStream,
      isMicOn: this.isMicOn,
    });
    return () => {
      this.mediaListeners.delete(listener);
    };
  }

  private updateState(partial: Partial<VoiceState>): void {
    const nextState = { ...this.state, ...partial };
    nextState.isMicOn = nextState.isMicActive && !nextState.isMuted;
    this.state = nextState;
    const current = this.getState();

    this.listeners.forEach((listener) => {
      try {
        listener(current);
      } catch (err) {
        console.error('[VoiceManager] State listener error:', err);
      }
    });

    if (
      partial.isCameraOn !== undefined ||
      partial.peerStreams !== undefined ||
      partial.isMicActive !== undefined ||
      partial.isMuted !== undefined
    ) {
      const mediaPayload = {
        isCameraOn: this.state.isCameraOn,
        peerStreams: { ...this._peerStreams },
        localStream: this.localStream,
        isMicOn: this.isMicOn,
      };
      this.mediaListeners.forEach((listener) => {
        try {
          listener(mediaPayload);
        } catch (err) {
          console.error('[VoiceManager] Media listener error:', err);
        }
      });
    }
  }

  /**
   * Clean up all audio tracks, video tracks, elements, and analyzers.
   */
  public destroy(): void {
    this.disableCamera();
    this.stopMicrophone();
    this.detachRoom();
    this.listeners.clear();
    this.mediaListeners.clear();
  }
}

/** Global singleton instance */
export const voiceManager = new VoiceManager();

/**
 * Convenient React hook to bind components directly to VoiceManager state and controls.
 */
export const useVoiceState = (manager: VoiceManager = voiceManager) => {
  const [state, setState] = useState<VoiceState>(() => manager.getState());

  useEffect(() => {
    return manager.subscribe(setState);
  }, [manager]);

  return {
    ...state,
    localStream: manager.getLocalStream(),
    manager,
    startMicrophone: () => manager.startMicrophone(),
    stopMicrophone: () => manager.stopMicrophone(),
    enableCamera: (constraints?: MediaTrackConstraints) => manager.enableCamera(constraints),
    disableCamera: () => manager.disableCamera(),
    toggleCamera: () => manager.toggleCamera(),
    setMuted: (muted: boolean) => manager.setMuted(muted),
    setDeafened: (deafened: boolean) => manager.setDeafened(deafened),
    toggleMute: () => manager.toggleMute(),
    toggleDeafen: () => manager.toggleDeafen(),
    setPeerVolume: (peerId: string, volume: number) => manager.setPeerVolume(peerId, volume),
    isPeerSpeaking: (peerId: string) => manager.isPeerSpeaking(peerId),
    getPeerLevel: (peerId: string) => manager.getPeerLevel(peerId),
    getPeerStream: (peerId: string) => manager.getPeerStream(peerId),
  };
};
