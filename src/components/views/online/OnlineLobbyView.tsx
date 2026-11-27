import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Copy,
  Check,
  QrCode,
  Share2,
  Users,
  Sliders,
  Play,
  LogOut,
  X,
} from 'lucide-react';
import { useMultiplayer } from '../../../context/MultiplayerContext';
import { Button } from '../../common/Button';
import { Card } from '../../common/Card';
import { Badge } from '../../common/Badge';
import { VideoCard } from '../../common/VideoCard';
import { QRCodeModal } from './QRCodeModal';
import { OnlineSettingsFields } from './OnlineSettingsFields';
import { LobbyChatDrawer } from './LobbyChatDrawer';
import { OnlineSettings } from '../../../types/multiplayer';
import { audioService } from '../../../services/audioService';

export const OnlineLobbyView: React.FC = () => {
  const {
    roomCode,
    players,
    myPlayerId,
    myPlayer,
    isHost,
    roomState,
    error: contextError,
    setReady,
    startGame,
    updateSettings,
    kickPlayer,
    leaveRoom,
    sendChat,
    chatMessages,
    speakingPeers,
    localStream,
    peerStreams,
  } = useMultiplayer();

  const [isQrOpen, setIsQrOpen] = useState<boolean>(false);
  const [isEditSettingsOpen, setIsEditSettingsOpen] = useState<boolean>(false);
  const [draftSettings, setDraftSettings] = useState<OnlineSettings | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [isStarting, setIsStarting] = useState<boolean>(false);

  const currentSettings: OnlineSettings = roomState?.settings || {
    categoryIds: ['everyday_objects', 'food_drinks', 'animals'],
    roundDurationSeconds: 45,
    turnDurationSeconds: 20,
    discussionDurationSeconds: 45,
    votingDurationSeconds: 60,
    hintDifficulty: 'subtle',
    chomuCount: 1,
  };

  const turnDurationSeconds = currentSettings.turnDurationSeconds ?? 20;
  const discussionDurationSeconds = currentSettings.discussionDurationSeconds ?? 45;

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

  const handleOpenEditSettings = () => {
    setDraftSettings({ ...currentSettings });
    setIsEditSettingsOpen(true);
    audioService.playButtonTap();
  };

  const handleSaveSettings = () => {
    if (!draftSettings) return;
    updateSettings(draftSettings);
    setIsEditSettingsOpen(false);
    audioService.playButtonTap();
  };

  const readyCount = players.filter((p) => p.isReady).length;
  const allPlayersReady = players.length > 0 && readyCount === players.length;
  const canStartGame = isHost && players.length >= 3 && allPlayersReady;

  const isWebShareSupported =
    typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  return (
    <div className="flex flex-col flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-5 select-none animate-fade-in space-y-4">
      {/* Top Bar */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Badge variant="info" size="md">
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

      {/* Room Invitation & Compact Game Summary Ticket */}
      <Card className="p-4 sm:p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5" aria-label={`Room code ${roomCode || '----'}`}>
              {(roomCode || '----').split('').map((char, idx) => (
                <span
                  key={idx}
                  className="w-11 h-12 rounded-xl bg-[#FFDF00] border-[2.5px] border-[#050505] shadow-[0_3px_0_#050505] flex items-center justify-center text-2xl font-mono font-extrabold text-[#050505] tabular-nums"
                >
                  {char}
                </span>
              ))}
            </div>
            <button
              type="button"
              onClick={handleCopyCode}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-white border-2 border-[#050505] shadow-[0_3px_0_#050505] active:translate-y-[2px] active:shadow-none text-[#050505] hover:bg-[#FFF9CC] transition-all"
              title="Copy room code"
              aria-label="Copy room code"
            >
              {copiedCode ? (
                <Check className="w-4 h-4 text-chomu-successText" strokeWidth={2.5} />
              ) : (
                <Copy className="w-4 h-4" strokeWidth={1.75} />
              )}
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {isWebShareSupported && (
              <Button
                variant="primary"
                size="sm"
                onClick={handleShare}
                leftIcon={<Share2 className="w-4 h-4" strokeWidth={1.5} />}
              >
                Share
              </Button>
            )}

            <Button
              variant={copiedLink ? 'lime' : 'secondary'}
              size="sm"
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
              size="sm"
              onClick={() => setIsQrOpen(true)}
              leftIcon={<QrCode className="w-4 h-4" strokeWidth={1.5} />}
            >
              QR code
            </Button>
          </div>
        </div>

        {/* Compact Game Summary Bar (visible to all; host-only Edit game button) */}
        <div className="pt-3 border-t border-chomu-border flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-chomu-secondary">
            <span className="px-2.5 py-1 rounded-full bg-chomu-bgSecondary border border-chomu-border font-medium text-chomu-text">
              {currentSettings.categoryIds.length}{' '}
              {currentSettings.categoryIds.length === 1 ? 'Category' : 'Categories'}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-chomu-bgSecondary border border-chomu-border font-medium text-chomu-text">
              {currentSettings.chomuCount}{' '}
              {currentSettings.chomuCount === 1 ? 'Chomu' : 'Chomus'}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-chomu-bgSecondary border border-chomu-border font-medium">
              {turnDurationSeconds === 0 ? 'Turns: Off' : `${turnDurationSeconds}s Turns`}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-chomu-bgSecondary border border-chomu-border font-medium">
              {discussionDurationSeconds}s Discussion
            </span>
            <span className="px-2.5 py-1 rounded-full bg-chomu-bgSecondary border border-chomu-border font-medium capitalize">
              Hint: {currentSettings.hintDifficulty}
            </span>
          </div>

          {isHost && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleOpenEditSettings}
              leftIcon={<Sliders className="w-3.5 h-3.5 text-[#050505]" strokeWidth={2.2} />}
            >
              Edit game
            </Button>
          )}
        </div>
      </Card>

      {/* Main Content: People-First Grid (scales up to 15 players) + Lobby Chat */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start flex-1">
        {/* Players Grid */}
        <div className="lg:col-span-8 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#050505]" strokeWidth={2.25} />
              <h2 className="text-sm font-extrabold text-[#050505]">
                Players in lobby
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-white border-2 border-[#050505] text-[11px] font-extrabold text-[#050505] tabular-nums shadow-[0_2px_0_#050505]">
                {readyCount}/{players.length} ready
              </span>
            </div>
            <span className="text-[11px] font-bold text-[#050505]/75 tabular-nums">
              Max 15
            </span>
          </div>

          <div
            className={`grid gap-2.5 sm:gap-3 ${
              players.length > 6
                ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 max-h-[54vh] overflow-y-auto pr-1 pb-1'
                : 'grid-cols-2 sm:grid-cols-3'
            }`}
          >
            {players.map((p) => {
              const isMe = p.id === myPlayerId;
              const isPeerSpeaking = !!speakingPeers[p.id] || !!p.isSpeaking;
              const stream = isMe ? localStream : peerStreams[p.id] || null;
              const isDense = players.length > 6;

              return (
                <div
                  key={p.id}
                  className={`relative aspect-[4/3] w-full min-w-0 ${
                    isDense ? 'min-h-[116px]' : 'min-h-[140px]'
                  }`}
                >
                  <VideoCard
                    player={p}
                    stream={stream}
                    compact={isDense}
                    isSpeaking={isPeerSpeaking}
                    isLocal={isMe}
                    readinessStatus={p.isReady ? 'ready' : 'waiting'}
                    actionSlot={
                      isHost && !p.isHost && p.id !== myPlayerId ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            kickPlayer(p.id);
                          }}
                          title={`Remove ${p.name}`}
                          aria-label={`Remove ${p.name}`}
                          className="w-6 h-6 rounded-full bg-white border-2 border-[#050505] flex items-center justify-center text-[#050505] hover:bg-[#FF5D73] transition-colors shadow-[0_2px_0_#050505] focus:outline-none"
                        >
                          <X className="w-3 h-3" strokeWidth={2.5} />
                        </button>
                      ) : undefined
                    }
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Lobby Chat (Mobile Bottom Sheet Trigger + Desktop Side Panel; Lobby-only) */}
        <LobbyChatDrawer
          messages={chatMessages}
          onSend={sendChat}
          playerCount={players.length}
        />
      </div>

      {/* Sticky Bottom Action Bar (Ready to play toggle + Host Start Game) */}
      <Card className="sticky bottom-3 z-20 p-3.5 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <button
          type="button"
          role="switch"
          aria-checked={!!myPlayer?.isReady}
          aria-label="Ready to play"
          onClick={handleToggleReady}
          className={`w-full sm:w-64 min-h-[52px] px-4 py-2.5 rounded-2xl border-[2.5px] border-[#050505] shadow-[0_3px_0_#050505] active:translate-y-[2px] active:shadow-none flex items-center justify-between gap-3 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#050505] ${
            myPlayer?.isReady ? 'bg-[#E8FCEF]' : 'bg-white'
          }`}
        >
          <span className="text-sm font-extrabold text-[#050505]">
            Ready to play
          </span>

          <div className="flex items-center gap-2 shrink-0">
            <span
              className={`text-xs font-extrabold ${
                myPlayer?.isReady ? 'text-[#050505]' : 'text-[#52555E]'
              }`}
            >
              {myPlayer?.isReady ? 'Ready' : 'Not ready'}
            </span>
            <span
              aria-hidden="true"
              className={`relative inline-flex items-center w-12 h-7 rounded-full border-2 border-[#050505] transition-colors ${
                myPlayer?.isReady ? 'bg-[#64E987]' : 'bg-[#C6C9D1]'
              }`}
            >
              <span
                className={`inline-block w-5 h-5 rounded-full bg-white border-2 border-[#050505] transition-transform duration-150 ${
                  myPlayer?.isReady ? 'translate-x-[22px]' : 'translate-x-[2px]'
                }`}
              />
            </span>
          </div>
        </button>

        <div className="w-full sm:w-auto flex flex-col sm:items-end gap-1">
          {isHost ? (
            <>
              <Button
                variant="primary"
                size="lg"
                fullWidth
                className="sm:w-56"
                disabled={!canStartGame || isStarting}
                onClick={() => {
                  if (isStarting) return;
                  setIsStarting(true);
                  audioService.playGameStart();
                  startGame();
                  window.setTimeout(() => setIsStarting(false), 3000);
                }}
                leftIcon={<Play className="w-4 h-4" strokeWidth={2.5} />}
              >
                {isStarting ? 'Starting...' : 'Start game'}
              </Button>
              {contextError && (
                <p className="text-xs font-bold text-chomu-errorText text-center sm:text-right">
                  {contextError}
                </p>
              )}
              {players.length < 3 ? (
                <p className="text-xs font-bold text-[#050505] text-center sm:text-right tabular-nums">
                  Needs at least 3 players to start ({players.length}/3)
                </p>
              ) : !allPlayersReady ? (
                <p className="text-xs font-bold text-[#26282E] text-center sm:text-right tabular-nums">
                  Waiting for everyone to be ready ({readyCount}/{players.length})
                </p>
              ) : null}
            </>
          ) : (
            <p className="text-xs font-bold text-[#26282E] text-center sm:text-right">
              Waiting for the host to start the game
            </p>
          )}
        </div>
      </Card>

      {/* Host Edit Game Modal (portaled to body so it always layers above VoiceControls HUD) */}
      {isEditSettingsOpen &&
        draftSettings &&
        (typeof document !== 'undefined'
          ? createPortal(
              <div
                role="dialog"
                aria-modal="true"
                aria-label="Edit game settings"
                className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4 bg-black/50 animate-fade-in"
                onClick={() => setIsEditSettingsOpen(false)}
              >
                <div
                  className="w-full sm:max-w-lg bg-white border-t-[3px] sm:border-[3px] border-[#050505] rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-[0_10px_0_#050505] max-h-[88dvh] flex flex-col animate-slide-up"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between pb-3 border-b border-chomu-border mb-4">
                    <div>
                      <h2 className="text-base font-bold text-chomu-text">Edit game rules</h2>
                      <p className="text-xs text-chomu-muted">
                        Saving resets everyone&apos;s Ready status and notifies the lobby
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsEditSettingsOpen(false)}
                      aria-label="Close settings"
                      className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-full text-chomu-secondary hover:bg-chomu-elevated"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto pr-1">
                    <OnlineSettingsFields
                      settings={draftSettings}
                      onChange={setDraftSettings}
                    />
                  </div>

                  <div className="pt-4 mt-4 border-t border-chomu-border flex items-center justify-end gap-2.5">
                    <Button
                      variant="secondary"
                      size="md"
                      onClick={() => setIsEditSettingsOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      size="md"
                      onClick={handleSaveSettings}
                    >
                      Save rules
                    </Button>
                  </div>
                </div>
              </div>,
              document.body
            )
          : null)}

      {roomCode && (
        <QRCodeModal
          isOpen={isQrOpen}
          onClose={() => setIsQrOpen(false)}
          roomCode={roomCode}
        />
      )}
    </div>
  );
};
