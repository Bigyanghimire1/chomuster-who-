import React from 'react';
import { audioService } from '../../services/audioService';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | 'primary'
    | 'pink'
    | 'teal'
    | 'accent'
    | 'coral'
    | 'crimson'
    | 'danger'
    | 'lime'
    | 'dark'
    | 'secondary'
    | 'outline'
    | 'ghost';
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
    'relative inline-flex items-center justify-center font-extrabold tracking-[-0.01em] rounded-2xl transition-[background-color,transform,box-shadow] duration-100 select-none active:translate-y-[3px] active:shadow-[0_1px_0_#050505] disabled:bg-[#C6C9D1] disabled:text-[#050505]/50 disabled:border-[#050505]/40 disabled:shadow-none disabled:pointer-events-none disabled:translate-y-[2px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#050505] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFDF00] min-h-[44px] min-w-[44px]';

  const variants = {
    primary:
      'bg-[#64E987] hover:bg-[#4DDA73] active:bg-[#3BC962] text-[#050505] border-[2.5px] border-[#050505] shadow-[0_4px_0_#050505]',
    pink:
      'bg-[#F28BCB] hover:bg-[#EB74BD] active:bg-[#E05CAD] text-[#050505] border-[2.5px] border-[#050505] shadow-[0_4px_0_#050505]',
    teal:
      'bg-[#64E987] hover:bg-[#4DDA73] active:bg-[#3BC962] text-[#050505] border-[2.5px] border-[#050505] shadow-[0_4px_0_#050505]',
    accent:
      'bg-[#F28BCB] hover:bg-[#EB74BD] active:bg-[#E05CAD] text-[#050505] border-[2.5px] border-[#050505] shadow-[0_4px_0_#050505]',
    coral:
      'bg-[#FF5D73] hover:bg-[#F5465F] active:bg-[#E3324B] text-[#050505] border-[2.5px] border-[#050505] shadow-[0_4px_0_#050505]',
    crimson:
      'bg-[#FF5D73] hover:bg-[#F5465F] active:bg-[#E3324B] text-[#050505] border-[2.5px] border-[#050505] shadow-[0_4px_0_#050505]',
    danger:
      'bg-[#FF5D73] hover:bg-[#F5465F] active:bg-[#E3324B] text-[#050505] border-[2.5px] border-[#050505] shadow-[0_4px_0_#050505]',
    lime:
      'bg-[#64E987] hover:bg-[#4DDA73] active:bg-[#3BC962] text-[#050505] border-[2.5px] border-[#050505] shadow-[0_4px_0_#050505]',
    dark:
      'bg-[#050505] hover:bg-[#1E1E22] active:bg-[#2A2A30] text-white border-[2.5px] border-[#050505] shadow-[0_4px_0_#050505]',
    secondary:
      'bg-white hover:bg-[#FFF9CC] text-[#050505] border-[2.5px] border-[#050505] shadow-[0_4px_0_#050505]',
    outline:
      'bg-white hover:bg-[#FFF9CC] text-[#050505] border-[2.5px] border-[#050505] shadow-[0_4px_0_#050505]',
    ghost:
      'bg-transparent hover:bg-black/10 text-[#050505] font-bold active:translate-y-0 active:shadow-none',
  };

  const sizes = {
    sm: 'text-[13px] px-3.5 py-2 gap-2 min-h-[44px]',
    md: 'text-sm px-4 py-2.5 gap-2 min-h-[44px]',
    lg: 'text-base px-5 py-3 gap-2.5 min-h-[48px]',
    xl: 'text-lg px-6 py-3.5 gap-2.5 min-h-[54px]',
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
