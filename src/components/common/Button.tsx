import React from 'react';
import { audioService } from '../../services/audioService';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'accent' | 'coral' | 'crimson' | 'danger' | 'lime' | 'secondary' | 'outline' | 'ghost';
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
    'relative inline-flex items-center justify-center font-medium rounded-[10px] transition-[background-color,border-color,color,transform] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] select-none active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none disabled:active:scale-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-chomu-purple focus-visible:ring-offset-2 focus-visible:ring-offset-chomu-bg min-h-[44px] min-w-[44px]';

  const variants = {
    primary:
      'bg-chomu-text hover:bg-white active:bg-[#DDE1EC] text-chomu-bg font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] border border-transparent',
    accent:
      'bg-chomu-purple hover:bg-chomu-purpleHover active:bg-chomu-purpleActive text-chomu-bg font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] border border-transparent',
    coral:
      'bg-chomu-coral hover:bg-chomu-coralHover active:bg-chomu-coralActive text-chomu-bg font-semibold border border-transparent',
    crimson:
      'bg-chomu-coral hover:bg-chomu-coralHover active:bg-chomu-coralActive text-chomu-bg font-semibold border border-transparent',
    danger:
      'bg-chomu-coral hover:bg-chomu-coralHover active:bg-chomu-coralActive text-chomu-bg font-semibold border border-transparent',
    lime:
      'bg-chomu-lime hover:bg-chomu-limeHover active:bg-chomu-limeActive text-chomu-bg font-semibold border border-transparent',
    secondary:
      'bg-chomu-elevated hover:bg-[#222735] text-chomu-text border border-white/[0.08] font-medium',
    outline:
      'bg-transparent hover:bg-chomu-elevated text-chomu-text border border-white/[0.12] font-medium',
    ghost:
      'bg-transparent hover:bg-chomu-surface text-chomu-secondary hover:text-chomu-text font-medium',
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
