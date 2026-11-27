import React, { useState, useEffect } from 'react';
import {
  X,
  Users,
  Crown,
  RefreshCw,
  Loader2,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Sliders,
} from 'lucide-react';
import { useMultiplayer } from '../../../context/MultiplayerContext';
import { Button } from '../../common/Button';
import { PlayerAvatar } from '../../illustrations/PlayerAvatar';
import {
  AVATAR_CATEGORIES,
  AvatarCategory,
  getAvatarMeta,
} from '../../illustrations/avatarRegistry';
import { PlayerAvatarId } from '../../../types/game';
import { OnlineSettings } from '../../../types/multiplayer';
import { AVATAR_LIST, storageService } from '../../../services/storageService';
import {
  generateRoomCode,
  normalizeRoomCode,
} from '../../../services/multiplayer/roomCodeGenerator';
import { isSupabaseConfigured } from '../../../services/backendConfig';
import { OnlineSettingsFields } from './OnlineSettingsFields';
import { audioService } from '../../../services/audioService';

interface OnlineJoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRoomCode?: string | null;
}

const STORAGE_KEY_NAME = 'chomu_online_player_name';
const STORAGE_KEY_AVATAR = 'chomu_online_player_avatar';

const DEFAULT_ONLINE_SETTINGS: OnlineSettings = {
  categoryIds: ['everyday_objects', 'food_drinks', 'animals'],
  roundDurationSeconds: 45,
  turnDurationSeconds: 20,
  discussionDurationSeconds: 45,
  votingDurationSeconds: 60,
  hintDifficulty: 'subtle',
  chomuCount: 1,
};

