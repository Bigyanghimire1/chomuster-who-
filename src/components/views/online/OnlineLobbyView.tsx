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
  Crown,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useMultiplayer } from '../../../context/MultiplayerContext';
import { Button } from '../../common/Button';
import { Card } from '../../common/Card';
import { Badge } from '../../common/Badge';
import { PlayerAvatar } from '../../illustrations/PlayerAvatar';
import { SpeakingIndicator } from '../../common/SpeakingIndicator';
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
    } catch {
      // Ignore clipboard error
    }
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
    } catch {
      // Ignore clipboard error
    }
  };

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'Join my Chomu Who room!',
          text: `Join our party game of Chomu Who! Room code: ${roomCode}`,
          url: inviteUrl,
        });
        audioService.playButtonTap();
      } catch {
        // Share cancelled or rejected
      }
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
      if (prev.length <= 1) return; // Must keep at least one category
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
    <div className="flex flex-col flex-1 max-w-2xl mx-auto w-full px-4 py-4 select-none animate-fade-in space-y-4">
      {/* Top Navigation & Leave */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="purple" size="md">
            ONLINE MULTIPLAYER
          </Badge>
          <span className="text-xs text-chomu-muted font-bold">
            {players.length} {players.length === 1 ? 'Player' : 'Players'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={leaveRoom}
            leftIcon={<LogOut className="w-3.5 h-3.5 text-chomu-muted" />}
          >
            Leave
          </Button>
        </div>
      </div>

      {/* Room Code & Invite Share Card */}
      <Card className="bg-gradient-to-br from-chomu-surface via-chomu-surface to-chomu-elevated border-2 border-chomu-purple/40 p-4 sm:p-5 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Room Code Display */}
          <div className="text-center sm:text-left space-y-1">
            <span className="text-[11px] font-black uppercase tracking-widest text-chomu-muted">
              Room Code
            </span>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="text-3xl sm:text-4xl font-mono font-black text-chomu-lime tracking-[0.2em] drop-shadow-md">
                {roomCode || '----'}
              </span>
              <button
                onClick={handleCopyCode}
                className="p-1.5 rounded-xl bg-chomu-elevated hover:bg-chomu-border text-chomu-muted hover:text-chomu-text transition-colors"
                title="Copy Room Code"
              >
                {copiedCode ? (
                  <Check className="w-4 h-4 text-chomu-lime" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
            <p className="text-[11px] text-chomu-muted font-medium">
              Share this code or invite link with your friends
            </p>
          </div>

          {/* Quick Actions: Share, Copy Link, QR Code */}
          <div className="flex flex-wrap items-center justify-center gap-2 w-full sm:w-auto">
            {isWebShareSupported && (
              <Button
                variant="primary"
                size="md"
                onClick={handleShare}
                leftIcon={<Share2 className="w-4 h-4" />}
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
                  <Check className="w-4 h-4 text-chomu-lime" />
                ) : (
                  <Copy className="w-4 h-4 text-chomu-muted" />
                )
              }
            >
              {copiedLink ? 'Copied!' : 'Copy Link'}
            </Button>

            <Button
              variant="secondary"
              size="md"
              onClick={() => setIsQrOpen(true)}
              leftIcon={<QrCode className="w-4 h-4 text-chomu-muted" />}
            >
              QR Code
            </Button>
          </div>
        </div>
      </Card>

      {/* Players Section Header */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-chomu-purple" />
          <h2 className="text-sm font-black text-chomu-text uppercase tracking-wider">
            Joined Players ({players.length})
          </h2>
        </div>

        {isHost && (
          <button
            onClick={() => setShowSettingsDrawer(!showSettingsDrawer)}
            className="text-xs font-bold text-chomu-purple hover:text-chomu-text flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-chomu-surface border border-chomu-border hover:bg-chomu-elevated transition-colors"
          >
            <Settings2 className="w-3.5 h-3.5" />
            <span>Room Settings</span>
          </button>
        )}
      </div>

      {/* Players Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {players.map((p) => {
          const isMe = p.id === myPlayerId;
          const isPeerSpeaking = !!speakingPeers[p.id] || !!p.isSpeaking;

          return (
            <Card
              key={p.id}
              className={`p-3 flex items-center justify-between border transition-all ${
                isMe
                  ? 'bg-chomu-elevated/90 border-chomu-purple/60 shadow-lg'
                  : 'bg-chomu-surface/80 border-chomu-border'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <SpeakingIndicator
                  isSpeaking={isPeerSpeaking}
                  size="md"
                  variant="ring"
                  ringColor="lime"
                >
                  <PlayerAvatar id={p.avatar} size="md" />
                </SpeakingIndicator>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-black text-chomu-text truncate">
                      {p.name}
                    </span>
                    {isMe && (
                      <span className="text-[10px] text-chomu-purple font-bold">
                        (You)
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 pt-0.5">
                    {p.isHost && (
                      <Badge variant="yellow" size="sm">
                        <Crown className="w-3 h-3 inline mr-0.5" /> HOST
                      </Badge>
                    )}
                    {p.isReady ? (
                      <Badge variant="lime" size="sm">
                        <Check className="w-3 h-3 inline mr-0.5" /> Ready
                      </Badge>
                    ) : (
                      <Badge variant="muted" size="sm">
                        <Clock className="w-3 h-3 inline mr-0.5" /> Waiting
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Host kick button */}
              {isHost && !p.isHost && p.id !== myPlayerId && (
                <button
                  onClick={() => kickPlayer(p.id)}
                  className="p-1.5 text-chomu-muted hover:text-chomu-coral hover:bg-chomu-coral/10 rounded-xl transition-colors ml-2"
                  title="Kick player"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </Card>
          );
        })}
      </div>

      {/* Host Settings Section (Collapsible Drawer / Card) */}
      {(isHost || showSettingsDrawer) && (
        <Card className="bg-chomu-surface/90 border border-chomu-border p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-chomu-border/60 pb-2.5">
            <div className="flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-chomu-lime" />
              <h3 className="text-sm font-black text-chomu-text uppercase tracking-wider">
                {isHost ? 'Host Game Settings' : 'Room Rules & Settings'}
              </h3>
            </div>
            {isHost && (
              <span className="text-[10px] text-chomu-lime font-bold uppercase tracking-wider">
                Host Editable
              </span>
            )}
          </div>

          {/* 1. Category Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-chomu-muted uppercase tracking-wider flex items-center justify-between">
              <span>Categories ({currentSettings.categoryIds.length} Selected)</span>
              <span className="text-[10px] text-chomu-muted font-normal lowercase">
                at least 1 required
              </span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {DEFAULT_CATEGORIES.map((cat) => {
                const isSelected = currentSettings.categoryIds.includes(cat.id);
                return (
                  <button
                    key={cat.id}
                    disabled={!isHost}
                    onClick={() => handleCategoryToggle(cat.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-chomu-purple/20 border-chomu-purple text-chomu-text shadow-sm'
                        : 'bg-chomu-bg/60 border-chomu-border/60 text-chomu-muted hover:border-chomu-border'
                    } ${!isHost ? 'cursor-default' : 'cursor-pointer active:scale-[0.98]'}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black truncate">{cat.name}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-chomu-purple" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Round Duration & Chomu Count Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            {/* Chomu Count */}
            <div>
              <label className="text-xs font-bold text-chomu-muted uppercase tracking-wider block mb-1.5">
                Chomus (Imposters)
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[1, 2, 3].map((count) => {
                  const isSelected = currentSettings.chomuCount === count;
                  return (
                    <button
                      key={count}
                      disabled={!isHost}
                      onClick={() => handleChomuCountChange(count)}
                      className={`py-1.5 px-2 rounded-xl text-xs font-black border transition-all ${
                        isSelected
                          ? 'bg-chomu-coral text-chomu-bg border-chomu-coral shadow-md'
                          : 'bg-chomu-bg/60 text-chomu-muted border-chomu-border/60 hover:text-chomu-text'
                      } ${!isHost ? 'cursor-default' : 'cursor-pointer active:scale-95'}`}
                    >
                      {count}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Round Duration */}
            <div>
              <label className="text-xs font-bold text-chomu-muted uppercase tracking-wider block mb-1.5">
                Round Duration
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { label: '2m', sec: 120 },
                  { label: '3m', sec: 180 },
                  { label: '4m', sec: 240 },
                ].map((d) => {
                  const isSelected = currentSettings.roundDurationSeconds === d.sec;
                  return (
                    <button
                      key={d.sec}
                      disabled={!isHost}
                      onClick={() => handleRoundDurationChange(d.sec)}
                      className={`py-1.5 px-2 rounded-xl text-xs font-black border transition-all ${
                        isSelected
                          ? 'bg-chomu-lime text-chomu-bg border-chomu-lime shadow-md'
                          : 'bg-chomu-bg/60 text-chomu-muted border-chomu-border/60 hover:text-chomu-text'
                      } ${!isHost ? 'cursor-default' : 'cursor-pointer active:scale-95'}`}
                    >
                      {d.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Hint Difficulty */}
            <div>
              <label className="text-xs font-bold text-chomu-muted uppercase tracking-wider block mb-1.5">
                Chomu Hint
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {(['subtle', 'balanced', 'easy', 'none'] as HintDifficulty[]).map((h) => {
                  const isSelected = currentSettings.hintDifficulty === h;
                  return (
                    <button
                      key={h}
                      disabled={!isHost}
                      onClick={() => handleHintDifficultyChange(h)}
                      className={`py-1 px-1.5 rounded-xl text-[11px] font-black border capitalize transition-all ${
                        isSelected
                          ? 'bg-chomu-purple text-chomu-bg border-chomu-purple shadow-md'
                          : 'bg-chomu-bg/60 text-chomu-muted border-chomu-border/60 hover:text-chomu-text'
                      } ${!isHost ? 'cursor-default' : 'cursor-pointer active:scale-95'}`}
                    >
                      {h}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Bottom Sticky Action Bar */}
      <div className="pt-2 sticky bottom-4 z-20">
        <Card className="bg-chomu-surface/95 backdrop-blur-md border border-chomu-border p-3.5 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Ready Button for all players */}
          <div className="w-full sm:w-auto flex items-center gap-2">
            <Button
              variant={myPlayer?.isReady ? 'lime' : 'secondary'}
              size="lg"
              fullWidth
              className="sm:w-44"
              onClick={handleToggleReady}
              leftIcon={
                myPlayer?.isReady ? (
                  <Check className="w-4 h-4 text-chomu-bg" />
                ) : (
                  <Sparkles className="w-4 h-4 text-chomu-lime" />
                )
              }
            >
              {myPlayer?.isReady ? "YOU'RE READY" : 'SET READY'}
            </Button>
          </div>

          {/* Start Game (Host only) or Waiting Status (Non-host) */}
          <div className="w-full sm:w-auto flex-1 sm:text-right">
            {isHost ? (
              <div className="space-y-1">
                <Button
                  variant="primary"
                  size="xl"
                  fullWidth
                  className="sm:w-60"
                  disabled={!canStartGame}
                  onClick={startGame}
                  leftIcon={<Play className="w-5 h-5 fill-current" />}
                >
                  START GAME
                </Button>
                {players.length < 3 && (
                  <p className="text-[11px] text-chomu-coral font-bold text-center sm:text-right">
                    Need at least 3 players to start ({players.length}/3)
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center sm:text-right px-2">
                <span className="text-xs font-black text-chomu-lime block">
                  Lobby Ready
                </span>
                <span className="text-[11px] text-chomu-muted font-medium block">
                  Waiting for host to start the game...
                </span>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* QR Code Modal */}
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
