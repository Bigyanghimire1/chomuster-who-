import React, { useEffect, useRef, useState } from 'react';
import { Crown, Mic, VideoOff } from 'lucide-react';
import { OnlinePlayer } from '../../types/multiplayer';
import { PlayerAvatar } from '../illustrations/PlayerAvatar';
import { Badge } from './Badge';

export interface VideoCardProps {
  player: OnlinePlayer;
  stream?: MediaStream | null;
  isSpotlight?: boolean;
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
  isSpeaking = false,
  isLocal = false,
  audioLevel = 0,
  className = '',
  onClick,
  actionSlot,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

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
    stream.addEventListener('addtrack', handleTrackChange);
    stream.addEventListener('removetrack', handleTrackChange);

    const videoTracks = stream.getVideoTracks();
    videoTracks.forEach((track) => {
      track.addEventListener('ended', handleTrackChange);
      track.addEventListener('mute', handleTrackChange);
      track.addEventListener('unmute', handleTrackChange);
    });

    return () => {
      stream.removeEventListener('addtrack', handleTrackChange);
      stream.removeEventListener('removetrack', handleTrackChange);
      videoTracks.forEach((track) => {
        track.removeEventListener('ended', handleTrackChange);
        track.removeEventListener('mute', handleTrackChange);
        track.removeEventListener('unmute', handleTrackChange);
      });
    };
  }, [stream]);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    if (stream && hasActiveVideo) {
      if (videoEl.srcObject !== stream) {
        videoEl.srcObject = stream;
      }
      const playPromise = videoEl.play?.();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {});
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

  const spotlightStyles = isSpotlight
    ? 'min-h-[260px] sm:min-h-[320px] md:min-h-[360px]'
    : 'min-h-[140px] sm:min-h-[160px]';

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-xl bg-chomu-surface border transition-[border-color,transform,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] flex items-center justify-center select-none ${borderStyles} ${spotlightStyles} ${className} ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      {/* Persistent <video> Element */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isLocal}
        className={`w-full h-full object-cover rounded-xl ${
          hasActiveVideo ? 'block' : 'hidden'
        } ${isLocal ? '-scale-x-100' : ''}`}
      />

      {/* Avatar Fallback when camera is off */}
      {!hasActiveVideo && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 z-0 bg-chomu-surface">
          <div className="mb-2">
            <PlayerAvatar id={player.avatar} size={isSpotlight ? 'xl' : 'lg'} />
          </div>
          <span className="text-sm font-medium text-chomu-text truncate max-w-[90%] text-center">
            {player.name}
          </span>
          <span className="text-xs text-chomu-muted flex items-center gap-1.5 mt-1">
            <VideoOff className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span>Camera off</span>
          </span>
        </div>
      )}

      {/* Top Overlay: Spotlight & Host Tag */}
      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none z-10">
        <div className="flex items-center gap-1.5">
          {isSpotlight && (
            <Badge variant="purple" size="sm">
              Spotlight
            </Badge>
          )}
          {player.isHost && (
            <Badge variant="yellow" size="sm">
              <Crown className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span>Host</span>
            </Badge>
          )}
        </div>

        {actionSlot && <div className="pointer-events-auto">{actionSlot}</div>}
      </div>

      {/* Bottom Badge: Player Name & Live Audio */}
      <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none z-10">
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-chomu-bgSecondary/90 border border-white/[0.08] text-xs font-medium text-chomu-text truncate max-w-[80%]">
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
        </div>

        {isSpeaking && (
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-chomu-bgSecondary/90 border border-chomu-lime/30 text-chomu-lime text-xs font-medium">
            <Mic className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span>Live</span>
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
