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
  analyser: AudioAnalyser;
  volume: number;
}

export interface VoiceState {
  isSupported: boolean;
  hasPermission: boolean;
  isInitializing: boolean;
  isMicActive: boolean;
  isMuted: boolean;
  isDeafened: boolean;
  isLocalSpeaking: boolean;
  localLevel: number;
  speakingPeers: Record<string, boolean>;
  peerLevels: Record<string, number>;
  activePeerIds: string[];
  error: string | null;
}

export type VoiceStateListener = (state: VoiceState) => void;

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
  private attachedRoom: RoomStreamAdapter | null = null;

  private wasMutedBeforeDeafen: boolean = false;
  private listeners: Set<VoiceStateListener> = new Set();

  private state: VoiceState = {
    isSupported:
      typeof navigator !== 'undefined' &&
      'mediaDevices' in navigator &&
      typeof navigator.mediaDevices?.getUserMedia === 'function',
    hasPermission: false,
    isInitializing: false,
    isMicActive: false,
    isMuted: false,
    isDeafened: false,
    isLocalSpeaking: false,
    localLevel: 0,
    speakingPeers: {},
    peerLevels: {},
    activePeerIds: [],
    error: null,
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

  /**
   * Acquire local microphone with echo cancellation, noise suppression, and auto gain control.
   */
  public async startMicrophone(constraints?: MediaTrackConstraints): Promise<MediaStream | null> {
    if (!this.state.isSupported) {
      this.updateState({ error: 'Audio capture is not supported on this device/browser.' });
      return null;
    }

    if (this.localStream && this.state.isMicActive) {
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

      this.localStream = stream;

      // Apply current mute state to newly acquired tracks
      if (this.state.isMuted || this.state.isDeafened) {
        stream.getAudioTracks().forEach((track) => {
          track.enabled = false;
        });
      }

      // Initialize analyser for speaking detection
      this.localAnalyser = new AudioAnalyser(stream, {
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

      // If already connected to a multiplayer room, broadcast our stream
      if (this.attachedRoom?.addStream) {
        try {
          this.attachedRoom.addStream(stream);
        } catch (e) {
          console.warn('[VoiceManager] Failed to publish stream to room:', e);
        }
      }

      return stream;
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
      if (this.attachedRoom?.removeStream) {
        try {
          this.attachedRoom.removeStream(this.localStream);
        } catch {}
      }

      this.localStream.getTracks().forEach((t) => t.stop());
      this.localStream = null;
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
   * Mute or unmute the local microphone.
   * Disables local audio tracks and clears local speaking state.
   */
  public setMuted(muted: boolean): void {
    if (this.state.isMuted === muted) return;

    if (this.localStream) {
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

    this.updateState({ isDeafened: deafened });
  }

  /**
   * Toggle deafen state.
   */
  public toggleDeafen(): void {
    this.setDeafened(!this.state.isDeafened);
  }

  /**
   * Add a remote peer's audio stream.
   * Creates an HTMLAudioElement with deafen-awareness and an AudioAnalyser for speaking detection.
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
    this.updateState({
      activePeerIds: Array.from(this.remotePeers.keys()),
    });

    return audio;
  }

  /**
   * Remove a remote peer stream, pausing audio and destroying analyser.
   */
  public removeRemoteStream(peerId: string): void {
    const peer = this.remotePeers.get(peerId);
    if (!peer) return;

    try {
      peer.audioElement.pause();
      peer.audioElement.srcObject = null;
      if (peer.audioElement.parentNode) {
        peer.audioElement.parentNode.removeChild(peer.audioElement);
      }
    } catch {}

    peer.analyser.destroy();
    this.remotePeers.delete(peerId);

    const updatedSpeaking = { ...this.state.speakingPeers };
    delete updatedSpeaking[peerId];

    const updatedLevels = { ...this.state.peerLevels };
    delete updatedLevels[peerId];

    this.updateState({
      speakingPeers: updatedSpeaking,
      peerLevels: updatedLevels,
      activePeerIds: Array.from(this.remotePeers.keys()),
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

    // Publish existing local stream if mic is already active
    if (this.localStream && room.addStream) {
      try {
        room.addStream(this.localStream);
      } catch (err) {
        console.warn('[VoiceManager] Failed to publish stream to newly attached room:', err);
      }
    }
  }

  /**
   * Broadcast or target local stream to a specific peer.
   */
  public publishLocalStream(targetPeerId?: string): void {
    if (this.localStream && this.attachedRoom?.addStream) {
      try {
        if (targetPeerId) {
          this.attachedRoom.addStream(this.localStream, { target: targetPeerId });
        } else {
          this.attachedRoom.addStream(this.localStream);
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

    // Clean up all remote peer audio elements
    Array.from(this.remotePeers.keys()).forEach((peerId) => {
      this.removeRemoteStream(peerId);
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

  private updateState(partial: Partial<VoiceState>): void {
    this.state = { ...this.state, ...partial };
    const current = this.getState();
    this.listeners.forEach((listener) => {
      try {
        listener(current);
      } catch (err) {
        console.error('[VoiceManager] State listener error:', err);
      }
    });
  }

  /**
   * Clean up all audio tracks, elements, and analyzers.
   */
  public destroy(): void {
    this.stopMicrophone();
    this.detachRoom();
    this.listeners.clear();
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
    manager,
    startMicrophone: () => manager.startMicrophone(),
    stopMicrophone: () => manager.stopMicrophone(),
    setMuted: (muted: boolean) => manager.setMuted(muted),
    setDeafened: (deafened: boolean) => manager.setDeafened(deafened),
    toggleMute: () => manager.toggleMute(),
    toggleDeafen: () => manager.toggleDeafen(),
    setPeerVolume: (peerId: string, volume: number) => manager.setPeerVolume(peerId, volume),
    isPeerSpeaking: (peerId: string) => manager.isPeerSpeaking(peerId),
    getPeerLevel: (peerId: string) => manager.getPeerLevel(peerId),
  };
};
