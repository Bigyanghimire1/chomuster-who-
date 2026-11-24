import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import {
  OnlinePhase,
  OnlinePlayer,
  OnlineSecretState,
  OnlineSettings,
  RoomState,
  OnlineVotingResult,
  ChatPayload,
} from '../types/multiplayer';
import { PlayerAvatarId } from '../types/game';
import { p2pRealtimeService } from '../services/multiplayer/p2pRealtimeService';
import { voiceManager } from '../services/voice/voiceManager';
import { audioService } from '../services/audioService';
import { sessionService } from '../services/storageService';

export interface MultiplayerContextValue {
  // Room and Peer State
  roomState: RoomState | null;
  phase: OnlinePhase;
  roomCode: string | null;
  players: OnlinePlayer[];
  myPlayerId: string;
  myPlayer: OnlinePlayer | null;
  isHost: boolean;
  mySecret: OnlineSecretState | null;
  results: OnlineVotingResult | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;

  // Real-time timers & communication
  timerRemaining: number;
  chatMessages: ChatPayload[];
  speakingPeers: Record<string, boolean>;

  // WebRTC Media & Streams
  localStream: MediaStream | null;
  peerStreams: Record<string, MediaStream>;
  isCameraOn: boolean;
  isMicOn: boolean;

  // Actions
  createRoom: (
    roomCode: string,
    playerName: string,
    avatar?: PlayerAvatarId,
    initialSettings?: Partial<OnlineSettings>
  ) => Promise<void>;
  joinRoom: (
    roomCode: string,
    playerName: string,
    avatar?: PlayerAvatarId
  ) => Promise<void>;
  leaveRoom: () => Promise<void>;
  setReady: (isReady: boolean) => void;
  updateSettings: (settings: Partial<OnlineSettings>) => void;
  startGame: () => void;
  confirmRole: () => void;
  startRound: () => void;
  nextTurn?: () => void;
  endRound: () => void;
  startVoting: () => void;
  vote: (targetPlayerId: string) => void;
  playAgain: () => void;
  kickPlayer: (targetPlayerId: string) => void;
  sendChat: (text: string) => void;
  clearError: () => void;

  // Media Actions
  toggleCamera: () => Promise<void>;
  enableCamera: (constraints?: MediaTrackConstraints) => Promise<MediaStream | null>;
  disableCamera: () => void;
  toggleMic: () => Promise<void>;
}

const MultiplayerContext = createContext<MultiplayerContextValue | null>(null);

