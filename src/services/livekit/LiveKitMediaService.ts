import {
  Room,
  RoomEvent,
  Track,
  VideoPresets,
  type LocalTrackPublication,
  type Participant,
  type RemoteParticipant,
  type RemoteTrack,
  type RemoteTrackPublication,
  type RoomOptions,
  type VideoCaptureOptions,
} from 'livekit-client';
import { BackendError, invokeEdgeFunction } from '../supabase/supabaseClient';

export interface LiveKitMediaState {
  isConnected: boolean;
  isConnecting: boolean;
  localStream: MediaStream | null;
  peerStreams: Record<string, MediaStream>;
  isCameraOn: boolean;
  isMicOn: boolean;
  speakingPeers: Record<string, boolean>;
  quotaExhausted: boolean;
  error: string | null;
}

export type LiveKitMediaStateListener = (state: LiveKitMediaState) => void;
export type MintTokenFn = (roomId: string) => Promise<{ token: string; url: string }>;
export type RoomFactory = (options?: RoomOptions) => Room;

const BANDWIDTH_OPTIMIZED_ROOM_OPTIONS: RoomOptions = {
  adaptiveStream: true,
  dynacast: true,
  publishDefaults: {
    simulcast: true,
    videoEncoding: {
      maxBitrate: 300_000,
      maxFramerate: 24,
    },
    videoSimulcastLayers: [VideoPresets.h180, VideoPresets.h360],
    dtx: true,
    red: true,
  },
};

function createInitialState(): LiveKitMediaState {
  return {
    isConnected: false,
    isConnecting: false,
    localStream: null,
    peerStreams: {},
    isCameraOn: false,
    isMicOn: false,
    speakingPeers: {},
    quotaExhausted: false,
    error: null,
  };
}

function createMediaStream(tracks: MediaStreamTrack[]): MediaStream {
  if (typeof MediaStream !== 'undefined') {
    return new MediaStream(tracks);
  }
  const internalTracks = [...tracks];
  return {
    getTracks: () => [...internalTracks],
    getVideoTracks: () => internalTracks.filter((t) => t.kind === 'video'),
    getAudioTracks: () => internalTracks.filter((t) => t.kind === 'audio'),
    addTrack: (track: MediaStreamTrack) => {
      if (!internalTracks.includes(track)) {
        internalTracks.push(track);
      }
    },
    removeTrack: (track: MediaStreamTrack) => {
      const idx = internalTracks.indexOf(track);
      if (idx >= 0) {
        internalTracks.splice(idx, 1);
      }
    },
  } as unknown as MediaStream;
}

function isQuotaError(err: unknown): { isQuota: boolean; message: string } {
  if (err instanceof BackendError) {
    const isQuota = err.code === 'QUOTA_EXCEEDED' || err.status === 429;
    return { isQuota, message: err.message };
  }
  if (err && typeof err === 'object') {
    const record = err as { code?: unknown; status?: unknown; message?: unknown };
    const isQuota =
      record.code === 'QUOTA_EXCEEDED' || record.status === 429 || record.code === '429';
    const message =
      typeof record.message === 'string' && record.message.length > 0
        ? record.message
        : 'LiveKit monthly quota exceeded';
    return { isQuota, message };
  }
  return { isQuota: false, message: String(err) };
}

function formatMediaError(err: unknown, device: 'camera' | 'microphone'): string {
  const name =
    err && typeof err === 'object' && 'name' in err
      ? String((err as { name?: unknown }).name)
      : '';
  const message =
    err instanceof Error ? err.message : typeof err === 'string' ? err : `Failed to access ${device}`;

  if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
    return `${device === 'camera' ? 'Camera' : 'Microphone'} permission denied. Please allow access in your browser settings.`;
  }
  if (name === 'NotFoundError' || name === 'DevicesNotFoundError') {
    return `No ${device} found on this device.`;
  }
  if (name === 'NotReadableError' || name === 'TrackStartError') {
    return `${device === 'camera' ? 'Camera' : 'Microphone'} is already in use by another app.`;
  }
  if (name === 'OverconstrainedError') {
    return `${device === 'camera' ? 'Camera' : 'Microphone'} constraints are not supported by this device.`;
  }
  return message;
}

