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
 * VideoCard — Dynamic Google Meet / Zoom style video tile for WebRTC streams.
 * Features:
 * - Persistent <video> ref with srcObject attachment preventing screen flickering/re-mounting.
 * - Graceful fallback to PlayerAvatar with name badge when camera is off or denied.
 * - Dynamic pulsing lime halo when player is speaking.
 * - Smooth CSS transitions and responsive spotlight styling.
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

  // Track whether the stream has an active, live video track
  const [hasActiveVideo, setHasActiveVideo] = useState<boolean>(() => {
    if (!stream) return false;
    const tracks = stream.getVideoTracks();
    return tracks.some((t) => t.enabled && t.readyState === 'live');
  });

  // Monitor track state changes (camera toggled on/off, track ended, mute/unmute)
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

    const handleTrackChange = () => {
      updateActiveVideo();
    };

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

  // Persistent <video> ref attachment to srcObject without unmounting the DOM element
  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    if (stream && hasActiveVideo) {
      if (videoEl.srcObject !== stream) {
        videoEl.srcObject = stream;
      }
      const playPromise = videoEl.play?.();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {
          // Playback might be blocked without user interaction or if unmuted; handled gracefully
        });
      }
    } else {
      if (videoEl.srcObject) {
        videoEl.srcObject = null;
      }
    }
  }, [stream, hasActiveVideo]);

  // Speaking aura styling: pulsing lime halo
  const haloStyles = isSpeaking
    ? 'border-chomu-lime shadow-[0_0_20px_rgba(197,239,117,0.4)] ring-2 ring-chomu-lime/60'
    : 'border-chomu-border/80 hover:border-chomu-purple/40';

  const spotlightStyles = isSpotlight
    ? 'min-h-[260px] sm:min-h-[320px] md:min-h-[380px] shadow-2xl'
    : 'min-h-[140px] sm:min-h-[160px]';

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl bg-chomu-surface/90 border transition-all duration-500 ease-out flex items-center justify-center select-none ${haloStyles} ${spotlightStyles} ${className} ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      {/* Persistent <video> Element: Kept in DOM to prevent flickering on stream/track updates */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isLocal}
        className={`w-full h-full object-cover rounded-2xl ${
          hasActiveVideo ? 'block' : 'hidden'
        } ${isLocal ? '-scale-x-100' : ''}`}
      />

      {/* Graceful Avatar Fallback when camera is off, denied, or inactive */}
      {!hasActiveVideo && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 z-0 bg-gradient-to-b from-chomu-surface/60 via-chomu-surface to-chomu-elevated/80">
          <div className="relative mb-2">
            <PlayerAvatar
              id={player.avatar}
              size={isSpotlight ? 'xl' : 'lg'}
            />
            {isSpeaking && (
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-chomu-lime border-2 border-chomu-surface animate-ping" />
            )}
          </div>
          <span className="text-sm font-black text-chomu-text truncate max-w-[90%] text-center">
            {player.name}
          </span>
          <span className="text-[10px] text-chomu-muted flex items-center gap-1 mt-0.5">
            <VideoOff className="w-3 h-3" /> Camera off
          </span>
        </div>
      )}

      {/* Top Overlay: Spotlight & Host Badge */}
      <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none z-10">
        <div className="flex items-center gap-1.5">
          {isSpotlight && (
            <Badge variant="purple" size="sm" className="shadow-md">
              SPOTLIGHT
            </Badge>
          )}
          {player.isHost && (
            <Badge variant="yellow" size="sm" className="shadow-md">
              <Crown className="w-3 h-3 inline mr-0.5" /> HOST
            </Badge>
          )}
        </div>

        {actionSlot && <div className="pointer-events-auto">{actionSlot}</div>}
      </div>

      {/* Bottom Floating Badge: Player Name, You marker, Speaking state */}
      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between pointer-events-none z-10">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-chomu-bg/85 backdrop-blur-md border border-chomu-border/70 text-xs font-bold text-chomu-text shadow-md truncate max-w-[85%]">
          {isSpeaking ? (
            <span className="w-2 h-2 rounded-full bg-chomu-lime animate-pulse shrink-0" />
          ) : (
            <span className="w-2 h-2 rounded-full bg-chomu-muted/50 shrink-0" />
          )}
          <span className="truncate">{player.name}</span>
          {isLocal && (
            <span className="text-[10px] text-chomu-purple font-black shrink-0">
              (You)
            </span>
          )}
        </div>

        {/* Audio Level Mini Waveform / Speaking Indicator */}
        {isSpeaking && (
          <div className="flex items-center gap-1 px-2 py-1 rounded-xl bg-chomu-bg/85 backdrop-blur-md border border-chomu-lime/40 text-chomu-lime shadow-md">
            <Mic className="w-3 h-3 animate-pulse" />
            <span className="text-[10px] font-black uppercase">LIVE</span>
            {audioLevel > 0 && (
              <span
                className="w-1.5 rounded-full bg-chomu-lime transition-all duration-75"
                style={{ height: `${Math.max(6, Math.min(16, audioLevel * 20))}px` }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
