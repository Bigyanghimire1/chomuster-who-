import React from 'react';
import { PlayerAvatar } from '../illustrations/PlayerAvatar';
import { PlayerAvatarId } from '../../types/game';

export interface SpeakingIndicatorProps {
  /** Whether speech is currently detected for this player */
  isSpeaking: boolean;
  /** Real-time audio level between 0.0 and 1.0 to scale waveform */
  audioLevel?: number;
  /** Size matching PlayerAvatar ('sm' | 'md' | 'lg' | 'xl', default: 'md') */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Visual style: 'ring', 'waveform', or 'both' */
  variant?: 'ring' | 'waveform' | 'both';
  /** Accent ring color: 'lime' (default) | 'cyan' | 'purple' | 'coral' or custom CSS color string */
  ringColor?: 'lime' | 'cyan' | 'purple' | 'coral' | string;
  /** Convenience: directly render PlayerAvatar by passing avatarId */
  avatarId?: PlayerAvatarId | string;
  /** Imposter style styling for PlayerAvatar if avatarId is passed */
  isImposterStyle?: boolean;
  /** Children element to wrap */
  children?: React.ReactNode;
  /** Additional CSS class names */
  className?: string;
  /** Position of the waveform badge (default: 'bottom-right') */
  waveformPosition?: 'bottom-right' | 'bottom-center' | 'top-right';
}

const sizeDimensions: Record<string, { width: string; ringRadius: string }> = {
  sm: { width: 'w-7 h-7', ringRadius: 'rounded-lg' },
  md: { width: 'w-10 h-10', ringRadius: 'rounded-xl' },
  lg: { width: 'w-14 h-14', ringRadius: 'rounded-xl' },
  xl: { width: 'w-20 h-20', ringRadius: 'rounded-2xl' },
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

  const getColorStyles = () => {
    switch (ringColor) {
      case 'cyan':
        return { border: 'border-chomu-cyan', barBg: 'bg-chomu-cyan' };
      case 'purple':
        return { border: 'border-chomu-purple', barBg: 'bg-chomu-purple' };
      case 'coral':
        return { border: 'border-chomu-coral', barBg: 'bg-chomu-coral' };
      case 'lime':
      default:
        return { border: 'border-chomu-lime', barBg: 'bg-chomu-lime' };
    }
  };

  const { border, barBg } = getColorStyles();
  const clampedLevel = Math.max(0, Math.min(1, audioLevel));

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
      {/* Crisp active speaking border ring */}
      {showRing && isSpeaking && (
        <div
          className={`absolute -inset-1 ${sizeConfig.ringRadius} border-2 ${border} pointer-events-none transition-opacity duration-150`}
        />
      )}

      {/* Avatar Content */}
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        {children ? (
          children
        ) : avatarId ? (
          <PlayerAvatar id={avatarId} size={size} isImposterStyle={isImposterStyle} />
        ) : null}
      </div>

      {/* Mini Equalizer Waveform */}
      {showWaveform && isSpeaking && (
        <div
          className={`absolute ${getPositionClasses()} z-20 flex items-end gap-0.5 px-1 py-0.5 bg-chomu-surface border border-white/[0.12] rounded-md pointer-events-none select-none`}
        >
          {[0.6, 1.0, 0.75].map((multiplier, idx) => {
            const barHeight = Math.max(4, Math.round(12 * Math.max(0.25, clampedLevel * multiplier)));
            return (
              <span
                key={idx}
                className={`w-1 rounded-full ${barBg} transition-[height] duration-75`}
                style={{ height: `${barHeight}px` }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
