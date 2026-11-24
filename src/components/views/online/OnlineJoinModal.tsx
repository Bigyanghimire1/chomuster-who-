import React, { useState, useEffect } from 'react';
import { X, Users, Crown, RefreshCw, Loader2, ArrowRight, AlertCircle } from 'lucide-react';
import { useMultiplayer } from '../../../context/MultiplayerContext';
import { Button } from '../../common/Button';
import { PlayerAvatar } from '../../illustrations/PlayerAvatar';
import { PlayerAvatarId } from '../../../types/game';
import { AVATAR_LIST, storageService } from '../../../services/storageService';
import {
  generateRoomCode,
  isValidRoomCode,
  normalizeRoomCode,
} from '../../../services/multiplayer/roomCodeGenerator';
import { audioService } from '../../../services/audioService';

interface OnlineJoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRoomCode?: string | null;
}

const STORAGE_KEY_NAME = 'chomu_online_player_name';
const STORAGE_KEY_AVATAR = 'chomu_online_player_avatar';

export const OnlineJoinModal: React.FC<OnlineJoinModalProps> = ({
  isOpen,
  onClose,
  initialRoomCode,
}) => {
  const { createRoom, joinRoom, isConnecting, error: contextError, clearError } = useMultiplayer();

  const [activeTab, setActiveTab] = useState<'join' | 'create'>('join');
  const [roomCodeInput, setRoomCodeInput] = useState<string>('');
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [playerName, setPlayerName] = useState<string>('');
  const [selectedAvatar, setSelectedAvatar] = useState<PlayerAvatarId>('sleuth');
  const [localError, setLocalError] = useState<string | null>(null);

  // Initialize or update state when opened
  useEffect(() => {
    if (!isOpen) {
      setLocalError(null);
      clearError();
      return;
    }

    // Load saved player name or fallback to local roster
    const savedName = localStorage.getItem(STORAGE_KEY_NAME);
    if (savedName) {
      setPlayerName(savedName);
    } else {
      const localPlayers = storageService.loadPlayers();
      if (localPlayers.length > 0 && localPlayers[0]?.name) {
        setPlayerName(localPlayers[0].name);
      }
    }

    // Load saved avatar
    const savedAvatar = localStorage.getItem(STORAGE_KEY_AVATAR) as PlayerAvatarId;
    if (savedAvatar && AVATAR_LIST.includes(savedAvatar)) {
      setSelectedAvatar(savedAvatar);
    }

    // Generate room code for create tab
    setGeneratedCode(generateRoomCode());

    // Handle initial room code from URL or props
    if (initialRoomCode) {
      const normalized = normalizeRoomCode(initialRoomCode);
      setRoomCodeInput(normalized);
      setActiveTab('join');
    } else {
      setActiveTab('create');
    }
  }, [isOpen, initialRoomCode, clearError]);

  if (!isOpen) return null;

  const handleRegenerateCode = () => {
    audioService.playButtonTap();
    setGeneratedCode(generateRoomCode());
  };

  const handleRoomCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const clean = normalizeRoomCode(raw).slice(0, 4);
    setRoomCodeInput(clean);
    setLocalError(null);
    clearError();
  };

  const handleTabSwitch = (tab: 'join' | 'create') => {
    audioService.playButtonTap();
    setActiveTab(tab);
    setLocalError(null);
    clearError();
    if (tab === 'create' && !generatedCode) {
      setGeneratedCode(generateRoomCode());
    }
  };

  const handleSelectAvatar = (avatar: PlayerAvatarId) => {
    audioService.playButtonTap();
    setSelectedAvatar(avatar);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    const trimmedName = playerName.trim();
    if (!trimmedName) {
      setLocalError('Please enter a player nickname.');
      return;
    }

    // Save profile for future sessions
    localStorage.setItem(STORAGE_KEY_NAME, trimmedName);
    localStorage.setItem(STORAGE_KEY_AVATAR, selectedAvatar);

    try {
      if (activeTab === 'create') {
        const codeToUse = generatedCode || generateRoomCode();
        await createRoom(codeToUse, trimmedName, selectedAvatar);
        onClose();
      } else {
        const targetCode = normalizeRoomCode(roomCodeInput);
        if (!targetCode || targetCode.length !== 4) {
          setLocalError('Please enter a 4-letter room code.');
          return;
        }
        if (!isValidRoomCode(targetCode)) {
          setLocalError('Room code contains invalid characters.');
          return;
        }
        await joinRoom(targetCode, trimmedName, selectedAvatar);
        onClose();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to connect to room';
      setLocalError(msg);
    }
  };

  const displayedError = localError || contextError;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-chomu-bg/80 backdrop-blur-sm animate-fade-in"
    >
      <div className="relative w-full max-w-md sm:max-w-lg md:max-w-xl bg-chomu-surface border border-chomu-border rounded-3xl p-4 sm:p-6 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-chomu-border/60">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-chomu-lime animate-pulse" />
            <h2 className="text-xl font-black text-chomu-text tracking-tight">
              Play Online
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-chomu-muted hover:text-chomu-text hover:bg-chomu-elevated transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-chomu-purple"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div
          role="tablist"
          aria-label="Online game mode tabs"
          className="grid grid-cols-2 gap-2 p-1 mt-4 mb-4 bg-chomu-elevated rounded-2xl border border-chomu-border/50"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'create'}
            onClick={() => handleTabSwitch('create')}
            className={`min-h-[44px] flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-chomu-purple ${
              activeTab === 'create'
                ? 'bg-chomu-purple text-chomu-bg shadow-md'
                : 'text-chomu-muted hover:text-chomu-text'
            }`}
          >
            <Crown className="w-4 h-4" />
            <span>Create Room</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'join'}
            onClick={() => handleTabSwitch('join')}
            className={`min-h-[44px] flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-chomu-purple ${
              activeTab === 'join'
                ? 'bg-chomu-purple text-chomu-bg shadow-md'
                : 'text-chomu-muted hover:text-chomu-text'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Join Room</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-4 pr-1">
          {/* Room Code Section */}
          {activeTab === 'create' ? (
            <div className="p-3.5 rounded-2xl bg-chomu-elevated/70 border border-chomu-border text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-chomu-muted">
                Your Room Code
              </span>
              <div className="flex items-center justify-center gap-3 mt-1.5">
                <span className="font-mono text-3xl font-black tracking-widest text-chomu-lime select-all">
                  {generatedCode}
                </span>
                <button
                  type="button"
                  onClick={handleRegenerateCode}
                  title="Generate new room code"
                  aria-label="Generate new room code"
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-chomu-muted hover:text-chomu-text hover:bg-chomu-surface transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-chomu-purple"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[11px] text-chomu-muted mt-1 font-medium">
                You will host and can invite friends via code, link, or QR code.
              </p>
            </div>
          ) : (
            <div>
              <label
                htmlFor="online-room-code-input"
                className="block text-xs font-bold text-chomu-muted uppercase tracking-wider mb-1.5"
              >
                Enter 4-Letter Room Code
              </label>
              <input
                id="online-room-code-input"
                type="text"
                autoFocus={activeTab === 'join'}
                maxLength={4}
                value={roomCodeInput}
                onChange={handleRoomCodeChange}
                placeholder="e.g. KMPQ"
                className="w-full text-center font-mono text-2xl font-black tracking-widest uppercase px-4 py-3 bg-chomu-elevated border border-chomu-border rounded-2xl text-chomu-text placeholder:text-chomu-muted/40 focus:outline-none focus:border-chomu-purple focus:ring-2 focus:ring-chomu-purple/20 transition-all"
              />
            </div>
          )}

          {/* Player Name */}
          <div>
            <label
              htmlFor="online-player-name-input"
              className="block text-xs font-bold text-chomu-muted uppercase tracking-wider mb-1.5"
            >
              Your Nickname
            </label>
            <input
              id="online-player-name-input"
              type="text"
              maxLength={18}
              value={playerName}
              onChange={(e) => {
                setPlayerName(e.target.value);
                setLocalError(null);
                clearError();
              }}
              placeholder="e.g. Detective Fox"
              className="w-full text-sm font-bold px-4 py-3 bg-chomu-elevated border border-chomu-border rounded-2xl text-chomu-text placeholder:text-chomu-muted/40 focus:outline-none focus:border-chomu-purple focus:ring-2 focus:ring-chomu-purple/20 transition-all"
            />
          </div>

          {/* Avatar Picker */}
          <div>
            <label className="block text-xs font-bold text-chomu-muted uppercase tracking-wider mb-2">
              Choose Avatar
            </label>
            <div
              role="radiogroup"
              aria-label="Select player avatar"
              className="grid grid-cols-4 gap-2 sm:gap-2.5"
            >
              {AVATAR_LIST.map((avatarId) => {
                const isSelected = selectedAvatar === avatarId;
                return (
                  <button
                    key={avatarId}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    aria-label={`Select avatar ${avatarId}`}
                    onClick={() => handleSelectAvatar(avatarId)}
                    className={`relative min-h-[56px] min-w-[44px] p-2 rounded-2xl flex flex-col items-center justify-center transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-chomu-purple ${
                      isSelected
                        ? 'bg-chomu-purple/20 border-2 border-chomu-purple shadow-sm ring-2 ring-chomu-purple/30 scale-[1.02]'
                        : 'bg-chomu-elevated/70 border border-chomu-border/70 hover:bg-chomu-elevated hover:border-chomu-border'
                    }`}
                  >
                    <PlayerAvatar id={avatarId} size="md" />
                    <span className="text-[10px] sm:text-[11px] capitalize font-bold text-chomu-muted mt-1 truncate max-w-full">
                      {avatarId}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Error Banner */}
          {displayedError && (
            <div className="p-3 bg-chomu-coral/15 border border-chomu-coral/30 rounded-2xl flex items-center gap-2.5 text-xs text-chomu-coral animate-shake">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1 font-medium">{displayedError}</span>
            </div>
          )}

          {/* Action Button */}
          <div className="pt-2">
            <Button
              type="submit"
              variant={activeTab === 'create' ? 'primary' : 'lime'}
              size="lg"
              fullWidth
              disabled={
                isConnecting ||
                !playerName.trim() ||
                (activeTab === 'join' && roomCodeInput.length !== 4)
              }
              leftIcon={
                isConnecting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : activeTab === 'create' ? (
                  <Crown className="w-5 h-5" />
                ) : (
                  <ArrowRight className="w-5 h-5" />
                )
              }
            >
              {isConnecting
                ? 'Connecting to Room...'
                : activeTab === 'create'
                  ? 'Create Lobby'
                  : 'Join Lobby'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
