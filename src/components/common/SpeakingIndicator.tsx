import React from 'react';
import { PlayerAvatar } from '../illustrations/PlayerAvatar';
import { PlayerAvatarId } from '../../types/game';

export interface SpeakingIndicatorProps {
  /** Whether speech is currently detected for this player */
  isSpeaking: boolean;
  /** Real-time audio level between 0.0 and 1.0 to dynamically scale pulse & waveform */
  audioLevel?: number;
  /** Size matching PlayerAvatar ('sm' | 'md' | 'lg' | 'xl', default: 'md') */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Visual style: 'ring' (glowing halo), 'waveform' (mini audio visualizer bars), or 'both' */
  variant?: 'ring' | 'waveform' | 'both';
  /** Accent glow color: 'lime' (default) | 'cyan' | 'purple' | 'coral' or custom CSS color string */
  ringColor?: 'lime' | 'cyan' | 'purple' | 'coral' | string;
  /** Convenience: directly render PlayerAvatar by passing avatarId */
  avatarId?: PlayerAvatarId | string;
  /** Imposter style styling for PlayerAvatar if avatarId is passed */
  isImposterStyle?: boolean;
  /** Children element to wrap (e.g. PlayerAvatar or custom avatar) */
  children?: React.ReactNode;
  /** Additional CSS class names on the container wrapper */
  className?: string;
  /** Position of the waveform badge (default: 'bottom-right') */
  waveformPosition?: 'bottom-right' | 'bottom-center' | 'top-right';
}

const sizeDimensions: Record<string, { width: string; ringRadius: string; barH: string }> = {
  sm: { width: 'w-7 h-7', ringRadius: 'rounded-xl', barH: 'h-2' },
  md: { width: 'w-10 h-10', ringRadius: 'rounded-2xl', barH: 'h-3' },
  lg: { width: 'w-14 h-14', ringRadius: 'rounded-2xl', barH: 'h-3.5' },
  xl: { width: 'w-20 h-20', ringRadius: 'rounded-3xl', barH: 'h-4' },
};

export const SpeakingIndicator: React.FC<SpeakingIndicatorProps> = ({
  isSpeaking,
  audioLevel = 0,
  size = 'md',
  variant = 'ring',
  ringColor = 'lime',
  avatarId,
  isImposterStyle = false,
  children,
  className = '',
  waveformPosition = 'bottom-right',
}) => {
  const sizeConfig = sizeDimensions[size] || sizeDimensions.md;

  // Determine glow and border color styling
  const getColorStyles = () => {
    switch (ringColor) {
      case 'cyan':
        return {
          border: 'border-chomu-cyan',
          shadow: 'rgba(104, 217, 231, 0.75)',
          barBg: 'bg-chomu-cyan',
        };
      case 'purple':
        return {
          border: 'border-chomu-purple',
          shadow: 'rgba(146, 117, 255, 0.75)',
          barBg: 'bg-chomu-purple',
        };
      case 'coral':
        return {
          border: 'border-chomu-coral',
          shadow: 'rgba(255, 105, 135, 0.75)',
          barBg: 'bg-chomu-coral',
        };
      case 'lime':
      default:
        return {
          border: 'border-chomu-lime',
          shadow: 'rgba(197, 239, 117, 0.75)',
          barBg: 'bg-chomu-lime',
        };
    }
  };

  const { border, shadow, barBg } = getColorStyles();

  // Dynamic glow calculation based on live audioLevel (0.0 - 1.0)
  const clampedLevel = Math.max(0, Math.min(1, audioLevel));
  const glowSpread = isSpeaking ? 6 + clampedLevel * 14 : 0;
  const pulseScale = isSpeaking ? 1 + clampedLevel * 0.08 : 1;

  const showRing = variant === 'ring' || variant === 'both';
  const showWaveform = variant === 'waveform' || variant === 'both';

  const getPositionClasses = () => {
    switch (waveformPosition) {
      case 'bottom-center':
        return 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/3';
      case 'top-right':
        return 'top-0 right-0 translate-x-1/4 -translate-y-1/4';
      case 'bottom-right':
      default:
        return 'bottom-0 right-0 translate-x-1/6 translate-y-1/6';
    }
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${sizeConfig.width} ${className}`}
    >
      {/* Outer pulsing ring halo overlay */}
      {showRing && isSpeaking && (
        <>
          {/* Ambient animated ping aura */}
          <div
            className={`absolute -inset-1 ${sizeConfig.ringRadius} border-2 ${border} pointer-events-none animate-ping opacity-60`}
            style={{ animationDuration: '1.4s' }}
          />

          {/* Core dynamic glowing ring */}
          <div
            className={`absolute -inset-1 ${sizeConfig.ringRadius} border-2 ${border} pointer-events-none transition-transform duration-75`}
            style={{
              transform: `scale(${pulseScale})`,
              boxShadow: `0 0 ${glowSpread}px ${shadow}, inset 0 0 ${glowSpread / 2}px ${shadow}`,
            }}
          />
        </>
      )}

      {/* Avatar Content: either passed children or generated PlayerAvatar */}
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        {children ? (
          children
        ) : avatarId ? (
          <PlayerAvatar id={avatarId} size={size} isImposterStyle={isImposterStyle} />
        ) : null}
      </div>

      {/* Mini Equalizer Waveform overlay */}
      {showWaveform && isSpeaking && (
        <div
          className={`absolute ${getPositionClasses()} z-20 flex items-end gap-0.5 px-1 py-0.5 bg-chomu-surface/95 border border-chomu-border/80 rounded-md shadow-lg pointer-events-none select-none`}
        >
          {/* 3 bouncing bars based on audio level */}
          {[0.6, 1.0, 0.75].map((multiplier, idx) => {
            const barHeight = Math.max(3, Math.round(14 * Math.max(0.2, clampedLevel * multiplier)));
            return (
              <span
                key={idx}
                className={`w-1 rounded-full ${barBg} transition-all duration-75`}
                style={{
                  height: `${barHeight}px`,
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
