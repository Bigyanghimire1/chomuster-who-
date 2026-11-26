import React, { useState } from 'react';
import {
  Copy,
  Check,
  QrCode,
  Share2,
  Users,
  Settings2,
  Play,
  LogOut,
  X,
  Clock,
} from 'lucide-react';
import { useMultiplayer } from '../../../context/MultiplayerContext';
import { Button } from '../../common/Button';
import { Card } from '../../common/Card';
import { Badge } from '../../common/Badge';
import { VideoCard } from '../../common/VideoCard';
import { QRCodeModal } from './QRCodeModal';
import { DEFAULT_CATEGORIES } from '../../../data/categories';
import { audioService } from '../../../services/audioService';
import { HintDifficulty } from '../../../data/wordDatabase';

export const OnlineLobbyView: React.FC = () => {
  const {
    roomCode,
    players,
    myPlayerId,
    myPlayer,
    isHost,
    roomState,
    setReady,
    startGame,
    updateSettings,
    kickPlayer,
    leaveRoom,
    speakingPeers,
    localStream,
    peerStreams,
  } = useMultiplayer();

  const [isQrOpen, setIsQrOpen] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [showSettingsDrawer, setShowSettingsDrawer] = useState<boolean>(false);

  const currentSettings = roomState?.settings || {
    categoryIds: ['everyday_objects', 'food_drinks', 'animals'],
    roundDurationSeconds: 180,
    votingDurationSeconds: 60,
    hintDifficulty: 'subtle',
    chomuCount: 1,
  };

  const inviteUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}?room=${roomCode || ''}`
      : `https://chomu.app/?room=${roomCode || ''}`;

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(inviteUrl);
      } else {
        const input = document.createElement('input');
        input.value = inviteUrl;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }
      audioService.playButtonTap();
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {}
  };

  const handleCopyCode = async () => {
    if (!roomCode) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(roomCode);
      }
      audioService.playButtonTap();
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {}
  };

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'Join my Chomu Who room',
          text: `Join our game of Chomu Who. Room code: ${roomCode}`,
          url: inviteUrl,
        });
        audioService.playButtonTap();
      } catch {}
    } else {
      handleCopyLink();
    }
  };

  const handleToggleReady = () => {
    if (!myPlayer) return;
    setReady(!myPlayer.isReady);
  };

  const handleCategoryToggle = (catId: string) => {
    const prev = currentSettings.categoryIds || [];
    let next: string[];
    if (prev.includes(catId)) {
      if (prev.length <= 1) return;
      next = prev.filter((id) => id !== catId);
    } else {
      next = [...prev, catId];
    }
    updateSettings({ categoryIds: next });
    audioService.playCategorySelect();
  };

  const handleChomuCountChange = (count: number) => {
    updateSettings({ chomuCount: count });
    audioService.playButtonTap();
  };

  const handleRoundDurationChange = (seconds: number) => {
    updateSettings({ roundDurationSeconds: seconds });
    audioService.playButtonTap();
  };

  const handleHintDifficultyChange = (difficulty: HintDifficulty) => {
    updateSettings({ hintDifficulty: difficulty });
    audioService.playButtonTap();
  };

  const canStartGame = isHost && players.length >= 3;
  const isWebShareSupported =
    typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  return (
    <div className="flex flex-col flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-5 select-none animate-fade-in space-y-5">
      {/* Top Bar */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Badge variant="purple" size="md">
            Online lobby
          </Badge>
          <span className="text-xs font-mono text-chomu-secondary tabular-nums">
            {players.length} {players.length === 1 ? 'player' : 'players'}
          </span>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={leaveRoom}
          leftIcon={<LogOut className="w-4 h-4" strokeWidth={1.5} />}
        >
          Leave room
        </Button>
      </div>

      {/* Room Code & Invite Dossier Card */}
      <Card className="p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-medium text-chomu-muted block">
              Room code
            </span>
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-1.5" aria-label={`Room code ${roomCode || '----'}`}>
                {(roomCode || '----').split('').map((char, idx) => (
                  <span
                    key={idx}
                    className="w-10 h-11 rounded-2xl bg-chomu-bgSecondary border border-white/[0.12] border-b-[3px] border-b-[#05080E] flex items-center justify-center text-2xl font-mono font-bold text-chomu-teal tabular-nums shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                  >
                    {char}
                  </span>
                ))}
              </div>
              <button
                type="button"
                onClick={handleCopyCode}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-chomu-elevated border border-white/[0.12] border-b-[3px] border-b-[#0B111C] active:translate-y-[1px] active:border-b-[1px] text-chomu-secondary hover:text-chomu-text transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-chomu-teal"
                title="Copy room code"
                aria-label="Copy room code"
              >
                {copiedCode ? (
                  <Check className="w-4 h-4 text-chomu-lime" strokeWidth={1.5} />
                ) : (
                  <Copy className="w-4 h-4" strokeWidth={1.5} />
                )}
              </button>
            </div>
            <p className="text-xs text-chomu-secondary">
              Share this code or invite link with your friends
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {isWebShareSupported && (
              <Button
                variant="primary"
                size="md"
                onClick={handleShare}
                leftIcon={<Share2 className="w-4 h-4" strokeWidth={1.5} />}
              >
                Share
              </Button>
            )}

            <Button
              variant={copiedLink ? 'lime' : 'secondary'}
              size="md"
              onClick={handleCopyLink}
              leftIcon={
                copiedLink ? (
                  <Check className="w-4 h-4" strokeWidth={1.5} />
                ) : (
                  <Copy className="w-4 h-4" strokeWidth={1.5} />
                )
              }
            >
              {copiedLink ? 'Link copied' : 'Copy link'}
            </Button>

            <Button
              variant="secondary"
              size="md"
              onClick={() => setIsQrOpen(true)}
              leftIcon={<QrCode className="w-4 h-4" strokeWidth={1.5} />}
            >
              QR code
            </Button>
          </div>
        </div>
      </Card>

      {/* Main Content Grid: Players & Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start flex-1">
        {/* Left: Players Grid */}
        <div className={`${isHost || showSettingsDrawer ? 'lg:col-span-7' : 'lg:col-span-12'} space-y-3`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-chomu-secondary" strokeWidth={1.5} />
              <h2 className="text-sm font-semibold text-chomu-text">
                Players in lobby
              </h2>
              <span className="text-xs font-mono text-chomu-muted tabular-nums">
                ({players.length})
              </span>
            </div>

            {!isHost && (
              <button
                type="button"
                onClick={() => setShowSettingsDrawer(!showSettingsDrawer)}
                aria-label="Toggle room settings"
                className="text-xs font-medium text-chomu-secondary hover:text-chomu-text flex items-center gap-1.5 min-h-[44px] px-3 rounded-[10px] bg-chomu-surface border border-white/[0.08] hover:bg-chomu-elevated transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-chomu-purple"
              >
                <Settings2 className="w-4 h-4" strokeWidth={1.5} />
                <span>{showSettingsDrawer ? 'Hide settings' : 'Room settings'}</span>
              </button>
            )}
          </div>

          <div
            className={`grid grid-cols-1 sm:grid-cols-2 ${
              isHost || showSettingsDrawer ? 'xl:grid-cols-2' : 'md:grid-cols-3 lg:grid-cols-4'
            } gap-3`}
          >
            {players.map((p) => {
              const isMe = p.id === myPlayerId;
              const isPeerSpeaking = !!speakingPeers[p.id] || !!p.isSpeaking;
              const stream = isMe ? localStream : peerStreams[p.id] || null;

              return (
                <div
                  key={p.id}
                  className="relative aspect-video min-h-[160px]"
                >
                  <VideoCard
                    player={p}
                    stream={stream}
                    isSpeaking={isPeerSpeaking}
                    isLocal={isMe}
                    actionSlot={
                      <div className="flex items-center gap-1.5">
                        {p.isReady ? (
                          <Badge variant="lime" size="sm">
                            <Check className="w-3.5 h-3.5" strokeWidth={1.5} />
                            <span>Ready</span>
                          </Badge>
                        ) : (
                          <Badge variant="muted" size="sm">
                            <Clock className="w-3.5 h-3.5" strokeWidth={1.5} />
                            <span>Waiting</span>
                          </Badge>
                        )}
                        {isHost && !p.isHost && p.id !== myPlayerId && (
                          <button
                            type="button"
                            onClick={() => kickPlayer(p.id)}
                            className="min-w-[44px] min-h-[44px] -my-2 -mr-2 flex items-center justify-center text-chomu-secondary hover:text-chomu-coral hover:bg-chomu-bgSecondary/90 rounded-[10px] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-chomu-coral"
                            title="Remove player"
                            aria-label={`Remove ${p.name}`}
                          >
                            <X className="w-4 h-4" strokeWidth={1.5} />
                          </button>
                        )}
                      </div>
                    }
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Host Settings */}
        {(isHost || showSettingsDrawer) && (
          <Card className="lg:col-span-5 p-5 space-y-5">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-chomu-secondary" strokeWidth={1.5} />
                <h2 className="text-sm font-semibold text-chomu-text">
                  {isHost ? 'Game settings' : 'Room settings'}
                </h2>
              </div>
              <span className="text-xs text-chomu-muted">
                {isHost ? 'Host controls' : 'Read only'}
              </span>
            </div>

            {/* Category Selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-chomu-secondary">
                  Categories ({currentSettings.categoryIds.length} selected)
                </span>
                <span className="text-xs text-chomu-muted">
                  Min 1
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {DEFAULT_CATEGORIES.map((cat) => {
                  const isSelected = currentSettings.categoryIds.includes(cat.id);
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      disabled={!isHost}
                      onClick={() => handleCategoryToggle(cat.id)}
                      className={`min-h-[44px] px-4 py-2 rounded-full border border-b-[3px] text-left transition-all flex items-center justify-between gap-2 active:translate-y-[1px] ${
                        isSelected
                          ? 'bg-chomu-teal/15 border-chomu-teal border-b-[#0E8F79] text-chomu-text font-semibold'
                          : 'bg-chomu-bgSecondary border-white/[0.1] border-b-[#05080E] text-chomu-secondary hover:text-chomu-text'
                      } ${!isHost ? 'cursor-default opacity-80 active:translate-y-0' : 'cursor-pointer'}`}
                    >
                      <span className="text-xs font-medium truncate">{cat.name}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-chomu-purple shrink-0" strokeWidth={1.5} />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Chomu Count & Round Duration */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-chomu-secondary block mb-1.5">
                  Chomus
                </label>
                <div role="radiogroup" aria-label="Select Chomu count" className="grid grid-cols-3 gap-1.5">
                  {[1, 2, 3].map((count) => {
                    const isSelected = currentSettings.chomuCount === count;
                    return (
                      <button
                        key={count}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        aria-label={`${count} ${count === 1 ? 'Chomu' : 'Chomas'}`}
                        disabled={!isHost}
                        onClick={() => handleChomuCountChange(count)}
                        className={`min-h-[44px] rounded-full text-xs font-mono font-bold border border-b-[3px] active:translate-y-[1px] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-chomu-coral ${
                          isSelected
                            ? 'bg-chomu-coral/20 text-chomu-coral border-chomu-coral border-b-[#B83237]'
                            : 'bg-chomu-bgSecondary text-chomu-secondary border-white/[0.1] border-b-[#05080E] hover:text-chomu-text'
                        } ${!isHost ? 'cursor-default active:translate-y-0' : 'cursor-pointer'}`}
                      >
                        {count}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-chomu-secondary block mb-1.5">
                  Round timer
                </label>
                <div role="radiogroup" aria-label="Select round duration" className="grid grid-cols-3 gap-1.5">
                  {[
                    { label: '2m', sec: 120 },
                    { label: '3m', sec: 180 },
                    { label: '4m', sec: 240 },
                  ].map((d) => {
                    const isSelected = currentSettings.roundDurationSeconds === d.sec;
                    return (
                      <button
                        key={d.sec}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        aria-label={`${d.label} round duration`}
                        disabled={!isHost}
                        onClick={() => handleRoundDurationChange(d.sec)}
                        className={`min-h-[44px] rounded-full text-xs font-mono font-bold border border-b-[3px] active:translate-y-[1px] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-chomu-teal ${
                          isSelected
                            ? 'bg-chomu-teal/15 text-chomu-teal border-chomu-teal border-b-[#0E8F79]'
                            : 'bg-chomu-bgSecondary text-chomu-secondary border-white/[0.1] border-b-[#05080E] hover:text-chomu-text'
                        } ${!isHost ? 'cursor-default active:translate-y-0' : 'cursor-pointer'}`}
                      >
                        {d.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Hint Difficulty */}
            <div>
              <label className="text-xs font-medium text-chomu-secondary block mb-1.5">
                Chomu hint
              </label>
              <div role="radiogroup" aria-label="Select hint difficulty" className="grid grid-cols-4 gap-1.5">
                {(['subtle', 'balanced', 'easy', 'none'] as HintDifficulty[]).map((h) => {
                  const isSelected = currentSettings.hintDifficulty === h;
                  return (
                    <button
                      key={h}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      aria-label={`${h} hint difficulty`}
                      disabled={!isHost}
                      onClick={() => handleHintDifficultyChange(h)}
                      className={`min-h-[44px] px-2 rounded-[10px] text-xs font-medium border capitalize transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-chomu-purple ${
                        isSelected
                          ? 'bg-chomu-elevated text-chomu-text border-chomu-purple'
                          : 'bg-chomu-bgSecondary text-chomu-secondary border-white/[0.08] hover:text-chomu-text'
                      } ${!isHost ? 'cursor-default' : 'cursor-pointer'}`}
                    >
                      {h}
                    </button>
                  );
                })}
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Bottom Action Bar in natural flow (sits cleanly above docked VoiceControls HUD) */}
      <Card className="p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="w-full sm:w-auto">
          <Button
            variant={myPlayer?.isReady ? 'lime' : 'secondary'}
            size="lg"
            fullWidth
            className="sm:w-44"
            onClick={handleToggleReady}
            leftIcon={<Check className="w-4 h-4" strokeWidth={1.5} />}
          >
            {myPlayer?.isReady ? 'Ready' : 'Mark ready'}
          </Button>
        </div>

        <div className="w-full sm:w-auto flex flex-col sm:items-end gap-1">
          {isHost ? (
            <>
              <Button
                variant="primary"
                size="lg"
                fullWidth
                className="sm:w-56"
                disabled={!canStartGame}
                onClick={startGame}
                leftIcon={<Play className="w-4 h-4" strokeWidth={1.5} />}
              >
                Start game
              </Button>
              {players.length < 3 && (
                <p className="text-xs text-chomu-coral text-center sm:text-right tabular-nums">
                  Needs at least 3 players to start ({players.length}/3)
                </p>
              )}
            </>
          ) : (
            <p className="text-xs text-chomu-secondary text-center sm:text-right">
              Waiting for the host to start the game
            </p>
          )}
        </div>
      </Card>

      {roomCode && (
        <QRCodeModal
          isOpen={isQrOpen}
          onClose={() => setIsQrOpen(false)}
          roomCode={roomCode}
          joinUrl={inviteUrl}
        />
      )}
    </div>
  );
};
