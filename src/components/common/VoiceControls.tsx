import React from 'react';
import { Mic, MicOff, Volume2, VolumeX, Video, VideoOff } from 'lucide-react';
import { useVoiceState, voiceManager, VoiceManager } from '../../services/voice/voiceManager';
import { audioService } from '../../services/audioService';

export interface VoiceControlsProps {
  /** Display variant: 'floating' HUD, 'header' icons, 'compact' pill, or 'inline' */
  variant?: 'floating' | 'header' | 'compact' | 'inline';
  /** Optional custom class name */
  className?: string;
  /** Whether to show the real-time audio volume meter (default: true for floating, false for header) */
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
  variant = 'floating',
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

  const shouldShowMeter = showLevelMeter ?? (variant === 'floating' || variant === 'compact');

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

  // Header variant — perfectly styled to fit inside App Header alongside other navigation icon buttons
  if (variant === 'header') {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        {/* Mic Toggle */}
        <button
          type="button"
          onClick={handleMicClick}
          disabled={isInitializing}
          aria-label={
            !isMicActive ? 'Start Microphone' : isMuted ? 'Unmute Microphone' : 'Mute Microphone'
          }
          title={
            !isMicActive
              ? 'Connect Microphone'
              : isMuted
                ? 'Unmute Mic'
                : 'Mute Mic'
          }
          className={`min-w-[44px] min-h-[44px] flex items-center justify-center p-2.5 rounded-xl transition-all relative group select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-chomu-purple ${
            !isMicActive
              ? 'text-chomu-muted hover:text-chomu-text hover:bg-chomu-surface'
              : isMuted
                ? 'text-chomu-coral bg-chomu-coral/10 hover:bg-chomu-coral/20'
                : 'text-chomu-lime bg-chomu-lime/10 hover:bg-chomu-lime/20'
          }`}
        >
          {isMuted || !isMicActive ? (
            <MicOff className="w-4 h-4" />
          ) : (
            <Mic className="w-4 h-4" />
          )}

          {/* Active Speaking Indicator dot */}
          {isMicActive && !isMuted && isLocalSpeaking && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-chomu-lime animate-ping pointer-events-none" />
          )}
        </button>

        {/* Camera Toggle */}
        <button
          type="button"
          onClick={handleCameraClick}
          aria-label={isCameraOn ? 'Turn Off Camera' : 'Turn On Camera'}
          title={isCameraOn ? 'Turn Off Camera' : 'Turn On Camera'}
          className={`min-w-[44px] min-h-[44px] flex items-center justify-center p-2.5 rounded-xl transition-all relative group select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-chomu-purple ${
            isCameraOn
              ? 'text-chomu-cyan bg-chomu-cyan/15 hover:bg-chomu-cyan/25'
              : 'text-chomu-muted hover:text-chomu-text hover:bg-chomu-surface'
          }`}
        >
          {isCameraOn ? (
            <Video className="w-4 h-4" />
          ) : (
            <VideoOff className="w-4 h-4" />
          )}

