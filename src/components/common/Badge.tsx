import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?:
    | 'lime'
    | 'coral'
    | 'purple'
    | 'cyan'
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
    lime: 'bg-chomu-lime/10 text-chomu-lime border-chomu-lime/25',
    coral: 'bg-chomu-coral/10 text-chomu-coral border-chomu-coral/25',
    purple: 'bg-chomu-purple/10 text-chomu-purple border-chomu-purple/25',
    cyan: 'bg-chomu-cyan/10 text-chomu-cyan border-chomu-cyan/25',
    yellow: 'bg-chomu-yellow/10 text-chomu-yellow border-chomu-yellow/25',
    muted: 'bg-chomu-elevated text-chomu-secondary border-white/[0.08]',
    // Aliases
    emerald: 'bg-chomu-lime/10 text-chomu-lime border-chomu-lime/25',
    crimson: 'bg-chomu-coral/10 text-chomu-coral border-chomu-coral/25',
    indigo: 'bg-chomu-purple/10 text-chomu-purple border-chomu-purple/25',
    success: 'bg-chomu-lime/10 text-chomu-lime border-chomu-lime/25',
    danger: 'bg-chomu-coral/10 text-chomu-coral border-chomu-coral/25',
    warning: 'bg-chomu-yellow/10 text-chomu-yellow border-chomu-yellow/25',
    info: 'bg-chomu-cyan/10 text-chomu-cyan border-chomu-cyan/25',
  };

  const sizes = {
    sm: 'text-xs px-2 py-0.5 leading-4',
    md: 'text-xs px-2.5 py-1 leading-4',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full border ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </span>
  );
};