export const MultiplayerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [roomState, setRoomState] = useState<RoomState | null>(() =>
    p2pRealtimeService.getState()
  );
  const [mySecret, setMySecret] = useState<OnlineSecretState | null>(() =>
    p2pRealtimeService.getSecret()
  );
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(() =>
    p2pRealtimeService.isConnected()
  );
  const [error, setError] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatPayload[]>([]);
  const [timerRemaining, setTimerRemaining] = useState<number>(0);
  const [speakingPeers, setSpeakingPeers] = useState<Record<string, boolean>>({});

  // WebRTC Camera & Video Streams
  const [localStream, setLocalStream] = useState<MediaStream | null>(() =>
    voiceManager.getLocalStream()
  );
  const [peerStreams, setPeerStreams] = useState<Record<string, MediaStream>>(() =>
    voiceManager.getPeerStreams()
  );
  const [isCameraOn, setIsCameraOn] = useState<boolean>(() =>
    voiceManager.isCameraOn
  );
  const [isMicOn, setIsMicOn] = useState<boolean>(() =>
    voiceManager.isMicOn
  );

  const previousPhaseRef = useRef<OnlinePhase | null>(null);
  const timerIntervalRef = useRef<number | null>(null);

  // Subscribe to real-time service updates
  useEffect(() => {
    const unsubState = p2pRealtimeService.subscribe((state, secret) => {
      setRoomState(state);
      setMySecret(secret);
      setIsConnected(p2pRealtimeService.isConnected());

      // Audio alerts on phase transitions
      if (state && previousPhaseRef.current !== state.phase) {
        if (state.phase === 'ROLE_REVEAL') {
          audioService.playGameStart();
        } else if (state.phase === 'RESULTS') {
          audioService.playImposterReveal();
        } else if (state.phase === 'ROUND') {
          audioService.playNav();
        }
        previousPhaseRef.current = state.phase;
      }
    });

    const unsubChat = p2pRealtimeService.onChat((chatMsg) => {
      setChatMessages((prev) => [...prev.slice(-49), chatMsg]);
    });

    const unsubError = p2pRealtimeService.onError((err) => {
      console.error('[MultiplayerContext] Error:', err);
      setError(err.message || 'Connection or room error occurred');
      setIsConnecting(false);
    });

    return () => {
      unsubState();
      unsubChat();
      unsubError();
    };
  }, []);

  // Automatic session recovery across page refreshes
  useEffect(() => {
    const savedSession = sessionService.loadSession();
    if (savedSession && !p2pRealtimeService.isConnected()) {
      setIsConnecting(true);
      p2pRealtimeService
        .joinRoom(savedSession.roomCode, savedSession.playerName, savedSession.avatar, {
          sessionPlayerId: savedSession.sessionPlayerId,
        })
        .then(() => {
          setIsConnected(true);
        })
        .catch((err) => {
          console.warn('[MultiplayerContext] Auto-recovery failed:', err);
          sessionService.clearSession();
        })
        .finally(() => {
          setIsConnecting(false);
        });
    }
  }, []);

  // Sync with VoiceManager for speaking detection and media streams
  useEffect(() => {
    const unsubVoice = voiceManager.subscribe((vState) => {
      setLocalStream(voiceManager.getLocalStream());
      setPeerStreams(vState.peerStreams || {});
      setIsCameraOn(vState.isCameraOn);
      setIsMicOn(vState.isMicActive && !vState.isMuted);

      const combined: Record<string, boolean> = {
        ...vState.speakingPeers,
      };
      const myId = p2pRealtimeService.getMyPeerId();
      if (myId) {
        combined[myId] = vState.isLocalSpeaking;
        // Broadcast speaking state if connected
        try {
          p2pRealtimeService.updateSpeaking(vState.isLocalSpeaking);
        } catch {
          // Ignore if room not active
        }
      }
      setSpeakingPeers(combined);
    });

    return () => {
      unsubVoice();
    };
  }, []);

  // Timer countdown updater for ROUND and VOTING phases
  useEffect(() => {
    if (timerIntervalRef.current) {
      window.clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    if (!roomState) {
      setTimerRemaining(0);
      return;
    }

    const updateTimer = () => {
      const now = Date.now();
      if (roomState.phase === 'ROUND' && roomState.roundStartTime) {
        const totalDuration = roomState.roundDurationSeconds || 180;
        const elapsed = Math.floor((now - roomState.roundStartTime) / 1000);
        const remaining = Math.max(0, totalDuration - elapsed);
        setTimerRemaining(remaining);

        // Subtle tick sound in last 5 seconds
        if (remaining <= 5 && remaining > 0) {
          audioService.playTick();
        }

        // Host automatically triggers voting when time expires
        if (remaining === 0 && p2pRealtimeService.isHost()) {
          try {
            p2pRealtimeService.startVoting();
          } catch {
            // Already transitioning
          }
        }
      } else if (roomState.phase === 'VOTING' && roomState.votingStartTime) {
        const totalDuration = roomState.votingDurationSeconds || 60;
        const elapsed = Math.floor((now - roomState.votingStartTime) / 1000);
        const remaining = Math.max(0, totalDuration - elapsed);
        setTimerRemaining(remaining);

        if (remaining <= 5 && remaining > 0) {
          audioService.playTick();
        }

        // Host automatically concludes voting when voting time expires
        if (remaining === 0 && p2pRealtimeService.isHost()) {
          try {
            p2pRealtimeService.concludeVoting();
          } catch {
            // Already concluding
          }
        }
      } else {
        setTimerRemaining(0);
      }
    };

    updateTimer();
    timerIntervalRef.current = window.setInterval(updateTimer, 500);

    return () => {
      if (timerIntervalRef.current) {
        window.clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, [
    roomState?.phase,
    roomState?.roundStartTime,
    roomState?.roundDurationSeconds,
    roomState?.votingStartTime,
    roomState?.votingDurationSeconds,
  ]);

  const myPlayerId = p2pRealtimeService.getMyPeerId();
  const isHost = p2pRealtimeService.isHost();

  const players = useMemo(() => {
    if (!roomState?.players) return [];
    return Object.values(roomState.players);
  }, [roomState?.players]);

  const myPlayer = useMemo(() => {
    if (!roomState?.players || !myPlayerId) return null;
    return roomState.players[myPlayerId] || null;
  }, [roomState?.players, myPlayerId]);

  const phase: OnlinePhase = roomState?.phase || 'LOBBY';
  const roomCode = roomState?.roomCode || null;
  const results = roomState?.votingResult || null;

  // Actions
  const createRoom = useCallback(
    async (
      code: string,
      playerName: string,
      avatar: PlayerAvatarId = 'sleuth',
      initialSettings?: Partial<OnlineSettings>
    ) => {
      setIsConnecting(true);
      setError(null);
      try {
        await p2pRealtimeService.createRoom(code, playerName, avatar);
        if (initialSettings) {
          p2pRealtimeService.updateSettings(initialSettings);
        }
        setIsConnected(true);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to create room';
        setError(msg);
        throw err;
      } finally {
        setIsConnecting(false);
      }
    },
    []
  );

  const joinRoom = useCallback(
    async (
      code: string,
      playerName: string,
      avatar: PlayerAvatarId = 'sleuth'
    ) => {
      setIsConnecting(true);
      setError(null);
      try {
        await p2pRealtimeService.joinRoom(code, playerName, avatar);
        setIsConnected(true);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to join room';
        setError(msg);
        throw err;
      } finally {
        setIsConnecting(false);
      }
    },
    []
  );

  const leaveRoom = useCallback(async () => {
    try {
      voiceManager.disableCamera();
      await p2pRealtimeService.leaveRoom();
    } catch {
      // Ignore leave error
    } finally {
      sessionService.clearSession();
      sessionService.clearHostSecrets();
      setRoomState(null);
      setMySecret(null);
      setIsConnected(false);
      setChatMessages([]);
      setError(null);
    }
  }, []);

  const setReady = useCallback((isReady: boolean) => {
    p2pRealtimeService.setReady(isReady);
    audioService.playButtonTap();
  }, []);

  const updateSettings = useCallback((settings: Partial<OnlineSettings>) => {
    p2pRealtimeService.updateSettings(settings);
  }, []);

  const startGame = useCallback(() => {
    p2pRealtimeService.startGame();
  }, []);

  const confirmRole = useCallback(() => {
    p2pRealtimeService.confirmRole();
    audioService.playButtonTap();
  }, []);

  const startRound = useCallback(() => {
    p2pRealtimeService.startRound();
  }, []);

  const nextTurn = useCallback(() => {
    p2pRealtimeService.nextTurn();
  }, []);

  const endRound = useCallback(() => {
    p2pRealtimeService.endRound();
  }, []);

  const startVoting = useCallback(() => {
    p2pRealtimeService.startVoting();
  }, []);

  const vote = useCallback((targetPlayerId: string) => {
    p2pRealtimeService.castVote(targetPlayerId);
    audioService.playButtonTap();
  }, []);

  const playAgain = useCallback(() => {
    p2pRealtimeService.nextRound();
  }, []);

  const kickPlayer = useCallback((targetPlayerId: string) => {
    p2pRealtimeService.kickPlayer(targetPlayerId);
  }, []);

  const sendChat = useCallback((text: string) => {
    if (!text.trim()) return;
    p2pRealtimeService.sendChat(text.trim());
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const toggleCamera = useCallback(async () => {
    await voiceManager.toggleCamera();
  }, []);

  const enableCamera = useCallback(async (constraints?: MediaTrackConstraints) => {
    return await voiceManager.enableCamera(constraints);
  }, []);

  const disableCamera = useCallback(() => {
    voiceManager.disableCamera();
  }, []);

  const toggleMic = useCallback(async () => {
    await voiceManager.toggleMute();
  }, []);

  const value: MultiplayerContextValue = {
    roomState,
    phase,
    roomCode,
    players,
    myPlayerId,
    myPlayer,
    isHost,
    mySecret,
    results,
    isConnected,
    isConnecting,
    error,
    timerRemaining,
    chatMessages,
    speakingPeers,
    localStream,
    peerStreams,
    isCameraOn,
    isMicOn,
    createRoom,
    joinRoom,
    leaveRoom,
    setReady,
    updateSettings,
    startGame,
    confirmRole,
    startRound,
    nextTurn,
    endRound,
    startVoting,
    vote,
    playAgain,
    kickPlayer,
    sendChat,
    clearError,
    toggleCamera,
    enableCamera,
    disableCamera,
    toggleMic,
  };

  return (
    <MultiplayerContext.Provider value={value}>
      {children}
    </MultiplayerContext.Provider>
  );
};

export const useMultiplayer = (): MultiplayerContextValue => {
  const context = useContext(MultiplayerContext);
  if (!context) {
    throw new Error('useMultiplayer must be used within a MultiplayerProvider');
  }
  return context;
};