          {/* Active camera dot indicator */}
          {isCameraOn && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-chomu-cyan animate-pulse pointer-events-none" />
          )}
        </button>

        {/* Deafen Toggle */}
        <button
          type="button"
          onClick={handleDeafenClick}
          aria-label={isDeafened ? 'Undeafen Audio' : 'Deafen Audio'}
          title={isDeafened ? 'Undeafen Voice' : 'Deafen Voice'}
          className={`min-w-[44px] min-h-[44px] flex items-center justify-center p-2.5 rounded-xl transition-all relative group select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-chomu-purple ${
            isDeafened
              ? 'text-chomu-coral bg-chomu-coral/10 hover:bg-chomu-coral/20'
              : 'text-chomu-muted hover:text-chomu-text hover:bg-chomu-surface'
          }`}
        >
          {isDeafened ? (
            <VolumeX className="w-4 h-4 text-chomu-coral" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
        </button>
      </div>
    );
  }

  // Compact variant — inline badge or card header
  if (variant === 'compact') {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-chomu-surface/90 border border-chomu-border/70 backdrop-blur-sm text-xs font-medium text-chomu-text select-none ${className}`}
      >
        <button
          type="button"
          onClick={handleMicClick}
          className={`min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-chomu-purple ${
            isMuted || !isMicActive
              ? 'text-chomu-coral hover:bg-chomu-coral/20'
              : 'text-chomu-lime hover:bg-chomu-lime/20'
          }`}
          title={isMuted ? 'Unmute' : 'Mute'}
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted || !isMicActive ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
        </button>

        {/* Camera Toggle */}
        <button
          type="button"
          onClick={handleCameraClick}
          className={`min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-chomu-purple ${
            isCameraOn
              ? 'text-chomu-cyan hover:bg-chomu-cyan/20'
              : 'text-chomu-muted hover:text-chomu-text'
          }`}
          title={isCameraOn ? 'Turn Off Camera' : 'Turn On Camera'}
          aria-label={isCameraOn ? 'Turn Off Camera' : 'Turn On Camera'}
        >
          {isCameraOn ? <Video className="w-3.5 h-3.5" /> : <VideoOff className="w-3.5 h-3.5" />}
        </button>

        {shouldShowMeter && isMicActive && !isMuted && (
          <div className="flex items-center gap-0.5 h-3 px-1" title="Mic Volume">
            {[0.2, 0.4, 0.7].map((threshold, idx) => {
              const active = localLevel >= threshold;
              return (
                <span
                  key={idx}
                  className={`w-0.5 rounded-full transition-all duration-75 ${
                    active ? 'h-3 bg-chomu-lime' : 'h-1.5 bg-chomu-border'
                  }`}
                />
              );
            })}
          </div>
        )}

        <button
          type="button"
          onClick={handleDeafenClick}
          className={`min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-chomu-purple ${
            isDeafened ? 'text-chomu-coral hover:bg-chomu-coral/20' : 'text-chomu-muted hover:text-chomu-text'
          }`}
          title={isDeafened ? 'Undeafen' : 'Deafen'}
          aria-label={isDeafened ? 'Undeafen' : 'Deafen'}
        >
          {isDeafened ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
        </button>
      </div>
    );
  }

  // Inline variant
  if (variant === 'inline') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <button
          type="button"
          onClick={handleMicClick}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
            isMuted || !isMicActive
              ? 'bg-chomu-coral/15 text-chomu-coral border border-chomu-coral/30 hover:bg-chomu-coral/25'
              : 'bg-chomu-lime/15 text-chomu-lime border border-chomu-lime/30 hover:bg-chomu-lime/25'
          }`}
        >
          {isMuted || !isMicActive ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          <span>{!isMicActive ? 'Start Mic' : isMuted ? 'Unmute' : 'Mute'}</span>
        </button>

        {/* Camera Toggle */}
        <button
          type="button"
          onClick={handleCameraClick}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
            isCameraOn
              ? 'bg-chomu-cyan/15 text-chomu-cyan border border-chomu-cyan/30 hover:bg-chomu-cyan/25'
              : 'bg-chomu-surface text-chomu-muted hover:text-chomu-text border border-chomu-border hover:bg-chomu-elevated'
          }`}
        >
          {isCameraOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
          <span>{isCameraOn ? 'Camera On' : 'Camera Off'}</span>
        </button>

        <button
          type="button"
          onClick={handleDeafenClick}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
            isDeafened
              ? 'bg-chomu-coral/15 text-chomu-coral border border-chomu-coral/30 hover:bg-chomu-coral/25'
              : 'bg-chomu-surface text-chomu-muted hover:text-chomu-text border border-chomu-border hover:bg-chomu-elevated'
          }`}
        >
          {isDeafened ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          <span>{isDeafened ? 'Undeafen' : 'Deafen'}</span>
        </button>
      </div>
    );
  }

  // Default: 'floating' HUD bar — modern bottom-centered pill
  return (
    <aside
      aria-label="Voice Controls HUD"
      className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-50 transition-all select-none ${className}`}
      style={{
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <div className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-chomu-surface/90 border border-chomu-border/80 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
        {/* Mic Toggle Button */}
        <button
          type="button"
          onClick={handleMicClick}
          disabled={isInitializing}
          aria-label={
            !isMicActive ? 'Start Microphone' : isMuted ? 'Unmute Microphone' : 'Mute Microphone'
          }
          className={`relative w-11 h-11 min-w-[44px] min-h-[44px] rounded-full transition-all flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-chomu-purple ${
            !isMicActive
              ? 'bg-chomu-elevated text-chomu-muted hover:text-chomu-text hover:bg-chomu-border'
              : isMuted
                ? 'bg-chomu-coral/20 text-chomu-coral hover:bg-chomu-coral/30 ring-1 ring-chomu-coral/40'
                : 'bg-chomu-lime/20 text-chomu-lime hover:bg-chomu-lime/30 ring-1 ring-chomu-lime/40'
          }`}
          title={
            !isMicActive
              ? 'Enable Microphone'
              : isMuted
                ? 'Unmute Microphone'
                : 'Mute Microphone'
          }
        >
          {isMuted || !isMicActive ? (
            <MicOff className="w-4 h-4" />
          ) : (
            <Mic className="w-4 h-4" />
          )}

          {/* Pulse ring on speaking */}
          {isMicActive && !isMuted && isLocalSpeaking && (
            <span
              className="absolute inset-0 rounded-full border-2 border-chomu-lime animate-ping opacity-75 pointer-events-none"
              style={{
                animationDuration: '1.2s',
              }}
            />
          )}
        </button>

        {/* Camera Toggle Button */}
        <button
          type="button"
          onClick={handleCameraClick}
          aria-label={isCameraOn ? 'Turn Off Camera' : 'Turn On Camera'}
          className={`relative w-11 h-11 min-w-[44px] min-h-[44px] rounded-full transition-all flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-chomu-purple ${
            isCameraOn
              ? 'bg-chomu-cyan/20 text-chomu-cyan hover:bg-chomu-cyan/30 ring-1 ring-chomu-cyan/40 shadow-[0_0_10px_rgba(104,217,231,0.3)]'
              : 'bg-chomu-elevated text-chomu-muted hover:text-chomu-text hover:bg-chomu-border'
          }`}
          title={isCameraOn ? 'Turn Off Camera' : 'Turn On Camera'}
        >
          {isCameraOn ? (
            <Video className="w-4 h-4" />
          ) : (
            <VideoOff className="w-4 h-4" />
          )}

          {/* Active camera status indicator dot */}
          {isCameraOn && (
            <span
              className="absolute top-1 right-1 w-2 h-2 rounded-full bg-chomu-cyan animate-pulse pointer-events-none shadow-[0_0_6px_rgba(104,217,231,0.8)]"
            />
          )}
        </button>

        {/* Real-time Level Meter & Status text */}
        {shouldShowMeter && (
          <div className="flex flex-col justify-center px-1.5 min-w-[54px]">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-chomu-muted">
                {isDeafened
                  ? 'Deafened'
                  : isMuted
                    ? 'Muted'
                    : !isMicActive
                      ? 'Mic Off'
                      : isLocalSpeaking
                        ? 'Speaking'
                        : 'Connected'}
              </span>
              {isCameraOn && (
                <span className="text-[9px] px-1 py-0.2 rounded bg-chomu-cyan/20 text-chomu-cyan font-semibold tracking-tight">
                  CAM
                </span>
              )}
            </div>

            {/* Visualizer bars */}
            <div className="flex items-center gap-1 h-2">
              {[0.08, 0.2, 0.35, 0.55].map((threshold, idx) => {
                const active = !isMuted && !isDeafened && isMicActive && localLevel >= threshold;
                return (
                  <span
                    key={idx}
                    className={`flex-1 rounded-full transition-all duration-75 ${
                      active
                        ? 'h-2 bg-chomu-lime shadow-[0_0_6px_rgba(197,239,117,0.8)]'
                        : 'h-1 bg-chomu-border/60'
                    }`}
                  />
                );
              })}
            </div>
          </div>
        )}

        <div className="w-[1px] h-5 bg-chomu-border/60 mx-0.5" />

        {/* Deafen Toggle Button */}
        <button
          type="button"
          onClick={handleDeafenClick}
          aria-label={isDeafened ? 'Undeafen Audio' : 'Deafen Audio'}
          className={`w-11 h-11 min-w-[44px] min-h-[44px] rounded-full transition-all flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-chomu-purple ${
            isDeafened
              ? 'bg-chomu-coral/20 text-chomu-coral hover:bg-chomu-coral/30 ring-1 ring-chomu-coral/40'
              : 'bg-chomu-elevated text-chomu-muted hover:text-chomu-text hover:bg-chomu-border'
          }`}
          title={isDeafened ? 'Undeafen Voice Audio' : 'Deafen Voice Audio'}
        >
          {isDeafened ? (
            <VolumeX className="w-4 h-4 text-chomu-coral" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Permission or hardware error warning */}
      {error && (
        <div className="mt-1 px-3 py-1 bg-chomu-coral/20 border border-chomu-coral/40 rounded-lg text-center text-[11px] text-chomu-coral animate-fade-in">
          {error}
        </div>
      )}
    </aside>
  );
};