function toVideoCaptureOptions(constraints?: MediaTrackConstraints): VideoCaptureOptions | undefined {
  if (!constraints) return undefined;
  const options: VideoCaptureOptions = {};
  if (constraints.deviceId !== undefined) {
    options.deviceId = constraints.deviceId;
  }
  if (constraints.frameRate !== undefined) {
    options.frameRate = constraints.frameRate;
  }
  if (
    constraints.facingMode === 'user' ||
    constraints.facingMode === 'environment' ||
    constraints.facingMode === 'left' ||
    constraints.facingMode === 'right'
  ) {
    options.facingMode = constraints.facingMode;
  }
  const width =
    typeof constraints.width === 'number'
      ? constraints.width
      : constraints.width?.ideal ?? constraints.width?.max;
  const height =
    typeof constraints.height === 'number'
      ? constraints.height
      : constraints.height?.ideal ?? constraints.height?.max;
  if (typeof width === 'number' && typeof height === 'number') {
    options.resolution = { width, height };
  }
  return options;
}

export class LiveKitMediaService {
  private state: LiveKitMediaState = createInitialState();
  private listeners: Set<LiveKitMediaStateListener> = new Set();
  private room: Room | null = null;
  private readonly defaultMintTokenFn: MintTokenFn;
  private readonly roomFactory: RoomFactory;

  constructor(mintTokenFn?: MintTokenFn, roomFactory?: RoomFactory) {
    this.defaultMintTokenFn =
      mintTokenFn ??
      ((roomId: string) =>
        invokeEdgeFunction<{ token: string; url: string }>('mint-livekit-token', { roomId }));
    this.roomFactory = roomFactory ?? ((options?: RoomOptions) => new Room(options));
  }

  public getState(): LiveKitMediaState {
    return {
      ...this.state,
      peerStreams: { ...this.state.peerStreams },
      speakingPeers: { ...this.state.speakingPeers },
    };
  }

