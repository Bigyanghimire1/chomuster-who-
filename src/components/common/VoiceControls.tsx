import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useVoiceState, voiceManager, VoiceManager } from '../../services/voice/voiceManager';
import { audioService } from '../../services/audioService';

/** Custom Neo-Brutalist thick-black-stroke media icons */
const MediaMicIcon: React.FC<{ off?: boolean; className?: string }> = ({
  off = false,
  className = 'w-5 h-5',
}) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <rect
      x="9"
      y="3"
      width="6"
      height="11"
      rx="3"
      fill={off ? '#FFFFFF' : '#FFDF00'}
      stroke="#050505"
      strokeWidth="2.4"
    />
    <path
      d="M5.5 11.5C5.5 15.09 8.41 18 12 18C15.59 18 18.5 15.09 18.5 11.5"
      stroke="#050505"
      strokeWidth="2.4"
      strokeLinecap="round"
    />
    <path
      d="M12 18V21M8.5 21H15.5"
      stroke="#050505"
      strokeWidth="2.4"
      strokeLinecap="round"
    />
    {off && (
      <path
        d="M4 20L20 4"
        stroke="#050505"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    )}
  </svg>
);

const MediaCamIcon: React.FC<{ off?: boolean; className?: string }> = ({
  off = false,
  className = 'w-5 h-5',
}) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <rect
      x="3"
      y="6.5"
      width="13"
      height="11"
      rx="2.5"
      fill={off ? '#FFFFFF' : '#A9E5F2'}
      stroke="#050505"
      strokeWidth="2.4"
    />
    <path
      d="M16 10L21 7.2V16.8L16 14V10Z"
      fill={off ? '#FFFFFF' : '#FFDF00'}
      stroke="#050505"
      strokeWidth="2.4"
      strokeLinejoin="round"
    />
    {off && (
      <path
        d="M4 20L20 4"
        stroke="#050505"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    )}
  </svg>
);

const MediaSpeakerIcon: React.FC<{ off?: boolean; className?: string }> = ({
  off = false,
  className = 'w-5 h-5',
}) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path
      d="M4 9.5H8L13 5V19L8 14.5H4V9.5Z"
      fill={off ? '#FFFFFF' : '#FFDF00'}
      stroke="#050505"
      strokeWidth="2.4"
      strokeLinejoin="round"
    />
    {!off ? (
      <>
        <path
          d="M16.5 8.8C17.6 9.8 18.2 10.9 18.2 12C18.2 13.1 17.6 14.2 16.5 15.2"
          stroke="#050505"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <path
          d="M19.2 6.5C20.9 8.1 21.8 10 21.8 12C21.8 14 20.9 15.9 19.2 17.5"
          stroke="#050505"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </>
    ) : (
      <path
        d="M4 20L20 4"
        stroke="#050505"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    )}
  </svg>
);

/**
 * Translate raw browser/WebKit media exceptions into concise, actionable
 * cross-device instructions while gracefully handling unknown error messages.
 */
export function formatMediaError(
  rawError: string,
  userAgent?: string,
  isSecureContext?: boolean
): string {
  const ua = userAgent ?? (typeof navigator !== 'undefined' ? navigator.userAgent : '');
  const secure =
    isSecureContext ?? (typeof window !== 'undefined' ? window.isSecureContext !== false : true);
  const lower = rawError.toLowerCase();

  if (!secure || lower.includes('securityerror') || lower.includes('https')) {
    return 'Microphone & camera require a secure HTTPS connection.';
  }

  if (/(FBAN|FBAV|Instagram|WhatsApp|Line|MicroMessenger|Snapchat)/i.test(ua)) {
    return 'In-app browser blocked mic/camera access. Open this link in Safari or Chrome to use voice and video.';
  }

  const isIOS = /iPhone|iPad|iPod/i.test(ua);
  const isIOSChrome = /CriOS/i.test(ua);
  const isPermissionError =
    lower.includes('notallowederror') ||
    lower.includes('permission') ||
    lower.includes('not allowed by the user agent') ||
    lower.includes('platform in the current context');

  if (isPermissionError) {
    if (isIOSChrome) {
      return 'Mic/camera blocked on iOS Chrome. Check iPhone Settings -> Chrome -> Microphone & Camera are enabled, allow access for this site, and tap again.';
    }
    if (isIOS) {
      return 'Mic/camera blocked on iOS. Check iPhone Settings -> Safari -> Microphone & Camera (or open in Safari) and tap Allow when prompted.';
    }
    return 'Mic/camera permission denied. Click the lock or site settings icon in your browser address bar to allow access, then try again.';
  }

  if (lower.includes('notfounderror') || lower.includes('requested device not found')) {
    return 'No microphone or camera found. Check that a device is connected and enabled.';
  }

  if (
    lower.includes('notreadableerror') ||
    lower.includes('trackstarterror') ||
    lower.includes('could not start')
  ) {
    return 'Mic or camera is busy in another app or tab. Close the other app and try again.';
  }

  return rawError;
}

