import React from 'react';
import { audioService } from '../../services/audioService';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'teal' | 'accent' | 'coral' | 'crimson' | 'danger' | 'lime' | 'secondary' | 'outline' | 'ghost';
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
    'relative inline-flex items-center justify-center font-semibold rounded-full transition-[background-color,border-color,color,transform,box-shadow] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] select-none active:translate-y-[2px] disabled:opacity-40 disabled:pointer-events-none disabled:active:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-chomu-teal focus-visible:ring-offset-2 focus-visible:ring-offset-chomu-bg min-h-[44px] min-w-[44px]';

  const variants = {
    primary:
      'bg-chomu-teal hover:bg-chomu-tealHover active:bg-chomu-tealActive text-chomu-bg font-bold border border-chomu-teal border-b-[4px] border-b-[#0E8F79] active:border-b-[2px] shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]',
    teal:
      'bg-chomu-teal hover:bg-chomu-tealHover active:bg-chomu-tealActive text-chomu-bg font-bold border border-chomu-teal border-b-[4px] border-b-[#0E8F79] active:border-b-[2px] shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]',
    accent:
      'bg-chomu-teal hover:bg-chomu-tealHover active:bg-chomu-tealActive text-chomu-bg font-bold border border-chomu-teal border-b-[4px] border-b-[#0E8F79] active:border-b-[2px] shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]',
    coral:
      'bg-chomu-coral hover:bg-chomu-coralHover active:bg-chomu-coralActive text-white font-bold border border-chomu-coral border-b-[4px] border-b-[#B83237] active:border-b-[2px] shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]',
    crimson:
      'bg-chomu-coral hover:bg-chomu-coralHover active:bg-chomu-coralActive text-white font-bold border border-chomu-coral border-b-[4px] border-b-[#B83237] active:border-b-[2px] shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]',
    danger:
      'bg-chomu-coral hover:bg-chomu-coralHover active:bg-chomu-coralActive text-white font-bold border border-chomu-coral border-b-[4px] border-b-[#B83237] active:border-b-[2px] shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]',
    lime:
      'bg-chomu-lime hover:bg-chomu-limeHover active:bg-chomu-limeActive text-chomu-bg font-bold border border-chomu-lime border-b-[4px] border-b-[#1F8A63] active:border-b-[2px] shadow-[inset_0_1px_0_rgba(255,255,255,0.38)]',
    secondary:
      'bg-chomu-elevated hover:bg-[#202C40] text-chomu-text border border-white/[0.14] border-b-[4px] border-b-[#090F1A] active:border-b-[2px] font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]',
    outline:
      'bg-chomu-surface/60 hover:bg-chomu-elevated text-chomu-text border border-white/[0.18] border-b-[4px] border-b-white/[0.1] active:border-b-[2px] font-semibold',
    ghost:
      'bg-transparent hover:bg-chomu-surface text-chomu-secondary hover:text-chomu-text font-medium active:translate-y-0',
  };

  const sizes = {
    sm: 'text-[13px] px-3.5 py-2 gap-2 min-h-[44px]',
    md: 'text-sm px-4 py-2.5 gap-2 min-h-[44px]',
    lg: 'text-sm px-5 py-3 gap-2.5 min-h-[44px]',
    xl: 'text-[15px] px-5 py-3 gap-2.5 min-h-[48px]',
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