  public subscribe(listener: LiveKitMediaStateListener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  public clearError(): void {
    if (this.state.error === null) return;
    this.setState({ error: null });
  }

  public async connect(roomId: string, mintTokenFn?: MintTokenFn): Promise<void> {
    if (this.room) {
      await this.disconnect();
    }

    this.setState({
      isConnecting: true,
      isConnected: false,
      quotaExhausted: false,
      error: null,
    });

    const tokenProvider = mintTokenFn ?? this.defaultMintTokenFn;

    let token: string;
    let url: string;
    try {
      const result = await tokenProvider(roomId);
      token = result.token;
      url = result.url;
    } catch (err) {
      const quota = isQuotaError(err);
      if (quota.isQuota) {
        this.setState({
          isConnecting: false,
          isConnected: false,
          quotaExhausted: true,
          error: quota.message,
        });
        return;
      }
      const message = err instanceof Error ? err.message : String(err);
      this.setState({
        isConnecting: false,
        isConnected: false,
        error: message,
      });
      throw err;
    }

    const room = this.roomFactory(BANDWIDTH_OPTIMIZED_ROOM_OPTIONS);
    this.room = room;
    this.registerRoomListeners(room);

    try {
      await room.connect(url, token);
      if (this.room !== room) {
        return;
      }
      this.setState({
        isConnected: true,
        isConnecting: false,
      });
    } catch (err) {
      if (this.room === room) {
        this.room = null;
      }
      const message = err instanceof Error ? err.message : String(err);
      this.setState({
        isConnected: false,
        isConnecting: false,
        error: message,
      });
      throw err;
    }
  }

  public async disconnect(): Promise<void> {
    const activeRoom = this.room;
    this.room = null;

    if (activeRoom) {
      this.stopLocalTracksOnRoom(activeRoom);
      try {
        await activeRoom.disconnect();
      } catch {
        // Ignore disconnect errors during teardown
      }
    }

    if (this.state.localStream) {
      for (const track of this.state.localStream.getTracks()) {
        try {
          track.stop();
        } catch {
          // Ignore track stop errors
        }
      }
    }

    this.setState({
      isConnected: false,
      isConnecting: false,
      localStream: null,
      peerStreams: {},
      isCameraOn: false,
      isMicOn: false,
      speakingPeers: {},
    });
  }

  public async enableCamera(constraints?: MediaTrackConstraints): Promise<MediaStream | null> {
    if (!this.room) {
      this.setState({ error: 'Not connected to a media room.' });
      return null;
    }

    try {
      const captureOptions = toVideoCaptureOptions(constraints);
      await this.room.localParticipant.setCameraEnabled(true, captureOptions);
      this.syncLocalTracks({ fallbackCameraOn: true });
      return this.state.localStream;
    } catch (err) {
      this.setState({
        isCameraOn: false,
        error: formatMediaError(err, 'camera'),
      });
      return null;
    }
  }

  public disableCamera(): void {
    if (!this.room) {
      if (this.state.isCameraOn) {
        this.setState({ isCameraOn: false });
      }
      return;
    }

    void this.room.localParticipant.setCameraEnabled(false).catch((err: unknown) => {
      this.setState({ error: formatMediaError(err, 'camera') });
    });

    this.syncLocalTracks({ fallbackCameraOn: false });
  }

  public async toggleCamera(): Promise<void> {
    if (this.state.isCameraOn) {
      this.disableCamera();
    } else {
      await this.enableCamera();
    }
  }

  public async toggleMic(): Promise<void> {
    if (!this.room) {
      this.setState({ error: 'Not connected to a media room.' });
      return;
    }

    const nextEnabled = !this.state.isMicOn;
    try {
      await this.room.localParticipant.setMicrophoneEnabled(nextEnabled);
      this.syncLocalTracks({ fallbackMicOn: nextEnabled });
    } catch (err) {
      this.setState({
        error: formatMediaError(err, 'microphone'),
      });
    }
  }

  private registerRoomListeners(room: Room): void {
    room.on(
      RoomEvent.TrackSubscribed,
      (track: RemoteTrack, _publication: RemoteTrackPublication, participant: RemoteParticipant) => {
        if (this.room !== room) return;
        this.handleRemoteTrackSubscribed(track, participant);
      },
    );

    room.on(
      RoomEvent.TrackUnsubscribed,
      (track: RemoteTrack, _publication: RemoteTrackPublication, participant: RemoteParticipant) => {
        if (this.room !== room) return;
        this.handleRemoteTrackUnsubscribed(track, participant);
      },
    );

    room.on(RoomEvent.ParticipantDisconnected, (participant: RemoteParticipant) => {
      if (this.room !== room) return;
      this.handleParticipantDisconnected(participant);
    });

    room.on(RoomEvent.ActiveSpeakersChanged, (speakers: Participant[]) => {
      if (this.room !== room) return;
      const speakingPeers: Record<string, boolean> = {};
      for (const speaker of speakers) {
        if (speaker.identity) {
          speakingPeers[speaker.identity] = true;
        }
      }
      this.setState({ speakingPeers });
    });

    room.on(RoomEvent.LocalTrackPublished, (_publication: LocalTrackPublication) => {
      if (this.room !== room) return;
      this.syncLocalTracks();
    });

    room.on(RoomEvent.LocalTrackUnpublished, (_publication: LocalTrackPublication) => {
      if (this.room !== room) return;
      this.syncLocalTracks();
    });

    room.on(RoomEvent.Disconnected, () => {
      if (this.room !== room) return;
      this.room = null;
      this.setState({
        isConnected: false,
        isConnecting: false,
        localStream: null,
        peerStreams: {},
        isCameraOn: false,
        isMicOn: false,
        speakingPeers: {},
      });
    });
  }

  private handleRemoteTrackSubscribed(track: RemoteTrack, participant: RemoteParticipant): void {
    const identity = participant.identity;
    if (!identity) return;

    if (
      typeof document !== 'undefined' &&
      track.kind === Track.Kind.Audio &&
      typeof track.attach === 'function'
    ) {
      const el = track.attach();
      el.play?.().catch(() => {
        // Autoplay may be blocked until user gesture
      });
    }

    const mediaTrack = track.mediaStreamTrack;
    if (!mediaTrack) return;

    const existing = this.state.peerStreams[identity];
    const tracks = existing ? [...existing.getTracks()] : [];
    if (!tracks.some((t) => t === mediaTrack || (mediaTrack.id && t.id === mediaTrack.id))) {
      tracks.push(mediaTrack);
    }

    this.setState({
      peerStreams: {
        ...this.state.peerStreams,
        [identity]: createMediaStream(tracks),
      },
    });
  }

  private handleRemoteTrackUnsubscribed(track: RemoteTrack, participant: RemoteParticipant): void {
    if (typeof track.detach === 'function') {
      track.detach();
    }

    const identity = participant.identity;
    if (!identity) return;

    const existing = this.state.peerStreams[identity];
    if (!existing) return;

    const mediaTrack = track.mediaStreamTrack;
    const remainingTracks = existing
      .getTracks()
      .filter((t) => t !== mediaTrack && (!mediaTrack?.id || t.id !== mediaTrack.id));

    const nextPeerStreams = { ...this.state.peerStreams };
    if (remainingTracks.length === 0) {
      delete nextPeerStreams[identity];
    } else {
      nextPeerStreams[identity] = createMediaStream(remainingTracks);
    }

    this.setState({ peerStreams: nextPeerStreams });
  }

  private handleParticipantDisconnected(participant: RemoteParticipant): void {
    const identity = participant.identity;
    if (!identity) return;

    const nextPeerStreams = { ...this.state.peerStreams };
    delete nextPeerStreams[identity];

    const nextSpeakingPeers = { ...this.state.speakingPeers };
    delete nextSpeakingPeers[identity];

    this.setState({
      peerStreams: nextPeerStreams,
      speakingPeers: nextSpeakingPeers,
    });
  }

  private syncLocalTracks(overrides?: { fallbackCameraOn?: boolean; fallbackMicOn?: boolean }): void {
    const localParticipant = this.room?.localParticipant;
    if (!localParticipant) {
      this.setState({
        localStream: null,
        isCameraOn: false,
        isMicOn: false,
      });
      return;
    }

    const tracks: MediaStreamTrack[] = [];
    let hasCameraTrack = false;
    let hasMicTrack = false;

    const publications = localParticipant.trackPublications
      ? Array.from(localParticipant.trackPublications.values())
      : [
          ...(localParticipant.videoTrackPublications
            ? Array.from(localParticipant.videoTrackPublications.values())
            : []),
          ...(localParticipant.audioTrackPublications
            ? Array.from(localParticipant.audioTrackPublications.values())
            : []),
        ];

    for (const pub of publications) {
      if (pub.isMuted || !pub.track?.mediaStreamTrack) {
        continue;
      }
      if (pub.kind === Track.Kind.Video) {
        hasCameraTrack = true;
        tracks.push(pub.track.mediaStreamTrack);
      } else if (pub.kind === Track.Kind.Audio) {
        hasMicTrack = true;
        tracks.push(pub.track.mediaStreamTrack);
      }
    }

    const isCameraOn =
      publications.length > 0 ? hasCameraTrack : (overrides?.fallbackCameraOn ?? this.state.isCameraOn);
    const isMicOn =
      publications.length > 0 ? hasMicTrack : (overrides?.fallbackMicOn ?? this.state.isMicOn);

    this.setState({
      localStream: tracks.length > 0 ? createMediaStream(tracks) : null,
      isCameraOn,
      isMicOn,
    });
  }

  private stopLocalTracksOnRoom(room: Room): void {
    const localParticipant = room.localParticipant;
    if (!localParticipant?.trackPublications) return;

    for (const pub of localParticipant.trackPublications.values()) {
      try {
        pub.track?.stop?.();
        pub.track?.mediaStreamTrack?.stop?.();
      } catch {
        // Ignore stop errors during teardown
      }
    }
  }

  private setState(partial: Partial<LiveKitMediaState>): void {
    this.state = {
      ...this.state,
      ...partial,
    };
    const snapshot = this.getState();
    for (const listener of this.listeners) {
      listener(snapshot);
    }
  }
}

export const livekitMediaService = new LiveKitMediaService();