export interface VoiceControlsProps {
  /** Display variant: 'dock' (non-overlapping bottom bar), 'floating', 'header', 'compact', or 'inline' */
  variant?: 'dock' | 'floating' | 'header' | 'compact' | 'inline';
  /** Optional custom class name */
  className?: string;
  /** Whether to show the real-time audio volume meter */
  showLevelMeter?: boolean;
  /** Optional custom VoiceManager instance */
  manager?: VoiceManager;
  /** Callback fired when mute is toggled */
  onMuteToggle?: (isMuted: boolean) => void;
  /** Callback fired when deafen is toggled */
  onDeafenToggle?: (isDeafened: boolean) => void;
  /** Callback fired when camera is toggled */
  onCameraToggle?: (isCameraOn: boolean) => void;
}

export const VoiceControls: React.FC<VoiceControlsProps> = ({
  variant = 'dock',
  className = '',
  showLevelMeter,
  manager = voiceManager,
  onMuteToggle,
  onDeafenToggle,
  onCameraToggle,
}) => {
  const {
    isMicActive,
    isMuted,
    isDeafened,
    isLocalSpeaking,
    localLevel,
    isInitializing,
    isCameraOn,
    error,
    playbackBlocked,
    toggleMute,
    toggleDeafen,
    toggleCamera,
    startMicrophone,
    clearError,
    resumeRemoteAudio,
  } = useVoiceState(manager);

  const shouldShowMeter =
    showLevelMeter ?? (variant === 'dock' || variant === 'floating' || variant === 'compact');

  const dockRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (variant !== 'dock' || typeof document === 'undefined') return;
    const el = dockRef.current;
    if (!el) return;

    const updateHeight = () => {
      const rect = el.getBoundingClientRect();
      document.documentElement.style.setProperty(
        '--voice-dock-height',
        `${Math.ceil(rect.height)}px`
      );
    };

    updateHeight();

    let observer: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(updateHeight);
      observer.observe(el);
    }
    window.addEventListener('resize', updateHeight);

    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', updateHeight);
      document.documentElement.style.setProperty('--voice-dock-height', '0px');
    };
  }, [variant, playbackBlocked, error]);

  const handleMicClick = async () => {
    // Call startMicrophone immediately inside click gesture without prior AudioContext sound playback
    // so strict mobile engines (iOS Safari/Chrome WKWebView) preserve transient user activation.
    if (!isMicActive) {
      const stream = await startMicrophone();
      if (stream && onMuteToggle) onMuteToggle(false);
    } else {
      try {
        audioService.playButtonTap();
      } catch {}
      await toggleMute();
      if (onMuteToggle) onMuteToggle(!isMuted);
    }
  };

  const handleCameraClick = async () => {
    if (isCameraOn) {
      try {
        audioService.playButtonTap();
      } catch {}
    }

    await toggleCamera();
    if (onCameraToggle) {
      onCameraToggle(manager.getState().isCameraOn);
    }
  };

  const handleDeafenClick = () => {
    try {
      audioService.playButtonTap();
    } catch {}

    toggleDeafen();
    if (isDeafened) {
      resumeRemoteAudio().catch(() => {});
    }
    if (onDeafenToggle) onDeafenToggle(!isDeafened);
  };

  const micLabel = !isMicActive
    ? 'Start microphone'
    : isMuted
      ? 'Unmute microphone'
      : 'Mute microphone';

  const statusText = isDeafened
    ? 'Deafened'
    : isMuted
      ? 'Muted'
      : !isMicActive
        ? 'Mic off'
        : isLocalSpeaking
          ? 'Speaking'
          : 'Live';

  // Header variant
  if (variant === 'header') {
    return (
      <div className={`flex items-center gap-1.5 ${className}`}>
        <button
          type="button"
          onClick={handleMicClick}
          disabled={isInitializing}
          aria-label={micLabel}
          title={micLabel}
          className={`min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl border-2 border-[#050505] shadow-[0_2px_0_#050505] active:translate-y-[1px] active:shadow-none transition-all select-none focus:outline-none ${
            !isMicActive || isMuted
              ? 'bg-[#FFF9CC] text-[#050505] hover:bg-[#FFDF00]'
              : 'bg-[#64E987] text-[#050505] hover:bg-[#52D975]'
          }`}
        >
          <MediaMicIcon off={isMuted || !isMicActive} className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={handleCameraClick}
          aria-label={isCameraOn ? 'Turn off camera' : 'Turn on camera'}
          title={isCameraOn ? 'Turn off camera' : 'Turn on camera'}
          className={`min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl border-2 border-[#050505] shadow-[0_2px_0_#050505] active:translate-y-[1px] active:shadow-none transition-all select-none focus:outline-none ${
            isCameraOn
              ? 'bg-[#64E987] text-[#050505] hover:bg-[#52D975]'
              : 'bg-white text-[#050505] hover:bg-[#FFF9CC]'
          }`}
        >
          <MediaCamIcon off={!isCameraOn} className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={handleDeafenClick}
          aria-label={isDeafened ? 'Undeafen audio' : 'Deafen audio'}
          title={isDeafened ? 'Undeafen audio' : 'Deafen audio'}
          className={`min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl border-2 border-[#050505] shadow-[0_2px_0_#050505] active:translate-y-[1px] active:shadow-none transition-all select-none focus:outline-none ${
            isDeafened
              ? 'bg-[#FF5D73] text-[#050505]'
              : 'bg-white text-[#050505] hover:bg-[#FFF9CC]'
          }`}
        >
          <MediaSpeakerIcon off={isDeafened} className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-2xl bg-white border-2 border-[#050505] shadow-[0_3px_0_#050505] text-xs font-extrabold text-[#050505] select-none ${className}`}
      >
        <button
          type="button"
          onClick={handleMicClick}
          className={`min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl border-2 border-[#050505] transition-all focus:outline-none ${
            isMuted || !isMicActive
              ? 'bg-[#FFF9CC] hover:bg-[#FFDF00]'
              : 'bg-[#64E987] hover:bg-[#52D975]'
          }`}
          title={micLabel}
          aria-label={micLabel}
        >
          <MediaMicIcon off={isMuted || !isMicActive} className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={handleCameraClick}
          className={`min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl border-2 border-[#050505] transition-all focus:outline-none ${
            isCameraOn ? 'bg-[#64E987] hover:bg-[#52D975]' : 'bg-[#F5F6F8] hover:bg-[#FFF9CC]'
          }`}
          title={isCameraOn ? 'Turn off camera' : 'Turn on camera'}
          aria-label={isCameraOn ? 'Turn off camera' : 'Turn on camera'}
        >
          <MediaCamIcon off={!isCameraOn} className="w-4 h-4" />
        </button>

        {shouldShowMeter && isMicActive && !isMuted && (
          <div className="flex items-center gap-0.5 h-3 px-1" title="Mic volume">
            {[0.2, 0.4, 0.7].map((threshold, idx) => {
              const active = localLevel >= threshold;
              return (
                <span
                  key={idx}
                  className={`w-1 rounded-full transition-colors duration-75 ${
                    active ? 'h-3 bg-[#64E987] border border-[#050505]' : 'h-1.5 bg-[#C6C9D1]'
                  }`}
                />
              );
            })}
          </div>
        )}

        <button
          type="button"
          onClick={handleDeafenClick}
          className={`min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl border-2 border-[#050505] transition-all focus:outline-none ${
            isDeafened ? 'bg-[#FF5D73]' : 'bg-[#F5F6F8] hover:bg-[#FFF9CC]'
          }`}
          title={isDeafened ? 'Undeafen' : 'Deafen'}
          aria-label={isDeafened ? 'Undeafen' : 'Deafen'}
        >
          <MediaSpeakerIcon off={isDeafened} className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // Inline variant
  if (variant === 'inline') {
    return (
      <div className={`flex flex-wrap items-center gap-2 ${className}`}>
        <button
          type="button"
          onClick={handleMicClick}
          className={`min-h-[44px] flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-extrabold border-2 border-[#050505] shadow-[0_3px_0_#050505] active:translate-y-[1px] active:shadow-none transition-all ${
            isMuted || !isMicActive
              ? 'bg-[#FFF9CC] text-[#050505] hover:bg-[#FFDF00]'
              : 'bg-[#64E987] text-[#050505] hover:bg-[#52D975]'
          }`}
        >
          <MediaMicIcon off={isMuted || !isMicActive} className="w-4 h-4" />
          <span>{!isMicActive ? 'Start mic' : isMuted ? 'Unmute' : 'Mute'}</span>
        </button>

        <button
          type="button"
          onClick={handleCameraClick}
          className={`min-h-[44px] flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-extrabold border-2 border-[#050505] shadow-[0_3px_0_#050505] active:translate-y-[1px] active:shadow-none transition-all ${
            isCameraOn
              ? 'bg-[#64E987] text-[#050505] hover:bg-[#52D975]'
              : 'bg-white text-[#050505] hover:bg-[#FFF9CC]'
          }`}
        >
          <MediaCamIcon off={!isCameraOn} className="w-4 h-4" />
          <span>{isCameraOn ? 'Camera on' : 'Camera off'}</span>
        </button>

        <button
          type="button"
          onClick={handleDeafenClick}
          className={`min-h-[44px] flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-extrabold border-2 border-[#050505] shadow-[0_3px_0_#050505] active:translate-y-[1px] active:shadow-none transition-all ${
            isDeafened
              ? 'bg-[#FF5D73] text-[#050505]'
              : 'bg-white text-[#050505] hover:bg-[#FFF9CC]'
          }`}
        >
          <MediaSpeakerIcon off={isDeafened} className="w-4 h-4" />
          <span>{isDeafened ? 'Undeafen' : 'Deafen'}</span>
        </button>
      </div>
    );
  }

  // Docked (non-overlapping) bottom media bar or floating fallback
  const isDock = variant === 'dock';

  return (
    <aside
      ref={isDock ? dockRef : undefined}
      aria-label="Voice Controls HUD"
      className={
        isDock
          ? `sticky bottom-0 z-40 w-full border-t-[2.5px] border-[#050505] bg-white select-none ${className}`
          : `fixed bottom-4 left-1/2 -translate-x-1/2 z-50 select-none ${className}`
      }
      style={{
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <div
        className={
          isDock
            ? 'max-w-6xl mx-auto px-4 sm:px-6 py-2.5 flex flex-col gap-1.5'
            : 'px-3 py-2 rounded-2xl bg-white border-[2.5px] border-[#050505] shadow-[0_4px_0_#050505] flex flex-col gap-1.5'
        }
      >
        <div className="flex items-center justify-between gap-3">
          {/* Left: Audio status & level meter */}
          {shouldShowMeter && (
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="px-2.5 py-0.5 rounded-full bg-[#F5F6F8] border-2 border-[#050505] text-[11px] font-extrabold text-[#050505] truncate">
                {statusText}
              </span>
              {isCameraOn && (
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#A9E5F2] text-[#050505] border-2 border-[#050505]">
                  CAM
                </span>
              )}

              <div className="flex items-center gap-1 h-3 w-10 shrink-0" aria-hidden="true">
                {[0.08, 0.2, 0.35, 0.55].map((threshold, idx) => {
                  const active =
                    !isMuted && !isDeafened && isMicActive && localLevel >= threshold;
                  return (
                    <span
                      key={idx}
                      className={`w-1 rounded-full transition-colors duration-75 ${
                        active ? 'h-3 bg-[#64E987] border border-[#050505]' : 'h-1.5 bg-[#C6C9D1]'
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Right: Mic, Camera, Deafen controls */}
          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={handleMicClick}
              disabled={isInitializing}
              aria-label={micLabel}
              title={micLabel}
              className={`min-w-[44px] min-h-[44px] px-3.5 rounded-full border-2 border-[#050505] shadow-[0_3px_0_#050505] active:translate-y-[2px] active:shadow-none text-xs font-extrabold inline-flex items-center justify-center gap-1.5 transition-all focus:outline-none ${
                !isMicActive || isMuted
                  ? 'bg-[#FFF9CC] text-[#050505] hover:bg-[#FFDF00]'
                  : 'bg-[#64E987] text-[#050505] hover:bg-[#52D975]'
              }`}
            >
              <MediaMicIcon off={isMuted || !isMicActive} className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">
                {!isMicActive ? 'Mic' : isMuted ? 'Muted' : 'Mic on'}
              </span>
            </button>

            <button
              type="button"
              onClick={handleCameraClick}
              aria-label={isCameraOn ? 'Turn off camera' : 'Turn on camera'}
              title={isCameraOn ? 'Turn off camera' : 'Turn on camera'}
              className={`min-w-[44px] min-h-[44px] px-3.5 rounded-full border-2 border-[#050505] shadow-[0_3px_0_#050505] active:translate-y-[2px] active:shadow-none text-xs font-extrabold inline-flex items-center justify-center gap-1.5 transition-all focus:outline-none ${
                isCameraOn
                  ? 'bg-[#64E987] text-[#050505] hover:bg-[#52D975]'
                  : 'bg-[#F5F6F8] text-[#050505] hover:bg-[#FFF9CC]'
              }`}
            >
              <MediaCamIcon off={!isCameraOn} className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">
                {isCameraOn ? 'Cam on' : 'Camera'}
              </span>
            </button>

            <button
              type="button"
              onClick={handleDeafenClick}
              aria-label={isDeafened ? 'Undeafen audio' : 'Deafen audio'}
              title={isDeafened ? 'Undeafen voice audio' : 'Deafen voice audio'}
              className={`min-w-[44px] min-h-[44px] px-3.5 rounded-full border-2 border-[#050505] shadow-[0_3px_0_#050505] active:translate-y-[2px] active:shadow-none text-xs font-extrabold inline-flex items-center justify-center gap-1.5 transition-all focus:outline-none ${
                isDeafened
                  ? 'bg-[#FF5D73] text-[#050505]'
                  : 'bg-[#F5F6F8] text-[#050505] hover:bg-[#FFF9CC]'
              }`}
            >
              <MediaSpeakerIcon off={isDeafened} className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">
                {isDeafened ? 'Deafened' : 'Audio'}
              </span>
            </button>
          </div>
        </div>

        {playbackBlocked && !isDeafened && (
          <button
            type="button"
            onClick={() => {
              resumeRemoteAudio().catch(() => {});
            }}
            className="w-full flex items-center justify-between gap-2 px-3 py-2 bg-[#FFDF00] hover:bg-[#F2D300] border-2 border-[#050505] rounded-xl text-xs font-extrabold text-[#050505] transition-colors text-left"
          >
            <span>Browser paused incoming voice audio — tap here to unmute teammates</span>
            <MediaSpeakerIcon off={false} className="w-4 h-4 shrink-0" />
          </button>
        )}

        {error && (
          <div
            role="alert"
            className="flex items-start justify-between gap-2 px-3 py-2 bg-chomu-coral/10 border border-chomu-coral/25 rounded-lg text-xs text-chomu-coral leading-snug"
          >
            <span>{formatMediaError(error)}</span>
            <button
              type="button"
              onClick={clearError}
              aria-label="Dismiss error"
              className="shrink-0 p-0.5 rounded hover:bg-chomu-coral/15 text-chomu-coral/80 hover:text-chomu-coral transition-colors"
            >
              <X className="w-3.5 h-3.5" strokeWidth={1.75} />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
