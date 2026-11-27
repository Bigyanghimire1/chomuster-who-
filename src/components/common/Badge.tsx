import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?:
    | 'lime'
    | 'mint'
    | 'pink'
    | 'coral'
    | 'purple'
    | 'cyan'
    | 'sky'
    | 'yellow'
    | 'muted'
    | 'emerald'
    | 'crimson'
    | 'indigo'
    | 'success'
    | 'danger'
    | 'warning'
    | 'info';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'purple',
  size = 'md',
  className = '',
}) => {
  const variants = {
    lime: 'bg-[#64E987] text-[#050505] border-[#050505]',
    mint: 'bg-[#64E987] text-[#050505] border-[#050505]',
    pink: 'bg-[#F28BCB] text-[#050505] border-[#050505]',
    coral: 'bg-[#FF5D73] text-[#050505] border-[#050505]',
    purple: 'bg-[#B68AF2] text-[#050505] border-[#050505]',
    cyan: 'bg-[#A9E5F2] text-[#050505] border-[#050505]',
    sky: 'bg-[#A9E5F2] text-[#050505] border-[#050505]',
    yellow: 'bg-[#FFDF00] text-[#050505] border-[#050505]',
    muted: 'bg-[#F5F6F8] text-[#050505] border-[#050505]',
    // Aliases
    emerald: 'bg-[#64E987] text-[#050505] border-[#050505]',
    crimson: 'bg-[#FF5D73] text-[#050505] border-[#050505]',
    indigo: 'bg-[#B68AF2] text-[#050505] border-[#050505]',
    success: 'bg-[#64E987] text-[#050505] border-[#050505]',
    danger: 'bg-[#FF5D73] text-[#050505] border-[#050505]',
    warning: 'bg-[#FFDF00] text-[#050505] border-[#050505]',
    info: 'bg-[#A9E5F2] text-[#050505] border-[#050505]',
  };

  const sizes = {
    sm: 'text-xs px-2.5 py-0.5 leading-4',
    md: 'text-xs px-3 py-1 leading-4',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-extrabold rounded-full border-2 shadow-[0_2px_0_#050505] ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </span>
  );
};
