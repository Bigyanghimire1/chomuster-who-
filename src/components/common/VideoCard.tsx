import React, { useEffect, useRef, useState } from 'react';
import { Crown, Mic, MicOff, Video, VideoOff, WifiOff } from 'lucide-react';
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
  isMuted?: boolean;
  hasCameraOn?: boolean;
  audioLevel?: number;
  readinessStatus?: 'ready' | 'waiting' | null;
  className?: string;
  onClick?: () => void;
  actionSlot?: React.ReactNode;
}

/**
 * VideoCard — Video or avatar tile for multiplayer rooms.
 * Three-zone layout:
 * - Top: Host & media/connection indicators
 * - Center: Live video or expressive SVG character
 * - Bottom: Player name & readiness / speaking state
 * Keeps a persistent <video> element to prevent flicker on layout/track changes.
 */
export const VideoCard: React.FC<VideoCardProps> = ({
  player,
  stream,
  isSpotlight = false,
  compact = false,
  isSpeaking = false,
  isLocal = false,
  isMuted,
  hasCameraOn,
  audioLevel = 0,
  readinessStatus = null,
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
      videoEl.muted = true;
      videoEl.playsInline = true;
      videoEl.setAttribute?.('playsinline', '');
      videoEl.setAttribute?.('webkit-playsinline', '');
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
    ? 'border-[#050505] ring-4 ring-[#64E987]'
    : readinessStatus === 'ready'
      ? 'border-[#050505] ring-2 ring-[#64E987]'
      : isSpotlight
        ? 'border-[#050505] ring-4 ring-[#FFDF00]'
        : 'border-[#050505]';

  const sizeStyles = isSpotlight
    ? 'w-full aspect-[4/3] min-h-[260px] sm:min-h-[300px] md:min-h-[340px]'
    : compact
      ? 'w-full aspect-[4/3] min-h-[112px]'
      : 'w-full aspect-[4/3] min-h-[140px] sm:min-h-[172px]';

  const avatarSize = isSpotlight ? 'xl' : compact ? 'md' : 'xl';

  return (
    <div
      onClick={onClick}
      className={`animate-scale-in relative overflow-hidden rounded-2xl bg-white border-[2.5px] transition-[border-color,transform,opacity,box-shadow] duration-150 flex items-center justify-center select-none shadow-[0_5px_0_#050505] ${borderStyles} ${sizeStyles} ${className} ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      {/* Persistent <video> Element (contained strictly inside card with object-cover) */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={true}
        className={`absolute inset-0 w-full h-full object-cover rounded-[13px] ${
          hasActiveVideo ? 'block' : 'hidden'
        } ${isLocal ? '-scale-x-100' : ''}`}
      />

      {/* Avatar Fallback when camera is off — spaced cleanly away from top badges & bottom name bar */}
      {!hasActiveVideo && (
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center z-0 bg-[#F5F6F8] ${
            compact ? 'pt-7 pb-8 px-2' : 'pt-9 pb-11 px-4'
          }`}
        >
          <PlayerAvatar id={player.avatar} size={avatarSize} />
        </div>
      )}

      {/* Top Zone: Spotlight, Host, Media & Connection Indicators */}
      <div className="absolute top-2 left-2 right-2 flex flex-col gap-1 pointer-events-none z-10">
        <div className="flex items-center justify-between gap-1.5">
          <div className="flex flex-wrap items-center gap-1 min-w-0">
            {isSpotlight && (
              <Badge variant="purple" size="sm">
                Spotlight
              </Badge>
            )}
            {player.isHost && (
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FFDF00] border-2 border-[#050505] text-[10px] font-extrabold text-[#050505] shadow-[0_2px_0_#050505] shrink-0"
                title="Room Host"
              >
                <Crown className="w-3 h-3" strokeWidth={2.25} />
                {!compact && <span>Host</span>}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0">
          {/* Connection status if offline */}
          {!player.isConnected && (
            <span
              className="w-6 h-6 rounded-full bg-[#FF5D73] border-2 border-[#050505] flex items-center justify-center text-[#050505] shadow-[0_2px_0_#050505]"
              title="Reconnecting"
              aria-label="Reconnecting"
            >
              <WifiOff className="w-3 h-3" strokeWidth={2.25} />
            </span>
          )}

          {/* Mic indicator */}
          {(() => {
            const derivedMuted =
              typeof isMuted === 'boolean'
                ? isMuted
                : stream && typeof stream.getAudioTracks === 'function'
                  ? !stream.getAudioTracks().some((t) => t.enabled && t.readyState === 'live')
                  : undefined;
            if (typeof derivedMuted !== 'boolean') return null;
            return (
              <span
                className={`w-6 h-6 rounded-full border-2 border-[#050505] flex items-center justify-center shadow-[0_2px_0_#050505] ${
                  derivedMuted
                    ? 'bg-white text-[#52555E]'
                    : 'bg-[#64E987] text-[#050505]'
                }`}
                title={derivedMuted ? 'Mic muted' : 'Mic active'}
                aria-label={derivedMuted ? 'Mic muted' : 'Mic active'}
              >
                {derivedMuted ? (
                  <MicOff className="w-3 h-3" strokeWidth={2.25} />
                ) : (
                  <Mic className="w-3 h-3" strokeWidth={2.25} />
                )}
              </span>
            );
          })()}

          {/* Camera indicator */}
          <span
            className={`w-6 h-6 rounded-full border-2 border-[#050505] flex items-center justify-center shadow-[0_2px_0_#050505] ${
              (hasCameraOn ?? hasActiveVideo)
                ? 'bg-[#A9E5F2] text-[#050505]'
                : 'bg-white text-[#52555E]'
            }`}
            title={(hasCameraOn ?? hasActiveVideo) ? 'Camera on' : 'Camera off'}
            aria-label={(hasCameraOn ?? hasActiveVideo) ? 'Camera on' : 'Camera off'}
          >
            {(hasCameraOn ?? hasActiveVideo) ? (
              <Video className="w-3 h-3" strokeWidth={2.25} />
            ) : (
              <VideoOff className="w-3 h-3" strokeWidth={2.25} />
            )}
          </span>
          </div>
        </div>
        {actionSlot && (
          <div className="flex items-center justify-start pointer-events-auto">
            {actionSlot}
          </div>
        )}
      </div>

      {/* Bottom Zone: Player Name & Readiness / Live Status */}
      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between gap-1.5 pointer-events-none z-10">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border-2 border-[#050505] text-xs font-extrabold text-[#050505] shadow-[0_2px_0_#050505] min-w-0 max-w-full">
          <span className="truncate">{player.name}</span>
          {isLocal && (
            <span className="text-[11px] text-[#050505]/70 font-extrabold shrink-0">
              (You)
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {readinessStatus === 'ready' && (
            <span className="px-2.5 py-0.5 rounded-full bg-[#64E987] border-2 border-[#050505] text-[#050505] text-[11px] font-extrabold shadow-[0_2px_0_#050505]">
              Ready
            </span>
          )}
          {readinessStatus === 'waiting' && (
            <span className="px-2.5 py-0.5 rounded-full bg-[#E2E4EA] border-2 border-[#050505] text-[#26282E] text-[11px] font-bold shadow-[0_2px_0_#050505]">
              Not ready
            </span>
          )}
          {isSpeaking && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#64E987] border-2 border-[#050505] text-[#050505] text-[11px] font-extrabold shadow-[0_2px_0_#050505] shrink-0">
              <Mic className="w-3 h-3" strokeWidth={2.5} />
              {!compact && <span>Live</span>}
              {audioLevel > 0 && (
                <span
                  className="w-1 rounded-full bg-[#050505] transition-[height] duration-75"
                  style={{ height: `${Math.max(6, Math.min(12, audioLevel * 16))}px` }}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
