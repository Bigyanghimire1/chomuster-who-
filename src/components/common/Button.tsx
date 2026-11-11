import React from 'react';
import { audioService } from '../../services/audioService';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'coral' | 'crimson' | 'lime' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = '',
  onClick,
  disabled,
  ...props
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      audioService.playButtonTap();
      if (onClick) onClick(e);
    }
  };

  const baseStyles =
    'relative inline-flex items-center justify-center font-black rounded-2xl transition-all duration-150 select-none active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none disabled:active:scale-100 focus:outline-none tracking-tight';

  const variants = {
    // Primary: Permanently filled, high-contrast vibrant purple button
    primary:
      'bg-chomu-purple hover:bg-[#8363f8] active:bg-[#7252ea] text-chomu-bg shadow-lg shadow-chomu-purple/25 border-0',
    // Coral / Crimson: For imposter highlights or destructive actions
    coral:
      'bg-chomu-coral hover:bg-[#f25878] active:bg-[#e44666] text-chomu-bg shadow-lg shadow-chomu-coral/25 border-0',
    crimson:
      'bg-chomu-coral hover:bg-[#f25878] active:bg-[#e44666] text-chomu-bg shadow-lg shadow-chomu-coral/25 border-0',
    // Lime: Positive actions or civilian highlights
    lime:
      'bg-chomu-lime hover:bg-[#b6e264] active:bg-[#a6d453] text-chomu-bg shadow-lg shadow-chomu-lime/25 border-0',
    // Secondary: Elevated card button
    secondary:
      'bg-chomu-elevated hover:bg-chomu-border text-chomu-text border border-chomu-border font-bold',
    // Outline
    outline:
      'bg-transparent hover:bg-chomu-elevated text-chomu-text border border-chomu-border font-bold',
    // Ghost
    ghost:
      'bg-transparent hover:bg-chomu-surface text-chomu-muted hover:text-chomu-text font-bold',
  };

  const sizes = {
    sm: 'text-xs px-3.5 py-2 gap-1.5 min-h-[36px]',
    md: 'text-sm px-4 py-2.5 gap-2 min-h-[44px]',
    lg: 'text-sm px-5 py-3 gap-2 font-bold min-h-[48px]',
    xl: 'text-base px-6 py-3.5 gap-2.5 min-h-[52px]',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      onClick={handleClick}
      disabled={disabled}
      {...props}
    >
      {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
      <span>{children}</span>
      {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
    </button>
  );
};
