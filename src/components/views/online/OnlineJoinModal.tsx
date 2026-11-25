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

  useEffect(() => {
    if (!isOpen) {
      setLocalError(null);
      clearError();
      return;
    }

    const savedName = localStorage.getItem(STORAGE_KEY_NAME);
    if (savedName) {
      setPlayerName(savedName);
    } else {
      const localPlayers = storageService.loadPlayers();
      if (localPlayers.length > 0 && localPlayers[0]?.name) {
        setPlayerName(localPlayers[0].name);
      }
    }

    const savedAvatar = localStorage.getItem(STORAGE_KEY_AVATAR) as PlayerAvatarId;
    if (savedAvatar && AVATAR_LIST.includes(savedAvatar)) {
      setSelectedAvatar(savedAvatar);
    }

    setGeneratedCode(generateRoomCode());

    if (initialRoomCode) {
      const normalized = normalizeRoomCode(initialRoomCode);
      setRoomCodeInput(normalized);
      setActiveTab('join');
    } else {
      setActiveTab('create');
    }
  }, [isOpen, initialRoomCode, clearError]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

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
      setLocalError('Enter a player nickname');
      return;
    }

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
          setLocalError('Enter a 4-letter room code');
          return;
        }
        if (!isValidRoomCode(targetCode)) {
          setLocalError('Room code contains invalid letters (avoid I, L, O)');
          return;
        }
        await joinRoom(targetCode, trimmedName, selectedAvatar);
        onClose();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to connect to room';
      setLocalError(msg);
    }
  };

  const displayedError = localError || contextError;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="online-modal-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/70 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full sm:max-w-lg bg-chomu-surface border-t sm:border border-white/[0.1] rounded-t-2xl sm:rounded-2xl p-5 sm:p-6 shadow-[0_16px_48px_rgba(0,0,0,0.5)] max-h-[92dvh] flex flex-col animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div>
            <h2 id="online-modal-title" className="text-lg font-semibold text-chomu-text">
              Play online
            </h2>
            <p className="text-xs text-chomu-muted mt-0.5">
              Host a private room or enter a friend&apos;s code
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="min-w-[44px] min-h-[44px] -mr-2 flex items-center justify-center rounded-[10px] text-chomu-secondary hover:text-chomu-text hover:bg-chomu-elevated transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-chomu-purple"
          >
            <X className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div
          role="tablist"
          aria-label="Online game mode tabs"
          className="grid grid-cols-2 gap-1.5 p-1 mt-4 mb-4 bg-chomu-bgSecondary rounded-xl border border-white/[0.08]"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'create'}
            onClick={() => handleTabSwitch('create')}
            className={`min-h-[44px] flex items-center justify-center gap-2 py-2 rounded-lg font-medium text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-chomu-purple ${
              activeTab === 'create'
                ? 'bg-chomu-elevated text-chomu-text border border-white/[0.1]'
                : 'text-chomu-secondary hover:text-chomu-text border border-transparent'
            }`}
          >
            <Crown className="w-4 h-4" strokeWidth={1.5} />
            <span>Create room</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'join'}
            onClick={() => handleTabSwitch('join')}
            className={`min-h-[44px] flex items-center justify-center gap-2 py-2 rounded-lg font-medium text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-chomu-purple ${
              activeTab === 'join'
                ? 'bg-chomu-elevated text-chomu-text border border-white/[0.1]'
                : 'text-chomu-secondary hover:text-chomu-text border border-transparent'
            }`}
          >
            <Users className="w-4 h-4" strokeWidth={1.5} />
            <span>Join room</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-4 pr-0.5">
          {activeTab === 'create' ? (
            <div className="p-4 rounded-xl bg-chomu-bgSecondary border border-white/[0.08] flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-medium text-chomu-muted block">
                  Room code
                </span>
                <span className="font-mono text-2xl font-semibold tracking-[0.16em] text-chomu-text tabular-nums select-all mt-0.5 block">
                  {generatedCode}
                </span>
              </div>
              <button
                type="button"
                onClick={handleRegenerateCode}
                title="Generate new room code"
                aria-label="Generate new room code"
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-[10px] bg-chomu-elevated border border-white/[0.08] text-chomu-secondary hover:text-chomu-text transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-chomu-purple"
              >
                <RefreshCw className="w-4 h-4" strokeWidth={1.5} />
              </button>
            </div>
          ) : (
            <div>
              <label
                htmlFor="online-room-code-input"
                className="block text-xs font-medium text-chomu-secondary mb-1.5"
              >
                4-letter room code
              </label>
              <input
                id="online-room-code-input"
                type="text"
                autoFocus={activeTab === 'join'}
                maxLength={4}
                value={roomCodeInput}
                onChange={handleRoomCodeChange}
                placeholder="KMPQ"
                className="w-full text-center font-mono text-2xl font-semibold tracking-[0.2em] uppercase tabular-nums px-4 py-3 bg-chomu-bgSecondary border border-white/[0.1] rounded-[10px] text-chomu-text placeholder:text-chomu-muted/40 focus:outline-none focus:border-chomu-purple transition-colors"
              />
            </div>
          )}

          {/* Player Name */}
          <div>
            <label
              htmlFor="online-player-name-input"
              className="block text-xs font-medium text-chomu-secondary mb-1.5"
            >
              Nickname
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
              placeholder="Detective Fox"
              className="w-full text-sm font-normal px-3.5 py-2.5 bg-chomu-bgSecondary border border-white/[0.1] rounded-[10px] text-chomu-text placeholder:text-chomu-muted/50 focus:outline-none focus:border-chomu-purple transition-colors min-h-[44px]"
            />
          </div>

          {/* Avatar Picker */}
          <div>
            <label className="block text-xs font-medium text-chomu-secondary mb-2">
              Choose avatar
            </label>
            <div
              role="radiogroup"
              aria-label="Select player avatar"
              className="grid grid-cols-4 gap-2"
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
                    className={`relative min-h-[60px] min-w-[44px] p-2 rounded-[10px] flex flex-col items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-chomu-purple ${
                      isSelected
                        ? 'bg-chomu-elevated border border-chomu-purple text-chomu-text'
                        : 'bg-chomu-bgSecondary border border-white/[0.08] text-chomu-secondary hover:bg-chomu-elevated'
                    }`}
                  >
                    <PlayerAvatar id={avatarId} size="md" />
                    <span className="text-xs capitalize font-medium mt-1 truncate max-w-full">
                      {avatarId}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Error Banner */}
          {displayedError && (
            <div className="p-3 bg-chomu-coral/10 border border-chomu-coral/25 rounded-[10px] flex items-center gap-2 text-xs text-chomu-coral animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0" strokeWidth={1.5} />
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
                  <Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.5} />
                ) : activeTab === 'create' ? (
                  <Crown className="w-4 h-4" strokeWidth={1.5} />
                ) : (
                  <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
                )
              }
            >
              {isConnecting
                ? 'Connecting to room'
                : activeTab === 'create'
                  ? 'Create lobby'
                  : 'Join lobby'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
