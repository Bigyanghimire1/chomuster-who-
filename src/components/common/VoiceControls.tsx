import React from 'react';
import { Mic, MicOff, Volume2, VolumeX, Video, VideoOff } from 'lucide-react';
import { useVoiceState, voiceManager, VoiceManager } from '../../services/voice/voiceManager';
import { audioService } from '../../services/audioService';

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
    toggleMute,
    toggleDeafen,
    toggleCamera,
    startMicrophone,
  } = useVoiceState(manager);

  const shouldShowMeter =
    showLevelMeter ?? (variant === 'dock' || variant === 'floating' || variant === 'compact');

  const handleMicClick = async () => {
    try {
      audioService.playButtonTap();
    } catch {}

    if (!isMicActive) {
      await startMicrophone();
      if (onMuteToggle) onMuteToggle(false);
    } else {
      await toggleMute();
      if (onMuteToggle) onMuteToggle(!isMuted);
    }
  };

  const handleCameraClick = async () => {
    try {
      audioService.playButtonTap();
    } catch {}

    await toggleCamera();
    if (onCameraToggle) onCameraToggle(!isCameraOn);
  };

  const handleDeafenClick = () => {
    try {
      audioService.playButtonTap();
    } catch {}

    toggleDeafen();
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
      <div className={`flex items-center gap-1 ${className}`}>
        <button
          type="button"
          onClick={handleMicClick}
          disabled={isInitializing}
          aria-label={micLabel}
          title={micLabel}
          className={`min-w-[44px] min-h-[44px] flex items-center justify-center rounded-[10px] transition-colors relative select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-chomu-purple ${
            !isMicActive
              ? 'text-chomu-secondary hover:text-chomu-text hover:bg-chomu-surface'
              : isMuted
                ? 'text-chomu-coral bg-chomu-coral/10 hover:bg-chomu-coral/15'
                : 'text-chomu-lime bg-chomu-lime/10 hover:bg-chomu-lime/15'
          }`}
        >
          {isMuted || !isMicActive ? (
            <MicOff className="w-4 h-4" strokeWidth={1.5} />
          ) : (
            <Mic className="w-4 h-4" strokeWidth={1.5} />
          )}
          {isMicActive && !isMuted && isLocalSpeaking && (
            <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-chomu-lime pointer-events-none" />
          )}
        </button>

        <button
          type="button"
          onClick={handleCameraClick}
          aria-label={isCameraOn ? 'Turn off camera' : 'Turn on camera'}
          title={isCameraOn ? 'Turn off camera' : 'Turn on camera'}
          className={`min-w-[44px] min-h-[44px] flex items-center justify-center rounded-[10px] transition-colors relative select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-chomu-purple ${
            isCameraOn
              ? 'text-chomu-cyan bg-chomu-cyan/10 hover:bg-chomu-cyan/15'
              : 'text-chomu-secondary hover:text-chomu-text hover:bg-chomu-surface'
          }`}
        >
          {isCameraOn ? (
            <Video className="w-4 h-4" strokeWidth={1.5} />
          ) : (
            <VideoOff className="w-4 h-4" strokeWidth={1.5} />
          )}
        </button>

        <button
          type="button"
          onClick={handleDeafenClick}
          aria-label={isDeafened ? 'Undeafen audio' : 'Deafen audio'}
          title={isDeafened ? 'Undeafen audio' : 'Deafen audio'}
          className={`min-w-[44px] min-h-[44px] flex items-center justify-center rounded-[10px] transition-colors select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-chomu-purple ${
            isDeafened
              ? 'text-chomu-coral bg-chomu-coral/10 hover:bg-chomu-coral/15'
              : 'text-chomu-secondary hover:text-chomu-text hover:bg-chomu-surface'
          }`}
        >
          {isDeafened ? (
            <VolumeX className="w-4 h-4" strokeWidth={1.5} />
          ) : (
            <Volume2 className="w-4 h-4" strokeWidth={1.5} />
          )}
        </button>
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-[10px] bg-chomu-surface border border-white/[0.08] text-xs font-medium text-chomu-text select-none ${className}`}
      >
        <button
          type="button"
          onClick={handleMicClick}
          className={`min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-chomu-purple ${
            isMuted || !isMicActive
              ? 'text-chomu-coral hover:bg-chomu-coral/15'
              : 'text-chomu-lime hover:bg-chomu-lime/15'
          }`}
          title={micLabel}
          aria-label={micLabel}
        >
          {isMuted || !isMicActive ? (
            <MicOff className="w-4 h-4" strokeWidth={1.5} />
          ) : (
            <Mic className="w-4 h-4" strokeWidth={1.5} />
          )}
        </button>

        <button
          type="button"
          onClick={handleCameraClick}
          className={`min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-chomu-purple ${
            isCameraOn ? 'text-chomu-cyan hover:bg-chomu-cyan/15' : 'text-chomu-secondary hover:text-chomu-text'
          }`}
          title={isCameraOn ? 'Turn off camera' : 'Turn on camera'}
          aria-label={isCameraOn ? 'Turn off camera' : 'Turn on camera'}
        >
          {isCameraOn ? (
            <Video className="w-4 h-4" strokeWidth={1.5} />
          ) : (
            <VideoOff className="w-4 h-4" strokeWidth={1.5} />
          )}
        </button>

        {shouldShowMeter && isMicActive && !isMuted && (
          <div className="flex items-center gap-0.5 h-3 px-1" title="Mic volume">
            {[0.2, 0.4, 0.7].map((threshold, idx) => {
              const active = localLevel >= threshold;
              return (
                <span
                  key={idx}
                  className={`w-0.5 rounded-full transition-colors duration-75 ${
                    active ? 'h-3 bg-chomu-lime' : 'h-1.5 bg-white/[0.12]'
                  }`}
                />
              );
            })}
          </div>
        )}

        <button
          type="button"
          onClick={handleDeafenClick}
          className={`min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-chomu-purple ${
            isDeafened ? 'text-chomu-coral hover:bg-chomu-coral/15' : 'text-chomu-secondary hover:text-chomu-text'
          }`}
          title={isDeafened ? 'Undeafen' : 'Deafen'}
          aria-label={isDeafened ? 'Undeafen' : 'Deafen'}
        >
          {isDeafened ? (
            <VolumeX className="w-4 h-4" strokeWidth={1.5} />
          ) : (
            <Volume2 className="w-4 h-4" strokeWidth={1.5} />
          )}
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
          className={`min-h-[44px] flex items-center gap-2 px-3.5 py-2 rounded-[10px] text-xs font-medium border transition-colors ${
            isMuted || !isMicActive
              ? 'bg-chomu-coral/10 text-chomu-coral border-chomu-coral/25 hover:bg-chomu-coral/15'
              : 'bg-chomu-lime/10 text-chomu-lime border-chomu-lime/25 hover:bg-chomu-lime/15'
          }`}
        >
          {isMuted || !isMicActive ? (
            <MicOff className="w-4 h-4" strokeWidth={1.5} />
          ) : (
            <Mic className="w-4 h-4" strokeWidth={1.5} />
          )}
          <span>{!isMicActive ? 'Start mic' : isMuted ? 'Unmute' : 'Mute'}</span>
        </button>

        <button
          type="button"
          onClick={handleCameraClick}
          className={`min-h-[44px] flex items-center gap-2 px-3.5 py-2 rounded-[10px] text-xs font-medium border transition-colors ${
            isCameraOn
              ? 'bg-chomu-cyan/10 text-chomu-cyan border-chomu-cyan/25 hover:bg-chomu-cyan/15'
              : 'bg-chomu-surface text-chomu-secondary hover:text-chomu-text border-white/[0.08] hover:bg-chomu-elevated'
          }`}
        >
          {isCameraOn ? (
            <Video className="w-4 h-4" strokeWidth={1.5} />
          ) : (
            <VideoOff className="w-4 h-4" strokeWidth={1.5} />
          )}
          <span>{isCameraOn ? 'Camera on' : 'Camera off'}</span>
        </button>

        <button
          type="button"
          onClick={handleDeafenClick}
          className={`min-h-[44px] flex items-center gap-2 px-3.5 py-2 rounded-[10px] text-xs font-medium border transition-colors ${
            isDeafened
              ? 'bg-chomu-coral/10 text-chomu-coral border-chomu-coral/25 hover:bg-chomu-coral/15'
              : 'bg-chomu-surface text-chomu-secondary hover:text-chomu-text border-white/[0.08] hover:bg-chomu-elevated'
          }`}
        >
          {isDeafened ? (
            <VolumeX className="w-4 h-4" strokeWidth={1.5} />
          ) : (
            <Volume2 className="w-4 h-4" strokeWidth={1.5} />
          )}
          <span>{isDeafened ? 'Undeafen' : 'Deafen'}</span>
        </button>
      </div>
    );
  }

  // Docked (non-overlapping) bottom media bar or floating fallback
  const isDock = variant === 'dock';

  return (
    <aside
      aria-label="Voice Controls HUD"
      className={
        isDock
          ? `sticky bottom-0 z-40 w-full border-t border-white/[0.08] bg-chomu-bgSecondary select-none ${className}`
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
            : 'px-3 py-2 rounded-2xl bg-chomu-surface border border-white/[0.1] shadow-[0_8px_24px_rgba(0,0,0,0.45)] flex flex-col gap-1.5'
        }
      >
        <div className="flex items-center justify-between gap-3">
          {/* Left: Audio status & level meter */}
          {shouldShowMeter && (
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    isDeafened || isMuted
                      ? 'bg-chomu-coral'
                      : isMicActive
                        ? 'bg-chomu-lime'
                        : 'bg-chomu-muted'
                  }`}
                />
                <span className="text-xs font-medium text-chomu-secondary truncate">
                  {statusText}
                </span>
                {isCameraOn && (
                  <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-chomu-cyan/10 text-chomu-cyan border border-chomu-cyan/25">
                    CAM
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1 h-3 w-10 shrink-0" aria-hidden="true">
                {[0.08, 0.2, 0.35, 0.55].map((threshold, idx) => {
                  const active =
                    !isMuted && !isDeafened && isMicActive && localLevel >= threshold;
                  return (
                    <span
                      key={idx}
                      className={`w-1 rounded-full transition-colors duration-75 ${
                        active ? 'h-3 bg-chomu-lime' : 'h-1.5 bg-white/[0.12]'
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
              className={`min-w-[44px] min-h-[44px] px-3 rounded-[10px] border text-xs font-medium inline-flex items-center justify-center gap-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-chomu-purple ${
                !isMicActive
                  ? 'bg-chomu-elevated border-white/[0.08] text-chomu-secondary hover:text-chomu-text hover:bg-[#222735]'
                  : isMuted
                    ? 'bg-chomu-coral/15 border-chomu-coral/30 text-chomu-coral hover:bg-chomu-coral/20'
                    : 'bg-chomu-lime/15 border-chomu-lime/30 text-chomu-lime hover:bg-chomu-lime/20'
              }`}
            >
              {isMuted || !isMicActive ? (
                <MicOff className="w-4 h-4 shrink-0" strokeWidth={1.5} />
              ) : (
                <Mic className="w-4 h-4 shrink-0" strokeWidth={1.5} />
              )}
              <span className="hidden sm:inline">
                {!isMicActive ? 'Mic' : isMuted ? 'Muted' : 'Mic on'}
              </span>
            </button>

            <button
              type="button"
              onClick={handleCameraClick}
              aria-label={isCameraOn ? 'Turn off camera' : 'Turn on camera'}
              title={isCameraOn ? 'Turn off camera' : 'Turn on camera'}
              className={`min-w-[44px] min-h-[44px] px-3 rounded-[10px] border text-xs font-medium inline-flex items-center justify-center gap-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-chomu-purple ${
                isCameraOn
                  ? 'bg-chomu-cyan/15 border-chomu-cyan/30 text-chomu-cyan hover:bg-chomu-cyan/20'
                  : 'bg-chomu-elevated border-white/[0.08] text-chomu-secondary hover:text-chomu-text hover:bg-[#222735]'
              }`}
            >
              {isCameraOn ? (
                <Video className="w-4 h-4 shrink-0" strokeWidth={1.5} />
              ) : (
                <VideoOff className="w-4 h-4 shrink-0" strokeWidth={1.5} />
              )}
              <span className="hidden sm:inline">
                {isCameraOn ? 'Cam on' : 'Camera'}
              </span>
            </button>

            <button
              type="button"
              onClick={handleDeafenClick}
              aria-label={isDeafened ? 'Undeafen audio' : 'Deafen audio'}
              title={isDeafened ? 'Undeafen voice audio' : 'Deafen voice audio'}
              className={`min-w-[44px] min-h-[44px] px-3 rounded-[10px] border text-xs font-medium inline-flex items-center justify-center gap-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-chomu-purple ${
                isDeafened
                  ? 'bg-chomu-coral/15 border-chomu-coral/30 text-chomu-coral hover:bg-chomu-coral/20'
                  : 'bg-chomu-elevated border-white/[0.08] text-chomu-secondary hover:text-chomu-text hover:bg-[#222735]'
              }`}
            >
              {isDeafened ? (
                <VolumeX className="w-4 h-4 shrink-0" strokeWidth={1.5} />
              ) : (
                <Volume2 className="w-4 h-4 shrink-0" strokeWidth={1.5} />
              )}
              <span className="hidden sm:inline">
                {isDeafened ? 'Deafened' : 'Audio'}
              </span>
            </button>
          </div>
        </div>

        {error && (
          <div className="px-3 py-1.5 bg-chomu-coral/10 border border-chomu-coral/25 rounded-lg text-xs text-chomu-coral">
            {error}
          </div>
        )}
      </div>
    </aside>
  );
};
