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
import { getActiveMultiplayerBackend } from '../services/backendConfig';
import { supabaseRoomTransport } from '../services/supabase/SupabaseRoomTransport';
import { livekitMediaService } from '../services/livekit/LiveKitMediaService';
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
  rawPhase?: string | null;
  runoffCandidateIds?: string[];
  mediaQuotaExhausted?: boolean;

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
  const backend = useMemo(() => getActiveMultiplayerBackend(), []);
  const isSupabaseBackend = backend === 'supabase';
  const activeTransport = isSupabaseBackend ? supabaseRoomTransport : p2pRealtimeService;

  const [roomState, setRoomState] = useState<RoomState | null>(() =>
    activeTransport.getState()
  );
  const [mySecret, setMySecret] = useState<OnlineSecretState | null>(() =>
    activeTransport.getSecret()
  );
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(() =>
    activeTransport.isConnected()
  );
  const [error, setError] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatPayload[]>([]);
  const [timerRemaining, setTimerRemaining] = useState<number>(0);
  const [speakingPeers, setSpeakingPeers] = useState<Record<string, boolean>>({});

  // WebRTC Camera & Video Streams (VoiceManager for Trystero, LiveKitMediaService for Supabase)
  const [localStream, setLocalStream] = useState<MediaStream | null>(() =>
    isSupabaseBackend ? livekitMediaService.getState().localStream : voiceManager.getLocalStream()
  );
  const [peerStreams, setPeerStreams] = useState<Record<string, MediaStream>>(() =>
    isSupabaseBackend ? livekitMediaService.getState().peerStreams : voiceManager.getPeerStreams()
  );
  const [isCameraOn, setIsCameraOn] = useState<boolean>(() =>
    isSupabaseBackend ? livekitMediaService.getState().isCameraOn : voiceManager.isCameraOn
  );
  const [isMicOn, setIsMicOn] = useState<boolean>(() =>
    isSupabaseBackend ? livekitMediaService.getState().isMicOn : voiceManager.isMicOn
  );
  const [mediaQuotaExhausted, setMediaQuotaExhausted] = useState<boolean>(false);

  const previousPhaseRef = useRef<OnlinePhase | null>(null);
  const timerIntervalRef = useRef<number | null>(null);

  // Subscribe to real-time service updates
  useEffect(() => {
    const unsubState = activeTransport.subscribe((state, secret) => {
      setRoomState(state);
      setMySecret(secret);
      setIsConnected(activeTransport.isConnected());

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

    const unsubChat = activeTransport.onChat((chatMsg) => {
      setChatMessages((prev) => [...prev.slice(-49), chatMsg]);
    });

    const unsubError = activeTransport.onError((err) => {
      console.error('[MultiplayerContext] Error:', err);
      setError(err.message || 'Connection or room error occurred');
      setIsConnecting(false);
    });

    return () => {
      unsubState();
      unsubChat();
      unsubError();
    };
  }, [activeTransport]);

  // Automatic session recovery across page refreshes
  useEffect(() => {
    if (isSupabaseBackend) {
      if (!supabaseRoomTransport.isConnected()) {
        setIsConnecting(true);
        supabaseRoomTransport
          .tryRejoinRoom()
          .then(async (rejoined) => {
            if (rejoined) {
              setIsConnected(true);
              const roomId = supabaseRoomTransport.getRoomId();
              if (roomId) {
                try {
                  await livekitMediaService.connect(roomId);
                } catch (mediaErr) {
                  console.warn('[MultiplayerContext] LiveKit auto-recovery failed, continuing without media:', mediaErr);
                }
              }
            }
          })
          .catch((err) => {
            console.warn('[MultiplayerContext] Supabase auto-recovery failed:', err);
          })
          .finally(() => {
            setIsConnecting(false);
          });
      }
      return;
    }

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
  }, [isSupabaseBackend]);

  // Sync with VoiceManager (Trystero) or LiveKitMediaService (Supabase)
  useEffect(() => {
    if (isSupabaseBackend) {
      const unsubLk = livekitMediaService.subscribe((lkState) => {
        setLocalStream(lkState.localStream);
        setPeerStreams(lkState.peerStreams);
        setIsCameraOn(lkState.isCameraOn);
        setIsMicOn(lkState.isMicOn);
        setSpeakingPeers(lkState.speakingPeers);
        setMediaQuotaExhausted(lkState.quotaExhausted);
        if (lkState.error) {
          setError(lkState.error);
        }
      });
      return () => {
        unsubLk();
      };
    }

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
  }, [isSupabaseBackend]);

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

      if (isSupabaseBackend) {
        const deadlineIso = supabaseRoomTransport.getPhaseDeadlineAt();
        if (!deadlineIso) {
          setTimerRemaining(0);
          return;
        }
        const remaining = Math.max(0, Math.ceil((Date.parse(deadlineIso) - now) / 1000));
        setTimerRemaining(remaining);
        if (remaining <= 5 && remaining > 0) {
          audioService.playTick();
        }
        if (remaining === 0 && supabaseRoomTransport.isHost()) {
          const rawPhase = supabaseRoomTransport.getRawPhase();
          if (rawPhase === 'ROUND') {
            void supabaseRoomTransport.nextTurn().catch(() => {});
          } else if (rawPhase === 'DISCUSSION') {
            void supabaseRoomTransport.startVoting().catch(() => {});
          } else if (rawPhase === 'VOTING' || rawPhase === 'VOTING_RUNOFF') {
            void supabaseRoomTransport.concludeVoting().catch(() => {});
          }
        }
        return;
      }

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
    isSupabaseBackend,
    roomState?.phase,
    roomState?.roundStartTime,
    roomState?.roundDurationSeconds,
    roomState?.votingStartTime,
    roomState?.votingDurationSeconds,
  ]);

  const myPlayerId = activeTransport.getMyPeerId();
  const isHost = activeTransport.isHost();

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
  const runSupabaseAction = useCallback(async (fn: () => Promise<void>) => {
    try {
      await fn();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Action failed';
      setError(msg);
    }
  }, []);

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
        if (isSupabaseBackend) {
          await supabaseRoomTransport.createRoom(playerName, avatar, initialSettings);
          const roomId = supabaseRoomTransport.getRoomId();
          if (roomId) {
            try {
              await livekitMediaService.connect(roomId);
            } catch (mediaErr) {
              console.warn('[MultiplayerContext] LiveKit connect failed, continuing without media:', mediaErr);
            }
          }
        } else {
          await p2pRealtimeService.createRoom(code, playerName, avatar);
          if (initialSettings) {
            p2pRealtimeService.updateSettings(initialSettings);
          }
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
    [isSupabaseBackend]
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
        if (isSupabaseBackend) {
          await supabaseRoomTransport.joinRoom(code, playerName, avatar);
          const roomId = supabaseRoomTransport.getRoomId();
          if (roomId) {
            try {
              await livekitMediaService.connect(roomId);
            } catch (mediaErr) {
              console.warn('[MultiplayerContext] LiveKit connect failed, continuing without media:', mediaErr);
            }
          }
        } else {
          await p2pRealtimeService.joinRoom(code, playerName, avatar);
        }
        setIsConnected(true);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to join room';
        setError(msg);
        throw err;
      } finally {
        setIsConnecting(false);
      }
    },
    [isSupabaseBackend]
  );

  const leaveRoom = useCallback(async () => {
    try {
      if (isSupabaseBackend) {
        await livekitMediaService.disconnect();
        await supabaseRoomTransport.leaveRoom();
      } else {
        voiceManager.disableCamera();
        await p2pRealtimeService.leaveRoom();
      }
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
  }, [isSupabaseBackend]);

  const setReady = useCallback(
    (isReady: boolean) => {
      if (isSupabaseBackend) {
        void runSupabaseAction(() => supabaseRoomTransport.setReady(isReady));
      } else {
        p2pRealtimeService.setReady(isReady);
      }
      audioService.playButtonTap();
    },
    [isSupabaseBackend, runSupabaseAction]
  );

  const updateSettings = useCallback(
    (settings: Partial<OnlineSettings>) => {
      if (isSupabaseBackend) {
        void runSupabaseAction(() => supabaseRoomTransport.updateSettings(settings));
      } else {
        p2pRealtimeService.updateSettings(settings);
      }
    },
    [isSupabaseBackend, runSupabaseAction]
  );

  const startGame = useCallback(() => {
    if (isSupabaseBackend) {
      void runSupabaseAction(() => supabaseRoomTransport.startGame());
    } else {
      p2pRealtimeService.startGame();
    }
  }, [isSupabaseBackend, runSupabaseAction]);

  const confirmRole = useCallback(() => {
    if (isSupabaseBackend) {
      void runSupabaseAction(() => supabaseRoomTransport.confirmRole());
    } else {
      p2pRealtimeService.confirmRole();
    }
    audioService.playButtonTap();
  }, [isSupabaseBackend, runSupabaseAction]);

  const startRound = useCallback(() => {
    if (isSupabaseBackend) {
      void runSupabaseAction(() => supabaseRoomTransport.confirmRole());
    } else {
      p2pRealtimeService.startRound();
    }
  }, [isSupabaseBackend, runSupabaseAction]);

  const nextTurn = useCallback(() => {
    if (isSupabaseBackend) {
      void runSupabaseAction(() => supabaseRoomTransport.nextTurn());
    } else {
      p2pRealtimeService.nextTurn();
    }
  }, [isSupabaseBackend, runSupabaseAction]);

  const endRound = useCallback(() => {
    if (isSupabaseBackend) {
      void runSupabaseAction(() => supabaseRoomTransport.startVoting());
    } else {
      p2pRealtimeService.endRound();
    }
  }, [isSupabaseBackend, runSupabaseAction]);

  const startVoting = useCallback(() => {
    if (isSupabaseBackend) {
      void runSupabaseAction(() => supabaseRoomTransport.startVoting());
    } else {
      p2pRealtimeService.startVoting();
    }
  }, [isSupabaseBackend, runSupabaseAction]);

  const vote = useCallback(
    (targetPlayerId: string) => {
      if (isSupabaseBackend) {
        void runSupabaseAction(() => supabaseRoomTransport.castVote(targetPlayerId));
      } else {
        p2pRealtimeService.castVote(targetPlayerId);
      }
      audioService.playButtonTap();
    },
    [isSupabaseBackend, runSupabaseAction]
  );

  const playAgain = useCallback(() => {
    if (isSupabaseBackend) {
      void runSupabaseAction(() => supabaseRoomTransport.nextRound());
    } else {
      p2pRealtimeService.nextRound();
    }
  }, [isSupabaseBackend, runSupabaseAction]);

  const kickPlayer = useCallback(
    (targetPlayerId: string) => {
      if (isSupabaseBackend) {
        void runSupabaseAction(() => supabaseRoomTransport.kickPlayer(targetPlayerId));
      } else {
        p2pRealtimeService.kickPlayer(targetPlayerId);
      }
    },
    [isSupabaseBackend, runSupabaseAction]
  );

  const sendChat = useCallback(
    (text: string) => {
      if (!text.trim()) return;
      if (isSupabaseBackend) {
        void runSupabaseAction(() => supabaseRoomTransport.sendChat(text.trim()));
      } else {
        p2pRealtimeService.sendChat(text.trim());
      }
    },
    [isSupabaseBackend, runSupabaseAction]
  );

  const clearError = useCallback(() => {
    setError(null);
    if (isSupabaseBackend) {
      livekitMediaService.clearError();
    }
  }, [isSupabaseBackend]);

  const toggleCamera = useCallback(async () => {
    if (isSupabaseBackend) {
      await livekitMediaService.toggleCamera();
    } else {
      await voiceManager.toggleCamera();
    }
  }, [isSupabaseBackend]);

  const enableCamera = useCallback(
    async (constraints?: MediaTrackConstraints) => {
      if (isSupabaseBackend) {
        return await livekitMediaService.enableCamera(constraints);
      }
      return await voiceManager.enableCamera(constraints);
    },
    [isSupabaseBackend]
  );

  const disableCamera = useCallback(() => {
    if (isSupabaseBackend) {
      livekitMediaService.disableCamera();
    } else {
      voiceManager.disableCamera();
    }
  }, [isSupabaseBackend]);

  const toggleMic = useCallback(async () => {
    if (isSupabaseBackend) {
      await livekitMediaService.toggleMic();
    } else {
      await voiceManager.toggleMute();
    }
  }, [isSupabaseBackend]);

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
    rawPhase: isSupabaseBackend ? supabaseRoomTransport.getRawPhase() : null,
    runoffCandidateIds: isSupabaseBackend ? supabaseRoomTransport.getRunoffCandidateIds() : [],
    mediaQuotaExhausted,
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
