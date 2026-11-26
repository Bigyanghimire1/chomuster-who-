import React, { useEffect, useRef, useState } from 'react';
import { Crown, Mic, VideoOff } from 'lucide-react';
import { OnlinePlayer } from '../../types/multiplayer';
import { PlayerAvatar } from '../illustrations/PlayerAvatar';
import { Badge } from './Badge';

export interface VideoCardProps {
  player: OnlinePlayer;
  stream?: MediaStream | null;
  isSpotlight?: boolean;
  compact?: boolean;
  isSpeaking?: boolean;
  isLocal?: boolean;
  audioLevel?: number;
  className?: string;
  onClick?: () => void;
  actionSlot?: React.ReactNode;
}

/**
 * VideoCard — Video or avatar tile for multiplayer rooms.
 * Keeps a persistent <video> element to prevent flicker on layout/track changes.
 */
export const VideoCard: React.FC<VideoCardProps> = ({
  player,
  stream,
  isSpotlight = false,
  compact = false,
  isSpeaking = false,
  isLocal = false,
  audioLevel = 0,
  className = '',
  onClick,
  actionSlot,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const videoTrackKey = stream
    ? stream
        .getVideoTracks()
        .map((t) => `${t.id ?? ''}:${t.enabled}:${t.readyState}`)
        .join('|')
    : '';

  const [hasActiveVideo, setHasActiveVideo] = useState<boolean>(() => {
    if (!stream) return false;
    const tracks = stream.getVideoTracks();
    return tracks.some((t) => t.enabled && t.readyState === 'live');
  });

  useEffect(() => {
    const updateActiveVideo = () => {
      if (!stream) {
        setHasActiveVideo(false);
        return;
      }
      const tracks = stream.getVideoTracks();
      const active = tracks.some((t) => t.enabled && t.readyState === 'live');
      setHasActiveVideo(active);
    };

    updateActiveVideo();
    if (!stream) return;

    const handleTrackChange = () => updateActiveVideo();
    stream.addEventListener?.('addtrack', handleTrackChange);
    stream.addEventListener?.('removetrack', handleTrackChange);

    const videoTracks = stream.getVideoTracks();
    videoTracks.forEach((track) => {
      track.addEventListener?.('ended', handleTrackChange);
      track.addEventListener?.('mute', handleTrackChange);
      track.addEventListener?.('unmute', handleTrackChange);
    });

    return () => {
      stream.removeEventListener?.('addtrack', handleTrackChange);
      stream.removeEventListener?.('removetrack', handleTrackChange);
      videoTracks.forEach((track) => {
        track.removeEventListener?.('ended', handleTrackChange);
        track.removeEventListener?.('mute', handleTrackChange);
        track.removeEventListener?.('unmute', handleTrackChange);
      });
    };
  }, [stream, videoTrackKey]);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    if (stream && hasActiveVideo) {
      if (videoEl.srcObject !== stream) {
        videoEl.srcObject = stream;
      }
      const startPlay = () => {
        const playPromise = videoEl.play?.();
        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch(() => {});
        }
      };
      startPlay();
      if (typeof videoEl.addEventListener === 'function') {
        videoEl.addEventListener('loadedmetadata', startPlay);
        return () => {
          videoEl.removeEventListener('loadedmetadata', startPlay);
        };
      }
    } else if (videoEl.srcObject) {
      videoEl.srcObject = null;
    }
  }, [stream, hasActiveVideo]);

  const borderStyles = isSpeaking
    ? 'border-chomu-lime ring-2 ring-chomu-lime/40'
    : isSpotlight
      ? 'border-chomu-purple/50'
      : 'border-white/[0.08] hover:border-white/[0.16]';

  const sizeStyles = isSpotlight
    ? 'w-full h-full min-h-[260px] sm:min-h-[320px] md:min-h-[360px]'
    : compact
      ? 'w-full h-full min-h-0'
      : 'w-full h-full min-h-[140px] sm:min-h-[172px]';

  const avatarSize = isSpotlight ? 'xl' : compact ? 'md' : 'xl';

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-3xl bg-chomu-surface border-2 transition-[border-color,transform,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] flex items-center justify-center select-none shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] ${borderStyles} ${sizeStyles} ${className} ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      {/* Persistent <video> Element (muted always; VoiceManager handles remote audio playback cleanly) */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={true}
        className={`absolute inset-0 w-full h-full object-cover rounded-3xl ${
          hasActiveVideo ? 'block' : 'hidden'
        } ${isLocal ? '-scale-x-100' : ''}`}
      />

      {/* Avatar Fallback when camera is off — spaced cleanly away from top badges & bottom name bar */}
      {!hasActiveVideo && (
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center z-0 bg-chomu-surface ${
            compact ? 'pt-6 pb-8 px-2' : 'pt-8 pb-11 px-4'
          }`}
        >
          <PlayerAvatar id={player.avatar} size={avatarSize} />
          {!compact && (
            <span className="text-xs text-chomu-muted inline-flex items-center gap-1.5 mt-2">
              <VideoOff className="w-3.5 h-3.5 shrink-0" strokeWidth={1.5} />
              <span>Camera off</span>
            </span>
          )}
        </div>
      )}

      {/* Top Overlay: Spotlight, Host & Action Slot */}
      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2 pointer-events-none z-10">
        <div className="flex items-center gap-1.5 min-w-0">
          {isSpotlight && (
            <Badge variant="purple" size="sm">
              Spotlight
            </Badge>
          )}
          {player.isHost && !compact && (
            <Badge variant="yellow" size="sm">
              <Crown className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span>Host</span>
            </Badge>
          )}
        </div>

        {actionSlot && <div className="pointer-events-auto shrink-0">{actionSlot}</div>}
      </div>

      {/* Bottom Bar: Single Player Name & Live Audio */}
      <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2 pointer-events-none z-10">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-chomu-bgSecondary/90 border border-white/[0.1] text-xs font-medium text-chomu-text min-w-0 max-w-full">
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${
              isSpeaking ? 'bg-chomu-lime' : 'bg-chomu-muted/50'
            }`}
          />
          <span className="truncate">{player.name}</span>
          {isLocal && (
            <span className="text-xs text-chomu-purple font-medium shrink-0">
              (You)
            </span>
          )}
          {compact && !hasActiveVideo && (
            <VideoOff className="w-3 h-3 text-chomu-muted shrink-0 ml-0.5" strokeWidth={1.5} aria-label="Camera off" />
          )}
        </div>

        {isSpeaking && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-chomu-bgSecondary/90 border border-chomu-lime/30 text-chomu-lime text-xs font-medium shrink-0">
            <Mic className="w-3.5 h-3.5" strokeWidth={1.5} />
            {!compact && <span>Live</span>}
            {audioLevel > 0 && (
              <span
                className="w-1 rounded-full bg-chomu-lime transition-[height] duration-75"
                style={{ height: `${Math.max(6, Math.min(14, audioLevel * 18))}px` }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