export const OnlineJoinModal: React.FC<OnlineJoinModalProps> = ({
  isOpen,
  onClose,
  initialRoomCode,
}) => {
  const { createRoom, joinRoom, isConnecting, error: contextError, clearError } = useMultiplayer();

  const [activeTab, setActiveTab] = useState<'join' | 'create'>('join');
  const [createStep, setCreateStep] = useState<1 | 2>(1);
  const [roomCodeInput, setRoomCodeInput] = useState<string>('');
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [playerName, setPlayerName] = useState<string>('');
  const [selectedAvatar, setSelectedAvatar] = useState<PlayerAvatarId>(
    () => AVATAR_LIST[Math.floor(Math.random() * AVATAR_LIST.length)]
  );
  const [avatarFilter, setAvatarFilter] = useState<'All' | AvatarCategory>('All');
  const [hostSettings, setHostSettings] = useState<OnlineSettings>(DEFAULT_ONLINE_SETTINGS);
  const [localError, setLocalError] = useState<string | null>(null);

  const requestedSupabase =
    (import.meta as { env?: Record<string, string | undefined> }).env?.VITE_MULTIPLAYER_BACKEND ===
    'supabase';
  const showSupabaseConfigWarning = requestedSupabase && !isSupabaseConfigured();

  useEffect(() => {
    if (!isOpen) {
      setLocalError(null);
      setCreateStep(1);
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
    } else {
      setSelectedAvatar(AVATAR_LIST[Math.floor(Math.random() * AVATAR_LIST.length)]);
    }

    setGeneratedCode(generateRoomCode());
    setCreateStep(1);

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
    const clean = raw.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4);
    setRoomCodeInput(clean);
    setLocalError(null);
    clearError();
  };

  const handleTabSwitch = (tab: 'join' | 'create') => {
    audioService.playButtonTap();
    setActiveTab(tab);
    setCreateStep(1);
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

  const handleNextCreateStep = () => {
    const trimmedName = playerName.trim();
    if (!trimmedName) {
      setLocalError('Enter a player nickname');
      return;
    }
    setLocalError(null);
    audioService.playButtonTap();
    setCreateStep(2);
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

    if (activeTab === 'create' && createStep === 1) {
      handleNextCreateStep();
      return;
    }

    localStorage.setItem(STORAGE_KEY_NAME, trimmedName);
    localStorage.setItem(STORAGE_KEY_AVATAR, selectedAvatar);

    try {
      if (activeTab === 'create') {
        const codeToUse = generatedCode || generateRoomCode();
        await createRoom(codeToUse, trimmedName, selectedAvatar, hostSettings);
        onClose();
      } else {
        const targetCode = roomCodeInput.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
        if (!targetCode || !/^[A-Z0-9]{4}$/.test(targetCode)) {
          setLocalError('Enter a 4-character room code');
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
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4 bg-black/50 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full sm:max-w-lg bg-white border-t-[3px] sm:border-[3px] border-[#050505] rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-[0_10px_0_#050505] max-h-[90dvh] flex flex-col animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-chomu-border">
          <div>
            <h2 id="online-modal-title" className="text-lg font-semibold text-chomu-text">
              {activeTab === 'create' && createStep === 2 ? 'Configure room rules' : 'Play online'}
            </h2>
            <p className="text-xs text-chomu-muted mt-0.5">
              {activeTab === 'create' && createStep === 2
                ? 'Choose categories, Chomus, and timers before opening your lobby'
                : "Host a private room or enter a friend's code"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="min-w-[44px] min-h-[44px] -mr-2 flex items-center justify-center rounded-[10px] text-chomu-secondary hover:text-chomu-text hover:bg-chomu-elevated transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-chomu-teal"
          >
            <X className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>

        {/* Diagnostic Notice when Supabase backend is selected without env vars */}
        {showSupabaseConfigWarning && (
          <div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1">
            <div className="font-semibold flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>Supabase env vars not configured — using P2P fallback</span>
            </div>
            <p className="text-[11px] text-amber-800">
              Set <code className="font-mono">VITE_SUPABASE_URL</code> and{' '}
              <code className="font-mono">VITE_SUPABASE_ANON_KEY</code> in{' '}
              <code className="font-mono">.env.local</code> when ready.
            </p>
          </div>
        )}

        {/* Tab Switcher */}
        <div
          role="tablist"
          aria-label="Online game mode tabs"
          className="grid grid-cols-2 gap-1.5 p-1.5 mt-4 mb-4 bg-[#F5F6F8] rounded-2xl border-2 border-[#050505]"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'create'}
            onClick={() => handleTabSwitch('create')}
            className={`min-h-[44px] flex items-center justify-center gap-2 py-2 rounded-xl font-extrabold text-sm transition-all border-2 ${
              activeTab === 'create'
                ? 'bg-[#FFDF00] text-[#050505] border-[#050505] shadow-[0_2px_0_#050505]'
                : 'text-[#52555E] hover:text-[#050505] border-transparent'
            }`}
          >
            <Crown className="w-4 h-4" strokeWidth={2.2} />
            <span>Create room</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'join'}
            onClick={() => handleTabSwitch('join')}
            className={`min-h-[44px] flex items-center justify-center gap-2 py-2 rounded-xl font-extrabold text-sm transition-all border-2 ${
              activeTab === 'join'
                ? 'bg-[#FFDF00] text-[#050505] border-[#050505] shadow-[0_2px_0_#050505]'
                : 'text-[#52555E] hover:text-[#050505] border-transparent'
            }`}
          >
            <Users className="w-4 h-4" strokeWidth={2.2} />
            <span>Join room</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto space-y-4 pr-1.5">
          {activeTab === 'create' && createStep === 2 ? (
            <OnlineSettingsFields
              settings={hostSettings}
              onChange={setHostSettings}
            />
          ) : (
            <>
              {activeTab === 'create' ? (
                <div className="p-4 rounded-xl bg-chomu-bgSecondary border border-chomu-border flex items-center justify-between gap-4">
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
                    className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-[10px] bg-white border border-chomu-border text-chomu-secondary hover:text-chomu-text hover:bg-chomu-elevated transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-chomu-teal"
                  >
                    <RefreshCw className="w-4 h-4" strokeWidth={1.5} />
                  </button>
                </div>
              ) : (
                <div>
                  <label
                    htmlFor="room-code-input"
                    className="text-xs font-medium text-chomu-secondary block mb-1.5"
                  >
                    4-letter room code
                  </label>
                  <input
                    id="room-code-input"
                    type="text"
                    inputMode="text"
                    autoCapitalize="characters"
                    maxLength={4}
                    value={roomCodeInput}
                    onChange={handleRoomCodeChange}
                    placeholder="K M P Q"
                    className="w-full text-center font-mono text-2xl font-semibold tracking-[0.22em] uppercase py-3 bg-chomu-bgSecondary border border-chomu-border rounded-[10px] text-chomu-text placeholder:text-chomu-muted/40 focus:outline-none focus:border-chomu-teal transition-colors min-h-[56px]"
                  />
                </div>
              )}

              {/* Nickname Input */}
              <div>
                <label
                  htmlFor="online-player-name-input"
                  className="text-xs font-medium text-chomu-secondary block mb-1.5"
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
                  className="w-full text-sm font-normal px-3.5 py-2.5 bg-chomu-bgSecondary border border-chomu-border rounded-[10px] text-chomu-text placeholder:text-chomu-muted/50 focus:outline-none focus:border-chomu-teal transition-colors min-h-[44px]"
                />
              </div>

              {/* Avatar Picker */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <label className="text-xs font-medium text-chomu-secondary">
                    Choose Avatar
                  </label>
                  <span className="text-[11px] text-chomu-teal font-medium truncate">
                    {getAvatarMeta(selectedAvatar).label}
                  </span>
                </div>

                {/* Personality Group Filter */}
                <div className="flex flex-wrap items-center gap-1.5 pb-2 mb-1">
                  {(['All', ...AVATAR_CATEGORIES] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setAvatarFilter(cat)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold shrink-0 border-2 border-[#050505] transition-colors ${
                        avatarFilter === cat
                          ? 'bg-[#F28BCB] text-[#050505] shadow-[0_2px_0_#050505]'
                          : 'bg-white text-[#050505] hover:bg-[#FFF9CC]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div
                  role="radiogroup"
                  aria-label="Select player avatar"
                  className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-[210px] overflow-y-auto pr-1"
                >
                  {AVATAR_LIST.filter(
                    (avatarId) =>
                      avatarFilter === 'All' || getAvatarMeta(avatarId).category === avatarFilter
                  ).map((avatarId) => {
                    const isSelected = selectedAvatar === avatarId;
                    const meta = getAvatarMeta(avatarId);
                    return (
                      <button
                        key={avatarId}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        aria-label={`Select avatar ${meta.label}`}
                        title={meta.tagline}
                        onClick={() => handleSelectAvatar(avatarId)}
                        className={`relative min-h-[68px] min-w-[44px] p-1.5 rounded-2xl border-2 border-[#050505] flex flex-col items-center justify-center transition-all ${
                          isSelected
                            ? 'bg-[#64E987] text-[#050505] shadow-[0_3px_0_#050505]'
                            : 'bg-white text-[#050505] hover:bg-[#FFF9CC]'
                        }`}
                      >
                        <PlayerAvatar id={avatarId} size="md" />
                        <span className="text-[11px] font-medium mt-1 truncate max-w-full">
                          {meta.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* Error Banner */}
          {displayedError && (
            <div className="p-3 bg-chomu-coral/10 border border-chomu-coral/25 rounded-[10px] flex items-center gap-2 text-xs text-chomu-coral animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0" strokeWidth={1.5} />
              <span>{displayedError}</span>
            </div>
          )}
          </div>

          {/* Pinned Modal Footer Actions */}
          <div className="pt-3 mt-3 border-t border-chomu-border flex items-center gap-2.5 shrink-0">
            {activeTab === 'create' && createStep === 2 && (
              <Button
                key="back-btn"
                type="button"
                variant="secondary"
                size="lg"
                onClick={() => setCreateStep(1)}
                leftIcon={<ArrowLeft className="w-4 h-4" strokeWidth={1.75} />}
              >
                Back
              </Button>
            )}

            {activeTab === 'create' && createStep === 1 ? (
              <Button
                key="next-step-btn"
                type="button"
                variant="primary"
                size="lg"
                fullWidth
                disabled={!playerName.trim()}
                onClick={handleNextCreateStep}
                leftIcon={<Sliders className="w-4 h-4" strokeWidth={1.75} />}
                rightIcon={<ArrowRight className="w-4 h-4" strokeWidth={1.75} />}
              >
                Next: Game rules
              </Button>
            ) : (
              <Button
                key="submit-room-btn"
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                disabled={isConnecting || !playerName.trim()}
                leftIcon={
                  isConnecting ? (
                    <Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.5} />
                  ) : activeTab === 'create' ? (
                    <Crown className="w-4 h-4" strokeWidth={1.5} />
                  ) : (
                    <Users className="w-4 h-4" strokeWidth={1.5} />
                  )
                }
                rightIcon={
                  !isConnecting ? <ArrowRight className="w-4 h-4" strokeWidth={1.5} /> : undefined
                }
              >
                {isConnecting
                  ? 'Connecting...'
                  : activeTab === 'create'
                    ? 'Create lobby'
                    : 'Join lobby'}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
